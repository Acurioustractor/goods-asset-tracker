#!/usr/bin/env node
/**
 * CONTENT INDEX — Phase 0 of the content system.
 *
 * Walks public/images/** and upserts one row per unique image into the Goods DB
 * `content_items` table (the unified curation index). Run it after dropping new
 * images in, or before a cull session, so the gallery has a row to hang star /
 * rating / archive on for every image.
 *
 * Design: wiki/outputs/2026-07-03-content-system-design.md
 *
 * Identity is the content CHECKSUM (md5), not the path — so archiving (which
 * moves the file) never orphans a row. Re-running this is SAFE: it only inserts
 * new images and patches crawl-derived columns (ref/url/area/canon_slot) on
 * existing rows. It NEVER overwrites curation columns (starred, rating,
 * archived_at, tags) — your cull survives a re-index.
 *
 * Writes via PostgREST with the service role key (bypasses RLS). Read-only on
 * the filesystem. Run from v2/:  node scripts/content-index.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// --- env (parse v2/.env.local; no dependency on dotenv) ----------------------
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
  } catch { /* fall through to process.env */ }
  return env;
}
const env = loadEnv('.env.local');
const SB_URL = (env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const SB_KEY = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
if (!SB_URL || !SB_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in v2/.env.local');
  process.exit(1);
}
if (!SB_URL.includes('cwsyhpiuepvdjtxaozwf')) {
  console.error(`Refusing to run: NEXT_PUBLIC_SUPABASE_URL is not the Goods project (${SB_URL}).`);
  process.exit(1);
}
const REST = `${SB_URL}/rest/v1`;
const H = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' };

// --- walk public/images, dedup like getLocalImages(), checksum each ----------
const IMG_RE = /\.(jpe?g|png|webp)$/i;
const imagesRoot = path.join(process.cwd(), 'public', 'images');

let dedup = {};
try { dedup = JSON.parse(fs.readFileSync('data/image-dedup.json', 'utf8')); } catch { /* none */ }
const aliasUrls = new Set();
for (const arr of Object.values(dedup)) for (const a of arr) aliasUrls.add(a);

const files = [];              // { url, area, filename, checksum }
const seenMd5 = new Set();
let md5Collisions = 0;
function walk(dir, rel) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const childRel = [...rel, e.name];
    const full = path.join(dir, e.name);
    if (e.isDirectory()) { walk(full, childRel); continue; }
    if (!e.isFile() || !IMG_RE.test(e.name)) continue;
    const url = '/images/' + childRel.join('/');
    if (aliasUrls.has(url)) continue;                 // a known byte-dup of a canonical file
    const md5 = crypto.createHash('md5').update(fs.readFileSync(full)).digest('hex');
    if (seenMd5.has(md5)) { md5Collisions++; continue; } // dup not in dedup.json — skip, keep checksum unique
    seenMd5.add(md5);
    files.push({ url, area: rel.length ? rel[0] : 'root', filename: e.name, checksum: md5 });
  }
}
walk(imagesRoot, []);

// --- subject tags + canon-slot picks ----------------------------------------
let savedTags = {};
try { savedTags = JSON.parse(fs.readFileSync('data/local-image-tags.json', 'utf8')); } catch { /* none */ }

const slotByUrl = {};
try {
  const canon = JSON.parse(fs.readFileSync('../design/image-canon.json', 'utf8'));
  for (const im of canon.images || []) {
    if (!im.canonicalPath || !im.slot) continue;
    const p = im.canonicalPath;
    if (p.startsWith('v2/public/images/')) slotByUrl['/images/' + p.slice('v2/public/images/'.length)] = im.slot;
    else if (p.startsWith('public/images/')) slotByUrl['/images/' + p.slice('public/images/'.length)] = im.slot;
  }
} catch { /* none */ }

// Consent: default-deny leans safe. People portraits are gated (need a name +
// clearance check in Phase 2); everything else is already-public web imagery.
const consentFor = (area) => (area === 'people' ? 'gated' : 'public');
const subtypeFor = (area, filename) =>
  area === 'people' ? 'portrait' : (area === 'brand' && /logo/i.test(filename) ? 'logo' : null);

// --- existing rows (keyed by checksum) --------------------------------------
async function getExisting() {
  const res = await fetch(`${REST}/content_items?source=eq.local&select=id,checksum,ref,url,area,canon_slot`, { headers: H });
  if (!res.ok) throw new Error(`fetch existing failed: ${res.status} ${await res.text()}`);
  const byChecksum = new Map();
  for (const r of await res.json()) byChecksum.set(r.checksum, r);
  return byChecksum;
}

const existing = await getExisting();
const inserts = [];
const patches = [];
for (const f of files) {
  const canon_slot = slotByUrl[f.url] || null;
  const cur = existing.get(f.checksum);
  if (!cur) {
    inserts.push({
      source: 'local', ref: f.url, url: f.url, media_type: 'image', checksum: f.checksum,
      area: f.area, tags: savedTags[f.url] || [], canon_slot,
      consent_tier: consentFor(f.area), media_subtype: subtypeFor(f.area, f.filename),
    });
  } else {
    const body = {};                                   // crawl-derived columns ONLY
    if (cur.ref !== f.url) body.ref = f.url;
    if (cur.url !== f.url) body.url = f.url;
    if (cur.area !== f.area) body.area = f.area;
    if ((cur.canon_slot || null) !== canon_slot) body.canon_slot = canon_slot;
    if (Object.keys(body).length) patches.push({ id: cur.id, body });
  }
}

async function insertBatch(rows) {
  for (let i = 0; i < rows.length; i += 200) {
    const chunk = rows.slice(i, i + 200);
    const res = await fetch(`${REST}/content_items`, {
      method: 'POST', headers: { ...H, Prefer: 'return=minimal' }, body: JSON.stringify(chunk),
    });
    if (!res.ok) throw new Error(`insert failed: ${res.status} ${await res.text()}`);
  }
}
async function patchOne(id, body) {
  const res = await fetch(`${REST}/content_items?id=eq.${id}`, {
    method: 'PATCH', headers: { ...H, Prefer: 'return=minimal' }, body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`patch ${id} failed: ${res.status} ${await res.text()}`);
}

await insertBatch(inserts);
for (const p of patches) await patchOne(p.id, p.body);

console.log(`content-index: ${files.length} unique local images under public/images/`);
console.log(`  inserted ${inserts.length} new · patched ${patches.length} (crawl cols only) · ${existing.size} already indexed`);
console.log(`  ${Object.keys(slotByUrl).length} canon-slot picks flagged${md5Collisions ? ` · ${md5Collisions} byte-dups skipped (not in image-dedup.json)` : ''}`);
