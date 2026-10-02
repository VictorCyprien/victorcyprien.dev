import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { allPages } from './site-pages';

// The preview server ignores .htaccess, so the test serves each page with the production policy itself.
const csp = /Header always set Content-Security-Policy "([^"]+)"/.exec(readFileSync('public/.htaccess', 'utf8'))?.[1];

test('every page loads under the production content security policy', async ({ page }) => {
  expect(csp, 'the CSP line in public/.htaccess').toBeTruthy();
  const pages = [...(await allPages(page)), '/404.html'];

  await page.route('**/*', async (route) => {
    const response = await route.fetch();
    const headers = response.headers();
    if (headers['content-type']?.includes('text/html')) headers['content-security-policy'] = csp!;
    await route.fulfill({ response, headers });
  });
  await page.addInitScript(() => {
    const blocked: string[] = [];
    (window as unknown as { blocked: string[] }).blocked = blocked;
    document.addEventListener('securitypolicyviolation', (event) => blocked.push(`${event.violatedDirective} ${event.blockedURI}`));
  });

  for (const path of pages) {
    const response = await page.goto(path);
    expect(response?.headers()['content-security-policy'], `${path} is served with the policy`).toBe(csp);
    // Let late resources (fonts, the theme script) load before reading the violations.
    await page.waitForLoadState('networkidle');
    expect(await page.evaluate(() => (window as unknown as { blocked: string[] }).blocked), path).toEqual([]);
  }
});
