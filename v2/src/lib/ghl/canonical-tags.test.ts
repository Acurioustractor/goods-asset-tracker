/**
 * P3c — Goods → ACT canonical GHL tag/field contract.
 *
 * These tests pin the EXACT canonical tag set + custom fields each Goods entry
 * point must emit, per the ACT CRM taxonomy (wiki/concepts/ghl-crm-taxonomy.md
 * §3) and the locked P3c rulings (R8 consent / R9 OCAP lane / R10 capital_tier
 * / R11 story-contact). The contract is ADDITIVE: canonical tags sit ALONGSIDE
 * the existing flat `goods-*` tags (which the live Smart Router still branches
 * on) — the flat tags are NOT removed here.
 *
 * What is asserted, the load-bearing invariants:
 *   (a) EVERY write carries `project:act-gd` (injected + deduped at the
 *       chokepoint).
 *   (b) claim / support / bed-story carry `lane:community` and NEVER any
 *       `comms:*` tag (OCAP — R9).
 *   (c) `comms:goods-newsletter` is granted ONLY where there is an explicit
 *       opt-in, and always paired with `newsletter_consent=Yes` (R8).
 *   (d) the partnership ticket-size becomes a `capital_tier` custom field, not
 *       a belonging-ladder `tier:` tag (R10).
 *
 * Tags are computed by pure builders so we can assert the exact set without
 * touching the GHL API. The chokepoint helpers in index.ts call these same
 * builders, so the unit contract here == the live emit.
 */
import { describe, it, expect } from 'vitest';
import {
  injectProjectTag,
  contactCanonicalTags,
  partnershipCanonicalTags,
  partnershipCanonicalFields,
  newsletterCanonicalTags,
  newsletterCanonicalFields,
  orderCanonicalTags,
  supportCanonicalTags,
  claimCanonicalTags,
  bedStoryCanonicalTags,
  feedbackCanonicalTags,
  GOODS_PROJECT_TAG,
  COMMS_NEWSLETTER_TAG,
  LANE_COMMUNITY_TAG,
} from './canonical-tags';

const COMMS_PREFIX = 'comms:';

// --- (a) chokepoint: project tag injection + dedupe ------------------------

describe('injectProjectTag — chokepoint invariant', () => {
  it('always appends project:act-gd', () => {
    expect(injectProjectTag([])).toContain(GOODS_PROJECT_TAG);
    expect(injectProjectTag(['goods-customer'])).toContain(GOODS_PROJECT_TAG);
  });

  it('dedupes the final tag array', () => {
    const out = injectProjectTag([
      'goods-customer',
      'goods-customer',
      GOODS_PROJECT_TAG,
      'role:buyer',
      'role:buyer',
    ]);
    expect(out.filter((t) => t === 'goods-customer')).toHaveLength(1);
    expect(out.filter((t) => t === GOODS_PROJECT_TAG)).toHaveLength(1);
    expect(out.filter((t) => t === 'role:buyer')).toHaveLength(1);
  });

  it('preserves the pre-existing flat tags (additive, never replaces)', () => {
    const out = injectProjectTag(['goods-recipient', 'goods-asset-gb0-1']);
    expect(out).toContain('goods-recipient');
    expect(out).toContain('goods-asset-gb0-1');
  });

  it('drops empty / falsy tag values', () => {
    const out = injectProjectTag(['goods-customer', '', undefined as unknown as string]);
    expect(out).not.toContain('');
    expect(out).toContain('goods-customer');
    expect(out).toContain(GOODS_PROJECT_TAG);
  });
});

// --- Contact form (R8) ------------------------------------------------------

