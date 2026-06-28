#!/usr/bin/env node
/**
 * Apply Type + Action tags to GHL Supporter Journey contacts, so the GHL board
 * filters the same way the Notion Funder Pipeline does. DRY-RUN BY DEFAULT.
 *
 * Type tag: from funder type (repayable-lender / philanthropic / catalytic / buyer).
 * Action tag: from stage (ready-to-send / needs-followup / awaiting-reply /
 *             cultivate / monitor). Tags are ADDED (existing tags untouched).
 *
 * Usage:  node ghl-apply-tags.mjs          # dry-run
 *         node ghl-apply-tags.mjs --commit  # apply
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
const PIPELINE = 'JvBFYpVpyKsw899lkFgj';
const COMMIT = process.argv.includes('--commit');
const headers = { Authorization: `Bearer ${TOKEN}`, Version: '2021-07-28', 'Content-Type': 'application/json' };

const typeTag = (name) => {
  const n = name.toLowerCase();
  if (/sefa|first nations finance|cefc|\bnab\b|invest nt|\biba\b/.test(n)) return 'repayable-lender';
  if (/qbe|real innovation|minderoo|eloise/.test(n)) return 'catalytic';
  if (/centrecorp|groote|mala'la|julalikari/.test(n)) return 'buyer';
  return 'philanthropic';
};
const READY = ['sefa', 'first nations finance', 'cefc', 'invest nt'];
const actionTag = (name, stage) => {
  const n = name.toLowerCase();
  if (stage === 'Cultivating') return READY.some((r) => n.includes(r)) ? 'ready-to-send' : 'cultivate';
  if (stage === 'Ask made') return /real innovation/.test(n) ? 'awaiting-reply' : 'needs-followup';
  if (stage === 'Delivering') return 'awaiting-reply';
  if (stage === 'Renewing') return 'cultivate';
  return 'monitor'; // Identified, Qualified, Stewarding
};

async function ghl(method, p, body) {
  const r = await fetch(`${BASE}${p}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  if (!r.ok) throw new Error(`${method} ${p} -> ${r.status}: ${(await r.text()).slice(0, 160)}`);
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
  console.log(`\n=== Apply Type + Action tags — ${COMMIT ? 'COMMIT' : 'DRY-RUN'} ===\n`);
  const meta = await ghl('GET', `/opportunities/pipelines?locationId=${LOC}`);
  const pipeline = (meta.pipelines || []).find((p) => p.id === PIPELINE);
  const stageName = Object.fromEntries((pipeline?.stages || []).map((s) => [s.id, s.name]));
  const opps = (await fetchOpps()).filter((o) => o.status === 'open');

  let tagged = 0, missing = 0;
  for (const o of opps) {
    const stage = stageName[o.pipelineStageId];
    const tags = [typeTag(o.name), actionTag(o.name, stage)];
    const contactId = o.contactId || o.contact?.id;
    if (!contactId) { console.log(`  ! no contact for "${o.name}" (skip)`); missing++; continue; }
    console.log(`  ${COMMIT ? 'TAG' : 'would tag'} [${stage}] ${o.name.slice(0, 50)}  ->  ${tags.join(', ')}`);
    if (COMMIT) { await ghl('POST', `/contacts/${contactId}/tags`, { tags }); tagged++; }
  }
  console.log(`\n=== ${COMMIT ? `DONE — tagged ${tagged}, ${missing} missing contact` : 'DRY-RUN — re-run with --commit'} ===\n`);
}
main().catch((e) => { console.error(e.message); process.exit(1); });
