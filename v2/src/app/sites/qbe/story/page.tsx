import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import './story.css';

import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { communityLocations } from '@/lib/data/content';
import { deckSlides } from '@/lib/data/deck';
import { videoUrl } from '@/lib/data/media';
import { SOLIDITY_LABEL, type Solidity } from '@/lib/data/cost-story';
import { BED_PRICE_AUD, BED_UNIT } from '@/lib/data/bed-ratio';
import { KIT_COST_AUD, LOOP_GATES, LOOP_STEPS, POOL, STAYS_KIT_AUD, STAYS_PRESSED_AUD, TIMELINE_TARGETS } from '@/lib/data/community-loop';
import { ENTITY_ROUTE, PROGRAM, QBE_ASK, SIGNED_TOTAL_AUD, THE_BLOCK, lineById } from '@/lib/data/raise-stack';
import {
  BUYERS,
  CALENDAR,
  CALENDAR_FAULT,
  CRUX,
  DECK_MAP,
  FOUR_TRUE,
  HEALTH_RULE,
  HONEST_RULES,
  HOW_WE_KNOW,
  IMPACT_RULE,
  MEASURED_RUN,
  MONTH_SIX_QUESTIONS,
  OUTCOMES,
  PROBLEM_FIGURES,
  PROBLEM_INTRO,
  PROBLEM_ROAD,
  PROBLEM_VOICES,
  PROOF_RUNS,
  SNOWBALL,
  SNOWBALL_STEPS,
  SPEED_NOTE,
  STORY_CHAPTERS,
  THREE_DOORS,
  WHO_SELLS,
  storyChapter,
  type StoryChapterId,
} from '@/lib/data/qbe-story';
import { FAQ, FAQ_OPEN_COUNT } from '@/lib/data/qbe-faq';
import { QBE_DIAGRAMS, diagramById } from '@/lib/diagrams/qbe-diagrams';

import { ImpactStats } from '@/components/marketing/impact-stats';
import { AssemblySequence } from '@/components/pitch/assembly-sequence';
import { ProductVideo } from '@/components/shop/product-video';
import { RoadPitchMap } from '@/app/pitch/road/road-map';
import { ZoomableBedImage } from '@/app/pitch/road/zoomable-bed-image';
import { ProductionFacilityExperience } from '@/app/pitch/road/production-facility-experience';

import { StoryChrome } from './story-chrome';
import { DiagramFigure } from './diagram-figure';
import { AmountExplorer } from './amount-explorer';
import { PoolMixExplorer } from './pool-mix-explorer';
import { SnowballExplorer } from './snowball-explorer';
import { StackExplorer } from './stack-explorer';
import { FaqList } from './faq-list';
import { SolidityChip } from './solidity-chip';

export const metadata: Metadata = {
  title: { absolute: 'The whole story | Goods on Country for QBE' },
  description: 'We buy beds. Communities sell them. The money stays with them and builds the next thing. The long version, with the model drawn, the numbers live, and the questions people ask.',
  robots: { index: false, follow: false },
};

const aud = (n: number) => `$${Math.round(n).toLocaleString('en-AU')}`;
const roadStops = deckSlides.filter((s) => s.kind === 'stop');
const finishedBed = deckSlides.find((s) => s.id === 'open-the-stretch-bed');
const utopia = deckSlides.find((s) => s.id === 'stop-5-utopia');
const tfff = lineById('tfff');
const bmdf = lineById('bmdf');
const sefa = lineById('sefa');
const whiteBox = lineById('white-box');
const alive = lineById('alive');
const debtTotal = (sefa.amountAud ?? 0) + (whiteBox.amountAud ?? 0);
const bedsToRepay = Math.round(debtTotal / STAYS_PRESSED_AUD / 3 / 10) * 10;

