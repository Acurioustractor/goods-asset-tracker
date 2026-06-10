import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { fetchBuildPhotos } from '@/lib/process/el-build-photos';
import { getStoryOverrides } from '@/lib/field-notes/overrides';
import { createClient } from '@/lib/supabase/server';
import { MediaSwapZone, type SwapFolder } from '@/components/admin/media-swap-picker';

const OVERRIDE_SLUG = 'partners-oonchiumpa';

// Folder presets for the swap modal on this page. Curated so swapping
// photos from EL is a one-click affair: open the modal, pick the
// folder, click the photo.
const FOLDERS: SwapFolder[] = [
  { label: 'All recent', emoji: '🕘', tags: [] },
  { label: 'Oonchiumpa young people', emoji: '👥', tags: ['participant:oonchiumpa-young-people'] },
  { label: 'Alice build', emoji: '🛠', tags: ['event:alice-build'] },
  { label: 'Utopia delivery', emoji: '🏠', tags: ['community:utopia-homelands', 'event:bed-delivery'] },
  { label: 'All Stretch Bed', emoji: '🛏', tags: ['product:stretch-bed'] },
  { label: 'May 2026 trip', emoji: '📅', tags: ['trip:may-2026'] },
];

const CREAM = '#FDF8F3';
const RUST = '#C45C3E';
const CHARCOAL = '#2E2E2E';
const SAGE = '#8B9D77';
const GOLD = '#C9A04A';

const PAGE_TITLE = 'Goods on Country and Oonchiumpa Consultancy Partnership';
const PAGE_DESCRIPTION =
  'How Goods works with Oonchiumpa, a 100% Aboriginal-owned consultancy in Alice Springs, on cultural advice, youth participation, production pathways and Stretch Bed delivery into Utopia Homelands.';
const PAGE_URL = 'https://www.goodsoncountry.com/partners/oonchiumpa';
const PAGE_IMAGE =
  'https://www.goodsoncountry.com/images/partners/centrecorp/utopia/hero-elder-bed.jpg';

