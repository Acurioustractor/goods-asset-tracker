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
  BED_FREIGHT_AUD,
  BED_MAKE_AUD,
  BED_MAKE_STATUS,
  BED_PRICE_AUD,
  CANVAS_AUD,
  FOUNDERS_SUPER_STATUS,
  HARDWARE_AUD,
  KITS_A_DAY,
  LABOUR_AUD,
  PLASTIC_AUD,
  POLES_AUD,
  POWER_AUD,
  YIELD_IMPROVEMENTS,
  YIELD_IMPROVEMENTS_TOTAL_AUD,
  COMMONWEALTH_APPROVED_AUD,
  COMMONWEALTH_LIKELY_AUD,
  COMMONWEALTH_PLANT_MONEY,
  CONTRIBUTION_AUD,
  FACILITATION_PER_BED_AUD,
  FREIGHT_RULE,
  DOUBLE_COUNT_AUD,
  FACILITATION_AUD,
  FREIGHT_ON_THE_YEAR_AUD,
  GROSS_AS_PUBLISHED_AUD,
  NEED_AUD,
  ORGANISATION_NEED_AUD,
  ORGANISATION_FROM_BEDS_AUD,
  ORGANISATION_SHORT_AUD,
  OPERATING_ASKED_AUD,
  PLANTS_AUD,
  PLANTS_IN_THE_ASK,
  PLANT_ALLOWANCE_AUD,
  PLANT_MODULES_HIGH_AUD,
  RUNNING_AUD,
  RUNNING_LINES,
  SCENARIOS,
  REAL_RULING,
  BEDS_A_GRANT,
  GRANT_LOT_AUD,
  BEDS_ASKED_FOR,
  BEDS_OVER_THE_YEAR,
  EVERY_GRANT_BUYS_BEDS,
  OPERATING_RULE,
  SECURED_AUD,
  THE_GAP_STAYS,
  THE_LEVER,
  WHERE_THE_GAP_LIVES,
  gapAud,
} from './the-year-and-the-raise';
import * as year from './the-year-and-the-raise';

const SRC = readFileSync(join(__dirname, 'the-year-and-the-raise.ts'), 'utf8');

describe('unit economics', () => {
  it('a bed is priced at the canon $750', () => {
    expect(BED_PRICE_AUD).toBe(750);
  });

  it('six kits a day, and labour is $400 a day over them', () => {
    expect(KITS_A_DAY).toBe(6);
    expect(LABOUR_AUD).toBeCloseTo(400 / 6, 6);
  });

  it('the make cost is the sum of its components, never retyped', () => {
    expect(BED_MAKE_AUD).toBeCloseTo(
      PLASTIC_AUD + POLES_AUD + CANVAS_AUD + HARDWARE_AUD + POWER_AUD + LABOUR_AUD,
      6,
    );
    expect(PLASTIC_AUD).toBe(55);
    expect(POLES_AUD).toBe(27);
    expect(CANVAS_AUD).toBe(93.5);
    expect(HARDWARE_AUD).toBe(5.24);
    expect(POWER_AUD).toBe(15);
    expect(BED_MAKE_AUD).toBeCloseTo(262.41, 2);
    expect(SRC).not.toMatch(/BED_MAKE_AUD = \d/);
  });

  it('the make cost is labelled provisional', () => {
    expect(BED_MAKE_STATUS).toContain('provisional');
    expect(BED_MAKE_STATUS).toContain('Nic');
  });

  it('freight is $100 a bed all up, Ben 15 September', () => {
    expect(BED_FREIGHT_AUD).toBe(100);
  });

  it('facilitation is $100 a bed, $40,000 over 400 beds', () => {
    expect(FACILITATION_PER_BED_AUD).toBe(100);
    expect(FACILITATION_PER_BED_AUD).toBe(FACILITATION_AUD / BEDS_YEAR_ONE);
  });

  it('the contribution is the price less making, freight and facilitation, and there is one of it', () => {
    expect(CONTRIBUTION_AUD).toBeCloseTo(750 - BED_MAKE_AUD - 100 - 100, 6);
    expect(CONTRIBUTION_AUD).toBeCloseTo(BED_PRICE_AUD - BED_MAKE_AUD - BED_FREIGHT_AUD - FACILITATION_PER_BED_AUD, 6);
    expect(CONTRIBUTION_AUD).toBeCloseTo(287.59, 2);
    expect(SRC).toContain('Ben, 15 September 2026');
  });

  it('the freight rule prints the derived figures and puts freight on the organisation', () => {
    expect(FREIGHT_RULE).toContain('$100 a bed');
    expect(FREIGHT_RULE).toContain(`$${Math.round(CONTRIBUTION_AUD).toLocaleString('en-AU')}`);
    expect(FREIGHT_RULE).toMatch(/organisation absorbs/);
    expect(SRC).not.toMatch(/buyer pays freight at cost|charged on top/);
  });
});

