import type { Root } from "mdast";
import { visit } from "unist-util-visit";

// Export plugin
export default function remarkRuby() {
  return (tree: Root) =>
    visit(tree, "textDirective", (node) => {
      if (node.name === "ruby") {
        const data = node.data || (node.data = {});
        const attrs = node.attributes || (node.attributes = {});

        if (!attrs.id) {
          throw Error("ruby id not found");
        }

        data.hName = "ruby";
        data.hProperties = { className: ["remark-ruby"] };
        node.children = [
          ...node.children,
          {
            type: "textDirective",
            name: "__ruby-rp-l",
            data: { hName: "rp" },
            children: [{ type: "text", value: "(" }],
          },
          {
            type: "textDirective",
            name: "__ruby-rt",
            data: { hName: "rt" },
            children: [{ type: "text", value: attrs.id }],
          },
          {
            type: "textDirective",
            name: "__ruby-rp-r",
            data: { hName: "rp" },
            children: [{ type: "text", value: ")" }],
          },
        ];
      }
    });
}
