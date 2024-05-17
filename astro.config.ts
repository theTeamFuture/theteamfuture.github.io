/// Astro config
import { defineConfig } from 'astro/config';
import { resolve } from 'path';

// Integerations
import icon from 'astro-icon';
import tailwind from '@astrojs/tailwind';

// Plugins
import rehypeExternalLinks from 'rehype-external-links';
import rehypeFigure from 'rehype-figure';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

// Export config
export default defineConfig({
  integrations: [icon(), tailwind({ nesting: true })],
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        { rel: ['nofollow', 'noopener', 'noreferer'], target: '_blank' }
      ],
      [rehypeFigure, {}],
      [rehypeKatex, { output: 'html' }]
    ],
    remarkPlugins: [remarkMath],
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
