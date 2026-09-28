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

test('every page answers and every internal link resolves', async ({ page }) => {
  const seen = new Set<string>();
  const queue = ['/'];
  while (queue.length > 0) {
    const path = queue.shift()!;
    if (seen.has(path)) continue;
    seen.add(path);
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    if (!(response?.headers()['content-type'] ?? '').includes('text/html')) continue;
    const hrefs = await page.locator('a[href]').evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
    for (const href of hrefs) {
      if (!href.startsWith('/')) continue;
      const target = href.split('#')[0];
      if (target && !seen.has(target)) queue.push(target);
    }
  }
  expect(seen).toContain('/mentions-legales/');
  expect(seen).toContain('/etudes-de-cas/');
});

test('the parcours section shows a diplomas block with links to schools and companies', async ({ page }) => {
  await page.goto('/');
  const parcours = page.locator('#parcours');
  await expect(parcours.getByRole('heading', { name: 'Diplômes', level: 3 })).toBeVisible();
  await expect(parcours.locator('ol').nth(1).getByRole('listitem')).toHaveCount(3);
  await expect(parcours.locator('a[href="https://www.beeguard.fr/"]')).toHaveText('Beeguard');
  await expect(parcours.locator('a[href="https://www.kipsoft.fr/"]')).toHaveText('Kipsoft');
  await expect(parcours.locator('a[href="https://www.limayrac.fr/"]')).toHaveCount(3);
  const text = (await parcours.textContent()) ?? '';
  expect(text).not.toContain('[À COMPLÉTER');
});

test('every image on the home page loads, the portrait included', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('img', { name: 'Portrait de Victor Cyprien' })).toBeVisible();
  const broken = await page.locator('img').evaluateAll((images) =>
    images.filter((image) => !(image as HTMLImageElement).complete || (image as HTMLImageElement).naturalWidth === 0).map((image) => image.getAttribute('src')),
  );
  expect(broken).toEqual([]);
});

test('an unknown address serves the 404 page', async ({ page }) => {
  const response = await page.goto('/cette-page-n-existe-pas/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page introuvable');
});

test('the header names the site and shows every navigation link', async ({ page }) => {
  await page.goto('/');
  const header = page.getByRole('banner');
  await expect(header.getByRole('link', { name: 'Victor Cyprien' })).toHaveAttribute('href', '/');
  const nav = page.getByRole('navigation', { name: 'Navigation principale' });
  for (const label of ['Comment je décide', 'Projets', 'Parcours', 'Études de cas']) {
    await expect(nav.getByRole('link', { name: label })).toBeInViewport();
  }
});

test('the home headline fits on two lines on a desktop screen', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'the two-line rule is for desktop screens');
  await page.goto('/');
  const lines = await page.getByRole('heading', { level: 1 }).evaluate((heading) => {
    const lineHeight = parseFloat(getComputedStyle(heading).lineHeight);
    return Math.round(heading.getBoundingClientRect().height / lineHeight);
  });
  expect(lines).toBeLessThanOrEqual(2);
});

test('every case study ends with the call button', async ({ page }) => {
  const studies = (await allPages(page)).filter((path) => /^\/etudes-de-cas\/.+\//.test(path));
  test.skip(studies.length === 0, 'no case study is published in this build');
  for (const path of studies) {
    await page.goto(path);
    await expect(page.getByRole('main').getByRole('link', { name: 'Réserver un appel' }), path).toBeVisible();
  }
});
