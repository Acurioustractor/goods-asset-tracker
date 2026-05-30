#!/usr/bin/env node
/**
 * READ-ONLY drift guard for public community-count copy.
 *
 * Public and funder-facing copy must use the canonical deployed/active count:
 * 9 communities served. The live register also has 10 distinct communities
 * when allocated/placeholder locations are included, but that is not the
 * public "served" metric.
 *
 * This scans src/ for the old public-copy phrasing so "10 communities" does
 * not drift back into pages, shared funder content, metadata, or API copy.
 *
 *   node scripts/check-community-count-drift.mjs   (run from v2/)
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');

const TEXT_EXTENSIONS = new Set([
  '.css',
  '.js',
  '.jsx',
  '.json',
  '.md',
  '.mdx',
  '.mjs',
  '.ts',
  '.tsx',
]);

const BANNED_PATTERNS = [
  {
    label: '10 communities',
    pattern: /\b10\s+communities\b/i,
  },
  {
    label: '10 remote communit...',
    pattern: /\b10\s+remote\s+communit(?:y|ies)\b/i,
  },
];

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
      continue;
    }

    if (entry.isFile() && TEXT_EXTENSIONS.has(path.extname(entry.name))) {
      yield fullPath;
    }
  }
}

const violations = [];

for await (const filePath of walk(SRC_DIR)) {
  const source = await readFile(filePath, 'utf8');
  const lines = source.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const { label, pattern } of BANNED_PATTERNS) {
      if (pattern.test(line)) {
        violations.push({
          filePath: path.relative(ROOT_DIR, filePath),
          line: index + 1,
          label,
          text: line.trim(),
        });
      }
    }
  });
}

if (violations.length) {
  console.error('COMMUNITY COUNT DRIFT DETECTED');
  console.error('');
  console.error('Public/funder copy must use 9 communities served.');
  console.error('Do not reintroduce the old 10-communities public claim.');
  console.error('');

  for (const violation of violations) {
    console.error(`${violation.filePath}:${violation.line} (${violation.label})`);
    console.error(`  ${violation.text}`);
  }

  process.exit(1);
}

console.log('OK - no banned 10-communities public-copy drift found in src/.');
