import { defineConfig } from "astro/config";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

// Integrations
import htmlMinify from "./integrations/html-minify";
import includeAsset from "./integrations/include-asset";
import media from "astro-plugin-media";
import runtimeLogger from "@inox-tools/runtime-logger";
import sitemap from "@astrojs/sitemap";
import unocss from "unocss/astro";

// Katex extensions
import "katex/contrib/mhchem";

// Rehype plugins
import rehypeElementWrapper from "./rehype-plugins/element-wrapper";
import rehypeExternalLinks from "rehype-external-links";
import rehypeKatex from "rehype-katex";

// Remark plugins
import {
  remarkExtendedTable,
  extendedTableHandlers,
} from "remark-extended-table";
import remarkAlert from "remark-github-blockquote-alert";
import remarkCollapse from "./remark-plugins/collapse";
import remarkCustomHeaderId from "remark-custom-header-id";
import remarkDirective from "remark-directive";
import remarkEmoji from "remark-emoji";
import remarkFigure from "./remark-plugins/figure";
import remarkHeading from "./remark-plugins/heading";
import remarkMath from "remark-math";
import remarkRuby from "./remark-plugins/ruby";
import remarkSpoiler from "./remark-plugins/spoiler";
import remarkWordCount from "./remark-plugins/word-count";

// Vite plugins
import font from "vite-plugin-font";

// Extend dayjs
dayjs.extend(utc);

// https://astro.build/config
export default defineConfig({
  build: { assets: "-/astro" },
  experimental: { rustCompiler: true },
  integrations: [
    htmlMinify(),
    includeAsset({ outDir: "-/asset" }),
    media({
      config: {
        aplayer: {
          js: "https://cdn.jsdmirror.com/npm/aplayer@1/dist/APlayer.min.js",
          css: "https://cdn.jsdmirror.com/npm/aplayer@1/dist/APlayer.min.css",
        },
        meting: {
          js: "https://cdn.jsdmirror.com/npm/meting@2/dist/Meting.min.js",
        },
      },
    }),
    runtimeLogger(),
    sitemap(),
    unocss(),
  ],
  markdown: {
    rehypePlugins: [
      [
        rehypeElementWrapper,
        { selector: "table", wrapper: "div.table-wrapper" },
      ],
      [
        rehypeExternalLinks,
        { rel: "noopener noreferrer nofollow", target: "_blank" },
      ],
      rehypeKatex,
    ],
    remarkPlugins: [
      remarkDirective,
      [remarkAlert, { legacyTitle: true, tagName: "blockquote" }],
      remarkCollapse,
      remarkCustomHeaderId,
      [remarkEmoji, { accessible: true }],
      remarkExtendedTable,
      remarkFigure,
      remarkHeading,
      remarkMath,
      remarkRuby,
      remarkSpoiler,
      remarkWordCount,
    ],
    remarkRehype: {
      handlers: { ...extendedTableHandlers },
    },
    shikiConfig: { theme: "one-dark-pro" },
  },
  site: "https://theteamfuture.org",
  redirects: process.env.SITE_REDIRECTS
    ? JSON.parse(process.env.SITE_REDIRECTS)
    : undefined,
  vite: {
    css: { transformer: "lightningcss" },
    define: { __BUILD_TIME__: JSON.stringify(dayjs.utc().format()) },
    plugins: [font.vite()],
  },
});
