#!/usr/bin/env node
/**
 * CONTENT INDEX — the content system's sync job.
 *
 * Upserts one row per asset into the Goods DB `content_items` (the unified
 * curation index) for THREE sources:
 *   1. local images   — public/images/**            (checksum identity)
 *   2. local videos   — public/video/**             (checksum identity)
 *   3. Empathy Ledger — content-hub media (image+video, paged)   (ref identity)
 *
 * Design: wiki/outputs/2026-07-03-content-system-design.md
 *
 * Re-run safe. LOCAL rows: patches only crawl columns (ref/url/area/canon_slot),
 * NEVER overwrites star/rating/archive/tags. EL rows: EL is a live mirror, so
 * the crawl REFRESHES consent_tier/url/poster/tags/title on every run (a
 * withdrawn/absent EL item flips back to consent_tier='red' = default-deny),
 * but curation (star/rating/archive) is still preserved.
 *
 * Writes via PostgREST with the service role key. Run from v2/:
 *   node scripts/content-index.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// --- env ---------------------------------------------------------------------
function loadEnv(file) {
  const env = {};
  try {
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!m) continue;
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      env[m[1]] = v;
    }
  } catch { /* fall through */ }
  return env;
}
const env = loadEnv('.env.local');
const SB_URL = (env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const SB_KEY = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
if (!SB_URL || !SB_KEY) { console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in v2/.env.local'); process.exit(1); }
if (!SB_URL.includes('cwsyhpiuepvdjtxaozwf')) { console.error(`Refusing: not the Goods project (${SB_URL}).`); process.exit(1); }
const REST = `${SB_URL}/rest/v1`;
const H = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' };

// EL media is read direct from EL Supabase by PROJECT_ID (the hard association).
// The content-hub projectCode aggregates adjacent projects (BG-Fit / JusticeHub /
// Spinifex) and leaked their media into this Goods-only index — see getMedia.
const EL_SB_URL = (env.EMPATHY_LEDGER_SUPABASE_URL || process.env.EMPATHY_LEDGER_SUPABASE_URL || '').replace(/\/$/, '');
const EL_SB_KEY = env.EMPATHY_LEDGER_SUPABASE_KEY || process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const EL_PROJECT_ID = env.EMPATHY_LEDGER_PROJECT_ID || process.env.EMPATHY_LEDGER_PROJECT_ID || '6bd47c8a-e676-456f-aa25-ddcbb5a31047';

const md5File = (p) => crypto.createHash('md5').update(fs.readFileSync(p)).digest('hex');
const readJSON = (p, def) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return def; } };

