import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { communityLocations } from '@/lib/data/content';
import { tripStories } from '@/lib/data/trip-stories';
import type { TripStory } from '@/lib/data/trip-stories';
import { CommunityMapClient } from '../map-wrapper';

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const EL_PROJECT_ID = process.env.EMPATHY_LEDGER_PROJECT_ID || '';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const community = communityLocations.find((c) => c.id === slug);
  if (!community) return { title: 'Community not found' };
  return {
    title: `${community.name} — Goods on Country`,
    description: community.description,
  };
}

export function generateStaticParams() {
  return communityLocations.map((c) => ({ slug: c.id }));
}

/**
 * Find trip stories that focus on this community. Naive but useful: match
 * by community name appearing in the dateline, OR by any voices block
 * with a card from this community.
 */
function findFieldNotesForCommunity(community: { name: string }): TripStory[] {
  const lower = community.name.toLowerCase();
  return tripStories.filter((s) => {
    if (!s.published) return false;
    if (s.dateline.toLowerCase().includes(lower)) return true;
    if (s.title.toLowerCase().includes(lower)) return true;
    for (const block of s.blocks) {
      if (block.kind === 'voices') {
        for (const card of block.cards) {
          if (card.community?.toLowerCase() === lower && card.consent === 'cleared') return true;
        }
      }
    }
    return false;
  });
}

/**
 * EL public stories tagged for this community. Pulls
 * `tags @> {community:<slug>}` plus is_public=true.
 */
interface ElCommunityContent {
  stories: Array<{ id: string; title: string; excerpt: string | null; imageUrl: string | null; isVideo: boolean }>;
}

async function fetchElCommunityContent(slug: string): Promise<ElCommunityContent> {
  if (!EL_URL || !EL_KEY || !EL_PROJECT_ID) return { stories: [] };
  const url = `${EL_URL}/rest/v1/stories` +
    `?project_id=eq.${EL_PROJECT_ID}` +
    `&is_public=eq.true` +
    `&tags=cs.%7Bcommunity%3A${slug}%7D` +
    `&select=id,title,excerpt,story_image_url,media_url,tags` +
    `&order=created_at.desc&limit=30`;
  try {
    const res = await fetch(url, {
      headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
      cache: 'no-store',
    });
    if (!res.ok) return { stories: [] };
    const rows = (await res.json()) as Array<{
      id: string;
      title: string | null;
      excerpt: string | null;
      story_image_url: string | null;
      media_url: string | null;
      tags: string[] | null;
    }>;
    const stories = rows.map((r) => ({
      id: r.id,
      title: r.title || '(untitled)',
      excerpt: r.excerpt,
      imageUrl: r.story_image_url || r.media_url,
      isVideo: (r.tags || []).includes('media-type:video'),
    }));
    return { stories };
  } catch {
    return { stories: [] };
  }
}

export default async function CommunityPage({ params }: PageProps) {
  const { slug } = await params;
  const community = communityLocations.find((c) => c.id === slug);
  if (!community) notFound();

  const fieldNotes = findFieldNotesForCommunity(community);
  const { stories: elStories } = await fetchElCommunityContent(slug);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      {/* Header */}
      <header className="mb-10">
        <p className="text-xs uppercase tracking-widest text-amber-700">
          <Link href="/communities" className="hover:underline">Communities</Link>
          {' · '}
          {community.region}
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">{community.name}</h1>
        <p className="mt-4 max-w-prose text-base leading-relaxed text-stone-700">{community.description}</p>
        {community.highlight && (
          <p className="mt-3 max-w-prose border-l-2 border-amber-400 pl-3 text-sm italic text-stone-600">
            {community.highlight}
          </p>
        )}
        <div className="mt-6 flex flex-wrap items-baseline gap-4 text-sm">
          <span className="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-900">
            {community.bedsDelivered.toLocaleString()} beds delivered
          </span>
          {community.storytellerCount > 0 && (
            <span className="rounded-full bg-stone-100 px-3 py-1 text-stone-700">
              {community.storytellerCount} storyteller{community.storytellerCount === 1 ? '' : 's'}
            </span>
          )}
        </div>
      </header>

      {/* Map (single-pin focus) */}
      <section className="mb-10 overflow-hidden rounded-xl border border-stone-200 bg-card shadow-sm">
        <CommunityMapClient locations={[community]} />
      </section>

      {/* Field notes */}
      {fieldNotes.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-stone-500">Field notes</h2>
          <ul className="space-y-3">
            {fieldNotes.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/field-notes/${s.slug}`}
                  className="block rounded-lg border border-stone-200 bg-white p-4 transition-colors hover:border-amber-300 hover:bg-amber-50/40"
                >
                  <div className="font-display text-lg font-medium">{s.title}</div>
                  <p className="mt-1 text-sm text-stone-600">{s.summary}</p>
                  <p className="mt-2 text-xs text-stone-400">{s.dateline}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* EL stories (prose + media) tagged for this community */}
      {elStories.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-stone-500">Stories + media</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {elStories.map((s) => (
              <li key={s.id}>
                <Link
                  href={`/stories/${s.id}`}
                  className="block overflow-hidden rounded-lg border border-stone-200 bg-white transition-colors hover:border-amber-300"
                >
                  {s.imageUrl && (
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.imageUrl} alt={s.title} className="h-full w-full object-cover" loading="lazy" />
                      {s.isVideo && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                          </span>
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-3">
                    <div className="text-sm font-medium leading-snug">{s.title}</div>
                    {s.excerpt && <p className="mt-1 line-clamp-2 text-xs text-stone-600">{s.excerpt}</p>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Empty state when no content yet */}
      {fieldNotes.length === 0 && elStories.length === 0 && (
        <section className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-600">
          <p>
            More stories from {community.name} will appear here as they&apos;re shared. In the meantime,
            see the wider story across all{' '}
            <Link href="/communities" className="text-amber-700 hover:underline">communities</Link>.
          </p>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-16 border-t pt-6 text-sm">
        <Link href="/communities" className="text-amber-700 hover:underline">
          ← All communities
        </Link>
      </footer>
    </article>
  );
}
