/**
 * READ-ONLY guard for the Goods <-> Empathy Ledger community identity seam.
 *
 * The seam is one column (communities.el_community_id) and one typed map
 * (src/lib/community/seam.ts). It is the only thing joining the two systems, so
 * it is the only thing that can break them quietly. This script fails the build
 * when any of the following is true:
 *
 *   1. The typed map and the Goods column disagree.
 *   2. A mapped Goods community no longer exists.
 *   3. A mapped EL community no longer exists, or is a governance_proxy rather
 *      than a real community (EL's own comment: never present a proxy as a
 *      community).
 *   4. Goods and EL both know a community that the map does not pair, i.e. the
 *      seam has fallen behind a new relationship.
 *   5. A production site points at a community that is not in the map, so its
 *      operational summary could never reach EL.
 *
 * It never writes to either database.
 *
 *   node --env-file=.env.local scripts/check-community-seam.mjs   (from v2/)
 *
 * Dependency-free (global fetch + REST). NEVER use the Supabase MCP for v2
 * data — wrong-project risk; see CLAUDE.md.
 */
import { readFileSync } from 'node:fs';

const GOODS_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const GOODS_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL;
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY;

const failures = [];
const warnings = [];

// ── Parse the typed map from source, so no number or id is mirrored here ─────
const seamSrc = readFileSync(new URL('../src/lib/community/seam.ts', import.meta.url), 'utf8');

function parseSeam() {
  const body = seamSrc.match(/COMMUNITY_SEAM[^=]*=\s*\[([\s\S]*?)\]\s*as const/)?.[1];
  if (!body) throw new Error('cannot parse COMMUNITY_SEAM from src/lib/community/seam.ts');
  const entries = [];
  for (const m of body.matchAll(/\{([\s\S]*?)\},\n/g)) {
    const block = m[1];
    const get = (f) => block.match(new RegExp(`${f}:\\s*'([^']*)'`))?.[1];
    const goodsId = get('goodsId');
    const elCommunityId = get('elCommunityId');
    if (goodsId && elCommunityId) entries.push({ goodsId, elCommunityId, elName: get('elName') });
  }
  return entries;
}

const seam = parseSeam();
const orgId =
  seamSrc.match(/EL_GOODS_ORGANIZATION_ID\s*=\s*'([^']+)'/)?.[1] ??
  (() => {
    throw new Error('cannot parse EL_GOODS_ORGANIZATION_ID');
  })();

if (seam.length === 0) failures.push('COMMUNITY_SEAM parsed as empty — the regex or the file shape changed.');

async function rest(base, key, path) {
  const res = await fetch(`${base}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} on ${path}: ${await res.text()}`);
  return res.json();
}

function requireEnv() {
  const missing = [
    !GOODS_URL && 'NEXT_PUBLIC_SUPABASE_URL',
    !GOODS_KEY && 'SUPABASE_SERVICE_ROLE_KEY',
    !EL_URL && 'EMPATHY_LEDGER_SUPABASE_URL',
    !EL_KEY && 'EMPATHY_LEDGER_SUPABASE_KEY',
  ].filter(Boolean);
  if (missing.length) {
    console.error(`\n  check:community-seam needs ${missing.join(', ')} in .env.local.\n`);
    process.exit(1);
  }
}

