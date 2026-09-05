#!/usr/bin/env node
// Retired-figure guard.
//
// The existing drift guards compare canon against the live register and against
// the data modules they know about. Nothing read arbitrary source files, so a
// canon figure typed as a literal into a page or a data file kept rendering the
// old number long after canon moved. Found this way on 2026-07-25:
//
//   deck.ts               "16 in community" washers   (canon 22) — on the deck's
//                                                       "what we have delivered" slide
//   centrecorp-story.tsx  "9 communities served"      (canon 11) — while the same
//                                                       file said 11 two hundred lines up
//   admin-sidebar.tsx     "540 · 177 · 20 · 11"       (canon 22) — under a badge
//                                                       reading "Canon in sync"
//
// This guard looks for RETIRED values only, never current ones. A retired figure
// is unambiguous: there is no context in which "16 washing machines in community"
// is right today. That keeps false positives near zero, which is what decides
// whether a guard survives or gets muted.
//
// It deliberately does NOT flag a current canon value that happens to be typed by
// hand. Doing that would fire on legitimate per-community numbers (Tennant Creek
// really does have 9 washers) and on historical statements. Deriving from
// CANONICAL_ASSETS is still the house style; this guard catches the failure that
// actually bit us.
//
// Run: npm run check:retired-figures   (from v2/)
// Exit 0 = clean. Exit 1 = a retired figure is being rendered, with file:line.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const V2 = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(V2, 'src');

/**
 * value    the retired literal, as it would be typed
 * what     what it counted
 * now      the canon value that replaced it
 * context  regex the same line must also match. Required for small integers,
 *          which appear everywhere as spacing, indexes and unrelated counts.
 * ruling   where the supersession is recorded
 */
