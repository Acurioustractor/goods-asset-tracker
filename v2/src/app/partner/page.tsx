import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PartnershipForm } from '@/components/partnership-form';
import { WasherInterestForm } from '@/components/washer-interest-form';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { BED, dollars } from '@/lib/data/model-placemat';
import { ORGANISATION } from '@/lib/data/organisation';
import { BUYERS, CLOSE } from '@/lib/data/pitch-chapters';
import { PAID_BEDS, QUESTIONS } from '@/lib/data/story-questions';

/**
 * Back the work: the public page for funders, givers and lenders. Rebuilt 16 September 2026 (Ben:
 * "go") because the old page still said A Curious Tractor sells the beds as "Goods." and asked for
 * $300,000 a year. Ben, 16 September 2026: the raise itself (the three money lanes) is a specific
 * process and lives on /pitch, so this page stays general: ways to back the work, who you are dealing
 * with (organisation.ts), backers and the answers (story-questions.ts).
 */

export const metadata: Metadata = {
  title: 'Back the work',
  description: 'Grants, gifts, loans and orders that put beds in community hands and bring the making closer to community.',
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
    line: `Repaid from the beds ${ORGANISATION.tradingName} sells, on terms agreed with you. Never from a community organisation's sales.`,
  },
  {
    title: 'An order',
    line: `Buy beds for your own service or community at ${dollars(BED.priceAud)} a bed. ${ORGANISATION.seller}`,
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
            <h1 className="mt-4 font-display text-5xl font-semibold leading-tight">Order one, or register for the new version.</h1>
            <p className="mt-5 text-lg leading-relaxed text-[#4a4741]">
              Pakkimjalki Kari is made to order, and a new, cheaper version for community is in the works. Tell us about your community and what you need, and we will talk through ordering one now or let you know when the new version is ready to test.
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
              Grants buy beds for community organisations and help build community production facilities. Gifts and loans carry the work in between. The pitch sets out the current raise, and what is signed.
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
            { v: String(CANONICAL_ASSETS.washersInCommunity), l: 'washing machines in community' },
            { v: `${CANONICAL_ASSETS.plasticKg.toLocaleString()}kg`, l: 'plastic diverted' },
          ].map((s) => (
            <div key={s.l}>
              <dt className="sr-only">{s.l}</dt>
              <dd className="font-display text-4xl font-semibold">{s.v}</dd>
              <dd className="mt-1 text-sm text-[#5d574c]">{s.l}</dd>
            </div>
          ))}
        </dl>
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
            <p className="mt-4 text-lg leading-relaxed text-[#4a4741]">{ORGANISATION.identityLine} {ORGANISATION.holds} {ORGANISATION.seller}</p>
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
