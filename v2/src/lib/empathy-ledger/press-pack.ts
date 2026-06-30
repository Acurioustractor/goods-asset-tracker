// Server-side fetchers for the /press hub. Pulls approved Goods media
// directly from Empathy Ledger so the press pack always reflects what's
// currently consent-cleared and syndication-enabled.
//
// EL stores media across TWO tables (see field-notes/resolve-gallery.ts):
//   - `media_assets` — uploads via EL admin (cdn_url, visibility, media_type)
//   - `stories` — long-form rows that may carry a video or hero photo
//                 (media_url, story_image_url, is_public)
//
// For the press pack we want ALL approved Goods media — no tag filter —
// ordered by newest first.

import 'server-only';

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const EL_PROJECT_ID =
  process.env.EMPATHY_LEDGER_PROJECT_ID || '6bd47c8a-e676-456f-aa25-ddcbb5a31047';

const REVALIDATE_SECONDS = 300; // 5 min

// Tag conventions in EL:
//   `press-featured` — surface first on /press
//   `press-vertical` — manually mark vertical/social orientation when EL has no aspect_ratio
const PRESS_FEATURED_TAG = 'press-featured';
const PRESS_VERTICAL_TAG = 'press-vertical';

function isExpectedELAuthFailure(status: number, body: string): boolean {
  if (![401, 403].includes(status)) return false;
  return body.includes('Legacy API keys are disabled') || body.toLowerCase().includes('jwt');
}

export interface PressPhoto {
  id: string;
  src: string;
  caption: string;
  credit: string;
  width: number | null;
  height: number | null;
  orientation: 'landscape' | 'portrait' | 'square';
  createdAt: string;
  source: 'media_assets' | 'stories';
  featured: boolean;
}

export interface PressVideo {
  id: string;
  title: string;
  description: string;
  src: string;             // direct mp4 / cdn url for download
  poster: string;          // thumbnail
  durationSeconds: number | null;
  orientation: 'landscape' | 'portrait' | 'square';
  createdAt: string;
  source: 'media_assets' | 'stories';
  featured: boolean;
}

interface MediaAssetRow {
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
  media_type: string;
}

interface StoryRow {
  id: string;
  title: string | null;
  excerpt: string | null;
  media_url: string | null;
  story_image_url: string | null;
  media_metadata: Record<string, unknown> | null;
  is_public: boolean;
  consent_withdrawn_at: string | null;
  is_archived: boolean | null;
  syndication_enabled: boolean | null;
  created_at: string;
  story_type: string | null;
}

function orientationFromSize(
  ar: number | null,
  w: number | null,
  h: number | null
): 'landscape' | 'portrait' | 'square' {
  const ratio = ar || (w && h ? w / h : null);
  if (!ratio) return 'landscape';
  if (Math.abs(ratio - 1) < 0.05) return 'square';
  return ratio < 1 ? 'portrait' : 'landscape';
}

