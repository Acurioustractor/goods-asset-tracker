#!/usr/bin/env node
/**
 * FILL crm_contacts.grantscope_id, WHICH HAS ALWAYS BEEN EMPTY.
 *
 * The column exists so a contact's organisation can be looked up in grantscope — 609,631
 * entities carrying ABNs, ACNC revenue, Supply Nation certification and community-control tier.
 * On 17 September 2026 it was populated on 0 of 135 contacts. The field was added and never
 * filled, which is most of why grantscope has felt unreachable from Goods: the join was designed
 * and then left as an empty column.
 *
 * MATCHING IS DELIBERATELY TIMID. Organisation names are free text typed by people ("Miwatj
 * Health" for "Miwatj Health Aboriginal Corporation"), so this normalises away the noise words —
 * the, ltd, pty, aboriginal, corporation — and then demands an EXACT match on what is left, with
 * exactly one candidate. Anything ambiguous or partial is reported and skipped, never guessed.
 * A wrong grantscope_id is worse than an empty one: it would silently attribute another
 * organisation's contracts and revenue to a contact of ours.
 *
 *   node scripts/link-contacts-to-grantscope.mjs           # dry run, prints the plan
 *   node scripts/link-contacts-to-grantscope.mjs --write    # apply
 *
 * Needs NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ACT_INFRA_SUPABASE_URL,
 * ACT_INFRA_SUPABASE_KEY. Read-only against grantscope; only ever writes to Goods.
 */

const GU = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '');
const GK = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
const AU = (process.env.ACT_INFRA_SUPABASE_URL ?? '').replace(/\/$/, '');
const AK = process.env.ACT_INFRA_SUPABASE_KEY ?? '';
const WRITE = process.argv.includes('--write');

if (!GU || !GK || !AU || !AK) {
  console.error('Missing Goods or ACT infrastructure credentials.');
  process.exit(2);
}

const get = async (base, key, path) => {
  const r = await fetch(`${base}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  return r.ok ? r.json() : [];
};

/**
 * Strip the words that differ between how a person types an organisation and how the register
 * records it. "Miwatj Health" and "Miwatj Health Aboriginal Corporation" both reduce to "miwatj
 * health"; two genuinely different bodies do not collide under this.
 */
const norm = (s) =>
  s
    .toLowerCase()
    // A trust is registered as "The Trustee For <name>". That prefix is a legal form, not part of
    // the organisation's name, and stripping it is what lets "Snow Foundation" meet "The Trustee
    // For The Snow Foundation". It is a rule about Australian registration, not a fuzzy guess.
    .replace(/^\s*the\s+trustee\s+for\s+/, '')
    .replace(/\b(the|ltd|limited|pty|inc|incorporated|corporation|aboriginal|corp)\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

async function main() {
  const contacts = await get(GU, GK, 'crm_contacts?select=id,name,organization,grantscope_id&limit=1000');
  const withOrg = contacts.filter((c) => c.organization?.trim());
  const orgs = [...new Set(withOrg.map((c) => c.organization.trim()))];

  const resolved = new Map();
  const ambiguous = [];
  const unmatched = [];

  for (const org of orgs) {
    const enc = encodeURIComponent(org.replace(/[(),]/g, ' ').trim());
    const rows = await get(AU, AK, `gs_entities?select=gs_id,canonical_name,abn,state&canonical_name=ilike.*${enc}*&limit=8`);
    if (!rows.length) { unmatched.push(org); continue; }
    const target = norm(org);
    const strong = rows.filter((r) => norm(r.canonical_name) === target);
    if (strong.length === 1) resolved.set(org, strong[0]);
    else ambiguous.push({ org, candidates: rows.slice(0, 3).map((r) => r.canonical_name) });
  }

  const plan = withOrg
    .filter((c) => resolved.has(c.organization.trim()) && !c.grantscope_id)
    .map((c) => ({ id: c.id, name: c.name, gsId: resolved.get(c.organization.trim()).gs_id, org: c.organization.trim() }));

  console.log(`contacts                 : ${contacts.length}`);
  console.log(`with an organisation     : ${withOrg.length}  (${orgs.length} distinct)`);
  console.log(`organisations resolved   : ${resolved.size}`);
  console.log(`ambiguous (skipped)      : ${ambiguous.length}`);
  console.log(`no match (skipped)       : ${unmatched.length}`);
  console.log(`CONTACTS TO LINK         : ${plan.length}`);

  if (ambiguous.length) {
    console.log('\nambiguous — a human should decide these:');
    for (const a of ambiguous.slice(0, 15)) {
      console.log(`  ${a.org.slice(0, 38).padEnd(40)} ? ${a.candidates.join(' | ').slice(0, 90)}`);
    }
  }

  if (!WRITE) {
    console.log('\nDry run. Re-run with --write to apply.');
    return;
  }

  let ok = 0;
  for (const p of plan) {
    const r = await fetch(`${GU}/rest/v1/crm_contacts?id=eq.${p.id}`, {
      method: 'PATCH',
      headers: {
        apikey: GK,
        Authorization: `Bearer ${GK}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ grantscope_id: p.gsId }),
    });
    if (r.ok) ok += 1;
    else console.error(`  FAILED ${r.status} ${p.name}`);
  }
  console.log(`\nlinked ${ok} of ${plan.length} contacts`);
}

main().catch((e) => { console.error(e); process.exit(2); });
