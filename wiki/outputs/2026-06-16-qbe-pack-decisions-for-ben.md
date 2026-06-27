# QBE pack: decisions only Ben (and Nic / accountant / legal) can close

**Date:** 2026-06-16 · **Context:** everything buildable in the pack is now done, current, and durable. These are the calls a document cannot make. Source: the 2026-06-16 pack build + truth pass.

---

## 1. Canonical washing-machine price (a live drift to resolve)

Two framings coexist in the codebase. The 16-count is now settled and live; the **price** is not.

| Framing | Current unit cost | Target (resident-accessible) | Lives where |
|---|---|---|---|
| **A** | ~AU$4,300 | AU$2,000–2,500 | `v2/.wiki-content/products/washing-machine.md` (committed; PR #118 set this "across all surfaces") |
| **B** | AU$4,500–5,000 | AU$1,000–2,000 | The **live** Snow partner dashboard, **and** an *uncommitted* edit sitting in `washing-machine.md` right now |

**The decision:** pick A or B. I'll then unify every surface (washing-machine.md, the Snow dashboard, pitch pages, cost copy) to the one you choose. Today they disagree, so a funder reading two of our surfaces sees two prices.

**Side flag (not a washer issue):** `/pitch/document` shows product tiers **$600 / $850 / $1,200** next to the Stretch Bed section. These are bed/product tiers, not washers — but the canonical Stretch Bed price is **$750**, so confirm whether those three tiers are current or stale.

---

## 2. The five real-world proofs (each gates the QBE match; none is a writing task)

These are the live "five proofs" on `/sites/qbe-readiness`. The documents behind each now exist as drafts; what's missing is the real-world action.

| # | Proof | The action only you can take | Owner |
|---|---|---|---|
| 1 | The money is real | One **signed** LOI/offtake + the accountant signs **one** Goods-only figure (recommended ~AU$907,569, pending the TFN void+rebook + bank dedup) | Ben · Nic · accountant |
| 2 | The legal vehicle is decided | One **approved** entity-wording block (the keystone — gates Supply Nation 51% by **1 July**, IBA, and 4 of 8 procurement channels) | Ben · Nic · Keith Rovers |
| 3 | The cost-down is measured | The **50-bed in-source run** (~AU$60–80K) that turns the AU$421/$426 in-house bed cost from modelled to measured. Today: 0 beds built in-house | Nic |
| 4 | Impact + consent hold up | A measurement-method one-pager + a **consent-cleared story list** | Ben |
| 5 | Governance + people look fundable | Advisory committee → **independent-majority board** (gates SEFA debt) + a 12-month role map naming the GM and BD hires | Ben · Nic |

---

## 3. Smaller open items surfaced this session (your call, low urgency)

- **Consent-cleared story names disagree.** `/sites/qbe-readiness` proof 4 names "Ivy Johnson, Dianne Stokes, Ray Nelson"; the Artifact Hub cleared-voice roster names "Linda Turner, Alfred Johnson, Norman Frank, Mykel, Fred." One list is stale. (Consent data — I won't change names without your confirmation.)
- **`outreach-targets.ts:269`** reads "109 beds sold. 107-bed Utopia pathway active." — is that a deliberate *sold vs delivered* distinction, or should it be 107? (I left it; everything funder-facing is now 107.)
- **The held QBE reconciliation (PR #124)** and the ~AU$907,569 figure await the accountant signing ONE number before anything external quotes it.
- **GHL files `19`/`20` + the pack binaries** (pptx/docx/pdf/xlsx) were held out of the commit (real funder emails / large binaries). Commit a scrubbed version, or leave them local?

---

## What's already done (no action needed)

16 washers **live on prod**; Centrecorp 109→107 **merged to main** (deploying); Artifact Hub spine + per-area evidence + Opportunity Hub Flag A **refreshed in Notion**; the 28-file strategic pack **committed**; `/sites/qbe-readiness` **refreshed** ($271→$421 fixed).
