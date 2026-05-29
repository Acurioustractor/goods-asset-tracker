/**
 * Cost-model ENGINE — presentation-agnostic.
 *
 * This is the single VERIFIED compute core for the Goods bed cost model, lifted
 * verbatim out of the old `/admin/cost-model` explorer so that multiple UI skins
 * (Mission Control / Tesla / Terminal) can share ONE engine and reconcile to the
 * same locked numbers. NO MATH CHANGED in this extraction.
 *
 * Output hierarchy (the QBE-ready stack, post-2026-05-29 lock):
 *   1. Marginal cost/bed   (~$685 Buy-Kit today → ~$426 Factory)  — the cash cost of one more bed
 *   2. Annual fixed block  (~$109,500/yr)                          — a block to FUND, not a per-bed tax
 *   3. Breakeven beds/yr   (~338 Factory)                          — fixed block ÷ contribution/bed
 *   4. Capital payback                                             — on the $194.05/bed in-house legs saving
 *
 * The old "fully-loaded at pilot volume" (~$1,912-equivalent, `fullKits`) is DEMOTED to a small,
 * clearly-labelled reference figure — it is a fixed-cost-absorption artefact at low volume, NOT a
 * marginal cost, and it must never headline an investor view again.
 *
 * Canonical numbers are locked in `cost-model-scenarios.json` (v5+, founder $560/day) and
 * `01-cost-model-idiot-index.json` (v6). Defaults below mirror those locked values.
 *
 * LOCKED (2026-05-29): founder $560/day, $84K/yr, production share $16,800; fixed block ~$109,500;
 * marginal Buy-Kit $684.79 / Factory $425.74; breakeven 338 (Factory); idiot index 8.6× (shred $40) +
 * 21.5× (polymer $16); capital $112-222K gross / ~$2-112K net; price $750; in-house legs saving $194.05/bed.
 */
import {
  CostModelDefaults,
  LOCATIONS,
  LEGS_SAVING_PER_BED,
  ALREADY_INVESTED,
  SHRED_FLOOR_PER_BED,
  POLYMER_FLOOR_PER_BED,
  STEEL_RAW_FLOOR_PER_BED,
  CANVAS_RAW_FLOOR_PER_BED,
  type CostModelInputs,
  type BuildMethod,
  type CostModelLocation as Location,
} from '@/lib/data/cost-model-scenarios';

// Re-export the data-layer pieces the skins consume so they have a single import surface.
export {
  LOCATIONS,
  LEGS_SAVING_PER_BED,
  ALREADY_INVESTED,
  SHRED_FLOOR_PER_BED,
  POLYMER_FLOOR_PER_BED,
  STEEL_RAW_FLOOR_PER_BED,
  CANVAS_RAW_FLOOR_PER_BED,
};
export type { CostModelInputs, BuildMethod, Location };

export type Inputs = CostModelInputs;

// ── Locked canonical defaults live in the data layer (SSOT):
//    cost-model-scenarios.ts maps cost-model-scenarios.json + supplier-quotes.ts
//    into the exact Inputs shape and exports the named constants above.
export const DEFAULTS: Inputs = CostModelDefaults;

export const NET_CAPITAL_LOW = DEFAULTS.capital_to_factory_low - ALREADY_INVESTED; // ~1,954
export const NET_CAPITAL_HIGH = DEFAULTS.capital_to_factory_high - ALREADY_INVESTED; // ~111,954
export const VOLUME_GATE = 300; // capex only sensible above ~300/yr committed
export const CONTAINERISE_FREIGHT_DELTA = 70; // -$70/bed long-haul if containerised (ship plant once, not N beds)

export const SHEET_URL = '#'; // TODO: replace with live Google Sheet link once Matt's playable model is uploaded

// ── Formatters (shared) ─────────────────────────────────────────────────────
export function fmt(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: Math.abs(n) < 10 ? 2 : 0 }).format(n);
}
/** Currency with explicit cents (for monospace telemetry where every cent reconciles). */
export function fmtCents(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}
export function fmtPct(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return `${Math.round(n * 100)}%`;
}
export function fmtInt(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-AU');
}
export function breakevenLabel(n: number): string {
  return Number.isFinite(n) ? `${n.toLocaleString('en-AU')}` : '—';
}

/** Divide-by-zero guard for per-bed / per-day / contribution division. */
export function safeDiv(num: number, den: number, fallback = 0): number {
  return den !== 0 && Number.isFinite(num / den) ? num / den : fallback;
}

