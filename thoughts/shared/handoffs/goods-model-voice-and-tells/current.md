---
date: 2026-09-10T06:40:00+10:00
session_name: goods-model-voice-and-tells
branch: feat/empathy-ledger-accountability-events
status: active
---

# Work Stream: goods-model-voice-and-tells

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-09-10T06:40:00+10:00
**Goal:** The whole Goods model reads true and reads human. Done when the finance holds together,
the trade outside the raise is visible, only Goods-scoped consented voices are quoted, and no
surface ships AI tells.
**Branch:** feat/empathy-ledger-accountability-events (35 behind origin/main, 4 ahead)
**Test:** `node tools/check-ai-tells.mjs <file>` · `cd v2 && npm run check:tells`

### Now
[->] Nothing in flight. Ben's four named phases are the queue; he picks the next one.

### This Session
- [x] Model artifact rebuilt to eleven sections; new section 5, the trade outside the raise
- [x] Seven finance faults found and fixed on the model page
- [x] Six community voices added, one per layer, all registry-cleared external tier
- [x] Empathy Ledger scoped properly to the Goods project; three name findings
- [x] `tools/check-ai-tells.mjs` written, wired as `npm run check:tells`, inside `check:drift`
- [x] All three artifacts swept to zero errors and republished
- [x] Deck swept: S17 line rewritten, two claim ceilings allowlisted, S17 re-exported and swapped
- [x] 27 em dashes cleared from the Notion deck master; linked page renamed

### Next
- [ ] QBE application answers, one question at a time, and run the checker on them
- [ ] Story scroll from the consented voices; housing sovereignty leads, recycling does not
- [ ] Website journeys: community, buyer, funder, supporter
- [ ] Public site copy has never been through the checker

### Decisions
- **Price model, never cost-plus.** $750 at the door, $276 to make, $474 stays, freight on top.
- **Tim Fairfax is operating support**, unrestricted, which releases $100,000 of bed money = 133
  beds. Said the same way in every place on the page. Settled a live contradiction.
- **The asks total is split by kind of capital**, never one number against a bed count. Minderoo is
  listed and excluded because it is not live.
- **Two claim ceilings kept** and recorded in `tools/ai-tells-allow.txt`: S14 "The reason, not a
  claim", S18 "is an allowance, not a quote".
- **A quotation is never rewritten.** The checker blanks `<blockquote>`, `<p class="quote">` and
  markdown `>` lines. Ben's own transcript line now sits on the model page as an attributed quote.
- **Judgement is not a control for AI tells.** A gate is. See [[feedback-ai-tells-need-a-gate]].

### Open Questions
- UNCONFIRMED: Empathy Ledger's rows for **Karen Liddle, Mykel and Fred Campbell** still say nothing
  may be published until the person has reviewed. The registry records Ben clearing the May 2026
  Utopia voices on 26 June. Two records, two answers. Ben must say which wins before these quotes
  leave the working page.
- UNCONFIRMED: **Margaret Lloyd's location.** Empathy Ledger says Palm Island. The registry says
  Utopia homelands. The page follows the registry.
- UNCONFIRMED: **"Ntjillaburra" does not exist** in the ledger. A union query across twelve tables
  returns nothing. Needs Nic, or Ben meant Oonchiumpa.
- UNCONFIRMED: **ALIVE's money.** The page uses $75,000 for 100 beds. The reckoning doc records
  $101,200 received and $66,000 still owed, so the order is bigger than the beds. Not itemised.
- UNCONFIRMED: **The 50% share paid to Goods** in the ten-year chart is a shared-services split no
  community has agreed to. It makes less stay local ($375 a bed) than stays with Goods on a bed
  Goods sells ($474). Ben should move it or rule on it.
- Xero's connector would not connect all session. Every figure came from the repo, not a fresh pull.

### Workflow State
pattern: sequential
phase: 4
total_phases: 8
retries: 0
max_retries: 3

