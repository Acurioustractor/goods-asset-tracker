/**
 * Static copy drift guard for the canonical community-count invariant.
 *
 * Public/funder surfaces must use CANONICAL_ASSETS.communitiesServed. The live
 * asset register holds more distinct community names when allocated/placeholder
 * rows are included; that is `distinctCommunities`, a different metric, and it
 * should stay out of public "served" copy.
 *
 * FIXED 2026-07-25. This guard used to hardcode "must say 9, not 10". Canon had
 * moved to 11 twice over, so the guard was enforcing a two-generations-stale
 * invariant: it would not have caught the press page's badged "9 Communities"
 * (a real defect found by hand on 2026-07-25), and it would have flagged the
 * correct current number if anyone had written 10 as a distinct count.
 *
 * A guard that hardcodes the value it guards will always rot. The retired
 * counts are now DERIVED: anything below the canon value is stale by definition,
 * so this cannot go stale again when canon next moves.
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

// Read canon rather than restating it, so this guard tracks the move.
const canonSource = await readFile(path.join(srcRoot, 'lib/data/asset-canonical.ts'), 'utf8');
const readCanon = (key) => {
  const m = canonSource.match(new RegExp(`${key}:\\s*(\\d+)`));
  if (!m) throw new Error(`check-community-copy: could not read ${key} from asset-canonical.ts`);
  return Number(m[1]);
};
const SERVED = readCanon('communitiesServed');
const DISTINCT = readCanon('distinctCommunities');

// A stale canon count is almost always the immediately preceding generation, so
// guard the two below canon (9 and 10 while canon is 11) rather than everything
// below it. Flagging "two communities" in a case study is how a guard gets muted.
// Derived, so this advances by itself the next time canon moves.
const WORDS = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
const STALE = [SERVED - 1, SERVED - 2].filter((n) => n > 0);

const SCANNED_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.md', '.mdx']);

const ALLOWED_FILES = new Set([
  // Canonical source of truth and model provenance may mention the distinct count.
  'src/lib/data/asset-canonical.ts',
  'src/lib/data/impact-model.ts',
]);

/**
 * Lines that legitimately carry a superseded count. Each needs a reason: this
 * list is the difference between a guard people keep and one they mute.
 */
const ALLOWED_LINES = [
  {
    file: 'src/lib/data/claims-ledger.ts',
    match: /Asset facts reconciled against the live register/,
    why: 'A dated ledger note recording what was reconciled on 2026-05-30. Quoting the superseded numbers is the entire point of the entry.',
  },
  {
    file: 'src/lib/data/pitch-control-room.ts',
    match: /16-nine-communities/,
    why: 'An illustration asset filename on disk, plus its title. FLAGGED: the underlying illustration is itself stale and needs regenerating at the canon count; renaming is a separate asset pass, not a copy fix.',
  },
];

const DIRECT_STALE_COMMUNITIES = STALE.flatMap((n) => [
  new RegExp(`\\b${n}\\s+(?:remote\\s+)?communit(?:y|ies)\\b`, 'i'),
  new RegExp(`\\b${WORDS[n]}\\s+(?:remote\\s+)?communit(?:y|ies)\\b`, 'i'),
]);

const VALUE_STALE = new RegExp(`\\bvalue\\s*:\\s*['"\`]?(?:${STALE.join('|')})['"\`]?\\b`, 'i');
const JSX_STALE_VALUE = new RegExp(`>\\s*(?:${STALE.join('|')})\\s*<|\\{\\s*(?:${STALE.join('|')})\\s*\\}`);
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
    // Comments explain drift, they do not render it.
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
    if (ALLOWED_LINES.some((a) => rel === a.file && a.match.test(line))) return;

    for (const pattern of DIRECT_STALE_COMMUNITIES) {
      if (pattern.test(line)) {
        violations.push({
          file: rel,
          line: index + 1,
          reason: `stale community count in copy (canon is ${SERVED})`,
          text: line.trim(),
        });
      }
    }

    if (VALUE_STALE.test(line) || JSX_STALE_VALUE.test(line)) {
      const windowText = context(lines, index);
      if (COMMUNITY_LABEL.test(windowText) && !ALLOWED_CONTEXT.test(windowText)) {
        violations.push({
          file: rel,
          line: index + 1,
          reason: `stale-valued community metric (canon is ${SERVED})`,
          text: windowText.trim(),
        });
      }
    }
  });
}

if (violations.length > 0) {
  console.error('\nCommunity-count copy drift detected.');
  console.error(
    `Public/funder copy must use ${SERVED} communities served ` +
      `(read CANONICAL_ASSETS.communitiesServed, do not retype it). ` +
      `${DISTINCT} is distinctCommunities, a different metric.`,
  );
  for (const violation of violations) {
    console.error(`\n${violation.file}:${violation.line} (${violation.reason})`);
    console.error(`  ${violation.text}`);
  }
  process.exit(1);
}

console.log(`OK - no stale community-count copy found (canon: ${SERVED} served, ${DISTINCT} distinct).`);
