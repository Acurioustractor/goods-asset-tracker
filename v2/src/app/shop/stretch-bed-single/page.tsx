import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MediaSlot } from '@/components/ui/media-slot';
import { BuyNowForm } from '@/components/shop/buy-now-form';
import { AssemblySequence } from '@/components/pitch/assembly-sequence';
import { CyclingImage } from '@/components/pitch/cycling-image';
import { media } from '@/lib/data/media';
import { quotes } from '@/lib/data/content';
import { STRETCH_BED } from '@/lib/data/products';

export const metadata = {
  title: 'The Stretch Bed | Goods on Country',
  description: 'Flat-packable, washable bed made from recycled HDPE plastic, galvanised steel poles, and heavy-duty canvas. 26kg, 200kg capacity, assembles in 5 minutes.',
};

const product = {
  name: STRETCH_BED.name,
  slug: 'stretch-bed-single',
  price: 600,
  currency: 'AUD',
  shortDescription: STRETCH_BED.shortDescription,
  description: `The Stretch Bed is the flagship product from Goods on Country — a bed designed in partnership with remote Indigenous communities across Australia.

Two galvanised steel poles thread through canvas sleeves. Recycled plastic legs click onto the poles. Done. No tools, no complicated assembly, just a bed that works.

Every bed diverts ${STRETCH_BED.specs.plasticDiverted.replace(' per bed', '')} from landfill. The manufacturing process is designed to be transferred to community ownership — we're building the infrastructure for communities to make their own beds, not a dependency on outside suppliers.

The canvas sleeping surface is fully washable. The recycled plastic legs are virtually indestructible. The steel poles are rated for ${STRETCH_BED.specs.loadCapacity}. This bed is built for the conditions of remote Australia.`,
  specs: {
    weight: STRETCH_BED.specs.weight,
    capacity: STRETCH_BED.specs.loadCapacity,
    dimensions: STRETCH_BED.specs.dimensions,
    assembly: '5 minutes, no tools',
    materials: `Recycled HDPE plastic, galvanised steel (${STRETCH_BED.materials.frame.detail.split(',')[0]}), heavy-duty Australian canvas`,
    plastic: STRETCH_BED.specs.plasticDiverted,
  },
  features: [...STRETCH_BED.features],
  images: [
    { src: media.product.stretchBedHero, alt: 'The Stretch Bed at golden hour showing recycled plastic X-legs' },
    { src: media.product.stretchBedInUse, alt: 'Person resting on Stretch Bed in the outback' },
    { src: media.product.stretchBedAssembly, alt: 'Two people assembling a Stretch Bed together' },
    { src: media.product.stretchBedCommunity, alt: 'Elder woman presenting her new Stretch Bed' },
  ],
};

