import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatAmountFromStripe } from '@/lib/stripe';

export default async function AdminProductsPage() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
  }

  // Server action to toggle product active status
  async function toggleProductStatus(formData: FormData) {
    'use server';

    const productId = formData.get('product_id') as string;
    const isActive = formData.get('is_active') === 'true';

    const supabase = await createClient();

    const { error } = await supabase
      .from('products')
      .update({ is_active: !isActive })
      .eq('id', productId);

    if (error) {
      console.error('Failed to update product:', error);
    }

    revalidatePath('/admin/products');
  }

  // Server action to update inventory
  async function updateInventory(formData: FormData) {
    'use server';

    const productId = formData.get('product_id') as string;
    const inventoryCount = parseInt(formData.get('inventory_count') as string, 10);

    if (isNaN(inventoryCount)) return;

    const supabase = await createClient();

    const { error } = await supabase
      .from('products')
      .update({ inventory_count: inventoryCount })
      .eq('id', productId);

    if (error) {
      console.error('Failed to update inventory:', error);
    }

    revalidatePath('/admin/products');
  }

  const productTypeLabels: Record<string, string> = {
    basket_bed: 'Basket Bed',
    stretch_bed: 'Stretch Bed',
    washing_machine: 'Washing Machine',
    accessory: 'Accessory',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-gray-500 mt-1">
            {products?.length || 0} product{(products?.length || 0) !== 1 ? 's' : ''} in catalog
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <Card key={product.id} className={!product.is_active ? 'opacity-60' : ''}>
            <CardHeader className="pb-2">
              {product.featured_image && (
                <img
                  src={product.featured_image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              )}
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <Badge
                  className={
                    product.is_active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }
                >
                  {product.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <Badge variant="outline" className="w-fit">
                {productTypeLabels[product.product_type] || product.product_type}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500 line-clamp-2">
                {product.short_description || product.description}
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    ${formatAmountFromStripe(product.price_cents)}
                  </div>
                  {product.compare_at_price_cents && (
                    <div className="text-sm text-gray-400 line-through">
                      ${formatAmountFromStripe(product.compare_at_price_cents)}
                    </div>
                  )}
                </div>
                {product.track_inventory && (
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Stock</div>
                    <div
                      className={`font-medium ${
                        product.inventory_count <= 0
                          ? 'text-red-600'
                          : product.inventory_count < 5
                            ? 'text-yellow-600'
                            : 'text-green-600'
                      }`}
                    >
                      {product.inventory_count}
                    </div>
                  </div>
                )}
              </div>

              {/* Inventory Update Form */}
              {product.track_inventory && (
                <form action={updateInventory} className="flex gap-2">
                  <input type="hidden" name="product_id" value={product.id} />
                  <input
                    type="number"
                    name="inventory_count"
                    defaultValue={product.inventory_count}
                    min="0"
                    className="flex-1 border rounded px-2 py-1 text-sm"
                  />
                  <Button type="submit" variant="outline" size="sm">
                    Update
                  </Button>
                </form>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <form action={toggleProductStatus} className="flex-1">
                  <input type="hidden" name="product_id" value={product.id} />
                  <input
                    type="hidden"
                    name="is_active"
                    value={String(product.is_active)}
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    {product.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                </form>
                <Link href={`/shop/${product.slug}`} target="_blank">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!products || products.length === 0) && (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No products found</p>
            <p className="text-sm text-gray-400 mt-2">
              Run the seed.sql to populate initial products
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
