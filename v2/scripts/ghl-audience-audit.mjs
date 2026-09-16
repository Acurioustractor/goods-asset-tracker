#!/usr/bin/env node
/**
 * READ-ONLY: print the live GHL count behind every audience defined in
 * src/lib/ghl/smart-lists.ts, and flag the ones that have quietly died.
 *
 * WHY THIS EXISTS. On 17 September 2026 all thirteen audience definitions in
 * that file resolved to between 0 and 9 contacts, against an account holding
 * 580 Goods contacts. The code queried flat `goods-*` tags; the account had
 * moved to the namespaced contract months earlier. Nothing failed, nothing
 * logged, and the reach-out tool simply showed empty lists. This script makes
 * that visible in one command.
 *
 *   npm run audit:audiences
 *
 * Exit code 1 when any audience marked `live` resolves to zero, so it can run
 * in CI later if we ever want it to.
 *
 * SCOPE: this audits TAG-based audiences only. The three pipeline-stage segments
 * (funder-active, funder-prospect, buyer) resolve against open opportunities in
 * GOODS - Funding and GOODS - Buyers, and are not counted here. Check those on
 * the boards, or with scripts/ghl-all-pipelines-audit.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';

const ENV_PATH = path.join(process.cwd(), '.env.local');
if (fs.existsSync(ENV_PATH)) {
  for (const line of fs.readFileSync(ENV_PATH, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}

const TOKEN = process.env.GHL_API_KEY;
const LOC = process.env.GHL_LOCATION_ID;
if (!TOKEN || !LOC) {
  console.error('Missing GHL_API_KEY or GHL_LOCATION_ID. Nothing to audit.');
  process.exit(2);
}

const BASE = 'https://services.leadconnectorhq.com';
const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Version: '2021-07-28',
  'Content-Type': 'application/json',
};

/** Count contacts carrying exactly this tag. */
async function countTag(tag) {
  const res = await fetch(`${BASE}/contacts/search`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      locationId: LOC,
      pageLimit: 1,
      filters: [{ field: 'tags', operator: 'eq', value: tag }],
    }),
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.total ?? 0;
}

/**
 * Read the audience definitions out of the TypeScript source. Parsing the file
 * rather than importing it keeps this a plain node script with no build step,
 * and the shapes here are simple literals.
 */
function readDefinitions() {
  const src = fs.readFileSync(
    path.join(process.cwd(), 'src/lib/ghl/smart-lists.ts'),
    'utf8',
  );
  const out = [];
  // { id: 'x', ... tag: 'y' ... readiness: 'live' } across a block
  const blocks = src.split(/\n  \{\n/).slice(1);
  for (const block of blocks) {
    const id = block.match(/id: '([^']+)'/)?.[1];
    const tag =
      block.match(/\n    tag: '([^']+)'/)?.[1] ??
      block.match(/kind: 'tag', tag: '([^']+)'/)?.[1];
    const readiness = block.match(/readiness: '([^']+)'/)?.[1];
    const blockedOn = block.match(/blockedOn:\s*\n?\s*'([^']+)'/)?.[1];
    if (id && tag && readiness) out.push({ id, tag, readiness, blockedOn });
  }
  return out;
}

const definitions = readDefinitions();
if (!definitions.length) {
  console.error('Parsed no audience definitions. Has smart-lists.ts changed shape?');
  process.exit(2);
}

console.log(`\nGHL audience audit  ·  location ${LOC}  ·  ${new Date().toISOString().slice(0, 10)}\n`);

const dead = [];
for (const d of definitions) {
  const n = await countTag(d.tag);
  const count = n === null ? 'ERR' : String(n);
  let flag = '  ';
  if (n === null) flag = '??';
  else if (d.readiness === 'live' && n === 0) {
    flag = 'XX';
    dead.push(d);
  } else if (n === 0) flag = '..';
  console.log(
    `${flag}  ${d.id.padEnd(26)} ${d.tag.padEnd(30)} ${count.padStart(5)}  ${d.readiness}`,
  );
}

const suppressed = await countTag('comms:do-not-contact');
console.log(`\n     suppressed (comms:do-not-contact): ${suppressed}`);

if (dead.length) {
  console.log(`\nXX  ${dead.length} audience(s) marked 'live' hold nobody:`);
  for (const d of dead) console.log(`      ${d.id} → ${d.tag}`);
  console.log('\n    Either the tag is wrong or nothing applies it. Both are bugs.');
  process.exit(1);
}

const waiting = definitions.filter((d) => d.readiness !== 'live');
if (waiting.length) {
  console.log(`\n..  ${waiting.length} audience(s) waiting on something, which is expected:`);
  for (const d of waiting) console.log(`      ${d.id}: ${d.blockedOn ?? d.readiness}`);
}

console.log('\nEvery live audience holds people.\n');
