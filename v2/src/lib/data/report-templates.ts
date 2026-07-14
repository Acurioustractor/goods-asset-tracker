/**
 * Audience-targeted impact-report templates (Workstream D).
 *
 * Reusable report shells that showcase live Empathy Ledger stories (Goods
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
   * impact-model.ts (health | environmental | economic | community-ownership |
   * production).
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
      'Health, environment and community-ownership outcomes from the beds and machines you helped fund.',
    intro:
      'This report leads with outcomes, not activity. It is built for foundations and impact investors — the people who want to see that capital converted into measurable change in remote communities, and a credible path to scale. Pair it with the LOI ladder when stewarding an active funder, or as the evidence pack when making an ask.',
    featuredDimensionIds: ['health', 'environmental', 'community-ownership'],
    featuredMetricIds: ['beds-delivered', 'plastic-diverted', 'communities-served', 'employment-hours'],
    storyTheme: 'impact',
    storyLimit: 4,
    proofPoints: [
      'Quality beds delivered into homes across remote communities — counted live from the asset register, not estimated.',
      'Recycled HDPE diverted from landfill per bed, addressing the documented waste cycle in remote towns.',
      'Community-led production and employment hours — the ownership model, not just the product.',
      'Every dollar traceable: figures reconcile to Xero, assets to the register, stories to consented storytellers.',
    ],
    callToAction: {
      label: 'Renew / scale the partnership',
      body: 'Talk to us about the next tranche, a multi-year commitment, or shaping the community-ownership transition together.',
    },
    audienceNotes:
      'Active funders (already giving): stewardship tone — "here is what your money did". Prospect funders (cultivating): pitch tone — "here is the proof, here is the ask". Same report, switch the opening line and the CTA emphasis. Never claim DGR is live for Goods (the Butterfly routing is FY2026-27).',
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
      'This brief is for procurement officers, housing bodies and government buyers. It leads with the things a buyer underwrites: product survival in the field, cost per unit at volume, delivery track record, and the Indigenous social-procurement pathway. Community stories are the proof the product is wanted and used, not the headline.',
    featuredDimensionIds: ['health', 'production', 'economic'],
    featuredMetricIds: ['product-survival-rate', 'beds-delivered', 'cost-per-unit', 'units-per-month'],
    storyTheme: 'testimonial',
    storyLimit: 3,
    proofPoints: [
      'Designed for remote conditions: washable canvas, recycled-HDPE legs, galvanised steel poles — 200 kg capacity, 5-year warranty, 10+ year design life.',
      'Field-proven survival rate tracked per asset via QR — you can see which beds are still in service.',
      'Cost per unit falls with volume; institutional pricing supports a real procurement line, not a one-off.',
      'Indigenous social-procurement pathway (Supply Nation / state preferences) — buying Goods counts toward your targets.',
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
      'This is the update for individual supporters, donors and the newsletter list. It is story-first and warm: real people, real homes, a number or two to show momentum, and an easy way to stay involved. Keep it human — the impact dashboard is one tap away for anyone who wants the detail.',
    featuredDimensionIds: ['environmental', 'health', 'community-ownership'],
    featuredMetricIds: ['beds-delivered', 'plastic-diverted', 'communities-served'],
    storyTheme: 'community',
    storyLimit: 5,
    proofPoints: [
      'Every bed is a better night’s sleep for a family in a remote community.',
      'Each bed keeps roughly 20 kg of plastic out of landfill and the desert.',
      'The work is community-led — local people make, deliver and own the production.',
    ],
    callToAction: {
      label: 'Sponsor a bed / share the story',
      body: 'Sponsor a bed for a family, or forward this to someone who would care. Small actions compound.',
    },
    audienceNotes:
      'Warm, grounded, community-first voice (brand voice rules). Lead with a person, not a metric. Centre Indigenous voices and agency. This serves the newsletter / sponsor audience — the broad supporter list.',
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
      'This brief is for supply partners — the HDPE, steel, canvas and fastener suppliers, and the service vendors behind production. It shows them the human outcome their components enable and the volume ramp ahead, so prioritising Goods (and sharpening pricing at scale) is an obvious call. It is a relationship and forecasting tool, not a fundraising ask.',
    featuredDimensionIds: ['production', 'environmental', 'community-ownership'],
    featuredMetricIds: ['units-per-month', 'plastic-diverted', 'local-feedstock-pct', 'employment-hours'],
    storyTheme: 'impact',
    storyLimit: 2,
    proofPoints: [
      'Your components end up in homes across remote communities — here is the outcome, not just the PO.',
      'Production is ramping: the unit-per-month trajectory means growing, repeatable volume.',
      'On-country manufacturing and local feedstock — a supply chain with a social and circular-economy story buyers value.',
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
