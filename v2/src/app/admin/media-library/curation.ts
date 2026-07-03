// Content system — media library data layer (server-only).
// Shared by the page (local items, rendered immediately) and the /api/admin/el-media
// route (Empathy Ledger items, fetched client-side after first paint so the page
// no longer blocks on the paged EL API). Keeps curation + community/person merge
// in one place so both surfaces stay consistent.

import 'server-only';
import { unstable_cache } from 'next/cache';
import { safeImageUrl } from '@/lib/empathy-ledger/media-tier';
import { getLocalImages, getLocalVideos } from '@/lib/data/local-images';
import { createServiceClient } from '@/lib/supabase/server';
import { themeForItem } from '@/lib/data/themes';
import type { UnifiedItem } from './library-client';

// EL content-hub API (legacy EL Supabase keys disabled org-wide 2026-06-17).
const EL_API = (process.env.EMPATHY_LEDGER_API_URL || 'https://empathy-ledger-v2.vercel.app').replace(/\/$/, '');
const EL_API_KEY = process.env.EMPATHY_LEDGER_API_KEY || '';
const EL_PCODE = process.env.EMPATHY_LEDGER_PROJECT_CODE || 'goods-on-country';

// --- EL photo fetch (content-hub media) --------------------------------------

interface ElPhoto {
  id: string;
  url: string;
  thumb: string;
  title: string;
  tags: string[];
  isPublic: boolean;
  consent: boolean;
  elderOk: boolean;
  location: string;
  mediaType: 'image' | 'video';
}

interface ElMediaRow {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  title: string | null;
  altText: string | null;
  culturalTags: string[] | null;
  consentObtained: boolean | null;
  elderApproved: boolean | null;
  mediaType?: string | null;
}

async function fetchElMediaRaw(type: 'image' | 'video'): Promise<ElPhoto[]> {
  if (!EL_API_KEY) return [];
  const out: ElPhoto[] = [];
  try {
    // The content-hub API hard-caps page size at 50, so page through until
    // hasMore=false (safety cap 20 pages / 1000 items).
    for (let page = 1; page <= 20; page += 1) {
      const url = `${EL_API}/api/v1/content-hub/media?project_code=${EL_PCODE}&type=${type}&limit=50&page=${page}`;
      const res = await fetch(url, { headers: { 'X-API-Key': EL_API_KEY }, cache: 'no-store' });
      if (!res.ok) break;
      const json = (await res.json()) as { media?: ElMediaRow[]; pagination?: { hasMore?: boolean } };
      const rows = json?.media ?? [];
      for (const m of rows) {
        if (!m.url) continue;
        if (type === 'image' && !safeImageUrl(m.url)) continue;
        out.push({
          id: m.id,
          url: m.url,
          thumb: m.thumbnailUrl || m.url,
          title: m.title || m.altText || '',
          tags: m.culturalTags || [],
          isPublic: false,
          consent: !!m.consentObtained,
          elderOk: !!m.elderApproved,
          location: '',
          mediaType: type,
        });
      }
      if (rows.length === 0 || !json?.pagination?.hasMore) break;
    }
  } catch {
    // return whatever we collected
  }
  return out;
}

// Cache the raw EL list for 5 min so repeat loads during a culling session are
// instant. Curation state is fetched separately (live) and merged on top.
const fetchElMedia = unstable_cache(
  async (type: 'image' | 'video') => fetchElMediaRaw(type),
  ['media-library-el'],
  { revalidate: 300 },
);

// --- unified mapping helpers -------------------------------------------------

function elConsent(p: ElPhoto): UnifiedItem['consent'] {
  if (p.isPublic) return 'public';
  if (p.consent && p.elderOk) return 'gated-ok';
  if (p.consent && !p.elderOk) return 'elder-pending';
  return 'flagged';
}

function elArea(p: ElPhoto): string {
  const firstTag = p.tags[0];
  if (firstTag) {
    const ns = firstTag.includes(':') ? firstTag.split(':')[1] || firstTag : firstTag;
    if (ns) return ns;
  }
  if (p.location) return p.location;
  return 'el';
}

// Route EL media through the server-side proxy: EL's media endpoint 307-redirects
// and throttles direct browser bursts, so raw <img> loads blank out.
const elProxy = (u: string) => `/api/admin/el-image?url=${encodeURIComponent(u)}`;

// --- curation state (content_items index) -----------------------------------

