import type { AstroIntegration, AstroIntegrationLogger } from "astro";
import type { Root } from "mdast";
import type { VFile } from "vfile";
import type { Plugin } from "vite";
import { FlatCache } from "flat-cache";
import { visit } from "unist-util-visit";
import fs from "node:fs";
import mime from "mime";
import path from "node:path";
import url from "node:url";

// Types
interface Option {
  outDir?: string;
}

interface RemarkOption {
  base: string;
  outDir: string;
  logger: AstroIntegrationLogger;
}

// Shared
let cache: FlatCache;

// Export integration
export default ({ outDir = "_astro" }: Option = {}) =>
  ({
    name: "copy-assets",
    hooks: {
      "astro:config:setup": ({
        config,
        command,
        updateConfig,
        createCodegenDir,
        logger,
      }) => {
        if (command !== "build" && command !== "dev") return;

        // Cache control
        cache = new FlatCache({
          cacheDir: url.fileURLToPath(createCodegenDir()),
        });
        cache.load("cache1");
        if (command === "build") cache.clear();

        // Inject plugins
        updateConfig({
          markdown: {
            remarkPlugins: [
              [remarkAsset, { base: config.base, outDir, logger }],
            ],
          },
          vite: { plugins: [viteAsset(outDir)] },
        });
      },
      "astro:build:done": async ({ dir }) => {
        const outputDir = url.fileURLToPath(new URL(`./${outDir}`, dir));
        fs.mkdirSync(outputDir, { recursive: true });

        Object.entries(cache.all()).forEach(([k, v]) =>
          fs.copyFileSync(
            v,
            path.join(outputDir, k.slice(`/${outDir}/`.length)),
          ),
        );
      },
    },
  }) satisfies AstroIntegration;

// Vite plugin
const viteAsset = (outDir: string) =>
  ({
    name: "vite-copy-assets",
    configureServer: (svr) => {
      svr.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith(`/${outDir}/`)) {
          const pth = cache.get<string>(req.url);

          if (!pth || !fs.existsSync(pth)) {
            return next();
          }

          res.setHeader(
            "Content-Type",
            mime.getType(pth) ?? "application/octet-stream",
          );
          fs.createReadStream(pth).pipe(res);
          return;
        }
        next();
      });
    },
  }) satisfies Plugin;

// Remark plugin
const remarkAsset =
  ({ base, outDir, logger }: RemarkOption) =>
  (tree: Root, vfile: VFile) => {
    visit(tree, "leafDirective", (node) => {
      if (node.name !== "include-asset") return;

      if (node.children[0].type !== "text") {
        throw Error("invalid asset directive");
      }

      const attr = node.attributes || (node.attributes = {});
      if (!attr.id) {
        throw Error("invalid asset directive");
      }

      const fromPath = path.resolve(vfile.history[0], node.children[0].value);
      const toPath = path.join(base, outDir, attr.id);
      cache.set(toPath, fromPath);
      cache.save();
      logger.info(`new asset: ${toPath} -> ${fromPath}`);

      node.children = [];
    });
  };
