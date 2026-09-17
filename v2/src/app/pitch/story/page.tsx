import type { Metadata } from 'next';
import Image from 'next/image';
import { ModelScrolly } from '@/components/story/model-scrolly';
import { PanelCard } from '@/components/model/model-placemat';
import { deckSlides } from '@/lib/data/deck';
import { PANELS } from '@/lib/data/model-placemat';
import { goodsBoard } from '@/lib/data/goods-board';
import { QUESTIONS, QUESTIONS_OPEN_COUNT } from '@/lib/data/story-questions';
import { CHAPTERS, GATES, MAKE_STEPS, MONEY_LANES, PROBLEM_FIGURES, REQUEST, STORY_UPDATED, chapter, type StoryChapter, type StoryPhoto } from '@/lib/data/story-spine';

/**
 * The story of Goods on Country, scrolled. Nine chapters in the deck's order; the trade in the
 * middle is the sticky centrepiece, drawn from the same data as the placemat. The pitch layout
 * keeps it out of search results. Words in story-spine.ts, never here.
 */
export const metadata: Metadata = {
  title: { absolute: 'The story | Goods on Country' },
  description: 'Useful goods start community enterprise. How the trade works, where it has been, what it costs and what we will measure.',
  robots: { index: false, follow: false },
};

const roadStops = deckSlides.filter((slide) => slide.kind === 'stop');

function Photo({ photo, sizes = '(min-width: 1024px) 50vw, 100vw', priority = false }: { photo: StoryPhoto; sizes?: string; priority?: boolean }) {
  return (
    <figure className="m-0">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-goods-sand">
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
      <figcaption className="mt-2 text-sm text-[#7a7363]">{photo.place}</figcaption>
    </figure>
  );
}

function Status({ c }: { c: StoryChapter }) {
  if (c.status === 'settled' && !c.open) return null;
  return (
    <p className="mt-8 max-w-2xl rounded-xl border border-dashed border-[#c18a7b] bg-[#fbf3ee] px-4 py-3 text-sm text-[#7a4a3c]">
      {c.status === 'draft' ? 'Draft words. ' : ''}
      {c.open}
    </p>
  );
}

function ChapterHead({ c, dark = false }: { c: StoryChapter; dark?: boolean }) {
  return (
    <div className="max-w-4xl">
      <p className={`font-display text-2xl ${dark ? 'text-goods-terracotta-light' : 'text-goods-terracotta'}`}>{c.number}</p>
      <h2 className={`mt-2 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.01em] text-balance md:text-6xl ${dark ? 'text-goods-cream' : 'text-goods-ink'}`}>
        {c.title}
      </h2>
    </div>
  );
}

