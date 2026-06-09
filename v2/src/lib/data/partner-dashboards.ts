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

export interface PartnerDashboard {
  slug: string;
  password: string;
  partnerName: string;
  heroLine: string;
  intro: string;
  /** Curated count — production facilities are not (yet) in the asset register. */
  facilities: { value: string; note: string };
  kanban: KanbanColumn[];
  history: TimelineItem[];
  links: DashboardLink[];
  traffic: {
    intro: string;
    asOf: string;
    snapshots: TrafficSnapshot[];
    reactions: DashboardLink[]; // positive-reaction links Ben adds
  };
  gallery: { src: string; alt: string }[];
  /** Future: when set + NOTION_TOKEN present, curated sections read from Notion. */
  notionDbId?: string;
}

const snow: PartnerDashboard = {
  slug: 'snow',
  password: 'snow2026',
  partnerName: 'The Snow Foundation',
  heroLine: 'What your backing is making possible on country',
  intro:
    'A live view of where Goods on Country is at, built for The Snow Foundation. The numbers below update on their own from the field. The rest is what we are working on, where we have come from, and what is next.',
  facilities: {
    value: '1 + 1',
    note: 'One containerised plant being commissioned; a second, community-owned facility in Alice Springs with Oonchiumpa is in a federal funding submission (decision pending).',
  },
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
    { date: 'To date', title: '~$493K invested by Snow over three years', detail: 'Fully received. The anchor that makes the blended raise credible.' },
  ],
  links: [
    { label: 'The Snow Foundation on Empathy Ledger', href: 'https://www.empathyledger.com/organisations/snow-foundation', note: 'Your stories, quotes and photos, gathered with consent, yours to revisit anytime', external: true },
    { label: 'Snow + Goods at Tennant Creek', href: 'https://photos.google.com/share/AF1QipMM88kHBqqUV-udXeHpTB0FjhY8my5_dNWw7CeSphrsq20wt4BlLTmy9O-QoRfBwQ?key=TkY0VHA3cVVKR3V1T0NqOHFBSUpXZ0pGX01WSkNR', note: 'Photo album, 2 April 2025', external: true },
    { label: 'Deadly Heart Trek, Katherine', href: 'https://photos.google.com/share/AF1QipNbosyzxtrQ0jy240fbDj6Bc58GrvH3dcxBsIfPfX9XMOk8v58MWIRKbA5xxV1KRw?key=dnlaTFhkb2llNHFqSXlWRnBUUy15X1VhSTVZZ1JR', note: 'Photo album, 8 August 2025', external: true },
    { label: 'The Utopia trip, in full', href: '/field-notes/utopia-may-2026', note: 'Photos + story from the May run' },
    { label: 'How the Stretch Bed works', href: '/stretch-bed' },
    { label: 'Live impact dashboard', href: '/impact', note: 'The full public impact view' },
  ],
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
  gallery: [
    { src: '/images/community/tennant-creek.jpg', alt: 'Tennant Creek community' },
    { src: '/images/media-pack/community-bed-assembly.jpg', alt: 'Community members assembling a bed' },
    { src: '/images/media-pack/nic-with-elder-on-verandah.jpg', alt: 'Nic with an Elder on a verandah' },
    { src: '/images/product/stretch-bed-community.jpg', alt: 'A Stretch Bed in a remote community home' },
    { src: '/images/product/washing-machine-community.jpg', alt: 'A washing machine deployed in community' },
    { src: '/images/media-pack/community-testing-bed-golden-hour.jpg', alt: 'A family testing a bed at golden hour' },
  ],
};

export const PARTNER_DASHBOARDS: PartnerDashboard[] = [snow];

export function getPartnerDashboard(slug: string): PartnerDashboard | undefined {
  return PARTNER_DASHBOARDS.find((p) => p.slug === slug);
}
