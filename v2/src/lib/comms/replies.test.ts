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
const { buildMediaPackReply } = await import('./media-pack-reply');
const { buildCapitalReply } = await import('./capital-reply');
const { buildCommunityReply } = await import('./community-reply');

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
    // LGANT is a real contact-form subject with no branch of its own, so it is the honest example
    // of the fallback. General Inquiry used to be one and now has branch seven.
    const outcome = await acknowledgeOrReply({
      contactId: 'abc',
      subject: 'LGANT 2026: place put forward',
    });
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

describe('the media pack reply', () => {
  const email = buildMediaPackReply({});

  it('sends the link rather than promising one', () => {
    expect(email.text).toContain('https://www.goodsoncountry.com/press');
    expect(
      email.text.toLowerCase(),
      'A journalist asked for a link. Two business days is the wrong answer.',
    ).not.toContain('two business days');
  });

  it('says which photographs are cleared, and which are not', () => {
    expect(email.text).toContain('consented to those specific images');
    expect(email.text).toContain('rather than pulling images off the rest of the site');
  });

  it('puts talking to community behind their own decision', () => {
    expect(email.text).toContain('That is their call');
  });

  it('makes the link clickable without breaking the escaping', () => {
    expect(email.html).toContain('href="https://www.goodsoncountry.com/press"');
    expect(email.html).not.toContain('<script');
  });
});

describe('the capital reply', () => {
  const email = buildCapitalReply({});

  it('says what a facility is before asking anybody to fund one', () => {
    expect(email.text).toContain('presses beds from recycled plastic');
    expect(email.text).toContain('employs local people');
  });

  it('keeps ownership a pathway, never a finished claim', () => {
    expect(email.text).toContain('moves toward that community owning it');
    expect(email.text.toLowerCase()).not.toContain('community owned facility');
    expect(email.text.toLowerCase()).not.toContain('owned by the community');
  });

  it('names both kinds of capital, so a funder who can only do one does not guess', () => {
    expect(email.text).toContain('grant');
    expect(email.text).toContain('recoverable');
  });

  it('commits to the numbers rather than to a meeting', () => {
    expect(email.text).toContain('what a facility costs to stand up');
    expect(email.text).toContain('two business days');
  });

  it('carries no unsubscribe, which is the whole reason it is not a workflow', () => {
    expect(email.text.toLowerCase()).not.toContain('unsubscribe');
    expect(email.html.toLowerCase()).not.toContain('unsubscribe');
  });
});

describe('the community reply', () => {
  const withPhone = buildCommunityReply({ phone: '0400 000 000' });
  const withoutPhone = buildCommunityReply({});

  it('puts the decision with the community before anything else', () => {
    expect(withPhone.text).toContain('until that community has decided it wants it');
    expect(withPhone.text).toContain('who gets paid');
  });

  it('promises a call, not an email thread', () => {
    expect(withPhone.text).toContain('I will ring you within two business days');
  });

  it('asks for a number instead when we do not have one', () => {
    expect(
      withoutPhone.text,
      'Promising to ring somebody who never gave us a number is a promise nobody can keep',
    ).toContain('Reply with a number');
    expect(withoutPhone.text).toContain('two business days');
  });

  it('asks who else should be on the call, either way', () => {
    for (const email of [withPhone, withoutPhone]) {
      expect(email.text).toContain('someone else who should be on that call');
    }
  });

  it('never claims a facility or a decision that has not been made', () => {
    for (const email of [withPhone, withoutPhone]) {
      expect(email.text.toLowerCase()).not.toContain('we will build');
      expect(email.text.toLowerCase()).not.toContain('your facility');
    }
  });
});
