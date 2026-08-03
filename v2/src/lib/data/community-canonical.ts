import { CANONICAL_ASSETS, WASHERS_IN_COMMUNITY_BY_COMMUNITY } from './asset-canonical';

/**
 * Per-community canonical bed counts — the layer BELOW asset-canonical.ts.
 *
 * asset-canonical.ts freezes the headline totals (540/177/363) and
 * check-asset-drift.mjs guards them against the live register. But every
 * counting error that has actually reached (or nearly reached) an external
 * document happened one level down, per community: Community OS claiming
 * Utopia = 169 when the register and ruling say 147; the Maningrida split
 * recorded as 0 Basket / 58 Stretch when INV-0303 settled 18/40; Weave Bed
 * rows re-appearing under stretch counts. Those rulings lived only in
 * wiki/investor/10-community-counts.md and session memory — nothing failed
 * when a surface contradicted them.
 *
 * This module puts the per-community rulings in code. Each entry carries its
 * ruling provenance so a drift failure can cite the ruling, not just the
 * number. scripts/check-register-integrity.mjs asserts the live register
 * against this map line by line; community-canonical.guards.test.ts asserts
 * this map sums exactly to CANONICAL_ASSETS, so the two canon layers cannot
 * drift apart.
 *
 * `registerName` is the exact string in the register's `community` column
 * (the register's real column is `product`/`community`, not `type`).
 */
/**
 * A line on a real Xero invoice, recorded so a bed count can be traced to paper.
 *
 * THE DISTINCTION THAT KEEPS BEING LOST, and the reason this type exists:
 * the register counts ASSETS IN COMMUNITY, an invoice records A SALE. They are
 * not the same measure and they are not supposed to tie. Beds and machines reach
 * a community as prototypes, in-kind, replacements and earlier deliveries that
 * never appear as a sold line, so the register is always the larger number.
 *
 * Maningrida is the worked example. The register holds 18 Basket, 40 Stretch and
 * 8 washers. The invoices evidence 13 Basket, 40 Stretch and 2 washers. The
 * washer gap is already explained in asset-canonical.ts ("8 = 6 existing + 2
 * new") and INV-0303 is exactly those 2 new, which confirms the pattern rather
 * than contradicting it. The 5 uninvoiced Basket Beds are the same shape and
 * have not been individually traced.
 *
 * So: quote the REGISTER for what is in community, quote the INVOICE for what was
 * sold and what it fetched. Never present one as a check on the other.
 */
export interface CommunityInvoiceLine {
  /** Xero invoice number, e.g. INV-0303 */
  invoice: string;
  /** Xero contact. Often NOT the community's name, which is why searches miss it. */
  contact: string;
  /** Invoice date, ISO. */
  date: string;
  /** Xero status. DELETED and VOIDED lines are evidence of nothing. */
  status: 'PAID' | 'AUTHORISED' | 'VOIDED' | 'DELETED';
  /** Line description, verbatim from the invoice. */
  description: string;
  quantity: number;
  unitAmount: number;
  /** Anything that makes the line hard to find or easy to misread. */
  note?: string;
}

export interface CommunityBedCanon {
  /** communities.id slug */
  id: string;
  /** exact `community` value on register rows */
  registerName: string;
  basketBeds: number;
  stretchBeds: number;
  /** where the number was settled — cited verbatim by the drift judge */
  ruling: string;
}

export const COMMUNITY_BED_CANON: readonly CommunityBedCanon[] = [
  {
    id: 'utopia',
    registerName: 'Utopia Homelands',
    basketBeds: 60,
    stretchBeds: 87,
    ruling: 'Ben 2026-07-19: Utopia = 147 confirmed; Community OS 169 is wrong (wiki/investor/10-community-counts.md)',
  },
  {
    id: 'tennant-creek',
    registerName: 'Tennant Creek',
    basketBeds: 130,
    stretchBeds: 30,
    ruling: 'Ben 2026-07-19: +1 Stretch to the youth centre, register row GB0-160-1 (total 160)',
  },
  {
    id: 'palm-island',
    registerName: 'Palm Island',
    basketBeds: 131,
    stretchBeds: 0,
    ruling: 'Reconciled 2026-07-19: register = OS = 131, all Basket',
  },
  {
    id: 'maningrida',
    registerName: 'Maningrida',
    basketBeds: 18,
    stretchBeds: 40,
    ruling: 'INV-0303 ruling: 40 Stretch FINAL, 18 Basket; OS split 0/58 was wrong',
  },
  {
    id: 'kalgoorlie',
    registerName: 'Kalgoorlie',
    basketBeds: 20,
    stretchBeds: 0,
    ruling: 'Reconciled 2026-07-19: register = OS = 20, all Basket',
  },
  {
    id: 'alice-springs',
    registerName: 'Alice Springs',
    basketBeds: 1,
    stretchBeds: 15,
    ruling: 'Reconciled 2026-07-19: 1 Basket / 15 Stretch (Oonchiumpa)',
  },
  {
    id: 'canberra',
    registerName: 'Canberra',
    basketBeds: 0,
    stretchBeds: 2,
    ruling: 'Reconciled 2026-07-19',
  },
  {
    id: 'mount-isa',
    registerName: 'Mount Isa',
    basketBeds: 2,
    stretchBeds: 0,
    ruling: 'Reconciled 2026-07-19',
  },
  {
    id: 'darwin',
    registerName: 'Darwin',
    basketBeds: 1,
    stretchBeds: 0,
    ruling: 'Reconciled 2026-07-19',
  },
  {
    id: 'kununurra',
    registerName: 'Kununurra',
    basketBeds: 0,
    stretchBeds: 2,
    ruling: 'Ben 2026-07-19: real delivery to Aunty Jean O’Reera, rows GB0-158-1/2 (Miriwoong country); story consent-held, counting is separate',
  },
  {
    id: 'katherine',
    registerName: 'Katherine',
    basketBeds: 0,
    stretchBeds: 1,
    ruling: 'Ben 2026-07-19: delivered by Nic, row GB0-159-1 (Jawoyn country)',
  },
] as const;

