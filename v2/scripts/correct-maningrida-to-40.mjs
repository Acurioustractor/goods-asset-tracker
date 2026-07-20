/**
 * Maningrida CORRECTION (STAGED, human-gated): the final delivery number is
 * 40 Stretch Beds + 2 washers (Ben, 2026-07-18 evening — matches Homeland
 * School Company INV-0303 exactly). The earlier backfill inserted 60 beds,
 * so rows GB0-157-41..GB0-157-60 must be removed. Washers (2) are correct.
 *
 * Resulting canon: 536 beds = 363 Basket + 173 Stretch · 3,460kg (173 x 20,
 * Stretch only) · 18 washers · 9 communities.
 *
 * DRY-RUN by default. Apply:
 *   node --env-file=.env.local scripts/correct-maningrida-to-40.mjs --apply
 */
import { createClient } from '@supabase/supabase-js';

const APPLY = process.argv.includes('--apply');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/['"]/g, '');
const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/['"]/g, '');
if (!url || !key) { console.error('Missing env (run with --env-file=.env.local from v2/).'); process.exit(2); }
if (!url.includes('cwsyhpiuepvdjtxaozwf')) { console.error('Wrong-project guard. Refusing.'); process.exit(2); }
const supabase = createClient(url, key);

const ids = Array.from({ length: 20 }, (_, i) => `GB0-157-${41 + i}`);
const { data: found, error } = await supabase.from('assets').select('unique_id, product, community').in('unique_id', ids);
if (error) { console.error(error.message); process.exit(2); }
console.log(`${APPLY ? 'APPLYING' : 'DRY-RUN'} — deleting ${found.length} over-counted Maningrida rows (GB0-157-41..60):`);
console.log(found.map((r) => r.unique_id).sort().join(' '));
if (found.some((r) => r.community !== 'Maningrida' || r.product !== 'Stretch Bed')) {
  console.error('Safety stop: a matched row is not a Maningrida Stretch Bed. Investigate.');
  process.exit(1);
}
if (!APPLY) { console.log('\nDry run only. Re-run with --apply.'); process.exit(0); }

const del = await supabase.from('assets').delete().in('unique_id', ids).select('unique_id');
console.log(`deleted: ${del.data?.length ?? 0} ${del.error?.message ?? ''}`);

// Stamp the invoice linkage on the remaining 40 so the count is self-documenting.
const note = 'Maningrida Homelands delivery with Homeland School Company; made at the farm production facility. Final count 40 beds + 2 washers per INV-0303 (Ben-confirmed 2026-07-18; earlier +60 note corrected).';
const upd = await supabase.from('assets').update({ notes: note }).like('unique_id', 'GB0-157-%').select('unique_id');
const updW = await supabase.from('assets').update({ notes: note }).like('unique_id', 'GB0-WM-MANI-%').select('unique_id');
console.log(`notes stamped: ${(upd.data?.length ?? 0) + (updW.data?.length ?? 0)} rows`);
console.log('Now run the canon sweep check: node --env-file=.env.local scripts/check-asset-drift.mjs');
