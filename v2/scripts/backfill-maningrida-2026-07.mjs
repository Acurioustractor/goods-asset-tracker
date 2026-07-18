/**
 * Maningrida July 2026 delivery — register backfill (STAGED, human-gated).
 *
 * Ben's update (2026-07-18): 60 Stretch Beds and 2 washing machines delivered
 * to Maningrida Homelands in partnership with Homeland School Company, made at
 * the farm production facility. (An internal note from 16 July said +40; the
 * 18 July figure of +60 supersedes it — reconcile against the delivery ledger.)
 *
 * DRY-RUN by default: prints what it would insert and the resulting rollup.
 * Apply with:   node --env-file=.env.local scripts/backfill-maningrida-2026-07.mjs --apply
 *
 * After a successful --apply, complete the canon sweep:
 *   1. asset-canonical.ts  -> bedsDeployed 556, stretchBedsDeployed 193,
 *      plasticKg 3860, washersInCommunity 18 (curated, Ben-confirmed)
 *   2. scripts/check-asset-drift.mjs snapshot -> same values
 *   3. canon.ts washers-in-community definition (16 -> 18) + asAt stamps
 *   4. node scripts/check-asset-drift.mjs must exit OK
 *
 * Idempotent: refuses to run if any GB0-157-* or GB0-WM-MANI-* rows exist.
 * NEVER use the Supabase MCP for this — Goods project only (guard below).
 */
import { createClient } from '@supabase/supabase-js';

const APPLY = process.argv.includes('--apply');
const BEDS = 60;
const WASHERS = 2;
const BATCH = 'GB0-157';
const SUPPLY_DATE = '2026-07-18T00:00:00+00:00'; // Ben-reported date; exact delivery date TBC
const NOTES =
  'Maningrida Homelands delivery with Homeland School Company; made at the farm production facility. ' +
  'Supply date approximate (Ben-reported 2026-07-18); count 60 supersedes the 16 Jul internal +40 note — reconcile against delivery ledger.';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/['"]/g, '');
const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/['"]/g, '');
if (!url || !key) {
  console.error('Missing env (run with --env-file=.env.local from v2/).');
  process.exit(2);
}
if (!url.includes('cwsyhpiuepvdjtxaozwf')) {
  console.error(`Wrong-project guard: ${url} is not the Goods project. Refusing.`);
  process.exit(2);
}
const supabase = createClient(url, key);

const { data: existing, error: exErr } = await supabase
  .from('assets')
  .select('unique_id')
  .or(`unique_id.like.${BATCH}-%,unique_id.like.GB0-WM-MANI-%`);
if (exErr) { console.error('precheck failed:', exErr.message); process.exit(2); }
if (existing.length) {
  console.error(`Refusing: ${existing.length} ${BATCH}/GB0-WM-MANI rows already exist (already applied?).`);
  process.exit(1);
}

const bedRow = (n) => ({
  unique_id: `${BATCH}-${n}`, id: `${BATCH}-${n}`, name: 'Maningrida',
  product: 'Stretch Bed', community: 'Maningrida', community_id: 'maningrida',
  place: 'Maningrida, NT 0822, Australia', partner_name: 'Homeland School Company',
  status: 'deployed', quantity: 1, supply_date: SUPPLY_DATE, notes: NOTES,
  qr_url: `https://www.goodsoncountry.com/bed/${BATCH}-${n}`,
});
const washerRow = (n) => ({
  unique_id: `GB0-WM-MANI-${n}`, id: `GB0-WM-MANI-${n}`, name: 'Maningrida',
  product: 'Washing Machine', community: 'Maningrida', community_id: 'maningrida',
  place: 'Maningrida, NT 0822, Australia', partner_name: 'Homeland School Company',
  status: 'deployed', quantity: 1, supply_date: SUPPLY_DATE, notes: NOTES,
});

const rows = [
  ...Array.from({ length: BEDS }, (_, i) => bedRow(i + 1)),
  ...Array.from({ length: WASHERS }, (_, i) => washerRow(i + 1)),
];

console.log(`${APPLY ? 'APPLYING' : 'DRY-RUN'}: ${BEDS} Stretch Bed + ${WASHERS} Washing Machine rows -> Maningrida (${BATCH}-1..${BEDS}, GB0-WM-MANI-1..${WASHERS})`);
console.log('sample bed row:', JSON.stringify(bedRow(1), null, 1));

if (!APPLY) {
  console.log('\nDry run only. Re-run with --apply to insert, then do the canon sweep (see header).');
  process.exit(0);
}

const { error } = await supabase.from('assets').insert(rows);
if (error) { console.error('insert failed:', error.message); process.exit(1); }
console.log(`Inserted ${rows.length} rows. Now: update asset-canonical.ts + drift snapshot, then run check-asset-drift.mjs.`);
