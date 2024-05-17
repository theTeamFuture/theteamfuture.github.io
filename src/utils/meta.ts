/// Meta module
import { getCollection } from 'astro:content';

// Get posts
export const posts = await getCollection('posts');
posts.sort(
  (a, b): number =>
    b.data.published_at.getTime() - a.data.published_at.getTime()
);
