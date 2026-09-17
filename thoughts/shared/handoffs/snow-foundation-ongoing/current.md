---
date: 2026-09-17T22:10:00+10:00
session_name: snow-foundation-ongoing
branch: fix/snow-page-and-letter
status: active
---

# Work Stream: snow-foundation-ongoing

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-09-18T06:10:00+10:00
**Goal:** The Snow partner report reads like a person wrote it and shows the argument in pictures, not paragraphs. Done when Ben will put it in front of Sally and the in-principle letter is drafted.
**Branch:** `fix/snow-page-and-letter` in `../goods-ledger-wt`. **74 commits ahead of origin/main, NOT pushed, no PR.**
**Test:** `cd v2 && npx vitest run && npm run check:voice && npm run check:drift:ci && npm run build` (1246 tests green at handoff)

### Now
[->] **Ben to look at the new closing chapter, "What ten years of it could look like", at `http://localhost:3013/partners/snow/story#ch-ten`.** Built 17 September, 22:20, uncommitted. It is the impact model run forward: the same four boxes with ten-year totals and today's figure under each, ten year-columns (Goods on Country facility filled and flat from year two, community facilities dashed and growing), and under the years a base in four layers: Made on Country (facilities per year, dashed), Members of the charity (organisations per year, dashed, proposed), The enterprise (solid, happens today), The board (solid, in place today). Slider 1 to 3 facilities a year, everything recomputes from `ten-year-scale.ts`, claim ceiling printed. Component: `v2/src/components/partners/ten-year-model.tsx`. The `TenYearSlider` came OUT of the money chapter (it would have printed the model twice); the `THE_NEXT_TEN.forward` line now points at the closing. Two tells reworded in `THE_NEXT_TEN` ("That is the difference between", "not our capacity but theirs"). Gates: tsc clean, 1246 tests green, tells checker clean on the new file.

[->] **18 September, 05:40. Chapter 11 is now the whole closing: the ten-year drawing (ceiling and slider caption removed on instruction, Enterprise box = organisations trading, 24 in FY36, "4 organisations buying today"), then "The board and the members" (`MEMBERS_MODEL` in snow-partnership.ts, membership wording pulled from `ORGANISATION.membership` so it stays proposed), then "The setting" from the new `remote-communities.ts`. The two-year chapter (step chart + four-on-a-base) was REMOVED on instruction; both components still exist unused.** Setting figures: **1,452 remote and very remote places** (874 communities, 542 outstations, 34 town camps, 2 other; NT 790, WA 338, QLD 181, SA 138, NSW 5) from `goods_communities` in the shared project `tednluwflfhxyucgwigh` (AGIL gazetteer + Bushtel), queried 18 Sep. **That table's `estimated_population` is a 150 placeholder on 988 of 1,434 very remote rows and its `demand_beds` is the banned households x 1.2 formula: never sum or print either.** People are the ABS ERP 30 June 2021: 58,700 remote + 92,100 very remote = **150,800** (Census raw count 44,072 + 74,135 = 118,207, carried in the module, never printed). Gates: tsc clean, 1254 tests, tells clean.

