import type { Root } from "mdast";
import { visit } from "unist-util-visit";

// Options
interface Options {
  title?: string;
}

// Export plugin
export default function remarkSpoiler({
  title = "你知道的太多了",
}: Options = {}) {
  return (tree: Root) =>
    visit(tree, ["containerDirective", "textDirective"] as const, (node) => {
      if (node.name !== "spoiler") return;
      const data = node.data || (node.data = {});
      const attr = node.attributes || (node.attributes = {});

      data.hProperties = {
        className: ["remark-spoiler"],
        title: attr.id ?? title,
      };
      if (node.type === "containerDirective") {
        data.hName = "div";
      }
      if (node.type === "textDirective") {
        data.hName = "span";
        node.children = [
          {
            type: "textDirective",
            name: "__spoiler",
            data: { hName: "span" },
            children: node.children,
          },
        ];
      }
    });
}
