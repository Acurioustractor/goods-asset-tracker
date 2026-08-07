import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Back the work | Goods on Country',
  description:
    'One place to buy or sponsor a bed, fund the work, support community production, or read the full Road to Ownership.',
  alternates: { canonical: 'https://www.goodsoncountry.com/get-involved' },
};

const choices = [
  {
    eyebrow: 'For homes and organisations',
    title: 'Buy a bed',
    amount: '$750',
    body: 'Buy a washable, flat-pack Stretch Bed directly. It is ready now and ships across Australia.',
    cta: 'Buy a Stretch Bed',
    href: '/shop/stretch-bed-single',
    tone: 'bg-goods-coral text-white',
  },
  {
    eyebrow: 'For anyone',
    title: 'Sponsor a bed',
    amount: '$750',
    body: 'Fund one Stretch Bed for a home in a remote community. Choose a community or send it where the need is greatest.',
    cta: 'Sponsor a bed',
    href: '/sponsor',
    tone: 'bg-goods-gold text-goods-ink',
  },
  {
    eyebrow: 'For funders and investors',
    title: 'Fund the work',
    amount: '$300K a year',
    body: 'Help Goods keep making beds, working with communities and supporting community-led enterprises while production grows.',
    cta: 'See the funding options',
    href: '/partner',
    tone: 'bg-goods-teal text-white',
  },
  {
    eyebrow: 'For communities and organisations',
    title: 'Bring the making closer',
    amount: 'Start where you are',
    body: 'A community can begin with one part of the work or build toward a full production facility. The scope starts with what the community wants to own.',
    cta: 'See the partnership pathway',
    href: '/partners',
    tone: 'bg-goods-sage text-goods-ink',
  },
] as const;

export default function GetInvolvedPage() {
  return (
    <main className="bg-goods-cream text-goods-ink">
      <section className="border-b border-goods-grid px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-goods-clay">Back the work</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[0.98] md:text-7xl">
            One place to decide how you want to help.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-goods-sub md:text-xl">
            Buy a bed, sponsor one for a home, fund the work, or help move production closer to
            community. Start with the option that fits you.
          </p>
        </div>
      </section>

      <section className="px-6 py-14 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 xl:grid-cols-4">
          {choices.map((choice) => (
            <article key={choice.title} className="flex min-h-[390px] flex-col border border-goods-grid bg-white p-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-goods-clay">{choice.eyebrow}</p>
              <h2 className="mt-6 font-display text-3xl leading-tight">{choice.title}</h2>
              <p className="mt-3 font-display text-xl text-goods-clay">{choice.amount}</p>
              <p className="mt-6 flex-1 text-base leading-7 text-goods-sub">{choice.body}</p>
              <Link
                href={choice.href}
                className={`mt-8 inline-flex min-h-12 items-center justify-between gap-4 px-5 py-3 text-sm font-semibold ${choice.tone}`}
              >
                {choice.cta} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-goods-ink px-6 py-16 text-goods-cream md:px-10 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-goods-coral">The full story</p>
            <h2 className="mt-5 max-w-3xl font-display text-4xl leading-tight md:text-6xl">
              See what has been built, what communities are asking for, and what the money pays for.
            </h2>
          </div>
          <div>
            <p className="text-base leading-7 text-goods-cream/70">
              The Road to Ownership brings the product, communities, production model, numbers and
              current funding position together in one place.
            </p>
            <Link
              href="/pitch/road"
              className="mt-7 inline-flex min-h-12 items-center gap-3 bg-goods-coral px-6 py-3 text-sm font-semibold text-white"
            >
              Read the Road to Ownership <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-goods-grid px-6 py-14 md:px-10 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-3xl">Need help with a bed or machine?</h2>
            <p className="mt-3 text-base leading-7 text-goods-sub">
              Product support, repairs and replacements are separate from funding the work.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link href="/support" className="inline-flex min-h-11 items-center border border-goods-ink px-5 py-3 text-sm font-semibold">
              Get product support
            </Link>
            <Link href="/contact" className="inline-flex min-h-11 items-center bg-goods-ink px-5 py-3 text-sm font-semibold text-white">
              Contact Goods
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
