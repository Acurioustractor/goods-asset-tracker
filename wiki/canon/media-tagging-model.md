# The Goods tagging model — tag once, shows everywhere, built to scale

> How media, tags and entities connect into one aligned world you can tag from one place and have it surface across every surface, with Empathy Ledger held as the consent authority and a clear path to AI-assisted tagging. Companion to [data-model.md](./data-model.md). Grounded in a best-in-class review (DAM standards, knowledge-graph patterns, master-data / entity-resolution, Indigenous data governance, AI-tagging) — 2026-07-20.

## The one-line principle

**Tag a media item to the entity it shows, once, in the Media Room. Every surface that cares about that entity reads it back.** The junction records the relationship; a resolver turns each link into a servable, consent-checked URL at render time.

## What we have, and why it is already right

`media_links(media_source, media_key, media_type, target_type, target_key, relation, consent_status)` is a **typed junction** connecting a media item to the entity it depicts. The review confirmed this is the correct shape and told us NOT to over-build:

- It is effectively a domain-scoped **triple store**: `(media_key, relation, target_key)` is subject-predicate-object with typing. We get ~90% of graph-database expressiveness at none of the operational cost.
- **Do not move to a graph database or RDF triple store.** Those pay off only for unknown-depth, multi-hop traversal (fraud rings, recommendation networks). "A photo shows a person at a community holding an asset" is a bounded, 2-hop, transactional pattern, which is exactly where relational + junction wins.
- `target_key` foreign-keying to real entity rows already solves synonym sprawl (the classic folksonomy failure where "car" / "automobile" / "vehicle" fragment search): there is one canonical key per thing.

Verdict: keep the junction. The work is alignment, resolution, consent and a suggest-only AI layer, not a rewrite.

## The five moves that make it scale

### 1. Canonical keys, one per thing (done)
Community = `communities.id` (kebab slug), person = `crm_contacts.id` (uuid), product = slug, asset = `assets.unique_id`, story = `stories.slug`. Everything references a thing by its canonical key, never a display name. Enforced by `npm run audit:model`. See [data-model.md](./data-model.md).

### 2. A servable, consent-checked resolver (done)
`v2/src/lib/data/media-links.ts` resolves each row's `(media_source, media_key)` to a URL:
`local` → `/images` or `/video` public path · `external` → the URL · `el_media` → the Empathy Ledger media proxy · `supabase` → storage URL. `getMediaLinksFor(type, key, {consentPublicOnly})` returns render-ready media, deny-by-default on consent when leaving the admin. The 2026-07-20 `align-media-keys` sweep re-pointed 63 non-servable `design/starred-images/` keys to their servable equivalents so this works in production, not just where a local manifest happens to exist.

### 3. Empathy Ledger is the system of record for people, stories and consent
Two systems hold media (local Supabase + EL), so we name owners explicitly, the master-data discipline:
- **EL owns**: storyteller identity, story, and **consent**. We hold EL's foreign id and a small denormalized snapshot for display. We **never re-author consent locally**; EL's live value wins on conflict. A second writable copy of consent is a governance hazard, not a feature.
- **Goods Supabase owns**: assets, communities, products, and the `media_links` relationships.
- EL media is a **read-through cache keyed by EL id**. `media_links.media_source='el_media'` + the EL uuid is exactly this foreign-id reference.

**Next build (not yet done): a `media_registry` / cross-reference layer** so the same photo living in local + Supabase + EL resolves to ONE canonical media id that `media_links` points at, instead of three rows for three copies. This is the single fix that prevents duplicate truth as volume grows.

### 4. Consent as per-use rights, not one flag (design; partially built)
Indigenous data governance (CARE principles; Local Contexts TK Labels; Mukurtu CMS) models consent as **use-specific rights held by the community/storyteller**, not a global public/private boolean. A photo can be cleared for internal use and held for external at the same time, which is already our deck-clearance reality.
- Direction: evolve `consent_status` toward `{use, status, granted_by, audience, expires}` (internal / website / funder-deck …).
- **Enforce at the derived surface, deny-by-default**: every render path resolves per-use rights at render time (`consentPublicOnly` is the first step), so un-cleared media physically cannot reach a funder surface even if it is cleared for the internal admin. Consent and its labels travel with the record wherever it surfaces.

### 5. Controlled vocabulary split from free text (design)
IPTC's standard answer is *both, in separate fields*: a closed **controlled vocabulary** for reliable retrieval and a **free-text** lane for nuance and discovery.
- Keep `relation` (`shows` / `made_by` / `taken_at` / `about`), `media_type`, `target_type` as closed enums. Consider aligning `relation` to schema.org verbs (`about`, `mentions`, `subjectOf`/depicts) so a future export to an LLM is trivial.
- Add an optional free-text keyword/notes lane. Never let free tags leak into the structured columns.
- Run a **hybrid taxo-folk loop**: free tags + AI candidates accumulate; when a term recurs, a human promotes it into the enum. Grows the vocabulary without an upfront cataloguing cost, and it is single-founder-scalable.

## The future AI layer — suggest only, never autofill identity

When the LLM/vision assist arrives, the rules from the review are firm:
- **Suggest into a candidate queue; never write the live junction directly.** High-confidence suggestions become one-click confirms; everything else is discarded.
- **Never autofill `target_key` identity for people from vision.** Face/identity hallucination against a real community member is a governance harm, not a search bug. AI proposes candidate entities; a human links.
- **Calibrate confidence against our own accept/reject history**; raw model confidence is untrustworthy. Log every rejected/hallucinated tag: a wrong tag costs more trust than a missing one.
- **Use embeddings for the safe jobs**: near-duplicate detection across the three stores and "find similar media", not for asserting who is in a photo.

## How the surfaces already talk to each other

- **Media Room** (`/admin/media-library`) writes `media_links` (product + community today; person/story from backfill).
- **Product pages** (`/admin/products/[slug]`) read `media_links(product)` and merge the tagged media with the curated set.
- **Community pages** read `media_links(community)` and merge with the `content_items` gallery.
- **The Atlas / Map** read community rollups and drill to the community page.
- `npm run audit:model` proves every link points at a real entity (0 fails, 2 coverage-gap warnings as of 2026-07-20).

## Open questions for Ben / EL

- Does EL expose a **per-use** consent value, or only a global cleared/withdrawn flag? The per-use rights layer (move 4) can live in Goods, but must still defer to EL for withdrawal.
- Should the `content_items.community_id` "primary community" and `media_links(community)` "appears in" be reconciled to one junction, or kept as primary-vs-additional? (A modeling decision to settle before volume grows.)

## Build order from here

1. `media_registry` x-Ref layer (move 3) — one canonical media id across the three stores.
2. Per-use consent rights (move 4) — replace the single `consent_status` with the use/audience/expiry shape; wire `consentPublicOnly` everywhere media leaves the admin.
3. Free-keyword lane + taxo-folk promotion (move 5).
4. AI candidate queue (suggest-only), starting with embedding-based dedup and "find similar".
