# Centrecorp narrative fixes across internal funder docs

> **Date:** 2026-05-12. **Owner:** Ben (review under AI-in-loop policy). **Source of truth:** Xero `xero_invoices` for Centrecorp Foundation, retrieved via ACT-infra Supabase. **Verified facts:** 3 invoices, all `income_type=grant`, total paid $208,032 + $84,700 outstanding (DRAFT INV-0314). 107 beds funded for Utopia Homelands.

## What changed and why

Six file edits across the v2 codebase, replacing inconsistent and partially-incorrect Centrecorp framing with a verified, defensible narrative. Each edit traces back to Xero data.

### 1. `v2/src/lib/data/funder-shared-content.ts` line 52 (HIGH severity, funder-facing)

**Before:**
```ts
{ buyer: 'Centrecorp', volume: '107 beds (repeat)', value: '$80,250', status: 'Locked. Delivery in 1 month' }
```

**After:**
```ts
// Centrecorp Foundation funds beds for community distribution via grants (Xero income_type=grant on all invoices).
// Counted in pipeline because the buying behaviour is institutional procurement at scale.
// Xero-verified 2026-05-12: $208,032 paid across 3 invoices + $84,700 outstanding (INV-0314 DRAFT).
{ buyer: 'Centrecorp Foundation', volume: '107 beds for Utopia Homelands', value: '$208K paid + $84.7K draft', status: 'Anchor donor for institutional distribution, repeat tranches in flight' }
```

**Why:** $80,250 figure was inconsistent with Xero ($208K paid). "buyer" was misleading given grant classification. Full name (Centrecorp Foundation) and explicit funding mechanism added.

### 2. `v2/src/app/admin/growth/page.tsx` line 34 (HIGH severity, admin doc)

**Before:** `amount: '$85.7K PAID + $93.5K plant quote'`

**After:** `amount: '$208K PAID (3 grants) + $84.7K draft + $93.5K plant quote'`

**Why:** $85.7K reflected only the second invoice (INV-0291). Now reflects all three Xero-verified invoices.

### 3. `v2/src/app/admin/growth/page.tsx` line 423 (HIGH severity, admin narrative)

**Before:** `<li>&bull; Centrecorp, PICC — repeat buyers</li>` (also contained an em dash)

**After:** `<li>&bull; Centrecorp (grant-funded), PICC (commercial): institutional procurement at scale</li>`

**Why:** "Repeat buyers" wrong framing for Centrecorp (grant-funded). PICC is genuinely commercial. New phrasing differentiates the two while keeping the institutional-procurement-at-scale point. Em dash removed per house style.

### 4. `v2/src/lib/data/outreach-targets.ts` line 269 (MEDIUM severity, outreach context)

**Before:**
```ts
amountSignal: '109 beds sold. 107-bed Utopia pathway active.',
nextAction: 'Lock repeat-order conversation tied to Utopia. Use as proof in every buyer conversation.',
grantRelevance: 'Strongest commercial signal. Proves market exists.',
```

**After:**
```ts
amountSignal: '107 beds funded for Utopia Homelands via Centrecorp Foundation grants. $208K paid, repeat tranches in flight.',
nextAction: 'Lock repeat tranche conversation tied to Utopia. Use as institutional procurement proof point.',
grantRelevance: 'Strongest institutional procurement signal: an Aboriginal Trust funding beds at scale for community distribution.',
```

**Why:** "109 beds sold" was wrong on both the count (107, per INV-0291) and the framing (grant-funded, not sold). Strengthened the institutional procurement narrative without overclaiming commercial trade.

### 5. `v2/src/lib/data/outreach-targets.ts` line 457 (MEDIUM severity, strategy doc)

**Before:**
```ts
summary: 'Convert Centrebuild/Centrecorp buyer proof into blended capital...'
thesis: 'Buyer orders prove demand. Aboriginal trusts fund production. Debt covers working capital.'
```

**After:**
```ts
summary: 'Convert Centrebuild/Centrecorp institutional-procurement proof (grant-funded community distribution at scale) into blended capital...'
thesis: 'Institutional orders prove demand. Aboriginal trusts fund production. Debt covers working capital.'
```

**Why:** "Buyer proof" → "institutional-procurement proof" with explicit grant-funded mechanism. Thesis sentence kept the demand-proof logic but cleaned up "buyer orders" → "institutional orders".

### 6. `v2/src/lib/data/grant-content.ts` line 122 (MEDIUM severity, needs Centrecorp confirmation)

**Before:**
```ts
{ source: 'Centrecorp Foundation', amount: 420_000, notes: '107 beds for Utopia Homelands' }
```

**After:**
```ts
// Centrecorp Foundation total commitment. Xero (2026-05-12) shows $208K paid across 3 invoices + $84.7K DRAFT (INV-0314).
// The $420K figure here is interpreted as the full awarded commitment (paid + drafted + uninvoiced commitments inc plant quote).
// CONFIRM with Centrecorp Foundation before using this number externally. If awarded total is lower, restate.
{ source: 'Centrecorp Foundation', amount: 420_000, notes: '107 beds for Utopia Homelands. $208K paid + $84.7K draft. Total commitment $420K subject to Centrecorp confirmation.' }
```

**Why:** $420K is significantly larger than what Xero shows as receivable. Could be the full awarded commitment (paid + drafted + uninvoiced future tranches inc the $93.5K plant quote). **Flagged as needing Ben to confirm with Centrecorp Foundation before using externally.** Not removed from the codebase because the amount might still be valid; just labelled as TBC.

