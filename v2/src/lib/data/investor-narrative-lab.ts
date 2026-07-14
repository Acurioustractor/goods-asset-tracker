import type { PhotoCandidate } from './pitch-photo-review';

export const investorLabUpdated = '9 July 2026';

const local = (
  src: string,
  label: string,
  note?: string,
  tags?: string[],
): PhotoCandidate => ({ src, label, source: 'local', note, tags });

export const investorLabThesis = {
  question: 'What should investors believe in the first 90 seconds?',
  answer:
    'Goods is proving a practical transfer: community knowledge becomes products that work, young people make them, and the plant can move closer to community ownership over time.',
  deckStance:
    'Lead with Oonchiumpa and Utopia as proof of the pattern, then show Tennant Creek, Palm Island, and future places as place-specific versions of the same model.',
};

export const investorLabSourceLinks = [
  {
    label: 'Utopia field note',
    href: 'https://www.goodsoncountry.com/field-notes/utopia-may-2026',
    note: 'Alice build, Mykel, Fred, Oonchiumpa, Utopia delivery, and 87 beds.',
  },
  {
    label: 'Community narrative',
    href: '/pitch/community-narrative',
    note: 'All cleared storytellers, themes, transcript quotes, and deck use.',
  },
  {
    label: 'Pitch workshop',
    href: '/pitch/workshop',
    note: 'Complete why, what, how, proof, scale, and ask flow.',
  },
  {
    label: 'Photo review',
    href: '/pitch/photo-review',
    note: 'Deck photo jobs, storyteller quotes, and consent checks.',
  },
  {
    label: 'Miro board',
    href: '/pitch/miro-board',
    note: 'Large strategy board for visual sorting and deck ideation.',
  },
];

export interface NarrativeRoute {
  id: string;
  label: string;
  shortLabel: string;
  openingLine: string;
  belief: string;
  whenItWorks: string;
  investorFit: string[];
  proof: string[];
  deckMoves: string[];
  watchOut: string;
  photos: PhotoCandidate[];
}

