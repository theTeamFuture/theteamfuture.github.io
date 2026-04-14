import type { Root } from "mdast";
import { visit } from "unist-util-visit";

// Export plugin
export default function remarkCollapse() {
  return (tree: Root) =>
    visit(tree, "containerDirective", (node) => {
      if (node.name === "collapse") {
        const data = node.data || (node.data = {});
        const attr = node.attributes || (node.attributes = {});

        if (attr.id && attr.id !== "open") {
          throw Error("collapse id can only be 'open'");
        }

        data.hName = "details";
        data.hProperties = {
          className: ["remark-collapse"],
          open: attr.id === "open",
          name: attr.name,
        };
        if (
          node.children[0]?.type === "paragraph" &&
          node.children[0]?.data?.directiveLabel
        ) {
          const data = node.children[0].data || (node.children[0].data = {});
          data.hName = "summary";
        }
      }
    });
}
