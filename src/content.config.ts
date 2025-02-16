import { glob } from "astro/loaders";
import { defineCollection, reference, z } from "astro:content";

// Collections
const authors = defineCollection({
  loader: glob({ pattern: "**/[^_]*.yaml", base: "contents/authors" }),
  schema: z.object({
    name: z.string().min(1),
    intro: z.string().optional(),
    avatar: z.string().min(1),
    urls: z
      .array(
        z.object({
          name: z.string().min(1),
          url: z.string().url(),
        })
      )
      .optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "contents/posts" }),
  schema: z.object({
    author: reference("authors"),
    title: z.string().min(1),
    excerpt: z.string().min(1),
    slug: z.string().min(1),
    published_at: z.date(),
    tags: z.array(z.string().min(1)).optional(),
  }),
});

const puzzles = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "contents/puzzles" }),
  schema: z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    published_at: z.date(),
    report: z
      .string()
      .regex(/^\/posts\/.*/)
      .optional(),
  }),
});

// Export collections
export const collections = { authors, posts, puzzles };
