// Upload trip videos to Empathy Ledger with rich tagging so the same asset
// can power multiple deck surfaces (hero overlay, testimonials, tutorials,
// per-bed pages, etc.).
//
// For each video:
//   1. Extract poster frame at 1s via ffmpeg
//   2. Upload web-optimised MP4 (max 1080p, AAC audio, H.264) to story-media
//   3. Upload poster JPEG to story-images
//   4. INSERT EL story with poster as story_image_url, video as media_url,
//      and tag set per CLI args
//
// Usage:
//   node scripts/upload-videos.mjs <folder> [--trip trip-may-2026]
//                                            [--community utopia-homelands]
//                                            [--product stretch-bed]
//                                            [--use hero-video|testimonial|setup|behind-scenes]
//                                            [--theme family|health|gratitude|...]
//                                            [--public]   # default: false, elder-review-pending
//
// Idempotent via /tmp/el-videos-upload.json manifest.

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdtempSync, statSync, unlinkSync } from 'node:fs';
import { join, basename, extname, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
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
  console.error('Missing EL env vars');
  process.exit(1);
}

const argv = process.argv.slice(2);
const folder = argv[0];
if (!folder) {
  console.error('Usage: node upload-videos.mjs <folder> [--trip X] [--community X] [--use X] [--theme X] [--product X] [--public]');
  process.exit(1);
}
if (!existsSync(folder)) { console.error(`Folder not found: ${folder}`); process.exit(1); }

function getArg(name, defaultVal = null) {
  const idx = argv.indexOf(`--${name}`);
  return idx >= 0 ? argv[idx + 1] : defaultVal;
}
const hasFlag = (name) => argv.includes(`--${name}`);

const tripTag = getArg('trip', 'trip-may-2026');
const communityTag = getArg('community', 'utopia-homelands');
const productTag = getArg('product', 'stretch-bed');
const useTag = getArg('use', 'testimonial');     // hero-video | testimonial | setup-tutorial | overlay-bg | behind-scenes
const themeTags = (getArg('theme') || '').split(',').map(t => t.trim()).filter(Boolean);
const goPublic = hasFlag('public');

const STORY_MEDIA_BUCKET = 'story-media';        // private — gated by signed URLs or RLS
const STORY_IMAGES_BUCKET = 'story-images';      // public

const MANIFEST = '/tmp/el-videos-upload.json';
const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf-8')) : {};

const VIDEO_EXTS = new Set(['.mp4', '.mov', '.m4v', '.webm']);

function ffprobeDuration(file) {
  try {
    const out = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1', file], { stdio: ['pipe', 'pipe', 'pipe'] }).toString().trim();
    return parseFloat(out) || null;
  } catch { return null; }
}

function ffmpegPoster(file, outJpeg) {
  // Extract 1s in for a stable poster (avoid black first frame)
  execFileSync('ffmpeg', ['-y', '-ss', '1', '-i', file, '-frames:v', '1',
    '-vf', 'scale=\'min(2400,iw)\':-2', '-q:v', '3', outJpeg], { stdio: 'pipe' });
}

function ffmpegOptimise(file, outMp4) {
  // Re-encode to H.264 1080p max + AAC audio for universal playback
  execFileSync('ffmpeg', ['-y', '-i', file,
    '-vf', 'scale=\'min(1920,iw)\':-2',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '24',
    '-c:a', 'aac', '-b:a', '128k',
    '-movflags', '+faststart',
    outMp4], { stdio: 'pipe' });
}

