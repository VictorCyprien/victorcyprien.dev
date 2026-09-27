import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { allPages } from './site-pages';

for (const theme of ['dark', 'light'] as const) {
  test(`no serious accessibility issue in the ${theme} theme`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem('theme', value), theme);
    const failures: string[] = [];
    // '/nexiste-pas/' is not a real route: goto still resolves, on a 404 page.
    for (const path of [...(await allPages(page)), '/nexiste-pas/']) {
      await page.goto(path);
      const { violations } = await new AxeBuilder({ page }).analyze();
      for (const violation of violations) {
        if (violation.impact === 'serious' || violation.impact === 'critical') {
          failures.push(`${path} ${violation.id}: ${violation.nodes.map((node) => node.target.join(' ')).join(', ')}`);
        }
      }
    }
    expect(failures).toEqual([]);
  });
}
