/**
 * READ-ONLY drift guard for the canonical deployed-asset figures.
 *
 * Recomputes the SAME rollup logic as getCanonicalAssetRollup() in
 * src/lib/data/impact-fetcher.ts (status='deployed', sum `quantity`,
 * Stretch/Basket split, plastic = Stretch beds × 20kg) against the LIVE
 * `assets` register, then compares to the values frozen in
 * src/lib/data/asset-canonical.ts (CANONICAL_ASSETS). Exits non-zero and
 * prints every drifted field if the static constants no longer match live.
 *
 * This is the guard that keeps the hardcoded public/funder numbers honest.
 * If it fails: either the register changed (update asset-canonical.ts +
 * every surface) or a bad write landed in the register (investigate first).
 *
 *   node --env-file=.env.local scripts/check-asset-drift.mjs   (run from v2/)
 *
 * NEVER use the Supabase MCP for v2 data — it points at the wrong project.
 * Uses NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env.local.
 */
import { createClient } from '@supabase/supabase-js';

// Mirror of CANONICAL_ASSETS in src/lib/data/asset-canonical.ts. The .ts file
// is the single source of truth; this is the guard's expected snapshot. Keep
// the two in lockstep — that lockstep is exactly what this script enforces.
// NOTE: washing machines are deliberately NOT part of the hard drift check, but
// they are NOT silently ignored either. washersInCommunity = 22 is Ben's ruling
// of 2026-07-21 (Maningrida 8, Tennant Creek 9, Palm Island 4, Alice Springs 1,
// Darwin 0), superseding the old curated 20. The register still returns 32
// `deployed` washer units because 10 rows are stale and should be `retired`:
// Tennant Creek 7, Alice Springs 2, Darwin 1. Until that restatus lands, this
// script reports the gap explicitly (see the washer block below) instead of
// either hard-failing on a known bookkeeping lag or passing in silence.
const WASHERS_IN_COMMUNITY = 22;
const WASHER_KNOWN_STALE_DEPLOYED_ROWS = 10; // TC 7 + Alice 2 + Darwin 1
const CANONICAL_ASSETS = {
  bedsDeployed: 540,
  stretchBedsDeployed: 177,
  basketBedsDeployed: 363,
  communitiesServed: 11,
  plasticKg: 3540,
};
const PLASTIC_KG_PER_BED = 20;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/['"]/g, '');
const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/['"]/g, '');
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (run with --env-file=.env.local).');
  process.exit(2);
}
// Wrong-project guard. The Supabase MCP/credentials can reach 9 projects in the
// org; canon must only ever be validated against the "Goods" project. If the env
// points anywhere else (e.g. bhwyqqbovcjoefezgfnq = ACT Farmhand), refuse to run.
// See wiki/canon/SOURCES.md.
const GOODS_PROJECT_REF = 'cwsyhpiuepvdjtxaozwf';
if (!url.includes(GOODS_PROJECT_REF)) {
  console.error(`Wrong-project guard: SUPABASE_URL is ${url}, not the Goods project (${GOODS_PROJECT_REF}).`);
  console.error('Canon is only valid against the Goods register. Refusing to run. See wiki/canon/SOURCES.md.');
  process.exit(2);
}
const supabase = createClient(url, key);

// Pull all rows (paginate), then reduce in JS exactly like impact-fetcher.ts.
const rows = [];
for (let from = 0; ; from += 1000) {
  const { data, error } = await supabase
    .from('assets')
    .select('product, status, quantity, community')
    .range(from, from + 999);
  if (error) { console.error('fetch error:', error.message); process.exit(2); }
  rows.push(...data);
  if (data.length < 1000) break;
}

const qty = (r) => r.quantity ?? 1;
const sum = (arr) => arr.reduce((s, r) => s + qty(r), 0);
const isBed = (p) => /bed/i.test(p ?? '');
const isStretch = (p) => /stretch/i.test(p ?? '');
const isWasher = (p) => /washing|washer/i.test(p ?? '');

const deployed = rows.filter((r) => r.status === 'deployed');
const deployedBeds = deployed.filter((r) => isBed(r.product));
const bedsDeployed = sum(deployedBeds);
const stretchBedsDeployed = sum(deployedBeds.filter((r) => isStretch(r.product)));
const basketBedsDeployed = bedsDeployed - stretchBedsDeployed;
const washersDeployed = sum(deployed.filter((r) => isWasher(r.product)));

const communityCounts = deployed.reduce((acc, r) => {
  const c = r.community || 'Unknown';
  acc[c] = (acc[c] || 0) + qty(r);
  return acc;
}, {});
const communitiesServed = Object.keys(communityCounts).filter(
  (c) => c !== 'Unknown' && c !== 'Pending Delivery',
).length;

const plasticKg = stretchBedsDeployed * PLASTIC_KG_PER_BED;

const live = {
  bedsDeployed,
  stretchBedsDeployed,
  basketBedsDeployed,
  washersDeployed,
  communitiesServed,
  plasticKg,
};

console.log(`Live assets register (${url}):`);
console.log(`  deployed rows: ${deployed.length}  deployed units: ${sum(deployed)}`);
for (const [k, v] of Object.entries(live)) console.log(`  ${k.padEnd(20)} ${v}`);

// Washing machines: report the known gap loudly, never silently.
const washerGap = washersDeployed - WASHERS_IN_COMMUNITY;
console.log('\nWashing machines (curated, not hard drift-checked):');
console.log(`  in community (canon)      ${WASHERS_IN_COMMUNITY}   (Ben ruling 2026-07-21: Maningrida 8, Tennant Creek 9, Palm Island 4, Alice Springs 1, Darwin 0)`);
console.log(`  register 'deployed' units ${washersDeployed}`);
if (washerGap === WASHER_KNOWN_STALE_DEPLOYED_ROWS) {
  console.log(`  KNOWN GAP ${washerGap}: the stale deployed rows awaiting restatus to 'retired' (Tennant Creek 7, Alice Springs 2, Darwin 1).`);
  console.log('  Expected. Clear it by restatusing those rows, then make washers a hard-checked field.');
} else {
  console.log(`  UNEXPECTED GAP ${washerGap} (expected ${WASHER_KNOWN_STALE_DEPLOYED_ROWS}).`);
  console.log('  Either the restatus happened (move washers into the hard check and set canon from live)');
  console.log('  or a washer row changed. Investigate before trusting the public figure.');
}

const drift = [];
for (const [k, expected] of Object.entries(CANONICAL_ASSETS)) {
  if (live[k] !== expected) drift.push({ field: k, expected, live: live[k] });
}

if (drift.length) {
  console.error('\nDRIFT DETECTED — CANONICAL_ASSETS no longer matches the live register:');
  for (const d of drift) {
    console.error(`  ${d.field}: canonical=${d.expected}  live=${d.live}  (Δ ${d.live - d.expected})`);
  }
  console.error('\nFix: reconcile src/lib/data/asset-canonical.ts (and every surface) to live,');
  console.error('or investigate whether a bad write landed in the assets register.');
  process.exit(1);
}

console.log('\nOK — all canonical asset figures match the live register.');
