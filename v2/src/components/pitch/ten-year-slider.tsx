'use client';

/**
 * The ten-year picture as something the reader can push on: how many facilities open a year,
 * one to three. Everything recomputes from ten-year-scale.ts, the same module the deck slide
 * S14b prints, so the numbers never drift from the slide. The claim ceiling stays printed
 * whatever the slider says.
 */

import { useId, useState } from 'react';
import { ASSUMPTIONS, CLAIM_CEILING, tenYearRows, tenYearTotals } from '@/lib/data/ten-year-scale';

export function TenYearSlider({ dark = false }: { dark?: boolean }) {
  const [aYear, setAYear] = useState<number>(ASSUMPTIONS.facilitiesAddedAYear.value);
  const id = useId();
  const rows = tenYearRows({ facilitiesAddedAYear: aYear });
  const totals = tenYearTotals({ facilitiesAddedAYear: aYear });
  const max = Math.max(...rows.map((r) => r.bedsTotal));
  const last = rows[rows.length - 1];
  const ink = dark ? 'text-goods-cream' : 'text-goods-ink';
  const soft = dark ? 'text-goods-cream/70' : 'text-[#5d574c]';

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <label htmlFor={id} className={`text-sm font-semibold ${ink}`}>
            Community facilities added a year, from year two
          </label>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            <input id={id} type="range" min={1} max={3} step={1} value={aYear} onChange={(e) => setAYear(Number(e.target.value))} className="h-9 w-full max-w-56 accent-goods-terracotta sm:w-56" aria-valuetext={`${aYear} a year`} />
            <span className={`font-display text-3xl font-semibold ${ink}`}>{aYear}</span>
            <span className={`text-sm ${soft}`}>{aYear === ASSUMPTIONS.facilitiesAddedAYear.value ? 'the deck\'s working assumption' : 'what if'}</span>
          </div>
        </div>
        <dl className="grid w-full grid-cols-3 gap-3 sm:w-auto sm:gap-6">
          {[
            { v: last.bedsTotal.toLocaleString('en-AU'), l: `beds in ${last.label}` },
            { v: totals.paidHours.toLocaleString('en-AU'), l: 'paid hours over ten years' },
            { v: `${Math.round(totals.tonnesRecycled).toLocaleString('en-AU')} t`, l: 'plastic kept out of landfill' },
          ].map((s) => (
            <div key={s.l}>
              <dt className={`font-display text-2xl font-semibold leading-none tabular-nums sm:text-3xl ${ink}`}>{s.v}</dt>
              <dd className={`mt-1 text-sm ${soft}`}>{s.l}</dd>
            </div>
          ))}
        </dl>
      </div>

      <figure className="m-0 mt-8">
        <div className="grid grid-cols-10 items-end gap-2 sm:gap-3" style={{ height: 240 }} role="img" aria-label={`Beds made each year, ${rows[0].label} ${rows[0].bedsTotal} to ${last.label} ${last.bedsTotal}, at ${aYear} new facilities a year.`}>
          {rows.map((r) => (
            <div key={r.year} className="flex h-full flex-col justify-end gap-[2px]">
              <div className="rounded-t-[3px] bg-[#8B9D77] transition-[height] duration-500 ease-out" style={{ height: `${(r.bedsCommunity / max) * 100}%` }} title={`${r.label}: ${r.bedsCommunity} community-made`} />
              <div className="bg-goods-terracotta transition-[height] duration-500 ease-out" style={{ height: `${(r.bedsMain / max) * 100}%` }} title={`${r.label}: ${r.bedsMain} from the Goods on Country facility`} />
            </div>
          ))}
        </div>
        <div className={`mt-2 grid grid-cols-10 gap-2 text-center text-[11px] sm:gap-3 sm:text-xs ${soft}`} aria-hidden="true">
          {rows.map((r) => (
            <span key={r.year}>{r.label}</span>
          ))}
        </div>
        <figcaption className={`mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm ${soft}`}>
          <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-6 rounded-sm bg-goods-terracotta" />Goods on Country facility, {ASSUMPTIONS.mainFacilityYearOneBeds.value} then {ASSUMPTIONS.mainFacilityBedsAYear.value} a year</span>
          <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-6 rounded-sm bg-[#8B9D77]" />Community facilities, {ASSUMPTIONS.facilityFirstYearBeds.value} in year one then {ASSUMPTIONS.facilityMatureBeds.value} a year each</span>
        </figcaption>
      </figure>

      <details className="mt-6">
        <summary className={`cursor-pointer text-sm font-semibold ${ink}`}>The table, year by year</summary>
        <div className="mt-3 overflow-x-auto">
          <table className={`w-full text-sm ${soft}`}>
            <thead>
              <tr className={`text-left ${ink}`}>
                <th className="py-1 pr-4 font-semibold">Year</th>
                <th className="py-1 pr-4 font-semibold">Facilities open</th>
                <th className="py-1 pr-4 font-semibold">Beds</th>
                <th className="py-1 pr-4 font-semibold">Paid hours</th>
                <th className="py-1 pr-4 font-semibold">Tonnes</th>
                <th className="py-1 pr-4 font-semibold">Enterprises</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.year} className="border-t border-current/10 tabular-nums">
                  <td className="py-1 pr-4">{r.label}</td>
                  <td className="py-1 pr-4">{r.facilitiesOpen}</td>
                  <td className="py-1 pr-4">{r.bedsTotal.toLocaleString('en-AU')}</td>
                  <td className="py-1 pr-4">{r.paidHours.toLocaleString('en-AU')}</td>
                  <td className="py-1 pr-4">{r.tonnesRecycled.toFixed(1)}</td>
                  <td className="py-1 pr-4">{r.enterprisesTrading}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <p className={`mt-6 max-w-3xl text-sm leading-relaxed ${soft}`}>{CLAIM_CEILING}</p>
    </div>
  );
}
