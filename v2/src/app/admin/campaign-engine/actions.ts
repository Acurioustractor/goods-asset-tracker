'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { ghl } from '@/lib/ghl';
import {
  SCORING_WEIGHTS,
  getTierForScore,
  ENGAGEMENT_TIERS,
  PIPELINE_STAGES,
  type EngagementTier,
  type PipelineStage,
  type ScoringAction,
  type MomentumMetrics,
  type CampaignList,
} from '@/lib/campaign/types';

// ── Types for UI ──

export interface ScoredContact {
  email: string;
  name: string | null;
  phone: string | null;
  score: number;
  tier: EngagementTier;
  tierLabel: string;
  tierColor: string;
  actions: Partial<Record<ScoringAction, number>>;
  source: string;
  ghl_id: string | null;
  pipeline_stage: PipelineStage | null;
  campaign_list: CampaignList | null;
  last_contact_date: string | null;
  organization: string | null;
}

export interface PipelineContact {
  id: string;
  email: string;
  name: string | null;
  organization: string | null;
  pipeline_stage: PipelineStage;
  stageLabel: string;
  stageColor: string;
  last_contact_date: string | null;
  auto_followups_sent: number;
  daysSinceContact: number;
  needsFollowup: boolean;
  score: number;
  tier: EngagementTier;
}

export interface CampaignStats {
  totalContacts: number;
  ghlContacts: number;
  scoredContacts: number;
  pipelineContacts: number;
  tierDistribution: Record<EngagementTier, number>;
  pipelineDistribution: Record<PipelineStage, number>;
  recentOrders: number;
  recentClaims: number;
  newsletterCount: number;
}

// ── Data Fetching ──

export async function getCampaignStats(): Promise<CampaignStats> {
  const supabase = createServiceClient();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    contactsResult,
    ordersResult,
    claimsResult,
    ghlContacts,
  ] = await Promise.all([
    supabase.from('crm_contacts').select('id, metadata, relationship_status', { count: 'exact' }),
    supabase.from('orders').select('id', { count: 'exact' }).eq('payment_status', 'paid').gte('created_at', thirtyDaysAgo),
    supabase.from('user_assets').select('id', { count: 'exact' }).gte('claimed_at', thirtyDaysAgo),
    ghl.isEnabled() ? ghl.getContacts({ goodsOnly: true }).catch(() => []) : Promise.resolve([]),
  ]);

  const contacts = contactsResult.data || [];

  // Pipeline distribution from metadata.pipeline_stage
  const pipelineDistribution: Record<PipelineStage, number> = {
    cold: 0, warm: 0, contacted: 0, proposal_sent: 0,
    in_discussion: 0, committed: 0, active: 0, stale: 0,
  };

  let pipelineCount = 0;
  for (const c of contacts) {
    const meta = (c.metadata || {}) as Record<string, unknown>;
    const stage = meta.pipeline_stage as string;
    if (stage && stage in pipelineDistribution) {
      pipelineDistribution[stage as PipelineStage]++;
      pipelineCount++;
    }
  }

  // We'll compute tier distribution from scored contacts
  const tierDistribution: Record<EngagementTier, number> = {
    aware: 0, engaged: 0, active: 0, champion: 0,
  };

  // Try to get from engagement_scores table
  const { data: scores } = await supabase
    .from('engagement_scores')
    .select('tier');

  if (scores) {
    for (const s of scores) {
      if (s.tier && s.tier in tierDistribution) {
        tierDistribution[s.tier as EngagementTier]++;
      }
    }
  }

  return {
    totalContacts: contacts.length,
    ghlContacts: ghlContacts.length,
    scoredContacts: scores?.length || 0,
    pipelineContacts: pipelineCount,
    tierDistribution,
    pipelineDistribution,
    recentOrders: ordersResult.count || 0,
    recentClaims: claimsResult.count || 0,
    newsletterCount: ghlContacts.filter(c =>
      c.tags?.some((t: string) => t.includes('newsletter'))
    ).length,
  };
}

