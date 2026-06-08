/**
 * Canonical GHL tag contract for Goods (project:act-gd)
 * ============================================================================
 *
 * ONE GHL account ("A Curious Tractor") · ONE canonical, namespaced tag
 * contract across every ACT web surface. This module brings the Goods site's
 * flat `goods-*` vocabulary onto that contract.
 *
 * Canon: wiki/concepts/ghl-crm-taxonomy.md §3 (namespaces) + §7 (OCAP/consent)
 *        wiki/concepts/ghl-audience-comms-automation.md §5 (5-layer model)
 * Plan:  thoughts/shared/plans/2026-06-08-whole-system-forms-tag-alignment.md §E
 * Rulings implemented here: R8 (consent gate), R9 (lane:community), R10
 *        (capital_tier field, drop the tier tag), R11 (story consent ≠ comms).
 *
 * 5-LAYER MODEL (the load-bearing invariant):
 *   1 DESCRIBE  identity tags (project:/role:/interest:/place:/source:) — NEVER trigger a send
 *   2 SEGMENT   smart-lists (saved tag queries)
 *   3 ENROL     comms:* — the ONLY send-trigger; granted ONLY with explicit
 *               newsletter_consent=Yes (Spam Act 2003)
 *   4 ACT       workflows
 *   5 GATE      consent (explicit only) + community-line (lane:community ⇒ ZERO comms ever, OCAP)
 *
 * GOLDEN RULE: identity tags never trigger a send; only `comms:` does, and
 * `comms:` is granted by a consent-capturing form — never a hand-added flat tag.
 *
 * lane:community OCAP AGENCY MODEL (Ben, 2026-06-08): the lane = the relationship
 * lane, not the funnel. A community-line contact is NEVER auto-enrolled into any
 * comms:* and is never an automation segment. A comms:* may sit on them ONLY with
 * explicit consent evidence (their own choice; storyteller/Elder opt-ins
 * human-confirmed). Out of the machine, not out of communication. The strip-guard
 * below removes any comms:* that arrives on a lane:community contact through THIS
 * code path — defense-in-depth so a wrong tag can never become a wrong send.
 *
 * TRANSITION NOTE: we ADD canonical tags; we do NOT yet remove the flat `goods-*`
 * tags, because the live GHL Smart Router branches on them today. Flat-tag removal
 * happens in plan phase P5 (GHL tag migration), AFTER the Smart Router branches are
 * re-keyed to the canonical tags in the GHL UI. Removing them here would break live
 * routing before the dashboard side is migrated.
 */

/** The Goods project router tag — stamped on EVERY Goods write at the chokepoint. */
export const PROJECT_TAG = 'project:act-gd';

/** OCAP community-line marker. A contact carrying this is NEVER auto-enrolled in comms:*. */
export const LANE_COMMUNITY = 'lane:community';

/**
 * Custom-field key for R10 capital-partnership ticket size. This is a TICKET-SIZE
 * field, NOT the belonging-ladder `tier:` namespace — keep them apart. Env-driven
 * so the live GHL custom-field id is configured in the dashboard, not hard-coded.
 * If unset, the value is dropped (see R10 fallback) rather than half-wired.
 */
export const CAPITAL_TIER_FIELD_ID = process.env.GHL_FIELD_CAPITAL_TIER || '';

/**
 * Flat `goods-*` (and a few `act-*`/`project-goods`) tag → canonical namespaced
 * tag(s). One flat tag may expand to several canonical tags. A flat tag NOT in
 * this map is passed through unchanged (so per-asset `goods-asset-*`, source
 * `goods-src-*`, and live Smart-Router branch keys survive — they are migrated
 * in plan phase P5, not here).
 *
 * SAFETY: this map NEVER produces a `comms:*` tag. comms:* enrolment is granted
 * ONLY by the consent-gated newsletter path (see grantNewsletterComms), never by
 * mapping an inquiry/identity tag.
 */
