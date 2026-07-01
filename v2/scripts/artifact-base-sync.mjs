#!/usr/bin/env node
/**
 * READ-ONLY artifact-base sync (connective tissue) for the Goods Alignment Engine.
 * Companion to check-artifact-drift.mjs (Loop B). Run from anywhere:
 *
 *   node v2/scripts/artifact-base-sync.mjs                 (report + write artifact-base.md)
 *   node v2/scripts/artifact-base-sync.mjs --notion-block  (also print a paste-ready Notion markdown block)
 *   node v2/scripts/artifact-base-sync.mjs --strict        (exit 1 if any location is DEAD)
 *
 * It reads the artifact register (src/lib/data/artifact-register.json), checks
 * every location honestly, and generates ONE readable surface of the whole
 * artifact base, grouped by audience:
 *
 *   PUBLIC           live-public routes anyone can open
 *   GATED REVIEWER   live-gated routes and the reviewer evidence pack (Notion)
 *   SEND-READY       design files and funder briefs Ben attaches to emails
 *   INTERNAL WORKING repo docs, code and skills
 *
 * Location checks:
 *   - repo path: the file or directory must exist (in-build artifacts are
 *     allowed to be absent; they are reported as "in build", never DEAD)
 *   - https URL on goodsoncountry.com: HEAD (GET fallback), status recorded
 *     honestly; a password wall 200 or a 401 is recorded as gated, never
 *     followed past auth
 *   - notion / app.notion.com URL: recorded as "notion, not checked" (no token
 *     assumptions)
 *
 * It writes wiki/outputs/artifact-base.md and nothing else. Dead or missing
 * locations get a loud DEAD flag in the output; the script is a reporter, so
 * it exits 0 unless --strict is set.
 */
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..'); // v2/
const repoRoot = path.resolve(projectRoot, '..'); // repo root (register locations are repo-root-relative)
const dataDir = path.join(projectRoot, 'src', 'lib', 'data');
const outFile = path.join(repoRoot, 'wiki', 'outputs', 'artifact-base.md');
const STRICT = process.argv.includes('--strict');
const NOTION_BLOCK = process.argv.includes('--notion-block');
const TODAY = new Date().toLocaleDateString('en-CA'); // local YYYY-MM-DD, not UTC

// One-phrase purposes, keyed by artifact id. Fallback below humanises the id
// so a new register entry never breaks the surface.
const PURPOSE = {
  'pitch-deck-blueprint': 'deck blueprint, predecessor of invest-deck-full',
  'catalytic-pitch-bundle': 'seven-doc catalytic pitch bundle',
  'pencil-deck': 'Pencil deck, predecessor of invest-deck-full',
  'pitch-page-notion': 'Notion pitch page for reviewers',
  'public-pitch-pages': 'public pitch page and document',
  'cost-lab': 'interactive cost model for reviewers',
  'investor-cockpit': 'investor cockpit with live figures',
  'cost-story': 'public cost story',
  'cost-model-engine': 'cost model v6 engine code',
  'best-case-scenario': 'seed fleet of 3 scenario',
  'cost-lab-playbook': 'how to run the Cost Lab',
  'impact-page': 'public impact page',
  'canonical-numbers-sheet': 'the canonical numbers in one sheet',
  'asset-register': 'QR bed records, public asset proof',
  'communities-insights': 'communities served and insights',
  'centrecorp-utopia-report': 'Centrecorp and Utopia impact reports',
  'community-stories': 'community stories from the Empathy Ledger',
  'utopia-field-note': 'Utopia field note',
  'ledger-story-pipeline': 'skill that drafts ledger stories',
  'storyteller-triage': 'storyteller consent triage',
  'cleared-voice-roster': 'locked roster of cleared voices',
  'impact-measurement-method': 'impact measurement method',
  'risk-register': 'scored risk register',
  'governance-framework': 'governance and data framework',
  'role-map': '12-month role map',
  'entity-wording-block': 'entity wording block',
  'legal-structure-full-review': 'Area 09 legal structure review',
  'legal-structure-article': 'legal structure wiki article',
  'investor-alignment-sih': 'SIH investor alignment tool',
  'investor-alignment-case': 'CASE investor alignment tool',
  'sefa-loan-brief': 'SEFA loan application brief',
  'snow-first-mover-brief': 'Snow first-mover brief',
  'centrecorp-nextround-brief': 'Centrecorp next-round beds brief',
  'funding-source-audit-2026-06': '215-source funding audit',
  'funding-refresh-2026-06-28': 'open-now funding shortlist',
  'invest-deck-full': 'the 16-slide investment deck',
  'funder-onepager': 'funder one-pager',
  'funder-landscape-onepager': 'internal funder landscape one-pager',
  'investment-machine-review': 'review of Notion and design surfaces',
  'investor-targets-2026-07': 'July 2026 investor target shortlist',
  'machine-blueprint': 'the investment machine operating blueprint',
  'new-outreach-drafts': 'drafts for LendForGood, Metro and Tripple',
  'next-phase-onepager': 'next-phase one-pager, in build',
  'machine-dashboard-notion': 'weekly machine dashboard in Notion',
  'monday-onepager-generator': 'generates the Monday one-pager',
};
const purposeOf = (a) => PURPOSE[a.id] || a.id.replace(/-/g, ' ');

