import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import Link from 'next/link';
import { DeckRenderer } from './deck-renderer';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Source markdown for the Centrecorp deck. Edited via your editor on
// wiki/outputs/2026-05-22-centrecorp-impact-deck.md — this page renders
// it live + print-ready.
const DECK_PATH = join(process.cwd(), '..', 'wiki', 'outputs', '2026-05-22-centrecorp-impact-deck.md');

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const EL_PROJECT_ID = process.env.EMPATHY_LEDGER_PROJECT_ID || '';

export type DeckPhoto = {
  id: string;
  url: string;
  bedId: string | null;
  community: string | null;
  title: string;
};

// Replace [PHOTO: ...] placeholders with real EL photos in tag order. The
// renderer slots them in deterministically — same input → same output, so
// the printed deck is stable.
async function fetchTaggedPhotos(tag: string, limit = 12): Promise<DeckPhoto[]> {
  if (!EL_URL || !EL_KEY || !EL_PROJECT_ID) return [];
  const url = `${EL_URL}/rest/v1/stories` +
    `?project_id=eq.${EL_PROJECT_ID}` +
    `&select=id,title,story_image_url,media_url,tags` +
    `&tags=cs.{${tag}}` +
    `&or=(story_image_url.not.is.null,media_url.not.is.null)` +
    // Decoded-bed photos first (more useful for the deck), then no-QR scene
    // shots. Order by created_at desc so newest trips bubble up over time.
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
      const url = s.story_image_url || s.media_url;
      if (!url) return null;
      const tags = s.tags || [];
      const bed = tags.find((t) => /^gb\d+-\d+-\d+$/i.test(t)) || null;
      const community = tags.find((t) => /^(utopia-homelands|alice-springs|tennant-creek)/.test(t)) || null;
      return { id: s.id, url, bedId: bed ? bed.toUpperCase() : null, community, title: s.title || '' };
    })
    .filter((p): p is DeckPhoto => p !== null);
}

export default async function DeckPage() {
  let markdown: string;
  try {
    markdown = readFileSync(DECK_PATH, 'utf-8');
  } catch (e) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Deck</h1>
        <p className="mt-3 text-sm text-red-600">
          Couldn&apos;t read deck file: <code>{DECK_PATH}</code>
        </p>
        <p className="mt-2 text-xs text-gray-500">{(e as Error).message}</p>
      </div>
    );
  }

  // Pre-fetch the photo set for the Utopia trip. Renderer pours these into
  // the [PHOTO: ...] placeholders in order.
  const photos = await fetchTaggedPhotos('trip-may-2026', 12);

  return (
    <div className="space-y-4 pb-16 print:pb-0">
      <div className="print:hidden flex items-center justify-between border-b pb-3">
        <div>
          <h1 className="text-lg font-bold">Deck preview — Centrecorp impact report</h1>
          <p className="text-xs text-gray-500">
            Source: <code>wiki/outputs/2026-05-22-centrecorp-impact-deck.md</code>
            {' · '}
            Hit <kbd className="rounded border bg-white px-1 py-0.5 text-[10px]">⌘ + P</kbd> → Save as PDF
            {' · '}
            <Link href="/admin/photos" className="text-blue-700 hover:underline">Curate photos in /admin/photos</Link>
          </p>
        </div>
        <div className="text-right text-xs text-gray-500">
          <p><span className="font-bold text-emerald-700">{photos.length}</span> photos linked from EL</p>
        </div>
      </div>

      <DeckRenderer markdown={markdown} photos={photos} />
    </div>
  );
}
