import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

const DIR = 'src/content/etudes-de-cas';
// Every case study reads in the same order; the sub-headings under each section are free.
const SECTIONS = ['Contexte', 'Mon rôle', 'Contraintes', 'Décisions', "Ce que j'ai construit", 'Résultat', 'Ce que je ferais différemment'];

test('every case study follows the shared section order', async () => {
  const files = (await readdir(DIR)).filter((name) => name.endsWith('.md'));
  assert.ok(files.length > 0);
  for (const name of files) {
    const text = await readFile(`${DIR}/${name}`, 'utf8');
    const sections = [...text.matchAll(/^## (.+)$/gm)].map((match) => match[1].trim());
    assert.deepEqual(sections, SECTIONS, name);
  }
});
