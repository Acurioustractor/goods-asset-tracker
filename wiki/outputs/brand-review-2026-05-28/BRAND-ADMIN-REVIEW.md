# Goods on Country brand, photo, and admin review

Date: 2026-05-28  
Scope: `v2/` only. Legacy `deploy/` was not reviewed or modified.

## What was verified

- Local app reviewed at `http://localhost:3004`.
- Public route crawl found most routes render, with two failures before fixes: `/admin/install-checklist` and `/storytellers`.
- Browser review covered the home page, Stretch Bed shop page, process page, washing machine page, story page, gallery, and major admin screens.
- Photo contact sheets were generated from the current public image library:
  - `contact-sheet-media-pack.jpg`
  - `contact-sheet-product.jpg`
  - `contact-sheet-process.jpg`
  - `contact-sheet-people.jpg`
  - `contact-sheet-partners.jpg`
- Reference screenshots were captured:
  - `brand-review-home-desktop.png`
  - `brand-review-stretch-bed-desktop.png`
  - `brand-review-process-desktop.png`
  - `brand-review-washing-machine-desktop.png`
  - `brand-review-admin-dashboard.png`

## Brand direction

The strongest next phase is a product-led evidence site:

1. Lead with the Stretch Bed as the flagship product and proof that the model works.
2. Treat Pakkimjalki Kari washing machines as a prototype/register-interest pathway, not a second ecommerce product.
3. Keep the Basket Bed as archived/open-source design history.
4. Remove public "weave" and refrigerator language unless it is clearly framed as archive/future capability.
5. Make community ownership, repairability, and on-country manufacturing the differentiator. Avoid charity framing.

The current site already has strong ingredients: the Stretch Bed page, process page, live asset counts, field photography, and admin evidence trail. The main issue is that too many public routes tell overlapping versions of the story, with some old ACT/product roadmap language still leaking through.

## Public pages

### Keep as primary public experience

- `/` - strong hero and clear product signal. Needs fewer internal/admin swap controls outside local dev.
- `/shop/stretch-bed-single` - currently the best product page. This should be the canonical buy page unless `/stretch-bed` is consolidated into it.
- `/process` - strong, distinctive, and aligned with the manufacturing story.
- `/shop/washing-machine` - good as prototype/register-interest. Keep it secondary to Stretch Bed.
- `/about`, `/contact`, `/privacy`, `/terms` - baseline public utility pages.

### Consolidate or simplify

- `/stretch-bed` and `/shop/stretch-bed-single` overlap. Pick one canonical public URL and redirect the other.
- `/story`, `/stories`, `/storytellers`, `/field-notes`, `/gallery`, and `/media` are too many "proof/story/photo" surfaces. Collapse into one curated public "Stories" or "From Country" experience, with raw exploration kept in admin.
- `/community` and `/communities` can be confusing: one is protected, one appears public. Rename or hide the protected one from public footer/navigation.
- `/partner`, `/sponsor`, `/support`, `/get-involved`, and `/impact` should be tightened into one clear funder/support pathway unless they serve distinct audiences.

### Gate, noindex, or archive

- `/portal` is open and contains placeholder phone data. It should not be public in this state.
- `/design`, `/pitch`, `/canberra`, and `/test-gallery` need an explicit public/private decision.
- `/insiders`, `/impact`, `/funders/*`, `/my-items`, and `/production` are correctly gated.

### Broken or risky

- `/admin/install-checklist` was broken by a server component passing an `onClick` handler. Fixed in this review.
- `/storytellers` still fails because `next/image` receives avatars from `uaxhjzqrdotoahjnxmbj.supabase.co`, which is not configured in `next.config.ts`. More importantly, that looks like cross-project Empathy Ledger media leakage, so filtering source data is better than just adding the host.
- `/gallery` renders but logs image errors because it falls back to `/images/people/placeholder.jpg`, which does not exist.
- `/story` and `/gallery` load Descript embeds that trigger CSP/media/tracking errors. Replace these with local video assets or static video cards before treating them as polished public pages.

## Copy and data consistency

Verified stale or inconsistent public-facing language:

- `v2/src/lib/data/content.ts` still mentions refrigerators in mission/product roadmap language.
- `v2/src/lib/data/media.ts` still has a process key/file named `weave`.
- `v2/src/app/gallery/page.tsx` labels a process item as "Weaving canvas".
- Some surfaces use `400+` beds, others use `520+`, and funder/shared copy references `600+`.
- Some surfaces still show `hi@act.place` rather than a Goods-specific contact.

Recommended rule: public pages use one stable rounded public number, admin uses live operational counts. For now, the site should say "520+ beds" publicly unless the team deliberately changes the canonical number.

## Photo review

### Strong public assets