[->] **18 September, 06:10. Chapter 11 now runs: ten-year drawing (Enterprise box = organisations trading) → Palm Island bed photo (`woman-boy-new-bed.jpg`, not used elsewhere) → The potential (1,452 places / 150,800 people / 11 served) → The board and the members (compounding line in a rust-wash box, then Kristy's "We know what we wanna do on our land" via Pull) → What a member grows into (three cards, third dashed as the aim) → The buyers as three rows of figures (bought: 4 orgs, 320 beds, $273,966 inc GST, 5 invoices, $370 to $800; no-tender lanes from `JURISDICTIONS` with plain-word labels; remote housing money $4B / 1,508 bedrooms / $818M / $1.012B). After Norm's last word the page now ends on the pitch's listening map (`MadeWithCommunity`, same consent gate, confirmed by Ben 16 Sep). Removed on instruction today: the ceiling paragraph, the slider caption, the "measures the place" line, the "tests the seller" sentence, "through the lanes above". Timeline edits: "Sally and Maree head back to Tennant Creek. Their own trip, to support the Wilya Janta house warming."; FY26 agreement entry opens on Snow's own words. Money chapter lead rewritten in plain voice. All gates green at each step; NOTHING COMMITTED.**

[->] (previous) **Hand the impact model to a Fable design pass.** The model lives in `v2/src/components/partners/impact-model.tsx` and renders inside the `ch-themes` chapter of `v2/src/app/partners/[slug]/story/page.tsx`. Page: `http://localhost:3013/partners/snow/story` (dev server already running on 3013 from this worktree).

**What the model has to say, and why it is shaped this way.** Four boxes across the top, one per area, each holding a single number: Health 540 beds off the floor, The plastic 3,540 kilograms out of the tip, Paid work 30 young people paid, Enterprise 320 beds bought and paid for. A line drops from each box onto a full-width base, and the base is Indigenous ownership and leadership. It is split: the left 55% is solid and filled (Indigenous leadership, three Indigenous directors holding the purpose, the assets and the decisions), the right is dashed and empty (Indigenous ownership, 0 sites owned where they stand). **The relationship is the whole point: the four are not peers of the fifth, they rest on it.** Ben rejected three earlier attempts (five equal rings in a row, a cumulative trade chart, and a separate ownership chapter) before this one.

Above it in the same chapter is `growth-over-time.tsx`: a step chart of cumulative beds from the five real invoices, 60 in Aug 2025 to 320 in Jul 2026, with the buyer named above every step. That one Ben has not objected to. **The buyers make the argument by themselves** and no prose should restate it: Centrecorp Foundation (Aboriginal charitable trust) twice, Mala'la Health Service Aboriginal Corporation (ACCHO), Homeland School Company, ALIVE National Centre.

### This Session
- [x] **Photo drop finally works end to end.** The blocker was the host test: Google Photos serves from `photos.fife.usercontent.google.com`, which does not contain "googleusercontent", and the address ends `=w403-h268-no` not `.jpg`, so both the host list and the extension test threw the picture away. Fixed, plus `&quot;` stripped off dragged URLs. **The real fix was moving the fetch into the browser** (`fetchHere` in `photo-drop.tsx`), because the Google session lives in the tab and never on our server. Before: every imported photo was a 403px, 50KB thumbnail. After: 2000x1333 originals with Canon EOS 6D EXIF intact.
- [x] **Tagging works for every photo.** 70 images were in the grid with no `content_items` row, so the bulk tagger, the per-item editor and the notes editor all skipped them **in silence**. `/api/admin/content-item` now takes `create[]` and registers a photo as part of the write. Backfilled 63 via `content:index`. One `+ Snow` button in the bulk bar tags a whole selection `use:snow`. **Every successful bulk write now says what it did** (the Snow button tagged 87 photos and looked completely dead, because a tile never shows its tags).
- [x] **Community and person are pickers, not free text**, in the drop card and the item panel, and each writes the FK *and* the tag. `storyteller_id` points at the v2 `storytellers` table, **NOT** the EL roster: different id spaces, Xavier is in one and not the other.
- [x] **121 Alice Springs build photos got their bucket back.** They carry `storage_path` with no bucket prefix and null `cdn_url`/`thumbnail_url`/`source_url`; `align.ts` only knew `source_url`. They are in `story-images` (public).
- [x] **19 photos retagged** where the community tag disagreed with the folder (16 Kalgoorlie/Palm Island photos were carrying `community:mt-isa`). Ben spotted one; the sweep found the rest.
- [x] **Conference is not a community:** the drop route wrote `community:philanthropy-australia`. Events that name an `events/` area now get an `event:` tag. Two rows corrected.
- [x] **95 photos tagged `use:snow`, distributed across the page** (top strip, road stops by place, gallery grouped by place), deduped against everything hand-placed so nothing appears twice.
- [x] **Whole-page prose pass against the AI tells.** Read all 98 rendering strings. Killed the "inside it rather than beside it" frame that ran three times, two "this is the difference between" frames, "production moving on Country is not a plan we are describing", and every instance of the page congratulating itself on its own honesty ("the one we print against ourselves", "and it says so").
- [x] **Two factual corrections from Ben.** INV-0259 was **60 Basket Beds at $370** (Aug 2025), INV-0291 was **107 Stretch Beds at $560** (Nov 2025); the Stretch Bed entry had wrongly claimed the sixty. And the "the drum is a Speed Queen and it stays" claim came out of two places as **not right**.
- [x] **Removed on instruction:** chapter 12 (the whole ask chapter, recoverable at `6ef7d6a`), the VERIFIED/MODELLED/NOT YET chips, the footer provenance note, the board photo credits and boilerplate director bios, the PROGRESS_BRIDGE buyers block, the Oonchiumpa status paragraphs, the frame-count line under the top strip, `WHY_FLEXIBLE`, and several one-liners.

### Next
- [ ] Ben's verdict on the ten-year closing (chapter 12). One pre-existing rendered tell left alone in `THEMES.plastic.body`: "as economics rather than as an environmental case".
- [x] Fable design pass: done as the ten-year closing rather than a redraw of `impact-model.tsx`, which Ben had accepted.
- [ ] **The in-principle letter.** Draft lives at `thoughts/shared/drafts/2026-09-17-snow-letters.md` (Ben-to-Sally email + a draft for Snow letterhead). **Wanted ~21 September. QBE closes Friday 25 September 12pm AEST.** NEVER SEND: hand Ben the words.
- [ ] **Em dashes.** 386 spaced ` — ` in rendered prose across 122 non-admin files (1529 total including comments and tests). Ben: remove all of them site-wide. **Not started.** A blanket comma is wrong; a colon is the closest single substitute and act-voice permits comma, full stop or colon.
- [ ] **Australian English sweep.** `realized` fixed in Jeremy's quote. Remaining: 4 `realize`, 1 `utilizing`, 1 `organizing`, 1 `analyzed`. **Do NOT touch `color` (1999) or `center` (1999)**: they are CSS properties.
- [ ] **Too many factory images** in the Snow photo set, per Ben. Not yet triaged.
- [ ] Captions: only 14 of the 95 `use:snow` photos have one, and the caption is what the page prints.
- [ ] Two photos in the Snow set are not photographs of the work: `/images/community/maningrida/wordmark-wall.jpg` and `/images/model/sleeping-on-it-1e5a8385.jpg`. Tag `use:snow-hide`.

### Decisions
- **Ben's writing-style ruling, 17 Sep, after pasting the whole Wikipedia "Signs of AI writing" page:** no bolded mini-headers, no reflex tables, no "X, not Y", no status sign-off formula, Australian English always. Applies to chat replies as well as published prose. Saved as `feedback-no-ai-tells-in-chat-replies`.
- The four areas **rest on** Indigenous ownership and leadership. Not five peers. This was the fourth attempt and the one that stuck.
- Growth is drawn as a **step, never a slope**, and nothing continues past the last invoice. A dashed line rising off the right edge is a forecast wearing a drawing's clothes.
- A photograph already in the library is **tagged where it lives, not copied again** (checksum match); two Google Photos originals turned out to be byte-identical to an EL-held photo and to `basket-bed-hero.jpg`.

### Open Questions
- UNCONFIRMED: **what is actually inside the next washing machine?** The page no longer says, because "the drum is a Speed Queen and it stays" was wrong and I would not guess a replacement. Does it keep a Speed Queen, and is that the whole machine or a part?
- UNCONFIRMED: **was removing chapter 12 (the ask) intended to be permanent?** The report now has no ask in it. Recoverable at `6ef7d6a`.
- UNCONFIRMED: Patricia Frank's registry role reads `Aboriginal Corporation Worker, Oo Tribe, White Cockatoo clan`. "Oo Tribe" and "White Cockatoo clan group" come verbatim from EL `cultural_background`; **"Aboriginal Corporation Worker" is in no source** and was typed into our registry. Her clan is also being rendered inside a job title. **Do not "correct" her stated cultural identity without her.**
- UNCONFIRMED: `/images/people/karen-liddle.jpg` is a real 170K portrait with no `content_items` row. Her life story is ON HOLD in EL until she reviews it, so I flagged rather than indexed it.
- UNCONFIRMED: `basket-bed-hero.jpg` lost its rating and community during API testing. Tags restored to `use:snow`; if it had a rating or community before tonight, those two values are gone.

### Workflow State
pattern: iterative-design
phase: 4
total_phases: 5
retries: 0
max_retries: 3

#### Resolved
- goal: "Save state so a Fable model can take a run at designing the impact model"
- resource_allocation: balanced

#### Unknowns
- next_machine_internals: UNKNOWN
- ask_chapter_permanent: UNKNOWN

#### Last Failure
(none: 1246 tests, voice, drift and build all green at handoff)

---

## Context

### The relationship, as the books now have it
**Ten paid invoices to the Snow contact, INV-0092 to INV-0321, October 2023 to May 2026, $493,129.79 inc-GST, $0 outstanding.** Nine of them are Goods, and those nine are **$457,929.79**. Snow remains far and away the largest philanthropic backer either way.

The most recent is **INV-0321, $132,000, paid 22 May 2026**: $60,000 for 100 beds at $600 and $60,000 for the on-Country production plant. Georgina sent the notification and agreement herself on 19 May, cc Sally.

### People
- **Georgina Byron AM**, CEO. Registry tier `funder`, portrait in the repo, **twelve approved quotes** and two on `hold`. Her recording is Descript `QOpJepwNzo9`
- **Sally Grimsley-Ballard**, Head of Partnerships, Our Country. Also **sits on the Goods advisory group** and is listed as a project referee
- **Maree Meredith**, Consultant. Holds the out-of-session letter decision
- **Bhanvi**, impact investment. Leads the loan pathway
- **Ashley Machuca**, **L. McKee**, **Carolyn Ludovici** (Our Place, 2024, may be stale)

### What a letter has to do
Report what the money did, name what is not finished, make one ask. The report is easy now. The ask is the hard part, which is why it is question 1.

Gates: `act-voice`, then `/straight`, then `/ground`. Ben reads it last and sends it himself.

### Traps
- The allocation split on the Snow dashboard is indicative. Never an acquittal
- `check:voice` allows "catalytic" for the QBE programme name and when quoting a funder, and BANS it as our own framing. Quote Georgina, do not assert it
- The $120K Jan 2026 proposal uses the **superseded 25kg a bed** plastic figure. Canon is 20kg
- Snow's national giving ("Our Country") is **targeted, not an open application**. There is no form. It is a relationship decision, which is how it already works
