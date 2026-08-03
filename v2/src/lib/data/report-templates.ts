/**
 * Audience-targeted impact-report templates (Workstream D).
 *
 * Reusable report shells that present live Empathy Ledger stories (Goods
 * project `6bd47c8a-…`) + the canonical impact metrics, framed for a specific
 * audience. Each template is rendered by `/admin/reports/impact/[templateId]`
 * and is the CONTENT a staffer uses to build the matching GHL email campaign.
 *
 * These feed Workstream C: every `AUDIENCE_SEGMENT` in `ghl/smart-lists.ts`
 * names a `recommendedReportId` here, so the reach-out picker can say
 * "this segment → that report → build the GHL campaign".
 *
 * Numbers are NOT invented here — the renderer resolves `featuredMetricIds`
 * against `impact-model.ts` (the canonical, quarantined source). Stories come
 * live + consent-filtered from Empathy Ledger.
 */

export type ReportAudience = 'funder' | 'procurement' | 'supporter' | 'supply-partner';

export interface ImpactReportTemplate {
  /** Stable id — used in the URL and referenced by smart-list segments. */
  id: string;
  audience: ReportAudience;
  /** Friendly name shown in the picker + page title. */
  name: string;
  /** Hero line. */
  headline: string;
  /** One-sentence subhead under the headline. */
  subhead: string;
  /** Audience-specific framing paragraph that opens the report. */
  intro: string;
  /**
   * Impact dimensions to feature, in order. Ids from IMPACT_DIMENSIONS in
   * impact-model.ts (rest-health | dignity-safety | self-determination |
   * jobs-ownership | circular-economy).
   */
  featuredDimensionIds: string[];
  /**
   * Headline metric ids to pull to the top of the report. Ids from the metrics
   * inside IMPACT_DIMENSIONS (e.g. beds-delivered, plastic-diverted).
   */
  featuredMetricIds: string[];
  /** Theme passed to empathyLedger.getStories() to select on-message stories. */
  storyTheme?: string;
  /** How many EL stories to show. */
  storyLimit: number;
  /** 3–5 proof points tuned to what this audience cares about. */
  proofPoints: string[];
  /** The single ask the report drives toward. */
  callToAction: { label: string; body: string };
  /** Voice/framing guidance for the staffer adapting it into a GHL campaign. */
  audienceNotes: string;
  /** C segment ids this report serves. */
  servesSegments: string[];
}

