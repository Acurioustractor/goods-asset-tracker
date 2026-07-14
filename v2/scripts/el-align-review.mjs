#!/usr/bin/env node
/**
 * ALIGN REVIEW — contact sheet of the Goods EL photos that have NO person tag yet
 * (no media_storytellers row), grouped by gallery/area, each with a short pick id
 * (G1, G2...) so Ben can reply "G14: Mark, G15: skip, G16: Jimmy Frank" in one
 * batch instead of one-by-one. Companion to el-align.mjs (which does the actual
 * write once Ben gives an id -> name mapping).
 *
 * READ-ONLY against EL. Writes only a local review sheet + JSON index.
 *
 * Usage: node scripts/el-align-review.mjs
 * Out:   .el-align-review/index.html + .el-align-review/picks.json
 */
import fs from 'node:fs';
import path from 'node:path';

for (const l of fs.readFileSync('.env.local', 'utf8').split('\n')) { const m = l.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const URL_ = process.env.EMPATHY_LEDGER_SUPABASE_URL, KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY, PID = process.env.EMPATHY_LEDGER_PROJECT_ID;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const PLACEHOLDER = 'ac700001-0000-0000-0000-000000000002';

const get = async (t, qs) => { const r = await fetch(`${URL_}/rest/v1/${t}?${qs}`, { headers: H }); if (!r.ok) throw new Error(`${t} ${r.status}: ${(await r.text()).slice(0, 160)}`); return r.json(); };
const chunk = (a, n) => { const o = []; for (let i = 0; i < a.length; i += n) o.push(a.slice(i, i + n)); return o; };
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const areaFor = (m, galleryTitle) => {
  if (galleryTitle) return galleryTitle;
  const p = m.storage_path || '';
  if (p.startsWith('goods/migrated/')) return p.replace('goods/migrated/', '').split('__')[0];
  const parts = p.split('/');
  if (parts.length > 1) return parts[0];
  return 'other';
};

async function main() {
  const pg = await get('project_galleries', `project_id=eq.${PID}&select=gallery_id`);
  const gids = pg.map((g) => g.gallery_id);
  const gals = gids.length ? await get('galleries', `id=in.(${gids})&select=id,title`) : [];
  const galTitle = new Map(gals.map((g) => [g.id, g.title]));
  const assoc = gids.length ? await get('gallery_media_associations', `gallery_id=in.(${gids})&select=gallery_id,media_asset_id`) : [];
  const galleryOf = new Map(); assoc.forEach((a) => galleryOf.set(a.media_asset_id, galTitle.get(a.gallery_id)));

  const SEL = 'id,storage_bucket,storage_path,cdn_url,thumbnail_url,original_filename,title,media_type,visibility,storyteller_id,is_sacred_no_publish,removed_by_storyteller_at';
  const byId = await get('media_assets', `project_id=eq.${PID}&select=${SEL}&limit=1000`);
  const byCode = await get('media_assets', `project_code=eq.goods&select=${SEL}&limit=1000`);
  const map = new Map(); [...byId, ...byCode].forEach((m) => map.set(m.id, m));
  const missing = [...new Set(assoc.map((a) => a.media_asset_id))].filter((id) => !map.has(id));
  for (const c of chunk(missing, 100)) for (const m of await get('media_assets', `id=in.(${c})&select=${SEL}`)) map.set(m.id, m);
  const media = [...map.values()];

  const mids = media.map((m) => m.id);
  const junction = [];
  for (const c of chunk(mids, 100)) { const j = await get('media_storytellers', `media_asset_id=in.(${c})&select=media_asset_id`); junction.push(...j); }
  const aligned = new Set(junction.map((j) => j.media_asset_id));

  const untagged = media.filter((m) => m.media_type === 'image' && !aligned.has(m.id) && !m.removed_by_storyteller_at && !m.is_sacred_no_publish);

  const byArea = {};
  for (const m of untagged) { const a = areaFor(m, galleryOf.get(m.id)); (byArea[a] ||= []).push(m); }

  let n = 0;
  const picks = {};
  const groups = Object.entries(byArea).sort((a, b) => b[1].length - a[1].length).map(([area, items]) => ({
    area, items: items.map((m) => {
      const pick = `G${++n}`;
      picks[pick] = { id: m.id, filename: m.original_filename, area };
      // storage_bucket column is unreliable for the pre-2026-07 batch (says 'media' but
      // bytes actually live in 'story-images'); cdn_url/thumbnail_url reflect reality.
      const url = m.thumbnail_url || m.cdn_url || `${URL_}/storage/v1/object/public/${m.storage_bucket}/${m.storage_path}`;
      return { pick, url, filename: m.original_filename || m.title || m.id.slice(0, 8) };
    }),
  }));

  fs.mkdirSync('.el-align-review', { recursive: true });
  fs.writeFileSync('.el-align-review/picks.json', JSON.stringify({ asOf: new Date().toISOString().slice(0, 10), count: n, picks }, null, 2));

  const tile = (p) => `<div class="tile">
    <div class="thumb" style="background-image:url('${esc(p.url)}')"><span class="pick">${esc(p.pick)}</span></div>
    <div class="cap">${esc(p.filename)}</div></div>`;
  const secs = groups.map((g) => `<h2 class="sec">${esc(g.area)} <span>(${g.items.length})</span></h2>
    <div class="grid">${g.items.map(tile).join('')}</div>`).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Goods — untagged photo review</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#FBF8F1;color:#2B2A26;font-family:system-ui,sans-serif;padding:40px 48px 120px;max-width:1760px;margin:0 auto}
h1{font-weight:600;font-size:34px}
.lead{color:#7A7363;font-size:16px;margin:12px 0 30px;max-width:900px;line-height:1.55}
.lead b{color:#2B2A26}
.sec{font-weight:600;font-size:22px;margin:44px 0 4px;border-bottom:1px solid #E6DFD1;padding-bottom:10px;color:#C45C3E}
.sec span{color:#7A7363;font-size:16px;font-weight:400}
.grid{display:grid;grid-template-columns:repeat(8,1fr);gap:12px;margin-top:14px}
.tile{background:#fff;border:1px solid #E6DFD1;border-radius:10px;overflow:hidden}
.thumb{position:relative;height:120px;background-size:cover;background-position:center;background-color:#F1ECE4}
.pick{position:absolute;top:6px;right:6px;background:#2B2A26;color:#fff;font-weight:700;font-size:11px;padding:2px 7px;border-radius:6px}
.cap{padding:6px 8px;font-size:10px;color:#7A7363;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
</style></head><body>
<h1>Goods on Country — untagged photo review</h1>
<p class="lead">${n} photos with no person tagged yet, grouped by shoot/gallery. Reply with a batch like <b>G14: Mark, G15: skip, G16: Jimmy Frank</b> (use "skip" for no-one identifiable, or "unsure" to flag for later). I'll write the tags from your list — nothing is guessed.</p>
${secs}
</body></html>`;
  fs.writeFileSync('.el-align-review/index.html', html);
  console.log(`${n} untagged photos, ${groups.length} groups:`);
  groups.forEach((g) => console.log(`  ${String(g.items.length).padStart(3)}  ${g.area}  (${g.items[0].pick}-${g.items[g.items.length - 1].pick})`));
  console.log('\n-> ' + path.resolve('.el-align-review/index.html'));
}
main().catch((e) => { console.error('FAILED:', e.message); process.exit(1); });