/** The only product names allowed on register rows. `Weave Bed` (or any
 *  weave_bed variant) is a known bad write — the product was discontinued and
 *  never produced at scale; rows carrying it should be stretch_bed. */
export const ALLOWED_REGISTER_PRODUCTS = ['Stretch Bed', 'Basket Bed', 'Washing Machine'] as const;

/**
 * The commercial paper trail, per community, where it has been traced.
 *
 * Kept OUT of COMMUNITY_BED_CANON on purpose: check-register-integrity.mjs parses
 * that array as text and splits entries on the first `},`, so a nested object
 * inside an entry breaks the judge. It is also a different concern - that array is
 * what is in community, this is what was sold.
 *
 * A community missing here has NOT been traced. It does not mean no invoice exists.
 */
export const COMMUNITY_INVOICE_PROVENANCE: Record<string, readonly CommunityInvoiceLine[]> = {
  // Traced against the Xero mirror 2026-08-04, because "how many Maningrida beds"
  // kept coming back with a different answer. It has three answers because there are
  // TWO invoices, seven months apart, for TWO different products. Whoever finds one
  // says 13 or 40; whoever finds both says 53. The register says 58 beds, because 5
  // Basket Beds arrived by a route that was never invoiced.
  maningrida: [
    {
      invoice: 'INV-0283',
      contact: 'Mala’la Health Service Aboriginal Corporation',
      date: '2025-10-21',
      status: 'PAID',
      description: 'Goods Basket Bed v2.1',
      quantity: 13,
      unitAmount: 380,
      note:
        'Mala’la IS Maningrida. The community name appears nowhere on the invoice, which is why a ' +
        'Xero search for "Maningrida" returns nothing and why this stayed unresolved. Shipping was ' +
        'listed at $3,200 and charged at $0. Total $5,434 = $4,940 + GST. The register holds 18 ' +
        'Basket, so 5 arrived by some route other than this sale and are not individually traced.',
    },
    {
      invoice: 'INV-0303',
      contact: 'Homeland School Company',
      date: '2026-05-18',
      status: 'PAID',
      description: 'Goods Stretch Bed - Single Bed, Poles, Canvas',
      quantity: 40,
      unitAmount: 750,
      note:
        'THE 40, at the canonical $750. Destination is provable from the freight line "Delivery of ' +
        'Goods ex BNE - DRW - MNG": Brisbane to Darwin to Maningrida. The same invoice carries 2 ' +
        'washing machines at $4,500 (the "+2 new" in asset-canonical.ts), an $8,000 program-support ' +
        'trip, $5,900 freight and a -$14,190 in-kind credit, tying to $44,000 exactly. This invoice ' +
        'evidences the SALE and the delivery. It cannot evidence where the beds were pressed, ' +
        'because in-house production raises no invoice - do not cite it for the in-house claim.',
    },
  ],
};

/** Washer rows still marked `deployed` that Ben's 2026-07-21 ruling says are
 *  stale (await restatus to `retired`): Tennant Creek 7, Alice Springs 2,
 *  Darwin 1. The judge asserts the gap is EXACTLY this — if it shrinks the
 *  restatus landed (delete this and hard-check washers); if it grows or moves,
 *  a new bad write landed. */
export const WASHER_STALE_DEPLOYED_ROWS: Record<string, number> = {
  'tennant-creek': 7,
  'alice-springs': 2,
  darwin: 1,
};

export function communityCanonTotals() {
  const basket = COMMUNITY_BED_CANON.reduce((s, c) => s + c.basketBeds, 0);
  const stretch = COMMUNITY_BED_CANON.reduce((s, c) => s + c.stretchBeds, 0);
  const washers = Object.values(WASHERS_IN_COMMUNITY_BY_COMMUNITY).reduce((s, n) => s + n, 0);
  return {
    basketBeds: basket,
    stretchBeds: stretch,
    beds: basket + stretch,
    washersInCommunity: washers,
    communitiesServed: COMMUNITY_BED_CANON.length,
  };
}

export { CANONICAL_ASSETS };
