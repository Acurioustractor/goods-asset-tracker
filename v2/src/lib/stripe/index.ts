import Stripe from 'stripe';

// Lazy-cached Stripe clients, one per mode. Production traffic hits both:
//   - /api/checkout creates LIVE sessions for real customer purchases.
//   - /api/webhooks/stripe receives BOTH live and test events at the same
//     endpoint, and must use the matching mode's API key for follow-up
//     reads like checkout.sessions.retrieve(). A LIVE key cannot retrieve
//     a TEST session (Stripe returns "No such checkout.session") and vice
//     versa.
const _stripeByMode: { live: Stripe | null; test: Stripe | null } = {
  live: null,
  test: null,
};

function makeStripe(key: string): Stripe {
  return new Stripe(key, {
    apiVersion: '2025-12-15.clover',
    typescript: true,
  });
}

export type StripeMode = 'live' | 'test';

/**
 * Get a Stripe client for a specific mode.
 *
 * - 'live' → uses `STRIPE_SECRET_KEY` (the default)
 * - 'test' → uses `STRIPE_SECRET_KEY_TEST`
 *
 * Throws if the required env var for that mode is not set.
 */
export function getStripe(mode: StripeMode = 'live'): Stripe {
  if (_stripeByMode[mode]) return _stripeByMode[mode] as Stripe;
  const envName = mode === 'live' ? 'STRIPE_SECRET_KEY' : 'STRIPE_SECRET_KEY_TEST';
  const key = process.env[envName];
  if (!key) {
    throw new Error(`${envName} is not set`);
  }
  const client = makeStripe(key);
  _stripeByMode[mode] = client;
  return client;
}

/**
 * Pick the right Stripe client for a webhook event.
 * Stripe events carry `livemode: true | false` — use that to route
 * follow-up API reads to the correct mode's key.
 */
export function getStripeForEvent(event: Stripe.Event): Stripe {
  return getStripe(event.livemode ? 'live' : 'test');
}

// Convenience alias for callers that explicitly want the live client.
export const stripe = { get: () => getStripe('live') };

export function formatAmountForStripe(amount: number): number {
  return Math.round(amount);
}

export function formatAmountFromStripe(amount: number): number {
  return amount / 100;
}

/**
 * Verify and construct a Stripe webhook event.
 *
 * Tries each configured webhook secret in turn so the SAME endpoint can serve
 * both Stripe Live and Stripe Test events. Stripe signs test-mode events with
 * the test endpoint's secret and live-mode events with the live endpoint's
 * secret — they will never match each other. Both Stripe Dashboard endpoints
 * can point at /api/webhooks/stripe; the right secret wins per request.
 *
 * Set `STRIPE_WEBHOOK_SECRET` to the live secret and
 * `STRIPE_WEBHOOK_SECRET_TEST` to the test secret. The first secret that
 * verifies the signature is the right one for this event.
 *
 * @param body - Raw request body as string
 * @param signature - Stripe-Signature header value
 * @returns Stripe.Event if valid, throws the last verification error if not
 */
export function constructWebhookEvent(
  body: string,
  signature: string
): Stripe.Event {
  const secrets = [
    process.env.STRIPE_WEBHOOK_SECRET,
    process.env.STRIPE_WEBHOOK_SECRET_TEST,
  ].filter((s): s is string => Boolean(s));

  if (secrets.length === 0) {
    throw new Error('STRIPE_WEBHOOK_SECRET (or STRIPE_WEBHOOK_SECRET_TEST) is not set');
  }

  // Stripe's webhooks.constructEvent only needs a Stripe instance for its
  // crypto helpers, not a mode-specific key — using the live client is fine
  // for verification of either mode's signature.
  const client = getStripe('live');

  let lastError: unknown;
  for (const secret of secrets) {
    try {
      return client.webhooks.constructEvent(body, signature, secret);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error('Webhook signature verification failed');
}
