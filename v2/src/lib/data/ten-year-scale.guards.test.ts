import { describe, expect, it } from 'vitest';
import {
  ASSUMPTIONS,
  CLAIM_CEILING,
  YEARS,
  everyPrintedString,
  facilitiesOpenInYear,
  tenYearRows,
  tenYearTotals,
} from './ten-year-scale';

const rows = tenYearRows();
const totals = tenYearTotals();

describe('ten-year scale: arithmetic', () => {
  it('has ten rows, FY27 to FY36', () => {
    expect(rows).toHaveLength(YEARS);
    expect(rows[0].label).toBe('FY27');
    expect(rows[9].label).toBe('FY36');
  });
  it('totals equal the sums of the rows', () => {
    const sum = (k: 'bedsMain' | 'bedsCommunity' | 'bedsTotal' | 'paidHours' | 'kgRecycled' | 'localCapitalAud' | 'contributionToGoodsAud') =>
      rows.reduce((n, r) => n + r[k], 0);
    expect(totals.bedsMain).toBe(sum('bedsMain'));
    expect(totals.bedsCommunity).toBe(sum('bedsCommunity'));
    expect(totals.bedsTotal).toBe(sum('bedsTotal'));
    expect(totals.paidHours).toBe(sum('paidHours'));
    expect(totals.kgRecycled).toBe(sum('kgRecycled'));
    expect(totals.localCapitalAud).toBe(sum('localCapitalAud'));
    expect(totals.contributionToGoodsAud).toBe(sum('contributionToGoodsAud'));
  });
  it('hours are beds times two and kilograms are beds times twenty', () => {
    for (const r of rows) {
      expect(r.bedsTotal).toBe(r.bedsMain + r.bedsCommunity);
      expect(r.paidHours).toBe(r.bedsTotal * 2);
      expect(r.kgRecycled).toBe(r.bedsTotal * 20);
      expect(r.tonnesRecycled).toBeCloseTo(r.kgRecycled / 1000, 9);
    }
  });
  it('opens two facilities in year one and two more every year after', () => {
    for (const r of rows) {
      expect(r.facilitiesOpen).toBe(2 + 2 * (r.year - 1));
      expect(facilitiesOpenInYear(r.year)).toBe(r.facilitiesOpen);
      expect(r.facilitiesMature).toBe(r.facilitiesOpen - 2);
    }
    expect(rows[0].facilitiesOpen).toBe(2);
    expect(rows[9].facilitiesOpen).toBe(20);
  });
  it('keeps the main facility inside its capacity and starts at the year-one 400', () => {
    expect(rows[0].bedsMain).toBe(400);
    for (const r of rows) expect(r.bedsMain).toBeLessThanOrEqual(ASSUMPTIONS.mainFacilityCapacity.value);
  });
  it('counts enterprises as the four organisations plus one a facility', () => {
    for (const r of rows) expect(r.enterprisesTrading).toBe(4 + r.facilitiesOpen);
  });
});

describe('ten-year scale: claim ceiling', () => {
  it('every assumption has a basis and a source', () => {
    for (const a of Object.values(ASSUMPTIONS)) {
      expect(['verified', 'modelled', 'target', 'assumption']).toContain(a.basis);
      expect(a.source.length).toBeGreaterThan(20);
    }
  });
  it('prints no withdrawn place demand figure', () => {
    const banned = [/Utopia\D{0,20}150/, /Groote\D{0,20}500/, /Maningrida\D{0,20}65/, /Palm Island\D{0,20}40\b/, /NPY/, /200 to 350/];
    for (const s of everyPrintedString()) for (const b of banned) expect(s).not.toMatch(b);
  });
  it('carries no em dash and says it is not a forecast', () => {
    for (const s of everyPrintedString()) expect(s).not.toContain('—');
    expect(CLAIM_CEILING).toMatch(/not forecasts/);
    expect(CLAIM_CEILING).toMatch(/running cost/i);
  });
});
