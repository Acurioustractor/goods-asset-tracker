import { describe, expect, it } from 'vitest';
import * as mod from './remote-communities';
import { REMOTE_PEOPLE, REMOTE_PLACES, SETTING_MEASURES_THE_PLACE, everyPrintedString } from './remote-communities';

describe('remote communities: the places tie out', () => {
  it('kinds sum to the total', () => {
    expect(REMOTE_PLACES.byKind.reduce((n, k) => n + k.count, 0)).toBe(REMOTE_PLACES.total);
  });
  it('states sum to the total', () => {
    expect(REMOTE_PLACES.byState.reduce((n, s) => n + s.places, 0)).toBe(REMOTE_PLACES.total);
  });
  it('is the count as at a stated date from a stated table', () => {
    expect(mod.QUERIED_AT).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(REMOTE_PLACES.source).toContain('goods_communities');
    expect(REMOTE_PLACES.source).toContain('Remote Australia');
  });
});

describe('remote communities: the people are the ABS, both series named', () => {
  it('estimate is remote plus very remote', () => {
    const e = REMOTE_PEOPLE.estimate;
    expect(e.remoteAndVeryRemote).toBe(e.remote + e.veryRemote);
    expect(e.remoteAndVeryRemote).toBe(150_800);
    expect(e.url).toContain('abs.gov.au');
  });
  it('census count is remote plus very remote and is the smaller series', () => {
    const c = REMOTE_PEOPLE.census;
    expect(c.remoteAndVeryRemote).toBe(c.remote + c.veryRemote);
    expect(c.remoteAndVeryRemote).toBeLessThan(REMOTE_PEOPLE.estimate.remoteAndVeryRemote);
    expect(c.url).toContain('abs.gov.au');
  });
});

describe('remote communities: measures the place and nothing else', () => {
  it('exports nothing named like demand, beds, orders or machines', () => {
    for (const name of Object.keys(mod)) {
      expect(name, name).not.toMatch(/bed|demand|order|washer|machine|fridge|need/i);
    }
  });
  it('says so in the printed line', () => {
    expect(SETTING_MEASURES_THE_PLACE).toMatch(/measure the place/);
  });
  it('printed strings carry no em dash and no "rather than"', () => {
    for (const s of everyPrintedString()) {
      expect(s, s).not.toMatch(/—|rather than/);
    }
  });
});
