#!/usr/bin/env node
/**
 * ONE-TIME CLEANUP — remove non-Goods EL rows from the Goods content index.
 *
 * The old content-index used the EL content-hub `project_code=goods-on-country`
 * aggregate, which pulled media from adjacent A Curious Tractor projects (BG-Fit /
 * JusticeHub / Spinifex) into content_items. The indexer is now project_id-scoped
 * (media_assets, Goods 6bd47c8a), so those rows are stale non-Goods leaks.
 *
 * Deletes source='el' rows whose `ref` is NOT a current Goods media_assets id AND
 * that carry no curation (star / rating / canon_slot / archive). Curated leaks are
 * kept (already red) for human review, never deleted. Only content_items index
 * rows are touched; no EL media is affected.
 *
 * Usage:  node scripts/content-cleanup-leaked-el.mjs           (dry-run)
 *         node scripts/content-cleanup-leaked-el.mjs --apply   (delete)
 */
import fs from 'node:fs';

function loadEnv(p) {
  const out = {};
  try {
    for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch { /* none */ }
  return out;
}

const env = loadEnv('.env.local');
const APPLY = process.argv.includes('--apply');

const GU = (env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const GK = env.SUPABASE_SERVICE_ROLE_KEY || '';
if (!GU.includes('cwsyhpiuepvdjtxaozwf')) { console.error(`Refusing: not the Goods project (${GU}).`); process.exit(1); }
const GH = { apikey: GK, Authorization: `Bearer ${GK}`, 'Content-Type': 'application/json' };

const EU = (env.EMPATHY_LEDGER_SUPABASE_URL || '').replace(/\/$/, '');
const EK = env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const PID = env.EMPATHY_LEDGER_PROJECT_ID || '6bd47c8a-e676-456f-aa25-ddcbb5a31047';
if (!EU || !EK) { console.error('Missing EMPATHY_LEDGER_SUPABASE_URL / KEY in .env.local'); process.exit(1); }
const EH = { apikey: EK, Authorization: `Bearer ${EK}` };

const isCurated = (r) => r.starred || r.rating || r.canon_slot || r.archived_at;

(async () => {
  const goodsIds = new Set(
    (await fetch(`${EU}/rest/v1/media_assets?project_id=eq.${PID}&select=id`, { headers: EH }).then((r) => r.json())).map((m) => m.id),
  );
  // Guard: never run a mass delete if the EL fetch clearly failed.
  if (goodsIds.size < 10) { console.error(`Refusing: only ${goodsIds.size} Goods media ids fetched (EL fetch likely failed).`); process.exit(1); }

  const rows = await fetch(`${GU}/rest/v1/content_items?source=eq.el&select=id,ref,url,starred,rating,canon_slot,archived_at`, { headers: GH }).then((r) => r.json());
  const leaked = rows.filter((r) => !goodsIds.has(r.ref));
  const toDelete = leaked.filter((r) => !isCurated(r));
  const keptCurated = leaked.filter(isCurated);

  console.log(`Goods media ids: ${goodsIds.size}`);
  console.log(`EL content_items: ${rows.length} | leaked (non-Goods): ${leaked.length} | to delete: ${toDelete.length} | curated kept: ${keptCurated.length}`);
  if (keptCurated.length) keptCurated.forEach((r) => console.log(`  keep (curated): ${r.id} ${(r.url || '').slice(-40)}`));

  if (!APPLY) { console.log('\nDRY-RUN. Re-run with --apply to delete.'); return; }
  if (toDelete.length === 0) { console.log('Nothing to delete.'); return; }

  let done = 0;
  for (let i = 0; i < toDelete.length; i += 100) {
    const ids = toDelete.slice(i, i + 100).map((r) => r.id);
    const res = await fetch(`${GU}/rest/v1/content_items?id=in.(${ids.join(',')})`, { method: 'DELETE', headers: { ...GH, Prefer: 'return=minimal' } });
    if (!res.ok) { console.error(`delete failed: ${res.status} ${await res.text()}`); process.exit(1); }
    done += ids.length;
  }
  console.log(`Deleted ${done} leaked non-Goods EL rows.`);
})();
