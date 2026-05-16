'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ── Types ──

export type DealType = 'sale' | 'funding' | 'partnership' | 'procurement';
export type PipelineStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface Deal {
  id: string;
  contact_id: string | null;
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
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  // Joined
  contact_name?: string;
  contact_org?: string;
}

export interface Activity {
  id: string;
  contact_id: string | null;
  deal_id: string | null;
  activity_type: string;
  subject: string | null;
  body: string | null;
  channel: string | null;
  direction: string;
  occurred_at: string;
  metadata: Record<string, unknown>;
  // Joined
  contact_name?: string;
  deal_title?: string;
}

export interface CrmOverview {
  deals: Deal[];
  recentActivities: Activity[];
  pipelineSummary: Record<DealType, Record<PipelineStage, { count: number; value: number }>>;
  totalPipeline: number;
  totalWon: number;
  totalActive: number;
  contactCount: number;
}

// ── Data Fetching ──

export async function getCrmOverview(): Promise<CrmOverview> {
  const supabase = createServiceClient();

  const [dealsResult, activitiesResult, contactsResult] = await Promise.all([
    supabase
      .from('crm_deals')
      .select('*, crm_contacts(name, organization)')
      .order('updated_at', { ascending: false }),
    supabase
      .from('crm_activities')
      .select('*, crm_contacts(name)')
      .order('occurred_at', { ascending: false })
      .limit(50),
    supabase
      .from('crm_contacts')
      .select('id', { count: 'exact' }),
  ]);

  const rawDeals = dealsResult.data || [];
  const deals: Deal[] = rawDeals.map((d: Record<string, unknown>) => {
    const contact = d.crm_contacts as { name?: string; organization?: string } | null;
    return {
      ...d,
      contact_name: contact?.name || null,
      contact_org: contact?.organization || null,
      crm_contacts: undefined,
    } as unknown as Deal;
  });

  const rawActivities = activitiesResult.data || [];
  const activities: Activity[] = rawActivities.map((a: Record<string, unknown>) => {
    const contact = a.crm_contacts as { name?: string } | null;
    return {
      ...a,
      contact_name: contact?.name || null,
      crm_contacts: undefined,
    } as unknown as Activity;
  });

  // Compute pipeline summary
  const pipelineSummary = {} as Record<DealType, Record<PipelineStage, { count: number; value: number }>>;
  const dealTypes: DealType[] = ['sale', 'funding', 'partnership', 'procurement'];
  const stages: PipelineStage[] = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];

  for (const dt of dealTypes) {
    pipelineSummary[dt] = {} as Record<PipelineStage, { count: number; value: number }>;
    for (const stage of stages) {
      pipelineSummary[dt][stage] = { count: 0, value: 0 };
    }
  }

  let totalPipeline = 0;
  let totalWon = 0;
  let totalActive = 0;

  for (const deal of deals) {
    const dt = deal.deal_type as DealType;
    const stage = deal.pipeline_stage as PipelineStage;
    if (pipelineSummary[dt]?.[stage]) {
      pipelineSummary[dt][stage].count++;
      pipelineSummary[dt][stage].value += deal.amount_cents;
    }
    if (stage === 'won') {
      totalWon += deal.amount_cents;
    } else if (stage !== 'lost') {
      totalPipeline += deal.amount_cents;
      totalActive++;
    }
  }

  return {
    deals,
    recentActivities: activities,
    pipelineSummary,
    totalPipeline,
    totalWon,
    totalActive,
    contactCount: contactsResult.count || 0,
  };
}

export async function getDeals(dealType?: DealType): Promise<Deal[]> {
  const supabase = createServiceClient();
  let query = supabase
    .from('crm_deals')
    .select('*, crm_contacts(name, organization)')
    .order('updated_at', { ascending: false });

  if (dealType) {
    query = query.eq('deal_type', dealType);
  }

  const { data } = await query;
  return (data || []).map((d: Record<string, unknown>) => {
    const contact = d.crm_contacts as { name?: string; organization?: string } | null;
    return {
      ...d,
      contact_name: contact?.name || null,
      contact_org: contact?.organization || null,
      crm_contacts: undefined,
    } as unknown as Deal;
  });
}

export async function getContactActivities(contactId: string): Promise<Activity[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('crm_activities')
    .select('*')
    .eq('contact_id', contactId)
    .order('occurred_at', { ascending: false })
    .limit(50);
  return (data || []) as Activity[];
}

// ── Mutations ──

export async function updateDealStage(dealId: string, stage: PipelineStage) {
  const supabase = createServiceClient();
  const updates: Record<string, unknown> = {
    pipeline_stage: stage,
    updated_at: new Date().toISOString(),
  };
  if (stage === 'won') {
    updates.actual_close_date = new Date().toISOString().split('T')[0];
    updates.probability = 100;
  } else if (stage === 'lost') {
    updates.actual_close_date = new Date().toISOString().split('T')[0];
    updates.probability = 0;
  }

  const { error } = await supabase.from('crm_deals').update(updates).eq('id', dealId);
  if (error) return { error: error.message };
  revalidatePath('/admin/crm');
  return { success: true };
}

export async function createDeal(data: {
  title: string;
  deal_type: DealType;
  amount_cents?: number;
  notes?: string;
  contact_id?: string;
  source?: string;
  tags?: string[];
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
    tags: data.tags || [],
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/crm');
  return { success: true };
}

export async function logActivity(data: {
  contact_id?: string;
  deal_id?: string;
  activity_type: string;
  subject?: string;
  body?: string;
  channel?: string;
  direction?: string;
  occurred_at?: string;
  metadata?: Record<string, unknown>;
}) {
  const supabase = createServiceClient();
  const { error } = await supabase.from('crm_activities').insert({
    contact_id: data.contact_id || null,
    deal_id: data.deal_id || null,
    activity_type: data.activity_type,
    subject: data.subject || null,
    body: data.body || null,
    channel: data.channel || null,
    direction: data.direction || 'outbound',
    occurred_at: data.occurred_at || new Date().toISOString(),
    metadata: data.metadata || {},
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/crm');
  return { success: true };
}

export async function updateDeal(dealId: string, updates: {
  title?: string;
  amount_cents?: number;
  probability?: number;
  notes?: string;
  expected_close_date?: string;
  tags?: string[];
}) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from('crm_deals')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', dealId);

  if (error) return { error: error.message };
  revalidatePath('/admin/crm');
  return { success: true };
}
