// Upload the Maningrida film frames to Empathy Ledger.
//
// WHY THIS EXISTS: Empathy Ledger had ZERO Maningrida media (verified 2026-08-21:
// 378 stories, 149 media_assets, not one carrying a maningrida tag or title). Every
// tagged Goods asset in EL was the May-2026 Utopia/Alice trip. That is why
// /field-notes/maningrida-july-2026 resolves nothing `fromTag` and ships local
// images instead.
//
// The approved four-minute film (cut 17 Aug 2026) is the only Maningrida
// photography that exists, so its frames ARE the photo library. Uploading them
// under the same tag scheme the Utopia trip used means the el-gallery resolver and
// the admin photo-swap UI work on Maningrida exactly as they do on Utopia, with no
// special-case code anywhere.
//
// Companion to upload-trip-photos-to-el.mjs, which did the same job for Utopia.
// Same conservative defaults: is_public=false, requires_elder_review=true,
// permission_tier='private'. Nothing published by running this.
//
// Idempotent: manifest at /tmp/el-maningrida-uploads.json tracks what has been
// uploaded, so re-running will not create duplicates.
//
// Usage:  cd v2 && node scripts/upload-maningrida-frames-to-el.mjs [--dry-run]

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env.local') });

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL;
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY;
const EL_PROJECT_ID = process.env.EMPATHY_LEDGER_PROJECT_ID;
const EL_TENANT_ID = process.env.EMPATHY_LEDGER_TENANT_ID;
const EL_FALLBACK_AUTHOR_ID = process.env.EMPATHY_LEDGER_FALLBACK_AUTHOR_ID;
const EL_FALLBACK_STORYTELLER_ID = process.env.EMPATHY_LEDGER_FALLBACK_STORYTELLER_ID;

if (!EL_URL || !EL_KEY || !EL_PROJECT_ID || !EL_TENANT_ID) {
  console.error('Missing EL env vars (URL, KEY, PROJECT_ID, TENANT_ID required)');
  process.exit(1);
}

const DRY = process.argv.includes('--dry-run');
const BUCKET = 'story-images';
const SRC = join(__dirname, '..', 'public', 'images', 'stories', 'maningrida');
const MANIFEST = '/tmp/el-maningrida-uploads.json';
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {};

// Storyteller ids created 2026-08-21. Both are content_status='pending_review'
// with consent_given=false on their profile: they exist so media can be attributed,
// NOT because consent has been captured. See the consent note in trip-stories.ts.
const ERIC = '4d0a6939-9264-4cc8-8587-5851817b0f89';
const TEHMINEH = '49fb2140-c862-4e45-a5dc-1d8fc828b2e3';

// Tag scheme mirrors the Utopia trip exactly (resolve-gallery.ts reads `use:*`,
// `placement:*`, `community:*`, `event:*`, `trip:*`, `participant:*`).
const FRAMES = [
  { file: '01-bed-run-outside-school.jpg', t: '0:01', use: 'establishing', placement: 'gallery',
    caption: 'The finished run lined up outside the school.' },
  { file: '02-aerial-over-country.jpg', t: '0:56', use: 'establishing', placement: 'overlay-fullscreen',
    caption: 'Flying in over Arnhem Land scrub toward the community.' },
  { file: '03-goods-painted-on-iron.jpg', t: '1:20', use: 'atmosphere', placement: 'gallery',
    caption: 'GOODS painted onto the corrugated iron.' },
  { file: '04-hdpe-panel-macro.jpg', t: '1:52', use: 'material', placement: 'gallery',
    caption: 'The pressed HDPE panel up close: bottle caps and jerry cans still visible in the speckle.' },
  { file: '05-truck-arrives-red-dirt.jpg', t: '0:18', use: 'establishing', placement: 'gallery',
    caption: 'The kits arriving by road.' },
  { file: '06-hdpe-panel-unrolled.jpg', t: '3:12', use: 'assembly', placement: 'gallery',
    caption: 'Lifting a pressed panel.' },
  { file: '10-drone-whole-run.jpg', t: '3:40', use: 'hero', placement: 'overlay-fullscreen',
    caption: 'All forty beds laid out in a circle on the white sand at Gamardi.' },
  { file: '11-build-day-wide.jpg', t: '3:44', use: 'assembly', placement: 'gallery',
    caption: 'Build day, community assembling the beds.' },
  { file: '12-billabong.jpg', t: '0:24', use: 'atmosphere', placement: 'gallery',
    caption: 'Water on the way in.' },
  { file: '13-drone-bed-arc.jpg', t: '3:38', use: 'closing', placement: 'overlay-fullscreen',
    caption: 'The arc of finished beds from above.' },
  { file: '14-eric-on-bed-in-bush.jpg', t: '3:21', use: 'portrait', placement: 'gallery',
    participant: 'eric-pascoe', storyteller: ERIC,
    caption: 'Eric Pascoe, On Country Learning Coordinator at Homeland School Company.' },
  { file: '15-carrying-bed-through-community.jpg', t: '3:33', use: 'assembly', placement: 'gallery',
    caption: 'Carrying a bed across the community.' },
];

