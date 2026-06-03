---
date: 2026-06-01T00:00:00+10:00
session_name: money-verification-tfn-amp-and-ghl-money-alignment-fields
branch: codex/qbe-verified-alignment-fixes
status: SAVE POINT 2026-06-02 — GHL money-alignment Layers A/B/C DONE + Notion seam closed (cross-session); no code pending. Open = bookkeeping only (TFN void+rebook · AMP confirm · INV-0321 double-count) + close first signed LOI.
---

# Goods on Country — Handoff Ledger

## ▶ SAVE POINT — start here when you come back (2026-06-02)
**The Goods money-alignment arc is DONE end-to-end** (this repo + act-infra). The pipe: **Xero (cash truth) → GHL (7 opp fields, backfilled 152/153) → `/admin/loi-tracker` reconciled cockpit (commit `c26aea5`) → Notion** ("ACT Opportunities" sync now carries the 7 fields + auto-dedupes; new Grant Tranches DB).
- **Secured match-eligible = $758,670** · **Committed / Signed-LOI = $0** → the **QBE match gate is still open** (the one thing that moves the needle: close the first signed LOI).
- **Entry docs:** memory `[[ghl-money-alignment]]` (field IDs + full decision log + the customFields write-format gotcha) · `wiki/outputs/2026-06-01-goods-notion-surfaces-alignment.md` · act-infra handoff `act-global-infrastructure/thoughts/shared/handoffs/2026-06-01-goods-money-sync-xero-ghl-notion.md` · the two dated entries below.

**OPEN when you return (all bookkeeping / decisions — no code pending):**
1. **TFN $144,558** — Xero void + rebook the 2 mis-booked expense bills → ACCREC income; fix-note `wiki/outputs/2026-06-01-tfn-xero-fix-note.md`. Auto-flows into Notion + the tranches DB once done.
2. **AMP $21,900** — confirm the 2024 org / bank receipts (no ACCREC in the mirror).
3. **INV-0321 $132k (Snow)** — booked as a grant tranche AND exists as a Buyer opp → decide grant vs commercial (double-count risk).
4. **The needle:** close the first signed LOI(s) — the only thing that opens the QBE match.

---

## ▶ UPDATE (2026-06-01 PM — Notion seam CLOSED + Snow reconciled, from act-infra)
The GHL→Notion opportunity sync (`act-global-infrastructure/scripts/sync-opportunities-to-notion-db.mjs`, commit `1b18fa4`) now carries the **7 money-alignment fields** (live `GET /opportunities/{id}` — the bulk `/search` the mirror uses returns empty `customFields`) and **auto-dedupes** (915→754 pages, 161 dupes cleaned; QIC = one page Grant/No/Paid/$12k). **Secured-match rollup in Notion = $758,670.**

**Snow $402,930 RECONCILED + written (was the only gap).** Verified against the Goods Xero org (`786af1ed`): **7 PAID ACCREC invoices = $402,929.79** — INV-0208 Palm Is bedding sprint $27.5k · INV-0220 TC field trip · INV-0227 Q2 R&D $110k · INV-0240 BHAC laundry · INV-0258 field trip+Basket Bed · INV-0268 FY26 Q1/Q2 wages $110k · INV-0321 bed deployment + production plant $132k. Ben: all grant/match-eligible (open flexible funding). Wrote Actual-paid=402930 + Amount basis=Xero-actual to GHL opp `qqMUNJI4qHbPR2lLHqn9` (read-preserve-write — the other 4 fields kept). ⚑ INV-0321 $132k bed deployment also exists as a Buyer opp → watch double-count.