const RETIRED = [
  { value: '496', what: 'beds deployed', now: '540', context: /bed|deployed/i, ruling: '2026-07-19 canon move' },
  { value: '2,660', what: 'plastic kg', now: '3,540', context: /kg|plastic|hdpe/i, ruling: '2026-07-19 canon move' },
  { value: '2660', what: 'plastic kg', now: '3540', context: /kg|plastic|hdpe/i, ruling: '2026-07-19 canon move' },
  { value: '133', what: 'stretch beds', now: '177', context: /stretch/i, ruling: '2026-07-19 canon move' },
  { value: '190', what: 'press temperature °C', now: '180', context: /°c|degree|press|heat/i, ruling: 'Ben 2026-07-17' },
  { value: '20', what: 'washers in community', now: '22', context: /washer|washing machine|pakkimjalki/i, ruling: 'Ben 2026-07-21' },
  { value: '16', what: 'washers in community', now: '22', context: /washer|washing machine|pakkimjalki/i, ruling: 'Ben 2026-07-21' },
  { value: '28', what: 'washers deployed', now: '22', context: /washer|washing machine/i, ruling: 'retired split, never reinstate' },
  { value: '9', what: 'communities served', now: '11', context: /communities (served|reached)|across 9 communities/i, ruling: '2026-07-19 canon move' },

  // MONEY. Added 2026-07-26 after a retired capex band was found in the PRESENTER TALK TRACK,
  // one day after the ruling that retired it. Every entry below reached a funder-facing surface.
  { value: '475K', what: 'the old lead stack', now: '$607.5K grants / $710K repayable', context: /stack|sefa|snow|centrecorp/i, ruling: 'stack rebuilt 2026-07-25 from all 67 CRM rows' },
  { value: '150K', what: 'per-site plant capital band', now: 'priced per site by the module model', context: /per site|a site|plant capital/i, ruling: 'DECISIONS.md ruling O' },
  { value: '679.7K', what: 'grant and philanthropic receipts with Centrecorp inside them', now: '$556,330 (~62%); Centrecorp $123,332 is a buyer', context: /grant|philanthrop|receipt/i, ruling: 'DECISIONS.md ruling Z, 2026-09-05' },
  { value: '679,662', what: 'grant and philanthropic receipts with Centrecorp inside them', now: '$556,330 (~62%); Centrecorp $123,332 is a buyer', context: /grant|philanthrop|receipt/i, ruling: 'DECISIONS.md ruling Z, 2026-09-05' },
  { value: '403,901', what: 'the "surplus"', now: 'never cited; the sole trader FY26 P&L closed on a net profit of ~$168K before founder wages and no surplus is claimed for Goods', context: /surplus|profit|revenue/i, ruling: 'DECISIONS.md ruling H' },

  // SUPPLY MATH. Added 2026-08-24 with ruling T (20kg/bed). An external analysis assumed
  // 45kg/bed and derived a scenario family from it (22 beds/t, 17,700 beds, 109,600 beds);
  // the ~800t/yr CDS figure has no primary source (NT EPA: ~530t PET). Demolition with
  // citations: research/nt-plastics-overcrowding-facts-2026-08-24.md. The typed facts these
  // replace live in supply-context.ts.
  { value: '45kg', what: 'plastic per bed (invented)', now: '20kg (ruling T)', context: /bed|plastic|hdpe/i, ruling: 'DECISIONS.md ruling T' },
  { value: '45 kg', what: 'plastic per bed (invented)', now: '20kg (ruling T)', context: /bed|plastic|hdpe/i, ruling: 'DECISIONS.md ruling T' },
  { value: '25kg', what: 'plastic per bed (Envirobank brief)', now: '20kg (ruling T)', context: /bed(?!s? per bench)/i, ruling: 'DECISIONS.md ruling T' },
  { value: '109,600', what: 'beds-possible from NT plastics', now: 'never derive beds-possible from supply; demand ceiling is 2,761 very-remote overcrowded households', context: /bed|plastic/i, ruling: 'DECISIONS.md ruling T' },
  { value: '17,700', what: 'beds-possible from CDS plastic', now: 'never derive beds-possible from supply', context: /bed|plastic|cds/i, ruling: 'DECISIONS.md ruling T' },
  { value: '800 tonnes', what: 'NT CDS plastic per year (unsupported)', now: '~530 tonnes PET (NT EPA annual report 2023-24)', context: /cds|container|deposit/i, ruling: 'DECISIONS.md ruling T' },
  { value: '800t', what: 'NT CDS plastic per year (unsupported)', now: '~530 tonnes PET (NT EPA annual report 2023-24)', context: /cds|container|deposit/i, ruling: 'DECISIONS.md ruling T' },
  { value: '60 Stretch', what: 'Maningrida in-house run size (Notion source)', now: '40 (register-verified 2026-08-24; INV-0303)', context: /bed/i, ruling: 'CONTEXT.md pressed-run entry; regressed once from the Notion source' },
  { value: '60-bed', what: 'Maningrida in-house run size (Notion source)', now: '40-bed (register-verified 2026-08-24; INV-0303)', context: /run|batch|ledger/i, ruling: 'CONTEXT.md pressed-run entry' },

  // PALM ISLAND'S 40-BED ORDER NEVER HAPPENED. Ben, 2026-09-05: "remove this one, didn't happen."
  // INV-0317 was carried in compendium.ts as an authorised $36,300 receivable from May 2026 and
  // reached slide 05 of the QBE deck as a sixth bed buyer. On 5 Sep 2026 it is absent from Xero's
  // aged receivables and from every invoice on the PICC contact, paid or unpaid. Palm Island has
  // paid $436,700 across five invoices and none of them has a bed on it.
  { value: 'INV-0317', what: "Palm Island's 40-bed order", now: 'nothing; the order was never placed', ruling: "Ben 2026-09-05, \"didn't happen\"" },
  { value: '36,300', what: "Palm Island's 40-bed order", now: 'nothing; the order was never placed', context: /picc|palm island|receivable|bed/i, ruling: 'Ben 2026-09-05' },
  { value: '36300', what: "Palm Island's 40-bed order", now: 'nothing; the order was never placed', context: /picc|palm island|receivable|bed/i, ruling: 'Ben 2026-09-05' },

  // RECEIVABLES RESTATED 2026-09-05 against Xero's aged receivables of the same date, on three
  // rulings from Ben: Homeland INV-0303 $44,000 "has been paid"; Regional Arts INV-0302 $16,500
  // "is a different project and related to the Harvest"; Rotary $82,500 bad debt "is fine for now".
  // $143,000 was the 3 June composition of all three. Collectable Goods receivables are now $0.
  { value: '143,000', what: 'accounts receivable', now: '$82,500, all of it Rotary bad debt; $0 collectable', context: /receivable/i, ruling: 'Ben 2026-09-05' },
  { value: '143_000', what: 'accounts receivable', now: '$82,500, all of it Rotary bad debt; $0 collectable', context: /receivable/i, ruling: 'Ben 2026-09-05' },
  { value: '143K', what: 'accounts receivable', now: '$82.5K, all of it Rotary bad debt; $0 collectable', context: /receivable|outstanding/i, ruling: 'Ben 2026-09-05' },

  // REVENUE RESTATED 2026-09-05 (Ben: "yes restate revenue to $785,111"). The 3 June 2026 reconcile
  // baseline was $741,111 and Homeland INV-0303 $44,000 was paid after it, leaving the money in
  // neither revenue nor receivables. Commercial receipts move $61,449 -> $105,449.
  { value: '741,111', what: 'funding received since inception', now: '$901,311 (via $785,111 earlier the same day)', context: /receiv|revenue|funding|investment/i, ruling: 'Ben 2026-09-05' },
  { value: '741_111', what: 'funding received since inception', now: '$901,311 (via $785,111 earlier the same day)', context: /receiv|revenue|funding|investment/i, ruling: 'Ben 2026-09-05' },
  { value: '741.1K', what: 'funding received since inception', now: '$901.3K', context: /receiv|revenue|accrec/i, ruling: 'Ben 2026-09-05' },
  { value: '61,449', what: 'commercial and buyer receipts', now: '$221,649 (adds Homeland INV-0303, ALIVE INV-0342, Julalikari INV-0335)', context: /commercial|buyer|receipt/i, ruling: 'Ben 2026-09-05' },
  { value: '61_449', what: 'commercial and buyer receipts', now: '$221,649 (adds Homeland INV-0303, ALIVE INV-0342, Julalikari INV-0335)', context: /commercial|buyer|receipt/i, ruling: 'Ben 2026-09-05' },

  // REVENUE RESTATED AGAIN 2026-09-05 (Ben: ALIVE and Julalikari "are sales which showcase how we can
  // sell beds and how communities can as well, and washing machines, same as the Centrecorp sales").
  // ALIVE INV-0342 $101,200 and Julalikari INV-0335 $15,000 were paid after the 3 June baseline too.
  // Funding received $785,111 -> $901,311; commercial and buyer receipts $105,449 -> $221,649.
  { value: '785,111', what: 'funding received since inception', now: '$901,311', context: /receiv|revenue|funding|investment/i, ruling: 'Ben 2026-09-05' },
  { value: '785_111', what: 'funding received since inception', now: '$901,311', context: /receiv|revenue|funding|investment/i, ruling: 'Ben 2026-09-05' },
  { value: '785.1K', what: 'funding received since inception', now: '$901.3K', context: /receiv|revenue|accrec/i, ruling: 'Ben 2026-09-05' },
  { value: '105,449', what: 'commercial and buyer receipts', now: '$221,649 (adds ALIVE INV-0342 and Julalikari INV-0335)', context: /commercial|buyer|receipt/i, ruling: 'Ben 2026-09-05' },
  { value: '105_449', what: 'commercial and buyer receipts', now: '$221,649 (adds ALIVE INV-0342 and Julalikari INV-0335)', context: /commercial|buyer|receipt/i, ruling: 'Ben 2026-09-05' },
  { value: '105.4K', what: 'commercial and buyer receipts', now: '$221.6K', context: /commercial|buyer|receipt/i, ruling: 'Ben 2026-09-05' },
];

