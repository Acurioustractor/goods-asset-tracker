import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fetchImpactData } from '@/lib/data/impact-fetcher';
import {
  TOTAL_LABOUR_HOURS_PER_BED,
  TOTAL_COST_PER_BED,
  REVENUE_SEGMENTS,
  PRODUCTION_COST_BREAKDOWN,
} from '@/lib/data/impact-model';
import type { ImpactSnapshot, ImpactDimension, ImpactMetric } from '@/lib/data/impact-model';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impact Model — Goods on Country',
  description: 'Five-dimension impact framework measuring health, environmental, economic, community ownership, and production efficiency outcomes.',
};

// ---------------------------------------------------------------------------
// Helper components
// ---------------------------------------------------------------------------

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
          <p className="text-sm uppercase tracking-widest text-white/60 mb-2">The Loss Function</p>
          <h2 className="text-2xl font-light text-white" style={{ fontFamily: 'Georgia, serif' }}>
            Impact Per Dollar
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { value: summary.totalAssets, label: 'Assets Deployed', sub: 'beds + washers' },
            { value: `${(summary.livesImpacted).toLocaleString()}+`, label: 'Lives Impacted', sub: 'avg 2.5 per bed' },
            { value: `${(summary.plasticDivertedKg / 1000).toFixed(1)}t`, label: 'Plastic Diverted', sub: `${summary.plasticDivertedKg.toLocaleString()}kg` },
            { value: summary.communitiesServed, label: 'Communities', sub: 'across Australia' },
            { value: summary.employmentHoursCreated.toLocaleString(), label: 'Employment Hours', sub: `${TOTAL_LABOUR_HOURS_PER_BED.toFixed(1)}hrs/bed` },
            { value: `$${(summary.totalInvestment / 1000).toFixed(0)}K`, label: 'Total Investment', sub: `$${(summary.totalInvestment / summary.totalAssets).toFixed(0)}/asset` },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl md:text-4xl font-light text-white mb-1">{stat.value}</p>
              <p className="text-sm text-white/90 font-medium">{stat.label}</p>
              <p className="text-xs text-white/50 mt-0.5">{stat.sub}</p>
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
              — {dimension.communityQuote.author}, {dimension.communityQuote.context}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FiveDimensionsSection({ dimensions }: { dimensions: ImpactDimension[] }) {
  return (
    <section className="py-16 md:py-20" style={{ backgroundColor: '#FDF8F3' }}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
            Five Dimensions
          </p>
          <h2
            className="text-3xl font-light mb-2"
            style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}
          >
            How We Measure Impact
          </h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: '#5E5E5E' }}>
            Each dimension tracks live metrics from our asset register, fleet telemetry, and community
            engagement — with clear targets for Year 1, Year 3, and 2030.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {dimensions.map((dim) => (
            <DimensionCard key={dim.id} dimension={dim} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HealthCascadeSection({ cascade }: { cascade: ImpactSnapshot['healthCascade'] }) {
  return (
    <section className="py-16 md:py-20" style={{ backgroundColor: '#2E2E2E' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-white/50 mb-4">
              The Health Cascade
            </p>
            <h2
              className="text-3xl font-light text-white mb-2"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              RHD Is Entirely Preventable
            </h2>
            <p className="text-sm text-white/60">
              Rheumatic Heart Disease kills children in remote Australia. This is the chain
              we&apos;re breaking — and where our products intervene.
            </p>
          </div>

          <div className="space-y-0">
            {cascade.steps.map((step, i) => {
              const isInterrupted = step.interrupted;
              const isLast = i === cascade.steps.length - 1;

              return (
                <div key={step.label} className="relative">
                  {/* Connector line */}
                  {!isLast && (
                    <div
                      className="absolute left-5 top-12 w-0.5 h-8"
                      style={{
                        backgroundColor: isInterrupted ? '#8B9D77' : '#C45C3E',
                        opacity: isInterrupted ? 1 : 0.4,
                      }}
                    />
                  )}

                  <div className="flex items-start gap-4 py-3">
                    {/* Status indicator */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        backgroundColor: isInterrupted ? '#8B9D77' : 'rgba(196, 92, 62, 0.3)',
                      }}
                    >
                      {isInterrupted ? (
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1">
                      <p className={`font-medium ${isInterrupted ? 'text-white' : 'text-white/70'}`}>
                        {step.label}
                        {isInterrupted && (
                          <span
                            className="ml-2 text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: '#8B9D77', color: 'white' }}
                          >
                            INTERRUPTED
                          </span>
                        )}
                      </p>
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

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4 mt-10 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-2xl font-light text-white">{cascade.bedsDelivered}</p>
              <p className="text-xs text-white/50">Beds interrupting floor sleeping</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-light" style={{ color: '#8B9D77' }}>
                {cascade.totalWashCycles.toLocaleString()}
              </p>
              <p className="text-xs text-white/50">Wash cycles breaking scabies chain</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-light text-white">{cascade.machinesOnline}</p>
              <p className="text-xs text-white/50">Machines online now</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function OptimizationSection({
  opportunities,
}: {
  opportunities: ImpactSnapshot['optimizationOpportunities'];
}) {
  const potentialColors = { high: '#C45C3E', medium: '#D4A574', low: '#8B9D77' };

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              Data-Driven Insights
            </p>
            <h2
              className="text-3xl font-light mb-2"
              style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}
            >
              Optimization Opportunities
            </h2>
            <p className="text-sm" style={{ color: '#5E5E5E' }}>
              Patterns identified from live data — where each improvement dollar has the most impact.
            </p>
          </div>

          <div className="space-y-4">
            {opportunities.slice(0, 6).map((opp) => (
              <div
                key={opp.id}
                className="p-4 rounded-lg border"
                style={{ borderColor: '#E8DED4', backgroundColor: '#FDF8F3' }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-2 h-2 rounded-full mt-2 shrink-0"
                    style={{ backgroundColor: potentialColors[opp.potential] }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm" style={{ color: '#2E2E2E' }}>
                      {opp.title}
                    </p>
                    <p className="text-sm mt-1" style={{ color: '#5E5E5E' }}>
                      {opp.description}
                    </p>
                    <p className="text-xs mt-2" style={{ color: '#8B9D77' }}>
                      Source: {opp.dataSource}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: `${potentialColors[opp.potential]}20`,
                      color: potentialColors[opp.potential],
                    }}
                  >
                    {opp.potential}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductionCostSection() {
  return (
    <section className="py-16 md:py-20" style={{ backgroundColor: '#FDF8F3' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              Work-Integrated Social Enterprise
            </p>
            <h2
              className="text-3xl font-light mb-2"
              style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}
            >
              Cost Per Bed &amp; Employment Impact
            </h2>
            <p className="text-sm" style={{ color: '#5E5E5E' }}>
              Every bed creates {TOTAL_LABOUR_HOURS_PER_BED.toFixed(1)} hours of employment for
              at-risk youth and community members. At 1,500 beds/year, that&apos;s{' '}
              {(1500 * TOTAL_LABOUR_HOURS_PER_BED).toLocaleString()} hours of employment.
            </p>
          </div>

          {/* Production breakdown table */}
          <div className="rounded-lg overflow-hidden border" style={{ borderColor: '#E8DED4' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#E8DED4' }}>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: '#2E2E2E' }}>
                    Stage
                  </th>
                  <th className="text-right px-4 py-3 font-medium" style={{ color: '#2E2E2E' }}>
                    Hours
                  </th>
                  <th className="text-right px-4 py-3 font-medium" style={{ color: '#2E2E2E' }}>
                    People
                  </th>
                  <th className="text-right px-4 py-3 font-medium" style={{ color: '#2E2E2E' }}>
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRODUCTION_COST_BREAKDOWN.map((item, i) => (
                  <tr
                    key={item.stage}
                    style={{
                      backgroundColor: i % 2 === 0 ? 'white' : '#FDF8F3',
                    }}
                  >
                    <td className="px-4 py-2.5" style={{ color: '#2E2E2E' }}>
                      {item.stage}
                    </td>
                    <td className="text-right px-4 py-2.5" style={{ color: '#5E5E5E' }}>
                      {item.hoursPerUnit > 0 ? `${item.hoursPerUnit}h` : '—'}
                    </td>
                    <td className="text-right px-4 py-2.5" style={{ color: '#5E5E5E' }}>
                      {item.personnelRequired > 0 ? item.personnelRequired : '—'}
                    </td>
                    <td className="text-right px-4 py-2.5 font-medium" style={{ color: '#C45C3E' }}>
                      ${item.costPerUnit}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: '#E8DED4' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: '#2E2E2E' }}>
                    Total per bed
                  </td>
                  <td className="text-right px-4 py-3 font-medium" style={{ color: '#2E2E2E' }}>
                    {TOTAL_LABOUR_HOURS_PER_BED.toFixed(1)}h
                  </td>
                  <td className="text-right px-4 py-3" />
                  <td className="text-right px-4 py-3 font-medium" style={{ color: '#C45C3E' }}>
                    ${TOTAL_COST_PER_BED}
                  </td>
                </tr>
              </tfoot>
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
              ALMA Framework
            </p>
            <h2
              className="text-3xl font-light mb-2"
              style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}
            >
              How We Measure
            </h2>
            <p className="text-sm" style={{ color: '#5E5E5E' }}>
              Every item tracked from creation to delivery and beyond — real-time data from the field.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              {
                title: 'QR Code Tracking',
                description: 'Every item has a unique QR code that links to its full history.',
                icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z',
              },
              {
                title: 'Fleet Telemetry',
                description: 'IoT-connected washing machines report wash cycles, energy use, and status in real-time.',
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
      role: 'Cultural Lead & Co-Design',
      model: '100% Aboriginal-owned consultancy. Two years co-designing products "around the fire." Paid at university-equivalent cultural consultation rates (~$3,800/day). Planning to host production facility in Alice Springs.',
      status: 'Active — delivering beds on country together',
      color: '#C45C3E',
    },
    {
      name: 'Palm Island Community Company',
      location: 'Palm Island, QLD',
      role: 'Production & Youth Employment',
      model: 'New production site at Palm Island. PICC has existing funding to support at-risk youth through training programs. The WISE model in action — young people run production, learn manufacturing skills, earn wages.',
      status: 'Active — new production site, youth pathways',
      color: '#8B9D77',
    },
    {
      name: 'Centrecorp',
      location: 'Distribution Partner',
      role: 'B2B Sales & Distribution',
      model: 'First substantial commercial transaction — 109 beds purchased for distribution to communities. Demonstrates trade at scale and provides evidence of commercial viability for funding applications.',
      status: '109 beds sold — first B2B evidence',
      color: '#D4A574',
    },
    {
      name: 'Dianne Stokes & Norman Frank',
      location: 'Tennant Creek, NT',
      role: 'Elder Advisory & Co-Design',
      model: 'Elder Dianne named the washing machine "Pakkimjalki Kari" in Warumungu language. Norman Frank founded Wilya Janta for housing advocacy. Both shape product design through direct community feedback.',
      status: 'Ongoing — Elder-led product refinement',
      color: '#7C6F64',
    },
    {
      name: 'Defy Design',
      location: 'Sydney / On-country',
      role: 'Recycling & Manufacturing',
      model: 'Taught ACT plastic recycling and helped build the containerised production plant. Training Palm Island team (Ebony & Jahvan Oui) in production skills for community manufacturing transfer.',
      status: 'Active — skills transfer ongoing',
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
              Not licensing — transferring. Communities receive full training, manufacturing capability,
              and documentation. They keep 100% of what they make and sell.
            </p>
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

// ---------------------------------------------------------------------------
// Main async component
// ---------------------------------------------------------------------------

async function ImpactDashboard() {
  const snapshot = await fetchImpactData();

  return (
    <>
      <LossFunctionSection snapshot={snapshot} />
      <FiveDimensionsSection dimensions={snapshot.dimensions} />
      <HealthCascadeSection cascade={snapshot.healthCascade} />
      <ProductionCostSection />
      <PartnersSection />
      <OptimizationSection opportunities={snapshot.optimizationOpportunities} />
      <HowWeTrackSection />
    </>
  );
}

function ImpactSkeleton() {
  return (
    <section className="py-12" style={{ backgroundColor: '#C45C3E' }}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
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
              Live Data
            </p>
            <h1
              className="text-4xl md:text-5xl font-light mb-4"
              style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}
            >
              Impact Model
            </h1>
            <p className="text-lg max-w-2xl mx-auto mb-2" style={{ color: '#5E5E5E' }}>
              Five dimensions of impact, measured in real time from our asset register, fleet
              telemetry, and community voices.
            </p>
            <p className="text-sm max-w-xl mx-auto" style={{ color: '#8B9D77' }}>
              Every number is live. Every target is accountable.
            </p>
          </div>
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
            Be Part of This Impact
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Every bed purchased or sponsored adds to these numbers and changes a family&apos;s life.
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
