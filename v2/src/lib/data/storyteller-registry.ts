// ============================================================================
// STORYTELLER REGISTRY — the single canonical record for every voice.
// ============================================================================
//
// This file locks down, per storyteller: canonical name + spelling, title/role,
// community, consent tier, the blessed quotes (and held ones), portrait path,
// and every known alias/misspelling. If any other file disagrees with this one,
// THIS FILE WINS. Fix the other file.
//
// Enforced by scripts/check-storyteller-registry.mjs (run: npm run check:storytellers):
//   - misspellings must not appear anywhere in v2/src
//   - banned quote fragments must not appear anywhere in v2/src
//   - hold-tier names must not appear in rendered surfaces (app/, components/)
//   - tier 'external' records must stay in sync with cleared-voices.ts
//
// Sources reconciled 2026-07-12: cleared-voices.ts (32-voice allowlist, consent
// pass 2026-06-17) · curated-quotes.ts · community-narrative.ts (9 Jul overrides,
// freshest picks) · content.ts · compendium.ts · trip-stories.ts ·
// wiki/outputs/2026-07-11-narrative-foundation.md §3 (turn assignments).
//
// Consent tiers:
//   external   — cleared for the open web AND funder material (the 32)
//   website    — website only; never funder exports
//   funder     — funder testimonial only; never in the community storyteller set
//   hold       — do not use externally at all
//   pending    — Ben must confirm tier before any external use
//   internal   — Goods team; not a community voice
//
// Anonymous Arlparra/Arawerr field lines are NOT here — they live in
// community-narrative.ts `anonymousFieldEvidence` and are used unnamed only.

export type VoiceTier =
  | 'external'
  | 'website'
  | 'funder'
  | 'hold'
  | 'pending'
  | 'internal';

export interface RegistryQuote {
  /** Verbatim canonical text. Do not paraphrase on any surface. */
  text: string;
  /** Short context label. */
  context: string;
  /** primary = the line to reach for first · approved = fine to use · hold = do not use */
  status: 'primary' | 'approved' | 'hold';
  note?: string;
}

export interface StorytellerRecord {
  slug: string;
  /** Canonical display name. The only correct spelling. */
  name: string;
  /** Other spellings that legitimately appear (EL variants, honorifics). */
  aliases?: string[];
  /** WRONG spellings that must never appear anywhere. Guard-enforced. */
  misspellings?: string[];
  /** Canonical title/role label. Practitioners must be labelled as such. */
  role: string;
  community: string;
  tier: VoiceTier;
  practitioner?: boolean;
  /** This person's story is told only by another voice (e.g. Xavier ← Fred). */
  narratedBy?: string;
  /** Belief turn(s) carried in the narrative arc (foundation §2). */
  turns?: string;
  quotes: RegistryQuote[];
  /** Distinctive fragments that must never appear in v2/src. Guard-enforced. */
  bannedFragments?: string[];
  /** Path under /public, or null = no portrait exists (gap). */
  portrait: string | null;
  notes?: string;
}

