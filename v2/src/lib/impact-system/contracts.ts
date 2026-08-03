/**
 * Shared contracts for the Goods Community Impact Cycle.
 *
 * Goods remains canonical for operational evidence. Empathy Ledger remains
 * canonical for governed story evidence. These contracts join their public-safe
 * references without duplicating either system's private records.
 */

export const CLAIM_STATUSES = [
  'observed',
  'self_reported',
  'corroborated',
  'verified',
  'modelled',
  'target',
  'future',
  'disputed',
  'retired',
  'restricted',
] as const;

export type ImpactClaimStatus = (typeof CLAIM_STATUSES)[number];

export const DATA_FRESHNESS_STATES = [
  'live',
  'current',
  'review_due',
  'stale',
  'unavailable',
] as const;

export type DataFreshnessState = (typeof DATA_FRESHNESS_STATES)[number];

export const RELEASE_STATES = [
  'private',
  'community_review',
  'approved_with_conditions',
  'released',
  'expired',
  'withdrawn',
] as const;

export type ImpactReleaseState = (typeof RELEASE_STATES)[number];

export const EVIDENCE_STRENGTHS = [
  'direct_operational_record',
  'direct_participant_account',
  'repeated_independent_accounts',
  'corroborated_account',
  'community_deliberation',
  'documentary_evidence',
  'independent_substantiation',
  'evaluator_interpretation',
  'plausible_contribution',
  'causal_estimate',
] as const;

export type EvidenceStrength = (typeof EVIDENCE_STRENGTHS)[number];

export interface ImpactEvidenceReference {
  id: string;
  system: 'goods' | 'empathy_ledger' | 'community_impact_cycle' | 'external';
  type:
    | 'asset'
    | 'production_run'
    | 'operational_event'
    | 'transcript'
    | 'excerpt'
    | 'reflection'
    | 'document'
    | 'measurement'
    | 'verification';
  canonicalUrl?: string;
  sourceVersion?: string;
  observedAt?: string;
  strength: EvidenceStrength;
}

export interface CommunityImpactGoal {
  id: string;
  communityId: string;
  impactCycleId: string;
  localName: string;
  whyItMatters: string;
  desiredChange: string;
  unacceptableChanges: string[];
  goodsDomainMappings: string[];
  baseline?: {
    value?: number;
    unit?: string;
    description?: string;
    observedAt?: string;
  };
  desiredDirection?: 'increase' | 'decrease' | 'maintain' | 'locally_defined';
  target?: { value: number; unit: string; targetDate?: string };
  decisionAuthorityIds: string[];
  reviewCadence?: string;
  nextReviewAt?: string;
  releaseState: ImpactReleaseState;
}

export interface CommunityImpactClaim {
  id: string;
  communityId: string;
  impactCycleId: string;
  goalId?: string;
  goodsDomainMappings: string[];
  text: string;
  type: 'output' | 'testimony' | 'outcome' | 'model' | 'target';
  status: ImpactClaimStatus;
  period?: { start?: string; end?: string };
  evidence: ImpactEvidenceReference[];
  assetIds: string[];
  productionRunIds: string[];
  storytellerIds: string[];
  method?: string;
  denominator?: number;
  disaggregation?: Record<string, string | number>;
  confidence?: 'verified' | 'modelled' | 'estimate' | 'target';
  contribution?: string;
  otherContributors: string[];
  counterEvidence: string[];
  limitations: string[];
  verification?: {
    status: 'not_requested' | 'pending' | 'verified' | 'rejected';
    verifiedBy?: string;
    verifiedAt?: string;
  };
  communityApprovalId?: string;
  approvedAudiences: string[];
  approvedPurposes: string[];
  releaseState: ImpactReleaseState;
  freshness: DataFreshnessState;
  reviewOn?: string;
  expiresOn?: string;
  withdrawalState: 'active' | 'partially_withdrawn' | 'withdrawn';
  lastComputedAt?: string;
}

export interface CommunityImpactDecision {
  id: string;
  communityId: string;
  impactCycleId: string;
  question: string;
  evidenceIds: string[];
  authorityIds: string[];
  options: string[];
  decision: string;
  rationale: string;
  dissent: string[];
  actionOwner?: string;
  dueAt?: string;
  affectedGoalIds: string[];
  followUpAt?: string;
}

export interface OwnershipControlMilestone {
  id: string;
  communityId: string;
  impactCycleId: string;
  dimension:
    | 'assets'
    | 'operations'
    | 'money'
    | 'capability'
    | 'demand'
    | 'knowledge_ip'
    | 'data'
    | 'narrative';
  stage: 'goods_led' | 'shared' | 'community_led' | 'community_controlled';
  evidenceIds: string[];
  decidedAt?: string;
  nextDecision?: string;
}

export function claimIsPublicSafe(claim: CommunityImpactClaim, now = new Date()): boolean {
  if (claim.releaseState !== 'released') return false;
  if (claim.withdrawalState !== 'active') return false;
  if (claim.status === 'restricted' || claim.status === 'retired' || claim.status === 'disputed') {
    return false;
  }
  if (!claim.communityApprovalId) return false;
  if (claim.evidence.length === 0) return false;
  if (claim.expiresOn && new Date(claim.expiresOn) <= now) return false;
  return true;
}

