// Per-community media + storyteller inventory v2 — mirrors the REAL corpus
// shape from src/lib/empathy-ledger/align.ts:
//   media union = project_id + project_code='goods' + gallery members (deduped)
//   attribution ladder per asset:
//     1. cultural_tags community:<id>
//     2. gallery title place-match (community-match.ts)
//     3. title/caption place-match
//     4. tagged PEOPLE (media_storytellers) -> storyteller location -> community
//   roster = project_storytellers junction (the real Goods people), cleared
//   verdicts via cleared-voices.ts
//   stories union = project_id OR authored by a roster storyteller
// READ-ONLY: GETs only. Run from v2/:
//   node --env-file=.env.local scripts/community-media-report.mjs
// Output: ../wiki/outputs/el-media-inventory-<date>.md (+ .json)

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ts = require('typescript');

function loadTS(rel) {
  const src = fs.readFileSync(path.join(process.cwd(), rel), 'utf8');
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = { exports: {} };
  new Function('exports', 'module', 'require', js)(mod.exports, mod, require);
  return mod.exports;
}
const { makeCommunityMatcher } = loadTS('src/lib/data/community-match.ts');
const { isClearedForExternal } = loadTS('src/lib/data/cleared-voices.ts');

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const PID = process.env.EMPATHY_LEDGER_PROJECT_ID || '';
const GOODS_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const GOODS_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
if (!EL_URL || !EL_KEY || !PID) { console.error('Missing EMPATHY_LEDGER_* env — run with --env-file=.env.local'); process.exit(1); }

