/**
 * Cross-module invariants.
 *
 * Every module guards itself. Nothing guarded that they agree with each other, so a bed could cost
 * $750 in one file and $800 in the next and both files would pass. This is the file that fails
 * when two modules drift apart.
 */
import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import * as year from './the-year-and-the-raise';
import * as three from './three-year-plan';
import * as scen from './production-scenarios';
import * as defy from './defy-supply';
import * as sizing from './sizing-from-experience';
import * as asked from './who-has-asked';
import * as needOrder from './bed-need-and-order';
import * as lang from './model-language';
import { BEDS_PAID_FOR as TRADE_BEDS, PAID_NET_AUD } from './demand-and-buyers';
import { canonValue } from './canon';
import { COMMUNITY_BED_CANON } from './community-canonical';
import { COMMUNITY_NEED } from './community-need';

describe('the bed', () => {
  it('costs $750 in every module and in canon', () => {
    const price = Number(canonValue('stretch-price'));
    expect(price).toBe(750);
    for (const v of [year.BED_PRICE_AUD, three.BED_PRICE_AUD, scen.BED_PRICE_AUD, defy.BED_PRICE_AUD]) {
      expect(v).toBe(price);
    }
  });

  it('the make cost is derived once and the contribution follows from it', () => {
    expect(year.BED_MAKE_AUD).toBe(three.BED_MAKE_AUD);
    expect(three.CONTRIBUTION_AUD).toBe(year.CONTRIBUTION_AUD);
    expect(three.CONTRIBUTION_AUD).toBeCloseTo(
      three.BED_PRICE_AUD - three.BED_MAKE_AUD - three.BED_FREIGHT_AUD - three.FACILITATION_PER_BED_AUD, 6,
    );
    expect(year.FACILITATION_PER_BED_AUD).toBe(100);
    expect(year.KITS_A_DAY).toBe(scen.PRESS_BEDS_A_DAY);
    expect(year.BED_MAKE_STATUS).toContain('provisional');
  });

  it('freight is the one $100 everywhere, and the canon landed cost is the legacy 426 until re-graded', () => {
    expect(year.BED_FREIGHT_AUD).toBe(three.BED_FREIGHT_AUD);
    expect(year.BED_FREIGHT_AUD).toBe(100);
    expect(Number(canonValue('marginal-factory'))).toBe(426);
  });

  it('takes 15 kg through the tab press wherever that is stated', () => {
    expect(scen.PRESSED_KG_PER_BED).toBe(defy.PRESSED_KG_PER_BED);
    expect(scen.PRESSED_KG_PER_BED).toBe(15);
  });
});

describe('the line', () => {
  it('the three machine rates agree across both modules', () => {
    expect(scen.PRESS_BEDS_A_DAY).toBe(defy.PRESS_BEDS_A_DAY);
    expect(scen.CNC_BEDS_A_DAY).toBe(defy.CNC_BEDS_A_DAY);
    expect(scen.ASSEMBLY_BEDS_A_DAY).toBe(defy.ASSEMBLY_BEDS_A_DAY);
  });

  it('sixteen run days a month, in both', () => {
    expect(scen.RUN_DAYS_A_MONTH).toBe(defy.RUN_DAYS_A_MONTH);
    expect(scen.RUN_DAYS_A_MONTH).toBe(16);
  });

  it("Witta's year is its press rate times the run month", () => {
    expect(three.WITTA_BEDS_A_YEAR).toBe(scen.PRESS_BEDS_A_DAY * scen.RUN_DAYS_A_MONTH * 12);
  });

  it('a bulka bag is the same weight in both modules that use one', () => {
    expect(scen.BULKA_BAG_KG).toBe(defy.BULKA_BAG_KG);
  });
});

describe('the plastic', () => {
  it('the panel path and the finished kit agree across both modules', () => {
    expect(scen.PANEL_PLASTIC_PER_BED_AUD).toBe(defy.PANEL_PATH_PER_BED_AUD);
    expect(scen.FINISHED_KIT_PER_BED_AUD).toBe(defy.FINISHED_KIT_PER_BED_AUD);
  });

  it('no module prices a second press, Ben 15 September', () => {
    for (const mod of [scen, defy, year]) {
      for (const k of Object.keys(mod)) expect(k).not.toMatch(/SECOND_PRESS_AUD|SECOND_PRESS_NOTE/);
    }
    expect(year.YIELD_IMPROVEMENTS.length).toBeGreaterThan(0);
  });
});

