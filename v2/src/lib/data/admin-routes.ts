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
  /**
   * OFF THE RAIL, STILL IN THE REGISTRY.
   *
   * Ben swept the directory on 17 September 2026 and named nineteen entries to remove or merge.
   * The registry still has to list every page on disk — that is what the guard checks, and a
   * route nobody has declared is the failure mode it exists to catch. So a swept route stays
   * declared and stops being a sidebar child: reachable by URL and by cmd-K, absent from the
   * list you read every day.
   *
   * `rail: false` is therefore not "retired". It means the page is a tool you go to on purpose,
   * not a door you walk past. Deleting a page is a separate decision, made by deleting the page.
   */
  rail?: false;
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
      { href: '/admin/products', name: 'Products & Plant', status: 'absorbed', note: 'what we make: the four wikis, each with its register count' },
      { href: '/admin/production', name: 'Production', status: 'absorbed', note: 'shifts, inventory, journal' },
      { href: '/admin/facility', name: 'The facility', status: 'absorbed', note: 'production overview, 8 steps' },
      { href: '/admin/scans', name: 'Scans', status: 'absorbed' },
      { href: '/admin/bed-signals', name: 'Bed signals', status: 'absorbed' },
      { href: '/admin/bed-preflight', name: 'Trip preflight', status: 'utility', rail: false },
      { href: '/admin/install-bulk', name: 'Bulk install', status: 'utility', rail: false },
      { href: '/admin/install-checklist', name: 'Install checklist', status: 'utility', rail: false },
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
      { href: '/admin/consent', name: 'Consent gate', status: 'absorbed', note: 'default-deny worklist', rail: false },
      { href: '/admin/voice-impact', name: 'Voice impact model', status: 'absorbed', note: 'voices and quotes, themes to domains', rail: false },
      { href: '/admin/quote-cards', name: 'Quote cards', status: 'absorbed', rail: false },
      { href: '/admin/field-notes', name: 'Field notes', status: 'absorbed', note: 'trip write-ups', rail: false },
      { href: '/admin/field-notes/library', name: 'Field notes library', status: 'absorbed', rail: false },
      { href: '/admin/el-stories/new', name: 'New Empathy Ledger story', status: 'absorbed', rail: false },
      { href: '/admin/el-storytellers/new', name: 'New Empathy Ledger storyteller', status: 'absorbed', rail: false },
      { href: '/admin/media-library', name: 'Media', status: 'absorbed', note: 'one wall: photos and videos together, multi-select and tag' },
      { href: '/admin/media-gaps', name: 'Media gaps', status: 'absorbed', rail: false },
      { href: '/admin/dashboard-images', name: 'Dashboard images', status: 'absorbed', rail: false },
      { href: '/admin/library', name: 'Content library', status: 'absorbed', rail: false },
      { href: '/admin/canon', name: 'Canon board', status: 'absorbed', rail: false },
      { href: '/admin/system-visuals', name: 'Visuals', status: 'absorbed', note: 'diagrams + held assets', rail: false },
    ],
  },
  {
    group: 'Sales',
    routes: [
      { href: '/admin/orders', name: 'Orders', status: 'hub', note: 'who bought, what shipped' },
      { href: '/admin/orders/launch-checklist', name: 'Order launch checklist', status: 'absorbed' },
      { href: '/admin/requests', name: 'Requests', status: 'absorbed', note: 'register-interest and bulk enquiries' },
      { href: '/admin/procurement', name: 'Procurement desk', status: 'absorbed', note: 'who can buy a bed and how, per jurisdiction' },
      { href: '/admin/grantscope', name: 'Grantscope', status: 'absorbed', note: '26,785 Goods-scored opportunities + the ABN join into 609k entities' },
    ],
  },
  {
    group: 'Funding',
    routes: [
      { href: '/admin/deals', name: 'The raise', status: 'hub', note: 'pipeline, LOIs, match spine' },
      { href: '/admin/desk', name: 'The Desk', status: 'active', note: 'the three questions: relationships, legal pathways, readiness to sell' },
      { href: '/admin/funding-board', name: 'Funding board', status: 'active', note: 'every buyer, funder and pathway, one table, by community/type/status' },
      { href: '/admin/funders/new', name: 'New funder', status: 'absorbed' },
      { href: '/admin/reports', name: 'Funder reports', status: 'absorbed' },
      { href: '/admin/reports/impact', name: 'Impact reports', status: 'absorbed' },
      { href: '/admin/pitch-cockpit', name: 'Pitch cockpit', status: 'absorbed', note: 'deck state + playout', rail: false },
      { href: '/admin/deck', name: 'Deck preview', status: 'absorbed', rail: false },
    ],
  },
  {
    group: 'Costs',
    routes: [
      { href: '/admin/cost-model', name: 'The cost model', status: 'hub', note: 'v6, honest numbers' },
      { href: '/admin/xero-reconciliation', name: 'Xero reconciliation', status: 'utility' },
      { href: '/admin/trip-receipts', name: 'Trip receipts', status: 'utility', rail: false },
    ],
  },
  {
    group: 'Reaching people',
    routes: [
      { href: '/admin/reach-out', name: 'Reach out', status: 'active', note: 'as-needed' },
      { href: '/admin/campaign', name: 'Campaign lanes', status: 'active', note: 'the eight audience pathways: door, what they get, what moves them on, who owns it' },
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
