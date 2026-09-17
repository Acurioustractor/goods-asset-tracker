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
    group: 'Home',
    routes: [
      { href: '/admin', name: 'Home', status: 'hub', note: 'what is due, the map, what needs you' },
      { href: '/admin/today', name: 'The day view', status: 'absorbed', note: 'today, the ops list' },
      { href: '/admin/atlas', name: 'The full Atlas', status: 'absorbed', note: 'the whole map, from Home' },
      { href: '/admin/operating-systems', name: 'Operating systems', status: 'absorbed', note: 'how the system runs' },
    ],
  },
  {
    group: 'Beds',
    routes: [
      { href: '/admin/assets', name: 'The register', status: 'hub', note: 'the source of truth, every bed' },
      { href: '/admin/production', name: 'Production', status: 'absorbed', note: 'shifts, inventory, journal' },
      { href: '/admin/facility', name: 'The facility', status: 'absorbed', note: 'production overview, 8 steps' },
      { href: '/admin/scans', name: 'Scans', status: 'absorbed' },
      { href: '/admin/bed-signals', name: 'Bed signals', status: 'absorbed' },
      { href: '/admin/bed-preflight', name: 'Trip preflight', status: 'utility' },
      { href: '/admin/install-bulk', name: 'Bulk install', status: 'utility' },
      { href: '/admin/install-checklist', name: 'Install checklist', status: 'utility' },
    ],
  },
  {
    group: 'Washing machines',
    routes: [
      { href: '/admin/fleet', name: 'The fleet', status: 'hub', note: 'Pakkimjalki Kari, checked quarterly' },
    ],
  },
  {
    group: 'Communities',
    routes: [
      { href: '/admin/communities', name: 'Communities', status: 'hub', note: 'per-place register + drill pages' },
      { href: '/admin/pathways', name: 'Community pathways', status: 'absorbed', note: 'conversations, modules, media, artifacts' },
    ],
  },
  {
    group: 'People',
    routes: [
      { href: '/admin/people', name: 'People', status: 'hub', note: 'crm_contacts, 135 relationships' },
    ],
  },
  {
    group: 'Stories',
    routes: [
      { href: '/admin/voices', name: 'The voice registry', status: 'hub', note: 'who has spoken, and on what terms' },
      { href: '/admin/consent', name: 'Consent gate', status: 'absorbed', note: 'default-deny worklist' },
      { href: '/admin/voice-impact', name: 'Voice impact model', status: 'absorbed', note: 'voices and quotes, themes to domains' },
      { href: '/admin/quote-cards', name: 'Quote cards', status: 'absorbed' },
      { href: '/admin/field-notes', name: 'Field notes', status: 'absorbed', note: 'trip write-ups' },
      { href: '/admin/field-notes/library', name: 'Field notes library', status: 'absorbed' },
      { href: '/admin/el-stories/new', name: 'New Empathy Ledger story', status: 'absorbed' },
      { href: '/admin/el-storytellers/new', name: 'New Empathy Ledger storyteller', status: 'absorbed' },
      { href: '/admin/media-library', name: 'Media library', status: 'absorbed', note: 'photos, videos, media_links' },
      { href: '/admin/media-gaps', name: 'Media gaps', status: 'absorbed' },
      { href: '/admin/dashboard-images', name: 'Dashboard images', status: 'absorbed' },
      { href: '/admin/library', name: 'Content library', status: 'absorbed' },
      { href: '/admin/canon', name: 'Canon board', status: 'absorbed' },
      { href: '/admin/system-visuals', name: 'Visuals', status: 'absorbed', note: 'diagrams + held assets' },
    ],
  },
  {
    group: 'Sales',
    routes: [
      { href: '/admin/orders', name: 'Orders', status: 'hub', note: 'who bought, what shipped' },
      { href: '/admin/orders/launch-checklist', name: 'Order launch checklist', status: 'absorbed' },
      { href: '/admin/requests', name: 'Requests', status: 'absorbed', note: 'register-interest and bulk enquiries' },
      { href: '/admin/procurement', name: 'Procurement desk', status: 'absorbed', note: 'who can buy a bed and how, per jurisdiction' },
    ],
  },
  {
    group: 'Funding',
    routes: [
      { href: '/admin/deals', name: 'The raise', status: 'hub', note: 'pipeline, LOIs, match spine' },
      { href: '/admin/funders/new', name: 'New funder', status: 'absorbed' },
      { href: '/admin/reports', name: 'Funder reports', status: 'absorbed' },
      { href: '/admin/reports/impact', name: 'Impact reports', status: 'absorbed' },
      { href: '/admin/pitch-cockpit', name: 'Pitch cockpit', status: 'absorbed', note: 'deck state + playout' },
      { href: '/admin/deck', name: 'Deck preview', status: 'absorbed' },
    ],
  },
  {
    group: 'Costs',
    routes: [
      { href: '/admin/cost-model', name: 'The cost model', status: 'hub', note: 'v6, honest numbers' },
      { href: '/admin/xero-reconciliation', name: 'Xero reconciliation', status: 'utility' },
      { href: '/admin/trip-receipts', name: 'Trip receipts', status: 'utility' },
    ],
  },
  {
    group: 'Reaching people',
    routes: [
      { href: '/admin/reach-out', name: 'Reach out', status: 'active', note: 'as-needed' },
    ],
  },
  {
    group: 'Plumbing',
    routes: [
      { href: '/admin/login', name: 'Admin login', status: 'utility', note: 'auth plumbing, never a destination' },
      { href: '/admin/unauthorized', name: 'Unauthorized', status: 'utility', note: 'auth plumbing, never a destination' },
    ],
  },
];

export const ROUTE_STATUS_LABEL: Record<RouteStatus, string> = {
  hub: 'SIDEBAR',
  active: 'PAGE',
  absorbed: 'INSIDE',
  utility: 'TOOL',
  stale: 'STALE',
  'one-off': 'ONE-OFF',
  orphan: 'UNREACHABLE',
};
