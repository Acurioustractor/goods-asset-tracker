import type { Metadata } from 'next';
import { goodsOpportunities, entitiesByAbn, grantscopeDirectConfigured } from '@/lib/grantscope/direct';
import { PROCUREMENT_REGISTER, CAN_SELL_AND_HOLDS_CONTRACTS, PROCUREMENT_REGISTER_STATS } from '@/lib/data/procurement-register';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Grantscope | Goods admin',
  robots: { index: false, follow: false },
};

/**
 * GRANTSCOPE, FINALLY READABLE.
 *
 * Ben, 17 September 2026: "i really want to find a way to be able to use all that grantscope data
 * as it has everything we need and if we can connect it it will open up so much data."
 *
 * It did have everything, and it was connected — through an HTTP API that cannot be reached from
 * here. GRANTSCOPE_API_URL points at civicgraph.vercel.app, which 404s on every path, and the
 * live host sits behind Vercel's Security Checkpoint, which answers a server call with a bot
 * challenge. So this page goes around the API and reads the database Goods already has keys for.
 *
 * What that unlocks, none of which this repo had ever displayed: 26,785 grant opportunities
 * already carrying a `goods_relevance_score` somebody computed and nobody read, and 609,631
 * entities joinable to our own organisations on ABN alone.
 */
export default async function GrantscopePage() {
  const [opportunities, gsEntities] = await Promise.all([
    goodsOpportunities(70, 40),
    entitiesByAbn(PROCUREMENT_REGISTER.map((e) => e.abn).filter((a): a is string => !!a)),
  ]);

  const money = (n: number | null) =>
    n && n > 0 ? `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '—';

  return (
    <div className="max-w-[1180px] mx-auto pb-16">
      <header className="mb-7">
        <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
          Grantscope · read directly, ABN-joined
        </p>
        <h1 className="mt-1 text-3xl font-bold">Money we could go after</h1>
        <p className="mt-2 max-w-3xl text-muted-foreground">
          Opportunities already scored for Goods relevance inside grantscope, filtered to those
          still open, ongoing or upcoming. The score is not ours — it was computed upstream and had
          never been read from this repo.
        </p>
      </header>

      {!grantscopeDirectConfigured && (
        <p className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Grantscope credentials are not set in this environment, so the lists below are empty.
          Needs <code>ACT_INFRA_SUPABASE_URL</code> and <code>ACT_INFRA_SUPABASE_KEY</code>.
        </p>
      )}

      <section className="mb-10">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Open opportunities · {opportunities.length}
        </h2>
        <div className="overflow-hidden rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-bold">Score</th>
                <th className="px-4 py-2.5 font-bold">Opportunity</th>
                <th className="px-4 py-2.5 font-bold">Provider</th>
                <th className="px-4 py-2.5 font-bold">Up to</th>
                <th className="px-4 py-2.5 font-bold">Closes</th>
                <th className="px-4 py-2.5 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((o) => (
                <tr key={o.id} className="border-t align-top">
                  <td className="px-4 py-3 font-bold tabular-nums">{o.goodsRelevance ?? '—'}</td>
                  <td className="px-4 py-3 font-semibold">
                    {o.url ? (
                      <a href={o.url} target="_blank" rel="noreferrer" className="hover:underline">
                        {o.name}
                      </a>
                    ) : (
                      o.name
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{o.provider ?? '—'}</td>
                  <td className="px-4 py-3 tabular-nums">{money(o.amountMax)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {o.closesAt ? o.closesAt.slice(0, 10) : 'no date'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{o.status ?? '—'}</td>
                </tr>
              ))}
              {opportunities.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                    Nothing returned. Grantscope may be unreachable from this environment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Who could sell · {CAN_SELL_AND_HOLDS_CONTRACTS.length} of {PROCUREMENT_REGISTER_STATS.entities}
        </h2>
        <p className="mb-3 max-w-3xl text-sm text-muted-foreground">
          Community-controlled organisations that already hold a government contract, matched into
          grantscope on ABN. The source table has 4,562 rows for 1,049 organisations, so any total
          taken from it raw is inflated roughly nine-fold; these are deduped.
        </p>
        <div className="overflow-hidden rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-bold">Organisation</th>
                <th className="px-4 py-2.5 font-bold">Contracts</th>
                <th className="px-4 py-2.5 font-bold">Value</th>
                <th className="px-4 py-2.5 font-bold">In grantscope</th>
                <th className="px-4 py-2.5 font-bold">Supply Nation</th>
              </tr>
            </thead>
            <tbody>
              {CAN_SELL_AND_HOLDS_CONTRACTS.map((e) => {
                const gsEntity = e.abn ? gsEntities.get(e.abn) : undefined;
                return (
                  <tr key={e.abn ?? e.name} className="border-t">
                    <td className="px-4 py-3 font-semibold">{e.name}</td>
                    <td className="px-4 py-3 tabular-nums">{e.govtContractCount}</td>
                    <td className="px-4 py-3 tabular-nums">{money(e.govtContractValue)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {gsEntity ? gsEntity.state ?? 'matched' : 'not matched'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {gsEntity?.supplyNationCertified ? 'certified' : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
