---
title: SIH Impact Investment Readiness Diagnostic V4, sign-off and corrections memo
date: 2026-05-19
status: ready to send
audience: Jay Boolkin (SIH), Matt (PIN diagnostician), QBE Catalysing Impact Steering Committee
purpose: Sign off on the V4 diagnostic with a factual corrections memo, plus drafted reply confirming QBE hackathon challenge
inputs:
  - /Users/benknight/Downloads/ACT_GOC Impact Investment Diagnostic V4 130526.pdf
  - wiki/outputs/2026-04-25-qbe-diagnostic-readiness-ledger.md
  - wiki/outputs/2026-05-12-* (financial model v0.1 build, /impact rewrite, eloise outreach)
companions:
  - thoughts/shared/qbe-program/diagnostic/ (10-topic working pack)
  - wiki/articles/governance/ai-human-in-loop-policy.md
---

# SIH Diagnostic V4 Sign-off Package

## Verdict

Sign off, with a short corrections-and-updates memo to Matt.

The report is fair, well-structured, and the priority opportunity areas (financial model, production cost sensitivity, market research, governance, ToC / MEL, risk register) are exactly the right six. Nothing in it is wrong about who we are or what we are doing. What it needs is a factual refresh on three numbers and an acknowledgement that five of the six priority gaps already have v0.1 work since the 1 May workshop. Without that, the report reads as if Goods is 18 days more behind than it actually is, which hurts when the QBE Steering Committee reads it in October.

## Cross-check summary

### Factual corrections (3)

| Where in V4              | What V4 says                                     | What is true now                                                                                                             | Source                                                                                          |
| ------------------------ | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Exec summary + Section 4 | Cumulative revenue approximately $537,595        | $684,911 across 243 invoices (Ingkerreke $103K excluded as Oonchiumpa-linked)                                                | Xero reconciliation 12 May, `act-global-infrastructure/scripts/report-goods-financial-day1.mjs` |
| Section 4                | No standing inventory yet                        | Still true on inventory, but Stripe ecommerce went live 18 May 2026 with $1 smoke test passed                                | Repo commits `225e5e9`, `a3df417`, `e925b7a`                                                    |
| Section 8                | Two founders are the only workers on the project | True at headcount level, but Fred Campbell (Oonchiumpa cultural lead) and a production cohort are the next-ring contributors | Compendium                                                                                      |

### Material updates since the 1 May workshop (6)

Of the six priority opportunity areas Matt listed, five have v0.1 work that did not exist at the workshop.

| Priority area                         | State at 1 May 2026                                   | State at 19 May 2026                                                                                                                                                                                              |
| ------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Financial model + 3yr forecasts       | Not built                                             | v0.1 closed 12 May. 36-month cashflow, three scenarios (Base / Upside / Downside) with cash troughs at -$94K / -$15K / -$171K. 12-instrument capital stack across 6 layers. Buffer policy with 4-state framework. |
| Production cost sensitivity           | Not built                                             | Day 4 v0.1 done 12 May. $550 today at ~15/mo, $479 at Y1 (1,500/y), $351 at Y3 (5,000/y), $270 at Vision 2030 (12,000/y).                                                                                         |
| Theory of Change / MEL                | Materials more aspirational than active               | /impact page rewrite shipped 12 May. 20 public metrics tagged: 6 verified / 5 modelled / 6 estimated / 1 design / 2 partial.                                                                                      |
| Governance and accountability         | Skills gap on commercial / social-enterprise scale-up | Butterfly Movement Ltd charity transition in flight. Founding directors confirming. Adds ~$300K Y1 and ~$2M cumulative over 3 years.                                                                              |
| AI / human-in-loop standard           | Flagged as concern by Matt                            | Formal policy adopted. No external collateral leaves without a core team member auditing and standing behind the contents.                                                                                        |
| Risk register with environmental risk | Working draft only                                    | Still working draft. Genuinely open.                                                                                                                                                                              |

Only market demand research sits genuinely untouched. That is the QBE skilled-volunteering project (Section 10, p10 of the diagnostic), and we accept the scope.