- `v2/public/images/media-pack/lying-on-stretch-bed.jpg`
- `v2/public/images/media-pack/stretch-bed-in-use.jpg`
- `v2/public/images/media-pack/community-bed-assembly.jpg`
- `v2/public/images/media-pack/stretch-bed-assembly.jpg`
- `v2/public/images/media-pack/thumbs-up-stretch-bed.jpg`
- `v2/public/images/media-pack/stretch-bed-community.jpg`
- `v2/public/images/media-pack/stretch-bed-hero.jpg`
- `v2/public/images/media-pack/stretch-bed-kids-building.jpg`
- `v2/public/images/product/nic-with-elder-on-verandah.jpg`
- `v2/public/images/product/washing-machine-name.jpg`
- `v2/public/images/product/washing-machine-installed.jpg`
- `v2/public/images/product/speed-queen-controls.jpg`

Use these for the public brand layer because they show people, product, use, and context without needing much explanation.

### Supporting/admin assets

- CNC, press, mould, pellet, and container shots are useful for process proof, funder reports, and manufacturing documentation.
- Use only a small curated set publicly. Too many similar process shots make the site feel like an internal operations log.
- Component close-ups such as `stretch-bed-legs.jpg`, `stretch-bed-poles.jpg`, and `stretch-bed-assembled.jpg` are useful in specs/support, but are too low-resolution or too technical for hero-level use.

### Replace or archive from public pages

- `v2/public/images/media-pack/woman-on-red-stretch-bed.jpg` is a contact-sheet collage, not a clean photo.
- `v2/public/images/product/washing-machine.jpg` is a contact-sheet collage.
- `v2/public/images/people/xavier-stretch-bed-alice-springs.jpg` is a contact-sheet collage.
- Duplicate files should be rationalised after page decisions are made. Examples found: `lying-on-stretch-bed.jpg` and `stretch-bed-in-use.jpg`; `community-bed-assembly.jpg` and `stretch-bed-assembly.jpg`.

## Admin sweep

### Keep prominent

| Area | Pages | Why |
| --- | --- | --- |
| Daily ops | `/admin`, `/admin/assets`, `/admin/communities` | Core live state of beds, assets, and places. |
| Field delivery | `/admin/bed-signals`, `/admin/bed-preflight`, `/admin/install-bulk`, `/admin/install-checklist` | Directly supports installation, QR scans, and field confidence. |
| Photo evidence | `/admin/photos-browser`, `/admin/photos`, `/admin/library` | Useful for finding proof, spotting gaps, and supporting reports. |
| Supply and revenue | `/admin/production`, `/admin/deals`, `/admin/orders` | Useful if these remain the source of truth for pipeline and fulfilment. |
| Funder reporting | `/admin/funders`, `/admin/reports` | Useful for structured reporting and evidence packs. |

### Useful but phase-specific

| Area | Pages | Condition |
| --- | --- | --- |
| Washing machine telemetry | `/admin/fleet` | Keep if Particle/telemetry is actively used for the prototype. Otherwise demote. |
| Finance reconciliation | `/admin/xero-reconciliation` | Keep if current finance ops use it. Otherwise hide from default sidebar. |
| Trip evidence | `/admin/trip-receipts`, `/admin/scans` | Useful during field trips, not daily navigation. |
| EL operations | `/admin/el-stories`, `/admin/el-storytellers` | Keep if EL is the canonical story source. Otherwise consolidate with local story tooling. |
| Community comms | `/admin/messages`, `/admin/reach-out`, `/admin/announcements` | Keep only if the authenticated community hub is active. |

### Mostly noise or misnamed

| Page | Recommendation |
| --- | --- |
| `/admin/brand` | Rename to "LinkedIn" or "Social". It is a post/performance tracker, not a brand dashboard. |
| `/admin/team` | Hide until populated. It currently shows no team members. |
| `/admin/alice-fill` | Archive as a one-off catch-up wizard unless it is still needed. |
| `/admin/deck` | Move under reports/funders. It is a preview tool, not a daily admin item. |
| `/admin/products` | Treat carefully. Product truth should remain in `src/lib/data/products.ts`; only Stretch Bed is for sale. |
| `/admin/stories` | Consolidate with EL stories or make it explicitly "Local fallback stories". |
| `/admin/compassion` | Counts showed 0 items. Keep only if it remains the intended public-photo consent workflow. |

## Suggested next-phase IA

Public:

- Home
- Stretch Bed
- How it is made
- Stories / From Country
- Washing Machine Prototype
- Partner / Fund
- Contact

Admin:

- Today
- Assets
- Communities
- Field install
- Photos
- Library
- Production
- Deals
- Funders / Reports
- Archive / Tools

## Immediate fixes recommended next

1. Fix `/storytellers` by filtering Empathy Ledger data to Goods-owned storytellers/media, then decide whether to allow the external image host.
2. Fix `/gallery` missing placeholder behavior and remove uncurated/non-photo cards from public gallery.
3. Remove or rename "weave" process language in public copy and media data.
4. Replace Descript embeds on public pages with local video files or static thumbnails.
5. Decide the canonical public stat and contact email, then sweep copy.
6. Reorganise admin sidebar so daily operational tools are separated from archive/one-off tooling.

## Unknowns to confirm

- Whether `/portal`, `/design`, `/pitch`, and `/canberra` are intentionally public.
- Whether LinkedIn post tracking is an active workflow.
- Whether the current EL storyteller feed is expected to include cross-project media.
- The canonical public contact email.
- The canonical public bed count for the next launch pass.
