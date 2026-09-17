#!/usr/bin/env node
/**
 * MEDIA LINKS THAT DO NOT RESOLVE ARE A BUG, NOT A CATEGORY.
 *
 * On 17 September 2026 thirty-seven rows in `media_links` carried a `media_key` pointing at
 * `https://www.empathyledger.com/api/media/<id>/file`. They were labelled `media_source:
 * external`, and that label was enough for two people to walk past them — a link that is
 * supposed to point outside looks the same as one that points nowhere. Twenty-nine of the
 * thirty-seven returned 403 or 400. They were storyteller portraits.
 *
 * The label was never the problem. The absence of a check was. This script fetches every
 * external media_key and fails when one does not resolve, so the next dead portrait is caught
 * on the day it dies instead of the day someone opens the media library and sees a wall of grey.
 *
 *   node scripts/check-media-links.mjs          # report
 *   node scripts/check-media-links.mjs --ci     # exit 1 on any dead link
 *
 * Needs NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in the environment.
 */

const URL_BASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CI = process.argv.includes('--ci');

if (!URL_BASE || !KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(2);
}

/** Only these are fetchable. A relative key or a bare slug is resolved by the app, not by us. */
const isFetchable = (key) => typeof key === 'string' && /^https?:\/\//.test(key);

async function main() {
  const res = await fetch(
    `${URL_BASE}/rest/v1/media_links?select=id,target_type,target_key,media_key,media_source`,
    { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } },
  );
  if (!res.ok) {
    console.error(`Could not read media_links: HTTP ${res.status}`);
    process.exit(2);
  }
  const rows = await res.json();
  const checkable = rows.filter((r) => isFetchable(r.media_key));

  // Bounded concurrency: this runs against someone else's storage, so it stays polite.
  const dead = [];
  const queue = [...checkable];
  await Promise.all(
    Array.from({ length: 8 }, async () => {
      for (let row = queue.pop(); row; row = queue.pop()) {
        let status = 0;
        try {
          const r = await fetch(row.media_key, { method: 'GET', redirect: 'follow' });
          status = r.status;
        } catch {
          status = 0; // network failure reads the same as dead for our purposes
        }
        if (status !== 200) dead.push({ ...row, status });
      }
    }),
  );

  const relative = rows.filter((r) => r.media_key && !isFetchable(r.media_key));
  console.log(`media_links rows          : ${rows.length}`);
  console.log(`fetchable media_key       : ${checkable.length}`);
  console.log(`resolved by the app       : ${relative.length}`);
  console.log(`DEAD                      : ${dead.length}`);

  if (dead.length) {
    console.log('');
    for (const d of dead.sort((a, b) => a.status - b.status)) {
      console.log(`  ${String(d.status).padEnd(4)} ${d.target_type.padEnd(10)} ${d.media_key}`);
    }
    console.log('\nA dead media_key is a photo of a real person that no longer loads.');
    console.log('Look it up in Empathy Ledger media_assets by id and repoint it at storage_path.');
  }

  if (CI && dead.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
