export interface CreateImpactCycleInput {
  communityId: string;
  title: string;
  purpose: string;
  localLanguageName?: string;
  leadOrganisation?: string;
  authoritySummary?: string;
  decisionProtocol?: string;
  dataCustodyPreference?: string;
  reviewCadence?: string;
  nextReviewAt?: string;
}

export interface CreateImpactGoalInput {
  localName: string;
  whyItMatters: string;
  desiredChange: string;
  unacceptableChanges: string[];
  goodsDomainMappings: string[];
  desiredDirection?: 'increase' | 'decrease' | 'maintain' | 'locally_defined';
  baselineDescription?: string;
  reviewCadence?: string;
  nextReviewAt?: string;
}

export interface CreateImpactObservationInput {
  goalId?: string;
  observationType:
    | 'operational_event'
    | 'measurement'
    | 'participant_account'
    | 'reflection'
    | 'group_deliberation'
    | 'document'
    | 'external_verification';
  title: string;
  description: string;
  occurredAt: string;
  direction?: 'positive' | 'negative' | 'mixed' | 'neutral';
  evidenceSystem: 'goods' | 'empathy_ledger' | 'community_impact_cycle' | 'external';
  evidenceType: string;
  evidenceExternalId?: string;
  evidenceUrl?: string;
  evidenceVersion?: string;
  evidenceStrength:
    | 'direct_operational_record'
    | 'direct_participant_account'
    | 'repeated_independent_accounts'
    | 'corroborated_account'
    | 'community_deliberation'
    | 'documentary_evidence'
    | 'independent_substantiation'
    | 'evaluator_interpretation'
    | 'plausible_contribution'
    | 'causal_estimate';
  sourceStartSeconds?: number;
  sourceEndSeconds?: number;
  speakerName?: string;
  speakerStorytellerId?: string;
  consentState:
    | 'pending'
    | 'user_attested'
    | 'approved'
    | 'restricted'
    | 'declined'
    | 'revoked'
    | 'not_required';
  consentBasis?: string;
  approvedPurposes: string[];
  approvedAudiences: string[];
  claimBoundary: string;
  restricted: boolean;
  followUpNeeded: boolean;
  followUpOn?: string;
}

export interface CreateImpactDeliberationInput {
  goalId?: string;
  title: string;
  heldAt: string;
  participantsSummary: string;
  authorityBasis: string;
  observationIds: string[];
  whatMatters: string;
  selectedChange?: string;
  selectionReason?: string;
  dissent: string[];
  harmsOrBurdens: string[];
}

type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

function optionalText(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function textList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
}

function optionalNumber(value: unknown): number | undefined {
  if (value === '' || value === null || value === undefined) return undefined;
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseCreateImpactCycleInput(body: unknown): ValidationResult<CreateImpactCycleInput> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Request body must be an object.' };
  }
  const input = body as Record<string, unknown>;
  const communityId = optionalText(input.communityId);
  const title = optionalText(input.title);
  const purpose = optionalText(input.purpose);
  if (!communityId) return { ok: false, error: 'communityId is required.' };
  if (!title) return { ok: false, error: 'title is required.' };
  if (!purpose) return { ok: false, error: 'purpose is required.' };
  if (title.length > 160) return { ok: false, error: 'title must be 160 characters or fewer.' };
  if (purpose.length > 4000) return { ok: false, error: 'purpose must be 4000 characters or fewer.' };

  const nextReviewAt = optionalText(input.nextReviewAt);
  if (nextReviewAt && Number.isNaN(Date.parse(nextReviewAt))) {
    return { ok: false, error: 'nextReviewAt must be an ISO date or timestamp.' };
  }

  return {
    ok: true,
    value: {
      communityId,
      title,
      purpose,
      localLanguageName: optionalText(input.localLanguageName),
      leadOrganisation: optionalText(input.leadOrganisation),
      authoritySummary: optionalText(input.authoritySummary),
      decisionProtocol: optionalText(input.decisionProtocol),
      dataCustodyPreference: optionalText(input.dataCustodyPreference),
      reviewCadence: optionalText(input.reviewCadence),
      nextReviewAt,
    },
  };
}