async function uploadToStorage(buf, bucket, path, contentType) {
  const res = await fetch(`${EL_URL}/storage/v1/object/${bucket}/${encodeURI(path)}`, {
    method: 'POST',
    headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}`, 'Content-Type': contentType, 'x-upsert': 'true' },
    body: buf,
  });
  if (!res.ok) throw new Error(`storage ${bucket} ${res.status}: ${await res.text()}`);
  return `${EL_URL}/storage/v1/object/public/${bucket}/${encodeURI(path)}`;
}

function durationBucket(secs) {
  if (!secs) return 'duration:unknown';
  if (secs < 30) return 'duration:short';
  if (secs < 120) return 'duration:medium';
  return 'duration:long';
}

async function createStory({ posterUrl, videoUrl, file, durationSecs }) {
  const tags = [
    'media-type:video',
    `trip:${tripTag}`,
    `community:${communityTag}`,
    `product:${productTag}`,
    `use:${useTag}`,
    durationBucket(durationSecs),
    goPublic ? 'consent:public' : 'consent:elder-pending',
    'goods-staff-capture',
    ...themeTags.map(t => `theme:${t}`),
  ];

  const title = `${basename(file, extname(file))} — ${communityTag.replace(/-/g, ' ')} (${useTag})`;
  const content = [
    `Video from ${tripTag}. Use: ${useTag}. Community: ${communityTag}.`,
    durationSecs ? `Duration: ${durationSecs.toFixed(1)}s.` : null,
    themeTags.length ? `Themes: ${themeTags.join(', ')}.` : null,
    goPublic ? 'Approved for public + funder deck use.' : 'Pending elder review before public use.',
  ].filter(Boolean).join('\n');

  const body = {
    tenant_id: EL_TENANT_ID,
    project_id: EL_PROJECT_ID,
    storyteller_id: EL_FALLBACK_STORYTELLER_ID,
    author_id: EL_FALLBACK_AUTHOR_ID,
    title,
    content,
    excerpt: content.slice(0, 200),
    original_author_display: 'Goods on Country staff',
    location_text: communityTag.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    status: goPublic ? 'published' : 'draft',
    community_status: goPublic ? 'published' : 'draft',
    is_public: goPublic,
    is_featured: false,
    syndication_enabled: false,
    permission_tier: goPublic ? 'public' : 'private',
    language: 'en',
    requires_elder_review: !goPublic,
    elder_reviewed: goPublic,
    elder_reviewed_at: goPublic ? new Date().toISOString() : null,
    has_explicit_consent: true,
    consent_details: { source: 'video-bulk-upload', use: useTag, public_default: goPublic, submitted_at: new Date().toISOString() },
    cultural_permission_level: goPublic ? 'public' : 'community',
    media_url: videoUrl,
    story_image_url: posterUrl,
    media_urls: [videoUrl, posterUrl],
    media_metadata: { type: 'video', poster: posterUrl, video: videoUrl, duration_seconds: durationSecs },
    tags,
    story_type: 'delivery-evidence',
    privacy_level: goPublic ? 'public' : 'private',
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

const files = readdirSync(folder).filter(f => VIDEO_EXTS.has(extname(f).toLowerCase())).sort();
console.log(`Found ${files.length} videos in ${folder}`);
console.log(`Tags: trip=${tripTag} community=${communityTag} product=${productTag} use=${useTag} themes=[${themeTags.join(',')}] public=${goPublic}`);

let ok = 0, skipped = 0, fail = 0;
for (const f of files) {
  if (manifest[f]) { skipped++; continue; }
  const full = join(folder, f);
  const tmp = mkdtempSync(join(tmpdir(), 'vid-'));
  const posterPath = join(tmp, basename(f, extname(f)) + '.jpg');
  const optimisedPath = join(tmp, basename(f, extname(f)) + '.mp4');
  try {
    process.stdout.write(`▷ ${f} ... `);
    const duration = ffprobeDuration(full);
    ffmpegPoster(full, posterPath);
    ffmpegOptimise(full, optimisedPath);
    const posterBuf = readFileSync(posterPath);
    const videoBuf = readFileSync(optimisedPath);
    const safeName = f.toLowerCase().replace(/[^a-z0-9.\-_]/g, '-');
    const posterUrl = await uploadToStorage(posterBuf, STORY_IMAGES_BUCKET, `videos/${tripTag}/posters/${safeName.replace(/\.[^.]+$/, '.jpg')}`, 'image/jpeg');
    const videoUrl = await uploadToStorage(videoBuf, STORY_MEDIA_BUCKET, `videos/${tripTag}/${safeName.replace(/\.[^.]+$/, '.mp4')}`, 'video/mp4');
    const storyId = await createStory({ posterUrl, videoUrl, file: f, durationSecs: duration });
    manifest[f] = { story_id: storyId, poster_url: posterUrl, video_url: videoUrl, duration_seconds: duration, uploaded_at: new Date().toISOString() };
    writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
    ok++;
    const origMb = (statSync(full).size / 1024 / 1024).toFixed(1);
    const optMb = (videoBuf.length / 1024 / 1024).toFixed(1);
    process.stdout.write(`✓ story=${storyId.slice(0,8)}  ${duration?.toFixed(0)}s  ${origMb}MB→${optMb}MB\n`);
  } catch (e) {
    fail++;
    process.stdout.write(`✗ ${e.message}\n`);
  } finally {
    // Clean up tmp
    try { unlinkSync(posterPath); } catch {}
    try { unlinkSync(optimisedPath); } catch {}
  }
}

console.log(`\n${ok} uploaded, ${skipped} skipped (already), ${fail} failed`);
console.log(`Manifest: ${MANIFEST}`);
