// Lists built files that still contain the "À COMPLÉTER" content marker.
// Usage: node scripts/check-todo.mjs <dir> [--warn]
// Exits 1 when a marker is found, unless --warn is given.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const MARKER = 'À COMPLÉTER';
const TEXT_FILE = /\.(html|txt|xml)$/;

export async function findMarkers(dir) {
  const hits = [];
  for (const entry of await readdir(dir, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile() || !TEXT_FILE.test(entry.name)) continue;
    const path = join(entry.parentPath, entry.name);
    // NFC so a marker typed with decomposed accents still matches.
    const count = (await readFile(path, 'utf8')).normalize('NFC').split(MARKER).length - 1;
    if (count > 0) hits.push({ path, count });
  }
  return hits;
}

if (import.meta.filename === process.argv[1]) {
  const [dir = 'dist', ...flags] = process.argv.slice(2);
  const warnOnly = flags.includes('--warn');
  const hits = await findMarkers(dir);
  for (const { path, count } of hits) console.log(`${path}: ${count} × "${MARKER}"`);
  if (hits.length === 0) {
    console.log(`No "${MARKER}" marker in ${dir}.`);
  } else if (warnOnly) {
    console.log(`Warning: ${hits.length} file(s) still have content to complete.`);
  } else {
    console.error(`Blocked: ${hits.length} file(s) still have content to complete.`);
    process.exit(1);
  }
}
