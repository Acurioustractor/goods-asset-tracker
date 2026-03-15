/**
 * Goods on Country — Master Compendium (Structured Data)
 *
 * Source: docs/COMPENDIUM_MARCH_2026.md
 * Last synced: March 15, 2026
 *
 * This file structures the compendium into typed, queryable data
 * for use across admin dashboards, reports, and grant applications.
 */

// ---------------------------------------------------------------------------
// Advisory Board
// ---------------------------------------------------------------------------

export interface AdvisoryMember {
  id: string;
  name: string;
  organisation: string;
  email?: string;
  role: string;
}

export const advisoryBoard: AdvisoryMember[] = [
  { id: 'kristy', name: 'Kristy Bloomfield', organisation: 'Oonchiumpa', email: 'kristy.bloomfield@oonchiumpa.com.au', role: 'Cultural Lead' },
  { id: 'nic', name: 'Nicholas Marchesi OAM', organisation: 'ACT', email: 'nicholas@act.place', role: 'Founder/CEO' },
  { id: 'sally', name: 'Sally Grimsley-Ballard', organisation: 'Snow Foundation', email: 's.grimsley-ballard@snowfoundation.org.au', role: 'Strategic Partner' },
  { id: 'sam', name: 'Sam Davies', organisation: 'Defy Design', email: 'sam@defydesign.org', role: 'Manufacturing' },
  { id: 'judith', name: 'Judith Meiklejohn', organisation: 'Orange Sky', email: 'judith@orangesky.org.au', role: 'Social Enterprise' },
  { id: 'corey', name: 'Corey Tutt', organisation: 'DeadlyScience', email: 'ceo@deadlyscience.org.au', role: 'CEO, Advisor' },
  { id: 'april', name: 'April Long', organisation: 'SMART Recovery Aus', email: 'along@srau.org.au', role: 'Advisory' },
  { id: 'susan', name: 'Susan Clear', organisation: 'Independent', email: 'susan.clear@gmail.com', role: 'Advisory' },
  { id: 'nina', name: 'Nina Fitzgerald', organisation: 'Independent', email: 'hello@nina-fitzgerald.com', role: 'Advisory' },
  { id: 'daniel', name: 'Daniel Pittman', organisation: 'Zinus', email: 'daniel.pittman@zinus.com', role: 'Industry' },
  { id: 'shaun', name: 'Shaun Fisher', organisation: 'Fishers Oysters', email: 'fishers.oysters@gmail.com', role: 'Advisory' },
  { id: 'adeem', name: 'Adeem', organisation: 'CYP', email: 'adeemal@cyp.org.au', role: 'Community Services' },
  { id: 'simon', name: 'Dr. Simon Quilty', organisation: 'Wilya Janta', role: 'CEO, NT Health' },
];

// ---------------------------------------------------------------------------
// Community Partners
// ---------------------------------------------------------------------------

export type PartnerCategory = 'core' | 'health' | 'manufacturing' | 'government' | 'strategic' | 'future';

export interface CommunityPartner {
  id: string;
  name: string;
  category: PartnerCategory;
  location?: string;
  description: string;
  contacts?: { name: string; role?: string; email?: string }[];
  website?: string;
  keyFacts?: string[];
}

