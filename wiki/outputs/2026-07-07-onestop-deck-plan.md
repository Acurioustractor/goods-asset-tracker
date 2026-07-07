# The one-stop-shop deck — review, messaging spec, build plan, ship path

**Date:** 2026-07-07
**Trigger:** Nic's Oranges & Sardines call (Jo + Tam) + Bryan Foundation conversation. They want ONE deck that pulls the QBE catalytic-capital work together with the whole-of-Goods strategy, for a relational-philanthropist audience. Near-term driver: QBE offers up to $400K untied IF it unlocks other funding; Goods needs **letters of support from funders by mid-August 2026**.
**Method:** 6-way parallel audit of canon numbers, QBE strategy, live pipeline, broader strategy, design inventory, and voice/claim rules. Every figure below is sourced from code or a dated doc.
**Status:** PLAN ONLY. Nothing built, nothing shipped to Claude Design. Awaiting Ben's go + the decisions in §5.

---

## 1. What we have (review)

The current **16-slide investor deck** (`design/brand/claude-design/invest-deck-full.html`, updated 3 Jul, canon-token wired, in the "Investor Materials" Claude Design project `b333c5aa`) is the strongest asset and the right base. It is money-current ($400K ask, $475K lead stack) and honest. Its only weakness is that it is **investor-narrow**: it makes the catalytic ask beautifully but doesn't carry the whole-Goods story a philanthropist leans into.

| Artifact | Path | Recommendation |
|---|---|---|
| **Investor deck (16 slides)** | `design/brand/claude-design/invest-deck-full.html` | **REBUILD ON TOP** — the base for the one-stop-shop deck |
| Funder one-pager | `design/brand/kit/funder-onepager.html` | KEEP — leave-behind, don't rebuild |
| Funder+finance landscape one-pager | `design/brand/kit/funder-landscape-onepager.html` | KEEP (internal only) — it's the pipeline map, never send to O&S |
| Next-phase one-pager | `design/brand/kit/next-phase-onepager.html` | **REUSE AS SOURCE** — its 3 pillars (ownership / jobs / health-why) are exactly the philanthropist threads the deck lacks |
| Strategic pack (20 docs) | `wiki/outputs/2026-06-13-goods-strategic-pack/` | MINE, don't ship — vision (`13-`), business model (`14-`), governance (`18-`), entity (`04-`) |
| Strategic-pack PPTX (14 slides) | `.../Goods-on-Country-Investor-Deck.pptx` | RETIRE — superseded by the HTML deck |
| Strategic-pack one-pager | `.../02-one-pager.md` | ⚠ STALE ASK ($900K–$1M) — do not carry the figure forward |
| Ledger pitch | `wiki/outputs/2026-06-05-goods-ledger-pitch/pitch.html` | RETIRE — pre-canon-wiring; salvage story framing only |

**Registered surfaces:** `v2/src/lib/data/artifact-register.json` (~45 entries) tracks path + title only — no live Express URL is stored on any entry. When the new deck is final it should be registered here.

---

## 2. Clean + current messaging spec

### 2a. The authoritative number set (verified from code, 2026-07-07)

| Metric | Value | Note |
|---|---|---|
| Beds deployed | **496** (363 Basket + 133 Stretch) | `asset-canonical.ts` / `canon.ts` |
| Communities | **9** served / 10 touched | |
| Washing machines in community | **16** (Pakkimjalki Kari) | |
| HDPE diverted | **2,660kg** (Stretch-only, 133 × 20kg) | never the old ~10,000kg overclaim |
| Stretch Bed | 26kg · 200kg · 188×92×25cm · ~5min no tools · 10+yr · 20kg HDPE · **$750** | X-trestle tension, canvas is structural |
| Marginal cost/bed | Buy-Kit **$685** → Factory **$426** → Community **$421** (modelled) | use rounded canon values, not $684.79 |
| Fixed block | **$109,500/yr** | annual operating, NOT capex |
| Plant capex spent | **$110,046** | one-off, NOT the fixed block — do not conflate |
| Break-even | **1,679 → 338 beds/yr** (Buy-Kit → Factory) | honest run-rate today ~120/yr |
| The hinge | finished leg kit **$344** vs raw plastic **~$40** = **8.6×** markup | |
| Ask | **$400K** (up to; $150K floor; ~$1M pool across 10 enterprises) | |
| Lead stack | SEFA **$300K** + Snow **$100K** + Centrecorp **$75K** = **$475K** | 0 signed today |
| Signed LOIs | **0** | the whole job is converting this |

### 2b. ⚠ Must-resolve-before-copy conflicts

