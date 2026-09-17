/**
 * Goods canon into the Empathy Ledger impact model.
 *
 * DRY RUN BY DEFAULT. Pass --apply to write.
 *
 *   node --env-file=.env.local scripts/push-outcome-values.mjs
 *   node --env-file=.env.local scripts/push-outcome-values.mjs --apply
 *
 * Reads src/lib/data/outcome-feed.ts, which decides per outcome whether a Goods figure honestly
 * answers it. Two rules govern that file and this script exists to obey them:
 *
 *   Only GREEN canon facts cross into another system, because writing into another database is
 *   auto-publishing and red is recipient and storyteller data.
 *
 *   The same word is not the same measure. Beds deployed is not beds in inventory. Voices cleared
 *   for external use is not storytellers with a transcript. A near-miss written into a null is
 *   worse than the null, because the null is visibly missing and the wrong figure is not.
 *
 * It writes current_value, measurement_date, measurement_method and data_quality, and never
 * touches claim_label, target_value or anything about a storyteller. The measurement_method it
 * writes names the canon fact and its source, so a reader in Empathy Ledger can check the figure
 * without access to this repo.
 *
 * With --check it writes nothing and exits non-zero when an outcome it feeds has fallen behind
 * canon. That is the mode check:drift runs, because a snapshot pushed once decays: canon moves
 * when the register moves, and an impact model quoting last quarter's number is worse than one
 * quoting none. Reads and writes stay separate modes of the same file so the two can never parse
 * canon differently.
 *
 * With --create it also creates the outcomes in PROPOSED_OUTCOMES: verified Goods figures that
 * Empathy Ledger has no row for at all. Same two rules apply, and each new row carries the canon
 * fact id, its source and its asAt in measurement_method, so the figure can be checked from inside
 * Empathy Ledger without this repo.
 *
 * NEVER use the Supabase MCP for either project.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const APPLY = process.argv.includes('--apply');
const CREATE = process.argv.includes('--create');
/** Read-only. Exits non-zero when Empathy Ledger disagrees with canon. Wired into check:drift. */
const CHECK = process.argv.includes('--check');

