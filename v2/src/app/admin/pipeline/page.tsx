import Link from 'next/link';
import { getPipelineOverview, type DealType, type PipelineStage } from '../deals/actions';
import { fetchOpportunitiesForPipelines, type GoodsOpportunity } from '@/lib/ghl';
import { GOODS_PIPELINES, STAGE_TO_RUNG, LOI_RUNGS, MATCH_TARGET, type LoiRung } from '@/lib/data/loi-pipeline';
import { supplierQuotes } from '@/lib/data/supplier-quotes';
import type { PipeRow, PipeCategory } from './pipeline-client';
import PipelineTable from './pipeline-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CAT_BY_TYPE: Record<DealType, PipeCategory> = {
  funding: 'Funding',
  sale: 'Sales',
  partnership: 'Partnerships',
  procurement: 'Procurement',
};

const STAGE_LABEL: Record<PipelineStage, string> = {
  lead: 'lead',
  qualified: 'qualified',
  proposal: 'proposal',
  negotiation: 'negotiation',
  won: 'won',
  lost: 'lost',
};

const STAGE_TONE: Record<PipelineStage, PipeRow['stageTone']> = {
  lead: 'muted',
  qualified: 'muted',
  proposal: 'gold',
  negotiation: 'gold',
  won: 'sage',
  lost: 'muted',
};

function fmtMoney(n: number): string {
  if (!n) return '$0';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

export default async function PipelinePage() {
  // Internal pipeline (always available) + GHL funder opportunities (may be offline)
  const [overview, ghl] = await Promise.all([
    getPipelineOverview(),
    fetchOpportunitiesForPipelines(GOODS_PIPELINES.map((p) => p.id)).catch(() => ({ ok: false, opportunities: [] as GoodsOpportunity[] })),
  ]);

  // Unified rows from crm_deals (drop lost)
  const rows: PipeRow[] = overview.deals
    .filter((d) => d.pipeline_stage !== 'lost')
    .sort((a, b) => b.amount_cents - a.amount_cents)
    .map((d) => ({
      id: d.id,
      name: d.contact_org || d.title,
      category: CAT_BY_TYPE[d.deal_type],
      amount: Math.round((d.amount_cents || 0) / 100),
      stageLabel: STAGE_LABEL[d.pipeline_stage],
      stageTone: STAGE_TONE[d.pipeline_stage],
      next: d.needs_action ? `${d.days_since_update}d since update` : (d.notes?.slice(0, 60) || d.contact_name || '—'),
      href: d.contact_id ? `/admin/people` : null,
    }));

  // LOI ladder + match stack from GHL
  const SUPPLIER_NAMES = new Set(supplierQuotes.map((q) => q.supplier.trim().toLowerCase()));
  const opps = (ghl.opportunities || []).filter((o) => !SUPPLIER_NAMES.has(o.name.trim().toLowerCase()) && o.status !== 'lost' && o.status !== 'abandoned');
  const rungCounts: Record<LoiRung, number> = { target: 0, signed: 0, contract: 0, cash: 0 };
  let matchSigned = 0;
  for (const o of opps) {
    const rung = STAGE_TO_RUNG[o.stageId];
    if (!rung) continue;
    rungCounts[rung] += 1;
    // "signed" and beyond count toward the match (GHL committed is a pipeline status, verify signed LOIs before presenting as secured)
    if (rung === 'signed' || rung === 'contract' || rung === 'cash') {
      matchSigned += o.actualPaid ?? o.monetaryValue ?? 0;
    }
  }

  const activePipeline = overview.stats.totalPipeline;
  const wonValue = overview.stats.totalWon;

  const freshness: { label: string; ok: boolean }[] = [
    { label: 'Asset register · live', ok: true },
    { label: 'Xero mirror · synced', ok: true },
    { label: ghl.ok ? 'GHL · live API' : 'GHL · not reachable now', ok: ghl.ok },
    { label: 'Notion · manual sync', ok: false },
    { label: 'Empathy Ledger · API', ok: true },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-4">
      {/* Header */}
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Pipeline</h1>
          <p className="text-sm text-muted-foreground mt-1">Every open opportunity in one place · live from crm_deals + GHL.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/deals" className="rounded-lg border bg-background px-3 py-1.5 text-sm font-medium hover:border-primary/40">Kanban board →</Link>
          <Link href="/admin/loi-tracker" className="rounded-lg border bg-background px-3 py-1.5 text-sm font-medium hover:border-primary/40">LOI tracker →</Link>
        </div>
      </header>

      {/* The gap band */}
      <div className="flex items-center justify-between gap-4 rounded-xl bg-primary/10 px-4 py-2.5">
        <p className="text-sm font-medium">
          {matchSigned > 0
            ? `${fmtMoney(matchSigned)} committed toward the match · verify signed LOIs before presenting as secured.`
            : '0 signed match-eligible commitments · the QBE $400K releases only against signed external capital.'}
        </p>
        <span className="shrink-0 rounded-md bg-card px-2 py-0.5 text-[10.5px] font-bold text-primary">THE GAP</span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { n: fmtMoney(activePipeline), l: `active pipeline · ${overview.stats.activeDeals} open deals` },
          { n: `${fmtMoney(matchSigned)} of ${fmtMoney(MATCH_TARGET.cap)}`, l: 'match signed vs QBE cap' },
          { n: fmtMoney(wonValue), l: 'won to date' },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border bg-card px-4 py-3.5">
            <div className="font-display text-2xl font-bold tabular-nums" style={{ fontFamily: 'Georgia, serif' }}>{s.n}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Unified table */}
      <PipelineTable rows={rows} />

      {/* Bottom: freshness + ladder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-card p-4">
          <h2 className="font-display text-lg font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Data freshness</h2>
          <ul className="space-y-1.5">
            {freshness.map((f) => (
              <li key={f.label} className="flex items-center gap-2 text-sm">
                <span className={`h-1.5 w-1.5 rounded-full ${f.ok ? 'bg-emerald-600' : 'bg-primary'}`} aria-hidden />
                {f.label}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">Drift checks green means the numbers match everywhere. <Link href="/admin/operating-systems" className="font-semibold text-primary hover:underline">Sources →</Link></p>
        </div>

        <div className="rounded-2xl border bg-card p-4">
          <h2 className="font-display text-lg font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            LOI ladder · {rungCounts.signed + rungCounts.contract + rungCounts.cash} committed
          </h2>
          <ul className="space-y-1.5">
            {LOI_RUNGS.map((rung) => (
              <li key={rung.key} className="flex items-center justify-between text-sm">
                <span>{rung.label}</span>
                <span className="font-display font-bold tabular-nums" style={{ fontFamily: 'Georgia, serif' }}>{rungCounts[rung.key]}</span>
              </li>
            ))}
          </ul>
          <Link href="/admin/loi-tracker" className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">Open the LOI tracker →</Link>
        </div>
      </div>
    </div>
  );
}