### Material context V4 does not currently name

- **Centrecorp Foundation.** $420K total commitment, $208K paid, $84.7K in draft, 109 Stretch Beds locked for Utopia Homelands delivering the week of 19 May 2026 (Batch GB0-156). Income type is grant on all three paid invoices, not commercial. Anchor donor-and-institutional-buyer relationship.
- **Asset register and field operations.** 496+ beds tracked, QR-stickered, GHL bidirectional contact linkage live since this month. Field-team admin flow live for scan-to-location logging.

### What V4 got exactly right

- "Founder time uncosted" call. Day 3 work has a sensitivity matrix; gate is Ben + Nic FTE % at $140K/yr replacement.
- Customer segmentation prompt. Day 5 work split into 7 segments; whether that is sharper than 3 core channels is a real question for the SIH advisor.
- "Depth of thought came through verbally, less so on paper." Strongest single piece of feedback in the report. Drove the AI / human-in-loop policy.
- Recent volatility in funder timing leading to cashflow buffer policy. Day 7 work has the four-state framework.

### What we do not push back on

- 4/7 score on Financial Management. Honest. v0.1 lifts it but does not close it.
- 5/8 on Governance. Butterfly closes most of this but is not yet papered.
- Production Cost Estimates as the SIH advisory project. Right choice.
- Market Demand Research as the QBE skilled-volunteering project. Right choice. Distinct from the hackathon.

---

## Reply to Jay (paste-ready)

> Hi Jay,
>
> Thanks for the nudge.
>
> **Diagnostic sign-off.** Matt's V4 reads true to us. We are happy to sign off with a short corrections-and-updates memo for the file, attached below. None of it changes Matt's six priority opportunity areas, which we accept in full. The updates are factual refreshes (the cumulative revenue number has moved, Stripe ecommerce went live this week) and a note that five of the six opportunity areas now have v0.1 work since the 1 May workshop. We want that on the record so the Steering Committee in October sees current state, not workshop-day state.
>
> We also want to acknowledge Matt's observation about AI-drafted versus founder-authored collateral. That is the most useful single piece of feedback in the report. It is now a formal Goods policy: no external collateral leaves without a core team member auditing, owning the Q&A, and being able to defend the contents. Future SIH submissions will reflect that standard.
>
> **QBE hackathon.** Yes, we have a tight day-shaped challenge.
>
> > **How might we convert a pipeline of warm institutional relationships (Centrecorp tranches, NT Housing, Homeland Schools, NPY) into the three-plus signed letters of intent SEFA and QBE Foundation need to release matched capital by 31 August 2026?**
>
> Context: relationships are strong, paper is thin. We have a draft LOI template and a B2B pipeline currently managed informally. A QBE-employee day with B2B sales-operations, contracting and credit-team experience could pressure-test our cadence and template, then run a tabletop on the one or two deals closest to signature. Output: a sales-ops playbook plus at least one LOI ready to go out the door the following week. This sits nicely alongside the SIH skilled-volunteering market-demand-research project from Matt's report (top-down sizing) by doing the bottom-up closing motion.
>
> Happy to take a scoping call whenever suits. Corrections memo below.
>
> Warm regards,
> Ben

---

## Corrections and updates memo (paste-ready attachment)