export const communityPartners: CommunityPartner[] = [
  // Core Community Partners
  {
    id: 'oonchiumpa',
    name: 'Oonchiumpa Consultancy',
    category: 'core',
    location: 'Alice Springs / Mbantua',
    description: '100% Aboriginal owned and operated. Named after Central Australian corkwood tree. Two years co-designing products "around the fire". Planning production facility in Alice Springs.',
    contacts: [
      { name: 'Kristy Bloomfield', role: 'Director', email: 'kristy.bloomfield@oonchiumpa.com.au' },
      { name: 'Tanya Turner', role: 'Manager' },
      { name: 'Karen Liddle', role: 'Board Chair' },
      { name: 'Fred Campbell', role: 'Youth Case Worker' },
    ],
    keyFacts: [
      'REAL Innovation Fund EOI submitted Mar 2, 2026 (Oonchiumpa as lead)',
      'Cultural consultation at university-equivalent rates (~$3,800/day)',
    ],
  },
  {
    id: 'wilya-janta',
    name: 'Wilya Janta',
    category: 'core',
    location: 'Tennant Creek',
    description: 'Housing advocacy, demonstration home partnership. Active bed testing and co-design.',
    contacts: [
      { name: 'Norman Frank Jupurrurla', role: 'Founder' },
      { name: 'Dr. Simon Quilty', role: 'CEO, 20+ years NT health' },
    ],
  },
  {
    id: 'picc',
    name: 'Palm Island Community Company (PICC)',
    category: 'core',
    location: 'Palm Island, QLD',
    description: '141 beds deployed — largest single community deployment. Said "we\'ll buy it" re: production facility itself.',
    contacts: [{ name: 'Narelle' }],
    keyFacts: ['40-bed order discussed Feb 2026'],
  },
  {
    id: 'npy',
    name: 'NPY Women\'s Council',
    category: 'core',
    location: 'NPY Lands — SA/NT/WA',
    description: 'Established network across Ngaanyatjarra, Pitjantjatjara, and Yankunytjatjara lands.',
    contacts: [{ name: 'Angela Lynch' }],
    keyFacts: ['"Always looking for beds"'],
  },
  {
    id: 'homeland-schools',
    name: 'Homeland Schools Company',
    category: 'core',
    location: 'Maningrida, NT',
    description: '65 beds requested for kids.',
    keyFacts: ['$34K invoice outstanding (INV-0303)'],
  },
  {
    id: 'qic',
    name: 'QIC',
    category: 'core',
    location: 'Brisbane',
    description: 'Corporate engagement: interested in building 50 beds with staff for NAIDOC week.',
  },

  // Health Partners
  {
    id: 'anyinginyi',
    name: 'Anyinginyi Health',
    category: 'health',
    location: 'Tennant Creek',
    description: 'Health outcomes tracking, 5 washing machines deployed, quote for 4 more (Feb 2026).',
    contacts: [{ name: 'Tony' }],
  },
  {
    id: 'miwatj',
    name: 'Miwatj Health',
    category: 'health',
    location: 'East Arnhem',
    description: 'RHD prevention, fleet deployment across 8 clinics being explored.',
    contacts: [{ name: 'Jessica Allardyce' }],
  },
  {
    id: 'purple-house',
    name: 'Purple House',
    category: 'health',
    location: 'Central Australia',
    description: 'Dialysis patients, remote health partner.',
  },
  {
    id: 'red-dust',
    name: 'Red Dust',
    category: 'health',
    location: 'Darwin',
    description: 'Health partner.',
  },
  {
    id: 'red-dust-robotics',
    name: 'Red Dust Robotics',
    category: 'health',
    location: 'Darwin',
    description: 'Youth STEM education, manufacturing skills pathway.',
  },

  // Manufacturing & Technical
  {
    id: 'defy-design',
    name: 'Defy Design',
    category: 'manufacturing',
    location: 'Sydney',
    description: 'Recycling & manufacturing training. Ebony + Jahvan Oui training for on-country production. Key manufacturing partner.',
    contacts: [{ name: 'Sam Davies', email: 'sam@defydesign.org' }],
  },
  {
    id: 'zinus',
    name: 'Zinus',
    category: 'manufacturing',
    description: 'Industry partner (mattress manufacturing). Advisory board.',
    contacts: [{ name: 'Daniel Pittman', email: 'daniel.pittman@zinus.com' }],
  },
  {
    id: 'envirobank',
    name: 'Envirobank',
    category: 'manufacturing',
    description: 'Recycled HDPE supply partnership in discussion. Indigenous-led supply chain alignment.',
    contacts: [
      { name: 'Marty Taylor' },
      { name: 'Narelle Anderson' },
    ],
    keyFacts: ['Meeting held Feb 11, 2026'],
  },

  // Government
  {
    id: 'nt-gov',
    name: 'NT Government',
    category: 'government',
    contacts: [{ name: 'Anna Philip', email: 'anna.philip2@nt.gov.au' }],
    description: 'Check-in meeting Jan 2026.',
  },
  {
    id: 'dewr',
    name: 'DEWR (Federal)',
    category: 'government',
    description: 'REAL Innovation Fund EOI received Mar 2, 2026.',
  },

  // Strategic
  {
    id: 'orange-sky',
    name: 'Orange Sky Laundry',
    category: 'strategic',
    description: 'Strategic advisor. Nic\'s former org.',
    contacts: [{ name: 'Judith Meiklejohn', email: 'judith@orangesky.org.au' }],
  },
  {
    id: 'deadlyscience',
    name: 'DeadlyScience',
    category: 'strategic',
    description: 'CEO, advisory board.',
    contacts: [{ name: 'Corey Tutt', email: 'ceo@deadlyscience.org.au' }],
  },

  // Future Manufacturing
  {
    id: 'eb-jahvan',
    name: 'Ebony & Jahvan Oui',
    category: 'future',
    location: 'Palm Island',
    description: 'Training with Defy Design for on-country production. Jahvan visited Defy factory in Sydney — future-CEO training.',
  },
];

