---
date: 2026-05-27T17:30:00+10:00
session_name: uncommitted-work-landing-and-cleanup
branch: fix/funder-figures-reconciliation
status: in-progress
---

# Goods on Country — Handoff Ledger

## Ledger
**Updated:** 2026-05-27T17:30:00+10:00
**Goal:** Land the accumulated uncommitted work (9 days, 18 tracked files + several untracked features) into clean, atomic commits; apply the one outstanding DB migration; clean the working tree.
**Branch:** `fix/funder-figures-reconciliation` (now holds the feature commits below — name no longer matches contents; rename or cherry-pick before merging to main)
**Test:** `cd v2 && npm run dev`; `cd v2 && npm run build` is clean (exit 0, 232/232 pages)

### Now
[->] Decide branch disposition (rename `fix/funder-figures-reconciliation` → something like `feat/site-media-tooling-and-sponsor` OR split), then push. Nothing has been pushed yet.

### This Session (2026-05-27)

Worked through the uncommitted pile one thread at a time, verifying each (typecheck + render + dependency tracing) before committing.

**Commits landed (all local, none pushed):**
- `b627323` home: self-serve media swap + Oonchiumpa "designed in community" section + picker LIST API website-images/cross-project support
- `6e9e93d` sponsor: redesigned flow + dedication messages (success page shows sponsorship timeline)
- `9860b50` assets: outcome capture (household_size, theme_tag, recipient_consent_at) + 2 migrations
- `ced0235` admin-orders: surface sponsorship dedications for fulfilment
- `65d781e` partners: live funder outcomes snapshot (`/partners/[slug]/outcomes`) + Centrecorp reconciliation (no dollar headline, provenance sidecar)
- `1f099f0` process: media swap on production-flow steps
- `3e30fe4` admin: photo browser for cross-project EL media
- `e49df98` partners: Oonchiumpa partnership page
- `80787a5` admin: bulk install logger (EXIF/QR/HEIC) + 4 image libs
- `2034d43` scripts: EL tag-bridging + GHL LinkedIn-tag migration
- (plus this cleanup: partner public assets, wiki docs, batch PDFs, .gitignore)

**DB migration APPLIED to live v2 DB (`cwsyhpiuepvdjtxaozwf`):**
- `20260519000001_assets_outcome_fields.sql` — added household_size, theme_tag, recipient_consent_at; rebuilt `community_rollup` with household_reach + households_with_consent. Was untracked AND unapplied; its `CREATE OR REPLACE VIEW` would have failed (mid-list column insert) — fixed to DROP+CREATE. Applied via Supabase Management API query endpoint (psql had no cached password). Verified: columns live, view rebuilt, PostgREST sees them.
- `20260520000001_assets_recipient_and_install_photo.sql` — was already applied to DB, just never committed. Now in git.

**Bugs fixed in passing:**
- `/partners/[slug]/outcomes` 500 → Server Component passed `onClick`; extracted `print-button.tsx` client island.
- Latent untracked-import/asset traps: `partners.ts`, outcomes page, photos-browser, oonchiumpa page, and 3 `v2/public` assets (final-assembly.jpg, elder-feedback.jpg, oochiumpa-good-news-story.pdf) were untracked but linked-to by committed code. All committed with their dependents.

**Working tree cleanup:**
- Deleted dead `v2/src/app/brand/page.tsx` (shadowed by committed `/brand → /press#brand-system` redirect; wordmark pack lives in /press).
- Extended `.gitignore` for ~285 root-level scratch screenshots + source-media dumps (Utpoia Photos Export/, QR folders, Story images/, *.zip). Real assets live in v2/public; source photos go to EL.

### Next
- [ ] Branch rename/split + push.
- [ ] `v2/src/app/brand/page.tsx` is gone — if a standalone /brand page is ever wanted again, drop the redirect at `next.config.ts:58` first.
- [ ] Sponsor page is a 661-line visual redesign — eyeball `/sponsor` to confirm the look.
- [ ] Provenance doc for the Centrecorp one-pager still cites the now-stale "$388,432 invoiced / $265,100 outstanding" internally (page itself is dollar-free by design). Reconcile against live Notion/Xero if that internal table matters.

### Decisions (this session)
- One-by-one verify-then-commit beats bulk-commit: caught a 500, a broken migration, and 5+ latent untracked deps that bulk `git add` would have buried.
- DDL on v2 production goes through psql/Management API, never the Supabase MCP (wrong project) or exec_sql RPC (no DDL).
- Root-level images in this repo are always scratch → gitignored broadly (`/*.png` etc.); no tracked root images exist.

### Carried over (still load-bearing)
- COGS per Stretch Bed = $149.20; price unified to $750.
- Communities are first-class DB entities; `community_rollup` view is canonical (now extended with household reach + consent).
- Field-notes `/field-notes/utopia-may-2026` still `published: false` — prior session's publish gate (Gate C: Oonchiumpa end-to-end review) not yet met. Self-serve picker work from that session is unaffected.

### Open Questions (carried)
- UNCONFIRMED: 3 paraphrased field-notes voice quotes need real Oonchiumpa attribution before publish.
- UNCONFIRMED: Centrecorp tranche re-attribution (Snow vs Centrecorp for May deployment) — confirm with Nic.
