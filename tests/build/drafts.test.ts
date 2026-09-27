// Runs against dist/ after `astro build`, in the mode given by PUBLIC_SITE_ENV.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';

const STUDIES_DIR = 'src/content/etudes-de-cas';
const isPreview = process.env.PUBLIC_SITE_ENV === 'preview';

const draftSlugs = readdirSync(STUDIES_DIR)
  .filter((file) => file.endsWith('.md'))
  .filter((file) => /^draft:\s*true\s*$/m.test(readFileSync(`${STUDIES_DIR}/${file}`, 'utf8')))
  .map((file) => file.replace(/\.md$/, ''));

test('draft case studies stay out of the production build', { skip: isPreview }, (t) => {
  if (draftSlugs.length === 0) return t.skip('no draft to check');
  const llms = readFileSync('dist/llms.txt', 'utf8');
  const sitemap = readFileSync('dist/sitemap-0.xml', 'utf8');
  for (const slug of draftSlugs) {
    assert.equal(existsSync(`dist/etudes-de-cas/${slug}/index.html`), false, `${slug}: page built`);
    assert.ok(!llms.includes(`/etudes-de-cas/${slug}/`), `${slug}: listed in llms.txt`);
    assert.ok(!sitemap.includes(`/etudes-de-cas/${slug}/`), `${slug}: listed in the sitemap`);
  }
});

test('the preview build shows draft case studies', { skip: !isPreview }, (t) => {
  if (draftSlugs.length === 0) return t.skip('no draft to check');
  for (const slug of draftSlugs) {
    assert.equal(existsSync(`dist/etudes-de-cas/${slug}/index.html`), true, `${slug}: page missing`);
  }
});
