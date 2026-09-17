'use client';

/**
 * WHAT GREW, AND IN WHAT ORDER.
 *
 * Ben, 17 September 2026, on the map and its year scrubber: "it is simple and fucking boring,
 * think about impact and growth." He was right. A slider that moved one number is a widget. The
 * argument underneath it was never drawn.
 *
 * THE ARGUMENT. Beds in homes climb from nothing to 482 across six places. Underneath the climb
 * run two lanes of money on the same time axis: money given, and money paid by a buyer. For the
 * first eleven months the giving lane has dots in it and the buying lane is empty. Then the
 * first invoice is paid and the buying lane fills. Nobody has to assert that philanthropy went
 * first and trade followed, because the two lanes say it, and both are drawn from the invoice
 * record rather than from a claim.
 *
 * COLOUR CARRIES NOTHING HERE, ON PURPOSE. The brand pair is terracotta and sage, which is a red
 * and a green, and the palette validator fails it for protan and deutan separation: a colourblind
 * reader could not tell the two lanes apart. So the lanes are told apart by position (two rows),
 * by shape (filled against outlined) and by a label on each row. One hue throughout.
 *
 * Every dot is a dated row in the books. Nothing here is modelled.
 */

import { useState } from 'react';

const RUST = '#C45C3E';
const INK = '#2E2E2E';
const MUTED = '#A2958A';
const RULE = '#E0D6C8';

export interface GrowthPlace {
  id: string;
  name: string;
  /** YYYY-MM. */
  since: string;
  beds: number;
  washers: number;
}

export interface MoneyEvent {
  /** YYYY-MM-DD. */
  on: string;
  label: string;
  detail: string;
  /** `given` is philanthropy. `bought` is a buyer paying an invoice. */
  kind: 'given' | 'bought';
}

const W = 760;
const H = 300;
const PAD = { l: 8, r: 8, t: 26, b: 74 };
const PLOT_H = H - PAD.t - PAD.b;

