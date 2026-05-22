// Trip stories — the reusable "field notes" scrollytelling system.
// Each trip is authored as data: an ordered list of blocks rendered by
// <TripStory> (src/components/stories/trip-story.tsx). To add a new trip,
// add an entry to `tripStories`. No new component code required.
//
// Voices captured on a trip start as consent: 'pending' and only appear on the
// internal (admin-gated) route until consent is verified in Empathy Ledger,
// at which point set the story `published: true` and flip voices to 'cleared'.
//
// Stats are verified against products.ts and the March 2026 compendium.
// Media lives in /public/images/stories/<slug>/ and /public/video/<slug>/.

export type Consent = 'pending' | 'cleared';

export interface MediaRef {
  /** Background still, e.g. /images/stories/utopia/01-hero.jpg */
  image: string;
  /** Optional looping background video; falls back to `image` as poster. */
  videoDesktop?: string;
  videoMobile?: string;
}

/** A single contextual link rendered in a block's gutter. */
export interface NavLink {
  label: string;
  href: string;
}

/** Shared shape for any block that can carry up to ~2 contextual gutter links. */
interface WithLinks {
  links?: NavLink[];
}

/**
 * A voice card. `storytellerSlug` (optional) links to /storytellers/<slug>
 * — only set once consent is cleared in EL.
 */
export interface VoiceCard {
  quote: string;
  who: string;
  community?: string;
  consent: Consent;
  storytellerSlug?: string;
}

export type TripBlock =
  | (WithLinks & {
      kind: 'masthead';
      kicker: string;
      title: string;
      standfirst: string;
      dateline: string;
      media: MediaRef;
    })
  | (WithLinks & {
      kind: 'read';
      tag?: string;
      heading?: string;
      paragraphs: string[];
      pulls?: { quote: string; src: string }[];
    })
  | (WithLinks & {
      kind: 'immersive';
      actmark?: string;
      title: string;
      standfirst?: string;
      media: MediaRef;
    })
  | (WithLinks & { kind: 'bleedquote'; text: string; media: MediaRef })
  | (WithLinks & { kind: 'stats'; lead: string; items: { value: string; label: string }[] })
  | (WithLinks & {
      kind: 'voices';
      heading: string;
      sub?: string;
      cards: VoiceCard[];
    })
  | (WithLinks & {
      kind: 'videos';
      heading: string;
      sub?: string;
      items: { title: string; caption: string; poster: string; src: string }[];
    })
  | (WithLinks & { kind: 'map'; heading: string; intro: string; caveat: string })
  | (WithLinks & {
      kind: 'pathways';
      heading: string;
      sub?: string;
      cards: { who: string; title: string; body: string }[];
      link?: { label: string; href: string };
    })
  | (WithLinks & { kind: 'close'; title: string; media: MediaRef })
  | {
      /**
       * "This is Goods" portal — renders at the foot of every field-notes
       * page. Self-aware: the renderer hides whichever entry's slug matches
       * the current story so we don't link back to ourselves. `anchors` are
       * the non-field-notes anchor links (shop / story / impact / etc.).
       */
      kind: 'portal';
      heading?: string;
      sub?: string;
      anchors: NavLink[];
    };

export interface TripStory {
  slug: string;
  title: string;
  summary: string;
  dateline: string;
  /** false = internal/admin only. true = eligible for the public route. */
  published: boolean;
  blocks: TripBlock[];
}

const IMG = '/images/stories/utopia';
const VID = '/video/utopia';

