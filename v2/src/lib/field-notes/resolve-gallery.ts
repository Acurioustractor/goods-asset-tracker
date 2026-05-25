// Server-side resolver for `el-gallery` / `el-video-gallery` / masthead
// `fromTag` blocks in trip stories. Walks the blocks, fetches matching media
// from Empathy Ledger, and returns a new story with `items` / `media` filled.
//
// EL stores media in TWO tables, and a clean Goods page has to read both:
//   1. `stories` — long-form story rows (story_type='voice'/'gallery-photo'/…)
//      with a `tags text[]` column. Tag scheme: `use:*`, `placement:*`,
//      `media-type:video`, `event:*`, `trip:*`, `participant:*`.
//   2. `media_assets` — the EL Videos admin uploads here. Different schema:
//      `cdn_url`, `thumbnail_url`, `cultural_tags text[]`, `media_type='video'`,
//      `project_id` FK. Same tag scheme is layered on top of `cultural_tags`.
//
// Tag query semantics are identical for both sources:
//  - { all: [...] }  → AND  (PostgREST `cs.{...}` on tags / cultural_tags)
//  - { any: [...] }  → OR   (PostgREST `ov.{...}`)

import type { TripStory, MediaRef } from '@/lib/data/trip-stories';

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const EL_PROJECT_ID =
  process.env.EMPATHY_LEDGER_PROJECT_ID || '6bd47c8a-e676-456f-aa25-ddcbb5a31047';

interface UnifiedRow {
  id: string;
  title: string;
  caption?: string;
  poster: string; // may be ''; renderer falls back to first frame
  src: string;
  isPublic: boolean;
  orientation?: 'landscape' | 'portrait' | 'square';
  durationSeconds?: number;
  createdAt: string;
}

