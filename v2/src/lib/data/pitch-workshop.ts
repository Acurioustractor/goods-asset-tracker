import type { PhotoCandidate } from './pitch-photo-review';

export const workshopUpdated = '9 July 2026';

const local = (
  src: string,
  label: string,
  note?: string,
  tags?: string[],
): PhotoCandidate => ({ src, label, source: 'local', note, tags });

export const workshopThesis = {
  line: 'Goods turns community knowledge into health hardware, local work, and production that communities can own.',
  reason:
    'This line holds the whole pitch together: the bed, the plant, the young maker pathway, the plastic loop, and the ownership path.',
  proof:
    'Oonchiumpa is the strongest proof pattern because the same community partner held the young people, the build, the household relationships, and the question of who should own the work next.',
};

export interface MessageLens {
  id: string;
  label: string;
  line: string;
  whenToUse: string;
  watchOut: string;
  deckShape: string[];
}

export const messageLenses: MessageLens[] = [
  {
    id: 'community-knowledge',
    label: 'Community knowledge first',
    line: 'The strongest ideas are already in community. Goods builds the product, plant, and business model around that knowledge.',
    whenToUse:
      'Best overall frame for this deck. It lets Dianne, Oonchiumpa, Palm Island, and Tennant Creek sit at the centre without making the pitch feel like a product catalogue.',
    watchOut:
      'Do not make Goods sound like it is giving ownership. The better language is that the work moves toward community-held enterprise, place by place.',
    deckShape: [
      'Open with community knowledge',
      'Show the need through named voices',
      'Show the Stretch Bed as the first product',
      'Use Oonchiumpa as proof of the pattern',
      'Show the plant and the ownership path',
      'Ask for the capital and partners to make the next run real',
    ],
  },
  {
    id: 'health-hardware',
    label: 'Health hardware first',
    line: 'A good bed is not furniture. It is washable, off-the-ground health hardware that works in remote conditions.',
    whenToUse:
      'Use when the funder is health, housing, environmental health, or government. It gives the problem a strong why before the enterprise story.',
    watchOut:
      'Keep the health claim honest. Beds and washing machines support the conditions for better health. Do not claim measured clinical outcomes unless a partner evaluation proves them.',
    deckShape: [
      'Problem in homes',
      'Why beds and washing matter',
      'Stretch Bed specs',
      'Delivery proof',
      'Plant and local production',
      'Ownership and scale',
    ],
  },
  {
    id: 'young-makers',
    label: 'Young makers first',
    line: 'Young people built the beds they slept on, then kept building for the homelands.',
    whenToUse:
      'Use when the audience cares about work pathways, youth justice, skills, training, or social enterprise jobs.',
    watchOut:
      'Do not make one build day sound like an ongoing employment program yet. Label jobs and ownership as the next pathway.',
    deckShape: [
      'Mykel and Xavier',
      'Fred and Oonchiumpa',
      'What the bed is',
      'What the plant makes possible',
      'What capital funds next',
    ],
  },
  {
    id: 'plastic-loop',
    label: 'Plastic loop first',
    line: 'Plastic collected on Country becomes bed components, and the value can stay closer to the people who need the beds.',
    whenToUse:
      'Use when the audience is climate, waste, circular economy, manufacturing, or procurement.',
    watchOut:
      'Do not let the waste story overpower the human story. Plastic is the input. Beds, work, and ownership are the point.',
    deckShape: [
      'Local plastic problem',
      'Plant and process',
      'Stretch Bed components',
      'Delivery and use',
      'Community-held production path',
    ],
  },
];

export interface PitchSection {
  id: string;
  navLabel: string;
  question: string;
  headline: string;
  body: string;
  messages: string[];
  proof: string[];
  quote?: {
    text: string;
    by: string;
  };
  photos: PhotoCandidate[];
  decision: string;
}

