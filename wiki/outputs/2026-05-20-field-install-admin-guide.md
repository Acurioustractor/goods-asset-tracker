# Field Install Guide — Onboarding Goods Admins for Bed Drops

**Last updated:** 2026-05-20 (for the Alice + Utopia trip, week of 2026-05-19)
**Audience:** Anyone doing bed drops on country.
**Companion doc:** [Field install checklist](/admin/install-checklist) (live page in the app)

---

## What you can do as a Goods admin

When your email is on the admin list, scanning a bed's QR sticker opens an
amber "Log this bed's location" card. You can:

- Pick the community from the dropdown (grouped by Active / Testing / Exploring)
- Type the place (house, family, outstation)
- Tap a button to capture GPS coords (works offline — GPS is satellite hardware)
- Save → writes to the asset register, audit line auto-appended to notes

You can also do this from `/admin/assets` (the master register) without a QR.

---

## Onboarding a new admin (do this BEFORE the trip)

### Step 1: Add their email to ADMIN_EMAILS

The admin list lives in a Vercel env var. To add `mary@example.com`:

1. Go to https://vercel.com → goods-on-country project → Settings → Environment Variables
2. Find `ADMIN_EMAILS` (it's a comma-separated list)
3. Edit, append `,mary@example.com`, save
4. Redeploy is automatic on env var change (takes ~2 mins)

If you don't have Vercel access, ping Ben.

### Step 2: They sign in on their phone

1. On their phone, open `https://www.goodsoncountry.com/admin/login`
2. Enter their email → tap "Send magic link"
3. Open their email on the same phone, tap the magic link
4. They're in. Session lasts ~30 days on that browser.

**Important:** they have to do the magic-link tap on the SAME phone they'll use
in the field. Don't sign in on a laptop and assume it'll work on the phone.

### Step 3: Add to home screen (PWA)

This makes the app feel native and keeps them signed in:

- **iPhone (Safari):** tap the Share button → "Add to Home Screen"
- **Android (Chrome):** tap the ⋮ menu → "Install app" or "Add to Home screen"

The icon goes on their home screen, opens straight into the Goods site without
the browser chrome.

### Step 4: Test they can log a bed

Get them to scan any existing bed's QR (or just open `goodsoncountry.com/bed/GB0-156-1`).
If they see the amber "Log this bed's location" card, they're set. If they see
the normal public page only — their email isn't on the admin list yet, or
they're not logged in.

---

## Pre-trip checklist (the day before driving out)

- [ ] **Phone fully charged** + bring a battery pack. Cold mornings drain battery faster than you'd expect.
- [ ] **Admin login confirmed** on the phone you'll be using (open `/bed/GB0-156-1`, see the amber card)
- [ ] **Vinyl QR stickers printed + cut** (run `python3 scripts/generate_qr_sticker_avery.py --template VINYL45 --cuts grid`, print on Kmart printable vinyl, guillotine)
- [ ] **Stickers labelled in order** so you know which range you've used (e.g. "GB0-156-1 to GB0-156-24 on sheet 1")
- [ ] **Print the batch manifest** (`data/new_beds/batch_156/print_sheet.pdf`) as a paper backup
- [ ] **Offline Google Maps** downloaded for the route + community area (Maps → profile → Offline maps → Select your own map)
- [ ] **Phone's Location Services ON** for both Camera and the browser/PWA
- [ ] **Sharpie** in the truck (sticker fallback)
- [ ] **Paper checklist** (one row per bed: ID / community / place / GPS / photo number / time)

---

## Day-of workflow

### When you have signal (Alice town, anywhere with bars)

1. Stick the QR on the HDPE leg of the bed
2. Scan it → page opens
3. Tap "Log this bed's location"
4. Community + place + GPS + status → Save
5. Take a photo of the bed in place (auto-archived in your phone's Photos)
6. Next bed

~90 seconds per bed.

### When you DON'T have signal (Utopia Homelands, most outstations)

**Critical pre-step:** before driving out of signal, open every `/bed/{ID}` page
you'll need that day. The pages stay loaded in browser tabs, which means the
form will render offline.

> Quick way: from your phone, open `data/new_beds/batch_156/manifest.csv`
> (email it to yourself or load via Dropbox), tap each `qr_url`. Or scan each
> sticker while still in Alice service area.

Then in the field:

1. **Stick the QR sticker** on the bed leg
2. **Open the bed's tab** (already loaded from earlier)
3. **Tap "Log this bed's location"**
4. **Fill in community, place, status**
5. **Tap "📍 Use my GPS"** — this works offline (GPS is satellite, not internet)
6. **Tap Save** → you'll see an orange banner:
   > **Saved offline.** No signal here — this drop will sync automatically
   > when you're back online. Safe to keep going to the next bed.
7. **Take a photo** of the bed in place (Location Services ON = GPS embedded as EXIF backup)
8. **Next bed**

**The orange "N drops queued offline" banner** stays visible at the top of any
bed page until everything syncs. When you drive back into service, it auto-syncs
within seconds. You can also tap "Sync now" once you have signal to force it.

**No paper backup needed** — the localStorage queue holds dozens of drops.
But still keep the paper checklist for your own sanity + cross-check.

### Recovery if a queued drop won't sync

If the orange banner is stuck and you're definitely on wifi:

1. Open `/bed/{any-ID}` — the queue tries to drain on every bed page load
2. Tap "Sync now" — manual retry
3. If a specific bed's drop has a server-side error (rare), it stays queued. Open `/admin/assets` and manually edit the bed there.

---

## What if a sticker peels / gets lost / wrong bed

- **Sticker peels off mid-trip:** Sharpie the unique_id on the leg as backup, restick a fresh one later. Asset register doesn't care about the physical sticker — it's just a pointer to the row.
- **You stuck the wrong sticker on a bed:** at base, open `/admin/assets`, find the bed in the register and swap the metadata. Or PATCH each via `/bed/{ID}` again with corrected info.
- **You forgot to log a drop:** open `/bed/{ID}` when back at base, fill it in. The notes field auto-appends with `[date] installed by {email}` so you have an audit trail.

---

## Support numbers

- **Goods field support:** +61 468 052 660 (WhatsApp / SMS — works on low-signal)
- **Ben (tech issues):** ben@benjamink.com.au
- **Site:** https://www.goodsoncountry.com

---

## For Ben: what changed 2026-05-20

Added offline queue to `v2/src/app/bed/[id]/install-logger.tsx`:

- Save attempts that fail with a network error queue to `localStorage`
  under `goods.install.queue.{uniqueId}`
- Queue auto-drains on any future bed page load + on browser `online` event
- UI shows "N drops queued offline" banner with manual "Sync now" button
- Per-bed: orange "Saved offline" confirmation appears when queued

Edge case: if the bed page itself never loads offline (no service worker yet),
the form can't be rendered. Workflow: pre-load pages while in service area,
keep tabs open, fill offline.
