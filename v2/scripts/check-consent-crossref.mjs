/**
 * READ-ONLY cross-reference between the two systems that each hold half of consent.
 *
 * Ben, 17 September 2026: think about the connection to the Empathy Ledger impact and
 * storyteller framework, and how to apply it across the two repos.
 *
 * READ `consents`, NOT `extracted_quotes`. The first version of this file read
 * `extracted_quotes.public_display_consented`, found it false for every Goods voice, and reported
 * sixteen people as a consent divergence. That was the wrong authority and the finding was wrong.
 * Ben: "we did a full audio and consent acknowledgment for all Goods."
 *
 * He is right and it is in the database. The `consents` table holds 673 rows, 665 of them active,
 * and 206 were recorded IN PERSON, self-spoken, every one of them on 14 September 2026. The
 * `others_present` column carries the room: "Both Carmelita and Colette said...", "Ben Knight,
 * recording...". `given_as` separates self_spoken from org_steward, community_authority and
 * guardian, which is the distinction that matters and which no column on a quote can express.
 *
 * WHAT EACH SYSTEM HOLDS.
 *
 *   Empathy Ledger governs CONSENT, in `consents`, typed (story, sharing, ai, photo,
 *   youth_media_capture), with who gave it, how it was recorded, the day it was spoken, who else
 *   was in the room, and a withdrawal path that has been used twice.
 *
 *   Goods governs whether GOODS may use a voice, in storyteller-registry.ts, as a tier. `external`
 *   means it can appear on a page a stranger can open.
 *
 * That division is right. A person can consent to Empathy Ledger holding their words and still
 * not have agreed to a Goods funder deck, and the reverse. What was missing is any way for one
 * system to see the other, so neither could corroborate and no check could run.
 *
 * WHAT THE COUNTING FOUND, 17 September 2026.
 *
 *   30 of the 32 Goods storytellers exist in Empathy Ledger. `el_uuid`, the column built to hold
 *   the link, was filled zero times. Backfilled the same day on unambiguous name matches; Dorrie
 *   Jones and Ray Nelson have no Empathy Ledger record at all.
 *
 *   Across all 3,057 extracted quotes, 215 carry `public_display_consented: true`, so the column
 *   is live and maintained. None of the 215 belong to a Goods voice. Of the Goods voices' own
 *   quotes, org approval is common and the person's own public-display consent is recorded on
 *   none of them.
 *
 *   Sixteen people are `tier: 'external'` in the Goods registry while Empathy Ledger holds no
 *   public-display consent for any of their quotes.
 *
 * WHAT THAT IS AND IS NOT. Ben ruled on 11 September that the Empathy Ledger consent is approved,
 * by community and super-admin. That ruling stands and this script does not relitigate it. The
 * gap is that the ruling lives in a decision and not in the column Empathy Ledger's own framework
 * says is decisive, so the two systems cannot corroborate each other and the only thing between a
 * gated voice and a public page is that somebody remembered. That is the exact shape of the
 * consent leak found on 16 September.
 *
 * So this reports, and names the people, and does not fail. It fails on one thing only: a Goods
 * voice with no `el_uuid` where Empathy Ledger plainly has a record, because an unlinked person
 * is a check that silently cannot run.
 *
 *   node --env-file=.env.local scripts/check-consent-crossref.mjs   (run from v2/)
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const norm = (s) => (s ?? '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

const goods = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const el = createClient(process.env.EMPATHY_LEDGER_SUPABASE_URL, process.env.EMPATHY_LEDGER_SUPABASE_KEY);

const { data: tellers, error: tErr } = await goods.from('storytellers').select('slug,display_name,el_uuid,consent_tier');
if (tErr) { console.error('storytellers read failed:', tErr.message); process.exit(1); }

const { data: elTellers, error: eErr } = await el.from('storytellers').select('id,display_name');
if (eErr) { console.error('Empathy Ledger read failed:', eErr.message); process.exit(1); }

const { data: consents, error: cErr } = await el
  .from('consents')
  .select('storyteller_id,consent_type,status,given_as,recorded_method,spoken_on')
  .range(0, 4999);
if (cErr) { console.error('consents read failed:', cErr.message); process.exit(1); }

// The Goods code registry is the authority on what Goods may publish.
const registrySrc = readFileSync(new URL('../src/lib/data/storyteller-registry.ts', import.meta.url), 'utf8');
const registry = [...registrySrc.matchAll(/\{\s*slug: '([^']+)',[\s\S]{0,600}?name: '((?:[^'\\]|\\.)*)'[\s\S]{0,600}?tier: '([a-z-]+)'/g)]
  .map((m) => ({ slug: m[1], name: m[2].replace(/\\'/g, "'"), tier: m[3] }));

const elByName = new Map();
for (const t of elTellers) if (t.display_name) elByName.set(norm(t.display_name), t);

const byStoryteller = new Map();
for (const c of consents) {
  if (c.status !== 'active' || !c.storyteller_id) continue;
  const row = byStoryteller.get(c.storyteller_id) ?? { types: new Set(), givenAs: new Set(), spokenOn: null };
  row.types.add(c.consent_type);
  row.givenAs.add(c.given_as);
  if (c.spoken_on) row.spokenOn = c.spoken_on;
  byStoryteller.set(c.storyteller_id, row);
}
const spoken = consents.filter((c) => c.recorded_method === 'in_person');

console.log(`Goods storytellers: ${tellers.length}, linked to Empathy Ledger: ${tellers.filter((t) => t.el_uuid).length}`);
console.log(`Empathy Ledger storytellers: ${elTellers.length}. Consents: ${consents.length}, active ${consents.filter((c) => c.status === 'active').length}, spoken in person ${spoken.length}.`);

const unlinked = tellers.filter((t) => !t.el_uuid && elByName.has(norm(t.display_name)));
const absent = tellers.filter((t) => !t.el_uuid && !elByName.has(norm(t.display_name)));
if (absent.length) console.log(`  ${absent.length} Goods voice${absent.length === 1 ? ' has' : 's have'} no Empathy Ledger record: ${absent.map((t) => t.display_name).join(', ')}`);

const withConsent = [];
const without = [];
for (const t of tellers) {
  const row = t.el_uuid ? byStoryteller.get(t.el_uuid) : undefined;
  if (row) withConsent.push({ t, row });
  else without.push(t);
}

console.log(`
Goods voices with an active consent record: ${withConsent.length} of ${tellers.length}`);
for (const { t, row } of withConsent) {
  console.log(`  ${t.display_name.padEnd(24)} ${[...row.types].sort().join(', ').padEnd(16)} as ${[...row.givenAs].sort().join(', ')}${row.spokenOn ? ` · spoken ${row.spokenOn}` : ''}`);
}
if (without.length) {
  console.log(`
${without.length} Goods voices with no consent row in Empathy Ledger:`);
  console.log(`  ${without.map((t) => t.display_name).join(', ')}`);
  console.log('  That is a gap in the record, and never a finding about the person. The tier in');
  console.log('  storyteller-registry.ts is what governs whether Goods may use a voice today.');
}

if (unlinked.length) {
  console.error(`\n${unlinked.length} Goods voice${unlinked.length === 1 ? '' : 's'} with an Empathy Ledger record and no el_uuid:`);
  for (const t of unlinked) console.error(`  - ${t.display_name} (storytellers/${t.slug})`);
  console.error('\nAn unlinked person is a consent check that silently cannot run. Backfill el_uuid.');
  process.exit(1);
}
console.log('\nEvery Goods voice Empathy Ledger knows about is linked.');
