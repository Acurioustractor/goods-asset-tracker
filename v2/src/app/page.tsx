import Image from 'next/image';
import Link from 'next/link';
import { ORGANISATION } from '@/lib/data/organisation';
import { ContactGoodsButton } from '@/components/contact/contact-goods-button';
import { brand } from '@/lib/data/content';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { BUYERS } from '@/lib/data/pitch-chapters';
import { PLASTIC_KG_PER_BED, STRETCH_BED } from '@/lib/data/products';
import { tripStories } from '@/lib/data/trip-stories';
import { videoUrl } from '@/lib/data/media';
import { canonVideoSrc } from '@/lib/data/canon-videos';
import { getStoryOverrides } from '@/lib/field-notes/overrides';
import { createClient } from '@/lib/supabase/server';
import { MediaSwapZone, type SwapFolder } from '@/components/admin/media-swap-picker';

/**
 * The home page. One job: say what Goods on Country is in a line, and put a visitor on the
 * right page (buy beds, sell beds, back the work) before they scroll. Everything after the
 * doors is the evidence for them, in the same visual language as /beds and /pitch: cream
 * paper, ink, terracotta, Playfair headings, 22px corners, round buttons.
 */

const HOME_SLUG = 'home';

const HOME_FOLDERS: SwapFolder[] = [
  { label: 'All recent', emoji: '🕘', tags: [] },
  { label: 'All Stretch Bed', emoji: '🛏', tags: ['product:stretch-bed'] },
  { label: 'Alice build', emoji: '🛠', tags: ['event:alice-build'] },
  { label: 'Utopia delivery', emoji: '🏠', tags: ['community:utopia-homelands', 'event:bed-delivery'] },
  { label: 'Oonchiumpa young people', emoji: '👥', tags: ['participant:oonchiumpa-young-people'] },
  { label: 'May 2026 trip', emoji: '📅', tags: ['trip:may-2026'] },
];

const GUTTER = 'px-6 md:px-10 lg:px-14';
const RULE = 'border-[#e6dfd1]';
const BODY = 'text-[#4a4741]';
const BUTTON = 'inline-flex min-h-12 items-center rounded-full px-7 text-base font-semibold transition-colors';

const DOORS = [
  {
    href: '/beds',
    kicker: 'For homes and organisations',
    title: 'Buy beds',
    line: 'One bed online, or a quote and invoice for your organisation.',
    photo: { src: '/images/stories/utopia/09-offground.jpg', alt: 'A family on a Stretch Bed, up off the ground, Utopia Homelands' },
  },
  {
    href: '/sell-beds',
    kicker: 'For community organisations',
    title: 'Sell beds in your community',
    line: '100 beds for your organisation to sell, and the money stays with you.',
    photo: { src: '/images/community/alice-springs/stretch-bed-kids-pile.jpg', alt: 'Young people with a Stretch Bed in Alice Springs' },
  },
  {
    href: '/partner',
    kicker: 'For funders and supporters',
    title: 'Back the work',
    line: 'Grants, gifts and loans, and what each one pays for.',
    photo: { src: '/images/community/maningrida/kids-carrying-orange-bed.jpg', alt: 'Two young people carrying an orange Stretch Bed at Gamardi' },
  },
] as const;

const PROOF = [
  { value: CANONICAL_ASSETS.bedsDeployed.toLocaleString(), label: 'beds delivered' },
  { value: String(CANONICAL_ASSETS.communitiesServed), label: 'communities' },
  { value: `${CANONICAL_ASSETS.plasticKg.toLocaleString()}kg`, label: 'plastic diverted' },
];

const PARTS = [
  { title: 'Recycled plastic legs', line: `Two X-legs pressed from community plastic, ${PLASTIC_KG_PER_BED}kg in every bed.` },
  { title: 'Galvanised steel poles', line: 'Two poles thread through the canvas sleeves and the holes in the legs.' },
  { title: 'Heavy-duty canvas', line: 'The canvas carries the load, so the bed stands when it is pulled tight.' },
] as const;

