import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AssemblySequence } from '@/components/pitch/assembly-sequence';
import { BedExplorer, type BedPart } from '@/components/pitch/bed-explorer';
import { Band, Lines, Photo, Section, SectionHead } from '@/components/pitch/blocks';
import { PitchMap } from '@/components/pitch/pitch-map';
import { VideoModal } from '@/components/pitch/video-modal';
import { Voice, leadVoice } from '@/components/pitch/voice';
import { ModelPlacematFrame, PanelCard } from '@/components/model/model-placemat';
import { ModelScrolly } from '@/components/story/model-scrolly';
import { ProductVideo } from '@/components/shop/product-video';
import { ProductionFacilityExperience } from '@/app/pitch/road/production-facility-experience';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { canonVideo } from '@/lib/data/canon-videos';
import { CASE_STUDIES } from '@/lib/data/case-studies';
import { deckSlides } from '@/lib/data/deck';
import { goodsBoard } from '@/lib/data/goods-board';
import { FACILITATION_RULING, FUNDING_LINES, LADDER } from '@/lib/data/grants';
import { HOME_FEATURE_COPY } from '@/lib/data/home';
import { videoUrl } from '@/lib/data/media';
import { BED, PANELS, RAISE, aud, audRange } from '@/lib/data/model-placemat';
import { BED_PIECES, METHOD_VERBS, PITCH_SECTIONS, ROAD_OVERRIDES } from '@/lib/data/pitch-road';
import { BASKET_BED, PLASTIC_KG_PER_BED, STRETCH_BED, WASHING_MACHINE } from '@/lib/data/products';
import { PAID_AUD, PAID_BEDS, QUESTIONS, QUESTIONS_OPEN_COUNT } from '@/lib/data/story-questions';
import { GATES, MAKE_STEPS, MONEY_LANES, PROBLEM_FIGURES, REQUEST, STORY_UPDATED, chapter } from '@/lib/data/story-spine';
import { PANELS_BOUGHT } from '@/lib/data/supply-buys';
import { liveCommunityLocations } from '@/lib/field-notes/resolve-live-map';

/**
 * THE PITCH. One scroll that carries everything: the crux, the problem, the road, the live map,
 * the bed you can explore, the facility you can walk, the Maningrida run with its film, the trade
 * that builds as you scroll, the whole model on one sheet, who holds the work, the money, what we
 * will measure, the voices, the close and the questions. Words from the data modules; interactive
 * pieces from the road pitch; the model from the placemat. Every deck slide points at a section
 * here (deck-master.ts `home`). The pitch layout keeps it out of search results.
 */
export const metadata: Metadata = {
  title: { absolute: 'The pitch | Goods on Country' },
  description: 'Useful goods start community enterprise. The road so far, the bed, the facility, how the trade works, the whole model on one sheet, the money, and what we will measure.',
  robots: { index: false, follow: false },
};

const BED_PARTS: BedPart[] = [
  { name: STRETCH_BED.materials.sleepingSurface.name, detail: `${STRETCH_BED.materials.sleepingSurface.detail}. The canvas is structural: its tension holds the bed up.`, position: 'left-[60%] top-[34%]' },
  { name: STRETCH_BED.materials.frame.name, detail: `${STRETCH_BED.materials.frame.detail}. Two poles thread through the canvas sleeves and the top holes of the X-legs.`, position: 'left-[36%] top-[50%]' },
  { name: STRETCH_BED.materials.legs.name, detail: `${STRETCH_BED.materials.legs.detail}. About ${PLASTIC_KG_PER_BED} kg of recycled HDPE in every bed.`, position: 'left-[80%] top-[54%]' },
];

const roadStops = deckSlides.filter((slide) => slide.kind === 'stop');
const NAV = PITCH_SECTIONS.filter((s) => s.nav);

