#!/usr/bin/env node
/**
 * REPOINT DEAD EMPATHY LEDGER MEDIA LINKS AT THE OBJECT THEY ACTUALLY LIVE IN.
 *
 * The dead `media_key` values found by check-media-links.mjs all share one shape:
 * `https://www.empathyledger.com/api/media/<uuid>/file`. That is the EL *app's* download route,
 * and it 403s for anyone who is not signed in to EL. The bytes are fine; the address was wrong.
 * Every one of those uuids is a row in EL's `media_assets`, which carries the real
 * `storage_path` inside the `story-media` bucket, and that bucket serves anonymously.
 *
 * So the repair is a lookup, not a migration: read the id out of the dead URL, find its
 * storage_path in EL, and write back the storage URL. Nothing is invented and nothing is
 * deleted — if a uuid has no row in EL, or its rebuilt URL does not return 200, that row is left
 * exactly as it is and reported, because a link we cannot verify is worse than one we know is
 * broken.
 *
 *   node scripts/repair-media-links.mjs            # dry run, prints the plan
 *   node scripts/repair-media-links.mjs --write    # apply, after writing a rollback file
 *
 * Needs NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, EMPATHY_LEDGER_SUPABASE_URL and
 * EMPATHY_LEDGER_SUPABASE_KEY. Writes rollback to scripts/.media-links-rollback.json.
 */

import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const U = process.env.NEXT_PUBLIC_SUPABASE_URL;
const K = process.env.SUPABASE_SERVICE_ROLE_KEY;
const EU = process.env.EMPATHY_LEDGER_SUPABASE_URL;
const EK = process.env.EMPATHY_LEDGER_SUPABASE_KEY;
const WRITE = process.argv.includes('--write');

if (!U || !K || !EU || !EK) {
  console.error('Missing Goods or Empathy Ledger Supabase credentials.');
  process.exit(2);
}

const ROLLBACK = join(dirname(fileURLToPath(import.meta.url)), '.media-links-rollback.json');
const BUCKET = `${EU}/storage/v1/object/public/story-media/`;
const EL_APP_MEDIA = /^https?:\/\/[^/]*empathyledger\.com\/api\/media\/([0-9a-f-]{36})\/file$/i;

/**
 * The second shape: a Supabase storage URL that names the wrong bucket. One row pointed at
 * `/object/public/media/projects/…`, which returns 400 — the same object is served by
 * `story-media`. The object path is right, only the bucket was wrong, so the repair is the same
 * lookup-and-verify: rebuild under story-media and keep it only if it returns 200.
 */
const EL_STORAGE_OBJECT = /\/storage\/v1\/object\/public\/[^/]+\/(.+)$/;

const goods = (path, init) =>
  fetch(`${U}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: K, Authorization: `Bearer ${K}`, ...(init?.headers ?? {}) },
  });

async function main() {
  const rows = await (await goods('media_links?select=id,media_key,media_source')).json();
  const candidates = rows
    .map((r) => ({ row: r, id: (r.media_key ?? '').match(EL_APP_MEDIA)?.[1] }))
    .filter((c) => c.id);

  // Wrong-bucket storage URLs, only when the object really is unreachable as written.
  const misbucketed = [];
  for (const r of rows) {
    const key = r.media_key ?? '';
    if (!key.includes('/storage/v1/object/public/')) continue;
    const path = key.match(EL_STORAGE_OBJECT)?.[1];
    if (!path || key.includes('/public/story-media/')) continue;
    const live = await fetch(key).then((x) => x.status === 200).catch(() => false);
    if (live) continue;
    misbucketed.push({ row: r, path: decodeURI(path) });
  }

  if (!candidates.length && !misbucketed.length) {
    console.log('No Empathy Ledger media links left to repair.');
    return;
  }

  const ids = [...new Set(candidates.map((c) => c.id))];
  const res = await fetch(`${EU}/rest/v1/media_assets?select=id,storage_path&id=in.(${ids.join(',')})`, {
    headers: { apikey: EK, Authorization: `Bearer ${EK}` },
  });
  const assets = await res.json();
  const pathById = new Map(assets.filter((a) => a.storage_path).map((a) => [a.id, a.storage_path]));

  const plan = [];
  const skipped = [];
  for (const { row, id } of candidates) {
    const storagePath = pathById.get(id);
    if (!storagePath) {
      skipped.push({ row, why: 'no row in Empathy Ledger media_assets' });
      continue;
    }
    const next = BUCKET + encodeURI(storagePath);
    const ok = await fetch(next, { method: 'GET' }).then((r) => r.status === 200).catch(() => false);
    if (!ok) {
      skipped.push({ row, why: 'rebuilt url did not return 200' });
      continue;
    }
    plan.push({ id: row.id, old: row.media_key, new: next });
  }

  for (const { row, path } of misbucketed) {
    const next = BUCKET + encodeURI(path);
    const ok = await fetch(next, { method: 'GET' }).then((r) => r.status === 200).catch(() => false);
    if (!ok) {
      skipped.push({ row, why: 'wrong bucket, and story-media did not serve it either' });
      continue;
    }
    plan.push({ id: row.id, old: row.media_key, new: next });
  }

  console.log(`candidates : ${candidates.length}`);
  console.log(`repairable : ${plan.length}`);
  console.log(`skipped    : ${skipped.length}`);
  for (const s of skipped) console.log(`   SKIP ${s.why} — ${s.row.media_key}`);

  if (!WRITE) {
    console.log('\nDry run. Re-run with --write to apply.');
    return;
  }

  writeFileSync(ROLLBACK, JSON.stringify(plan, null, 1));
  console.log(`\nRollback written to ${ROLLBACK}`);

  let ok = 0;
  for (const p of plan) {
    const r = await goods(`media_links?id=eq.${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      // `media_source` carries a check constraint: local | el_media | external. An earlier cut
      // wrote 'el-storage' and every row was rejected with 23514. These rows ARE Empathy Ledger
      // media and always were — 'external' only ever described the dead app URL, not the photo.
      body: JSON.stringify({ media_key: p.new, media_source: 'el_media' }),
    });
    if (r.ok) ok += 1;
    else console.error(`  FAILED ${r.status} ${p.id}`);
  }
  console.log(`updated ${ok} of ${plan.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
