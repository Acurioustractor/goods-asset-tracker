# GHL Tag & Workflow Cleanup — May 2026

Companion to `2026-05-18-ghl-workflow-alignment.md`. Records what got cleaned up, what was deferred, and the remaining manual tasks.

---

## ✅ 1. LinkedIn tag migration — DONE

**Before:** 46 `goods-linkedin-*` and `goods-li-*` tags in the dropdown, scattered across 67 contacts.

**After:** 1 custom field `Goods · LinkedIn Tags` (MULTIPLE_OPTIONS, 46 values) holding the same data structurally.

What changed:

- Created custom field `Goods · LinkedIn Tags` (ID `1V8IGG8wEyZ3cKV2m3F9`, key `contact.goods__linkedin_tags`) in the Orders folder.
- Migrated 67 contacts — for each, read existing customFields, merged in the new LinkedIn field with the right multi-values, removed only the LinkedIn-prefixed tags. **All other tags + customFields preserved** (verified by GET-merge-PUT pattern).
- Deleted all 46 location-level tags from the GHL tag library.
- Migration script saved at `v2/scripts/ghl-migrate-linkedin-tags.mjs` (re-runnable; idempotent on a clean DB).

**Validation done after the run:**
- Sample contact `tobyg@kalianahoutdoors.com.au` went from 14 tags (4 LinkedIn-prefixed) → 10 tags (LinkedIn ones removed). Other tags (`justicehub`, `act-gd`, `act-jh`, `partner`, `brisbane`, etc.) untouched. New field set to `['Supporter', 'Warm', 'Youth', 'Goods Bed V3']`.

How to find these contacts going forward:
- **Smart List filter:** `Goods · LinkedIn Tags contains "Philanthropy"` (or any other value)
- **Same precision as before**, just one field-dropdown to scroll instead of 46 tags.

---

## ⚠️ 2. Delete 4 draft workflows — MANUAL (API doesn't support workflow deletion)

GHL's public workflow API supports listing only. Deletions must happen in the dashboard.

To delete:

- [ ] Workflows page → for each of the 4 below, click the ⋯ menu → Delete
  - `2644db92-a63e-44fa-9fac-f5dc392d11b8` — `New Workflow : 1767654441340`
  - `abaf76f8-8263-4cac-a480-3960f69d3a80` — `New Workflow : 1768162771389`
  - `2e2b4833-df0c-4049-a2de-ed9e30ce2544` — `New Workflow : 1768162803581`
  - `6592410f-a819-4ffc-a41c-63bfbc37972c` — `New Workflow : 1770418806176`

All four have status `draft`, so deleting them won't affect any live automation. 30-second job.

---

## 🟡 3. `goods-gmail-*` tags — DECISION: keep as historical breadcrumbs

There are 6 `goods-gmail-*` tags from a one-off Gmail import:

`goods-gmail-active · goods-gmail-community · goods-gmail-funder · goods-gmail-government · goods-gmail-media · goods-gmail-partner`

**Decision: keep them.** Reasoning:

1. They're only 6 tags — UI noise impact is small.
2. They preserve the "this contact came in via the Gmail import" signal, which would be lost in any migration.
3. The category data they encode (funder/government/media/partner) is duplicated by other tags and fields (e.g. `goods-linkedin-*` was the same concept before the LinkedIn migration). The Gmail variants survive because the source attribution is the load-bearing part.
4. No new contacts will ever get these tags — the Gmail import is historical.

**Treat as:** read-only legacy. Don't extend the namespace, don't reuse the prefix. If/when the team wants source attribution for new contacts, create a `Goods · Lead Source` custom field instead.

---

## 📋 4. Audit of 103 generic / cross-project tags

These are tags without a `goods-` prefix, mostly used by other ACT projects (Harvest, ACT Events, Empathy Ledger, JusticeHub) or as global cross-project categories.

**Posture for Goods:** *don't touch.* The cleanup of cross-project tags isn't Goods's call — it's a workspace-wide hygiene exercise that should be coordinated across project leads. But there are **5 potential collisions with Goods-prefixed equivalents** worth being aware of when designing workflows or filters:

| Generic tag | Goods equivalent | Risk |
|---|---|---|
| `funder` | `goods-funder` | A human filter on "funder" alone could mix Goods and non-Goods funders. Filter on `goods-funder` for precision. |
| `partner` | `goods-partner` + `goods-partner-lead` | Same risk. Goods workflows should filter on `goods-partner-lead` not `partner`. |
| `media` | `goods-media` | A workflow triggered on `media` would fire for Goods + Harvest + JusticeHub media inquiries. |
| `newsletter` | `goods-newsletter` | Different signups. Use the prefix. |
| `storyteller` | (none in Goods) | Empathy Ledger-owned; not relevant to Goods. |

**Smart Router note (carried into `…-workflow-alignment.md`):** every Smart Router branch tests `Contact has tag = goods-X` — never the bare generic tag. This is already specified in the workflow playbook.

### Tag categorisation for reference

| Category | Examples | Owner | Action |
|---|---|---|---|
| Cities/regions (~12) | adelaide, brisbane, cairns, melbourne, perth, sydney, regional-nsw | Cross-project | Keep. Useful for location segmentation. |
| Project codes (~7) | act-cg, act-cn, act-el, act-gd, act-hv, act-jh, empathy-ledger, justicehub | ACT-wide | Keep. Internal cross-reference. `act-gd` = Goods. |
| Harvest-specific (~15) | harvest-event-attendee, harvest-newsletter, harvest-member, etc. | Harvest | Defer to Harvest team. |
| Interest tags (~12) | interest-events, interest-food, interest-volunteer, etc. | Harvest mostly | Defer to Harvest team. |
| Quiz (~6) | quiz-completed, quiz-explorer, etc. | Harvest | Defer to Harvest team. |
| Shop (~5) | shop-consignment, shop-food, etc. | Harvest | Defer to Harvest team. |
| Venue (~5) | venue, venue-enquiry, venue-interested, etc. | Harvest | Defer to Harvest team. |
| Contained-specific (~5) | contained, contained-hot-lead, container-request | Contained (ACT) | Defer. |
| World tour (~3) | world-tour, world-tour-partner | ACT-wide | Keep. |
| Generic categories (~20) | funder, partner, supporter, media, government, education, legal, research, etc. | Cross-project | Keep. **See collision table above.** |
| Engagement state (~5) | inbound, contact-form, meeting-held, etc. | Cross-project | Keep. |
| Misc one-offs (~15) | 24-carrot-gardens, conference-host, festivals-target, etc. | Various | Defer to respective owners. |

---

## Summary

| # | Item | Status |
|---|---|---|
| 1 | LinkedIn tag migration (46 tags → 1 field, 67 contacts) | ✅ Done via API |
| 2 | Delete 4 draft workflows | ⚠️ ~30 sec dashboard task |
| 3 | `goods-gmail-*` cleanup decision | 🟡 Keep as historical |
| 4 | Audit 103 generic tags | 📋 Documented; cross-project, defer to owners |

**Goods tag namespace now contains 39 tags** (was 85): 14 code-applied + 7 engagement-tier + 6 gmail-historical + 4 source + ~8 manual/category. Much more navigable in the GHL dropdown.

**Net Goods custom fields:** 8 (3 new this week: Asset ID, Sponsor Dedication, LinkedIn Tags; plus 4 pre-existing: Community, Order Number, Order Total, Product Type; plus shared Project Designation stamped "Goods").

**Net Goods workflows:** 2 wired (newOrder, parliamentHouse), 1 pending creation (Smart Router covering 6+ code paths per the workflow alignment doc).