/** The heading every chapter opens with: kicker, title, and the slides and form questions it feeds. */
function ChapterHead({ id, dark = false }: { id: StoryChapterId; dark?: boolean }) {
  const c = storyChapter(id);
  const n = STORY_CHAPTERS.findIndex((x) => x.id === id) + 1;
  return (
    <header className="max-w-4xl">
      <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${dark ? 'text-goods-terracotta-light' : 'text-goods-terracotta'}`}>
        {String(n).padStart(2, '0')} · {c.kicker}
      </p>
      <h2 className="goods-pitch-display mt-3 text-3xl leading-tight md:text-5xl md:leading-[1.08]">{c.title}</h2>
      {(c.deckSlides.length > 0 || c.formQuestions.length > 0) && (
        <p className={`mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] print:hidden ${dark ? 'text-white/45' : 'text-goods-sub'}`}>
          {c.deckSlides.length > 0 && <span>Deck: {c.deckSlides.join(' · ')}</span>}
          {c.formQuestions.length > 0 && <span>Form: {c.formQuestions.join(', ')}</span>}
        </p>
      )}
    </header>
  );
}

function Chapter({ id, dark = false, muted = false, children }: { id: StoryChapterId; dark?: boolean; muted?: boolean; children: React.ReactNode }) {
  const bg = dark ? 'bg-goods-ink text-goods-cream' : muted ? 'bg-goods-cream-muted' : 'bg-goods-cream';
  return (
    <section id={id} data-story-chapter={id} className={`scroll-mt-16 border-b border-goods-grid/60 px-6 py-16 md:px-10 md:py-20 lg:px-14 ${bg}`}>
      <div className="mx-auto max-w-[1500px]">
        <ChapterHead id={id} dark={dark} />
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function Figure({ id }: { id: string }) {
  const d = diagramById(id);
  return <DiagramFigure id={d.id} title={d.title} caption={d.caption} slide={d.slide} svg={d.svg()} />;
}

function Prose({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-3xl space-y-5 text-lg leading-8 ${className}`}>{children}</div>;
}

