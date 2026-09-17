import { describe, it, expect } from 'vitest';

import {
  CAMPAIGNS,
  campaignsFor,
  knownStepIds,
  blockedOnConsent,
  type Campaign,
} from './campaigns';
import { AUDIENCE_PATHWAYS, OWNERS, claimedSegmentIds, pathwayFor } from './audience-pathways';
import { MINTED_COMMS_TAGS } from './canonical-tags';

/**
 * A campaign is a thing that sends to a person. The guards here are the difference between a
 * list of good intentions and a set of sends that cannot go to the wrong people.
 *
 * The one that matters most is the consent guard. Every broadcast in the file names a `comms:`
 * tag, and only one of those tags is minted anywhere in this codebase. Left undeclared, that is
 * how a campaign gets built against a tag nobody applies and quietly reaches nobody, or worse,
 * gets pointed at an identity tag and reaches everybody.
 */

function step(campaign: Campaign) {
  return pathwayFor(campaign.audience).steps.find((s) => s.id === campaign.stepId);
}

describe('every campaign hangs off a real lane and a real step', () => {
  it('names a lane that exists', () => {
    const lanes = new Set(AUDIENCE_PATHWAYS.map((p) => p.audience));
    for (const c of CAMPAIGNS) {
      expect(lanes.has(c.audience), `${c.id} names the lane ${c.audience}, which does not exist`).toBe(true);
    }
  });

  it('attaches to a step on that lane', () => {
    const known = knownStepIds();
    for (const c of CAMPAIGNS) {
      expect(known.has(c.stepId), `${c.id} attaches to step ${c.stepId}, which does not exist`).toBe(true);
      expect(
        step(c),
        `${c.id} attaches to ${c.stepId}, which belongs to a different lane than ${c.audience}`,
      ).toBeTruthy();
    }
  });

  it('gives every lane at least one campaign', () => {
    for (const p of AUDIENCE_PATHWAYS) {
      expect(
        campaignsFor(p.audience).length,
        `${p.audience} has a pathway and no campaign, so nothing ever moves anyone along it`,
      ).toBeGreaterThan(0);
    }
  });

  it('keeps ids unique and owners real', () => {
    const ids = CAMPAIGNS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of CAMPAIGNS) {
      expect(c.owner, `${c.id} has no owner`).not.toBe('unassigned');
      expect(OWNERS[c.owner]?.name, `${c.id} names an owner that is not in OWNERS`).toBeTruthy();
    }
  });
});

describe('consent: only a minted comms tag can carry a broadcast', () => {
  it('makes every broadcast name its send trigger', () => {
    for (const c of CAMPAIGNS) {
      if (c.kind !== 'broadcast') continue;
      expect(c.sendTrigger, `${c.id} is a broadcast with no comms: enrolment named`).toBeTruthy();
      expect(
        c.sendTrigger?.startsWith('comms:'),
        `${c.id} fires on ${c.sendTrigger}. Only comms: triggers a send: an identity tag reaching ` +
          'a whole role is the failure the tag contract exists to prevent.',
      ).toBe(true);
    }
  });

  it('never marks a campaign live against a tag nothing mints', () => {
    for (const c of CAMPAIGNS) {
      if (c.kind !== 'broadcast' || c.status !== 'live') continue;
      expect(
        MINTED_COMMS_TAGS,
        `${c.id} is live and fires on ${c.sendTrigger}, which nothing in this codebase mints. ` +
          'It would reach nobody, or it is pointed at the wrong tag.',
      ).toContain(c.sendTrigger);
    }
  });

  it('says what each blocked broadcast is waiting for', () => {
    for (const c of blockedOnConsent()) {
      expect(
        c.blockedOn,
        `${c.id} waits on an enrolment that does not exist and does not say so`,
      ).toBeTruthy();
    }
  });

  it('gives a consent basis to anything a person receives', () => {
    for (const c of CAMPAIGNS) {
      if (c.recipient !== 'the person') continue;
      expect(c.consentBasis, `${c.id} reaches a person and names no basis for the send`).toBeTruthy();
    }
  });
});

describe('R9: the community line never gets broadcast, and its automation points inward', () => {
  const communityLanes = AUDIENCE_PATHWAYS.filter((p) => p.communityLine).map((p) => p.audience);

  it('has no broadcast on a community-line lane', () => {
    for (const c of CAMPAIGNS) {
      if (!communityLanes.includes(c.audience)) continue;
      expect(
        c.kind,
        `${c.id} is a broadcast on the community line. Broadcast there needs that person's own ` +
          'explicit choice, human confirmed, and never a segment that swept them in.',
      ).not.toBe('broadcast');
    }
  });

  it('points every inward campaign at Goods, never at the person', () => {
    for (const c of CAMPAIGNS) {
      if (c.kind !== 'inward') continue;
      expect(c.recipient, `${c.id} is inward and addressed to the person`).toBe('goods');
      expect(
        ['ghl-task', 'ghl-email'],
        `${c.id} is inward and sends by ${c.channel}`,
      ).toContain(c.channel);
    }
  });

  it('keeps at least one inward campaign on the community line', () => {
    for (const lane of communityLanes) {
      expect(
        campaignsFor(lane).some((c) => c.kind === 'inward'),
        `${lane} is on the community line with no inward automation, which means silence is possible`,
      ).toBe(true);
    }
  });
});

describe('GHL owns every send', () => {
  it('uses no channel the app controls', () => {
    const allowed = ['ghl-email', 'ghl-sms', 'ghl-task', 'person'];
    for (const c of CAMPAIGNS) {
      expect(allowed, `${c.id} sends by ${c.channel}, which is not GHL and not a person`).toContain(c.channel);
    }
  });

  it('only targets a segment its own lane owns', () => {
    const claimed = claimedSegmentIds();
    for (const c of CAMPAIGNS) {
      if (!c.segmentId) continue;
      expect(claimed, `${c.id} targets ${c.segmentId}, which no lane claims`).toContain(c.segmentId);
      expect(
        pathwayFor(c.audience).segmentIds,
        `${c.id} is on the ${c.audience} lane and targets ${c.segmentId}, which belongs to another lane`,
      ).toContain(c.segmentId);
    }
  });
});

describe('status tells the truth', () => {
  it('says what every unfinished campaign is blocked on', () => {
    for (const c of CAMPAIGNS) {
      if (c.status === 'live') continue;
      expect(c.blockedOn, `${c.id} is ${c.status} and says nothing about why`).toBeTruthy();
    }
  });

  it('never runs a campaign off a step that does not exist yet', () => {
    for (const c of CAMPAIGNS) {
      if (c.status !== 'live') continue;
      expect(
        step(c)?.state,
        `${c.id} is live on a step that is ${step(c)?.state}. The campaign cannot be further along ` +
          'than the thing it runs on.',
      ).not.toBe('missing');
    }
  });
});
