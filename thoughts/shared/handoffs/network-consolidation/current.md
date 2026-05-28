---
date: 2026-05-28T11:45:00+10:00
session_name: sponsor-system-improvements-and-production-deploy
branch: main
status: shipped
---

# Goods on Country — Handoff Ledger

## Ledger
**Updated:** 2026-05-28T11:45:00+10:00
**Goal:** Improve the Sponsor-a-Bed system — confirm Stripe tracking, build the sponsor journey, fix the broken/confusing product image, add a newsletter + comms funnel — then ship to production.
**Branch:** `main` (all work merged + deployed; feature branches deleted)
**Test:** `cd v2 && npm run build` clean (exit 0, 231/231 pages). Production verified live.

### Now
[->] Nothing blocking. Sponsor system shipped to prod. Optional: see Next.

### This Session (2026-05-28)

Picked up from the screenshot of the live `/sponsor` page (old two-card layout, product image looked like a washing machine). Found the redesigned flow already existed in code but was undeployed; improved it, fixed the image, added the comms funnel, and shipped everything to production.

**Shipped to production (`www.goodsoncountry.com`), all verified live:**
- **PR #27** merged → prod (`d67cbd8`): the whole accumulated feature branch — sponsor redesign, funder-outcomes pages, Oonchiumpa partner page, admin bulk install logger + photo browser, asset outcome-capture, media-swap tooling.
- **PR #28** merged → prod (`b00b11b`): checkout route now builds an absolute Stripe product-image URL from the relative path.
- **Newsletter / comms funnel** (`7f8fad7`): `/checkout/success` opt-in card (sponsor/buyer-aware, email prefilled from checkout) + `/sponsor` "not ready today?" capture for non-converters. Tags `goods-newsletter` + `goods-src-sponsor`/`-customer`/`-sponsor-interest`, fires GHL Smart Router. Explicit marketing consent, separate from the transactional contact the Stripe webhook already creates.
- **Sponsor page enrichment** (`a85292c`): hero band (Elder beside her bed) + 3-up "this is where your bed lands" gallery (built → assembled → in use). Five distinct real photos now carry the page.

**Product image fix (DB, live immediately — no deploy needed):**
- `products.featured_image` for `stretch-bed-single` was `…IMG_6976.jpg` — a recycled-plastic block at sunset that read as a washing machine. Changed to `/images/product/stretch-bed-hero.jpg` (a clean bed shot). Fixes sponsor page, shop, and the old prod page at once.
- First tried an absolute `https://www.goodsoncountry.com/...` URL → `next/image` blocked it (domain not in `remotePatterns`) → broken image on the preview. Switched to a **relative path** (local `/public` asset, served same-origin, no whitelist needed).

**Stripe tracking — verified already complete (no change needed):**
- Webhook writes `is_sponsorship` / `sponsored_community` / `sponsor_message` to `orders` and creates a GHL `goods-sponsor` contact. `/checkout/success` branches messaging on the order.

**Cleanup:** deleted merged branches `feat/site-media-tooling-and-funder-outcomes` + `fix/stripe-checkout-product-image` (local + remote). Now on `main`.

### Next
- [ ] Eyeball production `/sponsor` end-to-end (hero, gallery, newsletter capture). A real Stripe checkout is needed to see the success-page newsletter card + Stripe thumbnail.
- [ ] Field-notes `/field-notes/utopia-may-2026` still `published: false` (Gate C unmet — carried).
- [ ] Centrecorp one-pager provenance doc still cites stale "$388,432 invoiced / $265,100 outstanding" internally (page itself is dollar-free — carried).

### Decisions (this session)
- **`next/image` blocks remote domains not in `remotePatterns`.** For local `/public` assets, use **relative paths** (served same-origin, no whitelist). When an absolute URL is needed downstream (Stripe needs one), build it at that boundary from the request origin — don't churn the DB or whitelist a same-origin domain.
- Image fix went straight to the DB (Tier-2 write, user-authorised via the image-choice question) — DB-driven, so live without a deploy.
- Shipped the full accumulated PR #27 as one merge (clean fast-forward, 0 behind main); DB migrations it relies on were already applied, so it was a code-only deploy.

### Carried over (still load-bearing)
- COGS per Stretch Bed = $149.20; price unified to $750.
- Communities are first-class DB entities; `community_rollup` view is canonical (extended with household reach + consent).
- Production deploys from `main` → Vercel project `goods-on-country` (`prj_XGQL3gT1C6N7BolooQevgMJuIf1G`, team `team_3aAWFPdRQ92RkkJ2LehJ209u`). Preview URLs are behind Vercel SSO (curl gets 401; open in a logged-in browser).

### Open Questions (carried)
- UNCONFIRMED: 3 paraphrased field-notes voice quotes need real Oonchiumpa attribution before publish.
- UNCONFIRMED: Centrecorp tranche re-attribution (Snow vs Centrecorp for May deployment) — confirm with Nic.

---

## Prior Session (2026-05-27) — uncommitted-work-landing-and-cleanup

Landed 9 days of accumulated uncommitted work into clean atomic commits (later merged via PR #27 above), applied the outstanding `20260519000001_assets_outcome_fields.sql` migration to the live v2 DB (fixed its `CREATE OR REPLACE VIEW` → DROP+CREATE), and cleaned the working tree. Key commits: sponsor redesign (`6e9e93d`), asset outcome capture (`9860b50`), funder outcomes snapshot (`65d781e`), Oonchiumpa partner page (`e49df98`), admin bulk install logger (`80787a5`). Deleted dead `v2/src/app/brand/page.tsx` (redirect lives at `next.config.ts`). Extended `.gitignore` for root scratch screenshots.
