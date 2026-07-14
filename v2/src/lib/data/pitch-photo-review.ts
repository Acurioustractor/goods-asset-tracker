import { isClearedForExternal } from './cleared-voices';

export const deckReviewUpdated = '9 July 2026';

export interface PhotoCandidate {
  src: string;
  label: string;
  source: 'local' | 'el';
  tags?: string[];
  note?: string;
}

export interface DeckPhotoSlot {
  id: string;
  slide: string;
  job: string;
  preferred: PhotoCandidate;
  alternates: PhotoCandidate[];
  copyUse: string;
  check: string;
}

export const deckReviewLinks = [
  {
    label: 'Pitch workshop',
    href: '/pitch/workshop',
    note: 'Walk through the complete message, photos, places, and deck run.',
  },
  {
    label: 'Investor lab',
    href: '/pitch/investor-lab',
    note: 'Compare narrative routes, investor lenses, maps, and deck decisions.',
  },
  {
    label: 'Community narrative',
    href: '/pitch/community-narrative',
    note: 'Review all cleared storytellers, themes, transcript quotes, and deck use.',
  },
  {
    label: 'Miro board',
    href: '/pitch/miro-board',
    note: 'Use the Miro-style canvas for sorting and live decision work.',
  },
  {
    label: 'Main Google Slides deck',
    href: 'https://docs.google.com/presentation/d/1ClOU09dQVs_m_SvGcqAY3FeZnPWqBL0ZPxjdKqV1M8c/edit',
    note: 'Replace selected images after this review.',
  },
  {
    label: 'Live media library',
    href: '/admin/media-library',
    note: 'Browse local and Empathy Ledger images with curation and consent labels.',
  },
  {
    label: 'Canon board',
    href: '/admin/canon',
    note: 'Pin an EL image to a canon slot before using it in external material.',
  },
  {
    label: 'Utopia field note',
    href: '/field-notes/utopia-may-2026',
    note: 'Read the Alice build, Mykel, Fred, delivery, and Oonchiumpa story in context.',
  },
];

const local = (
  src: string,
  label: string,
  note?: string,
  tags?: string[],
): PhotoCandidate => ({ src, label, source: 'local', note, tags });

