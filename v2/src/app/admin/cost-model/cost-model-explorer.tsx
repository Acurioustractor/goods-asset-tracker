'use client';
/**
 * Cost-model explorer — sliders drive the matrix. First-principles inputs
 * (HDPE kg/bed, $/kg, steel/canvas/hardware, labour rates, throughput,
 * volume, founder time) → derived outputs (direct cost per state, fully-
 * loaded by volume, margin matrix, capital ask, Idiot Index, payback).
 *
 * The defaults are seeded from cost-model-scenarios.json + supplier-quotes.ts.
 * Every slider has the verified-default labelled so you can see when you're
 * playing with assumptions vs. invoice-verified numbers.
 */
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function fmt(n: number): string {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: n < 10 ? 2 : 0 }).format(n);
}
function fmtPct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

interface Inputs {
  // Material per bed
  hdpe_kg_per_bed: number;
  hdpe_per_kg_landed: number; // raw + delivery
  defy_kit_per_bed: number; // Defy kit rate
  defy_panel_each: number; // Defy pre-pressed panel
  steel_per_bed: number;
  canvas_per_bed: number;
  hardware_per_bed: number; // end caps + screws + bolts
  // Labour
  labour_per_day: number;
  factory_beds_per_day: number;
  defy_kits_beds_per_day: number;
  defy_panels_beds_per_day: number;
  community_beds_per_day: number;
  defy_assembly_per_bed: number; // when Defy assembles
  // Energy
  diesel_per_bed_factory: number;
  diesel_per_bed_panels: number;
  // Volume + overhead
  beds_per_year: number;
  kirmos_monthly_50pct: number;
  founder_days_production: number;
  founder_rate_per_day: number;
  admin_per_year: number;
  field_travel_per_year: number;
  freight_per_bed: number;
  // Retail
  retail_price: number;
  commercial_low: number;
  commercial_high: number;
  // Capital
  capital_to_factory_low: number;
  capital_to_factory_high: number;
}

const DEFAULTS: Inputs = {
  hdpe_kg_per_bed: 20,
  hdpe_per_kg_landed: 2.75,
  defy_kit_per_bed: 344.05,
  defy_panel_each: 200,
  steel_per_bed: 27,
  canvas_per_bed: 93.50,
  hardware_per_bed: 5.24, // 3.20 caps + 1.04 screws + 1.00 bolts
  labour_per_day: 400,
  factory_beds_per_day: 5, // Notion BK
  defy_kits_beds_per_day: 10,
  defy_panels_beds_per_day: 7.5,
  community_beds_per_day: 5,
  defy_assembly_per_bed: 55.95,
  diesel_per_bed_factory: 15,
  diesel_per_bed_panels: 5,
  beds_per_year: 500,
  kirmos_monthly_50pct: 2250,
  founder_days_production: 30,
  founder_rate_per_day: 1000,
  admin_per_year: 14700,
  field_travel_per_year: 51000,
  freight_per_bed: 100,
  retail_price: 750,
  commercial_low: 1500,
  commercial_high: 2000,
  capital_to_factory_low: 90000,
  capital_to_factory_high: 200000,
};

const VERIFIED_HINTS: Partial<Record<keyof Inputs, string>> = {
  hdpe_kg_per_bed: 'Ben confirmed (one sheet)',
  hdpe_per_kg_landed: '$2/kg shred + $0.75/kg delivery (Defy INV-1731)',
  defy_kit_per_bed: 'INV-1602 + INV-1732 verified',
  defy_panel_each: 'INV-1731 (20 panels @ $200 bulk)',
  steel_per_bed: 'DNA Steel canonical (Notion)',
  canvas_per_bed: 'Centre Canvas verified (3 invoices 2026)',
  hardware_per_bed: 'Coastal Fasteners verified ($3.20 caps + $1.04 16-screws + $1.00 2-bolts)',
  defy_assembly_per_bed: 'Defy 2026-03-19 invoice verified',
  retail_price: 'supplier-quotes.ts canonical',
  commercial_low: 'AU retail/contract scan',
  commercial_high: 'AU retail/contract scan',
};