// ---------------------------------------------------------------------------
// Funding
// ---------------------------------------------------------------------------

export interface FundingRecord {
  id: string;
  source: string;
  amount: number;
  program?: string;
  status: 'received' | 'pending' | 'pipeline' | 'receivable';
  when?: string;
  contact?: string;
  contactEmail?: string;
  notes?: string;
}

export const funding: FundingRecord[] = [
  // Confirmed Received ($445,685+)
  { id: 'snow-1', source: 'Snow Foundation', amount: 193785, program: 'Multiple grants', status: 'received', when: '2024–2026', contact: 'Sally Grimsley-Ballard', contactEmail: 's.grimsley-ballard@snowfoundation.org.au' },
  { id: 'tfn', source: 'The Funding Network', amount: 130000, program: 'Pitch event', status: 'received', when: 'Sept 2025' },
  { id: 'frrr', source: 'FRRR', amount: 50000, program: 'Backing the Future', status: 'received', when: '2025' },
  { id: 'vfff', source: 'Vincent Fairfax Family Foundation', amount: 50000, program: 'Grant', status: 'received', when: '2025' },
  { id: 'amp', source: 'AMP Spark', amount: 21900, program: 'Program funding', status: 'received', when: '2025' },

  // Pending / In Discussion
  { id: 'snow-4', source: 'Snow Foundation (Round 4)', amount: 200000, status: 'pending', contact: 'Sally Grimsley-Ballard' },
  { id: 'sefa', source: 'SEFA', amount: 500000, program: 'Social impact loan', status: 'pending', contact: 'Joel Bird', notes: '23 communications' },
  { id: 'pfi', source: 'PFI (QLD Treasury)', amount: 640000, program: 'Repayable', status: 'pending', contactEmail: 'PFIFund@treasury.qld.gov.au', notes: 'EOI due Mar 15, 2026' },
  { id: 'real', source: 'REAL Innovation Fund', amount: 0, program: 'Federal grant', status: 'pending', notes: 'EOI submitted Mar 2, DEWR' },
  { id: 'qbe', source: 'QBE Foundation', amount: 0, program: 'Grant', status: 'pending', notes: 'Submitted' },
  { id: 'sedg', source: 'Social Enterprise Development Grants', amount: 75000, program: 'Grant', status: 'pending', notes: 'Draft (82% fit)' },

  // Pipeline
  { id: 'minderoo', source: 'Minderoo Foundation', amount: 0, status: 'pipeline', contact: 'Lucy Stronach', notes: '20 comms, Sally recommended' },
  { id: 'tim-fairfax', source: 'Tim Fairfax Family Foundation', amount: 0, status: 'pipeline', contact: 'Katie Norman', notes: '33 comms, QLD focus' },
  { id: 'dusseldorp', source: 'Dusseldorp Forum', amount: 0, status: 'pipeline', notes: 'Meeting held Oct 2025' },
  { id: 'giant-leap', source: 'Giant Leap', amount: 0, status: 'pipeline', notes: 'Sally recommended, Impact VC' },
  { id: 'acf', source: 'Australian Communities Foundation', amount: 0, status: 'pipeline', notes: 'Collective giving, community-led solutions' },

  // Outstanding Receivables
  { id: 'recv-centrecorp', source: 'Centrecorp Foundation', amount: 420000, status: 'receivable', notes: '107 beds for Utopia Homelands' },
  { id: 'recv-picc', source: 'PICC (Palm Island)', amount: 36000, status: 'receivable', notes: '40-bed order' },
  { id: 'recv-homeland', source: 'Homeland School Company', amount: 34086, status: 'receivable', notes: 'INV-0303, overdue' },
];

