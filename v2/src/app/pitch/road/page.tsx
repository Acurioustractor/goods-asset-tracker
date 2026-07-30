import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment } from 'react';
import { ArrowUpRight, PlayCircle } from 'lucide-react';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { communityLocations } from '@/lib/data/content';
import { deckSlides, deckUpdated, type DeckSlide } from '@/lib/data/deck';
import { getStoryteller } from '@/lib/data/storyteller-registry';
import { RoadPitchMap } from './road-map';
import { RoadPitchEditor } from './road-pitch-editor';
import { ZoomableBedImage } from './zoomable-bed-image';
import { ProductionFacilityExperience } from './production-facility-experience';
import { MykelStoryMedia } from './mykel-story-media';
import { getStoryOverrides } from '@/lib/field-notes/overrides';
import { ASK_BLOCKS, ASK_HEADLINE } from '@/lib/data/ask-surface';

export const metadata: Metadata = {
  title: { absolute: 'The road to ownership | Goods.' },
  description:
    'Seven places that changed Goods, the evidence behind the work, and the decisions still open.',
};

const roadStops = deckSlides.filter((slide) => slide.kind === 'stop');
const productSlide = deckSlides.find((slide) => slide.id === 'the-stretch-bed');
const finishedBedSlide = deckSlides.find((slide) => slide.id === 'open-the-stretch-bed');
const modelSlide = deckSlides.find((slide) => slide.kind === 'model');
const closingSlide = deckSlides.find((slide) => slide.kind === 'closing');

const roadTileNames: Record<string, string> = {
  'stop-1-kalgoorlie': 'Ninga Mia',
  'stop-2-tennant-creek': 'Warumungu Country',
  'stop-3-the-machine-with-a-name': 'Warumungu Country',
  'stop-4-palm-island': 'Bwgcolman',
  'stop-5-utopia': 'Urapuntja homelands',
  'stop-6-maningrida-and-the-farm': 'Manayingkarírra',
  'stop-7-oonchiumpa': 'Mparntwe',
};

const roadTileChapters: Record<string, string> = {
  'stop-1-kalgoorlie': 'Health starts at home',
  'stop-2-tennant-creek': 'Ask first',
  'stop-3-the-machine-with-a-name': 'Name it',
  'stop-4-palm-island': 'Distance costs',
  'stop-5-utopia': 'What stays',
  'stop-6-maningrida-and-the-farm': 'Prove the making',
  'stop-7-oonchiumpa': 'Own the making',
};

const fundingOutcomes = [
  {
    number: '01',
    value: '$400K + $400K',
    title: 'Every eligible dollar can land twice',
    body: 'QBE can match $400K in signed external commitments dollar for dollar.',
  },
  {
    number: '02',
    value: '50 beds',
    title: 'Measure the real production cost',
    body: 'The run turns the modelled $426 per bed into a measured production figure.',
  },
  {
    number: '03',
    value: '338 beds/yr',
    title: 'Test the self-funding point',
    body: 'This is the modelled break-even point when Goods presses its own legs. It is a target to test, not a promised return.',
  },
  {
    number: '04',
    value: '1 pathway',
    title: 'Prepare the first community production pathway',
    body: 'Fund the equipment, training, governance and agreements for a pathway defined with the community.',
  },
] as const;

const principleImages = [
  '/images/people/linda-turner.jpg',
  '/images/process/heat-press-full.jpg',
  '/images/build/build-025.jpg',
  '/images/community/alice-springs/oonchiumpa-team-red-bed.jpg',
] as const;

const fundingReturns = [
  {
    number: '01',
    title: 'Grant',
    return: 'No financial return',
    body: 'The return is public-good impact and the QBE match that can double the commitment.',
  },
  {
    number: '02',
    title: 'Repayable capital',
    return: 'Repaid from bed revenue',
    body: 'Rate, term and repayment profile must be agreed. No investment return is promised before the measured run.',
  },
  {
    number: '03',
    title: 'Product order',
    return: 'Beds delivered',
    body: 'An order buys products for community. It is revenue, not match capital.',
  },
] as const;

