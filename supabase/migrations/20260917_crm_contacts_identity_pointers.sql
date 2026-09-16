-- crm_contacts gets two pointers, and deliberately no third copy of anybody's consent.
--
-- Ben, 17 September 2026, asked for storyteller_id and ghl_contact_id, thinking about how
-- Empathy Ledger storytellers fit the philosophy the platform was built on.
--
-- WHY POINTERS AND NOT FIELDS. All 34 storytellers are already carried in crm_contacts, every
-- one tier `gated`, and the row says nothing about it. The fix is a link to the authority, never
-- a copy of the tier. A copied tier drifts, and the moment it drifts the CRM has quietly become
-- a second authority on somebody else's consent. `storytellers` stays the only place a tier is
-- decided, exactly as storyteller-registry.ts is the only place an alias resolves.
--
-- DEFAULT-DENY SURVIVES THE JOIN. A contact with a NULL storyteller_id is not thereby cleared.
-- It means nobody has checked. Absence of a link is never evidence of consent, and no surface
-- may read it as one.
--
-- WHAT THE LINK IS FOR. Consent attaches to the voice, never to the whole person (Ben, same day,
-- on Jimmy Frank: "a storyteller and community partner for the Harvest and Goods"). So the
-- pointer does not stop anybody being written to. It makes the second fact discoverable from the
-- CRM, so a person looking at a contact can see the voice is gated instead of finding an
-- ordinary contact row. scripts/check-people-identity.mjs does that join at read time today;
-- these columns make it a stored fact that can be checked cheaply.

alter table public.crm_contacts
  add column if not exists storyteller_id uuid references public.storytellers (id) on delete set null,
  add column if not exists ghl_contact_id text;

comment on column public.crm_contacts.storyteller_id is
  'Pointer to the consent authority in public.storytellers. NEVER copy consent_tier onto this table: storytellers is the only place a tier is decided. NULL means nobody has checked, and never that the contact is cleared.';

comment on column public.crm_contacts.ghl_contact_id is
  'The GHL contact id, which is where a send comes from. Lets the consent join be a stored fact instead of a name match at read time.';

create unique index if not exists crm_contacts_storyteller_id_key
  on public.crm_contacts (storyteller_id) where storyteller_id is not null;

create unique index if not exists crm_contacts_ghl_contact_id_key
  on public.crm_contacts (ghl_contact_id) where ghl_contact_id is not null;
