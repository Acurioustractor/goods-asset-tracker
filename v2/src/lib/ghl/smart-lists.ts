/**
 * Curated GHL smart lists for the admin reach-out tool.
 *
 * Two distinct things live here:
 *
 *  1. SMART_LISTS — SMS lists. Each maps a friendly name onto a single tag GHL
 *     filters on, and the in-app reach-out tool sends an SMS directly. The tag
 *     MUST be one we actually apply (forms, claims, sweeps) or the list is empty.
 *
 *  2. AUDIENCE_SEGMENTS — "level of support" segments for EMAIL campaigns. These
 *     are DEFINITIONS ONLY: each names the GHL tag/pipeline-stage that defines the
 *     audience + the recipe to build the smart list in GHL. The send happens in a
 *     GHL email campaign — the app never emails these people. (Ben, 2026-05-30:
 *     "GHL owns the send; code only defines the segments.") This keeps the
 *     high-value funder/buyer/supplier lists off the in-app SMS blast path.
 *
 * Add lists/segments conservatively. Each one is another way to accidentally
 * blast hundreds of contacts; keep it intentional and capped.
 */

import type { LoiRung } from '@/lib/data/loi-pipeline';
import { GOODS_PIPELINES, ON_COUNTRY_PRODUCTION_TAGS } from '@/lib/data/loi-pipeline';

export interface SmartList {
  /** Stable identifier used in URLs and API calls */
  id: string;
  /** Friendly name shown in the picker */
  name: string;
  /** Short rationale shown beneath the name */
  description: string;
  /** Single GHL tag the contact must carry. (Multi-tag filters via custom endpoint later.) */
  tag: string;
  /** Suggested cap — UI warns if the actual count exceeds this */
  softCap: number;
  /** Hard cap — dispatch endpoint refuses sends larger than this */
  hardCap: number;
  /** Optional default message — staff edit before send */
  defaultMessageSeed?: string;
}

export const SMART_LISTS: SmartList[] = [
  {
    id: 'bed-recipients-consented',
    name: 'Bed recipients (consented to contact)',
    description:
      'People who claimed a bed via QR and ticked "ok to contact". Highest-signal list for proactive check-ins.',
    tag: 'goods-consent-to-contact',
    softCap: 100,
    hardCap: 250,
    defaultMessageSeed:
      'Hi from Goods on Country, just checking in on your bed. Reply YES if all good or tell us what is up. Stop to opt out.',
  },
  {
    id: 'bed-owners-claimed',
    name: 'Bed owners — claimed via QR',
    description: 'Everyone who scanned a bed QR and claimed it with their phone.',
    tag: 'goods-claimed-bed',
    softCap: 100,
    hardCap: 250,
  },
  {
    id: 'washer-owners',
    name: 'Washing machine owners',
    description: '14 households with a Pakkimjalki Kari deployed. Use for fleet check-ins.',
    tag: 'goods-claimed-washer',
    softCap: 20,
    hardCap: 50,
  },
  {
    id: 'washer-interest',
    name: 'Washing machine prospects',
    description: 'Submitted "Register Interest" on the washing machine page. Use for product update + waitlist comms.',
    tag: 'goods-washer-interest',
    softCap: 50,
    hardCap: 200,
  },
  {
    id: 'bed-buyers',
    name: 'Stretch Bed buyers (Stripe)',
    description:
      'People who paid for a bed via stripe. Use sparingly — they bought, not granted permission to be texted.',
    tag: 'goods-bed-owner',
    softCap: 50,
    hardCap: 200,
  },
  {
    id: 'story-submitters-consented',
    name: 'Story submitters (consented)',
    description: 'Shared a story or photo and ticked "ok to contact". Good for follow-up + thanks.',
    tag: 'goods-story-submitter',
    softCap: 50,
    hardCap: 100,
  },
  {
    id: 'support-recent',
    name: 'Recent support contacts',
    description: 'Opened a support ticket in the last while. Use for "did your fix work?" follow-ups.',
    tag: 'goods-support-request',
    softCap: 30,
    hardCap: 80,
  },
];

export function findSmartList(id: string): SmartList | undefined {
  return SMART_LISTS.find((l) => l.id === id);
}

// ============================================================================
// AUDIENCE SEGMENTS — level-of-support segments for GHL email campaigns.
// Definitions only. No in-app send: GHL owns the send.
// ============================================================================

