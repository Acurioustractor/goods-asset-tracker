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
import { ASK_HEADLINE } from '@/lib/data/ask-surface';
import { STAGE_RULE } from '@/lib/data/pathway-stages';
import { NORTH_STAR } from '@/lib/data/content';
import {
  ASK_BELIEVABILITY,
  ASK_INTRO,
  ASK_NEXT_STEP,
  ASK_STATUS_ROWS,
  BED_LADDER,
  BUY_LIST_TOTAL,
  CHAIN_HONESTY,
  CHAIN_INTRO,
  CLOSING_TAIL,
  DOORS,
  DOORS_NOTE,
  FIRST_SITE_RULE,
  LEG_RATIO,
  PATHWAY_ASKS,
  SITE_BASE,
  SITE_OPERATING,
  STOPWATCH_COMMITMENT,
  THE_BUY_LIST,
  THE_CHAIN,
  THE_RUNNING_COST,
  THE_TRADING,
  VOICE_FOUR_ASKS,
  VOICE_ONE_BED,
  VOICE_THE_LETTER,
  type EndingVoice,
} from '@/lib/data/road-ending';
import { LetterLines } from './letter-lines';

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

const principleImages = [
  '/images/people/linda-turner.jpg',
  '/images/process/heat-press-full.jpg',
  '/images/build/build-025.jpg',
  '/images/community/alice-springs/oonchiumpa-team-red-bed.jpg',
] as const;

/** A cleared voice, rendered the same way in every ending section. Portrait only
 *  when the registry actually holds one: the guard test asserts we never invent
 *  a face for a voice-only storyteller. */
function EndingVoiceBlock({
  voice,
  dark = false,
  className = '',
}: {
  voice: EndingVoice;
  dark?: boolean;
  className?: string;
}) {
  return (
    <figure className={`grid gap-6 ${voice.portrait ? 'sm:grid-cols-[auto_1fr] sm:items-center' : ''} ${className}`}>
      {voice.portrait && (
        <Image
          src={voice.portrait}
          alt={voice.attribution}
          width={280}
          height={280}
          className="h-24 w-24 shrink-0 rounded-full object-cover sm:h-32 sm:w-32"
        />
      )}
      <div className={voice.portrait ? '' : 'border-l-2 border-[#c45c3e] pl-5'}>
        <blockquote className="goods-pitch-display text-2xl leading-snug md:text-3xl">
          &quot;{voice.text}&quot;
        </blockquote>
        <figcaption
          className={`mt-4 text-sm leading-5 ${dark ? 'text-[#a8a196]' : 'text-[#7a7363]'}`}
        >
          {voice.attribution}
        </figcaption>
      </div>
    </figure>
  );
}

/** The status label that sits beside a money figure. The section this replaced
 *  rendered five money figures with no label at all, on a page whose whole
 *  discipline is that every figure carries its status. */
