# 05. Pipelines × Brand

Every outreach pipeline (funder, procurement, community, media, partner) has a stage. Each stage has a tone, a template, and the right page on goodsoncountry.com to send. This page maps that.

Source pipelines:
- Grantscope outreach targets: `/Users/benknight/Code/grantscope/apps/web/src/lib/goods-workspace/data/goods-outreach-targets.ts`
- QBE program: [wiki/articles/program/](../program/)
- Investors profiles: [wiki/articles/investors/](../investors/)

## The URL playbook

Send the right page for the recipient. Wrong URL kills credibility. These are the canonical landing surfaces on [goodsoncountry.com](https://www.goodsoncountry.com):

| URL | Purpose | Best for |
|-----|---------|----------|
| `/` | Homepage hero with the bed | First-time visitors, broad audiences |
| `/shop/stretch-bed-single` | Stretch Bed product page with specs and price | Procurement, B2B, anyone wanting the actual product |
| `/about` | Origin story, philosophy, the people | Funders new to us, journalists |
| `/impact` | Numbers, community deployments, theory of change | Funders mid-pipeline, government |
| `/communities` | Per-community deployment stories | Community partners, place-based funders |
| `/process` | How the bed is made (the 6 steps) | Procurement, ESG funders, manufacturing-curious |
| `/stories` | Empathy Ledger storyteller index | Media, anyone who needs the human voice first |
| `/insiders` (pw `goods2026`) | Full operational wiki, QBE context, investor data | Catalytic capital, deep-engaged funders, advisors |
| `/admin/qbe-program` | Internal QBE dashboard | Goods team and QBE cohort only |

## Funder pipeline × brand

Six stages. Each has a template, a URL, and a gate to next stage.

### Stage 1: Researching
We've identified them. They don't know us yet.
- **Template:** None. We watch, we listen, we read their published priorities.
- **URL prep:** Confirm `/impact` and `/about` reflect what would matter to this funder.
- **Gate to next:** A warm introducer or a clear strategic match.

### Stage 2: Cold or warm intro
- **Template:** Funder intro ([04-email-templates.md](04-email-templates.md) Template 1).
- **URL to send:**
  - Generalist family foundation: `/about` plus `/impact`.
  - Health-focused funder (Snow, Snow Medical, VFFF Health): `/impact` plus a Jessica Allardyce quote in body.
  - Place-based funder: `/communities` filtered to where they fund.
  - Climate / circular economy: `/process` plus the recycled-plastic stat.
  - First Nations specific: `/about` and a quote from Linda Turner or Dianne Stokes in body.
- **Gate to next:** Reply expressing interest or asking for the deck.

### Stage 3: First meeting / call
- **Pre-send:** [07-slide-deck.md](07-slide-deck.md) (the standard deck). Send 24h before. PDF format.
- **In meeting:** Lead with The Stretch Bed (slide 4-5), then community ownership model (slide 9), then the ask (slide 10).
- **URL in follow-up:** `/insiders` if they're seriously engaged. Otherwise `/impact`.
- **Gate to next:** They request a written proposal, a site visit, or a stage 2 meeting.

### Stage 4: Proposal / due diligence
- **Materials:** Custom proposal pulled from `journeyStories`, `investmentCase` ([content.ts:591](../../v2/src/lib/data/content.ts:591)), and the relevant compendium section.
- **URL in body:** `/insiders` (the QBE wiki tree shows depth) and named per-community pages from `/communities`.
- **Tone shift:** more numbers, more risks-and-mitigations, more named partners.
- **Gate to next:** Term sheet, grant offer, or formal decline.

### Stage 5: Active funder (post-grant)
- **Template:** Funder report ([04-email-templates.md](04-email-templates.md) Template 3) on agreed cadence.
- **URL to maintain:** A per-funder page (consider creating sub-pages under `/insiders`) showing live numbers.
- **Brand discipline:** Same voice, same numbers, no triumphalism. Show what's hard.
- **Gate to next:** Renewal conversation OR exit conversation. Both deserve same care.

### Stage 6: Alumni / advisor
- Funders who fund once become referrers if treated well long after the grant ends.
- Send the annual story as a courtesy, with no ask attached, once per year.

## Procurement pipeline × brand

Different audience. Different tone. Specs lead, story supports.

### Stage 1: Identified
Health service, council, housing program, school. They have a fit-out brief. We make a bed for that brief.

### Stage 2: First contact
- **Template:** Procurement ([04-email-templates.md](04-email-templates.md) Template 4).
- **URL:** `/shop/stretch-bed-single` for the specs page. `/process` if they ask about manufacturing.
- **Attach:** One-page spec sheet. Not the funder deck.

### Stage 3: Sample or demonstration
- Ship one bed at sample price. Photograph it on site with their team if consent permits.
- **Brand discipline:** No "isn't this amazing" language. Let the bed speak.

### Stage 4: Order
- **Lead time honesty.** State current capacity. Don't promise dates we can't hit.
- **Freight quote.** Always real, always to destination.

### Stage 5: Delivery and feedback loop
- **Template:** Funder report adapted ([04-email-templates.md](04-email-templates.md) Template 3) but with operational detail.
- Photograph the install if consent permits. Add to image library.

### Stage 6: Repeat order
- Procurement repeat orders are how this scales. Treat first order like the start of a relationship, not a transaction.

## Community partner pipeline × brand

Slowest pipeline. Brand discipline matters most here, because the cost of getting tone wrong is the relationship, not the deal.

### Stage 1: Introduction (always through someone known)
- Never cold. Always introduced.
- **Template:** Community partner ([04-email-templates.md](04-email-templates.md) Template 5).
- **URL:** None on first contact. Don't direct community members to a sales page.

### Stage 2: First yarn
- In person where possible. Phone if not.
- **Brand discipline:** Listen more than speak. Ask about the community's priorities, not ours.

### Stage 3: Co-design conversation
- Always paid at fair rates (cultural consultation: $3,800/day comparable to university research rates).
- **Materials:** A bed to handle, a washing machine to look at. Not a slide deck.

### Stage 4: First deployment
- Small. 5-10 beds. Watch what happens.
- **URL:** Community-specific page on `/communities` if they want to see how other communities have engaged. Optional, never required.

### Stage 5: Ongoing partnership
- Quarterly visit. Shared decisions. Community holds veto on anything affecting them.

### Stage 6: Production transfer (the goal)
- Plant moves to community ownership. We become unnecessary.
- This is the brand's actual measure of success.

## Per-funder URL recommendations

Canonical source: [v2/src/lib/data/funder-url-map.ts](../../v2/src/lib/data/funder-url-map.ts). Both this table and the typed map should stay in sync. When you add or change a funder, update the `.ts` map first, then this table.

Match the specific funder to the right URL.

| Funder | First URL | Why |
|--------|-----------|-----|
| Snow Foundation | `/impact` plus health story | Already a major partner. Show progress, not pitch. |
| Vincent Fairfax Family Foundation | `/communities` filtered to NT/QLD | Place-based focus. Show on-ground deployment. |
| Tim Fairfax Family Foundation | `/communities` Far North QLD | Geographic alignment with their priorities. |
| Paul Ramsay Foundation | `/impact` health pathway | Health and wellbeing strategic priority. |
| FRRR | `/communities` and `/impact` | Already funded. Backing the Future renewal. |
| AMP Spark | `/process` and `/about` | Spark is about community-led. Lead with co-design. |
| QBE Foundation | `/insiders` (QBE tree) | They're in the program. Full depth. |
| QBE Ventures (Alex) | `/insiders` capital section | Catalytic capital conversation. |
| SEFA (Hannah) | `/insiders` capital section | Blended finance partner. Specific. |
| Dusseldorp Forum | `/about` plus `/impact` | Systems-change framing matters most. |
| Giant Leap Foundation | `/process` plus `/impact` | Climate and circular economy lens. |
| PFI (Philanthropic) | `/impact` First Nations focus | First Nations-specific framing. |
| Wilya Janta Housing | Direct contact, no URL needed | Norm Frank's organisation. Yarn, not link. |
| Defy Design | `/process` manufacturing | Manufacturing partner, technical depth. |
| Envirobank | `/process` plastic pathway | Plastic supply pathway. |
| NPY Women's Council | Direct contact via Angela Lynch | Always-looking-for-beds relationship. |
| Homeland Schools Company | `/shop` plus `/communities` Maningrida | 65 beds requested. Procurement-shape. |
| WHSAC | `/communities` plus `/process` | Procurement-and-partnership shape. |
| PICC (Palm Island) | `/communities/palm-island` | Strong relationship. They asked to buy the plant. |

## Pipeline hygiene

- Update CRM (or current tracker) within 24h of any funder contact.
- Never send a funder follow-up without checking when we last sent them anything else.
- Read the previous email thread before replying. Funders notice when we don't.
- One owner per funder. The owner sends and signs everything. No relay handoffs without warning.

## Cross-references

- **Canonical funder→URL map:** [v2/src/lib/data/funder-url-map.ts](../../v2/src/lib/data/funder-url-map.ts) (typed, importable in any Goods code or agent).
- Funder profiles: [wiki/articles/investors/](../investors/).
- QBE Catalysing Impact program structure: [wiki/articles/program/qbe-catalysing-impact-2026.md](../program/qbe-catalysing-impact-2026.md).
- Investment case: [v2/src/lib/data/content.ts:591](../../v2/src/lib/data/content.ts:591).
- Grantscope (separate repo) has its own outreach surfaces. As of 2026-05, the structure is in flux. Re-integration with Grantscope should consume this `funder-url-map.ts` rather than maintain a parallel list.
