import { QBE_AREAS, CATALYTIC_BLOCKERS, QBE_AS_OF, qbeScoreGap } from '@/lib/data/qbe-areas';
import { AsAt } from '@/components/ui/as-at';

/**
 * THE QBE READINESS DIAGNOSTIC, WITH ITS AGE ON IT.
 *
 * qbe-areas.ts holds the twelve Catalysing Impact areas from the SIH readiness diagnostic V4,
 * their maturity scores, and the five ranked blockers on the catalytic raise. It has fed
 * scripts/check-qbe-readiness.mjs, which writes a markdown report, and no screen. Found by the
 * dead-code sweep on 17 September, eight days before the application closes.
 *
 * THE AGE IS THE POINT. The scores are from the 1 May 2026 workshop and were mapped on 2 June, so
 * they are three and a half months old and at least one blocker has moved: rank 1 says the entity
 * and Indigenous-ownership structure is undecided, and the entity was settled since. The stamp is
 * the first thing on the screen, with a staleness window, so nobody reads a June judgement as a
 * September one. That is what lib/data/as-at.ts was built for this morning.
 *
 * Nothing here is recomputed. A diagnostic is somebody's assessment on a day, and the honest
 * thing to do with an old one is show it with the day attached.
 */

const BAND_TONE: Record<string, string> = {
  strength: 'bg-emerald-100 text-emerald-900',
  'priority-gap': 'bg-goods-terracotta/15 text-goods-terracotta',
  partial: 'bg-amber-100 text-amber-900',
};

export function ReadinessTab() {
  const p0 = QBE_AREAS.filter((a) => a.priority === 'P0');
  const scored = QBE_AREAS.filter((a) => a.scoreNow !== null);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-card p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-lg">Readiness diagnostic</h2>
          <AsAt
            stamp={{
              asAt: QBE_AS_OF,
              source: 'SIH and QBE Impact Investment Readiness Diagnostic V4, 1 May 2026 workshop, mapped 2 June',
              check: 'manual',
              owner: 'Ben',
              staleAfterDays: 90,
            }}
            showSource
          />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {p0.length} of {QBE_AREAS.length} areas are P0, which means they gate the catalytic raise.
          Read it as an assessment somebody made on a day. At least one blocker below has moved
          since: the entity and Indigenous-ownership structure it calls undecided has been settled.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <p className="text-xs font-semibold">The five blockers, ranked by what they unlock</p>
        <ol className="mt-3 space-y-3">
          {CATALYTIC_BLOCKERS.map((b) => (
            <li key={b.rank} className="flex gap-3">
              <span className="font-display text-xl leading-none text-muted-foreground">{b.rank}</span>
              <span className="min-w-0">
                <span className="block text-sm leading-relaxed">{b.summary}</span>
                <span className="mt-0.5 block text-[10px] text-muted-foreground">
                  Area{b.areaIds.length === 1 ? '' : 's'} {b.areaIds.join(', ')}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr className="text-left text-[10px] uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2 font-semibold">Area</th>
              <th className="px-4 py-2 text-right font-semibold">Now</th>
              <th className="px-4 py-2 text-right font-semibold">Target</th>
              <th className="px-4 py-2 text-right font-semibold">Gap</th>
              <th className="px-4 py-2 font-semibold">Band</th>
              <th className="px-4 py-2 font-semibold">What is missing</th>
            </tr>
          </thead>
          <tbody>
            {QBE_AREAS.map((a) => {
              const gap = qbeScoreGap(a.id);
              return (
                <tr key={a.id} className="border-b align-top">
                  <td className="px-4 py-2.5">
                    <span className="font-medium">{a.id} {a.name}</span>
                    {a.keystone && (
                      <span className="ml-2 rounded bg-goods-terracotta/15 px-1.5 py-0.5 text-[9px] font-semibold text-goods-terracotta">
                        KEYSTONE
                      </span>
                    )}
                    {a.priority === 'P0' && <span className="ml-2 text-[9px] font-semibold text-muted-foreground">P0</span>}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{a.scoreNow ?? 'not scored'}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-muted-foreground">{a.scoreTarget ?? ''}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{gap === null ? '' : gap}</td>
                  <td className="px-4 py-2.5">
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase ${BAND_TONE[a.band] ?? ''}`}>
                      {a.band.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-[11px] leading-snug text-muted-foreground">{a.gap}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Two areas carry no V4 score because they were added in Notion after the workshop. The
        scored {scored.length} are the diagnostic's own. Loop D reads the same file headless and
        writes wiki/canon/qbe-readiness.md, so this screen and that report can never disagree.
      </p>
    </div>
  );
}
