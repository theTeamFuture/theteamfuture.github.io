/// Mount assets intergration
import type { AstroIntegration } from 'astro';

import fs from 'fs';
import path from 'path';

export default () =>
  ({
    name: 'mount-assets',
    hooks: {
      'astro:build:done': ({ logger }): void => {
        // Create assets folder
        fs.mkdirSync('dist/assets');
        logger.info('Assets folder created');

        // Get meta
        const meta: Record<string, string> = JSON.parse(
          fs.readFileSync('meta.json', 'utf-8')
        );
        logger.info('Meta got');

        // Find assets
        fs.readdirSync('src/content/posts', { withFileTypes: true }).forEach(
          (dir: fs.Dirent): void => {
            // If not directory
            if (!dir.isDirectory()) {
              return;
            }

            // Check assets
            const assetsPath: string =
              'src/content/posts/' + dir.name + '/assets';
            if (!fs.statSync(assetsPath).isDirectory()) {
              return;
            }

            // Move assets
            const slug: string = meta[dir.name.slice(1) + '.md'];
            fs.renameSync(assetsPath, 'dist/assets/' + slug);
            logger.info(`Move: ${assetsPath} -> dist/assets/${slug}`);
          }
        );
      }
    }
  } satisfies AstroIntegration);