export async function getScoredContacts(): Promise<ScoredContact[]> {
  const supabase = createServiceClient();

  // Try engagement_scores table first
  const { data: scores } = await supabase
    .from('engagement_scores')
    .select('*')
    .order('score', { ascending: false })
    .limit(200);

  if (scores && scores.length > 0) {
    return scores.map(s => ({
      email: s.email,
      name: s.name,
      phone: null,
      score: s.score,
      tier: s.tier as EngagementTier,
      tierLabel: ENGAGEMENT_TIERS[s.tier as EngagementTier]?.label || s.tier,
      tierColor: ENGAGEMENT_TIERS[s.tier as EngagementTier]?.color || 'gray',
      actions: s.actions || {},
      source: 'scoring',
      ghl_id: null,
      pipeline_stage: null,
      campaign_list: null,
      last_contact_date: null,
      organization: null,
    }));
  }

  // Fallback: compute scores live from multiple tables
  const scoreMap = new Map<string, ScoredContact>();

  // Orders
  const { data: orders } = await supabase
    .from('orders')
    .select('customer_email, customer_name')
    .eq('payment_status', 'paid');

  if (orders) {
    for (const o of orders) {
      if (!o.customer_email) continue;
      const key = o.customer_email.toLowerCase();
      const existing = scoreMap.get(key) || createEmptyContact(key, o.customer_name);
      existing.score += SCORING_WEIGHTS.order;
      existing.actions.order = (existing.actions.order || 0) + 1;
      scoreMap.set(key, existing);
    }
  }

  // Support tickets
  const { data: tickets } = await supabase
    .from('tickets')
    .select('contact_info, user_name');

  if (tickets) {
    for (const t of tickets) {
      if (!t.contact_info?.includes('@')) continue;
      const key = t.contact_info.toLowerCase();
      const existing = scoreMap.get(key) || createEmptyContact(key, t.user_name);
      existing.score += SCORING_WEIGHTS.support_ticket;
      existing.actions.support_ticket = (existing.actions.support_ticket || 0) + 1;
      scoreMap.set(key, existing);
    }
  }

  // Partnership inquiries
  const { data: inquiries } = await supabase
    .from('partnership_inquiries')
    .select('contact_email, contact_name, organization_name');

  if (inquiries) {
    for (const i of inquiries) {
      if (!i.contact_email) continue;
      const key = i.contact_email.toLowerCase();
      const existing = scoreMap.get(key) || createEmptyContact(key, i.contact_name);
      existing.score += SCORING_WEIGHTS.partnership_inquiry;
      existing.actions.partnership_inquiry = (existing.actions.partnership_inquiry || 0) + 1;
      existing.organization = existing.organization || i.organization_name;
      scoreMap.set(key, existing);
    }
  }

  // Finalize tiers
  const results = Array.from(scoreMap.values());
  for (const c of results) {
    c.tier = getTierForScore(c.score);
    c.tierLabel = ENGAGEMENT_TIERS[c.tier].label;
    c.tierColor = ENGAGEMENT_TIERS[c.tier].color;
  }

  return results.sort((a, b) => b.score - a.score);
}

function createEmptyContact(email: string, name: string | null): ScoredContact {
  return {
    email,
    name,
    phone: null,
    score: 0,
    tier: 'aware',
    tierLabel: 'Aware',
    tierColor: 'gray',
    actions: {},
    source: 'live',
    ghl_id: null,
    pipeline_stage: null,
    campaign_list: null,
    last_contact_date: null,
    organization: null,
  };
}

