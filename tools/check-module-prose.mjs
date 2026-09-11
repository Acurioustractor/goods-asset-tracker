#!/usr/bin/env node
/**
 * Run the writing checker over prose that lives inside TypeScript modules.
 *
 * The tells gate reads whole files. In a .ts module the prose is inside string literals and doc
 * comments, surrounded by code that the checker cannot judge, so nobody was running it there. On
 * 11 September 2026 that blind spot was carrying thirty writing tells, and one of them had drifted
 * out of step with the same sentence in a published page.
 *
 * This pulls the prose out and hands it to the same checker.
 *
 *   node tools/check-module-prose.mjs v2/src/lib/data/who-has-asked.ts
 *   node tools/check-module-prose.mjs v2/src/lib/data/*.ts
 */
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, basename } from 'node:path';
import { execFileSync } from 'node:child_process';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const files = process.argv.slice(2);
if (!files.length) {
  console.error('usage: node tools/check-module-prose.mjs <file.ts> [more.ts ...]');
  process.exit(2);
}

/** A string literal is prose when it is long enough to be a sentence. */
const MIN = 60;
const dir = mkdtempSync(join(tmpdir(), 'module-prose-'));
let bad = 0;

for (const f of files) {
  const src = readFileSync(f, 'utf8');
  const out = [];
  for (const m of src.matchAll(/'((?:[^'\\]|\\.){60,})'/g)) out.push(m[1].replace(/\\'/g, "'"));
  for (const m of src.matchAll(/"((?:[^"\\]|\\.){60,})"/g)) out.push(m[1].replace(/\\"/g, '"'));
  for (const m of src.matchAll(/\/\*\*([\s\S]*?)\*\//g)) {
    out.push(m[1].replace(/^\s*\*\s?/gm, ''));
  }
  if (!out.length) continue;
  const tmp = join(dir, basename(f).replace(/\.ts$/, '') + '.md');
  writeFileSync(tmp, out.join('\n\n'), 'utf8');
  let res;
  try {
    res = execFileSync('node', [join(HERE, 'check-ai-tells.mjs'), tmp], { encoding: 'utf8' });
  } catch (e) {
    res = (e.stdout || '') + (e.stderr || '');
  }
  const last = res.trim().split('\n').pop() || '';
  const fix = Number((last.match(/^(\d+) to fix/) || [0, 0])[1]);
  if (fix > 0) {
    bad += fix;
    console.log(`\n### ${f}`);
    console.log(res.replace(new RegExp(tmp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), f));
  } else {
    console.log(`ok  ${f}  (${last})`);
  }
}

if (bad) {
  console.log(`\n${bad} to fix across ${files.length} file(s).`);
  process.exit(1);
}
console.log(`\nClean across ${files.length} file(s).`);