export const pitchSections: PitchSection[] = [
  {
    id: 'why',
    navLabel: 'Why',
    question: 'What is the real problem?',
    headline: 'Remote communities are not short on knowledge. They are short on goods that work where they live.',
    body:
      'The problem shows up as floor sleeping, broken goods, heavy freight, dirty bedding, and products that fail before they should. Goods starts by listening to what families, Elders, and local organisations already know about the conditions in their homes.',
    messages: [
      'Lead with named voices, not abstract need.',
      'Say health hardware, not furniture.',
      'Make freight, durability, washing, and repair part of the same problem.',
    ],
    proof: [
      'Ivy and Alfred on beds and freight at Palm Island.',
      'Dianne asking for more beds after receiving one in Tennant Creek.',
      'Fred and Katrina describing what families are sleeping on in Central Australia.',
    ],
    quote: {
      text: 'Hardly any people around the community have got beds. When they got family members over, there is not enough for everyone.',
      by: 'Ivy, Palm Island',
    },
    photos: [
      local('/images/people/ivy.jpg', 'Ivy, Palm Island'),
      local('/images/people/alfred-johnson.jpg', 'Alfred Johnson, Palm Island'),
      local('/images/stories/utopia/08-beforeafter.jpg', 'Before and after sleeping setup'),
    ],
    decision:
      'Best deck move: open the why with one community quote and one real home or delivery image, then move quickly to what Goods has built.',
  },
  {
    id: 'what',
    navLabel: 'What',
    question: 'What has Goods built?',
    headline: 'The Stretch Bed is the first product: washable, flat-packable, and built from recycled HDPE, galvanised steel, and canvas.',
    body:
      'It weighs 26kg, holds 200kg, assembles in about five minutes with no tools, and diverts 20kg of HDPE per bed. It is a product, but also a way to prove the manufacturing system.',
    messages: [
      'Keep specs tight and concrete.',
      'Show the bed as simple without making the problem sound simple.',
      'Tie product proof to the plant and future product range.',
    ],
    proof: [
      'Product specs from the canonical product file.',
      'Beds already delivered and tracked in the asset register.',
      'Families and young builders can assemble the bed quickly on site.',
    ],
    quote: {
      text: 'Comfortable as. Smooth, tight, hard, fancy.',
      by: 'Mykel, Alice Springs',
    },
    photos: [
      local('/images/product/stretch-bed-hero.jpg', 'Stretch Bed hero'),
      local('/images/pitch/bed-assembled.jpg', 'Assembled Stretch Bed'),
      local('/images/pitch/bed-frame-legs.jpg', 'Recycled HDPE legs'),
      local('/images/pitch/bed-poles.jpg', 'Galvanised steel poles'),
    ],
    decision:
      'Best deck move: use one full product photo, one component detail, and one field-use image. Avoid a cluttered parts slide unless the audience asks for manufacturing detail.',
  },
  {
    id: 'how',
    navLabel: 'How',
    question: 'How does the model work?',
    headline: 'The plant is the bridge from beds delivered by Goods to beds made and owned closer to community.',
    body:
      'The production system collects plastic, shreds it, presses recycled HDPE into sheets, cuts bed components, and assembles beds. The practical goal is not to keep production centralised. It is to move capability, documentation, quality practice, and ownership toward local enterprise.',
    messages: [
      'Show the plant as real infrastructure.',
      'Name what transfers: skills, plant, supply links, quality practice, and product knowledge.',
      'Keep ownership as a pathway, not a finished claim.',
    ],
    proof: [
      'Containerised plant images.',
      'Shredder, press, CNC, sheet, and part photos.',
      'Oonchiumpa and Palm Island as the first serious ownership-path conversations.',
    ],
    photos: [
      local('/images/process/container-factory.jpg', 'Containerised production plant'),
      local('/images/process/shredder-granulator.jpg', 'Plastic shredder'),
      local('/images/process/heat-press-container.jpg', 'Heat press inside container'),
      local('/images/process/pressed-sheets.jpg', 'Pressed recycled HDPE sheets'),
    ],
    decision:
      'Best deck move: put the plant after the product, then immediately show a person or partner who could hold the work next.',
  },
  {
    id: 'oonchiumpa',
    navLabel: 'Oonchiumpa',
    question: 'What proves the pattern?',
    headline: 'Oonchiumpa shows the pattern: community partner, young people, real beds, local relationships, and a serious ownership question.',
    body:
      'The Alice build was not just a workshop. Oonchiumpa selected and supported the young people, held the room, guided the Utopia deliveries, and brought the trust needed for Goods to be useful. Young people built beds they slept on, then built more for the homelands.',
    messages: [
      'Make Oonchiumpa the proof pattern, not a side story.',
      'Use Mykel for the young maker spark.',
      'Use Fred for the relationship and future teaching pathway.',
      'Use Xavier through Fred until Xavier has his own EL story record.',
    ],
    proof: [
      'Mykel built his own bed and kept going.',
      'Fred and Decon got Goods through the door in Utopia.',
      'Karen and Katrina describe the young people and the need in community.',
      'The same partner connects making, delivery, and future ownership.',
    ],
    quote: {
      text: 'I reckon if anything, he would be probably one of the ideal candidates to go around and show the community, and how to even teach these other younger guys.',
      by: 'Fred Campbell, speaking about Xavier',
    },
    photos: [
      local('/images/people/mykel.jpg', 'Mykel with the bed he built'),
      local('/images/people/fred-campbell.png', 'Fred Campbell'),
      local('/images/people/xavier-stretch-bed-alice-springs.jpg', 'Xavier with Stretch Bed'),
      local('/images/stories/utopia/04-build.jpg', 'Alice Springs build day'),
    ],
    decision:
      'Best deck move: dedicate one strong slide to Oonchiumpa as the proof that the model is wanted and can be held locally.',
  },
  {
    id: 'scale',
    navLabel: 'Scale',
    question: 'How does this grow?',
    headline: 'Scale is place by place: prove the pattern with Oonchiumpa, then shape the right version for Tennant Creek, Palm Island, and other partners.',
    body:
      'The model should not copy one community into another. Each place has its own authority, partners, material flows, and young people. Goods brings product, plant, documentation, funding pathways, and quality practice. Communities shape where the making should sit.',
    messages: [
      'Say repeatable pattern, not identical rollout.',
      'Use Tennant Creek for Dianne, housing, washing, and plastic collection potential.',
      'Use Palm Island for freight, PICC, Elder advisory, and manufacturing training.',
      'Use Oonchiumpa for youth pathway and ownership pattern.',
    ],
    proof: [
      'Tennant Creek: Dianne, Norman, Anyinginyi, Community Shed, washing machine naming.',
      'Palm Island: Ivy, Alfred, PICC, freight problem, Ebony and Jahvan manufacturing training.',
      'Central Australia: Oonchiumpa, Utopia delivery, Centrecorp materials support.',
    ],
    photos: [
      local('/images/community/tennant-creek.jpg', 'Tennant Creek assembly'),
      local('/images/people/dianne-stokes.jpg', 'Dianne Stokes'),
      local('/images/people/ivy.jpg', 'Ivy'),
      local('/images/people/alfred-johnson.jpg', 'Alfred Johnson'),
    ],
    decision:
      'Best deck move: show three place pathways on one slide, each with one voice, one partner, and one next asset to build.',
  },
  {
    id: 'ask',
    navLabel: 'Ask',
    question: 'What does the next capital make possible?',
    headline: 'The ask funds the shift from good proof to a repeatable production and ownership pathway.',
    body:
      'Capital should be framed around the next real run: plant readiness, working stock, roles, governance, partner agreements, and the first place-based production pathway. The deck should make clear what money changes in the next 90 to 180 days.',
    messages: [
      'Tie funding to concrete next actions.',
      'Separate repayable finance, grants, and bed orders clearly.',
      'Keep DGR and board structure as in transition until complete.',
    ],
    proof: [
      'Production plant capex already spent.',
      'Named demand and live funder conversations.',
      'Advisory group and legal structure work in progress.',
    ],
    photos: [
      local('/images/process/facility-full-site.jpg', 'Full production facility site'),
      local('/images/stories/utopia/10-next.jpg', 'Next step in the Utopia story'),
      local('/images/media-pack/nic-with-elder-on-verandah.jpg', 'Yarning on the verandah with the bed'),
    ],
    decision:
      'Best deck move: end with the concrete ask, the next 90-day work, and the line that Goods becomes unnecessary when communities hold the making.',
  },
];

