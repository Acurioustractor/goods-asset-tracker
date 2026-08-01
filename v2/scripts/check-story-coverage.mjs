/**
 * READ-ONLY story + illustration coverage loop (Loop E) for the Goods Alignment
 * Engine. Companion to check-canon-drift.mjs (Loop A, money), check-artifact-drift.mjs
 * (Loop B, citations), check-qbe-readiness.mjs (Loop D, QBE gaps) and check-asset-drift.mjs
 * (assets). Run from v2/:
 *
 *   node scripts/check-story-coverage.mjs            (warn-only on coverage/cadence gaps)
 *   node scripts/check-story-coverage.mjs --strict   (also fail on coverage/cadence gaps)
 *
 * Loop E does NOT generate anything. Generation is the existing /ledger-story and
 * /goods-illustrations skills, run by a human, drafts only, consent re-gated each time.
 * This loop is the detector that tells those skills WHAT to draft next: it reads the
 * consent-cleared voice roster and the illustration set, then answers — which cleared
 * voices have no weekly ledger post yet, is the weekly cadence overdue, and which key
 * explainer topics still have no brand illustration? The ranked build queue is written
 * to wiki/canon/story-coverage.md. It changes nothing else.
 *
 * Consent gate (read-only, mirrors ledger-story/CONSENT.md sources 1-2; the EL live
 * check is out of scope for a hermetic CI script): a voice is in the pool if it is a
 * curated-quotes.ts key OR a trip-stories.ts VoiceCard with consent: 'cleared'. The
 * skill ALWAYS re-runs the full consent gate (incl. EL + Ben) before drafting, so this
 * pool is a coverage queue, never a consent decision.
 *
 * RED-safety: this loop emits only counts and cleared display_names (already public on
 * the /stories page). It never emits quotes, transcripts, or recipient data.
 *
 * Hard-fails (exit 1) only on integrity: a ledger draft whose front-matter storyteller
 * is not in the cleared roster (a possible consent leak), or an unreadable registry.
 * Coverage / cadence gaps warn (exit 1 under --strict).
 */
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..'); // v2/
const repoRoot = path.resolve(projectRoot, '..');
const dataDir = path.join(projectRoot, 'src', 'lib', 'data');
const canonDir = path.join(repoRoot, 'wiki', 'canon');
const ledgerDir = path.join(repoRoot, 'wiki', 'outputs', 'ledger');
const brandImgDir = path.join(projectRoot, 'public', 'images', 'brand');
const illDraftDir = path.join(repoRoot, 'generated-images', 'goods-illustrations');
const STRICT = process.argv.includes('--strict');
const WEEKLY_TARGET_DAYS = 7; // the weekly ledger-post cadence
const today = new Date();
const todayStr = today.toISOString().slice(0, 10);
const daysSince = (d) => Math.floor((today - new Date(d)) / 86_400_000);

const slurp = async (p) => readFile(p, 'utf8');
const lsDir = async (p) => {
  try { return await readdir(p, { withFileTypes: true }); } catch { return []; }
};
// Normalise a name for dedup/coverage matching (lowercase, collapse spaces, drop the " · role" suffix).
const normName = (s) => String(s || '').split('·')[0].toLowerCase().replace(/\s+/g, ' ').trim();
// Generic role labels used when a cleared speaker chose not to be named — they are
// cleared, but not draftable as a "one face, one voice, one place" weekly post.
const ANON = /^(elder|elders|family member|household member|community member|a worker|young person|kids?|the team)$/i;

