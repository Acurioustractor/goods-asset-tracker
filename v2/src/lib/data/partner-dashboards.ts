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
  image?: { src: string; alt: string };
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
  /** Optional warm intro shown before the numbers: a short thank-you + optional photo. */
  thankYou?: { message: string; image?: { src: string; alt: string; caption?: string } };
  /** Cumulative verified backing, e.g. from a Xero reconciliation. */
  total: { value: string; note: string };
  /** Indicative allocation of the funder's support across categories. `percent`
   *  drives the bar width; `value` is the display label (e.g. "~25%"). */
  breakdown: { heading: string; note?: string; items: { label: string; value: string; percent?: number }[] };
  /** Shared moments on Country: visits, treks, handovers. Kept short. */
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

/**
 * A named community voice featured in the "In their words" section. Only
 * voices with confirmed public attribution belong here: either consented on
 * Empathy Ledger (note the slug for provenance) or already published with
 * their name on a public Goods page.
 */
export interface FeaturedVoice {
  name: string;
  /** One line of who they are to this work. */
  role: string;
  quote: string;
  /** Short label for the quote's subject, e.g. "On the bed he built". */
  context?: string;
  image?: { src: string; alt: string };
  /** Empathy Ledger storyteller slug, for provenance + future live sync. */
  elSlug?: string;
}

/**
 * The capital chapter: the move from grant funding to blended, partly-repayable
 * finance, and the specific invitation to this funder. Forward-only and graded
 * not-yet. Copy must stay inside the QBE Public Copy Risk rails: the match is
 * contingent and not secured until awarded; pipeline is not committed capital;
 * the impact-investment conversation is an exploration, not a deal.
 */
