#!/usr/bin/env node
// One-shot: publish Ben's Utopia reflection as an EL story so it can be
// pulled onto Goods via the existing /stories/[id] route. Test of the
// EL → Goods syndication pipeline for director-voice articles.

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL;
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY;
if (!EL_URL || !EL_KEY) {
  console.error('Missing EMPATHY_LEDGER_SUPABASE_URL or EMPATHY_LEDGER_SUPABASE_KEY in .env.local');
  process.exit(1);
}

const GOODS_PROJECT_ID = '6bd47c8a-e676-456f-aa25-ddcbb5a31047';
const GOODS_TENANT_ID = '5f1314c1-ffe9-4d8f-944b-6cdf02d4b943';
const BEN_STORYTELLER_ID = '8b5f3aa0-5955-43ac-8442-37e48e7fc810';

const HERO = 'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/trip-may-2026/alice-build/20260520-1e5a5425.jpg';
const PHOTO_BUILD = 'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/trip-may-2026/alice-build/20260520-1e5a5368.jpg';
const PHOTO_DELIVERY = 'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/trip-may-2026/canon/20260521-1e5a5494.jpg';
const PHOTO_BEFORE = 'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/trip-may-2026/canon/20260521-1e5a5638.jpg';
const PHOTO_AFTER = 'https://yvnuayzslukamizrlhwb.supabase.co/storage/v1/object/public/story-images/trip-may-2026/canon/20260521-1e5a5663.jpg';
const PHOTO_ELDERS = 'https://www.goodsoncountry.com/images/stories/utopia/07-elders.jpg';
const PHOTO_CLOSE = 'https://www.goodsoncountry.com/images/stories/utopia/11-close.jpg';

const title = 'Three days in Utopia, and what the homelands showed us';
const summary = 'A reflection from Benjamin Knight, Director at A Curious Tractor, on three days in Utopia with the Oonchiumpa team. The young people who built the beds in Alice. The families who asked for them. What the trip showed us about what comes next.';

