/**
 * WHAT HAS BEEN BOUGHT FOR THE LINE, invoice by invoice, each opened at source.
 *
 * Both Defy invoices below were read from the PDFs on 14 September 2026 and Nic wrote "all paid"
 * on the thread on 13 and 14 September. They close the press-against-panels decision on the
 * flat-pack route: leg panels are bought from Defy, tab sheets are pressed at The Harvest Plant.
 * The quotes QU0494 and QU0495 of 28 August (105 sheets and 8 bulka bags, options to the end of
 * the year) are superseded by these two paid invoices. Both are invoiced to A Curious Tractor,
 * which is where supply purchases still run pending the transfer into the charity.
 *
 * What is still open: the number of leg sets that come off one bought 800 by 1200 panel, which
 * Nic holds with Defy. Until it is known, the A$276 to make a bed stays provisional.
 */

export interface SupplyInvoice {
  id: string;
  supplier: string;
  supplierAbn: string;
  invoicedTo: string;
  issued: string;
  due: string;
  paid: string;
  reference: string;
  lines: readonly { what: string; qty: number; unitAud: number; discount?: string; amountExGstAud: number }[];
  subtotalExGstAud: number;
  discountAud: number;
  gstAud: number;
  totalAud: number;
  source: string;
}

export const DEFY_PANEL_INVOICES: readonly SupplyInvoice[] = [
  {
    id: 'INV-2021',
    supplier: 'Defy Manufacturing Pty Limited',
    supplierAbn: '48 644 178 423',
    invoicedTo: 'A Curious Tractor',
    issued: '2026-09-11',
    due: '2026-09-18',
    paid: '2026-09-13, per Nic on the thread',
    reference: '105 × 19mm panels (the quote reference); this invoice is the first 25',
    lines: [
      { what: '100% recycled HDPE panel, 19 mm Jungle Mix, 1200 × 2400 mm', qty: 25, unitAud: 446.1, discount: '20% for scale of order', amountExGstAud: 8922 },
      { what: 'Cutting into 800 × 1200 mm panels', qty: 25, unitAud: 20, amountExGstAud: 500 },
      { what: 'Palletising, 1200 × 1200 mm', qty: 2, unitAud: 60, amountExGstAud: 120 },
    ],
    subtotalExGstAud: 9542,
    discountAud: 2230.5,
    gstAud: 954.2,
    totalAud: 10496.2,
    source: 'Invoice INV-2021.pdf, Defy, read 14 September 2026',
  },
  {
    id: 'INV-2023',
    supplier: 'Defy Manufacturing Pty Limited',
    supplierAbn: '48 644 178 423',
    invoicedTo: 'A Curious Tractor',
    issued: '2026-09-14',
    due: '2026-09-21',
    paid: '2026-09-14, per Nic on the thread',
    reference: '60 × 19mm panels',
    lines: [
      { what: '100% recycled HDPE panel, 19 mm Jungle Mix, 1200 × 2400 mm', qty: 60, unitAud: 446.1, discount: '20% for scale of order', amountExGstAud: 21412.8 },
      { what: 'Cutting into 800 × 1200 mm panels', qty: 60, unitAud: 20, amountExGstAud: 1200 },
      { what: 'Palletising, 1200 × 1200 mm', qty: 4, unitAud: 60, amountExGstAud: 240 },
    ],
    subtotalExGstAud: 22852.8,
    discountAud: 5353.2,
    gstAud: 2285.28,
    totalAud: 25138.08,
    source: 'Invoice INV-2023.pdf, Defy, read 14 September 2026',
  },
];

export const PANELS_BOUGHT = DEFY_PANEL_INVOICES.reduce((n, inv) => n + (inv.lines[0]?.qty ?? 0), 0);
export const PANELS_EX_GST_AUD = DEFY_PANEL_INVOICES.reduce((n, inv) => n + inv.subtotalExGstAud, 0);
export const PANELS_INC_GST_AUD = DEFY_PANEL_INVOICES.reduce((n, inv) => n + inv.totalAud, 0);
/** One 1200 × 2400 sheet at list less the 20% scale discount, before cutting and palletising. */
export const PANEL_NET_UNIT_AUD = Math.round(446.1 * 0.8 * 100) / 100;

/** The shred side of the same thread, 28 August: about 450 kg a week and three weeks of stock. */
export const SHRED_NOTE =
  'Nic told Defy on 28 August that the line uses about 450 kg of shred a week with three weeks of stock in hand, which is where the 18 September planning date comes from. Defy attached the shred invoice the same day; its payment is not on the thread as read on 14 September.';
