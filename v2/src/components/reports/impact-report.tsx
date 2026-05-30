import Image from 'next/image';
import type { ImpactReportTemplate } from '@/lib/data/report-templates';
import type { EmpathyLedgerStory } from '@/lib/empathy-ledger/types';

/** A metric resolved against the live impact snapshot (or its target fallback). */
export interface ResolvedReportMetric {
  id: string;
  name: string;
  unit: string;
  value: number | null;
  /** true if `value` is a live/current figure, false if it's a target fallback. */
  isLive: boolean;
  sourceDetail: string;
}

export interface ReportDimensionSummary {
  id: string;
  name: string;
  description: string;
  communityQuote?: { text: string; author: string; context: string };
}

interface Props {
  template: ImpactReportTemplate;
  metrics: ResolvedReportMetric[];
  dimensions: ReportDimensionSummary[];
  stories: EmpathyLedgerStory[];
  generatedAt: string;
}

function formatValue(m: ResolvedReportMetric): string {
  if (m.value == null) return '—';
  const v = m.unit === '$' || m.unit === '$/bed' ? `$${Math.round(m.value).toLocaleString()}` : m.value.toLocaleString();
  if (m.unit === '%') return `${m.value}%`;
  if (m.unit === '$' || m.unit === '$/bed') return v;
  return `${v}${m.unit ? ` ${m.unit}` : ''}`;
}

/**
 * Presentational impact report — audience-framed, showcasing live impact metrics
 * + consented Empathy Ledger stories. No data fetching here; the page resolves
 * everything and passes it in, so this component is safe to mount publicly later.
 */
export function ImpactReport({ template, metrics, dimensions, stories, generatedAt }: Props) {
  return (
    <article className="mx-auto max-w-3xl space-y-10">
      {/* Hero */}
      <header className="space-y-3 border-b border-gray-200 pb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Goods on Country · Impact report
        </p>
        <h1 className="font-serif text-3xl font-bold leading-tight text-gray-900">{template.headline}</h1>
        <p className="text-lg text-gray-600">{template.subhead}</p>
        <p className="text-sm leading-relaxed text-gray-700">{template.intro}</p>
      </header>

      {/* Headline metrics */}
      {metrics.length > 0 && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">By the numbers</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.id} className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="font-serif text-2xl font-bold text-gray-900">{formatValue(m)}</div>
                <div className="mt-1 text-xs font-medium text-gray-700">{m.name}</div>
                <div className="mt-1 text-[10px] uppercase tracking-wide text-gray-400">
                  {m.isLive ? 'Live' : 'Year-1 target'}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Proof points */}
      {template.proofPoints.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Why it matters</h2>
          <ul className="space-y-2">
            {template.proofPoints.map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Impact dimensions + community quotes */}
      {dimensions.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">The impact</h2>
          {dimensions.map((d) => (
            <div key={d.id} className="rounded-lg border border-gray-200 bg-white p-5">
              <h3 className="font-serif text-lg font-bold text-gray-900">{d.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{d.description}</p>
              {d.communityQuote && (
                <blockquote className="mt-3 border-l-2 border-emerald-300 pl-3 text-sm italic text-gray-700">
                  “{d.communityQuote.text}”
                  <footer className="mt-1 text-xs not-italic text-gray-500">
                    — {d.communityQuote.author}
                    {d.communityQuote.context ? `, ${d.communityQuote.context}` : ''}
                  </footer>
                </blockquote>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Empathy Ledger stories */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">Voices from community</h2>
        {stories.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-500">
            No published Empathy Ledger stories matched this theme yet. When storytellers publish
            (consent-verified) they appear here automatically.
          </p>
        ) : (
          <div className="space-y-4">
            {stories.map((s) => {
              const img = s.featuredImageUrl || s.storyImageUrl;
              const author = s.storytellerName || s.authorName;
              const blurb = s.excerpt || s.summary;
              return (
                <div key={s.id} className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
                  {img && (
                    <div className="relative hidden h-24 w-24 shrink-0 overflow-hidden rounded-md sm:block">
                      <Image src={img} alt={s.title} fill className="object-cover" sizes="96px" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900">{s.title}</h3>
                    {author && <p className="text-xs text-gray-500">{author}</p>}
                    {blurb && <p className="mt-1 line-clamp-3 text-sm text-gray-600">{blurb}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="font-serif text-xl font-bold text-emerald-900">{template.callToAction.label}</h2>
        <p className="mt-2 text-sm text-emerald-800">{template.callToAction.body}</p>
      </section>

      <footer className="border-t border-gray-200 pt-4 text-xs text-gray-400">
        Generated {generatedAt}. Metrics resolve live against the impact model (Year-1 targets shown where
        a live value isn’t yet measured); stories are consent-filtered from Empathy Ledger. Template:{' '}
        <code>{template.id}</code>.
      </footer>
    </article>
  );
}
