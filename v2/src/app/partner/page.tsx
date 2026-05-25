import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PartnershipForm } from '@/components/partnership-form';
import { BUYER_PIPELINE, TRACTION_STATS } from '@/lib/data/funder-shared-content';

export const metadata = {
  title: 'Partner With Us',
  description:
    'How foundations, corporates, institutional buyers and community organisations back Goods on Country, and how to start a conversation.',
  alternates: {
    canonical: 'https://www.goodsoncountry.com/partner',
  },
  openGraph: {
    title: 'Partner With Goods on Country',
    description:
      'Foundations, corporates, institutional buyers, investors and community partners backing First Nations-led on-country manufacturing.',
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

const ALLOWED_TYPES = ['sponsor', 'washer-interest', 'license', 'distribution', 'grant', 'other'];

const backedByPartners = [
  {
    name: 'Snow Foundation',
    src: '/images/partners/snow-foundation.png',
    width: 2194,
    height: 1056,
    href: 'https://www.snowfoundation.org.au',
    role: 'Four years of strategic backing. Champion of the work upstream: RHD advocacy at Parliament House.',
  },
  {
    name: 'Centrecorp Foundation',
    src: '/images/partners/centrecorp-foundation.jpg',
    width: 400,
    height: 240,
    href: '/partners/centrecorp',
    role: '$420K committed across multiple rounds. 109 Stretch Beds locked for Utopia Homelands.',
  },
  {
    name: 'The Funding Network',
    src: '/images/partners/tfn.svg',
    width: 1256,
    height: 445,
    href: 'https://www.thefundingnetwork.com.au',
    role: 'Crowdfunded $130K at a 2025 live-pitch night. Validated the model with a room of philanthropic investors.',
  },
  {
    name: 'FRRR',
    src: '/images/partners/frrr.png',
    width: 1024,
    height: 491,
    href: 'https://frrr.org.au',
    role: 'Backing the Future grant. Rural and remote distribution support.',
  },
  {
    name: 'AMP Foundation',
    src: '/images/partners/amp-foundation.png',
    width: 1024,
    height: 272,
    href: 'https://ampfoundation.com.au',
    role: 'Program funding through the Spark grant. Social-enterprise infrastructure support.',
  },
  {
    name: 'QBE Foundation',
    src: '/images/partners/qbe.png',
    width: 800,
    height: 220,
    href: 'https://www.qbe.com/sustainability/qbe-foundation',
    role: 'Catalysing Impact 2026 cohort. Climate-resilience + inclusion alignment. Stage 2 match available.',
  },
];

const communityPartners = [
  {
    name: 'Oonchiumpa Consultancy',
    src: '/images/partners/oonchiumpa.png',
    width: 560,
    height: 350,
    href: 'https://oonchiumpa.com.au',
    role: 'Cultural lead. 100% Aboriginal-owned. Two years co-designing products around the fire.',
  },
];

const partnerQuotes = [
  {
    quote:
      'When she received her first bed, she came back within two weeks requesting twenty more for her community.',
    name: 'Dianne Stokes',
    role: 'Warumungu Elder, Tennant Creek',
  },
  {
    quote:
      'Scabies often leads to Rheumatic Heart Disease, so washing machines are essential to be able to clean infected clothing, bedding and towels.',
    name: 'Jessica Allardyce',
    role: 'Miwatj Health',
  },
];

export default async function PartnerPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const requestedType = params.type && ALLOWED_TYPES.includes(params.type) ? params.type : undefined;

  return (
    <main>
      {/* ============================================================
         HERO — story-led, single image
         ============================================================ */}
      <section className="relative bg-gradient-to-b from-muted/40 to-background py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-2 md:items-center max-w-6xl mx-auto">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-accent mb-5">
                Partner with Goods on Country
              </p>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
                Back a model that&apos;s working.
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                Goods on Country is a First Nations-led manufacturer putting health hardware into
                remote homes. Six grant funders behind us. Six hundred-plus beds already in eight
                communities. A buyer pipeline in active conversation. A path to scale.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                If you back foundations, write impact cheques, run procurement for health or
                housing, or lead a community organisation that needs beds, there&apos;s a way in
                here that fits your shape.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="#start">Start a conversation</Link>
                </Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-sm">
              <Image
                src="/images/media-pack/community-bed-assembly.jpg"
                alt="Community members assembling a Stretch Bed on country"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
         TRACTION BAND
         ============================================================ */}
      <section className="bg-accent py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto text-center">
            {TRACTION_STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-accent-foreground">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-accent-foreground mt-1">{stat.label}</div>
                <div className="text-xs text-accent-foreground/70 mt-1">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
         HOW WE PARTNER — three lanes
         ============================================================ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-12">
            <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">
              How we partner
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Three lanes into the work.
            </h2>
            <p className="text-lg text-muted-foreground">
              Goods has three kinds of partner. Foundations and trusts back the model and de-risk
              the early years. Institutional buyers turn beds into procurement. Community partners
              design the products and host the work on country.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Lane 1 — Foundations & Trusts */}
            <div className="rounded-2xl border border-border bg-card p-7">
              <p className="text-xs uppercase tracking-[0.2em] text-accent mb-3">Lane 1</p>
              <h3 className="text-xl font-bold text-foreground mb-3">Foundations &amp; trusts</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Six grant funders have backed Goods over four years. Together they&apos;ve carried
                the work from the early prototypes through to the production scale-up we&apos;re
                inside right now.
              </p>
              <ul className="space-y-3 text-sm">
                {backedByPartners.map((p) => (
                  <li key={p.name}>
                    <span className="font-semibold text-foreground">{p.name}.</span>{' '}
                    <span className="text-muted-foreground">{p.role}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lane 2: Institutional buyers */}
            <div className="rounded-2xl border border-border bg-card p-7">
              <p className="text-xs uppercase tracking-[0.2em] text-accent mb-3">Lane 2</p>
              <h3 className="text-xl font-bold text-foreground mb-3">Institutional buyers</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Beds are revenue. Centrecorp&apos;s repeat order, Miwatj&apos;s clinic fleet,
                Homeland Schools: this pipeline is in active conversation. Each LOI is a year of
                On-Country manufacturing capacity.
              </p>
              <ul className="space-y-3 text-sm">
                {BUYER_PIPELINE.filter(
                  (b) => b.buyer !== "NPY Women's Council" && b.buyer !== 'WHSAC / Groote Eylandt'
                ).map((b) => (
                  <li key={b.buyer}>
                    <div className="font-semibold text-foreground">{b.buyer}</div>
                    <div className="text-muted-foreground">{b.volume}</div>
                    <div className="text-xs text-accent">{b.status}</div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lane 3: Community partners */}
            <div className="rounded-2xl border border-border bg-card p-7">
              <p className="text-xs uppercase tracking-[0.2em] text-accent mb-3">Lane 3</p>
              <h3 className="text-xl font-bold text-foreground mb-3">Community partners</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Goods is a product designed around the fire, not in a catalogue. Cultural leads,
                Elders, and community organisations shape what we build, who we build with, and
                where the production sits.
              </p>
              <ul className="space-y-3 text-sm">
                <li>
                  <span className="font-semibold text-foreground">Oonchiumpa Consultancy.</span>{' '}
                  <span className="text-muted-foreground">
                    Cultural lead, 100% Aboriginal-owned. Two years co-designing with the Bloomfield family.
                  </span>
                </li>
                <li>
                  <span className="font-semibold text-foreground">
                    Palm Island Community Company.
                  </span>{' '}
                  <span className="text-muted-foreground">
                    Largest single deployment (141 beds) and the pathway to community-owned manufacturing.
                  </span>
                </li>
                <li>
                  <span className="font-semibold text-foreground">Homeland Schools Company.</span>{' '}
                  <span className="text-muted-foreground">
                    Maningrida-based partner running washing machines and beds across the homeland school network.
                  </span>
                </li>
                <li>
                  <span className="font-semibold text-foreground">NPY Women&apos;s Council.</span>{' '}
                  <span className="text-muted-foreground">
                    Established distribution network across Ngaanyatjarra, Pitjantjatjara, Yankunytjatjara lands.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
         QBE CATALYSING IMPACT FEATURE BAND
         ============================================================ */}
      <section className="bg-foreground text-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-[0.25em] text-background/60 mb-4">
              Currently in flight
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
              QBE Catalysing Impact 2026.
            </h2>
            <p className="text-lg text-background/85 mb-4 leading-relaxed">
              Goods is inside the QBE Foundation&apos;s blended-finance accelerator, facilitated
              by Social Impact Hub. We were selected for climate-resilience and inclusion
              alignment.
            </p>
            <p className="text-lg text-background/85 mb-4 leading-relaxed">
              Stage 2 of the program includes a dollar-for-dollar match of up to{' '}
              <span className="text-background font-semibold">$400K</span> against capital we
              raise from elsewhere. The structure is a blended stack: catalytic philanthropy on
              top, working-capital debt from SEFA, the QBE match in the middle.
            </p>
            <p className="text-lg text-background/85 leading-relaxed mb-10">
              If you&apos;re a foundation, family office or impact investor, this is the cleanest
              moment to come in. Every dollar you commit is matched. The pipeline is already
              de-risked by buyers under contract.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="#start">Match the QBE round &rarr;</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================================
         CENTRECORP CASE STUDY
         ============================================================ */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">
                  Case study
                </p>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Centrecorp Foundation: from a Basket Bed trial to homes On-Country.
                </h2>
                <p className="text-muted-foreground mb-3">
                  Centrecorp backed the Basket Bed V1 trial early on, the first run of beds we
                  put into community. Off the back of that trial they committed to over 100
                  Stretch Beds going into Utopia Homelands.
                </p>
                <p className="text-muted-foreground mb-6">
                  It&apos;s the relationship we point new funders to when they ask whether the
                  work actually lands in homes. The answer is yes, and Centrecorp is how that
                  started.
                </p>
                <Link
                  href="/partners/centrecorp"
                  className="inline-flex items-center gap-1.5 text-base font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Read the full Centrecorp partnership &rarr;
                </Link>
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl shadow-sm">
                <Image
                  src="/images/partners/centrecorp/utopia/final-assembly.jpg"
                  alt="Stretch Beds being assembled at Utopia Homelands as part of the Centrecorp partnership"
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
         PARTNER QUOTES
         ============================================================ */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2">
              {partnerQuotes.map((q) => (
                <figure
                  key={q.name}
                  className="rounded-2xl border border-border bg-card p-7"
                >
                  <blockquote
                    className="text-lg text-foreground leading-relaxed mb-5"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    &ldquo;{q.quote}&rdquo;
                  </blockquote>
                  <figcaption className="text-sm">
                    <div className="font-semibold text-foreground">{q.name}</div>
                    <div className="text-muted-foreground">{q.role}</div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
         LOGO STRIP — Backed by / Community partner
         ============================================================ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-10">Our partners</h2>

            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">Backed by</p>
            <div className="mb-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-8 sm:gap-x-14">
              {backedByPartners.map((partner) => (
                <a
                  key={partner.name}
                  href={partner.href}
                  target={partner.href.startsWith('http') ? '_blank' : undefined}
                  rel={partner.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={partner.name}
                  title={partner.name}
                  className="flex h-16 w-48 items-center justify-center transition hover:opacity-80 sm:h-20 sm:w-56"
                >
                  <Image
                    src={partner.src}
                    alt={partner.name}
                    width={partner.width}
                    height={partner.height}
                    className="max-h-full max-w-full object-contain"
                  />
                </a>
              ))}
            </div>

            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">
              Community partner
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 sm:gap-x-14">
              {communityPartners.map((partner) => (
                <a
                  key={partner.name}
                  href={partner.href}
                  target={partner.href.startsWith('http') ? '_blank' : undefined}
                  rel={partner.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={partner.name}
                  title={partner.name}
                  className="flex h-16 w-48 items-center justify-center transition hover:opacity-80 sm:h-20 sm:w-56"
                >
                  <Image
                    src={partner.src}
                    alt={partner.name}
                    width={partner.width}
                    height={partner.height}
                    className="max-h-full max-w-full object-contain"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
         START THE CONVERSATION — segmented form
         ============================================================ */}
      <section
        id="start"
        className="bg-gradient-to-b from-muted/30 to-background py-16 md:py-24 scroll-mt-16"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-[0.25em] text-accent mb-3">
                Start the conversation
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Tell us who you are and where you&apos;re thinking.
              </h2>
              <p className="text-lg text-muted-foreground">
                Three quick questions so we can route you to the right person, then a few details
                so we can write back well.
              </p>
            </div>
            <PartnershipForm defaultType={requestedType} />
          </div>
        </div>
      </section>
    </main>
  );
}
