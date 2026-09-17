'use client';

/**
 * THE FLEET AS A TIMELINE, NOT A TABLE OF NUMBERS.
 *
 * Ben, 17 September 2026: the washer fleet section is still shit, it needs more graph and more
 * interaction. He is right. The rows carried a start date and an end date and rendered them as
 * two pieces of small text, which hid the only thing the fleet data actually shows: one machine
 * has been reporting for ten months and most of the others stopped.
 *
 * WHAT THE CHART DOES. Every machine gets a bar on one shared time axis, from its first report
 * to its last. You read down the column and see the drop-outs as gaps rather than as dates. The
 * cycles sit beside it as a second bar on their own scale, because cycles and months are
 * different units and putting them on one axis would be the dual-axis mistake.
 *
 * COLOUR IS STATUS, NOT IDENTITY. Identity is the row you are on. Reporting, silent and
 * unmatched are a status palette, and each one is named in words on its own row, so nobody has
 * to tell terracotta from grey to know what happened to a machine.
 *
 * INTERACTION. Hovering or focusing a row holds it and prints its note underneath; the rest
 * drop back. Sort by cycles or by when a machine was last heard from, because "who is doing the
 * work" and "who has gone quiet" are two different questions and the fleet answers both.
 */

import { useMemo, useState } from 'react';

const RUST = '#C45C3E';
const RUST_INK = '#9A4023';
const INK = '#2E2E2E';
const MUTED = '#A2958A';
const RULE = '#E8DED4';
const RULE_SOFT = '#F0E7DC';
const SUNK = '#F6F0E6';
const SAGE_INK = '#5E7A4C';

