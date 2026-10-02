import { expect, test, type Page } from '@playwright/test';

// Counts the view transitions the page starts, so a test can tell a crossfade from an instant switch.
async function countViewTransitions(page: Page) {
  await page.addInitScript(() => {
    const start = document.startViewTransition?.bind(document);
    (window as unknown as { transitions: number }).transitions = 0;
    if (start) {
      document.startViewTransition = ((update: ViewTransitionUpdateCallback) => {
        (window as unknown as { transitions: number }).transitions++;
        return start(update);
      }) as typeof document.startViewTransition;
    }
  });
}

const transitions = (page: Page) => page.evaluate(() => (window as unknown as { transitions: number }).transitions);

test('the hero diagram draws itself once and ends complete', async ({ page }) => {
  await page.goto('/');
  const svg = page.locator('svg[aria-label="Le montage type d\'un projet"]');
  const brick = svg.locator('.brick rect').first();
  await expect(brick).toHaveCSS('animation-name', 'schema-brick');
  await expect(brick).toHaveCSS('animation-iteration-count', '1');
  // Every drawing animation ends: none of them loops, and none leaves a piece hidden or half traced.
  await svg.evaluate((element) => Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished)).then(() => true));
  const pieces = await svg.locator('rect, path, text, g').evaluateAll((elements) =>
    elements.map((element) => {
      const style = getComputedStyle(element);
      return { opacity: style.opacity, fillOpacity: style.fillOpacity, dash: style.strokeDashoffset };
    }),
  );
  for (const piece of pieces) expect(piece).toMatchObject({ opacity: '1', fillOpacity: '1', dash: '0px' });
});

test('the theme switch crossfades', async ({ page }) => {
  await countViewTransitions(page);
  await page.goto('/');
  test.skip((await page.evaluate(() => typeof document.startViewTransition)) !== 'function', 'no view transitions here');
  await page.getByRole('button', { name: 'Passer en thème clair' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(await transitions(page)).toBe(1);
});

test('two quick clicks on the theme button come back to the first theme', async ({ page }) => {
  await page.goto('/');
  // Both clicks land before the first crossfade has applied its theme.
  await page.locator('[data-theme-toggle]').evaluate((button: HTMLButtonElement) => {
    button.click();
    button.click();
  });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe('dark');
});

test('a link to a section scrolls there smoothly', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'smooth');
});

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('nothing moves: the diagram is drawn at once, the theme and the scroll jump', async ({ page }) => {
    await countViewTransitions(page);
    await page.goto('/');
    await expect(page.locator('.brick rect').first()).toHaveCSS('animation-name', 'none');
    await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
    await page.getByRole('button', { name: 'Passer en thème clair' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    expect(await transitions(page)).toBe(0);
  });
});
