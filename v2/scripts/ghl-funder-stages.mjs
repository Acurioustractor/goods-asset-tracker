#!/usr/bin/env node
/**
 * READ-ONLY: pull opportunities (with engagement stage + value) from the
 * capital/funder pipelines that the first pull missed. The STRATEGIC_* env
 * ids all point at the Buyer pipeline; the warm funder relationships live in
 * "Goods Supporter Journey" and "Grants". Stage = the warmth signal we rank on.
 *
 * Output: tmp/ghl-funder-stages.json + .md   (NEVER writes to GHL)
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
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PIPELINES = {
  'Goods Supporter Journey': 'JvBFYpVpyKsw899lkFgj',
  Grants: 'scom3L0kNwA1W0zPIzMe',
  'Supporters & Donors': 'QiK57emft8v05hxylmwA',
};

async function ghl(method, urlPath) {
  const res = await fetch(`${BASE}${urlPath}`, { method, headers });
  if (!res.ok) throw new Error(`${method} ${urlPath} -> ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

async function getPipelineMeta() {
  const data = await ghl('GET', `/opportunities/pipelines?locationId=${LOC}`);
  return Object.fromEntries((data.pipelines || []).map((p) => [p.id, p]));
}

async function fetchOpps(pipelineId) {
  const all = [];
  let startAfter = null, startAfterId = null;
  while (true) {
    const q = new URLSearchParams({ location_id: LOC, pipeline_id: pipelineId, limit: '100' });
    if (startAfter) q.set('startAfter', startAfter);
    if (startAfterId) q.set('startAfterId', startAfterId);
    const data = await ghl('GET', `/opportunities/search?${q.toString()}`);
    const opps = data.opportunities || [];
    all.push(...opps);
    const meta = data.meta || {};
    if (opps.length < 100 || !meta.startAfter) break;
    startAfter = meta.startAfter; startAfterId = meta.startAfterId;
    await sleep(600);
  }
  return all;
}

async function main() {
  const meta = await getPipelineMeta();
  const out = {};
  const lines = [`# GHL funder/capital pipeline stages — ${new Date().toISOString()}`, '', 'Read-only.', ''];
  for (const [name, pid] of Object.entries(PIPELINES)) {
    const pipe = meta[pid];
    const stageName = (id) => (pipe?.stages || []).find((s) => s.id === id)?.name || id;
    const opps = await fetchOpps(pid);
    out[name] = opps.map((o) => ({
      name: o.name || '',
      contact: o.contact?.name || o.contact?.companyName || '',
      stage: stageName(o.pipelineStageId),
      status: o.status || '',
      value: o.monetaryValue ?? null,
      updatedAt: o.updatedAt || '',
    }));
    lines.push(`## ${name} (${opps.length})`);
    for (const o of out[name].sort((a, b) => (b.value || 0) - (a.value || 0))) {
      const v = o.value ? ` · $${Number(o.value).toLocaleString()}` : '';
      lines.push(`- **${o.name || o.contact}** — ${o.stage} (${o.status})${v}`);
    }
    lines.push('');
    await sleep(600);
  }
  fs.mkdirSync('tmp', { recursive: true });
  fs.writeFileSync('tmp/ghl-funder-stages.json', JSON.stringify(out, null, 2));
  fs.writeFileSync('tmp/ghl-funder-stages.md', lines.join('\n'));
  console.log('Wrote tmp/ghl-funder-stages.{json,md}');
}
main().catch((e) => { console.error('FATAL:', e.message); process.exit(1); });
