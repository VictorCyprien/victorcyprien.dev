import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { findMarkers } from '../../scripts/check-todo.mjs';

async function fixture(files: Record<string, string>): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'check-todo-'));
  for (const [name, content] of Object.entries(files)) {
    await mkdir(join(dir, name, '..'), { recursive: true });
    await writeFile(join(dir, name), content);
  }
  return dir;
}

test('finds markers in nested html and txt files', async () => {
  const dir = await fixture({
    'index.html': '<p>Prêt</p>',
    'etudes-de-cas/aura/index.html': '<p>[À COMPLÉTER : résultat]</p><a href="[À COMPLÉTER]">x</a>',
    'llms.txt': '- [À COMPLÉTER]',
  });
  const hits = (await findMarkers(dir)).map(({ path, count }) => [path.slice(dir.length + 1), count]).sort();
  assert.deepEqual(hits, [['etudes-de-cas/aura/index.html', 2], ['llms.txt', 1]]);
});

test('matches a marker typed with decomposed accents', async () => {
  const dir = await fixture({ 'index.html': '[À COMPLÉTER]'.normalize('NFD') });
  assert.equal((await findMarkers(dir)).length, 1);
});

test('ignores binary assets', async () => {
  const dir = await fixture({ '_astro/font.woff2': 'À COMPLÉTER' });
  assert.deepEqual(await findMarkers(dir), []);
});