export const deckPhotoSlots: DeckPhotoSlot[] = [
  {
    id: 'cover',
    slide: 'Cover',
    job: 'Open with the work happening in real places, not a product render.',
    preferred: local(
      '/images/stories/utopia/04-build.jpg',
      'Young people building Stretch Beds in Alice Springs',
      'Best first-frame candidate if the deck needs to feel active and current.',
      ['event:alice-build', 'use:hero'],
    ),
    alternates: [
      local('/images/hero/stretch-bed-on-country.jpg', 'Stretch Bed on Country'),
      local('/images/media-pack/woman-on-red-stretch-bed.jpg', 'Stretch Bed in use'),
      local('/images/product/stretch-bed-hero.jpg', 'Product hero on red Country'),
    ],
    copyUse: 'Pairs with the line about beds off the ground and manufacturing moving On Country.',
    check: 'If a named young person is visible, confirm the matching EL media record before using externally.',
  },
  {
    id: 'production-facility',
    slide: 'Production facility',
    job: 'Show the plant as real working infrastructure.',
    preferred: local(
      '/images/process/container-factory.jpg',
      'Containerised production plant',
      'Shows the facility as a movable system, not just a machine detail.',
      ['the-plant', 'container'],
    ),
    alternates: [
      local('/images/process/factory-panorama.jpg', 'Production plant panorama'),
      local('/images/process/heat-press-container.jpg', 'Heat press inside container'),
      local('/images/process/shredder-granulator.jpg', 'Plastic shredder'),
      local('/images/process/pressed-sheets.jpg', 'Pressed recycled HDPE sheets'),
    ],
    copyUse: 'Use for the two-container plant, 30 beds per week, and community ownership pathway.',
    check: 'Use machine-only frames when people in the facility are not yet named and cleared.',
  },
  {
    id: 'alice-build',
    slide: 'Young people making beds',
    job: 'Make the jobs and ownership pathway visible through the Alice build.',
    preferred: local(
      '/images/people/mykel.jpg',
      'Mykel with the bed he built',
      'Lead image for the young maker story.',
      ['participant:mykel', 'event:alice-build'],
    ),
    alternates: [
      local('/images/people/xavier-stretch-bed-alice-springs.jpg', 'Xavier with Stretch Bed'),
      local('/images/stories/utopia/04-build.jpg', 'Alice Springs build day'),
      local('/images/product/stretch-bed-kids-building.jpg', 'Young people assembling bed legs'),
      local('/images/media-pack/community-bed-assembly.jpg', 'Community bed assembly'),
    ],
    copyUse: 'Use with Mykel, Xavier, Fred, Oonchiumpa, and the shift from delivery to local making.',
    check: 'Mykel and Xavier are cleared in the code canon. The older wiki conflict still needs a final EL/media check before external release.',
  },
  {
    id: 'delivery',
    slide: 'What delivery looks like',
    job: 'Show beds arriving, being assembled, and going into homes.',
    preferred: local(
      '/images/stories/utopia/06-delivery.jpg',
      'Beds delivered to Utopia Homelands',
      'Best working image for the handover and assembly story.',
      ['community:utopia-homelands', 'delivery'],
    ),
    alternates: [
      local('/images/stories/utopia/07-elders.jpg', 'Ampilatwatja Elders and bed testing'),
      local('/images/stories/utopia/08-beforeafter.jpg', 'Before and after sleeping setup'),
      local('/images/stories/utopia/09-offground.jpg', 'Bed off the ground in home'),
      local('/images/stories/utopia/02-arrive.jpg', 'Arrival at Utopia'),
    ],
    copyUse: 'Use with house-to-house delivery, local team in front, and the need for two or three beds per home.',
    check: 'For identifiable household images, keep attribution careful and confirm consent and Elder approval in EL.',
  },
  {
    id: 'voice-proof',
    slide: 'Community voices',
    job: 'Anchor claims in named people and places.',
    preferred: local(
      '/images/people/dianne-stokes.jpg',
      'Dianne Stokes',
      'Strongest opening voice for design in community and named demand.',
      ['participant:dianne-stokes'],
    ),
    alternates: [
      local('/images/people/fred-campbell.png', 'Fred Campbell'),
      local('/images/people/kristy-bloomfield.jpg', 'Kristy Bloomfield'),
      local('/images/people/alfred-johnson.jpg', 'Alfred Johnson'),
      local('/images/people/ivy.jpg', 'Ivy'),
    ],
    copyUse: 'Use one voice per slide. Do not stack quotes where a single named line can do the job.',
    check: 'Use the storyteller table below for quote and photo readiness.',
  },
  {
    id: 'model',
    slide: 'Operating model',
    job: 'Show the chain from need, to product, to making, to ownership.',
    preferred: local(
      '/images/stories/utopia/10-next.jpg',
      'Next step in the Utopia story',
      'Useful bridge from delivery photos to the model.',
      ['model', 'community-led'],
    ),
    alternates: [
      local('/images/partners/oonchiumpa.png', 'Oonchiumpa partner mark'),
      local('/images/process/facility-full-site.jpg', 'Full production facility site'),
      local('/images/media-pack/nic-with-elder-on-verandah.jpg', 'Yarning on the verandah with the bed'),
    ],
    copyUse: 'Use when explaining that Goods transfers capability, supply chain knowledge, and quality practice over time.',
    check: 'Keep legal structure and DGR language as future or in transition until the entity work lands.',
  },
];

export interface StorytellerReview {
  name: string;
  role: string;
  location: string;
  themes: string[];
  quote?: string;
  photo?: string;
  deckUse: string;
  source: string;
  note?: string;
  clearedForExternal: boolean;
}

