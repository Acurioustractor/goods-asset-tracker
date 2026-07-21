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
      {
        text: "When I first moved in, the only shelter I had was my car. My little car. That was it.",
        context: "Opening of her life story on her block \u2014 twenty-four years starting with nothing but a car.",
        status: 'approved',
      },
      {
        text: "We get scared of people sleeping on the ground. You and Nic came over and done this bed... what he's doing is amazing job.",
        context: "Her opening reflection after the washing machine and bed trip.",
        status: 'approved',
      },
      {
        text: "Why I'm helping you is 'cause, I'm a traditional owner. And I live here and I wanted to help, to let people know that these two young fellas came to do this for us. We need to respect them... That's how my feeling is to respect.",
        context: "Why she vouches for Goods in her community.",
        status: 'approved',
      },
      {
        text: "If we have our own contract doing all these in the communities, they can sell 'em to people... and even to Tennant Creek come where we have NAIDOC week or we have show... marquees sort of sell 'em.",
        context: "Her unprompted vision of community-owned bed-making enterprise and local sales.",
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
      {
        text: "we've never been asked, we've never been asked at what sort of house we'd like to live in. So this is a really exciting, exciting time.",
        context: "Describing the moment an architect asked what designing her own house would mean, the first time anyone had asked.",
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
      {
        text: "I grew up in a washing machine where you just push that $1 in ... there was like 15 people living in the house ... that washing machine's gonna be used every day, you know, three or four times a day, you know, maybe five, 10 times ... just imagine that you got something that is not suitable for that sort of a huge usage. And I really like your project. You are really considering that.",
        context: "Jimmy explaining why commercial-grade washing machines matter in overcrowded houses, directly endorsing the Goods washing machine project.",
        status: 'approved',
      },
      {
        text: "Anything from a Holden car to a fridge or a washing machine or TV, it just costs more, you know, in these remote communities and especially the fridges and the washing machine ... they always broke down. But it costs people a lot more if they're not buying the right material ... when you go in a remote community, there's not much job ... they leaning on very small income.",
        context: "Jimmy on the poverty premium: remote people on the smallest incomes pay the most for goods that fail fastest.",
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
      {
        text: "it's a good job like washing the bed afterwards ... have it more softer and comfortable. And it's more lower for little ones too, yeah.",
        context: "On the washable mattress/top and why the low height suits small children.",
        status: 'approved',
      },
      {
        text: "And even especially for our older people too. They like to have lower beds",
        context: "Unprompted product feedback that Elders prefer the lower bed height.",
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
      {
        text: "Sleeping on the mattress, on the floor... don't have any mattresses. Gotta buy them one once in the shop for me and my little ones.",
        context: "Her current sleeping situation with five children \u2014 mattresses on the floor, and not enough of them.",
        status: 'approved',
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
      {
        text: "Like me, see, I had a couple of strokes and a lot of the time I can't get up. If I have two of those things, the crate stuff, I'd be okay. You know, I'd just get up.",
        context: "Accessibility feedback: bed height matters for people recovering from strokes; two crates would let him get up.",
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
      {
        text: "We're in a position to make change and bring that generational wealth out on Loves Creek Station. And to be a part of these the cattle industry, which is a multimillion dollar business, we wanna bring that multimillion dollar business to our families on Aboriginal land and to lead that.",
        context: "On the vision for Loves Creek after the 1994 land claim \u2014 enterprise led by traditional owners on their own land. The clearest single articulation of the ownership ambition Goods' pathway plugs into.",
        status: 'approved',
      },
      {
        text: "We know what we wanna do on our land, and we know how to get there. I think it's just about having our land councils, our government supporting us in delivering this... Self-determination for us as aboriginal people, as our old people have led the way for us.",
        context: "Closing the on-country vision: communities once ran like small towns with their own infrastructure and councils; the ask is support, not control. Echoes the Goods 'we know what we need' synthesis \u2014 note that sentence itself is a Goods synthesis, never quoted; this is Kristy's real version.",
        status: 'approved',
      },
      {
        text: "It's important for us to have a safe home. And for our young people... to have an opportunity to have their own bed, to have their own belongings, to be a kid... the same experience that many other Australians have that take advantage of having their own room and beds.",
        context: "Kristy on overcrowded housing in Central Australia \u2014 visiting family 'sleeping on their beds' \u2014 and what a bed of one's own means for a child. The single most directly Goods-relevant line in the batch.",
        status: 'approved',
      },
      {
        text: "There's a lack of housing, which leads to a lack of sleep for our young people, which leads to a low attendance of school education... quite often our young people are breaking in and looking for food and being out on the streets because there is such an overcrowding house that they don't wanna be home.",
        context: "The causal chain from overcrowding to sleeplessness to school non-attendance to justice contact \u2014 the sleep-as-foundation logic of the Stretch Bed, in a community leader's own words.",
        status: 'approved',
      },
      {
        text: "We wanna be able to create generational wealth, economic development on our own land. We see too many times that a lot of other businesses are thriving. Why can't we thrive as Aboriginal people on our land as well?",
        context: "Oonchiumpa's economic vision \u2014 the demand side of the Goods community-ownership pathway (on-country manufacturing moving to community ownership).",
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
      {
        text: "We've liaised with Aboriginal elders, traditional owners of that community, before we've liaised with government members.",
        context: "How Goods enters a community; protocol before administration.",
        status: 'approved',
      },
      {
        text: "We made 20 odd beds in aged care ... utilizing the young people of the aged care service ... They were so willing to learn about how these beds came together.",
        context: "Maningrida delivery: young people building beds for Elders at the aged-care service.",
        status: 'approved',
      },
      {
        text: "All they wanted was something that's off the ground ... sit on the edge of it and just pop themselves up. Just amazing.",
        context: "What the aged-care Elders actually asked for from a bed.",
        status: 'approved',
      },
      {
        text: "They're definitely not gonna break, I can tell you that ... the recycled plastic that you use from that is blowing my mind away ... Every sheet was a different design.",
        context: "On the washing machines and the recycled-plastic panels, after the Maningrida installs.",
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
      {
        text: "We, I was laying down on the floor, me and my partner, so we got a bed to lay on there, so it's easy for us to get off it. Up, yeah.",
        context: "Ivy on moving from sleeping on the floor with her partner to sleeping on the Goods bed.",
        status: 'approved',
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
      {
        text: "You can't just go down to the store and buy beds and stuff, it's hard for families and, especially over here, you won't just have a family, one family in one house. You'll have multiple families, in the one house and not everyone gets a bed, and not everyone has that place to stay.",
        context: "Explaining the barge-freight barrier and overcrowding reality of getting beds onto Palm Island.",
        status: 'approved',
      },
      {
        text: "having a bed is something like, you need, you can't, you feel more safe when you sleep in a bed. It's different than sleeping on the couch, and then sleeping on the ground, most people do be doing that, sleeping on couches and stuff, don't have beds.",
        context: "On the felt difference between a bed and the couch or floor most people make do with.",
        status: 'approved',
      },
      {
        text: "I just think not being shame... you got to get that shameless out of the way and go and ask, sit down and talk to them... you really got to know the family, and have that inside look of it, and that's the only way you will know if you go and approach them and ask them because they're not going to come to you.",
        context: "His advice on how Goods must handle shame so people will say when beds are not working.",
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
      {
        text: "Anyone, get some money, they'll go out to town and buy a new washing machine, fridge. Like any white goods, furniture, bed, lounge, dining suite. Everybody goes to Townsville... But the fright is very, it's very dear. Very dear.",
        context: "How all white goods and furniture for Palm Island come via Townsville shops with painful barge freight.",
        status: 'approved',
      },
      {
        text: "these collapsed beds, be good when you get Christmas holidays, school holidays, when family coming from the mainland. Pull it out... And kids, they always, Sleep out with family or have to have their friends. Sometimes family don't have extra mattresses.",
        context: "The visiting-family use case: collapsible beds for Christmas, school holidays and kids' sleepovers.",
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
      {
        text: "the cost of, not only purchasing it, the cost of having it freighted over as well, it all adds up... a lot of them are low income earners... And sometimes people would rather just go without.",
        context: "Explaining why freight costs mean Palm Island families simply go without furniture.",
        status: 'approved',
      },
      {
        text: "why not just get something, say, a 150 bed that would only last maybe a year or two compared to a 500 bed plus freight. That, you're looking at nearly 1, 000 to get that over. It all adds up, so why not stick to the cheaper options, and it doesn't last a lifetime compared to the dearer ones.",
        context: "The cheap-bed trap: freight economics force short-life purchases that break within a year or two.",
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
      {
        text: "Try it. Try it. You won't regret it, I tell you. You won't regret it, trust me. If I can do it, you can.",
        context: "His message to other communities unsure about the beds.",
        status: 'approved',
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
      {
        text: "Because it's hard to do it. Plus, I'm disability, I can't wash my mattress. Yeah. It's hard.",
        context: "On why a washable mattress matters when disability makes cleaning a normal mattress impossible.",
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
      {
        text: "I've put up with a few of my clients going to hospital with pneumonia from sleeping on the ground because it's too cold. And then in the summer I've put up with them telling me constantly like, we're scared to sleep here, we're scared to sleep there because of snakes.",
        context: "Describing sleeping conditions for homeless clients at Boulder Camp and Ninga Mia near Kalgoorlie.",
        status: 'approved',
      },
      {
        text: "at first when you told me about it, I'm just like, yeah like yeah no I don't think that's possible but now that you've just showed us and helped us put it together it's amazing. It is a good idea. One it's getting them off the cold ground.",
        context: "Her first impression after assembling the bed, converting from scepticism on the spot.",
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
      {
        text: "for washing their blankets so then they've got clean fresh blankets to sleep in which is the whole circle for them with clean clothes clean blankets it's um helping health wise and everything sores and stuff like that",
        context: "Describing why the washing service matters for people sleeping rough in Kalgoorlie.",
        status: 'approved',
      },
      {
        text: "I'm here for you ... I'm not looking down on you because you need a washing truck, I'm not ... looking down on you because you have to live the way you're living",
        context: "Her ethic of friendship over service delivery at the Kalgoorlie hub.",
        status: 'approved',
      },
    ],
    portrait: '/images/people/tracy-mccartney.jpg',
    notes: 'Foundation flagged a place conflict; data files consistently say Kalgoorlie.',
  },
  {
    slug: 'tanya-turner',
    name: 'Tanya Turner',
    role: 'Oonchiumpa Consultancy leadership, Alice Springs',
    community: 'Alice Springs / Utopia (Oonchiumpa)',
    tier: 'external',
    turns: '2, 5 (never asked; ownership)',
    quotes: [
      {
        text: "We're given the opportunity to be consulted with, but you're never given the opportunity... it's rare that you're consulted with and then told, Hey.",
        context: 'Consultation without decision power; the never-asked pattern from the leadership side',
        status: 'approved',
      },
      {
        text: "That's where we talk about allies, right? It's about letting Aboriginal people lead, but being an ally on the side.",
        context: 'The posture partners must hold',
        status: 'primary',
      },
      {
        text: 'Working towards how we as an Aboriginal community bring back our lives, create something for our people to want to live for.',
        context: 'What the work is ultimately for',
        status: 'approved',
      },
    ],
    portrait: null,
    notes: 'All three quotes cleared by Ben 2026-07-20 (Voice Impact Model pass). EL transcript c14ee313; a duplicate filing (Tanya1) exists in EL. Note: the "Judges welcome" transcript filed under Kristy is mostly Tanya speaking.',
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
      {
        text: "Well, sitting down on the grass, on the dirt, with the fire, that's our consultation, without the pen and paper, and just actually sit down and listen.",
        context: "Gary answering what real consultation with Elders and community means, versus government meeting-minutes consultation.",
        status: 'approved',
      },
      {
        text: "We could even teach them down there to make it, you know, and you want this bed, here, well, come on, give me a hand, make it, you know, and they can take the skill to make it. And they, well, take pride, that's my bed, you know.",
        context: "Gary proposing that homeless people by the river help build their own beds at the Men's Shed and take ownership of them.",
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
      {
        text: "with the overcrowding issues in housing, um, the bedding environment is often, um, pretty grim as far as what people are sleeping on, what people have access to... people are just sleeping where they can.",
        context: "Describing the bedding reality created by overcrowding and transience in remote communities.",
        status: 'approved',
      },
      {
        text: "It's a really simple idea, um, to a really complex issue, um, that can be taken and, taken and modified for individual families, individual communities... we also talked about, um, uh, giving ownership to communities and to families, um, which is really important. And it's an idea that people will take and, and take it in their own direction. I think that's what excites me most about it.",
        context: "Why the adaptable, community-owned nature of the bed excites him more than the product itself.",
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
    quotes: [
      {
        text: "my mum gets the phone call and she's like, your uncle said they had the best night's sleep just outta these beds, made outta crates with the cushion and the thing. It's like unreal, unreal. The impact that ... you have",
        context: "Recounting family feedback after Sarah (a nurse volunteer, 'adopted daughter') built beds for extended family at Utopia community.",
        status: 'approved',
        note: 'Reattributed 2026-07-21: was misfiled under Georgina Byron. Tier (external use) is Ben\'s call.',
      },
    ],
    portrait: null,
    notes: 'Quote recovered 2026-07-21 from Georgina misfiling; earlier "no usable transcript" note superseded.',
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
      {
        text: "We've waited so long for this house and no one in Alice Springs would touch it. Get two bloke to bring five contractors in that like, ... done in a week.",
        context: "Contrasting years of service-system inaction with the one-week community build.",
        status: 'hold',
        note: 'Speaker attribution unconfirmed: sounds like a community voice from the same trip transcript that carried the two misfiled quotes (moved to Kylie/Katherine 2026-07-21). Confirm it is actually Georgina before use.',
      },
      {
        text: "The reaction has been so overwhelmingly positive and for me to get that insight is just, validated what they're doing.",
        context: "Seeing community response to the beds on the Tennant Creek trip; funder validation in her own words.",
        status: 'approved',
      },
      {
        text: "For me, I wanted to see how the beds would be received and for me it was an overwhelming, yes, we want and need these beds ... And you're doing it with community. It's not a for, it's a with, and that's really important too.",
        context: "Her closing verdict on the trip; the with-not-for line lands the design-with-community principle from a funder's mouth.",
        status: 'approved',
      },
    ],
    portrait: null,
    notes: 'Funder testimonial only, clearly labelled. NEVER in the community storyteller set. 2026-07-21: two misfiled quotes moved out (Kylie Bloomfield, Katherine of the Deadly Heart Trek) per Ben; one further quote put on hold pending speaker confirmation.',
  },
  {
    slug: 'katherine-deadly-heart-trek',
    name: 'Katherine (Deadly Heart Trek)',
    role: 'Deadly Heart Trek team',
    community: 'Deadly Heart Trek',
    tier: 'hold',
    quotes: [
      {
        text: "The goods project Nick and Ben, and together with the family built a bed ... just seeing that family jump on that bed and do it together and have a bit of a laugh and just felt really, you know, welcoming and warm. So that was really special.",
        context: 'Watching a family build a Basket Bed together on the Deadly Heart Trek.',
        status: 'approved',
        note: 'Reattributed 2026-07-21: was misfiled under Georgina Byron. Surname/identity to confirm before crediting by name externally; tier is Ben\'s call.',
      },
    ],
    portrait: null,
    notes: 'Created 2026-07-21 to hold a quote misfiled under Georgina Byron. Identity to confirm.',
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
