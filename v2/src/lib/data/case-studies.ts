/**
 * CASE STUDIES — "how we did it" packs, one per PROVEN run.
 *
 * The rule (Ben, 2026-08-06): a case study exists only for work that is delivered,
 * reconciled and consent-cleared. It is written for two readers at once: a community or
 * organisation asking "how would this work for us", and a funder asking "has this actually
 * happened". Counts derive from the register (COMMUNITY_BED_CANON / community-record);
 * quotes render from the storyteller registry (cleared tiers only); invoice numbers and
 * dollar amounts NEVER appear here (one-money-surface rule; commercial terms are the
 * partner's business).
 *
 * Maningrida is the template. Alice Springs (Oonchiumpa) and Tennant Creek follow the same
 * shape once their stories are cleared the same way.
 */

export interface CaseStudyStep {
  title: string;
  body: string;
  photo?: { src: string; alt: string };
}

export interface CaseStudy {
  slug: string;
  /** COMMUNITY_BED_CANON id, so counts derive from the register. */
  communityId: string;
  place: string;
  country: string;
  title: string;
  standfirst: string;
  hero: { src: string; alt: string };
  /**
   * The commissioning partner. `nameCleared: false` renders the role only, never the name —
   * flip it when Ben confirms the org is happy to be named on a public page.
   */
  partner: { name: string; role: string; nameCleared: boolean };
  /** The arc, told as steps another community can follow. */
  steps: CaseStudyStep[];
  /** Storyteller-registry names whose cleared quotes carry the voice of this run. */
  voiceNames: string[];
  /** What happened AFTER delivery — the momentum section. Facts only, no promises. */
  momentum: string[];
  /** The community-facing "how to bring this to your community" ladder. */
  forCommunities: string[];
  /** canon-videos key for the film; renders a coming-soon slot until the key resolves. */
  videoKey: string;
  published: boolean;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'maningrida',
    communityId: 'maningrida',
    place: 'Maningrida',
    country: 'Manayingkarírra, Arnhem Land NT',
    title: 'Forty beds, pressed at the farm, assembled in community',
    standfirst:
      'A community-controlled organisation asked for beds and washing machines for homeland families. We pressed and packed the parts at our own facility, sent them north, and young people assembled every bed in community. It is the run that proves the making.',
    hero: {
      src: '/images/community/maningrida/whole-run-at-sunset.jpg',
      alt: 'The whole Maningrida bed run at sunset',
    },
    partner: {
      name: 'Homeland School Company',
      role: 'a community-controlled homeland education organisation',
      // Ben, 2026-08-06: "Homeland School, yes 100%. They are going to be the public case
      // study" — and we reach out to them as the film finishes.
      nameCleared: true,
    },
    steps: [
      {
        title: 'It started with their ask',
        body: 'The organisation came to Goods with a specific request for homeland families: durable beds and washing machines that survive distance, dust and crowded houses. The order, the timing and the destination were theirs. Nothing was pitched at them.',
        photo: { src: '/images/community/maningrida/unrolling-canvas-with-elder.jpg', alt: 'Unrolling canvas with an Elder' },
      },
      {
        title: 'The parts were made, not bought',
        body: 'At our production facility at the farm we pressed the recycled-plastic stock, routed the X-frame legs and packed complete kits for forty Stretch Beds. Canvases were sewn by a family business in Alice Springs. Shredded HDPE came from Defy Design.',
        photo: { src: '/images/process/heat-press-full.jpg', alt: 'The heat press at the farm' },
      },
      {
        title: 'Community assembled every bed',
        body: 'The kits travelled to Maningrida and young people assembled the forty beds with community, learning the build as they went. A bed that assembles in about five minutes with no tools is a bed a community can own the making of.',
        photo: { src: '/images/community/maningrida/gamardi-build-day-wide.jpg', alt: 'Build day at Gamardi' },
      },
      {
        title: 'The beds stayed, and so did the machines',
        body: 'Every bed is in a home and on the register. Washing machines went into community on the same run, joining the machines already working there.',
        photo: { src: '/images/community/maningrida/kids-carrying-orange-bed.jpg', alt: 'Kids carrying an orange Stretch Bed' },
      },
    ],
    voiceNames: ['Shayne Bloomfield'],
    momentum: [
      'The making is proven; the next run is the measured one, timed and costed with receipts, which is the first thing the current raise buys.',
      'The washing machines in community are the live prototype fleet for Pakkimjalki Kari.',
      'What Maningrida asked for next belongs to Maningrida to say; when they say it, it will be here.',
    ],
    forCommunities: [
      'It starts with your ask, not our pitch: what would your families want first, beds, machines, or the making itself?',
      'A delivery run like this one needs a local organisation to hold it: a school company, a corporation, a council program.',
      'Young people can assemble every bed; the build is designed to be taught in a day.',
      'Owning the making is a pathway, not a purchase: collection, shredding, pressing, assembly can each move to community, one machine at a time.',
    ],
    videoKey: 'video-maningrida-case-study',
    published: true,
  },
  {
    // ALICE SPRINGS — the second proven run, and the one that proves a different thing.
    // Maningrida proves the MAKING (parts pressed at our facility, shipped, assembled in
    // community). Alice proves the WORK: young people paid to build, with a community-
    // controlled organisation holding the program and choosing where the beds went.
    //
    // Counts: COMMUNITY_BED_CANON has alice-springs at 1 Basket / 15 Stretch = 16, which is
    // what STAYED in Alice. The same build also produced the 87 beds that went out to the
    // Utopia homelands — those are counted against Utopia, not here, and the copy below is
    // careful not to claim them twice.
    //
    // videoKey points at a slot that is deliberately EMPTY. There is Oonchiumpa build
    // footage in Empathy Ledger, but the only resolved build slot (video-build) is
    // dataClass red / consent gated, so wiring it here would put gated footage on a public
    // page. The empty slot renders the honest "being cut" card instead, exactly as
    // Maningrida's did until its film cleared.
    slug: 'alice-springs',
    communityId: 'alice-springs',
    place: 'Alice Springs',
    country: 'Mparntwe, Central Australia NT',
    title: 'Young people built the beds, and got paid to do it',
    standfirst:
      'Oonchiumpa brought young people in for two days out the back of their office in Alice Springs. They built Stretch Beds from flat-pack, kept one each, and loaded the rest onto the truck. It is the run that proves the work, not just the product.',
    hero: {
      src: '/images/community/alice-springs/oonchiumpa-team-red-bed.jpg',
      alt: 'The Oonchiumpa team with a finished red Stretch Bed in Alice Springs',
    },
    partner: {
      name: 'Oonchiumpa Consultancy',
      role: 'an Aboriginal-owned consultancy and youth service in Alice Springs',
      // Named publicly on /partners/oonchiumpa, which carries the partnership story.
      nameCleared: true,
    },
    steps: [
      {
        title: 'Oonchiumpa held the program',
        body: 'Who got picked up each morning, what the room felt like, which households the beds would go to: all of that was Oonchiumpa. They are an Aboriginal-owned organisation already working with these young people, so the build sat inside a relationship that existed long before Goods turned up.',
        photo: { src: '/images/community/alice-springs/oonchiumpa-office-joy.jpg', alt: 'The Oonchiumpa office in Alice Springs' },
      },
      {
        title: 'Two days, and every builder kept one',
        body: 'Young men and young women built Stretch Beds from flat-pack over two days, supported by Oonchiumpa workers. Every young person who built a bed kept a bed. That is the part that changes the room: it is not a work experience placement, it is your bed, and you made it.',
        photo: { src: '/images/community/alice-springs/frame-build-camp.jpg', alt: 'Building a Stretch Bed frame' },
      },
      {
        title: 'The rest went out on the truck',
        body: 'Oonchiumpa chose where the remaining beds went and local teams led the runs out to the homelands the next morning. Sixteen beds stayed in Alice Springs. The materials were paid for by Centrecorp Foundation, an Aboriginal Trust in the Northern Territory.',
        photo: { src: '/images/community/alice-springs/stretch-bed-two-generations.jpg', alt: 'Two generations with a Stretch Bed' },
      },
      {
        title: 'The work carried on after the truck left',
        body: 'The build became paid work for some of the young people involved, and the skills stayed with them. A bed that assembles in about five minutes with no tools is a bed that can be taught in a day and taught again by the person who learned it.',
        photo: { src: '/images/community/alice-springs/stretch-bed-kids-pile.jpg', alt: 'Kids on a finished Stretch Bed' },
      },
    ],
    voiceNames: ['Kristy Bloomfield', 'Fred Campbell'],
    momentum: [
      'Paid roles are already standing up through Oonchiumpa, which is what a pathway to owning the work looks like at the start of it.',
      'The young people who built beds here are the same cohort who could teach the next build, in Alice or further out.',
      'A conversation about community ownership of the making is open with Oonchiumpa; where it lands is theirs to say.',
    ],
    forCommunities: [
      'It starts with a local organisation that already holds relationships with the young people, not with a bed order.',
      'Two days is enough to teach the build; the flat-pack is designed so no tools and no trade background are needed.',
      'Every builder keeping their own bed is not a nice extra, it is the thing that makes the room work.',
      'Who the remaining beds go to should be decided by the organisation that knows the households, not by us.',
    ],
    videoKey: 'video-alice-build-case-study',
    published: true,
  },
];

export function caseStudy(slug: string): CaseStudy | null {
  return CASE_STUDIES.find((c) => c.slug === slug && c.published) ?? null;
}
