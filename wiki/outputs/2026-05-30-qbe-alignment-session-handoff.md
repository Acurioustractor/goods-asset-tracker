# Session Handoff — QBE alignment · SIH/QBE email · financial model v0.3

**Date:** 2026-05-30 · **Branch:** `feat/audience-comms-and-impact-reports` · **State:** all work independently verified (Gmail · Notion · Supabase · Xero · live GHL)

## Shipped this session
1. **Diagnostic-vs-now alignment read** — `wiki/outputs/2026-05-30-qbe-diagnostic-vs-now-alignment.md`. SIH diagnostic = **10 areas** (our 11/12 are internal lenses); 8/10 Vision + 7/10 Process are strengths; every priority gap is paperwork → *"strong proof, weak paperwork."* Has an appended "external projects RESOLVED" section.
2. **Notion QBE Diagnostic DB** (`cb3794d427914d72bf1036106d8116f5`) — Areas **2,3,6,7,10** "Next Build" fields updated: shipped-in-open-PR vs still-to-build; Area 3 flags the two external projects.
3. **SIH/QBE follow-up email** — Gmail **DRAFT, unsent**, threaded onto "Goods on Country – Diagnostic report"; To Jay, Cc Matt/Mal/Nic. Carries the advisory timeline + the hackathon **HMW = (a) buyer/demand** + the market-research-vs-hackathon clarify. Record: `wiki/outputs/2026-05-30-sih-qbe-followup-email.md`. ⚠ **Two drafts exist — delete the older b/c one.**
4. **The two "external projects" RESOLVED** (Gmail + 29-May Matt call): **SIH advisory** = production-cost Excel tool (Matt leads, 3 QBE-funded days; your 3-statement model → Matt **END JUNE**, workshop **mid-July**); **QBE = a one-day hackathon** (needed an HMW, now provided). Memory: `qbe_sih_advisory_hackathon.md`. Contacts: Matt `matt.allen@socialimpacthub.org` · Jay `jay@socialimpacthub.org` · Mal `malcolm.aikman@socialimpacthub.org` · Lauren Hicks `lauren.hicks@qbe.com` (**Gmail-only — not in GHL**).
5. **Financial model v0.3** — audited v0.2 → `…/qbe-investment-sweep/Goods-3-Statement-Model-v0.3.xlsx` (+ `.provenance.md`). 5 fixes: revenue reconciliation (**$732,211 = grant $611,462 + commercial $73,449 + untagged $47,300** bridge), breakeven note **378/1,882 → 338/1,679**, QBE cap relabel **$200–400K**, 2 flags. matt-bundle README points to v0.3; v0.2 retained. Audit: `wiki/outputs/2026-05-30-3-statement-model-v0.2-audit.md`.
6. **Finance basis pinned** — external check found **+$1,200 drift** (INV-0327 The John Villiers Trust now ACT-GD/paid; live mirror = **$733,410.79 / $650,910.79 / $82,500**). v0.3 pinned to the 29-May basis with drift documented. **Re-pull Xero before any external share; always say "Xero workpaper, not audited Goods revenue."**
7. **Live GHL verification** — this session's `ghl` connector works (the ACT-infra 401 is a separate connector). LOI tracker (**PR #50**) + audience tags (**PR #51**) confirmed against live data: Buyer **10** opps (Groote $1.7M, ALIVE $60K, NLC $70.8K — all early-stage), Supporter Journey **43**, Demand Register **105** (~158 total). **Centre Canvas now `abandoned`** (GHL-hygiene item closed). Match picture: real pipeline, **nothing at Committed/Paid — no signed LOIs yet** (gate still open).

## Current state
- **6 QBE PRs #47–52 OPEN, none merged** (repo has 9 open total). On branch `feat/audience-comms-and-impact-reports`.
- v0.3 model pinned to the **2026-05-29 Xero basis**.

## NEXT — ranked
1. **[Ben] Send the SIH/QBE email** — delete the duplicate draft first.
2. **[Ben + accountant] Book the ONE finance chat** — closes 8 of 9 model gates (opening cash · ACT→Goods carve-out · the $47,300/$94,500 revenue tagging · GST · inventory · R&D · sign-off).
3. **[Ben] Pick THE model file for Matt** — `Goods-Financial-Model.xlsx` vs `3-Statement v0.3` (the bundle calls the former "the live model"). Can reconcile to one.
4. **[Ben] Merge the 6 PRs + the human decisions** — QBE cap ($200K vs $400K), buyer pricing/entity-per-lane, which advisors→directors.
5. **[optional, me] Full $ rollup** across the 158 GHL opps; the Supporter-Journey funder opps need $ amounts for a real match rollup.

## Caveats
- "Shipped in which PR" = from PR descriptions/prior memory, **not** a fresh diff read (PR open-states *were* verified via `gh`).
- v0.3 finance basis is a 29-May snapshot; +$1,200 drift documented, not rebased.
- The **ACT-infra GHL connector needs reauth** (separate from this session's, which works) — reauth in that session via `/mcp`.
