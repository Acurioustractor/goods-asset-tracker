/**
 * Fill crm_contacts.storyteller_id and crm_contacts.ghl_contact_id.
 *
 * DRY RUN BY DEFAULT. Pass --apply to write. Run the migration first:
 * supabase/migrations/20260917_crm_contacts_identity_pointers.sql
 *
 *   node --env-file=.env.local scripts/backfill-crm-identity.mjs          (shows what it would do)
 *   node --env-file=.env.local scripts/backfill-crm-identity.mjs --apply
 *
 * MATCHING IS DELIBERATELY DUMB. Email exactly, or a name that normalises to exactly one
 * candidate. Nothing fuzzy, because a near-match on a person is how the wrong human ends up
 * linked to somebody else's consent record. Anything ambiguous is printed and skipped for a human.
 *
 * It never writes a consent tier. storytellers is the only place a tier is decided.
 *
 * NEVER use the Supabase MCP for v2 data. It points at the wrong project.
 */
import { createClient } from '@supabase/supabase-js';

const APPLY = process.argv.includes('--apply');
const personKey = (s) => (s ?? '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const emailKey = (s) => (s ?? '').trim().toLowerCase();

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const { data: contacts, error: cErr } = await sb.from('crm_contacts').select('id,name,email,storyteller_id,ghl_contact_id');
if (cErr) {
  console.error('crm_contacts read failed:', cErr.message);
  if (/storyteller_id|ghl_contact_id/.test(cErr.message)) console.error('Run the migration first.');
  process.exit(1);
}
const { data: tellers, error: tErr } = await sb.from('storytellers').select('id,slug,display_name,aliases');
if (tErr) { console.error('storytellers read failed:', tErr.message); process.exit(1); }

const KEY = process.env.GHL_API_KEY;
const LOC = process.env.GHL_LOCATION_ID;
const ghl = [];
let url = `https://services.leadconnectorhq.com/contacts/?locationId=${LOC}&limit=100`;
for (let page = 0; page < 60 && url; page++) {
  const r = await fetch(url, { headers: { Authorization: `Bearer ${KEY}`, Version: '2021-07-28', Accept: 'application/json' } });
  if (!r.ok) { console.error(`GHL read failed: ${r.status}`); process.exit(1); }
  const j = await r.json();
  for (const c of j.contacts ?? []) ghl.push({ id: c.id, name: [c.firstName, c.lastName].filter(Boolean).join(' ') || c.contactName || '', email: c.email || '' });
  url = j.meta?.nextPageUrl ?? null;
}

const tellerByKey = new Map();
for (const t of tellers) for (const sp of [t.display_name, t.slug, ...(t.aliases ?? [])]) if (sp) tellerByKey.set(personKey(sp), t);

const ghlByEmail = new Map();
const ghlByName = new Map();
for (const g of ghl) {
  const e = emailKey(g.email);
  if (e) ghlByEmail.set(e, g);
  const n = personKey(g.name);
  if (n) ghlByName.set(n, [...(ghlByName.get(n) ?? []), g]);
}

const plan = [];
const ambiguous = [];
const takenTeller = new Set(contacts.map((c) => c.storyteller_id).filter(Boolean));
const takenGhl = new Set(contacts.map((c) => c.ghl_contact_id).filter(Boolean));

for (const c of contacts) {
  const patch = {};
  if (!c.storyteller_id) {
    const t = tellerByKey.get(personKey(c.name));
    if (t && !takenTeller.has(t.id)) { patch.storyteller_id = t.id; takenTeller.add(t.id); }
  }
  if (!c.ghl_contact_id) {
    const e = emailKey(c.email);
    let g = e ? ghlByEmail.get(e) : undefined;
    let how = 'email';
    if (!g) {
      const hits = ghlByName.get(personKey(c.name));
      if (hits?.length === 1) { g = hits[0]; how = 'name'; }
      else if (hits?.length) ambiguous.push(`${c.name}: ${hits.length} GHL contacts share that name`);
    }
    if (g && !takenGhl.has(g.id)) { patch.ghl_contact_id = g.id; takenGhl.add(g.id); patch.__how = how; }
  }
  if (Object.keys(patch).length) plan.push({ c, patch });
}

console.log(`crm_contacts: ${contacts.length}. Would set storyteller_id on ${plan.filter((p) => p.patch.storyteller_id).length}, ghl_contact_id on ${plan.filter((p) => p.patch.ghl_contact_id).length}.`);
for (const { c, patch } of plan) {
  const bits = [];
  if (patch.storyteller_id) bits.push(`storyteller=${tellers.find((t) => t.id === patch.storyteller_id).slug}`);
  if (patch.ghl_contact_id) bits.push(`ghl=${patch.ghl_contact_id} (on ${patch.__how})`);
  console.log(`  ${c.name}: ${bits.join(', ')}`);
}
for (const a of ambiguous) console.log(`  SKIPPED, needs a human: ${a}`);

if (!APPLY) { console.log('\nDry run. Pass --apply to write.'); process.exit(0); }

let done = 0;
for (const { c, patch } of plan) {
  const { __how, ...write } = patch;
  const { error } = await sb.from('crm_contacts').update(write).eq('id', c.id);
  if (error) console.error(`  failed on ${c.name}: ${error.message}`);
  else done++;
}
console.log(`\nUpdated ${done} of ${plan.length} rows. No consent tier was written anywhere.`);
