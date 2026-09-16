/**
 * READ-ONLY drift guard for the place registry.
 *
 * src/lib/data/place-registry.ts is the token list every surface joins on. Two things can make it
 * lie, and this checks both:
 *
 *   1. The live Supabase `communities` table gains or loses a row, so `inRegister` is wrong and a
 *      community exists in one place and not the other.
 *   2. A place column in the live data holds a string the registry has never seen. The unit guard
 *      already checks the JSON pulls; this checks the live `assets` register too, which the unit
 *      test cannot reach.
 *
 * It never writes. If it fails: add the place to PLACES, or to NOT_A_PLACE when it was never a
 * place, and update IN_LIVE_TABLE in place-registry.guards.test.ts if the table itself moved.
 *
 *   node --env-file=.env.local scripts/check-place-registry.mjs   (run from v2/)
 *
 * NEVER use the Supabase MCP for v2 data. It points at the wrong project.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const src = readFileSync(new URL('../src/lib/data/place-registry.ts', import.meta.url), 'utf8');

const places = [...src.matchAll(/\{ id: '([^']+)', name: '((?:[^'\\]|\\.)*)'[^}]*\}/g)].map((m) => {
  const row = m[0];
  const aliases = /aliases: \[([^\]]*)\]/.exec(row);
  return {
    id: m[1],
    name: m[2].replace(/\\'/g, "'"),
    aliases: aliases ? [...aliases[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((a) => a[1].replace(/\\'/g, "'")) : [],
    inRegister: /inRegister: true/.test(row),
  };
});
const notAPlace = [...(/export const NOT_A_PLACE[^[]*\[([\s\S]*?)\n\];/.exec(src)?.[1] ?? '').matchAll(/^\s*'((?:[^'\\]|\\.)*)',/gm)].map((m) => m[1]);

if (places.length < 50) {
  console.error(`Parsed only ${places.length} places from place-registry.ts. The parser and the file have drifted.`);
  process.exit(1);
}

const key = (s) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const known = new Map();
for (const p of places) for (const s of [p.id, p.name, ...p.aliases]) known.set(key(s), p.id);
const declaredNonPlace = new Set(notAPlace.map(key));

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const problems = [];

const { data: live, error: liveErr } = await sb.from('communities').select('id,name');
if (liveErr) { console.error('communities read failed:', liveErr.message); process.exit(1); }

const marked = new Set(places.filter((p) => p.inRegister).map((p) => p.id));
for (const row of live) {
  if (!marked.has(row.id)) problems.push(`communities row "${row.id}" (${row.name}) is not marked inRegister in the registry`);
}
for (const id of marked) {
  if (!live.some((r) => r.id === id)) problems.push(`registry marks "${id}" inRegister, and the communities table has no such row`);
}

const { data: assets, error: assetErr } = await sb.from('assets').select('community,community_id');
if (assetErr) { console.error('assets read failed:', assetErr.message); process.exit(1); }

const unknownAssetPlaces = new Map();
for (const row of assets) {
  if (row.community_id && !places.some((p) => p.id === row.community_id)) {
    unknownAssetPlaces.set(`community_id "${row.community_id}"`, true);
  }
  if (row.community && !known.has(key(row.community)) && !declaredNonPlace.has(key(row.community))) {
    unknownAssetPlaces.set(`community "${row.community}"`, true);
  }
}
for (const p of unknownAssetPlaces.keys()) problems.push(`assets register holds ${p}, which the registry does not know`);

console.log(`Place registry: ${places.length} places, ${notAPlace.length} declared non-places.`);
console.log(`Live communities table: ${live.length} rows. Assets register: ${assets.length} rows.`);

if (problems.length) {
  console.error(`\n${problems.length} problem${problems.length === 1 ? '' : 's'}:`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}
console.log('No drift.');
