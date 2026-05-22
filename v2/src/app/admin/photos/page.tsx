import Link from 'next/link';
import { PhotoPicker } from './photo-picker';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const EL_PROJECT_ID = process.env.EMPATHY_LEDGER_PROJECT_ID || '';

interface ElStory {
  id: string;
  title: string | null;
  content: string | null;
  story_image_url: string | null;
  media_url: string | null;
  media_urls: string[] | null;
  tags: string[] | null;
  is_public: boolean;
  community_status: string | null;
  has_explicit_consent: boolean;
  requires_elder_review: boolean;
  elder_reviewed: boolean;
  cultural_permission_level: string | null;
  created_at: string;
  location_text: string | null;
}

export type PhotoStory = {
  id: string;
  title: string;
  content: string;
  url: string;
  tags: string[];
  isPublic: boolean;
  needsElder: boolean;
  consent: boolean;
  location: string | null;
  bedId: string | null;
  community: string | null;
  day: string | null;
  source: string | null;
  createdAt: string;
};

async function fetchPhotos(): Promise<PhotoStory[]> {
  if (!EL_URL || !EL_KEY || !EL_PROJECT_ID) return [];
  // Pull all stories for the Goods project that have an image URL (filter on
  // the server: media_url not null). The tag refinement happens client-side
  // for instant filter response.
  const url = `${EL_URL}/rest/v1/stories` +
    `?project_id=eq.${EL_PROJECT_ID}` +
    `&select=id,title,content,story_image_url,media_url,media_urls,tags,is_public,community_status,has_explicit_consent,requires_elder_review,elder_reviewed,cultural_permission_level,created_at,location_text` +
    `&or=(story_image_url.not.is.null,media_url.not.is.null)` +
    `&order=created_at.desc` +
    `&limit=500`;
  const res = await fetch(url, {
    headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
    cache: 'no-store',
  });
  if (!res.ok) {
    console.error('[admin/photos] EL fetch failed', res.status, await res.text());
    return [];
  }
  const stories: ElStory[] = await res.json();
  return stories
    .map((s) => {
      const url = s.story_image_url || s.media_url || (s.media_urls?.[0] ?? null);
      if (!url) return null;
      const tags = s.tags || [];
      const bedTag = tags.find((t) => /^gb\d+-\d+-\d+$/i.test(t));
      const dayTag = tags.find((t) => /^day-\d+$/.test(t));
      const sourceTag = tags.find((t) => /-capture$|-submitted$/.test(t));
      const communityTag = tags.find((t) => /^(utopia-homelands|alice-springs|tennant-creek|maningrida|palm-island|canberra|mt-isa|aurukun|cherbourg|borroloola)/.test(t));
      return {
        id: s.id,
        title: s.title || '(untitled)',
        content: s.content || '',
        url,
        tags,
        isPublic: s.is_public,
        needsElder: s.requires_elder_review && !s.elder_reviewed,
        consent: s.has_explicit_consent,
        location: s.location_text,
        bedId: bedTag ? bedTag.toUpperCase() : null,
        community: communityTag || null,
        day: dayTag || null,
        source: sourceTag || null,
        createdAt: s.created_at,
      } as PhotoStory;
    })
    .filter((p): p is PhotoStory => p !== null);
}

export default async function PhotosPage() {
  const photos = await fetchPhotos();

  if (!EL_URL || !EL_KEY || !EL_PROJECT_ID) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Photos</h1>
        <p className="mt-3 text-sm text-amber-700">
          Empathy Ledger env vars not configured. Set <code>EMPATHY_LEDGER_SUPABASE_URL</code>,{' '}
          <code>EMPATHY_LEDGER_SUPABASE_KEY</code>, and <code>EMPATHY_LEDGER_PROJECT_ID</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <header>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Photos</h1>
            <p className="mt-1 text-sm text-gray-500">
              All Goods photos in the Empathy Ledger Goods project — recipient-submitted +
              staff-captured trip photos. Filter by tag, click to mark as deck-hero, copy
              Markdown for the Centrecorp deck.
            </p>
          </div>
          <Link
            href="/admin/scans"
            className="shrink-0 text-xs text-blue-700 hover:underline"
          >
            /admin/scans →
          </Link>
        </div>
      </header>

      <PhotoPicker photos={photos} />
    </div>
  );
}
