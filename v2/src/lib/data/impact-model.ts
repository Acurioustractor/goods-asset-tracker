/**
 * Impact Model: Structured 5-dimension framework for measuring Goods on Country impact
 *
 * Aligned with:
 * - PFI EOI Section 8 (impact dimensions)
 * - Queensland Social Enterprise funding (WISE model, employment hours)
 * - Autoresearch pattern: define metrics → measure → identify opportunities → iterate
 *
 * The "loss function" is impact per dollar. Everything else is a hyperparameter.
 */

import { verifiedFinancials } from './compendium';
import { getMarginGridAt750, getFullyLoadedGrid } from './cost-model-scenarios';
import { WEBSITE_PRICE } from './supplier-quotes';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ImpactMetric {
  id: string;
  name: string;
  unit: string;
  current: number | null;
  targets: { year1: number; year3: number; vision2030: number };
  source: 'supabase' | 'empathy-ledger' | 'xero' | 'manual' | 'computed';
  sourceDetail: string;
  /**
   * Confidence tier, rendered as a provenance badge on /impact so no metric reads
   * as a uniformly "live/measured" number. verified = system or measured fact;
   * modelled = derived via stated assumptions; estimate = partial-data approximation;
   * target = design goal not yet achieved.
   */
  confidence: 'verified' | 'modelled' | 'estimate' | 'target';
  proxyFor?: string;
  optimizationLevers: string[];
  computeFn?: string; // name of function in impact-fetcher.ts that computes this
}

export interface ImpactDimension {
  id: string;
  name: string;
  description: string;
  icon: string; // semantic icon name
  color: string; // hex color for the dimension
  primaryMetricId: string; // the headline metric for this dimension
  communityQuote?: {
    text: string;
    author: string;
    context: string;
  };
  metrics: ImpactMetric[];
}

export interface ImpactSnapshot {
  timestamp: string;
  dimensions: ImpactDimension[];
  summary: {
    totalInvestment: number;
    totalAssets: number;
    livesImpacted: number;
    plasticDivertedKg: number;
    communitiesServed: number;
    employmentHoursCreated: number;
    impactPerDollar: number; // composite score / totalInvestment
  };
  optimizationOpportunities: OptimizationOpportunity[];
  healthCascade: HealthCascadeData;
}

export interface OptimizationOpportunity {
  id: string;
  title: string;
  description: string;
  dimension: string;
  potential: 'high' | 'medium' | 'low';
  dataSource: string;
}

// CLAIM CEILING (P0, 2026-06-18): the scabies to RHD pathway is our WHY, never a
// claimed outcome. The cascade now explains the pathway as rationale (why a bed and
// a washer are health hardware). The `interrupted` flag and `sleepNightsProvided`
// proxy were removed: badging a step "INTERRUPTED" claims a prevented health
// outcome we cannot stand behind.
export interface HealthCascadeData {
  totalWashCycles: number;
  machinesOnline: number;
  bedsDelivered: number;
  steps: {
    label: string;
    description: string;
    liveMetric?: { value: number; unit: string };
  }[];
}

// ---------------------------------------------------------------------------
// Revenue segments (from Eloise meeting: B2B, B2C, Government, Corporate)
// ---------------------------------------------------------------------------

export interface RevenueSegment {
  id: string;
  name: string;
  description: string;
  currentEvidence: string;
  projectedShare: number; // percentage of total revenue
}

