# Empathy Ledger capability check — can EL be the home for Goods story media?

**Date:** 2026-07-20 · **Method:** read-only probe of the EL Supabase (`yvnuayzslukamizrlhwb`) with the Goods EL key, scoped to the Goods project `6bd47c8a-…`. No writes performed. Grounds the "EL as system of record for community/story media" decision ([media-tagging-model.md](../canon/media-tagging-model.md)).

## Verdict

EL is **technically capable** of being the home for Goods' community and people media. The blocker is not capability, it is that **the governance data is almost entirely unpopulated** for Goods, and two things are genuinely EL-side product decisions. The work is roughly 20% code (Goods can do it) and 80% consent/governance process (human, deliberate, and correct that it is).

## What Goods CAN do to EL today (the green lights)

- **Write access is real.** The Goods EL key is `sb_secret_…` — a Supabase **secret / service-role key**. It bypasses RLS: Goods can insert `media_assets` rows and write junctions, not just read.
- **File upload is possible.** EL has writable storage buckets — `media` (public), `story-images` (public), `gallery-photos` (public), `story-media`, `cultural-archives`, `intake-originals` (private). With the secret key, Goods can upload a photo file to a bucket and create its `media_assets` row. This was the main unknown from the last assessment; it is answered: **yes, Goods can put photos into EL.**
- **Storyteller linking works.** `media_storytellers` junction has **1,449 rows** (391 `appears_in`, 609 `tagged_by_face`) with per-link consent (**51 granted, 673 pending, 276 not_required**). Goods already writes to this (`alignAdd`).

## What exists in EL but is EMPTY for Goods (the real work)

Of **148 Goods media_assets in EL**:

| Field | State | Meaning |
|---|---|---|
| `nation_or_community` | **null on all 148** | Community link exists as a field but is unpopulated |
| `country_or_place` | null on all 148 | Place unpopulated |
| `consent_granted` | **false on all 148** | Asset-level consent not granted |
| `consent_obtained` | false on all 148 | — |
| `elder_review_status` | **"unreviewed" on all 148** | No elder review run at asset level |
| `storyteller_id` (on asset) | set on only 2 of 148 | Linkage lives in the junction, not the asset row |

So EL has the whole governance model (community, per-use consent, elder review, cultural sensitivity, withdrawal) — but for Goods it is a mostly empty shell. Goods' **local** `media_links` (37 community + 99 person tags) is currently *ahead* of EL on tagging; EL is ahead on consent machinery.

## The EL communities table (first-class, but media does not FK to it)

EL has a `communities` table (50 rows, multi-tenant) with `id, name, slug, traditional_name, country_names, region, default_visibility, organization_id, status`. It already lists Goods communities: Alice Springs, Palm Island, "Utopia Homelands (Urapuntja)", Tennant Creek, Kalgoorlie, "Katherine / Nitmiluk", "Lake Argyle / Kununurra".

**But** `media_assets` links to community only via the **text** field `nation_or_community`, not a foreign key to `communities.id`. So "photo → community" in EL is text-based or derived via the storyteller, not relational. `default_visibility` on the community is a governance hook for collective ownership.

## What is a Goods change vs an EL change vs a human process

**Goods can do now (has the service key):**
- Upload local `/images/community/…` photos into an EL bucket + create `media_assets` rows.
- Populate `nation_or_community` from Goods' existing `media_links(community)` tags.
- Write `media_storytellers` links from Goods' `media_links(person)` tags.
- Make the Media Room tag **write through** to EL, so tagging in Goods populates EL.

**Needs EL-side product work:**
- A real `media_assets.community_id` FK to `communities.id` if we want relational (not text) community linking.
- Community-admin login/roles so a *community* (not just each individual storyteller) can govern the collective story. The fields support it (`default_visibility`, `consent_granted_by`, `requires_consent_from`); the roles/UX may not.

**Human governance process (not code, and correctly so):**
- Actually obtaining consent + elder review for the backlog (673 junction links pending, 148 assets unreviewed). This is the "communities owning their story" work. It should be deliberate.

## Consent caution

`consent_granted` is false on all 148 assets and 673 junction links are pending. Goods currently displays EL media using its **own** consent logic (the cleared-voices allowlist + `mediaTier`), not EL's `consent_granted`. If Goods switched to gating on EL's field today, almost nothing would show. Moving EL to consent-authority means **reconciling** Goods' cleared set with EL's consent state, and making EL the place consent is *granted* going forward.

## Recommendation

Adopt EL as the home for story media, via a **bridge, not a rip-out**:

1. Keep Goods' `media_links` as the working relationship layer (it holds the tags EL lacks).
2. Make it a **write-through to EL**: when Ben tags a community/person media item in the Media Room, also populate EL (`nation_or_community` + `media_storytellers`). Goods seeds EL with the tagging it has already done.
3. EL becomes the **consent authority**: consent + elder review happen in EL; Goods reads consent back and reconciles its cleared set to EL over time.
4. Product/brand/diagram media stays local (not story, no community owner).
5. Take the two EL-side items (media→community FK, community-admin roles) to whoever owns EL — they are the difference between "linked via a text field / storyteller" and "properly relational + community-governed".

The one-line answer to "is this possible": **yes — EL is built for it and Goods can write to it; what's missing is populated tags, granted consent, and two EL product decisions, not capability.**
