import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TheoryOfChange } from '@/components/marketing';
import { fetchImpactData } from '@/lib/data/impact-fetcher';
import {
  MODELLED_LABOUR_HOURS_PER_BED,
  REVENUE_SEGMENTS,
  CANONICAL_BUILD_PATHS,
  CANONICAL_WEBSITE_PRICE,
} from '@/lib/data/impact-model';
import type { ImpactSnapshot, ImpactDimension, ImpactMetric } from '@/lib/data/impact-model';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impact Model: Goods on Country',
  description:
    'Goods on Country impact model: five outcome domains (rest and health; dignity and safety; self-determination and community-led design; jobs and ownership; circular and local economy) carried by community voices and canon numbers.',
  alternates: {
    canonical: 'https://www.goodsoncountry.com/impact',
  },
  openGraph: {
    title: 'Goods on Country Impact Model',
    description:
      'Impact reporting for Stretch Beds, recycled plastic, community ownership and practical household infrastructure in remote Australia.',
    url: 'https://www.goodsoncountry.com/impact',
    images: [
      {
        url: 'https://www.goodsoncountry.com/images/media-pack/community-testing-bed-golden-hour.jpg',
        width: 1200,
        height: 900,
        alt: 'Community member testing a Goods on Country Stretch Bed',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Helper components
// ---------------------------------------------------------------------------

// Provenance tiers — each /impact metric carries a confidence tier so no number
// reads as a uniformly "live / measured" figure. Shared by the badge + the legend.
const CONFIDENCE_META: Record<
  ImpactMetric['confidence'],
  { label: string; bg: string; fg: string; desc: string }
> = {
  verified: { label: 'Verified', bg: '#E6EDDD', fg: '#4F6138', desc: 'System or measured fact' },
  modelled: { label: 'Modelled', bg: '#E2E9F0', fg: '#3C566B', desc: 'Derived from stated assumptions' },
  estimate: { label: 'Estimate', bg: '#F3E6D2', fg: '#8A6433', desc: 'Partial-data approximation' },
  target: { label: 'Target', bg: '#E9E5E1', fg: '#6A5E54', desc: 'Design goal, not yet achieved' },
};

function ProvenanceBadge({ metric }: { metric: ImpactMetric }) {
  const s = CONFIDENCE_META[metric.confidence];
  return (
    <span
      className="ml-1.5 inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide align-middle"
      style={{ backgroundColor: s.bg, color: s.fg }}
      title={`${s.label}: ${s.desc}. Source (${metric.source}): ${metric.sourceDetail}`}
    >
      {s.label}
    </span>
  );
}

function ProvenanceLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-10">
      <span className="text-xs uppercase tracking-widest" style={{ color: '#8B9D77' }}>
        How to read these numbers:
      </span>
      {(Object.keys(CONFIDENCE_META) as ImpactMetric['confidence'][]).map((key) => {
        const i = CONFIDENCE_META[key];
        return (
          <span
            key={key}
            className="inline-flex items-center gap-1.5 text-xs"
            style={{ color: '#5E5E5E' }}
          >
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide"
              style={{ backgroundColor: i.bg, color: i.fg }}
            >
              {i.label}
            </span>
            {i.desc}
          </span>
        );
      })}
    </div>
  );
}

function MetricProgress({
  metric,
  size = 'default',
}: {
  metric: ImpactMetric;
  size?: 'default' | 'large';
}) {
  const current = metric.current ?? 0;
  const target = metric.targets.year1;
  const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;

  const formatValue = (val: number, unit: string) => {
    if (unit === '$' || unit === '$/bed') return `$${val.toLocaleString()}`;
    if (unit === '%') return `${val}%`;
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `${(val / 1_000).toFixed(1)}K`;
    return val.toLocaleString();
  };

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1">
        <span
          className={size === 'large' ? 'text-sm font-medium' : 'text-xs'}
          style={{ color: '#5E5E5E' }}
        >
          {metric.name}
          <ProvenanceBadge metric={metric} />
        </span>
        <span className={size === 'large' ? 'text-sm' : 'text-xs'} style={{ color: '#8B9D77' }}>
          {formatValue(current, metric.unit)} / {formatValue(target, metric.unit)} yr 1
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#E8DED4' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${progress}%`, backgroundColor: '#C45C3E' }}
        />
      </div>
    </div>
  );
}

