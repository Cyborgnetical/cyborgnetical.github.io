import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { githubNotesLoader, notesSchema } from "./lib/githubNotesLoader";

const notes = defineCollection({
	loader: githubNotesLoader({
		repo: "Cyborgnetical/Notes",
		fallbackDir: "src/content/notes/",
	}),
	schema: notesSchema,
});

const blog = defineCollection({
	loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		description: z.string().optional(),
	}),
});

export const collections = { notes, blog };
