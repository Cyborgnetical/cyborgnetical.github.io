import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import matter from "gray-matter";
import type { Loader } from "astro/loaders";
import { z } from "astro/zod";

export const notesSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	order: z.number().optional(),
});

interface RawNote {
	/** Path relative to the repo/fallback root, e.g. "guides/git/branching-strategy.md" */
	path: string;
	content: string;
}

export interface GithubNotesLoaderOptions {
	/** "<owner>/<repo>" on GitHub to pull notes from during the build. */
	repo: string;
	/** Branch to read from. Defaults to the repo's default branch. */
	branch?: string;
	/** Local directory (relative to the project root) used when the remote repo can't be reached. */
	fallbackDir: string;
}

const GITHUB_API = "https://api.github.com";

async function fetchFromGithub(
	repo: string,
	branch: string | undefined,
	headers: Record<string, string>,
): Promise<RawNote[]> {
	let ref = branch;
	if (!ref) {
		const repoRes = await fetch(`${GITHUB_API}/repos/${repo}`, { headers });
		if (!repoRes.ok) {
			throw new Error(`GitHub API returned ${repoRes.status} for repos/${repo}`);
		}
		const repoJson = (await repoRes.json()) as { default_branch?: string };
		ref = repoJson.default_branch ?? "main";
	}

	const treeRes = await fetch(`${GITHUB_API}/repos/${repo}/git/trees/${ref}?recursive=1`, { headers });
	if (!treeRes.ok) {
		throw new Error(`GitHub API returned ${treeRes.status} for git/trees/${ref}`);
	}
	const treeJson = (await treeRes.json()) as { tree?: { path: string; type: string }[] };

	const mdFiles = (treeJson.tree ?? []).filter(
		(entry) => entry.type === "blob" && entry.path.toLowerCase().endsWith(".md"),
	);

	return Promise.all(
		mdFiles.map(async (file) => {
			const rawRes = await fetch(`https://raw.githubusercontent.com/${repo}/${ref}/${file.path}`, { headers });
			if (!rawRes.ok) {
				throw new Error(`Failed to download ${file.path} (${rawRes.status})`);
			}
			return { path: file.path, content: await rawRes.text() };
		}),
	);
}

async function fetchFromLocal(dir: string): Promise<RawNote[]> {
	const notes: RawNote[] = [];

	async function walk(current: string, relative: string) {
		const entries = await readdir(current, { withFileTypes: true });
		for (const entry of entries) {
			const entryPath = path.join(current, entry.name);
			const relPath = relative ? `${relative}/${entry.name}` : entry.name;
			if (entry.isDirectory()) {
				await walk(entryPath, relPath);
			} else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
				notes.push({ path: relPath, content: await readFile(entryPath, "utf-8") });
			}
		}
	}

	await walk(dir, "");
	return notes;
}

function deriveTitleFromContent(content: string): string | undefined {
	return content.match(/^#\s+(.+)$/m)?.[1]?.trim();
}

function deriveTitleFromPath(id: string): string {
	const base = id.split("/").pop() ?? id;
	return base.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Loads markdown notes from a GitHub repo at build time, preserving nested folder
 * structure via each file's path. Falls back to a local directory (e.g. when the
 * repo is private/unreachable, or offline) so the site keeps building.
 */
export function githubNotesLoader(options: GithubNotesLoaderOptions): Loader {
	const { repo, branch, fallbackDir } = options;

	return {
		name: "github-notes-loader",
		schema: notesSchema,
		load: async ({ store, logger, parseData, generateDigest, renderMarkdown, config }) => {
			const token = process.env.GITHUB_NOTES_TOKEN ?? process.env.GITHUB_TOKEN;
			const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
			if (token) headers.Authorization = `Bearer ${token}`;

			let notes: RawNote[] | null = null;
			let source: "github" | "local" = "local";

			try {
				notes = await fetchFromGithub(repo, branch, headers);
				source = "github";
			} catch (error) {
				logger.warn(
					`Could not fetch notes from github.com/${repo}: ${(error as Error).message}. Falling back to local notes in ${fallbackDir}.`,
				);
			}

			if (!notes || notes.length === 0) {
				const localDir = fileURLToPath(new URL(fallbackDir, config.root));
				notes = await fetchFromLocal(localDir);
				source = "local";
			}

			logger.info(
				`Loaded ${notes.length} note(s) from ${source === "github" ? `github.com/${repo}` : "local fallback"}`,
			);

			store.clear();

			for (const note of notes) {
				const id = note.path.replace(/\.md$/i, "");
				const { data: frontmatter, content } = matter(note.content);
				const title = frontmatter.title ?? deriveTitleFromContent(content) ?? deriveTitleFromPath(id);

				const parsedData = await parseData({ id, data: { ...frontmatter, title } });
				const rendered = await renderMarkdown(content);
				const digest = generateDigest(note.content);

				store.set({ id, data: parsedData, body: content, rendered, digest });
			}
		},
	};
}
