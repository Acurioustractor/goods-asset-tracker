# The consent process

> Step-by-step playbook for moving a storyteller from "Pending review" to "Verified" in the Goods brand & comms system. Empathy Ledger leads. Everything else mirrors. This doc is the human flow that keeps EL honest.

## The principle

A community member's voice does not appear externally on Goods surfaces (website, decks, press, funder briefs) unless **the storyteller has given explicit, current, recorded consent**, and that consent is reflected in Empathy Ledger.

EL is the consent-bearing system of record. If EL says a story is consent-clean, we use it. If EL says otherwise (or has no record), we don't.

## States and what they mean

In the [Storyteller Voices Notion DB](https://www.notion.so/1fe6ebeb9ed845d2bc0e7d2349321fe3) (mirrored from EL), each row carries a `Consent` field:

| State | What it means | Where you can use this voice |
|-------|---------------|------------------------------|
| **Verified** | EL has at least one consent-clean Goods story for this person. `syndication_enabled = true`, `consent_withdrawn_at IS NULL`, `is_archived = false`. | Website (/brand, /stories), press kit, funder briefs, slide deck, social. Always credit by name and community. |
| **Pending review** | Either EL has the storyteller record but no consent-clean Goods stories yet, OR EL has no record at all. We have a draft quote in `content.ts` but consent hasn't been confirmed. | Internal use only (advisory group, board, internal handoffs). Never publish externally. |
| **Withdrawn** | Storyteller has withdrawn consent. EL marks `consent_withdrawn_at = <date>`. | Nowhere. Remove from any external surface within 24h. |

## The six-step consent flow

For each storyteller currently in "Pending review", here is what moves them to "Verified":

### Step 1: Confirm the EL record exists

Open the EL admin (or query the storytellers table) and check whether the person has a record. If not, create one:

| Field | Required | Source |
|-------|----------|--------|
| `display_name` | yes | How they want to be credited publicly |
| `location` | yes | "Tennant Creek, Northern Territory, Australia" format |
| `bio` | optional | One sentence they wrote / approved |
| `is_elder` | yes (true/false) | Confirmed with community partner |
| `is_active` | yes (true) | New records default to true |
| `profile_image_url` | preferred | Photo in EL media library, with consent on file |
| `cultural_background` | optional | Their stated identity (e.g. "Warumungu") |

**If creating, preserve naming exactly as the storyteller prefers.** "Norman Frank Jupurrurla" is not the same as "Norman Frank" — use what they identify as.

### Step 2: Have the consent conversation

Always in person where possible. Always with the community partner organisation (PICC, Oonchiumpa, Anyinginyi, etc.) facilitating. The conversation covers:

- What we plan to share (specific quote, photo, story).
- Where we'll share it (website, deck, funder brief, press, social).
- For how long ("until you tell us to stop").
- That they can ask us to remove it any time, and we will within 24 hours.
- That we'll always credit them by their preferred name and community.
- That we'll never sell their story or use it without their permission.

### Step 3: Record the consent

Two things have to land:

1. **Signed consent form** filed in the project archive (PDF or scan). The form names the specific story / quote / photo, the storyteller's preferred credit, and the storyteller's signature with date.
2. **EL fields updated** for the relevant story:
   - `syndication_enabled = true`
   - `consent_withdrawn_at = NULL`
   - `is_archived = false`
   - `has_explicit_consent = true`
   - `consent_verified_at = <today>`

### Step 4: Refresh the mirrors

Run the sync script:

```bash
node tools/sync-storytellers-from-el.mjs
```

This reports the diff: which voices have moved from Pending to Verified, which are new, which need to be flagged. With `NOTION_TOKEN` set and `--apply` flag, the script applies the changes to Notion.

The website picks up the change automatically within 5 minutes (the EL pull is ISR-cached at 5 minutes on `/brand` and the press kit endpoint).

### Step 5: Verify on the website

Visit [/brand](https://www.goodsoncountry.com/brand) and confirm the new portrait appears in the gallery with the green "Live" dot.

Visit [/api/press-kit](https://www.goodsoncountry.com/api/press-kit) and confirm the storyteller appears in the `storytellers` array with `consentVerified: true` and `activeInEmpathyLedger: true`.

If they don't appear within 5 minutes, check the EL stories table directly to confirm `syndication_enabled` did get flipped.

### Step 6: Use the voice

Once Verified, the voice is available everywhere brand surfaces are. Always credit by name and community. Always reference the originating story, not a paraphrase.

## When a storyteller withdraws consent

Withdrawal is unconditional and immediate. The flow:

1. Storyteller (or community partner on their behalf) tells us they want their story removed.
2. In EL, set `consent_withdrawn_at = <today>` and `consent_withdrawal_reason` (their words).
3. Run the sync: their state in Notion becomes "Withdrawn", and they disappear from /brand on next ISR refresh.
4. Search any active funder briefs / decks / press materials in flight; remove their quote/photo within 24h.
5. Confirm with them that the change has happened, by phone or in person. Don't make them check the website to know we listened.

## Reconciliation list (audit findings)

The 2026-05-08 audit surfaced six data-quality issues that need closing:

| Storyteller | Issue | Resolution |
|-------------|-------|------------|
| Norman Frank Jupurrurla | EL has "Norman Frank" not the full name with Jupurrurla | Update the EL display_name to the form Norman uses publicly |
| Zelda Hogan | Not in EL at all | Create EL record (storyteller form). Then run consent flow if she wants her quote published. |
| Jessica Allardyce | Not in EL at all | Same. She is the Miwatj Health voice on the scabies-RHD pathway. Important for health funder briefs. |
| Ivy | EL has two records: "Aunty Ivy" (Mt Isa) and "Ivy" (Palm Island) | Confirm which is the Goods-related one. Either consolidate (mark one as primary) or disambiguate the names so EL search lands on the right person. |
| Alfred Johnson | EL location says "Brisbane", content.ts says "Palm Island" | Confirm with Alfred which is correct. Update the wrong one. |
| Tracy McCartney | EL location was "Adelaide", content.ts says "Mt Isa". Both wrong. | Resolved 2026-05-08: Tracy is from Kalgoorlie. EL updated to "Kalgoorlie, Western Australia, Australia". `v2/src/lib/data/compendium.ts` still says Mt Isa and needs updating to "Kalgoorlie, WA". |

Track these in the [Storyteller Voices Notion DB](https://www.notion.so/1fe6ebeb9ed845d2bc0e7d2349321fe3) under the row's `EL Story ID` field — each note already documents the specific issue.

## Onboarding a brand-new storyteller

Full path from "we just spoke to someone who shared a powerful quote" to "their voice is on the website":

1. **Right after the conversation**, write what they said in your own notes (don't publish anywhere yet).
2. Brief the community partner organisation. Confirm cultural protocols (Elder approval if applicable).
3. Schedule a follow-up where consent can be discussed properly.
4. At that meeting: walk through the consent form, get sign-off, record their preferred name and credit.
5. **Create the EL storyteller record.** Add their photo (from the field shoot, with consent recorded) to the EL media library.
6. **Create the EL story record** with their quote / video / written piece. Tag with project_id = goods-on-country.
7. Set `syndication_enabled = true`, fill `consent_verified_at`. Confirm `consent_withdrawn_at` is null.
8. Run the sync. Verify the voice appears on /brand within 5 minutes.
9. Send them a thank-you note (in person or by phone) confirming what's now live, and remind them they can ask us to remove it at any point.

## Roles and responsibilities

| Role | What they do |
|------|--------------|
| **Field lead** (Nic, or whoever is On-Country) | Has the consent conversation, witnesses signing, captures the photo. |
| **Community partner liaison** | Facilitates the consent conversation, ensures cultural protocols, holds the relationship. |
| **EL admin** | Creates / updates EL records. Sets syndication and consent flags. Holds the consent form file. |
| **Brand & comms** | Runs the sync script, verifies the website, updates the Notion DB, retires anything when consent is withdrawn. |
| **Anyone publishing externally** | Checks Notion DB before using a voice. If Consent ≠ Verified, do not publish. |

## Quick reference card

**Before publishing any storyteller voice externally, check:**

- [ ] Their row in Storyteller Voices Notion DB exists.
- [ ] Their `Consent` is "Verified".
- [ ] You're using their preferred name (per the EL `display_name`).
- [ ] You're crediting community (per EL `location`).
- [ ] The quote you're using is in `v2/src/lib/data/content.ts` `quotes` array with `verified: true`, OR pulled live from EL.
- [ ] If the use is sensitive (health, deceased family, cultural content), you've re-confirmed with the community partner this morning.

If any box is unchecked: **don't publish**. Pull a different voice or wait for the consent flow.

## See also

- [CONSENT_BACKLOG.md](CONSENT_BACKLOG.md) — the working list of what's blocked and what to capture next field trip
- [02. Storyteller Voices](02-storyteller-voices.md) — the curated voices library
- [EL_LED_ARCHITECTURE.md](EL_LED_ARCHITECTURE.md) — why EL leads
- [REUSABLE_PACK_POC.md](REUSABLE_PACK_POC.md) — the six databases
- `tools/sync-storytellers-from-el.mjs` — the EL → Notion sync script
- `v2/src/lib/empathy-ledger/featured-voices.ts` — how the website queries EL

## Last revised
2026-05-08, end of consent process documentation.
