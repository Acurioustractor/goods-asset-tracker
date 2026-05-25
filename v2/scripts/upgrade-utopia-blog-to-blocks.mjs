#!/usr/bin/env node
// PATCH the Utopia blog story to add a rich block layout under
// media_metadata.blocks. The /stories/[id] route reads this and renders
// via the field-notes TripStory component instead of plain prose.

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL;
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY;
if (!EL_URL || !EL_KEY) {
  console.error('Missing EL env vars in .env.local');
  process.exit(1);
}

const STORY_ID = '55897065-526b-4c56-8fb7-8a2c3ace4993';

// Media URLs. All from the EL storage bucket the curator already pinned
// via the field-notes swap picker, plus two local Goods assets for the
// Elders shed photo and the closing sunset still.
const HERO_IMAGE = 'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/trip-may-2026/alice-build/20260520-1e5a5425.jpg';
const HERO_VIDEO = 'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/bf17d0a9-2b12-4e4a-982e-09a8b1952ec6/d0a162d2-282e-4653-9d12-aa934c9dfa4e/1779660090678-Hero_overlay.mp4';
const PHOTO_BUILD = 'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/trip-may-2026/alice-build/20260520-1e5a5368.jpg';
const PHOTO_DELIVERY = 'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/trip-may-2026/canon/20260521-1e5a5494.jpg';
const DRIVING_VIDEO = 'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/bf17d0a9-2b12-4e4a-982e-09a8b1952ec6/d0a162d2-282e-4653-9d12-aa934c9dfa4e/1779530078867-Soapy_Boar.mp4';
const PHOTO_BEFORE = 'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/trip-may-2026/canon/20260521-1e5a5638.jpg';
const PHOTO_AFTER = 'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/trip-may-2026/canon/20260521-1e5a5663.jpg';
const PHOTO_ELDERS = '/images/stories/utopia/07-elders.jpg';
const PHOTO_CLOSE = '/images/stories/utopia/11-close.jpg';
const SUNSET_VIDEO = 'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/media/bf17d0a9-2b12-4e4a-982e-09a8b1952ec6/d0a162d2-282e-4653-9d12-aa934c9dfa4e/1779530312327-Utopia_Sunset.mp4';

