'use server';

import { createServiceClient } from '@/lib/supabase/server';
import ghl, { type GHLContact } from '@/lib/ghl';
import { revalidatePath } from 'next/cache';

// ── Types ──

export type ContactTier = 'champion' | 'hot' | 'strategic' | 'warm' | 'active' | 'cold';
export type ContactType = 'funder' | 'partner' | 'government' | 'community' | 'media' | 'academic' | 'supporter' | 'customer';
export type DealType = 'sale' | 'funding' | 'partnership' | 'procurement';
export type PipelineStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';

export interface ContactDeal {
  id: string;
  title: string;
  deal_type: DealType;
  pipeline_stage: PipelineStage;
  amount_cents: number;
  probability: number;
  units: number;
  maker: string | null;
  delivery_status: string | null;
  source: string | null;
  notes: string | null;
  updated_at: string;
  days_since_update: number;
  needs_action: boolean;
}

export interface ContactActivity {
  id: string;
  activity_type: string;
  description: string;
  occurred_at: string;
  deal_id: string | null;
}

export interface NetworkContact {
  id: string;
  crmId: string | null;
  name: string;
  email: string;
  phone: string;
  organization: string;
  tier: ContactTier;
  type: ContactType;
  score: number;
  sources: string[];
  lastContactDate: string | null;
  pipelineStage: string | null;
  postsEngaged: string[];
  tags: string[];
  needsFollowUp: boolean;
  daysSinceContact: number | null;
  followUpDueIn: number | null; // days until follow-up is due (negative = overdue)
  deals: ContactDeal[];
  recentActivities: ContactActivity[];
  dealCount: number;
  totalDealValue: number;
  linkedinUrl: string | null;
  gmailEmailCount: number | null;
  gmailLastSubject: string | null;
}

export interface ActionItem {
  type: 'follow-up' | 'stale-deal' | 'new-engagement' | 'no-email' | 'high-value';
  priority: number; // 1-10, higher = more urgent
  contactId: string;
  contactName: string;
  organization: string;
  headline: string;
  detail: string;
  action: string;
  dealId?: string;
}

export interface NetworkOverview {
  contacts: NetworkContact[];
  actions: ActionItem[];
  stats: {
    total: number;
    champions: number;
    hot: number;
    strategic: number;
    warm: number;
    withEmail: number;
    needsFollowUp: number;
    byType: Record<ContactType, number>;
    pipelineValue: number;
    pipelineWon: number;
    activeDeals: number;
  };
  deals: ContactDeal[];
  dealColumns: Record<PipelineStage, ContactDeal[]>;
}

// ── Scoring ──

const SCORING = {
  linkedin_hot: 8,
  linkedin_strategic: 4,
  linkedin_warm: 2,
  linkedin_post: 1,
  gmail_active: 3,
  key_partner: 10,
  has_deal: 2,
  has_email: 1,
};

const KEY_PARTNERS = [
  'kristy bloomfield', 'tanya turner', 'narelle gleeson', 'rachel atkinson',
  'simon quilty', 'todd sidery', 'sam davies', 'sally grimsley-ballard',
  'kim harland', 'fiona maxwell',
];

// Follow-up cadence by tier (days)
const FOLLOW_UP_CADENCE: Record<ContactTier, number | null> = {
  champion: 7,
  hot: 10,
  strategic: 14,
  warm: 30,
  active: null, // don't flag
  cold: null,   // don't flag
};

function scoreContact(tags: string[], postsEngaged: string[], hasEmail: boolean, hasDeal: boolean, name: string): number {
  let score = 0;
  if (tags.includes('goods-linkedin-hot')) score += SCORING.linkedin_hot;
  if (tags.includes('goods-linkedin-strategic')) score += SCORING.linkedin_strategic;
  if (tags.includes('goods-linkedin-warm')) score += SCORING.linkedin_warm;
  if (tags.includes('goods-gmail-active')) score += SCORING.gmail_active;
  if (KEY_PARTNERS.includes(name.toLowerCase())) score += SCORING.key_partner;
  score += postsEngaged.length * SCORING.linkedin_post;
  if (hasEmail) score += SCORING.has_email;
  if (hasDeal) score += SCORING.has_deal;
  return score;
}

function deriveTier(score: number): ContactTier {
  if (score >= 10) return 'champion';
  if (score >= 7) return 'hot';
  if (score >= 4) return 'strategic';
  if (score >= 2) return 'warm';
  if (score >= 1) return 'active';
  return 'cold';
}

