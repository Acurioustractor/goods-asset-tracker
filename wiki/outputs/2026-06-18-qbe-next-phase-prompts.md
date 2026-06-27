# QBE pack and impact: next-phase prompts (2026-06-18)

*Paste-ready prompts for the next phase after a /clear. Two tracks: (A) finish the QBE area-page QA pass, Areas 03 to 12, and (B) the storyteller and impact follow-ons. Every prompt inherits the shared rules below. Brand-clean throughout: no em dashes anywhere.*

## Shared rules (every prompt inherits these)

- **Brand voice:** no em dashes (the #1 Goods rule and the #1 AI-writing tell), no decorative arrows in prose, straight quotes only, banned word "co-design" (say "design in community"), units with no space (20kg), capitalise On Country, First Nations, Elder. Guide: `wiki/outputs/2026-06-03-goods-brand-guide/BRAND-GUIDE.md` and `wiki/articles/brand-comms/01-voice-and-tone.md`. Memory: goods-brand-voice-rules.
- **Consent gate:** only cleared-external voices on any external surface. Source of cleared voices: the Goods Storyteller Library Notion database `1d30ccfd46854920b8f1933ec154c634` ("Cleared for external" view) and `wiki/outputs/2026-06-18-goods-storyteller-library-index.md`. Mykel cleared by Ben 2026-06-18.
- **Canon numbers only:** `v2/src/lib/data/asset-canonical.ts` (496 beds, 133 Stretch, 363 Basket, 16 washers, 9 communities, 2,660kg).
- **QBE Diagnostic database:** `cb3794d427914d72bf1036106d8116f5`. Password for gated pages: `OnCountry-E1C4AC`.

## 0. Master resume prompt (paste first, after /clear)

> Resume the Goods QBE work. Read `thoughts/shared/handoffs/qbe-thursday/current.md` (Ledger first) and the memory entries goods-brand-voice-rules and goods-cleared-voices-tiers. State so far: QBE Areas 01 and 02 of the 12 diagnostic pages are rewritten brand-clean (one clear artifact, no guff, the long merged detail moved to a sub-page, two models drawn, a cleared storyteller voice connected). The Start Here front door has a key-dates table and a five-must-wins block. The impact framework, the Q2 funder report, and the Goods Storyteller Library Notion database are built (see `wiki/outputs/2026-06-18-*`). Next phase: apply the same brand-clean rubric to Areas 03 to 12, one at a time, and work the storyteller follow-ons. Follow the shared rules in `wiki/outputs/2026-06-18-qbe-next-phase-prompts.md`. Confirm the active branch and the QBE database before editing.

## 1. Per-area prompt template

> Do QBE Area NN [title] (Notion page <id>). Apply the rubric: name one clear artifact up top; cut the guff; move the long merged strategic-pack detail into a sub-page and leave a scannable summary that links it; draw the model as a diagram or one-pager [MODEL]; connect a cleared storyteller voice [VOICE] where it strengthens the case, and skip the voice on pure finance or legal pages; brand-clean throughout (no em dashes, straight quotes, no "co-design", units with no space, On Country capitalised). Check every link opens and the password is OnCountry-E1C4AC. Show me the before and after, then pause for my review before the next area.

## 2. The ten area prompts (03 to 12)

**03 Business Model** (page `36eebcf981cf81fb8aa8de54f38bdeb4`). MODEL: the unit-economics table and the customer segments; move the go-to-market "8 pipes" to a sub-page. VOICE: Alfred Johnson (the freight tax) or Dianne Stokes (demand: offered to self-fund 20 beds after using one).

**04 Financial Management** (page `36eebcf981cf8167884fc3d5ecda0e32`). MODEL: the revenue picture and the breakeven curve (embed the computed diagram). VOICE: none (finance page). Keep the several money-in figures honestly flagged as the open accountant gate.

**05 Strategic Planning and Risk** (page `36eebcf981cf8143a283efd1eb5260d7`). MODEL: the three-phase strategy and the scenario fork; move the 14-risk register to a sub-page. VOICE: optional and light.

**06 Process and Technology** (page `36eebcf981cf81659f6afab915672b57`). MODEL: the operating-flow map and the six-system source-of-truth table. VOICE: none, or Mykel on the making.

**07 Governance, Data and Reporting** (page `36eebcf981cf813e9b6fc95d4e5a703a`). MODEL: the advisory-to-board plan and the reporting cadence. VOICE: the consent and OCAP practice in action; point to the Storyteller Library as the live consent system, with Ray Nelson's stamped consent as the worked example. Fix the 2,660kg verified-versus-modelled label.

**08 People and Organisation** (page `36eebcf981cf813cbfbbca1709600971`). MODEL: the capacity layers, the 12-month role map, and the founder-dependency map. VOICE: Kristy Bloomfield on Oonchiumpa partner capacity, optional.

**09 Legal Structure** (page `36eebcf981cf8106b398d52438170718`, keystone). MODEL: the entity-migration diagram (reuse the Area 01 hub-and-spoke); move the entity-wording block to a sub-page. VOICE: none.

**10 Investors and Capital Raising** (page `36eebcf981cf81329a11e33e2d121bf9`). MODEL: the capital stack and the pipeline flow; move the full strategy memo to a sub-page. VOICE: Ray Nelson, Dianne Stokes, or Kristy Bloomfield as traction evidence. Note: the 87-to-107 and the cost figure were already fixed 2026-06-18.

**11 Cost Model v6** (page `36febcf981cf8146a55de05050e956e9`). MODEL: embed the computed cost-down, breakeven, and where-$750-goes diagrams. VOICE: none.

**12 Investor Alignment Tool** (page `36febcf981cf81f5ad6dee375364d032`). MODEL: the alignment and scoring flow; keep the CASE-versus-SIH clarifying note. VOICE: none.

## 3. Storyteller and impact follow-on prompts

- **Feature Mykel:** add Mykel as the youth-and-ownership and circular spine voice to the Q2 funder report `wiki/outputs/ledger/2026-Q2-funder-cut.md`, verbatim quote, brand-clean, then revalidate with `node .claude/skills/ledger-story/scripts/check-story-draft.mjs`.
- **EL transcripts pull (deeper pass):** run the read-only Empathy Ledger transcripts pull per the CONSENT.md read paths (EL Supabase `yvnuayzslukamizrlhwb`, keys in `v2/.env.local`, read-only SELECT, never the Supabase MCP, never a write). Return Goods storytellers not yet curated, with consent flags.
- **voices.md flag (Ben's verb):** update Mykel's consent flag in the storyteller-voices source from pending to cleared (Ben, 2026-06-18), as a deliberate consent-data change.
- **Weekly ledger post:** write this week's ledger post from the Storyteller Library, one cleared voice, one photo, one place, per the ledger-story weekly format.
- **Keep the Notion library in sync:** when the index changes, re-sync the Goods Storyteller Library rows (`1d30ccfd46854920b8f1933ec154c634`).
- **Shoot list and conflicts:** commission portraits for Ray Nelson and Dr Boe Remenyi; resolve the place conflicts (Gloria Turner, Tracy McCartney) and the Annie Morrison Elder-status conflict.

## Artifacts this phase builds on

- Impact framework: `wiki/outputs/2026-06-18-goods-impact-framework.md`
- Q2 funder report: `wiki/outputs/ledger/2026-Q2-funder-cut.md`
- Storyteller library index: `wiki/outputs/2026-06-18-goods-storyteller-library-index.md`
- Goods Storyteller Library (Notion): `1d30ccfd46854920b8f1933ec154c634`
- Start Here front door (Notion): `381ebcf981cf813bbbcef58c727fcc20`