export default async function PitchPage() {
  const crux = chapter('crux');
  const problem = chapter('problem');
  const road = chapter('road');
  const make = chapter('make');
  const trade = chapter('trade');
  const method = chapter('method');
  const money = chapter('money');
  const evidence = chapter('evidence');
  const close = chapter('close');
  const questions = chapter('questions');
  const voices = roadStops.map((s) => ({ stop: s, voice: leadVoice(s) })).filter((v) => v.voice !== null);
  const maningrida = CASE_STUDIES.find((c) => c.slug === 'maningrida');
  const film = canonVideo('video-maningrida-case-study');
  const locations = await liveCommunityLocations();

  return (
    <main className="bg-goods-cream text-goods-ink">
      <nav className="sticky top-16 z-20 border-b border-[#e6dfd1] bg-goods-cream/90 backdrop-blur" aria-label="Sections">
        <div className="mx-auto flex max-w-6xl items-center gap-4 overflow-x-auto px-6 py-3 text-sm [scrollbar-width:none] md:px-10 lg:px-14 [&::-webkit-scrollbar]:hidden">
          <a href="#crux" className="whitespace-nowrap font-semibold">Goods on Country</a>
          <span className="hidden whitespace-nowrap text-[#7a7363] xl:inline">The pitch</span>
          <span className="flex-1" />
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="whitespace-nowrap text-[#5d574c] hover:text-goods-terracotta">
              {n.label}
            </a>
          ))}
        </div>
      </nav>

      {/* 1 The crux, over the film */}
      <header id="crux" className="relative scroll-mt-14 overflow-hidden bg-goods-ink text-goods-cream">
        <video className="absolute inset-0 h-full w-full object-cover opacity-80 motion-reduce:hidden" autoPlay muted loop playsInline poster="/video/hero-poster.jpg" aria-hidden="true">
          <source src="/video/hero-desktop.mp4" type="video/mp4" />
        </video>
        <Image src="/video/hero-poster.jpg" alt="" fill sizes="100vw" className="hidden object-cover opacity-80 motion-reduce:block" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-goods-ink via-goods-ink/40 to-goods-ink/10" />
        <div className="relative mx-auto flex min-h-[86vh] max-w-6xl flex-col justify-end px-6 pb-16 pt-32 md:px-10 lg:px-14">
          <p className="mb-4 text-sm text-goods-cream/70">The pitch · {STORY_UPDATED}</p>
          <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.0] tracking-[-0.01em] text-balance md:text-7xl">{crux.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-goods-cream/90 md:text-2xl">{crux.lines[0]}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#road" className="rounded-full bg-goods-terracotta px-6 py-3 text-sm font-semibold text-white">Walk the road</a>
            <a href="#model" className="rounded-full border border-goods-cream/40 px-6 py-3 text-sm font-semibold text-goods-cream">The whole model on one sheet</a>
          </div>
        </div>
      </header>

      <Band>
        <dl className="grid grid-cols-2 gap-6 md:grid-cols-5">
          {[
            { v: CANONICAL_ASSETS.bedsDeployed.toLocaleString('en-AU'), l: 'beds in community' },
            { v: String(CANONICAL_ASSETS.communitiesServed), l: 'communities' },
            { v: String(CANONICAL_ASSETS.washersInCommunity), l: 'washing machines' },
            { v: String(PAID_BEDS), l: `beds bought and paid for on invoice by four organisations, ${aud(PAID_AUD)}` },
            { v: '0', l: 'community enterprises trading. That is what this year changes' },
          ].map((s) => (
            <div key={s.l}>
              <dt className="font-display text-4xl font-semibold leading-none">{s.v}</dt>
              <dd className="mt-2 text-sm text-[#5d574c]">{s.l}</dd>
            </div>
          ))}
        </dl>
      </Band>

      {/* 2 The problem */}
      <Section id="problem" number={2} title={problem.title}>
        <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-start">
          <Lines lines={problem.lines} />
          {problem.photo && <Photo photo={problem.photo} />}
        </div>
        <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4" aria-label="Four figures">
          {PROBLEM_FIGURES.map((f) => (
            <li key={f.id} className="border-t border-[#e6dfd1] pt-5">
              <p className="text-sm font-semibold text-goods-terracotta">{f.area}</p>
              <p className="mt-2 font-display text-5xl font-semibold leading-none">{f.value}</p>
              <p className="mt-3 text-[15px] leading-snug text-[#4a4741]">{f.what}</p>
              {f.note && <p className="mt-2 text-[13px] leading-snug text-[#7a7363]">{f.note}</p>}
              <p className="mt-3 text-[12px] leading-snug text-[#7a7363]"><a href={f.sourceUrl} className="underline decoration-[#c18a7b] underline-offset-2" target="_blank" rel="noreferrer">{f.source}</a></p>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-[#7a7363]">These four figures describe the context. None of them is an outcome of Goods’ work.</p>
      </Section>

      {/* 3 The road */}
      <Section id="road" number={3} title={road.title}>
        <ol className="mt-14 space-y-20">
          {roadStops.map((stop, i) => {
            const v = leadVoice(stop);
            const o = ROAD_OVERRIDES[stop.id] ?? {};
            const photo = o.photo ?? { src: stop.photo, alt: stop.photoAlt };
            const gallery = o.gallery ?? stop.gallery ?? [];
            const stopFilm = o.film ?? (stop.inlineVideo?.mode === 'feature' ? { src: stop.inlineVideo.src, poster: stop.inlineVideo.poster, title: stop.inlineVideo.label ?? stop.headline } : undefined);
            return (
              <li key={stop.id} id={stop.id} className="grid gap-8 md:grid-cols-12 md:items-start">
                <div className="md:col-span-5">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-goods-sand">
                    <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 768px) 42vw, 100vw" className="object-cover" />
                  </div>
                  {gallery.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-3">
                      {gallery.map((g) => (
                        <div key={g.src} className="relative aspect-square overflow-hidden rounded-[12px] bg-goods-sand">
                          <Image src={g.src} alt={g.alt} fill sizes="14vw" className="object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="md:col-span-7">
                  <p className="font-display text-2xl text-goods-terracotta">{i + 1}</p>
                  <h3 className="mt-1 font-display text-3xl font-semibold leading-tight text-balance md:text-4xl">{stop.headline}</h3>
                  <p className="mt-2 text-sm text-[#7a7363]">{stop.place}</p>
                  <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[#4a4741]">{stop.body}</p>
                  {(stopFilm || o.link) && (
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      {stopFilm && <VideoModal src={stopFilm.src} poster={stopFilm.poster} title={stopFilm.title} label="Watch Mykel build the bed" />}
                      {o.link && (
                        <Link href={o.link.href} className="inline-flex min-h-11 items-center rounded-full border border-goods-ink/30 px-4 text-sm font-semibold hover:border-goods-terracotta hover:text-goods-terracotta">
                          {o.link.label}
                        </Link>
                      )}
                    </div>
                  )}
                  {v && (
                    <div className="mt-8">
                      <Voice person={v.person} quote={v.quote} />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          <ProductVideo videoUrl="/video/partners/centrecorp/utopia-delivery-road.mp4" thumbnailUrl="/video/partners/centrecorp/utopia-delivery-road-poster.jpg" title="The delivery road to the Utopia homelands" />
          <ProductVideo videoUrl="/video/partners/centrecorp/utopia-bed-building.mp4" thumbnailUrl="/video/partners/centrecorp/utopia-bed-building-poster.jpg" title="Building beds at Utopia" />
          <ProductVideo videoUrl="/video/partners/oonchiumpa/karen-liddle-on-beds.mp4" thumbnailUrl="/video/partners/oonchiumpa/karen-liddle-on-beds-poster.jpg" title="Karen Liddle on the beds" />
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {road.lines.slice(1).map((line) => (
            <p key={line} className="text-lg leading-relaxed text-[#4a4741]">{line}</p>
          ))}
        </div>
      </Section>

      {/* 4 The map */}
      <Section id="map" number={4} title="The work has travelled a long way.">
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#4a4741] md:text-xl">{road.lines[0]}</p>
        <dl className="mt-8 grid grid-cols-3 gap-6 md:max-w-2xl">
          {[
            { v: CANONICAL_ASSETS.bedsDeployed.toLocaleString('en-AU'), l: 'beds in community' },
            { v: String(CANONICAL_ASSETS.communitiesServed), l: 'communities' },
            { v: String(CANONICAL_ASSETS.washersInCommunity), l: 'washing machines' },
          ].map((s) => (
            <div key={s.l}>
              <dt className="font-display text-3xl font-semibold leading-none">{s.v}</dt>
              <dd className="mt-1 text-sm text-[#7a7363]">{s.l}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10">
          <PitchMap locations={locations} />
        </div>
      </Section>

      {/* 5 The bed */}
      <Section id="make" number={5} title={make.title} dark>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-goods-cream/85 md:text-xl">{STRETCH_BED.tagline} Press a part.</p>
        <div className="mt-10">
          <BedExplorer src="/images/product/stretch-bed-hero.jpg" alt="A finished Stretch Bed on Country in golden light" parts={BED_PARTS} caption="Three parts. No tools. About five minutes." />
        </div>
        <dl className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { v: STRETCH_BED.specs.assemblyTime, l: 'to assemble, no tools' },
            { v: STRETCH_BED.specs.loadCapacity, l: 'load' },
            { v: STRETCH_BED.specs.weight, l: 'flat-packed' },
            { v: `${PLASTIC_KG_PER_BED} kg`, l: 'recycled plastic in every bed, modelled' },
          ].map((s) => (
            <div key={s.l}>
              <dt className="font-display text-3xl font-semibold text-goods-cream">{s.v}</dt>
              <dd className="mt-1 text-sm text-goods-cream/60">{s.l}</dd>
            </div>
          ))}
        </dl>
        <h3 className="mt-14 font-display text-2xl font-semibold text-goods-cream">Three materials. No tools. Five minutes.</h3>
        <ul className="mt-6 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {BED_PIECES.map((p) => (
            <li key={p.src} className="overflow-hidden rounded-[18px] border border-goods-cream/15 bg-goods-cream/5">
              <div className="relative aspect-[4/3] bg-goods-sand">
                <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </div>
              <div className="p-4">
                <p className="font-display text-lg font-semibold text-goods-cream">{p.title}</p>
                <p className="mt-1 text-sm leading-snug text-goods-cream/70">{p.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-14">
          <h3 className="font-display text-2xl font-semibold text-goods-cream">Assembled in community</h3>
          <p className="mt-2 max-w-2xl text-goods-cream/75">Two poles through the canvas sleeves and the top holes of the crossed legs. Tensioning pulls the poles deep into the legs and the canvas becomes the structure.</p>
          <div className="mt-6">
            <AssemblySequence />
          </div>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-goods-sand">
              <Image src="/images/product/washing-machine-name.jpg" alt="Pakkimjalki Kari, the washing machine, with its name" fill sizes="33vw" className="object-cover" />
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold text-goods-cream">{WASHING_MACHINE.name}</h3>
            <p className="mt-2 text-goods-cream/75">{WASHING_MACHINE.tagline} Prototype, in several communities. Register interest only.</p>
          </div>
          <div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-goods-sand">
              <Image src="/images/product/basket-bed-hero.jpg" alt="The Basket Bed, the first prototype" fill sizes="33vw" className="object-cover" />
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold text-goods-cream">{BASKET_BED.name}</h3>
            <p className="mt-2 text-goods-cream/75">{BASKET_BED.tagline} Sales discontinued; the plans are free to download.</p>
          </div>
          <div className="rounded-[18px] border border-dashed border-goods-cream/30 p-6">
            <h3 className="font-display text-2xl font-semibold text-goods-cream">What comes next</h3>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="font-semibold text-goods-cream">Washing machines</dt>
                <dd className="text-sm text-goods-cream/70">Already being tested in community as Pakkimjalki Kari.</dd>
              </div>
              <div>
                <dt className="font-semibold text-goods-cream">A fridge <span className="ml-2 rounded-full border border-goods-cream/30 px-2 py-0.5 text-[11px] uppercase tracking-wide text-goods-cream/70">possible</span></dt>
                <dd className="text-sm text-goods-cream/70">Refrigeration for houses where the power is unreliable. An idea for the future; nothing is built yet.</dd>
              </div>
              <div>
                <dt className="font-semibold text-goods-cream">Whatever a community asks for next</dt>
                <dd className="text-sm text-goods-cream/70">The community chooses. A Curious Tractor does the research and development.</dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>

      {/* 6 The facility */}
      <Section id="facility" number={6} title="How a bed gets made.">
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#4a4741] md:text-xl">{make.lines[0]} Walk the line.</p>
        <div className="mt-10 overflow-hidden rounded-[22px] [&_section>div]:min-h-0 [&_section]:min-h-0">
          <ProductionFacilityExperience />
        </div>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MAKE_STEPS.map((step, i) => (
            <li key={step.id}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-goods-sand">
                <Image src={step.photo.src} alt={step.photo.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </div>
              <p className="mt-3 font-display text-lg font-semibold"><span className="mr-2 text-goods-terracotta">{i + 1}</span>{step.title}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-3xl text-[#4a4741]">The route since 12 September: tab sheets pressed at The Harvest Plant, leg panels bought in, kits dispatched flat and assembled in community. Leg panels bought and paid for so far: {PANELS_BOUGHT}. The forty Maningrida beds showed the plant can press a bed from start to finish.</p>
      </Section>

      {/* 7 Maningrida, the run that proves the making */}
      {maningrida && (
        <Section id="maningrida" number={7} title="Forty Stretch Beds. Made at The Harvest Plant. Assembled at Gamardi." dark>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-goods-cream/85 md:text-xl">{maningrida.standfirst}</p>
          {film && (
            <div className="mt-10">
              <VideoModal cover src={videoUrl(film.desktopFile)} poster={film.poster ?? '/video/maningrida-case-study-poster.jpg'} captions={film.captions} title={HOME_FEATURE_COPY.title} />
              <p className="mt-3 max-w-3xl text-sm text-goods-cream/60">{HOME_FEATURE_COPY.caption}</p>
            </div>
          )}
          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {maningrida.steps.map((step, i) => (
              <li key={step.title}>
                {step.photo && (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-goods-sand">
                    <Image src={step.photo.src} alt={step.photo.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
                  </div>
                )}
                <p className="mt-4 font-display text-xl font-semibold leading-tight text-goods-cream"><span className="mr-2 text-goods-terracotta-light">{i + 1}</span>{step.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-goods-cream/70">{step.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 text-sm text-goods-cream/60">
            With {maningrida.partner.nameCleared ? maningrida.partner.name : maningrida.partner.role}.{' '}
            <Link href={`/case-studies/${maningrida.slug}`} className="underline decoration-goods-terracotta-light underline-offset-2">The full case study</Link>.
          </p>
        </Section>
      )}

      {/* 8 The trade */}
      <Section id="trade" number={8} title={trade.title}>
        <div className="mt-6 max-w-3xl">
          <Lines lines={trade.lines} />
        </div>
        <div className="mt-12">
          <ModelScrolly />
        </div>
      </Section>

      {/* 9 The whole model */}
      <section id="model" className="scroll-mt-28 border-t border-[#e6dfd1] bg-goods-cream px-6 py-20 md:px-10 md:py-28 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <SectionHead number={9} title="The whole model on one sheet." />
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#4a4741] md:text-xl">The placemat. The raise across the top, the trade around one centre, the four things every bed carries, the support around it. This is the one drawing; the deck’s model slide is cut from it.</p>
        </div>
        <div className="mx-auto mt-10 max-w-[1588px]">
          <ModelPlacematFrame />
        </div>
      </section>

      {/* 10 Who holds the work */}
      <Section id="people" number={10} title={method.title}>
        <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-start">
          {method.photo && <Photo photo={method.photo} />}
          <div>
            <Lines lines={method.lines} />
            <ol className="mt-6 flex flex-wrap gap-2" aria-label="The method">
              {METHOD_VERBS.map((v, i) => (
                <li key={v} className="rounded-full border border-[#e6dfd1] bg-[#fffdf9] px-4 py-2 text-sm font-semibold">
                  <span className="mr-2 text-goods-terracotta">{i + 1}</span>
                  {v}
                </li>
              ))}
            </ol>
            <h3 className="mt-10 font-display text-2xl font-semibold">The Butterfly Movement Ltd, trading as Goods on Country</h3>
            <p className="mt-2 text-[#4a4741]">A registered charity since 2012 with deductible gift status. Since 28 August everything the work needs sits in it, and it is taking Goods on Country as its name. Community partners are independent organisations with their own boards. A Curious Tractor does the research and development.</p>
          </div>
        </div>
        <ul className="mt-12 grid gap-8 sm:grid-cols-3">
          {goodsBoard.map((d) => (
            <li key={d.name}>
              <div className="relative aspect-square overflow-hidden rounded-[18px] bg-goods-sand">
                <Image src={d.photo} alt={`${d.name}, ${d.role}`} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
              </div>
              <p className="mt-4 font-display text-2xl font-semibold leading-tight">{d.name}</p>
              <p className="text-sm text-[#7a7363]">{d.role} · {d.country}</p>
              <p className="mt-3 text-[15px] leading-snug text-[#4a4741]">{d.goods}</p>
              <p className="mt-2 text-[12px] text-[#7a7363]">Photograph: {d.photoCredit}</p>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-3xl text-sm text-[#7a7363]">Ownership of the making is a pathway. At month six a site is asked four questions with a yes or no answer: who holds the keys, who runs the payroll, who invoices the buyer, and whether the community decides what gets made and who works on it. Partial counts as no.</p>
      </Section>

      {/* 11 The money */}
      <Section id="money" number={11} title={money.title} dark>
        <div className="mt-10 max-w-3xl">
          <Lines lines={money.lines.slice(0, 1)} dark />
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MONEY_LANES.map((lane) => (
            <li key={lane.id} className="rounded-[18px] border border-goods-cream/15 p-6">
              <h3 className="font-display text-2xl font-semibold text-goods-cream">{lane.title}</h3>
              <p className="mt-2 text-goods-cream/80">{lane.line}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-goods-cream/80">{FACILITATION_RULING}</p>
        <div className="mt-14 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <p className="text-sm text-goods-cream/60">The QBE request</p>
            <p className="mt-2 font-display text-4xl font-semibold leading-tight text-goods-cream text-balance md:text-5xl">{REQUEST.headline}</p>
          </div>
          <p className="text-goods-cream/80">{REQUEST.note}</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <div className="rounded-[18px] border border-goods-cream/15 p-6">
            <h3 className="font-display text-xl font-semibold text-goods-cream">The raise, and every source with its job and status</h3>
            <p className="mt-2 text-goods-cream/80">QBE {aud(RAISE.qbeAud)} for the two facilities. Other philanthropy {audRange(RAISE.otherLowAud, RAISE.otherHighAud)} for the first {RAISE.bedsYearOne} beds. {audRange(RAISE.totalLowAud, RAISE.totalHighAud)} in total. Nothing is signed.</p>
            <ul className="mt-4 divide-y divide-goods-cream/10">
              {FUNDING_LINES.map((f) => (
                <li key={f.id} className="py-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className="text-sm text-goods-cream">{f.funder}</span>
                    <span className="text-sm tabular-nums text-goods-cream/80">{f.amount}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-goods-cream/60">
                    <span>{f.job}</span>
                    <span className="rounded-full border border-goods-cream/25 px-2 py-0.5 text-[11px] uppercase tracking-wide text-goods-terracotta-light">{f.status}</span>
                    <span className="text-[12px]">{f.instrument}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[18px] border border-goods-cream/15 p-6">
            <h3 className="font-display text-xl font-semibold text-goods-cream">One bed, the price model</h3>
            <p className="mt-2 text-goods-cream/80">A bed sells for {aud(BED.priceAud)}. About {aud(BED.makeAud)} makes it, provisional until the leg-panel yield is confirmed. {aud(BED.staysAud)} stays with the community organisation, with freight paid by the buyer and shown beside the bed.</p>
            <p className="mt-6 text-goods-cream/80">What is real today: {PAID_BEDS} beds bought and paid for on invoice by four organisations, {aud(PAID_AUD)}. The buyers are named by type: a national research centre, a foundation buying for the Utopia homelands, a homeland school company and a health service.</p>
            <p className="mt-6 text-sm text-goods-cream/70">Every rung is a real unit with a real price:</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {LADDER.map((l) => (
                <li key={l.amount} className="rounded-full bg-goods-cream/10 px-3 py-1 text-sm text-goods-cream"><strong>{l.amount}</strong> {l.buys}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* 12 What we will measure */}
      <Section id="measure" number={12} title={evidence.title}>
        <div className="mt-10 max-w-3xl">
          <Lines lines={evidence.lines.slice(0, 1)} />
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PANELS.map((panel) => (
            <div key={panel.id} className="min-h-[300px]">
              <PanelCard panel={panel} />
            </div>
          ))}
        </div>
        <div className="mt-16 max-w-3xl">
          <Lines lines={evidence.lines.slice(1)} />
        </div>
        <ol className="mt-8 grid gap-4 sm:grid-cols-5">
          {GATES.map((gate, i) => (
            <li key={gate} className="rounded-[18px] border border-[#e6dfd1] bg-[#fffdf9] p-5">
              <p className="font-display text-2xl text-goods-terracotta">{i + 1}</p>
              <p className="mt-2 font-semibold leading-snug">{gate}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Voices */}
      {voices.length > 0 && (
        <Band dark>
          <div className="grid gap-10 md:grid-cols-3">
            {voices.slice(-3).map(({ stop, voice }) => voice && <Voice key={stop.id} person={voice.person} quote={voice.quote} dark />)}
          </div>
        </Band>
      )}

      {/* 13 Close */}
      <Section id="close" number={13} title={close.title}>
        <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-start">
          <Lines lines={close.lines} />
          {close.photo && <Photo photo={close.photo} />}
        </div>
      </Section>

      {/* 14 Questions */}
      <Section id="questions" number={14} title={questions.title} tight>
        <div className="mt-6 max-w-3xl">
          <Lines lines={questions.lines} />
          <p className="mt-3 text-sm text-[#7a7363]">{QUESTIONS.length} questions, {QUESTIONS_OPEN_COUNT} still open or partly answered.</p>
        </div>
        <dl className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="border-t border-[#e6dfd1] pt-5">
              <dt className="font-display text-2xl font-semibold leading-tight text-balance">{q.question}</dt>
              <dd className="mt-3 text-[16px] leading-relaxed text-[#4a4741]">
                {q.answer || <span className="text-goods-terracotta">Open. We do not yet have an answer we would say out loud.</span>}
                {q.status === 'partly' && <span className="ml-2 text-sm text-[#7a7363]">Partly answered.</span>}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-14 text-sm text-[#7a7363]">
          Words {STORY_UPDATED}. Figures from the register and canon. The working detail, every QBE answer and every grant, lives in{' '}
          <a href="https://claude.ai/code/artifact/56d3eafa-f789-4434-a1a9-acbd7624f664" className="underline decoration-[#c18a7b] underline-offset-2">the master</a>.
        </p>
      </Section>
    </main>
  );
}
