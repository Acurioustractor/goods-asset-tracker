import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PartnershipForm } from '@/components/partnership-form';
import { WasherInterestForm } from '@/components/washer-interest-form';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { MONEY_LANES, MONEY_NEVER } from '@/lib/data/money-lanes';
import { BED, RAISE, dollars } from '@/lib/data/model-placemat';
import { ORGANISATION } from '@/lib/data/organisation';
import { BUYERS, CLOSE } from '@/lib/data/pitch-chapters';
import { PAID_BEDS, QUESTIONS } from '@/lib/data/story-questions';

/**
 * Back the work: the public page for funders, givers and lenders. Rebuilt 16 September 2026 (Ben:
 * "go") because the old page still said A Curious Tractor sells the beds as "Goods." and asked for
 * $300,000 a year. Every figure now comes from the raise (model-placemat.ts RAISE and BED) and the
 * money lanes (money-lanes.ts), the same sources as /pitch; the entity and giving lines come from
 * organisation.ts; the answers come from story-questions.ts. Funders who have not signed are not
 * named here, the same rule as the /pitch overview door.
 */

export const metadata: Metadata = {
  title: 'Back the work',
  description: `Help buy the first ${RAISE.bedsYearOne} beds for community organisations, build two community production facilities, and carry the first year. ${dollars(RAISE.totalShownAud)} asked, nothing signed.`,
  alternates: { canonical: 'https://www.goodsoncountry.com/partner' },
  openGraph: {
    title: 'Back the work · Goods on Country',
    description: CLOSE.invitation,
    url: 'https://www.goodsoncountry.com/partner',
    images: [{ url: `https://www.goodsoncountry.com${CLOSE.photo.src}`, alt: CLOSE.photo.alt }],
  },
};

const ALLOWED_TYPES = ['capital-interest', 'sponsor', 'washer-interest', 'license', 'distribution', 'grant', 'other'];

const GUTTER = 'px-6 md:px-10 lg:px-14';
const BUTTON = 'inline-flex min-h-12 items-center rounded-full px-7 text-base font-semibold transition-colors';

// The overview door never names a funder who has not signed (pitch-content.tsx blanks `named`).
const LANES = MONEY_LANES.map((lane) => ({ ...lane, kicker: lane.id === 'beds' ? 'Philanthropy' : lane.source.kicker }));

const WAYS = [
  {
    title: 'A grant',
    line: `Buy beds for community organisations at ${dollars(BED.priceAud)} a bed, or fund a community production facility. Grants are made to ${ORGANISATION.legalName}, trading as ${ORGANISATION.tradingName}.`,
  },
  {
    title: 'A gift',
    line: `${ORGANISATION.charityLine} ${ORGANISATION.giving}`,
  },
  {
    title: 'A loan',
    line: `${RAISE.loanFor.split(',')[0]}, repaid from the beds ${ORGANISATION.tradingName} sells. Never from a community organisation’s sales.`,
  },
  {
    title: 'An order',
    line: `Buy beds for your own service or community at ${dollars(BED.priceAud)} a bed.`,
    href: '/beds',
    link: 'Buy beds',
  },
] as const;

const BACKERS = [
  { name: 'Snow Foundation', src: '/images/partners/snow-foundation.png', width: 2194, height: 1056, href: 'https://www.snowfoundation.org.au', role: 'Long-term backing through product development, field work and RHD advocacy.' },
  { name: 'Centrecorp Foundation', src: '/images/partners/centrecorp-foundation.jpg', width: 400, height: 240, href: '/partners/centrecorp', role: `A buyer: ${BUYERS.rows.find((r) => r.buyer === 'Centrecorp Foundation')?.line ?? ''}` },
  { name: 'The Funding Network', src: '/images/partners/tfn.svg', width: 1256, height: 445, href: 'https://www.thefundingnetwork.com.au', role: 'Crowdfunded early plant and product momentum at a 2025 live-pitch night.' },
  { name: 'FRRR', src: '/images/partners/frrr.png', width: 1024, height: 491, href: 'https://frrr.org.au', role: 'Rural and remote support that helped move the bed from prototype to delivery.' },
  { name: 'AMP Foundation', src: '/images/partners/amp-foundation.png', width: 1024, height: 272, href: 'https://ampfoundation.com.au', role: 'Spark program support for social-enterprise infrastructure and capability.' },
  { name: 'QBE Foundation', src: '/images/partners/qbe.png', width: 800, height: 220, href: 'https://www.qbe.com/sustainability/qbe-foundation', role: 'Catalysing Impact 2026 cohort. Stage 2 is a competitive application to one funding pool shared across ten enterprises.' },
];

