/**
 * The Stretch Bed one-pager (/onepagers/stretch-bed) — the product sheet, printable.
 *
 * Every spec renders from STRETCH_BED in products.ts, the single source of truth, so this
 * sheet cannot drift from the shop or the wiki. The $750 price is a price a buyer acts on
 * (commerce, not investor prose) and this route is allowlisted for exactly that one figure
 * in scripts/check-money-prose.mjs.
 */
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { STRETCH_BED, PLASTIC_KG_PER_BED } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'The Stretch Bed — one page',
  description: 'The flat-packable, washable bed designed in community for remote Australia. Specs, materials and how it goes together, on one page.',
  robots: { index: false, follow: false },
};

const SPEC_ROWS = [
  { label: 'Weight', value: STRETCH_BED.specs.weight },
  { label: 'Load capacity', value: STRETCH_BED.specs.loadCapacity },
  { label: 'Dimensions', value: STRETCH_BED.specs.dimensions },
  { label: 'Assembly', value: `${STRETCH_BED.specs.assemblyTime}, no tools` },
  { label: 'Design life', value: `${STRETCH_BED.specs.designLifespan} (design intent)` },
  { label: 'Plastic diverted', value: STRETCH_BED.specs.plasticDiverted },
];

const MATERIALS = [
  STRETCH_BED.materials.legs,
  STRETCH_BED.materials.frame,
  STRETCH_BED.materials.sleepingSurface,
] as const;

export default function StretchBedOnePagerPage() {
  return (
    <article className="mx-auto max-w-[820px] bg-[#fbf8f1] px-8 py-10 text-[#2b2a26] print:max-w-none print:px-0 print:py-0">
      <header className="flex items-end justify-between border-b-2 border-[#2b2a26] pb-4">
        <Image src="/brand/canonical/goods-primary-ink.png" alt="Goods." width={600} height={234} className="h-9 w-auto object-contain" />
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#7a7363]">
          The Stretch Bed · one page
        </p>
      </header>

      <section className="mt-6">
        <h1 className="goods-pitch-display text-3xl leading-tight">{STRETCH_BED.name}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6d675c]">
          {STRETCH_BED.tagline} Designed in community for the conditions that break ordinary
          furniture: heat, dust, freight, and crowded houses. A good bed is health hardware,
          not furniture.
        </p>
      </section>

      {/* The bed, real */}
      <section className="mt-5 grid grid-cols-3 gap-1">
        {[
          { src: '/images/product/stretch-bed-hero.jpg', alt: 'The Stretch Bed, assembled' },
          { src: '/images/product/stretch-bed-detail.jpg', alt: 'Recycled-HDPE X-trestle leg detail' },
          { src: '/images/product/stretch-bed-kids-building.jpg', alt: 'Kids assembling a Stretch Bed' },
        ].map((photo) => (
          <div key={photo.src} className="relative aspect-[4/3] overflow-hidden">
            <Image src={photo.src} alt={photo.alt} fill sizes="33vw" className="object-cover" />
          </div>
        ))}
      </section>

      {/* Specs + how it goes together */}
      <section className="mt-6 grid gap-6 sm:grid-cols-2 print:grid-cols-2">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#c45c3e]">Specifications</p>
          <dl className="mt-2">
            {SPEC_ROWS.map((row) => (
              <div key={row.label} className="flex justify-between border-b border-[#2b2a26]/10 py-1.5">
                <dt className="text-[11px] text-[#6d675c]">{row.label}</dt>
                <dd className="text-[12px] font-medium text-[#2b2a26]">{row.value}</dd>
              </div>
            ))}
            <div className="flex justify-between py-1.5">
              <dt className="text-[11px] text-[#6d675c]">Price</dt>
              <dd className="goods-pitch-display text-lg text-[#c45c3e]">$750</dd>
            </div>
          </dl>
        </div>
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#c45c3e]">How it goes together</p>
          <p className="mt-2 text-[12px] leading-5 text-[#4a463d]">
            Two galvanised steel poles thread through the canvas long-edge sleeves and the top
            holes of two crossed-plank X-legs. Tensioning pulls the poles deep into the leg
            holes, so the canvas itself is structural: the bed will not stand without it, and
            nothing needs a screw or a tool.
          </p>
          <ul className="mt-3 space-y-2">
            {MATERIALS.map((material) => (
              <li key={material.name} className="border-l-2 border-[#c45c3e] pl-3">
                <p className="text-[12px] font-medium">{material.name}</p>
                <p className="text-[11px] leading-4 text-[#6d675c]">
                  {material.detail} · {material.supplier}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] leading-4 text-[#6d675c]">
            Every bed carries {PLASTIC_KG_PER_BED}kg of recycled HDPE out of landfill, pressed
            into legs at a plant that can move to community ownership.
          </p>
        </div>
      </section>

      <footer className="mt-8 flex items-baseline justify-between border-t border-[#2b2a26]/25 pt-3">
        <p className="text-[11px] text-[#6d675c]">
          Buy or sponsor a bed:{' '}
          <Link href="/shop/stretch-bed-single" className="underline decoration-[#c45c3e] underline-offset-2">
            goodsoncountry.com/shop
          </Link>{' '}
          · see one built in community:{' '}
          <Link href="/case-studies/maningrida" className="underline decoration-[#c45c3e] underline-offset-2">
            /case-studies/maningrida
          </Link>
        </p>
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#7a7363]">
          hello@goodsoncountry.com
        </p>
      </footer>
    </article>
  );
}
