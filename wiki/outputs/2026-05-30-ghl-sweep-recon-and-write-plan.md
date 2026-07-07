# GHL Sweep — Recon + Write-Plan (read-only phase)

**Date:** 2026-05-30
**Author:** Claude (read-only recon — nothing written to GHL or Notion)
**Source:** GHL location `agzsSZWgovjwgpcoASWG`, pulled LIVE via REST `/opportunities/search` 2026-05-30. Dollar figures are **GHL pipeline values, not Xero-confirmed cash** (same caveat the `/admin/loi-tracker` already shows).
**Approval model:** Every proposed write is listed in §5 with its action-tier and a ✅recommend / ⚠️your-call flag. I execute the approved subset only after you give the word.

---

## 1. What I read

All 10 pipelines in the location. The 3 Goods pipelines in full; the 7 shared/legacy boards filtered to Goods-tagged opps.

| Pipeline | ID | Total opps | Goods-relevant | State |
|---|---|---|---|---|
| Goods — Demand Register | `UQsrmuqz…` | 105 | 105 | 🟡 Bulk civicgraph demand (77 Signal / 23 Buyer-Matched), all $0 committed |
| Goods — Buyer Pipeline | `FjMyJM3Y…` | 10 | 10 | 🟢 Real commercial pipeline (+1 supplier misfile) |
| Goods Supporter Journey | `JvBFYpVp…` | 43 | 43 | 🟢 Clean — the real funder ladder |
| Grants (legacy) | `scom3L0k…` | **435** | **0 real-goods** | 🔴 Grantscope prospecting dump tagged `project:act-gd`, test email — NOT Goods grants |
| A Curious Tractor (org) | `BvrCPnOc…` | — | ~12 won | 🟡 Historical wins; ~4 are Goods and double-count Supporter Journey |
| Supporters & Donors | `QiK57emf…` | — | 0 | ⚪ Nothing Goods |
| The Shop pipeline | `Pdtr1ZIO…` | 4 | 0 | ⚪ Nothing Goods |
| Universal Inquiry | `ggQw10Du…` | 2 | 1 | 🟡 1 unrouted Goods inquiry (Laura McConnell Conti / gokindly) |
| Harvest Inbox | `5ZqAuFok…` | 10 | 0 | ⚪ Nothing Goods |
| Empathy Ledger | `aRGmSaMh…` | — | — | ⚪ Separate project, not swept |

---

## 2. The live funder ladder (Supporter Journey → LOI rungs)

Mapped via `loi-pipeline.ts` STAGE_TO_RUNG.

**CASH / Stewarding+Renewing — $846,177 (GHL):**
Snow $402,930 · Centrecorp $123,332 · The Funding Network $130,000 · FRRR $50,000 · VFFF $50,000 · AMP $21,900 · Our Community Shed $20,265 (Renewing) · Julalikari $19,800 (Renewing) · Red Dust $15,950 · QIC $12,000

**CONTRACT / Delivering — $44,000:** Homeland School Company

**COMMITTED / signed LOI tier — $0** (nothing in a Committed stage)

**TARGET / cultivation+ask — ~$4.29M:** QBE Foundation $2,000,000 (Ask made) · REAL Innovation Fund DEWR $2,000,000 (Ask made) · Minderoo $200,000 (Qualified) · Rotary Eclub $82,500 (Ask made) · Mala'la $5,434 · + ~25 foundations at Identified/Cultivating ($0): Ian Potter, Bryan, Paul Ramsay, BHP, Rio Tinto, Fortescue, Dusseldorp, TFFF, Garma, etc.

### ⚠️ Reconciliation gap (the load-bearing number)
GHL "cash" tier = **$846,177**, but Xero **verified-paid** grant total ≈ **$588,262** (Snow 402,930 + Centrecorp 123,332 + VFFF 50,000 + QIC 12,000). The **$257,915 delta** = The Funding Network $130K + FRRR $50K + AMP $21,900 + Our Community Shed $20,265 + Julalikari $19,800 + Red Dust $15,950 — all sitting at "Stewarding" in GHL but **not in the verified-paid set** (memory already flagged TFN/FRRR/AMP as unreconciled). → **None of these should count toward the QBE match until confirmed in Xero + a signed doc exists.** The tracker already says this; this names the exact opps behind the gap.

