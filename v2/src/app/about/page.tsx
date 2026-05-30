import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Goods on Country is a social enterprise designing, manufacturing, and transferring essential health hardware to remote First Nations communities across Australia.',
  alternates: {
    canonical: 'https://www.goodsoncountry.com/about',
  },
  openGraph: {
    title: 'About Goods on Country',
    description:
      'Goods on Country designs, manufactures and transfers practical health hardware for remote First Nations communities across Australia.',
    url: 'https://www.goodsoncountry.com/about',
    images: [
      {
        url: 'https://www.goodsoncountry.com/images/people/xavier-stretch-bed-alice-springs.jpg',
        width: 1200,
        height: 800,
        alt: 'Xavier with his Stretch Bed at Oonchiumpa, Alice Springs',
      },
    ],
  },
};

const CREAM = '#FDF8F3';
const RUST = '#C45C3E';
const CHARCOAL = '#2E2E2E';
const SAGE = '#8B9D77';

const FACTS = [
  { value: String(CANONICAL_ASSETS.bedsDeployed), label: 'beds across Australia' },
  { value: String(CANONICAL_ASSETS.washersWorking), label: 'washing machines confirmed on Country' },
  { value: String(CANONICAL_ASSETS.communitiesServed), label: 'communities partnered' },
  { value: '20kg', label: 'plastic diverted per bed' },
];

const VALUES = [
  {
    title: 'Community-led design',
    body: 'Products are refined around the fire with Elders and families. We listen first, design second, build third.',
  },
  {
    title: 'Made On-Country',
    body: 'Manufacturing happens close to the communities served. Local repairability, local skills, local jobs.',
  },
  {
    title: 'Earned, not given',
    body: 'Commerce over charity. Every bed is paid for at fair market rates and built to outlast its warranty.',
  },
  {
    title: 'Community ownership',
    body: "Our long-term goal is to transfer manufacturing to community-owned enterprises. We become unnecessary.",
  },
];

