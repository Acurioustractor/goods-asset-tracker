'use server';

import { getAssetStats, getFleetStats, getStorytellerStats } from '@/lib/data/impact-fetcher';
import { getMetrics } from '@/app/dashboard/actions';
import { FINANCIAL_SUMMARY, TOTAL_COST_PER_BED } from '@/lib/data/impact-model';
import { createServiceClient } from '@/lib/supabase/server';
import { empathyLedger } from '@/lib/empathy-ledger/client';
import { ghl } from '@/lib/ghl';
import type { ProductionShift, ProductionInventory, ProductionJournal, Partner } from '@/lib/types/database';

// ---------------------------------------------------------------------------
// System Health
// ---------------------------------------------------------------------------

export type HealthStatus = 'green' | 'amber' | 'red';

export interface SystemCheck {
  label: string;
  status: HealthStatus;
  detail: string;
}

export async function getSystemHealth(): Promise<SystemCheck[]> {
  const supabase = createServiceClient();
  const now = Date.now();

  const [usageLogs, shifts, inventory, orders] = await Promise.all([
    supabase
      .from('usage_logs')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1),
    supabase
      .from('production_shifts')
      .select('shift_date')
      .order('shift_date', { ascending: false })
      .limit(1),
    supabase
      .from('production_inventory')
      .select('snapshot_date')
      .order('snapshot_date', { ascending: false })
      .limit(1),
    supabase
      .from('orders')
      .select('created_at')
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false })
      .limit(1),
  ]);

  const checks: SystemCheck[] = [];

  // Fleet telemetry
  const lastTelemetry = usageLogs.data?.[0]?.created_at;
  if (lastTelemetry) {
    const age = now - new Date(lastTelemetry).getTime();
    const hours = age / 3600000;
    checks.push({
      label: 'Fleet Telemetry',
      status: hours < 1 ? 'green' : hours < 24 ? 'amber' : 'red',
      detail: hours < 1 ? 'Live' : `${Math.round(hours)}h ago`,
    });
  } else {
    checks.push({ label: 'Fleet Telemetry', status: 'red', detail: 'No data' });
  }

  // Production logging
  const lastShift = shifts.data?.[0]?.shift_date;
  if (lastShift) {
    const age = now - new Date(lastShift + 'T00:00:00').getTime();
    const days = age / 86400000;
    checks.push({
      label: 'Production Logging',
      status: days < 3 ? 'green' : days < 7 ? 'amber' : 'red',
      detail: days < 1 ? 'Today' : `${Math.round(days)}d ago`,
    });
  } else {
    checks.push({ label: 'Production Logging', status: 'red', detail: 'No data' });
  }

  // Inventory count
  const lastCount = inventory.data?.[0]?.snapshot_date;
  if (lastCount) {
    const age = now - new Date(lastCount + 'T00:00:00').getTime();
    const days = age / 86400000;
    checks.push({
      label: 'Inventory Count',
      status: days < 7 ? 'green' : days < 14 ? 'amber' : 'red',
      detail: days < 1 ? 'Today' : `${Math.round(days)}d ago`,
    });
  } else {
    checks.push({ label: 'Inventory Count', status: 'red', detail: 'No data' });
  }

  // Empathy Ledger
  try {
    const start = Date.now();
    const insights = await empathyLedger.getProjectInsights();
    const elapsed = Date.now() - start;
    checks.push({
      label: 'Empathy Ledger',
      status: insights ? (elapsed < 3000 ? 'green' : 'amber') : 'red',
      detail: insights ? `${elapsed}ms` : 'No response',
    });
  } catch {
    checks.push({ label: 'Empathy Ledger', status: 'red', detail: 'Down' });
  }

  // GHL CRM
  try {
    const start = Date.now();
    const tags = await ghl.getTags();
    const elapsed = Date.now() - start;
    checks.push({
      label: 'GHL CRM',
      status: tags.length > 0 ? (elapsed < 3000 ? 'green' : 'amber') : 'red',
      detail: tags.length > 0 ? `${tags.length} tags, ${elapsed}ms` : 'No response',
    });
  } catch {
    checks.push({ label: 'GHL CRM', status: ghl.isEnabled() ? 'red' : 'amber', detail: ghl.isEnabled() ? 'Down' : 'Disabled' });
  }

  // Stripe / Orders
  const lastOrder = orders.data?.[0]?.created_at;
  if (lastOrder) {
    const age = now - new Date(lastOrder).getTime();
    const days = age / 86400000;
    checks.push({
      label: 'Stripe Orders',
      status: days < 30 ? 'green' : days < 60 ? 'amber' : 'red',
      detail: days < 1 ? 'Today' : `${Math.round(days)}d ago`,
    });
  } else {
    checks.push({ label: 'Stripe Orders', status: 'red', detail: 'No orders' });
  }

  return checks;
}