const SUPPORTER_JOURNEY_PIPELINE_ID =
  GOODS_PIPELINES.find((p) => p.stream === 'philanthropy')?.id ?? '';
const BUYER_PIPELINE_ID = GOODS_PIPELINES.find((p) => p.stream === 'commercial')?.id ?? '';

/**
 * How GHL computes membership for a segment.
 *  - `tag`: contacts carrying a single tag (resolvable live via findContactsByTag).
 *  - `pipeline-stage`: contacts with an open opportunity in a pipeline at one of
 *    the given LOI rungs (resolved live via the loi-pipeline stage map). `alsoTag`
 *    documents an extra tag the GHL smart list should AND-in (e.g. audience-funder);
 *    the in-app count can't intersect tags onto opps, so it counts opps at the rung
 *    and the recipe spells out the tag condition to add in GHL.
 */
export type SegmentSource =
  | { kind: 'tag'; tag: string }
  | { kind: 'pipeline-stage'; pipelineId: string; rungs: LoiRung[]; alsoTag?: string };

export interface AudienceSegment {
  /** Stable id used in URLs + the reach-out picker. */
  id: string;
  /** Friendly name shown in the picker. */
  name: string;
  /** Where this audience sits on the level-of-support ladder. */
  supportLevel: string;
  /** Who is in this segment + why you'd email them. */
  description: string;
  /** How membership is computed (tag or pipeline-stage). */
  source: SegmentSource;
  /** The exact filter to build the matching smart list in the GHL UI. */
  ghlSmartListRecipe: string;
  /** Advisory cap — UI warns when the live count exceeds this. */
  softCap: number;
  /** Hard cap — a reminder of the largest campaign this segment should drive. */
  hardCap: number;
  /** The impact-report template that fits this audience (report-templates.ts). */
  recommendedReportId: string;
  /** What kind of GHL campaign to attach + cadence guidance. */
  campaignNote: string;
}

