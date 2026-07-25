import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const addToNewsletter = vi.fn();

vi.mock('@/lib/ghl', () => ({
  ghl: {
    addToNewsletter: (...args: unknown[]) => addToNewsletter(...args),
  },
}));

import { POST } from './route';

function makeRequest(body: unknown) {
  return new NextRequest('https://www.goodsoncountry.com/api/newsletter', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  addToNewsletter.mockReset();
});

describe('POST /api/newsletter', () => {
  it('fails closed when explicit consent is absent', async () => {
    const response = await POST(makeRequest({ email: 'person@example.com', tag: 'footer' }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: 'Please confirm that you want to receive Goods updates.',
    });
    expect(addToNewsletter).not.toHaveBeenCalled();
  });

  it('returns subscribed only after a confirmed HighLevel write', async () => {
    addToNewsletter.mockResolvedValue({
      success: true,
      contact: { id: 'ghl-contact-1', email: 'person@example.com' },
    });

    const response = await POST(
      makeRequest({ email: 'person@example.com', tag: 'footer', consent: true })
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      success: true,
      status: 'subscribed',
      message: "You're subscribed! We'll keep you in the loop.",
    });
    expect(addToNewsletter).toHaveBeenCalledWith({
      email: 'person@example.com',
      phone: undefined,
      name: undefined,
      tag: 'footer',
      newsletterConsent: 'Yes',
    });
  });

  it('does not claim subscription when HighLevel fails', async () => {
    addToNewsletter.mockResolvedValue({ success: false, error: 'upstream failed' });

    const response = await POST(
      makeRequest({ email: 'person@example.com', consent: true })
    );

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      error: 'We could not confirm your subscription. Please try again.',
    });
  });

  it('does not claim subscription when HighLevel is simulated or disabled', async () => {
    addToNewsletter.mockResolvedValue({
      success: true,
      simulated: true,
      contact: { id: 'simulated' },
    });

    const response = await POST(
      makeRequest({ phone: '+61400000000', consent: true })
    );

    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({
      error: 'We could not confirm your subscription. Please try again.',
    });
  });
});
