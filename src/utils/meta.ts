/// Meta module
import type { ImageMetadata } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import fs from 'fs';

// Get posts
export const posts: CollectionEntry<'posts'>[] = (
  await getCollection('posts')
).sort(
  (a: CollectionEntry<'posts'>, b: CollectionEntry<'posts'>): number =>
    b.data.published_at.getTime() - a.data.published_at.getTime()
);

// Get puzzles
export const puzzles: CollectionEntry<'puzzles'>[] = (
  await getCollection('puzzles')
).sort(
  (a: CollectionEntry<'puzzles'>, b: CollectionEntry<'puzzles'>): number =>
    b.data.published_at.getTime() - a.data.published_at.getTime()
);

// Get avatars
export const avatars: Record<
  string,
  () => Promise<{ default: ImageMetadata }>
> = import.meta.glob<{ default: ImageMetadata }>('/src/assets/avatars/*');

// Generate meta data for build
if (import.meta.env.PROD) {
  const postIdSlugMap: Record<string, string> = posts.reduce(
    (
      prev: Record<string, string>,
      { id, slug }: CollectionEntry<'posts'>
    ): Record<string, string> => {
      prev[id] = slug;
      return prev;
    },
    {}
  );
  const puzzleIdSlugMap: Record<string, string> = puzzles.reduce(
    (
      prev: Record<string, string>,
      { id, slug }: CollectionEntry<'puzzles'>
    ): Record<string, string> => {
      prev[id] = slug;
      return prev;
    },
    {}
  );

  fs.writeFileSync(
    'meta.json',
    JSON.stringify({ post: postIdSlugMap, puzzle: puzzleIdSlugMap })
  );
}
