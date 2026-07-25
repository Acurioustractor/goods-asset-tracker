#!/usr/bin/env node
/**
 * GHL Grants pipeline sync — retire verified-dead rows, add verified-open grants.
 *
 * DRY-RUN BY DEFAULT. Prints exactly what it would do and writes NOTHING.
 * Pass --commit to actually write (only after Ben has seen the dry-run).
 *
 * Source of truth for what's dead/open: wiki/outputs/2026-06-28-funding-refresh/
 * (00-open-now.md + 02-retire.md), produced by the funding-pipeline skill with
 * live date verification. A high relevance score is a lead, not a fact.
 *
 * Reads creds from v2/.env.local (GHL_API_KEY, GHL_LOCATION_ID). Read-only GETs
 * to plan; the only writes are gated behind --commit.
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
const GRANTS_PIPELINE = 'scom3L0kNwA1W0zPIzMe';
const COMMIT = process.argv.includes('--commit');
const headers = { Authorization: `Bearer ${TOKEN}`, Version: '2021-07-28', 'Content-Type': 'application/json' };

// Verified DEAD rows to retire (status -> abandoned), matched by name substring.
// Updated 2026-07-23 to the current funding refresh (wiki/outputs/2026-07-23-funding-refresh/).
// Prior (June) retire list is in git history; those were applied in the 3 Jul run.
const RETIRE = [
  ['NT Advanced Manufacturing Ecosystem Fund', 'CLOSED to applications on business.gov.au (live-verified 2026-07-23); this round done. Reclassify open->watch. Email applications@amgc.org.au for the reopen date. Watch is tracked in the Notion Funder Pipeline; do not lose the relationship.'],
];

// Verified OPEN grants to add (status open, in the Identified stage).
// 2026-07-23: nothing to add to GHL. The two new items (Westpac Inclusive Employment,
// Federal RMF next round) are WATCHES with no live open date, so they live in the Notion
// Funder Pipeline (Bucket=Workbench, Priority=Monitor), not as open GHL opportunities.
const ADD = [];

async function ghl(method, urlPath, body) {
  const res = await fetch(`${BASE}${urlPath}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error(`${method} ${urlPath} -> ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

async function fetchOpps(pipelineId) {
  const all = [];
  let startAfter = null, startAfterId = null;
  for (let i = 0; i < 20; i++) {
    const qs = new URLSearchParams({ location_id: LOC, pipeline_id: pipelineId, limit: '100' });
    if (startAfter) qs.set('startAfter', startAfter);
    if (startAfterId) qs.set('startAfterId', startAfterId);
    const data = await ghl('GET', `/opportunities/search?${qs}`);
    const opps = data.opportunities || [];
    all.push(...opps);
    if (opps.length < 100 || !data.meta?.startAfterId) break;
    startAfter = data.meta.startAfter; startAfterId = data.meta.startAfterId;
  }
  return all;
}

async function main() {
  if (!TOKEN || !LOC) { console.error('Missing GHL_API_KEY / GHL_LOCATION_ID in v2/.env.local'); process.exit(1); }
  console.log(`\n=== GHL Grants sync — ${COMMIT ? 'COMMIT (writing!)' : 'DRY-RUN (no writes)'} ===\n`);

  const meta = await ghl('GET', `/opportunities/pipelines?locationId=${LOC}`);
  const pipeline = (meta.pipelines || []).find((p) => p.id === GRANTS_PIPELINE);
  const stages = pipeline?.stages || [];
  const identified = stages.find((s) => /identif/i.test(s.name)) || stages[0];
  const declined = stages.find((s) => /declin|lost|closed|abandon/i.test(s.name)) || null;
  console.log(`Pipeline: ${pipeline?.name} | stages: ${stages.map((s) => s.name).join(', ')}`);
  console.log(`Add-stage for new grants: "${identified?.name}" | Retire-stage: "${declined?.name || '(none — will use status=lost)'}"\n`);

  const opps = await fetchOpps(GRANTS_PIPELINE);
  console.log(`Found ${opps.length} opportunities in the Grants pipeline.\n`);

  const retireBody = declined
    ? { pipelineId: GRANTS_PIPELINE, pipelineStageId: declined.id, status: 'lost' }
    : { pipelineId: GRANTS_PIPELINE, status: 'lost' };
  console.log(`--- RETIRE (move to "${declined?.name || 'lost'}" + status=lost) ---`);
  for (const [needle, reason] of RETIRE) {
    const matches = opps.filter((o) => (o.name || '').toLowerCase().includes(needle.toLowerCase()) && o.status === 'open');
    if (!matches.length) { console.log(`  (no open match for "${needle}")`); continue; }
    for (const o of matches) {
      console.log(`  ${COMMIT ? 'RETIRING' : 'would retire'}: "${o.name}" [${o.id}] — ${reason}`);
      if (COMMIT) {
        await ghl('PUT', `/opportunities/${o.id}`, retireBody);
      }
    }
  }

  console.log('\n--- ADD (create program contact + open opportunity) ---');
  for (const g of ADD) {
    const exists = opps.find((o) => (o.name || '').toLowerCase().includes(g.name.slice(0, 20).toLowerCase()));
    if (exists) { console.log(`  (already exists: "${exists.name}")`); continue; }
    console.log(`  ${COMMIT ? 'CREATING' : 'would create'}: contact "${g.contactName}" + opp "${g.name}" | $${g.monetaryValue}`);
    if (COMMIT) {
      const c = await ghl('POST', `/contacts/`, {
        locationId: LOC, firstName: g.contactName, lastName: 'Grant Program', companyName: g.contactCompany,
        tags: ['goods-grant-program', 'goods-capital-target'], source: 'funding-pipeline skill',
      });
      const contactId = c.contact?.id || c.id;
      await ghl('POST', `/opportunities/`, {
        pipelineId: GRANTS_PIPELINE, locationId: LOC, pipelineStageId: identified?.id,
        name: g.name, monetaryValue: g.monetaryValue, status: 'open', contactId,
      });
      console.log(`    created contact ${contactId} + opportunity`);
    }
  }

  console.log(`\n=== ${COMMIT ? 'DONE (writes committed)' : 'DRY-RUN complete — nothing written. Re-run with --commit to apply.'} ===\n`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
