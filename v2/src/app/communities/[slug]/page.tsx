import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { communityLocations, communityPartnerships } from '@/lib/data/content';
import { tripStories } from '@/lib/data/trip-stories';
import type { TripStory } from '@/lib/data/trip-stories';
import { PLASTIC_KG_PER_BED } from '@/lib/data/products';
import { communityMedia } from '@/lib/data/community-media';
import { resolveCommunityMedia } from '@/lib/data/community-media-resolver';
import { communityFunding } from '@/lib/data/community-funding';
import { getCommunityVoices } from '@/lib/data/community-stories';
import { isClearedForExternal } from '@/lib/data/cleared-voices';
import { getGoodsStorytellers, slugify } from '@/lib/storytellers';
import { makeCommunityMatcher } from '@/lib/data/community-match';
import type { EmpathyLedgerStoryteller } from '@/lib/empathy-ledger/types';
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
  const media = communityMedia(slug);
  return {
    title: `${community.name} — Goods on Country`,
    description: community.description,
    openGraph: {
      title: `${community.name} — Goods on Country`,
      description: community.description,
      images: media.hero ? [media.hero.src] : undefined,
    },
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

/**
 * Cleared EL storytellers whose free-text location resolves to this community.
 * Default-deny: a storyteller renders only if their name passes the
 * cleared-voices allowlist AND their location matches.
 */
async function fetchCommunityStorytellers(slug: string): Promise<EmpathyLedgerStoryteller[]> {
  const tellers = await getGoodsStorytellers(); // soft-fails to []
  const matcher = makeCommunityMatcher(
    communityLocations.map((c) => ({ id: c.id, name: c.name })),
  );
  return tellers.filter(
    (t) => isClearedForExternal(t.displayName) && matcher.matchLocation(t.community) === slug,
  );
}

/** Local portrait for a storyteller if one ships in public/images/people/. */
function localPortrait(name: string): string | null {
  const slug = slugify(name);
  for (const ext of ['jpg', 'png', 'jpeg', 'webp']) {
    const rel = `/images/people/${slug}.${ext}`;
    if (existsSync(join(process.cwd(), 'public', rel))) return rel;
  }
  return null;
}

export default async function CommunityPage({ params }: PageProps) {
  const { slug } = await params;
  const community = communityLocations.find((c) => c.id === slug);
  if (!community) notFound();

  const partnership = communityPartnerships.find((p) => p.id === slug);
  const funding = communityFunding(slug, community.name);

  // Media, EL stories and storytellers resolve in parallel. Media comes from
  // the consent-gated content_items library (community_id + consent_tier
  // 'public'), falling back to the hand-verified static map.
  const [media, { stories: elStories }, storytellers] = await Promise.all([
    resolveCommunityMedia(slug, community.name),
    fetchElCommunityContent(slug),
    fetchCommunityStorytellers(slug),
  ]);

  const fieldNotes = findFieldNotesForCommunity(community);
  // Quotes from the compendium, consent-gated the same way as everywhere else.
  const voices = getCommunityVoices({ name: community.name, aliases: [] }).filter((v) =>
    isClearedForExternal(v.name),
  );

  const storytellerCount = storytellers.length > 0 ? storytellers.length : community.storytellerCount;
  const plasticKg = community.bedsDelivered * PLASTIC_KG_PER_BED;

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      {/* Header */}
      <header className="mb-8">
        <p className="text-xs uppercase tracking-widest text-amber-700">
          <Link href="/communities" className="hover:underline">Communities</Link>
          {' · '}
          {community.region}
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">{community.name}</h1>
        {partnership?.headline && (
          <p className="mt-2 font-display text-lg text-stone-500">{partnership.headline}</p>
        )}
      </header>

      {/* Hero image — only when we have a photo actually taken in this community */}
      {media.hero && (
        <section className="mb-8 overflow-hidden rounded-xl border border-stone-200 shadow-sm">
          <div className="relative aspect-[21/9] w-full bg-stone-100">
            <Image
              src={media.hero.src}
              alt={media.hero.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        </section>
      )}

      {/* Stats band */}
      <section className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label="Community impact">
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <div className="font-display text-3xl font-bold text-amber-700">
            {community.bedsDelivered.toLocaleString()}
          </div>
          <div className="mt-1 text-xs uppercase tracking-wider text-stone-500">Beds delivered</div>
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-4">
          <div className="font-display text-3xl font-bold text-amber-700">
            {plasticKg.toLocaleString()}kg
          </div>
          <div className="mt-1 text-xs uppercase tracking-wider text-stone-500">
            Plastic diverted
            <span className="block normal-case tracking-normal text-stone-400">
              modelled at {PLASTIC_KG_PER_BED}kg per bed
            </span>
          </div>
        </div>
        {storytellerCount > 0 && (
          <div className="rounded-lg border border-stone-200 bg-white p-4">
            <div className="font-display text-3xl font-bold text-amber-700">{storytellerCount}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-stone-500">
              Storyteller{storytellerCount === 1 ? '' : 's'}
            </div>
          </div>
        )}
      </section>

      {/* About */}
      <section className="mb-10 max-w-prose">
        <p className="text-base leading-relaxed text-stone-700">
          {partnership?.description ?? community.description}
        </p>
        {community.highlight && (
          <p className="mt-3 border-l-2 border-amber-400 pl-3 text-sm italic text-stone-600">
            {community.highlight}
          </p>
        )}
        {partnership?.keyPeople && partnership.keyPeople.length > 0 && (
          <p className="mt-3 text-sm text-stone-500">
            Key people: {partnership.keyPeople.join(', ')}
          </p>
        )}
      </section>

      {/* Community film — only media attributed to this community with public
          consent (content_items) or verified by hand (community-media.ts) */}
      {media.videos.length > 0 && (
        <section id="film" className="mb-10">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-stone-500">
            {media.videos[0].title}
          </h2>
          <video
            controls
            preload="none"
            poster={media.videos[0].poster ?? undefined}
            className="w-full rounded-xl border border-stone-200 shadow-sm"
          >
            <source src={media.videos[0].src} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </section>
      )}

      {/* Map (single-pin focus) */}
      <section className="mb-10 overflow-hidden rounded-xl border border-stone-200 bg-card shadow-sm">
        <CommunityMapClient locations={[community]} />
      </section>

      {/* Storytellers — cleared voices from this community */}
      {storytellers.length > 0 && (
        <section id="storytellers" className="mb-10">
          <h2 className="mb-1 text-sm font-medium uppercase tracking-wider text-stone-500">
            Storytellers from {community.name}
          </h2>
          <p className="mb-4 text-xs text-stone-400">Shared with consent via Empathy Ledger.</p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {storytellers.map((t) => {
              const portrait = localPortrait(t.displayName);
              const tellerSlug = slugify(t.displayName);
              return (
                <li key={t.id}>
                  <Link
                    href={`/storytellers/${tellerSlug}`}
                    className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white p-3 transition-colors hover:border-amber-300 hover:bg-amber-50/40"
                  >
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-amber-100">
                      {portrait ? (
                        <Image src={portrait} alt={t.displayName} fill sizes="48px" className="object-cover" />
                      ) : t.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.avatarUrl} alt={t.displayName} loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center font-display text-lg text-amber-800">
                          {t.displayName.charAt(0)}
                        </span>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-stone-900">
                        {t.displayName}
                        {t.elderStatus && (
                          <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-800">
                            Elder
                          </span>
                        )}
                      </span>
                      {t.storyCount > 0 && (
                        <span className="block text-xs text-stone-500">
                          {t.storyCount} {t.storyCount === 1 ? 'story' : 'stories'} shared
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Voices — cleared quotes from the compendium */}
      {voices.length > 0 && (
        <section id="voices" className="mb-10">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-stone-500">
            In their words
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {voices.slice(0, 4).map((v) => (
              <li key={v.id} className="rounded-lg border border-stone-200 bg-white p-4">
                <blockquote className="text-sm leading-relaxed text-stone-700">
                  &ldquo;{v.quotes[0]}&rdquo;
                </blockquote>
                <p className="mt-2 text-xs font-medium text-stone-500">
                  {v.name}
                  {v.role ? ` · ${v.role}` : ''}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Photo gallery — only images taken in this community */}
      {media.gallery.length > 0 && (
        <section id="photos" className="mb-10">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-stone-500">Photos</h2>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {media.gallery.slice(0, 9).map((img) => (
              <li key={img.src} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-100">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </li>
            ))}
          </ul>
        </section>
      )}

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
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
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

      {/* Empty state when no story content yet */}
      {fieldNotes.length === 0 && elStories.length === 0 && storytellers.length === 0 && voices.length === 0 && (
        <section className="mb-10 rounded-lg border border-dashed border-stone-300 bg-stone-50 p-6 text-center text-sm text-stone-600">
          <p>
            More stories from {community.name} will appear here as they&apos;re shared — always with
            consent. In the meantime, see the wider story across all{' '}
            <Link href="/communities" className="text-amber-700 hover:underline">communities</Link>.
          </p>
        </section>
      )}

      {/* Funding — what's next here, and who already backs it */}
      <section id="fund" className="mb-4 rounded-xl border border-amber-200 bg-amber-50/50 p-6 sm:p-8">
        <h2 className="font-display text-2xl font-bold text-stone-900">
          Fund what&apos;s next in {community.name}
        </h2>
        <p className="mt-2 max-w-prose text-sm text-stone-600">
          Goods on Country works on long-term partnerships, not one-off charity. Here&apos;s where
          support goes furthest in this community right now.
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {funding.needs.map((n) => (
            <li key={n.title} className="flex flex-col rounded-lg border border-amber-200 bg-white p-4">
              <h3 className="font-display text-lg font-medium text-stone-900">{n.title}</h3>
              <p className="mt-1 flex-1 text-sm text-stone-600">{n.detail}</p>
              <Link
                href={n.href}
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-amber-700 hover:underline"
              >
                {n.cta} <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>

        {(funding.backedBy.length > 0 || funding.communityPartners.length > 0) && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {funding.backedBy.length > 0 && (
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-stone-500">
                  Already backing this work
                </h3>
                <ul className="mt-2 space-y-2">
                  {funding.backedBy.map((b) => (
                    <li key={b.name} className="text-sm text-stone-700">
                      {b.href ? (
                        <Link href={b.href} className="font-medium text-amber-700 hover:underline">
                          {b.name}
                        </Link>
                      ) : (
                        <span className="font-medium">{b.name}</span>
                      )}
                      {' — '}
                      {b.detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {funding.communityPartners.length > 0 && (
              <div>
                <h3 className="text-xs font-medium uppercase tracking-wider text-stone-500">
                  Community partners
                </h3>
                <ul className="mt-2 space-y-2">
                  {funding.communityPartners.map((b) => (
                    <li key={b.name} className="text-sm text-stone-700">
                      {b.href ? (
                        <Link href={b.href} className="font-medium text-amber-700 hover:underline">
                          {b.name}
                        </Link>
                      ) : (
                        <span className="font-medium">{b.name}</span>
                      )}
                      {' — '}
                      {b.detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/sponsor"
            className="rounded-full bg-amber-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-800"
          >
            Sponsor beds
          </Link>
          <Link
            href="/partner"
            className="rounded-full border border-amber-700 px-5 py-2.5 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-100"
          >
            Become a partner
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100"
          >
            Talk to us
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t pt-6 text-sm">
        <Link href="/communities" className="text-amber-700 hover:underline">
          ← All communities
        </Link>
      </footer>
    </article>
  );
}
