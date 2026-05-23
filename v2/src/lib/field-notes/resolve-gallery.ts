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

import type { TripStory, MediaRef } from '@/lib/data/trip-stories';

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
  media_metadata: Record<string, unknown> | null;
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

async function fetchGalleryRows(
  query: { all?: string[]; any?: string[] },
  limit: number,
  publicOnly: boolean,
  mediaKind: 'photo' | 'video'
): Promise<ElPhotoRow[]> {
  if (!EL_URL || !EL_KEY) return [];
  const tagFilter = buildTagFilter(query);
  if (!tagFilter) return [];
  // EL upload conventions:
  //   photos → story_type='gallery-photo'
  //   videos → story_type IN ('video','testimonial','hero-overlay','setup',
  //            'behind-scenes','per-bed-video') with media-type:video tag
  // For videos we filter by tag rather than story_type because the upload
  // script writes the `use` value into story_type (testimonial/hero-overlay).
  const typeFilter = mediaKind === 'photo'
    ? `story_type=eq.gallery-photo`
    : `tags=cs.{"media-type:video"}`;
  const params = [
    `project_id=eq.${EL_PROJECT_ID}`,
    typeFilter,
    tagFilter,
    publicOnly ? `is_public=eq.true` : null,
    `select=id,title,excerpt,media_url,story_image_url,media_metadata,is_public,tags,created_at`,
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

// Resolve a single MediaRef. If `fromTag` is set, query EL for a matching
// placement:overlay-fullscreen video and override videoDesktop/videoMobile.
// The poster (image) is overridden too when EL has a story_image_url so the
// fallback still matches. Declared fields win if no EL match.
async function resolveMediaRef(
  media: MediaRef,
  internal: boolean
): Promise<MediaRef> {
  if (!media.fromTag) return media;
  // Hero pull always wants overlay-fullscreen videos.
  const query = { ...media.fromTag };
  const allWithPlacement = [...(query.all || []), 'placement:overlay-fullscreen'];
  const rows = await fetchGalleryRows(
    { all: allWithPlacement, any: query.any },
    1,
    !internal,
    'video'
  );
  const hit = rows[0];
  if (!hit || !hit.media_url) return media;
  return {
    ...media,
    image: hit.story_image_url || media.image,
    videoDesktop: hit.media_url,
    videoMobile: hit.media_url,
  };
}

export async function resolveGalleryBlocks(
  story: TripStory,
  opts: { internal?: boolean } = {}
): Promise<TripStory> {
  const internal = opts.internal === true;
  const blocks = await Promise.all(
    story.blocks.map(async (block) => {
      // Hero/overlay video pull on any block that carries a media field.
      // Masthead, immersive, bleedquote, close. The renderer doesn't care
      // whether the videoDesktop URL came from a declared path or EL.
      if ('media' in block && block.media && (block.media as MediaRef).fromTag) {
        const newMedia = await resolveMediaRef(block.media as MediaRef, internal);
        // Block kinds with media all share the same `media` field name; cast
        // back is safe because we only swap the media object.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        block = { ...(block as any), media: newMedia };
      }
      if (block.kind === 'el-gallery') {
        const photos = await fetchGalleryRows(
          block.tagQuery,
          block.limit ?? 24,
          !internal,
          'photo'
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
      }
      if (block.kind === 'el-video-gallery') {
        const rows = await fetchGalleryRows(
          block.tagQuery,
          block.limit ?? 6,
          !internal,
          'video'
        );
        const items = rows
          .map((r) => {
            const meta =
              (r.media_metadata as {
                duration_seconds?: number;
                orientation?: 'landscape' | 'portrait' | 'square';
              } | null) || null;
            return {
              id: r.id,
              title: r.title || '(untitled)',
              caption: r.excerpt || undefined,
              poster: r.story_image_url || '',
              src: r.media_url || '',
              durationSeconds: meta?.duration_seconds,
              orientation: meta?.orientation,
              isPublic: r.is_public,
            };
          })
          .filter((it) => it.src && it.poster);
        return { ...block, items };
      }
      return block;
    })
  );
  return { ...story, blocks };
}