---

## 3. Buyer Pipeline (commercial, 10 opps)

| Opp | Value (GHL) | Stage | Note |
|---|---|---|---|
| WHSAC (Groote Archipelago) | **$1,700,000** | Outreach Queued | ⚠️ $1.7M at first stage — aspirational/unqualified. Forecast anomaly. |
| Northern Land Council — GAPUWIYAK | $70,771 | Outreach Queued | civicgraph-sourced |
| ALIVE | $60,000 | Qualified | Looks real |
| Anyinginyi Health | $4,800 | In Conversation | `goods-stage-customer` |
| Miwatj Health | $0 | In Conversation | `goods-stage-active` |
| Centrebuild Pty Ltd | $0 | In Conversation | ⚠️ contact = Randle Walker **@ Centrecorp** (`goods-hot`, audience-funder). Centrecorp is "in discussion / declined 3 quotes" — likely stale. |
| Ampilatwatja Health, Hewitt Agriculture, NPY Women's Council | $0 | early | prospects |
| **Centre Canvas** | $0 | Outreach Queued | 🔴 **SUPPLIER misfiled in Buyer** — opp `UozRRvtkcc8XvKuKevMP`. Already filtered out of the LOI ladder; still pollutes the Buyer board. |

---

## 4. Findings, ranked

1. 🔴 **Grants (legacy) = 435 Grantscope prospects, 0 real Goods grants.** Tagged `project:act-gd` (Grantscope's project code) with the test email `benjamin+test…@act.place`, dated 2026-05-13. It's the surfaced grant *universe* (ARC research projects, $44M Aboriginal Housing Office tenders, QLD Arts grants 2012-19), not grants Goods pursued. **This reverses the prior "Grants = merge target" assumption** — there is nothing here to migrate into Supporter Journey; the real Goods grants are already in Supporter Journey.
2. 🔴 **Centre Canvas supplier misfiled in Buyer** (`UozRRvtkcc8XvKuKevMP`) — the one carried-over item. Needs your explicit abandon/move.
3. 🟡 **Double-count watch:** the "A Curious Tractor" org pipeline holds historical *won* deals that overlap Supporter Journey — Fairfax Goods Grant/VFFF $50,000, First Greate Bed $37,620 (Centrecorp), Central Australian Pilot $53,900 (Centrecorp), Weave Beds Utopia $85,712 (Centrecorp). Anyone summing both boards double-counts. (The LOI tracker only reads Supporter Journey, so the tool is safe.)
4. 🟡 **Match-gap named** (§2): GHL "cash" $846K vs verified-paid $588K; $258K is unreconciled.
5. 🟡 **WHSAC $1.7M** at first stage + **Centrebuild/Centrecorp** stale-looking Buyer opp — pipeline-value hygiene.
6. 🟡 **Grant tagging:** grants inside Supporter Journey (FRRR, VFFF, QIC, AMP…) don't appear to carry a `grant` tag — the routing decision wants `grant`. Minor.
7. 🟡 **1 unrouted Goods inquiry:** Laura McConnell Conti (gokindly) stuck in Universal Inquiry "Needs Assessment".
8. 🟢 **Supplier CRM is complete.** All 5 real BOM suppliers are in GHL. The only `supplier-quotes.ts` entry not added is the generic "Hardware Supplier" (end caps). No new supplier contacts required.

---

## 5. WRITE-PLAN — every proposed write (NOTHING executed yet)

### A. Supplier misfile (Tier 2 GHL write — needs your word)
- **A1 ⚠️ Centre Canvas opp `UozRRvtkcc8XvKuKevMP`.** Recommend **set `status: abandoned`** — suppliers are a CRM *list* not a pipeline (your 2026-05-30 decision), so it shouldn't be an opp at all; Centre Canvas is already a tagged contact. Alternative if you'd rather keep a record: you create a "Goods — Suppliers" pipeline shell in the UI and I move it there. *(Auto-abandon was classifier-denied last session pending your explicit go.)*

### B. Suppliers to add (sweep result)
- **B1 ✅ No new BOM suppliers to add** — all 5 are in. "Hardware Supplier" stays out (generic).
- **B2 ⚠️ Non-BOM vendors** found in cost data (freight Sydney→Alice ~$874/shipment; Samuel Hafer design consultancy $19,500; Joseph Kirmos facility labour) are *vendors/contractors*, not BOM component suppliers. Recommend **NOT** tagging them `goods-supplier` (that tag = the emailable component-supplier list). If you want a vendor CRM, say so and I'll add them under a separate `goods-vendor` tag.

### C. Supplier contact enrichment (Tier 2 — low risk, needs your word)
- **C1 ✅ Add phones from `supplier-quotes.ts`:** Centre Canvas `08 8952 2453`, DNA Steel `08 8953 7355` → onto their GHL contacts.
- **C2 ⚠️ Missing emails** (Centre Canvas/Wayne, Coastal Fasteners, Envirobank) — you hold these; send them and I'll write the email field.

### D. Buyer Pipeline hygiene (Tier 2 — your call per opp)
- **D1 ⚠️ WHSAC $1,700,000** — confirm or reset the value, and stage up if it's real (it's a $1.7M number sitting at "Outreach Queued").
- **D2 ⚠️ Centrebuild/Centrecorp opp** — Centrecorp declined 3 quotes ("in discussion"). Move to "Negotiating"/"In Conversation" reality or mark parked. Your call.

