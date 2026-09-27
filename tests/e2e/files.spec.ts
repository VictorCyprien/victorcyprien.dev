import { expect, test } from '@playwright/test';
import { allPages } from './site-pages';

test('llms.txt sums up the site and lists every published case study', async ({ page, request }) => {
  const response = await request.get('/llms.txt');
  expect(response.status()).toBe(200);
  const text = await response.text();
  expect(text).toContain('# Victor Cyprien');
  expect(text).toContain('Cadrer par écrit avant de coder');
  expect(text).toContain('contact@victorcyprien.dev');
  for (const path of (await allPages(page)).filter((p) => p.startsWith('/etudes-de-cas/') && p !== '/etudes-de-cas/')) {
    expect(text, path).toContain(path);
  }
});

test('robots.txt matches the environment', async ({ request }) => {
  const text = await (await request.get('/robots.txt')).text();
  if (process.env.PUBLIC_SITE_ENV === 'preview') {
    expect(text).toContain('Disallow: /');
  } else {
    expect(text).toContain('Sitemap: https://victorcyprien.dev/sitemap-index.xml');
  }
});