export function getFundingSummary() {
  const received = funding.filter(f => f.status === 'received').reduce((s, f) => s + f.amount, 0);
  const pending = funding.filter(f => f.status === 'pending').reduce((s, f) => s + f.amount, 0);
  const receivables = funding.filter(f => f.status === 'receivable').reduce((s, f) => s + f.amount, 0);
  return { received, pending, receivables, total: received + pending + receivables };
}

// ---------------------------------------------------------------------------
// Deployments
// ---------------------------------------------------------------------------

export interface CommunityDeployment {
  id: string;
  community: string;
  traditionalName?: string;
  state: 'NT' | 'QLD' | 'WA' | 'SA';
  beds: number;
  washers: number;
  status: 'active' | 'testing' | 'exploring';
  partner?: string;
  contacts?: string[];
  keyFacts?: string[];
}

export const deployments: CommunityDeployment[] = [
  { id: 'palm-island', community: 'Palm Island', traditionalName: 'Bwgcolman', state: 'QLD', beds: 141, washers: 0, status: 'active', partner: 'PICC / Plate It Forward', contacts: ['Eb & Jahvan Oui'] },
  { id: 'tennant-creek', community: 'Tennant Creek', traditionalName: 'Wumpurrarni', state: 'NT', beds: 139, washers: 5, status: 'active', partner: 'Wilya Janta', contacts: ['Norman Frank', 'Dr Simon Quilty'] },
  { id: 'alice-homelands', community: 'Alice Homelands', state: 'NT', beds: 60, washers: 0, status: 'active', partner: 'Oonchiumpa', contacts: ['Kristy Bloomfield'] },
  { id: 'maningrida', community: 'Maningrida', state: 'NT', beds: 24, washers: 0, status: 'active', partner: 'Homeland Schools Co.' },
  { id: 'kalgoorlie', community: 'Kalgoorlie', traditionalName: 'Ninga Mia', state: 'WA', beds: 20, washers: 0, status: 'active' },
  { id: 'utopia', community: 'Utopia Homelands', state: 'NT', beds: 24, washers: 0, status: 'active' },
  { id: 'mt-isa', community: 'Mt Isa', traditionalName: 'Kalkadoon', state: 'QLD', beds: 4, washers: 0, status: 'testing' },
];

export function getDeploymentTotals() {
  const beds = deployments.reduce((s, d) => s + d.beds, 0);
  const washers = deployments.reduce((s, d) => s + d.washers, 0);
  const activeCount = deployments.filter(d => d.status === 'active').length;
  return { beds, washers, communities: deployments.length, activeCount };
}

// ---------------------------------------------------------------------------
// Documented Demand
// ---------------------------------------------------------------------------

export interface DemandRecord {
  id: string;
  requester: string;
  request: string;
  estimatedValue: number;
  status: 'approved' | 'requested' | 'ongoing' | 'exploring';
}

export const documentedDemand: DemandRecord[] = [
  { id: 'dianne-20', requester: 'Dianne Stokes', request: '20 beds (offered to self-fund)', estimatedValue: 20000, status: 'requested' },
  { id: 'norman-3', requester: 'Norman Frank', request: '3 beds in maroon', estimatedValue: 3000, status: 'requested' },
  { id: 'utopia-kids', requester: 'Utopia Homelands', request: 'Beds for every child', estimatedValue: 150000, status: 'requested' },
  { id: 'homeland-65', requester: 'Homeland Schools Company', request: '65 beds for kids, Maningrida', estimatedValue: 65000, status: 'requested' },
  { id: 'groote', requester: 'Groote Archipelago (WHSAC)', request: '500 mattresses + 300 washing machines', estimatedValue: 1700000, status: 'exploring' },
  { id: 'centrecorp', requester: 'Centre Corp Foundation', request: '107 beds APPROVED (Jan 30, 2026)', estimatedValue: 107000, status: 'approved' },
  { id: 'npy-ongoing', requester: 'NPY Women\'s Council', request: '"Always looking for beds"', estimatedValue: 0, status: 'ongoing' },
  { id: 'picc-40', requester: 'PICC (Palm Island)', request: '40 beds discussed', estimatedValue: 36000, status: 'requested' },
];

export function getDemandTotal() {
  return documentedDemand.reduce((s, d) => s + d.estimatedValue, 0);
}

// ---------------------------------------------------------------------------
// Community Voices
// ---------------------------------------------------------------------------