const rawStorytellers: Omit<StorytellerReview, 'clearedForExternal'>[] = [
  {
    name: 'Dianne Stokes',
    role: 'Elder and design lead',
    location: 'Tennant Creek, NT',
    themes: ['design in community', 'washing machine naming', 'demand'],
    quote: 'It means something that really makes me happy. Every time I go away, it is like it is calling me. Come back home.',
    photo: '/images/people/dianne-stokes.jpg',
    deckUse: 'Open the story of asking, naming, and demand. Also use for Pakkimjalki Kari.',
    source: 'curated quotes, storyteller profile, canon',
  },
  {
    name: 'Mykel',
    role: 'Young builder',
    location: 'Alice Springs, NT',
    themes: ['young makers', 'jobs pathway', 'Alice build'],
    quote: 'Comfortable as. Smooth, tight, hard, fancy.',
    photo: '/images/people/mykel.jpg',
    deckUse: 'Feature as the lead young maker story. He built his own bed and kept going.',
    source: 'Utopia field note, current canon',
    note: 'Current code canon marks Mykel cleared. An older wiki section still says pending, so do a final EL media check before external release.',
  },
  {
    name: 'Fred Campbell',
    role: 'Youth case worker, Oonchiumpa',
    location: 'Alice Springs, NT',
    themes: ['youth pathway', 'trust', 'delivery connector'],
    quote: 'I reckon if anything, he would be probably one of the ideal candidates to go around and show the community, and how to even teach these other younger guys.',
    photo: '/images/people/fred-campbell.png',
    deckUse: 'Use Fred to explain the relationship layer behind young people building beds.',
    source: 'curated quotes, compendium, canon',
    note: 'Fred is the safest voice for Xavier until Xavier has his own EL story record.',
  },
  {
    name: 'Xavier',
    role: 'Young builder',
    location: 'Alice Springs, NT',
    themes: ['young makers', 'pride', 'paid build'],
    quote: 'He knew what he was doing. He had the pattern of how everything was all coming together.',
    photo: '/images/people/xavier-stretch-bed-alice-springs.jpg',
    deckUse: 'Use visually with Fred narrating the story. Do not present as a direct Xavier quote.',
    source: 'curated Fred quotes, current canon',
    note: 'Cleared in canon, with story told in Fred Campbell\'s voice and no own EL record.',
  },
  {
    name: 'Kristy Bloomfield',
    role: 'Oonchiumpa lead',
    location: 'Alice Springs, NT',
    themes: ['Oonchiumpa', 'youth', 'housing and school attendance'],
    quote: 'We want to create a safe space for our young people. There is a lack of housing, which leads to a lack of sleep, which leads to low school attendance.',
    photo: '/images/people/kristy-bloomfield.jpg',
    deckUse: 'Use for the partner and operating model, not as a recipient story.',
    source: 'curated quotes, canon',
  },
  {
    name: 'Karen Liddle',
    role: 'Traditional Owner, Oonchiumpa',
    location: 'Oonchiumpa, Central Australia',
    themes: ['youth', 'Oonchiumpa', 'local leadership'],
    quote: 'To see kids\' faces with joy after making a bed, it just really hits you.',
    deckUse: 'Use voice-only unless a cleared portrait is confirmed in EL.',
    source: 'Utopia field note, canon',
    note: 'Voice ready. Portrait should come from EL and be checked before use.',
  },
  {
    name: 'Katrina Bloomfield',
    role: 'Oonchiumpa worker',
    location: 'Alice Springs, NT',
    themes: ['elders', 'sleeping off the ground', 'young women'],
    quote: 'Most of our people in community are just on a blanket on the ground. These beds will come in handy.',
    deckUse: 'Use for the strongest plain-language delivery need from the Utopia trip.',
    source: 'Utopia field note, canon',
    note: 'Voice ready. Use a delivery image unless a cleared portrait is available.',
  },
  {
    name: 'Dorrie Jones',
    role: 'Recipient',
    location: 'Arlparra, Utopia Homelands, NT',
    themes: ['product feedback', 'delivery', 'comfort'],
    quote: 'Good for me and comfy, easy to put together.',
    deckUse: 'Use as a short delivery proof line if the slide is about bed use in the home.',
    source: 'Utopia field note, canon',
    note: 'Use EL portrait only after the exact media record is confirmed.',
  },
  {
    name: 'Ray Nelson',
    role: 'Recipient',
    location: 'Plenty Highway, NT',
    themes: ['rest and health', 'asset register', 'tracked bed'],
    quote: 'Since receiving their new beds, they are no longer experiencing back pains.',
    deckUse: 'Use for QR asset register proof and the human effect of one tracked bed.',
    source: 'QBE pack, canon',
    note: 'No local portrait. Use register or EL photo only if confirmed.',
  },
  {
    name: 'Ivy',
    role: 'Community voice',
    location: 'Palm Island, QLD',
    themes: ['bed need', 'family visitors', 'floor sleeping'],
    quote: 'Hardly any people around the community have got beds. When they got family members over, there is not enough for everyone.',
    photo: '/images/people/ivy.jpg',
    deckUse: 'Use for the simplest statement of need.',
    source: 'curated quotes, storyteller profile, canon',
  },
  {
    name: 'Alfred Johnson',
    role: 'Community voice',
    location: 'Palm Island, QLD',
    themes: ['safety', 'freight', 'remote cost'],
    quote: 'You have to bring them on the barge. You cannot just take them on the boat. You have to pay for freight. It all adds up.',
    photo: '/images/people/alfred-johnson.jpg',
    deckUse: 'Use for the freight and remoteness argument.',
    source: 'curated quotes, storyteller profile, canon',
  },
  {
    name: 'Norman Frank',
    role: 'Warumungu Elder',
    location: 'Tennant Creek, NT',
    themes: ['housing', 'future for children', 'self-determination'],
    quote: 'I want to see a better future for our kids and better housing.',
    photo: '/images/people/norman-frank.jpg',
    deckUse: 'Use for long-term housing and intergenerational frame.',
    source: 'curated quotes, storyteller profile, canon',
  },
  {
    name: 'Linda Turner',
    role: 'Community voice',
    location: 'Tennant Creek, NT',
    themes: ['being asked', 'housing choices', 'self-determination'],
    quote: 'We have never been asked what sort of house we would like to live in.',
    photo: '/images/people/linda-turner.jpg',
    deckUse: 'Use to explain why asking properly is part of the model.',
    source: 'curated quotes, storyteller profile, canon',
  },
  {
    name: 'Brian Russell',
    role: 'Community voice',
    location: 'Tennant Creek, NT',
    themes: ['rest', 'health', 'mobility'],
    quote: 'Back pain and all that. You are gonna be moving around with problems. That is why good beds matter.',
    photo: '/images/people/brian-russell.jpg',
    deckUse: 'Use for rest and health without overclaiming clinical outcomes.',
    source: 'curated quotes, storyteller profile, canon',
  },
  {
    name: 'Cliff Plummer',
    role: 'Health practitioner',
    location: 'Tennant Creek, NT',
    themes: ['health message', 'beds', 'community health'],
    quote: 'If I had two of those beds, I would be okay.',
    photo: '/images/people/cliff-plummer.jpg',
    deckUse: 'Use as practitioner-adjacent health framing with his role clearly labelled.',
    source: 'curated quotes, storyteller profile, canon',
  },
  {
    name: 'Patricia Frank',
    role: 'Community voice',
    location: 'Tennant Creek, NT',
    themes: ['washing machines', 'blankets', 'home'],
    quote: 'They truly wanna a washing machine to wash their blanket, to wash their clothes, and it is right there at home.',
    photo: '/images/people/patricia-frank.jpg',
    deckUse: 'Use only when the slide includes Pakkimjalki Kari or the washing pathway.',
    source: 'curated quotes, storyteller profile, canon',
  },
  {
    name: 'Melissa Jackson',
    role: 'Community voice',
    location: 'Tennant Creek, NT',
    themes: ['elder-friendly design', 'lower beds', 'product feedback'],
    quote: 'They like to have lower beds, especially for our older people.',
    photo: '/images/people/melissa-jackson.jpg',
    deckUse: 'Use for design iteration and elder-friendly product changes.',
    source: 'curated quotes, canon',
  },
  {
    name: 'Annie Morrison',
    role: 'Community member',
    location: 'Tennant Creek, NT',
    themes: ['bed demand', 'washing machines', 'older people'],
    quote: 'I was looking at the beds. They are good. I was trying to ask them if they can make one for me.',
    photo: '/images/people/annie-morrison.jpg',
    deckUse: 'Use as quiet demand evidence if a Tennant Creek voice is needed.',
    source: 'curated quotes, canon',
  },
  {
    name: 'Jimmy Frank',
    role: 'Traditional Owner',
    location: 'Tennant Creek, NT',
    themes: ['culture', 'country', 'language'],
    quote: 'Our strengths is our culture, our country, you know, and our language.',
    photo: '/images/people/jimmy-frank.jpg',
    deckUse: 'Use sparingly for cultural grounding, not for product proof.',
    source: 'content quotes, canon',
  },
  {
    name: 'Gloria Turner',
    role: 'Community voice',
    location: 'Kalgoorlie, WA',
    themes: ['rest', 'health', 'family'],
    quote: 'Sleep on a good mattress. For the back, the legs, the muscles.',
    photo: '/images/people/gloria-turner.jpg',
    deckUse: 'Use if the deck needs a WA health and rest voice.',
    source: 'curated quotes, canon',
  },
  {
    name: 'Carmelita & Colette',
    role: 'Community voices',
    location: 'Palm Island, QLD',
    themes: ['rest', 'cost of living', 'freight'],
    quote: 'We do need rest. It is for our health: maintaining health and being well.',
    photo: '/images/people/carmelita-colette.jpg',
    deckUse: 'Use for rest and cost pressure on Palm Island.',
    source: 'curated quotes, canon',
  },
  {
    name: 'Daniel Patrick Noble',
    role: 'Community voice',
    location: 'Palm Island, QLD',
    themes: ['freight', 'cost', 'community'],
    quote: 'Just to have that extra cost of bringing things over, it all adds up. Sometimes people would rather go without.',
    photo: '/images/people/daniel-patrick-noble.jpg',
    deckUse: 'Use as a stronger freight quote if Alfred is not the selected voice.',
    source: 'curated quotes, canon',
  },
  {
    name: 'Shayne Bloomfield',
    role: 'Oonchiumpa voice',
    location: 'Central Australia',
    themes: ['partnership', 'healing camp', 'young people'],
    quote: 'This partnership could go a long way. I feel it has got a long, long path ahead.',
    deckUse: 'Use voice-only for Oonchiumpa depth unless a cleared portrait is confirmed.',
    source: 'curated quotes, canon',
  },
  {
    name: 'Jason',
    role: 'Community voice',
    location: 'Palm Island, QLD',
    themes: ['community-led work', 'trust', 'local messenger'],
    quote: 'When it comes from an Aboriginal person, it works. That is what makes the difference.',
    photo: '/images/people/jason.jpg',
    deckUse: 'Use for local messenger and delivery partner logic.',
    source: 'curated quotes, canon',
  },
  {
    name: 'Gary',
    role: 'Community voice',
    location: 'Location to confirm in EL',
    themes: ['men\'s group', 'working with young people', 'patience'],
    quote: 'We do not force nothing on them. We just sit down and explain what we do, or we let them look and listen.',
    photo: '/images/people/gary.jpg',
    deckUse: 'Use only if location and context are confirmed.',
    source: 'curated quotes, canon',
  },
  {
    name: 'Heather Mundo',
    role: 'Community voice',
    location: 'Katherine, NT',
    themes: ['comfort', 'young people building', 'community'],
    quote: 'These two boys just picked it up straight away. The most important thing is it is actually comfortable.',
    photo: '/images/people/heather-mundo.jpg',
    deckUse: 'Use for quick product adoption and comfort.',
    source: 'curated quotes, canon',
  },
  {
    name: 'Mark',
    role: 'Community voice',
    location: 'Location to confirm in EL',
    themes: ['making do', 'product durability', 'floor sleeping'],
    quote: 'We put together crates, tied them up with plastic, joined them together to make it look like a bed.',
    deckUse: 'Use only if location and photo are confirmed.',
    source: 'curated quotes, canon',
  },
  {
    name: 'Risilda Hogan',
    role: 'Community voice',
    location: 'Tennant Creek, NT',
    themes: ['housing journey', 'stability', 'family'],
    quote: 'I was living at the tin shed. Then I started working, got support from Stronger Families, and moved into this house.',
    photo: '/images/people/risilda-hogan.jpg',
    deckUse: 'Use only if the deck needs a wider housing journey.',
    source: 'curated quotes, canon',
  },
  {
    name: 'Tracy McCartney',
    role: 'Support worker',
    location: 'Kalgoorlie, WA',
    themes: ['dignity', 'health', 'relationships'],
    quote: 'For me it is about building relationships with people.',
    photo: '/images/people/tracy-mccartney.jpg',
    deckUse: 'Use as practitioner or support-worker context, clearly labelled.',
    source: 'curated quotes, canon',
  },
  {
    name: 'Dr Boe Remenyi',
    role: 'Cardiologist and health practitioner',
    location: 'Practitioner voice',
    themes: ['RHD prevention rationale', 'washing', 'practical conditions'],
    quote: 'Education and awareness is great, but you need to match it with something that actually enables people to change.',
    deckUse: 'Use for why bedding and washing are practical health conditions, not as community recipient voice.',
    source: 'curated quotes, canon',
    note: 'No local portrait. Label as practitioner.',
  },
  {
    name: 'Chloe',
    role: 'Support worker',
    location: 'Kalgoorlie, WA',
    themes: ['sleeping rough', 'pneumonia', 'safety'],
    quote: 'I have put up with clients going to hospital with pneumonia from sleeping on the ground because it is too cold.',
    photo: '/images/people/chloe.jpg',
    deckUse: 'Use for frontline context, not for a claimed clinical outcome.',
    source: 'curated quotes, canon',
  },
  {
    name: 'Wayne Glenn',
    role: 'Practitioner voice',
    location: 'Location to confirm in EL',
    themes: ['overcrowding', 'simple product', 'primary health'],
    quote: 'Families are often staying with other families where the bedding is not available or sufficient.',
    photo: '/images/people/wayne-glenn.jpg',
    deckUse: 'Use for systems context with practitioner label.',
    source: 'curated quotes, canon',
  },
];

