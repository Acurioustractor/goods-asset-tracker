/**
 * Impact Data Fetcher — Server-side functions that pull live data from Supabase + Empathy Ledger
 * and compute the impact snapshot used by /impact page and /api/impact route.
 */

import { createClient } from '@/lib/supabase/server';
import { empathyLedger } from '@/lib/empathy-ledger/client';
import {
  IMPACT_DIMENSIONS,
  DEFAULT_OPPORTUNITIES,
  FINANCIAL_SUMMARY,
  MODELLED_LABOUR_HOURS_PER_BED,
  type ImpactSnapshot,
  type ImpactDimension,
  type HealthCascadeData,
  type OptimizationOpportunity,
} from './impact-model';
import { PLASTIC_KG_PER_BED } from './products';

// ---------------------------------------------------------------------------
// Named, sourced constants for derived impact metrics
// ---------------------------------------------------------------------------

/** Average household size used to convert beds → people reached. MODELLED. */
const AVG_HOUSEHOLD_SIZE = 2.5;

/** Nights per year, for sleep-nights provided. */
const NIGHTS_PER_YEAR = 365;

/**
 * Cost to the health system per surgical RHD admission, used for the MODELLED
 * government-savings estimate. Source: END RHD 2018 (~$70K per surgical
 * admission). NOTE: this is NOT the older $250K figure (the impact-model
 * sourceDetail explicitly flags $250K as wrong). Reconciled to
 * impact-model.ts `govt-savings` metric sourceDetail. MODELLED, not measured.
 */
const RHD_SURGICAL_ADMISSION_COST_AUD = 70_000;

/** MODELLED incidence assumptions for the conservative govt-savings estimate. */
const BEDS_PER_RHD_CASE_PREVENTED = 500; // 1 RHD case prevented per ~500 beds (× household)
const WASH_CYCLES_PER_RHD_CASE_PREVENTED = 5_000;

/**
 * Washing machines: the register tracks 28 physically DEPLOYED, but fleet
 * telemetry confirms ~14 actually reporting/working. Public/funder surfaces
 * use the honest WORKING number (Ben, 2026-05-30). Not yet auto-derivable
 * (fleet telemetry unreliable) — wire to fleet KPIs when stable. Never publish
 * 28 (deployed) or 41 (all rows incl. retired) as the working count.
 */
const WASHERS_WORKING = 14;

// ---------------------------------------------------------------------------
// Individual data fetchers
// ---------------------------------------------------------------------------

interface AssetStats {
  totalAssets: number; // deployed units (beds + washers), quantity-summed
  totalBeds: number; // deployed beds (Stretch + Basket)
  stretchBedsDeployed: number; // recycled-HDPE beds — the plastic-diversion product
  basketBedsDeployed: number; // archived prototype — NOT a plastic product
  totalWashingMachines: number; // public figure = telemetry-working washers (14)
  washersDeployed: number; // physically deployed washers (28)
  washersWorking: number; // telemetry-confirmed working (14)
  communitiesServed: number;
  communityBreakdown: { community: string; count: number }[];
}

