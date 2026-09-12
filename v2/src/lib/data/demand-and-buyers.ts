/**
 * DEMAND AND BUYERS: what somebody actually paid for, and what is still a conversation.
 *
 * Same discipline as `rhd-problem.ts` and the other three problem modules. Every figure carries
 * what it counts, the date, where it can be checked and a grade.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS MODULE EXISTS
 * ---------------------------------------------------------------------------
 * Two numbers about demand were being carried side by side and read as the same kind of thing.
 * 320 beds have been invoiced and paid for, and a set of further beds is recorded as wanted. Only
 * the first is trade.
 *
 * SUPERSEDED, 11 September 2026: the recorded beds MUST NEVER BE SUMMED AND STATED. The records are
 * scoped to different populations, so a total of them is not a quantity of anything. Present acts
 * instead, strongest rung first: money moved, money named, an organisation asked, a person asked,
 * raised in a meeting. `who-has-asked.ts` is the module that does that and is the one to read from.
 * The sums below survive only so this module can say which record is most of what is written down,
 * and they are never published.
 *
 * The gap between a paid bed and a recorded one is the work, and it has a price somebody has
 * already paid. Across the four buyers, $50,000 of community build and program-support time was
 * billed and settled alongside the beds. That is the evidence for facilitation money.
 *
 * ---------------------------------------------------------------------------
 * WHAT IS DELIBERATELY NOT HERE
 * ---------------------------------------------------------------------------
 * The shared project's buyer table holds roughly 4,562 organisation rows and cannot be keyed by
 * community. Palm Island's row in `goods_communities` carries postcode 4895, so a lookup for Palm
 * Island returns Cooktown organisations. Nothing from that table is used until the key is fixed.
 *
 * The register's 540 deployed beds counts what reached a community, including prototypes and
 * gifted beds. It is a different count from the invoice record and the two are never added.
 *
 * ---------------------------------------------------------------------------
 * ONE NAMING TRAP, ALREADY RULED
 * ---------------------------------------------------------------------------
 * Centrecorp's INV-0291 reads "Goods Weave Bed v2.3". Those are Stretch Beds. The line name was
 * held steady across the Centrecorp paper trail on purpose so their finance team sees the same
 * description invoice to invoice (Ben, 2 August 2026). Do not correct the invoice, and do not
 * read it as evidence a Weave Bed was ever produced at scale.
 */

export type TradeGrade = 'verified' | 'workpaper' | 'unverified';

/** Every amount in this module is Australian dollars. */
export interface PaidInvoice {
  /** Xero invoice number, which is how an assessor checks it. */
  invoiceNumber: string;
  buyer: string;
  /** The community the beds went to, where the invoice or its delivery record names one. */
  forPlace: string;
  invoiceDate: string;
  fullyPaidOn: string;
  /** Beds on this invoice, at the unit price actually charged. */
  beds: number;
  bedUnitPriceAud: number;
  bedLineNetAud: number;
  /** Community build, workshop or program-support time billed on the same invoice. */
  facilitationNetAud: number;
  facilitationDetail: string;
  /** Freight charged to the buyer as its own line. */
  freightChargedNetAud: number;
  /** Value deducted on the face of the invoice, as a positive number. */
  writtenOffNetAud: number;
  writtenOffDetail?: string;
  /** Value quoted on a line and then zeroed, so it never entered the total. */
  absorbedNotBilledAud: number;
  absorbedDetail?: string;
  /** Anything on the invoice that is not a bed, facilitation or freight. */
  otherNetAud: number;
  otherDetail?: string;
  totalNetAud: number;
  totalPaidInclGstAud: number;
  productAsInvoiced: string;
  grade: TradeGrade;
  note?: string;
}

const XERO = 'Xero, Nicholas Marchesi sole trader, ABN 21 591 780 066. Read 11 September 2026.';

/**
 * The claim ceiling for this area, as a constant.
 *
 * Read together with `DEMAND_CLAIM_CEILING`. Neither may travel without the other.
 */
export const TRADE_CLAIM_CEILING =
  'These are invoices raised and settled in one Xero organisation, the sole trader Goods trades ' +
  'through today. They are not consolidated accounts and they are not the asset register. Beds ' +
  'invoiced and beds deployed are two different counts of two different things and are never ' +
  'added together. Nothing here is a forward order: a paid invoice says what a buyer did, not ' +
  'what they will do next.';

