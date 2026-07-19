import { videoUrl } from '@/lib/data/media';
import { deployments, EXPECTED_DEPLOYED_BEDS } from '@/lib/data/compendium';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';

// Core content and messaging for Goods on Country
// Source: COMPENDIUM_JANUARY_2026.md

export const brand = {
  name: 'Goods on Country',
  tagline: 'Goods that heal.',
  taglineAlt: 'Built with communities, not for them.',
  mission: 'Beds, washing machines, and refrigerators designed with communities, manufactured sustainably, and eventually owned by them.',

  // Hero content for different contexts
  hero: {
    home: {
      headline: 'The Stretch Bed',
      subheadline: 'Recycled plastic, galvanised steel, heavy-duty canvas. 26kg, flat-packs, no tools. Every bed supports remote First Nations communities across Australia.',
    },
    shop: {
      headline: 'Shop the Collection',
      subheadline: 'Every purchase supports community-led design and manufacturing in remote Australia.',
    },
    about: {
      headline: 'Built with communities, not for them.',
      subheadline: 'How a question about preventable disease became a movement for community ownership.',
    },
  },

  // Memorable one-liners
  oneLiner: 'A good bed is health hardware, not furniture.',
  philosophy: 'Our job is to become unnecessary.',
};

export const story = {
  origin: `In 2018, Nicholas Marchesi attended a health conference where Dr. Bo Remenyi spoke about Rheumatic Heart Disease. Her message was clear: RHD is entirely preventable through good environmental health, yet she was filling out death certificates for children in remote communities dying from this disease.

This confronted Nicholas with the reality of disadvantage in remote Australia. Combined with his experience at Orange Sky, now serving a third of its operations in remote communities, where he witnessed people without beds, without working washing machines, and children with skin infections that cascade into RHD, it sparked the question: What can we actually build that makes a difference?

The answer became Goods: durable, repairable, community-designed "health hardware" that addresses the environmental conditions driving preventable disease.`,

  keyMilestones: [
    { year: '2018', event: 'Nic hears Dr. Bo Remenyi speak about RHD prevention' },
    { year: '2016-2020', event: 'Orange Sky expands to remote communities (now 1/3 of services)' },
    { year: 'Nov 2022', event: 'Goods project kicks off with advisory session' },
    { year: 'Sept 2023', event: 'A Curious Tractor formally founded' },
    { year: '2024+', event: 'Active bed pilots deliver 540 beds across communities' }, // canonical: see asset-canonical.ts
  ],

  problem: {
    headline: 'The Problem',
    stats: [
      { value: '59%', label: 'of remote homes lack washing machines', source: 'FRRR, 2022' },
      { value: '1 in 3', label: 'children have scabies at any time', source: 'PLOS Neglected Tropical Diseases' },
      { value: '55%', label: 'of very remote First Nations homes are overcrowded', source: 'AIHW, 2021 Census' },
      { value: '1-2 yrs', label: 'lifespan of standard washing machines (vs 10-15)', source: 'East Arnhem Spin Project' },
    ],
    description: 'Thousands of people in remote Australia sleep on the floor or share beds. Essential appliances fail within months because they were never designed for remote conditions. The freight makes everything unaffordable. This isn\'t a cultural choice. It\'s a failure of infrastructure.',
  },

  solution: {
    headline: 'Our Approach',
    points: [
      {
        title: 'Community-Led Design',
        description: 'Products refined "around the fire" with Elders and families. We listen first, design second.',
      },
      {
        title: 'Built for Remote',
        description: 'Commercial-grade foundations, local repairability, no-tool assembly. The Toyota Troopy of household goods.',
      },
      {
        title: 'Health Hardware',
        description: 'A washing machine isn\'t convenience. It\'s cardiac prevention. Clean bedding breaks the scabies cycle.',
      },
      {
        title: 'Community Ownership',
        description: 'Our goal is to transfer manufacturing to community-owned enterprises. We become unnecessary.',
      },
    ],
  },
};

export const impact = {
  headline: 'Real Impact',
  stats: [
    { value: String(CANONICAL_ASSETS.bedsDeployed), label: 'Beds deployed', icon: 'bed' }, // canonical: see asset-canonical.ts
    { value: '107', label: 'Stretch Beds on order', icon: 'demand' },
    { value: String(CANONICAL_ASSETS.communitiesServed), label: 'Communities served', icon: 'community' }, // canonical: see asset-canonical.ts
    { value: '$3M/yr', label: 'Washing machines sold → dumps', icon: 'problem', source: 'Alice Springs provider' },
  ],
};

export const productCategories = [
  {
    id: 'stretch-bed',
    name: 'The Stretch Bed',
    description: 'Recycled HDPE plastic, galvanised steel poles, heavy-duty canvas. 26kg, flat-packs, no tools. Designed for on-country production from collected community plastic.',
    products: ['stretch-bed'],
    status: 'available',
    icon: 'bed',
  },
  {
    id: 'washers',
    name: 'Washing Machines',
    description: 'Pakkimjalki Kari: commercial-grade Speed Queen base, one-button operation, named in Warumungu language. Currently in prototype with communities.',
    products: ['washing-machine-standard'],
    status: 'register-interest',
    icon: 'washer',
  },
  {
    id: 'basket-bed',
    name: 'Basket Bed',
    description: 'Our first prototype: collapsible baskets with zip ties and toppers. Single, double, and stackable. Now open source. Download the plans and build your own.',
    products: ['basket-bed-single'],
    status: 'open-source',
    icon: 'basket',
  },
];

// Verified community quotes - with source attribution
// Sources: Empathy Ledger v2 interviews + Community Voices fieldwork
export const quotes = [
  // --- Palm Island voices ---
  {
    text: 'Hardly anyone around the community has beds. When family comes to visit, people sleep on the floor.',
    author: 'Ivy',
    context: 'Palm Island',
    theme: 'community-need',
    verified: true,
  },
  {
    text: 'Having a bed is something you need; you feel more safe when you sleep in a bed. It\'s different than sleeping on the couch or the ground.',
    author: 'Alfred Johnson',
    context: 'Palm Island',
    theme: 'dignity',
    verified: true,
  },
  {
    text: 'It\'s more better than laying around on the floors... It was easy to make. Yeah, it\'s nice.',
    author: 'Ivy',
    context: 'Palm Island, after receiving bed',
    theme: 'product-feedback',
    verified: true,
  },
  {
    text: 'You can\'t just go down to the store and buy beds. It\'s a big muck-around. You have to bring them on the barge, pay for freight, and still, not everyone gets one.',
    author: 'Alfred Johnson',
    context: 'Palm Island',
    theme: 'freight-tax',
    verified: true,
  },
  // --- Tennant Creek voices (from Empathy Ledger) ---
  {
    text: 'Working both ways — cultural side in white society and Indigenous society.',
    author: 'Dianne Stokes',
    context: 'Elder, Tennant Creek',
    theme: 'co-design',
    verified: true,
  },
  {
    text: 'We\'ve never been asked at what sort of house we\'d like to live in.',
    author: 'Linda Turner',
    context: 'Tennant Creek',
    theme: 'co-design',
    verified: true,
  },
  {
    text: 'I think it\'s a great bed. Nice bed. And it\'s more lower, um, more comfortable.',
    author: 'Melissa Jackson',
    context: 'Tennant Creek',
    theme: 'product-feedback',
    verified: true,
  },
  {
    text: 'They truly wanna a washing machine to wash their blanket, to wash their clothes, and it\'s right there at home.',
    author: 'Patricia Frank',
    context: 'Tennant Creek',
    theme: 'washing-machine',
    verified: true,
  },
  {
    text: 'I want to see a better future for our kids and better housing for our people.',
    author: 'Norman Frank',
    context: 'Elder, Tennant Creek',
    theme: 'community-need',
    verified: true,
  },
  {
    text: 'Without your culture, I feel lost.',
    author: 'Norman Frank',
    context: 'Elder, Tennant Creek',
    theme: 'co-design',
    verified: true,
  },
  {
    text: 'Our strengths is our culture, our country, you know, and our language.',
    author: 'Jimmy Frank',
    context: 'Cultural Liaison, Tennant Creek',
    theme: 'co-design',
    verified: true,
  },
  {
    text: 'You got to get health messages across.',
    author: 'Cliff Plummer',
    context: 'Health Practitioner, Tennant Creek',
    theme: 'health',
    verified: true,
  },
  {
    text: 'A good night\'s sleep is important... from a big day from work.',
    author: 'Zelda Hogan',
    context: 'Tennant Creek',
    theme: 'health',
    verified: true,
  },
  {
    text: 'I like to do more, you know, but helping all the people.',
    author: 'Annie Morrison',
    context: 'Community member, Tennant Creek',
    theme: 'community-need',
    verified: true,
  },
  // --- Health workers & support workers ---
  {
    text: 'Something as simple as a good bed makes a huge difference — it improves their health, helps with mobility, and gives them dignity.',
    author: 'Chloe',
    context: 'Support Worker, Kalgoorlie',
    theme: 'health',
    verified: true,
  },
  {
    text: 'The new mattress design is not just about comfort — it\'s about dignity and health.',
    author: 'Tracy McCartney',
    context: 'Support Worker, Kalgoorlie',
    theme: 'health',
    verified: true,
  },
  // Jessica Allardyce's washing/RHD quote removed 2026-07-12: not consent-cleared
  // (storyteller-registry.ts tier: hold). Use Dr Boe Remenyi's line instead.
  {
    text: 'It\'s great to say you should wash your sheets every week. But if you don\'t have a washing machine, that\'s not going to work.',
    author: 'Dr Boe Remenyi',
    context: 'Paediatric Cardiologist',
    theme: 'health',
    verified: true,
  },
  // --- Remote community voices ---
  {
    text: 'The freight is very, very dear.',
    author: 'Carmelita',
    context: 'Palm Island',
    theme: 'freight-tax',
    verified: true,
  },
  {
    text: 'We don\'t need fancy solutions. We need beds that don\'t break, washing machines that can be fixed here, and people who actually listen.',
    author: 'Community voice',
    context: 'Palm Island',
    theme: 'co-design',
    verified: true,
  },
];