export const IMPACT_REPORT_TEMPLATES: ImpactReportTemplate[] = [
  {
    id: 'funder-impact',
    audience: 'funder',
    name: 'Funder impact report',
    headline: 'What your investment is doing on country',
    subhead:
      'Current delivery, circular-economy and community-pathway evidence from the beds and machines you helped fund.',
    intro:
      'This report separates what has been delivered, what communities have said, what is modelled and what remains a future outcome. It is built for foundations and impact investors who need current evidence, its limits and the next decision the work is intended to support.',
    featuredDimensionIds: ['rest-health', 'circular-economy', 'jobs-ownership'],
    featuredMetricIds: ['beds-delivered', 'plastic-diverted', 'communities-served', 'employment-hours'],
    storyTheme: 'impact',
    storyLimit: 4,
    proofPoints: [
      'Quality beds delivered into homes across remote communities — counted live from the asset register, not estimated.',
      'Recycled HDPE in each Stretch Bed is reported as a modelled diversion figure until production batches are weighed.',
      'The community pathway tracks movement toward local making and ownership without claiming the transfer is complete.',
      'Figures resolve to canonical Goods sources and voices are limited to consent-cleared Empathy Ledger material.',
    ],
    callToAction: {
      label: 'Renew / scale the partnership',
      body: 'Talk to us about the next tranche, a multi-year commitment, or supporting the next measured community pathway step.',
    },
    audienceNotes:
      'Active funders: stewardship tone, with current evidence and limitations. Prospect funders: evidence and next-step tone. Never present targets as current, the ownership pathway as complete, or a health rationale as a measured health outcome.',
    servesSegments: ['funder-active', 'funder-prospect'],
  },
  {
    id: 'procurement-buyer',
    audience: 'procurement',
    name: 'Procurement & buyer brief',
    headline: 'A bed built for remote conditions — and the numbers behind it',
    subhead:
      'Durability, total cost of ownership, and the social-procurement pathway for housing bodies and government buyers.',
    intro:
      'This brief is for procurement officers, housing bodies and government buyers. It leads with product specification, measured delivery, the current cost model and the evidence still required on survival and sustained production. Community stories provide approved context about fit and demand.',
    featuredDimensionIds: ['rest-health', 'dignity-safety', 'circular-economy'],
    featuredMetricIds: ['product-survival-rate', 'beds-delivered', 'cost-per-unit', 'units-per-month'],
    storyTheme: 'testimonial',
    storyLimit: 3,
    proofPoints: [
      'Designed for remote conditions: washable canvas, recycled-HDPE legs and galvanised steel poles, with product specifications separated from field evidence.',
      'Asset and QR records provide the foundation for survival tracking; longitudinal survival is not yet field-proven.',
      'Cost per unit falls with volume; institutional pricing supports a real procurement line, not a one-off.',
      'The community-production pathway may support future Indigenous procurement, subject to the seller and ownership structure actually meeting the relevant rules.',
    ],
    callToAction: {
      label: 'Scope an order',
      body: 'Tell us community count and bed numbers and we will return a delivered-price quote and a delivery timeline.',
    },
    audienceNotes:
      'Buyers want certainty, not charity. Lead with spec, warranty and TCO. Keep stories short and use them as evidence of demand/fit. This is the report behind the Buyer Pipeline.',
    servesSegments: ['buyer'],
  },
  {
    id: 'supporter-update',
    audience: 'supporter',
    name: 'Supporter update',
    headline: 'Beds in homes, plastic out of landfill — thanks to you',
    subhead: 'A warm, story-first update for the people who back Goods on Country.',
    intro:
      'This is the update for individual supporters, donors and the newsletter list. It is story-first and warm: approved community voices, current delivery evidence and a clear account of what Goods is still learning.',
    featuredDimensionIds: ['rest-health', 'circular-economy', 'jobs-ownership'],
    featuredMetricIds: ['beds-delivered', 'plastic-diverted', 'communities-served'],
    storyTheme: 'community',
    storyLimit: 5,
    proofPoints: [
      'Each delivered bed is counted as essential-goods infrastructure, not as a measured sleep or health outcome.',
      'Each Stretch Bed contains 20kg of recycled HDPE; diversion remains modelled until inputs and outputs are weighed by production batch.',
      'Communities shape the work and select pathways that can move local making, decisions and ownership closer to community control.',
    ],
    callToAction: {
      label: 'Sponsor a bed / share the story',
      body: 'Sponsor a bed for a family, or forward this to someone who would care. Small actions compound.',
    },
    audienceNotes:
      'Warm, grounded, community-first voice. Lead with an approved person and context, not an unsupported outcome. Keep current, modelled and future evidence visibly separate.',
    servesSegments: ['supporter'],
  },
  {
    id: 'supply-partner',
    audience: 'supply-partner',
    name: 'Supply-partner brief',
    headline: 'The impact your components enable — and the ramp ahead',
    subhead:
      'For the suppliers and vendors who make Goods possible: where the parts go, and the production scale-up coming.',
    intro:
      'This brief is for the HDPE, steel, canvas and fastener suppliers and service vendors behind production. It shows where components go, the current production evidence and what remains modelled in the expected ramp.',
    featuredDimensionIds: ['circular-economy', 'jobs-ownership', 'dignity-safety'],
    featuredMetricIds: ['units-per-month', 'plastic-diverted', 'local-feedstock-pct', 'employment-hours'],
    storyTheme: 'impact',
    storyLimit: 2,
    proofPoints: [
      'Your components are recorded in products delivered to remote communities, with the operational evidence kept separate from community outcomes.',
      'Future production volume is a target until sustained runs establish a measured trajectory.',
      'On-Country production and local feedstock are pathway goals whose progress is reported with evidence and confidence labels.',
    ],
    callToAction: {
      label: 'Lock in volume pricing',
      body: 'Let us forecast together for the ramp and agree volume pricing / lead times so we can both plan.',
    },
    audienceNotes:
      'Practical and forward-looking. Suppliers care about volume, reliability and lead time — frame impact as the reason the volume is real and growing. Detail on parts/MOQ/lead time lives in supplier-quotes.ts; this is the relationship layer.',
    servesSegments: ['supplier', 'vendor'],
  },
];

export function findReportTemplate(id: string): ImpactReportTemplate | undefined {
  return IMPACT_REPORT_TEMPLATES.find((t) => t.id === id);
}

export const AUDIENCE_LABELS: Record<ReportAudience, string> = {
  funder: 'Funders',
  procurement: 'Procurement & buyers',
  supporter: 'Supporters & donors',
  'supply-partner': 'Suppliers & vendors',
};
