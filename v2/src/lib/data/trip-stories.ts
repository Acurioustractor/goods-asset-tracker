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
  /**
   * Optional tag query for live hero/overlay video from EL. When set, the
   * server resolver fetches the first matching video tagged
   * placement:overlay-fullscreen (and is_public=true in public mode) and
   * populates videoDesktop/videoMobile/image at request time. The declared
   * fields above act as a fallback if no EL match is found.
   */
  fromTag?: { all?: string[]; any?: string[] };
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
    }
  // ─── Atom blocks ────────────────────────────────────────────────────
  // Repeatable building blocks. Each pulls from a canonical source in
  // story-atoms.ts (or products.ts) so every field-notes story stays in
  // sync without duplicating copy.
  | (WithLinks & {
      /** Pulls goodsBedStats from story-atoms.ts (sourced from products.ts). */
      kind: 'goods-facts';
      lead?: string;
    })
  | (WithLinks & {
      /** Pulls a named health framing from story-atoms.ts. e.g. focus='rhd-prevention'. */
      kind: 'health-facts';
      focus: string;
    })
  | (WithLinks & {
      /** Pulls problemStatement from story-atoms.ts. Set the universal Goods framing. */
      kind: 'problem-statement';
    })
  | (WithLinks & {
      /** Pulls productionPlantFacts from story-atoms.ts. */
      kind: 'production-plant-facts';
    })
  | (WithLinks & {
      /**
       * Live map of bed deployments. Currently renders communityLocations
       * (manually-curated; we keep it updated as deployments land). Phase 2
       * will switch this to a server-fetched live Supabase query at
       * request time so counts are always exact.
       */
      kind: 'live-map';
      heading?: string;
      intro?: string;
      caveat?: string;
      scope?: { community?: string };
    })
  | (WithLinks & {
      /**
       * Photo gallery sourced live from Empathy Ledger. Server resolver in
       * /lib/field-notes/resolve-gallery.ts walks blocks before render,
       * fetches stories matching `tagQuery`, and populates `items`. The
       * renderer just maps items → figures. In internal/admin mode every
       * matching photo shows; in public mode only is_public=true photos.
       */
      kind: 'el-gallery';
      heading?: string;
      sub?: string;
      /** Tag-set query. `all` = AND, `any` = OR. Typical: { all: ['event:alice-build'] } */
      tagQuery: { all?: string[]; any?: string[] };
      /** Optional limit. Defaults to 24 in the resolver. */
      limit?: number;
      /** Populated by the server resolver — do not set in source data. */
      items?: { id: string; src: string; alt?: string; caption?: string; isPublic: boolean }[];
    })
  | (WithLinks & {
      /**
       * Video gallery sourced live from EL. Same shape as el-gallery but
       * filters to videos (media-type:video tag) and renders <video>
       * elements with the EL story_image_url as poster and media_url as
       * src. Auto-extracted by scripts/upload-videos.mjs.
       */
      kind: 'el-video-gallery';
      heading?: string;
      sub?: string;
      tagQuery: { all?: string[]; any?: string[] };
      limit?: number;
      items?: {
        id: string;
        title: string;
        caption?: string;
        poster: string;
        src: string;
        durationSeconds?: number;
        isPublic: boolean;
      }[];
    });

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
      // Hero auto-pulls the first matching overlay-fullscreen video tagged
      // for this trip. Falls back to the declared image + stub video paths
      // if no EL match exists yet. Upload via /admin/videos/new with
      // use:atmosphere or use:establishing + placement:overlay-fullscreen.
      media: {
        image: `${IMG}/04-build.jpg`,
        videoDesktop: `${VID}/alice-youth-desktop.mp4`,
        videoMobile: `${VID}/alice-youth-mobile.mp4`,
        fromTag: { all: ['trip:may-2026'] },
      },
    },
    // Arrernte welcome — the way the trip was opened. Verified phrase from
    // the handoff; speaker and language to be confirmed before public use.
    {
      kind: 'bleedquote',
      text: '"Come down and make your apmere."',
      media: { image: `${IMG}/02-arrive.jpg` },
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
      links: [
        { label: 'See the Stretch Bed', href: '/shop/stretch-bed-single' },
        { label: 'How Goods began', href: '/story' },
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
    // Gallery: 120 build photos uploaded to EL as gallery-photo with
    // tags event:alice-build + trip:may-2026. In admin preview every
    // photo shows (so you can curate); on public field-notes only
    // is_public=true photos render. Limit 24 keeps the grid digestible.
    {
      kind: 'el-gallery',
      heading: 'The build, in pictures',
      sub: 'Two and a half days in the Alice shed. Curate via /admin/photos — flip "Approve public" on the keepers and they appear on the public field-notes automatically.',
      tagQuery: { all: ['event:alice-build', 'trip:may-2026'] },
      limit: 24,
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
    // Atom: bed facts. Sourced from products.ts via story-atoms.ts so the
    // numbers stay correct everywhere if specs ever change.
    {
      kind: 'goods-facts',
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
      links: [
        { label: 'Utopia Homelands', href: '/communities/utopia-homelands' },
      ],
    },
    {
      kind: 'immersive',
      actmark: 'Act three · Utopia',
      title: 'The beds go to the homes',
      standfirst:
        'A community close by wanted beds too, more of them. We did not plan that leg. They did. We drove where we were pointed, and we unloaded.',
      media: { image: `${IMG}/06-delivery.jpg` },
      links: [
        { label: 'Where the beds have gone', href: '/communities' },
      ],
    },
    // Atom: health framing. Sourced from story-atoms.ts. Swap focus to
    // 'sleep-and-skin' or 'washing-machine-cycle' for a different angle.
    {
      kind: 'health-facts',
      focus: 'rhd-prevention',
      links: [
        { label: 'The washing machine', href: '/shop/washing-machine' },
        { label: 'The wider model', href: '/story' },
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
      kind: 'read',
      tag: 'Ampilatwatja',
      heading: 'Four beds, two Elders, one quiet morning',
      paragraphs: [
        'Ampilatwatja is an outstation on Alyawarr country, north-east of Utopia. The two senior men we sat with are recognised by the country and, this year, by the Order of Australia. Their identities will be added here only once they have confirmed how they would like to be named.',
        'Four beds for the two households between them. The unloading took longer than the assembly. The yarning took longer still. The clip we kept is the part where one of the old men, having tested the surface himself, simply nodded.',
      ],
      pulls: [
        {
          quote: '"That nod was the whole trip in one second."',
          src: 'Goods on Country team note · 21 May 2026',
        },
      ],
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
    // Live video gallery — pulls anything from EL tagged `trip:may-2026`
    // with media-type:video. Drop a folder of well-named MP4s into
    // upload-videos.mjs and they appear here once the upload completes.
    // Block hides itself if nothing matches yet.
    {
      kind: 'el-video-gallery',
      heading: 'More clips from the trip',
      sub: 'Videos uploaded to Empathy Ledger with trip:may-2026 appear here automatically. Use /admin/photos to filter videos + flip "Approve public" to surface them on the public page.',
      tagQuery: { all: ['trip:may-2026'] },
      limit: 6,
    },
    {
      kind: 'read',
      tag: 'The model',
      heading: 'The point is to hand it over',
      paragraphs: [
        'Goods on Country is an enterprise, not a giveaway. Beds, and the washing machine named Pakkimjalki Kari by Elder Dianne Stokes in Warumungu, come out of years of community co-design. A containerised plant can shred and press recycled plastic into bed legs at around 30 beds a week, and that plant can move to a community and be owned there.',
        'That is the part Mykel pointed at without knowing it. Alice and Utopia are live candidates for the next place the making happens, not just the next place the beds arrive. The job is to make the making local, and then to become unnecessary.',
      ],
      links: [
        { label: 'The model in full', href: '/story' },
        { label: 'Pakkimjalki Kari (washing machine)', href: '/shop/washing-machine' },
        { label: 'Partner with us', href: '/contact' },
      ],
    },
    // Atom: live map. Pulls from communityLocations (canonical, includes
    // Utopia: 96, Ampilatwatja: 4 as of May 2026). Phase 2 swaps for a
    // server-fetched count from the assets register at request time.
    {
      kind: 'live-map',
      caveat:
        'Utopia also carries a separate 107-bed pathway approved with the Centrecorp Foundation, not yet counted as delivered.',
      links: [
        { label: 'Browse all communities', href: '/communities' },
        { label: 'Utopia Homelands', href: '/communities/utopia-homelands' },
      ],
    },
    { kind: 'close', title: 'This is the first thing he built. It is not the last we will build together.', media: { image: `${IMG}/11-close.jpg` } },
    {
      kind: 'pathways',
      heading: 'Three ways to be part of it',
      sub: 'One piece of work, three ways in.',
      cards: [
        {
          who: 'Supporters',
          title: 'Put a bed in a home',
          body: 'Buy a Stretch Bed at $560 institutional / $600 retail. One bed reaches one family on country. We tell you where it landed.',
        },
        {
          who: 'Funders',
          title: 'Move the making to country',
          body: 'Back the containerised plant and the community-ownership transfer. Production is roughly 85% complete; the next round closes the gap and seeds local jobs.',
        },
        {
          who: 'Partners',
          title: 'Build it with your community',
          body: 'Bring the making to your homelands. Community leads, Goods supports, and the assets stay where they belong.',
        },
      ],
      link: { label: 'Read the wider story', href: '/story' },
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