/**
 * The four buyers with real paid trade, every line taken from the invoice.
 *
 * Ordered by invoice date, which is also the order the bed price moved.
 */
export const PAID_TRADE: readonly PaidInvoice[] = [
  {
    invoiceNumber: 'INV-0259',
    buyer: 'Centrecorp Foundation',
    forPlace: 'Utopia Homelands',
    invoiceDate: '2025-08-11',
    fullyPaidOn: '2025-09-04',
    beds: 60,
    bedUnitPriceAud: 370,
    bedLineNetAud: 22_200,
    facilitationNetAud: 12_000,
    facilitationDetail: 'Two bed-building workshops at $6,000 each, covering the community visit, working with Elders and young people on how the bed gets built locally, team time on the ground, transport and accommodation',
    freightChargedNetAud: 0,
    writtenOffNetAud: 0,
    absorbedNotBilledAud: 0,
    otherNetAud: 0,
    totalNetAud: 34_200,
    totalPaidInclGstAud: 37_620,
    productAsInvoiced: 'Goods Basket Bed v1.3',
    grade: 'verified',
    note: 'The Basket Bed is the first prototype. Sales are discontinued and the design is being open-sourced, so this price does not describe the product Goods sells now.',
  },
  {
    invoiceNumber: 'INV-0283',
    buyer: "Mala'la Health Service Aboriginal Corporation",
    forPlace: 'Maningrida',
    invoiceDate: '2025-10-21',
    fullyPaidOn: '2025-11-21',
    beds: 13,
    bedUnitPriceAud: 380,
    bedLineNetAud: 4_940,
    facilitationNetAud: 0,
    facilitationDetail: 'None billed',
    freightChargedNetAud: 0,
    writtenOffNetAud: 0,
    absorbedNotBilledAud: 3_200,
    absorbedDetail: 'Shipping was quoted at $3,200 on its own line and discounted in full, so Goods carried freight worth 65% of the bed line on a $4,940 order',
    otherNetAud: 0,
    totalNetAud: 4_940,
    totalPaidInclGstAud: 5_434,
    productAsInvoiced: 'Goods Basket Bed v2.1',
    grade: 'verified',
    note: 'This invoice is the clearest reason freight is now its own line, charged at cost to whoever buys the bed.',
  },
  {
    invoiceNumber: 'INV-0291',
    buyer: 'Centrecorp Foundation',
    forPlace: 'Utopia Homelands',
    invoiceDate: '2025-11-26',
    fullyPaidOn: '2026-02-03',
    beds: 107,
    bedUnitPriceAud: 560,
    bedLineNetAud: 59_920,
    facilitationNetAud: 18_000,
    facilitationDetail: 'Three bed-building workshops at $6,000 each, on the same scope as INV-0259',
    freightChargedNetAud: 0,
    writtenOffNetAud: 0,
    absorbedNotBilledAud: 0,
    otherNetAud: 0,
    totalNetAud: 77_920,
    totalPaidInclGstAud: 85_712,
    productAsInvoiced: 'Goods Weave Bed v2.3 - Utopia Homelands',
    grade: 'verified',
    note: 'These are Stretch Beds. The line name is held steady across the Centrecorp paper trail on purpose. The invoice took 69 days to settle, the longest of the five.',
  },
  {
    invoiceNumber: 'INV-0303',
    buyer: 'Homeland School Company',
    forPlace: 'Maningrida homelands',
    invoiceDate: '2026-05-18',
    fullyPaidOn: '2026-07-23',
    beds: 40,
    bedUnitPriceAud: 750,
    bedLineNetAud: 30_000,
    facilitationNetAud: 8_000,
    facilitationDetail: 'One Goods on Country program-support trip to train, build, test, document and make with community, including travel and accommodation',
    freightChargedNetAud: 5_900,
    writtenOffNetAud: 14_190,
    writtenOffDetail: 'A Goods in Kind Partnership line of minus $14,190, which is 27% of the invoice before it was applied',
    absorbedNotBilledAud: 0,
    otherNetAud: 9_000,
    otherDetail: 'Two Indestructible Washing Machines v1.1 at $4,500 each',
    totalNetAud: 38_710,
    totalPaidInclGstAud: 44_000,
    productAsInvoiced: 'Goods Stretch Bed - Single Bed, Poles, Canvas',
    grade: 'verified',
    note: 'The only invoice carrying beds, a washer, facilitation and freight together, and the first at the $750 list price. These are the 40 beds pressed at our facility and assembled at Gamardi with young people.',
  },
  {
    invoiceNumber: 'INV-0342',
    buyer: 'ALIVE National Centre, University of Melbourne',
    forPlace: 'Communities under the Gathering the Parts program',
    invoiceDate: '2026-07-02',
    fullyPaidOn: '2026-08-20',
    beds: 100,
    bedUnitPriceAud: 800,
    bedLineNetAud: 80_000,
    facilitationNetAud: 12_000,
    facilitationDetail: 'Four half-shares of a bed-building workshop at $3,000 each, the buyer carrying half the cost of each visit',
    freightChargedNetAud: 0,
    writtenOffNetAud: 0,
    absorbedNotBilledAud: 0,
    otherNetAud: 0,
    totalNetAud: 92_000,
    totalPaidInclGstAud: 101_200,
    productAsInvoiced: 'Goods Stretch Bed Single',
    grade: 'verified',
    note: 'The largest single bed order paid to date, and the only one above the $750 list price.',
  },
];

