import { test } from 'node:test';
import assert from 'node:assert/strict';
import { frenchSpacing, remarkFrenchSpacing } from '../../src/lib/typography.ts';

const NBSP = ' ';

test('puts a no-break space before : ; ? !', () => {
  assert.equal(frenchSpacing('Stack : Python'), `Stack${NBSP}: Python`);
  assert.equal(frenchSpacing('Prêt ? Oui !'), `Prêt${NBSP}? Oui${NBSP}!`);
  assert.equal(frenchSpacing('un ; deux'), `un${NBSP}; deux`);
});

test('adds the space when the author forgot it', () => {
  assert.equal(frenchSpacing('Secteur: santé'), `Secteur${NBSP}: santé`);
});

test('leaves URLs, times and ratios alone', () => {
  assert.equal(frenchSpacing('https://victorcyprien.dev'), 'https://victorcyprien.dev');
  assert.equal(frenchSpacing('à 14:30'), 'à 14:30');
});

test('the remark plugin rewrites nested text nodes', () => {
  const tree = { type: 'root', children: [{ type: 'paragraph', children: [{ type: 'text', value: 'NDA : cette étude' }] }] };
  remarkFrenchSpacing()(tree);
  assert.equal(tree.children[0].children[0].value, `NDA${NBSP}: cette étude`);
});
