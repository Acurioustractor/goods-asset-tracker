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
 *
 * ── REPOINTED 17 September 2026 ──────────────────────────────────────────────
 * Every audience here used to query a flat `goods-*` tag. The GHL account had
 * moved to the namespaced contract (see ./canonical-tags) and nobody repointed
 * this file, so all thirteen definitions resolved to between 0 and 9 contacts
 * against an account holding 580 Goods contacts. Measured that day:
 *
 *     goods-newsletter      8     comms:goods-newsletter   164
 *     audience-funder       0     role:funder               99
 *     goods-supplier        0     role:supplier             36
 *     goods-buyer-target    9     role:buyer                84
 *
 * Two things stop that happening again:
 *
 *  - `npm run audit:audiences` (scripts/ghl-audience-audit.mjs) prints the live
 *    count behind every definition below. Run it before trusting any of them.
 *  - `readiness` on each audience says whether it is expected to hold people
 *    yet, so an empty list reads as a known gap rather than a silent failure.
 *
 * SUPPRESSION: 109 contacts carried `comms:do-not-contact` and nothing excluded
 * them. SUPPRESSED_TAGS is now filtered out of every resolved audience.
 */

import type { LoiRung } from '@/lib/data/loi-pipeline';
import { GOODS_PIPELINES } from '@/lib/data/loi-pipeline';

/**
 * A contact carrying any of these is never in a resolved audience, whatever
 * else they are tagged. Checked in code as well as in the GHL smart-list recipe
 * so a hand-built list and an in-app preview cannot disagree.
 */
export const SUPPRESSED_TAGS = [
  'comms:do-not-contact',
  'comms:paused',
  'suppression:ghl-dnd',
  'consent:withdrawn',
] as const;

/** True when a contact's tags put them out of every audience. */
export function isSuppressed(tags: string[] | undefined | null): boolean {
  if (!tags?.length) return false;
  const lower = new Set(tags.map((t) => t.toLowerCase()));
  return SUPPRESSED_TAGS.some((t) => lower.has(t));
}

/** The clause to paste into any hand-built GHL smart list, so both agree. */
export const SUPPRESSION_RECIPE = `AND contact tag is none of: ${SUPPRESSED_TAGS.join(', ')}.`;

/**
 * Whether an audience is expected to hold people yet.
 *  - `live`          the tag is applied and the audience is real.
 *  - `needs-tagging` the tag exists in the contract but nothing applies it yet.
 *  - `needs-flow`    the audience fills from a flow nobody has used yet (the QR
 *                    claim has 0 claimed assets, so every claim list is empty).
 * An empty `live` audience is a bug. An empty `needs-*` audience is a to-do.
 */
export type AudienceReadiness = 'live' | 'needs-tagging' | 'needs-flow';

export interface SmartList {
  /** Stable identifier used in URLs and API calls */
  id: string;
  /** Friendly name shown in the picker */
  name: string;
  /** Short rationale shown beneath the name */
  description: string;
  /** Single GHL tag the contact must carry. (Multi-tag filters via custom endpoint later.) */
  tag: string;
  /** Whether this list is expected to hold anyone yet. See AudienceReadiness. */
  readiness: AudienceReadiness;
  /** When readiness is not 'live', what has to happen for it to fill. */
  blockedOn?: string;
  /** Suggested cap — UI warns if the actual count exceeds this */
  softCap: number;
  /** Hard cap — dispatch endpoint refuses sends larger than this */
  hardCap: number;
  /** Optional default message — staff edit before send */
  defaultMessageSeed?: string;
}