describe('the year', () => {
  it('the first-stock run is the same 400 everywhere', () => {
    expect(year.BEDS_YEAR_ONE).toBe(scen.FIRST_STOCK_BEDS);
    expect(year.BEDS_YEAR_ONE).toBe(defy.FIRST_STOCK_BEDS);
  });

  it('400 beds is four pools of 100, which is ruling 7', () => {
    expect(year.BEDS_YEAR_ONE).toBe(year.FACILITATION_COMMUNITIES * 100);
  });

  it('facilitation is the same four communities at $10,000 each', () => {
    expect(year.FACILITATION_AUD).toBe(
      year.FACILITATION_COMMUNITIES * three.FACILITATION_PER_COMMUNITY_AUD,
    );
  });

  it('running the organisation is the same figure in both modules', () => {
    expect(year.RUNNING_AUD).toBe(three.RUNNING_YEAR_ONE_AUD);
  });

  it('break-even follows from the running cost and the contribution, never asserted', () => {
    expect(three.BREAK_EVEN_BEDS).toBe(
      Math.ceil(year.RUNNING_AUD / year.CONTRIBUTION_AUD),
    );
  });

  it('the year needs freight on every bed, once, and no data module exports a buyer-freight or Goods-freight name', () => {
    expect(year.NEED_AUD).toBeCloseTo(
      year.PLANTS_AUD + year.BEDS_AT_COST_AUD + year.FACILITATION_AUD + year.FREIGHT_ON_THE_YEAR_AUD + year.RUNNING_AUD, 6,
    );
    for (const f of readdirSync(__dirname).filter((n) => n.endsWith('.ts') && !n.includes('.test.'))) {
      const src = readFileSync(join(__dirname, f), 'utf8');
      expect(src, f).not.toMatch(/export (?:const|function|let) \w*(?:BUYER_FREIGHT|GOODS_FREIGHT)/);
    }
  });

  it('the ALIVE order is the same 100 in both modules that carry it', () => {
    expect(scen.ALIVE_BEDS).toBe(defy.ALIVE_BEDS_DUE);
  });
});

describe('the trade', () => {
  it('320 paid beds tie across the demand and asks modules', () => {
    expect(asked.BEDS_PAID_FOR).toBe(TRADE_BEDS);
    expect(asked.BEDS_PAID_FOR).toBe(320);
    expect(Math.round(PAID_NET_AUD)).toBeGreaterThan(0);
  });

  it('four organisations have paid', () => {
    expect(asked.PAID_ORGANISATIONS).toBe(4);
  });
});

describe('the communities', () => {
  it('every sizing comparator ties to the register and the Census', () => {
    for (const c of sizing.COMPARATORS) {
      const id = c.place.toLowerCase().replace(/\s+/g, '-');
      const k = COMMUNITY_BED_CANON.find((x) => x.id === id)!;
      const n = COMMUNITY_NEED.find((x) => x.communityId === id)!;
      expect(k, c.place).toBeTruthy();
      expect(c.delivered).toBe((k.basketBeds ?? 0) + (k.stretchBeds ?? 0));
      expect(c.people).toBe(Math.round(n.occupiedDwellings * n.personsPerDwelling));
    }
  });

  it('no module holds an ask figure since 15 September 2026', () => {
    for (const c of sizing.COMPARATORS) expect(c.askedNext, c.place).toBe(0);
    expect(asked.ASKS.filter((a) => a.rung !== 'paid')).toHaveLength(0);
    expect(needOrder.FIGURES).toHaveLength(0);
    expect(asked.ASKS_WITHDRAWN).toContain('withdrawn');
  });

  it('every other place agrees between the two modules', () => {
    for (const f of needOrder.FIGURES) {
      if (f.communityId === 'tennant-creek') continue;
      const c = sizing.COMPARATORS.find((x) => x.place === f.name);
      if (c) expect(c.askedNext, f.name).toBe(f.beds);
    }
  });
});

describe('nothing claims a demand total', () => {
  it('no module computes one', () => {
    expect(asked.NO_TOTAL_ACROSS_RUNGS).toBeTruthy();
    expect(needOrder.NEVER_ADD_THEM).toBeTruthy();
    for (const k of Object.keys(asked)) expect(k).not.toMatch(/DEMAND_TOTAL|TOTAL_DEMAND/);
  });

  it('nothing is recorded as secured', () => {
    expect(year.SECURED_AUD).toBe(0);
  });
});

describe('the language rules hold across every module', () => {
  const DIR = __dirname;
  const FILES = readdirSync(DIR).filter((f) => f.endsWith('.ts') && !f.includes('.test.'));
  const MINE = [
    'the-year-and-the-raise.ts', 'three-year-plan.ts', 'production-scenarios.ts',
    'defy-supply.ts', 'sizing-from-experience.ts', 'who-has-asked.ts',
    'bed-need-and-order.ts', 'model-language.ts',
  ].filter((f) => FILES.includes(f));

  it('every module built today exists', () => {
    expect(MINE).toHaveLength(8);
  });

  it('none carries an em dash', () => {
    for (const f of MINE) {
      expect(readFileSync(join(DIR, f), 'utf8').includes('—'), f).toBe(false);
    }
  });

  it('none uses the banned pitch vocabulary', () => {
    const banned = /\b(empower(ing|ment)?|co-design(ed)?|leverage|holistic|synerg)/i;
    for (const f of MINE) {
      expect(banned.test(readFileSync(join(DIR, f), 'utf8')), f).toBe(false);
    }
  });

  it('the thesis is the one the language module settled on', () => {
    expect(lang.THE_THESIS).toContain('already wants');
    expect(lang.RETIRED.length).toBeGreaterThanOrEqual(4);
  });

  it('Suncorp appears nowhere except as a retired line', () => {
    for (const f of MINE) {
      if (readFileSync(join(DIR, f), 'utf8').includes('Suncorp')) expect(f).toBe('model-language.ts');
    }
  });
});
