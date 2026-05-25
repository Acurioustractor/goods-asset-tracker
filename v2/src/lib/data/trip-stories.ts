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
  /**
   * Editorial photo fallback for the section. Shown when no video
   * resolves OR when the video fails to load. The swap-photo UI writes
   * here. Never used as the live video's poster — the resolver populates
   * `poster` separately so a pinned photo doesn't flash before video play.
   */
  image: string;
  /**
   * Optional looping background video. Populated either statically here
   * or by the server resolver from EL via `fromTag`. If present and
   * playable, this is what the reader sees; the photo above stays hidden.
   */
  videoDesktop?: string;
  videoMobile?: string;
  /**
   * Optional video poster. Populated by the server resolver from the
   * matching EL story's `story_image_url`. Used for the <video> element's
   * `poster` attribute so the first frame shown matches the video, not
   * the user's pinned fallback photo. Falls back to `image` if unset.
   */
  poster?: string;
  /**
   * Optional tag query for live hero/overlay video from EL. When set, the
   * server resolver fetches the first matching video and populates
   * videoDesktop/videoMobile/poster at request time. The `image` field
   * stays untouched so the user-pinned photo remains as a true fallback
   * for the no-video case.
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
      /**
       * Optional background. When set, the prose sits over a dimmed
       * looping video/still. Use sparingly — the read block is the place
       * where the reader slows down to take in text; motion should
       * support, not compete. Best for sections about a named person:
       * the b-roll loops silently behind their story.
       */
      media?: MediaRef;
      /**
       * Optional partner credit shown above the read body. Renders a
       * small logo, the partner name, and an outbound link to their site.
       * Use when a section explicitly tells the story of a partnership
       * (e.g. Oonchiumpa under the Alice build).
       */
      partner?: {
        name: string;
        logo: string;
        url: string;
        kicker?: string;
      };
    })
  | (WithLinks & {
      kind: 'immersive';
      actmark?: string;
      title: string;
      standfirst?: string;
      media: MediaRef;
      /**
       * Optional mobile layout override. Default is overlay (image as
       * full-bleed background, text overlaid). Use 'stacked' when the
       * image is a wide composition where centre-crop on a phone-narrow
       * viewport would lose the subjects (e.g. two figures spread across
       * the frame). The stacked variant renders the image at its natural
       * aspect ratio at the top and drops the text into a clean editorial
       * block below, so the text never floats on black padding.
       */
      mobileLayout?: 'overlay' | 'stacked';
    })
  | (WithLinks & { kind: 'bleedquote'; text: string; media: MediaRef })
  | (WithLinks & {
      /**
       * Solo pull quote in giant type, no media chrome. For quiet beats
       * between sections — when a single sentence deserves to sit alone.
       */
      kind: 'pullquote';
      kicker?: string;
      quote: string;
      attribution?: string;
    })
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
      /**
       * Captioned static image. Use for reference graphics that aren't
       * live data (region maps, diagrams). The image is local under
       * /public; not pulled from EL. Caption + credit sit below the
       * figure.
       */
      kind: 'figure';
      heading?: string;
      intro?: string;
      image: string;
      alt: string;
      caption?: string;
      credit?: string;
    })
  | (WithLinks & {
      /**
       * Side-by-side before/after pair. The change is the point. On
       * desktop the two images sit at equal width; on narrow screens
       * they stack with the labels above each frame. Use sparingly —
       * one well-chosen pair is worth a dozen.
       */
      kind: 'before-after-split';
      heading?: string;
      intro?: string;
      before: { image: string; alt: string; label: string; caption?: string };
      after: { image: string; alt: string; label: string; caption?: string };
      credit?: string;
    })
  | (WithLinks & {
      kind: 'pathways';
      heading: string;
      sub?: string;
      cards: { who: string; title: string; body: string }[];
      link?: { label: string; href: string };
    })
  | (WithLinks & { kind: 'close'; title: string; media: MediaRef })
  | (WithLinks & {
      /**
       * Full-bleed photo-led beat. Like an immersive block but for a
       * single still image with a quote or title overlaid on a dark
       * scrim so the words are readable. Use for portrait + quote
       * pairs (Dorrie, Charley voice-card scenarios) where a person's
       * words deserve the full screen alongside their picture, but a
       * cinema video is not the right format.
       */
      kind: 'hero-photo';
      actmark?: string;
      title?: string;
      quote?: string;
      attribution?: string;
      sub?: string;
      media: MediaRef;
    })
  | (WithLinks & {
      /**
       * Standalone partner thank-you card. Use BETWEEN blocks to credit
       * a partner whose support unlocks the section the reader just
       * finished (e.g. Centrecorp under the Alice build). Renders a
       * small logo, the partner name, an optional sentence, and a link
       * to the partner page for the longer story.
       */
      kind: 'partner-credit';
      kicker?: string;
      name: string;
      logo: string;
      url: string;
      body?: string;
      cta?: string;
      /**
       * Optional headline metrics for the partner. Renders as a small
       * two-column row beside or above the body text, depending on width.
       * Keep to ~2 numbers — the credit is editorial, not a dashboard.
       */
      metrics?: { value: string; label: string }[];
    })
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
       * Live map of bed deployments. The server resolver
       * (resolveLiveMapCounts) walks blocks before render, queries the
       * `assets` table for deployed + allocated counts grouped by
       * community, merges them onto the static communityLocations entries
       * and populates `locations` below. The renderer prefers `locations`
       * when present and falls back to the static array if the resolver
       * has not run.
       */
      kind: 'live-map';
      heading?: string;
      intro?: string;
      caveat?: string;
      scope?: { community?: string };
      /** Populated by the server resolver — do not set in source data. */
      locations?: {
        id: string;
        name: string;
        region: string;
        lat: number;
        lng: number;
        storytellerCount: number;
        bedsDelivered: number;
        description: string;
        highlight: string;
        tooltipDirection?: 'left' | 'right' | 'top' | 'bottom';
      }[];
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
       * Hand-picked gallery. The author lists EL story IDs (or the swap
       * UI does, via the `+ add photo` widget) and only those photos
       * render. Use this when an auto tag-query pulls too much or too
       * little, and editorial wants precise control over the photo set
       * and their order.
       */
      kind: 'manual-gallery';
      heading?: string;
      sub?: string;
      /**
       * Comma-separated EL story IDs. Set via the override system
       * (key: `{blockIndex}._photoIds`) so it can be edited at runtime
       * by the in-page picker without touching source code.
       */
      _photoIds?: string;
      /** Populated by the server resolver. */
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
      /**
       * Render mode:
       *  - 'cinema' (default) — foregrounded <video controls>, click to play.
       *  - 'overlay' — full-bleed background video, autoplay+muted+loop, with
       *    heading/sub overlaid. Limit:1 always; first video wins.
       */
      as?: 'cinema' | 'overlay';
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
        orientation?: 'landscape' | 'portrait' | 'square';
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
  /**
   * Soft-launch flag. When true, the URL is accessible to anonymous
   * viewers (so a link can be shared with reviewers) but the story is
   * still excluded from every listing surface (field-notes index,
   * marketing tile, community/storyteller cross-links, other-field-notes
   * portal) and is noindex/nofollow for search engines. Use together
   * with `published: false` while a story is in review.
   */
  unlisted?: boolean;
  blocks: TripBlock[];
}