/**
 * Money owed by a buyer on this list, which a funder reading the receivables would find first.
 *
 * Held here so it is never left off a buyer slide by accident.
 */
export const OUTSTANDING_FROM_BUYERS = {
  invoiceNumber: 'INV-0341',
  buyer: 'ALIVE National Centre, University of Melbourne',
  amountInclGstAud: 66_000,
  dueDate: '2026-07-30',
  what: 'A twelve-month Empathy Ledger storytelling program at $5,000 a month. No beds on this invoice.',
  status: 'Authorised and unpaid as at 11 September 2026, past its due date.',
  grade: 'verified' as TradeGrade,
  note: 'ALIVE has paid in full for its 100 beds under INV-0342. The two invoices were raised the same day and only this one is outstanding, so a receivables list reads worse than the bed trade does.',
} as const;

export interface DemandRecord {
  place: string;
  beds: number;
  /** The person or organisation whose words the record came from. */
  askedBy: string;
  /** The rule the community stated, in their framing, where there is one. */
  rule: string;
  /** Where the record came from. */
  heardVia: string;
  /** Is there a stated way of paying for these beds? */
  moneyNamed: boolean;
  grade: TradeGrade;
  note?: string;
}

/**
 * The claim ceiling for recorded demand. Read with `TRADE_CLAIM_CEILING`.
 */
export const DEMAND_CLAIM_CEILING =
  'Recorded demand is what somebody said they wanted, written down with a date and a name where ' +
  'there was one. It is not an order, not a letter of intent and not revenue. It may not be ' +
  'presented as a pipeline, converted to dollars on a slide, or added to beds already sold. One ' +
  'record on this list has money named against it.';

/**
 * Open recorded demand, from `community_demand` in the Goods v2 project, read 11 September 2026.
 *
 * Ordered largest first, which is also weakest first.
 */
export const RECORDED_DEMAND: readonly DemandRecord[] = [
  {
    place: 'Groote Archipelago',
    beds: 500,
    askedBy: 'Simone Grimmond, WHSAC',
    rule: 'None stated. The same conversation named 300 washing machines alongside the beds.',
    heardVia: 'Meeting',
    moneyNamed: false,
    grade: 'unverified',
    note: 'Logged as exploring, not requested, and it is 64% of all recorded demand on its own. Nothing has been quoted and no order has been discussed. It carries the whole number up and should never be shown without its status.',
  },
  {
    place: 'Utopia',
    beds: 150,
    askedBy: 'Utopia Homelands',
    rule: 'Beds for every child.',
    heardVia: 'Compendium',
    moneyNamed: false,
    grade: 'unverified',
    note: 'A real rule set by the community and the clearest denominator anyone has given us. No person is attached to the record and no funder has been named against it. Utopia is also the one place with a paid delivery behind it, 167 beds across two Centrecorp invoices.',
  },
  {
    place: 'Maningrida',
    beds: 65,
    askedBy: 'Homeland Schools Co.',
    rule: 'Beds for kids in the Maningrida homelands.',
    heardVia: 'Meeting',
    moneyNamed: false,
    grade: 'unverified',
    note: 'The only demand record whose counterparty has already paid Goods for beds, 40 of them at list price on INV-0303. That is a payment history, not a commitment to buy again.',
  },
  {
    place: 'Palm Island',
    beds: 40,
    askedBy: 'Palm Island Community Company',
    rule: 'None stated.',
    heardVia: 'Partner update',
    moneyNamed: false,
    grade: 'unverified',
    note: 'Palm Island is one of the two working choices for a QBE plant, so this record will be read as demand for that plant. It is a figure from a partner update and nothing more.',
  },
  {
    place: 'Tennant Creek',
    beds: 20,
    askedBy: 'Dianne Stokes',
    rule: 'Offered to self-fund the twenty.',
    heardVia: 'Community voice',
    moneyNamed: true,
    grade: 'verified',
    note: 'The only record on this list with a person and a way of paying. Dianne Stokes named the Pakkimjalki Kari washing machines in Warumungu, so this is a long relationship rather than a first conversation. No invoice has been raised and no date has been set.',
  },
  {
    place: 'Tennant Creek',
    beds: 3,
    askedBy: 'Norman Frank',
    rule: 'Three beds, in the maroon colourway.',
    heardVia: 'Community voice',
    moneyNamed: false,
    grade: 'unverified',
    note: 'The smallest record and the most specific. A named person who has chosen a colour is further along than five hundred beds with no status.',
  },
];

