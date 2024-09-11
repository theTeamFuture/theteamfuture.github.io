/// Astro config
import { defineConfig } from 'astro/config';
import { resolve } from 'node:path';

// Integerations
import icon from 'astro-icon';
import mountAssets from './intergrations/mount-assets';
import tailwind from '@astrojs/tailwind';

// Remark plugins
import remarkContentLength from './remark-plugins/content-length';
import remarkExtendedTable from 'remark-extended-table';
import remarkMath from 'remark-math';
import remarkSpoiler from './remark-plugins/sploiler';

// Rehype plugins
import rehypeExternalLinks from 'rehype-external-links';
import rehypeFigure from 'rehype-figure';
import rehypeKatex from 'rehype-katex';

// Vite plugins
import font from 'vite-plugin-font';

// Export config
export default defineConfig({
  integrations: [icon(), mountAssets(), tailwind({ nesting: true })],
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          protocols: ['http', 'https', 'mailto'],
          rel: ['noopener', 'noreferer'],
          target: '_blank'
        }
      ],
      rehypeFigure,
      [rehypeKatex, { output: 'html' }]
    ],
    remarkPlugins: [
      remarkContentLength,
      remarkExtendedTable,
      remarkMath,
      remarkSpoiler
    ],
    shikiConfig: { theme: 'one-dark-pro' }
  },
  redirects:
    import.meta.env.PROD && process.env.SITE_REDIRECT
      ? JSON.parse(process.env.SITE_REDIRECT)
      : undefined,
  site: 'https://theteamfuture.github.io',
  vite: {
    plugins: [font.vite()],
    resolve: {
      alias: {
        '@': resolve('./src'),
        '@avatars': resolve('./src/assets/avatars'),
        '@images': resolve('./src/assets/images')
      }
    }
  }
});
