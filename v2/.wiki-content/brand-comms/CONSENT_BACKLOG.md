# Consent backlog

> Field-capture brief for the storytellers who need work before their voice can appear externally on Goods surfaces. Sorted by what unblocks them.
>
> Use this doc when planning the next On-Country trip, or when a community partner is coming through Brisbane / Tennant Creek / Alice. Tick items off as they get captured. When all of one row is captured, the storyteller can move to Verified per [CONSENT_PROCESS.md](CONSENT_PROCESS.md).

## Status snapshot (2026-05-08)

| Tier | What it means | Count | Currently visible externally |
|------|---------------|-------|------------------------------|
| Verified | EL has consent-clean Goods story | 15 storytellers + 1 org | Yes (live on /brand, /api/press-kit, funder pages) |
| Quote ready, EL row missing | Goods quote exists in `content.ts`, no EL story attached | 2 | No |
| In EL, no Goods quote | Person is in EL but no Goods-context content captured | 4 | No |
| Not in EL | Referenced in repo, no EL record | 9 | No |
| Name / location reconciliation | Records exist, naming or location needs storyteller confirmation | 2 | (Yes, but with the wrong form) |

**Verified roster:** Dianne Stokes, Cliff Plummer, Fred Campbell, Alfred Johnson, Linda Turner, Gloria, Annie Morrison, Chloe, Brian Russell, Tracy McCartney, Ivy, Melissa Jackson, Norman Frank, Jason, ACT Production Team. (15 individuals + 1 org.)

**Update 2026-05-22:** Mykel (young maker, Utopia Homelands) added to Group 3 from the Oonchiumpa-supported Utopia trip. First young-person and first Utopia voice captured. Youth consent protocol applies, see the note under Group 3. Two senior men at Ampilatwatja, both recent Order of Australia recipients (given four beds), and their short bed video are also pending capture and confirmation of names, credit and consent.

**Update 2026-06-26:** Mykel and Xavier (Xavier's arc told in Fred Campbell's voice) are CLEARED for external and funder use, Oonchiumpa-facilitated and approved (Ben consent pass; mirrors canon `cleared-voices.ts` + `canon.ts`). Their verbatim quotes are live on `/partners/centrecorp` and `/field-notes/utopia-may-2026`. The two Ampilatwatja Order of Australia Elders are cleared for use; their individual full names are still to confirm before crediting them by name. The youth-consent process note under Group 3 stays as guidance for the next young person.

---

## Group 1. Quote ready, EL row missing (fastest unlock)

These two need only an EL admin to create a Goods-project story row using the verified quote already in `v2/src/lib/data/content.ts`. No new field capture required, just data entry.

### Patricia Frank (Elder, Tennant Creek)
- **EL status:** storyteller record exists, profile photo on file, 0 stories.
- **Quote available:** "They truly wanna a washing machine to wash their blanket, to wash their clothes, and it's right there at home." (`content.ts`, theme = washing-machine, verified)
- **Suggested EL story:** title `Patricia Frank: On the washing machine`. Themes: washing-machine, dignity. Story type: personal_narrative. Project: goods.
- **Coordinate with:** Norman Frank Jupurrurla / Wilya Janta. Patricia connected Goods with language groups across NT for the washing machine naming.
- **Photo:** EL has profile_image_url already. Local fallback also exists (`/images/people/patricia-frank.jpg`).
- **Open question:** confirm with Patricia she's happy for this specific quote to be syndicated. Sign the consent form.

### Jimmy Frank (Tennant Creek)
- **EL status:** storyteller record exists ("Jimmy Frank"), 1 story already on a non-Goods project, 0 Goods stories.
- **Quote available:** "Our strengths is our culture, our country, you know, and our language." (`content.ts`, theme = co-design, verified)
- **Suggested EL story:** title `Jimmy Frank: On cultural strength`. Themes: co-design, culture. Project: goods.
- **Coordinate with:** Norman Frank Jupurrurla / Wilya Janta.
- **Photo:** EL has profile photo. No local fallback.
- **Open question:** repo also references him as "Jimmy Frank Jupurrurla" (skin name). Confirm with Jimmy which form he wants used publicly before any rename of the EL `display_name`. See Group 5.

---

## Group 2. In EL but no Goods-context quote (blocked on field capture)

These four are in EL, consent confirmed by you, but the existing repo content is either a placeholder or non-existent. Need a real, attributed quote captured before they can move to Verified.