// The .ts module is the source of truth. This mirrors its literals with a regex, because a plain
// node script cannot load TypeScript, and a guard test asserts the two agree.
const src = readFileSync(new URL('../src/lib/data/outcome-feed.ts', import.meta.url), 'utf8');
const feeds = [...src.matchAll(/outcomeId: '([^']+)',\s*\n\s*outcomeTitle: '((?:[^'\\]|\\.)*)',\s*\n\s*verdict: '([^']+)',([\s\S]*?)\n  \},/g)].map((m) => {
  const body = m[4];
  const lit = /literalValue: (-?\d+(?:\.\d+)?)/.exec(body);
  const canonId = /canonId: '([^']+)'/.exec(body);
  const method = /method:\s*\n?\s*'((?:[^'\\]|\\.)*)'/.exec(body);
  const why = /why:\s*\n?\s*'((?:[^'\\]|\\.)*)'/.exec(body);
  return {
    id: m[1],
    title: m[2].replace(/\\'/g, "'"),
    verdict: m[3],
    literalValue: lit ? Number(lit[1]) : null,
    canonId: canonId ? canonId[1] : null,
    method: method ? method[1].replace(/\\'/g, "'") : '',
    why: why ? why[1].replace(/\\'/g, "'") : '',
  };
});

if (feeds.length === 0) {
  console.error('Parsed no feeds from outcome-feed.ts. The parser and the file have drifted.');
  process.exit(1);
}

const el = createClient(process.env.EMPATHY_LEDGER_SUPABASE_URL, process.env.EMPATHY_LEDGER_SUPABASE_KEY);
const projectId = process.env.EMPATHY_LEDGER_PROJECT_ID;
// Read from the existing Goods-scoped outcomes on 17 September 2026, so a created row lands in
// the same organisation and tenant as the four that are already there.
const ORG_ID = 'c312323e-02d4-493c-8b5f-9f9b15e2b46a';
const TENANT_ID = 'a1adca53-4c80-44b3-a859-e9e12b40e1a8';
// service_area is NOT NULL. All four existing Goods outcomes use this one.
const SERVICE_AREA = 'Circular economy';

const { data: outcomes, error } = await el
  .from('outcomes')
  .select('id,title,current_value,unit,claim_label,measurement_date')
  .eq('project_id', projectId);
if (error) { console.error('outcomes read failed:', error.message); process.exit(1); }

const byId = new Map(outcomes.map((o) => [o.id, o]));
const today = new Date().toISOString().slice(0, 10);

console.log(`Goods-scoped outcomes in Empathy Ledger: ${outcomes.length}. Feeds declared: ${feeds.length}.\n`);

const writes = [];
for (const f of feeds) {
  const o = byId.get(f.id);
  if (!o) { console.log(`  MISSING  ${f.title}\n           no outcome with that id in this project any more`); continue; }
  if (f.verdict !== 'feeds') {
    console.log(`  HELD     ${o.title}`);
    console.log(`           ${f.why}`);
    continue;
  }
  const value = f.literalValue;
  console.log(`  FEEDS    ${o.title}`);
  console.log(`           ${o.current_value === null ? 'null' : o.current_value} -> ${value} ${o.unit ?? ''}`);
  writes.push({ id: f.id, value, method: f.method });
}

// ── PROPOSED_OUTCOMES: figures Empathy Ledger has no outcome for ──────────────────────────────
const proposed = [...src.matchAll(/\{ canonId: '([^']+)', indicator: '((?:[^'\\]|\\.)*)', level: '([^']+)', unit: '([^']+)' \}/g)]
  .map((m) => ({ canonId: m[1], indicator: m[2].replace(/\\'/g, "'"), level: m[3], unit: m[4] }));

// Mirrors CANON in src/lib/data/canon.ts for the green facts this script may write.
const canonSrc = readFileSync(new URL('../src/lib/data/canon.ts', import.meta.url), 'utf8');
function canonRow(id) {
  const block = new RegExp(`id: '${id}', label: '((?:[^'\\\\]|\\\\.)*)', value: ([^,]+), unit: '([^']*)'([\\s\\S]*?)\\n  \\},`).exec(canonSrc);
  if (!block) return null;
  const rest = block[4];
  const grade = /dataClass: '([a-z]+)'/.exec(rest);
  const asAt = /asAt: '([^']+)'/.exec(rest);
  const source = /source: '((?:[^'\\]|\\.)*)'/.exec(rest);
  const claim = /claimLabel: '([a-z-]+)'/.exec(rest);
  return {
    id, label: block[1].replace(/\\'/g, "'"),
    raw: block[2].trim(), unit: block[3],
    dataClass: grade ? grade[1] : null,
    asAt: asAt ? asAt[1] : null,
    source: source ? source[1].replace(/\\'/g, "'") : '',
    claimLabel: claim ? claim[1] : null,
  };
}

// The asset figures are computed from CANONICAL_ASSETS, so read them from there.
const assetSrc = readFileSync(new URL('../src/lib/data/asset-canonical.ts', import.meta.url), 'utf8');
const assetNum = (key) => {
  const m = new RegExp(`${key}:\\s*([0-9_]+)`).exec(assetSrc);
  return m ? Number(m[1].replace(/_/g, '')) : null;
};
const CANON_VALUE = {
  'beds-deployed': assetNum('bedsDeployed'),
  'stretch-beds-deployed': assetNum('stretchBedsDeployed'),
  'washers-in-community': assetNum('washersInCommunity'),
  'communities-served': assetNum('communitiesServed'),
  'plastic-kg': assetNum('plasticKg'),
};

const byTitle = new Map(outcomes.map((o) => [(o.title ?? '').toLowerCase(), o]));
const existingTitles = new Set(byTitle.keys());
const stale = [];
const creates = [];
if (proposed.length) {
  console.log(`\nProposed outcomes Empathy Ledger has no row for: ${proposed.length}`);
  for (const p of proposed) {
    const fact = canonRow(p.canonId);
    if (!fact) { console.log(`  SKIP     ${p.indicator}: canon fact ${p.canonId} not parsed`); continue; }
    if (fact.dataClass !== 'green') { console.log(`  BLOCKED  ${p.indicator}: canon fact is ${fact.dataClass}`); continue; }
    const value = CANON_VALUE[p.canonId];
    if (value === null || value === undefined) { console.log(`  SKIP     ${p.indicator}: no value resolved`); continue; }
    if (existingTitles.has(p.indicator.toLowerCase())) {
      const row = byTitle.get(p.indicator.toLowerCase());
      if (Number(row.current_value) !== Number(value)) {
        console.log(`  BEHIND   ${p.indicator}: Empathy Ledger has ${row.current_value}, canon says ${value}`);
        stale.push({ id: row.id, title: p.indicator, from: row.current_value, value, asAt: fact.asAt, unit: p.unit, fact });
      } else {
        console.log(`  CURRENT  ${p.indicator}: ${value} ${p.unit}`);
      }
      continue;
    }
    console.log(`  CREATE   ${p.indicator}: ${value} ${p.unit}  [${fact.claimLabel}, ${fact.dataClass}, asAt ${fact.asAt}]`);
    creates.push({
      title: p.indicator,
      indicator_name: p.indicator,
      claim_label: fact.claimLabel === 'internal-only' ? 'internal_only' : fact.claimLabel,
      outcome_level: p.level,
      outcome_type: 'community',
      current_value: value,
      unit: p.unit,
      measurement_date: fact.asAt,
      data_quality: 'good',
      measurement_method: `Goods canon.ts fact "${fact.id}" (${fact.label}), value ${value} ${p.unit}, confirmed against its source on ${fact.asAt}. Source: ${fact.source} Guarded by check-asset-drift.mjs, which fails the Goods build when the live register stops agreeing with this figure.`,
      project_id: projectId,
      organization_id: ORG_ID,
      tenant_id: TENANT_ID,
      service_area: SERVICE_AREA,
    });
  }
}

if (CHECK) {
  if (stale.length) {
    console.error(`\n${stale.length} outcome${stale.length === 1 ? ' has' : 's have'} fallen behind canon:`);
    for (const s2 of stale) console.error(`  - ${s2.title}: Empathy Ledger ${s2.from}, canon ${s2.value} (confirmed ${s2.asAt})`);
    console.error('\nRun: npm run push:outcomes -- --create --apply');
    process.exit(1);
  }
  console.log('\nEvery fed outcome matches canon.');
  process.exit(0);
}

if (!APPLY) {
  console.log(`\nDry run. ${writes.length} value${writes.length === 1 ? '' : 's'} would be written${CREATE ? `, ${creates.length} outcome${creates.length === 1 ? '' : 's'} created` : ''}${stale.length ? `, ${stale.length} refreshed` : ''}. Pass --apply${CREATE ? '' : ' --create'}.`);
  process.exit(0);
}

let done = 0;
for (const w of writes) {
  const { error: uErr } = await el
    .from('outcomes')
    .update({
      current_value: w.value,
      measurement_date: today,
      measurement_method: w.method,
      data_quality: 'good',
    })
    .eq('id', w.id);
  if (uErr) console.error(`  failed on ${w.id}: ${uErr.message}`);
  else done += 1;
}
console.log(`\nWrote ${done} of ${writes.length} value${writes.length === 1 ? '' : 's'}. No claim_label, no target_value and nothing about a storyteller was touched.`);

for (const s2 of stale) {
  const { error: sErr } = await el
    .from('outcomes')
    .update({
      current_value: s2.value,
      measurement_date: s2.asAt,
      data_quality: 'good',
      measurement_method: `Goods canon.ts fact "${s2.fact.id}" (${s2.fact.label}), value ${s2.value} ${s2.unit}, confirmed against its source on ${s2.asAt}. Source: ${s2.fact.source} Guarded by check-asset-drift.mjs, which fails the Goods build when the live register stops agreeing with this figure.`,
    })
    .eq('id', s2.id);
  if (sErr) console.error(`  refresh failed on ${s2.title}: ${sErr.message}`);
  else console.log(`  refreshed ${s2.title}: ${s2.from} -> ${s2.value}`);
}

if (CREATE && creates.length) {
  const { data: made, error: cErr2 } = await el.from('outcomes').insert(creates).select('id,title,current_value,unit');
  if (cErr2) { console.error('create failed:', cErr2.message); process.exit(1); }
  console.log(`Created ${made.length} outcome${made.length === 1 ? '' : 's'}:`);
  for (const m of made) console.log(`  ${m.title}: ${m.current_value} ${m.unit ?? ''}`);
}