export const narrativeRoutes: NarrativeRoute[] = [
  {
    id: 'proof-transfer',
    label: 'First proof of transfer',
    shortLabel: 'Proof',
    openingLine: 'A bed off the ground is the first proof of a bigger transfer.',
    belief:
      'The Stretch Bed is not only a product sale. It is the first visible proof that Goods can transfer product knowledge, making, repair practice, and value closer to the places that need the beds.',
    whenItWorks:
      'Best lead for investors because it connects need, product, young people, plant, and ownership without over-explaining any one part.',
    investorFit: ['Catalytic capital', 'Foundations', 'Impact investors'],
    proof: [
      'Oonchiumpa held the young people, build day, and Utopia relationships.',
      'The Utopia trip showed demand house to house, with families asking for two or three beds.',
      'The plant turns recycled HDPE into bed components and can become a community-held asset over time.',
      'Mykel built his own bed, kept building, and wanted to keep coming back to make more.',
    ],
    deckMoves: [
      'Open on the Alice build or Utopia delivery, not a render.',
      'Move from the product into the plant in the first four slides.',
      'Name the capital as the bridge from proof to a repeatable place-based pathway.',
    ],
    watchOut:
      'Do not present ownership as finished. The stronger claim is that Goods has a real pathway and the right partners to move toward it.',
    photos: [
      local('/images/stories/utopia/04-build.jpg', 'Young people building beds in Alice Springs', undefined, [
        'opening',
        'young-makers',
      ]),
      local('/images/stories/utopia/06-delivery.jpg', 'Beds delivered to Utopia Homelands', undefined, [
        'delivery',
      ]),
      local('/images/process/container-factory.jpg', 'Containerised production plant', undefined, [
        'plant',
      ]),
      local('/images/stories/utopia/region-map.png', 'Utopia region map', undefined, ['map']),
    ],
  },
  {
    id: 'young-makers',
    label: 'Young makers to local work',
    shortLabel: 'Makers',
    openingLine: 'Young people built the beds they slept on, then kept building for the homelands.',
    belief:
      'The product creates a visible work pathway when the right community partner holds the room, the young people, and the next step.',
    whenItWorks:
      'Best when the audience cares about young people, work pathways, training, justice diversion, or the social enterprise story.',
    investorFit: ['Foundations', 'Government partners', 'Corporate partners'],
    proof: [
      'Mykel built one bed for himself and had built seven by the end of day two.',
      'Fred described Xavier as someone who could show other young people how to build.',
      'Oonchiumpa selected and supported the young people and carried the relationship layer.',
      'The next question is paid work, training, and who holds the production pathway locally.',
    ],
    deckMoves: [
      'Feature Mykel as the lead human story, with Fred carrying the training pathway.',
      'Show build photos before delivery photos.',
      'Keep Xavier visual unless his own direct story record is confirmed.',
    ],
    watchOut:
      'Do not turn one build into an established employment program. Say it points to the pathway capital can build next.',
    photos: [
      local('/images/people/mykel.jpg', 'Mykel with the bed he built', undefined, ['person', 'opening']),
      local('/images/people/fred-campbell.png', 'Fred Campbell', undefined, ['voice']),
      local('/images/people/xavier-stretch-bed-alice-springs.jpg', 'Xavier with Stretch Bed', undefined, [
        'person',
      ]),
      local('/images/partners/oonchiumpa.png', 'Oonchiumpa partner mark', undefined, ['partner']),
    ],
  },
  {
    id: 'health-hardware',
    label: 'Health hardware that works',
    shortLabel: 'Hardware',
    openingLine: 'A good bed is not furniture. It is washable, off-the-ground health hardware.',
    belief:
      'Goods makes remote-first products for the practical conditions that shape rest, washing, bedding, freight, and repair.',
    whenItWorks:
      'Best for health, housing, school, procurement, and environmental health audiences who need a concrete product case.',
    investorFit: ['Government partners', 'Foundations', 'Procurement buyers'],
    proof: [
      'The Stretch Bed is 26kg, no-tools assembly, washable canvas, galvanised steel, and recycled HDPE legs.',
      'Families in Utopia asked for beds after seeing them used and assembled.',
      'Palm Island voices show how freight changes the cost of basic household goods.',
      'Tennant Creek voices link beds, washing, blankets, and home conditions.',
    ],
    deckMoves: [
      'Show one clean product frame, one home-use frame, and one component close-up.',
      'Use community quotes for need, then specs for credibility.',
      'Avoid measured health outcomes unless a partner evaluation supports them.',
    ],
    watchOut:
      'Keep the health claim practical. Beds and washing support better home conditions; they are not a clinical result by themselves.',
    photos: [
      local('/images/product/stretch-bed-hero.jpg', 'Stretch Bed product hero', undefined, ['product']),
      local('/images/stories/utopia/09-offground.jpg', 'Bed off the ground in home', undefined, [
        'home',
      ]),
      local('/images/pitch/bed-frame-legs.jpg', 'Recycled HDPE bed legs', undefined, ['component']),
      local('/images/media-pack/woman-on-red-stretch-bed.jpg', 'Stretch Bed in use', undefined, [
        'use',
      ]),
    ],
  },
  {
    id: 'place-owned-production',
    label: 'Place-owned production pathway',
    shortLabel: 'Place',
    openingLine: 'The bed is the first asset. The plant is the asset that can move.',
    belief:
      'Scale should not copy one place into another. Goods brings product, plant, documentation, supply links, and quality practice; each community shapes how the making should be held.',
    whenItWorks:
      'Best for serious investors who want to understand the operating model, the capital path, and why community-held enterprise matters.',
    investorFit: ['Impact investors', 'Catalytic capital', 'Board and governance'],
    proof: [
      'Containerised production has a clear workflow: collect, shred, press, cut, assemble, deliver.',
      'Oonchiumpa is the strongest proof pattern for who can hold trust and young people.',
      'Palm Island raises the freight and local training question.',
      'Tennant Creek raises the design, demand, washing, and plastic collection question.',
    ],
    deckMoves: [
      'Use a simple plant diagram or process photo strip.',
      'Show Oonchiumpa, Tennant Creek, and Palm Island as different pathways, not a generic rollout.',
      'Tie the ask to stock, roles, training, partner agreements, and quality practice.',
    ],
    watchOut:
      'Do not make the model sound finished. Investors should see a serious pathway with clear next decisions.',
    photos: [
      local('/images/process/factory-panorama.jpg', 'Factory panorama', undefined, ['plant']),
      local('/images/process/shredder-granulator.jpg', 'Plastic shredder', undefined, ['process']),
      local('/images/process/pressed-sheets.jpg', 'Pressed recycled HDPE sheets', undefined, ['process']),
      local('/images/process/parts-rack-sorted.jpg', 'Sorted bed parts', undefined, ['production']),
    ],
  },
  {
    id: 'plastic-to-product',
    label: 'Plastic becomes useful on Country',
    shortLabel: 'Plastic',
    openingLine: 'Plastic should not leave as waste and come back as expensive goods.',
    belief:
      'The material story matters because each bed turns 20kg of HDPE into useful infrastructure while creating a reason for local collection, making, repair, and learning.',
    whenItWorks:
      'Best for climate, waste, circular economy, procurement, and corporate partners who still need the human story kept in front.',
    investorFit: ['Corporate partners', 'Procurement buyers', 'Impact investors'],
    proof: [
      'Each current Stretch Bed design diverts 20kg of HDPE.',
      'The plant presses recycled plastic into sheets, then cuts bed legs and components.',
      'The value of material, product, and story can stay closer to community as capability transfers.',
      'The plastic story is strongest when it ends in a bed being used in a home.',
    ],
    deckMoves: [
      'Show plastic, process, component, then bed in home.',
      'Pair material claims with product demand so it does not become a waste-only pitch.',
      'Use numbers sparingly: 20kg HDPE per bed, 30 beds per week pathway when plant-ready.',
    ],
    watchOut:
      'Do not let the waste story displace community voice. Plastic is the input; beds, work, and ownership are the point.',
    photos: [
      local('/images/stories/utopia/05-waste.jpg', 'Plastic to bed legs', undefined, ['plastic']),
      local('/images/process/shredded-plastic-tubs.jpg', 'Shredded plastic ready for pressing', undefined, [
        'plastic',
      ]),
      local('/images/process/heat-press-container.jpg', 'Heat press inside container', undefined, [
        'plant',
      ]),
      local('/images/stories/utopia/09-offground.jpg', 'Bed off the ground in home', undefined, [
        'home',
      ]),
    ],
  },
];

