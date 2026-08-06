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
import { PitchChrome } from './pitch-chrome';
import { ZoomableBedImage } from './zoomable-bed-image';
import { ProductionFacilityExperience } from './production-facility-experience';
import { MykelStoryMedia } from './mykel-story-media';
import { getStoryOverrides } from '@/lib/field-notes/overrides';
import { ASK_HEADLINE } from '@/lib/data/ask-surface';
import { STAGE_RULE } from '@/lib/data/pathway-stages';
import { NORTH_STAR } from '@/lib/data/content';
import {
  ASK_INTRO,
  ASK_NEXT_STEP,
  ASK_STATUS_ROWS,
  CLOSING_TAIL,
  DOORS,
  FIRST_SITE_RULE,
  PATHWAY_ASKS,
  VOICE_FOUR_ASKS,
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
      <div className={voice.portrait ? '' : 'border-l-2 border-goods-terracotta pl-5'}>
        {/* Quotes render verbatim (they are consent-cleared as approved wordings, never trimmed);
            the compression is typographic, so a long quote no longer costs most of a screen
            before the section's argument starts. */}
        <blockquote className="goods-pitch-display max-w-3xl text-xl leading-snug md:text-2xl">
          &quot;{voice.text}&quot;
        </blockquote>
        <figcaption
          className={`mt-4 text-sm leading-5 ${dark ? 'text-[#a8a196]' : 'text-goods-sub'}`}
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
        dark ? 'text-[#a8a196]' : 'text-goods-sub'
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
          ? 'divide-y divide-goods-cream-muted/20 border-goods-cream-muted/20 sm:divide-x sm:divide-y-0'
          : 'divide-y divide-goods-ink/20 border-goods-ink/20 sm:divide-x sm:divide-y-0'
      } sm:grid-flow-col sm:auto-cols-fr`}
    >
      {slide.chips.map((chip) => (
        <div key={`${chip.label}-${chip.value}`} className="py-3 sm:px-4 sm:first:pl-0 sm:last:pr-0">
          <dt
            className={`font-mono text-[9px] uppercase tracking-[0.16em] ${
              dark ? 'text-[#a8a196]' : 'text-goods-sub'
            }`}
          >
            {chip.label}
          </dt>
          <dd className={`mt-1 text-sm leading-5 ${dark ? 'text-goods-cream-muted' : 'text-goods-ink'}`}>
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
              ? 'border-[#d97a59] text-goods-cream hover:text-[#d97a59]'
              : 'border-goods-terracotta text-goods-ink hover:text-goods-terracotta'
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
    <article className="road-pitch-scroll overflow-x-hidden bg-goods-cream text-goods-ink">
      {/* Chrome (the opener + the bar) sits ABOVE the cover since 2026-08-06: "If you read
          nothing else" is the skim spine's first rung, so it must be the first thing a skimming
          funder meets, not screen two. */}
      <PitchChrome />

      <header id="cover" data-pitch-panel="cover" className="relative min-h-screen overflow-hidden bg-[#171714] text-goods-cream">
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
                  className="bg-goods-terracotta px-6 py-3 text-sm font-semibold text-white hover:bg-[#d26a4a]"
                >
                  Walk the road
                </a>
                {/* Opens the five-line summary overlay; PitchChrome owns the state and listens
                    for this attribute so the cover can stay server-rendered. */}
                <button
                  type="button"
                  data-opener-trigger
                  className="border border-[#e88461]/60 px-6 py-3 text-sm font-semibold text-[#e88461] hover:border-[#e88461]"
                >
                  Read this first
                </button>
                <a
                  href="?view=slides"
                  className="border border-white/35 px-6 py-3 text-sm font-semibold text-white hover:border-white"
                >
                  Present as slides
                </a>
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

      <section id="road" data-pitch-panel="road" className="border-b border-goods-grid lg:h-[100svh] lg:min-h-[760px] lg:overflow-hidden">
        <div className="mx-auto flex h-full max-w-[1600px] flex-col px-6 py-10 md:px-10 lg:px-14 lg:py-8">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-goods-terracotta">
                Seven stops
              </p>
              <h2 className="goods-pitch-display mt-3 max-w-3xl text-5xl leading-[0.98] md:text-6xl lg:text-[clamp(3.5rem,5.4vw,5.6rem)]">
                Seven places changed what Goods is.
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
              data-pitch-panel={stop.id}
              className="border-b border-[#d9d1c3] bg-goods-cream px-5 py-7 md:px-8 md:py-9 lg:h-[100svh] lg:min-h-[720px] lg:overflow-hidden lg:px-10"
            >
              <div className="mx-auto grid h-full max-w-[1700px] gap-5 lg:grid-rows-[auto_minmax(0,1fr)]">
                <header className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-end lg:gap-12">
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="goods-pitch-display text-6xl text-goods-terracotta">{index + 1}</span>
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-goods-terracotta">
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
            data-pitch-panel={stop.id}
            className={`border-b border-goods-grid lg:h-[100svh] lg:min-h-[680px] lg:overflow-hidden ${
              index === 4 || index === 6 ? 'bg-[#22211e] text-goods-cream' : 'bg-goods-cream'
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
                    <span className="goods-pitch-display text-6xl text-goods-terracotta">{index + 1}</span>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-goods-terracotta">
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
                    <figure className="mt-9 border-l-2 border-goods-terracotta pl-5">
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
                            index === 4 || index === 6 ? 'text-[#a8a196]' : 'text-goods-sub'
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
                      <PlayCircle className="h-8 w-8 text-goods-terracotta" aria-hidden="true" />
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
              data-pitch-panel={resolvedProductSlide.id}
              className="border-b border-[#d9d1c3] bg-goods-cream px-6 py-8 md:min-h-screen md:px-10 md:py-10 lg:px-14"
            >
              <div className="mx-auto flex max-w-[1600px] flex-col justify-center md:min-h-[calc(100vh-5rem)]">
                <div className="grid gap-6 md:grid-cols-[0.82fr_1.18fr] md:items-end">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-goods-terracotta">
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
                    className="relative aspect-[4/3] min-h-[320px] overflow-hidden border border-[#d9d1c3] bg-goods-cream-muted md:min-h-0"
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
                        className="grid min-h-32 grid-rows-[1fr_auto] overflow-hidden border border-[#d9d1c3] bg-goods-cream-muted"
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
                        <div className="flex items-end gap-3 border-t border-[#d9d1c3] bg-goods-cream p-4">
                          <span className="goods-pitch-display text-3xl text-[#e88461] lg:text-4xl">
                            {component.number}
                          </span>
                          <span className="pb-1 text-xs font-semibold leading-4 text-goods-ink lg:text-sm lg:leading-5">
                            {component.label}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid border-y border-[#d9d1c3] md:grid-cols-[0.72fr_1fr_1fr_1fr]">
                  <div className="py-3 md:pr-6">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-goods-terracotta">
                      Moving the making
                    </p>
                    <p className="goods-pitch-display mt-1 text-xl">More of the value stays.</p>
                  </div>
                  {resolvedProductSlide.steps?.map((step, stepIndex) => (
                    <div
                      key={step}
                      className="border-t border-[#d9d1c3] py-3 md:border-l md:border-t-0 md:px-5"
                    >
                      <span className="font-mono text-[9px] text-goods-terracotta">
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
            <div id="bed-in-detail" data-pitch-panel="bed-in-detail">
              <ZoomableBedImage
                src={finishedBedSlide.photo}
                alt={finishedBedSlide.photoAlt}
              />
            </div>
          )}
          {index === 6 && (
            <div id="the-farm" data-pitch-panel="the-farm">
              <ProductionFacilityExperience />
            </div>
          )}
          </Fragment>
        );
      })}

      <section id="map" data-pitch-panel="map" className="min-h-screen bg-[#171714] px-6 py-10 text-goods-cream md:px-10 md:py-12 lg:px-14">
        <div className="mx-auto max-w-[1500px]">
          <div className="mb-8 grid gap-5 sm:grid-cols-[0.9fr_1.1fr] sm:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d97a59]">
                Products and pathways
              </p>
              <h2 className="goods-pitch-display mt-3 max-w-3xl text-4xl leading-[1.02] md:text-5xl lg:text-6xl">
                The products went everywhere. The making is asked for in four places.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-[#b9b3a8] sm:justify-self-end lg:text-lg lg:leading-8">
              Start with the whole national extent. Select a place to see delivered products,
              cleared voices and whether a production pathway is open.
            </p>
          </div>
          <RoadPitchMap locations={communityLocations} />
        </div>
      </section>

      {/* Money at a glance (Ben, 2026-08-06): investors read a term-sheet strip, not
          paragraphs. Five numbers with their honesty grade; every panel after this is
          evidence for one of them. Figures render from canon/ask-surface imports only. */}
      <section id="money-at-a-glance" data-pitch-panel="money-at-a-glance" className="border-b border-[#d9d1c3] bg-[#171714] px-6 py-14 text-goods-cream md:px-10 lg:min-h-[70svh] lg:px-14 lg:py-20">
        <div className="mx-auto flex h-full max-w-[1600px] flex-col justify-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#e88461]">
            The money, in five numbers
          </p>
          <dl className="mt-8 grid gap-px border border-white/20 bg-white/20 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { v: '$750', l: 'A bed sells for', chip: 'verified' },
              { v: '~$685', l: 'Costs to make + truck today', chip: 'verified' },
              { v: '~$426', l: 'Pressing our own legs', chip: 'modelled' },
              { v: '$400K', l: 'The raise, signed by 31 Aug', chip: 'target' },
              { v: '$0', l: 'Signed today', chip: 'verified' },
            ].map((cell) => (
              <div key={cell.l} className="bg-[#171714] p-6 lg:p-8">
                <dd className={`goods-pitch-display text-5xl lg:text-6xl ${cell.v === '$0' ? 'text-[#e88461]' : ''}`}>
                  {cell.v}
                </dd>
                <dt className="mt-3 text-sm leading-5 text-white/70">{cell.l}</dt>
                <div className="mt-3">
                  <StatusChip label={cell.chip} dark />
                </div>
              </div>
            ))}
          </dl>
          <p className="mt-6 max-w-3xl text-sm leading-6 text-white/55">
            Everything below this line is evidence for one of these five. Every figure carries its
            status at <Link href="/register" className="underline decoration-goods-terracotta underline-offset-2">/register</Link>.
          </p>
        </div>
      </section>

      {/* The facility, simply (Ben, 2026-08-06): the plain-English overview of what the
          production facility costs to stand up and run, and the three ways in. Ranges match
          ask-surface/road-ending; the per-site annual figure is deliberately NOT printed here
          because it is an open decision (GOC-site-cost-decision.md). */}
      <section id="the-facility" data-pitch-panel="the-facility" className="border-b border-[#d9d1c3] bg-goods-cream-muted px-6 py-14 md:px-10 lg:min-h-[80svh] lg:px-14 lg:py-20">
        <div className="mx-auto flex h-full max-w-[1600px] flex-col justify-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-goods-terracotta">
            The facility, simply
          </p>
          <h2 className="goods-pitch-display mt-4 max-w-4xl text-4xl leading-[1.02] md:text-5xl">
            The money stands up a production line, proves its numbers, and keeps the lights on
            while beds start paying.
          </h2>
          <div className="mt-10 grid gap-px border border-[#d9d1c3] bg-[#d9d1c3] md:grid-cols-3">
            {[
              {
                step: '01 · Stand it up',
                amount: '$112K to $222K',
                chip: 'modelled',
                line: 'Shredder, press, cutter, container, power. We have already put $110,046 of our own in; it sits beside this number, never subtracted.',
              },
              {
                step: '02 · Prove it',
                amount: '$60K to $80K',
                chip: 'target',
                line: 'Fifty beds, timed and costed with receipts. Turns the $426 bed from modelled to measured. The beds go to communities that ordered them.',
              },
              {
                step: '03 · Run it',
                amount: '~$109.5K a year',
                chip: 'workpaper',
                line: 'The block that keeps Goods running: shed, books, travel. What a community-owned site costs to run is being settled with the first community, so it is not printed here.',
              },
            ].map((cell) => (
              <div key={cell.step} className="bg-goods-cream p-6 lg:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-goods-terracotta">{cell.step}</p>
                <p className="goods-pitch-display mt-3 text-4xl">{cell.amount}</p>
                <div className="mt-2"><StatusChip label={cell.chip} /></div>
                <p className="mt-4 text-sm leading-6 text-[#6d675c]">{cell.line}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[#d9d1c3] pt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-goods-sub">Three ways in</p>
            {DOORS.map((door) => (
              <a key={door.verb} href="#the-letter" className="group text-base">
                <span className="goods-pitch-display text-2xl text-goods-terracotta group-hover:text-[#d26a4a]">{door.verb}</span>
                <span className="ml-2 text-sm text-[#6d675c]">{door.entity}</span>
              </a>
            ))}
          </div>
          <p className="mt-4 text-sm leading-6 text-goods-sub">
            The full working — every part price, the buy list, the cost chain — lives at{' '}
            <Link href="/register" className="underline decoration-goods-terracotta underline-offset-2">/register</Link>, each figure with its status.
          </p>
        </div>
      </section>

      <section id="model" data-pitch-panel="model" className="border-b border-[#d9d1c3] bg-goods-cream-muted px-6 py-12 md:px-10 lg:min-h-screen lg:px-14">
        <div className="mx-auto flex max-w-[1500px] flex-col justify-center lg:min-h-[calc(100vh-6rem)]">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            <div className="max-w-3xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-goods-terracotta">
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

      {/* The one-bed ladder, the stopwatch and the cost chain were cut from the deck on
          2026-08-06 (Ben: "from here it gets super confusing, heaps of writing"). The five
          numbers + the facility panel now carry the money story; the full working lives at
          /register and the cost lab, linked from the facility panel. Data modules unchanged. */}
      <section id="four-asks" data-pitch-panel="four-asks" className="border-b border-[#d9d1c3] bg-goods-cream-muted">
        <div className="mx-auto max-w-[1600px] px-6 py-14 md:px-10 lg:px-14 lg:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-goods-terracotta">
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
              so none of them is on this page.
            </p>
          </div>
        </div>

        {/* One row per community rather than one screen per community: the section's claim is
            "four communities asked for four DIFFERENT things", and the difference only becomes
            visible when the four sit within one viewport. */}
        <div className="mx-auto max-w-[1600px] px-6 pb-4 md:px-10 lg:px-14">
          {PATHWAY_ASKS.map((ask) => (
            <div
              key={ask.id}
              className="grid gap-4 border-t border-[#d9d1c3] py-8 lg:grid-cols-[0.55fr_0.9fr_1fr] lg:gap-10"
            >
              <div>
                <h3 className="goods-pitch-display text-3xl leading-none md:text-4xl">
                  {ask.place}
                </h3>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-goods-sub">
                  {ask.country}
                </p>
                <p className="goods-pitch-display mt-4 text-2xl text-goods-terracotta">{ask.size}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-goods-sub">
                  {ask.field}
                </p>
                <p className="mt-3 text-base leading-7">{ask.body}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-goods-sub">
                  What we can say about the money
                </p>
                <p className="mt-3 text-base leading-7 text-[#6d675c]">{ask.whatWeCanSay}</p>
                <p className="mt-4 border-t border-[#d9d1c3] pt-3 text-xs leading-5 text-goods-sub">
                  Whose call: {ask.whoseCall}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#d9d1c3] bg-goods-cream-muted">
          <div className="mx-auto max-w-[1600px] px-6 py-12 md:px-10 lg:px-14">
            <p className="max-w-4xl text-lg leading-8 text-goods-ink">{STAGE_RULE}</p>
            <p className="mt-4 max-w-4xl text-base leading-7 text-[#6d675c]">{FIRST_SITE_RULE}</p>
          </div>
        </div>
      </section>

      <section id="the-letter" data-pitch-panel="the-letter" className="bg-[#171714] px-6 py-16 text-goods-cream md:px-10 lg:px-14 lg:py-20">
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
              <p className="goods-pitch-display mt-7 max-w-3xl text-3xl leading-tight text-[#e88461] md:text-4xl">
                {ASK_HEADLINE.line}
              </p>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#cfc8bc]">{ASK_INTRO.body}</p>
              <div className="mt-9">
                <LetterLines />
              </div>
            </div>

            <div>
              <div className="border-y border-white/20">
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
            </div>
          </div>

          <ol className="mt-14 grid gap-3 border-t border-white/20 pt-10 md:grid-cols-3">
            {DOORS.map((door) => (
              <li key={door.verb} className="border-t-2 border-goods-terracotta bg-[#22211e] p-6 lg:p-8">
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

          <div className="mt-12 grid gap-8 border-t border-white/20 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <p className="max-w-2xl text-lg leading-8">{ASK_NEXT_STEP.sentence}</p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={ASK_NEXT_STEP.primary.href}
                className="bg-goods-terracotta px-6 py-3 text-sm font-semibold text-white hover:bg-[#d26a4a]"
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

      <footer id="closing" data-pitch-panel="closing" data-road-media="closing.photo" className="relative min-h-screen overflow-hidden bg-[#171714] text-white">
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
