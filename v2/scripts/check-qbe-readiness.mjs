/**
 * READ-ONLY QBE readiness loop (Loop D) for the Goods Alignment Engine.
 * Companion to check-canon-drift.mjs (Loop A, money), check-artifact-drift.mjs
 * (Loop B, citations) and check-asset-drift.mjs (assets). Run from v2/:
 *
 *   node scripts/check-qbe-readiness.mjs            (warn-only on coverage gaps)
 *   node scripts/check-qbe-readiness.mjs --strict   (also fail on coverage gaps)
 *
 * Layer 1 + the gap/readiness join. It reads the QBE diagnostic areas registry
 * (src/lib/data/qbe-areas.json — the 12 Catalysing Impact areas with V4 scores,
 * priority, keystone, blockers) and the artifact register
 * (src/lib/data/artifact-register.json — artifacts tagged with the qbeAreas they
 * cover) and answers: where is the evidence pack thin, and what should we build next?
 *
 *   1. AREA INTEGRITY: every qbeAreas id used by an artifact resolves to a real
 *      area in qbe-areas.json. A typo or a removed area is a hard fail (an artifact
 *      would otherwise claim to cover an area that does not exist).
 *   2. COVERAGE SCORECARD: per area — how many artifacts cover it, their statuses,
 *      claim-label + data-class mix, and the freshest lastVerified date.
 *   3. COVERAGE GAPS: P0 / keystone areas with zero artifacts, or whose evidence
 *      is all stale (freshest artifact older than STALE_DAYS), are the Loop D signal.
 *   4. BUILD QUEUE: a deterministic ranking of what to build next, weighting
 *      priority, the keystone, SIH priority-gap flag, maturity score gap, and how
 *      thin / stale the coverage is. Cross-referenced with the catalytic blockers.
 *
 * It changes nothing. The readiness report is written to wiki/canon/qbe-readiness.md.
 * Hard area-integrity breaks exit 1; coverage gaps warn (exit 1 under --strict).
 */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..'); // v2/
const dataDir = path.join(projectRoot, 'src', 'lib', 'data');
const canonDir = path.resolve(projectRoot, '..', 'wiki', 'canon');
const STRICT = process.argv.includes('--strict');
const STALE_DAYS = 45;
const today = new Date();

const daysSince = (iso) => Math.floor((today - new Date(iso)) / 86_400_000);

// ── Load registries ──
const { areas, catalyticBlockers, asOf } = JSON.parse(
  await readFile(path.join(dataDir, 'qbe-areas.json'), 'utf8'),
);
const { artifacts } = JSON.parse(
  await readFile(path.join(dataDir, 'artifact-register.json'), 'utf8'),
);
const areaById = new Map(areas.map((a) => [a.id, a]));

// ── Join artifacts onto areas + check integrity ──
const coverage = new Map(areas.map((a) => [a.id, []])); // areaId -> [artifact]
const brokenAreaRefs = []; // hard: an artifact cites an area id not in the registry
for (const art of artifacts) {
  for (const aid of art.qbeAreas || []) {
    if (!areaById.has(aid)) {
      brokenAreaRefs.push({ artifact: art.title, id: art.id, aid });
      continue;
    }
    coverage.get(aid).push(art);
  }
}

// ── Per-area readiness ──
const freshest = (arts) =>
  arts.length ? arts.reduce((m, a) => (a.lastVerified > m ? a.lastVerified : m), arts[0].lastVerified) : null;

const rows = areas.map((a) => {
  const arts = coverage.get(a.id);
  const fresh = freshest(arts);
  const ageDays = fresh ? daysSince(fresh) : null;
  const stale = arts.length > 0 && ageDays != null && ageDays > STALE_DAYS;
  const scoreGap = a.scoreNow != null && a.scoreTarget != null ? a.scoreTarget - a.scoreNow : null;
  const labels = [...new Set(arts.flatMap((x) => x.claimLabels || []))];
  const classes = [...new Set(arts.map((x) => x.dataClass).filter(Boolean))];
  // Thin coverage: a raise-gating area leaning on too little evidence.
  const thin = arts.length === 0 || (a.priority === 'P0' && arts.length < 2);
  const gapFlag = (a.priority === 'P0' || a.keystone) && (arts.length === 0 || stale);
  return { ...a, arts, fresh, ageDays, stale, scoreGap, labels, classes, thin, gapFlag };
});

