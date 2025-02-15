import type { Root } from "mdast";
import type { Transformer } from "unified";
import type { VFile } from "vfile";
import { countWords } from "alfaaz";
import { toString } from "mdast-util-to-string";

// Export plugin
export default function remarkWordCounter(): Transformer<Root> {
  return (tree: Root, file: VFile): void => {
    const raw: string = toString(tree);
    file.data.astro!.frontmatter!.word_count = countWords(raw);
  };
}