// Canonical 7-segment revenue model (financial-model Day 5, 2026-05-12).
// Year-1 midpoint target ~$1.13M. Shares are MODELLED projections, not actuals.
// Supersedes the earlier 4-segment list (B2B 45 / Gov 25 / B2C 20 / Corporate 10).
export const REVENUE_SEGMENTS: RevenueSegment[] = [
  {
    id: 'donor-institutional',
    name: 'Donor-Funded Institutional',
    description: 'Foundations / philanthropic buyers funding beds for community distribution at scale',
    currentEvidence: '107 beds to Centrecorp — institutional buyer at scale (income_type=grant, not commercial sale)',
    projectedShare: 44,
  },
  {
    id: 'direct-institutional',
    name: 'Direct Institutional (Commercial)',
    description: 'Direct commercial sales to organisations distributing to communities',
    currentEvidence: 'PICC 40-bed order discussed; health orgs and NPY "always looking for beds"',
    projectedShare: 27,
  },
  {
    id: 'corporate-rap',
    name: 'Corporate & RAP',
    description: 'Corporate engagement: team builds, NAIDOC week, Reconciliation Action Plan sponsorship',
    currentEvidence: 'QIC interested in building 50 beds with staff for NAIDOC week',
    projectedShare: 9,
  },
  {
    id: 'direct-retail',
    name: 'Direct to Consumer (Retail)',
    description: 'E-commerce sales: camping, emergency, beach use cases',
    currentEvidence: 'Community consultations suggest camping/emergency bed market; "cyclone beds" in NT',
    projectedShare: 9,
  },
  {
    id: 'community-maker',
    name: 'Community / Maker',
    description: 'Community-led production and maker-channel sales as facilities transfer to community ownership',
    currentEvidence: 'Ebony + Jahvan Oui training for on-country production at Palm Island',
    projectedShare: 5,
  },
  {
    id: 'government',
    name: 'Government Procurement',
    description: 'NT and QLD government procurement for remote communities (Supply Nation pathway)',
    currentEvidence: 'Conversations with NT government; QLD social procurement preference under $500K',
    projectedShare: 4,
  },
  {
    id: 'adjacent',
    name: 'Adjacent Products',
    description: 'Washing machines and future HDPE products from the same production line',
    currentEvidence: 'Pakkimjalki Kari washing machine prototype deployed; HDPE product catalogue in design',
    projectedShare: 2,
  },
];

// ---------------------------------------------------------------------------
// Production labour model (employment-hours driver)
// ---------------------------------------------------------------------------
//
// NOTE (2026-05-29): the old PRODUCTION_COST_BREAKDOWN carried fabricated
// per-stage DOLLAR costs that summed to a non-canonical $550/bed and were
// rendered publicly as the cost-per-bed. That dollar fabrication is DELETED.
// The cost-per-bed now comes from the canonical cost model (see CANONICAL_COST_*
// below) sourced from `cost-model-scenarios.ts` + `supplier-quotes.ts`.
//
// The per-stage LABOUR HOURS are retained (they drive the MODELLED employment-
// hours impact metric, a legitimately modelled figure) but no longer claim to
// carry a verified dollar cost.

export interface ProductionLabourStage {
  stage: string;
  hoursPerUnit: number;
  personnelRequired: number;
}

export const PRODUCTION_LABOUR_STAGES: ProductionLabourStage[] = [
  { stage: 'Plastic collection & sorting', hoursPerUnit: 0.5, personnelRequired: 1 },
  { stage: 'Shredding & pelletising', hoursPerUnit: 0.3, personnelRequired: 1 },
  { stage: 'Sheet pressing (190°C, 5000 PSI)', hoursPerUnit: 1.0, personnelRequired: 1 },
  { stage: 'CNC cutting', hoursPerUnit: 3.5, personnelRequired: 1 },
  { stage: 'Canvas & steel prep', hoursPerUnit: 0.5, personnelRequired: 1 },
  { stage: 'Assembly & QC', hoursPerUnit: 0.5, personnelRequired: 2 },
  { stage: 'Freight & logistics', hoursPerUnit: 0.2, personnelRequired: 1 },
];

/** MODELLED labour hours per bed (employment-impact driver, not yet time-studied). */
export const MODELLED_LABOUR_HOURS_PER_BED = PRODUCTION_LABOUR_STAGES.reduce(
  (sum, item) => sum + item.hoursPerUnit,
  0,
);

// ---------------------------------------------------------------------------
// Canonical cost-per-bed (single source of truth, MODELLED)
// ---------------------------------------------------------------------------
//
// Build-path direct costs (at $750 retail) from cost-model-scenarios.ts. These
// reconcile to the locked canonical numbers (Factory 275.74 / Defy Kits 534.79 /
// Defy Panels 584.07 / Community 270.74). The headline current cost-per-bed uses
// the FACTORY build path direct cost (the on-country target the capital ask funds).