export interface CommunityVoice {
  id: string;
  name: string;
  role?: string;
  community: string;
  state: 'NT' | 'QLD' | 'WA' | 'SA';
  quotes: string[];
  videoUrl?: string;
  context?: string;
}

export const communityVoices: CommunityVoice[] = [
  // Palm Island
  {
    id: 'ivy', name: 'Ivy', community: 'Palm Island', state: 'QLD',
    quotes: [
      'Hardly anyone around the community has beds. When family comes to visit, people sleep on the floor.',
      "It's more better than laying around on the floors... It was easy to make. Yeah, it's nice.",
    ],
  },
  {
    id: 'alfred', name: 'Alfred Johnson', community: 'Palm Island', state: 'QLD',
    quotes: [
      "Having a bed is something you need; you feel more safe when you sleep in a bed. It's different than sleeping on the couch or the ground.",
      "You can't just go down to the store and buy beds. It's a big muck-around. You have to bring them on the barge, pay for freight, and still, not everyone gets one.",
    ],
  },
  {
    id: 'carmelita', name: 'Carmelita', community: 'Palm Island', state: 'QLD',
    quotes: [
      'The freight is very, very dear.',
      "Sometimes family don't have extra mattresses. Kids sleep out with family.",
    ],
  },
  {
    id: 'jason', name: 'Jason', role: 'Long-term Resident', community: 'Palm Island', state: 'QLD',
    quotes: ['The beds are suitable for outdoor spaces and versatile in their use... Try the beds for yourselves and see the benefits firsthand.'],
  },

  // Tennant Creek
  {
    id: 'dianne', name: 'Dianne Stokes', role: 'Waramungu and Warlmanpa Elder, Co-Designer', community: 'Tennant Creek', state: 'NT',
    quotes: [
      'Working both ways — cultural side in white society and Indigenous society.',
      'Hardly any people around the community have beds.',
    ],
    context: 'Named the washing machine "Pakkimjalki Kari". Refines designs "around the fire with her family." Received 1 bed → returned within 2 weeks requesting 20 more, offered to self-fund.',
  },
  {
    id: 'norman', name: 'Norman Frank Jupurrurla', role: 'Warumungu Law Man, Wilya Janta Founder', community: 'Tennant Creek', state: 'NT',
    quotes: [
      'I want to see a better future for our kids and better housing for our people.',
      "We don't want to live backwards like how we grew up in the 70s, 80s, and 90s.",
    ],
    context: 'Boards: Anyinginyi Health, Julalikari Council, Central Land Council. Called requesting 3 beds in maroon after his daughter tried one.',
  },
  {
    id: 'linda', name: 'Linda Turner', community: 'Tennant Creek', state: 'NT',
    quotes: [
      "We've never been asked at what sort of house we'd like to live in.",
      "We're setting this up for our kids and grandkids... independence, being in charge of your own destiny.",
    ],
  },
  {
    id: 'patricia', name: 'Patricia Frank', role: 'Aboriginal Corporation Worker, Oo Tribe, White Cockatoo clan', community: 'Tennant Creek', state: 'NT',
    quotes: ['They truly wanna a washing machine to wash their blanket, to wash their clothes, and it\'s right there at home.'],
    context: 'Connected Goods with language groups across NT for washing machine naming.',
  },
  {
    id: 'jimmy', name: 'Jimmy Frank Jupurrurla', role: 'Traditional Owner, Weave Bed Co-designer', community: 'Tennant Creek', state: 'NT',
    quotes: [
      'Our strengths is our culture, our country, you know, and our language.',
      'Imagine if you could weave a bed?',
    ],
  },
  {
    id: 'cliff', name: 'Cliff Plummer', role: 'Health Practitioner', community: 'Tennant Creek', state: 'NT',
    quotes: ['You got to get health messages across.'],
    videoUrl: 'https://share.descript.com/embed/2gxa5x40r9N',
  },
  {
    id: 'zelda', name: 'Zelda Hogan', community: 'Tennant Creek', state: 'NT',
    quotes: ['A good night\'s sleep is important... from a big day from work.'],
    context: 'Moved family from tin shed to house.',
  },
  {
    id: 'brian', name: 'Brian Russell', community: 'Tennant Creek', state: 'NT',
    quotes: ["It's gonna be home for me now."],
    context: 'Heart attack survivor.',
  },
  {
    id: 'melissa', name: 'Melissa Jackson', community: 'Tennant Creek', state: 'NT',
    quotes: ["I think it's a great bed. Nice bed. And it's more lower, um, more comfortable."],
    context: 'Feedback shaped lower bed design.',
  },
  {
    id: 'annie', name: 'Annie Morrison', role: 'Elder', community: 'Tennant Creek', state: 'NT',
    quotes: ['I like to do more, you know, but helping all the people.'],
  },

  // Alice Springs
  {
    id: 'fred', name: 'Fred Campbell', role: 'Youth Case Worker, Oonchiumpa', community: 'Alice Springs', state: 'NT',
    quotes: [
      "That's something Central Australia need — just something so simple, especially coming out of recycled, and is turning into something so unique for our mob in the bush or on the communities.",
      "It's essential. The families right now... the beds were on the ground. It's a safety thing... a lot of snakes, so everyone wants to be off the ground.",
      "In Aboriginal culture, we tend to move away from the places when there's a death in the family. They just chuck their swags on the ground. Now they know they can just chuck that in.",
    ],
    videoUrl: 'https://share.descript.com/embed/YQwAcYfxzkn',
    context: "On youth (Xavier building beds): \"He just was so proud showing them that he can build it... his energy was a lot more higher.\"",
  },
  {
    id: 'jacqueline', name: 'Jacqueline', role: 'Western Arrernte / Pertame woman, Top Camp', community: 'Alice Springs', state: 'NT',
    quotes: [
      "From the waste, plastic. Perfect. That's really a perfect idea. Because it's very expensive buying bed — it's like three, four hundred. But with this here, it's so amazing. With just waste.",
      "In the shops when they go and buy, it's easily to break 'cause it's too soft. But this here, it's look like it's really gonna stand like that, not break.",
    ],
  },

  // Kalgoorlie
  {
    id: 'chloe', name: 'Chloe', role: 'Aboriginal Homeless Fringe Support Worker, Bega', community: 'Kalgoorlie', state: 'WA',
    quotes: ['As a support worker here, I see how much proper bedding is needed in the community. So many people are sleeping on the floor or on old, unsuitable mattresses. Something as simple as a good bed makes a huge difference — it improves their health, helps with mobility, and gives them dignity.'],
  },

  // Mt Isa
  {
    id: 'tracy', name: 'Tracy McCartney', role: 'Support Worker', community: 'Mt Isa', state: 'QLD',
    quotes: ["The new mattress design is not just about comfort — it's about dignity and health. Lightweight, washable, and off the ground, it addresses real challenges people face living rough or moving between camps."],
  },

  // East Arnhem
  {
    id: 'jessica', name: 'Jessica Allardyce', role: 'Miwatj Health', community: 'East Arnhem', state: 'NT',
    quotes: ['Essential goods are difficult to get out as everything comes on a barge and they are expensive. There is also a lot of scabies and this often leads to Rheumatic Heart Disease, so washing machines are essential.'],
  },

  // Groote
  {
    id: 'simone', name: 'Simone Grimmond', community: 'Groote Archipelago', state: 'NT',
    quotes: ['We are on an island — literally. Therefore anything we purchase is so much more expensive due to freight.'],
    context: 'Scale of need: 500 mattresses, 300 washing machines from single community.',
  },
];

