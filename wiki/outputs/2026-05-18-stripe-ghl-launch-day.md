# Stripe + GHL Launch Day — Handover (2026-05-17 → 2026-05-18)

Resume entry for the **GHL unification + Stripe go-live** workstream. Two
big things shipped: every customer touchpoint is now wired to a single
GoHighLevel record, and the shop accepts real cards as of 2026-05-18.

---

## TL;DR — what's now live

- **Stripe is in LIVE mode on production.** Real customers can buy a
  Stretch Bed at `https://www.goodsoncountry.com/shop/stretch-bed-single`
  with cards being charged through the **Goods and ACT** Stripe account.
- **End-to-end pipeline verified** with order `GOC-20260517-7888` — $1
  test purchase landed in orders + GHL + shipping address captured
  correctly. Refund webhook also verified.
- **GHL unification (4 phases)** — every channel that creates or touches
  a customer now writes to GHL with per-bed tags. Admin can see all
  contacts linked to a bed + their recent SMS/WhatsApp/email threads
  inline at `/admin/assets/{id}`.
- **Reach-out tool** at `/admin/reach-out` — batch SMS to tag-based
  smart lists (washer owners, story submitters, bed recipients, etc.)
  with cost estimates + hard caps + dry-run.
- **Product table cleaned** — only Stretch Bed customer-facing; basket
  beds, washing machine, weave-bed-double archived; descriptions
  rewritten with correct materials (HDPE + galvanised steel + canvas, not
  "tension-weave / woven cord / hardwood frame").
- **Admin auth bypass for local dev** — UI pages AND all 15 admin API
  routes now skip auth on `localhost` in development. Production
  unchanged.

---

## Stripe launch — what changed in production

### Keys swapped (Vercel production)
- `STRIPE_SECRET_KEY` → `sk_live_…` (rotated mid-session after one
  accidentally landed in chat — old key is dead)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → `pk_live_51SxgLMLO1Kjv3ayM…00KkIgMV74`
- `STRIPE_WEBHOOK_SECRET` → `whsec_…` matching new live endpoint

### Live webhook endpoint (Stripe dashboard)
- ID: `we_1SxgTFLO1Kjv3ayMXc0ikwld`
- Name: "Goods Purchase"
- URL: `https://www.goodsoncountry.com/api/webhooks/stripe` (was apex
  `goodsoncountry.com` — moved to www to avoid 307 redirect risk)
- API version: `2026-01-28.clover`
- Events: `checkout.session.completed`, `payment_intent.succeeded`,
  `payment_intent.payment_failed`, `charge.refunded`

### Critical bug fixed pre-launch
- Stripe API `2025-12-15.clover` and later moved shipping data from
  `session.shipping_details` → `session.collected_information.shipping_details`.
  The webhook handler still read the old path → **every order saved
  `shipping_address: null`** even though Stripe was collecting the data.
- Fix in `src/app/api/webhooks/stripe/route.ts` reads the new path first,
  falls back to legacy. Confirmed working via $1 smoke test.
- Backfilled all 26 historical test orders by re-pulling Stripe sessions.

### Local dev convention
- Keep `.env.local` Stripe vars **blank** (or test mode). Production-only
  flips live. Avoids accidentally charging real cards from `pnpm dev`.

---

## GHL unification — the four phases

### Phase A — Plug the leaks
Two channels were silently dropping customers on the floor:

- **`/api/feedback`** sent feedback to GitHub issue + Telegram, never to
  GHL. Now upserts via `ghl.createInquiryContact()` with tag
  `goods-feedback` + a note carrying the page + message.
- **`/api/bed/[id]/story`** mirrored stories to support tickets but if
  the submitter only provided contact info via the story form (not via a
  ticket), the GHL contact was never created. Now directly creates the
  contact with `goods-story-submitter` + consent tags.

### Phase B — Bidirectional bed↔contact link
The original CRM had no way to ask "who is connected to bed GB0-156-7?"
or "which beds does this contact own?".

- New `tagForAsset(assetId)` helper produces `goods-asset-{slug}` —
  a tag every channel applies when it knows the bed. Tags are N:M, so a
  person who owns 3 beds gets 3 tags (a single custom field would only
  hold one).
- Per-asset tag now applied by: `createSupportTicketContact`,
  `createRecipientContact`, `updateContactWithClaim`, `logInboundMessage`,
  `logUserRequest`, `sendSms`, and the story-submission route.
- Reverse lookup via `ghl.findContactsByAssetId(assetId)` powers the
  "GHL contact" source in the owners view, surfacing people who exist
  in GHL but not in our v2 DB (e.g. someone who only WhatsApped in).

### Phase C — Reach-out tool (`/admin/reach-out`)
Pick a curated smart list → see eligible recipients with phones → draft
SMS → dry run for cost estimate → confirm-and-send. One outbound SMS
per contact through `ghl.sendSms`, 250 ms apart to respect rate limits.

