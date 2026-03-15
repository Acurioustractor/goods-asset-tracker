'use server';

import { createClient } from '@/lib/supabase/server';
import type { AssetStatus } from '@/lib/types/database';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PipelineEntry {
  unique_id: string;
  product: string | null;
  status: string;
  community: string;
  quantity: number;
  partner_name: string | null;
  notes: string | null;
  created_at: string;
}

export interface AdminKPIs {
  bedsDeployed: number;
  bedsInPipeline: number;
  communitiesServed: number;
  totalRevenue: number;
}

export interface RecentEvent {
  type: 'production' | 'fleet' | 'order';
  label: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// KPIs
// ---------------------------------------------------------------------------

export async function getAdminKPIs(): Promise<AdminKPIs> {
  const supabase = await createClient();

  const [deployedResult, pipelineResult, communityResult, revenueResult] = await Promise.all([
    // Beds deployed
    supabase
      .from('assets')
      .select('quantity')
      .eq('status', 'deployed')
      .ilike('product', '%bed%'),
    // Beds in pipeline (requested + allocated)
    supabase
      .from('assets')
      .select('quantity')
      .in('status', ['requested', 'allocated'])
      .ilike('product', '%bed%'),
    // Distinct communities from deployed assets
    supabase
      .from('assets')
      .select('community')
      .eq('status', 'deployed'),
    // Revenue from paid orders
    supabase
      .from('orders')
      .select('total_cents')
      .eq('payment_status', 'paid'),
  ]);

  const bedsDeployed = (deployedResult.data || []).reduce(
    (sum, a) => sum + (a.quantity || 1), 0
  );
  const bedsInPipeline = (pipelineResult.data || []).reduce(
    (sum, a) => sum + (a.quantity || 1), 0
  );

  const communities = new Set(
    (communityResult.data || [])
      .map((a) => a.community)
      .filter((c): c is string => !!c && c !== 'Unknown')
  );

  const totalRevenue = (revenueResult.data || []).reduce(
    (sum, o) => sum + (o.total_cents || 0), 0
  ) / 100;

  return {
    bedsDeployed,
    bedsInPipeline,
    communitiesServed: communities.size,
    totalRevenue,
  };
}

// ---------------------------------------------------------------------------
// Pipeline
// ---------------------------------------------------------------------------

export async function getPipelineAssets(): Promise<PipelineEntry[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('assets')
    .select('unique_id, product, status, community, quantity, partner_name, notes, created_time')
    .in('status', ['requested', 'allocated', 'demo'])
    .ilike('product', '%bed%')
    .order('created_time', { ascending: false });

  return (data || []).map((row) => ({
    unique_id: row.unique_id,
    product: row.product,
    status: row.status,
    community: row.community,
    quantity: row.quantity ?? 1,
    partner_name: row.partner_name ?? null,
    notes: row.notes,
    created_at: row.created_time,
  }));
}

// ---------------------------------------------------------------------------
// Recent Activity
// ---------------------------------------------------------------------------

export async function getRecentActivity(): Promise<RecentEvent[]> {
  const supabase = await createClient();

  const events: RecentEvent[] = [];

  // Latest production shift
  const { data: shift } = await supabase
    .from('production_shifts')
    .select('operator, shift_date, sheets_produced')
    .order('shift_date', { ascending: false })
    .limit(1)
    .single();

  if (shift) {
    events.push({
      type: 'production',
      label: `${shift.operator} produced ${shift.sheets_produced} sheets`,
      timestamp: shift.shift_date,
    });
  }

  // Latest fleet event
  const { data: usage } = await supabase
    .from('usage_logs')
    .select('site_name, event_type, created_at')
    .eq('event_type', 'cycle_complete')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (usage) {
    events.push({
      type: 'fleet',
      label: `Wash cycle at ${usage.site_name || 'unknown site'}`,
      timestamp: usage.created_at,
    });
  }

  // Latest order
  const { data: order } = await supabase
    .from('orders')
    .select('order_number, total_cents, created_at')
    .eq('payment_status', 'paid')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (order) {
    events.push({
      type: 'order',
      label: `Order ${order.order_number} — $${(order.total_cents / 100).toFixed(0)}`,
      timestamp: order.created_at,
    });
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