> **Goods on Country: Corrections and updates to SIH Impact Investment Readiness Diagnostic V4 (13 May 2026)**
>
> **Factual corrections**
>
> 1. Cumulative revenue is $684,911 across 243 Goods-tagged invoices (FY26 YTD $435,026; FY25 $249,885), after excluding four Ingkerreke invoices totalling $103,099 that are Oonchiumpa-linked, not Goods. The $537,595 figure in the report was the Xero-tagged-grants-only anchor used earlier.
> 2. All revenue is currently sitting in the ACT Foundation entity (ACT-ST), zero in ACT Ventures (ACT-VC), including commercial sales. Tax and DGR review pending with Mint Ellison.
> 3. Direct ecommerce went live on 18 May 2026 (Stripe LIVE, $1 smoke test passed). Standing inventory remains a future state; ordering does not.
>
> **Material updates since the 1 May workshop**
>
> 4. GOC-specific financial model v0.1 closed 12 May. 36-month cashflow, three scenarios (Base / Upside / Downside), 12-instrument capital stack across six layers, four-state buffer policy. Reconciliation, P&L summary and scenario CSVs available on request.
> 5. Production cost sensitivity v0.1 modelled across four volume tiers from current ($550/bed at ~15/mo) to Vision 2030 ($270/bed at 12,000/y). The SIH advisory project on cost modelling is the right next layer and we accept.
> 6. /impact page rewrite shipped 12 May. All 20 public metrics tagged (6 verified / 5 modelled / 6 estimated / 1 design / 2 partial), closing the "aspirational metrics presented as currently active" feedback from the diagnostic.
> 7. Butterfly Movement Ltd charity transition in flight. Closes the SIH-flagged scale-up advisor and accountability gap. Founding directors confirming (Kristy Bloomfield confirmed, Nic, Ben, Eloise Hall outreach in flight). Adds approximately $300K Year 1 and $2M cumulative over three years to combined operations.
> 8. AI / human-in-loop policy formalised. No external collateral leaves without a core team member auditing, editing and standing behind the contents.
>
> **Material context the report does not currently name**
>
> 9. Centrecorp Foundation is our anchor donor-and-institutional-buyer relationship. $420K total commitment, $208K paid across three grant-classified invoices, $84.7K in draft, 109 Stretch Beds locked for Utopia Homelands delivering the week of 19 May 2026 (Batch GB0-156).
> 10. Asset register is operational across 496+ beds with QR-stickered field-team flow and GHL bidirectional contact linkage live since this month.
>
> **What stands without amendment**
>
> The six priority opportunity areas (financial model, production cost sensitivity, market research, governance and accountability, ToC / MEL, updated risk register) and the maturity scoreboard are accepted as-is. The Production Cost Estimates tailored advisory and the Market Demand Research QBE skilled-volunteering scope are both accepted.

---

## Source links: where each claim in the memo lives

Every numbered point in the corrections memo above maps to one or more of these files. All paths are relative to repo root (`/Users/benknight/Code/Goods Asset Register/`).

### Factual corrections (1, 2, 3)

| Claim | Source files |
|---|---|
| Revenue $684,911 / 243 invoices / Ingkerreke exclusion | `wiki/outputs/2026-05-12-xero-day1-reconciliation.md` (full methodology + provenance, queried from ACT infra Supabase `tednluwflfhxyucgwigh`) |
| All revenue in ACT-ST not ACT-VC | Same file, section "All revenue is in entity_code = ACT-ST" |
| Stripe ecommerce live 18 May | `wiki/outputs/2026-05-18-stripe-ghl-launch-day.md` + repo commits `225e5e9`, `a3df417`, `e925b7a` |
| Fred Campbell + production cohort | `v2/docs/COMPENDIUM_MARCH_2026.md` + `v2/src/lib/data/compendium.ts` |

### Material updates since 1 May workshop (4, 5, 6, 7, 8)

| Claim | Source files |
|---|---|
| Financial model v0.1 closed 12 May | `wiki/outputs/2026-05-12-financial-model-scope.md` (8-week plan), `wiki/outputs/2026-05-12-financial-model-week1-kickoff.md`, then days 2-10: `wiki/outputs/2026-05-12-financial-model-day2-pnl.md` through `day10-butterfly-impact.md` |
| 36-month cashflow, three scenarios, cash troughs | `wiki/outputs/2026-05-12-financial-model-day6-cashflow-36mo.md` (base case) and `day9-three-scenarios.md` (base / upside / downside) |
| 12-instrument capital stack | `wiki/outputs/2026-05-12-financial-model-day8-capital-stack.md` |
| Four-state buffer policy | `wiki/outputs/2026-05-12-financial-model-day7-buffer-policy.md` |
| Unit economics $550 → $479 → $351 → $270 across volume tiers | `wiki/outputs/2026-05-12-financial-model-day4-unit-economics.md` |
| /impact page rewrite with 20-of-20 metric tags | `v2/src/app/impact/page.tsx` (live page) + `wiki/outputs/2026-05-12-impact-page-audit.md` (audit + tag taxonomy) + `wiki/outputs/2026-05-12-impact-page-qa-walkthrough.md` |
| Butterfly Movement Ltd transition + founding directors | `wiki/outputs/2026-05-12-eloise-outreach-draft.md` (founding director consent register + outreach draft) |
| AI / human-in-loop formal policy | `wiki/articles/governance/ai-human-in-loop-policy.md` |

