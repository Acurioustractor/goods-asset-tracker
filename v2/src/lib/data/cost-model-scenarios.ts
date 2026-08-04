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

/**
 * Who pays the person who runs the line, at a community site.
 * OPEN DECISION (Ben and Nic, Matt model input 5) — these are assumed costs, not costed roles.
 * The DEWR $150,000 Project Manager is a program role, not a production supervisor.
 * Default is 'none': the computed floor, and the only option that assumes no undecided role.
 */
export type SiteSupervisor = 'none' | 'half_time' | 'full_time';

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
  /** Community fair-wage labour $/bed (v6). Default $130, band $100-$160. Plastic stays $0 (free, community-collected). */
  community_labour_per_bed: number;
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
  /** Community-site line supervisor. Sits ON TOP of the $130/bed fair-wage labour already in marginal cost. */
  site_supervisor: SiteSupervisor;
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

/**
 * Capital ask, quoted GROSS ONLY (Ben ruling 2026-07-25, Matt model input 3).
 * A rough range with a lot of variables in it, plausibly reaching ~$200,000.
 * NEVER net ALREADY_INVESTED off this — the two are quoted side by side, gross ask plus
 * sunk spend as evidence of skin in the game. The old net figure (~$2K-112K) is retired.
 */
export const CAPITAL_GROSS_LOW = _capex.total_low; // 112,000
export const CAPITAL_GROSS_HIGH = _capex.total_high; // 222,000
/**
 * Sunk spend on the farm production facility. $110,046 is ACTUAL (Ben ruling 2026-07-25,
 * Matt model input 2), and it is the figure to quote. Evidence grade is `workpaper`, not
 * `verified`: ~$43,700 is evidenced at bill and bank-line level in the connected sole-trader
 * Xero, and the balance is plant we own whose paperwork is still catching up — the shredder
 * ($19,800 Telford Smith, physically confirmed, no Xero record) and a recently bought larger
 * CNC. A filing job, not a fiction. The ~$75K in the 2026-07-22 minimal-viable-facility note
 * is a bill-level subtotal, NOT a competing total — do not swap it in here.
 */
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

/**
 * The SITE PRODUCTION BLOCK: what bed sales alone should carry at a community site, per year.
 * Added 2026-07-25 (Matt model input 5). See `site_production_block` in the JSON for the
 * DEWR line splits, the claims status and the reasoning.
 *
 * THREE POTS, not two. This is pot 2.
 *   1. Network block  — the engine's existing `fixedBlock` less location rent (~$109,500).
 *                       Amortises across sites. What Goods. is for after a handover.
 *   2. Site production block — THIS. Carried by bed sales.
 *   3. Site wraparound block — ~$300,000/yr brokerage plus the program share of rent,
 *                       insurance and admin. Grant funded by design; never touches per-bed
 *                       economics on paper.
 *
 * Before this existed, the whole site cost model was `LOCATIONS.on_country.rentPerYear`
 * ($24,000), which is a correct RENT figure that was read as an OPERATING COST. Dividing it
 * into contribution is what produced the "75 to 100 beds a year" claim retired by ruling I.
 *
 * NOTHING HERE IS MEASURED. The splits are derived assumptions and are the thing to argue with.
 */
export const SITE_PRODUCTION_BLOCK = scenarios.site_production_block;

/** Assumed annual cost of a community-site line supervisor. OPEN DECISION (Ben and Nic). */
export const SITE_SUPERVISOR_COST: Record<SiteSupervisor, number> = {
  none: scenarios.site_production_block.supervisor_options.none,
  half_time: scenarios.site_production_block.supervisor_options.half_time,
  full_time: scenarios.site_production_block.supervisor_options.full_time,
};

/** Bare site production block before any supervisor: $79,333/yr. */
export const SITE_PRODUCTION_BLOCK_BARE = scenarios.site_production_block.bare_production_block;

