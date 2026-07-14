import { existsSync, readFileSync } from 'node:fs';
import Link from 'next/link';
import { DeckRenderer } from './deck-renderer';
import { getFunder } from '@/lib/funders/registry';
import { outputPath } from '@/lib/funders/generate';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const EL_PROJECT_ID = process.env.EMPATHY_LEDGER_PROJECT_ID || '';

// Back-compat path: original hand-authored Centrecorp deck location, used when
// no ?funder= is passed.
const LEGACY_DECK_PATH = 'wiki/outputs/2026-05-22-centrecorp-impact-deck.md';

export type DeckPhoto = {
  id: string;
  url: string;              // for photos = image. for videos = poster.
  videoUrl: string | null;
  isVideo: boolean;
  use: string | null;       // hero-video / testimonial / setup / overlay-bg
  bedId: string | null;
  community: string | null;
  title: string;
};

/**
 * Fetch EL photos matching ANY of the supplied tags (OR semantics) AND
 * marked is_public=true. The is_public gate keeps unreviewed / internal
 * tracking shots (QR-sticker close-ups, recipient privacy holds) out of
 * funder decks — only photos explicitly approved via /admin/photos
 * "Approve public" make it here.
 */
async function fetchTaggedPhotos(tags: string[], limit = 24): Promise<DeckPhoto[]> {
  if (!EL_URL || !EL_KEY || !EL_PROJECT_ID || tags.length === 0) return [];
  const orClauses = tags.map((t) => `tags.cs.{${t}}`).join(',');
  const url = `${EL_URL}/rest/v1/stories` +
    `?project_id=eq.${EL_PROJECT_ID}` +
    `&is_public=eq.true` +
    `&select=id,title,story_image_url,media_url,tags` +
    `&or=(${orClauses})` +
    // Either a poster image OR a direct media URL is fine — videos have both.
    `&and=(or(story_image_url.not.is.null,media_url.not.is.null))` +
    `&order=created_at.desc` +
    `&limit=${limit}`;

  const res = await fetch(url, {
    headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const stories = await res.json() as Array<{
    id: string;
    title: string | null;
    story_image_url: string | null;
    media_url: string | null;
    tags: string[] | null;
  }>;
  return stories
    .map((s) => {
      const photoTags = s.tags || [];
      const isVideo = photoTags.includes('media-type:video') ||
        (!!s.media_url && /\.(mp4|mov|m4v|webm)(\?|$)/i.test(s.media_url));
      const posterOrImage = s.story_image_url || s.media_url;
      if (!posterOrImage) return null;
      const videoUrl = isVideo ? (s.media_url || null) : null;
      const bed = photoTags.find((t) => /^gb\d+-\d+-\d+$/i.test(t)) || null;
      const community = photoTags.find((t) => /^(utopia-homelands|alice-springs|tennant-creek|community:)/.test(t)) || null;
      const use = photoTags.find((t) => t.startsWith('use:'))?.slice(4) || null;
      return {
        id: s.id,
        url: posterOrImage,
        videoUrl,
        isVideo,
        use,
        bedId: bed ? bed.toUpperCase() : null,
        community: (community || '').replace(/^community:/, '') || null,
        title: s.title || '',
      };
    })
    .filter((p): p is DeckPhoto => p !== null);
}

interface DeckPageProps {
  searchParams: Promise<{ funder?: string; period?: string }>;
}

export default async function DeckPage({ searchParams }: DeckPageProps) {
  const { funder: funderSlug, period: periodSlug } = await searchParams;

  // Resolve deck source: ?funder=&period= → wiki/outputs/funder-reports/{slug}/{period}.md
  // Otherwise fall back to the legacy hand-authored Centrecorp deck.
  let deckPath: string;
  let displayLabel: string;
  let photoTags: string[];
  if (funderSlug && periodSlug) {
    const funder = await getFunder(funderSlug);
    if (!funder) {
      return (
        <div className="p-6">
          <h1 className="text-xl font-bold">Deck</h1>
          <p className="mt-3 text-sm text-red-600">Unknown funder: <code>{funderSlug}</code></p>
          <Link href="/admin/reports" className="mt-2 inline-block text-xs text-blue-700 hover:underline">← back to /admin/reports</Link>
        </div>
      );
    }
    deckPath = outputPath(funderSlug, periodSlug);
    displayLabel = `${funder.displayName} — ${periodSlug}`;
    photoTags = funder.photoTags;
  } else {
    // Legacy back-compat — open in current working dir relative path
    deckPath = `${process.cwd()}/../${LEGACY_DECK_PATH}`;
    displayLabel = 'Centrecorp (legacy hand-authored deck)';
    photoTags = ['trip-may-2026'];
  }

  if (!existsSync(deckPath)) {
    return (
      <div className="space-y-3 p-6">
        <h1 className="text-xl font-bold">Deck</h1>
        <p className="text-sm text-red-600">
          No deck file at <code>{deckPath}</code>.
        </p>
        {funderSlug && (
          <p className="text-sm text-amber-700">
            Generate one first: <Link href="/admin/reports" className="text-blue-700 hover:underline">/admin/reports</Link> → click &ldquo;Generate {periodSlug}&rdquo; for {funderSlug}
          </p>
        )}
      </div>
    );
  }

  const markdown = readFileSync(deckPath, 'utf-8');
  const photos = await fetchTaggedPhotos(photoTags, 24);

  return (
    <div className="space-y-4 pb-16 print:pb-0">
      <div className="print:hidden flex items-center justify-between border-b pb-3">
        <div>
          <h1 className="text-lg font-bold">Deck preview — {displayLabel}</h1>
          <p className="text-xs text-gray-500">
            Source: <code>{deckPath.replace(process.cwd() + '/..', '')}</code>
            {' · '}
            Hit <kbd className="rounded border bg-white px-1 py-0.5 text-[10px]">⌘ + P</kbd> → Save as PDF
            {' · '}
            <Link href="/admin/reports" className="text-blue-700 hover:underline">/admin/reports</Link>
            {' · '}
            <Link href="/admin/media-library" className="text-blue-700 hover:underline">Curate photos</Link>
          </p>
        </div>
        <div className="text-right text-xs text-gray-500">
          <p><span className="font-bold text-emerald-700">{photos.length}</span> photos linked from EL</p>
          <p className="text-[10px]">tags: {photoTags.join(', ')}</p>
        </div>
      </div>

      <DeckRenderer markdown={markdown} photos={photos} />
    </div>
  );
}
