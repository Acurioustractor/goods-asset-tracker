/**
 * The email a person gets when they pay on the site.
 *
 * Until this existed they got nothing. The success page says "Confirmation sent to <email>" and
 * lists what happens next, and no confirmation was ever sent: New Order Notification has been a
 * draft in GHL since February. The site made a promise on the page and nothing kept it.
 *
 * It goes out through GHL's own email channel (ghl.sendTransactionalReply), not a workflow,
 * because the GHL API cannot publish a workflow and this one has waited seven months for
 * somebody to click publish.
 *
 * Two variants, because two different things happen. Somebody who buys a bed is waiting for a
 * delivery. Somebody who sponsors one is waiting to find out where it went.
 *
 * WHAT THIS EMAIL PROMISES, and who has to keep it:
 *  - tracking when it ships. Nothing sends that yet. A person does, and the site already told
 *    them to expect it.
 *  - the QR link when a sponsored bed lands. Also a person, also already promised on the page.
 * Do not add a promise here that nobody has agreed to keep.
 */

export interface OrderConfirmationInput {
  name?: string;
  orderNumber: string;
  totalCents: number;
  isSponsorship: boolean;
  sponsoredCommunity?: string;
  sponsorMessage?: string;
  /** How many beds, when we know. Falls back to the order total reading on its own. */
  itemCount?: number;
}

export interface BuiltEmail {
  subject: string;
  html: string;
  text: string;
}

const PHONE = '0422 883 943';

function money(cents: number): string {
  const dollars = cents / 100;
  return dollars % 1 === 0 ? `$${dollars.toLocaleString('en-AU')}` : `$${dollars.toFixed(2)}`;
}

function firstName(name?: string): string {
  const first = (name || '').trim().split(/\s+/)[0];
  return first || 'there';
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function paragraphsToHtml(paragraphs: string[]): string {
  return paragraphs
    .map((p) => `<p style="margin:0 0 16px;line-height:1.55">${esc(p).replace(/\n/g, '<br/>')}</p>`)
    .join('');
}

/** The bed a person bought for themselves. */
function purchase(input: OrderConfirmationInput): BuiltEmail {
  const beds = input.itemCount && input.itemCount > 1 ? `${input.itemCount} Stretch Beds` : 'One Stretch Bed';
  const paragraphs = [
    `Thanks ${firstName(input.name)}. Your order came through and we have it.`,
    `${beds}, ${money(input.totalCents)}, order ${input.orderNumber}.`,
    'Your bed is made from recycled HDPE, about 20 kilos of plastic per bed that would otherwise be buried. The canvas is what holds it up: the poles thread through the sleeves and pull tight into the legs, so the bed does not stand without it.',
    'When it is packed and on the truck I will email you the tracking.',
    'There is a QR code on the bed. Scan it when it arrives and you can see where it was made, and tell us how it is going.',
    `If you need it by a date, or anything changes, reply to this email or ring me on ${PHONE}.`,
    'Ben\nGoods on Country',
  ];
  return {
    subject: `Your Stretch Bed, order ${input.orderNumber}`,
    html: paragraphsToHtml(paragraphs),
    text: paragraphs.join('\n\n'),
  };
}

/** The bed somebody paid for so that a community gets it. */
function sponsorship(input: OrderConfirmationInput): BuiltEmail {
  const place = input.sponsoredCommunity?.trim();
  const beds = input.itemCount && input.itemCount > 1 ? `${input.itemCount} Stretch Beds` : 'One Stretch Bed';
  const paragraphs = [
    `Thanks ${firstName(input.name)}. The bed is paid for and it has somewhere to go.`,
    `${beds}, ${money(input.totalCents)}, order ${input.orderNumber}, allocated from the next production run${
      place ? ` to ${place}` : ''
    }.`,
  ];
  if (input.sponsorMessage?.trim()) {
    paragraphs.push(`You wrote: "${input.sponsorMessage.trim()}"`);
    paragraphs.push('That goes with the bed when it is delivered.');
  }
  paragraphs.push(
    place
      ? `When it reaches ${place} I will email you the QR link, so you can see the bed itself and where it ended up.`
      : 'When it reaches its community I will email you the QR link, so you can see the bed itself and where it ended up.',
  );
  paragraphs.push(
    `Reply here or ring me on ${PHONE} if you want to know where it is up to.`,
    'Ben\nGoods on Country',
  );
  return {
    subject: place
      ? `The bed you sponsored for ${place}, order ${input.orderNumber}`
      : `The bed you sponsored, order ${input.orderNumber}`,
    html: paragraphsToHtml(paragraphs),
    text: paragraphs.join('\n\n'),
  };
}

export function buildOrderConfirmation(input: OrderConfirmationInput): BuiltEmail {
  return input.isSponsorship ? sponsorship(input) : purchase(input);
}
