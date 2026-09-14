export interface NoteTreeFile {
	type: "file";
	name: string;
	slug: string;
	title: string;
	order?: number;
}

export interface NoteTreeFolder {
	type: "folder";
	name: string;
	path: string;
	children: NoteTreeNode[];
}

export type NoteTreeNode = NoteTreeFile | NoteTreeFolder;

interface NoteEntry {
	id: string;
	data: {
		title: string;
		order?: number;
	};
}

function sortTree(children: NoteTreeNode[]) {
	children.sort((a, b) => {
		if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
		const orderA = a.type === "file" ? (a.order ?? Infinity) : Infinity;
		const orderB = b.type === "file" ? (b.order ?? Infinity) : Infinity;
		if (orderA !== orderB) return orderA - orderB;
		return a.name.localeCompare(b.name);
	});
	for (const child of children) {
		if (child.type === "folder") sortTree(child.children);
	}
}

/** Turns a flat list of note entries (ids like "guides/git/branching") into a nested tree. */
export function buildNotesTree(entries: NoteEntry[]): NoteTreeNode[] {
	const root: NoteTreeNode[] = [];

	for (const entry of entries) {
		const segments = entry.id.split("/");
		let children = root;

		for (let i = 0; i < segments.length - 1; i++) {
			const segment = segments[i];
			const folderPath = segments.slice(0, i + 1).join("/");
			let folder = children.find(
				(child): child is NoteTreeFolder => child.type === "folder" && child.name === segment,
			);
			if (!folder) {
				folder = { type: "folder", name: segment, path: folderPath, children: [] };
				children.push(folder);
			}
			children = folder.children;
		}

		const name = segments[segments.length - 1];
		children.push({ type: "file", name, slug: entry.id, title: entry.data.title, order: entry.data.order });
	}

	sortTree(root);
	return root;
}
