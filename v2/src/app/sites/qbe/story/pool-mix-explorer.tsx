'use client';

/**
 * One pool, by how much of it is sold. A slider over `community-loop.poolScenario()`: the
 * community sets the mix, the gross sales move, and the bar shows how far that reaches into the
 * plant range. Beneath, what stays on the sold beds under the kit path and the pressed path, so the
 * difference the measured run is meant to prove is on the page.
 */
import { useState } from 'react';
import { BED_PRICE_AUD, FACILITY_BAND, POOL, SITE_FLOOR, STAYS_KIT_AUD, STAYS_PRESSED_AUD, poolScenario } from '@/lib/data/community-loop';
import { SolidityChip } from './solidity-chip';

const aud = (n: number) => `$${Math.round(n).toLocaleString('en-AU')}`;

export function PoolMixExplorer() {
  const [share, setShare] = useState(0.5);
  const s = poolScenario(share);
  const pct = Math.round(share * 100);
  const barMax = FACILITY_BAND.highAud;
  const salesW = Math.min(100, (s.grossSalesAud / barMax) * 100);
  const lowMark = (FACILITY_BAND.lowAud / barMax) * 100;

  return (
    <div className="rounded-md border border-goods-grid bg-white p-5 md:p-7">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">One pool of {POOL.beds} beds. The community sets the mix.</p>
      <p className="goods-pitch-display mt-1 text-3xl md:text-4xl">
        Sell {s.sold}, <span className="text-goods-sub">give</span> {s.given}
      </p>

      <label className="mt-6 block">
        <span className="sr-only">Share of the pool sold</span>
        <input type="range" min={0} max={100} step={5} value={pct} onChange={(e) => setShare(Number(e.target.value) / 100)} className="w-full accent-goods-terracotta" />
        <span className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-goods-sub">
          <span>all given</span>
          <span>{pct}% sold</span>
          <span>all sold, the ceiling</span>
        </span>
      </label>

      <div className="mt-6">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-semibold">Sales money that stays local</span>
          <span className="goods-pitch-display text-2xl">{aud(s.grossSalesAud)}</span>
        </div>
        <div className="relative mt-2 h-4 w-full rounded-full bg-goods-cream-muted">
          <div className="h-4 rounded-full bg-goods-terracotta" style={{ width: `${salesW}%` }} />
          <div className="absolute top-0 h-4 w-px bg-goods-ink" style={{ left: `${lowMark}%` }} />
          <span className="absolute -top-5 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.12em] text-goods-ink" style={{ left: `${lowMark}%` }}>
            plant from {aud(FACILITY_BAND.lowAud)}
          </span>
          <span className="absolute -top-5 right-0 font-mono text-[9px] uppercase tracking-[0.12em] text-goods-sub">to {aud(FACILITY_BAND.highAud)}</span>
        </div>
        <p className="mt-2 text-xs leading-5 text-goods-sub">
          Gross, at {aud(BED_PRICE_AUD)} a bed, before anything is deducted. Only sold beds create it. {Math.round(s.facilityLowCoverage * 100)}% of the bottom of the plant range,{' '}
          {Math.round(s.facilityHighCoverage * 100)}% of the top. {SITE_FLOOR.sentence}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="border-t-2 border-goods-grid pt-3">
          <p className="text-sm font-semibold">Kit path: what stays on the sold beds</p>
          <p className="goods-pitch-display mt-1 text-2xl">{aud(s.sold * STAYS_KIT_AUD)}</p>
          <p className="mt-1 text-xs text-goods-sub">about {aud(STAYS_KIT_AUD)} a bed after a bought-in kit</p>
          <div className="mt-2">
            <SolidityChip label="workpaper" />
          </div>
        </div>
        <div className="border-t-2 border-goods-terracotta pt-3">
          <p className="text-sm font-semibold">Pressed locally: what stays on the sold beds</p>
          <p className="goods-pitch-display mt-1 text-2xl">{aud(s.sold * STAYS_PRESSED_AUD)}</p>
          <p className="mt-1 text-xs text-goods-sub">about {aud(STAYS_PRESSED_AUD)} a bed with the legs pressed in community. The measured run proves it.</p>
          <div className="mt-2">
            <SolidityChip label="modelled" />
          </div>
        </div>
      </div>
    </div>
  );
}