// ---------------------------------------------------------------------------
// Production Facility
// ---------------------------------------------------------------------------

export const productionFacility = {
  investment: 100000,
  containers: [
    {
      name: 'Container #1: Shredding & Collection',
      description: 'Plastic shredder + community collection point. Fills 200 tubs of processed plastic. Stays in community between production runs (ongoing collection).',
    },
    {
      name: 'Container #2: Production',
      description: 'Hydraulic press (180°C) + computer-controlled router. Moulds for beds, washing machines, AND fridges. Builds 200 beds from 200 tubs of plastic.',
    },
  ],
  process: [
    'Plastic collection (community members collect bottle lids/waste)',
    'Shredding (processed into raw material)',
    'Pressing (shredded plastic → baking trays → heated at 180°C → sheets)',
    'Cooling (sheets cool overnight)',
    'Cutting (computer-controlled router cuts components)',
    'Assembly (5 minutes, no tools)',
  ],
  circuitModel: {
    description: 'Deploy to community for ~2 months → produce ~30 beds/week → move to next community',
    planned2026: 'Alice Springs → Tennant Creek → Katherine → Darwin',
    hostingCost: '$5,000/week to host facility',
  },
  componentCosts: {
    steel: { supplier: 'DNA Steel Direct', costPerBed: 27 },
    canvas: { supplier: 'Centre Canvas', costPerBed: 93.5 },
    hdpe: { source: 'Community waste / Envirobank', costPerBed: 0 },
  },
};