/** Beds invoiced and paid for, across the four buyers. */
export const BEDS_PAID_FOR = PAID_TRADE.reduce((n, i) => n + i.beds, 0);

/** What those invoices settled for, including GST, which is what landed in the bank. */
export const PAID_INCL_GST_AUD = PAID_TRADE.reduce((n, i) => n + i.totalPaidInclGstAud, 0);

/** The same trade excluding GST, which is what the P&L sees. */
export const PAID_NET_AUD = PAID_TRADE.reduce((n, i) => n + i.totalNetAud, 0);

/** Bed lines only, excluding GST. */
export const BED_REVENUE_NET_AUD = PAID_TRADE.reduce((n, i) => n + i.bedLineNetAud, 0);

/**
 * Community build and program-support time billed and settled alongside the beds.
 *
 * This is the number that makes the facilitation ask something buyers have already priced.
 */
export const FACILITATION_PAID_NET_AUD = PAID_TRADE.reduce((n, i) => n + i.facilitationNetAud, 0);

/**
 * Freight and partnership value Goods carried rather than charged.
 *
 * Two different things, kept apart on purpose. The Homeland in-kind line came off the face of the
 * invoice. The Mala'la shipping line was quoted and zeroed, so it never entered any total and only
 * the quote records what it was worth.
 */
export const WRITTEN_OFF_NET_AUD = PAID_TRADE.reduce((n, i) => n + i.writtenOffNetAud, 0);
export const ABSORBED_NOT_BILLED_AUD = PAID_TRADE.reduce((n, i) => n + i.absorbedNotBilledAud, 0);
export const VALUE_FOREGONE_AUD = WRITTEN_OFF_NET_AUD + ABSORBED_NOT_BILLED_AUD;

/**
 * Open recorded beds. Excludes the 107 already invoiced and paid on INV-0291.
 *
 * INTERNAL ONLY. This is not a demand figure and must never reach a funder, a slide or a page. It
 * adds records scoped to different populations, so it measures nothing. It exists so the module can
 * say that one record is most of what is written down. See `who-has-asked.ts` for what is published.
 */
export const RECORDED_DEMAND_BEDS = RECORDED_DEMAND.reduce((n, d) => n + d.beds, 0);

/** Recorded demand with a named person and a stated way of paying. */
export const DEMAND_WITH_MONEY_NAMED = RECORDED_DEMAND.filter((d) => d.moneyNamed);

/** Beds in that state. */
export const OWNED_DEMAND_BEDS = DEMAND_WITH_MONEY_NAMED.reduce((n, d) => n + d.beds, 0);

/** Beds that are a conversation and nothing more. INTERNAL ONLY, for the same reason as above. */
export const CONVERSATION_BEDS = RECORDED_DEMAND_BEDS - OWNED_DEMAND_BEDS;

/** What each buyer paid per bed, in the order the price moved. */
export const PRICE_LADDER = PAID_TRADE.map((i) => ({
  when: i.invoiceDate,
  buyer: i.buyer,
  perBed: i.bedUnitPriceAud,
  product: i.productAsInvoiced,
}));

/** Where the trade record can be checked. */
export const TRADE_SOURCE = XERO;

/** Where the demand record can be checked. */
export const DEMAND_SOURCE =
  'Table `community_demand`, Goods v2 Supabase project cwsyhpiuepvdjtxaozwf. Read 11 September 2026. ' +
  'Seven rows, of which one is the allocated and paid Centrecorp order and is excluded here.';