function StatusChip({ label, dark = false }: { label: string; dark?: boolean }) {
  return (
    <span
      className={`font-mono text-[9px] uppercase tracking-[0.16em] ${
        dark ? 'text-[#a8a196]' : 'text-[#7a7363]'
      }`}
    >
      {label}
    </span>
  );
}

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
              <a href="#the-chain" className="hover:text-white">What it costs</a>
              <a href="#one-bed" className="hover:text-white">The money</a>
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

      <section id="one-bed" className="border-b border-[#d9d1c3] bg-[#fbf8f1] px-6 py-14 md:px-10 lg:px-14 lg:py-20">
        <div className="mx-auto max-w-[1600px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#c45c3e]">
            One bed, plainly
          </p>

          <EndingVoiceBlock voice={VOICE_ONE_BED} className="mt-8 max-w-4xl" />

          <div className="mt-12 grid gap-8 border-t border-[#d9d1c3] pt-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div>
              <h2 className="goods-pitch-display text-5xl leading-[0.98] md:text-6xl">
                Sixty five dollars does not buy a shredder.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#6d675c]">
                Jimmy is describing what the bed has to survive. So it is built to last and it is
                priced to last. Every bed sells for $750. Making it and getting it on a truck costs
                about $685 today, because we buy the legs finished. About $65 stays with Goods.
                Press the legs ourselves and the same bed costs about $426, and about $324 stays.
                Same bed, same price, same community. One part changes.
              </p>
            </div>

            <ol className="grid gap-px border border-[#d9d1c3] bg-[#d9d1c3] sm:grid-cols-2">
              {BED_LADDER.map((column) => (
                <li key={column.column} className="flex flex-col bg-[#f1ece4] p-6 lg:p-8">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#c45c3e]">
                    {column.column}
                  </p>
                  <dl className="mt-6 space-y-6">
                    {column.rows.map((row) => (
                      <div key={row.line}>
                        <dt className="goods-pitch-display text-4xl lg:text-5xl">{row.figure}</dt>
                        <dd className="mt-2 text-sm leading-5 text-[#6d675c]">{row.line}</dd>
                        <dd className="mt-1">
                          <StatusChip label={row.label} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-auto border-t border-[#d9d1c3] pt-5 text-xs leading-5 text-[#7a7363]">
                    {column.foot}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-12 grid gap-8 border-t border-[#d9d1c3] pt-10 md:grid-cols-3 lg:gap-12">
            <p className="text-base leading-7 text-[#2b2a26] md:text-lg md:leading-8">
              {LEG_RATIO.copy}
            </p>
            <p className="text-base leading-7 text-[#6d675c] md:text-lg md:leading-8">
              {THE_RUNNING_COST.copy}
            </p>
            <p className="text-base leading-7 text-[#6d675c] md:text-lg md:leading-8">
              {THE_TRADING.copy}
            </p>
          </div>
        </div>
      </section>

      <section id="the-stopwatch" className="bg-[#171714] text-[#fbf8f1]">
        <div className="mx-auto grid max-w-[1800px] lg:grid-cols-[0.85fr_1.15fr]">
          <div className="relative min-h-[45vh] lg:min-h-screen">
            <Image
              src="/images/process/heat-press-full.jpg"
              alt="The heat press at the production facility at the farm"
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20 md:p-9">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#e88461]">
                The press at the farm
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center px-6 py-14 md:px-10 lg:px-14 lg:py-20">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#e88461]">
              What the money does first
            </p>
            <h2 className="goods-pitch-display mt-5 max-w-3xl text-5xl leading-[0.98] md:text-6xl">
              The first thing the money buys is a stopwatch.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#cfc8bc]">
              Forty Stretch Beds for Maningrida were pressed end to end at our own facility at the
              farm, then assembled in community by young people. So the making is proven. What we
              have never done is time it and cost it across a full run at a steady rate. Fifty beds,
              pressed at production rate and costed with receipts, is the first thing on the list.
            </p>

            <div className="mt-8 border-l-2 border-[#c45c3e] pl-5">
              <p className="goods-pitch-display text-2xl leading-snug md:text-3xl">
                $426 is modelled from verified part prices; the first thing your money buys is the
                fifty beds that test it.
              </p>
              <p className="mt-4 text-base leading-7 text-[#e88461]">{STOPWATCH_COMMITMENT}</p>
            </div>

            <ol className="mt-10 divide-y divide-white/15 border-y border-white/20">
              {THE_BUY_LIST.map((row) => (
                <li key={row.n} className="grid gap-2 py-5 sm:grid-cols-[auto_1fr_auto] sm:items-baseline sm:gap-6">
                  <span className="font-mono text-[10px] text-[#e88461]">{row.n}</span>
                  <span>
                    <span className="block text-base font-semibold">{row.name}</span>
                    <span className="mt-1 block max-w-xl text-sm leading-5 text-white/60">
                      {row.sentence}
                    </span>
                  </span>
                  <span className="sm:text-right">
                    {row.amount ? (
                      <>
                        <span className="goods-pitch-display block text-2xl">{row.amount}</span>
                        <StatusChip label={row.label ?? ''} dark />
                      </>
                    ) : (
                      <span className="inline-block border border-dashed border-white/35 px-6 py-2 text-xs uppercase tracking-[0.14em] text-white/45">
                        not yet sized
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ol>

            <p className="mt-6 max-w-2xl text-sm leading-6 text-[#a8a196]">
              The lines we can size add to between ${BUY_LIST_TOTAL.low.toLocaleString('en-AU')} and
              ${BUY_LIST_TOTAL.high.toLocaleString('en-AU')}, plus the one we cannot.
            </p>
          </div>
        </div>
      </section>

      <section id="the-chain" className="border-b border-[#d9d1c3] bg-[#fbf8f1] px-6 py-14 md:px-10 lg:px-14 lg:py-20">
        <div className="mx-auto max-w-[1600px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#c45c3e]">
            {CHAIN_INTRO.eyebrow}
          </p>
          <div className="mt-8 grid gap-8 border-t border-[#d9d1c3] pt-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
            <h2 className="goods-pitch-display text-5xl leading-[0.99] md:text-6xl">
              {CHAIN_INTRO.headline}
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-[#6d675c]">{CHAIN_INTRO.body}</p>
          </div>

          <ol className="mt-12 grid gap-px border-y border-[#d9d1c3] bg-[#d9d1c3] sm:grid-cols-2 lg:grid-cols-5">
            {THE_CHAIN.map((step) => (
              <li key={step.n} className="flex flex-col bg-[#fbf8f1] p-6">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#7a7363]">
                  Needs
                </p>
                <p className="mt-1 font-mono text-[11px] leading-4 text-[#c45c3e]">{step.needs}</p>

                <div className="mt-5 border-t-[3px] border-[#c45c3e] pt-4">
                  <span className="goods-pitch-display text-3xl text-[#c45c3e]">{step.n}</span>
                  <h3 className="mt-3 text-base font-semibold leading-5">{step.label}</h3>
                  <p className="goods-pitch-display mt-3 text-2xl">{step.amount}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2">
                    <StatusChip label={step.label_status} />
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#a8a196]">
                      {step.grade}
                    </span>
                  </p>
                  <p className="mt-4 text-xs leading-5 text-[#6d675c]">{step.sentence}</p>
                </div>

                <p className="mt-auto border-t border-[#d9d1c3] pt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-[#7a7363]">
                  Makes
                </p>
                <p className="mt-1 font-mono text-[11px] leading-4 text-[#c45c3e]">
                  {step.produces}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12 grid gap-10 border-t border-[#d9d1c3] pt-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#c45c3e]">
                Underneath all five
              </p>
              <div className="mt-4 flex flex-wrap items-baseline gap-4">
                <h3 className="goods-pitch-display text-4xl">{SITE_BASE.label}</h3>
                <span className="goods-pitch-display text-3xl text-[#c45c3e]">
                  {SITE_BASE.amount}
                </span>
                <StatusChip label={SITE_BASE.label_status} />
              </div>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#6d675c]">
                {SITE_BASE.sentence}
              </p>
              <dl className="mt-6 divide-y divide-[#d9d1c3] border-y border-[#d9d1c3]">
                {SITE_BASE.lines.map((line) => (
                  <div key={line.item} className="flex items-baseline justify-between gap-4 py-2.5">
                    <dt className="text-sm leading-5">{line.item}</dt>
                    <dd className="shrink-0 text-right">
                      <span className="text-sm">{line.amount}</span>
                      <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#a8a196]">
                        {line.grade}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#c45c3e]">
                What it costs to run, each year
              </p>
              <div className="mt-4 grid grid-cols-3 gap-4 border-y border-[#d9d1c3] py-5">
                {[
                  { v: SITE_OPERATING.floorAmount, l: 'The site floor' },
                  { v: SITE_OPERATING.poolAmount, l: 'All five steps' },
                  { v: SITE_OPERATING.totalAmount, l: 'Together' },
                ].map((cell) => (
                  <div key={cell.l}>
                    <p className="goods-pitch-display text-2xl lg:text-3xl">{cell.v}</p>
                    <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[#7a7363]">
                      {cell.l}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-base leading-7 text-[#6d675c]">
                {SITE_OPERATING.floorSentence}
              </p>
              <p className="mt-4 text-base leading-7 text-[#6d675c]">
                {SITE_OPERATING.poolSentence}
              </p>
              <p className="mt-4 text-base leading-7 text-[#2b2a26]">
                {SITE_OPERATING.reconciliationSentence}
              </p>
            </div>
          </div>

          <p className="mt-10 max-w-4xl border-t border-[#d9d1c3] pt-8 text-sm leading-6 text-[#7a7363]">
            {CHAIN_HONESTY}
          </p>
        </div>
      </section>
      <section id="four-asks" className="border-b border-[#d9d1c3] bg-[#f1ece4]">
        <div className="mx-auto max-w-[1600px] px-6 py-14 md:px-10 lg:px-14 lg:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#c45c3e]">
            Where they are, in what they asked for
          </p>
          <EndingVoiceBlock voice={VOICE_FOUR_ASKS} className="mt-8 max-w-4xl" />
          <div className="mt-12 grid gap-8 border-t border-[#d9d1c3] pt-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
            <h2 className="goods-pitch-display text-5xl leading-[0.99] md:text-6xl">
              Four communities asked for four different things.
            </h2>
            <p className="max-w-2xl text-lg leading-8 text-[#6d675c]">
              Nobody gets sold a facility. A community says what it would want to own first, we
              price that, at that size, and where a partner already has the shed or the power we
              take those lines out instead of assuming them. Each of these has a number against it
              in our own planning. None of those numbers has gone to the community it belongs to,
              so none of them is on this page. None of these four is an order, and none is signed.
            </p>
          </div>
        </div>

        {PATHWAY_ASKS.map((ask) => {
          const dark = ask.ground === 'dark';
          const ground =
            ask.ground === 'dark'
              ? 'bg-[#22211e] text-[#fbf8f1]'
              : ask.ground === 'warm'
                ? 'bg-[#e9e1d2]'
                : 'bg-[#fbf8f1]';
          return (
            <div key={ask.id} className={`border-t border-[#d9d1c3] ${ground}`}>
              <div className="mx-auto grid max-w-[1600px] gap-6 px-6 py-12 md:px-10 lg:grid-cols-[0.5fr_1.5fr] lg:gap-14 lg:px-14 lg:py-16">
                <div>
                  <h3 className="goods-pitch-display text-4xl leading-none md:text-5xl">
                    {ask.place}
                  </h3>
                  <p
                    className={`mt-3 font-mono text-[10px] uppercase tracking-[0.16em] ${
                      dark ? 'text-[#a8a196]' : 'text-[#7a7363]'
                    }`}
                  >
                    {ask.country}
                  </p>
                  <p className="goods-pitch-display mt-6 text-2xl text-[#c45c3e]">{ask.size}</p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:gap-10">
                  <div>
                    <p
                      className={`font-mono text-[9px] uppercase tracking-[0.16em] ${
                        dark ? 'text-[#a8a196]' : 'text-[#7a7363]'
                      }`}
                    >
                      {ask.field}
                    </p>
                    <p className="mt-3 text-base leading-7 lg:text-lg lg:leading-8">{ask.body}</p>
                  </div>
                  <div>
                    <p
                      className={`font-mono text-[9px] uppercase tracking-[0.16em] ${
                        dark ? 'text-[#a8a196]' : 'text-[#7a7363]'
                      }`}
                    >
                      What we can say about the money
                    </p>
                    <p
                      className={`mt-3 text-base leading-7 ${
                        dark ? 'text-[#cfc8bc]' : 'text-[#6d675c]'
                      }`}
                    >
                      {ask.whatWeCanSay}
                    </p>
                    <p
                      className={`mt-5 border-t pt-4 text-xs leading-5 ${
                        dark
                          ? 'border-white/20 text-[#a8a196]'
                          : 'border-[#d9d1c3] text-[#7a7363]'
                      }`}
                    >
                      Whose call: {ask.whoseCall}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="border-t border-[#d9d1c3] bg-[#f1ece4]">
          <div className="mx-auto max-w-[1600px] px-6 py-12 md:px-10 lg:px-14">
            <p className="max-w-4xl text-lg leading-8 text-[#2b2a26]">{STAGE_RULE}</p>
            <p className="mt-4 max-w-4xl text-base leading-7 text-[#6d675c]">{FIRST_SITE_RULE}</p>
          </div>
        </div>
      </section>

      <section id="the-letter" className="bg-[#171714] px-6 py-16 text-[#fbf8f1] md:px-10 lg:px-14 lg:py-20">
        <div className="mx-auto max-w-[1600px]">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#e88461]">
            The ask
          </p>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
            <div>
              <EndingVoiceBlock voice={VOICE_THE_LETTER} dark className="max-w-2xl" />
              <h2 className="goods-pitch-display mt-10 max-w-3xl text-5xl leading-[0.98] md:text-6xl">
                {ASK_INTRO.headline}
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#cfc8bc]">{ASK_INTRO.body}</p>
              <div className="mt-9">
                <LetterLines />
              </div>
            </div>

            <div>
              <p className="goods-pitch-display text-3xl leading-tight md:text-4xl">
                {ASK_HEADLINE.line}
              </p>
              <div className="mt-9 border-y border-white/20">
                {ASK_STATUS_ROWS.map((row) => (
                  <div key={row.label} className="border-t border-white/20 py-7 first:border-t-0">
                    <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/55">
                      {row.label}
                    </p>
                    <p
                      className={
                        row.value === '$0'
                          ? 'goods-pitch-display mt-2 text-6xl text-[#e88461]'
                          : 'goods-pitch-display mt-2 text-3xl'
                      }
                    >
                      {row.value}
                    </p>
                    {row.supporting && (
                      <p className="mt-3 text-sm leading-6 text-white/60">{row.supporting}</p>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-7 text-base leading-7 text-white/70">{ASK_BELIEVABILITY}</p>
            </div>
          </div>

          <ol className="mt-14 grid gap-3 border-t border-white/20 pt-10 md:grid-cols-3">
            {DOORS.map((door) => (
              <li key={door.verb} className="border-t-2 border-[#c45c3e] bg-[#22211e] p-6 lg:p-8">
                <h3 className="goods-pitch-display text-3xl">{door.verb}</h3>
                <p className="mt-3 text-sm font-semibold leading-5 text-[#e88461]">{door.entity}</p>
                <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.16em] text-white/45">
                  What it pays for
                </p>
                <p className="mt-2 text-sm leading-6 text-white/75">{door.does}</p>
                <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/45">
                  What comes back
                </p>
                <p className="mt-2 text-sm leading-6 text-white/75">{door.returns}</p>
                <p className="mt-5 border-t border-white/15 pt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-white/50">
                  {door.match}
                </p>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-3xl text-sm leading-6 text-white/55">{DOORS_NOTE}</p>

          <div className="mt-12 grid gap-8 border-t border-white/20 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <p className="max-w-2xl text-lg leading-8">{ASK_NEXT_STEP.sentence}</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={ASK_NEXT_STEP.primary.href}
                className="bg-[#c45c3e] px-6 py-3 text-sm font-semibold text-white hover:bg-[#d26a4a]"
              >
                {ASK_NEXT_STEP.primary.label}
              </Link>
              <Link
                href={ASK_NEXT_STEP.secondary.href}
                className="border border-white/30 px-6 py-3 text-sm font-semibold hover:border-white"
              >
                {ASK_NEXT_STEP.secondary.label}
              </Link>
              <Link
                href={ASK_NEXT_STEP.tertiary.href}
                className="border-b border-[#d97a59] pb-1 text-sm text-white/70 hover:text-white"
              >
                {ASK_NEXT_STEP.tertiary.label}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer data-road-media="closing.photo" className="relative min-h-screen overflow-hidden bg-[#171714] text-white">
        <Image
          src={closingSlide?.photo ?? '/images/media-pack/lying-on-stretch-bed.jpg'}
          alt={closingSlide?.photoAlt ?? ''}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#171714] via-[#171714]/55 to-transparent" />
        <div className="relative mx-auto flex min-h-screen max-w-[1500px] items-end px-6 py-16 md:px-10 lg:px-14">
          <div className="max-w-4xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d97a59]">
              The promise
            </p>
            <h2 data-road-text="closing.headline" className="goods-pitch-display mt-5 text-5xl leading-[1.01] md:text-7xl">
              {NORTH_STAR.headline}
            </h2>
            <p data-road-text="closing.body" className="mt-7 max-w-3xl text-xl leading-9 text-white/80 md:text-2xl">
              {NORTH_STAR.line}
            </p>
            <p className="mt-10 border-t border-white/25 pt-6 text-lg leading-8 text-[#e88461]">
              {CLOSING_TAIL}
            </p>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
              Updated {deckUpdated} · every figure on this page carries its status at /register
            </p>
          </div>
        </div>
      </footer>
      <RoadPitchEditor />
    </article>
  );
}
