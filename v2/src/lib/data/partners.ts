/**
 * Partner registry. Every funder/partner that gets a templated outcomes report
 * lives here. The /partners/[slug]/outcomes route reads this config and joins it
 * to the live community_rollup view, so KPIs auto-refresh as deliveries land.
 *
 * Adding a new partner = adding one entry below. No new route, no new HTML/PDF.
 */

export type PartnerThemeId =
  | 'practical-need'
  | 'circular-value'
  | 'youth-pathway'
  | 'local-production'
  | 'health-comfort';

export type PartnerTheme = {
  id: PartnerThemeId;
  label: string;
  body: string;
};

export type PartnerMeasurementRow = {
  label: string;
  body: string;
};

export type PartnerPhoto = {
  src: string;
  alt: string;
};

export type PartnerQuote = {
  text: string;
  cite: string;
};

export type PartnerMetricFallback = {
  /** Used when no community_id in partner.communityIds matches a community_rollup row. */
  bedsDelivered: number;
  /** Floor figure for direct-people-supported when household_size data is sparse. */
  directPeopleFloor: number;
  /** Optional sentence under the next-round KPI. */
  nextRoundCount: number;
  nextRoundNote?: string;
};

export type Partner = {
  slug: string;
  name: string;
  shortName?: string;
  logoSrc: string;
  websiteUrl: string;
  region: string;
  /**
   * canonical community IDs in the communities table that this partner has funded.
   * Used to join community_rollup → partner outcomes.
   */
  communityIds: string[];
  hero: {
    eyebrow: string;
    title: string;
    summary: string;
    imageSrc: string;
    imageAlt: string;
  };
  fallbackMetrics: PartnerMetricFallback;
  themes: PartnerTheme[];
  measurement: PartnerMeasurementRow[];
  quote?: PartnerQuote;
  evidencePhotos: PartnerPhoto[];
  acknowledgement: string;
  /** Where in the funder lifecycle this partner sits. Drives copy nuance. */
  stage: 'first-delivery' | 'next-round' | 'multi-round' | 'exploring';
  /** Optional override colour for the H1 + KPI accents. Defaults to rust. */
  accent?: string;
};

export const PARTNER_ACCENTS = {
  rust: '#bf5738',
  green: '#667b4d',
  blue: '#496f84',
  ochre: '#d8a25f',
  ochreDeep: '#8d6735',
} as const;

const CENTRECORP: Partner = {
  slug: 'centrecorp',
  name: 'Centrecorp Foundation',
  shortName: 'Centrecorp',
  logoSrc: '/images/partners/centrecorp-foundation.jpg',
  websiteUrl: 'https://www.centrecorpfoundation.com.au/',
  region: 'Central Australia',
  communityIds: ['utopia-homelands', 'utopia', 'alparra', 'ampilatwatja', 'antarrengeny'],
  stage: 'next-round',
  accent: PARTNER_ACCENTS.rust,
  hero: {
    eyebrow: 'Outcomes snapshot / May 2026',
    title: 'Utopia Homelands\nBed Delivery',
    summary:
      'Centrecorp Foundation support helped Goods on Country and A Curious Tractor move practical bed infrastructure into the Utopia Homelands with Oonchiumpa, creating the first evidence base for the next Stretch Bed delivery, household follow-up and consent-checked stories.',
    imageSrc: '/images/partners/centrecorp/utopia/hero-elder-bed.jpg',
    imageAlt: 'Two respected Elders sitting on a newly delivered bed at Utopia Homelands.',
  },
  fallbackMetrics: {
    bedsDelivered: 60,
    directPeopleFloor: 60,
    nextRoundCount: 107,
    nextRoundNote:
      'Next round measures household reach, product use and local production roles.',
  },
  themes: [
    {
      id: 'practical-need',
      label: 'Practical need',
      body: 'Beds off the ground, safer rest and household infrastructure families can actually use.',
    },
    {
      id: 'circular-value',
      label: 'Circular value',
      body: 'Community feedback connects recycled plastic with a product that is useful and durable.',
    },
    {
      id: 'youth-pathway',
      label: 'Youth pathway',
      body: 'Building beds can become structured skills, pride, training hours and production roles.',
    },
    {
      id: 'local-production',
      label: 'Local production',
      body: 'Next step links delivery demand to Oonchiumpa and Central Australia production capability.',
    },
  ],
  measurement: [
    {
      label: 'Household benefit',
      body: 'Final bed count, household reach, direct people supported and follow-up needs.',
    },
    {
      label: 'Health and comfort',
      body: 'Comfort, back pain, sleep, off-ground safety and whether the bed is still in use.',
    },
    {
      label: 'Circular economy',
      body: 'Recycled HDPE per bed, local feedstock potential, repairability and product lifespan.',
    },
    {
      label: 'Voice and consent',
      body: 'Three to five approved family, Elder, Oonchiumpa and delivery-partner voices.',
    },
    {
      label: 'Production pathway',
      body: 'Youth training hours, assembly time, local roles, facility readiness and maintenance.',
    },
  ],
  quote: {
    text: 'Since receiving their new beds, they are no longer experiencing back pains.',
    cite: 'Oonchiumpa Good News Story. Feedback from respected Elders Frankie Holmes and Mr Donald Thompson OAM, Ampilatwatja.',
  },
  evidencePhotos: [
    {
      src: '/images/partners/centrecorp/utopia/delivery-court.jpg',
      alt: 'Beds and parts staged under a shaded court at Utopia Homelands.',
    },
    {
      src: '/images/partners/centrecorp/utopia/community-build.jpg',
      alt: 'Community members assembling a bed base under trees.',
    },
    {
      src: '/images/partners/centrecorp/utopia/final-assembly.jpg',
      alt: 'A finished Stretch Bed in place at the end of the build.',
    },
  ],
  acknowledgement:
    'Prepared for Centrecorp Foundation by Goods on Country, A Curious Tractor and Oonchiumpa Consultancy and Services.',
};