function Lines({ lines, dark = false }: { lines: readonly string[]; dark?: boolean }) {
  return (
    <div className={`space-y-4 text-lg leading-relaxed md:text-xl ${dark ? 'text-goods-cream/85' : 'text-[#4a4741]'}`}>
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}

function Chapter({ c, children, dark = false }: { c: StoryChapter; children?: React.ReactNode; dark?: boolean }) {
  return (
    <section id={c.id} className={`scroll-mt-28 border-t px-6 py-20 md:px-10 md:py-28 lg:px-14 ${dark ? 'border-transparent bg-goods-ink' : 'border-[#e6dfd1] bg-goods-cream'}`}>
      <div className="mx-auto max-w-6xl">
        <ChapterHead c={c} dark={dark} />
        {children}
        <Status c={c} />
      </div>
    </section>
  );
}

export default function StoryPage() {
  const crux = chapter('crux');
  const problem = chapter('problem');
  const method = chapter('method');
  const road = chapter('road');
  const make = chapter('make');
  const trade = chapter('trade');
  const money = chapter('money');
  const evidence = chapter('evidence');
  const close = chapter('close');
  const questions = chapter('questions');

  return (
    <main className="bg-goods-cream text-goods-ink">
      <nav className="sticky top-16 z-20 border-b border-[#e6dfd1] bg-goods-cream/90 backdrop-blur" aria-label="Chapters">
        <div className="mx-auto flex max-w-6xl items-center gap-4 overflow-x-auto px-6 py-3 text-sm md:px-10 lg:px-14">
          <span className="whitespace-nowrap font-semibold">Goods on Country</span>
          <span className="whitespace-nowrap text-[#7a7363]">The story · draft, {STORY_UPDATED}</span>
          <span className="flex-1" />
          {CHAPTERS.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="whitespace-nowrap text-[#5d574c] hover:text-goods-terracotta">
              {c.label}
            </a>
          ))}
        </div>
      </nav>

      {/* 1 · The crux */}
      <section id="crux" className="relative scroll-mt-14">
        {crux.photo && (
          <div className="relative min-h-[82vh]">
            <Image src={crux.photo.src} alt={crux.photo.alt} fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-goods-ink/85 via-goods-ink/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 px-6 pb-14 md:px-10 lg:px-14">
              <div className="mx-auto max-w-6xl">
                <h1 className="max-w-4xl font-display text-5xl font-semibold leading-[1.0] tracking-[-0.01em] text-goods-cream text-balance md:text-7xl">{crux.title}</h1>
                <p className="mt-6 max-w-3xl text-lg leading-relaxed text-goods-cream/90 md:text-2xl">{crux.lines[0]}</p>
                <p className="mt-6 text-sm text-goods-cream/60">{crux.photo.place}</p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2 · The problem */}
      <Chapter c={problem}>
        <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-start">
          <Lines lines={problem.lines} />
          {problem.photo && <Photo photo={problem.photo} />}
        </div>
        <ul className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4" aria-label="Four figures">
          {PROBLEM_FIGURES.map((f) => (
            <li key={f.id} className="border-t border-[#e6dfd1] pt-5">
              <p className="text-sm font-semibold text-goods-terracotta">{f.area}</p>
              <p className="mt-2 font-display text-5xl font-semibold leading-none text-goods-ink">{f.value}</p>
              <p className="mt-3 text-[15px] leading-snug text-[#4a4741]">{f.what}</p>
              {f.note && <p className="mt-2 text-[13px] leading-snug text-[#7a7363]">{f.note}</p>}
              <p className="mt-3 text-[12px] leading-snug text-[#7a7363]">
                <a href={f.sourceUrl} className="underline decoration-[#c18a7b] underline-offset-2 hover:text-goods-terracotta" target="_blank" rel="noreferrer">
                  {f.source}
                </a>
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-[#7a7363]">Context, not results. None of these figures is an outcome of Goods’ work.</p>
      </Chapter>

      {/* 3 · How Goods works, and who holds it */}
      <Chapter c={method}>
        <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-start">
          {method.photo && <Photo photo={method.photo} />}
          <Lines lines={method.lines} />
        </div>
        <h3 className="mt-16 font-display text-3xl font-semibold text-goods-ink">Who holds the work</h3>
        <p className="mt-2 max-w-2xl text-[#4a4741]">The directors of Goods on Country Ltd, formerly The Butterfly Movement Ltd. The board handover is in progress.</p>
        <ul className="mt-8 grid gap-8 sm:grid-cols-3">
          {goodsBoard.map((d) => (
            <li key={d.name}>
              <div className="relative aspect-square overflow-hidden rounded-[18px] bg-goods-sand">
                <Image src={d.photo} alt={`${d.name}, ${d.role}`} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
              </div>
              <p className="mt-4 font-display text-2xl font-semibold leading-tight">{d.name}</p>
              <p className="text-sm text-[#7a7363]">
                {d.role} · {d.country}
              </p>
              <p className="mt-3 text-[15px] leading-snug text-[#4a4741]">{d.goods}</p>
            </li>
          ))}
        </ul>
      </Chapter>

      {/* 4 · The road */}
      <Chapter c={road}>
        <div className="mt-10 max-w-3xl">
          <Lines lines={road.lines.slice(0, 1)} />
        </div>
        <ol className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {roadStops.map((stop, i) => (
            <li key={stop.id}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-goods-sand">
                <Image src={stop.photo} alt={stop.photoAlt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </div>
              <p className="mt-4 font-display text-xl text-goods-terracotta">{i + 1}</p>
              <h3 className="mt-1 font-display text-xl font-semibold leading-tight text-balance">{stop.headline}</h3>
              <p className="mt-2 text-sm text-[#7a7363]">{stop.place}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {road.lines.slice(1).map((line) => (
            <p key={line} className="text-lg leading-relaxed text-[#4a4741]">
              {line}
            </p>
          ))}
        </div>
      </Chapter>

      {/* 5 · What we make */}
      <Chapter c={make}>
        <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-start">
          <Lines lines={make.lines} />
          {make.photo && <Photo photo={make.photo} />}
        </div>
        <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MAKE_STEPS.map((step, i) => (
            <li key={step.id}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[18px] bg-goods-sand">
                <Image src={step.photo.src} alt={step.photo.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
              </div>
              <p className="mt-3 font-display text-lg font-semibold">
                <span className="mr-2 text-goods-terracotta">{i + 1}</span>
                {step.title}
              </p>
            </li>
          ))}
        </ol>
      </Chapter>

      {/* 6 · The trade, scrolled */}
      <Chapter c={trade}>
        <div className="mt-6 max-w-3xl">
          <Lines lines={trade.lines} />
        </div>
        <div className="mt-12">
          <ModelScrolly />
        </div>
      </Chapter>

      {/* 7 · The money */}
      <Chapter c={money} dark>
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
        <div className="mt-14 grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <p className="text-sm text-goods-cream/60">The QBE request</p>
            <p className="mt-2 font-display text-4xl font-semibold leading-tight text-goods-cream text-balance md:text-5xl">{REQUEST.headline}</p>
          </div>
          <p className="text-goods-cream/80">{REQUEST.note}</p>
        </div>
        <div className="mt-10 max-w-3xl">
          <Lines lines={money.lines.slice(1)} dark />
        </div>
      </Chapter>

      {/* 8 · What we will measure */}
      <Chapter c={evidence}>
        <div className="mt-10 max-w-3xl">
          <Lines lines={evidence.lines.slice(0, 1)} />
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" style={{ ['--paper' as string]: '#fbf8f1' }}>
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
      </Chapter>

      {/* 9 · The close */}
      <Chapter c={close}>
        <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-start">
          <Lines lines={close.lines} />
          {close.photo && <Photo photo={close.photo} />}
        </div>
      </Chapter>

      {/* 10 · The questions */}
      <Chapter c={questions}>
        <div className="mt-8 max-w-3xl">
          <Lines lines={questions.lines} />
          <p className="mt-3 text-sm text-[#7a7363]">
            {QUESTIONS.length} questions, {QUESTIONS_OPEN_COUNT} still open or partly answered.
          </p>
        </div>
        <dl className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="border-t border-[#e6dfd1] pt-5">
              <dt className="font-display text-2xl font-semibold leading-tight text-goods-ink text-balance">{q.question}</dt>
              <dd className="mt-3 text-[16px] leading-relaxed text-[#4a4741]">
                {q.answer || <span className="text-goods-terracotta">Open. We do not yet have an answer we would say out loud.</span>}
                {q.status === 'partly' && <span className="ml-2 text-sm text-[#7a7363]">Partly answered.</span>}
              </dd>
            </div>
          ))}
        </dl>
      </Chapter>
    </main>
  );
}
