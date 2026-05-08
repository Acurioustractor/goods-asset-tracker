#!/usr/bin/env node
/**
 * EL → Notion sync for the Storyteller Voices database.
 *
 * Pulls Goods-project storytellers + stories from Empathy Ledger Supabase,
 * reports drift vs the current Notion DB, and (when NOTION_TOKEN is set)
 * applies the diff.
 *
 * Architecture: EL is canonical for storyteller/story/consent state.
 * Notion is a mirrored view. This script keeps the mirror honest.
 *
 * Usage:
 *   node tools/sync-storytellers-from-el.mjs           # report only
 *   node tools/sync-storytellers-from-el.mjs --apply   # apply the diff (needs NOTION_TOKEN)
 *   node tools/sync-storytellers-from-el.mjs --json    # machine-readable diff output
 *
 * Env (read from v2/.env.local locally, or process.env):
 *   EMPATHY_LEDGER_SUPABASE_URL  Required.
 *   EMPATHY_LEDGER_SUPABASE_KEY  Required.
 *   EMPATHY_LEDGER_PROJECT_ID    Required (Goods project UUID).
 *   NOTION_TOKEN                 Required for --apply mode.
 *   NOTION_STORYTELLERS_DB_ID    Required for --apply mode (a403a6f2-7376-479b-b9d3-46f459c8837b).
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

async function loadEnv() {
  const envPath = path.join(ROOT, 'v2', '.env.local');
  const env = { ...process.env };
  try {
    const raw = await fs.readFile(envPath, 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
      const [k, ...rest] = trimmed.split('=');
      const v = rest.join('=').trim().replace(/^"|"$/g, '');
      if (!env[k]) env[k] = v;
    }
  } catch {
    console.warn(`[sync] no .env.local at ${envPath}, using process.env`);
  }
  return env;
}

async function elFetch(env, table, params = '') {
  const url = `${env.EMPATHY_LEDGER_SUPABASE_URL}/rest/v1/${table}${params}`;
  const r = await fetch(url, {
    headers: {
      apikey: env.EMPATHY_LEDGER_SUPABASE_KEY,
      Authorization: `Bearer ${env.EMPATHY_LEDGER_SUPABASE_KEY}`,
    },
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`EL ${table} HTTP ${r.status}: ${text.slice(0, 200)}`);
  }
  return r.json();
}

async function getGoodsStorytellers(env) {
  const projectId = env.EMPATHY_LEDGER_PROJECT_ID;
  const storyParams =
    `?project_id=eq.${projectId}` +
    `&syndication_enabled=eq.true` +
    `&consent_withdrawn_at=is.null` +
    `&is_archived=eq.false` +
    `&storyteller_id=not.is.null` +
    `&select=id,title,storyteller_id,story_image_url,location,themes,published_at` +
    `&order=published_at.desc.nullslast`;
  const stories = await elFetch(env, 'stories', storyParams);

  const sids = [...new Set(stories.map((s) => s.storyteller_id).filter(Boolean))];
  let storytellers = [];
  if (sids.length) {
    const sp =
      `?id=in.(${sids.join(',')})` +
      `&select=id,display_name,location,bio,is_elder,is_featured,profile_image_url,cultural_background,tags,is_active`;
    storytellers = await elFetch(env, 'storytellers', sp);
  }

  const tellerById = Object.fromEntries(storytellers.map((t) => [t.id, t]));
  const grouped = {};
  for (const s of stories) {
    const sid = s.storyteller_id;
    if (!grouped[sid]) grouped[sid] = { storyteller: tellerById[sid] ?? null, stories: [] };
    grouped[sid].stories.push(s);
  }

  return Object.values(grouped).filter((g) => g.storyteller != null);
}

async function notionQuery(env, dbId) {
  if (!env.NOTION_TOKEN) {
    return { results: [], error: 'NOTION_TOKEN not set; cannot read Notion DB' };
  }
  const r = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({}),
  });
  if (!r.ok) {
    const text = await r.text();
    return { results: [], error: `Notion HTTP ${r.status}: ${text.slice(0, 200)}` };
  }
  return r.json();
}

function buildDesiredRows(grouped) {
  return grouped
    .filter((g) => g.storyteller && g.storyteller.is_active !== false)
    .map((g) => {
      const t = g.storyteller;
      const headline = g.stories[0];
      return {
        elStorytellerId: t.id,
        Name: t.display_name,
        Role: t.is_elder ? 'Elder' : '',
        Community: (t.location ?? '').split(',')[0].trim(),
        Bio: t.bio ?? '',
        ProfileImageUrl: t.profile_image_url ?? '',
        Featured: !!t.is_featured,
        IsElder: !!t.is_elder,
        StoryCount: g.stories.length,
        HeadlineStory: headline ? { id: headline.id, title: headline.title } : null,
        Consent: 'Verified',
      };
    });
}

function computeDiff(desired, currentNotionRows) {
  const desiredByName = Object.fromEntries(desired.map((d) => [d.Name.toLowerCase(), d]));
  const currentByName = Object.fromEntries(
    currentNotionRows.map((r) => [
      (r.properties?.Name?.title?.[0]?.plain_text ?? '').toLowerCase(),
      r,
    ])
  );

  const toCreate = [];
  const toUpdate = [];
  const toFlag = [];

  for (const [name, d] of Object.entries(desiredByName)) {
    const c = currentByName[name];
    if (!c) toCreate.push(d);
    else toUpdate.push({ existing: c, desired: d });
  }
  for (const [name, c] of Object.entries(currentByName)) {
    if (!desiredByName[name]) toFlag.push(c);
  }
  return { toCreate, toUpdate, toFlag };
}

function report(diff, desired, asJson = false) {
  if (asJson) {
    console.log(JSON.stringify({ desired, diff }, null, 2));
    return;
  }
  console.log(`EL → Notion Storyteller Voices diff`);
  console.log(`====================================`);
  console.log(``);
  console.log(`EL (canonical): ${desired.length} storyteller(s) with consent-clean Goods stories.`);
  for (const d of desired) {
    const tags = [d.IsElder ? 'Elder' : '', d.Featured ? 'Featured' : ''].filter(Boolean).join(' ');
    console.log(`  • ${d.Name.padEnd(28)} (${d.Community.padEnd(20)}) ${d.StoryCount} ${d.StoryCount === 1 ? 'story' : 'stories'}  ${tags}`);
  }
  console.log(``);
  console.log(`To create in Notion (EL has, Notion doesn't): ${diff.toCreate.length}`);
  for (const d of diff.toCreate) console.log(`  + ${d.Name} (${d.Community})`);
  console.log(``);
  console.log(`To update in Notion (both have, may have drifted): ${diff.toUpdate.length}`);
  for (const { desired: d } of diff.toUpdate) console.log(`  ~ ${d.Name}`);
  console.log(``);
  console.log(`To flag (Notion has, EL doesn't agree on consent-clean): ${diff.toFlag.length}`);
  for (const c of diff.toFlag) {
    const name = c.properties?.Name?.title?.[0]?.plain_text ?? '?';
    console.log(`  ⚠ ${name} — Consent should be 'Pending review'`);
  }
}

async function apply(_env, _diff) {
  console.log(``);
  console.log(`[apply] Notion API write calls not yet wired.`);
  console.log(`[apply] Next step: implement creates/updates via the Notion HTTP API.`);
  console.log(`[apply] For this session the diff was applied via Notion MCP (manual).`);
}

async function main() {
  const env = await loadEnv();
  const args = new Set(process.argv.slice(2));
  const asJson = args.has('--json');
  const doApply = args.has('--apply');

  if (!env.EMPATHY_LEDGER_SUPABASE_URL || !env.EMPATHY_LEDGER_SUPABASE_KEY || !env.EMPATHY_LEDGER_PROJECT_ID) {
    console.error('[sync] Missing EL credentials. Set EMPATHY_LEDGER_SUPABASE_URL, EMPATHY_LEDGER_SUPABASE_KEY, EMPATHY_LEDGER_PROJECT_ID.');
    process.exit(1);
  }

  console.error('[sync] Querying EL...');
  const grouped = await getGoodsStorytellers(env);
  const desired = buildDesiredRows(grouped);

  let currentNotionRows = [];
  if (env.NOTION_TOKEN && env.NOTION_STORYTELLERS_DB_ID) {
    console.error('[sync] Querying Notion...');
    const q = await notionQuery(env, env.NOTION_STORYTELLERS_DB_ID);
    if (q.error) console.error(`[sync] ${q.error}`);
    currentNotionRows = q.results ?? [];
  } else {
    console.error('[sync] NOTION_TOKEN/NOTION_STORYTELLERS_DB_ID not set; report-only mode.');
  }

  const diff = computeDiff(desired, currentNotionRows);
  report(diff, desired, asJson);
  if (doApply) await apply(env, diff);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
