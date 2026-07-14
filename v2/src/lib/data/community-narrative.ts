import type { PhotoCandidate } from './pitch-photo-review';

export const communityNarrativeUpdated = '9 July 2026';

const local = (
  src: string,
  label: string,
  note?: string,
  tags?: string[],
): PhotoCandidate => ({ src, label, source: 'local', note, tags });

export const narrativePrinciples = [
  {
    principle: 'Community voice before Goods claims',
    meaning:
      'Let people name the problem first. Goods should then show what it has built in response.',
  },
  {
    principle: 'One belief turn at a time',
    meaning:
      'Each section should change one investor belief: the need is real, the product works, the model can transfer, or the next capital is worthwhile.',
  },
  {
    principle: 'Proof beats polish',
    meaning:
      'Use real build, delivery, home, plant, and map images before abstract diagrams or brand language.',
  },
  {
    principle: 'Pathway language over finished claims',
    meaning:
      'Say what is true now, what is being built next, and what remains to be agreed with partners.',
  },
  {
    principle: 'Quotes carry decisions',
    meaning:
      'Use quotes to answer investor doubts, not as decoration. Every quote should earn its slide.',
  },
];

export const leadNarrative = {
  label: 'Lead narrative',
  headline: 'A bed off the ground is the first proof of a bigger transfer.',
  summary:
    'Goods is proving that community knowledge can become durable health hardware, local making, and production capability that moves closer to community ownership over time.',
  proofFrame:
    'Oonchiumpa and Utopia show the pattern clearly: young people built beds, local teams led delivery, families asked for more, and the plant gives the work somewhere to go next.',
  sections: [
    {
      id: 'why',
      label: 'Why',
      headline: 'Remote communities are not short on knowledge. They are short on goods that work where they live.',
      body:
        'The problem shows up as floor sleeping, broken products, freight costs, dirty bedding, crowded houses, and families making do. The strongest pitch starts with people naming those conditions in their own words.',
      investorBelief:
        'This is a real demand problem with names, places, and repeated patterns, not an abstract need.',
      communityVoices: ['Ivy', 'Alfred Johnson', 'Katrina Bloomfield', 'Linda Turner'],
      proof: [
        'Palm Island voices name the lack of beds and the freight burden.',
        'Utopia households asked for two or three beds after seeing the product.',
        'Tennant Creek voices explain why being asked matters.',
      ],
      photo: local('/images/stories/utopia/08-beforeafter.jpg', 'Before and after sleeping setup'),
    },
    {
      id: 'what',
      label: 'What',
      headline: 'The Stretch Bed is the first product: washable, flat-packable, and made for remote conditions.',
      body:
        'It is not pitched as furniture. It is a practical product families can assemble, wash, move, repair, and use in hot, dusty, high-use homes. The product proof gives investors confidence that Goods can build from community feedback into a real asset.',
      investorBelief:
        'Goods has a specific product that works now, with clear specs, field use, and buyer logic.',
      communityVoices: ['Mykel', 'Dorrie Jones', 'Melissa Jackson', 'Annie Morrison'],
      proof: [
        'The current Stretch Bed is 26kg, no-tools assembly, 200kg capacity, recycled HDPE legs, galvanised steel poles, and canvas.',
        'People using the bed describe comfort, ease, and wanting more.',
        'Product feedback is already shaping lower and older-person-friendly needs.',
      ],
      photo: local('/images/product/stretch-bed-hero.jpg', 'Stretch Bed product hero'),
    },
    {
      id: 'how',
      label: 'How',
      headline: 'The plant turns product proof into a pathway for local work and community-held production.',
      body:
        'The model is not just more deliveries from a central supplier. Goods can transfer the plant workflow, product documentation, quality practice, supply links, repair knowledge, and sales learning place by place.',
      investorBelief:
        'Capital funds the bridge from field proof to a repeatable operating model that communities can hold over time.',
      communityVoices: ['Fred Campbell', 'Xavier', 'Karen Liddle', 'Shayne Bloomfield'],
      proof: [
        'Oonchiumpa held the young people, build day, and Utopia delivery relationships.',
        'Young people built beds they slept on, then kept building for the homelands.',
        'The containerised plant makes the production pathway visible and transferable.',
      ],
      photo: local('/images/process/container-factory.jpg', 'Containerised production plant'),
    },
  ],
};

