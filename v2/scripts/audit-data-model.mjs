// Data-model alignment audit. One command that checks the whole model talks to
// itself: every foreign reference resolves, media_links point at real entities,
// and coverage gaps are visible. Read-only. Run:
//   node --env-file=.env.local scripts/audit-data-model.mjs
// Exits non-zero if any hard misalignment (orphan ref / bad link target) is found,
// so it can gate CI later. Coverage gaps are warnings, not failures.

const URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/"/g, '').trim();
const KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/"/g, '').trim();
if (!URL || !KEY) { console.error('Missing Goods Supabase env'); process.exit(1); }
const H = { apikey: KEY, Authorization: `Bearer ${KEY}` };
async function q(path) {
  const res = await fetch(`${URL}/rest/v1/${path}`, { headers: H });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json();
}
const ids = (rows, col = 'id') => new Set(rows.map((r) => r[col]).filter(Boolean));

const fails = [];
const warns = [];
const ok = (m) => console.log(`  \x1b[32mok\x1b[0m   ${m}`);
const fail = (m) => { console.log(`  \x1b[31mFAIL\x1b[0m ${m}`); fails.push(m); };
const warn = (m) => { console.log(`  \x1b[33mwarn\x1b[0m ${m}`); warns.push(m); };

console.log('\nCanonical keys');
const communities = await q('communities?select=id,name,name_aliases');
const commIds = ids(communities);
const contactIds = ids(await q('crm_contacts?select=id'));
const PRODUCT_SLUGS = new Set(['stretch-bed', 'pakkimjalki-kari', 'basket-bed', 'the-plant']);
const storySlugs = ids(await q('stories?select=slug'), 'slug');
ok(`${commIds.size} communities · ${contactIds.size} contacts · ${PRODUCT_SLUGS.size} products · ${storySlugs.size} stories`);

console.log('\nForeign references resolve to a community');
for (const [tbl, col, filter] of [
  ['assets', 'community_id', 'community_id=not.is.null'],
  ['content_items', 'community_id', 'community_id=not.is.null'],
  ['community_demand', 'community_id', 'community_id=not.is.null'],
  ['storytellers', 'community_id', 'community_id=not.is.null'],
]) {
  const rows = await q(`${tbl}?select=${col}&${filter}`);
  const orphans = [...new Set(rows.map((r) => r[col]))].filter((v) => v && !commIds.has(v));
  if (orphans.length) fail(`${tbl}.${col}: ${orphans.length} orphan(s): ${orphans.join(', ')}`);
  else ok(`${tbl}.${col}: ${rows.length} refs all resolve`);
}

console.log('\nmedia_links point at real entities');
const ml = await q('media_links?select=id,target_type,target_key');
const byType = { person: [], community: [], product: [], asset: [], story: [] };
for (const r of ml) (byType[r.target_type] ||= []).push(r.target_key);
const checkTargets = (type, valid) => {
  const keys = byType[type] || [];
  const bad = [...new Set(keys)].filter((k) => !valid.has(k));
  if (bad.length) fail(`media_links(${type}): ${bad.length} key(s) not a real ${type}: ${bad.slice(0, 6).join(', ')}`);
  else ok(`media_links(${type}): ${keys.length} link(s) all resolve`);
};
checkTargets('person', contactIds);
checkTargets('community', commIds);
checkTargets('product', PRODUCT_SLUGS);
checkTargets('story', storySlugs);
if ((byType.asset || []).length) ok(`media_links(asset): ${byType.asset.length} link(s)`);

console.log('\nCoverage — communities with beds but no linked media');
const deployed = await q('assets?select=community_id&status=eq.deployed&community_id=not.is.null');
const withBeds = new Set(deployed.map((a) => a.community_id));
const withMedia = new Set((byType.community || []));
const gaps = [...withBeds].filter((c) => !withMedia.has(c)).sort();
if (gaps.length) warn(`${gaps.length} of ${withBeds.size} bed communities have no media_links: ${gaps.join(', ')}`);
else ok('every bed community has at least one linked media item');

console.log('\nCoverage — products with no linked media');
const prodGaps = [...PRODUCT_SLUGS].filter((s) => !(byType.product || []).includes(s));
if (prodGaps.length) warn(`products with no media_links: ${prodGaps.join(', ')}`);
else ok('every product has at least one linked media item');

console.log(`\n${'-'.repeat(48)}`);
console.log(`${fails.length} FAIL · ${warns.length} warn`);
if (fails.length) { console.log('Model has hard misalignments. Fix before relying on cross-links.'); process.exit(1); }
console.log('Model is aligned. Warnings are coverage gaps to fill via the Media Room.');
