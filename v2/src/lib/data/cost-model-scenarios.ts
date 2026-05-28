/**
 * Bed cost model — v3 scenarios + Idiot Index + founder-time split.
 *
 * Builds on the canonical BOM in `supplier-quotes.ts` (the single source of
 * truth for per-component prices) and adds:
 *  - 5 build-state scenarios (Defy-everything → community-plastic in-house)
 *  - Idiot Index per element (markup ratio = lever for in-house cost reduction)
 *  - Founder time allocated by purpose (production / fundraising / commercial / ACT-wide)
 *  - Fundraising offset (how dollars raised subsidise bed cost)
 *  - Volume scenarios at 100 / 500 / 1,000 beds per year
 *
 * Source data verified from `scripts/ocr-defy-bills.mjs` OCR of every Defy
 * invoice attachment (lives in act-infra repo). The numbers here align
 * directly with `supplier-quotes.ts` — when the canonical BOM changes there,
 * update this file in lockstep.
 */
import scenarios from './cost-model-scenarios.json';
import { fullyLoadedCostPerBed, stretchBedBOM } from './supplier-quotes';

export type CostModelScenarios = typeof scenarios;

export type BuildStateKey =
  | 'state_1_defy_everything'
  | 'state_2_buy_kit_assemble'
  | 'state_3_buy_sheets_cut_assemble'
  | 'state_4_all_in_house'
  | 'state_5_community_plastic';

export interface BuildState {
  key: BuildStateKey;
  label: string;
  components: Array<{ label: string; amount: number }>;
  direct_total: number;
  capital_added: number;
  capital_cumulative: number;
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

export interface VolumeScenario {
  label: string;
  beds_per_year: number;
  production_founder_per_bed: number;
  admin_per_bed: number;
  field_travel_per_bed: number;
  freight_per_bed: number;
  fully_loaded_state_1: number;
  fully_loaded_state_4: number;
  fully_loaded_state_5: number;
}

export function getModel(): CostModelScenarios {
  return scenarios;
}

export function listBuildStates(): BuildState[] {
  const states = scenarios.build_states;
  const keys: BuildStateKey[] = [
    'state_1_defy_everything',
    'state_2_buy_kit_assemble',
    'state_3_buy_sheets_cut_assemble',
    'state_4_all_in_house',
    'state_5_community_plastic',
  ];
  return keys.map((key) => ({ key, ...states[key] }));
}

export function getIdiotIndex(): IdiotIndexRow[] {
  return scenarios.idiot_index as IdiotIndexRow[];
}

export function getVolumeScenarios(): VolumeScenario[] {
  return scenarios.volume_scenarios as VolumeScenario[];
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

export function getOpenQuestionsForDefy() {
  return scenarios.open_questions_for_defy;
}

/**
 * Reconcile the v3 State-1 cost ($600) against `supplier-quotes.ts`
 * `fullyLoadedCostPerBed` to make sure both files agree. If they ever drift,
 * the cost-model card surfaces a warning.
 */
export function reconcileAgainstCanonicalBOM(): {
  state1Total: number;
  canonicalFullyLoaded: number;
  matches: boolean;
  bom: typeof stretchBedBOM;
} {
  const state1 = scenarios.build_states.state_1_defy_everything;
  return {
    state1Total: state1.direct_total,
    canonicalFullyLoaded: fullyLoadedCostPerBed,
    matches: state1.direct_total === fullyLoadedCostPerBed,
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
