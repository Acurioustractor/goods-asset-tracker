# Route ground truth, 2026-08-02

Facts only. No classification, no verdicts — those belong to the map
[Map: every route classified against the audience model](https://github.com/Acurioustractor/goods-asset-tracker/issues/177).
Resolves [Ground truth: which routes are already redirects, orphans, or twins](https://github.com/Acurioustractor/goods-asset-tracker/issues/179).

Measured against `origin/main` at `cfa8e09`, from `git ls-files` — never `ls`.
Machine-readable companion: `2026-08-02-route-ground-truth.json`.

## The count was wrong

**202 routes, not 209.** 116 public, 86 admin.

The 209 came from the regex `page\.tsx$`, which also matches seven `legacy-page.tsx` files.
Those are not routes — they are dead components parked beside redirect stubs that replaced them:
`/admin/alice-fill`, `/admin/announcements`, `/admin/brand`, `/admin/compassion`,
`/admin/messages`, `/admin/products`, `/admin/team`. Each of those routes now redirects, and each
kept its old page next door, unreferenced.

116 public matches the brief's "117 public routes" within one.

## Redirects

**Two live in `next.config.ts`, not in a route file:**

| Source | Destination | Note |
|---|---|---|
| `/media` | `/press` | permanent |
| `/pitch/simple` | `/pitch/road` | permanent, ruling W |

`/media/page.tsx` **still exists on disk** and is shadowed by that config rule — it is unreachable
dead code, and it is the open sweep item ruling S recorded and never executed.

The config also carries a long comment about a removed `/brand` → `/press#brand-system` rule that
had silently shadowed the real `/brand` page since PR #160. Worth reading before adding any
redirect: a `permanent: true` is a 308 and caches hard.

**Seventeen more are page-level `redirect()` calls.** The public ones:

| Route | → | Kind |
|---|---|---|
| `/mission` | `/story` | redirect |
| `/deck` | `/pitch/road` | redirect |
| `/pitch/control-room` | `/pitch/deck` | permanentRedirect |

The remaining fourteen are admin-internal consolidations (`/admin/photos`, `/admin/photo-review`,
`/admin/photos-browser`, `/admin/photo-align`, `/admin/compassion` → `/admin/media-library`;
`/admin/messages`, `/admin/announcements` → `/admin/reach-out`; `/admin/team` → `/admin/people`;
`/admin/brand` → `/admin`; `/admin/alice-fill` → `/admin/assets`), plus three conditional
in-page redirects that are control flow rather than retirements (`/checkout/success`,
`/auth/phone-login`, `/admin/el-stories/[id]/edit`, `/admin/communities/[id]`,
`/admin/field-notes/[slug]`).

## `/pitch/deck` is a live deck, not a stub

It renders `DeckPublic` — a full ten-turn deck with its own metadata and description. It is **not**
noindexed. `/pitch/control-room` permanently redirects *into* it.

So there are two live deck surfaces on `main`: `/pitch/road` (ruling R and U, "THE deck") and
`/pitch/deck`. `audience.ts` points funders at `/pitch/deck`. Whatever "the deck question is
closed" meant, it did not mean one deck.

## Orphans — thirteen public routes with no inbound internal link

Computed by extracting every internal path literal in `src/**` (594 distinct) and excluding a
route's own directory from its own inbound set.

`/brand` · `/checkout/success` · `/dashboard` · `/design` · `/export/leave-behind` ·
`/export/map/ask` · `/export/map/deployed` · `/export/map/need` · `/insights` · `/kit` ·
`/media` · `/pitch/control-room` · `/portal`

Not all are errors. The three `/export/map/*` routes are deliberate chrome-free 1280x720 deck
renders, reached by a screenshot tool rather than a link. `/checkout/success` is a Stripe return
URL. `/media` is the config-shadowed dead file above.

**Zero admin orphans** — the admin surface is fully interlinked.

The ones that look like genuine loss: **`/brand`** (shipped in PR #160, was unreachable in
production once already, now unlinked again), **`/insights`**, **`/kit`**, **`/portal`**,
**`/dashboard`**.

## Noindex — 32 routes already declare they are not for the public

Seventeen admin routes, plus fifteen public-path routes: `/export/leave-behind` ·
`/field-notes/[slug]` · `/insiders/[...slug]` · `/kit` · `/partners/[slug]/dashboard` ·
**`/pathways`** · **`/pathways/[id]`** · `/pitch/investor-lab` · `/pitch/miro-board` ·
`/pitch/photo-review` · `/pitch/workshop` · `/sites/cost-lab` · `/sites/cost-lab/playbook` ·
`/sites/qbe` · `/sites/qbe-readiness`

Two of those matter beyond housekeeping. **`/pathways` and `/pathways/[id]` are noindexed**, and
`audience.ts` names `/pathways` as the surface serving *both* `community` and `partner` — so the
model's stated front door for two of six audiences is a page deliberately hidden from search.
`/field-notes/[slug]` is likewise the community and supporter surface, noindexed at the detail
level while its index page is not.

`/pitch/investor-lab` and `/pitch/workshop` carry an explicit source comment: *"Internal working
surface, not a funder destination. Indexed by accident until 2026-07-26."*

## Six login doors, three different mechanisms

| Door | Posts to | Secret | Cookie |
|---|---|---|---|
| `/login` | Supabase `auth.signInWithPassword` | real accounts | Supabase session |
| `/auth/phone-login`, `/auth/verify-otp` | `/api/auth/phone-login`, `/api/auth/verify-otp` | phone OTP | Supabase session |
| `/impact/login` | `/api/impact/auth` | `IMPACT_PASSWORD` env | `impact_auth` |
| `/investors/login` | `/api/investors/auth` | `INVESTORS_PASSWORD` env | own |
| `/insiders/login` | `/api/insiders/auth` | `INSIDERS_PASSWORD` env | own |
| `/funders/[slug]/login` | `/api/funders/[slug]/auth` | per-slug, not env | own |
| `/partners/[slug]/login` | `/api/partners/[slug]/auth` | per-slug, not env | own |

Three shared-password gates read a single env var each, so every funder or investor sent to
`/impact` shares one password with every other. `/funders/*` and `/partners/*` are per-slug and
therefore the only per-recipient gates. Nothing is shared between the five bespoke gates and the
real Supabase auth.

## Twins

**True shadowing** — a static route sitting on top of a dynamic one, where Next.js gives the
static file priority:

- `/shop/stretch-bed-single` and `/shop/washing-machine` shadow `/shop/[slug]`.
  Compounding this, `products.ts` says the canonical slug is `stretch-bed` while the live URL is
  `stretch-bed-single`.

**Not shadowing, contrary to the ticket's premise:** `/partners/centrecorp` and
`/partners/oonchiumpa` are *not* twins of a dynamic route. There is **no `/partners/[slug]/page.tsx`** —
only `/partners/[slug]/dashboard`, `/login` and `/outcomes`. Those two hardcoded pages are the only
partner detail pages that exist. Removing them removes the partner surface entirely.

`/communities/[slug]`, `/funders/[slug]`, `/pathways/[id]`, `/stories/[id]`,
`/storytellers/[slug]`, `/field-notes/[slug]` have no hardcoded twins.

## What this changes for the map

- The destination says "all 209 routes". It is **202**.
- `/pitch/deck` cannot be treated as retired. It is live and it is where the model sends funders.
- The `plumbing` verdict has to carry more than login pages: `/export/map/*` are chrome-free
  render targets and `/checkout/success` is a payment return URL. None serves a reader.
- `noindex` is a pre-existing verdict signal on 15 public routes. Anything already noindexed has
  effectively been called `internal` by someone, without the model recording it.