/**
 * RETIRED PHRASES. The gap that let ruling D rot for a day and ruling O reach a talk track.
 *
 * A retired number is unambiguous. A retired phrase is not, so every entry needs a `context` or a
 * tight pattern, and the exemptions below matter more than the patterns do.
 */
const RETIRED_PHRASES = [
  {
    pattern: /\bco-design(ed|ing)?\b/i,
    what: '"co-design"',
    use: 'designed in community, led by community',
    ruling: 'Ben 2026-07-11, standing',
  },
  {
    pattern: /\b(become unnecessary|then step back)\b/i,
    what: 'the retired purpose line',
    use: 'name what Goods is FOR after a handover: design, quality, training, parts, back office',
    ruling: 'DECISIONS.md ruling A',
  },
  {
    pattern: /\baccountant[- ]signed\b/i,
    what: '"accountant-signed"',
    use: 'workpaper, prepared with the accountant. No signed document exists.',
    ruling: 'DECISIONS.md rulings G and H',
  },
  {
    pattern: /\b75\s*(to|-|–)\s*100\s+beds\b/i,
    what: 'the "75 to 100 beds a year" claim',
    use: 'the honest denominator is 234 to 529 beds/yr, decided by who pays the line supervisor',
    ruling: 'DECISIONS.md ruling I',
  },
  {
    pattern: /\bNET_CAPITAL/,
    what: 'a net capital figure',
    use: 'quote capital GROSS only, with sunk spend stated beside it',
    ruling: 'DECISIONS.md ruling P',
  },
  {
    // The object, not the building. "the plant" as the thing offered to or owned by a community.
    pattern: /\b(a|the)\s+plant\s+(is\s+the\s+(path|bridge)|that\s+(can\s+)?moves?|can\s+(move|transfer))\b/i,
    what: 'the plant as the thing offered or transferred',
    use: 'infrastructure that scales from a single shredder up. Name the making or the facility.',
    ruling: 'DECISIONS.md ruling D',
  },
  {
    pattern: /\b(community[- ]owned plant|owns? the plant|back the plant)\b/i,
    what: 'the plant as the ownership object',
    use: 'the making, or the site. And ownership is a pathway: use "toward".',
    ruling: 'DECISIONS.md ruling D',
  },
  {
    // RULING AA (Ben, 5 Sep 2026): the charity is the applicant and the directors are locked. These
    // phrases carried the question as open for a week after it was settled.
    pattern: /\b(subject to (?:jay|social impact hub)|recommended route|proposed applicant|ready,? subject to (?:jay|the entity))\b/i,
    what: 'the applicant as an open question',
    use: 'The Butterfly Movement Ltd, trading as Goods on Country, applies and receives (ruling AA)',
    ruling: 'DECISIONS.md ruling AA, 2026-09-05',
  },
  {
    // RULING X (28 Aug 2026): there is no separate "Goods." maker-and-seller layer any more.
    pattern: /\btrad(?:es|ing) as Goods\.(?=[\s,)]|$)/,
    what: 'a company "trading as Goods." as a current layer',
    use: 'Goods on Country, The Butterfly Movement Ltd; the company is the historic maker transferring its assets',
    ruling: 'DECISIONS.md ruling X, 2026-08-28',
  },
  {
    // The "net loss" was the 31 May 2026 year-to-date position. The year closed on a net profit of
    // $167,969.63 (Xero, re-pulled 5 Sep 2026) with wages and superannuation at $0, and the old
    // sentence sat in canon, the cost story and STRATEGY.md for three months after it stopped being true.
    pattern: /\b(FY26 net loss|(?:P&L|entity|sole trader) (?:is|runs|ran|shows|showed) (?:an? |the )?(?:FY26 )?net loss)\b/i,
    what: '"the entity runs an FY26 net loss"',
    use: "the sole trader's FY26 P&L closed on a net profit of about $168K before any founder wages; no surplus is claimed for Goods",
    ruling: 'Ben 2026-09-05 (DECISIONS.md ruling H, corrected)',
  },
];

