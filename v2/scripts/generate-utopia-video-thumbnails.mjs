#!/usr/bin/env node
// Generate thumbnail JPGs for every trip:may-2026 video in EL that
// doesn't have one. For each:
//   1. Download the MP4 (range request, first ~3 MB is enough)
//   2. Extract a frame at ~2s with ffmpeg
//   3. Upload to EL storage under <prefix>/thumbs/<id>.jpg
//   4. PATCH media_assets.thumbnail_url to point at the new JPG
//
// Then re-walk Ben's Utopia article and refresh any el-video-gallery
// item.poster from the (now-set) thumbnail_url so the article shows
// the thumbs without manual swap.

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL;
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY;
if (!EL_URL || !EL_KEY) { console.error('EL env vars missing'); process.exit(1); }

const BUCKET = 'media';
const STORY_ID = '55897065-526b-4c56-8fb7-8a2c3ace4993';

const TMP = '/tmp/utopia-thumbs';
fs.mkdirSync(TMP, { recursive: true });

async function fetchVideos() {
  const url = `${EL_URL}/rest/v1/media_assets?cultural_tags=cs.%7B%22trip:may-2026%22%7D&media_type=eq.video&select=id,original_filename,cdn_url,thumbnail_url&limit=100`;
  const res = await fetch(url, { headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` } });
  return res.json();
}

function pathFromCdnUrl(cdnUrl) {
  // Cdn URL: https://<proj>.supabase.co/storage/v1/object/public/media/<prefix>/<filename>
  const m = cdnUrl.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)$/);
  if (!m) return null;
  // m[1] = <prefix>/<filename>
  const parts = m[1].split('/');
  const filename = parts.pop();
  return { prefix: parts.join('/'), filename };
}

async function downloadVideo(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  return buf.length;
}

function extractFrame(videoPath, jpgPath) {
  // Try 2 seconds in; if the video is shorter, ffmpeg will still grab
  // whatever frame is closest (or fall through to frame 0).
  const r = spawnSync(
    'ffmpeg',
    ['-y', '-ss', '2', '-i', videoPath, '-frames:v', '1', '-q:v', '3', '-vf', 'scale=1280:-2', jpgPath],
    { stdio: 'pipe' },
  );
  if (r.status !== 0) {
    // Retry at frame 0
    const r2 = spawnSync(
      'ffmpeg',
      ['-y', '-i', videoPath, '-frames:v', '1', '-q:v', '3', '-vf', 'scale=1280:-2', jpgPath],
      { stdio: 'pipe' },
    );
    if (r2.status !== 0) throw new Error('ffmpeg failed for ' + videoPath);
  }
}

async function uploadThumb(prefix, id, jpgPath) {
  const key = `${prefix}/thumbs/${id}.jpg`;
  const buf = fs.readFileSync(jpgPath);
  const res = await fetch(`${EL_URL}/storage/v1/object/${BUCKET}/${key}`, {
    method: 'POST',
    headers: {
      apikey: EL_KEY,
      Authorization: `Bearer ${EL_KEY}`,
      'Content-Type': 'image/jpeg',
      'x-upsert': 'true',
    },
    body: buf,
  });
  if (!res.ok) throw new Error(`upload failed ${res.status}: ${await res.text()}`);
  return `${EL_URL}/storage/v1/object/public/${BUCKET}/${key}`;
}

async function patchAsset(id, thumbnailUrl) {
  const res = await fetch(`${EL_URL}/rest/v1/media_assets?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: EL_KEY,
      Authorization: `Bearer ${EL_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ thumbnail_url: thumbnailUrl }),
  });
  if (!res.ok) throw new Error(`PATCH failed ${res.status}: ${await res.text()}`);
}

async function refreshArticleBlocksPosters() {
  // Look up the current article blocks and update any items[].poster
  // for el-video-gallery items whose .src matches a video URL we just
  // thumbnailed. Mirrored to content via simple substitution.
  const getRes = await fetch(`${EL_URL}/rest/v1/stories?id=eq.${STORY_ID}&select=media_metadata,content`, {
    headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
  });
  const [row] = await getRes.json();
  const mm = row.media_metadata || {};
  const blocks = mm.blocks || [];

  // Build {cdn_url → thumbnail_url} index by re-fetching after PATCH.
  const fresh = await fetchVideos();
  const byUrl = new Map();
  for (const v of fresh) {
    if (v.cdn_url && v.thumbnail_url) byUrl.set(v.cdn_url, v.thumbnail_url);
  }
  let touched = 0;
  for (const b of blocks) {
    if (b.kind === 'el-video-gallery' && Array.isArray(b.items)) {
      for (const it of b.items) {
        const t = byUrl.get(it.src);
        if (t && it.poster !== t) {
          it.poster = t;
          touched++;
        }
      }
    }
    // masthead/immersive/close blocks with media.videoDesktop/videoMobile
    if (b.media && typeof b.media === 'object') {
      const dt = byUrl.get(b.media.videoDesktop);
      if (dt && b.media.poster !== dt) {
        b.media.poster = dt;
        touched++;
      }
    }
  }
  if (touched > 0) {
    await fetch(`${EL_URL}/rest/v1/stories?id=eq.${STORY_ID}`, {
      method: 'PATCH',
      headers: {
        apikey: EL_KEY,
        Authorization: `Bearer ${EL_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ media_metadata: { ...mm, blocks } }),
    });
  }
  return touched;
}

async function main() {
  const videos = await fetchVideos();
  const todo = videos.filter((v) => !v.thumbnail_url && v.cdn_url);
  console.log(`${videos.length} trip:may-2026 videos · ${todo.length} need thumbnails`);

  let done = 0;
  let failed = 0;
  for (const v of todo) {
    const label = (v.original_filename || v.id).slice(0, 60);
    try {
      const meta = pathFromCdnUrl(v.cdn_url);
      if (!meta) throw new Error('unparseable cdn_url');
      const mp4 = path.join(TMP, `${v.id}.mp4`);
      const jpg = path.join(TMP, `${v.id}.jpg`);
      console.log(`[${done + failed + 1}/${todo.length}] ${label}`);
      const bytes = await downloadVideo(v.cdn_url, mp4);
      extractFrame(mp4, jpg);
      const url = await uploadThumb(meta.prefix, v.id, jpg);
      await patchAsset(v.id, url);
      fs.unlinkSync(mp4);
      fs.unlinkSync(jpg);
      done++;
      console.log(`  ✓ ${(bytes / 1e6).toFixed(1)} MB · thumb at ${url.slice(url.lastIndexOf('/') + 1)}`);
    } catch (err) {
      failed++;
      console.log(`  ✗ ${err.message}`);
    }
  }
  console.log(`\nDone. ${done} succeeded, ${failed} failed.`);

  console.log('\nRefreshing Utopia article posters from new thumbnails...');
  const updated = await refreshArticleBlocksPosters();
  console.log(`Updated ${updated} block media references with new posters.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
