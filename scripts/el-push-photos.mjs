#!/usr/bin/env node
/**
 * Empathy Ledger push for tagged photos — schema CONFIRMED 2026-06-03. DRY RUN by default.
 *
 *   node scripts/el-push-photos.mjs [path-to-goods-photo-tags.json]
 *
 * Maps the exported tags (goods-photo-tags.json from photo-video-review.html) onto the real
 * EL `media_assets` columns and resolves storyteller_id from display_name.
 *
 *   tag        -> media_assets column
 *   subject    -> title / alt_text / caption
 *   product+theme+kind -> cultural_tags (text[])
 *   location   -> location_name        lat/lng -> latitude / longitude (numeric)
 *   storyteller-> storyteller_id (resolved from storytellers.display_name; multiples via media_storytellers)
 *   hero       -> is_featured          project -> project_id (6bd47c8a-…) + project_code
 *
 * !!! WHY --apply IS NOT WIRED YET (Tier-3, needs sign-off): media_assets is STORAGE-BACKED.
 * Its required-on-insert columns are: original_filename, file_size, file_type, storage_bucket,
 * storage_path, cultural_sensitivity_level, privacy_level, tenant_id, uploader_id (+ booleans).
 * So a clean push must UPLOAD each image into EL storage (or use EL's media-import flow) and
 * supply a tenant_id + uploader profile — not a bare metadata insert against external URLs.
 * Decide upload-vs-import + tenant/uploader, then wire writes and TEST on one photo first.
 *
 * EL creds read from v2/.env.local (EMPATHY_LEDGER_SUPABASE_URL/KEY, _PROJECT_ID, _PROJECT_CODE).
 */
import fs from 'node:fs';

function loadEnv() {
  const t = fs.readFileSync(new URL('../v2/.env.local', import.meta.url), 'utf8');
  const g = (k) => (t.match(new RegExp('^' + k + '=(.*)$', 'm')) || [])[1]?.replace(/["'\r ]/g, '') || '';
  return { URL: g('EMPATHY_LEDGER_SUPABASE_URL'), KEY: g('EMPATHY_LEDGER_SUPABASE_KEY'),
           PROJECT_ID: g('EMPATHY_LEDGER_PROJECT_ID'), PROJECT_CODE: g('EMPATHY_LEDGER_PROJECT_CODE') || 'goods-on-country' };
}
const env = loadEnv();
const SITE = 'https://www.goodsoncountry.com/';
const file = process.argv[2] || 'goods-photo-tags.json';
if (!fs.existsSync(file)) { console.error('Export not found:', file, '\nExport your tags from photo-video-review.html first (Tags JSON).'); process.exit(1); }
const tags = JSON.parse(fs.readFileSync(file, 'utf8'));

async function elGet(q) {
  const r = await fetch(env.URL + '/rest/v1/' + q, { headers: { apikey: env.KEY, Authorization: 'Bearer ' + env.KEY } });
  return r.ok ? r.json() : [];
}
const stCache = {};
async function storytellerId(name) {
  if (!name) return null;
  if (name in stCache) return stCache[name];
  const rows = await elGet('storytellers?display_name=eq.' + encodeURIComponent(name) + '&select=id&limit=1');
  return (stCache[name] = rows[0]?.id || null);
}

function payload(t, stId) {
  return {
    project_id: env.PROJECT_ID, project_code: env.PROJECT_CODE,
    url: SITE + t.file, source_url: SITE + t.file, source_type: 'goods-website', media_type: 'image',
    title: t.subject || null, alt_text: t.subject || null, caption: t.subject || null,
    cultural_tags: [t.product, t.theme, t.kind].filter(Boolean),
    location_name: t.location || null,
    latitude: t.lat ? Number(t.lat) : null, longitude: t.lng ? Number(t.lng) : null,
    storyteller_id: stId, is_featured: !!t.hero, consent_obtained: true,
    // NOTE: still missing required storage fields (storage_bucket/path, file_size, original_filename,
    // file_type, tenant_id, uploader_id) — supplied by the upload/import step, not here.
  };
}

if (process.argv.includes('--apply')) {
  console.error('REFUSING --apply: media_assets is storage-backed (requires upload + tenant_id + uploader_id).\n' +
    'Choose upload-vs-import, supply tenant/uploader, wire writes with sign-off, and TEST on one photo first.');
  process.exit(1);
}

const out = [];
for (const t of tags) {
  if (!(t.storyteller || t.location || t.product || t.hero)) continue;
  out.push(payload(t, await storytellerId(t.storyteller)));
}
process.stdout.write(JSON.stringify(out, null, 2) + '\n');
console.error(`\nDRY RUN: ${out.length} EL media payloads from ${tags.length} tagged photos (storyteller_ids resolved live). No writes performed.`);