export const PARTNERS: Record<string, Partner> = {
  centrecorp: CENTRECORP,
};

export function getPartner(slug: string): Partner | null {
  return PARTNERS[slug] ?? null;
}

export function allPartnerSlugs(): string[] {
  return Object.keys(PARTNERS);
}

/**
 * Compute the four headline KPIs for a partner from the live community_rollup
 * read, falling back to the partner's committed numbers when the rollup is empty
 * (e.g. before backfill, or for outstations not yet seeded).
 */
export type CommunityRollupRow = {
  id: string;
  name: string;
  deployed_beds: number | null;
  ready_beds: number | null;
  allocated_beds: number | null;
  requested_beds: number | null;
  household_reach?: number | null;
  households_with_consent?: number | null;
  open_demand_qty?: number | null;
};

export type PartnerOutcomes = {
  partner: Partner;
  matchedCommunities: CommunityRollupRow[];
  bedsDelivered: number;
  bedsDeliveredSource: 'live' | 'fallback';
  directPeople: { display: string; source: 'live' | 'fallback'; floor: boolean };
  nextRound: number;
  nextRoundSource: 'live' | 'fallback';
  setupTime: string;
};

export function computePartnerOutcomes(
  partner: Partner,
  rollup: CommunityRollupRow[],
): PartnerOutcomes {
  const matched = rollup.filter((r) => partner.communityIds.includes(r.id));

  const liveDelivered = matched.reduce((s, r) => s + (r.deployed_beds || 0), 0);
  const liveReady = matched.reduce((s, r) => s + (r.ready_beds || 0), 0);
  const liveAllocated = matched.reduce((s, r) => s + (r.allocated_beds || 0), 0);
  const liveReach = matched.reduce((s, r) => s + (r.household_reach || 0), 0);

  const bedsDelivered = liveDelivered > 0 ? liveDelivered : partner.fallbackMetrics.bedsDelivered;
  const bedsDeliveredSource: 'live' | 'fallback' = liveDelivered > 0 ? 'live' : 'fallback';

  const nextRoundLive = liveReady + liveAllocated;
  const nextRound = nextRoundLive > 0 ? nextRoundLive : partner.fallbackMetrics.nextRoundCount;
  const nextRoundSource: 'live' | 'fallback' = nextRoundLive > 0 ? 'live' : 'fallback';

  let directPeopleDisplay: string;
  let directPeopleSource: 'live' | 'fallback';
  let directPeopleFloor: boolean;
  if (liveReach > 0) {
    directPeopleDisplay = String(liveReach);
    directPeopleSource = 'live';
    directPeopleFloor = false;
  } else {
    directPeopleDisplay = `${partner.fallbackMetrics.directPeopleFloor}+`;
    directPeopleSource = 'fallback';
    directPeopleFloor = true;
  }

  return {
    partner,
    matchedCommunities: matched,
    bedsDelivered,
    bedsDeliveredSource,
    directPeople: {
      display: directPeopleDisplay,
      source: directPeopleSource,
      floor: directPeopleFloor,
    },
    nextRound,
    nextRoundSource,
    setupTime: '~5 min',
  };
}