/**
 * CAPEX MODULES (Matt model input 7, added 2026-07-25; created by ruling D, "the object is
 * infrastructure, not a plant"). A basket a community selects from, replacing the `build_method`
 * LADDER for the purpose of pricing a real pathway.
 *
 * `build_states` stays as-is because its outputs are published. This is additive.
 *
 * The defect it fixes: every `build_method` assumes a whole site built in one fixed order, so
 * the ladder can price exactly one of the four live pathways (Oonchiumpa). It cannot price
 * Utopia (a shredder), Tennant Creek (an existing shed) or Palm Island (governance first).
 *
 * PROPOSED STRUCTURE, not agreed. Capex is reassembled from the MVF replication table, which
 * makes it an ALLOCATION of evidenced totals, not new evidence. Collection and baling is
 * genuinely unpriced. Per-module OPERATING shares are not derived, so this prices capex only.
 */
export const CAPEX_MODULES = scenarios.capex_modules;
export type CapexModuleKey = (typeof scenarios.capex_modules.modules)[number]['key'];

export interface ModuleSelectionPrice {
  /** Module capex only, excluding the site base. */
  capexLow: number;
  capexHigh: number;
  /** With the site base added. */
  withBaseLow: number;
  withBaseHigh: number;
  /** Modules in the selection that have no price yet. A selection with any of these is NOT priceable. */
  unpriced: string[];
  /** False when any selected module is unpriced. Do not quote a total when this is false. */
  priceable: boolean;
}

export interface ModuleOperatingPrice {
  /** Site floor: incurred as soon as ANY module runs, zero if none do. */
  siteFloor: number;
  /** Sum of the selected modules' own operating shares. */
  moduleShare: number;
  /** siteFloor + moduleShare, before any line supervisor. */
  total: number;
  /** Per-module breakdown, so a conversation can point at a line rather than a total. */
  breakdown: Array<{ key: string; amount: number }>;
}

/**
 * Annual operating cost a module selection should carry, before any line supervisor.
 * Added 2026-07-25: this is what made a PARTIAL pathway priceable at all.
 *
 * Two buckets, because not all of the block is allocable per module. The site floor exists the
 * moment anyone works there (books, insurance, yard); the rest scales with the modules run.
 * A selection with NO modules returns 0, including no floor, because there is no production
 * site. Palm Island is that case, and its real cost is governance, which is not production.
 *
 * DERIVED, not measured. The footprint weights behind the floor-space driver are assumed
 * rather than surveyed and are the softest input in the whole object.
 */
export function priceModuleOperating(keys: readonly string[]): ModuleOperatingPrice {
  const alloc = scenarios.capex_modules.operating_allocation;
  const breakdown = alloc.per_module
    .filter((m) => keys.includes(m.key))
    .map((m) => ({ key: m.key, amount: m.total }));

  const moduleShare = breakdown.reduce((t, m) => t + m.amount, 0);
  const siteFloor = breakdown.length > 0 ? alloc.site_floor.total : 0;

  return { siteFloor, moduleShare, total: siteFloor + moduleShare, breakdown };
}

/**
 * Price a subset of modules. Returns bands, not a point.
 *
 * Returns `priceable: false` when the selection contains an unpriced module, rather than
 * silently treating it as $0. Collection and baling is the live case: it is upstream of the
 * shredder, so Utopia, the pathway asking for the earliest module, is the one the model still
 * cannot price. Treating a missing quote as zero is how a pathway looks cheaper than it is.
 */
export function priceModuleSelection(
  keys: readonly string[],
  opts: { includeSiteBase?: boolean } = {},
): ModuleSelectionPrice {
  const selected = scenarios.capex_modules.modules.filter((m) => keys.includes(m.key));
  const unpriced = selected.filter((m) => m.capex_low === null || m.capex_high === null).map((m) => m.key);

  const capexLow = selected.reduce((t, m) => t + (m.capex_low ?? 0), 0);
  const capexHigh = selected.reduce((t, m) => t + (m.capex_high ?? 0), 0);

  const includeBase = opts.includeSiteBase !== false;
  const baseLow = includeBase ? scenarios.capex_modules.site_base.capex_low : 0;
  const baseHigh = includeBase ? scenarios.capex_modules.site_base.capex_high : 0;

  return {
    capexLow,
    capexHigh,
    withBaseLow: capexLow + baseLow,
    withBaseHigh: capexHigh + baseHigh,
    unpriced,
    priceable: unpriced.length === 0,
  };
}

