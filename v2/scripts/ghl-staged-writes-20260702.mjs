#!/usr/bin/env node
/**
 * Apply the staged GHL writes from wiki/outputs/2026-07-02-investment-machine/03-machine-blueprint.md
 * section (e), as approved by Ben on 2026-07-02. DRY-RUN BY DEFAULT. Pass --commit to write.
 *
 * Executes ONLY the send-independent items:
 *   1. Add 4 new capital targets (LendForGood, Metro Finance, CommBank, Tripple)
 *      + 2 cost-offset partner rows (Sea Swift, INPEX), skipping any that already exist.
 *   2. Snow duplicate: move the historic $402,930 "Snow Foundation" Stewarding row to
 *      Renewing (if the stage exists) and correct its value to the Xero-sourced $493,130.
 *   3. Centrecorp: restore the vanished $123,332 historical row at Renewing/Stewarding.
 *   4. Triage the 22 Identified: tag the 28 Jun work-five needs-followup, park the rest monitor.
 *   5. Report (no writes): tag-family gaps across open opportunities.
 *
 * Deliberately NOT here (send-gated or needs a Ben decision):
 *   SEFA stage move (on send only) + $250K/$300K figure call; Minderoo stage correction
 *   (cannot verify whether a real ask went out); stalled-ask nudges (sends); dollar values
 *   for rows with no sourced figure.
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

// Source for every figure: wiki/outputs/2026-07-02-investment-machine/02-investor-targets.md
// Values are the conservative FLOOR of each stated indicative range, in dollars.
const NEW_ROWS = [
  { key: 'lendforgood', name: 'LendForGood — crowd-lent repayable via SIH (match candidate)', first: 'LendForGood', last: 'Platform', company: 'LendForGood', stage: /cultivat/i, value: 100000, tags: ['goods-capital-target', 'repayable-lender', 'warm', 'ready-to-send', 'beds'] },
  { key: 'metro finance', name: 'Metro Finance — MetroEco equipment finance (plant, match candidate)', first: 'Metro Finance', last: 'MetroEco', company: 'Metro Finance', stage: /qualified/i, value: 60000, tags: ['goods-capital-target', 'repayable-lender', 'warm', 'ready-to-send', 'nt-plant'] },
  { key: 'commbank', name: 'CommBank Green Equipment Finance — 1800 ASSETS eligibility call first', first: 'CommBank', last: 'Green Asset Finance', company: 'Commonwealth Bank', stage: /identified/i, value: 0, tags: ['goods-capital-target', 'repayable-lender', 'monitor', 'nt-plant'] },
  { key: 'tripple', name: 'Tripple — direct impact loan, post-QBE, intro via Snow (never match math)', first: 'Tripple', last: 'Investments', company: 'Tripple', stage: /identified/i, value: 0, tags: ['goods-capital-target', 'repayable-lender', 'warm', 'needs-followup', 'first-nations'] },
  { key: 'sea swift', name: 'Sea Swift — sponsorship + freight assistance (round opened 1 Jul 2026)', first: 'Sea Swift', last: 'Sponsorships', company: 'Sea Swift', stage: /identified/i, value: 0, tags: ['goods-partner-target', 'monitor'] },
  { key: 'inpex', name: 'INPEX Community Investment — rolling, NT focus (cost offset, not match)', first: 'INPEX', last: 'Community Investment', company: 'INPEX', stage: /identified/i, value: 0, tags: ['goods-partner-target', 'monitor'] },
];

const WORK_FIVE = [/sally knox/i, /john chambers/i, /imb bank/i, /east arnhem/i, /northern australian aboriginal/i];
const TAG_FAMILIES = {
  Class: ['goods-capital-target', 'goods-partner-target', 'goods-buyer-target'],
  Type: ['philanthropic-funder', 'repayable-lender', 'catalytic-blended', 'government-grant', 'corporate-esg'],
  Signal: ['warm', 'cold', 'qbe-t1', 'qbe-t2'],
  Action: ['ready-to-send', 'needs-followup', 'monitor', 'awaiting-reply'],
};

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
const act = (msg) => console.log(`  ${COMMIT ? '' : 'would: '}${msg}`);

async function main() {
  if (!TOKEN || !LOC) { console.error('Missing GHL creds in v2/.env.local'); process.exit(1); }
  console.log(`\n=== Staged GHL writes (blueprint 03 section e) — ${COMMIT ? 'COMMIT' : 'DRY-RUN'} ===\n`);

  const meta = await ghl('GET', `/opportunities/pipelines?locationId=${LOC}`);
  const pipeline = (meta.pipelines || []).find((p) => p.id === PIPELINE);
  if (!pipeline) { console.error('Supporter Journey pipeline not found.'); process.exit(1); }
  const stages = pipeline.stages || [];
  const stageBy = (re) => stages.find((s) => re.test(s.name));
  console.log(`Stages: ${stages.map((s) => s.name).join(' | ')}\n`);

  const opps = await fetchOpps();
  const open = opps.filter((o) => o.status === 'open');

  // 1. New rows
  console.log('-- 1. New capital targets --');
  for (const r of NEW_ROWS) {
    const exists = opps.find((o) => (o.name || '').toLowerCase().includes(r.key) || (o.contact?.companyName || '').toLowerCase().includes(r.key));
    if (exists) { console.log(`  already exists, skipping: "${exists.name}"`); continue; }
    const stage = stageBy(r.stage);
    if (!stage) { console.error(`  NO STAGE matching ${r.stage} for ${r.key}; skipping`); continue; }
    act(`create contact "${r.company}" [${r.tags.join(', ')}] + opp "${r.name}" @ ${stage.name} value $${r.value.toLocaleString()}`);
    if (COMMIT) {
      const c = await ghl('POST', `/contacts/`, {
        locationId: LOC, firstName: r.first, lastName: r.last, companyName: r.company,
        tags: r.tags, source: 'investment-machine staged writes 2026-07-02',
      });
      const contactId = c.contact?.id || c.id;
      await ghl('POST', `/opportunities/`, {
        pipelineId: PIPELINE, locationId: LOC, pipelineStageId: stage.id,
        name: r.name, monetaryValue: r.value, status: 'open', contactId,
      });
      console.log(`    created contact ${contactId} + opportunity`);
    }
  }

  // 2. Snow duplicate
  console.log('\n-- 2. Snow historic row --');
  const snowHist = open.find((o) => /^snow foundation$/i.test((o.name || '').trim()));
  if (!snowHist) console.log('  historic "Snow Foundation" row not found (maybe already resolved)');
  else {
    const renewing = stageBy(/renew/i);
    const targetStage = renewing || stageBy(/steward/i);
    act(`move "${snowHist.name}" ($${(snowHist.monetaryValue || 0).toLocaleString()}) -> ${renewing ? renewing.name : `NO Renewing stage; keeping ${targetStage?.name}`}, set value $493,130 (Xero-sourced, review call #5)`);
    if (COMMIT) {
      await ghl('PUT', `/opportunities/${snowHist.id}`, {
        pipelineId: PIPELINE, pipelineStageId: (renewing || targetStage).id,
        name: 'Snow Foundation — historical funding (Xero-reconciled)', monetaryValue: 493130, status: 'open',
      });
      console.log('    updated');
    }
  }

  // 3. Centrecorp restore
  console.log('\n-- 3. Centrecorp historical row --');
  const centreHist = opps.find((o) => /centrecorp/i.test(o.name || '') && Math.round(o.monetaryValue || 0) === 123332);
  if (centreHist) console.log(`  already present: "${centreHist.name}" (status ${centreHist.status})`);
  else {
    const centreAsk = open.find((o) => /centrecorp/i.test(o.name || ''));
    const stage = stageBy(/renew/i) || stageBy(/steward/i);
    if (!centreAsk?.contact?.id && !centreAsk?.contactId) console.log('  no existing Centrecorp contact found; SKIPPING restore (flag for Ben)');
    else {
      act(`create opp "Centrecorp — historical funding $123,332 (paid, acquitted)" @ ${stage.name} on existing contact`);
      if (COMMIT) {
        await ghl('POST', `/opportunities/`, {
          pipelineId: PIPELINE, locationId: LOC, pipelineStageId: stage.id,
          name: 'Centrecorp — historical funding $123,332 (paid, acquitted)', monetaryValue: 123332,
          status: 'open', contactId: centreAsk.contact?.id || centreAsk.contactId,
        });
        console.log('    created');
      }
    }
  }

  // 4. Identified triage
  console.log('\n-- 4. Triage the 22 Identified (28 Jun call) --');
  const identStage = stageBy(/identified/i);
  const ident = open.filter((o) => o.pipelineStageId === identStage?.id);
  for (const o of ident) {
    const contactId = o.contact?.id || o.contactId;
    const label = `${o.name}`.slice(0, 60);
    const isWork = WORK_FIVE.some((re) => re.test(o.name || '') || re.test(o.contact?.companyName || ''));
    const tag = isWork ? 'needs-followup' : 'monitor';
    const has = (o.contact?.tags || []).includes(tag);
    if (has) { console.log(`  ok (${tag}): ${label}`); continue; }
    if (!contactId) { console.log(`  NO CONTACT, skipping: ${label}`); continue; }
    act(`tag ${tag}: ${label}`);
    if (COMMIT) await ghl('POST', `/contacts/${contactId}/tags`, { tags: [tag] });
  }

  // 5. Tag-family gap report (read-only)
  console.log('\n-- 5. Tag-family gaps on open opportunities (report only, no writes) --');
  let gaps = 0;
  for (const o of open) {
    const tags = o.contact?.tags || [];
    const missing = Object.entries(TAG_FAMILIES).filter(([, list]) => !list.some((t) => tags.includes(t))).map(([f]) => f);
    if (missing.length) { gaps++; console.log(`  ${(o.name || '').slice(0, 55)} -> missing ${missing.join(', ')}`); }
  }
  console.log(`  ${gaps} of ${open.length} open opportunities missing at least one family`);

  console.log(`\nSKIPPED (send-gated or Ben's call): SEFA move+figure, Minderoo stage, stalled-ask nudges, unsourced values.`);
  console.log(`=== ${COMMIT ? 'DONE' : 'DRY-RUN complete — re-run with --commit to apply.'} ===\n`);
}
main().catch((e) => { console.error(e.message); process.exit(1); });
