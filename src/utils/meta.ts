/// Meta module
import type { ImageMetadata } from 'astro';
import fs from 'fs';
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

// Generate meta data for build
if (import.meta.env.PROD) {
  const idSlugMap: Record<string, string> = posts.reduce(
    (prev: Record<string, string>, { id, slug }): Record<string, string> => {
      prev[id] = slug;
      return prev;
    },
    {}
  );

  fs.writeFileSync('meta.json', JSON.stringify(idSlugMap));
}