// --- REST helpers ------------------------------------------------------------
async function insertBatch(rows) {
  for (let i = 0; i < rows.length; i += 200) {
    const res = await fetch(`${REST}/content_items`, {
      method: 'POST', headers: { ...H, Prefer: 'return=minimal' }, body: JSON.stringify(rows.slice(i, i + 200)),
    });
    if (!res.ok) throw new Error(`insert failed: ${res.status} ${await res.text()}`);
  }
}
async function patchById(id, body) {
  const res = await fetch(`${REST}/content_items?id=eq.${id}`, {
    method: 'PATCH', headers: { ...H, Prefer: 'return=minimal' }, body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`patch ${id} failed: ${res.status} ${await res.text()}`);
}
async function fetchExisting(sourceFilter, select) {
  const res = await fetch(`${REST}/content_items?${sourceFilter}&select=${select}`, { headers: H });
  if (!res.ok) throw new Error(`fetch existing failed: ${res.status} ${await res.text()}`);
  return res.json();
}

const IMG_RE = /\.(jpe?g|png|webp)$/i;
const VID_RE = /\.(mp4|webm|mov|m4v)$/i;

// --- canon-slot map (checksum-first, dedup-proof; url fallback) --------------
const slotByUrl = {};
const slotByChecksum = {};
for (const im of (readJSON('../design/image-canon.json', { images: [] }).images || [])) {
  if (!im.canonicalPath || !im.slot) continue;
  const p = im.canonicalPath;
  let filePath = null; let url = null;
  if (p.startsWith('v2/public/images/')) { filePath = p.slice('v2/'.length); url = '/images/' + p.slice('v2/public/images/'.length); }
  else if (p.startsWith('public/images/')) { filePath = p; url = '/images/' + p.slice('public/images/'.length); }
  else if (p.startsWith('v2/public/video/')) { filePath = p.slice('v2/'.length); url = '/video/' + p.slice('v2/public/video/'.length); }
  else if (p.startsWith('public/video/')) { filePath = p; url = '/video/' + p.slice('public/video/'.length); }
  if (!url) continue;
  slotByUrl[url] = im.slot;
  try { slotByChecksum[md5File(filePath)] = im.slot; } catch { /* missing */ }
}

// ============================================================================
// PASS 1+2 — local files (images + videos), checksum identity
// ============================================================================
const savedTags = readJSON('data/local-image-tags.json', {});
const dedup = readJSON('data/image-dedup.json', {});
const aliasUrls = new Set();
for (const arr of Object.values(dedup)) for (const a of arr) aliasUrls.add(a);

const consentForArea = (area) => (area === 'people' ? 'gated' : 'public');
const subtypeFor = (area, filename) =>
  area === 'people' ? 'portrait' : (area === 'brand' && /logo/i.test(filename) ? 'logo' : null);

const localFiles = []; // { url, area, filename, checksum, media_type, poster_url }
const seenMd5 = new Set();

// images
(function walkImages(dir, rel) {
  let entries; try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const childRel = [...rel, e.name];
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { walkImages(full, childRel); continue; }
    if (!e.isFile() || !IMG_RE.test(e.name)) continue;
    const url = '/images/' + childRel.join('/');
    if (aliasUrls.has(url)) continue;
    const checksum = md5File(full);
    if (seenMd5.has(checksum)) continue;
    seenMd5.add(checksum);
    localFiles.push({ url, area: rel.length ? rel[0] : 'root', filename: e.name, checksum, media_type: 'image', poster_url: null });
  }
})(path.join(process.cwd(), 'public', 'images'), []);

// videos (skip -mobile variants; resolve a sibling poster where present)
function posterForVideo(dir, filename, relDir) {
  const base = filename.replace(/-(desktop|mobile)\.\w+$/i, '').replace(/\.\w+$/, '');
  const cands = [`${base}-poster.jpg`, `${base.split('-')[0]}-poster.jpg`];
  for (const c of cands) {
    if (fs.existsSync(path.join(dir, c))) return '/video/' + [...relDir, c].join('/');
  }
  return null;
}
(function walkVideos(dir, rel) {
  let entries; try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const childRel = [...rel, e.name];
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { walkVideos(full, childRel); continue; }
    if (!e.isFile() || !VID_RE.test(e.name)) continue;
    if (/-mobile\.\w+$/i.test(e.name)) continue; // mobile variant of a -desktop clip
    const url = '/video/' + childRel.join('/');
    const checksum = md5File(full);
    if (seenMd5.has(checksum)) continue;
    seenMd5.add(checksum);
    localFiles.push({
      url, area: rel.length ? rel[0] : 'video', filename: e.name, checksum, media_type: 'video',
      poster_url: posterForVideo(dir, e.name, rel),
      subtype: /overlay/i.test(e.name) ? 'overlay' : null,
    });
  }
})(path.join(process.cwd(), 'public', 'video'), []);