const _marginGrid = getMarginGridAt750();
const _factoryRow = _marginGrid.find((r) => r.path.startsWith('Factory'));
const _defyKitsRow = _marginGrid.find((r) => r.path.startsWith('Defy Kits'));

/** Canonical website / institutional price (single source: supplier-quotes.ts). */
export const CANONICAL_WEBSITE_PRICE = WEBSITE_PRICE; // 750

/** Factory build-path direct cost per bed (on-country target). MODELLED. */
export const CANONICAL_FACTORY_DIRECT_COST = _factoryRow?.direct ?? 275.74;

/** Current (Defy-kit) build-path direct cost per bed. MODELLED. */
export const CANONICAL_BUYKIT_DIRECT_COST = _defyKitsRow?.direct ?? 534.79;

/** The four canonical build-path rows (path / direct / margin / margin%) at $750. */
export const CANONICAL_BUILD_PATHS = _marginGrid;

/** Fully-loaded cost grid (per-volume) — for context, NOT a public cost-per-bed. */
export const CANONICAL_FULLY_LOADED_GRID = getFullyLoadedGrid();

// ---------------------------------------------------------------------------
// The five outcome domains (canonical backbone)
// ---------------------------------------------------------------------------
//
// P4 (2026-06-18): these are THE five outcome domains from the canonical impact
// model (wiki/outputs/2026-06-18-goods-impact-framework.md §3). They supersede the
// earlier five "dimensions" (Health / Environmental / Economic / Community
// Ownership / Production Efficiency), which mixed an internal-ops axis (production
// efficiency) and a through-line (economic) in with the community-outcome domains.
//
// Each domain pairs a cleared community VOICE with a canon NUMBER and an honest
// LABEL (the spine). Voices are verbatim from curated-quotes.ts and every author is
// on the cleared-for-external list (see cleared-voices.ts). The economics story and
// Indigenous sovereignty are TWO THROUGH-LINES that run across all five domains
// (§6), not separate domains; the page carries them as their own band. Production
// efficiency is internal ops, relocated to PRODUCTION_EFFICIENCY_METRICS below and
// not rendered as a public outcome domain.
//
// Metric IDs are STABLE: impact-fetcher.ts binds live values by metric id, not by
// domain, so re-bucketing metrics across domains does not break the live fetch.

