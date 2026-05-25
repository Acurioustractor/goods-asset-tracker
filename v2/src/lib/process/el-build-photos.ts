// Server-side fetch for "young people building" photos from Empathy Ledger.
// Used by /process step 5 (Assemble) so the supporting gallery shows the
// real Alice Springs build session (May 2026) instead of older Basket Bed
// photography. Mirrors the tag-query pattern from
// `v2/src/lib/field-notes/resolve-gallery.ts` but kept small + local
// because /process only needs one query.

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const EL_PROJECT_ID =
  process.env.EMPATHY_LEDGER_PROJECT_ID || '6bd47c8a-e676-456f-aa25-ddcbb5a31047';

export interface ElBuildPhoto {
  id: string;
  src: string;
  alt: string;
}

function quoteTagList(tags: string[]): string {
  return tags.map((t) => `"${t}"`).join(',');
}

interface ElStoryRow {
  id: string;
  title: string | null;
  media_url: string | null;
  story_image_url: string | null;
  is_public: boolean;
}

export async function fetchBuildPhotos(
  tags: string[],
  limit: number
): Promise<ElBuildPhoto[]> {
  if (!EL_URL || !EL_KEY) return [];
  const params = [
    `project_id=eq.${EL_PROJECT_ID}`,
    `story_type=eq.gallery-photo`,
    `is_public=eq.true`,
    `tags=cs.{${quoteTagList(tags)}}`,
    `select=id,title,media_url,story_image_url,is_public`,
    `order=created_at.asc`,
    `limit=${limit}`,
  ];
  try {
    const res = await fetch(`${EL_URL}/rest/v1/stories?${params.join('&')}`, {
      headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
      // Cache for one hour; new approved photos still arrive on the next
      // ISR cycle without hammering EL on every visit.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const rows: ElStoryRow[] = await res.json();
    return rows
      .map((r) => ({
        id: r.id,
        src: (r.story_image_url || r.media_url || '').trim(),
        alt: r.title || 'Goods on Country: young people building a Stretch Bed',
      }))
      .filter((r) => r.src);
  } catch {
    return [];
  }
}