async function getAssetStats(): Promise<AssetStats> {
  const supabase = await createClient();

  // Pull rows and reduce in JS so we can (1) filter to status='deployed',
  // (2) sum `quantity` (bulk rows exist, e.g. the 108-qty Centrecorp order),
  // and (3) split beds into Stretch (recycled HDPE — the plastic-diversion
  // product) vs Basket (archived prototype, NOT plastic). Head-only row counts
  // with no status filter are what produced the 520 / 41 / 10,400 overclaim.
  type AssetRow = {
    product: string | null;
    status: string | null;
    quantity: number | null;
    community: string | null;
  };
  const { data: rows } = await supabase
    .from('assets')
    .select('product, status, quantity, community');
  const all = (rows ?? []) as unknown as AssetRow[];

  const qty = (r: AssetRow) => r.quantity ?? 1;
  const sum = (arr: AssetRow[]) => arr.reduce((s, r) => s + qty(r), 0);
  const isBed = (p: string | null) => /bed/i.test(p ?? '');
  const isStretch = (p: string | null) => /stretch/i.test(p ?? '');
  const isWasher = (p: string | null) => /washing|washer/i.test(p ?? '');

  const deployed = all.filter((r) => r.status === 'deployed');
  const deployedBeds = deployed.filter((r) => isBed(r.product));
  const totalBeds = sum(deployedBeds);
  const stretchBedsDeployed = sum(deployedBeds.filter((r) => isStretch(r.product)));
  const basketBedsDeployed = totalBeds - stretchBedsDeployed;
  const washersDeployed = sum(deployed.filter((r) => isWasher(r.product)));

  // Community breakdown over DEPLOYED units only (excludes the Centrecorp
  // `requested` placeholder + allocated-only communities like Mutitjulu).
  const communityCounts = deployed.reduce((acc, asset) => {
    const community = asset.community || 'Unknown';
    acc[community] = (acc[community] || 0) + qty(asset);
    return acc;
  }, {} as Record<string, number>);

  const communityBreakdown = Object.entries(communityCounts)
    .map(([community, count]) => ({ community, count }))
    .sort((a, b) => b.count - a.count);

  const communitiesServed = Object.keys(communityCounts).filter(
    (c) => c !== 'Unknown' && c !== 'Pending Delivery',
  ).length;

  return {
    totalAssets: sum(deployed),
    totalBeds,
    stretchBedsDeployed,
    basketBedsDeployed,
    totalWashingMachines: WASHERS_WORKING,
    washersDeployed,
    washersWorking: WASHERS_WORKING,
    communitiesServed,
    communityBreakdown,
  };
}

interface FleetStats {
  totalWashCycles: number;
  totalKwh: number;
  machinesOnline: number;
  machinesTotal: number;
}

async function getFleetStats(): Promise<FleetStats> {
  const supabase = await createClient();

  try {
    const { data: kpiRows } = await supabase.rpc('get_fleet_kpis');
    const kpis = kpiRows?.[0];

    if (kpis) {
      return {
        totalWashCycles: kpis.total_cycles || 0,
        totalKwh: kpis.total_kwh || 0,
        machinesOnline: kpis.machines_online || 0,
        machinesTotal: kpis.machines_total || 0,
      };
    }
  } catch {
    // Fleet KPI function may not exist — fall back to direct query
  }

  // Fallback: count cycles directly
  const { count } = await supabase
    .from('usage_logs')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', 'cycle_complete');

  return {
    totalWashCycles: count || 0,
    totalKwh: 0,
    machinesOnline: 0,
    machinesTotal: 0,
  };
}

interface StorytellerStats {
  storytellerCount: number;
  storyCount: number;
}

async function getStorytellerStats(): Promise<StorytellerStats> {
  try {
    const insights = await empathyLedger.getProjectInsights();
    if (insights) {
      return {
        storytellerCount: insights.project.storytellerCount || 0,
        storyCount: insights.project.transcriptCount || 0,
      };
    }
  } catch {
    // EL may be unavailable
  }

  // Fallback: try storytellers endpoint
  try {
    const storytellers = await empathyLedger.getProjectStorytellers({ limit: 200 });
    return {
      storytellerCount: storytellers.length,
      storyCount: 0,
    };
  } catch {
    return { storytellerCount: 33, storyCount: 0 }; // known baseline
  }
}

// ---------------------------------------------------------------------------
// Compute derived metrics
// ---------------------------------------------------------------------------

function computeSleepNights(beds: number): number {
  return Math.round(beds * AVG_HOUSEHOLD_SIZE * NIGHTS_PER_YEAR);
}

/** Plastic diverted (kg). STRETCH beds only — recycled HDPE. Basket Beds are not a plastic product. */
function computePlasticDiverted(stretchBeds: number): number {
  return stretchBeds * PLASTIC_KG_PER_BED;
}

function computeEmploymentHours(beds: number): number {
  return Math.round(beds * MODELLED_LABOUR_HOURS_PER_BED);
}

