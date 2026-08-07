/**
 * The investor one-pager (/pitch/onepager) — the sendable, printable single page.
 *
 * One spine, many cuts (Ben, 2026-08-06): this page WRITES NOTHING NEW. Every figure and
 * sentence renders from the same modules the deck reads (canon via asset-canonical,
 * ask-surface, road-ending), so the PDF a funder holds can never disagree with /pitch/road.
 * Print it with the browser (Cmd+P): the layout is built to land on one A4 page.
 *
 * Money figures follow the one-money-surface rule: this route lives under /pitch/, the
 * allowed money family in scripts/check-money-prose.mjs.
 */
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { ASK_HEADLINE } from '@/lib/data/ask-surface';
import { DOORS } from '@/lib/data/road-ending';
import { NORTH_STAR } from '@/lib/data/content';

export const metadata: Metadata = {
  title: 'Goods on Country — one page',
  description: 'The road to ownership on one page: the numbers, the facility, the three ways in.',
  robots: { index: false, follow: false },
};

const FIVE_NUMBERS = [
  { v: '$750', l: 'A bed sells for', chip: 'verified' },
  { v: '~$685', l: 'To make + truck today', chip: 'verified' },
  { v: '~$426', l: 'Pressing our own legs', chip: 'modelled' },
  { v: '$300K', l: 'Annual funding Goods needs', chip: 'target' },
  { v: '$0', l: 'Signed today', chip: 'verified' },
];

const FACILITY = [
  { step: 'Community facility', amount: 'Up to $222K', chip: 'capital per full facility', line: 'A complete production facility, or a smaller set of modules shaped around what a community needs and already has.' },
  { step: 'Keep making beds', amount: '$100K a year', chip: 'production funding', line: 'Continue production at the farm and The Harvest while on-Country facilities are developed.' },
  { step: 'Keep Goods working', amount: '$200K a year', chip: 'organisation funding', line: 'Visit communities, develop products and support community-led enterprises to grow and take on production.' },
];

export default function OnePagerPage() {
  return (
    <article className="mx-auto max-w-[820px] bg-goods-cream px-8 py-10 text-goods-ink print:max-w-none print:px-0 print:py-0">
      {/* Masthead */}
      <header className="flex items-end justify-between border-b-2 border-goods-ink pb-4">
        <Image src="/brand/canonical/goods-primary-ink.png" alt="Goods." width={600} height={234} className="h-9 w-auto object-contain" />
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-goods-sub">
          The road to ownership · one page
        </p>
      </header>

      {/* The claim */}
      <section className="mt-6">
        <h1 className="goods-pitch-display text-3xl leading-tight">{NORTH_STAR.headline}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-goods-sub">
          Beds built for remote communities: {CANONICAL_ASSETS.bedsDeployed} delivered across{' '}
          {CANONICAL_ASSETS.communitiesServed} communities, {CANONICAL_ASSETS.washersInCommunity} washing
          machines in homes, {CANONICAL_ASSETS.plasticKg.toLocaleString()}kg of recycled plastic in bed
          legs. The making is proven at our own facility; the goal is a community that owns it.
        </p>
      </section>

      {/* Proof photos: the making and the delivery, one strip. Real photos, never
          illustrations. Same consent class as the deck (all ship in /public). */}
      <section className="mt-5 grid grid-cols-3 gap-1">
        {[
          { src: '/images/community/maningrida/whole-run-at-sunset.jpg', alt: 'The forty-bed Maningrida run at sunset' },
          { src: '/images/process/heat-press-full.jpg', alt: 'The heat press at the production facility' },
          { src: '/images/community/maningrida/kids-carrying-orange-bed.jpg', alt: 'Kids carrying an orange Stretch Bed in Maningrida' },
        ].map((photo) => (
          <div key={photo.src} className="relative aspect-[4/3] overflow-hidden">
            <Image src={photo.src} alt={photo.alt} fill sizes="33vw" className="object-cover" />
          </div>
        ))}
      </section>

      {/* Five numbers */}
      <section className="mt-6 grid grid-cols-5 gap-px border border-goods-ink/25 bg-goods-ink/25 max-sm:grid-cols-2 print:grid-cols-5">
        {FIVE_NUMBERS.map((cell) => (
          <div key={cell.l} className="bg-goods-cream p-3">
            <p className={`goods-pitch-display text-2xl ${cell.v === '$0' ? 'text-goods-terracotta' : ''}`}>{cell.v}</p>
            <p className="mt-1 text-[11px] leading-4 text-goods-sub">{cell.l}</p>
            <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-goods-sub">{cell.chip}</p>
          </div>
        ))}
      </section>

      {/* The ask, verbatim from the deck */}
      <section className="mt-5 border-l-2 border-goods-terracotta pl-4">
        <p className="text-sm leading-6">{ASK_HEADLINE.line}</p>
      </section>

      {/* The facility */}
      <section className="mt-6">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-goods-terracotta">What the money does</p>
        <div className="mt-3 grid gap-px border border-goods-ink/25 bg-goods-ink/25 sm:grid-cols-3">
          {FACILITY.map((cell, i) => (
            <div key={cell.step} className="bg-goods-cream p-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-goods-terracotta">0{i + 1} · {cell.step}</p>
              <p className="goods-pitch-display mt-2 text-xl">{cell.amount}</p>
              <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-goods-sub">{cell.chip}</p>
              <p className="mt-2 text-[11px] leading-4 text-goods-sub">{cell.line}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Three ways in */}
      <section className="mt-6">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-goods-terracotta">Three ways in</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {DOORS.map((door) => (
            <div key={door.verb} className="border-t-2 border-goods-terracotta pt-2">
              <p className="goods-pitch-display text-xl">{door.verb}</p>
              <p className="mt-1 text-[11px] leading-4 text-goods-sub">{door.entity}</p>
              <p className="mt-1 text-[11px] leading-4 text-goods-sub">{door.does}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 flex items-baseline justify-between border-t border-goods-ink/25 pt-3">
        <p className="text-[11px] text-goods-sub">
          Watch the run: case study + film at{' '}
          <Link href="/case-studies/maningrida" className="underline decoration-goods-terracotta underline-offset-2">
            /case-studies/maningrida
          </Link>{' '}
          · The whole road, with evidence:{' '}
          <Link href="/pitch/road" className="underline decoration-goods-terracotta underline-offset-2">
            goodsoncountry.com/pitch/road
          </Link>{' '}
          · every figure&apos;s status at /register
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-goods-sub">
          hello@goodsoncountry.com
        </p>
      </footer>
    </article>
  );
}
