// Admin: unified media library. ONE grid showing every image in the project —
// all local website images under public/images/** merged with the full Empathy
// Ledger photo library — filterable by source and by subject. Read + browse
// only (no upload/tag writes here).

import { safeImageUrl } from '@/lib/empathy-ledger/media-tier';
import { getLocalImages, getLocalVideos } from '@/lib/data/local-images';
import { createServiceClient } from '@/lib/supabase/server';
import { MediaLibraryClient, type UnifiedItem } from './library-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

async function fetchElMedia(type: 'image' | 'video'): Promise<ElPhoto[]> {
  if (!EL_API_KEY) return [];
  const out: ElPhoto[] = [];
  try {
    // The content-hub API hard-caps page size at 50, so page through until
    // hasMore=false (safety cap 20 pages / 1000 items). Previously a single
    // limit=300 call silently returned only the first 50.
    for (let page = 1; page <= 20; page += 1) {
      const url = `${EL_API}/api/v1/content-hub/media?project_code=${EL_PCODE}&type=${type}&limit=50&page=${page}`;
      const res = await fetch(url, { headers: { 'X-API-Key': EL_API_KEY }, cache: 'no-store' });
      if (!res.ok) break;
      const json = (await res.json()) as { media?: ElMediaRow[]; pagination?: { hasMore?: boolean } };
      const rows = json?.media ?? [];
      for (const m of rows) {
        if (!m.url) continue;
        // Keep the private-bucket guard for images; video urls stream via the
        // proxy/direct so the content-hub host is fine.
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

// --- unified mapping --------------------------------------------------------

function elConsent(p: ElPhoto): UnifiedItem['consent'] {
  if (p.isPublic) return 'public';
  if (p.consent && p.elderOk) return 'gated-ok';
  if (p.consent && !p.elderOk) return 'elder-pending';
  return 'flagged';
}

function elArea(p: ElPhoto): string {
  // First tag's namespace (the part before ':'), else the location, else 'el'.
  const firstTag = p.tags[0];
  if (firstTag) {
    const ns = firstTag.includes(':') ? firstTag.split(':')[1] || firstTag : firstTag;
    if (ns) return ns;
  }
  if (p.location) return p.location;
  return 'el';
}

// --- curation state (content_items index) -----------------------------------
// Resilient: before the Phase 0 migration is applied the table does not exist,
// so a failed query just yields no curation state and the "index not built"
// banner shows. The gallery still browses every image.

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

export default async function MediaLibraryPage() {
  const elMissing = !EL_API_KEY;
  const [elImages, elVideos, curation] = await Promise.all([
    fetchElMedia('image'),
    fetchElMedia('video'),
    fetchCuration(),
  ]);
  const { byRef: curationByRef, ready: curationReady, commName, personName } = curation;

  // Attach curation state + community/person names (from content_items, keyed by ref).
  const withCuration = (base: UnifiedItem, ref: string): UnifiedItem => {
    const c = curationByRef.get(ref);
    return {
      ...base,
      contentId: c?.id,
      starred: c?.starred ?? false,
      rating: c?.rating ?? 0,
      archived: !!c?.archived_at,
      canonSlot: c?.canon_slot ?? undefined,
      community: c?.community_id ? commName.get(c.community_id) : undefined,
      person: c?.storyteller_id ? personName.get(c.storyteller_id) : undefined,
      // Tags are DB-backed once indexed: content_items.tags is the live store
      // (edits go there via /api/admin/content-item). Fall back to the crawl
      // tags only for items that have no index row yet.
      tags: c ? (c.tags ?? []) : base.tags,
    };
  };

  // Route EL media through the server-side proxy (/api/admin/el-image): EL's
  // media endpoint 307-redirects and throttles direct browser bursts, so raw
  // <img> loads blank out. The proxy fetches with the API key, follows the
  // redirect, and caches. Video plays direct (a single <video> follows the
  // redirect fine and we don't want to buffer the whole file through the proxy).
  const elProxy = (u: string) => `/api/admin/el-image?url=${encodeURIComponent(u)}`;
  const elItems: UnifiedItem[] = [...elImages, ...elVideos].map((p) =>
    withCuration(
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

  const localImageItems: UnifiedItem[] = getLocalImages().map((img) =>
    withCuration(
      {
        id: `website:${img.url}`,
        src: img.url,
        full: img.url,
        mediaType: 'image',
        source: 'website',
        area: img.area,
        title: img.filename,
        // Saved subject tags drive the subject filter + search. The folder (`area`)
        // stays a separate field, so we don't duplicate it into tags here.
        tags: img.tags,
        consent: 'local',
        // Other paths where this exact image also lives (content-hash dups).
        aliases: img.aliases,
      },
      img.url,
    ),
  );

  const localVideoItems: UnifiedItem[] = getLocalVideos().map((v) =>
    withCuration(
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

  const items: UnifiedItem[] = [...localImageItems, ...localVideoItems, ...elItems];

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Media library</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every photo and video in the project — local website assets and the Empathy Ledger
          library — in one grid. Star keepers, archive junk, rate and search. Filter by source,
          subject, starred or archived.
        </p>
        {elMissing && (
          <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
            Empathy Ledger is unavailable (env var <code>EMPATHY_LEDGER_API_KEY</code> not set).
            Showing local website images only.
          </p>
        )}
      </header>
      <MediaLibraryClient items={items} curationReady={curationReady} />
    </div>
  );
}
