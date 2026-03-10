/**
 * Impact Model — Structured 5-dimension framework for measuring Goods on Country impact
 *
 * Aligned with:
 * - PFI EOI Section 8 (impact dimensions)
 * - Queensland Social Enterprise funding (WISE model, employment hours)
 * - Autoresearch pattern: define metrics → measure → identify opportunities → iterate
 *
 * The "loss function" is impact per dollar. Everything else is a hyperparameter.
 */

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

export interface HealthCascadeData {
  totalWashCycles: number;
  machinesOnline: number;
  bedsDelivered: number;
  sleepNightsProvided: number; // beds × avg household × days since delivery
  steps: {
    label: string;
    description: string;
    interrupted: boolean;
    liveMetric?: { value: number; unit: string };
  }[];
}

// ---------------------------------------------------------------------------
// Revenue segments (from Eloise meeting — B2B, B2C, Government, Corporate)
// ---------------------------------------------------------------------------

export interface RevenueSegment {
  id: string;
  name: string;
  description: string;
  currentEvidence: string;
  projectedShare: number; // percentage of total revenue
}

export const REVENUE_SEGMENTS: RevenueSegment[] = [
  {
    id: 'b2b',
    name: 'B2B Sales',
    description: 'Direct sales to organisations distributing to communities',
    currentEvidence: '109 beds sold to Centrecorp (first substantial commercial transaction)',
    projectedShare: 45,
  },
  {
    id: 'government',
    name: 'Government Procurement',
    description: 'NT and QLD government procurement for remote communities',
    currentEvidence: 'Conversations with NT government, health organisations requesting beds',
    projectedShare: 25,
  },
  {
    id: 'b2c',
    name: 'Direct to Consumer',
    description: 'E-commerce sales — camping, emergency, beach use cases',
    currentEvidence: 'Community consultations suggest camping/emergency bed market; "cyclone beds" in NT',
    projectedShare: 20,
  },
  {
    id: 'corporate',
    name: 'Corporate & Events',
    description: 'Corporate engagement — team builds, NAIDOC week, sponsorship',
    currentEvidence: 'QIC interested in building 50 beds with staff for NAIDOC week',
    projectedShare: 10,
  },
];

// ---------------------------------------------------------------------------
// Production cost model (from meeting — cost per unit breakdown)
// ---------------------------------------------------------------------------

export interface ProductionCostItem {
  stage: string;
  hoursPerUnit: number;
  personnelRequired: number;
  costPerUnit: number;
}

export const PRODUCTION_COST_BREAKDOWN: ProductionCostItem[] = [
  { stage: 'Plastic collection & sorting', hoursPerUnit: 0.5, personnelRequired: 1, costPerUnit: 15 },
  { stage: 'Shredding & pelletising', hoursPerUnit: 0.3, personnelRequired: 1, costPerUnit: 10 },
  { stage: 'Sheet pressing (190°C, 5000 PSI)', hoursPerUnit: 1.0, personnelRequired: 1, costPerUnit: 30 },
  { stage: 'CNC cutting', hoursPerUnit: 3.5, personnelRequired: 1, costPerUnit: 120 },
  { stage: 'Canvas & steel prep', hoursPerUnit: 0.5, personnelRequired: 1, costPerUnit: 80 },
  { stage: 'Assembly & QC', hoursPerUnit: 0.5, personnelRequired: 2, costPerUnit: 40 },
  { stage: 'Materials (steel, canvas, caps)', hoursPerUnit: 0, personnelRequired: 0, costPerUnit: 180 },
  { stage: 'Freight & logistics', hoursPerUnit: 0.2, personnelRequired: 1, costPerUnit: 75 },
];

export const TOTAL_LABOUR_HOURS_PER_BED = PRODUCTION_COST_BREAKDOWN.reduce(
  (sum, item) => sum + item.hoursPerUnit,
  0
);

export const TOTAL_COST_PER_BED = PRODUCTION_COST_BREAKDOWN.reduce(
  (sum, item) => sum + item.costPerUnit,
  0
);

// ---------------------------------------------------------------------------
// 5 Impact Dimensions
// ---------------------------------------------------------------------------

