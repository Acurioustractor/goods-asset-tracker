import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  ASKS,
  ASKS_WITH_NO_SCOPE,
  BEDS_PAID_FOR,
  HOW_TO_TALK,
  LADDER,
  NO_TOTAL_ACROSS_RUNGS,
  ORGANISATIONS_THAT_HAVE_ASKED,
  PAID_ORGANISATIONS,
  PLACES_THAT_HAVE_ASKED,
  THE_POSITION,
  WHAT_WOULD_CHANGE_IT,
  WHEN_A_FUNDER_ASKS,
  WHY_NOT_A_NUMBER,
  onRung,
  rungRank,
} from './who-has-asked';
import { BEDS_PAID_FOR as TRADE_BEDS, PAID_TRADE } from './demand-and-buyers';

const SRC = readFileSync(join(__dirname, 'who-has-asked.ts'), 'utf8');

describe('the paid rung ties to the invoices', () => {
  it('320 beds across four organisations, matching demand-and-buyers', () => {
    expect(BEDS_PAID_FOR).toBe(320);
    expect(BEDS_PAID_FOR).toBe(TRADE_BEDS);
    expect(PAID_ORGANISATIONS).toBe(4);
    expect(new Set(PAID_TRADE.map((i) => i.buyer)).size).toBe(4);
  });

  it('every paid ask names the act that settled it', () => {
    for (const a of onRung('paid')) {
      expect(a.act.length).toBeGreaterThan(30);
      expect(a.scope).not.toBeNull();
    }
  });
});

describe('the ladder is made of acts', () => {
  it('five rungs, each with a one-question test', () => {
    expect(LADDER).toHaveLength(5);
    for (const r of LADDER) {
      expect(r.test.endsWith('?')).toBe(true);
      expect(r.strength.length).toBeGreaterThan(40);
    }
  });

  it('paid ranks first and a meeting ranks last', () => {
    expect(rungRank('paid')).toBe(0);
    expect(rungRank('raised')).toBe(LADDER.length - 1);
    expect(rungRank('money-named')).toBeLessThan(rungRank('organisation-asked'));
  });

  it('the weakest rung holds the largest figure, which is the point of ordering by act', () => {
    const biggest = [...ASKS].sort((a, b) => b.beds - a.beds)[0];
    expect(biggest.rung).toBe('raised');
    expect(biggest.beds).toBe(500);
  });
});

describe('what the module refuses to compute', () => {
  it('no export computes a total across rungs', () => {
    const totals = (SRC.match(/export const ([A-Z_]+) =/g) || [])
      .map((m) => m.replace(/export const | =/g, ''))
      .filter((n) => /TOTAL|DEMAND_BEDS|ALL_BEDS/.test(n) && n !== 'NO_TOTAL_ACROSS_RUNGS');
    expect(totals).toEqual([]);
    expect(NO_TOTAL_ACROSS_RUNGS).toContain('on purpose');
  });

  it('names the 778 only to refuse it, never to compute it', () => {
    const mentions = (SRC.match(/778/g) || []).length;
    expect(mentions).toBeGreaterThan(0);
    for (const line of SRC.split('\n').filter((l) => l.includes('778'))) {
      expect(/not a quantity|never totalled|is the 778/.test(line)).toBe(true);
    }
  });

  it('the only bed total is the paid one', () => {
    const reducers = SRC.match(/reduce\(\(n, a\) => n \+ a\.beds, 0\)/g) || [];
    expect(reducers).toHaveLength(1);
  });

  it('says plainly that we hold no demand measure', () => {
    expect(THE_POSITION).toContain('do not have a demand measure');
    expect(WHY_NOT_A_NUMBER).toContain('778');
    expect(WHY_NOT_A_NUMBER).toContain('not a quantity of anything');
  });
});

describe('the record', () => {
  it('every ask names who, in what capacity, and what they did', () => {
    for (const a of ASKS) {
      expect(a.who.length).toBeGreaterThan(3);
      expect(a.capacity.length).toBeGreaterThan(10);
      expect(a.act.length).toBeGreaterThan(25);
      expect(a.when).toMatch(/^\d{4}/);
    }
  });

  it('two figures have no recorded scope, and both are flagged rather than tidied', () => {
    expect(ASKS_WITH_NO_SCOPE).toHaveLength(2);
    expect(ASKS_WITH_NO_SCOPE.map((a) => a.place).sort()).toEqual([
      'Groote Archipelago',
      'Palm Island',
    ]);
  });

  it('Maningrida appears twice as a buyer and once as an asker', () => {
    const man = ASKS.filter((a) => a.place.startsWith('Maningrida'));
    expect(man.filter((a) => a.rung === 'paid')).toHaveLength(2);
    expect(man.filter((a) => a.rung === 'organisation-asked')).toHaveLength(1);
  });

  it('six organisations have asked without paying, across seven places', () => {
    expect(ORGANISATIONS_THAT_HAVE_ASKED).toBe(6);
    expect(PLACES_THAT_HAVE_ASKED).toBeGreaterThanOrEqual(6);
  });
});

describe('how to say it', () => {
  it('six rules, and the first one is lead with what was paid', () => {
    expect(HOW_TO_TALK).toHaveLength(6);
    expect(HOW_TO_TALK[0]).toContain('Lead with what was paid');
  });

  it('names the organisation over the number', () => {
    expect(HOW_TO_TALK.some((r) => r.includes('Name the organisation, not the number'))).toBe(true);
  });

  it('the funder answer leads with money and ends with what we cannot give them', () => {
    expect(WHEN_A_FUNDER_ASKS.indexOf('320')).toBeLessThan(WHEN_A_FUNDER_ASKS.indexOf('cannot'));
    expect(WHEN_A_FUNDER_ASKS).toContain('we say so');
  });

  it('the fix is a count, not a model', () => {
    expect(WHAT_WOULD_CHANGE_IT).toContain('One community counting properly');
    expect(WHAT_WOULD_CHANGE_IT).toContain('paid for it');
  });

  it('no em dashes', () => {
    expect(SRC).not.toContain('—');
  });
});
