#!/usr/bin/env node
/**
 * READ-ONLY pull of investor / funder / philanthropy relationships from GHL.
 *
 * Purpose: seed the QBE Investor Alignment Tool from warm relationships we
 * already hold in the CRM. This script NEVER writes to GHL — it only reads.
 *
 * What it pulls:
 *   1. Location tags, filtered to the investor/funder/capital/grant family.
 *   2. All contacts (paginated), bucketed by which of those tags they carry.
 *   3. Opportunities in the three Strategic pipelines (Capital, Buyer, Partner)
 *      — these carry the real engagement stage + monetary value.
 *
 * Output:
 *   - tmp/ghl-investor-pull.json   (full detail incl. emails — gitignored, NOT committed)
 *   - tmp/ghl-investor-pull.md     (human summary; names/orgs/stage only)
 *
 * Usage:
 *   node scripts/ghl-investor-pull.mjs
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
const BASE = 'https://services.leadconnectorhq.com';
const VERSION = '2021-07-28';
const THROTTLE_MS = 700;
const PAGE_LIMIT = 100;

// Pipelines we care about for the capital raise (env ids if present).
const STRATEGIC_PIPELINES = {
  capital: process.env.GHL_PIPELINE_STRATEGIC_CAPITAL,
  buyer: process.env.GHL_PIPELINE_STRATEGIC_BUYER,
  partner: process.env.GHL_PIPELINE_STRATEGIC_PARTNER,
};

// Tag families that signal an investor/funder/buyer relationship.
const TAG_PATTERNS =
  /(investor|funder|fund|philanthrop|capital|grant|donor|foundation|impact-invest|wholesale|family-office|family office|dfi|cdfi|sefa|vfff|minderoo|snow|centrecorp|paul ramsay|prf)/i;

if (!TOKEN || !LOC) {
  console.error('Missing GHL_API_KEY or GHL_LOCATION_ID in .env.local');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Version: VERSION,
  'Content-Type': 'application/json',
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function ghl(method, urlPath, body) {
  const res = await fetch(`${BASE}${urlPath}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${urlPath} -> ${res.status}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

async function fetchAllContacts() {
  const all = [];
  let searchAfter = null;
  let page = 0;
  while (true) {
    page += 1;
    const body = {
      locationId: LOC,
      pageLimit: PAGE_LIMIT,
      ...(searchAfter ? { searchAfter } : {}),
    };
    const data = await ghl('POST', '/contacts/search', body);
    const contacts = data.contacts || [];
    all.push(...contacts);
    process.stdout.write(`\r  contacts: ${all.length}/${data.total ?? '?'} (page ${page})   `);
    if (contacts.length < PAGE_LIMIT) break;
    const last = contacts[contacts.length - 1];
    searchAfter = last.searchAfter || last.id;
    await sleep(THROTTLE_MS);
  }
  process.stdout.write('\n');
  return all;
}

async function fetchPipelines() {
  try {
    const data = await ghl('GET', `/opportunities/pipelines?locationId=${LOC}`);
    return data.pipelines || [];
  } catch (err) {
    console.error('  pipelines fetch failed:', err.message);
    return [];
  }
}

async function fetchOpportunities(pipelineId) {
  const all = [];
  let startAfter = null;
  let startAfterId = null;
  while (true) {
    const q = new URLSearchParams({
      location_id: LOC,
      pipeline_id: pipelineId,
      limit: '100',
    });
    if (startAfter) q.set('startAfter', startAfter);
    if (startAfterId) q.set('startAfterId', startAfterId);
    let data;
    try {
      data = await ghl('GET', `/opportunities/search?${q.toString()}`);
    } catch (err) {
      console.error(`  opps fetch failed for ${pipelineId}:`, err.message);
      break;
    }
    const opps = data.opportunities || [];
    all.push(...opps);
    const meta = data.meta || {};
    if (opps.length < 100 || !meta.startAfter) break;
    startAfter = meta.startAfter;
    startAfterId = meta.startAfterId;
    await sleep(THROTTLE_MS);
  }
  return all;
}

function stageName(pipeline, stageId) {
  const s = (pipeline?.stages || []).find((x) => x.id === stageId);
  return s?.name || stageId || '';
}

async function main() {
  console.log('READ-ONLY GHL investor/funder pull\n');

  // 1. Tags
  console.log('Fetching location tags...');
  const tagsData = await ghl('GET', `/locations/${LOC}/tags`);
  const allTags = (tagsData.tags || []).map((t) => t.name);
  const investorTags = allTags.filter((t) => TAG_PATTERNS.test(t)).sort();
  console.log(`  ${allTags.length} tags total; ${investorTags.length} match the investor/funder family.`);

  // 2. Contacts
  console.log('Fetching all contacts (read-only)...');
  const contacts = await fetchAllContacts();

  const matched = [];
  for (const c of contacts) {
    const tags = c.tags || [];
    const hit = tags.filter((t) => TAG_PATTERNS.test(t));
    if (hit.length === 0) continue;
    matched.push({
      id: c.id,
      name: [c.firstName, c.lastName].filter(Boolean).join(' ') || c.contactName || c.companyName || '(no name)',
      company: c.companyName || '',
      email: c.email || '',
      phone: c.phone || '',
      tags: hit,
      allTags: tags,
      source: c.source || '',
      dateAdded: c.dateAdded || '',
    });
  }
  console.log(`  ${matched.length} contacts carry an investor/funder-family tag.`);

  // 3. Pipelines + opportunities
  console.log('Fetching pipelines + strategic-pipeline opportunities...');
  const pipelines = await fetchPipelines();
  const pipelineById = Object.fromEntries(pipelines.map((p) => [p.id, p]));

  const strategicOpps = {};
  for (const [key, pid] of Object.entries(STRATEGIC_PIPELINES)) {
    if (!pid) {
      console.log(`  ${key}: no pipeline id in env, skipped.`);
      continue;
    }
    const opps = await fetchOpportunities(pid);
    const pipe = pipelineById[pid];
    strategicOpps[key] = opps.map((o) => ({
      name: o.name || '',
      contactName: o.contact?.name || o.contact?.companyName || '',
      company: o.contact?.companyName || '',
      email: o.contact?.email || '',
      stage: stageName(pipe, o.pipelineStageId),
      status: o.status || '',
      monetaryValue: o.monetaryValue ?? null,
      updatedAt: o.updatedAt || '',
    }));
    console.log(`  ${key} (${pipe?.name || pid}): ${opps.length} opportunities.`);
    await sleep(THROTTLE_MS);
  }

  // 4. Write outputs
  fs.mkdirSync(path.join(process.cwd(), 'tmp'), { recursive: true });
  const jsonPath = path.join(process.cwd(), 'tmp', 'ghl-investor-pull.json');
  const out = {
    pulledAt: new Date().toISOString(),
    totals: {
      allTags: allTags.length,
      investorTags: investorTags.length,
      allContacts: contacts.length,
      matchedContacts: matched.length,
    },
    investorTags,
    pipelines: pipelines.map((p) => ({ id: p.id, name: p.name, stages: (p.stages || []).map((s) => s.name) })),
    matchedContacts: matched,
    strategicOpps,
  };
  fs.writeFileSync(jsonPath, JSON.stringify(out, null, 2));

  // Markdown summary (no phone/email — names, orgs, tags, stage only)
  const lines = [];
  lines.push(`# GHL investor/funder pull — ${out.pulledAt}`);
  lines.push('');
  lines.push(`Read-only. Full detail (incl. emails) in \`tmp/ghl-investor-pull.json\` (gitignored).`);
  lines.push('');
  lines.push(`- Tags total: **${allTags.length}**, investor/funder-family: **${investorTags.length}**`);
  lines.push(`- Contacts total: **${contacts.length}**, with an investor-family tag: **${matched.length}**`);
  lines.push('');
  lines.push('## Investor/funder-family tags in the CRM');
  lines.push(investorTags.length ? investorTags.map((t) => `- \`${t}\``).join('\n') : '_none_');
  lines.push('');
  lines.push('## Strategic pipeline opportunities');
  for (const [key, opps] of Object.entries(strategicOpps)) {
    lines.push(`### ${key}`);
    if (!opps?.length) { lines.push('_none_'); lines.push(''); continue; }
    for (const o of opps.sort((a, b) => (b.monetaryValue || 0) - (a.monetaryValue || 0))) {
      const val = o.monetaryValue ? ` · $${Number(o.monetaryValue).toLocaleString()}` : '';
      lines.push(`- **${o.name || o.contactName}** — ${o.stage} (${o.status})${val}`);
    }
    lines.push('');
  }
  lines.push('## Tagged contacts (name · org · tags)');
  for (const c of matched.sort((a, b) => a.name.localeCompare(b.name))) {
    lines.push(`- **${c.name}**${c.company ? ` (${c.company})` : ''} — ${c.tags.map((t) => `\`${t}\``).join(', ')}`);
  }
  const mdPath = path.join(process.cwd(), 'tmp', 'ghl-investor-pull.md');
  fs.writeFileSync(mdPath, lines.join('\n'));

  console.log(`\nWrote:\n  ${jsonPath}\n  ${mdPath}`);
}

main().catch((err) => {
  console.error('\nFATAL:', err.message);
  process.exit(1);
});
