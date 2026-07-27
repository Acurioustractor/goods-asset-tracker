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

/**
 * THE NEXT PHASE - what working with this community actually looks like from here.
 *
 * Distinct from `caseStudy`, which is retrospective and is what the public pathway pages render.
 * This is forward-looking and answers the question a funder and a partner both ask: what happens
 * next, what does it cost, who ends up owning it, and what is stopping it.
 *
 * Two fields exist because of specific failures rather than for completeness:
 *
 *   `isNot` - every one of these pathways has been misread in the same direction, as a facility
 *   proposal. Utopia is one shredder. Tennant Creek is one small activity. Palm Island is a
 *   conversation. Stating what the next phase is NOT is what stops the module model collapsing
 *   back into the plant model it replaced (ruling D).
 *
 *   `cost.status` - `blocked-on-people` and `wrong-answer` are not the same as "unknown", and
 *   flattening them into a blank cell is how a real finding gets lost. Palm Island prices at $0
 *   because the model has no governance line, and $0 is the WRONG answer, recorded as such.
 *   Neither blockage is fixable by estimating harder.
 *
 * Figures here MIRROR the module cost engine (`lib/cost-model/engine.ts` and
 * `cost-model-scenarios.json`), which is where they are computed. `costSource` names the origin
 * for every one. Do not tune a number here to make a page read better.
 */
export type NextPhaseCostStatus =
  /** The engine prices it. */
  | 'modelled'
  /** Priceable in principle, but the input is a person's decision to make, not ours to estimate. */
  | 'blocked-on-people'
  /** The engine returns a number that is known to be wrong, and the wrongness is the finding. */
  | 'wrong-answer';

export interface NextPhaseCost {
  capexLow: number | null;
  capexHigh: number | null;
  operatingPerYear: number | null;
  status: NextPhaseCostStatus;
  /** Where the figure is computed. Never "estimated by hand". */
  costSource: string;
  note: string;
}

export interface NextPhase {
  /** What the next phase is, in one line. */
  headline: string;
  /** What it is not. Guards against the facility misread. */
  isNot: string;
  /** Module ids from MODULES that this phase actually involves. */
  modules: string[];
  cost: NextPhaseCost;
  /** Who holds what at the end of this phase. */
  ownsWhat: string;
  /** What is stopping it, and whose call it is. */
  blockedOn: string;
  /** What we are asking for. */
  ask: string;
}

/**
 * THE HISTORY LAYER - the dated receipts behind a case study.
 *
 * `caseStudy.story` holds thematic beats; nothing held WHEN things happened. The timeline of
 * deliveries, builds and decisions per community lived scattered across canon definitions and
 * evidence notes, which meant no surface could show a community's receipts chronologically.
 *
 * Rules: every entry is a thing that HAPPENED (never an intention), `date` is 'YYYY' or
 * 'YYYY-MM' (only as precise as the source supports), and `source` names where the fact is
 * recorded - a canon id, a file, a register. No entry may be added from memory alone.
 */
