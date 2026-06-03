import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PartnershipForm } from '@/components/partnership-form';
import { WasherInterestForm } from '@/components/washer-interest-form';
import { TRACTION_STATS } from '@/lib/data/funder-shared-content';

export const metadata = {
  title: 'Back the Work | Goods on Country',
  description:
    'How philanthropists, foundations, family offices and patient capital partners can back Goods on Country from product proof to On-Country production.',
  alternates: {
    canonical: 'https://www.goodsoncountry.com/partner',
  },
  openGraph: {
    title: 'Back the Work Behind Goods on Country',
    description:
      'Capital for beds now, washing machines next, and community-owned production over time.',
    url: 'https://www.goodsoncountry.com/partner',
    images: [
      {
        url: 'https://www.goodsoncountry.com/images/media-pack/community-bed-assembly.jpg',
        width: 1200,
        height: 900,
        alt: 'Community members assembling a Goods on Country Stretch Bed',
      },
    ],
  },
};

const ALLOWED_TYPES = [
  'capital-interest',
  'sponsor',
  'washer-interest',
  'license',
  'distribution',
  'grant',
  'other',
];

const DGR_NOTE =
  'DGR-deductible giving is available only through The Butterfly Movement Ltd, an ACNC-registered charity and Item 1 DGR. The Goods on Country giving pathway through Butterfly is being formalised for FY2026-27. Confirm current routing with us before structuring a tax-deductible gift. Goods on Country and A Curious Tractor Pty Ltd are not themselves DGR-endorsed.';

const backedByPartners = [
  {
    name: 'Snow Foundation',
    src: '/images/partners/snow-foundation.png',
    width: 2194,
    height: 1056,
    href: 'https://www.snowfoundation.org.au',
    role: 'Long-term strategic backing through product development, field work and RHD advocacy.',
  },
  {
    name: 'Centrecorp Foundation',
    src: '/images/partners/centrecorp-foundation.jpg',
    width: 400,
    height: 240,
    href: '/partners/centrecorp',
    role: 'Repeated backing for beds into Central Australian homelands, with the next pathway in discussion.',
  },
  {
    name: 'The Funding Network',
    src: '/images/partners/tfn.svg',
    width: 1256,
    height: 445,
    href: 'https://www.thefundingnetwork.com.au',
    role: 'Crowdfunded early plant and product momentum at a 2025 live-pitch night.',
  },
  {
    name: 'FRRR',
    src: '/images/partners/frrr.png',
    width: 1024,
    height: 491,
    href: 'https://frrr.org.au',
    role: 'Rural and remote support that helped move proof from prototype to delivery.',
  },
  {
    name: 'AMP Foundation',
    src: '/images/partners/amp-foundation.png',
    width: 1024,
    height: 272,
    href: 'https://ampfoundation.com.au',
    role: 'Spark program support for social-enterprise infrastructure and capability.',
  },
  {
    name: 'QBE Foundation',
    src: '/images/partners/qbe.png',
    width: 800,
    height: 220,
    href: 'https://www.qbe.com/sustainability/qbe-foundation',
    role: 'Catalysing Impact 2026 cohort, with Stage 2 match up to a $400K cap subject to eligible capital raised first.',
  },
];

const capitalPathways = [
  {
    title: 'Grant funding',
    body:
      'Best for R&D, community readiness, plant setup, evidence, governance and work that should not carry repayment pressure.',
  },
  {
    title: 'DGR-deductible giving via Butterfly',
    body:
      'Useful for eligible philanthropic gifts where the Goods pathway through The Butterfly Movement Ltd is the right structure.',
  },
  {
    title: 'Recoverable grants',
    body:
      'A fit where repayment can be patient and tied to the success of inventory, production or confirmed buyer pathways.',
  },
  {
    title: 'Patient working capital',
    body:
      'Relevant once orders, inventory and repayment timing are clear enough to avoid loading uncertainty into debt.',
  },
];

const useOfFunds = [
  'Finish plant readiness: equipment, safety systems, tooling, training and production planning.',
  'Build inventory so Goods is not waiting for each funded batch before beds can move.',
  'Support community partners with setup, local production pathways, delivery and repair loops.',
  'Strengthen evidence without extracting stories: asset data, field notes, consent and reporting.',
  'Formalise governance, legal structure and the trade/DGR boundary before larger capital lands.',
];

