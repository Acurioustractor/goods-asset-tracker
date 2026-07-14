#!/usr/bin/env node
/**
 * EL photo↔people ALIGNMENT tool — read the full Goods library and (safely) write
 * people attributions into EL's `media_storytellers` junction (the source of truth).
 *
 * Corrects the 2026-07-07 finding: the Goods EL photos are essentially UN-aligned —
 * 342 trip photos sit under a placeholder "ACT Production Team" storyteller, the
 * junction has 0 rows for Goods people, and the 5 curated galleries (200 photos)
 * were never person-tagged. This tool is the alignment path.
 *
 * Unlike the rejected media_assets INSERT (storage-backed, needs upload+consent),
 * a media_storytellers row links an EXISTING photo to a person — a clean junction
 * write. Still Tier-3 (live EL): --apply is GUARDED and writes ONE row at a time.
 *
 *   node scripts/el-align.mjs                      # full library summary + alignment gaps
 *   node scripts/el-align.mjs people               # pickable Goods storytellers (portraits)
 *   node scripts/el-align.mjs payload <mediaId> <storytellerId>   # DRY-RUN: show the exact junction payload
 *   node scripts/el-align.mjs apply   <mediaId> <storytellerId>   # WRITE one row (needs EL_ALIGN_CONFIRM=1)
 *
 * EL creds from v2/.env.local (EMPATHY_LEDGER_SUPABASE_URL/KEY, _PROJECT_ID).
 */
import fs from 'node:fs';

