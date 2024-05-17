/// Remark content length intergration
import { toString } from 'mdast-util-to-string';

// Export intergration
export default () =>
  (tree: any, data: any): void => {
    const rawText: string = toString(tree);
    data.data.astro.frontmatter.content_length = rawText.length;
  };
