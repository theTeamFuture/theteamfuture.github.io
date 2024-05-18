/// Astro config
import { defineConfig } from 'astro/config';
import { resolve } from 'path';

// Integerations
import icon from 'astro-icon';
import mountAssets from './intergrations/mount-assets';
import tailwind from '@astrojs/tailwind';

// Plugins
import rehypeExternalLinks from 'rehype-external-links';
import rehypeFigure from 'rehype-figure';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkContentLength from './plugins/remark-content-length';

// Export config
export default defineConfig({
  integrations: [icon(), mountAssets(), tailwind({ nesting: true })],
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        { rel: ['nofollow', 'noopener', 'noreferer'], target: '_blank' }
      ],
      [rehypeFigure, {}],
      [rehypeKatex, { output: 'html' }]
    ],
    remarkPlugins: [remarkContentLength, remarkMath],
    syntaxHighlight: 'prism'
  },
  site: 'https://theteamfuture.github.io',
  vite: {
    resolve: {
      alias: {
        '@': resolve('./src'),
        '@avatars': resolve('./src/assets/avatars'),
        '@images': resolve('./src/assets/images')
      }
    }
  }
});