/**
 * THE FACTORY THROUGHPUT CONFLICT. Logged 2026-08-04, unresolved, worth $20/bed.
 *
 * The model disagrees with itself about its single most sensitive input:
 *
 *   `CostModelDefaults.factory_beds_per_day`            = 5
 *   `build_states.state_4_factory.components` labour     = "$400/day ÷ 5 beds" = $80/bed
 *   `build_states.state_4_factory.throughput_beds_per_day` = 4
 *
 * At 5 beds/day the factory marginal cost is $425.74, which is the figure quoted
 * externally, in the workbook, and to Matt. At 4 beds/day it is $445.74.
 *
 * This is logged rather than silently aligned because nobody knows which is right.
 * The 40-bed Maningrida run reconciles to the $425.74 build almost exactly on the
 * money side (contribution $326.76/bed actual against $324.26 modelled, using the
 * $5,900 freight on INV-0303), but that run was never timed, so it cannot settle
 * beds per operator day. Only the measured week can.
 *
 * WHY IT IS THE ONE TO MEASURE: of the three unmeasured inputs, throughput moves
 * the answer most. 4 rather than 5 beds/day is +$20/bed. Yield at 80% rather than
 * 100% is +$13.75. Diesel at 8L/bed rather than 5 is +$9.00. Everyone worries about
 * yield and it is the smallest of the three.
 *
 * TO RESOLVE: run the measured week, pick the number, make all three agree, and
 * delete this constant. The guard in cost-model-conflicts.guards.test.ts fails when
 * the disagreement changes shape, so it cannot be resolved by accident.
 */
export const FACTORY_THROUGHPUT_CONFLICT = {
  defaultsSays: 5,
  buildStateSays: scenarios.build_states.state_4_factory.throughput_beds_per_day,
  labourLineImplies: 5,
  costPerBedAtFive: 425.74,
  costPerBedAtFour: 445.74,
  resolvedBy: 'the measured production week',
  owner: 'Ben + production lead',
} as const;

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
  // 5, and the JSON's own state_4_factory says 4. See FACTORY_THROUGHPUT_CONFLICT
  // below: this is an OPEN DISAGREEMENT worth $20/bed, not a typo to quietly align.
  factory_beds_per_day: 5,
  defy_kits_beds_per_day: 10,
  defy_panels_beds_per_day: 7.5,
  community_beds_per_day: 5,
  defy_assembly_per_bed: _defyRates.assembly_labour.amount, // 55.95
  community_labour_per_bed: scenarios.build_states.state_5_community.community_labour_per_bed, // 130 (v6 fair wage, band 100-160)
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
  // 'none' is the computed floor and the only option that assumes no undecided role.
  // Changing this default changes a denominator, not just a dial. Ben and Nic decide it.
  site_supervisor: 'none',
  retail_price: WEBSITE_PRICE, // 750 (supplier-quotes.ts canonical)
  commercial_low: _counterfactual.commercial_steel_frame_bed_au_2026_low, // 1500
  commercial_high: _counterfactual.commercial_steel_frame_bed_au_2026_high, // 2000
  capital_to_factory_low: CAPITAL_GROSS_LOW, // 112,000 GROSS
  capital_to_factory_high: CAPITAL_GROSS_HIGH, // 222,000 GROSS
};

/**
 * Canonical fully-loaded reference per bed for the *current* (today, ~100/yr) tier.
 * Reads the fully_loaded_grid rather than the orphan $600 in supplier-quotes.ts.
 * Buy-Kit @ today = $1,780; Factory @ today = $1,521.
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
 * absorption at pilot volume (~$1,780 Buy-Kit) is explicitly NOT this number.
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
 * The fully-loaded figure ($1,780 at pilot volume) is exposed separately as a
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
  // figure ($1,780) is a reference-only fixed absorption view.
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
