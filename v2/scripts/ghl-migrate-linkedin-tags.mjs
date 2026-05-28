#!/usr/bin/env node
/**
 * Migrate `goods-li-*` and `goods-linkedin-*` tags into the
 * `Goods · LinkedIn Tags` MULTIPLE_OPTIONS custom field.
 *
 * Strategy (safe):
 *   1. Paginate all contacts in the GHL location.
 *   2. For each contact with at least one LinkedIn-prefixed tag:
 *       a. GET the contact to read its existing customFields array.
 *       b. Merge in the LinkedIn field with the derived multi-value set.
 *       c. PUT contact with `{customFields: <merged array>}` ONLY.
 *          We deliberately omit `tags` from the PUT so existing tags stay put.
 *       d. DELETE the old LinkedIn tags via the dedicated
 *          `/contacts/{id}/tags` endpoint (does not touch other tags).
 *   3. (Optional) DELETE the now-orphaned tags from the location.
 *
 * Why GET-merge-PUT?
 *   GHL's contact PUT replaces the entire customFields array. If you PUT with
 *   just the LinkedIn field, you'd wipe every other custom field on the
 *   contact (Community, Order Number, Goods · Asset ID, …). The GET-merge-PUT
 *   pattern preserves all existing fields.
 *
 * Why dedicated /tags endpoints?
 *   Same reason — PUT with `tags: [...]` replaces, while POST/DELETE on
 *   `/contacts/{id}/tags` adds/removes without touching the rest.
 *
 * Usage:
 *   node scripts/ghl-migrate-linkedin-tags.mjs              # dry-run
 *   node scripts/ghl-migrate-linkedin-tags.mjs --execute    # writes to GHL
 *   node scripts/ghl-migrate-linkedin-tags.mjs --execute --delete-tags --limit=1   # test on 1 contact first
 */

import fs from 'node:fs';
import path from 'node:path';

