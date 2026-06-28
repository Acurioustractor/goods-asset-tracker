#!/usr/bin/env node
/**
 * Move a person to a new stage in a GHL people pipeline. DRY-RUN BY DEFAULT.
 *
 * One real event = one stage forward. (met them -> Cultivating; sent the ask
 * -> Ask made; they said yes -> Committed; money in -> Stewarding.)
 *
 * Usage:
 *   node ghl-people-move.mjs "Eloise Hall" "Ask made"            # dry-run
 *   node ghl-people-move.mjs "Eloise Hall" "Ask made" --commit   # apply
 *   node ghl-people-move.mjs --pipeline funder "Snow" "Renewing" --commit
 *
 * Matches the person by name substring (must be unique). Prints the exact
 * before/after. The only write is the gated stage change.
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
const TOKEN = process.env.GHL_API_KEY, LOC = process.env.GHL_LOCATION_ID;
const BASE = 'https://services.leadconnectorhq.com';
const headers = { Authorization: `Bearer ${TOKEN}`, Version: '2021-07-28', 'Content-Type': 'application/json' };
const PIPELINES = { funder: 'JvBFYpVpyKsw899lkFgj' };

const args = process.argv.slice(2);
const COMMIT = args.includes('--commit');
const pipeFlag = args.indexOf('--pipeline');
const PIPELINE = pipeFlag >= 0 ? (PIPELINES[args[pipeFlag + 1]] || PIPELINES.funder) : PIPELINES.funder;
const positional = args.filter((a, i) => !a.startsWith('--') && args[i - 1] !== '--pipeline');
const [NAME, STAGE] = positional;

async function ghl(method, urlPath, body) {
  const res = await fetch(`${BASE}${urlPath}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
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

async function main() {
  if (!TOKEN || !LOC) { console.error('Missing GHL creds in v2/.env.local'); process.exit(1); }
  if (!NAME || !STAGE) { console.error('Usage: node ghl-people-move.mjs "Name" "Target Stage" [--commit]'); process.exit(1); }

  const meta = await ghl('GET', `/opportunities/pipelines?locationId=${LOC}`);
  const pipeline = (meta.pipelines || []).find((p) => p.id === PIPELINE);
  const stages = pipeline?.stages || [];
  const target = stages.find((s) => s.name.toLowerCase().includes(STAGE.toLowerCase()));
  if (!target) { console.error(`No stage matching "${STAGE}". Stages: ${stages.map((s) => s.name).join(', ')}`); process.exit(1); }
  const stageName = Object.fromEntries(stages.map((s) => [s.id, s.name]));

  const matches = (await fetchOpps(PIPELINE)).filter((o) => o.status === 'open' && (o.name || '').toLowerCase().includes(NAME.toLowerCase()));
  if (matches.length === 0) { console.error(`No open person matching "${NAME}".`); process.exit(1); }
  if (matches.length > 1) { console.error(`"${NAME}" matches ${matches.length}: ${matches.map((o) => o.name).join(' | ')}. Be more specific.`); process.exit(1); }
  const o = matches[0];

  console.log(`\n${COMMIT ? 'MOVING' : 'DRY-RUN'}: ${o.name}`);
  console.log(`   ${stageName[o.pipelineStageId]}  ->  ${target.name}`);
  if (o.pipelineStageId === target.id) { console.log('   (already in that stage — nothing to do)'); return; }
  if (COMMIT) {
    await ghl('PUT', `/opportunities/${o.id}`, { pipelineId: PIPELINE, pipelineStageId: target.id });
    console.log('   done.');
  } else {
    console.log('   re-run with --commit to apply.');
  }
}
main().catch((e) => { console.error(e.message); process.exit(1); });
