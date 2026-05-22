import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getStorytellerBySlug, slugify, listStorytellerSlugs } from '@/lib/storytellers';
import { empathyLedger } from '@/lib/empathy-ledger';
import { tripStories } from '@/lib/data/trip-stories';
import type { TripStory, TripBlock } from '@/lib/data/trip-stories';

/**
 * Public storyteller page. Surfaces the canonical EL profile, their
 * prose stories (from EL), and any scrollytelling field-notes they
 * appear in (from trip-stories.ts). The two storytelling shapes (prose
 * + scrollytelling) merge naturally at the storyteller level.
 *
 * Per consent rules: only renders cards/links where the voice card is
 * marked consent: 'cleared'. Public route. Indexable.
 */
interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const teller = await getStorytellerBySlug(slug);
  if (!teller) return { title: 'Storyteller not found' };
  return {
    title: `${teller.displayName} — storyteller`,
    description: teller.bio || `${teller.displayName} from ${teller.community || 'on country'}, in their own words.`,
    openGraph: {
      title: `${teller.displayName} — Goods on Country`,
      description: teller.bio || `Voices from on country.`,
      images: teller.avatarUrl ? [teller.avatarUrl] : undefined,
    },
  };
}

// Build static params for known storytellers at build time. Falls back to
// runtime resolution for any not pre-generated.
export async function generateStaticParams() {
  try {
    const slugs = await listStorytellerSlugs();
    return slugs.map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

/**
 * Find every field-notes story where this storyteller appears as a
 * cleared voice card. Returns the story + the specific quote card for
 * surfacing inline.
 */
function findFieldNotesAppearances(slug: string): Array<{
  story: TripStory;
  card: Extract<TripBlock, { kind: 'voices' }>['cards'][number];
}> {
  const results: Array<{ story: TripStory; card: Extract<TripBlock, { kind: 'voices' }>['cards'][number] }> = [];
  for (const story of tripStories) {
    if (!story.published) continue; // only public stories show as appearances
    for (const block of story.blocks) {
      if (block.kind !== 'voices') continue;
      for (const card of block.cards) {
        if (card.consent === 'cleared' && card.storytellerSlug === slug) {
          results.push({ story, card });
        }
      }
    }
  }
  return results;
}

export default async function StorytellerPage({ params }: PageProps) {
  const { slug } = await params;
  const teller = await getStorytellerBySlug(slug);
  if (!teller) notFound();

  // Try to enrich with rich profile (themes + quotes + analysis) from the
  // syndication API. Soft-fail: page still works on the lightweight shape.
  const richProfile = await empathyLedger.getStoryteller(teller.id).catch(() => null);
  const quotes = richProfile?.quotes ?? [];

  // Pull all Goods stories from EL, then filter client-side to this
  // storyteller. The EL getStories() API doesn't expose a storytellerId
  // filter today; this is fine at low volume.
  let stories: Array<{ id: string; title: string; excerpt: string | null; storyImageUrl: string | null; createdAt: string }> = [];
  try {
    const all = await empathyLedger.getStories({ limit: 200 });
    stories = (all || [])
      .filter((s) => s.storytellerId === teller.id)
      .map((s) => ({
        id: s.id,
        title: s.title || '(untitled)',
        excerpt: s.excerpt || null,
        storyImageUrl: s.storyImageUrl || null,
        createdAt: s.publishedAt || new Date().toISOString(),
      }));
  } catch {
    stories = [];
  }

  const appearances = findFieldNotesAppearances(slug);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      {/* Header */}
      <header className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-start">
        {teller.avatarUrl && (
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-2 border-amber-300 sm:h-40 sm:w-40">
            <Image
              src={teller.avatarUrl}
              alt={teller.displayName}
              fill
              className="object-cover"
              sizes="160px"
            />
          </div>
        )}
        <div>
          <p className="text-xs uppercase tracking-widest text-amber-700">Storyteller</p>
          <h1 className="mt-2 font-display text-4xl font-bold leading-tight">
            {teller.displayName}
            {teller.elderStatus && (
              <span className="ml-3 inline-block rounded-full bg-amber-100 px-2 py-0.5 align-middle text-xs font-medium text-amber-800">
                Elder
              </span>
            )}
          </h1>
          {teller.community && <p className="mt-2 text-base text-stone-600">{teller.community}</p>}
          {teller.bio && <p className="mt-4 max-w-prose text-base leading-relaxed text-stone-700">{teller.bio}</p>}
          {teller.culturalBackground && (
            <p className="mt-3 text-xs text-stone-500">{teller.culturalBackground}</p>
          )}
        </div>
      </header>

      {/* Quotes if no prose stories yet */}
      {stories.length === 0 && quotes.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-stone-500">In their words</h2>
          <div className="space-y-4">
            {quotes.slice(0, 5).map((q, i) => (
              <blockquote key={i} className="border-l-2 border-amber-400 pl-4 italic text-stone-800">
                <p className="text-lg leading-relaxed">{q.text}</p>
                {q.context && (
                  <footer className="mt-2 not-italic text-xs text-stone-500">{q.context}</footer>
                )}
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* Prose stories */}
      {stories.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-stone-500">Stories</h2>
          <ul className="space-y-3">
            {stories.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/stories/${s.id}`}
                  className="block rounded-lg border border-stone-200 bg-white p-4 transition-colors hover:border-amber-300 hover:bg-amber-50/30"
                >
                  <div className="font-display text-lg font-medium">{s.title}</div>
                  {s.excerpt && (
                    <p className="mt-1 line-clamp-2 text-sm text-stone-600">{s.excerpt}</p>
                  )}
                  <p className="mt-2 text-xs text-stone-400">
                    {new Date(s.createdAt).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Field-notes appearances (scrollytelling) */}
      {appearances.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-stone-500">
            Featured in field notes
          </h2>
          <ul className="space-y-3">
            {appearances.map(({ story, card }) => (
              <li key={`${story.slug}-${card.quote.slice(0, 20)}`}>
                <Link
                  href={`/field-notes/${story.slug}`}
                  className="block rounded-lg border border-stone-200 bg-white p-4 transition-colors hover:border-amber-300 hover:bg-amber-50/30"
                >
                  <div className="font-display text-lg font-medium">{story.title}</div>
                  <blockquote className="mt-2 border-l-2 border-amber-300 pl-3 text-sm italic text-stone-700">
                    {card.quote}
                  </blockquote>
                  <p className="mt-2 text-xs text-stone-400">{story.dateline}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Empty state */}
      {stories.length === 0 && appearances.length === 0 && quotes.length === 0 && (
        <p className="text-stone-500">
          No published stories yet. Check back as more voices are added with consent.
        </p>
      )}

      {/* Back link */}
      <footer className="mt-16 border-t pt-6 text-sm">
        <Link href="/stories" className="text-amber-700 hover:underline">
          ← Browse all storytellers
        </Link>
      </footer>
    </article>
  );
}
