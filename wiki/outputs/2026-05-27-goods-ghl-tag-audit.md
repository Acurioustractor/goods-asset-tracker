# Goods GHL tag audit + clean taxonomy

> **Date:** 2026-05-27. Verified from the code (what the website applies) + GHL (54 `goods`/`act` tags live in the location).
> **The problem:** the `goods-` namespace is shared across forms, imports, campaign scoring, and manual segmentation. Several tags (especially `goods-inquiry`) are **overloaded**, so they don't map cleanly to a single website action. This is why "a heap of people are tagged `goods-inquiry`" who never used the contact form.

## How Nic got `goods-inquiry` + `goods-bulk-order-inquiry`
He chose the **"Bulk Order"** inquiry type. `/api/contact` applies `goods-{subject}` = `goods-bulk-order-inquiry`, and `createInquiryContact` (`ghl/index.ts:1263`) **always** adds `goods-inquiry` as a base tag. So every general contact submission gets `goods-inquiry` + a subject tag.

## Why `goods-inquiry` is not contact-form-specific
`createInquiryContact` is the base for **any** inquiry-type contact. It's called by:
- `/api/contact` (the contact form) → `goods-inquiry` + `goods-{subject}-inquiry`
- `/api/feedback` (the feedback widget) → `goods-inquiry` + `goods-feedback`
- plus historical/manual tagging.

So `goods-inquiry` ≈ "any inquiry-ish contact", **not** "submitted the contact form". Do not build the contact-form pipeline on it.

## The tags the WEBSITE applies, by function (the canonical set)

| Function | Tags applied | Clean trigger for routing? |
|---|---|---|
| **Contact form** (general) | `act-inquiry` + `project-goods` + `goods-{subject}-inquiry` + base `goods-inquiry` | ✅ **`act-inquiry`** (contact-form-only, ACT-wide) |
| Contact form subjects | `goods-general-inquiry`, `goods-bulk-order-inquiry`, `goods-partnership-inquiry`, `goods-media-pack-request` | ✅ subject-specific |
| Contact form (media pack) | `goods-media` (currently NO `act-inquiry` — see fix) | ⚠️ add `act-inquiry` |
| **Washer interest** | `goods-washer-interest` | ✅ clean |
| **Feedback widget** | `goods-feedback` (+ base `goods-inquiry`) | ✅ `goods-feedback` |
| **Support form** | `goods-support-request` | ✅ clean |
| **Newsletter / capture** | `goods-newsletter` (catch-all) + `goods-src-{source}` | ✅ use `goods-src-*`, NOT `goods-newsletter` |
| Newsletter sources seen | `goods-src-contact-form`, `goods-src-footer`, `goods-src-canberra-airport-2026`, `goods-src-naidoc-2026`, `goods-src-parliament-house-demo` | ✅ per-source |
| **Orders / lifecycle** | `goods-customer`, `goods-sponsor`, `goods-recipient`, `goods-bed-owner`, `goods-washer-owner`, `goods-claimed-bed`, `goods-asset-{id}`, `goods-bed-order` | lifecycle, not leads |
| **Partnership form** | segment/tier/timeline tags: `goods-segment-foundation`, `goods-tier-100-500k`, `goods-timeline-this-year`, `goods-partner-lead` | ✅ partnership pipeline |

## NOT from website forms (noise for lead routing — imports, scoring, manual)
- **Gmail import / scoring:** `goods-gmail-active/community/funder/government/media/partner`
- **Campaign engagement scoring:** `goods-tier-aware/engaged/active/champion`, `goods-key-partner`, `goods-hot`, `goods-warm`, `goods-new`, `goods-nurture`, `goods-signal`, `goods-stage-prospect`
- **Events / demos:** `goods-parliament-house-demo`, `goods-parliament-house---chat-request`, `goods-src-parliament-house-demo`, `goods-src-naidoc-2026`
- **Manual segmentation:** `goods` (bare), `goods-funder`, `goods-partner`, `goods-community`, `goods-supporter`, `goods-advisory`, `goods-state-nt`, `goods-role-council`, `goods-communitycontrolled`, `goods-community-gapuwiyak`, `goods-segment-foundation`
- **Smoke/test:** `goods-src-canberra-airport-2026-smoke`, `goods-src-sweep-test`

These carry contacts that never used a form. They're legitimate (CRM segmentation), but if a pipeline triggers on the wrong one you pull in imports + scoring noise.

## Build pipelines on THESE triggers (the fix)

| Pipeline / flow | Trigger on | NOT on |
|---|---|---|
| **Contact form → Universal Inquiry** | **`act-inquiry`** | `goods-inquiry` (overloaded), `goods` |
| Washer interest | `goods-washer-interest` | — |
| Feedback | `goods-feedback` | `goods-inquiry` |
| Partnership leads | partnership segment tags / `goods-partner-lead` | — |
| Newsletter audience (clean) | Smart List on `goods-src-*` | `goods-newsletter` (catch-all, polluted) |

**Revision of earlier advice:** route the contact form on **`act-inquiry`**, not `goods-inquiry`. `act-inquiry` is applied only by the contact form (verified: only `/api/contact` sets it) and is the ACT-wide marker. It went live in the last deploy, so all *future* contact submissions carry it. (Nic's predates the deploy, so handle his one manually.)

## Recommended tidies
1. **Code:** add `act-inquiry` + `project-goods` to the media-pack branch of `/api/contact` too, so EVERY contact submission carries `act-inquiry` (currently only the general branch does). One small edit.
2. **GHL:** keep `goods-inquiry` as a broad "inquiry-ish" label, but trigger routing on `act-inquiry`. Don't delete `goods-inquiry` (it's historical), just stop relying on it for form routing.
3. **Convention going forward:** every website form applies one **clean, action-specific** tag (`act-inquiry`, `goods-washer-interest`, `goods-feedback`, `goods-src-*`). Imports/scoring/manual stay in their own clearly-named tags. Pipelines trigger only on the action-specific tags.
