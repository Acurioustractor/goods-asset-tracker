import { Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ProductCard, ProductCardSkeleton } from '@/components/marketing/product-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/lib/types/database';

export const metadata = {
  title: 'Shop | Goods on Country',
  description: 'Browse handcrafted beds and washing machines made for remote Indigenous communities.',
};

async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data as Product[];
}

async function ProductGrid() {
  const products = await getProducts();

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
          style={{ backgroundColor: '#E8DED4' }}
        >
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#8B9D77' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-xl font-light mb-2" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
          Products Coming Soon
        </h3>
        <p style={{ color: '#5E5E5E' }}>Check back soon for our full product range.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function ShopPage() {
  return (
    <main style={{ backgroundColor: '#FDF8F3' }}>
      {/* Header */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              Our Products
            </p>
            <h1 className="text-4xl md:text-5xl font-light mb-6" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              Shop Beds
            </h1>
            <p className="text-lg" style={{ color: '#5E5E5E' }}>
              Every purchase supports remote Indigenous communities across Australia.
              Each bed diverts 25kg of plastic from landfill.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-16 md:pb-20">
        <div className="container mx-auto px-4">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid />
          </Suspense>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              Why Our Products
            </p>
            <h2 className="text-3xl font-light" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
              Built for Remote Australia
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              {
                title: 'Handcrafted Quality',
                description: 'Each bed is crafted by skilled artisans using traditional techniques and modern materials.',
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                  </svg>
                ),
              },
              {
                title: 'Built for Conditions',
                description: 'Designed to withstand extreme heat, humidity, and the demands of remote living.',
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
              },
              {
                title: 'Community Ownership',
                description: 'Our goal is to transfer manufacturing to community-owned enterprises. We become unnecessary.',
                icon: (
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: '#C45C3E' }}
                >
                  {item.icon}
                </div>
                <h3 className="font-medium mb-2" style={{ color: '#2E2E2E' }}>{item.title}</h3>
                <p className="text-sm" style={{ color: '#5E5E5E' }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Features */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#FDF8F3' }}>
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center max-w-6xl mx-auto">
            {/* Image placeholder */}
            <div
              className="aspect-square rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: '#E8DED4' }}
            >
              <div className="text-center p-8">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#8B9D77' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm" style={{ color: '#8B9D77' }}>Product photography</p>
              </div>
            </div>

            <div>
              <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
                The Greate Bed
              </p>
              <h2 className="text-3xl font-light mb-6" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
                Co-designed with Community
              </h2>
              <p className="mb-6" style={{ color: '#5E5E5E' }}>
                500+ minutes of community feedback shapes every product we make.
                The Greate Bed is designed to meet the specific needs of remote living.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'Made from 25kg recycled plastic',
                  '5-minute assembly, no tools required',
                  'Washable mattress components',
                  'Built to last 10+ years',
                  'Stackable for easy transport',
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#8B9D77' }}
                    >
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span style={{ color: '#2E2E2E' }}>{feature}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" style={{ backgroundColor: '#C45C3E' }} asChild>
                <Link href="/sponsor">Or Sponsor a Bed Instead</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor CTA */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#2E2E2E' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            Want to make an even bigger impact?
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Sponsor a bed for a family in need. 100% of your sponsorship goes directly
            to delivering comfort to remote communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" style={{ backgroundColor: '#C45C3E' }} asChild>
              <Link href="/sponsor">Sponsor a Bed</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link href="/stories">Read Community Stories</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
