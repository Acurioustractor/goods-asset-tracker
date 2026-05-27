#!/usr/bin/env node
// Bridge delivery-evidence photo tags to the canonical field-notes tag
// scheme. The batch delivery-evidence pipeline writes hyphen-flat tags
// (utopia-homelands, trip-may-2026); the field-notes resolver / trip
// stories use colon-prefixed tags (community:utopia-homelands,
// trip:may-2026). This script adds the canonical tags ADDITIVELY — old
// tags stay so existing tools keep working.
//
// Idempotent. Re-run after every delivery upload.

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL;
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY;
const PROJECT_ID = '6bd47c8a-e676-456f-aa25-ddcbb5a31047';

if (!EL_URL || !EL_KEY) {
  console.error('Missing EMPATHY_LEDGER_SUPABASE_URL / KEY');
  process.exit(1);
}

// Hyphen-flat → canonical colon tag map.
const TAG_MAP = {
  'trip-may-2026': 'trip:may-2026',
  'utopia-homelands': 'community:utopia-homelands',
  'pending-elder-review': 'consent:elder-pending',
  'goods-staff-capture': 'goods-staff-capture',
  'stretch-bed': 'product:stretch-bed',
  'batch-156': 'batch:156',
  'day-1': 'date:2026-05-21',
  'day-2': 'date:2026-05-22',
  'canon-r6': 'capture:canon-r6',
  'deck-candidate': 'use:deck-candidate',
};

function mergeUnique(existing, incoming) {
  const out = [...(existing || [])];
  for (const t of incoming) if (!out.includes(t)) out.push(t);
  return out;
}

async function fetchAll() {
  const params = [
    `project_id=eq.${PROJECT_ID}`,
    `story_type=eq.delivery-evidence`,
    `select=id,title,tags`,
    `order=created_at.desc`,
    `limit=500`,
  ];
  const res = await fetch(`${EL_URL}/rest/v1/stories?${params.join('&')}`, {
    headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
  });
  if (!res.ok) throw new Error(`fetch failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function patchTags(id, tags) {
  const res = await fetch(`${EL_URL}/rest/v1/stories?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: EL_KEY,
      Authorization: `Bearer ${EL_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ tags }),
  });
  if (!res.ok) throw new Error(`patch ${id} failed: ${res.status} ${await res.text()}`);
}

(async () => {
  const rows = await fetchAll();
  console.log(`Found ${rows.length} delivery-evidence rows.\n`);
  let patched = 0;
  let already = 0;
  for (const r of rows) {
    const existing = r.tags || [];
    const additions = [];
    for (const [from, to] of Object.entries(TAG_MAP)) {
      if (existing.includes(from) && !existing.includes(to)) additions.push(to);
    }
    // Always pin format/media-type
    if (!existing.includes('format:photo')) additions.push('format:photo');
    if (!existing.includes('event:bed-delivery')) additions.push('event:bed-delivery');

    if (!additions.length) { already++; continue; }
    const merged = mergeUnique(existing, additions);
    await patchTags(r.id, merged);
    patched++;
    if (patched % 25 === 0) console.log(`  patched ${patched}…`);
  }
  console.log(`\nDone. Patched ${patched}, already-canonical ${already}.`);
})().catch((e) => { console.error(e); process.exit(1); });
