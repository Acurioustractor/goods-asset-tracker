/**
 * The paid bed trade: five invoices, four buyers. Every line is copied from demand-and-buyers.ts
 * PAID_TRADE on the finance branch (`../goods-finance-wt`, read 16 September 2026), which takes each
 * figure from the Xero invoice. When that branch lands, import from it and delete this copy.
 * paid-trade.guards.test.ts holds the totals to PAID_BEDS and PAID_AUD in story-questions.ts.
 * Product names are as invoiced: INV-0291 says "Weave Bed v2.3" and those beds are Stretch Beds,
 * a line name kept on purpose across the Centrecorp paper trail.
 */

export interface PaidInvoiceLine {
  invoiceNumber: string;
  buyer: string;
  forPlace: string;
  invoiceDate: string;
  fullyPaidOn: string;
  beds: number;
  bedUnitPriceAud: number;
  productAsInvoiced: string;
  facilitationNetAud: number;
  freightChargedNetAud: number;
  otherNetAud: number;
  otherDetail?: string;
  writtenOffNetAud: number;
  totalNetAud: number;
  totalPaidInclGstAud: number;
}

export const PAID_INVOICES: readonly PaidInvoiceLine[] = [
  { invoiceNumber: 'INV-0259', buyer: 'Centrecorp Foundation', forPlace: 'Utopia Homelands', invoiceDate: '2025-08-11', fullyPaidOn: '2025-09-04', beds: 60, bedUnitPriceAud: 370, productAsInvoiced: 'Goods Basket Bed v1.3', facilitationNetAud: 12_000, freightChargedNetAud: 0, otherNetAud: 0, writtenOffNetAud: 0, totalNetAud: 34_200, totalPaidInclGstAud: 37_620 },
  { invoiceNumber: 'INV-0283', buyer: "Mala'la Health Service Aboriginal Corporation", forPlace: 'Maningrida', invoiceDate: '2025-10-21', fullyPaidOn: '2025-11-21', beds: 13, bedUnitPriceAud: 380, productAsInvoiced: 'Goods Basket Bed v2.1', facilitationNetAud: 0, freightChargedNetAud: 0, otherNetAud: 0, writtenOffNetAud: 0, totalNetAud: 4_940, totalPaidInclGstAud: 5_434 },
  { invoiceNumber: 'INV-0291', buyer: 'Centrecorp Foundation', forPlace: 'Utopia Homelands', invoiceDate: '2025-11-26', fullyPaidOn: '2026-02-03', beds: 107, bedUnitPriceAud: 560, productAsInvoiced: 'Goods Weave Bed v2.3 (Stretch Beds)', facilitationNetAud: 18_000, freightChargedNetAud: 0, otherNetAud: 0, writtenOffNetAud: 0, totalNetAud: 77_920, totalPaidInclGstAud: 85_712 },
  { invoiceNumber: 'INV-0303', buyer: 'Homeland School Company', forPlace: 'Maningrida homelands', invoiceDate: '2026-05-18', fullyPaidOn: '2026-07-23', beds: 40, bedUnitPriceAud: 750, productAsInvoiced: 'Goods Stretch Bed, single', facilitationNetAud: 8_000, freightChargedNetAud: 5_900, otherNetAud: 9_000, otherDetail: 'Two washing machines at $4,500 each', writtenOffNetAud: 14_190, totalNetAud: 38_710, totalPaidInclGstAud: 44_000 },
  { invoiceNumber: 'INV-0342', buyer: 'ALIVE National Centre', forPlace: 'Communities under the Gathering the Parts program', invoiceDate: '2026-07-02', fullyPaidOn: '2026-08-20', beds: 100, bedUnitPriceAud: 740, productAsInvoiced: 'Goods Stretch Bed Single', facilitationNetAud: 18_000, freightChargedNetAud: 0, otherNetAud: 0, writtenOffNetAud: 0, totalNetAud: 92_000, totalPaidInclGstAud: 101_200 },
];

export const PAID_INVOICE_BEDS = PAID_INVOICES.reduce((n, i) => n + i.beds, 0);
export const PAID_INVOICE_NET_AUD = PAID_INVOICES.reduce((n, i) => n + i.totalNetAud, 0);
export const PAID_INVOICE_INCL_GST_AUD = PAID_INVOICES.reduce((n, i) => n + i.totalPaidInclGstAud, 0);
