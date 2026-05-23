'use server';

import { writeFile, unlink, mkdtemp, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync, execSync } from 'node:child_process';
import { revalidatePath } from 'next/cache';

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const EL_PROJECT_ID = process.env.EMPATHY_LEDGER_PROJECT_ID || '6bd47c8a-e676-456f-aa25-ddcbb5a31047';
const EL_TENANT_ID = process.env.EMPATHY_LEDGER_TENANT_ID || '5f1314c1-ffe9-4d8f-944b-6cdf02d4b943';
const EL_FALLBACK_AUTHOR_ID =
  process.env.EMPATHY_LEDGER_FALLBACK_AUTHOR_ID || '5b5bc43b-ad02-450c-ae2f-44dea1a9e77b';
const EL_FALLBACK_STORYTELLER_ID =
  process.env.EMPATHY_LEDGER_FALLBACK_STORYTELLER_ID || 'ac700001-0000-0000-0000-000000000002';

const STORY_MEDIA_BUCKET = 'story-media';
const STORY_IMAGES_BUCKET = 'story-images';

function hasFfmpeg(): boolean {
  try {
    execSync('which ffmpeg', { stdio: 'pipe' });
    execSync('which ffprobe', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

async function uploadToStorage(buf: Buffer, bucket: string, path: string, contentType: string) {
  const res = await fetch(`${EL_URL}/storage/v1/object/${bucket}/${encodeURI(path)}`, {
    method: 'POST',
    headers: {
      apikey: EL_KEY,
      Authorization: `Bearer ${EL_KEY}`,
      'Content-Type': contentType,
      'x-upsert': 'true',
    },
    body: new Uint8Array(buf),
  });
  if (!res.ok) throw new Error(`storage ${bucket} ${res.status}: ${await res.text()}`);
  return `${EL_URL}/storage/v1/object/public/${bucket}/${encodeURI(path)}`;
}

interface SharedTags {
  trip: string;
  community: string;
  event?: string;
  participant?: string;
  themes?: string[];
  product?: string;
  hasConsent: boolean;
  // For videos only:
  use?: 'atmosphere' | 'voice' | 'process' | 'moment' | 'establishing';
  placements?: string[];
}

async function processPhoto(
  buf: Buffer,
  safeName: string,
  shared: SharedTags,
  tmpDir: string
): Promise<{ storyId: string; url: string }> {
  const sharp = (await import('sharp')).default;
  const resized = await sharp(buf)
    .rotate()
    .resize({ width: 2400, withoutEnlargement: true })
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
  void tmpDir;
  const storagePath = `${shared.trip}/${shared.event || 'general'}/${Date.now()}-${safeName.replace(/\.[^.]+$/, '')}.jpg`;
  const url = await uploadToStorage(resized, STORY_IMAGES_BUCKET, storagePath, 'image/jpeg');

  const tags: string[] = [
    'format:photo',
    `trip:${shared.trip}`,
    `community:${shared.community}`,
    'goods-staff-capture',
    shared.hasConsent ? 'consent:public' : 'consent:elder-pending',
  ];
  if (shared.event) tags.push(`event:${shared.event}`);
  if (shared.participant) tags.push(`participant:${shared.participant}`);
  if (shared.product) tags.push(`product:${shared.product}`);
  for (const t of shared.themes || []) tags.push(`theme:${t}`);

  const isPublic = shared.hasConsent;
  const body = {
    tenant_id: EL_TENANT_ID,
    project_id: EL_PROJECT_ID,
    storyteller_id: EL_FALLBACK_STORYTELLER_ID,
    author_id: EL_FALLBACK_AUTHOR_ID,
    title: safeName,
    content: `Photo from ${shared.trip}${shared.event ? ` · ${shared.event}` : ''}.`,
    excerpt: `Photo from ${shared.trip}.`,
    original_author_display: 'Goods on Country',
    status: isPublic ? 'published' : 'draft',
    is_public: isPublic,
    syndication_enabled: false,
    requires_elder_review: !shared.hasConsent,
    elder_reviewed: shared.hasConsent,
    has_explicit_consent: shared.hasConsent,
    consent_details: { source: 'admin-upload', captured_at: new Date().toISOString() },
    story_image_url: url,
    media_url: url,
    media_urls: [url],
    tags,
    story_type: 'gallery-photo',
  };
  const res = await fetch(`${EL_URL}/rest/v1/stories`, {
    method: 'POST',
    headers: {
      apikey: EL_KEY,
      Authorization: `Bearer ${EL_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`story ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const rows = (await res.json()) as Array<{ id: string }>;
  return { storyId: rows[0].id, url };
}

async function processVideo(
  buf: Buffer,
  safeName: string,
  shared: SharedTags,
  tmpDir: string
): Promise<{ storyId: string; posterUrl: string; videoUrl: string }> {
  const sourcePath = join(tmpDir, safeName);
  const posterPath = join(tmpDir, `${safeName}.jpg`);
  const encodedPath = join(tmpDir, `${safeName}.encoded.mp4`);
  await writeFile(sourcePath, new Uint8Array(buf));

  const durOut = execFileSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', sourcePath],
    { stdio: ['pipe', 'pipe', 'pipe'] }
  )
    .toString()
    .trim();
  const durationSeconds = parseFloat(durOut) || null;
  execFileSync(
    'ffmpeg',
    ['-y', '-ss', '1', '-i', sourcePath, '-frames:v', '1', '-vf', "scale='min(2400,iw)':-2", '-q:v', '3', posterPath],
    { stdio: 'pipe' }
  );
  execFileSync(
    'ffmpeg',
    [
      '-y', '-i', sourcePath,
      '-vf', "scale='min(1920,iw)':-2",
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '24',
      '-c:a', 'aac', '-b:a', '128k',
      '-movflags', '+faststart',
      encodedPath,
    ],
    { stdio: 'pipe' }
  );

  const stem = safeName.replace(/\.[^.]+$/, '');
  const storagePath = `${shared.trip}/${shared.use || 'voice'}/${Date.now()}-${stem}`;
  const posterBuf = Buffer.from(await readFile(posterPath));
  const videoBuf = Buffer.from(await readFile(encodedPath));
  const posterUrl = await uploadToStorage(posterBuf, STORY_IMAGES_BUCKET, `${storagePath}.jpg`, 'image/jpeg');
  const videoUrl = await uploadToStorage(videoBuf, STORY_MEDIA_BUCKET, `${storagePath}.mp4`, 'video/mp4');

  const useTag = shared.use || 'voice';
  const placements = new Set(shared.placements || []);
  placements.add('standalone-card');
  if (!shared.placements?.length) {
    if (useTag === 'atmosphere' || useTag === 'establishing') placements.add('overlay-fullscreen');
    if (useTag === 'voice' || useTag === 'moment') placements.add('under-text');
  }

  const tags: string[] = [
    'format:video',
    'media-type:video',
    `use:${useTag}`,
    `trip:${shared.trip}`,
    `community:${shared.community}`,
    'goods-staff-capture',
    shared.hasConsent ? 'consent:public' : 'consent:elder-pending',
    ...[...placements].map((p) => `placement:${p}`),
  ];
  if (shared.event) tags.push(`event:${shared.event}`);
  if (shared.participant) tags.push(`participant:${shared.participant}`);
  if (shared.product) tags.push(`product:${shared.product}`);
  for (const t of shared.themes || []) tags.push(`theme:${t}`);

  const isPublic = shared.hasConsent;
  const body = {
    tenant_id: EL_TENANT_ID,
    project_id: EL_PROJECT_ID,
    storyteller_id: EL_FALLBACK_STORYTELLER_ID,
    author_id: EL_FALLBACK_AUTHOR_ID,
    title: safeName,
    content: `Video from ${shared.trip}${shared.event ? ` · ${shared.event}` : ''}. Use: ${useTag}.`,
    excerpt: `Video from ${shared.trip}.`,
    original_author_display: 'Goods on Country',
    status: isPublic ? 'published' : 'draft',
    is_public: isPublic,
    syndication_enabled: false,
    requires_elder_review: !shared.hasConsent,
    elder_reviewed: shared.hasConsent,
    has_explicit_consent: shared.hasConsent,
    consent_details: { source: 'admin-upload', captured_at: new Date().toISOString() },
    story_image_url: posterUrl,
    media_url: videoUrl,
    media_urls: [videoUrl, posterUrl],
    media_metadata: { duration_seconds: durationSeconds, encoded_at: new Date().toISOString() },
    tags,
    story_type: useTag,
  };
  const res = await fetch(`${EL_URL}/rest/v1/stories`, {
    method: 'POST',
    headers: {
      apikey: EL_KEY,
      Authorization: `Bearer ${EL_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`story ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const rows = (await res.json()) as Array<{ id: string }>;
  return { storyId: rows[0].id, posterUrl, videoUrl };
}

export interface FileResult {
  filename: string;
  ok: boolean;
  type: 'photo' | 'video' | 'other';
  storyId?: string;
  url?: string;
  error?: string;
}

export async function uploadMulti(formData: FormData): Promise<{
  ok: boolean;
  results: FileResult[];
  error?: string;
}> {
  if (!EL_URL || !EL_KEY) return { ok: false, results: [], error: 'EL credentials not configured' };

  const files = formData.getAll('files') as File[];
  if (files.length === 0) return { ok: false, results: [], error: 'No files provided' };

  const hasVideo = files.some((f) => f.type.startsWith('video/'));
  if (hasVideo && !hasFfmpeg()) {
    return {
      ok: false,
      results: [],
      error: 'ffmpeg/ffprobe not found in PATH. Videos can only be uploaded from a local dev environment with ffmpeg installed.',
    };
  }

  const shared: SharedTags = {
    trip: String(formData.get('trip') || 'trip-may-2026'),
    community: String(formData.get('community') || ''),
    event: String(formData.get('event') || '').trim() || undefined,
    participant: String(formData.get('participant') || '').trim() || undefined,
    themes: String(formData.get('themes') || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    product: String(formData.get('product') || '').trim() || undefined,
    hasConsent: formData.get('hasConsent') === 'on',
    use: (formData.get('use') as SharedTags['use']) || undefined,
    placements: formData.getAll('placements').map(String).filter(Boolean),
  };
  if (!shared.community) return { ok: false, results: [], error: 'community is required' };

  const tmpDir = await mkdtemp(join(tmpdir(), `goods-up-${Date.now()}-`));
  const results: FileResult[] = [];

  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
    try {
      const buf = Buffer.from(await file.arrayBuffer());
      if (file.type.startsWith('image/')) {
        const r = await processPhoto(buf, safeName, shared, tmpDir);
        results.push({ filename: file.name, ok: true, type: 'photo', storyId: r.storyId, url: r.url });
      } else if (file.type.startsWith('video/')) {
        const r = await processVideo(buf, safeName, shared, tmpDir);
        results.push({ filename: file.name, ok: true, type: 'video', storyId: r.storyId, url: r.videoUrl });
      } else {
        results.push({ filename: file.name, ok: false, type: 'other', error: `unsupported mime: ${file.type}` });
      }
    } catch (e) {
      results.push({
        filename: file.name,
        ok: false,
        type: file.type.startsWith('image/') ? 'photo' : file.type.startsWith('video/') ? 'video' : 'other',
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  // Cleanup any temp video files we wrote
  for (const f of files) {
    const p = join(tmpDir, f.name.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase());
    if (existsSync(p)) await unlink(p).catch(() => {});
    if (existsSync(`${p}.jpg`)) await unlink(`${p}.jpg`).catch(() => {});
    if (existsSync(`${p}.encoded.mp4`)) await unlink(`${p}.encoded.mp4`).catch(() => {});
  }

  revalidatePath('/admin/photos');
  revalidatePath('/field-notes/utopia-may-2026');

  const allOk = results.every((r) => r.ok);
  return { ok: allOk, results };
}