const proofPoints = [
  'Stretch Bed is available now: recycled HDPE legs, galvanised steel poles and heavy-duty canvas.',
  'Pakkimjalki Kari washing machines are prototype only, with interest captured through partner conversations.',
  'Every bed is treated as a trackable asset with QR support, repair pathways and field evidence.',
  'The production model is built to move value toward On-Country manufacturing and community ownership.',
];

const faq = [
  {
    question: 'Is Goods on Country a charity?',
    answer:
      'No. Goods on Country trades through A Curious Tractor Pty Ltd. The DGR pathway for eligible giving is through The Butterfly Movement Ltd, not through Goods or A Curious Tractor Pty Ltd directly.',
  },
  {
    question: 'Can a funder make a DGR-deductible gift?',
    answer: DGR_NOTE,
  },
  {
    question: 'What is the main ask right now?',
    answer:
      'We are inviting foundations, PAF/PuAF-style funders, family offices and patient capital partners to explore the blended capital stack: grants, eligible giving via Butterfly, recoverable funding, working capital and procurement-backed revenue.',
  },
  {
    question: 'What should not be funded with debt?',
    answer:
      'Early learning, community readiness, impact measurement and unresolved product R&D should stay grant-funded. Debt only fits activities with credible repayment timing.',
  },
];

