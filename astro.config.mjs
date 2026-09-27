// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { remarkFrenchSpacing } from './src/lib/typography.ts';

// PUBLIC_SITE_ENV is "preview" for the develop branch build, anything else means production.
const isPreview = process.env.PUBLIC_SITE_ENV === 'preview';

export default defineConfig({
  site: isPreview ? 'https://preview.victorcyprien.dev' : 'https://victorcyprien.dev',
  integrations: [sitemap()],
  markdown: { remarkPlugins: [remarkFrenchSpacing] },
  vite: { plugins: [tailwindcss()] },
});