// ── Deterministic build-queue ranking (higher = build sooner) ──
const blockerRankByArea = new Map();
for (const b of catalyticBlockers) for (const aid of b.areaIds) {
  if (!blockerRankByArea.has(aid) || b.rank < blockerRankByArea.get(aid)) blockerRankByArea.set(aid, b.rank);
}
const score = (r) => {
  let s = 0;
  if (r.priority === 'P0') s += 100;
  if (r.keystone) s += 50;
  if (r.sihPriorityGap) s += 20;
  // Notion-added areas (11/12) have no score; treat as a moderate gap so they don't sink.
  s += (r.scoreGap == null ? 3 : r.scoreGap) * 5;
  s += Math.max(0, 2 - r.arts.length) * 15; // 0 artifacts +30, 1 +15, 2+ +0
  if (r.stale) s += 10;
  if (blockerRankByArea.has(r.id)) s += (6 - blockerRankByArea.get(r.id)) * 8; // blocker #1 +40 .. #5 +8
  return s;
};
const queue = [...rows]
  .map((r) => ({ ...r, rank: score(r) }))
  .sort((x, y) => y.rank - x.rank || x.id.localeCompare(y.id));

const gaps = rows.filter((r) => r.gapFlag);

// ── Console ──
console.log(`Goods QBE readiness scan (Loop D)\n`);
console.log(`${areas.length} diagnostic areas, ${artifacts.length} artifacts, scores asOf ${asOf}.\n`);
console.log('Coverage (area -> artifacts):');
for (const r of rows) {
  const sc = r.scoreNow != null ? `${r.scoreNow}->${r.scoreTarget}` : '  -  ';
  const tag = r.keystone ? ' [KEYSTONE]' : r.gapFlag ? ' [GAP]' : '';
  console.log(`  ${r.id} ${r.priority} ${sc.padEnd(6)} ${String(r.arts.length).padStart(2)} artifact(s)  ${r.name}${tag}`);
}
console.log('');
if (gaps.length) {
  console.log('Coverage gaps (P0/keystone areas with no or stale evidence):');
  for (const g of gaps) console.log(`  ${g.id} ${g.name}: ${g.arts.length === 0 ? 'NO artifacts' : `stale (freshest ${g.ageDays}d > ${STALE_DAYS}d)`}`);
  console.log('');
}
console.log('Build queue (top 5):');
for (const q of queue.slice(0, 5)) console.log(`  ${q.id} ${q.name} (rank ${q.rank})`);
console.log('');

