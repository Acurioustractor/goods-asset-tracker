#!/usr/bin/env node
/**
 * CANON NUMBERS — generate design/canon-numbers.json from the canon registry
 * (src/lib/data/canon.ts), so design-kit artifacts can reference figures by
 * token (`CANON:num:<canon-id>`) instead of hand-typing them. Companion to the
 * image slots: canon-render.mjs resolves both token kinds in one bake.
 *
 * Extraction mirrors check-canon-drift.mjs: read the .ts files AS TEXT (no
 * compile step), pull each fact's numeric `value:` (literals like 741_111, or
 * CANONICAL_ASSETS.<key> resolved from asset-canonical.ts). String-valued facts
 * (governance entities) are skipped — this file is figures only.
 *
 * The stored value is the exact formatted string an artifact displays:
 *   AUD -> "$741,111"   kg -> "2,660kg" (units no-space)   counts -> "496"
 *
 * Usage (from v2/):
 *   node scripts/canon-numbers.mjs            regenerate design/canon-numbers.json
 *   node scripts/canon-numbers.mjs --check    verify the file matches canon.ts;
 *                                             exit 1 on any mismatch (drift guard,
 *                                             run by render.sh before every bake)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..', '..');
const dataDir = path.join(__dirname, '..', 'src', 'lib', 'data');
const OUT = path.join(REPO, 'design', 'canon-numbers.json');
const CHECK = process.argv.includes('--check');

const canonTs = fs.readFileSync(path.join(dataDir, 'canon.ts'), 'utf8');
const assetTs = fs.readFileSync(path.join(dataDir, 'asset-canonical.ts'), 'utf8');

// CANONICAL_ASSETS lookup (asset facts reference it instead of a literal).
const assets = {};
for (const m of assetTs.matchAll(/([a-zA-Z]+):\s*([\d_]+(?:\.\d+)?)/g)) assets[m[1]] = parseFloat(m[2].replace(/_/g, ''));

// Deterministic formatter (no locale dependence): "$741,111" / "2,660kg" / "496".
const group = (n) => {
  const [i, d] = String(n).split('.');
  return i.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (d ? '.' + d : '');
};
const fmt = (n, unit) => (unit === 'AUD' ? `$${group(n)}` : unit === 'kg' ? `${group(n)}kg` : group(n));

// Split canon.ts into per-fact chunks by id position (fact objects hold no nested braces).
const idMatches = [...canonTs.matchAll(/id:\s*'([a-z0-9-]+)'/g)];
const numbers = {};
for (let i = 0; i < idMatches.length; i++) {
  const chunk = canonTs.slice(idMatches[i].index, idMatches[i + 1]?.index ?? canonTs.length);
  const id = idMatches[i][1];
  const label = chunk.match(/label:\s*'([^']*)'/)?.[1] ?? id;
  const asAt = chunk.match(/asAt:\s*'([^']*)'/)?.[1] ?? null;
  const unit = chunk.match(/unit:\s*'([^']*)'/)?.[1] ?? null;
  const vm = chunk.match(/value:\s*(CANONICAL_ASSETS\.([a-zA-Z]+)|[\d_]+(?:\.\d+)?)\s*,/);
  if (!vm) continue; // string-valued fact (governance) — figures only here
  const raw = vm[2] != null ? assets[vm[2]] : parseFloat(vm[1].replace(/_/g, ''));
  if (raw == null || Number.isNaN(raw)) { console.error(`canon-numbers: cannot resolve value for '${id}'`); process.exit(1); }
  numbers[id] = { value: fmt(raw, unit), raw, unit, label, asAt };
}
if (!Object.keys(numbers).length) { console.error('canon-numbers: extracted 0 facts from canon.ts — parser drift?'); process.exit(1); }

const doc = {
  _comment: 'GENERATED from v2/src/lib/data/canon.ts by v2/scripts/canon-numbers.mjs — do not hand-edit. Artifacts reference these as CANON:num:<id>; canon-render.mjs bakes the formatted value. Verify with: node v2/scripts/canon-numbers.mjs --check',
  numbers,
};
const serialized = JSON.stringify(doc, null, 2) + '\n';

if (CHECK) {
  if (!fs.existsSync(OUT)) { console.error(`canon-numbers --check: ${path.relative(REPO, OUT)} missing — run canon-numbers.mjs to generate it.`); process.exit(1); }
  const onDisk = JSON.parse(fs.readFileSync(OUT, 'utf8'));
  const drift = [];
  for (const [id, f] of Object.entries(numbers)) {
    const d = onDisk.numbers?.[id];
    if (!d) drift.push(`${id}: missing from canon-numbers.json (canon.ts says ${f.value})`);
    else if (d.value !== f.value) drift.push(`${id}: canon-numbers.json has "${d.value}" but canon.ts says "${f.value}"`);
  }
  for (const id of Object.keys(onDisk.numbers || {})) if (!numbers[id]) drift.push(`${id}: in canon-numbers.json but no longer a numeric fact in canon.ts`);
  if (drift.length) {
    console.error('canon-numbers DRIFT — canon-numbers.json does not match canon.ts:');
    for (const d of drift) console.error(`  - ${d}`);
    console.error('Fix: node v2/scripts/canon-numbers.mjs   (canon.ts is the source of truth)');
    process.exit(1);
  }
  console.log(`canon-numbers --check OK — ${Object.keys(numbers).length} figures in lockstep with canon.ts`);
} else {
  fs.writeFileSync(OUT, serialized);
  console.log(`canon-numbers: ${Object.keys(numbers).length} figures -> ${path.relative(REPO, OUT)}`);
  for (const [id, f] of Object.entries(numbers)) console.log(`  ${id.padEnd(26)} ${f.value}`);
}
