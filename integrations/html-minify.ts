import type { AstroIntegration } from "astro";
import type { Options } from "html-minifier-terser";
import { minify } from "html-minifier-terser";
import chalk from "chalk";
import fs from "node:fs/promises";

// Default options
const options: Options = {
  collapseBooleanAttributes: true,
  collapseWhitespace: true,
  conservativeCollapse: true,
  keepClosingSlash: true,
  minifyCSS: true,
  minifyJS: true,
  removeComments: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  sortAttributes: true,
  sortClassName: true,
  useShortDoctype: true,
};

// Export integration
export default () =>
  ({
    name: "html-minify",
    hooks: {
      "astro:build:done": async ({ assets, logger }) => {
        logger.info("Minifying HTML files...");

        // Get HTML file URLs
        const urls = assets
          .values()
          .flatMap((urls) =>
            urls.filter((url) => url.pathname.endsWith(".html")),
          );

        // Create tasks
        const tasks = urls.map((url) =>
          (async () => {
            let oldSize = 0;
            let newSize = 0;

            await fs
              .readFile(url.pathname, "utf-8")
              .then((str) => {
                oldSize = str.length;
                return minify(str, options);
              })
              .then((str) => {
                newSize = str.length;
                return fs.writeFile(url.pathname, str, "utf-8");
              });

            const ratio = ((newSize - oldSize) / oldSize) * 100;
            const ratioStr =
              ratio < 0 ? ratio.toFixed(1) : `+${ratio.toFixed(1)}`;
            logger.info(chalk.gray(`  ${url.pathname} (${ratioStr}%)`));
          })(),
        );

        // Execute tasks
        await Promise.all(tasks);
        logger.info("Done");
      },
    },
  }) satisfies AstroIntegration;
