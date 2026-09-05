'use client';

/**
 * Any amount, the same ratio. A slider over `bed-ratio.scale()`: move it and the beds, pools,
 * plastic, hours and money-that-stays-local move with it. The four preset amounts are the ones the
 * deck shows; on the working copy the ask and the smaller amount are marked. Every label on the
 * four things comes from BED_UNIT.
 */
import { useState } from 'react';
import { BED_PRICE_AUD, BED_UNIT, POOL_BEDS, RATIO_NOTE, SCALE_AMOUNTS, scale } from '@/lib/data/bed-ratio';
import { QBE_ASK } from '@/lib/data/raise-stack';
import type { StoryAudience } from '@/lib/data/qbe-story';
import { SolidityChip } from './solidity-chip';

const aud = (n: number) => `$${Math.round(n).toLocaleString('en-AU')}`;
const num = (n: number, dp = 0) => n.toLocaleString('en-AU', { maximumFractionDigits: dp });

export function AmountExplorer({ audience }: { audience: StoryAudience }) {
  const [amount, setAmount] = useState<number>(audience === 'working' ? QBE_ASK.recommended.aud : 150_000);
  const row = scale(amount);
  const step = BED_PRICE_AUD * 10;
  const presetNote = (a: number) => {
    if (audience !== 'working') return a === 150_000 ? ' · one pool' : a === 750_000 ? ' · the thousand' : '';
    return a === QBE_ASK.recommended.aud ? ' · the ask' : a === QBE_ASK.smaller.aud ? ' · smaller' : '';
  };

  return (
    <div className="rounded-md border border-goods-grid bg-white p-5 md:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">Any amount, the same ratio</p>
          <p className="goods-pitch-display mt-1 text-3xl md:text-4xl">
            {aud(amount)} <span className="text-goods-sub">buys</span> {num(row.beds)} beds
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {SCALE_AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => setAmount(a)}
              className={`border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] ${
                amount === a ? 'border-goods-terracotta bg-goods-terracotta text-white' : 'border-goods-grid text-goods-ink hover:border-goods-terracotta'
              }`}
            >
              {aud(a)}
              {presetNote(a)}
            </button>
          ))}
        </div>
      </div>

      <label className="mt-6 block">
        <span className="sr-only">Amount</span>
        <input
          type="range"
          min={BED_PRICE_AUD * 100}
          max={750_000}
          step={step}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full accent-goods-terracotta"
        />
        <span className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-goods-sub">
          <span>{aud(BED_PRICE_AUD * 100)}</span>
          <span>one pool is {POOL_BEDS} beds</span>
          <span>{aud(750_000)}</span>
        </span>
      </label>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { unit: BED_UNIT[0], value: num(row.beds), sub: `people off the floor · ${num(row.pools, 1)} pools` },
          { unit: BED_UNIT[1], value: `${num(row.hdpeTonnes, 1)} t`, sub: 'recycled plastic kept in use' },
          { unit: BED_UNIT[2], value: `${num(row.localHours)} h`, sub: `of local work · about ${aud(row.fairWageAud)} in fair wages` },
          { unit: BED_UNIT[3], value: `up to ${aud(row.staysLocalIfAllSoldAud)}`, sub: 'stays local if every bed is sold' },
        ].map(({ unit, value, sub }) => (
          <div key={unit.title} className="border-t-2 border-goods-terracotta pt-3">
            <dt className="text-sm font-semibold">{unit.title}</dt>
            <dd className="goods-pitch-display mt-1 text-2xl">{value}</dd>
            <dd className="mt-1 text-xs text-goods-sub">{sub}</dd>
            <dd className="mt-2">
              <SolidityChip label={unit.label} />
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-xs leading-5 text-goods-sub">{RATIO_NOTE}</p>
    </div>
  );
}
