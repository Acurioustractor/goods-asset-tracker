'use client';

/**
 * TEN YEARS, STANDING ON THE SAME BASE.
 *
 * Ben, 17 September 2026: the last part of the Snow report has to carry the impact Goods is
 * working towards over ten years, and how Indigenous leadership and ownership hold it up: the
 * board, the members, the community enterprises and the making on Country.
 *
 * It is the four-areas drawing (impact-model.tsx), run forward. The four areas keep their
 * boxes and take their ten-year totals, with today's figure printed small under each so the
 * distance is visible.
 * Under them, the years: beds made each year, the Goods on Country facility as a filled bar
 * that stays the same height from year two, and the community facilities as a dashed outline
 * that grows until it is most of the frame. Under the years, the base, in four layers: the
 * facilities in community and the organisations that would be members (dashed, counted year
 * by year), then the enterprise rule and the board (solid, in place today).
 *
 * The argument is the shape. Our facility stays flat and the growth is theirs. That is what
 * Indigenous ownership holding the work up looks like as a picture, and it is why the base is
 * drawn under the years and never beside them.
 *
 * Every number recomputes from ten-year-scale.ts, the module the deck slide prints from, so the
 * report and the deck cannot disagree. Ben, 18 September: the claim ceiling paragraph came off
 * the bottom of the drawing. The module still carries it and the deck still prints it.
 *
 * Kit rules: one terracotta line weight, paper behind, dashed only for what has not happened.
 * The Goods on Country facility exists and has pressed beds, so its bar is filled. No community
 * facility has a site or a funder, so those are dashed, and so are the two base rows that count
 * them.
 */

import { useId, useState } from 'react';
import { ASSUMPTIONS, tenYearRows, tenYearTotals } from '@/lib/data/ten-year-scale';

const LINE = '#A8643F';
const INK = '#2E2E2E';
const MUTED = '#6A5E54';
const FAINT = '#A2958A';
const WASH = '#F6E4DE';
const RULE = '#E8DED4';

const n = (v: number) => v.toLocaleString('en-AU');

/** Today's figure for each area, already worded, so the boxes cannot drift from the drawing above. */
export interface TodayFigures {
  health: string;
  plastic: string;
  work: string;
  enterprise: string;
}

