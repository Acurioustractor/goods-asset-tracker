// Create Mykel as a storyteller in Empathy Ledger, scoped to the Goods
// organisation. Defaults to is_active=false + content_status='draft'
// + consent source 'oonchiumpa' because Mykel is a young person and
// consent for public-facing use must flow through Oonchiumpa.
//
// Run once: node scripts/create-mykel-storyteller.mjs

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env.local') });

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL;
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY;
const GOODS_ORG_ID = 'db0de7bd-eb10-446b-99e9-0f3b7c199b8a';

if (!EL_URL || !EL_KEY) {
  console.error('Missing EL env vars');
  process.exit(1);
}

// Sanity check — don't double-create.
const check = await fetch(
  `${EL_URL}/rest/v1/storytellers?display_name=eq.Mykel&organization_id=eq.${GOODS_ORG_ID}&select=id`,
  { headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` } }
).then((r) => r.json());

if (check.length > 0) {
  console.log(`Mykel already exists in EL: ${check[0].id}`);
  process.exit(0);
}

const body = {
  organization_id: GOODS_ORG_ID,
  display_name: 'Mykel',
  bio:
    'Young builder, Alice Springs. Mykel built his own Stretch Bed and six others during the ' +
    'Oonchiumpa-supported May 2026 workshop, then asked whether he could keep building if the ' +
    'making moved closer to home. Held pending guardian + Oonchiumpa consent confirmation before ' +
    'public attribution.',
  public_avatar_url: null,
  location: 'Alice Springs, Northern Territory, Australia',
  cultural_background: null,
  is_elder: false,
  is_featured: false,
  is_active: false,
  content_status: 'draft',
  is_ancestor: false,
};

const res = await fetch(`${EL_URL}/rest/v1/storytellers`, {
  method: 'POST',
  headers: {
    apikey: EL_KEY,
    Authorization: `Bearer ${EL_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=representation',
  },
  body: JSON.stringify(body),
});

if (!res.ok) {
  console.error(`POST failed (HTTP ${res.status}):`, await res.text());
  process.exit(1);
}

const rows = await res.json();
const mykel = rows[0];
console.log(`✓ Created Mykel`);
console.log(`  id:           ${mykel.id}`);
console.log(`  display_name: ${mykel.display_name}`);
console.log(`  org_id:       ${mykel.organization_id}`);
console.log(`  is_active:    ${mykel.is_active} (keep false until consent confirmed)`);
console.log(`  status:       ${mykel.content_status}`);
console.log(``);
console.log(`Use storytellerSlug: 'mykel' on voice cards in trip-stories.ts to link.`);
console.log(`When uploading Mykel.mp4 to EL, set storyteller_id = ${mykel.id}.`);