async function elFetch<T>(table: string, query: string): Promise<T[]> {
  if (!EL_URL || !EL_KEY) return [];
  try {
    const res = await fetch(`${EL_URL}/rest/v1/${table}?${query}`, {
      headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      if (!isExpectedELAuthFailure(res.status, body)) {
        console.error(`[press-pack] ${table} ${res.status}: ${body.slice(0, 200)}`);
      }
      return [];
    }
    return (await res.json()) as T[];
  } catch (err) {
    console.error(`[press-pack] ${table} fetch error:`, err);
    return [];
  }
}

function cleanFilename(name: string): string {
  return name
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/^\d{8}-?/, '')        // strip leading date prefix like "20260329-"
    .replace(/^IMG_?/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── Photos ─────────────────────────────────────────────────────────────────

export async function getApprovedPhotos(limit = 30): Promise<PressPhoto[]> {
  const [assetRows, storyRows] = await Promise.all([
    elFetch<MediaAssetRow>(
      'media_assets',
      [
        `project_id=eq.${EL_PROJECT_ID}`,
        `media_type=eq.image`,
        `visibility=eq.public`,
        `select=id,original_filename,filename,caption,description,cdn_url,thumbnail_url,width,height,aspect_ratio,visibility,cultural_tags,uploaded_at,created_at,media_type`,
        `order=uploaded_at.desc.nullslast,created_at.desc`,
        `limit=${limit}`,
      ].join('&')
    ),
    elFetch<StoryRow>(
      'stories',
      [
        `project_id=eq.${EL_PROJECT_ID}`,
        `story_type=eq.gallery-photo`,
        `media_url=not.is.null`,
        `is_public=eq.true`,
        `consent_withdrawn_at=is.null`,
        `is_archived=not.eq.true`,
        `syndication_enabled=not.eq.false`,
        `select=id,title,excerpt,media_url,story_image_url,media_metadata,is_public,consent_withdrawn_at,is_archived,syndication_enabled,created_at,story_type`,
        `order=created_at.desc`,
        `limit=${limit}`,
      ].join('&')
    ),
  ]);

  const fromAssets = assetRows
    .map<PressPhoto | null>((r) => {
      const src = r.cdn_url;
      if (!src) return null;
      const caption =
        r.caption?.trim() ||
        r.description?.trim() ||
        cleanFilename(r.original_filename || r.filename || '') ||
        'Goods on Country';
      const tags = r.cultural_tags || [];
      const taggedVertical = tags.includes(PRESS_VERTICAL_TAG);
      return {
        id: r.id,
        src,
        caption,
        credit: 'Goods on Country',
        width: r.width,
        height: r.height,
        orientation: taggedVertical
          ? 'portrait'
          : orientationFromSize(r.aspect_ratio, r.width, r.height),
        createdAt: r.uploaded_at || r.created_at,
        source: 'media_assets',
        featured: tags.includes(PRESS_FEATURED_TAG),
      };
    })
    .filter((p): p is PressPhoto => p !== null);

  const fromStories = storyRows
    .map<PressPhoto | null>((r) => {
      const src = r.media_url;
      if (!src) return null;
      // Skip if URL looks like a video
      if (/\.(mp4|mov|webm|m4v)(\?|$)/i.test(src)) return null;
      const caption = r.title?.trim() || r.excerpt?.trim() || 'Goods on Country';
      return {
        id: r.id,
        src,
        caption,
        credit: 'Goods on Country',
        width: null,
        height: null,
        orientation: 'landscape',
        createdAt: r.created_at,
        source: 'stories',
        featured: false,
      };
    })
    .filter((p): p is PressPhoto => p !== null);

  const seen = new Set<string>();
  return [...fromAssets, ...fromStories]
    .filter((p) => {
      if (seen.has(p.src)) return false;
      seen.add(p.src);
      return true;
    })
    .sort((a, b) => {
      // Featured first, then by date desc.
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    })
    .slice(0, limit);
}

// ─── Videos ─────────────────────────────────────────────────────────────────

export async function getApprovedVideos(limit = 20): Promise<PressVideo[]> {
  const [assetRows, storyRows] = await Promise.all([
    elFetch<MediaAssetRow>(
      'media_assets',
      [
        `project_id=eq.${EL_PROJECT_ID}`,
        `media_type=eq.video`,
        `visibility=eq.public`,
        `select=id,original_filename,filename,caption,description,cdn_url,thumbnail_url,width,height,aspect_ratio,duration,visibility,cultural_tags,uploaded_at,created_at,media_type`,
        `order=uploaded_at.desc.nullslast,created_at.desc`,
        `limit=${limit}`,
      ].join('&')
    ),
    elFetch<StoryRow>(
      'stories',
      [
        `project_id=eq.${EL_PROJECT_ID}`,
        `media_url=not.is.null`,
        `is_public=eq.true`,
        `consent_withdrawn_at=is.null`,
        `is_archived=not.eq.true`,
        `syndication_enabled=not.eq.false`,
        `select=id,title,excerpt,media_url,story_image_url,media_metadata,is_public,consent_withdrawn_at,is_archived,syndication_enabled,created_at,story_type`,
        `order=created_at.desc`,
        `limit=${limit}`,
      ].join('&')
    ),
  ]);

  const fromAssets = assetRows
    .map<PressVideo | null>((r) => {
      const src = r.cdn_url;
      if (!src) return null;
      const base = (r.original_filename || r.filename || '').replace(
        /\.(mp4|mov|webm|m4v)$/i,
        ''
      );
      const title = r.caption?.trim() || base.replace(/[-_]+/g, ' ') || 'Goods on Country video';
      const tags = r.cultural_tags || [];
      const taggedVertical = tags.includes(PRESS_VERTICAL_TAG);
      return {
        id: r.id,
        title,
        description: r.description?.trim() || '',
        src,
        poster: r.thumbnail_url || '',
        durationSeconds: r.duration,
        orientation: taggedVertical
          ? 'portrait'
          : orientationFromSize(r.aspect_ratio, r.width, r.height),
        createdAt: r.uploaded_at || r.created_at,
        source: 'media_assets',
        featured: tags.includes(PRESS_FEATURED_TAG),
      };
    })
    .filter((v): v is PressVideo => v !== null);

  const fromStories = storyRows
    .map<PressVideo | null>((r) => {
      const src = r.media_url;
      if (!src) return null;
      // Only treat as a video if the URL looks like one OR the story_type signals it
      const looksLikeVideo = /\.(mp4|mov|webm|m4v)(\?|$)/i.test(src) ||
        (r.story_type ?? '').toLowerCase().includes('video');
      if (!looksLikeVideo) return null;
      const meta = (r.media_metadata as {
        duration_seconds?: number;
        orientation?: 'landscape' | 'portrait' | 'square';
      } | null) || null;
      return {
        id: r.id,
        title: r.title?.trim() || 'Goods on Country story',
        description: r.excerpt?.trim() || '',
        src,
        poster: r.story_image_url || '',
        durationSeconds: meta?.duration_seconds ?? null,
        orientation: meta?.orientation || 'landscape',
        createdAt: r.created_at,
        source: 'stories',
        featured: false,
      };
    })
    .filter((v): v is PressVideo => v !== null);

  // De-dup by src (same file uploaded both places). Featured first, then date desc.
  const seen = new Set<string>();
  return [...fromAssets, ...fromStories]
    .filter((v) => {
      if (seen.has(v.src)) return false;
      seen.add(v.src);
      return true;
    })
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    })
    .slice(0, limit);
}
