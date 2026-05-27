#!/usr/bin/env node
// Tag the 18 Goods trip videos in EL `media_assets` so the field-notes
// resolver can match them by cultural_tags.
//
// Idempotent: re-running OR-merges the canonical tag set into whatever is
// already there (no duplicates, no removals). Re-run after every upload of
// new trip videos.
//
// Mapping below is derived from filenames. Edit the TAG_PLAN when new
// videos land; everything else is generic.

import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL;
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY;
const PROJECT_ID = '6bd47c8a-e676-456f-aa25-ddcbb5a31047';

if (!EL_URL || !EL_KEY) {
  console.error('Missing EMPATHY_LEDGER_SUPABASE_URL or EMPATHY_LEDGER_SUPABASE_KEY in .env.local');
  process.exit(1);
}

// Tags applied to every Goods trip video. Trip-level metadata.
const BASE_TAGS = ['media-type:video', 'format:video', 'trip:may-2026', 'goods-staff-capture'];

// Per-filename overlay. Match is case-insensitive substring on the filename
// (after removing the extension). First match wins.
const TAG_PLAN = [
  {
    match: /utopia sunrise/i,
    tags: ['community:utopia-homelands', 'place:utopia', 'use:atmosphere', 'use:establishing', 'placement:overlay-fullscreen'],
  },
  {
    match: /utopia sunset/i,
    tags: ['community:utopia-homelands', 'place:utopia', 'use:atmosphere', 'use:closing', 'placement:overlay-fullscreen'],
  },
  {
    match: /walking through grass/i,
    tags: ['community:utopia-homelands', 'place:utopia', 'use:atmosphere', 'use:b-roll', 'placement:overlay-fullscreen'],
  },
  {
    match: /timelapse boys/i,
    tags: ['community:alice-springs', 'event:alice-build', 'cohort:boys', 'use:timelapse', 'placement:gallery'],
  },
  {
    match: /timelapse full build/i,
    tags: ['community:alice-springs', 'event:alice-build', 'use:timelapse', 'placement:gallery'],
  },
  {
    // Cinema-grade single clip for the page top (boys building). cohort:*
    // lets us target boys vs girls vs fullas individually.
    match: /boys making/i,
    tags: ['community:alice-springs', 'event:alice-build', 'cohort:boys', 'use:assembly', 'placement:cinema', 'placement:gallery'],
  },
  {
    match: /girls making/i,
    tags: ['community:alice-springs', 'event:alice-build', 'cohort:girls', 'use:assembly', 'placement:cinema', 'placement:gallery'],
  },
  {
    // Also serves as the page's HERO overlay (use:hero). The bed-drop at
    // the homes is the central act of the trip; the masthead leads with it.
    match: /beds putting together.*utopia/i,
    tags: ['community:utopia-homelands', 'event:bed-delivery', 'use:assembly', 'use:hero', 'placement:gallery', 'placement:overlay-fullscreen'],
  },
  {
    match: /fulla.*putting/i,
    tags: ['community:utopia-homelands', 'event:bed-delivery', 'cohort:fullas', 'use:assembly', 'placement:gallery'],
  },
  {
    match: /mykel.*overlay.*delivery/i,
    tags: ['community:utopia-homelands', 'event:bed-delivery', 'participant:mykel', 'use:b-roll', 'placement:under-text'],
  },
  {
    match: /clancy/i,
    tags: ['community:utopia-homelands', 'event:bed-delivery', 'participant:clancy', 'use:portrait', 'placement:gallery', 'consent:elder-pending'],
  },
  {
    match: /charley/i,
    tags: ['community:utopia-homelands', 'event:bed-delivery', 'participant:charley', 'use:portrait', 'placement:gallery', 'consent:elder-pending'],
  },
  {
    match: /dorrie jones/i,
    tags: ['community:utopia-homelands', 'event:bed-delivery', 'participant:dorrie-jones', 'use:portrait', 'placement:gallery', 'consent:elder-pending'],
  },
  {
    match: /ampilatwatja/i,
    tags: ['community:ampilatwatja', 'event:bed-delivery', 'use:yarn', 'placement:gallery', 'consent:elder-pending'],
  },
  {
    // Soapy Boar is the video named for Soapy Bore (Arawerr) — the second
    // community we visited the same morning. Tagged as the act's
    // establishing overlay and as a gallery item.
    match: /soapy boar/i,
    tags: ['community:arawerr', 'place:soapy-bore', 'use:atmosphere', 'use:establishing', 'placement:overlay-fullscreen', 'placement:gallery'],
  },
];

async function fetchAllGoodsVideos() {
  const params = [
    `project_id=eq.${PROJECT_ID}`,
    'media_type=eq.video',
    'select=id,original_filename,filename,cultural_tags',
    'order=uploaded_at.asc',
    'limit=200',
  ];
  const res = await fetch(`${EL_URL}/rest/v1/media_assets?${params.join('&')}`, {
    headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
  });
  if (!res.ok) throw new Error(`fetch failed: ${res.status} ${await res.text()}`);
  return res.json();
}

function mergeUnique(existing, incoming) {
  const out = [...(existing || [])];
  for (const t of incoming) if (!out.includes(t)) out.push(t);
  return out;
}

async function patchTags(id, tags) {
  const res = await fetch(`${EL_URL}/rest/v1/media_assets?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: EL_KEY,
      Authorization: `Bearer ${EL_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ cultural_tags: tags }),
  });
  if (!res.ok) throw new Error(`patch ${id} failed: ${res.status} ${await res.text()}`);
}

(async () => {
  const videos = await fetchAllGoodsVideos();
  console.log(`Found ${videos.length} Goods videos in media_assets.\n`);

  let tagged = 0;
  let skipped = 0;
  for (const v of videos) {
    const name = (v.original_filename || v.filename || '').replace(/\.(mp4|mov|webm|m4v)$/i, '');
    const planEntry = TAG_PLAN.find((p) => p.match.test(name));
    if (!planEntry) {
      console.log(`SKIP   "${name}" — no rule matched`);
      skipped++;
      continue;
    }
    const want = [...BASE_TAGS, ...planEntry.tags];
    const merged = mergeUnique(v.cultural_tags, want);
    const before = (v.cultural_tags || []).length;
    const added = merged.length - before;
    if (added === 0) {
      console.log(`OK     "${name}" — already tagged (${merged.length} tags)`);
      tagged++;
      continue;
    }
    await patchTags(v.id, merged);
    console.log(`PATCH  "${name}" — +${added} tags, now ${merged.length} total`);
    console.log(`         ${planEntry.tags.join(', ')}`);
    tagged++;
  }
  console.log(`\nDone. Tagged: ${tagged}, skipped: ${skipped}.`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
