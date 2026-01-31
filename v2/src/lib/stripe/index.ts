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
 * Verify and construct a Stripe webhook event
 * @param body - Raw request body as string
 * @param signature - Stripe-Signature header value
 * @returns Stripe.Event if valid, throws error if invalid
 */
export function constructWebhookEvent(
  body: string,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set');
  }

  return getStripe().webhooks.constructEvent(body, signature, webhookSecret);
}