// ---------------------------------------------------------------------------
// Impact KPIs
// ---------------------------------------------------------------------------

export interface ImpactKPIs {
  bedsInCommunities: number;
  washingMachinesDeployed: number;
  communitiesServed: number;
  livesImpacted: number;
  washCyclesAllTime: number;
  plasticDivertedKg: number;
  publishedStories: number;
  bedsPossibleFromStock: number;
}

export async function getImpactKPIs(): Promise<ImpactKPIs> {
  const supabase = createServiceClient();

  const [assetStats, fleetStats, storytellerStats, inventoryRes] = await Promise.all([
    getAssetStats(),
    getFleetStats(),
    getStorytellerStats(),
    supabase
      .from('production_inventory')
      .select('beds_possible')
      .order('snapshot_date', { ascending: false })
      .limit(1),
  ]);

  const bedsPossible = inventoryRes.data?.[0]?.beds_possible ?? 0;

  return {
    bedsInCommunities: assetStats.totalBeds,
    washingMachinesDeployed: assetStats.totalWashingMachines,
    communitiesServed: assetStats.communitiesServed,
    livesImpacted: Math.round(assetStats.totalAssets * 2.5),
    washCyclesAllTime: fleetStats.totalWashCycles,
    plasticDivertedKg: assetStats.totalBeds * 20,
    publishedStories: storytellerStats.storyCount,
    bedsPossibleFromStock: bedsPossible,
  };
}

// ---------------------------------------------------------------------------
// Fleet Summary
// ---------------------------------------------------------------------------

export interface FleetSummary {
  machinesOnline: number;
  machinesTotal: number;
  weekCycles: number;
  openAlerts: number;
  machines: {
    name: string;
    community: string | null;
    online: boolean;
    lastSeen: string | null;
    todayCycles: number;
  }[];
}

