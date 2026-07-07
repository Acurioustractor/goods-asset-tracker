# Goods Illustration Map

**Date:** 2026-06-06
**What this is:** the full option map for explainer line illustrations across the site, guides, decks, and the Cost Lab. Built from a two-agent sweep of `v2/src/app` + data files and the strategy docs (cost-lab playbook, best-case scenario, pitch blueprint, QBE catalytic pitch, brand IMAGE-PLAN).
**Tool:** `/goods-illustrations` skill (cream #FDF8F3, terracotta #A8643F line, sage #8B9D77 accents, hands not faces, max 5-7 uppercase labels).

## Standing rules (apply to every shot)

1. Real photos for product marketing. Illustrations never replace product photography on shop or hero surfaces.
2. Numbers live in computed charts. An illustration carries at most one canon number (20KG PER BED, NO TOOLS, 5 MINUTES class of fact), never dollar figures.
3. Hands, not faces. No identifiable people, ever.
4. One image, one idea. If the caption needs an "and", it is two images.
5. X-trestle anatomy per `references/product-accuracy.md`. Verified 2026-06-06: no "clip" language exists in live site copy; keep it that way in labels.

## A. How-to guide set (biggest gap, nothing exists today)

No assembly or care guide content exists on the site. This set creates a reusable asset pack for the box insert, a `/stretch-bed` guide section, and PDFs.

| # | Shot | Idea | Type | Label sketch |
|---|------|------|------|--------------|
| A1 | Unpack | Everything in the box: canvas, 2 poles, 2 X-legs | Exploded view | IN THE BOX / CANVAS / 2 POLES / 2 X-LEGS |
| A2 | Thread | Pole slides through each canvas sleeve | How-to step | THREAD POLE / CANVAS SLEEVE |
| A3 | Seat | Pole ends pass through the top holes of both X-legs | How-to step | POLE THROUGH X-LEG HOLE |
| A4 | Tension | Pulling taut seats the poles deep; canvas braces the frame | How-to step | PULL TAUT / CANVAS IS THE FRAME |
| A5 | Done | Standing bed, hands resting on canvas | How-to step | 5 MINUTES / NO TOOLS |
| A6 | Care | Canvas comes off, gets washed, goes back on | Loop | UNTHREAD / WASH / DRY / RETHREAD |

Existing draft `02-assembly-thread-pole.png` (test batch) covers A2/A3 roughly; regenerate as the set so style is uniform. 4:3 for all six.

## B. Site page placements (~20 spots found)

Highest value first.

### /process (anchor page for the system)
- **The loop band**: currently static `goods-plastic-journey.jpg`. Replace with the loop illo (collect, shred, press, bed leg, offcuts return). Test-batch `01-plastic-loop.png` is 80% there; add the offcuts-return arrow.
- **Factory in a container**: cross-section exploded view of the container plant (shredder, press, workbench) with the ownership note. Pairs with `goods-community-ownership-v2.png` rather than replacing it.
- **Step band spot illos (1-6)**: small how-to drawings beside each step's photos: collect hands, press plates, cutting nest, finishing, assembly, the delivery leg (journey). Photos stay primary; illos carry the concept.

### Homepage
- **Hero CTA band**: order-to-country journey (DONE 2026-06-06, draft in `generated-images/goods-illustrations/order-to-country/`).
- **Materials band**: one exploded view of the three materials meeting (plastic legs, steel poles, canvas). Existing `goods-ill-assembly.png` already serves this; only refresh if Ben wants consistency with new set.

### /impact and /story (shared concepts)
- **Health chain**: the cascade (damp bedding, scabies, Strep A, RHD) drawn as an abstract chain of links with a bed breaking one link. No bodies, no faces, keep it object-abstract. The single most-requested deck visual (pitch blueprint slide 3) and reusable on both pages.
- **Story timeline 2018-2025**: winding journey/map with 6 stops (spark, pattern, question, tractor, beds, washing machines).
- **Partner model**: map of Oonchiumpa, Goods, production site, funders with capability-transfer arrows. Funder-facing more than public; keep for /partner or deck.

### /shop and /sponsor
- **Sponsor journey**: your bed's journey to a home (variant of order-to-country with a QR/tracking stop). Concept only, no dollar labels.
- **Shop**: photos rule here. No illustrations except possibly a small NO TOOLS / 5 MIN badge-style drawing on the product detail.

### /basket-bed-plans
- **V1 to V2 evolution**: before/after, Basket Bed silhouette to Stretch Bed silhouette. Fits the open-source story.

## C. Concept and deck drawings (from strategy docs)

| # | Concept | Source | Type | Audience | Note |
|---|---------|--------|------|----------|------|
| C1 | Health chain, bed breaks the link | Pitch blueprint slide 3 | Workflow chain | Deck + /impact + /story | Top priority of the whole map |
| C2 | Containers fund containers | Best-case doc | Journey | Deck, Cost Lab, wiki | Container 1 surplus arrow seeds container 2, then 3. No dollars |
| C3 | Sourdough starter | Cost-lab playbook | Concept metaphor | Cost Lab workshop | Hold a bit of starter back from every loaf; hand the jar over one day. Doubles as the ownership-transfer metaphor |
| C4 | Solar on the shed | Cost-lab playbook | Before/after | Cost Lab workshop | Buy the gear once, every bed after costs less. Capex as lever |
| C5 | Food truck and rent | Cost-lab playbook | Before/after split | Cost Lab workshop | Per-burger cost vs the rego and pitch fee. Fixed vs marginal |
| C6 | Ute, mate chips in | Cost-lab playbook | Concept metaphor | Cost Lab, QBE explainer | Matched capital: mate matches what you put in |
| C7 | Plant travels then transfers | QBE catalytic pitch | Journey + handover | Deck + /partner | Container moves onto country, then the keys change hands. Test-batch `03-ownership-handover.png` is the second half |
| C8 | Markup gap, flake to leg | Playbook + slide 4 | Workflow | Wiki, workshop | Raw flake, press, finished leg. Value-add as transformation, chart keeps the 8.6x |
| C9 | Demand as capital | QBE pitch | Flywheel | Deck only | Agent flagged as too abstract; attempt last, drop if it fights |

## D. Build order

1. **Set 1, assembly guide (A1-A6)**: fills a real content gap, every image reusable across box insert, site, PDF. 6 images, 4:3.
2. **Set 2, health chain (C1)**: one 16:9, unlocks deck slide 3 plus /impact and /story bands.
3. **Set 3, /process anchors**: loop v2 with offcuts return, container cross-section. 2 images.
4. **Set 4, Cost Lab workshop pack (C2-C6)**: 5 images for the Ben+Nic workshop (playbook section 5 agenda). Drawings teach, charts prove.
5. **Set 5, journeys**: story timeline, sponsor journey, V1-to-V2. Nice-to-have.

Promotion path: drafts in `generated-images/goods-illustrations/<set>/`, Ben approves, then copy to `v2/public/images/brand/` and wire into pages (each wiring is a small PR).

## E. Sensitivity and accuracy notes

- Health chain: abstract objects only (chain links, a bed). Never draw sick people, children, or any body. This is a community-health story told with respect.
- Ownership and CATSI transfer: hands and keys, not signatures of real people or real logos.
- Washing machine: boxy Speed Queen silhouette, prototype context only, never in a shop frame.
- IMAGE-PLAN.md (brand guide) already covers flagship PHOTOS. This map is the illustration layer; it does not replace any planned photography.