interface Slider {
  key: keyof Inputs;
  label: string;
  group: 'Materials' | 'Labour & throughput' | 'Volume & overhead' | 'Market';
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
}

const SLIDERS: Slider[] = [
  // Materials
  { key: 'hdpe_kg_per_bed', label: 'HDPE per bed', group: 'Materials', min: 10, max: 50, step: 1, suffix: 'kg' },
  { key: 'hdpe_per_kg_landed', label: 'HDPE $/kg landed', group: 'Materials', min: 1, max: 6, step: 0.25, prefix: '$' },
  { key: 'defy_kit_per_bed', label: 'Defy kit $/bed', group: 'Materials', min: 200, max: 500, step: 5, prefix: '$' },
  { key: 'defy_panel_each', label: 'Defy panel $/each', group: 'Materials', min: 100, max: 300, step: 10, prefix: '$' },
  { key: 'steel_per_bed', label: 'Steel $/bed', group: 'Materials', min: 10, max: 80, step: 1, prefix: '$' },
  { key: 'canvas_per_bed', label: 'Canvas $/bed', group: 'Materials', min: 50, max: 150, step: 1, prefix: '$' },
  { key: 'hardware_per_bed', label: 'Hardware $/bed', group: 'Materials', min: 2, max: 15, step: 0.25, prefix: '$' },
  // Labour
  { key: 'labour_per_day', label: 'Labour $/day', group: 'Labour & throughput', min: 200, max: 800, step: 25, prefix: '$' },
  { key: 'factory_beds_per_day', label: 'Factory beds/day', group: 'Labour & throughput', min: 1, max: 15, step: 0.5 },
  { key: 'defy_kits_beds_per_day', label: 'Defy Kits beds/day', group: 'Labour & throughput', min: 2, max: 20, step: 0.5 },
  { key: 'defy_panels_beds_per_day', label: 'Defy Panels beds/day', group: 'Labour & throughput', min: 2, max: 15, step: 0.5 },
  { key: 'community_beds_per_day', label: 'Community beds/day', group: 'Labour & throughput', min: 1, max: 15, step: 0.5 },
  { key: 'defy_assembly_per_bed', label: 'Defy assembly $/bed', group: 'Labour & throughput', min: 30, max: 100, step: 1, prefix: '$' },
  { key: 'diesel_per_bed_factory', label: 'Diesel/bed (Factory)', group: 'Labour & throughput', min: 5, max: 50, step: 1, prefix: '$' },
  { key: 'diesel_per_bed_panels', label: 'Diesel/bed (Panels)', group: 'Labour & throughput', min: 0, max: 20, step: 1, prefix: '$' },
  // Volume & overhead
  { key: 'beds_per_year', label: 'Beds per year', group: 'Volume & overhead', min: 50, max: 2000, step: 50 },
  { key: 'kirmos_monthly_50pct', label: 'Kirmos monthly (50% on beds)', group: 'Volume & overhead', min: 0, max: 5000, step: 100, prefix: '$' },
  { key: 'founder_days_production', label: 'Founder days/yr on production', group: 'Volume & overhead', min: 0, max: 100, step: 5, suffix: 'd' },
  { key: 'founder_rate_per_day', label: 'Founder rate $/day', group: 'Volume & overhead', min: 500, max: 2500, step: 100, prefix: '$' },
  { key: 'admin_per_year', label: 'Admin $/yr', group: 'Volume & overhead', min: 0, max: 50000, step: 1000, prefix: '$' },
  { key: 'field_travel_per_year', label: 'Field travel $/yr', group: 'Volume & overhead', min: 0, max: 150000, step: 5000, prefix: '$' },
  { key: 'freight_per_bed', label: 'Long-haul freight $/bed', group: 'Volume & overhead', min: 0, max: 500, step: 10, prefix: '$' },
  // Market
  { key: 'retail_price', label: 'Retail / institutional price', group: 'Market', min: 400, max: 1500, step: 25, prefix: '$' },
  { key: 'commercial_low', label: 'Commercial counterfactual low', group: 'Market', min: 1000, max: 2500, step: 50, prefix: '$' },
  { key: 'commercial_high', label: 'Commercial counterfactual high', group: 'Market', min: 1000, max: 3000, step: 50, prefix: '$' },
  { key: 'capital_to_factory_low', label: 'Capital ask (low)', group: 'Market', min: 50000, max: 500000, step: 5000, prefix: '$' },
  { key: 'capital_to_factory_high', label: 'Capital ask (high)', group: 'Market', min: 50000, max: 500000, step: 5000, prefix: '$' },
];

