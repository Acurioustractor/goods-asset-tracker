/**
 * Deck invariants.
 *
 * This deck is the one a funder receives, so the guards are about what would be expensive to get
 * wrong rather than about shape. Four things it must never do, each of which has happened before:
 *
 *   1. LEAD WITH THE MODEL. Rulings C and F put the model at the end, as what the road produced.
 *      A future edit that moves the economics forward "because funders want it early" is exactly
 *      the failure the ruling exists to prevent.
 *   2. TYPE A FIGURE. Every number resolves through canon, so a slide cannot carry a figure that
 *      canon does not agree with, and cannot quietly round one.
 *   3. NAME AN UNCLEARED VOICE. Consent is a code rule, not a policy.
 *   4. CLAIM OWNERSHIP IS COMPLETE, or dress a modelled figure as measured.
 */

import { describe, it, expect } from 'vitest';
import { DECK_ROAD, deckFigures, deckProse, deckAssertions, STAYS_BUY_KIT, STAYS_PRESSED } from '@/lib/data/deck-road';
import { ROAD_STOPS, THE_GAP, SPINE_RULES, roadVoices, roadStop } from '@/lib/data/road-spine';
import { isClearedForExternal } from '@/lib/data/cleared-voices';
import { canonFact } from '@/lib/data/canon';

describe('the spine', () => {
  it('is the seven ruled stops, in order', () => {
    expect(ROAD_STOPS.map((s) => s.id)).toEqual([
      'kalgoorlie',
      'tennant-creek',
      'the-machine',
      'palm-island',
      'utopia',
      'maningrida',
      'oonchiumpa',
    ]);
  });

  it('keeps Tennant Creek carrying two stops, which is deliberate', () => {
    expect(ROAD_STOPS.filter((s) => s.place === 'Tennant Creek')).toHaveLength(2);
  });

  it('resolves a stop by id and throws on an unknown one', () => {
    expect(roadStop('utopia').place).toBe('Utopia Homelands');
    expect(() => roadStop('kununurra' as never)).toThrow(/unknown road stop/i);
  });

  it('states the rules that are structural rather than stylistic', () => {
    const rules = SPINE_RULES.join(' ').toLowerCase();
    expect(rules).toContain('money never gets its own section');
    expect(rules).toContain('the end');
  });
});

describe('the road leads and the model follows (rulings C and F)', () => {
  it('opens on the road, not the model', () => {
    expect(DECK_ROAD[0].kind).toBe('opening');
    expect(DECK_ROAD[1].kind).toBe('stop');
  });

  it('puts every stop before the model, the economics and the ask', () => {
    const lastStop = Math.max(...DECK_ROAD.filter((s) => s.kind === 'stop').map((s) => s.n));
    for (const kind of ['model', 'economics', 'ask'] as const) {
      const slide = DECK_ROAD.find((s) => s.kind === kind);
      expect(slide, `no ${kind} slide`).toBeDefined();
      expect(slide!.n, `${kind} must come after the road`).toBeGreaterThan(lastStop);
    }
  });

  it('carries all seven stops, none dropped', () => {
    expect(DECK_ROAD.filter((s) => s.kind === 'stop')).toHaveLength(ROAD_STOPS.length);
  });

  it('every stop slide points at a real spine stop, so the two cannot drift', () => {
    const ids = new Set(ROAD_STOPS.map((s) => s.id));
    for (const s of DECK_ROAD.filter((x) => x.kind === 'stop')) {
      expect(s.stopId, `slide ${s.n} has no stopId`).toBeDefined();
      expect(ids.has(s.stopId!), `slide ${s.n} points at unknown stop`).toBe(true);
    }
  });

  it('numbers slides contiguously from 1', () => {
    expect(DECK_ROAD.map((s) => s.n)).toEqual(DECK_ROAD.map((_, i) => i + 1));
  });

  it('gives money no section of its own', () => {
    // Money enters at Palm Island and lands at Maningrida, as lessons taught by places.
    expect(DECK_ROAD.filter((s) => s.kind === 'economics')).toHaveLength(1);
    expect(THE_GAP.taught.toLowerCase()).toContain('nobody owns the making');
  });
});

