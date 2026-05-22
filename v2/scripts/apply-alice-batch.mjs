// Catch-up PATCH for yesterday's untracked Alice Springs deliveries.
// 2 beds known via scan tracker (GB0-156-102 "House 3", GB0-156-103) +
// 6 next-available from ready inventory. Recipient names left null for
// now — user will fill in via admin UI once they confirm who got which.

import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env.local') });

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const BED_IDS = [
  'GB0-156-102',  // scanned + named "House 3" — likely a recipient self-named
  'GB0-156-103',  // scanned today
  'GB0-156-1',    // 6 from inventory below
  'GB0-156-2',
  'GB0-156-3',
  'GB0-156-4',
  'GB0-156-5',
  'GB0-156-6',
];

const NOTE = 'Alice Springs delivery 2026-05-21. Recipients: Mykel + 4 young girls + 3 other young people. Specific recipient↔bed mapping TBD — update via /admin/assets or /bed/[id] InstallLogger.';

let ok = 0, fail = 0;
for (const bedId of BED_IDS) {
  const body = {
    community: 'Alice Springs',
    community_id: 'alice-springs',
    place: 'Alice Springs',
    status: 'deployed',
    supply_date: '2026-05-21',
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
  if (res.ok) {
    ok++;
    console.log(`✓ ${bedId}  Alice Springs  deployed  2026-05-21`);
  } else {
    fail++;
    console.log(`✗ ${bedId}  HTTP ${res.status}  ${(await res.text()).slice(0, 150)}`);
  }
}
console.log(`\n${ok} updated, ${fail} failed`);
