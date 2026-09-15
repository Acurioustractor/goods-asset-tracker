import { describe, expect, it } from 'vitest';
import { FACILITY_ALLOWANCE_AUD, FACILITY_MODULES, MODULES_HIGH_AUD, MODULES_LOW_AUD } from './facility-modules';
import { PAID_INVOICES, PAID_INVOICE_BEDS, PAID_INVOICE_INCL_GST_AUD, PAID_INVOICE_NET_AUD } from './paid-trade';
import { GRANTS_RECEIVED } from './grants-received';
import { BREAK_EVEN_BEDS, FACILITY_CAPACITY_BEDS, PLAN_BEDS, RUNNING_COST_AUD } from './the-year';
import { PAID_AUD, PAID_BEDS } from './story-questions';
import { BUYERS } from './pitch-chapters';
import { RAISE } from './model-placemat';

describe('facility modules', () => {
  it('sum to the Q6 totals and sit under the planning allowance', () => {
    expect(MODULES_LOW_AUD).toBe(95_767);
    expect(MODULES_HIGH_AUD).toBe(142_467);
    expect(FACILITY_ALLOWANCE_AUD).toBe(RAISE.qbeAud / RAISE.facilities);
    expect(MODULES_HIGH_AUD).toBeLessThan(FACILITY_ALLOWANCE_AUD);
    for (const m of FACILITY_MODULES) expect(m.highAud).toBeGreaterThanOrEqual(m.lowAud);
  });
});

describe('paid trade', () => {
  it('adds up to the published paid trade, in beds and in money', () => {
    expect(PAID_INVOICE_BEDS).toBe(PAID_BEDS);
    expect(PAID_INVOICE_INCL_GST_AUD).toBe(PAID_AUD);
    expect(PAID_INVOICE_NET_AUD).toBe(247_770);
    expect(PAID_INVOICES).toHaveLength(5);
  });
  it('agrees with the buyer rows the site prints', () => {
    for (const row of BUYERS.rows) {
      const name = row.buyer.split(',')[0].replace("Mala'la Health Service", "Mala'la Health Service Aboriginal Corporation");
      const beds = PAID_INVOICES.filter((i) => i.buyer.startsWith(name)).reduce((n, i) => n + i.beds, 0);
      expect(beds, row.buyer).toBe(row.beds);
    }
  });
});

describe('grants received', () => {
  it('names a basis for every line and prints no single total', () => {
    for (const g of GRANTS_RECEIVED) expect(['xero', 'row']).toContain(g.basis);
    expect(GRANTS_RECEIVED.find((g) => g.funder === 'Snow Foundation')?.amountAud).toBe(493_130);
  });
});

describe('the year', () => {
  it('holds the break-even, the capacity and the plan the applications state', () => {
    expect(RUNNING_COST_AUD).toBe(251_224);
    expect(BREAK_EVEN_BEDS).toBe(874);
    expect(FACILITY_CAPACITY_BEDS).toBe(1152);
    expect(PLAN_BEDS.toJune2027).toBe(RAISE.bedsYearOne);
    expect(PLAN_BEDS.toJune2028).toBe(BREAK_EVEN_BEDS);
  });
});