// ---------------------------------------------------------------------------
// Environmental Impact
// ---------------------------------------------------------------------------

export const environmentalImpact = {
  plasticPerBed: { min: 20, max: 25, unit: 'kg HDPE' },
  totalDivertedToDate: 9225,
  atScale: { units: 5000, tonnes: 125, period: 'annually' },
  productLifespan: '10+ years (vs weeks for conventional)',
  circularLoop: 'Community waste → beds → community ownership',
};

// ---------------------------------------------------------------------------
// Problem Statistics (with sources)
// ---------------------------------------------------------------------------

export interface ProblemStat {
  claim: string;
  value: string;
  source: string;
}

export const problemStats: ProblemStat[] = [
  { claim: 'Remote homes lacking washing machines', value: '59%', source: 'FRRR, 2022' },
  { claim: 'Can wash regularly (power/detergent)', value: 'Only 38%', source: 'FRRR, 2022' },
  { claim: 'Children with scabies at any time', value: '1 in 3', source: 'PLOS Neglected Tropical Diseases' },
  { claim: 'Children with skin sores (impetigo)', value: '1 in 2', source: 'Medical Journal of Australia' },
  { claim: 'Very remote First Nations homes overcrowded', value: '55%', source: 'AIHW, 2021 Census' },
  { claim: 'Very remote homes with structural problems', value: '54.6%', source: 'AIHW' },
  { claim: 'Mattress cost in remote', value: '$1,200+ (2x city)', source: 'AFSE research' },
  { claim: 'Washing machines sold → dumps, Alice Springs', value: '$3M/year', source: 'Alice Springs provider' },
  { claim: 'Remote laundries reduce scabies', value: '60% reduction', source: 'Sector research' },
  { claim: 'Healthcare savings per $1 washing investment', value: '$6 saved', source: 'Treatment cost analysis' },
  { claim: 'Washing machine lifespan in remote', value: '1–2 years (vs 10–15)', source: 'East Arnhem Spin Project' },
];

// ---------------------------------------------------------------------------
// Timeline
// ---------------------------------------------------------------------------

export interface Milestone {
  date: string;
  event: string;
}

export const timeline: Milestone[] = [
  { date: '2018', event: 'Nic hears Dr. Bo Remenyi speak about RHD prevention' },
  { date: '2016–2020', event: 'Orange Sky expands to remote communities (now 1/3 of services)' },
  { date: 'Oct 2022', event: 'A Curious Tractor Pty Ltd founded' },
  { date: 'Nov 2022', event: 'Goods project kicks off (advisory: Alison Page, Corey Tutt, Nina Fitzgerald)' },
  { date: 'Sept 2023', event: 'A Curious Tractor formally incorporated' },
  { date: '2024', event: 'Active bed pilots begin; 389 assets tracked in register' },
  { date: 'Oct 2024', event: 'Snow Foundation relationship begins' },
  { date: 'Sept 2025', event: 'The Funding Network pitch — $130K raised (largest single raise)' },
  { date: 'Jan 2026', event: '15–20 V4 Stretch Beds deployed with ~8 families; Centre Corp approves 107 beds' },
  { date: 'Late Jan 2026', event: 'Nic travels to Alice Springs + Tennant Creek; builds 5 washing machines with Bloomfield family' },
  { date: 'Feb 2026', event: 'Envirobank recycled HDPE supply partnership discussions; Snow Q4 proposal submitted' },
  { date: 'Mar 2, 2026', event: 'REAL Innovation Fund EOI submitted (via Oonchiumpa) — DEWR confirmed receipt' },
];

// ---------------------------------------------------------------------------
// Risks
// ---------------------------------------------------------------------------

export interface Risk {
  risk: string;
  likelihood: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  mitigation: string;
}

