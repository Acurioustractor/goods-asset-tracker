#!/usr/bin/env node
/**
 * WEBSITE → EL migration (2026-07-07). Uploads the ~64 people/community website photos
 * that are NOT already in Empathy Ledger, so they become taggable in the media library.
 * Companion to el-align.mjs (tags people once a photo is in EL).
 *
 * Write shape VERIFIED against the EL codebase (2026-07-07): NOT the intake API (that's
 * a URL-reference importer that auto-grants consent) — a direct service_role Storage
 * upload + media_assets INSERT with a gated-until-cleared posture:
 *   privacy_level='community' (library-visible for tagging) · visibility='private'
 *   (kills the syndication gate) · requires_consent=true · consent flags false.
 * tenant_id trigger-fills from organization_id; alt_text is REQUIRED (image trigger);
 * dedup is our job via file_hash (pre-check + a non-unique partial index exists).
 *
 * Tier-3, storage-backed, consent-sensitive — `apply` is GUARDED (EL_MIGRATE_CONFIRM=1)
 * and the bucket must be chosen explicitly.
 *
 *   node scripts/el-migrate.mjs                          # dry-run: manifest + a sample insert row
 *   node scripts/el-migrate.mjs apply --bucket public    # upload to public 'media' bucket
 *   node scripts/el-migrate.mjs apply --bucket private   # upload to private 'story-media' (revocable)
 *   (apply also needs EL_MIGRATE_CONFIRM=1 ; --limit N to batch)
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const V2 = path.resolve(path.dirname(fileURLPath(import.meta.url)), '..');
function fileURLPath(u) { return decodeURIComponent(new URL(u).pathname); }
for (const l of fs.readFileSync(path.join(V2, '.env.local'), 'utf8').split('\n')) { const m = l.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, ''); }
const URL_ = process.env.EMPATHY_LEDGER_SUPABASE_URL, KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY, PID = process.env.EMPATHY_LEDGER_PROJECT_ID;
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };

// EL-verified constants
const GOODS_ORG = 'c312323e-02d4-493c-8b5f-9f9b15e2b46a'; // → tenant a1adca53 via trigger
const SYSTEM_UPLOADER = '1fea409d-bfeb-4ab4-b1a5-ff9090516677'; // the uploader intake uses
const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };

const SCOPE = process.argv.find((a) => a.endsWith('.json'))
  || '/private/tmp/claude-501/-Users-benknight-Code-Goods-Asset-Register/b29abf54-7ea3-410a-8da7-7d28829ba95b/scratchpad/website-el-scope.json';
if (!fs.existsSync(SCOPE)) { console.error('scope json not found:', SCOPE); process.exit(1); }
const candidates = (JSON.parse(fs.readFileSync(SCOPE, 'utf8')).migrateCandidates) || [];

const flag = (name, def) => { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : def; };
const titleFrom = (rel) => path.basename(rel).replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/** Build the exact media_assets row + storage key for one candidate. */
function buildEntry(rel, bucketMode) {
  const abs = path.join(V2, 'public', 'images', rel);
  const bytes = fs.readFileSync(abs);
  const area = rel.split('/')[0];
  const filename = path.basename(rel);
  const ext = path.extname(rel).toLowerCase();
  const key = `goods/migrated/${rel.replace(/\//g, '__')}`;
  const fileHash = crypto.createHash('sha256').update(bytes).digest('hex');
  const row = {
    original_filename: filename,
    file_size: bytes.length,
    file_type: 'image',
    media_type: 'image',
    mime_type: MIME[ext] || 'image/jpeg',
    storage_bucket: 'media',            // CHECK-valid; bytes may live in story-media (private)
    storage_path: key,
    alt_text: `Goods on Country — ${titleFrom(rel)} (${area})`, // REQUIRED, non-empty
    file_hash: fileHash,
    uploader_id: SYSTEM_UPLOADER,
    organization_id: GOODS_ORG,          // tenant_id auto-fills from this
    project_id: PID,
    project_code: 'goods',
    privacy_level: 'community',          // library-visible to super-admin for tagging
    visibility: 'private',              // kills the syndication gate
    requires_consent: true,             // belt: kills the consent OR-clause
    cultural_sensitivity_level: 'standard',
    processing_status: 'completed',
    ...(bucketMode === 'private' ? { source_url: `story-media/${key}` } : {}),
  };
  const storageBucket = bucketMode === 'private' ? 'story-media' : 'media';
  return { rel, area, bytes, key, storageBucket, fileHash, row };
}

const elGet = async (qs) => { const r = await fetch(`${URL_}/rest/v1/${qs}`, { headers: H }); return r.ok ? r.json() : []; };

