# Ultra-plan — stories, tone, theory of change (2026-07-12)

*Plan run per `wiki/outputs/2026-07-11-codex-ultraplan-handoff.md`. Built from a full audit of
story surfaces vs `cleared-voices.ts` and a full tone sweep of `v2/src` + the deck HTML.
Owners: **[C]** = executable this run (not Ben-gated) · **[B]** = Ben decision checkpoint ·
**[C→signoff]** = Codex work that starts only after Ben signs the model definition (§6.10).
Nothing below emits an uncleared voice, a "co-design", an ownership-complete claim, a
health-outcome claim, or the locked revenue figure.*

---

## 0. Findings that outrank the plan (read these first)

1. **Jessica Allardyce (HOLD) is live on ungated external surfaces.** Rendered on
   `/story` (`v2/src/app/story/page.tsx:552`), hardcoded on `/shop/washing-machine`
   (`page.tsx:328–333`), and pushed into grant-compose output via `grant-content.ts:177`.
   Gate 1 violation → **[C] fix now** (swap to Dr Boe Remenyi, cleared practitioner,
   labelled practitioner — same washing→RHD logic). Her §6.5 elevation question stays
   with Ben.
2. **Jimmy Frank's Weave Bed line is in use** — `compendium.ts:517–521`, role
   "Traditional Owner, Weave Bed Co-designer", quote "Imagine if you could weave a bed?",
   rendered on `/communities/[slug]` (he's cleared so the gate passes it). Violates both
   the Weave ban and the co-design ban → **[C] fix now** (role → Traditional Owner; quote →
   his cleared culture line from `content.ts:198`).
3. **Dianne's totem line renders publicly** — `curated-quotes.ts:97–99` ("boundary of my
   totem… 24 years"). Foundation §3: totem line = hold for her say-so → **[C] replace** with
   her Pakkimjalki Kari line (foundation names it the quote to use).
4. **Locked revenue figures appear on funder-facing surfaces** — $741,111 / $713,827 across
   `sites/qbe-readiness/page.tsx` (5 lines, incl. "Accountant-signed … AU$713,827" while
   foundation §5 says no figure is signed), `funder-shared-content.ts:12`,
   `qbe-areas.json:44,142`, `grant-content.ts:212`, `canon.ts:109`,
   `sites/cost-lab/playbook-content.ts:3`. **[B] — money copy is Ben-gated. Not touched.
   Named checkpoint B-0 below.** If claims-ledger is meant to enforce the lock, these
   surfaces are outside its reach today.
5. **Frankie Holmes OAM, Donald Thompson OAM, Charley** are live on the published Utopia
   field note but **absent from `cleared-voices.ts`** — foundation §3 lists them E-tier, so
   either the allowlist is missing three names or the tier is wrong. Consent register is
   Ben's → **[B] checkpoint B-1**. (Field-notes bypass `isClearedForExternal` entirely —
   structural fix planned in A4.)

## 1. Ben decision checkpoints (named, none silently resolved)

- **B-0 Revenue surfaces:** the six files in §0.4 carry the locked figures. Keep (because
  QBE-internal?) or strip until the accountant signs? Also decides whether
  `impact-model.ts:595` may keep using $741,111 as the public impact-per-dollar denominator.
- **B-1 Allowlist gaps:** add Frankie Holmes OAM, Donald Thompson OAM, Charley to
  `cleared-voices.ts` (foundation says E) — confirm against the signed consent register.
- **B-2 Model definition sign-off** (= foundation §6.10). Blocks: ToC redraw (C-track),
  deck spine, diagrams (D-track).
- **B-3–B-9 = foundation §6.1–6.9 unchanged:** Utopia 107-vs-87 (`trip-stories` +
  oonchiumpa page vs `centrecorp-story.tsx`) · Palm "141, largest" PICC copy vs Tennant 159 ·
  washers 16-vs-10 · NPY 200–350 promotion · Jessica consent elevation · Homeland INV-0303
  $4,950-vs-$44,000 · "more than 400 Stretch Beds" prose · stale wiki community numbers ·
  Zelda-in-funder-exports confirmation — **audit answer for §6.9: no funder/deck/grant/PDF
  path imports `journeyStories`; her only exposures are the homepage `FeaturedStories`
  fallback (website tier — allowed) and the unmounted dead component
  `stories-client.tsx` (landmine, see A5).**
- **B-4b Snow config label:** `funders/configs/snow.ts:99` "First Nations leadership and
  empowerment" — if that's Snow's own program name, it stays; only Ben knows.
