'use client';
/**
 * Cost-model explorer — leads with the HONEST marginal / fixed / breakeven story.
 *
 * Output hierarchy (the QBE-ready stack, post-2026-05-29 lock):
 *   1. Marginal cost/bed   (~$685 Buy-Kit today → ~$426 Factory)  — the cash cost of one more bed
 *   2. Annual fixed block  (~$109,500/yr)                          — a block to FUND, not a per-bed tax
 *   3. Breakeven beds/yr   (~338 Factory)                          — fixed block ÷ contribution/bed
 *   4. Capital payback                                             — on the $194.05/bed in-house legs saving
 *
 * The old "fully-loaded at pilot volume" (~$1,912-equivalent, `fullKits`) is DEMOTED to a small,
 * clearly-labelled reference row — it is a fixed-cost-absorption artefact at low volume, NOT a
 * marginal cost, and it must never headline an investor view again.
 *
 * Canonical numbers are locked in `cost-model-scenarios.json` (v5+, founder $560/day) and
 * `01-cost-model-idiot-index.json` (v6). Defaults below mirror those locked values.
 *
 * LOCKED (2026-05-29): founder $560/day, $84K/yr, production share $16,800; fixed block ~$109,500;
 * marginal Buy-Kit $684.79 / Factory $425.74; breakeven 338 (Factory); idiot index 8.6× (shred $40) +
 * 21.5× (polymer $16); capital $112-222K gross / ~$2-112K net; price $750; in-house legs saving $194.05/bed.
 */
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

function fmt(n: number): string {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: Math.abs(n) < 10 ? 2 : 0 }).format(n);
}
function fmtPct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

type BuildMethod = 'kits' | 'panels' | 'factory' | 'community';
type Location = 'sydney' | 'sunshine_coast' | 'on_country';

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
  // Volume + overhead (fixed block lines)
  beds_per_year: number;
  kirmos_monthly_50pct: number;
  founder_days_production: number;
  founder_rate_per_day: number;
  founder_fte_pct: number; // 25 / 50 / 75 / 100 — combined founder allocation
  founder_total_days_per_year: number; // full-time-equiv Goods days at 100%
  admin_per_year: number;
  field_travel_per_year: number;
  local_freight_per_bed: number; // assembly-site local freight (in stateKits)
  long_haul_freight_per_bed: number; // marginal long-haul freight to community
  // Levers
  build_method: BuildMethod;
  location: Location;
  containerise: boolean;
  // Retail
  retail_price: number;
  commercial_low: number;
  commercial_high: number;
  // Capital
  capital_to_factory_low: number;
  capital_to_factory_high: number;
}

// ── LOCKED canonical defaults (mirror cost-model-scenarios.json v5 + idiot-index v6) ──
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
  beds_per_year: 120, // honest today run-rate (NOT 500)
  kirmos_monthly_50pct: 2250,
  founder_days_production: 30,
  founder_rate_per_day: 560, // LOCKED ($84K/yr full-time, $16,800 production share)
  founder_fte_pct: 100,
  founder_total_days_per_year: 150, // 30 prod + 50 fundraising + 25 commercial + 45 governance
  admin_per_year: 14700,
  field_travel_per_year: 51000,
  local_freight_per_bed: 25, // local freight on Defy material (sits in stateKits)
  long_haul_freight_per_bed: 150, // marginal long-haul freight to remote community
  build_method: 'kits',
  location: 'sydney',
  containerise: false,
  retail_price: 750,
  commercial_low: 1500,
  commercial_high: 2000,
  capital_to_factory_low: 112000, // GROSS (was forbidden 90000)
  capital_to_factory_high: 222000, // GROSS (was forbidden 200000)
};

// ── Locked constants for the honest-story cards ──
const LEGS_SAVING_PER_BED = 194.05; // v6 in-house legs saving (NOT the full ~$259 state delta)
const ALREADY_INVESTED = 110046; // facility $100K + Carbatec $10,046
const NET_CAPITAL_LOW = DEFAULTS.capital_to_factory_low - ALREADY_INVESTED; // ~1,954
const NET_CAPITAL_HIGH = DEFAULTS.capital_to_factory_high - ALREADY_INVESTED; // ~111,954
const VOLUME_GATE = 300; // capex only sensible above ~300/yr committed
const CONTAINERISE_FREIGHT_DELTA = 70; // -$70/bed long-haul if containerised (ship plant once, not N beds)
const SHRED_FLOOR_PER_BED = 40; // 20kg × $2/kg (Defy INV-1731 shred SELL price)
const POLYMER_FLOOR_PER_BED = 16; // 20kg × $0.80/kg (Envirobank recycled HDPE — true physics floor)

