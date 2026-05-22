// Bulk-allocate the remainder of batch 156:
// - 51 lowest-numbered ready beds -> Utopia Homelands Council & Arts Centre (allocated)
// - 20 highest-numbered ready beds -> Alice Springs warehouse (still ready, just located)
//
// Re-pulls current ready inventory at runtime so the script remains correct if
// status changes between now and execution. Idempotent: if a bed is already
// allocated/deployed, it'll be PATCHed with the same target community without
// changing semantics.

import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env.local') });

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const TODAY = '2026-05-22';

async function fetchReadyBatch156() {
  const res = await fetch(
    `${URL}/rest/v1/assets?select=unique_id&unique_id=like.GB0-156-*&status=eq.ready&order=unique_id`,
    { headers: { apikey: KEY, Authorization: `Bearer ${KEY}` } },
  );
  const data = await res.json();
  return data
    .map((r) => r.unique_id)
    .sort((a, b) => parseInt(a.split('-')[2]) - parseInt(b.split('-')[2]));
}

async function patch(bedId, body) {
  const res = await fetch(
    `${URL}/rest/v1/assets?unique_id=eq.${encodeURIComponent(bedId)}`,
    {
      method: 'PATCH',
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(body),
    },
  );
  return res.ok ? { ok: true } : { ok: false, status: res.status, text: await res.text() };
}

const ready = await fetchReadyBatch156();
console.log(`Found ${ready.length} ready beds in batch 156`);

const utopiaDrop = ready.slice(0, 51);
const aliceReserve = ready.slice(51);
console.log(`Utopia council+arts centre: ${utopiaDrop.length}`);
console.log(`Alice Springs reserve: ${aliceReserve.length}`);

const UTOPIA_BODY = {
  community: 'Utopia Homelands',
  community_id: 'utopia',
  place: 'Utopia Homelands Council & Arts Centre',
  status: 'allocated',
  supply_date: TODAY,
  notes: `Batch 156 — dropped at Utopia Homelands Council & Arts Centre ${TODAY} for community distribution. Specific household recipients TBD; status will convert from "allocated" to "deployed" as council/arts centre places each bed.`,
};

const ALICE_BODY = {
  community: 'Alice Springs',
  community_id: 'alice-springs',
  place: 'Alice Springs warehouse (reserve)',
  status: 'ready',
  notes: `Batch 156 — held in Alice Springs as reserve inventory from ${TODAY}. Status remains "ready"; will be allocated to specific recipients as they come up.`,
};

let ok = 0, fail = 0;
console.log('\n=== Utopia council/arts centre drop (allocated) ===');
for (const id of utopiaDrop) {
  const r = await patch(id, UTOPIA_BODY);
  if (r.ok) { ok++; console.log(`✓ ${id}`); }
  else { fail++; console.log(`✗ ${id}  HTTP ${r.status}`); }
}
console.log('\n=== Alice Springs reserve (ready) ===');
for (const id of aliceReserve) {
  const r = await patch(id, ALICE_BODY);
  if (r.ok) { ok++; console.log(`✓ ${id}`); }
  else { fail++; console.log(`✗ ${id}  HTTP ${r.status}`); }
}
console.log(`\n${ok} updated, ${fail} failed`);