export interface ThemeThread {
  id: string;
  theme: string;
  whatCommunityIsSaying: string;
  bestQuote: string;
  quoteBy: string;
  bestPhoto: PhotoCandidate;
  deckUse: string;
}

export const themeThreads: ThemeThread[] = [
  {
    id: 'bed-need',
    theme: 'Beds and safety',
    whatCommunityIsSaying:
      'People are sleeping on the floor, sharing bedding, or improvising with whatever is available.',
    bestQuote:
      'Hardly any people around the community have got beds. When they got family members over, there is not enough for everyone.',
    quoteBy: 'Ivy, Palm Island',
    bestPhoto: local('/images/stories/utopia/08-beforeafter.jpg', 'Before and after sleeping setup'),
    deckUse: 'Problem and why section.',
  },
  {
    id: 'freight',
    theme: 'Freight and remote cost',
    whatCommunityIsSaying:
      'The cost of moving basic goods into remote places changes what families and services can actually buy.',
    bestQuote:
      'You have to bring them on the barge. You cannot just take them on the boat. You have to pay for freight. It all adds up.',
    quoteBy: 'Alfred Johnson, Palm Island',
    bestPhoto: local('/images/people/alfred-johnson.jpg', 'Alfred Johnson'),
    deckUse: 'Market failure and why local production matters.',
  },
  {
    id: 'young-makers',
    theme: 'Young people and work',
    whatCommunityIsSaying:
      'Young people can build the product, take pride in it, and become the people who teach others.',
    bestQuote:
      'He knew what he was doing. He had the pattern of how everything was all coming together.',
    quoteBy: 'Fred Campbell, speaking about Xavier',
    bestPhoto: local('/images/people/xavier-stretch-bed-alice-springs.jpg', 'Xavier with Stretch Bed'),
    deckUse: 'Oonchiumpa proof and ownership pathway.',
  },
  {
    id: 'local-leadership',
    theme: 'Local leadership',
    whatCommunityIsSaying:
      'Trusted local organisations know which doors to knock on, how to hold the room, and what young people need next.',
    bestQuote:
      'I had a yarn with the girls one day. Said you got to get out and start your own business. That is how we started Oonchiumpa.',
    quoteBy: 'Karen Liddle, Oonchiumpa',
    bestPhoto: local('/images/partners/oonchiumpa.png', 'Oonchiumpa'),
    deckUse: 'Community knowledge and partner proof.',
  },
  {
    id: 'plastic',
    theme: 'Plastic to product',
    whatCommunityIsSaying:
      'Waste should become something useful on Country, not leave as rubbish and come back as expensive goods.',
    bestQuote:
      'Plastic collected on Country becomes the legs on these beds.',
    quoteBy: 'Goods field note line',
    bestPhoto: local('/images/process/shredded-plastic-tubs.jpg', 'Shredded plastic ready for pressing'),
    deckUse: 'How the plant works.',
  },
  {
    id: 'ownership',
    theme: 'Ownership path',
    whatCommunityIsSaying:
      'The work should move closer to the people, plastic, and homes that need the product.',
    bestQuote:
      'This partnership could go a long way. I feel it has got a long, long path ahead.',
    quoteBy: 'Shayne Bloomfield',
    bestPhoto: local('/images/process/container-factory.jpg', 'Containerised production plant'),
    deckUse: 'Business model and ask.',
  },
];

