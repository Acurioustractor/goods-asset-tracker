#!/usr/bin/env node
/**
 * Add the verified no-gate repayable lenders into the GHL Supporter Journey at
 * Cultivating, so they're tracked like every other capital target.
 * DRY-RUN BY DEFAULT. Pass --commit to write.
 *
 * Source: wiki/outputs/2026-06-27-funding-source-audit/02-verification-pass.md
 * (verified no ownership gate, repayable/concessional, move-now).
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
const PIPELINE = 'JvBFYpVpyKsw899lkFgj'; // Goods Supporter Journey
const COMMIT = process.argv.includes('--commit');
const headers = { Authorization: `Bearer ${TOKEN}`, Version: '2021-07-28', 'Content-Type': 'application/json' };

const LENDERS = [
  { name: 'First Nations Finance — working capital / equipment (no ownership gate)', first: 'First Nations Finance', last: 'Lender', company: 'First Nations Finance', value: 0 },
  { name: 'CEFC via NAB Green Equipment Finance — recycling plant (0.5% discount)', first: 'NAB Green Equipment Finance', last: '(CEFC)', company: 'NAB / CEFC', value: 0 },
  { name: 'Invest NT Business Investment Concessional Loans — NT plant', first: 'Invest NT', last: 'Concessional Loans', company: 'NT Government / Invest NT', value: 0 },
];

async function ghl(method, p, body) {
  const r = await fetch(`${BASE}${p}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!r.ok) throw new Error(`${method} ${p} -> ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}
async function fetchOpps() {
  const all = []; let sa = null, sai = null;
  for (let i = 0; i < 20; i++) {
    const qs = new URLSearchParams({ location_id: LOC, pipeline_id: PIPELINE, limit: '100' });
    if (sa) qs.set('startAfter', sa); if (sai) qs.set('startAfterId', sai);
    const d = await ghl('GET', `/opportunities/search?${qs}`); const o = d.opportunities || []; all.push(...o);
    if (o.length < 100 || !d.meta?.startAfterId) break; sa = d.meta.startAfter; sai = d.meta.startAfterId;
  }
  return all;
}

async function main() {
  if (!TOKEN || !LOC) { console.error('Missing GHL creds in v2/.env.local'); process.exit(1); }
  console.log(`\n=== Add repayable lenders -> Supporter Journey / Cultivating — ${COMMIT ? 'COMMIT' : 'DRY-RUN'} ===\n`);
  const meta = await ghl('GET', `/opportunities/pipelines?locationId=${LOC}`);
  const pipeline = (meta.pipelines || []).find((p) => p.id === PIPELINE);
  const cultivating = (pipeline?.stages || []).find((s) => /cultivat/i.test(s.name));
  if (!cultivating) { console.error('No Cultivating stage found.'); process.exit(1); }
  const opps = await fetchOpps();

  for (const l of LENDERS) {
    const exists = opps.find((o) => (o.name || '').toLowerCase().includes(l.first.toLowerCase()));
    if (exists) { console.log(`  (already exists: "${exists.name}")`); continue; }
    console.log(`  ${COMMIT ? 'CREATING' : 'would create'}: ${l.name}`);
    if (COMMIT) {
      const c = await ghl('POST', `/contacts/`, {
        locationId: LOC, firstName: l.first, lastName: l.last, companyName: l.company,
        tags: ['goods-capital-target', 'repayable-lender'], source: 'funding-pipeline skill',
      });
      const contactId = c.contact?.id || c.id;
      await ghl('POST', `/opportunities/`, {
        pipelineId: PIPELINE, locationId: LOC, pipelineStageId: cultivating.id,
        name: l.name, monetaryValue: l.value, status: 'open', contactId,
      });
      console.log(`    created contact ${contactId} + opportunity in Cultivating`);
    }
  }
  console.log(`\n=== ${COMMIT ? 'DONE' : 'DRY-RUN complete — re-run with --commit to apply.'} ===\n`);
}
main().catch((e) => { console.error(e.message); process.exit(1); });
