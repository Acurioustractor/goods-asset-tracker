# Area 11 — The Goods Atlas: one model for people, places, products, stories, media

> The unification pass. Today person data lives in ~20 stores joined by fragile name
> matching. The Atlas gives every person ONE identity, every entity a place on the map,
> and the dashboard drills from map → community → person → their beds, stories, media.
> Status: MODEL + UX DRAFT 2026-07-19 (from the full source inventory, this session).

## What exists (inventory summary)
- **The hub already exists and is empty:** `crm_contacts` (Supabase) has columns for
  name/email/phone/org/roles/is_elder plus external ids (`empathy_ledger_id`,
  `compendium_partner_id`, `supabase_partner_id`, `grantscope_id`). Nothing reads or
  writes it today.
- **Person stores:** STORYTELLER_REGISTRY (42, canonical voices, slug + aliases),
  Supabase `storytellers` (~32) + `quotes`, EL storytellers (~30, uuid, with the real
  media↔person junction `media_storytellers`), team.ts, compendium advisoryBoard (13) +
  communityPartners contacts + funding (32), outreach-targets (52), BUTTERFLY_BOARD,
  partners registry, GHL contacts (pipeline truth), profiles (QR claims), orders
  customers, `assets.owner_name/recipient_name` free text, `community_demand.requested_by`
  free text, communities.key_people/procurement_contacts (seeded today).
- **Same humans exist in up to 4 stores with different keys** (slug / uuid / EL-uuid /
  GHL id / bare name). The only alias reconciliation is the storyteller registry.

## The model (five entities, one junction)

```
COMMUNITY (place, lat/lng)
   ├── ASSET (bed/washer; recipient → PERSON)
   ├── PERSON  ←—— the hub: crm_contacts becomes the one identity row
   │     ├── roles[]: storyteller | recipient | procurement | partner-contact |
   │     │            supporter | funder-contact | staff | advisor | facility-champion
   │     ├── external ids: el_id · ghl_id · storyteller_slug · profile_id
   │     └── links: community_id, org (PARTNER)
   ├── ORG (partner / funder / council; procurement flag)
   ├── STORY/QUOTE (registry-verbatim; storyteller_slug → PERSON)
   └── MEDIA (photo/video; person + community + tags)

MEDIA_LINK junction: media_url | person_id? | community_id? | asset_id? | kind | consent
```

Rules carried over: consent default-deny; registry stays the VOICE authority (crm_contacts
references `storyteller_slug`, never duplicates quote text); counts stay register-derived;
facility interest lives on communities (done) AND per-person as role `facility-champion`
with evidence note.

## Build sequence
1. **Populate `crm_contacts`** from the stores above via an idempotent seed script that
   dedupes on (storyteller slug/aliases) > email > phone > normalised name, writing a
   `sources[]` audit column. Islands (assets.recipient_name, demand.requested_by) get
   linked rows so every bed can reach a person.
2. **`media_links` table** (small migration) replacing free-text `people:` tags; backfill
   from local-image-tags, EL media_storytellers, partner video paths.
3. **The Atlas screen** (`/admin/atlas`) — see UX below.
4. Later: two-way sync jobs — Notion Community OS (communities/partners/stories DBs) and
   GHL (person_id ↔ ghl contact id), replacing name matching.

## UX design (mock: "Goods Atlas" frame in goods-theory-of-change-v2.pen)

Map-first, three-zone, progressive disclosure:
- **Left rail (nav):** existing admin sidebar.
- **Centre = the map (dominant region):** Australia with community markers sized by beds
  delivered, coloured by relationship status; washer badge; facility-interest ring. A
  canon strip above (540 / 177 / 20 / 11 / 3,540kg) with drift chip. Marker click →
  right panel. Impact mode toggle swaps markers to HDPE kg / signals 30d.
- **Right panel (drill, three levels):**
  L1 community: photo, counts by product, outstanding deliveries, demand, signals spark,
  facility stage, people chips, latest story quote, media strip.
  L2 person: portrait, roles, consent tier, their beds (register rows), their quotes
  (verbatim, labelled), their media, org links, GHL stage if any.
  L3 asset/story/media: the record itself with provenance.
- **Bottom strip:** global search (person/place/asset/story) + filters (role, product,
  consent tier, facility interest).
- Principles: one dominant region; every number click-through to provenance; consent
  tier always visible on person surfaces; no dead ends (every chip navigates).

## Open questions for Ben
- [ ] Populate `crm_contacts` as step 1 (needs the same named approval as today's migration for the seed write)?
- [ ] Map library: Leaflet (free tiles) vs Mapbox (nicer, token). Recommend Leaflet + CARTO tiles first.
- [ ] Supporters who are individuals (donors) — include in Atlas or keep GHL-only?
