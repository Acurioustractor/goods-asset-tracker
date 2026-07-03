// Admin: unified media library. ONE grid showing every image in the project —
// all local website images under public/images/** merged with the full Empathy
// Ledger photo library — filterable by source and by subject. Read + browse
// only (no upload/tag writes here).

import { safeImageUrl } from '@/lib/empathy-ledger/media-tier';
import { getLocalImages } from '@/lib/data/local-images';
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
}

async function fetchElPhotos(): Promise<ElPhoto[]> {
  if (!EL_API_KEY) return [];
  try {
    const url = `${EL_API}/api/v1/content-hub/media?project_code=${EL_PCODE}&type=image&limit=300`;
    const res = await fetch(url, { headers: { 'X-API-Key': EL_API_KEY }, cache: 'no-store' });
    if (!res.ok) return [];
    const rows = (((await res.json()) as { media?: ElMediaRow[] })?.media ?? []);
    return rows
      .map((m): ElPhoto | null => {
        if (!m.url || !safeImageUrl(m.url)) return null;
        return {
          id: m.id,
          url: m.url,
          thumb: m.thumbnailUrl || m.url,
          title: m.title || m.altText || '',
          tags: m.culturalTags || [],
          isPublic: false,
          consent: !!m.consentObtained,
          elderOk: !!m.elderApproved,
          location: '',
        };
      })
      .filter((p): p is ElPhoto => p !== null);
  } catch {
    return [];
  }
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
}

async function fetchCuration(): Promise<{ byRef: Map<string, CurationRow>; ready: boolean }> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('content_items')
      .select('id, ref, starred, rating, archived_at, canon_slot, consent_tier')
      .eq('source', 'local');
    if (error) return { byRef: new Map(), ready: false };
    const byRef = new Map<string, CurationRow>();
    for (const r of (data ?? []) as CurationRow[]) byRef.set(r.ref, r);
    return { byRef, ready: (data?.length ?? 0) > 0 };
  } catch {
    return { byRef: new Map(), ready: false };
  }
}

export default async function MediaLibraryPage() {
  const elMissing = !EL_API_KEY;
  const [elPhotos, curation] = await Promise.all([fetchElPhotos(), fetchCuration()]);
  const { byRef: curationByRef, ready: curationReady } = curation;

  const elItems: UnifiedItem[] = elPhotos.map((p) => ({
    id: `el:${p.id}`,
    src: p.thumb || p.url,
    full: p.url,
    source: 'el',
    area: elArea(p),
    title: p.title || '(untitled EL photo)',
    tags: p.tags,
    consent: elConsent(p),
  }));

  const localItems: UnifiedItem[] = getLocalImages().map((img) => {
    const c = curationByRef.get(img.url);
    return {
      id: `website:${img.url}`,
      src: img.url,
      full: img.url,
      source: 'website',
      area: img.area,
      title: img.filename,
      // Saved subject tags drive the subject filter + search. The folder (`area`)
      // stays a separate field, so we don't duplicate it into tags here.
      tags: img.tags,
      consent: 'local',
      // Other paths where this exact image also lives (content-hash dups).
      aliases: img.aliases,
      // Curation state from content_items (undefined until the index is built).
      contentId: c?.id,
      starred: c?.starred ?? false,
      rating: c?.rating ?? 0,
      archived: !!c?.archived_at,
      canonSlot: c?.canon_slot ?? undefined,
    };
  });

  const items: UnifiedItem[] = [...localItems, ...elItems];

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Media library</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every image in the project — local website assets and the Empathy Ledger photo library —
          in one browsable grid. Filter by source or subject, click any image to copy its URL or
          download it.
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
