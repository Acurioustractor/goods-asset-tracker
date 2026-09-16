/**
 * READ-ONLY guard across the three people systems.
 *
 * Goods holds people in three places and nothing joins them: GHL (the outreach CRM, where a send
 * comes from), Supabase `crm_contacts` (relationships, mostly community, half of them absent from
 * GHL), and Supabase `storytellers` (the consent authority, every row gated).
 *
 * THE ONE THING IT FAILS ON: somebody in a send list whose ONLY recorded relationship with us is
 * that they tell stories.
 *
 * Ben, 17 September 2026, on Jimmy Frank carrying comms:goods-newsletter while on the gated
 * storyteller list: "Jimmy Frank is a storyteller and community partner for the Harvest and
 * Goods." A consent tier governs what may be done with a person's STORY. It has never governed
 * whether we may write to a partner about the work they partner on. So a gated storyteller in a
 * send list is fine when the record also holds a partner, member or staff relationship, and is a
 * problem when storytelling is all we have.
 *
 * Everything else it prints as a count, so the shape of the gap is visible without the guard
 * crying wolf. See src/lib/data/person-identity.ts for why `lane:community` is deliberately not
 * tested: the tag means both "is a community member" and "works in the community lane".
 *
 *   node --env-file=.env.local scripts/check-people-identity.mjs   (run from v2/)
 *
 * NEVER use the Supabase MCP for v2 data. It points at the wrong project.
 */
import { createClient } from '@supabase/supabase-js';

