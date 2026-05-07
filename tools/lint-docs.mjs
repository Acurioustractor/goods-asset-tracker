#!/usr/bin/env node
// Run the brand-voice linter over markdown files in v2/docs/ and wiki/articles/.
// Reports violations grouped by file, sorted by count.
// Usage: node tools/lint-docs.mjs [--json] [--fix-em-dashes]

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// Inline copy of the rules so this script doesn't need a TS toolchain.
// Mirrors v2/src/lib/brand-lint.ts. Update in lockstep.
const RULES = [
  { id: 'em-dash', severity: 'error', pattern: /—|&mdash;/g, msg: () => 'Em dash banned. Use period, colon, or parentheses.' },
  { id: 'banned-donate', severity: 'error', pattern: /\b(donate|donation|donations|donating|charity|charitable)\b/gi, msg: m => `"${m}" frames as charity.` },
  { id: 'banned-beneficiary', severity: 'error', pattern: /\b(beneficiar(y|ies))\b/gi, msg: m => `"${m}" is paternalistic.` },
  { id: 'banned-empower', severity: 'error', pattern: /\b(empower(ed|ing|ment|s)?)\b/gi, msg: m => `"${m}" implies power was not there.` },
  { id: 'banned-unlock', severity: 'error', pattern: /\b(unlock(s|ed|ing)?)\b/gi, msg: m => `"${m}" buzzword.` },
  { id: 'banned-leverage', severity: 'error', pattern: /\b(leverag(e|es|ed|ing))\b/gi, msg: m => `"${m}" jargon.` },
  { id: 'banned-synergy', severity: 'error', pattern: /\b(synerg(y|ies|istic))\b/gi, msg: m => `"${m}" buzzword.` },
  { id: 'banned-ecosystem', severity: 'warning', pattern: /\becosystem\b/gi, msg: () => '"ecosystem" overused jargon.' },
  { id: 'banned-gtm', severity: 'error', pattern: /\b(GTM|go-to-market)\b/gi, msg: m => `"${m}" sales jargon.` },
  { id: 'banned-disrupting', severity: 'error', pattern: /\b(disrupt(ive|ing|or)?)\b/gi, msg: m => `"${m}" hype.` },
  { id: 'banned-innovative', severity: 'warning', pattern: /\binnovati(ve|on|ng)\b/gi, msg: m => `"${m}" hype.` },
  { id: 'banned-revolutionary', severity: 'error', pattern: /\brevolutionar(y|ies)\b/gi, msg: () => '"revolutionary" hype.' },
  { id: 'banned-game-changer', severity: 'error', pattern: /\bgame.?changer\b/gi, msg: () => '"game-changer" hype.' },
  { id: 'banned-best-in-class', severity: 'warning', pattern: /\bbest.?in.?class\b/gi, msg: () => '"best-in-class" hype.' },
  { id: 'helping-them', severity: 'error', pattern: /\b(helping|help) them\b/gi, msg: m => `"${m}" paternalistic.` },
  { id: 'capitalisation-on-country', severity: 'error', pattern: /\bon[- ]country\b/g, msg: m => `Capitalise: "${m.replace(/on([- ])country/, 'On$1Country')}".` },
  { id: 'capitalisation-first-nations', severity: 'error', pattern: /\bfirst nations\b/g, msg: () => 'Always capitalise First Nations.' },
  { id: 'indigenous-people-block', severity: 'warning', pattern: /\b(Indigenous|indigenous) people\b(?! of)/g, msg: () => '"Indigenous people" treats diverse population as a block.' },
  { id: 'outback-bush', severity: 'warning', pattern: /\b(the outback|the bush)\b/gi, msg: m => `"${m}" generic identifier.` },
  { id: 'remote-australia', severity: 'warning', pattern: /\bremote Australia\b/g, msg: () => '"remote Australia" generic.' },
];

function lint(input) {
  const violations = [];
  for (const rule of RULES) {
    rule.pattern.lastIndex = 0;
    let m;
    while ((m = rule.pattern.exec(input)) !== null) {
      violations.push({ ruleId: rule.id, severity: rule.severity, start: m.index, match: m[0], message: rule.msg(m[0]) });
      if (m[0].length === 0) rule.pattern.lastIndex++;
    }
  }
  violations.sort((a, b) => a.start - b.start);
  return violations;
}

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else if (entry.isFile() && p.endsWith('.md')) yield p;
  }
}

const TARGETS = [
  path.join(ROOT, 'v2/docs'),
  path.join(ROOT, 'wiki/articles'),
];

const SKIP_PATHS = [
  // Brand guide pages intentionally enumerate banned terms; that's not a violation.
  'wiki/articles/brand-comms/',
  // The voice-and-tone doc itself.
  'wiki/articles/INDEX.md',
];