function deriveType(tags: string[]): ContactType {
  if (tags.some(t => ['goods-funder', 'goods-linkedin-philanthropy', 'goods-linkedin-investor', 'goods-linkedin-funder'].includes(t))) return 'funder';
  if (tags.some(t => ['goods-partner', 'goods-partner-lead', 'goods-linkedin-partner', 'goods-linkedin-social-enterprise'].includes(t))) return 'partner';
  if (tags.some(t => ['goods-linkedin-politician', 'goods-linkedin-government'].includes(t))) return 'government';
  if (tags.some(t => ['goods-linkedin-community', 'goods-linkedin-first-nations', 'goods-advisory'].includes(t))) return 'community';
  if (tags.some(t => ['goods-media', 'goods-linkedin-media'].includes(t))) return 'media';
  if (tags.some(t => ['goods-linkedin-academic', 'goods-linkedin-health-education'].includes(t))) return 'academic';
  if (tags.includes('goods-customer')) return 'customer';
  return 'supporter';
}

function deriveSources(tags: string[], hasCrmRecord: boolean): string[] {
  const sources: string[] = [];
  if (tags.some(t => t.startsWith('goods-linkedin-'))) sources.push('linkedin');
  if (tags.some(t => t.startsWith('goods-gmail-'))) sources.push('gmail');
  sources.push('ghl');
  if (hasCrmRecord) sources.push('crm');
  return sources;
}

function derivePostsEngaged(tags: string[]): string[] {
  return tags.filter(t => t.startsWith('goods-li-')).map(t => t.replace('goods-li-', ''));
}

// ── Action Item Generation ──

function generateActions(contacts: NetworkContact[], allDeals: ContactDeal[]): ActionItem[] {
  const actions: ActionItem[] = [];

  for (const c of contacts) {
    // Follow-up overdue
    if (c.followUpDueIn !== null && c.followUpDueIn < 0) {
      actions.push({
        type: 'follow-up',
        priority: c.tier === 'champion' ? 10 : c.tier === 'hot' ? 8 : 6,
        contactId: c.id,
        contactName: c.name,
        organization: c.organization,
        headline: `Follow up with ${c.name}`,
        detail: c.daysSinceContact !== null
          ? `${c.daysSinceContact} days since last contact${c.gmailLastSubject ? ` (re: ${c.gmailLastSubject})` : ''}`
          : 'No contact date recorded',
        action: c.email ? 'Send email' : 'Find contact info',
      });
    }

    // High-value contact with no deals
    if (c.tier === 'champion' && c.deals.length === 0 && c.type !== 'supporter' && c.type !== 'customer') {
      actions.push({
        type: 'high-value',
        priority: 7,
        contactId: c.id,
        contactName: c.name,
        organization: c.organization,
        headline: `${c.name} has no deals yet`,
        detail: `Champion-tier ${c.type} with score ${c.score} — should there be a deal here?`,
        action: 'Create deal',
      });
    }

    // High-value contact with no email
    if ((c.tier === 'champion' || c.tier === 'hot') && !c.email) {
      actions.push({
        type: 'no-email',
        priority: 5,
        contactId: c.id,
        contactName: c.name,
        organization: c.organization,
        headline: `No email for ${c.name}`,
        detail: `${c.tier === 'champion' ? 'Champion' : 'Hot'} contact — worth finding their email`,
        action: 'Find email',
      });
    }
  }

  // Stale deals
  for (const d of allDeals) {
    if (d.needs_action && d.pipeline_stage !== 'won' && d.pipeline_stage !== 'lost') {
      actions.push({
        type: 'stale-deal',
        priority: d.amount_cents > 5000000 ? 9 : d.amount_cents > 1000000 ? 7 : 5,
        contactId: '',
        contactName: '',
        organization: '',
        headline: `"${d.title}" is going stale`,
        detail: `${d.days_since_update} days since update · ${formatCurrency(d.amount_cents)} · ${d.pipeline_stage}`,
        action: 'Update deal',
        dealId: d.id,
      });
    }
  }

  // Sort by priority descending
  actions.sort((a, b) => b.priority - a.priority);
  return actions.slice(0, 10); // Top 10 actions
}

function formatCurrency(cents: number): string {
  if (cents === 0) return '$0';
  return `$${(cents / 100).toLocaleString('en-AU', { maximumFractionDigits: 0 })}`;
}

// ── Data Fetching ──