export interface InvestorLens {
  id: string;
  label: string;
  question: string;
  wantsToSee: string[];
  proofToShow: string[];
  askLanguage: string;
  routeBias: string[];
  watchOut: string;
}

export const investorLenses: InvestorLens[] = [
  {
    id: 'catalytic-capital',
    label: 'Catalytic capital',
    question: 'Will this money move Goods from proof into a repeatable community production pathway?',
    wantsToSee: [
      'A concrete 90 to 180 day use of funds.',
      'Which partner holds the first place pathway.',
      'What risk gets removed before larger finance or procurement follows.',
    ],
    proofToShow: [
      'Oonchiumpa and Utopia proof.',
      'Plant readiness and working stock.',
      'Board, entity, and partner agreements as the next governance work.',
    ],
    askLanguage:
      'Fund the bridge from field proof to regular production: stock, plant readiness, partner roles, and the first community-held pathway.',
    routeBias: ['proof-transfer', 'place-owned-production'],
    watchOut:
      'Keep the ask practical. Avoid vague movement language when the investor needs exact next work.',
  },
  {
    id: 'impact-investors',
    label: 'Impact investors',
    question: 'Can this become a durable enterprise with demand, margin discipline, and place-based growth?',
    wantsToSee: [
      'Demand that can become orders, not only interest.',
      'A production model that can improve unit economics over time.',
      'Clear separation between sales, grants, repayable finance, and governance work.',
    ],
    proofToShow: [
      'Stretch Bed specs and buyer channels.',
      'Plant workflow and throughput pathway.',
      'Named place pathways: Oonchiumpa, Tennant Creek, Palm Island.',
    ],
    askLanguage:
      'Back the inventory, production discipline, and partner pipeline that turn the Stretch Bed from strong proof into a repeatable place-based enterprise.',
    routeBias: ['place-owned-production', 'proof-transfer', 'plastic-to-product'],
    watchOut:
      'Do not hide commercial questions. Show what is known, what is still being tested, and what capital proves next.',
  },
  {
    id: 'foundations',
    label: 'Foundations',
    question: 'Does this strengthen home conditions, young people, and community-led enterprise without replacing local authority?',
    wantsToSee: [
      'Community voice in front of Goods claims.',
      'A practical product that families want.',
      'A pathway for young people and local organisations to hold more of the work.',
    ],
    proofToShow: [
      'Mykel, Fred, Kristy, Karen, and Katrina.',
      'Before and after sleeping setup.',
      'Tennant Creek and Palm Island voices on home, freight, and rest.',
    ],
    askLanguage:
      'Fund the next run of beds, the partner support around young people, and the governance work that lets the making move closer to community.',
    routeBias: ['young-makers', 'health-hardware', 'proof-transfer'],
    watchOut:
      'Avoid making Goods the hero. The deck should show who asked, who built, who delivered, and who can own the next step.',
  },
  {
    id: 'procurement-buyers',
    label: 'Procurement buyers',
    question: 'Can this be bought, delivered, tracked, repaired, and used in remote conditions?',
    wantsToSee: [
      'Clear specs, warranty, assembly, freight, and support.',
      'Photos that show delivery and home use.',
      'A reliable way to track assets and repeat orders.',
    ],
    proofToShow: [
      'Product specs from the canonical Stretch Bed data.',
      'Utopia delivery and home-use photos.',
      'Asset register and QR tracking where relevant.',
    ],
    askLanguage:
      'Buy bed batches with the delivery, support, and feedback loop needed for remote communities.',
    routeBias: ['health-hardware', 'proof-transfer'],
    watchOut:
      'Do not overcomplicate the first sale. Procurement needs confidence that the product works and the supplier can deliver.',
  },
  {
    id: 'corporate-partners',
    label: 'Corporate partners',
    question: 'Can a partner support the material loop and still respect the community story?',
    wantsToSee: [
      'A clean link between plastic, product, and community benefit.',
      'Specific partner actions: bed orders, material supply, plant capital, logistics, or skills.',
      'Clear rules on story use and community approval.',
    ],
    proofToShow: [
      '20kg HDPE per current Stretch Bed.',
      'Shredder, press, sheets, components, and beds in homes.',
      'Community partner consent before external campaign use.',
    ],
    askLanguage:
      'Support the plastic-to-product pathway through paid bed batches, material partnerships, plant capital, or skills that communities can use.',
    routeBias: ['plastic-to-product', 'place-owned-production'],
    watchOut:
      'Do not let brand visibility come before community voice or consent.',
  },
];