1. **DGR1 claim (highest stakes).** On the call Nic told O&S "we've just got a DGR1 registered charity." The canon (`04-entity-wording-block.md`) says DGR is **only** via **The Butterfly Movement Ltd**, from **FY2026-27 (~1 July 2026)**, and that "DGR1 status" as a *Goods* claim is a stale/overclaimed phrase. Today is 7 Jul 2026, so the FY boundary has *just* passed — it may now genuinely be live. **Ben/Nic must confirm the exact status before the deck says anything about DGR.** Rule until confirmed: DGR is via Butterfly, describe as just-commencing, never call Goods/ACT/sole trader "a charity."
2. **Revenue basis.** Two figures: $741,111 (all-sources cumulative, ~89% grant) vs **$713,827** (accountant-signed Goods carve-out — the one to cite externally). Never present either as an annual/commercial run-rate (FY26 commercial-only ≈ $61K). No surplus claimable — connected entity runs an FY26 net loss.
3. **`save-per-bed` = $194.** `canon.ts` defines it against "$344 vs $40," but 344−40 = $304 and Buy-Kit−Factory marginal = $259. The $194 doesn't obviously reconcile with either. **Confirm what $194 measures before printing it beside the hinge** (this is a live issue in the *current* deck slide 4 too).
4. **SEFA $300K / $475K is current** — the deck is right. The 20 Jun playbook's $250K / $425K is the stale side; don't reintroduce it.
5. **Impact slide framing.** The deck's slide 11 uses the older Input/Output/Outcome/Shift theory-of-change band. Canon is now **5 domains + 2 through-lines** (`impact-model.ts`). Decide: keep the ToC band (still valid) or move to the 5-domain cut.

### 2c. Copy-hygiene (each line pass/fail)

- **No em dashes.** Zero. Colon / period / parentheses / recast.
- No arrows in prose (`→`). Straight quotes only, never curly.
- **"On Country" always capitalised.** "Country" as land capitalised.
- **"co-design" BANNED** — say "designed in community" / "community-led design." (⚠ some source docs still carry "Co-designer" for Dianne Stokes — do NOT copy it forward.)
- Units no space: `26kg`, `188×92×25cm`. Currency formal in body: `$400,000`.
- Banned words: donate/charity, beneficiaries, empower, **unlock**, **leverage**, ecosystem, disrupt, innovative, game-changer, seamless/scalable/sustainable triads.
- Name the community (Tennant Creek, Maningrida), never "outback/the bush." Never "Indigenous people" as a block — name the language group or "First Nations."
- Sentence case in body. No exclamation marks. Every stat carries a source.

### 2d. Claim ceiling (absolute)

- **MAY say:** "a washable bed off the ground is health hardware"; scabies → RHD as the **mechanism the work addresses** (the WHY); quote external clinicians attributing the pathway to *them*; verified deployment facts.
- **MUST NOT say:** a bed/washer prevents, reduces, or cures scabies/RHD/anything; any claimed health or justice **outcome** attributed to Goods. A health outcome only leaves the "future" column when a named clinical partner (Miwatj) produces it, attributed to that partner.

### 2e. Consent guardrail (any face or quote)

- Quotes only from the cleared-voices roster (**32**, `cleared-voices.ts`) or a fresh EL pull with `syndication_enabled = true AND consent_withdrawn_at IS NULL AND is_archived = false`. Never invent, paraphrase, or combine quotes.
- Youth / pending-consent voices are **internal only** — no name, words, or image on any external surface (decks included) until family consent captured. `community-testing-bed-golden-hour.jpg` remains consent-blocked.

---

## 3. The one-stop-shop deck — recommended structure

**Shape:** ONE deck, story-first, with the QBE ask nested. Three acts: **MOVEMENT → MODEL → ASK**. Philanthropist reads the whole thing; an investor can skim to Act 3. ~17 slides. Reuses the existing deck's slide machinery (same CSS, same CANON tokens) so it stays canon-wired and cheap to maintain.