export interface NextChapter {
  /** The grant -> blended narrative, two or three sentences. */
  intro: string;
  /** The capital arc: where we began, where we are, where it is heading. */
  arc: { stage: string; meaning: string; state: 'done' | 'now' | 'ahead' }[];
  /** The funder-specific invitation (e.g. grant partner -> impact investor). */
  invitation: { eyebrow: string; title: string; body: string };
  /** What the matched-finance program is, with the cap framed as contingent. */
  qbeNote: string;
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
  /** "The next chapter" capital section (grants -> blended finance). Rendered only when set. */
  nextChapter?: NextChapter;
  /** Production-facility photos shown inside the community-owned-assets section. */
  facilityGallery?: GalleryItem[];
  /** Community-partnership feature section. Rendered only when set. */
  communityPartnership?: CommunityPartnership;
  /** Named, attribution-confirmed voices for the "In their words" section. */
  featuredVoices?: FeaturedVoice[];
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
    'Three years ago, Snow backed an idea that was more promise than proof. That backing is in the houses now. We are building a recycled-plastic production economy on Country, designed to transfer into community ownership, with beds and washing machines already in homes across eleven communities. This page is a record of what it built, and a map of where it goes next.',
  thesisLine:
    'A bed off the floor and clean bedding sit inside the documented prevention chain for rheumatic heart disease. That is what Snow has been backing.',
  goalStatement:
    'The goal is not more beds shipped in from somewhere else. It is a production economy that runs on Country, employs local people, and becomes community owned. A bed delivered is the output. Who owns the means of making the next one is the outcome.',
  dataSovereigntyLine:
    'Community holds the authority over these stories. We hold the count, and show our working.',
  heroImage: {
    src: '/images/media-pack/snow-tennant-creek-april-2025.jpg',
    alt: 'Snow Foundation and Goods on Country together in Tennant Creek, April 2025',
    caption: 'Snow on Country with us at Tennant Creek, April 2025.',
  },
  healthStrategyLine:
    'This is the same logic as your own RHD strategy: tackling the root social and environmental causes, with First Nations leadership. Goods sits in that portfolio alongside the Deadly Heart Trek and Orange Sky, as the health-hardware link in the chain.',
  funderImpact: {
    thankYou: {
      message:
        'Three years ago, Snow backed an idea that was more promise than proof. That early trust is in the houses now. This page is a record of what it built, and a map of where it takes us next.',
      image: {
        src: '/images/media-pack/snow-tennant-creek-april-2025.jpg',
        alt: 'Snow Foundation and Goods on Country together in Tennant Creek, April 2025',
        caption: 'Snow on Country with us at Tennant Creek, April 2025.',
      },
    },
    total: {
      value: '$493,130',
      note: 'Cumulative since 2023, Xero-reconciled on 9 June 2026, nothing outstanding.',
    },
    breakdown: {
      heading: 'Roughly where your support has gone',
      note: 'An indicative allocation across Snow’s support since 2023, not a per-dollar acquittal.',
      items: [
        { label: 'Community visits and on-Country presence', value: '~25%', percent: 25 },
        { label: 'Bed R&D and product development (V1 to V4)', value: '~25%', percent: 25 },
        { label: 'Washing machine: build, testing and deployment', value: '~20%', percent: 20 },
        { label: 'Bed production and deployments to communities', value: '~20%', percent: 20 },
        { label: 'The on-Country production plant', value: '~10%', percent: 10 },
      ],
    },
    moments: [
      { date: '2023', title: 'Snow backs Goods before the proof is in the houses', detail: 'Anchor support when this was still a bold idea. Founder wages, early R&D, and the first prototypes.', image: { src: '/images/media-pack/goods-early-2023-community.jpg', alt: 'Early community visit, 2023, sleeping conditions in remote community before the bed' } },
      { date: 'Jul 2025', title: 'Sally and Georgina on Country at Tennant Creek', detail: 'Sally Grimsley-Ballard and Georgina Byron AM with community Elders in Tennant Creek, July 2025.', image: { src: '/images/media-pack/sally-georgina-tennant-creek-jul-2025.jpg', alt: 'Sally and Georgina with community Elders in Tennant Creek, July 2025' } },
      { date: 'Aug 2025', title: 'Beds alongside the Deadly Heart Trek, Katherine', detail: 'Deliveries ran beside the Trek\'s heart-screening visit, 8 August 2025.', image: { src: '/images/media-pack/deadly-heart-trek-aug-2025.jpg', alt: 'Deadly Heart Trek team group photo, August 2025' } },
      { date: 'May 2026', title: 'Goods displayed at Canberra Airport', detail: 'A Stretch Bed and "Good. Design." installation at Canberra Airport, raising awareness of RHD and the health-hardware link.', image: { src: '/images/media-pack/canberra-airport-display-may-2025.jpg', alt: 'Goods "Good. Design." display at Canberra Airport, May 2026' } },
      { date: 'Jan 2026', title: 'First washing machine given to Dianne Stokes', detail: 'In Tennant Creek. She named it Pakkimjalki Kari in Warumungu.', image: { src: '/images/product/washing-machine-name.jpg', alt: 'Pakkimjalki Kari name plate at sunset, Tennant Creek' } },
      { date: 'Mar 2026', title: 'Goods bed on stage at Parliament House, Canberra', detail: 'Snow Foundation, NACCHO, and the Rheumatic Heart Disease Alliance event. The Stretch Bed on stage as health hardware for RHD prevention.', image: { src: '/images/media-pack/parliament-house-event-mar-2025.jpg', alt: 'Panel discussion at Parliament House, Canberra, March 2026, Snow Foundation, NACCHO and the RHD Alliance' } },
    ],
    quotes: [],
  },
  nextChapter: {
    intro:
      "Snow's backing came as grants. That was the right capital for an idea that was still more promise than proof. The idea is proven now, and the model was always built to stand on its own: a production economy that earns its keep, and that the community comes to own. The capital that takes it there looks different from the capital that started it.",
    arc: [
      {
        stage: 'Grant funded',
        meaning:
          'Where we began. Snow and a small group of trusting funders carried the early risk, before the proof was in the houses.',
        state: 'done',
      },
      {
        stage: 'Blended raise',
        meaning:
          'Where we are now. A mix of repayable finance, a matched grant through QBE, and philanthropic partners. Repayable finance is prioritised over grants, by design.',
        state: 'now',
      },
      {
        stage: 'Self sustaining, community owned',
        meaning:
          'Where it is heading. Production that earns, an asset base the community owns, and capital that returns so it can be put to work again.',
        state: 'ahead',
      },
    ],
    invitation: {
      eyebrow: 'An invitation to Snow',
      title: 'From grant partner to impact investor',
      body: 'Snow has opened a conversation about coming into this next chapter as more than a grant maker: as an impact investor. Our hope is to structure as much of the next commitment as possible as a loan, recoverable capital that returns to Snow over time and can be put back to work, rather than a grant. The three things we want to settle together with Snow are the amount, the conditions it carries, and the impact it is held to. It is an exploration, not a commitment, and it sits alongside the partnership we already have, not in place of it.',
    },
    qbeNote:
      'Goods was selected into QBE Catalysing Impact 2026, a blended finance accelerator run by the Social Impact Hub. Stage 2 can match up to $400,000, but only against capital we raise alongside it, and repayable finance is prioritised over grants. The match is contingent, and it is not secured until it is awarded.',
  },
  statusLine:
    'Commissioning the first containerised plant (about 85 percent); the Alice Springs facility submission with Oonchiumpa is in review.',
  facilities: {
    value: '1 + 1',
    note: 'One containerised plant being commissioned; a second, community-owned facility in Alice Springs with Oonchiumpa is in a federal funding submission (decision pending).',
  },
  ownershipMilestones: [
    {
      facility: 'On-Country recycling and press plant',
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
        { title: 'Commission the on-Country production plant', note: '~85% complete' },
        { title: 'Alice Springs facility with Oonchiumpa', note: 'REAL Innovation Fund submission lodged, decision pending' },
        { title: 'New washing machine prototype', note: 'Next-generation build in development now' },
        { title: 'The Butterfly Movement charity transition', note: "Goods' DGR home; Aboriginal-led board forming" },
      ],
    },
    {
      heading: 'Done',
      items: [
        { title: '540 beds delivered across 11 communities' },
        { title: 'Containerised production plant built (recycled-plastic line)' },
        { title: '22 washing machines in community' },
        { title: 'Utopia + Alice Springs trip, May 2026', note: '87 beds that trip' },
      ],
    },
  ],
  history: [
    { date: '2023', title: 'Snow becomes an anchor backer', detail: 'Support before the proof was in the houses.' },
    { date: '2024', title: 'Grant 2024/OC0014', detail: 'Multi-year support across beds, the production facility, and the team.' },
    { date: 'Apr 2025', title: 'Snow visits Tennant Creek with us', detail: 'Sally Grimsley-Ballard on Country on 2 April 2025, seeing the work first-hand.' },
    { date: 'Aug 2025', title: 'Deadly Heart Trek, Katherine', detail: 'Out on the Katherine visit, 8 August 2025.' },
    { date: 'Jan 2026', title: 'First washing machine given to Dianne Stokes', detail: 'In Tennant Creek. She named it Pakkimjalki Kari in Warumungu.' },
    { date: 'Early 2026', title: 'Selected into QBE Catalysing Impact 2026', detail: 'Blended-finance accelerator run by the Social Impact Hub. Stage 2 in September could bring matched catalytic capital.' },
    { date: 'May 2026', title: 'Central Australia deployment', detail: 'Utopia + Alice Springs; 87 beds that trip, with Centrecorp as delivery partner.' },
    { date: 'Jun 2026', title: 'Oonchiumpa REAL Innovation Fund submission', detail: 'A community-owned Alice Springs facility + jobs pathway, decision pending.' },
    { date: 'To date', title: 'Nine communities, beds in homes, the first plant being commissioned', detail: 'The base the next stage builds on, with a blended raise now underway to scale it.' },
  ],
  links: [
    { label: 'Snow + Goods at Tennant Creek', href: 'https://photos.google.com/share/AF1QipMM88kHBqqUV-udXeHpTB0FjhY8my5_dNWw7CeSphrsq20wt4BlLTmy9O-QoRfBwQ?key=TkY0VHA3cVVKR3V1T0NqOHFBSUpXZ0pGX01WSkNR', note: 'Photo album, 2 April 2025', external: true },
    { label: 'Deadly Heart Trek, Katherine', href: 'https://photos.google.com/share/AF1QipNbosyzxtrQ0jy240fbDj6Bc58GrvH3dcxBsIfPfX9XMOk8v58MWIRKbA5xxV1KRw?key=dnlaTFhkb2llNHFqSXlWRnBUUy15X1VhSTVZZ1JR', note: 'Photo album, 8 August 2025', external: true },
    { label: 'How the Stretch Bed works', href: '/stretch-bed' },
    { label: 'Live impact dashboard', href: '/impact', note: 'The full impact view (password protected)' },
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
      'Oonchiumpa is a 100 percent Aboriginal-owned consultancy in Alice Springs, owned and run by the Bloomfield and Liddle families, chaired by Karen Liddle and led by Kristy Bloomfield. Two years working together: cultural advice (paid at university research rates), youth programs, and the delivery network into the homelands.',
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
        body: '87 beds went out by truck to Utopia Homelands, Arawerr and Ampilatwatja. Oonchiumpa chose which households; local teams led the deliveries; Centrecorp Foundation paid for the materials.',
      },
    ],
    photos: [
      { src: '/images/stories/utopia/01-hero.jpg', alt: 'Young people building a Stretch Bed on the May 2026 Utopia trip', consent: 'documented' },
      { src: '/images/stories/utopia/08-beforeafter.jpg', alt: 'A young person on the Stretch Bed they built, Utopia, May 2026', consent: 'documented' },
      { src: '/images/stories/utopia/06-delivery.jpg', alt: 'Beds delivered out to the homelands, May 2026', consent: 'documented' },
    ],
    quote: {
      text: "We want to create a safe space for our young people. There's a lack of housing, which leads to a lack of sleep, which leads to low school attendance.",
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
  // All three are attribution-confirmed: Dianne and Kristy are consented EL
  // storytellers; Mykel's public attribution is confirmed by Oonchiumpa, who
  // hold guardianship for him (per his EL storyteller record).
  featuredVoices: [
    {
      name: 'Dianne Stokes',
      role: 'Warumungu and Warlmanpa Elder, Tennant Creek. The first to have a Goods bed and a Pakkimjalki Kari washing machine in her home.',
      quote: "It means something that really makes me happy. Every time I go away, it's like it's calling me. Come back home.",
      context: 'On what the Pakkimjalki Kari means at home',
      image: { src: '/images/people/dianne-stokes.jpg', alt: 'Dianne Stokes' },
      elSlug: 'dianne-stokes',
    },
    {
      name: 'Kristy Bloomfield',
      role: 'Traditional Owner, Mparntwe. Leads Oonchiumpa, the community partnership behind the Alice Springs production facility.',
      quote: "We want to create a safe space for our young people. There's a lack of housing, which leads to a lack of sleep, which leads to low school attendance.",
      context: 'Commission the on-Country production plant',
      image: { src: '/images/people/kristy-bloomfield.jpg', alt: 'Kristy Bloomfield' },
      elSlug: 'kristy-bloomfield',
    },
    {
      name: 'Mykel',
      role: 'Young builder, Alice Springs. Built his own Stretch Bed and six more at the May 2026 build.',
      quote: 'Comfortable as. Smooth, tight, hard, fancy.',
      context: 'On the bed he built and slept on that night',
      image: { src: '/images/people/mykel.jpg', alt: 'Mykel at the Alice Springs build' },
      elSlug: 'mykel',
    },
  ],
  // consent: only 'documented' items render on the shared page (see GalleryItem).
  gallery: [
    { src: '/images/stories/utopia/02-arrive.jpg', alt: 'Arriving on the Sandover, May 2026', consent: 'documented' },
    { src: '/images/stories/utopia/04-build.jpg', alt: 'Building Stretch Beds at Utopia Homelands', consent: 'documented' },
    { src: '/images/stories/utopia/07-elders.jpg', alt: 'Elders receiving beds at Utopia Homelands', consent: 'documented' },
    { src: '/images/stories/utopia/05-waste.jpg', alt: 'Plastic collected on Country becomes the legs of the beds', consent: 'documented' },
    { src: '/images/stories/utopia/09-offground.jpg', alt: 'A bed off the ground in a home at Utopia', consent: 'documented' },
    { src: '/images/stories/utopia/11-close.jpg', alt: 'Community life at Utopia Homelands, May 2026', consent: 'documented' },
  ],
};

export const PARTNER_DASHBOARDS: PartnerDashboard[] = [snow];

export function getPartnerDashboard(slug: string): PartnerDashboard | undefined {
  return PARTNER_DASHBOARDS.find((p) => p.slug === slug);
}
