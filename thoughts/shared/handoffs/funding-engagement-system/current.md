---
date: 2026-06-28T00:00:00Z
session_name: funding-engagement-system
branch: docs/snow-onepager-assets
status: active
---

# Work Stream: funding-engagement-system

## Ledger
**Updated:** 2026-06-28
**Goal:** A complete fundraising operating system (find → engage → money in) across GHL + Notion, driven by two skills, so people/funders are easy to track and move. Done = pipeline reflects reality, filterable by tag, two views in lockstep, and the founder can see "who to work + what to send" at a glance.
**Branch:** docs/snow-onepager-assets (all pushed through `b802d47`)
**Test:** `cd v2 && node scripts/ghl-people-pull.mjs --stale 25` (read-only, shows the live board)

### Now
[->] System is built and live. Founder-side sending is the only open work.

### This Session
- [x] `funding-pipeline` skill — grants, live-date-verified (caught NT RMF as 3-years-dead). Cleaned GHL Grants pipeline (10 dead → Declined, SEDI + NT Adv Mfg added).
- [x] `relationship-pipeline` skill — move people through GHL Supporter Journey. First weekly review applied 5 stage corrections (Minderoo/QBE → Cultivating, QBE $2M→$400K, Paul Ramsay/Dusseldorp/ALIVE → lost).
- [x] Engagement playbook (5 proof pillars × type × stage → artifact + ask + to-money path).
- [x] Artifact matcher — per-funder "what to send" from live GHL stage.
- [x] Added 3 no-gate repayable lenders to GHL Cultivating (First Nations Finance, CEFC/NAB, Invest NT).
- [x] GHL tag taxonomy (5 families); tagged all 50 contacts Type + Action.
- [x] Notion "Funder Pipeline" DB (15 active rows) in the data room.
- [x] All drafts written (SEFA/Snow/Centrecorp covering notes + 6 follow-ups). All committed + pushed.

### Next
- [ ] FOUNDER SENDS (Tier 3, human): the 4 `ready-to-send` enquiries — SEFA + First Nations Finance + CEFC/NAB + Invest NT. Drafts in `04-send-drafts.md` + `2026-06-27-funding-source-audit/03-outreach-drafts.md`. On send → `ghl-people-move.mjs "Name" "Ask made" --commit`.
- [ ] FOUNDER SENDS: Snow Round 4 + Centrecorp next-round covering notes → then move to Renewing.
- [ ] FOUNDER SENDS: the 6 stalled-ask follow-up nudges → lost if silent.
- [ ] Register interest NT RMF/CENT next round; decide NT Business Growth (closed 30 Jun — likely past).
- [ ] Optional: backfill the remaining ~35 funders into the Notion Funder Pipeline DB (only 15 active loaded).
- [ ] Optional: cold-prospect triage (work Sally Knox/John Chambers/IMB/Dev East Arnhem; park the rest).

### Decisions
- One-writer-per-layer: GHL = system of record (stage/tag), Notion = review view, scripts connect them. Never two writers on one field.
- Retire dead → Declined/lost (keep history), never delete.
- Live-date gate is non-skippable (the NT RMF lesson).
- GHL writes are Tier 3: dry-run first, founder's explicit verb. Warm-ask EMAILS sent by founder, never auto-blasted.

### Open Questions
- UNCONFIRMED: NT Business Growth Program close was 30 Jun 2026 — may now be past.
- UNCONFIRMED: REAL Innovation Fund (DEWR) actual application status (in Ask made, awaiting-reply).

---

## Context

### The system, end to end
Two skills, same four-beat motion (pull → review → dry-run → commit):
- **`/funding-pipeline`** — opportunities/grants (date-driven). Finds + live-verifies dates + scores fit.
- **`/relationship-pipeline`** — people/funders (warmth-driven). Move through stages + match artifacts + tags.

### Assets to review (everything built this session)

