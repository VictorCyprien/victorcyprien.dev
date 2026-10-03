import { expect, test, type Page } from '@playwright/test';
import { allPages } from './site-pages';

type Node = { '@type': string; [key: string]: unknown };

async function structuredData(page: Page): Promise<Node[]> {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocks.flatMap((block) => (JSON.parse(block) as { '@graph': Node[] })['@graph']);
}

test('the home page tells search engines who Victor is and where he works', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/^Développeur back-end et DevOps freelance à Toulouse/);
  const graph = await structuredData(page);
  expect(graph.map((node) => node['@type'])).toEqual(['Person', 'ProfessionalService', 'WebSite']);
  const person = graph[0];
  expect(person).toMatchObject({ name: 'Victor Cyprien', address: { addressLocality: 'Toulouse' } });
  expect(person.knowsAbout).toContain('FastAPI');
  // The profiles in the data are the ones linked from the contact section.
  const profiles = await page.locator('#contact').getByRole('link').evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  for (const profile of person.sameAs as string[]) expect(profiles).toContain(profile);
  // The freelance activity carries the same profiles, the school and the partner company come from the parcours.
  expect(graph[1].sameAs).toEqual(person.sameAs);
  expect((person.alumniOf as { name: string }[]).map((school) => school.name)).toEqual(['Institut Limayrac']);
  expect(person.worksFor).toContainEqual(expect.objectContaining({ '@type': 'Organization', name: 'BeAble2' }));
});

test('the case study list names its place in the site', async ({ page }) => {
  await page.goto('/etudes-de-cas/');
  const [breadcrumb, ...rest] = await structuredData(page);
  expect(rest).toEqual([]);
  const items = breadcrumb.itemListElement as { name: string }[];
  expect(items.map((item) => item.name)).toEqual(['Accueil', await page.getByRole('heading', { level: 1 }).textContent()]);
});

test('each case study names its place in the site', async ({ page }) => {
  const studies = (await allPages(page)).filter((path) => /^\/etudes-de-cas\/.+\//.test(path));
  test.skip(studies.length === 0, 'no case study is published in this build');
  for (const path of studies) {
    await page.goto(path);
    const graph = await structuredData(page);
    expect(graph.map((node) => node['@type']), path).toEqual(['Person', 'WebSite', 'BreadcrumbList', 'WebPage']);
    const [, , breadcrumb, webPage] = graph;
    const items = breadcrumb.itemListElement as { name: string }[];
    const heading = (await page.getByRole('heading', { level: 1 }).textContent())?.replace(/\u00a0/g, ' ');
    expect(items.map((item) => item.name), path).toEqual(['Accueil', 'Études de cas', heading]);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(webPage, path).toMatchObject({ '@type': 'WebPage', url: canonical });
  }
});

test('every page carries its sharing and browser tags, with no layout spaces in the data', async ({ page }) => {
  for (const path of await allPages(page)) {
    await page.goto(path);
    for (const name of ['og:site_name', 'og:image:alt']) {
      await expect(page.locator(`meta[property="${name}"]`), `${path} ${name}`).toHaveAttribute('content', /\S/);
    }
    await expect(page.locator('meta[name="theme-color"]'), path).toHaveAttribute('content', /^#[0-9a-fA-F]{6}$/);
    const data = await page.locator('script[type="application/ld+json"]').allTextContents();
    for (const block of data) expect(block, path).not.toMatch(/[\u00a0\u202f]/);
  }
});
