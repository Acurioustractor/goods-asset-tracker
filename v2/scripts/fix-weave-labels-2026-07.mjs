/**
 * Register text cleanup (STAGED, human-gated): remove the retired "Weave Bed"
 * wording from asset names/notes, and update the stale roadmap card.
 *
 * Product columns are ALREADY CORRECT on all 30 affected rows (Stretch/Basket);
 * only free-text names/notes carry the discontinued word. Mapping follows each
 * row's own product column:
 *   notes 'New Weave Bed batch'      -> 'New Stretch Bed batch'   (rows are Stretch)
 *   name  'Weave Bad'                -> 'Basket Bed'              (GB0-142-* are Basket)
 *   name  'Tennant Weave Beds'       -> 'Tennant Stretch Beds'    (GB0-151-* are Stretch)
 *   name  'Junior Weave Bed'         -> 'Junior Stretch Bed'      (GB0-131 is Stretch)
 *   name  'Dianne - weave bed'       -> 'Dianne - Stretch Bed'    (GB0-129 is Stretch)
 *   name  'Jimmy - weave bed'        -> 'Jimmy - Stretch Bed'     (GB0-130 is Stretch)
 *   roadmap_items b66d560b-…: title '496 beds…' -> '556 beds delivered across 9 communities'
 *   crm_deals c1c42376-… (Plant Part 2): note 'Heat press 190°C' -> '180°C' (canon, Ben 2026-07-17)
 *
 * DRY-RUN by default. Apply:
 *   node --env-file=.env.local scripts/fix-weave-labels-2026-07.mjs --apply
 */
import { createClient } from '@supabase/supabase-js';

const APPLY = process.argv.includes('--apply');
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/['"]/g, '');
const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/['"]/g, '');
if (!url || !key) { console.error('Missing env (run with --env-file=.env.local from v2/).'); process.exit(2); }
if (!url.includes('cwsyhpiuepvdjtxaozwf')) { console.error('Wrong-project guard. Refusing.'); process.exit(2); }
const supabase = createClient(url, key);

const NAME_MAP = [
  ['Weave Bad', 'Basket Bed'],
  ['Tennant Weave Beds', 'Tennant Stretch Beds'],
  ['Junior Weave Bed', 'Junior Stretch Bed'],
  ['Dianne - weave bed', 'Dianne - Stretch Bed'],
  ['Jimmy - weave bed', 'Jimmy - Stretch Bed'],
];

const { data: before } = await supabase.from('assets')
  .select('unique_id, product, name, notes')
  .or('name.ilike.%weave%,notes.ilike.%weave%,product.ilike.%weave%');
console.log(`${APPLY ? 'APPLYING' : 'DRY-RUN'} — ${before?.length ?? 0} rows carry "weave" text:`);
for (const r of before ?? []) console.log(` ${r.unique_id} (${r.product}) name=${JSON.stringify(r.name)} notes=${JSON.stringify(r.notes)}`);

if (!APPLY) { console.log('\nDry run only. Re-run with --apply.'); process.exit(0); }

const notes = await supabase.from('assets').update({ notes: 'New Stretch Bed batch' })
  .eq('notes', 'New Weave Bed batch').select('unique_id');
console.log(`notes fixed: ${notes.data?.length ?? 0} ${notes.error?.message ?? ''}`);
for (const [o, n] of NAME_MAP) {
  const r = await supabase.from('assets').update({ name: n }).eq('name', o).select('unique_id');
  console.log(`name ${JSON.stringify(o)} -> ${JSON.stringify(n)}: ${r.data?.length ?? 0} ${r.error?.message ?? ''}`);
}
const road = await supabase.from('roadmap_items')
  .update({ title: '556 beds delivered across 9 communities' })
  .eq('id', 'b66d560b-e42a-419e-a7d2-f1eb7877704e').select('id,title');
console.log('roadmap card:', JSON.stringify(road.data), road.error?.message ?? '');

const deal = await supabase.from('crm_deals')
  .update({ notes: 'QU-0012 DRAFT $93,498 (inc GST) — Production Plant Part 2: moulding & CNC. 6mo @ $13,333/mo + $5K transport. Heat press 180°C/5000 PSI, CNC router, cooling rack.' })
  .eq('id', 'c1c42376-b8ea-403e-9afc-ac9f3a364e53').select('id');
console.log('crm_deals 180°C:', deal.data?.length ?? 0, deal.error?.message ?? '');

const { data: after } = await supabase.from('assets')
  .select('unique_id').or('name.ilike.%weave%,notes.ilike.%weave%,product.ilike.%weave%');
console.log(`remaining weave rows: ${after?.length ?? 0}`);
