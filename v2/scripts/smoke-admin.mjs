/**
 * Load every admin surface and say which ones are broken.
 *
 * Ben, 17 September 2026, after a day of merging and deleting routes: "let's come back to the
 * admin and test it all."
 *
 * A build that passes proves the code compiles. It does not prove a page renders, because every
 * one of these fetches live data at request time and a bad column name, a missing row or a stale
 * join only shows up when somebody opens it. This opens all of them.
 *
 * It walks app/admin for routes, fills dynamic segments from real ids in the live database, and
 * hits every tab on the hubs. A route is a pass on 200, or on a 307 to the login gate. Anything
 * else is printed with its status and the first line of the error page.
 *
 *   node --env-file=.env.local scripts/smoke-admin.mjs            (against localhost:3013)
 *   BASE=http://localhost:3000 node --env-file=.env.local scripts/smoke-admin.mjs
 *
 * NEVER use the Supabase MCP for v2 data.
 */
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const BASE = process.env.BASE ?? 'http://localhost:3013';
const root = process.cwd();

const walk = (dir, prefix = '') => {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) out.push(...walk(join(dir, e.name), `${prefix}/${e.name}`));
    else if (e.name === 'page.tsx') out.push(prefix || '');
  }
  return out;
};

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Real ids, so every dynamic route is tested against a row that actually exists.
const [comm, asset, machine, order, product, batch] = await Promise.all([
  sb.from('communities').select('id').limit(1).single(),
  sb.from('assets').select('unique_id').not('unique_id', 'is', null).limit(1).single(),
  sb.from('assets').select('machine_id').not('machine_id', 'is', null).limit(1).single(),
  sb.from('orders').select('id').limit(1).single(),
  sb.from('products').select('slug').limit(1).single(),
  sb.from('assets').select('number').not('number', 'is', null).limit(1).single(),
]);

// Empathy Ledger is the canonical store for stories, so the edit route's id comes from there.
const el = createClient(process.env.EMPATHY_LEDGER_SUPABASE_URL, process.env.EMPATHY_LEDGER_SUPABASE_KEY);
const elStory = await el.from('stories').select('id').limit(1).single();

const FILL = {
  '[id]': {
    '/admin/communities/[id]': comm.data?.id,
    '/admin/orders/[id]': order.data?.id,
    // Pathway and report-template ids live in code, so they are read from there.
    '/admin/pathways/[id]': 'tennant-creek',
    '/admin/el-stories/[id]/edit': elStory.data?.id,
  },
  '[templateId]': 'funder-impact',
  '[unique_id]': asset.data?.unique_id,
  '[machine_id]': machine.data?.machine_id,
  '[slug]': product.data?.slug,
  '[batch]': batch.data?.number,
};

const routes = walk(join(root, 'src/app/admin')).map((r) => `/admin${r}`);

// The two hubs carry their surfaces as tabs, so a tab is a surface and gets tested like one.
const EXTRA = [
  ...['atlas', 'registry', 'quotes', 'el-stories', 'el-storytellers', 'curated', 'community'].map((t) => `/admin/voices?tab=${t}`),
  ...['ask', 'funders', 'loi', 'pipeline'].map((t) => `/admin/deals?tab=${t}`),
  '/admin/procurement?view=places', '/admin/procurement?view=when', '/admin/procurement?view=rules',
  '/admin/procurement?state=NT&known=1', '/admin#routes',
];

const targets = [];
const skipped = [];
for (const r of routes) {
  if (!r.includes('[')) { targets.push(r); continue; }
  let filled = r;
  for (const [seg, val] of Object.entries(FILL)) {
    const v = typeof val === 'object' ? val[r] : val;
    if (filled.includes(seg)) {
      if (!v) { filled = null; break; }
      filled = filled.replace(seg, encodeURIComponent(v));
    }
  }
  if (filled && !filled.includes('[')) targets.push(filled);
  else skipped.push(r);
}
targets.push(...EXTRA);

const fails = [];
for (const t of targets) {
  let status = 0;
  let detail = '';
  try {
    const res = await fetch(`${BASE}${t}`, { redirect: 'manual' });
    status = res.status;
    if (status >= 400) {
      const body = await res.text();
      detail = (body.match(/<h2[^>]*>([^<]{5,140})</) ?? body.match(/([A-Z][a-zA-Z]*Error: [^<\n]{5,140})/) ?? ['', ''])[1].trim();
    }
  } catch (e) {
    detail = e.message;
  }
  const ok = status === 200 || status === 307 || status === 308;
  if (!ok) fails.push({ t, status, detail });
  process.stdout.write(ok ? '.' : 'X');
}

console.log(`\n\n${targets.length} surfaces opened against ${BASE}. ${targets.length - fails.length} fine, ${fails.length} broken.`);
if (skipped.length) console.log(`  ${skipped.length} skipped, no id available: ${skipped.join(', ')}`);

if (fails.length) {
  console.error('');
  for (const f of fails) console.error(`  ${String(f.status).padEnd(4)} ${f.t}${f.detail ? `\n       ${f.detail}` : ''}`);
  process.exit(1);
}