const MAKING = [
  { title: 'Collect', line: 'Plastic from around community, sorted by colour and cleaned.', src: '/images/process/color-samples.jpg', alt: 'Sorted recycled plastic from community waste' },
  { title: 'Shred', line: 'The shredder lives in the container and stays on site.', src: '/images/process/container-factory.jpg', alt: 'Plastic shredder inside the containerised plant' },
  { title: 'Press', line: 'Heated and pressed into sheets. The colour is whatever was collected.', src: '/images/process/hydraulic-press.jpg', alt: 'Hydraulic press compressing recycled plastic into sheets' },
  { title: 'Cut', line: 'A CNC router cuts the legs from the sheet.', src: '/images/process/cnc-cutter.jpg', alt: 'CNC router cutting bed legs from a pressed sheet' },
  { title: 'Assemble', line: 'Poles through the sleeves and legs, then tension. No tools.', src: '/images/product/stretch-bed-kids-building.jpg', alt: 'Young people threading steel poles through the recycled-plastic legs' },
] as const;

function Kicker({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${dark ? 'text-goods-terracotta-light' : 'text-goods-terracotta'}`}>
      {children}
    </p>
  );
}

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLocalDev = process.env.NODE_ENV !== 'production';
  const canSwap = !!user || isLocalDev;

  const overrides = getStoryOverrides(HOME_SLUG);
  const ov = (key: string, fallback: string) => overrides[key] || fallback;

  const hero = canonVideoSrc('video-hero', {
    desktop: videoUrl('hero-desktop.mp4'),
    mobile: videoUrl('hero-mobile.mp4'),
    poster: '/video/hero-poster.jpg',
  });

  const published = tripStories.filter((s) => s.published);
  const latest = published[published.length - 1];
  const masthead = latest?.blocks.find((b) => b.kind === 'masthead');
  const latestImage = masthead && 'media' in masthead ? masthead.media.image : null;

  const bedSrc = ov('bed.hero', '/images/product/stretch-bed-hero.jpg');
  const voice = {
    hero: ov('oonchiumpa.hero', '/images/product/stretch-bed-kids-building.jpg'),
    two: ov('oonchiumpa.thumb2', '/images/partners/centrecorp/utopia/community-build.jpg'),
    three: ov('oonchiumpa.thumb3', '/images/partners/centrecorp/utopia/verandah-test.jpg'),
  };

  const film = {
    desktop: ov('feature-video.videoDesktop', '/video/building-together-desktop.mp4'),
    mobile: ov('feature-video.videoMobile', '/video/building-together-mobile.mp4'),
    poster: ov('feature-video.poster', '/video/building-together-poster.jpg'),
    image: overrides['feature-video.image'],
  };

  return (
    <div className="bg-goods-cream text-goods-ink">
      {/* 1. What this is, in a line. */}
      <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-goods-ink">
        <video className="absolute inset-0 -z-10 hidden h-full w-full object-cover md:block" src={hero.desktop} poster={hero.poster} autoPlay muted loop playsInline />
        <video className="absolute inset-0 -z-10 h-full w-full object-cover md:hidden" src={hero.mobile} poster={hero.poster} autoPlay muted loop playsInline />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
        <div className={`w-full ${GUTTER} pb-12 pt-32 md:pb-32`}>
          <div className="mx-auto max-w-6xl">
            <Kicker dark>Goods on Country</Kicker>
            <h1 className="mt-4 max-w-3xl font-display text-5xl font-semibold leading-[1.02] tracking-[-0.01em] text-white text-balance md:text-7xl">
              {brand.hero.home.headline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
              {brand.hero.home.subheadline} {CANONICAL_ASSETS.bedsDeployed} beds are in {CANONICAL_ASSETS.communitiesServed} communities, and the making is moving closer to the people who use them.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/beds" className={`${BUTTON} bg-goods-terracotta text-white hover:bg-[#a94f35]`}>Buy beds</Link>
              <a href="#ways-in" className={`${BUTTON} border border-white/50 text-white hover:border-white hover:bg-white/10`}>Find your way in</a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Three doors, one size and one treatment, before anything else. */}
      <section id="ways-in" aria-label="Ways in" className={`${GUTTER} scroll-mt-20 pt-6 md:-mt-14 md:pt-0`}>
        <ul className="relative z-10 mx-auto grid max-w-6xl gap-4 md:grid-cols-3 md:gap-5">
          {DOORS.map((door) => (
            <li key={door.href}>
              <Link href={door.href} className="group relative block aspect-[2/1] overflow-hidden rounded-[22px] bg-goods-sand shadow-[0_24px_50px_-30px_rgba(30,20,10,0.6)] sm:aspect-[16/9] md:aspect-[4/5]">
                <Image src={door.photo.src} alt={door.photo.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                  <Kicker dark>{door.kicker}</Kicker>
                  <p className="mt-1.5 font-display text-2xl font-semibold leading-tight text-white md:mt-2 md:text-3xl">
                    {door.title} <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </p>
                  <p className="mt-1 text-sm leading-snug text-white/85 md:mt-2 md:text-[15px]">{door.line}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-6 max-w-6xl text-sm text-[#5d574c]">
          {ORGANISATION.boardLine} {ORGANISATION.identityLine}{' '}
          <Link href="/who-we-are" className="font-semibold text-goods-ink underline underline-offset-2 hover:text-goods-terracotta">Who we are</Link>
        </p>
      </section>

      {/* 3. So far: who has paid. */}
      <section aria-label="So far" className={`${GUTTER} py-16 md:py-24`}>
        <div className={`mx-auto grid max-w-6xl gap-10 border-t ${RULE} pt-12 md:pt-16 lg:grid-cols-[1.25fr_1fr] lg:items-end`}>
          <div>
            <Kicker>So far</Kicker>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-balance md:text-5xl">{BUYERS.headline}</h2>
            <p className={`mt-5 max-w-xl text-[16px] leading-relaxed ${BODY}`}>
              Bought by {BUYERS.rows.slice(0, -1).map((r) => r.buyer).join('; ')}; and {BUYERS.rows[BUYERS.rows.length - 1].buyer}.
            </p>
            <Link href="/beds#order" className={`${BUTTON} mt-6 border border-goods-ink/25 hover:border-goods-ink`}>Order for your organisation</Link>
          </div>
          <dl className="grid grid-cols-3 gap-4">
            {PROOF.map((p) => (
              <div key={p.label} className="border-t-2 border-goods-terracotta pt-3">
                <dt className="sr-only">{p.label}</dt>
                <dd className="font-display text-3xl font-semibold md:text-5xl">{p.value}</dd>
                <dd className="mt-1 text-xs leading-snug text-[#5d574c] md:text-sm">{p.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 4. The bed. */}
      <section className={`border-t ${RULE} bg-[#FDF8F3] ${GUTTER} py-16 md:py-24`}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-goods-sand">
            <Image src={bedSrc} alt="A Stretch Bed on Country in golden light" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            {canSwap && (
              <MediaSwapZone slug={HOME_SLUG} overrideKey="bed.hero" currentUrl={bedSrc} tagQuery={['product:stretch-bed']} kind="photo" label="swap" broadTag="product:stretch-bed" folders={HOME_FOLDERS} />
            )}
          </div>
          <div>
            <Kicker>The Stretch Bed</Kicker>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-balance md:text-5xl">Three parts, and five minutes to put together.</h2>
            <p className={`mt-4 text-lg leading-relaxed ${BODY}`}>
              {STRETCH_BED.specs.weight}, holds {STRETCH_BED.specs.loadCapacity}, and flat-packs for freight. Every bed carries a QR code to report a problem and get it fixed.
            </p>
            <ol className="mt-8 space-y-5">
              {PARTS.map((p, i) => (
                <li key={p.title} className={`grid grid-cols-[2.5rem_1fr] border-t ${RULE} pt-4`}>
                  <span className="font-display text-lg font-semibold text-goods-terracotta">0{i + 1}</span>
                  <span>
                    <span className="block font-display text-xl font-semibold">{p.title}</span>
                    <span className={`mt-1 block text-[15px] leading-relaxed ${BODY}`}>{p.line}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/beds" className={`${BUTTON} bg-goods-terracotta text-white hover:bg-[#a94f35]`}>Buy beds</Link>
              <Link href="/stretch-bed" className={`${BUTTON} border border-goods-ink/25 hover:border-goods-ink`}>Watch one go together</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. The making, film first. */}
      <section className="bg-goods-ink text-goods-cream">
        <div className="relative isolate flex min-h-[60svh] items-end overflow-hidden">
          {film.image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={film.image} alt="Beds assembled on Country" className="absolute inset-0 -z-10 h-full w-full object-cover" />
          ) : (
            <>
              <video className="absolute inset-0 -z-10 hidden h-full w-full object-cover sm:block" src={film.desktop} poster={film.poster} autoPlay muted loop playsInline />
              <video className="absolute inset-0 -z-10 h-full w-full object-cover sm:hidden" src={film.mobile} poster={film.poster} autoPlay muted loop playsInline />
            </>
          )}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-goods-ink via-goods-ink/40 to-transparent" />
          <div className={`w-full ${GUTTER} pb-8 pt-40 md:pb-12`}>
            <div className="mx-auto max-w-6xl">
              <Kicker dark>Making in community</Kicker>
              <h2 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight text-white text-balance md:text-6xl">
                Beds assembled by the people who&rsquo;ll sleep on them.
              </h2>
            </div>
          </div>
          {canSwap && (
            <MediaSwapZone slug={HOME_SLUG} overrideKey="feature-video.image" currentUrl={film.image || film.desktop} tagQuery={['use:process']} kind="any" label="swap video" broadTag="product:stretch-bed" folders={HOME_FOLDERS} smartMediaRoute />
          )}
        </div>

        <div className={`${GUTTER} pb-16 pt-4 md:pb-24`}>
          <div className="mx-auto max-w-6xl">
            <p className="max-w-2xl text-lg leading-relaxed text-goods-cream/75">
              From rubbish to bed: a production plant in a shipping container turns community plastic into bed legs, and local people do the making.
            </p>
            <ol className="-mx-6 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 md:-mx-10 md:px-10 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
              {MAKING.map((step, i) => (
                <li key={step.title} className="w-[70%] shrink-0 snap-start sm:w-[40%] lg:w-auto">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-white/5">
                    <Image src={step.src} alt={step.alt} fill sizes="(min-width: 1024px) 20vw, 70vw" className="object-cover" />
                  </div>
                  <div className="mt-4 border-t-2 border-goods-terracotta pt-3">
                    <p className="font-display text-sm font-semibold text-goods-terracotta-light">0{i + 1}</p>
                    <p className="font-display text-xl font-semibold text-white">{step.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-goods-cream/70">{step.line}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link href="/facilities" className={`${BUTTON} mt-10 bg-goods-terracotta text-white hover:bg-[#a94f35]`}>How a facility comes to a community</Link>
          </div>
        </div>
      </section>

      {/* 6. One voice. */}
      <section className={`${GUTTER} py-16 md:py-24`}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="grid grid-cols-5 gap-3">
            <div className="relative col-span-3 aspect-[4/5] overflow-hidden rounded-[22px] bg-goods-sand">
              <Image src={voice.hero} alt="The Oonchiumpa team with a Stretch Bed at the Alice Springs build" fill sizes="(min-width: 1024px) 30vw, 60vw" className="object-cover" />
              {canSwap && (
                <MediaSwapZone slug={HOME_SLUG} overrideKey="oonchiumpa.hero" currentUrl={voice.hero} tagQuery={['participant:oonchiumpa-young-people']} kind="photo" label="swap" broadTag="product:stretch-bed" folders={HOME_FOLDERS} />
              )}
            </div>
            <div className="col-span-2 grid gap-3">
              {([['oonchiumpa.thumb2', voice.two, 'A young person with a Stretch Bed at the Alice Springs build'], ['oonchiumpa.thumb3', voice.three, 'Building a Stretch Bed in Alice Springs']] as const).map(([key, src, alt]) => (
                <div key={key} className="relative overflow-hidden rounded-[22px] bg-goods-sand">
                  <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 20vw, 40vw" className="object-cover" />
                  {canSwap && (
                    <MediaSwapZone slug={HOME_SLUG} overrideKey={key} currentUrl={src} tagQuery={['product:stretch-bed']} kind="photo" label="swap" broadTag="product:stretch-bed" folders={HOME_FOLDERS} />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <Kicker>Designed in community</Kicker>
            <blockquote className="mt-4">
              <p className="font-display text-3xl font-semibold leading-snug text-balance md:text-4xl">
                &ldquo;We want to create a safe space for our young people. There&rsquo;s a lack of housing, which leads to a lack of sleep, which leads to low school attendance.&rdquo;
              </p>
              <footer className="mt-5 flex items-center gap-3">
                <Image src="/images/partners/oonchiumpa.png" alt="" width={560} height={350} className="h-9 w-auto" />
                <span className="text-sm text-[#5d574c]">Kristy Bloomfield, Director, Oonchiumpa Consultancy</span>
              </footer>
            </blockquote>
            <p className={`mt-6 text-[16px] leading-relaxed ${BODY}`}>
              Oonchiumpa is a 100% Aboriginal-owned business in Alice Springs. Elders, young people and the Goods team have pulled Stretch Bed prototypes apart and changed them together, and Oonchiumpa held the build for Centrecorp&rsquo;s beds for the Utopia homelands.
            </p>
            <Link href="/partners/oonchiumpa" className={`${BUTTON} mt-7 border border-goods-ink/25 hover:border-goods-ink`}>The Oonchiumpa partnership</Link>
          </div>
        </div>
      </section>

      {/* 7. The latest field note. */}
      {latest && (
        <section className={`border-t ${RULE} bg-[#FDF8F3] ${GUTTER} py-16 md:py-24`}>
          <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 lg:gap-16">
            {latestImage && (
              <div className="relative aspect-[3/2] overflow-hidden rounded-[22px] bg-goods-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={latestImage} alt={latest.title} className="h-full w-full object-cover" />
              </div>
            )}
            <div>
              <Kicker>Field notes</Kicker>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-balance md:text-4xl">{latest.title}</h2>
              <p className="mt-2 text-sm text-[#5d574c]">{latest.dateline}</p>
              <p className={`mt-4 text-[16px] leading-relaxed ${BODY}`}>{latest.summary}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={`/field-notes/${latest.slug}`} className={`${BUTTON} bg-goods-ink text-goods-cream hover:bg-goods-terracotta`}>Read the story</Link>
                <Link href="/field-notes" className={`${BUTTON} border border-goods-ink/25 hover:border-goods-ink`}>All field notes</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 8. Back to the doors. */}
      <section className={`bg-goods-ink ${GUTTER} py-16 text-goods-cream md:py-24`}>
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-3xl font-display text-4xl font-semibold leading-tight text-balance md:text-5xl">Beds for your community, or your organisation.</h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-goods-cream/75">
            {BUYERS.who.split('.')[0]} have bought them. Tell us where the beds are going and we will quote the freight.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/beds" className={`${BUTTON} bg-goods-cream text-goods-ink hover:bg-white`}>Buy beds</Link>
            <ContactGoodsButton label="Talk to us" variant="solid" subject="Bulk Order Inquiry" className="min-h-12 px-7 text-base" />
          </div>
        </div>
      </section>
    </div>
  );
}