const months = (iso: string) => {
  const [y, m] = iso.split('-');
  return Number(y) * 12 + Number(m) - 1;
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const readable = (iso: string) => {
  const [y, m] = iso.split('-');
  return `${MONTH_NAMES[Number(m) - 1]} ${y}`;
};

export function GrowthStory({
  places,
  events,
  totalBeds,
  totalWashers,
  communities,
  bedsBought,
  monthsBefore,
}: {
  places: readonly GrowthPlace[];
  events: readonly MoneyEvent[];
  totalBeds: number;
  totalWashers: number;
  communities: number;
  bedsBought: number;
  /** Months between the first money given and the first invoice paid. Computed, never typed. */
  monthsBefore: number;
}) {
  const [hover, setHover] = useState<MoneyEvent | null>(null);

  const ordered = places.slice().sort((a, b) => a.since.localeCompare(b.since));
  const allEvents = events.slice().sort((a, b) => a.on.localeCompare(b.on));

  // One axis, in months, from the first thing that happened to the last.
  const startM = Math.min(months(ordered[0].since), months(allEvents[0].on.slice(0, 7)));
  const endM = Math.max(
    months(ordered[ordered.length - 1].since),
    months(allEvents[allEvents.length - 1].on.slice(0, 7)),
  ) + 1;
  const span = Math.max(1, endM - startM);
  const x = (iso: string) => PAD.l + ((months(iso.slice(0, 7)) - startM) / span) * (W - PAD.l - PAD.r);

  const onMap = ordered.reduce((n, p) => n + p.beds, 0);
  const y = (beds: number) => PAD.t + PLOT_H - (beds / onMap) * PLOT_H;

  // A step per place: beds arrive on a date, they do not ease in.
  let running = 0;
  const steps = ordered.map((p) => {
    const from = running;
    running += p.beds;
    return { ...p, from, to: running, cx: x(p.since) };
  });

  const line: string[] = [`M ${PAD.l} ${y(0)}`];
  for (const s of steps) {
    line.push(`L ${s.cx} ${y(s.from)}`);
    line.push(`L ${s.cx} ${y(s.to)}`);
  }
  line.push(`L ${W - PAD.r} ${y(running)}`);
  const area = `${line.join(' ')} L ${W - PAD.r} ${y(0)} Z`;

  const years = Array.from(
    new Set(allEvents.map((e) => e.on.slice(0, 4)).concat(ordered.map((p) => p.since.slice(0, 4)))),
  ).sort();

  const LANE = { given: H - PAD.b + 30, bought: H - PAD.b + 56 };

  return (
    <div className="overflow-hidden rounded-[22px] border" style={{ borderColor: '#E8DED4', backgroundColor: '#FFFDF9' }}>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_15rem]">
        <figure className="m-0 p-4 sm:p-6" style={{ backgroundColor: '#F6F0E6' }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full"
            role="img"
            aria-label={`Beds in homes climbing to ${onMap} across ${ordered.length} places, with every payment dated underneath`}
          >
            {years.map((yr) => {
              const cx = x(`${yr}-01`);
              if (cx < PAD.l || cx > W - PAD.r) return null;
              return (
                <g key={yr}>
                  <line x1={cx} y1={PAD.t - 6} x2={cx} y2={LANE.bought + 10} stroke={RULE} strokeWidth={1} />
                  <text x={cx + 5} y={PAD.t - 12} fontSize={11} fill={MUTED}>{yr}</text>
                </g>
              );
            })}

            <path d={area} fill={RUST} opacity={0.14} />
            <path d={line.join(' ')} fill="none" stroke={RUST} strokeWidth={2} strokeLinejoin="round" />

            {steps.map((s, i) => (
              <g key={s.id}>
                <circle cx={s.cx} cy={y(s.to)} r={4.5} fill={RUST} stroke="#F6F0E6" strokeWidth={2} />
                {/* Direct labels, not a number on every point: the first, the biggest and the last. */}
                {(i === 0 || i === steps.length - 1 || s.beds === Math.max(...steps.map((q) => q.beds))) && (
                  <text x={s.cx + 8} y={y(s.to) - 8} fontSize={12} fill={INK} style={{ fontWeight: 600 }}>
                    {s.name} · {s.to}
                  </text>
                )}
              </g>
            ))}

            <line x1={PAD.l} y1={y(0)} x2={W - PAD.r} y2={y(0)} stroke={RULE} strokeWidth={1} />

            {(['given', 'bought'] as const).map((kind) => (
              <g key={kind}>
                <line
                  x1={PAD.l} y1={LANE[kind]} x2={W - PAD.r} y2={LANE[kind]}
                  stroke={RULE} strokeWidth={1} strokeDasharray={kind === 'bought' ? '3 4' : undefined}
                />
                <text x={PAD.l} y={LANE[kind] - 9} fontSize={11} fill={MUTED} style={{ letterSpacing: '0.08em' }}>
                  {kind === 'given' ? 'GIVEN' : 'BOUGHT'}
                </text>
              </g>
            ))}

            {allEvents.map((e) => (
              <circle
                key={`${e.on}-${e.label}`}
                cx={x(e.on)} cy={LANE[e.kind]} r={hover === e ? 8 : 6}
                fill={e.kind === 'given' ? RUST : '#F6F0E6'}
                stroke={RUST} strokeWidth={2}
                onMouseEnter={() => setHover(e)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(e)}
                onBlur={() => setHover(null)}
                tabIndex={0}
                role="button"
                aria-label={`${readable(e.on)}, ${e.label}. ${e.detail}`}
                style={{ cursor: 'pointer', outline: 'none' }}
              />
            ))}
          </svg>

          <figcaption className="mt-1 min-h-[2.75rem] text-xs leading-relaxed" style={{ color: hover ? INK : MUTED }}>
            {hover
              ? `${readable(hover.on)} · ${hover.label}. ${hover.detail}`
              : 'Every dot is a payment with a date in the books. Filled is money given, outlined is a buyer paying an invoice. Point at one.'}
          </figcaption>
        </figure>

        <div className="p-5 sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: RUST }}>
            {monthsBefore} months
          </p>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: `${INK}b8` }}>
            That is how long the giving lane ran on its own before anybody bought a bed. The first
            invoice was paid in{' '}
            {readable((allEvents.find((e) => e.kind === 'bought')?.on ?? '').slice(0, 7))}. Trade has
            not stopped since.
          </p>

          <dl className="mt-6 space-y-5">
            {[
              { k: 'Beds in homes', v: totalBeds, s: `across ${communities} communities` },
              { k: 'Machines in community', v: totalWashers, s: 'four places' },
              { k: 'Beds a buyer paid for', v: bedsBought, s: `${allEvents.filter((e) => e.kind === 'bought').length} invoices, all paid` },
            ].map((s) => (
              <div key={s.k}>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: MUTED }}>{s.k}</dt>
                <dd className="mt-1 font-display text-4xl leading-none tabular-nums" style={{ color: INK }}>{s.v}</dd>
                <p className="mt-1 text-xs" style={{ color: MUTED }}>{s.s}</p>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
