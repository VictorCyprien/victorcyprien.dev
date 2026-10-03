// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import { remarkFrenchSpacing } from './src/lib/typography.ts';

// PUBLIC_SITE_ENV is "preview" for the develop branch build, anything else means production.
const isPreview = process.env.PUBLIC_SITE_ENV === 'preview';

export default defineConfig({
  site: isPreview ? 'https://preview.victorcyprien.dev' : 'https://victorcyprien.dev',
  integrations: [sitemap()],
  // Straight apostrophes everywhere: YAML and templates never curl them, so Markdown must not either.
  markdown: { processor: unified({ remarkPlugins: [remarkFrenchSpacing], smartypants: false }) },
  vite: { plugins: [tailwindcss()] },
});
