import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getCuratedQuotes } from '@/lib/data/curated-quotes';
import { isClearedForExternal } from '@/lib/data/cleared-voices';
import { ORGANISATION } from '@/lib/data/organisation';
import {
  AR_CHAPTERS, AR_FUNDERS, AR_MONEY, AR_NOT_CLAIMED, AR_NUMBERS, AR_SINCE, AR_VOICE_NAMES, AR_YEAR,
} from '@/lib/data/annual-report';

/**
 * ANNUAL REPORT, FY26. Narrative report built from the same records as /pitch. Content lives in
 * lib/data/annual-report.ts; quotes are read from the curated store and only for cleared voices.
 */
export const metadata: Metadata = {
  title: `Annual report ${AR_YEAR.label}`,
  description: `Goods on Country, ${AR_YEAR.span}: the beds, the places, the people and what we count.`,
};

function quoteFor(name: string): string | null {
  if (!isClearedForExternal(name)) return null;
  return getCuratedQuotes(name)?.[0]?.text ?? null;
}

const PORTRAITS: Record<string, string> = {
  'Gloria Turner': '/images/people/gloria-turner.jpg',
  'Jimmy Frank': '/images/people/jimmy-frank.jpg',
  'Dianne Stokes': '/images/people/dianne-stokes.jpg',
};
const PLACES: Record<string, string> = { 'Gloria Turner': 'Kalgoorlie', 'Jimmy Frank': 'Tennant Creek', 'Dianne Stokes': 'Tennant Creek' };

export default function AnnualReportPage() {
  const chapterVoices = new Set(AR_CHAPTERS.map((c) => c.voice?.name).filter(Boolean));
  const wall = AR_VOICE_NAMES.filter((n) => !chapterVoices.has(n) && quoteFor(n));

  return (
    <main className="bg-goods-cream text-goods-ink">
      <section className="px-6 pb-12 pt-12 md:px-10 md:pb-16 md:pt-20 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta">Annual report · {AR_YEAR.label}</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-[-0.01em] text-balance md:text-7xl">
            A year of beds made with community.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#4a4741] md:text-xl">
            {AR_YEAR.span}. {ORGANISATION.boardLine} This is the year told through the places, the people and the records.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-6xl gap-px overflow-hidden rounded-[24px] border border-[#e6dfd1] bg-[#e6dfd1] sm:grid-cols-2 lg:grid-cols-4">
          {AR_NUMBERS.map((n) => (
            <div key={n.line} className="bg-white p-6">
              <p className="font-display text-5xl font-semibold">{n.value}</p>
              <p className="mt-2 text-sm leading-snug text-[#5d574c]">{n.line}</p>
            </div>
          ))}
        </div>
      </section>

      {AR_CHAPTERS.map((c, i) => {
        const q = c.voice ? quoteFor(c.voice.name) : null;
        return (
          <section key={c.title} className={`border-t border-[#e6dfd1] px-6 py-14 md:px-10 md:py-20 lg:px-14 ${i % 2 ? 'bg-[#FDF8F3]' : ''}`}>
            <div className={`mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-goods-sand">
                <Image src={c.photo} alt={c.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta">{c.when}</p>
                <h2 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-4xl">{c.title}</h2>
                <p className="mt-4 text-lg leading-relaxed text-[#4a4741]">{c.body}</p>
                {c.voice && q && (
                  <figure className="mt-8 flex gap-4 border-l-2 border-goods-terracotta pl-5">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-goods-sand">
                      <Image src={c.voice.portrait} alt={c.voice.name} fill sizes="56px" className="object-cover" />
                    </div>
                    <div>
                      <blockquote className="font-display text-xl italic leading-snug">“{q}”</blockquote>
                      <figcaption className="mt-2 text-sm text-[#7a7363]">{c.voice.name}, {c.voice.place}</figcaption>
                    </div>
                  </figure>
                )}
              </div>
            </div>
          </section>
        );
      })}

      {wall.length > 0 && (
        <section className="border-t border-[#e6dfd1] bg-goods-ink px-6 py-16 text-goods-cream md:px-10 md:py-20 lg:px-14">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
            {wall.map((n) => (
              <figure key={n} className="flex gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-goods-sand">
                  <Image src={PORTRAITS[n]} alt={n} fill sizes="64px" className="object-cover" />
                </div>
                <div>
                  <blockquote className="font-display text-2xl italic leading-snug">“{quoteFor(n)}”</blockquote>
                  <figcaption className="mt-2 text-sm opacity-70">{n}, {PLACES[n]}</figcaption>
                </div>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-[#e6dfd1] px-6 py-16 md:px-10 md:py-20 lg:px-14">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-semibold md:text-4xl">Who backed the year.</h2>
            <p className="mt-4 text-[#4a4741]">In order of arrival.</p>
            <ul className="mt-6 space-y-4">
              {AR_FUNDERS.map((g) => (
                <li key={g.funder} className="border-b border-[#e6dfd1] pb-4">
                  <p className="font-semibold">{g.funder}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#5d574c]">{g.bought}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold md:text-4xl">{AR_MONEY.headline}.</h2>
            <p className="mt-4 text-lg leading-relaxed text-[#4a4741]">{AR_MONEY.body}</p>
            <h3 className="mt-10 font-display text-2xl font-semibold">What we do not claim.</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[#4a4741]">
              {AR_NOT_CLAIMED.map((l) => <li key={l}>{l}</li>)}
            </ul>
            <h3 className="mt-10 font-display text-2xl font-semibold">Since the year closed.</h3>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[#4a4741]">
              {AR_SINCE.map((l) => <li key={l}>{l}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-[#e6dfd1] bg-[#FDF8F3] px-6 py-14 md:px-10 lg:px-14">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-4">
          {[
            { href: '/pitch', label: 'The whole story and the model' },
            { href: '/who-we-are', label: 'The board and the entity' },
            { href: '/beds', label: 'The Stretch Bed' },
            { href: '/impact', label: 'What we count' },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="rounded-full border border-goods-ink px-5 py-2 text-sm font-semibold hover:bg-goods-ink hover:text-goods-cream">
              {l.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