export const enterpriseOpportunity = {
  headline: 'Community production partnerships',
  description: 'We don\'t license. We transfer. Communities receive full training, manufacturing capability, and documentation. They keep 100% of what they make and sell.',
  benefits: [
    'Full training and ongoing support',
    'Manufacturing capability transfer',
    'Supply chain connections',
    'Quality assurance framework',
  ],
  philosophy: 'Our goal is to become unnecessary.',
  cta: 'Express Interest',
  email: 'hi@act.place',
};

// Key partners for about page
export const partners = {
  communityPartners: [
    {
      name: 'Dianne Stokes',
      role: 'Elder & Designer',
      location: 'Tennant Creek',
      contribution: 'Named the washing machine "Pakkimjalki Kari", refines designs "around the fire" with family',
    },
    {
      name: 'Norman Frank Jupurrurla',
      role: 'Warumungu Elder, Wilya Janta Founder',
      location: 'Tennant Creek',
      contribution: 'Housing advocate, demonstration home partnership',
    },
    {
      name: 'Oonchiumpa Consultancy',
      role: '100% Aboriginal-owned consultancy',
      location: 'Alice Springs',
      contribution: 'Deep roots partnership, community coordination',
    },
    {
      name: 'Ebony & Jahvan Oui',
      role: 'Future manufacturing leads',
      location: 'Palm Island',
      contribution: 'Training with Defy Design for on-country production',
    },
  ],
  fundingPartners: [
    { name: 'Snow Foundation', type: 'Major strategic partner' },
    { name: 'Centrecorp Foundation', type: 'Central Australia bed deployment support' },
    { name: 'Vincent Fairfax Family Foundation', type: 'Grant funding' },
    { name: 'FRRR (Backing the Future)', type: 'Grant funding' },
    { name: 'AMP Spark', type: 'Program funding' },
    { name: 'The Funding Network', type: 'Crowdfunding' },
  ],
  healthPartners: [
    { name: 'Anyinginyi Health', location: 'Tennant Creek' },
    { name: 'Miwatj Health', location: 'East Arnhem' },
    { name: 'Purple House', location: 'Central Australia' },
    { name: 'Red Dust', location: 'Darwin' },
  ],
};

// Journey stories: longer narrative arcs with before/after
// Source: Empathy Ledger v2 interviews + Community Voices fieldwork
export const journeyStories = [
  {
    id: 'zelda-tin-shed',
    title: 'From a Tin Shed to a Home',
    person: 'Zelda Hogan',
    location: 'Tennant Creek, NT',
    theme: 'housing-journey',
    pullQuote: 'A good night\'s sleep is important... from a big day from work.',
    narrative: 'Zelda moved her family from a tin shed to a house in Tennant Creek. For her, the bed wasn\'t furniture. It was the first real sign that things were changing. Her children go to school. She works. And at the end of the day, she sleeps properly. "It\'s better here. Yeah. At house." Simple words from a mother who knows what stability feels like because she lived without it.',
    quotes: [
      { text: 'It\'s better here. Yeah. At house.', context: 'On moving from a tin shed' },
      { text: 'A good night\'s sleep is important... from a big day from work.', context: 'On why beds matter' },
      { text: 'They go to school. Yeah, they do go to school. It\'s okay. Yeah. They like it.', context: 'On her children' },
    ],
  },
  {
    id: 'brian-health',
    title: 'Rest After a Heart Attack',
    person: 'Brian Russell',
    location: 'Tennant Creek, NT',
    theme: 'health',
    pullQuote: 'It\'s gonna be home for me now.',
    narrative: 'Brian had a heart attack last year. He has no bone in his feet. He chose Tennant Creek over his hometown of Doomadgee because the community here supports him. For Brian, a bed isn\'t comfort. It\'s medical necessity. Sleeping on the floor with his conditions risks pneumonia, falls, and slower recovery. When he says "It\'s gonna be home for me now," he means a place where he can rest properly and heal.',
    quotes: [
      { text: 'I had a heart attack last year... I got no bone in my feet.', context: 'On his health' },
      { text: 'I like Tennant Creek more better than back home.', context: 'On choosing community' },
      { text: 'It\'s gonna be home for me now.', context: 'On belonging' },
    ],
  },
  {
    id: 'ivy-floor-to-bed',
    title: 'From Floor to Bed',
    person: 'Ivy',
    location: 'Palm Island, QLD',
    theme: 'dignity',
    pullQuote: 'Hardly anyone around the community has beds.',
    narrative: 'Ivy slept on the floor for years. Not by choice: there simply weren\'t beds available on Palm Island. When family visited, everyone slept on the floor together. After receiving a Goods bed, the change was immediate. "It\'s more better than laying around on the floors... It was easy to make. Yeah, it\'s nice." Simple words that capture a shift in daily dignity. The bed was assembled in minutes, no tools required.',
    quotes: [
      { text: 'Hardly anyone around the community has beds. When family comes to visit, people sleep on the floor.', context: 'Describing the need' },
      { text: 'It\'s more better than laying around on the floors... It was easy to make. Yeah, it\'s nice.', context: 'After receiving a bed' },
    ],
  },
  {
    id: 'dianne-codesigner',
    title: 'She designed it. She named it.',
    person: 'Dianne Stokes',
    location: 'Tennant Creek, NT',
    theme: 'co-design',
    pullQuote: 'Working both ways — cultural side in white society and Indigenous society.',
    narrative: 'Elder Dianne Stokes designed the bed. She sat around the fire with her family refining the construction. She named the washing machine "Pakkimjalki Kari" in Warumungu language. When she received the first bed she came back within two weeks requesting twenty more for her community. Dianne embodies how Goods works: community members lead the design.',
    quotes: [
      { text: 'Working both ways — cultural side in white society and Indigenous society.', context: 'On working with Goods' },
    ],
  },
  {
    id: 'linda-never-asked',
    title: 'Never Been Asked',
    person: 'Linda Turner',
    location: 'Tennant Creek, NT',
    theme: 'co-design',
    pullQuote: 'We\'ve never been asked at what sort of house we\'d like to live in.',
    narrative: 'Linda Turner grew up in the bush. She watched the intervention reshape perceptions of Aboriginal men. She saw decisions made about her community without her community\'s input. "We\'ve never been asked at what sort of house we\'d like to live in." That single sentence captures why Goods exists, because the opposite of charity is asking people what they actually need. Linda is now setting up a business sharing culture and bush medicine. "We\'re setting this up for our kids and grandkids... independence, being in charge of your own destiny."',
    quotes: [
      { text: 'We\'ve never been asked at what sort of house we\'d like to live in.', context: 'On community voice' },
      { text: 'We\'re setting this up for our kids and grandkids... independence, being in charge of your own destiny.', context: 'On self-determination' },
    ],
  },
  {
    id: 'patricia-washing-machine',
    title: 'A Washing Machine at Home',
    person: 'Patricia Frank',
    location: 'Tennant Creek, NT',
    theme: 'washing-machine',
    pullQuote: 'They truly wanna a washing machine to wash their blanket, to wash their clothes, and it\'s right there at home.',
    narrative: 'Patricia Frank works at an Aboriginal corporation in Tennant Creek. She\'s from the Oo Tribe, White Cockatoo clan group. She sees the need every day: families without working washing machines, dirty blankets contributing to skin infections, children missing school. "They truly wanna a washing machine to wash their blanket, to wash their clothes, and it\'s right there at home." Patricia helped connect Goods with language groups across the NT, building relationships that made the Pakkimjalki Kari washing machine possible.',
    quotes: [
      { text: 'They truly wanna a washing machine to wash their blanket, to wash their clothes, and it\'s right there at home.', context: 'On the need for washing machines' },
      { text: 'We wanna help family throughout the NT and their First Nation People.', context: 'On extending reach' },
    ],
  },
];

