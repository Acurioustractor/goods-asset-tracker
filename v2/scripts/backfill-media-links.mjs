// Backfill media_links from the three structured sources:
//   1. design/starred-images/_manifest.csv  (person / community / canon_slot columns)
//   2. v2/data/local-image-tags.json        (community:* tags)
//   3. Empathy Ledger media_storytellers junction (photo -> storyteller)
//
// Dry-run by default: prints what it would insert plus unresolved names.
// Run with --apply to write. Requires the media_links table
// (scripts/migrations/2026-07-20-media-links.sql) to be applied first.
//
//   node --env-file=.env.local scripts/backfill-media-links.mjs [--apply]

import fs from 'node:fs';
import path from 'node:path';

const APPLY = process.argv.includes('--apply');
const ROOT = path.resolve(import.meta.dirname, '../..');
const URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/"/g, '');
const KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/"/g, '');
const EL_URL = (process.env.EMPATHY_LEDGER_SUPABASE_URL || '').replace(/"/g, '');
const EL_KEY = (process.env.EMPATHY_LEDGER_SUPABASE_KEY || '').replace(/"/g, '');
if (!URL || !KEY) { console.error('Missing Goods Supabase env'); process.exit(1); }

const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };
async function goods(pathq, init) {
  const res = await fetch(`${URL}/rest/v1/${pathq}`, { headers: H, ...init });
  if (!res.ok) throw new Error(`${pathq}: ${res.status} ${await res.text()}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

// --- resolve targets ---------------------------------------------------------
const contacts = await goods('crm_contacts?select=id,name');
const contactByName = new Map(contacts.map((c) => [norm(c.name), c.id]));
const communities = await goods('communities?select=id,name');
const communityByName = new Map();
for (const c of communities) {
  communityByName.set(norm(c.name), c.id);
  communityByName.set(norm(c.name).split(' ')[0], c.id); // "tennant" -> Tennant Creek
}
const resolvePerson = (name) => contactByName.get(norm(name)) || null;
const resolveCommunity = (name) => communityByName.get(norm(name)) || communityByName.get(norm(name).split(' ')[0]) || null;

const rows = [];
const unresolved = [];
// Every row carries the same key set (PostgREST bulk insert requires it).
const add = (r) => rows.push({ relation: 'shows', consent_status: 'unknown', title: null, notes: null, ...r });

// --- 1. starred manifest -----------------------------------------------------
const manifestPath = path.join(ROOT, 'design/starred-images/_manifest.csv');
if (fs.existsSync(manifestPath)) {
  const [header, ...lines] = fs.readFileSync(manifestPath, 'utf8').trim().split('\n');
  const cols = header.split(',');
  for (const line of lines) {
    // naive CSV split is fine: the manifest has no quoted commas today
    const v = Object.fromEntries(line.split(',').map((x, i) => [cols[i], x]));
    const media = v.source === 'el' && v.ref
      ? { media_source: 'el_media', media_key: v.ref }
      : { media_source: 'local', media_key: `design/starred-images/${v.filename}` };
    const base = { ...media, media_type: v.media_type === 'video' ? 'video' : 'photo', title: v.filename, source: 'starred-manifest' };
    if (v.person) {
      const id = resolvePerson(v.person);
      if (id) add({ ...base, target_type: 'person', target_key: id });
      else unresolved.push(`person "${v.person}" (${v.filename})`);
    }
    if (v.community) {
      const id = resolveCommunity(v.community);
      if (id) add({ ...base, target_type: 'community', target_key: id, relation: 'taken_at' });
      else unresolved.push(`community "${v.community}" (${v.filename})`);
    }
    if (v.canon_slot) add({ ...base, target_type: 'story', target_key: v.canon_slot, relation: 'about', notes: 'canon slot' });
  }
} else console.log('starred manifest not found (gitignored, local-only) — skipping source 1');

// --- 2. local image tags -----------------------------------------------------
const tagsPath = path.join(ROOT, 'v2/data/local-image-tags.json');
if (fs.existsSync(tagsPath)) {
  const tags = JSON.parse(fs.readFileSync(tagsPath, 'utf8'));
  for (const [img, tagList] of Object.entries(tags)) {
    for (const t of tagList) {
      const [kind, key] = t.split(':');
      if (kind === 'community') {
        const id = resolveCommunity(key.replace(/-/g, ' '));
        if (id) add({ media_source: 'local', media_key: `v2/public${img}`, media_type: 'photo', target_type: 'community', target_key: id, relation: 'taken_at', source: 'local-image-tags' });
        else unresolved.push(`community tag "${key}" (${img})`);
      }
      if (kind === 'person') {
        const id = resolvePerson(key.replace(/-/g, ' '));
        if (id) add({ media_source: 'local', media_key: `v2/public${img}`, media_type: 'photo', target_type: 'person', target_key: id, source: 'local-image-tags' });
        else unresolved.push(`person tag "${key}" (${img})`);
      }
    }
  }
}

// --- 3. EL media_storytellers junction --------------------------------------
if (EL_URL && EL_KEY) {
  try {
    const elH = { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` };
    const GOODS_PROJECT = '6bd47c8a-e676-456f-aa25-ddcbb5a31047';
    const res = await fetch(`${EL_URL}/rest/v1/media_storytellers?select=media_asset_id,storyteller_id,consent_status,storytellers(display_name),media_assets!inner(project_id)&media_assets.project_id=eq.${GOODS_PROJECT}&limit=2000`, { headers: elH });
    if (!res.ok) throw new Error(`EL: ${res.status} ${await res.text()}`);
    for (const j of await res.json()) {
      const name = j.storytellers?.display_name;
      const id = name ? resolvePerson(name) : null;
      if (id) add({ media_source: 'el_media', media_key: j.media_asset_id, media_type: 'photo', target_type: 'person', target_key: id, source: 'el-media-storytellers', consent_status: j.consent_status === 'granted' ? 'cleared' : 'unknown' });
      else unresolved.push(`EL storyteller "${name || j.storyteller_id}"`);
    }
  } catch (e) { console.log('EL junction skipped:', e.message); }
} else console.log('EL env missing — skipping source 3');

// --- dedupe + report ---------------------------------------------------------
const seen = new Set();
const unique = rows.filter((r) => {
  const k = [r.media_source, r.media_key, r.target_type, r.target_key, r.relation].join('|');
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});
console.log(`\n${unique.length} links ready (${rows.length - unique.length} dupes dropped)`);
const byType = {};
for (const r of unique) byType[`${r.target_type}`] = (byType[r.target_type] || 0) + 1;
console.log('by target:', byType);
if (unresolved.length) console.log(`\n${unresolved.length} unresolved (fix names or add crm rows):\n  ` + [...new Set(unresolved)].slice(0, 40).join('\n  '));

if (!APPLY) { console.log('\nDRY RUN — rerun with --apply to insert.'); process.exit(0); }
for (let i = 0; i < unique.length; i += 100) {
  await goods('media_links?on_conflict=media_source,media_key,target_type,target_key,relation', {
    method: 'POST',
    headers: { ...H, Prefer: 'resolution=ignore-duplicates' },
    body: JSON.stringify(unique.slice(i, i + 100)),
  });
}
console.log('INSERTED.');
