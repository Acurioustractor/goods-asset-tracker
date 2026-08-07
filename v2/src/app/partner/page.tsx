import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PartnershipForm } from '@/components/partnership-form';
import { WasherInterestForm } from '@/components/washer-interest-form';
import { TRACTION_STATS } from '@/lib/data/funder-shared-content';

export const metadata = {
  title: 'Back the Work | Goods on Country',
  description:
    'How people and organisations can support Goods on Country to keep making beds and working with communities.',
  alternates: {
    canonical: 'https://www.goodsoncountry.com/partner',
  },
  openGraph: {
    title: 'Support Goods on Country',
    description: 'Help Goods keep making beds, working with communities and preparing for local production.',
    url: 'https://www.goodsoncountry.com/partner',
    images: [
      {
        url: 'https://www.goodsoncountry.com/images/community/alice-springs/stretch-bed-two-generations.jpg',
        width: 1200,
        height: 900,
        alt: 'Community members sitting on a Goods on Country Stretch Bed',
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
  'Goods on Country is being set up as the charity. Until that change is complete, The Butterfly Movement Ltd is the charity and the current DGR pathway. A Curious Tractor Pty Ltd trades as Goods. and sells the products; it is separate from the charity.';

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
    role: 'Catalysing Impact 2026 cohort. Stage 2 is a competitive application to one funding pool shared across ten enterprises.',
  },
];

const capitalPathways = [
  {
    title: 'Grants',
    body:
      'For equipment, setup, training and community work. Grants do not need to be repaid.',
  },
  {
    title: 'Gifts',
    body:
      'For people who want to support the work directly. Goods on Country is becoming the charity; until then, eligible giving goes through The Butterfly Movement Ltd.',
  },
  {
    title: 'Loans we can repay',
    body:
      'For orders and stock when we have a clear way to repay the money.',
  },
];

const useOfFunds = [
  'Get the equipment, safety systems, tools and training ready.',
  'Keep beds in stock so we can fulfil orders without waiting for each new payment.',
  'Work with communities on local production, delivery and repairs.',
  'Keep clear records of the products, field work and consent.',
  'Set up the legal and governance arrangements for the charity and trading business.',
];

const proofPoints = [
  {
    title: 'Beds are already in use.',
    body: 'Available now: recycled HDPE legs, galvanised steel poles and heavy-duty canvas.',
    src: '/images/product/stretch-bed-in-use.jpg',
    alt: 'A person resting on a Goods on Country Stretch Bed outdoors',
  },
  {
    title: 'The work is made together.',
    body: 'Community members assemble beds with us as we build toward more local production.',
    src: '/images/media-pack/community-bed-assembly.jpg',
    alt: 'Community members assembling a Goods on Country Stretch Bed',
  },
  {
    title: 'The washing machine is next.',
    body: 'Prototype only. We are listening, testing and sharing updates as it develops.',
    src: '/images/product/washing-machine-hero.jpg',
    alt: 'A Pakkimjalki Kari washing machine prototype in a community laundry',
  },
];

const faq = [
  {
    question: 'Is Goods on Country a charity?',
    answer:
      'Goods on Country is being set up as the charity. Until that change is complete, The Butterfly Movement Ltd is the charity and current DGR pathway. The products are sold by A Curious Tractor Pty Ltd, which trades as Goods.',
  },
  {
    question: 'Can I make a tax-deductible gift?',
    answer: DGR_NOTE,
  },
  {
    question: 'What is the main ask right now?',
    answer:
      'We are raising $300,000 a year to keep Goods making beds, working with communities and supporting local production. Facility costs are worked out separately with each community.',
  },
  {
    question: 'When would a loan make sense?',
    answer:
      'Only when there are orders or stock sales that give us a clear way to repay it. Grants and gifts are better for setup, community work and product testing.',
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
                Help Goods keep making beds and working with communities.
              </h1>
              <p className="mb-5 text-lg leading-relaxed text-muted-foreground">
                Goods on Country makes practical products with remote First Nations communities.
                The Stretch Bed is available now. Pakkimjalki Kari, the washing machine, is still a
                prototype.
              </p>
              <p className="mb-5 text-lg leading-relaxed text-muted-foreground">
                We are raising $300,000 a year to keep making beds, visiting communities and
                supporting local production. Separate facility costs are worked out with each
                community.
              </p>
              <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                If you are considering a grant, gift or loan, start a conversation with us.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="#start">Start a conversation</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/pitch/road">Read the pitch / longer story</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#capital-stack">See the funding structure</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-muted shadow-sm">
                <Image
                  src="/images/community/alice-springs/stretch-bed-two-generations.jpg"
                  alt="Community members sitting on a Goods on Country Stretch Bed"
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
                  A Curious Tractor Pty Ltd makes and sells the products as Goods. Goods on Country
                  is becoming the charity. Until that change is complete, The Butterfly Movement
                  Ltd is the charity and current DGR pathway.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/20 py-10 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.75fr_repeat(3,1fr)] lg:items-center">
            <div className="lg:border-r lg:border-border lg:pr-8">
              <p className="mb-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                At a glance
              </p>
              <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                A few plain facts about where the work stands today.
              </p>
            </div>
            {TRACTION_STATS.map((stat) => (
              <div key={stat.label} className="border-l border-border pl-5 lg:border-l-0 lg:pl-0">
                <div className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm font-semibold text-foreground">
                  {stat.label}
                </div>
                <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 max-w-2xl">
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                What is already working
              </p>
              <h2 className="mb-5 text-3xl font-bold leading-tight text-foreground md:text-4xl">
                The beds are in use. The next step is making more locally.
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                The Stretch Bed is available now and can be repaired and tracked. The washing machine
                is still being tested. Funding helps us keep delivering the products while we work
                with communities on local production.
              </p>
              <Button asChild variant="outline">
                <Link href="/process">See how the products are made</Link>
              </Button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {proofPoints.map((point, index) => (
                <article key={point.title} className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={point.src}
                      alt={point.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                      0{index + 1}
                    </p>
                    <h3 className="mb-2 font-semibold text-foreground">{point.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{point.body}</p>
                  </div>
                </article>
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
                How the funding could come together.
              </h2>
              <p className="text-lg leading-relaxed text-background/75">
                We need $300,000 a year to keep Goods running. QBE may contribute a grant, but it is
                not promised. The rest could come through grants, gifts or loans, depending on what
                the money is for.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
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
                    Where we are now
                  </h3>
                  <p className="text-sm leading-relaxed text-background/70">
                    Our current ask is $300,000 a year to keep Goods making beds, working with
                    communities and supporting community-led production. Nothing is signed today.
                  </p>
                </div>
                <ul className="space-y-3 text-sm text-background/75">
                  <li>
                    <span className="font-semibold text-background">QBE:</span> a possible grant,
                    not a promise.
                  </li>
                  <li>
                    <span className="font-semibold text-background">Grants and gifts:</span> for
                    setup, community work and evidence.
                  </li>
                  <li>
                    <span className="font-semibold text-background">Loans:</span> only where orders
                    give us a clear way to repay.
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
                What the money pays for.
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                It keeps Goods running while we make more beds, work with communities and prepare
                for local production.
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
          <div className="mx-auto max-w-3xl">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                DGR pathway
              </p>
              <h2 className="mb-5 text-3xl font-bold leading-tight text-foreground md:text-4xl">
                Goods on Country is becoming the charity.
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Until that change is complete, The Butterfly Movement Ltd is the charity and current
                DGR pathway. A Curious Tractor Pty Ltd trades as Goods. and sells the products; it
                is separate from the charity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl text-center">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                People who have backed the work
              </p>
            <h2 className="mb-10 text-3xl font-bold text-foreground">Support that has helped us get here.</h2>
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
                Questions about giving
              </p>
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                The answers, plainly.
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
                Start here
              </p>
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                Want to talk about funding?
              </h2>
              <p className="text-lg text-muted-foreground">
                Tell us whether you are thinking about a grant, gift or loan and we will take it from
                there.
              </p>
            </div>
            <PartnershipForm defaultType={requestedType || 'capital-interest'} />
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Want the full context first?{' '}
              <Link href="/pitch/road" className="font-semibold text-goods-terracotta underline underline-offset-4">
                Read the pitch / longer story.
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
