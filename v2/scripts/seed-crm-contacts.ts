/**
 * Seed the crm_contacts hub from every GOODS-scoped person store.
 * Idempotent: matches existing rows by metadata.identity_key (then email/phone/
 * normalised name) and PATCHes; new people are POSTed. Never deletes.
 *
 * Run: node --experimental-strip-types --env-file=.env.local scripts/seed-crm-contacts.ts
 * Approved by Ben 2026-07-19 ("seed the contacts hub", Goods contacts only).
 *
 * Sources (all Goods): storyteller-registry, team, compendium (advisory board,
 * community partner contacts, funding contacts), outreach-targets, communities
 * key_people/procurement_contacts (live), assets recipient/owner names (live),
 * community_demand.requested_by (live).
 */
import { STORYTELLER_REGISTRY } from '../src/lib/data/storyteller-registry';
import { team } from '../src/lib/data/team';
import { advisoryBoard, communityPartners, funding } from '../src/lib/data/compendium';
import { allTargets } from '../src/lib/data/outreach-targets';

const URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/"/g, '');
const KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/"/g, '');
if (!URL || !KEY) throw new Error('Missing env — run with --env-file=.env.local');
const HEADERS = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };

type Draft = {
  name: string;
  email?: string | null;
  phone?: string | null;
  organization?: string | null;
  job_title?: string | null;
  location?: string | null;
  roles: string[];
  tags: string[];
  is_elder?: boolean;
  bio?: string | null;
  sources: string[];
  storyteller_slug?: string;
  aliases?: string[];
};

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();
const digits = (s: string) => s.replace(/\D/g, '');

const drafts = new Map<string, Draft>();
const aliasIndex = new Map<string, string>(); // norm(alias) -> identity key
function identityFor(d: Draft): string {
  if (d.storyteller_slug) return `slug:${d.storyteller_slug}`;
  const existingByAlias = aliasIndex.get(norm(d.name));
  if (existingByAlias) return existingByAlias;
  if (d.email) return `email:${norm(d.email)}`;
  if (d.phone && digits(d.phone).length >= 8) return `phone:${digits(d.phone)}`;
  return `name:${norm(d.name)}`;
}
function add(d: Draft) {
  if (!d.name || norm(d.name).length < 3) return;
  const key = identityFor(d);
  const prev = drafts.get(key);
  if (prev) {
    prev.roles = [...new Set([...prev.roles, ...d.roles])];
    prev.tags = [...new Set([...prev.tags, ...d.tags])];
    prev.sources = [...new Set([...prev.sources, ...d.sources])];
    prev.email ||= d.email;
    prev.phone ||= d.phone;
    prev.organization ||= d.organization;
    prev.job_title ||= d.job_title;
    prev.location ||= d.location;
    prev.bio ||= d.bio;
    prev.is_elder ||= d.is_elder;
  } else {
    drafts.set(key, { ...d });
    for (const a of [d.name, ...(d.aliases || [])]) aliasIndex.set(norm(a), key);
  }
}

// 1. Storytellers (canonical voice authority; ORG-people like councils excluded — they are orgs)
for (const s of STORYTELLER_REGISTRY) {
  if (s.tier === 'internal') continue;
  add({
    name: s.name,
    storyteller_slug: s.slug,
    aliases: s.aliases,
    roles: ['storyteller'],
    tags: [`tier:${s.tier}`],
    location: s.community || null,
    job_title: s.role || null,
    is_elder: /elder/i.test(s.role || ''),
    sources: ['storyteller-registry'],
  });
}
// 2. Team
for (const t of team) add({ name: t.name, email: t.email, job_title: t.role, roles: ['staff'], tags: [], bio: t.bio, sources: ['team.ts'] });
// 3. Compendium
for (const a of advisoryBoard as Array<{ name: string; organisation?: string; email?: string; role?: string }>)
  add({ name: a.name, email: a.email, organization: a.organisation, job_title: a.role, roles: ['advisory'], tags: [], sources: ['compendium.advisoryBoard'] });
for (const org of communityPartners as Array<{ name: string; contacts?: Array<{ name: string; role?: string; email?: string }> }>)
  for (const c of org.contacts || [])
    add({ name: c.name, email: c.email, organization: org.name, job_title: c.role, roles: ['partner'], tags: [], sources: ['compendium.communityPartners'] });
for (const f of funding as Array<{ source: string; contact?: string; contactEmail?: string }>)
  if (f.contact) add({ name: f.contact, email: f.contactEmail, organization: f.source, roles: ['funder'], tags: [], sources: ['compendium.funding'] });