#### Resolved
- goal: "review the cost story, add the money outside the raise, align community voice, then go part by part"
- resource_allocation: balanced

#### Unknowns
- consent_record_precedence: UNKNOWN (registry vs Empathy Ledger)
- ntjillaburra_identity: UNKNOWN

#### Last Failure
(none)

---

## Context

### Paste this to resume

> Read `thoughts/shared/handoffs/goods-model-voice-and-tells/current.md` first, then
> `deliverables/finance/goods-financial-plan/README.md` (top four entries, 10 September).
> The model artifact is https://claude.ai/code/artifact/0b235115-7bbb-436f-bbe8-f716c283dcf5
> and it is the current picture of the whole model. Before writing any prose for a slide, a funder
> document or a public page, run `node tools/check-ai-tells.mjs <file>`. Do not defend a flagged
> phrase because of where it came from; delete it and rewrite. Ben's four remaining phases, in his
> order: the QBE application answers, the story scroll, the website journeys. Ask him which.

### The three artifacts

| Page | URL | What it is |
|---|---|---|
| Model | `0b235115-7bbb-436f-bbe8-f716c283dcf5` | The whole model, eleven sections, section 11 live |
| QBE review | `c3a9260a-c99f-4f63-b6b4-80e7fd8b4ab1` | Everything the raise needs, eight sections |
| Money map | `eeb96c11-6564-45ca-af68-69b7f4bac84d` | The money, with a live play section |

All three publish from `deliverables/finance/goods-financial-plan/*.html`. Republish by passing the
same `url`. Watches drop overnight; that is normal.

### The model page, eleven sections

1 Mission (five layers, capital aligned to jobs, six community voices) · 2 Impact · 3 Last year from
Xero · 4 One bed · **5 The trade that is already running (new)** · 6 Paid for · 7 Making · 8 To July
2027 · 9 Investing · 10 Asks · 11 Play.

### What section 5 says, and why it matters most

Goods has sold and been paid for **320 beds across ten invoices, $343,481 all time**. FY26 Goods
receipts were **$653,246**, of which **Snow was $375,000, or 57%**. Since 1 July, **$116,200** has
landed (ALIVE $101,200, Julalikari $15,000). The raise is not what keeps the lights on.

**The real hole in next year:** there is no Snow ask this year, and nothing in the plan replaces the
other $275,000. That is worth more than any single ask on the list and it is a relationship, not a
spreadsheet line.

### Seven finance faults fixed on the model page

1. Tim Fairfax counted as 133 beds in one section and zero in another.
2. The cost-per-bed curve was hardcoded and its caption contradicted the 628-bed break-even. Now
   computed live, drawing both crossings: 628 with freight on top, 796 if Goods carries it.
3. The asks table totalled $950,000 against 413 beds, Minderoo included.
4. The ten-year chart called Witta "unchanged" while it halves from 880 to 400.
5. The 50% share was unexplained and is backwards for a model about keeping money local.
6. 713 beds made against 510 paid for was unexplained. Now named: ~120 catalytic gap, ~83 July stock.
7. Freight defaults to nothing recovered, contradicting section 4's own rule. Said out loud.

### Community voices, and the scoping that Ben asked for

Six quotes, one per layer, all **external tier in `v2/src/lib/data/storyteller-registry.ts`**, which
is the record that governs what may be printed: Margaret Lloyd, Katrina Bloomfield, Tehmineh Mason,
Mykel, Karen Liddle, Shayne Bloomfield. Fred Campbell carries health in section 2.

**Empathy Ledger, scoped to project `6bd47c8a-e676-456f-aa25-ddcbb5a31047`** (project
`yvnuayzslukamizrlhwb`, read with the Supabase MCP and an explicit project_id):

- 44 storytellers via the join table `project_storytellers`. There is no project column on
  `storytellers`.
