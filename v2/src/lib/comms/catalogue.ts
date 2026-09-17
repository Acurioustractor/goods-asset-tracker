/**
 * Every message Goods sends a person, in one list, rendered from real inputs.
 *
 * Ben, 17 September, part way through building the sixth one: "it is a fuckload of different
 * messages and alignment". He is right. Six messages and counting, each one written on its own
 * day for its own lane, each repeating the phone number, the response time, who invoices and how
 * Goods signs off. Nothing was comparing them to each other.
 *
 * This is the comparison surface. Two jobs.
 *
 * It renders every message from a realistic example so a person can read the whole voice at once,
 * on /admin/campaign, instead of opening six files.
 *
 * And it is what the alignment guard walks. The facts live in ./facts, so changing the phone
 * number is one edit, and the guard proves no message has quietly gone its own way: same sign
 * off, same response window, no second phone number, no entity nobody has heard of, no
 * unsubscribe on anything transactional.
 *
 * A message that is not in here is not checked, so adding one and forgetting is the failure mode.
 * The guard catches it: every builder exported from this folder has to appear.
 */

import { buildOrderConfirmation } from './order-confirmation';
import { buildSupportReply } from './support-reply';
import { buildBulkOrderReply } from './bulk-order-reply';
import { buildMediaPackReply } from './media-pack-reply';
import { buildCapitalReply } from './capital-reply';
import { buildCommunityReply } from './community-reply';
import { buildPartnerReply } from './partner-reply';
import { buildGeneralReply } from './general-reply';
import { buildWasherReply } from './washer-reply';
import { buildNewsletterWelcome } from './newsletter-welcome';
import type { BuiltEmail } from './facts';
import type { PathwayAudience } from '@/lib/ghl/audience-pathways';

/**
 * Who puts it on the wire. Everything here is written in this repo and guarded the same way, but
 * a campaign has to go through a GHL workflow so it carries a working unsubscribe, and a
 * transactional reply must not carry one.
 */
export type SentBy = 'code' | 'ghl workflow';
export type MessageKind = 'transactional' | 'campaign';

export interface CatalogueEntry {
  id: string;
  /** What it is, in the words somebody would use out loud. */
  label: string;
  /** Who it goes to. */
  audience: PathwayAudience;
  /** What sets it off. */
  trigger: string;
  /** The example used to render it here and in the guard. Realistic, never a placeholder. */
  example: BuiltEmail;
  /** Defaults to code and transactional, which is what all the replies are. */
  sentBy?: SentBy;
  kind?: MessageKind;
  /** Only for a workflow message: what somebody has to do in GHL before it sends. */
  pasteInto?: string;
}

export const MESSAGE_CATALOGUE: CatalogueEntry[] = [
  {
    id: 'order-confirmation',
    label: 'Somebody bought a bed',
    audience: 'buyer',
    trigger: 'Stripe payment on the shop',
    example: buildOrderConfirmation({
      name: 'Jane Smith',
      orderNumber: 'GD-1042',
      totalCents: 75000,
      isSponsorship: false,
    }),
  },
  {
    id: 'order-confirmation-sponsorship',
    label: 'Somebody sponsored a bed for a community',
    audience: 'buyer',
    trigger: 'Stripe payment on the shop, sponsorship option',
    example: buildOrderConfirmation({
      name: 'Jane Smith',
      orderNumber: 'GD-1043',
      totalCents: 75000,
      isSponsorship: true,
      sponsoredCommunity: 'Tennant Creek',
      sponsorMessage: 'For Nana.',
    }),
  },
  {
    id: 'support',
    label: 'Something is wrong with my bed',
    audience: 'community',
    trigger: 'A support ticket with an email address',
    example: buildSupportReply({
      assetId: 'GB0-156-40',
      product: 'Stretch Bed',
      community: 'Tennant Creek',
      priority: 'Medium',
    }),
  },
  {
    id: 'support-urgent',
    label: 'A bed that is not safe to sleep on',
    audience: 'community',
    trigger: 'A support ticket marked High or Urgent',
    example: buildSupportReply({
      assetId: 'GB0-156-41',
      product: 'Stretch Bed',
      community: 'Utopia',
      priority: 'Urgent',
    }),
  },
  {
    id: 'bulk-order',
    label: 'Ordering beds',
    audience: 'buyer',
    trigger: 'Contact form, Bulk Order Inquiry',
    example: buildBulkOrderReply({ organisation: 'Barkly Regional Council' }),
  },
  {
    id: 'capital',
    label: 'Backing a facility',
    audience: 'funder',
    trigger: 'Contact form, Facility Funding Inquiry',
    example: buildCapitalReply({}),
  },
  {
    id: 'community',
    label: 'Bring this to my community',
    audience: 'community',
    trigger: 'Contact form, Community Interest',
    example: buildCommunityReply({ phone: '0400 000 000' }),
  },
  {
    id: 'community-no-number',
    label: 'Bring this to my community, with no phone number given',
    audience: 'community',
    trigger: 'Contact form, Community Interest, no phone field',
    example: buildCommunityReply({}),
  },
  {
    id: 'partner',
    label: 'The broad partnership button',
    audience: 'community',
    trigger: 'Contact form or the partner form, Partnership Inquiry',
    example: buildPartnerReply({}),
  },
  {
    id: 'general',
    label: 'Everything else',
    audience: 'supporter',
    trigger: 'Contact form, General Inquiry, and any subject with no branch of its own',
    example: buildGeneralReply({}),
  },
  {
    id: 'washer',
    label: 'Registering interest in a washing machine',
    audience: 'buyer',
    trigger: 'The washing machine form, Washing Machine Interest',
    example: buildWasherReply({ organisation: 'Ali Curung' }),
  },
  {
    id: 'newsletter-welcome',
    label: 'Somebody just subscribed',
    audience: 'supporter',
    trigger: 'Any of the five newsletter forms, with the consent box ticked',
    example: buildNewsletterWelcome(),
    sentBy: 'ghl workflow',
    kind: 'campaign',
    pasteInto:
      'The Newsletter Signup workflow in GHL, which has been a draft since January. It is a ' +
      'campaign, not a reply, so it goes through a workflow that adds and honours an unsubscribe ' +
      'rather than being sent from the app.',
  },
  {
    id: 'media-pack',
    label: 'A journalist asked for the pack',
    audience: 'media',
    trigger: 'Contact form, Media Pack Request',
    example: buildMediaPackReply({}),
  },
];

/** Every builder this folder exports, so the guard can tell when one is missing from the list. */
export const BUILDER_NAMES = [
  'buildOrderConfirmation',
  'buildSupportReply',
  'buildBulkOrderReply',
  'buildMediaPackReply',
  'buildCapitalReply',
  'buildCommunityReply',
  'buildPartnerReply',
  'buildGeneralReply',
  'buildWasherReply',
  'buildNewsletterWelcome',
] as const;
