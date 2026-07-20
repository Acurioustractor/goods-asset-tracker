// Align media_links media_keys to servable references. The starred-manifest
// backfill stored media_key as a local repo path under design/starred-images/,
// which is gitignored and NOT web-servable (design/ is not under v2/public).
// The manifest maps each starred file to a servable url (a /images/... public
// path or an Empathy Ledger media url). This sweep re-points every
// design/starred-images media_key to that servable url so the product,
// community and Atlas pages can actually render it — in production, not just
// where the local manifest happens to exist.
//
//   /images|/video path  -> keep media_source=local, media_key=path
//   https://... url       -> media_source=external, media_key=url
//
// Only touches rows whose media_key starts with design/starred-images/. Verifies
// each /images target exists on disk before re-pointing (never creates a broken
// link). Dry-run by default; apply with --apply.

import fs from 'node:fs';
import path from 'node:path';

const APPLY = process.argv.includes('--apply');
const URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/"/g, '').trim();
const KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/"/g, '').trim();
if (!URL || !KEY) { console.error('Missing Goods Supabase env'); process.exit(1); }
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };
const ROOT = path.resolve(import.meta.dirname, '../..');
const PUBLIC = path.resolve(import.meta.dirname, '../public');

async function rest(p, init) {
  const res = await fetch(`${URL}/rest/v1/${p}`, { headers: H, ...init });
  const t = await res.text();
  return { ok: res.ok, status: res.status, body: t ? JSON.parse(t) : null };
}

// Build basename -> servable url from the starred manifest.
const manifestPath = path.join(ROOT, 'design/starred-images/_manifest.csv');
if (!fs.existsSync(manifestPath)) { console.error('manifest not found:', manifestPath); process.exit(1); }
const [header, ...lines] = fs.readFileSync(manifestPath, 'utf8').trim().split('\n');
const cols = header.split(',');
const iFile = cols.indexOf('filename');
const iUrl = cols.indexOf('url');
const urlByFile = new Map();
for (const line of lines) {
  const v = line.split(',');
  const file = v[iFile];
  // url may itself contain commas? manifest urls have none today; take the last field.
  const url = v[v.length - 1];
  if (file && url) urlByFile.set(file.trim(), url.trim());
}
console.log(`manifest: ${urlByFile.size} filename->url entries`);

const rows = (await rest('media_links?select=id,media_source,media_key,target_type,target_key&media_source=eq.local&media_key=like.design/starred-images/*')).body || [];
console.log(`${rows.length} local design/ media_links to align\n`);

let repointed = 0, missing = 0, notfound = 0;
for (const r of rows) {
  const base = r.media_key.split('/').pop();
  const url = urlByFile.get(base);
  if (!url) { console.warn(`  ? no manifest url for ${base}`); notfound++; continue; }

  let newSource, newKey;
  if (url.startsWith('/')) {
    // servable public path — verify the file exists before pointing at it
    const abs = path.join(PUBLIC, url);
    if (!fs.existsSync(abs)) { console.warn(`  ! target missing on disk: ${url}`); missing++; continue; }
    newSource = 'local';
    newKey = url;
  } else if (url.startsWith('http')) {
    newSource = 'external';
    newKey = url;
  } else {
    console.warn(`  ? unrecognised manifest url: ${url}`); notfound++; continue;
  }

  console.log(`REPOINT ${r.target_type}:${r.target_key}  ${base}\n        -> ${newSource}:${newKey}`);
  if (APPLY) {
    const upd = await rest(`media_links?id=eq.${r.id}`, {
      method: 'PATCH',
      headers: { ...H, Prefer: 'return=minimal' },
      body: JSON.stringify({ media_source: newSource, media_key: newKey }),
    });
    if (!upd.ok && upd.status === 409) {
      // the servable link already exists (duplicate) — drop this now-redundant row
      await rest(`media_links?id=eq.${r.id}`, { method: 'DELETE' });
      console.log('        (servable link already existed; removed duplicate)');
    } else if (!upd.ok) {
      console.warn(`        ! failed ${upd.status}: ${JSON.stringify(upd.body)}`);
    }
  }
  repointed++;
}

console.log(`\n${APPLY ? 'APPLIED' : 'DRY-RUN'}: ${repointed} re-pointed, ${missing} target-missing, ${notfound} no-manifest.`);
if (!APPLY) console.log('Re-run with --apply to write.');