- 390 stories via `stories.project_id`, but **351 are archived photo captions** from the production
  team. 39 human stories. 13 public, 11 of those Maningrida film-frame captions.
- **Nothing in Empathy Ledger's own tables is approved for public display.** All 110 Goods
  `extracted_quotes` are `approval_status='pending'` with `public_display_consented=false`; all 486
  `storyteller_quotes` have `approved_at IS NULL`.
- Themes, Goods-scoped: housing_sovereignty and community_resilience lead;
  environmental_stewardship is the smallest. **The community does not talk about recycling.** The
  story scroll should not lead with it.

Three name findings:
- **Karen Little is Karen Liddle.** Alice Springs / Atnarpa. Goods is her only project.
- **Kristy Bloomfield has no Goods story and no Goods-scoped quote.** Her twenty quotes trace to The
  Homestead, Law Student Workshops and Caterpillar Dreaming. Quoting her for Goods is a
  project-scope error. A separate "Kirsty Bloomfield" row exists and is not her.
- **"Ntjillaburra" returns nothing** across twelve tables.

### The AI-tells gate

`tools/check-ai-tells.mjs`, nineteen rules from WP:AITELLS, ERROR and WARN tiers, default deny.
`tools/ai-tells-allow.txt` holds each permitted phrase with its reason. Wired as `npm run
check:tells` from `v2/` and into `check:drift`.

Two design points that must survive: **quotations are exempt and never rewritten**, and **keeps are
recorded on disk, not argued in a session**.

State: model, QBE review, money map and the deck all at **zero errors**. The Notion deck master has
**zero em dashes** and still carries ~72 negative parallelisms in its working notes, which were not
the ask.

### The deck

`v2/public/strategy/Goods Final Deck.pen`, gitignored, main working tree. The live sequence is the
**19 frames inside board `BEXfI`, "QBE 2026 — CLEAN BUILD"**. The 255 top-level frames are old
iterations; do not edit those.

To read the deck's printed copy without opening every frame, export it and run the checker:

```js
Export(["LDM1K","nYkbR","T814io","S28Ukn","LP8Uy","i3mL7v","MYAVQ","XRUz9","mDhny","esUr4",
"ZZ4GO","LX4ci","COJmo","nfPKg","TiKvy","F93w1o","rknzM","tVcLc","H5N2zG"],
"html-css","<scratchpad>/deck-text.html")
```

That is 2,199 words of real slide copy and it never has to enter context.

S17 (`rknzM`) changed this session: text node `o58zVR` now reads "Photographs show work already done.
No future site is pictured." Re-exported at 1.5x and swapped on the Notion deck master.

### Traps learned this session

- **`ntn api --file <path>` is a file upload, not a request body.** Using it for a PATCH returns
  "400 validation_error: Too many files" and writes nothing. Use `-d '<json>'`. Keep
  `stdin=DEVNULL` on every write or the call hangs forever.
- **A slide's copy lives in several blocks on the Notion deck master.** Sweeping the image is not
  enough; S17's footer sat in two more blocks. Search the page for the retired string.
- **An em dash can arrive through a page mention.** Its plain_text comes from the linked page's
  title, so no block patch can reach it. Rename the page.
- **Pencil `Get(document)` without a visitor is rejected.** `Copy` paints immediately, `Insert` does
  not until save and reopen.
- **python http.server sends HTML without a charset**, so local previews show mojibake that the
  published artifact never had. Prepend `<!doctype html><meta charset="utf-8">` to a preview copy.
- **Playwright screenshots must be written inside the repo root**; the scratchpad is outside the
  allowed roots.
- The Xero MCP was unreachable all session.

### On disk, uncommitted

`tools/check-ai-tells.mjs`, `tools/ai-tells-allow.txt`, the whole of
`deliverables/finance/goods-financial-plan/` (untracked), and a modified `v2/package.json`.
Nothing committed, nothing pushed. The branch is 35 behind `origin/main`.