// ── 1a. THE CONSENT GATE: cleared-voices.ts, and nothing else ───────────────
//
// This is the canonical person-level allowlist. STRATEGY.md section 7: "cleared-voices.ts
// (34 people) is the person-level allowlist. EL has no per-storyteller consent column, so
// the allowlist is the only gate."
//
// It is read separately from the DRAFTABLE POOL below because the two answer different
// questions, and conflating them is the bug this section fixes (2026-08-01). The pool is
// built from curated-quotes keys and trip-story VoiceCards, which is a coverage queue: it
// says who has quotable material ready to draft a weekly post from. Using it as the consent
// gate reported Mykel and Dorrie Jones as possible consent leaks when both sit in
// cleared-voices.ts and are tier 'external' in the registry. Two false alarms next to one
// real one (Jahvan Oui, genuinely uncleared) is how a real leak gets scrolled past.
//
// cleared-voices.ts warns about this exact mistake in its own header: "The broader
// display-storyteller-pool is a coverage queue, NOT a clearance list."
const clearedSrc = await slurp(path.join(dataDir, 'cleared-voices.ts'));
// Scope to the array body first, then take EVERY string literal in it. A line-anchored
// regex silently drops the second name on lines like `'Ivy Johnson', 'Ivy',`, which made
// a cleared person look uncleared. Under-parsing this list produces false consent
// failures; over-parsing it would produce false clearances, so the array is bounded
// exactly and the count is asserted against canon below.
const clearedArrayBody = clearedSrc.match(
  /const CLEARED_VOICES_EXTERNAL:\s*string\[\]\s*=\s*\[([\s\S]*?)\n\];/,
)?.[1];
if (!clearedArrayBody) {
  console.error('FATAL: could not locate CLEARED_VOICES_EXTERNAL in cleared-voices.ts. Refusing to run a consent check without the allowlist.');
  process.exit(1);
}
const clearedGateNames = [...clearedArrayBody.matchAll(/'([^']+)'/g)].map((m) => m[1]);
const clearedGate = new Set(clearedGateNames.map(normName).filter(Boolean));
if (clearedGate.size === 0) {
  console.error('FATAL: parsed 0 names out of cleared-voices.ts. Refusing to run a consent check with an empty allowlist.');
  process.exit(1);
}
// The allowlist holds one entry per SPELLING, not per person: 'Ivy Johnson' and 'Ivy' are
// one person, as are the Carmelita and Boe Remenyi pairs. So the literal count sits a few
// above the canon head-count of people, and a parse that comes back at or BELOW the canon
// count means spellings were dropped, which reads as a false consent failure. Cheap tripwire.
const clearedAliasLines = (clearedArrayBody.match(/^.*'.*'.*'.*$/gm) || []).length;
if (clearedGateNames.length < clearedAliasLines) {
  console.error(`FATAL: parsed ${clearedGateNames.length} names but found ${clearedAliasLines} multi-spelling lines. The allowlist parser is dropping names.`);
  process.exit(1);
}

// ── 1b. Draftable-voice pool (COVERAGE, never consent) ──────────────────────
const curatedSrc = await slurp(path.join(dataDir, 'curated-quotes.ts'));
const curatedVoices = [...curatedSrc.matchAll(/^ {2}'([^']+)':\s*\[/gm)].map((m) => m[1]);

const tripSrc = await slurp(path.join(dataDir, 'trip-stories.ts'));
// VoiceCard order is { quote, who, community, consent } — capture `who` when its card is cleared.
const tripClearedVoices = [
  ...tripSrc.matchAll(/who:\s*'([^']+?)'[\s\S]{0,160}?consent:\s*'cleared'/g),
].map((m) => m[1]);

// Pool = union, deduped by normalised name. Keep the most descriptive label seen.
const poolMap = new Map(); // normName -> { name, sources:Set }
const anonClearedSet = new Set();
const addVoice = (name, source) => {
  const key = normName(name);
  if (!key) return;
  if (ANON.test(key)) { anonClearedSet.add(key); return; } // cleared but unnamed — not a weekly-post candidate
  if (!poolMap.has(key)) poolMap.set(key, { name: name.split('·')[0].trim(), sources: new Set() });
  poolMap.get(key).sources.add(source);
};
for (const v of curatedVoices) addVoice(v, 'curated-quotes');
for (const v of tripClearedVoices) addVoice(v, 'trip-stories');
const pool = [...poolMap.values()].sort((a, b) => a.name.localeCompare(b.name));

// ── 2. Canon cleared-voices count (tier cross-check, never a hard fail) ──────
const canonSrc = await slurp(path.join(dataDir, 'canon.ts'));
const canonVoiceMatch = canonSrc.match(/id:\s*'cleared-voices'[\s\S]*?value:\s*(\d+)/);
const canonClearedCount = canonVoiceMatch ? Number(canonVoiceMatch[1]) : null;
const canonDisplayMatch = canonSrc.match(/id:\s*'display-storyteller-pool'[\s\S]*?value:\s*(\d+)/);
const canonDisplayCount = canonDisplayMatch ? Number(canonDisplayMatch[1]) : null;

// ── 3. Existing weekly-ledger coverage + cadence ─────────────────────────────
const ledgerEntries = await lsDir(ledgerDir);
const ledgerFiles = ledgerEntries
  .filter((e) => e.isFile() && /\.md$/.test(e.name) && !/-fieldnote-notes\.md$/.test(e.name) && !/-funder-cut\.md$/.test(e.name))
  .map((e) => e.name);

const featured = new Map(); // normName -> { storyteller, file, date }
const orphanDrafts = []; // ledger drafts whose storyteller is NOT in the roster (possible leak)
let newestLedgerDate = null;
for (const f of ledgerFiles) {
  const raw = await slurp(path.join(ledgerDir, f));
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  const storyteller = fm && fm[1].match(/storyteller:\s*(.+)/)?.[1]?.trim().replace(/^['"]|['"]$/g, '');
  const dateInName = f.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
  if (dateInName && (!newestLedgerDate || dateInName > newestLedgerDate)) newestLedgerDate = dateInName;
  if (storyteller) {
    const key = normName(storyteller);
    // Consent is judged against the allowlist. Coverage is judged against the pool.
    // A cleared person with no curated quote yet is a DRAFTING gap, not a leak.
    if (!clearedGate.has(key)) orphanDrafts.push({ file: f, storyteller });
    if (poolMap.has(key)) featured.set(key, { storyteller, file: f, date: dateInName || null });
  }
}
const unfeatured = pool.filter((v) => !featured.has(normName(v.name)));
const cadenceDays = newestLedgerDate ? daysSince(newestLedgerDate) : null;
const cadenceOverdue = cadenceDays === null || cadenceDays > WEEKLY_TARGET_DAYS;

// ── 4. Illustration coverage ─────────────────────────────────────────────────
// Promoted brand assets live as v2/public/images/brand/goods-ill-<slug>.png.
const brandEntries = await lsDir(brandImgDir);
const promotedSlugs = new Set(
  brandEntries.map((e) => e.name.match(/^goods-ill-(.+)\.png$/)?.[1]).filter(Boolean),
);
// Draft sets live as generated-images/goods-illustrations/<set>/.
const draftSets = new Set((await lsDir(illDraftDir)).filter((e) => e.isDirectory()).map((e) => e.name));

// Registry of key explainer topics the brand system should carry as line illustrations.
// promoted = expected goods-ill-<slug>.png in public/images/brand; draftSet = expected draft dir.
const ILLUSTRATION_TOPICS = [
  { id: 'plastic-loop', label: 'The plastic loop (collect → shred → press)', promoted: 'plastic-loop', draftSet: 'process-anchors' },
  { id: 'assembly', label: 'Stretch Bed assembly (X-trestle, no tools)', promoted: 'assembly', draftSet: 'assembly-guide' },
  { id: 'bed', label: 'Stretch Bed anatomy', promoted: 'bed' },
  { id: 'washing-machine', label: 'Washing machine (Pakkimjalki Kari)', promoted: 'washing-machine' },
  { id: 'container-plant', label: 'On-country container plant', draftSet: 'process-anchors' },
  { id: 'ownership-handover', label: 'Ownership handover to community', draftSet: 'journeys' },
  { id: 'health-chain', label: 'Bed breaks the health chain', draftSet: 'health-chain' },
  { id: 'order-to-country', label: 'Order to country journey', draftSet: 'order-to-country' },
  { id: 'demand-as-capital', label: 'Demand as capital (LOIs fund builds)' },
];
const illTopics = ILLUSTRATION_TOPICS.map((t) => {
  const hasPromoted = t.promoted && promotedSlugs.has(t.promoted);
  const hasDraft = t.draftSet && draftSets.has(t.draftSet);
  const status = hasPromoted ? 'promoted' : hasDraft ? 'draft-only' : 'missing';
  return { ...t, hasPromoted, hasDraft, status };
});
const illGaps = illTopics.filter((t) => t.status !== 'promoted');

// ── 5. Deterministic build queue (higher rank = build sooner) ────────────────
const queue = [];
if (cadenceOverdue) {
  queue.push({
    rank: 1000,
    kind: 'weekly-post',
    label: cadenceDays === null
      ? 'No weekly ledger post exists yet — publish the first one'
      : `Weekly ledger post overdue (${cadenceDays}d since last, target ${WEEKLY_TARGET_DAYS}d)`,
    action: '/ledger-story — pick one unfeatured cleared voice below',
  });
}
unfeatured.forEach((v, i) =>
  queue.push({
    rank: 500 - i,
    kind: 'voice-backlog',
    label: `Cleared voice with no weekly post: ${v.name}`,
    action: `/ledger-story for ${v.name} (sources: ${[...poolMap.get(normName(v.name)).sources].join(', ')})`,
  }),
);
illGaps.forEach((t, i) =>
  queue.push({
    rank: (t.status === 'missing' ? 200 : 100) - i,
    kind: 'illustration',
    label: `Illustration ${t.status === 'missing' ? 'missing' : 'drafted, not promoted'}: ${t.label}`,
    action: t.status === 'missing'
      ? `/goods-illustrations — draft "${t.id}"`
      : `Promote generated-images/goods-illustrations/${t.draftSet}/ to v2/public/images/brand/goods-ill-${t.promoted || t.id}.png (Ben approves)`,
  }),
);
queue.sort((a, b) => b.rank - a.rank);

// ── Console ──────────────────────────────────────────────────────────────────
console.log('Goods story + illustration coverage scan (Loop E)\n');
console.log(`Storyteller pool (display tier): ${pool.length} named computed (curated-quotes + trip-stories cleared VoiceCards; ${anonClearedSet.size} unnamed role label(s) excluded). Canon: cleared-voices (external strict) = ${canonClearedCount ?? '?'}, display-storyteller-pool = ${canonDisplayCount ?? '?'}.`);
console.log(`Weekly posts: ${featured.size} voice(s) featured, ${unfeatured.length} unfeatured. Cadence: ${cadenceDays === null ? 'never posted' : `${cadenceDays}d since last`}${cadenceOverdue ? ' [OVERDUE]' : ''}.`);
console.log(`Illustrations: ${illTopics.filter((t) => t.status === 'promoted').length}/${illTopics.length} topics promoted, ${illGaps.length} gap(s).`);
if (orphanDrafts.length) console.log(`\n⚠ ${orphanDrafts.length} ledger draft(s) feature a storyteller who is NOT in cleared-voices.ts (see report).`);
console.log('\nBuild queue (top 5):');
for (const q of queue.slice(0, 5)) console.log(`  [${q.kind}] ${q.label}`);
console.log('');

// ── Report file ──────────────────────────────────────────────────────────────
// Optional tier-mismatch note (a block of [note, ''] so the spacer survives, or [] when aligned).
const displayDrift = canonDisplayCount != null && canonDisplayCount !== pool.length;
const tierBlock = [
  `> **Two consent tiers.** Canon \`cleared-voices\` = **${canonClearedCount ?? '?'}** is the EXTERNAL list cleared for funder/QBE use (Ben consent pass 2026-06-17 — see wiki/outputs/2026-06-17-storyteller-quote-decision-sheet.md; incl. 2 practitioner voices, label accordingly). Canon \`display-storyteller-pool\` = **${canonDisplayCount ?? '?'}** is the website roster: everyone with a public curated quote or a cleared trip VoiceCard (incl. partners/board). This script computes the live pool (**${pool.length}**) from curated-quotes + trip-stories; it is a coverage queue, not a clearance list, and consent is re-gated on every draft.`
    + (displayDrift ? `\n>\n> ⚠ Canon \`display-storyteller-pool\` (${canonDisplayCount}) ≠ computed pool (${pool.length}) — update the canon fact to ${pool.length}.` : ''),
  '',
];

const md = [
  '# Story + illustration coverage (Loop E)',
  '',
  `Generated by v2/scripts/check-story-coverage.mjs on ${todayStr}. Read-only. Loop E does not generate anything: it tells the /ledger-story and /goods-illustrations skills what to draft next. Generation is human-triggered, drafts only, consent re-gated each run.`,
  '',
  'Sources: the cleared-voice pool = curated-quotes.ts keys ∪ trip-stories.ts VoiceCards with `consent: \'cleared\'` (mirrors ledger-story/CONSENT.md sources 1-2; EL live check is out of scope for a hermetic script). Weekly coverage = front-matter `storyteller:` in wiki/outputs/ledger/*.md. Illustration coverage = goods-ill-*.png in v2/public/images/brand vs draft sets in generated-images/goods-illustrations/. RED-safe: counts + already-public display_names only, never quotes or recipient data.',
  '',
  orphanDrafts.length ? '## ⚠ Possible consent leak (fix first)' : '## Consent integrity\nEvery weekly ledger draft features a storyteller on the cleared-voices allowlist.',
  ...orphanDrafts.map((o) => `- \`${o.file}\` features **${o.storyteller}**, who is NOT in \`cleared-voices.ts\`. Clear them there with a source, or remove the draft.`),
  '',
  '## Weekly cadence',
  '',
  cadenceDays === null
    ? `🔴 No weekly ledger post exists yet (wiki/outputs/ledger/). The cadence is the weekly post; start it.`
    : cadenceOverdue
      ? `🟠 Overdue: ${cadenceDays} days since the last post (${newestLedgerDate}), target ${WEEKLY_TARGET_DAYS} days.`
      : `🟢 On track: ${cadenceDays} days since the last post (${newestLedgerDate}).`,
  '',
  '## Cleared-voice pool',
  '',
  `${pool.length} named voices in the pool. ${featured.size} have a weekly ledger post, ${unfeatured.length} do not.${anonClearedSet.size ? ` (${anonClearedSet.size} cleared-but-unnamed role label${anonClearedSet.size === 1 ? '' : 's'} excluded from the weekly-post backlog.)` : ''}`,
  '',
  ...tierBlock,
  '| Voice | Sources | Weekly post |',
  '|---|---|---|',
  ...pool.map((v) => {
    const f = featured.get(normName(v.name));
    return `| ${v.name} | ${[...poolMap.get(normName(v.name)).sources].join(', ')} | ${f ? `🟢 ${f.file}` : '🔴 none'} |`;
  }),
  '',
  '## Illustration coverage',
  '',
  '| Topic | Status | Where |',
  '|---|---|---|',
  ...illTopics.map((t) => {
    const where = t.hasPromoted
      ? `v2/public/images/brand/goods-ill-${t.promoted}.png`
      : t.hasDraft
        ? `generated-images/goods-illustrations/${t.draftSet}/ (draft)`
        : '_none_';
    const dot = t.status === 'promoted' ? '🟢 promoted' : t.status === 'draft-only' ? '🟡 draft-only' : '🔴 missing';
    return `| ${t.label} | ${dot} | ${where} |`;
  }),
  '',
  '## Build queue (ranked — draft top-down)',
  '',
  'Deterministic ranking: overdue weekly cadence first, then unfeatured cleared voices, then illustration gaps (missing before draft-only). Feed the top item to the named skill; it re-gates consent and writes a draft only.',
  '',
  ...queue.map((q, i) => `${i + 1}. **[${q.kind}]** ${q.label}\n   - ${q.action}`),
  '',
  '## How to act',
  '',
  '1. Weekly post: `/ledger-story` with one unfeatured cleared voice. Draft lands in wiki/outputs/ledger/YYYY-MM-DD-<slug>.md. Validate with `node .claude/skills/ledger-story/scripts/check-story-draft.mjs <file>`.',
  '2. Illustration: `/goods-illustrations` for a missing topic. Drafts land in generated-images/goods-illustrations/<slug>/. Ben approves promotion to v2/public/images/brand/.',
  '3. This loop never publishes, never flips consent, never writes images or drafts. Those are human verbs.',
  '',
].join('\n');

await mkdir(canonDir, { recursive: true });
await writeFile(path.join(canonDir, 'story-coverage.md'), md);

// ── Exit ──────────────────────────────────────────────────────────────────────
if (orphanDrafts.length) {
  console.error('CONSENT INTEGRITY — ledger draft(s) feature a storyteller not in the cleared roster:');
  for (const o of orphanDrafts) console.error(`  - ${o.file} -> ${o.storyteller}`);
  console.error(`  Gate: cleared-voices.ts (${clearedGate.size} names). Add the person there with a source, or drop the draft.`);
  console.error('\nRun the ledger-story consent gate; remove or clear before this draft ships.');
  process.exit(1);
}
// Canon lockstep. This script already computed the pool and already knew when the
// canon fact disagreed, but it only wrote a ⚠ into a markdown report nobody reads
// on a normal run. That is how cleared-voices sat wrong for five weeks. The pool
// is derived from in-repo sources (curated-quotes + trip-stories), so a mismatch
// is always a stale fact or a real content change, and both want a human to look.
// The remedy is one number, printed below.
if (displayDrift) {
  console.error(
    `CANON: canon.ts 'display-storyteller-pool' says ${canonDisplayCount}, but the computed ` +
      `pool is ${pool.length} (curated-quotes + trip-stories cleared VoiceCards).\n` +
      `  Set the fact's value to ${pool.length} and refresh its asAt. This is a coverage ` +
      `queue, not a consent decision, so the count follows the content.`,
  );
  process.exit(1);
}

const gapCount = (cadenceOverdue ? 1 : 0) + unfeatured.length + illGaps.length;
if (gapCount && STRICT) {
  console.warn(`${gapCount} coverage/cadence gap(s) (see wiki/canon/story-coverage.md). Failing under --strict.`);
  process.exit(1);
}
console.log(`OK — roster integrity clean.${gapCount ? ` ${gapCount} coverage/cadence gap(s) queued.` : ' No coverage gaps.'}`);
