import type { ImageMetadata } from "astro";
import { getCollection } from "astro:content";
import fs from "node:fs";
import path from "node:path";

// --- Get posts ---
export const posts = (await getCollection("posts")).sort(
  (a, b) => b.data.published_at.getTime() - a.data.published_at.getTime(),
);

// --- Get puzzles ---
export const puzzles = (await getCollection("puzzles")).sort(
  (a, b) => b.data.published_at.getTime() - a.data.published_at.getTime(),
);

// --- Get avatars ---
export const avatars = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/avatars/*",
);

// --- Generate meta data for build ---
if (import.meta.env.PROD) {
  const postIdSlugMap = posts.reduce(
    (prev, { data, filePath }) => {
      prev[path.basename(filePath!)] = data.slug;
      return prev;
    },
    <Record<string, string>>{},
  );
  const puzzleIdSlugMap = puzzles.reduce(
    (prev, { data, filePath }) => {
      prev[path.basename(filePath!)] = data.slug;
      return prev;
    },
    <Record<string, string>>{},
  );

  fs.writeFileSync(
    "local.meta.json",
    JSON.stringify({ post: postIdSlugMap, puzzle: puzzleIdSlugMap }),
  );
}