export default async function PartnerPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const requestedType = params.type && ALLOWED_TYPES.includes(params.type) ? params.type : undefined;

  if (requestedType === 'washer-interest') {
    return (
      <main>
        <section className="relative bg-gradient-to-b from-muted/40 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="mb-5 text-sm uppercase tracking-[0.25em] text-accent">
                Pakkimjalki Kari · Washing Machine
              </p>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-5xl">
                Register your interest.
              </h1>
              <p className="text-lg text-muted-foreground">
                Pakkimjalki Kari is still a prototype. Tell us a bit about your community and
                we&apos;ll come back to you when we have testing results to share, or a machine
                ready to send.
              </p>
            </div>
            <div className="mx-auto max-w-2xl">
              <WasherInterestForm />
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="mb-5 text-sm uppercase tracking-[0.25em] text-accent">
                Back the work
              </p>
              <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground md:text-6xl">
                Capital for beds now, washing machines next, and production moving to Country.
              </h1>
              <p className="mb-5 text-lg leading-relaxed text-muted-foreground">
                Goods on Country builds essential health hardware with remote First Nations
                communities. The Stretch Bed is in market. Pakkimjalki Kari is in prototype. The
                next phase is the bridge from product proof to On-Country production and community
                ownership.
              </p>
              <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                Philanthropic and patient capital does not fund dependency. It funds the plant,
                inventory, repair loops, evidence and governance needed for communities to make and
                own more of the work over time.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="#capital-stack">Explore the capital stack</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#start">Start a conversation</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted shadow-sm">
                <Image
                  src="/images/media-pack/community-bed-assembly.jpg"
                  alt="Community members assembling a Goods on Country Stretch Bed"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 540px"
                  className="object-cover"
                />
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Entity and DGR note
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  A Curious Tractor Pty Ltd is the trading company behind Goods on Country. The
                  Butterfly Movement Ltd is the DGR pathway for eligible giving. The long-term
                  structure is being designed to protect enterprise discipline and community
                  ownership.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-accent py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-5xl gap-8 text-center sm:grid-cols-2 lg:grid-cols-4">
            {TRACTION_STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-accent-foreground md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm font-medium text-accent-foreground">
                  {stat.label}
                </div>
                <div className="mt-1 text-xs text-accent-foreground/70">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Why capital matters
              </p>
              <h2 className="mb-5 text-3xl font-bold leading-tight text-foreground md:text-4xl">
                The product proof is here. The next risk is the bridge.
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                Goods should not become a bed distributor. The point is a product system: beds and
                washers that people want, can repair, can track, and can eventually make and own
                closer to home.
              </p>
              <Button asChild variant="outline">
                <Link href="/process">See the production process</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {proofPoints.map((point) => (
                <div key={point} className="rounded-xl border border-border bg-card p-5">
                  <p className="text-sm leading-relaxed text-muted-foreground">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="capital-stack" className="scroll-mt-16 bg-foreground py-16 text-background md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 max-w-3xl">
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-background/60">
                Capital stack
              </p>
              <h2 className="mb-5 text-3xl font-bold leading-tight md:text-4xl">
                The right capital is blended, patient and honest about what is proven.
              </h2>
              <p className="text-lg leading-relaxed text-background/75">
                QBE Catalysing Impact 2026 creates a timely match opportunity up to a $400K cap,
                conditional on eligible non-QBE capital being raised first. The practical ask is to
                explore which layer fits your mandate.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {capitalPathways.map((pathway) => (
                <div key={pathway.title} className="rounded-xl border border-background/15 bg-background/5 p-5">
                  <h3 className="mb-3 text-lg font-semibold text-background">{pathway.title}</h3>
                  <p className="text-sm leading-relaxed text-background/70">{pathway.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl border border-background/15 bg-background/5 p-6">
              <div className="grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:items-start">
                <div>
                  <h3 className="mb-3 text-2xl font-semibold text-background">
                    Current target: about $3M
                  </h3>
                  <p className="text-sm leading-relaxed text-background/70">
                    This is a blended-finance target, not committed capital. It combines
                    philanthropic funding, eligible giving via Butterfly, recoverable funding,
                    patient working capital and procurement-backed revenue.
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-background/75">
                  <li>
                    <span className="font-semibold text-background">QBE match:</span> up to a $400K
                    cap, conditional on eligible non-QBE capital being raised first.
                  </li>
                  <li>
                    <span className="font-semibold text-background">Debt:</span> only where orders,
                    inventory and repayment timing are credible.
                  </li>
                  <li>
                    <span className="font-semibold text-background">Grants:</span> the right home
                    for community readiness, R&D, measurement and legal/governance work.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Use of funds
              </p>
              <h2 className="mb-5 text-3xl font-bold leading-tight text-foreground md:text-4xl">
                What the next capital actually does.
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                The near-term job is not polish. It is inventory, plant readiness, local capability,
                evidence and the legal boundary between trading and eligible giving.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <ul className="space-y-4">
                {useOfFunds.map((item, index) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                DGR pathway
              </p>
              <h2 className="mb-5 text-3xl font-bold leading-tight text-foreground md:text-4xl">
                DGR access without turning Goods into a bed-distribution program.
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                The split matters. A Curious Tractor Pty Ltd trades and keeps product discipline.
                The Butterfly Movement Ltd carries the eligible giving pathway where it fits.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-background p-6">
              <p className="text-sm leading-relaxed text-muted-foreground">{DGR_NOTE}</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  href="https://abr.business.gov.au/ABN/View?id=22155132684"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  ABN Lookup record
                </a>
                <a
                  href="https://www.acnc.gov.au/tools/factsheets/deductible-gift-recipients-dgr-and-acnc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
                >
                  ACNC DGR factsheet
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Existing backers
            </p>
            <h2 className="mb-10 text-3xl font-bold text-foreground">Proof from people already close to the work.</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {backedByPartners.map((partner) => (
                <a
                  key={partner.name}
                  href={partner.href}
                  target={partner.href.startsWith('http') ? '_blank' : undefined}
                  rel={partner.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="rounded-xl border border-border bg-card p-5 text-left transition hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="mb-4 flex h-12 items-center">
                    <Image
                      src={partner.src}
                      alt={partner.name}
                      width={partner.width}
                      height={partner.height}
                      className="max-h-12 max-w-40 object-contain"
                    />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{partner.name}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{partner.role}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                Funder questions
              </p>
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                The plain answers first.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {faq.map((item) => (
                <div key={item.question} className="rounded-xl border border-border bg-card p-5">
                  <h3 className="mb-3 font-semibold text-foreground">{item.question}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="start"
        className="scroll-mt-16 bg-gradient-to-b from-muted/30 to-background py-16 md:py-24"
      >
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-accent">
                Start the capital conversation
              </p>
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Tell us what kind of capital you can bring.
              </h2>
              <p className="text-lg text-muted-foreground">
                We will route you by capital type, timing and mandate, then come back with the
                cleanest next step.
              </p>
            </div>
            <PartnershipForm defaultType={requestedType || 'capital-interest'} />
          </div>
        </div>
      </section>
    </main>
  );
}
