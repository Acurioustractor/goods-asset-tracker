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

const SCANNED_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.md', '.mdx', '.json', '.svg']);

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

for (const root of scanRoots) {
  for await (const filePath of walk(root)) {
    const rel = relative(filePath);
    const text = await readFile(filePath, 'utf8');
    const lines = text.split(/\r?\n/);

    lines.forEach((line, index) => {
      for (const { pattern, reason } of BLOCKED_PATTERNS) {
        if (pattern.test(line)) {
          violations.push({ file: rel, line: index + 1, reason, text: line.trim() });
        }
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