- **B-5b Georgina Byron's "empowering communities" quote** (`curated-quotes.ts:161`) —
  verbatim attributed speech from a funder-only voice; edit or retire is Ben's call.
- **B-6b Dianne say-so:** totem line returns only if/when she says so (per §0.3 it is
  replaced, not deleted — text preserved in git history and story-atoms holds).

## 2. Track A — stories (finish + review)

- **A1 [C] Consent enforcement now:** the §0.1–0.3 fixes.
- **A2 [C] Attribution hygiene:** `content.ts:488–491` "Diane Stokes"→"Dianne Stokes",
  "Norm Frank"→"Norman Frank" (spelling drift would fail the gate normaliser);
  `compendium.ts:489` "Waramungu"→"Warumungu".
- **A3 Conflicts — resolved vs queued:** Ivy: single Palm Island person, data uses bare
  "Ivy", allowlist's "Ivy Johnson" spelling is unused — resolved, no action. Annie Morrison:
  never labelled Elder anywhere — resolved. Gloria Turner: Kalgoorlie in `content.ts:427`
  but grouped with Palm/Tennant voices in `community-narrative.ts:128` → queue under B-3
  place check. Tracy McCartney: place consistent (Kalgoorlie) but two different quotes
  (`curated-quotes.ts:315` vs `content.ts:234`) → pick one at narrative sign-off.
- **A4 [C→signoff] Structural consent work:** field-notes (`trip-stories.ts` VoiceCards)
  bypass `isClearedForExternal` — route named cards through the gate; move hold-tier
  entries (Walter `curated-quotes.ts:322`, Georgina) out of exported maps into a
  non-exported holds module mirroring `story-atoms.blockedOrHoldVoices`; consume the EL
  consent flag when the EL privacy migration lands (counts unstable until then — site
  gates remain the safeguard).
- **A5 [C] Landmine removal:** `components/stories/stories-client.tsx` renders
  `journeyStories` ungated and is mounted nowhere — delete or gate. (Plan: delete;
  git history keeps it.)
- **A6 Portraits:** Ray Nelson + Dr Boe Remenyi cleared, quoted, no file in
  `public/images/people/` (also missing: Karen Liddle, Katrina, Shayne, Dorrie, Mark —
  voice-only by design for Karen/Katrina/Shayne). Feeds the photo pass (D-track), which
  must also honour the 7-of-9 no-place-media reality.
- **A7 Quote currency [C→signoff]:** apply foundation §3 turn-assignment quotes across
  surfaces once the narrative is signed (9 Jul `community-narrative.ts` picks win over
  older curated lines); Xavier stays Fred-narrated everywhere (verified: no direct Xavier
  quote exists; watch the bare "Xavier" voice label on `pitch/community-narrative`
  page.tsx:362).

## 3. Track B — tone

- **B-a [C] Co-design display strings (8 files, executed this run):**
  `design/page.tsx:131`, `design/mission-forward/page.tsx:221`,
  `design/community-voices/page.tsx:183`, `shop/page.tsx:219`, `content.ts:282,824`,
  `report-templates.ts:79`, `compendium.ts:517`, `curated-quotes.ts` context label →
  all become *designed in community / designed with community* forms.
- **B-b [C] Charity-frame display strings:** `centrecorp-story.tsx:35` ("less fortunate"),
  `shop/page.tsx:263`, `mission-forward/page.tsx:12`, `wiki/community/partner-guide:52`,
  `wiki/support/faq:59` ("in need" → asked-for framing), `team.ts:24`
  (empowerment → self-determination), `content.ts:1307–1308` ("Bed Recipient" video
  labels → community member framing).
- **B-c [C] Ownership phrasing:** `sites/qbe/qbe-site-workspace.tsx:80` "Community-owned
  plant" → pathway phrasing. Leave as-is (verified compliant or third-party fact):
  PICC "100% community-controlled" (true of PICC), Station Precinct "(community-owned)"
  (fact about the precinct), partner-dashboard `community-owned` stage labels
  (grade: not-yet), `stories/page.tsx:651` (data-sovereignty claim), deck L139 pathway
  arrow. Deck table cell L185 "community-owned plant" → review inside the deck-spine pass.
