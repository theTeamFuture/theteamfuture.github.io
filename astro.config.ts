import { defineConfig } from "astro/config";
import { resolve } from "node:path";
import moment from "moment";

// Integrations
import htmlMinify from "./integrations/html-minify";
import icon from "astro-icon";
import mountAssets from "./integrations/mount-assets";

// Rehype plugins
import rehypeElementWrapper from "./rehype-plugins/element-wrapper";
import rehypeExternalLinks from "rehype-external-links";
import rehypeFigure from "./rehype-plugins/figure";
import rehypeKatex from "rehype-katex";

// Remark plugins
import remarkExtendedTable from "remark-extended-table";
import remarkMath from "remark-math";
import remarkSpoiler from "./remark-plugins/spoiler";
import remarkWordCounter from "./remark-plugins/word-counter";

// Vite plugins
import font from "vite-plugin-font";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  integrations: [htmlMinify(), icon(), mountAssets()],
  markdown: {
    rehypePlugins: [
      [
        rehypeElementWrapper,
        { selector: "table", wrapper: "div.table-wrapper" },
      ],
      [
        rehypeExternalLinks,
        {
          protocols: ["http", "https", "mailto"],
          rel: ["noopener", "noreferer"],
          target: "_blank",
        },
      ],
      rehypeFigure,
      [rehypeKatex, { output: "html" }],
    ],
    remarkPlugins: [
      remarkExtendedTable,
      remarkMath,
      remarkSpoiler,
      remarkWordCounter,
    ],
  },
  redirects:
    import.meta.env.PROD && process.env.SITE_REDIRECTS !== undefined
      ? JSON.parse(process.env.SITE_REDIRECTS)
      : undefined,
  site: "https://theteamfuture.github.io",
  vite: {
    define: {
      __BUILD_TIME__: JSON.stringify(moment().format()),
    },
    plugins: [font.vite(), tailwindcss()],
    resolve: {
      alias: {
        "@": resolve("src"),
        "@avatars": resolve("src/assets/avatars"),
        "@images": resolve("src/assets/images"),
      },
    },
  },
});
