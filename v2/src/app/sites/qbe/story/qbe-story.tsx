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
  buyersFor,
  buyingStoryLine,
  CALENDAR,
  CALENDAR_FAULT,
  FOUR_TRUE,
  HEALTH_RULE,
  HONEST_RULES,
  HOW_WE_KNOW,
  IMPACT_RULE,
  LENDERS,
  LENDERS_LINE,
  MEASURED_RUN,
  MONTH_SIX_QUESTIONS,
  OTHER_LENDER_OPTIONS,
  OUTCOMES,
  PLAN_B,
  PROBLEM_FIGURES,
  PROBLEM_INTRO,
  PROBLEM_ROAD,
  PROBLEM_VOICES,
  PROOF_RUNS,
  SNOWBALL,
  SNOWBALL_STEPS,
  SPEED_NOTE,
  SUPPORTERS_OF_THE_ASK,
  THREE_DOORS,
  WHO_SELLS,
  buyingStoryFor,
  chaptersFor,
  cruxFor,
  storyChapter,
  type StoryAudience,
  type StoryChapterId,
} from '@/lib/data/qbe-story';
import { faqFor } from '@/lib/data/qbe-faq';
import { DECK_APPENDICES, DECK_PLAN } from '@/lib/data/deck-plan';
import { ATTACHMENT_SLOTS, CRITICAL_PATH, DECISIVE_QUESTIONS, FORM_QUESTIONS } from '@/lib/data/qbe-form';
import { diagramById, diagramsFor } from '@/lib/diagrams/qbe-diagrams';

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

/**
 * The story of the model, told by us. One component, two surfaces:
 *
 *   public   `/pitch/model`, open, first person, no internal notes. No form questions, no deck
 *            frames, no named foundation or lender, no open decision, no calendar.
 *   working  `/sites/qbe/story`, behind the investors gate. The same chapters plus the deck map,
 *            the form map, the funder lines by name, who asked each question, and what is open.
 *
 * Everything either surface says comes from `qbe-story.ts`, `qbe-faq.ts` and the drawings in
 * `lib/diagrams`, which read the guarded modules. This file only lays it out.
 */

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

