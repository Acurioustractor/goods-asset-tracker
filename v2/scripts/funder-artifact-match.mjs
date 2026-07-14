#!/usr/bin/env node
/**
 * READ-ONLY: for a supporter (or --all), recommend which artifacts to send,
 * based on their live GHL stage and their funder type. Implements the
 * engagement playbook (wiki/outputs/2026-06-28-funding-refresh/05-engagement-playbook.md).
 *
 * Usage:
 *   node funder-artifact-match.mjs "Snow"      # one funder
 *   node funder-artifact-match.mjs --all        # every active funder, compact
 *
 * Writes nothing. The artifacts are in artifact-register.json; this just points
 * the right ones at the right person at the right stage.
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
const headers = { Authorization: `Bearer ${TOKEN}`, Version: '2021-07-28', 'Content-Type': 'application/json' };

const reg = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/lib/data/artifact-register.json'), 'utf8')).artifacts;
const byId = Object.fromEntries(reg.map((a) => [a.id, a]));
const titles = (ids) => ids.map((id) => byId[id]?.title || id);

const funderType = (name) => {
  const n = name.toLowerCase();
  if (/sefa|first nations finance|cefc|\bnab\b|invest nt|\biba\b/.test(n)) return 'repayable';
  if (/qbe|real innovation|minderoo/.test(n)) return 'catalytic';
  if (/centrecorp|groote|mala'la|health|julalikari/.test(n)) return 'buyer';
  return 'philanthropic';
};
const TYPE_PILLARS = {
  repayable: ['costing', 'governance', 'pitch'],
  philanthropic: ['impact', 'stories', 'pitch'],
  catalytic: ['pitch', 'costing', 'impact'],
  buyer: ['impact', 'costing'],
};
// funder-specific artifacts to send directly (matched by name substring)
const SPECIFIC = [
  ['sefa', ['sefa-loan-brief']],
  ['snow', ['snow-first-mover-brief']],
  ['centrecorp', ['centrecorp-nextround-brief', 'centrecorp-utopia-report']],
];
// the 1-2 best artifacts to actually send per pillar (not the whole pillar)
const LEADS = {
  pitch: ['public-pitch-pages', 'pencil-deck'],
  costing: ['cost-story', 'best-case-scenario'],
  impact: ['impact-page', 'canonical-numbers-sheet'],
  stories: ['utopia-field-note', 'community-stories'],
  governance: ['risk-register', 'governance-framework'],
};
// stage -> depth recipe
const STAGE = {
  'Identified': { pillars: [], lead: ['public-pitch-pages'], ask: 'qualify the fit (no send yet)', next: 'confirm fit + a way in -> Qualified' },
  'Qualified': { pillars: ['pitch'], ask: 'a 20-minute conversation', next: 'relationship starts -> Cultivating' },
  'Cultivating': { pillars: ['impact', 'stories'], ask: 'gauge interest in the specific ask', next: 'send the ask -> Ask made' },
  'Ask made': { pillars: 'TYPE', ask: 'the SPECIFIC amount + instrument + use of funds', next: 'they say yes -> Delivering' },
  'Delivering': { pillars: ['governance'], ask: 'sign the agreement, then invoice + bank details', next: 'money lands -> Stewarding' },
  'Stewarding / Reporting': { pillars: ['impact'], ask: 'report well + acquit', next: 'acquitted -> Renewing' },
  'Renewing': { pillars: ['pitch'], ask: 'the next-round ask', next: 'ask goes out -> Ask made' },
};

async function ghl(p) { const r = await fetch(`${BASE}${p}`, { headers }); if (!r.ok) throw new Error(`${r.status}`); return r.json(); }
async function fetchOpps() {
  const all = []; let sa = null, sai = null;
  for (let i = 0; i < 20; i++) {
    const qs = new URLSearchParams({ location_id: LOC, pipeline_id: PIPELINE, limit: '100' });
    if (sa) qs.set('startAfter', sa); if (sai) qs.set('startAfterId', sai);
    const d = await ghl(`/opportunities/search?${qs}`); const o = d.opportunities || []; all.push(...o);
    if (o.length < 100 || !d.meta?.startAfterId) break; sa = d.meta.startAfter; sai = d.meta.startAfterId;
  }
  return all;
}

function recommend(o, stageName) {
  const type = funderType(o.name);
  const recipe = STAGE[stageName] || STAGE['Cultivating'];
  const specific = SPECIFIC.filter(([k]) => o.name.toLowerCase().includes(k)).flatMap(([, ids]) => ids);
  let pillars = recipe.pillars === 'TYPE' ? TYPE_PILLARS[type] : recipe.pillars;
  // Repayable lenders decide on the cost/repayment case, not the impact story.
  // Lead with costing during cultivation (Qualified/Cultivating) where the stage
  // recipe is otherwise type-agnostic. Ask made already carries costing via TYPE.
  if (type === 'repayable' && (stageName === 'Cultivating' || stageName === 'Qualified') && !pillars.includes('costing')) {
    pillars = ['costing', ...pillars];
  }
  const fromPillars = (recipe.lead || []).concat(pillars.flatMap((p) => LEADS[p] || []));
  const send = [...new Set([...specific, ...fromPillars])].filter((id) => byId[id]);
  return { type, recipe, send };
}

async function main() {
  if (!TOKEN || !LOC) { console.error('Missing GHL creds in v2/.env.local'); process.exit(1); }
  const meta = await ghl(`/opportunities/pipelines?locationId=${LOC}`);
  const pipeline = (meta.pipelines || []).find((p) => p.id === PIPELINE);
  const stageName = Object.fromEntries((pipeline?.stages || []).map((s) => [s.id, s.name]));
  const opps = (await fetchOpps()).filter((o) => o.status === 'open');

  const cliArgs = process.argv.slice(2);
  const filter = cliArgs.find((a) => !a.startsWith('--'));
  const all = cliArgs.includes('--all');

  if (all) {
    for (const o of opps) {
      const { type, send } = recommend(o, stageName[o.pipelineStageId]);
      console.log(`[${stageName[o.pipelineStageId]}] ${o.name}  (${type})\n   send: ${titles(send).join('; ') || '(qualify first)'}`);
    }
    return;
  }
  const matches = opps.filter((o) => o.name.toLowerCase().includes((filter || '').toLowerCase()));
  if (!filter || !matches.length) { console.error('Pass a funder name substring, or --all.'); process.exit(1); }
  for (const o of matches) {
    const sn = stageName[o.pipelineStageId];
    const { type, recipe, send } = recommend(o, sn);
    console.log(`\n=== ${o.name} ===`);
    console.log(`Stage: ${sn}  |  Type: ${type}  |  Value: $${(o.monetaryValue || 0).toLocaleString()}`);
    console.log(`\nSend now:`);
    for (const id of send) console.log(`  - ${byId[id].title}  (${byId[id].location || byId[id].type})`);
    console.log(`\nThe ask: ${recipe.ask}`);
    console.log(`Next move: ${recipe.next}`);
  }
}
main().catch((e) => { console.error(e.message); process.exit(1); });
