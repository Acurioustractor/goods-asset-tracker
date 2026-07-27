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
