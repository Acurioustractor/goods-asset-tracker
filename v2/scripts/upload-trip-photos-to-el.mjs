// Upload the 21-22 May Utopia + Alice Springs trip photos to Empathy Ledger.
// Each photo becomes an EL "story" record (with the photo URL on it) in the
// Goods project, tagged for community / product / batch / trip / source.
//
// Defaults are conservative: is_public=false, requires_elder_review=true,
// permission_tier='private'. Photos are reviewable in EL before being
// published.
//
// Idempotent: a local manifest at /tmp/el-trip-uploads.json tracks what's
// been uploaded so re-running won't create duplicates.

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdtempSync } from 'node:fs';
import { join, basename, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
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

const TRIP_TAG = 'trip-may-2026';
const BATCH_TAG = 'batch-156';
const BUCKET = 'story-images';

const FOLDERS = [
  { path: '/Users/benknight/Code/Goods Asset Register/Goods Beds Utpoia - QR Codes', day: 1, community_default: 'utopia-homelands' },
  { path: '/Users/benknight/Code/Goods Asset Register/Goods Beds Utopia day 2 QR code', day: 2, community_default: 'utopia-homelands' },
];

// Load decoded bed_ids from earlier batch-process runs so we can attach the
// right bed-id tag to each photo automatically.
const batchData = [
  ...(existsSync('/tmp/utopia-batch.json') ? JSON.parse(readFileSync('/tmp/utopia-batch.json', 'utf-8')).results : []),
  ...(existsSync('/tmp/utopia-day2-batch.json') ? JSON.parse(readFileSync('/tmp/utopia-day2-batch.json', 'utf-8')).results : []),
];
const fileToMeta = new Map();
for (const r of batchData) {
  if (r.file) fileToMeta.set(r.file, r);
}

const MANIFEST = '/tmp/el-trip-uploads.json';
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {};

async function toJpegBuffer(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') {
    return readFileSync(filePath);
  }
  const tmp = mkdtempSync(join(tmpdir(), 'heic-'));
  const out = join(tmp, basename(filePath, ext) + '.jpg');
  execFileSync('sips', ['-s', 'format', 'jpeg', filePath, '--out', out], { stdio: 'pipe' });
  return readFileSync(out);
}

function safeFilename(s) {
  return s.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, '').toLowerCase();
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
  if (!res.ok) {
    throw new Error(`storage upload failed ${res.status}: ${await res.text()}`);
  }
  // Public URL pattern for Supabase Storage
  return `${EL_URL}/storage/v1/object/public/${BUCKET}/${encodeURI(storagePath)}`;
}

async function createStory(photoUrl, fileMeta, day, communityTag) {
  const bedId = fileMeta?.bed_id || null;
  const recipient = fileMeta?.recipient_name || null;

  const tags = [
    TRIP_TAG,
    BATCH_TAG,
    communityTag,
    'stretch-bed',
    `day-${day}`,
    'goods-staff-capture',
    'pending-elder-review',
    bedId ? bedId.toLowerCase() : null,
  ].filter(Boolean);

  const title = bedId
    ? `${bedId} — Utopia delivery${recipient ? `, ${recipient}` : ''} (May ${day === 1 ? '21' : '22'} 2026)`
    : `Trip photo ${fileMeta?.file || 'unnamed'} — Utopia delivery, May ${day === 1 ? '21' : '22'} 2026`;

  const contentParts = [
    `Photo from the 21-22 May 2026 Utopia Homelands delivery trip.`,
    bedId ? `Bed: ${bedId}` : 'No QR sticker in frame (scene photo).',
    recipient ? `Recipient: ${recipient}` : null,
    fileMeta?.gps_lat ? `GPS: ${fileMeta.gps_lat.toFixed(5)}, ${fileMeta.gps_lng.toFixed(5)}` : 'GPS: not available (WhatsApp strips EXIF).',
    fileMeta?.taken_at ? `Taken: ${fileMeta.taken_at}` : null,
    '',
    'Captured by Goods staff during delivery. Pending elder review before public syndication.',
  ].filter(Boolean).join('\n');

  const body = {
    tenant_id: EL_TENANT_ID,
    project_id: EL_PROJECT_ID,
    storyteller_id: EL_FALLBACK_STORYTELLER_ID,
    author_id: EL_FALLBACK_AUTHOR_ID,
    title,
    content: contentParts,
    excerpt: contentParts.slice(0, 200),
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
    consent_details: {
      source: 'trip-bulk-upload',
      asset_id: bedId,
      capture_type: 'goods-staff',
      submitted_at: new Date().toISOString(),
    },
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
    headers: {
      'Content-Type': 'application/json',
      apikey: EL_KEY,
      Authorization: `Bearer ${EL_KEY}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`story insert failed ${res.status}: ${await res.text()}`);
  }
  const inserted = await res.json();
  return inserted[0]?.id;
}

let ok = 0, skipped = 0, fail = 0;
for (const folder of FOLDERS) {
  if (!existsSync(folder.path)) {
    console.log(`skip: folder missing ${folder.path}`);
    continue;
  }
  const files = readdirSync(folder.path).filter((f) => /\.(jpg|jpeg|heic)$/i.test(f));
  for (const f of files) {
    const key = `${folder.path}::${f}`;
    if (manifest[key]) { skipped++; console.log(`= ${f} (already uploaded, story ${manifest[key].story_id})`); continue; }
    try {
      const full = join(folder.path, f);
      const buf = await toJpegBuffer(full);
      const meta = fileToMeta.get(f) || null;
      const storagePath = `${TRIP_TAG}/day${folder.day}/${safeFilename(basename(f, extname(f)))}.jpg`;
      const photoUrl = await uploadToStorage(buf, storagePath);
      const storyId = await createStory(photoUrl, meta, folder.day, folder.community_default);
      manifest[key] = { file: f, day: folder.day, photo_url: photoUrl, story_id: storyId, bed_id: meta?.bed_id || null, uploaded_at: new Date().toISOString() };
      writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
      ok++;
      console.log(`✓ ${f}  story=${storyId}  bed=${meta?.bed_id || '-'}`);
    } catch (e) {
      fail++;
      console.log(`✗ ${f}  ${e.message}`);
    }
  }
}

console.log(`\n${ok} uploaded, ${skipped} skipped (already), ${fail} failed`);
console.log(`Manifest: ${MANIFEST}`);
