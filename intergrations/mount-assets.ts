/// Mount assets intergration
import type { AstroIntegration } from 'astro';
import fs from 'fs';

// Export intergration
export default () =>
  ({
    name: 'mount-assets',
    hooks: {
      'astro:build:done': ({ logger }): void => {
        // Create assets folders
        fs.mkdirSync('dist/assets/posts', { recursive: true });
        fs.mkdirSync('dist/assets/puzzles', { recursive: true });
        logger.info('Assets folders created');

        // Get meta
        const meta: Record<string, Record<string, string>> = JSON.parse(
          fs.readFileSync('meta.json', 'utf-8')
        );
        logger.info('Meta got');

        // Find posts assets
        fs.readdirSync('src/content/posts', { withFileTypes: true }).forEach(
          (dir: fs.Dirent): void => {
            // If not directory
            if (!dir.isDirectory()) {
              return;
            }

            // Check assets
            const assetsPath: string =
              'src/content/posts/' + dir.name + '/assets';
            try {
              if (!fs.statSync(assetsPath).isDirectory()) {
                return;
              }
            } catch {
              return;
            }

            // Move assets
            const slug: string = meta.post[dir.name.slice(1) + '.md'];
            fs.renameSync(assetsPath, 'dist/assets/posts/' + slug);
            logger.info(`Move: ${assetsPath} -> dist/assets/posts/${slug}`);
          }
        );

        // Find puzzles assets
        fs.readdirSync('src/content/puzzles', { withFileTypes: true }).forEach(
          (dir: fs.Dirent): void => {
            // If not directory
            if (!dir.isDirectory()) {
              return;
            }

            // Check assets
            const assetsPath: string =
              'src/content/puzzles/' + dir.name + '/assets';
            try {
              if (!fs.statSync(assetsPath).isDirectory()) {
                return;
              }
            } catch {
              return;
            }

            // Move assets
            const slug: string = meta.post[dir.name.slice(1) + '.md'];
            fs.renameSync(assetsPath, 'dist/assets/puzzles/' + slug);
            logger.info(`Move: ${assetsPath} -> dist/assets/puzzles/${slug}`);
          }
        );
      }
    }
  } satisfies AstroIntegration);
