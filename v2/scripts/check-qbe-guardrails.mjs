/**
 * Static drift guard for the QBE cost-model guardrails.
 *
 * These strings have caused external-copy drift before. This scan is deliberately
 * narrow and contextual: it blocks retired investor-facing numbers, while still
 * allowing clearly labelled legacy/provenance references.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const scanRoots = [path.join(projectRoot, 'src'), path.join(projectRoot, 'public')];

// The authority files and the investor wiki live OUTSIDE v2 and were never scanned by
// anything. That is how the retired QBE match mechanic survived in CONTEXT.md for eleven
// days after canon contradicted it. Added 2026-08-01, ruling V.
const repoRoot = path.resolve(projectRoot, '..');
const scanFiles = ['CONTEXT.md', 'STRATEGY.md', 'DECISIONS.md'].map((f) => path.join(repoRoot, f));
const extraRoots = [path.join(repoRoot, 'wiki', 'investor'), path.join(repoRoot, 'wiki', 'canon')];

// .html reaches v2/public/deck-slides/slides-source.html, which generates the PNGs and the
// PDF served at /pitch/simple. It is the most-distributed public artifact and was unscanned.
const SCANNED_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.md', '.mdx', '.json', '.svg', '.html']);

/**
 * Ruling V, 2026-08-01. The program is CATALYTIC, not matching. Its terms bind the GRANT
 * ("must be at least matched by SIGNED external commitments"), which is a coverage test on
 * whatever QBE decides to give, not a promise to double what we raise. And there is no
 * $150K floor: SIH states a typical range of $150K to $400K, from a pool of up to $1.1M
 * shared across ten enterprises. Full research: wiki/investor/20-qbe-program-economics.md.
 */
const RETIRED_MATCH_PATTERNS = [
  /dollar[- ]for[- ]dollar/i,
  /\$?150K?\s*floor/i,
  /\$150,000\s*floor/i,
  /doubles?\s+(?:every\s+)?signed\s+dollar/i,
  /QBE[^.\n]{0,40}\bdoubles?\b/i,
  /(?:lands|land)\s+twice/i,
  /stops?\s+being\s+doubled/i,
  /match\s+tops?\s+out/i,
  /\$800[,K]?0*\s*(?:program|K\b)/i,
];

// Files that quote the retired mechanic on purpose, to record what was retired and why.
// A line that explicitly marks the retirement is documentation, not a claim. Deliberately
// narrow: an uppercase marker or the ruling name, not any stray "not" or "no", so a sentence
// like "matches dollar for dollar, not a loan" still fails.
const RETIRED_MATCH_ALLOWED_CONTEXT = /ruling V|STRUCK|RETIRED|REPLACED|superseded/;

// These three record what was retired and why, so they must quote it. Everywhere else is a
// violation. Keep this list short: it is the only hole in the guard.
const RETIRED_MATCH_ALLOWED_FILES = [
  'wiki/investor/20-qbe-program-economics.md',
  'DECISIONS.md',
  'CONTEXT.md',
];

const BLOCKED_PATTERNS = [
  {
    reason: 'retired net/gross capital ask; use $112-222K gross OR ~$2-112K net',
    pattern: /\b(?:AU\$|\$)?90\s*[-–]\s*200K\b/i,
  },
  {
    reason: 'retired fully-loaded reference; use $1,780 at 100/yr with $685 marginal + $1,095 fixed',
    pattern: /\b(?:AU\$|\$)?1,?912\b/i,
  },
  {
    reason: 'retired fixed-block range; use ~$109,500',
    pattern: /\b(?:~?\s*(?:AU\$|\$))?110\s*[-–]\s*123K\b/i,
  },
  {
    reason: 'retired breakeven; use 338 factory / 1,679 Buy-Kit',
    pattern: /\bbreakeven\b[^.\n]{0,80}\b378\b|\b378\b[^.\n]{0,80}\bbreakeven\b/i,
  },
];

const SIX_HUNDRED_PATTERNS = [
  /\b(?:AU\$|\$)600\s*\/\s*bed\b/i,
  /\b(?:AU\$|\$)600\s+per\s+bed\b/i,
  /\b100\s+beds\s*@\s*(?:AU\$|\$)600\b/i,
];

const SIX_HUNDRED_ALLOWED_CONTEXT = /\b(?:legacy|planning anchor|old|excludes|not current|not cogs|orphan|discontinued|bridge)\b/i;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      yield* walk(fullPath);
    } else if (SCANNED_EXTENSIONS.has(path.extname(entry.name))) {
      yield fullPath;
    }
  }
}

function relative(filePath) {
  return path.relative(projectRoot, filePath).split(path.sep).join('/');
}

const violations = [];

// One file list, so scanFiles and extraRoots are actually consumed. Declaring roots without
// wiring them into the walk is how a guard reports clean while covering nothing.
const targets = [...scanFiles];
for (const root of [...scanRoots, ...extraRoots]) {
  try {
    for await (const filePath of walk(root)) targets.push(filePath);
  } catch {
    // a root that does not exist is not a failure; wiki/canon may be absent in a worktree
  }
}

{
  for (const filePath of targets) {
    const rel = relative(filePath);
    const text = await readFile(filePath, 'utf8');
    const lines = text.split(/\r?\n/);

    // The history files exist to quote retired figures and retired wording. Exempt them from
    // every pattern, not just the ruling V ones: adding DECISIONS.md to the scan immediately
    // tripped ruling P's own record of the figure IT retired.
    const isHistoryFile = RETIRED_MATCH_ALLOWED_FILES.some((allowed) => rel.endsWith(allowed));

    lines.forEach((line, index) => {
      for (const { pattern, reason } of BLOCKED_PATTERNS) {
        if (!isHistoryFile && pattern.test(line)) {
          violations.push({ file: rel, line: index + 1, reason, text: line.trim() });
        }
      }

      if (
        !isHistoryFile &&
        !RETIRED_MATCH_ALLOWED_CONTEXT.test(line) &&
        RETIRED_MATCH_PATTERNS.some((pattern) => pattern.test(line))
      ) {
        violations.push({
          file: rel,
          line: index + 1,
          reason: 'retired QBE match mechanic (ruling V): the grant is catalytic and discretionary, typically $150K-$400K from a shared pool. It is not dollar for dollar, there is no floor, and signing paper does not oblige QBE',
          text: line.trim(),
        });
      }

      if (SIX_HUNDRED_PATTERNS.some((pattern) => pattern.test(line)) && !SIX_HUNDRED_ALLOWED_CONTEXT.test(line)) {
        violations.push({
          file: rel,
          line: index + 1,
          reason: 'unbridged $600/bed copy; explain it excludes long-haul freight and fixed-block absorption',
          text: line.trim(),
        });
      }
    });
  }
}

if (violations.length > 0) {
  console.error('\nQBE cost-model guardrail drift detected.');
  for (const violation of violations) {
    console.error(`\n${violation.file}:${violation.line} (${violation.reason})`);
    console.error(`  ${violation.text}`);
  }
  process.exit(1);
}

console.log('OK - no QBE cost-model guardrail drift found.');
