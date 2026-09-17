import { describe, it, expect, vi, beforeEach } from 'vitest';

const addTags = vi.fn();
const sendTransactionalReply = vi.fn();

vi.mock('@/lib/ghl', () => ({
  ghl: {
    addTags: (...args: unknown[]) => addTags(...args),
    sendTransactionalReply: (...args: unknown[]) => sendTransactionalReply(...args),
  },
}));

const { acknowledgeOrReply, REPLY_BUILDERS, subjectsWithOwnReply } = await import('./replies');

/**
 * One person, one reply. The whole point of putting this decision in a function rather than in
 * each route is that the two outcomes cannot both happen, so that is what these prove.
 */

beforeEach(() => {
  addTags.mockReset().mockResolvedValue({ success: true });
  sendTransactionalReply.mockReset().mockResolvedValue({ success: true });
});

describe('acknowledgeOrReply', () => {
  it('sends our own reply for a subject we have written, and never stamps the trigger tag', async () => {
    const outcome = await acknowledgeOrReply({
      contactId: 'abc',
      subject: 'Bulk Order Inquiry',
      context: { organisation: 'Barkly Regional Council' },
    });
    expect(outcome).toBe('replied');
    expect(sendTransactionalReply).toHaveBeenCalledTimes(1);
    expect(
      addTags,
      'Stamping project-goods here would fire the generic letter as well, so the buyer gets two emails',
    ).not.toHaveBeenCalled();
  });

  it('falls back to the generic acknowledgement for a subject we have not written', async () => {
    const outcome = await acknowledgeOrReply({ contactId: 'abc', subject: 'General Inquiry' });
    expect(outcome).toBe('acknowledged');
    expect(addTags).toHaveBeenCalledWith('abc', ['project-goods']);
    expect(sendTransactionalReply).not.toHaveBeenCalled();
  });

  it('treats an unknown subject as generic rather than as silence', async () => {
    const outcome = await acknowledgeOrReply({ contactId: 'abc', subject: 'Something New' });
    expect(outcome).toBe('acknowledged');
    expect(addTags).toHaveBeenCalled();
  });

  it('reports failure without throwing, because the enquiry is already recorded', async () => {
    sendTransactionalReply.mockResolvedValue({ success: false, error: 'boom' });
    const outcome = await acknowledgeOrReply({ contactId: 'abc', subject: 'Bulk Order Inquiry' });
    expect(outcome).toBe('failed');
  });

  it('does not treat a suppressed contact as a failure', async () => {
    sendTransactionalReply.mockResolvedValue({ success: false, skipped: 'suppressed' });
    const outcome = await acknowledgeOrReply({ contactId: 'abc', subject: 'Bulk Order Inquiry' });
    expect(outcome).toBe('replied');
  });

  it('survives GHL throwing', async () => {
    sendTransactionalReply.mockRejectedValue(new Error('network'));
    await expect(
      acknowledgeOrReply({ contactId: 'abc', subject: 'Bulk Order Inquiry' }),
    ).resolves.toBe('failed');
  });
});

describe('the branch registry', () => {
  it('only holds subjects the contact form can actually send', async () => {
    const route = await import('node:fs').then((fs) =>
      fs.readFileSync(new URL('../../app/api/contact/route.ts', import.meta.url), 'utf8'),
    );
    for (const subject of subjectsWithOwnReply()) {
      expect(
        route.includes(`'${subject}'`),
        `${subject} has a written reply and is not in CONTACT_SUBJECTS, so it can never arrive`,
      ).toBe(true);
    }
  });

  it('builds something for every subject it claims', () => {
    for (const [subject, build] of Object.entries(REPLY_BUILDERS)) {
      const email = build({ organisation: 'Test Org' });
      expect(email.subject.length, `${subject} builds an empty subject`).toBeGreaterThan(5);
      expect(email.text.length, `${subject} builds an empty body`).toBeGreaterThan(80);
      expect(email.text).not.toContain('—');
      expect(email.text.toLowerCase()).not.toContain('unsubscribe');
    }
  });
});
