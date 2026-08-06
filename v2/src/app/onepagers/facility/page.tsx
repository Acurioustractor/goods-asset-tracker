/**
 * The production facility one-pager (/onepagers/facility) — the plant on one printed page.
 *
 * High level and deliberately money-free: what the facility is, what the machines do, and
 * how a community can work with it. Written for a partner or community organisation holding
 * the page in their hands, not a funder. Investor figures live on /pitch/road
 * (one-money-surface rule); the working-together language follows the pathway model
 * (modules a community picks from, ownership as a pathway, never claimed complete).
 */
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCTION_FACILITY, PLASTIC_KG_PER_BED } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'The production facility — one page',
  description: 'A containerised plastic re-production plant: shred, press, cut, assemble. What it is and how communities can work with it.',
  robots: { index: false, follow: false },
};

const WORK_TOGETHER = [
  {
    title: 'Host a run',
    line: 'The containers come to your community for a production run. Local young people build the beds for local families, the way the forty-bed Maningrida run was pressed and assembled.',
  },
  {
    title: 'Feed the loop',
    line: `Collect the plastic. Every bed takes ${PLASTIC_KG_PER_BED}kg of waste HDPE, so a community collection point turns a local waste problem into local beds.`,
  },
  {
    title: 'Walk the ownership road',
    line: 'Train on the machines, take on modules one at a time, and move the making closer to community ownership. The pace and the destination are decided with each community.',
  },
];

export default function FacilityOnePagerPage() {
  return (
    <article className="mx-auto max-w-[820px] bg-[#fbf8f1] px-8 py-10 text-[#2b2a26] print:max-w-none print:px-0 print:py-0">
      <header className="flex items-end justify-between border-b-2 border-[#2b2a26] pb-4">
        <Image src="/brand/canonical/goods-primary-ink.png" alt="Goods." width={600} height={234} className="h-9 w-auto object-contain" />
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#7a7363]">
          The production facility · one page
        </p>
      </header>

      <section className="mt-6">
        <h1 className="goods-pitch-display text-3xl leading-tight">
          A factory that fits in shipping containers.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6d675c]">
          {PRODUCTION_FACILITY.type}: waste plastic goes in one end, bed legs come out the other.
          Because the whole plant is containerised it can travel to where the plastic and the
          people are, run for a season, and stay if a community wants to make it theirs.
          Capacity is {PRODUCTION_FACILITY.capacity.replace('~', 'around ')}.
        </p>
      </section>

      {/* The real plant */}
      <section className="mt-5 grid grid-cols-3 gap-1">
        {[
          { src: '/images/process/heat-press-full.jpg', alt: 'The heat press, pressing shredded HDPE into planks' },
          { src: '/images/process/cnc-router-full.jpg', alt: 'The CNC router cutting pressed planks into X-trestle legs' },
          { src: '/images/process/20260329-factory-panorama.jpg', alt: 'The production facility floor, March 2026' },
        ].map((photo) => (
          <div key={photo.src} className="relative aspect-[4/3] overflow-hidden">
            <Image src={photo.src} alt={photo.alt} fill sizes="33vw" className="object-cover" />
          </div>
        ))}
      </section>

      {/* What happens inside, drawn */}
      <section className="mt-6 grid gap-4 sm:grid-cols-[1.2fr_1fr] print:grid-cols-[1.2fr_1fr]">
        <figure>
          <div className="relative aspect-[16/9] overflow-hidden border border-[#2b2a26]/15 bg-[#faf6ec]">
            <Image
              src="/images/brand/goods-ill-container-interior.jpg"
              alt="Drawn container interior: shred, then press, then assemble"
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>
          <figcaption className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-[#7a7363]">
            One container: shred · press · assemble
          </figcaption>
        </figure>
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#c45c3e]">The machines</p>
          <ul className="mt-2 space-y-1">
            {PRODUCTION_FACILITY.machines.map((machine) => (
              <li key={machine} className="border-b border-[#2b2a26]/10 pb-1 text-[12px] leading-5 text-[#4a463d]">
                {machine}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] leading-4 text-[#6d675c]">
            {PRODUCTION_FACILITY.future}. The press that makes bed legs is the press that makes
            what a community decides comes next.
          </p>
        </div>
      </section>

      {/* Working together */}
      <section className="mt-6">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#c45c3e]">
          How communities work with it
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-3 print:grid-cols-3">
          {WORK_TOGETHER.map((way) => (
            <div key={way.title} className="border-t-2 border-[#c45c3e] pt-2">
              <p className="goods-pitch-display text-xl">{way.title}</p>
              <p className="mt-1 text-[11px] leading-4 text-[#6d675c]">{way.line}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="mt-8 flex items-baseline justify-between border-t border-[#2b2a26]/25 pt-3">
        <p className="text-[11px] text-[#6d675c]">
          The proven run:{' '}
          <Link href="/case-studies/maningrida" className="underline decoration-[#c45c3e] underline-offset-2">
            goodsoncountry.com/case-studies/maningrida
          </Link>{' '}
          · start a yarn about a pathway:{' '}
          <Link href="/pathways" className="underline decoration-[#c45c3e] underline-offset-2">
            /pathways
          </Link>
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#7a7363]">
          hello@goodsoncountry.com
        </p>
      </footer>
    </article>
  );
}
