// Stages and modules are defined ONCE in pathway-stages.ts. Re-exported here so the four
// pages already importing them from this file keep working. Do not redefine them locally.
export type { PathwayStage, PublicStage } from './pathway-stages';
export {
  PATHWAY_STAGES,
  OPERATING_STEPS,
  PUBLIC_STAGES,
  MODULES,
  publicStageFor,
} from './pathway-stages';

import type { PathwayStage } from './pathway-stages';

export type EvidenceState = 'verified' | 'community-confirmation' | 'not-assessed';
export type ModuleState = 'requested' | 'exploring' | 'later' | 'not-assessed';

export interface PathwayModule {
  id: string;
  name: string;
  summary: string;
  state: ModuleState;
}

export interface PathwayAgent {
  id: string;
  name: string;
  responsibility: string;
  output: string;
  humanGate: string;
}

export interface PathwayCaseStudy {
  eyebrow: string;
  headline: string;
  summary: string;
  hero: { src: string; alt: string };
  quote: { text: string; name: string; context: string };
  proof: { label: string; value: string; note: string }[];
  story: { title: string; body: string }[];
  gallery: { src: string; alt: string }[];
  video?: { src: string; poster: string; title: string };
  links: { label: string; href: string; note: string }[];
  nextAsk: string;
  mediaBasis: string;
  statusNote?: string;
}

export interface CommunityPathway {
  id: string;
  name: string;
  region: string;
  stage: PathwayStage;
  stageLabel: string;
  relationship: string;
  communityLead: string;
  leadOrganisation: string;
  invitation: string;
  nextDecision: string;
  evidenceState: EvidenceState;
  evidenceNote: string;
  mediaState: EvidenceState;
  mediaNote: string;
  modules: PathwayModule[];
  nextActions: string[];
  pilot?: {
    status: string;
    verified: string[];
    assumptions: string[];
    artifactSequence: string[];
    crmBoundary: string;
  };
  caseStudy?: PathwayCaseStudy;
}

export const PATHWAY_AGENTS: PathwayAgent[] = [
  {
    id: 'coordinator',
    name: 'Community coordinator',
    responsibility: 'Keeps the relationship, pathway record, meetings and actions aligned.',
    output: 'Conversation brief, decision log and next-step summary',
    humanGate: 'A community lead confirms every material update.',
  },
  {
    id: 'needs',
    name: 'Needs and capability',
    responsibility: 'Turns conversations into an evidence-labelled picture of what exists and what is wanted.',
    output: 'Community-reviewed needs and capability map',
    humanGate: 'It cannot recommend a module without community confirmation.',
  },
  {
    id: 'modules',
    name: 'Modules and pricing',
    responsibility: 'Builds transparent options for equipment, training, delivery and ongoing support.',
    output: 'Selectable module menu and costed options',
    humanGate: 'Goods validates costs; community chooses the option.',
  },
  {
    id: 'media',
    name: 'Media and consent',
    responsibility: 'Links photos, video, transcripts and stories to people, place and permission.',
    output: 'Review gallery and audience-specific media register',
    humanGate: 'No agent may infer consent or publish an uncertain asset.',
  },
  {
    id: 'funding',
    name: 'Funding and evidence',
    responsibility: 'Packages approved needs, budgets, evidence and outcomes for a specific funder.',
    output: 'Opportunity brief, budget and approved case study',
    humanGate: 'Community approves its framing before external sharing.',
  },
  {
    id: 'follow-up',
    name: 'Follow-up and CRM',
    responsibility: 'Creates operational tasks, draft follow-ups and reminders without marketing enrolment.',
    output: 'Action trail, draft communications and overdue prompts',
    humanGate: 'Messages are reviewed before sending; marketing requires explicit opt-in.',
  },
];

const pathwayModule = (
  id: string,
  name: string,
  summary: string,
  state: ModuleState,
): PathwayModule => ({ id, name, summary, state });