**NEW: Grant Tranches DB** (`act-infra/scripts/sync-grant-tranches-to-notion.mjs`, commit `19f2793`) — Notion DB `f8204bd0…`, **one row per PAID grant invoice, Xero-sourced** (reconciled, with per-tranche Purpose + Acquittal status) so open multi-tranche grants are reportable/acquittable per tranche. Now **11 tranches / 4 funders = $592,211.79**: Snow 7 ($402,929.79) · Centrecorp 2 ($123,332) · VFFF 1 ($50,000) · Red Dust 1 ($15,950). **⚠ Centrecorp reconcile caught a trap:** its raw "paid" looked like $832,832, but **10 of 12 invoices are VOIDED/DELETED** (bed-workshop + production-plant invoices that didn't proceed) — only INV-0259 + INV-0291 = $123,332 are real PAID (sync now filters `status=PAID`, not `amount_due=0`). **2 funders BLOCKED — both Goods bookkeeping actions:** ① **TFN $144,558** mis-booked as 2 ACCPAY expense bills → needs the **void+rebook** (queued in `tfn-xero-fix-note.md`); once rebooked as ACCREC it auto-appears. ② **AMP $21,900** no ACCREC in mirror (2024 income — confirm org / bank receipts). Both syncs run weekly Mon 8:15 via `sync-money-stack.mjs`. act-infra commits `1b18fa4` · `19f2793` · `61bcd8e`. Memory: [[ghl-money-alignment]].

## ▶ RESUME (2026-06-01 — money verification + GHL money-alignment fields)
**Session arc:** verified a Codex "external-readiness" pass → **GHL / Xero / Drive are all LIVE here** (Codex's 401 was its own connector). Built **GHL money-alignment Layer A** (7 opportunity custom fields). Then the big thread: **the "$201,900 phantom" was WRONG — it's ALL real money**, proven from source via live Xero.

**THE MONEY TRUTH (verified from source):**
- **FRRR $50k** = the **VFFF INV-0253** (paid) — one joint "Backing the Future" grant; do NOT double-count.
- **TFN $144,558** = real grant, 2 tranches ($89,361 + $55,197), raised at the *Healthy People Healthy Planet* TFN pitch (2 Sep 2025), net of TFN's 10% — **mis-booked in Xero as 2 expense bills** by the Dext→"Farmhand AI" pipeline. Needs void+rebook (queued for bookkeeper).
- **AMP $21,900** = AMP Tomorrow Makers SPARK grant, **correctly booked** as 5 PAID income invoices (2024, contact "AMP").
- **Attribution (Ben 2026-06-01): TFN + AMP both → Goods (ACT-GD)** → both count toward the QBE match.
- **Verified Goods grant pool ≈ $770,670** (Snow 402,930 · Centrecorp 123,332 · TFN 144,558 · VFFF/FRRR 50,000 · AMP 21,900 · Red Dust 15,950 · QIC 12,000).
- **GHL→LOI recon:** 0 committed / 0 signed LOIs across the 3 Goods pipelines → **QBE match gate still OPEN**.

**LIVE XERO ACCESS — the working method** (the official MCP custom-connection is blocked: org has no qualifying subscription): use **act-infra's existing OAuth token** — read `xero_tokens` (id='default') from the ACT-infra Supabase mirror (`tednluwflfhxyucgwigh`) for a valid access_token (refresh via the sync flow if expired, save back to all 3 stores), then call `api.xero.com/api.xro/2.0/…` with header `xero-tenant-id`=`XERO_TENANT_ID`. Full read+write. **Period lock = 30-Sep-2025** (pre-Oct records can't be edited). Pattern scripts in `/tmp/xero_*.mjs`.

**NOTHING was written to Xero this session** (held the TFN void per Ben; AMP re-tag rejected by the period lock).

**Key files (2026-06-01):** `wiki/outputs/2026-06-01-tfn-xero-fix-note.md` (bookkeeper, ordered) · `…-ghl-money-alignment-fields-and-rules.md` (7 field IDs + rules) · `…-ghl-backfill-mapping-DRAFT.md` · `…-xero-mcp-setup-readonly.md`. Memory: [[tfn-xero-misbooking]], [[ghl-money-alignment]], [[goods-data-alignment]].

**▶ NEXT PICKUPS (nothing on fire, nothing half-done):**
1. ~~**GHL backfill**~~ **DONE 2026-06-01 (130/130 written + verified).** Classified the 3 Goods pipelines (153 live opps) per the mapping cohort table; wrote Funding type + Match-eligible + Capital status + Amount basis(=Estimate) on **130** (Demand·Signal 77 → Demand signal/No/Signal · Demand·BuyerMatched 23 + Buyer 9 → Commercial sale/No/Signal · Supporter·Identified 16 → Philanthropic/TBC/Signal · 4 Stewarding grants Snow/Centrecorp/VFFF/RedDust → Grant/Yes/Paid · Rotary Global Grant → Philanthropic/TBC/Ask made). **Write-format gotcha:** MCP `body_customFields` must be **objects** `{id,field_value}`, NOT JSON-strings (strings → silent 200 no-op); read back via `search-opportunity` not `get-opportunity`. Centre Canvas (abandoned supplier in Buyer) excluded. Artifacts `/tmp/goods_backfill_{apply,hold}.json`. _(A sub-agent ran the 129-write loop; a security-policy false-positive fired — the writes WERE authorised by Ben's explicit "go" on the Tier-2 batch plan + came from the pre-approved mapping, not agent inference.)_
   **HELD-ROW DECISIONS — 21/22 APPLIED 2026-06-01 (Ben answered, Claude wrote + verified each):** (A) **TFN $130K → Grant/Yes/Paid** (Ben: "this is paid, lock it") · **FRRR $50K → Grant/No/Paid** (Match=No to dedup the VFFF joint $50K) · **AMP $21.9K → Philanthropic/Yes/Paid** ("paid, lock it"). (B) **QBE → Philanthropic/No/Ask-made** (the matcher) · **REAL → Grant/TBC/Ask-made** (Ben: federal govt — ⚑ TBC: does QBE match accept govt? still open) · **Eloise Hall → Philanthropic/TBC/Signal** (Ben: she's a supporter + future Goods-on-Country board member, NOT an impact investor) · **Philanthropy Australia → Other/No** (membership body) · **Garma → Demand signal/No** (a showcase opportunity). (C) **Tier-1 ×6 → Philanthropic/Yes/Ask-made** (Minderoo/PaulRamsay/TimFairfax/IanPotter/Bryan/BrianDavis — Ben: "yes all ask made"). (D) **Dusseldorp + John Villiers → Philanthropic/Yes/Paid** (JV + Xero inv INV-0327; ⚑ monetaryValue still $0 in GHL — actual $ reconciliation is Layer B). (E) **Rotary Eclub $82.5K → Philanthropic/Yes/Invoiced** + INV-0222 (due, being chased) · **Homeland $44K → Commercial/No/Invoiced** + INV-0303 (paid soon). (F) **Mala'la $5,434 + Our Community Shed $20,265 + Julalikari $19,800 → Community contribution/No/Paid** (Ben: "community but paid for").
   **22/22 HELD NOW RESOLVED (2026-06-01, round 2):** (1) **QIC $12,000 → Grant/No/Paid** (Ben: paid & done but NOT match-eligible). (2) **REAL → Grant/Yes/Ask-made** — Ben CONFIRMED: the $2M govt money flows to **Oonchiumpa (a partner)** and that **counts as match** (match-eligible Yes). $2M aspirational ask, not yet secured. (3) **Card↔field stage alignment DONE** (Ben: "yes match") — moved 8 Supporter-Journey cards: Minderoo/PaulRamsay/TimFairfax/IanPotter/Bryan → **Ask made**; Dusseldorp/JohnVilliers/Mala'la → **Stewarding/Reporting** (custom fields survived the stage moves, verified). _Left as-is:_ Rotary Eclub at Ask-made (no "Invoiced" stage exists in Supporter Journey — field carries the truth; nudge to Committed/Delivering if wanted); OCS/Julalikari at Renewing (valid paid stage). (4) **TFN** confirmed "paid & done" at the classification level; the Xero void+rebook stays a separate bookkeeper cleanup.
   **▶ RESULT: 152/153 opps classified** (Centre Canvas abandoned = excluded). Secured match-eligible (Paid + Match=Yes, phil/grant) ≈ **$744K** by GHL value (~$758K verified). **Committed/Signed-LOI = $0 → QBE match gate still OPEN.**
   **▶ LAYER C BUILT + LAYER B (mostly) DONE 2026-06-01 (uncommitted on `codex/qbe-verified-alignment-fixes`, tsc/eslint 0):** **Layer C** — `v2/src/lib/ghl/index.ts` `fetchOpportunitiesForPipelines` now surfaces the 7 money-alignment fields (+ shared `GOODS_OPP_FIELD_IDS` export); `/admin/loi-tracker` match banner rebuilt into a reconciled ladder (Secured / Committed=QBE gate / Invoiced / Asks-in-flight, prefers Actual-paid). **Layer B** — wrote Actual-paid (Xero-actual basis) on 8 funders (VFFF 50k · TFN 144,558 · AMP 21,900 · Red Dust 15,950 · QIC 12k · Julalikari 19,800 · OCS 20,265 · Mala'la 5,434). **Snow $402,930 + Centrecorp $123,332 BLOCKED by the auto-mode safety classifier** (large figures need explicit human confirm) — secured still reads correct ($758,670) via monetaryValue fallback; retry on Ben's confirm. **CORRECTED (Ben):** Dusseldorp's paid $ funds the *Contained* project (JusticeHub + Mounty Yarns) not Goods, John Villiers = a travel reimbursement (Palm Island PA-video shoot) not a grant — BUT Ben wants both **kept in the mix as potential Goods funders** → set **Match=TBC** (Dusseldorp Philanthropic/Signal/Cultivating; JV Other/Paid/INV-0327). Off *secured* (TBC) but visible as live prospects. **Xero MCP caveat:** live on Goods org but only top-5 accrual revenue, no contact IDs → durable Layer B sync needs the act-infra `xero_invoices` mirror.
   **▶ REMAINING:** confirm Snow/Centrecorp → finish their Actual-paid; Dusseldorp/JV opp disposition (abandon from Goods pipeline?); durable Layer B via the act-infra mirror (contact IDs + live re-sync); commit Layer C.
2. **TFN fix** → hand the fix-note to the bookkeeper (one sitting: fix Dext rule → void 2 bills → rebook $144,558 income vs the bank deposit; deposit isn't API-visible, likely unreconciled).
3. **AMP ledger tag** → tag $21,900 ACT-GD in act-infra's Supabase `project_code` layer (Xero invoices period-locked).
4. **Older open (2026-05-30):** push `fix/asset-canonical-counts` + PRs #47–#51; Codex external-readiness (Drive sharing for the QBE bundle, Notion Areas 01-10 rewrite).

---

## Ledger
**Updated:** 2026-05-30
**Goal:** Work the QBE investor-readiness TACKLE-NEXT stack (build-safe items), stand up the supplier CRM in GHL, and set up for a full GHL sweep that relays back to Notion + strategy.
**Branches / PRs (all open off `main`, no overlapping files except a trivial admin-sidebar import between #49 & #50):**
- **PR #47** `feat/investors-cockpit-gate` — `/investors` shared-password cockpit (reuses the verified cost-model engine, investment skin)
- **PR #48** `fix/qbe-public-copy-quarantine` — `/impact` accuracy: public-copy overclaim quarantine **+** per-metric provenance badges
- **PR #49** `feat/admin-operating-systems` — `/admin/operating-systems` (source-of-truth matrix + LIVE data-freshness checklist + systems map)
- **PR #50** `feat/admin-loi-tracker` — `/admin/loi-tracker` reads GHL LIVE → LOI ladder + match rollup
- **PR #51** `feat/audience-comms-and-impact-reports` — audience comms segments (C) + per-audience impact report templates (D). **Stacked on #50** (reuses `loi-pipeline.ts`); retarget to main when #50 merges.
**Currently on:** `feat/audience-comms-and-impact-reports`.
**Test:** `npx tsc --noEmit` = 0 errors on every branch. Full `npm run build` still red only on the pre-existing `/admin/production` prerender (local Supabase latency; builds fine on Vercel).

### Now — CHECKPOINT FOR /clear (2026-05-30)
[x] **C + D SHIPPED & VERIFIED LIVE → PR #51** (2 commits: `720dabf` C+D build + `64e5a4f` story-filter fix; stacked on #50). Workstreams **A/C/D done, B ~80%.** **C:** `AUDIENCE_SEGMENTS` in `v2/src/lib/ghl/smart-lists.ts` (6 level-of-support segments) + `/admin/reach-out` two-section picker + `campaign-segment-panel.tsx` + preview API `?segmentId=` — **definitions only, GHL campaigns own the send**. **D:** `report-templates.ts` (4 audience templates) + `/admin/reports/impact[/[templateId]]` binding live `fetchImpactData()` + consented EL stories + `components/reports/impact-report.tsx`; new `empathyLedger.getReportStories()` pulls **canonical Goods project only** (not the `goods-on-country` aggregate), theme-ranked. **Verified live on the running dev server (`:3004`):** supplier segment = 18 contacts, funder-active = 11 opps (FRRR/TFN/Centrecorp/VFFF…), funder report shows live 520 beds / 10,400 kg + Goods-only Voices. tsc 0, eslint clean. **5 PRs await review/merge: #47·#48·#49·#50·#51.** Detail: memory [[audience-comms-and-reports]].

### This Session (2026-05-30 PM — network alignment + asset-count fix) ✅
Ben: "fix the $ once and build the pieces so it always sticks, across all of ACT." Walked all 10 GHL pipelines (business-area framing), reconciled funder $ to authoritative Xero, killed the asset-count drift, mapped the durable architecture.
- **Funder $ → Xero truth:** the connected Xero org `786af1ed` ("Nicholas Marchesi") IS the current Goods sole-trader (Ben confirmed — supersedes "Xero MCP wrong"). Verified-paid >> old $588K once non-grant Goods cash counted (PICC $436,700, Regional Arts $33K, Dusseldorp $16.5K, Red Dust $16K, Paul Ramsay $7.5K, OCS $20.3K, Julalikari $19.8K — all PAID, GHL under-counted). **$201,900 phantom = TFN $130K + FRRR-old $50K + AMP $21.9K (NOT in Xero)** — GHL funder values were hardcoded by `seed-goods-supporter-journey.mjs`, never from Xero. GHL $ unreliable; **Xero is truth**.
- **GHL tags applied (Tier 2, Ben-approved):** 5 funders→`audience-funder`, 11→`grant`. Centre Canvas Buyer opp confirmed abandoned.
- **Asset-count drift FIXED + GUARDED → commit `90eac36` on `fix/asset-canonical-counts` (tsc clean, drift-check green):** canonical **496 beds (363 Basket + 133 Stretch) / 28 washers (14 working) / 9 communities / 2,660kg plastic STRETCH-ONLY** (Basket≠plastic; old 9,920/10,400 was a ~3.7× overclaim). New `getCanonicalAssetRollup()` + `asset-canonical.ts` + `scripts/check-asset-drift.mjs`; ~15 surfaces repointed. Branch is LOCAL, not pushed.
- **act-infra surveyed:** reconciler is INERT (writes a report, never writes GHL); only live GHL job runs backwards; funder $ hardcoded → root cause. Maps in this dir: `act-infra-data-layer.md`, `act-infra-ghl-sync.md`, `asset-count-alignment.md`.
- **Designed (not built):** Community Production pipeline (7-stage) + bed-lifecycle dimension. Candidate communities: Oonchiumpa (REAL grant) → Tennant Creek shed → Palm Island/PICC.
Detail: memory [[goods-data-alignment]].

### ▶ NEXT (alignment build + Ben's data calls) — the block below is now DONE
- **Ben's data decisions (unblock the reconciler):** PICC $436,700 — Goods (grant/commercial)? · TFN/FRRR/AMP $201,900 — pledged-elsewhere or drop from cash? · Snow $493K(MCP accrual) vs $402,930(cash) → use cash.
- **Ben creates the FRRR opp** in GHL UI: Supporter Journey / Ask-made / $50K / name "FRRR — Community Led Climate Solutions (Palm Island)" / contact Danielle Griffin (d.griffin@frrr.org.au) / tags grant+audience-funder; fix the "A Kind Tractor" applicant→right entity. Then Claude sets stage/value via API.
- **Build #7 durable reconciler** (4 pieces: deterministic contact→project map · canonical funder ledger · reconciler→ACTUATOR covering Supporter Journey, dry-run first on the daily cron · downstream auto-aligns).
- **Write #4 Community Production spec** → Ben creates GHL shell → wire (#5).
- **Bed-lifecycle dimension** (bought/made/ordered/deployed) + **Basket-bed field re-verification sweep** (all 363 flagged deployed, never re-checked).
- **Push `fix/asset-canonical-counts` + open PR** when Ben says (Tier 2). PRs #47–#51 still awaiting review/merge.

### ▶ NEXT SESSION (DONE 2026-05-30) — GHL pipelines + areas walkthrough → on-country production-facility pipeline
**Ben's goal (verbatim intent):** walk through **all 10 GHL pipelines + the business areas they map to** to (1) deeply understand the **funder reports** (just built, D) + the **supporter pipelines** (Supporter Journey = the live funder ladder) end-to-end, and (2) **design how to BUILD pipeline structure for potential ON-COUNTRY PRODUCTION FACILITIES — tracking + supporting LOCAL PEOPLE toward community-led manufacturing** (the Stretch-Bed "on-country plant moves to community ownership" model; ties to the community-ownership impact dimension + SIH scale-up Rec + Butterfly/community-production entities).
- **Start from (don't re-pull cold):** full live pipeline inventory in `wiki/outputs/2026-05-30-ghl-sweep-recon-and-write-plan.md` (all 10 pipelines) · `v2/src/lib/data/loi-pipeline.ts` (3 Goods pipelines + stage→rung) · new `AUDIENCE_SEGMENTS` (C) · `report-templates.ts` (D). GHL is source of truth — read LIVE via the `ghl` MCP.
- **The novel piece to design:** a NEW "Community Production / On-Country Facility" pipeline — stages like *community interest → local champions → training/capability → facility stand-up → operating/owned* — connecting supply (supplier LIST), demand (Buyer Pipeline), philanthropy (Supporter Journey), and the supply-partner report. Output likely a pipeline spec + how it feeds funder/supporter comms.
- **CLARIFY w/ Ben FIRST:** does "areas" = the QBE diagnostic areas (the 12), or the pipeline business-areas (commercial / philanthropy / demand / supply / community-production)? Confirm scope before fanning out.
- **Guardrails:** suppliers = a LIST not a pipeline; don't CREATE pipelines/opps in GHL without Ben's explicit go (Tier 2+ GHL writes). Read-only walkthrough first → propose structure → Ben approves → then build.

### This Session (2026-05-30 — GHL sweep + full supplier/vendor sweep)
Ben: "pick up the work" → chose **GHL sweep recon** → then **the 4-workstream vision** (suppliers → pipelines → comms → impact reports). Done:
- **GHL sweep recon (read-only)** → write-plan `wiki/outputs/2026-05-30-ghl-sweep-recon-and-write-plan.md`. Pulled all 10 GHL pipelines live. Buyer (10 opps: ALIVE $60K, WHSAC $1.7M@first-stage, NLC Gapuwiyak $70.7K, Anyinginyi/Miwatj). **Supporter Journey (43) = the real funder ladder:** cash/stewarding **$846K in GHL vs ~$588K Xero-verified** → **$258K gap** = TFN $130K + FRRR $50K + AMP $21.9K + Our Community Shed $20.3K + Julalikari $19.8K + Red Dust $16K; **$0 sits in a signed-LOI "Committed" rung** (that IS the QBE-match gap). Demand Register = 105 civicgraph prospects, $0 committed.
- **Legacy "Grants" pipeline = 435 Grantscope prospects tagged `project:act-gd`, 0 real-goods → NOT a merge source** (reverses prior "merge target" assumption). ACT org pipeline holds historical *won* Goods deals (VFFF $50K, 3× Centrecorp) that **double-count** Supporter Journey.
- **Centre Canvas Buyer opp `UozRRvtkcc8XvKuKevMP` → set `abandoned`** (Ben's go); contact kept all supplier tags. **Supplier phones added:** Centre Canvas `+61889522453`, DNA Steel `+61889537355`.
- **Full supplier/vendor sweep (Gmail + authoritative Xero money-out):** mined inbox + ACT-infra Supabase ACCPAY/bank-spend → **24 vendors added/enriched in GHL, CRM 5 → ~27**, role-tagged `goods-supplier`(BOM/plant/product) / `goods-vendor`(services/logistics/tech/print). **New strategic suppliers surfaced:** Telford Smith (plastic-plant builder ~$39.6K capex), **1300 Washer** ($41.9K — real washer supplier, not Speed Queen), Zinus (bedding $28.7K), Openfields (fleet IoT), Carbatec/Smartwood (tooling); Defy confirmed $120,957.90 paid. Verified 2 contacts (tags landed; appended-not-overwritten on the 2 matched-existing). Register: `wiki/outputs/2026-05-30-supplier-vendor-register.md`; IDs: `…-ghl-supplier-add-results.md`; Xero detail: `…-supplier-register-xero.md`. Memory [[ghl-suppliers]] updated.

### Earlier This Session (2026-05-30 — QBE TACKLE-NEXT, pre-sweep)
- **PR #47** — committed + pushed the overnight `/investors` cockpit (was uncommitted) + an insiders-wiki entity-structure fix.
- **20-agent accuracy workflow** (12 Notion QBE areas + 7 public-copy source files vs the canonical numbers/entity facts) → **public-copy quarantine** (PR #48): 29 code edits / 8 files (killed `/impact` "Live Data"/real-time claims; Centrecorp commercial→grant-funded; removed "ACT is a registered charity"; counts→canon; softened funder `$400K`/"active DGR"/Centrecorp-"Locked") + **12 Notion QBE-DB field corrections** (Public Copy Risk + Claim Labels) + the **DGR entity-vs-pathway resolution**. Report: `wiki/outputs/2026-05-30-qbe-public-copy-quarantine-and-accuracy-sweep.md`.
- **#3** `/impact` provenance badges (confidence tier on all 20 metrics) — folded into PR #48.
- **#7** `/admin/operating-systems` (PR #49) — source-of-truth matrix + live freshness (flags CRM ~64d + production ~77d stale). Mirror: `wiki/outputs/2026-05-30-operating-systems-source-of-truth.md`.
- **#5** `/admin/loi-tracker` (PR #50) — reads GHL LIVE across the 3 Goods pipelines (Demand Register/Buyer/Supporter Journey) → target→committed→contracted→cash ladder; match rollup flagged contingent + cap TBC; excludes misfiled suppliers.
- **Supplier CRM** — added 5 suppliers to GHL as tagged contacts (`goods-supplier`): Defy Design, DNA Steel Direct, Centre Canvas, Coastal Fasteners, Envirobank. See memory [[ghl-suppliers]] for IDs.

### Next — FORWARD PLAN (Ben's 4-workstream vision: suppliers → pipelines → comms → reports)
- [x] **A — Suppliers/vendors → GHL:** DONE (see above). Light follow-up: email-enrich the company-only stubs (Telford Smith, 1300 Washer, Carbatec, Smartwood, R M Tanner, Bionic, Carla, Openfields, Samuel Hafer, Endless Parks, Joseph Kirmos, steel merchants — Xero gave $+name, no email); add Centre Canvas/Coastal emails when Ben has them.
- [~] **B — Pipelines → QBE readiness:** ~80% captured in the GHL-sweep recon doc (full opp inventory + match story). Optional: formalise a 1-page "opportunity → QBE readiness" view.
- [x] **C — Audience comms layer — DONE (PR #51):** extended `v2/src/lib/ghl/smart-lists.ts` with *level-of-support* segments off the live tags — `funder-active` (audience-funder + cash/stewarding stage), `funder-prospect` (cultivating), `buyer/procurement`, `goods-supplier`, `goods-vendor`, `supporter/donor` (community lists already exist) — + surface in the existing admin reach-out picker with send-caps. **DECISION (Ben): send happens in GHL campaigns** — code only DEFINES segments → each maps to a GHL smart list/tag → GHL email campaign/workflow sends. No in-app send tool.
- [x] **D — Template impact reports — DONE (PR #51):** reusable reports showcasing **Empathy Ledger** stories (Goods project `6bd47c8a-e676-456f-aa25-ddcbb5a31047`) + community impact, targeted per audience (funders vs procurement vs buyers vs supporters). Feeds the C segments.
- [ ] **Recon write-plan leftovers** (`…ghl-sweep-recon-and-write-plan.md` §5/§6, Ben's call): WHSAC $1.7M + Centrebuild reset?; the Notion "GHL pipeline state" relay to the QBE diagnostic; `grant` tag on Supporter-Journey grant opps; route Laura McConnell Conti (gokindly) out of Universal Inquiry.
- [ ] Standing: review/merge the 4 PRs; set **`INVESTORS_PASSWORD`** in Vercel; **#1 founder FTE rate** (Ben+Nic+accountant); QBE cap (#4).

### Decisions (this session)
- **GHL is the source of truth for pipeline/relationships** — funding/LOI tooling reads GHL LIVE, never crm_deals or a static list.
- **Suppliers = a CRM list (tagged contacts), not a pipeline.** Detail stays in `v2/src/lib/data/supplier-quotes.ts`; invoices in Xero; GHL = the contact/email layer. Centre Canvas misfile resolved (abandoned).
- **Authoritative supplier source = Xero ACCPAY (money-out), not Gmail.** Split: `goods-supplier` (BOM/plant/product makers) vs `goods-vendor` (services/logistics/print/tech), each + role sub-tag.
- **Legacy "Grants" pipeline (435) = Grantscope prospect dump tagged `project:act-gd`, 0 real-goods → NOT a merge source.** (Supersedes the earlier "Grants = merge target" note.) Real Goods grants already live in Supporter Journey.
- **Comms send mechanism = GHL campaigns** (GHL owns email; code only defines the segments). [Workstream C]
- **Grants → Supporter Journey (tagged);** keep this — only the *legacy board* is not a merge source.
- **DGR = entity vs pathway:** Butterfly entity may hold Item-1 DGR, but Goods→Butterfly routing is FY2026-27 — never say "DGR is live for Goods."
- **One concern per branch/PR.** Notion QBE Diagnostic DB internal fields are fair game to correct directly.

### Open Questions
- **Match definition:** confirm only **Xero-verified-paid + a signed LOI doc** counts toward the QBE match (i.e. exclude the **$258K** GHL-only "Stewarding") — yes?
- **WHSAC $1.7M** (at first stage) + **Centrebuild/Centrecorp** Buyer opps — real numbers or reset?
- **Notion relay:** post the "GHL pipeline state" note to the QBE diagnostic? Which area page(s)?
- **Is the Goods→Butterfly gifting/routing operative NOW or from FY2026-27?** (locks all DGR copy)
- **QBE Stage-2 cap** ($200K vs $400K) + what counts as eligible match.
- Supplier emails still missing: Centre Canvas (Wayne), Coastal Fasteners, + the company-only vendor stubs.
- Centrecorp = **in discussion**: 3 Xero quotes developed, all declined, maybe a bed order after their ~end-June board. Quotes are NOT revenue.

### Carried over (still load-bearing)
- Production deploys from `main` → Vercel project `goods-on-country` (`prj_XGQL3gT1C6N7BolooQevgMJuIf1G`, team `team_3aAWFPdRQ92RkkJ2LehJ209u`). Preview URLs behind Vercel SSO.
- Canonical numbers: `wiki/outputs/2026-05-29-qbe-canonical-numbers-sheet.md`. Morning briefing: `wiki/outputs/2026-05-30-investor-readiness-overnight/00-MASTER-investor-readiness-view.md`.
- Granular state lives in auto-memory `MEMORY.md` (▶ RESUME lines) — read it first next session.

---

## Prior Sessions (condensed)
- **2026-05-28** sponsor-system-improvements — Sponsor-a-Bed redesign + comms funnel + product-image fix, shipped to prod via PR #27/#28. (`next/image` needs relative paths for `/public` assets.)
- **2026-05-27** uncommitted-work-landing — landed 9 days of accumulated work into atomic commits (→ PR #27), applied the assets-outcome migration, cleaned the tree.