describe('contactCanonicalTags', () => {
  it('general inquiry → role:supporter + source:website, NO comms:', () => {
    const tags = contactCanonicalTags({ subject: 'General Inquiry', subscribe: false });
    expect(tags).toContain('role:supporter');
    expect(tags).toContain('source:website');
    expect(tags).toContain('interest:general');
    expect(tags.some((t) => t.startsWith(COMMS_PREFIX))).toBe(false);
  });

  it('media/press subject → role:media (not role:supporter)', () => {
    const tags = contactCanonicalTags({ subject: 'Media Pack Request', subscribe: false });
    expect(tags).toContain('role:media');
    expect(tags).not.toContain('role:supporter');
    expect(tags).toContain('source:website');
  });

  it('subscribe = true (explicit opt-in) → grants comms:goods-newsletter', () => {
    const tags = contactCanonicalTags({ subject: 'General Inquiry', subscribe: true });
    expect(tags).toContain(COMMS_NEWSLETTER_TAG);
  });

  it('subscribe absent/false → NO comms: (inquiry is not consent)', () => {
    expect(
      contactCanonicalTags({ subject: 'General Inquiry' }).some((t) => t.startsWith(COMMS_PREFIX)),
    ).toBe(false);
  });

  it('carries an interest tag derived from the subject', () => {
    expect(contactCanonicalTags({ subject: 'Bulk Order Inquiry' })).toContain(
      'interest:bulk-order',
    );
  });
});

// --- Partnership form (R10) -------------------------------------------------

describe('partnershipCanonicalTags', () => {
  it('foundation/trust segment → role:funder + source:website, NO comms:', () => {
    const tags = partnershipCanonicalTags({ partnershipType: 'capital-interest', partnerSegment: 'foundation' });
    expect(tags).toContain('role:funder');
    expect(tags).toContain('source:website');
    expect(tags.some((t) => t.startsWith(COMMS_PREFIX))).toBe(false);
  });

  it('institutional-buyer segment → role:buyer', () => {
    const tags = partnershipCanonicalTags({ partnershipType: 'capital-interest', partnerSegment: 'institutional-buyer' });
    expect(tags).toContain('role:buyer');
  });

  it('washer-interest → role:buyer + interest:washer', () => {
    const tags = partnershipCanonicalTags({ partnershipType: 'washer-interest' });
    expect(tags).toContain('role:buyer');
    expect(tags).toContain('interest:washer');
  });

  it('community segment → role:partner', () => {
    const tags = partnershipCanonicalTags({ partnershipType: 'capital-interest', partnerSegment: 'community' });
    expect(tags).toContain('role:partner');
  });

  it('NEVER emits a belonging-ladder tier: tag (R10 — ticket size is a field, not a tag input)', () => {
    // The builder takes NO fundingTier input by design — ticket size can only
    // ever land as the capital_tier custom field, never as a tier: tag.
    const tags = partnershipCanonicalTags({
      partnershipType: 'capital-interest',
      partnerSegment: 'foundation',
    });
    expect(tags.some((t) => t.startsWith('tier:'))).toBe(false);
  });

  it('NEVER emits comms: from the partnership form', () => {
    const tags = partnershipCanonicalTags({ partnershipType: 'sponsor', partnerSegment: 'corporate' });
    expect(tags.some((t) => t.startsWith(COMMS_PREFIX))).toBe(false);
  });
});

describe('partnershipCanonicalFields — R10 capital_tier', () => {
  it('maps fundingTier into a capital_tier field keyed by the configured field id', () => {
    const fields = partnershipCanonicalFields('500k-plus', 'CF_CAPITAL_TIER');
    expect(fields).toEqual({ CF_CAPITAL_TIER: '500k-plus' });
  });

  it('returns {} when there is no fundingTier (do not write an empty field)', () => {
    expect(partnershipCanonicalFields(undefined, 'CF_CAPITAL_TIER')).toEqual({});
  });

  it('returns {} when the field id is not configured (cannot write without a key)', () => {
    expect(partnershipCanonicalFields('500k-plus', '')).toEqual({});
  });
});

// --- Newsletter / sponsor-interest / canberra (R8) --------------------------

