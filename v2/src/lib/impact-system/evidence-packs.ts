import type { CreateImpactObservationInput } from './input';

export interface ProposedEvidencePack {
  id: string;
  communityIds: string[];
  title: string;
  sourceLabel: string;
  sourceSystem: CreateImpactObservationInput['evidenceSystem'];
  sourceExternalId: string;
  sourceDurationSeconds: number;
  releaseState: 'private_review';
  warning: string;
  observations: Array<
    Omit<CreateImpactObservationInput, 'occurredAt' | 'goalId' | 'followUpOn'> & {
      id: string;
    }
  >;
}

export const PROPOSED_EVIDENCE_PACKS: ProposedEvidencePack[] = [
  {
    id: 'maningrida-homelands-school-nic-interview-v1',
    communityIds: ['maningrida'],
    title: 'Homelands School partnership interview',
    sourceLabel: 'Goods edit v1 — Nic and program participants',
    sourceSystem: 'empathy_ledger',
    sourceExternalId: 'goods-homelands-school-maningrida',
    sourceDurationSeconds: 233.173,
    releaseState: 'private_review',
    warning:
      'Nic has user-attested standing transcript permission. Other adult voices remain pending and young participants remain restricted. Machine wording requires correction before quotation.',
    observations: [
      {
        id: 'request-0-26',
        observationType: 'participant_account',
        title: 'Community and school request for beds and laundry access',
        description:
          'Nic describes a request from the community and Homelands School Company for beds for young people and a washing machine at the school.',
        direction: 'positive',
        evidenceSystem: 'empathy_ledger',
        evidenceType: 'video_segment',
        evidenceExternalId: 'goods-homelands-school-maningrida',
        evidenceVersion: 'private-draft#0-26',
        evidenceStrength: 'direct_participant_account',
        sourceStartSeconds: 0,
        sourceEndSeconds: 26,
        speakerName: 'Nicholas Marchesi',
        speakerStorytellerId: 'f1ec31e2-6ff6-4fbd-8951-d17705c195da',
        consentState: 'user_attested',
        consentBasis:
          'Ben Knight attested on 27 July 2026 that Nic approves all transcripts in perpetuity.',
        approvedPurposes: ['Goods impact learning', 'community impact cycle review'],
        approvedAudiences: ['Goods and A Curious Tractor team', 'community review participants'],
        claimBoundary:
          'Evidence of expressed demand and partnership intent, not evidence of a health or education outcome.',
        restricted: true,
        followUpNeeded: true,
      },
      {
        id: 'assembly-89-103',
        observationType: 'participant_account',
        title: 'Participant reports learning bed assembly and packing',
        description:
          'A school or program participant describes being shown how the beds fit together and learning how to pack and unpack them.',
        direction: 'positive',
        evidenceSystem: 'empathy_ledger',
        evidenceType: 'video_segment',
        evidenceExternalId: 'goods-homelands-school-maningrida',
        evidenceVersion: 'private-draft#89-103',
        evidenceStrength: 'direct_participant_account',
        sourceStartSeconds: 89,
        sourceEndSeconds: 103,
        speakerName: 'Identity pending',
        consentState: 'pending',
        consentBasis: 'Exact speaker identity and named-use decision have not been recorded.',
        approvedPurposes: [],
        approvedAudiences: [],
        claimBoundary:
          'One participant’s reported learning moment, not evidence of sustained local maintenance capability.',
        restricted: true,
        followUpNeeded: true,
      },
      {
        id: 'future-pathway-106-129',
        observationType: 'reflection',
        title: 'Local recycling, youth jobs and curriculum described as a future pathway',
        description:
          'Nic explains the recycled-plastic construction and describes local plastic collection, youth employment and curriculum integration as future possibilities.',
        direction: 'positive',
        evidenceSystem: 'empathy_ledger',
        evidenceType: 'video_segment',
        evidenceExternalId: 'goods-homelands-school-maningrida',
        evidenceVersion: 'private-draft#106-129',
        evidenceStrength: 'direct_participant_account',
        sourceStartSeconds: 106,
        sourceEndSeconds: 129,
        speakerName: 'Nicholas Marchesi',
        speakerStorytellerId: 'f1ec31e2-6ff6-4fbd-8951-d17705c195da',
        consentState: 'user_attested',
        consentBasis:
          'Ben Knight attested on 27 July 2026 that Nic approves all transcripts in perpetuity.',
        approvedPurposes: ['Goods impact learning', 'community impact cycle review'],
        approvedAudiences: ['Goods and A Curious Tractor team', 'community review participants'],
        claimBoundary:
          'A future pathway only. It does not establish delivered local recycling, employment or curriculum outcomes.',
        restricted: true,
        followUpNeeded: true,
      },
      {
        id: 'care-practice-191-199',
        observationType: 'participant_account',
        title: 'Participant describes a school-based bed washing practice',
        description:
          'A school or program participant describes bringing dirty beds to the school, washing and drying them, and returning them to use.',
        direction: 'positive',
        evidenceSystem: 'empathy_ledger',
        evidenceType: 'video_segment',
        evidenceExternalId: 'goods-homelands-school-maningrida',
        evidenceVersion: 'private-draft#191-199',
        evidenceStrength: 'direct_participant_account',
        sourceStartSeconds: 191,
        sourceEndSeconds: 199,
        speakerName: 'Identity pending',
        consentState: 'pending',
        consentBasis: 'Exact speaker identity and named-use decision have not been recorded.',
        approvedPurposes: [],
        approvedAudiences: [],
        claimBoundary:
          'Description of an intended care practice; frequency, burden and sustained use are not established.',
        restricted: true,
        followUpNeeded: true,
      },
      {
        id: 'comfort-201-205',
        observationType: 'participant_account',
        title: 'Young participant reports comfort',
        description:
          'A young participant reports sleeping comfortably and also refers to a family member’s comfort.',
        direction: 'positive',
        evidenceSystem: 'empathy_ledger',
        evidenceType: 'video_segment',
        evidenceExternalId: 'goods-homelands-school-maningrida',
        evidenceVersion: 'private-draft#201-205',
        evidenceStrength: 'direct_participant_account',
        sourceStartSeconds: 201,
        sourceEndSeconds: 205,
        speakerName: 'Young participant — identity restricted',
        consentState: 'restricted',
        consentBasis:
          'Child-specific safeguarding, assent, guardian and exact-segment review remain outstanding.',
        approvedPurposes: [],
        approvedAudiences: [],
        claimBoundary:
          'One first-person comfort account, not a population sleep or health outcome. The statement about another person is not independently approved.',
        restricted: true,
        followUpNeeded: true,
      },
    ],
  },
];

export function evidencePacksForCommunity(communityId: string): ProposedEvidencePack[] {
  return PROPOSED_EVIDENCE_PACKS.filter((pack) => pack.communityIds.includes(communityId));
}

export function getEvidencePack(packId: string): ProposedEvidencePack | undefined {
  return PROPOSED_EVIDENCE_PACKS.find((pack) => pack.id === packId);
}