export interface CommunityTheme {
  id: string;
  title: string;
  whatWeAreHearing: string;
  investorMeaning: string;
  strongestVoices: string[];
  deckUse: string;
  photo: PhotoCandidate;
}

export const communityThemes: CommunityTheme[] = [
  {
    id: 'being-asked',
    title: 'People want to be asked properly',
    whatWeAreHearing:
      'Community members are clear that good work starts by listening to what families, Elders, and local organisations already know.',
    investorMeaning:
      'The operating model must be relationship-led. That reduces delivery risk and keeps Goods from pushing products that do not fit.',
    strongestVoices: ['Dianne Stokes', 'Linda Turner', 'Jimmy Frank', 'Jason', 'Karen Liddle'],
    deckUse: 'Use early, before the product, to show that the model starts with community authority.',
    photo: local('/images/people/dianne-stokes.jpg', 'Dianne Stokes'),
  },
  {
    id: 'beds-safety-rest',
    title: 'Beds mean safety, rest, and getting off the ground',
    whatWeAreHearing:
      'People are talking about floor sleeping, visitors without beds, back pain, feeling safer, and older people needing something lower and easier.',
    investorMeaning:
      'The bed is a simple product with a serious role in home conditions. It is concrete enough for buyers and funders to understand quickly.',
    strongestVoices: ['Ivy', 'Alfred Johnson', 'Katrina Bloomfield', 'Dorrie Jones', 'Brian Russell', 'Gloria Turner'],
    deckUse: 'Use in the Why and What sections to make the product need immediate and human.',
    photo: local('/images/stories/utopia/09-offground.jpg', 'Bed off the ground in home'),
  },
  {
    id: 'freight-failure',
    title: 'Remote freight changes the whole problem',
    whatWeAreHearing:
      'Basic goods are hard to buy, expensive to move, and often not designed for remote use, repair, dust, heat, or shared household conditions.',
    investorMeaning:
      'There is a market failure as well as a social need. Goods can win by designing for the conditions that mainstream supply ignores.',
    strongestVoices: ['Alfred Johnson', 'Daniel Patrick Noble', 'Ivy', 'Wayne Glenn'],
    deckUse: 'Use when explaining why standard beds and appliances are not enough.',
    photo: local('/images/people/alfred-johnson.jpg', 'Alfred Johnson'),
  },
  {
    id: 'washing-health-home',
    title: 'Washing, bedding, and health sit together',
    whatWeAreHearing:
      'Beds, blankets, clothes, washing machines, skin health, rest, and home conditions are connected in the way people talk about daily life.',
    investorMeaning:
      'The Stretch Bed is the first product in a wider health hardware platform, but claims should stay practical until evaluated outcomes exist.',
    strongestVoices: ['Patricia Frank', 'Cliff Plummer', 'Dr Boe Remenyi', 'Chloe', 'Carmelita & Colette'],
    deckUse: 'Use to place beds and Pakkimjalki Kari in the same system without over-claiming clinical outcomes.',
    photo: local('/images/media-pack/speed-queen-controls.jpg', 'Washing machine controls'),
  },
  {
    id: 'young-makers',
    title: 'Young people can make the product and teach others',
    whatWeAreHearing:
      'The build day matters because young people could see the pattern, make the bed, take pride in it, and imagine showing others.',
    investorMeaning:
      'The work pathway is believable when a trusted partner holds the young people and the next paid step is designed carefully.',
    strongestVoices: ['Mykel', 'Fred Campbell', 'Xavier', 'Heather Mundo', 'Kristy Bloomfield', 'Karen Liddle'],
    deckUse: 'Use as the bridge between product proof and the production pathway.',
    photo: local('/images/stories/utopia/04-build.jpg', 'Alice build with young people'),
  },
  {
    id: 'product-feedback',
    title: 'The product is useful because people can test it and talk back',
    whatWeAreHearing:
      'People talk about comfort, ease, height, assembly, sleeping better, and wanting one for themselves or family.',
    investorMeaning:
      'The feedback loop is a strategic asset. It helps Goods improve products and de-risk demand before scaling.',
    strongestVoices: ['Mykel', 'Dorrie Jones', 'Melissa Jackson', 'Annie Morrison', 'Heather Mundo', 'Mark'],
    deckUse: 'Use in product slides and investor Q and A to prove the bed is not just an idea.',
    photo: local('/images/media-pack/woman-on-red-stretch-bed.jpg', 'Stretch Bed in use'),
  },
  {
    id: 'local-leadership',
    title: 'Local messengers and partners carry trust',
    whatWeAreHearing:
      'People keep pointing to who can hold the room, explain the work, knock on doors, and make the next step feel safe.',
    investorMeaning:
      'Scale depends on partner quality, not just product supply. Investment should fund the relationship and governance layer, not only inventory.',
    strongestVoices: ['Fred Campbell', 'Karen Liddle', 'Kristy Bloomfield', 'Jason', 'Gary', 'Tracy McCartney'],
    deckUse: 'Use before the operating model to explain why Oonchiumpa is proof, not a side story.',
    photo: local('/images/partners/oonchiumpa.png', 'Oonchiumpa partner mark'),
  },
  {
    id: 'ownership-path',
    title: 'The bigger promise is community-held enterprise',
    whatWeAreHearing:
      'The language points toward independence, future children, local business, local messengers, and a long path for the partnership.',
    investorMeaning:
      'The investment is worthwhile when it funds assets, capability, governance, and supply chains that can stay closer to community.',
    strongestVoices: ['Shayne Bloomfield', 'Norman Frank', 'Linda Turner', 'Jimmy Frank', 'Dianne Stokes'],
    deckUse: 'Use in the How, Scale, and Ask sections to connect funding with ownership over time.',
    photo: local('/images/process/factory-panorama.jpg', 'Production plant panorama'),
  },
];

