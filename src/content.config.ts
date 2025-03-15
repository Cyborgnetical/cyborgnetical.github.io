// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

// 2. Import loader(s)
import { glob, file } from 'astro/loaders';

// 3. Define your collection(s)
const Notes = defineCollection({ 
    loader: glob({ base: "./src/content/notes", pattern: '**/*.{md,mdx}' }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        unit: z.number()
    })
});
/*
const Blog = defineCollection({ 
    loader: glob({ pattern: "/*.md", base: "./src/content/blog" }),
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
    })
});*/
console.log("hi")
console.log(Notes)

// 4. Export a single `collections` object to register your collection(s)
export const collections = { Notes /**Blog */ };