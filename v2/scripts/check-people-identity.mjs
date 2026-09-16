/**
 * READ-ONLY guard across the three people systems.
 *
 * Goods holds people in three places and nothing joins them: GHL (the outreach CRM, where a send
 * comes from), Supabase `crm_contacts` (relationships, mostly community, half of them absent from
 * GHL), and Supabase `storytellers` (the consent authority, every row gated).
 *
 * THE ONE THING IT FAILS ON: a person on the gated storyteller list holding a GHL tag that puts
 * them in something that sends. That is unambiguous and it is the failure worth stopping, because
 * a campaign built from a tag has no way of knowing the person's voice is consent-gated.
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

/**
 * The two people already in this state on 17 September 2026, with the reason each is here.
 * Neither is a clear breach, and that is exactly why they are written down instead of silenced:
 * the same human is in two roles and nothing on either record says so. A THIRD case fails the
 * build, which is the point.
 *
 * For Ben to rule on. Removing a line from here without moving the tag or the tier makes the
 * guard lie.
 */
const KNOWN = [
  {
    slug: 'katrina-bloomfield',
    why: 'Her campaign tags are ACT Harvest (comms:harvest-newsletter, project:act-hv, tier:member), a different project. Nothing Goods sends reaches her through them.',
  },
  {
    slug: 'jimmy-frank',
    why: 'Carries comms:goods-newsletter at jf@wilyajanta.org, a work address. He is Wilya Janta staff and a gated storyteller at the same time, and no record holds both facts.',
  },
];

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

const breaches = [];
for (const g of ghl) {
  const teller = gatedKeys.get(personKey(g.name));
  if (!teller) continue;
  const sends = g.tags.filter(isCampaignTag);
  if (!sends.length) continue;
  const known = KNOWN.find((k) => k.slug === teller.slug);
  const line = `${teller.display_name} (storytellers/${teller.slug}, tier gated) is in GHL as ${g.id} carrying ${sends.join(', ')}`;
  if (known) console.log(`  KNOWN: ${line}\n         ${known.why}`);
  else breaches.push(line);
}

const stale = KNOWN.filter((k) => !gated.some((t) => t.slug === k.slug));
for (const k of stale) console.log(`  KNOWN entry "${k.slug}" no longer matches a gated storyteller. Delete it.`);

if (breaches.length) {
  console.error(`\n${breaches.length} gated storyteller${breaches.length === 1 ? '' : 's'} in something that sends, and not written down:`);
  for (const b of breaches) console.error(`  - ${b}`);
  console.error('\nEither the consent tier moved, or the tag is wrong, or it belongs in KNOWN with a reason.');
  process.exit(1);
}
console.log('\nNo gated storyteller is in a campaign audience that has not been written down.');
