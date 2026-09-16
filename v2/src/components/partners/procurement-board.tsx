'use client';

/**
 * The board. Sort it, filter it, open a row, decide what to do next.
 *
 * Ben asked for something to PLAY with, in the shape of a social media dashboard: big numbers
 * at the top, a filterable list under them, and a reason to click. The interaction carries the
 * meaning here, so none of it is decoration.
 *
 * Three rules it follows:
 *   1. The score is an ordering and the row shows its four parts, so it can be argued with
 *      Clicking the score opens the breakdown.
 *   2. The headline figures recompute against whatever is filtered, so a filter answers a
 *      question instead of just hiding rows.
 *   3. No dollar figure here is an opportunity value. Government spend is what a government has
 *      already spent in that place on housing-adjacent work, and the column says so.
 */

import { useMemo, useState } from 'react';
import { BOARD_FILTERS, type BoardFilter, type Opportunity } from '@/lib/data/procurement-board';

type SortKey = 'score' | 'crowdedPct' | 'govtSpendAud' | 'bedsNoTender' | 'community';

const STATE_COLOUR: Record<string, string> = {
  NT: '#C45C3E', QLD: '#5E7A4C', SA: '#5E7D9A', WA: '#BBA255',
};

const money = (n: number) => (n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${n.toLocaleString('en-AU')}`);

export function ProcurementBoard({ rows }: { rows: Opportunity[] }) {
  const [filter, setFilter] = useState<BoardFilter>('all');
  const [states, setStates] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>('score');
  const [open, setOpen] = useState<string | null>(null);

  const shown = useMemo(() => {
    let out = rows;
    if (filter === 'here') out = out.filter((r) => r.parts.presence > 0);
    if (filter === 'route') out = out.filter((r) => r.routeExists);
    if (filter === 'crowded') out = out.filter((r) => (r.crowdedPct ?? 0) >= 50);
    if (filter === 'nothing') out = out.filter((r) => r.parts.presence === 0);
    if (states.length > 0) out = out.filter((r) => states.includes(r.state));
    return [...out].sort((a, b) => {
      if (sort === 'community') return a.community.localeCompare(b.community);
      const av = (a[sort] as number | null) ?? -1;
      const bv = (b[sort] as number | null) ?? -1;
      return bv - av;
    });
  }, [rows, filter, states, sort]);

  // The headline numbers answer whatever question the filter is currently asking.
  const stats = useMemo(() => {
    const withRoute = shown.filter((r) => r.routeExists).length;
    const here = shown.filter((r) => r.parts.presence > 0).length;
    const crowd = shown.filter((r) => r.crowdedPct !== null);
    const avgCrowd = crowd.length ? crowd.reduce((n, r) => n + (r.crowdedPct ?? 0), 0) / crowd.length : null;
    const spend = shown.reduce((n, r) => n + (r.govtSpendAud ?? 0), 0);
    return { count: shown.length, withRoute, here, avgCrowd, spend };
  }, [shown]);

  const allStates = useMemo(() => [...new Set(rows.map((r) => r.state))].sort(), [rows]);

  function toggleState(s: string) {
    setStates((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  return (
    <div>
      {/* The four numbers, recomputed against the filter. */}
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { k: 'Communities', v: String(stats.count), sub: filter === 'all' && states.length === 0 ? 'in the model' : 'matching' },
          { k: 'Route exists', v: `${stats.withRoute}`, sub: 'partner holds government contracts' },
          { k: 'We are there', v: `${stats.here}`, sub: 'beds or machines on the ground' },
          { k: 'Avg crowding', v: stats.avgCrowd === null ? 'not held' : `${stats.avgCrowd.toFixed(0)}%`, sub: 'households needing a bedroom' },
        ].map((s) => (
          <div key={s.k} className="rounded-lg border p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{s.k}</p>
            <p className="mt-1 font-display text-3xl leading-none">{s.v}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters. */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {BOARD_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors motion-reduce:transition-none"
            style={filter === f.id
              ? { backgroundColor: '#2E2E2E', borderColor: '#2E2E2E', color: '#FFF' }
              : { borderColor: '#D8CFC4', color: '#6A5E54' }}
          >
            {f.label}
          </button>
        ))}
        <span className="mx-1 h-4 w-px" style={{ backgroundColor: '#D8CFC4' }} />
        {allStates.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => toggleState(s)}
            aria-pressed={states.includes(s)}
            className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors motion-reduce:transition-none"
            style={states.includes(s)
              ? { backgroundColor: STATE_COLOUR[s] ?? '#6A5E54', borderColor: STATE_COLOUR[s] ?? '#6A5E54', color: '#FFF' }
              : { borderColor: '#D8CFC4', color: '#6A5E54' }}
          >
            {s}
          </button>
        ))}
        {(filter !== 'all' || states.length > 0) && (
          <button type="button" onClick={() => { setFilter('all'); setStates([]); }} className="px-2 text-xs underline" style={{ color: '#6A5E54' }}>
            clear
          </button>
        )}
      </div>

      {/* Sort. */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs" style={{ color: '#6A5E54' }}>
        <span className="font-semibold uppercase tracking-wide">Sort</span>
        {([
          ['score', 'Where to call first'],
          ['crowdedPct', 'Most crowded'],
          ['govtSpendAud', 'Most government spend'],
          ['bedsNoTender', 'Easiest to buy'],
          ['community', 'A to Z'],
        ] as [SortKey, string][]).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setSort(k)}
            aria-pressed={sort === k}
            className="rounded px-2 py-1 transition-colors motion-reduce:transition-none"
            style={sort === k ? { backgroundColor: '#EEE9E3', fontWeight: 600 } : undefined}
          >
            {label}
          </button>
        ))}
      </div>

      {/* The rows. */}
      <ol className="mt-5 space-y-2">
        {shown.map((r, i) => {
          const isOpen = open === r.community;
          return (
            <li key={r.community} className="rounded-lg border" style={{ borderColor: isOpen ? '#2E2E2E' : '#E8DED4' }}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : r.community)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                <span className="w-6 shrink-0 text-right font-display text-lg leading-none" style={{ color: '#A99C8F' }}>{i + 1}</span>
                <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase" style={{ backgroundColor: `${STATE_COLOUR[r.state] ?? '#6A5E54'}22`, color: STATE_COLOUR[r.state] ?? '#6A5E54' }}>
                  {r.state}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{r.community}</span>
                  <span className="block truncate text-xs text-muted-foreground">{r.partner ?? 'no partner organisation recorded'}</span>
                </span>
                <span className="hidden shrink-0 text-right sm:block">
                  <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">Crowded</span>
                  <span className="block text-sm font-semibold tabular-nums">{r.crowdedPct === null ? 'n/h' : `${r.crowdedPct.toFixed(0)}%`}</span>
                </span>
                <span className="hidden shrink-0 text-right md:block">
                  <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">Govt spend</span>
                  <span className="block text-sm font-semibold tabular-nums">{r.govtSpendAud ? money(r.govtSpendAud) : 'n/h'}</span>
                </span>
                <span className="hidden shrink-0 text-right lg:block">
                  <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">No tender</span>
                  <span className="block text-sm font-semibold tabular-nums">{r.bedsNoTender === null ? (r.state === 'WA' ? 'no cap' : 'n/h') : `${r.bedsNoTender} beds`}</span>
                </span>
                <span className="shrink-0 rounded-lg px-2.5 py-1.5 text-right" style={{ backgroundColor: '#F6E4DE' }}>
                  <span className="block text-[10px] uppercase tracking-wide" style={{ color: '#9A4023' }}>Score</span>
                  <span className="block font-display text-lg leading-none" style={{ color: '#9A4023' }}>{r.score}</span>
                </span>
              </button>

              {isOpen && (
                <div className="border-t p-5" style={{ borderColor: '#E8DED4' }}>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#C45C3E' }}>The next move</p>
                      <p className="mt-2 text-sm leading-relaxed">{r.move}</p>
                      {r.noTenderRule && (
                        <>
                          <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#C45C3E' }}>The rule in this jurisdiction</p>
                          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{r.noTenderRule}</p>
                        </>
                      )}
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#C45C3E' }}>What we hold here</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{r.presence ?? 'Nothing recorded.'}</p>
                      {r.routeEvidence && (
                        <>
                          <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide" style={{ color: '#C45C3E' }}>Why a route exists</p>
                          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{r.routeEvidence}</p>
                        </>
                      )}
                      {r.personsPerDwelling && (
                        <p className="mt-4 text-xs text-muted-foreground">
                          {r.personsPerDwelling.toFixed(1)} people per dwelling, ABS Census 2021.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* The score, taken apart. */}
                  <div className="mt-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      How the {r.score} is made, so it can be argued with
                    </p>
                    <div className="mt-2 flex h-6 overflow-hidden rounded" style={{ backgroundColor: '#EEE9E3' }}>
                      {([
                        ['Need', r.parts.need, '#C45C3E'],
                        ['Ease', r.parts.ease, '#BBA255'],
                        ['Route', r.parts.route, '#5E7A4C'],
                        ['Presence', r.parts.presence, '#5E7D9A'],
                      ] as [string, number, string][]).map(([label, v, c]) => v > 0 && (
                        <div key={label} title={`${label} ${v}`} style={{ width: `${v}%`, backgroundColor: c }} className="flex items-center justify-center">
                          <span className="text-[9px] font-bold text-white">{v}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-1.5 text-[11px] text-muted-foreground">
                      Need is crowding, ease is how few hoops the jurisdiction puts up, route is whether the
                      organisation here holds government contracts, presence is whether we are already on the
                      ground. Nothing here is a dollar value of anything.
                    </p>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {shown.length === 0 && (
        <p className="mt-8 text-sm" style={{ color: '#6A5E54' }}>Nothing matches. Clear a filter.</p>
      )}
    </div>
  );
}
