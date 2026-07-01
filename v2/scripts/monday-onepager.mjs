#!/usr/bin/env node
/**
 * READ-ONLY: the Monday one-pager. Composes ghl-people-pull (funder pipeline),
 * commitment-register-status and funder-artifact-match into one weekly machine
 * page per the investment-machine blueprint
 * (wiki/outputs/2026-07-02-investment-machine/03-machine-blueprint.md, sections d and f).
 *
 * Usage:
 *   node v2/scripts/monday-onepager.mjs        # writes wiki/outputs/monday/<date>-monday.md
 *
 * Every upstream read is GET-only (the composed scripts only issue GETs).
 * Writes exactly one file, inside the repo. The Notion block at the bottom of
 * the page is STAGED content, never pushed anywhere by this script.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url)); // v2/scripts
const V2_DIR = path.dirname(SCRIPT_DIR); // v2
const ROOT = path.dirname(V2_DIR); // repo root
const OUT_DIR = path.join(ROOT, 'wiki/outputs/monday');

const TARGET = 400000;
const DEADLINE = '2026-08-31';
const QBE_FLOOR = 150000;
const STALE_ASK_DAYS = 14; // stalled list: untouched this long at Ask made
const TIER1_FLAG_DAYS = 7; // indicator 6 flag threshold during the window
const SEND_DEBT_DAYS = 7; // indicator 7: ready-to-send older than one week
const ACTION_TAGS = ['ready-to-send', 'needs-followup', 'ask-out', 'monitor', 'cultivate'];
const LEAD_STACK = ['sefa', 'snow', 'centrecorp'];
const HEDGES = ['white box', 'lendforgood', 'metro', 'minderoo'];

// Known draft paths, matched by funder-name substring (lowercase).
const DRAFTS = [
  ['sefa', 'wiki/outputs/2026-06-28-funding-refresh/04-send-drafts.md (section 1, SEFA covering note) + wiki/outputs/2026-06-20-qbe-funder-landscape/03-outreach-emails-ready-to-send.md (section 1)'],
  ['snow', 'wiki/outputs/2026-06-28-funding-refresh/04-send-drafts.md (section 2, Snow Round 4) + 2026-06-20 emails section 4 (repayable reframe)'],
  ['centrecorp', 'wiki/outputs/2026-06-28-funding-refresh/04-send-drafts.md (section 3, Centrecorp next round)'],
  ['white box', 'wiki/outputs/2026-06-20-qbe-funder-landscape/03-outreach-emails-ready-to-send.md (section 3, White Box EOI)'],
  ['first nations finance', 'wiki/outputs/2026-06-20-qbe-funder-landscape/03-outreach-emails-ready-to-send.md'],
  ['cefc', 'wiki/outputs/2026-06-20-qbe-funder-landscape/03-outreach-emails-ready-to-send.md'],
  ['nab green', 'wiki/outputs/2026-06-20-qbe-funder-landscape/03-outreach-emails-ready-to-send.md'],
  ['invest nt', 'wiki/outputs/2026-06-20-qbe-funder-landscape/03-outreach-emails-ready-to-send.md'],
  ['lendforgood', 'wiki/outputs/2026-07-02-investment-machine/04-new-outreach-drafts.md (section 1, Jay/SIH origination question)'],
  ['metro', 'wiki/outputs/2026-07-02-investment-machine/04-new-outreach-drafts.md (section 2, Metro broker enquiry)'],
  ['tripple', 'wiki/outputs/2026-07-02-investment-machine/04-new-outreach-drafts.md (section 3, Tripple intro via Snow)'],
];
const NUDGE_DRAFT = 'wiki/outputs/2026-06-28-funding-refresh/04-send-drafts.md (section 4, stalled-ask nudges)';

const draftFor = (name) => {
  const n = name.toLowerCase();
  const hit = DRAFTS.find(([k]) => n.includes(k));
  return hit ? hit[1] : null;
};
const money = (dollars) => `$${Math.round(dollars).toLocaleString('en-AU')}`;
const daysSince = (iso, now) => (iso ? Math.floor((now - new Date(iso).getTime()) / 86400000) : null);
const days = (n) => (n === 1 ? '1 day' : `${n ?? '?'} days`);
const HEDGE_LABEL = { 'white box': 'White Box', lendforgood: 'LendForGood', metro: 'Metro Finance', minderoo: 'Minderoo' };

function run(cwd, args, label) {
  const r = spawnSync(process.execPath, args, {
    cwd, encoding: 'utf8', timeout: 120000, maxBuffer: 64 * 1024 * 1024,
  });
  if (r.error) return { ok: false, reason: `${label}: ${r.error.message}` };
  if (r.status !== 0) {
    const err = (r.stderr || '').trim().split('\n').slice(-2).join(' ');
    return { ok: false, reason: `${label} exited ${r.status}${err ? `: ${err}` : ''}` };
  }
  return { ok: true, stdout: r.stdout, stderr: r.stderr || '' };
}

function runJson(cwd, args, label) {
  const r = run(cwd, args, label);
  if (!r.ok) return r;
  try {
    return { ok: true, data: JSON.parse(r.stdout), stderr: r.stderr };
  } catch (e) {
    return { ok: false, reason: `${label}: unparseable JSON (${e.message})` };
  }
}

// funder-artifact-match --all prints line pairs:
//   [Stage] Name  (type)
//      send: A; B; C
function parseMatch(stdout) {
  const recs = [];
  const lines = stdout.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\[(.+?)\]\s+(.+?)\s+\((\w+)\)\s*$/);
    if (!m) continue;
    const sendLine = (lines[i + 1] || '').match(/^\s+send:\s+(.*)$/);
    recs.push({
      stage: m[1], name: m[2], type: m[3],
      send: sendLine ? sendLine[1].split(';').map((s) => s.trim()).filter(Boolean) : [],
    });
  }
  return recs;
}

function main() {
  const now = Date.now();
  const d = new Date();
  const dateStr = [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');

  // ---- upstream reads (all GET-only inside the composed scripts) ----
  const reg = runJson(ROOT, [path.join(V2_DIR, 'scripts/commitment-register-status.mjs'), '--json'], 'commitment-register-status');
  const pull = runJson(V2_DIR, [path.join(SCRIPT_DIR, 'ghl-people-pull.mjs'), '--pipeline', 'funder', '--json'], 'ghl-people-pull');
  const matchRaw = run(V2_DIR, [path.join(SCRIPT_DIR, 'funder-artifact-match.mjs'), '--all'], 'funder-artifact-match');
  const match = matchRaw.ok ? { ok: true, recs: parseMatch(matchRaw.stdout) } : matchRaw;

  const funder = pull.ok ? pull.data.pipelines.find((p) => p.key === 'funder') : null;
  const opps = funder ? funder.opportunities : [];
  const open = opps; // pull emits open opportunities

  const isTier1 = (o) => (o.tags || []).includes('qbe-tier-1') || LEAD_STACK.some((k) => o.name.toLowerCase().includes(k));
  const readyToSend = open
    .filter((o) => (o.tags || []).includes('ready-to-send'))
    .map((o) => ({ ...o, age: daysSince(o.updatedAt, now) }))
    .sort((a, b) => (b.age ?? 0) - (a.age ?? 0)); // oldest first
  const tier1 = open
    .filter(isTier1)
    .map((o) => ({ ...o, age: daysSince(o.updatedAt, now) }))
    .sort((a, b) => (b.age ?? 0) - (a.age ?? 0));
  const stalled = open
    .filter((o) => (o.tags || []).includes('needs-followup') || (o.stage === 'Ask made' && (daysSince(o.updatedAt, now) ?? 0) >= STALE_ASK_DAYS))
    .map((o) => ({ ...o, age: daysSince(o.updatedAt, now) }))
    .sort((a, b) => (b.age ?? 0) - (a.age ?? 0));

  // ---- line 1: the honest distance ----
  let line1;
  const banners = [];
  if (reg.ok) {
    const signed = reg.data.signedTotal ?? 0;
    const weeks = reg.data.daysToDeadline != null ? (reg.data.daysToDeadline / 7).toFixed(1) : '?';
    line1 = `**Signed ${money(signed)} of ${money(reg.data.target ?? TARGET)}, ${weeks} weeks to 31 Aug 2026.**`;
    if (dateStr >= '2026-08-01' && signed < QBE_FLOOR) {
      line1 += ` **Below the ${money(QBE_FLOOR)} QBE floor with the window closing: the conversation with Jay shifts to what a partial stack means for Stage 2.**`;
    }
    if (reg.data.mode === 'snapshot') {
      const banner = (reg.stderr || '').trim();
      banners.push(`> WARNING: commitment register read in SNAPSHOT mode${reg.data.seedDate ? ` (seed date ${reg.data.seedDate})` : ''}, not live Notion.${banner ? ` ${banner}` : ''}`);
    }
  } else {
    line1 = `**Signed total unavailable: ${reg.reason}. The target is still ${money(TARGET)} by 31 Aug 2026.**`;
  }

  // ---- the four moves (mechanical: overdue sends oldest first, then stalled Tier 1, then artifact match) ----
  const moves = [];
  const picked = new Set();
  for (const o of readyToSend) {
    if (moves.length >= 4) break;
    picked.add(o.name);
    const draft = draftFor(o.name);
    moves.push({
      name: o.name, stage: o.stage, value: o.valueCents,
      action: `Send the drafted ask (founder voice), note the send date, then stage the GHL move to Ask made. This send is ${days(o.age)} old by GHL updatedAt (a floor; bulk touches reset it).`,
      path: draft || 'no mapped draft; run funder-artifact-match for the artifact set',
    });
  }
  for (const o of tier1) {
    if (moves.length >= 4) break;
    if (picked.has(o.name)) continue;
    if ((o.age ?? 0) < TIER1_FLAG_DAYS) continue;
    picked.add(o.name);
    const draft = draftFor(o.name);
    moves.push({
      name: o.name, stage: o.stage, value: o.valueCents,
      action: `Tier 1 funder untouched ${days(o.age)} at ${o.stage}. Make the next touch this week.`,
      path: draft || NUDGE_DRAFT,
    });
  }
  if (match.ok) {
    const priority = ['Ask made', 'Cultivating', 'Qualified'];
    const recs = match.recs
      .filter((r) => !picked.has(r.name) && r.send.length)
      .sort((a, b) => (priority.indexOf(a.stage) + 99 * (priority.indexOf(a.stage) < 0)) - (priority.indexOf(b.stage) + 99 * (priority.indexOf(b.stage) < 0)));
    for (const r of recs) {
      if (moves.length >= 4) break;
      picked.add(r.name);
      moves.push({
        name: r.name, stage: r.stage, value: null,
        action: `Send the matched artifacts: ${r.send.join('; ')}.`,
        path: draftFor(r.name) || 'artifacts per v2/src/lib/data/artifact-register.json',
      });
    }
  }

  const fmtMove = (m, i) => {
    const val = m.value != null ? `, ${money(m.value / 100)}` : '';
    return `${i + 1}. **${m.name}** (${m.stage}${val})\n   Who: Ben. ${m.action}\n   Draft/artifact: ${m.path}`;
  };

  // ---- the 10 leading indicators ----
  const ind = [];
  // 1
  ind.push(reg.ok
    ? `**Signed match-eligible total:** ${money(reg.data.signedTotal ?? 0)} of ${money(reg.data.target ?? TARGET)} (${reg.data.pctOfTarget ?? 0}%). ${reg.data.daysToDeadline != null ? `${(reg.data.daysToDeadline / 7).toFixed(1)} weeks remaining.` : ''}`
    : `**Signed match-eligible total:** unavailable: ${reg.reason}`);
  // 2
  ind.push(reg.ok
    ? `**Register rows at Match Eligible = Yes:** ${reg.data.matchEligibleYes ?? 0} of ${reg.data.rowCount ?? '?'}${reg.data.matchEligibleYesWithEvidence != null ? ` (${reg.data.matchEligibleYesWithEvidence} with an evidence URL)` : ''}.`
    : `**Register rows at Match Eligible = Yes:** unavailable: ${reg.reason}`);
  // 3
  if (funder) {
    const asks = open.filter((o) => o.stage === 'Ask made');
    const withValue = asks.filter((o) => o.valueCents != null);
    ind.push(`**Asks out with a specific amount, instrument and use:** ${asks.length} open at Ask made, ${withValue.length} carry a $ value. Whether each went out with a specific amount, instrument and use is not machine-verifiable; Ben keeps the honest count (the Minderoo correction stands until a real ask is confirmed).`);
  } else {
    ind.push(`**Asks out:** unavailable: ${pull.reason}`);
  }
  // 4
  if (funder) {
    const sefa = open.find((o) => o.name.toLowerCase().includes('sefa'));
    ind.push(sefa
      ? `**SEFA milestone:** GHL stage ${sefa.stage}, last touched ${days(daysSince(sefa.updatedAt, now))} ago${(sefa.tags || []).includes('ready-to-send') ? ', still tagged ready-to-send (the enquiry has not gone out)' : ''}. Enquiry lodged / credit assessment opened / term sheet drafted: no data yet, not tracked in GHL. This is the anchor's clock and it is the tightest.`
      : `**SEFA milestone:** no SEFA row found in the funder pipeline. That itself needs checking.`);
  } else {
    ind.push(`**SEFA milestone:** unavailable: ${pull.reason}`);
  }
  // 5
  ind.push(`**Jay rules email:** no machine source (sent y/n, answered y/n live in Ben's outbox). Draft ready at wiki/outputs/2026-06-20-qbe-funder-landscape/03-outreach-emails-ready-to-send.md (section 2).`);
  // 6
  if (funder) {
    const rows = tier1.map((o) => `${o.name.split(/\s+[—-]\s+/)[0]}: ${o.age ?? '?'}d${(o.age ?? 0) >= TIER1_FLAG_DAYS ? ' FLAG' : ''}`);
    ind.push(`**Days since last touch, Tier 1 funders** (flag over ${TIER1_FLAG_DAYS}d in the window; updatedAt is a weak proxy, bulk touches reset it): ${rows.length ? rows.join(' | ') : 'no Tier 1 rows found'}.`);
  } else {
    ind.push(`**Tier 1 last touch:** unavailable: ${pull.reason}`);
  }
  // 7
  if (funder) {
    const debt = readyToSend.filter((o) => (o.age ?? 0) > SEND_DEBT_DAYS);
    ind.push(`**Send debt (ready-to-send older than a week):** ${debt.length} of ${readyToSend.length}${debt.length ? `: ${debt.map((o) => `${o.name.split(/\s+[—-]\s+/)[0]} (${o.age ?? '?'}d)`).join(', ')}` : ''}. Ages are GHL updatedAt, a floor only; bulk touches reset it (the SEFA send debt is older than the tag date suggests).`);
  } else {
    ind.push(`**Send debt:** unavailable: ${pull.reason}`);
  }
  // 8
  if (funder) {
    const noValue = open.filter((o) => o.valueCents == null);
    const noAction = open.filter((o) => !(o.tags || []).some((t) => ACTION_TAGS.includes(t)));
    const regFlags = reg.ok ? reg.data.rows.flatMap((r) => (r.flags || []).map((f) => `${r.opportunity}: ${f}`)) : null;
    ind.push(`**Pipeline hygiene:** ${noValue.length} open opportunities missing a $ value, ${noAction.length} missing an Action tag.${regFlags ? ` Register flags (${regFlags.length}): ${regFlags.length ? regFlags.slice(0, 8).join('; ') + (regFlags.length > 8 ? `; and ${regFlags.length - 8} more` : '') : 'none'}.` : ` Register flags unavailable: ${reg.reason}.`}`);
  } else {
    ind.push(`**Pipeline hygiene:** unavailable: ${pull.reason}`);
  }
  // 9
  if (funder) {
    const lfg = open.find((o) => o.name.toLowerCase().includes('lendforgood'));
    ind.push(`**LendForGood origination (asked / answered / campaign live):** no data yet. ${lfg ? `GHL row exists at ${lfg.stage}.` : 'Not in GHL yet (the row is a staged write awaiting Ben).'} The question to Jay is drafted at wiki/outputs/2026-07-02-investment-machine/04-new-outreach-drafts.md (section 1).`);
  } else {
    ind.push(`**LendForGood origination:** unavailable: ${pull.reason}`);
  }
  // 10
  if (funder) {
    const bench = HEDGES.map((h) => {
      const o = open.find((x) => x.name.toLowerCase().includes(h));
      return o ? `${o.name.split(/\s+[—-]\s+/)[0]}: ${o.stage}${o.valueCents != null ? ` ${money(o.valueCents / 100)}` : ''}` : `${HEDGE_LABEL[h] || h}: not in GHL (staged)`;
    });
    ind.push(`**Hedge depth (signable candidates outside the lead stack):** ${bench.join(' | ')}. If the lead stack loses a leg, this is the bench.`);
  } else {
    ind.push(`**Hedge depth:** unavailable: ${pull.reason}`);
  }

  // ---- assemble the page ----
  const L = [];
  L.push(line1);
  L.push('');
  for (const b of banners) { L.push(b); L.push(''); }
  L.push(`# Monday one-pager, ${dateStr}`);
  L.push('');
  L.push(`> Generated by \`v2/scripts/monday-onepager.mjs\`. All reads GET-only (GHL, Notion register). Nothing written outside this file. Pipeline value is never committed money; money is received only when it is in Xero.`);
  L.push('');

  L.push(`## The four moves this week`);
  L.push('');
  if (moves.length) {
    moves.forEach((m, i) => L.push(fmtMove(m, i)));
  } else if (!funder) {
    L.push(`unavailable: ${pull.reason}`);
  } else {
    L.push(`No mechanical moves surfaced (no overdue sends, no stalled Tier 1, no artifact recommendations). Check the pull is healthy before believing this.`);
  }
  L.push('');

  L.push(`## Stalled (needs-followup, or ${STALE_ASK_DAYS}+ days untouched at Ask made)`);
  L.push('');
  if (!funder) {
    L.push(`unavailable: ${pull.reason}`);
  } else if (!stalled.length) {
    L.push(`Nothing stalled today.`);
  } else {
    for (const o of stalled) {
      L.push(`- **${o.name}** (${o.stage}, ${o.age ?? '?'}d since last touch${o.valueCents != null ? `, ${money(o.valueCents / 100)}` : ''}). Nudge draft: ${draftFor(o.name) || NUDGE_DRAFT}. After 2+ silent follow-ups, mark lost, same sitting.`);
    }
  }
  L.push('');

  L.push(`## Send list (ready-to-send, with draft paths)`);
  L.push('');
  if (!funder) {
    L.push(`unavailable: ${pull.reason}`);
  } else if (!readyToSend.length) {
    L.push(`Nothing tagged ready-to-send.`);
  } else {
    for (const o of readyToSend) {
      L.push(`- **${o.name}** (${o.stage}, tagged ${o.age ?? '?'}d ago). Draft: ${draftFor(o.name) || 'no mapped draft; write one before sending'}. Founder sends; the stage moves ON SEND, never on intent.`);
    }
  }
  L.push('');

  L.push(`## Leading indicators (blueprint section f)`);
  L.push('');
  ind.forEach((x, i) => L.push(`${i + 1}. ${x}`));
  L.push('');

  // ---- staged Notion block ----
  L.push('---');
  L.push('');
  L.push(`## STAGED FOR NOTION: Machine Dashboard update (NOT PUSHED)`);
  L.push('');
  L.push(`> Paste-ready content for the Machine Dashboard page in the data room. This script has NOT written it to Notion; every Notion write stays founder-gated. Copy the block below after Ben's Tuesday review.`);
  L.push('');
  L.push('```markdown');
  L.push(`# Machine Dashboard, week of ${dateStr}`);
  L.push('');
  L.push(line1.replace(/\*\*/g, ''));
  L.push('');
  L.push(`## The four moves`);
  moves.forEach((m, i) => L.push(`${i + 1}. ${m.name} (${m.stage}): ${m.action}`));
  if (!moves.length) L.push(funder ? 'No mechanical moves surfaced this week.' : `unavailable: ${pull.reason}`);
  L.push('');
  L.push(`## Commitment register`);
  L.push(reg.ok
    ? `Signed ${money(reg.data.signedTotal ?? 0)} of ${money(reg.data.target ?? TARGET)} (${reg.data.pctOfTarget ?? 0}%). Match Eligible = Yes on ${reg.data.matchEligibleYes ?? 0} of ${reg.data.rowCount ?? '?'} rows. As at ${reg.data.asAt ?? dateStr}${reg.data.mode === 'snapshot' ? ' (SNAPSHOT read, not live)' : ''}.`
    : `unavailable: ${reg.reason}`);
  L.push('');
  L.push(`## Leading indicators`);
  ind.forEach((x, i) => L.push(`${i + 1}. ${x.replace(/\*\*/g, '')}`));
  L.push('');
  L.push(`## Links`);
  L.push(`- Funder Pipeline DB (Notion page c296ebc96ecd47899a9f805e8dd0d1cd, data source 97afae12-6930-4e23-aff7-688f100fa47b)`);
  L.push(`- QBE Opportunity Register (Notion collection 62ffa800)`);
  L.push(`- This week's full page: wiki/outputs/monday/${dateStr}-monday.md`);
  L.push('```');
  L.push('');

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const outPath = path.join(OUT_DIR, `${dateStr}-monday.md`);
  fs.writeFileSync(outPath, L.join('\n'));
  console.log(`Wrote ${path.relative(ROOT, outPath)}`);
  if (!reg.ok) console.error(`register unavailable: ${reg.reason}`);
  if (!pull.ok) console.error(`ghl pull unavailable: ${pull.reason}`);
  if (!match.ok) console.error(`artifact match unavailable: ${match.reason}`);
}

main();
