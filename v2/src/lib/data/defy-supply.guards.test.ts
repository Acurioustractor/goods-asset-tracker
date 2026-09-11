import { describe, expect, it } from 'vitest';
import * as d from './defy-supply';
describe('preserved Defy invoice evidence', () => {
  it('the discounted sheet price and invoice lines still reconcile', () => {
    const i = d.INV_2021;
    expect(i.sheetListPriceAud * (1 - i.scaleDiscount)).toBeCloseTo(i.sheetNetPriceAud, 2);
    expect(i.sheets * i.sheetNetPriceAud).toBeCloseTo(i.panelLineAud, 2);
    expect(i.panelLineAud + i.cuttingLineAud + i.palletLineAud).toBe(i.subtotalAud);
    expect(i.subtotalAud * 0.1).toBeCloseTo(i.gstAud, 2);
    expect(i.subtotalAud + i.gstAud).toBeCloseTo(i.totalAud, 2);
  });
  it('the parent order and cut-panel quantity stay distinct', () => {
    expect(d.PARENT_ORDER_SHEETS).toBe(105);
    expect(d.SHEETS_STILL_TO_COME).toBe(80);
    expect(d.PANELS_PER_SHEET).toBe(3);
    expect(d.PANELS_ON_THE_INVOICE).toBe(75);
    expect(d.SHEET_ALL_IN_AUD).toBeCloseTo(381.68, 2);
    expect(d.PANEL_ALL_IN_AUD).toBeCloseTo(127.22666667);
  });
  it('mass arithmetic does not claim to establish leg-cut yield', () => {
    expect(d.PANEL_MASS_KG * 3).toBeCloseTo(d.SHEET_MASS_KG);
    expect(d.PANELS_PER_BED).toBeNull();
    expect(d.BEDS_ON_THIS_INVOICE).toBeNull();
    expect(d.SPARE_PANELS).toBeNull();
  });
  it('unknown yield prevents a false purchase quantity or cost', () => {
    expect(d.sheetsFor(400)).toBeNull();
    expect(d.panelOrderCostAud(400)).toBeNull();
    expect(d.PANEL_PATH_PER_BED_AUD).toBeNull();
    expect(d.PANEL_SAVING_VS_KIT_AUD).toBeNull();
  });
  it('an explicitly supplied yield drives whole-sheet ordering', () => {
    expect(d.sheetsFor(400, 1)).toBe(134);
    expect(d.sheetsFor(400, 2)).toBe(67);
    expect(d.panelOrderCostAud(400, 2)).toBeCloseTo(67 * 381.68);
    expect(() => d.sheetsFor(400, 0)).toThrow();
  });
});
describe('complementary legs and tabs', () => {
  it('every purchased-leg choice still requires factory tab production', () => {
    for (const p of d.PATHS) {
      expect(p.bedsADay).toBe(6);
      expect(d.bedsAMonth(p)).toBe(96);
      expect(d.monthsFor(p, 400)).toBeCloseTo(400 / 96);
    }
    expect(d.ASSEMBLY_BEDS_A_DAY).toBeNull();
  });
  it('extra legs do not count as extra complete kits', () => {
    expect(d.MARGINAL_BEDS_A_DAY).toBe(0);
    expect(d.MARGINAL_SALES_A_MONTH_AUD).toBe(0);
    expect(d.PRESS_PAYBACK_BEDS).toBeNull();
  });
  it('leg-kit costs remain component costs and missing panel costs stay unknown', () => {
    expect(d.plasticCostFor(d.PATHS.find(p => p.id === 'kit')!, 400)).toBeCloseTo(344.05 * 400);
    expect(d.plasticCostFor(d.PATHS.find(p => p.id === 'panel')!, 400)).toBeNull();
  });
  it('the historical shred burn is compatible with tabs, not proof of current stock', () => {
    expect(d.SHRED_BURN_KG_A_WEEK).toBe(450);
    expect(d.SHRED_BURN_KG_A_WEEK / d.PRESSED_KG_PER_BED).toBe(30);
    expect(d.PARENT_ORDER_BULKA_BAGS * d.BULKA_BAG_KG / d.PRESSED_KG_PER_BED).toBeCloseTo(533.3333);
  });
});
