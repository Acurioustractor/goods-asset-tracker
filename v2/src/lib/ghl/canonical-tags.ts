/**
 * P3c — Goods → ACT canonical GHL tag/field contract (pure builders).
 *
 * This module is the single source of truth for the CANONICAL, namespaced tags
 * each Goods entry point adds to a GHL contact, per the ACT CRM taxonomy
 * (wiki/concepts/ghl-crm-taxonomy.md §3). The chokepoint + per-feature helpers
 * in ./index.ts call these builders so the unit contract here equals the live
 * emit.
 *
 * ADDITIVE rule: these canonical tags sit ALONGSIDE the existing flat `goods-*`
 * tags (which the live GHL Smart Router still branches on). The flat tags are
 * NOT removed here — they retire later in a separate GHL-side migration.
 *
 * Canonical namespaces used:
 *   project:act-gd  — Goods router tag (injected + deduped at the chokepoint)
 *   role:<x>        — funder | partner | buyer | supporter | storyteller |
 *                     community | media
 *   comms:goods-newsletter — newsletter SEND trigger. ONLY granted with an
 *                     EXPLICIT opt-in (R8). A contact tagged lane:community
 *                     gets ZERO comms:* (R9).
 *   interest:<x>    — beds | washer | general | bulk-order | ...
 *   place:<x>       — state (qld/nt/act) OR community:<slug>
 *   source:<x>      — website | event:<slug> | inbound
 *   lane:community  — OCAP guard. The Smart Router MUST exclude this from all
 *                     drips (GHL-side, pending).
 */

export const GOODS_PROJECT_TAG = 'project:act-gd';
export const COMMS_NEWSLETTER_TAG = 'comms:goods-newsletter';
export const LANE_COMMUNITY_TAG = 'lane:community';

/**
 * Chokepoint invariant: every GHL write from Goods carries `project:act-gd`,
 * and the final tag array is deduped (and stripped of empties). Called once,
 * inside createOrUpdateContact, so NO path can omit the router tag and no
 * duplicate tag is ever sent.
 */
export function injectProjectTag(tags: ReadonlyArray<string | undefined | null>): string[] {
  const all = [...tags, GOODS_PROJECT_TAG]
    .map((t) => (t == null ? '' : String(t).trim()))
    .filter((t) => t.length > 0);
  return Array.from(new Set(all));
}

/**
 * community label → place:community:<slug>. Lowercase, hyphen-safe, collapsed.
 * Returns undefined for empty/unknown so callers never invent a place tag.
 */