describe('no figure is typed', () => {
  it('every figure resolves to a real canon fact with the same value', () => {
    for (const f of deckFigures()) {
      if (f.canonId.startsWith('derived:')) continue;
      const c = canonFact(f.canonId);
      expect(String(c.value), `${f.canonId} drifted`).toBe(
        f.value.replace(/[$,]/g, '').replace(/kg$/, ''),
      );
    }
  });

  it('every figure carries its claim label from canon, not a nicer one', () => {
    for (const f of deckFigures()) {
      if (f.canonId.startsWith('derived:')) continue;
      expect(f.claim).toBe(canonFact(f.canonId).claimLabel);
    }
  });

  it('derived figures recompute from canon, so they cannot go stale', () => {
    const price = Number(canonFact('stretch-price').value);
    for (const [d, id] of [[STAYS_BUY_KIT, 'marginal-buykit'], [STAYS_PRESSED, 'marginal-factory']] as const) {
      const expected = price - Number(canonFact(id).value);
      expect(d.value, `${id} stays figure is stale`).toBe(`$${expected.toLocaleString()}`);
      expect(d.from).toContain(id);
      expect(d.claim).toBe(canonFact(id).claimLabel);
    }
  });

  it('pressing in-house keeps more than buying finished, which is the whole case', () => {
    const n = (s: string) => Number(s.replace(/[$,]/g, ''));
    expect(n(STAYS_PRESSED.value)).toBeGreaterThan(n(STAYS_BUY_KIT.value));
  });

  it('slide prose carries no bare dollar figures', () => {
    // Figures belong in the figures array where they carry a claim label. Prose that states a
    // dollar amount has escaped canon and cannot be drift-checked.
    for (const line of deckProse()) {
      expect(line, `bare dollar figure in: ${line}`).not.toMatch(/\$[\d,]{3,}/);
    }
  });

  it('states $0 signed on the ask slide, from canon', () => {
    const ask = DECK_ROAD.find((s) => s.kind === 'ask')!;
    const lois = ask.figures!.find((f) => f.canonId === 'signed-lois');
    expect(lois, 'the ask slide must state signed LOIs').toBeDefined();
    expect(lois!.value).toBe('0');
  });
});

describe('consent', () => {
  it('every voice on the road is cleared for external use', () => {
    for (const v of roadVoices()) {
      expect(isClearedForExternal(v), `${v} is NOT on the cleared allowlist`).toBe(true);
    }
  });

  it('names at least one voice, since voices lead each stop', () => {
    expect(roadVoices().length).toBeGreaterThan(0);
  });
});

describe('the claim ceiling', () => {
  // NOT deckProse(): neverSay contains the words of the claims it forbids.
  const prose = deckAssertions();

  it('never claims ownership is complete, in any tense', () => {
    for (const line of prose) {
      expect(line.toLowerCase(), `ownership claim in: ${line}`).not.toMatch(
        /community-owned|now owns|already owns|ownership is complete|has taken ownership/,
      );
    }
  });

  it('never claims a health outcome; scabies to RHD is the why only', () => {
    for (const line of prose) {
      expect(line.toLowerCase()).not.toMatch(/prevent(ed|s)? (scabies|rhd)|cured|reduced disease/);
    }
  });

  it('never calls the revenue carve-out signed', () => {
    const ask = DECK_ROAD.find((s) => s.kind === 'ask')!;
    expect(ask.neverSay?.toLowerCase()).toContain('never call the revenue carve-out signed');
    expect(ask.body.toLowerCase()).not.toMatch(/signed revenue|revenue.{0,12}signed/);
  });

  it('flags the unmeasured cost on the stop where it would be overclaimed', () => {
    const maningrida = DECK_ROAD.find((s) => s.stopId === 'maningrida')!;
    expect(maningrida.neverSay?.toLowerCase()).toContain('measured');
  });

  it('never says "a plant" as the object (ruling D)', () => {
    for (const line of prose) {
      expect(line, `plant-as-object in: ${line}`).not.toMatch(/\ba plant\b(?! it)/i);
    }
  });
});

describe('voice', () => {
  it('carries no em dashes and no curly quotes', () => {
    for (const line of deckProse()) {
      expect(line, `em dash in: ${line}`).not.toMatch(/—/);
      expect(line, `curly quote in: ${line}`).not.toMatch(/[“”‘’]/);
    }
  });

  it('carries none of the banned pitch words', () => {
    const banned =
      /\b(empower\w*|beneficiar\w*|ecosystem|scalable solution|transformational|game[- ]changing|co-design|unlock\w*)\b/i;
    for (const line of deckProse()) {
      expect(line, `banned word in: ${line}`).not.toMatch(banned);
    }
  });
});
