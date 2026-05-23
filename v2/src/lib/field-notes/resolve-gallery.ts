// Server-side resolver for `el-gallery` blocks in trip stories. Walks the
// blocks of a TripStory, finds any gallery blocks, fetches matching photos
// from Empathy Ledger, and returns a new story with the gallery `items`
// populated.
//
// Why server-side: EL service key cannot ship to the browser. Resolving
// before passing to <TripStory /> keeps the renderer dumb and the data
// fresh per request.
//
// Tag query semantics:
//  - { all: [...] }  → EL stories whose `tags` array contains EVERY tag
//                      (PostgREST `cs.{...}` operator)
//  - { any: [...] }  → EL stories whose `tags` array overlaps any of these
//                      (PostgREST `ov.{...}` operator)
//  - Both can be combined; the result is the intersection.

import type { TripStory } from '@/lib/data/trip-stories';

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const EL_PROJECT_ID =
  process.env.EMPATHY_LEDGER_PROJECT_ID || '6bd47c8a-e676-456f-aa25-ddcbb5a31047';

interface ElPhotoRow {
  id: string;
  title: string | null;
  excerpt: string | null;
  media_url: string | null;
  story_image_url: string | null;
  is_public: boolean;
  tags: string[] | null;
  created_at: string;
}

function buildTagFilter(query: { all?: string[]; any?: string[] }): string {
  const parts: string[] = [];
  if (query.all && query.all.length) {
    parts.push(`tags=cs.{${query.all.map((t) => `"${t}"`).join(',')}}`);
  }
  if (query.any && query.any.length) {
    parts.push(`tags=ov.{${query.any.map((t) => `"${t}"`).join(',')}}`);
  }
  return parts.join('&');
}

async function fetchGalleryPhotos(
  query: { all?: string[]; any?: string[] },
  limit: number,
  publicOnly: boolean
): Promise<ElPhotoRow[]> {
  if (!EL_URL || !EL_KEY) return [];
  const tagFilter = buildTagFilter(query);
  if (!tagFilter) return [];
  const params = [
    `project_id=eq.${EL_PROJECT_ID}`,
    `story_type=eq.gallery-photo`,
    tagFilter,
    publicOnly ? `is_public=eq.true` : null,
    `select=id,title,excerpt,media_url,story_image_url,is_public,tags,created_at`,
    `order=created_at.asc`,
    `limit=${limit}`,
  ].filter(Boolean);
  const url = `${EL_URL}/rest/v1/stories?${params.join('&')}`;
  const res = await fetch(url, {
    headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export async function resolveGalleryBlocks(
  story: TripStory,
  opts: { internal?: boolean } = {}
): Promise<TripStory> {
  const internal = opts.internal === true;
  const blocks = await Promise.all(
    story.blocks.map(async (block) => {
      if (block.kind !== 'el-gallery') return block;
      const photos = await fetchGalleryPhotos(
        block.tagQuery,
        block.limit ?? 24,
        !internal
      );
      const items = photos
        .map((p) => ({
          id: p.id,
          src: p.story_image_url || p.media_url || '',
          alt: p.title || '',
          caption: p.excerpt || undefined,
          isPublic: p.is_public,
        }))
        .filter((it) => it.src);
      return { ...block, items };
    })
  );
  return { ...story, blocks };
}
