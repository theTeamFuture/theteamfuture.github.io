import type { Element, Root } from "hast";
import type { Transformer } from "unified";
import { visit } from "unist-util-visit";

// Export plugin
export default function rehypeFigure(): Transformer<Root> {
  return (tree: Root): void => {
    visit(tree, "img", (node: Element, index?: number): void => {
      const figure: Element = {
        type: "element",
        tagName: "figure",
        properties: {},
        children: [node],
      };

      if (
        typeof node.properties.alt === "string" &&
        node.properties.alt.trim().length > 0
      ) {
        figure.children.push({
          type: "element",
          tagName: "figcaption",
          properties: {},
          children: [
            {
              type: "text",
              value: node.properties.alt.trim(),
            },
          ],
        });
      }

      tree.children[index!] = figure;
    });
  };
}