### Kristy Bloomfield (Elder, Alice Springs)
- **Role:** Director, Oonchiumpa Consultancy.
- **EL status:** storyteller record exists with profile photo. 2 stories already, both syndicated, both on "The Homestead" project. 0 Goods stories.
- **What we have:** placeholder quote in `content.ts` flagged `verified: false // PLACEHOLDER`: "We see this as bigger than beds. It's about families owning the whole thing, the making, the business, the future."
- **Theme suggestions for capture:**
  - Community ownership transfer (the model: Goods becoming unnecessary)
  - Co-design and Oonchiumpa's role
  - Why this matters for Alice / Atnarpa families
- **Capture brief:** 5-10 minute conversation. Goal: one verified quote (~25-40 words) on community ownership / co-design. Could double as a deck slide quote.
- **Coordinate with:** Tanya Turner (Oonchiumpa Manager) or directly via `kristy.bloomfield@oonchiumpa.com.au`.
- **Photo:** EL profile photo present.
- **Process step:** book a call. Do not use the placeholder quote externally even if the existing draft sounds like her.

### Aunty Ivy (Elder, Mt Isa)
- **EL status:** storyteller record exists, profile photo on file. 1 story already syndicated on "BG Fit" project. 0 Goods stories.
- **What we have:** nothing in `content.ts` directly attributed to her. The Goods-context "Hardly anyone around the community has beds" quote belongs to **Ivy (Palm Island)**, a separate EL record (also Verified). See Group 5 for the duplicate question.
- **Theme suggestions for capture (if Aunty Ivy is the right Goods voice):**
  - Beds / bedding access in Mt Isa
  - Cross-community connection between Mt Isa and Palm Island
- **Capture brief:** confirm with Aunty Ivy whether she wants a Goods-context voice at all. If yes, capture one short quote. If no, leave her on BG Fit and remove from Goods backlog.
- **Coordinate with:** whoever has the Mt Isa community relationship (check with Nic).
- **Photo:** EL profile photo present.
- **Process step:** disambiguation conversation must come first.

### Tanya Turner (Alice Springs)
- **Role:** Manager, Oonchiumpa.
- **EL status:** storyteller record exists, profile photo on file. 1 story (project unset).
- **What we have:** nothing. Listed in compendium as Oonchiumpa manager only.
- **Theme suggestions for capture:**
  - Operational reality of running an On-Country org
  - The relationship with Goods (manufacturing transfer, training, jobs)
  - What community ownership looks like day-to-day
- **Capture brief:** 10 minutes by phone or in person. Want one or two quotes that can sit on a funder brief (operational truth) and a community-partner page.
- **Coordinate with:** Tanya directly, or through Kristy Bloomfield / Fred Campbell.
- **Photo:** EL profile photo present.
- **Process step:** schedule call.

### Karen Liddle (Alice Springs / Atnarpa)
- **Role:** Board Chair, Oonchiumpa.
- **EL status:** storyteller record exists, **no profile photo in EL**, 0 stories.
- **What we have:** nothing. Listed in compendium as Board Chair only.
- **Theme suggestions for capture:**
  - Governance and Aboriginal-led decision-making
  - Why the Atnarpa / Alice community said yes to Goods
  - The accountability model
- **Capture brief:** 15 minutes. Karen's voice is high-leverage for funder briefs because she carries governance authority. Capture one quote on accountability / consent / community decision-making.
- **Coordinate with:** Kristy Bloomfield (likely the right facilitator) or via the Oonchiumpa office.
- **Photo:** **needed.** Take a portrait at the same session as the consent conversation. Heads up Karen this is for external use; offer her copies.
- **Process step:** combined session, quote + photo + signed consent form in one visit.

---

## Group 3. Referenced in Goods content but not in EL at all

These eight names appear in `content.ts` and/or `compendium.ts` but have no EL record. Cannot move to Verified without first creating their EL storyteller row, then running the full consent flow per [CONSENT_PROCESS.md](CONSENT_PROCESS.md).

| Name | Community | What we have in repo | Priority for Goods? |
|------|-----------|----------------------|---------------------|
| Jessica Allardyce | Miwatj Health, East Arnhem | Quote on the scabies-RHD pathway, theme: health | **High**, important for health funder briefs |
| Zelda Hogan | Tennant Creek | Quote: "tin shed to home", theme: housing | High, strong narrative |
| Carmelita | Palm Island | One-line quote in `content.ts` | Medium |
| Simone Grimmond | Groote Archipelago | Listed in compendium, no quote | Medium |
| Jacqueline | Alice Springs (Top Camp, Western Arrernte / Pertame) | Listed in compendium, no quote | Medium |
| Marty Taylor | Tennant Creek (Wilya Janta context) | Listed in compendium | Low, coordination role |
| Narelle Anderson | Tennant Creek (Wilya Janta context) | Listed in compendium | Low, coordination role |
| Dr Simon Quilty | NT health (CEO context) | Listed as CEO context, 20+ years NT health | Low, paid expert voice, different consent path |
| Mykel | Utopia Homelands (Central Australia) | Verbatim quotes from build-day recording (May 2026 trip). See [02-storyteller-voices.md](02-storyteller-voices.md) Utopia Homelands voices. | **CLEARED 2026-06-26** (Oonchiumpa-facilitated). Live on /partners/centrecorp + /field-notes/utopia-may-2026. |

