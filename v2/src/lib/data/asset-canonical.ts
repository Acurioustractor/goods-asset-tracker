/** Canonical deployed-asset figures. Source of truth = the assets register
 *  (project cwsyhpiuepvdjtxaozwf), reconciled 2026-07-19 (Ben count rulings:
 *  Kununurra +2 Stretch GB0-158, Katherine +1 Stretch GB0-159 via Nic,
 *  Tennant Creek +1 Stretch GB0-160 to the youth centre; Utopia confirmed 147;
 *  Maningrida washers confirmed 8 = 6 existing + 2 new). Static surfaces import
 *  THIS; server components prefer getCanonicalAssetRollup() in impact-fetcher.ts
 *  (live). Plastic = Stretch beds only (Basket Beds are not a plastic product).
 *  Drift from the live register is caught by scripts/check-asset-drift.mjs.
 *  washersInCommunity (20) is a CURATED, Ben-confirmed figure: the single
 *  in-community washing-machine count (16 confirmed 2026-06-11 + 2 Maningrida
 *  Jul 2026 + 2 Julalikari Tennant Creek, Ben 2026-07-19). Provenance ledger:
 *  wiki/outputs/2026-05-14-washing-machine-final-reconciliation.md (18 bought
 *  via Xero + 4 BHAC re-skins, locked). The register holds 32 deployed washer
 *  rows pending a status cleanup, so washers are NOT drift-checked against
 *  the register. */
export const CANONICAL_ASSETS = { bedsDeployed: 540, stretchBedsDeployed: 177, basketBedsDeployed: 363, washersInCommunity: 20, communitiesServed: 11, distinctCommunities: 12, plasticKg: 3540 } as const;