// Short impact stories (quote cards) for grid display
export const impactStories = [
  {
    id: 'alfred-safety',
    title: 'Safety in Sleep',
    person: 'Alfred Johnson',
    location: 'Palm Island, QLD',
    quote: 'Having a bed is something you need; you feel more safe when you sleep in a bed.',
    summary: 'Alfred articulated something deeper than comfort: a sense of safety that comes from having a proper bed.',
  },
  {
    id: 'melissa-comfort',
    title: 'Lower, More Comfortable',
    person: 'Melissa Jackson',
    location: 'Tennant Creek, NT',
    quote: 'I think it\'s a great bed. Nice bed. And it\'s more lower, um, more comfortable.',
    summary: 'Melissa\'s family in Tennant Creek chose the lower bed design. Her feedback shaped the next iteration: beds designed with families, not for them.',
  },
  {
    id: 'gloria-health',
    title: 'Rest for Recovery',
    person: 'Gloria Turner',
    location: 'Kalgoorlie, WA',
    quote: 'Sleep on a good mattress. For the back, the legs, the muscles.',
    summary: 'Gloria is a great-grandmother on dialysis. For her, a mattress isn\'t about comfort. It\'s about managing chronic illness.',
  },
  {
    id: 'norman-future',
    title: 'A Better Future',
    person: 'Norman Frank',
    location: 'Tennant Creek, NT',
    quote: 'I want to see a better future for our kids and better housing for our people.',
    summary: 'Elder Norman Frank founded Wilya Janta to advocate for housing. When his daughter tried a Goods bed, he called asking for three more, in maroon.',
  },
  {
    id: 'boe-washing-logic',
    title: 'Why Washing Machines Matter',
    person: 'Dr Boe Remenyi',
    location: 'Paediatric Cardiologist, NT',
    quote: 'It\'s great to say you should wash your sheets every week. But if you don\'t have a washing machine, that\'s not going to work.',
    summary: 'A practitioner\'s logic: education only works when the hardware exists at home. Clean bedding supports the conditions that interrupt the scabies to RHD pathway.',
  },
  {
    id: 'cliff-health-messages',
    title: 'Getting Health Messages Across',
    person: 'Cliff Plummer',
    location: 'Tennant Creek, NT',
    quote: 'You got to get health messages across.',
    summary: 'Cliff is a retired Aboriginal health practitioner. He connects beds to community health: sleeping on cold ground leads to pneumonia, poor rest, slower healing.',
  },
];

// Video testimonials
export const videoTestimonials = [
  {
    id: 'cliff-beds-dignity',
    title: 'Beds and Dignity',
    person: 'Cliff Plummer',
    location: 'Palm Island',
    descriptUrl: 'https://share.descript.com/view/2gxa5x40r9N',
    embedUrl: 'https://share.descript.com/embed/2gxa5x40r9N',
    description: 'Cliff speaks about how essential goods connect to dignity and community health.',
    consent: 'EXTERNAL-LITE',
  },
  {
    id: 'dianne-washing-machine',
    title: 'Pakkimjalki Kari',
    person: 'Dianne Stokes',
    location: 'Tennant Creek',
    descriptUrl: undefined as string | undefined, // TODO: Add Descript URL when available
    embedUrl: undefined as string | undefined,     // TODO: Add Descript embed URL when available
    description: 'Elder Dianne Stokes on designing and naming the Pakkimjalki Kari washing machine in Warumungu language.',
    consent: 'EXTERNAL-LITE',
  },
];

// Community partnerships
export const communityPartnerships = [
  {
    id: 'tennant-creek',
    name: 'Tennant Creek',
    region: 'Northern Territory',
    headline: 'Where it all began',
    description: 'Tennant Creek is the birthplace of Goods on Country. Elder Dianne Stokes received the first bed and came back within two weeks requesting twenty more. Norman Frank called asking for three beds in maroon after his daughter tried one. The Pakkimjalki Kari washing machine was named here in Warumungu language by Dianne herself.',
    keyPeople: ['Dianne Stokes', 'Norman Frank', 'Kristy Bloomfield'],
    bedsDelivered: 159,
    highlight: 'Dianne named the washing machine "Pakkimjalki Kari" in Warumungu language',
  },
  {
    id: 'alice-springs',
    name: 'Alice Springs',
    region: 'Northern Territory',
    headline: 'Traditional knowledge meets modern design',
    description: 'Through the Oonchiumpa consultancy, Alice Springs is where the design happens in community for Goods products. The Stretch Bed was designed in community with the Bloomfield family, combining traditional knowledge with modern durability. Kristy Bloomfield leads this 100% Aboriginal-owned consultancy.',
    keyPeople: ['Kristy Bloomfield', 'Oonchiumpa family'],
    bedsDelivered: 16,
    highlight: 'Oonchiumpa: 100% Aboriginal-owned consultancy leading the design in community',
  },
  {
    id: 'palm-island',
    name: 'Palm Island',
    region: 'Queensland',
    headline: 'Community voices shaping the future',
    description: 'Palm Island has been central to understanding the real impact of Goods. Ivy and Alfred Johnson gave the first community feedback that shaped the bed design. The Palm Island Community Company (PICC) partnership ensures beds reach families who need them, guided by Elder advisory.',
    keyPeople: ['Ivy', 'Alfred Johnson', 'PICC team', 'Elder advisory group'],
    bedsDelivered: 131,
    highlight: '"Hardly anyone around the community has beds" — Ivy, Palm Island',
  },
  {
    id: 'townsville',
    name: 'Townsville',
    region: 'Queensland',
    headline: 'Regional hub for logistics and distribution',
    description: 'Townsville serves as the regional logistics hub connecting production to remote communities across North Queensland. From here, beds are distributed to Palm Island and surrounding communities. The hub reduces freight costs and delivery times for remote families.',
    keyPeople: ['Regional logistics partners'],
    bedsDelivered: 0,
    highlight: 'Regional hub reducing the "freight tax" on remote communities',
  },
  {
    id: 'utopia-homelands',
    name: 'Utopia Homelands',
    region: 'Northern Territory',
    headline: 'Art and culture meets practical solutions',
    description: 'Utopia Homelands, famous for its art movement and the legacy of Emily Kame Kngwarreye, is home to multiple outstations across Anmatyerr and Alyawarr country. Beds are delivered to families living on homelands where access to essential goods has long been a challenge.',
    keyPeople: ['Community elders', 'Homeland coordinators'],
    bedsDelivered: 147,
    highlight: 'Supporting families on remote outstations',
  },
  {
    id: 'maningrida',
    name: 'Maningrida',
    region: 'Northern Territory',
    headline: 'Arnhem Land partnership',
    description: 'Maningrida sits on the banks of the Liverpool River in Arnhem Land. This diverse community of over 2,500 people from multiple language groups is a hub for Yolŋu and other First Nations art and culture. Goods partners with local organisations to deliver beds to families across the region.',
    keyPeople: ['Local organisations', 'Community leaders'],
    bedsDelivered: 58,
    highlight: 'Serving multiple language groups across Arnhem Land',
  },
];

// Process steps for "How It's Made"
export const processSteps = [
  {
    step: 1,
    title: 'Source',
    subtitle: 'Collecting recycled plastic',
    description: 'Every Stretch Bed starts with recycled HDPE plastic collected from communities. Each bed diverts 20kg of plastic from landfill, turning waste into a health resource.',
    icon: 'recycle',
  },
  {
    step: 2,
    title: 'Process',
    subtitle: 'Melting plastic into sheets',
    description: 'Collected plastic is cleaned, sorted, and melted into durable sheets. This circular economy process creates strong, weather-resistant material perfect for remote conditions.',
    icon: 'flame',
  },
  {
    step: 3,
    title: 'Cut',
    subtitle: 'Cutting shapes from sheets',
    description: 'Precision cutting creates the components for each bed frame. Every cut is optimised to minimise waste. What remains gets fed back into the next batch.',
    icon: 'scissors',
  },
  {
    step: 4,
    title: 'Build',
    subtitle: 'Pressing recycled plastic legs',
    description: 'Melted HDPE plastic is pressed into four sturdy bed legs using moulds in the containerised factory. These recycled plastic components are the foundation of every Stretch Bed: strong, weather-resistant, and made entirely from community waste.',
    icon: 'wrench',
  },
  {
    step: 5,
    title: 'Assemble',
    subtitle: 'Steel poles through canvas',
    description: 'Two galvanised steel poles (26.9mm OD) thread through sleeves sewn into heavy-duty Australian canvas and the holes in the recycled-plastic X-legs. Tension holds it together. No tools, under 5 minutes. 200kg load capacity.',
    icon: 'weave',
  },
  {
    step: 6,
    title: 'Deliver',
    subtitle: 'Beds reaching communities',
    description: 'Finished beds travel to remote communities across Australia. Every delivery is an event: families gather, beds are assembled together, and community grows stronger.',
    icon: 'truck',
  },
];

