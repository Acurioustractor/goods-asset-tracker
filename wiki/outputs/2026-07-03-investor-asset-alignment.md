# Investor Asset Alignment: QBE $400K Raise

As at 2026-07-03. Canon: THE ASK AU$400,000 signed match-eligible catalytic capital, due 31 Aug 2026, signed today AU$0. LEAD STACK AU$475,000 = SEFA $300,000 + Snow $100,000 + Centrecorp $75,000.

## 1. STATUS

Structurally close, not funder-clean: the money spine is correct in canon and on the teaser deck, but the anchor SEFA send doc contradicts itself ($300K on page 1, $250K on the page-3 stack), the old $250K SEFA / $425K stack drift still survives on the SEFA PDF, the full deck, /pitch and the Notion "Start Here" front door, the mandatory QBE credit line is absent from nearly every funder-facing surface, and no consent-cleared human hero photo exists. Do not send until the SEFA-class drift and the credit line are fixed.

## 2. THE MATRIX

Legend: send PDF and design surface and live page marked current/aligned, stale, or missing. Photo consent: cleared / no-face / RED (needs Ben) / BLOCKED.

| Ask | Send PDF | Design surface | Best photo | Best video | Live page |
|---|---|---|---|---|---|
| SEFA $300K (anchor) | STALE (sefa-brief: $250K/$425K survive p3, contradicts $300K p1; no credit line) | STALE (invest-funder-card: no $300K anchor, no credit line; invest-onepager no credit line/as-at) | facility-full-site.jpg (no-face) | recycling-plant-desktop.mp4 (no-face) | STALE (/cost-story clean but no credit line; /sites/cost-lab missing named stack, badge 3 Jun) |
| White Box SELF $250K | MISSING (SELF EOI not rendered) | STALE (invest-onepager: no credit line/as-at) | heat-press-full.jpg (no-face) | recycling-plant-desktop.mp4 (no-face) | STALE (/sites/qbe-readiness: Grants ~$500K breaks ask total, no credit line, "Scale on country") |
| Minderoo $200K | MISSING (no dedicated brief) | STALE (invest-deck-full slide 14: $250K SEFA, generic $425K stack) | goods-plastic-journey.jpg (no-face) | recycling-plant-desktop.mp4 (no-face) | STALE (/impact clean but no credit line; /pitch has $250K drift) |
| SEDI $120K | MISSING (grants-in-motion, no bespoke doc) | STALE (invest-stat-band/impact-stats: no credit line, no as-at) | goods-plastic-journey.jpg (no-face) | hero-desktop.mp4 (no-face) | STALE (/impact: no credit line) |
| Snow $100K | STALE (snow-brief: anchor "$100K to $200K" not locked to $100K; no credit line) | STALE (invest-match-progress: no credit line/as-at) | mykel.jpg (cleared) | mykel-building-the-bed.mp4 (cleared) | STALE (/investors: em dashes + arrows, no credit line) |
| LendForGood $100K | MISSING (Jay origination draft not rendered) | STALE (invest-teaser-deck: figures OK, credit line absent, no date) | facility-full-site.jpg (no-face) | recycling-plant-desktop.mp4 (no-face) | STALE (/pitch: $250K drift) |
| First Nations Clean Energy $80K | MISSING (grants-in-motion) | STALE (invest-stat-band/impact-stats) | facility-full-site.jpg (no-face) | recycling-plant-desktop.mp4 (no-face) | STALE (/impact: no credit line) |
| Centrecorp $75K | STALE (centrecorp-brief: $550 "verified", 130 vs 109 beds, revenue/match blend, no credit line) | STALE (87-bed Utopia proof + community-ownership chart; no credit line) | Utopia community-build.jpg (RED) fallback goods-community-ownership-v2.png (no-face) | utopia-good-news-full.mp4 (caveat: confirm no un-cleared faces foregrounded) | live /field-notes/utopia-may-2026 (not re-audited this pass) |
| Metro $60K | MISSING (broker enquiry + equipment schedule not rendered) | STALE (invest-stat-band) | heat-press-full.jpg (no-face) | stretch-bed/assembly.mp4 (no-face) | STALE (/cost-story: arrows, no credit line) |
| VFFF $50K | MISSING (grants-in-motion) | STALE (invest-stat-band/impact-stats) | goods-community-ownership-v2.png (no-face) | hero-desktop.mp4 (no-face) | STALE (/impact: no credit line) |
| FRRR SRC $50K | MISSING (grants-in-motion) | STALE (invest-stat-band/impact-stats) | goods-plastic-journey.jpg (no-face) | recycling-plant-desktop.mp4 (no-face) | STALE (/impact: no credit line) |
| Sisters of Charity $20K | MISSING (grants-in-motion) | STALE (impact-stats) | mykel.jpg (cleared) | mykel-building-the-bed.mp4 (cleared) | STALE (/impact: no credit line) |
| ANZ Seeds $15K | MISSING (grants-in-motion) | STALE (invest-stat-band) | facility-full-site.jpg (no-face) | stretch-bed/assembly.mp4 (no-face) | STALE (/impact: no credit line) |

