/// Meta module
import type { ImageMetadata } from 'astro';
import { getCollection } from 'astro:content';

// Get posts
export const posts = await getCollection('posts');
posts.sort(
  (a, b): number =>
    b.data.published_at.getTime() - a.data.published_at.getTime()
);

// Get avatars
export const avatars = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/avatars/*'
);
