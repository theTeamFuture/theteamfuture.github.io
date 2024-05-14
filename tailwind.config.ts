/// Tailwind config
import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

// Export config
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        misans: ['mi-sans', ...fontFamily.sans]
      }
    }
  },
  plugins: []
} satisfies Config;
