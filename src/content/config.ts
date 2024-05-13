/// Content collection config
import { defineCollection, reference, z } from 'astro:content';

// Define collections
const authorCollection = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string().min(1),
    intro: z.string().optional(),
    urls: z
      .array(
        z.object({
          name: z.string().min(1),
          url: z.string().url()
        })
      )
      .optional()
  })
});

const postCollection = defineCollection({
  type: 'content',
  schema: z.object({
    author: reference('authors'),
    title: z.string().min(1),
    excerpt: z.string().min(1),
    published_at: z.date(),
    tags: z.array(z.string().min(1)).optional()
  })
});

// Export config
export const collections = {
  authors: authorCollection,
  posts: postCollection
};