/**
 * Files that RECORD a retirement necessarily contain the retired words.
 *
 * This is the third time this pattern has bitten in one week (mustNeverSee in audience.ts,
 * neverSay in deck-road.ts, and now here). A guard that reads the file enforcing the rule will
 * always flag the rule itself.
 */
const PHRASE_EXEMPT = [
  { path: 'lib/data/retired', why: 'Anything explicitly named as a retired-claims register.' },
  { path: 'guards.test.', why: 'Guard tests assert on the retired strings by design.' },
  { path: 'check-', why: 'This script and its siblings quote what they ban.' },
  { path: 'app/admin', why: 'Internal operator UI, and it is where we TELL editors what not to write.' },
];

/**
 * A line that NEGATES a retired phrase is enforcing the rule, not breaking it.
 *
 * This is the fourth time in one week a guard has flagged the field that enforces the thing it
 * guards (mustNeverSee in audience.ts, neverSay in deck-road.ts, the MEL historical record, and
 * now every "not accountant-signed" in the codebase). Without this, the guard fires on
 * ask-surface.ts saying "workpaper (not accountant-signed)", which is exactly right.
 *
 * Deliberate tradeoff: a negation ANYWHERE on the line suppresses that line. A long line that
 * both negates one claim and asserts another would slip through. Accepted, because the failure
 * direction of the alternative is worse: a guard with false positives gets muted, and a muted
 * guard catches nothing at all.
 */