| # | Slide | Source | Build |
|---|---|---|---|
| **ACT 1 — MOVEMENT** | | | |
| 1 | Cover | reuse deck s1 | reframe eyebrow so it serves both audiences (not "Investment opportunity" alone) |
| 2 | The why — Linda Turner | reuse deck s2 | as-is |
| 3 | **Repair, not replace** | AUTHOR FRESH | the philosophy: replacement + top-down giving harm communities. Evidence: the dump critique, $3M/yr machines dumped, freight tax, plastic burned On Country. This is the O&S hook. |
| 4 | Health hardware (scabies→RHD chain) | reuse deck s3 | keep claim-ceiling framing exactly |
| 5 | **The products** | EXPAND deck s6 | Stretch Bed + Pakkimjalki Kari washing machine (prototype, credit Elder Dianne Stokes). Fridges as *direction* only, never a product line. |
| 6 | Proof — 496 beds, tracked | reuse deck s5 | as-is |
| 7 | Communities pull this forward | reuse deck s9 | Norman Frank + Mykel (both cleared) |
| **ACT 2 — MODEL** | | | |
| 8 | Own the press (the hinge) | reuse deck s4 | resolve the $194 flag first |
| 9 | A movable plant On Country | reuse deck s10 | as-is |
| 10 | Unit economics + break-even | reuse deck s7+s8 | compress to one for a philanthropist read; keep the math legible for the investor read |
| 11 | **Ownership, charity & governance** | EXPAND deck s15 + entity-wording-block | hub-and-spoke; 51% First Nations spokes; Butterfly DGR home; "working toward," never "we transfer." Paste entity wording verbatim. |
| 12 | Impact thesis | reuse deck s11 | reconcile with 5-domain model or keep ToC band deliberately (§2b.5) |
| **ACT 3 — ASK** | | | |
| 13 | Why catalytic capital now | reuse deck s13 | as-is |
| 14 | **The QBE catalyst + letters of support** | EXPAND deck s14 | explain the mechanic (up to $400K if it unlocks matched external capital) AND the specific philanthropist ask: a signed LOI / letter by mid-August. This is the conversion for O&S/Bryan. |
| 15 | The capital stack | part of deck s14 | SEFA $300K + Snow $100K + Centrecorp $75K = $475K; 0 signed today |
| 16 | Team & partners | reuse deck s12 | Oonchiumpa, PICC |
| 17 | Close | reuse deck s16 | as-is |

> **Excluded (Ben, 7 Jul):** "Art as action / Harvest" is Nic's separate arts project, **not part of Goods** — it is deliberately NOT in this deck.

**Author-fresh queue:** slides 3, 5 (expand), 11 (expand), 14 (expand). Everything else is reuse. That's the whole build.

---

## 4. How to ship it (Claude Design + Express)

The pipeline already exists and is guarded:

1. **Author/edit** the deck HTML in `design/brand/claude-design/` using `CANON:` tokens for every number and image (never hand-type a figure — the render guard blocks drift).
2. **Render locally:** `./design/brand/kit/render.sh <deck>.html`
   - Bakes `CANON:num:*` (checks against `canon.ts` first, refuses on drift) + `CANON:` image picks from `design/canon-resolved.json`, writes `<deck>.resolved.html`, renders `<deck>.pdf` + `<deck>-preview.png`.
   - Loads Typekit webfonts (Georgia/Sinter) before capture. Refuses to render if any unresolved token survives.
3. **To Claude Design:** the deck carries `@dsCard` markers (`group="Investment"`). Seed into "Investor Materials" `b333c5aa` via `write_files`. ⚠ **DesignSync `register_assets`/`unregister_assets` do NOT update the project index** (confirmed twice) — don't trust the success message, eyeball that each card actually renders in the gallery.
4. **To Adobe Express (editable):** `export_html_to_express` MCP tool — run `html_export_readiness_skill` immediately before every call. The current deck exports 16/16 cleanly.

---

## 5. Decisions + gaps for Ben / Nic (before build)

**Decisions (Ben):**
1. Deck shape — confirm ONE deck, story-first (my recommendation) vs two decks.
2. DGR1 status — is it now live via Butterfly (FY just ticked over), and how may the deck describe it? (§2b.1)
3. Revenue basis — cite $713,827, labelled? (§2b.2)
4. `save-per-bed` $194 — what does it measure? (§2b.3)
5. Impact slide — keep ToC band or move to 5-domain? (§2b.5)

**Content gaps (Nic):**
6. **New funder identities** — confirm before any go near a deck: ABC Foundation / Aboriginal Carbon Fund + "Ignite Fund" (exact entity?); **"Triple" (homelessness) vs "Tripple" (Milgrom family office already in pipeline) — same or different?**; MacDoc Foundation; Waste to Wealth. None are in the docs yet.
7. **Bryan Foundation** — already in GHL (Ask made, opp `5nhYHB7YkyqTySyNTdqq`) but 30+ days silent with no $ amount. A live reply with an amount is needed before it's a named signatory.

**Letters of support (the actual near-term deliverable):** realistic signatories, warmest first — Snow (the signal everyone reads), SEFA (highest match value, repayable), Centrecorp (grant kept separate from the bed order), Minderoo ($200K on the table). A letter must carry a specific commitment (ideally a signed LOI), timing before end-August, and acknowledge "Catalysing Impact, powered by Social Impact Hub in partnership with QBE Foundation." Oranges & Sardines / Bryan would be additive signatories if they lean in.