async function uploadToStorage(buf, path) {
  const res = await fetch(`${EL_URL}/storage/v1/object/${BUCKET}/${encodeURI(path)}`, {
    method: 'POST',
    headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}`, 'Content-Type': 'image/jpeg', 'x-upsert': 'true' },
    body: buf,
  });
  if (!res.ok) throw new Error(`storage upload failed ${res.status}: ${await res.text()}`);
  return `${EL_URL}/storage/v1/object/public/${BUCKET}/${encodeURI(path)}`;
}

async function createStory(f, photoUrl) {
  const tags = [
    'trip:july-2026',
    'community:maningrida',
    'place:gamardi',
    'event:maningrida-build',
    'org:homeland-school-company',
    'product:stretch-bed',
    'stretch-bed',
    'format:photo',
    'goods-staff-capture',
    'source:film-frame',
    `use:${f.use}`,
    `placement:${f.placement}`,
    f.participant ? `participant:${f.participant}` : null,
    'pending-elder-review',
  ].filter(Boolean);

  const content = [
    `Frame from the approved Goods film of the July 2026 Maningrida run (cut 17 Aug 2026), at ${f.t}.`,
    f.caption,
    '',
    'Forty Stretch Beds were pressed and packed at the Goods production facility, sent north, and',
    'assembled in community. Commissioned by Homeland School Company, a community-controlled',
    'homeland education organisation, who also asked for a washing machine for the school.',
    '',
    'Extracted from the release cut rather than shot separately: there is no other Maningrida',
    'photography. Pending elder review before public syndication.',
  ].filter(Boolean).join('\n');

  const body = {
    tenant_id: EL_TENANT_ID,
    project_id: EL_PROJECT_ID,
    storyteller_id: f.storyteller || EL_FALLBACK_STORYTELLER_ID,
    author_id: EL_FALLBACK_AUTHOR_ID,
    title: `Maningrida, July 2026 — ${f.caption}`,
    content,
    excerpt: f.caption,
    original_author_display: 'Goods on Country',
    location_text: 'Maningrida, Arnhem Land NT',
    status: 'draft',
    community_status: 'draft',
    is_public: false,
    is_featured: false,
    syndication_enabled: false,
    permission_tier: 'private',
    language: 'en',
    requires_elder_review: true,
    // The FILM is an approved release cut; these frames inherit that approval.
    // That is not the same as per-person consent, which is why is_public stays
    // false and elder review is still required.
    has_explicit_consent: true,
    consent_details: {
      source: 'maningrida-film-frame-extract',
      film_cut: '2026-08-17',
      timecode: f.t,
      capture_type: 'goods-staff',
      note: 'Approved film cut. Per-person consent for Eric Pascoe and Tehmineh Mason NOT yet captured.',
      submitted_at: new Date().toISOString(),
    },
    cultural_permission_level: 'community',
    media_url: photoUrl,
    story_image_url: photoUrl,
    media_urls: [photoUrl],
    tags,
    story_type: 'gallery-photo',
    privacy_level: 'private',
  };

  const res = await fetch(`${EL_URL}/rest/v1/stories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}`, Prefer: 'return=representation' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`story insert failed ${res.status}: ${await res.text()}`);
  return (await res.json())[0]?.id;
}

let ok = 0, skipped = 0, fail = 0;
for (const f of FRAMES) {
  const local = join(SRC, f.file);
  if (!existsSync(local)) { console.warn(`  MISSING ${f.file}`); fail++; continue; }
  if (manifest[f.file]) { console.log(`  skip    ${f.file} (already ${manifest[f.file]})`); skipped++; continue; }
  if (DRY) { console.log(`  would   ${f.file}  use:${f.use} placement:${f.placement}${f.participant ? ` participant:${f.participant}` : ''}`); continue; }
  try {
    const url = await uploadToStorage(readFileSync(local), `maningrida-july-2026/${f.file}`);
    const id = await createStory(f, url);
    manifest[f.file] = id;
    writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
    console.log(`  ok      ${f.file} -> ${id}`);
    ok++;
  } catch (err) {
    console.error(`  FAIL    ${f.file}: ${err.message}`);
    fail++;
  }
}
console.log(`\n${DRY ? '(dry run) ' : ''}uploaded ${ok}, skipped ${skipped}, failed ${fail}`);
console.log('All rows are is_public=false / requires_elder_review=true. Nothing is published by this script.');