// Audience grouping. Notion pages sit with the gated reviewer surface (they
// are the evidence pack a reviewer is walked through). Funder briefs are
// repo docs by type but send-ready by use.
const SECTIONS = ['PUBLIC', 'GATED REVIEWER', 'SEND-READY', 'INTERNAL WORKING'];
function sectionOf(a) {
  if (a.status === 'live-public') return 'PUBLIC';
  if (a.status === 'live-gated' || a.type === 'notion page') return 'GATED REVIEWER';
  if (a.type === 'design file' || a.location.includes('funder-reports/')) return 'SEND-READY';
  return 'INTERNAL WORKING';
}

// ── Location checks ──
async function checkRepoPath(a) {
  try {
    await stat(path.join(repoRoot, a.location));
    return { ok: true, note: a.status === 'in-build' ? 'file present (in build)' : 'file present' };
  } catch {
    if (a.status === 'in-build') return { ok: true, note: 'in build, file not present yet' };
    return { ok: false, note: 'MISSING on disk' };
  }
}

async function fetchStatus(url, method) {
  const res = await fetch(url, { method, redirect: 'follow', signal: AbortSignal.timeout(15000) });
  return res.status;
}

async function checkUrl(a) {
  const host = new URL(a.location).hostname;
  if (host.includes('notion')) return { ok: true, note: 'notion, not checked' };
  if (!host.endsWith('goodsoncountry.com')) return { ok: true, note: 'external, not checked' };
  let status;
  try {
    status = await fetchStatus(a.location, 'HEAD');
    if (status === 405 || status === 501) status = await fetchStatus(a.location, 'GET');
  } catch {
    try {
      status = await fetchStatus(a.location, 'GET');
    } catch {
      return { ok: false, note: 'UNREACHABLE (network error)' };
    }
  }
  const gatedEntry = a.status === 'live-gated';
  if (status === 401 || status === 403) return { ok: true, note: `gated (HTTP ${status}), auth not followed` };
  if (status >= 200 && status < 400) {
    return { ok: true, note: gatedEntry ? `HTTP ${status} (password wall, auth not followed)` : `HTTP ${status}` };
  }
  return { ok: false, note: `HTTP ${status}` };
}

const checkOne = (a) => (/^https:\/\//.test(a.location) ? checkUrl(a) : checkRepoPath(a));

// ── Run ──
const { artifacts } = JSON.parse(await readFile(path.join(dataDir, 'artifact-register.json'), 'utf8'));
const results = await Promise.all(
  artifacts.map(async (a) => ({ artifact: a, section: sectionOf(a), check: await checkOne(a) })),
);
const dead = results.filter((r) => !r.check.ok);

// ── Compose the surface ──
const line = (r) => {
  const a = r.artifact;
  const flag = r.check.ok ? '' : '**[DEAD]** ';
  return `- ${flag}**${a.title}**: ${purposeOf(a)}. \`${a.location}\` (${a.status}, last verified ${a.lastVerified}, check ${TODAY}: ${r.check.note})`;
};

const body = [
  '# The Goods artifact base',
  '',
  `> Generated ${TODAY} by \`v2/scripts/artifact-base-sync.mjs\`. ${artifacts.length} artifacts, ${dead.length} dead location(s).`,
  '',
  '1. `canon.ts` holds the numbers; every figure in every artifact traces to a canon fact.',
  '2. `artifact-register.json` is the single index of the artifact base.',
  '3. `check-artifact-drift.mjs` (Loop B) guards citations when a canon fact moves.',
  '4. This file is GENERATED. Edit the register, not this file.',
  '5. The Notion data room front door mirrors this surface, and the two live databases (Funder Pipeline, QBE Opportunity Register) carry pipeline and commitments.',
  '',
  ...SECTIONS.flatMap((section) => {
    const rows = results.filter((r) => r.section === section);
    const label = {
      PUBLIC: 'PUBLIC (live-public routes)',
      'GATED REVIEWER': 'GATED REVIEWER (live-gated routes + evidence pack)',
      'SEND-READY': 'SEND-READY (design files + funder briefs)',
      'INTERNAL WORKING': 'INTERNAL WORKING (repo docs, code, skills)',
    }[section];
    return [`## ${label}`, '', ...(rows.length ? rows.map(line) : ['- (none)']), ''];
  }),
].join('\n');

await mkdir(path.dirname(outFile), { recursive: true });
await writeFile(outFile, body + '\n');

// ── Console ──
console.log(`Goods artifact-base sync\n`);
console.log(`${artifacts.length} artifacts checked. Wrote ${path.relative(repoRoot, outFile)}.`);
for (const section of SECTIONS) {
  console.log(`  ${section.padEnd(18)} ${results.filter((r) => r.section === section).length}`);
}
if (dead.length) {
  console.error('\nDEAD locations (fix the register or restore the file):');
  for (const r of dead) console.error(`  - ${r.artifact.id}: ${r.artifact.location} (${r.check.note})`);
} else {
  console.log('\nNo dead locations. Every checked location resolves.');
}

if (NOTION_BLOCK) {
  console.log('\n--- NOTION BLOCK (paste-ready markdown) ---\n');
  console.log(body);
  console.log('\n--- END NOTION BLOCK ---');
}

if (dead.length && STRICT) process.exit(1);