export interface HistoryEvent {
  /** 'YYYY' or 'YYYY-MM'. Only as precise as the source supports. */
  date: string;
  event: string;
  /** Where this fact is recorded: canon id, file, register. */
  source: string;
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
  /** Dated receipts, oldest first. See the HistoryEvent docblock. */
  history: HistoryEvent[];
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
  /** Forward-looking. See the NextPhase docblock. */
  nextPhase?: NextPhase;
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
    history: [
      {
        date: '2026',
        event: 'A Goods washing machine delivered to Our Community Shed; a Stretch Bed recorded at the Barkly Youth Centre (+1 in the register, Ben ruling 2026-07-19). Nine Pakkimjalki Kari in community. Month not recorded, so the bare year is the honest date.',
        source: "canon 'beds-deployed' and 'washing-machines' definitions; pilot.verified",
      },
      {
        date: '2026-02',
        event: 'Two-stage, 12-month trial proposal developed with Our Community Shed, priced at $234,000 excluding GST. Still documented; explicitly not the next step.',
        source: 'pilot.verified in this file',
      },
    ],
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
    nextPhase: {
      headline:
        'One small operational pilot, chosen by the Shed and the Youth Centre: a facilitated build or repair activity with local young people.',
      isNot:
        'Not the two-stage facility from the February proposal. That proposal still exists and is not the next step.',
      modules: ['products', 'skills', 'people'],
      cost: {
        capexLow: null,
        capexHigh: null,
        operatingPerYear: null,
        status: 'blocked-on-people',
        costSource: 'Priceable at module level once scope is confirmed. Not priced.',
        note: 'The number depends on what the partner supplies, which is their call to make and not ours to estimate. The February two-stage proposal was $234,000 excluding GST and is the old scope, not this one.',
      },
      ownsWhat:
        'Our Community Shed and the Youth Centre hold the activity, the site and the local relationships. Goods supplies facilitation and materials.',
      blockedOn:
        'People, not numbers. Five things are recorded as assumptions rather than facts: whether the Shed still wants the same pathway, whether the CBF compliance issue is resolved, whether the Youth Centre wants a formal role, whether the old pricing holds, and whether existing bed-building media may be reused.',
      ask: 'Support one reconnection phase designed with community, then cost only the small test they choose.',
    },
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
        'Support one reconnection phase, designed with community, then cost only the small operational test the Shed and Youth Centre choose.',
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
    history: [
      {
        date: '2026-05',
        event: 'The May journey: Stretch Beds built in Alice Springs with young people from the Oonchiumpa network, then delivered family-by-family across the homelands with local teams. 147 beds confirmed in community.',
        source: "caseStudy.story in this file; per-community ledger (wiki/investor/10-community-counts.md); field note /field-notes/utopia-may-2026",
      },
      {
        date: '2026-07',
        event: 'Jane Wilson opened the conversation about practical opportunities for young people, including what a shredder could make possible locally. The shredder module priced at $24,800 - $39,300 capex.',
        source: 'nextPhase.cost in this file (priceModuleSelection, cost-model-scenarios.json)',
      },
    ],
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
    nextPhase: {
      headline:
        'One machine. A shredder with training, safe operation and a maintenance pathway.',
      isNot:
        'Not a complete production facility. That is marked later, and only if community chooses it.',
      modules: ['equipment', 'skills', 'people'],
      cost: {
        capexLow: 24800,
        capexHigh: 39300,
        operatingPerYear: 16043,
        status: 'modelled',
        costSource:
          'priceModuleSelection() and priceModuleOperating(), capex_modules in cost-model-scenarios.json',
        note: 'The pathway the old build-path ladder could not cost at all, against $79,333/yr for a full facility. Operating is the $35,000/yr site floor apportioned plus the chosen modules. The width of the capex band is almost entirely one question: whether a baler is needed, given rigid HDPE is normally caged rather than baled. Collection is a $5,000 to $19,500 estimate, priced the way the DEWR budget already treats its own unquoted lines.',
      },
      ownsWhat:
        'Urapuntja owns the machine. Goods supplies training, the maintenance pathway and parts.',
      blockedOn:
        'A real collection quote to narrow the band, and confirming the baler question. Both answerable without a measured run.',
      ask: 'Fund a community-confirmed shredder module, only after the operator, site, feedstock, safety and maintenance pathway are agreed.',
    },
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
    history: [
      {
        date: '2024',
        event: 'Partnership begins: cultural advice, youth programs and delivery. Two years old as of the 2026 case study.',
        source: 'caseStudy.proof in this file',
      },
      {
        date: '2026',
        event: 'A federal (DEWR) submission developed for a community-controlled production facility in Alice Springs; scope and budget reconciliation pending. Month not recorded, so the bare year is the honest date.',
        source: 'caseStudy.summary and nextPhase.blockedOn in this file',
      },
      {
        date: '2026-05',
        event: 'The build days: over two days behind the Oonchiumpa office, young men and young women built Stretch Beds from flat-pack components with Oonchiumpa workers, then the beds travelled east to the homelands. Every young person who built a bed kept one.',
        source: "caseStudy.story in this file; Mykel's build video /video/partners/oonchiumpa/mykel-building-the-bed.mp4",
      },
    ],
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
    nextPhase: {
      headline:
        'The first transfer. The complete production pathway, and the site where ownership stops being a claim and becomes testable.',
      isNot:
        'Not a pilot. This is the only pathway of the four that has asked for a whole facility, and the only one where the month-6 ownership test will have an eligible site.',
      modules: ['place', 'equipment', 'products', 'skills', 'people', 'systems', 'enterprise', 'story'],
      cost: {
        capexLow: null,
        capexHigh: null,
        operatingPerYear: null,
        status: 'modelled',
        costSource:
          'Prices in full through priceModuleSelection() and priceModuleOperating(). Computed there, deliberately not mirrored here, because the scope is still being reconciled against DEWR.',
        note: 'The site production block runs $79,333/yr bare. Where it actually lands is decided by one open question, who pays the line supervisor, which moves the denominator from 234 to 529 beds a year. That is the biggest dial in the model and it is not an Oonchiumpa question, it is ours.',
      },
      ownsWhat:
        'The direction to test, and it is not yet a decision: the Oonchiumpa production entity is the seller, with Goods. as its supplier and service provider. Under that reading 51% stops being a governance concession and becomes the handover executing. OONCHIUMPA HAS NOT BEEN ASKED.',
      blockedOn:
        'Reconciling the DEWR scope and budget, then agreeing the funder-ready version. Separately, the seller-of-record direction needs MinterEllison as a legal question and Kristy as a conversation, and a conflicts register if Kristy chairs Butterfly while directing Oonchiumpa.',
      ask: 'Agree the reconciled scope, and test the seller-of-record direction with the people it affects before it appears in any document.',
    },
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
    // The proof pathway. Maningrida is the only community where a full delivery has already
    // run end to end: 40 Stretch Beds (the register's biggest single-community build,
    // Jul 2026) and 8 Pakkimjalki Kari washing machines, built with the Gamardi community
    // and Homeland School Company. It enters this file at 'learn' because the work is done
    // and the open questions are review questions: film consent, and what Maningrida wants
    // next. No caseStudy block yet - no named community voice is on the cleared register,
    // and a quote is never invented to fill the field.
    id: 'maningrida',
    name: 'Maningrida',
    region: 'Gamardi, West Arnhem Land, NT',
    stage: 'learn',
    stageLabel: 'Delivered, reviewing together',
    relationship: 'Gamardi community and Homeland School Company',
    communityLead: 'Gamardi community leadership; contacts held via Homeland School Company',
    leadOrganisation: 'Homeland School Company',
    invitation: 'Return the story for community approval, and hear what Maningrida wants next.',
    nextDecision: 'Confirm production consent for the July 2026 film, then ask what the community wants to build on from the delivery.',
    evidenceState: 'verified',
    evidenceNote: 'The delivery is in the register: 40 Stretch Beds (Jul 2026, the biggest single-community build) and 8 washing machines including the school unit. In-house pressing of the 40 beds is the proof of the production process.',
    mediaState: 'community-confirmation',
    mediaNote: 'Ten committed trip photos and a produced 3:53 film exist. The film is a reference cut gated on the full-resolution master, production consent for children and unnamed adults on camera, and caption name fixes (Gamardi, Goods on Country) before public use.',
    history: [
      {
        date: '2026-07',
        event: 'The biggest single-community build: 40 Stretch Beds pressed in-house and built with the Gamardi community and Homeland School Company, plus the school washing machine. Eight Pakkimjalki Kari in community. The trip filmed as the 3:53 feature.',
        source: "canon 'beds-deployed' (+40 Jul 2026) and 'washing-machines' (Maningrida 8) definitions; home.ts HOME_FEATURE_VIDEO",
      },
    ],
    modules: [
      pathwayModule('beds', 'Beds delivered', '40 Stretch Beds built and delivered with community in July 2026.', 'requested'),
      pathwayModule('washers', 'Washing machines', '8 Pakkimjalki Kari in community, including the school unit.', 'requested'),
      pathwayModule('story', 'Community-approved story', 'The trip film and photos, returned for approval before any public use.', 'exploring'),
      pathwayModule('next', 'What comes next', 'Repair, more delivery or local making - defined by community, not proposed by Goods.', 'not-assessed'),
    ],
    nextActions: [
      'Swap the full-resolution film master in at the committed path',
      'Confirm production consent for everyone on camera, children first',
      'Fix the caption names and return the film for community review',
      'Tag the trip media to the community in the Empathy Ledger',
      'Hold the review conversation: what worked, what Maningrida wants next',
    ],
    nextPhase: {
      headline:
        'Close the loop on the biggest delivery: community approval of the story, and a conversation about what comes after it.',
      isNot:
        'Not a facility proposal and not a new delivery. The delivery already happened; the next phase is review and community direction, and nothing is proposed until that conversation has run.',
      modules: ['story'],
      cost: {
        capexLow: null,
        capexHigh: null,
        operatingPerYear: null,
        status: 'blocked-on-people',
        costSource: 'Nothing to price until community names what comes next. Not priced.',
        note: 'The open items are consent and direction, not equipment. Whatever Maningrida asks for next gets priced through the module engine when it is asked for.',
      },
      ownsWhat:
        'The community holds the beds, the washing machines and the decision about the story. Goods holds the footage until consent is confirmed, and publishes nothing before it is.',
      blockedOn:
        'Production consent for the film, the full-resolution master, and the review conversation with Gamardi and Homeland School Company.',
      ask: 'Support the consent and review loop, so the strongest delivery evidence in the system can be told with community approval.',
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
    evidenceState: 'community-confirmation',
    evidenceNote: 'The delivery history is real and recorded: 131 beds and 4 washing machines, with Ebony and Jahvan Oui training as future manufacturing leads. Six external-cleared Palm Island voices are on the registry. No community capability audit has been completed, and that history must not be treated as a request.',
    mediaState: 'community-confirmation',
    mediaNote: 'Six cleared voices (Ivy, Alfred Johnson, Carmelita & Colette, Daniel Patrick Noble, Jason, Jahvan Oui), five portraits, twelve committed delivery photos and the cleared Jahvan washing-machine video (descript-videos.ts). The Empathy Ledger also holds 51 Palm Island storytellers, mostly the historical archive project - check project scope and consent before using any of those.',
    history: [
      {
        date: '2026',
        event: '131 beds and 4 Pakkimjalki Kari recorded in community over the relationship, delivered with PICC. Ebony and Jahvan Oui training with Defy Design as future manufacturing leads, including Jahvan\'s visit to the Defy factory in Sydney.',
        source: "compendium.ts community row (131 beds, 4 washers, PICC); canon 'washing-machines' definition",
      },
      {
        date: '2026-06',
        event: 'Five Palm Island voices cleared for external use in the consent pass: Ivy, Alfred Johnson, Carmelita & Colette, Daniel Patrick Noble, Jason - the barge-freight economics told first-hand.',
        source: "canon 'cleared-voices' (2026-06-17 pass); storyteller-registry.ts",
      },
      {
        date: '2026-07',
        event: 'The washing-machine delivery filmed with Jahvan; the video cleared and Jahvan added as the 35th external voice, with his quotes taken verbatim from the film.',
        source: 'descript-videos.ts viewId 6hVl3CzxdqR; storyteller-registry.ts jahvan-oui',
      },
    ],
    modules: [
      pathwayModule('listen', 'Listening and capability audit', 'A facilitated conversation and map of existing strengths and priorities.', 'requested'),
      pathwayModule('beds', 'Beds and local delivery', 'Explore need, procurement and local participation only if requested.', 'not-assessed'),
      pathwayModule('shredder', 'Plastic and shredding', 'Explore local waste streams and capability only if requested.', 'not-assessed'),
      pathwayModule('facility', 'Local production', 'A later option, not a current proposal.', 'not-assessed'),
    ],
    nextActions: [
      'Confirm Council leadership and preferred contact route',
      'Transcribe the Jahvan video and add his verbatim quotes to the registry',
      'Review the Empathy Ledger Palm Island voice archive for project scope and consent',
      'Hold the first listening conversation',
      'Map existing services, assets and community priorities',
      'Return a plain-language summary before proposing modules',
    ],
    nextPhase: {
      headline:
        'A listening conversation, and a plain-language summary returned to Council before anything is proposed.',
      isNot:
        'Not a bed order and not a proposal. Every module except listening is marked not assessed, and existing Goods relationships must not be treated as a request.',
      modules: ['story'],
      cost: {
        capexLow: 0,
        capexHigh: 0,
        operatingPerYear: 0,
        status: 'wrong-answer',
        costSource: 'priceModuleSelection() returns $0 for a listening-only selection.',
        note: 'RECORDED AS THE WRONG ANSWER, NOT A GOOD ONE. Listening, governance and the time of the people doing it have a real cost, and the model has no line that is not plant. That gap is the finding. This is the pathway that tests whether the six stages are real, because it is the only one starting from zero.',
      },
      ownsWhat:
        'Council holds the process and the decision about who is in the room. Nothing is transferred at this stage because nothing has been built.',
      blockedOn:
        'Confirming the right people and the decision process. No capability audit has been completed, and no media is assigned to this pathway until place, people and permissions are verified.',
      ask: 'Fund the listening, and build the governance cost line the model is missing.',
    },
    // The caseStudy is retrospective and every word of it is already cleared: six external
    // voices, five portraits, twelve committed delivery photos. It coexists with the
    // listening-first stance above - the history is told, and the history is still not a request.
    caseStudy: {
      eyebrow: 'Begin with governance and listening',
      headline: 'The beds are already here. What comes next is Palm Island\'s call.',
      summary:
        'Palm Island carries one of the deepest Goods delivery histories: 131 beds, 4 washing machines, and six community voices cleared to tell it - from the barge-freight economics that make local making matter, to Jahvan Oui training to run production himself. None of that history is treated as a request. The next pathway is defined by Council and community, starting with listening.',
      hero: {
        src: '/images/community/palm-island/bedding-golden-hour.jpg',
        alt: 'Bedding laid out at golden hour during a Palm Island delivery',
      },
      quote: {
        text: 'When it comes from an Aboriginal person, it works. That\'s what makes the difference.',
        name: 'Jason',
        context: 'Palm Island',
      },
      proof: [
        { label: 'Stretch and Basket Beds', value: '131', note: 'Register count for Palm Island' },
        { label: 'Pakkimjalki Kari', value: '4', note: 'Washing machines in community' },
        { label: 'Cleared voices', value: '6', note: 'External-cleared Palm Island storytellers on the registry' },
      ],
      story: [
        {
          title: 'The freight is the argument',
          body: 'Everything comes over on the barge, and the cost forces families toward cheap beds that fail within a year or two. Alfred Johnson, Daniel Patrick Noble and Carmelita & Colette all tell the same economics from different ends of it.',
        },
        {
          title: 'A maker is already training',
          body: 'Jahvan Oui, a Goods team member from Palm Island, is training with Defy Design toward running production himself - the ownership pathway with a name and a face.',
        },
        {
          title: 'The next step is deliberately not a proposal',
          body: 'No capability audit has been done and the delivery history is not treated as a request. The pathway starts with Council, listening, and a plain-language summary returned before anything is proposed.',
        },
      ],
      gallery: [
        { src: '/images/people/alfred-johnson.jpg', alt: 'Alfred Johnson, Palm Island community voice' },
        { src: '/images/people/carmelita-colette.jpg', alt: 'Carmelita and Colette, Palm Island community voices' },
        { src: '/images/people/jahvan-oui.jpg', alt: 'Jahvan Oui, Goods team member and future manufacturing lead from Palm Island' },
      ],
      links: [
        {
          label: 'See the live pathway',
          href: '#support-menu',
          note: 'Listening first; modules only after Council and community define the opportunity',
        },
      ],
      nextAsk:
        'Fund the listening phase and the governance work, so the first proposal on Palm Island is the one community writes.',
      mediaBasis:
        'Every quote is verbatim from the externally cleared voice register; photos are the committed Palm Island delivery set and cleared portraits. The wider Empathy Ledger Palm Island archive (51 storytellers) is a different project and is not drawn on here.',
      statusNote:
        'Delivery history and voices are verified. No capability audit exists, and no module beyond listening has been requested by community.',
    },
  },
];

export function communityPathway(id: string) {
  return COMMUNITY_PATHWAYS.find((pathway) => pathway.id === id);
}