export default function AboutPage() {
  return (
    <main style={{ backgroundColor: CREAM, color: CHARCOAL }}>
      {/* Hero — the elevator pitch */}
      <section className="px-6 sm:px-8 pt-16 sm:pt-24 pb-12 max-w-3xl mx-auto">
        <p
          className="text-xs uppercase tracking-[0.25em] mb-5"
          style={{ color: RUST }}
        >
          About Goods on Country
        </p>
        <h1
          className="font-display text-4xl sm:text-6xl leading-[1.05] tracking-tight mb-6"
          style={{ color: CHARCOAL }}
        >
          Made by community.<br />Made for community.
        </h1>
        <p className="text-lg sm:text-xl leading-relaxed mb-8" style={{ color: `${CHARCOAL}cc` }}>
          Goods on Country is a social enterprise designing, manufacturing, and transferring
          essential health hardware to remote First Nations communities across Australia. Beds.
          Washing machines. A manufacturing model that stays with the communities it serves.
        </p>
        <p className="text-lg leading-relaxed mb-10" style={{ color: `${CHARCOAL}cc` }}>
          We started in 2023 with a question about preventable disease. We&apos;ve since
          delivered 496 beds across 9 communities, and the model is now
          headed toward community ownership.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/story"
            className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-base font-semibold transition"
            style={{ backgroundColor: CHARCOAL, color: CREAM }}
          >
            Read the full story →
          </Link>
          <Link
            href="/shop/stretch-bed-single"
            className="inline-flex items-center gap-2 rounded-md border px-5 py-3 text-base font-semibold transition"
            style={{ borderColor: `${CHARCOAL}33`, color: CHARCOAL }}
          >
            Shop the Stretch Bed
          </Link>
        </div>
      </section>

      {/* Hero image — Xavier with his Stretch Bed at Oonchiumpa */}
      <section className="px-6 sm:px-8 max-w-4xl mx-auto pb-14">
        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-3xl shadow-sm">
          <Image
            src="/images/people/xavier-stretch-bed-alice-springs.jpg"
            alt="Xavier with his Stretch Bed at Oonchiumpa, Alice Springs"
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover"
            priority
          />
        </div>
        <p className="mt-3 text-sm" style={{ color: `${CHARCOAL}99` }}>
          Xavier with his Stretch Bed. Oonchiumpa, Alice Springs.
        </p>
      </section>

      {/* Facts strip */}
      <section className="px-6 sm:px-8 max-w-3xl mx-auto pb-14">
        <div
          className="rounded-3xl px-6 sm:px-8 py-7 sm:py-9 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center"
          style={{ backgroundColor: `${SAGE}1A`, border: `1px solid ${SAGE}33` }}
        >
          {FACTS.map((f) => (
            <div key={f.label}>
              <div className="font-display text-3xl sm:text-4xl leading-none" style={{ color: CHARCOAL }}>
                {f.value}
              </div>
              <div className="mt-2 text-xs sm:text-sm leading-snug" style={{ color: `${CHARCOAL}99` }}>
                {f.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Two-up image grid — making + using */}
      <section className="px-6 sm:px-8 max-w-4xl mx-auto pb-14">
        <div className="grid sm:grid-cols-2 gap-4">
          <figure>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
              <Image
                src="/images/process/heat-press-full.jpg"
                alt="The heat press at the Goods workshop, turning shredded HDPE plastic into bed leg sheets"
                fill
                sizes="(max-width: 640px) 100vw, 512px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-2 text-sm" style={{ color: `${CHARCOAL}99` }}>
              Pressing recycled HDPE into bed legs.
            </figcaption>
          </figure>
          <figure>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
              <Image
                src="/images/product/stretch-bed-community.jpg"
                alt="Dianne Stokes standing next to her Stretch Bed on Country in Tennant Creek"
                fill
                sizes="(max-width: 640px) 100vw, 512px"
                className="object-cover"
              />
            </div>
            <figcaption className="mt-2 text-sm" style={{ color: `${CHARCOAL}99` }}>
              Dianne Stokes with her Stretch Bed.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* What we believe */}
      <section className="px-6 sm:px-8 max-w-3xl mx-auto pb-14">
        <p
          className="text-xs uppercase tracking-[0.25em] mb-4"
          style={{ color: RUST }}
        >
          What we believe
        </p>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
          {VALUES.map((v) => (
            <div key={v.title}>
              <h3 className="font-display text-xl mb-2" style={{ color: CHARCOAL }}>
                {v.title}
              </h3>
              <p className="text-base leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* The team */}
      <section className="px-6 sm:px-8 max-w-3xl mx-auto pb-14">
        <p
          className="text-xs uppercase tracking-[0.25em] mb-4"
          style={{ color: RUST }}
        >
          The team
        </p>
        <p className="text-base leading-relaxed mb-8" style={{ color: `${CHARCOAL}cc` }}>
          Goods on Country is a project of A Curious Tractor, founded by Nicholas Marchesi
          and Benjamin Knight in 2023. The day-to-day is run by a small team of designers,
          engineers, and community members across Brisbane, Tennant Creek, and the Top End.
          Elders and community partners shape every product before it reaches a home.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          <figure className="flex items-center gap-4">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-full">
              <Image
                src="/images/people/dianne-stokes.jpg"
                alt="Warumungu Elder Dianne Stokes"
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <figcaption className="text-sm leading-relaxed" style={{ color: `${CHARCOAL}99` }}>
              <span className="block font-semibold" style={{ color: CHARCOAL }}>
                Dianne Stokes
              </span>
              Warumungu Elder. Named the Pakkimjalki Kari washing machine in her language. Tennant Creek.
            </figcaption>
          </figure>

          <figure className="flex items-center gap-4">
            <div className="relative h-20 w-32 sm:h-24 sm:w-36 shrink-0 overflow-hidden rounded-2xl">
              <Image
                src="/images/people/nic-and-ben-warumungu.jpg"
                alt="Nic Marchesi and Ben Knight, co-founders of Goods on Country"
                fill
                sizes="144px"
                className="object-cover"
              />
            </div>
            <figcaption className="text-sm leading-relaxed" style={{ color: `${CHARCOAL}99` }}>
              <span className="block font-semibold" style={{ color: CHARCOAL }}>
                Nic and Ben
              </span>
              From the Goods on Country project. A Curious Tractor co-founders.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Closing CTA */}
      <section
        className="px-6 sm:px-8 py-12 mt-6"
        style={{ backgroundColor: CHARCOAL, color: CREAM }}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl mb-3">
            Want the long version?
          </h2>
          <p className="text-base sm:text-lg leading-relaxed mb-6" style={{ color: `${CREAM}cc` }}>
            From the conference room where it started, to the bed legs going onto a truck for
            Utopia Homelands. The story has Elders, engineers, and a lot of plastic.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/story"
              className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-base font-semibold transition"
              style={{ backgroundColor: RUST, color: CREAM }}
            >
              Read the full story →
            </Link>
            <Link
              href="/partner"
              className="inline-flex items-center gap-2 rounded-md border px-5 py-3 text-base font-semibold transition"
              style={{ borderColor: `${CREAM}33`, color: CREAM }}
            >
              Partner with us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