export const quoteDripSequence = [
  {
    moment: 'Open',
    belief: 'This is real work in real places.',
    voice: 'Mykel',
    quoteUse: 'A short human line that makes the bed feel alive before the model appears.',
    slideUse: 'Cover or first proof slide.',
    image: local('/images/people/mykel.jpg', 'Mykel with the bed he built'),
  },
  {
    moment: 'Why',
    belief: 'Families are naming the need clearly.',
    voice: 'Ivy',
    quoteUse: 'Use for the plain statement that there are not enough beds when family visits.',
    slideUse: 'Problem slide.',
    image: local('/images/people/ivy.jpg', 'Ivy, Palm Island'),
  },
  {
    moment: 'Why now',
    belief: 'The problem is made worse by remoteness and freight.',
    voice: 'Alfred Johnson',
    quoteUse: 'Use for the freight logic that turns a basic good into a structural cost.',
    slideUse: 'Market failure or remote supply slide.',
    image: local('/images/people/alfred-johnson.jpg', 'Alfred Johnson'),
  },
  {
    moment: 'What',
    belief: 'The product works for the people using it.',
    voice: 'Dorrie Jones',
    quoteUse: 'Use as the short home-use proof line after the specs.',
    slideUse: 'Product proof slide.',
    image: local('/images/stories/utopia/09-offground.jpg', 'Bed off the ground in home'),
  },
  {
    moment: 'How',
    belief: 'Young people can build it and teach the pattern.',
    voice: 'Fred Campbell',
    quoteUse: 'Use Fred to narrate Xavier until Xavier has his own full story record.',
    slideUse: 'Young makers and training slide.',
    image: local('/images/people/fred-campbell.png', 'Fred Campbell'),
  },
  {
    moment: 'Proof pattern',
    belief: 'The trusted partner is the operating model.',
    voice: 'Karen Liddle',
    quoteUse: 'Use to show what the build meant for young people, not just the product.',
    slideUse: 'Oonchiumpa proof slide.',
    image: local('/images/partners/oonchiumpa.png', 'Oonchiumpa partner mark'),
  },
  {
    moment: 'Scale',
    belief: 'Each place needs its own version of the pattern.',
    voice: 'Dianne Stokes',
    quoteUse: 'Use for the Tennant Creek design and demand pathway.',
    slideUse: 'Place pathways slide.',
    image: local('/images/people/dianne-stokes.jpg', 'Dianne Stokes'),
  },
  {
    moment: 'Ask',
    belief: 'The next capital funds a serious ownership pathway.',
    voice: 'Shayne Bloomfield',
    quoteUse: 'Use as the line that points forward without claiming the work is finished.',
    slideUse: 'Ask and next 90 to 180 days slide.',
    image: local('/images/process/container-factory.jpg', 'Containerised production plant'),
  },
];

