// media_links read layer. The junction records WHICH entity a media item shows;
// this resolves each row's (media_source, media_key) into a servable URL so the
// product / community / Atlas pages can render what has been tagged to them.
//
// After the 2026-07-20 align-media-keys sweep every media_key is servable:
//   local     -> /images/... or /video/... public path
//   external  -> full https URL, or a relative /api/... proxy path
//   el_media  -> Empathy Ledger media id, resolved via the EL media proxy
//   supabase  -> storage object path or full URL
//
// See wiki/canon/data-model.md for the canonical model.

import type { SupabaseClient } from '@supabase/supabase-js';

export type MediaTargetType = 'person' | 'community' | 'asset' | 'product' | 'story';

export interface ResolvedMedia {
  id: string;
  type: 'image' | 'video';
  src: string;
  poster?: string;
  caption: string;
  consent: string | null;
  targetType: MediaTargetType;
  targetKey: string;
}

const EL_MEDIA_BASE = 'https://www.empathyledger.com/api/media';

/** Resolve one media_links row to a servable URL, or null if unresolvable. */
export function resolveMediaUrl(source: string, key: string): string | null {
  if (!key) return null;
  switch (source) {
    case 'local':
      return key.startsWith('/') ? key : `/${key}`;
    case 'external':
      return key; // full https URL or app-relative /api/... proxy
    case 'el_media':
      return key.startsWith('http') ? key : `${EL_MEDIA_BASE}/${key}/file`;
    case 'supabase':
      return key.startsWith('http') ? key : key; // stored public path already
    default:
      return null;
  }
}

/** Derive a poster for a local video by the -poster.jpg convention. */
function derivePoster(type: string, src: string): string | undefined {
  if (type !== 'video') return undefined;
  if (src.startsWith('/video/')) return src.replace(/\.(mp4|webm|mov)$/i, '-poster.jpg');
  return undefined;
}

/** A readable caption from the media_key basename when no title is set. */
function captionFrom(key: string, title: string | null): string {
  if (title) return title;
  const base = key.split('/').pop() || key;
  return base
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .slice(0, 60);
}

interface MediaLinkRow {
  id: string;
  media_source: string;
  media_key: string;
  media_type: string;
  title: string | null;
  consent_status: string | null;
  target_type: string;
  target_key: string;
}

/**
 * Fetch all media tagged to one entity, resolved and ready to render.
 * `consentPublicOnly` drops anything not cleared/not_required — use it on any
 * surface that leaves the admin (deny-by-default rights, per the research on
 * TK-Label / Mukurtu consent governance).
 */
export async function getMediaLinksFor(
  supabase: SupabaseClient,
  targetType: MediaTargetType,
  targetKey: string,
  opts: { consentPublicOnly?: boolean } = {},
): Promise<ResolvedMedia[]> {
  const { data, error } = await supabase
    .from('media_links')
    .select('id, media_source, media_key, media_type, title, consent_status, target_type, target_key')
    .eq('target_type', targetType)
    .eq('target_key', targetKey);
  if (error || !data) return [];

  const out: ResolvedMedia[] = [];
  const seen = new Set<string>();
  for (const r of data as MediaLinkRow[]) {
    const src = resolveMediaUrl(r.media_source, r.media_key);
    if (!src || seen.has(src)) continue;
    if (opts.consentPublicOnly && r.consent_status && !['cleared', 'not_required'].includes(r.consent_status)) continue;
    seen.add(src);
    const type = r.media_type === 'video' ? 'video' : 'image';
    out.push({
      id: r.id,
      type,
      src,
      poster: derivePoster(type, src),
      caption: captionFrom(r.media_key, r.title),
      consent: r.consent_status,
      targetType: r.target_type as MediaTargetType,
      targetKey: r.target_key,
    });
  }
  return out;
}