export interface FleetRowView {
  assetId: string | null;
  where: string;
  cycles: number;
  kwh: number;
  from: string;
  to: string;
  state: 'reporting' | 'silent' | 'investigating';
  note?: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const day = (iso: string) => Date.parse(`${iso}T00:00:00Z`);
const readable = (iso: string) => {
  const [y, m] = iso.split('-');
  return `${MONTHS[Number(m) - 1]} ${y}`;
};

const STATE_LABEL = { reporting: 'still reporting', silent: 'went quiet', investigating: 'under investigation' } as const;

export function FleetTimeline({ rows, readAt }: { rows: readonly FleetRowView[]; readAt: string }) {
  const [held, setHeld] = useState<number | null>(null);
  const [sort, setSort] = useState<'cycles' | 'last'>('cycles');

  const ordered = useMemo(() => {
    const copy = rows.slice();
    copy.sort((a, b) => (sort === 'cycles' ? b.cycles - a.cycles : day(b.to) - day(a.to)));
    return copy;
  }, [rows, sort]);

  const start = Math.min(...rows.map((r) => day(r.from)));
  const end = Math.max(day(readAt), ...rows.map((r) => day(r.to)));
  const span = Math.max(1, end - start);
  const pct = (iso: string) => ((day(iso) - start) / span) * 100;
  const topCycles = Math.max(...rows.map((r) => r.cycles), 1);

  // Year boundaries inside the window, for a grid that is a calendar rather than a decoration.
  const ticks: { at: number; label: string }[] = [];
  for (let y = new Date(start).getUTCFullYear(); y <= new Date(end).getUTCFullYear(); y += 1) {
    for (const m of [0, 6]) {
      const at = Date.UTC(y, m, 1);
      if (at > start && at < end) ticks.push({ at: ((at - start) / span) * 100, label: `${MONTHS[m]} ${y}` });
    }
  }

  const silentDays = (r: FleetRowView) => Math.max(0, Math.round((day(readAt) - day(r.to)) / 86400000));
  const current = held === null ? null : ordered[held];

  return (
    <div className="overflow-hidden rounded-lg" style={{ border: `1px solid ${RULE}`, backgroundColor: '#FFFFFF' }}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4" style={{ backgroundColor: SUNK, borderBottom: `1px solid ${RULE}` }}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: MUTED }}>
          When each machine was reporting
        </p>
        <div className="flex items-center gap-1">
          {([['cycles', 'Most used'], ['last', 'Last heard from']] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSort(key)}
              className="rounded-full px-3 py-1 text-[11px] font-semibold"
              style={
                sort === key
                  ? { backgroundColor: RUST, color: '#FDF8F3' }
                  : { backgroundColor: 'transparent', color: MUTED, border: `1px solid ${RULE}` }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 pt-5 sm:px-7">
        <div className="relative ml-0 h-4 sm:ml-[9.5rem]">
          {ticks.map((t) => (
            <span key={t.label} className="absolute top-0 text-[10px]" style={{ left: `${t.at}%`, color: MUTED, transform: 'translateX(-50%)' }}>
              {t.label}
            </span>
          ))}
        </div>
      </div>

      <ol className="m-0 list-none p-0">
        {ordered.map((r, i) => {
          const on = held === null || held === i;
          const bar = { left: `${pct(r.from)}%`, width: `${Math.max(1.5, pct(r.to) - pct(r.from))}%` };
          return (
            <li
              key={`${r.assetId ?? 'unmatched'}-${r.from}-${r.cycles}`}
              className="grid gap-2 px-5 py-3 sm:grid-cols-[9rem_1fr_6rem] sm:items-center sm:gap-4 sm:px-7"
              style={{ borderTop: `1px solid ${RULE_SOFT}`, opacity: on ? 1 : 0.35, transition: 'opacity 200ms ease' }}
              onMouseEnter={() => setHeld(i)}
              onMouseLeave={() => setHeld(null)}
              onFocus={() => setHeld(i)}
              onBlur={() => setHeld(null)}
              tabIndex={0}
            >
              <div className="min-w-0">
                <p className="text-[13px] font-semibold leading-tight" style={{ color: INK }}>{r.where}</p>
                <p className="text-[10px]" style={{ color: MUTED }}>{r.assetId}</p>
              </div>

              <div className="relative h-7">
                <span className="absolute inset-x-0 top-1/2 block h-px" style={{ backgroundColor: RULE_SOFT }} />
                {ticks.map((tk) => (
                  <span key={tk.label} className="absolute top-0 block h-full w-px" style={{ left: `${tk.at}%`, backgroundColor: RULE_SOFT }} />
                ))}
                <span
                  className="absolute top-1/2 block h-2.5 -translate-y-1/2 rounded-full"
                  style={{
                    ...bar,
                    backgroundColor: r.state === 'investigating' ? '#B9A894' : RUST,
                    opacity: r.state === 'silent' ? 0.5 : 1,
                  }}
                />
                {silentDays(r) > 21 && (
                  <span
                    className="absolute top-1/2 block h-2.5 -translate-y-1/2 rounded-full"
                    style={{
                      left: `${pct(r.to)}%`,
                      right: 0,
                      backgroundImage: `repeating-linear-gradient(135deg, ${RULE_SOFT} 0 4px, transparent 4px 8px)`,
                      border: `1px solid ${RULE_SOFT}`,
                    }}
                  />
                )}
                {r.state === 'reporting' && (
                  <span
                    className="absolute top-1/2 block h-3 w-3 -translate-y-1/2 rounded-full"
                    style={{ left: `calc(${pct(r.to)}% - 6px)`, backgroundColor: RUST, boxShadow: '0 0 0 3px rgba(196,92,62,0.22)' }}
                  />
                )}
              </div>

              <div className="sm:text-right">
                <p className="font-display text-base tabular-nums" style={{ color: INK }}>
                  {r.cycles.toLocaleString('en-AU')}
                  <span className="ml-1.5 text-[10px] uppercase tracking-wide" style={{ color: MUTED }}>washes</span>
                </p>
                <p className="text-[10px]" style={{ color: silentDays(r) > 21 ? RUST_INK : SAGE_INK }}>
                  {silentDays(r) === 0 ? 'reporting today' : `quiet ${silentDays(r)} days`}
                </p>
                <span className="mt-1 block h-1.5 rounded-full sm:ml-auto" style={{ width: `${Math.max(3, (r.cycles / topCycles) * 100)}%`, backgroundColor: r.state === 'investigating' ? '#B9A894' : RUST }} />
              </div>
            </li>
          );
        })}
      </ol>

      <div className="px-5 py-4 sm:px-7" style={{ borderTop: `1px solid ${RULE}`, backgroundColor: SUNK }}>
        <p className="min-h-[2.5rem] text-xs leading-relaxed" style={{ color: current ? INK : MUTED }}>
          {current
            ? `${current.assetId} · ${current.where} · ${readable(current.from)} to ${readable(current.to)} · ${current.cycles.toLocaleString('en-AU')} washes, ${current.kwh.toLocaleString('en-AU')} kWh.${current.note ? ` ${current.note}` : ''}`
            : `Solid is when a machine was reporting. Hatched is how long it has been quiet. Point at a row to hold it.`}
        </p>
      </div>
    </div>
  );
}
