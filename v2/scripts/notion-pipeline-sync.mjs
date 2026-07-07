#!/usr/bin/env node
/**
 * GHL to Notion opportunity sync: makes the Notion Funder Pipeline database
 * the single assessment surface, generated one-way from GHL (the system of
 * record). Never writes to GHL. Notion writes go to ONE database only:
 * Funder Pipeline c296ebc96ecd47899a9f805e8dd0d1cd
 * (data source 97afae12-6930-4e23-aff7-688f100fa47b).
 *
 * Source: node scripts/ghl-people-pull.mjs --pipeline all --json (run as a
 * subprocess from v2/), filtered to the funder and grants pipelines by
 * default, open status only. Buyer/demand mirroring is opt-in because those
 * GHL stages do not map cleanly to this funder/grant Notion workbench.
 *
 * Rules:
 * - Upsert key is GHL Opportunity ID. Rows carrying the id get Stage, Amount
 *   (only when GHL has a value; hand-set indicative amounts survive a null),
 *   Days since touch, Priority (tag-derived only), Artifact to send and Last
 *   synced refreshed. Pipeline is filled on create or when blank, but existing
 *   Notion classifications such as grants/QBE/buyer-demand are preserved.
 *   Next action, Send next and Action are Ben's working notes and are NEVER
 *   overwritten on existing rows.
 * - Existing rows without ids are linked by normalized name match (alias map
 *   below), and their GHL ids are filled on first link.
 * - GHL opportunities with no Notion row are listed as skipped by default.
 *   Pass --create-missing to create missing funder/grant rows.
 * - Artifact to send is derived (stage x type map from the engagement
 *   playbook) and refreshed on every sync.
 *
 * Safety rails:
 * - Dry-run is the default; --apply executes.
 * - Abort before applying if the plan would create more than 130 rows, or if
 *   any planned create closely matches an existing Notion row that the name
 *   matcher failed to link.
 *
 * Usage:
 *   node v2/scripts/notion-pipeline-sync.mjs
 *       # dry-run updates/links only; missing rows are review-only
 *   node v2/scripts/notion-pipeline-sync.mjs --apply
 *       # execute updates/links only
 *   node v2/scripts/notion-pipeline-sync.mjs --create-missing --apply
 *       # also create missing funder/grant rows
 *   node v2/scripts/notion-pipeline-sync.mjs --include-buyer-demand --create-missing
 *       # explicit broad mirror mode; dry-run first
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const V2_DIR = path.join(SCRIPT_DIR, '..');

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}
// Same pattern as commitment-register-status.mjs: .env.local from cwd first,
// then v2/.env.local relative to this file, then the ACT infra env that holds
// the Notion token the prior sync work uses.
loadEnvFile(path.join(process.cwd(), '.env.local'));
loadEnvFile(path.join(SCRIPT_DIR, '..', '.env.local'));
const hadLocalToken = Boolean(process.env.NOTION_TOKEN || process.env.NOTION_API_KEY);
loadEnvFile('/Users/benknight/Code/act-global-infrastructure/.env.local');

const TOKEN = process.env.NOTION_TOKEN || process.env.NOTION_API_KEY;
if (TOKEN && !hadLocalToken) {
  console.error('note: Notion token borrowed from act-global-infrastructure/.env.local; add NOTION_TOKEN to v2/.env.local to make this self-contained');
}
if (!TOKEN) {
  console.error('No Notion token (NOTION_TOKEN or NOTION_API_KEY) found. Cannot read or write the Funder Pipeline database.');
  process.exit(1);
}

const NOTION_VERSION = '2022-06-28';
const DATABASE_ID = 'c296ebc96ecd47899a9f805e8dd0d1cd';
const APPLY = process.argv.includes('--apply');
const CREATE_MISSING = process.argv.includes('--create-missing');
const INCLUDE_BUYER_DEMAND = process.argv.includes('--include-buyer-demand');
const MAX_CREATES = 130;
// Local date, not UTC: an evening run in Australia must not stamp yesterday.
const TODAY = new Date().toLocaleDateString('en-CA');
const NOW = Date.now();

const SYNC_PIPELINES = INCLUDE_BUYER_DEMAND
  ? ['funder', 'grants', 'buyer', 'demand']
  : ['funder', 'grants'];
const NOTION_STAGES = new Set([
  'Identified', 'Qualified', 'Cultivating', 'Ask made', 'Committed',
  'Delivering', 'Stewarding', 'Renewing', 'Lapsed', 'Declined / Parked',
]);
const STAGE_REMAP = { 'Stewarding / Reporting': 'Stewarding' };
const ACTIONS = ['ready-to-send', 'ask-out', 'awaiting-reply', 'needs-followup', 'cultivate'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const STOPWORDS = new Set(['the', 'a', 'an', 'of', 'for', 'and', 'to', 'in']);
const firstToken = (s) => norm(s).split(' ').find((t) => t && !STOPWORDS.has(t)) || null;

// Alias map for the known hand-made rows: if the Notion title contains a key,
// the GHL opportunity name or org must contain one of the terms to link.
const ALIASES = [
  { keys: ['sefa'], terms: ['sefa'] },
  { keys: ['snow'], terms: ['snow'] },
  { keys: ['centrecorp'], terms: ['centrecorp'] },
  { keys: ['minderoo'], terms: ['minderoo'] },
  { keys: ['white box'], terms: ['white box'] },
  { keys: ['qbe'], terms: ['qbe'] },
  { keys: ['vfff', 'vincent fairfax', 'vincent'], terms: ['vincent fairfax', 'vfff', 'fairfax'] },
  { keys: ['first nations finance'], terms: ['first nations finance'] },
  { keys: ['cefc'], terms: ['cefc', 'nab'] },
  { keys: ['invest nt'], terms: ['invest nt'] },
  { keys: ['lendforgood', 'lend for good'], terms: ['lendforgood', 'lend for good'] },
  { keys: ['metro'], terms: ['metro finance', 'metroeco', 'metro'] },
  { keys: ['commbank', 'commonwealth bank'], terms: ['commbank', 'commonwealth bank'] },
  { keys: ['tripple'], terms: ['tripple'] },
  { keys: ['sedi'], terms: ['sedi'] },
  { keys: ['frrr'], terms: ['frrr'] },
  { keys: ['anz seeds', 'anz'], terms: ['anz seeds', 'anz'] },
  { keys: ['sisters of charity', 'sisters'], terms: ['sisters of charity'] },
  { keys: ['clean energy'], terms: ['clean energy'] },
  { keys: ['tfn', 'funding network'], terms: ['tfn', 'the funding network', 'funding network'] },
];

function aliasTermsFor(title) {
  const t = ` ${norm(title)} `;
  for (const a of ALIASES) {
    if (a.keys.some((k) => t.includes(` ${k} `) || t.includes(`${k} `) || t.includes(` ${k}`))) return a.terms;
  }
  const tok = firstToken(title);
  return tok ? [tok] : [];
}

// --- Type / Priority / Action derivation from GHL contact tags -------------
function deriveType(opp) {
  if (opp.pipeline === 'grants') return 'grant';
  if (opp.pipeline === 'buyer' || opp.pipeline === 'demand') return 'buyer';
  const tags = (opp.tags || []).map(norm);
  const has = (frag) => tags.some((t) => t.includes(frag));
  if (has('repayable')) return 'repayable';
  if (has('catalytic')) return 'catalytic';
  if (has('buyer')) return 'buyer';
  if (has('grant')) return 'grant';
  if (has('philanthropic') || has('goods-partner-target') || has('partner target')) return 'philanthropic';
  return null;
}
function derivePriority(opp) {
  const tags = (opp.tags || []).map(norm);
  const has = (frag) => tags.some((t) => t.includes(frag));
  if (has('qbe t1') || has('qbe-t1'.replace('-', ' '))) return 'Tier 1';
  if (has('qbe t2')) return 'Tier 2';
  if (has('qbe t3')) return 'Tier 3';
  if (has('monitor')) return 'Monitor';
  return null;
}
function deriveAction(opp) {
  const tags = (opp.tags || []).map((t) => norm(t).replace(/\s+/g, '-'));
  for (const a of ACTIONS) if (tags.some((t) => t.includes(a))) return a;
  return null;
}

// --- Artifact to send: deterministic stage x type map (engagement playbook)
function artifactFor(stage, type, pipeline, funderName) {
  const n = norm(funderName);
  // Funder-specific overrides from the playbook: send these directly.
  if (n.includes('sefa')) return 'SEFA loan brief (wiki/outputs/funder-reports/sefa/)';
  if (n.includes('snow')) return 'Snow first-mover brief (wiki/outputs/funder-reports/snow/)';
  if (n.includes('centrecorp')) return 'Centrecorp next-round brief + Utopia impact report';
  if (pipeline === 'buyer' || pipeline === 'demand' || type === 'buyer') {
    return 'product page (/shop) + bed record (/bed/GB0-156-40)';
  }
  if (pipeline === 'grants' || type === 'grant') {
    return 'program application + canonical numbers sheet';
  }
  const t = type || 'philanthropic';
  switch (stage) {
    case 'Identified':
      return 'public pitch page link (/pitch), nothing more';
    case 'Qualified':
      if (t === 'repayable') return 'funder-onepager.pdf + /cost-story';
      if (t === 'catalytic') return 'funder-onepager.pdf + /pitch';
      return 'funder-onepager.pdf + /impact';
    case 'Cultivating':
      if (t === 'repayable') return 'invest-deck-full.pdf + cost-lab link';
      if (t === 'catalytic') return 'invest-deck-full.pdf + matched-capital evidence';
      return 'next-phase-onepager.pdf + one cleared story';
    case 'Ask made':
      if (t === 'repayable') return 'loan brief (wiki/outputs/funder-reports/...)';
      if (t === 'catalytic') return 'pitch bundle + costing + matched-capital evidence';
      return 'funder brief + canonical numbers sheet';
    case 'Committed':
      return t === 'repayable' ? 'term sheet + reporting plan' : 'grant agreement + acquittal plan';
    case 'Delivering':
      return 'signed agreement + invoice with bank details';
    case 'Stewarding':
      return 'impact report + acquittal (canonical numbers + one cleared story)';
    case 'Renewing':
      return 'next-round brief';
    default:
      return null; // Lapsed / Declined / Parked: nothing to send
  }
}

// --- Notion helpers ---------------------------------------------------------
async function notion(method, urlPath, body) {
  const res = await fetch(`https://api.notion.com/v1${urlPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${method} ${urlPath} -> ${res.status}: ${(await res.text()).slice(0, 300)}`);
  return res.json();
}

const rtext = (prop) => (prop?.title || prop?.rich_text || []).map((t) => t.plain_text).join('').trim() || null;

async function queryAllRows() {
  const rows = [];
  let cursor = undefined;
  do {
    const body = { page_size: 100 };
    if (cursor) body.start_cursor = cursor;
    const data = await notion('POST', `/databases/${DATABASE_ID}/query`, body);
    for (const page of data.results || []) {
      if (page.archived || page.in_trash) continue;
      const p = page.properties || {};
      rows.push({
        pageId: page.id,
        funder: rtext(p['Funder']),
        stage: p['Stage']?.select?.name || null,
        type: p['Type']?.select?.name || null,
        action: p['Action']?.select?.name || null,
        amount: p['Amount']?.number ?? null,
        pipeline: p['Pipeline']?.select?.name || null,
        bucket: p['Bucket']?.select?.name || null,
        ghlContactId: rtext(p['GHL Contact ID']),
        ghlOppId: rtext(p['GHL Opportunity ID']),
        priority: p['Priority']?.select?.name || null,
      });
    }
    cursor = data.has_more ? data.next_cursor : undefined;
    await sleep(150);
  } while (cursor);
  return rows;
}

const rt = (s) => ({ rich_text: [{ text: { content: String(s) } }] });

function buildProps(opp, { create = false, existing = null } = {}) {
  const props = {};
  if (create) props['Funder'] = { title: [{ text: { content: opp.name } }] };
  if (opp.notionStage) props['Stage'] = { select: { name: opp.notionStage } };
  if (opp.valueDollars != null) props['Amount'] = { number: opp.valueDollars };
  if (opp.daysSinceTouch != null) props['Days since touch'] = { number: opp.daysSinceTouch };
  if (create || !existing?.pipeline) props['Pipeline'] = { select: { name: opp.pipeline } };
  props['GHL Contact ID'] = opp.contactId ? rt(opp.contactId) : { rich_text: [] };
  props['GHL Opportunity ID'] = rt(opp.id);
  props['Last synced'] = { date: { start: TODAY } };
  const priority = derivePriority(opp);
  if (priority) props['Priority'] = { select: { name: priority } };
  // Type: set on create; on existing rows only fill when empty (never overwrite).
  const derivedType = deriveType(opp);
  if (create && derivedType) props['Type'] = { select: { name: derivedType } };
  if (!create && derivedType && existing && !existing.type) props['Type'] = { select: { name: derivedType } };
  // Artifact to send is derived, refreshed on create AND update.
  const typeForArtifact = (!create && existing?.type) ? existing.type : derivedType;
  const artifact = artifactFor(opp.notionStage, typeForArtifact, opp.pipeline, opp.name);
  if (artifact) props['Artifact to send'] = rt(artifact);
  // Action: create only. Next action / Send next: never written by this script.
  if (create) {
    const action = deriveAction(opp);
    if (action) props['Action'] = { select: { name: action } };
  }
  return props;
}

// --- Pull from GHL (read-only subprocess) ------------------------------------
function pullGhl() {
  const res = spawnSync('node', [path.join(SCRIPT_DIR, 'ghl-people-pull.mjs'), '--pipeline', 'all', '--json'], {
    cwd: V2_DIR,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  if (res.error) throw res.error;
  if (res.stderr) process.stderr.write(res.stderr);
  let data;
  try {
    data = JSON.parse(res.stdout);
  } catch {
    throw new Error(`ghl-people-pull.mjs did not return JSON (exit ${res.status}). First 300 chars: ${String(res.stdout).slice(0, 300)}`);
  }
  const byKey = Object.fromEntries((data.pipelines || []).map((p) => [p.key, p]));
  const missing = SYNC_PIPELINES.filter((k) => !byKey[k]);
  if (missing.length) throw new Error(`GHL pull missing pipeline(s): ${missing.join(', ')}`);
  const opps = [];
  for (const key of SYNC_PIPELINES) {
    for (const o of byKey[key].opportunities || []) {
      const notionStage = STAGE_REMAP[o.stage] || o.stage;
      opps.push({
        id: o.id,
        contactId: o.contactId || null,
        name: o.name,
        org: o.org || null,
        stage: o.stage,
        notionStage: NOTION_STAGES.has(notionStage) ? notionStage : null,
        rawStage: o.stage,
        valueDollars: o.valueCents ? Math.round(o.valueCents) / 100 : null,
        tags: o.tags || [],
        updatedAt: o.updatedAt || null,
        daysSinceTouch: o.updatedAt ? Math.floor((NOW - new Date(o.updatedAt).getTime()) / 86400000) : null,
        pipeline: key,
      });
    }
  }
  return opps;
}

function isParkedRow(row) {
  return row.bucket === 'Parked' || row.stage === 'Declined / Parked';
}

// --- Plan --------------------------------------------------------------------
function buildPlan(opps, notionRows) {
  const oppById = new Map(opps.map((o) => [o.id, o]));
  const consumed = new Set();
  const updates = []; // { opp, row }
  const links = [];   // { opp, row, via }
  const unmatchedRows = [];
  const warnings = [];

  // Pass 1: id matches.
  for (const row of notionRows) {
    if (!row.ghlOppId) continue;
    const opp = oppById.get(row.ghlOppId);
    if (opp && !consumed.has(opp.id)) {
      consumed.add(opp.id);
      updates.push({ opp, row });
    } else {
      unmatchedRows.push({ row, reason: opp ? 'GHL id claimed twice' : 'GHL id not in open opps' });
    }
  }

  // Pass 2: name links for id-less rows.
  for (const row of notionRows) {
    if (row.ghlOppId) continue;
    const terms = aliasTermsFor(row.funder);
    let match = null, via = null;
    for (const term of terms) {
      const cands = opps.filter((o) => !consumed.has(o.id) &&
        (` ${norm(o.name)} `.includes(` ${term} `) || norm(o.name).includes(term) ||
         ` ${norm(o.org)} `.includes(` ${term} `) || norm(o.org || '').includes(term)));
      if (cands.length) {
        // Prefer the funder pipeline, then the largest value, for determinism.
        cands.sort((a, b) => (a.pipeline === 'funder' ? -1 : 0) - (b.pipeline === 'funder' ? -1 : 0) || (b.valueDollars || 0) - (a.valueDollars || 0));
        match = cands[0]; via = term;
        if (cands.length > 1) warnings.push(`"${row.funder}" matched ${cands.length} GHL opps via "${term}"; linked "${match.name}" [${match.pipeline}]`);
        break;
      }
    }
    if (match) {
      consumed.add(match.id);
      links.push({ opp: match, row, via });
    } else {
      unmatchedRows.push({ row, reason: 'no GHL name match' });
    }
  }

  // Pass 3: creates, with the near-miss guard.
  const creates = [];
  const skippedCreates = [];
  const nearMisses = [];
  const unlinkableTitles = unmatchedRows.filter((u) => !u.row.ghlOppId).map((u) => u.row);
  for (const opp of opps) {
    if (consumed.has(opp.id)) continue;
    for (const row of unlinkableTitles) {
      const rowTok = firstToken(row.funder);
      const oppTok = firstToken(opp.name);
      const shared = (rowTok && (norm(opp.name).includes(rowTok) || norm(opp.org || '').includes(rowTok))) ||
        (oppTok && norm(row.funder).includes(oppTok));
      if (shared) nearMisses.push(`create "${opp.name}" [${opp.pipeline}] closely matches unlinked Notion row "${row.funder}"`);
    }
    if (CREATE_MISSING) creates.push(opp);
    else skippedCreates.push(opp);
  }

  return { updates, links, creates, skippedCreates, unmatchedRows, warnings, nearMisses };
}

function printPlan(plan) {
  const pad = (s, n) => String(s ?? '').slice(0, n).padEnd(n);
  const line = (op, o, extra) => console.log(
    `${pad(op, 7)} ${pad(o.name, 46)} ${pad(o.pipeline, 7)} ${pad(o.notionStage || `??${o.rawStage}`, 14)} ` +
    `${pad(o.valueDollars != null ? '$' + o.valueDollars.toLocaleString() : '', 11)} ${pad(deriveType(o) || '', 13)} ${pad(derivePriority(o) || '', 7)} ${extra || ''}`);
  console.log(`\nPLAN (${TODAY})  updates ${plan.updates.length} | links ${plan.links.length} | creates ${plan.creates.length} | skipped missing ${plan.skippedCreates.length} | unmatched Notion rows ${plan.unmatchedRows.length}`);
  console.log(`${pad('OP', 7)} ${pad('GHL OPPORTUNITY', 46)} ${pad('PIPE', 7)} ${pad('STAGE', 14)} ${pad('AMOUNT', 11)} ${pad('TYPE', 13)} ${pad('PRI', 7)} NOTE`);
  for (const u of plan.updates) line('update', u.opp, `-> "${u.row.funder}"`);
  for (const l of plan.links) line('link', l.opp, `-> "${l.row.funder}" (via "${l.via}")`);
  for (const c of plan.creates) line('create', c, '');
  if (plan.skippedCreates.length) {
    console.log('\nMISSING GHL OPPORTUNITIES (review-only; pass --create-missing to create Notion rows):');
    for (const s of plan.skippedCreates) line('skip', s, '');
  }
  if (plan.unmatchedRows.length) {
    console.log('\nUNMATCHED NOTION ROWS (left untouched):');
    for (const u of plan.unmatchedRows) console.log(`  "${u.row.funder}"  (${u.reason})`);
  }
  if (plan.warnings.length) {
    console.log('\nWARNINGS:');
    for (const w of plan.warnings) console.log(`  ${w}`);
  }
  if (plan.nearMisses.length) {
    console.log('\nNEAR-MISS GUARD (blocks --apply only with --create-missing):');
    for (const n of plan.nearMisses) console.log(`  ${n}`);
  }
  const badStages = [...plan.updates.map((u) => u.opp), ...plan.links.map((l) => l.opp), ...plan.creates]
    .filter((o) => !o.notionStage);
  if (badStages.length) {
    console.log('\nSTAGES WITH NO NOTION MAPPING (Stage left unset on these rows):');
    for (const o of badStages) console.log(`  "${o.name}" [${o.pipeline}] GHL stage "${o.rawStage}"`);
  }
}

// --- Apply + verify -----------------------------------------------------------
async function applyPlan(plan) {
  const results = { created: 0, linked: 0, updated: 0, errors: [] };
  for (const { opp, row } of plan.updates) {
    try {
      await notion('PATCH', `/pages/${row.pageId}`, { properties: buildProps(opp, { existing: row }) });
      results.updated++;
    } catch (e) { results.errors.push(`update "${opp.name}": ${e.message}`); }
    await sleep(200);
  }
  for (const { opp, row } of plan.links) {
    try {
      await notion('PATCH', `/pages/${row.pageId}`, { properties: buildProps(opp, { existing: row }) });
      results.linked++;
    } catch (e) { results.errors.push(`link "${opp.name}" -> "${row.funder}": ${e.message}`); }
    await sleep(200);
  }
  for (const opp of plan.creates) {
    try {
      await notion('POST', '/pages', {
        parent: { database_id: DATABASE_ID },
        properties: buildProps(opp, { create: true }),
      });
      results.created++;
    } catch (e) { results.errors.push(`create "${opp.name}": ${e.message}`); }
    await sleep(200);
  }
  return results;
}

async function verify() {
  const rows = await queryAllRows();
  const byPipeline = {};
  let withIds = 0;
  for (const r of rows) {
    byPipeline[r.pipeline || '(none)'] = (byPipeline[r.pipeline || '(none)'] || 0) + 1;
    if (r.ghlOppId) withIds++;
  }
  console.log('\nVERIFICATION (paginated re-query):');
  console.log(`  total rows: ${rows.length}`);
  for (const [k, v] of Object.entries(byPipeline).sort()) console.log(`  Pipeline=${k}: ${v}`);
  console.log(`  with GHL Opportunity ID: ${withIds} | without: ${rows.length - withIds}`);
  const withoutIds = rows.filter((r) => !r.ghlOppId);
  if (withoutIds.length) {
    console.log('  rows without ids (untouched by sync):');
    for (const r of withoutIds) console.log(`    "${r.funder}"`);
  }
  return rows;
}

async function main() {
  console.error(`Pulling GHL (read-only) via ghl-people-pull.mjs --pipeline all --json ...`);
  const opps = pullGhl();
  console.error(`Open opportunities in scope (${SYNC_PIPELINES.join(', ')}): ${opps.length}`);
  console.error('Querying Notion Funder Pipeline database ...');
  const notionRows = await queryAllRows();
  console.error(`Notion rows: ${notionRows.length} (${notionRows.filter((r) => r.ghlOppId).length} already carry a GHL Opportunity ID)`);
  const activeRows = notionRows.filter((row) => !isParkedRow(row));
  const parkedRows = notionRows.length - activeRows.length;
  if (parkedRows) console.error(`Skipping ${parkedRows} parked Notion row(s).`);

  const plan = buildPlan(opps, activeRows);
  printPlan(plan);

  if (!APPLY) {
    console.log('\nDRY RUN ONLY. Re-run with --apply to execute.');
    return;
  }
  if (plan.creates.length > MAX_CREATES) {
    console.error(`\nABORT: plan would create ${plan.creates.length} rows (limit ${MAX_CREATES}). Nothing written.`);
    process.exit(2);
  }
  if (CREATE_MISSING && plan.nearMisses.length) {
    console.error(`\nABORT: ${plan.nearMisses.length} planned create(s) closely match existing Notion rows the matcher failed to link. Nothing written.`);
    process.exit(2);
  }

  console.log('\nAPPLYING ...');
  const results = await applyPlan(plan);
  console.log(`applied: created ${results.created} | linked ${results.linked} | updated ${results.updated} | errors ${results.errors.length}`);
  for (const e of results.errors) console.log(`  ERROR ${e}`);
  await verify();
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
