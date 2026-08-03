import { describe, expect, it } from 'vitest';
import {
  parseCreateImpactCycleInput,
  parseCreateImpactDeliberationInput,
  parseCreateImpactGoalInput,
  parseCreateImpactObservationInput,
} from './input';

describe('parseCreateImpactCycleInput', () => {
  it('accepts and trims a valid cycle', () => {
    const result = parseCreateImpactCycleInput({
      communityId: ' tennant-creek ',
      title: ' First production cycle ',
      purpose: ' Learn what the community wants to own first. ',
      nextReviewAt: '2026-09-01',
    });
    expect(result).toEqual({
      ok: true,
      value: {
        communityId: 'tennant-creek',
        title: 'First production cycle',
        purpose: 'Learn what the community wants to own first.',
        localLanguageName: undefined,
        leadOrganisation: undefined,
        authoritySummary: undefined,
        decisionProtocol: undefined,
        dataCustodyPreference: undefined,
        reviewCadence: undefined,
        nextReviewAt: '2026-09-01',
      },
    });
  });

  it.each([
    [{}, 'communityId is required.'],
    [{ communityId: 'x' }, 'title is required.'],
    [{ communityId: 'x', title: 'x' }, 'purpose is required.'],
    [
      { communityId: 'x', title: 'x', purpose: 'x', nextReviewAt: 'not-a-date' },
      'nextReviewAt must be an ISO date or timestamp.',
    ],
  ])('rejects invalid input %#', (input, error) => {
    expect(parseCreateImpactCycleInput(input)).toEqual({ ok: false, error });
  });
});

describe('parseCreateImpactObservationInput', () => {
  const valid = {
    goalId: 'goal-1',
    observationType: 'participant_account',
    title: 'Participant learned to pack the bed',
    description: 'A participant described learning to pack and unpack the bed.',
    occurredAt: '2026-07-27',
    direction: 'positive',
    evidenceSystem: 'empathy_ledger',
    evidenceType: 'video_segment',
    evidenceExternalId: 'goods-homelands-school-maningrida',
    evidenceStrength: 'direct_participant_account',
    sourceStartSeconds: 89,
    sourceEndSeconds: 103,
    speakerName: 'Identity pending',
    consentState: 'pending',
    claimBoundary: 'One reported learning moment, not sustained maintenance capability.',
    restricted: true,
    followUpNeeded: true,
  };

  it('accepts a governed story observation', () => {
    expect(parseCreateImpactObservationInput(valid)).toEqual({
      ok: true,
      value: {
        ...valid,
        evidenceUrl: undefined,
        evidenceVersion: undefined,
        speakerStorytellerId: undefined,
        consentBasis: undefined,
        approvedPurposes: [],
        approvedAudiences: [],
        followUpOn: undefined,
      },
    });
  });

  it.each([
    [{ ...valid, observationType: 'opinion' }, 'observationType is invalid.'],
    [{ ...valid, title: '' }, 'title is required.'],
    [{ ...valid, occurredAt: 'unknown' }, 'occurredAt must be an ISO date or timestamp.'],
    [{ ...valid, consentState: 'blanket' }, 'consentState is invalid.'],
    [{ ...valid, claimBoundary: '' }, 'claimBoundary is required.'],
    [
      { ...valid, sourceStartSeconds: 103, sourceEndSeconds: 89 },
      'sourceEndSeconds must be after sourceStartSeconds.',
    ],
  ])('rejects invalid observation input %#', (input, error) => {
    expect(parseCreateImpactObservationInput(input)).toEqual({ ok: false, error });
  });
});

describe('parseCreateImpactGoalInput', () => {
  it('accepts a community-defined qualitative goal', () => {
    expect(
      parseCreateImpactGoalInput({
        localName: ' Local repair capability ',
        whyItMatters: ' Repairs should not depend on travel. ',
        desiredChange: ' Community members choose and perform repairs. ',
        unacceptableChanges: ['Unsafe unpaid work', ' ', 'Loss of local knowledge'],
        goodsDomainMappings: ['jobs-ownership', 'self-determination'],
        desiredDirection: 'locally_defined',
        nextReviewAt: '2026-10-01',
      }),
    ).toEqual({
      ok: true,
      value: {
        localName: 'Local repair capability',
        whyItMatters: 'Repairs should not depend on travel.',
        desiredChange: 'Community members choose and perform repairs.',
        unacceptableChanges: ['Unsafe unpaid work', 'Loss of local knowledge'],
        goodsDomainMappings: ['jobs-ownership', 'self-determination'],
        desiredDirection: 'locally_defined',
        baselineDescription: undefined,
        reviewCadence: undefined,
        nextReviewAt: '2026-10-01',
      },
    });
  });

  it.each([
    [{}, 'localName is required.'],
    [{ localName: 'x' }, 'whyItMatters is required.'],
    [{ localName: 'x', whyItMatters: 'x' }, 'desiredChange is required.'],
    [
      {
        localName: 'x',
        whyItMatters: 'x',
        desiredChange: 'x',
        desiredDirection: 'better',
      },
      'desiredDirection is invalid.',
    ],
    [
      {
        localName: 'x',
        whyItMatters: 'x',
        desiredChange: 'x',
        goodsDomainMappings: ['made-up-domain'],
      },
      'goodsDomainMappings contains an invalid domain.',
    ],
  ])('rejects invalid goal input %#', (input, error) => {
    expect(parseCreateImpactGoalInput(input)).toEqual({ ok: false, error });
  });
});

describe('parseCreateImpactDeliberationInput', () => {
  const valid = {
    title: 'First community reflection',
    heldAt: '2026-08-12',
    participantsSummary: 'School leadership, participating families and Goods facilitators.',
    authorityBasis: 'School leadership convened the review and confirmed who should participate.',
    observationIds: ['observation-1', 'observation-2'],
    whatMatters: 'Beds must remain easy to clean without adding unpaid work.',
    selectedChange: 'Trial a locally chosen maintenance roster.',
    selectionReason: 'Participants prioritised reliable return to use.',
    dissent: ['One family preferred direct household support.'],
    harmsOrBurdens: ['Extra work for school staff.'],
  };

  it('accepts a bounded group reflection', () => {
    expect(parseCreateImpactDeliberationInput(valid)).toEqual({
      ok: true,
      value: { ...valid, goalId: undefined },
    });
  });

  it.each([
    [{ ...valid, title: '' }, 'title is required.'],
    [{ ...valid, heldAt: 'later' }, 'heldAt must be an ISO date or timestamp.'],
    [{ ...valid, participantsSummary: '' }, 'participantsSummary is required.'],
    [{ ...valid, authorityBasis: '' }, 'authorityBasis is required.'],
    [{ ...valid, observationIds: [] }, 'Select at least one observation.'],
    [{ ...valid, whatMatters: '' }, 'whatMatters is required.'],
  ])('rejects invalid deliberation input %#', (input, error) => {
    expect(parseCreateImpactDeliberationInput(input)).toEqual({ ok: false, error });
  });
});
