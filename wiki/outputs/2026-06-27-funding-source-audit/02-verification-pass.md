# Verification pass: the chase-worthy top tier (2026-06-28)

> 12 of the strongest audit + GrantScope picks, re-checked by 3 web-research agents against their live pages. Verdict key: CONFIRMED (real, current, Goods can plausibly apply), PARTIAL (real but a gate, size, timing or geography caveat), DEAD / FALSE-POSITIVE (not applicable). This converts the agent-confidence list into a Ben-ready shortlist. Detail in `thoughts/shared/handoffs/funding-verification/`.

## CORRECTION (2026-06-28): NT RMF Round 2 is CLOSED, not live
A live re-check killed this row's earlier "CONFIRMED-ish (live)" verdict. The NT Recycling Modernisation Fund Round 2 (~$1.47M, grants up to $20K, 50:50, plastics priority) **closed on 28 February 2023** and has been closed for over three years. The audit had picked up the round announced in December 2022 and read the pool as currently available. Sources: Tyre Stewardship Australia and ACE Hub syndications, both giving a 28 Feb 2023 close. The companion **CENT (Circular Economy NT, $1.5M, grants from $50K)** is also closed (projects had to be operational by 30 June 2025; applications closed around January 2024). No currently-open NT recycling or circular-economy round was found for mid-2026 in public sources. This is the same lesson as the GrantScope false positives, applied to our own audit: a syndicated grant page is a lead, not a live deadline. Re-verify open/close dates on the source before treating any grant as chase-able.

## The net read
- **Two clean, no-gate, move-now repayable picks:** First Nations Finance and CEFC via NAB Green Equipment Finance. Outreach drafted in `03-outreach-drafts.md`.
- **One strong NT-plant play (open now):** Invest NT Business Investment Concessional Loans (rolling, $100K-$10M, NT-anchored + needs a private co-contribution, so it suits the On Country NT facility, not the multi-state raise). This is the live NT-anchored capex play now that the RMF/CENT grant rounds are both closed. Register interest for the next NT recycling-infrastructure round via GrantsNT / Circular Economy NT and get on the notification list, rather than chasing the closed Round 2.
- **Two GrantScope false positives killed:** NIAA IAS and the Education BEEF grant. The skeptic pass earned its keep, treat high `goods_relevance_score` rows as leads, not facts.
- **Circular-economy state grants are a "next-round + state-plant" watch,** not immediate: QLD CEIP (closed Jul 2024), Green Industries SA (closed Jul 2025), WA WasteSorted infra (round unconfirmed for 2026), CENT (between rounds).

## Repayable / debt
| Source | Verdict | Cheque | Gate | Pty-Ltd? | Open / deadline | URL | Note |
|---|---|---|---|---|---|---|---|
| **First Nations Finance** | CONFIRMED | not published (secured/unsecured + equipment/asset finance) | none (Indigenous-owned, lends to all) | yes (counts toward RAP) | ongoing | https://firstnations.co/ | Commercial (not concessional) repayable, national, no gate, fast. Best for working-capital / inventory bridging. |
| **CEFC via NAB Green Equipment Finance** | CONFIRMED (claim corrected) | ~$10K–$5M (NOT "$1M+ direct") | none | yes | open now | https://www.nab.com.au/business/loans-and-finance/vehicle-or-equipment/green-equipment-finance | 0.5% rate discount on recycling/manufacturing kit; finances the shred/melt/press plant, not working capital. |
| **Invest NT Business Investment Concessional Loans** | PARTIAL | $100K–$10M | none (NT-benefit scaled to size) | yes, if NT-anchored | rolling; current-round status unconfirmed; slow diligence | https://jobsfund.nt.gov.au/products-and-services/business-investment-concessional-loans | Concessional, but NT-only and needs a matched PRIVATE co-contribution (grants do not count). Fits the NT plant. |
| **NRFC (National Reconstruction Fund)** | PARTIAL | practically multi-million | none | yes | open year-round; long diligence (won't land by 31 Aug) | https://www.nrf.gov.au/ | Right sector (recycling), debt-or-guarantee no-equity, but sized for a much bigger raise. Park. |

## Circular-economy state grants (capex)
| Source | Verdict | Amount | Eligible | Round | URL | Note |
|---|---|---|---|---|---|---|
| **NT Recycling Modernisation Fund Round 2** | DEAD / CLOSED (re-checked 2026-06-28) | ~$1.47M pool (gone) | companies + Aboriginal orgs | **CLOSED 28 Feb 2023** | nt.gov.au (Circular Economy NT page) | Not live. Audit had read the Dec-2022 round as current. Watch GrantsNT / Circular Economy NT for the next NT recycling-infrastructure round; for the NT plant now, use Invest NT concessional loans + CEFC/NAB. |
| NT CENT (Circular Economy NT) | DEAD / CLOSED (re-checked 2026-06-28) | $1.5M pool, grants from $50K | NT businesses, 50:50 | CLOSED ~Jan 2024 (projects due operational 30 Jun 2025) | nt.gov.au CENT | Companion NT program, also closed. Same watch-for-next-round status. |
| QLD CEIP | PARTIAL | $250K–$750K (max 70%) | Pty Ltd / social enterprise, needs QLD ops | last round closed Jul 2024; no confirmed 2026 round | qld.gov.au circular-economy-investment-program | Best-fit facts, no gate; watch for next round. |
| Green Industries SA Circular Infrastructure | PARTIAL | $25K–$300K (to $500K) | SA business, needs SA facility | closed Jul 2025 | greenindustries.sa.gov.au | Amount confirmed; ping re next round when an SA plant is real. |
| WA WasteSorted Infrastructure | PARTIAL | ~$250K (2023-24; 2026 cap unconfirmed) | WA business/org | infra round not verified open 2026 | wasteauthority.wa.gov.au | Perfect scope fit; confirm infra round via wsg@dwer.wa.gov.au. |

## Indigenous / blended / GrantScope picks
| Source | Verdict | Why |
|---|---|---|
| Wyatt Trust CLIF | PARTIAL | Right instrument (patient debt, no gate) but stated focus is metropolitan Adelaide; Goods is remote multi-state. |
| Community Sector Banking (Bendigo JV) | PARTIAL | Real but NFP/charity-skewed; for-profit Pty Ltd eligibility unconfirmed. Weak for a $425K raise. |
| **NIAA Indigenous Advancement Strategy (IAS)** | FALSE-POSITIVE lean | Indigenous orgs preferred, largely invitation-only; the 2026-06-30 deadline + "accepts Pty Ltd" look like grant-DB artifacts. Drop. |
| **Education BEEF (Aboriginal Community)** | DEAD / FALSE-POSITIVE | Funds early-childhood-education centre buildings via ACCOs. Nothing to do with recycled-plastic beds. Drop. |

## Action: re-tag in the source data
- First Nations Finance, CEFC/NAB: promote to "verified, chase now."
- NIAA IAS, Education BEEF: mark "false positive, do not chase."
- All circular grants: "watch next round, needs a state facility."
