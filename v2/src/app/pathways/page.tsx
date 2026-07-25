import Link from 'next/link';
import {
  ArrowRight,
  MapPinned,
} from 'lucide-react';
import {
  COMMUNITY_PATHWAYS,
  PATHWAY_STAGES,
  type EvidenceState,
} from '@/lib/data/community-pathways';

export const metadata = {
  title: 'Community pathways',
  description: 'A community-controlled menu of Goods on Country support.',
  // Ben, 2026-07-25: keep this out of the menus for now. It is already absent from the header
  // and footer, but an unlinked page still gets crawled, so "not surfaced" needs noindex to be
  // true. This page renders per-community pathway state including items marked "Confirm
  // together", which by definition are NOT yet confirmed with that community.
  // Same pattern as /export/leave-behind. Reversible in one line when it is ready to be public.
  robots: { index: false, follow: false },
};

const evidenceStyle: Record<EvidenceState, string> = {
  verified: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  'community-confirmation': 'bg-amber-50 text-amber-900 border-amber-200',
  'not-assessed': 'bg-slate-50 text-slate-700 border-slate-200',
};

const evidenceLabel: Record<EvidenceState, string> = {
  verified: 'Verified',
  'community-confirmation': 'Confirm together',
  'not-assessed': 'Not yet assessed',
};

export default function PathwaysPage() {
  return (
    <div className="min-h-screen bg-[#fbf8f1]">
      <section className="border-b border-[#e6dfd1] bg-[radial-gradient(circle_at_top_left,_#efe2cf_0,_#fbf8f1_46%,_#f4eee4_100%)]">
        <div className="container mx-auto max-w-7xl px-5 py-16 md:py-24">
          <div className="max-w-4xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#a64f35]">
              Community pathway workspace
            </p>
            <h1 className="max-w-3xl font-display text-4xl leading-[1.06] text-[#2b2a26] md:text-6xl">
              Start with what a community wants. Build only what helps.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#665f53]">
              One shared pathway for listening, choosing support, approving ownership,
              finding funding and learning together. Communities can choose one module,
              the complete facility, or nothing yet.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#communities"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#2b2a26] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#433f38]"
              >
                View live pathways <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e6dfd1] bg-white">
        <div className="container mx-auto max-w-7xl overflow-x-auto px-5 py-7">
          <ol className="flex min-w-[920px] items-start gap-2">
            {PATHWAY_STAGES.map((stage, index) => (
              <li key={stage.id} className="flex flex-1 items-start gap-2">
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#f1ece4] text-sm font-semibold text-[#a64f35]">
                    {index + 1}
                  </div>
                  <p className="text-sm font-semibold text-[#2b2a26]">{stage.label}</p>
                  <p className="mt-1 text-xs leading-5 text-[#7a7363]">{stage.note}</p>
                </div>
                {index < PATHWAY_STAGES.length - 1 && (
                  <ArrowRight className="mt-3 h-4 w-4 shrink-0 text-[#c7bcaa]" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="communities" className="container mx-auto max-w-7xl px-5 py-16 md:py-24">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a64f35]">
              Four different starting points
            </p>
            <h2 className="mt-3 font-display text-3xl text-[#2b2a26] md:text-4xl">
              Live community pathways
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[#6f675b]">
            Statuses show what is verified, what needs community confirmation and what
            has not been assessed. They are not readiness scores.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {COMMUNITY_PATHWAYS.map((pathway) => (
            <Link
              key={pathway.id}
              href={`/pathways/${pathway.id}`}
              className="group rounded-3xl border border-[#e3dacb] bg-white p-6 shadow-[0_10px_30px_rgba(67,55,35,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(67,55,35,0.09)] md:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-xs font-medium text-[#7a7363]">
                    <MapPinned className="h-4 w-4 text-[#a64f35]" /> {pathway.region}
                  </p>
                  <h3 className="mt-3 font-display text-3xl text-[#2b2a26]">{pathway.name}</h3>
                  <p className="mt-2 text-sm text-[#6f675b]">{pathway.relationship}</p>
                </div>
                <span className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${evidenceStyle[pathway.evidenceState]}`}>
                  {evidenceLabel[pathway.evidenceState]}
                </span>
              </div>

              <div className="my-6 rounded-2xl bg-[#f8f4ed] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a64f35]">
                  Next decision
                </p>
                <p className="mt-2 text-sm leading-6 text-[#3f3b35]">{pathway.nextDecision}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {pathway.modules.map((item) => (
                  <span
                    key={item.id}
                    className="rounded-full border border-[#ded5c7] bg-white px-3 py-1.5 text-xs text-[#5e574d]"
                  >
                    {item.name}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex items-center justify-between border-t border-[#eee7dc] pt-5 text-sm">
                <span className="font-medium text-[#6b6358]">{pathway.stageLabel}</span>
                <span className="flex items-center gap-2 font-semibold text-[#a64f35]">
                  Open pathway <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
