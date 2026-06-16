/** Canonical deployed-asset figures. Source of truth = the assets register
 *  (project cwsyhpiuepvdjtxaozwf), reconciled 2026-05-30. Static surfaces import
 *  THIS; server components prefer getCanonicalAssetRollup() in impact-fetcher.ts
 *  (live). Plastic = Stretch beds only (Basket Beds are not a plastic product).
 *  Drift from the live register is caught by scripts/check-asset-drift.mjs.
 *  washersInCommunity (16) is a CURATED, Ben-confirmed figure (2026-06-11): the
 *  single in-community washing-machine count. It supersedes the old deployed/
 *  working split; the register still holds more deployed washer rows pending a
 *  status cleanup, so washers are NOT drift-checked against the register. */
export const CANONICAL_ASSETS = { bedsDeployed: 496, stretchBedsDeployed: 133, basketBedsDeployed: 363, washersInCommunity: 16, communitiesServed: 9, distinctCommunities: 10, plasticKg: 2660 } as const;
