import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readingMinutes } from '../../src/lib/reading.ts';

const words = (count: number) => Array.from({ length: count }, () => 'mot').join(' ');

test('readingMinutes rounds up to the next minute', () => {
  assert.equal(readingMinutes(words(200)), 1);
  assert.equal(readingMinutes(words(201)), 2);
  assert.equal(readingMinutes(words(800)), 4);
});

test('readingMinutes never shows less than one minute', () => {
  assert.equal(readingMinutes(''), 1);
});

test('readingMinutes skips Markdown marks that are not words', () => {
  assert.equal(readingMinutes(`## Titre\n\n- ${words(199)} :`), 1);
});
