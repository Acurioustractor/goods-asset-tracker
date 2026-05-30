/**
 * LOI tracker config — backs /admin/loi-tracker.
 *
 * Source of truth is GHL: relationships and pipeline stages live there (per the
 * operating-systems source-of-truth matrix). This file only maps the live GHL
 * Goods pipelines + stages onto a simple LOI ladder so the tracker can show
 * progress toward the QBE match.
 *
 * Stage IDs verified against GHL get-pipelines 2026-05-30 (location agzsSZWg…).
 */

export type LoiRung = 'target' | 'signed' | 'contract' | 'cash';
export type GoodsPipelineStream = 'commercial' | 'philanthropy' | 'demand' | 'production';

export const LOI_RUNGS: { key: LoiRung; label: string; desc: string }[] = [
  { key: 'target', label: 'Target', desc: 'In cultivation / proposal — no commitment yet' },
  {
    key: 'signed',
    label: 'Committed',
    desc: 'A firm commitment in GHL. NB: a GHL "Committed" stage is a pipeline status, not necessarily a signed LOI document — the match needs actual signed LOIs.',
  },
  { key: 'contract', label: 'Contracted / Delivering', desc: 'Agreement executed, delivery underway' },
  { key: 'cash', label: 'Cash / Stewarding', desc: 'Money in — Xero is the source of truth for the figure' },
];

export interface GoodsPipelineMeta {
  id: string;
  name: string;
  role: string;
  stream: GoodsPipelineStream;
}

/**
 * The three Goods pipelines the LOI tracker reads live.
 *
 * The On-Country Production scaffold is exported below, but intentionally not
 * included here until Ben creates the GHL shell and provides real UUIDs. That
 * pipeline is a capability/ownership journey, not a QBE match money ladder.
 */
export const GOODS_PIPELINES: GoodsPipelineMeta[] = [
  {
    id: 'UQsrmuqzxMSdCTklxEcG',
    name: 'Goods — Demand Register',
    role: 'Unworked demand signals (upstream of the LOI ladder)',
    stream: 'demand',
  },
  {
    id: 'FjMyJM3YzWQFmKqR9fur',
    name: 'Goods — Buyer Pipeline',
    role: 'Commercial bed sales',
    stream: 'commercial',
  },
  {
    id: 'JvBFYpVpyKsw899lkFgj',
    name: 'Goods Supporter Journey',
    role: 'All philanthropy — foundations, grants (tagged), major donors, capital (goods-capital tag)',
    stream: 'philanthropy',
  },
];

export type ProductionStageKey =
  | 'community-interest'
  | 'local-champions'
  | 'feasibility-fit'
  | 'capability-building'
  | 'facility-stand-up'
  | 'operating-goods-supported'
  | 'community-owned'
  | 'paused'
  | 'stood-down';

export interface ProductionStageMeta {
  key: ProductionStageKey;
  name: string;
  order: number;
  stageId: string;
  opportunityStatus: 'open' | 'won' | 'abandoned';
  role: string;
}

export const ON_COUNTRY_PRODUCTION_PIPELINE: GoodsPipelineMeta = {
  id: 'TODO_GHL_PIPELINE_ID_ON_COUNTRY_PRODUCTION',
  name: 'Goods — On-Country Production',
  role: 'Community-facility journey from interest to community-owned plant; capability pipeline, not LOI revenue',
  stream: 'production',
};

export const ON_COUNTRY_PRODUCTION_STAGES: ProductionStageMeta[] = [
  {
    key: 'community-interest',
    name: 'Community Interest',
    order: 1,
    stageId: 'TODO_GHL_STAGE_ID_COMMUNITY_INTEREST',
    opportunityStatus: 'open',
    role: 'A community has signalled it wants to explore making beds on country.',
  },
  {
    key: 'local-champions',
    name: 'Local Champions',
    order: 2,
    stageId: 'TODO_GHL_STAGE_ID_LOCAL_CHAMPIONS',
    opportunityStatus: 'open',
    role: 'Named local people are carrying the work on the ground.',
  },
  {
    key: 'feasibility-fit',
    name: 'Feasibility & Fit',
    order: 3,
    stageId: 'TODO_GHL_STAGE_ID_FEASIBILITY_FIT',
    opportunityStatus: 'open',
    role: 'Community and Goods are checking site, demand, governance, timing and feedstock fit.',
  },
  {
    key: 'capability-building',
    name: 'Capability Building',
    order: 4,
    stageId: 'TODO_GHL_STAGE_ID_CAPABILITY_BUILDING',
    opportunityStatus: 'open',
    role: 'Local crew are learning collect, shred, melt, press and assemble steps.',
  },
  {
    key: 'facility-stand-up',
    name: 'Facility Stand-Up',
    order: 5,
    stageId: 'TODO_GHL_STAGE_ID_FACILITY_STAND_UP',
    opportunityStatus: 'open',
    role: 'The plant is being installed or commissioned on country.',
  },
  {
    key: 'operating-goods-supported',
    name: 'Operating (Goods-supported)',
    order: 6,
    stageId: 'TODO_GHL_STAGE_ID_OPERATING_GOODS_SUPPORTED',
    opportunityStatus: 'open',
    role: 'The community is making beds on country with Goods support still available.',
  },
  {
    key: 'community-owned',
    name: 'Community-Owned',
    order: 7,
    stageId: 'TODO_GHL_STAGE_ID_COMMUNITY_OWNED',
    opportunityStatus: 'won',
    role: 'The community owns and runs the plant; Goods is support-on-request.',
  },
  {
    key: 'paused',
    name: 'Paused',
    order: 8,
    stageId: 'TODO_GHL_STAGE_ID_PAUSED',
    opportunityStatus: 'open',
    role: 'The relationship is active but on hold for a named reason.',
  },
  {
    key: 'stood-down',
    name: 'Stood Down',
    order: 9,
    stageId: 'TODO_GHL_STAGE_ID_STOOD_DOWN',
    opportunityStatus: 'abandoned',
    role: 'A respectful decision not to proceed; re-engagement starts a fresh opportunity.',
  },
];