interface ElStoryRow {
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

interface ElMediaAssetRow {
  id: string;
  original_filename: string | null;
  filename: string | null;
  caption: string | null;
  description: string | null;
  cdn_url: string | null;
  thumbnail_url: string | null;
  width: number | null;
  height: number | null;
  aspect_ratio: number | null;
  duration: number | null;
  visibility: string | null;
  cultural_tags: string[] | null;
  uploaded_at: string;
  created_at: string;
}

function quoteTagList(tags: string[]): string {
  // PostgREST cs/ov arrays need each value quoted because tags can contain ':'.
  return tags.map((t) => `"${t}"`).join(',');
}

function buildTagFilter(query: { all?: string[]; any?: string[] }, column: string): string {
  const parts: string[] = [];
  if (query.all && query.all.length) parts.push(`${column}=cs.{${quoteTagList(query.all)}}`);
  if (query.any && query.any.length) parts.push(`${column}=ov.{${quoteTagList(query.any)}}`);
  return parts.join('&');
}

function orientationFromAspect(ar: number | null, w: number | null, h: number | null): 'landscape' | 'portrait' | 'square' | undefined {
  const ratio = ar || (w && h ? w / h : null);
  if (!ratio) return undefined;
  if (ratio > 1.15) return 'landscape';
  if (ratio < 0.85) return 'portrait';
  return 'square';
}

async function fetchStoriesGalleryRows(
  query: { all?: string[]; any?: string[] },
  limit: number,
  publicOnly: boolean,
  mediaKind: 'photo' | 'video'
): Promise<UnifiedRow[]> {
  if (!EL_URL || !EL_KEY) return [];
  const tagFilter = buildTagFilter(query, 'tags');
  if (!tagFilter) return [];
  // Photos may be filed under either story_type — EL admin "Photos" upload
  // creates `gallery-photo` rows; the batch delivery-evidence pipeline
  // creates `delivery-evidence` rows. Both carry photos with similar tag
  // schemes, so we union them via PostgREST `in.` filter.
  const typeFilter = mediaKind === 'photo'
    ? `story_type=in.(gallery-photo,delivery-evidence)`
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
  const res = await fetch(`${EL_URL}/rest/v1/stories?${params.join('&')}`, {
    headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const rows: ElStoryRow[] = await res.json();
  return rows.map((r) => {
    const meta = (r.media_metadata as {
      duration_seconds?: number;
      orientation?: 'landscape' | 'portrait' | 'square';
    } | null) || null;
    return {
      id: r.id,
      title: r.title || '(untitled)',
      caption: r.excerpt || undefined,
      poster: r.story_image_url || '',
      src: r.media_url || '',
      isPublic: r.is_public,
      orientation: meta?.orientation,
      durationSeconds: meta?.duration_seconds,
      createdAt: r.created_at,
    };
  }).filter((r) => r.src);
}

async function fetchMediaAssetsVideoRows(
  query: { all?: string[]; any?: string[] },
  limit: number,
  publicOnly: boolean
): Promise<UnifiedRow[]> {
  if (!EL_URL || !EL_KEY) return [];
  const tagFilter = buildTagFilter(query, 'cultural_tags');
  if (!tagFilter) return [];
  const params = [
    `project_id=eq.${EL_PROJECT_ID}`,
    `media_type=eq.video`,
    tagFilter,
    publicOnly ? `visibility=eq.public` : null,
    `select=id,original_filename,filename,caption,description,cdn_url,thumbnail_url,width,height,aspect_ratio,duration,visibility,cultural_tags,uploaded_at,created_at`,
    `order=uploaded_at.asc`,
    `limit=${limit}`,
  ].filter(Boolean);
  const res = await fetch(`${EL_URL}/rest/v1/media_assets?${params.join('&')}`, {
    headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const rows: ElMediaAssetRow[] = await res.json();
  return rows.map((r) => {
    const baseName = (r.original_filename || r.filename || '').replace(/\.(mp4|mov|webm|m4v)$/i, '');
    return {
      id: r.id,
      title: baseName || '(untitled)',
      caption: r.caption || r.description || undefined,
      poster: r.thumbnail_url || '',
      src: r.cdn_url || '',
      isPublic: (r.visibility || 'public') === 'public',
      orientation: orientationFromAspect(r.aspect_ratio, r.width, r.height),
      durationSeconds: r.duration ?? undefined,
      createdAt: r.uploaded_at || r.created_at,
    };
  }).filter((r) => r.src);
}

// Photos live in BOTH `stories` (gallery-photo story_type) AND
// `media_assets` (media_type=image). Photos uploaded via EL admin's
// generic uploader land in media_assets; older delivery-evidence photos
// are in stories. Union both so hero-photo / manual-gallery / el-gallery
// blocks can find images regardless of where they were saved.
async function fetchMediaAssetsPhotoRows(
  query: { all?: string[]; any?: string[] },
  limit: number,
  publicOnly: boolean,
): Promise<UnifiedRow[]> {
  if (!EL_URL || !EL_KEY) return [];
  const tagFilter = buildTagFilter(query, 'cultural_tags');
  if (!tagFilter) return [];
  const params = [
    `project_id=eq.${EL_PROJECT_ID}`,
    `media_type=eq.image`,
    tagFilter,
    publicOnly ? `visibility=eq.public` : null,
    `select=id,original_filename,filename,caption,description,cdn_url,thumbnail_url,width,height,aspect_ratio,visibility,cultural_tags,uploaded_at,created_at`,
    `order=uploaded_at.asc`,
    `limit=${limit}`,
  ].filter(Boolean);
  const res = await fetch(`${EL_URL}/rest/v1/media_assets?${params.join('&')}`, {
    headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const rows: ElMediaAssetRow[] = await res.json();
  return rows.map((r) => {
    const baseName = (r.original_filename || r.filename || '').replace(/\.(jpe?g|png|heic|heif|webp)$/i, '');
    return {
      id: r.id,
      title: baseName || '(untitled)',
      caption: r.caption || r.description || undefined,
      poster: r.cdn_url || r.thumbnail_url || '',
      src: r.cdn_url || '',
      isPublic: (r.visibility || 'public') === 'public',
      orientation: orientationFromAspect(r.aspect_ratio, r.width, r.height),
      createdAt: r.uploaded_at || r.created_at,
    };
  }).filter((r) => r.src);
}

async function fetchPhotoGallery(
  query: { all?: string[]; any?: string[] },
  limit: number,
  publicOnly: boolean
): Promise<{ id: string; src: string; alt?: string; caption?: string; isPublic: boolean }[]> {
  const [stories, assets] = await Promise.all([
    fetchStoriesGalleryRows(query, limit, publicOnly, 'photo'),
    fetchMediaAssetsPhotoRows(query, limit, publicOnly),
  ]);
  const seen = new Set<string>();
  const merged: { id: string; src: string; alt?: string; caption?: string; isPublic: boolean }[] = [];
  for (const r of [...stories, ...assets]) {
    if (seen.has(r.id)) continue;
    seen.add(r.id);
    merged.push({
      id: r.id,
      src: r.poster || r.src, // stories store image in story_image_url (poster); media_assets in src
      alt: r.title,
      caption: r.caption,
      isPublic: r.isPublic,
    });
  }
  return merged.slice(0, limit);
}

// Union: stories table (legacy + voice clips) + media_assets table (Videos admin).
// Sort by createdAt so the editorial order matches upload order across both
// sources. De-dupe by id (collision is impossible across tables, but safe).
async function fetchVideoUnion(
  query: { all?: string[]; any?: string[] },
  limit: number,
  publicOnly: boolean
): Promise<UnifiedRow[]> {
  const [stories, assets] = await Promise.all([
    fetchStoriesGalleryRows(query, limit, publicOnly, 'video'),
    fetchMediaAssetsVideoRows(query, limit, publicOnly),
  ]);
  const seen = new Set<string>();
  const merged: UnifiedRow[] = [];
  for (const row of [...stories, ...assets]) {
    if (seen.has(row.id)) continue;
    seen.add(row.id);
    merged.push(row);
  }
  merged.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  return merged.slice(0, limit);
}

// Resolve a single MediaRef. If `fromTag` is set, query EL and override
// videoDesktop/videoMobile with the first match. The caller is responsible
// for narrowing the query — if they want a fullscreen overlay video,
// they include `placement:overlay-fullscreen`; for an under-text loop
// behind a read block they include `placement:under-text`. The resolver
// stays placement-agnostic so authors can pick the right footage for the
// editorial context.
async function resolveMediaRef(
  media: MediaRef,
  internal: boolean
): Promise<MediaRef> {
  if (!media.fromTag) return media;
  const query = { ...media.fromTag };
  const flatTags = [...(query.all || []), ...(query.any || [])];
  // Photo-first slots (hero-photo) explicitly include format:photo in
  // their tag query. Fetch a still image and set `image`. Otherwise
  // fall back to video resolution.
  const wantsPhoto = flatTags.includes('format:photo');
  if (wantsPhoto) {
    const photos = await fetchPhotoGallery(
      { all: query.all, any: query.any },
      1,
      !internal,
    );
    const hit = photos[0];
    if (!hit) return media;
    return { ...media, image: hit.src };
  }
  const rows = await fetchVideoUnion(
    { all: query.all, any: query.any },
    1,
    !internal
  );
  const hit = rows[0];
  if (!hit || !hit.src) return media;
  // IMPORTANT: do NOT clobber media.image — that field holds the user's
  // pinned photo fallback (set via the swap UI). Write the video's poster
  // to its own field so the <video> element can use it without erasing
  // the fallback the user chose for the no-video case.
  return {
    ...media,
    poster: hit.poster || media.poster,
    videoDesktop: hit.src,
    videoMobile: hit.src,
  };
}

/**
 * Fetch specific EL photos by their story IDs, in the order requested.
 * Used by the `manual-gallery` block where the author hand-picks photos
 * instead of relying on tag queries.
 */
async function fetchPhotosByIds(
  ids: string[],
  publicOnly: boolean,
): Promise<{ id: string; src: string; alt?: string; caption?: string; isPublic: boolean }[]> {
  if (!EL_URL || !EL_KEY || ids.length === 0) return [];
  const idList = ids.map((s) => s.trim()).filter(Boolean);
  if (idList.length === 0) return [];
  const params = [
    `project_id=eq.${EL_PROJECT_ID}`,
    `id=in.(${idList.join(',')})`,
    publicOnly ? `is_public=eq.true` : null,
    `select=id,title,excerpt,media_url,story_image_url,is_public`,
  ].filter(Boolean);
  const res = await fetch(`${EL_URL}/rest/v1/stories?${params.join('&')}`, {
    headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const rows: ElStoryRow[] = await res.json();
  const byId = new Map<string, ElStoryRow>();
  for (const r of rows) byId.set(r.id, r);
  // Preserve user-specified order, drop any IDs that came back missing.
  const out: { id: string; src: string; alt?: string; caption?: string; isPublic: boolean }[] = [];
  for (const id of idList) {
    const r = byId.get(id);
    if (!r) continue;
    const src = r.story_image_url || r.media_url;
    if (!src) continue;
    out.push({
      id: r.id,
      src,
      alt: r.title || undefined,
      caption: r.excerpt || undefined,
      isPublic: r.is_public,
    });
  }
  return out;
}

export async function resolveGalleryBlocks(
  story: TripStory,
  opts: { internal?: boolean } = {}
): Promise<TripStory> {
  const internal = opts.internal === true;
  const blocks = await Promise.all(
    story.blocks.map(async (block) => {
      // Hero/overlay video pull on any block that carries a media field.
      if ('media' in block && block.media && (block.media as MediaRef).fromTag) {
        const newMedia = await resolveMediaRef(block.media as MediaRef, internal);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        block = { ...(block as any), media: newMedia };
      }
      if (block.kind === 'el-gallery') {
        const items = await fetchPhotoGallery(
          block.tagQuery,
          block.limit ?? 24,
          !internal
        );
        return { ...block, items };
      }
      if (block.kind === 'manual-gallery') {
        const raw = (block as unknown as { _photoIds?: string })._photoIds || '';
        const ids = raw.split(',').map((s) => s.trim()).filter(Boolean);
        // Manual-gallery is hand-curated: the author explicitly picks each
        // photo ID via the in-page admin tool. Treat that as implicit consent
        // and skip the is_public filter so the curator's selections appear
        // even before EL flips the photo to public. Tag-query galleries
        // (el-gallery) still respect is_public.
        const items = await fetchPhotosByIds(ids, false);
        return { ...block, items };
      }
      if (block.kind === 'el-video-gallery') {
        const rows = await fetchVideoUnion(
          block.tagQuery,
          block.limit ?? 6,
          !internal
        );
        const items = rows.map((r) => ({
          id: r.id,
          title: r.title,
          caption: r.caption,
          poster: r.poster, // may be '' — renderer + browser handle that
          src: r.src,
          durationSeconds: r.durationSeconds,
          orientation: r.orientation,
          isPublic: r.isPublic,
        }));
        return { ...block, items };
      }
      return block;
    })
  );
  return { ...story, blocks };
}
