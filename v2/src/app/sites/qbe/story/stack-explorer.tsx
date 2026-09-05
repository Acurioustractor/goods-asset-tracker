'use client';

/**
 * Who pays for the thousand beds. Every line from `raise-stack.ts` with its status, a switch to
 * include or leave it out, and the QBE tier to pick. The bar shows beds covered against the
 * thousand. Nothing signed is stated first because it is the standing fact.
 */
import { useMemo, useState } from 'react';
import { PROGRAM, QBE_ASK, SIGNED_TOTAL_AUD, STACK, UNVERIFIED_LINE_IDS, bedsFunded, type StackLine } from '@/lib/data/raise-stack';
import { SolidityChip } from './solidity-chip';

const aud = (n: number) => `$${Math.round(n).toLocaleString('en-AU')}`;
const statusWord = (s: StackLine['status']) => (s === 'ask-made' ? 'ask made' : s);

export function StackExplorer() {
  const lines = useMemo(() => STACK.filter((l) => (l.job === 'pool' || l.job === 'demand') && l.status !== 'excluded'), []);
  const [on, setOn] = useState<Record<string, boolean>>(() => Object.fromEntries(lines.map((l) => [l.id, !UNVERIFIED_LINE_IDS.includes(l.id)])));
  const [tier, setTier] = useState<'recommended' | 'smaller'>('recommended');

  const beds = lines.reduce((sum, l) => {
    if (!on[l.id]) return sum;
    if (l.id === 'qbe') return sum + QBE_ASK[tier].beds;
    return sum + bedsFunded(l);
  }, 0);
  const covered = Math.min(beds, PROGRAM.beds);
  const shortfall = Math.max(0, PROGRAM.beds - beds);

  return (
    <div className="rounded-md border border-goods-grid bg-white p-5 md:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-goods-terracotta">Who pays for the thousand beds</p>
          <p className="goods-pitch-display mt-1 text-3xl md:text-4xl">
            {beds.toLocaleString('en-AU')} <span className="text-goods-sub">of</span> {PROGRAM.beds.toLocaleString('en-AU')} beds
          </p>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-goods-ink">
          {aud(SIGNED_TOTAL_AUD)} signed today
        </p>
      </div>

      <div className="relative mt-5 h-4 w-full rounded-full bg-goods-cream-muted">
        <div className="h-4 rounded-full bg-goods-terracotta" style={{ width: `${(covered / PROGRAM.beds) * 100}%` }} />
        {[1, 2, 3, 4].map((p) => (
          <div key={p} className="absolute top-0 h-4 w-px bg-white/80" style={{ left: `${(p / PROGRAM.pools) * 100}%` }} />
        ))}
      </div>
      <p className="mt-2 text-xs text-goods-sub">
        {shortfall > 0 ? `${shortfall.toLocaleString('en-AU')} beds still unfunded with these lines in.` : `The thousand is covered, with ${(beds - PROGRAM.beds).toLocaleString('en-AU')} beds to spare.`} Five pools of {PROGRAM.bedsPerPool}.
      </p>

      <ul className="mt-6 divide-y divide-goods-grid">
        {lines.map((l) => {
          const unverified = UNVERIFIED_LINE_IDS.includes(l.id);
          const lineBeds = l.id === 'qbe' ? QBE_ASK[tier].beds : bedsFunded(l);
          const amount = l.id === 'qbe' ? QBE_ASK[tier].aud : (l.amountAud ?? 0);
          return (
            <li key={l.id} className={`flex flex-wrap items-center gap-x-4 gap-y-2 py-3 ${unverified ? 'opacity-60' : ''}`}>
              <label className="flex min-w-0 flex-1 items-center gap-3">
                <input type="checkbox" checked={Boolean(on[l.id])} disabled={unverified} onChange={(e) => setOn({ ...on, [l.id]: e.target.checked })} className="h-4 w-4 accent-goods-terracotta" />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{l.funder}</span>
                  <span className="block text-xs text-goods-sub">{unverified ? 'On Ben\'s note with no second source. Not summed.' : l.job === 'demand' ? 'A purchase, paid. Demand proof, not a commitment.' : 'Buys beds at the same ratio.'}</span>
                </span>
              </label>
              {l.id === 'qbe' && (
                <span className="flex gap-1">
                  {(['recommended', 'smaller'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTier(t)}
                      className={`border px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] ${tier === t ? 'border-goods-terracotta bg-goods-terracotta text-white' : 'border-goods-grid'}`}
                    >
                      {aud(QBE_ASK[t].aud)}
                    </button>
                  ))}
                </span>
              )}
              <span className="w-24 text-right text-sm font-semibold">{aud(amount)}</span>
              <span className="w-20 text-right font-mono text-[11px] text-goods-sub">{lineBeds} beds</span>
              <span className="w-24 text-right">
                <SolidityChip label={statusWord(l.status)} />
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-xs leading-5 text-goods-sub">{QBE_ASK.framing}</p>
    </div>
  );
}