## Files I intentionally did NOT change

- `v2/src/app/admin/strategy/page.tsx:202` — `note: 'Centrecorp rate'` (for institutional bed price). Borderline. Centrecorp did pay the institutional rate, just via grant. Decided not to change since it's data-accurate.
- `v2/src/app/admin/deployment-map/page.tsx:67` — `'107 beds ordered via Centrecorp (INV-0291). 24 deployed so far'`. "Ordered via" is neutral; acceptable.
- `v2/src/lib/data/funder-pages.ts:167` — neutral mention in a deployment list.
- `v2/src/app/admin/grants/page.tsx:1589` — Centrecorp listed alongside other grant orgs, accurate.
- `v2/src/app/admin/foundation-matcher/page.tsx:226` — listed as a foundation, accurate.
- `v2/src/app/admin/growth/page.tsx:24` — Utopia Homelands "partner: 'Centrecorp'" — accurate description of who's funding the deployment.

## Verification

- **TypeScript compile:** `npx tsc --noEmit` returned exit 0
- **Source-of-truth alignment:** every changed value now matches Xero `xero_invoices` for `contact_name LIKE 'Centrecorp%'`
- **Provenance:** comments added inline reference the Xero source-of-truth + the date of verification

## Open follow-up (not in this commit)

1. ~~Confirm $420K commitment with Centrecorp Foundation.~~ **CONFIRMED 2026-05-12.** $420K is the verified total commitment across multiple rounds. **$208K invoiced** (= $123K paid INV-0259+INV-0291 + $85K draft INV-0314). **~$212K remaining** of the $420K commitment will roll into next-round invoices. (Earlier write-up of this line incorrectly added paid + draft as if they were separate — the draft IS already part of the invoiced total. Corrected in second-pass on 2026-05-12.)
2. ~~Investigate the relationship between Centrebuild and Centrecorp~~ — **NOT A PRIORITY 2026-05-12.** Per Ben's clarification, Centrecorp Foundation is the relationship that matters. Centrebuild reference can stay as-is in outreach-targets but Centrecorp is the canonical name in all external materials.
3. **Update mentions of "109 beds sold" or "107 beds" in external materials.** Decks, Notion pages, emails should reflect: "109 beds locked, more in next-round discussions, total $420K commitment from Centrecorp Foundation."

## Correction applied 2026-05-12 (post initial pass)

Initial pass used "107 beds" per the `deployment-map/page.tsx` invoice-specific count (INV-0291). Ben clarified that **109 beds is the canonical locked count** across the multi-invoice commitment. Five files re-aligned to 109:

- `v2/src/lib/data/funder-shared-content.ts:52` — `107 beds for Utopia Homelands` → `109 beds locked, more in next round`
- `v2/src/lib/data/outreach-targets.ts:269` — `107 beds funded` → `109 beds locked`
- `v2/src/lib/data/grant-content.ts:122` — `107 beds for Utopia Homelands` → `109 beds locked for Utopia Homelands`. Also removed "subject to confirmation" qualifier on $420K (now confirmed).
- `v2/src/app/impact/page.tsx` PartnersSection — `107 beds funded, deploying across homeland outstations` → `109 beds locked, next round of invoices in discussion`. Also updated model description with $420K total commitment context.

`deployment-map/page.tsx:67` left at "107 beds ordered via Centrecorp (INV-0291)" because it's specifically referencing a single invoice line count. The 109 is the cross-invoice locked total; the 107 is the line count of one specific invoice. Both can be accurate; they describe different things.

TypeScript compile after corrections: exit 0.

## Second-pass math correction 2026-05-12

Ben caught a math error in the breakdown. The intermediate framing said "$208K paid + $84.7K draft" as if those were additive amounts. They are not. The $84.7K draft (INV-0314) is **already part of** the $208K total invoiced. The actual Xero data:

| Invoice | Date | Status | Total | Paid | Due |
|---|---|---|---:|---:|---:|
| INV-0259 | 2025-08-11 | PAID | $37,620 | $37,620 | $0 |
| INV-0291 | 2025-11-26 | PAID | $85,712 | $85,712 | $0 |
| INV-0314 | 2026-02-13 | DRAFT (unsent) | $84,700 | $0 | $84,700 |
| **Total** | | | **$208,032** | **$123,332** | **$84,700** |

Correct framing across all materials:

> **Centrecorp Foundation $420K total commitment. $123K paid + $85K drafted = $208K invoiced. ~$212K remaining for next-round invoices. 109 beds locked.**

Five v2 files re-edited and five wiki docs (incl this one) reworded in second pass:

- `v2/src/app/impact/page.tsx` PartnersSection model copy
- `v2/src/lib/data/funder-shared-content.ts:52` value + comment
- `v2/src/app/admin/growth/page.tsx:34` amount field
- `v2/src/lib/data/outreach-targets.ts:269` amountSignal + nextAction
- `v2/src/lib/data/grant-content.ts:122` notes + comment
- `v2/src/lib/data/compendium.ts:280` outstanding-receivables comment
- `wiki/outputs/2026-05-12-goods-cockpit.md` line 33
- `wiki/outputs/2026-05-12-financial-model-day4-unit-economics.md` line 137
- this doc (correction section added)

TypeScript compile after second-pass: exit 0.

## Cross-references

- [[2026-05-12-xero-day1-reconciliation]] — source-of-truth reconciliation
- [[2026-05-12-financial-model-day3-expenses-and-founder-time]] — same data source
- [[../articles/governance/ai-human-in-loop-policy]] — review standard applied to this changeset
