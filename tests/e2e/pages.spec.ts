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
  await expect(call).toHaveAttribute('href', /^https:\/\/cal\.com\//);
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

test('each service on the home page points to a published case study as proof', async ({ page }) => {
  const studies = (await allPages(page)).filter((path) => /^\/etudes-de-cas\/.+\//.test(path));
  test.skip(studies.length === 0, 'no case study is published in this build');
  await page.goto('/');
  const services = page.locator('#services');
  await expect(services.getByRole('heading', { level: 2 })).toHaveText('Ce que je fais');
  const items = services.getByRole('listitem');
  expect(await items.count()).toBeGreaterThan(0);
  for (const item of await items.all()) {
    const proof = await item.getByRole('link').evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
    expect(proof.length, (await item.getByRole('heading').textContent()) ?? '').toBeGreaterThan(0);
    for (const href of proof) expect(studies).toContain(href);
  }
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
  for (const label of ['Services', 'Comment je décide', 'Projets', 'Parcours', 'Études de cas']) {
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

test('the case study list and each case study lead to the other studies and to a call', async ({ page }) => {
  const studies = (await allPages(page)).filter((path) => /^\/etudes-de-cas\/.+\//.test(path));
  test.skip(studies.length < 2, 'linking studies needs at least two of them');
  await page.goto('/etudes-de-cas/');
  await expect(page.getByRole('main').getByRole('link', { name: 'Réserver un appel' })).toBeVisible();
  for (const path of studies) {
    await page.goto(path);
    const others = page.getByRole('region', { name: /^Autres? études? de cas$/ }).getByRole('link');
    const targets = await others.evaluateAll((links) => links.map((link) => link.getAttribute('href')));
    expect(targets.sort(), path).toEqual(studies.filter((other) => other !== path).sort());
  }
});

test('each case study names the principles it applies, and each principle points back to it', async ({ page }) => {
  const studies = (await allPages(page)).filter((path) => /^\/etudes-de-cas\/.+\//.test(path));
  test.skip(studies.length === 0, 'no case study is published in this build');
  const links: [string, string][] = [];
  for (const path of studies) {
    await page.goto(path);
    const targets = await page.getByRole('main').locator('a[href^="/#principe-"]').evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href') ?? ''));
    expect(targets.length, path).toBeGreaterThan(0);
    for (const target of targets) links.push([path, target]);
  }
  await page.goto('/');
  for (const [path, target] of links) {
    const principle = page.locator(`[id="${target.slice(2)}"]`);
    await expect(principle, target).toHaveCount(1);
    await expect(principle.locator(`a[href="${path}"]`), `${target} links back to ${path}`).toHaveCount(1);
  }
});

test('each case study opens with its brief, its reading time and a table of contents', async ({ page }) => {
  const studies = (await allPages(page)).filter((path) => /^\/etudes-de-cas\/.+\//.test(path));
  test.skip(studies.length === 0, 'no case study is published in this build');
  for (const path of studies) {
    await page.goto(path);
    const main = page.getByRole('main');
    await expect(main.getByRole('heading', { name: 'En bref' }), path).toBeVisible();
    await expect(main.getByText(/^\d+ min$/), path).toBeVisible();
    const targets = await page
      .getByRole('navigation', { name: 'Sommaire' })
      .locator('a')
      .evaluateAll((links) => links.map((link) => decodeURIComponent((link.getAttribute('href') ?? '').slice(1))));
    expect(targets.length, path).toBeGreaterThan(5);
    for (const id of targets) await expect(page.locator(`[id="${id}"]`), `${path} #${id}`).toHaveCount(1);
  }
});

test('the table of contents follows the reading on a desktop screen', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'the pinned table of contents is for desktop screens');
  const studies = (await allPages(page)).filter((path) => /^\/etudes-de-cas\/.+\//.test(path));
  test.skip(studies.length === 0, 'no case study is published in this build');
  await page.goto(studies[0]);
  const toc = page.getByRole('navigation', { name: 'Sommaire' });
  await expect(toc.getByRole('link', { name: 'Résultat', exact: true })).toBeVisible();
  await page.getByRole('heading', { name: 'Résultat', exact: true }).evaluate((heading) => heading.scrollIntoView());
  await expect(toc.locator('a[aria-current="location"]')).toHaveText('Résultat');
  // The veille bar settles beside the current link, at its height.
  await expect
    .poll(() =>
      toc.evaluate((nav) => {
        const marker = nav.querySelector('.toc-marker')!.getBoundingClientRect();
        const link = nav.querySelector('a[aria-current]')!.getBoundingClientRect();
        return [marker.left - link.left, marker.top - link.top, marker.height - link.height].map((gap) => Math.round(Math.abs(gap)));
      }),
    )
    .toEqual([0, 0, 0]);
});

test('the table of contents stays folded on a phone until opened', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'the folded table of contents is for phones');
  const studies = (await allPages(page)).filter((path) => /^\/etudes-de-cas\/.+\//.test(path));
  test.skip(studies.length === 0, 'no case study is published in this build');
  await page.goto(studies[0]);
  const toc = page.getByRole('navigation', { name: 'Sommaire' });
  await expect(toc.getByRole('link', { name: 'Contexte' })).toBeHidden();
  await toc.getByText('Sommaire').click();
  await expect(toc.getByRole('link', { name: 'Contexte' })).toBeVisible();
});

test('hovering a diagram brick shows its role and fades the rest on a desktop screen', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'hover needs a mouse');
  await page.goto('/');
  const figure = page.locator('figure[data-diagram="aura"]');
  const note = figure.locator('[data-diagram-note]');
  await expect(note).toHaveText(/Passez la souris/);
  await figure.locator('[data-id="nutrition"]').hover();
  await expect(note).toContainText('Nutrition. Un des trois moteurs');
  await expect(figure.locator('[data-id="watch"]')).toHaveCSS('opacity', '0.3');
  await expect(figure.locator('[data-id="brands"]')).toHaveCSS('opacity', '1');
  await page.mouse.move(0, 0);
  await expect(note).toHaveText(/Passez la souris/);
  await expect(figure.locator('[data-id="watch"]')).toHaveCSS('opacity', '1');
});

test('diagrams stay still on a phone', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'the still diagram is for touch screens');
  await page.goto('/');
  await expect(page.locator('[data-diagram-note]').first()).toBeHidden();
});

test('each featured project shows its architecture diagram', async ({ page }) => {
  await page.goto('/');
  const projects = page.locator('#projets');
  await expect(projects.getByRole('img', { name: 'Le montage de Contrapp' })).toBeVisible();
  await expect(projects.getByRole('img', { name: "Le montage d'AURA" })).toBeVisible();
});