export interface PlacePathway {
  id: string;
  name: string;
  role: string;
  proofNow: string;
  nextMove: string;
  communityKnowledge: string[];
  photos: PhotoCandidate[];
  voices: {
    name: string;
    line: string;
  }[];
}

export const placePathways: PlacePathway[] = [
  {
    id: 'oonchiumpa',
    name: 'Oonchiumpa and Central Australia',
    role: 'Proof pattern for young people, delivery trust, and a future community-held production pathway.',
    proofNow:
      'Oonchiumpa ran the Alice build, held the young people, selected where beds went, and led the Utopia relationships.',
    nextMove:
      'Design a place-based production pathway with Oonchiumpa: who holds the plant, who trains, who sells, who repairs, and how young people move from build days into paid work.',
    communityKnowledge: [
      'Young people respond when the product is useful to them and their families.',
      'Support workers and family networks are the delivery infrastructure.',
      'Ownership has to sit with the people who can hold trust, not with a distant operator.',
    ],
    photos: [
      local('/images/stories/utopia/04-build.jpg', 'Alice Springs build day'),
      local('/images/people/mykel.jpg', 'Mykel'),
      local('/images/people/fred-campbell.png', 'Fred Campbell'),
    ],
    voices: [
      {
        name: 'Mykel',
        line: 'Comfortable as. Smooth, tight, hard, fancy.',
      },
      {
        name: 'Fred Campbell',
        line: 'He would be probably one of the ideal candidates to go around and show the community.',
      },
    ],
  },
  {
    id: 'tennant-creek',
    name: 'Tennant Creek',
    role: 'Origin place for design, demand, washing machine naming, health partners, and plastic collection potential.',
    proofNow:
      'Dianne named Pakkimjalki Kari, asked for more beds, and helped shape the way Goods listens. Norman, Wilya Janta, Anyinginyi, and the Community Shed create a place-based foundation.',
    nextMove:
      'Turn Tennant Creek into a stronger design, washing, bed demand, and plastic collection pathway once the entity and production system are ready.',
    communityKnowledge: [
      'Elders know what product form will be used in homes.',
      'Washing and bedding sit together in the health story.',
      'Plastic collection and local assembly can become practical community work if the system is simple enough.',
    ],
    photos: [
      local('/images/people/dianne-stokes.jpg', 'Dianne Stokes'),
      local('/images/community/tennant-creek.jpg', 'Tennant Creek assembly'),
      local('/images/people/norman-frank.jpg', 'Norman Frank'),
    ],
    voices: [
      {
        name: 'Dianne Stokes',
        line: 'It means something that really makes me happy.',
      },
      {
        name: 'Linda Turner',
        line: 'We have never been asked what sort of house we would like to live in.',
      },
    ],
  },
  {
    id: 'palm-island',
    name: 'Palm Island',
    role: 'Scale pathway for freight, Elder advisory, PICC delivery, and local manufacturing skill transfer.',
    proofNow:
      'Ivy and Alfred show the freight and bed-need problem clearly. PICC and Elder advisory shape delivery. Ebony and Jahvan training with Defy Design point toward production capability.',
    nextMove:
      'Confirm the right local operating structure and what a Palm Island production or assembly pathway should own first.',
    communityKnowledge: [
      'Freight turns basic goods into a structural cost.',
      'Local messengers matter more than outside explanation.',
      'Training needs to lead into a product families want and a business structure that works locally.',
    ],
    photos: [
      local('/images/people/ivy.jpg', 'Ivy'),
      local('/images/people/alfred-johnson.jpg', 'Alfred Johnson'),
      local('/images/people/carmelita-colette.jpg', 'Carmelita and Colette'),
    ],
    voices: [
      {
        name: 'Ivy',
        line: 'Hardly any people around the community have got beds.',
      },
      {
        name: 'Alfred Johnson',
        line: 'You have to pay for freight. It all adds up.',
      },
    ],
  },
  {
    id: 'utopia',
    name: 'Utopia Homelands',
    role: 'Delivery proof that shows what beds arriving, being assembled, and going into homes actually looks like.',
    proofNow:
      'The Centrecorp-supported build moved from Alice Springs to Utopia Homelands with Oonchiumpa and local teams leading the relationships.',
    nextMove:
      'Use Utopia as proof of demand and delivery method, while Oonchiumpa carries the production pathway discussion.',
    communityKnowledge: [
      'Most houses asked for two or three beds, not one.',
      'The local team knew which doors to visit.',
      'The delivery story is strongest when the relationship layer is visible.',
    ],
    photos: [
      local('/images/stories/utopia/06-delivery.jpg', 'Beds delivered to Utopia Homelands'),
      local('/images/stories/utopia/07-elders.jpg', 'Ampilatwatja Elders'),
      local('/images/stories/utopia/09-offground.jpg', 'Bed off the ground in home'),
    ],
    voices: [
      {
        name: 'Katrina Bloomfield',
        line: 'Most of our people in community are just on a blanket on the ground.',
      },
      {
        name: 'Dorrie Jones',
        line: 'Good for me and comfy, easy to put together.',
      },
    ],
  },
];

