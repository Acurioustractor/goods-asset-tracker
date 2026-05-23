import Link from 'next/link';
import { tripStories } from '@/lib/data/trip-stories';

/**
 * Homepage promo for the most recent published field-notes story.
 * Returns null when nothing is published yet, so the homepage doesn't
 * grow an empty section while the consent gate is still in flight.
 */
export function FieldNotesTile() {
  // Most recent published story by `dateline`. Dateline isn't strictly
  // sortable, so fall back to array order (newest stories typically added
  // to the end of tripStories, but the renderer can shuffle if needed).
  const published = tripStories.filter((s) => s.published);
  if (published.length === 0) return null;
  const latest = published[published.length - 1];

  // Find the masthead block to source the hero image
  const masthead = latest.blocks.find((b) => b.kind === 'masthead');
  const heroImage = masthead && 'media' in masthead ? masthead.media.image : null;

  return (
    <section className="bg-stone-900 py-16 text-amber-50 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {heroImage && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-800 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={heroImage}
                alt={latest.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div>
            <p className="text-xs uppercase tracking-widest text-amber-300">Field notes</p>
            <h2
              className="mt-3 text-3xl font-bold leading-tight md:text-4xl"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              {latest.title}
            </h2>
            <p className="mt-3 text-sm text-amber-100/70">{latest.dateline}</p>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-amber-50/90">
              {latest.summary}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/field-notes/${latest.slug}`}
                className="inline-flex items-center gap-2 rounded-md bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-500"
              >
                Read the story →
              </Link>
              <Link
                href="/field-notes"
                className="inline-flex items-center gap-2 rounded-md border border-amber-300 px-5 py-2.5 text-sm font-medium text-amber-100 hover:bg-amber-900/30"
              >
                All field notes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
