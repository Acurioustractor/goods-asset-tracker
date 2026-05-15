/**
 * Curated Quotes: hand-picked and cleaned for the public stories page.
 *
 * Raw transcript quotes contain "um"s, false starts, and conversational
 * artefacts. This file stores edited versions that read well while
 * preserving the storyteller's voice and meaning.
 *
 * Editorial rules:
 *  - No em dashes (Goods brand rule, applies everywhere)
 *  - Lead with the most Goods-relevant quote per speaker
 *  - Preserve word choice and voice; clean only punctuation and stutter
 *
 * Key by storyteller display_name (as it appears in the EL database).
 */

export interface CuratedQuote {
  /** Cleaned-up quote text */
  text: string;
  /** Short context label */
  context: string | null;
}

export const curatedQuotes: Record<string, CuratedQuote[]> = {
  'Alfred  Johnson': [
    {
      text: 'You have to bring them on the barge. You can\'t just take them on the boat. You have to pay for freight. It all adds up.',
      context: 'Why local manufacturing matters',
    },
    {
      text: 'You got to get that shame out of the way and go and ask, sit down and talk to them.',
      context: 'Community connection',
    },
  ],

  'Annie Morrison': [
    {
      text: 'I was looking at the beds. They\'re good. I was trying to ask them if they can make one for me.',
      context: 'On the Stretch Bed',
    },
    {
      text: 'A washing machine would be important for the old people, you know? Now we got our own washing.',
      context: 'On washing machines',
    },
  ],

  'Brian Russell': [
    {
      text: 'Back pain and all that. You\'re gonna be moving around with problems. That\'s why good beds matter.',
      context: 'Why sleep matters',
    },
    {
      text: 'I\'m a Goa man, the only Goa man and Gangalidda man. My grandmother\'s side, full Gangalidda. My grandfather\'s side, full Goa man from the Gulf country.',
      context: 'Cultural identity',
    },
  ],

  'Carmelita &  Colette': [
    {
      text: 'We do need rest. It\'s for our health: maintaining health and being well.',
      context: 'Health and rest',
    },
    {
      text: 'It\'s hard because of the cost of living. That\'s very hard locally on Palm Island.',
      context: 'Cost of living',
    },
  ],

  'Chloe': [
    {
      text: 'I\'ve put up with clients going to hospital with pneumonia from sleeping on the ground because it\'s too cold. In summer they\'re scared to sleep because of snakes.',
      context: 'Frontline health worker',
    },
  ],

  'Cliff Plummer': [
    {
      text: 'If I had two of those beds, I\'d be okay.',
      context: 'On the Stretch Bed',
    },
    {
      text: 'I\'ve been in the health area for 38 years. I retired last year but found retirement life so boring, so back to work.',
      context: 'Community health',
    },
  ],

  'Daniel  Patrick Noble': [
    {
      text: 'A lot of them are low income earners. Just to have that extra cost of bringing things over, it all adds up. Sometimes people would rather go without.',
      context: 'Remote freight costs',
    },
    {
      text: 'Palm Island always feels like home. I\'ve got a big extended family here.',
      context: 'Connection to community',
    },
  ],

  'Dianne Stokes': [
    {
      text: 'I\'m a traditional owner and where I live is in the boundary of my totem. I\'ve been here almost 24 years without shelter. The only thing I had was my car.',
      context: 'Housing need',
    },
    {
      text: 'It means something that really makes me happy. Every time I go away, it\'s like it\'s calling me. Come back home.',
      context: 'Connection to Country',
    },
  ],

  'Dr Boe Remenyi': [
    {
      text: 'Education and awareness is great, but you need to match it with something that actually enables people to change. It\'s great to say you should wash your sheets every week. But if you don\'t have a washing machine, that\'s not going to work.',
      context: 'Practical solutions',
    },
    {
      text: 'If I can fall through the gaps, how many others are falling through the gaps? That\'s my biggest mission: speaking up for my countrymen who don\'t have a voice.',
      context: 'Health advocacy',
    },
  ],

  'Fred Campbell': [
    {
      text: 'Good sleep. No sound, no people shouting. Just quiet.',
      context: 'On the Stretch Bed',
    },
  ],

  'Gary': [
    {
      text: 'We had 150 men lead the march from our men\'s group. The women and kids came behind us. We marched through the street.',
      context: 'Community leadership',
    },
    {
      text: 'We don\'t force nothing on them. We just sit down and explain what we do, or we let them look and listen. When they\'re ready, they\'ll try.',
      context: 'Working with young people',
    },
  ],

  'Georgina Byron AM': [
    {
      text: 'It\'s about empowering communities. They want those beds, and it\'s about supporting inspirational entrepreneurs like Ben.',
      context: 'On Goods on Country',
    },
    {
      text: 'Our role is to plug the gaps. There\'s quite a few gaps to plug. We can\'t do it all, but we can do our bit.',
      context: 'Funder rationale',
    },
    {
      text: 'To have healthy kids grow up to be healthy parents and uncles and aunties: that is the goal, isn\'t it?',
      context: 'Intergenerational wellbeing',
    },
  ],

  'Gloria': [
    {
      text: 'Sleep on a good mattress. For the back, the legs, the muscles.',
      context: 'On sleep quality',
    },
    {
      text: 'Because we are family. They help a lot. Helping me.',
      context: 'Kinship',
    },
  ],

  'Heather Mundo': [
    {
      text: 'These two boys just picked it up straight away. The most important thing is it\'s actually comfortable.',
      context: 'On the Stretch Bed',
    },
    {
      text: 'I love this community. I grew up here and I\'ve been here for so many years.',
      context: 'Katherine community',
    },
  ],

  'Ivy': [
    {
      text: 'Hardly any people around the community have got beds. When they got family members over, there\'s not enough for everyone.',
      context: 'Housing need on Palm Island',
    },
  ],

  'Jason': [
    {
      text: 'When it comes from an Aboriginal person, it works. That\'s what makes the difference.',
      context: 'Community-led solutions',
    },
  ],

  'Jimmy Frank': [
    {
      text: 'We challenge a lot of that and try to make a difference. Make it easier for our people to live in their homes.',
      context: 'Housing advocacy',
    },
    {
      text: 'Climate change is coming. Those houses are not right for it.',
      context: 'Housing and climate',
    },
  ],

  'Kristy Bloomfield': [
    {
      text: 'We want to create a safe space for our young people. There\'s a lack of housing, which leads to a lack of sleep, which leads to low school attendance.',
      context: 'Youth and housing',
    },
    {
      text: 'Back then we didn\'t have the opportunity to challenge government. Now we\'re in a position to say: this is a sacred site for us as Aboriginal women and traditional owners.',
      context: 'Sovereignty',
    },
  ],

  'Kylie Bloomfield': [
    // No quotes available from transcripts; falls back to syndication API
  ],

  'Linda Turner': [
    {
      text: 'We\'ve never been asked what sort of house we\'d like to live in.',
      context: 'Co-design',
    },
    {
      text: 'We try to lead by example to our kids and grandkids.',
      context: 'Intergenerational leadership',
    },
  ],

  'Mark': [
    {
      text: 'We put together crates, tied them up with plastic, joined them together to make it look like a bed. Just to have something to sleep on.',
      context: 'Making do without beds',
    },
    {
      text: 'It\'s comfy. I\'d sleep on it every night. I reckon it\'ll last a long time.',
      context: 'On the Stretch Bed',
    },
  ],

  'Melissa Jackson': [
    {
      text: 'They like to have lower beds, especially for our older people.',
      context: 'Elder-friendly design',
    },
    {
      text: 'Tennant Creek is a beautiful place to live. Everyone knows each other.',
      context: 'Community',
    },
  ],

  'Nicholas Marchesi': [
    // Co-founder; filtered out of the public storyteller grid as internal
  ],

  'Norman Frank': [
    {
      text: 'I want to see a better future for our kids and better housing. Not only here but for the whole nation. We\'re all struggling today for housing.',
      context: 'Housing for all',
    },
    {
      text: 'Now we\'ve got our own ways, we can collaborate with our own people. Not only here. It\'ll be everywhere.',
      context: 'Self-determination',
    },
  ],

  'Patricia Frank': [
    {
      text: 'We want to get bigger. We want to help other people, other language groups, other cultures.',
      context: 'Community growth',
    },
    {
      text: 'We want to build our relationships up with other language groups and make them happy too: how they want to live.',
      context: 'Cross-cultural respect',
    },
  ],

  'Risilda Hogan': [
    {
      text: 'I was living at the tin shed. Then I started working, got help from Stronger Families, and moved into this house.',
      context: 'Housing journey',
    },
  ],

  'Shayne Bloomfield': [
    {
      text: 'This partnership could go a long way. I feel it\'s got a long, long path ahead.',
      context: 'On working with Goods',
    },
    {
      text: 'We could use this place as a healing camp: a cultural institute where kids learn to respect the land and the people around them.',
      context: 'Cultural healing',
    },
  ],

  'Tracy McCartney': [
    {
      text: 'I don\'t call this work. This is where I come to meet my friends. For me it\'s about building relationships with people.',
      context: 'Community connection',
    },
  ],

  'Walter': [
    {
      text: 'Good sleep. No sound, no people shouting. Just quiet.',
      context: 'On the Stretch Bed',
    },
  ],

  'Wayne Glenn': [
    {
      text: 'It\'s a really simple idea to a really complex issue. One that can be taken and modified for individual families and communities.',
      context: 'On the Stretch Bed',
    },
    {
      text: 'Families are often staying with other families where the bedding isn\'t available or sufficient. People are just sleeping where they can.',
      context: 'Overcrowding',
    },
    {
      text: 'We see entrenched primary health issues in communities: rheumatic heart disease, scabies, trachoma. Issues that don\'t exist anywhere else in the world.',
      context: 'Health inequity',
    },
  ],
};
