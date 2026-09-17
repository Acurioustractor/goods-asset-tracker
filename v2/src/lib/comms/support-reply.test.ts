import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

import { buildSupportReply } from './support-reply';

/**
 * A person writes to this form when something they sleep on has broken. The guards are about the
 * two things that make the difference: that the message names their bed, and that an urgent
 * ticket does not get told to wait two business days.
 */

const routine = buildSupportReply({
  assetId: 'GB0-156-40',
  product: 'Stretch Bed',
  community: 'Tennant Creek',
  priority: 'Medium',
});

const urgent = buildSupportReply({
  assetId: 'GB0-156-41',
  product: 'Stretch Bed',
  community: 'Utopia',
  priority: 'Urgent',
});

const unknownAsset = buildSupportReply({ assetId: 'GB0-999-99', priority: 'Low' });

describe('the support reply', () => {
  it('names their bed in the subject, so it is not another generic email', () => {
    expect(routine.subject).toContain('GB0-156-40');
    expect(routine.subject).not.toMatch(/inquiry|enquiry|thank you for contacting/i);
  });

  it('tells them we found it on the register', () => {
    expect(routine.text).toContain('stretch bed');
    expect(routine.text).toContain('Tennant Creek');
  });

  it('still works when the register has never heard of the asset', () => {
    expect(unknownAsset.text).toContain('GB0-999-99');
    expect(unknownAsset.text).not.toContain('undefined');
    expect(unknownAsset.text).not.toContain('null');
  });

  it('leads with the phone when the ticket is urgent', () => {
    const firstHalf = urgent.text.slice(0, Math.floor(urgent.text.length / 2));
    expect(
      firstHalf.includes('0422 883 943'),
      'An urgent ticket that opens with a two-day promise is the failure this branch exists to fix',
    ).toBe(true);
  });

  it('never tells an urgent ticket to wait for the email', () => {
    expect(urgent.text).not.toContain('do not wait for the email');
    expect(routine.text).toContain('do not wait for the email');
  });

  it('gives every ticket the two business day commitment', () => {
    for (const email of [routine, urgent, unknownAsset]) {
      expect(email.text).toContain('two business days');
    }
  });

  it('holds the voice', () => {
    for (const email of [routine, urgent, unknownAsset]) {
      expect(email.text).not.toContain('—');
      expect(email.text.toLowerCase()).not.toContain('unsubscribe');
      expect(email.text.toLowerCase()).not.toContain('we are sorry for any inconvenience');
      expect(email.text).toContain('Ben');
    }
  });

  it('escapes the asset id, which arrives from a form', () => {
    const nasty = buildSupportReply({ assetId: '<script>x</script>', priority: 'Low' });
    expect(nasty.html).not.toContain('<script>');
  });
});

describe('the route sends it, and only it', () => {
  const route = fs.readFileSync(
    path.join(__dirname, '../../app/api/support/route.ts'),
    'utf8',
  );

  it('sends the reply', () => {
    expect(route.includes('buildSupportReply') && route.includes('sendTransactionalReply')).toBe(true);
  });

  it('no longer fires the generic acknowledgement as well', () => {
    expect(
      route.includes("'project-goods'"),
      'Two emails about one broken bed, and the generic one contradicts the specific one',
    ).toBe(false);
  });

  it('keeps the team notification', () => {
    expect(route.includes('sendSubmissionToInbox')).toBe(true);
  });
});
