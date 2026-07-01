#!/usr/bin/env node
/**
 * READ-ONLY: commitment register status, the single source for leading indicator 1.
 *
 * Reads the Notion QBE Opportunity Register (database c59fb06c20b144968493a8df7f5a623d,
 * data source 62ffa800-0865-4aca-a129-5f1608429626) and reports the distance between
 * signed match-eligible dollars and the AU$400,000 target due 31 Aug 2026.
 *
 * "Signed" means Match Eligible = Yes AND Capital Status at Signed LOI or beyond
 * (Signed LOI, Contracted, Invoiced, Paid) on the SIH ladder. A row marked Yes
 * without signed paper or without a Gmail Evidence URL is flagged, never counted.
 *
 * Notion access is GET only (page-level GETs against a seed list of row ids).
 * The Notion row-query endpoint is a POST, so this script never enumerates new
 * rows itself: SEED_ROWS below carries the 13 row page ids (11 as at 2026-07-02 plus LendForGood and Metro added the same day).
 * When a row is added to the register, append its page id here (open the row in
 * Notion, copy the 32-hex id from the URL). The script tells you the seed date
 * on every run so a stale list is visible, not silent.
 *
 * Auth: NOTION_TOKEN (or NOTION_API_KEY) from the environment, then v2/.env.local,
 * then /Users/benknight/Code/act-global-infrastructure/.env.local (where the
 * prior Notion sync work keeps its token). No token at all drops the script into
 * MANUAL SNAPSHOT mode with a loud banner; the snapshot is dated 2026-07-02.
 *
 * Usage:
 *   node v2/scripts/commitment-register-status.mjs           # human-readable report
 *   node v2/scripts/commitment-register-status.mjs --json    # { asAt, signedTotal, target, rows }
 *
 * Exit code 0 whenever the read succeeds (live or snapshot). This is a reporter,
 * not a gate: a grim number is a successful read.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));

function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
}
// Same pattern as the neighbouring GHL scripts: .env.local from cwd first,
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
const NOTION_VERSION = '2022-06-28';
const TARGET_AUD = 400000;
const DEADLINE = '2026-08-31';
const DATABASE_ID = 'c59fb06c20b144968493a8df7f5a623d';
const DATA_SOURCE_ID = '62ffa800-0865-4aca-a129-5f1608429626';
const SEED_DATE = '2026-07-02';

// The 11 register row page ids as at 2026-07-02 (queried read-only that day).
// Append new ids here when rows are added; archived rows are skipped automatically.
const SEED_ROWS = [
  '38eebcf981cf8157b5d4d13ff7e1d92a', // White Box SELF
  '38eebcf981cf8110a7c9e2b8d7cb6567', // SEFA
  '38eebcf981cf8184a8b1cb2253a16eb1', // Minderoo Foundation
  '38febcf981cf8191ae25d92ced30f1c3', // SEDI Capability Building
  '38eebcf981cf8152a350ea9979852bc8', // Snow Foundation
  '38febcf981cf81a19fd5c6e1f842fd5b', // First Nations Clean Energy Advice
  '38eebcf981cf81199c5cd027c117ec26', // Centrecorp Foundation
  '38eebcf981cf819cb36add0ddf4131ba', // Vincent Fairfax Family Foundation
  '38febcf981cf818ebb91d143894382f3', // FRRR Strengthening Rural Communities
  '38febcf981cf8199a7e8c2061eaa1c6c', // Sisters of Charity
  '38febcf981cf81bc84d1cce560399def', // ANZ Seeds of Renewal
  '390ebcf981cf81a298e7f10e0979c529', // LendForGood (added 2026-07-02, staged writes)
  '390ebcf981cf81d5b100f018cc15dd77', // Metro Finance MetroEco (added 2026-07-02, staged writes)
];

// MANUAL SNAPSHOT 2026-07-02: the register as read live that day. 11 rows, every
// one Match Eligible TBC, every Gmail Evidence URL empty, $0 signed. Used only
// when no Notion token is available; a banner makes that impossible to miss.
const MANUAL_SNAPSHOT = {
  asAt: '2026-07-02',
  rows: [
    { id: '38eebcf981cf8157b5d4d13ff7e1d92a', opportunity: 'White Box SELF - social enterprise loan pathway', targetAud: 250000, matchEligible: 'TBC', capitalStatus: 'Signal', owner: 'Ben / Nic', dueDate: '2026-07-04', evidenceUrl: null, status: 'Reviewing', priority: 'Tier 1' },
    { id: '38eebcf981cf8110a7c9e2b8d7cb6567', opportunity: 'SEFA - repayable finance anchor', targetAud: 250000, matchEligible: 'TBC', capitalStatus: 'Signal', owner: 'Ben / Nic', dueDate: '2026-07-04', evidenceUrl: null, status: 'Briefing', priority: 'Tier 1' },
    { id: '38eebcf981cf8184a8b1cb2253a16eb1', opportunity: 'Minderoo Foundation - catalytic QBE-aligned grant', targetAud: 200000, matchEligible: 'TBC', capitalStatus: 'Ask made', owner: 'Ben / Nic', dueDate: '2026-07-18', evidenceUrl: null, status: 'Pursuing', priority: 'Tier 1' },
    { id: '38febcf981cf8191ae25d92ced30f1c3', opportunity: 'SEDI Capability Building Grants - Goods capability build', targetAud: 120000, matchEligible: 'TBC', capitalStatus: 'Signal', owner: null, dueDate: null, evidenceUrl: null, status: 'Pursuing', priority: 'Tier 1' },
    { id: '38eebcf981cf8152a350ea9979852bc8', opportunity: 'Snow Foundation - first-mover QBE commitment', targetAud: 100000, matchEligible: 'TBC', capitalStatus: 'Ask made', owner: 'Ben / Nic', dueDate: '2026-07-18', evidenceUrl: null, status: 'Pursuing', priority: 'Tier 1' },
    { id: '38febcf981cf81a19fd5c6e1f842fd5b', opportunity: 'First Nations Clean Energy Advice Grants - on-country manufacturing energy advice', targetAud: 80000, matchEligible: 'TBC', capitalStatus: 'Signal', owner: null, dueDate: '2026-09-03', evidenceUrl: null, status: 'Reviewing', priority: 'Tier 2' },
    { id: '38eebcf981cf81199c5cd027c117ec26', opportunity: 'Centrecorp Foundation - Central Australia grant / bed-order split', targetAud: 75000, matchEligible: 'TBC', capitalStatus: 'Ask made', owner: 'Ben / Nic', dueDate: '2026-07-18', evidenceUrl: null, status: 'Pursuing', priority: 'Tier 1' },
    { id: '38eebcf981cf819cb36add0ddf4131ba', opportunity: 'Vincent Fairfax Family Foundation - repeat-funder grant tail', targetAud: 50000, matchEligible: 'TBC', capitalStatus: 'Signal', owner: 'Ben / Nic', dueDate: '2026-07-18', evidenceUrl: null, status: 'Qualified', priority: 'Tier 1' },
    { id: '38febcf981cf818ebb91d143894382f3', opportunity: 'FRRR Strengthening Rural Communities - remote bedding and plastic circularity', targetAud: 50000, matchEligible: 'TBC', capitalStatus: 'Signal', owner: null, dueDate: null, evidenceUrl: null, status: 'Qualified', priority: 'Tier 2' },
    { id: '38febcf981cf8199a7e8c2061eaa1c6c', opportunity: 'Sisters of Charity Community Grants - partner-led bed deployment', targetAud: 20000, matchEligible: 'TBC', capitalStatus: 'Signal', owner: null, dueDate: '2026-07-31', evidenceUrl: null, status: 'Reviewing', priority: 'Tier 3' },
    { id: '38febcf981cf81bc84d1cce560399def', opportunity: 'ANZ Seeds of Renewal - remote community bed/plastic pilot', targetAud: 15000, matchEligible: 'TBC', capitalStatus: 'Signal', owner: null, dueDate: '2026-07-30', evidenceUrl: null, status: 'Qualified', priority: 'Tier 2' },
  ],
};

const SIGNED_CAPITAL = new Set(['Signed LOI', 'Contracted', 'Invoiced', 'Paid']);
const ASK_OUT_CAPITAL = new Set(['Ask made', 'Verbal yes']);
const JSON_MODE = process.argv.includes('--json');
// Local date, not UTC: an evening run in Australia must not stamp yesterday.
const TODAY = new Date().toLocaleDateString('en-CA');

const aud = (n) => 'AU$' + Number(n || 0).toLocaleString('en-AU');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function notionGet(urlPath) {
  const res = await fetch(`https://api.notion.com/v1${urlPath}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Notion-Version': NOTION_VERSION },
  });
  if (!res.ok) throw new Error(`GET ${urlPath} -> ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

const text = (prop) => (prop?.title || prop?.rich_text || []).map((t) => t.plain_text).join('').trim() || null;

function parseRow(page) {
  const p = page.properties || {};
  return {
    id: page.id.replace(/-/g, ''),
    opportunity: text(p['Opportunity']),
    targetAud: p['Target AUD']?.number ?? null,
    matchEligible: p['Match Eligible']?.select?.name || null,
    capitalStatus: p['Capital Status']?.select?.name || null,
    owner: text(p['Owner']),
    dueDate: p['Due Date']?.date?.start || null,
    evidenceUrl: p['Gmail Evidence URL']?.url || null,
    status: p['Status']?.select?.name || null,
    priority: p['Priority']?.select?.name || null,
    archived: Boolean(page.archived || page.in_trash),
  };
}

async function fetchLiveRows() {
  const rows = [];
  const errors = [];
  for (const id of SEED_ROWS) {
    try {
      const page = await notionGet(`/pages/${id}`);
      const row = parseRow(page);
      if (row.archived) continue; // dropped from the register; seed list needs a trim
      rows.push(row);
    } catch (err) {
      errors.push(`${id}: ${err.message}`);
    }
    await sleep(150); // stay under Notion's ~3 requests a second
  }
  return { rows, errors };
}

function flagsFor(row) {
  const flags = [];
  if (row.matchEligible === 'Yes' && !SIGNED_CAPITAL.has(row.capitalStatus)) {
    flags.push('match-yes-without-signed-paper');
  }
  if (row.matchEligible === 'Yes' && !row.evidenceUrl) {
    flags.push('match-yes-without-evidence-url');
  }
  if (row.dueDate && row.dueDate < TODAY) flags.push('due-date-past');
  if (!row.owner) flags.push('owner-empty');
  if (ASK_OUT_CAPITAL.has(row.capitalStatus) && row.matchEligible === 'TBC') {
    flags.push('ask-out-match-still-tbc');
  }
  return flags;
}

function report(rows, mode, errors) {
  const scored = rows.map((row) => ({ ...row, flags: flagsFor(row) }));
  const signedRows = scored.filter(
    (r) => r.matchEligible === 'Yes' && SIGNED_CAPITAL.has(r.capitalStatus),
  );
  const signedTotal = signedRows.reduce((sum, r) => sum + (r.targetAud || 0), 0);
  const pct = (signedTotal / TARGET_AUD) * 100;
  const yesWithEvidence = scored.filter((r) => r.matchEligible === 'Yes' && r.evidenceUrl);
  const yesCount = scored.filter((r) => r.matchEligible === 'Yes').length;
  const flagged = scored.filter((r) => r.flags.length > 0);
  const daysLeft = Math.ceil((new Date(DEADLINE) - new Date(TODAY)) / 86400000);
  const weeksLeft = (daysLeft / 7).toFixed(1);

  if (JSON_MODE) {
    console.log(JSON.stringify({
      asAt: TODAY,
      signedTotal,
      target: TARGET_AUD,
      mode,
      seedDate: SEED_DATE,
      pctOfTarget: Number(pct.toFixed(1)),
      deadline: DEADLINE,
      daysToDeadline: daysLeft,
      rowCount: scored.length,
      matchEligibleYes: yesCount,
      matchEligibleYesWithEvidence: yesWithEvidence.length,
      readErrors: errors,
      rows: scored,
    }, null, 2));
    return;
  }

  console.log(`COMMITMENT REGISTER STATUS  as at ${TODAY}  (${mode === 'live' ? 'live from Notion' : 'MANUAL SNAPSHOT ' + MANUAL_SNAPSHOT.asAt})`);
  console.log(`Register: QBE Opportunity Register (db ${DATABASE_ID}), seed list dated ${SEED_DATE}`);
  console.log('');
  console.log(`INDICATOR 1: ${aud(signedTotal)} signed match-eligible of ${aud(TARGET_AUD)} (${pct.toFixed(1)}%)`);
  console.log(`             ${daysLeft} days (${weeksLeft} weeks) to ${DEADLINE}`);
  console.log(`Match Eligible = Yes with evidence URL: ${yesWithEvidence.length} of ${scored.length} rows (Yes at all: ${yesCount})`);
  if (signedRows.length) {
    console.log('');
    console.log('Signed match-eligible rows:');
    for (const r of signedRows) {
      console.log(`  ${aud(r.targetAud).padStart(12)}  ${r.opportunity}  [${r.capitalStatus}]  evidence: ${r.evidenceUrl || 'MISSING'}`);
    }
  }
  console.log('');
  console.log('All rows (by Target AUD):');
  for (const r of [...scored].sort((a, b) => (b.targetAud || 0) - (a.targetAud || 0))) {
    const bits = [
      `match ${r.matchEligible || '?'}`,
      r.capitalStatus || '?',
      r.owner ? `owner ${r.owner}` : 'NO OWNER',
      r.dueDate ? `due ${r.dueDate}` : 'no due date',
      r.evidenceUrl ? 'evidence ok' : 'no evidence URL',
    ];
    console.log(`  ${aud(r.targetAud).padStart(12)}  ${(r.opportunity || r.id).slice(0, 62).padEnd(62)}  ${bits.join(' | ')}`);
  }
  if (flagged.length) {
    console.log('');
    console.log(`FLAGS (${flagged.length} rows need attention):`);
    for (const r of flagged) {
      console.log(`  ${(r.opportunity || r.id).slice(0, 52).padEnd(52)}  ${r.flags.join(', ')}`);
    }
  }
  if (errors.length) {
    console.log('');
    console.log(`READ ERRORS (${errors.length} of ${SEED_ROWS.length} seed rows failed; totals cover the rows that read):`);
    for (const e of errors) console.log(`  ${e}`);
  }
  console.log('');
  console.log(`Note: the seed list is fixed at ${SEED_DATE}. Rows added to the register after that date`);
  console.log('do not appear here until their page ids are appended to SEED_ROWS in this script.');
}

function snapshotBanner() {
  const bar = '!'.repeat(78);
  console.error(bar);
  console.error('!!  SNAPSHOT MODE: no Notion token found in the environment.');
  console.error(`!!  Figures below are the embedded MANUAL SNAPSHOT dated ${MANUAL_SNAPSHOT.asAt}, NOT live.`);
  console.error('!!  Add NOTION_TOKEN=ntn_... to v2/.env.local to read the live register.');
  console.error(bar);
}

async function main() {
  if (!TOKEN) {
    snapshotBanner();
    report(MANUAL_SNAPSHOT.rows, 'snapshot', []);
    process.exit(0);
  }
  const { rows, errors } = await fetchLiveRows();
  if (rows.length === 0) {
    console.error('Live read failed for every seed row. First error:');
    console.error(`  ${errors[0] || '(none captured)'}`);
    console.error('Check the token scopes, or run without a token to use the manual snapshot.');
    process.exit(1);
  }
  report(rows, 'live', errors);
  process.exit(0);
}

main().catch((err) => { console.error(err.message || err); process.exit(1); });
