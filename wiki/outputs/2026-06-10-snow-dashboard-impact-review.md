# Snow dashboard: UX review + research, 10 June 2026

Review of `/partners/snow/dashboard` (branch `feat/partner-dashboard-forward-scroll`, PR #110) against funder-reporting best practice and the Snow Foundation's own published strategy. Sources cited inline; health figures follow the verdicts in `wiki/outputs/2026-05-29-goods-health-evidence-appendix.md`.

## The headline finding

Snow Foundation publicly names "the Goods Project" inside its 2024 to 2030 rheumatic heart disease strategy, alongside the Deadly Heart Trek, Champions4Change, Orange Sky Laundry and Children's Ground (snowfoundation.org.au, "Statement of Intent: Snow Foundation Rheumatic Heart Disease Strategy"). Goods is their environmental-health, root-cause play in that portfolio. The dashboard never mentions health, skin, scabies or RHD once. That is the single biggest missed connection on the page.

Their grants FAQ also notes Indigenous health is "a focus area specific to existing partnerships" with no plan to expand. Goods' value to Snow is the deepening of a bet they have already made, and the page should reflect that standing.

## What the current page does well

- The counted vs modelled vs not-yet confidence system is genuinely best-practice. CEP grantee-report research and SSIR both find that honesty about uncertainty and missed targets builds funder trust. Snow's CEO names "humility, collaboration and transparency" as the cornerstones of their philanthropy, so the epistemic honesty is on-brand for the reader, not just for us.
- Output vs outcome framing ("a bed delivered is the output; who owns the means of making the next one is the outcome") matches what funders ask for.
- Live data from the asset register, consent-gated gallery and quotes, ownership ladder, forward kanban: all sound patterns.

## Gaps found in review

1. **No health pathway.** The Goods philosophy is "a good bed can prevent heart disease" (`v2/src/lib/data/content.ts:30`) and the wiki holds a fact-checked evidence appendix, yet the funder most invested in RHD sees no trace of it.
2. **Nothing Snow-specific beyond the logo.** Their verified $493,129.79 (Xero 3-year reconciliation, `wiki/outputs/funder-reports/snow/2026-06-09-snow-figure-reconciliation.md`), the FY25 $100K four-way split, Sally Grimsley-Ballard's Tennant Creek visit, Georgina Byron's and Sally's own words: none are on the page. "What did my support build" is the first question a funder report must answer (CEP), and the page does not answer it.
3. **First photograph arrives roughly 70 percent down the page.** Best digital impact reports (charity: water, GiveDirectly) lead with the human evidence and let data support it.
4. **CTA is generic.** "Help close the match" works, but it speaks our language, not theirs. Snow's published vocabulary: "bold ideas", "considered risks", "long-term, trusting partnerships", "honest relationships". (Their site does not use "courageous philanthropy"; do not put that phrase in their mouth.)
5. **Ownership scrollytelling spends a lot of empty vertical space** for five short paragraphs. Fixed in the follow-up pass: panel minimum height cut from 46vh to 30vh, padding tightened; the pinned ladder still advances correctly (the observer's active band is 20vh, comfortably under the new panel height).
6. **The washing machine had no story.** It appeared only as a fleet count, yet its arc (machines dying in the desert → Pakkimjalki Kari V1 on a Speed Queen base → cost-down R&D → a machine a family can buy for home) is the clearest product-development narrative Goods has, and Snow funded V1 directly. Fixed in the follow-up pass: a dedicated section with the four-step path, an honest price-path visual ($4,500 to $5,000 today, $1,000 to $2,000 resident-accessible target, labelled modelled, sourced to the May 2026 founder working conversation via `wiki/articles/products/washing-machine.md`), the live fleet line, the Groote Archipelago 300-machine enquiry labelled as a demand signal not an order, and the wiki's "still being solved" list rendered as honesty chips.

## Health-pathway claims cleared for funder use (per the evidence appendix)

- Crowding and inadequate washing facilities underpin recurrent strep infections that cause ARF and RHD (AIHW). Safe as stated.
- Housing for Health: 40 percent lower hospital separations for infectious disease across 71 communities. Safe as stated.
- 94 percent of new ARF cases in Australia are First Nations people (AIHW). Safe as stated.
- END RHD Endgame (Telethon Kids): the modelled prevention bundle (less crowding, better hygiene infrastructure, stronger primary care, better prophylaxis) reduces ARF and RHD cases by 69 and 71 percent. MODELLED, label it.
- Skin-infection arm of the strep-to-ARF pathway: recognised but emerging. Present as biologically plausible, never as settled proof.
- Never claim Goods independently reduces RHD (`wiki/articles/enterprise/02-social-objective-impact.md:261`). Contribution to a documented bundle, not attribution.
- Banned figures: "$250,000 per RHD surgery" (unsubstantiated; defensible figure is ~$70K per surgical admission, Cannon et al. 2018); "one in three children have scabies" (say "up to one-third", it is the top of a 16 to 35 percent range).

## Changes implemented in this pass (same branch)

1. New section "Why a bed is health hardware": the bed-and-washer to clean-bedding to healthy-skin to fewer-infections to less-RHD chain, each link graded, sourced lines above, explicitly framed as contribution inside the END RHD bundle, and naming that this is the same logic as Snow's own RHD strategy.
2. New config-driven section "What your support has built": verified cumulative figure, FY25 split, the visit history, Georgina's and Sally's quotes. Lives in `partner-dashboards.ts` as `funderImpact` so other partner skins can use it.
3. Hero: consented field photo brought up beside the headline; thesis line unchanged.
4. CTA and goal copy reframed with Snow's published vocabulary (trusting long-term partnership, bold ideas, root causes).
5. Nav rail updated for the two new sections.

## Sources

- Snow purpose and approach: snowfoundation.org.au/purpose/purpose-approach/ ("lasting social change", "considered risks", "bold ideas", "long-term, trusting partnerships")
- Snow RHD Statement of Intent: snowfoundation.org.au/news/statement-of-intent-snow-foundation-rheumatic-heart-disease-strategy/ (names the Goods Project in the RHD portfolio; "root social and environmental causes of RHD"; "First Nations-led")
- Georgina Byron on humility, collaboration, transparency: snowfoundation.org.au/news/georgina-byron-ceo-snow-foundation-talks-philanthropy-australia...
- CEP / SSIR on grantee reporting: outcomes over outputs, honesty builds trust, contribution over attribution (ssir.org "Prioritizing Impact Measurement in the Funding of Social Innovation")
- END RHD Endgame Strategy snapshot + Community Laundromats evidence brief: endrhd.thekids.org.au (69/71 percent modelled bundle; Remote Laundries analogue)
- AIHW "ARF and RHD are preventable diseases": environmental causes, burden statistics
- Housing for Health 40 percent: NSW Health program evaluation, via evidence appendix
- Snow money figures: `wiki/outputs/funder-reports/snow/2026-06-09-snow-figure-reconciliation.md` (Xero, $493,129.79, $0 outstanding); FY25 split `v2/docs/GOODS_COMPENDIUM.md:954`
- Quotes: Georgina Byron and Sally Grimsley-Ballard, `v2/docs/GOODS_COMPENDIUM.md:950-952`
