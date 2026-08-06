import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { communityLocations } from '@/lib/data/content';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { COMMUNITY_BED_CANON } from '@/lib/data/community-canonical';
import { communityRecord, isPublishable } from '@/lib/data/community-record';
import { canonVideoSrc } from '@/lib/data/canon-videos';
import { getPublishedCommunities, getPublishedStories } from '@/lib/notion/community-os';
import { tripStories } from '@/lib/data/trip-stories';
import { CommunityMapClient } from './map-wrapper';

/**
 * One curated photograph per community, chosen by hand rather than taken from the
 * library's sort order (which put whatever ranked first — often a build shot —
 * on every card). All files ship in /public already, i.e. the same consent
 * clearance class as the [slug] page galleries that surface them today.
 * A community without a row renders as a text card, never a stock image.
 */
const CARD_PHOTOS: Record<string, { src: string; alt: string }> = {
  utopia: { src: '/images/utopia/utopia-01.jpg', alt: 'Bed delivery across the Utopia homelands' },
  'tennant-creek': { src: '/images/community/tennant-creek.jpg', alt: 'Tennant Creek delivery' },
  'palm-island': { src: '/images/community/palm-island/family-dogs-new-bed.jpg', alt: 'A family with their new bed on Palm Island' },
  maningrida: { src: '/images/community/maningrida/kids-carrying-orange-bed.jpg', alt: 'Kids carrying a Stretch Bed in Maningrida' },
  kalgoorlie: { src: '/images/community/kalgoorlie/man-new-mattress.jpg', alt: 'A new mattress at Ninga Mia, Kalgoorlie' },
  'alice-springs': { src: '/images/community/alice-springs/oonchiumpa-team-red-bed.jpg', alt: 'The Oonchiumpa team with a red Stretch Bed, Alice Springs' },
  darwin: { src: '/images/community/darwin/deadly-heart-first-lie-down.jpg', alt: 'First lie-down on a new bed, Darwin' },
};

/** /communities/[slug] runs on communityLocations ids; the register runs on canon ids.
 *  The only divergent pair is Utopia. */
const PAGE_SLUG_FOR_ID: Record<string, string> = { utopia: 'utopia-homelands' };
const PAGE_SLUG_FOR_ID_REVERSE: Record<string, string> = { 'utopia-homelands': 'utopia' };
const PAGE_IDS = new Set(
  communityLocations.map((c) => PAGE_SLUG_FOR_ID_REVERSE[c.id] ?? c.id),
);

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
  // Every community in the register, largest first — not just the four with their own
  // pages. The old grid showed 4 cards under a headline claiming 11 communities.
  const records = COMMUNITY_BED_CANON
    .map((c) => ({ canon: c, record: communityRecord(c.id) }))
    .sort((a, b) => (b.canon.basketBeds + b.canon.stretchBeds) - (a.canon.basketBeds + a.canon.stretchBeds));
  const descriptionById = new Map(
    communityLocations.map((c) => [PAGE_SLUG_FOR_ID_REVERSE[c.id] ?? c.id, c.description]),
  );
  const fieldNotes = tripStories.filter((s) => s.published);
  // Consent-gated: only rows explicitly cleared + published in the Notion hub.
  // Returns [] until the Community OS integration is switched on (see v2/COMMUNITY-OS.md).
  const [published, voices] = await Promise.all([
    getPublishedCommunities(),
    getPublishedStories(),
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
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {records.map(({ canon, record }) => {
            const photo = CARD_PHOTOS[canon.id];
            const hasPage = PAGE_IDS.has(canon.id);
            const href = hasPage
              ? `/communities/${PAGE_SLUG_FOR_ID[canon.id] ?? canon.id}`
              : undefined;
            const beds = canon.basketBeds + canon.stretchBeds;
            const washers =
              record?.assets && isPublishable(record.assets) ? record.assets.value.washers : 0;
            const stage =
              record?.stage && isPublishable(record.stage) ? record.stage.value.label : null;
            const description = descriptionById.get(canon.id);
            const card = (
              <>
                {photo && (
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-lg font-medium text-stone-900">
                      {canon.registerName}
                    </h3>
                    <span className="shrink-0 text-sm font-bold text-amber-700">
                      {beds} bed{beds === 1 ? '' : 's'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-stone-500">
                    {canon.stretchBeds > 0 && <span>{canon.stretchBeds} Stretch</span>}
                    {canon.stretchBeds > 0 && canon.basketBeds > 0 && <span> · </span>}
                    {canon.basketBeds > 0 && <span>{canon.basketBeds} Basket</span>}
                    {washers > 0 && (
                      <span> · {washers} washing machine{washers === 1 ? '' : 's'}</span>
                    )}
                  </p>
                  {description ? (
                    <p className="mt-2 line-clamp-2 text-sm text-stone-600">{description}</p>
                  ) : null}
                  {stage && (
                    <p className="mt-2 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-medium text-amber-800">
                      {stage}
                    </p>
                  )}
                </div>
              </>
            );
            return (
              <li key={canon.id}>
                {href ? (
                  <Link
                    href={href}
                    className="group block h-full overflow-hidden rounded-lg border border-stone-200 bg-white transition-colors hover:border-amber-300 hover:bg-amber-50/40"
                  >
                    {card}
                  </Link>
                ) : (
                  <div className="h-full overflow-hidden rounded-lg border border-stone-200 bg-white">
                    {card}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {fieldNotes.length > 0 && (
        <section id="field-notes" className="mt-12">
          <h2 className="mb-1 text-sm font-medium uppercase tracking-wider text-stone-500">
            Field notes
          </h2>
          <p className="mb-4 text-xs text-stone-400">
            Trip stories from deliveries and build days, published with consent.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {fieldNotes.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/field-notes/${s.slug}`}
                  className="block h-full rounded-lg border border-stone-200 bg-white p-4 transition-colors hover:border-amber-300 hover:bg-amber-50/40"
                >
                  <h3 className="font-display text-lg font-medium text-stone-900">{s.title}</h3>
                  <p className="mt-1 text-xs text-stone-500">{s.dateline}</p>
                  <p className="mt-2 line-clamp-3 text-sm text-stone-600">{s.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

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
