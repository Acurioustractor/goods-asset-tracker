# Snow Foundation — sendable asset sweep + overview

> Prepared 2026-06-11 for Ben. Purpose: one place that lists every Snow-facing asset we hold, says which are current vs stale, and flags what must be settled before anything goes to Sally. Not for sending as-is; this is the internal index behind the Sally email draft (`2026-06-11-sally-feedback-email.md`).

---

## TL;DR — what to actually send

The cleanest feedback package for Sally is **two things**, with the rest available on request:

1. **The live partner dashboard** — `goodsoncountry.com/partners/snow/dashboard` (password `snow2026`). The primary, interactive artifact: live impact counts, the funding-to-impact pathway, the roadmap kanban, community voices, and the next-chapter / blended-finance framing.
2. **The branded partnership one-pager** — `2026-06-11-snow-partnership-one-pager.png` (portrait, re-forwardable, Board-friendly). One page, Goods-branded.

Everything else (impact one-pager, quarterly one-pager, partner update) is supporting and can follow once the blockers below are cleared.

---

## Pre-send blockers (must clear first)

1. ~~Washing-machine number inconsistent across surfaces.~~ **RESOLVED 2026-06-11.** Ben confirmed **16 in community** is the single figure; the deployed/working split is retired. Set as a curated canonical value (`washersInCommunity: 16`) across every surface (canon, fetcher, dashboard, grant docs, about, API, Snow config, scripts). Build + drift CI green; the drift checker now intentionally skips washers (the register still holds 28 deployed rows pending a status cleanup, so 16 is curated, not row-derived). NOTE: the live dashboard shows 16 only after these local changes are committed and deployed.
2. ~~Re-export the impact one-pager.~~ **RESOLVED 2026-06-16.** Re-exported from the Pencil deck as `2026-06-16-snow-impact-one-pager.pdf/png` with the 16 washers (and the "where your support went" allocation bar); the stale `2026-06-10` export has been removed.
3. **Quarterly one-pager not exported.** It lives in the Pencil deck (frame "Snow Quarterly One-Pager") but has no PDF/PNG yet. Export if we want it in the pack.
4. **`2026-Q2.md` is stale — do not send.** It still shows "$275,000 paid / $120,000 to be paid", "25 kg per bed", and a $395K commitment view that is now reconciled to fully-drawn / $0 outstanding. Superseded by the figure reconciliation. (This is also where the $120K in the reference infographic came from.)
5. **Partner update has open placeholders.** `2026-06-09-snow-partner-update.md` still has `[CONFIRM]` tags (Katrina / Alice Springs jobs specifics, pouch status, filming status). Close those before it goes out.

---

## Full asset inventory

| Asset | Format | Location / link | Status | Send? |
|---|---|---|---|---|
| Partner dashboard | Live web (gated) | `/partners/snow/dashboard`, pw `snow2026` | Current, on canon | **Yes — primary** |
| Branded partnership one-pager | PNG + HTML | `2026-06-11-snow-partnership-one-pager.*` | New, current (16-washer caveat) | **Yes — primary** |
| Impact one-pager | PDF + PNG (Pencil) | `2026-06-16-snow-impact-one-pager.*` | Re-exported, current (16 washers) | **Yes** |
| Quarterly one-pager | Pencil deck frame | deck `goods-theory-of-change-v2.pen` | Not exported (blocker #3) | Optional, after export |
| Partner update (June) | Markdown | `2026-06-09-snow-partner-update.md` | Draft, has `[CONFIRM]`s | After placeholders closed |
| Figure reconciliation | Markdown | `2026-06-09-snow-figure-reconciliation.md` | Current (the $493,130 basis) | Internal / on request |
| Airport display update | Markdown | `2026-06-09-airport-display-update.md` | Current | On request |
| Bhanvi impact-investment intro | Markdown | `2026-06-09-bhanvi-impact-investment-intro.md` | Draft (next-chapter capital) | Separate thread |
| Q2 progress report | Markdown | `2026-Q2.md` | **Stale (blocker #4)** | **No** |
| Notion: Snow Partner update Q2 2026 | Notion page | `37aebcf981cf8115a179e4ad353120a2` | Current (107, 2,140kg, chair) | Link on request |

---

## Figures that ARE settled and consistent (safe to state)

- **Snow backing: ~$493,130 cumulative, fully received, $0 outstanding** (Xero, 9 June 2026).
- **496 beds** across **9 communities** (133 Stretch / 363 Basket).
- **~2,660 kg recycled plastic diverted** (20 kg per Stretch Bed; do not use the old 25 kg).
- **1 containerised production facility**, ~85% commissioned; Alice Springs facility in a federal REAL Innovation Fund submission with Oonchiumpa ($1.995M, decision pending).
- **QBE Catalysing Impact 2026**: selected; Stage 2 in September can match up to $400K against capital we raise alongside it.

- **16 washing machines in community** (curated, Ben-confirmed 2026-06-11; supersedes the register deployed-row count).

All headline figures are now settled and consistent.
