import type { Root } from "mdast";
import type { VFile } from "vfile";
import { countWords } from "alfaaz";
import { toString } from "mdast-util-to-string";

// Export plugin
export default function remarkWordCount() {
  return (tree: Root, vfile: VFile) => {
    const rawText = toString(tree);
    const wordCount = countWords(rawText);

    Object.assign(vfile.data.astro?.frontmatter ?? {}, { wordCount });
  };
}
