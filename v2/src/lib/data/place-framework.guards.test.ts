import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { placeRead, workByKind, type AxisName } from './place-framework';
import { expansionTargets } from './expansion-targets';
import { COMMUNITY_BED_CANON } from './community-canonical';

const SRC = readFileSync(join(__dirname, 'place-framework.ts'), 'utf8');
const SERVED = ['utopia', 'maningrida', 'palm-island', 'tennant-creek', 'alice-springs'];

describe('no score, no rank, no order', () => {
  it('exports nothing that counts or ranks a place', () => {
    const fns = (SRC.match(/^export function (\w+)/gm) ?? []).map((l) =>
      l.replace('export function ', ''),
    );
    expect(fns.sort()).toEqual(['placeRead', 'workByKind'].sort());
    for (const f of fns) {
      expect(f).not.toMatch(/score|rank|readiness|percent|progress|priorit/i);
    }
  });

  it('never sorts places', () => {
    expect(SRC).not.toMatch(/\.sort\(/);
  });

  it('returns one next thing, not a list of gaps to tally', () => {
    const r = placeRead('utopia');
    expect(r.nextThing).not.toBeNull();
    expect(Array.isArray(r.nextThing)).toBe(false);
  });

  it('groups the work by what kind of act it is', () => {
    const out = workByKind(SERVED);
    expect(Object.keys(out).sort()).toEqual(['a conversation', 'a document', 'a measurement']);
    const total = Object.values(out).reduce((a, l) => a + l.length, 0);
    expect(total).toBe(SERVED.length);
  });
});

describe('the sequence is a judgement, walked in a fixed order', () => {
  it('asks for the bed number before anything else', () => {
    // Utopia has a figure nobody owns, so the first thing is the conversation, not the plastic.
    const r = placeRead('utopia');
    expect(r.nextThing?.axis).toBe('denominator');
    expect(r.nextThing?.kind).toBe('a conversation');
  });

  it('moves to the plastic once a bed number is set', () => {
    // Tennant Creek is the only place with a rule and a name behind its number.
    const r = placeRead('tennant-creek');
    expect(r.nextThing?.axis).toBe('feedstock');
    expect(r.nextThing?.kind).toBe('a measurement');
  });

  it('treats the setting as context and never as a gate', () => {
    // Mount Isa has 293 overcrowded dwellings, far more than Utopia's 34, and no conversation.
    // It must not jump the queue on need alone.
    const r = placeRead('mount-isa');
    expect(r.nextThing?.axis).toBe('denominator');
    const setting = r.axes.find((a) => a.axis === 'setting');
    expect(setting?.state).toBe('stale');
  });

  it('nowhere is finished today', () => {
    for (const id of SERVED) expect(placeRead(id).nextThing).not.toBeNull();
  });
});

describe('the buyer axis is empty exactly where the work is', () => {
  it('has no housing body for any served community', () => {
    for (const id of SERVED) {
      const buyer = placeRead(id).axes.find((a) => a.axis === 'buyer');
      expect(buyer?.state).toBe('unavailable');
    }
  });

  it('has one for a place Goods does not work in', () => {
    const buyer = placeRead('wadeye').axes.find((a) => a.axis === 'buyer');
    expect(buyer?.state).toBe('stale');
    expect(buyer?.detail).toMatch(/runs housing procurement/);
  });

  it('is structural: no expansion target is a served community', () => {
    const served = new Set(COMMUNITY_BED_CANON.map((c) => c.id));
    const overlap = expansionTargets.filter((t) =>
      [...served].some((s) => t.community.toLowerCase().includes(s.replace(/-/g, ' '))),
    );
    expect(overlap).toEqual([]);
  });
});

describe('every place gets all five axes, and absence stays absence', () => {
  const names: AxisName[] = ['setting', 'denominator', 'feedstock', 'buyer', 'authority'];

  it('returns five axes whatever is known', () => {
    for (const id of [...SERVED, 'wadeye', 'nowhere-at-all']) {
      expect(placeRead(id).axes.map((a) => a.axis)).toEqual(names);
    }
  });

  it('gives every axis a detail a person can act on', () => {
    for (const a of placeRead('nowhere-at-all').axes) {
      expect(a.detail.length).toBeGreaterThan(15);
    }
  });

  it('keeps authority unavailable everywhere, including where most is known', () => {
    for (const id of [...SERVED, 'wadeye']) {
      const auth = placeRead(id).axes.find((a) => a.axis === 'authority');
      expect(auth?.state).toBe('unavailable');
    }
  });
});

describe('the framework introduces no fact of its own', () => {
  it('holds no data table', () => {
    const arrays = SRC.match(/^export const \w+(?::[^=]+)? = \[/gm) ?? [];
    expect(arrays).toEqual([]);
  });

  it('reads the modules that own each axis', () => {
    for (const mod of [
      './community-need',
      './expansion-targets',
      './place-denominator',
      './place-feedstock',
    ]) {
      expect(SRC).toContain(`from '${mod}'`);
    }
  });
});