async function syncLocal() {
  const existing = new Map();
  for (const r of await fetchExisting('source=eq.local', 'id,checksum,ref,url,area,canon_slot,poster_url')) existing.set(r.checksum, r);
  const inserts = []; const patches = [];
  for (const f of localFiles) {
    const canon_slot = slotByChecksum[f.checksum] || slotByUrl[f.url] || null;
    const isStoryteller = !!canon_slot && canon_slot.startsWith('storyteller-');
    const cur = existing.get(f.checksum);
    if (!cur) {
      inserts.push({
        source: 'local', ref: f.url, url: f.url, media_type: f.media_type, checksum: f.checksum,
        area: f.area, poster_url: f.poster_url || null, tags: savedTags[f.url] || [], canon_slot,
        consent_tier: isStoryteller ? 'gated' : (f.media_type === 'video' ? 'public' : consentForArea(f.area)),
        media_subtype: f.subtype || (isStoryteller ? 'portrait' : subtypeFor(f.area, f.filename)),
      });
    } else {
      const body = {};                              // crawl cols only; never curation
      if (cur.ref !== f.url) body.ref = f.url;
      if (cur.url !== f.url) body.url = f.url;
      if (cur.area !== f.area) body.area = f.area;
      if ((cur.poster_url || null) !== (f.poster_url || null)) body.poster_url = f.poster_url || null;
      if ((cur.canon_slot || null) !== canon_slot) body.canon_slot = canon_slot;
      if (Object.keys(body).length) patches.push({ id: cur.id, body });
    }
  }
  await insertBatch(inserts);
  for (const p of patches) await patchById(p.id, p.body);
  const imgs = localFiles.filter((f) => f.media_type === 'image').length;
  console.log(`local : ${localFiles.length} files (${imgs} img · ${localFiles.length - imgs} video) — inserted ${inserts.length}, patched ${patches.length}`);
}

// ============================================================================
// PASS 3 — Empathy Ledger media (image + video), ref identity, consent re-sync
// ============================================================================
async function fetchElMediaAssets(mediaType) {
  const sel = 'id,cdn_url,url,large_url,medium_url,thumbnail_url,media_type,width,height,duration,cultural_tags,visibility,is_sacred_no_publish,removed_by_storyteller_at,elder_approved,consent_obtained';
  const out = [];
  for (let offset = 0; offset < 6000; offset += 1000) {
    const q = `project_id=eq.${EL_PROJECT_ID}&media_type=eq.${mediaType}&select=${sel}&order=created_at.desc&limit=1000&offset=${offset}`;
    const res = await fetch(`${EL_SB_URL}/rest/v1/media_assets?${q}`, {
      headers: { apikey: EL_SB_KEY, Authorization: `Bearer ${EL_SB_KEY}` }, cache: 'no-store',
    });
    if (!res.ok) throw new Error(`EL media_assets ${mediaType}: ${res.status} ${await res.text()}`);
    const rows = await res.json();
    out.push(...rows);
    if (rows.length < 1000) break;
  }
  return out;
}
// Canonical Goods consent policy — EL is the source of truth. Hard stops win.
//   red    = sacred-no-publish OR storyteller-withdrawn OR not public (never show)
//   gated  = public AND elder-approved (cleared: funder/press/hero tier)
//   public = public, not yet elder-reviewed (shows on the site)
function elConsentTier(m) {
  if (m.is_sacred_no_publish === true) return 'red';
  if (m.removed_by_storyteller_at) return 'red';
  if (m.visibility !== 'public') return 'red';
  return m.elder_approved === true ? 'gated' : 'public';
}
function elArea(m) {
  const t = (m.cultural_tags || [])[0];
  if (t) return t.includes(':') ? (t.split(':')[1] || t) : t;
  return 'el';
}
const elUrl = (m) => m.cdn_url || m.url || m.large_url || m.medium_url || null;
const elPoster = (m) => m.thumbnail_url || m.medium_url || elUrl(m);