### Material context not in V4 (9, 10)

| Claim | Source files |
|---|---|
| Centrecorp $420K commitment / 109 beds Utopia / grant-not-commercial | `wiki/outputs/2026-05-18-centrecorp-utopia-impact-report.md` (impact report) + `wiki/outputs/2026-05-18-centrecorp-utopia-outcomes-one-pager.md` (one-pager) + `wiki/outputs/2026-05-12-centrecorp-narrative-fixes.md` (narrative correction trail across the codebase) + `v2/src/lib/data/compendium.ts` (structured data, line ~280) |
| Asset register / 496+ beds / batch GB0-156 / QR sticker flow | `wiki/outputs/2026-05-15-asset-management-handover.md` + `wiki/outputs/2026-05-14-asset-register-trip-readiness.md` |

### Related but not in the memo

| Topic | File |
|---|---|
| QBE post-SIH action stack (supersedes April readiness ledger) | `wiki/outputs/2026-05-12-qbe-prep-resume.md` |
| SIH Tailored Advisory acceptance (Production Cost Estimates project) | `wiki/outputs/2026-05-12-sih-advisory-acceptance-draft.md` |
| April readiness ledger (10-topic working pack) | `wiki/outputs/2026-04-25-qbe-diagnostic-readiness-ledger.md` |
| Diagnostic source pack (10 topics in long form) | `thoughts/shared/qbe-program/diagnostic/00-INDEX.md` |

## Verification SQL for Matt (optional)

If Matt wants to verify the $684,911 number against ACT infra Supabase directly, here is the underlying query. He would need access to the `tednluwflfhxyucgwigh` project. The Ingkerreke invoices to exclude are INV-0275, INV-0276, INV-0277, INV-0278 (Oonchiumpa-linked, Xero retag pending).

```sql
SELECT
  income_type,
  SUM(total) AS total_revenue,
  COUNT(*) AS invoice_count
FROM xero_invoices
WHERE project_code = 'ACT-GD'
  AND type = 'ACCREC'
  AND status IN ('AUTHORISED', 'PAID')
  AND xero_id NOT IN (
    -- Ingkerreke (Oonchiumpa-linked, Xero retag pending)
    SELECT xero_id FROM xero_invoices
    WHERE invoice_number IN ('INV-0275', 'INV-0276', 'INV-0277', 'INV-0278')
  )
GROUP BY income_type
ORDER BY total_revenue DESC;
```

Expected output (Xero-tagged only, period 2023-07-01 to 2026-04-30):

| income_type | total_revenue | invoice_count |
|---|---:|---:|
| grant | $528,961 | (n) |
| commercial | $61,449 | (n) |
| (null) | $94,500 | 2 (Rotary + QIC, back-tag pending) |
| **Total** | **$684,911** | **243** |

## Next steps

- [ ] Commit the 19 newly ported May-12 files + this signoff doc + the uncommitted Centrecorp/GHL outputs in one logical commit
- [ ] Send reply to Jay with corrections memo (links now resolve on `main`)
- [ ] Confirm Nic alignment on LOI conversion playbook hackathon pick before sending
- [ ] Diary the 1-hour hackathon scoping call when Jay proposes a time
- [ ] Begin scoping Production Cost Estimates advisory engagement with SIH advisor
- [ ] Begin scoping QBE Market Demand Research skilled-volunteering project
- [ ] Confirm Ben + Nic FTE % allocations (Day 3 financial model gate)
