/**
 * READ-ONLY per-community integrity judge for the assets register.
 *
 * check-asset-drift.mjs guards the HEADLINE totals (540/177/363). This script
 * guards the layer below, where every real counting error has actually
 * happened: per-community splits (Utopia 147 vs Community OS's 169, the
 * Maningrida 18/40 split), banned products (Weave Bed rows), unknown
 * communities appearing in the register, and the washer stale-row gap moving.
 *
 * The per-community numbers are NOT mirrored here. They are parsed straight
 * out of src/lib/data/community-canonical.ts, which is the single source of
 * truth and is itself locked to CANONICAL_ASSETS by
 * community-canonical.guards.test.ts. Each failure cites the ruling recorded
 * on the canon entry — fix the canon (with a Ben ruling) or investigate the
 * register write; never hand-patch a surface.
 *
 * Always prints a full per-community scoreboard, pass or fail, so a green run
 * doubles as the live reconciliation view that used to be assembled by hand in
 * wiki/investor/10-community-counts.md.
 *
 *   node --env-file=.env.local scripts/check-register-integrity.mjs   (from v2/)
 *
 * Dependency-free (global fetch + REST) so it runs in any fresh worktree.
 * NEVER use the Supabase MCP for v2 data — wrong-project risk; see CLAUDE.md.
 */
import { readFileSync } from 'node:fs';

// ── Load canon from the .ts source (no mirrored numbers in this file) ────────
const canonSrc = readFileSync(new URL('../src/lib/data/community-canonical.ts', import.meta.url), 'utf8');
const assetCanonSrc = readFileSync(new URL('../src/lib/data/asset-canonical.ts', import.meta.url), 'utf8');

function parseEntries(src) {
  const body = src.match(/COMMUNITY_BED_CANON[^=]*=\s*\[([\s\S]*?)\]\s*as const/)?.[1];
  if (!body) throw new Error('cannot parse COMMUNITY_BED_CANON from community-canonical.ts');
  const entries = [];
  for (const m of body.matchAll(/\{([\s\S]*?)\},/g)) {
    const block = m[1];
    const get = (field) => block.match(new RegExp(`${field}:\\s*'([^']*)'`))?.[1];
    const getNum = (field) => Number(block.match(new RegExp(`${field}:\\s*(\\d+)`))?.[1]);
    entries.push({
      id: get('id'),
      registerName: get('registerName'),
      basketBeds: getNum('basketBeds'),
      stretchBeds: getNum('stretchBeds'),
      ruling: get('ruling') ?? block.match(/ruling:\s*'([\s\S]*?)',/)?.[1] ?? '(ruling not parsed)',
    });
  }
  return entries;
}

function parseRecord(src, name) {
  const body = src.match(new RegExp(`${name}[^=]*=\\s*\\{([\\s\\S]*?)\\}`))?.[1];
  if (!body) throw new Error(`cannot parse ${name}`);
  const rec = {};
  for (const m of body.matchAll(/'?([a-z0-9-]+)'?:\s*(\d+)/g)) rec[m[1]] = Number(m[2]);
  return rec;
}

const CANON = parseEntries(canonSrc);
const ALLOWED_PRODUCTS = [...canonSrc.matchAll(/ALLOWED_REGISTER_PRODUCTS\s*=\s*\[([^\]]*)\]/g)][0]?.[1]
  .match(/'([^']+)'/g)?.map((s) => s.replace(/'/g, '')) ?? [];
const WASHER_STALE = parseRecord(canonSrc, 'WASHER_STALE_DEPLOYED_ROWS');
const WASHERS_BY_COMMUNITY = parseRecord(assetCanonSrc, 'WASHERS_IN_COMMUNITY_BY_COMMUNITY');
if (!CANON.length || !ALLOWED_PRODUCTS.length) throw new Error('canon parse produced empty sets — refusing to run');