function resolveLeadVoice(slide: DeckSlide) {
  for (const name of slide.voiceNames ?? []) {
    const person = getStoryteller(name);
    if (!person || person.tier !== 'external') continue;
    const quote =
      (slide.voiceQuoteContext
        ? person.quotes.find(
            (candidate) =>
              candidate.context === slide.voiceQuoteContext &&
              (candidate.status === 'primary' || candidate.status === 'approved'),
          )
        : undefined) ??
      person.quotes.find((candidate) => candidate.status === 'primary') ??
      person.quotes.find((candidate) => candidate.status === 'approved');
    if (quote) return { person, quote };
  }
  return null;
}

function ClaimChips({ slide, dark = false }: { slide?: DeckSlide; dark?: boolean }) {
  if (!slide?.chips?.length) return null;

  return (
    <dl
      className={`grid border-y ${
        dark
          ? 'divide-y divide-[#f1ece4]/20 border-[#f1ece4]/20 sm:divide-x sm:divide-y-0'
          : 'divide-y divide-[#2b2a26]/20 border-[#2b2a26]/20 sm:divide-x sm:divide-y-0'
      } sm:grid-flow-col sm:auto-cols-fr`}
    >
      {slide.chips.map((chip) => (
        <div key={`${chip.label}-${chip.value}`} className="py-3 sm:px-4 sm:first:pl-0 sm:last:pr-0">
          <dt
            className={`font-mono text-[9px] uppercase tracking-[0.16em] ${
              dark ? 'text-[#a8a196]' : 'text-[#7a7363]'
            }`}
          >
            {chip.label}
          </dt>
          <dd className={`mt-1 text-sm leading-5 ${dark ? 'text-[#f1ece4]' : 'text-[#2b2a26]'}`}>
            {chip.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function DeepLinks({ slide, dark = false }: { slide: DeckSlide; dark?: boolean }) {
  if (!slide.goDeeper?.length) return null;

  return (
    <div className="flex flex-wrap gap-x-5 gap-y-3">
      {slide.goDeeper.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`inline-flex items-center gap-2 border-b pb-1 text-sm ${
            dark
              ? 'border-[#d97a59] text-[#fbf8f1] hover:text-[#d97a59]'
              : 'border-[#c45c3e] text-[#2b2a26] hover:text-[#c45c3e]'
          }`}
        >
          {link.label}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      ))}
    </div>
  );
}

export const dynamic = 'force-dynamic';

export default function RoadPitchPage() {
  const durableMedia = getStoryOverrides('pitch-road');
  const resolvedRoadStops = roadStops.map((stop) => ({
    ...stop,
    photo: durableMedia[`${stop.id}.photo`] ?? stop.photo,
  }));
  const resolvedProductSlide = productSlide
    ? {
        ...productSlide,
        photo: durableMedia[`${productSlide.id}.photo`] ?? productSlide.photo,
      }
    : undefined;
  const cover = {
    ...deckSlides[0],
    photo: durableMedia['cover.photo'] ?? deckSlides[0].photo,
  };

  return (
    <article className="road-pitch-scroll overflow-x-hidden bg-[#fbf8f1] text-[#2b2a26]">
      <header className="relative min-h-screen overflow-hidden bg-[#171714] text-[#fbf8f1]">
        <div data-road-media="cover.photo" className="absolute inset-y-0 right-0 w-full lg:w-[56%]">
          <Image
            src="/images/media-pack/lying-on-stretch-bed.jpg"
            alt="A young man resting on a Stretch Bed on Country"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
          />
          <div className="road-pitch-hero-fade absolute inset-0" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col px-6 py-7 md:px-10 lg:px-14">
          <nav className="flex items-center justify-between border-b border-white/20 pb-6">
            <Image
              src="/brand/canonical/goods-primary-white.png"
              alt="Goods."
              width={1200}
              height={467}
              className="h-11 w-auto object-contain"
            />
            <div className="hidden items-center gap-6 border border-white/15 bg-[#171714]/88 px-5 py-3 text-[11px] uppercase tracking-[0.14em] text-white shadow-lg backdrop-blur-md md:flex">
              <a href="#road" className="hover:text-white">The road</a>
              <a href="#map" className="hover:text-white">The map</a>
              <a href="#model" className="hover:text-white">The model</a>
              <a href="#decision" className="hover:text-white">The decision</a>
            </div>
          </nav>

          <div className="flex flex-1 items-end pb-14 pt-28 md:pb-20 lg:items-center lg:pb-8">
            <div className="max-w-3xl lg:w-[44%] lg:max-w-none lg:pr-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#d97a59]">
                The road to ownership · Updated {deckUpdated}
              </p>
              <h1 data-road-text="cover.headline" className="goods-pitch-display mt-7 max-w-3xl text-5xl leading-[0.98] md:text-7xl lg:text-[68px] xl:text-[76px]">
                {cover.headline}
              </h1>
              <p data-road-text="cover.body" className="mt-7 max-w-2xl text-lg leading-8 text-white/75 md:text-xl">
                {cover.body}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="#road"
                  className="bg-[#c45c3e] px-6 py-3 text-sm font-semibold text-white hover:bg-[#d26a4a]"
                >
                  Walk the road
                </a>
                <Link
                  href="/pitch/deck"
                  className="border border-white/35 px-6 py-3 text-sm font-semibold text-white hover:border-white"
                >
                  Open the slide deck
                </Link>
              </div>
              <p className="mt-8 border-t border-white/20 pt-5 font-mono text-[10px] uppercase leading-6 tracking-[0.13em] text-white/55">
                <span className="text-white">{CANONICAL_ASSETS.bedsDeployed}</span> beds
                <span className="mx-2 text-[#d97a59]">·</span>
                <span className="text-white">{CANONICAL_ASSETS.washersInCommunity}</span> washers
                <span className="mx-2 text-[#d97a59]">·</span>
                <span className="text-white">{CANONICAL_ASSETS.communitiesServed}</span> communities
                <span className="mx-2 text-[#d97a59]">·</span>
                <span className="text-white">1</span> production facility
              </p>
            </div>
          </div>
        </div>
      </header>

      <section id="road" className="border-b border-[#e6dfd1] lg:h-[100svh] lg:min-h-[760px] lg:overflow-hidden">
        <div className="mx-auto flex h-full max-w-[1600px] flex-col px-6 py-10 md:px-10 lg:px-14 lg:py-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#c45c3e]">
                Seven stops
              </p>
              <h2 className="goods-pitch-display mt-3 max-w-3xl text-5xl leading-[0.98] md:text-6xl lg:text-[clamp(3.5rem,5.4vw,5.6rem)]">
                Seven stops before the model.
              </h2>
            </div>
            <p className="max-w-2xl text-base leading-7 text-[#6d675c] lg:justify-self-end">
              A bed carried inside. A question nobody had asked. A machine named in Warumungu.
              Follow the seven stops, then open the records behind them.
            </p>
          </div>

          <ol className="mt-7 grid gap-3 sm:grid-cols-2 lg:min-h-0 lg:flex-1 lg:grid-cols-4 lg:grid-rows-2">
            {resolvedRoadStops.map((stop, index) => (
              <li key={stop.id} className={index === 6 ? 'lg:col-span-2' : ''}>
                <a
                  href={`#${stop.id}`}
                  data-road-media-mirror={`${stop.id}.photo`}
                  className="group relative block h-full min-h-[300px] overflow-hidden bg-[#171714] text-white lg:min-h-0"
                >
                  <Image
                    src={stop.photo}
                    alt=""
                    fill
                    sizes={
                      index === 6
                        ? '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw'
                        : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'
                    }
                    className="object-cover opacity-80 transition duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/5 transition-colors group-hover:via-black/20" />
                  <span className="absolute inset-0 flex flex-col justify-between p-6">
                    <span className="goods-pitch-display text-5xl text-[#e88461]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#e88461]">
                        Chapter {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="goods-pitch-display mt-2 block max-w-lg text-3xl leading-tight md:text-4xl">
                        {roadTileChapters[stop.id]}
                      </span>
                      <span className="mt-3 block border-t border-white/35 pt-2 text-[10px] leading-4 tracking-[0.08em] text-white/75">
                        {roadTileNames[stop.id] ?? stop.place}
                      </span>
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {resolvedRoadStops.map((stop, index) => {
        const voice = resolveLeadVoice(stop);
        const imageFirst = index % 2 === 0;

        if (stop.id === 'stop-6-maningrida-and-the-farm') {
          const maningridaPhoto =
            durableMedia[`${stop.id}.maningrida-photo`] ??
            '/images/community/maningrida/kids-carrying-orange-bed.jpg';

          return (
            <section
              key={stop.id}
              id={stop.id}
              className="border-b border-[#d9d1c3] bg-[#fbf8f1] px-5 py-7 md:px-8 md:py-9 lg:h-[100svh] lg:min-h-[720px] lg:overflow-hidden lg:px-10"
            >
              <div className="mx-auto grid h-full max-w-[1700px] gap-5 lg:grid-rows-[auto_minmax(0,1fr)]">
                <header className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-end lg:gap-12">
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="goods-pitch-display text-6xl text-[#c45c3e]">{index + 1}</span>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c45c3e]">
                        Maningrida and the farm
                      </p>
                    </div>
                    <h2
                      data-road-text={`${stop.id}.headline`}
                      className="goods-pitch-display mt-3 max-w-4xl text-4xl leading-[0.98] md:text-5xl lg:text-[clamp(2.8rem,4vw,4.4rem)]"
                    >
                      {stop.headline}
                    </h2>
                  </div>
                  <p
                    data-road-text={`${stop.id}.body`}
                    className="max-w-2xl text-base leading-7 text-[#6d675c] lg:pb-1 lg:text-lg lg:leading-8"
                  >
                    {stop.body}
                  </p>
                </header>

                <div className="grid min-h-[580px] gap-3 sm:grid-cols-[0.72fr_1.28fr] lg:min-h-0">
                  <div
                    data-road-media={`${stop.id}.photo`}
                    className="relative min-h-[300px] overflow-hidden bg-[#24231f] lg:min-h-0"
                  >
                    <Image
                      src={stop.photo}
                      alt={stop.photoAlt}
                      fill
                      sizes="(max-width: 640px) 100vw, 36vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-20 text-white md:p-7">
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#e88461]">
                        01 · Make the parts
                      </p>
                      <p className="goods-pitch-display mt-2 text-3xl leading-tight">
                        Press. Route. Pack.
                      </p>
                      <p className="mt-2 text-xs leading-5 text-white/75">
                        The production facility at the farm
                      </p>
                    </div>
                  </div>

                  <div
                    data-road-media={`${stop.id}.maningrida-photo`}
                    className="relative min-h-[300px] overflow-hidden bg-[#24231f] lg:min-h-0"
                  >
                    <Image
                      src={maningridaPhoto}
                      alt="Young people carrying an assembled Stretch Bed in Maningrida"
                      fill
                      sizes="(max-width: 640px) 100vw, 64vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-24 text-white md:p-7">
                      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#e88461]">
                        02 · Build the beds
                      </p>
                      <p className="goods-pitch-display mt-2 max-w-3xl text-3xl leading-tight md:text-4xl">
                        Forty sets of parts became forty beds in Maningrida.
                      </p>
                      <p className="mt-3 text-xs leading-5 text-white/75">
                        Young people assembled the forty beds with community.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          );
        }

        return (
          <Fragment key={stop.id}>
          <section
            id={stop.id}
            className={`border-b border-[#e6dfd1] lg:h-[100svh] lg:min-h-[680px] lg:overflow-hidden ${
              index === 4 || index === 6 ? 'bg-[#22211e] text-[#fbf8f1]' : 'bg-[#fbf8f1]'
            }`}
          >
            <div className="mx-auto grid h-full min-h-[680px] max-w-[1600px] lg:grid-cols-2">
              <div
                data-road-media={stop.inlineVideo ? undefined : `${stop.id}.photo`}
                className={`relative min-h-[440px] lg:min-h-[760px] ${
                  imageFirst ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                {stop.inlineVideo ? (
                  <div className="absolute inset-0">
                    <MykelStoryMedia
                      mediaKey={stop.id}
                      coverSrc={durableMedia[`${stop.id}.photo`] ?? '/images/people/mykel.jpg'}
                      makingSrc={
                        durableMedia[`${stop.id}.making-photo`] ?? '/images/build/build-097.jpg'
                      }
                      videoSrc={stop.inlineVideo.src!}
                      videoPoster={stop.inlineVideo.poster!}
                      label={stop.inlineVideo.label!}
                      place={stop.place!}
                    />
                  </div>
                ) : (
                  <Image
                    src={stop.photo}
                    alt={stop.photoAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                )}
                <div
                  className={`pointer-events-none absolute inset-x-0 bottom-0 p-6 text-white md:p-9 ${
                    stop.inlineVideo
                      ? 'bg-transparent'
                      : 'bg-gradient-to-t from-black/75 to-transparent pt-20'
                  }`}
                >
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/65">
                    {stop.place}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center px-6 py-14 md:px-12 lg:px-16 ${
                  imageFirst ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <div className="w-full max-w-xl lg:max-h-[calc(100svh-5rem)]">
                  <div className="flex items-center gap-4">
                    <span className="goods-pitch-display text-6xl text-[#c45c3e]">{index + 1}</span>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#c45c3e]">
                      {stop.eyebrow.replace(/^Stop \d+ · /, '')}
                    </p>
                  </div>
                  <h2 data-road-text={`${stop.id}.headline`} className="goods-pitch-display mt-5 text-4xl leading-[1.02] md:text-5xl lg:text-[clamp(2.7rem,4.4vw,4.5rem)]">
                    {stop.headline}
                  </h2>
                  <p
                    data-road-text={`${stop.id}.body`}
                    className={`mt-5 text-base leading-7 lg:text-[clamp(1rem,1.25vw,1.2rem)] lg:leading-8 ${
                      index === 4 || index === 6 ? 'text-[#cfc8bc]' : 'text-[#6d675c]'
                    }`}
                  >
                    {stop.body}
                  </p>

                  {voice && !stop.inlineVideo && (
                    <figure className="mt-9 border-l-2 border-[#c45c3e] pl-5">
                      <blockquote className="goods-pitch-display text-2xl leading-snug md:text-3xl">
                        &quot;{voice.quote.text}&quot;
                      </blockquote>
                      <figcaption className="mt-5 flex items-center gap-3">
                        {voice.person.portrait && (
                          <Image
                            src={voice.person.portrait}
                            alt={`${voice.person.name}, ${voice.person.community}`}
                            width={96}
                            height={96}
                            className="h-11 w-11 shrink-0 rounded-full object-cover"
                          />
                        )}
                        <span
                          className={`text-sm leading-5 ${
                            index === 4 || index === 6 ? 'text-[#a8a196]' : 'text-[#7a7363]'
                          }`}
                        >
                          <span className="block font-semibold text-current">{voice.person.name}</span>
                          {voice.person.community && (
                            <span className="block text-xs opacity-80">{voice.person.community}</span>
                          )}
                        </span>
                      </figcaption>
                    </figure>
                  )}

                  {stop.id !== 'stop-5-utopia' && (
                    <div className="mt-6">
                      <ClaimChips slide={stop} dark={index === 4 || index === 6} />
                    </div>
                  )}

                  {stop.inlineVideo && (
                    <Link
                      href={stop.video?.href ?? '#'}
                      className="mt-6 flex items-center gap-4 border-y border-current/15 py-3"
                    >
                      <PlayCircle className="h-8 w-8 text-[#c45c3e]" aria-hidden="true" />
                      <span>
                        <span className="block text-sm font-semibold">{stop.inlineVideo.label}</span>
                        <span className="mt-1 block text-xs opacity-60">Open the field story and film</span>
                      </span>
                    </Link>
                  )}

                  <div className="mt-6">
                    <DeepLinks slide={stop} dark={index === 4 || index === 6} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {index === 3 && resolvedProductSlide && (
            <section
              id={resolvedProductSlide.id}
              className="border-b border-[#d9d1c3] bg-[#fbf8f1] px-6 py-8 md:min-h-screen md:px-10 md:py-10 lg:px-14"
            >
              <div className="mx-auto flex max-w-[1600px] flex-col justify-center md:min-h-[calc(100vh-5rem)]">
                <div className="grid gap-6 md:grid-cols-[0.82fr_1.18fr] md:items-end">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#c45c3e]">
                      {resolvedProductSlide.eyebrow}
                    </p>
                    <h2
                      data-road-text={`${resolvedProductSlide.id}.headline`}
                      className="goods-pitch-display mt-3 max-w-3xl text-4xl leading-[0.98] md:text-5xl lg:text-6xl"
                    >
                      {resolvedProductSlide.headline}
                    </h2>
                  </div>
                  <div>
                    <p
                      data-road-text={`${resolvedProductSlide.id}.body`}
                      className="max-w-2xl text-base leading-6 text-[#6d675c] lg:text-lg lg:leading-7"
                    >
                      {resolvedProductSlide.body}
                    </p>
                    <div className="mt-4">
                      <ClaimChips slide={resolvedProductSlide} />
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-[0.6fr_1.4fr]">
                  <div
                    data-road-media={`${resolvedProductSlide.id}.photo`}
                    className="relative aspect-[4/3] min-h-[320px] overflow-hidden border border-[#d9d1c3] bg-[#f1ece4] md:min-h-0"
                  >
                    <Image
                      src={resolvedProductSlide.photo}
                      alt={resolvedProductSlide.photoAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 39vw"
                      className="object-contain"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        number: '01',
                        label: 'Galvanised steel poles',
                        image: '/images/pitch/bed-poles.jpg',
                      },
                      {
                        number: '02',
                        label: 'Washable canvas',
                        image: '/images/pitch/bed-canvas.jpg',
                      },
                      {
                        number: '03',
                        label: 'Recycled-plastic X-frames',
                        image: '/images/pitch/bed-frame-legs.jpg',
                      },
                    ].map((component) => (
                      <div
                        key={component.label}
                        className="grid min-h-32 grid-rows-[1fr_auto] overflow-hidden border border-[#d9d1c3] bg-[#f1ece4]"
                      >
                        <div className="relative aspect-[3/2] min-h-24">
                          <Image
                            src={component.image}
                            alt={component.label}
                            fill
                            sizes="(max-width: 768px) 33vw, 23vw"
                            className="object-contain"
                          />
                        </div>
                        <div className="flex items-end gap-3 border-t border-[#d9d1c3] bg-[#fbf8f1] p-4">
                          <span className="goods-pitch-display text-3xl text-[#e88461] lg:text-4xl">
                            {component.number}
                          </span>
                          <span className="pb-1 text-xs font-semibold leading-4 text-[#2b2a26] lg:text-sm lg:leading-5">
                            {component.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid border-y border-[#d9d1c3] md:grid-cols-[0.72fr_1fr_1fr_1fr]">
                  <div className="py-3 md:pr-6">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#c45c3e]">
                      Moving the making
                    </p>
                    <p className="goods-pitch-display mt-1 text-xl">More of the value stays.</p>
                  </div>
                  {resolvedProductSlide.steps?.map((step, stepIndex) => (
                    <div
                      key={step}
                      className="border-t border-[#d9d1c3] py-3 md:border-l md:border-t-0 md:px-5"
                    >
                      <span className="font-mono text-[9px] text-[#c45c3e]">
                        {String(stepIndex + 1).padStart(2, '0')}
                      </span>
                      <p className="mt-1 text-xs font-semibold leading-4 lg:text-sm lg:leading-5">{step}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <DeepLinks slide={resolvedProductSlide} />
                </div>
              </div>
            </section>
          )}

          {index === 3 && finishedBedSlide && (
            <>
              <ZoomableBedImage
                src={finishedBedSlide.photo}
                alt={finishedBedSlide.photoAlt}
              />
            </>
          )}
          {index === 6 && <ProductionFacilityExperience />}
          </Fragment>
        );
      })}

      <section id="map" className="min-h-screen bg-[#171714] px-6 py-10 text-[#fbf8f1] md:px-10 md:py-12 lg:px-14">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-8 grid gap-5 sm:grid-cols-[0.9fr_1.1fr] sm:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d97a59]">
                Products and pathways
              </p>
              <h2 className="goods-pitch-display mt-3 max-w-3xl text-4xl leading-[1.02] md:text-5xl lg:text-6xl">
                Where products have travelled. Where making is being asked for.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[#b9b3a8] sm:justify-self-end lg:text-lg lg:leading-8">
              Start with the whole national extent. Select a place to see delivered products,
              cleared voices and whether a production pathway is open. A pathway is not consent
              or an order; the community still decides what happens next.
            </p>
          </div>
          <RoadPitchMap locations={communityLocations} />
        </div>
      </section>

      <section id="model" className="border-b border-[#d9d1c3] bg-[#f1ece4] px-6 py-12 md:px-10 lg:min-h-screen lg:px-14">
        <div className="mx-auto flex max-w-[1500px] flex-col justify-center lg:min-h-[calc(100vh-6rem)]">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            <div className="max-w-3xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#c45c3e]">
                {modelSlide?.eyebrow}
              </p>
              <h2 data-road-text="model.headline" className="goods-pitch-display mt-4 text-5xl leading-[1.02] md:text-6xl">
                {modelSlide?.headline}
              </h2>
              <p data-road-text="model.body" className="mt-7 text-lg leading-8 text-[#6d675c]">{modelSlide?.body}</p>
            </div>
            <ol className="grid gap-3 sm:grid-cols-2">
              {modelSlide?.steps?.map((step, index) => (
                <li
                  key={step}
                  className="group relative min-h-[230px] overflow-hidden bg-[#24231f] text-white lg:min-h-[290px]"
                >
                  <Image
                    src={principleImages[index]}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 35vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6">
                    <span className="font-mono text-[10px] tracking-[0.18em] text-[#e88461]">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="mt-2 max-w-sm text-lg font-semibold leading-7">{step}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section
        id="three-cost-centres"
        className="min-h-screen bg-[#171714] text-[#fbf8f1]"
      >
        <div className="mx-auto grid min-h-screen max-w-[1800px] lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[45vh] lg:min-h-screen">
            <Image
              src="/images/media-pack/community-testing-bed-golden-hour.jpg"
              alt="A Stretch Bed being tested in community"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
          </div>
          <div className="flex flex-col justify-center px-6 py-12 md:px-10 lg:px-14">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#e88461]">
              The raise
            </p>
            <h2 className="goods-pitch-display mt-5 text-5xl leading-[0.98] md:text-7xl">
              $400K signed. QBE can match it. $800K to do the work.
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#cfc8bc]">
              We are raising $400K in signed commitments. QBE can match eligible commitments
              dollar for dollar, creating an $800K program.
            </p>
            <div className="mt-9 grid grid-cols-2 border-y border-white/20">
              <div className="py-5 pr-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/55">
                  Signed today
                </p>
                <p className="goods-pitch-display mt-2 text-4xl text-[#e88461]">$0</p>
              </div>
              <div className="border-l border-white/20 py-5 pl-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/55">
                  Internal paper gate
                </p>
                <p className="goods-pitch-display mt-2 text-4xl">31 August</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="production-case"
        className="min-h-screen bg-[#fbf8f1] px-6 py-12 md:px-10 lg:px-14"
      >
        <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-[1500px] flex-col justify-center">
          <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#c45c3e]">
                What the $800K funds
              </p>
              <h2 className="goods-pitch-display mt-4 text-5xl leading-[1.01] md:text-6xl">
                Equipment. A measured run. Working capital. The first local pathway.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-[#6d675c] lg:justify-self-end">
              These are the current use-of-funds blocks. Working capital is still being sized and
              stays visibly open until the production run gives us the real number.
            </p>
          </div>
          <ol className="mt-9 grid border border-[#d9d1c3] bg-[#d9d1c3] sm:grid-cols-2 lg:grid-cols-5 lg:gap-px">
            {ASK_BLOCKS.map((block, index) => (
              <li
                key={block.name}
                className="flex min-h-[240px] flex-col bg-[#f1ece4] p-5"
              >
                <span className="goods-pitch-display text-3xl text-[#c45c3e]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-6 text-base font-semibold leading-6">{block.name}</h3>
                <p className="goods-pitch-display mt-2 text-2xl">{block.amount}</p>
                <p className="mt-auto pt-6 text-xs leading-5 text-[#6d675c]">
                  {block.fundsWhat.split('.')[0]}.
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="funding-impact"
        className="min-h-screen bg-[#171714] px-6 py-12 text-[#fbf8f1] md:px-10 lg:px-14"
      >
        <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-[1500px] flex-col justify-center">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#e88461]">
                What changes
              </p>
              <h2 className="goods-pitch-display mt-4 text-5xl leading-[1.01] md:text-6xl">
                The return is leverage, measured economics and a real pathway to local production.
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-8 text-[#b9b3a8] lg:justify-self-end">
              We can promise the work and the evidence. We cannot promise a financial return,
              completed ownership or a production rate before the measured run.
            </p>
          </div>
          <ol className="mt-9 grid gap-px border border-white/15 bg-white/15 sm:grid-cols-2">
            {fundingOutcomes.map((outcome) => (
              <li key={outcome.title} className="bg-[#22211e] p-6 lg:p-8">
                <div className="flex items-start justify-between gap-5">
                  <span className="goods-pitch-display text-3xl text-[#e88461]">{outcome.number}</span>
                  <span className="goods-pitch-display text-3xl">{outcome.value}</span>
                </div>
                <h3 className="mt-8 text-lg font-semibold">{outcome.title}</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/65">{outcome.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="min-h-screen bg-[#f1ece4] px-6 py-12 md:px-10 lg:px-14">
        <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-[1500px] flex-col justify-center">
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div className="max-w-3xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#c45c3e]">
                What comes back
            </p>
            <h2 className="goods-pitch-display mt-4 text-5xl leading-[1.02] md:text-6xl">
                Grant, repayable capital and orders do different jobs.
            </h2>
          </div>
            <p className="max-w-2xl text-lg leading-8 text-[#6d675c] lg:justify-self-end">
              The instrument determines the return. We should never describe a grant, a loan and
              a product order as though they are the same money.
            </p>
          </div>
          <ol className="mt-9 grid gap-3 md:grid-cols-3">
            {fundingReturns.map((item) => (
              <li key={item.title} className="border-t-2 border-[#c45c3e] bg-[#fbf8f1] p-6 lg:p-8">
                <span className="goods-pitch-display text-3xl text-[#c45c3e]">{item.number}</span>
                <h3 className="goods-pitch-display mt-7 text-3xl">{item.title}</h3>
                <p className="mt-4 text-base font-semibold">{item.return}</p>
                <p className="mt-3 text-sm leading-6 text-[#6d675c]">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="decision"
        className="min-h-screen bg-[#171714] px-6 py-16 text-[#fbf8f1] md:px-10 lg:px-14"
      >
        <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-[1500px] gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#e88461]">
              The ask
            </p>
            <h2 className="goods-pitch-display mt-5 max-w-4xl text-5xl leading-[0.98] md:text-7xl">
              Help us close $400K in signed commitments.
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#cfc8bc]">
              A signed commitment can be a grant or repayable capital. It states the amount,
              instrument, funder legal name and a contact who can verify it.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="bg-[#c45c3e] px-6 py-3 text-sm font-semibold text-white hover:bg-[#d26a4a]"
              >
                Start the conversation
              </Link>
              <Link
                href="/cost-story"
                className="border border-white/30 px-6 py-3 text-sm font-semibold hover:border-white"
              >
                Inspect the economics
              </Link>
            </div>
          </div>
          <div className="border-y border-white/20">
            <div className="py-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/55">
                Target
              </p>
              <p className="goods-pitch-display mt-2 text-5xl">$400K signed</p>
            </div>
            <div className="border-t border-white/20 py-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/55">
                Match
              </p>
              <p className="goods-pitch-display mt-2 text-5xl">Up to $400K from QBE</p>
            </div>
            <div className="border-t border-white/20 py-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/55">
                Status
              </p>
              <p className="goods-pitch-display mt-2 text-5xl text-[#e88461]">$0 signed today</p>
            </div>
            <p className="border-t border-white/20 py-5 text-sm leading-6 text-white/60">
              {ASK_HEADLINE.ifShort}
            </p>
          </div>
        </div>
      </section>

      <footer data-road-media="closing.photo" className="relative min-h-[620px] overflow-hidden bg-[#171714] text-white">
        <Image
          src={closingSlide?.photo ?? '/images/media-pack/lying-on-stretch-bed.jpg'}
          alt={closingSlide?.photoAlt ?? ''}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#171714]/70" />
        <div className="relative mx-auto flex min-h-[620px] max-w-[1500px] items-end px-6 py-16 md:px-10 lg:px-14">
          <div className="max-w-4xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d97a59]">
              {closingSlide?.eyebrow}
            </p>
            <h2 data-road-text="closing.headline" className="goods-pitch-display mt-5 text-5xl leading-[1.01] md:text-7xl">
              {closingSlide?.headline}
            </h2>
            <p data-road-text="closing.body" className="mt-7 max-w-2xl text-lg leading-8 text-white/75">
              {closingSlide?.body}
            </p>
          </div>
        </div>
      </footer>
      <RoadPitchEditor />
    </article>
  );
}