interface CurationRow {
  id: string;
  ref: string;
  starred: boolean;
  rating: number | null;
  archived_at: string | null;
  canon_slot: string | null;
  consent_tier: string | null;
  community_id: string | null;
  storyteller_id: string | null;
  tags: string[] | null;
}

interface Curation {
  byRef: Map<string, CurationRow>;
  ready: boolean;
  commName: Map<string, string>;
  personName: Map<string, string>;
}

async function fetchCuration(): Promise<Curation> {
  const empty: Curation = { byRef: new Map(), ready: false, commName: new Map(), personName: new Map() };
  try {
    const supabase = createServiceClient();
    const [ci, comms, sts] = await Promise.all([
      supabase.from('content_items').select('id, ref, starred, rating, archived_at, canon_slot, consent_tier, community_id, storyteller_id, tags'),
      supabase.from('communities').select('id, name'),
      supabase.from('storytellers').select('id, display_name'),
    ]);
    if (ci.error) return empty;
    const byRef = new Map<string, CurationRow>();
    for (const r of (ci.data ?? []) as CurationRow[]) byRef.set(r.ref, r);
    const commName = new Map<string, string>();
    for (const c of comms.data ?? []) commName.set(c.id as string, c.name as string);
    const personName = new Map<string, string>();
    for (const s of sts.data ?? []) personName.set(s.id as string, s.display_name as string);
    return { byRef, ready: (ci.data?.length ?? 0) > 0, commName, personName };
  } catch {
    return empty;
  }
}

function makeAttach(curation: Curation): (base: UnifiedItem, ref: string) => UnifiedItem {
  const { byRef, commName, personName } = curation;
  return (base, ref) => {
    const c = byRef.get(ref);
    const canonSlot = c?.canon_slot ?? undefined;
    // Tags are DB-backed once indexed; fall back to crawl tags only if no row.
    const tags = c ? (c.tags ?? []) : base.tags;
    return {
      ...base,
      contentId: c?.id,
      starred: c?.starred ?? false,
      rating: c?.rating ?? 0,
      archived: !!c?.archived_at,
      canonSlot,
      community: c?.community_id ? commName.get(c.community_id) : undefined,
      person: c?.storyteller_id ? personName.get(c.storyteller_id) : undefined,
      tags,
      theme: themeForItem({ area: base.area, canonSlot: canonSlot ?? null, tags }) ?? undefined,
    };
  };
}

// --- public builders --------------------------------------------------------

/** Local website images + video, curation-merged. Fast (filesystem + one query). */
export async function buildLocalItems(): Promise<{ items: UnifiedItem[]; curationReady: boolean }> {
  const curation = await fetchCuration();
  const attach = makeAttach(curation);

  const localImageItems = getLocalImages().map((img) =>
    attach(
      {
        id: `website:${img.url}`,
        src: img.url,
        full: img.url,
        mediaType: 'image',
        source: 'website',
        area: img.area,
        title: img.filename,
        tags: img.tags,
        consent: 'local',
        aliases: img.aliases,
      },
      img.url,
    ),
  );

  const localVideoItems = getLocalVideos().map((v) =>
    attach(
      {
        id: `website:${v.url}`,
        src: v.poster || v.url,
        full: v.url,
        poster: v.poster || undefined,
        mediaType: 'video',
        source: 'website',
        area: v.area,
        title: v.filename,
        tags: [],
        consent: 'local',
      },
      v.url,
    ),
  );

  return { items: [...localImageItems, ...localVideoItems], curationReady: curation.ready };
}

/** Empathy Ledger images + video, curation-merged. Slower (paged EL API) — call
 *  from the client after first paint via /api/admin/el-media. */
export async function buildElItems(): Promise<{ items: UnifiedItem[]; elMissing: boolean }> {
  if (!EL_API_KEY) return { items: [], elMissing: true };
  const curation = await fetchCuration();
  const attach = makeAttach(curation);
  const [elImages, elVideos] = await Promise.all([fetchElMedia('image'), fetchElMedia('video')]);
  const items = [...elImages, ...elVideos].map((p) =>
    attach(
      {
        id: `el:${p.id}`,
        src: elProxy(p.thumb || p.url),
        full: p.mediaType === 'video' ? p.url : elProxy(p.url),
        poster: elProxy(p.thumb || p.url),
        mediaType: p.mediaType,
        source: 'el',
        area: elArea(p),
        title: p.title || (p.mediaType === 'video' ? '(untitled EL video)' : '(untitled EL photo)'),
        tags: p.tags,
        consent: elConsent(p),
      },
      p.id,
    ),
  );
  return { items, elMissing: false };
}
