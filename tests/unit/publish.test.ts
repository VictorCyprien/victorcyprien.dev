import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isPublished, showsDrafts } from '../../src/lib/publish.ts';

test('production hides drafts', () => {
  assert.equal(showsDrafts('production', false), false);
  assert.equal(showsDrafts(undefined, false), false);
  assert.equal(isPublished(true, false), false);
});

test('preview and dev show drafts', () => {
  assert.equal(showsDrafts('preview', false), true);
  assert.equal(showsDrafts(undefined, true), true);
  assert.equal(isPublished(true, true), true);
});

test('finished content is always published', () => {
  assert.equal(isPublished(false, false), true);
});
