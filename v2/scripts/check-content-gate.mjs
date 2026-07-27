#!/usr/bin/env node
/**
 * The unified content gate: CONSENT → CLAIMS → VOICE, one chain, every
 * finding citing the rule it violates.
 *
 * Before this, a public draft passed through three separate disciplines held
 * in three separate places: the cleared-voices registry (consent), canon +
 * retired figures (claims), and the banned-word list (voice). Each existed,
 * none ran together, and nothing required a draft to pass all three before
 * publishing. This gate is that requirement.
 *
 * NO RULE IS DEFINED IN THIS FILE. Every list is parsed from its existing
 * source of truth, so there is no second copy to drift:
 *   consent  ← src/lib/data/cleared-voices.ts        (default-deny name list)
 *   claims   ← src/lib/data/asset-canonical.ts       (canon totals)
 *            ← scripts/check-retired-figures.mjs     (RETIRED list, with rulings)
 *   voice    ← scripts/check-voice.mjs               (FAIL list, with why/use)
 *
 * Verbatim quoted speech ("...") is exempt from VOICE — the banned list
 * governs OUR voice, never a storyteller's words (check-voice.mjs rule).
 * Nothing exempts a draft from CONSENT.
 *
 * Usage (from v2/):
 *   node scripts/check-content-gate.mjs <draft.md> [...]      gate specific drafts
 *   node scripts/check-content-gate.mjs                       gate ../wiki/outputs/ledger/*.md
 *   node scripts/check-content-gate.mjs --report [files]      also write the JSON snapshot
 *                                                             rendered on /admin/consent
 * Exit 0 = every draft passed all three stages. Exit 1 = findings.
 */
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname, basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const V2 = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REPO = resolve(V2, '..');
const REPORT_PATH = join(V2, 'src/lib/data/content-gate-report.json');

// ── Rule sources (parsed, never mirrored) ────────────────────────────────────

function loadClearedVoices() {
  const src = readFileSync(join(V2, 'src/lib/data/cleared-voices.ts'), 'utf8');
  const body = src.match(/CLEARED_VOICES_EXTERNAL[^=]*=\s*\[([\s\S]*?)\]/)?.[1];
  if (!body) throw new Error('cannot parse CLEARED_VOICES_EXTERNAL');
  return [...body.matchAll(/'([^']+)'/g)].map((m) => m[1]);
}
const normaliseName = (name) =>
  (name ?? '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[.,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function loadCanonValues() {
  const src = readFileSync(join(V2, 'src/lib/data/asset-canonical.ts'), 'utf8');
  const m = src.match(/CANONICAL_ASSETS\s*=\s*\{([^}]*)\}/s);
  const canon = {};
  if (m) for (const [, k, v] of m[1].matchAll(/(\w+):\s*([\d_]+)/g)) canon[k] = Number(v.replace(/_/g, ''));
  // Per-community ruled counts are also legitimate in copy (Tennant Creek really
  // does have 160 beds), so admit them from community-canonical.ts.
  const cc = readFileSync(join(V2, 'src/lib/data/community-canonical.ts'), 'utf8');
  const perCommunity = [...cc.matchAll(/(?:basketBeds|stretchBeds):\s*(\d+)/g)].map((m2) => Number(m2[1]));
  const totals = [...cc.matchAll(/basketBeds:\s*(\d+),\s*\n\s*stretchBeds:\s*(\d+)/g)].map(
    (m2) => Number(m2[1]) + Number(m2[2]),
  );
  const washers = readFileSync(join(V2, 'src/lib/data/asset-canonical.ts'), 'utf8');
  const washerCounts = [...washers.matchAll(/'?[a-z-]+'?:\s*(\d+)/g)].map((m2) => Number(m2[1]));
  // Product-spec numbers allowed in copy (same allow-list as check-story-draft.mjs).
  const allowExtra = [26, 200, 188, 92, 25, 5, 10, 20, 40, 2026, 2027];
  return { canon, allowed: new Set([...Object.values(canon), ...perCommunity, ...totals, ...washerCounts, ...allowExtra]) };
}

