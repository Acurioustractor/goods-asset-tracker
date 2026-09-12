import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  ASKED_AUD,
  ASKS,
  BEDS_AT_COST_AUD,
  BEDS_AT_PRICE_AUD,
  BEDS_FUNDED,
  BEDS_COVERED_BY_SENT_ASKS,
  BEDS_IN_UNSENT_ASKS,
  BEDS_TO_FIND,
  BEDS_TO_FIND_AUD,
  BEDS_UNFUNDED,
  BEDS_UNFUNDED_AUD,
  BEDS_YEAR_ONE,
  BED_CONTRIBUTION_BUYER_FREIGHT_AUD,
  BED_CONTRIBUTION_GOODS_FREIGHT_AUD,
  BED_FREIGHT_AUD,
  BED_MAKE_AUD,
  BED_PRICE_AUD,
  COMMONWEALTH_APPROVED_AUD,
  COMMONWEALTH_LIKELY_AUD,
  COMMONWEALTH_PLANT_MONEY,
  CONTRIBUTION_BUYER_FREIGHT_AUD,
  CONTRIBUTION_GOODS_FREIGHT_AUD,
  DOUBLE_COUNT_AUD,
  FACILITATION_AUD,
  FREIGHT_ON_THE_YEAR_AUD,
  GROSS_AS_PUBLISHED_AUD,
  NEED_BUYER_FREIGHT_AUD,
  NEED_GOODS_FREIGHT_AUD,
  OPERATING_ASKED_AUD,
  PLANTS_AUD,
  PLANTS_IN_THE_ASK,
  PLANT_ALLOWANCE_AUD,
  PLANT_MODULES_HIGH_AUD,
  RUNNING_AUD,
  RUNNING_LINES,
  SCENARIOS,
  SECURED_AUD,
  THE_LEVER,
  WHERE_THE_GAP_LIVES,
  gapAud,
} from './the-year-and-the-raise';

const SRC = readFileSync(join(__dirname, 'the-year-and-the-raise.ts'), 'utf8');

describe('unit economics', () => {
  it('a bed is priced at the canon $750', () => {
    expect(BED_PRICE_AUD).toBe(750);
  });

  it('make plus freight is the $426 landed cost the workbook and canon agree on', () => {
    expect(BED_MAKE_AUD + BED_FREIGHT_AUD).toBe(426);
  });

  it('contribution is the price less what it costs, both ways round', () => {
    expect(CONTRIBUTION_BUYER_FREIGHT_AUD).toBe(474);
    expect(CONTRIBUTION_GOODS_FREIGHT_AUD).toBe(324);
    expect(CONTRIBUTION_BUYER_FREIGHT_AUD - CONTRIBUTION_GOODS_FREIGHT_AUD).toBe(BED_FREIGHT_AUD);
  });
});

describe('running the organisation', () => {
  it('the six lines sum to $297,550', () => {
    expect(RUNNING_AUD).toBe(297_550);
  });

  it('every line says what it buys', () => {
    for (const l of RUNNING_LINES) {
      expect(l.what.length).toBeGreaterThan(25);
      expect(l.amountAud).toBeGreaterThan(0);
    }
  });

  it('founders are the largest line, which is the thing a funder will ask about', () => {
    const top = [...RUNNING_LINES].sort((a, b) => b.amountAud - a.amountAud)[0];
    expect(top.line).toBe('Founders');
  });
});

describe('the double count', () => {
  it('reproduces the published $937,550 exactly', () => {
    expect(GROSS_AS_PUBLISHED_AUD).toBe(937_550);
  });

  it('the overlap is the contribution the 400 beds make', () => {
    expect(DOUBLE_COUNT_AUD).toBe(BED_CONTRIBUTION_BUYER_FREIGHT_AUD);
    expect(DOUBLE_COUNT_AUD).toBe(189_600);
  });

  it('the corrected need is $747,950 with the buyer paying freight', () => {
    expect(NEED_BUYER_FREIGHT_AUD).toBe(747_950);
    expect(GROSS_AS_PUBLISHED_AUD - DOUBLE_COUNT_AUD).toBe(NEED_BUYER_FREIGHT_AUD);
  });

  it('freight moves the need by exactly $60,000 and by nothing else', () => {
    expect(FREIGHT_ON_THE_YEAR_AUD).toBe(60_000);
    expect(NEED_GOODS_FREIGHT_AUD - NEED_BUYER_FREIGHT_AUD).toBe(FREIGHT_ON_THE_YEAR_AUD);
    expect(NEED_GOODS_FREIGHT_AUD).toBe(807_950);
  });

  it('the two ways of reaching the goods-carries-freight figure agree', () => {
    expect(GROSS_AS_PUBLISHED_AUD - BED_CONTRIBUTION_GOODS_FREIGHT_AUD).toBe(NEED_GOODS_FREIGHT_AUD);
  });

  it('the components add up', () => {
    expect(PLANTS_AUD + BEDS_AT_COST_AUD + FACILITATION_AUD + RUNNING_AUD).toBe(NEED_BUYER_FREIGHT_AUD);
    expect(PLANTS_AUD).toBe(300_000);
    expect(BEDS_AT_PRICE_AUD).toBe(300_000);
    expect(BEDS_AT_COST_AUD).toBe(110_400);
    expect(FACILITATION_AUD).toBe(40_000);
  });

  it('says in words what went wrong, so nobody re-derives the old figure', () => {
    expect(SRC).toContain('937,550');
    expect(SRC).toContain('charged twice');
  });
});

