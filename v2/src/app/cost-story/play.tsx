'use client';

import { useState } from 'react';

// ─── Self-contained cost-model maths (v6, 2026-06) ──────────────────────────
// Deliberately NOT importing the engine — this widget owns its own arithmetic so
// the marketing page stays decoupled from the admin cost-model code. The numbers
// below are the LOCKED v6 figures (all AUD).

type Path = 'BUY' | 'MAKE';

const FIXED = 109_500; // annual fixed block: founder $16,800 + rent $27,000 + travel $51,000 + admin $14,700
const FREIGHT = 150; // long-haul freight per bed
const DIRECT_BUY = 534.79; // buy-kit path direct cost
const DIRECT_MAKE = 275.74; // in-house factory path direct cost

const fmt = (n: number) =>
  n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 });

const fmt2 = (n: number) =>
  n.toLocaleString('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function CostPlayground() {
  const [beds, setBeds] = useState(333);
  const [price, setPrice] = useState(750);
  const [path, setPath] = useState<Path>('MAKE');

  // ── exact maths required by the brief ──
  const direct = path === 'BUY' ? DIRECT_BUY : DIRECT_MAKE;
  const marginal = direct + FREIGHT;
  const fixed = FIXED;
  const contribution = price - marginal;
  const breakeven = contribution > 0 ? Math.round(fixed / contribution) : null;
  const fullyLoaded = marginal + fixed / beds;
  const surplus = contribution * beds - fixed;

  const inSurplus = surplus >= 0;

  const sentence =
    contribution <= 0
      ? `At ${fmt(price)} a bed, the ${path === 'BUY' ? 'buy-kit' : 'in-house'} path doesn't cover its own marginal cost of ${fmt2(marginal)} — every bed loses money before fixed costs.`
      : `${path === 'BUY' ? 'Buying kits' : 'Pressing our own legs'}, each ${fmt(price)} bed throws off ${fmt2(contribution)} toward the ${fmt(fixed)} fixed block. Break even at ${breakeven?.toLocaleString('en-AU')} beds a year; at ${beds.toLocaleString('en-AU')} beds you run a ${inSurplus ? 'surplus' : 'deficit'} of ${fmt(Math.abs(surplus))}.`;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-10">
      <p className="mb-1 text-xs uppercase tracking-[0.25em] text-accent">Play with the model</p>
      <h3
        className="mb-6 text-2xl font-light leading-snug text-foreground md:text-3xl"
        style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
      >
        Move the levers. Watch the bed pay for itself.
      </h3>

      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        {/* ── Controls ── */}
        <div className="space-y-7">
          {/* BUY / MAKE toggle */}
          <div>
            <span className="mb-2 block text-sm font-medium text-foreground">How we get the plastic legs</span>
            <div className="inline-flex rounded-full border border-border bg-muted/40 p-1">
              <button
                type="button"
                onClick={() => setPath('BUY')}
                aria-pressed={path === 'BUY'}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  path === 'BUY'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Buy the kit
              </button>
              <button
                type="button"
                onClick={() => setPath('MAKE')}
                aria-pressed={path === 'MAKE'}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  path === 'MAKE'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Press our own
              </button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {path === 'BUY'
                ? 'Today: buy a finished plastic-leg kit. Direct cost ' + fmt2(DIRECT_BUY) + '.'
                : 'Target: shred and press community plastic in-house. Direct cost ' + fmt2(DIRECT_MAKE) + '.'}
            </p>
          </div>

          {/* Beds per year */}
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <label htmlFor="beds" className="text-sm font-medium text-foreground">
                Beds per year
              </label>
              <span className="font-mono text-lg text-foreground">{beds.toLocaleString('en-AU')}</span>
            </div>
            <input
              id="beds"
              type="range"
              min={50}
              max={1500}
              step={1}
              value={beds}
              onChange={(e) => setBeds(Number(e.target.value))}
              className="w-full accent-[oklch(0.55_0.15_45)]"
            />
            <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
              <span>50</span>
              <span>1,500</span>
            </div>
          </div>

          {/* Sell price */}
          <div>
            <div className="mb-2 flex items-baseline justify-between">
              <label htmlFor="price" className="text-sm font-medium text-foreground">
                Sell price per bed
              </label>
              <span className="font-mono text-lg text-foreground">{fmt(price)}</span>
            </div>
            <input
              id="price"
              type="range"
              min={500}
              max={900}
              step={5}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full accent-[oklch(0.55_0.15_45)]"
            />
            <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
              <span>$500</span>
              <span>$900</span>
            </div>
          </div>
        </div>

        {/* ── Live readouts ── */}
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Readout label="Marginal cost / bed" value={fmt2(marginal)} sub="direct + freight" />
            <Readout
              label="Contribution / bed"
              value={fmt2(contribution)}
              sub={contribution > 0 ? 'toward fixed costs' : 'below water'}
              tone={contribution > 0 ? 'good' : 'bad'}
            />
            <Readout
              label="Break-even beds / yr"
              value={breakeven ? breakeven.toLocaleString('en-AU') : '—'}
              sub={breakeven ? `at ${fmt(price)}` : 'never at this price'}
              tone={breakeven ? 'neutral' : 'bad'}
            />
            <Readout
              label={inSurplus ? 'Annual surplus' : 'Annual deficit'}
              value={fmt(Math.abs(surplus))}
              sub={`at ${beds.toLocaleString('en-AU')} beds`}
              tone={inSurplus ? 'good' : 'bad'}
            />
          </div>

          <div className="rounded-2xl bg-muted/40 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Fully-loaded cost / bed</p>
            <p className="mt-1 font-mono text-2xl text-foreground">{fmt2(fullyLoaded)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              marginal {fmt2(marginal)} + {fmt(fixed)} fixed ÷ {beds.toLocaleString('en-AU')} beds. Fewer beds,
              scarier number — that&rsquo;s the $1,780 myth in action.
            </p>
          </div>

          <p
            className="border-l-4 pl-4 text-base italic leading-relaxed text-foreground/85"
            style={{ borderColor: 'var(--color-accent, #8B9D77)', fontFamily: 'Georgia, serif' }}
          >
            {sentence}
          </p>
        </div>
      </div>
    </div>
  );
}

function Readout({
  label,
  value,
  sub,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  sub: string;
  tone?: 'good' | 'bad' | 'neutral';
}) {
  const valueClass =
    tone === 'good'
      ? 'text-accent'
      : tone === 'bad'
        ? 'text-destructive'
        : 'text-foreground';
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
      <p className={`mt-1 font-mono text-xl md:text-2xl ${valueClass}`}>{value}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>
    </div>
  );
}
