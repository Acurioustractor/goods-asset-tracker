// Bulk-approve the Alice Springs build photos uploaded by
// upload-alice-build-photos.mjs. Flips is_public=true, elder_reviewed=true,
// has_explicit_consent=true on every story tagged event:alice-build.
//
// Use only when consent has been properly captured per
// wiki/articles/governance/ai-human-in-loop-policy.md.

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env.local') });

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL;
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY;
const EL_PROJECT_ID = process.env.EMPATHY_LEDGER_PROJECT_ID;
if (!EL_URL || !EL_KEY || !EL_PROJECT_ID) {
  console.error('Missing EL env vars');
  process.exit(1);
}

// Find every Alice-build gallery photo. We filter by both story_type and
// the canonical event tag so we never touch unrelated photos.
const listUrl =
  `${EL_URL}/rest/v1/stories?project_id=eq.${EL_PROJECT_ID}` +
  `&story_type=eq.gallery-photo` +
  `&tags=cs.{"event:alice-build"}` +
  `&select=id,title,is_public` +
  `&limit=500`;

const list = await fetch(listUrl, {
  headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
}).then((r) => r.json());

console.log(`Found ${list.length} gallery-photo records tagged event:alice-build`);
const toApprove = list.filter((s) => !s.is_public);
console.log(`Need to approve: ${toApprove.length}`);

let ok = 0,
  fail = 0;
for (const s of toApprove) {
  const res = await fetch(`${EL_URL}/rest/v1/stories?id=eq.${s.id}`, {
    method: 'PATCH',
    headers: {
      apikey: EL_KEY,
      Authorization: `Bearer ${EL_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      is_public: true,
      elder_reviewed: true,
      elder_reviewed_at: new Date().toISOString(),
      has_explicit_consent: true,
      requires_elder_review: false,
    }),
  });
  if (res.ok) {
    ok++;
    process.stdout.write(`✓ ${s.id.slice(0, 8)}\n`);
  } else {
    fail++;
    process.stdout.write(`✗ ${s.id.slice(0, 8)}  ${await res.text().then((t) => t.slice(0, 120))}\n`);
  }
}
console.log(`\n${ok} approved, ${fail} failed`);