const NEGATED = /\b(not|never|no longer|there (?:is|are|was|were) no|retired|banned|instead of|rather than|do not|don't|avoid|stop using|is wrong)\b/i;

/**
 * Ownership language is compliant when it names itself as a pathway. Ruling D and the standing
 * ceiling forbid claiming ownership COMPLETE, not discussing ownership.
 */
const PATHWAY_QUALIFIED = /\b(still ahead|not yet|destination|over time|toward|towards|pathway|will be|closer to|moving|move[sd]? to|can move)\b/i;

/** "co-design" as a ThemeId key or label is data, not prose. Migration is tracked separately. */
const CODESIGN_AS_KEY = /(theme|themes|id)\s*:|['"`]co-design['"`]\s*[:,\]]|\|\s*'co-design'/;

/**
 * Lines that legitimately mention a retired figure. Each needs a reason: this
 * list is the difference between a guard people keep and one they mute.
 */
const ALLOWED = [
  {
    file: 'lib/data/compendium.ts',
    match: /Washing machine count: 5 deployed/,
    why: 'A note recording a past data discrepancy. Quoting the old number is the point.',
  },
  {
    file: 'lib/data/compendium.ts',
    match: /Per 2026-07-03 lead stack/,
    why: 'Explicitly dated as the 3 July position. A record of what was true then, not a claim about now.',
  },
  {
    file: 'lib/data/cost-story.ts',
    match: /never the \$403,901/i,
    why: 'A watchOut instructing us NEVER to cite this figure. The rule has to name the number it bans.',
  },
  {
    file: 'lib/data/canon.ts',
    match: /Was \$785,111:/,
    why: 'The canon definition records what funding received WAS and why it moved a second time on 2026-09-05. Same reason as the receivables row below.',
  },
  {
    file: 'lib/data/canon.ts',
    match: /Was \$143,000:/,
    why: 'The canon definition records what the figure WAS and why it moved on 2026-09-05. A canon row that cannot say what it superseded is a canon row nobody can audit.',
  },
  {
    file: 'lib/data/compendium.ts',
    match: /The 3 June baseline was/,
    why: 'The restatement note has to name the figure it replaced (2026-09-05).',
  },
  {
    file: 'lib/data/grant-content.ts',
    match: /confirmed NOT understated for the window it covered/,
    why: 'A dated record of what the 3 June reconcile concluded about the old commercial line.',
  },
  {
    file: 'lib/data/claims-ledger.guards.test.ts',
    match: /\$741,111/,
    why: 'Guard-test fixtures assert on a sample figure; the value is arbitrary test data, not a claim.',
  },
  {
    file: 'lib/data/voice-impact-data.json',
    match: /CANON CONTRADICTIONS:/,
    why: 'An analysis note listing where a source article contradicts canon. Quoting the wrong numbers is the point, and it renders only on the admin voice-impact page.',
  },
];

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    // .json is scanned too: qbe-areas.json carried "Accountant-signed" and "$741,111" for six weeks
    // after both were retired, because only .ts/.tsx was walked (found 2026-09-05).
    else if (/\.(ts|tsx|json)$/.test(entry) && !/\.test\.tsx?$/.test(entry)) out.push(p);
  }
  return out;
};