### E. Legacy boards (Tier 2/3 — your call)
- **E1 ✅ Update the decision record:** "Grants (legacy) = merge target" → **"Grants (legacy) = Grantscope prospect dump, NOT a Goods source; do not migrate."** (Doc/memory edit, Tier 1 — I can do now.)
- **E2 ⚠️ Optional cleanup:** the 435 Grantscope prospects are noise on the Grants board. Leave as-is (Grantscope's output) **or** you decide to archive the obviously-irrelevant research grants. Bulk status changes are Tier 3 — explicit go only, and probably not worth it.
- **E3 ✅ ACT org pipeline:** leave the historical won deals as a record; I'll just **note the double-count overlap** in the funding reconciliation (no write).

### F. Routing fixes (Tier 2 — needs your word)
- **F1 ⚠️ Laura McConnell Conti** (Universal Inquiry) → route into Buyer or Supporter Journey, or action/close.
- **F2 ⚠️ `grant` tag** on the grant-type Supporter Journey opps (FRRR/VFFF/QIC/AMP/…) to honour the routing rule. Batch tag-add (append-only, safe). Your call.

---

## 6. Notion / strategy relay (Tier 2 Notion writes — needs your word)

What this sweep feeds back, by QBE area:

- **Area 10 — Investors & Capital Raising / the QBE match:** Supporter Journey is the live source. Relay: the cash-tier $846K **and** the $258K reconciliation gap (§2), the $4.29M cultivation pipeline (QBE $2M, REAL $2M, Minderoo $200K), and **$0 in a signed-LOI "Committed" stage** — i.e. the LOI ladder's committed rung is empty, which is the QBE-match story. → Update the QBE diagnostic DB funding fields + the canonical numbers sheet.
- **Area 6 — Process & Technology / operating systems:** the GHL hygiene items (435-grant pollution, Centre Canvas misfile, double-count overlap) are data-quality findings → feed `/admin/operating-systems`. Note: Supporter Journey was updated 2026-05-29 (fresh), so the earlier "CRM ~64d stale" flag is for a different surface, not this pipeline.
- **Proposed Notion write:** one "GHL pipeline state — 2026-05-30" note under the QBE diagnostic, summarising §2 + §4, linked from Area 6 and Area 10. I draft it; you approve before it posts.

---

## 7. Open questions for you

1. **Centre Canvas (A1):** abandon the opp, or create a Suppliers pipeline shell for me to move it to?
2. **Vendors (B2):** do freight / design-consultancy / facility-labour belong in a `goods-vendor` CRM, or stay out?
3. **WHSAC $1.7M + Centrebuild (D1/D2):** real numbers, or reset?
4. **Match definition:** confirm only Xero-verified-paid + signed-doc counts toward QBE (i.e. exclude the $258K GHL-only stewarding) — yes?
5. **Notion relay (§6):** post the pipeline-state note to the QBE diagnostic? Which area page(s)?

---

*Read-only recon. The moment you approve a subset of §5/§6, I execute just those (Tier 2 writes, one confirmation each per your rules) and report back.*
