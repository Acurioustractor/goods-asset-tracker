# Archived: 4 redundant CRM/strategy admin pages

**Date:** 2026-05-16
**Reason:** The sidebar had 5+ pages doing variants of "deals/pipelines/funding/strategy".
After audit, four were duplicating or narrating data better held elsewhere.

## What's in here

- `strategy/` — `/admin/strategy` route. Bed pricing + plant distribution narrative.
  Data duplicated `compendium.ts` + `supplier-quotes.ts`. The page never had unique
  workflow.
- `crm/` — `/admin/crm` route. "CRM & Pipelines" overview. Subsumed by `/admin/deals`
  Kanban which is the single operational view.
- `growth/` — `/admin/growth` route. Freight economics by remoteness + regional
  expansion narrative. Reference data, not action — move to wiki post-trip if useful.
- `deal-room/` — `/admin/deal-room` route. Named-deal checklists (Groote + REAL Fund).
  **The live workflow was preserved** by migrating `ChecklistSteps` and the step
  definitions into `/admin/deals` as a "Focus workstreams" section above the Kanban.
  Checklist state continues to live in the `deal_room_checklist` table (unchanged).

## How to restore (any one of them)

```bash
git mv _archive/2026-05-16-admin-cleanup/<route-name> v2/src/app/admin/<route-name>
```

Then re-add to the appropriate group in `v2/src/app/admin/admin-sidebar.tsx`.

## What replaced them

| Old route | Where to find equivalent functionality |
|-----------|----------------------------------------|
| `/admin/strategy` | Bed pricing → `v2/src/lib/data/supplier-quotes.ts` `stretchBedBOM`. Plant distribution → `v2/src/lib/data/compendium.ts`. |
| `/admin/crm` | `/admin/deals` Kanban (same data, operational view). |
| `/admin/growth` | Freight reference: TBD post-trip. Regional expansion: covered in `wiki/articles/`. |
| `/admin/deal-room` | `/admin/deals` "Focus workstreams" section at the top of the page. |

## Sidebar before/after

**Before (2026-05-15):** Operations / Pipeline & Revenue / Content — 16 items, 3 groups,
3 hidden orphan routes.

**After (2026-05-16):** Today / Operations / Money / Content & people — 17 items, 4
groups, 0 hidden orphans. `Messages` promoted from orphan into `Today`. `Products`
promoted into `Money`. Trip preflight + Bed signals visible.

## Related decisions

- Photos on `/bed/{id}` filtered by `compassion_content.is_public` (migration
  20260516000001).
- Operators on `Behind-this-bed` show first names only.
- Voice notes: ship as-is, transcribe post-trip.
- `/admin/messages` + `/admin/products` promoted to sidebar.
