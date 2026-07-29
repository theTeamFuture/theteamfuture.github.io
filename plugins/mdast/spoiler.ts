import { defineMdastPlugin } from "satteri";

// --- Options ---
export interface Options {
  title?: string;
}

// --- Export plugin ---
export default ({ title }: Options = {}) =>
  defineMdastPlugin({
    name: "spoiler",
    containerDirective(node, ctx) {
      if (node.name !== "spoiler") return;
      ctx.setProperty(node, "data", {
        hName: "div",
        hProperties: {
          className: ["spoiler"],
          title: node.attributes?.id ?? title,
        },
      });
    },
    textDirective(node, ctx) {
      if (node.name !== "spoiler") return;
      ctx.replaceNode(node, {
        type: "textDirective",
        name: "__spoiler",
        data: {
          hName: "span",
          hProperties: {
            className: ["spoiler"],
            title: node.attributes?.id ?? title,
          },
        },
        children: [
          {
            type: "textDirective",
            name: "__spoiler",
            data: { hName: "span" },
            children: node.children,
          },
        ],
      });
    },
  });