// Investment case: the QBE Foundation catalytic raise, current as of 1 Jul 2026.
// Ask, stack, risks and timeline are sourced from canon (canon.ts) and the QBE
// Opportunity Register (Notion, "Goods x QBE - Start Here"). Update both when
// the raise moves. Credit line required on all investor materials: "Catalysing
// Impact, powered by Social Impact Hub, in partnership with QBE Foundation."
export const investmentCase = {
  headline: 'Beds off the ground, made and owned On Country.',
  totalAsk: '$400,000',
  fundingLines: [
    {
      id: 'sefa',
      title: 'SEFA: repayable finance anchor',
      amount: '$300,000',
      description: 'Concessional/blended loan, no ownership gate. Lends to social-enterprise companies. The anchor of every scenario; repayable carries the highest QBE match value.',
    },
    {
      id: 'snow',
      title: 'Snow Foundation: first-mover commitment',
      amount: '$100,000',
      description: 'Deepest funder relationship, repeat backer. Being reframed from a grant ask to a signed multi-year LOI or repayable first-mover paper, the form QBE counts as match.',
    },
    {
      id: 'centrecorp',
      title: 'Centrecorp Foundation: grant / bed-order split',
      amount: '$75,000',
      description: 'Central Australia grant kept separate from the bed-order revenue it sits alongside, so the match and the sale are never double-counted.',
    },
  ],

  demand: [
    { text: 'Dianne Stokes received one bed, then asked for 20 more within two weeks and offered to fund them herself', person: 'Dianne Stokes, Tennant Creek' },
    { text: 'Norman Frank called requesting three beds in maroon after his daughter tried them', person: 'Norman Frank, Tennant Creek' },
    { text: 'Utopian homelands want beds for every child (~$150,000 worth)', person: 'Utopia Homelands, NT' },
    { text: 'Homeland Schools Company requesting 65 beds for kids across Maningrida communities', person: 'Maningrida, NT' },
    { text: 'Four health organisations reached out following last year\'s forum', person: 'Healthy Homes coordinators, OT workers' },
    { text: 'NPY Women\'s Council: "always looking for beds"', person: 'Angela Lynch, NPY Women\'s Council' },
  ],

  productionPlant: {
    investment: '$110,046 of press capex already spent (TFN + ACT)',
    capabilities: [
      'Shred plastic waste',
      'Press recycled HDPE into the X-trestle leg components',
      'Computer-controlled cutting for canvas and bed components',
    ],
    capacity: '~30 beds a week, built to move community to community',
    model: 'A two-container system: one collects and shreds plastic on an ongoing basis, the other presses and assembles. Built to move into community ownership.',
    futureCapability: 'Same facility will produce washing machines using different molds and cut files.',
    plasticPerBed: '20kg per bed',
  },

  // Current working risk picture (wiki/articles/governance/risk-register.md).
  // A founder-review draft, not yet board-adopted.
  risks: [
    {
      risk: 'Key people',
      detail: 'The two founders remain the bottleneck. High likelihood, high consequence.',
      mitigation: 'Move production, operations and sales into clearer roles. Phase-1 hires (GM, then Business Development) are the priority once the catalytic raise lands.',
    },
    {
      risk: 'Debt',
      detail: 'Repayable capital is taken on before the model can service it. Medium likelihood, high consequence.',
      mitigation: 'Patient terms, stress tests, and debt sized to credible demand, not hope. SEFA is structured as concessional, not market-rate.',
    },
    {
      risk: 'Governance',
      detail: 'Legal or board structure lags investor needs. Medium likelihood, high consequence.',
      mitigation: 'Advisory committee in place today; QBE, SIH and legal counsel are helping pick the minimum viable structure once the entity decision lands (~end July 2026).',
    },
    {
      risk: 'Community ownership',
      detail: 'The local ownership model ends up too Western, complex, or under-resourced. Medium likelihood, high consequence.',
      mitigation: 'In active design with Palm Island Community Company and Oonchiumpa, learning from existing community-controlled structures, tested place by place.',
    },
    {
      risk: 'Cashflow',
      detail: 'Costs land before grant or customer payments. High likelihood, medium-to-high consequence.',
      mitigation: 'Working capital planning, shorter payment cycles, debt only taken when matched to revenue.',
    },
    {
      risk: 'Story and data',
      detail: 'A story or image is used in a way the storyteller did not consent to. Medium likelihood, very high consequence.',
      mitigation: 'Consent practice, story return, withdrawal rights, careful approval before anything ships externally.',
    },
    {
      risk: 'Environmental',
      detail: 'Goods adds to the waste problem it is trying to solve: offcuts, end-of-life parts, transport emissions. Medium likelihood, high consequence.',
      mitigation: 'Design for repair, reuse and end-of-life; environmental controls are an active gap being worked on, not yet solved.',
    },
    {
      risk: 'Production',
      detail: 'Materials, machinery or labour delay delivery. Medium likelihood, medium-to-high consequence.',
      mitigation: 'Supplier planning, inventory buffers, simpler SOPs, local operator training.',
    },
  ],

  partnerships: [
    {
      name: 'Oonchiumpa',
      role: 'Lead design partner, 100% Aboriginal-owned consultancy',
      detail: 'Led by Kristy Bloomfield in Alice Springs. Design happens in community, around the fire, with Elders. Two years of iterative engagement.',
    },
    {
      name: 'Palm Island Community Company',
      role: 'Community delivery partner',
      detail: 'Guides beds to the families who need them, with Elder advisory. Central to the early feedback that shaped the bed design.',
    },
  ],

  // The QBE Stage 2 critical path (Goods x QBE - Start Here, Notion, 26 Jun 2026).
  timeline: [
    {
      period: 'Mid-Jul 2026',
      items: [
        'Advisory workshop tests the cost model and scenarios before the raise',
        'Repayable finance conversations open: SEFA, Snow, Centrecorp, White Box SELF',
      ],
    },
    {
      period: 'End Jul 2026',
      items: [
        'Butterfly DGR transition expected to land',
        'Entity and 51% First Nations ownership path reviewed with legal counsel',
      ],
    },
    {
      period: 'Aug 2026',
      items: [
        'QBE Foundation hackathon with Catalysing Impact and Social Impact Hub',
        'Target: close the first AU$400,000 of signed, match-eligible capital by 31 August',
      ],
    },
    {
      period: 'Sep–Nov 2026',
      items: [
        'QBE Stage 2 application submitted (September)',
        'Steering Committee assessment (October)',
        'Funding outcome decided (November)',
      ],
    },
  ],

  // Active pipeline, QBE Opportunity Register (Notion). None signed yet —
  // this is a conversion task, not a discovery one. Do not present these as
  // secured funding.
  funders: [
    { name: 'SEFA', type: 'Repayable finance, target $300K', status: 'Briefing' },
    { name: 'Snow Foundation', type: 'Multi-year LOI, target $100K', status: 'Pursuing' },
    { name: 'Centrecorp Foundation', type: 'Grant + bed order, target $75K', status: 'Pursuing' },
    { name: 'The Funding Network', amount: '~$80K', type: 'Production facility', status: 'Completed' },
  ],

  potentialFunders: [
    { name: 'White Box SELF', focus: 'Repayable social-enterprise loan, target $250K' },
    { name: 'Minderoo Foundation', focus: 'Catalytic QBE-aligned grant, target $200K' },
    { name: 'Vincent Fairfax Family Foundation', focus: 'Repeat-funder grant tail, target $50K' },
  ],
};

// Community locations: coordinates for map
export type CommunityLocation = {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  storytellerCount: number;
  bedsDelivered: number;
  description: string;
  highlight: string;
  /**
   * Optional tooltip placement on the heatpost map. Use when two
   * communities sit close together and their default-right labels would
   * collide (e.g. Utopia Homelands + Ampilatwatja, Palm Island + Townsville).
   * Defaults to 'right'.
   */
  tooltipDirection?: 'left' | 'right' | 'top' | 'bottom';
  /**
   * When true, the live-map resolver does NOT override `bedsDelivered`
   * with the count from the QR-tagged assets register. Use for hand-
   * curated entries not yet tracked in the register, so the map can
   * reflect a confirmed on-ground number ahead of full QR registration.
   */
  staticBedCount?: boolean;
};