function ChapterHead({ id, audience, dark = false }: { id: StoryChapterId; audience: StoryAudience; dark?: boolean }) {
  const c = storyChapter(id);
  const n = chaptersFor(audience).findIndex((x) => x.id === id) + 1;
  const working = audience === 'working';
  return (
    <header className="max-w-4xl">
      <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${dark ? 'text-goods-terracotta-light' : 'text-goods-terracotta'}`}>
        {String(n).padStart(2, '0')} · {c.kicker}
      </p>
      <h2 className="goods-pitch-display mt-3 text-3xl leading-tight md:text-5xl md:leading-[1.08]">{c.title}</h2>
      {working && (c.deckSlides.length > 0 || c.formQuestions.length > 0) && (
        <p className={`mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] print:hidden ${dark ? 'text-white/45' : 'text-goods-sub'}`}>
          {c.deckSlides.length > 0 && <span>Deck: {c.deckSlides.join(' · ')}</span>}
          {c.formQuestions.length > 0 && <span>Form: {c.formQuestions.join(', ')}</span>}
        </p>
      )}
    </header>
  );
}

function Chapter({ id, audience, dark = false, muted = false, children }: { id: StoryChapterId; audience: StoryAudience; dark?: boolean; muted?: boolean; children: React.ReactNode }) {
  const bg = dark ? 'bg-goods-ink text-goods-cream' : muted ? 'bg-goods-cream-muted' : 'bg-goods-cream';
  return (
    <section id={id} data-story-chapter={id} className={`scroll-mt-16 border-b border-goods-grid/60 px-6 py-16 md:px-10 md:py-20 lg:px-14 ${bg}`}>
      <div className="mx-auto max-w-[1500px]">
        <ChapterHead id={id} audience={audience} dark={dark} />
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function Figure({ id, audience }: { id: string; audience: StoryAudience }) {
  const d = diagramById(id);
  return <DiagramFigure id={d.id} title={d.title} caption={d.caption} slide={audience === 'working' ? d.slide : undefined} svg={d.svg(audience)} />;
}

function Prose({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`max-w-3xl space-y-5 text-lg leading-8 ${className}`}>{children}</div>;
}

function NumberedDot({ n }: { n: number }) {
  return <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-goods-terracotta font-mono text-sm font-bold text-white">{n}</span>;
}

export function QbeStory({ audience }: { audience: StoryAudience }) {
  const working = audience === 'working';
  const chapters = chaptersFor(audience);
  const crux = cruxFor(audience);
  const faq = faqFor(audience);
  const faqOpen = faq.filter((f) => f.status !== 'answered').length;

  return (
    <main className="bg-goods-cream text-goods-ink">
      <StoryChrome chapters={chapters} />

      {/* Cover */}
      <header className="story-cover relative overflow-hidden bg-goods-ink text-goods-cream">
        <Image src="/images/product/stretch-bed-hero.jpg" alt="The Stretch Bed on Country" fill priority sizes="100vw" className="object-cover opacity-40" />
        <div className="relative mx-auto flex min-h-[80svh] max-w-[1500px] flex-col justify-end px-6 py-16 md:px-10 lg:px-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-goods-terracotta-light">
            {working ? 'Goods on Country · QBE Catalysing Impact, Stage 2 · the working copy' : 'Goods on Country · the model, in full'}
          </p>
          <h1 className="goods-pitch-display mt-5 max-w-5xl text-4xl leading-[1.05] md:text-7xl">The first money buys beds for a community. The community sells them, and the money stays there to build the next thing.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-goods-cream/85">
            This is how we work, in full: every drawing, every number and where it comes from, the places that taught us, and the questions people keep asking us.
            {working ? ' The deck is cut from this page.' : ''}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#crux" className="border border-goods-terracotta bg-goods-terracotta px-5 py-3 text-sm font-semibold text-white">
              Start with the crux
            </a>
            <a href="#faq" className="border border-white/35 px-5 py-3 text-sm font-semibold text-white hover:border-white">
              The questions ({faq.length}, {faqOpen} open)
            </a>
            <Link href="/pitch/road" className="inline-flex items-center gap-1 border border-white/35 px-5 py-3 text-sm font-semibold text-white hover:border-white">
              The road <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
            {aud(SIGNED_TOTAL_AUD)} signed today · every figure carries its label · September 2026
          </p>
        </div>
      </header>

      {/* The crux */}
      <Chapter id="crux" audience={audience}>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <Prose className="text-xl leading-9">
            {crux.slice(1).map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </Prose>
          <aside className="space-y-4 border-l-2 border-goods-terracotta pl-6 text-sm leading-6 text-goods-sub">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">Three things that hold on every page of ours</p>
            <p>
              <strong className="text-goods-ink">{aud(PROGRAM.costAud)} is the cost of the beds.</strong> Never sales, never income.
            </p>
            <p>
              <strong className="text-goods-ink">A grant does not match anything.</strong>{' '}
              {working ? `${aud(QBE_ASK.recommended.aud)} is the ask; ${aud(QBE_ASK.smaller.aud)} is the smaller amount. Nothing else is signed today.` : 'Nothing is signed today, and we say so first.'}
            </p>
            <p>
              <strong className="text-goods-ink">No community is named beside a price</strong> until it has seen the design.
            </p>
          </aside>
        </div>
      </Chapter>

      {/* The problem */}
      <Chapter id="problem" audience={audience} muted>
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
          <ImpactStats title="What we have delivered so far" subtitle="Every count comes from our register." />
        </div>
      </Chapter>

      {/* The road */}
      <Chapter id="road" audience={audience}>
        <Prose>
          <p>
            Every stop is a person saying something, and each one taught us something the model now carries. The full road, with every voice, is{' '}
            <Link href="/pitch/road" className="underline decoration-goods-terracotta underline-offset-4">
              here
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
              <p className="mt-2 text-xs text-goods-sub">
                {utopia.inlineVideo.label}. {utopia.place}.
              </p>
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

      {/* One bed */}
      <Chapter id="bed" audience={audience} muted>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            {finishedBed && <ZoomableBedImage src={finishedBed.photo} alt={finishedBed.photoAlt} />}
            <p className="mt-3 text-xs leading-5 text-goods-sub">
              Two galvanised steel poles thread through the canvas sleeves and the top holes of two crossed recycled-plastic X-legs; tension makes the canvas structural. About five minutes to assemble, washable, repairable. Tap a part for its cost.
            </p>
          </div>
          <div>
            <Prose className="text-base leading-7">
              <p>One bed is {aud(BED_PRICE_AUD)}. Fifty beds is a tonne of plastic. Two hundred is a community&apos;s pool. What one bed does:</p>
            </Prose>
            <ol className="mt-6 space-y-5">
              {BED_UNIT.map((u, i) => (
                <li key={u.title} className="flex gap-4">
                  <NumberedDot n={i + 1} />
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
        <Figure id="the-unit" audience={audience} />
        <AmountExplorer audience={audience} />
      </Chapter>

      {/* The loop */}
      <Chapter id="loop" audience={audience}>
        <Prose>
          <p>
            The funder puts money in once. Five communities each get {POOL.beds} beds. From there it is theirs: what to give, what to sell, who to pay, what to build next. The money goes round inside the community. The drawing shows one community&apos;s loop, run five times.
          </p>
        </Prose>
        <Figure id="the-loop" audience={audience} />
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

      {/* Who buys */}
      <Chapter id="buyers" audience={audience} dark>
        <Prose className="text-goods-cream/90">
          <p>{crux[6]}</p>
          <p>{WHO_SELLS}</p>
        </Prose>
        <div className="mt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta-light">The buying story: every buyer who has paid</p>
          <p className="mt-3 max-w-3xl text-base leading-7 text-goods-cream/90">{buyingStoryLine(audience)}</p>
          <ol className="mt-5 divide-y divide-white/15 border-y border-white/15">
            {buyingStoryFor(audience).map((b) => (
              <li key={`${b.who}-${b.when}`} className="grid gap-x-6 gap-y-1 py-3 md:grid-cols-[140px_1fr_auto]">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/50">{b.when}</span>
                <span>
                  <span className="goods-pitch-display text-lg">{b.who}</span>
                  <span className="block text-sm leading-6 text-goods-cream/80">{b.what}</span>
                </span>
                <span className="flex items-start gap-2">
                  {working && <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">{b.paper}</span>}
                  <SolidityChip label={b.label} dark />
                </span>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <ul className="divide-y divide-white/15 border-y border-white/15">
            {buyersFor(audience).map((b) => (
              <li key={b.who} className="flex flex-wrap items-start gap-x-6 gap-y-2 py-4">
                <div className="min-w-0 flex-1">
                  <p className="goods-pitch-display text-xl">{b.who}</p>
                  <p className="mt-1 text-sm leading-6 text-goods-cream/80">{b.what}</p>
                  {working && <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">{b.source}</p>}
                </div>
                <div className="flex gap-2">
                  <SolidityChip label={b.status} dark />
                  <SolidityChip label={b.label} dark />
                </div>
              </li>
            ))}
          </ul>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta-light">Three ways to back the work</p>
            <ol className="mt-4 space-y-5">
              {THREE_DOORS.map((d, i) => (
                <li key={d.who} className="flex gap-4">
                  <NumberedDot n={i + 1} />
                  <div>
                    <p className="goods-pitch-display text-xl">{d.who}</p>
                    <p className="mt-1 text-sm leading-6 text-goods-cream/80">{d.does}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="mt-10 rounded-md bg-goods-cream p-2 text-goods-ink">
          <Figure id="who-buys" audience={audience} />
        </div>
      </Chapter>

      {/* Three kinds of money */}
      <Chapter id="money" audience={audience} muted>
        <Prose>
          <p>Money that buys beds. Money that runs the organisation. Money we borrow for the plants. One number never does two jobs: {aud(PROGRAM.costAud)} is the cost of the beds and nothing else.</p>
        </Prose>
        <Figure id="three-jobs" audience={audience} />
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <p className="goods-pitch-display text-2xl">Money that buys beds</p>
            <p className="mt-3 text-base leading-7">
              {working
                ? `QBE's ${aud(QBE_ASK.recommended.aud)}, Brian M. Davis up to ${aud(bmdf.amountAud ?? 0)}, Snow, Minderoo, Dusseldorp, and the ${alive.beds} beds ALIVE has already paid for. `
                : `A catalytic grant, three foundations that have asked us to apply, and the ${alive.beds} beds ALIVE has already paid for. `}
              A bought-in kit costs about {aud(KIT_COST_AUD)} delivered, so the price leaves about {aud(STAYS_KIT_AUD)} on a bed. Bed money makes beds and nothing else.
            </p>
          </div>
          <div>
            <p className="goods-pitch-display text-2xl">Money that runs the organisation</p>
            <p className="mt-3 text-base leading-7">
              {THE_BLOCK.line}{' '}
              {working
                ? `Tim Fairfax invited The Butterfly Movement on 31 August to apply for ${aud(tfff.amountAud ?? 0)} over three years, and Katie Norman said the reason is the resilience of organisations doing good work. That is this money, in her words. Recommendation: Tim Fairfax runs the organisation and does not buy beds. Ben has not ruled. If year one goes to beds instead, the organisation is unfunded again.`
                : 'A foundation has invited us to apply for three years of exactly this, and named the resilience of organisations doing good work as the reason. Bed money never funds it, and we say which is which.'}
            </p>
          </div>
          <div>
            <p className="goods-pitch-display text-2xl">Money we borrow for the plants</p>
            <p className="mt-3 text-base leading-7">
              {working
                ? `SEFA at ${aud(sefa.amountAud ?? 0)} and White Box at ${aud(whiteBox.amountAud ?? 0)}, both still conversations. Neither can be written until a locally made bed has a measured cost and the borrower is settled. `
                : 'Two lenders we are talking to, and nothing can be written until a locally made bed has a measured cost. '}
              It is paid back from what we make on buyer orders, never out of a community&apos;s pool. The catch: at around {aud(STAYS_PRESSED_AUD)} a bed{working ? ` it takes about ${bedsToRepay} buyer-bought beds a year for three years` : ' the plants can be financed from buyer orders'}; at {aud(STAYS_KIT_AUD)} a bed it cannot be repaid.
            </p>
          </div>
        </div>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {working ? (
            <div className="rounded-md border border-goods-grid bg-white p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">Who has said yes so far</p>
              <p className="mt-2 text-sm leading-6 text-goods-sub">Every line by name and status. Nothing is signed; invited means a written invitation to apply for a named amount, from a person the program can call.</p>
              <ul className="mt-4 divide-y divide-goods-grid">
                {SUPPORTERS_OF_THE_ASK.map((f) => (
                  <li key={f.who} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3">
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">{f.who}</span>
                      <span className="block text-xs leading-5 text-goods-sub">{f.what}</span>
                    </span>
                    <span className="text-sm font-semibold">{f.amount}</span>
                    <SolidityChip label={f.status} />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="rounded-md border border-goods-grid bg-white p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">Who has said yes so far</p>
              <p className="mt-3 text-base leading-7">
                Three foundations have asked us to apply for named amounts, each from a person the funder can call. One of them has invited us to apply for three years of the money that runs the organisation. ALIVE has paid for {alive.beds} beds. Nothing else is signed today, and we say so first.
              </p>
            </div>
          )}
          <div className="rounded-md border border-goods-grid bg-white p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">The plant money: lenders</p>
            <p className="mt-2 text-sm leading-6 text-goods-sub">{LENDERS_LINE}</p>
            {working ? (
              <>
                <ul className="mt-4 divide-y divide-goods-grid">
                  {LENDERS.map((l) => (
                    <li key={l.who} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-3">
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">{l.who}</span>
                        <span className="block text-xs leading-5 text-goods-sub">{l.what}</span>
                      </span>
                      <span className="text-sm font-semibold">{l.amount}</span>
                      <SolidityChip label={l.status} />
                    </li>
                  ))}
                </ul>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-goods-sub">Other options in the record</p>
                <ul className="mt-2 space-y-2">
                  {OTHER_LENDER_OPTIONS.map((o) => (
                    <li key={o.who} className="text-sm leading-6">
                      <span className="font-semibold">{o.who}.</span> {o.what}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="mt-3 text-base leading-7">Two lenders are in conversation with us for equipment and working capital, and the record holds a few more options behind them, including ones that open once the ownership decision is made. None can be written against a modelled cost.</p>
            )}
          </div>
        </div>
        {working && (
          <div className="mt-12">
            <StackExplorer />
          </div>
        )}
      </Chapter>

      {/* The first grant */}
      <Chapter id="catalytic" audience={audience}>
        <Prose>
          {working ? (
            <p>
              The program&apos;s read on the 2 September call: this year the Steering Committee wants to prove that corporate philanthropy can bring other investment in, capital of any kind is looked on more favourably than philanthropy alone, more than one-to-one is what they want to see, and the further from {aud(QBE_ASK.full.aud)} the ask sits the more likely it is. The metric the program publishes is what its grants brought in beside them: $1.02M of grants beside $2.75M in 2025, 3.7x. Last year one enterprise asked for {aud(QBE_ASK.full.aud)}, showed $1.1M beside it and received $350,000.
            </p>
          ) : (
            <p>A catalytic grant is judged on what it starts, and the program publishes what its grants have brought in beside them. So our answer is a sequence, never a total.</p>
          )}
          <p>We never say a grant doubles, triggers or guarantees anything.</p>
        </Prose>
        <Figure id="the-chain" audience={audience} />
        {working && (
          <ol className="mt-4 grid gap-6 md:grid-cols-5">
            {QBE_ASK.leverageChain.map((step, i) => (
              <li key={step.slice(0, 30)} className="border-t-2 border-goods-terracotta pt-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-goods-terracotta">Link {i + 1}</p>
                <p className="mt-2 text-sm leading-6">{step}</p>
              </li>
            ))}
          </ol>
        )}
        <Prose className="mt-10">
          <p>What is left after the money is spent is the test. Five communities holding beds, paid work assembling and delivering them, sales money where they chose to sell, and the say over what comes next. And a measured cost, so the plants can be financed.</p>
        </Prose>
        <div className="mt-12 rounded-md border border-goods-grid bg-white p-6 md:p-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">If the first grant does not come</p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="border-t-2 border-goods-terracotta pt-3">
                <dt className="text-sm font-semibold">Beds already paid for today</dt>
                <dd className="goods-pitch-display mt-1 text-3xl">{PLAN_B.bedsPaidToday}</dd>
                <dd className="mt-1 text-xs text-goods-sub">the floor, on an invoice</dd>
              </div>
              <div className="border-t-2 border-goods-terracotta pt-3">
                <dt className="text-sm font-semibold">Beds if every other line lands and QBE gives nothing</dt>
                <dd className="goods-pitch-display mt-1 text-3xl">{PLAN_B.bedsWithoutQbe.toLocaleString('en-AU')}</dd>
                <dd className="mt-1 text-xs text-goods-sub">about {PLAN_B.poolsWithoutQbe.toFixed(1)} pools of {POOL.beds}. Nothing is signed.</dd>
                <dd className="mt-2">
                  <SolidityChip label={PLAN_B.label} />
                </dd>
              </div>
            </dl>
            <ol className="space-y-3">
              {PLAN_B.lines.map((l, i) => (
                <li key={l.slice(0, 30)} className="flex gap-4 text-base leading-7">
                  <NumberedDot n={i + 1} />
                  <span>{l}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Chapter>

      {/* The snowball */}
      <Chapter id="snowball" audience={audience} muted>
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
        <Figure id="the-snowball" audience={audience} />
        <SnowballExplorer />
      </Chapter>

      {/* Who decides */}
      <Chapter id="decides" audience={audience}>
        <Figure id="who-decides" audience={audience} />
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Prose className="text-base leading-7">
            <p>
              <strong>Our board governs.</strong> Purpose, shared assets, who is appointed, what gets reinvested. The directors are Kristy Bloomfield, Audrey Deemal and Jeremy Donovan. Kristy consented on 6 July and Audrey on 11 June 2026; the 20 July board meeting minuted both. The chair will be an Aboriginal director.
              {working ? ' The AGM is tentatively Monday 14 September.' : ''}
            </p>
            <p>
              <strong>Goods on Country holds the work.</strong> The charity, the brand, the product, the IP, the fundraising, the shared services, the register and the evidence. We agree the rules with each community, buy the beds, run the first fifty through the press, and report once a year against one set of numbers.
            </p>
            <p>
              <strong>Each community decides.</strong> Who gets beds, what is sold, who is paid, where the money goes, and whether and when to build. They are partners with their own boards. They are not part of the charity.
            </p>
            <p>
              <strong>Our advisory committee</strong> meets monthly, eleven people, and brings First Nations leadership, manufacturing, social enterprise and funder experience close to the work. It advises. It is never called a board.
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
            <p className="mt-4 text-sm leading-6 text-goods-sub">Partial counts as no. Until the answers are yes, ownership is a pathway and every page of ours says so.</p>
          </aside>
        </div>
      </Chapter>

      {/* The entity */}
      <Chapter id="entity" audience={audience} muted>
        <Prose>
          <p>
            Since 28 August 2026 everything we do sits in Goods on Country, a business name of The Butterfly Movement Ltd since 23 July 2026, a registered charity since 2012 with deductible gift status.{' '}
            {working
              ? "Every funder's money already lands there: Tim Fairfax invited Butterfly, Brian M. Davis invited Goods On Country, Snow's grants go to Butterfly. A Curious Tractor entered the QBE cohort in March and is the historic maker, moving its assets across. The FY26 trading sits in Nic's sole trader books."
              : 'Every grant we receive lands there. A Curious Tractor, the company we started and made the first beds through, is moving the products, IP and equipment across.'}
          </p>
        </Prose>
        <Figure id="entity-and-money" audience={audience} />
        {working ? (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-md border-2 border-goods-terracotta bg-white p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">Ruled 5 September 2026</p>
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
        ) : (
          <div className="rounded-md border border-goods-grid bg-white p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">A trading enterprise inside a charity</p>
            <p className="mt-3 max-w-3xl text-base leading-7">
              We sell beds at {aud(BED_PRICE_AUD)} to buyers, and a buyer has paid for {alive.beds} up front. The charity holds the products, the IP, the making and the money, under an Indigenous-led board. Community partners are independent organisations with their own boards, and are never part of the charity.
            </p>
          </div>
        )}
      </Chapter>

      {/* The measured run */}
      <Chapter id="measured" audience={audience}>
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
              <strong>Still open:</strong> {MEASURED_RUN.open}
            </p>
            <p>{TIMELINE_TARGETS.honesty}</p>
          </Prose>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">Four gates before the loop is real at a named site</p>
            <ol className="mt-4 space-y-4">
              {LOOP_GATES.map((g, i) => (
                <li key={g.title} className="flex gap-4">
                  <NumberedDot n={i + 1} />
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
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">Our plant, stage by stage</p>
          <ProductionFacilityExperience />
        </div>
      </Chapter>

      {/* What changes */}
      <Chapter id="impact" audience={audience} dark>
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
                  <NumberedDot n={i + 1} />
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

      {/* The calendar: working copy only */}
      {working && (
        <Chapter id="calendar" audience={audience} muted>
          <Figure id="the-calendar" audience={audience} />
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
      )}

      {/* What is honest */}
      <Chapter id="honest" audience={audience}>
        <Prose>
          <p>Every figure we publish carries one of six labels. The rules that follow hold on every page of ours{working ? ', and the working copy names the guard that enforces each one' : ''}.</p>
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
              {working && <p className="w-64 shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-goods-sub">{r.enforcedBy}</p>}
            </li>
          ))}
        </ol>
      </Chapter>

      {/* Questions */}
      <Chapter id="faq" audience={audience} muted>
        <Prose>
          <p>
            What we get asked, and what we say. The ones marked open are the ones we do not have an answer to yet, and we would rather say so. When someone asks us a new one, it goes in here.
          </p>
        </Prose>
        <div className="mt-8">
          <FaqList audience={audience} />
        </div>
      </Chapter>

      {/* The form, question by question: working copy only */}
      {working && (
        <Chapter id="form" audience={audience}>
          <Prose>
            <p>
              Twenty-five questions. Five of them decide the outcome ({DECISIVE_QUESTIONS.join(', ')}), because the program says the catalytic effect is a core criterion and reads it out of the amount, the use of funds, the fallback and the other funders. Every row below names what the assessor is actually testing, what we hold today, and the one person who closes the gap.
            </p>
          </Prose>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[1040px] text-left text-sm">
              <thead>
                <tr className="border-b border-goods-ink font-mono text-[10px] uppercase tracking-[0.14em] text-goods-sub">
                  <th className="py-2 pr-4">Q</th>
                  <th className="py-2 pr-4">It asks</th>
                  <th className="py-2 pr-4">What it is really testing</th>
                  <th className="py-2 pr-4">What we hold</th>
                  <th className="py-2 pr-4">The gap</th>
                  <th className="py-2 pr-4">Who</th>
                  <th className="py-2">Carried by</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-goods-grid">
                {FORM_QUESTIONS.map((q) => {
                  const decisive = (DECISIVE_QUESTIONS as readonly string[]).includes(q.id);
                  return (
                    <tr key={q.id} className={`align-top ${decisive ? 'bg-goods-sand/40' : ''}`}>
                      <td className="py-3 pr-4 font-mono text-xs font-semibold">{q.id}</td>
                      <td className="py-3 pr-4 text-xs leading-5">{q.asks}</td>
                      <td className="py-3 pr-4 text-xs leading-5">{q.reallyTesting}</td>
                      <td className="py-3 pr-4 text-xs leading-5 text-goods-sub">{q.weHold || '—'}</td>
                      <td className="py-3 pr-4 text-xs leading-5">{q.gap || <span className="text-goods-sub">done</span>}</td>
                      <td className="py-3 pr-4">
                        <SolidityChip label={q.owner === 'done' ? 'ready' : q.owner} />
                      </td>
                      <td className="py-3 text-[11px] leading-4 text-goods-sub">
                        {q.slide ? `Slide ${q.slide}` : ''}
                        {q.slide && q.chapter ? ' · ' : ''}
                        {q.chapter ? storyChapter(q.chapter).label : ''}
                        {q.attachment ? <span className="block">{q.attachment}</span> : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">Where an assessor pushes, and what we say</p>
              <ol className="mt-4 space-y-4">
                {FORM_QUESTIONS.filter((q) => q.pressure).map((q) => (
                  <li key={q.id} className="border-l-2 border-goods-terracotta pl-4">
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-goods-sub">{q.id} · {q.asks}</p>
                    <p className="mt-1 text-sm leading-6">{q.pressure}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">The order it has to happen in</p>
              <ol className="mt-4 space-y-4">
                {CRITICAL_PATH.map((step, i) => (
                  <li key={step.what.slice(0, 30)} className="flex gap-4">
                    <NumberedDot n={i + 1} />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-goods-sub">
                        {step.when} · {step.owner}
                      </p>
                      <p className="mt-1 text-sm leading-6">{step.what}</p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-goods-terracotta">Unblocks {step.unblocks.join(', ')}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">The attachment run</p>
              <ul className="mt-3 space-y-1 text-sm">
                {ATTACHMENT_SLOTS.map((a) => (
                  <li key={a.id} className="flex items-baseline justify-between gap-4 border-b border-goods-grid py-1.5">
                    <span>
                      <span className="font-mono text-xs">{a.id}</span> {a.slot}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-goods-sub">{a.ready ? 'ready' : a.owner}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Chapter>
      )}

      {/* To the deck: working copy only */}
      {working && (
        <Chapter id="deck" audience={audience}>
          <Prose>
            <p>
              Twelve slides, each a conclusion, each cut from a chapter above and answering a question on the form. The review of the current deck is in <code>deliverables/deck-review-2026-09.md</code>; this table is the plan the rebuild works from. Every drawing above downloads as SVG or PNG from its caption.
            </p>
          </Prose>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead>
                <tr className="border-b border-goods-ink font-mono text-[10px] uppercase tracking-[0.14em] text-goods-sub">
                  <th className="py-2 pr-4">#</th>
                  <th className="py-2 pr-4">The slide says</th>
                  <th className="py-2 pr-4">It carries</th>
                  <th className="py-2 pr-4">Form</th>
                  <th className="py-2 pr-4">Cut from</th>
                  <th className="py-2 pr-4">Frame</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-goods-grid">
                {DECK_PLAN.map((sl) => (
                  <tr key={sl.n} className="align-top">
                    <td className="py-3 pr-4 font-mono text-xs">{String(sl.n).padStart(2, '0')}</td>
                    <td className="py-3 pr-4">
                      <span className="block font-semibold">{sl.title}</span>
                      <span className="block text-xs leading-5 text-goods-sub">{sl.says}</span>
                    </td>
                    <td className="py-3 pr-4 text-xs leading-5">
                      {sl.carries}
                      {sl.drawing && (
                        <a href={`#diagram-${sl.drawing}`} className="ml-1 underline decoration-goods-grid underline-offset-4">
                          drawing
                        </a>
                      )}
                    </td>
                    <td className="py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.12em] text-goods-sub">{sl.answers.join(' ')}</td>
                    <td className="py-3 pr-4 text-xs">
                      <a href={`#${sl.chapter}`} className="underline decoration-goods-grid underline-offset-4">
                        {storyChapter(sl.chapter).label}
                      </a>
                    </td>
                    <td className="py-3 pr-4 font-mono text-[10px] text-goods-sub">{sl.frame ?? 'new'}</td>
                    <td className="py-3">
                      <SolidityChip label={sl.status} />
                      <span className="mt-1 block text-[11px] leading-4 text-goods-sub">{sl.note}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">After the twelve, for the review meeting</p>
            <ul className="mt-3 space-y-1 text-sm">
              {DECK_APPENDICES.map((a) => (
                <li key={a.title}>
                  <span className="font-semibold">{a.title}.</span> <span className="text-goods-sub">{a.note}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">The drawings, and the frame each one feeds</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {diagramsFor('working').map((d) => (
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
            Related surfaces: the public <Link href="/pitch/model" className="underline underline-offset-4">model page</Link>, the{' '}
            <Link href="/pitch/road" className="underline underline-offset-4">road pitch</Link>, the{' '}
            <Link href="/sites/qbe-readiness" className="underline underline-offset-4">readiness one-pager</Link>, the{' '}
            <Link href="/sites/qbe" className="underline underline-offset-4">capital evidence workspace</Link>, and the{' '}
            <Link href="/register" className="underline underline-offset-4">register</Link>. {CANONICAL_ASSETS.bedsDeployed} beds, {CANONICAL_ASSETS.communitiesServed} communities, {CANONICAL_ASSETS.washersInCommunity} washers.
          </p>
        </Chapter>
      )}

      {!working && (
        <footer className="bg-goods-ink px-6 py-12 text-goods-cream md:px-10 lg:px-14">
          <div className="mx-auto max-w-[1500px] text-sm leading-6 text-goods-cream/80">
            <p>
              The road, with every voice, is at{' '}
              <Link href="/pitch/road" className="underline underline-offset-4">
                the road pitch
              </Link>
              . Every count we publish is in{' '}
              <Link href="/register" className="underline underline-offset-4">
                the register
              </Link>
              . {CANONICAL_ASSETS.bedsDeployed} beds, {CANONICAL_ASSETS.communitiesServed} communities, {CANONICAL_ASSETS.washersInCommunity} washers.
            </p>
          </div>
        </footer>
      )}
    </main>
  );
}
