#!/usr/bin/env node
// Extends Ben's Utopia article with the photographs / trust / kettle-fire
// thread from his notebook on the plane home. Inserts two new blocks
// before the existing "Connection" read, and adds a closing paragraph
// to that Connection block that names the kettle/fire idea plainly.

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

const newPhotosBlock = {
  kind: 'read',
  tag: 'On photographs',
  heading: 'What gets carried home',
  paragraphs: [
    "Walking from door to door at Arlparra and Arawerr, I asked at every house if I could take a photo. Almost everyone said yes. People came over to be in the frame: kids on the bed, grandparents on the verandah, brothers shoulder to shoulder. They asked my name afterwards, sometimes. Mostly they did not. They did not ask where the photos were going, what I would do with them, who would see them. They trusted that the camera was held with care by someone walking with Oonchiumpa, and that was enough.",
    "I have been carrying that since. The trust I was lent on those verandahs is the most valuable thing I came home with, and the most weighted. People let me into their day and into a frame because of the people I came alongside, not because they knew me. The work in front of me now is to be worthy of that.",
    "The first thing it means is the photos go back. Every household that let us photograph them gets prints in their hands. Not as the receipt of an exchange. Just because that is the order of things: you let someone make an image, the image returns. Photographs as memory for the people in them first, and as anything else only second.",
    "The second thing it means is that the value those images can carry needs to flow back to community. The bigger thing photographs can do, the part that ends up on the nation's screens, is help the rest of Australia see and feel something the First Nations community has known for thousands of years. The knowledge. The intelligence. The connection to Country. The way decisions land slowly and properly when they are made together. That is not the story Goods has any business telling. It is community's story, that Goods is privileged to help carry.",
  ],
};

const notebookPullquote = {
  kind: 'pullquote',
  kicker: 'From the notebook, on the plane home',
  quote:
    "\"Culture is not content. Connection is not a deliverable. These are living crafts older than the state and older than the language I am writing this in. I do not want 'the story'. I want to help carry it home. Together or not at all.\"",
  attribution: 'Benjamin Knight · 23 May 2026',
};

// Replacement "Connection" block — same intent, with the kettle/fire idea
// added as a final paragraph so the philosophy lands without becoming a
// separate sermon.
const updatedConnectionBlock = {
  kind: 'read',
  tag: 'What this trip meant to me',
  heading: 'Connection',
  paragraphs: [
    'This whole thing is one big connection piece. Nic and I are continuing to learn and grow alongside community, with Oonchiumpa, with the families whose welcome carries the work each time we land. We are only at the beginning. The further we get, the clearer it becomes that this only works if we keep showing up properly, if community keeps deciding, and if Goods on Country stays an enterprise designed to move the making to community ownership and then become unnecessary.',
    'The people who moved me most this trip: the young people from Oonchiumpa, building beds for themselves and for households they had never met. Karen Liddle and Kristy Bloomfield, with Tanya, with Fred, with Decon, holding the whole journey. The friends who travelled with us from outside community, sitting on the floor at Ampilatwatja, listening to Frankie, being changed by what they heard. The families at every door, who welcomed us by name before we had said ours.',
    'The job, for me, is to make work that points away from itself. Goods is the vessel; the source is community. The fire is the knowledge that has been held here for thousands of years. My job is to keep the work pointed back at it. To let the photographs go home with the people in them. To help the value find its way back to community, and into the rooms in this country that so deeply need to see and feel it.',
  ],
};

async function main() {
  console.log('Loading current blocks...');
  const getRes = await fetch(
    `${EL_URL}/rest/v1/stories?id=eq.${STORY_ID}&select=media_metadata`,
    { headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` } },
  );
  if (!getRes.ok) {
    console.error('GET failed', getRes.status);
    process.exit(1);
  }
  const rows = await getRes.json();
  const mm = rows[0]?.media_metadata || {};
  const blocks = Array.isArray(mm.blocks) ? [...mm.blocks] : [];

  // Find the existing Connection read and replace it; insert the two new
  // blocks immediately before it.
  const connectionIdx = blocks.findIndex(
    (b) => b.kind === 'read' && b.heading === 'Connection',
  );
  if (connectionIdx === -1) {
    console.error('Could not find existing Connection block to anchor the insert');
    process.exit(1);
  }

  // Avoid duplicate inserts on re-run: bail if the new section is already there.
  const alreadyHas = blocks.some(
    (b) => b.kind === 'read' && b.heading === 'What gets carried home',
  );
  if (alreadyHas) {
    console.log('Already extended. No changes.');
    process.exit(0);
  }

  // Insert new blocks before Connection, replace Connection with updated copy.
  blocks.splice(
    connectionIdx,
    1,
    newPhotosBlock,
    notebookPullquote,
    updatedConnectionBlock,
  );

  const payload = {
    media_metadata: { ...mm, blocks, layout: mm.layout || 'article' },
  };

  console.log('PATCHing story with', blocks.length, 'blocks total');
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
  console.log('OK. http://localhost:3004/stories/' + STORY_ID);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