const DESIRED_DIRECTIONS = ['increase', 'decrease', 'maintain', 'locally_defined'] as const;
const GOODS_DOMAINS = [
  'rest-health',
  'dignity-safety',
  'self-determination',
  'jobs-ownership',
  'circular-economy',
] as const;

export function parseCreateImpactGoalInput(body: unknown): ValidationResult<CreateImpactGoalInput> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Request body must be an object.' };
  }
  const input = body as Record<string, unknown>;
  const localName = optionalText(input.localName);
  const whyItMatters = optionalText(input.whyItMatters);
  const desiredChange = optionalText(input.desiredChange);
  if (!localName) return { ok: false, error: 'localName is required.' };
  if (!whyItMatters) return { ok: false, error: 'whyItMatters is required.' };
  if (!desiredChange) return { ok: false, error: 'desiredChange is required.' };
  if (localName.length > 160) {
    return { ok: false, error: 'localName must be 160 characters or fewer.' };
  }

  const desiredDirection = optionalText(input.desiredDirection);
  if (
    desiredDirection &&
    !DESIRED_DIRECTIONS.includes(desiredDirection as (typeof DESIRED_DIRECTIONS)[number])
  ) {
    return { ok: false, error: 'desiredDirection is invalid.' };
  }
  const goodsDomainMappings = textList(input.goodsDomainMappings);
  if (goodsDomainMappings.some((domain) => !GOODS_DOMAINS.includes(domain as never))) {
    return { ok: false, error: 'goodsDomainMappings contains an invalid domain.' };
  }
  const nextReviewAt = optionalText(input.nextReviewAt);
  if (nextReviewAt && Number.isNaN(Date.parse(nextReviewAt))) {
    return { ok: false, error: 'nextReviewAt must be an ISO date or timestamp.' };
  }

  return {
    ok: true,
    value: {
      localName,
      whyItMatters,
      desiredChange,
      unacceptableChanges: textList(input.unacceptableChanges),
      goodsDomainMappings,
      desiredDirection: desiredDirection as CreateImpactGoalInput['desiredDirection'],
      baselineDescription: optionalText(input.baselineDescription),
      reviewCadence: optionalText(input.reviewCadence),
      nextReviewAt,
    },
  };
}