export interface DeckRunSlide {
  number: string;
  title: string;
  job: string;
  message: string;
  quote?: string;
  photo: PhotoCandidate;
}

export const deckRun: DeckRunSlide[] = [
  {
    number: '01',
    title: 'Community knowledge becomes health hardware',
    job: 'Set the frame.',
    message: workshopThesis.line,
    photo: local('/images/stories/utopia/04-build.jpg', 'Young people building Stretch Beds in Alice Springs'),
  },
  {
    number: '02',
    title: 'The need is named',
    job: 'Make the problem specific.',
    message: 'People are asking for beds that work in heat, dust, freight, crowded homes, and constant movement.',
    quote: 'Hardly any people around the community have got beds.',
    photo: local('/images/people/ivy.jpg', 'Ivy, Palm Island'),
  },
  {
    number: '03',
    title: 'The first product works',
    job: 'Show the Stretch Bed.',
    message: '26kg, 200kg load, no tools, recycled HDPE legs, steel poles, and canvas.',
    photo: local('/images/product/stretch-bed-hero.jpg', 'Stretch Bed hero'),
  },
  {
    number: '04',
    title: 'Delivery is relationship work',
    job: 'Show what a bed arriving looks like.',
    message: 'The truck only matters because local people know which doors to visit and how to hold the room.',
    photo: local('/images/stories/utopia/06-delivery.jpg', 'Utopia delivery'),
  },
  {
    number: '05',
    title: 'Oonchiumpa proves the pattern',
    job: 'Name the operating proof.',
    message: 'Young people built beds they slept on, then more beds for the homelands.',
    quote: 'He would be probably one of the ideal candidates to go around and show the community.',
    photo: local('/images/people/mykel.jpg', 'Mykel with the bed he built'),
  },
  {
    number: '06',
    title: 'The plant makes the model real',
    job: 'Move from delivery to production.',
    message: 'Plastic can be collected, shredded, pressed, cut, assembled, tracked, and repaired through a place-based production system.',
    photo: local('/images/process/container-factory.jpg', 'Containerised production plant'),
  },
  {
    number: '07',
    title: 'Each place shapes its own version',
    job: 'Show scale without copy-paste.',
    message: 'Oonchiumpa, Tennant Creek, Palm Island, and Utopia point to the same pattern with different local authority and partners.',
    photo: local('/images/community/tennant-creek.jpg', 'Tennant Creek assembly'),
  },
  {
    number: '08',
    title: 'What the capital changes',
    job: 'Make the ask concrete.',
    message: 'The next capital funds plant readiness, stock, roles, governance, and the first place-based production pathway.',
    photo: local('/images/process/facility-full-site.jpg', 'Full production facility site'),
  },
  {
    number: '09',
    title: 'What success looks like',
    job: 'Hold the long-term outcome.',
    message: 'Beds off the ground, plastic out of landfill, young people paid to make useful goods, and production moving toward community ownership.',
    photo: local('/images/stories/utopia/10-next.jpg', 'Next step in the Utopia story'),
  },
  {
    number: '10',
    title: 'Goods becomes unnecessary',
    job: 'Close with the philosophy.',
    message: 'The point is not for Goods to own the work forever. The point is to transfer the making, knowledge, and value.',
    photo: local('/images/stories/utopia/11-close.jpg', 'Sandover sunset'),
  },
];

