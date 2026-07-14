// Community media resolver — the ONE place that decides which photos and
// videos may represent a community on public pages.
//
// Source of truth: the `content_items` media index (Goods Supabase). The
// indexer (scripts/content-index.mjs) crawls public/images/** + public/video/**
// and mirrors Empathy Ledger, linking rows to communities via:
//   1. content_items.community_id (auto-linked from area/url, storyteller
//      portraits, and community:<id> tags in data/local-image-tags.json)
//   2. consent_tier — HARD GATE: only 'public' rows ever render here.
//      'gated' (internal/funder) and 'red' (default-deny, incl. withdrawn EL
//      items) never reach the open web.
//
// Fallback: the hand-verified static map in community-media.ts. It fills holes
// when the library has no public rows for a community (and keeps dev working,
// where `npm run dev` strips Supabase env on purpose).
//
// Ranking inside a community: starred first, then rating, then stable by url.
// Portraits and logos never appear in hero/gallery; overlays never appear as
// standalone films.

import { createServiceClient } from '@/lib/supabase/server';
import { COMMUNITY_MEDIA, type CommunityImage } from './community-media';

export interface ResolvedVideo {
  src: string;
  poster: string | null;
  title: string;
}

export interface ResolvedCommunityMedia {
  hero?: CommunityImage;
  gallery: CommunityImage[];
  videos: ResolvedVideo[];
  /** Where the media came from: the tagged library, the manual map, or nothing. */
  origin: 'library' | 'manual' | 'none';
}

/**
 * Page slugs (content.ts communityLocations ids) → communities-table ids used
 * by content_items.community_id. Only add VERIFIED mappings — an unmapped slug
 * simply resolves no library rows, which is the safe direction.
 * (The communities table uses 'utopia'; the public route uses 'utopia-homelands'.)
 */
const PAGE_SLUG_TO_LIBRARY_ID: Record<string, string> = {
  'utopia-homelands': 'utopia',
};

interface LibraryRow {
  url: string;
  poster_url: string | null;
  media_type: string;
  media_subtype: string | null;
  consent_tier: string;
  community_id: string | null;
  starred: boolean | null;
  rating: number | null;
}

// One fetch per server instance per TTL — the index and nine community pages
// share it instead of issuing ten identical queries.
const TTL_MS = 5 * 60 * 1000;
let cache: { at: number; rows: LibraryRow[] } | null = null;

async function fetchPublicCommunityRows(): Promise<LibraryRow[]> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.rows;
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('content_items')
      .select('url,poster_url,media_type,media_subtype,consent_tier,community_id,starred,rating')
      .eq('consent_tier', 'public')
      .is('archived_at', null)
      .not('community_id', 'is', null);
    if (error) return cache?.rows ?? [];
    const rows = (data ?? []) as LibraryRow[];
    cache = { at: Date.now(), rows };
    return rows;
  } catch {
    return cache?.rows ?? [];
  }
}

function rank(a: LibraryRow, b: LibraryRow): number {
  if (!!b.starred !== !!a.starred) return b.starred ? 1 : -1;
  const ra = a.rating ?? 0;
  const rb = b.rating ?? 0;
  if (rb !== ra) return rb - ra;
  return a.url.localeCompare(b.url);
}

function humanise(url: string, communityName: string): string {
  const file = (url.split('/').pop() ?? '').replace(/\.\w+$/, '').replace(/[-_]+/g, ' ').trim();
  return file ? `${communityName} — ${file}` : communityName;
}

function toResolved(
  rows: LibraryRow[],
  communityName: string,
  manual: { hero?: CommunityImage; gallery?: CommunityImage[]; video?: { desktop: string; poster: string; title: string } },
): ResolvedCommunityMedia {
  const images = rows
    .filter((r) => r.media_type === 'image' && r.media_subtype !== 'portrait' && r.media_subtype !== 'logo')
    .sort(rank);
  const videos = rows
    .filter((r) => r.media_type === 'video' && r.media_subtype !== 'overlay')
    .sort(rank)
    .map((r) => ({ src: r.url, poster: r.poster_url, title: humanise(r.url, communityName) }));

  const libraryImages: CommunityImage[] = images.map((r) => ({
    src: r.url,
    alt: humanise(r.url, communityName),
  }));

  if (libraryImages.length === 0 && videos.length === 0) {
    // Library knows nothing public for this community — manual map or nothing.
    return {
      hero: manual.hero,
      gallery: manual.gallery ?? [],
      videos: manual.video
        ? [{ src: manual.video.desktop, poster: manual.video.poster, title: manual.video.title }]
        : [],
      origin: manual.hero || manual.gallery?.length || manual.video ? 'manual' : 'none',
    };
  }

  return {
    hero: libraryImages[0] ?? manual.hero,
    gallery: libraryImages.length > 1 ? libraryImages.slice(1) : (manual.gallery ?? []),
    videos: videos.length > 0
      ? videos
      : manual.video
        ? [{ src: manual.video.desktop, poster: manual.video.poster, title: manual.video.title }]
        : [],
    origin: 'library',
  };
}

/** Resolved media for one community page. */
export async function resolveCommunityMedia(
  pageSlug: string,
  communityName: string,
): Promise<ResolvedCommunityMedia> {
  const libraryId = PAGE_SLUG_TO_LIBRARY_ID[pageSlug] ?? pageSlug;
  const rows = (await fetchPublicCommunityRows()).filter((r) => r.community_id === libraryId);
  return toResolved(rows, communityName, COMMUNITY_MEDIA[pageSlug] ?? {});
}

/** Resolved media for every community at once (index page thumbnails). */
export async function resolveAllCommunityMedia(
  communities: Array<{ id: string; name: string }>,
): Promise<Record<string, ResolvedCommunityMedia>> {
  const rows = await fetchPublicCommunityRows();
  const out: Record<string, ResolvedCommunityMedia> = {};
  for (const c of communities) {
    const libraryId = PAGE_SLUG_TO_LIBRARY_ID[c.id] ?? c.id;
    out[c.id] = toResolved(
      rows.filter((r) => r.community_id === libraryId),
      c.name,
      COMMUNITY_MEDIA[c.id] ?? {},
    );
  }
  return out;
}
