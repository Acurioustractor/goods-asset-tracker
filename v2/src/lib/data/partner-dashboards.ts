/**
 * Partner dashboards. Password-gated, always-live partner status pages.
 *
 * Live metrics (beds / communities / plastic / washers) come from the asset
 * register at request time via getCanonicalAssetRollup() in the page itself.
 * The CURATED content below (kanban, engagement history, links, traffic
 * snapshot) is the "editable" layer.
 *
 * HYBRID UPGRADE PATH (Notion-backed editing):
 *   This config is the content source AND the fallback. When a NOTION_TOKEN is
 *   added to v2/.env.local and a `notionDbId` is set on a partner below, swap
 *   getPartnerContent() to read those sections live from Notion (so Ben edits
 *   in Notion, the page reads it), falling back to this config on any error.
 *   The page + types stay the same — only the content fetch changes.
 *
 * To add a partner: add an entry with a unique slug + password, share
 * `/partners/<slug>/dashboard` and the password. Gated in src/proxy.ts.
 */

export interface KanbanItem {
  title: string;
  note?: string;
}
export interface KanbanColumn {
  heading: string; // e.g. "Up next", "In progress", "Done"
  items: KanbanItem[];
}
export interface TimelineItem {
  date: string; // e.g. "2024" or "May 2026"
  title: string;
  detail?: string;
}
export interface DashboardLink {
  label: string;
  href: string;
  note?: string;
  external?: boolean;
}
export interface TrafficSnapshot {
  value: string; // e.g. "73"
  label: string; // e.g. "/canberra airport page views"
  note?: string;
}

/** Named stages only. No invented "percent to ownership" until it is real. */
export type OwnershipStage = 'planned' | 'built' | 'operating' | 'community-run' | 'community-owned';
export interface OwnershipMilestone {
  facility: string;
  hostCommunity: string;
  stage: OwnershipStage;
  note?: string;
}
export interface AudienceCta {
  headline: string;
  action: string;
  supporting: string;
  href: string;
  external?: boolean;
}
/**
 * Gallery item. `consent` is required so an identifiable photo can never reach
 * a shared page by accident; the page renders only `documented` items.
 */
export interface GalleryItem {
  src: string;
  alt: string;
  consent: 'documented' | 'pending' | 'none';
}

/**
 * The funder's own footprint in the work. Forward-facing, not a gratitude
 * wall: what the backing built, and what that base now makes possible.
 * Every dollar figure must have a provenance source noted in `total.note`.
 */
export interface FunderImpact {
  /** Cumulative verified backing, e.g. from a Xero reconciliation. */
  total: { value: string; note: string };
  /** How a recent grant was actually put to work (e.g. the FY25 split). */
  breakdown: { heading: string; items: { label: string; value: string }[] };
  /** Shared moments on country: visits, treks, handovers. Kept short. */
  moments: TimelineItem[];
  /** The funder's own words back to them (board-forwardable social proof). */
  quotes: { text: string; attribution: string }[];
}

/**
 * A community-partnership feature (e.g. Oonchiumpa). One named partnership,
 * what has actually happened so far, and where it goes next. Facts must trace
 * to the public partner page or the trip stories, never invented.
 */
export interface CommunityPartnership {
  name: string;
  /** Who they are, in one or two sentences. */
  intro: string;
  /** The story so far: short titled beats, in order. */
  beats: { title: string; body: string }[];
  /** Consent-gated photos; only `documented` items render. */
  photos: GalleryItem[];
  quote?: { text: string; attribution: string };
  /** Where this goes next (e.g. the pending facility submission). */
  forward: { title: string; body: string };
  links: DashboardLink[];
}

export interface PartnerDashboard {
  slug: string;
  password: string;
  partnerName: string;
  /** Who this skin is for. Drives framing on the hero, the path, and the CTA. */
  audience: 'partner' | 'supporter' | 'funder';
  heroLine: string;
  intro: string;
  /** Forward-looking hero thesis line (audience-specific). */
  thesisLine: string;
  /** Section 1 "the goal" framing, audience-specific. */
  goalStatement: string;
  /** One-line data-sovereignty statement shown near the hero. */
  dataSovereigntyLine?: string;
  /** Consented hero image shown beside the headline (must be consent: documented). */
  heroImage?: { src: string; alt: string; caption?: string };
  /** One line tying the health chain to this funder's own published strategy. */
  healthStrategyLine?: string;
  /** "Your part in this" section. Rendered only when set. */
  funderImpact?: FunderImpact;
  /** Production-facility photos shown inside the community-owned-assets section. */
  facilityGallery?: GalleryItem[];
  /** Community-partnership feature section. Rendered only when set. */
  communityPartnership?: CommunityPartnership;
  /** One-line "where we are right now". Falls back to the In-progress kanban column if unset. */
  statusLine?: string;
  /** Curated count — production facilities are not (yet) in the asset register. */
  facilities: { value: string; note: string };
  /** Community-owned-asset progression (Section 3). Named stages only. */
  ownershipMilestones?: OwnershipMilestone[];
  kanban: KanbanColumn[];
  history: TimelineItem[];
  links: DashboardLink[];
  /** Section 7 call to action, audience-specific. */
  cta: AudienceCta;
  traffic: {
    intro: string;
    asOf: string;
    snapshots: TrafficSnapshot[];
    reactions: DashboardLink[]; // positive-reaction links Ben adds
  };
  gallery: GalleryItem[];
  contribution?: { value: string; note: string }; // retained for back-compat; not rendered in the forward design
  /** Future: when set + NOTION_TOKEN present, curated sections read from Notion. */
  notionDbId?: string;
}

