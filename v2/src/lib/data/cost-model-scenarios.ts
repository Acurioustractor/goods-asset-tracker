/**
 * Bed cost model v4 — 4-path supply model (Factory / Defy Kits / Defy Panels /
 * Community) + Defy fully-fabricated reference state. Numbers locked 2026-05-28
 * via Notion BK review + Defy invoice OCR + Ben confirmations.
 *
 * All data lives in `cost-model-scenarios.json`. Canonical BOM mirrors
 * `supplier-quotes.ts`; this file adds the trajectory math + Idiot Index.
 *
 * Source: act-infra/scripts/ocr-defy-bills.mjs + ocr-bed-supplier-bills.mjs.
 */
import scenarios from './cost-model-scenarios.json';
import {
  fullyLoadedCostPerBed,
  stretchBedBOM,
  factoryDirectMaterials,
  WEBSITE_PRICE,
} from './supplier-quotes';

export type CostModelScenarios = typeof scenarios;

export type BuildStateKey =
  | 'state_2_defy_kits'
  | 'state_3_defy_panels'
  | 'state_4_factory'
  | 'state_5_community';

export interface BuildState {
  key: BuildStateKey;
  label: string;
  components: Array<{ label: string; amount: number }>;
  direct_total: number;
  capital_added: number;
  capital_cumulative: number;
  throughput_beds_per_day?: number;
}

export interface IdiotIndexRow {
  element: string;
  raw_low: number;
  raw_high: number;
  current: number;
  index_low: number;
  index_high: number;
  markup_pays_for: string;
}

export interface OverheadRow {
  label: string;
  beds_per_year: number;
  kirmos_per_bed: number;
  founder_production_per_bed: number;
  admin_per_bed: number;
  field_travel_per_bed: number;
  long_haul_freight_per_bed: number;
  overhead_total: number;
}

export interface FullyLoadedRow {
  volume_label: string;
  state_2_defy_kits: number;
  state_3_defy_panels: number;
  state_4_factory: number;
  state_5_community: number;
}

export interface MarginRow {
  path: string;
  direct: number;
  margin: number;
  margin_pct: number;
}

// ──────────────────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for the cost-model explorer (/admin/cost-model).
// The explorer imports CostModelDefaults + the named constants below instead of
// re-declaring ~30 inline literals. Values are mapped from this JSON +
// supplier-quotes.ts and reconcile to the locked canonical numbers (2026-05-29):
//   direct Buy-Kit 534.79 / Factory 275.74; marginal Buy-Kit 684.79 / Factory
//   425.74; fixed block 109,500; breakeven Factory 338 / Buy-Kit 1,679;
//   idiot 8.6× (shred $40) + 21.5× (polymer $16).
// ──────────────────────────────────────────────────────────────────────────

export type BuildMethod = 'kits' | 'panels' | 'factory' | 'community';
export type CostModelLocation = 'sydney' | 'sunshine_coast' | 'on_country';

export interface CostModelInputs {
  // Material per bed
  hdpe_kg_per_bed: number;
  hdpe_per_kg_landed: number;
  defy_kit_per_bed: number;
  defy_panel_each: number;
  steel_per_bed: number;
  canvas_per_bed: number;
  hardware_per_bed: number;
  // Labour
  labour_per_day: number;
  factory_beds_per_day: number;
  defy_kits_beds_per_day: number;
  defy_panels_beds_per_day: number;
  community_beds_per_day: number;
  defy_assembly_per_bed: number;
  // Energy
  diesel_per_bed_factory: number;
  diesel_per_bed_panels: number;
  // Volume + overhead (fixed block lines)
  beds_per_year: number;
  kirmos_monthly_50pct: number;
  founder_days_production: number;
  founder_rate_per_day: number;
  founder_fte_pct: number;
  founder_total_days_per_year: number;
  admin_per_year: number;
  field_travel_per_year: number;
  local_freight_per_bed: number;
  long_haul_freight_per_bed: number;
  // Levers
  build_method: BuildMethod;
  location: CostModelLocation;
  containerise: boolean;
  // Retail
  retail_price: number;
  commercial_low: number;
  commercial_high: number;
  // Capital
  capital_to_factory_low: number;
  capital_to_factory_high: number;
}

const _capex = scenarios.capex_required_to_reach_state_4;
const _founder = scenarios.founder_time_allocation;
const _labour = scenarios.labour_rates_in_house;
const _bom = scenarios.canonical_bom;
const _defyRates = scenarios.defy_verified_rates;
const _counterfactual = scenarios.counterfactual;

/** Capital ask (GROSS capex to reach Factory state). Net of the $110,046 already invested. */
export const CAPITAL_GROSS_LOW = _capex.total_low; // 112,000
export const CAPITAL_GROSS_HIGH = _capex.total_high; // 222,000
export const ALREADY_INVESTED =
  _capex.already_invested_facility + _capex.already_invested_carbatec_tooling; // 110,046