async function syncEl() {
  if (!EL_SB_URL || !EL_SB_KEY) { console.log('el    : skipped (no EMPATHY_LEDGER_SUPABASE_URL/KEY)'); return; }
  const media = [
    ...(await fetchElMediaAssets('image')).map((m) => ({ m, mt: 'image' })),
    ...(await fetchElMediaAssets('video')).map((m) => ({ m, mt: 'video' })),
  ].filter(({ m }) => m && m.id && elUrl(m));
  // Safety: never run the destructive re-sync on an empty/failed fetch (would
  // otherwise flip every EL row to red).
  if (media.length === 0) { console.log('el    : fetch returned 0 Goods media — skipping (no changes)'); return; }

  const existing = new Map();
  for (const r of await fetchExisting('source=eq.el', 'id,ref,url,poster_url,consent_tier,area,media_type')) existing.set(r.ref, r);

  const inserts = []; const patches = [];
  const seenRefs = new Set();
  for (const { m, mt } of media) {
    if (seenRefs.has(m.id)) continue;
    seenRefs.add(m.id);
    const desired = {
      url: elUrl(m), poster_url: elPoster(m),
      media_type: mt,
      consent_tier: elConsentTier(m), area: elArea(m),
      tags: m.cultural_tags || [],
    };
    const cur = existing.get(m.id);
    if (!cur) {
      inserts.push({ source: 'el', ref: m.id, ...desired, width: m.width || null, height: m.height || null, duration_seconds: m.duration || null });
    } else {
      const body = {}; // EL is a mirror: refresh these; leave star/rating/archive alone
      if (cur.url !== desired.url) body.url = desired.url;
      if ((cur.poster_url || null) !== desired.poster_url) body.poster_url = desired.poster_url;
      if (cur.consent_tier !== desired.consent_tier) body.consent_tier = desired.consent_tier;
      if ((cur.area || null) !== desired.area) body.area = desired.area;
      if (cur.media_type !== desired.media_type) body.media_type = desired.media_type;
      if (Object.keys(body).length) patches.push({ id: cur.id, body });
    }
  }
  // Re-sync: any EL row no longer in the Goods feed flips to red (withdrawn or a
  // leaked non-Goods row = default-deny). Non-destructive; leaked-row deletion is
  // a separate, deliberate cleanup (scripts/content-cleanup-leaked-el.mjs).
  let withdrawn = 0;
  for (const [ref, r] of existing) {
    if (!seenRefs.has(ref) && r.consent_tier !== 'red') { await patchById(r.id, { consent_tier: 'red' }); withdrawn += 1; }
  }
  await insertBatch(inserts);
  for (const p of patches) await patchById(p.id, p.body);
  const imgs = media.filter(({ mt }) => mt === 'image').length;
  console.log(`el    : ${media.length} Goods media (${imgs} img · ${media.length - imgs} video) — inserted ${inserts.length}, patched ${patches.length}, absent->red ${withdrawn}`);
}

// ============================================================================
// PASS 4 — link content_items to communities + storytellers (gallery search)
// ============================================================================
async function syncLinks() {
  const get = (p) => fetch(`${REST}/${p}`, { headers: H }).then((r) => (r.ok ? r.json() : []));
  const commIds = new Set((await get('communities?select=id')).map((c) => c.id));
  if (commIds.size === 0) { console.log('links : skipped (no communities table)'); return; }
  const sts = await get('storytellers?select=id,community_id,portrait_content_id&portrait_content_id=not.is.null');
  const stByPortrait = new Map(sts.map((s) => [s.portrait_content_id, s]));
  const items = await get('content_items?source=eq.local&select=id,area,url,community_id,storyteller_id,tags');
  let linked = 0;
  for (const it of items) {
    let community_id = it.community_id;
    let storyteller_id = it.storyteller_id;
    if (!community_id) {
      if (commIds.has(it.area)) community_id = it.area;                    // e.g. area 'utopia' -> community 'utopia'
      else if (/\/utopia[-/]/i.test(it.url) && commIds.has('utopia')) community_id = 'utopia';
      else {
        // manual place tag from the media library / local-image-tags.json,
        // e.g. 'community:tennant-creek' -> community 'tennant-creek'
        const t = (it.tags || []).find((x) => typeof x === 'string' && x.startsWith('community:'));
        const id = t ? t.slice('community:'.length) : null;
        if (id && commIds.has(id)) community_id = id;
      }
    }
    const st = stByPortrait.get(it.id);                                    // this photo IS someone's portrait
    if (st) { storyteller_id = st.id; if (!community_id) community_id = st.community_id; }
    if ((community_id || null) !== (it.community_id || null) || (storyteller_id || null) !== (it.storyteller_id || null)) {
      await patchById(it.id, { community_id: community_id || null, storyteller_id: storyteller_id || null });
      linked += 1;
    }
  }
  console.log(`links : patched ${linked} content_items (community + storyteller)`);
}

// --- run ---------------------------------------------------------------------
await syncLocal();
await syncEl();
await syncLinks();
console.log('done. canon slots mapped:', Object.keys(slotByChecksum).length);
