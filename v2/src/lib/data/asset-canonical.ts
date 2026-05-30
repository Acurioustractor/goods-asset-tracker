/** Canonical deployed-asset figures. Source of truth = the assets register
 *  (project cwsyhpiuepvdjtxaozwf), reconciled 2026-05-30. Static surfaces import
 *  THIS; server components prefer getCanonicalAssetRollup() in impact-fetcher.ts
 *  (live). Plastic = Stretch beds only (Basket Beds are not a plastic product).
 *  Drift from the live register is caught by scripts/check-asset-drift.mjs. */
export const CANONICAL_ASSETS = { bedsDeployed: 496, stretchBedsDeployed: 133, basketBedsDeployed: 363, washersWorking: 14, washersDeployed: 28, communitiesServed: 9, distinctCommunities: 10, plasticKg: 2660 } as const;
