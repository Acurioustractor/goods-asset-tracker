import Link from 'next/link';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { COMMUNITY_BED_CANON } from '@/lib/data/community-canonical';
import { COMMUNITY_NEED, COMMUNITY_NEED_GAPS, NEED_SOURCE, NEED_SOURCE_URL } from '@/lib/data/community-need';
import { SUPPLY_FACTS } from '@/lib/data/supply-context';

/**
 * /data — every public Goods number in one place, wearing its status and source.
 *
 * Three layers, three sources of truth, none retyped here:
 *  - delivered: asset-canonical + community-canonical (the register)
 *  - need: community-need (ABS Census 2021 I16 at ILOC grain)
 *  - supply: supply-context (WRINT / NT EPA / ABS, verified 2026-08-24)
 *
 * Claim ceiling: need measures the place, never demand and never an outcome.
 */

const displayFont = { fontFamily: 'Georgia, serif' } as const;

export const metadata = {
  title: 'The data',
  description:
    'Every public Goods number in one place: beds delivered per community, measured overcrowding from the ABS Census, and the recycled-plastic supply, each with its status and source.',
  alternates: { canonical: 'https://www.goodsoncountry.com/data' },
};

const needById = new Map(COMMUNITY_NEED.map((n) => [n.communityId, n]));
const gapById = new Map(COMMUNITY_NEED_GAPS.map((g) => [g.communityId, g]));

export default function DataPage() {
  const communities = [...COMMUNITY_BED_CANON].sort(
    (a, b) => b.basketBeds + b.stretchBeds - (a.basketBeds + a.stretchBeds),
  );

  return (
    <main className="bg-background text-foreground">
      {/* Header */}
      <section className="bg-foreground text-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-accent mb-4">The data</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5" style={displayFont}>
              Every number, with its status and its source.
            </h1>
            <p className="text-lg leading-relaxed opacity-80">
              What the register verifies, what the Census measures, and what the waste stream
              holds. Where a number is missing it says so and says why, because a page that
              only shows what it knows reads as more certain than it is.
            </p>
          </div>
        </div>
      </section>

      {/* Delivered — register canon */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs uppercase tracking-[0.25em] text-accent mb-3">Delivered · register-verified</p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { v: CANONICAL_ASSETS.bedsDeployed, l: 'beds in community' },
                { v: CANONICAL_ASSETS.communitiesServed, l: 'communities served' },
                { v: CANONICAL_ASSETS.washersInCommunity, l: 'washing machines' },
                { v: `${CANONICAL_ASSETS.plasticKg.toLocaleString()}kg`, l: 'recycled HDPE diverted' },
              ].map((f) => (
                <div key={f.l} className="rounded-2xl bg-goods-cream p-6">
                  <p className="text-3xl font-bold" style={displayFont}>
                    {f.v}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{f.l}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Source: the live asset register.{' '}
              <Link href="/register" className="underline underline-offset-2 text-accent">
                Every number, audited
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Per community: delivered beside measured need */}
      <section className="bg-goods-cream py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs uppercase tracking-[0.25em] text-accent mb-3">
              Community by community · delivered beside measured need
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mb-6" style={displayFont}>
              The setting each delivery landed in.
            </h2>
            <div className="overflow-x-auto rounded-2xl bg-background shadow-sm">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-current/10 text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="p-4">Community</th>
                    <th className="p-4 text-right">Beds delivered</th>
                    <th className="p-4 text-right">Households short a bedroom (ABS 2021)</th>
                    <th className="p-4 text-right">Share of households</th>
                    <th className="p-4 text-right">People per dwelling</th>
                  </tr>
                </thead>
                <tbody>
                  {communities.map((c) => {
                    const need = needById.get(c.id);
                    const gap = gapById.get(c.id);
                    return (
                      <tr key={c.id} className="border-b border-current/5 align-top">
                        <td className="p-4 font-medium">
                          {c.registerName}
                          {need?.caveat ? (
                            <p className="mt-1 max-w-[26ch] text-xs font-normal text-muted-foreground">{need.caveat}</p>
                          ) : null}
                        </td>
                        <td className="p-4 text-right tabular-nums">{c.basketBeds + c.stretchBeds}</td>
                        {need ? (
                          <>
                            <td className="p-4 text-right tabular-nums">
                              {need.need1plus.toLocaleString()} of {need.occupiedDwellings.toLocaleString()}
                            </td>
                            <td className="p-4 text-right tabular-nums">{need.need1plusPct}%</td>
                            <td className="p-4 text-right tabular-nums">~{need.personsPerDwelling}</td>
                          </>
                        ) : (
                          <td colSpan={3} className="p-4 text-right text-xs text-muted-foreground">
                            {gap?.reason ?? 'Not yet measured.'}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 max-w-3xl text-xs leading-relaxed text-muted-foreground">
              Need is {NEED_SOURCE}.{' '}
              <a href={NEED_SOURCE_URL} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                ABS DataPacks
              </a>
              . It measures the place on Census night, not demand for any product and not an
              outcome of this work. People-per-dwelling is derived and approximate. Delivered
              counts are the register&rsquo;s, ruled per community.
            </p>
          </div>
        </div>
      </section>

      {/* Supply and need context — the full fact set */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs uppercase tracking-[0.25em] text-accent mb-3">The wider setting</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-6" style={displayFont}>
              The supply is measured. So is the need.
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {SUPPLY_FACTS.map((f) => (
                <div key={f.id} className="rounded-2xl bg-goods-cream p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-xl font-bold" style={displayFont}>
                      {f.value}
                    </p>
                    <span className="shrink-0 rounded-full border border-current/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {f.solidity}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium">{f.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.means}</p>
                  <a
                    href={f.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-xs text-accent underline underline-offset-2"
                  >
                    Source: {f.source.split(',')[0]}
                  </a>
                </div>
              ))}
            </div>
            <p className="mx-auto mt-10 max-w-2xl text-center text-base leading-relaxed text-muted-foreground">
              None of this measures a health outcome, and this page never claims one. It
              measures the setting: the households, the plastic, the beds. The outcomes work
              belongs to communities and their health partners.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
