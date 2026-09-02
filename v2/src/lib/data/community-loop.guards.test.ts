/**
 * Guards for the per-community loop. Each exists because a version of this model overstated
 * itself: gross sales read as income, one pool read as a facility, a modelled margin read as
 * measured, and a place name beside a dollar.
 */
import { describe, it, expect } from 'vitest';
import {
  BED_PRICE_AUD,
  FACILITY_BAND,
  KIT_COST_AUD,
  LOOP_GATES,
  LOOP_RETURN,
  LOOP_STEPS,
  POOL,
  POOL_SCENARIOS,
  PRESSED_COST_AUD,
  SITE_FLOOR,
  STAYS_KIT_AUD,
  STAYS_PRESSED_AUD,
  TIMELINE_TARGETS,
  poolScenario,
} from './community-loop';
import { canonValue } from './canon';
import { OFFERS } from './offers';

const COMMUNITY_NAMES = ['Utopia', 'Urapuntja', 'Oonchiumpa', 'Alice Springs', 'Mparntwe', 'Tennant Creek', 'Palm Island', 'Maningrida', 'Gamardi', 'Kalgoorlie'];
const BANNED = /\b(empower\w*|beneficiar\w*|ecosystem|scalable solution|transformational|unlock\w*|journey|game-changing|co-design\w*)\b/i;

function strings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, out));
  else if (value && typeof value === 'object') Object.values(value).forEach((v) => strings(v, out));
  return out;
}

const ALL = strings({ LOOP_STEPS, LOOP_RETURN, LOOP_GATES, TIMELINE_TARGETS, SITE_FLOOR });

describe('figures are read, not typed', () => {
  it('derives every dollar from canon and offers', () => {
    expect(BED_PRICE_AUD).toBe(Number(canonValue('stretch-price')));
    expect(KIT_COST_AUD).toBe(Number(canonValue('marginal-buykit')));
    expect(PRESSED_COST_AUD).toBe(Number(canonValue('marginal-factory')));
    expect(STAYS_KIT_AUD).toBe(BED_PRICE_AUD - KIT_COST_AUD);
    expect(STAYS_PRESSED_AUD).toBe(BED_PRICE_AUD - PRESSED_COST_AUD);
    expect(FACILITY_BAND.lowAud).toBe(OFFERS.completeFacility.lowAud);
    expect(FACILITY_BAND.highAud).toBe(OFFERS.completeFacility.highAud);
  });

  it('keeps the drawing sentences in step with the figures', () => {
    expect(LOOP_STEPS[2].body).toContain(`$${(POOL.beds * BED_PRICE_AUD).toLocaleString('en-AU')}`);
    expect(LOOP_STEPS[2].body).toContain(`$${BED_PRICE_AUD}`);
    expect(LOOP_STEPS[3].body).toContain(`$${FACILITY_BAND.lowAud.toLocaleString('en-AU')} to $${FACILITY_BAND.highAud.toLocaleString('en-AU')}`);
    expect(LOOP_STEPS[4].body).toContain(`$${STAYS_PRESSED_AUD}`);
    expect(LOOP_STEPS[4].body).toContain(`$${STAYS_KIT_AUD}`);
    expect(LOOP_STEPS[0].body).toContain(`$${POOL.costAud.toLocaleString('en-AU')}`);
  });
});

describe('one pool', () => {
  it('costs 200 beds at the price and sells at most that much gross', () => {
    expect(POOL.costAud).toBe(200 * BED_PRICE_AUD);
    const all = poolScenario(1);
    expect(all.sold).toBe(200);
    expect(all.given).toBe(0);
    expect(all.grossSalesAud).toBe(POOL.costAud);
  });

  it('reaches the bottom of the facility band only when every bed sells', () => {
    const all = poolScenario(1);
    expect(all.facilityLowCoverage).toBe(1);
    expect(all.facilityHighCoverage).toBeLessThan(1);
    for (const s of POOL_SCENARIOS.filter((x) => x.soldShare < 1)) {
      expect(s.facilityLowCoverage).toBeLessThan(1);
    }
  });

  it('gives what it does not sell', () => {
    for (const s of POOL_SCENARIOS) expect(s.sold + s.given).toBe(POOL.beds);
    expect(() => poolScenario(1.5)).toThrow();
  });
});

describe('what the loop says', () => {
  it('never calls gross sales income and never calls the margin measured', () => {
    for (const s of ALL) {
      expect(s).not.toMatch(/community income|sales income of|profit/i);
      expect(s).not.toMatch(/\bmeasured margin\b/i);
    }
    expect(LOOP_STEPS[2].body).toMatch(/design number/);
    expect(LOOP_STEPS[4].body).toMatch(/Modelled, not yet measured/);
  });

  it('carries the four gates and keeps the return inside the community', () => {
    expect(LOOP_GATES.length).toBe(4);
    expect(LOOP_GATES.map((g) => g.title)).toContain('A measured cost');
    expect(LOOP_RETURN.body).toMatch(/never back to the funder/);
  });

  it('names no community beside a dollar', () => {
    for (const s of ALL) for (const name of COMMUNITY_NAMES) expect(s).not.toContain(name);
  });

  it('states the timeline as a target with its honesty line', () => {
    expect(TIMELINE_TARGETS.label).toBe('target');
    expect(TIMELINE_TARGETS.honesty).toMatch(/eight times the largest run/);
  });

  it('uses no em dashes, arrows or banned words', () => {
    for (const s of ALL) {
      expect(s, s).not.toMatch(/[—→]/);
      expect(s, s).not.toMatch(BANNED);
    }
  });
});
