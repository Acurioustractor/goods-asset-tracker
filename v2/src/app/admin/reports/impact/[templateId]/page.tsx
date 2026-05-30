import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Megaphone } from 'lucide-react';
import { findReportTemplate } from '@/lib/data/report-templates';
import { fetchImpactData } from '@/lib/data/impact-fetcher';
import { IMPACT_DIMENSIONS, type ImpactDimension } from '@/lib/data/impact-model';
import { empathyLedger } from '@/lib/empathy-ledger/client';
import {
  ImpactReport,
  type ResolvedReportMetric,
  type ReportDimensionSummary,
} from '@/components/reports/impact-report';
import { AUDIENCE_SEGMENTS } from '@/lib/ghl/smart-lists';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ImpactReportPage({
  params,
}: {
  params: Promise<{ templateId: string }>;
}) {
  const { templateId } = await params;
  const template = findReportTemplate(templateId);
  if (!template) notFound();

  // Live impact snapshot (falls back to the static model if the live pull fails).
  let dimensions: ImpactDimension[] = IMPACT_DIMENSIONS;
  try {
    const snapshot = await fetchImpactData();
    if (snapshot?.dimensions?.length) dimensions = snapshot.dimensions;
  } catch {
    // keep the static model
  }

  // Resolve featured metrics: live `current` if present, else the Year-1 target.
  const metricById = new Map<string, ImpactDimension['metrics'][number]>();
  for (const d of dimensions) for (const m of d.metrics) metricById.set(m.id, m);
  const metrics: ResolvedReportMetric[] = template.featuredMetricIds
    .map((id) => metricById.get(id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m))
    .map((m) => ({
      id: m.id,
      name: m.name,
      unit: m.unit,
      value: m.current ?? m.targets.year1 ?? null,
      isLive: m.current != null,
      sourceDetail: m.sourceDetail,
    }));

  const dimSummaries: ReportDimensionSummary[] = template.featuredDimensionIds
    .map((id) => dimensions.find((d) => d.id === id))
    .filter((d): d is ImpactDimension => Boolean(d))
    .map((d) => ({
      id: d.id,
      name: d.name,
      description: d.description,
      communityQuote: d.communityQuote,
    }));

  const stories = await empathyLedger.getStories({
    theme: template.storyTheme,
    limit: template.storyLimit,
  });

  const servingSegments = AUDIENCE_SEGMENTS.filter((s) => s.recommendedReportId === template.id);
  const generatedAt = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6 pb-16">
      {/* Admin chrome (not part of the shareable report) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/reports/impact"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" /> All report templates
        </Link>
        {servingSegments.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <Megaphone className="h-3.5 w-3.5" /> Serves:
            {servingSegments.map((s) => (
              <Link
                key={s.id}
                href={`/admin/reach-out?segment=${s.id}`}
                className="rounded-full bg-violet-100 px-2 py-0.5 font-medium text-violet-700 hover:bg-violet-200"
              >
                {s.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
        Template preview. To use it: build the matching audience segment’s smart list in GHL and attach
        this as an email campaign. Metrics are live; stories are consent-filtered from Empathy Ledger.
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 sm:p-10">
        <ImpactReport
          template={template}
          metrics={metrics}
          dimensions={dimSummaries}
          stories={stories}
          generatedAt={generatedAt}
        />
      </div>
    </div>
  );
}
