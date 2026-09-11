#!/usr/bin/env node
/**
 * Stop wiki articles reading as current once the figures underneath them have moved.
 *
 * Ben, 12 September 2026: build the wiki so it is the gold standard, ready to be reviewed and
 * versioned as things change. The second half of that sentence is the hard part. Nine articles in
 * this wiki still said QBE money was match-funded months after ruling V retired it, and nothing
 * anywhere could tell you that. An article has no test, so it rots quietly and then gets quoted.
 *
 * So an article that carries a settled figure has to declare which figure, by canon key, in its
 * frontmatter. This reads the canon the modules produce and checks the article still prints the
 * value that key holds today. When a module moves, the articles that depended on it fail by name.
 *
 *   node tools/check-wiki-canon.mjs                 check every article under wiki/articles
 *   node tools/check-wiki-canon.mjs <file> [...]    check named files
 *   node tools/check-wiki-canon.mjs --keys          print the canon keys available to cite
 *   node tools/check-wiki-canon.mjs --unversioned   list articles with no frontmatter yet
 *
 * Frontmatter this reads:
 *
 *   ---
 *   reviewed: 2026-09-12          when a human last read it against the sources
 *   ruling: Ben, 12 Sep 2026 ...  the ruling that governs it, if one does
 *   canon: [year.needs, year.gap] the settled figures it prints
 *   sources: [v2/src/lib/data/the-year-and-the-raise.ts]
 *   ---
 *
 * Canon comes from deliverables/qbe-stage2/sheet-canon.json, which is written from
 * v2/src/lib/data/sheet-canon.ts by its guard test. Regenerate with
 * `npx vitest run src/lib/data/sheet-canon` in v2, never by hand.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const CANON_PATH = join(ROOT, 'deliverables', 'qbe-stage2', 'sheet-canon.json');
const WIKI = join(ROOT, 'wiki', 'articles');

/** How stale a `reviewed:` date may be before it is called out. Thirty days. */
const STALE_DAYS = 30;

function canon() {
  if (!existsSync(CANON_PATH)) {
    console.error(`No canon at ${relative(ROOT, CANON_PATH)}. Run the sheet-canon guard test in v2 first.`);
    process.exit(2);
  }
  const cells = JSON.parse(readFileSync(CANON_PATH, 'utf8')).cells;
  const byKey = new Map();
  for (const c of cells) byKey.set(c.key, c);
  return byKey;
}

/**
 * Every way a person might reasonably print this value in prose.
 * A figure of 747950 is written "$747,950" or "747,950" or "747950", and a funder-facing page
 * may round 8.56 to 8.6. Accept all of those and fail only when none appears.
 */
function spellings(value, unit) {
  if (typeof value !== 'number') return [String(value)];
  const out = new Set();
  const plain = String(value);
  out.add(plain);
  out.add(value.toLocaleString('en-AU'));
  if (Number.isInteger(value)) {
    out.add('$' + value.toLocaleString('en-AU'));
    out.add('$' + plain);
    // 150000 is routinely written $150K in funder prose.
    if (value >= 1000 && value % 1000 === 0) {
      out.add('$' + value / 1000 + 'K');
      out.add('$' + value / 1000 + 'k');
    }
  } else {
    out.add(value.toFixed(1));
    out.add(value.toFixed(2));
  }
  if (unit === 'percent') {
    out.add(Math.round(value * 100) + '%');
    out.add(plain + '%');
  }
  return [...out];
}

function parseFrontmatter(text) {
  if (!text.startsWith('---')) return null;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return null;
  const block = text.slice(3, end);
  const fm = {};
  for (const line of block.split('\n')) {
    const m = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (!m) continue;
    const [, key, rawValue] = m;
    const v = rawValue.trim();
    if (v.startsWith('[') && v.endsWith(']')) {
      fm[key] = v
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);
    } else {
      fm[key] = v.replace(/^['"]|['"]$/g, '');
    }
  }
  fm.__body = text.slice(end + 4);
  return fm;
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (extname(p) === '.md') out.push(p);
  }
  return out;
}

