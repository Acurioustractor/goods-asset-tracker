import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

import { COMMS } from './facts';

/**
 * Three things were carried in the ledger as "not a code problem" and two of them turned out to
 * be. These guards hold the fixes in place.
 *
 * 1. The contact form never rendered the newsletter consent box, so the branch that grants
 *    comms:goods-newsletter had been dead since June and the list could only grow from the footer.
 * 2. Every reply arrived from "A Curious Tractor" and signed off "Goods on Country". The
 *    sub-account is shared with three other projects, so its name has to stay; the From name is
 *    set per message instead.
 * 3. The confirmation promises tracking and, for a sponsor, the QR link. Nothing sends either, and
 *    the checkout page has promised both since February.
 */

const ROOT = path.join(__dirname, '../..');
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

describe('the contact form can grow the list', () => {
  const page = read('app/contact/page.tsx');

  it('renders a consent checkbox', () => {
    expect(page).toContain('name="subscribe"');
    expect(page).toContain('type="checkbox"');
  });

  it('leaves it off by default, because a pre-ticked box is not consent', () => {
    const block = page.slice(page.indexOf('name="subscribe"'), page.indexOf('name="subscribe"') + 400);
    expect(block).not.toContain('defaultChecked');
    expect(block).not.toContain('checked={true}');
  });

  it('sends the answer, so the dormant branch in the route can fire', () => {
    expect(page).toContain("formData.get('subscribe')");
    const route = read('app/api/contact/route.ts');
    expect(route).toContain('body.subscribe === true');
    expect(route).toContain('newsletterConsent');
  });

  it('never promises more than the newsletter delivers', () => {
    const block = page.slice(page.indexOf('name="subscribe"'), page.indexOf('name="subscribe"') + 600);
    expect(block.toLowerCase()).toContain('unsubscribe');
    expect(block.toLowerCase()).not.toContain('weekly');
    expect(block.toLowerCase()).not.toContain('monthly');
  });
});

describe('Goods mail says Goods', () => {
  const sender = read('lib/ghl/index.ts');

  it('sets a From name on the send', () => {
    expect(COMMS.emailFrom).toContain('Goods on Country');
    expect(COMMS.emailFrom).toContain(COMMS.replyTo);
    expect(sender).toContain('emailFrom: COMMS.emailFrom');
  });

  it('falls back to the account default rather than failing the send', () => {
    const fn = sender.slice(sender.indexOf('async sendTransactionalReply'));
    const body = fn.slice(0, fn.indexOf('\n  },'));
    expect(
      body.split("'/conversations/messages'").length - 1,
      'There should be two attempts: one with the Goods From name, one without',
    ).toBe(2);
    expect(
      body.includes('retrying as the account default'),
      'A rejected From name must not cost somebody their reply',
    ).toBe(true);
  });
});

describe('the promises in the order confirmation have an owner', () => {
  const sender = read('lib/ghl/index.ts');
  const webhook = read('app/api/webhooks/stripe/route.ts');
  const email = read('lib/comms/order-confirmation.ts');

  it('still makes the promises, because the checkout page makes them too', () => {
    expect(email).toContain('tracking');
    expect(email).toContain('QR link');
  });

  it('raises a task for each one', () => {
    expect(sender).toContain('async raiseOrderPromiseTask');
    expect(webhook).toContain('raiseOrderPromiseTask');
  });

  it('asks for the right thing depending on what they bought', () => {
    const fn = sender.slice(sender.indexOf('async raiseOrderPromiseTask'));
    const body = fn.slice(0, fn.indexOf('\n  },'));
    expect(body).toContain('isSponsorship');
    expect(body).toContain('QR link');
    expect(body).toContain('Send tracking');
  });

  it('gives it a realistic clock', () => {
    const fn = sender.slice(sender.indexOf('async raiseOrderPromiseTask'));
    const body = fn.slice(0, fn.indexOf('\n  },'));
    expect(
      body.includes('24 * 14'),
      'A bed is made before it ships, and a task that is overdue on creation gets ignored',
    ).toBe(true);
  });

  it('sends the buyer nothing extra', () => {
    const fn = sender.slice(sender.indexOf('async raiseOrderPromiseTask'));
    const body = fn.slice(0, fn.indexOf('\n  },'));
    expect(body).not.toContain('sendTransactionalReply');
    expect(body).toContain('createContactTask');
  });
});