const OBSERVATION_TYPES = [
  'operational_event',
  'measurement',
  'participant_account',
  'reflection',
  'group_deliberation',
  'document',
  'external_verification',
] as const;
const EVIDENCE_SYSTEMS = ['goods', 'empathy_ledger', 'community_impact_cycle', 'external'] as const;
const EVIDENCE_STRENGTHS = [
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
const CONSENT_STATES = [
  'pending',
  'user_attested',
  'approved',
  'restricted',
  'declined',
  'revoked',
  'not_required',
] as const;
const DIRECTIONS = ['positive', 'negative', 'mixed', 'neutral'] as const;

export function parseCreateImpactObservationInput(
  body: unknown,
): ValidationResult<CreateImpactObservationInput> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Request body must be an object.' };
  }
  const input = body as Record<string, unknown>;
  const observationType = optionalText(input.observationType);
  const title = optionalText(input.title);
  const description = optionalText(input.description);
  const occurredAt = optionalText(input.occurredAt);
  const evidenceSystem = optionalText(input.evidenceSystem);
  const evidenceType = optionalText(input.evidenceType);
  const evidenceStrength = optionalText(input.evidenceStrength);
  const consentState = optionalText(input.consentState);
  const claimBoundary = optionalText(input.claimBoundary);
  if (!observationType || !OBSERVATION_TYPES.includes(observationType as never)) {
    return { ok: false, error: 'observationType is invalid.' };
  }
  if (!title) return { ok: false, error: 'title is required.' };
  if (!description) return { ok: false, error: 'description is required.' };
  if (!occurredAt || Number.isNaN(Date.parse(occurredAt))) {
    return { ok: false, error: 'occurredAt must be an ISO date or timestamp.' };
  }
  if (!evidenceSystem || !EVIDENCE_SYSTEMS.includes(evidenceSystem as never)) {
    return { ok: false, error: 'evidenceSystem is invalid.' };
  }
  if (!evidenceType) return { ok: false, error: 'evidenceType is required.' };
  if (!evidenceStrength || !EVIDENCE_STRENGTHS.includes(evidenceStrength as never)) {
    return { ok: false, error: 'evidenceStrength is invalid.' };
  }
  if (!consentState || !CONSENT_STATES.includes(consentState as never)) {
    return { ok: false, error: 'consentState is invalid.' };
  }
  if (!claimBoundary) return { ok: false, error: 'claimBoundary is required.' };

  const direction = optionalText(input.direction);
  if (direction && !DIRECTIONS.includes(direction as never)) {
    return { ok: false, error: 'direction is invalid.' };
  }
  const sourceStartSeconds = optionalNumber(input.sourceStartSeconds);
  const sourceEndSeconds = optionalNumber(input.sourceEndSeconds);
  if (
    sourceStartSeconds !== undefined &&
    sourceEndSeconds !== undefined &&
    sourceEndSeconds <= sourceStartSeconds
  ) {
    return { ok: false, error: 'sourceEndSeconds must be after sourceStartSeconds.' };
  }
  const followUpOn = optionalText(input.followUpOn);
  if (followUpOn && Number.isNaN(Date.parse(followUpOn))) {
    return { ok: false, error: 'followUpOn must be an ISO date or timestamp.' };
  }

  return {
    ok: true,
    value: {
      goalId: optionalText(input.goalId),
      observationType: observationType as CreateImpactObservationInput['observationType'],
      title,
      description,
      occurredAt,
      direction: direction as CreateImpactObservationInput['direction'],
      evidenceSystem: evidenceSystem as CreateImpactObservationInput['evidenceSystem'],
      evidenceType,
      evidenceExternalId: optionalText(input.evidenceExternalId),
      evidenceUrl: optionalText(input.evidenceUrl),
      evidenceVersion: optionalText(input.evidenceVersion),
      evidenceStrength: evidenceStrength as CreateImpactObservationInput['evidenceStrength'],
      sourceStartSeconds,
      sourceEndSeconds,
      speakerName: optionalText(input.speakerName),
      speakerStorytellerId: optionalText(input.speakerStorytellerId),
      consentState: consentState as CreateImpactObservationInput['consentState'],
      consentBasis: optionalText(input.consentBasis),
      approvedPurposes: textList(input.approvedPurposes),
      approvedAudiences: textList(input.approvedAudiences),
      claimBoundary,
      restricted: input.restricted !== false,
      followUpNeeded: input.followUpNeeded === true,
      followUpOn,
    },
  };
}

export function parseCreateImpactDeliberationInput(
  body: unknown,
): ValidationResult<CreateImpactDeliberationInput> {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, error: 'Request body must be an object.' };
  }
  const input = body as Record<string, unknown>;
  const title = optionalText(input.title);
  const heldAt = optionalText(input.heldAt);
  const participantsSummary = optionalText(input.participantsSummary);
  const authorityBasis = optionalText(input.authorityBasis);
  const whatMatters = optionalText(input.whatMatters);
  if (!title) return { ok: false, error: 'title is required.' };
  if (!heldAt || Number.isNaN(Date.parse(heldAt))) {
    return { ok: false, error: 'heldAt must be an ISO date or timestamp.' };
  }
  if (!participantsSummary) return { ok: false, error: 'participantsSummary is required.' };
  if (!authorityBasis) return { ok: false, error: 'authorityBasis is required.' };
  if (!whatMatters) return { ok: false, error: 'whatMatters is required.' };
  const observationIds = textList(input.observationIds);
  if (observationIds.length === 0) {
    return { ok: false, error: 'Select at least one observation.' };
  }

  return {
    ok: true,
    value: {
      goalId: optionalText(input.goalId),
      title,
      heldAt,
      participantsSummary,
      authorityBasis,
      observationIds,
      whatMatters,
      selectedChange: optionalText(input.selectedChange),
      selectionReason: optionalText(input.selectionReason),
      dissent: textList(input.dissent),
      harmsOrBurdens: textList(input.harmsOrBurdens),
    },
  };
}
