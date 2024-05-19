/// Remark spoiler plugin
import { visit } from 'unist-util-visit';

// Export plugin
export default () =>
  (tree: any): void => {
    visit(
      tree,
      'text',
      (node: any, index: number | undefined, parent: any): void => {
        const regex: RegExp = /\|\|(.*?)\|\|/g;

        // Go through text
        let match: RegExpExecArray | null = null;
        let lastIndex: number = 0;
        while ((match = regex.exec(node.value)) !== null) {
          // Append element to parent
          parent.children.splice(
            index! + lastIndex,
            1,
            {
              type: 'text',
              value: node.value.slice(lastIndex, match.index)
            },
            { type: 'html', value: '<span class="spoiler">' },
            { type: 'text', value: match[1] },
            { type: 'html', value: '</span>' }
          );

          // Update last index
          lastIndex = match.index + match[0].length;
        }

        // Add last text slice
        if (lastIndex < node.value.length) {
          parent.children.splice(index! + lastIndex, 1, {
            type: 'text',
            value: node.value.slice(lastIndex)
          });
        }
      }
    );
  };
