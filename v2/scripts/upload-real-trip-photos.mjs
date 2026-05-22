// Upload the *real* Utopia trip photos (Canon R6 Mark II shots, not the
// iPhone QR-tracking close-ups) to Empathy Ledger. These are the photos
// that should populate the funder decks once curated.
//
// Defaults:
//  - is_public=false, requires_elder_review=true — you curate via
//    /admin/photos and tap "Approve public" to flip to deck-visible.
//  - Tag set includes 'deck-candidate' so picker can filter to "real
//    photos worth considering" vs '/internal-qr-capture' shots.
//  - Storage path: el story-images bucket / trip-may-2026/canon/{filename}
//
// Idempotent via /tmp/el-real-photos-upload.json manifest.

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
  console.error('Missing EL env vars');
  process.exit(1);
}

const PHOTO_DIR = '/Users/benknight/Pictures/Alice & Utopia Goods May 25/Utpoia Photos Export';
const BUCKET = 'story-images';
const MANIFEST = '/tmp/el-real-photos-upload.json';
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {};

// Resize on upload — Canon RAW->JPEG outputs run 1.5-2MB each at 6000px wide.
// Web/print at deck resolution needs ~2400px wide max. Saves ~70% bandwidth.
async function resizeForWeb(buf) {
  return sharp(buf).rotate().resize({ width: 2400, withoutEnlargement: true }).jpeg({ quality: 85, mozjpeg: true }).toBuffer();
}

async function uploadToStorage(buf, storagePath) {
  const res = await fetch(`${EL_URL}/storage/v1/object/${BUCKET}/${encodeURI(storagePath)}`, {
    method: 'POST',
    headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}`, 'Content-Type': 'image/jpeg', 'x-upsert': 'true' },
    body: buf,
  });
  if (!res.ok) throw new Error(`storage ${res.status}: ${await res.text()}`);
  return `${EL_URL}/storage/v1/object/public/${BUCKET}/${encodeURI(storagePath)}`;
}

async function createStory(photoUrl, filename, takenAt) {
  // Day-1 / Day-2 inference from EXIF DateTimeOriginal. May 21 = day-1,
  // May 22 = day-2. If unavailable, default day-1 (these are mostly day-1
  // Canon shots per filename pattern).
  let day = 'day-1';
  if (takenAt) {
    const d = new Date(takenAt);
    day = d.getUTCDate() === 22 ? 'day-2' : 'day-1';
  }

  const tags = [
    'trip-may-2026',
    'batch-156',
    'utopia-homelands',
    'stretch-bed',
    day,
    'goods-staff-capture',
    'canon-r6',          // distinguishes from iPhone QR shots
    'deck-candidate',    // explicit signal: "consider for funder deck"
    'pending-elder-review',
  ];

  const title = `${basename(filename, '.jpg')} — Utopia delivery (May 2026)`;
  const body = {
    tenant_id: EL_TENANT_ID,
    project_id: EL_PROJECT_ID,
    storyteller_id: EL_FALLBACK_STORYTELLER_ID,
    author_id: EL_FALLBACK_AUTHOR_ID,
    title,
    content: `Trip photo from 21-22 May 2026 Utopia Homelands delivery. Captured on Canon R6 Mark II by Goods staff. Pending elder review before publication.`,
    excerpt: `Utopia delivery photo, ${day === 'day-2' ? 'May 22' : 'May 21'} 2026.`,
    original_author_display: 'Goods on Country staff',
    location_text: 'Utopia Homelands',
    status: 'draft',
    community_status: 'draft',
    is_public: false,
    is_featured: false,
    syndication_enabled: false,
    permission_tier: 'private',
    language: 'en',
    requires_elder_review: true,
    has_explicit_consent: true,
    consent_details: { source: 'real-trip-bulk-upload', capture_type: 'canon-r6', submitted_at: new Date().toISOString() },
    cultural_permission_level: 'community',
    media_url: photoUrl,
    story_image_url: photoUrl,
    media_urls: [photoUrl],
    tags,
    story_type: 'delivery-evidence',
    privacy_level: 'private',
  };

  const res = await fetch(`${EL_URL}/rest/v1/stories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}`, Prefer: 'return=representation' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`story ${res.status}: ${await res.text()}`);
  const ins = await res.json();
  return ins[0]?.id;
}

const files = readdirSync(PHOTO_DIR).filter((f) => f.toLowerCase().endsWith('.jpg')).sort();
console.log(`Found ${files.length} Canon JPGs in ${PHOTO_DIR}`);

let ok = 0, skipped = 0, fail = 0;
for (const f of files) {
  if (manifest[f]) { skipped++; continue; }
  try {
    const full = join(PHOTO_DIR, f);
    const buf = readFileSync(full);
    const tags = await exifr.parse(buf, { gps: true }).catch(() => null);
    const takenAt = tags?.DateTimeOriginal?.toISOString?.() || null;
    const resized = await resizeForWeb(buf);
    const storagePath = `trip-may-2026/canon/${f.toLowerCase()}`;
    const url = await uploadToStorage(resized, storagePath);
    const storyId = await createStory(url, f, takenAt);
    manifest[f] = { story_id: storyId, photo_url: url, taken_at: takenAt, uploaded_at: new Date().toISOString() };
    writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
    ok++;
    process.stdout.write(`✓ ${f}  story=${storyId.slice(0,8)}  ${(resized.length/1024).toFixed(0)}KB\n`);
  } catch (e) {
    fail++;
    process.stdout.write(`✗ ${f}  ${e.message}\n`);
  }
}

console.log(`\n${ok} uploaded, ${skipped} skipped (already), ${fail} failed`);
console.log(`Manifest: ${MANIFEST}`);
