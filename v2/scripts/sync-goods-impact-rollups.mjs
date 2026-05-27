/**
 * Goods impact resync → GHL rollups. THE up-to-date source of truth.
 * Reads the LIVE `assets` table (canonical, QR-updated) every run — never the stale CSV —
 * aggregates per community, applies Ben's curated community→record mapping, and writes the
 * beds/washers rollup custom fields onto the right GHL records. Re-runnable + cron-safe.
 *
 *   env -u NEXT_PUBLIC_SUPABASE_URL -u SUPABASE_SERVICE_ROLE_KEY -u NEXT_PUBLIC_SUPABASE_ANON_KEY \
 *     node --env-file=v2/.env.local v2/scripts/sync-goods-impact-rollups.mjs          # dry-run
 *   (add --apply to write)
 *
 * env -u clears shell-profile vars that otherwise shadow --env-file (the cwsyh assets DB).
 */
import { createClient } from '@supabase/supabase-js';

const APPLY = process.argv.includes('--apply');
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/['"]/g, ''),
  (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/['"]/g, ''));

const GHL = 'https://services.leadconnectorhq.com';
const TOKEN = (process.env.GHL_API_KEY || process.env.GHL_PRIVATE_TOKEN || '').replace(/['"]/g, '');
const LOC = (process.env.GHL_LOCATION_ID || 'agzsSZWgovjwgpcoASWG').replace(/['"]/g, '');
const H = { Authorization: `Bearer ${TOKEN}`, Version: '2021-07-28', 'Content-Type': 'application/json', Accept: 'application/json' };
const FIELD = { beds: 'wRiK8nW7Rv8vL0twp9lF', washers: 'RcAAxZFPlVmGjKKGWy7I', lastDelivery: '8z8xIptjdN6bqcwaVOSt' };

// Ben's curated mapping (2026-05-27). A community can roll up to a funder AND a partner (different
// roles — do not sum across records). partner=true also tags the record goods-partner.
const MAP = [
  { name: 'Snow Foundation',     id: 'laCUDrYPbaEP5rC9UEcf', communities: ['Tennant Creek'],                   partner: false },
  { name: 'Centrecorp',          id: 'ehnCEv62bCaGNTd1QuGp', communities: ['Utopia Homelands'],                partner: false },
  { name: 'Oonchiumpa',          id: null, search: 'Oonchiumpa', communities: ['Utopia Homelands', 'Alice Springs'], partner: true },
  { name: "Mala'la Health",      id: 'Z6POQ8e2wtBKSWDuPLEx', communities: ['Maningrida'],                      partner: false },
  { name: 'PICC (Palm Island)',  id: 'f8sbjgfZo1oD0Je0yArk', communities: ['Palm Island'],                     partner: true },
];

async function ghl(path, method = 'GET', body) {
  const r = await fetch(`${GHL}${path}`, { method, headers: H, ...(body && { body: JSON.stringify(body) }) });
  const t = await r.text();
  if (!r.ok) throw new Error(`GHL ${method} ${path}: ${r.status} ${t.slice(0, 200)}`);
  return t ? JSON.parse(t) : {};
}

async function main() {
  // 1. live assets → per-community aggregate
  const rows = [];
  for (let f = 0; ; f += 1000) {
    const { data, error } = await sb.from('assets').select('product,community,supply_date').range(f, f + 999);
    if (error) throw new Error(`assets: ${error.message}`);
    rows.push(...data); if (data.length < 1000) break;
  }
  const byComm = {};
  for (const r of rows) {
    const p = (r.product || '').toLowerCase(), c = r.community || '(none)';
    byComm[c] ??= { beds: 0, washers: 0, last: null };
    if (p.includes('bed')) byComm[c].beds++; else if (p.includes('wash')) byComm[c].washers++;
    const d = Date.parse(r.supply_date); if (d && new Date(d).getFullYear() >= 2024 && (!byComm[c].last || d > byComm[c].last)) byComm[c].last = d;
  }
  console.log(`Live assets: ${rows.length} | Mode: ${APPLY ? 'APPLY' : 'DRY-RUN'}\n`);

  // 2. apply curated mapping
  for (const m of MAP) {
    let beds = 0, washers = 0, last = null;
    for (const c of m.communities) { const v = byComm[c]; if (v) { beds += v.beds; washers += v.washers; if (v.last && (!last || v.last > last)) last = v.last; } }
    let id = m.id;
    if (!id && m.search) { const found = (await ghl(`/contacts/search`, 'POST', { locationId: LOC, query: m.search, pageLimit: 5 })).contacts || []; id = found[0]?.id; }
    const tag = m.partner ? ' +goods-partner' : '';
    console.log(`${APPLY ? '→' : '·'} ${m.name.padEnd(22)} ${m.communities.join('+').padEnd(28)} beds:${beds} washers:${washers}${last ? ' last:' + new Date(last).toISOString().slice(0, 10) : ''}  → ${id || 'NOT FOUND'}${tag}`);
    if (!APPLY || !id) continue;
    const cf = [{ id: FIELD.beds, value: beds }, { id: FIELD.washers, value: washers }];
    if (last) cf.push({ id: FIELD.lastDelivery, value: new Date(last).toISOString().slice(0, 10) }); // GHL DATE wants YYYY-MM-DD, not epoch ms
    try {
      await ghl(`/contacts/${id}`, 'PUT', { customFields: cf });
      if (m.partner) await ghl(`/contacts/${id}/tags`, 'POST', { tags: ['goods-partner'] });
    } catch (e) { console.error(`  ✗ ${m.name}: ${e.message}`); }
  }
  // unmapped communities (visibility)
  const mapped = new Set(MAP.flatMap((m) => m.communities));
  const orphans = Object.entries(byComm).filter(([c, v]) => !mapped.has(c) && (v.beds + v.washers) > 0 && c !== '(none)');
  if (orphans.length) console.log(`\nUnmapped communities (no record yet): ${orphans.map(([c, v]) => `${c}(${v.beds}b/${v.washers}w)`).join(', ')}`);
  if (!APPLY) console.log('\n(Dry-run. Re-run with --apply.)');
}
main().catch((e) => { console.error(e.message); process.exit(1); });