async function main() {
  requireEnv();

  const [goodsCommunities, goodsSites, elRelationships] = await Promise.all([
    rest(GOODS_URL, GOODS_KEY, 'communities?select=id,name,status,el_community_id'),
    rest(GOODS_URL, GOODS_KEY, 'production_sites?select=id,name,community_id,status'),
    rest(
      EL_URL,
      EL_KEY,
      `organization_community_relationships?select=relationship_stage,communities(id,name,slug,community_kind)&organization_id=eq.${orgId}`,
    ),
  ]);

  const goodsById = new Map(goodsCommunities.map((c) => [c.id, c]));
  const elById = new Map(
    elRelationships.filter((r) => r.communities).map((r) => [r.communities.id, { ...r.communities, stage: r.relationship_stage }]),
  );

  const rows = [];

  for (const entry of seam) {
    const goods = goodsById.get(entry.goodsId);
    const el = elById.get(entry.elCommunityId);

    if (!goods) {
      failures.push(
        `[missing on Goods] seam maps '${entry.goodsId}' but no such row in Goods communities. ` +
          `Either the slug changed or the community was deleted; fix src/lib/community/seam.ts.`,
      );
      continue;
    }
    if (!el) {
      failures.push(
        `[missing on EL] '${entry.goodsId}' maps to EL ${entry.elCommunityId}, which is not a community ` +
          `related to the Goods organisation. Someone removed the relationship or the id changed.`,
      );
      continue;
    }
    if (el.community_kind !== 'community') {
      failures.push(
        `[governance proxy] '${entry.goodsId}' maps to EL ${entry.elCommunityId}, which is kind ` +
          `'${el.community_kind}'. EL's own migration says never present a proxy as a community.`,
      );
      continue;
    }
    if (goods.el_community_id !== entry.elCommunityId) {
      failures.push(
        `[column drift] communities.el_community_id for '${entry.goodsId}' is ` +
          `${goods.el_community_id ?? 'null'} but the typed map says ${entry.elCommunityId}. ` +
          `The migration and src/lib/community/seam.ts have diverged — one of them was edited alone.`,
      );
      continue;
    }
    rows.push({
      goodsId: entry.goodsId,
      goodsName: goods.name,
      goodsStatus: goods.status,
      elName: el.name,
      elSlug: el.slug,
      stage: el.stage,
      slugMatches: el.slug === entry.goodsId,
    });
  }

  // 4. An EL relationship with no seam entry: the seam has fallen behind.
  const mappedElIds = new Set(seam.map((e) => e.elCommunityId));
  for (const [elId, el] of elById) {
    if (el.community_kind !== 'community') continue;
    if (mappedElIds.has(elId)) continue;
    failures.push(
      `[unmapped EL community] EL relates '${el.name}' (${el.slug}, ${elId}) to Goods, but the seam has ` +
        `no entry for it. Add it to COMMUNITY_SEAM and to a migration, or that community can never see ` +
        `its own operational summary.`,
    );
  }

  // 5. A site pointing at a community outside the seam.
  const mappedGoodsIds = new Set(seam.map((e) => e.goodsId));
  for (const site of goodsSites) {
    if (site.community_id && !mappedGoodsIds.has(site.community_id)) {
      failures.push(
        `[site outside the seam] production site '${site.id}' sits in community '${site.community_id}', ` +
          `which has no Empathy Ledger pairing. Its production would be invisible to that community.`,
      );
    }
    if (!site.community_id && site.status === 'active') {
      warnings.push(
        `site '${site.id}' (${site.name}) is active and in no community — expected for the farm, ` +
          `a mistake for anything else.`,
      );
    }
  }

  // ── Scoreboard, printed pass or fail ──────────────────────────────────────
  console.log('\n  Community identity seam — Goods <-> Empathy Ledger\n');
  console.log(
    `  ${'goods id'.padEnd(16)}${'goods name'.padEnd(20)}${'EL name'.padEnd(16)}${'EL slug'.padEnd(26)}stage`,
  );
  console.log(`  ${'-'.repeat(94)}`);
  for (const r of rows) {
    const flag = r.slugMatches ? ' ' : '*';
    console.log(
      `${flag} ${r.goodsId.padEnd(16)}${r.goodsName.padEnd(20)}${r.elName.padEnd(16)}${r.elSlug.padEnd(26)}${r.stage}`,
    );
  }
  const differing = rows.filter((r) => !r.slugMatches).length;
  console.log(
    `\n  ${rows.length}/${seam.length} pairs resolve on both sides. ` +
      `${differing} marked * have slugs that do NOT match — the reason this is a map and not a join.`,
  );

  const sitesLine = goodsSites
    .map((s) => `${s.id} -> ${s.community_id ?? 'no community'} (${s.status})`)
    .join(', ');
  console.log(`  production sites: ${sitesLine || 'none'}`);

  for (const w of warnings) console.log(`\n  note: ${w}`);

  if (failures.length) {
    console.error(`\n  ${failures.length} seam failure(s):\n`);
    for (const f of failures) console.error(`   - ${f}`);
    console.error('');
    process.exit(1);
  }

  console.log('\n  Seam intact.\n');
}

main().catch((err) => {
  console.error(`\n  check:community-seam could not run: ${err.message}\n`);
  process.exit(1);
});