/** Records still needing a second source before they may be printed without their status. */
export function needsSecondSource(): readonly DemandRecord[] {
  return RECORDED_DEMAND.filter((d) => d.grade !== 'verified');
}

/* ---------------------------------------------------------------------------
 * THE CENTRECORP RECONCILIATION, closed 11 September 2026
 * ---------------------------------------------------------------------------
 * Q10 promised this and it is now done. Three numbers were in circulation for
 * Centrecorp: 167 on the invoices, 147 in the register and 130 on deck slide S12.
 *
 * Every bed Centrecorp paid for has a register row. Nothing is missing.
 *
 *   INV-0259, 60 Basket Beds   -> batch GB0-148, 60 units, all deployed at Utopia
 *   INV-0291, 107 Stretch Beds -> batch GB0-156, 107 units exactly, split three ways:
 *                                 79 deployed at Utopia
 *                                  8 deployed at Alice Springs
 *                                 20 made and READY at Alice Springs, not yet deployed
 *
 * So Centrecorp bought 167 beds and 147 of them are deployed. The 20 that are ready
 * are the whole of the gap.
 *
 * THE TRAP. Utopia's community total is also 147, and it is a different 147. Utopia
 * holds 60 Basket plus 79 Stretch from the Centrecorp batches, plus 8 Stretch from
 * batch GB0-152, which Centrecorp did not pay for. The two 147s share a number and
 * not a single set of beds. Never treat one as evidence for the other.
 *
 * 130 is the quantity on quote QU-0014 from May 2026, which has not been paid.
 * Nothing in the register or the ledger is 130.
 *
 * GB0-152 is 15 units, 8 at Utopia and 7 at Tennant Creek, and no invoice in this
 * module accounts for it. That is the next thread, and it is not Centrecorp's.
 *
 * Counting note: the register is counted in UNITS, not rows, because one row can
 * carry a quantity above 1. Rows and units agree on all three batches here.
 */

export interface BatchSplit {
  place: string;
  status: 'deployed' | 'ready';
  units: number;
}

export interface InvoiceToRegister {
  invoiceNumber: string;
  bedsInvoiced: number;
  batch: string;
  batchUnits: number;
  split: readonly BatchSplit[];
}

export const CENTRECORP_RECONCILIATION: readonly InvoiceToRegister[] = [
  {
    invoiceNumber: 'INV-0259',
    bedsInvoiced: 60,
    batch: 'GB0-148',
    batchUnits: 60,
    split: [{ place: 'Utopia Homelands', status: 'deployed', units: 60 }],
  },
  {
    invoiceNumber: 'INV-0291',
    bedsInvoiced: 107,
    batch: 'GB0-156',
    batchUnits: 107,
    split: [
      { place: 'Utopia Homelands', status: 'deployed', units: 79 },
      { place: 'Alice Springs', status: 'deployed', units: 8 },
      { place: 'Alice Springs', status: 'ready', units: 20 },
    ],
  },
];

/** Beds Centrecorp paid for, across both invoices. */
export const CENTRECORP_BEDS_PAID = CENTRECORP_RECONCILIATION.reduce((n, r) => n + r.bedsInvoiced, 0);

/** Of those, the ones a household has. */
export const CENTRECORP_BEDS_DEPLOYED = CENTRECORP_RECONCILIATION.flatMap((r) => r.split)
  .filter((x) => x.status === 'deployed')
  .reduce((n, x) => n + x.units, 0);

/** Made, counted and waiting. This is the whole of the gap. */
export const CENTRECORP_BEDS_READY = CENTRECORP_BEDS_PAID - CENTRECORP_BEDS_DEPLOYED;

/** Utopia's community total, which is a different 147 from the Centrecorp one. */
export const UTOPIA_REGISTER_UNITS = 147;

/**
 * The quantity on quote QU-0014, May 2026. Unpaid. It is printed on deck slide S12
 * as paid and delivered, which is the error this reconciliation exists to correct.
 */
export const CENTRECORP_QUOTED_UNPAID = 130;

/** The line that may be printed once Ben rules. */
export const CENTRECORP_LINE =
  'Centrecorp bought and paid for 167 beds. 147 are in households and 20 are made and waiting at ' +
  'Alice Springs.';

