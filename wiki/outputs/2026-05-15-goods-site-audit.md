# Goods on Country site audit — 13-lens sweep

**Date:** 2026-05-15
**Auditor:** lens framework applied to localhost:3004 (same dev codebase as goodsoncountry.com)
**Pages audited:** /, /about, /shop, /shop/stretch-bed-single, /impact (blocked — see below), /mission, /partner, /contact, /story, /stories, /process, /canberra, plus the global header + footer
**Method:** raw HTML curl + source read of `v2/src/app/**` and `v2/src/components/layout/`

---

## 1. Top-line summary

- **Brand voice is being broken on the site itself.** The brand book bans em dashes; the rendered HTML has **80 on /mission, 67 on /stories, 20 on /story, 19 on /shop/stretch-bed-single, 13 on /process**. They are everywhere. This is the single biggest gap between the documented brand and the live experience.
- **The "Impact" link in the impact banner is publicly broken.** ImpactBanner shows on every page with a "Our impact →" CTA pointing at `/impact`, but `/impact` 307-redirects to `/impact/login`. Every visitor who clicks that arrow hits a login wall. Same goes for `/community` in the footer (307 redirect). `/privacy` and `/terms` in the footer bottom row return **404**.
- **The page-title template is double-suffixing.** Root layout sets `template: '%s | Goods on Country'`, but page-level titles already include `| Goods on Country`. Result: `<title>Shop | Goods on Country | Goods on Country`, `Our Story | Goods on Country | Goods on Country`, `Partner With Us | Goods on Country | Goods on Country`, `How It's Made | Goods on Country | Goods on Country`, `Our Mission — Goods on Country | Goods on Country`, etc. SEO + share previews look amateurish.
- **Contact page has the wrong title and meta.** `/contact/page.tsx` is a client component with no `metadata` export, so it inherits the root default: `<title>Goods on Country | Beds That Change Lives</title>`. The H1 says "Contact Us" but the tab/SERP says the homepage title.
- **Hero structure and product story are strong.** When the templates and titles get fixed, the home page passes the 10-second test: clear product (Stretch Bed), clear materials, clear "buy" + "how it's made" CTAs, real On-Country footage. The bones are good — it's the housekeeping that's letting it down.

---

## 2. First impressions test (home page, 10 seconds)

**Score: 7/10.** Passes the test on substance, gets penalised for clutter and one weak CTA.

What a first-time visitor sees in 10 seconds at `/`:

1. **Who you are:** "Goods on Country" wordmark top-left. The strapline "on Country" appears at sm+ breakpoint, hides on mobile (small risk).
2. **What you do:** H1 "The Stretch Bed" over hero video, subtitle is `brand.hero.home.headline` from content.ts. Hero image references a **webflow CDN URL** (`website-files.com/.../20250629-IMG_7731.jpg`) — this is a third-party CDN hardcoded in `v2/src/app/page.tsx:25`, and the filename is `IMG_7731.jpg` (not SEO-friendly).
3. **Who it's for:** Implied by the elder-on-verandah photo card + community photos. Not stated explicitly above the fold.
4. **Why you (not someone else):** "Three materials. No tools. Five minutes." H2 is excellent. "From rubbish to bed" is excellent. The differentiation is there.

**Drag on the 10-second test:**
- Three CTAs compete for attention in the header alone: `Buy Now` (orange primary button), `My Goods` (nav link), the impact banner's `Our impact →`.
- The impact banner across the top says "369+ beds delivered · 8 communities · 20kg plastic diverted" — strong proof, but the right-side `Our impact →` link is broken for the public.
- "Pakkimjalki Kari" as a header nav item with no English subtitle. Lovely cultural choice; bad for first-impression comprehension. Pair it: `Pakkimjalki Kari (Washing Machine)` or use a tooltip.

---

## 3. Section-by-section findings (by lens)

### Lens 1 — First impressions
- `/` passes (see above).
- `/about` H1 "Goods that heal." is poetic but does not answer "what is this site". Lead with the product or impact in the eyebrow line first.
- `/stories` has **no H1 at all** (`<h1>` count = 0 — the page jumps straight to multiple H2s). Major a11y + SEO miss.
- `/contact` H1 says "Contact Us" but the `<title>` is the homepage default. Confusing in a tab.
- `/canberra` is tight and on-brand. Good single H1 ("Made by community."), one clear `Follow [bed]` CTA, no clutter.