const SHEET_URL = '#'; // TODO: replace with live Google Sheet link once Matt's playable model is uploaded

const LOCATIONS: Record<Location, { label: string; rentPerYear: number; inboundFreightPerBed: number }> = {
  sydney: { label: 'Sydney / Defy', rentPerYear: 0, inboundFreightPerBed: 0 },
  sunshine_coast: { label: 'Sunshine Coast (Kirmos)', rentPerYear: 54000, inboundFreightPerBed: 30 },
  on_country: { label: 'On-Country', rentPerYear: 24000, inboundFreightPerBed: 60 },
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
  founder_rate_per_day: 'LOCKED $560/day ($84K/yr full-time)',
  long_haul_freight_per_bed: 'v6 marginal long-haul freight',
  local_freight_per_bed: 'local freight on Defy material',
  retail_price: 'supplier-quotes.ts canonical',
  commercial_low: 'AU retail/contract scan (inferred, no firm quotes)',
  commercial_high: 'AU retail/contract scan (inferred, no firm quotes)',
};

interface Slider {
  key: keyof Inputs;
  label: string;
  group: 'Materials' | 'Labour & throughput' | 'Fixed block & volume' | 'Market & capital';
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
  // Fixed block & volume
  { key: 'beds_per_year', label: 'Beds per year', group: 'Fixed block & volume', min: 50, max: 2000, step: 10 },
  { key: 'kirmos_monthly_50pct', label: 'Kirmos monthly (50% on beds)', group: 'Fixed block & volume', min: 0, max: 5000, step: 100, prefix: '$' },
  { key: 'founder_days_production', label: 'Founder days/yr on production', group: 'Fixed block & volume', min: 0, max: 100, step: 5, suffix: 'd' },
  { key: 'founder_rate_per_day', label: 'Founder rate $/day', group: 'Fixed block & volume', min: 400, max: 1500, step: 20, prefix: '$' },
  { key: 'founder_total_days_per_year', label: 'Founder days/yr on Goods (all)', group: 'Fixed block & volume', min: 0, max: 250, step: 5, suffix: 'd' },
  { key: 'admin_per_year', label: 'Admin $/yr', group: 'Fixed block & volume', min: 0, max: 50000, step: 1000, prefix: '$' },
  { key: 'field_travel_per_year', label: 'Field travel $/yr', group: 'Fixed block & volume', min: 0, max: 150000, step: 5000, prefix: '$' },
  { key: 'local_freight_per_bed', label: 'Local freight $/bed', group: 'Fixed block & volume', min: 0, max: 100, step: 5, prefix: '$' },
  { key: 'long_haul_freight_per_bed', label: 'Long-haul freight $/bed', group: 'Fixed block & volume', min: 0, max: 500, step: 10, prefix: '$' },
  // Market & capital
  { key: 'retail_price', label: 'Retail / institutional price', group: 'Market & capital', min: 400, max: 1500, step: 25, prefix: '$' },
  { key: 'commercial_low', label: 'Commercial counterfactual low', group: 'Market & capital', min: 1000, max: 2500, step: 50, prefix: '$' },
  { key: 'commercial_high', label: 'Commercial counterfactual high', group: 'Market & capital', min: 1000, max: 3000, step: 50, prefix: '$' },
  { key: 'capital_to_factory_low', label: 'Capital ask GROSS (low)', group: 'Market & capital', min: 50000, max: 500000, step: 2000, prefix: '$' },
  { key: 'capital_to_factory_high', label: 'Capital ask GROSS (high)', group: 'Market & capital', min: 50000, max: 500000, step: 2000, prefix: '$' },
];

// ── Scenario presets — set every dial at once ──
interface Preset {
  key: string;
  label: string;
  hint: string;
  values: Partial<Inputs>;
}
const PRESETS: Preset[] = [
  { key: 'today', label: 'Today (Buy-Kit, 120/yr)', hint: 'Honest current run-rate', values: { beds_per_year: 120, build_method: 'kits', location: 'sydney', containerise: false, founder_fte_pct: 100 } },
  { key: 'insource', label: 'In-source assembly (~250/yr)', hint: 'Assemble in-house, still buy kits', values: { beds_per_year: 250, build_method: 'kits', location: 'sunshine_coast', containerise: false, founder_fte_pct: 100 } },
  { key: 'factory', label: 'Factory at target (500/yr)', hint: 'Shred → press → CNC in-house', values: { beds_per_year: 500, build_method: 'factory', location: 'sunshine_coast', containerise: false, founder_fte_pct: 100 } },
  { key: 'container', label: 'On-Country container (500/yr)', hint: 'Mobile plant to the feedstock', values: { beds_per_year: 500, build_method: 'factory', location: 'on_country', containerise: true, founder_fte_pct: 100 } },
  { key: 'community', label: 'Community vision (1,000/yr)', hint: 'Free feedstock + community labour', values: { beds_per_year: 1000, build_method: 'community', location: 'on_country', containerise: true, founder_fte_pct: 100 } },
];