const ENV_PATH = path.join(process.cwd(), '.env.local');
if (fs.existsSync(ENV_PATH)) {
  for (const line of fs.readFileSync(ENV_PATH, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const TOKEN = process.env.GHL_API_KEY;
const LOC = process.env.GHL_LOCATION_ID;
const BASE = 'https://services.leadconnectorhq.com';
const VERSION = '2021-07-28';
const FIELD_ID = '1V8IGG8wEyZ3cKV2m3F9'; // Goods · LinkedIn Tags
const THROTTLE_MS = 1200;
const PAGE_LIMIT = 100;

const EXECUTE = process.argv.includes('--execute');
const DELETE_TAGS = process.argv.includes('--delete-tags');
const LIMIT_FLAG = process.argv.find((a) => a.startsWith('--limit='));
const LIMIT = LIMIT_FLAG ? parseInt(LIMIT_FLAG.split('=')[1], 10) : null;

if (!TOKEN || !LOC) {
  console.error('Missing GHL_API_KEY or GHL_LOCATION_ID in .env.local');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Version: VERSION,
  'Content-Type': 'application/json',
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function tagToValue(tag) {
  const stem = tag.startsWith('goods-linkedin-')
    ? tag.slice('goods-linkedin-'.length)
    : tag.startsWith('goods-li-')
      ? tag.slice('goods-li-'.length)
      : null;
  if (!stem) return null;
  return stem.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join(' ');
}

async function ghl(method, urlPath, body) {
  const res = await fetch(`${BASE}${urlPath}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${urlPath} → ${res.status}: ${text}`);
  }
  return res.json();
}

async function fetchAllContacts() {
  const all = [];
  let searchAfter = null;
  let page = 0;
  while (true) {
    page += 1;
    const body = {
      locationId: LOC,
      pageLimit: PAGE_LIMIT,
      ...(searchAfter ? { searchAfter } : {}),
    };
    const data = await ghl('POST', '/contacts/search', body);
    const contacts = data.contacts || [];
    all.push(...contacts);
    console.log(`  page ${page}: +${contacts.length} (total ${all.length}/${data.total ?? '?'})`);
    if (contacts.length < PAGE_LIMIT) break;
    searchAfter = contacts[contacts.length - 1].searchAfter || contacts[contacts.length - 1].id;
    await sleep(THROTTLE_MS);
  }
  return all;
}

async function migrateContact(contactId, liTags, newValues) {
  // Step 1: GET full contact to read existing customFields.
  const fresh = await ghl('GET', `/contacts/${contactId}`);
  const existing = fresh.contact?.customFields || [];

  // Step 2: Merge — drop any prior entry for FIELD_ID, then append.
  const merged = existing.filter((f) => f.id !== FIELD_ID);
  merged.push({ id: FIELD_ID, field_value: newValues });

  // Step 3: PUT with ONLY customFields. No tags, no other top-level fields.
  await sleep(THROTTLE_MS);
  await ghl('PUT', `/contacts/${contactId}`, { customFields: merged });

  // Step 4: Remove old LinkedIn tags via dedicated endpoint.
  await sleep(THROTTLE_MS);
  await ghl('DELETE', `/contacts/${contactId}/tags`, { tags: liTags });
}

async function main() {
  console.log(`Mode: ${EXECUTE ? 'EXECUTE (writes)' : 'DRY-RUN'}${LIMIT ? ` · limit=${LIMIT}` : ''}`);
  console.log('Fetching all contacts...');
  const contacts = await fetchAllContacts();
  console.log(`Total: ${contacts.length}\n`);

  const affected = contacts.filter((c) =>
    (c.tags || []).some((t) => t.startsWith('goods-linkedin-') || t.startsWith('goods-li-'))
  );
  console.log(`Affected: ${affected.length}\n`);

  const plan = [];
  const byTag = {};
  for (const c of affected) {
    const liTags = (c.tags || []).filter((t) => t.startsWith('goods-linkedin-') || t.startsWith('goods-li-'));
    const newValues = [...new Set(liTags.map(tagToValue).filter(Boolean))];
    plan.push({ id: c.id, email: c.email || '', liTags, newValues });
    for (const t of liTags) byTag[t] = (byTag[t] || 0) + 1;
  }

  console.log('Tag → contact count:');
  for (const [tag, n] of Object.entries(byTag).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${tag.padEnd(45)} ${n}`);
  }
  console.log();

  if (!EXECUTE) {
    console.log('DRY-RUN. Re-run with --execute to migrate.');
    return;
  }

  const target = LIMIT ? plan.slice(0, LIMIT) : plan;
  console.log(`Migrating ${target.length}/${plan.length} contacts (throttle ${THROTTLE_MS}ms)...\n`);
  let ok = 0, fail = 0;
  for (const [i, p] of target.entries()) {
    try {
      await migrateContact(p.id, p.liTags, p.newValues);
      ok += 1;
      console.log(`  [${i + 1}/${target.length}] ok: ${p.email || p.id} · set ${p.newValues.length} values, removed ${p.liTags.length} tags`);
    } catch (err) {
      fail += 1;
      console.error(`  [${i + 1}/${target.length}] FAIL ${p.id} (${p.email}): ${err.message}`);
    }
  }
  console.log(`\nMigration done. ok=${ok} fail=${fail}`);

  if (DELETE_TAGS && fail === 0 && !LIMIT) {
    console.log('\nDeleting orphaned location-level tags...');
    const tagsData = await ghl('GET', `/locations/${LOC}/tags`);
    const tags = (tagsData.tags || []).filter((t) => t.name.startsWith('goods-linkedin-') || t.name.startsWith('goods-li-'));
    for (const t of tags) {
      try {
        await ghl('DELETE', `/locations/${LOC}/tags/${t.id}`);
        console.log(`  deleted ${t.name}`);
      } catch (err) {
        console.error(`  FAIL delete ${t.name}: ${err.message}`);
      }
      await sleep(THROTTLE_MS);
    }
  } else if (DELETE_TAGS && (fail > 0 || LIMIT)) {
    console.log(LIMIT
      ? 'Skipping tag deletion (--limit used; some contacts still have these tags).'
      : 'Skipping tag deletion (some contact migrations failed).');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
