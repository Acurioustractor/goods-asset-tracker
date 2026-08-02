/**
 * Audience model invariants.
 *
 * The audience model exists to stop one recurring failure: an artifact that leads with the wrong
 * thing for its reader. The guards below protect the parts of that discipline which would
 * otherwise erode without anything breaking.
 *
 * Three of them are worth naming, because they encode judgements rather than shapes:
 *
 *   - EVERY AUDIENCE MUST KEEP AT LEAST ONE `mustNeverSee`. An empty list means nobody has
 *     thought about how this reader is lost, and the field will quietly become decoration.
 *   - THE BUYER MUST NOT LEAD WITH IMPACT. This is the single most tempting inversion in the
 *     whole model, because impact is what we care about most and it is the wrong opening for
 *     someone who came for a lead time.
 *   - NO AUDIENCE MAY BE TOLD OWNERSHIP IS COMPLETE. The standing ceiling is that ownership is a
 *     pathway, and the month-6 test currently has no eligible site.
 *
 * The voice guard here runs over the real exported strings rather than the file text, so it sees
 * what the app actually serves.
 */

import { describe, it, expect } from 'vitest';
import {
  AUDIENCES,
  AUDIENCE_RULE,
  audience,
  audiencesWithDoor,
  audienceProse,
  audienceAssertions,
  entityDoor,
  type AudienceId,
} from '@/lib/data/audience';
import { ENTITY_DOORS } from '@/lib/data/ask-surface';

const EXPECTED_IDS: AudienceId[] = [
  'community',
  'funder',
  'buyer',
  'supporter',
  'partner',
  'operator',
  'press',
  'internal',
];

describe('shape', () => {
  it('is the eight audiences, in the ruled order', () => {
    expect(AUDIENCES.map((a) => a.id)).toEqual(EXPECTED_IDS);
  });

  it('has no duplicate ids', () => {
    expect(new Set(AUDIENCES.map((a) => a.id)).size).toBe(AUDIENCES.length);
  });

  it('resolves every audience by id, and throws on an unknown one', () => {
    for (const id of EXPECTED_IDS) expect(audience(id).id).toBe(id);
    expect(() => audience('funders' as AudienceId)).toThrow(/unknown audience/i);
  });
});

