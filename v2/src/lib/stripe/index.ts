import Stripe from 'stripe';

// Lazy initialization - only creates Stripe instance when first accessed
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }
    _stripe = new Stripe(key, {
      apiVersion: '2025-12-15.clover',
      typescript: true,
    });
  }
  return _stripe;
}

// Convenience alias
export const stripe = { get: getStripe };

export function formatAmountForStripe(amount: number): number {
  // Stripe expects amounts in the smallest currency unit (cents)
  return Math.round(amount);
}

export function formatAmountFromStripe(amount: number): number {
  // Convert from cents to dollars
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
 * Set `STRIPE_WEBHOOK_SECRET` to one (typically live) and
 * `STRIPE_WEBHOOK_SECRET_TEST` to the other. Either order works — the first
 * secret that verifies the signature is the right one for this event.
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

  let lastError: unknown;
  for (const secret of secrets) {
    try {
      return getStripe().webhooks.constructEvent(body, signature, secret);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error('Webhook signature verification failed');
}