function computeGovtSavings(beds: number, washCycles: number): number {
  // MODELLED, conservative — not measured. Needs a health-evidence partner
  // before external use. Uses ~$70K per surgical RHD admission (END RHD 2018),
  // NOT the discredited $250K figure.
  // - Each bed serves ~AVG_HOUSEHOLD_SIZE people
  // - Clean bedding reduces scabies risk → reduces RHD
  // - Estimate: 1 RHD case prevented per ~500 beds (× household)
  const rhdCasesPrevented = (beds * AVG_HOUSEHOLD_SIZE) / BEDS_PER_RHD_CASE_PREVENTED;
  const savingsFromBeds = rhdCasesPrevented * RHD_SURGICAL_ADMISSION_COST_AUD;

  // Wash cycles prevent skin infections; ~1 RHD case prevented per 5000 cycles
  const rhdFromWashing = washCycles / WASH_CYCLES_PER_RHD_CASE_PREVENTED;
  const savingsFromWashing = rhdFromWashing * RHD_SURGICAL_ADMISSION_COST_AUD;

  return Math.round(savingsFromBeds + savingsFromWashing);
}

// ---------------------------------------------------------------------------
// Build health cascade data
// ---------------------------------------------------------------------------

function buildHealthCascade(
  beds: number,
  washCycles: number,
  machinesOnline: number,
): HealthCascadeData {
  return {
    totalWashCycles: washCycles,
    machinesOnline,
    bedsDelivered: beds,
    sleepNightsProvided: computeSleepNights(beds),
    steps: [
      {
        label: 'No washing machine',
        description: 'Families can\'t clean bedding regularly',
        interrupted: machinesOnline > 0,
        liveMetric: { value: washCycles, unit: 'wash cycles completed' },
      },
      {
        label: 'Dirty bedding',
        description: 'Unwashed sheets and blankets harbour scabies mites',
        interrupted: washCycles > 0,
      },
      {
        label: 'Scabies infection',
        description: '1 in 3 children in remote communities have scabies at any time',
        interrupted: false,
      },
      {
        label: 'Group A Streptococcus',
        description: 'Scabies sores become infected with Strep A bacteria',
        interrupted: false,
      },
      {
        label: 'Rheumatic Heart Disease',
        description: 'Repeated Strep A infections trigger autoimmune heart damage',
        interrupted: false,
      },
      {
        label: 'Heart failure & death',
        description: 'RHD is entirely preventable — yet children are dying from it',
        interrupted: false,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Generate dynamic optimization opportunities
// ---------------------------------------------------------------------------

function generateOpportunities(
  assetStats: AssetStats,
  fleetStats: FleetStats,
): OptimizationOpportunity[] {
  const opportunities = [...DEFAULT_OPPORTUNITIES];

  // Add dynamic opportunities based on live data
  if (fleetStats.machinesTotal > 0 && fleetStats.machinesOnline < fleetStats.machinesTotal) {
    const offline = fleetStats.machinesTotal - fleetStats.machinesOnline;
    opportunities.push({
      id: 'fleet-offline',
      title: `${offline} washing machine${offline > 1 ? 's' : ''} currently offline`,
      description: `${fleetStats.machinesOnline}/${fleetStats.machinesTotal} machines online. Each offline machine means a family without clean bedding. Investigate connectivity and maintenance needs.`,
      dimension: 'health',
      potential: 'high',
      dataSource: 'Fleet telemetry — real-time',
    });
  }

  // Community concentration insight
  if (assetStats.communityBreakdown.length > 0) {
    const top = assetStats.communityBreakdown[0];
    const topPct = Math.round((top.count / assetStats.totalAssets) * 100);
    if (topPct > 40) {
      opportunities.push({
        id: 'community-concentration',
        title: `${topPct}% of assets concentrated in ${top.community}`,
        description: `${top.community} has ${top.count} of ${assetStats.totalAssets} total assets. Consider expanding distribution to underserved communities to broaden impact.`,
        dimension: 'community-ownership',
        potential: 'medium',
        dataSource: 'Asset register — community breakdown',
      });
    }
  }

  return opportunities;
}

// ---------------------------------------------------------------------------
// Populate dimension metrics with live data
// ---------------------------------------------------------------------------

function populateDimensions(
  dimensions: ImpactDimension[],
  assetStats: AssetStats,
  fleetStats: FleetStats,
  storytellerStats: StorytellerStats,
): ImpactDimension[] {
  const liveValues: Record<string, number> = {
    'beds-delivered': assetStats.totalBeds,
    'sleep-nights': computeSleepNights(assetStats.totalBeds),
    'wash-cycles': fleetStats.totalWashCycles,
    'plastic-diverted': computePlasticDiverted(assetStats.stretchBedsDeployed),
    'employment-hours': computeEmploymentHours(assetStats.totalBeds),
    'storytellers-active': storytellerStats.storytellerCount,
    'communities-served': assetStats.communitiesServed,
    'govt-savings': computeGovtSavings(assetStats.totalBeds, fleetStats.totalWashCycles),
  };

  return dimensions.map((dim) => ({
    ...dim,
    metrics: dim.metrics.map((metric) => ({
      ...metric,
      current: liveValues[metric.id] ?? metric.current,
    })),
  }));
}

// ---------------------------------------------------------------------------
// Main fetch function
// ---------------------------------------------------------------------------

export async function fetchImpactData(): Promise<ImpactSnapshot> {
  const [assetStats, fleetStats, storytellerStats] = await Promise.all([
    getAssetStats(),
    getFleetStats(),
    getStorytellerStats(),
  ]);

  const dimensions = populateDimensions(
    IMPACT_DIMENSIONS,
    assetStats,
    fleetStats,
    storytellerStats,
  );

  const plasticDiverted = computePlasticDiverted(assetStats.stretchBedsDeployed);
  const livesImpacted = Math.round(assetStats.totalBeds * AVG_HOUSEHOLD_SIZE);
  const employmentHours = computeEmploymentHours(assetStats.totalBeds);

  // Composite impact score: simple weighted sum
  const impactScore =
    assetStats.totalBeds * 10 + // each bed = 10 points
    fleetStats.totalWashCycles * 0.5 + // each wash cycle = 0.5 points
    plasticDiverted * 0.1 + // each kg plastic = 0.1 points
    storytellerStats.storytellerCount * 5 + // each storyteller = 5 points
    employmentHours * 0.2; // each employment hour = 0.2 points

  return {
    timestamp: new Date().toISOString(),
    dimensions,
    summary: {
      totalInvestment: FINANCIAL_SUMMARY.totalInvestment,
      totalAssets: assetStats.totalAssets,
      livesImpacted,
      plasticDivertedKg: plasticDiverted,
      communitiesServed: assetStats.communitiesServed,
      employmentHoursCreated: employmentHours,
      impactPerDollar: FINANCIAL_SUMMARY.totalInvestment > 0
        ? impactScore / FINANCIAL_SUMMARY.totalInvestment
        : 0,
    },
    optimizationOpportunities: generateOpportunities(assetStats, fleetStats),
    healthCascade: buildHealthCascade(
      assetStats.totalBeds,
      fleetStats.totalWashCycles,
      fleetStats.machinesOnline,
    ),
  };
}

/**
 * Canonical asset rollup — the single source every surface should read for
 * deployment counts. Deployed-only, quantity-summed, Basket/Stretch split,
 * washers = telemetry-working (14). Replaces the per-surface hand-counts that
 * drift (the 520 / 41 / 10,400 problem). Plastic = Stretch beds only.
 */
export async function getCanonicalAssetRollup() {
  const a = await getAssetStats();
  return {
    bedsDeployed: a.totalBeds,
    stretchBedsDeployed: a.stretchBedsDeployed,
    basketBedsDeployed: a.basketBedsDeployed,
    washersDeployed: a.washersDeployed,
    washersWorking: a.washersWorking,
    communitiesServed: a.communitiesServed,
    plasticKg: computePlasticDiverted(a.stretchBedsDeployed),
    deployedUnits: a.totalAssets,
  };
}

// Also export sub-fetchers for reuse
export { getAssetStats, getFleetStats, getStorytellerStats };
export type { AssetStats, FleetStats, StorytellerStats };