export const risks: Risk[] = [
  { risk: 'Insufficient plastic waste quality/quantity', likelihood: 'Medium', impact: 'Medium', mitigation: 'Multiple collection points; Envirobank partnership; quality sorting' },
  { risk: 'Production facility demand insufficient', likelihood: 'Medium', impact: 'High', mitigation: 'Orange Sky model; multiple interested hosts (PICC, Tennant Creek Shed)' },
  { risk: 'Skills gap for manufacturing', likelihood: 'Medium', impact: 'Medium', mitigation: 'Defy Design training; tiered roles; Ebony + Jahvan pipeline' },
  { risk: 'Zero-margin product delivery', likelihood: 'High', impact: 'High', mitigation: 'Building inventory for commercial sales; SEFA loan; corporate engagement' },
  { risk: 'Philanthropy dependence', likelihood: 'Medium', impact: 'High', mitigation: 'PFI + SEFA = non-grant; diversified funding; asset-based model' },
  { risk: 'Scaling before adequate testing', likelihood: 'Medium', impact: 'High', mitigation: 'V4 informed by 140+ deployments; 200–300 beds minimum before major scale' },
  { risk: 'Transport costs to remote', likelihood: 'High', impact: 'Medium', mitigation: 'Local production model; containerised circuit deployment' },
  { risk: 'V.1 bed hesitancy', likelihood: 'Medium', impact: 'Medium', mitigation: 'V.2 Stretch Bed well-received; all future = V.2' },
];

// ---------------------------------------------------------------------------
// Five-Year Vision
// ---------------------------------------------------------------------------

export const vision2030 = {
  quote: "In five years time, our dream is to have the best products in the world made by and with the communities themselves.",
  metrics: [
    'Product success: Most desired, repairable, requested items — don\'t end up in landfill',
    'Community ownership: Communities running production 3+ days/week without ACT',
    'Economic impact: 30+ community members employed in manufacturing',
    'Health outcomes: Measurable reductions in scabies, RHD, poor sleep',
    'Systemic change: Open-source designs adopted by others, policy recognition',
  ],
  ultimateSuccess: 'When someone asks "Who makes these?" and the answer is "We do."',
};

// ---------------------------------------------------------------------------
// Video / Media Assets
// ---------------------------------------------------------------------------

export interface VideoAsset {
  title: string;
  person?: string;
  url: string;
}

export const videoTestimonials: VideoAsset[] = [
  { title: 'Beds & Dignity', person: 'Cliff Plummer', url: 'https://share.descript.com/embed/2gxa5x40r9N' },
  { title: 'The Recycling Plant', url: 'https://share.descript.com/embed/haRZJbfJadJ' },
  { title: 'Community Voices — Alice Springs', url: 'https://share.descript.com/embed/LAT0KNJMxmH' },
  { title: 'Stretch Bed Timelapse', url: 'https://share.descript.com/embed/Xtrc5ZYsym6' },
  { title: 'Community Voices — Fred', person: 'Fred Campbell', url: 'https://share.descript.com/embed/YQwAcYfxzkn' },
  { title: 'On Country Production #1', url: 'https://share.descript.com/embed/j6PXvhBP62i' },
  { title: 'On Country Production #2', url: 'https://share.descript.com/embed/J5GBQV00la8' },
  { title: 'Stretch Bed Overview', url: 'https://share.descript.com/embed/elrx8lXpDxW' },
  { title: 'Production Walkthrough', url: 'https://share.descript.com/embed/QRzMJxd1Jo3' },
];

// ---------------------------------------------------------------------------
// Corrections & Flags
// ---------------------------------------------------------------------------

export const corrections = {
  doNotUse: [
    '"Linda Turner\'s 4-hour laundry trips" — cannot be verified',
    '"Founded 2019, first deliveries 2020" — project kicked off Nov 2022, entity Sep 2023',
    '"$850 single bed, $1,100 double" — Basket Bed ~$350/unit; those were aspirational retail',
    '"Pakkimjalki Kari is Warlpiri" — it\'s Warumungu (Tennant Creek)',
  ],
  placeholders: [
    '"40% community share" — placeholder concept, not committed. Say "community benefit model" instead.',
    'Kristy Bloomfield quote in content.ts — marked PLACEHOLDER, not verified.',
    'Bed count: 369 (Catalysing Impact) vs 389 (Asset Register) — 389 includes all asset types.',
    'Washing machine count: 5 deployed (Tennant Creek) vs "20+" (may include field testing).',
  ],
};