export const VERIFIED_HINTS: Partial<Record<keyof Inputs, string>> = {
  hdpe_kg_per_bed: 'Ben confirmed (one sheet)',
  hdpe_per_kg_landed: '$2/kg shred + $0.75/kg delivery (Defy INV-1731)',
  defy_kit_per_bed: 'INV-1602 + INV-1732 verified',
  defy_panel_each: 'INV-1731 (20 panels @ $200 bulk)',
  steel_per_bed: 'DNA Steel canonical (Notion)',
  canvas_per_bed: 'Centre Canvas verified (3 invoices 2026)',
  hardware_per_bed: 'Coastal Fasteners verified ($3.20 caps + $1.04 16-screws + $1.00 2-bolts)',
  defy_assembly_per_bed: 'Defy 2026-03-19 invoice verified',
  community_labour_per_bed: 'v6 fair wage — $130 default, band $100-$160 (inferred). Plastic stays $0 (free, community-collected)',
  founder_rate_per_day: 'LOCKED $560/day ($84K/yr full-time)',
  long_haul_freight_per_bed: 'v6 marginal long-haul freight',
  local_freight_per_bed: 'local freight on Defy material',
  retail_price: 'supplier-quotes.ts canonical',
  commercial_low: 'AU retail/contract scan (inferred, no firm quotes)',
  commercial_high: 'AU retail/contract scan (inferred, no firm quotes)',
};

export type SliderGroup = 'Materials' | 'Labour & throughput' | 'Fixed block & volume' | 'Market & capital';

export interface Slider {
  key: keyof Inputs;
  label: string;
  group: SliderGroup;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
}

