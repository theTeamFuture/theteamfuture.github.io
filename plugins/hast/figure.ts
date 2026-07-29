import { defineHastPlugin } from "satteri";

// --- Export plugin ---
export default () =>
  defineHastPlugin({
    name: "figure",
    element: [
      {
        filter: ["img"],
        visit(node) {
          return {
            type: "element",
            tagName: "figure",
            properties: {},
            children: [
              node,
              {
                type: "element",
                tagName: "figcaption",
                properties: {},
                children: [
                  {
                    type: "text",
                    value: node.properties.alt?.trim() ?? "",
                  },
                ],
              },
            ],
          };
        },
      },
    ],
  });
