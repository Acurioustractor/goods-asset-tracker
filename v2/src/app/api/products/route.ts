import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PURCHASABLE_PRODUCT_TYPES } from '@/lib/data/products';

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('products')
      .select('id, slug, name, price_cents, currency, featured_image, product_type, short_description')
      .eq('is_active', true)
      .in('product_type', [...PURCHASABLE_PRODUCT_TYPES])
      .order('name');

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