const METHOD_LABELS: Record<BuildMethod, string> = {
  kits: 'Defy Kits (today)',
  panels: 'Defy Panels',
  factory: 'Factory (in-house)',
  community: 'Community (vision)',
};

// Derive everything from inputs — this is the model.
function computeModel(i: Inputs) {
  const loc = LOCATIONS[i.location];
  const hdpeRawCost = i.hdpe_kg_per_bed * i.hdpe_per_kg_landed;

  // Containerisation cuts long-haul freight (ship the plant + feedstock once, not N finished 26kg beds).
  const longHaulFreight = Math.max(0, i.long_haul_freight_per_bed - (i.containerise ? CONTAINERISE_FREIGHT_DELTA : 0));

  // ── Direct cost per state (stateKits already bakes in local freight + assembly) ──
  const stateKits = i.defy_kit_per_bed + i.steel_per_bed + i.canvas_per_bed + i.hardware_per_bed + (i.labour_per_day / i.defy_kits_beds_per_day) + i.local_freight_per_bed;
  const statePanels = i.defy_panel_each * 2 + i.steel_per_bed + i.canvas_per_bed + i.hardware_per_bed + i.diesel_per_bed_panels + (i.labour_per_day / i.defy_panels_beds_per_day);
  const stateFactory = hdpeRawCost + i.diesel_per_bed_factory + (i.labour_per_day / i.factory_beds_per_day) + i.steel_per_bed + i.canvas_per_bed + i.hardware_per_bed + loc.inboundFreightPerBed;
  const stateCommunity = 0 + i.diesel_per_bed_factory + i.steel_per_bed + i.canvas_per_bed + i.hardware_per_bed + loc.inboundFreightPerBed; // free plastic, volunteer labour

  // ── MARGINAL cost/bed = state direct + long-haul freight (the cash cost of one more bed) ──
  const marginalKit = stateKits + longHaulFreight;
  const marginalPanel = statePanels + longHaulFreight;
  const marginalFactory = stateFactory + longHaulFreight;
  const marginalCommunity = stateCommunity + longHaulFreight;

  // Selected method
  const selectedDirect =
    i.build_method === 'kits' ? stateKits
    : i.build_method === 'panels' ? statePanels
    : i.build_method === 'factory' ? stateFactory
    : stateCommunity;
  const selectedMarginal =
    i.build_method === 'kits' ? marginalKit
    : i.build_method === 'panels' ? marginalPanel
    : i.build_method === 'factory' ? marginalFactory
    : marginalCommunity;

  // ── ANNUAL FIXED BLOCK (a block to fund, NOT a per-bed tax) ──
  // Founder cost flows off the FTE dial; production share is the only part that touches unit cost.
  const fteFactor = i.founder_fte_pct / 100;
  const founderTotalCost = i.founder_rate_per_day * i.founder_total_days_per_year * fteFactor; // ~$84K at 100%
  const founderProductionCost = i.founder_rate_per_day * i.founder_days_production * fteFactor; // ~$16,800 at 100%
  const kirmosAnnual = i.kirmos_monthly_50pct * 12;
  // Fixed block = the recurring overhead you fund regardless of unit volume.
  // Production-founder share + Kirmos facility + admin + field travel + selected-location rent.
  const fixedBlock = founderProductionCost + kirmosAnnual + i.admin_per_year + i.field_travel_per_year + loc.rentPerYear;

  // ── BREAKEVEN beds/yr = fixed block ÷ contribution/bed (price − marginal) ──
  const contributionKit = i.retail_price - marginalKit;
  const contributionFactory = i.retail_price - marginalFactory;
  const contributionSelected = i.retail_price - selectedMarginal;
  const breakevenKit = contributionKit > 0 ? Math.round(fixedBlock / contributionKit) : Infinity;
  const breakevenFactory = contributionFactory > 0 ? Math.round(fixedBlock / contributionFactory) : Infinity;
  const breakevenSelected = contributionSelected > 0 ? Math.round(fixedBlock / contributionSelected) : Infinity;

  // ── Fully-loaded (DEMOTED reference only — fixed-cost absorption at pilot volume, NOT marginal) ──
  const fixedPerBed = fixedBlock / i.beds_per_year;
  const fullKits = marginalKit + fixedPerBed;
  const fullPanels = marginalPanel + fixedPerBed;
  const fullFactory = marginalFactory + fixedPerBed;
  const fullCommunity = marginalCommunity + fixedPerBed;

  // Margin matrix (vs marginal — the honest contribution)
  const marginKits = i.retail_price - marginalKit;
  const marginPanels = i.retail_price - marginalPanel;
  const marginFactory = i.retail_price - marginalFactory;
  const marginCommunity = i.retail_price - marginalCommunity;

  // ── Idiot index: BOTH floors ──
  const idiotKitShred = i.defy_kit_per_bed / SHRED_FLOOR_PER_BED; // ~8.6×
  const idiotKitPolymer = i.defy_kit_per_bed / POLYMER_FLOOR_PER_BED; // ~21.5×
  const idiotPanelShred = (i.defy_panel_each * 2) / SHRED_FLOOR_PER_BED;
  const idiotSteel = i.steel_per_bed / 10.34;
  const idiotCanvas = i.canvas_per_bed / 35;

  // Counterfactual — computed against MARGINAL (honest), labelled inferred.
  const counterfactualMid = (i.commercial_low + i.commercial_high) / 2;
  const valueVsCommercial = counterfactualMid / marginalFactory;

  // ── Capital payback on the v6 in-house legs saving ($194.05/bed), NOT the full state delta ──
  const capitalLow = i.capital_to_factory_low;
  const capitalHigh = i.capital_to_factory_high;
  const savingsPerBed = LEGS_SAVING_PER_BED;
  const paybackBedsLow = capitalLow / savingsPerBed;
  const paybackBedsHigh = capitalHigh / savingsPerBed;
  const paybackYearsLow = paybackBedsLow / i.beds_per_year;
  const paybackYearsHigh = paybackBedsHigh / i.beds_per_year;
  const belowVolumeGate = i.beds_per_year < VOLUME_GATE;

  return {
    hdpeRawCost, longHaulFreight,
    stateKits, statePanels, stateFactory, stateCommunity,
    marginalKit, marginalPanel, marginalFactory, marginalCommunity,
    selectedDirect, selectedMarginal,
    founderTotalCost, founderProductionCost, fixedBlock, fixedPerBed,
    contributionKit, contributionFactory, contributionSelected,
    breakevenKit, breakevenFactory, breakevenSelected,
    fullKits, fullPanels, fullFactory, fullCommunity,
    marginKits, marginPanels, marginFactory, marginCommunity,
    idiotKitShred, idiotKitPolymer, idiotPanelShred, idiotSteel, idiotCanvas,
    counterfactualMid, valueVsCommercial,
    capitalLow, capitalHigh, savingsPerBed, paybackBedsLow, paybackBedsHigh, paybackYearsLow, paybackYearsHigh, belowVolumeGate,
  };
}