export function communityPlaceTag(community?: string | null): string | undefined {
  const slug = String(community || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug ? `place:community:${slug}` : undefined;
}

/** Subject string → interest slug (e.g. "Bulk Order Inquiry" → "bulk-order"). */
function subjectInterestSlug(subject?: string): string {
  const s = String(subject || '')
    .trim()
    .toLowerCase()
    .replace(/\binquiry\b/g, '')
    .replace(/\brequest\b/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return s || 'general';
}

function isMediaSubject(subject?: string): boolean {
  const s = String(subject || '').toLowerCase();
  return s.includes('media') || s.includes('press');
}

/** Product-type string(s) → interest tag(s) (beds / washer). */
function productInterestTags(productTypes: string[]): string[] {
  const tags = new Set<string>();
  for (const pt of productTypes) {
    const p = String(pt || '').toLowerCase();
    if (p.includes('bed')) tags.add('interest:beds');
    if (p.includes('wash') || p.includes('machine')) tags.add('interest:washer');
  }
  return [...tags];
}

// ---------------------------------------------------------------------------
// Contact form — /api/contact  (R8)
// ---------------------------------------------------------------------------
export function contactCanonicalTags(opts: { subject?: string; subscribe?: boolean }): string[] {
  const tags: string[] = [];
  // media/press → role:media, otherwise the default supporter role.
  tags.push(isMediaSubject(opts.subject) ? 'role:media' : 'role:supporter');
  tags.push('source:website');
  tags.push(`interest:${subjectInterestSlug(opts.subject)}`);
  // R8: comms ONLY with an explicit opt-in (the subscribe checkbox). An inquiry
  // is NOT consent — without subscribe=true, no comms: tag is granted.
  if (opts.subscribe === true) tags.push(COMMS_NEWSLETTER_TAG);
  return tags;
}

// ---------------------------------------------------------------------------
// Partnership / capital form — /api/partnership  (R10)
// ---------------------------------------------------------------------------
const PARTNER_SEGMENT_ROLE: Record<string, 'role:funder' | 'role:partner' | 'role:buyer'> = {
  foundation: 'role:funder',
  'paf-puaf': 'role:funder',
  'family-office': 'role:funder',
  corporate: 'role:funder',
  'recoverable-grant': 'role:funder',
  'patient-debt': 'role:funder',
  'institutional-buyer': 'role:buyer',
  community: 'role:partner',
};

/**
 * Partnership canonical tags. role: derived from segment (capital givers →
 * funder, institutional buyer → buyer, community org → partner). washer-interest
 * is a prospective buyer of the machine. NO comms: (an inquiry is not consent),
 * and NO belonging-ladder tier: tag (ticket size is a custom field — R10).
 */
export function partnershipCanonicalTags(opts: {
  partnershipType?: string;
  partnerSegment?: string;
}): string[] {
  const tags: string[] = [];
  tags.push('source:website');

  if (opts.partnershipType === 'washer-interest') {
    tags.push('role:buyer');
    tags.push('interest:washer');
    return tags;
  }

  const segRole = opts.partnerSegment ? PARTNER_SEGMENT_ROLE[opts.partnerSegment] : undefined;
  if (segRole) {
    tags.push(segRole);
  } else if (opts.partnershipType === 'sponsor') {
    tags.push('role:supporter');
  } else {
    // Distribution / license / grant / other capital paths default to funder
    // (a capital/partnership inquiry). Never default to a community role here.
    tags.push('role:funder');
  }
  return tags;
}

/**
 * R10: the partnership ticket-size (fundingTier) is written as a `capital_tier`
 * CUSTOM FIELD, never as a `tier:` tag (which is reserved for the belonging
 * ladder). Returns {} when there is no value OR no configured field id.
 */
export function partnershipCanonicalFields(
  fundingTier: string | undefined,
  capitalTierFieldId: string,
): Record<string, string> {
  if (!fundingTier || !capitalTierFieldId) return {};
  return { [capitalTierFieldId]: fundingTier };
}

// ---------------------------------------------------------------------------
// Newsletter / sponsor-interest / canberra — /api/newsletter  (R8)
// ---------------------------------------------------------------------------
// All three callers (generic signup, sponsor "Stay in the loop", canberra
// "Stay close to the story") are framed as explicit subscribe/follow forms, so
// each is a genuine opt-in → comms:goods-newsletter is granted. Event/source
// extras are keyed off the source tag the form passes.
const NEWSLETTER_SOURCE_EXTRAS: Record<string, string[]> = {
  'sponsor-interest': ['interest:beds', 'source:website'],
  'canberra-airport-2026': ['source:event:canberra-airport-2026', 'place:act'],
  'parliament-house': ['source:event:parliament-house'],
  'parliament-house-demo': ['source:event:parliament-house'],
};

export function newsletterCanonicalTags(sourceTag?: string): string[] {
  const tags: string[] = [COMMS_NEWSLETTER_TAG];
  const extras = sourceTag ? NEWSLETTER_SOURCE_EXTRAS[sourceTag] : undefined;
  if (extras) {
    tags.push(...extras);
  } else {
    // Generic newsletter signup (footer / get-involved / checkout success).
    tags.push('source:website');
  }
  return Array.from(new Set(tags));
}

/**
 * R8: whenever comms:goods-newsletter is granted, stamp newsletter_consent=Yes.
 * Returns {} when the field id is not configured.
 */
export function newsletterCanonicalFields(consentFieldId: string): Record<string, string> {
  if (!consentFieldId) return {};
  return { [consentFieldId]: 'Yes' };
}

// ---------------------------------------------------------------------------
// Order / Stripe checkout — transactional, NO comms
// ---------------------------------------------------------------------------
export function orderCanonicalTags(opts: { productTypes: string[]; isSponsorship: boolean }): string[] {
  const tags: string[] = [];
  // A sponsor is a supporter; a retail purchaser is a buyer.
  tags.push(opts.isSponsorship ? 'role:supporter' : 'role:buyer');
  tags.push(...productInterestTags(opts.productTypes));
  tags.push('source:website');
  // No comms: — a transactional order receipt is not marketing consent.
  return Array.from(new Set(tags));
}

// ---------------------------------------------------------------------------
// Support ticket — /api/support  (R9 OCAP)
// ---------------------------------------------------------------------------
export function supportCanonicalTags(opts: { community?: string | null }): string[] {
  // OCAP: the submitter is a community recipient. lane:community is the
  // protective marker — the GHL Smart Router MUST exclude lane:community from
  // all drips (GHL-side, pending). NEVER any comms: here.
  const tags: string[] = ['role:community', LANE_COMMUNITY_TAG, 'source:website'];
  const place = communityPlaceTag(opts.community);
  if (place) tags.push(place);
  return tags;
}

// ---------------------------------------------------------------------------
// Recipient claim — /api/claim/[asset_id]  (R9 OCAP — highest priority)
// ---------------------------------------------------------------------------
export function claimCanonicalTags(opts: { productType?: string; community?: string | null }): string[] {
  // OCAP: a goods recipient. lane:community + NO comms: EVER.
  const tags: string[] = ['role:community', LANE_COMMUNITY_TAG];
  tags.push(...productInterestTags([opts.productType || '']));
  const place = communityPlaceTag(opts.community);
  if (place) tags.push(place);
  return Array.from(new Set(tags));
}

// ---------------------------------------------------------------------------
// Bed-story submission — /api/bed/[id]/story  (R9 OCAP + R11)
// ---------------------------------------------------------------------------
export function bedStoryCanonicalTags(opts: {
  community?: string | null;
  consentToContact?: boolean;
}): string[] {
  // OCAP: storyteller = community line. lane:community + NO comms: EVER.
  // R11: consent_to_contact means "ok to reply about THIS story", NOT
  // marketing — it is deliberately IGNORED here and never promoted to comms:.
  const tags: string[] = ['role:storyteller', LANE_COMMUNITY_TAG];
  const place = communityPlaceTag(opts.community);
  if (place) tags.push(place);
  return tags;
}

// ---------------------------------------------------------------------------
// Feedback widget — /api/feedback
// ---------------------------------------------------------------------------
export function feedbackCanonicalTags(): string[] {
  // No comms: — feedback is not a subscribe.
  return ['source:website'];
}
