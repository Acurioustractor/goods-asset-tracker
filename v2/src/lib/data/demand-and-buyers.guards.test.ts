import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  BEDS_PAID_FOR,
  BED_REVENUE_NET_AUD,
  CONVERSATION_BEDS,
  DEMAND_CLAIM_CEILING,
  DEMAND_WITH_MONEY_NAMED,
  FACILITATION_PAID_NET_AUD,
  OUTSTANDING_FROM_BUYERS,
  OWNED_DEMAND_BEDS,
  PAID_INCL_GST_AUD,
  PAID_NET_AUD,
  PAID_TRADE,
  PRICE_LADDER,
  RECORDED_DEMAND,
  RECORDED_DEMAND_BEDS,
  TRADE_CLAIM_CEILING,
  WRITTEN_OFF_NET_AUD,
  ABSORBED_NOT_BILLED_AUD,
  VALUE_FOREGONE_AUD,
  needsSecondSource,
  CENTRECORP_RECONCILIATION,
  CENTRECORP_BEDS_PAID,
  CENTRECORP_BEDS_DEPLOYED,
  CENTRECORP_BEDS_READY,
  CENTRECORP_QUOTED_UNPAID,
  CENTRECORP_LINE,
  UTOPIA_REGISTER_UNITS,
} from './demand-and-buyers';
import { BED_PRICE_AUD } from './bed-ratio';

const SRC = readFileSync(join(__dirname, 'demand-and-buyers.ts'), 'utf8');

