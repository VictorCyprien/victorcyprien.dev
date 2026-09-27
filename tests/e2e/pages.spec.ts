import { allPages } from './site-pages';
import { expect, test } from '@playwright/test';

test('every in-page link on the home page has a target', async ({ page }) => {
  await page.goto('/');
  const hashes = await page
    .locator('a[href^="/#"], a[href^="#"]')
    .evaluateAll((links) => links.map((link) => (link.getAttribute('href') ?? '').split('#')[1]));
  expect(hashes.length).toBeGreaterThan(0);
  for (const id of new Set(hashes)) {
    await expect(page.locator(`[id="${id}"]`), `#${id}`).toHaveCount(1);
  }
});

test('the home page shows the headline and the call button', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Back-end et DevOps pour PME et startups.');
  const call = page.getByRole('main').getByRole('link', { name: 'Réserver un appel' }).first();
  await expect(call).toHaveAttribute('href', /^mailto:contact@victorcyprien\.dev/);
});

test('French punctuation never starts a line', async ({ page }) => {
  for (const path of await allPages(page)) {
    await page.goto(path);
    const text = (await page.locator('main').textContent()) ?? '';
    expect(text, path).not.toMatch(/ [:;?!](\s|$)/);
  }
});