export const storytellerReview: StorytellerReview[] = rawStorytellers.map((item) => ({
  ...item,
  clearedForExternal: isClearedForExternal(item.name),
}));

export const effectModel = [
  {
    step: '1. Need is named',
    proof: 'Families and community organisations say where beds, washing, and freight fail today.',
    deckProof: 'Ivy, Alfred, Dianne, Fred, Katrina',
  },
  {
    step: '2. Product works in the house',
    proof: 'The Stretch Bed is washable, flat-packable, no tools, 26kg, and holds 200kg.',
    deckProof: 'Product close-ups plus delivery images',
  },
  {
    step: '3. Making becomes work',
    proof: 'Young people in Alice built beds they slept on, then built more for the homelands.',
    deckProof: 'Mykel, Xavier, Fred, Oonchiumpa build photos',
  },
  {
    step: '4. Plastic becomes components',
    proof: 'Each Stretch Bed diverts 20kg of HDPE into legs, pressed and cut in the plant.',
    deckProof: 'Shredder, pressed sheets, heat press, CNC',
  },
  {
    step: '5. Ownership moves closer to community',
    proof: 'The plant, documentation, training, and supply links can transfer to local enterprise over time.',
    deckProof: 'Oonchiumpa, Palm Island, advisory group, DGR / foundation transition',
  },
];

export const replacementWorkflow = [
  'Choose the slide job first: production, delivery, young makers, voice proof, or model.',
  'Pick one lead photo and one backup. Do not combine several small photos unless the slide is a contact sheet.',
  'For local images, use the path shown on this board. For EL images, pin or confirm the image in the live media library or canon board first.',
  'Before a deck leaves the team, check three things: consent, Elder approval where relevant, and whether the caption names the person correctly.',
  'In Google Slides, select the image, choose replace image, and keep the crop focused on the person or action named in the slide.',
];
