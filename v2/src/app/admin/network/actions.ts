'use server';

import { createServiceClient } from '@/lib/supabase/server';
import ghl, { type GHLContact } from '@/lib/ghl';
import { revalidatePath } from 'next/cache';

// ── Types ──

export type ContactTier = 'champion' | 'hot' | 'strategic' | 'warm' | 'active' | 'cold';
export type ContactType = 'funder' | 'partner' | 'government' | 'community' | 'media' | 'academic' | 'supporter' | 'customer';

export interface NetworkContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  tier: ContactTier;
  type: ContactType;
  score: number;
  sources: string[]; // 'linkedin' | 'gmail' | 'ghl' | 'crm'
  lastContactDate: string | null;
  pipelineStage: string | null;
  postsEngaged: string[];
  tags: string[];
  needsFollowUp: boolean;
  daysSinceContact: number | null;
  dealCount: number;
  linkedinUrl: string | null;
}

export interface NetworkOverview {
  contacts: NetworkContact[];
  stats: {
    total: number;
    champions: number;
    hot: number;
    strategic: number;
    warm: number;
    withEmail: number;
    needsFollowUp: number;
    byType: Record<ContactType, number>;
  };
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
  sources.push('ghl'); // all come from GHL
  if (hasCrmRecord) sources.push('crm');
  return sources;
}

function derivePostsEngaged(tags: string[]): string[] {
  return tags.filter(t => t.startsWith('goods-li-')).map(t => t.replace('goods-li-', ''));
}

// ── Data Fetching ──

export async function getNetworkOverview(): Promise<NetworkOverview> {
  const supabase = createServiceClient();

  // Fetch GHL contacts and CRM data in parallel
  const [ghlContacts, crmContactsResult, crmDealsResult, crmActivitiesResult] = await Promise.all([
    ghl.getContacts({ goodsOnly: true }),
    supabase.from('crm_contacts').select('id, name, email, phone, organization, pipeline_stage, tags, metadata, last_contact_date'),
    supabase.from('crm_deals').select('id, contact_id, pipeline_stage'),
    supabase.from('crm_activities').select('contact_id, occurred_at').order('occurred_at', { ascending: false }).limit(500),
  ]);

  // Index CRM contacts by email for matching
  const crmByEmail = new Map<string, { id: string; pipeline_stage: string | null; last_contact_date: string | null }>();
  const crmDealsByContactId = new Map<string, number>();
  const crmLastActivityByContactId = new Map<string, string>();

  for (const c of (crmContactsResult.data || []) as Array<{ id: string; email: string | null; pipeline_stage: string | null; last_contact_date: string | null }>) {
    if (c.email) crmByEmail.set(c.email.toLowerCase(), { id: c.id, pipeline_stage: c.pipeline_stage, last_contact_date: c.last_contact_date });
  }

  for (const d of (crmDealsResult.data || []) as Array<{ contact_id: string | null }>) {
    if (d.contact_id) crmDealsByContactId.set(d.contact_id, (crmDealsByContactId.get(d.contact_id) || 0) + 1);
  }

  for (const a of (crmActivitiesResult.data || []) as Array<{ contact_id: string | null; occurred_at: string }>) {
    if (a.contact_id && !crmLastActivityByContactId.has(a.contact_id)) {
      crmLastActivityByContactId.set(a.contact_id, a.occurred_at);
    }
  }

  const now = new Date();

  // Merge GHL contacts with CRM data
  const contacts: NetworkContact[] = ghlContacts.map((c: GHLContact) => {
    const tags = c.tags || [];
    const email = c.email || '';
    const name = c.contactName || [c.firstName, c.lastName].filter(Boolean).join(' ') || '';
    const postsEngaged = derivePostsEngaged(tags);
    const crmMatch = email ? crmByEmail.get(email.toLowerCase()) : null;
    const dealCount = crmMatch ? (crmDealsByContactId.get(crmMatch.id) || 0) : 0;
    const hasDeal = dealCount > 0;

    const score = scoreContact(tags, postsEngaged, !!email, hasDeal, name);

    // Determine last contact date from CRM activities or GHL metadata
    let lastContactDate: string | null = null;
    if (crmMatch?.last_contact_date) {
      lastContactDate = crmMatch.last_contact_date;
    } else if (crmMatch) {
      lastContactDate = crmLastActivityByContactId.get(crmMatch.id) || null;
    }

    const daysSinceContact = lastContactDate
      ? Math.floor((now.getTime() - new Date(lastContactDate).getTime()) / (1000 * 60 * 60 * 24))
      : null;

    const needsFollowUp = daysSinceContact !== null ? daysSinceContact > 14 : false;

    return {
      id: c.id,
      name,
      email,
      phone: c.phone || '',
      organization: c.companyName || '',
      tier: deriveTier(score),
      type: deriveType(tags),
      score,
      sources: deriveSources(tags, !!crmMatch),
      lastContactDate,
      pipelineStage: crmMatch?.pipeline_stage || null,
      postsEngaged,
      tags,
      needsFollowUp,
      daysSinceContact,
      dealCount,
      linkedinUrl: null,
    };
  });

  // Sort by score descending
  contacts.sort((a, b) => b.score - a.score);

  // Compute stats
  const types: ContactType[] = ['funder', 'partner', 'government', 'community', 'media', 'academic', 'supporter', 'customer'];
  const byType = {} as Record<ContactType, number>;
  for (const t of types) byType[t] = 0;

  for (const c of contacts) {
    byType[c.type] = (byType[c.type] || 0) + 1;
  }

  return {
    contacts,
    stats: {
      total: contacts.length,
      champions: contacts.filter(c => c.tier === 'champion').length,
      hot: contacts.filter(c => c.tier === 'hot').length,
      strategic: contacts.filter(c => c.tier === 'strategic').length,
      warm: contacts.filter(c => c.tier === 'warm').length,
      withEmail: contacts.filter(c => !!c.email).length,
      needsFollowUp: contacts.filter(c => c.needsFollowUp).length,
      byType,
    },
  };
}

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
