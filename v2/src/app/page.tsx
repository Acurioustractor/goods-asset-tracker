import Link from 'next/link';
import { Suspense } from 'react';
import { Hero, ImpactStats, ProductCard } from '@/components/marketing';
import { FeaturedStories, FeaturedStoriesSkeleton, CommunityGallery, CommunityGallerySkeleton } from '@/components/empathy-ledger';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import type { Product } from '@/lib/types/database';
import { brand, story, productCategories, enterpriseOpportunity } from '@/lib/data/content';
import { getFeaturedSupporters } from '@/lib/data/supporters';

const communities = [
  { name: 'Palm Island', items: 141 },
  { name: 'Tennant Creek', items: 139 },
  { name: 'Alice Homelands', items: 60 },
  { name: 'Maningrida', items: 24 },
  { name: 'Kalgoorlie', items: 20 },
];

async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data as Product[];
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      {/* Hero Section - Stretch Bed as hero product */}
      <Hero
        title={brand.hero.home.headline}
        subtitle={brand.hero.home.subheadline}
        primaryCta={{ text: 'Shop the Stretch Bed', href: '/shop/weave-bed-single' }}
        secondaryCta={{ text: 'How It\'s Made', href: '/process' }}
        videoSrc={{
          desktop: '/video/hero-desktop.mp4',
          mobile: '/video/hero-mobile.mp4',
          poster: '/video/hero-poster.jpg',
        }}
        imageSrc="https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg"
        imageAlt="The Stretch Bed - tension-weave design by Goods on Country"
      />

      {/* What We Make - Product Categories */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">What We Make</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              {brand.tagline}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {productCategories.map((category) => (
              <Card key={category.id} className={`text-center ${category.status === 'coming-soon' ? 'opacity-70' : ''}`}>
                <CardContent className="p-8">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {category.icon === 'bed' && (
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                      </svg>
                    )}
                    {category.icon === 'washer' && (
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                      </svg>
                    )}
                    {category.icon === 'fridge' && (
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5V18M15 7.5V18M3 16.811V8.69c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 010 1.954l-7.108 4.061A1.125 1.125 0 013 16.811z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                  {category.status === 'available' ? (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/shop?category=${category.id}`}>View Products</Link>
                    </Button>
                  ) : (
                    <span className="text-xs uppercase tracking-wide text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <ImpactStats fetchLive={true} />

      {/* Featured Products */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Our Products</h2>
              <p className="mt-2 text-muted-foreground">
                Every purchase supports remote Indigenous communities
              </p>
            </div>
            <Button variant="outline" asChild className="hidden sm:inline-flex">
              <Link href="/shop">View All Products</Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground py-8">
                Products coming soon...
              </p>
            )}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button asChild>
              <Link href="/shop">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Our Approach - from content data */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">{story.solution.headline}</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              Community-led design meets circular economy manufacturing
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            {story.solution.points.map((point, index) => (
              <div key={point.title} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {index === 0 && (
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  )}
                  {index === 1 && (
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                    </svg>
                  )}
                  {index === 2 && (
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                    </svg>
                  )}
                  {index === 3 && (
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                    </svg>
                  )}
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{point.title}</h3>
                <p className="text-sm text-muted-foreground">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Stories - from Empathy Ledger */}
      <Suspense fallback={<FeaturedStoriesSkeleton />}>
        <FeaturedStories
          title="Community Voices"
          subtitle="15 storytellers across 6 communities have shaped and validated the Goods approach"
          maxStories={3}
        />
      </Suspense>

      {/* Community Gallery - from Empathy Ledger */}
      <Suspense fallback={<CommunityGallerySkeleton />}>
        <CommunityGallery
          title="Our Impact in Pictures"
          subtitle="Elder-approved images from our communities"
          maxImages={6}
        />
      </Suspense>

      {/* Communities We Serve */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Communities We Serve</h2>
            <p className="mt-2 text-muted-foreground">
              Delivering essential goods across remote Australia
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {communities.map((community) => (
              <Card key={community.name} className="text-center">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-primary">{community.items}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{community.name}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/communities">Learn About Our Communities</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Enterprise Opportunity */}
      <section className="py-16 md:py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">{enterpriseOpportunity.headline}</h2>
            <p className="text-lg text-muted-foreground mb-8">{enterpriseOpportunity.description}</p>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 mb-8">
              {enterpriseOpportunity.benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-sm text-foreground">
                  <svg className="h-5 w-5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
            <Button size="lg" asChild>
              <Link href={`mailto:${enterpriseOpportunity.email}`}>{enterpriseOpportunity.cta}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-accent-foreground md:text-4xl">
            {brand.oneLiner}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-accent-foreground/80">
            Every purchase supports community-led design and manufacturing in remote Australia.
            {' '}{brand.philosophy}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/shop">Shop Products</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-accent-foreground text-accent-foreground hover:bg-accent-foreground/10" asChild>
              <Link href="/about">Our Story</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
