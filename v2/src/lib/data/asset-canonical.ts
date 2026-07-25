/** Canonical deployed-asset figures. Source of truth = the assets register
 *  (project cwsyhpiuepvdjtxaozwf), reconciled 2026-07-19 (Ben count rulings:
 *  Kununurra +2 Stretch GB0-158, Katherine +1 Stretch GB0-159 via Nic,
 *  Tennant Creek +1 Stretch GB0-160 to the youth centre; Utopia confirmed 147;
 *  Maningrida washers confirmed 8 = 6 existing + 2 new). Static surfaces import
 *  THIS; server components prefer getCanonicalAssetRollup() in impact-fetcher.ts
 *  (live). Plastic = Stretch beds only (Basket Beds are not a plastic product).
 *  Drift from the live register is caught by scripts/check-asset-drift.mjs.
 *  washersInCommunity (22) is Ben's 2026-07-21 ruling, settled per community
 *  against the live register and SUPERSEDING the old curated 20: Maningrida 8,
 *  Tennant Creek 9, Palm Island 4, Alice Springs 1, Darwin 0. Provenance
 *  ledger: wiki/outputs/2026-05-14-washing-machine-final-reconciliation.md
 *  (18 bought via Xero + 4 BHAC re-skins, locked); ruling table in CONTEXT.md.
 *  The register still holds 32 `deployed` washer rows because 10 are stale
 *  (Tennant Creek 7, Alice Springs 2, Darwin 1 should be `retired`), so
 *  washers are reported as a KNOWN GAP by scripts/check-asset-drift.mjs
 *  rather than hard drift-checked, until that restatus lands. */
/** Ben's 2026-07-21 per-community washer ruling (CONTEXT.md, "Washers in
 *  community = 22"). The register still shows 32 `deployed` washer rows because
 *  10 are stale (Tennant Creek 7, Alice Springs 2, Darwin 1 await restatus), so
 *  any surface that shows washers PER COMMUNITY must read this map rather than
 *  the register, or the dots will sum to 32 under a header of 22. Keys are
 *  communities.id. Delete this map once the restatus lands and the register
 *  itself sums to 22. */
export const WASHERS_IN_COMMUNITY_BY_COMMUNITY: Record<string, number> = {
  maningrida: 8,
  'tennant-creek': 9,
  'palm-island': 4,
  'alice-springs': 1,
  darwin: 0,
};

export const CANONICAL_ASSETS = { bedsDeployed: 540, stretchBedsDeployed: 177, basketBedsDeployed: 363, washersInCommunity: 22, communitiesServed: 11, distinctCommunities: 12, plasticKg: 3540 } as const;
