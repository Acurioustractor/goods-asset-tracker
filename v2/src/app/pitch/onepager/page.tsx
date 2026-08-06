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
  { v: '$400K', l: 'The raise, signed by 31 Aug', chip: 'target' },
  { v: '$0', l: 'Signed today', chip: 'verified' },
];

const FACILITY = [
  { step: 'Stand it up', amount: '$112K–$222K', chip: 'modelled', line: 'Shredder, press, cutter, container, power. $110,046 of our own already in, beside this number, never subtracted.' },
  { step: 'Prove it', amount: '$60K–$80K', chip: 'target', line: 'Fifty beds, timed and costed with receipts. Turns $426 from modelled to measured.' },
  { step: 'Run it', amount: '~$109.5K a year', chip: 'workpaper', line: 'Shed, books, travel. A community site’s own cost is being settled with the first community.' },
];

export default function OnePagerPage() {
  return (
    <article className="mx-auto max-w-[820px] bg-[#fbf8f1] px-8 py-10 text-[#2b2a26] print:max-w-none print:px-0 print:py-0">
      {/* Masthead */}
      <header className="flex items-end justify-between border-b-2 border-[#2b2a26] pb-4">
        <Image src="/brand/canonical/goods-primary-ink.png" alt="Goods." width={600} height={234} className="h-9 w-auto object-contain" />
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#7a7363]">
          The road to ownership · one page
        </p>
      </header>

      {/* The claim */}
      <section className="mt-6">
        <h1 className="goods-pitch-display text-3xl leading-tight">{NORTH_STAR.headline}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6d675c]">
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
      <section className="mt-6 grid grid-cols-5 gap-px border border-[#2b2a26]/25 bg-[#2b2a26]/25 max-sm:grid-cols-2 print:grid-cols-5">
        {FIVE_NUMBERS.map((cell) => (
          <div key={cell.l} className="bg-[#fbf8f1] p-3">
            <p className={`goods-pitch-display text-2xl ${cell.v === '$0' ? 'text-[#c45c3e]' : ''}`}>{cell.v}</p>
            <p className="mt-1 text-[11px] leading-4 text-[#6d675c]">{cell.l}</p>
            <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-[#7a7363]">{cell.chip}</p>
          </div>
        ))}
      </section>

      {/* The ask, verbatim from the deck */}
      <section className="mt-5 border-l-2 border-[#c45c3e] pl-4">
        <p className="text-sm leading-6">{ASK_HEADLINE.line}</p>
      </section>

      {/* The facility */}
      <section className="mt-6">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#c45c3e]">What the money does</p>
        <div className="mt-3 grid gap-px border border-[#2b2a26]/25 bg-[#2b2a26]/25 sm:grid-cols-3">
          {FACILITY.map((cell, i) => (
            <div key={cell.step} className="bg-[#fbf8f1] p-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#c45c3e]">0{i + 1} · {cell.step}</p>
              <p className="goods-pitch-display mt-2 text-xl">{cell.amount}</p>
              <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#7a7363]">{cell.chip}</p>
              <p className="mt-2 text-[11px] leading-4 text-[#6d675c]">{cell.line}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Three ways in */}
      <section className="mt-6">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#c45c3e]">Three ways in</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          {DOORS.map((door) => (
            <div key={door.verb} className="border-t-2 border-[#c45c3e] pt-2">
              <p className="goods-pitch-display text-xl">{door.verb}</p>
              <p className="mt-1 text-[11px] leading-4 text-[#6d675c]">{door.entity}</p>
              <p className="mt-1 text-[11px] leading-4 text-[#6d675c]">{door.does}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 flex items-baseline justify-between border-t border-[#2b2a26]/25 pt-3">
        <p className="text-[11px] text-[#6d675c]">
          Watch the run: case study + film at{' '}
          <Link href="/case-studies/maningrida" className="underline decoration-[#c45c3e] underline-offset-2">
            /case-studies/maningrida
          </Link>{' '}
          · The whole road, with evidence:{' '}
          <Link href="/pitch/road" className="underline decoration-[#c45c3e] underline-offset-2">
            goodsoncountry.com/pitch/road
          </Link>{' '}
          · every figure&apos;s status at /register
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#7a7363]">
          hello@goodsoncountry.com
        </p>
      </footer>
    </article>
  );
}
