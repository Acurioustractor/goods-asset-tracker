# GHL Supplier & Vendor Register — Add/Enrich Results (2026-05-30)

Location / sub-account: `agzsSZWgovjwgpcoASWG`. Source stamp: `Goods supplier register 2026-05-30`.
Base tags applied to every row (rows 2–24): `goods`, `project:act-gd` + per-row class/role tags.
Row 1 (Envirobank) = email-enrich only, tags deliberately untouched.

| # | Company | contactId | action (created/matched-existing/enriched) | tags applied (y/n) |
|---|---------|-----------|--------------------------------------------|--------------------|
| 1 | Envirobank | ipZjeDDR9uwHMdXR7KV6 | enriched (email + name set; tags untouched) | n (by design) |
| 2 | Coleman Print | iqk86FbdDvkyZvYrVkmu | created | y |
| 3 | ePrint Online | tCqk03o9pwcnf4F2pYi0 | created | y |
| 4 | BOE Design | iUgWpZM2c6E9RsYfwTPF | created | y |
| 5 | Standard Ledger | rirjlbnB0qUPn8xujAAD | created | y |
| 6 | Social Impact Hub | NVHZfqOTviJyw6Tw1old | matched-existing (had goods-supporter/goods-warm) | y (appended) |
| 7 | Speed Queen Winning | Iwev1EKV7JM57OvQkA07 | created | y |
| 8 | Hinterland Aviation | g3mCmF64426by14k24uk | created | y |
| 9 | Zinus Australia | Y0nkSQSpqJwpN3Bm4yYA | matched-existing (had goods-supporter/newsletter/audience-brand) | y (appended) |
| 10 | Telford Smith Engineering | 3dhuv8mGGJ9kDtXAnko8 | created | y |
| 11 | 1300 Washer | VkNhirANqP1njpyd60rn | created | y |
| 12 | Carbatec | USmz3jRRvggEANHT30TX | created | y |
| 13 | Smartwood | ul5Hi4PBGkgtOGeGJNHF | created | y |
| 14 | R M Tanner | eFTaEY5jTJKCWhJBgOGD | created | y |
| 15 | Bionic Self Storage | RvXTSY2CxJcNR1BoEOKV | created | y |
| 16 | Carla Furnishers | ViU0wq59SzgfeJnAFuVS | created | y |
| 17 | Openfields Solutions | 7mUrvIfkaHofCGDDwXbn | created | y |
| 18 | Samuel Hafer | Fm9G902uVPH8PLBFiHip | created | y |
| 19 | Endless Parks | DgvlWHKIX8MwpVUMcRM9 | created | y |
| 20 | Joseph Kirmos | b31aU8WclwCosFV8kOtx | created | y |
| 21 | Steelmart | Y93YnRnGZW5u47VcG6Fz | created | y |
| 22 | Stratco | WGgGwpLY3wUVR9SnlPjR | created | y |
| 23 | Metal Manufacturers | DBaQByccQaUlcXTn4Voa | created | y |
| 24 | Brisbane Steel | USa6MIQloDgGc6MR8b8o | created | y |

## Notes
- **No row errored.** All 24 processed.
- **2 rows matched pre-existing contacts** (deduped on email by upsert): Social Impact Hub (Matt Allen) and Zinus (Daniel Pittman). Their prior tags were preserved; the new supplier/vendor tags were appended via `add-tags` (verified in API response `tagsAdded`).
- **22 net-new contacts created** (rows 2–5, 7–8, 10–24). Rows 10–24 had no email, so each got a `get-contacts` dedup-check first (all returned 0 matches) then a fresh `create-contact` with split firstName/lastName + inline tags.
- Row 1 Envirobank: only email (`mtaylor@envirobank.com.au`) + firstName/lastName Marty Taylor set; its 3 existing tags (`goods-supplier`, `goods-supplier-pending`, `supplier-hdpe-bulk`) were NOT modified.
- Standard Ledger email stored lowercased by GHL as `cosecau@standardledger.co` (input was `cosecAU@…`) — GHL normalises email case; functionally identical.