/** In-house legs saving per bed (v6) — the per-bed prize the capex unlocks. */
export const LEGS_SAVING_PER_BED = 194.05;
/** Idiot-index floors: shred SELL price vs true polymer physics floor (20kg each). */
export const SHRED_FLOOR_PER_BED = 40; // 20kg × $2/kg (Defy INV-1731 shred SELL price)
export const POLYMER_FLOOR_PER_BED = 16; // 20kg × $0.80/kg (Envirobank recycled HDPE)
/** Raw-material floors used as idiot-index divisors (per bed). */
export const STEEL_RAW_FLOOR_PER_BED = scenarios.first_principles_floor.components[1].cost; // 10.34
export const CANVAS_RAW_FLOOR_PER_BED = scenarios.first_principles_floor.components[2].cost; // 35

export const LOCATIONS: Record<
  CostModelLocation,
  { label: string; rentPerYear: number; inboundFreightPerBed: number }
> = {
  sydney: { label: 'Sydney / Defy', rentPerYear: 0, inboundFreightPerBed: 0 },
  sunshine_coast: { label: 'Sunshine Coast (Kirmos)', rentPerYear: 54000, inboundFreightPerBed: 30 },
  on_country: { label: 'On-Country', rentPerYear: 24000, inboundFreightPerBed: 60 },
};

/**
 * Locked canonical defaults for the explorer, mapped from this JSON +
 * supplier-quotes.ts. Field names match the explorer's `Inputs` interface
 * exactly; values reconcile to the locked numbers to the cent.
 */
export const CostModelDefaults: CostModelInputs = {
  hdpe_kg_per_bed: scenarios.physics.hdpe_kg_per_bed, // 20
  hdpe_per_kg_landed:
    _defyRates.hdpe_shred_per_kg.amount + _defyRates.delivery_per_kg.amount, // 2.75
  defy_kit_per_bed: _bom.hdpe_kit_defy.amount, // 344.05
  defy_panel_each: _defyRates.pre_pressed_panel_each.amount, // 200
  steel_per_bed: _bom.steel_poles.amount, // 27
  canvas_per_bed: _bom.canvas.amount, // 93.50
  hardware_per_bed: _bom.end_caps.amount + _bom.screws.amount + _bom.bolts.amount, // 5.24
  labour_per_day: _labour.production_operator_per_day, // 400
  factory_beds_per_day: 5,
  defy_kits_beds_per_day: 10,
  defy_panels_beds_per_day: 7.5,
  community_beds_per_day: 5,
  defy_assembly_per_bed: _defyRates.assembly_labour.amount, // 55.95
  diesel_per_bed_factory: 15,
  diesel_per_bed_panels: 5,
  beds_per_year: 120, // honest today run-rate (NOT 500)
  kirmos_monthly_50pct: _labour.kirmos_monthly_50pct_to_beds, // 2250
  founder_days_production: _founder.split[0].days, // 30
  founder_rate_per_day: _founder.rate_per_day, // 560 (LOCKED $84K/yr full-time)
  founder_fte_pct: 100,
  founder_total_days_per_year: _founder.total_days_per_year_on_goods, // 150
  admin_per_year: 14700,
  field_travel_per_year: 51000,
  local_freight_per_bed: 25,
  long_haul_freight_per_bed: 150,
  build_method: 'kits',
  location: 'sydney',
  containerise: false,
  retail_price: WEBSITE_PRICE, // 750 (supplier-quotes.ts canonical)
  commercial_low: _counterfactual.commercial_steel_frame_bed_au_2026_low, // 1500
  commercial_high: _counterfactual.commercial_steel_frame_bed_au_2026_high, // 2000
  capital_to_factory_low: CAPITAL_GROSS_LOW, // 112,000 GROSS
  capital_to_factory_high: CAPITAL_GROSS_HIGH, // 222,000 GROSS
};

/**
 * Canonical fully-loaded cost per bed for the *current* (today, ~100/yr) tier.
 * Reads the fully_loaded_grid rather than the orphan $600 in supplier-quotes.ts.
 * Buy-Kit @ today = $1,912; Factory @ today = $1,653.
 */
export function getFullyLoadedToday(method: 'state_2_defy_kits' | 'state_4_factory' = 'state_2_defy_kits'): number {
  const today = scenarios.fully_loaded_grid[0];
  return today[method];
}

/**
 * Canonical MARGINAL (cash) cost per bed — the honest "cost of one more bed"
 * that the cost-model explorer leads with, mirrored here so the production card
 * tells the SAME story. Marginal = build-path direct + per-bed long-haul freight
 * (the only per-bed variable beyond materials). Reconciles to the locked numbers:
 * Buy-Kit $684.79 (534.79 + 150) / Factory $425.74 (275.74 + 150). Fixed-cost
 * absorption at pilot volume (~$1,912 Buy-Kit) is explicitly NOT this number.
 */
export function getMarginalToday(method: 'state_2_defy_kits' | 'state_4_factory' = 'state_2_defy_kits'): number {
  const grid = getMarginGridAt750();
  const direct =
    method === 'state_4_factory'
      ? (grid.find((r) => r.path.startsWith('Factory'))?.direct ?? 275.74)
      : (grid.find((r) => r.path.startsWith('Defy Kits'))?.direct ?? 534.79);
  return direct + CostModelDefaults.long_haul_freight_per_bed; // + 150
}

