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

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const STREAM_BADGE: Record<string, string> = {
  commercial: 'bg-sky-100 text-sky-800',
  philanthropy: 'bg-violet-100 text-violet-800',
  demand: 'bg-gray-100 text-gray-600',
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

  // Bucket live opportunities onto the LOI ladder. Drop lost/abandoned and any
  // stage that isn't mapped to a rung (Lapsed, Declined/Parked, Dormant).
  const active = opportunities.filter(
    (o) => o.status !== 'lost' && o.status !== 'abandoned' && STAGE_TO_RUNG[o.stageId],
  );
  const byRung: Record<LoiRung, GoodsOpportunity[]> = {
    target: [],
    signed: [],
    contract: [],
    cash: [],
  };
  for (const o of active) byRung[STAGE_TO_RUNG[o.stageId]].push(o);

  const rungTotal = (rung: LoiRung) => byRung[rung].reduce((s, o) => s + o.monetaryValue, 0);
  // "Committed+" = signed + contract + cash. This is GHL pipeline value, NOT
  // confirmed/eligible capital — the match figure must be verified in Xero.
  const committedPlus = (['signed', 'contract', 'cash'] as LoiRung[]).reduce(
    (s, r) => s + rungTotal(r),
    0,
  );
  const philanthropyCommitted = (['signed', 'contract', 'cash'] as LoiRung[]).reduce(
    (s, r) =>
      s +
      byRung[r]
        .filter((o) => PIPELINE_BY_ID[o.pipelineId]?.stream === 'philanthropy')
        .reduce((a, o) => a + o.monetaryValue, 0),
    0,
  );
  const signedCount = byRung.signed.length;

  return (
    <div className="max-w-6xl space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">LOI Tracker</h1>
        <p className="mt-2 max-w-3xl text-sm text-gray-600">
          Progress toward the QBE match, read <strong>live from GHL</strong> — the source of truth for
          relationships and pipeline stages. Pulls the three Goods pipelines (Demand Register → Buyer
          Pipeline → Supporter Journey) and maps their stages onto the LOI ladder. Sits beside{' '}
          <Link href="/admin/deals" className="text-sky-700 underline">
            /admin/deals
          </Link>
          .
        </p>
      </header>

      {/* Match banner — contingent + cap TBC */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-900">QBE match — contingent, cap unconfirmed</p>
        <p className="mt-1 text-sm text-amber-800">{MATCH_TARGET.note}</p>
        <div className="mt-3 flex flex-wrap gap-6 text-sm">
          <div>
            <span className="block text-xs uppercase tracking-wide text-amber-700">
              Committed+ in GHL (all streams)
            </span>
            <span className="text-lg font-semibold text-amber-900">{fmtMoney(committedPlus)}</span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wide text-amber-700">
              Of which philanthropy
            </span>
            <span className="text-lg font-semibold text-amber-900">
              {fmtMoney(philanthropyCommitted)}
            </span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wide text-amber-700">
              Signed / committed deals
            </span>
            <span className="text-lg font-semibold text-amber-900">{signedCount}</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-amber-700">
          GHL pipeline value — <strong>not</strong> committed capital or eligible match evidence.
          Confirm any cash figure in Xero (the money source of truth) and a signed LOI document before
          counting it toward the match.
        </p>
      </div>

      {/* The LOI ladder */}
      {!ok ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
          GHL is not connected in this environment (or returned no data), so the live ladder is empty.
          Set <code className="rounded bg-gray-100 px-1">GHL_ENABLED</code>,{' '}
          <code className="rounded bg-gray-100 px-1">GHL_API_KEY</code> and{' '}
          <code className="rounded bg-gray-100 px-1">GHL_LOCATION_ID</code> to populate it. The ladder,
          mapping and match rules above still apply.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
          {LOI_RUNGS.map((rung) => {
            const opps = byRung[rung.key].slice().sort((a, b) => b.monetaryValue - a.monetaryValue);
            return (
              <div key={rung.key} className="rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-100 p-3">
                  <div className="flex items-baseline justify-between">
                    <h2 className="text-sm font-semibold text-gray-900">{rung.label}</h2>
                    <span className="text-xs font-medium text-gray-500">
                      {opps.length} · {fmtMoney(rungTotal(rung.key))}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-snug text-gray-400">{rung.desc}</p>
                </div>
                <ul className="divide-y divide-gray-50">
                  {opps.length === 0 && (
                    <li className="p-3 text-xs text-gray-400">No opportunities at this rung.</li>
                  )}
                  {opps.map((o) => {
                    const p = PIPELINE_BY_ID[o.pipelineId];
                    return (
                      <li key={o.id} className="p-3">
                        <p className="text-sm font-medium text-gray-900">{o.name}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          {p && (
                            <span
                              className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                                STREAM_BADGE[p.stream] ?? 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {p.stream}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">{fmtMoney(o.monetaryValue)}</span>
                          {o.contactName && (
                            <span className="text-xs text-gray-400">· {o.contactName}</span>
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

      <p className="text-xs text-gray-400">
        Pipelines read: {GOODS_PIPELINES.map((p) => p.name).join(' · ')}. Stage→rung mapping verified
        against GHL 2026-05-30. Lapsed / Declined / Dormant stages drop off the ladder.
      </p>
    </div>
  );
}
