// Fix mislabeled media_links. The 2026-07-20 starred-manifest backfill wrote 15
// rows as target_type='story' using the manifest's canon-slot name as the
// target_key, so their "story" targets are actually image/slot names, not story
// slugs (the real stories are welcome-to-goods, palm-island-delivery). The true
// subject is recoverable from the media_key folder prefix (product--, process--,
// people--, utopia--). This remaps each row to its correct entity, or removes the
// purely-thematic ones that have no entity to point at.
//
// Dry-run by default. Apply with:  node --env-file=.env.local scripts/fix-media-links-labels.mjs --apply
// Idempotent: re-running after apply finds nothing to do.

const APPLY = process.argv.includes('--apply');
const URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/"/g, '').trim();
const KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/"/g, '').trim();
if (!URL || !KEY) { console.error('Missing Goods Supabase env'); process.exit(1); }
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };

async function rest(path, init) {
  const res = await fetch(`${URL}/rest/v1/${path}`, { headers: H, ...init });
  const text = await res.text();
  return { status: res.status, ok: res.ok, body: text ? JSON.parse(text) : null };
}

// target_key (the mislabeled "story" key) -> the correct { target_type, target_key }
// or null to delete the row. Person keys are crm_contacts.id (resolved 2026-07-20).
const REMAP = {
  'assembly-sequence':          { target_type: 'product',   target_key: 'stretch-bed' },
  'product-in-use':             { target_type: 'product',   target_key: 'stretch-bed' },
  'washing-machine':            { target_type: 'product',   target_key: 'pakkimjalki-kari' },
  'plant-panorama':             { target_type: 'product',   target_key: 'the-plant' },
  'plastic-feedstock':          { target_type: 'product',   target_key: 'the-plant' },
  'pressed-sheets':             { target_type: 'product',   target_key: 'the-plant' },
  'storyteller-alfred-johnson': { target_type: 'person',    target_key: '25ef45d4-3c21-4a42-b703-390395d3f738' },
  'storyteller-linda-turner':   { target_type: 'person',    target_key: '36110791-9b3f-4b1e-9c8e-a3d0e5f6a7b8' },
  'storyteller-mykel':          { target_type: 'person',    target_key: 'b20e7310-0000-0000-0000-000000000000' },
  'cover-hero':                 { target_type: 'person',    target_key: '754208bf-0000-0000-0000-000000000000' },
  'kids-building':              { target_type: 'person',    target_key: 'b20e7310-0000-0000-0000-000000000000' },
  'community-delivery':         { target_type: 'community', target_key: 'utopia' },
  'area-05-risk':               null,
  'listening-first':            null,
  'problem':                    null,
};

// Resolve the truncated person ids to full crm_contacts ids by name, so we never
// hard-code a wrong uuid.
const PERSON_BY_KEY = {
  'storyteller-alfred-johnson': 'Alfred Johnson',
  'storyteller-linda-turner':   'Linda Turner',
  'storyteller-mykel':          'Mykel',
  'cover-hero':                 'Dianne Stokes',
  'kids-building':              'Mykel',
};

const rows = (await rest('media_links?select=id,media_key,target_key,relation,media_source&target_type=eq.story&order=target_key')).body || [];
if (rows.length === 0) { console.log('No mislabeled story links remain. Nothing to do.'); process.exit(0); }

// Resolve real person ids once
const nameToId = {};
for (const name of new Set(Object.values(PERSON_BY_KEY))) {
  const hits = (await rest(`crm_contacts?select=id,name&name=eq.${encodeURIComponent(name)}`)).body || [];
  if (hits.length === 1) nameToId[name] = hits[0].id;
  else console.warn(`  ! could not uniquely resolve person "${name}" (${hits.length} matches)`);
}

let retyped = 0, deleted = 0, skipped = 0;
for (const r of rows) {
  const plan = REMAP[r.target_key];
  if (plan === undefined) { console.warn(`  ? no rule for "${r.target_key}" — leaving as-is`); skipped++; continue; }

  if (plan === null) {
    console.log(`DELETE  ${r.target_key}  (thematic, no entity)`);
    if (APPLY) { await rest(`media_links?id=eq.${r.id}`, { method: 'DELETE' }); }
    deleted++;
    continue;
  }

  let target_key = plan.target_key;
  if (plan.target_type === 'person') {
    const resolved = nameToId[PERSON_BY_KEY[r.target_key]];
    if (!resolved) { console.warn(`  ! skip ${r.target_key}: person unresolved`); skipped++; continue; }
    target_key = resolved;
  }

  console.log(`RETYPE  ${r.target_key.padEnd(26)} -> ${plan.target_type}:${target_key}`);
  if (APPLY) {
    // A row with the same (source, key, new type, new key, relation) may already
    // exist (e.g. an EL person link). Try the update; on unique-violation, the
    // correct row already exists, so just delete this mislabeled one.
    const upd = await rest(`media_links?id=eq.${r.id}`, {
      method: 'PATCH',
      headers: { ...H, Prefer: 'return=minimal' },
      body: JSON.stringify({ target_type: plan.target_type, target_key, source: 'label-fix-2026-07-20' }),
    });
    if (!upd.ok && upd.status === 409) {
      await rest(`media_links?id=eq.${r.id}`, { method: 'DELETE' });
      console.log(`         (target already existed; removed the duplicate mislabel)`);
    } else if (!upd.ok) {
      console.warn(`         ! update failed ${upd.status}: ${JSON.stringify(upd.body)}`);
    }
  }
  retyped++;
}

console.log(`\n${APPLY ? 'APPLIED' : 'DRY-RUN'}: ${retyped} retyped, ${deleted} deleted, ${skipped} skipped.`);
if (!APPLY) console.log('Re-run with --apply to write.');