export const AUDIENCE_SEGMENTS: AudienceSegment[] = [
  {
    id: 'funder-active',
    name: 'Funders — active',
    supportLevel: 'Committed / giving',
    description:
      'Funders who have committed or are giving — sitting at the committed → delivering → cash/stewarding rungs of the Supporter Journey. Steward them: show what the money did.',
    source: {
      kind: 'pipeline-stage',
      pipelineId: SUPPORTER_JOURNEY_PIPELINE_ID,
      rungs: ['signed', 'contract', 'cash'],
      alsoTag: 'audience-funder',
    },
    ghlSmartListRecipe:
      'Opportunity in "Goods Supporter Journey" at stage Committed, Delivering, Stewarding/Reporting or Renewing — AND contact tag is audience-funder.',
    softCap: 40,
    hardCap: 120,
    recommendedReportId: 'funder-impact',
    campaignNote:
      'Stewardship cadence: a quarterly impact report + renewal/scale ask. Small, high-value list — personalise where you can.',
  },
  {
    id: 'funder-prospect',
    name: 'Funders — prospect',
    supportLevel: 'In cultivation',
    description:
      'Funders being cultivated or asked but not yet committed — the target rung of the Supporter Journey (Identified, Qualified, Cultivating, Ask made). Use the impact report as the proof behind the ask.',
    source: {
      kind: 'pipeline-stage',
      pipelineId: SUPPORTER_JOURNEY_PIPELINE_ID,
      rungs: ['target'],
      alsoTag: 'audience-funder',
    },
    ghlSmartListRecipe:
      'Opportunity in "Goods Supporter Journey" at stage Identified, Qualified, Cultivating or Ask made — AND contact tag is audience-funder.',
    softCap: 80,
    hardCap: 250,
    recommendedReportId: 'funder-impact',
    campaignNote:
      'Cultivation cadence: lead with the impact report as evidence, then the ask. Never claim DGR is live for Goods (Butterfly routing is FY2026-27).',
  },
  {
    id: 'buyer',
    name: 'Buyers & procurement',
    supportLevel: 'Commercial pipeline',
    description:
      'Procurement orgs, housing bodies and government buyers in the Goods Buyer Pipeline. They underwrite spec, warranty and total cost of ownership — not charity.',
    source: {
      kind: 'pipeline-stage',
      pipelineId: BUYER_PIPELINE_ID,
      rungs: ['target', 'signed', 'contract', 'cash'],
    },
    ghlSmartListRecipe:
      'Opportunity in "Goods — Buyer Pipeline" (any active stage). Grantscope-sourced buyer prospects also carry the goods-buyer-target tag if you want to widen the net.',
    softCap: 50,
    hardCap: 150,
    recommendedReportId: 'procurement-buyer',
    campaignNote:
      'Procurement cadence: the buyer brief + a delivered-price offer. Keep it spec-first; stories are evidence of demand, not the headline.',
  },
  {
    id: 'supplier',
    name: 'Suppliers (BOM / plant)',
    supportLevel: 'Supply partner',
    description:
      'Component and plant suppliers — HDPE, steel, canvas, fasteners, plastic-plant builders. The emailable current-supplier list. Detail (price, MOQ, lead time) lives in supplier-quotes.ts.',
    source: { kind: 'tag', tag: 'goods-supplier' },
    ghlSmartListRecipe: 'Contact tag is goods-supplier (optionally goods-supplier-active for current only).',
    softCap: 30,
    hardCap: 80,
    recommendedReportId: 'supply-partner',
    campaignNote:
      'Relationship cadence: the supply-partner brief + a volume forecast. Drives prioritisation and volume pricing, not fundraising.',
  },
  {
    id: 'community-makers',
    name: 'Community makers',
    supportLevel: 'On-country capability',
    description:
      'Local champions in the On-Country Production journey. This is a small relationship and capability list, not a marketing audience.',
    source: { kind: 'tag', tag: ON_COUNTRY_PRODUCTION_TAGS.champion },
    ghlSmartListRecipe:
      'Contact tag is goods-prod-champion. Only widen to goods-prod-trainee when the campaign is deliberately about training support.',
    softCap: 30,
    hardCap: 80,
    recommendedReportId: 'supply-partner',
    campaignNote:
      'Relationship + capability cadence: celebrate milestones, share know-how, and keep it personal. Never blast this list.',
  },
  {
    id: 'vendor',
    name: 'Vendors (services / logistics)',
    supportLevel: 'Service partner',
    description:
      'Service, logistics, print and tech vendors who keep production moving (freight, IoT, tooling, design). Tagged goods-vendor in the supplier/vendor sweep.',
    source: { kind: 'tag', tag: 'goods-vendor' },
    ghlSmartListRecipe: 'Contact tag is goods-vendor (sub-tags: vendor-freight, vendor-tech, vendor-print, vendor-services).',
    softCap: 40,
    hardCap: 100,
    recommendedReportId: 'supply-partner',
    campaignNote:
      'Lighter touch than suppliers — periodic update + forecasting where relevant. Same supply-partner report works.',
  },
  {
    id: 'supporter',
    name: 'Supporters & donors',
    supportLevel: 'Community of support',
    description:
      'Individual supporters and the newsletter list — the broad warm audience. Donors who sponsored a bed also carry goods-sponsor.',
    source: { kind: 'tag', tag: 'goods-newsletter' },
    ghlSmartListRecipe:
      'Contact tag is goods-newsletter (the supporter/subscriber list). For the donor sub-segment, AND-in goods-sponsor.',
    softCap: 800,
    hardCap: 3000,
    recommendedReportId: 'supporter-update',
    campaignNote:
      'Newsletter cadence: warm, story-first supporter update. Lead with a person, not a metric. This is the big list — respect opt-outs.',
  },
];

export function findAudienceSegment(id: string): AudienceSegment | undefined {
  return AUDIENCE_SEGMENTS.find((s) => s.id === id);
}

/** The defining tag for a segment, if it is tag-based (else null). */
export function segmentTag(segment: AudienceSegment): string | null {
  return segment.source.kind === 'tag' ? segment.source.tag : null;
}

/**
 * SMS cost guidance — used in the confirm UI.
 * Twilio/GHL bills AU$0.05 per 160-char segment on AU mobile.
 */
export function estimateSegments(message: string): number {
  if (!message) return 0;
  return Math.ceil(message.length / 160);
}

export function estimateCostCents(message: string, recipientCount: number): number {
  const segments = estimateSegments(message);
  // 5 cents per segment per recipient
  return segments * 5 * recipientCount;
}
