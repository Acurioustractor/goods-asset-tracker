-- Migration: Create products table for e-commerce
-- Description: Product catalog for beds, washing machines, and accessories

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  price_cents INTEGER NOT NULL,
  compare_at_price_cents INTEGER, -- For showing "was $X, now $Y"
  currency TEXT DEFAULT 'AUD',
  product_type TEXT NOT NULL CHECK (product_type IN ('basket_bed', 'stretch_bed', 'washing_machine', 'accessory')),
  images TEXT[] DEFAULT '{}', -- Array of image URLs
  featured_image TEXT, -- Primary image URL
  inventory_count INTEGER DEFAULT 0,
  track_inventory BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}', -- Flexible metadata (dimensions, weight, etc.)
  artisan_id UUID, -- Link to team_members table for maker info
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for common queries
CREATE INDEX idx_products_type ON products(product_type);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_slug ON products(slug);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read access for active products
CREATE POLICY "Public read access for active products"
  ON products FOR SELECT
  USING (is_active = true);

-- Admin full access (will need to create admin role)
CREATE POLICY "Admin full access to products"
  ON products FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE products IS 'Product catalog for Goods e-commerce - beds, washing machines, accessories';
