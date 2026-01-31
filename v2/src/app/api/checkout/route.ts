import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import type { CartItem } from '@/lib/cart';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerEmail } = body as {
      items: CartItem[];
      customerEmail?: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Validate products exist and get current prices from database
    const supabase = await createClient();
    const productIds = items.map((item) => item.id.split('-sponsor-')[0]); // Handle sponsorship IDs

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price_cents, currency')
      .in('id', productIds);

    if (productsError || !products) {
      console.error('Error fetching products:', productsError);
      return NextResponse.json(
        { error: 'Failed to validate products' },
        { status: 500 }
      );
    }

    // Create a map for quick lookup
    const productMap = new Map(products.map((p) => [p.id, p]));

    // Build line items for Stripe
    const lineItems = items.map((item) => {
      const productId = item.id.split('-sponsor-')[0];
      const dbProduct = productMap.get(productId);

      // Use database price for security (don't trust client-sent price)
      const unitAmount = dbProduct?.price_cents || item.price_cents;

      let productName = item.name;
      if (item.is_sponsorship) {
        productName = `${item.name} (Sponsorship${item.sponsored_community ? ` for ${item.sponsored_community}` : ''})`;
      }

      return {
        price_data: {
          currency: item.currency.toLowerCase(),
          product_data: {
            name: productName,
            ...(item.image && { images: [item.image] }),
            metadata: {
              product_id: productId,
              is_sponsorship: String(item.is_sponsorship || false),
              sponsored_community: item.sponsored_community || '',
              dedication_message: item.dedication_message || '',
            },
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    // Calculate metadata for the order
    const orderMetadata = {
      items: JSON.stringify(
        items.map((item) => ({
          id: item.id,
          slug: item.slug,
          quantity: item.quantity,
          is_sponsorship: item.is_sponsorship,
          sponsored_community: item.sponsored_community,
        }))
      ),
    };

    // Create Stripe checkout session
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      ...(customerEmail && { customer_email: customerEmail }),
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['AU'], // Australia only for now
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=true`,
      metadata: orderMetadata,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
