#!/usr/bin/env node
/**
 * READ-ONLY: the weekly "who needs a move" report for GHL pipelines.
 *
 * Groups everyone by stage and flags who needs attention: in-stage too long
 * with no recent touch (stale), so you can see at a glance who to move or
 * follow up. Writes NOTHING. This is the review surface; moves happen via
 * ghl-people-move.mjs (dry-run first).
 *
 * Usage:
 *   node ghl-people-pull.mjs                     # Goods Supporter Journey (funders/people)
 *   node ghl-people-pull.mjs --pipeline grants   # the Grants pipeline
 *   node ghl-people-pull.mjs --pipeline all      # every known pipeline
 *   node ghl-people-pull.mjs --stale 30          # staleness threshold in days (default 45)
 *   node ghl-people-pull.mjs --pipeline all --json   # machine-readable output to stdout
 *
 * An unknown --pipeline key exits non-zero and lists the valid keys. It never
 * silently falls back to funder.
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

// Every pipeline in the location, discovered 2026-07-02 via a read-only
// GET /opportunities/pipelines. Names come live from the API at runtime;
// the comments here are just a guide. There is no "partner" pipeline in GHL.
const PIPELINES = {
  funder: 'JvBFYpVpyKsw899lkFgj', // Goods Supporter Journey (the raise; default)
  grants: 'scom3L0kNwA1W0zPIzMe', // Grants
  buyer: 'FjMyJM3YzWQFmKqR9fur', // Goods Buyer Pipeline
  demand: 'UQsrmuqzxMSdCTklxEcG', // Goods Demand Register
  tractor: 'BvrCPnOcpPxIgpgrMbFF', // A Curious Tractor
  'empathy-ledger': 'aRGmSaMh62wPO2R0Bt4g', // Empathy Ledger
  'harvest-inbox': '5ZqAuFokM4LsNqMCMPmY', // Harvest Inbox
  'harvest-members': 'ijPN2jEoEuMshXXKbQ4z', // Harvest Membership Journey
  donors: 'QiK57emft8v05hxylmwA', // Supporters & Donors
  shop: 'Pdtr1ZIOvg3LrMSeNvHe', // The Shop pipeline
  inquiry: 'ggQw10DuH0XRji6keimS', // Universal Inquiry
  'contained-adelaide': 'SxzINmfZMjvqAMPmFCKa', // CONTAINED Adelaide 2026
  contained: 'vzatUY4dwN8t63ZoFIpH', // CONTAINED Engagement
};

const argv = process.argv.slice(2);
const arg = (name, def) => {
  const eq = argv.find((a) => a.startsWith(`${name}=`));
  if (eq) return eq.slice(name.length + 1);
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] != null ? argv[i + 1] : def;
};
const PIPELINE_KEY = arg('--pipeline', 'funder');
if (PIPELINE_KEY !== 'all' && !PIPELINES[PIPELINE_KEY]) {
  console.error(`Unknown pipeline key "${PIPELINE_KEY}".`);
  console.error(`Valid keys: ${Object.keys(PIPELINES).join(', ')}, all`);
  process.exit(1);
}
const KEYS = PIPELINE_KEY === 'all' ? Object.keys(PIPELINES) : [PIPELINE_KEY];
const AS_JSON = argv.includes('--json');
const STALE_DAYS = Number(arg('--stale', 45));
if (Number.isNaN(STALE_DAYS)) {
  console.error('--stale needs a number, e.g. --stale 45');
  process.exit(1);
}
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
  const byId = Object.fromEntries((meta.pipelines || []).map((p) => [p.id, p]));

  const out = { pulledAt: new Date().toISOString(), staleDays: STALE_DAYS, pipelines: [] };
  const needsMove = [];

  for (const key of KEYS) {
    const pid = PIPELINES[key];
    const pipeline = byId[pid];
    if (!pipeline) {
      console.error(`Pipeline key "${key}" (${pid}) no longer exists in GHL. Re-run discovery: GET /opportunities/pipelines`);
      process.exitCode = 1;
      continue;
    }
    const stageName = Object.fromEntries((pipeline.stages || []).map((s) => [s.id, s.name]));
    const order = (pipeline.stages || []).map((s) => s.id);

    const opps = (await fetchOpps(pid)).filter((o) => o.status === 'open');
    const byStage = {};
    for (const o of opps) (byStage[o.pipelineStageId] ||= []).push(o);

    if (AS_JSON) {
      out.pipelines.push({
        key,
        id: pid,
        name: pipeline.name,
        openCount: opps.length,
        stages: order.map((sid) => ({ name: stageName[sid], count: (byStage[sid] || []).length })),
        opportunities: opps.map((o) => ({
          id: o.id,
          contactId: o.contact?.id || o.contactId || null,
          name: o.name,
          org: o.contact?.companyName || o.contact?.name || null,
          stage: stageName[o.pipelineStageId] || o.pipelineStageId,
          // GHL monetaryValue is in dollars; 0 means unset, emitted as null.
          valueCents: o.monetaryValue ? Math.round(o.monetaryValue * 100) : null,
          tags: o.contact?.tags || [],
          updatedAt: o.updatedAt || null,
          assignedTo: o.assignedTo || null,
        })),
      });
      continue;
    }

    console.log(`\n=== ${pipeline.name} [${key}]: ${opps.length} open, by stage (stale = no update in ${STALE_DAYS}+ days) ===\n`);
    for (const sid of order) {
      const list = (byStage[sid] || []).sort((a, b) => (daysSince(b.updatedAt) ?? 0) - (daysSince(a.updatedAt) ?? 0));
      if (!list.length) continue;
      console.log(`▸ ${stageName[sid]}  (${list.length})`);
      for (const o of list) {
        const age = daysSince(o.updatedAt);
        const stale = age != null && age >= STALE_DAYS;
        const val = o.monetaryValue ? ` $${o.monetaryValue.toLocaleString()}` : '';
        console.log(`   ${stale ? '⚠ ' : '  '}${o.name}${val}  · ${age == null ? '?' : age + 'd'} since touch`);
        if (stale) needsMove.push({ name: o.name, pipeline: key, stage: stageName[sid], age });
      }
    }
  }

  if (AS_JSON) { console.log(JSON.stringify(out, null, 2)); return; }

  console.log(`\n--- NEEDS A TOUCH OR MOVE (${needsMove.length}) ---`);
  for (const n of needsMove.sort((a, b) => b.age - a.age)) console.log(`  ${n.age}d  [${n.pipeline}: ${n.stage}]  ${n.name}`);
  console.log(`\nReview these, decide one next action each, then move with ghl-people-move.mjs (dry-run first).`);
}
main().catch((e) => { console.error(e.message); process.exit(1); });
