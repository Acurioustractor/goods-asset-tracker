import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { media } from '@/lib/data/media';
import { PLASTIC_KG_PER_BED, STRETCH_BED, WASHING_MACHINE, BASKET_BED } from '@/lib/data/products';
import { SHOP_ANSWERS } from '@/lib/data/shop';
import { canonValue } from '@/lib/data/canon';
import { ItemListJsonLd } from '@/components/seo';

// Spec-first rebuild (DECISIONS.md ruling S sweep, 2026-07-26): the page leads with
// the straight answers — spec, price, lead time, freight, lifespan, who fixes it —
// before any brand prose. Answers live in lib/data/shop.ts.

export const metadata = {
  title: 'Shop Stretch Beds',
  description:
    'The Stretch Bed spec, price, freight and support up front. Plus washing machine prototypes and open-source Basket Bed plans.',
  alternates: {
    canonical: 'https://www.goodsoncountry.com/shop',
  },
  openGraph: {
    title: 'Shop Stretch Beds · Goods on Country',
    description:
      'Browse practical goods made for remote First Nations communities, led by the washable, flat-pack Stretch Bed.',
    url: 'https://www.goodsoncountry.com/shop',
    images: [
      {
        url: 'https://www.goodsoncountry.com/images/product/stretch-bed-hero.jpg',
        width: 1200,
        height: 900,
        alt: 'The Stretch Bed by Goods on Country',
      },
    ],
  },
};

const products = [
  {
    slug: STRETCH_BED.slug,
    name: STRETCH_BED.name,
    description: `Recycled HDPE plastic legs, galvanised steel poles, heavy-duty canvas. ${STRETCH_BED.specs.weight}, flat-packs, no tools needed.`,
    price: canonValue('stretch-price') as number,
    image: media.product.stretchBedHero,
    badge: 'Available',
    badgeColor: 'bg-primary text-primary-foreground',
    cta: 'Shop Now',
    href: '/shop/stretch-bed-single',
  },
  {
    slug: WASHING_MACHINE.slug,
    name: WASHING_MACHINE.name,
    description: WASHING_MACHINE.tagline,
    price: null,
    image: media.product.washingMachine,
    badge: 'Prototype',
    badgeColor: 'bg-amber-600 text-white',
    cta: 'Register Interest',
    href: '/shop/washing-machine',
  },
  {
    slug: BASKET_BED.slug,
    name: `${BASKET_BED.name} Plans`,
    description: 'Our first prototype: collapsible baskets with zip ties and toppers. Now open source. Download and build your own.',
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
      <ItemListJsonLd
        name="Goods on Country products"
        items={products.map((product) => ({
          name: product.name,
          path: product.href,
          description: product.description,
          image: product.image,
        }))}
      />

      {/* Header + the straight answers, before anything else */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-widest mb-4" style={{ color: '#8B9D77' }}>
              The Stretch Bed
            </p>
            <h1 className="text-4xl md:text-5xl font-light mb-6" style={{ color: '#2E2E2E', fontFamily: 'var(--font-display, Georgia, serif)' }}>
              The straight answers, before the buy button.
            </h1>
            <p className="text-lg mb-4" style={{ color: '#5E5E5E' }}>
              Every purchase supports remote First Nations communities across Australia.
              Each bed diverts {PLASTIC_KG_PER_BED}kg of plastic from landfill.
            </p>
          </div>

          <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2 max-w-5xl">
            {SHOP_ANSWERS.map((item) => (
              <div key={item.question} className="border-t pt-5" style={{ borderColor: '#E5DDD2' }}>
                <h2 className="text-sm uppercase tracking-widest mb-2" style={{ color: '#C45C3E' }}>
                  {item.question}
                </h2>
                <p className="leading-relaxed" style={{ color: '#2E2E2E' }}>{item.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" style={{ backgroundColor: '#C45C3E' }} asChild>
              <Link href="/shop/stretch-bed-single">Buy the Stretch Bed · ${String(canonValue('stretch-price'))}</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Ask about freight or bulk orders</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-light mb-10" style={{ color: '#2E2E2E', fontFamily: 'var(--font-display, Georgia, serif)' }}>
            Everything we make
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl">
            {products.map((product) => (
              <Card key={product.slug} className="overflow-hidden group">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {product.image && (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
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
                      {product.cta}{product.price ? ` · $${product.price}` : ''}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsor CTA */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#2E2E2E' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
            Not buying for yourself?
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Sponsor a bed for a family who has asked for one: one bed, one community, one receipt.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" style={{ backgroundColor: '#C45C3E' }} asChild>
              <Link href="/sponsor">Sponsor a Bed</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
              <Link href="/storytellers">Hear from communities</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
