import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  ALIVE_BEDS_DUE,
  ASSEMBLY_BEDS_A_DAY,
  BEDS_ON_THIS_INVOICE,
  FINISHED_KIT_PER_BED_AUD,
  FIRST_STOCK_BEDS,
  INV_2021,
  OWN_PRESS_CEILING,
  PANELS_ON_THE_INVOICE,
  PANELS_PER_BED,
  PANELS_PER_SHEET,
  PANEL_ALL_IN_AUD,
  PANEL_MASS_KG,
  PANEL_PATH_PER_BED_AUD,
  PANEL_PREMIUM_PER_BED_AUD,
  PANEL_SAVING_VS_KIT_AUD,
  PATHS,
  PRESSED_KG_PER_BED,
  PRESS_BEDS_A_DAY,
  PRESS_PAYBACK_BEDS,
  REFERENCE_MISMATCH,
  SECOND_PRESS_AUD,
  SHEET_ALL_IN_AUD,
  SHEET_MASS_KG,
  SPARE_PANELS,
  WHAT_TO_ASK_DEFY,
  bedsAMonth,
  monthsFor,
  panelOrderCostAud,
  plasticCostFor,
  sheetsFor,
} from './defy-supply';

const SRC = readFileSync(join(__dirname, 'defy-supply.ts'), 'utf8');

describe('INV-2021 adds up', () => {
  it('the discounted sheet price is the list less 20%', () => {
    expect(INV_2021.sheetListPriceAud * (1 - INV_2021.scaleDiscount)).toBeCloseTo(
      INV_2021.sheetNetPriceAud,
      2,
    );
  });

  it('the panel line is 25 sheets at the discounted price', () => {
    expect(INV_2021.sheets * INV_2021.sheetNetPriceAud).toBeCloseTo(INV_2021.panelLineAud, 2);
  });

  it('the discount given is the difference from list', () => {
    expect(
      INV_2021.sheets * INV_2021.sheetListPriceAud - INV_2021.panelLineAud,
    ).toBeCloseTo(INV_2021.discountGivenAud, 2);
  });

  it('the three lines make the subtotal', () => {
    expect(INV_2021.panelLineAud + INV_2021.cuttingLineAud + INV_2021.palletLineAud).toBe(
      INV_2021.subtotalAud,
    );
  });

  it('GST is 10% and the total is the subtotal plus it', () => {
    expect(INV_2021.subtotalAud * 0.1).toBeCloseTo(INV_2021.gstAud, 2);
    expect(INV_2021.subtotalAud + INV_2021.gstAud).toBeCloseTo(INV_2021.totalAud, 2);
  });

  it('the cutting and pallet lines match their unit prices', () => {
    expect(INV_2021.sheets * INV_2021.cuttingPerSheetAud).toBe(INV_2021.cuttingLineAud);
    expect(INV_2021.palletCount * INV_2021.palletEachAud).toBe(INV_2021.palletLineAud);
  });
});

describe('the reference does not match the lines', () => {
  it('a 1200 by 2400 sheet yields exactly three 800 by 1200 panels, with no offcut', () => {
    expect(PANELS_PER_SHEET).toBe(3);
    expect(3 * 800).toBe(INV_2021.sheetSizeMm.l);
  });

  it('25 sheets is 75 panels, and the reference says 105', () => {
    expect(PANELS_ON_THE_INVOICE).toBe(75);
    expect(INV_2021.reference).toContain('105');
    expect(REFERENCE_MISMATCH).toContain('75 panels');
  });

  it('the mismatch is carried as a question for the supplier', () => {
    expect(WHAT_TO_ASK_DEFY[0]).toContain('105');
    expect(WHAT_TO_ASK_DEFY.length).toBeGreaterThanOrEqual(4);
  });
});

describe('mass, which is how we know a bed takes two panels', () => {
  it('a full sheet is about 52 kg and a cut panel about 17 kg', () => {
    expect(SHEET_MASS_KG).toBeCloseTo(51.98, 1);
    expect(PANEL_MASS_KG).toBeCloseTo(17.33, 1);
  });

  it('two panels land within 2 kg of the 36 kg pressed a bed', () => {
    expect(Math.abs(PANEL_MASS_KG * PANELS_PER_BED - PRESSED_KG_PER_BED)).toBeLessThan(2);
  });

  it('three panels weigh one sheet', () => {
    expect(PANEL_MASS_KG * PANELS_PER_SHEET).toBeCloseTo(SHEET_MASS_KG, 1);
  });
});