describe('front doors', () => {
  // `servedBy` was replaced 2026-08-02. It was an unordered string[] mixing real routes, routes
  // that did not exist, repo files and one human channel, and it had never been checked against
  // the filesystem. These guards exist so its successor cannot rot the same way.

  it('gives every audience a front door field, null only where the door does not exist yet', () => {
    for (const a of AUDIENCES) {
      expect(a, `${a.id} must declare frontDoor, even if null`).toHaveProperty('frontDoor');
      if (a.frontDoor !== null) {
        expect(a.frontDoor, `${a.id}.frontDoor must be an app route`).toMatch(/^\//);
      }
    }
  });

  it('sends no two audiences to the same front door', () => {
    const doors = AUDIENCES.map((a) => a.frontDoor).filter((d): d is string => d !== null);
    expect(new Set(doors).size, `duplicate front door: ${doors.join(', ')}`).toBe(doors.length);
  });

  it('keeps alsoReachedVia free of app routes', () => {
    // If it is a route it belongs in route-audience.ts. This is the mixed-bag failure servedBy had.
    for (const a of AUDIENCES) {
      for (const via of a.alsoReachedVia) {
        expect(
          via.startsWith('/') && !via.endsWith('.md'),
          `${a.id}.alsoReachedVia contains "${via}", which looks like an app route`,
        ).toBe(false);
      }
    }
  });

  it('sends delivery partners to the page built for them', () => {
    // /partners was built 2026-08-02 (wayfinder #187), closing the last null front door. It leads
    // with the nine modules because partner.leadWith says so, and carries no figure at all because
    // partner.mustNeverSee forbids "a number that assumes a whole site when they are taking one
    // module". check:audience asserts the route exists, is not retired, and is not noindexed.
    expect(audience('partner').frontDoor).toBe('/partners');
  });
});

describe('the discipline the model exists to hold', () => {
  it('gives every audience something it must never see', () => {
    for (const a of AUDIENCES) {
      expect(a.mustNeverSee.length, `${a.id} has no mustNeverSee`).toBeGreaterThan(0);
    }
  });

  it('gives every audience something to see and one thing to do', () => {
    for (const a of AUDIENCES) {
      expect(a.needsToSee.length, `${a.id} has no needsToSee`).toBeGreaterThan(0);
      expect(a.leadWith.trim().length).toBeGreaterThan(0);
      expect(a.nextAction.trim().length).toBeGreaterThan(0);
    }
  });

  it('states the one rule', () => {
    expect(AUDIENCE_RULE).toMatch(/lead with/i);
  });
});

describe('the inversions that keep happening', () => {
  it('the buyer leads with the spec, never with impact', () => {
    const buyer = audience('buyer');
    expect(buyer.leadWith.toLowerCase()).toMatch(/specification|spec|price|lead time/);
    expect(buyer.leadWith.toLowerCase()).not.toMatch(/impact|mission|story/);
  });

  it('the funder leads with the road, not the model', () => {
    const funder = audience('funder');
    expect(funder.leadWith.toLowerCase()).toContain('road');
  });

  it('the community is led with a yarn and nothing proposed', () => {
    const community = audience('community');
    expect(community.leadWith.toLowerCase()).toContain('yarn');
    expect(community.nextAction.toLowerCase()).toContain('yarn');
  });

  it('the funder is always shown $0 signed', () => {
    const funder = audience('funder');
    expect(funder.needsToSee.join(' ')).toContain('$0 signed');
  });
});

describe('doors', () => {
  it('every door id resolves to a real entry in ENTITY_DOORS', () => {
    for (const { audience: a, door } of audiencesWithDoor()) {
      expect(ENTITY_DOORS, `${a.id} door not found`).toContain(door);
    }
  });

  it('sends donations to the charity and orders to the company, never the reverse', () => {
    expect(entityDoor('donate').entity).toMatch(/butterfly movement/i);
    expect(entityDoor('buy').entity).toMatch(/curious tractor/i);
    expect(entityDoor('invest').entity).toMatch(/curious tractor/i);
  });

  it('gives the internal and partner audiences no money door', () => {
    expect(audience('internal').door).toBeNull();
    expect(audience('partner').door).toBeNull();
  });

  it('throws rather than restating a door if the two files drift apart', () => {
    // entityDoor() is the only bridge. If ENTITY_DOORS is renamed, this must fail loudly
    // rather than the audience model growing its own private copy of the entities.
    expect(() => entityDoor('donate')).not.toThrow();
  });
});

describe('claims, over what the model asserts', () => {
  // Deliberately NOT audienceProse(): mustNeverSee is a list of claims we refuse to make, so it
  // contains the words those claims use. Checking prohibitions for prohibited words flags the
  // field that enforces the rule.
  const assertions = audienceAssertions();

  it('never tells any audience that ownership is complete', () => {
    for (const line of assertions) {
      expect(line.toLowerCase(), `ownership claim in: ${line}`).not.toMatch(
        /community-owned|now owns|ownership is complete|already owns/,
      );
    }
  });

  it('never uses "co-design" as our own word', () => {
    for (const line of assertions) {
      expect(line, `co-design in: ${line}`).not.toMatch(/co-design/i);
    }
  });

  it('keeps the community prohibition on "co-design" in place', () => {
    // It belongs in mustNeverSee and nowhere else.
    expect(audience('community').mustNeverSee.join(' ')).toMatch(/co-design/i);
  });
});

describe('voice, over every string the app serves', () => {
  const prose = audienceProse();

  it('carries no em dashes and no curly quotes', () => {
    for (const line of prose) {
      expect(line, `em dash in: ${line}`).not.toMatch(/—/);
      expect(line, `curly quote in: ${line}`).not.toMatch(/[“”‘’]/);
    }
  });

  it('carries none of the banned pitch words', () => {
    const banned =
      /\b(empower\w*|beneficiar\w*|ecosystem|scalable solution|transformational|game[- ]changing)\b/i;
    for (const line of prose) {
      expect(line, `banned word in: ${line}`).not.toMatch(banned);
    }
  });
});
