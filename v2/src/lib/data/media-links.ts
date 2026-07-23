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

// Apex, not www — www 307-redirects to apex, so hitting apex saves a hop. The
// serve route returns assets whose media_assets.visibility='public'.
const EL_MEDIA_BASE = 'https://empathyledger.com/api/media';

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

/** A person surfaced from person media_links, with a photo they appear in. */
export interface TaggedPerson {
  /** media_links target_key for the person (storyteller id). */
  personKey: string;
  name: string;
  /** A representative image they appear in (first non-video hit). */
  photoSrc?: string;
  /** How many tagged media items they appear in (within this entity's media). */
  mediaCount: number;
}

/**
 * People tagged (person media_links) on media that is ALSO tagged to the given
 * entity (e.g. a community). This is the read-back for people the Media Room's
 * person picker records: tag someone in a photo/video that also belongs to a
 * community, and they surface on that community's page.
 */
export async function getPeopleInMediaFor(
  supabase: SupabaseClient,
  entityType: MediaTargetType,
  entityKey: string,
): Promise<TaggedPerson[]> {
  // 1. Which media items belong to this entity — keyed by source+key so a shared
  //    basename across sources can't cross-match.
  const { data: entityRows } = await supabase
    .from('media_links')
    .select('media_source, media_key')
    .eq('target_type', entityType)
    .eq('target_key', entityKey);
  if (!entityRows || entityRows.length === 0) return [];
  const entitySet = new Set(
    (entityRows as { media_source: string; media_key: string }[]).map((r) => `${r.media_source}::${r.media_key}`),
  );
  const mediaKeys = Array.from(new Set((entityRows as { media_key: string }[]).map((r) => r.media_key)));

  // 2. Person links landing on those media_keys.
  const { data: personRows } = await supabase
    .from('media_links')
    .select('media_source, media_key, media_type, target_key, title')
    .eq('target_type', 'person')
    .in('media_key', mediaKeys);
  if (!personRows) return [];

  const byPerson = new Map<string, TaggedPerson>();
  for (const r of personRows as MediaLinkRow[]) {
    if (!entitySet.has(`${r.media_source}::${r.media_key}`)) continue; // same media item both-tagged
    const cur =
      byPerson.get(r.target_key) ??
      { personKey: r.target_key, name: r.title || r.target_key, photoSrc: undefined, mediaCount: 0 };
    cur.mediaCount += 1;
    if (cur.name === cur.personKey && r.title) cur.name = r.title;
    if (!cur.photoSrc && r.media_type !== 'video') {
      const src = resolveMediaUrl(r.media_source, r.media_key);
      if (src) cur.photoSrc = src;
    }
    byPerson.set(r.target_key, cur);
  }
  return Array.from(byPerson.values()).sort((a, b) => b.mediaCount - a.mediaCount);
}

/**
 * Bulk version of getPeopleInMediaFor for a whole map surface (e.g. the Atlas):
 * one query returns every entity→people mapping, computed in memory. Avoids N
 * round-trips when rendering people-in-media for every community at once.
 */
export async function getPeopleInMediaByEntity(
  supabase: SupabaseClient,
  entityType: MediaTargetType,
): Promise<Map<string, TaggedPerson[]>> {
  const result = new Map<string, TaggedPerson[]>();
  const { data: rows } = await supabase
    .from('media_links')
    .select('media_source, media_key, media_type, target_type, target_key, title')
    .in('target_type', [entityType, 'person']);
  if (!rows) return result;

  // Group both tag kinds by the media item (source+key).
  const entityByKey = new Map<string, string[]>();
  const personByKey = new Map<string, MediaLinkRow[]>();
  for (const r of rows as MediaLinkRow[]) {
    const k = `${r.media_source}::${r.media_key}`;
    if (r.target_type === entityType) {
      const arr = entityByKey.get(k) ?? [];
      arr.push(r.target_key);
      entityByKey.set(k, arr);
    } else if (r.target_type === 'person') {
      const arr = personByKey.get(k) ?? [];
      arr.push(r);
      personByKey.set(k, arr);
    }
  }

  // For each media item tagged to both an entity and people, attribute the
  // people to that entity.
  const acc = new Map<string, Map<string, TaggedPerson>>();
  for (const [k, entityKeys] of entityByKey) {
    const persons = personByKey.get(k);
    if (!persons) continue;
    for (const ek of entityKeys) {
      const pmap = acc.get(ek) ?? new Map<string, TaggedPerson>();
      for (const pr of persons) {
        const cur =
          pmap.get(pr.target_key) ??
          { personKey: pr.target_key, name: pr.title || pr.target_key, photoSrc: undefined, mediaCount: 0 };
        cur.mediaCount += 1;
        if (cur.name === cur.personKey && pr.title) cur.name = pr.title;
        if (!cur.photoSrc && pr.media_type !== 'video') {
          const src = resolveMediaUrl(pr.media_source, pr.media_key);
          if (src) cur.photoSrc = src;
        }
        pmap.set(pr.target_key, cur);
      }
      acc.set(ek, pmap);
    }
  }
  for (const [ek, pmap] of acc) {
    result.set(ek, Array.from(pmap.values()).sort((a, b) => b.mediaCount - a.mediaCount));
  }
  return result;
}