export const metadata: Metadata = {
  title: 'Oonchiumpa Partnership',
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: 'article',
    images: [
      {
        url: PAGE_IMAGE,
        width: 1200,
        height: 800,
        alt: 'Warumungu Elder on a Stretch Bed delivered to Utopia Homelands with Oonchiumpa',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Content blocks
// ---------------------------------------------------------------------------

const stats: Array<{
  value?: string;
  label: string;
  detail: string;
  swapKey: string;
  tagQuery: string[];
  imageSrc?: string;
  imageAlt?: string;
}> = [
  {
    value: '2 yrs',
    label: 'Partnership in community',
    detail:
      'Oonchiumpa helped ground the work in community context, cultural advice and youth engagement.',
    swapKey: 'stat.partnership',
    tagQuery: ['participant:oonchiumpa-young-people'],
    imageSrc: '/images/partners/centrecorp/utopia/verandah-test.jpg',
    imageAlt: 'A Stretch Bed being tested on a homelands verandah',
  },
  {
    label: 'Young people building',
    detail:
      'Photos from the May 2026 Alice Springs build session with young people from the Oonchiumpa network.',
    swapKey: 'stat.aliceBuild',
    tagQuery: ['trip:may-2026', 'event:alice-build', 'participant:oonchiumpa-young-people'],
    imageSrc: '/images/product/stretch-bed-kids-building.jpg',
    imageAlt: 'Young people building a Stretch Bed in Alice Springs',
  },
  {
    value: '107',
    label: 'Stretch Beds delivered',
    detail:
      'To Utopia Homelands, May 2026. Funded by Centrecorp Foundation, delivered through the Oonchiumpa network.',
    swapKey: 'stat.utopiaDelivery',
    tagQuery: ['community:utopia-homelands', 'event:bed-delivery'],
    imageSrc: '/images/partners/centrecorp/utopia/community-build.jpg',
    imageAlt: 'Community members assembling Stretch Beds at Utopia Homelands',
  },
  {
    value: '100%',
    label: 'Aboriginal-owned',
    detail:
      'Oonchiumpa Consultancy is owned and run by the Bloomfield family. Cultural consultation is paid at university research rates.',
    swapKey: 'stat.oonchiumpa',
    tagQuery: ['participant:oonchiumpa-young-people'],
    imageSrc: '/images/partners/oonchiumpa.png',
    imageAlt: 'Oonchiumpa Consultancy logo',
  },
];

const voices: Array<{ quote: string; name: string; context: string }> = [
  {
    quote:
      'We want to create a safe space for our young people. There’s a lack of housing, which leads to a lack of sleep, which leads to low school attendance.',
    name: 'Kristy Bloomfield',
    context: 'Director, Oonchiumpa Consultancy',
  },
  {
    quote:
      'We’ve been saying from the start, got to teach kids there’s a better way of living.',
    name: 'Karen Liddle',
    context: 'On young people, accommodation and the build',
  },
];

const photos: Array<{ src: string; alt: string }> = [
  { src: '/images/partners/centrecorp/utopia/hero-elder-bed.jpg', alt: 'A Warumungu Elder on a Stretch Bed at Utopia Homelands' },
  { src: '/images/partners/centrecorp/utopia/community-build.jpg', alt: 'Community members assembling Stretch Beds at Utopia Homelands' },
  { src: '/images/partners/centrecorp/utopia/final-assembly.jpg', alt: 'Final assembly of a Stretch Bed at Utopia Homelands' },
  { src: '/images/partners/centrecorp/utopia/unpacking-parts.jpg', alt: 'Unpacking flat-pack Stretch Bed components on country' },
  { src: '/images/partners/centrecorp/utopia/home-setup.jpg', alt: 'Stretch Bed set up inside a remote-community home' },
  { src: '/images/partners/centrecorp/utopia/verandah-test.jpg', alt: 'A Stretch Bed being tested on a homelands verandah' },
  { src: '/images/partners/centrecorp/utopia/finished-bed-country.jpg', alt: 'Finished Stretch Bed delivered on country' },
  { src: '/images/partners/centrecorp/utopia/elder-feedback.jpg', alt: 'Elder providing feedback on a Stretch Bed' },
];

const karenBuildVideo = {
  src: '/video/partners/oonchiumpa/karen-liddle-on-beds.mp4',
  poster: '/video/partners/oonchiumpa/karen-liddle-on-beds-poster.jpg',
};

const mykelBuildVideo = {
  src: '/video/partners/oonchiumpa/mykel-building-the-bed.mp4',
  poster: '/video/partners/oonchiumpa/mykel-building-the-bed-poster.jpg',
};

const aliceBuildFallbackPhotos: Array<{ src: string; alt: string }> = [
  { src: '/images/build/build-001.jpg', alt: 'Young people arriving for the Alice Springs Stretch Bed build' },
  { src: '/images/build/build-017.jpg', alt: 'Young people assembling Stretch Bed components in Alice Springs' },
  { src: '/images/build/build-033.jpg', alt: 'Stretch Bed parts laid out during the Alice Springs build' },
  { src: '/images/build/build-049.jpg', alt: 'Young people working together on a Stretch Bed frame' },
  { src: '/images/build/build-065.jpg', alt: 'Stretch Bed assembly work during the Oonchiumpa build session' },
  { src: '/images/build/build-081.jpg', alt: 'Finished Stretch Bed being checked during the Alice Springs build' },
  { src: '/images/build/build-097.jpg', alt: 'Young people and community members at the bed build session' },
  { src: '/images/build/build-113.jpg', alt: 'Stretch Beds ready after the Alice Springs build session' },
];

const articleJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  mainEntityOfPage: { '@type': 'WebPage', '@id': PAGE_URL },
  headline: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  image: [PAGE_IMAGE],
  inLanguage: 'en-AU',
  author: { '@type': 'Organization', name: 'Goods on Country' },
  publisher: {
    '@type': 'Organization',
    name: 'Goods on Country',
    url: 'https://www.goodsoncountry.com',
    logo: { '@type': 'ImageObject', url: 'https://www.goodsoncountry.com/logo.svg' },
  },
  about: [
    { '@type': 'Organization', name: 'Oonchiumpa Consultancy', url: 'https://oonchiumpa.com.au' },
    { '@type': 'Place', name: 'Alice Springs', address: { '@type': 'PostalAddress', addressRegion: 'NT', addressCountry: 'AU' } },
    { '@type': 'Place', name: 'Utopia Homelands', address: { '@type': 'PostalAddress', addressRegion: 'NT', addressCountry: 'AU' } },
  ],
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.goodsoncountry.com/' },
    { '@type': 'ListItem', position: 2, name: 'Partners', item: 'https://www.goodsoncountry.com/partner' },
    { '@type': 'ListItem', position: 3, name: 'Oonchiumpa', item: PAGE_URL },
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function StatCard({
  value,
  label,
  detail,
  swapKey,
  tagQuery,
  imageSrc,
  imageAlt,
  canSwap,
  getOverride,
}: (typeof stats)[number] & {
  canSwap: boolean;
  getOverride: (key: string, fallback: string) => string;
}) {
  const resolvedImageSrc = imageSrc ? getOverride(swapKey, imageSrc) : undefined;

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-sm flex flex-col"
      style={{ backgroundColor: CREAM }}
    >
      {resolvedImageSrc ? (
        <div className="relative aspect-[3/2] bg-muted">
          <Image
            src={resolvedImageSrc}
            alt={imageAlt || ''}
            fill
            sizes="(max-width: 768px) 100vw, 350px"
            className="object-cover"
          />
          {canSwap && (
            <MediaSwapZone
              slug={OVERRIDE_SLUG}
              overrideKey={swapKey}
              currentUrl={resolvedImageSrc}
              tagQuery={tagQuery}
              kind="photo"
              label="swap"
              broadTag="product:stretch-bed"
              folders={FOLDERS}
            />
          )}
        </div>
      ) : null}
      <div className="p-6 flex-1">
        {value ? (
          <div
            className="font-display text-4xl sm:text-5xl leading-none mb-2"
            style={{ color: CHARCOAL }}
          >
            {value}
          </div>
        ) : null}
        <div
          className={`text-sm font-semibold uppercase tracking-[0.18em] ${value ? 'mb-3' : 'mb-4'}`}
          style={{ color: RUST }}
        >
          {label}
        </div>
        <p className="text-sm leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
          {detail}
        </p>
      </div>
    </div>
  );
}

function QuoteCard({ quote, name, context }: (typeof voices)[number]) {
  return (
    <figure
      className="rounded-2xl p-7 sm:p-8 shadow-sm"
      style={{ backgroundColor: `${SAGE}1A`, border: `1px solid ${SAGE}33` }}
    >
      <blockquote
        className="text-lg sm:text-xl leading-relaxed mb-5"
        style={{ fontFamily: 'Georgia, serif', color: CHARCOAL }}
      >
        &ldquo;{quote}&rdquo;
      </blockquote>
      <figcaption className="text-sm">
        <div className="font-semibold" style={{ color: CHARCOAL }}>
          {name}
        </div>
        <div style={{ color: `${CHARCOAL}99` }}>{context}</div>
      </figcaption>
    </figure>
  );
}

function VoiceVideoCard({
  title,
  description,
  src,
  poster,
}: {
  title: string;
  description: string;
  src: string;
  poster?: string;
}) {
  return (
    <article
      className="overflow-hidden rounded-3xl shadow-sm"
      style={{ backgroundColor: CREAM, border: `1px solid ${SAGE}33` }}
    >
      <div className="aspect-video bg-black">
        <video
          controls
          playsInline
          preload="metadata"
          poster={poster || undefined}
          className="h-full w-full"
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
      <div className="p-5">
        <p className="text-xs uppercase tracking-[0.2em]" style={{ color: RUST }}>
          Voice from the build
        </p>
        <h3 className="mt-2 text-xl font-semibold" style={{ color: CHARCOAL }}>
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
          {description}
        </p>
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function OonchiumpaPartnerPage() {
  // Pull a few live photos from EL of the Alice Springs build, tagged with
  // participant:oonchiumpa-young-people. Falls back silently if EL is
  // unreachable.
  const buildPhotos = await fetchBuildPhotos(
    ['trip:may-2026', 'event:alice-build', 'participant:oonchiumpa-young-people'],
    8,
  );

  // Admin detection — local dev or signed-in user gets the in-place
  // swap widget on every media slot. Public visitors see no chrome.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLocalDev = process.env.NODE_ENV !== 'production';
  const canSwap = !!user || isLocalDev;

  // Manual overrides from data/field-note-overrides.json under slug
  // 'partners-oonchiumpa'. Keys are dot paths: 'hero', 'verandah',
  // 'gallery.0' … 'gallery.7', 'production.0' … 'production.3', etc.
  const overrides = getStoryOverrides(OVERRIDE_SLUG);
  const get = (key: string, fallback: string) => overrides[key] || fallback;

  return (
    <main className="min-h-screen" style={{ backgroundColor: CREAM, color: CHARCOAL }}>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* HERO ----------------------------------------------------------- */}
      <section className="px-5 sm:px-8 pt-12 sm:pt-16 pb-12 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/partner"
            className="text-xs uppercase tracking-[0.25em] hover:underline"
            style={{ color: `${CHARCOAL}66` }}
          >
            ← Partners
          </Link>
        </div>
        <div className="flex items-center gap-4 mb-7">
          <Image
            src="/images/partners/oonchiumpa.png"
            alt="Oonchiumpa Consultancy"
            width={560}
            height={350}
            className="h-14 sm:h-16 w-auto"
            priority
          />
          <span
            aria-hidden
            className="text-2xl sm:text-3xl font-light"
            style={{ color: `${CHARCOAL}55` }}
          >
            ×
          </span>
          <div className="flex flex-col leading-none">
            <span
              className="font-display text-2xl sm:text-3xl tracking-tight"
              style={{ color: CHARCOAL }}
            >
              Goods
            </span>
            <span
              className="text-[10px] sm:text-xs uppercase tracking-[0.25em] mt-1"
              style={{ color: `${CHARCOAL}99` }}
            >
              On Country
            </span>
          </div>
        </div>

        <p
          className="text-xs uppercase tracking-[0.25em] mb-5"
          style={{ color: RUST }}
        >
          A long partnership
        </p>
        <h1
          className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight mb-6"
          style={{ color: CHARCOAL }}
        >
          Grounded by Oonchiumpa.<br />Built in Alice Springs.
        </h1>
        <p className="text-lg sm:text-xl leading-relaxed mb-4 max-w-2xl" style={{ color: `${CHARCOAL}cc` }}>
          Oonchiumpa Consultancy is a 100% Aboriginal-owned business led by the Bloomfield family. The
          partnership has helped Goods work in the right way in Central Australia: with cultural advice,
          local relationships, young people involved in the build and a practical pathway into Utopia
          Homelands.
        </p>
        <p className="text-lg sm:text-xl leading-relaxed max-w-2xl" style={{ color: `${CHARCOAL}cc` }}>
          Oonchiumpa is part of the enterprise pathway: young people from the network learning to build
          beds, Goods developing production capacity in Alice Springs and deliveries moving through
          relationships that already know the homelands.
        </p>
      </section>

      {/* HERO PHOTO ----------------------------------------------------- */}
      <section className="px-5 sm:px-8 pb-14 max-w-5xl mx-auto">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl shadow-sm">
          {(() => {
            const heroSrc = get('hero', '/images/partners/centrecorp/utopia/hero-elder-bed.jpg');
            return (
              <>
                <Image
                  src={heroSrc}
                  alt="Oonchiumpa partnership hero image"
                  fill
                  sizes="(max-width: 1024px) 100vw, 1000px"
                  className="object-cover"
                  priority
                />
                {canSwap && (
                  <MediaSwapZone
                    slug={OVERRIDE_SLUG}
                    overrideKey="hero"
                    currentUrl={heroSrc}
                    tagQuery={['participant:oonchiumpa-young-people']}
                    kind="photo"
                    label="swap hero"
                    broadTag="product:stretch-bed"
                    folders={FOLDERS}
                  />
                )}
              </>
            );
          })()}
        </div>
      </section>

      {/* FRED VIDEO ---------------------------------------------------- */}
      <section className="px-5 sm:px-8 pb-14 max-w-5xl mx-auto">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr] md:items-center">
          <div>
            <p
              className="text-xs uppercase tracking-[0.25em] mb-3"
              style={{ color: RUST }}
            >
              In Fred’s words
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl leading-tight mb-4"
              style={{ color: CHARCOAL }}
            >
              Fred from Oonchiumpa on what the work is for.
            </h2>
            <p className="text-base sm:text-lg leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
              Fred Campbell works with the youth program at Oonchiumpa. He talks here about why
              this partnership matters: the young people learning a trade, the families getting a
              bed that lasts, the family knowing they made it.
            </p>
          </div>
          <div
            className="relative w-full overflow-hidden rounded-3xl shadow-sm bg-black"
            style={{ aspectRatio: '16 / 9' }}
          >
            <iframe
              src="https://share.descript.com/embed/YQwAcYfxzkn"
              title="Fred from Oonchiumpa, Community Voices"
              allow="autoplay; fullscreen"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* STATS ---------------------------------------------------------- */}
      <section className="px-5 sm:px-8 py-14 max-w-5xl mx-auto">
        <div className="max-w-3xl mb-10">
          <p
            className="text-xs uppercase tracking-[0.25em] mb-3"
            style={{ color: RUST }}
          >
            What two years built
          </p>
          <h2
            className="font-display text-3xl sm:text-4xl tracking-tight"
            style={{ color: CHARCOAL }}
          >
            Local knowledge becomes local enterprise.
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} canSwap={canSwap} getOverride={get} />
          ))}
        </div>
      </section>

      {/* DESIGN AROUND THE FIRE ----------------------------------------- */}
      <section className="px-5 sm:px-8 py-14" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p
              className="text-xs uppercase tracking-[0.25em] mb-3"
              style={{ color: RUST }}
          >
              How the partnership works
          </p>
          <h2
            className="font-display text-3xl sm:text-4xl leading-tight mb-5"
            style={{ color: CHARCOAL }}
          >
              Oonchiumpa brings the relationships that make delivery possible.
          </h2>
          <p className="text-base sm:text-lg leading-relaxed mb-4" style={{ color: `${CHARCOAL}cc` }}>
              Goods brings the bed, the production work and the asset-tracking system. Oonchiumpa brings
              local knowledge, cultural advice, young people into the build and the trusted pathway into
              Utopia Homelands. That is the work: making sure the product lands through the right people,
              not just dropping furniture at the end of a road.
          </p>
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
              The agreement treats that role as paid expertise, benchmarked to university research rates.
              Cultural advice, access and local leadership are part of the delivery model, not free
              background help.
          </p>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-sm">
            {(() => {
              const src = get('verandah', '/images/partners/centrecorp/utopia/verandah-test.jpg');
              return (
                <>
                  <Image
                    src={src}
                    alt="Stretch Bed being tested on a homelands verandah"
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover"
                  />
                  {canSwap && (
                    <MediaSwapZone
                      slug={OVERRIDE_SLUG}
                      overrideKey="verandah"
                      currentUrl={src}
                      tagQuery={['participant:oonchiumpa-young-people']}
                      kind="photo"
                      label="swap"
                      broadTag="product:stretch-bed"
                      folders={FOLDERS}
                    />
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </section>

      {/* PRODUCTION FACILITY (Alice Springs) ---------------------------- */}
      <section className="px-5 sm:px-8 py-14" style={{ backgroundColor: `${SAGE}1A` }}>
        <div className="max-w-5xl mx-auto">
          <div className="max-w-3xl mb-10">
            <p
              className="text-xs uppercase tracking-[0.25em] mb-3"
              style={{ color: RUST }}
            >
              In the works
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl leading-tight mb-5"
              style={{ color: CHARCOAL }}
            >
              A production facility pathway in Alice Springs.
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-3" style={{ color: `${CHARCOAL}cc` }}>
              Two shipping containers. A shredder for the plastic that comes in by the tub. A heat
              press that turns chip into sheet. A CNC router that cuts the legs. A workstation
              for routing, drilling and assembly. Power and water plug in.
            </p>
            <p className="text-base sm:text-lg leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
              The aim is to train local people, build production roles and move more value closer
              to the communities using the product. Beds ship under QR codes so every delivery is
              traceable.
            </p>
          </div>

          {(() => {
            const heroSrc = get('production.hero', '/images/process/20260329-factory-panorama.jpg');
            return (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl shadow-sm mb-4 bg-muted">
                <Image
                  src={heroSrc}
                  alt="Panorama of the Goods production facility setup"
                  fill
                  sizes="(max-width: 1024px) 100vw, 1000px"
                  className="object-cover"
                />
                {canSwap && (
                  <MediaSwapZone
                    slug={OVERRIDE_SLUG}
                    overrideKey="production.hero"
                    currentUrl={heroSrc}
                    tagQuery={['product:stretch-bed']}
                    kind="photo"
                    label="swap"
                    broadTag="product:stretch-bed"
                    folders={FOLDERS}
                  />
                )}
              </div>
            );
          })()}

          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'production.0', src: '/images/process/heat-press-detail.jpg', alt: 'Heat press inside the production container' },
              { key: 'production.1', src: '/images/process/cnc-cutting-closeup.jpg', alt: 'CNC router cutting a Stretch Bed leg' },
              { key: 'production.2', src: '/images/process/parts-rack-workarea.jpg', alt: 'Workstation parts rack with sorted leg components' },
            ].map((tile) => {
              const src = get(tile.key, tile.src);
              return (
                <div
                  key={tile.key}
                  className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted"
                >
                  <Image
                    src={src}
                    alt={tile.alt}
                    fill
                    sizes="(max-width: 768px) 33vw, 25vw"
                    className="object-cover"
                  />
                  {canSwap && (
                    <MediaSwapZone
                      slug={OVERRIDE_SLUG}
                      overrideKey={tile.key}
                      currentUrl={src}
                      tagQuery={['product:stretch-bed']}
                      kind="photo"
                      label="swap"
                      broadTag="product:stretch-bed"
                      folders={FOLDERS}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* YOUNG PEOPLE BUILDING (Alice Springs) -------------------------- */}
      <section className="px-5 sm:px-8 py-14 max-w-5xl mx-auto">
        <div className="max-w-3xl mb-8">
          <p
            className="text-xs uppercase tracking-[0.25em] mb-3"
            style={{ color: RUST }}
          >
            Alice Springs · May 2026
          </p>
          <h2
            className="font-display text-3xl sm:text-4xl leading-tight mb-5"
            style={{ color: CHARCOAL }}
          >
            Young people building Stretch Beds.
          </h2>
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
            In May 2026 the Oonchiumpa team ran a build session in Alice Springs. Young people from the
            network learned to thread the steel poles through the canvas sleeves and the recycled-plastic
            X-legs, tension the frame, and finish beds for the Utopia Homelands delivery. Some of the beds also stayed with young
            people who took part in the build.
          </p>
        </div>

        <div className="mb-8">
          <VoiceVideoCard
            title="Karen Liddle on why the build matters"
            description="Karen speaks to the young people, the build and why this work matters for Oonchiumpa and the homelands pathway."
            src={karenBuildVideo.src}
            poster={karenBuildVideo.poster}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {aliceBuildFallbackPhotos.map((fallback, index) => {
            const livePhoto = buildPhotos[index];
            const key = `aliceBuild.${index}`;
            const src = get(key, livePhoto?.src ?? fallback.src);
            const alt = livePhoto?.alt ?? fallback.alt;

            return (
              <div key={key} className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
                {canSwap && (
                  <MediaSwapZone
                    slug={OVERRIDE_SLUG}
                    overrideKey={key}
                    currentUrl={src}
                    tagQuery={['trip:may-2026', 'event:alice-build', 'participant:oonchiumpa-young-people']}
                    kind="photo"
                    label="swap"
                    broadTag="product:stretch-bed"
                    folders={FOLDERS}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8">
          <VoiceVideoCard
            title="Mykel on building the bed he used"
            description="Mykel talks about the bed, the build and what it felt like to use something he helped put together."
            src={mykelBuildVideo.src}
            poster={mykelBuildVideo.poster}
          />
        </div>
      </section>

      {/* UTOPIA DELIVERY GALLERY ---------------------------------------- */}
      <section className="px-5 sm:px-8 py-14" style={{ backgroundColor: `${GOLD}10` }}>
        <div className="max-w-5xl mx-auto">
          <div className="max-w-3xl mb-8">
            <p
              className="text-xs uppercase tracking-[0.25em] mb-3"
              style={{ color: RUST }}
            >
              Utopia Homelands · May 2026
            </p>
            <h2
              className="font-display text-3xl sm:text-4xl leading-tight mb-5"
              style={{ color: CHARCOAL }}
            >
              107 beds in homes, on country.
            </h2>
            <p className="text-base sm:text-lg leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
              The first big deployment of the new Stretch Bed: 107 beds delivered to Utopia Homelands,
              unpacked on verandahs, assembled by the families who would sleep on them. Funded by
              Centrecorp Foundation. Coordinated through the Oonchiumpa network. Logged under QR codes
              so we know where every bed is.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((p, i) => {
              const key = `gallery.${i}`;
              const src = get(key, p.src);
              return (
                <div
                  key={key}
                  className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted"
                >
                  <Image
                    src={src}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                  {canSwap && (
                    <MediaSwapZone
                      slug={OVERRIDE_SLUG}
                      overrideKey={key}
                      currentUrl={src}
                      tagQuery={['community:utopia-homelands', 'event:bed-delivery']}
                      kind="photo"
                      label="swap"
                      broadTag="product:stretch-bed"
                      folders={FOLDERS}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* QUOTES --------------------------------------------------------- */}
      <section className="px-5 sm:px-8 py-14 max-w-5xl mx-auto">
        <p
          className="text-xs uppercase tracking-[0.25em] mb-3"
          style={{ color: RUST }}
        >
          From Oonchiumpa
        </p>
        <h2
          className="font-display text-3xl sm:text-4xl leading-tight mb-8"
          style={{ color: CHARCOAL }}
        >
          What this partnership is about.
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {voices.map((v, i) => (
            <QuoteCard key={i} {...v} />
          ))}
        </div>
      </section>

      {/* WHAT'S NEXT ---------------------------------------------------- */}
      <section
        className="px-5 sm:px-8 py-14"
        style={{ backgroundColor: CHARCOAL, color: CREAM }}
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="text-xs uppercase tracking-[0.25em] mb-4"
            style={{ color: `${CREAM}99` }}
          >
            What’s next
          </p>
          <h2 className="font-display text-3xl sm:text-4xl leading-tight mb-6">
            An on-country production facility in Alice Springs.
          </h2>
          <p className="text-lg sm:text-xl leading-relaxed mb-4" style={{ color: `${CREAM}d9` }}>
            The next move is a shipping-container production plant being planned alongside the
            Oonchiumpa pathway in Alice Springs. Shredder, heat press, CNC router, workstation. The
            goal is a plant that can train local people, make bed parts and move more production
            closer to community.
          </p>
          <p className="text-lg sm:text-xl leading-relaxed mb-8" style={{ color: `${CREAM}d9` }}>
            The pathway is local knowledge to local enterprise to local jobs. Young people from the
            Oonchiumpa network have already helped build beds. The next step is training, production
            roles, QR-tracked deliveries and more value staying closer to the communities using the
            product.
          </p>
          <Link
            href="/partner#start"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 text-base font-semibold transition hover:-translate-y-0.5"
            style={{ backgroundColor: RUST, color: CREAM }}
          >
            Back the facility →
          </Link>
        </div>
      </section>

      {/* FOOTNOTE ------------------------------------------------------- */}
      <section className="px-5 sm:px-8 py-12 max-w-5xl mx-auto text-center">
        <p className="text-sm" style={{ color: `${CHARCOAL}99` }}>
          Oonchiumpa Consultancy is at{' '}
          <a
            href="https://oonchiumpa.com.au"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:underline font-semibold"
            style={{ color: RUST }}
          >
            oonchiumpa.com.au
          </a>
          . Read about the Utopia Homelands delivery with{' '}
          <Link
            href="/partners/centrecorp"
            className="underline-offset-4 hover:underline font-semibold"
            style={{ color: RUST }}
          >
            Centrecorp Foundation
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
