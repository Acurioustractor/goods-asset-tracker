# Provenance: Centrecorp Utopia outcomes one-pager

> Source-of-truth for every figure on `utopia-outcomes-one-pager.html` / `.pdf`.
> Updated 2026-05-26. Aligned to the Notion Funder Reporting system (the authoritative,
> Xero-sourced record), not standalone memory.

## Authoritative source
- **Notion: Centrecorp Foundation Reporting** — https://www.notion.so/367ebcf981cf816ca4c2f51c52d2df82
- **Notion: Funder Reporting Hub** — https://www.notion.so/367ebcf981cf81fdb2a5ca192253f0a0
- Backed by Xero (`project_code = ACT-GD`, contact `Centrecorp Foundation`) + Supabase `v_funder_next_move`.

## Decision: no dollar headline on this public-facing one-pager
The earlier draft showed "$420K commitment / $208K granted" (from 12-May memory). That conflicts
with the authoritative Notion/Xero record, which shows **$388,432 invoiced · $123,332 paid ·
$265,100 outstanding** (5 invoices). Rather than feature a contested figure on a board-facing page,
the one-pager now leads with beds + partnership. The precise dollar figures live in the Notion
Centrecorp Reporting page, which is the single source for them.

| Figure on the page | Value | Source | Confidence |
|---|---|---|---|
| Beds delivered (May 2026 deployment) | 107 | Asset register batch GB0-156 (107 Stretch Beds minted 2026-05-14). The Snow agreement funds 100 @ $600; the minted batch was 107. | Verified (register) |
| Rounds to Utopia | 2 | INV-0291 (first Utopia batch, 2025) + the May 2026 deployment. Per Centrecorp Reporting page. | Verified (Notion) |
| Production plant trial | 6-month | INV-0314 "Production Plant Part 1 (6-month rental trial)". Per Centrecorp Reporting page. | Verified (Notion) |
| Recycled HDPE per bed | 20kg | Canonical product data (`v2/src/lib/data/products.ts`). | Verified |
| Quote (Frank Holmes & Mr Donald Thompson OAM, Antarrengeny) | "Since receiving their new beds, they are no longer experiencing back pains." | Oonchiumpa Good News Story. | Attributed |

## Attribution note (corrected 2026-05-26)
The May 17–27 Central Australia deployment runs off a **Snow Foundation** signed agreement (100 beds,
Mparntwe + Utopia). Centrecorp is the **Central Australia delivery partner**, funds beds for
Tennant Creek/Mparntwe (INV-0331), the plant trial (INV-0314), and washers (INV-0329), and funded the
first Utopia batch (INV-0291, 2025). The page reflects this rather than claiming Centrecorp solely
funded the May Utopia delivery.

## Before send
Human verify gate: confirm against the live Centrecorp Reporting page in case a tranche has moved.
The companion Snow Foundation one-pager (for the same May deployment) is the funder doc that carries
the Snow-funded framing.
