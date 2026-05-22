// Day 2 Utopia trip (2026-05-22). WhatsApp photos came in with EXIF stripped,
// so we only have QR-decoded bed IDs - no GPS, no captions. Set community +
// status. Recipient names come later via the admin UI.

import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env.local') });

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const BED_IDS = ['GB0-156-10', 'GB0-156-12', 'GB0-156-41', 'GB0-156-43', 'GB0-156-59', 'GB0-156-84'];
const NOTE = 'Utopia Homelands delivery 2026-05-22 (Day 2 of trip). QR captured via WhatsApp - GPS stripped by WhatsApp upload, recipient names to be added via /admin/assets.';

let ok = 0, fail = 0;
for (const bedId of BED_IDS) {
  const body = {
    community: 'Utopia Homelands',
    community_id: 'utopia',
    place: 'Utopia Homelands',
    status: 'deployed',
    supply_date: '2026-05-22',
    notes: NOTE,
  };
  const res = await fetch(`${URL}/rest/v1/assets?unique_id=eq.${encodeURIComponent(bedId)}`, {
    method: 'PATCH',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(body),
  });
  if (res.ok) { ok++; console.log(`✓ ${bedId}`); }
  else { fail++; console.log(`✗ ${bedId}  HTTP ${res.status}`); }
}
console.log(`\n${ok} updated, ${fail} failed`);