describe('cost per bed', () => {
  it('a sheet all up is $381.68 and a panel $127.23', () => {
    expect(SHEET_ALL_IN_AUD).toBeCloseTo(381.68, 2);
    expect(PANEL_ALL_IN_AUD).toBeCloseTo(127.23, 2);
  });

  it('the panel path is about $254 a bed', () => {
    expect(PANEL_PATH_PER_BED_AUD).toBeCloseTo(254.45, 2);
  });

  it('panels beat the finished kit by about $90 a bed', () => {
    expect(PANEL_SAVING_VS_KIT_AUD).toBeCloseTo(89.6, 1);
    expect(PANEL_PATH_PER_BED_AUD).toBeLessThan(FINISHED_KIT_PER_BED_AUD);
  });

  it('every path is cheaper than the one above it, and slower or equal', () => {
    const byCost = [...PATHS].sort((a, b) => b.perBedAud - a.perBedAud);
    expect(byCost.map((p) => p.id)).toEqual(['kit', 'panel', 'own-press']);
  });
});

describe('speed', () => {
  it('the press is the only path that is slower than assembly', () => {
    expect(PRESS_BEDS_A_DAY).toBeLessThan(ASSEMBLY_BEDS_A_DAY);
    const bought = PATHS.filter((p) => p.id !== 'own-press');
    for (const p of bought) expect(p.bedsADay).toBe(ASSEMBLY_BEDS_A_DAY);
  });

  it('the panel path makes 400 beds in five months and the press path in over eight', () => {
    const panel = PATHS.find((p) => p.id === 'panel')!;
    const press = PATHS.find((p) => p.id === 'own-press')!;
    expect(monthsFor(panel, FIRST_STOCK_BEDS)).toBeCloseTo(5, 1);
    expect(monthsFor(press, FIRST_STOCK_BEDS)).toBeGreaterThan(8);
    expect(bedsAMonth(panel)).toBe(80);
    expect(bedsAMonth(press)).toBe(48);
  });
});

describe('this order, and the run behind it', () => {
  it('buys 37 beds of plastic with one panel left over', () => {
    expect(BEDS_ON_THIS_INVOICE).toBe(37);
    expect(SPARE_PANELS).toBe(1);
  });

  it('ALIVE\'s 100 needs 67 sheets and about $25,600', () => {
    expect(sheetsFor(ALIVE_BEDS_DUE)).toBe(67);
    expect(panelOrderCostAud(ALIVE_BEDS_DUE)).toBeCloseTo(25_572.56, 0);
  });

  it('the 400 needs 267 sheets and about $101,900 of plastic', () => {
    expect(sheetsFor(FIRST_STOCK_BEDS)).toBe(267);
    expect(panelOrderCostAud(FIRST_STOCK_BEDS)).toBeGreaterThan(100_000);
    expect(panelOrderCostAud(FIRST_STOCK_BEDS)).toBeLessThan(103_000);
  });

  it('the finished kit would cost $35,840 more over the 400', () => {
    const kit = PATHS.find((p) => p.id === 'kit')!;
    const panel = PATHS.find((p) => p.id === 'panel')!;
    expect(
      plasticCostFor(kit, FIRST_STOCK_BEDS) - plasticCostFor(panel, FIRST_STOCK_BEDS),
    ).toBeCloseTo(35_840, -2);
  });
});

describe('the second press', () => {
  it('pays for itself inside 120 beds at the panel premium', () => {
    expect(PANEL_PREMIUM_PER_BED_AUD).toBeCloseTo(199.45, 2);
    expect(PRESS_PAYBACK_BEDS).toBe(113);
    expect(PRESS_PAYBACK_BEDS * PANEL_PREMIUM_PER_BED_AUD).toBeGreaterThanOrEqual(SECOND_PRESS_AUD);
  });

  it('the premium on the whole 400 dwarfs the machine', () => {
    expect(PANEL_PREMIUM_PER_BED_AUD * FIRST_STOCK_BEDS).toBeGreaterThan(SECOND_PRESS_AUD * 3);
  });
});

describe('honesty', () => {
  it('the own press floor is labelled as a floor, not a cost', () => {
    expect(OWN_PRESS_CEILING).toContain('modelled');
    expect(OWN_PRESS_CEILING).toContain('floor');
  });

  it('the feedstock problem is stated, not hidden', () => {
    expect(SRC).toContain('14.4 tonnes');
    expect(SRC).toContain('collection is not costed');
  });

  it('no em dashes', () => {
    expect(SRC).not.toContain('—');
  });
});
