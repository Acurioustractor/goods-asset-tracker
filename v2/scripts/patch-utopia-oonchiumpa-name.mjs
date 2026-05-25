import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL;
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY;
const ID = '55897065-526b-4c56-8fb7-8a2c3ace4993';

const URL_LINK = 'https://www.oonchiumpa.com.au/';
// Inline markdown form for blocks paragraphs (the article renderer
// handles [text](url)). The first mention gets the link; later
// 'Oonchiumpa crew' references just get the renamed text.
const MD_LINK = `[Oonchiumpa Consultancy and Services](${URL_LINK})`;
const PLAIN = 'Oonchiumpa Consultancy and Services';

const get = await fetch(
  `${EL_URL}/rest/v1/stories?id=eq.${ID}&select=media_metadata,content`,
  { headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` } },
);
const [row] = await get.json();
const mm = row.media_metadata || {};
const blocks = mm.blocks || [];

// Linked first, plain on the rest. Track whether we've linked yet.
let linked = false;
function replaceInString(s) {
  if (typeof s !== 'string') return s;
  return s.replace(/Oonchiumpa crew/g, () => {
    if (!linked) {
      linked = true;
      return MD_LINK;
    }
    return PLAIN;
  });
}

for (const b of blocks) {
  if (Array.isArray(b.paragraphs)) {
    b.paragraphs = b.paragraphs.map(replaceInString);
  }
  if (b.standfirst) b.standfirst = replaceInString(b.standfirst);
  if (b.heading) b.heading = replaceInString(b.heading);
  if (b.quote) b.quote = replaceInString(b.quote);
}

// Mirror for the content HTML — convert one inline anchor, rest plain.
let linkedHtml = false;
const content = (row.content || '').replace(/Oonchiumpa crew/g, () => {
  if (!linkedHtml) {
    linkedHtml = true;
    return `<a href="${URL_LINK}">${PLAIN}</a>`;
  }
  return PLAIN;
});

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
console.log('Linked mentions in blocks:', linked ? 1 : 0);
console.log('Linked mentions in content:', linkedHtml ? 1 : 0);
