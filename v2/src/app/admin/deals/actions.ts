'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// Re-export types from CRM for consistency
export type DealType = 'sale' | 'funding' | 'partnership' | 'procurement';
export type PipelineStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface KanbanDeal {
  id: string;
  title: string;
  deal_type: DealType;
  pipeline_stage: PipelineStage;
  amount_cents: number;
  probability: number;
  expected_close_date: string | null;
  actual_close_date: string | null;
  source: string | null;
  notes: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  contact_name: string | null;
  contact_org: string | null;
  contact_id: string | null;
  days_since_update: number;
  last_activity_date: string | null;
  needs_action: boolean;
}

export interface PipelineOverview {
  deals: KanbanDeal[];
  columns: Record<PipelineStage, KanbanDeal[]>;
  stats: {
    totalPipeline: number;
    totalWon: number;
    activeDeals: number;
    needsAction: number;
    byType: Record<DealType, { count: number; value: number }>;
  };
}

export async function getPipelineOverview(): Promise<PipelineOverview> {
  const supabase = createServiceClient();

  const [dealsResult, activitiesResult] = await Promise.all([
    supabase
      .from('crm_deals')
      .select('*, crm_contacts(name, organization)')
      .order('updated_at', { ascending: false }),
    supabase
      .from('crm_activities')
      .select('deal_id, occurred_at')
      .order('occurred_at', { ascending: false })
      .limit(500),
  ]);

  // Index last activity by deal_id
  const lastActivityByDeal = new Map<string, string>();
  for (const a of (activitiesResult.data || []) as Array<{ deal_id: string | null; occurred_at: string }>) {
    if (a.deal_id && !lastActivityByDeal.has(a.deal_id)) {
      lastActivityByDeal.set(a.deal_id, a.occurred_at);
    }
  }

  const now = new Date();

  const deals: KanbanDeal[] = (dealsResult.data || []).map((d: Record<string, unknown>) => {
    const contact = d.crm_contacts as { name?: string; organization?: string } | null;
    const updatedAt = d.updated_at as string;
    const daysSinceUpdate = Math.floor((now.getTime() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24));
    const lastActivity = lastActivityByDeal.get(d.id as string) || null;
    const stage = d.pipeline_stage as PipelineStage;
    const needsAction = stage !== 'won' && stage !== 'lost' && daysSinceUpdate > 7;

    return {
      id: d.id as string,
      title: d.title as string,
      deal_type: d.deal_type as DealType,
      pipeline_stage: stage,
      amount_cents: d.amount_cents as number,
      probability: d.probability as number,
      expected_close_date: d.expected_close_date as string | null,
      actual_close_date: d.actual_close_date as string | null,
      source: d.source as string | null,
      notes: d.notes as string | null,
      tags: d.tags as string[],
      created_at: d.created_at as string,
      updated_at: updatedAt,
      contact_name: contact?.name || null,
      contact_org: contact?.organization || null,
      contact_id: d.contact_id as string | null,
      days_since_update: daysSinceUpdate,
      last_activity_date: lastActivity,
      needs_action: needsAction,
    };
  });

  // Build columns
  const stages: PipelineStage[] = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
  const columns = {} as Record<PipelineStage, KanbanDeal[]>;
  for (const s of stages) columns[s] = [];
  for (const d of deals) {
    if (columns[d.pipeline_stage]) columns[d.pipeline_stage].push(d);
  }

  // Stats
  let totalPipeline = 0;
  let totalWon = 0;
  let activeDeals = 0;
  let needsAction = 0;
  const byType = {} as Record<DealType, { count: number; value: number }>;
  for (const dt of ['sale', 'funding', 'partnership', 'procurement'] as DealType[]) {
    byType[dt] = { count: 0, value: 0 };
  }

  for (const d of deals) {
    if (d.pipeline_stage === 'won') {
      totalWon += d.amount_cents;
    } else if (d.pipeline_stage !== 'lost') {
      totalPipeline += d.amount_cents;
      activeDeals++;
    }
    if (d.needs_action) needsAction++;
    if (byType[d.deal_type]) {
      byType[d.deal_type].count++;
      byType[d.deal_type].value += d.amount_cents;
    }
  }

  return {
    deals,
    columns,
    stats: { totalPipeline, totalWon, activeDeals, needsAction, byType },
  };
}

export async function moveDeal(dealId: string, newStage: PipelineStage) {
  const supabase = createServiceClient();
  const updates: Record<string, unknown> = {
    pipeline_stage: newStage,
    updated_at: new Date().toISOString(),
  };
  if (newStage === 'won') {
    updates.actual_close_date = new Date().toISOString().split('T')[0];
    updates.probability = 100;
  } else if (newStage === 'lost') {
    updates.actual_close_date = new Date().toISOString().split('T')[0];
    updates.probability = 0;
  }

  const { error } = await supabase.from('crm_deals').update(updates).eq('id', dealId);
  if (error) return { error: error.message };
  revalidatePath('/admin/deals');
  return { success: true };
}

export async function createDeal(data: {
  title: string;
  deal_type: DealType;
  amount_cents?: number;
  notes?: string;
  contact_id?: string;
  source?: string;
}) {
  const supabase = createServiceClient();
  const { error } = await supabase.from('crm_deals').insert({
    title: data.title,
    deal_type: data.deal_type,
    pipeline_stage: 'lead',
    amount_cents: data.amount_cents || 0,
    notes: data.notes || null,
    contact_id: data.contact_id || null,
    source: data.source || null,
    tags: [],
  });
  if (error) return { error: error.message };
  revalidatePath('/admin/deals');
  return { success: true };
}
