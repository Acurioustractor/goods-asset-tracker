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
import { fullyLoadedCostPerBed, stretchBedBOM, factoryDirectMaterials } from './supplier-quotes';

export type CostModelScenarios = typeof scenarios;

export type BuildStateKey =
  | 'state_1_defy_fully_fabricated'
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
  state_1_defy_fab: number;
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

export function getModel(): CostModelScenarios {
  return scenarios;
}

export function listBuildStates(): BuildState[] {
  const states = scenarios.build_states;
  const keys: BuildStateKey[] = [
    'state_1_defy_fully_fabricated',
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
 * Reconcile the v4 Factory-state direct total against `factoryDirectMaterials`
 * in supplier-quotes.ts. If they drift, the card surfaces a warning so the two
 * files can't silently disagree about the factory-path cost.
 */
export function reconcileAgainstCanonicalBOM(): {
  factoryTotal: number;
  canonicalFactoryMaterials: number;
  state1Total: number;
  canonicalFullyLoaded: number;
  matches: boolean;
  bom: typeof stretchBedBOM;
} {
  const state1 = scenarios.build_states.state_1_defy_fully_fabricated;
  const state4 = scenarios.build_states.state_4_factory;
  return {
    factoryTotal: state4.direct_total,
    canonicalFactoryMaterials: factoryDirectMaterials,
    state1Total: state1.direct_total,
    canonicalFullyLoaded: fullyLoadedCostPerBed,
    matches:
      state4.direct_total === factoryDirectMaterials &&
      state1.direct_total === fullyLoadedCostPerBed,
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