function DimensionIcon({ icon, color }: { icon: string; color: string }) {
  const iconPaths: Record<string, string> = {
    heart: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    leaf: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    briefcase: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    users: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    factory: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
    home: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  };

  return (
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
      style={{ backgroundColor: color }}
    >
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d={iconPaths[icon] || iconPaths.heart}
        />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dashboard sections
// ---------------------------------------------------------------------------

function LossFunctionSection({ snapshot }: { snapshot: ImpactSnapshot }) {
  const { summary } = snapshot;

  return (
    <section className="py-12" style={{ backgroundColor: '#C45C3E' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-sm uppercase tracking-widest text-white/60 mb-2">By the numbers</p>
          <h2 className="text-2xl font-light text-white" style={{ fontFamily: 'Georgia, serif' }}>
            What is deployed, and what it cost
          </h2>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {[
            { value: summary.totalAssets, label: 'Assets Deployed', sub: 'beds + washers' },
            { value: `${(summary.livesImpacted).toLocaleString()}+`, label: 'Lives Impacted', sub: 'avg 2.5 per bed' },
            { value: `${(summary.plasticDivertedKg / 1000).toFixed(1)}t`, label: 'Plastic Diverted', sub: `${summary.plasticDivertedKg.toLocaleString()}kg` },
            { value: summary.communitiesServed, label: 'Communities', sub: 'across Australia' },
            { value: summary.employmentHoursCreated.toLocaleString(), label: 'Employment Hrs', sub: `${MODELLED_LABOUR_HOURS_PER_BED.toFixed(1)}hrs/bed` },
            { value: `$${(summary.totalInvestment / 1000).toFixed(0)}K`, label: 'Invested', sub: `$${(summary.totalInvestment / summary.totalAssets).toFixed(0)}/asset` },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl md:text-4xl font-light text-white mb-1">{stat.value}</p>
              <p className="text-xs md:text-sm text-white/90 font-medium">{stat.label}</p>
              <p className="text-xs text-white/50 mt-0.5 hidden md:block">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DimensionCard({ dimension }: { dimension: ImpactDimension }) {
  const primary = dimension.metrics.find((m) => m.id === dimension.primaryMetricId);
  const supporting = dimension.metrics.filter((m) => m.id !== dimension.primaryMetricId).slice(0, 3);

  const formatPrimary = (val: number, unit: string) => {
    if (unit === '$') return `$${val.toLocaleString()}`;
    if (unit === '$/bed') return `$${val}`;
    if (unit === '%') return `${val}%`;
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return val.toLocaleString();
    return val.toString();
  };

  return (
    <Card className="border-0 shadow-sm overflow-hidden" style={{ backgroundColor: '#FDF8F3' }}>
      <CardContent className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <DimensionIcon icon={dimension.icon} color={dimension.color} />
          <div>
            <h3 className="font-medium" style={{ color: '#2E2E2E' }}>
              {dimension.name}
            </h3>
            <p className="text-xs" style={{ color: '#5E5E5E' }}>
              {dimension.description}
            </p>
          </div>
        </div>

        {/* Primary metric — big number */}
        {primary && (
          <div className="mb-4">
            <p className="text-3xl font-light mb-1" style={{ color: dimension.color }}>
              {formatPrimary(primary.current ?? 0, primary.unit)}
            </p>
            <MetricProgress metric={primary} size="large" />
          </div>
        )}

        {/* Supporting metrics */}
        <div className="space-y-3">
          {supporting.map((metric) => (
            <MetricProgress key={metric.id} metric={metric} />
          ))}
        </div>

        {/* Community quote */}
        {dimension.communityQuote && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: '#E8DED4' }}>
            <p className="text-sm italic" style={{ color: '#5E5E5E' }}>
              &ldquo;{dimension.communityQuote.text}&rdquo;
            </p>
            <p className="text-xs mt-1" style={{ color: '#8B9D77' }}>
              {dimension.communityQuote.author}, {dimension.communityQuote.context}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// The top line: three shifts (the elevator version). Each shift gathers outcome
// domains beneath it (framework §2). This is the headline; the five domains carry
// the evidence underneath.
function ThreeShiftsSection() {
  const shifts = [
    {
      label: 'Material shift',
      color: '#8B9D77',
      text: 'Waste plastic becomes a durable, washable, repairable good, made On Country.',
    },
    {
      label: 'Economic shift',
      color: '#5E7D9A',
      text: 'The freight tax puts a basic good out of reach, so the bed is built to beat the true remote cost. Value, jobs and the making stay local, and the in-house cost-down moves Goods from grant-funded toward an enterprise communities can own.',
    },
    {
      label: 'Story shift',
      color: '#C45C3E',
      text: 'Communities name it (Pakkimjalki Kari, named in Warumungu), design it, and own the record of it, on their terms. This is Indigenous self-determination.',
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
            The top line
          </p>
          <h2
            className="text-3xl font-light mb-2"
            style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}
          >
            Three shifts
          </h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: '#5E5E5E' }}>
            In one breath, the change is three shifts. The five domains beneath them carry the evidence:
            a community voice, a counted number, and an honest label, on the same beat.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
          {shifts.map((s) => (
            <div
              key={s.label}
              className="rounded-lg p-6 border-l-4"
              style={{ borderColor: s.color, backgroundColor: '#FDF8F3' }}
            >
              <p className="text-sm font-medium uppercase tracking-wide mb-2" style={{ color: s.color }}>
                {s.label}
              </p>
              <p className="text-sm" style={{ color: '#5E5E5E' }}>
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FiveDomainsSection({ dimensions }: { dimensions: ImpactDimension[] }) {
  return (
    <section className="py-16 md:py-20" style={{ backgroundColor: '#FDF8F3' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
            Five domains
          </p>
          <h2
            className="text-3xl font-light mb-2"
            style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}
          >
            How the change shows up
          </h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: '#5E5E5E' }}>
            Five outcome domains, each pairing a cleared community voice with a canon number from our
            asset register, fleet telemetry and community engagement. Every number carries an honest
            label and a target for Year 1, Year 3 and 2030.
          </p>
        </div>

        <ProvenanceLegend />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {dimensions.map((dim) => (
            <DimensionCard key={dim.id} dimension={dim} />
          ))}
        </div>
      </div>
    </section>
  );
}

// The two through-lines that run across all five domains (framework §6): the
// economics story and Indigenous sovereignty. Not separate domains; the spine that
// connects them.
function ThroughLinesSection() {
  const lines = [
    {
      label: 'The economics are the impact',
      color: '#5E7D9A',
      text: 'A basic good is out of reach in remote communities because of the freight tax and goods that fail in months. Goods answers with a durable, washable, repairable bed built to beat the true remote cost, made On Country so the value and the jobs stay local, with an in-house cost-down that moves the work from grant-funded toward a community-owned enterprise that can stand on its own.',
    },
    {
      label: 'Indigenous sovereignty',
      color: '#C45C3E',
      text: 'Self-determination runs through every layer: cultural (the washing machine named Pakkimjalki Kari in Warumungu), design (named and tested in community), data (consent travels with the story), and economic (jobs, then ownership of the making). Sovereignty is what "become unnecessary" means in practice.',
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              Two through-lines
            </p>
            <h2
              className="text-3xl font-light mb-2"
              style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}
            >
              What runs across all five
            </h2>
            <p className="text-sm max-w-xl mx-auto" style={{ color: '#5E5E5E' }}>
              Two lines connect the domains. They are the spine of the story, not a footnote to the product.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {lines.map((l) => (
              <div
                key={l.label}
                className="rounded-lg p-6 border-l-4"
                style={{ borderColor: l.color, backgroundColor: '#FDF8F3' }}
              >
                <p className="text-base font-medium mb-2" style={{ color: l.color, fontFamily: 'Georgia, serif' }}>
                  {l.label}
                </p>
                <p className="text-sm" style={{ color: '#5E5E5E' }}>
                  {l.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// CLAIM CEILING (P0, 2026-06-18): this section is the WHY (the reason a bed and a
// washing machine are health hardware), never a claimed outcome. The "INTERRUPTED"
// badges, the interrupted-step colouring, the "RHD Is Entirely Preventable" header
// and the "beds interrupting floor sleeping / wash cycles breaking scabies chain"
// labels were removed: each implied a prevented health outcome we cannot stand
// behind. A health outcome only returns when a partner clinical method (Miwatj)
// produces it, attributed to that partner.
function HealthCascadeSection({ cascade }: { cascade: ImpactSnapshot['healthCascade'] }) {
  return (
    <section className="py-16 md:py-20" style={{ backgroundColor: '#2E2E2E' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-white/50 mb-4">
              Why this is health hardware
            </p>
            <h2
              className="text-3xl font-light text-white mb-2"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              The pathway a bed and a washer sit in
            </h2>
            <p className="text-sm text-white/60">
              This is why we treat a bed and a washing machine as health hardware, not furniture.
              Off-the-ground, washable sleep supports the conditions needed to interrupt the
              scabies to rheumatic heart disease pathway. We do not claim a bed prevents heart
              disease: that needs a partner clinical method.
            </p>
          </div>

          <div className="space-y-0">
            {cascade.steps.map((step, i) => {
              const isLast = i === cascade.steps.length - 1;

              return (
                <div key={step.label} className="relative">
                  {/* Connector line */}
                  {!isLast && (
                    <div
                      className="absolute left-5 top-12 w-0.5 h-8"
                      style={{ backgroundColor: '#C45C3E', opacity: 0.4 }}
                    />
                  )}

                  <div className="flex items-start gap-4 py-3">
                    {/* Step indicator */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: 'rgba(196, 92, 62, 0.3)' }}
                    >
                      <span className="text-sm font-medium text-white/70">{i + 1}</span>
                    </div>

                    <div className="flex-1">
                      <p className="font-medium text-white/80">{step.label}</p>
                      <p className="text-sm text-white/50">{step.description}</p>
                      {step.liveMetric && (
                        <p className="text-sm mt-1" style={{ color: '#8B9D77' }}>
                          {step.liveMetric.value.toLocaleString()} {step.liveMetric.unit}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary stats — counted activity, not a claimed health outcome */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 mt-10 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-xl md:text-2xl font-light text-white">{cascade.bedsDelivered}</p>
              <p className="text-[10px] md:text-xs text-white/50">Beds delivered</p>
            </div>
            <div className="text-center">
              <p className="text-xl md:text-2xl font-light" style={{ color: '#8B9D77' }}>
                {cascade.totalWashCycles.toLocaleString()}
              </p>
              <p className="text-[10px] md:text-xs text-white/50">Wash cycles completed</p>
            </div>
            <div className="text-center">
              <p className="text-xl md:text-2xl font-light text-white">{cascade.machinesOnline}</p>
              <p className="text-[10px] md:text-xs text-white/50">Machines online now</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// P4 (2026-06-18): the public "Optimization Opportunities" section was removed.
// "Loss function / optimization / improvement dollar" is internal engineer framing,
// not a community-outcome surface, and it competes with the five domains. The data
// (snapshot.optimizationOpportunities) is still computed and exposed via /api/impact
// for internal and agent use; it just no longer renders on the public page.

function ProductionCostSection() {
  return (
    <section className="py-16 md:py-20" style={{ backgroundColor: '#FDF8F3' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              The economics through-line
            </p>
            <h2
              className="text-3xl font-light mb-2"
              style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}
            >
              How the cost comes down
            </h2>
            <p className="text-sm" style={{ color: '#5E5E5E' }}>
              The freight tax puts a basic good out of reach, so the bed is built to beat the true
              remote cost, not the sticker price. As the making moves On Country and in-sources, the
              direct cost per bed comes down and the value stays local. Every bed also creates roughly{' '}
              {MODELLED_LABOUR_HOURS_PER_BED.toFixed(1)} modelled hours of employment; at 1,500 beds a
              year that is about {(1500 * MODELLED_LABOUR_HOURS_PER_BED).toLocaleString()} hours of work.
            </p>
          </div>

          {/* Canonical build-path cost table (direct cost + margin at the $750 price) */}
          <p className="text-xs mb-3 text-center" style={{ color: '#8B9D77' }}>
            Direct cost per bed by build path, and the margin at our ${CANONICAL_WEBSITE_PRICE} price.
            Modelled from verified supplier invoices. These are direct production costs, not
            fully-loaded costs at today&apos;s pilot volume.
          </p>
          <div className="rounded-lg overflow-x-auto border" style={{ borderColor: '#E8DED4' }}>
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr style={{ backgroundColor: '#E8DED4' }}>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: '#2E2E2E' }}>
                    Build path
                  </th>
                  <th className="text-right px-4 py-3 font-medium" style={{ color: '#2E2E2E' }}>
                    Direct cost
                  </th>
                  <th className="text-right px-4 py-3 font-medium" style={{ color: '#2E2E2E' }}>
                    Price
                  </th>
                  <th className="text-right px-4 py-3 font-medium" style={{ color: '#2E2E2E' }}>
                    Margin
                  </th>
                  <th className="text-right px-4 py-3 font-medium" style={{ color: '#2E2E2E' }}>
                    Margin %
                  </th>
                </tr>
              </thead>
              <tbody>
                {CANONICAL_BUILD_PATHS.map((row, i) => (
                  <tr
                    key={row.path}
                    style={{
                      backgroundColor: i % 2 === 0 ? 'white' : '#FDF8F3',
                    }}
                  >
                    <td className="px-4 py-2.5" style={{ color: '#2E2E2E' }}>
                      {row.path}
                    </td>
                    <td className="text-right px-4 py-2.5 font-medium" style={{ color: '#C45C3E' }}>
                      ${row.direct.toFixed(2)}
                    </td>
                    <td className="text-right px-4 py-2.5" style={{ color: '#5E5E5E' }}>
                      ${CANONICAL_WEBSITE_PRICE}
                    </td>
                    <td className="text-right px-4 py-2.5" style={{ color: '#5E5E5E' }}>
                      ${row.margin.toFixed(2)}
                    </td>
                    <td className="text-right px-4 py-2.5 font-medium" style={{ color: '#8B9D77' }}>
                      {row.margin_pct}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Revenue segments */}
          <div className="mt-10">
            <h3
              className="text-xl font-light mb-6 text-center"
              style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}
            >
              Revenue Channels
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {REVENUE_SEGMENTS.map((seg) => (
                <div
                  key={seg.id}
                  className="p-4 rounded-lg border"
                  style={{ borderColor: '#E8DED4', backgroundColor: 'white' }}
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-medium text-sm" style={{ color: '#2E2E2E' }}>
                      {seg.name}
                    </span>
                    <span className="text-sm font-medium" style={{ color: '#C45C3E' }}>
                      {seg.projectedShare}%
                    </span>
                  </div>
                  <p className="text-xs mb-2" style={{ color: '#5E5E5E' }}>
                    {seg.description}
                  </p>
                  <p className="text-xs" style={{ color: '#8B9D77' }}>
                    Evidence: {seg.currentEvidence}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowWeTrackSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              Measurement &amp; accountability
            </p>
            <h2
              className="text-3xl font-light mb-2"
              style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}
            >
              How We Measure
            </h2>
            <p className="text-sm" style={{ color: '#5E5E5E' }}>
              How we hold product data, community feedback, consent and practical change together.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {[
              {
                title: 'QR Code Tracking',
                description: 'Every item has a unique QR code that links to its full history.',
                icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z',
              },
              {
                title: 'Fleet Telemetry',
                description: 'IoT-connected washing machines report wash cycles, energy use, and status where connectivity allows.',
                icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z',
              },
              {
                title: 'Empathy Ledger',
                description: 'Community voices tracked with cultural safety protocols and dynamic consent.',
                icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z',
              },
              {
                title: 'Impact API',
                description: 'Structured JSON endpoint for automated reporting and agent-based analysis.',
                icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: '#C45C3E' }}
                >
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <h3 className="font-medium mb-1 text-sm" style={{ color: '#2E2E2E' }}>
                  {item.title}
                </h3>
                <p className="text-xs" style={{ color: '#5E5E5E' }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnersSection() {
  const partners = [
    {
      name: 'Oonchiumpa / Bloomfield Family',
      location: 'Alice Springs, NT',
      role: 'Cultural Lead & Design in Community',
      model: '100% Aboriginal-owned consultancy. Two years designing products in community, "around the fire." Paid at university-equivalent cultural consultation rates (~$3,800/day). Planning to host production facility in Alice Springs.',
      status: 'Active: delivering beds on country together',
      color: '#C45C3E',
    },
    {
      name: 'Palm Island Community Company',
      location: 'Palm Island, QLD',
      role: 'Production & Youth Employment',
      model: 'New production site at Palm Island. PICC has existing funding to support at-risk youth through training programs. The WISE model in action: young people run production, learn manufacturing skills, earn wages.',
      status: 'Active: new production site, youth pathways',
      color: '#8B9D77',
    },
    {
      name: 'Centrecorp',
      location: 'Distribution Partner',
      role: 'Grant-Funded Distribution Partner',
      model: 'Donor and institutional buyer at scale: 107 beds grant-funded for distribution to Utopia Homelands communities. Demonstrates delivery at scale and provides evidence of institutional demand for funding applications.',
      status: '107 beds delivered: institutional partnership evidence',
      color: '#D4A574',
    },
    {
      name: 'Dianne Stokes & Norman Frank',
      location: 'Tennant Creek, NT',
      role: 'Elder Advisory & Design in Community',
      model: 'Elder Dianne named the washing machine "Pakkimjalki Kari" in Warumungu language. Norman Frank founded Wilya Janta for housing advocacy. Both shape product design through direct community feedback.',
      status: 'Ongoing: Elder-led product refinement',
      color: '#7C6F64',
    },
    {
      name: 'Defy Design',
      location: 'Sydney / On-country',
      role: 'Recycling & Manufacturing',
      model: 'Taught ACT plastic recycling and helped build the containerised production plant. Training Palm Island team (Ebony & Jahvan Oui) in production skills for community manufacturing transfer.',
      status: 'Active: skills transfer ongoing',
      color: '#5E7D9A',
    },
  ];

  return (
    <section className="py-16 md:py-20" style={{ backgroundColor: '#2E2E2E' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-white/50 mb-4">
              Community Enterprise Model
            </p>
            <h2
              className="text-3xl font-light text-white mb-2"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              How It Works
            </h2>
            <p className="text-sm text-white/60 max-w-lg mx-auto">
              Not licensing. Transferring. Communities receive full training, manufacturing capability,
              and documentation. They keep 100% of what they make and sell.
            </p>
          </div>

          {/* Featured partner logos */}
          <div className="mb-12 flex flex-col items-center gap-8 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-16">
            <div className="flex flex-col items-center gap-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                Backed by
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
                <a
                  href="https://www.snowfoundation.org.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Snow Foundation"
                  className="transition hover:opacity-80"
                >
                  <Image
                    src="/images/partners/snow-foundation-white.png"
                    alt="Snow Foundation"
                    width={2194}
                    height={1056}
                    className="h-10 w-auto object-contain sm:h-12"
                  />
                </a>
                <Link
                  href="/partners/centrecorp"
                  aria-label="Centrecorp Foundation"
                  className="rounded-lg bg-white px-4 py-2 transition hover:opacity-90"
                >
                  <Image
                    src="/images/partners/centrecorp-foundation.jpg"
                    alt="Centrecorp Foundation"
                    width={400}
                    height={240}
                    className="h-8 w-auto object-contain sm:h-9"
                  />
                </Link>
                <a
                  href="https://www.thefundingnetwork.com.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="The Funding Network"
                  className="rounded-lg bg-white px-4 py-2 transition hover:opacity-90"
                >
                  <Image
                    src="/images/partners/tfn.svg"
                    alt="The Funding Network"
                    width={1256}
                    height={445}
                    className="h-9 w-auto object-contain sm:h-10"
                  />
                </a>
                <a
                  href="https://frrr.org.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="FRRR"
                  className="rounded-lg bg-white px-4 py-2 transition hover:opacity-90"
                >
                  <Image
                    src="/images/partners/frrr.png"
                    alt="FRRR"
                    width={1024}
                    height={491}
                    className="h-9 w-auto object-contain sm:h-10"
                  />
                </a>
                <a
                  href="https://ampfoundation.com.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="AMP Foundation"
                  className="rounded-lg bg-white px-4 py-2 transition hover:opacity-90"
                >
                  <Image
                    src="/images/partners/amp-foundation.png"
                    alt="AMP Foundation"
                    width={1024}
                    height={272}
                    className="h-8 w-auto object-contain sm:h-9"
                  />
                </a>
                <a
                  href="https://www.qbe.com/sustainability/qbe-foundation"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="QBE Foundation"
                  className="rounded-lg bg-white px-4 py-2 transition hover:opacity-90"
                >
                  <Image
                    src="/images/partners/qbe.png"
                    alt="QBE Foundation"
                    width={800}
                    height={220}
                    className="h-9 w-auto object-contain sm:h-10"
                  />
                </a>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                Community partner
              </p>
              <a
                href="https://oonchiumpa.com.au"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Oonchiumpa Consultancy"
                className="rounded-lg bg-white px-4 py-2 transition hover:opacity-90"
              >
                <Image
                  src="/images/partners/oonchiumpa.png"
                  alt="Oonchiumpa Consultancy"
                  width={560}
                  height={350}
                  className="h-9 w-auto object-contain sm:h-10"
                />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="rounded-lg p-5 border border-white/10"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-2 h-full min-h-[60px] rounded-full shrink-0"
                    style={{ backgroundColor: partner.color }}
                  />
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                      <h3 className="font-medium text-white">{partner.name}</h3>
                      <span className="text-xs text-white/40">{partner.location}</span>
                    </div>
                    <p className="text-xs font-medium mb-2" style={{ color: partner.color }}>
                      {partner.role}
                    </p>
                    <p className="text-sm text-white/70 mb-2">{partner.model}</p>
                    <p className="text-xs" style={{ color: '#8B9D77' }}>
                      {partner.status}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p
              className="text-lg italic text-white/80"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              &ldquo;When someone asks &lsquo;Who makes these?&rsquo; the answer is
              &lsquo;We do.&rsquo;&rdquo;
            </p>
            <p className="text-xs text-white/40 mt-2">2030 Vision</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// The single human spine (framework §6): "Mykel's arc is the model in one person:
// waste, to product, to skill, to work, to ownership." Carries the jobs/ownership
// and circular domains in one face, with his consent (Ben, 2026-06-18). As a young
// person his material is handled with Oonchiumpa and guardian in the loop.
function MykelFeatureSection() {
  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: '#2E2E2E' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-widest text-white/50 mb-4">
              The model in one person
            </p>
            <h2
              className="text-3xl md:text-4xl font-light text-white mb-3"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Mykel
            </h2>
            <p className="text-sm text-white/60 max-w-2xl mx-auto">
              Waste to product to skill to work to ownership, in one person. Mykel built the bed he
              slept on that night and kept going: seven beds by the end of the second day, out the
              back of the Oonchiumpa office in Alice Springs.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="aspect-video rounded-lg overflow-hidden bg-black/30">
              <video
                src="/video/partners/oonchiumpa/mykel-building-the-bed.mp4"
                poster="/video/partners/oonchiumpa/mykel-building-the-bed-poster.jpg"
                controls
                preload="none"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <blockquote className="border-l-2 pl-4 mb-6" style={{ borderColor: '#C45C3E' }}>
                <p
                  className="text-2xl font-light text-white mb-2"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  &ldquo;I&rsquo;ll be rocking up every day to make them.&rdquo;
                </p>
                <p className="text-sm text-white/50">
                  Mykel, asked whether he would make beds every day if the making moved closer to home
                </p>
              </blockquote>

              <p className="text-sm text-white/70 mb-4">
                He turned the finished bed over in his hands, then explained it was made from bottle
                lids shredded and pressed into something strong enough to stand on. Fred, his
                Oonchiumpa support worker, watched him work, called him grandson, and said: &ldquo;That
                could be a good employment for yourself too, grandson. Later on.&rdquo;
              </p>

              <p className="text-sm italic text-white/60">
                &ldquo;Comfortable as. Smooth, tight, hard, fancy.&rdquo;{' '}
                <span className="not-italic text-white/40">Mykel, on the bed</span>
              </p>

              <p className="text-xs text-white/30 mt-6">
                Shared with consent. Mykel is a young person; his material is handled with Oonchiumpa
                and his guardian in the loop.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main async component
// ---------------------------------------------------------------------------

async function ImpactDashboard() {
  const snapshot = await fetchImpactData();

  return (
    <>
      <LossFunctionSection snapshot={snapshot} />
      <ThreeShiftsSection />
      <FiveDomainsSection dimensions={snapshot.dimensions} />
      <MykelFeatureSection />
      <ThroughLinesSection />
      <ProductionCostSection />
      <HealthCascadeSection cascade={snapshot.healthCascade} />
      <PartnersSection />
      <HowWeTrackSection />
    </>
  );
}

function ImpactSkeleton() {
  return (
    <section className="py-12" style={{ backgroundColor: '#C45C3E' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="text-center">
              <div className="h-10 bg-white/20 rounded animate-pulse mx-auto w-20 mb-2" />
              <div className="h-4 bg-white/20 rounded animate-pulse mx-auto w-16" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ImpactPage() {
  return (
    <main style={{ backgroundColor: '#FDF8F3' }}>
      {/* Header */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              Impact Data
            </p>
            <h1
              className="text-4xl md:text-5xl font-light mb-4"
              style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}
            >
              Impact Model
            </h1>
            <p className="text-lg max-w-2xl mx-auto mb-2" style={{ color: '#5E5E5E' }}>
              Three shifts in one breath, five outcome domains underneath. Every claim pairs a
              community voice with a counted number and an honest label.
            </p>
            <p className="text-sm max-w-xl mx-auto" style={{ color: '#8B9D77' }}>
              Numbers drawn from our asset register and fleet data. Every target is accountable.
            </p>
          </div>
        </div>
      </section>

      {/* Theory of Change */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              How it works
            </p>
            <h2
              className="text-3xl md:text-4xl font-light mb-4"
              style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}
            >
              Theory of Change
            </h2>
            <p className="text-base max-w-2xl mx-auto" style={{ color: '#5E5E5E' }}>
              From community-led design to community-owned production: how our activities create
              practical change on Country.
            </p>
          </div>
          <TheoryOfChange className="max-w-6xl mx-auto" caption />
        </div>
      </section>

      {/* Dashboard */}
      <Suspense fallback={<ImpactSkeleton />}>
        <ImpactDashboard />
      </Suspense>

      {/* CTA */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#C45C3E' }}>
        <div className="container mx-auto px-4 text-center">
          <h2
            className="text-3xl md:text-4xl font-light text-white mb-6"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            Back the work
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Every bed is built On Country and counted here. Back the making, and follow where it goes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white hover:bg-white/90" style={{ color: '#C45C3E' }} asChild>
              <Link href="/shop">Shop Beds</Link>
            </Button>
            <Button
              size="lg"
              className="border border-white bg-transparent hover:bg-white/10"
              style={{ color: 'white' }}
              asChild
            >
              <Link href="/sponsor">Sponsor a Bed</Link>
            </Button>
            <Button
              size="lg"
              className="border border-white bg-transparent hover:bg-white/10"
              style={{ color: 'white' }}
              asChild
            >
              <Link href="/api/impact">Impact API</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
