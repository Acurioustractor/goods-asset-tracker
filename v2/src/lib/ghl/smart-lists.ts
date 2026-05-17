/**
 * Curated GHL smart lists for the admin reach-out tool.
 *
 * Each entry maps a friendly name onto a single tag (or set of tags) that
 * GHL can filter on. The tag MUST be one we actually apply somewhere in
 * src/lib/ghl/index.ts — otherwise the list will return zero contacts.
 *
 * Add new lists conservatively. Each new list is one more way to accidentally
 * SMS-blast hundreds of community members; keep it intentional.
 */

export interface SmartList {
  /** Stable identifier used in URLs and API calls */
  id: string;
  /** Friendly name shown in the picker */
  name: string;
  /** Short rationale shown beneath the name */
  description: string;
  /** Single GHL tag the contact must carry. (Multi-tag filters via custom endpoint later.) */
  tag: string;
  /** Suggested cap — UI warns if the actual count exceeds this */
  softCap: number;
  /** Hard cap — dispatch endpoint refuses sends larger than this */
  hardCap: number;
  /** Optional default message — staff edit before send */
  defaultMessageSeed?: string;
}

export const SMART_LISTS: SmartList[] = [
  {
    id: 'bed-recipients-consented',
    name: 'Bed recipients (consented to contact)',
    description:
      'People who claimed a bed via QR and ticked "ok to contact". Highest-signal list for proactive check-ins.',
    tag: 'goods-consent-to-contact',
    softCap: 100,
    hardCap: 250,
    defaultMessageSeed:
      'Hi from Goods on Country, just checking in on your bed. Reply YES if all good or tell us what is up. Stop to opt out.',
  },
  {
    id: 'bed-owners-claimed',
    name: 'Bed owners — claimed via QR',
    description: 'Everyone who scanned a bed QR and claimed it with their phone.',
    tag: 'goods-claimed-bed',
    softCap: 100,
    hardCap: 250,
  },
  {
    id: 'washer-owners',
    name: 'Washing machine owners',
    description: '14 households with a Pakkimjalki Kari deployed. Use for fleet check-ins.',
    tag: 'goods-claimed-washer',
    softCap: 20,
    hardCap: 50,
  },
  {
    id: 'washer-interest',
    name: 'Washing machine prospects',
    description: 'Submitted "Register Interest" on the washing machine page. Use for product update + waitlist comms.',
    tag: 'goods-washer-interest',
    softCap: 50,
    hardCap: 200,
  },
  {
    id: 'bed-buyers',
    name: 'Stretch Bed buyers (Stripe)',
    description:
      'People who paid for a bed via stripe. Use sparingly — they bought, not granted permission to be texted.',
    tag: 'goods-bed-owner',
    softCap: 50,
    hardCap: 200,
  },
  {
    id: 'story-submitters-consented',
    name: 'Story submitters (consented)',
    description: 'Shared a story or photo and ticked "ok to contact". Good for follow-up + thanks.',
    tag: 'goods-story-submitter',
    softCap: 50,
    hardCap: 100,
  },
  {
    id: 'support-recent',
    name: 'Recent support contacts',
    description: 'Opened a support ticket in the last while. Use for "did your fix work?" follow-ups.',
    tag: 'goods-support-request',
    softCap: 30,
    hardCap: 80,
  },
];

export function findSmartList(id: string): SmartList | undefined {
  return SMART_LISTS.find((l) => l.id === id);
}

/**
 * SMS cost guidance — used in the confirm UI.
 * Twilio/GHL bills AU$0.05 per 160-char segment on AU mobile.
 */
export function estimateSegments(message: string): number {
  if (!message) return 0;
  return Math.ceil(message.length / 160);
}

export function estimateCostCents(message: string, recipientCount: number): number {
  const segments = estimateSegments(message);
  // 5 cents per segment per recipient
  return segments * 5 * recipientCount;
}
