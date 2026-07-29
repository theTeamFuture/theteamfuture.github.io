import { defineHastPlugin } from "satteri";

// --- Types ---
export interface PluginOptions {
  base?: string;
}

// --- Export plugin ---
export default ({ base = "http://localhost" }: PluginOptions = {}) => {
  const hostname = new URL(base).hostname;
  return defineHastPlugin({
    name: "external-link",
    element: [
      {
        filter: ["a"],
        visit(node, ctx) {
          const href = node.properties.href;
          const target = node.properties.target;
          if (!href || typeof href !== "string") return;
          if (target) return;

          try {
            const url = new URL(href, base);

            if (!["http:", "https:"].includes(url.protocol)) return;
            if (url.hostname === hostname) return;

            ctx.setProperty(node, "target", "_blank");
            ctx.setProperty(node, "rel", "noopener noreferer nofollow");
          } catch {
            return;
          }
        },
      },
    ],
  });
};