function loadRetired() {
  const src = readFileSync(join(V2, 'scripts/check-retired-figures.mjs'), 'utf8');
  const body = src.match(/const RETIRED = \[([\s\S]*?)\n\];/)?.[1];
  if (!body) throw new Error('cannot parse RETIRED from check-retired-figures.mjs');
  const out = [];
  for (const m of body.matchAll(
    /\{ value: '([^']+)', what: '([^']+)', now: '([^']+)', context: \/(.+?)\/(\w*), ruling: '([^']+)' \}/g,
  )) {
    out.push({ value: m[1], what: m[2], now: m[3], context: new RegExp(m[4], m[5]), ruling: m[6] });
  }
  if (!out.length) throw new Error('RETIRED parse produced nothing');
  return out;
}

function loadVoiceRules() {
  const src = readFileSync(join(V2, 'scripts/check-voice.mjs'), 'utf8');
  const body = src.match(/const FAIL = \[([\s\S]*?)\n\];/)?.[1];
  if (!body) throw new Error('cannot parse FAIL from check-voice.mjs');
  const out = [];
  for (const m of body.matchAll(/\{ term: \/(.+?)\/(\w*), why: '((?:[^'\\]|\\.)*)', use: '((?:[^'\\]|\\.)*)' \}/g)) {
    out.push({ term: new RegExp(m[1], m[2]), why: m[3].replace(/\\'/g, "'"), use: m[4].replace(/\\'/g, "'") });
  }
  if (!out.length) throw new Error('FAIL parse produced nothing');
  return out;
}

const CLEARED = new Set(loadClearedVoices().map(normaliseName));
const { canon, allowed: ALLOWED_NUMBERS } = loadCanonValues();
const RETIRED = loadRetired();
const VOICE = loadVoiceRules();

// ── The three stages ─────────────────────────────────────────────────────────

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  const fm = {};
  if (m) for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w[\w_]*):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].trim();
  }
  return { fm, body: m ? text.slice(m[0].length) : text };
}

/** Strip verbatim quoted speech: those are other people's words, exempt from
 *  VOICE and CLAIMS-as-our-claim (but a quote's speaker still needs consent). */
function stripQuotedSpeech(line) {
  return line.replace(/"[^"]*"/g, '""').replace(/[""][^""]*[""]/g, '""');
}

function gateConsent(fm, body, findings) {
  const rule = 'cleared-voices.ts: DEFAULT-DENY — a voice appears externally only if its name is on the cleared list';
  if (!fm.storyteller) {
    findings.push({ stage: 'consent', line: 0, finding: 'no `storyteller:` in frontmatter', rule });
  } else {
    for (const name of fm.storyteller.split(/,|&| and /).map((s) => s.trim()).filter(Boolean)) {
      if (!CLEARED.has(normaliseName(name))) {
        findings.push({ stage: 'consent', line: 0, finding: `storyteller '${name}' is NOT on the cleared-voices list`, rule });
      }
    }
  }
  if (!fm.consent_source) {
    findings.push({
      stage: 'consent', line: 0,
      finding: 'no `consent_source:` in frontmatter — every draft must record where its clearance comes from',
      rule: 'ledger-story skill: drafts carry consent provenance; /CONTEXT.md consent gate',
    });
  }
  // Attributed quotes must be cleared too: a dash-name line counts as an
  // attribution only when it sits next to quoted speech (same or previous
  // line), so list bullets like "- The Maningrida film ..." don't fire.
  const lines = body.split('\n');
  lines.forEach((line, i) => {
    const attr = line.match(/^\s*[-–]\s*((?!The |A |An |Our |This )[A-Z][a-z]+(?: [A-Z][a-z]+)+)\s*[,.]?/);
    if (!attr) return;
    const nearQuote = /["""]/.test(line) || /["""]/.test(lines[i - 1] ?? '');
    if (nearQuote && !CLEARED.has(normaliseName(attr[1]))) {
      findings.push({ stage: 'consent', line: i + 1, finding: `quote attributed to '${attr[1]}', not on the cleared-voices list`, rule });
    }
  });
}

