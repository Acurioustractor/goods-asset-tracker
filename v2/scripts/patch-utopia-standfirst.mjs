import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL;
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY;
const ID = '55897065-526b-4c56-8fb7-8a2c3ace4993';

const NEW_STANDFIRST = 'Three days with the Oonchiumpa team. The young people who built the beds in Alice Springs. The families who asked for them by name. The trust I was lent for every photograph. What the homelands instructed me to carry home.';
const NEW_SUMMARY = 'Three days with the Oonchiumpa team. The young people who built the beds. The families who asked for them. The trust I was lent for every photograph. What the homelands instructed me to carry home.';
const OLD = 'A long-form reflection from Benjamin Knight on three days with the Oonchiumpa team. The young people who built the beds in Alice Springs. The families who asked for them. The trust that was lent for the photographs. And what the homelands instructed us to carry home.';

const get = await fetch(
  `${EL_URL}/rest/v1/stories?id=eq.${ID}&select=media_metadata,content,summary`,
  { headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` } },
);
const [row] = await get.json();
const mm = row.media_metadata || {};
const blocks = mm.blocks || [];
for (const b of blocks) {
  if (b.kind === 'masthead') { b.standfirst = NEW_STANDFIRST; break; }
}
const content = (row.content || '').replace(OLD, NEW_STANDFIRST);

const res = await fetch(`${EL_URL}/rest/v1/stories?id=eq.${ID}`, {
  method: 'PATCH',
  headers: {
    apikey: EL_KEY,
    Authorization: `Bearer ${EL_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=minimal',
  },
  body: JSON.stringify({
    summary: NEW_SUMMARY,
    excerpt: NEW_SUMMARY.slice(0, 280),
    media_metadata: { ...mm, blocks },
    content,
  }),
});
console.log('HTTP', res.status, res.ok ? 'OK' : await res.text());