export const communityLocations: CommunityLocation[] = [
  {
    id: 'tennant-creek',
    name: 'Tennant Creek',
    region: 'Northern Territory',
    lat: -19.648,
    lng: 134.192,
    storytellerCount: 6,
    bedsDelivered: 159,
    description: 'The birthplace of Goods on Country. Elder Dianne Stokes received the first bed and came back requesting twenty more.',
    highlight: 'Dianne named the washing machine "Pakkimjalki Kari" in Warumungu language',
  },
  {
    id: 'palm-island',
    name: 'Palm Island',
    region: 'Queensland',
    lat: -18.735,
    lng: 146.581,
    storytellerCount: 2,
    bedsDelivered: 131,
    description: 'Community voices shaping the future. Ivy and Alfred Johnson gave the first community feedback that shaped the bed design.',
    highlight: '"Hardly anyone around the community has beds" — Ivy',
  },
  {
    id: 'alice-springs',
    name: 'Alice Springs',
    region: 'Northern Territory',
    lat: -23.698,
    lng: 133.880,
    storytellerCount: 0,
    bedsDelivered: 16,
    description: 'Through the Oonchiumpa consultancy, Alice Springs is where the design happens in community for Goods products.',
    highlight: 'Oonchiumpa: 100% Aboriginal-owned consultancy leading the design in community',
    tooltipDirection: 'bottom',
  },
  // Townsville removed from the heatpost map: 0 beds delivered there
  // and the dot sat on top of Palm Island, colliding labels. The freight
  // hub story lives in /story rather than as a fake-presence pin.
  {
    id: 'utopia-homelands',
    name: 'Utopia Homelands',
    region: 'Northern Territory',
    lat: -22.0,
    lng: 134.8,
    storytellerCount: 0,
    bedsDelivered: 147,
    description: 'Anmatyerr and Alyawarr country, including the Ampilatwatja outstation where Frankie Holmes OAM and Mr Donald Thompson OAM each received beds in May 2026. Multiple outstations across the homelands. Young people in Alice Springs built and delivered beds to outstation families the next day.',
    highlight: 'Designed and built with young people in Alice Springs, delivered on country to outstation families. Includes Ampilatwatja, where two senior Alyawarr brothers received beds in May 2026.',
    tooltipDirection: 'left',
  },
  // Ampilatwatja folded into Utopia Homelands on the heatpost map (same
  // homelands region; the QR/assets register records those beds under
  // Utopia Homelands). The narrative on field-notes still names
  // Ampilatwatja explicitly because that is where Frankie and Donald live.
  {
    id: 'mount-isa',
    name: 'Mount Isa',
    region: 'Queensland',
    lat: -20.7256,
    lng: 139.4927,
    storytellerCount: 0,
    bedsDelivered: 2,
    description: 'Northwest Queensland mining town and service centre for surrounding communities. Goods has begun seeding beds here as a stepping stone to further Queensland deployments.',
    highlight: 'Stepping stone for Queensland deployments beyond Palm Island',
    tooltipDirection: 'right',
  },
  {
    id: 'kalgoorlie',
    name: 'Kalgoorlie',
    region: 'Western Australia',
    lat: -30.7494,
    lng: 121.4655,
    storytellerCount: 0,
    bedsDelivered: 20,
    description: "Goldfields region of Western Australia. Goods' first Western Australia deployment, seeding beds with community partners in and around Kalgoorlie.",
    highlight: "First Western Australia deployment for Goods on Country",
    tooltipDirection: 'right',
  },
  {
    id: 'maningrida',
    name: 'Maningrida',
    region: 'Northern Territory',
    lat: -12.056,
    lng: 134.269,
    storytellerCount: 0,
    bedsDelivered: 58,
    description: 'On the banks of the Liverpool River in Arnhem Land. A diverse community of over 2,500 people from multiple language groups.',
    highlight: 'Serving multiple language groups across Arnhem Land',
  },
  {
    id: 'darwin',
    name: 'Darwin',
    region: 'Northern Territory',
    lat: -12.4634,
    lng: 130.8456,
    storytellerCount: 0,
    bedsDelivered: 1,
    description: 'Top End deployment. One bed delivered in the Darwin region as Goods extends across the north.',
    highlight: 'First Darwin-region deployment',
  },
  {
    id: 'canberra',
    name: 'Canberra',
    region: 'Australian Capital Territory',
    lat: -35.2809,
    lng: 149.13,
    storytellerCount: 0,
    bedsDelivered: 2,
    description: 'Two beds delivered in the Canberra region.',
    highlight: 'First beds in the Canberra region',
    tooltipDirection: 'left',
  },
];

// ---------------------------------------------------------------------------
// Bed-count reconciliation (build-time assertion)
// ---------------------------------------------------------------------------
//
// The canonical deployed-bed register lives in compendium.ts `deployments`
// (sums to EXPECTED_DEPLOYED_BEDS = 540; the live Supabase register is
// authoritative, this is the labelled static fallback).
//
// `communityLocations` (heatpost-map baselines, live-overridden except where
// staticBedCount=true) now covers all 9 deployed communities, including the
// single-bed capital-city deployments Darwin (1) and Canberra (2), so the map
// matches the published "11 communities / 540 beds". `communityPartnerships`
// (narrative subset) stays INTENTIONALLY NARROWER: it lists only communities
// with a real narrative partner, so it still omits Darwin/Canberra (a bare
// deployment is not a partnership story, and inventing one would be fabrication).
// So we do NOT force either array's sum to equal 540. Instead we assert that
// (a) no single community's static count EXCEEDS the canonical register value,
// and (b) neither array's total exceeds EXPECTED_DEPLOYED_BEDS. This catches the
// previous divergence (139/141/60/96 baselines that overstated some communities)
// without inventing data.
{
  const canonicalByCommunity: Record<string, number> = {};
  for (const d of deployments) {
    // normalise "Alice Homelands"/"Alice Springs" and "Utopia Homelands"/"Utopia"
    const key = d.community.toLowerCase().replace(/\s+(homelands|springs)$/, '').trim();
    canonicalByCommunity[key] = (canonicalByCommunity[key] || 0) + d.beds;
  }
  const norm = (s: string) => s.toLowerCase().replace(/\s+(homelands|springs)$/, '').trim();

  const overstated: string[] = [];
  for (const loc of communityLocations) {
    const cap = canonicalByCommunity[norm(loc.name)];
    if (cap !== undefined && loc.bedsDelivered > cap) {
      overstated.push(`communityLocations "${loc.name}" (${loc.bedsDelivered} > canonical ${cap})`);
    }
  }
  for (const p of communityPartnerships) {
    const cap = canonicalByCommunity[norm(p.name)];
    if (cap !== undefined && p.bedsDelivered > cap) {
      overstated.push(`communityPartnerships "${p.name}" (${p.bedsDelivered} > canonical ${cap})`);
    }
  }
  if (overstated.length > 0) {
    throw new Error(
      `[content] static bed counts overstate the canonical register: ${overstated.join('; ')}. ` +
        `Reconcile to compendium.ts deployments.`,
    );
  }

  const partnershipsTotal = communityPartnerships.reduce((s, p) => s + p.bedsDelivered, 0);
  const locationsTotal = communityLocations.reduce((s, l) => s + l.bedsDelivered, 0);
  if (partnershipsTotal > EXPECTED_DEPLOYED_BEDS || locationsTotal > EXPECTED_DEPLOYED_BEDS) {
    throw new Error(
      `[content] static bed-count total exceeds canonical ${EXPECTED_DEPLOYED_BEDS} ` +
        `(partnerships=${partnershipsTotal}, locations=${locationsTotal}).`,
    );
  }
}

