'use client';
/**
 * MISSION CONTROL skin — SpaceX launch-console.
 *
 * Near-black, high-contrast, monospace tabular numerics as the hero. Thin rules,
 * uppercase micro-labels with tracking, signal green (positive contribution) /
 * red (negative), one electric-cyan accent on the primary readout, a model status dot.
 * INPUTS are a "key levers + advanced" layout (2026-05-29): the dials that move the
 * headline (volume, price, fair wage, Defy kit + the method/founder/location chips)
 * get big, grabbable full-width tracks; the remaining ~26 assumptions collapse into a
 * grouped, scrollable ADVANCED drawer. Big model OUTPUT telemetry on the right. Reads
 * the shared useCostModel() instance — numbers are LOCKED.
 */
import { useState } from 'react';
import type { UseCostModel } from '@/lib/cost-model/use-cost-model';
import {
  fmt, fmtCents, breakevenLabel,
  PRESETS, SLIDERS, LOCATIONS, METHOD_LABELS_SHORT, VERIFIED_HINTS,
  NET_CAPITAL_LOW, NET_CAPITAL_HIGH, VOLUME_GATE, CONTAINERISE_FREIGHT_DELTA,
  LEGS_SAVING_PER_BED, ALREADY_INVESTED, SHRED_FLOOR_PER_BED, POLYMER_FLOOR_PER_BED,
  STEEL_RAW_FLOOR_PER_BED, CANVAS_RAW_FLOOR_PER_BED, DEFAULTS,
  type Inputs, type BuildMethod, type Location, type SliderGroup,
} from '@/lib/cost-model/engine';

const ACCENT = '#22d3ee'; // electric cyan
const POS = '#34d399'; // signal green
const NEG = '#f87171'; // signal red

// Mission Control INPUTS = "key levers + advanced". These four dials get the big
// hero-slider treatment; every other SLIDER drops into the collapsible ADVANCED drawer.
const KEY_LEVER_KEYS: (keyof Inputs)[] = ['beds_per_year', 'retail_price', 'community_labour_per_bed', 'defy_kit_per_bed'];
const GROUP_ORDER: SliderGroup[] = ['Materials', 'Labour & throughput', 'Fixed block & volume', 'Market & capital'];
const ADVANCED_SLIDERS = SLIDERS.filter((s) => !KEY_LEVER_KEYS.includes(s.key));

function Label({ children }: { children: React.ReactNode }) {
  return <span className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{children}</span>;
}