const personKey = (s) => (s ?? '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const emailKey = (s) => (s ?? '').trim().toLowerCase();

// Mirror of CAMPAIGN_TAG_PREFIXES in src/lib/data/person-identity.ts. That file is the source of
// truth; keeping the two in step is what this comment is for.
const CAMPAIGN_PREFIXES = ['comms:', 'campaign-stage:', 'engagement:', 'audience-'];
const NOT_A_SEND = new Set(['comms:manual-relationship']);
const isCampaignTag = (t) => !NOT_A_SEND.has(t) && CAMPAIGN_PREFIXES.some((p) => t.startsWith(p));

const ROLE_IS_ONLY_A_DESCRIPTION = new Set(['role:storyteller', 'role:community']);
const isWorkingRelationshipTag = (t) =>
  !ROLE_IS_ONLY_A_DESCRIPTION.has(t) && (t.startsWith('relationship:') || t.startsWith('role:') || t === 'tier:member');

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const { data: tellers, error: tErr } = await sb.from('storytellers').select('slug,display_name,aliases,consent_tier');
if (tErr) { console.error('storytellers read failed:', tErr.message); process.exit(1); }
const { data: contacts, error: cErr } = await sb.from('crm_contacts').select('name,email,organization,empathy_ledger_id');
if (cErr) { console.error('crm_contacts read failed:', cErr.message); process.exit(1); }

const KEY = process.env.GHL_API_KEY;
const LOC = process.env.GHL_LOCATION_ID;
const ghl = [];
if (KEY && LOC && process.env.GHL_ENABLED !== 'false') {
  let url = `https://services.leadconnectorhq.com/contacts/?locationId=${LOC}&limit=100`;
  for (let page = 0; page < 60 && url; page++) {
    const r = await fetch(url, { headers: { Authorization: `Bearer ${KEY}`, Version: '2021-07-28', Accept: 'application/json' } });
    if (!r.ok) { console.error(`GHL read failed: ${r.status}`); process.exit(1); }
    const j = await r.json();
    for (const c of j.contacts ?? []) {
      ghl.push({ id: c.id, name: [c.firstName, c.lastName].filter(Boolean).join(' ') || c.contactName || '', email: c.email || '', tags: c.tags || [] });
    }
    url = j.meta?.nextPageUrl ?? null;
  }
} else {
  console.log('GHL is off in this environment. Skipping the send-side check.');
}

/**
 * TWO ROWS FOR ONE PERSON IS A CONSENT DEFECT. It fails the check instead of printing a count.
 *
 * Found 17 September 2026 by the identity backfill: 34 storyteller rows, 32 distinct people.
 * Both copies are gated today, so nothing is exposed. The hole is what happens next. Every
 * lookup in this repo resolves a storyteller by NAME, so with two rows a lookup takes whichever
 * the map hit last. Clear one copy and a name lookup can return the cleared row for a person
 * whose other record still says gated.
 */
const byName = new Map();
for (const t of tellers) {
  const k = personKey(t.display_name);
  byName.set(k, [...(byName.get(k) ?? []), t]);
}
const dupes = [...byName.values()].filter((rows) => rows.length > 1);

const gated = tellers.filter((t) => t.consent_tier === 'gated');
const gatedKeys = new Map();
for (const t of gated) for (const sp of [t.display_name, t.slug, ...(t.aliases ?? [])]) if (sp) gatedKeys.set(personKey(sp), t);

const ccKeys = new Set(contacts.map((c) => personKey(c.name)));
const ghlEmails = new Set(ghl.map((g) => emailKey(g.email)).filter(Boolean));
const ghlNames = new Set(ghl.map((g) => personKey(g.name)).filter(Boolean));

const inBoth = contacts.filter((c) => ghlEmails.has(emailKey(c.email)) || ghlNames.has(personKey(c.name)));
const tellersInCrm = gated.filter((t) => ccKeys.has(personKey(t.display_name)));

console.log(`GHL: ${ghl.length} contacts. crm_contacts: ${contacts.length}. storytellers: ${tellers.length}, gated: ${gated.length}.`);
console.log(`  crm_contacts rows with a GHL counterpart:   ${inBoth.length}`);
console.log(`  crm_contacts rows GHL does not hold:        ${contacts.length - inBoth.length}`);
console.log(`  gated storytellers carried in crm_contacts: ${tellersInCrm.length} of ${gated.length}`);
console.log(`  crm_contacts rows with an empathy_ledger_id: ${contacts.filter((c) => c.empathy_ledger_id).length}`);
console.log(`  distinct organization strings:              ${new Set(contacts.map((c) => (c.organization ?? '').trim()).filter(Boolean)).size}`);

for (const rows of dupes) {
  console.error(`  DUPLICATE consent record for ${rows[0].display_name}:`);
  for (const r of rows) console.error(`    storytellers/${r.slug}  tier ${r.consent_tier}`);
}

const breaches = [];
for (const g of ghl) {
  const teller = gatedKeys.get(personKey(g.name));
  if (!teller) continue;
  const sends = g.tags.filter(isCampaignTag);
  if (!sends.length) continue;
  const roles = g.tags.filter(isWorkingRelationshipTag);
  const line = `${teller.display_name} (storytellers/${teller.slug}, tier gated) is in GHL as ${g.id} carrying ${sends.join(', ')}`;
  if (roles.length) console.log(`  OK: ${line}\n      Written to as ${roles.join(', ')}, which is a relationship and not a voice.`);
  else breaches.push(line);
}

if (dupes.length) {
  console.error(`\n${dupes.length === 1 ? 'One person has' : dupes.length + ' people have'} more than one storyteller row.`);
  console.error('Every lookup here resolves a storyteller by name, so two rows means a lookup takes');
  console.error('whichever it hit last. Merge them, keeping the row the code already points at.');
  process.exit(1);
}

if (breaches.length) {
  console.error(`\n${breaches.length} gated storyteller${breaches.length === 1 ? '' : 's'} in something that sends, with no other relationship on the record:`);
  for (const b of breaches) console.error(`  - ${b}`);
  console.error('\nStorytelling is all we hold about them, so this send reaches a gated voice.');
  console.error('Either record the relationship that justifies writing to them, or drop the tag.');
  process.exit(1);
}
console.log('\nEverybody in a send list has a relationship on the record beyond their story.');
