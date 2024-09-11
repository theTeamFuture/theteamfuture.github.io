/// Content length remark plugin
import type { Root } from 'hast';
import { countWords } from 'alfaaz';
import { toString } from 'mdast-util-to-string';

// Export plugin
export default function remarkContentLength() {
  return (tree: Root, file: any): void => {
    const rawText: string = toString(tree);
    file.data.astro.frontmatter.content_length = countWords(rawText);
  };
}