export const SMART_LISTS: SmartList[] = [
  {
    id: 'community-line',
    name: 'Community line (never auto-contacted)',
    description:
      'Everyone on the community relationship lane. Shown so you can SEE them and ring them. lane:community is never an automated audience (ruling R9), so this list exists to pick one person, not to send to all of them.',
    tag: 'lane:community',
    readiness: 'live',
    softCap: 1,
    hardCap: 1,
  },
  {
    id: 'washer-interest',
    name: 'Washing machine prospects',
    description: 'Registered interest in a Pakkimjalki Kari. Use for product update + waitlist comms.',
    tag: 'interest:washer',
    readiness: 'live',
    softCap: 50,
    hardCap: 200,
  },
  {
    id: 'storytellers',
    name: 'Storytellers',
    description:
      'People who have shared a story. Consent to tell a story is NOT consent to be messaged (ruling R11), so treat this as a list to pick from by hand.',
    tag: 'role:storyteller',
    readiness: 'live',
    softCap: 5,
    hardCap: 20,
  },
  {
    id: 'bed-recipients-consented',
    name: 'Bed recipients (consented to contact)',
    description:
      'Claimed a bed via QR and ticked "ok to contact". The highest-signal list for proactive check-ins, once anyone has claimed.',
    tag: 'interest:story-followup',
    readiness: 'needs-flow',
    blockedOn:
      'The QR claim flow has never been used: 0 rows in user_assets. Walk one community through /claim/<asset_id> first.',
    softCap: 100,
    hardCap: 250,
    defaultMessageSeed:
      'Hi from Goods on Country, just checking in on your bed. Reply YES if all good or tell us what is up. Stop to opt out.',
  },
  {
    id: 'bed-owners-claimed',
    name: 'Bed owners (claimed via QR)',
    description: 'Everyone who scanned a bed QR and claimed it with their phone.',
    tag: 'goods-claimed-bed',
    readiness: 'needs-flow',
    blockedOn: 'Nobody has claimed an asset yet (0 rows in user_assets).',
    softCap: 100,
    hardCap: 250,
  },
  {
    id: 'washer-owners',
    name: 'Washing machine owners',
    description: 'Households with a Pakkimjalki Kari deployed. Use for fleet check-ins.',
    tag: 'goods-claimed-washer',
    readiness: 'needs-flow',
    blockedOn: 'Nobody has claimed an asset yet (0 rows in user_assets).',
    softCap: 20,
    hardCap: 50,
  },
  {
    id: 'support-recent',
    name: 'Recent support contacts',
    description: 'Opened a support ticket. Use for "did your fix work?" follow-ups.',
    tag: 'interest:support',
    readiness: 'live',
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
  /** Whether this segment is expected to hold anyone yet. See AudienceReadiness. */
  readiness: AudienceReadiness;
  /** When readiness is not 'live', what has to happen for it to fill. */
  blockedOn?: string;
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
      'Funders who have committed or are giving, at the committed → delivering → stewarding rungs of GOODS - Funding. Steward them: show what the money did.',
    source: {
      kind: 'pipeline-stage',
      pipelineId: SUPPORTER_JOURNEY_PIPELINE_ID,
      rungs: ['signed', 'contract', 'cash'],
      alsoTag: 'role:funder',
    },
    ghlSmartListRecipe:
      'Opportunity in "GOODS - Funding" at stage Committed, Delivering, Stewarding / Reporting or Renewing, AND contact tag is role:funder. ' + SUPPRESSION_RECIPE,
    readiness: 'live',
    softCap: 40,
    hardCap: 120,
    recommendedReportId: 'funder-impact',
    campaignNote:
      'Stewardship cadence: a quarterly impact report + renewal/scale ask. Small, high-value list, so personalise where you can.',
  },
  {
    id: 'funder-prospect',
    name: 'Funders — prospect',
    supportLevel: 'In cultivation',
    description:
      'Funders being cultivated or asked but not yet committed: Identified, Qualified, Cultivating, Ask made. Use the impact report as the proof behind the ask.',
    source: {
      kind: 'pipeline-stage',
      pipelineId: SUPPORTER_JOURNEY_PIPELINE_ID,
      rungs: ['target'],
      alsoTag: 'role:funder',
    },
    ghlSmartListRecipe:
      'Opportunity in "GOODS - Funding" at stage Identified, Qualified, Cultivating or Ask made, AND contact tag is role:funder. ' + SUPPRESSION_RECIPE,
    readiness: 'live',
    softCap: 80,
    hardCap: 250,
    recommendedReportId: 'funder-impact',
    campaignNote:
      'Cultivation cadence: lead with the impact report as evidence, then the ask. The charity is The Butterfly Movement Ltd, trading as Goods on Country.',
  },
  {
    id: 'buyer',
    name: 'Buyers & procurement',
    supportLevel: 'Commercial pipeline',
    description:
      'Procurement orgs, housing bodies and government buyers in GOODS - Buyers. They underwrite spec, warranty and total cost of ownership.',
    source: {
      kind: 'pipeline-stage',
      pipelineId: BUYER_PIPELINE_ID,
      rungs: ['target', 'signed', 'contract', 'cash'],
      alsoTag: 'role:buyer',
    },
    ghlSmartListRecipe:
      'Opportunity in "GOODS - Buyers" (any active stage). Widen with contact tag role:buyer for prospects with no opportunity yet. ' + SUPPRESSION_RECIPE,
    readiness: 'live',
    softCap: 50,
    hardCap: 150,
    recommendedReportId: 'procurement-buyer',
    campaignNote:
      'Procurement cadence: the buyer brief + a delivered price. Keep it spec-first; stories are evidence of demand rather than the headline.',
  },
  {
    id: 'supplier',
    name: 'Suppliers (BOM / plant)',
    supportLevel: 'Supply partner',
    description:
      'Component and plant suppliers: HDPE, steel, canvas, fasteners, plastic-plant builders. Price, MOQ and lead time live in supplier-quotes.ts.',
    source: { kind: 'tag', tag: 'role:supplier' },
    ghlSmartListRecipe: 'Contact tag is role:supplier. ' + SUPPRESSION_RECIPE,
    readiness: 'live',
    softCap: 30,
    hardCap: 80,
    recommendedReportId: 'supply-partner',
    campaignNote:
      'Relationship cadence: the supply-partner brief + a volume forecast. Drives prioritisation and volume pricing.',
  },
  {
    id: 'partner',
    name: 'Partners',
    supportLevel: 'Delivery partner',
    description:
      'Organisations we deliver with: community orgs, health services, councils, land councils. The largest single audience in the account.',
    source: { kind: 'tag', tag: 'role:partner' },
    ghlSmartListRecipe: 'Contact tag is role:partner. ' + SUPPRESSION_RECIPE,
    readiness: 'live',
    softCap: 160,
    hardCap: 400,
    recommendedReportId: 'supply-partner',
    campaignNote:
      'Many of these people also sit on lane:community. The suppression filter does not catch that, so check the lane before any send: a community-line contact is never an automated audience (ruling R9).',
  },
  {
    id: 'media',
    name: 'Media',
    supportLevel: 'Press',
    description: 'Journalists and outlets who have asked for the media pack or covered Goods.',
    source: { kind: 'tag', tag: 'role:media' },
    ghlSmartListRecipe: 'Contact tag is role:media. ' + SUPPRESSION_RECIPE,
    readiness: 'live',
    softCap: 20,
    hardCap: 60,
    recommendedReportId: 'supporter-update',
    campaignNote: 'Pitch a story with a person and a place in it, not an announcement.',
  },
  {
    id: 'supporter',
    name: 'Supporters & donors',
    supportLevel: 'Community of support',
    description:
      'The newsletter list: everyone who ticked the explicit consent box. comms:goods-newsletter is the ONLY send-trigger tag and it is minted in one place (grantNewsletterComms in ./canonical-tags).',
    source: { kind: 'tag', tag: 'comms:goods-newsletter' },
    ghlSmartListRecipe:
      'Contact tag is comms:goods-newsletter. For the donor sub-segment, AND-in role:supporter. ' + SUPPRESSION_RECIPE,
    readiness: 'live',
    softCap: 800,
    hardCap: 3000,
    recommendedReportId: 'supporter-update',
    campaignNote:
      'Newsletter cadence: warm, story-first. Lead with a person. Ben ruled on 17 Sep 2026 that nothing goes to this list until there is something worth sending, and the first send needs a warmed dedicated domain.',
  },
  {
    id: 'vendor',
    name: 'Vendors (services / logistics)',
    supportLevel: 'Service partner',
    description:
      'Service, logistics, print and tech vendors who keep production moving (freight, IoT, tooling, design).',
    source: { kind: 'tag', tag: 'role:vendor' },
    ghlSmartListRecipe: 'Contact tag is role:vendor. ' + SUPPRESSION_RECIPE,
    readiness: 'needs-tagging',
    blockedOn:
      'role:vendor is on 0 contacts and the flat goods-vendor it replaced was also on 0. Nothing has ever tagged a vendor. Run the supplier/vendor sweep before using this.',
    softCap: 40,
    hardCap: 100,
    recommendedReportId: 'supply-partner',
    campaignNote: 'Lighter touch than suppliers: periodic update + forecasting where relevant.',
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
