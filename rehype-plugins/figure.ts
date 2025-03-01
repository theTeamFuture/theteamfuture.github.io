import type { Element, Root } from "hast";
import type { Transformer } from "unified";
import { visit } from "unist-util-visit";

// Export plugin
export default function rehypeFigure(): Transformer<Root> {
  return (tree: Root): void => {
    visit(tree, { tagName: "p" }, (node: Element, index?: number): void => {
      const figures: Element[] = node.children
        .filter((el: any): boolean => el.tagName === "img")
        .map((el: any): Element => {
          const figure: Element = {
            type: "element",
            tagName: "figure",
            properties: {},
            children: [el],
          };

          if (
            typeof el.properties.alt === "string" &&
            el.properties.alt.trim().length > 0
          ) {
            figure.children.push({
              type: "element",
              tagName: "figcaption",
              properties: {},
              children: [
                {
                  type: "text",
                  value: el.properties.alt.trim(),
                },
              ],
            });
          }

          return figure;
        });

      if (figures.length === 0) {
        return;
      }

      tree.children[index!] =
        figures.length === 1
          ? figures[0]
          : {
              type: "element",
              tagName: "div",
              properties: {
                class: "figures-container",
              },
              children: figures,
            };
    });
  };
}