**Skills (local, `.claude/` is gitignored — NOT in git):**
- `.claude/skills/funding-pipeline/` — SKILL.md + SOURCES.md + scripts/pull-grantscope-open.mjs
- `.claude/skills/relationship-pipeline/` — SKILL.md (stage ladder, engage section, to-money)

**Scripts (tracked, `v2/scripts/`):** all read-only or dry-run-default
- `ghl-people-pull.mjs` — who-needs-a-move report (by stage, staleness flag)
- `ghl-people-move.mjs` — dry-run stage mover (`"Name" "Stage" [--value N] [--lost] [--commit]`)
- `funder-artifact-match.mjs` — per-funder "what to send" (reads register + GHL)
- `ghl-add-lenders.mjs` — added the 3 repayable lenders
- `ghl-apply-tags.mjs` — Type + Action tags to all 50 contacts
- `ghl-grants-sync.mjs` — Grants pipeline retire/add
- `pull-grantscope-open.mjs` (in skill dir) — GrantScope leads
- `ghl-funder-stages.mjs` — original read-only full pull

**Docs (tracked, `wiki/outputs/2026-06-28-funding-refresh/`):**
- `00-open-now.md` — dated grant shortlist  ·  `02-retire.md` — dead GHL grants
- `03-relationship-review.md` — first weekly review + corrections
- `04-send-drafts.md` — covering notes + 6 follow-ups (READY TO SEND)
- `05-engagement-playbook.md` — proof pillars → artifact → ask → money
- `06-ghl-operating-guide.md` — the 5 tag families + the move process
- provenance + grantscope-leads.json

**Notion (the clear views):**
- Funder Pipeline DB: page `c296ebc96ecd47899a9f805e8dd0d1cd`, data source `97afae12-6930-4e23-aff7-688f100fa47b` (15 active rows). View as Board grouped by Stage, or filter by Action.
- Funding refresh review page: `38cebcf981cf813083a6fb113f130fe7`
- Parent = Investor data room front door `38cebcf981cf8105a322dbc988a373dd`
- NOTE: the GrantScope loop Notion page `353e...` is NOT shared with the integration (404); the `38ce...` data-room pages work.

### The process to track + see people (the answer to "easily track and see people")
1. **See the work:** filter by Action tag. `ready-to-send` = send queue; `needs-followup` = chase; `awaiting-reply` = waiting; `monitor` = parked. Save these as GHL Smart Lists.
2. **Know what to send:** `funder-artifact-match.mjs "Name"` → stage + type + exact artifacts + the ask + next move.
3. **Send** the Notion data-room link (founder voice), then re-tag + `ghl-people-move.mjs` the stage.
4. **Two views in lockstep:** GHL board (work) = Notion Funder Pipeline (review). Scripts keep them aligned.
5. **Money:** Ask made → Delivering = agreement → invoice (Xero) → paid → Stewarding → acquit → Renewing. Money is "received" only in Xero/bank.

### Live GHL state (Goods Supporter Journey, pipeline JvBFYpVpyKsw899lkFgj)
50 open. Cultivating 8 (SEFA + 3 lenders + Eloise + Philanthropy Australia + Minderoo + QBE). Ask made 7. Stewarding 10. Identified ~18 (mostly cold, parked). All tagged Type + Action. Grants pipeline (scom3L0kNwA1W0zPIzMe): SEDI + NT Adv Mfg open, 10 retired to Declined.

### Constraints carried
- v2 DB = Goods `cwsyhpiuepvdjtxaozwf` only; never Supabase MCP. GrantScope DB = `grant_opportunities` in shared `tednluwflfhxyucgwigh`.
- Brand voice: zero em dashes, straight quotes, units no-space, "On Country" capitalised.
- GHL creds in `v2/.env.local` (GHL_API_KEY, GHL_LOCATION_ID=agzsSZWgovjwgpcoASWG). Never echo the API key.
- Pushes: do as a standalone step (chained commit && push trips the auto-mode boundary).