export default function QbeStoryPage() {
  return (
    <main className="bg-goods-cream text-goods-ink">
      <StoryChrome />

      {/* Cover */}
      <header className="story-cover relative overflow-hidden bg-goods-ink text-goods-cream">
        <Image src="/images/product/stretch-bed-hero.jpg" alt="The Stretch Bed on Country" fill priority sizes="100vw" className="object-cover opacity-40" />
        <div className="relative mx-auto flex min-h-[80svh] max-w-[1500px] flex-col justify-end px-6 py-16 md:px-10 lg:px-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-goods-terracotta-light">Goods on Country · QBE Catalysing Impact, Stage 2 · the whole story</p>
          <h1 className="goods-pitch-display mt-5 max-w-5xl text-4xl leading-[1.05] md:text-7xl">We buy beds. Communities sell them. The money stays with them and builds the next thing.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-goods-cream/85">
            The long version of the model, with every drawing, every number where it comes from, the places that taught it, and the questions people keep asking. The deck is cut from this page.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#crux" className="border border-goods-terracotta bg-goods-terracotta px-5 py-3 text-sm font-semibold text-white">
              Start with the crux
            </a>
            <a href="#faq" className="border border-white/35 px-5 py-3 text-sm font-semibold text-white hover:border-white">
              The questions ({FAQ.length}, {FAQ_OPEN_COUNT} open)
            </a>
            <Link href="/pitch/road" className="inline-flex items-center gap-1 border border-white/35 px-5 py-3 text-sm font-semibold text-white hover:border-white">
              The road pitch <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
            Figures read live from the guarded modules · {aud(SIGNED_TOTAL_AUD)} signed today · updated 4 September 2026
          </p>
        </div>
      </header>

      {/* 01 The crux */}
      <Chapter id="crux">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <Prose className="text-xl leading-9">
            {CRUX.slice(1).map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </Prose>
          <aside className="space-y-4 border-l-2 border-goods-terracotta pl-6 text-sm leading-6 text-goods-sub">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">Three things that hold on every page</p>
            <p>
              <strong className="text-goods-ink">{aud(PROGRAM.costAud)} is the cost of the beds.</strong> Never sales, never income.
            </p>
            <p>
              <strong className="text-goods-ink">QBE does not match anything.</strong> {aud(QBE_ASK.recommended.aud)} is the ask; {aud(QBE_ASK.smaller.aud)} is the smaller amount. Nothing else is signed today.
            </p>
            <p>
              <strong className="text-goods-ink">No community is named beside a price</strong> until it has seen the design.
            </p>
          </aside>
        </div>
      </Chapter>

      {/* 02 The problem */}
      <Chapter id="problem" muted>
        <Prose>
          <p>{PROBLEM_INTRO}</p>
        </Prose>
        <dl className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROBLEM_FIGURES.map((f) => (
            <div key={f.value} className="border-t-2 border-goods-terracotta pt-4">
              <dt className="goods-pitch-display text-4xl">{f.value}</dt>
              <dd className="mt-2 text-sm leading-6">{f.text}</dd>
              <dd className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-goods-sub">{f.source}</dd>
            </div>
          ))}
        </dl>
        <Prose className="mt-10">
          <p>{PROBLEM_VOICES}</p>
          <p>{PROBLEM_ROAD}</p>
        </Prose>
        <div className="mt-10">
          <ImpactStats title="What has landed so far" subtitle="Every count from the register. Washers are curated, never row-derived." />
        </div>
      </Chapter>

      {/* 03 The road */}
      <Chapter id="road">
        <Prose>
          <p>
            Every stop is a person saying something, and each one taught something the model now carries. The full road, with every voice, is at{' '}
            <Link href="/pitch/road" className="underline decoration-goods-terracotta underline-offset-4">
              /pitch/road
            </Link>
            . This is the short walk.
          </p>
        </Prose>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {roadStops.map((stop) => (
            <li key={stop.id} className="group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-goods-sand">
                <Image src={stop.photo} alt={stop.photoAlt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </div>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-goods-terracotta">{stop.eyebrow}</p>
              <p className="goods-pitch-display mt-1 text-lg leading-snug">{stop.headline}</p>
              {stop.place && <p className="mt-1 text-xs text-goods-sub">{stop.place}</p>}
            </li>
          ))}
        </ol>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {utopia?.inlineVideo && (
            <div>
              <ProductVideo videoUrl={utopia.inlineVideo.src} thumbnailUrl={utopia.inlineVideo.poster ?? undefined} title={utopia.inlineVideo.label} />
              <p className="mt-2 text-xs text-goods-sub">{utopia.inlineVideo.label}. {utopia.place}.</p>
            </div>
          )}
          <div>
            <ProductVideo videoUrl={videoUrl('maningrida-case-study-desktop.mp4')} thumbnailUrl="/video/maningrida-case-study-poster.jpg" title="Maningrida: young people built their own beds" />
            <p className="mt-2 text-xs text-goods-sub">The four-minute Maningrida film. Forty beds pressed at the farm, assembled at Gamardi with Homeland School Company.</p>
          </div>
        </div>
        <div className="mt-12">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">Communities reached, and the four live pathways</p>
          <RoadPitchMap locations={communityLocations} />
        </div>
      </Chapter>

      {/* 04 One bed */}
      <Chapter id="bed" muted>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            {finishedBed && <ZoomableBedImage src={finishedBed.photo} alt={finishedBed.photoAlt} />}
            <p className="mt-3 text-xs leading-5 text-goods-sub">
              Two galvanised steel poles thread through the canvas sleeves and the top holes of two crossed recycled-plastic X-legs; tension makes the canvas structural. About five minutes to assemble, washable, repairable. Tap a part for its cost.
            </p>
          </div>
          <div>
            <Prose className="text-base leading-7">
              <p>
                One bed is {aud(BED_PRICE_AUD)}. Fifty beds is a tonne of plastic. Two hundred is a community&apos;s pool. What one bed does:
              </p>
            </Prose>
            <ol className="mt-6 space-y-5">
              {BED_UNIT.map((u, i) => (
                <li key={u.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-goods-terracotta font-mono text-sm font-bold text-white">{i + 1}</span>
                  <div>
                    <p className="goods-pitch-display text-xl">{u.title}</p>
                    <p className="mt-1 text-sm leading-6 text-goods-sub">{u.body}</p>
                    <div className="mt-2">
                      <SolidityChip label={u.label} />
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8">
              <AssemblySequence />
            </div>
          </div>
        </div>
        <Figure id="the-unit" />
        <AmountExplorer />
      </Chapter>

      {/* 05 The loop */}
      <Chapter id="loop">
        <Prose>
          <p>
            The funder puts money in once. Five communities each get {POOL.beds} beds. From there it is theirs: what to give, what to sell, who to pay, what to build next. The money goes round inside the community. The drawing shows one community&apos;s loop, run five times.
          </p>
        </Prose>
        <Figure id="the-loop" />
        <ol className="mt-4 grid gap-6 md:grid-cols-5">
          {LOOP_STEPS.map((s) => (
            <li key={s.n} className="border-t-2 border-goods-terracotta pt-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-goods-terracotta">Step {s.n}</p>
              <p className="goods-pitch-display mt-1 text-lg leading-snug">{s.title}</p>
              <p className="mt-2 text-sm leading-6 text-goods-sub">{s.body}</p>
              <div className="mt-2">
                <SolidityChip label={s.label} />
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-12">
          <PoolMixExplorer />
        </div>
        <Prose className="mt-12">
          <p className="font-semibold">Two of the five steps have already happened.</p>
        </Prose>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {PROOF_RUNS.map((run) => (
            <figure key={run.place}>
              <div className="relative aspect-[3/2] overflow-hidden rounded-md bg-goods-sand">
                <Image src={run.photo} alt={run.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              </div>
              <figcaption className="mt-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-goods-terracotta">{run.place}</p>
                <p className="mt-2 text-base leading-7">{run.body}</p>
                <p className="mt-2 text-base font-semibold leading-7">{run.proves}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <Prose className="mt-12">
          <p>{FOUR_TRUE}</p>
          <p>
            <strong>On speed.</strong> {SPEED_NOTE}
          </p>
        </Prose>
      </Chapter>

      {/* 06 Who buys */}
      <Chapter id="buyers" dark>
        <Prose className="text-goods-cream/90">
          <p>{CRUX[6]}</p>
          <p>{WHO_SELLS}</p>
        </Prose>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <ul className="divide-y divide-white/15 border-y border-white/15">
            {BUYERS.map((b) => (
              <li key={b.who} className="flex flex-wrap items-start gap-x-6 gap-y-2 py-4">
                <div className="min-w-0 flex-1">
                  <p className="goods-pitch-display text-xl">{b.who}</p>
                  <p className="mt-1 text-sm leading-6 text-goods-cream/80">{b.what}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">{b.source}</p>
                </div>
                <div className="flex gap-2">
                  <SolidityChip label={b.status} dark />
                  <SolidityChip label={b.label} dark />
                </div>
              </li>
            ))}
          </ul>
          <ol className="space-y-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta-light">Three ways to back the work</p>
            {THREE_DOORS.map((d, i) => (
              <li key={d.who} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-goods-terracotta font-mono text-sm font-bold text-white">{i + 1}</span>
                <div>
                  <p className="goods-pitch-display text-xl">{d.who}</p>
                  <p className="mt-1 text-sm leading-6 text-goods-cream/80">{d.does}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-10 rounded-md bg-goods-cream p-2 text-goods-ink">
          <Figure id="who-buys" />
        </div>
      </Chapter>

      {/* 07 Three jobs */}
      <Chapter id="money" muted>
        <Prose>
          <p>Money that buys beds. Money that runs the organisation. Money we borrow for the plants. One number never does two jobs: {aud(PROGRAM.costAud)} is the cost of the beds and nothing else.</p>
        </Prose>
        <Figure id="three-jobs" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <p className="goods-pitch-display text-2xl">Money that buys beds</p>
            <p className="mt-3 text-base leading-7">
              QBE&apos;s {aud(QBE_ASK.recommended.aud)}, Brian M. Davis up to {aud(bmdf.amountAud ?? 0)}, Snow, Minderoo, Dusseldorp, and the {alive.beds} beds ALIVE has already paid for. A bought-in kit costs about {aud(KIT_COST_AUD)} delivered, so the price leaves about {aud(STAYS_KIT_AUD)} on a bed. Bed money makes beds and nothing else.
            </p>
          </div>
          <div>
            <p className="goods-pitch-display text-2xl">Money that runs the organisation</p>
            <p className="mt-3 text-base leading-7">
              {THE_BLOCK.line} Tim Fairfax invited The Butterfly Movement on 31 August to apply for {aud(tfff.amountAud ?? 0)} over three years, and Katie Norman said the reason is the resilience of organisations doing good work. That is this money, in her words. Recommendation: Tim Fairfax runs the organisation and does not buy beds. Ben has not ruled. If year one goes to beds instead, the organisation is unfunded again.
            </p>
          </div>
          <div>
            <p className="goods-pitch-display text-2xl">Money we borrow for the plants</p>
            <p className="mt-3 text-base leading-7">
              SEFA at {aud(sefa.amountAud ?? 0)} and White Box at {aud(whiteBox.amountAud ?? 0)}, both still conversations. Neither can be written until a locally made bed has a measured cost and the borrower is settled. It is paid back from what Goods on Country makes on buyer orders, never out of a community&apos;s pool. The catch: at around {aud(STAYS_PRESSED_AUD)} a bed it takes about {bedsToRepay} buyer-bought beds a year for three years; at {aud(STAYS_KIT_AUD)} a bed it cannot be repaid.
            </p>
          </div>
        </div>
        <div className="mt-12">
          <StackExplorer />
        </div>
      </Chapter>

      {/* 08 Catalytic */}
      <Chapter id="catalytic">
        <Prose>
          <p>
            Jay&apos;s read on the 2 September call: this year the Steering Committee wants to prove that corporate philanthropy can bring other investment in, capital of any kind is looked on more favourably than philanthropy alone, more than one-to-one is what they want to see, and the further from {aud(QBE_ASK.full.aud)} the ask sits the more likely it is. The metric the program publishes is what its grants brought in beside them: $1.02M of grants beside $2.75M in 2025, 3.7x. Last year one enterprise asked for {aud(QBE_ASK.full.aud)}, showed $1.1M beside it and received $350,000.
          </p>
          <p>So the answer to what QBE starts is a sequence. We never say QBE doubles, triggers or guarantees anything.</p>
        </Prose>
        <Figure id="the-chain" />
        <ol className="mt-4 grid gap-6 md:grid-cols-5">
          {QBE_ASK.leverageChain.map((step, i) => (
            <li key={step.slice(0, 30)} className="border-t-2 border-goods-terracotta pt-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-goods-terracotta">Link {i + 1}</p>
              <p className="mt-2 text-sm leading-6">{step}</p>
            </li>
          ))}
        </ol>
        <Prose className="mt-10">
          <p>What is left after the money is spent is the test. Five communities holding beds, paid work assembling and delivering them, sales money where they chose to sell, and the say over what comes next. And a measured cost, so the plants can be financed.</p>
        </Prose>
      </Chapter>

      {/* 09 The snowball */}
      <Chapter id="snowball" muted>
        <Prose>
          <p>{SNOWBALL.direction}</p>
          <p>{SNOWBALL.honesty}</p>
        </Prose>
        <ol className="mt-10 grid gap-6 md:grid-cols-4">
          {SNOWBALL_STEPS.map((s, i) => (
            <li key={s.title} className="border-t-2 border-goods-terracotta pt-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-goods-terracotta">Step {i + 1}</p>
              <p className="goods-pitch-display mt-1 text-lg leading-snug">{s.title}</p>
              <p className="mt-2 text-sm leading-6 text-goods-sub">{s.body}</p>
            </li>
          ))}
        </ol>
        <Figure id="the-snowball" />
        <SnowballExplorer />
      </Chapter>

      {/* 10 Who decides */}
      <Chapter id="decides">
        <Figure id="who-decides" />
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Prose className="text-base leading-7">
            <p>
              <strong>The board governs.</strong> Purpose, shared assets, who is appointed, what gets reinvested. The directors are Kristy Bloomfield, Audrey Deemal and Jeremy Donovan. Kristy consented on 6 July and Audrey on 11 June 2026; the 20 July board meeting minuted both. The chair will be an Aboriginal director. The AGM is tentatively Monday 14 September.
            </p>
            <p>
              <strong>Goods on Country holds the work.</strong> The charity, the brand, the product, the IP, the fundraising, the shared services, the register and the evidence. It agrees the rules with each community, buys the beds, runs the first fifty through the press, and reports once a year against one set of numbers.
            </p>
            <p>
              <strong>Each community decides.</strong> Who gets beds, what is sold, who is paid, where the money goes, and whether and when to build. They are partners with their own boards. They are not part of the charity.
            </p>
            <p>
              <strong>The advisory committee</strong> meets monthly, eleven people, and brings First Nations leadership, manufacturing, social enterprise and funder experience close to the work. It advises. It is never called a board.
            </p>
          </Prose>
          <aside className="rounded-md border border-goods-grid bg-white p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">Six months in, four questions</p>
            <ol className="mt-4 space-y-3">
              {MONTH_SIX_QUESTIONS.map((q, i) => (
                <li key={q} className="flex gap-3 text-base">
                  <span className="font-mono text-sm text-goods-terracotta">{i + 1}.</span>
                  <span>{q}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm leading-6 text-goods-sub">Partial counts as no. Until the answers are yes, ownership is a pathway and every page says so.</p>
          </aside>
        </div>
      </Chapter>

      {/* 11 The entity */}
      <Chapter id="entity" muted>
        <Prose>
          <p>
            Since 28 August everything Goods sits in Goods on Country, a business name of The Butterfly Movement Ltd since 23 July 2026. Every funder&apos;s money already lands there: Tim Fairfax invited Butterfly, Brian M. Davis invited Goods On Country, Snow&apos;s grants go to Butterfly. A Curious Tractor entered the QBE cohort in March and is the historic maker, moving its assets across. The FY26 trading sits in Nic&apos;s sole trader books.
          </p>
        </Prose>
        <Figure id="entity-and-money" />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-md border-2 border-goods-terracotta bg-white p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">Recommended, subject to Social Impact Hub</p>
            <p className="goods-pitch-display mt-2 text-2xl">{ENTITY_ROUTE.recommended.applicant} applies and receives</p>
            <p className="mt-3 text-sm leading-6">{ENTITY_ROUTE.recommended.why}</p>
            <ul className="mt-3 space-y-1 text-sm leading-6 text-goods-sub">
              {ENTITY_ROUTE.recommended.related.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-md border border-goods-grid bg-white p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-sub">Fallback</p>
            <p className="goods-pitch-display mt-2 text-2xl">{ENTITY_ROUTE.fallback.applicant} applies</p>
            <p className="mt-3 text-sm leading-6">{ENTITY_ROUTE.fallback.why}</p>
            <p className="mt-3 text-sm leading-6 text-goods-sub">Either way, this is a trading enterprise and the form should read like one: {ENTITY_ROUTE.tradingFacts}</p>
          </div>
        </div>
      </Chapter>

      {/* 12 The measured run */}
      <Chapter id="measured">
        <figure>
          <div className="relative aspect-[21/9] overflow-hidden rounded-md bg-goods-sand">
            <Image src={MEASURED_RUN.photo} alt={MEASURED_RUN.alt} fill sizes="100vw" className="object-cover" />
          </div>
          <figcaption className="mt-2 text-xs text-goods-sub">{MEASURED_RUN.alt}</figcaption>
        </figure>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <Prose className="text-base leading-7">
            <p>{MEASURED_RUN.claim}</p>
            <p>So the first fifty beds of the first pool get counted properly:</p>
            <ul className="list-disc space-y-1 pl-6">
              {MEASURED_RUN.counts.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <p>{MEASURED_RUN.test}</p>
            <p>
              <strong>Open:</strong> {MEASURED_RUN.open}
            </p>
            <p>{TIMELINE_TARGETS.honesty}</p>
          </Prose>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">Four gates before the loop is real at a named site</p>
            <ol className="mt-4 space-y-4">
              {LOOP_GATES.map((g, i) => (
                <li key={g.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-goods-terracotta font-mono text-sm font-bold text-white">{i + 1}</span>
                  <div>
                    <p className="goods-pitch-display text-xl">{g.title}</p>
                    <p className="mt-1 text-sm leading-6 text-goods-sub">{g.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="mt-12">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">The plant, stage by stage</p>
          <ProductionFacilityExperience />
        </div>
      </Chapter>

      {/* 13 What changes */}
      <Chapter id="impact" dark>
        <Prose className="text-goods-cream/90">
          <p>
            {IMPACT_RULE} {HEALTH_RULE}
          </p>
        </Prose>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta-light">What changes</p>
            <ol className="mt-4 space-y-5">
              {OUTCOMES.map((o, i) => (
                <li key={o.title} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-goods-terracotta font-mono text-sm font-bold text-white">{i + 1}</span>
                  <div>
                    <p className="goods-pitch-display text-xl">
                      {o.title} <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">counted {o.counted}</span>
                    </p>
                    <p className="mt-1 text-sm leading-6 text-goods-cream/80">{o.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta-light">How we know</p>
            <ol className="mt-4 space-y-5">
              {HOW_WE_KNOW.map((h) => (
                <li key={h.title} className="border-l-2 border-goods-terracotta pl-4">
                  <p className="goods-pitch-display text-xl">{h.title}</p>
                  <p className="mt-1 text-sm leading-6 text-goods-cream/80">{h.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <ProductVideo videoUrl="/video/partners/oonchiumpa/karen-liddle-on-beds.mp4" thumbnailUrl="/video/partners/oonchiumpa/karen-liddle-on-beds-poster.jpg" title="Karen Liddle on the beds" />
          <ProductVideo videoUrl="/video/partners/centrecorp/utopia-delivery-road.mp4" thumbnailUrl="/video/partners/centrecorp/utopia-delivery-road-poster.jpg" title="The delivery road to the Utopia homelands" />
        </div>
      </Chapter>

      {/* 14 The calendar */}
      <Chapter id="calendar" muted>
        <Figure id="the-calendar" />
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <ol className="divide-y divide-goods-grid border-y border-goods-grid">
            {CALENDAR.map((e) => (
              <li key={e.date} className="flex gap-6 py-3">
                <span className={`w-32 shrink-0 font-mono text-[11px] uppercase tracking-[0.12em] ${e.big ? 'text-goods-terracotta' : 'text-goods-sub'}`}>{e.when}</span>
                <span className="text-sm leading-6">{e.what}</span>
              </li>
            ))}
          </ol>
          <Prose className="text-base leading-7">
            <p>Three applications close inside fourteen days to three funders who all want the same program described the same way. One strategy, three cuts.</p>
            <p>{CALENDAR_FAULT}</p>
          </Prose>
        </div>
      </Chapter>

      {/* 15 What is honest */}
      <Chapter id="honest">
        <Prose>
          <p>
            Every figure on every surface carries one of six labels. The rules that follow are enforced by guards that fail the build, and the page names which one.
          </p>
        </Prose>
        <div className="mt-6 flex flex-wrap gap-3">
          {(Object.keys(SOLIDITY_LABEL) as Solidity[]).map((k) => (
            <span key={k} className="flex items-center gap-2 text-xs text-goods-sub">
              <SolidityChip label={SOLIDITY_LABEL[k]} />
              {k === 'verified' && 'invoice, signed document, live register'}
              {k === 'workpaper' && 'our arithmetic, checkable'}
              {k === 'modelled' && 'built from verified inputs, not demonstrated'}
              {k === 'target' && 'a future state'}
              {k === 'conflict' && 'two figures coexist'}
              {k === 'retired' && 'do not use'}
            </span>
          ))}
        </div>
        <ol className="mt-10 divide-y divide-goods-grid border-y border-goods-grid">
          {HONEST_RULES.map((r) => (
            <li key={r.rule.slice(0, 40)} className="flex flex-wrap gap-x-8 gap-y-1 py-4">
              <p className="min-w-0 flex-1 text-base leading-7">{r.rule}</p>
              <p className="w-64 shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-goods-sub">{r.enforcedBy}</p>
            </li>
          ))}
        </ol>
      </Chapter>

      {/* 16 Questions */}
      <Chapter id="faq" muted>
        <Prose>
          <p>
            What we get asked, and what we say. Each answer is in the founders&apos; words and names its source. The ones marked open still need a person. When someone asks a new one, it goes in here the same day.
          </p>
        </Prose>
        <div className="mt-8">
          <FaqList />
        </div>
      </Chapter>

      {/* 17 To the deck */}
      <Chapter id="deck">
        <Prose>
          <p>
            The Pencil deck already follows the spine: ambition, problem, road, product, making, proof, governance, program, mechanism, decision. What this page adds is the drawn model and the live numbers. Each drawing maps to a slide, and the copy on the slide should be the copy on this page so that no figure does two jobs. Every drawing above downloads as SVG or PNG from its caption.
          </p>
        </Prose>
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-goods-ink font-mono text-[10px] uppercase tracking-[0.14em] text-goods-sub">
                <th className="py-2 pr-4">Slide</th>
                <th className="py-2 pr-4">What it carries</th>
                <th className="py-2">Source on this page</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-goods-grid">
              {DECK_MAP.map((r) => (
                <tr key={r.slide}>
                  <td className="py-3 pr-4 font-semibold">{r.slide}</td>
                  <td className="py-3 pr-4 leading-6">{r.carries}</td>
                  <td className="py-3 leading-6 text-goods-sub">{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">The drawings, and the frame each one feeds</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {QBE_DIAGRAMS.map((d) => (
              <li key={d.id} className="flex items-baseline justify-between gap-4 border-b border-goods-grid py-2 text-sm">
                <a href={`#diagram-${d.id}`} className="underline decoration-goods-grid underline-offset-4 hover:decoration-goods-terracotta">
                  {d.title}
                </a>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-goods-sub">{d.slide}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-10 text-sm leading-6 text-goods-sub">
          Related surfaces: the <Link href="/pitch/road" className="underline underline-offset-4">road pitch</Link>, the{' '}
          <Link href="/sites/qbe-readiness" className="underline underline-offset-4">readiness one-pager</Link>, the{' '}
          <Link href="/sites/qbe" className="underline underline-offset-4">capital evidence workspace</Link>, and the{' '}
          <Link href="/register" className="underline underline-offset-4">register</Link>. {CANONICAL_ASSETS.bedsDeployed} beds, {CANONICAL_ASSETS.communitiesServed} communities, {CANONICAL_ASSETS.washersInCommunity} washers.
        </p>
      </Chapter>
    </main>
  );
}
