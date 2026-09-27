import type { Page } from '@playwright/test';

export const STATIC_PAGES = ['/', '/etudes-de-cas/'];

/** Static pages plus every case study linked from the case study index. */
export async function allPages(page: Page): Promise<string[]> {
  await page.goto('/etudes-de-cas/');
  const studies = await page
    .locator('main a[href^="/etudes-de-cas/"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''));
  return [...STATIC_PAGES, ...new Set(studies)];
}