Read of the matrix: every send PDF is either stale (the 3 that exist: SEFA, Snow, Centrecorp) or missing (the other 10). No funder-facing design surface or live page currently carries the mandatory QBE credit line, so almost every design/live cell is stale on that alone. Only the teaser deck carries the correct $475K / SEFA $300K figures.

## 3. STALE (ranked, worst first)

Every CONFIRMED drift. Worst = wrong money on a real send doc, then wrong money on a live page, then the front door, then softer errors.

1. sefa-loan-application-brief (THE anchor send doc, self-contradicting). Found: page-3 stack table SEFA $250K (HTML 289), subtotal $425K (292), next-step band "$250K to $400K" (305), in-brief provenance "$250K + $100K + $75K = $425K" (318), sidecar header "$250K anchor of ~$425K" (line 7). Should be: SEFA $300,000, subtotal $475,000, band "$300K to $400K". Compounded by sidecar line 54 falsely claiming "single occurrence of the old figure", which let the incomplete re-render ship. Page 1 already reads $300K, so the same PDF disagrees with itself.
2. /pitch and /pitch/document (live gated investor pages). Found: content.ts L603 fundingLines[0].amount "$250,000" renders SEFA at $250K on both surfaces; visible stack sums to $425K; content.ts L737 funders[0].type "target $250K" is a latent trap. Should be: $300,000, stack reads $475,000. Root-cause one-liner.
3. invest-deck-full slide 14 (Minderoo/LendForGood deck). Found: "Concessional / repayable lead, no ownership gate, $250K" plus generic unnamed rows totalling $425K, no total shown. Should be: named LEAD STACK SEFA $300K + Snow $100K + Centrecorp $75K = $475K, mirroring the already-correct teaser slide 6.
4. Notion "Start Here" front door (first thing a funder lands on). Found: leads with revenue $741,111 and never names SEFA $300K or the $475K stack. Should be: lead with THE ASK ($400K, due 31 Aug, $0 signed), name SEFA $300K and the $475K lead stack; keep accountant-signed $713,827 as the revenue figure, not $741,111 as the headline.
5. /sites/qbe-readiness (White Box gated surface). Found: Grants line "~AU$500K" (line 106); named grants (Snow $100K + Centrecorp $75K + VFFF $50K) total ~$225K, and with SEFA broken out the stack overshoots the stated AU$900K to $1M ask. Should be: reconcile to the $475K lead stack so the totals tie.
6. snow-first-mover-brief. Found: "recoverable anchor of AU$100K to $200K" (line 104) plus "anchor figure to be set" note (172). Should be: locked AU$100,000 ($200K is Minderoo's number).
7. centrecorp-nextround-brief + Q2.md. Found: per-bed cost "$550 (verified, Day 4 unit economics)" (Q2 line 113), no canon $550 exists; "$832,832 raised" gross-of-voided (Q2 127) vs $123,332 paid; HTML says ~130 beds (119) while Q2 says 109 (122). Should be: drop the "verified" tag (cost canon is marginal 685 to 426 to 421, break-even 338 beds/yr), caption $832,832 gross against $123,332 paid, pick one bed number.
8. invest-funder-pipeline.html board. Found: Bucket 2 count "15 named plus 8 qualifying" (=23) with only 12 chips rendered (line 223). Should be: Workbench = 20 (33-row pipeline DB = 13 QBE-priority + 20 Workbench), render the matching chips. Count/cosmetic, not dollars.
9. /sites/cost-lab + /sites/qbe. Found: hero badge literal "3 June 2026" (qbe-site-workspace line 691); no named lead-stack figures on either page (omission, generic "~$400K" only). Should be: badge 3 July 2026; add named $475K stack with match progress $0/$400K.
10. /stretch-bed + /process (product accuracy a reviewer will catch). Found: "ready to click together in five minutes flat" (process line 119, canon-banned mechanic); openGraph "hydraulic-pressed legs" (line 49) contradicts the page's own heat-press copy; "screws and bolts that hold each leg together" contradicts stretch-bed page's "no screws". Should be: thread-poles/tension language, "CNC-cut from heat-pressed HDPE sheet", one consistent fastening story.
11. sefa-brief cost table (low). Found: On Country-scale marginal $415.74 / break-even 399 (lines 226, 229). Should be: canon On Country-scale marginal 421 (Factory column $425.74 / break-even 338 already matches). ~$5 modelled gap.
12. Stale dates (low, but they read as neglected docs). sefa-brief masthead "27 June 2026" + cost-model notes (216/232/315); /pitch/document cover "Updated 1 July 2026" (predates the 3 Jul SEFA decision); /sites/qbe-readiness "Now, 26 June 2026", "June 2026", "(2026-06-13)", and a "1 July 2026" milestone now in the past.

## 4. MISSING

Priority asks with no share-ready send asset (10 of 13):
- White Box: SELF EOI not rendered to a send doc.
- Minderoo: no dedicated brief (relies on the stale full deck).
- LendForGood: Jay origination draft not rendered.
- Metro: broker enquiry and equipment schedule not rendered.
- SEDI, First Nations Clean Energy, VFFF, FRRR, Sisters of Charity, ANZ Seeds: grants-in-motion with no bespoke send doc; only a "canonical numbers sheet" is intended and it is not confirmed rendered.

Consent-BLOCKED or RED assets at risk of funder-facing use (pull or clear before any funder sees them):
- Jaquilane testimony (jaquilane-testimony.mp4 + overlays) is wired LIVE on /story with her name, face and audio, and she is NOT on the cleared-voices allowlist. Most urgent. Pull or clear before /story is funder-facing.
- karen-mykel-draft-v3.mp4 ledger cut carries 4 face-consent publish blockers (girls, boys, beds-Utopia, Mykel-overlay family) plus placeholder music. Do not ship in any funder cut.
- Sally/Georgina Tennant Creek photo is BLOCKED (neither on the allowlist).
- stretch-bed-kids-building.jpg (children) is RED. Never use in funder material without written guardian clearance.
- Centrecorp's best photo (Utopia community-build.jpg) and all Utopia frames are RED (names unconfirmed); utopia-good-news-full.mp4 is cleared for the named speakers but confirm no un-cleared faces are foregrounded before wider reuse.
- Hero gap: no confirmed-cleared, face-clear, emotional community hero exists today. facility-full-site.jpg is the only safe hero and it lacks human warmth. The golden-hour frame (community-testing-bed-golden-hour.jpg) is the highest-value unlock and is blocked only by consent, not quality.

Other asset gaps: no photograph of the community-ownership handover (the core of the recoverable-grant ask, chart-only today); washing machines have zero video and no in-use shot with Dianne Stokes; no motion piece for THE ASK; no local portraits for cleared voices Dianne Stokes, Cliff Plummer, Ivy Johnson (pull from EL). Verify every chart PNG (where-750-goes, cost-curve, breakeven, sankey-money, community-ownership-v2) reflects the current spine ($475K, SEFA $300K, 2,660kg) before shipping.

## 5. CUT (guff and voice hits)

Exact quote, then tighter fix.

1. "Goods on Country — Investor Deck" (full-deck title tag) to "Goods on Country: Investor Deck" (em dash renders in the browser tab and export metadata).
2. "<td>&mdash;</td>" (sefa-brief stack subtotal, line 292) to an empty cell (literal em dash in the rendered PDF).
3. "One Alice Springs provider sells $3 million of washing machines annually into communities — most ending up in dumps." (/pitch/document) to "One Alice Springs provider sells $3 million of washing machines a year into communities. Most end up in dumps."
4. "your dollar does roughly twice the work" (snow-brief, repeated 4x) to state it once with the number: "QBE matches at least 1:1, so $100K of repayable capital pulls in up to $100K more." Cut the other three.
5. "which is the heart of the work becoming unnecessary" (snow-brief, line 145) to "structured to convert toward community ownership of the production plant over time."
6. "This work is done on country, with country, for country." (centrecorp Q2.md, line 151) to "This work is done On Country, with Country, for Country."
7. "A committed contribution would also count as match-eligible external capital under QBE's Catalysing Impact program" (centrecorp brief) to keep the bed order as revenue and frame only a separate unrestricted contribution as match-eligible, with match rules confirmed in writing (as written it double-counts a commercial purchase as QBE match).
8. "The $130 fair wage sits INSIDE COGS — the green co-op margin is ON TOP of dignified paid work." (/investors) to "The $130 fair wage sits inside COGS. The green co-op margin sits on top of dignified paid work." (also strip the arrows-in-prose "INSTITUTIONAL SALE -> COMMUNITY CO-OP" and "ACT brokerage -> debt service").
9. "Let's talk about the right instrument for your mandate." (funder-onepager, line 89) to "We can structure this as a loan, a recoverable grant, or a blend."
10. "Real jobs, real skills, and the skills stay." (next-phase-onepager, line 81) to "Real jobs and real skills that stay in community."
11. "...when enterprise grows through action, not just in Australia, but everywhere communities want to manufacture their own future." (/pitch/document) to a concrete claim: the ~30 beds/week capacity, or the transfer-to-community milestone with a date.
12. "Ownership pathway is proposed/co-designed, not complete." (qbe-site-workspace, line 476) to "Ownership pathway is proposed and shaped with community, not complete." ("co-design" is banned.)
13. "ready to click together in five minutes flat" (process, line 119) to "a family can thread the poles and tension the bed in about five minutes, no tools."
14. "Signed FY revenue, accountant-signed" (invest-stat-band, line 74) to "FY revenue, accountant-signed carve-out."

## 6. DO-NEXT

Highest-leverage first. Tier 1 = local repo edits and re-render via design/brand/kit/render.sh (confirmed executable). Tier 2 = push to Claude Design / edit Notion. Tier 3 = the sends (Ben, gated).

1. [Tier 1] Fix and re-render the SEFA brief. This is the anchor send doc and it contradicts itself today. Replace every surviving $250K with $300K and $425K with $475K (HTML 289, 292, 305, 318; sidecar line 7), correct sidecar line 54's false "single occurrence" note, remove the literal &mdash; (292), add the credit line to the brief and the intro email, bump "27 June 2026" to 3 July, then re-render.
2. [Tier 1] Edit content.ts L603 SEFA "$250,000" to "$300,000" (and L737 "target $250K" to "$300K") and rebuild. One line fixes /pitch, /pitch/document and makes the visible stack read $475K. Highest surface-per-edit ratio.
3. [Tier 1] Rewrite invest-deck-full slide 14 to the named $475K stack (SEFA $300K, Snow $100K, Centrecorp $75K) mirroring the teaser, and fix the em dash in the deck title. Re-render both the deck and its .resolved.html.
4. [Tier 2] Rewrite the Notion "Start Here" front door to lead with THE ASK ($400K, due 31 Aug, $0 signed) and name SEFA $300K and the $475K stack. Keep $713,827 as the accountant-signed revenue figure, not $741,111 as the headline.
5. [Tier 1] Lock the Snow brief anchor to $100,000 (line 104 and the "anchor to be set" note 172), cut "twice the work" from 4x to one QBE 1:1 statement with the number, add the credit line, re-render.
6. [Tier 1] Fix the Centrecorp brief: drop the "$550 verified" tag, reconcile 130 vs 109 beds to one number, split the bed-order revenue from any catalytic match (double-count risk), caption $832,832 gross against $123,332 paid, add the credit line, run the voice sweep (On Country caps, units no-space, em dashes out), re-render.
7. [Tier 1] Fix /sites/qbe-readiness: change Grants "~$500K" to the named ~$225K so the stack ties to the ask, add the credit line, capitalise "Scale On Country", refresh the stale June dates.
8. [Tier 1] Add the credit line "Catalysing Impact, powered by Social Impact Hub, in partnership with QBE Foundation." to every funder-facing surface currently missing it: all four boards, invest-onepager, invest-funder-card, teaser deck, full-deck close slide, the SEFA/Snow/Centrecorp PDFs and the SEFA intro email, /investors, /cost-story, /impact, /sites/qbe, /sites/cost-lab. Systemic trust signal.
9. [Tier 1] Update the /sites/cost-lab hero badge from 3 June to 3 July, and add the named $475K stack with match progress $0/$400K to /sites/qbe (currently generic "~$400K" only).
10. [Tier 1] Repo-wide voice sweep: strip em dashes and arrows-in-prose from /investors, /cost-story, /impact, landscape.html and both decks; capitalise "On Country"; remove "co-design"; fix "200 kg" to "200kg"; fix the "click together" and "hydraulic-pressed" product errors.
11. [Tier 2] After the re-renders, push the refreshed decks, one-pagers and boards to Claude Design (project b333c5aa) via DesignSync and verify each renders (DesignSync register reports success without updating the index, so eyeball the render).
12. [Tier 3, Ben, gated] Consent gate before anyone sends: pull or clear Jaquilane on /story, do not ship karen-mykel-draft-v3, keep Sally/Georgina and kids-building out of funder use, confirm Utopia names for one ship-ready Centrecorp image, and clear the golden-hour hero subjects (single highest-value photo unlock). Then the 5 sends (SEFA at $300K first) only after items 1 to 4 land; Tim Fairfax / Katie Norman by 10 Jul.
