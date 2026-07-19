# Area 9 — Admin IA Review: every route accounted for

> Rule for this restructure: NOTHING is deleted. Every route is either kept, made a hub,
> absorbed (old URL redirects to its hub, implementation stays in git), or archived
> (`git mv` to `_archive/<date>/` with RESTORE.md). A route only moves after its
> functionality is confirmed present at its destination.
> Status: DRAFT for Ben review. Written 2026-07-19.

## Current nav shape
- Sidebar (`admin-sidebar.tsx`): 5 groups (Today / Make / Place / Story / Money), 27 items + "More" drawer (14) + 7 unlisted routes (direct URL only).
- 4 routes are already dead redirects to `/admin/media-library`.

## Target IA: two wings

**Wing A — Investor Wiki / Pitch mode** (maps to wiki areas 1-8):
Home dashboard → Voices · Money Story · People · Raise · Visuals · Media · Pitch

**Wing B — Operations mode** (unchanged in this pass):
Production · Fleet · Assets · Installs · Orders · Communities

## Full route disposition (57 routes)

| Route | Current purpose | Disposition | Destination / notes |
|---|---|---|---|
| `/admin` (home) | dashboard | **REBUILD** | becomes the wiki dashboard (area cards + canon strip + ops wing entry) |
| `story-atlas` | registry + transcripts atlas | **HUB: Voices** | primary Voices surface |
| `storytellers` | storyteller registry | ABSORB → Voices | registry view becomes a tab |
| `el-storytellers` (+new) | raw EL storytellers | ABSORB → Voices | "EL raw" tab; new-storyteller flow kept |
| `el-stories` (+edit/new) | raw EL stories browser | ABSORB → Voices | "EL stories" tab; edit/new flows kept |
| `stories` | curated syndication stories | ABSORB → Voices | curated tab |
| `community-stories` | community-matched EL stories | ABSORB → Voices | community lens tab |
| `quotes` | quotes worklist | ABSORB → Voices | quote bank tab (feeds Pitch) |
| `consent` | consent worklist | **KEEP standalone** | gate function; linked prominently from Voices. Never bury the consent gate |
| `field-notes` (+slug/library) | trip field notes | KEEP | linked from Voices + Full Stories area |
| `cost-model` | verified cost model workspace | **HUB: Money Story** | primary money surface |
| `library` | BOM/manufacturing/wiki reference | ABSORB → Money Story | BOM tab; check funder-pages content moves too |
| `xero-reconciliation` | Xero payment recon | KEEP (ops-finance) | linked from Money Story, stays own page (day-shift tool) |
| `trip-receipts` | trip receipts (ACT infra) | KEEP (ops-finance) | as-is |
| `people` | people directory + GHL | **HUB: People** | primary |
| `team` | advisory board/team | ABSORB → People | static compendium tab |
| `funders` (+slug/video-brief/new) | funder registry | ABSORB → People (registry) + Raise (pipeline) | registry tab in People; video-brief flow kept under Raise collateral |
| `deals` | GHL pipeline kanban | **HUB: Raise** | primary raise surface |
| `loi-tracker` | LOI pipeline | ABSORB → Raise | LOI tab (QBE match spine) |
| `reach-out` | GHL smart-list outreach | ABSORB → Raise | outreach tab |
| `reports` (+impact/[templateId]) | funder report generator | ABSORB → Raise | collateral tab; impact templates kept |
| `system-visuals` | canon visuals gallery | **HUB: Visuals** | primary diagrams surface (wiki area 5) |
| `canon` | canonical EL picks | ABSORB → Visuals | canon-picks tab |
| `dashboard-images` | partner dashboard image slots | ABSORB → Visuals | slots tab |
| `media-library` | central media library | **HUB: Media** | already canonical |
| `media-gaps` | media coverage gaps | ABSORB → Media | gaps tab |
| `photos` / `photos-browser` / `photo-review` / `photo-align` | dead redirects | ARCHIVE folders | already redirect; move old impls to `_archive/` with RESTORE.md, keep redirect files |
| `pitch-cockpit` | pitch asset cockpit | **HUB: Pitch** | primary |
| `deck-builder` | interactive deck builder | ABSORB → Pitch | builder tab |
| `deck` | funder-generated deck render | ABSORB → Pitch | render/preview tab |
| `quote-cards` | shareable quote card generator | ABSORB → Pitch | cards tab |
| `site-content` | public site content map | KEEP | becomes the "website alignment" checklist surface (final wiki step) |
| `brand` | brand/content dashboard | KEEP (review) | stale-listed; confirm with Ben before archiving — holds post stats |
| `production` | production inventory/shifts | KEEP (Ops wing) | unchanged |
| `fleet` (+machine_id) | fleet KPIs | KEEP (Ops) | unchanged |
| `assets` (+unique_id/batch) | asset register | KEEP (Ops) | unchanged |
| `communities` (+id) | community rollup | KEEP (Ops) | linked from People + Voices |
| `bed-preflight` | trip preflight | KEEP (Ops) | unchanged |
| `bed-signals` | scan signals feed | KEEP (Ops) | candidate to merge with `scans` LATER, not this pass |
| `scans` | bed scans list | KEEP (Ops) | see above |
| `install-bulk` | bulk installs from photos | KEEP (Ops) | unchanged |
| `install-checklist` | install checklist | KEEP (Ops) | unchanged |
| `alice-fill` | one-off 2026-05-21 wizard | ARCHIVE (with RESTORE.md) | confirmed one-off; Ben sign-off before moving |
| `orders` (+id/launch-checklist) | Stripe orders | KEEP (Ops) | unchanged |
| `products` | Stripe products | KEEP (Ops) | unchanged |
| `requests` | bed requisitions | KEEP (Ops) | unchanged |
| `operating-systems` | OS catalog | KEEP | link from dashboard; review later |
| `roadmap` | roadmap board | KEEP | More drawer |
| `messages` | inbound messages | KEEP (stale-review) | confirm usage with Ben before any move |
| `announcements` | announcements | KEEP (stale-review) | same |
| `compassion` | compassion content library | KEEP (stale-review) | same |
| `login` / `unauthorized` | auth plumbing | KEEP | untouched |

## Safety checks before ANY absorb ships
1. Feature parity checklist written per absorbed route (what screens/actions exist today, verified present at destination).
2. Old URL 302s to new location (no 404s ever).
3. `npm run build` clean + click-through of the destination hub.
4. Archives via `git mv` + RESTORE.md only, per standing archive semantics.
5. Consent gate (`/admin/consent`) and Xero recon are never folded into anything.

## Open questions for Ben
- `brand`, `messages`, `announcements`, `compassion`: still used at all? (marked stale since ~May)
- OK to archive `alice-fill` and the 4 dead photo-route folders?
- Does the Ops wing keep the current sidebar treatment, or get its own home card row on the new dashboard?
