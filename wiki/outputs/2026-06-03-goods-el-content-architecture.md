# Goods × Empathy Ledger — one connected content system

Worked out 2026-06-03. How Goods and Empathy Ledger become a single system where tagging is consistent, stories flow from transcript to insight, quotes carry their community, product links to people and place, partners and communities have features, the Utopia field note is the hub, and brand artefacts pour out for any purpose.

Grounded in the live EL schema (`yvnuayzslukamizrlhwb.supabase.co`, project `6bd47c8a-…`, code `goods-on-country`) and the Goods codebase.

## 1. The one idea: a single tagging spine

Goods and EL already hold the same nouns. Make them speak ONE controlled vocabulary, stored identically in both, so nothing has to be re-tagged or reconciled:

- **Storyteller** (person) — EL `storytellers.id` ↔ Goods `display_name` key
- **Community / place** — EL `locations` table + `storyteller_locations` + `media_locations` ↔ Goods location names + GPS
- **Product** — stretch-bed | washing-machine | basket-bed
- **Theme** — making, plastic-loop, in-use, community, assembly, health, ownership, …
- **Kind** — hero, product, detail, portrait, scene, process, plant, landscape

This spine is the join key for everything below. The Photo + Video Review tool already tags to it; the EL `media_assets` carries it as `cultural_tags[]`, `storyteller_id`, `location_name`/`latitude`/`longitude`, `is_featured`. Same words, both sides.

## 2. The flow: transcript → analysis → insight → surfaced

EL already runs this pipeline; Goods just has to consume it cleanly:

```
transcripts ──► storyteller_master_analysis        (per-person themes, tone, quality)
            ├─► storyteller_themes                  (weighted themes per storyteller)
            └─► storyteller_quotes                  (key quotes, scored, with themes)
                          │
media_assets ─► media_ai_analysis ─► media_narrative_themes   (what each photo/video is about)
                          │
            (aggregate)   ▼
        syndication API: project insights = themes + topQuotes + impactDimensions + ALMA
                          │
        Goods consumes via empathyLedger client (syndication API + EL Supabase) with
        local content.ts fallback. Already wired in v2/src/lib/empathy-ledger/.
```

What to fix so it "flows easily": (a) flip the consent/publish gates so the analysed stories are visible (Mykel pending), (b) make sure every story/media is tagged on the spine so the insight aggregates are clean, (c) surface the per-storyteller analysis (themes, top quote) next to the person everywhere they appear.

## 3. Align product ↔ people ↔ place

The three-way join that makes "show me Utopia" or "show me washing-machine + Elders" trivial:

- **media → person**: `media_assets.storyteller_id` (+ `media_storytellers` for multiples)
- **media → place**: `media_locations` → `locations` (+ `latitude`/`longitude` on the asset)
- **media → product/theme**: `cultural_tags[]`
- **person → place**: `storyteller_locations`; **person → quotes**: `storyteller_quotes`
- **story → everything**: a story references its storyteller, its media, its themes, its place

So a single query "give me everything for community = Utopia, consent-cleared" returns the people, their quotes, the photos/videos, the products made there, and the partner. That set IS a feature.

## 4. Quotes with their community

`storyteller_quotes.quote_text` + the storyteller's `storyteller_locations`/`location` gives an attributed, place-stamped quote: *"…", Linda Turner, Tennant Creek.* This is the Goods caption rule (voice + face + place) made automatic. The Goods site already renders curated quotes; point them at `storyteller_quotes` joined to location so attribution is live, not hand-typed.

## 5. Partner + community features

A feature is just a saved query over the spine + a layout:

- **Community feature** (e.g. Utopia): all storytellers `location = Utopia`, their top quotes, the hero media tagged `location = Utopia`, the products made/used there, the map pin. Render with the brand template.
- **Partner feature** (e.g. Oonchiumpa): storytellers/media tagged `partner = Oonchiumpa`, the relationship beats, the work made together, the consent-cleared faces.
- These reuse EL `content_placements` (slotKey → media) so the right asset lands in the right slot, and `galleries` for grouped sets.

## 6. Utopia as the function piece (the hub)

The Utopia field note (`trip-stories.ts` → `/field-notes/utopia-may-2026`) already links product + storyteller + quote + partner + place + blocks. Make it the **reference implementation**: it exercises the entire spine in one page. Every other feature (community, partner, funder, product) is a re-cut of the same wiring with a different filter. Get Utopia perfect against the spine, and the pattern propagates:

- Utopia people → EL storytellers (Mykel, the makers) with analysis + quotes
- Utopia place → `locations` (Arlparra, Arawerr/Soapy Bore) with GPS
- Utopia product → the beds built and tested on the trip, tagged
- Utopia partner → Oonchiumpa
- Utopia media → the photo/video set, tagged + placed
- Utopia brand → the line-illustration + hero language

## 7. The brand artefact engine

Brand template **locked** (logo, line-illustration system, colour, type, voice — all built and on the brand page), content **variable** from the spine. One source of truth, many outputs, by changing the filter + the layout:

| Purpose | Filter over the spine | Layout |
|---|---|---|
| Funder feature | hero + consent + impact themes + a community | deck / one-pager |
| Partner page | partner = X + the work + faces | web feature |
| Community story | location = X + people + quotes + product | field-note layout (Utopia pattern) |
| Social | one quote + one face + one place | card |
| Press kit | hero set + canonical numbers + logos | media pack |

Keep playing with engagement (which quote, which face, which beat leads) without ever touching the brand or re-tagging — the artefact is a view, not a rebuild.

## 8. What to build (prioritised)

1. **Lock the spine** — confirm the controlled vocab (storyteller/place/product/theme/kind), as used by the Photo tool + EL `cultural_tags`. (almost done; the tool tags to it)
2. **EL media push** (the link) — upload-or-import the tagged Goods photos into EL `media_assets` with storyteller_id + location + GPS + tags (the schema is confirmed; needs the upload path + Tier-3 sign-off + a 1-photo test).
3. **Fix the pending people** — flip Mykel's consent/publish; add portraits for Boe + Kristy; create profiles for Xavier + Joey. Then the analysis/quotes flow.
4. **Quotes-with-place live** — join `storyteller_quotes` to location on the Goods captions.
5. **Utopia hub to spine** — re-cut the Utopia field note against the spine as the reference feature.
6. **Feature templates** — community + partner + funder features as saved queries + the brand layout.
7. **Artefact engine** — wire the per-purpose outputs off the spine.

Two systems, one spine, the Utopia piece as the worked example, brand locked, content alive.

## 9. How dynamic workflows drive this

This architecture is unusually well-suited to dynamic workflows, because almost every step is a fan-out over many items (photos, storytellers, quotes, communities, artefacts) where one context window would get lazy and drift, and because the content is consent-sensitive, which is exactly where the quarantine and adversarial-verification patterns earn their keep. Proven twice already this session: the 7-agent brand-guide workflow and the 7-agent photo-review workflow.

Pattern → where it drives:
- **Fan-out-and-synthesize** → tag the whole library + EL's media (one agent per folder/batch, synthesize onto the spine). Done for the curated set; scale to the full library.
- **Triage at scale + classify-and-act** → the storyteller backlog (240 in EL): audit each, classify (cleared / pending-consent / no-portrait / no-profile), route to fix or escalate. This is build step 3.
- **Adversarial verification** → never let the agent that tagged a photo or pulled a quote also approve it. A separate refuter checks consent, attribution (right person, right community) and cultural sensitivity. Kills self-preferential bias on the judgments that matter most.
- **Quarantine** (the killer pattern here) → the cultural-safety boundary made structural. Agents that READ sensitive or unconsented stories CANNOT publish. Only a separate gated agent writes to EL or the site, and only for items that are consent-cleared + Elder-approved + not sacred. Data sovereignty / ICIP / OCAP enforced by the harness, not by hope.
- **Generate-and-filter + Tournament** → the artefact engine. For a funder feature or social card, generate N variations (different lead quote / face / beat), judge against a rubric (brand voice + impact + consent), pick the winner. This IS "keep playing with engagement" without touching the brand or re-tagging.
- **Loop-until-done + /goal** → completeness on a 240-storyteller, 1900-photo system a single pass would abandon half-finished. Loop the tag / consent / link-health sweep until nothing new surfaces.
- **Memory / rule-adherence** → one verifier per cultural-protocol rule (consent, attribution, no-sacred, Elder-approval) + the brand rules (no em dash, canon numbers) checks every artefact before it ships.

Workflows do not just speed this up; they make it SAFE and COMPLETE at a scale one context cannot hold. The spine is the shared data; workflows are the engine that fills it, verifies it, and turns it into artefacts. First to run: the storyteller triage (build 3) — cheapest unlock, and it surfaces exactly what blocks the flow.

