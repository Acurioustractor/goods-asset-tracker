import Link from 'next/link';
import { CANONICAL_ASSETS, WASHERS_IN_COMMUNITY_BY_COMMUNITY } from '@/lib/data/asset-canonical';
import { COMMUNITY_BED_CANON } from '@/lib/data/community-canonical';
import { COMMUNITY_NEED, COMMUNITY_NEED_GAPS, NEED_SOURCE, NEED_SOURCE_URL } from '@/lib/data/community-need';
import { SUPPLY_FACTS, PLASTIC_KG_PER_BED } from '@/lib/data/supply-context';
import { communityLocations } from '@/lib/data/content';
import {
  COMMUNITY_HEALTH,
  COMMUNITY_HEALTH_GAPS,
  HEALTH_SOURCE_LGA,
  HEALTH_SOURCE_LGA_URL,
  HEALTH_SOURCE_ILOC,
} from '@/lib/data/community-health';
import { DataMap, type PlaceRead } from './data-map';

/** canon id -> communityLocations id, where they differ. */
const LOCATION_ID: Record<string, string> = { utopia: 'utopia-homelands' };

/**
 * /data — every public Goods number in one place, wearing its status and source.
 *
 * Three layers, three sources of truth, none retyped here:
 *  - delivered: asset-canonical + community-canonical (the register)
 *  - need: community-need (ABS Census 2021 I16 at ILOC grain)
 *  - supply: supply-context (WRINT / NT EPA / ABS, verified 2026-08-24)
 *
 * Form decisions (dataviz method): overcrowding is the ONE cross-community
 * comparable measure, so it alone gets a bar — single hue (goods-clay, the
 * palette's chart anchor; sage fails validation beside it), every value
 * directly labeled, no second axis. Beds/washers/plastic are context counts
 * and stay as numbers. Need measures the place, never demand or an outcome.
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
const maxPct = Math.max(...COMMUNITY_NEED.map((n) => n.need1plusPct));

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="shrink-0 rounded-full border border-goods-grid bg-goods-cream px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-goods-sub">
      {children}
    </span>
  );
}

export default function DataPage() {
  const communities = [...COMMUNITY_BED_CANON].sort((a, b) => {
    const na = needById.get(a.id)?.need1plusPct ?? -1;
    const nb = needById.get(b.id)?.need1plusPct ?? -1;
    return nb - na || b.basketBeds + b.stretchBeds - (a.basketBeds + a.stretchBeds);
  });

  const delivered = [
    { v: String(CANONICAL_ASSETS.bedsDeployed), l: 'beds in community', s: `${CANONICAL_ASSETS.stretchBedsDeployed} Stretch · ${CANONICAL_ASSETS.basketBedsDeployed} Basket` },
    { v: String(CANONICAL_ASSETS.communitiesServed), l: 'communities served', s: `${CANONICAL_ASSETS.distinctCommunities} distinct places touched` },
    { v: String(CANONICAL_ASSETS.washersInCommunity), l: 'washing machines', s: 'Pakkimjalki Kari, in community' },
    { v: `${CANONICAL_ASSETS.plasticKg.toLocaleString()}kg`, l: 'recycled HDPE diverted', s: `Stretch only, ${PLASTIC_KG_PER_BED}kg per bed` },
  ];

  const reads: PlaceRead[] = COMMUNITY_BED_CANON.map((c) => {
    const need = needById.get(c.id);
    const gap = gapById.get(c.id);
    return {
      locationId: LOCATION_ID[c.id] ?? c.id,
      name: c.registerName,
      beds: c.basketBeds + c.stretchBeds,
      bedsSplit: [
        c.stretchBeds > 0 ? `${c.stretchBeds} Stretch` : '',
        c.basketBeds > 0 ? `${c.basketBeds} Basket` : '',
      ]
        .filter(Boolean)
        .join(' · '),
      washers: WASHERS_IN_COMMUNITY_BY_COMMUNITY[c.id] ?? 0,
      plasticKg: c.stretchBeds * PLASTIC_KG_PER_BED,
      need: need
        ? {
            pct: need.need1plusPct,
            short: need.need1plus,
            occupied: need.occupiedDwellings,
            ilocName: need.ilocName,
            caveat: need.caveat,
          }
        : null,
      gapReason: gap?.reason,
    };
  });

  return (
    <main className="bg-background text-foreground">
      {/* ── Header ─────────────────────────────────────────────── */}
      <section className="bg-foreground text-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-goods-terracotta-light">The data</p>
            <h1 className="mb-5 text-4xl font-bold leading-tight md:text-5xl" style={displayFont}>
              Every number, with its status and its source.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed opacity-80">
              What the register verifies, what the Census measures, and what the waste stream
              holds. Where a number is missing, this page says so and says why, because a page
              that only shows what it knows reads as more certain than it is.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs opacity-70">
              <span className="rounded-full border border-current/25 px-3 py-1">Register: live</span>
              <span className="rounded-full border border-current/25 px-3 py-1">Census: 10 Aug 2021</span>
              <span className="rounded-full border border-current/25 px-3 py-1">Waste flows: FY 2023-24</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Delivered — register canon ─────────────────────────── */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex items-baseline justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.25em] text-goods-terracotta">Delivered · register-verified</p>
              <Link href="/register" className="text-xs text-goods-terracotta underline underline-offset-2">
                Every number, audited →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {delivered.map((f) => (
                <div key={f.l} className="rounded-2xl border border-goods-grid bg-goods-card p-6">
                  <p className="text-4xl font-bold tabular-nums" style={displayFont}>
                    {f.v}
                  </p>
                  <p className="mt-1 text-sm font-medium">{f.l}</p>
                  <p className="mt-1 text-xs text-goods-sub">{f.s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Community by community ─────────────────────────────── */}
      <section className="bg-goods-cream-muted py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-goods-terracotta">
              Community by community
            </p>
            <div className="mb-10">
              <DataMap locations={communityLocations} reads={reads} />
            </div>
            <h2 className="mb-3 text-2xl font-bold md:text-3xl" style={displayFont}>
              The setting each delivery landed in.
            </h2>
            <p className="mb-8 max-w-3xl text-sm leading-relaxed text-goods-sub">
              Overcrowding is the one measure comparable across places, so it carries the bar:
              the share of households needing at least one more bedroom on Census night.
              Delivered counts sit beside it as context. A bed is not a household, so the two
              are never divided into a coverage figure.
            </p>

            <div className="overflow-x-auto rounded-2xl border border-goods-grid bg-goods-card">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead>
                  <tr className="border-b border-goods-grid text-[11px] uppercase tracking-wider text-goods-sub">
                    <th className="p-4 font-medium">Community</th>
                    <th className="p-4 text-right font-medium">Beds</th>
                    <th className="p-4 text-right font-medium">Washers</th>
                    <th className="p-4 text-right font-medium">HDPE diverted</th>
                    <th className="w-[34%] p-4 font-medium">Households short a bedroom · ABS 2021</th>
                    <th className="p-4 text-right font-medium">People / dwelling</th>
                  </tr>
                </thead>
                <tbody>
                  {communities.map((c) => {
                    const need = needById.get(c.id);
                    const gap = gapById.get(c.id);
                    const beds = c.basketBeds + c.stretchBeds;
                    const washers = WASHERS_IN_COMMUNITY_BY_COMMUNITY[c.id] ?? 0;
                    const plasticKg = c.stretchBeds * PLASTIC_KG_PER_BED;
                    return (
                      <tr key={c.id} className="border-b border-goods-grid/60 align-top last:border-0">
                        <td className="p-4">
                          <p className="font-semibold">{c.registerName}</p>
                          {need?.caveat ? (
                            <p className="mt-1 max-w-[24ch] text-xs leading-snug text-goods-sub">{need.caveat}</p>
                          ) : null}
                        </td>
                        <td className="p-4 text-right">
                          <p className="font-semibold tabular-nums">{beds}</p>
                          <p className="text-xs tabular-nums text-goods-sub">
                            {c.stretchBeds > 0 ? `${c.stretchBeds} Stretch` : ''}
                            {c.stretchBeds > 0 && c.basketBeds > 0 ? ' · ' : ''}
                            {c.basketBeds > 0 ? `${c.basketBeds} Basket` : ''}
                          </p>
                        </td>
                        <td className="p-4 text-right tabular-nums">{washers > 0 ? washers : '·'}</td>
                        <td className="p-4 text-right tabular-nums">
                          {plasticKg > 0 ? `~${plasticKg.toLocaleString()}kg` : '·'}
                        </td>
                        {need ? (
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-goods-sand/60">
                                <div
                                  className="h-full rounded-full bg-goods-clay"
                                  style={{ width: `${(100 * need.need1plusPct) / Math.max(maxPct, 1)}%` }}
                                  title={`${need.need1plus.toLocaleString()} of ${need.occupiedDwellings.toLocaleString()} households (${need.need1plusPct}%)`}
                                />
                              </div>
                              <span className="w-14 shrink-0 text-right font-semibold tabular-nums">
                                {need.need1plusPct}%
                              </span>
                            </div>
                            <p className="mt-1 text-xs tabular-nums text-goods-sub">
                              {need.need1plus.toLocaleString()} of {need.occupiedDwellings.toLocaleString()} households · ILOC {need.ilocName}
                            </p>
                          </td>
                        ) : (
                          <td className="p-4 text-xs leading-snug text-goods-sub">{gap?.reason ?? 'Not yet measured.'}</td>
                        )}
                        <td className="p-4 text-right tabular-nums">{need ? `~${need.personsPerDwelling}` : '·'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="mt-3 max-w-3xl text-xs leading-relaxed text-goods-sub">
              Bars share one scale, longest bar = highest measured share ({maxPct}%). HDPE
              diverted is derived: Stretch Beds × {PLASTIC_KG_PER_BED}kg, a workpaper figure until the
              measured run weighs it. Delivered counts are the register&rsquo;s, ruled per
              community; washers are the settled per-community ruling.
            </p>
          </div>
        </div>
      </section>

      {/* ── The health setting ─────────────────────────────────── */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-goods-terracotta">
              The health setting · measured, regional
            </p>
            <h2 className="mb-3 text-2xl font-bold md:text-3xl" style={displayFont}>
              Why a bed is health hardware here.
            </h2>
            <p className="mb-8 max-w-3xl text-sm leading-relaxed text-goods-sub">
              Two measured layers, at two grains. The region each community sits in (its local
              government area, which is bigger than the community, and named so the two are
              never confused): median age at death, and hospital admissions for conditions that
              should not need a hospital, as a ratio against Australia at 100. Then, where the
              Census measures it at community grain, what people themselves reported living
              with. None of this is an outcome of this work. It is the setting the work
              happens in.
            </p>

            <div className="overflow-x-auto rounded-2xl border border-goods-grid bg-goods-card">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead>
                  <tr className="border-b border-goods-grid text-[11px] uppercase tracking-wider text-goods-sub">
                    <th className="p-4 font-medium">Community · its LGA</th>
                    <th className="p-4 text-right font-medium">Median age at death</th>
                    <th className="w-[32%] p-4 font-medium">Preventable admissions vs Australia (=1.0)</th>
                    <th className="p-4 font-medium">Reported conditions · community grain</th>
                  </tr>
                </thead>
                <tbody>
                  {[...COMMUNITY_HEALTH]
                    .sort((a, b) => b.pphSr - a.pphSr)
                    .map((h) => (
                      <tr key={h.communityId} className="border-b border-goods-grid/60 align-top last:border-0">
                        <td className="p-4">
                          <p className="font-semibold">
                            {COMMUNITY_BED_CANON.find((c) => c.id === h.communityId)?.registerName}
                          </p>
                          <p className="text-xs text-goods-sub">LGA: {h.lgaName}</p>
                        </td>
                        <td className="p-4 text-right">
                          <p className="font-semibold tabular-nums">{h.medianAgeDeath} years</p>
                          <p className="text-xs tabular-nums text-goods-sub">{h.deaths.toLocaleString()} deaths, 2019-2023</p>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-goods-sand/60">
                              <div
                                className="h-full rounded-full bg-goods-clay"
                                style={{ width: `${Math.min(100, (100 * h.pphSr) / 949)}%` }}
                                title={`Standardised ratio ${h.pphSr} vs Australia = 100 (2020/21)`}
                              />
                            </div>
                            <span className="w-12 shrink-0 text-right font-semibold tabular-nums">
                              {(h.pphSr / 100).toFixed(1)}x
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-xs leading-relaxed text-goods-sub">
                          {h.iloc ? (
                            <>
                              Of {h.iloc.personsCounted.toLocaleString()} Aboriginal and Torres Strait
                              Islander people counted in {h.iloc.ilocName}: {h.iloc.heartDisease} living
                              with heart disease, {h.iloc.kidneyDisease} with kidney disease,{' '}
                              {h.iloc.diabetes} with diabetes. Median age {h.iloc.medianAge}.
                            </>
                          ) : (
                            h.ilocGapReason ?? 'Community-grain Census data not available.'
                          )}
                        </td>
                      </tr>
                    ))}
                  {COMMUNITY_HEALTH_GAPS.map((g) => (
                    <tr key={g.communityId} className="border-b border-goods-grid/60 align-top last:border-0">
                      <td className="p-4 font-semibold">
                        {COMMUNITY_BED_CANON.find((c) => c.id === g.communityId)?.registerName}
                      </td>
                      <td colSpan={3} className="p-4 text-xs leading-snug text-goods-sub">
                        {g.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mt-3 max-w-3xl text-xs leading-relaxed text-goods-sub">
              Across Australia the median age at death is in the early 80s. Bars share one
              scale (longest = Barkly at 9.5x). Regional data:{' '}
              <a href={HEALTH_SOURCE_LGA_URL} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                {HEALTH_SOURCE_LGA}
              </a>
              . Community-grain conditions: {HEALTH_SOURCE_ILOC} — self-reported, small counts
              randomly adjusted by the ABS. This section measures the setting, never an outcome
              of this work.
            </p>
          </div>
        </div>
      </section>

      {/* ── The wider setting ──────────────────────────────────── */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-goods-terracotta">The wider setting</p>
            <h2 className="mb-6 text-2xl font-bold md:text-3xl" style={displayFont}>
              The supply is measured. So is the need.
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {SUPPLY_FACTS.map((f) => (
                <div key={f.id} className="flex flex-col rounded-2xl border border-goods-grid bg-goods-card p-6">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-xl font-bold" style={displayFont}>
                      {f.value}
                    </p>
                    <Badge>{f.solidity}</Badge>
                  </div>
                  <p className="mt-1 text-sm font-medium">{f.label}</p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-goods-sub">{f.means}</p>
                  <a
                    href={f.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-xs text-goods-terracotta underline underline-offset-2"
                  >
                    Source: {f.source.split(',')[0]} · as at {f.asAt}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Method & sources ───────────────────────────────────── */}
      <section className="border-t border-goods-grid bg-goods-cream-muted py-14 md:py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-goods-terracotta">Method</p>
            <h2 className="mb-5 text-xl font-bold md:text-2xl" style={displayFont}>
              How to read this page.
            </h2>
            <ul className="space-y-3 text-sm leading-relaxed text-goods-sub">
              <li>
                <strong className="text-foreground">Delivered</strong> comes from the live asset
                register, audited in the open at{' '}
                <Link href="/register" className="text-goods-terracotta underline underline-offset-2">
                  /register
                </Link>
                . Register counts are assets in community, not sales.
              </li>
              <li>
                <strong className="text-foreground">Need</strong> is {NEED_SOURCE} (
                <a href={NEED_SOURCE_URL} target="_blank" rel="noreferrer" className="text-goods-terracotta underline underline-offset-2">
                  ABS DataPacks
                </a>
                ). It measures the place on Census night, not demand for any product and not an
                outcome of this work. ABS randomly adjusts small counts, so components never sum
                exactly. People-per-dwelling is derived and approximate. Communities outside the
                NT show the reason they are unmeasured; the QLD and WA packs are the next ingest.
              </li>
              <li>
                <strong className="text-foreground">Supply</strong> figures come from the NT
                waste-industry material-flow report and the NT EPA container-deposit annual
                report, verified against the primary documents on 24 August 2026. How plastic
                becomes a bed:{' '}
                <Link href="/process" className="text-goods-terracotta underline underline-offset-2">
                  /process
                </Link>
                .
              </li>
              <li>
                <strong className="text-foreground">What this page never claims:</strong> a
                health outcome. Beds and washing machines support household conditions connected
                to rest and hygiene; measuring health outcomes belongs to communities and their
                health partners, and no figure here should be read as one.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
