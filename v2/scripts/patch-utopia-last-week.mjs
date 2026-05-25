import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL;
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY;
const ID = '55897065-526b-4c56-8fb7-8a2c3ace4993';

const get = await fetch(
  `${EL_URL}/rest/v1/stories?id=eq.${ID}&select=media_metadata,content`,
  { headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` } },
);
const [row] = await get.json();
const mm = row.media_metadata || {};
const blocks = mm.blocks || [];
const replace = (s) => {
  if (typeof s !== 'string') return s;
  return s
    // Timing: it was last week, not two weeks ago.
    .replace(/Two weeks ago, I drove/g, 'Last week, I drove')
    .replace(/Two weeks ago/g, 'Last week')
    // Vehicles: it was two utes, not a truck. Don't touch the meta
    // line "The truck arrives, the beds go in" since that's a generic
    // delivery-story image, not the literal Utopia vehicles.
    .replace(/We had a truck full of Stretch Beds\./g, 'We had two utes full of Stretch Beds.')
    .replace(/A truck\. A road\. A load of beds\. A destination\./g, 'Two utes. A road. A load of beds. A destination.')
    .replace(/The Oonchiumpa team held the relationships\. We had the truck\./g, 'The Oonchiumpa team held the relationships. We had the utes.')
    .replace(/We arrived in Utopia with a truck of materials/g, 'We arrived in Utopia with two utes full of materials')
    .replace(/The truck was lighter by then\./g, 'The utes were lighter by then.');
};
for (const b of blocks) {
  if (Array.isArray(b.paragraphs)) b.paragraphs = b.paragraphs.map(replace);
  if (b.standfirst) b.standfirst = replace(b.standfirst);
  if (b.heading) b.heading = replace(b.heading);
  if (b.title) b.title = replace(b.title);
  if (b.quote) b.quote = replace(b.quote);
}
const content = replace(row.content || '');

const res = await fetch(`${EL_URL}/rest/v1/stories?id=eq.${ID}`, {
  method: 'PATCH',
  headers: {
    apikey: EL_KEY,
    Authorization: `Bearer ${EL_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=minimal',
  },
  body: JSON.stringify({ media_metadata: { ...mm, blocks }, content }),
});
console.log('HTTP', res.status, res.ok ? 'OK' : await res.text());
