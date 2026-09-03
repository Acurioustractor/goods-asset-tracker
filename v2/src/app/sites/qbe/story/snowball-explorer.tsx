'use client';

/**
 * Where it goes if it works. Plants, beds a week, and which margin figure to use: the one Ben says
 * out loud or the one the model carries. Every output is a target, and the honesty line is pinned.
 */
import { useState } from 'react';
import { SNOWBALL } from '@/lib/data/qbe-story';
import { HDPE_KG_PER_BED } from '@/lib/data/bed-ratio';
import { SolidityChip } from './solidity-chip';

const aud = (n: number) => `$${Math.round(n).toLocaleString('en-AU')}`;
const num = (n: number, dp = 0) => n.toLocaleString('en-AU', { maximumFractionDigits: dp });

export function SnowballExplorer() {
  const [plants, setPlants] = useState<number>(SNOWBALL.plants);
  const [perWeek, setPerWeek] = useState<number>(SNOWBALL.bedsPerWeekPerPlant);
  const [margin, setMargin] = useState<'prose' | 'model'>('prose');
  const perBed = margin === 'prose' ? SNOWBALL.marginPerBedProseAud : SNOWBALL.marginPerBedModelAud;
  const bedsYear = plants * perWeek * SNOWBALL.weeksPerYear;
  const marginYear = bedsYear * perBed;
  const tonnes = (bedsYear * HDPE_KG_PER_BED) / 1000;

  return (
    <div className="rounded-md border border-goods-grid bg-white p-5 md:p-7">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">Where it goes if it works</p>
      <p className="goods-pitch-display mt-1 text-3xl md:text-4xl">
        {plants} {plants === 1 ? 'plant' : 'plants'}, {perWeek} beds a week each
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold">Plants running</span>
          <input type="range" min={1} max={5} step={1} value={plants} onChange={(e) => setPlants(Number(e.target.value))} className="mt-2 w-full accent-goods-terracotta" />
          <span className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-goods-sub">
            <span>one</span>
            <span>five, one per pool</span>
          </span>
        </label>
        <label className="block">
          <span className="text-sm font-semibold">Beds a week at each plant</span>
          <input type="range" min={5} max={20} step={1} value={perWeek} onChange={(e) => setPerWeek(Number(e.target.value))} className="mt-2 w-full accent-goods-terracotta" />
          <span className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-goods-sub">
            <span>five</span>
            <span>twenty, as Ben says it</span>
          </span>
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold">Margin on a bed pressed locally</span>
        {(
          [
            ['prose', `${aud(SNOWBALL.marginPerBedProseAud)}, what we say out loud`],
            ['model', `${aud(SNOWBALL.marginPerBedModelAud)}, what the model says`],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setMargin(k)}
            className={`border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] ${
              margin === k ? 'border-goods-terracotta bg-goods-terracotta text-white' : 'border-goods-grid text-goods-ink hover:border-goods-terracotta'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="border-t-2 border-goods-terracotta pt-3">
          <dt className="text-sm font-semibold">Beds a year</dt>
          <dd className="goods-pitch-display mt-1 text-2xl">about {num(bedsYear)}</dd>
          <dd className="mt-1 text-xs text-goods-sub">
            {plants} × {perWeek} × {SNOWBALL.weeksPerYear} weeks
          </dd>
        </div>
        <div className="border-t-2 border-goods-terracotta pt-3">
          <dt className="text-sm font-semibold">Margin a year, reinvested by communities</dt>
          <dd className="goods-pitch-display mt-1 text-2xl">around {aud(marginYear)}</dd>
          <dd className="mt-1 text-xs text-goods-sub">at about {aud(perBed)} a bed. Nobody has measured it.</dd>
        </div>
        <div className="border-t-2 border-goods-terracotta pt-3">
          <dt className="text-sm font-semibold">Plastic kept in use a year</dt>
          <dd className="goods-pitch-display mt-1 text-2xl">about {num(tonnes)} t</dd>
          <dd className="mt-1 text-xs text-goods-sub">at {HDPE_KG_PER_BED}kg a bed</dd>
        </div>
      </dl>
      <div className="mt-4 flex items-start gap-3">
        <SolidityChip label="target" />
        <p className="text-xs leading-5 text-goods-sub">{SNOWBALL.honesty}</p>
      </div>
    </div>
  );
}