function daysBetween(a, b) {
  return Math.round((b - a) / 86400000);
}

function main() {
  const args = process.argv.slice(2);
  const keys = canon();

  if (args.includes('--keys')) {
    for (const [k, c] of keys) {
      console.log(String(k).padEnd(34), String(c.value).padStart(12), ' ', c.label);
    }
    return;
  }

  const listUnversioned = args.includes('--unversioned');
  const named = args.filter((a) => !a.startsWith('--'));
  const files = named.length ? named.map((f) => (f.startsWith('/') ? f : join(ROOT, f))) : walk(WIKI);

  let errors = 0;
  let warnings = 0;
  const unversioned = [];
  const needVersioning = [];
  const strict = args.includes('--strict');

  // Staleness is measured against the newest article in the corpus, not against the clock. That
  // keeps the check reproducible: it fails when the wiki has moved on without an article, which is
  // the real failure, rather than failing everything overnight because time passed.
  const asOfArg = args.find((a) => a.startsWith('--as-of='));
  let newest = asOfArg ? new Date(asOfArg.slice('--as-of='.length)) : null;
  if (!newest) {
    for (const file of files) {
      if (!existsSync(file)) continue;
      const fm = parseFrontmatter(readFileSync(file, 'utf8'));
      if (!fm?.reviewed) continue;
      const d = new Date(fm.reviewed);
      if (!newest || d > newest) newest = d;
    }
  }

  for (const file of files) {
    if (!existsSync(file)) {
      console.log(`MISSING  ${relative(ROOT, file)}`);
      errors++;
      continue;
    }
    const rel = relative(ROOT, file);
    const text = readFileSync(file, 'utf8');
    const fm = parseFrontmatter(text);

    if (!fm) {
      unversioned.push(rel);
      continue;
    }

    if (!fm.reviewed) {
      // An article predating rule 12. It cites no canon keys, so it cannot drift against a module:
      // what it carries is a claim nobody has checked since the September rulings. That is a backlog
      // to work through, not a broken build, so it is named and counted and does not fail the gate.
      // `--strict` makes it fail, for when the backlog is cleared and the rule should bite.
      needVersioning.push(rel);
    } else if (newest) {
      const age = daysBetween(new Date(fm.reviewed), newest);
      if (age > STALE_DAYS) {
        console.log(`WARN     ${rel}\n         last reviewed ${fm.reviewed}, ${age} days behind the newest article in the wiki`);
        warnings++;
      }
    }

    for (const key of fm.canon || []) {
      const cell = keys.get(key);
      if (!cell) {
        console.log(`ERROR    ${rel}\n         cites canon key "${key}", which does not exist`);
        errors++;
        continue;
      }
      const wanted = spellings(cell.value, cell.unit);
      if (!wanted.some((s) => fm.__body.includes(s))) {
        console.log(
          `ERROR    ${rel}\n         cites ${key} but does not print its current value ${cell.value} (${cell.label})`,
        );
        errors++;
      }
    }
  }

  if (needVersioning.length) {
    console.log(`\n${needVersioning.length} article(s) predating rule 12, awaiting a review against the September rulings:`);
    for (const f of needVersioning) console.log(`  ${f}`);
  }

  if (listUnversioned || unversioned.length) {
    console.log(`\n${unversioned.length} article(s) with no frontmatter yet:`);
    for (const f of unversioned) console.log(`  ${f}`);
  }

  const checked = files.length - unversioned.length - needVersioning.length;
  console.log(
    `\n${checked} versioned article(s) checked, ${errors} error(s), ${warnings} warning(s), ` +
      `${needVersioning.length} awaiting review.`,
  );
  if (errors || (strict && needVersioning.length)) process.exit(1);
}

main();
