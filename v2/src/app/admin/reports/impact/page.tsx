import Link from 'next/link';
import { ArrowLeft, FileText, Megaphone } from 'lucide-react';
import { IMPACT_REPORT_TEMPLATES, AUDIENCE_LABELS } from '@/lib/data/report-templates';
import { AUDIENCE_SEGMENTS } from '@/lib/ghl/smart-lists';

export const dynamic = 'force-dynamic';

export default function ImpactReportTemplatesPage() {
  return (
    <div className="space-y-6 pb-16">
      <div>
        <Link
          href="/admin/reports"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" /> Funder reports
        </Link>
      </div>

      <header>
        <h1 className="text-2xl font-bold tracking-tight">Impact report templates</h1>
        <p className="mt-1 max-w-3xl text-sm text-gray-600">
          Reusable, audience-framed impact reports — each showcases current impact metrics + consented
          Empathy Ledger stories. They’re the content behind the{' '}
          <Link href="/admin/reach-out" className="text-violet-700 underline">
            audience segments
          </Link>
          : pick a segment, build its smart list in GHL, attach the recommended report as a campaign.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {IMPACT_REPORT_TEMPLATES.map((t) => {
          const serving = AUDIENCE_SEGMENTS.filter((s) => s.recommendedReportId === t.id);
          return (
            <div key={t.id} className="flex flex-col rounded-lg border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-medium text-sky-800">
                  {AUDIENCE_LABELS[t.audience]}
                </span>
                <FileText className="h-4 w-4 shrink-0 text-gray-300" />
              </div>
              <h2 className="mt-2 font-serif text-lg font-bold text-gray-900">{t.name}</h2>
              <p className="mt-1 text-sm text-gray-600">{t.subhead}</p>

              <div className="mt-3 text-xs text-gray-500">
                <span className="font-medium text-gray-600">Features:</span>{' '}
                {t.featuredMetricIds.join(', ')}
              </div>

              {serving.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                  <Megaphone className="h-3.5 w-3.5" />
                  {serving.map((s) => (
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

              <div className="mt-4 border-t border-gray-100 pt-3">
                <Link
                  href={`/admin/reports/impact/${t.id}`}
                  className="inline-flex items-center gap-1.5 rounded bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
                >
                  Preview report
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