const snow: PartnerDashboard = {
  slug: 'snow',
  password: 'snow2026',
  partnerName: 'The Snow Foundation',
  audience: 'funder',
  heroLine: 'Where this is heading, and what it takes to get there',
  intro:
    'We are building a recycled-plastic production economy on country, designed to transfer into community ownership. The beds and washing machines are already in homes across nine communities. This is the plan to scale it, and the gap we are closing to get there.',
  thesisLine:
    'Building productive assets that communities come to own. The proof is already in the houses.',
  goalStatement:
    'The goal is not more beds shipped in from somewhere else. It is a production economy that runs on country, employs local people, and becomes community owned. A bed delivered is the output. Who owns the means of making the next one is the outcome.',
  dataSovereigntyLine:
    'Community holds the authority over these stories. We hold the count, and show our working.',
  heroImage: {
    src: '/images/media-pack/community-testing-bed-golden-hour.jpg',
    alt: 'A family testing a Stretch Bed at golden hour',
    caption: 'A Stretch Bed going into use on country. Shared with consent.',
  },
  healthStrategyLine:
    'This is the same logic as your own RHD strategy: tackling the root social and environmental causes, with First Nations leadership. Goods sits in that portfolio alongside the Deadly Heart Trek and Orange Sky, as the health-hardware link in the chain.',
  funderImpact: {
    total: {
      value: '$493,130',
      note: 'Cumulative since 2023, Xero-reconciled on 9 June 2026, nothing outstanding.',
    },
    breakdown: {
      heading: 'How the FY25 grant went to work',
      items: [
        { label: 'Community engagement, four Tennant Creek visits', value: '$48K' },
        { label: 'Mattress V2 research and development', value: '$20K' },
        { label: 'Washing machine V1', value: '$20K' },
        { label: 'Training and employment', value: '$12K' },
      ],
    },
    moments: [
      { date: '2023', title: 'Snow backs Goods before the proof is in the houses', detail: 'Anchor support when this was still a bold idea.' },
      { date: 'Apr 2025', title: 'Sally on country at Tennant Creek', detail: 'Seeing the beds in homes first-hand, 2 April 2025.' },
      { date: 'Aug 2025', title: 'Beds alongside the Deadly Heart Trek, Katherine', detail: 'Deliveries ran beside the Trek’s heart-screening visit, 8 August 2025.' },
      { date: 'Jan 2026', title: 'First washing machine given to Dianne Stokes', detail: 'In Tennant Creek. She named it Pakkimjalki Kari in Warumungu.' },
    ],
    quotes: [
      { text: 'Resoundingly, Goods is a standout project.', attribution: 'Sally Grimsley-Ballard, Head of Partnerships, November 2025' },
      { text: 'We loved seeing first-hand how impressed and grateful individuals and families were to receive the beds.', attribution: 'Georgina Byron AM, CEO' },
    ],
  },
  statusLine:
    'Commissioning the first containerised plant (about 85 percent); the Alice Springs facility submission with Oonchiumpa is in review.',
  facilities: {
    value: '1 + 1',
    note: 'One containerised plant being commissioned; a second, community-owned facility in Alice Springs with Oonchiumpa is in a federal funding submission (decision pending).',
  },
  ownershipMilestones: [
    {
      facility: 'On-country recycling and press plant',
      hostCommunity: 'Central Australia, siting in decision',
      stage: 'built',
      note: 'Commissioning now, about 85 percent complete. Designed to move to community operation, then ownership.',
    },
    {
      facility: 'Alice Springs production facility',
      hostCommunity: 'Mparntwe, led with Oonchiumpa',
      stage: 'planned',
      note: 'REAL Innovation Fund submission lodged with a First Nations jobs pathway. Decision pending.',
    },
  ],
  kanban: [
    {
      heading: 'Up next',
      items: [
        { title: 'Community siting decision for the plant', note: 'Tennant Creek or Mparntwe' },
        { title: 'Katrina: train-the-trainer at Witta', note: 'Skills travel home to run the Alice Springs build' },
        { title: 'QBE Catalysing Impact, Stage 2', note: 'September; could bring matched catalytic capital' },
        { title: 'Investment + loan opportunity with Snow', note: 'Exploring recoverable / impact-investment finance; intro to Bhanvi via Snow' },
      ],
    },
    {
      heading: 'In progress',
      items: [
        { title: 'Commission the on-country production plant', note: '~85% complete' },
        { title: 'Alice Springs facility with Oonchiumpa', note: 'REAL Innovation Fund submission lodged, decision pending' },
        { title: 'New washing machine prototype', note: 'Next-generation build in development now' },
        { title: 'The Butterfly Movement charity transition', note: 'Goods’ DGR home; Aboriginal-led board forming' },
      ],
    },
    {
      heading: 'Done',
      items: [
        { title: '496 beds delivered across 9 communities' },
        { title: 'Containerised production plant built (recycled-plastic line)' },
        { title: '28 washing machines deployed, 14 reporting live' },
        { title: 'Utopia + Alice Springs trip, May 2026', note: '87 beds that trip' },
      ],
    },
  ],
  history: [
    { date: '2023', title: 'Snow becomes an anchor backer', detail: 'Support before the proof was in the houses.' },
    { date: '2024', title: 'Grant 2024/OC0014', detail: 'Multi-year support across beds, the production facility, and the team.' },
    { date: 'Apr 2025', title: 'Snow visits Tennant Creek with us', detail: 'Sally Grimsley-Ballard on country on 2 April 2025, seeing the work first-hand.' },
    { date: 'Aug 2025', title: 'Deadly Heart Trek, Katherine', detail: 'Out on the Katherine visit, 8 August 2025.' },
    { date: 'Jan 2026', title: 'First washing machine given to Dianne Stokes', detail: 'In Tennant Creek. She named it Pakkimjalki Kari in Warumungu.' },
    { date: 'Early 2026', title: 'Selected into QBE Catalysing Impact 2026', detail: 'Blended-finance accelerator run by the Social Impact Hub. Stage 2 in September could bring matched catalytic capital.' },
    { date: 'May 2026', title: 'Central Australia deployment', detail: 'Utopia + Alice Springs; 87 beds that trip, with Centrecorp as delivery partner.' },
    { date: 'Jun 2026', title: 'Oonchiumpa REAL Innovation Fund submission', detail: 'A community-owned Alice Springs facility + jobs pathway, decision pending.' },
    { date: 'To date', title: 'Nine communities, beds in homes, the first plant being commissioned', detail: 'The base the next stage builds on, with a blended raise now underway to scale it.' },
  ],
  links: [
    { label: 'The Snow Foundation on Empathy Ledger', href: 'https://www.empathyledger.com/organisations/snow-foundation', note: 'Your stories, quotes and photos, gathered with consent, yours to revisit anytime', external: true },
    { label: 'Snow + Goods at Tennant Creek', href: 'https://photos.google.com/share/AF1QipMM88kHBqqUV-udXeHpTB0FjhY8my5_dNWw7CeSphrsq20wt4BlLTmy9O-QoRfBwQ?key=TkY0VHA3cVVKR3V1T0NqOHFBSUpXZ0pGX01WSkNR', note: 'Photo album, 2 April 2025', external: true },
    { label: 'Deadly Heart Trek, Katherine', href: 'https://photos.google.com/share/AF1QipNbosyzxtrQ0jy240fbDj6Bc58GrvH3dcxBsIfPfX9XMOk8v58MWIRKbA5xxV1KRw?key=dnlaTFhkb2llNHFqSXlWRnBUUy15X1VhSTVZZ1JR', note: 'Photo album, 8 August 2025', external: true },
    { label: 'The Utopia trip, in full', href: '/field-notes/utopia-may-2026', note: 'Photos + story from the May run' },
    { label: 'How the Stretch Bed works', href: '/stretch-bed' },
    { label: 'Live impact dashboard', href: '/impact', note: 'The full public impact view' },
  ],
  cta: {
    headline: 'Back the next handover',
    action: 'Help close the match',
    supporting:
      'Three years of trusting, long-term partnership put the proof in the houses. The next stage is the kind of bold idea that rewards considered risk: QBE will match up to $400K, but only against capital we raise alongside it. Closing that gap unlocks the next community-owned facility.',
    href: '/partner',
  },
  traffic: {
    intro:
      'The Goods display at Canberra Airport drives people to a dedicated page. A snapshot of the response:',
    asOf: 'Last 30 days, to 9 June 2026 (Vercel Analytics)',
    snapshots: [
      { value: '73', label: 'visits to the /canberra airport page' },
      { value: '318', label: 'total website visitors', note: 'A step-change once the display went up' },
      { value: 'LinkedIn', label: 'top referrer (41 visitors)' },
      { value: '44', label: 'reads of the Utopia trip story' },
    ],
    reactions: [
      // Add links to positive reactions found online (posts, mentions) here.
    ],
  },
  // Equipment-only shots, no identifiable people.
  facilityGallery: [
    {
      src: '/images/process/containers-wide-angle.jpg',
      alt: 'The containerised production plant with doors open, presses inside',
      consent: 'documented',
    },
    {
      src: '/images/process/heat-press-container.jpg',
      alt: 'Heat press and tubs of shredded recycled plastic inside a container',
      consent: 'documented',
    },
    {
      src: '/images/process/shredded-plastic-tubs.jpg',
      alt: 'Tubs of shredded HDPE plastic ready for pressing',
      consent: 'documented',
    },
  ],
  communityPartnership: {
    name: 'Oonchiumpa Consultancy and Services',
    intro:
      'Oonchiumpa is a 100 percent Aboriginal-owned consultancy in Alice Springs, owned and run by the Bloomfield family. Two years working together: cultural advice (paid at university research rates), youth programs, and the delivery network into the homelands.',
    beats: [
      {
        title: 'Young people built the beds',
        body: 'Two days out the back of the Oonchiumpa office in Alice Springs, May 2026. Young men and young women from the Oonchiumpa network built Stretch Beds from flat-pack, supported by Oonchiumpa workers.',
      },
      {
        title: 'Every builder kept one',
        body: 'Every young person who built a bed kept one for themselves. The first thing the work made was theirs.',
      },
      {
        title: 'The rest went out to the homelands',
        body: '107 beds went out by truck to Utopia Homelands, Arawerr and Ampilatwatja. Oonchiumpa chose which households; local teams led the deliveries; Centrecorp Foundation paid for the materials.',
      },
    ],
    photos: [
      { src: '/images/product/stretch-bed-kids-building.jpg', alt: 'Young people building a Stretch Bed in Alice Springs', consent: 'documented' },
      { src: '/images/build/build-049.jpg', alt: 'Young people working together on a Stretch Bed frame', consent: 'documented' },
      { src: '/images/partners/centrecorp/utopia/community-build.jpg', alt: 'Community members assembling Stretch Beds at Utopia Homelands', consent: 'documented' },
    ],
    quote: {
      text: 'We want to create a safe space for our young people. There’s a lack of housing, which leads to a lack of sleep, which leads to low school attendance.',
      attribution: 'Kristy Bloomfield, Director, Oonchiumpa Consultancy',
    },
    forward: {
      title: 'The next step is on the table now',
      body: 'Oonchiumpa has led a federal REAL Innovation Fund submission for a community-controlled production facility in Alice Springs, with a jobs pathway for young First Nations people. The decision is expected in the coming weeks. If it lands, the build session becomes a workforce.',
    },
    links: [
      { label: 'The Utopia trip, in full', href: '/field-notes/utopia-may-2026', note: 'The field note from the May run: the build, the drive out, the Elders' },
      { label: 'The Oonchiumpa partnership page', href: '/partners/oonchiumpa', note: 'The public story of how the partnership works' },
    ],
  },
  // consent: only 'documented' items render on the shared page (see GalleryItem).
  gallery: [
    { src: '/images/community/tennant-creek.jpg', alt: 'Tennant Creek community', consent: 'documented' },
    { src: '/images/media-pack/community-bed-assembly.jpg', alt: 'Community members assembling a bed', consent: 'documented' },
    { src: '/images/media-pack/nic-with-elder-on-verandah.jpg', alt: 'Nic with an Elder on a verandah', consent: 'documented' },
    { src: '/images/product/stretch-bed-community.jpg', alt: 'A Stretch Bed in a remote community home', consent: 'documented' },
    { src: '/images/product/washing-machine-community.jpg', alt: 'A washing machine deployed in community', consent: 'documented' },
    { src: '/images/media-pack/community-testing-bed-golden-hour.jpg', alt: 'A family testing a bed at golden hour', consent: 'documented' },
  ],
};

export const PARTNER_DASHBOARDS: PartnerDashboard[] = [snow];

export function getPartnerDashboard(slug: string): PartnerDashboard | undefined {
  return PARTNER_DASHBOARDS.find((p) => p.slug === slug);
}
