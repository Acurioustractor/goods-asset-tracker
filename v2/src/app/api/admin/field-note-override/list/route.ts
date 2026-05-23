// Returns EL media filtered by tag, normalised for the swap picker.
// Server route keeps the EL service key out of the browser.

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const EL_PROJECT_ID = process.env.EMPATHY_LEDGER_PROJECT_ID || '6bd47c8a-e676-456f-aa25-ddcbb5a31047';

interface ElRow {
  id: string;
  title: string | null;
  media_url: string | null;
  story_image_url: string | null;
  tags: string[] | null;
  story_type: string | null;
}

interface PickerItem {
  id: string;
  thumb: string;
  url: string;
  title: string;
  kind: 'photo' | 'video';
}

export async function GET(req: Request) {
  if (!EL_URL || !EL_KEY) return NextResponse.json([]);
  const url = new URL(req.url);
  const tags = url.searchParams.getAll('tag');
  const kind = url.searchParams.get('kind') || 'any';
  if (tags.length === 0) return NextResponse.json([]);

  const tagFilter = `tags=cs.{${tags.map((t) => `"${t}"`).join(',')}}`;
  const params = [
    `project_id=eq.${EL_PROJECT_ID}`,
    tagFilter,
    `select=id,title,media_url,story_image_url,tags,story_type`,
    `order=created_at.desc`,
    `limit=200`,
  ];
  const elUrl = `${EL_URL}/rest/v1/stories?${params.join('&')}`;
  const res = await fetch(elUrl, {
    headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
    cache: 'no-store',
  });
  if (!res.ok) return NextResponse.json([]);
  const rows = (await res.json()) as ElRow[];

  const items: PickerItem[] = rows
    .map((r) => {
      const tagSet = new Set(r.tags || []);
      const isVideo = tagSet.has('media-type:video') || tagSet.has('format:video');
      const isPhoto = tagSet.has('format:photo') || r.story_type === 'gallery-photo';
      const itemKind: 'photo' | 'video' = isVideo ? 'video' : 'photo';
      // For video the URL is media_url (mp4) and thumb is the poster.
      // For photo both URL and thumb are the image.
      const thumb = r.story_image_url || r.media_url || '';
      const url = isVideo ? r.media_url || '' : r.story_image_url || r.media_url || '';
      if (!thumb || !url) return null;
      if (kind === 'photo' && !isPhoto) return null;
      if (kind === 'video' && !isVideo) return null;
      return {
        id: r.id,
        thumb,
        url,
        title: r.title || '(untitled)',
        kind: itemKind,
      } as PickerItem;
    })
    .filter((it): it is PickerItem => it !== null);

  return NextResponse.json(items);
}