const skipFile = (p) => SKIP_PATHS.some(s => p.includes(s));

const args = new Set(process.argv.slice(2));
const asJson = args.has('--json');
const doFix = args.has('--fix');
const fixEmOnly = args.has('--fix-em-dashes');

/**
 * Conservative em dash replacement for markdown.
 * - " — " surrounded by spaces → ". " (start of new clause) or ", " (continuation)
 * - "—" without surrounding spaces → "."
 * - HTML entity &mdash; → "."
 *
 * Heuristic: if the char after " — " is a lowercase letter, replace with ", " (continuation).
 * Otherwise replace with ". " (new sentence). Capitalises following letter to a period.
 */
function fixEmDashes(text) {
  let out = '';
  let i = 0;
  while (i < text.length) {
    if (text[i] === '—') {
      // Detect surrounding spaces
      const prev = out.slice(-1);
      const next = text[i + 1] ?? '';
      if (prev === ' ' && next === ' ') {
        // " — " — look at next non-space char
        const followIdx = i + 2;
        const follow = text[followIdx] ?? '';
        if (follow && /[A-Z0-9"'`]/.test(follow)) {
          // Next clause starts capitalised → period
          out = out.replace(/ $/, '');
          out += '.';
          i += 1; // skip em dash, keep the trailing space
        } else {
          // Lowercase continuation → comma
          out = out.replace(/ $/, '');
          out += ',';
          i += 1;
        }
      } else if (prev === ' ') {
        // " —X" - rare
        out = out.replace(/ $/, '');
        out += '.';
        i += 1;
      } else if (next === ' ') {
        // "X— " - rare
        out += '.';
        i += 1;
      } else {
        // "X—Y" no spaces
        out += '.';
        i += 1;
      }
    } else {
      out += text[i];
      i += 1;
    }
  }
  // Also normalise HTML entity
  out = out.replace(/&mdash;/g, '.');
  return out;
}

async function applyFixes(file, text) {
  let next = text;
  if (doFix || fixEmOnly) {
    next = fixEmDashes(next);
  }
  if (next === text) return false;
  await fs.writeFile(file, next, 'utf8');
  return true;
}

async function main() {
  const reports = [];
  // Optional path filter from argv (any non-flag arg is a path filter)
  const pathFilter = process.argv.slice(2).find(a => !a.startsWith('--'));
  let fixedCount = 0;

  for (const root of TARGETS) {
    try {
      for await (const file of walk(root)) {
        if (skipFile(file)) continue;
        if (pathFilter && !file.includes(pathFilter)) continue;
        const text = await fs.readFile(file, 'utf8');
        if (doFix || fixEmOnly) {
          const wasFixed = await applyFixes(file, text);
          if (wasFixed) fixedCount++;
        }
        const finalText = (doFix || fixEmOnly) ? await fs.readFile(file, 'utf8') : text;
        const violations = lint(finalText);
        if (violations.length === 0) continue;
        const errors = violations.filter(v => v.severity === 'error').length;
        const warnings = violations.filter(v => v.severity === 'warning').length;
        const ruleCounts = {};
        for (const v of violations) ruleCounts[v.ruleId] = (ruleCounts[v.ruleId] || 0) + 1;
        reports.push({
          file: path.relative(ROOT, file),
          total: violations.length,
          errors,
          warnings,
          ruleCounts,
        });
      }
    } catch (err) {
      console.error(`[lint-docs] skipping ${root}:`, err.message);
    }
  }
  if (doFix || fixEmOnly) {
    console.log(`Fixed em dashes in ${fixedCount} file${fixedCount === 1 ? '' : 's'}.\n`);
  }

  reports.sort((a, b) => b.errors - a.errors || b.total - a.total);

  if (asJson) {
    console.log(JSON.stringify(reports, null, 2));
    return;
  }

  let totalErrors = 0;
  let totalWarnings = 0;
  for (const r of reports) {
    totalErrors += r.errors;
    totalWarnings += r.warnings;
  }
  console.log(`Scanned ${reports.length} files with violations.`);
  console.log(`Total: ${totalErrors} errors, ${totalWarnings} warnings.\n`);
  console.log(`Top 30 by error count:`);
  console.log(``);
  console.log(`  errors  warns  file (top rules)`);
  console.log(`  ------  -----  ---------------------------------------------`);
  for (const r of reports.slice(0, 30)) {
    const topRules = Object.entries(r.ruleCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => `${k}:${v}`).join(' ');
    console.log(`  ${String(r.errors).padStart(6)}  ${String(r.warnings).padStart(5)}  ${r.file.padEnd(60)} ${topRules}`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
