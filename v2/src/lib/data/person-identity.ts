/**
 * WHO A PERSON IS, across the three systems that each hold part of the answer.
 *
 * Ben, 17 September 2026, after the admin sweep: a better way to align the different data in a
 * contact and tokenised way. This is the people half of that. The places half is
 * place-registry.ts and the same idea applies: one normaliser, one resolver, and a guard that
 * fails. A convention that everyone is trusted to hold is what produced this.
 *
 * THE THREE SYSTEMS, counted 17 September 2026.
 *
 *   GHL, 3,715 contacts. The outreach CRM. Tags, campaigns, pipelines. This is where a send
 *   comes from, so a person being here has consequences.
 *
 *   Supabase `crm_contacts`, 135 rows. Read by three admin surfaces. It looked like a failed
 *   copy of GHL, and it is not: 68 of its 135 rows have no GHL counterpart at all, and those 68
 *   are Elders, community people and organisations. It holds the relationships GHL does not.
 *
 *   Supabase `storytellers`, 34 rows, joined by storyteller-registry.ts. The consent authority.
 *   Every one of the 34 is `consent_tier: 'gated'`.
 *
 * WHAT THE COUNTING FOUND, and it is the reason this file exists.
 *
 *   All 34 storytellers are also carried in `crm_contacts`, with no column pointing at their
 *   consent record. `crm_contacts` has an `empathy_ledger_id` (11 of 135 filled) and no
 *   `storyteller_id` at all. So a gated voice sits in a contact table beside funders and buyers
 *   with nothing on the row that says the voice is gated.
 *
 *   Two of the 34 are also in GHL, and one of them carries `comms:goods-newsletter`.
 *
 *   The three token columns that were built for exactly this are empty: `grantscope_id` 0 of 135,
 *   `compendium_partner_id` 0 of 135, `supabase_partner_id` 0 of 135.
 *
 * WHAT THIS FILE DOES NOT CLAIM. `lane:community` in GHL is carried by 86 contacts and 31 of
 * them also carry a campaign tag. Reading the list, the tag means two different things: "is a
 * community member" and "works in the community lane". Most of the 31 are staff at community
 * organisations and funders, on work addresses, and a newsletter to them is ordinary. That
 * ambiguity is a real defect and it is no consent breach, so nothing here tests it.
 *
 * ---------------------------------------------------------------------------
 * CONSENT ATTACHES TO THE VOICE, NEVER TO THE WHOLE PERSON
 * ---------------------------------------------------------------------------
 *
 * Ben, 17 September 2026, asked about Jimmy Frank carrying `comms:goods-newsletter` while sitting
 * on the gated storyteller list: "Jimmy Frank is a storyteller and community partner for the
 * Harvest and Goods."
 *
 * That is the ruling, and it is the Empathy Ledger philosophy stated plainly. A consent tier
 * governs what may be done with somebody's STORY. It has never governed whether we may write to
 * them about the work they partner on. Jimmy is both things at once, and the platform was built
 * so a person can be.
 *
 * It follows that the test worth running is not "is a gated storyteller in a send list", which
 * fails on a partner doing their job. It is:
 *
 *     Is somebody in a send list, and is being a storyteller the ONLY thing we record about them?
 *
 * If storytelling is the only relationship on the record, then writing to them is writing to a
 * voice, and a voice is what the tier governs. If they also hold a partner, member or staff
 * relationship, the send is to that role and the tier is untouched.
 *
 * Two further things the platform's philosophy makes non-negotiable here, and they shape the
 * schema as much as the guard:
 *
 *   The tier is never copied. `crm_contacts` gets a `storyteller_id` POINTER to the authority and
 *   no `consent_tier` column of its own. A copy drifts, and the moment it drifts the CRM has
 *   quietly become a second authority on somebody else's consent.
 *
 *   Default-deny survives the join. A contact with no `storyteller_id` is not thereby cleared;
 *   it means nobody has checked. Absence of a link is never evidence of consent.
 */

/**
 * Fold a person's name to a comparison key. The same shape as `placeKey`, deliberately, because
 * four different normalisers in one repo is how "Galiwinku" and "Galiwin'ku" became two places.
 */
export function personKey(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export function emailKey(input: string | null | undefined): string {
  return (input ?? '').trim().toLowerCase();
}

/**
 * GHL tag prefixes that put a person into something that sends. A tag outside this list is a
 * description of the person; a tag inside it is a decision to contact them.
 */
export const CAMPAIGN_TAG_PREFIXES = ['comms:', 'campaign-stage:', 'engagement:', 'audience-'] as const;

/** A tag that is a description and never a send, even though it starts with a campaign prefix. */
const NOT_A_SEND = new Set(['comms:manual-relationship']);

export function isCampaignTag(tag: string): boolean {
  if (NOT_A_SEND.has(tag)) return false;
  return CAMPAIGN_TAG_PREFIXES.some((p) => tag.startsWith(p));
}

/**
 * Tags that record a working relationship, which is to say a reason to be in touch that has
 * nothing to do with somebody's story.
 *
 * `role:storyteller` is excluded because it is the thing being tested. `role:community` is
 * excluded too: it says somebody is a community member, which is a description of who they are
 * and not a relationship they have agreed to conduct with us.
 */
const ROLE_IS_ONLY_A_DESCRIPTION = new Set(['role:storyteller', 'role:community']);

export function isWorkingRelationshipTag(tag: string): boolean {
  if (ROLE_IS_ONLY_A_DESCRIPTION.has(tag)) return false;
  return tag.startsWith('relationship:') || tag.startsWith('role:') || tag === 'tier:member';
}

/**
 * The test, per Ben's ruling of 17 September 2026. True when the only thing we record about a
 * person is that they tell stories, which makes any send to them a send to a gated voice.
 */
export function storytellingIsTheOnlyRelationship(tags: readonly string[]): boolean {
  return !tags.some(isWorkingRelationshipTag);
}

export interface PersonLike {
  name?: string | null;
  email?: string | null;
}

/**
 * Match a person across two lists on email first, then on an exact normalised name. Nothing
 * fuzzy: a near-match on a person is how the wrong human ends up in a send.
 */
export function makePersonMatcher<T extends PersonLike>(people: T[]) {
  const byEmail = new Map<string, T>();
  const byName = new Map<string, T[]>();
  for (const p of people) {
    const e = emailKey(p.email);
    if (e) byEmail.set(e, p);
    const n = p.name ? personKey(p.name) : '';
    if (n) byName.set(n, [...(byName.get(n) ?? []), p]);
  }
  return {
    /** The match, and how it was made, so a caller can treat a name match with more suspicion. */
    match(candidate: PersonLike): { person: T; on: 'email' | 'name'; ambiguous: boolean } | null {
      const e = emailKey(candidate.email);
      const byE = e ? byEmail.get(e) : undefined;
      if (byE) return { person: byE, on: 'email', ambiguous: false };
      const n = candidate.name ? personKey(candidate.name) : '';
      const hits = n ? byName.get(n) : undefined;
      if (!hits?.length) return null;
      return { person: hits[0], on: 'name', ambiguous: hits.length > 1 };
    },
  };
}
