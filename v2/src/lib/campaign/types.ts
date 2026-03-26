/**
 * Campaign Engine — Types & Configuration
 *
 * Engagement scoring, pipeline stages, and campaign list definitions
 * adapted from JusticeHub patterns for Goods on Country.
 */

// ── Engagement Scoring ──

export type EngagementTier = 'aware' | 'engaged' | 'active' | 'champion';

export const ENGAGEMENT_TIERS: Record<EngagementTier, { min: number; max: number; label: string; color: string }> = {
  aware:    { min: 1,  max: 2,  label: 'Aware',    color: 'gray' },
  engaged:  { min: 3,  max: 5,  label: 'Engaged',  color: 'blue' },
  active:   { min: 6,  max: 9,  label: 'Active',   color: 'amber' },
  champion: { min: 10, max: 999, label: 'Champion', color: 'emerald' },
};

export const SCORING_WEIGHTS = {
  order: 5,
  newsletter_signup: 1,
  qr_claim: 3,
  support_ticket: 2,
  partnership_inquiry: 4,
  contact_form: 1,
  story_contribution: 3,
  linkedin_hot: 8,
  linkedin_strategic: 4,
  linkedin_warm: 2,
  linkedin_post_engaged: 1,
  gmail_active: 3,
  key_partner: 10,
} as const;

export type ScoringAction = keyof typeof SCORING_WEIGHTS;

export function getTierForScore(score: number): EngagementTier {
  if (score >= ENGAGEMENT_TIERS.champion.min) return 'champion';
  if (score >= ENGAGEMENT_TIERS.active.min) return 'active';
  if (score >= ENGAGEMENT_TIERS.engaged.min) return 'engaged';
  return 'aware';
}

export const TIER_TAGS: Record<EngagementTier, string> = {
  aware: 'goods-tier-aware',
  engaged: 'goods-tier-engaged',
  active: 'goods-tier-active',
  champion: 'goods-tier-champion',
};

export const ALL_TIER_TAGS = Object.values(TIER_TAGS);

// ── Pipeline Stages ──

export type PipelineStage = 'cold' | 'warm' | 'contacted' | 'proposal_sent' | 'in_discussion' | 'committed' | 'active' | 'stale';

export const PIPELINE_STAGES: Record<PipelineStage, { label: string; color: string; order: number }> = {
  cold:          { label: 'Cold',          color: 'gray',    order: 0 },
  warm:          { label: 'Warm',          color: 'blue',    order: 1 },
  contacted:     { label: 'Contacted',     color: 'sky',     order: 2 },
  proposal_sent: { label: 'Proposal Sent', color: 'amber',   order: 3 },
  in_discussion: { label: 'In Discussion', color: 'purple',  order: 4 },
  committed:     { label: 'Committed',     color: 'emerald', order: 5 },
  active:        { label: 'Active',        color: 'green',   order: 6 },
  stale:         { label: 'Stale',         color: 'red',     order: 7 },
};

// Follow-up rules: stage → days before auto-followup
export const FOLLOWUP_RULES: Partial<Record<PipelineStage, number>> = {
  contacted: 7,
  proposal_sent: 14,
  in_discussion: 14,
};

export const STALE_THRESHOLD_DAYS = 30;
export const MAX_AUTO_FOLLOWUPS = 3;

// ── Campaign Lists ──

export type CampaignList = 'buyers' | 'funders' | 'partners' | 'supporters' | 'community';

export const CAMPAIGN_LISTS: Record<CampaignList, { label: string; description: string; icon: string }> = {
  buyers:     { label: 'Buyers',     description: 'Procurement orgs, housing bodies',      icon: 'ShoppingCart' },
  funders:    { label: 'Funders',    description: 'Foundations, impact investors',           icon: 'Banknote' },
  partners:   { label: 'Partners',   description: 'Community orgs, manufacturing',          icon: 'Handshake' },
  supporters: { label: 'Supporters', description: 'Individual buyers, newsletter',          icon: 'Heart' },
  community:  { label: 'Community',  description: 'Recipients, storytellers',               icon: 'Users' },
};

// ── Contact Engagement Record ──

export interface ContactEngagement {
  email: string;
  name: string | null;
  phone: string | null;
  score: number;
  tier: EngagementTier;
  actions: Partial<Record<ScoringAction, number>>;
  ghl_contact_id: string | null;
  pipeline_stage: PipelineStage | null;
  last_contacted_at: string | null;
  auto_followups_sent: number;
  campaign_list: CampaignList | null;
}

// ── Momentum Metrics ──

export interface MomentumMetrics {
  pipeline: Record<PipelineStage, number>;
  totalContacts: number;
  scoredContacts: number;
  tierDistribution: Record<EngagementTier, number>;
  recentOrders: number;
  recentClaims: number;
  recentTickets: number;
  newsletterSubscribers: number;
  followupsNeeded: number;
  staleContacts: number;
}