const FLAT_TO_CANONICAL: Record<string, string[]> = {
  // --- Roles ---
  'goods-media': ['role:media', 'interest:media-pack'],
  'goods-customer': ['role:buyer'],
  'goods-bed-owner': ['interest:beds'],
  'goods-washer-owner': ['interest:washer'],
  'goods-sponsor': ['role:supporter'],
  'goods-partner-lead': ['role:partner'],
  // Capital-stack interest = a funder/investor lead. Adds role:funder on top of
  // the role:partner that goods-partner-lead already contributes (a capital
  // partner is both). NOT a comms: enrolment — inquiry ≠ consent.
  'goods-capital-interest': ['role:funder', 'interest:capital'],
  'goods-washer-interest': ['role:buyer', 'interest:washer'],
  'goods-recipient': ['role:community', LANE_COMMUNITY],
  'goods-support-request': ['role:community', 'interest:support', LANE_COMMUNITY],
  'goods-story-submitter': ['role:storyteller', LANE_COMMUNITY],
  'goods-feedback': ['role:supporter', 'interest:feedback'],
  // 'goods-inquiry' carries no role on its own (subject-specific tags do); leave as-is.

  // R11: bed-story consent_to_contact = "ok to reply about THIS story", NOT
  // marketing consent. It maps to a story-followup IDENTITY tag (never a send),
  // and NEVER to comms:*. (Belt-and-braces: these contacts also carry
  // lane:community via goods-story-submitter, so the strip-guard would remove
  // any comms:* anyway.) goods-no-contact intentionally maps to nothing.
  'goods-consent-to-contact': ['interest:story-followup'],

  // --- Strategic prospecting (internal, cold — must NEVER get comms:) ---
  'goods-buyer-target': ['role:buyer'],
  'goods-capital-target': ['role:funder'],
  'goods-partner-target': ['role:partner'],
};

/**
 * Map a method's flat tag list to the canonical contract:
 *  - inject `project:act-gd` (R: general)
 *  - inject `source:website` when the write originates from a public form
 *  - expand mapped flat tags to their canonical namespaced equivalents
 *  - KEEP the original flat tags (live Smart Router still branches on them — P5 removes them)
 *  - enforce the OCAP strip-guard: if lane:community is present, remove ANY comms:*
 *
 * @param flatTags    the tags the public method built (goods-*, act-*, …)
 * @param opts.source 'website' to add source:website (public-form origin); omit for non-form (cron/admin)
 */
export function toCanonicalTags(
  flatTags: string[],
  opts?: { source?: 'website' | 'none' },
): string[] {
  const out = new Set<string>();

  // Always stamp the project router tag.
  out.add(PROJECT_TAG);

  // Public-form writes get source:website. Non-form callers (strategic-target
  // cron, bed-scan SMS) pass source:'none' so we don't mislabel their origin.
  if (!opts || opts.source === 'website' || opts.source === undefined) {
    out.add('source:website');
  }

  for (const tag of flatTags) {
    if (!tag) continue;
    // Keep the original flat tag (transition: Smart Router still needs it).
    out.add(tag);
    // Add canonical expansion(s) if mapped.
    const mapped = FLAT_TO_CANONICAL[tag];
    if (mapped) for (const m of mapped) out.add(m);
  }

  // OCAP strip-guard: a community-line contact NEVER carries an auto-granted
  // comms:* through this path. This is defense-in-depth — the maps above never
  // emit comms:*, but if a caller ever passed one alongside lane:community, drop it.
  if (out.has(LANE_COMMUNITY)) {
    for (const t of Array.from(out)) {
      if (t.startsWith('comms:')) out.delete(t);
    }
  }

  return Array.from(out);
}

/**
 * R8 — Spam Act 2003 consent gate for the goods-newsletter send-trigger.
 *
 * Returns the `comms:goods-newsletter` enrolment tag ONLY when explicit consent
 * was captured (`newsletter_consent === 'Yes'`). With anything else (implied
 * consent, missing checkbox) it returns [] — the contact is still created as a
 * lead via the identity tags, but is NOT enrolled into the newsletter send.
 *
 * This is the single place comms:goods-newsletter is ever minted.
 */
export function grantNewsletterComms(newsletterConsent: 'Yes' | string | undefined): string[] {
  return newsletterConsent === 'Yes' ? ['comms:goods-newsletter'] : [];
}

/** Env-driven custom-field id for the consent flag, mirroring the act.place contract. */
export const NEWSLETTER_CONSENT_FIELD_ID = process.env.GHL_FIELD_NEWSLETTER_CONSENT || '';
