'use client';
/**
 * TERMINAL skin — Bloomberg / flight-console.
 *
 * Hyper-dense monospace grid, thin/dotted rules + dotted leaders, a status header
 * line (METHOD= VOL= LOC= FTE=), data tables for the four build paths plus the
 * marginal / fixed / breakeven block. Maximum signal per pixel, zero decoration.
 * Reads the shared useCostModel() instance — numbers are LOCKED.
 */
import type { UseCostModel } from '@/lib/cost-model/use-cost-model';
import {
  fmt, fmtCents, breakevenLabel,
  PRESETS, SLIDERS, LOCATIONS, METHOD_LABELS_SHORT, VERIFIED_HINTS,
  NET_CAPITAL_LOW, NET_CAPITAL_HIGH, VOLUME_GATE, CONTAINERISE_FREIGHT_DELTA,
  LEGS_SAVING_PER_BED, ALREADY_INVESTED, SHRED_FLOOR_PER_BED, POLYMER_FLOOR_PER_BED,
  STEEL_RAW_FLOOR_PER_BED, CANVAS_RAW_FLOOR_PER_BED, DEFAULTS,
  type Inputs, type BuildMethod, type Location,
} from '@/lib/cost-model/engine';

const GREEN = '#4ade80';
const RED = '#f87171';
const AMBER = '#fbbf24';
const CYAN = '#67e8f9';

/** A dotted-leader line: label .......... value */
function Leader({ k, v, vColor, strong }: { k: string; v: string; vColor?: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline gap-1 leading-[1.55]">
      <span className={`shrink-0 ${strong ? 'text-zinc-200' : 'text-zinc-500'}`}>{k}</span>
      <span className="min-w-0 flex-1 translate-y-[-2px] border-b border-dotted border-zinc-700/70" />
      <span className="shrink-0 tabular-nums" style={{ color: vColor ?? '#e4e4e7' }}>{v}</span>
    </div>
  );
}

function Bar({ title, right }: { title: string; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-2 py-1">
      <span className="text-[10px] uppercase tracking-[0.16em] text-cyan-300/80">{title}</span>
      {right}
    </div>
  );
}