describe('newsletterCanonicalTags', () => {
  it('generic newsletter signup → comms:goods-newsletter + source:website (explicit subscribe form)', () => {
    const tags = newsletterCanonicalTags(undefined);
    expect(tags).toContain(COMMS_NEWSLETTER_TAG);
    expect(tags).toContain('source:website');
  });

  it('sponsor-interest tag → comms: + interest:beds + source:website', () => {
    const tags = newsletterCanonicalTags('sponsor-interest');
    expect(tags).toContain(COMMS_NEWSLETTER_TAG);
    expect(tags).toContain('interest:beds');
    expect(tags).toContain('source:website');
  });

  it('canberra-airport-2026 tag → comms: + source:event:canberra-airport-2026 + place:act', () => {
    const tags = newsletterCanonicalTags('canberra-airport-2026');
    expect(tags).toContain(COMMS_NEWSLETTER_TAG);
    expect(tags).toContain('source:event:canberra-airport-2026');
    expect(tags).toContain('place:act');
  });

  it('parliament-house event tag → comms: + source:event:parliament-house', () => {
    const tags = newsletterCanonicalTags('parliament-house');
    expect(tags).toContain(COMMS_NEWSLETTER_TAG);
    expect(tags).toContain('source:event:parliament-house');
  });
});

describe('newsletterCanonicalFields — R8 consent capture', () => {
  it('stamps newsletter_consent=Yes whenever comms is granted', () => {
    expect(newsletterCanonicalFields('CF_CONSENT')).toEqual({ CF_CONSENT: 'Yes' });
  });

  it('returns {} when the consent field id is not configured', () => {
    expect(newsletterCanonicalFields('')).toEqual({});
  });
});

// --- Order / Stripe (transactional, NO comms) -------------------------------

describe('orderCanonicalTags', () => {
  it('retail bed order → role:buyer + interest:beds + source:website, NO comms:', () => {
    const tags = orderCanonicalTags({ productTypes: ['stretch_bed'], isSponsorship: false });
    expect(tags).toContain('role:buyer');
    expect(tags).toContain('interest:beds');
    expect(tags).toContain('source:website');
    expect(tags.some((t) => t.startsWith(COMMS_PREFIX))).toBe(false);
  });

  it('washing machine order → interest:washer', () => {
    const tags = orderCanonicalTags({ productTypes: ['washing_machine'], isSponsorship: false });
    expect(tags).toContain('interest:washer');
  });

  it('sponsorship → role:supporter (not role:buyer), still NO comms:', () => {
    const tags = orderCanonicalTags({ productTypes: ['stretch_bed'], isSponsorship: true });
    expect(tags).toContain('role:supporter');
    expect(tags).not.toContain('role:buyer');
    expect(tags.some((t) => t.startsWith(COMMS_PREFIX))).toBe(false);
  });
});

// --- Support ticket (R9 OCAP) -----------------------------------------------

describe('supportCanonicalTags — OCAP lane', () => {
  it('→ role:community + lane:community + source:website', () => {
    const tags = supportCanonicalTags({ community: undefined });
    expect(tags).toContain('role:community');
    expect(tags).toContain(LANE_COMMUNITY_TAG);
    expect(tags).toContain('source:website');
  });

  it('NEVER emits comms: (OCAP — community line)', () => {
    expect(supportCanonicalTags({ community: 'Utopia' }).some((t) => t.startsWith(COMMS_PREFIX))).toBe(
      false,
    );
  });

  it('emits place:community:<slug> when the community is known', () => {
    expect(supportCanonicalTags({ community: 'Mparntwe / Alice Springs' })).toContain(
      'place:community:mparntwe-alice-springs',
    );
  });

  it('omits place:community: when the community is unknown (no invented value)', () => {
    expect(supportCanonicalTags({ community: undefined }).some((t) => t.startsWith('place:community:'))).toBe(
      false,
    );
  });
});

// --- Recipient claim (R9 OCAP — highest priority) ---------------------------