/** Dates ("9 July 2026") and versions are not counts. */
const isDateOrVersion = (line, value) =>
  new RegExp(`${value}\\s*(January|February|March|April|May|June|July|August|September|October|November|December)`, 'i').test(line) ||
  new RegExp(`v${value}\\b`).test(line);

const violations = [];

for (const file of walk(SRC)) {
  const rel = relative(V2, file).replace(/^src\//, '');
  const lines = readFileSync(file, 'utf8').split('\n');

  lines.forEach((line, idx) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // comments explain, they do not render

    for (const fig of RETIRED) {
      // The literal in a rendered position: quoted, in JSX text, or after a separator.
      const escaped = fig.value.replace(',', '[,]');
      // Prefix class includes $ because money figures are written "$475K", and the money entries
      // are the ones that actually reached a funder. Found by probing the guard with known-bad
      // lines rather than trusting it: without $, it silently missed both capex entries.
      if (!new RegExp(`(['"\`>·$]\\s*)${escaped}(?![0-9%])`).test(line)) continue;
      if (fig.context && !fig.context.test(line)) continue;
      if (isDateOrVersion(line, fig.value)) continue;
      if (ALLOWED.some((a) => rel.includes(a.file) && a.match.test(line))) continue;

      violations.push(
        `  ${rel}:${idx + 1}\n` +
          `    retired ${fig.what}: ${fig.value} -> ${fig.now}  (${fig.ruling})\n` +
          `    ${line.trim().slice(0, 110)}`,
      );
    }

    if (PHRASE_EXEMPT.some((e) => rel.includes(e.path))) return;

    for (const ph of RETIRED_PHRASES) {
      if (!ph.pattern.test(line)) continue;
      if (NEGATED.test(line)) continue;
      if (PATHWAY_QUALIFIED.test(line)) continue;
      if (/co-design/i.test(ph.what) && CODESIGN_AS_KEY.test(line)) continue;
      violations.push(
        `  ${rel}:${idx + 1}\n` +
          `    retired phrase, ${ph.what}  (${ph.ruling})\n` +
          `    use instead: ${ph.use}\n` +
          `    ${line.trim().slice(0, 110)}`,
      );
    }
  });
}

if (violations.length) {
  console.error(`\nRetired figures still rendering (${violations.length}):\n`);
  console.error(violations.join('\n\n'));
  console.error(
    '\nEach is a number canon has already moved past. Read it from CANONICAL_ASSETS\n' +
      '(src/lib/data/asset-canonical.ts) rather than retyping it. If the mention is\n' +
      'deliberately historical, add it to ALLOWED in this script with a reason.\n',
  );
  process.exit(1);
}

console.log(`OK — no retired figures or phrases in src/ (${RETIRED.length} figures, ${RETIRED_PHRASES.length} phrases guarded).`);
