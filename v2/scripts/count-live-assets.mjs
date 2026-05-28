/**
 * READ-ONLY: the canonical current bed/washer counts from the LIVE assets table
 * (Goods v2 DB, NEXT_PUBLIC_SUPABASE_URL). No writes. This is the source of truth that the
 * stale data/expanded_assets_final.csv (2 Dec 2025) was supposed to mirror.
 *   node --env-file=v2/.env.local v2/scripts/count-live-assets.mjs   (run from repo root)
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/['"]/g, '');
const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/['"]/g, '');
const supabase = createClient(url, key);

const { count: total, error: cErr } = await supabase.from('assets').select('*', { count: 'exact', head: true });
if (cErr) { console.error('assets count error:', cErr.message); process.exit(1); }
console.log(`Live assets table (${url}): ${total} rows total\n`);

// pull all (paginate) and aggregate locally — schema-agnostic on product/community/status
const rows = [];
for (let from = 0; ; from += 1000) {
  const { data, error } = await supabase.from('assets').select('*').range(from, from + 999);
  if (error) { console.error('fetch error:', error.message); break; }
  rows.push(...data);
  if (data.length < 1000) break;
}
const col = (r, names) => { for (const n of names) if (r[n] != null && r[n] !== '') return r[n]; return null; };
const prod = (r) => (col(r, ['product', 'product_slug', 'product_type', 'name']) || '').toString().toLowerCase();
const comm = (r) => col(r, ['community', 'community_name']) || col(r, ['community_id']) || '(none)';
const isBed = (p) => p.includes('bed');
const isWasher = (p) => p.includes('wash');

const byComm = {};
for (const r of rows) {
  const c = comm(r); const p = prod(r);
  byComm[c] ??= { beds: 0, washers: 0, other: 0 };
  if (isBed(p)) byComm[c].beds++; else if (isWasher(p)) byComm[c].washers++; else byComm[c].other++;
}
const totals = rows.reduce((a, r) => { const p = prod(r); if (isBed(p)) a.beds++; else if (isWasher(p)) a.washers++; else a.other++; return a; }, { beds: 0, washers: 0, other: 0 });
console.log(`TOTALS  beds:${totals.beds}  washers:${totals.washers}  other:${totals.other}\n`);
console.log('Per community (beds / washers):');
for (const [c, v] of Object.entries(byComm).sort((a, b) => b[1].beds - a[1].beds)) {
  console.log(`  ${String(c).padEnd(28)} beds:${v.beds}  washers:${v.washers}${v.other ? '  other:' + v.other : ''}`);
}
console.log('\nSample columns:', Object.keys(rows[0] || {}).join(', '));
