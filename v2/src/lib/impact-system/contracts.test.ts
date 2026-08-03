import { describe, expect, it } from 'vitest';
import {
  CLAIM_STATUSES,
  claimIsPublicSafe,
  type CommunityImpactClaim,
} from './contracts';

const publicClaim: CommunityImpactClaim = {
  id: 'claim-1',
  communityId: 'community-1',
  impactCycleId: 'cycle-1',
  goodsDomainMappings: ['dignity-safety'],
  text: 'A current, approved claim.',
  type: 'outcome',
  status: 'corroborated',
  evidence: [
    {
      id: 'evidence-1',
      system: 'goods',
      type: 'measurement',
      strength: 'direct_operational_record',
    },
  ],
  assetIds: [],
  productionRunIds: [],
  storytellerIds: [],
  otherContributors: [],
  counterEvidence: [],
  limitations: [],
  communityApprovalId: 'approval-1',
  approvedAudiences: ['public'],
  approvedPurposes: ['impact reporting'],
  releaseState: 'released',
  freshness: 'current',
  withdrawalState: 'active',
};

describe('claimIsPublicSafe', () => {
  it('accepts a released, approved, evidenced and active claim', () => {
    expect(claimIsPublicSafe(publicClaim)).toBe(true);
  });

  it.each([
    ['withdrawn', { withdrawalState: 'withdrawn' as const }],
    ['restricted', { status: 'restricted' as const }],
    ['missing approval', { communityApprovalId: undefined }],
    ['missing evidence', { evidence: [] }],
    ['not released', { releaseState: 'community_review' as const }],
  ])('rejects %s claims', (_label, patch) => {
    expect(claimIsPublicSafe({ ...publicClaim, ...patch })).toBe(false);
  });

  it('rejects an expired claim', () => {
    expect(
      claimIsPublicSafe(
        { ...publicClaim, expiresOn: '2026-01-01T00:00:00.000Z' },
        new Date('2026-07-27T00:00:00.000Z'),
      ),
    ).toBe(false);
  });

  it('keeps the shared status vocabulary unique', () => {
    expect(new Set(CLAIM_STATUSES).size).toBe(CLAIM_STATUSES.length);
  });
});