/**
 * Pure batch economics for the production page / cost-per-batch card.
 *
 * The HONEST lead is the marginal / contribution story (the same one the
 * cost-model explorer headlines): COGS + margin are driven from the MARGINAL
 * cost per bed (Buy-Kit $684.79 today), not the fixed-cost-absorption number.
 * The fully-loaded figure ($1,912 at pilot volume) is exposed separately as a
 * clearly-labelled reference only — it is NOT a marginal cost and must not
 * headline the card.
 */
export function batchEconomics(bedCount: number): {
  bedCount: number;
  /** Marginal (cash) cost per bed — the costing anchor for COGS/margin. */
  costPerBed: number;
  /** Marginal cost per bed (alias of costPerBed, named for clarity). */
  marginalPerBed: number;
  /** Fully-loaded cost per bed at pilot volume — DEMOTED reference only. */
  fullyLoadedPerBed: number;
  cogs: number;
  marginPerBed: number;
  marginAtInstitutional: number;
} {
  const beds = Number.isFinite(bedCount) && bedCount > 0 ? bedCount : 0;
  const marginalPerBed = getMarginalToday('state_2_defy_kits');
  const fullyLoadedPerBed = getFullyLoadedToday('state_2_defy_kits');
  const marginPerBed = WEBSITE_PRICE - marginalPerBed;
  return {
    bedCount: beds,
    costPerBed: marginalPerBed,
    marginalPerBed,
    fullyLoadedPerBed,
    cogs: beds * marginalPerBed,
    marginPerBed,
    marginAtInstitutional: beds * marginPerBed,
  };
}

export function getModel(): CostModelScenarios {
  return scenarios;
}

export function listBuildStates(): BuildState[] {
  const states = scenarios.build_states;
  const keys: BuildStateKey[] = [
    'state_2_defy_kits',
    'state_3_defy_panels',
    'state_4_factory',
    'state_5_community',
  ];
  return keys.map((key) => ({ key, ...states[key] }));
}

export function getIdiotIndex(): IdiotIndexRow[] {
  return scenarios.idiot_index as IdiotIndexRow[];
}

export function getOverheadPerVolume(): OverheadRow[] {
  return scenarios.overhead_per_volume as OverheadRow[];
}

export function getFullyLoadedGrid(): FullyLoadedRow[] {
  return scenarios.fully_loaded_grid as FullyLoadedRow[];
}

export function getMarginGridAt750(): MarginRow[] {
  return scenarios.margin_grid_at_750_retail as MarginRow[];
}

export function getFounderAllocation() {
  return scenarios.founder_time_allocation;
}

export function getFundraisingOffset() {
  return scenarios.fundraising_offset;
}

export function getDefyVerifiedRates() {
  return scenarios.defy_verified_rates;
}

export function getCanonicalBOM() {
  return scenarios.canonical_bom;
}

export function getOpenQuestionsForDefy() {
  return scenarios.open_questions_for_defy;
}

/**
 * Reconcile the v5 Factory-state direct total against `factoryDirectMaterials`
 * in supplier-quotes.ts. If they drift, the card surfaces a warning so the two
 * files can't silently disagree about the factory-path cost.
 *
 * Note: v5 dropped state_1_defy_fully_fabricated (was Weave Bed @ $600, discontinued).
 * `fullyLoadedCostPerBed` from supplier-quotes.ts ($600) is kept as a legacy reference
 * but no longer mapped to a build state — the canonical path is now Defy Kits ($534.79)
 * or Factory ($275.74).
 */
export function reconcileAgainstCanonicalBOM(): {
  factoryTotal: number;
  canonicalFactoryMaterials: number;
  legacyFullyLoaded: number;
  fullyLoadedCostPerBed: number;
  fullyLoadedKitToday: number;
  matches: boolean;
  bom: typeof stretchBedBOM;
} {
  const state4 = scenarios.build_states.state_4_factory;
  const factoryMatches = Math.abs(state4.direct_total - factoryDirectMaterials) < 0.01;
  // fullyLoadedCostPerBed ($600) is a legacy orphan that maps to no build state;
  // surface it so a desync between supplier-quotes.ts and the canonical
  // fully-loaded grid fires the drift banner. The today-tier Buy-Kit fully-loaded
  // figure ($1,912) is the canonical costing anchor.
  const fullyLoadedKitToday = getFullyLoadedToday('state_2_defy_kits');
  return {
    factoryTotal: state4.direct_total,
    canonicalFactoryMaterials: factoryDirectMaterials,
    legacyFullyLoaded: fullyLoadedCostPerBed,
    fullyLoadedCostPerBed,
    fullyLoadedKitToday,
    matches: factoryMatches,
    bom: stretchBedBOM,
  };
}

export function fmtMoney(value: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    maximumFractionDigits: value < 10 ? 2 : 0,
  }).format(value);
}
