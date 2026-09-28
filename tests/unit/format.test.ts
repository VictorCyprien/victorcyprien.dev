import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatMonth, formatPeriod } from '../../src/lib/format.ts';

test('formatMonth gives a short French month', () => {
  assert.equal(formatMonth('2025-07'), 'juil. 2025');
  assert.equal(formatMonth('2021-09'), 'sept. 2021');
});

test('formatPeriod closes a finished period', () => {
  assert.equal(formatPeriod('2025-07', '2026-01'), 'juil. 2025 - janv. 2026');
});

test('formatPeriod marks an ongoing period', () => {
  assert.equal(formatPeriod('2023-10', null), "oct. 2023 - aujourd'hui");
});