export const nextStagePlan = [
  {
    stage: '1. Decide the lead investor story',
    work: 'Use Oonchiumpa and Utopia as the first proof pattern, then keep Tennant Creek and Palm Island as next pathways.',
    communityEffect: 'Community voice stays in front of the pitch from the first slide.',
    investorValue: 'Reduces narrative confusion and makes the ask easier to understand.',
  },
  {
    stage: '2. Turn demand into funded bed runs',
    work: 'Close the next batch of orders, stock, delivery partners, and asset-register tracking.',
    communityEffect: 'More beds reach homes while the feedback loop keeps improving the product.',
    investorValue: 'Converts proof into revenue, procurement confidence, and repeat demand.',
  },
  {
    stage: '3. Make the plant investable',
    work: 'Document plant workflow, throughput, roles, quality practice, component supply, and unit economics.',
    communityEffect: 'The plant becomes a teachable asset rather than a central black box.',
    investorValue: 'Shows what capital buys and what risk gets removed before replication.',
  },
  {
    stage: '4. Build the first place-based ownership pathway',
    work: 'Work with Oonchiumpa on who holds training, production, sales, repairs, governance, and young maker roles.',
    communityEffect: 'The work starts moving from delivery into community-held enterprise design.',
    investorValue: 'Creates a credible first transfer case before claiming national scale.',
  },
  {
    stage: '5. Prepare the governance and board story',
    work: 'Clarify entity pathway, board/advisory roles, consent rules, partner agreements, and investment protections.',
    communityEffect: 'Protects community voice and ownership intention as capital arrives.',
    investorValue: 'Gives funders confidence that mission, control, and accountability are being handled.',
  },
];

export const investmentWorth = [
  {
    claim: 'Investment turns proof into capacity.',
    evidence:
      'The field proof exists: beds built, homes reached, people asking for more, and the plant visible. Capital funds the next operating layer.',
  },
  {
    claim: 'Investment reduces delivery and product risk.',
    evidence:
      'Community partners, real photos, product feedback, and asset tracking give Goods a feedback loop investors can diligence.',
  },
  {
    claim: 'Investment builds assets communities can hold.',
    evidence:
      'The target is not permanent dependency on Goods. The plant, documentation, training, supply links, and quality practice can transfer place by place.',
  },
  {
    claim: 'Investment keeps the model honest.',
    evidence:
      'The deck should keep consent, Elder approval, board structure, entity status, and health outcomes visible as checks rather than hidden assumptions.',
  },
];

export interface TranscriptQuote {
  text: string;
  context: string;
  source: string;
  use: string;
}