export async function getFleetSummary(): Promise<FleetSummary> {
  const supabase = createServiceClient();

  const [kpiRes, alertRes, assetsRes] = await Promise.all([
    supabase.rpc('get_fleet_kpis'),
    supabase
      .from('alerts')
      .select('id', { count: 'exact', head: true })
      .or('resolved.is.null,resolved.eq.false'),
    supabase
      .from('assets')
      .select('unique_id, machine_id, name, community')
      .not('machine_id', 'is', null),
  ]);

  const kpis = kpiRes.data?.[0] || { total_cycles: 0, machines_online: 0, machines_total: 0 };

  // Get latest log per machine + today's cycles
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [latestRes, todayCyclesRes] = await Promise.all([
    supabase
      .from('usage_logs')
      .select('machine_id, online, created_at')
      .not('machine_id', 'is', null)
      .order('created_at', { ascending: false }),
    supabase
      .from('usage_logs')
      .select('machine_id')
      .eq('event_type', 'cycle_complete')
      .gte('created_at', todayStart.toISOString())
      .not('machine_id', 'is', null),
  ]);

  const latestByMachine = new Map<string, { online: boolean; created_at: string }>();
  for (const log of latestRes.data || []) {
    if (log.machine_id && !latestByMachine.has(log.machine_id)) {
      latestByMachine.set(log.machine_id, log);
    }
  }

  const todayCountByMachine = new Map<string, number>();
  for (const log of todayCyclesRes.data || []) {
    if (log.machine_id) {
      todayCountByMachine.set(log.machine_id, (todayCountByMachine.get(log.machine_id) || 0) + 1);
    }
  }

  const machines = (assetsRes.data || []).map((asset) => {
    const latest = latestByMachine.get(asset.machine_id!);
    return {
      name: asset.name || asset.machine_id!,
      community: asset.community,
      online: latest?.online ?? false,
      lastSeen: latest?.created_at || null,
      todayCycles: todayCountByMachine.get(asset.machine_id!) || 0,
    };
  });

  // Sort: online first, then by name
  machines.sort((a, b) => {
    if (a.online !== b.online) return a.online ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return {
    machinesOnline: kpis.machines_online || 0,
    machinesTotal: kpis.machines_total || 0,
    weekCycles: kpis.total_cycles || 0,
    openAlerts: alertRes.count || 0,
    machines,
  };
}

// ---------------------------------------------------------------------------
// Production Summary
// ---------------------------------------------------------------------------

export interface ProductionSummary {
  latestShift: {
    operator: string;
    date: string;
    sheetsProduced: number;
    dieselLevel: string;
  } | null;
  inventory: {
    bedsPossible: number;
    bottleneck: string | null;
    snapshotDate: string;
    components: Record<string, number>;
  } | null;
  openIssues: number;
}

export async function getProductionSummary(): Promise<ProductionSummary> {
  const supabase = createServiceClient();

  const [shiftsRes, inventoryRes, journalRes] = await Promise.all([
    supabase
      .from('production_shifts')
      .select('*')
      .order('shift_date', { ascending: false })
      .limit(1),
    supabase
      .from('production_inventory')
      .select('*')
      .order('snapshot_date', { ascending: false })
      .limit(1),
    supabase
      .from('production_journal')
      .select('id, entry_type, is_resolved')
      .eq('entry_type', 'issue')
      .eq('is_resolved', false),
  ]);

  const shift = shiftsRes.data?.[0] as ProductionShift | undefined;
  const inv = inventoryRes.data?.[0] as ProductionInventory | undefined;

  return {
    latestShift: shift
      ? {
          operator: shift.operator,
          date: shift.shift_date,
          sheetsProduced: shift.sheets_produced,
          dieselLevel: shift.diesel_level,
        }
      : null,
    inventory: inv
      ? {
          bedsPossible: inv.beds_possible ?? 0,
          bottleneck: null as string | null,
          snapshotDate: inv.snapshot_date,
          components: {
            'Chipped Sheets': inv.chipped_plastic_sheets,
            'Tab Sheets (finished)': inv.tab_sheets_finished,
            'Tabs Ready': inv.tabs_ready,
            'Legs Ready': inv.legs_ready,
            'Steel Poles': inv.steel_poles,
            'Canvas Ready': inv.canvas_ready,
          },
        }
      : null,
    openIssues: journalRes.data?.length || 0,
  };
}

// ---------------------------------------------------------------------------
// Funding & Revenue
// ---------------------------------------------------------------------------

export interface FundingSummary {
  tradeRevenue: number;
  ordersThisMonth: number;
  avgOrderValue: number;
  totalInvestment: number;
  productionPlantInvestment: number;
  partnerContributions: number;
  partnerSponsoredBeds: number;
  partners: { name: string; contribution: number; beds: number }[];
  costPerBed: number;
  recentOrders: { id: string; total: number; date: string }[];
}

export async function getFundingSummary(): Promise<FundingSummary> {
  const supabase = createServiceClient();

  const [metrics, partnersRes, recentOrdersRes] = await Promise.all([
    getMetrics(),
    supabase
      .from('partners')
      .select('name, total_contribution_cents, total_sponsored_beds, is_active')
      .eq('is_active', true)
      .order('total_contribution_cents', { ascending: false }),
    supabase
      .from('orders')
      .select('id, total_cents, created_at')
      .eq('payment_status', 'paid')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const partners = (partnersRes.data || []) as Pick<Partner, 'name' | 'total_contribution_cents' | 'total_sponsored_beds' | 'is_active'>[];
  const partnerContributions = partners.reduce((sum, p) => sum + (p.total_contribution_cents || 0), 0) / 100;
  const partnerSponsoredBeds = partners.reduce((sum, p) => sum + (p.total_sponsored_beds || 0), 0);

  const recentOrders = (recentOrdersRes.data || []).map((o) => ({
    id: o.id,
    total: (o.total_cents || 0) / 100,
    date: o.created_at,
  }));

  return {
    tradeRevenue: metrics.totalRevenue,
    ordersThisMonth: metrics.ordersThisMonth,
    avgOrderValue: metrics.averageOrderValue,
    totalInvestment: FINANCIAL_SUMMARY.totalInvestment,
    productionPlantInvestment: FINANCIAL_SUMMARY.productionPlantInvestment,
    partnerContributions,
    partnerSponsoredBeds,
    partners: partners.map((p) => ({
      name: p.name,
      contribution: (p.total_contribution_cents || 0) / 100,
      beds: p.total_sponsored_beds || 0,
    })),
    costPerBed: TOTAL_COST_PER_BED,
    recentOrders,
  };
}

// ---------------------------------------------------------------------------
// Stories Summary
// ---------------------------------------------------------------------------

export interface StoriesSummary {
  storytellerCount: number;
  storyCount: number;
  syndicationEnabledCount: number;
  latestStory: { title: string; date: string } | null;
  communityIdeas: { submitted: number; inProgress: number; completed: number };
}

export async function getStoriesSummary(): Promise<StoriesSummary> {
  const supabase = createServiceClient();

  const [storytellerStats, storiesRes, ideasRes] = await Promise.all([
    getStorytellerStats(),
    empathyLedger.getStories({ limit: 5 }),
    supabase
      .from('community_ideas')
      .select('status'),
  ]);

  const ideas = ideasRes.data || [];
  const submitted = ideas.filter((i) => i.status === 'submitted' || i.status === 'new').length;
  const inProgress = ideas.filter((i) => i.status === 'in_progress' || i.status === 'approved').length;
  const completed = ideas.filter((i) => i.status === 'completed' || i.status === 'implemented').length;

  const syndicationEnabled = storiesRes.filter((s) => s.syndicationEnabled).length;
  const latest = storiesRes[0] || null;

  return {
    storytellerCount: storytellerStats.storytellerCount,
    storyCount: storytellerStats.storyCount,
    syndicationEnabledCount: syndicationEnabled,
    latestStory: latest ? { title: latest.title, date: latest.publishedAt } : null,
    communityIdeas: { submitted, inProgress, completed },
  };
}

// ---------------------------------------------------------------------------
// CRM & Engagement Summary
// ---------------------------------------------------------------------------

export interface CRMSummary {
  totalContacts: number;
  goodsTaggedContacts: number;
  tagBreakdown: { tag: string; count: number }[];
  sourceBreakdown: { source: string; count: number }[];
  recentContacts: { name: string; tags: string[]; date: string }[];
  pipelineSummary: { pipeline: string; count: number }[];
}

export async function getCRMSummary(): Promise<CRMSummary> {
  try {
    const contacts = await ghl.getContacts();
    const goodsContacts = contacts.filter((c) =>
      c.tags?.some((t) => t.startsWith('goods-'))
    );

    // Tag breakdown (goods- tags only)
    const tagCounts = new Map<string, number>();
    for (const c of goodsContacts) {
      for (const t of c.tags) {
        if (t.startsWith('goods-')) {
          tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
        }
      }
    }
    const tagBreakdown = [...tagCounts.entries()]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);

    // Source breakdown
    const sourceCounts = new Map<string, number>();
    for (const c of contacts) {
      const src = c.source || 'Unknown';
      sourceCounts.set(src, (sourceCounts.get(src) || 0) + 1);
    }
    const sourceBreakdown = [...sourceCounts.entries()]
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Recent goods contacts (last 10)
    const recentContacts = goodsContacts
      .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
      .slice(0, 10)
      .map((c) => ({
        name: c.contactName || c.email || 'Unknown',
        tags: c.tags.filter((t) => t.startsWith('goods-')),
        date: c.dateAdded,
      }));

    return {
      totalContacts: contacts.length,
      goodsTaggedContacts: goodsContacts.length,
      tagBreakdown,
      sourceBreakdown,
      recentContacts,
      pipelineSummary: [],
    };
  } catch (error) {
    console.error('[Ops] CRM summary error:', error);
    return {
      totalContacts: 0,
      goodsTaggedContacts: 0,
      tagBreakdown: [],
      sourceBreakdown: [],
      recentContacts: [],
      pipelineSummary: [],
    };
  }
}