describe('the raise', () => {
  it('the five asks total $600,000', () => {
    expect(ASKED_AUD).toBe(600_000);
    expect(ASKS).toHaveLength(5);
  });

  it('nothing is secured', () => {
    expect(SECURED_AUD).toBe(0);
    expect(ASKS.every((a) => a.stage !== 'approved')).toBe(true);
  });

  it('Tim Fairfax is counted once, and against operating', () => {
    const tf = ASKS.filter((a) => a.funder.startsWith('Tim Fairfax'));
    expect(tf).toHaveLength(1);
    expect(tf[0].job).toBe('operating');
    expect(OPERATING_ASKED_AUD).toBe(100_000);
  });

  it('no funder appears twice for the same job', () => {
    const keys = ASKS.map((a) => `${a.funder}::${a.job}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('every ask names its source', () => {
    for (const a of ASKS) expect(a.source.length).toBeGreaterThan(40);
  });
});

describe('where the gap lives', () => {
  it('213 of the 400 beds are covered and 187 are not', () => {
    expect(BEDS_FUNDED).toBe(213);
    expect(BEDS_UNFUNDED).toBe(187);
    expect(BEDS_FUNDED + BEDS_UNFUNDED).toBe(BEDS_YEAR_ONE);
    expect(BEDS_UNFUNDED_AUD).toBe(140_250);
  });

  it('an unsent ask covers no beds, so the stated gap is 320', () => {
    expect(BEDS_COVERED_BY_SENT_ASKS).toBe(80);
    expect(BEDS_TO_FIND).toBe(320);
    expect(BEDS_TO_FIND_AUD).toBe(240_000);
  });

  it('the unsent Snow ask is what takes 320 to 187', () => {
    expect(BEDS_IN_UNSENT_ASKS).toBe(133);
    expect(BEDS_TO_FIND - BEDS_IN_UNSENT_ASKS).toBe(BEDS_UNFUNDED);
  });

  it('the prose states the gap as 320 and never as 187', () => {
    expect(WHERE_THE_GAP_LIVES).toContain('320 beds');
    expect(WHERE_THE_GAP_LIVES).not.toContain('187');
    expect(THE_LEVER).not.toContain('187');
  });

  it('the gap as it stands is the need less what has been asked', () => {
    const asAsked = SCENARIOS.find((s) => s.id === 'as-asked')!;
    expect(asAsked.needAud).toBe(747_950);
    expect(gapAud(asAsked)).toBe(147_950);
  });
});

describe('the Commonwealth plant money', () => {
  it('one line is approved and one is Ben judging it likely', () => {
    expect(COMMONWEALTH_APPROVED_AUD).toBe(150_000);
    expect(COMMONWEALTH_LIKELY_AUD).toBe(150_000);
  });

  it('neither line is inside the QBE ask, which is what keeps the application honest', () => {
    expect(COMMONWEALTH_PLANT_MONEY.every((p) => p.inTheQbeAsk === false)).toBe(true);
  });

  it('the likely line does not name a site, because Ben has not named one', () => {
    const second = COMMONWEALTH_PLANT_MONEY.find((p) => p.id === 'second-facility')!;
    expect(second.site).toBe('unnamed');
    expect(second.stage).toBe('likely');
  });
});

describe('scenarios', () => {
  it('a plant costs what a plant grant brings, so adding plants never moves the gap', () => {
    const asAsked = SCENARIOS.find((s) => s.id === 'as-asked')!;
    const alice = SCENARIOS.find((s) => s.id === 'alice-in')!;
    const both = SCENARIOS.find((s) => s.id === 'both-commonwealth')!;
    expect(gapAud(alice)).toBe(gapAud(asAsked));
    expect(gapAud(both)).toBe(gapAud(asAsked));
  });

  it('the only scenario that closes the gap is the one that frees QBE money', () => {
    const swap = SCENARIOS.find((s) => s.id === 'second-replaces-qbe')!;
    expect(gapAud(swap)).toBe(-2_050);
    const closers = SCENARIOS.filter((s) => gapAud(s) <= 0);
    expect(closers).toHaveLength(1);
    expect(closers[0].id).toBe('second-replaces-qbe');
  });

  it('every scenario prices its plants at the allowance', () => {
    for (const s of SCENARIOS) {
      expect(s.needAud).toBe(s.plants * PLANT_ALLOWANCE_AUD + 110_400 + 40_000 + 297_550);
    }
  });

  it('the allowance still sits above the highest priced module set', () => {
    expect(PLANT_ALLOWANCE_AUD).toBeGreaterThan(PLANT_MODULES_HIGH_AUD);
    expect(PLANTS_IN_THE_ASK).toBe(2);
  });
});

describe('house style', () => {
  it('no em dashes', () => {
    expect(SRC).not.toContain('—');
  });

  it('the word secured only ever appears alongside a denial', () => {
    const sentences = SRC.replace(/SECURED_AUD|SECURED_CEILING/g, '')
      .split(/[.\n]/)
      .filter((line) => /\bsecured\b/i.test(line));
    expect(sentences.length).toBeGreaterThan(0);
    for (const line of sentences) {
      expect(/nothing|not\b|never/i.test(line)).toBe(true);
    }
  });
});
