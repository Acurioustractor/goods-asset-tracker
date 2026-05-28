# Goods: analytics + GHL + supporter setup (the tight version)

> **Date:** 2026-05-26. The full operating setup for tracking traffic, capturing form leads, notifying the team, and warming supporters. Split into **code (shipped/ready)** vs **what you do** (env + GHL console).

## 1. Analytics (three tools, three jobs)

| Tool | Answers | Status | You do |
|---|---|---|---|
| **Vercel Analytics** | Page views per route (incl. `/canberra`), privacy-light | ✅ live (already wired) | View in Vercel dashboard → Analytics |
| **Google Analytics 4** | Acquisition (where traffic comes from), behaviour, conversions, `/canberra` over time | ✅ code wired (env-gated) | Create GA4 property → set `NEXT_PUBLIC_GA_ID=G-XXXXXXX` in Vercel |
| **Google Search Console** | Organic search: queries, impressions, clicks, indexing | ✅ verification meta wired; sitemap + robots already exist | Add property → set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (or DNS) → submit `/sitemap.xml` |

Tip: in GA4, mark "contact form submit" / "sponsor" as **conversions** to track funnel performance. (Optional later: fire `track()` events from the forms for Vercel custom events too.)

## 2. Contact form → email + pipeline

- **Email:** the contact route now emails every submission to **hi@act.place** (reply-to = the submitter, so you reply straight back). Override with `CONTACT_NOTIFY_EMAIL` if needed.
  - Catch: app-side email only *sends* when `RESEND_API_KEY` is set (verify `goodsoncountry.com` in Resend). If you'd rather not set up Resend, the GHL notification below also emails hi@act.place and needs no key. You can run either or both.
- **Pipeline (GHL):** build a workflow so leads get worked, not lost:
  - Trigger: **Contact Tag Added** = `goods-inquiry` (the contact form's base tag) or `goods-general-inquiry`.
  - Action: **Create Opportunity** in a "Goods Inquiries" pipeline, stage **New**, assign an owner.
  - Stages: New → Contacted → Qualified → Won / Lost. Working the board = nobody gets forgotten.

## 3. GHL notification system (know the moment a form comes through)

One workflow, broad trigger, so every form pings the team:
- Trigger: **Contact Tag Added** matching any of: `goods-inquiry`, `goods-washer-interest`, `goods-feedback`, `goods-media`, `goods-src-*`, partnership tags. (GHL lets you add multiple trigger filters, ORed.)
- Action 1: **Internal Notification → Email** to hi@act.place with the contact name + tag + message.
- Action 2 (optional): SMS / in-app notification for the high-intent ones (washer-interest, partnership).
- GHL sends these itself: no Resend key, no deploy.

## 4. A clean Goods newsletter list

Problem: `goods-newsletter` has **178** contacts, but that's polluted with an imported/historical list + this month's test entries (verified 2026-05-26). It is not "178 website signups."

Fix:
- Build a GHL **Smart List "Goods Website Newsletter"** = contacts with `goods-newsletter` **AND** a `goods-src-*` tag (every website signup carries a `goods-src-{source}`). That isolates genuine website signups (getinvolved, thework, fieldnote, canberra, contact-subscribers) from the import.
- **Clean up the test contacts** first: delete the `@example.test` / `@example.com` / "Test ..." entries so real signups aren't buried. (I can produce the exact delete list; the delete itself is a GHL write you run.)
- Going forward, that Smart List is your real newsletter audience.

## 5. Drip campaigns (the warming engine)

Already written, ready to paste into GHL workflows: `wiki/outputs/2026-05-26-utopia-drip-sequences.md`.
- **Converter track** (6 emails) triggered by `goods-src-getinvolved` / `goods-src-fieldnote-utopia`.
- **Nurture track** (5 emails) triggered by `goods-src-thework`.
- Add a short **welcome series** (3 emails) for the clean newsletter Smart List: who Goods is → how the bed works → first soft ask (sponsor a bed $750).
- Medium-to-market: the public/grassroots nurture should also run as a **WhatsApp broadcast / Facebook group**, not email alone (per Benjamin's note). Same beats, right channel.

## 6. Supporter opportunities (ways in, by intent)

Build a supporter journey, not a single ask:
- **Sponsor a bed ($750)** — the core conversion. "Put a bed in a home, see where it lands." → `/sponsor`.
- **Follow the journey** — low-friction email/WhatsApp signup for the not-ready. Feeds the nurture drip. (The capture blocks already do this.)
- **Monthly giving** — recurring "a bed a month" for committed supporters (Stripe subscription; a build if you want it).
- **Refer-a-funder** — warm supporters introduce foundations/corporates. One-click "know a funder?" ask in the drip.
- **Corporate / RAP** — "build 50 beds with your staff" (QIC NAIDOC precedent) and Reconciliation Action Plan tie-ins. → `/partner`.
- **Events / activations** — the Canberra airport activation is a live top-of-funnel; capture there feeds `goods-src-canberra-airport-2026`.
- **Shareable stories** — the field-notes + `/kit` assets let supporters advocate for you (the multiplier).

Journey: signup (capture) → welcome series → story drip → first ask (sponsor) → recurring / refer / advocate. Each stage has a tag, so GHL routes it.

## What's shipped vs what you provide
- **Shipped in code (this session, pending deploy):** GA4 + Search Console hooks, contact email → hi@act.place. Vercel analytics already live.
- **You provide:** `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` (Vercel env), optional `RESEND_API_KEY`.
- **You build in GHL (recipes above):** notification workflow → hi@act.place, contact→pipeline, Goods Website Newsletter Smart List, the drip workflows.
