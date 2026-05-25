// Returns EL media filtered by tag, normalised for the swap picker.
// Server route keeps the EL service key out of the browser.
//
// Unions BOTH EL media tables (stories + media_assets) AND both photo
// story_types (gallery-photo + delivery-evidence). See memory note
// [[el-two-video-tables]] for the trap.

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const EL_PROJECT_ID = process.env.EMPATHY_LEDGER_PROJECT_ID || '6bd47c8a-e676-456f-aa25-ddcbb5a31047';

interface PickerItem {
  id: string;
  thumb: string;
  url: string;
  title: string;
  kind: 'photo' | 'video';
  tags?: string[];
}

interface ElStoryRow {
  id: string;
  title: string | null;
  media_url: string | null;
  story_image_url: string | null;
  tags: string[] | null;
  story_type: string | null;
  created_at: string;
}

interface ElMediaAssetRow {
  id: string;
  original_filename: string | null;
  filename: string | null;
  cdn_url: string | null;
  thumbnail_url: string | null;
  cultural_tags: string[] | null;
  media_type: string | null;
  visibility: string | null;
  uploaded_at: string;
  created_at: string;
}

function quoteTags(tags: string[]): string {
  return tags.map((t) => `"${t}"`).join(',');
}

async function fetchFromStories(tags: string[]): Promise<ElStoryRow[]> {
  // Empty tags = "no tag filter" = ALL stories for this project, recent first.
  // Used by the picker's "recent uploads" scope so just-uploaded items show
  // up even before someone has tagged them.
  const params = [
    `project_id=eq.${EL_PROJECT_ID}`,
    tags.length > 0 ? `tags=cs.{${quoteTags(tags)}}` : null,
    `select=id,title,media_url,story_image_url,tags,story_type,created_at`,
    `order=created_at.desc`,
    `limit=300`,
  ].filter(Boolean);
  const res = await fetch(`${EL_URL}/rest/v1/stories?${params.join('&')}`, {
    headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

async function fetchFromMediaAssets(tags: string[]): Promise<ElMediaAssetRow[]> {
  // Same "empty tags = all" rule as above.
  const params = [
    `project_id=eq.${EL_PROJECT_ID}`,
    tags.length > 0 ? `cultural_tags=cs.{${quoteTags(tags)}}` : null,
    `select=id,original_filename,filename,cdn_url,thumbnail_url,cultural_tags,media_type,visibility,uploaded_at,created_at`,
    `order=uploaded_at.desc`,
    `limit=300`,
  ].filter(Boolean);
  const res = await fetch(`${EL_URL}/rest/v1/media_assets?${params.join('&')}`, {
    headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export async function GET(req: Request) {
  if (!EL_URL || !EL_KEY) return NextResponse.json([]);
  const url = new URL(req.url);
  const tags = url.searchParams.getAll('tag');
  const kind = url.searchParams.get('kind') || 'any';
  const scope = url.searchParams.get('scope');
  // Recent-uploads scope: bypass the tags-required check so just-uploaded
  // files (even untagged ones) appear in the picker. Caller passes
  // `?scope=recent` instead of tags.
  if (tags.length === 0 && scope !== 'recent') return NextResponse.json([]);

  // Query both tables in parallel.
  const [storyRows, assetRows] = await Promise.all([
    fetchFromStories(tags),
    fetchFromMediaAssets(tags),
  ]);

  // Stories rows. Photo = gallery-photo OR delivery-evidence OR
  // format:photo-tagged. Video = media-type:video-tagged.
  // Thumb rules: for photos, image URL is fine. For videos, NEVER fall
  // through to media_url (that's the .mp4 itself — <img src=mp4> is broken).
  // If a video has no real thumbnail, return empty string and let the
  // picker render a <video preload=metadata> first-frame fallback.
  const storyItems: PickerItem[] = storyRows
    .map((r) => {
      const tagSet = new Set(r.tags || []);
      const isVideo = tagSet.has('media-type:video') || tagSet.has('format:video');
      const isPhoto =
        tagSet.has('format:photo') ||
        r.story_type === 'gallery-photo' ||
        r.story_type === 'delivery-evidence';
      const itemKind: 'photo' | 'video' = isVideo ? 'video' : 'photo';
      const itemUrl = isVideo ? r.media_url || '' : r.story_image_url || r.media_url || '';
      const thumb = isVideo
        ? (r.story_image_url || '')
        : (r.story_image_url || r.media_url || '');
      if (!itemUrl) return null;
      if (kind === 'photo' && !isPhoto) return null;
      if (kind === 'video' && !isVideo) return null;
      return {
        id: r.id,
        thumb,
        url: itemUrl,
        title: r.title || '(untitled)',
        kind: itemKind,
        tags: r.tags || [],
      } as PickerItem;
    })
    .filter((it): it is PickerItem => it !== null);

  // media_assets rows. media_type column is authoritative ('image'|'video').
  const assetItems: PickerItem[] = assetRows
    .map((r) => {
      const isVideo = r.media_type === 'video';
      const isPhoto = r.media_type === 'image';
      const itemKind: 'photo' | 'video' = isVideo ? 'video' : 'photo';
      if (kind === 'photo' && !isPhoto) return null;
      if (kind === 'video' && !isVideo) return null;
      const itemUrl = r.cdn_url || '';
      const thumb = isVideo ? (r.thumbnail_url || '') : (r.thumbnail_url || r.cdn_url || '');
      if (!itemUrl) return null;
      const baseName = (r.original_filename || r.filename || '').replace(/\.(mp4|mov|webm|m4v|jpe?g|png|heic|heif)$/i, '');
      return {
        id: r.id,
        thumb,
        url: itemUrl,
        title: baseName || '(untitled)',
        kind: itemKind,
        tags: r.cultural_tags || [],
      } as PickerItem;
    })
    .filter((it): it is PickerItem => it !== null);

  // De-dupe by id (impossible collision across tables, but cheap to guard).
  const seen = new Set<string>();
  const merged: PickerItem[] = [];
  for (const it of [...storyItems, ...assetItems]) {
    if (seen.has(it.id)) continue;
    seen.add(it.id);
    merged.push(it);
  }

  return NextResponse.json(merged);
}
