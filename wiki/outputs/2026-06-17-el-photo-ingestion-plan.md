# Empathy Ledger photo ingestion — the proper path (mapped 2026-06-17)

**Why this exists:** the Canon board (`/admin/canon`) can already *read* the whole EL photo
library and pin photos to QBE areas. Ben asked to also *add* desktop photos into the EL Goods
system. Before building that, I mapped how EL actually ingests a photo. Conclusion: **do not write
to EL directly from the board.** Here is why, and the safe options.

## What I found (read-only investigation)

1. **Our EL client is read-only.** `v2/src/lib/empathy-ledger/client.ts` only reads (content-hub
   API, syndication API, direct Supabase selects). There is no contribute/upload method.
2. **The only EL credential we hold is a `service_role` key.** It *can* write (bypasses RLS) — which
   is precisely the danger.
3. **Photos live in `media_assets`** (per `press-pack.ts`: "uploads via EL admin"). That table has a
   large consent / cultural-safety surface that the EL admin app populates and a raw insert would
   leave null:
   - **Consent:** `consent_obtained`, `consent_granted`, `consent_granted_by`, `consent_granted_at`,
     `requires_consent`, `requires_consent_from`, `contained_consent`
   - **Elder review:** `elder_review_status`, `elder_approved`, `elder_reviewed_by`,
     `elder_reviewed_at`, `elder_review_notes`
   - **Cultural safety:** `cultural_sensitivity`, `cultural_sensitivity_level`, `culturally_sensitive`,
     **`is_sacred_no_publish`**
   - **People / place / attribution:** `depicted_people_text`, `detected_people_ids`, `family_names`,
     `nation_or_community`, `country_or_place`, `photographer_name`, `attribution_text`,
     `requires_attribution`, `usage_rights`
   - **Data sovereignty:** `removed_by_storyteller_at`, `removed_by_storyteller_reason`
   - **Scoping / visibility:** `project_id`, `project_code`, `tenant_id`, `organization_id`,
     `storyteller_id`, `status`, `visibility`, `privacy_level`
4. **Storage buckets** (read-only list): public photo targets are `story-images`, `gallery-photos`,
   `media`; raw uploads land in the private **`intake-originals`** bucket; sensitive material in
   `cultural` / `cultural-archives` (private). So EL has an explicit *intake → review → publish* shape.

**The takeaway:** a one-click `service_role` insert from the board would create a photo record with
no consent, no elder review, no cultural classification, no attribution, and no sacred check — public
by accident, in a live Indigenous-data system other people and communities rely on. Not acceptable.

## Options (recommendation = A)

### A. EL admin app is the front door; the board only references (RECOMMENDED, no build)
Photos that belong in EL get uploaded through the **EL admin app**, where consent, elder review,
cultural sensitivity, depicted people, and attribution are captured correctly. The Canon board keeps
doing what it does well: *read* EL and pin to areas (already built). Desktop uploads that are
product/process/brand shots (not community/story) stay in the **local Goods canon** (already built).
- **Pro:** zero consent risk, no EL invariants bypassed, nothing new to build.
- **Con:** two surfaces (EL admin for EL photos, Canon board for local) — but that division is correct.

### B. Board-side "Send to EL intake" — intake-only, never public (SMALL, SAFE build)
A board action uploads the file to the **private `intake-originals`** bucket and creates a
`media_assets` row deliberately stamped: `status` = needs-review, `visibility` = private,
`requires_consent = true`, `consent_obtained = false`, `elder_review_status` = pending,
`is_sacred_no_publish` left for a human, with `project_id` / `tenant_id` / `uploaded_by` set and the
caption/tags we know. It enters EL's **review queue** — a human finishes consent + elder review in EL
admin before anything goes public.
- **Pro:** Ben can push from his desktop; EL's review workflow stays intact; nothing public without it.
- **Con:** real build + needs EL-side confirmation that this is the sanctioned intake contract
  (field names, required NOT-NULLs, the right bucket) before writing. Tier 3 — day-shift, deliberate.

### C. Direct publish via service_role (REJECTED)
Insert a public `media_assets` row straight from the board. **Not doing this** — it bypasses every
consent/cultural-safety control above.

## If Ben wants B, what I need first
- Confirm with the EL maintainer (Nic / EL team) that `intake-originals` + a pending `media_assets`
  row is the sanctioned intake path, and the required columns / NOT-NULL constraints.
- A consent capture step in the board UI (who consented, elder-review-needed?, sacred?, depicted
  people, attribution) so the row carries real metadata, not blanks.
- Storyteller / author attribution (we have `EMPATHY_LEDGER_FALLBACK_STORYTELLER_ID` /
  `_AUTHOR_ID`, but a real attribution is better).

## Decision (Ben, 2026-06-17): **A — EL admin app is the front door.**
No board-side EL write. EL-bound photos go through the EL admin app (consent/elder/sacred/attribution
captured there); the Canon board keeps reading EL + pinning; local canon handles product/process/brand
uploads. Direct `service_role` writes to EL `media_assets` are **rejected** (they bypass the consent
layer above). Revisit option B only if a sanctioned EL intake contract is confirmed with the EL team.

## Status
- Local desktop upload + canon remove: **built + verified** (`/admin/canon`).
- EL push: **mapped, decided A (no build).**