export const IMPACT_DIMENSIONS: ImpactDimension[] = [
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 1. HEALTH & WELLBEING
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'health',
    name: 'Health & Wellbeing',
    description: 'Beds and washing machines as health hardware — interrupting the scabies → Strep A → RHD cascade',
    icon: 'heart',
    color: '#C45C3E',
    primaryMetricId: 'sleep-nights',
    communityQuote: {
      text: 'Scabies often leads to Rheumatic Heart Disease, so washing machines are essential to be able to clean infected clothing, bedding and towels.',
      author: 'Jessica Allardyce',
      context: 'Miwatj Health, Gapuwiyak',
    },
    metrics: [
      {
        id: 'beds-delivered',
        name: 'Beds Delivered',
        unit: 'beds',
        current: null, // fetched live from Supabase
        targets: { year1: 1500, year3: 5000, vision2030: 25000 },
        source: 'supabase',
        sourceDetail: 'assets table — count where product ilike %bed%',
        proxyFor: 'Households with proper sleeping infrastructure',
        optimizationLevers: ['Production capacity', 'Freight partnerships', 'Community demand pipeline'],
        computeFn: 'getBedsDelivered',
      },
      {
        id: 'sleep-nights',
        name: 'Sleep Nights Provided',
        unit: 'nights',
        current: null,
        targets: { year1: 1_368_750, year3: 4_562_500, vision2030: 22_812_500 },
        source: 'computed',
        sourceDetail: 'beds × 2.5 people × 365 nights',
        proxyFor: 'Improved health outcomes from proper rest',
        optimizationLevers: ['More beds delivered', 'Product longevity'],
        computeFn: 'computeSleepNights',
      },
      {
        id: 'wash-cycles',
        name: 'Wash Cycles Completed',
        unit: 'cycles',
        current: null,
        targets: { year1: 15000, year3: 60000, vision2030: 500000 },
        source: 'supabase',
        sourceDetail: 'usage_logs table — count where event_type = cycle_complete',
        proxyFor: 'Scabies/RHD prevention through clean bedding',
        optimizationLevers: ['Machine uptime', 'Community adoption', 'Fleet expansion'],
        computeFn: 'getWashCycles',
      },
      {
        id: 'product-survival-rate',
        name: 'Product Survival Rate',
        unit: '%',
        current: 95, // estimate — only 15-20 beds with 6+ months data
        targets: { year1: 90, year3: 92, vision2030: 95 },
        source: 'manual',
        sourceDetail: 'Check-in system — % of assets still in use at 12 months',
        proxyFor: 'Long-term health benefit durability',
        optimizationLevers: ['Material quality', 'Design iteration', 'Repair network'],
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 2. ENVIRONMENTAL
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'environmental',
    name: 'Environmental',
    description: 'Turning community plastic waste into health infrastructure — circular economy at community scale',
    icon: 'leaf',
    color: '#8B9D77',
    primaryMetricId: 'plastic-diverted',
    communityQuote: {
      text: 'We don\'t need fancy solutions. We need beds that don\'t break, washing machines that can be fixed here, and people who actually listen.',
      author: 'Community voice',
      context: 'Palm Island',
    },
    metrics: [
      {
        id: 'plastic-diverted',
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
        name: 'Average Product Lifespan',
        unit: 'years',
        current: 10, // design target, not yet measured at scale
        targets: { year1: 10, year3: 12, vision2030: 15 },
        source: 'manual',
        sourceDetail: 'Design target — field testing ongoing',
        proxyFor: 'Reduced replacement cycles vs conventional products',
        optimizationLevers: ['Material science', 'UV resistance', 'Repair programs'],
      },
      {
        id: 'local-feedstock-pct',
        name: 'Local Feedstock %',
        unit: '%',
        current: 60, // estimate — some plastic still sourced from metro
        targets: { year1: 70, year3: 85, vision2030: 95 },
        source: 'manual',
        sourceDetail: 'Percentage of HDPE sourced from community collection vs external',
        proxyFor: 'Community-driven circular economy',
        optimizationLevers: ['Community collection programs', 'Shredder deployment', 'Plastic sorting training'],
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 3. ECONOMIC (includes WISE model from Eloise meeting)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'economic',
    name: 'Economic',
    description: 'Work-Integrated Social Enterprise (WISE) — impact through employing people typically outside the job market',
    icon: 'briefcase',
    color: '#D4A574',
    primaryMetricId: 'employment-hours',
    communityQuote: {
      text: 'We\'re setting this up for our kids and grandkids... independence, being in charge of your own destiny.',
      author: 'Linda Turner',
      context: 'Tennant Creek',
    },
    metrics: [
      {
        id: 'employment-hours',
        name: 'Employment Hours Created',
        unit: 'hours',
        current: null,
        targets: { year1: 9750, year3: 32500, vision2030: 162500 },
        source: 'computed',
        sourceDetail: `${TOTAL_LABOUR_HOURS_PER_BED.toFixed(1)} labour hours per bed × beds produced`,
        proxyFor: 'Economic inclusion for at-risk youth and community members',
        optimizationLevers: ['Production volume', 'Training programs', 'Community facility hosting'],
        computeFn: 'computeEmploymentHours',
      },
      {
        id: 'fte-jobs',
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
        id: 'cost-per-unit',
        name: 'Production Cost per Unit',
        unit: '$/bed',
        current: TOTAL_COST_PER_BED,
        targets: { year1: 520, year3: 350, vision2030: 280 },
        source: 'computed',
        sourceDetail: 'Sum of all production stage costs',
        proxyFor: 'Operational efficiency and affordability',
        optimizationLevers: ['CNC time reduction (3.5hrs→2hrs)', 'Bulk materials purchasing', 'Local sourcing'],
        computeFn: 'getCostPerUnit',
      },
      {
        id: 'revenue',
        name: 'Annual Revenue',
        unit: '$',
        current: 50000, // approximate from trade + sales
        targets: { year1: 1_100_000, year3: 4_000_000, vision2030: 15_000_000 },
        source: 'xero',
        sourceDetail: 'Xero — goods project tagged transactions',
        optimizationLevers: ['B2B pipeline', 'Government procurement', 'E-commerce launch'],
      },
      {
        id: 'govt-savings',
        name: 'Government Health Savings (est.)',
        unit: '$',
        current: null,
        targets: { year1: 2_000_000, year3: 10_000_000, vision2030: 50_000_000 },
        source: 'computed',
        sourceDetail: 'RHD surgery cost ($250K) × estimated cases prevented by clean bedding infrastructure',
        proxyFor: 'Healthcare system cost reduction from preventive health hardware',
        optimizationLevers: ['Bed and washer deployment', 'Evidence gathering for health impact'],
        computeFn: 'computeGovtSavings',
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 4. COMMUNITY OWNERSHIP
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'community-ownership',
    name: 'Community Ownership',
    description: 'Transfer manufacturing to community-controlled enterprise — "Our job is to become unnecessary"',
    icon: 'users',
    color: '#7C6F64',
    primaryMetricId: 'storytellers-active',
    communityQuote: {
      text: 'Working both ways — cultural side in white society and Indigenous society.',
      author: 'Dianne Stokes',
      context: 'Elder, Tennant Creek',
    },
    metrics: [
      {
        id: 'storytellers-active',
        name: 'Active Storytellers',
        unit: 'people',
        current: null,
        targets: { year1: 50, year3: 100, vision2030: 300 },
        source: 'empathy-ledger',
        sourceDetail: 'Empathy Ledger — storyteller count for goods-on-country project',
        proxyFor: 'Community engagement depth and voice representation',
        optimizationLevers: ['Community visits', 'Story gathering events', 'Elder engagement'],
        computeFn: 'getStorytellerCount',
      },
      {
        id: 'community-production-days',
        name: 'Community Production Days/Week',
        unit: 'days/week',
        current: 0,
        targets: { year1: 1, year3: 2, vision2030: 3 },
        source: 'manual',
        sourceDetail: 'Days per week community operates production without ACT presence',
        proxyFor: 'Self-determination in manufacturing',
        optimizationLevers: ['Training programs', 'Documentation', 'Leadership development'],
      },
      {
        id: 'community-employment-pct',
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
        id: 'communities-served',
        name: 'Communities Served',
        unit: 'communities',
        current: null,
        targets: { year1: 12, year3: 25, vision2030: 60 },
        source: 'supabase',
        sourceDetail: 'assets table — distinct community values',
        optimizationLevers: ['Distribution partnerships', 'Freight networks', 'Health org partnerships'],
        computeFn: 'getCommunitiesServed',
      },
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 5. PRODUCTION EFFICIENCY
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  {
    id: 'production',
    name: 'Production Efficiency',
    description: 'Optimising the path from community plastic waste to deployed health hardware',
    icon: 'factory',
    color: '#5E7D9A',
    primaryMetricId: 'units-per-month',
    metrics: [
      {
        id: 'units-per-month',
        name: 'Units Produced per Month',
        unit: 'beds/month',
        current: 15, // estimate during active production runs
        targets: { year1: 125, year3: 417, vision2030: 1000 },
        source: 'manual',
        sourceDetail: 'Production logs — monthly output',
        optimizationLevers: ['Facility utilisation', 'Second shift', 'Additional facilities'],
      },
      {
        id: 'cnc-time',
        name: 'CNC Cutting Time per Bed',
        unit: 'hours',
        current: 3.5,
        targets: { year1: 3.0, year3: 2.0, vision2030: 1.0 },
        source: 'manual',
        sourceDetail: 'Measured at production facility — largest single time cost',
        proxyFor: 'Production bottleneck efficiency',
        optimizationLevers: ['Toolpath optimisation', 'Better tooling', 'Multi-head router'],
      },
      {
        id: 'facility-count',
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
        name: 'Facility Utilisation',
        unit: '%',
        current: 30, // intermittent production runs
        targets: { year1: 60, year3: 75, vision2030: 85 },
        source: 'manual',
        sourceDetail: 'Percentage of available production time used',
        optimizationLevers: ['Demand pipeline', 'Circuit production model', 'Inventory build'],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Financial summary (from PFI + meeting)
// ---------------------------------------------------------------------------

export const FINANCIAL_SUMMARY = {
  totalInvestment: 445_000, // total funding received to date
  tradeRevenue: 50_000, // approximate trade revenue to date
  productionPlantInvestment: 100_000, // TFN + ACT in containerised facility
  currentCostPerUnit: TOTAL_COST_PER_BED,
  targetCostPerUnit: { year1: 520, year3: 350, vision2030: 280 },
};

// ---------------------------------------------------------------------------
// Default optimization opportunities (data-driven suggestions)
// ---------------------------------------------------------------------------

export const DEFAULT_OPPORTUNITIES: OptimizationOpportunity[] = [
  {
    id: 'cnc-optimisation',
    title: 'CNC cutting time is the largest cost driver',
    description: `CNC cutting currently takes 3.5 hours/bed at ~$34/hr. Reducing to 2 hours saves $51/unit — $76.5K/year at 1,500 units. Investigate toolpath optimisation and multi-head routing.`,
    dimension: 'production',
    potential: 'high',
    dataSource: 'Production cost breakdown',
  },
  {
    id: 'wise-employment',
    title: 'Each bed sale creates ${TOTAL_LABOUR_HOURS_PER_BED.toFixed(1)} hours of employment',
    description: `At 1,500 beds/year, that's ${(1500 * TOTAL_LABOUR_HOURS_PER_BED).toLocaleString()} hours of employment for at-risk youth. The WISE model is the strongest impact narrative for QLD government funding.`,
    dimension: 'economic',
    potential: 'high',
    dataSource: 'Production cost model + Eloise meeting',
  },
  {
    id: 'b2b-pipeline',
    title: 'B2B channel has strongest commercial evidence',
    description: '109 beds sold to Centrecorp demonstrates demand. Emergency services are a natural fit — NT already calls them "cyclone beds." Secure letters of intent from potential B2B clients.',
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
    dataSource: 'Fleet telemetry — daily_machine_rollups',
  },
];