const utopia: TripStory = {
  slug: 'utopia-may-2026',
  title: 'From Alice Springs to Utopia',
  summary:
    'Two days on Anmatyerr and Alyawarr Country, building beds with young people and sitting with Elders. Supported by Oonchiumpa.',
  dateline: 'Alice Springs and Utopia Homelands, NT · 21–22 May 2026',
  published: false,
  blocks: [
    {
      kind: 'masthead',
      kicker: 'Field notes · Alice Springs to Utopia',
      title: 'The young people built the beds. One of them wanted to keep building.',
      standfirst:
        'It started in Alice Springs, with young people making beds out of recycled plastic, and ended on the homelands at Utopia. Two days, supported by Oonchiumpa. A delivery, and the start of something longer.',
      dateline:
        'Alice Springs and Utopia Homelands, Northern Territory · 21–22 May 2026 · Goods on Country, with Oonchiumpa',
      media: { image: `${IMG}/04-build.jpg`, videoDesktop: `${VID}/alice-youth-desktop.mp4`, videoMobile: `${VID}/alice-youth-mobile.mp4` },
    },
    {
      kind: 'read',
      tag: 'The trip',
      heading: 'Not a giveaway. A build.',
      paragraphs: [
        'In Alice Springs, young people were supported by the Centrecorp Foundation to build their own beds, and every young person who built one kept one. Oonchiumpa held the whole trip, the cultural connection and the call on where it went. That order matters. The opposite of charity is asking people what they need, then building it with them.',
        'The Stretch Bed is a plain object. Two galvanised steel poles thread through sleeves in heavy-duty canvas. Four legs, pressed from recycled plastic that communities collect, click onto the poles. It weighs 26kg, holds 200kg, and goes together in about five minutes with no tools. What it replaces is harder: a thin mattress on a concrete floor, or a door taken off its hinges and laid flat.',
        'Goods on Country has put more than 400 of these beds into homes across the country since 2023. This trip added a few more, and pointed at where the work goes next.',
      ],
    },
    {
      kind: 'videos',
      heading: 'Building in Alice Springs',
      sub: 'The young people who made the beds, in their own words. Hold for consent before sharing outside the team.',
      items: [
        {
          title: 'The young people',
          caption: 'In their own voices, building the beds they would take home.',
          poster: `${IMG}/04-build.jpg`,
          src: `${VID}/alice-youth-desktop.mp4`,
        },
      ],
    },
    {
      kind: 'read',
      tag: 'Mykel',
      heading: '"Never would\'ve thought it would\'ve come out like that"',
      paragraphs: [
        "One of the builders was Mykel. He turned the finished bed over in his hands like he wasn't sure it was real, then explained it was made from bottle lids, the plastic shredded and pressed into something strong enough to stand on. He built the bed he slept on that night, and kept going. Seven in total.",
        'An Elder watched him work and called him grandson, called him brother. Then, after a pause, said the thing that turned a good morning into something larger: "That could be a good employment for yourself too, grandson. Later on." We asked Mykel whether he would come and make beds every day if the making moved closer to home.',
      ],
      pulls: [
        { quote: '"Comfortable as. Smooth, tight, hard, fancy. It\'s not trampoline."', src: 'Mykel · consent pending' },
        { quote: '"Yeah, I\'ll be rocking up every day to make them."', src: 'Mykel · consent pending' },
      ],
    },
    {
      kind: 'stats',
      lead: 'One bed, in numbers',
      items: [
        { value: '26kg', label: 'flat-packs, one person can carry it' },
        { value: '200kg', label: 'load capacity, rated' },
        { value: '~5 min', label: 'to assemble, no tools' },
        { value: '20kg', label: 'of plastic kept out of landfill, per bed' },
        { value: '10+ yrs', label: 'design life, 5-year warranty' },
        { value: '400+', label: 'beds in homes since 2023' },
      ],
      links: [
        { label: 'See the Stretch Bed', href: '/shop/stretch-bed-single' },
        { label: 'How it is made', href: '/story' },
      ],
    },
    {
      kind: 'immersive',
      actmark: 'Act two · the road',
      title: 'From town to the homelands',
      standfirst:
        'We loaded the beds and drove out to Utopia, onto Anmatyerr and Alyawarr Country. Oonchiumpa led the way, and we followed.',
      media: { image: `${IMG}/01-hero.jpg` },
    },
    {
      kind: 'immersive',
      actmark: 'Act three · Utopia',
      title: 'The beds go to the homes',
      standfirst:
        'A community close by wanted beds too, more of them. We did not plan that leg. They did. We drove where we were pointed, and we unloaded.',
      media: { image: `${IMG}/06-delivery.jpg` },
    },
    {
      kind: 'read',
      tag: 'Off the ground',
      heading: 'Why a bed is health hardware',
      paragraphs: [
        'A bed is not a comfort upgrade. Sleeping on cold ground is tied to chest infections and to skin conditions like scabies, which can lead to Rheumatic Heart Disease. Getting families up off the floor, onto a surface that can be washed, is one of the simplest pieces of health hardware there is. People asked, unprompted, whether they could wash it. That is the feature that matters most, and the answer is yes.',
      ],
      pulls: [
        {
          quote:
            '"Something as simple as a good bed makes a huge difference. It improves their health, helps with mobility, and gives them dignity."',
          src: 'Chloe · Support worker, Kalgoorlie · cleared voice',
        },
      ],
    },
    { kind: 'bleedquote', text: 'Waste into rest. A morning into a trade.', media: { image: `${IMG}/05-waste.jpg` } },
    {
      kind: 'voices',
      heading: 'What people told us',
      sub:
        'Voices from this trip sit beside voices from the wider Goods story. Trip quotes are held as consent pending until confirmed with the speakers and Oonchiumpa.',
      cards: [
        { quote: '"This one\'s better, I reckon."', who: 'Johnny', community: 'Utopia Homelands', consent: 'pending' },
        {
          quote: '"It\'s more better than laying around on the floors. It was easy to make."',
          who: 'Ivy',
          community: 'Palm Island',
          consent: 'cleared',
        },
        {
          quote: '"We\'ve never been asked what sort of house we\'d like to live in."',
          who: 'Linda Turner',
          community: 'Tennant Creek',
          consent: 'cleared',
        },
      ],
    },
    {
      kind: 'immersive',
      actmark: 'Act four · Ampilatwatja',
      title: 'Sitting with the old fellas',
      standfirst:
        'At Ampilatwatja we sat with two senior men, both honoured with the Order of Australia this year, and left four beds. We let the camera run, and got out of the way.',
      media: { image: `${IMG}/07-elders.jpg` },
    },
    {
      kind: 'videos',
      heading: 'Hear it from them',
      sub:
        'Short clips with sound, in people\'s own voices. Drop the files into /public/video/utopia/ and these come alive. Hold for consent before sharing outside the team.',
      items: [
        {
          title: 'The Elders, Ampilatwatja',
          caption: 'Two Order of Australia men, on the bed, in their words.',
          poster: `${IMG}/07-elders.jpg`,
          src: `${VID}/ampilatwatja-elders.mp4`,
        },
        {
          title: 'The beds being made',
          caption: 'Recycled plastic shredded and pressed into legs.',
          poster: `${IMG}/10-next.jpg`,
          src: `${VID}/beds-being-made.mp4`,
        },
        {
          title: 'The wider delivery',
          caption: 'The drone over the community, beds going out.',
          poster: `${IMG}/06-delivery.jpg`,
          src: `${VID}/delivery-drone.mp4`,
        },
      ],
    },
    {
      kind: 'read',
      tag: 'The model',
      heading: 'The point is to hand it over',
      paragraphs: [
        'Goods on Country is an enterprise, not a giveaway. Beds, and the washing machine named Pakkimjalki Kari by Elder Dianne Stokes in Warumungu, come out of years of community co-design. A containerised plant can shred and press recycled plastic into bed legs at around 30 beds a week, and that plant can move to a community and be owned there.',
        'That is the part Mykel pointed at without knowing it. Alice and Utopia are live candidates for the next place the making happens, not just the next place the beds arrive. The job is to make the making local, and then to become unnecessary.',
      ],
    },
    {
      kind: 'map',
      heading: 'Where the beds have gone',
      intro:
        'More than 400 Stretch Beds are now in homes across the country. This is the March 2026 deployment snapshot. Utopia is among the newest.',
      caveat:
        'Counts are the March 2026 compendium snapshot. Utopia also carries a separate 107-bed pathway approved with the Centrecorp Foundation, not yet counted as delivered. Numbers to be reconciled against the asset register before any public use.',
      links: [
        { label: 'Browse all communities', href: '/communities' },
        { label: 'Utopia Homelands', href: '/communities/utopia-homelands' },
      ],
    },
    { kind: 'close', title: 'This is the first thing he built. It is not the last we will build together.', media: { image: `${IMG}/11-close.jpg` } },
    {
      kind: 'pathways',
      heading: 'Three ways to be part of it',
      sub: 'One piece of work, three ways in. Plain framings for now, real links and figures to be added.',
      cards: [
        { who: 'Supporters', title: 'Put a bed in a home', body: 'Fund a Stretch Bed and follow where it goes. The simplest way to be part of the work, one family at a time.' },
        { who: 'Funders', title: 'Move the making to Country', body: 'Back the containerised plant and the community-ownership transfer. This is where scale and lasting jobs come from.' },
        { who: 'Partners', title: 'Build it with your community', body: 'Bring the making to your homelands. Community leads, Goods supports, and the work becomes yours to own.' },
      ],
      link: { label: 'Read the wider story at goodsoncountry.com', href: 'https://www.goodsoncountry.com' },
    },
    {
      kind: 'portal',
      heading: 'This story is one piece of the project',
      sub: 'A few ways in. Each is a different way to learn the work or take part.',
      anchors: [
        { label: 'Where the beds have gone (map)', href: '/communities' },
        { label: 'How we got here (origin story)', href: '/story' },
        { label: 'The model and impact', href: '/impact' },
        { label: 'The Stretch Bed', href: '/shop/stretch-bed-single' },
        { label: 'The washing machine (register interest)', href: '/shop/washing-machine' },
        { label: 'Talk to us', href: '/contact' },
      ],
    },
  ],
};

export const tripStories: TripStory[] = [utopia];

export function getTripStory(slug: string): TripStory | undefined {
  return tripStories.find((s) => s.slug === slug);
}
