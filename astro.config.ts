/// Astro config
import { defineConfig } from 'astro/config';

// Integerations
import icon from 'astro-icon';
import tailwind from '@astrojs/tailwind';

// Plugins
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

// Export config
export default defineConfig({
  integrations: [icon(), tailwind()],
  markdown: {
    rehypePlugins: [[rehypeKatex, { output: 'html' }]],
    remarkPlugins: [remarkMath],
    syntaxHighlight: 'prism'
  },
  site: "https://future-puzzle.github.io"
});