export function TenYearModel({ today }: { today: TodayFigures }) {
  const [aYear, setAYear] = useState<number>(ASSUMPTIONS.facilitiesAddedAYear.value);
  const id = useId();
  const over = { facilitiesAddedAYear: aYear };
  const rows = tenYearRows(over);
  const totals = tenYearTotals(over);
  const last = rows[rows.length - 1];
  const max = Math.max(...rows.map((r) => r.bedsTotal));

  const boxes = [
    { title: 'Health', value: n(totals.bedsTotal), unit: 'beds made', today: today.health },
    { title: 'The plastic', value: n(Math.round(totals.tonnesRecycled)), unit: 'tonnes out of the tip', today: today.plastic },
    { title: 'Paid work', value: n(totals.paidHours), unit: 'paid hours of making', today: today.work },
    { title: 'Enterprise', value: n(totals.enterprisesTrading), unit: 'community organisations trading', today: today.enterprise },
  ];

  const W = 1000;
  const M = 40;
  const gap = 18;
  const boxW = (W - M * 2 - gap * (boxes.length - 1)) / boxes.length;
  const boxTop = 16;
  const boxH = 128;

  // The years. A left gutter carries the row labels, a right margin carries the callouts.
  const L = 170;
  const R = 150;
  const slot = (W - L - R) / rows.length;
  const barW = 44;
  const CT = 184;
  const CB = 404;
  const y = (v: number) => CB - (v / max) * (CB - CT);
  const cx = (i: number) => L + slot * i + slot / 2;

  // The base. Two counted rows that have not happened, then two rules that hold today.
  const rowA = { y: 440, h: 34 };
  const rowB = { y: 480, h: 34 };
  const rowC = { y: 520, h: 44 };
  const rowD = { y: 570, h: 44 };
  const H = 652;

  const yearsAt = `${aYear} ${aYear === 1 ? 'community facility' : 'community facilities'} a year`;

  return (
    <figure className="m-0">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <label htmlFor={id} className="text-sm font-semibold" style={{ color: INK }}>
            Community facilities opened a year, from year two
          </label>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            <input
              id={id}
              type="range"
              min={1}
              max={3}
              step={1}
              value={aYear}
              onChange={(e) => setAYear(Number(e.target.value))}
              className="h-9 w-full max-w-56 sm:w-56"
              style={{ accentColor: LINE }}
              aria-valuetext={`${aYear} a year`}
            />
            <span className="font-display text-3xl" style={{ color: INK }}>{aYear}</span>
            <span className="text-sm" style={{ color: MUTED }}>
              {aYear === ASSUMPTIONS.facilitiesAddedAYear.value ? 'the working assumption' : 'what if'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full min-w-[680px]"
          role="img"
          aria-label={`Ten years at ${yearsAt}: ${n(totals.bedsTotal)} beds made, ${n(Math.round(totals.tonnesRecycled))} tonnes of plastic out of the tip, ${n(totals.paidHours)} paid hours of making, ${n(totals.enterprisesTrading)} community organisations trading. The years rest on a base of four layers: facilities in community, members of the charity, the enterprise rule and the board.`}
        >
          {boxes.map((b, i) => {
            const x = M + i * (boxW + gap);
            return (
              <g key={b.title}>
                <rect x={x} y={boxTop} width={boxW} height={boxH} rx="6" fill="none" stroke={LINE} strokeWidth="2" />
                <text x={x + boxW / 2} y={boxTop + 50} textAnchor="middle" fontSize="32" fill={INK}>
                  {b.value}
                </text>
                <text x={x + boxW / 2} y={boxTop + 72} textAnchor="middle" fontSize="12" fill={FAINT}>
                  {b.unit}
                </text>
                <text x={x + boxW / 2} y={boxTop + 93} textAnchor="middle" fontSize="11" fill={MUTED}>
                  {b.today}
                </text>
                <text x={x + boxW / 2} y={boxTop + 117} textAnchor="middle" fontSize="15" fill={INK}>
                  {b.title}
                </text>
              </g>
            );
          })}

          {/* The years, with the two kinds of facility named in the gutter. */}
          <text x={M} y={CT + 12} fontSize="12" fill={INK}>Beds made a year</text>
          <rect x={M} y={CT + 32} width="18" height="12" fill={WASH} stroke={LINE} strokeWidth="1.5" />
          <text x={M + 26} y={CT + 42} fontSize="11" fill={MUTED}>Goods on Country</text>
          <text x={M + 26} y={CT + 56} fontSize="11" fill={FAINT}>facility</text>
          <rect x={M} y={CT + 76} width="18" height="12" fill="none" stroke={LINE} strokeWidth="1.5" strokeDasharray="4 3" />
          <text x={M + 26} y={CT + 86} fontSize="11" fill={MUTED}>Community</text>
          <text x={M + 26} y={CT + 100} fontSize="11" fill={FAINT}>facilities</text>

          <line x1={L} y1={CB} x2={W - R} y2={CB} stroke={RULE} strokeWidth="1" />
          {rows.map((r, i) => {
            const x = cx(i) - barW / 2;
            const yMain = y(r.bedsMain);
            const yTop = y(r.bedsTotal);
            const isLast = i === rows.length - 1;
            return (
              <g key={r.year}>
                <rect x={x} y={yMain} width={barW} height={CB - yMain} fill={WASH} stroke={LINE} strokeWidth="2" />
                {r.bedsCommunity > 0 && (
                  <path
                    d={`M ${x} ${yMain} L ${x} ${yTop} L ${x + barW} ${yTop} L ${x + barW} ${yMain}`}
                    fill="none"
                    stroke={LINE}
                    strokeWidth="2"
                    strokeDasharray="6 6"
                  />
                )}
                {!isLast && (
                  <text x={cx(i)} y={yTop - 8} textAnchor="middle" fontSize="11" fill={INK}>
                    {n(r.bedsTotal)}
                  </text>
                )}
                <text x={cx(i)} y={CB + 18} textAnchor="middle" fontSize="11" fill={FAINT}>
                  {r.label}
                </text>
              </g>
            );
          })}

          <text x={W - R + 14} y={y(last.bedsTotal) + 6} fontSize="32" fill={INK}>{n(last.bedsTotal)}</text>
          <text x={W - R + 14} y={y(last.bedsTotal) + 26} fontSize="12" fill={FAINT}>beds in {last.label}</text>
          <text x={W - R + 14} y={y(last.bedsTotal) + 50} fontSize="12" fill={MUTED}>{n(last.bedsCommunity)} in community</text>
          <text x={W - R + 14} y={y(last.bedsTotal) + 66} fontSize="12" fill={MUTED}>{n(last.bedsMain)} at our facility</text>

          {/* The base. Read it downwards: what has to be true for the years above to happen. */}
          <rect x={M} y={rowA.y} width={W - M * 2} height={rowA.h} fill="none" stroke={LINE} strokeWidth="2" strokeDasharray="7 7" />
          <text x={M + 12} y={rowA.y + 15} fontSize="12" fill={INK}>Made on Country</text>
          <text x={M + 12} y={rowA.y + 28} fontSize="10" fill={FAINT}>facilities in community</text>
          {rows.map((r, i) => (
            <text key={r.year} x={cx(i)} y={rowA.y + 22} textAnchor="middle" fontSize="13" fill={INK}>
              {r.facilitiesOpen}
            </text>
          ))}
          <text x={W - R + 14} y={rowA.y + 22} fontSize="11" fill={FAINT}>0 today, built to transfer</text>

          <rect x={M} y={rowB.y} width={W - M * 2} height={rowB.h} fill="none" stroke={LINE} strokeWidth="2" strokeDasharray="7 7" />
          <text x={M + 12} y={rowB.y + 15} fontSize="12" fill={INK}>Members of the charity</text>
          <text x={M + 12} y={rowB.y + 28} fontSize="10" fill={FAINT}>organisations trading</text>
          {rows.map((r, i) => (
            <text key={r.year} x={cx(i)} y={rowB.y + 22} textAnchor="middle" fontSize="13" fill={INK}>
              {r.enterprisesTrading}
            </text>
          ))}
          <text x={W - R + 14} y={rowB.y + 22} fontSize="11" fill={FAINT}>proposed, with the board</text>

          <rect x={M} y={rowC.y} width={W - M * 2} height={rowC.h} fill={WASH} stroke={LINE} strokeWidth="2" />
          <text x={M + 12} y={rowC.y + 19} fontSize="12" fill={INK}>The enterprise</text>
          <text x={M + 12} y={rowC.y + 32} fontSize="10" fill={FAINT}>happens today</text>
          <text x={L} y={rowC.y + 19} fontSize="12" fill={MUTED}>
            Buyers pay the community organisation $750 a bed and it keeps the whole price.
          </text>
          <text x={L} y={rowC.y + 34} fontSize="12" fill={MUTED}>
            After costs it decides what comes next: more beds, paid local work, or something of its own.
          </text>

          <rect x={M} y={rowD.y} width={W - M * 2} height={rowD.h} fill={WASH} stroke={LINE} strokeWidth="2" />
          <text x={M + 12} y={rowD.y + 19} fontSize="12" fill={INK}>The board</text>
          <text x={M + 12} y={rowD.y + 32} fontSize="10" fill={FAINT}>in place today</text>
          <text x={L} y={rowD.y + 19} fontSize="12" fill={MUTED}>
            Three Indigenous directors hold the purpose, the assets and the decisions of Goods on Country Ltd, a DGR1 charity.
          </text>
          <text x={L} y={rowD.y + 34} fontSize="12" fill={MUTED}>
            Community partners keep their own boards and make the local decisions: how beds are used, who is paid, what is made next.
          </text>

          <text x={W / 2} y={H - 10} textAnchor="middle" fontSize="12" fill={FAINT}>
            Everything above rests on this. Two of the four are in place.
          </text>
        </svg>
      </div>

      <figcaption className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ color: MUTED }}>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-6" style={{ backgroundColor: WASH, border: `1.5px solid ${LINE}` }} />
          Goods on Country facility, {n(ASSUMPTIONS.mainFacilityYearOneBeds.value)} beds then {n(ASSUMPTIONS.mainFacilityBedsAYear.value)} a year
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-6" style={{ border: `1.5px dashed ${LINE}` }} />
          Community facilities, {n(ASSUMPTIONS.facilityFirstYearBeds.value)} in their first year then {n(ASSUMPTIONS.facilityMatureBeds.value)} a year each
        </span>
      </figcaption>

      <details className="mt-6">
        <summary className="cursor-pointer text-sm font-semibold" style={{ color: INK }}>The table, year by year</summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm" style={{ color: MUTED }}>
            <thead>
              <tr className="text-left" style={{ color: INK }}>
                <th className="py-1 pr-4 font-semibold">Year</th>
                <th className="py-1 pr-4 font-semibold">Facilities</th>
                <th className="py-1 pr-4 font-semibold">Beds</th>
                <th className="py-1 pr-4 font-semibold">In community</th>
                <th className="py-1 pr-4 font-semibold">Paid hours</th>
                <th className="py-1 pr-4 font-semibold">Tonnes</th>
                <th className="py-1 pr-4 font-semibold">Organisations</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.year} className="border-t tabular-nums" style={{ borderColor: RULE }}>
                  <td className="py-1 pr-4">{r.label}</td>
                  <td className="py-1 pr-4">{r.facilitiesOpen}</td>
                  <td className="py-1 pr-4">{n(r.bedsTotal)}</td>
                  <td className="py-1 pr-4">{n(r.bedsCommunity)}</td>
                  <td className="py-1 pr-4">{n(r.paidHours)}</td>
                  <td className="py-1 pr-4">{r.tonnesRecycled.toFixed(1)}</td>
                  <td className="py-1 pr-4">{r.enterprisesTrading}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
