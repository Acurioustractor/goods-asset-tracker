import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL;
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY;
const ID = '55897065-526b-4c56-8fb7-8a2c3ace4993';

const OLD = 'Last week, I drove out to Utopia with Nic Marchesi and the Oonchiumpa team.';
const NEW =
  'Last week, I drove out to the Utopia Homelands of Central Australia with Nic Marchesi, a British entrepreneur, a house designer, a social enterprise expert, and the Oonchiumpa team.';

const get = await fetch(
  `${EL_URL}/rest/v1/stories?id=eq.${ID}&select=media_metadata,content`,
  { headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` } },
);
const [row] = await get.json();
const mm = row.media_metadata || {};
const blocks = mm.blocks || [];
for (const b of blocks) {
  if (Array.isArray(b.paragraphs)) {
    b.paragraphs = b.paragraphs.map((p) => (typeof p === 'string' ? p.replace(OLD, NEW) : p));
  }
}
const content = (row.content || '').replace(OLD, NEW);

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
