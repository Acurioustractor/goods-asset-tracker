'use client';
/**
 * TESLA skin — dark, elegant, spacious.
 *
 * One giant hero number (marginal/bed today → in-sourced), generous whitespace,
 * refined type, smooth segmented controls + sliders, calm / premium / minimal,
 * soft transitions. Same locked data as the other skins, presented airy. Reads
 * the shared useCostModel() instance.
 */
import type { UseCostModel } from '@/lib/cost-model/use-cost-model';
import {
  fmt, fmtCents, breakevenLabel,
  PRESETS, SLIDERS, LOCATIONS, METHOD_LABELS, VERIFIED_HINTS,
  NET_CAPITAL_LOW, NET_CAPITAL_HIGH, VOLUME_GATE, CONTAINERISE_FREIGHT_DELTA,
  LEGS_SAVING_PER_BED, ALREADY_INVESTED, SHRED_FLOOR_PER_BED, POLYMER_FLOOR_PER_BED,
  DEFAULTS,
  type Inputs, type BuildMethod, type Location,
} from '@/lib/cost-model/engine';

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-500">{children}</p>;
}

function Segmented<T extends string | number>({ options, value, onChange, getLabel }: {
  options: T[]; value: T; onChange: (v: T) => void; getLabel: (v: T) => string;
}) {
  return (
    <div className="inline-flex rounded-full bg-zinc-900/80 p-1 ring-1 ring-white/10">
      {options.map((o) => (
        <button
          key={String(o)}
          onClick={() => onChange(o)}
          className={`rounded-full px-4 py-1.5 text-[13px] transition-all duration-300 ${
            value === o ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400 hover:text-zinc-100'
          }`}
        >
          {getLabel(o)}
        </button>
      ))}
    </div>
  );
}