export const transcriptQuoteOverrides: Record<string, TranscriptQuote[]> = {
  Mykel: [
    {
      text: 'Never would have thought it would have come out like that.',
      context: 'Build-day recording, May 2026 Utopia trip',
      source: 'v2/src/lib/data/trip-stories.ts',
      use: 'Use internally or with youth-care framing to show the moment of seeing the bed come together.',
    },
    {
      text: 'It was fun, really fun. Good experience.',
      context: 'Build-day recording, May 2026 Utopia trip',
      source: 'v2/src/lib/data/trip-stories.ts',
      use: 'Use in youth pathway copy if the slide needs a shorter emotional line.',
    },
    {
      text: 'Comfortable as. Smooth, tight, hard, fancy.',
      context: 'Build-day recording, May 2026 Utopia trip',
      source: 'v2/src/lib/data/trip-stories.ts',
      use: 'Best public product-feedback line for Mykel.',
    },
    {
      text: "Yeah, I'll be rocking up every day to make them.",
      context: 'Build-day recording, May 2026 Utopia trip',
      source: 'v2/src/lib/data/trip-stories.ts',
      use: 'Best line for the path from build day to local work.',
    },
  ],
  'Karen Liddle': [
    {
      text: "We're silent achievers. We don't brag about what's going on and what we've done.",
      context: 'Utopia trip VoiceCard',
      source: 'v2/src/lib/data/trip-stories.ts',
      use: 'Use to set Oonchiumpa tone: grounded, quiet, relationship-led.',
    },
    {
      text: "To see kids' faces with joy after making a bed, it just really hits you.",
      context: 'Utopia trip VoiceCard',
      source: 'v2/src/lib/data/trip-stories.ts',
      use: 'Best line for young people and making.',
    },
    {
      text: "We've been saying from the start: gotta teach these kids there's a better way of living. There's always a story behind a child.",
      context: 'Utopia trip VoiceCard',
      source: 'v2/src/lib/data/trip-stories.ts',
      use: 'Use for the deeper Oonchiumpa method, not a quick product slide.',
    },
    {
      text: "I had a yarn with the girls one day. Said you got to get out and start your own business. That's how we started Oonchiumpa.",
      context: 'Utopia trip VoiceCard',
      source: 'v2/src/lib/data/trip-stories.ts',
      use: 'Use when connecting local leadership to enterprise.',
    },
  ],
  'Katrina Bloomfield': [
    {
      text: "The girls tend to be shy. But once they get into doing things and being in control, they're capable of anything.",
      context: 'Utopia trip VoiceCard',
      source: 'v2/src/lib/data/trip-stories.ts',
      use: 'Use for young women, confidence, and being in control of the work.',
    },
    {
      text: 'Most of our people in community are just on a blanket on the ground. These beds will come in handy. Mainly for the old elders. Getting up and down off the ground is very hard.',
      context: 'Utopia trip VoiceCard',
      source: 'v2/src/lib/data/trip-stories.ts',
      use: 'Best Utopia need line. Use in the Why section.',
    },
    {
      text: "It's exciting to see kids when they get involved, knowing what they're going to make, and that eventually it could be yours. They're just so excited.",
      context: 'Utopia trip VoiceCard',
      source: 'v2/src/lib/data/trip-stories.ts',
      use: 'Use to connect product usefulness with young people making it.',
    },
  ],
  'Dorrie Jones': [
    {
      text: 'Good for me and comfy, easy to put together.',
      context: 'Utopia trip field note',
      source: 'v2/src/lib/data/trip-stories.ts',
      use: 'Best short product proof line after the Stretch Bed specs.',
    },
  ],
  'Ray Nelson': [
    {
      text: 'Since receiving their new beds, they are no longer experiencing back pains.',
      context: 'QBE strategic pack, bed GB0-156-96',
      source: 'wiki/outputs/2026-06-18-goods-storyteller-library-index.md',
      use: 'Use only as lived-experience account, not a measured clinical result.',
    },
  ],
  Xavier: [
    {
      text: 'He knew what he was doing. He had the pattern of how everything was all coming together. He loved it. We took him back to the family and he just was so proud showing them that he can build it.',
      context: 'Fred Campbell speaking about Xavier',
      source: 'v2/src/lib/data/curated-quotes.ts',
      use: 'Use as Fred narrating Xavier. Do not present as a direct Xavier quote.',
    },
    {
      text: "I reckon if anything, he'd be probably one of the ideal candidates to go around and show the community, and how to even teach these other younger guys.",
      context: 'Fred Campbell speaking about Xavier',
      source: 'v2/src/lib/data/curated-quotes.ts',
      use: 'Best line for future teaching pathway, clearly attributed to Fred about Xavier.',
    },
  ],
};

