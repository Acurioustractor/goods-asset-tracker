// Backfill content_items.community_id by matching each untagged item's path/tags
// to a Goods community (same matcher the coverage page uses). DRY-RUN by default:
// prints exactly what it would write. Pass --apply to actually PATCH the rows.
//
//   node scripts/backfill-community-links.mjs            # preview only
//   node scripts/backfill-community-links.mjs --apply    # write community_id
//
// Reversible: every write is a single column set; a follow-up run with a cleared
// alias map + manual review can null them again. Targets ONLY rows where
// community_id IS NULL, so it never overwrites a human's manual tag.

import { readFileSync } from 'node:fs';

const APPLY = process.argv.includes('--apply');
const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
const g = (k) => { const m = env.match(new RegExp('^' + k + '=(.*)$', 'm')); return m ? m[1].trim().replace(/^["']|["']$/g, '') : ''; };
const URL_ = g('NEXT_PUBLIC_SUPABASE_URL');
const KEY = g('SUPABASE_SERVICE_ROLE_KEY') || g('SUPABASE_SERVICE_KEY');
const H = { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' };
// EL DB — el-source content_items carry a media_asset UUID as their ref, with no
// place in the ref; their community comes from the EL gallery the photo sits in.
const E_URL = g('EMPATHY_LEDGER_SUPABASE_URL');
const E_KEY = g('EMPATHY_LEDGER_SUPABASE_KEY');
const EH = { apikey: E_KEY, Authorization: 'Bearer ' + E_KEY };
const chunk = (a, n) => { const o = []; for (let i = 0; i < a.length; i += n) o.push(a.slice(i, i + n)); return o; };

// --- matcher (mirror of src/lib/data/community-match.ts) ---------------------
const ALIASES = {
  'Alice Springs': ['mparntwe', 'oonchiumpa'], 'Tennant Creek': ['wumpurrarni'], 'Palm Island': ['bwgcolman'],
  'Kalgoorlie': ['ninga mia', 'wongatha'], 'Mt Isa': ['mount isa'],
  "Galiwin'ku": ['elcho island', 'galiwinku'],
  'Groote Archipelago': ['groote eylandt', 'groote', 'angurugu', 'umbakumba'],
  'Utopia Homelands': ['utopia', 'ampilatwatja', 'arlparra'], 'Torres Strait': ['thursday island'],
};
const GENERIC = new Set(['', 'australia', 'northern territory', 'queensland', 'western australia', 'south australia', 'new south wales', 'victoria', 'tasmania', 'nt', 'qld', 'wa', 'sa', 'nsw', 'vic', 'tas', 'act']);
const norm = (s) => s.toLowerCase().normalize('NFKD').replace(/[^\p{Letter}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
function buildMatcher(comms) {
  const keys = [];
  for (const c of comms) {
    const add = (raw) => { if (!raw) return; const k = norm(raw); if (k.length >= 4 && !GENERIC.has(k)) keys.push({ key: k, id: c.id, name: c.name }); };
    add(c.name); add(c.traditional_name); for (const a of ALIASES[c.name] ?? []) add(a);
  }
  keys.sort((a, b) => b.key.length - a.key.length);
  const cw = (h, k) => { let f = 0; for (;;) { const i = h.indexOf(k, f); if (i < 0) return false; const b = i === 0 ? ' ' : h[i - 1], a = i + k.length >= h.length ? ' ' : h[i + k.length]; if (!/\p{Letter}/u.test(b) && !/\p{Letter}/u.test(a)) return true; f = i + 1; } };
  return (text) => { if (!text) return null; const h = norm(text); if (GENERIC.has(h)) return null; for (const { key, id, name } of keys) if (cw(h, key)) return { id, name }; return null; };
}

const j = async (path, opts) => { const r = await fetch(`${URL_}/rest/v1/${path}`, { headers: H, ...opts }); if (!r.ok) throw new Error(`${r.status} ${await r.text()}`); return r.status === 204 ? null : r.json(); };

(async () => {
  const comms = await j('communities?select=id,name,traditional_name&order=name');
  const match = buildMatcher(comms);
  const commName = new Map(comms.map((c) => [c.id, c.name]));

  // Untagged items only — match on the ref (path/filename) plus any tags.
  const rows = await j('content_items?community_id=is.null&select=id,ref,tags,source&limit=5000');

  // EL-source rows carry a media_asset UUID as ref (no place text); resolve the EL
  // gallery each photo sits in ("Goods. Tennant Creek" -> Tennant Creek) and match that.
  const elIds = rows.filter((r) => r.source === 'el' && /^[0-9a-f-]{36}$/.test(r.ref || '')).map((r) => r.ref);
  const galleryByMedia = new Map();
  if (elIds.length && E_URL && E_KEY) {
    const ej = async (p) => { const r = await fetch(`${E_URL}/rest/v1/${p}`, { headers: EH }); if (!r.ok) throw new Error(`EL ${r.status} ${await r.text()}`); return r.json(); };
    const assoc = [];
    for (const c of chunk(elIds, 100)) assoc.push(...await ej(`gallery_media_associations?media_asset_id=in.(${c.join(',')})&select=media_asset_id,gallery_id`));
    const gids = [...new Set(assoc.map((a) => a.gallery_id))];
    const gals = gids.length ? await ej(`galleries?id=in.(${gids.join(',')})&select=id,title`) : [];
    const galTitle = new Map(gals.map((gg) => [gg.id, gg.title]));
    for (const a of assoc) galleryByMedia.set(a.media_asset_id, galTitle.get(a.gallery_id) || '');
  }

  const hits = [];
  for (const r of rows) {
    // el rows: gallery name (+tags); others: ref path (+tags). Never feed the raw
    // UUID ref to the matcher.
    const hay = r.source === 'el'
      ? `${galleryByMedia.get(r.ref) || ''} ${(r.tags || []).join(' ')}`
      : `${r.ref || ''} ${(r.tags || []).join(' ')}`;
    const m = match(hay);
    if (m) hits.push({ id: r.id, ref: r.ref, source: r.source, community_id: m.id, community: m.name });
  }

  const byComm = {};
  for (const h of hits) (byComm[h.community] ??= []).push(h);
  const bySource = {};
  for (const h of hits) bySource[h.source || 'local'] = (bySource[h.source || 'local'] || 0) + 1;
  console.log(`content_items with NULL community_id: ${rows.length}`);
  console.log(`would tag: ${hits.length} (by source: ${JSON.stringify(bySource)})\n`);
  for (const [name, list] of Object.entries(byComm).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  ${name} (${list.length})`);
    for (const h of list.slice(0, 4)) console.log(`      ${h.ref}`);
    if (list.length > 4) console.log(`      … +${list.length - 4} more`);
  }

  if (!APPLY) { console.log('\nDRY RUN — no writes. Re-run with --apply to write these.'); return; }

  console.log('\nAPPLYING…');
  let ok = 0;
  for (const h of hits) {
    await j(`content_items?id=eq.${h.id}`, { method: 'PATCH', headers: { ...H, Prefer: 'return=minimal' }, body: JSON.stringify({ community_id: h.community_id }) });
    ok++;
  }
  console.log(`wrote community_id on ${ok} content_items.`);
})().catch((e) => { console.error('ERR', e.message); process.exit(1); });
