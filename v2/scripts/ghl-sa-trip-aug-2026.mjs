#!/usr/bin/env node
/**
 * The SA round, Aug 2026: tag the eleven trip contacts and open one Community
 * Pathways opportunity per organisation.
 *
 * Dry-run by default. Nothing is written without --apply.
 *
 *   node scripts/ghl-sa-trip-aug-2026.mjs            # show the plan
 *   node scripts/ghl-sa-trip-aug-2026.mjs --apply    # write it
 *
 * Tags follow the convention already proven on Maningrida: project / lane /
 * place / role, plus source:sa-trip-aug-2026 so the whole round stays one
 * filterable cohort. Tags are ADDED, never replaced: existing tags survive.
 *
 * Opportunities belong to the organisation, not the person. Each one opens at
 * Listening to match the Notion Ceduna record (Pathway stage: Yarn, Authority
 * status: Listening).
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
  console.error('Missing GHL_API_KEY or GHL_LOCATION_ID in v2/.env.local');
  process.exit(1);
}
const BASE = 'https://services.leadconnectorhq.com';
const H = { Authorization: `Bearer ${TOKEN}`, Version: '2021-07-28', 'Content-Type': 'application/json' };
const APPLY = process.argv.includes('--apply');

const COMMON = ['project:goods-on-country', 'source:sa-trip-aug-2026'];

// Identified by email where one exists, otherwise by name + company. Every
// person below was added to GHL on 11 Aug 2026 off the SA round.
const PEOPLE = [
  { email: 'peni@cac.asn.au',                   name: 'peni ligadua',     org: 'Ceduna Aboriginal Corporation',  tags: ['lane:community', 'place:ceduna', 'role:community'] },
  { email: null, name: 'kerry colbung',         org: 'Ceduna Aboriginal Corporation',  tags: ['lane:community', 'place:ceduna', 'role:community'] },
  { email: 'michelle.duregon@fwcp.com.au',      name: 'michelle duregon', org: 'Far West Community Partnerships', tags: ['lane:community', 'place:ceduna', 'role:partner'] },
  { email: 'kerobinson@redcross.org.au',        name: 'kerry robinson',   org: 'Australian Red Cross',           tags: ['lane:community', 'place:ceduna', 'role:service'] },
  { email: null, name: 'ratish',                org: 'Centacare Ceduna',               tags: ['lane:community', 'place:ceduna', 'role:service'] },
  { email: 'paula@yalata.com.au',               name: 'paula',            org: 'Yalata Aboriginal Community Inc.', tags: ['lane:community', 'place:yalata', 'role:community'] },
  { email: 'ceo@yalata.com.au',                 name: 'dave',             org: 'Yalata Aboriginal Community Inc.', tags: ['lane:community', 'place:yalata', 'role:community'] },
  { email: 'jarrad.edwards@kokatha.com.au',     name: 'jarrad edwards',   org: 'Kokatha Aboriginal Corporation', tags: ['lane:community', 'place:port-augusta', 'role:community'] },
  { email: 'jessie.rabig767@schools.sa.edu.au', name: 'jessie rabig',     org: 'Port Augusta Secondary School',  tags: ['lane:community', 'place:port-augusta', 'role:service'] },
  { email: 'info@tarnda.com.au',                name: 'bryce cawte',      org: 'Tarnda',                         tags: ['lane:community', 'place:adelaide', 'role:partner'] },
  // FRRR is a funding door, not a community pathway. No lane:community, no
  // place, and no opportunity: it does not belong in Community Pathways.
  { email: 'j.allison@frrr.org.au',             name: 'jai allison',      org: 'FRRR',                           tags: ['role:funder'] },
];

// One opportunity per organisation. The named contact is the door, not the owner
// of the pathway. Port Augusta Secondary and FRRR are deliberately absent.
const ORGS = [
  { org: 'Ceduna Aboriginal Corporation',   via: 'peni@cac.asn.au' },
  { org: 'Far West Community Partnerships', via: 'michelle.duregon@fwcp.com.au' },
  { org: 'Centacare Ceduna',                via: null, viaName: 'ratish' },
  { org: 'Australian Red Cross (Ceduna)',   via: 'kerobinson@redcross.org.au' },
  { org: 'Yalata Aboriginal Community Inc.', via: 'paula@yalata.com.au' },
  { org: 'Kokatha Aboriginal Corporation',  via: 'jarrad.edwards@kokatha.com.au' },
  { org: 'Tarnda',                          via: 'info@tarnda.com.au' },
];

const PIPELINE_NAME = 'Goods — Community Pathways';
const STAGE_NAME = 'Listening';

async function api(method, url, body) {
  const r = await fetch(`${BASE}${url}`, { method, headers: H, body: body ? JSON.stringify(body) : undefined });
  const text = await r.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!r.ok) throw new Error(`${method} ${url} -> ${r.status} ${text.slice(0, 300)}`);
  return json;
}

async function allContacts() {
  const out = [];
  let after;
  for (let page = 0; page < 40; page++) {
    const body = { locationId: LOC, pageLimit: 100, sort: [{ field: 'dateAdded', direction: 'desc' }] };
    if (after) body.searchAfter = after;
    const j = await api('POST', '/contacts/search', body);
    const batch = j.contacts || [];
    out.push(...batch);
    if (batch.length < 100) break;
    after = batch[batch.length - 1].searchAfter;
    if (!after) break;
  }
  return out;
}

function findContact(contacts, spec) {
  if (spec.email) {
    const hit = contacts.find((c) => (c.email || '').toLowerCase() === spec.email);
    if (hit) return hit;
  }
  return contacts.find((c) => {
    const n = (c.contactName || `${c.firstName || ''} ${c.lastName || ''}`).trim().toLowerCase();
    return n === spec.name && (c.companyName || '').toLowerCase() === spec.org.toLowerCase();
  });
}

(async () => {
  console.log(APPLY ? '=== APPLYING ===' : '=== DRY RUN (no writes) ===');

  const contacts = await allContacts();
  console.log(`Scanned ${contacts.length} contacts.\n`);

  // --- 1. tags -------------------------------------------------------------
  console.log('--- 1. Tags ---');
  const resolved = new Map();
  let missing = 0;
  for (const spec of PEOPLE) {
    const c = findContact(contacts, spec);
    if (!c) {
      console.log(`  !! NOT FOUND: ${spec.name} (${spec.org})`);
      missing++;
      continue;
    }
    resolved.set(spec.email || spec.name, c);
    const existing = c.tags || [];
    const want = [...COMMON, ...spec.tags];
    const toAdd = want.filter((t) => !existing.includes(t));
    const label = `${(c.contactName || spec.name).padEnd(20)} ${spec.org}`;
    if (!toAdd.length) {
      console.log(`  = ${label}\n      already tagged, nothing to do`);
      continue;
    }
    console.log(`  + ${label}\n      add: ${toAdd.join(', ')}${existing.length ? `\n      keep: ${existing.join(', ')}` : ''}`);
    if (APPLY) {
      await api('PUT', `/contacts/${c.id}`, { tags: [...new Set([...existing, ...want])] });
    }
  }

  // --- 2. opportunities ----------------------------------------------------
  console.log('\n--- 2. Community Pathways opportunities ---');
  const pipes = await api('GET', `/opportunities/pipelines?locationId=${LOC}`);
  const pipeline = (pipes.pipelines || []).find((p) => p.name === PIPELINE_NAME);
  if (!pipeline) throw new Error(`Pipeline not found: ${PIPELINE_NAME}`);
  const stage = (pipeline.stages || []).find((s) => s.name === STAGE_NAME);
  if (!stage) throw new Error(`Stage not found: ${STAGE_NAME}`);
  console.log(`  pipeline ${pipeline.id} / stage "${STAGE_NAME}" ${stage.id}\n`);

  const search = await api('GET', `/opportunities/search?location_id=${LOC}&pipeline_id=${pipeline.id}&limit=100`);
  const existingNames = new Set((search.opportunities || []).map((o) => o.name));

  for (const o of ORGS) {
    const c = resolved.get(o.via || o.viaName);
    const name = `${o.org} — Goods pathway`;
    if (!c) { console.log(`  !! no contact resolved for ${o.org}, skipping`); continue; }
    if (existingNames.has(name)) { console.log(`  = ${name} (already open)`); continue; }
    console.log(`  + ${name}\n      stage: ${STAGE_NAME}   door: ${c.contactName || o.via}`);
    if (APPLY) {
      await api('POST', '/opportunities/', {
        pipelineId: pipeline.id,
        locationId: LOC,
        name,
        pipelineStageId: stage.id,
        status: 'open',
        contactId: c.id,
      });
    }
  }

  console.log(`\n${APPLY ? 'Applied.' : 'Dry run complete.'}${missing ? `  ${missing} contact(s) not found.` : ''}`);
})().catch((e) => { console.error('\nFAILED:', e.message); process.exit(1); });