export const anonymousFieldEvidence: TranscriptQuote[] = [
  {
    text: "It's comfortable as.",
    context: 'Arlparra household member',
    source: 'v2/src/lib/data/trip-stories.ts',
    use: 'Use as anonymous field evidence only.',
  },
  {
    text: 'Two for our place. Three for the other one.',
    context: 'Arawerr household member',
    source: 'v2/src/lib/data/trip-stories.ts',
    use: 'Shows demand appears immediately once beds are seen.',
  },
  {
    text: "We've been sleeping on a door.",
    context: 'Arlparra household member',
    source: 'v2/src/lib/data/trip-stories.ts',
    use: 'Use carefully as problem evidence, with no name attached.',
  },
  {
    text: 'Bring one for next door too.',
    context: 'Arawerr household member',
    source: 'v2/src/lib/data/trip-stories.ts',
    use: 'Use to show local referral and household-to-household demand.',
  },
  {
    text: "Off the ground. That's the main thing.",
    context: 'Arlparra Elder',
    source: 'v2/src/lib/data/trip-stories.ts',
    use: 'Best anonymous line for the core health hardware message.',
  },
  {
    text: 'Can we get one for the Nana?',
    context: 'Arlparra family member',
    source: 'v2/src/lib/data/trip-stories.ts',
    use: 'Use for family demand and older-person need.',
  },
  {
    text: 'How much weight does it take?',
    context: 'Arawerr household member',
    source: 'v2/src/lib/data/trip-stories.ts',
    use: 'Use in product Q and A or procurement detail.',
  },
];

export const blockedOrHoldVoices = [
  {
    name: 'Walter',
    status: 'Do not use externally',
    reason: 'Not on the cleared-voices list. The quiet-sleep quote was deduped to Walter, not Fred Campbell.',
  },
  {
    name: 'Jessica Allardyce',
    status: 'Website or hold until consent confirmed',
    reason:
      'Strong RHD and washing-machine pathway quote, but not on the external cleared-voices list in the current consent gate.',
  },
  {
    name: 'Zelda Hogan',
    status: 'Website-only in older source',
    reason:
      'Useful housing journey voice, but not included in the 32 external cleared voices currently driving funder material.',
  },
  {
    name: 'Georgina Byron AM',
    status: 'Exclude from community storyteller set',
    reason: 'Funder voice. May be used only as a clearly labelled funder testimonial.',
  },
  {
    name: 'Kylie Bloomfield',
    status: 'Hold',
    reason: 'Placeholder in the quote source with no usable transcript quote.',
  },
];

export const transcriptSourceCoverage = [
  'v2/src/lib/data/curated-quotes.ts',
  'v2/src/lib/data/trip-stories.ts',
  'v2/src/lib/data/pitch-photo-review.ts',
  'v2/src/lib/data/cleared-voices.ts',
  'wiki/outputs/ledger/*.md',
  'wiki/outputs/2026-06-18-goods-storyteller-library-index.md',
  'wiki/outputs/2026-06-28-funder-system/cleared-quotes-library.md',
  'wiki/outputs/2026-06-17-storyteller-quote-decision-sheet.md',
  'wiki/articles/sources/community-voices-from-the-ground.md',
];