export const STORYTELLER_REGISTRY: StorytellerRecord[] = [
  // ── Tennant Creek ─────────────────────────────────────────────────────────
  {
    slug: 'dianne-stokes',
    name: 'Dianne Stokes',
    misspellings: ['Diane Stokes', 'Waramungu'],
    role: 'Warumungu and Warlmanpa Elder. Designed and named both products.',
    community: 'Tennant Creek',
    tier: 'external',
    turns: '3, 5 → scale',
    quotes: [
      {
        text: 'It means something that really makes me happy. Every time I go away, it\'s like it\'s calling me. Come back home.',
        context: 'On Pakkimjalki Kari, the washing machine she named',
        status: 'primary',
        note: 'Strongest product quote in the corpus.',
      },
      {
        text: 'I\'m a traditional owner and where I live is in the boundary of my totem. I\'ve been here almost 24 years without shelter. The only thing I had was my car.',
        context: 'Housing need',
        status: 'hold',
        note: 'HOLD for Dianne\'s say-so (foundation §3). Removed from curated-quotes 2026-07-12.',
      },
      {
        text: "I'm happy. I, I can't tell you how my heart is, uh, hopping and skipping inside me.",
        context: 'Receiving the washing machine',
        status: 'approved',
      },
      {
        text: "I will know where to come. If I need to wash my blanket, I don't have to go do it in town. Laundry, do it here.",
        context: 'What the washer on her homeland changes',
        status: 'approved',
      },
      {
        text: "If you have an idea what place you'd go to first go and talk to ... the elders. Sit down and talk to them or a group of people and tell them if you can show them how to make them beds, and they'll probably be keen on joining in and helping out.",
        context: 'Her advice on how to enter a community',
        status: 'approved',
      },
      {
        text: "They need to hear from the ground, who wants it, who's gonna do it, who's out there, who needs help?",
        context: 'Decisions from the ground up',
        status: 'approved',
      },
      {
        text: 'Why do I think it\'s comfortable? Because I was looking for these kinds before having a milk crate and a mattress on top. It was comfortable, but not much. But this is more.',
        context: 'The bed against what she improvised before',
        status: 'approved',
      },
    ],
    bannedFragments: ['boundary of my totem'],
    portrait: '/images/people/dianne-stokes.jpg',
    notes: 'Refines designs "around the fire" with family. Received 1 bed, returned in 2 weeks asking for 20, offered to self-fund. Quotes 3-7 cleared by Ben 2026-07-20 from the Voice Impact Model deep pass (D1-D5).',
  },
  {
    slug: 'margaret-lloyd',
    name: 'Margaret Lloyd',
    misspellings: ['Margaret (Utopia)'],
    role: 'Utopia homelands community member, ~30 years on her homeland',
    community: 'Utopia homelands',
    tier: 'external',
    turns: '1 → 4 (problem to delivery)',
    quotes: [
      {
        text: "I sleep in the tent but look, there's my house or the rubbish house ... No mattress. Look, the bed was mine. Just for chucking us blanket, that's all, that's all I was sleeping.",
        context: 'Before the delivery: sleeping in a tent beside an uninhabitable house',
        status: 'approved',
      },
      {
        text: 'Because I was sleeping on floor, turn around, turn around. Yeah. No comfortable nothing.',
        context: 'Why the bed matters, recorded at delivery',
        status: 'approved',
      },
      {
        text: "Our bed is right. That's good. Good.",
        context: 'Her verdict on the bed at delivery',
        status: 'approved',
      },
    ],
    portrait: null,
    notes: 'THE Utopia Margaret (Ben confirmed 2026-07-20). EL transcript 0ecb0185; homeland transcribed as "Wenitong", verify spelling before external captions. All three quotes cleared by Ben 2026-07-20.',
  },
  {
    slug: 'norman-frank',
    name: 'Norman Frank',
    aliases: ['Norman Frank Jupurrurla', 'Norman Frank (Jupurrurla)'],
    misspellings: ['Norm Frank'],
    role: 'Warumungu Elder, Wilya Janta founder',
    community: 'Tennant Creek',
    tier: 'external',
    turns: '5',
    quotes: [
      {
        text: 'I want to see a better future for our kids and better housing. Not only here but for the whole nation. We\'re all struggling today for housing.',
        context: 'Housing for all',
        status: 'primary',
      },
      {
        text: 'Now we\'ve got our own ways, we can collaborate with our own people. Not only here. It\'ll be everywhere.',
        context: 'Self-determination',
        status: 'approved',
      },
    ],
    portrait: '/images/people/norman-frank.jpg',
    notes: 'Called requesting 3 beds in maroon after his daughter tried one. Boards: Anyinginyi Health, Julalikari Council, Central Land Council.',
  },
  {
    slug: 'linda-turner',
    name: 'Linda Turner',
    role: 'Community member',
    community: 'Tennant Creek',
    tier: 'external',
    turns: 'strengthens 1 (could open the whole deck)',
    quotes: [
      {
        text: 'We\'ve never been asked what sort of house we\'d like to live in.',
        context: 'Being asked',
        status: 'primary',
      },
      {
        text: 'We try to lead by example to our kids and grandkids.',
        context: 'Intergenerational leadership',
        status: 'approved',
      },
      {
        text: 'We\'re setting this up for our kids and grandkids... independence, being in charge of your own destiny.',
        context: 'Ownership pathway',
        status: 'approved',
      },
    ],
    portrait: '/images/people/linda-turner.jpg',
  },
  {
    slug: 'patricia-frank',
    name: 'Patricia Frank',
    role: 'Aboriginal Corporation Worker, Oo Tribe, White Cockatoo clan',
    community: 'Tennant Creek',
    tier: 'external',
    turns: '3 (washing/health carrier)',
    quotes: [
      {
        text: 'They truly wanna a washing machine to wash their blanket, to wash their clothes, and it\'s right there at home.',
        context: 'Washing at home',
        status: 'primary',
        note: 'THE community washing/health line. She also built the language-group relationships behind Pakkimjalki Kari.',
      },
      {
        text: 'We want to get bigger. We want to help other people, other language groups, other cultures.',
        context: 'Community growth',
        status: 'approved',
      },
      {
        text: 'We want to build our relationships up with other language groups and make them happy too: how they want to live.',
        context: 'Cross-cultural respect',
        status: 'approved',
      },
    ],
    portrait: '/images/people/patricia-frank.jpg',
  },
  {
    slug: 'jimmy-frank',
    name: 'Jimmy Frank',
    aliases: ['Jimmy Frank Jupurrurla'],
    role: 'Traditional Owner, Cultural Liaison',
    community: 'Tennant Creek',
    tier: 'external',
    turns: 'strengthens 1, 5',
    quotes: [
      {
        text: 'Our strengths is our culture, our country, you know, and our language.',
        context: 'Culture as strength',
        status: 'primary',
      },
      {
        text: 'We challenge a lot of that and try to make a difference. Make it easier for our people to live in their homes.',
        context: 'Housing advocacy',
        status: 'approved',
      },
      {
        text: 'Climate change is coming. Those houses are not right for it.',
        context: 'Housing and climate',
        status: 'approved',
      },
    ],
    bannedFragments: ['weave a bed', 'Weave Bed Co-designer'],
    portrait: '/images/people/jimmy-frank.jpg',
    notes: 'His Weave Bed line is never used: the product is discontinued (removed from compendium 2026-07-12).',
  },
  {
    slug: 'annie-morrison',
    name: 'Annie Morrison',
    role: 'Community member',
    community: 'Tennant Creek',
    tier: 'external',
    turns: 'strengthens 3',
    quotes: [
      {
        text: 'I was looking at the beds. They\'re good. I was trying to ask them if they can make one for me.',
        context: 'On the Stretch Bed',
        status: 'primary',
      },
      {
        text: 'A washing machine would be important for the old people, you know? Now we got our own washing.',
        context: 'On washing machines',
        status: 'approved',
      },
    ],
    portrait: '/images/people/annie-morrison.jpg',
    notes: 'NEVER label as Elder (foundation §3: drop Elder claim).',
  },
  {
    slug: 'brian-russell',
    name: 'Brian Russell',
    role: 'Community member, Goa and Gangalidda man',
    community: 'Tennant Creek',
    tier: 'external',
    turns: 'strengthens 1',
    quotes: [
      {
        text: 'Back pain and all that. You\'re gonna be moving around with problems. That\'s why good beds matter.',
        context: 'Why sleep matters',
        status: 'primary',
      },
      {
        text: 'I\'m a Goa man, the only Goa man and Gangalidda man. My grandmother\'s side, full Gangalidda. My grandfather\'s side, full Goa man from the Gulf country.',
        context: 'Cultural identity',
        status: 'approved',
      },
    ],
    portrait: '/images/people/brian-russell.jpg',
  },
  {
    slug: 'melissa-jackson',
    name: 'Melissa Jackson',
    role: 'Community member',
    community: 'Tennant Creek',
    tier: 'external',
    turns: 'strengthens 3',
    quotes: [
      {
        text: 'They like to have lower beds, especially for our older people.',
        context: 'Elder-friendly design',
        status: 'primary',
      },
      {
        text: 'Tennant Creek is a beautiful place to live. Everyone knows each other.',
        context: 'Community',
        status: 'approved',
      },
    ],
    portrait: '/images/people/melissa-jackson.jpg',
  },
  {
    slug: 'risilda-hogan',
    name: 'Risilda Hogan',
    role: 'Community member',
    community: 'Tennant Creek',
    tier: 'external',
    turns: 'strengthens 1',
    quotes: [
      {
        text: 'I was living at the tin shed. Then I started working, got help from Stronger Families, and moved into this house.',
        context: 'Housing journey',
        status: 'primary',
      },
    ],
    portrait: '/images/people/risilda-hogan.jpg',
  },
  {
    slug: 'cliff-plummer',
    name: 'Cliff Plummer',
    role: 'Health Practitioner',
    community: 'Tennant Creek',
    tier: 'external',
    practitioner: true,
    quotes: [
      {
        text: 'If I had two of those beds, I\'d be okay.',
        context: 'On the Stretch Bed',
        status: 'primary',
      },
      {
        text: 'I\'ve been in the health area for 38 years. I retired last year but found retirement life so boring, so back to work.',
        context: 'Community health',
        status: 'approved',
      },
      {
        text: 'You got to get health messages across.',
        context: 'Health messaging',
        status: 'approved',
      },
    ],
    portrait: '/images/people/cliff-plummer.jpg',
    notes: 'Has video.',
  },

  // ── Utopia Homelands / Alice Springs ─────────────────────────────────────
  {
    slug: 'mykel',
    name: 'Mykel',
    role: 'Young maker',
    community: 'Utopia',
    tier: 'external',
    turns: '4 (open candidate)',
    quotes: [
      {
        text: 'Never would have thought it would have come out like that.',
        context: 'Build day, May 2026 Utopia trip',
        status: 'primary',
      },
      {
        text: 'Yeah, I\'ll be rocking up every day to make them.',
        context: 'From build day to local work',
        status: 'primary',
      },
      {
        text: 'Comfortable as. Smooth, tight, hard, fancy.',
        context: 'Product feedback',
        status: 'approved',
      },
      {
        text: 'It was fun, really fun. Good experience.',
        context: 'Build day',
        status: 'approved',
      },
    ],
    portrait: '/images/people/mykel.jpg',
    notes: 'Young person: youth-care framing always, Oonchiumpa guardianship.',
  },
  {
    slug: 'xavier',
    name: 'Xavier',
    role: 'Young maker',
    community: 'Alice Springs',
    tier: 'external',
    narratedBy: 'Fred Campbell',
    turns: '4',
    quotes: [],
    portrait: '/images/people/xavier-stretch-bed-alice-springs.jpg',
    notes:
      'NO direct quotes exist or may be created. Fred Campbell narrates (see his record). ' +
      'Consent held by Oonchiumpa, confirmed 2026-06-17. Young person: youth-care framing always.',
  },
  {
    slug: 'fred-campbell',
    name: 'Fred Campbell',
    role: 'Youth Case Worker, Oonchiumpa',
    community: 'Alice Springs',
    tier: 'external',
    turns: '4',
    quotes: [
      {
        text: 'He knew what he was doing. He had the pattern of how everything was all coming together. He loved it. We took him back to the family and he just was so proud showing them that he can build it.',
        context: 'Xavier, proud building his Stretch Bed',
        status: 'primary',
        note: 'Always attributed to Fred, narrating Xavier. Never as a direct Xavier quote.',
      },
      {
        text: 'The families right now, like you see in most of those houses that we went to, the beds were on the ground. It\'s a safety thing. Some of our kids have come up with scabies and stuff that shed from the dogs. But knowing that they can pack that up, put it away into a tidy small space in the back of a car and use it wherever they can go. That\'s something they can\'t do with those other sturdy metal ones.',
        context: 'Why the Stretch Bed works in community',
        status: 'approved',
      },
      {
        text: 'He\'s probably one of our first clients. Other service providers did not share anything of his disabilities. We found out along the way. We had that relationship with him. He wanted to be with us a lot, and we had that great friendship with him. He trusts us. We earned that trust from him. He just became a little brother to us.',
        context: 'Xavier, on the trust Oonchiumpa earned',
        status: 'approved',
      },
      {
        text: 'He couldn\'t stop thanking me. The smile on his face all the way back home. He got out showing his family the bag, and he\'s walking around everywhere with those shoes on, running everywhere.',
        context: 'Xavier, after his first paid build',
        status: 'approved',
      },
      {
        text: 'I reckon if anything, he\'d be probably one of the ideal candidates to go around and show the community, and how to even teach these other younger guys.',
        context: 'Xavier as a future teacher on country',
        status: 'approved',
      },
      {
        text: 'It\'s easy to get them on bail and stuff like that, but with safe plans and actions, I\'ll make sure that we don\'t put a plan together where it\'s gonna fail the young kid itself. And we see them going back and their bail conditions breaching them and they go back into the system.',
        context: 'Case planning that does not fail young people',
        status: 'approved',
      },
    ],
    portrait: '/images/people/fred-campbell.png',
    notes: 'Has video. The "Good sleep, no sound" quote is WALTER\'s, not Fred\'s (deduped 2026-06-17).',
  },
  {
    slug: 'karen-liddle',
    name: 'Karen Liddle',
    role: 'Oonchiumpa co-founder',
    community: 'Utopia (Oonchiumpa)',
    tier: 'external',
    turns: '4 → 5',
    quotes: [
      {
        text: 'To see kids\' faces with joy after making a bed, it just really hits you.',
        context: 'Young people and making',
        status: 'primary',
      },
      {
        text: 'I had a yarn with the girls one day. Said you got to get out and start your own business. That\'s how we started Oonchiumpa.',
        context: 'Local leadership to enterprise',
        status: 'primary',
      },
      {
        text: 'We\'re silent achievers. We don\'t brag about what\'s going on and what we\'ve done.',
        context: 'Oonchiumpa tone',
        status: 'approved',
      },
      {
        text: 'We\'ve been saying from the start: gotta teach these kids there\'s a better way of living. There\'s always a story behind a child.',
        context: 'The Oonchiumpa method',
        status: 'approved',
      },
    ],
    portrait: '/images/people/karen-liddle.jpg',
    notes: 'Portrait added 2026-07-12 (build-073.jpg, website source).',
  },
  {
    slug: 'katrina-bloomfield',
    name: 'Katrina Bloomfield',
    role: 'Oonchiumpa family',
    community: 'Alice Springs / Utopia',
    tier: 'external',
    turns: '1',
    quotes: [
      {
        text: 'Most of our people in community are just on a blanket on the ground. These beds will come in handy. Mainly for the old elders. Getting up and down off the ground is very hard.',
        context: 'The need in Utopia',
        status: 'primary',
      },
      {
        text: 'The girls tend to be shy. But once they get into doing things and being in control, they\'re capable of anything.',
        context: 'Young women in control of the work',
        status: 'approved',
      },
      {
        text: 'It\'s exciting to see kids when they get involved, knowing what they\'re going to make, and that eventually it could be yours. They\'re just so excited.',
        context: 'Kids making the product',
        status: 'approved',
      },
    ],
    portrait: null,
    notes: 'Voice-only by design: no portrait.',
  },
  {
    slug: 'kristy-bloomfield',
    name: 'Kristy Bloomfield',
    role: 'Oonchiumpa co-founder, Traditional Owner',
    community: 'Alice Springs / Utopia',
    tier: 'external',
    turns: '4',
    quotes: [
      {
        text: 'We want to create a safe space for our young people. There\'s a lack of housing, which leads to a lack of sleep, which leads to low school attendance.',
        context: 'Youth and housing',
        status: 'primary',
      },
      {
        text: 'Back then we didn\'t have the opportunity to challenge government. Now we\'re in a position to say: this is a sacred site for us as Aboriginal women and traditional owners.',
        context: 'Sovereignty',
        status: 'approved',
      },
    ],
    portrait: '/images/people/kristy-bloomfield.jpg',
  },
  {
    slug: 'shayne-bloomfield',
    name: 'Shayne Bloomfield',
    role: 'Oonchiumpa family',
    community: 'Alice Springs / Utopia',
    tier: 'external',
    turns: '5 → 6 (carries the ask)',
    quotes: [
      {
        text: 'This partnership could go a long way. I feel it\'s got a long, long path ahead.',
        context: 'On working with Goods',
        status: 'primary',
      },
      {
        text: 'We could use this place as a healing camp: a cultural institute where kids learn to respect the land and the people around them.',
        context: 'Cultural healing',
        status: 'approved',
      },
      {
        text: "A lot of people say community is community and they need what we've got. When you flip it, we need what they've got.",
        context: 'Reciprocity: what community delivery means',
        status: 'approved',
      },
      {
        text: "Today my mum still gets text messages from her family saying, I can't believe how good this bed's going ... I don't want to get outta bed in the morning 'cause it's just so comfortable.",
        context: 'Eight weeks after the bed deliveries',
        status: 'approved',
      },
    ],
    portrait: null,
    notes: 'Voice-only by design: no portrait. Quotes 3-4 cleared by Ben 2026-07-20 from his EL transcript (the firsthand Maningrida delivery account; remaining candidates in wiki/investor/06-full-stories.md §6).',
  },
  {
    slug: 'dorrie-jones',
    name: 'Dorrie Jones',
    role: 'Community member',
    community: 'Arlparra (Utopia Homelands)',
    tier: 'external',
    turns: '3',
    quotes: [
      {
        text: 'Good for me and comfy, easy to put together.',
        context: 'Product proof at home',
        status: 'primary',
      },
    ],
    portrait: null,
    notes: 'Hero-photo + quote treatment in trip stories; no standalone portrait file.',
  },

  // ── Palm Island ───────────────────────────────────────────────────────────
  {
    slug: 'ivy',
    name: 'Ivy',
    aliases: ['Ivy Johnson'],
    role: 'Community member',
    community: 'Palm Island',
    tier: 'external',
    turns: '1',
    quotes: [
      {
        text: 'Hardly any people around the community have got beds. When they got family members over, there\'s not enough for everyone.',
        context: 'Housing need on Palm Island',
        status: 'primary',
      },
    ],
    portrait: '/images/people/ivy.jpg',
    notes: 'Ben to confirm which Ivy (index flag). Data uses bare "Ivy"; allowlist also carries "Ivy Johnson".',
  },
  {
    slug: 'alfred-johnson',
    name: 'Alfred Johnson',
    aliases: ['Alfred  Johnson'], // EL double-space variant
    role: 'Community member',
    community: 'Palm Island',
    tier: 'external',
    turns: '2',
    quotes: [
      {
        text: 'You have to bring them on the barge. You can\'t just take them on the boat. You have to pay for freight. It all adds up.',
        context: 'Why local manufacturing matters',
        status: 'primary',
      },
      {
        text: 'You got to get that shame out of the way and go and ask, sit down and talk to them.',
        context: 'Community connection',
        status: 'approved',
      },
    ],
    portrait: '/images/people/alfred-johnson.jpg',
  },
  {
    slug: 'carmelita-colette',
    name: 'Carmelita & Colette',
    aliases: ['Carmelita &  Colette', 'Carmelita and Colette', 'Carmelita'],
    role: 'Community members (joint card)',
    community: 'Palm Island',
    tier: 'external',
    turns: 'strengthens 1',
    quotes: [
      {
        text: 'We do need rest. It\'s for our health: maintaining health and being well.',
        context: 'Health and rest',
        status: 'primary',
      },
      {
        text: 'It\'s hard because of the cost of living. That\'s very hard locally on Palm Island.',
        context: 'Cost of living',
        status: 'approved',
      },
      {
        text: 'The freight is very, very dear.',
        context: 'Freight burden',
        status: 'approved',
      },
    ],
    portrait: '/images/people/carmelita-colette.jpg',
    notes: 'Always the joint card. Single-name "Carmelita" appears in compendium and fails the consent gate: use the joint form.',
  },
  {
    slug: 'daniel-patrick-noble',
    name: 'Daniel Patrick Noble',
    aliases: ['Daniel  Patrick Noble'],
    role: 'Community member',
    community: 'Palm Island',
    tier: 'external',
    turns: '2',
    quotes: [
      {
        text: 'A lot of them are low income earners. Just to have that extra cost of bringing things over, it all adds up. Sometimes people would rather go without.',
        context: 'Remote freight costs',
        status: 'primary',
      },
      {
        text: 'Palm Island always feels like home. I\'ve got a big extended family here.',
        context: 'Connection to community',
        status: 'approved',
      },
    ],
    portrait: '/images/people/daniel-patrick-noble.jpg',
  },
  {
    slug: 'jason',
    name: 'Jason',
    role: 'Community member',
    community: 'Palm Island',
    tier: 'external',
    turns: 'strengthens 4, 5',
    quotes: [
      {
        text: 'When it comes from an Aboriginal person, it works. That\'s what makes the difference.',
        context: 'Community-led solutions',
        status: 'primary',
      },
    ],
    portrait: '/images/people/jason.jpg',
  },

  // ── Kalgoorlie (Ninga Mia) ────────────────────────────────────────────────
  {
    slug: 'gloria-turner',
    name: 'Gloria Turner',
    role: 'Community member',
    community: 'Kalgoorlie, WA',
    tier: 'external',
    turns: 'strengthens 1',
    quotes: [
      {
        text: 'Sleep on a good mattress. For the back, the legs, the muscles.',
        context: 'On sleep quality',
        status: 'primary',
      },
      {
        text: 'Because we are family. They help a lot. Helping me.',
        context: 'Kinship',
        status: 'approved',
      },
    ],
    portrait: '/images/people/gloria-turner.jpg',
    notes: 'Place conflict flagged: community-narrative groups her with Palm/Tennant voices. Kalgoorlie is canonical until Ben says otherwise.',
  },
  {
    slug: 'chloe',
    name: 'Chloe',
    role: 'Support Worker, Kalgoorlie',
    community: 'Kalgoorlie, WA',
    tier: 'external',
    practitioner: true,
    quotes: [
      {
        text: 'I\'ve put up with clients going to hospital with pneumonia from sleeping on the ground because it\'s too cold. In summer they\'re scared to sleep because of snakes.',
        context: 'Frontline health worker',
        status: 'primary',
      },
      {
        text: 'Something as simple as a good bed makes a huge difference. It improves their health, helps with mobility, and gives them dignity.',
        context: 'Why a bed is health hardware',
        status: 'approved',
      },
    ],
    portrait: '/images/people/chloe.jpg',
  },
  {
    slug: 'tracy-mccartney',
    name: 'Tracy McCartney',
    role: 'Support Worker, Kalgoorlie',
    community: 'Kalgoorlie, WA',
    tier: 'external',
    practitioner: true,
    quotes: [
      {
        text: 'I don\'t call this work. This is where I come to meet my friends. For me it\'s about building relationships with people.',
        context: 'Community connection',
        status: 'primary',
      },
      {
        text: 'The new mattress design is not just about comfort. It\'s about dignity and health.',
        context: 'Dignity and health',
        status: 'hold',
        note: 'Second quote variant (content.ts/compendium). Pick ONE at narrative sign-off; curated line is what renders today.',
      },
    ],
    portrait: '/images/people/tracy-mccartney.jpg',
    notes: 'Foundation flagged a place conflict; data files consistently say Kalgoorlie.',
  },

  // ── Katherine / Mount Isa / Darwin ───────────────────────────────────────
  {
    slug: 'heather-mundo',
    name: 'Heather Mundo',
    role: 'Community member',
    community: 'Katherine',
    tier: 'external',
    turns: '3',
    quotes: [
      {
        text: 'These two boys just picked it up straight away. The most important thing is it\'s actually comfortable.',
        context: 'On the Stretch Bed',
        status: 'primary',
      },
      {
        text: 'I love this community. I grew up here and I\'ve been here for so many years.',
        context: 'Katherine community',
        status: 'approved',
      },
    ],
    portrait: '/images/people/heather-mundo.jpg',
  },
  {
    slug: 'gary',
    name: 'Gary',
    role: 'Men\'s group leader',
    community: 'Mount Isa',
    tier: 'external',
    turns: 'strengthens 4',
    quotes: [
      {
        text: 'We had 150 men lead the march from our men\'s group. The women and kids came behind us. We marched through the street.',
        context: 'Community leadership',
        status: 'primary',
      },
      {
        text: 'We don\'t force nothing on them. We just sit down and explain what we do, or we let them look and listen. When they\'re ready, they\'ll try.',
        context: 'Working with young people',
        status: 'approved',
      },
    ],
    portrait: '/images/people/gary.jpg',
  },
  {
    slug: 'wayne-glenn',
    name: 'Wayne Glenn',
    role: 'Practitioner, Red Dust',
    community: 'Darwin',
    tier: 'external',
    practitioner: true,
    quotes: [
      {
        text: 'It\'s a really simple idea to a really complex issue. One that can be taken and modified for individual families and communities.',
        context: 'On the Stretch Bed',
        status: 'primary',
      },
      {
        text: 'Families are often staying with other families where the bedding isn\'t available or sufficient. People are just sleeping where they can.',
        context: 'Overcrowding',
        status: 'approved',
      },
      {
        text: 'We see entrenched primary health issues in communities: rheumatic heart disease, scabies, trachoma. Issues that don\'t exist anywhere else in the world.',
        context: 'Health inequity',
        status: 'approved',
      },
    ],
    portrait: '/images/people/wayne-glenn.jpg',
  },

  // ── Practitioners without a fixed community listing ──────────────────────
  {
    slug: 'boe-remenyi',
    name: 'Dr Boe Remenyi',
    aliases: ['Boe Remenyi'],
    role: 'Paediatric Cardiologist',
    community: 'NT-wide',
    tier: 'external',
    practitioner: true,
    quotes: [
      {
        text: 'Education and awareness is great, but you need to match it with something that actually enables people to change. It\'s great to say you should wash your sheets every week. But if you don\'t have a washing machine, that\'s not going to work.',
        context: 'Practical solutions',
        status: 'primary',
        note: 'The cleared washing→RHD logic line. Use this wherever Jessica Allardyce\'s held line was.',
      },
      {
        text: 'If I can fall through the gaps, how many others are falling through the gaps? That\'s my biggest mission: speaking up for my countrymen who don\'t have a voice.',
        context: 'Health advocacy',
        status: 'approved',
      },
    ],
    portrait: null,
    notes: 'PORTRAIT GAP: cleared and quoted but no image file.',
  },
  {
    slug: 'ray-nelson',
    name: 'Ray Nelson',
    role: 'Community member',
    community: 'Utopia Homelands',
    tier: 'external',
    quotes: [
      {
        text: 'Since receiving their new beds, they are no longer experiencing back pains.',
        context: 'Lived experience, bed GBO-156-96',
        status: 'primary',
        note: 'Lived-experience account ONLY. Never present as a measured clinical result.',
      },
    ],
    portrait: null,
    notes: 'PORTRAIT GAP: cleared and quoted but no image file.',
  },
  {
    slug: 'mark',
    name: 'Mark',
    role: 'Community member',
    community: 'Palm Island',
    tier: 'external',
    quotes: [
      {
        text: 'We put together crates, tied them up with plastic, joined them together to make it look like a bed. Just to have something to sleep on.',
        context: 'Making do without beds',
        status: 'primary',
      },
      {
        text: 'It\'s comfy. I\'d sleep on it every night. I reckon it\'ll last a long time.',
        context: 'On the Stretch Bed',
        status: 'approved',
      },
    ],
    portrait: null,
    notes: 'Storyteller index lists Mark as W-tier, but he is on the external allowlist. Ben to confirm tier; external per the gate until then.',
  },

  // ── Website-only ─────────────────────────────────────────────────────────
  {
    slug: 'zelda-hogan',
    name: 'Zelda Hogan',
    role: 'Community member',
    community: 'Tennant Creek',
    tier: 'website',
    quotes: [
      {
        text: 'A good night\'s sleep is important... from a big day from work.',
        context: 'Housing journey (tin shed to home)',
        status: 'approved',
        note: 'Website only. Never funder exports. Verified 2026-07-12: no funder path imports journeyStories.',
      },
    ],
    portrait: null,
  },

  // ── Pending Ben's confirmation ───────────────────────────────────────────
  {
    slug: 'frankie-holmes',
    name: 'Frankie Holmes OAM',
    aliases: ['Frank Holmes'],
    role: 'Senior Alyawarr Elder',
    community: 'Ampilatwatja',
    tier: 'pending',
    quotes: [],
    portrait: null,
    notes: 'Foundation §3 lists as external, but not on cleared-voices.ts. Live on the published Utopia field note. Checkpoint B-1.',
  },
  {
    slug: 'donald-thompson',
    name: 'Donald Thompson OAM',
    aliases: ['Mr Donald Thompson OAM'],
    role: 'Senior Alyawarr Elder',
    community: 'Ampilatwatja',
    tier: 'pending',
    quotes: [],
    portrait: null,
    notes: 'Foundation §3 lists as external, but not on cleared-voices.ts. Live on the published Utopia field note. Checkpoint B-1.',
  },
  {
    slug: 'charley',
    name: 'Charley',
    role: 'Community member',
    community: 'Utopia',
    tier: 'pending',
    quotes: [],
    portrait: null,
    notes: 'Trip voice card (video). Foundation §3 lists as external, but not on cleared-voices.ts. Checkpoint B-1.',
  },

  // ── Holds — do not use externally ────────────────────────────────────────
  {
    slug: 'walter',
    name: 'Walter',
    role: 'Community member',
    community: 'Alice Springs',
    tier: 'hold',
    quotes: [
      {
        text: 'Good sleep. No sound, no people shouting. Just quiet.',
        context: 'On the Stretch Bed',
        status: 'hold',
        note: 'His quote, not Fred\'s (deduped 2026-06-17). Not cleared.',
      },
    ],
    bannedFragments: ['No sound, no people shouting'],
    portrait: null,
  },
  {
    slug: 'jessica-allardyce',
    name: 'Jessica Allardyce',
    role: 'Miwatj Health',
    community: 'East Arnhem',
    tier: 'hold',
    practitioner: true,
    quotes: [
      {
        text: 'Scabies often leads to Rheumatic Heart Disease, so washing machines are essential to be able to clean infected clothing, bedding and towels.',
        context: 'Washing and RHD',
        status: 'hold',
        note: 'Strongest RHD/washing line in the corpus but NOT consent-cleared. Elevation decision is Ben\'s (foundation §6.5). Removed from all rendered surfaces 2026-07-12; use Dr Boe Remenyi instead.',
      },
    ],
    bannedFragments: ['essential to be able to clean infected clothing'],
    portrait: null,
  },
  {
    slug: 'kylie-bloomfield',
    name: 'Kylie Bloomfield',
    role: 'Community member',
    community: 'Alice Springs / Utopia',
    tier: 'hold',
    quotes: [],
    portrait: null,
    notes: 'No usable transcript.',
  },

  // ── Funder-only ──────────────────────────────────────────────────────────
  {
    slug: 'georgina-byron',
    name: 'Georgina Byron AM',
    role: 'CEO, Snow Foundation',
    community: 'Funder',
    tier: 'funder',
    quotes: [
      {
        text: 'Our role is to plug the gaps. There\'s quite a few gaps to plug. We can\'t do it all, but we can do our bit.',
        context: 'Funder rationale',
        status: 'approved',
      },
      {
        text: 'To have healthy kids grow up to be healthy parents and uncles and aunties: that is the goal, isn\'t it?',
        context: 'Intergenerational wellbeing',
        status: 'approved',
      },
      {
        text: 'It\'s about empowering communities. They want those beds, and it\'s about supporting inspirational entrepreneurs like Ben.',
        context: 'On Goods on Country',
        status: 'hold',
        note: 'Verbatim funder speech containing "empowering": Ben to decide use or retire (checkpoint B-5b).',
      },
    ],
    portrait: null,
    notes: 'Funder testimonial only, clearly labelled. NEVER in the community storyteller set.',
  },

  // ── Internal ─────────────────────────────────────────────────────────────
  {
    slug: 'nicholas-marchesi',
    name: 'Nicholas Marchesi',
    role: 'Co-founder',
    community: 'Goods team',
    tier: 'internal',
    quotes: [],
    portrait: null,
    notes: 'Filtered out of public storyteller grids.',
  },
];

// ── Lookup helpers ──────────────────────────────────────────────────────────

const normalise = (name: string) =>
  (name ?? '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[.,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const byName = new Map<string, StorytellerRecord>();
for (const rec of STORYTELLER_REGISTRY) {
  byName.set(normalise(rec.name), rec);
  for (const alias of rec.aliases ?? []) byName.set(normalise(alias), rec);
}

/** Find the canonical record for any name/alias spelling (normalised). */
export function getStoryteller(name: string | null | undefined): StorytellerRecord | undefined {
  if (!name) return undefined;
  return byName.get(normalise(name));
}

/** Tier check that understands aliases. Unknown names return 'hold' (default-deny). */
export function getVoiceTier(name: string | null | undefined): VoiceTier {
  return getStoryteller(name)?.tier ?? 'hold';
}