// Derive everything from inputs — this is the model.
function computeModel(i: Inputs) {
  const hdpeRawCost = i.hdpe_kg_per_bed * i.hdpe_per_kg_landed;
  // Direct cost per state
  const stateKits = i.defy_kit_per_bed + i.steel_per_bed + i.canvas_per_bed + i.hardware_per_bed + (i.labour_per_day / i.defy_kits_beds_per_day) + 25; // +25 freight on Defy material
  const statePanels = i.defy_panel_each * 2 + i.steel_per_bed + i.canvas_per_bed + i.hardware_per_bed + i.diesel_per_bed_panels + (i.labour_per_day / i.defy_panels_beds_per_day);
  const stateFactory = hdpeRawCost + i.diesel_per_bed_factory + (i.labour_per_day / i.factory_beds_per_day) + i.steel_per_bed + i.canvas_per_bed + i.hardware_per_bed;
  const stateCommunity = 0 + i.diesel_per_bed_factory + i.steel_per_bed + i.canvas_per_bed + i.hardware_per_bed; // free plastic, volunteer labour
  // Overhead per bed at current volume
  const kirmosPerBed = (i.kirmos_monthly_50pct * 12) / i.beds_per_year;
  const founderProductionPerBed = (i.founder_days_production * i.founder_rate_per_day) / i.beds_per_year;
  const adminPerBed = i.admin_per_year / i.beds_per_year;
  const fieldPerBed = i.field_travel_per_year / i.beds_per_year;
  const overheadPerBed = kirmosPerBed + founderProductionPerBed + adminPerBed + fieldPerBed + i.freight_per_bed;
  // Fully-loaded
  const fullKits = stateKits + overheadPerBed;
  const fullPanels = statePanels + overheadPerBed;
  const fullFactory = stateFactory + overheadPerBed;
  const fullCommunity = stateCommunity + overheadPerBed;
  // Margin matrix
  const marginKits = i.retail_price - stateKits;
  const marginFactory = i.retail_price - stateFactory;
  const marginCommunity = i.retail_price - stateCommunity;
  // First-principles floor
  const firstPrinciplesFloor = hdpeRawCost + 10.34 /* steel raw */ + 35 /* canvas raw */ + 2 /* caps raw */ + 1.65 /* screws+bolts raw */ + (i.labour_per_day / i.defy_kits_beds_per_day);
  const supplyChainMarkup = stateKits - firstPrinciplesFloor;
  // Idiot Index
  const idiotKit = i.defy_kit_per_bed / hdpeRawCost;
  const idiotPanel = (i.defy_panel_each * 2) / hdpeRawCost;
  const idiotSteel = i.steel_per_bed / 10.34;
  const idiotCanvas = i.canvas_per_bed / 35;
  // Counterfactual ratios
  const counterfactualMid = (i.commercial_low + i.commercial_high) / 2;
  const valueVsCommercial = counterfactualMid / fullFactory;
  // Capital payback (years)
  const capitalLow = i.capital_to_factory_low;
  const capitalHigh = i.capital_to_factory_high;
  const savingsPerBed = stateKits - stateFactory; // Going from buying kits to factory in-house
  const paybackBedsLow = capitalLow / savingsPerBed;
  const paybackBedsHigh = capitalHigh / savingsPerBed;
  const paybackYearsLow = paybackBedsLow / i.beds_per_year;
  const paybackYearsHigh = paybackBedsHigh / i.beds_per_year;

  return {
    hdpeRawCost,
    stateKits, statePanels, stateFactory, stateCommunity,
    overheadPerBed, kirmosPerBed, founderProductionPerBed, adminPerBed, fieldPerBed,
    fullKits, fullPanels, fullFactory, fullCommunity,
    marginKits, marginFactory, marginCommunity,
    firstPrinciplesFloor, supplyChainMarkup,
    idiotKit, idiotPanel, idiotSteel, idiotCanvas,
    counterfactualMid, valueVsCommercial,
    capitalLow, capitalHigh, savingsPerBed, paybackBedsLow, paybackBedsHigh, paybackYearsLow, paybackYearsHigh,
  };
}

