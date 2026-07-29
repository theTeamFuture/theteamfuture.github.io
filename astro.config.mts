import { defineConfig } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

// --- Integrations ---
import minify from "astro-minify-html-swc";
import mountAssets from "./integrations/mount-assets";
import sitemap from "@astrojs/sitemap";
import unocss from "unocss/astro";

// --- Hast plugins ---
import externalLink from "./plugins/hast/external-link";
import figure from "./plugins/hast/figure";

// --- Mdast plugins ---
import katex from "./plugins/mdast/katex";
import wordCounter from "./plugins/mdast/word-counter";
import spoiler from "./plugins/mdast/spoiler";

// --- Vite plugins ---
import font from "vite-plugin-font";
import aplayer from "./plugins/mdast/aplayer";

// Extend dayjs
dayjs.extend(utc);

// https://astro.build/config
export default defineConfig({
  integrations: [
    unocss(),
    sitemap({
      filter: (page) => {
        const url = new URL(page).pathname;
        return !url.startsWith("/cat") && !url.startsWith("/time-capsule");
      },
    }),
    minify(),
    mountAssets(),
  ],
  image: {
    domains: ["img.shields.io"],
  },
  markdown: {
    processor: satteri({
      features: {
        math: true,
        directive: true,
      },
      hastPlugins: [externalLink(), figure()],
      mdastPlugins: [
        aplayer(),
        katex(),
        spoiler({ title: "你知道的太多了" }),
        wordCounter(),
      ],
    }),
    shikiConfig: { theme: "one-dark-pro" },
  },
  redirects: {
    "/time-capsule": "/cat",
    ...JSON.parse(process.env.SITE_REDIRECTS ?? "{}"),
  },
  site: "https://theteamfuture.org",
  vite: {
    css: { transformer: "lightningcss" },
    define: {
      __BUILD_TIME__: JSON.stringify(dayjs.utc().format()),
    },
    plugins: [font.vite()],
    resolve: { tsconfigPaths: true },
  },
});
