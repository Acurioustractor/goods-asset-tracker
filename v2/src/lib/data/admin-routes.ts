/**
 * The complete admin route directory · every route under /admin, grouped and
 * dispositioned. Mirrors wiki/investor/09-admin-ia.md (all routes reviewed
 * 2026-07-19; directory surfaced on /admin 2026-07-20).
 *
 * status:
 *   hub       · a wing/hub destination on the sidebar
 *   active    · working surface, reachable via a hub tab or More drawer
 *   absorbed  · folded into a hub; still works, linked from that hub's tabs
 *   utility   · workflow tool used on trips/installs
 *   stale     · no edits in 3+ months; direct URL only
 *   one-off   · built for a single past job; never re-linked
 *   orphan    · works, and nothing links to it. Added 2026-09-17 when the guard found five,
 *               and empty by the end of the same day because all five were deleted. A route
 *               nobody can reach is a decision nobody made, so it gets its own word, and the
 *               word is there so the next one is caught on the day it appears.
 */

export type RouteStatus = 'hub' | 'active' | 'absorbed' | 'utility' | 'stale' | 'one-off' | 'orphan';

export interface AdminRoute {
  href: string;
  name: string;
  status: RouteStatus;
  note?: string;
}

export interface RouteGroup {
  group: string;
  routes: AdminRoute[];
}

export const ADMIN_ROUTE_DIRECTORY: RouteGroup[] = [
  {
    group: 'The system (hubs)',
    routes: [
      { href: '/admin', name: 'Dashboard', status: 'hub', note: 'canon strip + areas + system row' },
      { href: '/admin/atlas', name: 'Goods Atlas', status: 'hub', note: 'the map of everything' },
      { href: '/admin/voices', name: 'Voices hub', status: 'hub', note: 'registry, tiers, tabs to all story surfaces' },
      { href: '/admin/voice-impact', name: 'Voice Impact Model', status: 'hub', note: '29 voices, 192 quotes, themes to domains' },
      { href: '/admin/communities', name: 'Communities', status: 'hub', note: 'per-place register + drill pages' },
      { href: '/admin/pathways', name: 'Community pathways', status: 'hub', note: 'conversations, modules, media and artifacts' },
      { href: '/admin/people', name: 'People', status: 'hub', note: 'crm_contacts, 135 relationships' },
      { href: '/admin/cost-model', name: 'Money story', status: 'hub', note: 'cost model v6, honest numbers' },
      { href: '/admin/deals', name: 'Raise', status: 'hub', note: 'QBE pipeline, LOIs, match spine' },
      { href: '/admin/pitch-cockpit', name: 'Pitch cockpit', status: 'hub', note: 'deck state + playout' },
      { href: '/admin/media-library', name: 'Media library', status: 'hub', note: 'photos, videos, media_links' },
      { href: '/admin/system-visuals', name: 'Visuals', status: 'hub', note: 'diagrams + held assets' },
      { href: '/admin/consent', name: 'Consent gate', status: 'hub', note: 'default-deny worklist' },
      { href: '/admin/facility', name: 'Facility', status: 'hub', note: 'production overview, 8 steps' },
      { href: '/admin/today', name: 'Today (ops)', status: 'hub', note: 'the ops day view' },
    ],
  },
  {
    group: 'Story and voices',
    routes: [
      { href: '/admin/quote-cards', name: 'Quote cards', status: 'absorbed', note: 'via Pitch hub' },
      { href: '/admin/field-notes', name: 'Field notes', status: 'active', note: 'trip write-ups' },
    ],
  },
  {
    group: 'Pitch and content',
    routes: [
      { href: '/admin/deck', name: 'Deck preview', status: 'absorbed' },
      { href: '/admin/canon', name: 'Canon board', status: 'absorbed', note: 'via Visuals' },
      { href: '/admin/media-gaps', name: 'Media gaps', status: 'absorbed' },
      { href: '/admin/dashboard-images', name: 'Dashboard images', status: 'active' },
      { href: '/admin/library', name: 'Content library', status: 'active' },
    ],
  },
  {
    group: 'Money and funders',
    routes: [
      { href: '/admin/reports', name: 'Funder reports', status: 'active' },
      { href: '/admin/reports/impact', name: 'Impact reports', status: 'active' },
      { href: '/admin/orders', name: 'Orders', status: 'active' },
      { href: '/admin/requests', name: 'Requests', status: 'active' },
      { href: '/admin/xero-reconciliation', name: 'Xero recon', status: 'utility' },
      { href: '/admin/trip-receipts', name: 'Trip receipts', status: 'utility' },
    ],
  },
  {
    group: 'Field and fleet',
    routes: [
      { href: '/admin/production', name: 'Production', status: 'active', note: 'shifts, inventory, journal' },
      { href: '/admin/assets', name: 'Asset register', status: 'active', note: 'the source of truth' },
      { href: '/admin/bed-preflight', name: 'Trip preflight', status: 'utility' },
      { href: '/admin/install-bulk', name: 'Bulk install', status: 'utility' },
      { href: '/admin/install-checklist', name: 'Install checklist', status: 'utility' },
      { href: '/admin/bed-signals', name: 'Bed signals', status: 'active' },
      { href: '/admin/scans', name: 'Scans', status: 'active' },
      { href: '/admin/fleet', name: 'Fleet', status: 'active', note: 'quarterly' },
      { href: '/admin/operating-systems', name: 'Operating systems', status: 'active' },
    ],
  },
  {
    group: 'Comms and legacy',
    routes: [
      { href: '/admin/reach-out', name: 'Reach out', status: 'active', note: 'as-needed' },
      // Moved off /pitch/* on 2026-08-02 (route sweep, map #177 ticket #183). They were internal
      // working surfaces on a funder-facing path prefix, relying on noindex, which was never a
      // gate: a noindexed page is fully readable by anyone holding the URL.
    ],
  },
  {
    // Everything built after the 19 July review, declared 17 September 2026 when the drift guard
    // went in. Until then the directory had no idea any of these existed.
    group: 'Built since the review',
    routes: [
      { href: '/admin/procurement', name: 'Procurement desk', status: 'active', note: 'who can buy a bed and how; linked from Cockpit 2026-09-17' },
      { href: '/admin/orders/launch-checklist', name: 'Order launch checklist', status: 'absorbed', note: 'reached from Orders' },
      { href: '/admin/field-notes/library', name: 'Field notes library', status: 'absorbed', note: 'reached from Field notes' },
      { href: '/admin/el-stories/new', name: 'New EL story', status: 'absorbed', note: 'create form under EL stories' },
      { href: '/admin/el-storytellers/new', name: 'New EL storyteller', status: 'absorbed', note: 'create form under EL storytellers' },
      { href: '/admin/funders/new', name: 'New funder', status: 'absorbed', note: 'create form under Funders' },
      { href: '/admin/login', name: 'Admin login', status: 'utility', note: 'auth plumbing, never a destination' },
      { href: '/admin/unauthorized', name: 'Unauthorized', status: 'utility', note: 'auth plumbing, never a destination' },
    ],
  },
];

export const ROUTE_STATUS_LABEL: Record<RouteStatus, string> = {
  hub: 'HUB',
  active: 'ACTIVE',
  absorbed: 'IN HUB',
  utility: 'FIELD TOOL',
  stale: 'STALE',
  'one-off': 'ONE-OFF',
  orphan: 'UNREACHABLE',
};