const ENV = new URL('../.env.local', import.meta.url);
for (const l of fs.readFileSync(ENV, 'utf8').split('\n')) { const m = l.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const URL_ = process.env.EMPATHY_LEDGER_SUPABASE_URL, KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY, PID = process.env.EMPATHY_LEDGER_PROJECT_ID;
if (!URL_ || !KEY || !PID) { console.error('Missing EL creds in v2/.env.local'); process.exit(1); }
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const PLACEHOLDER = 'ac700001-0000-0000-0000-000000000002'; // "ACT Production Team" trip-dump bucket

const get = async (t, qs) => { const r = await fetch(`${URL_}/rest/v1/${t}?${qs}`, { headers: H }); if (!r.ok) throw new Error(`${t} ${r.status}: ${(await r.text()).slice(0, 160)}`); return r.json(); };
const chunk = (a, n) => { const o = []; for (let i = 0; i < a.length; i += n) o.push(a.slice(i, i + n)); return o; };

async function fullLibrary() {
  // 1. gallery photos
  const pg = await get('project_galleries', `project_id=eq.${PID}&select=gallery_id`);
  const gids = pg.map((g) => g.gallery_id);
  const gals = gids.length ? await get('galleries', `id=in.(${gids})&select=id,title`) : [];
  const galTitle = new Map(gals.map((g) => [g.id, g.title]));
  const assoc = gids.length ? await get('gallery_media_associations', `gallery_id=in.(${gids})&select=gallery_id,media_asset_id`) : [];
  const galleryOf = new Map(); assoc.forEach((a) => galleryOf.set(a.media_asset_id, galTitle.get(a.gallery_id)));

  // 2. media: EL tags Goods media THREE ways — project_id (96), project_code='goods'
  //    (195), and gallery-only. Union all three (dedupe by id) for the true library.
  const SEL = 'id,cdn_url,thumbnail_url,title,media_type,file_type,visibility,storyteller_id,is_sacred_no_publish,removed_by_storyteller_at';
  const byId = await get('media_assets', `project_id=eq.${PID}&select=${SEL}&limit=1000`);
  const byCode = await get('media_assets', `project_code=eq.goods&select=${SEL}&limit=1000`);
  const map = new Map(); [...byId, ...byCode].forEach((m) => map.set(m.id, m));
  const missing = [...new Set(assoc.map((a) => a.media_asset_id))].filter((id) => !map.has(id));
  for (const c of chunk(missing, 100)) for (const m of await get('media_assets', `id=in.(${c})&select=${SEL}`)) map.set(m.id, m);
  const media = [...map.values()];
  // EL-verified: only rows typed media_type='image' are the safe photo corpus (240).
  // 136 rows are untyped (media_type + mime both null) — may be docs/graphics.
  const isImg = (m) => m.media_type === 'image';

  // 3. existing junction rows for Goods media
  const mids = media.map((m) => m.id);
  const junction = [];
  for (const c of chunk(mids, 100)) { const j = await get('media_storytellers', `media_asset_id=in.(${c})&select=media_asset_id,storyteller_id`); junction.push(...j); }
  const alignedMedia = new Set(junction.map((j) => j.media_asset_id));

  return { media, isImg, galleryOf, gals, junction, alignedMedia };
}

const cmd = process.argv[2] || 'summary';

if (cmd === 'summary') {
  const { media, isImg, galleryOf, gals, junction, alignedMedia } = await fullLibrary();
  const imgs = media.filter(isImg);
  console.log('== FULL Goods EL photo library ==');
  console.log('media_assets:', media.length, '| images:', imgs.length, '| in a gallery:', imgs.filter((m) => galleryOf.has(m.id)).length);
  console.log('\ngalleries:');
  const perGal = {}; for (const m of imgs) { const g = galleryOf.get(m.id) || '(ungalleried)'; perGal[g] = (perGal[g] || 0) + 1; }
  Object.entries(perGal).sort((a, b) => b[1] - a[1]).forEach(([g, n]) => console.log('  ', String(n).padStart(3), g));
  console.log('\n== ALIGNMENT STATE ==');
  console.log('media with a media_storytellers link:', alignedMedia.size, '/', imgs.length);
  console.log('media with a storyteller_id column:  ', imgs.filter((m) => m.storyteller_id && m.storyteller_id !== PLACEHOLDER).length);
  console.log('GAP (images, no person link):        ', imgs.filter((m) => !alignedMedia.has(m.id)).length);
}

if (cmd === 'people') {
  // Goods storytellers = those linked to Goods stories, minus placeholder + internal
  const st = await get('stories', `project_id=eq.${PID}&storyteller_id=not.is.null&select=storyteller_id`);
  const ids = [...new Set(st.map((s) => s.storyteller_id))].filter((id) => id !== PLACEHOLDER);
  const people = await get('storytellers', `id=in.(${ids})&select=id,display_name,public_avatar_url,is_elder&order=display_name`);
  console.log('== pickable Goods storytellers (', people.length, ') ==');
  for (const p of people) console.log('  ', p.id, '|', (p.display_name || '').padEnd(24), p.public_avatar_url ? 'portrait' : 'no-portrait', p.is_elder ? '(elder)' : '');
}

if (cmd === 'payload' || cmd === 'apply') {
  const [mediaId, storytellerId] = [process.argv[3], process.argv[4]];
  if (!mediaId || !storytellerId) { console.error('usage: el-align.mjs', cmd, '<mediaId> <storytellerId>'); process.exit(1); }
  // resolve tenant + names for a readable preview
  const [m] = await get('media_assets', `id=eq.${mediaId}&select=id,title,tenant_id,cdn_url`);
  const [s] = await get('storytellers', `id=eq.${storytellerId}&select=id,display_name`);
  if (!m) { console.error('media not found:', mediaId); process.exit(1); }
  if (!s) { console.error('storyteller not found:', storytellerId); process.exit(1); }
  const payload = {
    media_asset_id: mediaId,
    storyteller_id: storytellerId,
    relationship: 'appears_in',  // CHECK enum (was invalid 'depicted')
    consent_status: 'pending',   // CHECK enum; name↔photo link stays private until cleared in EL
    source: 'batch',             // CHECK enum (was invalid 'goods-align-2026-07')
    // tenant_id omitted — trigger trg_fill_tenant_id fills it from the storyteller
    // added_by omitted — nullable auth.users FK; a service write has no auth user
  };
  console.log('media:', m.title || m.id, '\nstoryteller:', s.display_name, '\n\nmedia_storytellers row:');
  console.log(JSON.stringify(payload, null, 2));
  const existing = await get('media_storytellers', `media_asset_id=eq.${mediaId}&storyteller_id=eq.${storytellerId}&select=id`);
  if (existing.length) { console.log('\nALREADY LINKED (id ' + existing[0].id + ') — would skip.'); process.exit(0); }

  if (cmd === 'apply') {
    if (process.env.EL_ALIGN_CONFIRM !== '1') { console.log('\n[apply BLOCKED] set EL_ALIGN_CONFIRM=1 to write this ONE row to live EL.'); process.exit(0); }
    const r = await fetch(`${URL_}/rest/v1/media_storytellers?on_conflict=media_asset_id,storyteller_id,relationship`, { method: 'POST', headers: { ...H, 'Content-Type': 'application/json', Prefer: 'resolution=ignore-duplicates,return=representation' }, body: JSON.stringify(payload) });
    const body = await r.text();
    console.log('\n[WRITE]', r.status, body.slice(0, 300));
  } else {
    console.log('\n[DRY-RUN] no write. Use `apply` + EL_ALIGN_CONFIRM=1 to persist.');
  }
}
