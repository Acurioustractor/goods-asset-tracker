# Goods CRM Build — Session Handoff & Pickup Prompt (2026-05-27)

Full sweep of the GHL pipeline + GrantScope buyer build, plus the scoped next workstream
(Gmail deep-reach → Notion QBE alignment). Read this first on resume.

---

## 1. What shipped this session

### GHL — Supporter Journey (funders) — DONE
- Ben created the **`Goods Supporter Journey`** pipeline in UI (id `JvBFYpVpyKsw899lkFgj`, 10 stages).
- Seeded **13 funders** at warmth-mapped stages with `goods-<band>` tags via `act-infra/scripts/seed-goods-supporter-journey.mjs`.
- Snow $402,930 + Centrecorp $123,332 → Stewarding/Reporting (hot); Homeland/OCS/Julalikari → Committed/Renewing (steady); VFFF/QIC/RedDust/Mala'la/TFN/FRRR/AMP → Cultivating (cooling); Rotary → Lapsed (cold).
- **Mala'la = Mala'la Health Service Aboriginal Corporation** (contact `Z6POQ8e2wtBKSWDuPLEx`); earlier search missed it (apostrophe) → dup stub created then cleaned, opp relinked.

### GHL — Buyer Pipeline cleanup → commercial-only — DONE
- Was 24 mixed records → now clean. Removed 1 test + 10 dup signal-copies + 10 funder/grant product-lines + PICC + a stray. Kept NLC Gapuwiyak.
- Decision: **Buyer Pipeline = commercial buyers only**; grant relationships live in Supporter Journey + Xero.
- Tooling: `act-infra/scripts/audit-goods-buyer-pipelines.mjs`, `cleanup-goods-buyer-pipeline.mjs` (restore snapshots written).

### GHL — Demand Register + GrantScope activation — DONE
- **Top-25 by fit_score** (community-controlled stores/health/councils) pushed into Demand Register / "Buyer Matched" with tags + `ghl_*` writeback (`grantscope/scripts/push-goods-top25-to-demand-register.mjs`). 26 entities now GHL-linked (was 1 of 4,952).
- **9 AGIL noise localities** dropped (GHL + DB cascade: 9 communities + 147 entities + 9 signals).
- **3 anchor buyers added** (Outback Stores, Miwatj Health, Tangentyere) with real ABNs + warmth fit floor 85.
- **ALPA over-match fixed**: 256 proximity-fanned rows → 1 network entity (community-null, fit 85).

### Docs + commits + PRs
- Operating model: `wiki/outputs/2026-05-27-goods-crm-pipeline-operating-model.md` (the canonical pipeline reference).
- PRs open: grantscope **#38**, act-infra **#106**, goods-asset-tracker **#26**. Restore snapshots committed for every destructive op. Nothing merged.

### Key learnings (carry forward)
- GrantScope + buyer DB = **shared ACT-infra Supabase `tednluwflfhxyucgwigh`** (same as Xero). GHL auth there = `GHL_API_KEY`. `exec_sql` RPC is **SELECT-only** → use PostgREST for writes.
- GHL MCP has **no create-opportunity tool** → create via `act-infra/scripts/lib/ghl-api-service.mjs` (`createGHLService()` = `GHL_PRIVATE_TOKEN` + `GHL_LOCATION_ID`).
- `fit_score` = government-contract evidence, NOT relationship warmth (under-rates warm buyers → hence the manual floor).
- GHL location `agzsSZWgovjwgpcoASWG`. Pipelines: Supporter Journey `JvBFYpVpyKsw899lkFgj`, Buyer `FjMyJM3YzWQFmKqR9fur`, Demand Register `UQsrmuqzxMSdCTklxEcG`.

## 2. Open items
- Merge PRs #38 / #106 / #26 (Ben's call).
- ALPA → 128 communities was postcode over-match; collapsed to 1 (re-expand to a verified store list only if Ben supplies it).
- Malala/Mala'la contact: enrich with a real person + email.
- Graduate any Demand-Register buyers with a named human contact into the Buyer Pipeline.

## 3. NEXT WORKSTREAM (the pickup) — Gmail deep-reach → Notion QBE alignment
Goal: find the **real people in the Goods orbit** from Gmail, cross-reference against the GHL pipelines we just built, and align it all into a **Notion strategy page** framed around **QBE** ($400K match-funding program) and other live opportunities.

Suggested steps:
1. **Gmail deep-reach** (Gmail MCP): search threads for Goods-connected people — funders (Snow, Centrecorp, VFFF, QIC, TFN, FRRR, AMP, Tim Fairfax/Katie Norman), buyers/communities (the top-25 + anchors), QBE contacts (SEFA Hannah, QBE Ventures Alex, Beck Parkinson), advisors (SIH/Jay, Eloise Hall, Kristy Bloomfield, Nic). Surface: who's active, last contact, what's pending. Don't send anything — read + map only.
2. **Cross-reference** the surfaced people against GHL contacts/pipelines (Supporter Journey, Buyer, Demand) — who's tracked vs missing.
3. **Notion page** (Notion MCP, under Goods. HQ / Enterprise HQ): align pipelines + Gmail relationship map + QBE program context into one "who's in the mix / what's our move" view. See [[enterprise_hq_build]], [[qbe_program]].

## 4. READY-TO-PASTE PICKUP PROMPT (use after /clear)

> Resume the Goods CRM work. First read `wiki/outputs/2026-05-27-goods-crm-build-handoff.md` and the `enterprise_hq_build` + `qbe_program` memories. The GHL pipelines (Supporter Journey, Buyer, Demand Register) are built + populated and PRs are open (grantscope #38, act-infra #106, goods #26).
>
> Now do the next workstream: (1) deep-reach in Gmail (Gmail MCP, read-only) to find the people in the Goods orbit — funders, buyers/communities, QBE contacts (SEFA Hannah / QBE Ventures Alex / Beck Parkinson), advisors — and map who's active + last contact + what's pending; (2) cross-reference them against the GHL pipelines (who's tracked vs missing); (3) build a Notion page under Goods. HQ that aligns the pipelines + the Gmail relationship map + QBE program context into one "who's in the mix / what's our move" view for QBE and other live opportunities. Read-only on Gmail (no sends); confirm before any GHL/Notion writes.