const question = (id: string) => QUESTIONS.find((q) => q.id === id);

const ANSWERS = [
  {
    q: 'Is Goods on Country a charity?',
    a: `Yes. ${ORGANISATION.identityLine} ${ORGANISATION.charityLine} ${ORGANISATION.boardLine}`,
  },
  {
    q: 'Can I make a tax-deductible gift?',
    a: `${ORGANISATION.charityLine} ${ORGANISATION.giving}`,
  },
  {
    q: 'What is the ask?',
    a: `${dollars(RAISE.totalShownAud)}: ${dollars(RAISE.bedsShownAud)} of beds from philanthropy, ${RAISE.bedsEach} for each of ${RAISE.communityOrganisations} community organisations; ${dollars(RAISE.qbeAud)} from QBE for two community production facilities; and a ${dollars(RAISE.loanAud)} loan for the first-year running cost. Nothing is signed.`,
  },
  ...(['money-back', 'why-not-give', 'what-goods-keeps'] as const)
    .map(question)
    .filter((item): item is NonNullable<typeof item> => !!item && item.status === 'answered')
    .map((item) => ({ q: item.question, a: item.answer })),
];

export default async function PartnerPage({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const params = await searchParams;
  const requestedType = params.type && ALLOWED_TYPES.includes(params.type) ? params.type : undefined;

  if (requestedType === 'washer-interest') {
    return (
      <main className="bg-goods-cream text-goods-ink">
        <section className={`${GUTTER} py-16 md:py-24`}>
          <div className="mx-auto mb-12 max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta">Pakkimjalki Kari · Washing machine</p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-tight">Register your interest.</h1>
            <p className="mt-5 text-lg leading-relaxed text-[#4a4741]">
              Pakkimjalki Kari is still a prototype. Tell us a bit about your community and we will come back to you when we have testing results to share, or a machine ready to send.
            </p>
          </div>
          <div className="mx-auto max-w-2xl">
            <WasherInterestForm />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-goods-cream text-goods-ink">
      {/* Hero */}
      <section className={`${GUTTER} pb-16 pt-12 md:pb-24 md:pt-20`}>
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta">Back the work</p>
            <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.02] tracking-[-0.01em] text-balance md:text-6xl">{CLOSE.invitation}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#4a4741] md:text-xl">
              We are asking for {dollars(RAISE.totalShownAud)}, in three parts: beds for community organisations, two community production facilities, and the first year of running Goods on Country. Nothing is signed yet.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#start" className={`${BUTTON} bg-goods-terracotta text-white hover:bg-[#a94f35]`}>Start a conversation</a>
              <Link href="/pitch" className={`${BUTTON} border border-goods-ink/25 hover:border-goods-ink`}>Read the pitch</Link>
            </div>
          </div>
          <figure>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-goods-sand sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image src={CLOSE.photo.src} alt={CLOSE.photo.alt} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <figcaption className="mt-3 text-sm text-[#5d574c]">{CLOSE.photo.place}</figcaption>
          </figure>
        </div>

        <dl className="mx-auto mt-14 grid max-w-6xl grid-cols-2 gap-6 border-t border-[#e6dfd1] pt-8 md:grid-cols-4">
          {[
            { v: CANONICAL_ASSETS.bedsDeployed.toLocaleString(), l: `beds delivered to ${CANONICAL_ASSETS.communitiesServed} communities` },
            { v: String(PAID_BEDS), l: 'beds bought and paid for by four organisations' },
            { v: dollars(RAISE.totalShownAud), l: 'asked, across three parts' },
            { v: dollars(RAISE.signedAud), l: 'signed today' },
          ].map((s) => (
            <div key={s.l}>
              <dt className="sr-only">{s.l}</dt>
              <dd className="font-display text-4xl font-semibold">{s.v}</dd>
              <dd className="mt-1 text-sm text-[#5d574c]">{s.l}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Where the money goes */}
      <section id="the-money" className={`scroll-mt-20 bg-goods-ink ${GUTTER} py-16 text-goods-cream md:py-24`}>
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta-light">Where the money goes</p>
          <h2 className="mt-3 max-w-3xl font-display text-4xl font-semibold leading-tight text-balance md:text-5xl">Three parts, and each one ends up somewhere you can see.</h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {LANES.map((lane) => (
              <li key={lane.id} className="flex flex-col rounded-[22px] border border-white/15 bg-white/[0.04] p-6 md:p-7">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta-light">{lane.kicker}</p>
                <p className="mt-2 font-display text-5xl font-semibold">{dollars(lane.source.amount)}</p>
                <div className="mt-6 border-t border-white/15 pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-cream/55">{lane.buys.kicker}</p>
                  <p className="mt-1 font-display text-xl font-semibold">{lane.buys.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-goods-cream/75">{lane.buys.line}</p>
                </div>
                <div className="mt-5 border-t border-white/15 pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-cream/55">{lane.endsUp.kicker}</p>
                  <p className="mt-1 font-display text-xl font-semibold">{lane.endsUp.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-goods-cream/75">{lane.endsUp.line}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-goods-cream/85">
            <span className="font-semibold text-goods-cream">{MONEY_NEVER.title}.</span> {MONEY_NEVER.line}
          </p>
          <Link href="/pitch" className={`${BUTTON} mt-8 bg-goods-cream text-goods-ink hover:bg-white`}>See the whole model</Link>
        </div>
      </section>

      {/* Ways to back it */}
      <section className={`${GUTTER} py-16 md:py-24`}>
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">Ways to back it.</h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WAYS.map((way) => (
              <li key={way.title} className="flex flex-col border-t-2 border-goods-terracotta pt-4">
                <p className="font-display text-2xl font-semibold">{way.title}</p>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-[#4a4741]">{way.line}</p>
                {'href' in way && (
                  <Link href={way.href} className="mt-4 text-[15px] font-semibold text-goods-terracotta underline underline-offset-4 hover:text-goods-ink">{way.link} →</Link>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-[15px] leading-relaxed text-[#5d574c]">
            A community organisation that wants beds to sell? <Link href="/sell-beds" className="font-semibold text-goods-ink underline underline-offset-2">100 beds for your community to sell</Link>.
          </p>
        </div>
      </section>

      {/* Who you are dealing with */}
      <section className={`border-t border-[#e6dfd1] bg-[#FDF8F3] ${GUTTER} py-16 md:py-24`}>
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta">Who you are dealing with</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-balance md:text-5xl">{ORGANISATION.boardLine}</h2>
            <p className="mt-4 text-lg leading-relaxed text-[#4a4741]">{ORGANISATION.identityLine} The products, the making, the contracts and the sales all sit there.</p>
            <Link href="/who-we-are" className={`${BUTTON} mt-6 border border-goods-ink/25 hover:border-goods-ink`}>The board and the team</Link>
          </div>
          <dl className="divide-y divide-[#e6dfd1] rounded-[24px] border border-[#e6dfd1] bg-white px-6">
            {[
              ['Trading name', ORGANISATION.tradingName],
              ['Legal name', ORGANISATION.legalName],
              ['ABN', ORGANISATION.abn],
              ['Charity status', ORGANISATION.charityLine],
            ].map(([k, v]) => (
              <div key={k} className="grid gap-1 py-4 sm:grid-cols-[9rem_1fr] sm:gap-4">
                <dt className="text-sm text-[#5d574c]">{k}</dt>
                <dd className="font-semibold">
                  {k === 'ABN' ? <a href={ORGANISATION.abnLookupUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">{v}</a> : v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Backers */}
      <section className={`${GUTTER} py-16 md:py-24`}>
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">Who has backed the work.</h2>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BACKERS.map((b) => (
              <li key={b.name}>
                <a
                  href={b.href}
                  target={b.href.startsWith('http') ? '_blank' : undefined}
                  rel={b.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex h-full flex-col rounded-[22px] border border-[#e6dfd1] bg-white p-6 transition-colors hover:border-goods-terracotta"
                >
                  <div className="flex h-12 items-center">
                    <Image src={b.src} alt="" width={b.width} height={b.height} className="max-h-12 w-auto max-w-40 object-contain" />
                  </div>
                  <p className="mt-4 font-display text-xl font-semibold">{b.name}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-[#4a4741]">{b.role}</p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Straight answers */}
      <section className={`border-t border-[#e6dfd1] bg-[#FDF8F3] ${GUTTER} py-16 md:py-24`}>
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">Straight answers.</h2>
          <div className="mt-8 divide-y divide-[#e6dfd1] rounded-[24px] border border-[#e6dfd1] bg-white px-6 md:px-8">
            {ANSWERS.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl font-semibold">
                  {item.q}
                  <span aria-hidden="true" className="text-2xl text-goods-terracotta transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[16px] leading-relaxed text-[#4a4741]">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Start */}
      <section id="start" className={`scroll-mt-20 ${GUTTER} py-16 md:py-24`}>
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta">Start a conversation</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">Tell us what you are thinking about.</h2>
            <p className="mt-4 text-lg leading-relaxed text-[#4a4741]">A grant, a gift, a loan or an order. A person from the team reads every message and replies within a few working days.</p>
          </div>
          <PartnershipForm defaultType={requestedType || 'capital-interest'} />
        </div>
      </section>
    </main>
  );
}