### Lens 2 — Header navigation
File: `v2/src/components/layout/site-header.tsx`
- **Multi-word labels** in a primary nav: `The Stretch Bed`, `Pakkimjalki Kari`, `How It's Made`, `Our Story`, `My Goods`. "The Stretch Bed" and "How It's Made" are fine product-led labels. "Pakkimjalki Kari" needs a subtitle or English label (see above).
- **Contact is missing from header nav.** Standard UX says Contact should be discoverable from any page top-bar. Currently the only path is the footer.
- **Header CTA is fine** (single `Buy Now` button, primary brand colour), but the impact banner above it adds a competing `Our impact →` link that goes to a broken/auth-gated page.
- "My Goods" as a header nav item is confusing for first-time visitors — it's a logged-in feature. Consider moving it behind the auth state (only render when signed in) like a normal account menu.

### Lens 3 — Headings & text
- **H1 counts are clean (1 per page) on every page except `/stories` which has 0.** Fix: add an H1 like `Community Stories` to `/stories/page.tsx`.
- **Case inconsistency** in H2s across the site. `/story` H2: "A failure of infrastructure, not culture" (sentence case). `/stretchbed` H2: "About the Stretch Bed" (title case). `/partner` H2s: "Sponsor Beds", "License the Model" (title case). `/about` H2: "The Problem" (title case). Pick one — sentence case feels more on-voice for "warm, grounded".
- **`<h3>` hierarchy is mostly clean** on the home page (material boxes, process steps).
- **"Our Mission — Goods on Country"** in the `<title>` of `/mission` literally contains an em dash. Even the metadata violates the brand rule.

### Lens 4 — Images
- **Alt text is good** across the site. Examples from /:
  - `alt="Recycled HDPE plastic legs — pressed from community waste"` (descriptive, but contains an em dash — fixable)
  - `alt="Elder woman standing proudly next to assembled Stretch Bed on red dirt"`
  - `alt="CNC router cutting bed leg components from pressed plastic sheet"`
- **Filenames are SEO-friendly** for the `/images/` directory: `bed-frame-legs.jpg`, `cnc-cutter.jpg`, `pressed-sheets.jpg`, `community-bed-assembly.jpg`. No `IMG_xxxx.jpg` or `DJI_xxxx.jpg` found in `/public/images/`.
- **Hero image is a hardcoded external CDN URL** with the non-SEO filename `20250629-IMG_7731.jpg` (`v2/src/app/page.tsx:25`, webflow `website-files.com`). Move this to `/public/images/hero/` with a real filename like `stretch-bed-hero.jpg`.
- **No `width`/`height` audit done** but next/image is in use, so this is mostly fine. The hero is reasonable. The home is 165KB HTML (a lot of inlined RSC payload but next/image handles the asset loads).

### Lens 5 — CTAs
- **Two competing primary CTAs in the home hero:** `Shop the Stretch Bed` (amber-600 background, white text, bold) and `How It's Made` (transparent outline). The amber/orange doesn't match the brand "Rust #C45C3E" — it's `bg-amber-600` (`v2/src/app/page.tsx` Hero component). Bring CTA colour into the palette.
- **"Buy Now" button in header** uses `data-variant="default"` (primary). **"Buy Now" elsewhere on the home page** uses a different style: `bg-accent-foreground text-accent`. Same label, two visual treatments.
- **"Read All Stories" button appears twice in adjacent DOM nodes** on /, once as `variant="outline"` (mobile-hidden) and once as `variant="default"` — clearly a desktop/mobile split, but they read like two buttons stacked in the source.
- **Buttons have wildly different border-radius across pages.** Home: `rounded-md` (≈6px). Newsletter Subscribe: `rounded-lg` (≈8px). Various pill nav buttons on /story (sticky anchor nav): `rounded-full`. CTA shape inconsistency.
- **/partner has 4 sibling "Discuss / Enquire / Sponsor" mailto buttons** — all `bg-primary`, all the same look, sitting in a 4-column grid. This is the "kid in a toy shop" pattern: four equal-weight primary CTAs in one section, no hierarchy.