export function TerminalSkin({ cm }: { cm: UseCostModel }) {
  const { inputs, setInput, applyPreset, resetAll, model } = cm;
  const annualContribution = model.contributionSelected * inputs.beds_per_year;
  const surplus = annualContribution - model.fixedBlock;

  return (
    // FULL-SCREEN Bloomberg console: fills the viewport region (h-full). Status
    // + preset lines are fixed; the 5-column grid fills the rest. Col 1 holds ALL
    // sliders always-visible and scrolls internally only if a short laptop needs it.
    <div className="flex h-full flex-col overflow-hidden rounded-md border border-zinc-800 bg-black text-[12px] text-zinc-300 font-mono leading-tight selection:bg-cyan-500/30">
      {/* ── STATUS HEADER LINE ── */}
      <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-b border-zinc-800 px-3 py-1.5 text-[11px]">
        <span className="text-cyan-300">GOODS:COST-MODEL</span>
        <span className="text-zinc-600">|</span>
        <Stat k="METHOD" v={METHOD_LABELS_SHORT[inputs.build_method]} />
        <Stat k="VOL" v={`${inputs.beds_per_year.toLocaleString('en-AU')}/YR`} />
        <Stat k="LOC" v={LOCATIONS[inputs.location].label.toUpperCase().replace(/[^A-Z0-9 ]/g, '').replace(/ +/g, '-')} />
        <Stat k="FTE" v={`${inputs.founder_fte_pct}%`} />
        <Stat k="CTNR" v={inputs.containerise ? 'ON' : 'OFF'} />
        <Stat k="PRICE" v={fmt(inputs.retail_price)} />
        <span className="ml-auto flex items-center gap-1.5 text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
        </span>
      </div>

      {/* ── PRESET LINE ── */}
      <div className="flex shrink-0 flex-wrap items-center gap-x-1 gap-y-1 border-b border-zinc-800 px-3 py-1 text-[10px]">
        <span className="text-zinc-600">PRESET&gt;</span>
        {PRESETS.map((p, idx) => (
          <span key={p.key} className="flex items-center">
            <button onClick={() => applyPreset(p)} title={p.hint} className="px-1 uppercase tracking-[0.06em] text-zinc-400 hover:text-cyan-300 hover:underline">
              [{idx + 1}]{p.label.replace(/\s*\(.*\)/, '')}
            </button>
            {idx < PRESETS.length - 1 && <span className="text-zinc-700">·</span>}
          </span>
        ))}
        <button onClick={resetAll} className="ml-auto px-1 uppercase text-zinc-500 hover:text-cyan-300 hover:underline">[RESET]</button>
      </div>

      {/* Full-width 5-up at xl (INPUTS | READOUTS | PATHS | IDIOT | CAPITAL),
          3-up at lg, single column on small. Fills remaining viewport height. */}
      <div className="grid min-h-0 flex-1 grid-cols-1 overflow-auto lg:grid-cols-3 lg:overflow-hidden xl:grid-cols-5">
        {/* ════════ COL 1 — INPUTS ════════ */}
        <div className="flex min-h-0 flex-col border-b border-zinc-800 lg:border-b-0 lg:border-r">
          <Bar title="INPUTS" />
          <div className="shrink-0 space-y-2 p-2.5">
            {/* Volume */}
            <div>
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] uppercase tracking-[0.1em] text-zinc-500">VOL BEDS/YR</span>
                <span className="tabular-nums text-cyan-300">{inputs.beds_per_year.toLocaleString('en-AU')}</span>
              </div>
              <input type="range" min={50} max={2000} step={10} value={inputs.beds_per_year}
                onChange={(e) => setInput('beds_per_year', parseFloat(e.target.value))}
                className="term-range mt-1 w-full" style={{ accentColor: CYAN }} />
            </div>

            {/* Method toggle */}
            <div>
              <span className="text-[10px] uppercase tracking-[0.1em] text-zinc-500">METHOD</span>
              <div className="mt-1 grid grid-cols-2 gap-px bg-zinc-800 border border-zinc-800">
                {(Object.keys(METHOD_LABELS_SHORT) as BuildMethod[]).map((m) => (
                  <button key={m} onClick={() => setInput('build_method', m)}
                    className={`px-1 py-1 text-[10px] uppercase tracking-[0.06em] ${inputs.build_method === m ? 'bg-cyan-500/20 text-cyan-200' : 'bg-black text-zinc-500 hover:text-zinc-300'}`}>
                    {METHOD_LABELS_SHORT[m]}
                  </button>
                ))}
              </div>
            </div>

            {/* Location toggle */}
            <div>
              <span className="text-[10px] uppercase tracking-[0.1em] text-zinc-500">LOC</span>
              <div className="mt-1 grid grid-cols-1 gap-px bg-zinc-800 border border-zinc-800">
                {(Object.keys(LOCATIONS) as Location[]).map((l) => (
                  <button key={l} onClick={() => setInput('location', l)}
                    className={`flex items-baseline justify-between px-1.5 py-1 text-[10px] ${inputs.location === l ? 'bg-cyan-500/20 text-cyan-200' : 'bg-black text-zinc-500 hover:text-zinc-300'}`}>
                    <span className="uppercase tracking-[0.04em]">{LOCATIONS[l].label}</span>
                    <span className="tabular-nums text-zinc-600">{fmt(LOCATIONS[l].rentPerYear)}/{fmt(LOCATIONS[l].inboundFreightPerBed)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* FTE + containerise */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-[0.1em] text-zinc-500">FTE</span>
                <div className="mt-1 grid grid-cols-4 gap-px bg-zinc-800 border border-zinc-800">
                  {[25, 50, 75, 100].map((pct) => (
                    <button key={pct} onClick={() => setInput('founder_fte_pct', pct)}
                      className={`py-1 text-[9px] tabular-nums ${inputs.founder_fte_pct === pct ? 'bg-cyan-500/20 text-cyan-200' : 'bg-black text-zinc-500 hover:text-zinc-300'}`}>
                      {pct}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.1em] text-zinc-500">CONTAINERISE</span>
                <button onClick={() => setInput('containerise', !inputs.containerise)}
                  className={`mt-1 w-full border border-zinc-800 py-1 text-[10px] uppercase tracking-[0.08em] ${inputs.containerise ? 'bg-cyan-500/20 text-cyan-200' : 'bg-black text-zinc-500 hover:text-zinc-300'}`}>
                  {inputs.containerise ? `ON −${fmt(CONTAINERISE_FREIGHT_DELTA)}` : 'OFF'}
                </button>
              </div>
            </div>

          </div>

          {/* ALL ASSUMPTIONS — always visible, compact single-line rows, scrolls within col */}
          <div className="min-h-0 flex-1 overflow-auto border-t border-zinc-800">
            <Bar title={`ALL ASSUMPTIONS · ${SLIDERS.length}`} right={<span className="text-[9px] text-zinc-600">NAME · TRACK · VALUE</span>} />
            <div className="space-y-px p-2">
              {SLIDERS.map((s) => {
                const val = inputs[s.key] as number;
                const isDefault = val === DEFAULTS[s.key];
                return (
                  <div key={s.key} className="flex items-center gap-2 py-px" title={VERIFIED_HINTS[s.key]}>
                    <span className="w-[104px] shrink-0 truncate text-[9px] uppercase tracking-[0.03em] text-zinc-500">{s.label}</span>
                    <input type="range" min={s.min} max={s.max} step={s.step} value={val}
                      onChange={(e) => setInput(s.key, parseFloat(e.target.value) as Inputs[typeof s.key])}
                      className="cm-srow min-w-0 flex-1" style={{ accentColor: CYAN }} />
                    <span className={`w-[52px] shrink-0 text-right text-[10px] tabular-nums ${isDefault ? 'text-zinc-400' : 'text-cyan-300'}`}>
                      {s.prefix === '$' ? fmt(val) : `${val}${s.suffix || ''}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ════════ COL 2 — PRIMARY READOUTS ════════ */}
        <div className="flex min-h-0 flex-col border-b border-zinc-800 lg:border-b-0 lg:border-r">
          <Bar title="READOUTS" right={<span className="text-[9px] text-zinc-600 tabular-nums">{METHOD_LABELS_SHORT[inputs.build_method]} SELECTED</span>} />
          <div className="min-h-0 flex-1 space-y-2 overflow-auto p-2.5">
            <div className="grid grid-cols-2 gap-2">
              <Tile label="MARGINAL/BED" value={fmtCents(model.selectedMarginal)} color={CYAN} big />
              <Tile label={`CONTRIB@${inputs.retail_price}`} value={fmtCents(model.contributionSelected)} color={model.contributionSelected >= 0 ? GREEN : RED} big />
              <Tile label="BREAKEVEN/YR" value={breakevenLabel(model.breakevenSelected)} color={AMBER} />
              <Tile label="PAYBACK" value={model.belowVolumeGate ? '—' : `${model.paybackYearsLow.toFixed(1)}-${model.paybackYearsHigh.toFixed(1)}y`} color="#e4e4e7" />
            </div>

            <div className="border border-zinc-800 p-2">
              <Leader k="MARGINAL KIT" v={fmtCents(model.marginalKit)} />
              <Leader k="MARGINAL FACTORY" v={fmtCents(model.marginalFactory)} vColor={GREEN} />
              <Leader k="Δ LEGS IN-HOUSE" v={`−${fmt(model.savingsPerBed)}`} vColor={GREEN} />
              <Leader k="DIRECT (SELECTED)" v={fmtCents(model.selectedDirect)} />
              <Leader k="LONG-HAUL FREIGHT" v={fmt(model.longHaulFreight)} />
              <Leader k="HDPE RAW COST" v={fmt(model.hdpeRawCost)} />
            </div>

            <div className="border border-zinc-800 p-2">
              <Bar title="FIXED BLOCK / YR" />
              <div className="pt-1.5">
                <Leader k="FIXED BLOCK" v={fmt(model.fixedBlock)} vColor="#e4e4e7" strong />
                <Leader k="FOUNDER PRODUCTION" v={fmt(model.founderProductionCost)} />
                <Leader k="FOUNDER TOTAL" v={fmt(model.founderTotalCost)} />
                <Leader k="FIXED/BED@VOL" v={fmtCents(model.fixedPerBed)} />
              </div>
            </div>

            <div className="border border-zinc-800 p-2">
              <Bar title="ENTERPRISE ECONOMICS" />
              <div className="pt-1.5">
                <Leader k={`CONTRIB×${inputs.beds_per_year.toLocaleString('en-AU')}`} v={fmt(annualContribution)} />
                <Leader k="LESS FIXED BLOCK" v={`(${fmt(model.fixedBlock)})`} />
                <Leader k="SURPLUS/(SHORTFALL)" v={fmt(surplus)} vColor={surplus >= 0 ? GREEN : RED} strong />
              </div>
            </div>
          </div>
        </div>

        {/* ════════ COL 3 — SUPPLY PATHS ════════ */}
        <div className="min-h-0 overflow-auto border-b border-zinc-800 lg:border-b-0 lg:border-r xl:border-r">
          <Bar title="SUPPLY PATHS" right={<span className="text-[9px] text-zinc-600">$/BED · CONTRIB · BE</span>} />
          <table className="w-full text-[11px]">
            <thead>
              <tr className="text-zinc-600">
                <th className="px-2 py-1 text-left font-normal text-[9px] tracking-[0.1em]">PATH</th>
                <th className="px-2 py-1 text-right font-normal text-[9px] tracking-[0.1em]">MARG</th>
                <th className="px-2 py-1 text-right font-normal text-[9px] tracking-[0.1em]">CONTR</th>
                <th className="px-2 py-1 text-right font-normal text-[9px] tracking-[0.1em]">BE</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              <TRow label="KITS" m={model.marginalKit} c={model.marginKits} be={model.breakevenKit} active={inputs.build_method === 'kits'} />
              <TRow label="PANELS" m={model.marginalPanel} c={model.marginPanels} be={model.breakevenPanel} active={inputs.build_method === 'panels'} />
              <TRow label="FACTORY" m={model.marginalFactory} c={model.marginFactory} be={model.breakevenFactory} active={inputs.build_method === 'factory'} highlight />
              <TRow label="COMMUNITY" m={model.marginalCommunity} c={model.marginCommunity} be={model.breakevenCommunity} active={inputs.build_method === 'community'} />
            </tbody>
          </table>
        </div>

        {/* ════════ COL 4 — IDIOT INDEX ════════ */}
        <div className="min-h-0 overflow-auto border-b border-zinc-800 lg:border-b-0 lg:border-r xl:border-r">
          <Bar title="IDIOT INDEX · FINISHED÷RAW" />
          <table className="w-full text-[11px]">
            <thead>
              <tr className="text-zinc-600">
                <th className="px-2 py-1 text-left font-normal text-[9px] tracking-[0.1em]">ELEMENT</th>
                <th className="px-2 py-1 text-right font-normal text-[9px] tracking-[0.1em]">RAW</th>
                <th className="px-2 py-1 text-right font-normal text-[9px] tracking-[0.1em]">PAID</th>
                <th className="px-2 py-1 text-right font-normal text-[9px] tracking-[0.1em]">INDEX</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              <IRow label="KIT/SHRED" raw={SHRED_FLOOR_PER_BED} paid={inputs.defy_kit_per_bed} idx={model.idiotKitShred} color={AMBER} />
              <IRow label="KIT/POLYMER" raw={POLYMER_FLOOR_PER_BED} paid={inputs.defy_kit_per_bed} idx={model.idiotKitPolymer} color={RED} />
              <IRow label="STEEL" raw={STEEL_RAW_FLOOR_PER_BED} paid={inputs.steel_per_bed} idx={model.idiotSteel} color="#a1a1aa" />
              <IRow label="CANVAS" raw={CANVAS_RAW_FLOOR_PER_BED} paid={inputs.canvas_per_bed} idx={model.idiotCanvas} color="#a1a1aa" last />
            </tbody>
          </table>
        </div>

        {/* ════════ COL 5 — CAPITAL · PAYBACK ════════ */}
        <div className="min-h-0 overflow-auto">
          <Bar title="CAPITAL · PAYBACK" />
          <div className="p-2">
            <Leader k="CAPITAL GROSS" v={`${fmt(model.capitalLow)}-${fmt(model.capitalHigh)}`} strong />
            <Leader k="NET POST-INVEST" v={`${fmt(NET_CAPITAL_LOW)}-${fmt(NET_CAPITAL_HIGH)}`} />
            <Leader k="ALREADY INVESTED" v={fmt(ALREADY_INVESTED)} />
            <Leader k="LEGS SAVING/BED" v={fmt(model.savingsPerBed)} vColor={GREEN} />
            <Leader k="PAYBACK BEDS" v={model.belowVolumeGate ? 'n/a <gate' : `${Math.round(model.paybackBedsLow).toLocaleString('en-AU')}-${Math.round(model.paybackBedsHigh).toLocaleString('en-AU')}`} />
            <Leader k="PAYBACK YEARS" v={model.belowVolumeGate ? `— (<${VOLUME_GATE}/yr)` : `${model.paybackYearsLow.toFixed(1)}-${model.paybackYearsHigh.toFixed(1)}y`} vColor={model.belowVolumeGate ? AMBER : '#e4e4e7'} />
            <Leader k="COMMERCIAL CF" v={`${fmt(inputs.commercial_low)}-${fmt(inputs.commercial_high)}`} />
            <Leader k="FACTORY VALUE MULT" v={`${model.valueVsCommercial.toFixed(1)}x`} vColor={CYAN} />
          </div>
        </div>
      </div>

      {/* ── FOOTER STRIP (compact, fixed) ── */}
      <div className="shrink-0 border-t border-zinc-800 px-3 py-1 text-[10px] leading-snug">
        {model.belowVolumeGate && (
          <p className="text-amber-400">⚠ CAPEX GUARD: VOL {inputs.beds_per_year} &lt; GATE {VOLUME_GATE}/YR — BUY KITS, DON&apos;T BUILD FACTORY. {fmt(LEGS_SAVING_PER_BED)}/BED SAVING WON&apos;T RECOUP {fmt(model.capitalLow)}-{fmt(model.capitalHigh)}.</p>
        )}
        <p className="text-zinc-600">
          <span className="text-zinc-400">REF:</span> FULLY-LOADED BUY-KIT@{inputs.beds_per_year}/YR = <span className="tabular-nums text-zinc-300">{fmt(model.fullKits)}</span> — FIXED-COST ABSORPTION AT PILOT VOL, <span className="text-zinc-400">NOT MARGINAL</span> → {fmt(model.marginalFactory)} AT SCALE. <span className="text-zinc-700">SRC: scenarios.json v5 ($560/d) + idiot-index.json v6 + supplier-quotes.ts · BOM=OCR · VERIFIED/MODELLED·NOT-AUDITED · ~89% GRANT-FUNDED</span>
        </p>
      </div>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <span className="flex items-baseline gap-1">
      <span className="text-zinc-600">{k}=</span>
      <span className="tabular-nums text-zinc-200">{v}</span>
    </span>
  );
}

function Tile({ label, value, color, big }: { label: string; value: string; color: string; big?: boolean }) {
  return (
    <div className="border border-zinc-800 px-2 py-1.5">
      <span className="block text-[9px] uppercase tracking-[0.08em] text-zinc-600">{label}</span>
      <span className={`block tabular-nums ${big ? 'text-xl' : 'text-base'}`} style={{ color }}>{value}</span>
    </div>
  );
}

function TRow({ label, m, c, be, active, highlight }: { label: string; m: number; c: number; be: number; active?: boolean; highlight?: boolean }) {
  return (
    <tr className={`border-b border-zinc-900 ${active ? 'bg-cyan-500/10' : ''}`}>
      <td className={`px-2 py-1 text-[10px] tracking-[0.06em] ${highlight ? 'text-emerald-300' : 'text-zinc-300'}`}>{active ? '▸' : ' '}{label}</td>
      <td className="px-2 py-1 text-right text-zinc-200">{fmtCents(m)}</td>
      <td className="px-2 py-1 text-right" style={{ color: c >= 0 ? GREEN : RED }}>{fmtCents(c)}</td>
      <td className={`px-2 py-1 text-right ${highlight ? 'text-emerald-300' : 'text-amber-400'}`}>{breakevenLabel(be)}</td>
    </tr>
  );
}

function IRow({ label, raw, paid, idx, color, last }: { label: string; raw: number; paid: number; idx: number; color: string; last?: boolean }) {
  return (
    <tr className={last ? '' : 'border-b border-zinc-900'}>
      <td className="px-2 py-1 text-[10px] tracking-[0.06em] text-zinc-300">{label}</td>
      <td className="px-2 py-1 text-right text-zinc-500">{fmt(raw)}</td>
      <td className="px-2 py-1 text-right text-zinc-300">{fmt(paid)}</td>
      <td className="px-2 py-1 text-right" style={{ color }}>{idx.toFixed(1)}×</td>
    </tr>
  );
}