export interface PhotoBank {
  id: string;
  label: string;
  role: string;
  bestFor: string;
  photos: PhotoCandidate[];
}

export const photoBanks: PhotoBank[] = [
  {
    id: 'opening',
    label: 'Opening frames',
    role: 'Set the deck in real work before investors see a model.',
    bestFor: 'Cover, first proof slide, investor email thumbnail.',
    photos: [
      local('/images/stories/utopia/04-build.jpg', 'Alice Springs build day'),
      local('/images/stories/utopia/06-delivery.jpg', 'Beds arriving at Utopia homes'),
      local('/images/people/mykel.jpg', 'Mykel with the bed he built'),
      local('/images/media-pack/woman-on-red-stretch-bed.jpg', 'Stretch Bed in use'),
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery and home',
    role: 'Show what beds arriving, being assembled, and being used actually looks like.',
    bestFor: 'Need, delivery proof, home conditions, field note section.',
    photos: [
      local('/images/stories/utopia/06-delivery.jpg', 'Beds delivered to Utopia Homelands'),
      local('/images/stories/utopia/07-elders.jpg', 'Ampilatwatja Elders and bed testing'),
      local('/images/stories/utopia/08-beforeafter.jpg', 'Before and after sleeping setup'),
      local('/images/stories/utopia/09-offground.jpg', 'Bed off the ground in home'),
    ],
  },
  {
    id: 'making',
    label: 'Young people making',
    role: 'Carry the young maker pathway through named people and supported build days.',
    bestFor: 'Oonchiumpa proof, workforce pathway, partner story.',
    photos: [
      local('/images/people/mykel.jpg', 'Mykel'),
      local('/images/people/fred-campbell.png', 'Fred Campbell'),
      local('/images/people/xavier-stretch-bed-alice-springs.jpg', 'Xavier with Stretch Bed'),
      local('/images/stories/utopia/04-build.jpg', 'Alice build with Oonchiumpa'),
    ],
  },
  {
    id: 'plant',
    label: 'Plant and process',
    role: 'Make the production system visible as infrastructure, not theory.',
    bestFor: 'Operating model, capital ask, investor diligence.',
    photos: [
      local('/images/process/container-factory.jpg', 'Containerised production plant'),
      local('/images/process/factory-panorama.jpg', 'Plant panorama'),
      local('/images/process/shredder-granulator.jpg', 'Plastic shredder'),
      local('/images/process/pressed-sheets.jpg', 'Pressed recycled HDPE sheets'),
    ],
  },
  {
    id: 'places',
    label: 'Places and maps',
    role: 'Show that scale is place by place, not a generic rollout.',
    bestFor: 'Scale, partner pathway, investor discussion.',
    photos: [
      local('/images/stories/utopia/region-map.png', 'Utopia region map'),
      local('/images/community/tennant-creek.jpg', 'Tennant Creek assembly'),
      local('/images/people/ivy.jpg', 'Ivy, Palm Island'),
      local('/images/people/alfred-johnson.jpg', 'Alfred Johnson, Palm Island'),
    ],
  },
  {
    id: 'material',
    label: 'Plastic to product',
    role: 'Connect waste, manufacturing, and the bed being used in a home.',
    bestFor: 'Corporate partners, climate and waste, production model.',
    photos: [
      local('/images/stories/utopia/05-waste.jpg', 'Plastic to bed legs'),
      local('/images/process/shredded-plastic-tubs.jpg', 'Shredded plastic tubs'),
      local('/images/process/heat-press-container.jpg', 'Heat press container'),
      local('/images/pitch/bed-frame-legs.jpg', 'Recycled HDPE legs'),
    ],
  },
];

export interface LabDecision {
  id: string;
  label: string;
  defaultAnswer: string;
  evidenceNeeded: string;
  deckOutput: string;
}

export const labDecisions: LabDecision[] = [
  {
    id: 'lead-route',
    label: 'Lead narrative route',
    defaultAnswer: 'First proof of transfer.',
    evidenceNeeded: 'Opening photo, Oonchiumpa proof, Utopia delivery, plant pathway.',
    deckOutput: 'Cover line and first three slides.',
  },
  {
    id: 'opening-image',
    label: 'Opening image',
    defaultAnswer: 'Alice build or Utopia delivery, depending on investor audience.',
    evidenceNeeded: 'Consent check for identifiable young people and household images.',
    deckOutput: 'Cover and first investor email preview.',
  },
  {
    id: 'investor-lens',
    label: 'Primary investor lens',
    defaultAnswer: 'Catalytic capital first, with impact investor diligence behind it.',
    evidenceNeeded: 'Clear 90 to 180 day use of funds and what risk that removes.',
    deckOutput: 'Ask slide, follow-up memo, and meeting talk track.',
  },
  {
    id: 'place-proof',
    label: 'Place proof sequence',
    defaultAnswer: 'Oonchiumpa first, Tennant Creek and Palm Island as next pathways.',
    evidenceNeeded: 'One voice, one partner, and one next asset for each place.',
    deckOutput: 'Scale slide and investor Q and A section.',
  },
  {
    id: 'board-governance',
    label: 'Board and entity story',
    defaultAnswer: 'In progress, framed as the work needed to hold capital and protect the mission.',
    evidenceNeeded: 'Current board member status, entity pathway, DGR or foundation timing.',
    deckOutput: 'Governance note and appendix.',
  },
  {
    id: 'photo-replacement',
    label: 'Photo replacement queue',
    defaultAnswer: 'Use local canon images now; replace with EL-pinned images before external release.',
    evidenceNeeded: 'Consent, Elder approval where relevant, caption accuracy.',
    deckOutput: 'Final Google Slides image set.',
  },
];

export const placeReviewQuestions = [
  'Who asked for this work, and who can say whether it is useful?',
  'Who holds relationships with young people, families, Elders, and local organisations?',
  'Which asset moves first: beds, assembly, plastic collection, repair, or the full plant?',
  'What must be locally owned, and what should Goods continue to hold while capability transfers?',
];
