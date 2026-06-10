// Admin: assign Empathy Ledger photos to partner-dashboard image slots.
// Lists every image slot on a partner dashboard with its current image, and
// lets a human pick a consent-cleared EL photo for any slot. Writes via
// /api/admin/dashboard-image -> data/partner-dashboard-images.json.

import { getPartnerDashboard, PARTNER_DASHBOARDS } from '@/lib/data/partner-dashboards';
import { getDashboardImageOverrides, getDashboardImageSlots } from '@/lib/data/partner-dashboard-images';
import { safeImageUrl } from '@/lib/empathy-ledger/media-tier';
import { DashboardImagePicker, type ElPhoto } from './picker';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const EL_PID = process.env.EMPATHY_LEDGER_PROJECT_ID || '';

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

export default async function DashboardImagesPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const slug = (await searchParams)?.slug || PARTNER_DASHBOARDS[0]?.slug || 'snow';
  const partner = getPartnerDashboard(slug);

  if (!partner) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Dashboard images</h1>
        <p className="mt-2 text-sm text-gray-600">
          No partner dashboard for slug <code>{slug}</code>. Available:{' '}
          {PARTNER_DASHBOARDS.map((p) => p.slug).join(', ')}.
        </p>
      </div>
    );
  }

  const photos = await fetchElPhotos();

  if (!EL_URL || !EL_KEY || !EL_PID) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Dashboard images</h1>
        <p className="mt-3 text-sm text-amber-700">
          Empathy Ledger env vars not set (<code>EMPATHY_LEDGER_SUPABASE_URL/KEY/PROJECT_ID</code>). The
          picker needs them to list the photo library.
        </p>
      </div>
    );
  }

  return (
    <DashboardImagePicker
      slug={slug}
      partnerName={partner.partnerName}
      slots={getDashboardImageSlots(partner)}
      overrides={getDashboardImageOverrides(slug)}
      photos={photos}
    />
  );
}