// ── Report file ──
const sc = (r) => (r.scoreNow != null ? `${r.scoreNow}→${r.scoreTarget}` : '—');
const md = [
  `# QBE readiness scorecard (Loop D)`,
  '',
  `Generated by scripts/check-qbe-readiness.mjs on ${today.toISOString().slice(0, 10)}. Read-only. Source of truth: src/lib/data/qbe-areas.json (scores asOf ${asOf}, from SIH/QBE Diagnostic V4) joined onto src/lib/data/artifact-register.json (artifacts tagged with the qbeAreas they cover). It changes nothing — it tells you where the evidence pack is thin and what to build next. To act: build/refresh the artifact, then add or bump its entry (and qbeAreas) in artifact-register.json.`,
  '',
  brokenAreaRefs.length ? '## Broken area references (fix first)' : '## Broken area references\nNone. Every qbeAreas id on an artifact resolves to a real diagnostic area.',
  ...brokenAreaRefs.map((b) => `- ${b.artifact} (${b.id}) cites unknown QBE area "${b.aid}"`),
  '',
  '## Scorecard',
  '',
  '| # | Area | V4 now→target | Priority | Artifacts | Freshest | Coverage |',
  '|---|---|---|---|---|---|---|',
  ...rows.map((r) => {
    const cov = r.arts.length === 0 ? '🔴 none' : r.stale ? `🟠 stale (${r.ageDays}d)` : r.thin ? '🟡 thin' : '🟢 ok';
    const name = r.keystone ? `**${r.name}** (keystone)` : r.name;
    const star = r.sihPriorityGap ? ' *' : '';
    return `| ${r.id} | ${name}${star} | ${sc(r)} | ${r.priority} | ${r.arts.length} | ${r.fresh || '—'} | ${cov} |`;
  }),
  '',
  '`*` = SIH priority gap. Coverage: 🟢 ok · 🟡 thin (P0 with <2 artifacts) · 🟠 stale (freshest >' + STALE_DAYS + 'd) · 🔴 none.',
  '',
  gaps.length ? '## Coverage gaps (P0 / keystone, build these)' : '## Coverage gaps\nNone. Every P0/keystone area has at least one current artifact.',
  ...gaps.map((g) => `- **${g.id} ${g.name}**${g.keystone ? ' (KEYSTONE)' : ''} — ${g.arts.length === 0 ? 'no artifacts cover this area' : `evidence is stale (freshest ${g.ageDays}d old)`}. Gap: ${g.gap}`),
  '',
  '## Build queue (ranked — build top-down)',
  '',
  'Deterministic ranking: P0 (+100), keystone (+50), SIH priority-gap (+20), maturity score-gap (×5), thin coverage (≤2 artifacts), staleness, and catalytic-blocker rank.',
  '',
  ...queue.map((q, i) => {
    const why = [];
    if (q.priority === 'P0') why.push('P0');
    if (q.keystone) why.push('keystone');
    if (q.sihPriorityGap) why.push('SIH priority gap');
    if (q.scoreGap != null) why.push(`score ${q.scoreNow}→${q.scoreTarget}`);
    why.push(`${q.arts.length} artifact${q.arts.length === 1 ? '' : 's'}`);
    if (q.stale) why.push(`stale ${q.ageDays}d`);
    if (blockerRankByArea.has(q.id)) why.push(`catalytic blocker #${blockerRankByArea.get(q.id)}`);
    return `${i + 1}. **${q.id} ${q.name}** — ${why.join(', ')}.\n   - ${q.gap}`;
  }),
  '',
  '## Coverage map (area → artifacts citing it)',
  '',
  ...rows.map((r) => `- **${r.id} ${r.name}**: ${r.arts.length ? r.arts.map((a) => a.title).join('; ') : '_none_'}`),
  '',
  '## Catalytic-raise blockers (from the alignment report §5)',
  '',
  ...catalyticBlockers.map((b) => `${b.rank}. (areas ${b.areaIds.join(', ')}) ${b.summary}`),
  '',
].join('\n');
await mkdir(canonDir, { recursive: true });
await writeFile(path.join(canonDir, 'qbe-readiness.md'), md);

// ── Exit ──
if (brokenAreaRefs.length) {
  console.error('BROKEN AREA REFERENCES — artifact-register.json cites QBE area ids that do not exist:');
  for (const b of brokenAreaRefs) console.error(`  - ${b.artifact} (${b.id}) -> "${b.aid}"`);
  console.error('\nFix the qbeAreas ids in src/lib/data/artifact-register.json to match qbe-areas.json.');
  process.exit(1);
}
if (gaps.length) {
  console.warn(`${gaps.length} P0/keystone area(s) have thin or stale evidence (see wiki/canon/qbe-readiness.md).`);
  if (STRICT) process.exit(1);
}
console.log(`OK — all area references resolve.${gaps.length ? ` ${gaps.length} coverage gap(s) queued.` : ' No coverage gaps.'}`);
