import Link from 'next/link';
import { fetchOpportunitiesForPipelines, type GoodsOpportunity } from '@/lib/ghl';
import {
  LOI_RUNGS,
  GOODS_PIPELINES,
  PIPELINE_BY_ID,
  STAGE_TO_RUNG,
  MATCH_TARGET,
  GRANTS_ROUTING,
  type LoiRung,
} from '@/lib/data/loi-pipeline';
import { supplierQuotes } from '@/lib/data/supplier-quotes';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const STREAM_BADGE: Record<string, string> = {
  commercial: 'bg-sky-100 text-sky-800',
  philanthropy: 'bg-violet-100 text-violet-800',
  demand: 'bg-muted text-muted-foreground',
};

function fmtMoney(n: number): string {
  if (!n) return '—';
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

export default async function LoiTrackerPage() {
  const { ok, opportunities } = await fetchOpportunitiesForPipelines(
    GOODS_PIPELINES.map((p) => p.id),
  );

  // Suppliers belong in the cost-model supplier list, NOT a funding pipeline.
  // Defensively exclude any opp whose name matches a known supplier so a misfiled
  // one (e.g. "Centre Canvas" sitting in Buyer) never pollutes the ladder/rollup.
  const SUPPLIER_NAMES = new Set(supplierQuotes.map((q) => q.supplier.trim().toLowerCase()));
  const isSupplier = (o: GoodsOpportunity) => SUPPLIER_NAMES.has(o.name.trim().toLowerCase());

  // Bucket live opportunities onto the LOI ladder. Drop lost/abandoned and any
  // stage that isn't mapped to a rung (Lapsed, Declined/Parked, Dormant).
  const ladderable = opportunities.filter(
    (o) => o.status !== 'lost' && o.status !== 'abandoned' && STAGE_TO_RUNG[o.stageId],
  );
  const active = ladderable.filter((o) => !isSupplier(o));
  const misfiledSuppliers = ladderable.filter(isSupplier);
  const byRung: Record<LoiRung, GoodsOpportunity[]> = {
    target: [],
    signed: [],
    contract: [],
    cash: [],
  };
  for (const o of active) byRung[STAGE_TO_RUNG[o.stageId]].push(o);

  const rungTotal = (rung: LoiRung) => byRung[rung].reduce((s, o) => s + o.monetaryValue, 0);

  // ── Reconciled match view (the money-alignment custom fields, backfilled
  // 2026-06-01) ──────────────────────────────────────────────────────────────
  // This is the ACCURATE rollup: it reads Funding type / Match-eligible /
  // Capital status straight off each opportunity rather than inferring intent
  // from the pipeline stage. Secured prefers the Xero-verified Actual-paid
  // figure and falls back to the ask (monetaryValue) until Layer B syncs it.
  const classifiable = opportunities.filter(
    (o) => o.status !== 'lost' && o.status !== 'abandoned' && !isSupplier(o),
  );
  const isPhilOrGrant = (o: GoodsOpportunity) =>
    o.fundingType === 'Grant' || o.fundingType === 'Philanthropic';
  const securedAmt = (o: GoodsOpportunity) => o.actualPaid ?? o.monetaryValue;

  // Secured = paid + match-eligible + philanthropic/grant. The headline match number.
  const securedOpps = classifiable.filter(
    (o) => o.matchEligible === 'Yes' && o.capitalStatus === 'Paid' && isPhilOrGrant(o),
  );
  const secured = securedOpps.reduce((s, o) => s + securedAmt(o), 0);
  // The QBE gate: a firm, document-backed commitment. Expected $0 until a real LOI lands.
  const committedOpps = classifiable.filter(
    (o) => o.capitalStatus === 'Signed LOI' || o.capitalStatus === 'Contracted',
  );
  const committed = committedOpps.reduce((s, o) => s + securedAmt(o), 0);
  // Invoiced receivables that would count once paid (e.g. Rotary INV-0222).
  const invoicedOpps = classifiable.filter(
    (o) => o.capitalStatus === 'Invoiced' && o.matchEligible === 'Yes',
  );
  const invoiced = invoicedOpps.reduce((s, o) => s + o.monetaryValue, 0);
  // Match-eligible asks in flight (e.g. Minderoo, REAL, the Tier-1 foundations).
  const askedOpps = classifiable.filter(
    (o) => o.capitalStatus === 'Ask made' && o.matchEligible === 'Yes',
  );
  const asked = askedOpps.reduce((s, o) => s + o.monetaryValue, 0);

  // Secured broken down by funding type, for the funder-mix line.
  const securedByType = securedOpps.reduce<Record<string, number>>((acc, o) => {
    const key = o.fundingType ?? 'Other';
    acc[key] = (acc[key] ?? 0) + securedAmt(o);
    return acc;
  }, {});
  const classifiedCount = classifiable.filter((o) => o.capitalStatus).length;
  const securedSyncedCount = securedOpps.filter((o) => o.actualPaid != null).length;
  const committedCount = committedOpps.length;

  return (
    <div className="max-w-6xl space-y-8">
      <header>
        <h1 className="font-display text-2xl font-semibold text-foreground">LOI Tracker</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Progress toward the QBE match, read <strong>live from GHL</strong> — the source of truth for
          relationships and pipeline stages. Pulls the three Goods pipelines (Demand Register → Buyer
          Pipeline → Supporter Journey) and maps their stages onto the LOI ladder. Sits beside{' '}
          <Link href="/admin/deals" className="text-sky-700 underline">
            /admin/deals
          </Link>
          .
        </p>
      </header>

      {/* Reconciled match view — reads the GHL money-alignment fields (backfilled 2026-06-01) */}
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-semibold text-emerald-900">
            QBE match — reconciled from GHL classification
          </p>
          <span className="text-xs text-emerald-700">{classifiedCount} opps classified · live</span>
        </div>
        <p className="mt-1 text-sm text-emerald-800">{MATCH_TARGET.note}</p>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <span className="block text-xs uppercase tracking-wide text-emerald-700">
              Secured (paid · match-eligible)
            </span>
            <span className="text-lg font-semibold text-emerald-900">{fmtMoney(secured)}</span>
            <span className="block text-[11px] text-emerald-600">
              {securedOpps.length} grants/gifts · {securedSyncedCount} Xero-synced
            </span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wide text-emerald-700">
              Committed (signed LOI / contracted)
            </span>
            <span className="text-lg font-semibold text-emerald-900">{fmtMoney(committed)}</span>
            <span className="block text-[11px] text-emerald-600">
              {committedCount === 0 ? 'the open QBE gate' : `${committedCount} deal(s)`}
            </span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wide text-emerald-700">
              Invoiced (match-eligible)
            </span>
            <span className="text-lg font-semibold text-emerald-900">{fmtMoney(invoiced)}</span>
            <span className="block text-[11px] text-emerald-600">
              {invoicedOpps.length} receivable{invoicedOpps.length === 1 ? '' : 's'}
            </span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wide text-emerald-700">
              Match-eligible asks in flight
            </span>
            <span className="text-lg font-semibold text-emerald-900">{fmtMoney(asked)}</span>
            <span className="block text-[11px] text-emerald-600">
              {askedOpps.length} ask{askedOpps.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>
        {Object.keys(securedByType).length > 0 && (
          <p className="mt-3 text-xs text-emerald-700">
            Secured mix:{' '}
            {Object.entries(securedByType)
              .sort((a, b) => b[1] - a[1])
              .map(([type, amt]) => `${type} ${fmtMoney(amt)}`)
              .join(' · ')}
          </p>
        )}
        <p className="mt-2 text-xs text-emerald-700">
          Reads Funding type / Match-eligible / Capital status straight off each opportunity.{' '}
          <strong>Secured</strong> prefers the Xero-verified Actual-paid figure and falls back to the
          ask until the Layer-B Xero sync runs ({securedSyncedCount}/{securedOpps.length} synced), so a
          few rows (e.g. TFN, Dusseldorp) still show the ask, not the cash.{' '}
          <strong>Committed = the QBE gate</strong>: it stays at {fmtMoney(committed)} until a
          document-backed LOI lands.
        </p>
      </div>

      {/* The LOI ladder */}
      {!ok ? (
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          GHL is not connected in this environment (or returned no data), so the live ladder is empty.
          Set <code className="rounded bg-muted px-1">GHL_ENABLED</code>,{' '}
          <code className="rounded bg-muted px-1">GHL_API_KEY</code> and{' '}
          <code className="rounded bg-muted px-1">GHL_LOCATION_ID</code> to populate it. The ladder,
          mapping and match rules above still apply.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {LOI_RUNGS.map((rung) => {
            const opps = byRung[rung.key].slice().sort((a, b) => b.monetaryValue - a.monetaryValue);
            return (
              <div key={rung.key} className="rounded-lg border border-border bg-card">
                <div className="border-b border-border p-3">
                  <div className="flex items-baseline justify-between">
                    <h2 className="font-display text-sm font-semibold text-foreground">{rung.label}</h2>
                    <span className="text-xs font-medium text-muted-foreground">
                      {opps.length} · {fmtMoney(rungTotal(rung.key))}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground">{rung.desc}</p>
                </div>
                <ul className="divide-y divide-border">
                  {opps.length === 0 && (
                    <li className="p-3 text-xs text-muted-foreground">No opportunities at this rung.</li>
                  )}
                  {opps.map((o) => {
                    const p = PIPELINE_BY_ID[o.pipelineId];
                    return (
                      <li key={o.id} className="p-3">
                        <p className="text-sm font-medium text-foreground">{o.name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          {p && (
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                                STREAM_BADGE[p.stream] ?? 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {p.stream}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">{fmtMoney(o.monetaryValue)}</span>
                          {o.contactName && (
                            <span className="text-xs text-muted-foreground">· {o.contactName}</span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {/* Grants routing */}
      <div className="rounded-lg border border-violet-200 bg-violet-50 p-4">
        <p className="text-sm font-semibold text-violet-900">Where grants land</p>
        <p className="mt-1 text-sm text-violet-800">{GRANTS_ROUTING}</p>
      </div>

      {/* Misfiled suppliers (hidden from the ladder) */}
      {misfiledSuppliers.length > 0 && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
          <p className="text-sm font-semibold text-rose-900">
            {misfiledSuppliers.length} supplier{misfiledSuppliers.length > 1 ? 's' : ''} misfiled in a
            funding pipeline — hidden from the ladder
          </p>
          <p className="mt-1 text-sm text-rose-800">
            {misfiledSuppliers.map((o) => o.name).join(', ')}. Suppliers belong in the cost-model
            supplier list (<code className="rounded bg-rose-100 px-1">supplier-quotes.ts</code>), not
            the Buyer / Supporter pipelines — move them out in GHL so the pipeline reflects only buyers
            and funders.
          </p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Pipelines read: {GOODS_PIPELINES.map((p) => p.name).join(' · ')}. Stage→rung mapping verified
        against GHL 2026-05-30. Lapsed / Declined / Dormant stages drop off the ladder.
      </p>
    </div>
  );
}
