import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ContactGoodsButton } from '@/components/contact/contact-goods-button';
import { goodsBoard as DIRECTORS } from '@/lib/data/goods-board';
import { ORGANISATION } from '@/lib/data/organisation';
import { GOVERNANCE } from '@/lib/data/pitch-chapters';

const TEAM = GOVERNANCE.staff;

/**
 * Who Goods on Country is, for anyone deciding whether to buy from, give to or work with it: the
 * entity and its ABN (with a link to the public register), the charity status, the board, the team,
 * how community partners stand, and where every public number is sourced. Ben, 15 September 2026:
 * entity, ABN, board and team, with the board handover stated and no chair printed. Every fact is
 * read from organisation.ts and goods-board.ts.
 */

export const metadata: Metadata = {
  title: 'Who we are',
  description: `${ORGANISATION.identityLine} ABN ${ORGANISATION.abn}. The board, the team, and where every public number comes from.`,
};

const HONEST = [
  { href: '/register', title: 'The public register', line: 'Every public number, with its source.' },
  { href: '/data', title: 'The data', line: 'Every figure, with its status: verified, estimate or modelled.' },
  { href: '/pitch', title: 'The model', line: 'How beds, money and facilities move, chapter by chapter.' },
  { href: '/case-studies', title: 'How the runs worked', line: 'Maningrida and Utopia, told plainly.' },
] as const;

export default function WhoWeArePage() {
  return (
    <main className="bg-goods-cream text-goods-ink">
      {/* Hero */}
      <section className="px-6 pb-14 pt-12 md:px-10 md:pb-20 md:pt-20 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta">Who we are</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold leading-[1.02] tracking-[-0.01em] text-balance md:text-7xl">{ORGANISATION.boardLine}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#4a4741] md:text-xl">
            {ORGANISATION.identityLine} {ORGANISATION.holds}
          </p>
        </div>

        {/* The entity, as a register would print it */}
        <dl className="mx-auto mt-12 grid max-w-6xl gap-px overflow-hidden rounded-[24px] border border-[#e6dfd1] bg-[#e6dfd1] sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: 'Trading as', v: ORGANISATION.tradingName },
            { k: 'Legal name', v: ORGANISATION.legalName },
            { k: 'ABN', v: ORGANISATION.abn, href: ORGANISATION.abnLookupUrl },
            { k: 'Status', v: ORGANISATION.charityLine },
          ].map((row) => (
            <div key={row.k} className="bg-white p-6">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a7363]">{row.k}</dt>
              <dd className="mt-2 font-display text-xl font-semibold leading-snug">
                {row.href ? (
                  <a href={row.href} target="_blank" rel="noreferrer" className="underline decoration-[#c18a7b] underline-offset-4 hover:text-goods-terracotta">
                    {row.v}
                  </a>
                ) : (
                  row.v
                )}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mx-auto mt-3 max-w-6xl text-sm text-[#5d574c]">
          Check the ABN on the public register at <a href={ORGANISATION.abnLookupUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">ABN Lookup</a>. ACN {ORGANISATION.acn}.
        </p>
      </section>

      {/* The board */}
      <section className="border-t border-[#e6dfd1] bg-[#FDF8F3] px-6 py-16 md:px-10 md:py-24 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">The board.</h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[#4a4741]">{ORGANISATION.boardNote}</p>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {DIRECTORS.map((d) => (
              <li key={d.name} className="flex flex-col overflow-hidden rounded-[24px] border border-[#e6dfd1] bg-white">
                <div className="relative aspect-[4/3] bg-goods-sand sm:aspect-square">
                  <Image src={d.photo} alt={`${d.name}, ${d.role}`} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-goods-terracotta">{d.role} · {d.country}</p>
                  <p className="mt-2 font-display text-2xl font-semibold leading-tight">{d.name}</p>
                  <p className="mt-1 text-sm text-[#5d574c]">{d.location}</p>
                  <p className="mt-4 text-[15px] leading-relaxed text-[#4a4741]">{d.bio}</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-[#4a4741]">{d.goods}</p>
                  <p className="mt-auto pt-5 text-xs text-[#7a7363]">
                    Photograph: {d.photoCredit} ·{' '}
                    <a href={d.source} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                      {d.sourceLabel}
                    </a>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The team and partners */}
      <section className="px-6 py-16 md:px-10 md:py-24 lg:px-14">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-start">
          <div>
            <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">The team.</h2>
            <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[24px] bg-goods-sand">
              <Image src="/images/people/nic-and-ben-warumungu.jpg" alt="Nic Marchesi and Ben Knight on Warumungu Country" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2">
              {TEAM.map((s) => (
                <li key={s.name} className="border-t border-[#e6dfd1] pt-4">
                  <p className="font-display text-xl font-semibold">{s.name}</p>
                  <p className="text-sm text-[#5d574c]">{s.role}</p>
                  <p className="mt-2 text-[15px] text-[#4a4741]">{s.line}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[24px] bg-goods-ink p-7 text-goods-cream md:p-9">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-goods-terracotta-light">Community partners</p>
            <p className="mt-3 font-display text-2xl font-semibold leading-snug">{ORGANISATION.partners}</p>
            <Link href="/partners/oonchiumpa" className="mt-6 inline-flex min-h-11 items-center rounded-full border border-goods-cream/30 px-5 text-sm font-semibold hover:border-goods-cream">
              Oonchiumpa, in Alice Springs
            </Link>
          </div>
        </div>
      </section>

      {/* Where the numbers come from */}
      <section className="border-t border-[#e6dfd1] bg-[#FDF8F3] px-6 py-16 md:px-10 md:py-24 lg:px-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-4xl font-semibold leading-tight md:text-5xl">Check our numbers.</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HONEST.map((h) => (
              <li key={h.href}>
                <Link href={h.href} className="block h-full rounded-[22px] border border-[#e6dfd1] bg-white p-6 transition-colors hover:border-goods-terracotta">
                  <p className="font-display text-xl font-semibold">{h.title}</p>
                  <p className="mt-2 text-[15px] leading-relaxed text-[#4a4741]">{h.line}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Ways in */}
      <section className="bg-goods-ink px-6 py-14 text-goods-cream md:px-10 md:py-16 lg:px-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-3xl font-semibold leading-tight md:text-4xl">Buy beds, bring the making closer, or talk to us.</p>
            <p className="mt-2 max-w-xl text-goods-cream/80">{ORGANISATION.giving}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/beds" className="inline-flex min-h-12 items-center rounded-full bg-goods-cream px-6 font-semibold text-goods-ink hover:bg-white">Buy beds</Link>
            <Link href="/facilities" className="inline-flex min-h-12 items-center rounded-full border border-goods-cream/40 px-6 font-semibold hover:border-goods-cream">Facilities</Link>
            <ContactGoodsButton variant="solid" label="Talk to us" />
          </div>
        </div>
      </section>
    </main>
  );
}
