'use server';

import { writeFile, unlink, mkdtemp } from 'node:fs/promises';
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

function ffprobeDuration(file: string): number | null {
  try {
    const out = execFileSync(
      'ffprobe',
      ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file],
      { stdio: ['pipe', 'pipe', 'pipe'] }
    )
      .toString()
      .trim();
    return parseFloat(out) || null;
  } catch {
    return null;
  }
}

function ffmpegPoster(file: string, outJpeg: string) {
  execFileSync(
    'ffmpeg',
    ['-y', '-ss', '1', '-i', file, '-frames:v', '1', '-vf', "scale='min(2400,iw)':-2", '-q:v', '3', outJpeg],
    { stdio: 'pipe' }
  );
}

function ffmpegOptimise(file: string, outMp4: string) {
  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-i', file,
      '-vf', "scale='min(1920,iw)':-2",
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '24',
      '-c:a', 'aac', '-b:a', '128k',
      '-movflags', '+faststart',
      outMp4,
    ],
    { stdio: 'pipe' }
  );
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

function durationBucket(secs: number | null): string {
  if (!secs) return 'duration:unknown';
  if (secs < 30) return 'duration:short';
  if (secs < 120) return 'duration:medium';
  return 'duration:long';
}

export interface UploadVideoInput {
  // Required
  use: 'atmosphere' | 'voice' | 'process' | 'moment' | 'establishing';
  placements: string[]; // ['overlay-fullscreen','under-text','standalone-card'] subset
  community: string;
  trip: string;
  title: string;
  // Optional
  caption?: string;
  participant?: string;
  themes?: string[];
  product?: string;
  hasConsent: boolean;
}

export async function uploadVideo(
  formData: FormData
): Promise<{ ok: boolean; storyId?: string; posterUrl?: string; videoUrl?: string; error?: string }> {
  if (!EL_URL || !EL_KEY) return { ok: false, error: 'EL credentials not configured' };
  if (!hasFfmpeg()) {
    return {
      ok: false,
      error:
        'ffmpeg/ffprobe not found in PATH. Video upload only works in a local dev environment with ffmpeg installed (`brew install ffmpeg`). For production, use the bulk script: node scripts/upload-videos.mjs',
    };
  }

  const file = formData.get('file') as File | null;
  if (!file) return { ok: false, error: 'No file provided' };
  if (file.size > 500 * 1024 * 1024) return { ok: false, error: 'File too large (max 500MB)' };

  const input: UploadVideoInput = {
    use: formData.get('use') as UploadVideoInput['use'],
    placements: formData.getAll('placements').map(String).filter(Boolean),
    community: String(formData.get('community') || '').trim(),
    trip: String(formData.get('trip') || '').trim(),
    title: String(formData.get('title') || '').trim(),
    caption: String(formData.get('caption') || '').trim() || undefined,
    participant: String(formData.get('participant') || '').trim() || undefined,
    themes: String(formData.get('themes') || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    product: String(formData.get('product') || '').trim() || undefined,
    hasConsent: formData.get('hasConsent') === 'on',
  };

  if (!input.use || !input.community || !input.trip || !input.title) {
    return { ok: false, error: 'use, community, trip, and title are required' };
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').toLowerCase();
  const ts = Date.now();
  const tmpDir = await mkdtemp(join(tmpdir(), `goods-vid-${ts}-`));
  const sourcePath = join(tmpDir, safeName);
  const posterPath = join(tmpDir, `${safeName}.jpg`);
  const encodedPath = join(tmpDir, `${safeName}.encoded.mp4`);

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    await writeFile(sourcePath, new Uint8Array(buf));

    const durationSeconds = ffprobeDuration(sourcePath);
    ffmpegPoster(sourcePath, posterPath);
    ffmpegOptimise(sourcePath, encodedPath);

    const stem = safeName.replace(/\.[^.]+$/, '');
    const storagePath = `${input.trip}/${input.use}/${ts}-${stem}`;

    const posterBuf = Buffer.from(await (await import('node:fs/promises')).readFile(posterPath));
    const videoBuf = Buffer.from(await (await import('node:fs/promises')).readFile(encodedPath));

    const posterUrl = await uploadToStorage(posterBuf, STORY_IMAGES_BUCKET, `${storagePath}.jpg`, 'image/jpeg');
    const videoUrl = await uploadToStorage(videoBuf, STORY_MEDIA_BUCKET, `${storagePath}.mp4`, 'video/mp4');

    const tags: string[] = [
      `format:video`,
      `media-type:video`,
      `use:${input.use}`,
      `trip:${input.trip}`,
      `community:${input.community}`,
      durationBucket(durationSeconds),
      'goods-staff-capture',
      input.hasConsent ? 'consent:public' : 'consent:elder-pending',
    ];
    for (const p of input.placements) tags.push(`placement:${p}`);
    if (input.participant) tags.push(`participant:${input.participant}`);
    if (input.product) tags.push(`product:${input.product}`);
    for (const t of input.themes || []) tags.push(`theme:${t}`);

    const isPublic = input.hasConsent;
    const body = {
      tenant_id: EL_TENANT_ID,
      project_id: EL_PROJECT_ID,
      storyteller_id: EL_FALLBACK_STORYTELLER_ID,
      author_id: EL_FALLBACK_AUTHOR_ID,
      title: input.title,
      content: input.caption || input.title,
      excerpt: input.caption?.slice(0, 200) || input.title,
      original_author_display: 'Goods on Country',
      status: isPublic ? 'published' : 'draft',
      community_status: isPublic ? 'published' : 'draft',
      is_public: isPublic,
      syndication_enabled: false,
      permission_tier: isPublic ? 'public' : 'private',
      language: 'en',
      requires_elder_review: !input.hasConsent,
      elder_reviewed: input.hasConsent,
      has_explicit_consent: input.hasConsent,
      consent_details: { source: 'admin-videos-new', captured_at: new Date().toISOString() },
      cultural_permission_level: isPublic ? 'public' : 'community',
      story_image_url: posterUrl,
      media_url: videoUrl,
      media_urls: [videoUrl, posterUrl],
      media_metadata: {
        duration_seconds: durationSeconds,
        encoded_at: new Date().toISOString(),
        encoder: 'admin-videos-new',
      },
      tags,
      story_type: input.use,
      privacy_level: isPublic ? 'public' : 'private',
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
    if (!res.ok) {
      return { ok: false, error: `EL insert failed (HTTP ${res.status}): ${(await res.text()).slice(0, 250)}` };
    }
    const rows = (await res.json()) as Array<{ id: string }>;
    const storyId = rows[0]?.id;

    revalidatePath('/admin/photos');
    revalidatePath('/admin/field-notes/utopia-may-2026');

    return { ok: true, storyId, posterUrl, videoUrl };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  } finally {
    for (const p of [sourcePath, posterPath, encodedPath]) {
      if (existsSync(p)) await unlink(p).catch(() => {});
    }
  }
}