/* ---------------------------------------------------------------------------
 * FREIGHT, what was actually charged and actually paid, 11 September 2026
 * ---------------------------------------------------------------------------
 * The live model carries $100 a bed and the repo cost engine defaults to $150, and the choice
 * moves the break-even the deck prints by 122 beds. Both were estimates. These are the only real
 * freight figures Goods has, and all three are Maningrida.
 *
 *   CHARGED, 40 beds     INV-0303 billed Homeland $5,900 net for delivery ex Brisbane through
 *                        Darwin to Maningrida. Two washing machines rode on the same invoice, so
 *                        $147.50 a bed is the ceiling and the true per-bed number is under it.
 *   QUOTED, 13 beds      INV-0283 quoted Mala'la $3,200 of shipping, which is $246.15 a bed, then
 *                        discounted it in full. The buyer paid nothing and Goods carried it.
 *   PAID TO A CARRIER    One Sea Swift bill, $2,322.17 net, 29 September 2025, in the window of
 *                        the Mala'la run. Its only line reads ".", so it cannot be proven to carry
 *                        those 13 beds alone. If it did, that run cost $178.63 a bed to move.
 *
 * WHAT THIS SETTLES. The two figures were never in conflict, and calling them one was my error.
 * The live sheet's Open Item 9 reads "$100 factory and $50 community, as entered on the input
 * page", which sums to $150. A leg was being compared against a total. $150 is the all-up number,
 * it is what both sources say, and it is within $2.50 of what a real 40-bed run was charged.
 *
 * WHAT IT DOES NOT SETTLE. Freight per bed falls with volume: $147.50 across 40 beds against
 * $246.15 quoted across 13, to the same place. A single constant misstates both ends, and one
 * destination is not a national rate.
 *
 * WHERE IT ACTUALLY BITES. Under the ruled price model the buyer pays freight at cost as its own
 * line, so the printed break-even is 628 beds and this constant never enters it. Where Goods
 * carries freight the right figure is 918, because 796 was computed on the factory leg alone. That
 * case is a sensitivity and not the plan.
 *
 * STILL OWED. Open Item 9 in the live sheet wants delivery-route quotes and a named payer, and it
 * wants freight recovery shown once alongside freight cost. Nic and Ben own it.
 */

export interface FreightPoint {
  what: string;
  beds: number;
  amountNetAud: number;
  perBedAud: number;
  source: string;
  grade: TradeGrade;
  caveat: string;
}

export const FREIGHT_EVIDENCE: readonly FreightPoint[] = [
  {
    what: 'Charged to Homeland School Company, Brisbane to Darwin to Maningrida',
    beds: 40,
    amountNetAud: 5_900,
    perBedAud: 147.5,
    source: 'INV-0303, 18 May 2026, settled 23 July 2026',
    grade: 'verified',
    caveat: 'Two washing machines were on the same invoice, so $147.50 is a ceiling for the per-bed share.',
  },
  {
    what: "Quoted to Mala'la Health Service for Maningrida, then discounted in full",
    beds: 13,
    amountNetAud: 3_200,
    perBedAud: 246.15,
    source: 'INV-0283, 21 October 2025',
    grade: 'verified',
    caveat: 'The buyer paid none of it. It records what the run was worth, not what anyone was charged.',
  },
  {
    what: "Paid to Sea Swift in the window of the Mala'la run",
    beds: 13,
    amountNetAud: 2_322.17,
    perBedAud: 178.63,
    source: 'Bill 5732 2163 022, 29 September 2025, settled 1 October 2025',
    grade: 'unverified',
    caveat: 'The bill has a single line reading ".", so it cannot be shown to carry only those 13 beds. Treat the per-bed figure as an upper bound on that run.',
  },
];

/** The figure to use where one number is needed. */
export const FREIGHT_PER_BED_AUD = 150;

/** The factory leg. It is half of the pair, never an alternative to the total. */
export const FREIGHT_FACTORY_LEG_AUD = 100;

/** The community leg. */
export const FREIGHT_COMMUNITY_LEG_AUD = 50;

export const FREIGHT_RULING =
  'Freight is a route and a volume before it is a rate. The all-up figure is $150 a bed, being $100 ' +
  'for the factory leg and $50 for the community leg, and both sources already agree on it. It is ' +
  'within $2.50 of what a real 40-bed run to Maningrida was charged. Under the price model the buyer ' +
  'pays freight at cost on its own line, so break-even stays at 628 beds. Where Goods carries ' +
  'freight the figure is 918, because 796 used the factory leg alone.';
