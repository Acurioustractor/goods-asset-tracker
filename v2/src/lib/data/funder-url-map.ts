// Per-funder URL recommendations: which goodsoncountry.com page to send to which funder.
// Canonical source. Mirrored to wiki/articles/brand-comms/05-pipelines-x-brand.md.
// When you add a new funder to the outreach pipeline, add the recommendation here first.

export type FunderType =
  | 'foundation-generalist'
  | 'foundation-health'
  | 'foundation-place-based'
  | 'foundation-first-nations'
  | 'foundation-climate'
  | 'foundation-corporate'
  | 'investor-catalytic'
  | 'investor-impact'
  | 'investor-blended'
  | 'procurement-health'
  | 'procurement-housing'
  | 'procurement-school'
  | 'procurement-government'
  | 'community-partner';

export type GoodsUrl =
  | '/'
  | '/about'
  | '/impact'
  | '/communities'
  | '/process'
  | '/stories'
  | '/shop/stretch-bed-single'
  | '/insiders'
  | '/insiders/capital'
  | '/decks/live-session-deck.html';

export type StorytellerKey =
  | 'dianne-stokes'
  | 'norman-frank'
  | 'linda-turner'
  | 'patricia-frank'
  | 'cliff-plummer'
  | 'ivy'
  | 'alfred-johnson'
  | 'brian-russell'
  | 'zelda-hogan'
  | 'jessica-allardyce';

export interface FunderUrlEntry {
  /** Display name as used in correspondence */
  funder: string;
  /** Type categorisation (drives default URL choice) */
  type: FunderType;
  /** Primary URL to include in first contact */
  primaryUrl: GoodsUrl | string;
  /** Optional secondary URL for follow-up or proposal stage */
  secondaryUrl?: GoodsUrl | string;
  /** Storyteller key whose quote best resonates with this funder */
  recommendedVoice?: StorytellerKey;
  /** Why this funder gets this URL (for the human drafter) */
  rationale: string;
  /** Whether the relationship is direct (no URL needed in early contact) */
  directOnly?: boolean;
}

/**
 * Map of named funders to their recommended outreach materials.
 * Pulled from wiki/articles/brand-comms/05-pipelines-x-brand.md.
 * Update both when a funder strategy changes.
 */
