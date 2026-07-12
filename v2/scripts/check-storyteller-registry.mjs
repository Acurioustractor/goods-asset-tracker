#!/usr/bin/env node
// Storyteller registry drift guard.
//
// Enforces v2/src/lib/data/storyteller-registry.ts against the rest of v2/src:
//   1. Misspellings (e.g. "Diane Stokes", "Norm Frank", "Waramungu") appear nowhere.
//   2. Banned quote fragments (totem line, Weave Bed line, held quotes) appear nowhere.
//   3. Hold/funder-tier names appear nowhere in rendered surfaces (app/, components/).
//   4. tier 'external' records stay in sync with cleared-voices.ts (both directions).
//
// Run: npm run check:storytellers   (from v2/)
// Exit 0 = locked down. Exit 1 = drift, with file:line for every violation.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const V2 = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(V2, 'src');
const REGISTRY_PATH = join(SRC, 'lib/data/storyteller-registry.ts');
const CLEARED_PATH = join(SRC, 'lib/data/cleared-voices.ts');

// ── Parse the registry (text-level; keeps this script dependency-free) ──────

const registryText = readFileSync(REGISTRY_PATH, 'utf8');

/** Split the registry source into per-record chunks on `slug:` boundaries. */
const recordChunks = registryText
  .split(/\n\s*\{\s*\n\s*slug:/)
  .slice(1)
  .map((chunk) => 'slug:' + chunk);

const pullString = (chunk, key) => {
  const m = chunk.match(new RegExp(`${key}:\\s*'((?:[^'\\\\]|\\\\.)*)'`));
  return m ? m[1].replace(/\\'/g, "'") : undefined;
};

const pullArray = (chunk, key) => {
  const m = chunk.match(new RegExp(`${key}:\\s*\\[([^\\]]*)\\]`));
  if (!m) return [];
  return [...m[1].matchAll(/'((?:[^'\\\\]|\\\\.)*)'/g)].map((x) => x[1].replace(/\\'/g, "'"));
};

const records = recordChunks.map((chunk) => ({
  name: pullString(chunk, 'name'),
  tier: pullString(chunk, 'tier'),
  aliases: pullArray(chunk, 'aliases'),
  misspellings: pullArray(chunk, 'misspellings'),
  bannedFragments: pullArray(chunk, 'bannedFragments'),
}));

if (records.length < 30) {
  console.error(`Registry parse produced only ${records.length} records; expected 30+. Check the parser.`);
  process.exit(1);
}

// ── Parse cleared-voices.ts allowlist ────────────────────────────────────────

const clearedText = readFileSync(CLEARED_PATH, 'utf8');
const allowBlock = clearedText.match(/CLEARED_VOICES_EXTERNAL[^=]*=\s*\[([\s\S]*?)\];/);
if (!allowBlock) {
  console.error('Could not find CLEARED_VOICES_EXTERNAL in cleared-voices.ts');
  process.exit(1);
}
const allowNames = [...allowBlock[1].matchAll(/'((?:[^'\\\\]|\\\\.)*)'/g)].map((m) =>
  m[1].replace(/\\'/g, "'"),
);

const normalise = (name) =>
  (name ?? '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[.,]/g, ' ')
    .replace(/&/g, 'and')
    .replace(/\s+/g, ' ')
    .trim();

// ── Walk v2/src ──────────────────────────────────────────────────────────────

const SKIP_DIRS = new Set(['node_modules', '.next', 'sites']);
const EXT = /\.(ts|tsx|js|jsx|mjs|json|html|md)$/;

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (!SKIP_DIRS.has(entry)) yield* walk(full);
    } else if (EXT.test(entry)) {
      yield full;
    }
  }
}

const files = [...walk(SRC)].filter((f) => f !== REGISTRY_PATH);

const findInFiles = (needle, fileList) => {
  const hits = [];
  for (const file of fileList) {
    const text = readFileSync(file, 'utf8');
    if (!text.includes(needle)) continue;
    text.split('\n').forEach((line, i) => {
      if (line.includes(needle)) hits.push(`${relative(V2, file)}:${i + 1}`);
    });
  }
  return hits;
};

const violations = [];

// 1. Misspellings — nowhere in v2/src.
for (const rec of records) {
  for (const bad of rec.misspellings) {
    const hits = findInFiles(bad, files);
    if (hits.length) violations.push(`MISSPELLING "${bad}" (${rec.name}):\n    ${hits.join('\n    ')}`);
  }
}

// 2. Banned quote fragments — nowhere in v2/src (community-narrative.ts hold
//    register is the one allowed documentation site).
const HOLD_REGISTER = join(SRC, 'lib/data/community-narrative.ts');
for (const rec of records) {
  for (const frag of rec.bannedFragments) {
    const hits = findInFiles(frag, files.filter((f) => f !== HOLD_REGISTER));
    if (hits.length) violations.push(`BANNED FRAGMENT "${frag}" (${rec.name}):\n    ${hits.join('\n    ')}`);
  }
}

// 3. Hold/funder-tier names — never in rendered surfaces (app/, components/).
const rendered = files.filter(
  (f) => f.startsWith(join(SRC, 'app')) || f.startsWith(join(SRC, 'components')),
);
for (const rec of records) {
  if (rec.tier !== 'hold' && rec.tier !== 'funder') continue;
  const hits = findInFiles(rec.name, rendered);
  if (hits.length) violations.push(`HOLD VOICE "${rec.name}" (tier ${rec.tier}) in rendered surface:\n    ${hits.join('\n    ')}`);
}

// 4. external tier ⇄ cleared-voices.ts sync.
const allowSet = new Set(allowNames.map(normalise));
const externalRecords = records.filter((r) => r.tier === 'external');
for (const rec of externalRecords) {
  const forms = [rec.name, ...rec.aliases].map(normalise);
  if (!forms.some((f) => allowSet.has(f))) {
    violations.push(`SYNC: registry external voice "${rec.name}" is missing from cleared-voices.ts`);
  }
}
const registryForms = new Set(
  externalRecords.flatMap((r) => [r.name, ...r.aliases]).map(normalise),
);
for (const name of allowNames) {
  if (!registryForms.has(normalise(name))) {
    violations.push(`SYNC: cleared-voices.ts entry "${name}" has no external-tier registry record`);
  }
}

// ── Report ───────────────────────────────────────────────────────────────────

if (violations.length) {
  console.error(`✗ Storyteller registry drift: ${violations.length} violation(s)\n`);
  for (const v of violations) console.error('  ' + v + '\n');
  process.exit(1);
}

console.log(
  `✓ Storyteller registry locked: ${records.length} voices ` +
    `(${externalRecords.length} external), no misspellings, no banned fragments, ` +
    'no hold voices on rendered surfaces, allowlist in sync.',
);
