import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  KG_IN_BED,
  KG_PRESSED_PER_BED,
  PLACE_FEEDSTOCK,
  feedstockFor,
  needsAMeasurement,
  noStreamRecorded,
  plantFeedstockNeed,
} from './place-feedstock';

const SRC = readFileSync(join(__dirname, 'place-feedstock.ts'), 'utf8');

describe('the requirement is always given both ways', () => {
  it('returns the loop and no-loop figures together', () => {
    const n = plantFeedstockNeed(200);
    expect(n.withLoopKg).toBe(4000);
    expect(n.withoutLoopKg).toBe(7200);
    expect(n.caveat).toMatch(/assumption/i);
  });

  it('the gap between them is 80%, which is why one number will not do', () => {
    const n = plantFeedstockNeed(200);
    expect(n.withoutLoopKg / n.withLoopKg).toBeCloseTo(1.8, 5);
  });

  it('exports no function that returns a single feedstock figure', () => {
    const fns = (SRC.match(/^export function (\w+)/gm) ?? []).map((l) =>
      l.replace('export function ', ''),
    );
    expect(fns.sort()).toEqual(
      ['feedstockFor', 'needsAMeasurement', 'noStreamRecorded', 'plantFeedstockNeed'].sort(),
    );
    // A helper returning just the convenient number is the thing to prevent.
    expect(SRC).not.toMatch(/export function \w*(?:Kg|Need)Only/);
    expect(SRC).not.toMatch(/return beds \* KG_IN_BED;/);
  });

  it('scales linearly for the plant sizes that get quoted', () => {
    for (const beds of [200, 400, 720]) {
      const n = plantFeedstockNeed(beds);
      expect(n.withLoopKg).toBe(beds * KG_IN_BED);
      expect(n.withoutLoopKg).toBe(beds * KG_PRESSED_PER_BED);
    }
  });
});

describe('a stated volume needs a unit, a basis and a source', () => {
  it('every row carries a source', () => {
    for (const f of PLACE_FEEDSTOCK) expect(f.source.length).toBeGreaterThan(0);
  });

  it('a null volume always says why', () => {
    for (const f of PLACE_FEEDSTOCK) {
      if (f.kgPerYear === null) {
        expect(f.notConvertible && f.notConvertible.length > 20).toBe(true);
      }
    }
  });

  it('never invents a mass for a volume stated in another unit', () => {
    const vtg = feedstockFor('darwin');
    expect(vtg?.holder).toBe('VTG Waste, Darwin');
    expect(vtg?.statedAs).toMatch(/bales/i);
    expect(vtg?.kgPerYear).toBeNull();
    expect(vtg?.notConvertible).toMatch(/no bale weight/i);
    // If a bale weight ever gets guessed, this is the test that should fail.
    expect(SRC).not.toMatch(/bale\w*\s*[:=]\s*\d/i);
  });

  it('records what the material needs before it can be pressed', () => {
    expect(feedstockFor('darwin')?.condition).toMatch(/caps and stickers off/i);
  });
});

describe('a purchase is not a community stream', () => {
  it('marks Witta as purchased and says so', () => {
    const w = feedstockFor('witta');
    expect(w?.stage).toBe('purchased');
    expect(w?.notConvertible).toMatch(/not a community stream/i);
  });
});

describe('the two work lists', () => {
  it('names every stream that needs a measurement', () => {
    const ids = needsAMeasurement().map((f) => f.communityId).sort();
    expect(ids).toEqual(['darwin', 'tennant-creek', 'witta']);
  });

  it('names the proposed plant sites with no recorded stream', () => {
    const ids = noStreamRecorded().map((f) => f.communityId).sort();
    expect(ids).toEqual(['maningrida', 'palm-island']);
  });

  it('leaves absence as absence rather than zero', () => {
    for (const f of noStreamRecorded()) {
      expect(f.kgPerYear).toBeNull();
      expect(f.holder).toBeNull();
    }
  });
});

describe('the two QBE plant sites are the ones with no stream', () => {
  it('is the finding this module exists to surface', () => {
    // Palm Island and Maningrida are the two plants in the $300,000 request. Neither has anyone
    // recorded as holding the plastic. If that changes, this test should be updated by someone
    // who has the name, not by someone tidying.
    const ids = noStreamRecorded().map((f) => f.communityId);
    expect(ids).toContain('palm-island');
    expect(ids).toContain('maningrida');
  });
});