const IMG = '/images/stories/utopia';

const utopia: TripStory = {
  slug: 'utopia-may-2026',
  title: 'From Alice Springs to Utopia',
  summary:
    'Three days across Alice Springs, Utopia, Arawerr and Ampilatwatja. Young people built beds in Alice with Oonchiumpa. Local teams led the deliveries out to the homelands. We sat with Elders. 107 beds, materials from Centrecorp Foundation.',
  dateline: 'Alice Springs · Utopia Homelands · Arawerr · Ampilatwatja, NT · 20–22 May 2026',
  published: false,
  unlisted: true,
  blocks: [
    {
      kind: 'masthead',
      kicker: 'Field notes · 21–22 May 2026',
      // Meaning-first opening. The previous version (built by hands
      // that would sleep on them) framed only the young builders; this
      // wider arc names both ends of the trip — the makers and the
      // households who asked for the beds — and the partners who held
      // the whole exchange. Frankie's quote sits later in its proper
      // place inside the Ampilatwatja act.
      title: 'Three days: Alice Springs to Utopia Homelands',
      standfirst:
        'Young people in Alice Springs spent two days building Stretch Beds with Oonchiumpa. The next morning we drove out to the Utopia homelands. Households we had not met asked for two or three beds each. Centrecorp Foundation paid for the materials.',
      dateline:
        'Alice Springs and Utopia Homelands, Northern Territory · 21–22 May 2026',
      // Hero is the bed-drop at the homes (use:hero) — the central act
      // of the trip, not the sunrise. The sunrise still anchors the close.
      // Falls back to the declared image if no EL match yet.
      media: {
        image: `${IMG}/04-build.jpg`,
        fromTag: { all: ['trip:may-2026', 'use:hero', 'placement:overlay-fullscreen'] },
      },
    },
    // (Apmere is no longer the masthead — it now sits in the closing
    // language note. Frankie's line carries the front door.)
    {
      kind: 'read',
      tag: 'Act one · with Oonchiumpa',
      heading: 'How the build worked',
      paragraphs: [
        'Two days out the back of the Oonchiumpa office in Alice Springs. Young men and young women, supported by Oonchiumpa workers, built [Stretch Beds](/shop/stretch-bed-single) from flat-pack. Every young person who built one kept one for themselves. The rest got loaded into the truck for the run out to the Utopia homelands the next morning.',
        'Centrecorp Foundation paid for the materials. Oonchiumpa held the program: who got picked up each morning, what the room felt like, which households the rest of the beds would go to. The young people did the building. Oonchiumpa chose where the rest went and we drove the truck out.',
        'Two galvanised steel poles thread through sleeves in heavy-duty Australian canvas. Four legs, pressed from recycled HDPE that communities collect, click onto the poles. The whole thing weighs 26kg, holds 200kg, and assembles in about five minutes with no tools. It replaces a thin mattress on a concrete floor, or a door taken off its hinges and laid flat.',
        'More than 400 Stretch Beds have gone into homes across the country since 2023. This trip added 107. Most went to households across the Utopia homelands. Four went to two senior Alyawarr brothers at Ampilatwatja.',
      ],
    },
    // Thank-you to Centrecorp Foundation, the partner who funded the
    // materials for the Alice build. Links into the existing Centrecorp
    // partner page where their wider story sits.
    {
      kind: 'partner-credit',
      kicker: 'With support from',
      name: 'Centrecorp Foundation',
      logo: '/images/partners/centrecorp-foundation.jpg',
      url: '/partners/centrecorp',
      body: 'Centrecorp paid for the materials for this build, the ones the young people in Alice put together and the local team delivered to Utopia. They also funded the first batch of beds we delivered to Utopia in October 2025. They are an Aboriginal Trust based in the Northern Territory.',
      cta: 'Read the story of the first Utopia delivery, October 2025',
      metrics: [
        { value: '107', label: 'beds delivered to Utopia Homelands on this trip' },
      ],
    },
    // Overlay clip: the boys building. Full-bleed background video with text
    // overlay — atmospheric, not a "click play and watch". Auto-pulls via
    // cohort:boys tag on the assembly video.
    {
      kind: 'el-video-gallery',
      as: 'overlay',
      heading: 'The boys, building',
      sub: 'Alice Springs · 20 May 2026. Young men supported by Oonchiumpa, making the beds they will sleep on.',
      tagQuery: { all: ['cohort:boys', 'use:assembly', 'event:alice-build'] },
      limit: 1,
    },
    // Who Oonchiumpa is + why this trip ran the way it did. Sits between
    // the two cohort clips so the boys video introduces it and the girls
    // video closes it.
    {
      kind: 'read',
      tag: 'Oonchiumpa',
      heading: 'The program behind the build',
      partner: {
        name: 'Oonchiumpa Consultancy & Services',
        logo: '/images/partners/oonchiumpa.png',
        url: 'https://www.oonchiumpa.com.au/',
        kicker: 'In partnership with',
      },
      paragraphs: [
        'Oonchiumpa is an Aboriginal-led organisation working with young people across Central Australia. Kristy Bloomfield runs it. Her mother Karen Liddle is a Traditional Owner. The program is built around young people working through hard stuff, supported by older community members from their own families.',
        'For this trip Oonchiumpa ran the build in Alice Springs and chose where the beds went in the homelands. Centrecorp Foundation paid for the materials. We turned up with tools and a truck. Every young person who built a bed kept one for themselves. That was the agreement before the first leg got clicked on.',
        'The bit usually missing from a remote delivery story is the program behind the door. Without Oonchiumpa this trip is a truck and a stranger.',
      ],
      pulls: [
        {
          quote: '"I had a yarn with the girls one day. Said you got to get out and start your own business. That\'s how we started Oonchiumpa."',
          src: 'Karen Liddle · Traditional Owner, mother of Kristy · consent pending',
        },
      ],
      links: [
        { label: 'How Goods began', href: '/story' },
      ],
    },
    // Karen on the bed: cinema clip with sound. A community member's
    // voice between the Oonchiumpa partnership intro and the girls
    // building overlay — bridges "who held the work" to "who received
    // it" before the second cohort builds.
    {
      kind: 'el-video-gallery',
      heading: 'Karen Liddle. Traditional Owner. Mother of Kristy Bloomfield, who leads Oonchiumpa.',
      sub:
        'Arrernte and Alyawarre. Arrernte on her father\'s side, Alyawarre on her mother\'s. The bed she is sitting on was made by a young person in Alice Springs through her daughter\'s Oonchiumpa program. Utopia Homelands · May 2026.',
      tagQuery: { all: ['participant:karen', 'subject:on-bed'] },
      limit: 1,
    },
    // Overlay clip: the girls building. Same shape as the boys clip —
    // full-bleed background video with text overlay so the two cohorts are
    // given equal editorial weight.
    {
      kind: 'el-video-gallery',
      as: 'overlay',
      heading: 'The girls, building',
      sub: 'Alice Springs · 19–20 May 2026. Young women supported by Oonchiumpa, building their own beds.',
      tagQuery: { all: ['cohort:girls', 'use:assembly', 'event:alice-build'] },
      limit: 1,
    },
    // Hand-picked Alice build gallery. The auto-populated 122-photo
    // gallery was too much; this is the curated set. Use the in-page
    // "+ add photo" pill in internal preview to pin specific shots from
    // EL.
    {
      kind: 'manual-gallery',
      heading: 'The build, in pictures',
      sub: 'Two days out the back of the Oonchiumpa office in Alice Springs.',
    },
    {
      kind: 'read',
      tag: 'Mykel',
      heading: '"Never would\'ve thought it would\'ve come out like that"',
      paragraphs: [
        "One of the builders was Mykel. He turned the finished bed over in his hands like he wasn't sure it was real, then explained it was made from bottle lids shredded and pressed into something strong enough to stand on. He built the bed he slept on that night and kept going. Seven beds by the end of the second day.",
        'Fred is Mykel\'s Oonchiumpa support worker. He watched him work and called him grandson. Then he said: "That could be a good employment for yourself too, grandson. Later on." We asked Mykel whether he would come and make beds every day if the making moved closer to home.',
      ],
      pulls: [
        { quote: '"Comfortable as. Smooth, tight, hard, fancy."', src: 'Mykel · consent pending' },
      ],
      // B-roll of Mykel during the Utopia delivery loops silently behind
      // this section. The text still does the work; the motion gives it
      // a face. His on-camera voice clip arrives at the cinema beat right
      // after this read block.
      media: {
        image: `${IMG}/04-build.jpg`,
        fromTag: { all: ['participant:mykel', 'use:b-roll', 'placement:under-text'] },
      },
    },
    // Mykel on camera, in his own voice. Auto-pulls from EL by tag — the
    // moment a video tagged use:voice + participant:mykel lands with
    // is_public=true, this slot fills cinematic full-bleed. Single match
    // triggers the cinema layout automatically.
    {
      kind: 'el-video-gallery',
      heading: 'Mykel, in his own voice',
      sub: "Captured at Mykel's house, putting the bed together with him.",
      tagQuery: { all: ['use:voice', 'participant:mykel'] },
      limit: 1,
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
    // Quiet beat between Mykel and the road. Now a hero-photo: Mykel's
    // line sits over a real photo (resolver auto-pulls participant:mykel
    // + format:photo). Swap pill lets the editor pick any photo or
    // video for the background, same as Dorrie's beat.
    {
      kind: 'hero-photo',
      actmark: 'Mykel · Alice Springs · 21 May 2026',
      quote: '"Yeah, I’ll be rocking up every day to make them."',
      attribution: 'Mykel · consent pending',
      media: {
        image: `${IMG}/04-build.jpg`,
        fromTag: { all: ['participant:mykel', 'format:photo'] },
      },
    },
    {
      kind: 'immersive',
      actmark: 'Act two · the road',
      title: 'From town to the homelands',
      standfirst:
        'Oonchiumpa led the way. We followed onto Anmatyerr and Alyawarr Country.',
      media: {
        // Targets the driving-drone clip: aerial of the truck on the
        // Sandover road out to the homelands. Tag your driving drone
        // video in EL with `use:driving-drone` to auto-resolve here,
        // or pin via the swap pill in internal preview.
        image: `${IMG}/01-hero.jpg`,
        fromTag: { all: ['trip:may-2026', 'use:driving-drone', 'placement:overlay-fullscreen'] },
      },
      links: [
        { label: 'Utopia Homelands', href: '/communities/utopia-homelands' },
      ],
    },
    // Names the two Oonchiumpa support workers who held the trip in
    // Utopia, and the local council / community workers they unlocked
    // access to. Without this block, the next thing the reader sees is
    // the region map followed by beds appearing at houses — the people
    // who got us through the gate vanish. They shouldn't.
    {
      kind: 'read',
      tag: 'Act two · the connectors',
      heading: 'Fred and Decon got us through the door',
      paragraphs: [
        'Fred and Decon are Oonchiumpa support workers. They drove ahead of us into the homelands, made the introductions, and sat in the council conversations that worked out which households were waiting on a bed. We arrived in Utopia with a truck full of materials and no relationships of our own. Fred and Decon lent us theirs.',
        'At Urapuntja the local workers and council staff took over. They told us which families had asked and where to drive next. They chose the doors. Our job was to keep up.',
        'A delivery story usually skips this bit. The truck arrives, the beds go in, the photos look good. None of it happens without the people who already know the place and are willing to spend a day pointing visitors at the right house.',
      ],
      links: [
        { label: 'Utopia Homelands', href: '/communities/utopia-homelands' },
      ],
    },
    // Region map — Urapuntja (Utopia) and Ampilatwatja homelands. Set the
    // geography before the homes start arriving in the narrative, so the
    // outstation names (Arawerr / Soapy Bore, Ampilatwatja, etc.) have a
    // place on the page. Source: Geoscience Australia base data, 2024.
    {
      kind: 'figure',
      heading: 'Where we were',
      intro:
        'Urapuntja (Utopia) and Ampilatwatja sit on Anmatyerr and Alyawarr Country, north-east of Mparntwe (Alice Springs). Both are made up of many small homelands rather than one township. The names you will see in this story (Arawerr / Soapy Bore, Ampilatwatja) are outstations within that wider Country.',
      image: `${IMG}/region-map.png`,
      alt: 'Map of the Urapuntja and Ampilatwatja homelands across the Sandover region of the Northern Territory, showing dozens of outstations including Arawerr (Soapy Bore), Atneltyey, Arlparra, Tommyhawk Swamp, Camel Camp, Atartinga Station, Mulga Bore (Akaye), Indaringinya (Antarrengeny), Inkawenyerre (Rocket Range), Amengernterneah (Urapuntja Health Service), Atheley, Atnwengerrpe (Ammaroo), Welere (Derry Downs) and Ampilatwatja at the north-east corner.',
      caption:
        'Urapuntja and Ampilatwatja communities, Northern Territory. The Sandover Highway threads through the homelands; most outstations sit on dirt off the bitumen.',
      credit: 'Base data © Geoscience Australia 2024',
    },
    {
      kind: 'immersive',
      actmark: 'Act three · Arlparra',
      title: 'The beds go to the homes',
      standfirst:
        'Arlparra was where most of the beds landed, and where we slept. The local friends we met there led the deliveries. We followed people who knew which house was which.',
      media: { image: `${IMG}/06-delivery.jpg` },
      links: [
        { label: 'Where the beds have gone', href: '/communities' },
      ],
    },
    // Overlay (no-sound, full-bleed, autoplay-loop) of the bed-build
    // timelapse — the assembly of a bed in community condensed. Tag the
    // timelapse video in EL with `use:bed-build-timelapse` to auto-resolve.
    {
      kind: 'el-video-gallery',
      as: 'overlay',
      heading: 'A bed, in the time it takes to drink a cup of tea',
      sub: 'Arlparra · 22 May 2026. The build of a Stretch Bed, in community.',
      tagQuery: { all: ['use:bed-build-timelapse', 'community:utopia-homelands'] },
      limit: 1,
    },
    // Charley · cinema clip (with controls + sound). Pulls the newer
    // Charley Utpoia.mp4 via its placement:overlay-fullscreen tag
    // (the older Charley file is placement:gallery, so only the new
    // upload matches this query).
    {
      kind: 'el-video-gallery',
      heading: 'Charley',
      sub: 'Arlparra · 22 May 2026.',
      tagQuery: { all: ['participant:charley', 'placement:overlay-fullscreen'] },
      limit: 1,
    },
    // Dorrie Jones beat. Hero photo with her quote overlaid on a dark
    // scrim. Resolver auto-pulls her portrait via the tag query — any
    // EL image tagged participant:dorrie-jones + use:portrait works.
    {
      kind: 'hero-photo',
      title: 'Dorrie Jones',
      sub: 'Arlparra · 22 May 2026',
      quote: '"Good for me and comfy… easy to put together."',
      attribution: 'Dorrie Jones · consent pending',
      media: {
        image: `${IMG}/07-elders.jpg`,
        fromTag: { all: ['participant:dorrie-jones', 'use:portrait', 'format:photo'] },
      },
    },
    // Hand-picked Arlparra gallery. The auto-populated tag query pulled
    // in too many photos; this is the curated set. Use the in-page
    // `+ add photo` pill in internal preview to add photos one at a
    // time from the EL admin.
    {
      kind: 'manual-gallery',
      heading: 'Arlparra, in pictures',
      sub: 'Hand-picked from the delivery day.',
    },
    // The actual method of the day: house-to-house, local team in front,
    // photos exchanged both ways. This is the bit that turns "we delivered
    // beds" into "we worked with a community."
    {
      kind: 'read',
      tag: 'Arlparra · the method',
      heading: 'House to house, with the local team in front',
      paragraphs: [
        'Arlparra is the central outstation of the Urapuntja homelands: health service, council, the airstrip up the road. It was where we slept and where most of the beds landed. The local crew Fred and Decon walked us into became the team for the day. Every door we knocked on already knew we were coming.',
        "We went house to house and asked the same question each time: how many beds do you want? Some answered one, most answered two or three. We put them together on the spot, local fullas and us side by side, around five minutes a bed, no tools, on the verandah or just inside the door. While we worked, households told us what they were sleeping on now and what they needed next. We wrote it down.",
        'At every house we asked twice for photos. One set went back to the family, so community has its own pictures of its own days. The other we kept, to show what a bed can change.',
      ],
      links: [
        { label: 'Utopia Homelands', href: '/communities/utopia-homelands' },
        { label: 'See the Stretch Bed', href: '/shop/stretch-bed-single' },
      ],
    },
    { kind: 'bleedquote', text: 'Plastic collected on Country becomes the legs on these beds.', media: { image: `${IMG}/05-waste.jpg` } },
    // Act four · Arawerr (Soapy Bore). Same morning as Utopia, the next
    // outstation south on the map. The Soapy Boar video loops behind the
    // immersive title as the establishing overlay.
    {
      kind: 'immersive',
      actmark: 'Act four · Arawerr (Soapy Bore)',
      title: 'Two or three for every house',
      standfirst:
        'At Arawerr each household asked for two or three. The second-community visit was the Urapuntja team\'s call, not ours. We followed.',
      media: {
        image: `${IMG}/06-delivery.jpg`,
        fromTag: { all: ['community:arawerr', 'use:atmosphere', 'placement:overlay-fullscreen'] },
      },
      links: [
        { label: 'Where the beds have gone', href: '/communities' },
      ],
    },
    {
      kind: 'read',
      tag: 'Arawerr',
      heading: 'What people were already sleeping on',
      paragraphs: [
        'Arawerr (Soapy Bore) sits just south of Utopia on the Sandover. The community came out to meet us, household by household, and the request was the same at most doors: two or three beds. Nobody asked for just one.',
        'Walking through the yards we saw what people were already sleeping on: car trays balanced on bricks, mattresses on stacks of tyres, foam pads on plywood. Every household had improvised. Once they had seen a Stretch Bed assembled and tested, every household wanted one.',
        'While we worked, kids flew the drone above the camp. We stumbled into a 2-year-old\'s birthday, mid-celebration, and were asked to photograph the birthday girl. Those photos went back to the family.',
        'Back to camp, up before light, on to Ampilatwatja.',
      ],
    },
    // Hand-picked Arawerr (Soapy Bore) gallery. Use the in-page
    // `+ add photo` pill in internal preview to pin specific shots from
    // the EL admin.
    {
      kind: 'manual-gallery',
      heading: 'Arawerr, in pictures',
      sub: 'Hand-picked from Soapy Bore.',
    },
    // Atom: health framing. Sits between Arawerr and Ampilatwatja — the
    // editorial breath between the warmth of the visits and the gravity
    // of sitting with senior men recognised by the country.
    {
      kind: 'health-facts',
      focus: 'rhd-prevention',
      links: [
        { label: 'The washing machine', href: '/shop/washing-machine' },
        { label: 'The wider model', href: '/story' },
      ],
    },
    // Before / after. The single visual that makes the case faster than
    // any sentence: a person sleeping on the ground, and the same person
    // on a bed. Placeholder paths point at existing stills under
    // /public/images/stories/utopia/ — swap to the actual pair via the
    // MediaSwapZone on admin preview, or by editing the paths below.
    {
      kind: 'before-after-split',
      heading: 'Before, and after',
      intro:
        'A floor mattress and a Stretch Bed, in the same room, on the same morning.',
      before: {
        image: `${IMG}/09-offground.jpg`,
        alt: 'A household member sleeping on the ground.',
        label: 'Before',
      },
      after: {
        image: `${IMG}/08-beforeafter.jpg`,
        alt: 'The same household member on a Stretch Bed.',
        label: 'After',
      },
      credit: 'Goods on Country · 22 May 2026 · consent pending',
    },
    {
      kind: 'voices',
      heading: 'What people told us',
      sub:
        'Voices from this trip sit beside voices from the wider Goods story. Trip quotes are held as consent pending until confirmed with the speakers and Oonchiumpa.',
      // Trip-only voices: this card set is the record of voices captured
      // on the 21-22 May 2026 trip. Voices from other trips (Palm Island,
      // Tennant Creek, etc.) live in their respective field-notes — they
      // don't get hoisted into this story even if their quotes still
      // resonate. The story is a moment, not a greatest-hits.
      // ALL candidate quotes pulled from the trip transcripts (Katrina
      // and Karen Liddle) plus the three community paraphrases. Every
      // card is consent:pending until each speaker signs off. Edit /
      // prune in review; keep what lands, drop the rest. Frankie OAM,
      // Dorrie, Mykel and Karen each have dedicated sections elsewhere
      // on the page so their voices are not duplicated here.
      cards: [
        // ─── Karen Liddle (Traditional Owner, mother of Kristy) ─────
        {
          quote: '"We\'re silent achievers. We don\'t brag about what\'s going on and what we\'ve done."',
          who: 'Karen Liddle · Traditional Owner',
          community: 'Oonchiumpa',
          consent: 'pending',
        },
        {
          quote: '"To see kids\' faces with joy after making a bed, it just really hits you."',
          who: 'Karen Liddle · Traditional Owner',
          community: 'Oonchiumpa',
          consent: 'pending',
        },
        {
          quote: '"We\'ve been saying from the start: gotta teach these kids there\'s a better way of living. There\'s always a story behind a child."',
          who: 'Karen Liddle · Traditional Owner',
          community: 'Oonchiumpa',
          consent: 'pending',
        },
        {
          quote: '"I had a yarn with the girls one day. Said you got to get out and start your own business. That\'s how we started Oonchiumpa."',
          who: 'Karen Liddle · Traditional Owner',
          community: 'Oonchiumpa',
          consent: 'pending',
        },
        // ─── Katrina Bloomfield (Oonchiumpa worker) ─────────────────
        {
          quote: '"The girls tend to be shy. But once they get into doing things and being in control, they\'re capable of anything."',
          who: 'Katrina Bloomfield · Oonchiumpa worker',
          community: 'Alice Springs',
          consent: 'pending',
        },
        {
          quote: '"Most of our people in community are just on a blanket on the ground. These beds will come in handy. Mainly for the old elders. Getting up and down off the ground is very hard."',
          who: 'Katrina Bloomfield · Oonchiumpa worker',
          community: 'Alice Springs',
          consent: 'pending',
        },
        {
          quote: '"It\'s exciting to see kids when they get involved, knowing what they\'re going to make, and that eventually it could be yours. They\'re just so excited."',
          who: 'Katrina Bloomfield · Oonchiumpa worker',
          community: 'Alice Springs',
          consent: 'pending',
        },
        // ─── Community voices, captured-in-substance ────────────────
        // All paraphrased from what was actually said at the doors we
        // knocked on. Each card stays consent:pending until the real
        // speaker + verbatim wording + community-of-origin is confirmed
        // with Oonchiumpa.
        {
          quote: '"It\'s comfortable as."',
          who: 'Household member',
          community: 'Arlparra',
          consent: 'pending',
        },
        {
          quote: '"Two for our place. Three for the other one."',
          who: 'Household member',
          community: 'Arawerr (Soapy Bore)',
          consent: 'pending',
        },
        {
          quote: '"We\'ve been sleeping on a door."',
          who: 'Household member',
          community: 'Arlparra',
          consent: 'pending',
        },
        {
          quote: '"Bring one for next door too."',
          who: 'Household member',
          community: 'Arawerr (Soapy Bore)',
          consent: 'pending',
        },
        {
          quote: '"Off the ground. That\'s the main thing."',
          who: 'Elder',
          community: 'Arlparra',
          consent: 'pending',
        },
        {
          quote: '"Can we get one for the Nana?"',
          who: 'Family member',
          community: 'Arlparra',
          consent: 'pending',
        },
        {
          quote: '"How much weight does it take?"',
          who: 'Household member',
          community: 'Arawerr (Soapy Bore)',
          consent: 'pending',
        },
      ],
    },
    // Casey portrait carries the Ampilatwatja title card. Swap the
    // image in via the in-page picker once the portrait is uploaded to
    // EL with participant:casey-holmes + trip:may-2026 + format:photo.
    // Falls back to the wide two-brothers shot until then.
    {
      kind: 'immersive',
      actmark: 'Act five · Ampilatwatja',
      title: 'Sitting with Frankie Holmes OAM and Casey Holmes OAM',
      standfirst:
        "At Ampilatwatja we sat with Frankie Holmes OAM and Casey Holmes OAM, Alyawarr brothers, both Medal of the Order of Australia. Four beds went in. We made tea and let the camera run.",
      media: { image: `${IMG}/07-elders.jpg` },
      // Both brothers sit at opposite edges of the frame. Center-crop on
      // a phone-narrow viewport loses them both. Stack on mobile: image
      // at top in its natural landscape aspect, title and standfirst sit
      // cleanly below.
      mobileLayout: 'stacked',
    },
    {
      kind: 'read',
      tag: 'Ampilatwatja',
      heading: 'Frankie and Casey',
      paragraphs: [
        'Frankie Holmes and Casey Holmes are senior Alyawarr men. Both have been recognised with the Medal of the Order of Australia for decades of work for their community and their Country. They share a shed at Ampilatwatja.',
        'Four beds went in, for the two households between them. The unloading took longer than the assembly. The yarning took longer still. The clip we kept is the moment Frankie sat on a finished bed, tested the canvas with his hand, looked at his brother and nodded. Then he started talking.',
      ],
    },
    // Frankie's yarn — cinema centrepiece for the Ampilatwatja act.
    // Tagged participant:frankie-holmes; the clip auto-pulls.
    {
      kind: 'el-video-gallery',
      heading: 'Frankie, in his own voice',
      sub: 'Ampilatwatja, 22 May 2026. Frankie Holmes OAM, around the bed his brother had just finished testing. Held as consent:elder-pending until reviewed with him.',
      tagQuery: { all: ['community:ampilatwatja', 'participant:frankie-holmes'] },
      limit: 1,
    },
    // Casey on the bed — overlay video (full-bleed, autoplay-muted-loop).
    // Empty placeholder in internal mode until the on-bed clip is tagged
    // participant:casey-holmes + use:overlay + community:ampilatwatja.
    // Swap a different video into the slot via the in-page picker.
    {
      kind: 'el-video-gallery',
      as: 'overlay',
      heading: 'Casey, on the bed',
      sub: 'Ampilatwatja · 22 May 2026.',
      tagQuery: { all: ['participant:casey-holmes', 'use:overlay', 'community:ampilatwatja'] },
      limit: 1,
    },
    // Casey's voice slot removed: no voice clip was captured and Casey's
    // representation on this page is the silent on-bed overlay above plus
    // his portrait in the masthead. The reserved-slot placeholder was
    // rendering "Empty video slot · Tag query:..." debug text in internal
    // preview, which was leaking visually behind the section.
    // Photo gallery placeholder for Ampilatwatja.
    {
      kind: 'el-gallery',
      heading: 'Ampilatwatja, in pictures',
      sub: 'From the morning with Frankie and Casey.',
      tagQuery: { all: ['community:ampilatwatja', 'trip:may-2026'] },
      limit: 300,
    },
    // Trip wrap-up. Names Fred + Decon and the Oonchiumpa partnership
    // explicitly, then turns the page from "what we did this week" to
    // "what this trip points at." Pulls the thread from Mykel's question
    // in Act one through the brothers' morning in Act five into the
    // future of Goods as a community-led enterprise: collected plastic,
    // local production, local employment, better health outcomes.
    {
      kind: 'read',
      tag: 'What comes next',
      heading: 'What this trip points at',
      paragraphs: [
        "Three days, end to end. Beds at the homes that asked for them. Frankie's nod. Casey on the bed beside his brother. Mykel saying he would rock up every day to make them. None of it happens without Oonchiumpa, and none of the Utopia leg happens without Fred and Decon driving ahead, making introductions, and holding the room at the council so we could be useful when we arrived.",
        "Goods on Country is an enterprise. The [Stretch Bed](/shop/stretch-bed-single) and the washing machine [*Pakkimjalki Kari*](/shop/washing-machine), named in Warumungu by Elder Dianne Stokes, were designed in community with the Bloomfield family who run Oonchiumpa, over years. The next piece of the model is a containerised plant that can shred and press collected plastic into bed legs at around thirty beds a week. That plant can move to a community and be owned there.",
        "That is what Mykel was pointing at on the first morning when he asked about coming back every day. Alice and Utopia are both live candidates for where the making happens next. There is plenty of plastic on the ground waiting to be collected, and a steady cohort of young people coming through Oonchiumpa who want work. The household demand is already on the table.",
        "A bed off the ground cuts scabies and rheumatic heart disease, and means kids who slept enough to make it to school. Local production on top of that is income that stays in the community. The work, eventually, is to move the making to community ownership and then become unnecessary.",
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
        'Numbers come from the Goods QR-tagged asset register: each bed is scanned into its home and the count is updated live. Includes the 107-bed Centrecorp Foundation pathway delivered on this trip.',
      links: [
        { label: 'Browse all communities', href: '/communities' },
        { label: 'Utopia Homelands', href: '/communities/utopia-homelands' },
      ],
    },
    // Final take-home beat before the close. Pulled forward from the
    // voices card set so the take-home lands in a real community voice
    // rather than an invented framing line attributed to "Goods on Country".
    {
      kind: 'pullquote',
      kicker: 'Take-home',
      quote: '"Most of our people in community are just on a blanket on the ground. These beds will come in handy. Mainly for the old elders. Getting up and down off the ground is very hard."',
      attribution: 'Katrina Bloomfield · Oonchiumpa worker · Alice Springs · consent pending',
    },
    // Close pulls the Utopia sunset overlay (use:closing). Place-anchored
    // closing line — the trip ends on Country, not on a single person.
    {
      kind: 'close',
      title: 'Day three, sundown over the Sandover.',
      media: {
        image: `${IMG}/11-close.jpg`,
        fromTag: { all: ['trip:may-2026', 'use:closing', 'placement:overlay-fullscreen'] },
      },
    },
    {
      kind: 'pathways',
      heading: 'Three ways to be part of it',
      sub: 'One piece of work, three ways in.',
      cards: [
        {
          who: 'Supporters',
          title: 'Put a bed in a home',
          body: 'Buy a Stretch Bed at $560 institutional or $600 retail. We send a photo of where it landed.',
        },
        {
          who: 'Funders',
          title: 'Move the making to Country',
          body: 'Back the containerised plant and the move to community ownership. Production is around 85% complete. The next round closes the gap and starts local jobs.',
        },
        {
          who: 'Partners',
          title: 'Design and build it in your community',
          body: 'Bring the work to your homelands. The design happens in community with the people who will use it. Goods supports the build and the realising. The community runs and owns the plant.',
        },
      ],
      link: { label: 'Read the wider story', href: '/story' },
    },
    {
      kind: 'portal',
      heading: 'This story is one piece of the project',
      sub: 'A few ways in.',
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