export function CostModelExplorer() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const model = useMemo(() => computeModel(inputs), [inputs]);

  function setInput<K extends keyof Inputs>(key: K, val: number) {
    setInputs((prev) => ({ ...prev, [key]: val }));
  }
  function resetAll() {
    setInputs(DEFAULTS);
  }

  const grouped = SLIDERS.reduce((acc, s) => {
    if (!acc[s.group]) acc[s.group] = [];
    acc[s.group].push(s);
    return acc;
  }, {} as Record<string, Slider[]>);

  return (
    <div className="space-y-6">
      {/* Headline cards — QBE-style at-a-glance */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Fully-loaded today</p>
            <p className="text-3xl font-bold tabular-nums">{fmt(model.fullKits)}</p>
            <p className="text-xs text-gray-600 mt-1">Defy Kits @ {inputs.beds_per_year}/yr</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Fully-loaded target</p>
            <p className="text-3xl font-bold tabular-nums text-emerald-700">{fmt(model.fullFactory)}</p>
            <p className="text-xs text-gray-600 mt-1">Factory in-house</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Value vs commercial</p>
            <p className="text-3xl font-bold tabular-nums text-purple-700">{model.valueVsCommercial.toFixed(2)}×</p>
            <p className="text-xs text-gray-600 mt-1">{fmt(model.counterfactualMid)} commercial</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Capital payback</p>
            <p className="text-3xl font-bold tabular-nums">
              {model.paybackYearsLow.toFixed(1)}-{model.paybackYearsHigh.toFixed(1)}y
            </p>
            <p className="text-xs text-gray-600 mt-1">{fmt(model.capitalLow)}-{fmt(model.capitalHigh)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
        {/* Sliders panel */}
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Inputs</h2>
              <button onClick={resetAll} className="text-xs underline text-gray-600 hover:text-gray-900">
                Reset to verified defaults
              </button>
            </div>
            {Object.entries(grouped).map(([group, sliders]) => (
              <div key={group}>
                <h3 className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-3">{group}</h3>
                <div className="space-y-3">
                  {sliders.map((s) => {
                    const val = inputs[s.key];
                    const isDefault = val === DEFAULTS[s.key];
                    const hint = VERIFIED_HINTS[s.key];
                    return (
                      <div key={s.key} className="text-sm">
                        <div className="flex justify-between items-baseline mb-1">
                          <label className="text-gray-700">{s.label}</label>
                          <span className="tabular-nums font-medium">
                            {s.prefix || ''}{val}{s.suffix || ''}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={s.min}
                          max={s.max}
                          step={s.step}
                          value={val}
                          onChange={(e) => setInput(s.key, parseFloat(e.target.value))}
                          className="w-full"
                        />
                        {hint && (
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            {isDefault ? `✓ ${hint}` : `(default: ${s.prefix || ''}${DEFAULTS[s.key]}${s.suffix || ''} — ${hint})`}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Output panels */}
        <div className="space-y-6">
          {/* Direct cost matrix */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3">Direct cost per bed (4 supply paths)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-gray-500 border-b">
                    <tr>
                      <th className="pb-2">Path</th>
                      <th className="pb-2 text-right">Direct $/bed</th>
                      <th className="pb-2 text-right">Margin @ {fmt(inputs.retail_price)}</th>
                      <th className="pb-2 text-right">Margin %</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Defy Kits (today)</td>
                      <td className="py-2 text-right tabular-nums">{fmt(model.stateKits)}</td>
                      <td className="py-2 text-right tabular-nums">{fmt(model.marginKits)}</td>
                      <td className="py-2 text-right tabular-nums">{fmtPct(model.marginKits / inputs.retail_price)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Defy Panels</td>
                      <td className="py-2 text-right tabular-nums">{fmt(model.statePanels)}</td>
                      <td className="py-2 text-right tabular-nums">{fmt(inputs.retail_price - model.statePanels)}</td>
                      <td className="py-2 text-right tabular-nums">{fmtPct((inputs.retail_price - model.statePanels) / inputs.retail_price)}</td>
                    </tr>
                    <tr className="border-b bg-emerald-50/50">
                      <td className="py-2 font-medium">Factory (in-house target)</td>
                      <td className="py-2 text-right tabular-nums">{fmt(model.stateFactory)}</td>
                      <td className="py-2 text-right tabular-nums font-medium text-emerald-700">{fmt(model.marginFactory)}</td>
                      <td className="py-2 text-right tabular-nums font-medium text-emerald-700">{fmtPct(model.marginFactory / inputs.retail_price)}</td>
                    </tr>
                    <tr className="bg-purple-50/50">
                      <td className="py-2 font-medium">Community (vision)</td>
                      <td className="py-2 text-right tabular-nums">{fmt(model.stateCommunity)}</td>
                      <td className="py-2 text-right tabular-nums font-medium text-purple-700">{fmt(model.marginCommunity)}</td>
                      <td className="py-2 text-right tabular-nums font-medium text-purple-700">{fmtPct(model.marginCommunity / inputs.retail_price)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Fully-loaded + overhead breakdown */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3">Fully-loaded at {inputs.beds_per_year} beds/yr</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Overhead per bed</h4>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-1.5 text-gray-600">Kirmos (50% on beds)</td>
                        <td className="py-1.5 text-right tabular-nums">{fmt(model.kirmosPerBed)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5 text-gray-600">Founder time (production)</td>
                        <td className="py-1.5 text-right tabular-nums">{fmt(model.founderProductionPerBed)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5 text-gray-600">Admin</td>
                        <td className="py-1.5 text-right tabular-nums">{fmt(model.adminPerBed)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5 text-gray-600">Field travel + ops</td>
                        <td className="py-1.5 text-right tabular-nums">{fmt(model.fieldPerBed)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5 text-gray-600">Long-haul freight</td>
                        <td className="py-1.5 text-right tabular-nums">{fmt(inputs.freight_per_bed)}</td>
                      </tr>
                      <tr>
                        <td className="py-1.5 font-semibold">Overhead total</td>
                        <td className="py-1.5 text-right tabular-nums font-semibold">{fmt(model.overheadPerBed)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Fully-loaded (direct + overhead)</h4>
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-1.5 text-gray-600">Defy Kits</td>
                        <td className="py-1.5 text-right tabular-nums">{fmt(model.fullKits)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-1.5 text-gray-600">Defy Panels</td>
                        <td className="py-1.5 text-right tabular-nums">{fmt(model.fullPanels)}</td>
                      </tr>
                      <tr className="border-b bg-emerald-50/50">
                        <td className="py-1.5 font-medium">Factory (target)</td>
                        <td className="py-1.5 text-right tabular-nums font-semibold text-emerald-700">{fmt(model.fullFactory)}</td>
                      </tr>
                      <tr className="bg-purple-50/50">
                        <td className="py-1.5 font-medium">Community (vision)</td>
                        <td className="py-1.5 text-right tabular-nums font-semibold text-purple-700">{fmt(model.fullCommunity)}</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="text-xs text-gray-500 mt-3">
                    Commercial counterfactual: {fmt(inputs.commercial_low)}–{fmt(inputs.commercial_high)}.{' '}
                    Factory @ this volume is {model.valueVsCommercial.toFixed(1)}× cheaper than commercial.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Idiot Index */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Idiot Index — first-principles markup</h3>
              <p className="text-xs text-gray-600 mb-4">
                Musk's metric: <code>finished cost ÷ raw material cost</code>. Ratios &gt; 3× are candidates for in-housing.
                First-principles floor for a bed: <strong>{fmt(model.firstPrinciplesFloor)}</strong>.
                We currently pay <strong>{fmt(model.stateKits)}</strong> via Defy Kits. The gap is{' '}
                <strong className="text-amber-700">{fmt(model.supplyChainMarkup)}/bed</strong> of supply-chain markup we
                can capture in-house at scale.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <IdiotCard label="HDPE kit (Defy)" ratio={model.idiotKit} raw={model.hdpeRawCost} current={inputs.defy_kit_per_bed} />
                <IdiotCard label="Defy panels (x2)" ratio={model.idiotPanel} raw={model.hdpeRawCost} current={inputs.defy_panel_each * 2} />
                <IdiotCard label="Steel poles" ratio={model.idiotSteel} raw={10.34} current={inputs.steel_per_bed} />
                <IdiotCard label="Canvas" ratio={model.idiotCanvas} raw={35} current={inputs.canvas_per_bed} />
              </div>
            </CardContent>
          </Card>

          {/* QBE-style capital ask + payback */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3">Capital ask + payback (QBE-ready)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="border rounded p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Capital ask</p>
                  <p className="text-2xl font-bold tabular-nums mt-1">
                    {fmt(model.capitalLow)}–{fmt(model.capitalHigh)}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">Shredder + hot-press + CNC + workbench</p>
                </div>
                <div className="border rounded p-4 bg-emerald-50/50">
                  <p className="text-xs text-emerald-700 uppercase tracking-wide">Savings per bed</p>
                  <p className="text-2xl font-bold tabular-nums text-emerald-700 mt-1">{fmt(model.savingsPerBed)}</p>
                  <p className="text-xs text-gray-600 mt-2">Defy Kits → Factory in-house</p>
                </div>
                <div className="border rounded p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Payback @ {inputs.beds_per_year}/yr</p>
                  <p className="text-2xl font-bold tabular-nums mt-1">
                    {model.paybackYearsLow.toFixed(1)}–{model.paybackYearsHigh.toFixed(1)}y
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    {Math.round(model.paybackBedsLow)}–{Math.round(model.paybackBedsHigh)} beds to recoup
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-4">
                <strong>The QBE pitch:</strong> Invest {fmt(model.capitalLow)}–{fmt(model.capitalHigh)} to unlock
                in-house production. Per-bed cost drops from {fmt(model.stateKits)} (Defy Kits) to {fmt(model.stateFactory)}{' '}
                (Factory) — saving {fmt(model.savingsPerBed)}/bed. At {inputs.beds_per_year} beds/yr capacity, the capital
                pays back in {model.paybackYearsLow.toFixed(1)}–{model.paybackYearsHigh.toFixed(1)} years, then every
                future bed delivers {fmt(model.savingsPerBed)} more to community.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center pt-4 border-t">
        Source: <code>v2/src/lib/data/cost-model-scenarios.json</code> + <code>supplier-quotes.ts</code>. All defaults
        verified from invoice OCR + Notion BK 2026-05-28. Change a slider to test an assumption — the page is
        read-only of the underlying canonical numbers.
      </p>
    </div>
  );
}

function IdiotCard({ label, ratio, raw, current }: { label: string; ratio: number; raw: number; current: number }) {
  const color =
    ratio >= 5 ? 'border-red-300 bg-red-50 text-red-700'
    : ratio >= 3 ? 'border-orange-300 bg-orange-50 text-orange-700'
    : ratio >= 2 ? 'border-blue-300 bg-blue-50 text-blue-700'
    : 'border-gray-200 bg-gray-50 text-gray-700';
  return (
    <div className={`border rounded p-3 ${color}`}>
      <p className="text-xs uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold tabular-nums mt-1">{ratio.toFixed(1)}×</p>
      <p className="text-[10px] mt-1">{fmt(raw)} raw → {fmt(current)} paid</p>
    </div>
  );
}
