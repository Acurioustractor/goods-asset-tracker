import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { constructWebhookEvent, getStripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/server';
import { ghl } from '@/lib/ghl';

export const runtime = 'nodejs';

// Disable body parsing - Stripe needs raw body for signature verification
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('Webhook error: Missing stripe-signature header');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = constructWebhookEvent(body, signature);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return NextResponse.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Webhook handler error: ${errorMessage}`);
    return NextResponse.json(
      { error: `Handler Error: ${errorMessage}` },
      { status: 500 }
    );
  }
}

/**
 * Handle successful checkout session completion
 * Creates the order and order items in the database
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  console.log(`Processing checkout.session.completed: ${session.id}`);

  const supabase = createServiceClient();

  // Check if order already exists (idempotency)
  const { data: existingOrder } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_checkout_session_id', session.id)
    .single();

  if (existingOrder) {
    console.log(`Order already exists for session ${session.id}, skipping`);
    return;
  }

  // Retrieve full session with line items
  const stripe = getStripe();
  const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ['line_items.data.price.product'],
  });

  // Parse items metadata from session
  const itemsMetadata = fullSession.metadata?.items
    ? JSON.parse(fullSession.metadata.items)
    : [];

  // Check if this is a sponsorship order
  const isSponsorship = itemsMetadata.some(
    (item: { is_sponsorship?: boolean }) => item.is_sponsorship
  );
  const sponsoredCommunity =
    itemsMetadata.find(
      (item: { is_sponsorship?: boolean }) => item.is_sponsorship
    )?.sponsored_community || null;

  // Extract shipping address (type assertion needed as Stripe types may not include shipping_details)
  const shippingDetails = (fullSession as Stripe.Checkout.Session & {
    shipping_details?: {
      name?: string | null;
      address?: Stripe.Address | null;
    } | null
  }).shipping_details;
  const shippingAddress = shippingDetails?.address
    ? {
        line1: shippingDetails.address.line1 || '',
        line2: shippingDetails.address.line2 || undefined,
        city: shippingDetails.address.city || '',
        state: shippingDetails.address.state || '',
        postcode: shippingDetails.address.postal_code || '',
        country: shippingDetails.address.country || 'AU',
      }
    : null;

  // Extract billing address from customer details
  const customerDetails = fullSession.customer_details;
  const billingAddress = customerDetails?.address
    ? {
        line1: customerDetails.address.line1 || '',
        line2: customerDetails.address.line2 || undefined,
        city: customerDetails.address.city || '',
        state: customerDetails.address.state || '',
        postcode: customerDetails.address.postal_code || '',
        country: customerDetails.address.country || 'AU',
      }
    : null;

  // Calculate totals (amount is in cents)
  const totalCents = fullSession.amount_total || 0;
  const subtotalCents = fullSession.amount_subtotal || totalCents;
  const shippingCents =
    fullSession.shipping_cost?.amount_total || 0;

  // Create the order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_email: customerDetails?.email || '',
      customer_name: shippingDetails?.name || customerDetails?.name || null,
      customer_phone: customerDetails?.phone || null,
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      subtotal_cents: subtotalCents,
      shipping_cents: shippingCents,
      tax_cents: 0,
      discount_cents: 0,
      total_cents: totalCents,
      currency: fullSession.currency?.toUpperCase() || 'AUD',
      status: 'paid',
      payment_status: 'paid',
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id:
        typeof fullSession.payment_intent === 'string'
          ? fullSession.payment_intent
          : fullSession.payment_intent?.id || null,
      paid_at: new Date().toISOString(),
      is_sponsorship: isSponsorship,
      sponsored_community: sponsoredCommunity,
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error('Failed to create order:', orderError);
    throw new Error(`Failed to create order: ${orderError?.message}`);
  }

  console.log(`Created order ${order.order_number} (${order.id})`);

  // Create order items from line items
  const lineItems = fullSession.line_items?.data || [];
  const orderItems = lineItems.map((lineItem) => {
    const product = lineItem.price?.product as Stripe.Product | undefined;
    const metadata = product?.metadata || {};

    return {
      order_id: order.id,
      product_id: metadata.product_id || null,
      product_name: product?.name || lineItem.description || 'Unknown Product',
      product_type: metadata.product_type || null,
      product_image: product?.images?.[0] || null,
      quantity: lineItem.quantity || 1,
      unit_price_cents: lineItem.price?.unit_amount || 0,
      total_cents: lineItem.amount_total || 0,
    };
  });

  if (orderItems.length > 0) {
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Failed to create order items:', itemsError);
      // Don't throw - order is created, items are secondary
    } else {
      console.log(`Created ${orderItems.length} order items`);
    }
  }

  // Create/update contact in GoHighLevel CRM
  const productTypes = orderItems.map((item) => item.product_type || 'unknown');
  const ghlContactData = {
    email: customerDetails?.email || '',
    name: shippingDetails?.name || customerDetails?.name || undefined,
    phone: customerDetails?.phone || undefined,
    orderNumber: order.order_number,
    totalCents: totalCents,
    isSponsorship: isSponsorship,
    sponsoredCommunity: sponsoredCommunity || undefined,
    productTypes: productTypes,
  };

  console.log(`[GHL] Attempting to create contact for order ${order.order_number}`, {
    hasEmail: !!ghlContactData.email,
    hasName: !!ghlContactData.name,
    hasPhone: !!ghlContactData.phone,
    orderNumber: ghlContactData.orderNumber,
    totalCents: ghlContactData.totalCents,
    isSponsorship: ghlContactData.isSponsorship,
    productTypes: ghlContactData.productTypes,
  });

  const ghlResult = await ghl.createOrderContact(ghlContactData);

  console.log(`[GHL] Result for order ${order.order_number}:`, {
    success: ghlResult.success,
    error: ghlResult.error,
    contactId: ghlResult.contact?.id,
    fullResponse: JSON.stringify(ghlResult),
  });

  if (ghlResult.success) {
    console.log(`[GHL] ✓ Contact created/updated for order ${order.order_number}, contact ID: ${ghlResult.contact?.id}`);
  } else {
    console.error(`[GHL] ✗ Contact creation failed for order ${order.order_number}: ${ghlResult.error}`);
  }

  console.log(`Successfully processed checkout session ${session.id}`);
}

/**
 * Handle successful payment intent
 * This may fire separately from checkout.session.completed
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`Processing payment_intent.succeeded: ${paymentIntent.id}`);

  const supabase = createServiceClient();

  // Update order payment status if order exists
  const { error } = await supabase
    .from('orders')
    .update({
      payment_status: 'paid',
      paid_at: new Date().toISOString(),
    })
    .eq('stripe_payment_intent_id', paymentIntent.id);

  if (error) {
    console.error('Failed to update order payment status:', error);
  }
}

/**
 * Handle failed payment intent
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log(`Processing payment_intent.payment_failed: ${paymentIntent.id}`);

  const supabase = createServiceClient();

  // Update order status if order exists
  const { error } = await supabase
    .from('orders')
    .update({
      payment_status: 'unpaid',
      status: 'cancelled',
      internal_notes: `Payment failed: ${paymentIntent.last_payment_error?.message || 'Unknown error'}`,
    })
    .eq('stripe_payment_intent_id', paymentIntent.id);

  if (error) {
    console.error('Failed to update order for payment failure:', error);
  }
}

/**
 * Handle refunded charge
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log(`Processing charge.refunded: ${charge.id}`);

  const supabase = createServiceClient();

  // Determine if full or partial refund
  const paymentStatus =
    charge.amount_refunded === charge.amount ? 'refunded' : 'partial_refund';
  const orderStatus = paymentStatus === 'refunded' ? 'refunded' : 'paid';

  // Find and update order by payment intent
  const paymentIntentId =
    typeof charge.payment_intent === 'string'
      ? charge.payment_intent
      : charge.payment_intent?.id;

  if (!paymentIntentId) {
    console.error('No payment intent ID on refunded charge');
    return;
  }

  const { error } = await supabase
    .from('orders')
    .update({
      payment_status: paymentStatus,
      status: orderStatus,
      internal_notes: `Refund processed: ${charge.amount_refunded / 100} ${charge.currency.toUpperCase()}`,
    })
    .eq('stripe_payment_intent_id', paymentIntentId);

  if (error) {
    console.error('Failed to update order for refund:', error);
  }
}
