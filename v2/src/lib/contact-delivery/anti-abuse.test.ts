import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const createServiceClient = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createServiceClient: (...args: unknown[]) => createServiceClient(...args),
}));

import { guardContactSubmission } from './anti-abuse';

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv('CONTACT_RATE_LIMIT_SECRET', 'test-contact-secret');
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('public contact abuse guard', () => {
  it('silently rejects a filled honeypot without touching the database', async () => {
    const result = await guardContactSubmission(
      new Request('https://www.goodsoncountry.com/api/contact'),
      { honeypot: 'https://spam.example', identity: 'bot@example.com' },
    );

    expect(result).toEqual({ allowed: false, reason: 'honeypot' });
    expect(createServiceClient).not.toHaveBeenCalled();
  });

  it('enforces a shared server-side limit using only a secret fingerprint', async () => {
    const query = {
      select: vi.fn(),
      eq: vi.fn(),
      gte: vi.fn(),
    };
    query.select.mockReturnValue(query);
    query.eq.mockReturnValue(query);
    query.gte.mockResolvedValue({ count: 12, error: null });
    createServiceClient.mockReturnValue({ from: vi.fn().mockReturnValue(query) });

    const result = await guardContactSubmission(
      new Request('https://www.goodsoncountry.com/api/contact', {
        headers: { 'x-forwarded-for': '203.0.113.10' },
      }),
      { identity: 'person@example.com' },
    );

    expect(result).toEqual(expect.objectContaining({
      allowed: false,
      reason: 'rate-limit',
      fingerprint: expect.stringMatching(/^[a-f0-9]{64}$/),
    }));
    expect(query.eq).toHaveBeenCalledWith(
      'payload->>_clientFingerprint',
      expect.stringMatching(/^[a-f0-9]{64}$/),
    );
  });
});