export const FUNDER_URL_MAP: Record<string, FunderUrlEntry> = {
  'snow-foundation': {
    funder: 'Snow Foundation',
    type: 'foundation-health',
    primaryUrl: '/impact',
    secondaryUrl: '/insiders',
    recommendedVoice: 'jessica-allardyce',
    rationale: 'Already a major partner. Show progress not pitch. Health-focused. Lead with scabies-RHD pathway.',
  },
  'vincent-fairfax-family-foundation': {
    funder: 'Vincent Fairfax Family Foundation',
    type: 'foundation-place-based',
    primaryUrl: '/communities',
    recommendedVoice: 'dianne-stokes',
    rationale: 'Place-based focus, NT/QLD priority. Show on-ground deployment in named communities.',
  },
  'tim-fairfax-family-foundation': {
    funder: 'Tim Fairfax Family Foundation',
    type: 'foundation-place-based',
    primaryUrl: '/communities',
    recommendedVoice: 'ivy',
    rationale: 'Geographic alignment with Far North QLD priorities. Palm Island stories resonate.',
  },
  'paul-ramsay-foundation': {
    funder: 'Paul Ramsay Foundation',
    type: 'foundation-health',
    primaryUrl: '/impact',
    recommendedVoice: 'jessica-allardyce',
    rationale: 'Health and wellbeing strategic priority. The cardiac prevention frame lands.',
  },
  'frrr': {
    funder: 'Foundation for Rural and Regional Renewal (FRRR)',
    type: 'foundation-place-based',
    primaryUrl: '/communities',
    secondaryUrl: '/impact',
    recommendedVoice: 'patricia-frank',
    rationale: 'Already funded under Backing the Future. Renewal conversation, not pitch.',
  },
  'amp-spark': {
    funder: 'AMP Spark',
    type: 'foundation-generalist',
    primaryUrl: '/process',
    secondaryUrl: '/about',
    recommendedVoice: 'linda-turner',
    rationale: 'Spark is about community-led design. Lead with co-design and the "never been asked" framing.',
  },
  'qbe-foundation': {
    funder: 'QBE Foundation',
    type: 'foundation-corporate',
    primaryUrl: '/insiders',
    recommendedVoice: 'dianne-stokes',
    rationale: "We're in the QBE Catalysing Impact 2026 cohort. Full depth via the QBE wiki tree.",
  },
  'qbe-ventures': {
    funder: 'QBE Ventures',
    type: 'investor-catalytic',
    primaryUrl: '/insiders/capital',
    recommendedVoice: 'norman-frank',
    rationale: 'Catalytic capital conversation. Capital stack design and blended finance.',
  },
  'sefa': {
    funder: 'SEFA',
    type: 'investor-blended',
    primaryUrl: '/insiders/capital',
    recommendedVoice: 'norman-frank',
    rationale: 'Blended finance partner. Procurement Readiness Impact Loan exact fit. Hannah leads.',
  },
  'dusseldorp-forum': {
    funder: 'Dusseldorp Forum',
    type: 'foundation-generalist',
    primaryUrl: '/about',
    secondaryUrl: '/impact',
    recommendedVoice: 'linda-turner',
    rationale: 'Systems-change framing matters most here. Co-design narrative.',
  },
  'giant-leap-foundation': {
    funder: 'Giant Leap Foundation',
    type: 'foundation-climate',
    primaryUrl: '/process',
    secondaryUrl: '/impact',
    rationale: 'Climate and circular economy lens. Lead with the recycled HDPE process.',
  },
  'pfi-philanthropic': {
    funder: 'PFI (Philanthropic)',
    type: 'foundation-first-nations',
    primaryUrl: '/impact',
    recommendedVoice: 'dianne-stokes',
    rationale: 'First Nations-specific framing. Centre Elder voices.',
  },
  'minderoo-foundation': {
    funder: 'Minderoo Foundation',
    type: 'foundation-first-nations',
    primaryUrl: '/insiders/capital',
    secondaryUrl: '/communities',
    recommendedVoice: 'norman-frank',
    rationale: 'Generation One and Thrive by Five priorities. Recoverable grants playbook.',
  },
  'wilya-janta-housing': {
    funder: 'Wilya Janta Housing',
    type: 'community-partner',
    primaryUrl: '/communities',
    directOnly: true,
    rationale: "Norm Frank's organisation. Yarn first, never URL on first contact.",
  },
  'defy-design': {
    funder: 'Defy Design',
    type: 'community-partner',
    primaryUrl: '/process',
    rationale: 'Manufacturing partner, technical depth. Show plant detail.',
  },
  'envirobank': {
    funder: 'Envirobank',
    type: 'community-partner',
    primaryUrl: '/process',
    rationale: 'Plastic supply pathway. Lead with the source step in the process.',
  },
  'npy-womens-council': {
    funder: "NPY Women's Council",
    type: 'community-partner',
    primaryUrl: '/communities',
    directOnly: true,
    rationale: 'Always-looking-for-beds relationship via Angela Lynch. Direct contact, no URL on first contact.',
  },
  'homeland-schools-company': {
    funder: 'Homeland Schools Company',
    type: 'procurement-school',
    primaryUrl: '/shop/stretch-bed-single',
    secondaryUrl: '/communities',
    rationale: '65 beds requested for kids across Maningrida communities. Procurement-shape conversation.',
  },
  'whsac': {
    funder: 'WHSAC',
    type: 'procurement-housing',
    primaryUrl: '/communities',
    secondaryUrl: '/process',
    rationale: 'Procurement-and-partnership shape. Show both deployment and manufacturing.',
  },
  'picc-palm-island': {
    funder: 'Palm Island Community Company (PICC)',
    type: 'community-partner',
    primaryUrl: '/communities',
    secondaryUrl: '/process',
    recommendedVoice: 'ivy',
    rationale: 'Strong relationship. They asked to buy the plant. Send the Palm Island community page.',
  },
  'first-australians-capital': {
    funder: 'First Australians Capital',
    type: 'investor-impact',
    primaryUrl: '/insiders/capital',
    recommendedVoice: 'dianne-stokes',
    rationale: 'First Nations capital provider. Deep alignment with community ownership model.',
  },
  'iba': {
    funder: 'Indigenous Business Australia (IBA)',
    type: 'investor-impact',
    primaryUrl: '/insiders/capital',
    rationale: 'Federal Indigenous business finance. Community-ownership story is the lead.',
  },
};

export function getFunderUrl(slug: string): FunderUrlEntry | undefined {
  return FUNDER_URL_MAP[slug];
}

export function getFundersByType(type: FunderType): FunderUrlEntry[] {
  return Object.values(FUNDER_URL_MAP).filter((f) => f.type === type);
}

export function getDefaultUrlForType(type: FunderType): GoodsUrl {
  switch (type) {
    case 'foundation-health':
    case 'foundation-corporate':
      return '/impact';
    case 'foundation-place-based':
    case 'community-partner':
      return '/communities';
    case 'foundation-first-nations':
      return '/about';
    case 'foundation-climate':
      return '/process';
    case 'foundation-generalist':
      return '/about';
    case 'investor-catalytic':
    case 'investor-impact':
    case 'investor-blended':
      return '/insiders/capital';
    case 'procurement-health':
    case 'procurement-housing':
    case 'procurement-school':
    case 'procurement-government':
      return '/shop/stretch-bed-single';
  }
}
