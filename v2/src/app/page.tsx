import Link from 'next/link';
import { Suspense } from 'react';
import { Hero, ImpactStats, ThemeSpotlight, ThemeSpotlightSkeleton } from '@/components/marketing';
import { FeaturedStories, FeaturedStoriesSkeleton, CommunityGallery, CommunityGallerySkeleton } from '@/components/empathy-ledger';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { brand, story, enterpriseOpportunity, communityPartnerships, quotes, spotlightThemeGroups, storytellerProfiles } from '@/lib/data/content';

export default async function HomePage() {
  // Build spotlight data from quotes and theme groups
  const spotlightData = spotlightThemeGroups.map((group) => {
    const groupQuotes = quotes.filter((q) =>
      group.themes.includes(q.theme as typeof group.themes[number])
    );
    return {
      id: group.id,
      title: group.title,
      color: group.color,
      quotes: groupQuotes.slice(0, 4).map((q) => {
        const profile = storytellerProfiles.find((p) => p.name === q.author);
        return {
          text: q.text,
          author: q.author,
          context: q.context,
          photo: profile?.photo,
        };
      }),
    };
  });

  return (
    <>
      {/* Hero Section - Stretch Bed as hero product */}
      <Hero
        title={brand.hero.home.headline}
        subtitle={brand.hero.home.subheadline}
        primaryCta={{ text: 'Shop the Stretch Bed', href: '/shop/stretch-bed-single' }}
        secondaryCta={{ text: 'How It\'s Made', href: '/process' }}
        videoSrc={{
          desktop: '/video/hero-desktop.mp4',
          mobile: '/video/hero-mobile.mp4',
          poster: '/video/hero-poster.jpg',
        }}
        imageSrc="https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg"
        imageAlt="The Stretch Bed - recycled plastic, steel and canvas bed by Goods on Country"
      />

      {/* What We Make - Product Categories with Images */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">What We Make</h2>
            <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
              {brand.tagline}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {/* Stretch Bed - Available for Purchase */}
            <Card className="overflow-hidden group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="/images/product/stretch-bed-hero.jpg"
                  alt="The Stretch Bed"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">Available</span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">The Stretch Bed</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Recycled HDPE plastic legs, galvanised steel poles, heavy-duty canvas. 12kg, flat-packs, no tools needed. $600.
                </p>
                <Button asChild className="w-full">
                  <Link href="/shop/stretch-bed-single">Shop Now — $600</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Washing Machine - Register Interest */}
            <Card className="overflow-hidden group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="/images/product/washing-machine-hero.jpg"
                  alt="Pakkimjalki Kari Washing Machine"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-amber-600 text-white text-xs font-medium px-2 py-1 rounded">Prototype</span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">Pakkimjalki Kari</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Commercial-grade Speed Queen in recycled plastic housing. Named in Warumungu language by Elder Dianne Stokes.
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/partner">Register Interest</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Basket Bed - Open Source Plans */}
            <Card className="overflow-hidden group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="/images/product/basket-bed-hero.jpg"
                  alt="The Basket Bed"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-muted-foreground/20 text-foreground text-xs font-medium px-2 py-1 rounded">Open Source</span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-foreground mb-2">Basket Bed</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our first prototype — collapsible baskets with zip ties and toppers. Now open source — download plans and build your own.
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/basket-bed-plans">Download Plans</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <ImpactStats fetchLive={true} />

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
          maxStories={6}
        />
      </Suspense>

      {/* Theme Spotlight - auto-rotating thematic tabs */}
      <Suspense fallback={<ThemeSpotlightSkeleton />}>
        <ThemeSpotlight themeGroups={spotlightData} autoRotateInterval={8000} />
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
              100% community-made, delivering essential goods across remote Australia
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {communityPartnerships.filter(p => p.bedsDelivered > 0).map((p) => (
              <Card key={p.id} className="text-center">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-primary">{p.bedsDelivered}</div>
                  <div className="mt-1 text-sm font-medium text-foreground">{p.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{p.region}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link href="/community">Learn About Our Communities</Link>
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