export const IMPACT_DIMENSIONS: ImpactDimension[] = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 1. REST & HEALTH (the core why)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'rest-health',
    name: 'Rest & health',
    // CLAIM CEILING (P0, 2026-06-18): the scabies to RHD pathway is our WHY, never a
    // claimed outcome. This describes why a bed and a washer are health hardware; it
    // does not claim a bed prevents or interrupts heart disease.
    description: 'Off-the-ground, washable sleep that supports the conditions needed to interrupt the scabies to rheumatic heart disease pathway. This is why a bed and a washing machine are health hardware, not furniture.',
    icon: 'heart',
    color: '#C45C3E',
    primaryMetricId: 'beds-delivered',
    communityQuote: {
      text: 'Back pain and all that. You\'re gonna be moving around with problems. That\'s why good beds matter.',
      author: 'Brian Russell',
      context: 'Tennant Creek',
    },
    metrics: [
      {
        id: 'beds-delivered',
        confidence: 'verified',
        name: 'Beds Delivered',
        unit: 'beds',
        current: null, // fetched live from Supabase
        targets: { year1: 1500, year3: 5000, vision2030: 25000 },
        source: 'supabase',
        sourceDetail: 'assets table: count where product ilike %bed%',
        proxyFor: 'Households with off-the-ground, washable sleeping infrastructure',
        optimizationLevers: ['Production capacity', 'Freight partnerships', 'Community demand pipeline'],
        computeFn: 'getBedsDelivered',
      },
      // CLAIM CEILING (P0, 2026-06-18): the "sleep-nights" metric was removed here.
      // It was a modelled health proxy ("Improved health outcomes from proper rest")
      // presented as an outcome, which the claim ceiling forbids. A health outcome
      // only returns when a partner clinical method (Miwatj) produces it, attributed.
      {
        id: 'wash-cycles',
        confidence: 'verified',
        name: 'Wash Cycles Completed',
        unit: 'cycles',
        current: null,
        targets: { year1: 15000, year3: 60000, vision2030: 500000 },
        source: 'supabase',
        sourceDetail: 'usage_logs table: count where event_type = cycle_complete',
        // Counted activity, not a claimed health outcome. Clean washing is part of
        // why a washer is health hardware; we do not claim it prevents RHD.
        proxyFor: 'Washable bedding kept clean (the conditions the scabies pathway depends on)',
        optimizationLevers: ['Machine uptime', 'Community adoption', 'Fleet expansion'],
        computeFn: 'getWashCycles',
      },
      {
        id: 'product-survival-rate',
        confidence: 'estimate',
        name: 'Product Survival Rate',
        unit: '%',
        current: 95, // estimate: only 15-20 beds with 6+ months data
        targets: { year1: 90, year3: 92, vision2030: 95 },
        source: 'manual',
        sourceDetail: 'Check-in system: % of assets still in use at 12 months',
        proxyFor: 'Long-term durability of the health hardware',
        optimizationLevers: ['Material quality', 'Design iteration', 'Repair network'],
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2. DIGNITY & SAFETY
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'dignity-safety',
    name: 'Dignity & safety',
    description: 'A bed is safety and belonging, and the freight tax is why a basic good is out of reach. A need, not charity.',
    icon: 'home',
    color: '#D4A574',
    primaryMetricId: 'communities-served',
    communityQuote: {
      text: 'Hardly any people around the community have got beds. When they got family members over, there\'s not enough for everyone.',
      author: 'Ivy',
      context: 'Palm Island',
    },
    metrics: [
      {
        id: 'communities-served',
        confidence: 'verified',
        name: 'Communities Served',
        unit: 'communities',
        current: null,
        targets: { year1: 12, year3: 25, vision2030: 60 },
        source: 'supabase',
        sourceDetail: 'assets table: distinct community values where status in (deployed, allocated). Canonical: 9 communities served (deployed); ~10 distinct incl. allocated/placeholder (2026-05-30).',
        optimizationLevers: ['Distribution partnerships', 'Freight networks', 'Health org partnerships'],
        computeFn: 'getCommunitiesServed',
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3. INDIGENOUS SELF-DETERMINATION & COMMUNITY-LED DESIGN
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'self-determination',
    name: 'Self-determination & community-led design',
    description: 'Designed in community, with the people who will use it, and owned by them. "Never been asked" becomes "named it, tested it, built what they asked for." Self-determination runs from the design through to who holds the data.',
    icon: 'users',
    color: '#7C6F64',
    primaryMetricId: 'storytellers-active',
    communityQuote: {
      text: 'We\'ve never been asked what sort of house we\'d like to live in.',
      author: 'Linda Turner',
      context: 'Tennant Creek',
    },
    metrics: [
      {
        id: 'storytellers-active',
        confidence: 'verified',
        name: 'Active Storytellers',
        unit: 'people',
        current: null,
        targets: { year1: 50, year3: 100, vision2030: 300 },
        source: 'empathy-ledger',
        sourceDetail: 'Empathy Ledger: storyteller count for goods-on-country project',
        proxyFor: 'Community engagement depth and voice representation',
        optimizationLevers: ['Community visits', 'Story gathering events', 'Elder engagement'],
        computeFn: 'getStorytellerCount',
      },
      {
        id: 'community-production-days',
        confidence: 'verified',
        name: 'Community Production Days/Week',
        unit: 'days/week',
        current: 0,
        targets: { year1: 1, year3: 2, vision2030: 3 },
        source: 'manual',
        sourceDetail: 'Days per week community operates production without ACT presence',
        proxyFor: 'Self-determination in manufacturing',
        optimizationLevers: ['Training programs', 'Documentation', 'Leadership development'],
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 4. JOBS, ON COUNTRY WORK & THE PATH TO OWNERSHIP (WISE model)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'jobs-ownership',
    name: 'Jobs, On Country work & ownership',
    description: 'The making moves On Country. Real jobs are created where the plastic, the people and the need are. Young people build the product and, over time, hold the work and the ownership. Jobs and ownership are labelled future or target, never as achieved.',
    icon: 'briefcase',
    color: '#5E7D9A',
    primaryMetricId: 'employment-hours',
    communityQuote: {
      text: 'He couldn\'t stop thanking me. The smile on his face all the way back home. He got out showing his family the bag, and he\'s walking around everywhere with those shoes on, running everywhere.',
      author: 'Fred Campbell',
      context: 'Xavier, after his first paid build (Oonchiumpa, Alice Springs)',
    },
    metrics: [
      {
        id: 'employment-hours',
        confidence: 'modelled',
        name: 'Employment Hours Created',
        unit: 'hours',
        current: null,
        targets: { year1: 9750, year3: 32500, vision2030: 162500 },
        source: 'computed',
        sourceDetail: `MODELLED: ${MODELLED_LABOUR_HOURS_PER_BED.toFixed(1)} labour hours per bed × beds produced`,
        proxyFor: 'Economic inclusion for at-risk youth and community members',
        optimizationLevers: ['Production volume', 'Training programs', 'Community facility hosting'],
        computeFn: 'computeEmploymentHours',
      },
      {
        id: 'fte-jobs',
        confidence: 'verified',
        name: 'FTE Jobs',
        unit: 'FTE',
        current: 2,
        targets: { year1: 6, year3: 18, vision2030: 50 },
        source: 'manual',
        sourceDetail: 'Direct employment at production facilities',
        proxyFor: 'Sustainable community employment',
        optimizationLevers: ['Facility count', 'Production volume', 'Product range expansion'],
      },
      {
        id: 'community-employment-pct',
        confidence: 'estimate',
        name: 'Community Member Employment %',
        unit: '%',
        current: 30,
        targets: { year1: 50, year3: 70, vision2030: 90 },
        source: 'manual',
        sourceDetail: 'Percentage of production workforce from local community',
        proxyFor: 'Local economic benefit and ownership pathway',
        optimizationLevers: ['Training investment', 'Partner org employment programs', 'Youth pathways'],
      },
      {
        id: 'revenue',
        confidence: 'verified',
        name: 'Total Revenue Received (cumulative since inception, ~89% grant-funded)',
        unit: '$',
        current: verifiedFinancials.revenueReceived, // 741,111 — total received since inception (grant + commercial), restated 2026-06-03 live-Xero reconcile
        targets: { year1: 1_100_000, year3: 4_000_000, vision2030: 15_000_000 }, // Year-1 TOTAL-revenue target across all 7 segments (not commercial-only)
        source: 'xero',
        sourceDetail:
          'Xero workpaper (verified, not audited): TOTAL revenue received since inception (2023-07-01 → 2026-04-30), ~89% grant-funded (Snow + Centrecorp + VFFF + QIC) and ~11% commercial. This is NOT annual commercial traction — FY26 YTD commercial-only is ~$61K. The target is the Year-1 TOTAL-revenue target across all 7 segments (donor-institutional through adjacent), not a commercial-only target. Do not read cumulative grant-heavy revenue as recurring commercial run-rate.',
        optimizationLevers: ['B2B pipeline', 'Government procurement', 'E-commerce launch'],
      },
      // CLAIM CEILING (P0, 2026-06-18): the "govt-savings" metric (modelled government
      // health savings from "cases prevented") was removed. A government-savings
      // dollar figure presented as an outcome is forbidden by the claim ceiling: it
      // implies a prevented health outcome we cannot stand behind. It only returns
      // when a partner clinical/evaluation method (Miwatj) produces it, attributed.
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 5. CIRCULAR & LOCAL ECONOMY
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'circular-economy',
    name: 'Circular & local economy',
    description: 'Plastic becomes beds On Country. Value and capability stay local instead of leaving the community: a local enterprise that, over time, funds itself rather than the grant cycle.',
    icon: 'leaf',
    color: '#8B9D77',
    primaryMetricId: 'plastic-diverted',
    communityQuote: {
      text: 'You have to bring them on the barge. You can\'t just take them on the boat. You have to pay for freight. It all adds up.',
      author: 'Alfred Johnson',
      context: 'Palm Island, on why local manufacturing matters',
    },
    metrics: [
      {
        id: 'plastic-diverted',
        confidence: 'modelled',
        name: 'Plastic Diverted from Landfill',
        unit: 'kg',
        current: null,
        targets: { year1: 30000, year3: 125000, vision2030: 500000 },
        source: 'computed',
        sourceDetail: 'beds × 20kg HDPE per bed',
        proxyFor: 'Circular economy impact and waste reduction',
        optimizationLevers: ['Local feedstock sourcing', 'More beds produced', 'Expand to other plastic products'],
        computeFn: 'computePlasticDiverted',
      },
      {
        id: 'product-lifespan',
        confidence: 'target',
        name: 'Average Product Lifespan',
        unit: 'years',
        current: 10, // design target, not yet measured at scale
        targets: { year1: 10, year3: 12, vision2030: 15 },
        source: 'manual',
        sourceDetail: 'Design target. Field testing ongoing',
        proxyFor: 'Reduced replacement cycles vs conventional products',
        optimizationLevers: ['Material science', 'UV resistance', 'Repair programs'],
      },
      {
        id: 'local-feedstock-pct',
        confidence: 'estimate',
        name: 'Local Feedstock %',
        unit: '%',
        current: 60, // estimate: some plastic still sourced from metro
        targets: { year1: 70, year3: 85, vision2030: 95 },
        source: 'manual',
        sourceDetail: 'Percentage of HDPE sourced from community collection vs external',
        proxyFor: 'Community-driven circular economy',
        optimizationLevers: ['Community collection programs', 'Shredder deployment', 'Plastic sorting training'],
      },
      {
        id: 'cost-per-unit',
        confidence: 'modelled',
        name: 'Production Cost per Unit (direct, current build path)',
        unit: '$/bed',
        current: CANONICAL_BUYKIT_DIRECT_COST, // 534.79 — what we make a bed for TODAY (Defy Buy-Kit path)
        targets: { year1: 275, year3: 200, vision2030: 271 }, // Factory path: 275.74 → ~200 → Community v6 path: 270.74 (fair-wage paid labour)
        source: 'computed',
        sourceDetail: 'MODELLED: current is the Defy Buy-Kit direct cost ($534.79 — what we make a bed for today) from cost-model-scenarios.ts. The trajectory is cost-DOWN as production in-sources to the on-country Factory path (direct $275.74), then scales toward the Community path ($270.74, v6 — fair-wage paid labour at $130/bed, free community-collected plastic). Direct cost only — excludes fixed-cost absorption at pilot volume.',
        proxyFor: 'Cost-down that keeps value local (the economics through-line)',
        optimizationLevers: ['Move from Defy-kit to on-country factory path', 'CNC time reduction', 'Local feedstock + bulk materials'],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Production-efficiency metrics (internal ops, NOT a public outcome domain)
// ---------------------------------------------------------------------------
//
// P4 (2026-06-18): these were the old "Production Efficiency" dimension. They are
// internal operating metrics (the cost-down machinery behind the economics
// through-line), not a community-outcome domain, so they no longer render as one of
// the five domains on /impact. Kept here, exported, for internal/admin views and so
// the data is not lost. None are populated live by impact-fetcher.ts.
export const PRODUCTION_EFFICIENCY_METRICS: ImpactMetric[] = [
  {
    id: 'units-per-month',
    confidence: 'estimate',
    name: 'Units Produced per Month',
    unit: 'beds/month',
    current: 15, // estimate during active production runs
    targets: { year1: 125, year3: 417, vision2030: 1000 },
    source: 'manual',
    sourceDetail: 'Production logs: monthly output',
    optimizationLevers: ['Facility utilisation', 'Second shift', 'Additional facilities'],
  },
  {
    id: 'cnc-time',
    confidence: 'verified',
    name: 'CNC Cutting Time per Bed',
    unit: 'hours',
    current: 3.5,
    targets: { year1: 3.0, year3: 2.0, vision2030: 1.0 },
    source: 'manual',
    sourceDetail: 'Measured at production facility. Largest single time cost',
    proxyFor: 'Production bottleneck efficiency',
    optimizationLevers: ['Toolpath optimisation', 'Better tooling', 'Multi-head router'],
  },
  {
    id: 'facility-count',
    confidence: 'verified',
    name: 'Production Facilities',
    unit: 'facilities',
    current: 1,
    targets: { year1: 1, year3: 3, vision2030: 8 },
    source: 'manual',
    sourceDetail: 'Containerised production units deployed',
    optimizationLevers: ['Funding for new containers', 'Community hosting agreements'],
  },
  {
    id: 'facility-utilisation',
    confidence: 'estimate',
    name: 'Facility Utilisation',
    unit: '%',
    current: 30, // intermittent production runs
    targets: { year1: 60, year3: 75, vision2030: 85 },
    source: 'manual',
    sourceDetail: 'Percentage of available production time used',
    optimizationLevers: ['Demand pipeline', 'Circuit production model', 'Inventory build'],
  },
];

// ---------------------------------------------------------------------------
// Financial summary (from PFI + meeting)
// ---------------------------------------------------------------------------

export const FINANCIAL_SUMMARY = {
  // Single source of truth: verifiedFinancials (Xero workpaper, verified not audited).
  totalInvestment: verifiedFinancials.revenueReceived, // 741,111 — denominator for public impact-per-dollar (restated 2026-06-03)
  tradeRevenue: verifiedFinancials.revenueReceived,
  productionPlantInvestment: verifiedFinancials.capexInvested, // 110,046
  currentCostPerUnit: CANONICAL_BUYKIT_DIRECT_COST, // 534.79 — current Buy-Kit direct cost (what we make a bed for today, MODELLED)
  targetCostPerUnit: { year1: 275, year3: 200, vision2030: 271 }, // Factory path (275.74 → ~200) → Community v6 path (270.74, fair-wage paid labour)
  financialsStatus: verifiedFinancials.status,
  financialsLastUpdated: verifiedFinancials.lastUpdated,
};

// ---------------------------------------------------------------------------
// Default optimization opportunities (data-driven suggestions)
// ---------------------------------------------------------------------------

export const DEFAULT_OPPORTUNITIES: OptimizationOpportunity[] = [
  {
    id: 'cnc-optimisation',
    title: 'CNC cutting time is the largest labour-time driver',
    description: `CNC cutting currently takes ~3.5 hours/bed. Reducing it materially cuts both labour cost and the gap between the Defy-kit path ($534.79 direct) and the on-country factory path ($275.74 direct). Investigate toolpath optimisation and multi-head routing.`,
    dimension: 'production',
    potential: 'high',
    dataSource: 'Canonical cost model (cost-model-scenarios.ts)',
  },
  {
    id: 'wise-employment',
    title: `Each bed sale creates ~${MODELLED_LABOUR_HOURS_PER_BED.toFixed(1)} modelled hours of employment`,
    description: `At 1,500 beds/year, that's about ${(1500 * MODELLED_LABOUR_HOURS_PER_BED).toLocaleString()} hours of employment for at-risk youth (modelled, not yet time-studied). The WISE model is the strongest impact narrative for QLD government funding.`,
    dimension: 'economic',
    potential: 'high',
    dataSource: 'Production labour model + Eloise meeting',
  },
  {
    id: 'b2b-pipeline',
    title: 'B2B / institutional channel has strongest commercial evidence',
    description: '107 beds granted to Centrecorp (an institutional buyer, income_type=grant) demonstrates demand at scale. Emergency services are a natural fit: NT already calls them "cyclone beds." Secure letters of intent from potential B2B/institutional clients.',
    dimension: 'economic',
    potential: 'high',
    dataSource: 'Revenue segments + meeting notes',
  },
  {
    id: 'local-feedstock',
    title: 'Increase local feedstock from 60% to 85%',
    description: 'More community-sourced plastic reduces materials cost and strengthens circular economy narrative. Deploy shredder containers to stay in community between production runs.',
    dimension: 'environmental',
    potential: 'medium',
    dataSource: 'Environmental metrics',
  },
  {
    id: 'fleet-utilisation',
    title: 'Tennant Creek fleet has highest washing machine utilisation',
    description: 'Investigate what drives higher adoption in Tennant Creek vs other communities. Could inform fleet expansion strategy and community engagement model.',
    dimension: 'health',
    potential: 'medium',
    dataSource: 'Fleet telemetry: daily_machine_rollups',
  },
];