### Lens 6 — General page focus
- **/home** is well-paced: hero → product → manufacturing → impact → stories → final CTA. Good narrative arc.
- **/story** is the polished long-read with sticky anchor nav (`#hero`, `#problem`, `#cascade`, `#stretch-bed`, `#washing-machine`, `#journey`, `#voices`, `#manufacturing`, `#impact`, `#partners`, `#future`). Big page (398 KB HTML, ~20 em dashes, 80 in /mission). Lovely structure but **/story and /mission overlap heavily** — same H1 framing on both ("Built with communities, not for them" / "A good bed can prevent heart disease"). Visitor will land on one, get told "this is the deep story", then bounce when they realise /mission and /story are 80% the same.
- **/about** also overlaps. Three pages saying versions of the same thing.
- **/canberra** is the cleanest page on the site. Single hero, single offer, single CTA. Use it as the model.

### Lens 7 — Footer
File: `v2/src/components/layout/site-footer.tsx`
- **Column order:** Brand · Product · About · Connect — fine.
- **Brand column copy is off-voice:** "Delivering essential items to remote Australian Indigenous communities. Every purchase makes a difference." — "every purchase makes a difference" is exactly the soft charity-tinged phrasing the brand book wants to avoid. Rewrite.
- **Newsletter prompt is wrong product:** "Get updates on new products, community stories, and **farm content**." Goods on Country doesn't have a farm. This is left-over template copy. Replace.
- **Bottom row carries internal/staff links into the public footer:** `Dashboard` (logged-in only) and `Shift Log` (`/production`) sit next to Privacy and Terms. They should be behind auth or removed from the public footer.
- **Privacy and Terms are 404.** They link from every page and don't exist.
- **No ABN, no charity registration link, no postal address.** For a social enterprise / DGR brand the legal footer is thin. Add ABN, ACNC registration link if applicable, and a single contact email.
- **LinkedIn social link points at "a-curious-tractor"** (parent org), not a dedicated Goods page. Fine if intentional, but check.
- **No Instagram, no Facebook** despite the brand running social.

### Lens 8 — Broken or duplicate links
- `/impact` — 307 → `/impact/login` (auth-gated, but linked publicly from the impact banner on every page and from `/about`, `/stories`, `/canberra` footer).
- `/community` — 307 (probably auth or redirect).
- `/privacy` — **404**.
- `/terms` — **404**.
- Three duplicate CTAs to `/shop/stretch-bed-single` on /home alone: `Buy Now` (header), `Shop the Stretch Bed` (hero), `Buy Now` (final section). Same destination, three labels.
- `/about` "Partner With Us" button goes to `/contact`, not `/partner`. Mismatched label vs destination.
- Header has `My Goods` → `/my-items`. That route exists but is a logged-in feature — confusing for first-time visitors.

### Lens 9 — Page suggestions
- **Pre-footer CTA boxes on multiple pages double-up.** /shop has a "Want to make an even bigger impact?" panel + the global Newsletter sign-up + the footer. That's three CTA blocks stacked at the bottom of a page.
- **`/stretch-bed-single` mid-page "Want to make a bigger impact?"** panel sits before product specs, asking the visitor to act before they've finished reading.
- **The impact banner stat block (369+ / 8 / 20kg) shows on every page including `/canberra` and `/shop` where it visually competes with page hero stats.** Either suppress on dedicated landing pages or make it dismissible.

