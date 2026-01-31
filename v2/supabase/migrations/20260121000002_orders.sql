-- Migration: Create orders and order_items tables for e-commerce
-- Description: Order management for purchases and sponsorships

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,

  -- Customer info
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  customer_id UUID, -- Optional link to auth.users

  -- Addresses
  shipping_address JSONB, -- {line1, line2, city, state, postcode, country}
  billing_address JSONB,

  -- Pricing
  subtotal_cents INTEGER NOT NULL,
  shipping_cents INTEGER DEFAULT 0,
  tax_cents INTEGER DEFAULT 0,
  discount_cents INTEGER DEFAULT 0,
  total_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'AUD',

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',      -- Order created, awaiting payment
    'paid',         -- Payment received
    'processing',   -- Being prepared
    'shipped',      -- In transit
    'delivered',    -- Received by customer
    'cancelled',    -- Order cancelled
    'refunded'      -- Order refunded
  )),

  -- Payment
  stripe_payment_intent_id TEXT,
  stripe_checkout_session_id TEXT,
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded', 'partial_refund')),
  paid_at TIMESTAMPTZ,

  -- Sponsorship (Buy for Community)
  is_sponsorship BOOLEAN DEFAULT false,
  sponsored_community TEXT, -- Which community receives it
  sponsor_message TEXT, -- Optional message from sponsor

  -- Shipping
  shipping_method TEXT,
  tracking_number TEXT,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,

  -- Notes
  customer_notes TEXT, -- Notes from customer at checkout
  internal_notes TEXT, -- Admin notes

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order line items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,

  -- Product snapshot (in case product is deleted/changed)
  product_name TEXT NOT NULL,
  product_type TEXT,
  product_image TEXT,

  -- Pricing
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,

  -- For sponsorships, link to the asset created
  asset_id TEXT, -- References assets(unique_id) when bed is delivered

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_sponsorship ON orders(is_sponsorship) WHERE is_sponsorship = true;
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Customers can view their own orders
CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  USING (customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Customers can view own order items"
  ON order_items FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE customer_email = auth.jwt() ->> 'email'
    )
  );

-- Admin full access
CREATE POLICY "Admin full access to orders"
  ON orders FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access to order items"
  ON order_items FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Service role can insert orders (for Stripe webhooks)
CREATE POLICY "Service can create orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service can create order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- Updated at trigger
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Generate order number function
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL THEN
    NEW.order_number := 'GOC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
                        LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();

COMMENT ON TABLE orders IS 'Customer orders for products and sponsorships';
COMMENT ON TABLE order_items IS 'Line items for each order';
