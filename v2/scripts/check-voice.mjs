#!/usr/bin/env node
// Voice guard — the drift check prose never had.
//
// The 2026-07-25 strategy alignment session's own diagnosis was: "Prose has no
// drift check. That is the whole diagnosis." Figures are guarded by canon +
// check-canon-drift + check-retired-figures. The standing voice rules were
// guarded by nothing, so a banned word could sit on a live surface indefinitely.
// One was: `community-pathways.ts:236` carried "co-design", which has been
// banned since 2026-07-11.
//
// THE RULE THIS GUARD ENCODES: the banned list governs OUR voice. It does not
// govern other people's words. A storyteller's verbatim quote, a funder's own
// programme language and an organisation's registered name are all exempt, and
// editing them to satisfy a style guide would be a worse error than the
// violation. That is why EXEMPT_PATHS exists and why every entry carries a
// reason.
//
// TWO TIERS, on purpose:
//   FAIL  high-confidence bans with near-zero legitimate use in our own prose.
//   WARN  ambiguous words that also occur as ordinary English or in product
//         names, plus the em-dash rule, which has ~338 instances in src/ today
//         (mostly admin layout punctuation). Failing on those would mean either
//         a large unrequested cleanup or an instantly-muted guard. They are
//         reported with counts so Ben can promote them to FAIL deliberately.
//
// Scanned: public pages + the prose data layer. NOT admin or api, which are
// internal tooling rather than anything a funder or community member reads.
// Prose = a quoted string of four or more words, so identifiers, data keys and
// slugs (theme: 'co-design', which CLAUDE.md says is a pending migration) do
// not fire.
//
// Run: npm run check:voice   (from v2/)
// Exit 0 = clean (warnings do not fail). Exit 1 = a banned word in our voice.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const V2 = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(V2, 'src');

/** Directories that are internal tooling, not anything read outside the team. */
const SKIP_DIRS = [
  { path: 'src/app/admin', why: 'Internal operator UI. Voice rules govern what people outside the team read.' },
  { path: 'src/app/api', why: 'Route handlers. Any prose here is imported third-party data, not our copy.' },
];

/** Files whose strings are somebody else's words. Each needs a reason. */
const EXEMPT_PATHS = [
  { path: 'src/lib/data/storyteller-registry.ts', why: 'Verbatim storyteller quotes. Never edit a person\'s words to fit our style guide.' },
  { path: 'src/lib/data/curated-quotes.ts', why: 'Verbatim quotes.' },
  { path: 'src/lib/data/cleared-voices.ts', why: 'Consent-cleared named voices.' },
  { path: 'src/lib/data/trip-stories.ts', why: 'Field accounts carrying quoted speech.' },
  { path: 'src/lib/funders', why: 'Funder frameworks. Their principle names are their language, e.g. Snow\'s "First Nations leadership and empowerment", and must be quoted as written.' },
];

/**
 * term   what to match, case-insensitive
 * why    the reason it is banned, shown on failure
 * use    what to write instead
 */
const FAIL = [
  { term: /\bco-design(ed|ing)?\b/i, why: 'Implies a facilitated joint process. The truth is the design happens in community, led by community.', use: 'designed in community / designed with community (Ben, 2026-07-11)' },
  { term: /\bempower(s|ed|ing|ment)?\b/i, why: 'Positions us as the giver of power.', use: 'say what actually changes hands: who decides, who owns, who is paid' },
  { term: /\bbeneficiar(y|ies)\b/i, why: 'Casts community as recipients of charity.', use: 'name the people, or say partners / communities / customers' },
  { term: /\becosystem\b/i, why: 'Pitch-deck abstraction.', use: 'name the actual organisations and relationships' },
  { term: /\bscalable solution\b/i, why: 'Two pitch words in a row, and it says nothing.', use: 'say what scales and what does not' },
  { term: /\btransformational\b/i, why: 'Claims an outcome we do not measure.', use: 'state the change and its evidence, or say nothing' },
  { term: /\bgame[- ]chang(er|ing)\b/i, why: 'Pitch filler.', use: 'say what changed' },
];

const WARN = [
  { term: /\bunlock(s|ed|ing)?\b/i, note: 'Banned in pitch prose; also ordinary English in product/UI copy ("unlocks messages").' },
  { term: /\bjourney(s)?\b/i, note: 'Banned in pitch prose; also a product name ("Supporter Journey" pipeline, journeyStories).' },
  { term: /\bcatalytic\b/i, note: 'Allowed for the QBE programme name and when quoting a funder. Banned as our own framing.' },
  { term: /—/, note: 'Em dash. Zero in prose is the standing rule; ~338 in src/ today are mostly admin layout punctuation.' },
];

const walk = (dir, out = []) => {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) {
      if (entry === 'node_modules' || entry === '.next') continue;
      walk(p, out);
    } else if (/\.(ts|tsx)$/.test(entry) && !/\.test\.tsx?$/.test(entry)) out.push(p);
  }
  return out;
};

/** A quoted string of >=4 words: prose, not an identifier, key or slug. */
const STRING_LITERAL = /(['"`])((?:[^'"`\\]|\\.){20,}?)\1/g;
const isProse = (s) => (s.match(/ /g) || []).length >= 3 && !/^[a-z0-9_/-]+$/i.test(s);

const failures = [];
const warnings = new Map();

for (const file of walk(SRC)) {
  const rel = relative(V2, file).split('\\').join('/');
  if (SKIP_DIRS.some((d) => rel.startsWith(d.path))) continue;
  const exempt = EXEMPT_PATHS.some((e) => rel.startsWith(e.path));

  readFileSync(file, 'utf8').split('\n').forEach((line, idx) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return; // comments explain, they do not render
    if (/^\s*import\b/.test(line)) return;

    let m;
    STRING_LITERAL.lastIndex = 0;
    while ((m = STRING_LITERAL.exec(line))) {
      const text = m[2];
      if (!isProse(text)) continue;

      if (!exempt) {
        for (const rule of FAIL) {
          if (rule.term.test(text)) {
            failures.push({ rel, line: idx + 1, rule, text: text.slice(0, 120) });
          }
        }
      }
      for (const rule of WARN) {
        if (rule.term.test(text)) {
          const key = rule.term.source;
          if (!warnings.has(key)) warnings.set(key, { rule, hits: [] });
          warnings.get(key).hits.push(`${rel}:${idx + 1}`);
        }
      }
    }
  });
}

if (warnings.size) {
  console.log('\nVoice warnings (not failing):');
  for (const { rule, hits } of warnings.values()) {
    console.log(`  ${String(rule.term).padEnd(28)} ${String(hits.length).padStart(4)}  ${rule.note}`);
    hits.slice(0, 3).forEach((h) => console.log(`        ${h}`));
    if (hits.length > 3) console.log(`        ...and ${hits.length - 3} more`);
  }
  console.log('  Promote any of these to FAIL in scripts/check-voice.mjs once the back-catalogue is cleared.');
}

if (failures.length) {
  console.error(`\nBanned words in our own prose (${failures.length}):\n`);
  for (const f of failures) {
    console.error(`  ${f.rel}:${f.line}`);
    console.error(`    ${f.text}`);
    console.error(`    why: ${f.rule.why}`);
    console.error(`    use: ${f.rule.use}\n`);
  }
  console.error(
    'These govern OUR voice only. If the string is a verbatim quote, a funder\'s own\n' +
      'programme language or a registered name, add its file to EXEMPT_PATHS with a reason\n' +
      'rather than rewording somebody else\'s words.\n',
  );
  process.exit(1);
}

console.log('OK — no banned words in our own public prose.');
