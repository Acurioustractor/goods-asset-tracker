#!/usr/bin/env node
// Backfill assets.community_id by matching the free-text community column
// against communities.name + name_aliases (case-insensitive).

import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const apply = process.argv.includes('--apply');

async function run() {
  const [{ data: communities, error: cErr }, { data: assets, error: aErr }] = await Promise.all([
    supabase.from('communities').select('id, name, name_aliases'),
    supabase.from('assets').select('unique_id, community, community_id'),
  ]);
  if (cErr) { console.error('communities load failed:', cErr); process.exit(1); }
  if (aErr) { console.error('assets load failed:', aErr); process.exit(1); }

  // Build canonical name -> id map (lowercased), including aliases
  const nameToId = new Map();
  for (const c of communities) {
    nameToId.set(c.name.toLowerCase(), c.id);
    for (const alias of (c.name_aliases || [])) {
      nameToId.set(alias.toLowerCase(), c.id);
    }
  }

  // Build update batches
  const updates = [];
  const unmatched = new Map(); // community name -> count
  let alreadySet = 0;

  for (const a of assets) {
    if (a.community_id) { alreadySet++; continue; }
    if (!a.community) continue;
    const key = a.community.trim().toLowerCase();
    const id = nameToId.get(key);
    if (id) {
      updates.push({ unique_id: a.unique_id, community_id: id });
    } else {
      unmatched.set(a.community, (unmatched.get(a.community) || 0) + 1);
    }
  }

  console.log(`Total assets:           ${assets.length}`);
  console.log(`Already had community_id: ${alreadySet}`);
  console.log(`Matched, will backfill: ${updates.length}`);
  console.log(`Unmatched (free-text):  ${[...unmatched.values()].reduce((s, n) => s + n, 0)}`);
  if (unmatched.size > 0) {
    console.log('\nUnmatched community values (need a row in communities or alias added):');
    for (const [k, n] of unmatched) console.log(`  ${n.toString().padStart(4)}  ${JSON.stringify(k)}`);
  }

  if (!apply) {
    console.log('\nDry-run only. Re-run with --apply to write changes.');
    return;
  }

  // Batch updates by community_id (group asset IDs and run one UPDATE per community for efficiency)
  const byCommunity = new Map();
  for (const u of updates) {
    if (!byCommunity.has(u.community_id)) byCommunity.set(u.community_id, []);
    byCommunity.get(u.community_id).push(u.unique_id);
  }
  console.log('\nApplying updates...');
  for (const [community_id, uniqueIds] of byCommunity) {
    const { error } = await supabase
      .from('assets')
      .update({ community_id })
      .in('unique_id', uniqueIds);
    if (error) {
      console.error(`  failed for ${community_id}:`, error.message);
    } else {
      console.log(`  ${uniqueIds.length.toString().padStart(4)} -> ${community_id}`);
    }
  }

  // Sanity check
  const { count } = await supabase.from('assets').select('unique_id', { count: 'exact', head: true }).is('community_id', null);
  console.log(`\nAfter backfill: ${count} assets still without community_id.`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
