import type { Metadata } from 'next';
import Link from 'next/link';
import { NewsletterSignup } from '@/components/newsletter-signup';
import { getDeploymentTotals } from '@/lib/data/compendium';
import { STRETCH_BED } from '@/lib/data/products';

// Palette mirrors /sponsor + /contact so the cross-page flow reads as one site.
const CREAM = '#FDF8F3';
const RUST = '#C45C3E';
const CHARCOAL = '#2E2E2E';
const SAGE = '#8B9D77';

export const metadata: Metadata = {
  title: 'The work | Goods on Country',
  description:
    'Beds and washing machines built On Country, from recycled plastic, on a path to community ownership. Community-led, made in community, with community, for community.',
};

const totals = getDeploymentTotals();

export default function TheWorkPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: CREAM, color: CHARCOAL }}>
      {/* 1. SOFT HERO */}
      <section className="px-5 sm:px-8 pt-16 sm:pt-24 pb-12 max-w-3xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: SAGE }}>
          The work
        </p>
        <h1
          className="font-display text-4xl sm:text-6xl leading-[1.05] tracking-tight mb-6"
          style={{ color: CHARCOAL }}
        >
          Led by community.<br />Made On Country.
        </h1>
        <p className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto" style={{ color: `${CHARCOAL}cc` }}>
          Across {totals.communities} communities in remote Australia, Elders and On-Country teams are
          deciding what good looks like: beds that survive the conditions, washing machines that can be
          fixed locally, and the making that stays in community hands.
        </p>
      </section>

      {/* 2. THE MODEL */}
      <section className="px-5 sm:px-8 py-14 sm:py-16" style={{ backgroundColor: 'white' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: RUST }}>
              How it is made
            </p>
            <h2 className="font-display text-3xl sm:text-4xl leading-tight" style={{ color: CHARCOAL }}>
              Built On Country, from what is already here.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Recycled plastic',
                body: `Community plastic waste is shredded, melted, and pressed into the legs. Recycled HDPE plastic, galvanised steel poles, and heavy-duty Australian canvas. ${STRETCH_BED.specs.weight}, ${STRETCH_BED.specs.loadCapacity} capacity, assembled in about five minutes with no tools.`,
              },
              {
                title: 'A plant that moves',
                body: 'The production plant is containerised and built to move. It can sit On Country, turning local plastic into beds rather than shipping furniture thousands of kilometres to be dumped within months.',
              },
              {
                title: 'A path to ownership',
                body: 'The plant is built to move into community ownership. The community runs and owns the build. Our job is to support the making and the realising, then step back.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl p-6 sm:p-7"
                style={{ backgroundColor: CREAM, border: `1px solid ${CHARCOAL}14` }}
              >
                <h3 className="font-display text-xl mb-3 leading-tight" style={{ color: CHARCOAL }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: `${CHARCOAL}cc` }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. NOT A CHARITY DROP-OFF */}
      <section className="px-5 sm:px-8 py-14 sm:py-16" style={{ backgroundColor: `${SAGE}1A`, borderTop: `1px solid ${SAGE}33`, borderBottom: `1px solid ${SAGE}33` }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: SAGE }}>
            What makes it different
          </p>
          <h2 className="font-display text-3xl sm:text-4xl leading-tight mb-5" style={{ color: CHARCOAL }}>
            Not a charity drop-off.
          </h2>
          <p className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-4" style={{ color: `${CHARCOAL}cc` }}>
            This is not furniture flown in and left behind. The work is community-led from the start. Design
            happens in community, with community, for community, and the making moves into community hands.
          </p>
          <p className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: `${CHARCOAL}cc` }}>
            We support the build and the realising. The community runs and owns the plant. That is the
            difference between a drop-off and something that lasts.
          </p>
        </div>
      </section>

      {/* 4. THE JOURNEY SO FAR */}
      <section className="px-5 sm:px-8 py-14 sm:py-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: RUST }}>
            The journey so far
          </p>
          <h2 className="font-display text-3xl sm:text-4xl leading-tight mb-5" style={{ color: CHARCOAL }}>
            Bed by bed, trip by trip.
          </h2>
          <p className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8" style={{ color: `${CHARCOAL}cc` }}>
            More than 400 beds have gone into homes since 2023. The May 2026 trip to the Utopia Homelands is
            the latest chapter: 87 beds in a single run, logged one by one. The field notes follow that
            journey up close.
          </p>
          <Link
            href="/field-notes/utopia-may-2026"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold transition text-white"
            style={{ backgroundColor: RUST }}
          >
            Read the Utopia field notes
          </Link>
        </div>
      </section>

      {/* 5. SOFT HOOK (capture) */}
      <section className="px-5 sm:px-8 py-14 sm:py-20" style={{ backgroundColor: CHARCOAL, color: CREAM }}>
        <div className="max-w-md mx-auto text-center">
          <h2 className="font-display text-2xl sm:text-3xl leading-tight mb-3">
            Walk alongside the work.
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: `${CREAM}99` }}>
            We share stories from Country as the work unfolds, in the words of the people leading it. No
            asks, just the journey. Join us when you are ready.
          </p>
          <NewsletterSignup tag="thework" buttonText="Join the journey" />
        </div>
      </section>
    </main>
  );
}
