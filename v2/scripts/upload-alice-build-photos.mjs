// Upload the Alice Springs Oonchiumpa build photos (Canon R6 Mark II, May
// 2026) to Empathy Ledger as a GALLERY, not as prose stories.
//
// What this script does differently from upload-real-trip-photos.mjs:
//  - Uses the canonical Goods tag taxonomy (format: / community: / event:
//    / participant: / consent: prefixes) that matches the new
//    /admin/el-stories composer + the planned el-gallery trip-story block.
//  - story_type='gallery-photo' so /admin/el-stories (prose feed) filters
//    them out cleanly. They show in /admin/photos for curation only.
//  - Per-photo title is sequential ("Alice Springs build · 18 May · #001")
//    instead of filename-based, so the gallery reads as one event not as
//    121 unrelated stories.
//  - Idempotent via /tmp/el-alice-build-upload.json manifest.
//
// Defaults are conservative:
//  - is_public=false
//  - has_explicit_consent=false (group consent via Oonchiumpa is implied
//    but not individually verified)
//  - requires_elder_review=true
//
// Photographer credit: defaults to "Goods on Country" but flip to
// PHOTOGRAPHER_NAME if you want it attributed.

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env.local') });

const sharp = (await import('sharp')).default;
const exifrMod = await import('exifr');
const exifr = exifrMod.default || exifrMod;

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL;
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY;
const EL_PROJECT_ID = process.env.EMPATHY_LEDGER_PROJECT_ID;
const EL_TENANT_ID = process.env.EMPATHY_LEDGER_TENANT_ID;
const EL_FALLBACK_AUTHOR_ID = process.env.EMPATHY_LEDGER_FALLBACK_AUTHOR_ID;
const EL_FALLBACK_STORYTELLER_ID = process.env.EMPATHY_LEDGER_FALLBACK_STORYTELLER_ID;
if (!EL_URL || !EL_KEY || !EL_PROJECT_ID || !EL_TENANT_ID) {
  console.error('Missing EL env vars (check v2/.env.local)');
  process.exit(1);
}

const PHOTO_DIR = '/Users/benknight/Pictures/Alice & Utopia Goods May 25/Exported Photos';
const BUCKET = 'story-images';
const MANIFEST = '/tmp/el-alice-build-upload.json';
const PHOTOGRAPHER = 'Goods on Country';
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {};

async function resizeForWeb(buf) {
  return sharp(buf)
    .rotate()
    .resize({ width: 2400, withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
}

async function uploadToStorage(buf, storagePath) {
  const res = await fetch(`${EL_URL}/storage/v1/object/${BUCKET}/${encodeURI(storagePath)}`, {
    method: 'POST',
    headers: {
      apikey: EL_KEY,
      Authorization: `Bearer ${EL_KEY}`,
      'Content-Type': 'image/jpeg',
      'x-upsert': 'true',
    },
    body: buf,
  });
  if (!res.ok) throw new Error(`storage ${res.status}: ${await res.text()}`);
  return `${EL_URL}/storage/v1/object/public/${BUCKET}/${encodeURI(storagePath)}`;
}

function dateLabel(d) {
  if (!d) return null;
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function dateSlug(d) {
  if (!d) return 'unknown';
  return d.toISOString().slice(0, 10);
}

async function createStory(photoUrl, filename, takenAt, index) {
  const taken = takenAt ? new Date(takenAt) : null;
  const slug = dateSlug(taken);

  const tags = [
    'format:photo',
    'trip:may-2026',
    'community:alice-springs',
    'event:alice-build',
    'participant:oonchiumpa-young-people',
    'product:stretch-bed',
    'goods-staff-capture',
    'consent:elder-pending',
    `date:${slug}`,
    'capture:canon-r6',
  ];

  const seq = String(index + 1).padStart(3, '0');
  const dateLbl = dateLabel(taken) || 'May 2026';
  const title = `Alice Springs build · ${dateLbl} · #${seq}`;

  const body = {
    tenant_id: EL_TENANT_ID,
    project_id: EL_PROJECT_ID,
    storyteller_id: EL_FALLBACK_STORYTELLER_ID,
    author_id: EL_FALLBACK_AUTHOR_ID,
    title,
    content:
      `Alice Springs build session, ${dateLbl}. Young people supported by the ` +
      `Oonchiumpa Consultancy and Centrecorp Foundation building Stretch Beds — ` +
      `every young person who built one kept one. Captured on Canon R6 Mark II ` +
      `by ${PHOTOGRAPHER}. Held pending elder review before public use.`,
    excerpt: `Alice Springs build session, ${dateLbl}. Oonchiumpa young people.`,
    original_author_display: PHOTOGRAPHER,
    location_text: 'Alice Springs, NT',
    status: 'draft',
    community_status: 'draft',
    is_public: false,
    is_featured: false,
    syndication_enabled: false,
    permission_tier: 'private',
    language: 'en',
    requires_elder_review: true,
    elder_reviewed: false,
    has_explicit_consent: false,
    consent_details: {
      source: 'alice-build-bulk-upload',
      capture_type: 'canon-r6',
      submitted_at: new Date().toISOString(),
      group_consent_via: 'Oonchiumpa Consultancy',
      individual_consent: 'pending',
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
    headers: {
      'Content-Type': 'application/json',
      apikey: EL_KEY,
      Authorization: `Bearer ${EL_KEY}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`story ${res.status}: ${await res.text()}`);
  const ins = await res.json();
  return ins[0]?.id;
}

const files = readdirSync(PHOTO_DIR)
  .filter((f) => f.toLowerCase().endsWith('.jpg'))
  .sort();

console.log(`Found ${files.length} JPGs in ${PHOTO_DIR}`);
console.log(`Already in manifest: ${Object.keys(manifest).length}`);

let ok = 0,
  skipped = 0,
  fail = 0;

for (let i = 0; i < files.length; i++) {
  const f = files[i];
  if (manifest[f]) {
    skipped++;
    continue;
  }
  try {
    const full = join(PHOTO_DIR, f);
    const buf = readFileSync(full);
    const exif = await exifr.parse(buf, { gps: false }).catch(() => null);
    const takenAt = exif?.DateTimeOriginal?.toISOString?.() || null;
    const resized = await resizeForWeb(buf);
    const storagePath = `trip-may-2026/alice-build/${f.toLowerCase()}`;
    const url = await uploadToStorage(resized, storagePath);
    const storyId = await createStory(url, f, takenAt, i);
    manifest[f] = {
      story_id: storyId,
      photo_url: url,
      taken_at: takenAt,
      uploaded_at: new Date().toISOString(),
    };
    writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
    ok++;
    process.stdout.write(
      `✓ ${f}  story=${storyId.slice(0, 8)}  ${(resized.length / 1024).toFixed(0)}KB\n`
    );
  } catch (e) {
    fail++;
    process.stdout.write(`✗ ${f}  ${e.message}\n`);
  }
}

console.log(`\n${ok} uploaded, ${skipped} skipped (already), ${fail} failed`);
console.log(`Manifest: ${MANIFEST}`);
