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
import type { BuiltEmail } from './facts';
import type { PathwayAudience } from '@/lib/ghl/audience-pathways';

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
] as const;