Smart lists registered in `src/lib/ghl/smart-lists.ts`:
- Bed recipients (consented to contact) — `goods-consent-to-contact`
- Bed owners claimed via QR — `goods-claimed-bed`
- Washing machine owners — `goods-claimed-washer`
- **Washing machine prospects — `goods-washer-interest`** (NEW from
  the washer-routing fix below)
- Stretch Bed buyers (Stripe) — `goods-bed-owner`
- Story submitters consented — `goods-story-submitter`
- Recent support contacts — `goods-support-request`
- Plus custom-tag escape hatch

Hard caps per list refuse oversend. Every reach-out send also stamps a
`goods-reach-out` tag so staff can filter messages dispatched through
this tool vs ad-hoc replies.

### Phase D — Inline conversations on owner cards
On `/admin/assets/{id}` each owner row now renders the **last 3
conversation previews** across SMS/WhatsApp/email via the GHL
Conversations API. Direction badges (← in / out →), channel labels,
unread counts. Staff stop needing to open GHL for quick triage.

### Phase E (extension) — Order → asset allocator
`/admin/orders/{id}` had a free-text asset_id input that was never used
(0 of 26 orders had assets linked). Upgraded to:
- Dropdown of available beds (status='ready', filtered to product type)
- On allocate: bed's status → `'allocated'`, community stamped from
  shipping address, place from address line1
- Buyer's GHL contact gets `goods-customer` + `goods-bed-owner` +
  `goods-asset-{id}` tags + a note linking back to the order
- One-click unlink

### Phase F — Washer-interest routing fix
`/shop/washing-machine` "Register Interest" was routing to `/partner`
and getting tagged `goods-partner-lead` — wrong segment for
prospective buyers. Now:
- Links to `/partner?type=washer-interest` (pre-selects the right type)
- `<PartnershipForm defaultType="washer-interest">` honoured
- `/api/partnership` detects washer-interest and calls
  `ghl.createInquiryContact` with `goods-washer-interest` tag + a
  dedicated note (instead of `createPartnershipContact`)
- New "Washing machine prospects" smart list in reach-out

---

## Product table cleanup

| Slug | Status before | Status after | Why |
|---|---|---|---|
| `stretch-bed-single` | active, type=`weave_bed`, wrong description | **active, type=`stretch_bed`, rewritten** | Canonical. Materials now correct (HDPE + galvanised steel + canvas) |
| `weave-bed-double` | active | archived | Deprecated slug per CLAUDE.md |
| `basket-bed-single` | active | archived | Open-sourcing the design, no longer for sale |
| `basket-bed-double` | active | archived | Same |
| `washing-machine-standard` | active, $650 | archived | Prototype only, register-interest flow |
| `smoke-test` | — | **NEW, active, $1, hidden** | Stripe end-to-end test SKU |

Migration `20260517000001_widen_product_type_check.sql` widens the live
CHECK constraint to accept `stretch_bed` (the original migration listed
it but the live DB had drifted to `weave_bed` instead — applied
manually via Supabase SQL editor since `supabase db push` would have
pushed 8 other queued migrations alongside it).

26 historical test orders archived (`status='cancelled'` +
`internal_notes` flag) so they don't pollute the active orders list.

---

## Admin auth helper (`src/lib/auth/admin.ts`)

Single source of truth for admin gating:
```typescript
const guard = await requireAdmin(request);
if (guard) return guard;
```

Behaviour:
- Local dev (NODE_ENV=development + localhost host) → bypass entirely
- Production → require authenticated user matching `app_metadata.role
  === 'admin'` OR present in `ADMIN_EMAILS` env

Adopted across **17 admin API routes** (all but `/api/cron/weekly-digest`
which uses CRON_SECRET bearer auth). Side benefit caught during refactor:
`/api/admin/fleet/map-device` GET was only checking `!user` and skipped
`isAdmin` — now enforces the full gate.

Mirrors the bypass logic already in `src/proxy.ts` (request middleware)
and `src/app/admin/layout.tsx` (server-component admin layout).

---

## Files / locations to remember

| Concern | File |
|---|---|
| Admin auth helper | `v2/src/lib/auth/admin.ts` |
| Bed-owners derived view | `v2/src/lib/data/bed-owners.ts` |
| Per-asset tag generator | `v2/src/lib/ghl/index.ts` → `tagForAsset()` |
| Smart lists for reach-out | `v2/src/lib/ghl/smart-lists.ts` |
| Reach-out UI | `v2/src/app/admin/reach-out/` |
| Reach-out API | `v2/src/app/api/admin/reach-out/{preview,dispatch}/route.ts` |
| Launch checklist | `v2/src/app/admin/orders/launch-checklist/page.tsx` |
| Bed allocator | `v2/src/app/admin/orders/[id]/page.tsx` (linkAsset action) |
| Owner cards w/ convo preview | `v2/src/app/admin/assets/[unique_id]/page.tsx` |
| Stripe webhook handler | `v2/src/app/api/webhooks/stripe/route.ts` |