export async function getNetworkOverview(): Promise<NetworkOverview> {
  const supabase = createServiceClient();

  // Fetch everything in parallel
  const [ghlContacts, crmContactsResult, crmDealsResult, crmActivitiesResult] = await Promise.all([
    ghl.getContacts({ goodsOnly: true }),
    supabase.from('crm_contacts').select('id, name, email, phone, organization, pipeline_stage, tags, metadata, last_contact_date'),
    supabase
      .from('crm_deals')
      .select('*, crm_contacts(name, organization)')
      .order('updated_at', { ascending: false }),
    supabase
      .from('crm_activities')
      .select('id, contact_id, deal_id, activity_type, description, occurred_at')
      .order('occurred_at', { ascending: false })
      .limit(1000),
  ]);

  const now = new Date();

  // Index CRM contacts by email
  const crmByEmail = new Map<string, {
    id: string;
    pipeline_stage: string | null;
    last_contact_date: string | null;
    metadata: Record<string, unknown> | null;
  }>();

  for (const c of (crmContactsResult.data || []) as Array<{
    id: string; email: string | null; pipeline_stage: string | null;
    last_contact_date: string | null; metadata: Record<string, unknown> | null;
  }>) {
    if (c.email) crmByEmail.set(c.email.toLowerCase(), c);
  }

  // Index deals by contact_id
  const dealsByContactId = new Map<string, ContactDeal[]>();
  const allDeals: ContactDeal[] = [];

  for (const d of (crmDealsResult.data || []) as Array<Record<string, unknown>>) {
    const updatedAt = d.updated_at as string;
    const daysSinceUpdate = Math.floor((now.getTime() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24));
    const stage = d.pipeline_stage as PipelineStage;

    const deal: ContactDeal = {
      id: d.id as string,
      title: d.title as string,
      deal_type: d.deal_type as DealType,
      pipeline_stage: stage,
      amount_cents: d.amount_cents as number,
      probability: d.probability as number,
      units: (d.units as number) || 0,
      maker: (d.maker as string) || null,
      delivery_status: (d.delivery_status as string) || null,
      source: d.source as string | null,
      notes: d.notes as string | null,
      updated_at: updatedAt,
      days_since_update: daysSinceUpdate,
      needs_action: stage !== 'won' && stage !== 'lost' && daysSinceUpdate > 7,
    };

    allDeals.push(deal);

    const contactId = d.contact_id as string | null;
    if (contactId) {
      const existing = dealsByContactId.get(contactId) || [];
      existing.push(deal);
      dealsByContactId.set(contactId, existing);
    }
  }

  // Index activities by contact_id
  const activitiesByContactId = new Map<string, ContactActivity[]>();
  const lastActivityByContactId = new Map<string, string>();

  for (const a of (crmActivitiesResult.data || []) as Array<{
    id: string; contact_id: string | null; deal_id: string | null;
    activity_type: string; description: string; occurred_at: string;
  }>) {
    if (a.contact_id) {
      if (!lastActivityByContactId.has(a.contact_id)) {
        lastActivityByContactId.set(a.contact_id, a.occurred_at);
      }
      const existing = activitiesByContactId.get(a.contact_id) || [];
      if (existing.length < 5) { // Keep last 5 activities per contact
        existing.push({
          id: a.id,
          activity_type: a.activity_type,
          description: a.description,
          occurred_at: a.occurred_at,
          deal_id: a.deal_id,
        });
      }
      activitiesByContactId.set(a.contact_id, existing);
    }
  }

  // Build deal columns for Kanban view
  const stages: PipelineStage[] = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'];
  const dealColumns = {} as Record<PipelineStage, ContactDeal[]>;
  for (const s of stages) dealColumns[s] = [];
  for (const d of allDeals) {
    if (dealColumns[d.pipeline_stage]) dealColumns[d.pipeline_stage].push(d);
  }

  // Merge GHL contacts with CRM data
  const contacts: NetworkContact[] = ghlContacts.map((c: GHLContact) => {
    const tags = c.tags || [];
    const email = c.email || '';
    const name = c.contactName || [c.firstName, c.lastName].filter(Boolean).join(' ') || '';
    const postsEngaged = derivePostsEngaged(tags);
    const crmMatch = email ? crmByEmail.get(email.toLowerCase()) : null;
    const crmDeals = crmMatch ? (dealsByContactId.get(crmMatch.id) || []) : [];
    const hasDeal = crmDeals.length > 0;

    const score = scoreContact(tags, postsEngaged, !!email, hasDeal, name);
    const tier = deriveTier(score);

    // Determine last contact date
    let lastContactDate: string | null = null;
    if (crmMatch?.last_contact_date) {
      lastContactDate = crmMatch.last_contact_date;
    } else if (crmMatch) {
      lastContactDate = lastActivityByContactId.get(crmMatch.id) || null;
    }

    const daysSinceContact = lastContactDate
      ? Math.floor((now.getTime() - new Date(lastContactDate).getTime()) / (1000 * 60 * 60 * 24))
      : null;

    // Smart follow-up cadence
    const cadence = FOLLOW_UP_CADENCE[tier];
    let needsFollowUp = false;
    let followUpDueIn: number | null = null;

    if (cadence !== null && daysSinceContact !== null) {
      followUpDueIn = cadence - daysSinceContact;
      needsFollowUp = followUpDueIn < 0;
    } else if (cadence !== null && daysSinceContact === null) {
      // High-value contact with no last contact date = needs attention
      if (tier === 'champion' || tier === 'hot') {
        needsFollowUp = true;
        followUpDueIn = -999;
      }
    }

    // Gmail metadata
    const gmailEmailCount = (crmMatch?.metadata as Record<string, unknown>)?.gmail_email_count as number | null ?? null;
    const gmailLastSubject = (crmMatch?.metadata as Record<string, unknown>)?.gmail_last_subject as string | null ?? null;

    const recentActivities = crmMatch ? (activitiesByContactId.get(crmMatch.id) || []) : [];
    const totalDealValue = crmDeals.reduce((sum, d) => sum + d.amount_cents, 0);

    return {
      id: c.id,
      crmId: crmMatch?.id || null,
      name,
      email,
      phone: c.phone || '',
      organization: c.companyName || '',
      tier,
      type: deriveType(tags),
      score,
      sources: deriveSources(tags, !!crmMatch),
      lastContactDate,
      pipelineStage: crmMatch?.pipeline_stage || null,
      postsEngaged,
      tags,
      needsFollowUp,
      daysSinceContact,
      followUpDueIn,
      deals: crmDeals,
      recentActivities,
      dealCount: crmDeals.length,
      totalDealValue,
      linkedinUrl: null,
      gmailEmailCount,
      gmailLastSubject,
    };
  });

  // Sort by score descending
  contacts.sort((a, b) => b.score - a.score);

  // Compute stats
  const types: ContactType[] = ['funder', 'partner', 'government', 'community', 'media', 'academic', 'supporter', 'customer'];
  const byType = {} as Record<ContactType, number>;
  for (const t of types) byType[t] = 0;
  for (const c of contacts) byType[c.type] = (byType[c.type] || 0) + 1;

  let pipelineValue = 0;
  let pipelineWon = 0;
  let activeDeals = 0;
  for (const d of allDeals) {
    if (d.pipeline_stage === 'won') pipelineWon += d.amount_cents;
    else if (d.pipeline_stage !== 'lost') { pipelineValue += d.amount_cents; activeDeals++; }
  }

  // Generate action items
  const actions = generateActions(contacts, allDeals);

  return {
    contacts,
    actions,
    stats: {
      total: contacts.length,
      champions: contacts.filter(c => c.tier === 'champion').length,
      hot: contacts.filter(c => c.tier === 'hot').length,
      strategic: contacts.filter(c => c.tier === 'strategic').length,
      warm: contacts.filter(c => c.tier === 'warm').length,
      withEmail: contacts.filter(c => !!c.email).length,
      needsFollowUp: contacts.filter(c => c.needsFollowUp).length,
      byType,
      pipelineValue,
      pipelineWon,
      activeDeals,
    },
    deals: allDeals,
    dealColumns,
  };
}

// ── Mutations ──

export async function advanceContactStage(contactId: string, newStage: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from('crm_contacts')
    .update({ pipeline_stage: newStage, updated_at: new Date().toISOString() })
    .eq('id', contactId);
  if (error) return { error: error.message };
  revalidatePath('/admin/network');
  return { success: true };
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
  revalidatePath('/admin/network');
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
  revalidatePath('/admin/network');
  return { success: true };
}

export async function logActivity(data: {
  contact_id: string;
  activity_type: string;
  description: string;
  deal_id?: string;
}) {
  const supabase = createServiceClient();
  const { error } = await supabase.from('crm_activities').insert({
    contact_id: data.contact_id,
    activity_type: data.activity_type,
    description: data.description,
    deal_id: data.deal_id || null,
    occurred_at: new Date().toISOString(),
  });
  if (error) return { error: error.message };

  // Also update last_contact_date on the contact
  await supabase
    .from('crm_contacts')
    .update({ last_contact_date: new Date().toISOString().split('T')[0] })
    .eq('id', data.contact_id);

  revalidatePath('/admin/network');
  return { success: true };
}
