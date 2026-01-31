import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { empathyLedger } from '@/lib/empathy-ledger';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AddToCartButton } from '@/components/cart';
import { Separator } from '@/components/ui/separator';
import { StoryCard } from '@/components/empathy-ledger';
import {
  ProductImageCarousel,
  ProductVideo,
  ProductTabs,
  EnterpriseOpportunity,
} from '@/components/shop';
import type { Product, ProductMetadata } from '@/lib/types/database';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${product.name} | Goods on Country`,
    description: product.short_description || product.description?.slice(0, 160),
  };
}

async function getProduct(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Product;
}

async function getRelatedProducts(productType: string, excludeSlug: string): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('product_type', productType)
    .neq('slug', excludeSlug)
    .limit(3);

  return (data || []) as Product[];
}

function formatPrice(cents: number, currency: string = 'AUD'): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function ProductImagePlaceholder() {
  return (
    <div className="flex h-full items-center justify-center bg-muted">
      <svg
        className="h-24 w-24 text-muted-foreground/40"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        />
      </svg>
    </div>
  );
}

async function CommunityTestimonials({ productType }: { productType: string }) {
  const { testimonials } = await empathyLedger.getProductContent(productType);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-foreground mb-6">Community Voices</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((story) => (
          <StoryCard key={story.id} story={story} variant="compact" />
        ))}
      </div>
    </section>
  );
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.product_type, slug);
  const hasDiscount =
    product.compare_at_price_cents &&
    product.compare_at_price_cents > product.price_cents;

  // Parse extended metadata
  const metadata = product.metadata as ProductMetadata | null;

  // Prepare images array for carousel
  const allImages = product.featured_image
    ? [product.featured_image, ...(product.images || [])]
    : product.images || [];

  // Check if we have tab content
  const hasTabContent =
    (metadata?.components && metadata.components.length > 0) ||
    (metadata?.assembly_steps && metadata.assembly_steps.length > 0) ||
    metadata?.sustainability;

  return (
    <main className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground">Home</Link></li>
            <li>/</li>
            <li><Link href="/shop" className="hover:text-foreground">Shop</Link></li>
            <li>/</li>
            <li className="text-foreground">{product.name}</li>
          </ol>
        </nav>

        {/* Product Detail - Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* LEFT: Image Gallery + Video */}
          <div className="space-y-6">
            {/* Image Carousel */}
            {allImages.length > 0 ? (
              <ProductImageCarousel images={allImages} productName={product.name} />
            ) : (
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <ProductImagePlaceholder />
                {product.is_featured && (
                  <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                    Featured
                  </Badge>
                )}
              </div>
            )}

            {/* Product Video */}
            {metadata?.video_url && (
              <ProductVideo
                videoUrl={metadata.video_url}
                thumbnailUrl={metadata.video_thumbnail}
                title={`${product.name} video`}
              />
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col">
            {/* Type Badge */}
            <Badge variant="secondary" className="w-fit mb-3">
              {product.product_type.replace('_', ' ')}
            </Badge>

            {/* Title */}
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                {formatPrice(product.price_cents, product.currency)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.compare_at_price_cents!, product.currency)}
                </span>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <p className="mt-4 text-lg text-muted-foreground">
                {product.short_description}
              </p>
            )}

            <Separator className="my-6" />

            {/* Actions */}
            <div className="space-y-3">
              <AddToCartButton
                product={{
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  price_cents: product.price_cents,
                  currency: product.currency,
                  featured_image: product.featured_image,
                  product_type: product.product_type,
                }}
                size="lg"
                className="w-full"
              />

              <Button size="lg" variant="outline" className="w-full" asChild>
                <Link href={`/sponsor?product=${product.slug}`}>
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Sponsor for a Community
                </Link>
              </Button>
            </div>

            {/* Impact Note */}
            <Card className="mt-6 bg-accent/10 border-accent/20">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <svg className="h-6 w-6 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div>
                    <p className="font-medium text-foreground">Your Impact</p>
                    <p className="text-sm text-muted-foreground">
                      This purchase supports artisan jobs and delivers comfort to families in remote communities.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Specs Grid */}
            {metadata && (
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                {metadata.materials && (
                  <div>
                    <dt className="font-medium text-foreground">Materials</dt>
                    <dd className="text-muted-foreground">{metadata.materials}</dd>
                  </div>
                )}
                {metadata.dimensions && (
                  <div>
                    <dt className="font-medium text-foreground">Dimensions</dt>
                    <dd className="text-muted-foreground">{metadata.dimensions}</dd>
                  </div>
                )}
                {metadata.assembly_time && (
                  <div>
                    <dt className="font-medium text-foreground">Assembly</dt>
                    <dd className="text-muted-foreground">{metadata.assembly_time}</dd>
                  </div>
                )}
                {metadata.warranty && (
                  <div>
                    <dt className="font-medium text-foreground">Warranty</dt>
                    <dd className="text-muted-foreground">{metadata.warranty}</dd>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Story Section - Full Width */}
        {product.description && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">About This Product</h2>
            <div className="prose prose-stone max-w-none">
              <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
            </div>
          </section>
        )}

        {/* Tabs Section - Components, Assembly, Sustainability */}
        {hasTabContent && (
          <section className="mt-12">
            <ProductTabs
              components={metadata?.components}
              assemblySteps={metadata?.assembly_steps}
              assemblyTime={metadata?.assembly_time}
              sustainability={metadata?.sustainability}
            />
          </section>
        )}

        {/* Enterprise Opportunity Section */}
        {metadata?.enterprise_opportunity && (
          <section className="mt-12">
            <EnterpriseOpportunity data={metadata.enterprise_opportunity} />
          </section>
        )}

        {/* Community Testimonials */}
        <Suspense fallback={null}>
          <CommunityTestimonials productType={product.product_type} />
        </Suspense>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">Related Products</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="overflow-hidden">
                  <Link href={`/shop/${relatedProduct.slug}`}>
                    <div className="relative aspect-[4/3] bg-muted">
                      {relatedProduct.featured_image ? (
                        <Image
                          src={relatedProduct.featured_image}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <ProductImagePlaceholder />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground">{relatedProduct.name}</h3>
                      <p className="mt-1 text-lg font-bold text-foreground">
                        {formatPrice(relatedProduct.price_cents, relatedProduct.currency)}
                      </p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
