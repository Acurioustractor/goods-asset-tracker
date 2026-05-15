#!/usr/bin/env node
// Backfill crm_deals.metadata.community_id by matching deal titles + contacts
// against an explicit ruleset. Conservative: only sale/procurement deals that
// clearly target a specific community get linked. Funder grants and
// supplier/procurement deals stay unlinked.

import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const apply = process.argv.includes('--apply');

// Explicit rules. Order matters — first match wins.
// Use regexes that target the deal title; case-insensitive.
const RULES = [
  // Direct community names
  { pattern: /palm island/i,                  community_id: 'palm-island' },
  { pattern: /picc/i,                          community_id: 'palm-island' },
  { pattern: /tennant creek/i,                 community_id: 'tennant-creek' },
  { pattern: /julalikari/i,                    community_id: 'tennant-creek' }, // Julalikari Council = TC
  { pattern: /anyinginyi/i,                    community_id: 'tennant-creek' }, // Anyinginyi Health = TC
  { pattern: /wilya janta/i,                   community_id: 'tennant-creek' },
  { pattern: /utopia|oonchiumpa/i,             community_id: 'utopia' },
  { pattern: /centrecorp/i,                    community_id: 'utopia' }, // Centrecorp beds destined for Utopia
  { pattern: /mala['']?la/i,                   community_id: 'maningrida' }, // Mala'la Health Service = Maningrida
  { pattern: /maningrida|homeland school/i,    community_id: 'maningrida' },
  { pattern: /alice springs|mparntwe/i,        community_id: 'alice-springs' },
  { pattern: /kalgoorlie|ninga mia/i,          community_id: 'kalgoorlie' },
  { pattern: /mt isa|mount isa|kalkadoon/i,    community_id: 'mt-isa' },
  { pattern: /mutitjulu/i,                     community_id: 'mutitjulu' },
  { pattern: /groote/i,                        community_id: 'groote-archipelago' },
];

// Patterns we deliberately do NOT match (funders, suppliers, generic).
// Listed here only for documentation / human review.
const NON_COMMUNITY_PATTERNS = [
  /snow foundation/i,
  /sefa/i,
  /qbe foundation/i,
  /the funding network/i,
  /frrr/i,
  /vincent fairfax|vfff/i,
  /amp spark/i,
  /tim fairfax/i,
  /tara castle/i,
  /nick miller/i,
  /bradley clair/i,
  /giant leap/i,
  /dusseldorp/i,
  /minderoo/i,
  /real innovation fund/i,    // multi-community fund
  /defy/i,                    // supplier
  /envirobank/i,              // supplier
  /steel poles|canvas supplier|speed queen/i, // suppliers
  /qic brisbane/i,            // corporate RAP, no specific community
  /miwatj/i,                  // region-wide health service, ambiguous
  /community shed/i,          // multi-community partner
  /red dust/i,                // ambiguous
  /npy women/i,               // multi-community
];

function matchCommunity(deal) {
  const title = deal.title || '';
  for (const rule of RULES) {
    if (rule.pattern.test(title)) return rule.community_id;
  }
  return null;
}

async function run() {
  const { data: deals, error: dErr } = await supabase
    .from('crm_deals')
    .select('id, title, deal_type, pipeline_stage, amount_cents, units, metadata');
  if (dErr) { console.error('deals load failed:', dErr); process.exit(1); }

  const matches = [];
  const skipped = [];
  const unmatched = [];

  for (const d of deals) {
    const existing = (d.metadata || {}).community_id;
    if (existing) {
      skipped.push({ ...d, reason: `already linked to ${existing}` });
      continue;
    }
    const community_id = matchCommunity(d);
    if (community_id) {
      matches.push({ deal: d, community_id });
    } else {
      // Classify why
      const title = d.title || '';
      const isNonCommunity = NON_COMMUNITY_PATTERNS.some((p) => p.test(title));
      unmatched.push({ ...d, classified: isNonCommunity ? 'funder/supplier (expected)' : 'unmatched' });
    }
  }

  console.log(`Total deals:      ${deals.length}`);
  console.log(`Already linked:   ${skipped.length}`);
  console.log(`Will link:        ${matches.length}`);
  console.log(`Skipped:          ${unmatched.length}`);
  console.log();

  if (matches.length) {
    console.log('Will link:');
    for (const m of matches) {
      console.log(`  ${m.community_id.padEnd(22)} <- ${m.deal.title}`);
    }
    console.log();
  }
  const unexpected = unmatched.filter((u) => u.classified === 'unmatched');
  if (unexpected.length) {
    console.log('Unmatched (review these — may be missing rules):');
    for (const u of unexpected) {
      console.log(`  ${u.title}`);
    }
    console.log();
  }
  const expected = unmatched.filter((u) => u.classified !== 'unmatched');
  console.log(`Expected non-community (funders/suppliers/ambiguous): ${expected.length}`);

  if (!apply) {
    console.log('\nDry-run only. Re-run with --apply to write metadata.community_id.');
    return;
  }

  console.log('\nApplying...');
  for (const m of matches) {
    const newMeta = { ...(m.deal.metadata || {}), community_id: m.community_id };
    const { error } = await supabase
      .from('crm_deals')
      .update({ metadata: newMeta })
      .eq('id', m.deal.id);
    if (error) {
      console.error(`  fail ${m.deal.title}: ${error.message}`);
    } else {
      console.log(`  ok   ${m.community_id} <- ${m.deal.title}`);
    }
  }
}

run().catch((e) => { console.error(e); process.exit(1); });
