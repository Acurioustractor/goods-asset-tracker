/**
 * Static copy drift guard for the canonical community-count invariant.
 *
 * Public/funder surfaces must say 9 communities served, not 10. The live asset
 * register can contain 10 distinct community names when allocated/placeholder
 * rows are included; that is a different metric and should stay out of public
 * "served" copy.
 *
 * This intentionally scans source text rather than app output so it can run
 * quickly in CI without a server. Storyteller-reach copy such as
 * "15 storytellers across 6 communities" is allowed because it is a different
 * metric.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const srcRoot = path.join(projectRoot, 'src');

const SCANNED_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.md', '.mdx']);

const ALLOWED_FILES = new Set([
  // Canonical source of truth and model provenance may mention distinct=10.
  'src/lib/data/asset-canonical.ts',
  'src/lib/data/impact-model.ts',
]);

const DIRECT_TEN_COMMUNITIES = [
  /\b10\s+(?:remote\s+)?communit(?:y|ies)\b/i,
  /\bten\s+(?:remote\s+)?communit(?:y|ies)\b/i,
];

const VALUE_TEN = /\bvalue\s*:\s*['"`]?10['"`]?\b/i;
const JSX_TEN_VALUE = />\s*10\s*<|\{\s*10\s*\}/;
const COMMUNITY_LABEL = /\blabel\s*:\s*['"`][^'"`]*communit(?:y|ies)|communit(?:y|ies)\s+served/i;
const ALLOWED_CONTEXT = /storytellers?|distinct|allocated|placeholder|register names/i;

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

function context(lines, index, radius = 3) {
  return lines.slice(index, Math.min(lines.length, index + radius + 1)).join(' ');
}

const violations = [];

for await (const filePath of walk(srcRoot)) {
  const rel = relative(filePath);
  if (ALLOWED_FILES.has(rel)) continue;

  const text = await readFile(filePath, 'utf8');
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    if (ALLOWED_CONTEXT.test(line)) return;

    for (const pattern of DIRECT_TEN_COMMUNITIES) {
      if (pattern.test(line)) {
        violations.push({
          file: rel,
          line: index + 1,
          reason: 'literal "10 communities" copy',
          text: line.trim(),
        });
      }
    }

    if (VALUE_TEN.test(line) || JSX_TEN_VALUE.test(line)) {
      const windowText = context(lines, index);
      if (COMMUNITY_LABEL.test(windowText) && !ALLOWED_CONTEXT.test(windowText)) {
        violations.push({
          file: rel,
          line: index + 1,
          reason: '10-valued community metric',
          text: windowText.trim(),
        });
      }
    }
  });
}

if (violations.length > 0) {
  console.error('\nCommunity-count copy drift detected.');
  console.error('Public/funder copy must use 9 communities served. Use CANONICAL_ASSETS.communitiesServed.');
  for (const violation of violations) {
    console.error(`\n${violation.file}:${violation.line} (${violation.reason})`);
    console.error(`  ${violation.text}`);
  }
  process.exit(1);
}

console.log('OK - no public "10 communities served" copy drift found.');
