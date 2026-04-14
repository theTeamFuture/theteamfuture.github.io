import type { Root } from "mdast";
import type { VFile } from "vfile";
import { visit } from "unist-util-visit";

// Export plugin
export default function remarkHeading() {
  return (tree: Root, vfile: VFile) => {
    const skip = !!vfile.data.astro?.frontmatter?.noAdjustHeadings;
    if (skip) return;

    let min = Number.MAX_SAFE_INTEGER;
    visit(tree, "heading", (node) => {
      if (node.depth < min) {
        min = node.depth;
      }
    });

    const delta = 2 - min;
    visit(tree, "heading", (node) => {
      const newDep = node.depth + delta;
      if (newDep > 6) {
        node.depth = 6;
      } else if (newDep < 1) {
        node.depth = 2;
      } else {
        node.depth = newDep as typeof node.depth;
      }
    });
  };
}
