/**
 * Operating-systems reference data — backs /admin/operating-systems (QBE Area 6:
 * Process & Technology). Three artifacts share this data:
 *   1. the operating-systems map (diagram, rendered from SYSTEM_OWNERS)
 *   2. the source-of-truth matrix (table, SYSTEM_OWNERS)
 *   3. the data-freshness checklist (live, FRESHNESS_DOMAINS)
 *
 * Governing principle: data flows ONE WAY into each owner. Each system is the
 * source of truth for exactly one domain and READS the others — it never
 * restates them. (The grant-touching-the-buyer-board pattern is exactly what
 * produced the stale Centrecorp $208K vs the real $123,332.)
 */

export interface SystemOwner {
  key: string;
  name: string;
  role: string; // one-line "what it owns"
  sourceOfTruthFor: string; // the domain it is canonical for
  reads: string; // what it pulls from other systems
  neverSourceFor: string; // what it must never be treated as the source of
  lives: string; // where it physically lives / how to access
  tier: 'data' | 'narrative' | 'support';
}

export const SYSTEM_OWNERS: SystemOwner[] = [
  {
    key: 'v2',
    name: 'v2 admin + Supabase',
    role: 'Physical & product truth',
    sourceOfTruthFor:
      'Assets (register + QR digital twins), production, cost model v6, public site + Stripe orders',
    reads: 'Nothing — it is the primary record',
    neverSourceFor: 'Funder relationships or money received (GHL + Xero own those)',
    lives: 'Supabase cwsyhpiuepvdjtxaozwf · /admin',
    tier: 'data',
  },
  {
    key: 'ghl',
    name: 'GoHighLevel (GHL)',
    role: 'Relationships & pipeline',
    sourceOfTruthFor:
      'Every relationship and its pipeline stage — buyers, supporters, demand, capital conversations',
    reads: 'Asset and demand signals from v2',
    neverSourceFor: 'Dollars received — never sum money from pipeline cards',
    lives: 'GHL location · synced via v2/src/lib/ghl',
    tier: 'data',
  },
  {
    key: 'xero',
    name: 'Xero (ACT-GD)',
    role: 'Money truth',
    sourceOfTruthFor: 'All money invoiced, received and owed — the ONLY revenue source of truth',
    reads: 'Nothing — it is the financial record',
    neverSourceFor: 'Pipeline or forecast (that is GHL) — Xero is cash + invoices only',
    lives: 'ACT-infra mirror tednluwflfhxyucgwigh (xero_invoices)',
    tier: 'data',
  },
  {
    key: 'notion',
    name: 'Notion',
    role: 'The QBE narrative',
    sourceOfTruthFor:
      'The human story we tell QBE — 12 diagnostic areas, decisions, the match contingency',
    reads: 'Numbers from v2, Xero and GHL',
    neverSourceFor: 'Any number — it pulls from the three data owners, never hand-keys figures',
    lives: 'Notion · Goods. HQ',
    tier: 'narrative',
  },
  {
    key: 'el',
    name: 'Empathy Ledger',
    role: 'Consent-led stories & media',
    sourceOfTruthFor: 'Storyteller consent, stories and media assets',
    reads: 'The Goods project tag',
    neverSourceFor: 'Asset or financial counts',
    lives: 'EL Supabase · project goods (6bd47c8a…)',
    tier: 'support',
  },
  {
    key: 'drive',
    name: 'Google Drive',
    role: 'Documents & exports',
    sourceOfTruthFor: 'Source documents, signed PDFs, CSV/xlsx exports',
    reads: 'Generated reports from v2 and Notion',
    neverSourceFor: 'Live data — Drive holds point-in-time exports, not the live figure',
    lives: 'Drive · Goods folders',
    tier: 'support',
  },
  {
    key: 'grantscope',
    name: 'Grantscope',
    role: 'Funding-discovery brain',
    sourceOfTruthFor:
      'Grant matching and readiness analysis — who could fund this, and are we ready',
    reads: 'Xero, GHL and v2 demand',
    neverSourceFor: 'Asset or cost numbers — it must import v2 figures, not hard-code them',
    lives: 'grantscope repo · goods-signals-workbench',
    tier: 'support',
  },
];

export interface FreshnessDomain {
  id: string;
  label: string;
  backsClaim: string; // the external claim this data underpins
  table: string; // Supabase table queried live
  column: string; // timestamp column (verified against the live schema 2026-05-30)
  staleAfterDays: number; // older than this = refresh before any external use
  verify: string; // what to do / what it means if stale
}

export const FRESHNESS_DOMAINS: FreshnessDomain[] = [
  {
    id: 'assets',
    label: 'Asset register',
    backsClaim: '"540 beds deployed across 11 communities"',
    table: 'assets',
    column: 'created_time',
    staleAfterDays: 45,
    verify: 'Last asset minted to the register. Refresh after a new batch ships.',
  },
  {
    id: 'crm',
    label: 'CRM pipeline',
    backsClaim: 'Buyer + funder pipeline status (never a committed dollar figure)',
    table: 'crm_deals',
    column: 'updated_at',
    staleAfterDays: 14,
    verify: 'Stale pipeline reads as abandoned. Touch every active deal before a demo.',
  },
  {
    id: 'production',
    label: 'Production',
    backsClaim: 'Production capacity / "we are making beds"',
    table: 'production_shifts',
    column: 'created_at',
    staleAfterDays: 30,
    verify: 'No recent shift means: do not imply active production. Log the latest run.',
  },
  {
    id: 'fleet',
    label: 'Fleet telemetry',
    backsClaim: 'Washing-machine usage / telemetry',
    table: 'usage_logs',
    column: 'created_at',
    staleAfterDays: 3,
    verify: 'Only ~1 of ~38 machines reports. Frame telemetry as pilot, not fleet-wide.',
  },
  {
    id: 'orders',
    label: 'Commerce (orders)',
    backsClaim: 'Stripe shop / direct sales',
    table: 'orders',
    column: 'created_at',
    staleAfterDays: 45,
    verify: 'Low volume by design. Confirm before citing ecommerce traction.',
  },
];