function gateClaims(body, findings) {
  const nounRe = /([\d][\d,]*)\s*\+?\s*(?:x\s*)?(beds?|washing machines?|washers?|communities|kg)\b/gi;
  body.split('\n').forEach((raw, i) => {
    const line = stripQuotedSpeech(raw);
    for (const fig of RETIRED) {
      const escaped = fig.value.replace(',', '[,]');
      if (new RegExp(`\\b${escaped}(?![0-9%])`).test(line) && fig.context.test(line)) {
        findings.push({
          stage: 'claims', line: i + 1,
          finding: `retired ${fig.what}: ${fig.value} (canon is now ${fig.now})`,
          rule: `check-retired-figures.mjs — ${fig.ruling}`,
        });
      }
    }
    for (const [, num, noun] of line.matchAll(nounRe)) {
      const n = Number(num.replace(/,/g, ''));
      if (!ALLOWED_NUMBERS.has(n)) {
        findings.push({
          stage: 'claims', line: i + 1,
          finding: `"${num} ${noun}" is not a canon total or ruled per-community count`,
          rule: `asset-canonical.ts / community-canonical.ts — every public count derives from canon (headline: ${canon.bedsDeployed} beds / ${canon.stretchBedsDeployed} Stretch / ${canon.washersInCommunity} washers / ${canon.communitiesServed} communities). Verified per-event counts are fine; verify, then note the source.`,
        });
      }
    }
  });
}

function gateVoice(body, findings) {
  body.split('\n').forEach((raw, i) => {
    const line = stripQuotedSpeech(raw);
    if (line.includes('—')) {
      findings.push({ stage: 'voice', line: i + 1, finding: 'em dash', rule: 'brand rule: no em dashes, anywhere (feedback-no-em-dashes)' });
    }
    for (const rule of VOICE) {
      if (rule.term.test(line)) {
        findings.push({
          stage: 'voice', line: i + 1,
          finding: `banned term ${rule.term}`,
          rule: `check-voice.mjs — ${rule.why} Use: ${rule.use}`,
        });
      }
    }
  });
}

// ── Drive ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const writeReport = args.includes('--report');
let files = args.filter((a) => a !== '--report');
if (!files.length) {
  const dir = join(REPO, 'wiki/outputs/ledger');
  files = existsSync(dir)
    ? readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => join(dir, f))
    : [];
  if (!files.length) {
    console.log('No drafts found in wiki/outputs/ledger/ and none given. Nothing to gate.');
    process.exit(0);
  }
}

const results = [];
let failed = false;
for (const file of files) {
  const text = readFileSync(resolve(file), 'utf8');
  const { fm, body } = parseFrontmatter(text);
  const findings = [];
  gateConsent(fm, body, findings);
  gateClaims(body, findings);
  gateVoice(body, findings);
  const pass = findings.length === 0;
  if (!pass) failed = true;
  results.push({ file: basename(file), storyteller: fm.storyteller ?? null, status: fm.status ?? null, pass, findings });

  console.log(`${pass ? 'PASS' : 'FAIL'} ${basename(file)}${fm.storyteller ? `  (${fm.storyteller})` : ''}`);
  for (const f of findings) {
    console.log(`  [${f.stage.toUpperCase()}] line ${f.line}: ${f.finding}`);
    console.log(`      RULE: ${f.rule}`);
  }
}

const summary = {
  gated: results.length,
  passed: results.filter((r) => r.pass).length,
  stages: ['consent', 'claims', 'voice'],
  results,
};
if (writeReport) {
  writeFileSync(REPORT_PATH, JSON.stringify({ generatedNote: 'run npm run check:content-gate -- --report to refresh', ...summary }, null, 2) + '\n');
  console.log(`\nreport written to ${REPORT_PATH}`);
}

console.log(`\n${summary.passed}/${summary.gated} drafts pass all three stages (consent → claims → voice).`);
if (failed) {
  console.error('\nFix the draft OR the rule, never the gate: a wrong name needs clearing or removing,');
  console.error('a wrong number needs its source, a banned term needs rewording in OUR voice only.');
  process.exit(1);
}
