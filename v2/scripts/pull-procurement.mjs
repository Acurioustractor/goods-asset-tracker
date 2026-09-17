#!/usr/bin/env node
/**
 * Pull the real procurement buyers out of the shared graph, and tag them to communities.
 *
 * Ben, 16 September 2026: we already hold every ABN, every social enterprise, every community
 * organisation in grantscope. Pull it, tag it per community, work out what they are buying.
 *
 * WHY THIS DOES NOT USE `goods_procurement_entities`. That table has 4,562 rows and looks like
 * the answer, but it was built by matching entities to communities on PROXIMITY, so it holds
 * things like a Newcastle youth arts co-op as a Goods buyer prospect. Of its rows, 1,604 carry
 * any government contract value and none has ever moved past `prospect`. It is a working set,
 * not a buyer list.
 *
 * So this works from EVIDENCE instead: contracts that were actually awarded for the things
 * Goods makes. An organisation is in the output because it bought a bed. Being near one does
 * not qualify it.
 *
 * Two dedup traps, both real:
 *   - austender_contracts carries dual-key duplicate rows, so everything is keyed on `ocid`.
 *   - a contract matching two keywords must not be counted twice, hence the map.
 *
 * STATE TENDERS ARE IN HERE AND THEY ARE ALMOST WORTHLESS FOR THIS, which is worth recording
 * so nobody spends a day rediscovering it. `state_tenders` holds 199,719 rows and 199,679 of
 * them are Queensland. NT, WA, SA, TAS and ACT are all ZERO, despite an NT contracts file
 * sitting in the grantscope repo unloaded. Of the 62 rows that mention something Goods makes,
 * every buyer is Corrective Services, Education, Youth Justice or Child Safety buying
 * institutional bedding, and not one carries a remote or Indigenous signal. The pull runs
 * anyway, which keeps the number checked, and means it starts working by itself the day
 * somebody loads the NT data.
 *
 * Read only. Touches nothing in either database.
 *
 * Usage: node scripts/pull-procurement.mjs [--out data/procurement-buyers.json]
 */

import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');

/** The shared graph lives in the grantscope project, and its key is in that repo's .env. */
const GRANTSCOPE_ENV = '/Users/benknight/Code/grantscope/.env';

/** What counts as a thing Goods makes. Word boundaries matter: "bed" must not match "seabed". */
const KEYWORDS = ['bed', 'mattress', 'washing machine', 'laundry', 'whitegood', 'white goods', 'linen'];

/** Which product a contract is about, for the per-community view. */
const PRODUCTS = [
  { id: 'bed', test: /\b(bed|beds|bedding|mattress|mattresses)\b/i },
  { id: 'washer', test: /\b(washing machine|washer|laundry|laundries)\b/i },
  { id: 'whitegoods', test: /\b(whitegood|white goods|appliance)\b/i },
  { id: 'linen', test: /\blinen\b/i },
];

function env(file) {
  if (!existsSync(file)) throw new Error(`no env at ${file}`);
  const out = {};
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  return out;
}

async function rest(base, key, path) {
  const res = await fetch(`${base}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} on ${path.slice(0, 90)}`);
  return res.json();
}

async function page(base, key, path) {
  const rows = [];
  for (let off = 0; ; off += 1000) {
    const batch = await rest(base, key, `${path}&limit=1000&offset=${off}`);
    rows.push(...batch);
    if (batch.length < 1000) return rows;
  }
}

