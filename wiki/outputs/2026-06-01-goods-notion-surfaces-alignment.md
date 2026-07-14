# Goods money surfaces in Notion — alignment with the GHL/Xero model

**Created:** 2026-06-01 · Read-only review. Maps the Goods money/funder surfaces in Notion against the
GHL money-alignment model (7 opp fields + Secured/Committed/Asks ladder; Xero = money truth) now live
at `v2 /admin/loi-tracker`.

## The model we're aligning to
- **GHL** = relationships + pipeline + the 7 money fields (Funding type · Match-eligible · Capital status
  · Amount basis · Actual-paid · Xero contact ID · Xero invoice #). Source of truth for *who/what stage*.
- **Xero** (Goods org "Nicholas Marchesi" `786af1ed`) = money truth. `monetaryValue`=ask, Actual-paid=cash.
- **Reconciled cockpit** = `/admin/loi-tracker`: Secured $758,670 · Committed $0 (QBE gate) · Invoiced · Asks.

## The surfaces found in Notion

| Surface | id | What it is | Aligned? |
|---|---|---|---|
| **"ACT Opportunities" DB** | db `a28b97ba80b248c89d3d65486d865a07` / `collection://f09e2a15-42ec-4ba1-a8ee-66bb4304be40` (under **ACT Money Framework → Mission Control**) | **The live GHL→Notion opportunity sync.** Each opp = a page with `Source: GHL`, `External ID: ghl:<oppId>`, `Source URL` (GHL deep link), Amount, Pipeline, Stage, **Last Synced** (2026-05-31). Org-wide (all ACT projects incl. Goods Supporter Journey). | ⚠️ **Partial — behind the model** |
| **Goods Enterprise HQ** | page `36cebcf981cf8081b83ee6acb0ea2a9e` | Revenue/finance hub. Contains an inline **"Sales Pipeline" DB** (`36cebcf981cf8017ac53c52aa06524be`) + links to QBE Diagnostic, Build Workspace, funding workflow board, Capital Stack. | ⚠️ Overlaps |
| **QBE Diagnostic DB** | `cb3794d427914d72bf1036106d8116f5` | Investor-readiness areas (the 12). | ✅ Strategy layer |
| **Investor Pipeline** | `348ebcf981cf8116a3fcda749e8e1f83` | "Live snapshot of who is at what stage in our 2026 raise — **the authoritative version is the admin [app]**." | ✅ self-defers to app |
| **Goods Capital Stack (2026)** | `348ebcf981cf81448517d95e2bb55067` | Blended-finance stack (guarantees/Snow LOG, etc.). | 🔶 narrative |
| **Goods funding workflow board** | `35aebcf981cf81da95d5c181174c09ac` | SEDI/capability + funder workflow notes. | 🔶 narrative |
| **04 - Financial Management** | `36eebcf981cf8167884fc3d5ecda0e32` | QBE area page — states **"Xero is the money source of truth"** (agrees with our model). | ✅ principle aligned |
| **10 - Investors & Capital Raising** | `36eebcf981cf81329a11e33e2d121bf9` | QBE area page (capital story). | ✅ |
| **Per-opp synced pages** (e.g. QIC ×2) | `371ebcf9…8187…`, `371ebcf9…812d…` | Synced opp mirror pages. | ❌ **duplicated** |

## The 5 alignment findings

1. **A GHL→Notion sync already runs** — into the **"ACT Opportunities" DB** (Source=GHL, External ID=`ghl:oppId`,
   Last Synced timestamps). So the "GHL→Notion roll-up" is *not* purely hand-maintained; it's an existing job
   (org-wide, under ACT Money Framework / Mission Control — not Goods-specific). **This is the seam to build on.**

2. **The Notion mirror is BEHIND the money-alignment model.** The synced pages carry only the OLD fields —
   `Amount` (=the GHL ask/monetaryValue), `Pipeline`, `Stage`, `Pile: Uncoded`, blank `Project Code`. They do
   **NOT** carry the new 7 fields (Funding type, Match-eligible, **Capital status**, **Actual-paid**). So the
   reconciled picture — Secured **$758,670**, Committed **$0** (QBE gate), the grant/commercial split — **does
   not exist in Notion yet.** Notion still shows the raw ask, the exact "$16.4M face value" problem the GHL
   fields were created to fix.

3. **Duplicate pages.** QIC appears as **two** Notion pages with the *same* `External ID: ghl:97JpDZ8tcaLXuh0Au89k`
   → the sync isn't upserting on External ID (it inserts). Likely repeated across the synced set → the Notion
   opportunity counts/sums are inflated. **Sync hygiene bug.**

4. **Overlapping/fragmented money surfaces.** Funder/money data is split across at least: **ACT Opportunities**
   (synced), **Sales Pipeline** (Enterprise HQ), **Capital Stack**, **Investor Pipeline**, **funding workflow
   board**. Several are narrative snapshots that drift. The Investor Pipeline page already concedes "the
   authoritative version is the admin app."

5. **Principle is already aligned.** Notion's own "04 - Financial Management" states *"Xero is the money source
   of truth"* and "the funding and demand system" page describes the exact 3-pipeline model (needed→Demand,
   ordered→Buyer, funded→Supporter). So the *docs* agree with the model — it's the *data plumbing* that lags.

## Recommendation (the seam to close)
- **One authoritative view, not five.** Make `/admin/loi-tracker` (+ `/admin/operating-systems`) THE cockpit;
  have the Notion money pages *link* to it rather than re-state figures (Investor Pipeline already does).
- **Extend the existing GHL→Notion sync** ("ACT Opportunities" job) to carry the 7 money fields — at minimum
  **Capital status**, **Match-eligible**, **Funding type**, **Actual-paid** — and to **upsert on External ID**
  (fixes the QIC dupes). That single change makes Notion show Secured/Committed/Asks instead of raw asks.
- **Find + own the sync job.** The sync lives org-wide under ACT Money Framework / Mission Control — almost
  certainly an **act-infra** job (same place the durable Layer-B Xero→GHL sync belongs). Locating it ties
  Layer B (Xero→GHL) and this (GHL→Notion) into one reconciler so: **Xero → GHL → Notion** is one pipe.

## Open / next
- Confirm what runs the "ACT Opportunities" sync (likely act-infra) + whether it's cron or manual.
- Dedupe the synced opp pages (upsert on External ID).
- Decide: extend the sync to carry the 7 fields, vs. collapse Notion money pages to links into `/admin`.