function formatPrice(amount: number, currency: string = 'AUD'): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function StretchBedPage() {
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
          {/* LEFT: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image
                src={product.images[0].src || '/images/product/stretch-bed-hero.jpg'}
                alt={product.images[0].alt}
                fill
                className="object-cover"
                priority
              />
              <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                Available Now
              </Badge>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-3 gap-3">
              {product.images.slice(1).map((image, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={image.src || '/images/product/stretch-bed-hero.jpg'}
                    alt={image.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="flex flex-col">
            {/* Type Badge */}
            <Badge variant="secondary" className="w-fit mb-3">
              Stretch Bed
            </Badge>

            {/* Title */}
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                {formatPrice(product.price, product.currency)}
              </span>
            </div>

            {/* Short Description */}
            <p className="mt-4 text-lg text-muted-foreground">
              {product.shortDescription}
            </p>

            <Separator className="my-6" />

            {/* Actions */}
            <div className="space-y-3">
              <BuyNowForm
                productName={product.name}
                pricePerUnit={product.price}
                currency={product.currency}
                size="lg"
                className="w-full"
              />

              <Button size="lg" variant="outline" className="w-full" asChild>
                <Link href="/sponsor">
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Sponsor Beds for Communities
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
                      Each bed diverts 20kg of plastic from landfill and supports community-led manufacturing in remote Australia.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Specs Grid */}
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="font-medium text-foreground">Weight</dt>
                <dd className="text-muted-foreground">{product.specs.weight}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Capacity</dt>
                <dd className="text-muted-foreground">{product.specs.capacity}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Dimensions</dt>
                <dd className="text-muted-foreground">{product.specs.dimensions}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Assembly</dt>
                <dd className="text-muted-foreground">{product.specs.assembly}</dd>
              </div>
            </div>
          </div>
        </div>

        {/* Story Section - Full Width */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">About the Stretch Bed</h2>
          <div className="prose prose-stone max-w-none">
            <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Features</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.features.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <svg className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Materials Section */}
        <section className="mt-12 bg-muted/30 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Materials & Sustainability</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                  </svg>
                </div>
                <h3 className="font-semibold text-foreground mb-1">Recycled Plastic Legs</h3>
                <p className="text-sm text-muted-foreground">20kg of HDPE diverted from landfill per bed. Virtually indestructible in any conditions.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-foreground mb-1">Galvanised Steel Poles</h3>
                <p className="text-sm text-muted-foreground">26.9mm outer diameter, rated for 200kg capacity. Built to last 10+ years.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-3">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                </div>
                <h3 className="font-semibold text-foreground mb-1">Australian Canvas</h3>
                <p className="text-sm text-muted-foreground">Heavy-duty, fully washable sleeping surface. Designed for the conditions of remote Australia.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-12 bg-accent py-12 px-6 md:px-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-accent-foreground mb-4">
            Want to make a bigger impact?
          </h2>
          <p className="text-accent-foreground/80 max-w-xl mx-auto mb-6">
            Partner with us to sponsor beds for remote communities or license the manufacturing model for your region.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/partner">Partner With Us</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-accent-foreground text-accent-foreground hover:bg-accent-foreground/10" asChild>
              <Link href="/story">Our Story</Link>
            </Button>
          </div>
        </section>
      </div>

      {/* How It's Made — 5-step manufacturing strip, dark bg */}
      <section className="py-16 md:py-20 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-background/40 mb-4">
              On-Country Manufacturing
            </p>
            <h2
              className="text-3xl md:text-4xl font-light mb-4 leading-snug"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              From rubbish to bed
            </h2>
            <p className="text-background/60 mb-12 max-w-2xl">
              A containerised production plant that turns community plastic waste into bed components. Local people do the making.
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
              <div className="rounded-xl bg-background/5 border border-background/10 overflow-hidden">
                <MediaSlot src="/images/process/color-samples.jpg" alt="Sorted recycled plastic from community waste" label="Collect" aspect="4/3" />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <h3 className="text-lg font-semibold text-background">Collect</h3>
                  </div>
                  <p className="text-sm text-background/60 leading-relaxed">Local people gather plastic waste from around community. Sorted by colour, cleaned, ready for shredding.</p>
                </div>
              </div>

              <div className="rounded-xl bg-background/5 border border-background/10 overflow-hidden">
                <MediaSlot src="/images/process/container-factory.jpg" alt="Plastic shredder inside containerised production plant" label="Shred" aspect="4/3" />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <h3 className="text-lg font-semibold text-background">Shred</h3>
                  </div>
                  <p className="text-sm text-background/60 leading-relaxed">Plastic goes into the shredder — a containerised unit that stays on site between production runs.</p>
                </div>
              </div>

              <div className="rounded-xl bg-background/5 border border-background/10 overflow-hidden">
                <CyclingImage
                  images={[
                    { src: '/images/process/hydraulic-press.jpg', alt: 'Hydraulic press compressing recycled plastic into sheets' },
                    { src: '/images/process/pressed-sheets.jpg', alt: 'Stack of pressed recycled plastic legs in multiple colours' },
                  ]}
                  aspect="4/3"
                />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                    <h3 className="text-lg font-semibold text-background">Press</h3>
                  </div>
                  <p className="text-sm text-background/60 leading-relaxed">Shredded plastic is heated and pressed into durable sheets. Each colour is unique — made from whatever plastic the community collected.</p>
                </div>
              </div>

              <div className="rounded-xl bg-background/5 border border-background/10 overflow-hidden">
                <MediaSlot src="/images/process/cnc-cutter.jpg" alt="CNC router cutting bed leg components from pressed plastic sheet" label="Cut" aspect="4/3" />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                    <h3 className="text-lg font-semibold text-background">Cut</h3>
                  </div>
                  <p className="text-sm text-background/60 leading-relaxed">A CNC router cuts bed leg components from the pressed sheets. Precise, repeatable, minimal waste.</p>
                </div>
              </div>

              <div className="rounded-xl bg-background/5 border border-background/10 overflow-hidden">
                <CyclingImage
                  images={[
                    { src: '/images/pitch/bed-seq-1-leg-pole.jpg', alt: 'First pole threads through canvas sleeve' },
                    { src: '/images/pitch/bed-seq-2-legs-pole.jpg', alt: 'Second pole through the other side' },
                    { src: '/images/pitch/bed-seq-3-all-parts.jpg', alt: 'Legs clip onto both poles' },
                    { src: '/images/pitch/bed-assembled.jpg', alt: 'Assembled Stretch Bed' },
                  ]}
                  aspect="4/3"
                />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
                    <h3 className="text-lg font-semibold text-background">Assemble</h3>
                  </div>
                  <p className="text-sm text-background/60 leading-relaxed">Thread one pole through each side of the canvas. Clip the legs on. Done in under 5 minutes, no tools.</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-background/40 text-sm">~30 beds per week &middot; 20kg plastic diverted per bed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Assembly + Voices */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-start">
              {/* Assembly slideshow */}
              <div>
                <h2
                  className="text-2xl md:text-3xl font-light text-foreground mb-6 leading-snug"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                >
                  Built by community
                </h2>
                <AssemblySequence />
              </div>

              {/* Community quotes */}
              <div className="space-y-8">
                <h2
                  className="text-2xl md:text-3xl font-light text-foreground mb-6 leading-snug"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                >
                  Community voices
                </h2>
                {quotes
                  .filter((q) => q.theme === 'dignity' || q.theme === 'product-feedback')
                  .slice(0, 3)
                  .map((q) => (
                    <blockquote key={q.author + q.theme} className="border-l-2 border-primary pl-6">
                      <p
                        className="text-lg text-foreground leading-relaxed mb-2"
                        style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                      >
                        &ldquo;{q.text}&rdquo;
                      </p>
                      <footer className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{q.author}</span>
                        <span> &mdash; {q.context}</span>
                      </footer>
                    </blockquote>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expanded Gallery — manufacturing + community photos */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-2xl md:text-3xl font-light text-foreground mb-8 leading-snug"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              From factory to country
            </h2>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
              <MediaSlot src="/images/media-pack/woman-on-red-stretch-bed.jpg" alt="Woman sitting on Stretch Bed with red recycled plastic legs" aspect="4/3" />
              <MediaSlot src="/images/media-pack/community-bed-assembly.jpg" alt="Community members threading canvas over the bed frame" aspect="4/3" />
              <MediaSlot src="/images/media-pack/community-testing-bed-golden-hour.jpg" alt="Community member testing the Stretch Bed at golden hour" aspect="4/3" />
              <MediaSlot src="/images/process/hydraulic-press.jpg" alt="Hydraulic press compressing recycled plastic" aspect="4/3" />
              <MediaSlot src="/images/process/pressed-sheets.jpg" alt="Stack of pressed recycled plastic legs in multiple colours" aspect="4/3" />
              <MediaSlot src="/images/product/stretch-bed-kids-building.jpg" alt="Kids in community building Stretch Beds together" aspect="4/3" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
