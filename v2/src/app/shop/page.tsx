import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { media } from '@/lib/data/media';

export const metadata = {
  title: 'Shop | Goods on Country',
  description: 'Browse handcrafted beds and washing machines made for remote Indigenous communities.',
};

// Static product cards - bypassing Supabase which has wrong data
const products = [
  {
    slug: 'stretch-bed-single',
    name: 'The Stretch Bed',
    description: 'Recycled HDPE plastic legs, galvanised steel poles, heavy-duty canvas. 20kg, flat-packs, no tools needed.',
    price: 600,
    image: media.product.stretchBedHero,
    badge: 'Available',
    badgeColor: 'bg-primary text-primary-foreground',
    cta: 'Shop Now',
    href: '/shop/stretch-bed-single',
  },
  {
    slug: 'pakkimjalki-kari',
    name: 'Pakkimjalki Kari',
    description: 'Commercial-grade Speed Queen in recycled plastic housing. Named in Warumungu language by Elder Dianne Stokes.',
    price: null,
    image: media.product.washingMachine,
    badge: 'Prototype',
    badgeColor: 'bg-amber-600 text-white',
    cta: 'Register Interest',
    href: '/partner',
  },
  {
    slug: 'basket-bed-plans',
    name: 'Basket Bed Plans',
    description: 'Our first prototype — collapsible baskets with zip ties and toppers. Now open source — download and build your own.',
    price: null,
    image: media.product.basketBedHero,
    badge: 'Open Source',
    badgeColor: 'bg-muted-foreground/20 text-foreground',
    cta: 'Download Plans',
    href: '/basket-bed-plans',
  },
];

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
              Each bed diverts 14kg of plastic from landfill.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-16 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {products.map((product) => (
              <Card key={product.slug} className="overflow-hidden group">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <svg className="h-16 w-16 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={`${product.badgeColor} text-xs font-medium px-2 py-1 rounded`}>
                      {product.badge}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                  {product.price && (
                    <p className="text-lg font-bold text-primary mb-4">${product.price}</p>
                  )}
                  <Button asChild className="w-full" variant={product.price ? 'default' : 'outline'}>
                    <Link href={product.href}>
                      {product.cta}{product.price ? ` — $${product.price}` : ''}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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
            {/* Stretch Bed Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <Image
                src={media.product.stretchBedInUse || '/images/product/stretch-bed-hero.jpg'}
                alt="The Stretch Bed in use"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
                The Stretch Bed
              </p>
              <h2 className="text-3xl font-light mb-6" style={{ color: '#2E2E2E', fontFamily: 'Georgia, serif' }}>
                Co-designed with Community
              </h2>
              <p className="mb-6" style={{ color: '#5E5E5E' }}>
                500+ minutes of community feedback shapes every product we make.
                The Stretch Bed is designed to meet the specific needs of remote living.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  'Made from 14kg recycled plastic',
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
