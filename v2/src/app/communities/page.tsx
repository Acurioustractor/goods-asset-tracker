import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { communityLocations } from '@/lib/data/content';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { resolveAllCommunityMedia } from '@/lib/data/community-media-resolver';
import { canonVideoSrc } from '@/lib/data/canon-videos';
import { getPublishedCommunities, getPublishedStories } from '@/lib/notion/community-os';
import { CommunityMapClient } from './map-wrapper';

export const metadata: Metadata = {
  title: 'Communities — Goods on Country',
  description: 'Every community where Goods on Country beds and washing machines are in homes.',
};

const COMMUNITY_FILM = canonVideoSrc('video-community', {
  desktop: '/video/community-desktop.mp4',
  mobile: '/video/community-mobile.mp4',
  poster: '/video/community-poster.jpg',
});

export default async function CommunitiesIndex() {
  const sorted = [...communityLocations].sort((a, b) => b.bedsDelivered - a.bedsDelivered);
  // Consent-gated: only rows explicitly cleared + published in the Notion hub.
  // Returns [] until the Community OS integration is switched on (see v2/COMMUNITY-OS.md).
  const [published, voices, mediaBySlug] = await Promise.all([
    getPublishedCommunities(),
    getPublishedStories(),
    resolveAllCommunityMedia(communityLocations.map((c) => ({ id: c.id, name: c.name }))),
  ]);

  return (
    <article className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-widest text-amber-700">Where the beds have gone</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Communities</h1>
        <p className="mt-4 max-w-prose text-base text-stone-700">
          Every community where Goods on Country beds and washing machines are in homes.
          {' '}
          <strong className="text-amber-700">{CANONICAL_ASSETS.bedsDeployed.toLocaleString()} beds</strong> across{' '}
          <strong className="text-amber-700">{CANONICAL_ASSETS.communitiesServed} communities</strong>.
        </p>
      </header>

      <section className="mb-12 overflow-hidden rounded-xl border border-stone-200 bg-card shadow-sm">
        <CommunityMapClient locations={communityLocations} />
      </section>

      {/* Cross-community film. Lives on the index (not per-community pages)
          because the footage spans several communities. */}
      <section id="film" className="mb-12">
        <h2 className="mb-1 text-sm font-medium uppercase tracking-wider text-stone-500">
          On country, on film
        </h2>
        <p className="mb-4 text-xs text-stone-400">
          Footage from delivery trips across communities, shared with consent.
        </p>
        <video
          controls
          preload="none"
          poster={COMMUNITY_FILM.poster}
          className="w-full rounded-xl border border-stone-200 shadow-sm"
        >
          <source src={COMMUNITY_FILM.desktop} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </section>

      <section id="all">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-stone-500">All communities</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {sorted.map((c) => {
            const media = mediaBySlug[c.id];
            return (
              <li key={c.id}>
                <Link
                  href={`/communities/${c.id}`}
                  className="block overflow-hidden rounded-lg border border-stone-200 bg-white transition-colors hover:border-amber-300 hover:bg-amber-50/40"
                >
                  {media.hero && (
                    <div className="relative aspect-[21/9] w-full overflow-hidden bg-stone-100">
                      <Image
                        src={media.hero.src}
                        alt={media.hero.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-lg font-medium text-stone-900">{c.name}</h3>
                      <span className="shrink-0 text-sm font-bold text-amber-700">{c.bedsDelivered} beds</span>
                    </div>
                    <p className="mt-1 text-xs text-stone-500">
                      {c.region}
                      {c.storytellerCount > 0 && (
                        <span> · {c.storytellerCount} storyteller{c.storytellerCount === 1 ? '' : 's'}</span>
                      )}
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm text-stone-600">{c.description}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {published.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-stone-500">
            Consented &amp; published from Community OS
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {published.map((c) => (
              <li key={c.id} className="rounded-lg border border-stone-200 bg-white p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-lg font-medium text-stone-900">{c.name}</h3>
                  {typeof c.bedsDeployed === 'number' && (
                    <span className="shrink-0 text-sm font-bold text-amber-700">
                      {c.bedsDeployed} beds
                    </span>
                  )}
                </div>
                {c.state && <p className="mt-1 text-xs text-stone-500">{c.state}</p>}
                {c.provesOrTests && (
                  <p className="mt-2 line-clamp-3 text-sm text-stone-600">{c.provesOrTests}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {voices.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-stone-500">
            Voices from community
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {voices.map((v) => (
              <li key={v.id} className="rounded-lg border border-stone-200 bg-white p-4">
                <h3 className="font-display text-base font-medium text-stone-900">{v.title}</h3>
                {v.storyteller && <p className="mt-1 text-xs text-stone-500">{v.storyteller}</p>}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-stone-500">Shared with consent via Empathy Ledger.</p>
        </section>
      )}

      {/* Funding pathway */}
      <section id="fund" className="mt-12 rounded-xl border border-amber-200 bg-amber-50/50 p-6 text-center sm:p-8">
        <h2 className="font-display text-2xl font-bold text-stone-900">
          Help the next community get beds
        </h2>
        <p className="mx-auto mt-2 max-w-prose text-sm text-stone-600">
          Sponsor beds directly, or partner with Goods on washing machine trials, on-country
          manufacturing and community storytelling.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
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
        </div>
      </section>
    </article>
  );
}