export function TeslaSkin({ cm }: { cm: UseCostModel }) {
  const { inputs, setInput, applyPreset, resetAll, model } = cm;
  const surplus = model.contributionSelected * inputs.beds_per_year - model.fixedBlock;
  const surplusPos = surplus >= 0;

  return (
    // FULL-SCREEN, elegant. Fills the viewport region (h-full). A calm header,
    // then a two-pane split: the narrative/story on the left (hero + metrics +
    // paths + capital), and a single controls rail on the right that shows the
    // prominent dials AND every assumption slider — all on one screen.
    <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-gradient-to-b from-[#161618] to-[#0c0c0d] text-zinc-100 ring-1 ring-white/10 selection:bg-white/20">
      {/* Header (compact, fixed) */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 px-6 py-2.5 md:px-8">
        <div className="flex items-baseline gap-3">
          <Eyebrow>Goods · Bed Cost Model</Eyebrow>
          <h2 className="text-base font-light tracking-tight text-zinc-300">The cost of one more bed</h2>
        </div>
        <Segmented
          options={PRESETS.map((p) => p.key)}
          value={
            PRESETS.find((p) =>
              Object.entries(p.values).every(([k, v]) => (inputs as unknown as Record<string, unknown>)[k] === v),
            )?.key ?? ''
          }
          onChange={(key) => { const p = PRESETS.find((x) => x.key === key); if (p) applyPreset(p); }}
          getLabel={(key) => PRESETS.find((p) => p.key === key)?.label.replace(/\s*\(.*\)/, '') ?? 'Custom'}
        />
      </div>

      {/* Body — two panes filling the remaining height */}
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_minmax(0,400px)]">
        {/* ════════ LEFT — the story (scrolls if a short laptop needs it) ════════ */}
        <div className="min-h-0 space-y-6 overflow-auto px-6 py-5 md:px-10 lg:border-r lg:border-white/10">
          {/* Hero */}
          <div className="text-center">
            <Eyebrow>Marginal cost / bed · {METHOD_LABELS[inputs.build_method]}</Eyebrow>
            <p className="mt-2 text-6xl font-extralight tracking-tighter tabular-nums text-white leading-none xl:text-7xl">
              {fmtCents(model.selectedMarginal)}
            </p>
            <p className="mt-3 text-base font-light text-zinc-400">
              <span className="tabular-nums text-zinc-300">{fmtCents(model.marginalKit)}</span> buy-kit today
              <span className="mx-2.5 text-zinc-600">→</span>
              <span className="tabular-nums text-emerald-400">{fmtCents(model.marginalFactory)}</span> in-sourced factory
            </p>
            <p className="mt-1 text-xs text-zinc-600">The cash cost of building one more bed — direct cost plus long-haul freight.</p>
          </div>

          {/* Three calm metrics */}
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/[0.06] sm:grid-cols-3">
            <HeroStat
              eyebrow="Contribution @ price"
              value={fmtCents(model.contributionSelected)}
              tone={model.contributionSelected >= 0 ? 'pos' : 'neg'}
              sub={`Each bed at ${fmt(inputs.retail_price)} funds the fixed block`}
            />
            <HeroStat
              eyebrow="Breakeven beds / year"
              value={breakevenLabel(model.breakevenSelected)}
              tone="amber"
              sub={`Factory ${breakevenLabel(model.breakevenFactory)} · Buy-kit ${breakevenLabel(model.breakevenKit)}`}
            />
            <HeroStat
              eyebrow="Annual fixed block"
              value={fmt(model.fixedBlock)}
              tone="neutral"
              sub="A block to fund, not a per-bed tax"
            />
          </div>

          {/* Supply paths */}
          <div>
            <Eyebrow>Four supply paths</Eyebrow>
            <div className="mt-2 overflow-hidden rounded-2xl ring-1 ring-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/[0.03] text-zinc-500">
                    <th className="px-4 py-2 text-left font-light text-[11px] uppercase tracking-wider">Path</th>
                    <th className="px-4 py-2 text-right font-light text-[11px] uppercase tracking-wider">Marginal / bed</th>
                    <th className="px-4 py-2 text-right font-light text-[11px] uppercase tracking-wider">Contribution @ {fmt(inputs.retail_price)}</th>
                    <th className="px-4 py-2 text-right font-light text-[11px] uppercase tracking-wider">Breakeven</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 tabular-nums font-light">
                  <TeslaRow label="Defy Kits — today" marginal={model.marginalKit} contrib={model.marginKits} be={model.breakevenKit} active={inputs.build_method === 'kits'} />
                  <TeslaRow label="Defy Panels" marginal={model.marginalPanel} contrib={model.marginPanels} be={model.breakevenPanel} active={inputs.build_method === 'panels'} />
                  <TeslaRow label="Factory — in-house target" marginal={model.marginalFactory} contrib={model.marginFactory} be={model.breakevenFactory} active={inputs.build_method === 'factory'} highlight />
                  <TeslaRow label="Community — owned, fair-wage parity" marginal={model.marginalCommunity} contrib={model.marginCommunity} be={model.breakevenCommunity} active={inputs.build_method === 'community'} />
                </tbody>
              </table>
            </div>
          </div>

          {/* Capital + idiot index */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div>
              <Eyebrow>Capital ask & payback</Eyebrow>
              <p className="mt-2 text-4xl font-extralight tabular-nums text-white">
                {model.belowVolumeGate ? '—' : `${model.paybackYearsLow.toFixed(1)}–${model.paybackYearsHigh.toFixed(1)}`}
                {!model.belowVolumeGate && <span className="ml-2 text-lg text-zinc-500">years</span>}
              </p>
              <p className="mt-2 text-xs font-light text-zinc-400">
                {fmt(model.capitalLow)}–{fmt(model.capitalHigh)} gross · ~{fmt(NET_CAPITAL_LOW)}–{fmt(NET_CAPITAL_HIGH)} net after {fmt(ALREADY_INVESTED)} invested.
              </p>
              <p className="mt-2 text-xs font-light leading-relaxed text-zinc-400">
                Press the legs in-house and marginal cost falls {fmt(model.marginalKit)} → {fmt(model.marginalFactory)} — a{' '}
                <span className="text-emerald-400">{fmt(model.savingsPerBed)}/bed</span> saving.{' '}
                {model.belowVolumeGate
                  ? `At ${inputs.beds_per_year}/yr it does not pay back — capex only sensible above ~${VOLUME_GATE}/yr committed.`
                  : `At ${inputs.beds_per_year.toLocaleString('en-AU')}/yr it pays back, then every future bed delivers ${fmt(model.savingsPerBed)} more to community.`}
              </p>
            </div>

            <div>
              <Eyebrow>Idiot index — finished ÷ raw</Eyebrow>
              <div className="mt-2 flex items-end gap-8">
                <div>
                  <p className="text-4xl font-extralight tabular-nums text-amber-400">{model.idiotKitShred.toFixed(1)}×</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">vs shred floor {fmt(SHRED_FLOOR_PER_BED)}/bed</p>
                </div>
                <div>
                  <p className="text-4xl font-extralight tabular-nums text-red-400">{model.idiotKitPolymer.toFixed(1)}×</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">vs polymer floor {fmt(POLYMER_FLOOR_PER_BED)}/bed</p>
                </div>
              </div>
              <p className="mt-2 text-xs font-light leading-relaxed text-zinc-400">
                20kg of plastic worth ~{fmt(POLYMER_FLOOR_PER_BED)}–{fmt(SHRED_FLOOR_PER_BED)} of raw material sits inside a {fmt(inputs.defy_kit_per_bed)} kit part. That gap, times volume, is the in-housing case.
              </p>
            </div>
          </div>

          {/* Capex guard + demoted reference (inline, compact) */}
          {model.belowVolumeGate && (
            <div className="rounded-2xl bg-amber-500/[0.08] px-5 py-2.5 text-xs font-light text-amber-300 ring-1 ring-amber-500/20">
              Capital only sensible above ~{VOLUME_GATE}/yr committed — at {inputs.beds_per_year} beds/yr, buy Defy kits rather than build the factory.
            </div>
          )}
          <div className="rounded-2xl border border-dashed border-white/10 px-5 py-2.5 text-[11px] font-light text-zinc-500">
            <span className="text-zinc-400">Reference only:</span> fully-loaded buy-kit at {inputs.beds_per_year}/yr ={' '}
            <span className="tabular-nums text-zinc-300">{fmt(model.fullKits)}</span> — fixed-cost absorption at pilot volume, not a marginal cost. Falls to {fmt(model.marginalFactory)} marginal at scale.
          </div>
          <p className="text-[11px] font-light text-zinc-600 leading-relaxed">
            Verified / modelled · not audited. Sources: cost-model-scenarios.json (v5, founder $560/day), 01-cost-model-idiot-index.json (v6), supplier-quotes.ts. BOM from invoice OCR; overhead and counterfactual modelled. ~89% grant-funded.
          </p>
        </div>

        {/* ════════ RIGHT — controls rail (prominent dials + ALL sliders, scrolls) ════════ */}
        <div className="flex min-h-0 flex-col bg-white/[0.015]">
          {/* Prominent controls (fixed) */}
          <div className="shrink-0 space-y-3 border-b border-white/10 px-5 py-4">
            <div>
              <div className="flex items-baseline justify-between">
                <Eyebrow>Volume</Eyebrow>
                <span className="text-xl font-light tabular-nums text-zinc-100">{inputs.beds_per_year.toLocaleString('en-AU')}<span className="ml-1 text-xs text-zinc-500">beds/yr</span></span>
              </div>
              <input
                type="range" min={50} max={2000} step={10}
                value={inputs.beds_per_year}
                onChange={(e) => setInput('beds_per_year', parseFloat(e.target.value))}
                className="tesla-range mt-2 w-full"
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Segmented
                options={Object.keys(METHOD_LABELS) as BuildMethod[]}
                value={inputs.build_method}
                onChange={(m) => setInput('build_method', m)}
                getLabel={(m) => METHOD_LABELS[m].replace(/\s*\(.*\)/, '')}
              />
              <Segmented
                options={[25, 50, 75, 100]}
                value={inputs.founder_fte_pct}
                onChange={(p) => setInput('founder_fte_pct', p)}
                getLabel={(p) => `${p}%`}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Segmented
                options={Object.keys(LOCATIONS) as Location[]}
                value={inputs.location}
                onChange={(l) => setInput('location', l)}
                getLabel={(l) => LOCATIONS[l].label.replace(/\s*\(.*\)/, '').replace(' / Defy', '')}
              />
              <button
                onClick={() => setInput('containerise', !inputs.containerise)}
                className="flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5 ring-1 ring-white/10 transition-colors hover:bg-white/[0.07]"
                title={`Ship the plant once, not every bed — long-haul −${fmt(CONTAINERISE_FREIGHT_DELTA)}/bed`}
              >
                <span className="text-[12px] text-zinc-300">Containerise</span>
                <span className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${inputs.containerise ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${inputs.containerise ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </span>
              </button>
            </div>

            <p className="text-[11px] font-light leading-relaxed text-zinc-500">
              At {inputs.beds_per_year.toLocaleString('en-AU')} beds/yr, {fmt(model.contributionSelected)}/bed delivers{' '}
              <span className="tabular-nums text-zinc-300">{fmt(model.contributionSelected * inputs.beds_per_year)}</span> against the {fmt(model.fixedBlock)}/yr fixed block —{' '}
              <span className={`tabular-nums ${surplusPos ? 'text-emerald-400' : 'text-red-400'}`}>{fmt(surplus)} {surplusPos ? 'surplus' : 'shortfall'}</span> before grant offset.
            </p>
          </div>

          {/* ALL assumptions — always visible, airy-but-compact, scrolls */}
          <div className="min-h-0 flex-1 overflow-auto px-5 py-3">
            <div className="mb-2 flex items-center justify-between">
              <Eyebrow>All assumptions · {SLIDERS.length}</Eyebrow>
              <button onClick={resetAll} className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-200">Reset</button>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
              {SLIDERS.map((s) => {
                const val = inputs[s.key] as number;
                const isDefault = val === DEFAULTS[s.key];
                return (
                  <div key={s.key} title={VERIFIED_HINTS[s.key]}>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[11px] text-zinc-400">{s.label}</span>
                      <span className={`shrink-0 text-[12px] tabular-nums font-light ${isDefault ? 'text-zinc-400' : 'text-white'}`}>
                        {s.prefix === '$' ? fmt(val) : `${s.prefix || ''}${val}${s.suffix || ''}`}
                      </span>
                    </div>
                    <input
                      type="range" min={s.min} max={s.max} step={s.step} value={val}
                      onChange={(e) => setInput(s.key, parseFloat(e.target.value) as Inputs[typeof s.key])}
                      className="tesla-range mt-1 w-full"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroStat({ eyebrow, value, sub, tone }: { eyebrow: string; value: string; sub: string; tone: 'pos' | 'neg' | 'amber' | 'neutral' }) {
  const color = tone === 'pos' ? 'text-emerald-400' : tone === 'neg' ? 'text-red-400' : tone === 'amber' ? 'text-amber-400' : 'text-zinc-100';
  return (
    <div className="bg-[#0e0e10] p-8">
      <Eyebrow>{eyebrow}</Eyebrow>
      <p className={`mt-3 text-4xl font-extralight tabular-nums ${color}`}>{value}</p>
      <p className="mt-2 text-xs font-light text-zinc-500">{sub}</p>
    </div>
  );
}

function TeslaRow({ label, marginal, contrib, be, active, highlight }: {
  label: string; marginal: number; contrib: number; be: number; active?: boolean; highlight?: boolean;
}) {
  return (
    <tr className={active ? 'bg-white/[0.05]' : ''}>
      <td className={`px-5 py-4 ${highlight ? 'text-emerald-400' : 'text-zinc-200'}`}>{label}</td>
      <td className="px-5 py-4 text-right text-zinc-100">{fmtCents(marginal)}</td>
      <td className={`px-5 py-4 text-right ${contrib >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{fmtCents(contrib)}</td>
      <td className={`px-5 py-4 text-right ${highlight ? 'text-emerald-400' : 'text-amber-400'}`}>{breakevenLabel(be)}</td>
    </tr>
  );
}
