import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { NewsletterSignup } from '@/components/newsletter-signup';
import { goodsBedStats } from '@/lib/data/story-atoms';
import { getDeploymentTotals } from '@/lib/data/compendium';

// Palette mirrors /sponsor + /contact so the cross-page flow reads as one site.
const CREAM = '#FDF8F3';
const RUST = '#C45C3E';
const CHARCOAL = '#2E2E2E';
const SAGE = '#8B9D77';

export const metadata: Metadata = {
  title: 'Get involved | Goods on Country',
  description:
    'Three real ways to back beds in homes and move the making to Country: sponsor a bed, back the production plant, or build it in your community.',
};

// Real numbers, pulled from the canonical data files (no invented stats).
const totals = getDeploymentTotals();
// "556 beds in homes since 2023" lives in goodsBedStats as the last atom.
const bedsInHomes =
  goodsBedStats.find((s) => s.label.includes('beds in homes'))?.value ?? '556'; // canonical: see asset-canonical.ts

const WAYS = [
  {
    eyebrow: 'For individuals + families',
    title: 'Sponsor a bed',
    price: '$750',
    body: 'One Stretch Bed, into one home that needs it, in a community you can choose. We deliver and log it under a QR code so you can see exactly where it lands.',
    cta: 'Sponsor a bed',
    href: '/sponsor',
    next: 'What happens next: secure Stripe checkout, then a link to the bed you backed once it reaches its home.',
  },
  {
    eyebrow: 'For funders + foundations',
    title: 'Back the plant',
    price: '~85% built',
    body: 'The containerised production plant turns community plastic waste into beds On Country. It is roughly 85% complete. The next round closes the gap and starts local jobs, moving toward community ownership.',
    cta: 'Back the plant',
    href: '/partner',
    next: 'What happens next: we talk through the round, the gap to close, and the path to community ownership.',
  },
  {
    eyebrow: 'For communities + organisations',
    title: 'Build it in your community',
    price: 'Made with you',
    body: 'The plant is built to move. Design happens in community, with community, for community, and the community runs and owns the build. We support the making and the realising.',
    cta: 'Start a conversation',
    href: '/partner',
    next: 'What happens next: we map demand, freight, and a realistic timeline for your Country.',
  },
];

export default function GetInvolvedPage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: CREAM, color: CHARCOAL }}>
      {/* 1. HERO */}
      <section className="px-5 sm:px-8 pt-16 sm:pt-24 pb-12 max-w-3xl mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: RUST }}>
          Back the work
        </p>
        <h1
          className="font-display text-4xl sm:text-6xl leading-[1.05] tracking-tight mb-6"
          style={{ color: CHARCOAL }}
        >
          Beds in homes.<br />The making, moving to Country.
        </h1>
        <p className="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-8" style={{ color: `${CHARCOAL}cc` }}>
          On the May 2026 Utopia trip we delivered 87 Stretch Beds in a single run. That is what
          backing this work looks like: a washable bed off the ground today, and a plant that builds the
          next ones On Country tomorrow.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" className="text-white" style={{ backgroundColor: RUST }} asChild>
            <Link href="/sponsor">Sponsor a bed</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            style={{ borderColor: `${CHARCOAL}33`, color: CHARCOAL, backgroundColor: 'transparent' }}
            asChild
          >
            <Link href="/partner">Back the plant</Link>
          </Button>
        </div>
      </section>

      {/* 2. THREE WAYS */}
      <section className="px-5 sm:px-8 py-14 sm:py-16" style={{ backgroundColor: 'white' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.25em] mb-3" style={{ color: SAGE }}>
              Three ways in
            </p>
            <h2 className="font-display text-3xl sm:text-4xl leading-tight" style={{ color: CHARCOAL }}>
              Pick the one that fits you.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {WAYS.map((way) => (
              <div
                key={way.title}
                className="flex flex-col rounded-3xl p-6 sm:p-7"
                style={{ backgroundColor: CREAM, border: `1px solid ${CHARCOAL}14` }}
              >
                <p className="text-[11px] uppercase tracking-[0.2em] mb-3" style={{ color: SAGE }}>
                  {way.eyebrow}
                </p>
                <div className="flex items-baseline justify-between gap-3 mb-3">
                  <h3 className="font-display text-2xl leading-tight" style={{ color: CHARCOAL }}>
                    {way.title}
                  </h3>
                  <span className="font-display text-lg whitespace-nowrap" style={{ color: RUST }}>
                    {way.price}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: `${CHARCOAL}cc` }}>
                  {way.body}
                </p>
                <p className="text-xs leading-relaxed mb-6 mt-auto" style={{ color: `${CHARCOAL}99` }}>
                  {way.next}
                </p>
                <Button className="w-full text-white" style={{ backgroundColor: CHARCOAL }} asChild>
                  <Link href={way.href}>{way.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PROOF STRIP */}
      <section className="px-5 sm:px-8 py-14 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: bedsInHomes, label: 'beds in homes since 2023' },
              { value: '87', label: 'delivered on the May 2026 Utopia trip' },
              { value: `${totals.communities}`, label: 'communities across remote Australia' },
              { value: '20kg', label: 'of plastic kept out of landfill, per bed' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-4xl sm:text-5xl mb-2" style={{ color: RUST }}>
                  {stat.value}
                </p>
                <p className="text-xs leading-snug" style={{ color: `${CHARCOAL}99` }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FOUNDERS BEAT (light) */}
      <section className="px-5 sm:px-8 py-14 sm:py-16" style={{ backgroundColor: `${SAGE}1A`, borderTop: `1px solid ${SAGE}33`, borderBottom: `1px solid ${SAGE}33` }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.25em] mb-4" style={{ color: SAGE }}>
            Who is behind it
          </p>
          <h2 className="font-display text-3xl sm:text-4xl leading-tight mb-5" style={{ color: CHARCOAL }}>
            Ben Knight and Nic Marchesi.
          </h2>
          <p className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: `${CHARCOAL}cc` }}>
            Goods on Country was started by Ben Knight and Nic Marchesi, the team behind a track record of
            building things that last in remote Australia. For backers that matters: this is run by people
            who show up On Country, log every bed, and build for community ownership rather than dependence.
          </p>
        </div>
      </section>

      {/* 5. FOLLOW THE JOURNEY (capture) */}
      <section className="px-5 sm:px-8 py-14 sm:py-16">
        <div className="max-w-md mx-auto text-center">
          <h2 className="font-display text-2xl sm:text-3xl leading-tight mb-3" style={{ color: CHARCOAL }}>
            Not ready yet? Follow along.
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: `${CHARCOAL}99` }}>
            We send updates as beds reach homes and as the plant moves toward community ownership. No noise,
            just the work.
          </p>
          <NewsletterSignup tag="getinvolved" buttonText="Follow the journey" />
        </div>
      </section>

      {/* 6. FOOTER CTA */}
      <section className="px-5 sm:px-8 py-14 sm:py-20 text-center" style={{ backgroundColor: CHARCOAL, color: CREAM }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-3xl sm:text-4xl leading-tight mb-4">
            See where the last 107 landed.
          </h2>
          <p className="mb-8 max-w-xl mx-auto" style={{ color: `${CREAM}99` }}>
            The Utopia field notes follow the May 2026 trip, bed by bed. Or talk to us directly about backing
            the next run.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/field-notes/utopia-may-2026"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold transition"
              style={{ backgroundColor: RUST, color: CREAM }}
            >
              Read the Utopia field notes
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold transition"
              style={{ border: `1px solid ${CREAM}66`, color: CREAM }}
            >
              Talk to us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
