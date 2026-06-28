#!/usr/bin/env node
/**
 * READ-ONLY: the weekly "who needs a move" report for a GHL people pipeline.
 *
 * Groups everyone by stage and flags who needs attention: in-stage too long
 * with no recent touch (stale), so you can see at a glance who to move or
 * follow up. Writes NOTHING. This is the review surface; moves happen via
 * ghl-people-move.mjs (dry-run first).
 *
 * Usage:
 *   node ghl-people-pull.mjs                 # Goods Supporter Journey (funders/people)
 *   node ghl-people-pull.mjs --pipeline buyer   # or: partner
 *   node ghl-people-pull.mjs --stale 30      # staleness threshold in days (default 45)
 */
import fs from 'node:fs';
import path from 'node:path';

const ENV_PATH = path.join(process.cwd(), '.env.local');
if (fs.existsSync(ENV_PATH)) {
  for (const line of fs.readFileSync(ENV_PATH, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
const TOKEN = process.env.GHL_API_KEY;
const LOC = process.env.GHL_LOCATION_ID;
const BASE = 'https://services.leadconnectorhq.com';
const headers = { Authorization: `Bearer ${TOKEN}`, Version: '2021-07-28', 'Content-Type': 'application/json' };

// The people pipelines (funders are the main one for the raise).
const PIPELINES = {
  funder: 'JvBFYpVpyKsw899lkFgj', // Goods Supporter Journey
};
const arg = (name, def) => { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : def; };
const PIPELINE = PIPELINES[arg('--pipeline', 'funder')] || PIPELINES.funder;
const STALE_DAYS = Number(arg('--stale', 45));
const NOW = Date.now();

async function ghl(method, urlPath) {
  const res = await fetch(`${BASE}${urlPath}`, { method, headers });
  if (!res.ok) throw new Error(`${method} ${urlPath} -> ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}
async function fetchOpps(pipelineId) {
  const all = []; let sa = null, sai = null;
  for (let i = 0; i < 20; i++) {
    const qs = new URLSearchParams({ location_id: LOC, pipeline_id: pipelineId, limit: '100' });
    if (sa) qs.set('startAfter', sa); if (sai) qs.set('startAfterId', sai);
    const data = await ghl('GET', `/opportunities/search?${qs}`);
    const opps = data.opportunities || []; all.push(...opps);
    if (opps.length < 100 || !data.meta?.startAfterId) break;
    sa = data.meta.startAfter; sai = data.meta.startAfterId;
  }
  return all;
}
const daysSince = (d) => d ? Math.floor((NOW - new Date(d).getTime()) / 86400000) : null;

async function main() {
  if (!TOKEN || !LOC) { console.error('Missing GHL creds in v2/.env.local'); process.exit(1); }
  const meta = await ghl('GET', `/opportunities/pipelines?locationId=${LOC}`);
  const pipeline = (meta.pipelines || []).find((p) => p.id === PIPELINE);
  const stageName = Object.fromEntries((pipeline?.stages || []).map((s) => [s.id, s.name]));
  const order = (pipeline?.stages || []).map((s) => s.id);

  const opps = (await fetchOpps(PIPELINE)).filter((o) => o.status === 'open');
  const byStage = {};
  for (const o of opps) (byStage[o.pipelineStageId] ||= []).push(o);

  console.log(`\n=== ${pipeline?.name} — ${opps.length} open, by stage (stale = no update in ${STALE_DAYS}+ days) ===\n`);
  const needsMove = [];
  for (const sid of order) {
    const list = (byStage[sid] || []).sort((a, b) => (daysSince(b.updatedAt) ?? 0) - (daysSince(a.updatedAt) ?? 0));
    if (!list.length) continue;
    console.log(`▸ ${stageName[sid]}  (${list.length})`);
    for (const o of list) {
      const age = daysSince(o.updatedAt);
      const stale = age != null && age >= STALE_DAYS;
      const val = o.monetaryValue ? ` $${o.monetaryValue.toLocaleString()}` : '';
      console.log(`   ${stale ? '⚠ ' : '  '}${o.name}${val}  · ${age == null ? '?' : age + 'd'} since touch`);
      if (stale) needsMove.push({ name: o.name, stage: stageName[sid], age });
    }
  }
  console.log(`\n--- NEEDS A TOUCH OR MOVE (${needsMove.length}) ---`);
  for (const n of needsMove.sort((a, b) => b.age - a.age)) console.log(`  ${n.age}d  [${n.stage}]  ${n.name}`);
  console.log(`\nReview these, decide one next action each, then move with ghl-people-move.mjs (dry-run first).`);
}
main().catch((e) => { console.error(e.message); process.exit(1); });