export function MissionControlSkin({ cm }: { cm: UseCostModel }) {
  const { inputs, setInput, applyPreset, resetAll, model } = cm;
  const [advOpen, setAdvOpen] = useState(false);
  const contributionPos = model.contributionSelected >= 0;
  const annualContribution = model.contributionSelected * inputs.beds_per_year;
  const surplus = annualContribution - model.fixedBlock;
  const surplusPos = surplus >= 0;

  return (
    // FULL-SCREEN console: fills the viewport region handed down by the workspace
    // (h-full). Compact header + presets are fixed rows; the body is a two-pane
    // grid (inputs incl. ALL sliders | telemetry) that fills the rest — no doc scroll.
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-zinc-800 bg-[#0A0A0B] text-zinc-200 font-mono selection:bg-cyan-500/30">
      {/* ── Console header (compact) ── */}
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-4 py-1.5">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] uppercase tracking-[0.22em] text-emerald-400">MODEL</span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">GOODS · BED COST MODEL · MISSION CONTROL</span>
        </div>
        <button onClick={resetAll} className="text-[10px] uppercase tracking-[0.18em] text-zinc-500 hover:text-cyan-300 transition-colors">
          RESET → LOCKED
        </button>
      </div>

      {/* ── Scenario presets — segmented (compact) ── */}
      <div className="flex shrink-0 items-stretch border-b border-zinc-800">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => applyPreset(p)}
            title={p.hint}
            className="flex-1 border-r border-zinc-800 px-2.5 py-1 text-left transition-colors hover:bg-zinc-900"
          >
            <span className="block truncate text-[10px] uppercase tracking-[0.12em] text-zinc-300">{p.label}</span>
          </button>
        ))}
      </div>

      {/* Body — fills remaining height; inputs pane + telemetry pane */}
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,440px)_1fr]">
        {/* ════════ INPUTS ════════ */}
        <div className="flex min-h-0 flex-col border-b border-zinc-800 lg:border-b-0 lg:border-r">
          {/* ── KEY LEVERS — the dials that move the headline (big, no-scroll) ── */}
          <div className="shrink-0 space-y-2.5 border-b border-zinc-800 p-3">
            <div className="flex items-center justify-between">
              <Label>KEY LEVERS</Label>
              <span className="text-[9px] text-zinc-600">DRAG — HEADLINE RECOMPUTES</span>
            </div>

            <KeyLever
              label="VOLUME · BEDS / YR"
              display={inputs.beds_per_year.toLocaleString('en-AU')}
              value={inputs.beds_per_year} min={50} max={2000} step={10}
              onChange={(v) => setInput('beds_per_year', v)}
              hint={`TODAY ~100-150 · CAPEX GATE ~${VOLUME_GATE}/YR`}
            />

            <KeyLever
              label="PRICE · PER BED"
              display={fmt(inputs.retail_price)}
              value={inputs.retail_price} min={400} max={1500} step={25}
              onChange={(v) => setInput('retail_price', v)}
              hint="INSTITUTIONAL ~$801 · CENTRECORP ANCHOR $750"
            />

            {/* Build method — segmented (full-width 4-up) */}
            <div>
              <Label>BUILD METHOD</Label>
              <div className="mt-1 grid grid-cols-4 gap-px border border-zinc-800 bg-zinc-800">
                {(Object.keys(METHOD_LABELS_SHORT) as BuildMethod[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setInput('build_method', m)}
                    className={`px-1 py-1.5 text-[9px] uppercase tracking-[0.06em] transition-colors ${
                      inputs.build_method === m ? 'bg-cyan-500/15 text-cyan-300' : 'bg-[#0A0A0B] text-zinc-400 hover:bg-zinc-900'
                    }`}
                  >
                    {METHOD_LABELS_SHORT[m]}
                  </button>
                ))}
              </div>
            </div>

            <KeyLever
              label="COMMUNITY FAIR WAGE · $/BED"
              display={fmt(inputs.community_labour_per_bed)}
              value={inputs.community_labour_per_bed} min={100} max={160} step={5}
              onChange={(v) => setInput('community_labour_per_bed', v)}
              hint="v6 — DIGNIFIED PAID WORK · BAND $100-160"
            />

            <KeyLever
              label="DEFY KIT · $/BED"
              display={fmt(inputs.defy_kit_per_bed)}
              value={inputs.defy_kit_per_bed} min={200} max={500} step={5}
              onChange={(v) => setInput('defy_kit_per_bed', v)}
              hint={`20KG PLASTIC ~${fmt(POLYMER_FLOOR_PER_BED)} RAW INSIDE · ${model.idiotKitShred.toFixed(1)}× SHRED FLOOR`}
            />

            {/* Founder FTE + Containerise */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="flex items-baseline justify-between">
                  <Label>FOUNDER FTE</Label>
                  <span className="tabular-nums text-zinc-400 text-[10px]">{fmt(model.founderTotalCost)}/yr</span>
                </div>
                <div className="mt-1 grid grid-cols-4 gap-px border border-zinc-800 bg-zinc-800">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setInput('founder_fte_pct', pct)}
                      className={`py-1.5 text-[10px] tabular-nums transition-colors ${
                        inputs.founder_fte_pct === pct ? 'bg-cyan-500/15 text-cyan-300' : 'bg-[#0A0A0B] text-zinc-400 hover:bg-zinc-900'
                      }`}
                    >
                      {pct}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label>CONTAINERISE</Label>
                <button
                  onClick={() => setInput('containerise', !inputs.containerise)}
                  className={`mt-1 flex h-[calc(100%-16px)] w-full items-center justify-center border border-zinc-800 px-2 text-[10px] uppercase tracking-[0.1em] transition-colors hover:bg-zinc-900 ${inputs.containerise ? 'text-cyan-300' : 'text-zinc-600'}`}
                  title={`long-haul −${fmt(CONTAINERISE_FREIGHT_DELTA)}/bed`}
                >
                  {inputs.containerise ? `ON −${fmt(CONTAINERISE_FREIGHT_DELTA)}` : 'OFF'}
                </button>
              </div>
            </div>

            {/* Location — segmented (full-width 4-up) */}
            <div>
              <Label>LOCATION</Label>
              <div className="mt-1 grid grid-cols-4 gap-px border border-zinc-800 bg-zinc-800">
                {(Object.keys(LOCATIONS) as Location[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setInput('location', l)}
                    className={`px-1 py-1.5 text-[9px] uppercase tracking-[0.04em] transition-colors ${
                      inputs.location === l ? 'bg-cyan-500/15 text-cyan-300' : 'bg-[#0A0A0B] text-zinc-400 hover:bg-zinc-900'
                    }`}
                    title={`rent ${fmt(LOCATIONS[l].rentPerYear)}/yr · in-freight ${fmt(LOCATIONS[l].inboundFreightPerBed)}/bed`}
                  >
                    {LOCATIONS[l].label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── ADVANCED ASSUMPTIONS — collapsible, grouped, single-column, usable tracks ── */}
          <div className="flex min-h-0 flex-1 flex-col">
            <button
              onClick={() => setAdvOpen((o) => !o)}
              className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-3 py-2 text-left transition-colors hover:bg-zinc-900"
            >
              <span className="flex items-center gap-2">
                <span className="text-[11px] text-cyan-300">{advOpen ? '▾' : '▸'}</span>
                <Label>ADVANCED ASSUMPTIONS · {ADVANCED_SLIDERS.length}</Label>
              </span>
              <span className="text-[9px] uppercase tracking-[0.12em] text-zinc-600">{advOpen ? 'HIDE' : 'EXPAND ALL DIALS'}</span>
            </button>
            {advOpen ? (
              <div className="min-h-0 flex-1 space-y-3 overflow-auto p-3">
                {GROUP_ORDER.map((g) => {
                  const rows = ADVANCED_SLIDERS.filter((s) => s.group === g);
                  if (!rows.length) return null;
                  return (
                    <div key={g}>
                      <div className="mb-1 border-b border-zinc-900 pb-1"><Label>{g}</Label></div>
                      <div className="grid grid-cols-1">
                        {rows.map((s) => (
                          <SliderRow
                            key={s.key}
                            s={s}
                            val={inputs[s.key] as number}
                            isDefault={(inputs[s.key] as number) === DEFAULTS[s.key]}
                            onChange={(v) => setInput(s.key, v as Inputs[typeof s.key])}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 flex-col justify-between overflow-hidden px-3 py-3">
                <div className="space-y-2">
                  {GROUP_ORDER.map((g) => {
                    const n = ADVANCED_SLIDERS.filter((s) => s.group === g).length;
                    return (
                      <div key={g} className="flex items-baseline justify-between border-b border-zinc-900 pb-2">
                        <span className="text-[10px] uppercase tracking-[0.1em] text-zinc-500">{g}</span>
                        <span className="text-[10px] tabular-nums text-zinc-600">{n} dials</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[9px] leading-relaxed text-zinc-600">
                  The {KEY_LEVER_KEYS.length} key levers above move the headline. These {ADVANCED_SLIDERS.length} set the locked baseline — expand to fine-tune any; telemetry updates instantly.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ════════ OUTPUT TELEMETRY — distributes to fill the full viewport height ════════ */}
        <div className="flex min-h-0 flex-col gap-3 overflow-auto p-4">
          {/* Primary readouts — 4-up hero telemetry (big) */}
          <div className="grid shrink-0 grid-cols-2 xl:grid-cols-4 divide-x divide-zinc-800 border border-zinc-800">
            <div className="p-4">
              <Label>MARGINAL / BED</Label>
              <p className="mt-2 text-4xl font-semibold tabular-nums leading-none" style={{ color: ACCENT }}>{fmtCents(model.selectedMarginal)}</p>
              <p className="mt-2 text-[11px] text-zinc-500">
                KIT <span className="tabular-nums text-zinc-300">{fmtCents(model.marginalKit)}</span> → FACT{' '}
                <span className="tabular-nums" style={{ color: POS }}>{fmtCents(model.marginalFactory)}</span>
              </p>
              <p className="mt-1 text-[10px] text-zinc-600">CASH COST OF ONE MORE BED</p>
            </div>
            <div className="p-4">
              <Label>CONTRIB @ {fmt(inputs.retail_price)}</Label>
              <p className="mt-2 text-4xl font-semibold tabular-nums leading-none" style={{ color: contributionPos ? POS : NEG }}>
                {fmtCents(model.contributionSelected)}
              </p>
              <p className="mt-2 text-[11px] text-zinc-500">
                FACTORY <span className="tabular-nums" style={{ color: POS }}>{fmtCents(model.marginFactory)}</span>
              </p>
              <p className="mt-1 text-[10px] text-zinc-600">PRICE − MARGINAL · FUNDS FIXED</p>
            </div>
            <div className="p-4">
              <Label>BREAKEVEN /YR</Label>
              <p className="mt-2 text-4xl font-semibold tabular-nums leading-none text-amber-400">{breakevenLabel(model.breakevenSelected)}</p>
              <p className="mt-2 text-[11px] text-zinc-500">
                FACT <span className="tabular-nums">{breakevenLabel(model.breakevenFactory)}</span> · KIT{' '}
                <span className="tabular-nums">{breakevenLabel(model.breakevenKit)}</span>
              </p>
              <p className="mt-1 text-[10px] text-zinc-600">FIXED BLOCK ÷ CONTRIB</p>
            </div>
            <div className="p-4">
              <Label>CAPITAL PAYBACK</Label>
              <p className="mt-2 text-4xl font-semibold tabular-nums leading-none text-zinc-100">
                {model.belowVolumeGate ? '—' : `${model.paybackYearsLow.toFixed(1)}-${model.paybackYearsHigh.toFixed(1)}y`}
              </p>
              <p className="mt-2 text-[11px] text-zinc-500 tabular-nums">{fmt(model.capitalLow)}-{fmt(model.capitalHigh)} GROSS</p>
              <p className="mt-1 text-[10px] text-zinc-600 tabular-nums">~{fmt(NET_CAPITAL_LOW)}-{fmt(NET_CAPITAL_HIGH)} NET</p>
            </div>
          </div>

          {/* Secondary telemetry strip */}
          <div className="grid shrink-0 grid-cols-2 md:grid-cols-4 divide-x divide-zinc-800 border border-zinc-800 bg-zinc-950/40">
            <div className="p-3">
              <Label>ANNUAL FIXED BLOCK</Label>
              <p className="mt-1 text-xl tabular-nums text-zinc-100">{fmt(model.fixedBlock)}<span className="text-[10px] text-zinc-600">/yr</span></p>
              <p className="text-[10px] text-zinc-600">FUND IT — NOT A TAX</p>
            </div>
            <div className="p-3">
              <Label>ANNUAL CONTRIBUTION</Label>
              <p className="mt-1 text-xl tabular-nums" style={{ color: surplusPos ? POS : NEG }}>{fmt(annualContribution)}</p>
              <p className="text-[10px] text-zinc-600">{inputs.beds_per_year.toLocaleString('en-AU')} × CONTRIB</p>
            </div>
            <div className="p-3">
              <Label>SURPLUS / (SHORTFALL)</Label>
              <p className="mt-1 text-xl tabular-nums" style={{ color: surplusPos ? POS : NEG }}>{fmt(surplus)}</p>
              <p className="text-[10px] text-zinc-600">BEFORE GRANT OFFSET</p>
            </div>
            <div className="p-3">
              <Label>IN-HOUSE LEGS SAVING</Label>
              <p className="mt-1 text-xl tabular-nums" style={{ color: POS }}>{fmt(model.savingsPerBed)}</p>
              <p className="text-[10px] text-zinc-600">PER BED, IN-HOUSE PRESS</p>
            </div>
          </div>

          {/* Marginal cost by build path — keep a stable height so rows never collapse into each other. */}
          <div className="flex min-h-[250px] shrink-0 flex-col border border-zinc-800">
            <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 px-3 py-2">
              <Label>MARGINAL COST / BED · BY BUILD PATH</Label>
              <span className="text-[10px] tracking-wide text-zinc-600">
                GREY = MARGINAL · <span style={{ color: POS }}>GREEN</span> = CONTRIBUTION TO {fmt(inputs.retail_price)} PRICE
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-3 p-3">
              <SupplyPathBar label="KITS (TODAY)" marginal={model.marginalKit} contrib={model.marginKits} be={model.breakevenKit} price={inputs.retail_price} active={inputs.build_method === 'kits'} />
              <SupplyPathBar label="PANELS" marginal={model.marginalPanel} contrib={model.marginPanels} be={model.breakevenPanel} price={inputs.retail_price} active={inputs.build_method === 'panels'} />
              <SupplyPathBar label="FACTORY (IN-HOUSE)" marginal={model.marginalFactory} contrib={model.marginFactory} be={model.breakevenFactory} price={inputs.retail_price} active={inputs.build_method === 'factory'} highlight />
              <SupplyPathBar label="COMMUNITY-OWNED" marginal={model.marginalCommunity} contrib={model.marginCommunity} be={model.breakevenCommunity} price={inputs.retail_price} active={inputs.build_method === 'community'} />
            </div>
            <div className="shrink-0 border-t border-zinc-800 px-3 py-1.5 text-[10px] leading-snug text-zinc-600">
              MARGINAL-COST-FIRST · CONTRIBUTION FUNDS THE {fmt(model.fixedBlock)}/YR FIXED BLOCK · BREAKEVEN = FIXED ÷ CONTRIB
            </div>
          </div>

          {/* Idiot index + cost-down — compact, dense supporting strip */}
          <div className="grid shrink-0 grid-cols-1 gap-3 lg:grid-cols-2">
            <div className="border border-zinc-800 p-3">
              <Label>IDIOT INDEX · FINISHED ÷ RAW</Label>
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2">
                <IdiotReadout label={`KIT/SHRED ${fmt(SHRED_FLOOR_PER_BED)}`} ratio={model.idiotKitShred} raw={SHRED_FLOOR_PER_BED} current={inputs.defy_kit_per_bed} tone="amber" />
                <IdiotReadout label={`KIT/POLY ${fmt(POLYMER_FLOOR_PER_BED)}`} ratio={model.idiotKitPolymer} raw={POLYMER_FLOOR_PER_BED} current={inputs.defy_kit_per_bed} tone="red" />
                <IdiotReadout label="STEEL" ratio={model.idiotSteel} raw={STEEL_RAW_FLOOR_PER_BED} current={inputs.steel_per_bed} tone="dim" />
                <IdiotReadout label="CANVAS" ratio={model.idiotCanvas} raw={CANVAS_RAW_FLOOR_PER_BED} current={inputs.canvas_per_bed} tone="dim" />
              </div>
            </div>
            <div className="border border-zinc-800 p-3">
              <Label>COST-DOWN TRAJECTORY</Label>
              <div className="mt-2 grid grid-cols-2 gap-x-5 gap-y-2 text-[12px]">
                <CostDownRow label="BUY-KIT MARG" value={model.marginalKit} tone="dim" />
                <CostDownRow label="FACTORY MARG" value={model.marginalFactory} tone="pos" />
                <div className="flex items-center justify-between border-t border-zinc-800 pt-2">
                  <Label>Δ LEGS</Label>
                  <span className="tabular-nums" style={{ color: POS }}>−{fmt(model.savingsPerBed)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-zinc-800 pt-2">
                  <Label>VALUE MULT</Label>
                  <span className="tabular-nums" style={{ color: ACCENT }}>{model.valueVsCommercial.toFixed(1)}×</span>
                </div>
                <div className="col-span-2 flex items-center justify-between border-t border-zinc-800 pt-2">
                  <Label>COMMERCIAL COUNTERFACTUAL</Label>
                  <span className="tabular-nums text-zinc-400">{fmt(inputs.commercial_low)}–{fmt(inputs.commercial_high)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Plastic-gap narrative + guard + reference + provenance (footer — pinned to the bottom) */}
          <div className="shrink-0 space-y-1.5">
            {model.belowVolumeGate && (
              <div className="border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-[10px] text-amber-300">
                <span className="uppercase tracking-[0.12em]">⚠ CAPEX GUARD</span> — at {inputs.beds_per_year} beds/yr (below ~{VOLUME_GATE}/yr committed),
                buy Defy kits rather than build the factory. The {fmt(LEGS_SAVING_PER_BED)}/bed legs saving doesn&apos;t recoup{' '}
                {fmt(model.capitalLow)}-{fmt(model.capitalHigh)} of capex below committed volume.
              </div>
            )}
            <div className="border border-dashed border-zinc-700 bg-zinc-950/60 px-3 py-1.5 text-[10px] text-zinc-500">
              <span className="uppercase tracking-[0.12em] text-zinc-400">REFERENCE ONLY</span> — fully-loaded Buy-Kit at {inputs.beds_per_year}/yr ={' '}
              <span className="tabular-nums text-zinc-300">{fmt(model.fullKits)}</span>: fixed-cost absorption at pilot volume,{' '}
              <span className="text-zinc-400">NOT the marginal cost</span>. Falls to {fmt(model.marginalFactory)} marginal at scale.{' '}
              20KG OF PLASTIC ~{fmt(POLYMER_FLOOR_PER_BED)}-{fmt(SHRED_FLOOR_PER_BED)} RAW SITS INSIDE A {fmt(inputs.defy_kit_per_bed)} PART → THE IN-HOUSING CASE.
            </div>
            <p className="text-[9px] text-zinc-600 leading-snug">
              VERIFIED / MODELLED · NOT AUDITED. Sources: cost-model-scenarios.json (v5, founder $560/day) + 01-cost-model-idiot-index.json (v6) +
              supplier-quotes.ts. BOM from invoice OCR; overhead + counterfactual modelled. ~89% grant-funded. Net capital after {fmt(ALREADY_INVESTED)} invested.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** KEY-LEVER hero slider: label + current value on one row, a fat grabbable track below. */
function KeyLever({ label, display, value, min, max, step, onChange, hint }: {
  label: string; display: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; hint?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <Label>{label}</Label>
        <span className="tabular-nums text-sm text-cyan-300">{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="cm-key mt-2 w-full" style={{ accentColor: ACCENT }}
      />
      {hint && <p className="mt-1 text-[9px] text-zinc-600">{hint}</p>}
    </div>
  );
}

/** Compact ADVANCED-drawer slider row: NAME · usable track · VALUE (single column). */
function SliderRow({ s, val, isDefault, onChange }: {
  s: (typeof SLIDERS)[number]; val: number; isDefault: boolean; onChange: (v: number) => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_64px] items-center gap-2 py-1" title={VERIFIED_HINTS[s.key]}>
      <div className="flex items-center gap-2">
        <span className="w-[132px] shrink-0 truncate text-[9px] uppercase tracking-[0.04em] text-zinc-500">{s.label}</span>
        <input
          type="range" min={s.min} max={s.max} step={s.step} value={val}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="cm-srow min-w-0 flex-1" style={{ accentColor: ACCENT }}
        />
      </div>
      <span className={`text-right text-[10px] tabular-nums ${isDefault ? 'text-zinc-400' : 'text-cyan-300'}`}>
        {s.prefix === '$' ? fmt(val) : `${s.prefix || ''}${val}${s.suffix || ''}`}
      </span>
    </div>
  );
}

/** Horizontal supply-path bar: grey = marginal, green = contribution — together they sum to the sell price. */
function SupplyPathBar({ label, marginal, contrib, be, price, active, highlight }: {
  label: string; marginal: number; contrib: number; be: number; price: number; active?: boolean; highlight?: boolean;
}) {
  const marginalPct = Math.max(0, Math.min(100, (marginal / price) * 100));
  const contribPct = Math.max(0, Math.min(100 - marginalPct, (contrib / price) * 100));
  return (
    <div className={`flex min-h-[42px] flex-col justify-center gap-1.5 rounded px-2 py-1.5 transition-colors ${active ? 'bg-cyan-500/[0.07] ring-1 ring-cyan-500/30' : ''}`}>
      <div className="flex items-baseline justify-between gap-2">
        <span className={`text-[11px] uppercase tracking-[0.08em] ${highlight ? 'text-emerald-300' : active ? 'text-cyan-300' : 'text-zinc-300'}`}>
          {active && <span style={{ color: ACCENT }}>▸ </span>}{label}
        </span>
        <span className="tabular-nums text-[11px] text-zinc-500">
          marg <span className="text-zinc-200">{fmtCents(marginal)}</span> · contrib{' '}
          <span style={{ color: contrib >= 0 ? POS : NEG }}>{fmtCents(contrib)}</span> · BE{' '}
          <span className="text-amber-400">{breakevenLabel(be)}</span>
        </span>
      </div>
      <div className="relative h-4 w-full overflow-hidden rounded-sm bg-zinc-900 ring-1 ring-inset ring-zinc-800">
        <div className="absolute inset-y-0 left-0 bg-zinc-500" style={{ width: `${marginalPct}%` }} />
        <div className="absolute inset-y-0 bg-emerald-500/70" style={{ left: `${marginalPct}%`, width: `${contribPct}%` }} />
      </div>
    </div>
  );
}

function IdiotReadout({ label, ratio, raw, current, tone }: { label: string; ratio: number; raw: number; current: number; tone: 'amber' | 'red' | 'dim' }) {
  const color = tone === 'red' ? NEG : tone === 'amber' ? '#fbbf24' : '#a1a1aa';
  return (
    <div>
      <span className="block text-[10px] uppercase tracking-[0.08em] text-zinc-500">{label}</span>
      <span className="block text-3xl tabular-nums leading-tight" style={{ color }}>{ratio.toFixed(1)}×</span>
      <span className="block text-[10px] tabular-nums text-zinc-600">{fmt(raw)} → {fmt(current)}</span>
    </div>
  );
}

function CostDownRow({ label, value, tone }: { label: string; value: number; tone: 'dim' | 'pos' }) {
  return (
    <div className="flex items-center justify-between">
      <Label>{label}</Label>
      <span className="tabular-nums" style={{ color: tone === 'pos' ? POS : '#d4d4d8' }}>{fmtCents(value)}</span>
    </div>
  );
}
