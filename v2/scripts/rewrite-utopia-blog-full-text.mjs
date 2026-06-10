#!/usr/bin/env node
// Replace the Utopia article's blocks with Ben's full long-form version,
// keeping the existing media URLs (hero, build, delivery, before/after,
// elders, close) in approximately the same positions. Also writes a
// fresh content HTML mirror via blocksToHtml so EL's editor reflects
// the new text.

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL;
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY;
const STORY_ID = '55897065-526b-4c56-8fb7-8a2c3ace4993';

// Pull existing media URLs from the current blocks so the rewrite keeps
// the photos and videos the curator pinned. If a slot is missing we
// fall back to a sensible default.
async function loadCurrentMedia() {
  const res = await fetch(
    `${EL_URL}/rest/v1/stories?id=eq.${STORY_ID}&select=media_metadata`,
    { headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` } },
  );
  const rows = await res.json();
  const blocks = rows[0]?.media_metadata?.blocks || [];
  const findMedia = (kind, predicate) => {
    const b = blocks.find((x) => x.kind === kind && (!predicate || predicate(x)));
    return b?.media || null;
  };
  const findFirstByKindSubstr = (substr) => {
    for (const b of blocks) {
      const m = b.media;
      if (m?.image && (m.image.includes(substr) || (m.videoDesktop && m.videoDesktop.includes(substr)))) return m;
    }
    return null;
  };

  const masthead = findMedia('masthead');
  const immersives = blocks.filter((b) => b.kind === 'immersive');
  const beforeAfter = blocks.find((b) => b.kind === 'before-after-split');
  const close = findMedia('close');

  return {
    hero: masthead || { image: '/images/stories/utopia/01-hero.jpg' },
    build: immersives[0]?.media || { image: '/images/stories/utopia/04-build.jpg' },
    delivery: immersives[1]?.media || { image: '/images/stories/utopia/06-delivery.jpg' },
    elders: immersives.find((b) => /Frankie|Donald|Ampilat/.test(b.title || ''))?.media || { image: '/images/stories/utopia/07-elders.jpg' },
    before: beforeAfter?.before || null,
    after: beforeAfter?.after || null,
    close: close || { image: '/images/stories/utopia/11-close.jpg' },
  };
}

function buildBlocks(media) {
  return [
    {
      kind: 'masthead',
      kicker: 'Director reflection · 25 May 2026',
      title: 'Three Days in Utopia, and What the Homelands Asked of Us',
      standfirst:
        'A long-form reflection from Benjamin Knight on three days with the Oonchiumpa team. The young people who built the beds in Alice Springs. The families who asked for them. The trust that was lent for the photographs. And what the homelands instructed us to carry home.',
      dateline: 'Alice Springs · Utopia Homelands · Arawerr · Ampilatwatja · 20–22 May 2026',
      media: media.hero,
    },

    {
      kind: 'read',
      paragraphs: [
        'Two weeks ago, I drove out to Utopia with Nic Marchesi and the Oonchiumpa team.',
        'We had a truck full of Stretch Beds.',
        'That sounds simple enough. A truck. A road. A load of beds. A destination.',
        'But nothing about this work is simple once you begin to understand what is being carried.',
        "The beds had been built in Alice Springs over two days by young people working alongside the Oonchiumpa crew. Young men and young women, hands on frames, canvas pulled tight, recycled plastic made into something strong enough to hold a body through the night. Centrecorp Foundation had paid for the materials. Kristy Bloomfield had shown us where to go. The Oonchiumpa team held the relationships. We had the truck.",
        'That was our part.',
        'And it was the smallest part.',
        'The part a delivery story usually skips is the part that matters most: the people who held the room before we entered it. The people who made our arrival possible. The families who opened their doors. The quiet authority of those who knew where the beds were needed, which houses were waiting, which conversations had already happened long before the truck came into view.',
        'We did not arrive in Utopia with a story.',
        'We arrived because a story had already been living there.',
        'Our job was to listen closely enough not to damage it.',
      ],
    },

    {
      kind: 'immersive',
      actmark: 'Alice Springs · 19–20 May 2026',
      title: 'The young people who built them',
      standfirst:
        'Two days behind the Oonchiumpa office. Flat packs into beds. Lift, lock, pull, test. Every young person who built one kept one.',
      media: media.build,
    },

    {
      kind: 'read',
      paragraphs: [
        'The first two days were spent behind the Oonchiumpa office in Alice Springs.',
        'There was heat, dust, movement, laughter, instruction. Flat packs became beds. People learned the pattern quickly: lift, lock, pull, test. Every young person who built a bed kept one. The rest were loaded for the homelands the next morning.',
        'Mykel built seven.',
        'I watched him turn the first finished bed over in his hands, as if the thing had surprised him by becoming real. He told me it was made from bottle lids: shredded, pressed, remade into something useful. Something strong.',
        'Fred, his Oonchiumpa support worker, stood nearby watching him work. Fred called him grandson.',
      ],
    },

    {
      kind: 'pullquote',
      kicker: 'Fred, to Mykel',
      quote: '"That could be a good employment for yourself too, grandson. Later on."',
      attribution: 'Fred · Oonchiumpa support worker · Alice Springs · consent pending',
    },

    {
      kind: 'read',
      paragraphs: [
        'There are sentences that pass through a day and disappear. There are others that stay lit. That one stayed lit.',
        'I asked Mykel whether he would come and make beds every day if the making moved closer to home.',
        '"Yeah," he said. "I\'ll be rocking up every day to make them."',
        'That moment is still with me. Not because it was dramatic. It wasn\'t. It was quieter than that. A young person sitting on a bed he had made with his own hands, seeing not just the object in front of him, but a possible future inside it.',
        'A bed is a place to sleep. But sometimes it is also proof. Proof that the hand can build. Proof that the work can belong. Proof that something written off can become useful, strong, needed. Proof that a person written off by the system can still make something the system forgot how to provide.',
        'That is the thread I keep pulling on.',
      ],
    },

    {
      kind: 'immersive',
      actmark: 'Onto Country · 21 May 2026',
      title: 'The people who lent us their relationships',
      standfirst:
        'Fred and Decon drove ahead. They sat in the conversations at Urapuntja. We had materials. They had trust.',
      media: media.delivery,
    },

    {
      kind: 'read',
      paragraphs: [
        'Fred Campbell and Decon drove ahead of us into the homelands. They made the introductions. They sat in the conversations at Urapuntja. They helped work out which households were waiting on beds and which were waiting on something else entirely.',
        'We had materials. They had trust. There is no comparison between the two.',
        'You can buy materials. You can load a truck. You can make a schedule and call it a plan. But you cannot manufacture trust on arrival. You cannot shortcut it. You cannot brand it into existence. You cannot arrive with good intentions and expect that to be enough.',
        'Trust has to be lent by people who have earned it. On this trip, Fred and Decon lent us theirs.',
        'At Arlparra, the local workers and council staff took over. They knew the houses. They knew the families. They knew who had asked. They chose the doors. Our job was to keep up.',
        'We went house to house and asked the same question each time: how many beds do you want? Most people said two or three. Almost nobody asked for one.',
        'And that tells you something. It tells you that need does not arrive as a neat unit. It arrives as a household. As aunties and brothers and children and grandparents. As mattresses on concrete. As foam on plywood. As car trays balanced on bricks. As tyres stacked into a kind of bed because something had to be done, and people have always known how to make something out of what is there.',
      ],
    },

    {
      kind: 'read',
      tag: 'Arawerr · Soapy Bore',
      heading: 'Everywhere we went, people had already solved part of the problem',
      paragraphs: [
        'Everywhere we went, people had improvised. Everywhere we went, people had already solved part of the problem for themselves.',
        'The Stretch Bed did not arrive as charity. It arrived as a response to knowledge that was already present. Community had already told us what mattered: the bed needed to be strong, easy to move, simple to assemble, repairable, washable, able to survive the conditions of real life. The design had been guided long before this trip by families who knew what would fail and what would last.',
        'At Arawerr, at Soapy Bore, the answer was plain. Every household asked for two or three. The beds were wanted. Not in theory. Not in a pitch deck. Not as a pilot finding. Wanted there, on the verandah, inside the rooms, under the hands of the people who tested them.',
        'We assembled them together on the spot: local fullas and us side by side. Five minutes a bed. No tools. The frame opened. The canvas tightened. Someone sat down. Someone pressed a hand into the surface. Someone nodded.',
        'And then the conversation changed. Once the bed was in the room, people started telling us what they were sleeping on now. What they needed next. What was missing. What had been tried. What might work.',
        'We wrote it down. Not as data first. As instruction.',
      ],
    },

    media.before && media.after
      ? {
          kind: 'before-after-split',
          heading: 'Before, and after',
          intro: 'A floor mattress and a Stretch Bed, in the same room, on the same morning.',
          before: media.before,
          after: media.after,
          credit: 'Goods on Country · 22 May 2026 · consent pending',
        }
      : null,

    {
      kind: 'immersive',
      actmark: 'Ampilatwatja · 22 May 2026',
      title: 'The morning with Frankie',
      standfirst:
        'Frankie sat on a finished bed. He tested the canvas with his hand. He looked at his brother. He nodded. Then he started talking. We made tea. We did very little.',
      media: media.elders,
      mobileLayout: 'stacked',
    },

    {
      kind: 'read',
      paragraphs: [
        'The clip we kept is the moment Frankie sat on a finished bed and tested the canvas with his hand. He looked at his brother. He nodded. Then he started talking. We made tea. We did very little.',
        'And I keep thinking that maybe that was the most useful thing we did all morning: very little.',
        'There is a kind of work that is really interruption dressed as help. It arrives loudly. It extracts the image. It takes the quote. It thanks the community for their time and leaves with the story already written.',
        'This was not that. Or, at least, I hope it was not that.',
        'The morning needed slowness. Tea. Silence. A bed in the room. A man testing the canvas. A brother watching. The dignity of not rushing to explain what the moment meant before the moment had finished happening.',
        'Some things should not be harvested the second they appear. Some things should be allowed to breathe.',
      ],
    },

    {
      kind: 'read',
      tag: 'On photographs',
      heading: 'The photographs have to go home',
      paragraphs: [
        'Walking from door to door at Arlparra and Arawerr, I asked at every house if I could take a photograph. Almost everyone said yes.',
        'Children climbed onto beds. Grandparents sat on verandahs. Brothers stood shoulder to shoulder. People came into the frame willingly. Sometimes they asked my name afterwards. Mostly they didn\'t.',
        'They did not ask where the photographs would go. They did not ask who would see them. They did not ask what I would do with the images. They trusted that the camera was being held with care because I was walking with Oonchiumpa.',
        'That trust has been sitting heavily with me ever since.',
        'The most valuable thing I brought home from Utopia was not footage. It was not photographs. It was not proof of impact. It was not a story to publish. It was trust. And trust is not content. Trust is a debt.',
        'The first thing that means is simple: the photographs go back. Every household that let us make an image should have that image returned to them. Printed. Held. Kept. Not as a transaction. Not as a receipt. Just because that is the right order of things. An image belongs first to the people in it. Only after that can it become anything else.',
        'The second thing it means is that any value those images carry must find its way back to community. If a photograph helps someone in the city understand what is happening in a homeland, then that understanding has to become material. It has to move. It has to return as beds, washing machines, employment, ownership, infrastructure, manufacturing, decision-making power.',
        'Otherwise the image has travelled further than the benefit. And that cannot be the work.',
      ],
    },

    {
      kind: 'pullquote',
      kicker: 'From the notebook, on the plane home',
      quote:
        "\"Culture is not content. Connection is not a deliverable. These are living crafts older than the state and older than the language I am writing this in. I do not want 'the story.' I want to help carry it home. Together or not at all.\"",
      attribution: 'Benjamin Knight · 23 May 2026',
    },

    {
      kind: 'read',
      tag: 'The shape of the work',
      heading: 'Culture is not content',
      paragraphs: [
        'Goods on Country has no business pretending to be the source of this story. The source is community.',
        'Goods is a vessel, and a temporary one. The job is not to become permanent. The job is to help move the making closer to Country, closer to ownership, closer to the hands of the people who know what is needed. The job is to become less necessary over time.',
        'That is the shape of the work. Not growth for its own sake. Not scale that outruns relationship. Not impact measured so loudly that it stops listening.',
        'The work has to keep pointing away from itself. Toward community. Toward Country. Toward the knowledge that has been here for thousands of years. Toward the people quietly building answers while the louder parts of the system keep forgetting they exist.',
      ],
    },

    {
      kind: 'read',
      tag: 'Take-home',
      heading: 'What the homelands showed us',
      paragraphs: [
        'The homelands showed us that the beds are wanted.',
        'They showed us that the design works when it is tested by real households, in real rooms, under real conditions.',
        'They showed us that young people can build them. They showed us that the making can become employment, pride, skill, belonging.',
        'They showed us that no product carries itself into community. People carry it. Relationships carry it. Trust carries it.',
        'They showed us that a bed is not only a bed when the floor has been the alternative.',
        'They showed us that the photograph must return.',
        'They showed us that listening is not a soft part of the work. It is the work.',
        'And they showed me, again, that gratitude is not enough unless it becomes responsibility.',
        'I am grateful to Mykel, to Fred, to Decon, to Karen Liddle, to Kristy Bloomfield, to Tanya, to the Oonchiumpa team, to the local workers and council staff, to the families at every door who welcomed us before they knew our names. I am grateful to Frankie for the morning and the tea and the nod. I am grateful to the young people who built beds for themselves and then built more for households they had never met. I am grateful to the people who let us in.',
        'But gratitude has to do something. It has to return the image. It has to sharpen the work. It has to keep the story in the right hands. It has to make the next trip more useful than the last. It has to remember that being welcomed once is not the same as belonging.',
        'We came home with less certainty than we left with. That is a good thing. Certainty can make a person careless. This work requires care.',
        'The road out to Utopia gave us dust, distance, heat, and three days of instruction. Not a lesson in the abstract. Not a metaphor. A practical instruction.',
        'Keep showing up properly. Let community decide. Move the making closer to home. Return what has been trusted to you. Do not confuse carrying the story with owning it.',
      ],
    },

    {
      kind: 'pullquote',
      kicker: 'The road home',
      quote:
        '"Day three ended with sundown over the Sandover. The truck was lighter by then. But I was carrying more than I had arrived with."',
      attribution: 'Benjamin Knight · Director, A Curious Tractor',
    },

    {
      kind: 'close',
      title: 'Sundown over the Sandover, day three.',
      media: media.close,
    },
  ].filter(Boolean);
}

// Mirror blocks → HTML so EL editor's `content` reflects the new body.
function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function inline(t) {
  let o = esc(t);
  o = o.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  o = o.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  o = o.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return o;
}
function toHtml(blocks) {
  const out = [];
  for (const b of blocks) {
    switch (b.kind) {
      case 'masthead':
      case 'immersive':
        if (b.kind === 'masthead' && b.kicker) out.push(`<p class="kicker">${esc(b.kicker)}</p>`);
        if (b.kind === 'immersive' && b.actmark) out.push(`<p class="actmark">${esc(b.actmark)}</p>`);
        if (b.title) out.push(`<h2>${esc(b.title)}</h2>`);
        if (b.standfirst) out.push(`<p class="standfirst">${esc(b.standfirst)}</p>`);
        if (b.media?.image) out.push(`<figure><img src="${esc(b.media.image)}" alt="" /></figure>`);
        break;
      case 'read':
        if (b.tag) out.push(`<p class="tag">${esc(b.tag)}</p>`);
        if (b.heading) out.push(`<h2>${esc(b.heading)}</h2>`);
        for (const p of b.paragraphs || []) out.push(`<p>${inline(p)}</p>`);
        break;
      case 'pullquote':
        if (b.kicker) out.push(`<p class="kicker">${esc(b.kicker)}</p>`);
        out.push(`<blockquote><p>${inline(b.quote)}</p></blockquote>`);
        if (b.attribution) out.push(`<p class="attr">${esc(b.attribution)}</p>`);
        break;
      case 'before-after-split':
        if (b.heading) out.push(`<h2>${esc(b.heading)}</h2>`);
        if (b.intro) out.push(`<p>${esc(b.intro)}</p>`);
        out.push('<div class="before-after">');
        out.push(`  <figure><span class="label">${esc(b.before.label)}</span><img src="${esc(b.before.image)}" alt="${esc(b.before.alt || '')}" /></figure>`);
        out.push(`  <figure><span class="label">${esc(b.after.label)}</span><img src="${esc(b.after.image)}" alt="${esc(b.after.alt || '')}" /></figure>`);
        out.push('</div>');
        if (b.credit) out.push(`<p class="credit">${esc(b.credit)}</p>`);
        break;
      case 'close':
        if (b.media?.image) out.push(`<figure><img src="${esc(b.media.image)}" alt="" /></figure>`);
        if (b.title) out.push(`<p class="close-title">${esc(b.title)}</p>`);
        break;
    }
  }
  return out.join('\n');
}

async function main() {
  console.log('Loading current media to preserve...');
  const media = await loadCurrentMedia();
  const blocks = buildBlocks(media);
  const content = toHtml(blocks);
  console.log(`Built ${blocks.length} blocks · ${content.length} chars of HTML mirror`);

  const payload = {
    title: 'Three Days in Utopia, and What the Homelands Asked of Us',
    media_metadata: { layout: 'article', blocks },
    content,
  };

  const res = await fetch(`${EL_URL}/rest/v1/stories?id=eq.${STORY_ID}`, {
    method: 'PATCH',
    headers: {
      apikey: EL_KEY,
      Authorization: `Bearer ${EL_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.error('PATCH failed', res.status, await res.text());
    process.exit(1);
  }
  console.log('OK.');
  console.log('Live article:  http://localhost:3004/stories/' + STORY_ID);
  console.log('Goods admin:   http://localhost:3004/admin/el-stories/' + STORY_ID + '/edit');
}

main().catch((err) => { console.error(err); process.exit(1); });
