---
date: 2026-09-18T07:05:00+10:00
session_name: snow-foundation-ongoing
branch: snow/after-305
status: active
---

# Work Stream: snow-foundation-ongoing

## Ledger
<!-- This section is extracted by SessionStart hook for quick resume -->
**Updated:** 2026-09-18T07:05:00+10:00
**Goal:** Write the Snow letter of support for the QBE Stage 2 application, grounded in the live Snow report. Done when Ben has the words to send (he sends; we NEVER send) and the QBE application can attach it before Friday 25 September, 12pm AEST.
**Branch:** `snow/after-305` in `../goods-ledger-wt`, clean on main `4a85bbe`. The report itself is MERGED and LIVE (PRs #303, #304, #305).
**Test:** `cd v2 && npx tsc --noEmit && npx vitest run && npm run check:voice && npm run check:drift:ci` (1,258 tests green at handoff). For the letter: `act-voice`, then `/straight`, then `/ground`.

### Now
[->] **The Snow letter of support for QBE.** Start from `thoughts/shared/drafts/2026-09-17-snow-letters.md` (Ben-to-Sally email + a draft for Snow letterhead), written before the report was rebuilt, so re-read it against the live page first. Ben, 18 Sep 07:00: "we still have to write the Snow letter of support for the QBE program based on all this."

### What is live, and how to open it
- Report: https://www.goodsoncountry.com/partners/snow/story (login https://www.goodsoncountry.com/partners/snow/login, password `snow2026` from `partner-dashboards.ts`; verified 18 Sep 06:58 in a real browser: correct password 200 ok, wrong password 401).
- Twelve chapters. The closing (12, "What ten years of it could look like") is the argument for the letter: ten-year drawing on the four-layer base with a slider; the potential (1,452 remote and very remote places, 150,800 people, 11 served); the board and the members with the three-box flow drawing and Kristy's self-determination line; what a member grows into; the buyers as figures with the no-tender lanes; Norm; the pitch's listening map. Chapter 7 is the whole model.
- Verified live after #305: 215 images loaded, 0 broken; map outline drawn; "Centrecorp bought a hundred and seven at $750".

### This Session (18 Sep, the ship)
- [x] PR #303 (the report, 80 commits) squash-merged to main 52b47fd. Merge from main kept this branch's five Snow files: main's copies were earlier commits of the same branch (#294 had carried a snapshot).
- [x] Vercel build failed twice on `@/lib/media/exif`: first untracked (blanket `media/` gitignore), then dropped by `.vercelignore` `media`. Moved to `v2/src/lib/photo-exif.ts`. **Never put application code in a folder named media.**
- [x] PR #304: live-only breakage. Empathy Ledger image host was allowed under `/storage/v1/object/public/**` only; Media Room rows use bucket paths without `/public/`, so the optimiser answered 400 for every EL photo live (dev skips the optimiser). Rule widened to `/storage/v1/object/**`. The listening map read its outline off disk from `public/`, absent on Vercel; it uses `AUSTRALIA_OUTLINE` now.
- [x] PR #305: Ben's live-page correction, Centrecorp paid $750; the price-explanation sentence removed.
- [x] **Vercel's GitHub integration did NOT deploy any of tonight's three main merges.** Each production deployment was created by hand: `POST https://api.vercel.com/v13/deployments?teamId=benjamin-knights-projects&forceNew=1` with `{"name":"goods-on-country","project":"prj_9XDLD6G1yMhvYdJXtS6jYm62q2dc","target":"production","gitSource":{"type":"github","repoId":1108222321,"ref":"main","sha":"<main sha>"}}` and `Authorization: Bearer $VERCEL_ACCESS_TOKEN` (in the shell env). If a merge shows no production deployment within two minutes, do that.
- [x] Six other worktree branches pushed for safety (docs/carveout-and-artefacts, design/admin-ia, feat/canvas-print-qr, feat/raise-stack-and-ruling-x, feat/qbe-story, fix/q3-structure-diagram-and-attachment-readme). Uncommitted work NOT touched: goods-lanes (10 files), goods-desk-wt2 (2), goods-placemat-wt (1), goods-public-wt (3).
- [x] Memory: index RESUME line rewritten; `goods-gitignored-media-traps` carries the media-folder trap. MEMORY.md is 23.9KB, over the soft target; audit later.

### Next
- [ ] The letter (above). Facts it can lean on are all on the live page; the ask ruling stands: **$99,750, 133 beds at $750, as a grant now**, recoverable capital named as the next chapter. NEVER write that Snow opened the loan conversation. Philanthropy is catalytic capital; quote Georgina, never assert it.
- [ ] Ben reads the whole live page once more in daylight; corrections come one line at a time, each is a PR plus the manual deployment call.
- [ ] Em dashes site-wide, captions on the Snow photos, the Australian-spelling back-catalogue: unchanged from the 17 Sep list.

### Decisions
- Ben, 18 Sep: Centrecorp paid $750 (the arc line). See the open question on the invoice record.
- Ben, 18 Sep: the closing chapter is the ten years, the two-year chapter is gone, the model is chapter 7 with its own tile, the potential sits under the ten-year drawing, the buyers are figures.
- No ceiling paragraph, no slider caption, no "measures the place" line, no "tests the seller" sentence: all removed on instruction. Do not put them back.

### Open Questions
- UNCONFIRMED: **the Centrecorp unit price.** `paid-trade.ts` still records INV-0291 at $560 a bed (107 beds, Nov 2025, with three facilitation workshops on the same invoice), so the buyers block prints "$370 to $800 a bed, first invoice to latest" from the invoices while the arc now says Centrecorp paid $750. One of the two needs Ben's ruling; nothing was changed in `paid-trade.ts`.
- UNCONFIRMED: whether Vercel's GitHub integration is broken for pushes to main generally, or only tonight. Preview deployments for branches worked every time.
- UNCONFIRMED (carried): what is inside the next washing machine; whether removing the ask chapter was permanent (recoverable at `6ef7d6a`).

### Workflow State
pattern: iterative-design
phase: 5
total_phases: 5
retries: 0
max_retries: 3

#### Resolved
- goal: "The Snow report is live; now the Snow letter of support for QBE"
- resource_allocation: balanced

#### Unknowns
- centrecorp_unit_price_in_paid_trade: UNKNOWN
- vercel_main_autodeploy: UNKNOWN

#### Last Failure
(none: live page verified clean at 06:58)

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