// ── Connect (wrong-project guard) ────────────────────────────────────────────
const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/['"]/g, '');
const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/['"]/g, '');
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (run with --env-file=.env.local).');
  process.exit(2);
}
const GOODS_PROJECT_REF = 'cwsyhpiuepvdjtxaozwf';
if (!url.includes(GOODS_PROJECT_REF)) {
  console.error(`Wrong-project guard: SUPABASE_URL is ${url}, not the Goods project (${GOODS_PROJECT_REF}). Refusing to run.`);
  process.exit(2);
}

const rows = [];
for (let from = 0; ; from += 1000) {
  const res = await fetch(`${url}/rest/v1/assets?select=product,status,quantity,community&limit=1000&offset=${from}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) { console.error('fetch error:', res.status, await res.text()); process.exit(2); }
  const page = await res.json();
  rows.push(...page);
  if (page.length < 1000) break;
}

const qty = (r) => r.quantity ?? 1;
const deployed = rows.filter((r) => r.status === 'deployed');

// live per-community aggregation
const live = {};
for (const r of deployed) {
  const c = r.community ?? '(null)';
  live[c] ??= {};
  live[c][r.product] = (live[c][r.product] ?? 0) + qty(r);
}

const failures = [];
const cite = (msg, ruling) => failures.push(`${msg}\n      RULING: ${ruling}`);

// 1. Banned / unknown products anywhere in the register (any status).
for (const p of new Set(rows.map((r) => r.product))) {
  if (!ALLOWED_PRODUCTS.includes(p)) {
    cite(
      `product '${p}' is not an allowed register product (${rows.filter((r) => r.product === p).length} rows)`,
      p && /weave/i.test(p)
        ? 'Weave Bed was discontinued and never produced at scale; rows should be Stretch Bed (CLAUDE.md products section)'
        : 'ALLOWED_REGISTER_PRODUCTS in community-canonical.ts',
    );
  }
}

// 2. Per-community bed splits vs canon.
console.log('Per-community register vs canon (beds, status=deployed):\n');
console.log('  community            basket  reg    stretch  reg    total  reg    status');
for (const c of CANON) {
  const l = live[c.registerName] ?? {};
  const lb = l['Basket Bed'] ?? 0;
  const ls = l['Stretch Bed'] ?? 0;
  const ok = lb === c.basketBeds && ls === c.stretchBeds;
  const total = c.basketBeds + c.stretchBeds;
  console.log(
    `  ${c.registerName.padEnd(20)} ${String(c.basketBeds).padStart(5)} ${String(lb).padStart(5)}  ${String(c.stretchBeds).padStart(6)} ${String(ls).padStart(5)}  ${String(total).padStart(5)} ${String(lb + ls).padStart(5)}    ${ok ? 'OK' : 'FAIL'}`,
  );
  if (lb !== c.basketBeds) cite(`${c.registerName}: Basket Beds register=${lb}, canon=${c.basketBeds}`, c.ruling);
  if (ls !== c.stretchBeds) cite(`${c.registerName}: Stretch Beds register=${ls}, canon=${c.stretchBeds}`, c.ruling);
}

// 3. Communities in the register that canon doesn't know.
const canonNames = new Set(CANON.map((c) => c.registerName));
for (const name of Object.keys(live)) {
  const beds = (live[name]['Basket Bed'] ?? 0) + (live[name]['Stretch Bed'] ?? 0);
  if (!canonNames.has(name) && beds > 0 && name !== 'Pending Delivery') {
    cite(
      `register has ${beds} deployed bed(s) in '${name}', which has no per-community canon entry`,
      'New deliveries need a Ben count ruling + a COMMUNITY_BED_CANON entry before public figures move (10-community-counts.md pattern)',
    );
  }
}

// 4. Washer stale-row gap must be EXACTLY the ruled gap, per community.
const slugByRegisterName = Object.fromEntries(CANON.map((c) => [c.registerName, c.id]));
console.log('\nWashers (curated canon vs register deployed rows):\n');
console.log('  community            canon  register  ruled-stale  status');
let washerHeaderPrinted = false;
for (const [name, products] of Object.entries(live)) {
  const regWashers = products['Washing Machine'] ?? 0;
  const slug = slugByRegisterName[name] ?? name;
  const canonWashers = WASHERS_BY_COMMUNITY[slug] ?? 0;
  const ruledStale = WASHER_STALE[slug] ?? 0;
  if (regWashers === 0 && canonWashers === 0) continue;
  washerHeaderPrinted = true;
  const ok = regWashers === canonWashers + ruledStale;
  console.log(
    `  ${name.padEnd(20)} ${String(canonWashers).padStart(5)} ${String(regWashers).padStart(9)} ${String(ruledStale).padStart(12)}  ${ok ? 'OK' : 'FAIL'}`,
  );
  if (!ok) {
    cite(
      `${name}: register has ${regWashers} deployed washer rows; ruling allows ${canonWashers} in community + ${ruledStale} known-stale = ${canonWashers + ruledStale}`,
      "Ben 2026-07-21: washers in community = 22 (Maningrida 8, Tennant Creek 9, Palm Island 4, Alice Springs 1, Darwin 0); stale rows TC 7 / Alice 2 / Darwin 1 await restatus to 'retired'. If the restatus landed, clear WASHER_STALE_DEPLOYED_ROWS and hard-check washers.",
    );
  }
}
if (!washerHeaderPrinted) console.log('  (no washer rows found)');

// ── Verdict ──────────────────────────────────────────────────────────────────
if (failures.length) {
  console.error(`\nREGISTER INTEGRITY: ${failures.length} FAILURE(S)\n`);
  failures.forEach((f, i) => console.error(`  ${i + 1}. ${f}\n`));
  console.error('Fix the process, not the surface: either a bad write landed in the register');
  console.error('(investigate + correct the register) or a real delivery happened (get a Ben');
  console.error('ruling, update community-canonical.ts, and let the guards re-verify).');
  process.exit(1);
}
console.log('\nOK — every community in the live register matches its ruled canon.');
