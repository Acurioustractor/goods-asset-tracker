/**
 * The Goods one-pager (/onepagers/goods) — how the whole thing works, on one printed page.
 *
 * The plain-language cut of the spine for anyone: a community organisation, a school, a
 * visitor to the factory. The drawn process illustrations live here (plastic loop, the
 * container, the handover) because this is the page whose job is "show me how it works".
 * No investor money on this surface: figures stay on /pitch/road (one-money-surface rule).
 * Print with the browser (Cmd+P): built to land on one A4 page.
 */
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { PLASTIC_KG_PER_BED } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'How Goods works — one page',
  description: 'Plastic in, beds out, and the making moving toward community ownership. The whole model on one printable page.',
  robots: { index: false, follow: false },
};

const STEPS = [
  {
    n: '01',
    title: 'Communities ask',
    line: 'It starts with a request: beds that survive heat, dust, freight and crowded houses. The products are designed in community, led by community.',
  },
  {
    n: '02',
    title: 'Plastic becomes beds',
    line: `Waste HDPE is shredded, pressed into planks, and cut into X-trestle legs. Every bed carries ${PLASTIC_KG_PER_BED}kg of recycled plastic out of landfill.`,
  },
  {
    n: '03',
    title: 'The making travels',
    line: 'The whole plant fits in shipping containers, so production can happen close to the communities the beds are for, with young people on the tools.',
  },
  {
    n: '04',
    title: 'Ownership moves',
    line: 'The goal was never a bigger Goods. It is a community that can collect the plastic, make the goods, and come to own the making. That transfer is a pathway, and we are on it.',
  },
];

export default function GoodsOnePagerPage() {
  return (
    <article className="mx-auto max-w-[820px] bg-[#fbf8f1] px-8 py-10 text-[#2b2a26] print:max-w-none print:px-0 print:py-0">
      <header className="flex items-end justify-between border-b-2 border-[#2b2a26] pb-4">
        <Image src="/brand/canonical/goods-primary-ink.png" alt="Goods." width={600} height={234} className="h-9 w-auto object-contain" />
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#7a7363]">
          How it works · one page
        </p>
      </header>

      <section className="mt-6">
        <h1 className="goods-pitch-display text-3xl leading-tight">
          Plastic in, beds out, and the making moving On Country.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6d675c]">
          Goods builds essential health hardware with remote First Nations communities:{' '}
          {CANONICAL_ASSETS.bedsDeployed} beds delivered across {CANONICAL_ASSETS.communitiesServed}{' '}
          communities, {CANONICAL_ASSETS.washersInCommunity} washing machines in homes, and{' '}
          {CANONICAL_ASSETS.plasticKg.toLocaleString()}kg of recycled plastic now holding people off
          the ground. A good bed is health hardware, not furniture.
        </p>
      </section>

      {/* The loop, drawn */}
      <section className="mt-6 grid grid-cols-3 gap-3">
        {[
          { src: '/images/brand/goods-ill-plastic-loop.jpg', alt: 'Drawn loop: shredded plastic becomes a pressed sheet becomes X-trestle bed legs', caption: 'Waste plastic becomes the bed' },
          { src: '/images/brand/goods-ill-container-interior.jpg', alt: 'Drawn shipping container holding the shred, press and assemble stations', caption: 'The plant fits in a container' },
          { src: '/images/brand/goods-ill-handover.jpg', alt: 'Drawn hands passing a bed and a growing plant toward open community hands', caption: 'The making is handed over' },
        ].map((ill) => (
          <figure key={ill.src}>
            <div className="relative aspect-[16/9] overflow-hidden border border-[#2b2a26]/15 bg-[#faf6ec]">
              <Image src={ill.src} alt={ill.alt} fill sizes="33vw" className="object-cover" />
            </div>
            <figcaption className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-[#7a7363]">
              {ill.caption}
            </figcaption>
          </figure>
        ))}
      </section>

      {/* Four steps */}
      <section className="mt-6 grid gap-px border border-[#2b2a26]/25 bg-[#2b2a26]/25 sm:grid-cols-4 print:grid-cols-4">
        {STEPS.map((step) => (
          <div key={step.n} className="bg-[#fbf8f1] p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#c45c3e]">
              {step.n} · {step.title}
            </p>
            <p className="mt-2 text-[11px] leading-4 text-[#6d675c]">{step.line}</p>
          </div>
        ))}
      </section>

      {/* Proof photo strip: the drawn model, then the real thing happening. */}
      <section className="mt-5 grid grid-cols-3 gap-1">
        {[
          { src: '/images/process/heat-press-full.jpg', alt: 'The heat press at the production facility' },
          { src: '/images/community/maningrida/whole-run-at-sunset.jpg', alt: 'The forty-bed Maningrida run at sunset' },
          { src: '/images/community/maningrida/kids-carrying-orange-bed.jpg', alt: 'Kids carrying an orange Stretch Bed in Maningrida' },
        ].map((photo) => (
          <div key={photo.src} className="relative aspect-[4/3] overflow-hidden">
            <Image src={photo.src} alt={photo.alt} fill sizes="33vw" className="object-cover" />
          </div>
        ))}
      </section>

      <footer className="mt-8 flex items-baseline justify-between border-t border-[#2b2a26]/25 pt-3">
        <p className="text-[11px] text-[#6d675c]">
          The proven run:{' '}
          <Link href="/case-studies/maningrida" className="underline decoration-[#c45c3e] underline-offset-2">
            goodsoncountry.com/case-studies/maningrida
          </Link>{' '}
          · the Stretch Bed:{' '}
          <Link href="/onepagers/stretch-bed" className="underline decoration-[#c45c3e] underline-offset-2">
            /onepagers/stretch-bed
          </Link>{' '}
          · the facility:{' '}
          <Link href="/onepagers/facility" className="underline decoration-[#c45c3e] underline-offset-2">
            /onepagers/facility
          </Link>
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#7a7363]">
          hello@goodsoncountry.com
        </p>
      </footer>
    </article>
  );
}