- **B-d Data-key migration (do NOT sed) [C→signoff]:** `theme: 'co-design'` union member +
  map keys in `content.ts` (15 refs), `insights/page.tsx:65`, `stories-client.tsx:156`
  (dies with A5), `featured-stories.tsx:24`, slugs `dianne-codesigner`
  (`content.ts:366`, `media.ts:235,286`), admin `photo-review.html:172` theme string.
  Migration = rename key to `'community-design'` in one commit touching all readers +
  redirect/alias for any persisted references (EL themes, URLs); schedule after narrative
  sign-off so labels land once.
- **B-e Health-outcome claims:** none found live — guards in `impact-model.ts:282` and
  `health-pathway.tsx:12` are working. Keep the claim ceiling in any new ToC/deck copy.
- **B-f Already-compliant, leave:** `press/page.tsx` bannedWords list, EL-edit admin
  guidance, `codesignQuote` dead identifier (`story/page.tsx` — renamed only if touched).

## 4. Track C — theory of change (all [C→signoff] behind B-2)

Current state: `theory-of-change.tsx` renders static `/theory-of-change.png` generated by
`scripts/generate_theory_of_change.py`; used only on `/impact` (page.tsx:1091). The diagram's
cycle is **Listen → Design → Make → Deliver → Learn → Improve** — no transfer/support stage,
i.e. the model's fifth stage is missing. Caption (component :44–47 + script :294) says
"Production transfers to community ownership" — should carry pathway + support-layer
framing. Script :113 "community-led design to community-owned production" and :221
"owned by them" need the same pass. `design/goods-theory-of-change-v2.pen` is uncommitted
WIP — **do not clobber**; open read-only via Pencil MCP in the design session and reconcile
with, not over, it.

Work once B-2 signs:
1. Redraw the cycle as the five-stage loop (listen/be asked → designed in community →
   made on Country in community hands → deliver + feedback → transfer + ongoing enterprise
   support) in `generate_theory_of_change.py`; regenerate svg/png/pdf; update ALT text and
   caption in `theory-of-change.tsx`.
2. Same loop, two products (Stretch Bed, Pakkimjalki Kari), many hands — align wording with
   `/impact` metrics tiers and the deck model slides so all three read as ONE model.
3. Reconcile or supersede the v2 .pen WIP; keep v1 `.pen` as archive.

## 5. Track D — after sign-off (sequence unchanged from foundation §7)

Deck spine (six turns, model first, ask last; register/ledger as honesty layer) → photo pass
(31 `design/deck-photos/` + `pitch-photo-review.ts` + media-pack against the spine; honest
about 7-of-9 media gap; fold in A6 portrait gaps) → model diagrams in Claude Design language
(five-stage loop, plant-transfer stages, place circuit), lockstep
`design/deck/claude-design-artifact.html` ↔ `v2/src/app/deck/page.tsx`.

## 6. Executed this run (the [C] set)

Consent: Jessica Allardyce replaced on `/story` (→ Patricia Frank, cleared washing-thread
carrier), and on `/shop/washing-machine`, `/canberra`, `wiki/products/washing-machine`,
`components/dashboard/health-pathway.tsx` and `grant-content.ts` (→ Dr Boe Remenyi,
labelled practitioner; her `content.ts` quotes/impactStories entries remain data-side —
press `featuredVoices = impactStories.slice(0, 3)` misses her only positionally, noted
under A4 structural work) · two more uncleared names found and swapped in the same pass: Simone
Grimmond → Daniel Patrick Noble and Jacqueline → Dorrie Jones (`grant-content.ts`
`communityQuotes`), Jacqueline → Dorrie Jones (`centrecorp-story.tsx` quote card) ·
Jimmy Frank Weave quote dropped + role → Traditional Owner (`compendium.ts`) · Dianne
totem/24-years quote removed pending her say-so (Pakkimjalki Kari line remains her
curated quote) · dead ungated `stories-client.tsx` deleted (+ index export). Tone: all
B-a co-design display strings (design ×3, shop, content.ts role/highlight,
report-templates, curated-quotes Linda context → "Being asked") · B-b charity-frame
strings (centrecorp "less fortunate", shop/mission-forward/partner-guide/faq "in need",
team.ts empowerment → self-determination, "Bed Recipient" video labels) · B-c
qbe-site-workspace plant description → ownership-pathway phrasing. Hygiene: A2 spellings
(Diane→Dianne, Norm→Norman in `content.ts`; Waramungu→Warumungu in `compendium.ts`).
Verification: tsc clean · greps confirm no display-string "co-design", no Weave quote, no
hold-voice on the fixed surfaces, no new revenue figure. Committed on
`docs/snow-onepager-assets`.