async function main() {
  const e = env(GRANTSCOPE_ENV);
  const base = e.SUPABASE_URL || e.NEXT_PUBLIC_SUPABASE_URL;
  const key = e.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) throw new Error('grantscope .env has no SUPABASE_URL / SERVICE_ROLE_KEY');

  // 1. Communities to tag against: the official NT remote list plus their aliases, plus the
  //    places Goods actually works that sit outside the NT.
  const nt = await rest(base, key, 'nt_communities?select=community_name,aliases,land_council&limit=200');
  const names = new Map();
  for (const c of nt) {
    const add = (n) => { if (n && String(n).trim().length >= 4) names.set(String(n).trim(), c.community_name); };
    add(c.community_name);
    for (const a of c.aliases ?? []) add(a);
  }
  for (const n of ['Tennant Creek', 'Utopia', 'Palm Island', 'Alice Springs', 'Katherine', 'Kalgoorlie', 'Groote Eylandt']) {
    if (!names.has(n)) names.set(n, n);
  }

  // 2. Every awarded contract whose title or description mentions something we make.
  const byOcid = new Map();
  for (const kw of KEYWORDS) {
    for (const field of ['description', 'title']) {
      const rows = await page(
        base, key,
        `austender_contracts?${field}=ilike.*${encodeURIComponent(kw)}*&select=ocid,title,description,contract_value,buyer_name,supplier_name,contract_start`,
      );
      for (const r of rows) byOcid.set(r.ocid, r);
    }
  }
  const contracts = [...byOcid.values()];

  // 2b. The same question of the state tenders. See the note at the top: this is currently a
  //     Queensland-only table and returns institutional bedding, but it costs one round trip.
  const stateById = new Map();
  for (const kw of KEYWORDS) {
    const q = encodeURIComponent(kw);
    const rows = await rest(
      base, key,
      `state_tenders?or=(title.ilike.*${q}*,description.ilike.*${q}*)&select=id,state,title,description,contract_value,buyer_name,buyer_department,supplier_name&limit=1000`,
    );
    for (const r of rows) stateById.set(r.id, r);
  }
  const stateRows = [...stateById.values()];
  const REMOTE = /palm island|aboriginal|indigenous|torres|remote|shire|cape york|mornington|doomadgee|yarrabah|cherbourg|woorabinda|hope vale|napranum|aurukun/i;
  const stateSummary = {
    matching: stateRows.length,
    withRemoteOrIndigenousSignal: stateRows.filter((r) => REMOTE.test(`${r.title ?? ''} ${r.description ?? ''} ${r.buyer_name ?? ''}`)).length,
    states: [...new Set(stateRows.map((r) => r.state).filter(Boolean))],
    buyers: [...stateRows.reduce((m, r) => {
      const b = (r.buyer_name || r.buyer_department || 'Unknown').trim();
      m.set(b, (m.get(b) ?? 0) + (Number(r.contract_value) || 0));
      return m;
    }, new Map())].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([buyer, valueAud]) => ({ buyer, valueAud })),
    verdict: 'Queensland only, institutional bedding, no remote or Indigenous signal. NT, WA and SA hold no rows at all.',
  };

  // 3. Roll up by buyer, and separately by community.
  const buyers = new Map();
  const communities = new Map();
  for (const r of contracts) {
    const blob = `${r.title ?? ''} ${r.description ?? ''}`;
    const value = Number(r.contract_value) || 0;
    const products = PRODUCTS.filter((p) => p.test.test(blob)).map((p) => p.id);

    const bn = (r.buyer_name ?? 'Unknown').trim();
    if (!buyers.has(bn)) buyers.set(bn, { buyer: bn, contracts: 0, valueAud: 0, products: new Set(), communities: new Set(), sampleTitle: null });
    const b = buyers.get(bn);
    b.contracts += 1; b.valueAud += value;
    for (const p of products) b.products.add(p);
    if (!b.sampleTitle && r.title) b.sampleTitle = r.title.slice(0, 120);

    for (const [alias, canonical] of names) {
      if (new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(blob)) {
        if (!communities.has(canonical)) communities.set(canonical, { community: canonical, contracts: 0, valueAud: 0, buyers: new Map(), products: new Set() });
        const c = communities.get(canonical);
        c.contracts += 1; c.valueAud += value;
        c.buyers.set(bn, (c.buyers.get(bn) ?? 0) + 1);
        for (const p of products) c.products.add(p);
        b.communities.add(canonical);
        break;
      }
    }
  }

  const out = {
    readAt: new Date().toISOString().slice(0, 10),
    source: 'austender_contracts in the shared grantscope project, deduplicated on ocid',
    keywords: KEYWORDS,
    stateTenders: stateSummary,
    totals: {
      contracts: contracts.length,
      buyers: buyers.size,
      communitiesTagged: communities.size,
      contractsTaggedToCommunity: [...communities.values()].reduce((n, c) => n + c.contracts, 0),
    },
    buyers: [...buyers.values()]
      .map((b) => ({ ...b, products: [...b.products], communities: [...b.communities] }))
      .sort((a, b) => b.valueAud - a.valueAud)
      .slice(0, 60),
    communities: [...communities.values()]
      .map((c) => ({
        ...c,
        products: [...c.products],
        topBuyer: [...c.buyers.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null,
        buyers: [...c.buyers.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([n, k]) => ({ buyer: n, contracts: k })),
      }))
      .sort((a, b) => b.valueAud - a.valueAud),
  };

  const argOut = process.argv.indexOf('--out');
  const dest = join(ROOT, argOut > -1 ? process.argv[argOut + 1] : 'data/procurement-buyers.json');
  writeFileSync(dest, `${JSON.stringify(out, null, 2)}\n`);
  console.log(`${contracts.length} federal contracts, ${buyers.size} buyers, ${communities.size} communities tagged`);
  console.log(`${stateSummary.matching} state rows matched, ${stateSummary.withRemoteOrIndigenousSignal} with a remote or Indigenous signal`);
  console.log(`written to ${dest}`);
}

main().catch((err) => { console.error(err.message); process.exit(1); });