const blocks = [
  {
    kind: 'masthead',
    kicker: 'Director reflection · 25 May 2026',
    title: 'Three days in Utopia, and what the homelands showed us',
    standfirst:
      'A reflection from Benjamin Knight on three days in Utopia with the Oonchiumpa team. The young people who built the beds in Alice. The families who asked for them. What the trip showed us about what comes next.',
    dateline: 'Alice Springs · Utopia Homelands · 21–22 May 2026',
    media: { image: HERO_IMAGE, videoDesktop: HERO_VIDEO, videoMobile: HERO_VIDEO },
  },
  {
    kind: 'read',
    paragraphs: [
      "Two weeks ago I drove out to Utopia with Nic Marchesi and the Oonchiumpa team. We had a truck full of Stretch Beds that young people had spent two days building in Alice Springs. Centrecorp Foundation paid for the materials. The plan, if you can call it that, was to follow Kristy Bloomfield's lead and deliver the beds to the homes she had told us were waiting.",
      "What I want to record here is the bit a delivery story usually skips: the people who held the room, the families who let us in, and what their welcome did to all of us who came with them.",
    ],
  },
  {
    kind: 'immersive',
    actmark: 'Alice Springs',
    title: 'The build, in Alice',
    standfirst:
      'Two days out the back of the Oonchiumpa office. Young men and young women, supported by Oonchiumpa workers, built their own beds from flat-pack.',
    media: { image: PHOTO_BUILD },
  },
  {
    kind: 'read',
    paragraphs: [
      "The first two days were out the back of the Oonchiumpa office in Alice. Young men and young women, supported by Oonchiumpa workers, built their own beds from flat-pack. Every young person who built one kept one. The rest got loaded into the truck for the run out to the homelands the next morning.",
      "Mykel built seven. He turned the first finished bed over in his hands like he wasn't sure it was real, then told me it was made from bottle lids, shredded and pressed into something strong enough to stand on. Fred, his Oonchiumpa support worker, watched him work and called him grandson.",
    ],
  },
  {
    kind: 'pullquote',
    kicker: 'Fred, to Mykel',
    quote:
      '"That could be a good employment for yourself too, grandson. Later on."',
    attribution: 'Fred · Oonchiumpa support worker · Alice Springs · consent pending',
  },
  {
    kind: 'read',
    paragraphs: [
      'I asked Mykel whether he\'d come and make beds every day if the making moved closer to home. "Yeah, I\'ll be rocking up every day to make them."',
      'That moment is the thread I keep pulling on. A young person, society had largely written off, sitting on a bed he had just built with his own hands and seeing himself as someone who could keep making them.',
    ],
  },
  {
    kind: 'immersive',
    actmark: 'Onto Country',
    title: 'Following the team into the homelands',
    standfirst:
      'Fred Campbell and Decon drove ahead. We turned up with a truck. They lent us their relationships.',
    media: {
      image: PHOTO_DELIVERY,
      videoDesktop: DRIVING_VIDEO,
      videoMobile: DRIVING_VIDEO,
    },
  },
  {
    kind: 'read',
    tag: 'The Oonchiumpa team',
    paragraphs: [
      'Fred Campbell and Decon are Oonchiumpa support workers. They drove ahead of us into the homelands, made the introductions, and sat in the council conversations at Urapuntja that worked out which households were waiting on a bed and which were waiting on something else. We arrived in Utopia with a truck of materials and not a single relationship of our own. Fred and Decon lent us theirs.',
      'At Arlparra, the local workers and council staff took over. They told us which families had asked and where to drive next. They chose the doors. Our job was to keep up.',
      'We went house to house and asked the same question at each one: how many beds do you want? Most answered two or three. We assembled together on the spot, local fullas and us side by side, around five minutes a bed, no tools, on the verandah or just inside the door. While we worked, households told us what they were sleeping on now and what they needed next. We wrote it down.',
    ],
  },
  {
    kind: 'read',
    tag: 'Arawerr',
    heading: 'What the community showed us',
    paragraphs: [
      'At Arawerr (Soapy Bore), every household asked for two or three. Nobody wanted just one. Walking through the yards we saw what people were already sleeping on: car trays balanced on bricks, mattresses on stacks of tyres, foam pads on plywood. Every household had improvised. Every household, having seen a Stretch Bed assembled and tested, wanted one.',
      'The community we spent time with on this trip showed us, in the simplest possible way, that the beds are wanted. They also confirmed, in the way the design held up under real community use, that the families who guided the work before this trip, who told us what to fix, who named the washing machine in Warumungu, were pointed in the right direction.',
    ],
  },
  {
    kind: 'before-after-split',
    heading: 'Before, and after',
    intro:
      'A floor mattress and a Stretch Bed, in the same room, on the same morning.',
    before: {
      image: PHOTO_BEFORE,
      alt: 'A floor mattress on concrete.',
      label: 'Before',
    },
    after: {
      image: PHOTO_AFTER,
      alt: 'A Stretch Bed in the same room.',
      label: 'After',
    },
    credit: 'Goods on Country · 22 May 2026 · consent pending',
  },
  {
    kind: 'immersive',
    actmark: 'Ampilatwatja',
    title: 'A morning with Frankie and Casey',
    standfirst:
      'Alyawarr brothers. Both recognised with the Medal of the Order of Australia. Four beds went in, two households between them. The unloading took longer than the assembly. The yarning took longer still.',
    media: { image: PHOTO_ELDERS },
    mobileLayout: 'stacked',
  },
  {
    kind: 'read',
    paragraphs: [
      'The clip we kept is the moment Frankie sat on a finished bed, tested the canvas with his hand, looked at his brother and nodded. Then he started talking. We made tea. We did very little. That is what the morning needed.',
    ],
  },
  {
    kind: 'read',
    tag: 'What this trip meant to me',
    heading: 'Connection',
    paragraphs: [
      'This whole thing is one big connection piece. Nic and I are continuing to learn and grow alongside community, with Oonchiumpa, with the families whose welcome carries the work each time we land. We are only at the beginning. The further we get, the clearer it becomes that this only works if we keep showing up properly, if community keeps deciding, and if Goods on Country stays an enterprise designed to move the making to community ownership and then become unnecessary.',
      'The people who moved me most this trip: the young people from Oonchiumpa, building beds for themselves and for households they had never met. Karen Liddle and Kristy Bloomfield, with Tanya, with Fred, with Decon, holding the whole journey. The friends who travelled with us from outside community, sitting on the floor at Ampilatwatja, listening to Frankie, being changed by what they heard. The families at every door, who welcomed us by name before we had said ours.',
    ],
  },
  {
    kind: 'pullquote',
    kicker: 'Take-home',
    quote:
      '"These are the people quietly building the answers, while the louder parts of the system keep forgetting they exist. They are powerful in their quiet. I am grateful, and I am paying attention."',
    attribution: 'Benjamin Knight · Director, A Curious Tractor',
  },
  {
    kind: 'close',
    title: 'Day three, sundown over the Sandover.',
    media: {
      image: PHOTO_CLOSE,
      videoDesktop: SUNSET_VIDEO,
      videoMobile: SUNSET_VIDEO,
    },
  },
];

// Themes use brand-aligned labels only (no "co-design"). The Goods brand
// guide treats "co-design" as a banned phrase across all surfaces.
const themes = ['Designed in community', 'On-Country', 'Director reflection'];

// Tags follow the same rule.
const tags = [
  'trip:may-2026',
  'voice:director',
  'author:benjamin-knight',
  'project:goods-on-country',
  'syndication:goods',
  'community:utopia-homelands',
  'community:alice-springs',
  'community:ampilatwatja',
  'design-in-community',
];

const payload = {
  themes,
  tags,
  media_metadata: { blocks },
};

async function main() {
  console.log('PATCHing story', STORY_ID);
  const res = await fetch(`${EL_URL}/rest/v1/stories?id=eq.${STORY_ID}`, {
    method: 'PATCH',
    headers: {
      apikey: EL_KEY,
      Authorization: `Bearer ${EL_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error('PATCH failed', res.status, text);
    process.exit(1);
  }
  const rows = JSON.parse(text);
  console.log('OK. block count:', blocks.length);
  console.log('themes:', rows[0]?.themes);
  console.log('Open: http://localhost:3004/stories/' + STORY_ID);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
