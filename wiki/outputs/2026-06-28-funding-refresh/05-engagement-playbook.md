# Engagement playbook — the right artifact, the right ask, to money in

> How to actually engage a supporter: send proof that fits *their* type, at the depth that fits *their* stage, then walk the fixed path from ask to money. The artifacts already exist (`v2/src/lib/data/artifact-register.json`, 35 of them, organised in 5 pillars). This is how you point the right ones at the right person.

## The 5 pillars of proof (what's in the register)
- **pitch** — the deck, pitch pages, investor-alignment tools, and the 3 funder-specific briefs (SEFA / Snow / Centrecorp).
- **costing** — Cost Lab, cost-story, cost model v6, best-case fleet. The unit economics and repayment story.
- **impact** — impact page, canonical numbers sheet, asset register, Centrecorp/Utopia impact report. The proof it works.
- **stories** — community stories, Utopia field note, cleared voices. The human proof, consent-gated.
- **governance** — risk register, governance framework, role map, legal-structure. The "can we trust them with money" proof.

## Match the bundle to the funder TYPE

| Funder type | Lead pillars | Why | Examples |
|---|---|---|---|
| **Repayable / impact lender** | costing + governance + the loan brief | They fund a business case: unit economics, repayment, entity strength | SEFA, First Nations Finance, CEFC/NAB, Invest NT |
| **Philanthropic / grant** | impact + stories + the deck | They fund a mission with proof and a face | Snow, Tim Fairfax, Ian Potter, FRRR, Minderoo |
| **Catalytic / blended (QBE)** | pitch bundle + costing + matched-capital evidence | They fund a stack they can de-risk | QBE Stage 2, REAL Innovation Fund |
| **Buyer / procurement** | impact (asset + delivery proof) + cost per bed | They buy a product that works at a price | Centrecorp (as buyer), Groote, health services |

Funder-specific overrides (send these directly): **SEFA** → SEFA loan brief; **Snow** → Snow first-mover brief; **Centrecorp** → next-round brief + Centrecorp/Utopia impact report.

## Match the DEPTH to the stage (don't over-send early)

| Stage | Send | The ask | Moves to next when |
|---|---|---|---|
| **Identified** | the public pitch page link, nothing more | (none) — qualify the fit | confirmed real fit + a way in |
| **Qualified** | one-pager / pitch page | a 20-minute conversation | a relationship starts |
| **Cultivating** | one impact proof + one story (their pillar) | gauge interest in the specific ask | you send the actual ask |
| **Cultivating** *(repayable lenders)* | lead with **costing** (cost-story + repayment case), then one impact proof | gauge interest in the loan | you send the actual ask |
| **Ask made** | the funder-specific brief + numbers + governance | the **specific** amount, instrument, and use of funds | they say yes |
| **Delivering** | the agreement (term sheet or grant agreement) + reporting plan, then the **invoice + bank details** | sign, then pay | money lands |
| **Stewarding** | the impact report + acquittal | (care, report well) | acquittal delivered |
| **Renewing** | the next-round brief | the next ask | a new ask goes out |

## The path to money (Ask made → received)

1. **Ask made** — send the brief with a specific ask (amount + instrument + use of funds). Vague asks stall.
2. **Yes (verbal/email)** — send the agreement: a **term sheet** for repayable, a **grant agreement + acquittal plan** for philanthropic. Move to Delivering.
3. **Signed** — raise the **invoice in Xero** and send bank details. (Goods entity: bill from the correct go-forward entity; DGR receipts only via The Butterfly Movement where required.)
4. **Paid** — record in Xero, reconcile against the funder, move to **Stewarding**, start the reporting clock.
5. **Acquitted** — deliver the impact report (canonical numbers + Centrecorp/Utopia-style report + a cleared story), then move to **Renewing** for the next round.

The rule: **money is only "received" when it's in Xero/bank**, never when it's pledged or invoiced. Keep pipeline value and received money separate (the funder register makes this mistake easy).

## Where Notion and GHL sit in this
- **Notion (data room)** holds the artifacts as shareable pages, so engaging = sending a supporter a clean link, not an attachment. The review page is where you decide who gets what this week.
- **GHL** holds the stage + owner + next action + reminder. The stage tells you which row of the depth table applies, so you always know what to send next.
- **The skill** (`funder-artifact-match.mjs`) reads both and tells you, per supporter: their stage, their type, the exact artifacts to send, and the next money-step.