// Mis-bucketed in the first run: the whole partners/ folder was treated as
// people-community, but these are LOGOS + a MAP, not person photos. `unmigrate`
// removes them (row + story-media bytes).
const NON_PEOPLE = [
  'partners/amp-foundation.png', 'partners/frrr.png', 'partners/oonchiumpa.png', 'partners/qbe.png',
  'partners/snow-foundation-black.png', 'partners/snow-foundation-mono.png', 'partners/snow-foundation-reverse.png',
  'partners/snow-foundation-white.png', 'partners/snow-foundation.png', 'partners/centrecorp-foundation.jpg',
  'stories/utopia/region-map.png',
].map((rel) => `goods/migrated/${rel.replace(/\//g, '__')}`);

async function run() {
  const cmd = process.argv[2];
  const bucketMode = flag('--bucket', 'private'); // private (story-media, revocable) | public (media, world-readable)

  if (cmd === 'unmigrate') {
    console.log('=== UNMIGRATE mis-bucketed logos/maps ===');
    const all = await elGet('media_assets?storage_path=like.goods/migrated/*&select=id,original_filename,storage_path,source_url');
    const targets = all.filter((r) => NON_PEOPLE.includes(r.storage_path));
    console.log('migrated assets total:', all.length, '| non-people to remove:', targets.length);
    targets.forEach((r) => console.log('  ', r.id.slice(0, 8), r.original_filename));
    if (process.env.EL_MIGRATE_CONFIRM !== '1') { console.log('\n[dry-run] set EL_MIGRATE_CONFIRM=1 to delete these rows + their story-media bytes.'); return; }
    let del = 0;
    for (const r of targets) {
      await fetch(`${URL_}/storage/v1/object/story-media/${r.storage_path}`, { method: 'DELETE', headers: H });
      const d = await fetch(`${URL_}/rest/v1/media_assets?id=eq.${r.id}`, { method: 'DELETE', headers: H });
      console.log(d.ok ? 'deleted' : 'FAIL ' + d.status, r.original_filename); if (d.ok) del += 1;
    }
    console.log(`\ndone: ${del} removed`);
    return;
  }
  const limit = parseInt(flag('--limit', String(candidates.length)), 10);

  // Skip the mis-bucketed logos/maps so a re-run never re-adds them.
  const entries = candidates
    .filter((rel) => !NON_PEOPLE.includes(`goods/migrated/${rel.replace(/\//g, '__')}`))
    .map((rel) => buildEntry(rel, bucketMode))
    .filter(Boolean);
  const byArea = {}; entries.forEach((e) => { byArea[e.area] = (byArea[e.area] || 0) + 1; });

  console.log('=== WEBSITE → EL migration ===');
  console.log('candidates:', entries.length, '| bucket:', bucketMode, bucketMode === 'private' ? '(story-media, revocable)' : '(media, public-read)');
  console.log('by area:', Object.entries(byArea).map(([a, n]) => `${a}:${n}`).join('  '));
  console.log('\nsample media_assets row (photo 1):');
  console.log(JSON.stringify({ ...entries[0].row, file_hash: entries[0].fileHash.slice(0, 12) + '…' }, null, 2));
  console.log('storage: upload bytes to bucket', `"${entries[0].storageBucket}"`, 'at key', `"${entries[0].key}"`);

  if (cmd !== 'apply') {
    console.log('\n[DRY RUN] no writes. To run: EL_MIGRATE_CONFIRM=1 node scripts/el-migrate.mjs apply --bucket <public|private>');
    return;
  }
  if (process.env.EL_MIGRATE_CONFIRM !== '1') {
    console.log('\n[apply BLOCKED] set EL_MIGRATE_CONFIRM=1 to write to live EL. Tier-3, consent-sensitive.');
    return;
  }

  let created = 0, skipped = 0, failed = 0;
  for (const e of entries.slice(0, limit)) {
    const ex = await elGet(`media_assets?file_hash=eq.${e.fileHash}&select=id`);
    if (ex.length) { console.log('skip (already in EL):', e.rel); skipped += 1; continue; }
    // 1. upload bytes
    const up = await fetch(`${URL_}/storage/v1/object/${e.storageBucket}/${e.key}`, {
      method: 'POST', headers: { ...H, 'x-upsert': 'true', 'Content-Type': e.row.mime_type }, body: e.bytes,
    });
    if (!up.ok) { console.log('UPLOAD FAIL', e.rel, up.status, (await up.text()).slice(0, 120)); failed += 1; continue; }
    // 2. insert row
    const ins = await fetch(`${URL_}/rest/v1/media_assets`, {
      method: 'POST', headers: { ...H, 'Content-Type': 'application/json', Prefer: 'return=representation' }, body: JSON.stringify(e.row),
    });
    if (!ins.ok) { console.log('INSERT FAIL', e.rel, ins.status, (await ins.text()).slice(0, 160)); failed += 1; continue; }
    const [made] = await ins.json();
    console.log('created', made?.id, '<-', e.rel);
    created += 1;
  }
  console.log(`\ndone: ${created} created, ${skipped} skipped, ${failed} failed`);
}

run();
