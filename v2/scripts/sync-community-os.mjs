#!/usr/bin/env node
// Regenerate v2/src/lib/data/community-os-published.json from the Notion hub.
// Reads only rows: Publish to site = true AND Consent status = "Cleared for public".
// Needs NOTION_TOKEN. No token -> leaves the snapshot unchanged.
import { writeFileSync } from 'node:fs';
const TOKEN = process.env.NOTION_TOKEN;
const COMMUNITIES_DB = process.env.NOTION_COMMUNITIES_DB_ID || '8c940ea1376847a29389d1ed12e08b66';
const STORIES_DB = process.env.NOTION_STORIES_DB_ID || 'a51611e2e25a4daab47cb20a71623983';
const OUT = new URL('../src/lib/data/community-os-published.json', import.meta.url);
if (!TOKEN) { console.error('NOTION_TOKEN not set — snapshot unchanged.'); process.exit(0); }
const plain = (r) => Array.isArray(r) ? r.map((x) => x?.plain_text ?? '').join('').trim() : '';
async function q(db) {
  const res = await fetch(`https://api.notion.com/v1/databases/${db}/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
    body: JSON.stringify({ filter: { and: [
      { property: 'Publish to site', checkbox: { equals: true } },
      { property: 'Consent status', select: { equals: 'Cleared for public' } } ] } }),
  });
  if (!res.ok) throw new Error(`Notion ${db}: ${res.status}`);
  return (await res.json()).results ?? [];
}
const communities = (await q(COMMUNITIES_DB)).map((p) => { const x = p.properties; return {
  id: String(p.id), name: plain(x['Community']?.title), state: x['State']?.select?.name ?? null,
  bedsDeployed: typeof x['Beds deployed']?.number === 'number' ? x['Beds deployed'].number : null,
  washingMachines: typeof x['Washing machines']?.number === 'number' ? x['Washing machines'].number : null,
  relationshipStage: x['Relationship stage']?.select?.name ?? null,
  provesOrTests: plain(x['What this place proves or tests']?.rich_text) || null,
  storytellers: plain(x['Storytellers documented']?.rich_text) || null, notionUrl: '' }; }).filter((c) => c.name);
const stories = (await q(STORIES_DB)).map((p) => { const x = p.properties; return {
  id: String(p.id), title: plain(x['Story / Media']?.title),
  storyteller: plain(x['Storyteller']?.rich_text) || null, type: x['Type']?.select?.name ?? null, notionUrl: '' }; }).filter((s) => s.title);
writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString().slice(0, 10), communities, stories }, null, 2) + '\n');
console.log(`Snapshot: ${communities.length} communities, ${stories.length} stories.`);