export const SLIDERS: Slider[] = [
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
  { key: 'community_labour_per_bed', label: 'Community labour $/bed (fair wage)', group: 'Labour & throughput', min: 100, max: 160, step: 5, prefix: '$' },
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
export interface Preset {
  key: string;
  label: string;
  hint: string;
  values: Partial<Inputs>;
}
export const PRESETS: Preset[] = [
  { key: 'today', label: 'Today (Buy-Kit, 120/yr)', hint: 'Honest current run-rate', values: { beds_per_year: 120, build_method: 'kits', location: 'sydney', containerise: false, founder_fte_pct: 100 } },
  { key: 'insource', label: 'In-source assembly (~250/yr)', hint: 'Assemble in-house, still buy kits', values: { beds_per_year: 250, build_method: 'kits', location: 'sunshine_coast', containerise: false, founder_fte_pct: 100 } },
  { key: 'factory', label: 'Factory at target (500/yr)', hint: 'Shred → press → CNC in-house', values: { beds_per_year: 500, build_method: 'factory', location: 'sunshine_coast', containerise: false, founder_fte_pct: 100 } },
  { key: 'container', label: 'On-Country container (500/yr)', hint: 'Mobile plant to the feedstock', values: { beds_per_year: 500, build_method: 'factory', location: 'on_country', containerise: true, founder_fte_pct: 100 } },
  { key: 'community', label: 'Community-owned (1,000/yr)', hint: 'Free feedstock + fair-wage community labour — parity with the factory, margin stays community-owned', values: { beds_per_year: 1000, build_method: 'community', location: 'on_country', containerise: true, founder_fte_pct: 100 } },
];

export const METHOD_LABELS: Record<BuildMethod, string> = {
  kits: 'Defy Kits (today)',
  panels: 'Defy Panels',
  factory: 'Factory (in-house)',
  community: 'Community-owned (parity)',
};

// Short labels for dense (terminal) layouts.
export const METHOD_LABELS_SHORT: Record<BuildMethod, string> = {
  kits: 'KITS',
  panels: 'PANELS',
  factory: 'FACTORY',
  community: 'COMMUNITY',
};

/**
 * Derive everything from inputs — this is the model.
 * VERBATIM from the original explorer (loop-2 fixes preserved): safeDiv, volume +
 * throughput clamps, containerise freight delta, per-path breakeven (each path
 * divides by its OWN contribution), demoted fully-loaded, BOTH idiot indices,
 * gross capital, founder-FTE factor.
 */
export function computeModel(raw: Inputs) {
  // Clamp volume + throughput dials to a positive minimum so per-bed / per-day
  // division can never blow up (presets arrive as Partial, sliders can hit min).
  const i: Inputs = {
    ...raw,
    beds_per_year: Math.max(1, raw.beds_per_year),
    factory_beds_per_day: Math.max(0.5, raw.factory_beds_per_day),
    defy_kits_beds_per_day: Math.max(0.5, raw.defy_kits_beds_per_day),
    defy_panels_beds_per_day: Math.max(0.5, raw.defy_panels_beds_per_day),
    community_beds_per_day: Math.max(0.5, raw.community_beds_per_day),
  };
  const loc = LOCATIONS[i.location];
  const hdpeRawCost = i.hdpe_kg_per_bed * i.hdpe_per_kg_landed;

  // Containerisation cuts long-haul freight (ship the plant + feedstock once, not N finished 26kg beds).
  const longHaulFreight = Math.max(0, i.long_haul_freight_per_bed - (i.containerise ? CONTAINERISE_FREIGHT_DELTA : 0));

  // ── Direct cost per state (stateKits already bakes in local freight + assembly) ──
  const stateKits = i.defy_kit_per_bed + i.steel_per_bed + i.canvas_per_bed + i.hardware_per_bed + safeDiv(i.labour_per_day, i.defy_kits_beds_per_day) + i.local_freight_per_bed;
  const statePanels = i.defy_panel_each * 2 + i.steel_per_bed + i.canvas_per_bed + i.hardware_per_bed + i.diesel_per_bed_panels + safeDiv(i.labour_per_day, i.defy_panels_beds_per_day);
  const stateFactory = hdpeRawCost + i.diesel_per_bed_factory + safeDiv(i.labour_per_day, i.factory_beds_per_day) + i.steel_per_bed + i.canvas_per_bed + i.hardware_per_bed + loc.inboundFreightPerBed;
  // v6: community state pays a FAIR WAGE ($130/bed default, band $100-$160). Plastic stays $0 (free, community-collected).
  // At default ($130, on-country freight $0 in sydney/default) this lands at $270.74 direct — economic PARITY with the
  // factory ($275.74, ~$5 below it), NOT the cheap/free-labour state. The margin stays community-owned dignified paid work.
  const stateCommunity = 0 + i.diesel_per_bed_factory + i.steel_per_bed + i.canvas_per_bed + i.hardware_per_bed + i.community_labour_per_bed + loc.inboundFreightPerBed; // free plastic + fair-wage labour

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
  // Each path divides by its OWN contribution; non-finite (price ≤ marginal) → Infinity,
  // rendered as '—'. (Previously the panel/community cells guarded on the selected
  // path's contribution but divided by a different path → negative breakeven at extremes.)
  const contributionKit = i.retail_price - marginalKit;
  const contributionPanel = i.retail_price - marginalPanel;
  const contributionFactory = i.retail_price - marginalFactory;
  const contributionCommunity = i.retail_price - marginalCommunity;
  const contributionSelected = i.retail_price - selectedMarginal;
  const breakevenFor = (contribution: number) =>
    contribution > 0 ? Math.round(fixedBlock / contribution) : Infinity;
  const breakevenKit = breakevenFor(contributionKit);
  const breakevenPanel = breakevenFor(contributionPanel);
  const breakevenFactory = breakevenFor(contributionFactory);
  const breakevenCommunity = breakevenFor(contributionCommunity);
  const breakevenSelected = breakevenFor(contributionSelected);

  // ── Fully-loaded (DEMOTED reference only — fixed-cost absorption at pilot volume, NOT marginal) ──
  const fixedPerBed = safeDiv(fixedBlock, i.beds_per_year);
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
  const idiotKitShred = safeDiv(i.defy_kit_per_bed, SHRED_FLOOR_PER_BED); // ~8.6×
  const idiotKitPolymer = safeDiv(i.defy_kit_per_bed, POLYMER_FLOOR_PER_BED); // ~21.5×
  const idiotPanelShred = safeDiv(i.defy_panel_each * 2, SHRED_FLOOR_PER_BED);
  const idiotSteel = safeDiv(i.steel_per_bed, STEEL_RAW_FLOOR_PER_BED);
  const idiotCanvas = safeDiv(i.canvas_per_bed, CANVAS_RAW_FLOOR_PER_BED);

  // Counterfactual — computed against MARGINAL (honest), labelled inferred.
  const counterfactualMid = (i.commercial_low + i.commercial_high) / 2;
  const valueVsCommercial = safeDiv(counterfactualMid, marginalFactory);

  // ── Capital payback on the v6 in-house legs saving ($194.05/bed), NOT the full state delta ──
  const capitalLow = i.capital_to_factory_low;
  const capitalHigh = i.capital_to_factory_high;
  const savingsPerBed = LEGS_SAVING_PER_BED;
  const paybackBedsLow = safeDiv(capitalLow, savingsPerBed);
  const paybackBedsHigh = safeDiv(capitalHigh, savingsPerBed);
  const paybackYearsLow = safeDiv(paybackBedsLow, i.beds_per_year);
  const paybackYearsHigh = safeDiv(paybackBedsHigh, i.beds_per_year);
  const belowVolumeGate = i.beds_per_year < VOLUME_GATE;

  return {
    hdpeRawCost, longHaulFreight,
    stateKits, statePanels, stateFactory, stateCommunity,
    marginalKit, marginalPanel, marginalFactory, marginalCommunity,
    selectedDirect, selectedMarginal,
    founderTotalCost, founderProductionCost, fixedBlock, fixedPerBed,
    contributionKit, contributionPanel, contributionFactory, contributionCommunity, contributionSelected,
    breakevenKit, breakevenPanel, breakevenFactory, breakevenCommunity, breakevenSelected,
    fullKits, fullPanels, fullFactory, fullCommunity,
    marginKits, marginPanels, marginFactory, marginCommunity,
    idiotKitShred, idiotKitPolymer, idiotPanelShred, idiotSteel, idiotCanvas,
    counterfactualMid, valueVsCommercial,
    capitalLow, capitalHigh, savingsPerBed, paybackBedsLow, paybackBedsHigh, paybackYearsLow, paybackYearsHigh, belowVolumeGate,
  };
}

export type CostModel = ReturnType<typeof computeModel>;