export const COMMUNITY_PATHWAYS: CommunityPathway[] = [
  {
    id: 'tennant-creek',
    name: 'Tennant Creek',
    region: 'Warumungu Country, NT',
    stage: 'listen',
    stageLabel: 'Reconfirm together',
    relationship: 'Our Community Shed and Tennant Creek Youth Centre',
    communityLead: 'Michelle Bates; reconnect with Ade Rizal or current Youth Centre coordinator',
    leadOrganisation: 'Our Community Shed Inc. and Barkly Regional Council',
    invitation: 'Build from the existing Shed proposal, bed-building activity and local relationships.',
    nextDecision: 'Choose one small operational pilot before revisiting the full production pathway.',
    evidenceState: 'community-confirmation',
    evidenceNote: 'Existing proposal and quote are documented; current site, operators and partner roles need reconfirmation.',
    mediaState: 'community-confirmation',
    mediaNote: 'Bed-building video and images exist. Asset-level permission and Youth Centre approval must be reconfirmed.',
    modules: [
      pathwayModule('build', 'Community bed build', 'A facilitated build or repair activity with local young people.', 'exploring'),
      pathwayModule('repair', 'Repair and maintenance', 'Local repair skills, parts and maintenance guidance.', 'exploring'),
      pathwayModule('shredder', 'Plastic collection and shredding', 'Collection, shredder, operator training and safe storage.', 'exploring'),
      pathwayModule('facility', 'Complete production facility', 'Staged shredding, pressing, CNC and local production.', 'later'),
    ],
    nextActions: [
      'Meet the Shed and Youth Centre leads',
      'Reconfirm the site, operators and governance',
      'Review the existing quote and CBF requirements',
      'Select one small activity and document the decision',
    ],
    pilot: {
      status: 'Outreach drafted · awaiting review and send',
      verified: [
        'Michelle Bates is Chairperson of Our Community Shed Inc.',
        'The Shed intended to refresh and resubmit its CBF application in the 1 July–31 August 2026 round.',
        'The February proposal used a two-stage, 12-month trial priced at $234,000 excluding GST.',
        'A Goods washing machine has been delivered to the Shed and a bed is recorded at the Youth Centre.',
      ],
      assumptions: [
        'The Shed still wants the same two-stage facility pathway.',
        'The old equipment, freight and support pricing remains usable.',
        'The Shed has resolved the compliance issue raised in the first CBF decision.',
        'The Youth Centre wants a formal role in the pathway.',
        'Existing bed-building media may be used in a new partner or funder artifact.',
      ],
      artifactSequence: [
        'Short invitation in the existing email thread',
        'Internal conversation guide',
        'Two-page “what we heard” brief for correction',
        'Costed module options after confirmation',
        'Approved CBF or funder pack',
        'Public case study only if separately approved',
      ],
      crmBoundary:
        'GHL holds Michelle, the relationship stage and follow-up. Goods holds the pathway and decisions. Empathy Ledger holds media, stories and permission.',
    },
    caseStudy: {
      eyebrow: 'An emerging pathway',
      headline: 'Build from a shed, a youth centre and relationships already in place.',
      summary:
        'Tennant Creek is where Goods has some of its deepest product history. The next chapter is not a predetermined factory: it is a conversation about whether the existing Shed, Youth Centre and local operators want to test a small production or repair pathway together.',
      hero: {
        src: '/images/community/tennant-creek.jpg',
        alt: 'A Stretch Bed being assembled in Tennant Creek',
      },
      quote: {
        text: "We're setting this up for our kids and grandkids... independence, being in charge of your own destiny.",
        name: 'Linda Turner',
        context: 'Tennant Creek',
      },
      proof: [
        { label: 'Stretch Beds', value: '160', note: 'Current canonical community count' },
        { label: 'Pakkimjalki Kari', value: '9', note: 'Washing machines currently in community' },
        { label: 'Existing base', value: '2', note: 'Community Shed + Youth Centre' },
      ],
      story: [
        {
          title: 'The work has history here',
          body: 'Beds and washing machines have been used, tested and discussed with Tennant Creek families and Elders over several years.',
        },
        {
          title: 'A practical base already exists',
          body: 'Our Community Shed and the Barkly Youth Centre offer a possible place to begin with making, repair and youth participation.',
        },
        {
          title: 'The next move is deliberately small',
          body: 'Before pricing a full facility, Goods on Country will reconfirm the people, site, governance and one useful activity worth testing.',
        },
      ],
      gallery: [
        {
          src: '/images/people/linda-turner.jpg',
          alt: 'Linda Turner, Tennant Creek community voice',
        },
        {
          src: '/images/people/dianne-stokes.jpg',
          alt: 'Dianne Stokes, Warumungu and Warlmanpa Elder in Tennant Creek',
        },
        {
          src: '/images/people/norman-frank.jpg',
          alt: 'Norman Frank Jupurrurla, Warumungu Elder in Tennant Creek',
        },
      ],
      links: [
        {
          label: 'See the live pathway',
          href: '#support-menu',
          note: 'The modules and decisions still to confirm together',
        },
      ],
      nextAsk:
        'Support one reconnection and co-design phase, then cost only the small operational test the Shed and Youth Centre choose.',
      mediaBasis:
        'Media shown here is limited to the verified Tennant Creek community image and named portraits from the externally cleared voice register.',
      statusNote:
        'Existing bed-building media is held, but public reuse remains subject to reconfirming the Youth Centre and asset-level permissions.',
    },
  },
  {
    id: 'utopia',
    name: 'Utopia Homelands',
    region: 'Urapuntja, NT',
    stage: 'choose',
    stageLabel: 'Shape the first module',
    relationship: 'Jane Wilson and Urapuntja Aboriginal Corporation',
    communityLead: 'Jane Wilson, Community Programs Manager',
    leadOrganisation: 'Urapuntja Aboriginal Corporation',
    invitation: 'Support young people with practical local capability, beginning from what Urapuntja asks for.',
    nextDecision: 'Confirm what a shredder would enable, who would operate it and the support Jane wants.',
    evidenceState: 'community-confirmation',
    evidenceNote: 'The relationship and May bed delivery are verified. Shredder scope remains a working request to confirm.',
    mediaState: 'community-confirmation',
    mediaNote: 'Trip galleries and a field note exist. Community review and asset-level permissions remain the publication gate.',
    modules: [
      pathwayModule('shredder', 'Shredder and training', 'A priced shredder package with safe operation and maintenance support.', 'requested'),
      pathwayModule('youth', 'Youth activity', 'Hands-on making, photography or local storytelling shaped with Jane.', 'exploring'),
      pathwayModule('collection', 'Plastic collection', 'Map feedstock, collection partners, storage and transport.', 'exploring'),
      pathwayModule('facility', 'Complete production facility', 'A possible later pathway, only if community chooses it.', 'later'),
    ],
    nextActions: [
      'Hold a focused shredder conversation with Jane',
      'Map operators, site, power, feedstock and safeguarding',
      'Prepare good, better and staged cost options',
      'Return the pathway and media gallery for community correction',
    ],
    caseStudy: {
      eyebrow: 'A focused equipment pathway',
      headline: 'Beds arrived. Young people helped. The next request can start with one machine.',
      summary:
        'The May 2026 journey into Urapuntja showed how a pathway can begin with delivery and grow through relationships. Jane Wilson has opened a conversation about practical opportunities for young people, including what a shredder could make possible locally.',
      hero: {
        src: '/images/utopia/utopia-02.jpg',
        alt: 'An Elder testing a Stretch Bed during the May 2026 Utopia Homelands delivery',
      },
      quote: {
        text: 'Good for me and comfy, easy to put together.',
        name: 'Dorrie Jones',
        context: 'Arlparra, Utopia Homelands',
      },
      proof: [
        { label: 'Stretch Beds', value: '147', note: 'Current canonical community count' },
        { label: 'May journey', value: '2026', note: 'Building and family-by-family delivery' },
        { label: 'First module', value: '1', note: 'Shredder pathway to confirm with Jane' },
      ],
      story: [
        {
          title: 'Build before delivery',
          body: 'Young people from the Oonchiumpa network assembled Stretch Beds in Alice Springs before the journey east.',
        },
        {
          title: 'Deliver through local relationships',
          body: 'Local teams helped identify households, unload components and set beds up across the homelands.',
        },
        {
          title: 'Let the next request stay specific',
          body: 'The next conversation is not about selling a complete facility. It is about what a shredder would enable, who would operate it and what support Urapuntja wants.',
        },
      ],
      gallery: [
        { src: '/images/utopia/utopia-01.jpg', alt: 'Beds arriving during the May 2026 Utopia Homelands delivery' },
        { src: '/images/utopia/utopia-05.jpg', alt: 'A Stretch Bed set up during the Utopia Homelands delivery' },
        { src: '/images/utopia/utopia-09.jpg', alt: 'Two women testing a Stretch Bed in a Utopia Homelands home' },
      ],
      links: [
        {
          label: 'Read the full field note',
          href: '/field-notes/utopia-may-2026',
          note: 'The build, the road east and what happened in community',
        },
      ],
      nextAsk:
        'Fund and support a community-confirmed shredder module only after the operator, site, feedstock, safety and maintenance pathway are agreed.',
      mediaBasis:
        'Media shown here comes only from the place-attributed May 2026 Utopia delivery set. Pending story-folder images and unverified community video are excluded.',
      statusNote:
        'The journey and relationship are verified. The shredder remains a working request to scope and confirm with Jane and Urapuntja.',
    },
  },
  {
    id: 'oonchiumpa',
    name: 'Oonchiumpa',
    region: 'Alice Springs, NT',
    stage: 'fund',
    stageLabel: 'Align scope and funding',
    relationship: 'Oonchiumpa and Goods on Country',
    communityLead: 'Oonchiumpa leadership and project team',
    leadOrganisation: 'Oonchiumpa Consultancy and Services',
    invitation: 'Build the complete community-owned production pathway already developed together.',
    nextDecision: 'Reconcile the DEWR scope and budget, then agree the funder-ready version.',
    evidenceState: 'community-confirmation',
    evidenceNote: 'The ownership direction and facility application are developed; final DEWR status and reconciliation are pending.',
    mediaState: 'verified',
    mediaNote: 'Oonchiumpa has approved the overall framing. Each external artifact still uses the recorded audience tier.',
    modules: [
      pathwayModule('facility', 'Complete production facility', 'Local shredding, pressing, CNC, training and operating support.', 'requested'),
      pathwayModule('youth', 'Youth pathways', 'Making, work experience and pathways aligned with Oonchiumpa programs.', 'requested'),
      pathwayModule('story', 'Community-owned evidence', 'Approved stories, media and learning returned to Oonchiumpa.', 'requested'),
      pathwayModule('repair', 'Repair and maintenance', 'Ongoing product support and local maintenance capability.', 'exploring'),
    ],
    nextActions: [
      'Confirm DEWR application status and final budget',
      'Lock the operator, facility and ownership structure',
      'Build public and funder-only evidence packs',
      'Agree the first delivery milestone',
    ],
    caseStudy: {
      eyebrow: 'The first complete ownership pathway',
      headline: 'Young people are already making. The next step is moving production locally.',
      summary:
        'Oonchiumpa and Goods on Country have moved beyond a hypothetical model. Young people have built Stretch Beds, local teams have led delivery into the homelands, and Oonchiumpa has developed a federal submission for a community-controlled production facility in Alice Springs.',
      hero: {
        src: '/images/community/alice-springs/oonchiumpa-team-red-bed.jpg',
        alt: 'The Oonchiumpa team with a completed red Stretch Bed in Alice Springs',
      },
      quote: {
        text: "We want to create a safe space for our young people. There's a lack of housing, which leads to a lack of sleep, which leads to low school attendance.",
        name: 'Kristy Bloomfield',
        context: 'Director, Oonchiumpa Consultancy',
      },
      proof: [
        { label: 'Partnership', value: '2 yrs', note: 'Cultural advice, youth programs and delivery' },
        { label: 'Ownership', value: '100%', note: 'Oonchiumpa is Aboriginal owned and led' },
        { label: 'Pathway', value: '1', note: 'Community-controlled production facility proposed' },
      ],
      story: [
        {
          title: 'Young people built the beds',
          body: 'Over two days behind the Oonchiumpa office, young men and young women built Stretch Beds from flat-pack components with Oonchiumpa workers.',
        },
        {
          title: 'The first value stayed with the builders',
          body: 'Every young person who built a bed kept one. The first thing the activity produced was theirs.',
        },
        {
          title: 'The pathway can become a workforce',
          body: 'The proposed facility connects local production, practical experience, contracts and an agreed transition toward community control.',
        },
      ],
      gallery: [
        { src: '/images/people/kristy-bloomfield.jpg', alt: 'Kristy Bloomfield, Director of Oonchiumpa Consultancy' },
        { src: '/images/people/mykel.jpg', alt: 'Mykel with the Stretch Bed he built in Alice Springs' },
        { src: '/images/people/fred-campbell.png', alt: 'Fred Campbell, Youth Case Worker with Oonchiumpa' },
      ],
      video: {
        src: '/video/partners/oonchiumpa/mykel-building-the-bed.mp4',
        poster: '/video/partners/oonchiumpa/mykel-building-the-bed-poster.jpg',
        title: 'Mykel builds his Stretch Bed',
      },
      links: [
        {
          label: 'See the Oonchiumpa partnership',
          href: '/partners/oonchiumpa',
          note: 'The full public partnership story, voices and delivery gallery',
        },
        {
          label: 'Read the Utopia field note',
          href: '/field-notes/utopia-may-2026',
          note: 'How the Alice Springs build connected to delivery into the homelands',
        },
      ],
      nextAsk:
        'Fund the transition from demonstrated building activity to a locally operated production facility: equipment, commissioning, training, materials and commercial systems.',
      mediaBasis:
        'Media shown here is limited to the verified Oonchiumpa team image, named portraits on the externally cleared register and Mykel’s approved public build video.',
      statusNote:
        'Oonchiumpa has approved the overall story and ownership framing. The REAL Innovation Fund decision and final budget reconciliation remain pending.',
    },
  },
  {
    id: 'palm-island',
    name: 'Palm Island',
    region: 'Manbarra Country, QLD',
    stage: 'listen',
    stageLabel: 'Begin with Council',
    relationship: 'Council-led introduction',
    communityLead: 'Emma Bradbury, CEO; Alf Lacey; community contacts to be confirmed',
    leadOrganisation: 'Palm Island Aboriginal Shire Council',
    invitation: 'Listen first and only assemble options after Council and community define the opportunity.',
    nextDecision: 'Confirm the right people, decision process and first listening conversation.',
    evidenceState: 'not-assessed',
    evidenceNote: 'No community capability audit has been completed. Existing Goods relationships must not be treated as a request.',
    mediaState: 'not-assessed',
    mediaNote: 'No media is assigned to this pathway until place, people and permissions are verified.',
    modules: [
      pathwayModule('listen', 'Listening and capability audit', 'A facilitated conversation and map of existing strengths and priorities.', 'requested'),
      pathwayModule('beds', 'Beds and local delivery', 'Explore need, procurement and local participation only if requested.', 'not-assessed'),
      pathwayModule('shredder', 'Plastic and shredding', 'Explore local waste streams and capability only if requested.', 'not-assessed'),
      pathwayModule('facility', 'Local production', 'A later option, not a current proposal.', 'not-assessed'),
    ],
    nextActions: [
      'Confirm Council leadership and preferred contact route',
      'Hold the first listening conversation',
      'Map existing services, assets and community priorities',
      'Return a plain-language summary before proposing modules',
    ],
  },
];

export function communityPathway(id: string) {
  return COMMUNITY_PATHWAYS.find((pathway) => pathway.id === id);
}