// Storyteller profiles: for the stories grid
// Only includes people with verified quotes + photos
export const storytellerProfiles = [
  {
    id: 'dianne-stokes',
    name: 'Dianne Stokes',
    role: 'Elder. Named and designed the Pakkimjalki Kari washing machine.',
    location: 'Tennant Creek, NT',
    community: 'tennant-creek',
    photo: '/images/people/dianne-stokes.jpg',
    keyQuote: 'Working both ways — cultural side in white society and Indigenous society.',
    isElder: true,
    hasVideo: false,
    themes: ['co-design'],
  },
  {
    id: 'norman-frank',
    name: 'Norman Frank',
    role: 'Warumungu Elder',
    location: 'Tennant Creek, NT',
    community: 'tennant-creek',
    photo: '/images/people/norman-frank.jpg',
    keyQuote: 'I want to see a better future for our kids and better housing for our people.',
    isElder: true,
    hasVideo: false,
    themes: ['community-need', 'co-design'],
  },
  {
    id: 'linda-turner',
    name: 'Linda Turner',
    location: 'Tennant Creek, NT',
    community: 'tennant-creek',
    photo: '/images/people/linda-turner.jpg',
    keyQuote: 'We\'ve never been asked at what sort of house we\'d like to live in.',
    isElder: false,
    hasVideo: false,
    themes: ['co-design'],
  },
  {
    id: 'ivy',
    name: 'Ivy',
    location: 'Palm Island, QLD',
    community: 'palm-island',
    photo: '/images/people/ivy.jpg',
    keyQuote: 'Hardly anyone around the community has beds. When family comes to visit, people sleep on the floor.',
    isElder: false,
    hasVideo: false,
    themes: ['community-need', 'dignity'],
  },
  {
    id: 'alfred-johnson',
    name: 'Alfred Johnson',
    location: 'Palm Island, QLD',
    community: 'palm-island',
    photo: '/images/people/alfred-johnson.jpg',
    keyQuote: 'Having a bed is something you need; you feel more safe when you sleep in a bed.',
    isElder: false,
    hasVideo: false,
    themes: ['dignity', 'health'],
  },
  {
    id: 'patricia-frank',
    name: 'Patricia Frank',
    location: 'Tennant Creek, NT',
    community: 'tennant-creek',
    photo: '/images/people/patricia-frank.jpg',
    keyQuote: 'They truly wanna a washing machine to wash their blanket, to wash their clothes, and it\'s right there at home.',
    isElder: false,
    hasVideo: false,
    themes: ['washing-machine', 'community-need'],
  },
  {
    id: 'cliff-plummer',
    name: 'Cliff Plummer',
    role: 'Health Practitioner',
    location: 'Tennant Creek, NT',
    community: 'tennant-creek',
    photo: '/images/people/cliff-plummer.jpg',
    keyQuote: 'You got to get health messages across.',
    isElder: false,
    hasVideo: true,
    videoEmbed: 'https://share.descript.com/embed/2gxa5x40r9N',
    themes: ['health'],
  },
  {
    id: 'brian-russell',
    name: 'Brian Russell',
    location: 'Tennant Creek, NT',
    community: 'tennant-creek',
    photo: '/images/people/brian-russell.jpg',
    keyQuote: 'It\'s gonna be home for me now.',
    isElder: false,
    hasVideo: false,
    themes: ['health', 'dignity'],
  },
];

// Local enrichment for EL storytellers: adds fields not stored in EL
// Keyed by storyteller name (matched case-insensitively at merge time)
export const storytellerEnrichment: Record<string, {
  community?: string;
  hasVideo?: boolean;
  videoEmbed?: string;
  localPhoto?: string;
  role?: string;
}> = {
  'Dianne Stokes': { community: 'tennant-creek', localPhoto: '/images/people/dianne-stokes.jpg', role: 'Elder. Named and designed the Pakkimjalki Kari.' },
  'Norman Frank': { community: 'tennant-creek', localPhoto: '/images/people/norman-frank.jpg', role: 'Warumungu Elder' },
  'Linda Turner': { community: 'tennant-creek', localPhoto: '/images/people/linda-turner.jpg' },
  'Ivy': { community: 'palm-island', localPhoto: '/images/people/ivy.jpg' },
  'Alfred Johnson': { community: 'palm-island', localPhoto: '/images/people/alfred-johnson.jpg' },
  'Patricia Frank': { community: 'tennant-creek', localPhoto: '/images/people/patricia-frank.jpg' },
  'Cliff Plummer': { community: 'tennant-creek', localPhoto: '/images/people/cliff-plummer.jpg', hasVideo: true, videoEmbed: 'https://share.descript.com/embed/2gxa5x40r9N', role: 'Health Practitioner' },
  'Brian Russell': { community: 'tennant-creek', localPhoto: '/images/people/brian-russell.jpg' },
  'Dr Boe Remenyi': { localPhoto: '/images/people/boe-remenyi.jpg', role: 'Paediatric Cardiologist, NT' },
};

// Video gallery items: local videos + external embeds
export const videoGallery = [
  // Jaquilane testimony PULLED 2026-07-03 — consent clearance in conflict; removed
  // from all public surfaces (/gallery, /stories, /story) until clearance is
  // confirmed. Asset remains in the repo (jaquilane-testimony.mp4). Re-add once cleared.
  {
    id: 'cliff-beds-dignity',
    title: 'Beds and Dignity',
    description: 'Cliff Plummer speaks about how essential goods connect to dignity and community health.',
    person: 'Cliff Plummer',
    embedUrl: 'https://share.descript.com/embed/2gxa5x40r9N',
    type: 'embed' as const,
    category: 'testimony',
  },
  {
    id: 'building-together',
    title: 'Building Together',
    description: 'Community members assembling beds together on country.',
    src: videoUrl('building-together-desktop.mp4'),
    poster: '/video/building-together-poster.jpg',
    type: 'local' as const,
    category: 'process',
  },
  {
    id: 'community-gathering',
    title: 'Community',
    description: 'Community gathering for bed delivery and assembly.',
    src: videoUrl('community-desktop.mp4'),
    poster: '/video/community-poster.jpg',
    type: 'local' as const,
    category: 'community',
  },
  {
    id: 'recycling-plant',
    title: 'The Recycling Plant',
    description: 'Inside the containerised factory where community plastic becomes beds.',
    src: videoUrl('recycling-plant-desktop.mp4'),
    poster: '/video/recycling-plant-poster.jpg',
    type: 'local' as const,
    category: 'process',
  },
  {
    id: 'stretch-bed-assembly',
    title: 'The Stretch Bed',
    description: 'Close-up of the bed assembly: no tools, under 5 minutes.',
    src: videoUrl('stretch-bed-desktop.mp4'),
    poster: '/video/stretch-bed-poster.jpg',
    type: 'local' as const,
    category: 'product',
  },
];

// --- Thematic Analysis Feature ---

// Theme type for type safety
export type ThemeId =
  | 'co-design'
  | 'health'
  | 'dignity'
  | 'community-need'
  | 'product-feedback'
  | 'washing-machine'
  | 'freight-tax';

// Theme definitions with styling
export const themeDefinitions: Record<
  ThemeId,
  {
    id: ThemeId;
    title: string;
    subtitle: string;
    color: string;
    className: string;
  }