export async function getPipelineContacts(): Promise<PipelineContact[]> {
  const supabase = createServiceClient();
  const now = new Date();

  // crm_contacts uses metadata JSONB for pipeline_stage and auto_followups_sent
  const { data: contacts } = await supabase
    .from('crm_contacts')
    .select('id, email, name, organization, last_contact_date, relationship_status, metadata, tags')
    .in('relationship_status', ['prospect', 'active'])
    .order('last_contact_date', { ascending: true });

  if (!contacts) return [];

  // Filter to those with a pipeline stage in metadata
  const pipelineContacts = contacts.filter(c => {
    const meta = c.metadata as Record<string, unknown> | null;
    return meta?.pipeline_stage;
  });

  // Get scores for these contacts
  const emails = pipelineContacts.map(c => c.email).filter(Boolean) as string[];
  const { data: scores } = emails.length > 0
    ? await supabase.from('engagement_scores').select('email, score, tier').in('email', emails)
    : { data: null };

  const scoreByEmail = new Map<string, { score: number; tier: EngagementTier }>();
  if (scores) {
    for (const s of scores) {
      scoreByEmail.set(s.email.toLowerCase(), { score: s.score, tier: s.tier as EngagementTier });
    }
  }

  return pipelineContacts.map(c => {
    const meta = (c.metadata || {}) as Record<string, unknown>;
    const stage = (meta.pipeline_stage as PipelineStage) || 'cold';
    const stageInfo = PIPELINE_STAGES[stage] || PIPELINE_STAGES.cold;
    const lastContacted = c.last_contact_date ? new Date(c.last_contact_date) : null;
    const daysSinceContact = lastContacted
      ? Math.floor((now.getTime() - lastContacted.getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    const scoreData = c.email ? scoreByEmail.get(c.email.toLowerCase()) : null;

    return {
      id: c.id,
      email: c.email || '',
      name: c.name,
      organization: c.organization,
      pipeline_stage: stage,
      stageLabel: stageInfo.label,
      stageColor: stageInfo.color,
      last_contact_date: c.last_contact_date,
      auto_followups_sent: (meta.auto_followups_sent as number) || 0,
      daysSinceContact,
      needsFollowup: daysSinceContact >= 7 && stage !== 'active' && stage !== 'committed',
      score: scoreData?.score || 0,
      tier: scoreData?.tier || 'aware',
    };
  });
}

export async function getMomentumMetrics(): Promise<MomentumMetrics> {
  const supabase = createServiceClient();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    contactsResult,
    ordersResult,
    claimsResult,
    ticketsResult,
    scoresResult,
  ] = await Promise.all([
    supabase.from('crm_contacts').select('metadata, relationship_status'),
    supabase.from('orders').select('id').eq('payment_status', 'paid').gte('created_at', thirtyDaysAgo),
    supabase.from('user_assets').select('id').gte('claimed_at', thirtyDaysAgo),
    supabase.from('tickets').select('id').gte('created_at', thirtyDaysAgo),
    supabase.from('engagement_scores').select('tier, score'),
  ]);

  const contacts = contactsResult.data || [];
  const scores = scoresResult.data || [];

  // Pipeline distribution from metadata.pipeline_stage
  const pipeline: Record<PipelineStage, number> = {
    cold: 0, warm: 0, contacted: 0, proposal_sent: 0,
    in_discussion: 0, committed: 0, active: 0, stale: 0,
  };
  for (const c of contacts) {
    const meta = (c.metadata || {}) as Record<string, unknown>;
    const stage = meta.pipeline_stage as string;
    if (stage && stage in pipeline) {
      pipeline[stage as PipelineStage]++;
    }
  }

  // Tier distribution
  const tierDistribution: Record<EngagementTier, number> = {
    aware: 0, engaged: 0, active: 0, champion: 0,
  };
  for (const s of scores) {
    if (s.tier && s.tier in tierDistribution) {
      tierDistribution[s.tier as EngagementTier]++;
    }
  }

  // Count follow-ups needed
  let followupsNeeded = 0;
  for (const c of contacts) {
    const meta = (c.metadata || {}) as Record<string, unknown>;
    const stage = meta.pipeline_stage as string;
    if (!stage || stage === 'active' || stage === 'committed' || stage === 'stale') continue;
    if (c.relationship_status === 'prospect') followupsNeeded++;
  }

  // Newsletter count from GHL
  let newsletterSubscribers = 0;
  if (ghl.isEnabled()) {
    try {
      const ghlContacts = await ghl.getContacts({ goodsOnly: true });
      newsletterSubscribers = ghlContacts.filter(c =>
        c.tags?.some((t: string) => t.includes('newsletter'))
      ).length;
    } catch {
      // GHL unavailable
    }
  }

  return {
    pipeline,
    totalContacts: contacts.length,
    scoredContacts: scores.length,
    tierDistribution,
    recentOrders: ordersResult.data?.length || 0,
    recentClaims: claimsResult.data?.length || 0,
    recentTickets: ticketsResult.data?.length || 0,
    newsletterSubscribers,
    followupsNeeded,
    staleContacts: pipeline.stale,
  };
}

// ── Mutations ──

export async function updatePipelineStage(contactId: string, stage: PipelineStage) {
  const supabase = createServiceClient();

  // First get existing metadata to merge
  const { data: existing } = await supabase
    .from('crm_contacts')
    .select('metadata')
    .eq('id', contactId)
    .single();

  const currentMeta = (existing?.metadata || {}) as Record<string, unknown>;

  const { error } = await supabase
    .from('crm_contacts')
    .update({
      metadata: { ...currentMeta, pipeline_stage: stage },
      last_contact_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', contactId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function runEngagementScoring(): Promise<{ success: boolean; error?: string; result?: Record<string, unknown> }> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3004';

    const response = await fetch(`${baseUrl}/api/cron/campaign/engagement-scoring`, {
      headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
    });

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    const result = await response.json();
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