describe('the paid trade ties to the invoices it came from', () => {
  it('holds five settled invoices across four buyers', () => {
    expect(PAID_TRADE).toHaveLength(5);
    expect(new Set(PAID_TRADE.map((i) => i.buyer)).size).toBe(4);
  });

  it('every invoice number, date and payment date is present', () => {
    for (const i of PAID_TRADE) {
      expect(i.invoiceNumber).toMatch(/^INV-\d{4}$/);
      expect(i.invoiceDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(i.fullyPaidOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(i.fullyPaidOn) >= new Date(i.invoiceDate)).toBe(true);
      expect(i.grade).toBe('verified');
    }
  });

  it('each invoice adds up line by line to its own net total', () => {
    for (const i of PAID_TRADE) {
      const built =
        i.bedLineNetAud + i.facilitationNetAud + i.freightChargedNetAud + i.otherNetAud - i.writtenOffNetAud;
      expect(built).toBe(i.totalNetAud);
    }
  });

  it('each bed line is the unit price times the beds', () => {
    for (const i of PAID_TRADE) expect(i.beds * i.bedUnitPriceAud).toBe(i.bedLineNetAud);
  });

  it('anything written off or absorbed says what it was', () => {
    for (const i of PAID_TRADE) {
      if (i.writtenOffNetAud > 0) expect(i.writtenOffDetail && i.writtenOffDetail.length > 25).toBe(true);
      if (i.absorbedNotBilledAud > 0) expect(i.absorbedDetail && i.absorbedDetail.length > 25).toBe(true);
      if (i.otherNetAud > 0) expect(i.otherDetail && i.otherDetail.length > 10).toBe(true);
    }
  });

  it('keeps value deducted on the invoice apart from value quoted and zeroed', () => {
    expect(WRITTEN_OFF_NET_AUD).toBe(14_190);
    expect(ABSORBED_NOT_BILLED_AUD).toBe(3_200);
    expect(VALUE_FOREGONE_AUD).toBe(17_390);
    // Only the deducted half may change an invoice total.
    for (const i of PAID_TRADE) {
      expect(i.totalNetAud + i.writtenOffNetAud).toBeGreaterThanOrEqual(i.totalNetAud);
      expect(i.absorbedNotBilledAud).toBeLessThanOrEqual(i.bedLineNetAud);
    }
  });

  it('the totals are the ones the slide prints', () => {
    expect(BEDS_PAID_FOR).toBe(320);
    expect(PAID_INCL_GST_AUD).toBe(273_966);
    expect(PAID_NET_AUD).toBe(247_770);
    expect(BED_REVENUE_NET_AUD).toBe(197_060);
  });
});

describe('facilitation is trade, not an overhead line invented for the ask', () => {
  it('was billed and settled at $50,000 across three of the four buyers', () => {
    expect(FACILITATION_PAID_NET_AUD).toBe(50_000);
    expect(PAID_TRADE.filter((i) => i.facilitationNetAud > 0)).toHaveLength(4);
    expect(new Set(PAID_TRADE.filter((i) => i.facilitationNetAud > 0).map((i) => i.buyer)).size).toBe(3);
  });

  it('every facilitation line says what the buyer was actually paying for', () => {
    for (const i of PAID_TRADE) {
      expect(i.facilitationDetail.length).toBeGreaterThan(10);
      if (i.facilitationNetAud > 0) expect(i.facilitationDetail.length).toBeGreaterThan(40);
    }
  });
});

describe('the price a buyer paid is never rounded to the list price', () => {
  it('runs from $370 to $800 and ends above list', () => {
    const paid = PRICE_LADDER.map((p) => p.perBed);
    expect(Math.min(...paid)).toBe(370);
    expect(Math.max(...paid)).toBe(800);
    expect(paid[paid.length - 1]).toBeGreaterThan(BED_PRICE_AUD);
  });

  it('is in invoice-date order, so the ladder is not rearranged to flatter it', () => {
    const dates = PRICE_LADDER.map((p) => p.when);
    expect([...dates].sort()).toEqual(dates);
  });

  it('names the product as invoiced, including the Centrecorp line nobody may correct', () => {
    const c = PAID_TRADE.find((i) => i.invoiceNumber === 'INV-0291');
    expect(c?.productAsInvoiced).toContain('Weave Bed v2.3');
    expect(c?.note).toMatch(/Stretch Beds/);
    expect(SRC).toMatch(/Do not correct the invoice/);
  });

  it('says the Basket Bed price does not describe what Goods sells now', () => {
    for (const i of PAID_TRADE.filter((x) => x.productAsInvoiced.includes('Basket Bed'))) {
      expect(i.beds * i.bedUnitPriceAud).toBeLessThan(i.beds * BED_PRICE_AUD);
    }
    expect(PAID_TRADE[0].note).toMatch(/discontinued/);
  });
});

describe('what a buyer still owes is on the same page as what they paid', () => {
  it('carries the outstanding ALIVE invoice with its due date', () => {
    expect(OUTSTANDING_FROM_BUYERS.amountInclGstAud).toBe(66_000);
    expect(OUTSTANDING_FROM_BUYERS.invoiceNumber).toBe('INV-0341');
    expect(OUTSTANDING_FROM_BUYERS.what).toMatch(/No beds/);
  });

  it('is not counted as bed trade', () => {
    expect(PAID_TRADE.some((i) => i.invoiceNumber === OUTSTANDING_FROM_BUYERS.invoiceNumber)).toBe(false);
  });
});

describe('recorded demand is held apart from trade, and graded honestly', () => {
  it('is 778 beds, and 107 paid beds are excluded so nothing is counted twice', () => {
    expect(RECORDED_DEMAND_BEDS).toBe(778);
    expect(RECORDED_DEMAND.some((d) => d.beds === 107)).toBe(false);
  });

  it('has exactly one record with a person and a way of paying', () => {
    expect(DEMAND_WITH_MONEY_NAMED).toHaveLength(1);
    expect(DEMAND_WITH_MONEY_NAMED[0].askedBy).toBe('Dianne Stokes');
    expect(OWNED_DEMAND_BEDS).toBe(20);
    expect(CONVERSATION_BEDS).toBe(758);
  });

  it('grades everything else unverified and says why', () => {
    for (const d of needsSecondSource()) expect(d.note && d.note.length > 40).toBe(true);
    expect(needsSecondSource()).toHaveLength(RECORDED_DEMAND.length - 1);
  });

  it('carries the Groote status, because 500 beds is most of the total', () => {
    const g = RECORDED_DEMAND[0];
    expect(g.place).toBe('Groote Archipelago');
    expect(g.beds).toBe(500);
    expect(g.note).toMatch(/exploring/);
    expect(g.beds / RECORDED_DEMAND_BEDS).toBeGreaterThan(0.6);
  });

  it('says who asked and what rule they gave, for every record', () => {
    for (const d of RECORDED_DEMAND) {
      expect(d.askedBy.length).toBeGreaterThan(3);
      expect(d.rule.length).toBeGreaterThan(4);
      expect(d.heardVia.length).toBeGreaterThan(4);
    }
  });
});

describe('the two claim ceilings travel together', () => {
  it('forbid adding invoiced beds to deployed beds', () => {
    expect(TRADE_CLAIM_CEILING).toMatch(/never added together/);
    expect(TRADE_CLAIM_CEILING).toMatch(/forward order/);
  });

  it('forbid demand being shown as a pipeline or as dollars', () => {
    expect(DEMAND_CLAIM_CEILING).toMatch(/not an order/);
    expect(DEMAND_CLAIM_CEILING).toMatch(/pipeline/);
    expect(DEMAND_CLAIM_CEILING).toMatch(/converted to dollars/);
  });

  it('keep the unusable buyer table out until its key is fixed', () => {
    expect(SRC).toMatch(/postcode 4895/);
    expect(SRC).toMatch(/Nothing from that table is used/);
  });

  it('name the source of each half so an assessor can check it', () => {
    expect(SRC).toMatch(/ABN 21 591 780 066/);
    expect(SRC).toMatch(/community_demand/);
  });
});

describe('no writing tells in the prose this module carries', () => {
  it('has no em dashes', () => {
    expect(SRC).not.toMatch(/—/);
  });

  it('never says co-design', () => {
    expect(SRC.toLowerCase()).not.toMatch(/co-design/);
  });
});

describe('the Centrecorp reconciliation, which Q10 owed', () => {
  it('ties every paid bed to a batch, with nothing missing', () => {
    for (const r of CENTRECORP_RECONCILIATION) {
      expect(r.batchUnits).toBe(r.bedsInvoiced);
      expect(r.split.reduce((n, x) => n + x.units, 0)).toBe(r.batchUnits);
    }
  });

  it('matches the invoices it reconciles', () => {
    for (const r of CENTRECORP_RECONCILIATION) {
      const inv = PAID_TRADE.find((i) => i.invoiceNumber === r.invoiceNumber);
      expect(inv, `${r.invoiceNumber} must be in PAID_TRADE`).toBeDefined();
      expect(inv!.beds).toBe(r.bedsInvoiced);
      expect(inv!.buyer).toBe('Centrecorp Foundation');
    }
  });

  it('is 167 paid, 147 deployed and 20 waiting', () => {
    expect(CENTRECORP_BEDS_PAID).toBe(167);
    expect(CENTRECORP_BEDS_DEPLOYED).toBe(147);
    expect(CENTRECORP_BEDS_READY).toBe(20);
  });

  it('keeps the two 147s apart, because they share a number and not a set of beds', () => {
    // Utopia's 147 includes 8 beds from batch GB0-152 that Centrecorp never paid for,
    // and excludes the 8 Centrecorp beds deployed at Alice Springs.
    expect(UTOPIA_REGISTER_UNITS).toBe(CENTRECORP_BEDS_DEPLOYED);
    const utopiaFromCentrecorp = CENTRECORP_RECONCILIATION.flatMap((r) => r.split)
      .filter((x) => x.place === 'Utopia Homelands')
      .reduce((n, x) => n + x.units, 0);
    expect(utopiaFromCentrecorp).toBe(139);
    expect(utopiaFromCentrecorp).not.toBe(UTOPIA_REGISTER_UNITS);
    expect(SRC).toMatch(/different 147/);
  });

  it('names 130 as an unpaid quote and never as a delivery', () => {
    expect(CENTRECORP_QUOTED_UNPAID).toBe(130);
    expect(CENTRECORP_RECONCILIATION.some((r) => r.bedsInvoiced === 130)).toBe(false);
    expect(SRC).toMatch(/QU-0014/);
    expect(SRC).toMatch(/has not been paid/);
  });

  it('the printable line says both halves', () => {
    expect(CENTRECORP_LINE).toContain('167');
    expect(CENTRECORP_LINE).toContain('147');
    expect(CENTRECORP_LINE).toContain('20');
  });

  it('says the register is counted in units, because a row can carry more than one', () => {
    expect(SRC).toMatch(/UNITS, not rows/);
  });
});