export function CostModelExplorer() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const model = useMemo(() => computeModel(inputs), [inputs]);

  function setInput<K extends keyof Inputs>(key: K, val: Inputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: val }));
  }
  function applyPreset(p: Preset) {
    setInputs((prev) => ({ ...prev, ...p.values }));
  }
  function resetAll() {
    setInputs(DEFAULTS);
  }

  const grouped = SLIDERS.reduce((acc, s) => {
    if (!acc[s.group]) acc[s.group] = [];
    acc[s.group].push(s);
    return acc;
  }, {} as Record<string, Slider[]>);

  const breakevenLabel = (n: number) => (Number.isFinite(n) ? `${n.toLocaleString('en-AU')}` : '—');

  return (
    <div className="space-y-6">
      {/* ── Scenario presets ── */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wide text-gray-500 font-semibold mr-1">Scenarios:</span>
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => applyPreset(p)}
            title={p.hint}
            className="text-xs rounded-full border border-gray-300 px-3 py-1.5 hover:border-gray-900 hover:bg-gray-50 transition-colors"
          >
            {p.label}
          </button>
        ))}
        <button onClick={resetAll} className="text-xs underline text-gray-500 hover:text-gray-900 ml-1">
          Reset
        </button>
      </div>

      {/* ── HERO CARDS — lead with marginal / fixed / breakeven / payback ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Marginal cost / bed</p>
            <p className="text-3xl font-bold tabular-nums">{fmt(model.marginalKit)}</p>
            <p className="text-xs text-gray-600 mt-1">
              Buy-Kit today → <span className="text-emerald-700 font-medium">{fmt(model.marginalFactory)}</span> Factory
            </p>
            <p className="text-[10px] text-gray-500 mt-1">Cash cost of one more bed (direct + long-haul freight)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Annual fixed block</p>
            <p className="text-3xl font-bold tabular-nums">{fmt(model.fixedBlock)}<span className="text-base font-normal text-gray-500">/yr</span></p>
            <p className="text-xs text-gray-600 mt-1">A block to <strong>fund</strong>, not a per-bed tax</p>
            <p className="text-[10px] text-gray-500 mt-1">Founder production share + facility + admin + field + rent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Breakeven beds / yr</p>
            <p className="text-3xl font-bold tabular-nums text-amber-700">{breakevenLabel(model.breakevenFactory)}</p>
            <p className="text-xs text-gray-600 mt-1">
              Factory · Buy-Kit needs <span className="tabular-nums">{breakevenLabel(model.breakevenKit)}</span>
            </p>
            <p className="text-[10px] text-gray-500 mt-1">Fixed block ÷ contribution/bed ({fmt(model.contributionFactory)})</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Capital payback</p>
            <p className="text-3xl font-bold tabular-nums">
              {model.belowVolumeGate ? '—' : `${model.paybackYearsLow.toFixed(1)}-${model.paybackYearsHigh.toFixed(1)}y`}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {fmt(model.capitalLow)}-{fmt(model.capitalHigh)} gross
            </p>
            <p className="text-[10px] text-gray-500 mt-1">
              ~{fmt(NET_CAPITAL_LOW)}-{fmt(NET_CAPITAL_HIGH)} net after {fmt(ALREADY_INVESTED)} invested
            </p>
          </CardContent>
        </Card>
      </div>

      {/* DEMOTED reference row — the old headline */}
      <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-xs text-gray-600 flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="font-semibold text-gray-700">Reference only:</span>
        <span>
          Fully-loaded Buy-Kit at {inputs.beds_per_year}/yr ={' '}
          <span className="tabular-nums font-medium text-gray-800">{fmt(model.fullKits)}</span>
        </span>
        <span className="text-gray-500 italic">
          — fixed-cost absorption at pilot volume, NOT a marginal cost. Falls to{' '}
          {fmt(model.marginalFactory)} marginal at scale.
        </span>
      </div>

      {model.belowVolumeGate && (
        <div className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          <strong>Capital only sensible above ~{VOLUME_GATE}/yr committed</strong> — at {inputs.beds_per_year} beds/yr,
          buy Defy kits rather than build the factory. The {fmt(LEGS_SAVING_PER_BED)}/bed in-house legs saving doesn&apos;t
          recoup {fmt(model.capitalLow)}-{fmt(model.capitalHigh)} of capex below committed volume.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
        {/* ── Controls panel: 3 hero dials + Advanced disclosure ── */}
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Hero dials</h2>
              <button onClick={resetAll} className="text-xs underline text-gray-600 hover:text-gray-900">
                Reset to locked defaults
              </button>
            </div>

            {/* Hero dial 1: beds/yr */}
            <div className="text-sm">
              <div className="flex justify-between items-baseline mb-1">
                <label className="text-gray-700 font-medium">Beds per year</label>
                <span className="tabular-nums font-semibold">{inputs.beds_per_year.toLocaleString('en-AU')}</span>
              </div>
              <input
                type="range" min={50} max={2000} step={10}
                value={inputs.beds_per_year}
                onChange={(e) => setInput('beds_per_year', parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-[10px] text-gray-500 mt-0.5">Today ~100-150. Gate for capex is ~{VOLUME_GATE}/yr committed.</p>
            </div>

            {/* Hero dial 2: build method */}
            <div className="text-sm">
              <label className="text-gray-700 font-medium block mb-1.5">Build method</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(METHOD_LABELS) as BuildMethod[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setInput('build_method', m)}
                    className={`text-xs rounded border px-2 py-1.5 transition-colors ${
                      inputs.build_method === m ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {METHOD_LABELS[m]}
                  </button>
                ))}
              </div>
            </div>

            {/* Hero dial 3: founder FTE */}
            <div className="text-sm">
              <div className="flex justify-between items-baseline mb-1.5">
                <label className="text-gray-700 font-medium">Founder FTE %</label>
                <span className="tabular-nums font-semibold">{inputs.founder_fte_pct}% · {fmt(model.founderTotalCost)}/yr</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setInput('founder_fte_pct', pct)}
                    className={`text-xs rounded border px-2 py-1.5 transition-colors ${
                      inputs.founder_fte_pct === pct ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-gray-500 mt-1">Anchored to $140K/yr full-time ({fmt(560)}/day × 250d). Flows to the fixed block.</p>
            </div>

            {/* Location + containerise */}
            <div className="text-sm space-y-3 border-t pt-4">
              <div>
                <label className="text-gray-700 font-medium block mb-1.5">Production location</label>
                <select
                  value={inputs.location}
                  onChange={(e) => setInput('location', e.target.value as Location)}
                  className="w-full text-sm border border-gray-300 rounded px-2 py-1.5"
                >
                  {(Object.keys(LOCATIONS) as Location[]).map((l) => (
                    <option key={l} value={l}>
                      {LOCATIONS[l].label} — rent {fmt(LOCATIONS[l].rentPerYear)}/yr, in-freight {fmt(LOCATIONS[l].inboundFreightPerBed)}/bed
                    </option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.containerise}
                  onChange={(e) => setInput('containerise', e.target.checked)}
                />
                <span className="text-gray-700">Containerise (mobile plant) — long-haul freight −{fmt(CONTAINERISE_FREIGHT_DELTA)}/bed</span>
              </label>
            </div>

            {/* Advanced disclosure: all raw sliders */}
            <details className="border-t pt-4">
              <summary className="text-xs uppercase tracking-wide text-gray-500 font-semibold cursor-pointer hover:text-gray-900">
                Advanced — edit all assumptions
              </summary>
              <div className="space-y-6 mt-4">
                {Object.entries(grouped).map(([group, sliders]) => (
                  <div key={group}>
                    <h3 className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-3">{group}</h3>
                    <div className="space-y-3">
                      {sliders.map((s) => {
                        const val = inputs[s.key] as number;
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
                              onChange={(e) => setInput(s.key, parseFloat(e.target.value) as Inputs[typeof s.key])}
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
              </div>
            </details>
          </CardContent>
        </Card>

        {/* ── Output panels ── */}
        <div className="space-y-6">
          {/* Marginal vs breakeven matrix */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-1">Marginal cost &amp; breakeven (4 supply paths)</h3>
              <p className="text-xs text-gray-600 mb-3">
                Marginal = the cash cost of one more bed. Contribution = price − marginal, funds the{' '}
                {fmt(model.fixedBlock)}/yr fixed block. Breakeven = beds/yr to cover it.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-gray-500 border-b">
                    <tr>
                      <th className="pb-2">Path</th>
                      <th className="pb-2 text-right">Marginal $/bed</th>
                      <th className="pb-2 text-right">Contribution @ {fmt(inputs.retail_price)}</th>
                      <th className="pb-2 text-right">Breakeven beds/yr</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Defy Kits (today)</td>
                      <td className="py-2 text-right tabular-nums">{fmt(model.marginalKit)}</td>
                      <td className="py-2 text-right tabular-nums">{fmt(model.marginKits)}</td>
                      <td className="py-2 text-right tabular-nums">{breakevenLabel(model.breakevenKit)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 font-medium">Defy Panels</td>
                      <td className="py-2 text-right tabular-nums">{fmt(model.marginalPanel)}</td>
                      <td className="py-2 text-right tabular-nums">{fmt(model.marginPanels)}</td>
                      <td className="py-2 text-right tabular-nums">{breakevenLabel(model.contributionSelected > 0 ? Math.round(model.fixedBlock / (inputs.retail_price - model.marginalPanel)) : Infinity)}</td>
                    </tr>
                    <tr className="border-b bg-emerald-50/50">
                      <td className="py-2 font-medium">Factory (in-house target)</td>
                      <td className="py-2 text-right tabular-nums font-medium text-emerald-700">{fmt(model.marginalFactory)}</td>
                      <td className="py-2 text-right tabular-nums font-medium text-emerald-700">{fmt(model.marginFactory)}</td>
                      <td className="py-2 text-right tabular-nums font-medium text-emerald-700">{breakevenLabel(model.breakevenFactory)}</td>
                    </tr>
                    <tr className="bg-purple-50/50">
                      <td className="py-2 font-medium">Community (vision)</td>
                      <td className="py-2 text-right tabular-nums">{fmt(model.marginalCommunity)}</td>
                      <td className="py-2 text-right tabular-nums font-medium text-purple-700">{fmt(model.marginCommunity)}</td>
                      <td className="py-2 text-right tabular-nums">{breakevenLabel(inputs.retail_price - model.marginalCommunity > 0 ? Math.round(model.fixedBlock / (inputs.retail_price - model.marginalCommunity)) : Infinity)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Founder FTE teaching card */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-1">Founder time — per-bed wrong vs right</h3>
              <p className="text-xs text-gray-600 mb-4">
                A founder wage spread over today&apos;s low volume reads like a {fmt(1500)}/bed &ldquo;cost&rdquo; — that&apos;s
                fixed-cost absorption, not a unit cost. The honest treatment: the <strong>production share only</strong> touches
                a bed; the rest is a fixed block that falls per-bed as volume grows.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="border rounded p-3 bg-red-50 border-red-200">
                  <p className="text-xs uppercase tracking-wide text-red-700">Per-bed WRONG</p>
                  <p className="text-2xl font-bold tabular-nums text-red-700 mt-1">{fmt(model.founderTotalCost / inputs.beds_per_year)}</p>
                  <p className="text-[10px] text-gray-600 mt-1">Whole founder wage ÷ {inputs.beds_per_year} beds — absorption artefact</p>
                </div>
                <div className="border rounded p-3 bg-emerald-50 border-emerald-200">
                  <p className="text-xs uppercase tracking-wide text-emerald-700">Per-bed RIGHT (production share)</p>
                  <p className="text-2xl font-bold tabular-nums text-emerald-700 mt-1">{fmt(model.founderProductionCost / inputs.beds_per_year)}</p>
                  <p className="text-[10px] text-gray-600 mt-1">Production days only ÷ {inputs.beds_per_year} beds</p>
                </div>
                <div className="border rounded p-3">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Fixed founder block</p>
                  <p className="text-2xl font-bold tabular-nums mt-1">{fmt(model.founderTotalCost)}<span className="text-sm font-normal text-gray-500">/yr</span></p>
                  <p className="text-[10px] text-gray-600 mt-1">At {inputs.founder_fte_pct}% FTE · fund it, don&apos;t tax each bed</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-4">
                <strong>Enterprise economics (founder wage fully loaded):</strong> at {inputs.beds_per_year} beds/yr, contribution{' '}
                of {fmt(model.contributionSelected)}/bed × {inputs.beds_per_year} = {fmt(model.contributionSelected * inputs.beds_per_year)}{' '}
                vs the {fmt(model.fixedBlock)}/yr fixed block →{' '}
                <span className={model.contributionSelected * inputs.beds_per_year >= model.fixedBlock ? 'text-emerald-700 font-medium' : 'text-red-700 font-medium'}>
                  {fmt(model.contributionSelected * inputs.beds_per_year - model.fixedBlock)} {model.contributionSelected * inputs.beds_per_year >= model.fixedBlock ? 'surplus' : 'shortfall'}
                </span>{' '}
                before grant offset. If it only stacks up at 0% founder FTE, this card shows it.
              </p>
            </CardContent>
          </Card>

          {/* Idiot Index — BOTH floors */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">Idiot Index — first-principles markup</h3>
              <p className="text-xs text-gray-600 mb-4">
                Musk&apos;s metric: <code>finished cost ÷ raw material cost</code>. The legs carry the entire prize.
                Against Defy&apos;s shred SELL price ({fmt(SHRED_FLOOR_PER_BED)}/bed = 20kg × $2/kg) the kit is{' '}
                <strong className="text-amber-700">{model.idiotKitShred.toFixed(1)}×</strong>. Against the true polymer
                physics floor ({fmt(POLYMER_FLOOR_PER_BED)}/bed = 20kg × $0.80/kg Envirobank recycled HDPE) it is{' '}
                <strong className="text-red-700">{model.idiotKitPolymer.toFixed(1)}×</strong>. That gap, times volume, is the
                in-housing case.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <IdiotCard label="HDPE kit vs shred $40" ratio={model.idiotKitShred} raw={SHRED_FLOOR_PER_BED} current={inputs.defy_kit_per_bed} />
                <IdiotCard label="HDPE kit vs polymer $16" ratio={model.idiotKitPolymer} raw={POLYMER_FLOOR_PER_BED} current={inputs.defy_kit_per_bed} />
                <IdiotCard label="Steel poles" ratio={model.idiotSteel} raw={10.34} current={inputs.steel_per_bed} />
                <IdiotCard label="Canvas" ratio={model.idiotCanvas} raw={35} current={inputs.canvas_per_bed} />
              </div>
              <p className="text-[10px] text-gray-500 mt-3">
                Floor stated as mass × raw $/kg, not a vendor price. 20kg of plastic that costs ~{fmt(POLYMER_FLOOR_PER_BED)}-{fmt(SHRED_FLOOR_PER_BED)}{' '}
                of raw material sits inside a {fmt(inputs.defy_kit_per_bed)} part.
              </p>
            </CardContent>
          </Card>

          {/* Capital ask + payback */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-3">Capital ask + payback (QBE-ready)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="border rounded p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Capital ask (GROSS)</p>
                  <p className="text-2xl font-bold tabular-nums mt-1">
                    {fmt(model.capitalLow)}-{fmt(model.capitalHigh)}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    ~{fmt(NET_CAPITAL_LOW)}-{fmt(NET_CAPITAL_HIGH)} net after {fmt(ALREADY_INVESTED)} invested
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">Shredder + hot-press + CNC + workbench. Different quantity from the QBE match cap.</p>
                </div>
                <div className="border rounded p-4 bg-emerald-50/50">
                  <p className="text-xs text-emerald-700 uppercase tracking-wide">In-house legs saving</p>
                  <p className="text-2xl font-bold tabular-nums text-emerald-700 mt-1">{fmt(model.savingsPerBed)}</p>
                  <p className="text-xs text-gray-600 mt-2">Per bed, once pressing the legs in-house (v6)</p>
                </div>
                <div className="border rounded p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Payback @ {inputs.beds_per_year}/yr</p>
                  <p className="text-2xl font-bold tabular-nums mt-1">
                    {model.belowVolumeGate ? '—' : `${model.paybackYearsLow.toFixed(1)}-${model.paybackYearsHigh.toFixed(1)}y`}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    {model.belowVolumeGate
                      ? `Below ~${VOLUME_GATE}/yr gate — buy kits`
                      : `${Math.round(model.paybackBedsLow).toLocaleString('en-AU')}-${Math.round(model.paybackBedsHigh).toLocaleString('en-AU')} beds to recoup`}
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-4">
                <strong>The QBE pitch:</strong> invest {fmt(model.capitalLow)}-{fmt(model.capitalHigh)} gross
                (~{fmt(NET_CAPITAL_LOW)}-{fmt(NET_CAPITAL_HIGH)} net) to press the legs in-house. Marginal cost drops from{' '}
                {fmt(model.marginalKit)} (Buy-Kit) to {fmt(model.marginalFactory)} (Factory) — the{' '}
                {fmt(model.savingsPerBed)}/bed legs saving.{' '}
                {model.belowVolumeGate
                  ? `At ${inputs.beds_per_year}/yr it does NOT pay back — capex is only sensible above ~${VOLUME_GATE}/yr committed.`
                  : `At ${inputs.beds_per_year} beds/yr the capital pays back in ${model.paybackYearsLow.toFixed(1)}-${model.paybackYearsHigh.toFixed(1)} years, then every future bed delivers ${fmt(model.savingsPerBed)} more to community.`}
              </p>
              <p className="text-xs text-gray-600 mt-3">
                Commercial counterfactual: {fmt(inputs.commercial_low)}-{fmt(inputs.commercial_high)} (inferred, no firm quotes).
                Factory marginal is {model.valueVsCommercial.toFixed(1)}× cheaper than a commercial bed.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Provenance footer ── */}
      <div className="pt-4 border-t space-y-2 text-center">
        <p className="text-xs text-gray-500">
          <Badge variant="outline" className="mr-2 text-[10px]">verified / modelled · not audited</Badge>
          Sources: <code>cost-model-scenarios.json</code> (v5, founder $560/day) + <code>01-cost-model-idiot-index.json</code> (v6) +{' '}
          <code>supplier-quotes.ts</code>. BOM verified from invoice OCR; overhead + counterfactual are modelled. ~89% grant-funded.
        </p>
        <p className="text-xs text-gray-400">
          <a href={SHEET_URL} className="underline hover:text-gray-700">Open the full model (Google Sheet)</a>
          {SHEET_URL === '#' && <span className="ml-1 italic">— link pending upload</span>}
          {' · '}Change a dial to test an assumption — the page is read-only of the underlying canonical numbers.
        </p>
      </div>
    </div>
  );
}

function IdiotCard({ label, ratio, raw, current }: { label: string; ratio: number; raw: number; current: number }) {
  const color =
    ratio >= 10 ? 'border-red-300 bg-red-50 text-red-700'
    : ratio >= 5 ? 'border-red-300 bg-red-50 text-red-700'
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