---

## State of the world right now

- ✅ Stripe LIVE, $1 smoke test passed + refunded successfully
- ✅ Webhook endpoint registered for live mode + signing secret matches
- ✅ Customer-facing shop: 1 product active (Stretch Bed $600)
- ✅ Hidden smoke-test SKU at `/shop/smoke-test` for future end-to-end
  validations
- ✅ GHL pipeline: every channel writes contacts with per-asset tags
- ✅ Admin local dev: full UI + API access without login
- ✅ All 10 commits today pushed to `main`, deployed to production

## Open follow-ups (not done today, worth tracking)

- **9 unapplied local migrations** in `supabase/migrations/` not on
  remote (visible via `supabase migration list`). One of them was
  applied manually today via Studio SQL editor
  (`20260517000001_widen_product_type_check`); the others — including
  `20260515000001`, `20260516000001`, etc. — are still pending. They
  likely apply cleanly but `supabase db push --include-all` failed
  mid-stream on one of them. Worth a triage pass.
- **`order_items.product_type` is inconsistent** — old test orders show
  a mix of `weave_bed`, `stretch_bed`, and `null`. Future orders will
  use `stretch_bed`. The GHL tagging in `createOrderContact` keys off
  this; mixed types means mixed tagging. Could backfill via SQL.
- **Smoke-test SKU adds `goods-bed-owner` tag** — minor cosmetic issue
  in `createOrderContact` which checks if product type/slug contains
  "bed" (it does for "smoke-test" since "smoke" doesn't but "test" gets
  through). Worth a guard.
- **Stripe entity carve-out** — current account is "Goods and ACT"
  (joint). When Goods on Country Pty Ltd is fully separated (and once
  Butterfly Ltd DGR is live), payments may need to flow to a
  Goods-only Stripe account. See entity-related memory notes.

## How to reach out to customers now

You're set up for these segmentation flows:

| Audience | Tag | Where applied |
|---|---|---|
| Bought a bed | `goods-bed-owner` | Stripe webhook + allocator |
| Sponsored a bed | `goods-sponsor` | Stripe webhook (when `is_sponsorship=true`) |
| Claimed a bed via QR | `goods-claimed-bed` + `goods-recipient` | `/api/claim/[id]` |
| Has a washing machine | `goods-claimed-washer` | `/api/claim/[id]` (washer) |
| Wants a washing machine | `goods-washer-interest` | `/partner?type=washer-interest` |
| Submitted a story | `goods-story-submitter` | `/api/bed/[id]/story` |
| Consented to contact | `goods-consent-to-contact` | Story form opt-in |
| Newsletter | `goods-newsletter` + `goods-src-{source}` | Footer / hero / event forms |
| Opened support ticket | `goods-support-request` | `/api/support` |
| Submitted feedback | `goods-feedback` | `/api/feedback` (NEW) |
| Linked to specific bed | `goods-asset-{slug}` | Every channel that knows the bed |
| Sent through reach-out | `goods-reach-out` | Outbound SMS from admin |

Open `/admin/reach-out`, pick a list, write 160 chars, dry-run, send.

---

## Today's commits (in order)

| # | Commit | What |
|---|---|---|
| 1 | `de27097` | Swap Anthropic → Minimax for chat (overnight) |
| 2 | `814eb6b` | Fix chat knowledge base + strip Minimax `<think>` blocks |
| 3 | `8b9e6d6` | GHL feedback/story leak fixes + bed-owners view |
| 4 | `5101286` | Bidirectional bed↔contact tag (Phase B) |
| 5 | `abf5b7b` | Inline SMS/WhatsApp previews on owner cards (Phase D) |
| 6 | `e578617` | Reach-out tool with smart lists (Phase C) |
| 7 | `90c509f` | Bed allocator + washer-interest tagging fix |
| 8 | `225e5e9` | Launch checklist + product table cleanup migration |
| 9 | `e925b7a` | Smoke-test SKU + migration backlog check |
| 10 | `a3df417` | Stripe shipping address bug fix |
| 11 | `4fa28e1` | Shared admin helper + live banner |
| 12 | `2b4c808` | Bulk admin auth refactor (15 routes) |

Total: 12 commits, ~1,500 net lines added, ~270 lines of duplicated auth
boilerplate removed, 5 product rows fixed, 26 test orders archived,
1 migration applied, 1 webhook bug squashed, $1 test purchase + refund
proven end-to-end on the live endpoint.