### Lens 10 — Sign-up / form pages
- **/contact** form has the four-inquiry-type pattern (Partnership, Bulk Order, Media, General). Clean. Uses controlled state. **No metadata** on the page (see Lens 12) — the page tab will say "Goods on Country | Beds That Change Lives" while the user is filling out a contact form.
- **Newsletter form** sits inside the footer on every page. Subscribe button is `rounded-lg` while the rest of the site's primary buttons are `rounded-md`. Visual inconsistency.
- Did not click-test form submission paths — assume backend works (it's been live).

### Lens 11 — Proof reading
- **Em dashes are pervasive and against brand rule.** Counts of visible em dashes in body text:
  - `/mission` — **80**
  - `/stories` — **67**
  - `/story` — **20**
  - `/shop/stretch-bed-single` — **19**
  - `/process` — **13**
  - `/home` — **7**
  - `/shop` — **7**
  - `/partner` — **6**
  - `/canberra` — **5**
  - `/about` — **4**
  - `/contact` — **0**
  - Examples: "Plastic goes into the shredder — a containerised unit..." (home), "This isn't a cultural choice—it's a failure of infrastructure" (about, with NO spaces — even worse), "Two community members threading canvas over the bed frame" (alt text), "Buy Now —" (stretch bed CTA copy).
- **Mixed apostrophes.** Headers use `How It's Made` with an HTML-encoded straight apostrophe (`&#x27;`). On `/story` you see `How It's Made` (curly apostrophe). Pick one.
- **Case inconsistency** (covered in Lens 3).
- **"Our impact" in ImpactBanner** uses sentence-case "impact" while everything else uses "Impact" (footer About column). Pick one.
- **"farm content"** in newsletter copy (covered above).

### Lens 12 — Meta
- **`<title>` template bug — every page-level metadata that names "Goods on Country" gets duplicated.** Root layout (`v2/src/app/layout.tsx`) sets `template: '%s | Goods on Country'`. Page titles that should be just `Shop` are instead `Shop | Goods on Country`, which the template then turns into `Shop | Goods on Country | Goods on Country`. Affected: /shop, /shop/stretch-bed-single, /partner, /story, /process, /mission. Mission also has an em dash in the title (`Our Mission — Goods on Country | Goods on Country`).
- **/contact has no metadata at all** (client component without an export). It inherits the homepage default title and description.
- **OG description** still uses "Every purchase makes a difference" — same soft charity framing.
- **Keywords meta still lists "charity"** as a keyword (`<meta name="keywords" content="...charity,remote communities...">`). Keywords meta is mostly dead for SEO but the listed term contradicts the brand stance.

### Lens 13 — Speed/structure
HTML page weights (dev build, includes RSC inline payload — production builds will be smaller):

| Page | Bytes |
|---|---|
| /stories | **634,828** |
| /story | **398,954** |
| /mission | **320,211** |
| /about | 212,175 |
| /shop/stretch-bed-single | 188,674 |
| /partner | 167,316 |
| /home | 165,309 |
| /shop | 138,312 |
| /process | 137,068 |
| /canberra | 67,728 |
| /contact | 54,645 |
| /impact | **28 (redirect)** |

`/stories` at **635 KB** of HTML for a list page is excessive — likely rendering every storyteller's full record server-side. /story and /mission are essentially the same long-form content rendered with slightly different framing. Worth auditing whether `/stories` needs to render full content of every story up-front (probably should be summary cards with links to individual story pages).

---

## 4. Prioritised punch list

**P0 — this week (blocks credibility / launch hygiene)**

1. **Fix the `<title>` template double-suffix.** Either change root layout `template` to just `'%s'`, or strip `| Goods on Country` from every page-level title export. Files: `v2/src/app/layout.tsx` + every `metadata` export under `v2/src/app/*/page.tsx`.
2. **Add `metadata` export to `/contact/page.tsx`.** Set the title to `Contact` and write a real description. (It's a client component — add a sibling `metadata.ts` or convert.)
3. **Build a real `/privacy` and `/terms`.** Both are linked from the global footer and both 404. Use generic ACT template or paste in legal copy — anything is better than 404.
4. **Make `/impact` public OR remove the public CTA to it.** The ImpactBanner shows on every page with `→ Our impact` linking to a 307. Either drop the auth gate (the user already shipped a corrected public /impact per memory) or remove the link from the banner.
5. **Strip em dashes from all visible page copy.** Replace with colons, periods, or parentheticals per brand rule. Heaviest offenders: /mission (80), /stories (67), /story (20), /shop/stretch-bed-single (19). A simple grep + replace pass over `v2/src/lib/data/content.ts`, the page tsx files, and any data files (compendium, impact-model, journeyStories) covers most of it.
6. **Add an H1 to `/stories/page.tsx`.** Currently zero H1s. Suggested: `Community Stories`.
7. **Replace "farm content" in `site-footer.tsx:43`.** Suggested: `Get updates on new products, community stories, and what's happening On-Country.`
8. **Remove `Dashboard` and `Shift Log` from the public footer.** Move behind auth or behind `/admin`. `v2/src/components/layout/site-footer.tsx:148-153`.

**P1 — this month (improves conversion + brand)**

9. **Consolidate /story, /mission, /about into a clear three-tier IA.** They overlap ~70%. Suggested split: `/about` = the elevator pitch (1 screen), `/story` = the long narrative (one canonical page), `/mission` = redirect to /story or merge. Keep one canonical long-form.
10. **Standardise CTA colour/shape/radius.** One primary button style (Rust #C45C3E `bg-primary`), one secondary style. `rounded-md` everywhere. Newsletter button currently `rounded-lg`. Home hero button currently `bg-amber-600` not brand Rust.
11. **Add Contact to the header nav** (or make sure it's reachable from header from every page).
12. **Pair `Pakkimjalki Kari` in the header with `(Washing Machine)`** or a hover/tooltip. Currently first-time visitors won't know what it is.
13. **Reduce duplicate CTAs on /home.** Hero has two large CTAs; mid-page sections each have a "Buy Now"; pre-footer has another "Buy Now"; header has a fourth. Consolidate to a clear primary path.
14. **Rewrite the footer brand-column copy.** "Every purchase makes a difference" is the soft-charity phrasing the brand wants out. Suggested: `Community-designed health hardware. Manufactured on Country. Owned by communities.`
15. **Audit `/stories` size.** 635 KB of HTML for a listing page suggests it's rendering full content for every storyteller. Convert to summary cards + per-story detail page.
16. **Move the hero image off the webflow CDN.** `v2/src/app/page.tsx:25` references `website-files.com/.../20250629-IMG_7731.jpg`. Re-export with a real filename (`stretch-bed-hero.jpg`) and serve from `/public/images/hero/`.
17. **Fix "Partner With Us" button on /about** that points to `/contact` instead of `/partner`. Mismatched label vs destination.
18. **Add ABN + ACNC + a contact email to the footer bottom row.** Currently the legal block only has © + (broken) privacy/terms.

**P2 — nice to have**

19. **Pick sentence case or title case for H2s, apply globally.** Currently mixed across pages.
20. **Hide `My Goods` from header for unauthenticated users.** It's a logged-in feature; for first-time visitors it's noise.
21. **Decide whether the ImpactBanner should appear on every public page** or be suppressed on `/canberra` and `/shop/stretch-bed-single` where it competes with page-specific stats.
22. **Standardise the apostrophe character.** Mixed `&#x27;` (straight) and `'` (curly) across pages.
23. **Remove `charity` from the keywords meta** on the root layout — small thing, off-brand.
24. **Pair "Buy Now —" copy on the stretch bed page** with the actual price ($560) or drop the em dash entirely.
25. **Confirm `/community` 307 destination is correct** — currently redirects somewhere not in the public flow.

---

## 5. What's great (keep doing this)

1. **The Stretch Bed product story is concrete and confident.** "Three materials. No tools. Five minutes." + "26kg, supports 200kg, 10+ year lifespan. Each bed diverts 20kg of plastic from landfill." Specific, testable, on-voice.
2. **Image alt text is real.** It describes what is in the picture — kids assembling the bed, elder on red dirt, CNC router cutting plastic. No generic "image of bed" fluff. This is rare and good.
3. **The "From rubbish to bed" manufacturing section** on the homepage tells the whole story in five steps with photos. This is the single best section on the site.
4. **`/canberra` is your model page.** Single hero, single offer, single CTA, no clutter, on-voice. Use it as the template for any future landing pages.
5. **The brand stance is clearly articulated in copy** — "Built with communities, not for them", "Commerce, not charity", "This is not a cultural choice. It's a failure of infrastructure." When you stop using em dashes around these statements they will hit harder.
6. **Real photography throughout.** Community members, elders, kids, on-country, golden hour. Not stock. Not aspirational renders. This is the single biggest credibility lever the site has — don't replace it.
7. **The impact stat banner (369+ / 8 / 20kg)** is concrete and updates with real data. Once the broken `→ Our impact` link is fixed it's a high-trust element.

---

## Closing note

The site has the substance. The polish gap is housekeeping: title templates, broken footer links, em dashes against brand rule, and consolidating three pages that say the same thing into one. Two days of P0 fixes would close most of the gap. The product story is already there.
