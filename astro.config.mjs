import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const INDEXABLE_PATHS = new Set([
  '/',
  '/work',
  '/lab',
  '/notes',
  '/about',
  '/frame',
]);

export default defineConfig({
  site: 'https://sstm117.com',
  output: 'static',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => INDEXABLE_PATHS.has(new URL(page).pathname),
    }),
  ],
});