**Process for each:** see "Onboarding a brand-new storyteller" in [CONSENT_PROCESS.md](CONSENT_PROCESS.md). Steps 1-9: confirm EL record needed → consent conversation → consent form signed → EL storyteller record created → EL story record with quote + photo → syndication flags set → sync script → verify on website.

### Youth consent note (satisfied for Mykel; guidance for any young person)

> Status: for Mykel this is SATISFIED — Oonchiumpa facilitated and approved his use, cleared 2026-06-26. The steps below remain the standard for the next young person.

A young person's consent is not theirs to give alone. Before any external use of a young person's name, words, photo or video:

- Family / guardian consent is required as well as Mykel's own willingness, with Oonchiumpa facilitating and Fred Campbell (Youth Case Worker, Oonchiumpa) as the natural contact.
- Confirm the Elder present and how he wishes to be credited (the recording uses kinship terms "grandson" and "brother"; full name and consent to confirm).
- Keep the recording and quotes internal-only until the above lands. Then run the standard onboarding (EL record → story → syndication flags → sync).
- This connects to the wider Utopia / Oonchiumpa story permissions still to be packaged (see `wiki/articles/communities/alice-springs-oonchiumpa.md`).

---

## Group 4. Photo gaps for storytellers already Verified

These five are Verified externally but EL has no `profile_image_url` for them, so the brand page falls back to the local `/images/people/` map (or empty). Local map covers: alfred-johnson, brian-russell, cliff-plummer, dianne-stokes, ivy, linda-turner, norman-frank, patricia-frank.

| Verified storyteller | EL photo | Local fallback file? | Action |
|---|---|---|---|
| ACT Production Team | ✗ | n/a | Org row, no portrait expected |
| Annie Morrison | ✓ | ✗ | OK (EL covers it) |
| Chloe | ✓ | ✗ | OK |
| Gloria | ✓ | ✗ | OK |
| Jason | ✓ | ✗ | OK |
| Melissa Jackson | ✓ | ✗ | OK |
| Tracy McCartney | ✓ | ✗ | OK |

The local fallback map should be deprecated over time. EL is canonical for portraits. When the next On-Country trip happens, capture portraits for any new storytellers and upload to EL `profile_image_url`, not to the repo.

---

## Group 5. Reconciliation conversations to have with the storyteller

These need the storyteller (not us) to decide. Don't change EL until you've spoken with them.

| Question | Storyteller | Resolution path |
|----------|-------------|-----------------|
| Display name with or without skin name? | Norman Frank, repo says "Norman Frank Jupurrurla", EL says "Norman Frank" | Ask Norman next time you see him. Update EL `display_name` to whichever form he uses publicly. Then update `content.ts` and `compendium.ts` to match. |
| Same question | Jimmy Frank, repo says "Jimmy Frank Jupurrurla", EL says "Jimmy Frank" | Same. Ask Jimmy via Norman / Wilya Janta. |
| Are these the same person? | EL has both `Aunty Ivy` (Mt Isa, Elder, BG Fit project) and `Ivy` (Palm Island, Goods project) | Three possibilities: same person (consolidate to one EL row, mark the other inactive), different people (keep both, disambiguate display names so EL search lands on the right one), or one is the wrong record (delete or archive). Ask. |

---

## Capture kit for the next field session

Bring on every On-Country trip:

- Signed consent form template (see CONSENT_PROCESS.md, step 3).
- Camera or phone for portraits. Save to a local folder per person.
- This doc, ticked off as items get captured.
- Notebook for verbatim quotes, write them down then read back to confirm.
- A way to upload portraits to EL `profile_image_url` after the trip (EL admin handles this part).

After the trip, the EL admin runs:

```bash
# Run from repo root
node tools/sync-storytellers-from-el.mjs
```

The diff will show which voices have moved from Pending to Verified. Within 5 minutes of EL state changing, /brand and /api/press-kit pick up the new voices automatically.

---

## See also

- [CONSENT_PROCESS.md](CONSENT_PROCESS.md), the six-step playbook
- [EL_LED_ARCHITECTURE.md](EL_LED_ARCHITECTURE.md), why EL leads
- [02-storyteller-voices.md](02-storyteller-voices.md), the curated voices library
- `tools/sync-storytellers-from-el.mjs`, diff script

## Last revised
2026-05-08, after the Tier 2 verification pass took the live count from 4 to 15.
