// Admin: unified media library. ONE grid showing every image in the project —
// all local website images under public/images/** merged with the full Empathy
// Ledger photo library — filterable by source and by subject. Read + browse
// only (no upload/tag writes here).

import { safeImageUrl } from '@/lib/empathy-ledger/media-tier';
import { getLocalImages } from '@/lib/data/local-images';
import { MediaLibraryClient, type UnifiedItem } from './library-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const EL_PID = process.env.EMPATHY_LEDGER_PROJECT_ID || '';

// --- EL photo fetch (copied verbatim from admin/dashboard-images/page.tsx) ----

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

interface ElRow {
  id: string;
  title: string | null;
  tags: string[] | null;
  is_public: boolean;
  has_explicit_consent: boolean;
  requires_elder_review: boolean;
  elder_reviewed: boolean;
  location_text: string | null;
  story_image_url: string | null;
  media_url: string | null;
}

async function fetchElPhotos(): Promise<ElPhoto[]> {
  if (!EL_URL || !EL_KEY || !EL_PID) return [];
  const url =
    `${EL_URL}/rest/v1/stories?project_id=eq.${EL_PID}` +
    `&select=id,title,tags,is_public,has_explicit_consent,requires_elder_review,elder_reviewed,location_text,story_image_url,media_url` +
    `&or=(story_image_url.not.is.null,media_url.not.is.null)&order=created_at.desc&limit=500`;
  const res = await fetch(url, {
    headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const rows = (await res.json()) as ElRow[];
  return rows
    .map((s): ElPhoto | null => {
      const u = s.story_image_url || s.media_url;
      if (!u || /\.(mp4|mov|m4v|webm)(\?|$)/i.test(u)) return null;
      // Privacy bucket guard (shared model): drop private-bucket URLs that 400
      // publicly so the grid never shows a blank card. Public photos pass.
      if (!safeImageUrl(u)) return null;
      // Fast grid thumbnail via Supabase image transform (~6x smaller than the
      // full-res original). The full `url` is still what gets assigned to a slot.
      const thumb = u.includes('/storage/v1/object/public/story-images/')
        ? u.replace('/object/public/', '/render/image/public/') + '?width=480&quality=60&resize=cover'
        : u;
      const tags = s.tags || [];
      return {
        id: s.id,
        url: u,
        thumb,
        title: s.title || '',
        tags,
        isPublic: !!s.is_public,
        consent: !!s.has_explicit_consent,
        elderOk: !s.requires_elder_review || !!s.elder_reviewed,
        location: s.location_text || '',
      };
    })
    .filter((p): p is ElPhoto => p !== null);
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

export default async function MediaLibraryPage() {
  const elMissing = !EL_URL || !EL_KEY || !EL_PID;
  const elPhotos = await fetchElPhotos();

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

  const localItems: UnifiedItem[] = getLocalImages().map((img) => ({
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
  }));

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
            Empathy Ledger is unavailable (env vars{' '}
            <code>EMPATHY_LEDGER_SUPABASE_URL/KEY/PROJECT_ID</code> not set). Showing local website
            images only.
          </p>
        )}
      </header>
      <MediaLibraryClient items={items} />
    </div>
  );
}
