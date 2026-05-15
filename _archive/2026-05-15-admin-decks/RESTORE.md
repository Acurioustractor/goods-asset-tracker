# Archived admin decks (2026-05-15)

These 27 admin pages were moved out of `v2/src/app/admin/` because they were
static, hardcoded one-shot deck pages (no DB reads, no live operational data).
They were each useful when written for a specific funder/grant/proposal, but
they don't update and they crowded out the real operational tools in the admin
sidebar.

Lines removed from active build: **~14,160**.

The pages still exist verbatim in git history. To bring one back:

```bash
git mv _archive/2026-05-15-admin-decks/<page> v2/src/app/admin/<page>
# then add a nav entry in v2/src/app/admin/admin-sidebar.tsx
```

## Inventory

| Slug | Lines | Purpose |
|------|------:|---------|
| `qbe-program` | 2,899 | QBE Catalysing Impact Program briefing and timeline |
| `grants` | 1,760 | Static list of grant opportunities |
| `groote-proposal` | 864 | Groote Archipelago proposal (one prospect, one page) |
| `procurement` | 743 | Tim Cook supply-chain procurement strategy doc |
| `finance-model` | 699 | Finance model summary |
| `foundation-matcher` | 553 | Foundation matching tool |
| `qbe-actions` | 481 | QBE checklist |
| `compendium` | 476 | Wrapper around `src/lib/data/compendium.ts` |
| `loi-tracker` | 461 | Letter-of-intent prospect list |
| `economics` | 453 | Unit economics page |
| `supply-nation` | 450 | Supply Nation application checklist |
| `impact-dashboard` | 425 | Impact dashboard mock |
| `iba-loan` | 411 | IBA Business Loan structure prep |
| `partners` | 381 | Partner directory (static) |
| `austender` | 357 | AusTender registration guide |
| `capability-statement` | 342 | Capability statement one-pager |
| `logistics` | 339 | Backloading logistics calculator (static) |
| `niaa-prep` | 320 | NIAA Alice Springs meeting prep |
| `deployment-map` | 263 | Leaflet deployment map (duplicates `/admin/communities`) |
| `messages` | (kept — DB-backed) |
| `journeys` | 204 | Bed journey templates |
| `pipeline` | 188 | Kanban-style deal pipeline (static) |
| `hdpe-catalog` | 177 | HDPE product catalog expansion ideas |
| `groote-outreach` | 133 | Groote outreach email draft |
| `campaign-engine` | 39 | Empty stub |
| `network` | 23 | Empty stub |
| `ideas` | 23 | Empty stub |
| `supporters` | 23 | Empty stub |

## Why these were moved

The brief was to refine the admin to track what's meaningful and important:
**assets, communities, production costs**. None of these archived pages did
that work. The replacement surface area is:

- `/admin` (dashboard)
- `/admin/assets`
- `/admin/fleet`
- `/admin/production` (now with cost-per-batch + Xero ACCPAY actuals)
- `/admin/communities` + `/admin/communities/[id]` (DB-backed)
- `/admin/orders`, `/admin/requests`
- `/admin/strategy` (CRM deals), `/admin/growth`, `/admin/deal-room`, `/admin/xero-reconciliation`
- `/admin/stories`, `/admin/announcements`, `/admin/team`, `/admin/brand`, `/admin/compassion`

If a specific page's content is genuinely needed for an outreach or grant,
the better move is to lift it into `wiki/outputs/` as markdown rather than
restoring the route.