describe('running the organisation', () => {
  it('the six lines sum to $251,224', () => {
    expect(RUNNING_AUD).toBe(251_224);
    expect(RUNNING_LINES).toHaveLength(6);
  });

  it('marketing is $10,000 and accounting is the FY26 actual of $3,674', () => {
    expect(RUNNING_LINES.find((l) => l.line === 'Marketing')!.amountAud).toBe(10_000);
    expect(RUNNING_LINES.find((l) => l.line === 'Accounting and advice')!.amountAud).toBe(3_674);
    expect(RUNNING_LINES.find((l) => l.line === 'Founders')!.amountAud).toBe(151_200);
    expect(RUNNING_LINES.find((l) => l.line === 'Getting to communities')!.amountAud).toBe(51_000);
    expect(RUNNING_LINES.find((l) => l.line === 'Witta rent')!.amountAud).toBe(27_000);
    expect(RUNNING_LINES.find((l) => l.line === 'Maintenance')!.amountAud).toBe(8_350);
  });

  it('whether founders includes superannuation is unconfirmed, and says so', () => {
    expect(FOUNDERS_SUPER_STATUS).toBe('unconfirmed');
    expect(RUNNING_LINES.find((l) => l.line === 'Founders')!.what).toMatch(/superannuation/);
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
  it('the gross is the sum that was published, on whatever the running cost is today', () => {
    expect(GROSS_AS_PUBLISHED_AUD).toBeCloseTo(PLANTS_AUD + BEDS_AT_PRICE_AUD + FACILITATION_AUD + RUNNING_AUD, 6);
  });

  it('the overlap is what 400 beds hand back once making and freight are paid', () => {
    // Facilitation is a cost in both the gross and the need, so it is not in the overlap.
    expect(DOUBLE_COUNT_AUD).toBeCloseTo(BEDS_YEAR_ONE * (CONTRIBUTION_AUD + FACILITATION_PER_BED_AUD), 6);
    expect(DOUBLE_COUNT_AUD).toBeCloseTo(BEDS_YEAR_ONE * (BED_PRICE_AUD - BED_MAKE_AUD - BED_FREIGHT_AUD), 6);
  });

  it('the corrected need is the gross less the overlap', () => {
    expect(GROSS_AS_PUBLISHED_AUD - DOUBLE_COUNT_AUD).toBeCloseTo(NEED_AUD, 6);
  });

  it('freight on the year is in the need, once, at $100 a bed', () => {
    expect(FREIGHT_ON_THE_YEAR_AUD).toBe(BEDS_YEAR_ONE * BED_FREIGHT_AUD);
    expect(FREIGHT_ON_THE_YEAR_AUD).toBe(40_000);
    expect(NEED_AUD - (PLANTS_AUD + BEDS_AT_COST_AUD + FACILITATION_AUD + RUNNING_AUD)).toBeCloseTo(FREIGHT_ON_THE_YEAR_AUD, 6);
  });

  it('the components add up', () => {
    expect(PLANTS_AUD + BEDS_AT_COST_AUD + FACILITATION_AUD + FREIGHT_ON_THE_YEAR_AUD + RUNNING_AUD).toBeCloseTo(NEED_AUD, 6);
    expect(NEED_AUD).toBeCloseTo(736_186.67, 1);
    expect(PLANTS_AUD).toBe(300_000);
    expect(BEDS_AT_PRICE_AUD).toBe(300_000);
    expect(BEDS_AT_COST_AUD).toBeCloseTo(BEDS_YEAR_ONE * BED_MAKE_AUD, 6);
    expect(FACILITATION_AUD).toBe(40_000);
  });

  it('the organisation side: need, what the beds hand it, and the short, without counting freight twice', () => {
    expect(ORGANISATION_NEED_AUD).toBe(RUNNING_AUD + FACILITATION_AUD + FREIGHT_ON_THE_YEAR_AUD);
    expect(ORGANISATION_NEED_AUD).toBe(331_224);
    expect(ORGANISATION_FROM_BEDS_AUD).toBeCloseTo(BEDS_YEAR_ONE * CONTRIBUTION_AUD, 6);
    expect(ORGANISATION_SHORT_AUD).toBeCloseTo(RUNNING_AUD - ORGANISATION_FROM_BEDS_AUD, 6);
    // The same figure from the other side: the organisation's need less the beds' gross share.
    expect(ORGANISATION_SHORT_AUD).toBeCloseTo(
      ORGANISATION_NEED_AUD - BEDS_YEAR_ONE * (BED_PRICE_AUD - BED_MAKE_AUD), 6,
    );
    expect(ORGANISATION_SHORT_AUD).toBeGreaterThan(0);
  });

  it('the prose prints the derived figures, never the retired ones', () => {
    expect(year.WHAT_WENT_WRONG).toContain(Math.round(NEED_AUD).toLocaleString('en-AU'));
    expect(year.WHAT_WENT_WRONG).toContain(Math.round(CONTRIBUTION_AUD).toLocaleString('en-AU'));
    expect(year.WHAT_WENT_WRONG).not.toContain('747,950');
    expect(year.WHAT_WENT_WRONG).not.toContain('297,550');
    expect(year.WHAT_WENT_WRONG).not.toContain('736,187 with');
  });

  it('no export carries a buyer-freight or Goods-freight name, because there is one case now', () => {
    for (const k of Object.keys(year)) expect(k).not.toMatch(/BUYER_FREIGHT|GOODS_FREIGHT|IS_THE_SWING/);
  });

  it('says in words what went wrong, so nobody re-derives the old figure', () => {
    expect(SRC).toContain('937,550');
    expect(SRC).toContain('charged twice');
  });
});

describe('the raise', () => {
  it('four grants total $599,750 and the loan inside the ask is $150,000', () => {
    expect(year.GRANTS_ASKED_AUD).toBe(300_000 + 100_000 + GRANT_LOT_AUD + 100_000);
    expect(year.GRANTS_ASKED_AUD).toBe(599_750);
    expect(year.LOAN_ASKED_AUD).toBe(150_000);
    expect(ASKED_AUD).toBe(749_750);
    expect(ASKS).toHaveLength(5);
    expect(ASKS.filter((a) => a.instrument === 'loan')).toHaveLength(1);
  });

  it('every grant except QBE buys beds, 133 at $750, Ben 15 September', () => {
    expect(BEDS_A_GRANT).toBe(133);
    expect(GRANT_LOT_AUD).toBe(99_750);
    for (const a of ASKS.filter((x) => !x.funder.startsWith('QBE') && x.instrument !== 'loan')) expect(a.job).toBe('beds');
    expect(ASKS.filter((a) => a.job === 'facilitation')).toHaveLength(0);
    expect(EVERY_GRANT_BUYS_BEDS).toContain('133');
    expect(OPERATING_RULE).toMatch(/No grant is asked for the running cost/);
    expect(OPERATING_RULE).toMatch(/loan of \$150,000/);
  });

  it('nothing is secured', () => {
    expect(SECURED_AUD).toBe(0);
    expect(ASKS.every((a) => a.stage !== 'approved')).toBe(true);
  });

  it('Tim Fairfax is counted once, against beds; only the loan sits against operating', () => {
    const tf = ASKS.filter((a) => a.funder.startsWith('Tim Fairfax'));
    expect(tf).toHaveLength(1);
    expect(tf[0].job).toBe('beds');
    expect(OPERATING_ASKED_AUD).toBe(150_000);
    expect(ASKS.find((a) => a.job === 'operating')!.instrument).toBe('loan');
  });

  it('Brian M. Davis is one line of 133 beds, the 80 plus $40,000 split withdrawn', () => {
    const bmd = ASKS.filter((a) => a.funder.startsWith('Brian'));
    expect(bmd).toHaveLength(1);
    expect(bmd[0].amountAud).toBe(GRANT_LOT_AUD);
    expect(bmd[0].job).toBe('beds');
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
  it('399 of the 400 beds are covered once every bed ask is counted', () => {
    expect(BEDS_ASKED_FOR).toBe(399);
    expect(BEDS_FUNDED).toBe(399);
    expect(BEDS_UNFUNDED).toBe(1);
    expect(BEDS_OVER_THE_YEAR).toBe(0);
    expect(BEDS_FUNDED + BEDS_UNFUNDED).toBe(BEDS_YEAR_ONE);
    expect(BEDS_UNFUNDED_AUD).toBe(750);
  });

  it('an unsent ask covers no beds, so the stated gap is 134', () => {
    expect(BEDS_COVERED_BY_SENT_ASKS).toBe(266);
    expect(BEDS_TO_FIND).toBe(134);
    expect(BEDS_TO_FIND_AUD).toBe(100_500);
  });

  it('the unsent Snow ask is what takes 134 to 1', () => {
    expect(BEDS_IN_UNSENT_ASKS).toBe(133);
    expect(BEDS_TO_FIND - BEDS_IN_UNSENT_ASKS).toBe(BEDS_UNFUNDED);
  });

  it('the prose states the gap as sent asks only, derived', () => {
    expect(WHERE_THE_GAP_LIVES).toContain(`${BEDS_TO_FIND} beds`);
    expect(WHERE_THE_GAP_LIVES).not.toContain('320 beds');
    expect(THE_LEVER).toContain(`${BEDS_TO_FIND} beds`);
    expect(year.BED_GAP_RULE).toContain(`${BEDS_TO_FIND} beds`);
  });

  it('the gap as it stands is the need less what has been asked', () => {
    const asAsked = SCENARIOS.find((s) => s.id === 'as-asked')!;
    expect(asAsked.needAud).toBeCloseTo(NEED_AUD, 6);
    expect(gapAud(asAsked)).toBeCloseTo(NEED_AUD - ASKED_AUD, 6);
    expect(gapAud(asAsked)).toBeLessThan(0);
    expect(THE_GAP_STAYS).toContain(Math.round(NEED_AUD - year.GRANTS_ASKED_AUD).toLocaleString('en-AU'));
    expect(THE_GAP_STAYS).toContain('150,000');
    expect(THE_GAP_STAYS).not.toContain('147,950');
  });
});

describe('yield improvements, in place of a second press', () => {
  it('no export named SECOND_PRESS exists', () => {
    for (const k of Object.keys(year)) expect(k).not.toMatch(/SECOND_PRESS/);
    expect(SRC).not.toContain('22_500');
  });

  it('every entry has an owner, an id, an item and a job', () => {
    expect(YIELD_IMPROVEMENTS.length).toBeGreaterThanOrEqual(6);
    for (const y of YIELD_IMPROVEMENTS) {
      expect(y.owner).toBe('Nic');
      expect(y.id.length).toBeGreaterThan(3);
      expect(y.item.length).toBeGreaterThan(5);
      expect(y.whatItDoes.length).toBeGreaterThan(15);
      expect(['needs-quote', 'quoted']).toContain(y.status);
      if (y.status === 'needs-quote') expect(y.amountAud).toBeNull();
      else expect(typeof y.amountAud).toBe('number');
    }
    expect(new Set(YIELD_IMPROVEMENTS.map((y) => y.id)).size).toBe(YIELD_IMPROVEMENTS.length);
  });

  it('unquoted entries never enter the total', () => {
    const quoted = YIELD_IMPROVEMENTS.filter((y) => y.status === 'quoted');
    expect(YIELD_IMPROVEMENTS_TOTAL_AUD).toBe(quoted.reduce((n, y) => n + (y.amountAud ?? 0), 0));
    expect(YIELD_IMPROVEMENTS_TOTAL_AUD).toBe(0);
  });
});

describe('the Commonwealth money, read from the documents on 15 September', () => {
  it('nothing is approved to the applicant and nothing is counted', () => {
    expect(COMMONWEALTH_APPROVED_AUD).toBe(0);
    expect(COMMONWEALTH_LIKELY_AUD).toBe(0);
    expect(COMMONWEALTH_PLANT_MONEY.every((p) => p.stage !== 'approved' && p.stage !== 'likely')).toBe(true);
    expect(COMMONWEALTH_PLANT_MONEY.every((p) => p.inTheQbeAsk === false)).toBe(true);
  });

  it('REAL is one offer of $1,695,000 to Oonchiumpa, agreement not executed', () => {
    const real = COMMONWEALTH_PLANT_MONEY.find((p) => p.id === 'real-innovation-fund')!;
    expect(real.amountAud).toBe(1_695_000);
    expect(real.stage).toBe('offered');
    expect(real.recipient).toMatch(/Oonchiumpa/);
    expect(real.note).toMatch(/not|no cash/);
    expect(COMMONWEALTH_PLANT_MONEY.find((p) => p.id === 'alice-springs-second-tranche')).toBeUndefined();
    expect(SRC).not.toMatch(/second \$150,000 is/);
  });

  it('NIAA is a door with no invitation', () => {
    const niaa = COMMONWEALTH_PLANT_MONEY.find((p) => p.id === 'niaa-local-investments')!;
    expect(niaa.stage).toBe('no-invitation');
    expect(niaa.amountAud).toBe(150_000);
  });

  it('every Commonwealth dollar sits outside the two QBE sites, so the gap stands', () => {
    expect(REAL_RULING).toMatch(/no double-funding disclosure/);
    expect(REAL_RULING).toMatch(/not executed/);
    expect(THE_GAP_STAYS).toMatch(/does not close/);
    expect(BEDS_TO_FIND).toBe(134);
  });
});

describe('scenarios', () => {
  it('a plant costs what a plant grant brings, so adding plants never moves the gap', () => {
    const asAsked = SCENARIOS.find((s) => s.id === 'as-asked')!;
    const alice = SCENARIOS.find((s) => s.id === 'alice-in')!;
    expect(gapAud(alice)).toBeCloseTo(gapAud(asAsked), 6);
    expect(alice.what).toMatch(/stated by Ben as a director/);
    expect(alice.what).toMatch(/executed/);
  });

  it('the loan inside the ask closes the year with a margin, and plant money never moves it', () => {
    expect(SCENARIOS).toHaveLength(2);
    for (const s of SCENARIOS) expect(gapAud(s)).toBeLessThan(0);
    expect(NEED_AUD - year.GRANTS_ASKED_AUD).toBeGreaterThan(0);
  });

  it('every scenario prices its plants at the allowance', () => {
    for (const s of SCENARIOS) {
      expect(s.needAud).toBeCloseTo(s.plants * PLANT_ALLOWANCE_AUD + BEDS_AT_COST_AUD + FACILITATION_AUD + FREIGHT_ON_THE_YEAR_AUD + RUNNING_AUD, 6);
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