const elGet = async (table, q) => {
  const r = await fetch(`${EL_URL}/rest/v1/${table}?${q}`, { headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` } });
  if (!r.ok) throw new Error(`EL ${table}: ${r.status} ${await r.text().then((t) => t.slice(0, 120)).catch(() => '')}`);
  return r.json();
};
const goodsGet = async (table, q) => {
  if (!GOODS_URL || !GOODS_KEY) return [];
  const r = await fetch(`${GOODS_URL}/rest/v1/${table}?${q}`, { headers: { apikey: GOODS_KEY, Authorization: `Bearer ${GOODS_KEY}` } });
  return r.ok ? r.json() : [];
};
const chunk = (a, n) => a.reduce((out, x, i) => ((i % n ? out[out.length - 1].push(x) : out.push([x])), out), []);

console.log('Pulling live data (read-only)…');

// --- communities + matcher ---------------------------------------------------
let communities = await goodsGet('communities', 'select=id,name,traditional_name');
if (!communities.length) communities = [
  { id: 'tennant-creek', name: 'Tennant Creek' }, { id: 'palm-island', name: 'Palm Island' },
  { id: 'alice-springs', name: 'Alice Springs' }, { id: 'utopia', name: 'Utopia Homelands' },
];
const matcher = makeCommunityMatcher(communities);
const commName = new Map(communities.map((c) => [c.id, c.name]));

// --- galleries (place carriers) ----------------------------------------------
const pg = await elGet('project_galleries', `project_id=eq.${PID}&select=gallery_id`);
const gids = pg.map((g) => g.gallery_id);
const gals = gids.length ? await elGet('galleries', `id=in.(${gids.join(',')})&select=id,title`) : [];
const galTitle = new Map(gals.map((g) => [g.id, g.title || '']));
const assoc = gids.length ? await elGet('gallery_media_associations', `gallery_id=in.(${gids.join(',')})&select=gallery_id,media_asset_id`) : [];
const galleryOf = new Map();
for (const a of assoc) galleryOf.set(a.media_asset_id, galTitle.get(a.gallery_id) || '');

// --- media union (align.ts pattern) --------------------------------------------
const SEL = 'id,title,caption,display_name,media_type,file_type,cultural_tags,visibility,is_sacred_no_publish,removed_by_storyteller_at,uploaded_at';
const [byId, byCode] = await Promise.all([
  elGet('media_assets', `project_id=eq.${PID}&select=${SEL}&limit=1000`),
  elGet('media_assets', `project_code=eq.goods&select=${SEL}&limit=1000`),
]);
const rowById = new Map();
for (const m of [...byId, ...byCode]) rowById.set(m.id, m);
const missing = [...new Set(assoc.map((a) => a.media_asset_id))].filter((id) => !rowById.has(id));
for (const c of chunk(missing, 100)) {
  for (const m of await elGet('media_assets', `id=in.(${c.join(',')})&select=${SEL}`)) rowById.set(m.id, m);
}
const corpus = [...rowById.values()];

// --- roster (real Goods people) + photo<->person junction -----------------------
const ps = await elGet('project_storytellers', `project_id=eq.${PID}&select=storyteller_id`);
const stIds = [...new Set(ps.map((s) => s.storyteller_id).filter(Boolean))];
const roster = stIds.length
  ? await elGet('storytellers', `id=in.(${stIds.join(',')})&select=id,display_name,location,is_elder,is_active&order=display_name`)
  : [];
const active = roster.filter((p) => p.is_active !== false);
const personById = new Map(active.map((p) => [p.id, p]));
const personCommunity = (p) => matcher.matchLocation(p.location) || matcher.matchText(p.location) || null;

const junction = [];
for (const c of chunk(corpus.map((m) => m.id), 100)) {
  junction.push(...(await elGet('media_storytellers', `media_asset_id=in.(${c.join(',')})&select=media_asset_id,storyteller_id`)));
}
const peopleOf = new Map();
for (const j of junction) {
  const p = personById.get(j.storyteller_id);
  if (!p) continue;
  const arr = peopleOf.get(j.media_asset_id) || [];
  arr.push(p);
  peopleOf.set(j.media_asset_id, arr);
}

// --- stories union ----------------------------------------------------------------
const S_SEL = 'id,title,is_public,tags,storyteller_id,story_image_url,media_url';
const sById = new Map();
for (const s of await elGet('stories', `project_id=eq.${PID}&select=${S_SEL}&limit=1000`)) sById.set(s.id, s);
for (const c of chunk(stIds, 50)) {
  for (const s of await elGet('stories', `storyteller_id=in.(${c.join(',')})&select=${S_SEL}&limit=1000`)) sById.set(s.id, s);
}
const allStories = [...sById.values()];

// --- attribute -----------------------------------------------------------------------
const communityTag = (tags) => {
  const t = (tags || []).find((x) => typeof x === 'string' && x.startsWith('community:'));
  return t ? t.slice('community:'.length) : null;
};
function attributeAsset(m) {
  const viaTag = communityTag(m.cultural_tags);
  if (viaTag && commName.has(viaTag)) return { cid: viaTag, via: 'cultural_tag' };
  const g = galleryOf.get(m.id);
  const viaGal = g ? matcher.matchText(g) : null;
  if (viaGal) return { cid: viaGal, via: `gallery "${g}"` };
  const viaTitle = matcher.matchText(m.title) || matcher.matchText(m.display_name) || matcher.matchText(m.caption);
  if (viaTitle) return { cid: viaTitle, via: 'title/caption' };
  for (const p of peopleOf.get(m.id) || []) {
    const pc = personCommunity(p);
    if (pc) return { cid: pc, via: `person ${p.display_name}` };
  }
  return { cid: null, via: null };
}
const passesPublicGate = (m) => m.visibility === 'public' && m.is_sacred_no_publish !== true && !m.removed_by_storyteller_at;

const rep = {};
const ensure = (cid) => (rep[cid] ??= {
  name: commName.get(cid) || cid,
  publicPhotos: [], publicVideos: [], blocked: [], people: new Map(),
  stories: { total: 0, public: 0, titles: [] }, library: { public: 0, gated: 0, red: 0 },
});
const unattributed = { public: [], blocked: 0, untyped: 0 };

for (const m of corpus) {
  if (!m.media_type) { unattributed.untyped += 1; continue; } // 136 untyped: held back (align.ts)
  const { cid, via } = attributeAsset(m);
  const label = `${m.title || m.display_name || galleryOf.get(m.id) || '(untitled)'}${via ? ` ← ${via}` : ''}`;
  if (!cid) {
    if (passesPublicGate(m)) unattributed.public.push({ type: m.media_type, label, gallery: galleryOf.get(m.id) || null });
    else unattributed.blocked += 1;
    continue;
  }
  const r = ensure(cid);
  if (passesPublicGate(m)) (m.media_type === 'video' ? r.publicVideos : r.publicPhotos).push(label);
  else r.blocked.push(`[${m.media_type}] ${label} — ${m.visibility ?? 'no visibility'}${m.is_sacred_no_publish ? ', sacred' : ''}${m.removed_by_storyteller_at ? ', withdrawn' : ''}`);
}

for (const p of active) {
  const cid = personCommunity(p);
  if (!cid) continue;
  ensure(cid).people.set(p.id, { name: p.display_name, elder: p.is_elder === true, cleared: isClearedForExternal(p.display_name) });
}

for (const s of allStories) {
  const author = personById.get(s.storyteller_id);
  const cid = communityTag(s.tags) || matcher.matchText(s.title) || (author ? personCommunity(author) : null);
  if (!cid) continue;
  const r = ensure(cid);
  r.stories.total += 1;
  if (s.is_public) r.stories.public += 1;
  if (r.stories.titles.length < 6) r.stories.titles.push(`"${s.title || '(untitled)'}"${s.is_public ? ' [public]' : ''}`);
}

for (const it of await goodsGet('content_items', 'select=community_id,consent_tier,archived_at&limit=3000')) {
  if (it.archived_at || !it.community_id) continue;
  const r = ensure(it.community_id);
  const tier = it.consent_tier === 'public' ? 'public' : it.consent_tier === 'gated' ? 'gated' : 'red';
  r.library[tier] += 1;
}

// --- write ------------------------------------------------------------------------------
const date = new Date().toISOString().slice(0, 10);
const mdPath = path.join(process.cwd(), '..', 'wiki', 'outputs', `el-media-inventory-${date}.md`);
const typed = corpus.filter((m) => m.media_type);

let md = `# EL + library media inventory by community — ${date} (v2, full union)\n\n`;
md += `Corpus = project_id ∪ project_code='goods' ∪ gallery members (align.ts pattern): **${corpus.length} assets** (${typed.length} typed, ${unattributed.untyped} untyped held back). Galleries: ${gals.length}. Goods roster (project_storytellers): ${active.length} active people. Stories (project ∪ roster-authored): ${allStories.length} (${allStories.filter((s) => s.is_public).length} public).\n\n`;
md += `Attribution ladder: community tag → gallery title → asset title/caption → tagged person's community. Public gate: visibility=public, not sacred, not withdrawn.\n\n`;

const order = [...Object.entries(rep)].sort((a, b) => (b[1].publicPhotos.length + b[1].publicVideos.length + b[1].blocked.length) - (a[1].publicPhotos.length + a[1].publicVideos.length + a[1].blocked.length));
for (const [cid, r] of order) {
  const ppl = [...r.people.values()];
  md += `## ${r.name} (${cid})\n\n`;
  md += `- **Public photos: ${r.publicPhotos.length}**${r.publicPhotos.length ? ` — ${r.publicPhotos.slice(0, 8).join('; ')}${r.publicPhotos.length > 8 ? ` … +${r.publicPhotos.length - 8}` : ''}` : ''}\n`;
  md += `- **Public videos: ${r.publicVideos.length}**${r.publicVideos.length ? ` — ${r.publicVideos.slice(0, 8).join('; ')}` : ''}\n`;
  md += `- Blocked by consent gate: ${r.blocked.length}${r.blocked.length ? ` — e.g. ${r.blocked.slice(0, 3).join('; ')}` : ''}\n`;
  md += `- People: ${ppl.length ? ppl.map((p) => `${p.name}${p.elder ? ' (Elder)' : ''} ${p.cleared ? '✓cleared' : '✗not-cleared'}`).join('; ') : '0 matched'}\n`;
  md += `- Stories: ${r.stories.total} (${r.stories.public} public)${r.stories.titles.length ? ` — ${r.stories.titles.join('; ')}` : ''}\n`;
  md += `- Library: ${r.library.public} public / ${r.library.gated} gated / ${r.library.red} red\n\n`;
}

const noComm = active.filter((p) => !personCommunity(p));
md += `## Roster people with NO resolvable community (${noComm.length})\n\n${noComm.map((p) => `- ${p.display_name} — location: "${p.location ?? ''}"`).join('\n')}\n\n`;
md += `## Public-gate media with no attribution at all (${unattributed.public.length})\n\n`;
for (const u of unattributed.public.slice(0, 40)) md += `- [${u.type}] ${u.label}${u.gallery ? ` (gallery: ${u.gallery})` : ''}\n`;
if (unattributed.public.length > 40) md += `- … ${unattributed.public.length - 40} more\n`;

fs.writeFileSync(mdPath, md);
fs.writeFileSync(mdPath.replace(/\.md$/, '.json'), JSON.stringify({ rep: Object.fromEntries(order.map(([k, v]) => [k, { ...v, people: [...v.people.values()] }])), unattributed, corpusSize: corpus.length }, null, 2));
console.log(`\nWrote ${mdPath}\n`);
console.log(md.split('\n').slice(0, 40).join('\n'));