describe('claimCanonicalTags — OCAP lane (highest priority)', () => {
  it('→ role:community + lane:community + interest:beds for a bed claim', () => {
    const tags = claimCanonicalTags({ productType: 'stretch_bed', community: undefined });
    expect(tags).toContain('role:community');
    expect(tags).toContain(LANE_COMMUNITY_TAG);
    expect(tags).toContain('interest:beds');
  });

  it('washing machine claim → interest:washer', () => {
    const tags = claimCanonicalTags({ productType: 'washing machine', community: undefined });
    expect(tags).toContain('interest:washer');
  });

  it('NEVER emits comms: EVER (OCAP — community recipient)', () => {
    expect(
      claimCanonicalTags({ productType: 'stretch_bed', community: 'Utopia' }).some((t) =>
        t.startsWith(COMMS_PREFIX),
      ),
    ).toBe(false);
  });

  it('emits place:community:<slug> when known', () => {
    expect(claimCanonicalTags({ productType: 'bed', community: 'Utopia' })).toContain(
      'place:community:utopia',
    );
  });
});

// --- Bed-story (R9 OCAP + R11) ----------------------------------------------

describe('bedStoryCanonicalTags — OCAP lane + R11', () => {
  it('→ role:storyteller + lane:community', () => {
    const tags = bedStoryCanonicalTags({ community: undefined });
    expect(tags).toContain('role:storyteller');
    expect(tags).toContain(LANE_COMMUNITY_TAG);
  });

  it('NEVER emits comms: EVER (storyteller = community line; consent_to_contact is NOT marketing)', () => {
    expect(
      bedStoryCanonicalTags({ community: 'Utopia', consentToContact: true }).some((t) =>
        t.startsWith(COMMS_PREFIX),
      ),
    ).toBe(false);
  });

  it('consent_to_contact=true does NOT promote to any comms: tag (R11)', () => {
    const withConsent = bedStoryCanonicalTags({ community: undefined, consentToContact: true });
    const withoutConsent = bedStoryCanonicalTags({ community: undefined, consentToContact: false });
    expect(withConsent.some((t) => t.startsWith(COMMS_PREFIX))).toBe(false);
    expect(withoutConsent.some((t) => t.startsWith(COMMS_PREFIX))).toBe(false);
  });

  it('emits place:community:<slug> when known', () => {
    expect(bedStoryCanonicalTags({ community: 'Utopia' })).toContain('place:community:utopia');
  });
});

// --- Feedback ---------------------------------------------------------------

describe('feedbackCanonicalTags', () => {
  it('→ source:website, NO comms:', () => {
    const tags = feedbackCanonicalTags();
    expect(tags).toContain('source:website');
    expect(tags.some((t) => t.startsWith(COMMS_PREFIX))).toBe(false);
  });
});

// --- Cross-cutting: every path carries project:act-gd after injection -------

describe('every entry point carries project:act-gd once injected', () => {
  const paths: Array<[string, string[]]> = [
    ['contact', contactCanonicalTags({ subject: 'General Inquiry' })],
    ['partnership', partnershipCanonicalTags({ partnershipType: 'capital-interest', partnerSegment: 'foundation' })],
    ['newsletter', newsletterCanonicalTags('sponsor-interest')],
    ['order', orderCanonicalTags({ productTypes: ['stretch_bed'], isSponsorship: false })],
    ['support', supportCanonicalTags({ community: 'Utopia' })],
    ['claim', claimCanonicalTags({ productType: 'bed', community: 'Utopia' })],
    ['bed-story', bedStoryCanonicalTags({ community: 'Utopia' })],
    ['feedback', feedbackCanonicalTags()],
  ];

  it.each(paths)('%s → injectProjectTag adds project:act-gd', (_label, tags) => {
    expect(injectProjectTag(tags)).toContain(GOODS_PROJECT_TAG);
  });

  it('community-line paths (support/claim/bed-story) never gain comms: after injection', () => {
    for (const tags of [
      supportCanonicalTags({ community: 'Utopia' }),
      claimCanonicalTags({ productType: 'bed', community: 'Utopia' }),
      bedStoryCanonicalTags({ community: 'Utopia', consentToContact: true }),
    ]) {
      expect(injectProjectTag(tags).some((t) => t.startsWith(COMMS_PREFIX))).toBe(false);
    }
  });
});
