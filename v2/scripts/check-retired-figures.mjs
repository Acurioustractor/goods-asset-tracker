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
];

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
      if (!new RegExp(`(['"\`>·]\\s*)${escaped}(?![0-9%])`).test(line)) continue;
      if (fig.context && !fig.context.test(line)) continue;
      if (isDateOrVersion(line, fig.value)) continue;
      if (ALLOWED.some((a) => rel.includes(a.file) && a.match.test(line))) continue;

      violations.push(
        `  ${rel}:${idx + 1}\n` +
          `    retired ${fig.what}: ${fig.value} -> ${fig.now}  (${fig.ruling})\n` +
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

console.log('OK — no retired canon figures found in src/.');
