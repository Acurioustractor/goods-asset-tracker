import Image from 'next/image';
import Link from 'next/link';
import { createServiceClient } from '@/lib/supabase/server';
import { FollowForm } from './follow-form';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Canberra Airport, Reconciliation Week 2026',
  description:
    'A child in remote Australia is more likely to die of a preventable heart condition than almost anywhere else in the developed world. Here is why, and what a bed and a washing machine can do about it.',
  openGraph: {
    title: 'Goods on Country at Canberra Airport',
    description:
      'A child in remote Australia is more likely to die of a preventable heart condition than almost anywhere else in the developed world. Here is why, and what a bed and a washing machine can do about it.',
  },
};

const CREAM = '#FDF8F3';
const RUST = '#C45C3E';
const CHARCOAL = '#2E2E2E';
const SAGE = '#8B9D77';

export default async function CanberraPage() {
  const supabase = createServiceClient();

  const bedsRes = await supabase
    .from('assets')
    .select('unique_id', { count: 'exact', head: true })
    .in('product', ['Stretch Bed', 'Basket Bed']);

  const bedCount = bedsRes.count ?? 0;
  const machineCount = 14;

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: CREAM, color: CHARCOAL }}
    >
      {/* Reconciliation Week marker */}
      <div
        className="w-full text-center text-[10px] sm:text-xs uppercase tracking-[0.2em] py-2.5"
        style={{ backgroundColor: CHARCOAL, color: CREAM }}
      >
        Canberra Airport · Reconciliation Week 2026
      </div>

      {/* Hero — lead with the problem */}
      <section className="px-5 sm:px-8 pt-8 sm:pt-12 pb-10 max-w-3xl mx-auto text-center">
        {/* Co-brand lockup */}
        <div className="flex items-center justify-center gap-5 sm:gap-7 mb-7 sm:mb-9">
          <div className="flex flex-col leading-none text-left">
            <span
              className="font-display text-3xl sm:text-4xl tracking-tight"
              style={{ color: CHARCOAL }}
            >
              Goods
            </span>
            <span
              className="text-[10px] sm:text-xs uppercase tracking-[0.25em] mt-1"
              style={{ color: `${CHARCOAL}99` }}
            >
              On Country
            </span>
          </div>
          <span
            aria-hidden
            className="text-2xl sm:text-3xl font-light"
            style={{ color: `${CHARCOAL}66` }}
          >
            &times;
          </span>
          <Image
            src="/images/partners/snow-foundation.png"
            alt="Snow Foundation"
            width={2194}
            height={1056}
            className="h-10 sm:h-12 w-auto"
            priority
          />
        </div>

        <p
          className="text-xs uppercase tracking-[0.25em] mb-4"
          style={{ color: RUST }}
        >
          You just scanned a bed at the airport
        </p>
        <h1
          className="font-display text-3xl sm:text-5xl leading-[1.1] tracking-tight mb-5"
          style={{ color: CHARCOAL }}
        >
          A child in remote Australia is more likely to die of a preventable heart condition than almost anywhere else in the developed world.
        </h1>
        <p className="text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl mx-auto" style={{ color: `${CHARCOAL}cc` }}>
          Here is why, and what a bed and a washing machine can do about it.
        </p>

        {/* Bed + washing machine, side by side */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <figure>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm">
              <Image
                src="/images/product/stretch-bed-hero.jpg"
                alt="The Stretch Bed — recycled plastic legs, galvanised steel poles, heavy-duty Australian canvas."
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 384px"
              />
            </div>
            <figcaption className="mt-2 text-xs sm:text-sm" style={{ color: `${CHARCOAL}99` }}>
              The Stretch Bed
            </figcaption>
          </figure>
          <figure>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-sm">
              <Image
                src="/images/product/washing-machine-hero.jpg"
                alt="Pakkimjalki Kari — washing machine on Country, named in Warumungu by Elder Dianne Stokes."
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 384px"
              />
            </div>
            <figcaption className="mt-2 text-xs sm:text-sm" style={{ color: `${CHARCOAL}99` }}>
              Pakkimjalki Kari, the washing machine
            </figcaption>
          </figure>
        </div>
      </section>

      {/* What is RHD — one-sentence anchor */}
      <section className="px-5 sm:px-8 max-w-2xl mx-auto pb-10 text-center">
        <p
          className="text-xs uppercase tracking-[0.25em] mb-3"
          style={{ color: RUST }}
        >
          The disease
        </p>
        <h2 className="font-display text-2xl sm:text-3xl mb-4 leading-tight" style={{ color: CHARCOAL }}>
          Rheumatic Heart Disease, in one sentence.
        </h2>
        <p className="text-base sm:text-lg leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
          Rheumatic heart disease (RHD) is a preventable condition that damages the heart valves of children and young people. It is almost eradicated everywhere in the world except in remote Aboriginal and Torres Strait Islander communities in Australia.
        </p>
      </section>

      {/* The cascade — plainly */}
      <section className="px-5 sm:px-8 max-w-2xl mx-auto pb-12">
        <div
          className="rounded-3xl px-6 sm:px-8 py-7 sm:py-9 text-center"
          style={{ backgroundColor: `${SAGE}1A`, border: `1px solid ${SAGE}33` }}
        >
          <p
            className="text-xs uppercase tracking-[0.25em] mb-3"
            style={{ color: RUST }}
          >
            The cascade
          </p>
          <h2 className="font-display text-2xl sm:text-3xl mb-5 leading-tight" style={{ color: CHARCOAL }}>
            How a dirty mattress becomes a damaged heart.
          </h2>

          <ol className="text-left space-y-3 mb-6 max-w-md mx-auto">
            <CascadeStep n={1} text="Overcrowded homes." />
            <CascadeStep n={2} text="Can't wash clothes and bedding." />
            <CascadeStep n={3} text="Scabies spreads." />
            <CascadeStep n={4} text="Skin infections set in." />
            <CascadeStep n={5} text="Strep A bacteria takes hold." />
            <CascadeStep n={6} text="Rheumatic fever." />
            <CascadeStep n={7} text="Permanent heart damage. Early death." />
          </ol>

          <p className="text-base sm:text-lg leading-relaxed mb-5" style={{ color: `${CHARCOAL}cc` }}>
            Clean bedding and clean clothes break that chain. Every step is preventable.
          </p>

          <p className="text-base sm:text-lg leading-relaxed italic" style={{ color: `${CHARCOAL}cc` }}>
            &ldquo;Scabies often leads to Rheumatic Heart Disease, so washing machines are essential to be
            able to clean infected clothing, bedding and towels.&rdquo;
            <span className="block not-italic mt-2 text-sm" style={{ color: `${CHARCOAL}99` }}>
              Jessica Allardyce, Miwatj Health
            </span>
          </p>
        </div>
      </section>

      {/* Why ordinary products fail */}
      <section className="px-5 sm:px-8 max-w-2xl mx-auto pb-14 text-center">
        <p
          className="text-xs uppercase tracking-[0.25em] mb-3"
          style={{ color: RUST }}
        >
          Why this is hard
        </p>
        <h2 className="font-display text-2xl sm:text-3xl mb-4 leading-tight" style={{ color: CHARCOAL }}>
          Standard mattresses can&apos;t survive remote Country.
        </h2>
        <p className="text-base sm:text-lg leading-relaxed mb-4" style={{ color: `${CHARCOAL}cc` }}>
          Heavy foam mattresses in hot, humid remote homes trap moisture. They breed mould and
          bacteria. They cannot be cleaned. Within months they are doing harm, not good.
        </p>
        <p className="text-base sm:text-lg leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
          One Alice Springs supplier sells around three million dollars a year of washing machines
          into remote communities. Most are in the dump inside a year. This is the gap Goods on
          Country is designed to fill.
        </p>
      </section>

      {/* The Stretch Bed — now the design rationale makes sense */}
      <section className="px-5 sm:px-8 max-w-2xl mx-auto pb-14 text-center">
        <p
          className="text-xs uppercase tracking-[0.25em] mb-3"
          style={{ color: RUST }}
        >
          The bed
        </p>
        <h2 className="font-display text-2xl sm:text-3xl mb-4 leading-tight" style={{ color: CHARCOAL }}>
          The Stretch Bed — built to break the chain.
        </h2>
        <p className="text-base sm:text-lg leading-relaxed mb-3" style={{ color: `${CHARCOAL}cc` }}>
          Recycled plastic legs, two galvanised steel poles, heavy-duty Australian canvas. No foam
          to soak up moisture. No fabric that can&apos;t be cleaned. The canvas comes off and goes in
          the wash. The frame wipes down. Nothing to harbour scabies, mould, or Strep A.
        </p>
        <p className="text-base sm:text-lg leading-relaxed mb-6" style={{ color: `${CHARCOAL}cc` }}>
          It clicks together in five minutes with no tools and holds 200kg. Designed for ten-plus
          years in remote Country, then to come apart for repair when it doesn&apos;t. The bed you can
          sit on right now is one of more than 400 living in homes across Palm Island, Tennant
          Creek, Maningrida, Utopia Homelands, and beyond. Each has a QR code. Each has a story.
        </p>

        <div className="relative aspect-[3/2] w-full overflow-hidden rounded-3xl shadow-sm mb-3">
          <Image
            src="/images/media-pack/community-testing-bed-golden-hour.jpg"
            alt="Community members testing a Stretch Bed at golden hour."
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
        <p className="mb-6 text-sm" style={{ color: `${CHARCOAL}99` }}>
          Community testing the Stretch Bed at sundown. Tennant Creek, 2025.
        </p>

        <Link
          href="/shop/stretch-bed-single"
          className="inline-flex items-center gap-1.5 text-base font-semibold underline-offset-4 hover:underline"
          style={{ color: RUST }}
        >
          See how a Stretch Bed is made &rarr;
        </Link>
      </section>

      {/* Pakkimjalki Kari — washing machine + Elder naming */}
      <section className="px-5 sm:px-8 max-w-2xl mx-auto pb-14 text-center">
        <p
          className="text-xs uppercase tracking-[0.25em] mb-3"
          style={{ color: RUST }}
        >
          The washing machine
        </p>
        <h2 className="font-display text-2xl sm:text-3xl mb-4 leading-tight" style={{ color: CHARCOAL }}>
          Pakkimjalki Kari — the washing house.
        </h2>
        <p className="text-base sm:text-lg leading-relaxed mb-6" style={{ color: `${CHARCOAL}cc` }}>
          A commercial-grade machine tough enough for remote conditions, and the second tool in
          the cascade. Clean clothes and clean bedding are how families stop scabies before it
          becomes Strep A. Elder Dianne Stokes, Warumungu, named the machine at Tennant Creek.
        </p>

        <div className="relative aspect-[4/5] w-full max-w-sm mx-auto overflow-hidden rounded-3xl shadow-sm mb-4">
          <Image
            src="/images/people/dianne-stokes.jpg"
            alt="Elder Dianne Stokes, Warumungu elder who named the washing machine Pakkimjalki Kari."
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
        <p className="text-base sm:text-lg leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
          Pakkimjalki Kari is Warumungu for &ldquo;washing house&rdquo;. Every Goods product carries a
          story like this: made with the community it serves, named in the language of that Country.
        </p>
      </section>

      {/* Made by community — manufacturing story lands here */}
      <section className="px-5 sm:px-8 max-w-2xl mx-auto pb-14 text-center">
        <p
          className="text-xs uppercase tracking-[0.25em] mb-3"
          style={{ color: RUST }}
        >
          The model
        </p>
        <h2 className="font-display text-3xl sm:text-4xl mb-5 leading-tight" style={{ color: CHARCOAL }}>
          Made by community.<br />Made for community.
        </h2>
        <p className="text-base sm:text-lg leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
          Plastic gets collected on Country, shredded, melted, and pressed into bed components in
          an on-Country plant that can move to community ownership. Twenty kilograms of recycled
          HDPE in every bed. The jobs, the manufacturing, and eventually the ownership stay with
          the communities the beds are built for.
        </p>
      </section>

      {/* Stat strip — now lands after the story */}
      <section className="px-5 sm:px-8 max-w-3xl mx-auto pb-14">
        <div
          className="rounded-3xl px-6 sm:px-8 py-7 sm:py-9 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center"
          style={{ backgroundColor: `${SAGE}1A`, border: `1px solid ${SAGE}33` }}
        >
          <Stat value={bedCount.toLocaleString()} label="beds across Australia" />
          <Stat value={machineCount.toLocaleString()} label="washing machines confirmed on Country" />
          <Stat value="8" label="communities" />
          <Stat value="20kg" label="of plastic diverted per bed" />
        </div>
      </section>

      {/* Snow Foundation supporter panel */}
      <section className="px-5 sm:px-8 max-w-2xl mx-auto pb-14">
        <div className="rounded-3xl px-6 sm:px-8 py-7 sm:py-8 border text-center" style={{ borderColor: `${CHARCOAL}1A` }}>
          <div className="flex items-center justify-center gap-4 mb-5">
            <Image
              src="/images/partners/snow-foundation.png"
              alt="Snow Foundation"
              width={2194}
              height={1056}
              className="h-10 sm:h-12 w-auto"
            />
            <p
              className="text-xs uppercase tracking-[0.25em]"
              style={{ color: `${CHARCOAL}99` }}
            >
              Backed by Snow Foundation
            </p>
          </div>
          <p className="text-base sm:text-lg leading-relaxed mb-4" style={{ color: `${CHARCOAL}cc` }}>
            Snow Foundation has stood with Goods on Country from the early days, backing
            production scale-up, community-ownership trials, and the work it takes to get a
            bed and a washing machine into every remote home that needs one.
          </p>
          <p className="text-base sm:text-lg leading-relaxed mb-5" style={{ color: `${CHARCOAL}cc` }}>
            They have also taken the fight upstream, championing the end of Rheumatic Heart Disease
            in remote Australia at Parliament House and beyond.
          </p>
          <a
            href="https://www.snowfoundation.org.au/news/end-rheumatic-heart-disease-advocacy-event-parliament-house-rhd/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-base font-semibold underline-offset-4 hover:underline"
            style={{ color: RUST }}
          >
            See Snow&apos;s work to end RHD &rarr;
          </a>
        </div>
      </section>

      {/* Single primary CTA + newsletter */}
      <section className="px-5 sm:px-8 max-w-2xl mx-auto pb-14">
        <div className="text-center mb-8">
          <p
            className="text-xs uppercase tracking-[0.25em] mb-3"
            style={{ color: RUST }}
          >
            What you can do
          </p>
          <h2 className="font-display text-3xl sm:text-4xl mb-4 leading-tight" style={{ color: CHARCOAL }}>
            Put a bed in a home.
          </h2>
          <p className="text-base sm:text-lg leading-relaxed mb-7" style={{ color: `${CHARCOAL}cc` }}>
            $560 puts one Stretch Bed into a remote home that needs it. Pick the community.
            We deliver and log it under a QR code you can follow.
          </p>
          <Link
            href="/sponsor"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 text-base font-semibold transition hover:-translate-y-0.5"
            style={{ backgroundColor: RUST, color: CREAM }}
          >
            Sponsor a bed &rarr;
          </Link>
        </div>

        {/* Newsletter form */}
        <div id="stay-close" className="pt-10 scroll-mt-16 border-t" style={{ borderColor: `${CHARCOAL}1A` }}>
          <div className="text-center mb-6 mt-2">
            <h3 className="font-display text-2xl sm:text-3xl mb-2" style={{ color: CHARCOAL }}>
              Or stay close to the story.
            </h3>
            <p className="text-sm sm:text-base" style={{ color: `${CHARCOAL}99` }}>
              Leave an email or a number. We will share what happens next: new beds, new
              communities, new partnerships. No spam, ever.
            </p>
          </div>
          <FollowForm />
        </div>
      </section>

      {/* Communities served */}
      <section className="px-5 sm:px-8 max-w-3xl mx-auto pb-14">
        <p
          className="text-xs uppercase tracking-[0.25em] mb-4"
          style={{ color: RUST }}
        >
          On-Country with
        </p>
        <p className="text-lg sm:text-xl leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
          Tennant Creek · Palm Island · Maningrida · Utopia Homelands · Mutitjulu · Alice Springs ·
          Darwin · Mount Isa · Kalgoorlie
        </p>
      </section>

      {/* Partner lockup */}
      <section
        className="px-5 sm:px-8 py-10 mt-6"
        style={{ backgroundColor: CHARCOAL, color: CREAM }}
      >
        <div className="max-w-3xl mx-auto">
          <p
            className="text-xs uppercase tracking-[0.25em] mb-5"
            style={{ color: `${CREAM}99` }}
          >
            With thanks to
          </p>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-5 mb-5">
            <a
              href="https://www.snowfoundation.org.au"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="The Snow Foundation"
              className="transition hover:opacity-80"
            >
              <Image
                src="/images/partners/snow-foundation-white.png"
                alt="The Snow Foundation"
                width={2194}
                height={1056}
                className="h-9 sm:h-10 w-auto"
              />
            </a>
            <span
              className="text-base sm:text-lg leading-relaxed"
              style={{ color: CREAM }}
            >
              Capital Airport Group · A Curious Tractor
            </span>
          </div>

          <p className="text-base sm:text-lg leading-relaxed" style={{ color: `${CREAM}cc` }}>
            And the families, Elders, and Ranger groups across the communities we work with.
          </p>
          <div
            className="mt-8 pt-6 text-xs flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between"
            style={{ borderTop: `1px solid ${CREAM}22`, color: `${CREAM}88` }}
          >
            <p>Reconciliation Week · Canberra Airport · May 2026</p>
            <p>
              <a
                href="https://www.goodsoncountry.com"
                className="underline hover:no-underline"
                style={{ color: CREAM }}
              >
                goodsoncountry.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-3xl sm:text-4xl leading-none" style={{ color: CHARCOAL }}>
        {value}
      </div>
      <div className="mt-2 text-xs sm:text-sm leading-snug" style={{ color: `${CHARCOAL}99` }}>
        {label}
      </div>
    </div>
  );
}

function CascadeStep({ n, text }: { n: number; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold mt-0.5"
        style={{ backgroundColor: RUST, color: CREAM }}
      >
        {n}
      </span>
      <span className="text-base sm:text-lg leading-snug pt-0.5" style={{ color: `${CHARCOAL}cc` }}>
        {text}
      </span>
    </li>
  );
}