const content = `
<p>Two weeks ago I drove out to Utopia with Nic Marchesi and the Oonchiumpa team. We had a truck full of Stretch Beds that young people had spent two days building in Alice Springs. Centrecorp Foundation paid for the materials. The plan, if you can call it that, was to follow Kristy Bloomfield's lead and deliver the beds to the homes she had told us were waiting.</p>

<p>What I want to record here is the bit a delivery story usually skips: the people who held the room, the families who let us in, and what their welcome did to all of us who came with them.</p>

<h2>The build, in Alice</h2>
<p><img src="${PHOTO_BUILD}" alt="Young people building Stretch Beds at the Oonchiumpa office in Alice Springs, 20 May 2026" /></p>

<p>The first two days were out the back of the Oonchiumpa office in Alice. Young men and young women, supported by Oonchiumpa workers, built their own beds from flat-pack. Every young person who built one kept one. The rest got loaded into the truck for the run out to the homelands the next morning.</p>

<p>Mykel built seven. He turned the first finished bed over in his hands like he wasn't sure it was real, then told me it was made from bottle lids, shredded and pressed into something strong enough to stand on. Fred, his Oonchiumpa support worker, watched him work and called him grandson. Then Fred said this:</p>

<blockquote>"That could be a good employment for yourself too, grandson. Later on."</blockquote>

<p>I asked Mykel whether he'd come and make beds every day if the making moved closer to home. "Yeah, I'll be rocking up every day to make them."</p>

<p>That moment is the thread I keep pulling on. A young person, society had largely written off, sitting on a bed he had just built with his own hands and seeing himself as someone who could keep making them. The bed is the small thing. The shift in how he saw himself is the larger one.</p>

<h2>Onto Country</h2>
<p><img src="${PHOTO_DELIVERY}" alt="A bed being delivered to a household in the Utopia homelands, May 2026" /></p>

<p>Fred Campbell and Decon are Oonchiumpa support workers. They drove ahead of us into the homelands, made the introductions, and sat in the council conversations at Urapuntja that worked out which households were waiting on a bed and which were waiting on something else. We arrived in Utopia with a truck of materials and not a single relationship of our own. Fred and Decon lent us theirs.</p>

<p>At Arlparra, the local workers and council staff took over. They told us which families had asked and where to drive next. They chose the doors. Our job was to keep up.</p>

<p>We went house to house and asked the same question at each one: how many beds do you want? Most answered two or three. We assembled together on the spot, local fullas and us side by side, around five minutes a bed, no tools, on the verandah or just inside the door. While we worked, households told us what they were sleeping on now and what they needed next. We wrote it down.</p>

<h2>What the community showed us</h2>

<p>At Arawerr (Soapy Bore), every household asked for two or three. Nobody wanted just one. Walking through the yards we saw what people were already sleeping on: car trays balanced on bricks, mattresses on stacks of tyres, foam pads on plywood. Every household had improvised. Every household, having seen a Stretch Bed assembled and tested, wanted one.</p>

<p>The community we spent time with on this trip showed us, in the simplest possible way, that the beds are wanted. They also confirmed, in the way the design held up under real community use, that the families who guided the work before this trip, who told us what to fix, who named the washing machine in Warumungu, were pointed in the right direction.</p>

<p><img src="${PHOTO_BEFORE}" alt="A floor mattress on concrete: what one household was sleeping on before the Stretch Bed was delivered" /></p>

<p><img src="${PHOTO_AFTER}" alt="The same room after a Stretch Bed went in" /></p>

<h2>A morning at Ampilatwatja</h2>
<p><img src="${PHOTO_ELDERS}" alt="Frankie Holmes OAM and Mr Donald Thompson OAM at their shed at Ampilatwatja, 22 May 2026" /></p>

<p>The last morning, Frankie Holmes OAM and Mr Donald Thompson OAM sat with us at their shed at Ampilatwatja. Alyawarr brothers. Both have been recognised with the Medal of the Order of Australia for decades of work for their community and their Country. Four beds went in, two households between them. The unloading took longer than the assembly. The yarning took longer still.</p>

<p>The clip we kept is the moment Frankie sat on a finished bed, tested the canvas with his hand, looked at his brother and nodded. Then he started talking. We made tea. We did very little. That is what the morning needed.</p>

<h2>What this trip meant to me</h2>

<p>This whole thing is one big connection piece. Nic and I are continuing to learn and grow alongside community, with Oonchiumpa, with the families whose welcome carries the work each time we land. We are only at the beginning. The further we get, the clearer it becomes that this only works if we keep showing up properly, if community keeps deciding, and if Goods on Country stays an enterprise designed to move the making to community ownership and then become unnecessary.</p>

<p>The people who moved me most this trip:</p>

<ul>
  <li>The young people from Oonchiumpa, building beds for themselves and for households they had never met across the homelands. Society has too often cast them to one side. They showed up.</li>
  <li>Karen Liddle and Kristy Bloomfield, with Tanya, with Fred, with Decon, holding the whole journey.</li>
  <li>The friends who travelled with us from outside community, sitting on the floor at Ampilatwatja, listening to Frankie, being changed by what they heard.</li>
  <li>The families at every door, who welcomed us by name before we had said ours.</li>
</ul>

<p>These are the people quietly building the answers, while the louder parts of the system keep forgetting they exist. They are powerful in their quiet. I am grateful, and I am paying attention.</p>

<p><img src="${PHOTO_CLOSE}" alt="Sundown over the Sandover, end of day three" /></p>

<p>If you want to see the photos and hear the voices from this trip in full, the field notes are here: <a href="https://www.goodsoncountry.com/field-notes/utopia-may-2026">goodsoncountry.com/field-notes/utopia-may-2026</a>.</p>

<p><em>Goods on Country is an enterprise within A Curious Tractor. The Stretch Bed and the washing machine <a href="https://www.goodsoncountry.com/shop/washing-machine">Pakkimjalki Kari</a>, named in Warumungu by Elder Dianne Stokes, were designed in community over years with the Bloomfield family who run Oonchiumpa. The next piece of the model is a containerised plant that can move to a community and be owned there.</em></p>
`.trim();

const payload = {
  title,
  summary,
  excerpt: summary.slice(0, 280),
  content,
  story_type: 'personal_narrative',
  storyteller_id: BEN_STORYTELLER_ID,
  project_id: GOODS_PROJECT_ID,
  tenant_id: GOODS_TENANT_ID,
  story_image_url: HERO,
  tags: [
    'trip:may-2026',
    'voice:director',
    'author:benjamin-knight',
    'project:goods-on-country',
    'syndication:goods',
    'community:utopia-homelands',
    'community:alice-springs',
    'community:ampilatwatja',
  ],
  themes: ['co-design'],
  is_public: true,
  syndication_enabled: true,
  has_explicit_consent: true,
  consent_verified_at: new Date().toISOString(),
  published_at: new Date().toISOString(),
  is_archived: false,
  language: 'en',
  status: 'published',
  reading_time: 4,
  word_count: content.split(/\s+/).length,
};

async function main() {
  console.log('Inserting article to EL...');
  const res = await fetch(`${EL_URL}/rest/v1/stories`, {
    method: 'POST',
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
    console.error('Insert failed:', res.status, text);
    process.exit(1);
  }
  const rows = JSON.parse(text);
  const row = Array.isArray(rows) ? rows[0] : rows;
  console.log('OK. Story ID:', row.id);
  console.log('Goods URL: https://www.goodsoncountry.com/stories/' + row.id);
  console.log('Dev URL:   http://localhost:3004/stories/' + row.id);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