export const ON_COUNTRY_PRODUCTION_STAGE_BY_KEY = Object.fromEntries(
  ON_COUNTRY_PRODUCTION_STAGES.map((stage) => [stage.key, stage]),
) as Record<ProductionStageKey, ProductionStageMeta>;

export const ON_COUNTRY_PRODUCTION_TAGS = {
  production: 'goods-production',
  champion: 'goods-prod-champion',
  trainee: 'goods-prod-trainee',
  skilled: 'goods-prod-skilled',
  owned: 'goods-prod-owned',
  communityControlled: 'goods-communitycontrolled',
} as const;

export const PIPELINE_BY_ID: Record<string, GoodsPipelineMeta> = Object.fromEntries(
  GOODS_PIPELINES.map((p) => [p.id, p]),
);

/**
 * GHL stageId -> LOI rung. Stages deliberately omitted (Lapsed, Declined/Parked,
 * Dormant) drop off the ladder. Demand Register stages map to "target" (they are
 * pre-commitment signals, shown for context).
 */
export const STAGE_TO_RUNG: Record<string, LoiRung> = {
  // Goods — Buyer Pipeline
  'e5220eb2-be40-4e79-9571-6acae12285c7': 'target', // Outreach Queued
  '1fd317ec-f8f1-4837-b324-e48c22956cdd': 'target', // First Contact
  '8da22920-c295-4358-be58-c4c69f372890': 'target', // In Conversation
  'c3e5e7c5-c5cf-4541-86ef-6eaf256aac54': 'target', // Qualified
  '27085dfa-23bf-4e6d-90ea-483bf44ab5b6': 'target', // Scoped
  'e23847c3-5f74-4da6-a907-6c3d6d45008c': 'target', // Proposed
  'a5222f0c-380b-4866-8cef-80cbae08189c': 'target', // Negotiating
  '809f1a7a-0082-40fc-8e78-b51bde71a741': 'signed', // Committed
  'dc6cf017-325a-4040-beb1-76f2cffba02c': 'contract', // In Delivery
  '80be941e-86b6-41d1-857f-7865f66692f7': 'contract', // Delivered
  '835065e8-c952-4cfe-9228-5e8625d100ae': 'contract', // Invoiced
  '0100d504-3108-415c-82fd-85a66192ef1c': 'cash', // Paid
  // Goods Supporter Journey
  'cf8d31d2-73be-4119-b56b-7b0334254197': 'target', // Identified
  'a84114da-8888-4357-a2df-01b29f37209d': 'target', // Qualified
  '524aca71-287d-4eeb-a53a-66ff3a7aede5': 'target', // Cultivating
  'a23b26b4-ace3-4199-8a14-b65ed888aa52': 'target', // Ask made
  'c6369cf9-80f6-4680-9249-acc1c861022d': 'signed', // Committed
  '15b7b876-16e3-4c57-84e6-7c09d703888e': 'contract', // Delivering
  '3e38f65b-a515-4e32-9fc9-57ea1531edc6': 'cash', // Stewarding / Reporting
  'ff90ea45-2196-4a7a-a311-8f27c3c7cda6': 'cash', // Renewing
  // Goods — Demand Register (pre-commitment, shown as target context)
  '0c5ed787-2015-4af0-b2ad-a916e40879db': 'target', // Signal
  '02502aa3-9a0d-4ddd-b1f0-c1e836838426': 'target', // Buyer Matched
  '13958a71-9f0e-468a-afc0-663c53d4220c': 'target', // Converted
};

/**
 * QBE Stage-2 match. CONTINGENT on raising eligible non-QBE capital FIRST, and
 * the cap + what counts as "eligible" are UNCONFIRMED (gated on founder decision).
 * Do not present the match as secured or quote a single cap externally.
 */
export const MATCH_TARGET = {
  indicativeLow: 200_000,
  indicativeHigh: 400_000,
  note: 'QBE Stage-2 match cap is UNCONFIRMED ($200K–$400K indicative) and contingent on eligible non-QBE capital raised first. Name the lanes + lock the figure once confirmed.',
};

/**
 * Where grants land. Grants are philanthropy → they belong in the Goods Supporter
 * Journey pipeline, tagged "grant" (a grant Awarded ≈ a Committed LOI). GHL's
 * standalone "Grants" pipeline is the legacy org-level board (merge target) — any
 * Goods grant still there should move into Supporter Journey so it shows here.
 */
export const GRANTS_ROUTING =
  'Grants are philanthropy: they belong in the Goods Supporter Journey pipeline, tagged "grant" (a grant Awarded ≈ a Committed LOI). The standalone "Grants" pipeline in GHL is the legacy org-level board (merge target) — any Goods grant still sitting there should move into Supporter Journey so it appears on this ladder.';
