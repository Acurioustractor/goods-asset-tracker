import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

import {
  AUDIENCE_PATHWAYS,
  ALL_SEGMENT_IDS,
  ALL_SMART_LIST_IDS,
  ROUTED_SUBJECTS,
  claimedSegmentIds,
  claimedSmartListIds,
  unownedPathways,
  OWNERS,
  type PathwayAudience,
} from './audience-pathways';
import { isKnownGoodsPipeline } from './inquiry-routing';

/**
 * The pathways are only useful if they describe the live system. These guards
 * are what stop them turning into a document that was true in September.
 *
 * Each one exists because of a specific way this has already gone wrong:
 * thirteen audience definitions pointed at tags nobody applied, three pipeline
 * env vars drifted to the same id, and a plan kept saying "a named person"
 * without ever naming one.
 */

const APP = path.join(__dirname, '../../app');

const EXPECTED_AUDIENCES: PathwayAudience[] = [
  'buyer',
  'procurement',
  'funder',
  'community',
  'recycler',
  'supplier',
  'media',
  'supporter',
];

/** Tags that are not namespaced and are allowed to stay that way. */
const FLAT_TAG_ALLOWLIST = new Set(['act-inquiry', 'project-goods']);

describe('the eight lanes', () => {
  it('has exactly the eight audiences, once each', () => {
    expect(AUDIENCE_PATHWAYS.map((p) => p.audience).sort()).toEqual([...EXPECTED_AUDIENCES].sort());
  });

  it('gives every lane a real person, not a role', () => {
    expect(
      unownedPathways().map((p) => p.audience),
      'A lane with no owner is a room with nobody in it. Ask Ben before adding one.',
    ).toEqual([]);
    for (const p of AUDIENCE_PATHWAYS) {
      expect(OWNERS[p.owner]?.name, `${p.audience} names an owner that is not in OWNERS`).toBeTruthy();
    }
  });

  it('gives every lane a next move and somewhere to start', () => {
    for (const p of AUDIENCE_PATHWAYS) {
      expect(p.nextMove.length, `${p.audience} has no next move`).toBeGreaterThan(20);
      expect(p.steps.length, `${p.audience} has no steps`).toBeGreaterThan(1);
    }
  });

  it('keeps step ids unique, because they are used as keys and in URLs', () => {
    const ids = AUDIENCE_PATHWAYS.flatMap((p) => p.steps.map((s) => s.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('every audience definition is owned by exactly one lane', () => {
  it('claims every AUDIENCE_SEGMENT', () => {
    const claimed = claimedSegmentIds();
    const missing = ALL_SEGMENT_IDS.filter((id) => !claimed.includes(id));
    expect(
      missing,
      'A segment with no pathway is an audience nobody can campaign to. Add it to a lane.',
    ).toEqual([]);
  });

  it('claims every SMART_LIST', () => {
    const claimed = claimedSmartListIds();
    const missing = ALL_SMART_LIST_IDS.filter((id) => !claimed.includes(id));
    expect(missing, 'An SMS list with no pathway has no owner and no rules.').toEqual([]);
  });

  it('never claims the same audience twice', () => {
    for (const claimed of [claimedSegmentIds(), claimedSmartListIds()]) {
      const seen = new Set<string>();
      for (const id of claimed) {
        expect(seen.has(id), `${id} is claimed by two lanes, so two people think they own it`).toBe(false);
        seen.add(id);
      }
    }
  });

  it('claims nothing that does not exist', () => {
    for (const id of claimedSegmentIds()) {
      expect(ALL_SEGMENT_IDS, `pathway claims segment ${id}, which is not in AUDIENCE_SEGMENTS`).toContain(id);
    }
    for (const id of claimedSmartListIds()) {
      expect(ALL_SMART_LIST_IDS, `pathway claims smart list ${id}, which is not in SMART_LISTS`).toContain(id);
    }
  });
});

describe('every door is real', () => {
  it('points at a handler that exists on disk', () => {
    for (const p of AUDIENCE_PATHWAYS) {
      for (const entry of p.entries) {
        if (!entry.handler) continue;
        const file = path.join(APP, entry.handler);
        expect(
          fs.existsSync(file),
          `${p.audience}: "${entry.door}" points at ${entry.handler}, which does not exist. ` +
            'Either the route moved or the door is gone.',
        ).toBe(true);
      }
    }
  });

  it('lands every routed contact-form subject on a lane', () => {
    const claimed = AUDIENCE_PATHWAYS.flatMap((p) => p.entries.map((e) => e.subject)).filter(Boolean);
    for (const subject of ROUTED_SUBJECTS) {
      expect(
        claimed,
        `${subject} routes to a board but no pathway claims it, so nobody owns what happens next.`,
      ).toContain(subject);
    }
  });

  it('uses the canonical tag contract', () => {
    for (const p of AUDIENCE_PATHWAYS) {
      for (const entry of p.entries) {
        for (const tag of entry.tags) {
          const canonical = tag.includes(':') || FLAT_TAG_ALLOWLIST.has(tag);
          expect(
            canonical,
            `${p.audience}: "${entry.door}" stamps the flat tag ${tag}. The account moved to the ` +
              'namespaced contract and flat tags resolve to nothing.',
          ).toBe(true);
        }
      }
    }
  });

  it('points at a board this repo knows about', () => {
    for (const p of AUDIENCE_PATHWAYS) {
      if (!p.board) continue;
      expect(
        isKnownGoodsPipeline(p.board.pipelineId),
        `${p.audience} lands on ${p.board.boardName} (${p.board.pipelineId}), which is not a Goods board. ` +
          'Three env vars once drifted to the same id and funders were filed onto the commercial board.',
      ).toBe(true);
    }
  });
});

describe('R9: the community line is out of the machine, not out of communication', () => {
  const communityLanes = AUDIENCE_PATHWAYS.filter((p) => p.communityLine);

  it('has at least one lane on the community line', () => {
    expect(communityLanes.length).toBeGreaterThan(0);
  });

  it('never broadcasts to it', () => {
    for (const p of communityLanes) {
      const broadcast = p.steps.filter((s) => s.messageClass === 'broadcast');
      expect(
        broadcast.map((s) => s.id),
        `${p.audience} is on the community line and has a broadcast step. Broadcast is off by ` +
          "default there: only the person's own explicit choice, human confirmed, turns it on.",
      ).toEqual([]);
    }
  });

  it('never enrols it in comms:*', () => {
    for (const p of communityLanes) {
      for (const entry of p.entries) {
        const comms = entry.tags.filter((t) => t.startsWith('comms:'));
        expect(
          comms,
          `${p.audience}: "${entry.door}" stamps ${comms.join(', ')}. comms:* is the send trigger and ` +
            'an inquiry is not consent.',
        ).toEqual([]);
      }
    }
  });

  it('owes an answer to anyone who writes in', () => {
    for (const p of communityLanes) {
      expect(
        p.steps.some((s) => s.messageClass === 'answer'),
        `${p.audience} has no step where a person gets an answer. Withholding the reply is neglect ` +
          'dressed up as protection.',
      ).toBe(true);
      expect(p.clock, `${p.audience} has no clock on the reply`).toBeTruthy();
    }
  });
});

describe('gaps stay visible', () => {
  it('explains every step that is not live', () => {
    for (const p of AUDIENCE_PATHWAYS) {
      for (const step of p.steps) {
        if (step.state === 'live') continue;
        expect(
          step.gap,
          `${p.audience}/${step.id} is ${step.state} and says nothing about why. A silent gap is how ` +
            'a switched-off workflow reads as a working one.',
        ).toBeTruthy();
      }
    }
  });

  it('never claims a lane is live while a step is missing', () => {
    for (const p of AUDIENCE_PATHWAYS) {
      if (p.readiness !== 'live') continue;
      const unfinished = p.steps.filter((s) => s.state !== 'live');
      expect(unfinished.map((s) => s.id), `${p.audience} is marked live with unfinished steps`).toEqual([]);
    }
  });
});
