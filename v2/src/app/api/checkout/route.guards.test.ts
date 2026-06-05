/**
 * Tests for the POST handler in src/app/api/checkout/route.ts.
 *
 * Behaviour derived directly from the route source — we never invent
 * behaviour. Specifically:
 *   - 400 "No items in cart" when items is missing or empty.
 *   - 500 "Failed to validate products" when Supabase returns an error or
 *     no rows.
 *   - 400 "Only the Stretch Bed is available for checkout." when ANY cart
 *     item fails the (dbProduct present) AND (is_active) AND
 *     (isPurchasableProductType(product_type)) check.
 *   - DB price authority: unit_amount in the Stripe line items comes from
 *     the DB row (dbProduct.price_cents), never from the client request.
 *   - Currency is lowercased before being passed to Stripe.
 *   - Sponsorship: the product_name gets " (Sponsorship[ for X])" appended
 *     and the metadata gets is_sponsorship/sponsored_community/dedication_message
 *     fields (stringified).
 *   - Image URL is absolutized — relative paths get the request origin
 *     (or fall back to https://www.goodsoncountry.com when origin is
 *     localhost) prepended; already-absolute URLs are passed through.
 *   - success_url uses the request origin (or localhost fallback); cancel_url
 *     appends /checkout?canceled=true.
 *   - customerEmail is only attached when present.
 *   - shipping_address_collection.allowed_countries is ['AU'].
 *   - billing_address_collection is 'required'.
 *   - phone_number_collection.enabled is true.
 *
 * The route uses `await createClient()` (the server client, which reads
 * cookies via next/headers) — we mock the whole module so neither the
 * cookies() helper nor the real Supabase URL is touched.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/headers' cookies() so the supabase/server module's createClient
// can be called in a non-Next-runtime test environment.
vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({
    getAll: () => [],
    set: () => {},
  })),
}));

// Mock the supabase server client. Tests build a chainable `from().select().in()`
// query builder, returning a controlled { data, error } object.
const mockFrom = vi.fn();
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => ({
    from: (...args: unknown[]) => mockFrom(...args),
  })),
}));

// Mock the stripe module. getStripe() returns an object with a chainable
// checkout.sessions.create that resolves with a fake session.
const mockSessionsCreate = vi.fn();
vi.mock('@/lib/stripe', () => ({
  getStripe: vi.fn(() => ({
    checkout: {
      sessions: {
        create: (...args: unknown[]) => mockSessionsCreate(...args),
      },
    },
  })),
}));

import { POST } from './route';
import { NextRequest } from 'next/server';
import { STRETCH_BED, WASHING_MACHINE } from '@/lib/data/products';

// --- Test helpers ----------------------------------------------------------

const STRETCH_BED_DB_ROW = {
  id: 'db-stretch-bed-1',
  name: STRETCH_BED.name,
  price_cents: 75000, // DB-canonical price ($750.00)
  currency: 'AUD',
  product_type: STRETCH_BED.productType,
  is_active: true,
};

const WASHING_MACHINE_DB_ROW = {
  id: 'db-washer-1',
  name: WASHING_MACHINE.name,
  price_cents: 999,
  currency: 'AUD',
  product_type: WASHING_MACHINE.productType,
  is_active: true,
};

function makeRequest(
  body: unknown,
  origin = 'https://www.goodsoncountry.com'
): NextRequest {
  return new NextRequest('https://www.goodsoncountry.com/api/checkout', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin,
    },
    body: JSON.stringify(body),
  });
}

function setupSupabase(rows: unknown[] | null, error: unknown = null) {
  // Build a chainable query builder: from(table).select(cols).in(col, vals)
  // returns { data, error }.
  const inFn = vi.fn().mockResolvedValue({ data: rows, error });
  const select = vi.fn().mockReturnValue({ in: inFn });
  const fromFn = vi.fn().mockReturnValue({ select });
  mockFrom.mockImplementation(fromFn);
  return { fromFn, select, inFn };
}

beforeEach(() => {
  mockFrom.mockReset();
  mockSessionsCreate.mockReset();
  // Default: a successful session
  mockSessionsCreate.mockResolvedValue({
    id: 'cs_test_123',
    url: 'https://checkout.stripe.com/c/pay/cs_test_123',
  });
});

// --- Guard: empty / malformed cart -----------------------------------------

describe('POST /api/checkout — empty / malformed cart', () => {
  it('returns 400 "No items in cart" when items is missing', async () => {
    setupSupabase([]);
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('No items in cart');
    // We must NOT touch the DB or Stripe if the cart is empty.
    expect(mockFrom).not.toHaveBeenCalled();
    expect(mockSessionsCreate).not.toHaveBeenCalled();
  });

  it('returns 400 "No items in cart" when items is an empty array', async () => {
    setupSupabase([]);
    const res = await POST(makeRequest({ items: [] }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('No items in cart');
    expect(mockFrom).not.toHaveBeenCalled();
    expect(mockSessionsCreate).not.toHaveBeenCalled();
  });
});

// --- Guard: non-purchasable product types ----------------------------------

describe('POST /api/checkout — product-type guard', () => {
  it('rejects a washing_machine line with 400 "Only the Stretch Bed is available for checkout."', async () => {
    setupSupabase([WASHING_MACHINE_DB_ROW]);
    const res = await POST(
      makeRequest({
        items: [
          {
            id: WASHING_MACHINE_DB_ROW.id,
            slug: WASHING_MACHINE.slug,
            name: WASHING_MACHINE.name,
            price_cents: 1, // client claims $0.01 — should not matter
            currency: 'AUD',
            product_type: WASHING_MACHINE.productType,
            quantity: 1,
          },
        ],
      })
    );
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe(
      'Only the Stretch Bed is available for checkout.'
    );
    expect(mockSessionsCreate).not.toHaveBeenCalled();
  });

  it('rejects a cart that mixes stretch_bed with a non-purchasable item', async () => {
    // Both items come back from the DB. The washer row is active and
    // present, but its product_type fails the isPurchasableProductType
    // check, so the whole cart is rejected.
    setupSupabase([STRETCH_BED_DB_ROW, WASHING_MACHINE_DB_ROW]);
    const res = await POST(
      makeRequest({
        items: [
          {
            id: STRETCH_BED_DB_ROW.id,
            slug: STRETCH_BED.slug,
            name: STRETCH_BED.name,
            price_cents: 1,
            currency: 'AUD',
            product_type: STRETCH_BED.productType,
            quantity: 1,
          },
          {
            id: WASHING_MACHINE_DB_ROW.id,
            slug: WASHING_MACHINE.slug,
            name: WASHING_MACHINE.name,
            price_cents: 1,
            currency: 'AUD',
            product_type: WASHING_MACHINE.productType,
            quantity: 1,
          },
        ],
      })
    );
    expect(res.status).toBe(400);
    expect(mockSessionsCreate).not.toHaveBeenCalled();
  });

  it('rejects an item whose id is not present in the products table', async () => {
    // DB returns nothing for the requested ids — invalidItems picks up the
    // missing-product condition (dbProduct is undefined).
    setupSupabase([]);
    const res = await POST(
      makeRequest({
        items: [
          {
            id: 'ghost-id-not-in-db',
            slug: 'ghost',
            name: 'Ghost',
            price_cents: 1,
            currency: 'AUD',
            product_type: STRETCH_BED.productType,
            quantity: 1,
          },
        ],
      })
    );
    expect(res.status).toBe(400);
    expect(mockSessionsCreate).not.toHaveBeenCalled();
  });

  it('rejects an item whose DB row is_active = false', async () => {
    setupSupabase([{ ...STRETCH_BED_DB_ROW, is_active: false }]);
    const res = await POST(
      makeRequest({
        items: [
          {
            id: STRETCH_BED_DB_ROW.id,
            slug: STRETCH_BED.slug,
            name: STRETCH_BED.name,
            price_cents: 1,
            currency: 'AUD',
            product_type: STRETCH_BED.productType,
            quantity: 1,
          },
        ],
      })
    );
    expect(res.status).toBe(400);
    expect(mockSessionsCreate).not.toHaveBeenCalled();
  });
});

// --- Guard: Supabase failure -----------------------------------------------

describe('POST /api/checkout — Supabase failure', () => {
  it('returns 500 "Failed to validate products" when Supabase returns an error', async () => {
    setupSupabase(null, { message: 'db down' });
    const res = await POST(
      makeRequest({
        items: [
          {
            id: STRETCH_BED_DB_ROW.id,
            slug: STRETCH_BED.slug,
            name: STRETCH_BED.name,
            price_cents: 1,
            currency: 'AUD',
            product_type: STRETCH_BED.productType,
            quantity: 1,
          },
        ],
      })
    );
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe('Failed to validate products');
    expect(mockSessionsCreate).not.toHaveBeenCalled();
  });

  it('returns 500 "Failed to validate products" when Supabase returns no data', async () => {
    setupSupabase(null, null);
    const res = await POST(
      makeRequest({
        items: [
          {
            id: STRETCH_BED_DB_ROW.id,
            slug: STRETCH_BED.slug,
            name: STRETCH_BED.name,
            price_cents: 1,
            currency: 'AUD',
            product_type: STRETCH_BED.productType,
            quantity: 1,
          },
        ],
      })
    );
    expect(res.status).toBe(500);
  });
});

// --- DB-price authority (the headline hardening) ---------------------------

describe('POST /api/checkout — DB price authority', () => {
  it('uses the database price, ignoring the client-supplied price_cents', async () => {
    setupSupabase([STRETCH_BED_DB_ROW]); // DB says 75000
    await POST(
      makeRequest({
        items: [
          {
            id: STRETCH_BED_DB_ROW.id,
            slug: STRETCH_BED.slug,
            name: STRETCH_BED.name,
            price_cents: 1, // client tries to pay $0.01
            currency: 'AUD',
            product_type: STRETCH_BED.productType,
            quantity: 1,
          },
        ],
      })
    );
    expect(mockSessionsCreate).toHaveBeenCalledTimes(1);
    const stripeArgs = mockSessionsCreate.mock.calls[0][0];
    expect(stripeArgs.line_items[0].price_data.unit_amount).toBe(75000);
  });

  it('rejects a zero-priced client even if the DB has a valid row (DB is the source of truth)', async () => {
    // Client sets price to 0. DB still has 75000. The line item gets 75000
    // from the DB. The point of this test: the client price is NEVER read.
    setupSupabase([STRETCH_BED_DB_ROW]);
    await POST(
      makeRequest({
        items: [
          {
            id: STRETCH_BED_DB_ROW.id,
            slug: STRETCH_BED.slug,
            name: STRETCH_BED.name,
            price_cents: 0,
            currency: 'AUD',
            product_type: STRETCH_BED.productType,
            quantity: 3,
          },
        ],
      })
    );
    const stripeArgs = mockSessionsCreate.mock.calls[0][0];
    expect(stripeArgs.line_items[0].price_data.unit_amount).toBe(75000);
    expect(stripeArgs.line_items[0].quantity).toBe(3); // quantity is client-supplied (no DB column for it)
  });

  it('uses the DB currency lowercased, not the client currency', async () => {
    setupSupabase([{ ...STRETCH_BED_DB_ROW, currency: 'AUD' }]);
    await POST(
      makeRequest({
        items: [
          {
            id: STRETCH_BED_DB_ROW.id,
            slug: STRETCH_BED.slug,
            name: STRETCH_BED.name,
            price_cents: 1,
            currency: 'usd', // client lies about currency
            product_type: STRETCH_BED.productType,
            quantity: 1,
          },
        ],
      })
    );
    const stripeArgs = mockSessionsCreate.mock.calls[0][0];
    expect(stripeArgs.line_items[0].price_data.currency).toBe('aud');
  });
});

// --- Happy path: Stripe session construction -------------------------------

describe('POST /api/checkout — happy path', () => {
  it('creates a Stripe checkout session and returns { sessionId, url }', async () => {
    setupSupabase([STRETCH_BED_DB_ROW]);
    const res = await POST(
      makeRequest({
        items: [
          {
            id: STRETCH_BED_DB_ROW.id,
            slug: STRETCH_BED.slug,
            name: STRETCH_BED.name,
            price_cents: 1,
            currency: 'AUD',
            product_type: STRETCH_BED.productType,
            quantity: 2,
          },
        ],
      })
    );
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({
      sessionId: 'cs_test_123',
      url: 'https://checkout.stripe.com/c/pay/cs_test_123',
    });
  });

  it('builds a line item with DB price, quantity, product name, and metadata', async () => {
    setupSupabase([STRETCH_BED_DB_ROW]);
    await POST(
      makeRequest({
        items: [
          {
            id: STRETCH_BED_DB_ROW.id,
            slug: STRETCH_BED.slug,
            name: STRETCH_BED.name,
            price_cents: 1,
            currency: 'AUD',
            product_type: STRETCH_BED.productType,
            quantity: 4,
          },
        ],
      })
    );
    const args = mockSessionsCreate.mock.calls[0][0];
    const line = args.line_items[0];
    expect(line).toMatchObject({
      price_data: {
        currency: 'aud',
        product_data: {
          name: STRETCH_BED.name,
          metadata: {
            product_id: STRETCH_BED_DB_ROW.id,
            product_type: STRETCH_BED.productType,
            is_sponsorship: 'false',
            sponsored_community: '',
            dedication_message: '',
          },
        },
        unit_amount: 75000,
      },
      quantity: 4,
    });
  });

  it('sends mode=payment, AU-only shipping, required billing address, phone collection', async () => {
    setupSupabase([STRETCH_BED_DB_ROW]);
    await POST(
      makeRequest({
        items: [
          {
            id: STRETCH_BED_DB_ROW.id,
            slug: STRETCH_BED.slug,
            name: STRETCH_BED.name,
            price_cents: 1,
            currency: 'AUD',
            product_type: STRETCH_BED.productType,
            quantity: 1,
          },
        ],
      })
    );
    const args = mockSessionsCreate.mock.calls[0][0];
    expect(args.mode).toBe('payment');
    expect(args.payment_method_types).toEqual(['card']);
    expect(args.billing_address_collection).toBe('required');
    expect(args.phone_number_collection).toEqual({ enabled: true });
    expect(args.shipping_address_collection).toEqual({
      allowed_countries: ['AU'],
    });
  });

  it('omits customer_email when not provided', async () => {
    setupSupabase([STRETCH_BED_DB_ROW]);
    await POST(
      makeRequest({
        items: [
          {
            id: STRETCH_BED_DB_ROW.id,
            slug: STRETCH_BED.slug,
            name: STRETCH_BED.name,
            price_cents: 1,
            currency: 'AUD',
            product_type: STRETCH_BED.productType,
            quantity: 1,
          },
        ],
      })
    );
    const args = mockSessionsCreate.mock.calls[0][0];
    expect(args).not.toHaveProperty('customer_email');
  });

  it('passes customer_email through when provided', async () => {
    setupSupabase([STRETCH_BED_DB_ROW]);
    await POST(
      makeRequest({
        customerEmail: 'buyer@example.com',
        items: [
          {
            id: STRETCH_BED_DB_ROW.id,
            slug: STRETCH_BED.slug,
            name: STRETCH_BED.name,
            price_cents: 1,
            currency: 'AUD',
            product_type: STRETCH_BED.productType,
            quantity: 1,
          },
        ],
      })
    );
    const args = mockSessionsCreate.mock.calls[0][0];
    expect(args.customer_email).toBe('buyer@example.com');
  });

  it('builds success_url and cancel_url from the request origin', async () => {
    setupSupabase([STRETCH_BED_DB_ROW]);
    await POST(
      makeRequest(
        {
          items: [
            {
              id: STRETCH_BED_DB_ROW.id,
              slug: STRETCH_BED.slug,
              name: STRETCH_BED.name,
              price_cents: 1,
              currency: 'AUD',
              product_type: STRETCH_BED.productType,
              quantity: 1,
            },
          ],
        },
        'https://shop.goodsoncountry.com'
      )
    );
    const args = mockSessionsCreate.mock.calls[0][0];
    expect(args.success_url).toBe(
      'https://shop.goodsoncountry.com/checkout/success?session_id={CHECKOUT_SESSION_ID}'
    );
    expect(args.cancel_url).toBe(
      'https://shop.goodsoncountry.com/checkout?canceled=true'
    );
  });

  it('embeds the order metadata (items list, ids, quantities) as a string', async () => {
    setupSupabase([STRETCH_BED_DB_ROW]);
    await POST(
      makeRequest({
        items: [
          {
            id: STRETCH_BED_DB_ROW.id,
            slug: STRETCH_BED.slug,
            name: STRETCH_BED.name,
            price_cents: 1,
            currency: 'AUD',
            product_type: STRETCH_BED.productType,
            quantity: 3,
          },
        ],
      })
    );
    const args = mockSessionsCreate.mock.calls[0][0];
    expect(args.metadata).toBeDefined();
    expect(typeof args.metadata.items).toBe('string');
    const parsed = JSON.parse(args.metadata.items);
    expect(parsed).toEqual([
      {
        id: STRETCH_BED_DB_ROW.id,
        slug: STRETCH_BED.slug,
        quantity: 3,
        product_type: STRETCH_BED.productType,
        is_sponsorship: undefined,
        sponsored_community: undefined,
        dedication_message: undefined,
      },
    ]);
  });
});

// --- Sponsorship: name + metadata passthrough -----------------------------

describe('POST /api/checkout — sponsorship', () => {
  it('appends " (Sponsorship for <community>)" to the product name', async () => {
    setupSupabase([STRETCH_BED_DB_ROW]);
    await POST(
      makeRequest({
        items: [
          {
            id: STRETCH_BED_DB_ROW.id,
            slug: STRETCH_BED.slug,
            name: STRETCH_BED.name,
            price_cents: 1,
            currency: 'AUD',
            product_type: STRETCH_BED.productType,
            quantity: 1,
            is_sponsorship: true,
            sponsored_community: 'Utopia',
            dedication_message: 'In memory of Auntie',
          },
        ],
      })
    );
    const line = mockSessionsCreate.mock.calls[0][0].line_items[0];
    expect(line.price_data.product_data.name).toBe(
      `${STRETCH_BED.name} (Sponsorship for Utopia)`
    );
    expect(line.price_data.product_data.metadata).toMatchObject({
      is_sponsorship: 'true',
      sponsored_community: 'Utopia',
      dedication_message: 'In memory of Auntie',
    });
  });

  it('handles the "-sponsor-" id suffix by stripping it for the DB lookup', async () => {
    // Client sends id "db-stretch-bed-1-sponsor-someCommunity" — the route
    // splits on "-sponsor-" and looks up "db-stretch-bed-1" in the DB.
    setupSupabase([STRETCH_BED_DB_ROW]);
    const res = await POST(
      makeRequest({
        items: [
          {
            id: `${STRETCH_BED_DB_ROW.id}-sponsor-Utopia`,
            slug: STRETCH_BED.slug,
            name: STRETCH_BED.name,
            price_cents: 1,
            currency: 'AUD',
            product_type: STRETCH_BED.productType,
            quantity: 1,
            is_sponsorship: true,
            sponsored_community: 'Utopia',
          },
        ],
      })
    );
    expect(res.status).toBe(200);
    // The .in() call should have been called with the stripped id.
    const inFn = mockFrom.mock.results[0].value.select.mock.results[0].value.in;
    expect(inFn).toHaveBeenCalledWith('id', [STRETCH_BED_DB_ROW.id]);
  });
});

// --- Image URL absolutization ----------------------------------------------

describe('POST /api/checkout — image URL absolutization', () => {
  it('prepends the request origin to a relative image path', async () => {
    setupSupabase([STRETCH_BED_DB_ROW]);
    await POST(
      makeRequest({
        items: [
          {
            id: STRETCH_BED_DB_ROW.id,
            slug: STRETCH_BED.slug,
            name: STRETCH_BED.name,
            price_cents: 1,
            currency: 'AUD',
            product_type: STRETCH_BED.productType,
            quantity: 1,
            image: '/images/stretch-bed.png',
          },
        ],
      })
    );
    const line = mockSessionsCreate.mock.calls[0][0].line_items[0];
    expect(line.price_data.product_data.images).toEqual([
      'https://www.goodsoncountry.com/images/stretch-bed.png',
    ]);
  });

  it('passes an already-absolute image URL through unchanged', async () => {
    setupSupabase([STRETCH_BED_DB_ROW]);
    await POST(
      makeRequest({
        items: [
          {
            id: STRETCH_BED_DB_ROW.id,
            slug: STRETCH_BED.slug,
            name: STRETCH_BED.name,
            price_cents: 1,
            currency: 'AUD',
            product_type: STRETCH_BED.productType,
            quantity: 1,
            image: 'https://cdn.example.com/bed.png',
          },
        ],
      })
    );
    const line = mockSessionsCreate.mock.calls[0][0].line_items[0];
    expect(line.price_data.product_data.images).toEqual([
      'https://cdn.example.com/bed.png',
    ]);
  });

  it('omits the images array when the client did not provide an image', async () => {
    setupSupabase([STRETCH_BED_DB_ROW]);
    await POST(
      makeRequest({
        items: [
          {
            id: STRETCH_BED_DB_ROW.id,
            slug: STRETCH_BED.slug,
            name: STRETCH_BED.name,
            price_cents: 1,
            currency: 'AUD',
            product_type: STRETCH_BED.productType,
            quantity: 1,
          },
        ],
      })
    );
    const line = mockSessionsCreate.mock.calls[0][0].line_items[0];
    expect(line.price_data.product_data).not.toHaveProperty('images');
  });

  it('falls back to https://www.goodsoncountry.com when the origin is localhost', async () => {
    setupSupabase([STRETCH_BED_DB_ROW]);
    await POST(
      makeRequest(
        {
          items: [
            {
              id: STRETCH_BED_DB_ROW.id,
              slug: STRETCH_BED.slug,
              name: STRETCH_BED.name,
              price_cents: 1,
              currency: 'AUD',
              product_type: STRETCH_BED.productType,
              quantity: 1,
              image: '/images/bed.png',
            },
          ],
        },
        'http://localhost:3000'
      )
    );
    const line = mockSessionsCreate.mock.calls[0][0].line_items[0];
    expect(line.price_data.product_data.images).toEqual([
      'https://www.goodsoncountry.com/images/bed.png',
    ]);
  });
});

// --- DB query shape -------------------------------------------------------

describe('POST /api/checkout — DB query shape', () => {
  it('queries products with the expected column projection and id .in() filter', async () => {
    const { select, inFn } = setupSupabase([STRETCH_BED_DB_ROW]);
    await POST(
      makeRequest({
        items: [
          {
            id: STRETCH_BED_DB_ROW.id,
            slug: STRETCH_BED.slug,
            name: STRETCH_BED.name,
            price_cents: 1,
            currency: 'AUD',
            product_type: STRETCH_BED.productType,
            quantity: 1,
          },
        ],
      })
    );
    expect(mockFrom).toHaveBeenCalledWith('products');
    expect(select).toHaveBeenCalledWith(
      'id, name, price_cents, currency, product_type, is_active'
    );
    expect(inFn).toHaveBeenCalledWith('id', [STRETCH_BED_DB_ROW.id]);
  });
});

// --- Catch-all error path -------------------------------------------------

describe('POST /api/checkout — error path', () => {
  it('returns 500 "Failed to create checkout session" when Stripe throws', async () => {
    setupSupabase([STRETCH_BED_DB_ROW]);
    mockSessionsCreate.mockRejectedValueOnce(new Error('stripe down'));
    const res = await POST(
      makeRequest({
        items: [
          {
            id: STRETCH_BED_DB_ROW.id,
            slug: STRETCH_BED.slug,
            name: STRETCH_BED.name,
            price_cents: 1,
            currency: 'AUD',
            product_type: STRETCH_BED.productType,
            quantity: 1,
          },
        ],
      })
    );
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe('Failed to create checkout session');
  });

  it('returns 500 when the request body is not valid JSON', async () => {
    const req = new NextRequest(
      'https://www.goodsoncountry.com/api/checkout',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: '{ not valid json',
      }
    );
    const res = await POST(req);
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe('Failed to create checkout session');
  });
});