// 4. Outreach targets
for (const t of allTargets as Array<{ name: string; category?: string; contactName?: string; contactEmail?: string }>)
  if (t.contactName)
    add({
      name: t.contactName,
      email: t.contactEmail,
      organization: t.name,
      roles: [/buyer|procure/i.test(t.category || '') ? 'buyer' : /philanthrop|funder|capital/i.test(t.category || '') ? 'philanthropy' : 'supporter'],
      tags: [`outreach:${t.category || 'unknown'}`],
      sources: ['outreach-targets'],
    });

async function rest(path: string): Promise<unknown[]> {
  const res = await fetch(`${URL}/rest/v1/${path}`, { headers: HEADERS });
  if (!res.ok) throw new Error(`${path}: ${res.status} ${await res.text()}`);
  return res.json() as Promise<unknown[]>;
}

const main = async () => {
  // 5. Communities key_people + procurement (live)
  const comms = (await rest('communities?select=id,name,key_people,procurement_contacts')) as Array<{
    id: string; name: string;
    key_people: Array<{ name: string; role?: string; org?: string; storytellerSlug?: string; note?: string }> | null;
    procurement_contacts: Array<{ name: string; org?: string; note?: string }> | null;
  }>;
  for (const c of comms) {
    for (const p of c.key_people || [])
      add({ name: p.name, storyteller_slug: p.storytellerSlug, organization: p.org, job_title: p.role, location: c.name, roles: ['community_leader'], tags: [], bio: p.note, sources: [`communities.key_people:${c.id}`] });
    for (const p of c.procurement_contacts || [])
      add({ name: p.name, organization: p.org || p.name, location: c.name, roles: ['procurement'], tags: [], bio: p.note, sources: [`communities.procurement:${c.id}`] });
  }
  // 6. Bed recipients (live, free text — becomes real people rows)
  const assets = (await rest('assets?select=unique_id,community,recipient_name,display_name,contact_household&status=eq.deployed&limit=3000')) as Array<{
    unique_id: string; community: string | null; recipient_name: string | null; display_name: string | null; contact_household: string | null;
  }>;
  for (const a of assets) {
    const nm = a.recipient_name || a.display_name;
    if (nm && !/^\+?\d+$/.test(nm))
      add({ name: nm, phone: a.contact_household && /\d{8,}/.test(a.contact_household) ? a.contact_household : null, location: a.community, roles: [], tags: ['recipient', `asset:${a.unique_id}`], sources: ['assets'] });
  }
  // 7. Demand requesters (live)
  const demand = (await rest('community_demand?select=requested_by,community_id&limit=500')) as Array<{ requested_by: string | null; community_id: string }>;
  for (const d of demand)
    if (d.requested_by && !/^\+?\d+$/.test(d.requested_by))
      add({ name: d.requested_by, location: d.community_id, roles: [], tags: ['demand-requester'], sources: ['community_demand'] });

  // Match against existing crm_contacts
  const existing = (await rest('crm_contacts?select=id,name,email,phone,metadata&limit=2000')) as Array<{
    id: string; name: string; email: string | null; phone: string | null; metadata: Record<string, unknown> | null;
  }>;
  const existingIndex = new Map<string, string>();
  for (const e of existing) {
    const ik = (e.metadata as { identity_key?: string } | null)?.identity_key;
    if (ik) existingIndex.set(ik, e.id);
    if (e.email) existingIndex.set(`email:${norm(e.email)}`, e.id);
    if (e.phone) existingIndex.set(`phone:${digits(e.phone)}`, e.id);
    existingIndex.set(`name:${norm(e.name)}`, e.id);
  }

  let created = 0, updated = 0;
  for (const [key, d] of drafts) {
    const row = {
      name: d.name,
      email: d.email || null,
      phone: d.phone || null,
      organization: d.organization || null,
      job_title: d.job_title || null,
      location: d.location || null,
      roles: d.roles,
      tags: d.tags,
      is_elder: !!d.is_elder,
      bio: d.bio || null,
      status: 'active',
      metadata: { identity_key: key, sources: d.sources, storyteller_slug: d.storyteller_slug || null, seeded: '2026-07-19' },
    };
    const existingId = existingIndex.get(key) || existingIndex.get(`name:${norm(d.name)}`);
    const res = existingId
      ? await fetch(`${URL}/rest/v1/crm_contacts?id=eq.${existingId}`, { method: 'PATCH', headers: { ...HEADERS, Prefer: 'return=minimal' }, body: JSON.stringify(row) })
      : await fetch(`${URL}/rest/v1/crm_contacts`, { method: 'POST', headers: { ...HEADERS, Prefer: 'return=minimal' }, body: JSON.stringify(row) });
    if (!res.ok) {
      console.error('FAIL', d.name, res.status, await res.text());
      continue;
    }
    existingId ? updated++ : created++;
  }
  console.log(`crm_contacts seed: ${created} created, ${updated} updated, ${drafts.size} unique people from ${[...new Set([...drafts.values()].flatMap((d) => d.sources))].length} sources`);
};

main();