> = {
  'co-design': {
    id: 'co-design',
    title: 'Community Voice',
    subtitle: 'Built with communities, not for them',
    color: 'amber',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  health: {
    id: 'health',
    title: 'Health & Wellbeing',
    subtitle: 'Beds and washing machines as health hardware',
    color: 'red',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  dignity: {
    id: 'dignity',
    title: 'Dignity & Safety',
    subtitle: 'The emotional impact of having a proper bed',
    color: 'purple',
    className: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  'community-need': {
    id: 'community-need',
    title: 'Basic Needs',
    subtitle: 'Why this work is necessary',
    color: 'blue',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  'product-feedback': {
    id: 'product-feedback',
    title: 'Product Feedback',
    subtitle: 'What people say about the beds',
    color: 'green',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  'washing-machine': {
    id: 'washing-machine',
    title: 'Washing Machines',
    subtitle: 'Clean bedding breaks the scabies cycle',
    color: 'teal',
    className: 'bg-teal-100 text-teal-800 border-teal-200',
  },
  'freight-tax': {
    id: 'freight-tax',
    title: 'The Freight Tax',
    subtitle: 'Every remote community pays a remoteness premium',
    color: 'slate',
    className: 'bg-slate-100 text-slate-800 border-slate-200',
  },
};

// Spotlight theme groups for homepage tabs
export const spotlightThemeGroups = [
  {
    id: 'health-wellbeing',
    title: 'Health & Wellbeing',
    themes: ['health'] as ThemeId[],
    color: 'red',
  },
  {
    id: 'community-voice',
    title: 'Community Voice',
    themes: ['co-design'] as ThemeId[],
    color: 'amber',
  },
  {
    id: 'dignity-safety',
    title: 'Dignity & Safety',
    themes: ['dignity'] as ThemeId[],
    color: 'purple',
  },
  {
    id: 'basic-needs',
    title: 'Basic Needs',
    themes: ['community-need', 'freight-tax'] as ThemeId[],
    color: 'blue',
  },
];

// Helper: Get count of quotes per theme
export function getThemeCounts(): Record<ThemeId, number> {
  const counts: Record<ThemeId, number> = {
    'co-design': 0,
    health: 0,
    dignity: 0,
    'community-need': 0,
    'product-feedback': 0,
    'washing-machine': 0,
    'freight-tax': 0,
  };

  for (const quote of quotes) {
    const theme = quote.theme as ThemeId;
    if (theme in counts) {
      counts[theme]++;
    }
  }

  return counts;
}

// Helper: Get quotes filtered by theme
export function getQuotesByTheme(themeId: ThemeId) {
  return quotes.filter((q) => q.theme === themeId);
}

// Helper: Get all quotes for multiple themes
export function getQuotesByThemes(themeIds: ThemeId[]) {
  return quotes.filter((q) => themeIds.includes(q.theme as ThemeId));
}

// ---------- Media Pack ----------

export const mediaPack = {
  // About A Curious Tractor: the parent organisation
  aboutACT: `A Curious Tractor is the organisation behind Goods on Country. Founded in September 2023 by Nicholas Marchesi and Benjamin Knight, ACT exists to design, manufacture, and transfer ownership of essential goods to remote First Nations communities across Australia. The name reflects the approach: curiosity-driven problem solving applied to entrenched disadvantage. ACT is a social enterprise working toward community ownership of manufacturing.`, // NOTE: ACT (A Curious Tractor Pty Ltd) is NOT a registered charity or DGR entity — do not add that claim here.

  // Copy-paste-ready press boilerplate
  pressBoilerplate: `Goods on Country is a social enterprise delivering durable, community-designed essential goods to remote First Nations communities across Australia. The flagship product, the Stretch Bed, is a flat-packable, washable bed made from recycled HDPE plastic, galvanised steel, and heavy-duty Australian canvas. Each bed diverts 20kg of plastic from landfill, assembles in under five minutes with no tools, and supports up to 200kg. With 540 beds delivered across 11 communities, Goods on Country addresses the environmental health conditions that drive preventable disease, including Rheumatic Heart Disease, by putting health hardware directly into the hands of families who need it. The organisation's long-term goal is to transfer manufacturing capability to community-owned enterprises. Founded in 2023, Goods on Country is a project of A Curious Tractor.`,

  // Brand color palette
  brandColors: [
    { name: 'Cream', hex: '#FDF8F3' },
    { name: 'Sage', hex: '#8B9D77' },
    { name: 'Rust', hex: '#C45C3E' },
    { name: 'Charcoal', hex: '#2E2E2E' },
  ],

  // ──────────────────────────────────────────────────────────────
  // VIDEOS: How to add/edit:
  //
  // 1. To ADD a new video, copy-paste this template:
  //    {
  //      title: 'Video Title',
  //      description: 'What the video shows.',
  //      embedUrl: 'https://share.descript.com/embed/XXXXX',  // Descript embed URL
  //      downloadSrc: '/video/filename.mp4',                  // local file for download
  //    },
  //
  // 2. To get the Descript EMBED URL:
  //    - Open the video in Descript → Share → Embed → copy the URL
  //    - It looks like: https://share.descript.com/embed/XXXXX
  //
  // 3. To add a DOWNLOADABLE video file:
  //    - Drop the .mp4 into v2/public/video/
  //    - Set downloadSrc to '/video/your-filename.mp4'
  //
  // 4. Either embedUrl or downloadSrc can be left as undefined
  //    - embedUrl only = embed player, no download
  //    - downloadSrc only = download button, no embed
  //    - both set = embed player + download button underneath
  // ──────────────────────────────────────────────────────────────
  videos: [
    {
      title: 'Beds & Dignity: Cliff Plummer',
      description: 'Cliff speaks about how essential goods connect to dignity and community health.',
      embedUrl: 'https://share.descript.com/embed/2gxa5x40r9N',
      downloadSrc: undefined as string | undefined,
    },
    {
      title: 'The Recycling Plant',
      description: 'Inside the containerised factory where community plastic becomes beds.',
      embedUrl: 'https://share.descript.com/embed/haRZJbfJadJ',
      downloadSrc: videoUrl('recycling-plant-desktop.mp4'),
    },
    {
      title: 'Community Voices: Alice Springs',
      description: 'A community member from Alice Springs shares their experience of the Stretch Bed.',
      embedUrl: 'https://share.descript.com/embed/LAT0KNJMxmH',
      downloadSrc: undefined as string | undefined,
    },
    {
      title: 'Stretch Bed Making Timelapse: Alice Springs',
      description: 'Timelapse of the Stretch Bed being made at the Alice Springs household production facility.',
      embedUrl: 'https://share.descript.com/embed/Xtrc5ZYsym6',
      downloadSrc: undefined as string | undefined,
    },
    {
      title: 'Community Voices: Fred, Oonchiumpa',
      description: 'Fred from Oonchiumpa, a core Goods on Country community partner, shares his perspective.',
      embedUrl: 'https://share.descript.com/embed/YQwAcYfxzkn',
      downloadSrc: undefined as string | undefined,
    },
  ],

  // ──────────────────────────────────────────────────────────────
  // INSTAGRAM-READY: short-form vertical/square videos for social
  // ──────────────────────────────────────────────────────────────
  instagramVideos: [
    {
      title: 'On Country Production Facility Overview Part #1',
      embedUrl: 'https://share.descript.com/embed/j6PXvhBP62i',
    },
    {
      title: 'On Country Production Facility Overview Part #2',
      embedUrl: 'https://share.descript.com/embed/J5GBQV00la8',
    },
    {
      title: 'Stretch Bed Overview',
      embedUrl: 'https://share.descript.com/embed/elrx8lXpDxW',
    },
  ],

  // ──────────────────────────────────────────────────────────────
  // RAW FOOTAGE (no captions/subtitles): same format as videos above
  // These are the uncaptioned versions for partners who need clean footage
  // ──────────────────────────────────────────────────────────────
  rawVideos: [
    {
      title: 'Recycling Production Facility Walkthrough',
      embedUrl: 'https://share.descript.com/embed/QRzMJxd1Jo3',
      downloadSrc: undefined as string | undefined,
    },
  ],

  // ──────────────────────────────────────────────────────────────
  // PHOTOS: How to add/edit:
  //
  // 1. Drop the image file into v2/public/images/media-pack/
  // 2. Add an entry below with src, caption, and optional vertical flag:
  //    { src: '/images/media-pack/my-photo.jpg', caption: 'Description here' },
  //    { src: '/images/media-pack/tall-photo.jpg', caption: 'Vertical shot', vertical: true },
  //
  // Set vertical: true for portrait/tall images so they display at full height.
  // ──────────────────────────────────────────────────────────────
  photos: [
    { src: '/images/product/stretch-bed-hero.jpg', caption: 'The Stretch Bed: recycled HDPE plastic, galvanised steel, heavy-duty canvas' },
    { src: '/images/media-pack/community-bed-assembly.jpg', caption: 'Community members assembling a Stretch Bed on country' },
    { src: '/images/media-pack/thumbs-up-stretch-bed.jpg', caption: 'Trying out the Stretch Bed: recycled plastic legs, canvas surface, built to last' },
    { src: '/images/media-pack/lying-on-stretch-bed.jpg', caption: 'Testing the Stretch Bed: designed for comfort, durability, and easy flat-packing' },
    { src: '/images/media-pack/woman-on-red-stretch-bed.jpg', caption: 'A Stretch Bed with red recycled plastic legs in Alice Springs' },
    { src: '/images/media-pack/community-testing-bed-golden-hour.jpg', caption: 'Community members testing a Stretch Bed at golden hour, Tennant Creek' },
    { src: '/images/media-pack/nic-with-elder-on-verandah.jpg', caption: 'Nic yarning with an Elder and community member on a verandah with the Stretch Bed' },
    { src: '/images/media-pack/goods-branding-golden-hour.jpg', caption: 'Goods branding on the Stretch Bed canvas at golden hour', vertical: true },
    { src: '/images/media-pack/washing-machine-enclosure-sunset.jpg', caption: 'Pakkimjalki Kari washing machine enclosure: recycled plastic panels at sunset' },
    { src: '/images/media-pack/speed-queen-controls.jpg', caption: 'Nic showing Speed Queen washing machine controls to a community member' },
    { src: '/images/product/washing-machine-installed.jpg', caption: 'Washing machine installed in community' },
    { src: '/images/product/washing-machine-name.jpg', caption: 'Pakkimjalki Kari: named in Warumungu language by Elder Dianne Stokes' },
    { src: '/images/product/stretch-bed-kids-building.jpg', caption: 'Kids helping build beds on country' },
    { src: '/images/process/container-factory.jpg', caption: 'The containerised production facility' },
    { src: '/images/process/hydraulic-press.jpg', caption: 'Hydraulic press for recycled plastic sheets' },
  ] as { src: string; caption: string; vertical?: boolean }[],

  // External download links: placeholders
  externalLinks: {
    photoLibrary: undefined as string | undefined, // TODO: Add Google Drive / Dropbox URL for full photo library
    logoPack: undefined as string | undefined, // TODO: Add Google Drive / Dropbox URL for logo pack
  },
};

// Oonchiumpa/Bloomfield family partnership: for pitch page
export const oonchiumpaPartnership = {
  headline: 'Oonchiumpa / Bloomfield Family',
  subheadline: '100% Aboriginal-owned consultancy, deep roots in Central Australia',
  description: 'Two years designing products in community, "around the fire", building washing machines together, and planning a production facility in Alice Springs. Kristy Bloomfield leads cultural consultation at university-equivalent rates (~$3,800/day).',
  // TODO: Replace with verified Kristy Bloomfield quote when available
  kristyQuote: {
    text: 'We see this as bigger than beds. It\'s about families owning the whole thing: the making, the business, the future.',
    author: 'Kristy Bloomfield',
    context: 'Oonchiumpa Consultancy, Alice Springs',
    verified: false, // PLACEHOLDER: needs real quote from Kristy
  },
  fredVideo: {
    title: 'Community Voices: Fred, Oonchiumpa',
    embedUrl: 'https://share.descript.com/embed/YQwAcYfxzkn',
  },
};

// Partnership iteration journey: how the relationship evolved
export const partnershipJourney = [
  {
    step: 1,
    title: 'The first beds',
    description: 'Started with a simple question: what if we built beds that actually survived remote conditions? Early prototypes went to families in Kalgoorlie.',
  },
  {
    step: 2,
    title: 'Dianne Stokes and washing machines',
    description: 'Elder Dianne Stokes designed the Pakkimjalki Kari washing machine in community with her family, named it in Warumungu language, and opened doors across the NT.',
  },
  {
    step: 3,
    title: 'Advisory support for the Stretch Bed',
    description: 'Norman Frank, NPY Women\'s Council, and health organisations shaped the Stretch Bed into something communities actually wanted.',
  },
  {
    step: 4,
    title: 'Defy Design and recycling knowledge',
    description: 'Partnered with Defy Design to learn plastic recycling and build the containerised production plant, turning community waste into bed components.',
  },
  {
    step: 5,
    title: 'Owning our own plant',
    description: 'Built a two-container production facility. One container shreds and collects plastic, the other presses sheets and cuts bed parts. ~30 beds per week.',
  },
  {
    step: 6,
    title: 'Oonchiumpa delivering beds on country',
    description: 'Oonchiumpa consultancy became the cultural backbone: going into communities together, delivering beds, building washing machines side by side.',
  },
  {
    step: 7,
    title: 'The bigger vision',
    description: 'Exploring Indigenous sovereignty and enterprise. Family lineage and cultural authority guiding how products are made, who makes them, and who owns the future.',
  },
  {
    step: 8,
    title: 'Enterprise growing through action',
    description: 'Not waiting for permission. Building, delivering, iterating. Seeing how enterprise grows when communities lead and outsiders support.',
  },
];

// Advisory board: the people guiding Goods on Country
export const advisoryGroup = [
  {
    name: 'Kristy Bloomfield',
    title: 'Cultural Lead. Director of design in community.',
    org: 'Oonchiumpa Consultancy',
  },
  {
    name: 'Nicholas Marchesi',
    title: 'Founder & CEO',
    org: 'A Curious Tractor',
  },
  {
    name: 'Sally Grimsley-Ballard',
    title: 'Strategic Partner',
    org: 'Snow Foundation',
  },
  {
    name: 'Sam Davies',
    title: 'Recycling & Manufacturing',
    org: 'Defy Design',
  },
  {
    name: 'Judith Meiklejohn',
    title: 'Advisory',
    org: 'Orange Sky',
  },
  {
    name: 'Corey Tutt',
    title: 'CEO',
    org: 'DeadlyScience',
  },
  {
    name: 'April Long',
    title: 'Advisory',
    org: 'SMART Recovery Australia',
  },
  {
    name: 'Susan Clear',
    title: 'Advisory',
    org: '',
  },
  {
    name: 'Nina Fitzgerald',
    title: 'Advisory',
    org: '',
  },
  {
    name: 'Daniel Pittman',
    title: 'Industry Partner',
    org: 'Zinus',
  },
  {
    name: 'Shaun Fisher',
    title: 'Advisory',
    org: 'Fishers Oysters',
  },
];

// Community partners and people in the Goods orbit
export const goodsOrbit = [
  {
    name: 'Dianne Stokes',
    title: 'Elder. Named and designed the Pakkimjalki Kari.',
    org: 'Tennant Creek',
    role: 'Named the Pakkimjalki Kari washing machine in Warumungu language. Refines product designs "around the fire" with family.',
  },
  {
    name: 'Norman Frank Jupurrurla',
    title: 'Warumungu Elder',
    org: 'Wilya Janta, Tennant Creek',
    role: 'Housing advocate and founder of Wilya Janta. Leads demonstration home partnership and community engagement.',
  },
  {
    name: 'Ebony & Jahvan Oui',
    title: 'Future Manufacturing Leads',
    org: 'Palm Island',
    role: 'Training with Defy Design for on-country production. Building the skills to lead community manufacturing.',
  },
  {
    name: 'Red Dust Robotics',
    title: 'Youth STEM Education',
    org: 'Darwin / Remote NT',
    role: 'Young people learning 3D printing, robotics, and manufacturing skills.',
  },
  {
    name: 'Centre of Appropriate Technology',
    title: 'Remote Technology Specialists',
    org: 'Alice Springs',
    role: 'Decades of experience designing appropriate technology for remote communities.',
  },
  {
    name: 'NPY Women\'s Council',
    title: 'Community Distribution',
    org: 'NPY Lands',
    role: '"Always looking for beds." Established network across Ngaanyatjarra, Pitjantjatjara, and Yankunytjatjara lands.',
  },
  {
    name: 'Tennant Creek Community Shed',
    title: 'Plastic Collection Hub',
    org: 'Tennant Creek',
    role: 'Hosting shredding and plastic collection operations.',
  },
  {
    name: 'Palm Island Community Company',
    title: 'Community Distribution Partner',
    org: 'Palm Island, QLD',
    role: 'Ensuring beds reach families who need them, guided by Elder advisory.',
  },
  {
    name: 'Anyinginyi Health',
    title: 'Health Partner',
    org: 'Tennant Creek, NT',
    role: 'Connecting beds and washing machines to community health outcomes.',
  },
  {
    name: 'Miwatj Health',
    title: 'Health Partner',
    org: 'East Arnhem, NT',
    role: 'Jessica Allardyce: linking washing machines to RHD prevention.',
  },
  {
    name: 'Purple House',
    title: 'Health Partner',
    org: 'Central Australia',
    role: 'Supporting dialysis patients and remote health across Central Australia.',
  },
  {
    name: 'Wilya Janta',
    title: 'Housing Advocacy',
    org: 'Tennant Creek, NT',
    role: 'Founded by Norman Frank and Dr. Simon Quilty. Demonstration home partnership.',
  },
  {
    name: 'Homeland Schools Company',
    title: 'Education Partner',
    org: 'Maningrida, NT',
    role: 'Requested 65 beds for kids across Maningrida communities.',
  },
  {
    name: 'QIC',
    title: 'Corporate Engagement',
    org: 'Brisbane, QLD',
    role: 'Expressed interest in building 50 beds with staff for NAIDOC week.',
  },
  {
    name: 'Angela Lynch',
    title: 'Community Distribution',
    org: 'NPY Women\'s Council',
    role: '"Always looking for beds." Key contact across NPY lands.',
  },
  {
    name: 'Dr. Simon Quilty',
    title: 'Wilya Janta CEO',
    org: 'Tennant Creek, NT',
    role: '20+ years NT health experience. Housing and health advocacy.',
  },
];

// Enterprise vision: for pitch page "Enterprise & Training" section
export const enterpriseVision = {
  headline: 'Local Enterprise, Not Charity',
  description: 'The bigger picture is community ownership of manufacturing. Local people collecting waste, making products, running the business. Our job is to become unnecessary.',
  jobs: [
    'Plastic collection from community',
    'Shredding and sorting',
    'Pressing sheets and cutting components',
    'Bed assembly and quality checks',
    'Logistics and delivery',
  ],
  youthPathways: 'Young people learning manufacturing, business skills, and robotics through Red Dust partnership. A pathway from community engagement to employment.',
  ownership: 'Communities eventually own and run the whole operation. We transfer manufacturing capability, supply chain connections, and quality frameworks, then step back.',
};

// Themes from community voices
export const communityThemes = [
  {
    title: 'The Freight Tax',
    description: 'Every remote community pays a "remoteness premium" that makes essential goods unaffordable.',
    quotes: [
      { text: 'The freight is very, very dear.', attribution: 'Carmelita, Palm Island' },
      { text: 'Anything we purchase is so much more expensive due to freight.', attribution: 'Simone, Groote Archipelago' },
    ],
  },
  {
    title: 'Health ↔ Bedding Connection',
    description: 'Multiple storytellers and health workers link bedding directly to health outcomes.',
    points: ['Scabies → Rheumatic Heart Disease', 'Cold ground → Pneumonia', 'Floor sleeping → Back problems, poor rest'],
  },
  {
    title: 'Cultural Obligation & Family',
    description: 'Bedding needs spike during cultural gatherings: Christmas, funerals, ceremonies.',
    quote: 'Sometimes family don\'t have extra mattresses. Kids sleep out with family.',
    attribution: 'Carmelita, Palm Island',
  },
  {
    title: 'Dignity, Safety, Belonging',
    description: 'The emotional dimension appears consistently: beds provide safety and dignity.',
    quote: 'Having a bed is something you need; you feel more safe when you sleep in a bed.',
    attribution: 'Alfred, Palm Island',
  },
];
