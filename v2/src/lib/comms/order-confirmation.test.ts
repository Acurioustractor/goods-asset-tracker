import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

import { buildOrderConfirmation } from './order-confirmation';

/**
 * This email goes to somebody who has just paid money. The guards are about two things: that it
 * says the true thing, and that the path it travels cannot reach a person who asked not to be
 * contacted.
 *
 * The voice checks are here rather than in check-voice.mjs because that script reads pages, and
 * this copy never appears on one. An em-dash or a piece of AI vocabulary in an email signed by
 * Ben is the same defect as one on the site.
 */

const AI_VOCAB = [
  'delve',
  'crucial',
  'pivotal',
  'seamless',
  'robust',
  'comprehensive',
  'nuanced',
  'multifaceted',
  'holistic',
  'tapestry',
  'leverage',
  'synergy',
  'ecosystem',
  'stakeholder',
  'journey of',
  'we are thrilled',
  'we are excited',
];

const purchase = buildOrderConfirmation({
  name: 'Jane Smith',
  orderNumber: 'GD-1042',
  totalCents: 75000,
  isSponsorship: false,
});

const sponsored = buildOrderConfirmation({
  name: 'Jane Smith',
  orderNumber: 'GD-1043',
  totalCents: 75000,
  isSponsorship: true,
  sponsoredCommunity: 'Tennant Creek',
  sponsorMessage: 'For Nana.',
});

const both = [purchase, sponsored];

describe('the order confirmation says the true thing', () => {
  it('names the order in the subject, so it is findable later', () => {
    expect(purchase.subject).toContain('GD-1042');
    expect(sponsored.subject).toContain('GD-1043');
  });

  it('states what was paid', () => {
    expect(purchase.text).toContain('$750');
    expect(sponsored.text).toContain('$750');
  });

  it('keeps the promise the success page already made about tracking', () => {
    expect(purchase.text.toLowerCase()).toContain('tracking');
  });

  it('tells a sponsor where the bed is going and echoes what they wrote', () => {
    expect(sponsored.text).toContain('Tennant Creek');
    expect(sponsored.text).toContain('For Nana.');
    expect(sponsored.subject).toContain('Tennant Creek');
  });

  it('works when a sponsor names no community and writes no message', () => {
    const bare = buildOrderConfirmation({
      orderNumber: 'GD-1044',
      totalCents: 75000,
      isSponsorship: true,
    });
    expect(bare.text).toContain('GD-1044');
    expect(bare.text).not.toContain('undefined');
    expect(bare.subject).not.toContain('undefined');
  });

  it('gives them a person and a phone number', () => {
    for (const email of both) {
      expect(email.text).toContain('0422 883 943');
      expect(email.text).toContain('Ben');
    }
  });

  it('never invents a delivery date', () => {
    for (const email of both) {
      expect(
        /\b(\d+\s*(business\s*)?(days|weeks)|by (mon|tues|wednes|thurs|fri)day)\b/i.test(email.text),
        'A date nobody has committed to is a promise the person will hold us to',
      ).toBe(false);
    }
  });
});

describe('the voice holds', () => {
  it('has no em-dashes', () => {
    for (const email of both) {
      expect(email.text).not.toContain('—');
      expect(email.html).not.toContain('—');
    }
  });

  it('has no AI vocabulary', () => {
    for (const email of both) {
      const lower = email.text.toLowerCase();
      const found = AI_VOCAB.filter((word) => lower.includes(word));
      expect(found, `${email.subject} carries ${found.join(', ')}`).toEqual([]);
    }
  });

  it('carries no unsubscribe footer, because it is a reply and not a campaign', () => {
    for (const email of both) {
      expect(email.text.toLowerCase()).not.toContain('unsubscribe');
      expect(email.html.toLowerCase()).not.toContain('unsubscribe');
    }
  });

  it('escapes anything the buyer typed', () => {
    const nasty = buildOrderConfirmation({
      name: 'Jane',
      orderNumber: 'GD-1045',
      totalCents: 75000,
      isSponsorship: true,
      sponsoredCommunity: 'Utopia',
      sponsorMessage: '<script>alert(1)</script>',
    });
    expect(nasty.html).not.toContain('<script>');
    expect(nasty.html).toContain('&lt;script&gt;');
  });
});

describe('the path it travels', () => {
  const root = path.join(__dirname, '../..');
  const sender = fs.readFileSync(path.join(root, 'lib/ghl/index.ts'), 'utf8');
  const webhook = fs.readFileSync(path.join(root, 'app/api/webhooks/stripe/route.ts'), 'utf8');

  it('is actually sent when somebody pays', () => {
    expect(
      webhook.includes('buildOrderConfirmation') && webhook.includes('sendTransactionalReply'),
      'The Stripe webhook no longer sends the confirmation, so a person pays and hears nothing again',
    ).toBe(true);
  });

  it('never fails the webhook over an email', () => {
    const block = webhook.slice(webhook.indexOf('buildOrderConfirmation'));
    expect(
      block.includes('catch'),
      'A throw here would fail the webhook, Stripe would retry, and a paid order would be processed twice',
    ).toBe(true);
  });

  it('checks suppression before it sends', () => {
    const fn = sender.slice(sender.indexOf('async sendTransactionalReply'));
    const body = fn.slice(0, fn.indexOf('\n  },'));
    expect(
      body.includes('isSuppressed') && body.includes('dnd'),
      'A workflow checks do-not-contact for you. This path does not, so it has to check itself.',
    ).toBe(true);
    expect(
      body.indexOf('isSuppressed'),
      'The suppression check has to happen before the send, not after it',
    ).toBeLessThan(body.indexOf("'/conversations/messages'"));
  });
});
