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
  { value: '403,901', what: 'the "surplus"', now: 'never cited; the entity P&L is a net loss', context: /surplus|profit|revenue/i, ruling: 'DECISIONS.md ruling H' },
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
];

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(entry) && !/\.test\.tsx?$/.test(entry)) out.push(p);
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
