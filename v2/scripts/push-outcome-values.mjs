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
 * NEVER use the Supabase MCP for either project.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const APPLY = process.argv.includes('--apply');

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

if (!APPLY) {
  console.log(`\nDry run. ${writes.length} would be written. Pass --apply.`);
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
console.log(`\nWrote ${done} of ${writes.length}. No claim_label, no target_value and nothing about a storyteller was touched.`);
