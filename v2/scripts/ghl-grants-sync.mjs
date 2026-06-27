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
const RETIRE = [
  ['Women And Infants', 'CLOSED 10 Apr 2026 — off-mission (biomedical research)'],
  ['FLEXIBLE AGED CARE', 'Restricted/false positive — aged-care IT for funded providers'],
  ['Regional Business Gateways', 'NO-fit — funds QLD chambers/councils, not a manufacturer'],
  ['Indigenous Languages and Arts', 'CLOSED 16 Mar 2026 — off-mission (arts/languages); duplicate rows'],
  ['Dyslexia Speld', 'Not a grant — DSF sells PD, not a funder'],
  ['Qld Gives', 'CLOSED 12 Dec 2025 — NFP-only, wrong entity'],
  ['NAIDOC', 'CLOSED 19 Feb 2026 — off-mission (event funding)'],
  ['Agricultural Traceability', 'CLOSED 18 Feb 2026 — off-mission (ag traceability)'],
];
// "Various Indigenous Grants" is intentionally NOT retired — resolve to a named program.

// Verified OPEN grants to add (status open, in the Identified stage).
const ADD = [
  {
    name: 'SEDI Capability Building Grants (DSS) — open rolling ~early 2027, up to $120K, no ownership gate',
    monetaryValue: 120000,
    note: 'Verified open 2026-06-28. For-profit social enterprise eligible (Pathway 1). Funds capability services, not plant. EOI. https://www.dss.gov.au/social-impact-investing/social-enterprise-development-initiative',
  },
  {
    name: 'NT Advanced Manufacturing Ecosystem Fund — open rolling, $25K–$500K matched, no gate (the plant)',
    monetaryValue: 500000,
    note: 'Verified 2026-06-28 (confirm rolling status on NT page). Funds advanced-manufacturing capability — fits the On Country shred/melt/press plant. https://business.gov.au/grants-and-programs/advanced-manufacturing-ecosystem-fund-nt',
  },
];

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
  console.log(`Pipeline: ${pipeline?.name} | stages: ${stages.map((s) => s.name).join(', ')}`);
  console.log(`Add-stage for new grants: "${identified?.name}"\n`);

  const opps = await fetchOpps(GRANTS_PIPELINE);
  console.log(`Found ${opps.length} opportunities in the Grants pipeline.\n`);

  console.log('--- RETIRE (set status=abandoned + note) ---');
  for (const [needle, reason] of RETIRE) {
    const matches = opps.filter((o) => (o.name || '').toLowerCase().includes(needle.toLowerCase()) && o.status === 'open');
    if (!matches.length) { console.log(`  (no open match for "${needle}")`); continue; }
    for (const o of matches) {
      console.log(`  ${COMMIT ? 'RETIRING' : 'would retire'}: "${o.name}" [${o.id}] — ${reason}`);
      if (COMMIT) {
        await ghl('PUT', `/opportunities/${o.id}`, { pipelineId: GRANTS_PIPELINE, status: 'abandoned' });
      }
    }
  }

  console.log('\n--- ADD (create open opportunity) ---');
  for (const g of ADD) {
    const exists = opps.find((o) => (o.name || '').toLowerCase().includes(g.name.slice(0, 20).toLowerCase()));
    if (exists) { console.log(`  (already exists: "${exists.name}")`); continue; }
    console.log(`  ${COMMIT ? 'CREATING' : 'would create'}: "${g.name}" | $${g.monetaryValue}`);
    if (COMMIT) {
      await ghl('POST', `/opportunities/`, {
        pipelineId: GRANTS_PIPELINE, locationId: LOC, pipelineStageId: identified?.id,
        name: g.name, monetaryValue: g.monetaryValue, status: 'open',
      });
    }
  }

  console.log(`\n=== ${COMMIT ? 'DONE (writes committed)' : 'DRY-RUN complete — nothing written. Re-run with --commit to apply.'} ===\n`);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
