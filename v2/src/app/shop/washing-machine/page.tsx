import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MediaSlot } from '@/components/ui/media-slot';
import { media } from '@/lib/data/media';
import { quotes } from '@/lib/data/content';
import { WASHING_MACHINE } from '@/lib/data/products';

export const metadata = {
  title: 'Pakkimjalki Kari — Washing Machine | Goods on Country',
  description:
    'Commercial-grade Speed Queen in recycled plastic housing. Named in Warumungu language by Elder Dianne Stokes. Currently in prototype — register your interest.',
};

const product = {
  name: WASHING_MACHINE.name,
  slug: 'washing-machine',
  shortDescription: WASHING_MACHINE.shortDescription,
  description: `One Alice Springs provider sells $3 million per year of washing machines into remote communities. Most end up in dumps within months.

Consumer-grade machines aren't built for remote conditions — extreme heat, dust, hard water, and no access to repairs. Communities cycle through cheap machines that fail in 1-2 years, while commercial laundromat machines last 10-15.

Pakkimjalki Kari starts with a Speed Queen commercial washer — the same machines that survive thousands of cycles in laundromats — and adapts it for remote community use. Recycled HDPE plastic housing panels (made from the same material as Stretch Bed legs) protect the machine from dust and the elements.

Elder Dianne Stokes named it "Pakkimjalki Kari" in Warumungu language. This isn't just branding — it reflects community ownership of the design process.`,
  images: [
    { src: media.product.washingMachine, alt: 'Pakkimjalki Kari washing machine with recycled plastic enclosure' },
    { src: media.product.washingMachineName, alt: 'Pakkimjalki Kari — named in Warumungu language by Elder Dianne Stokes' },
    { src: media.product.washingMachineInstalled, alt: 'Washing machine installed and operating in community' },
    { src: media.product.washingMachineCommunity, alt: 'Community members with the Pakkimjalki Kari washing machine' },
  ],
};

export default function WashingMachinePage() {
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
                src={product.images[0].src || '/images/product/washing-machine-hero.jpg'}
                alt={product.images[0].alt}
                fill
                className="object-cover"
                priority
              />
              <Badge className="absolute top-4 left-4 bg-amber-600 text-white">
                Prototype
              </Badge>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-3 gap-3">
              {product.images.slice(1).map((image, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                  <Image
                    src={image.src || '/images/product/washing-machine-hero.jpg'}
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
              Washing Machine
            </Badge>

            {/* Title */}
            <h1 className="text-3xl font-bold text-foreground md:text-4xl">
              {product.name}
            </h1>

            {/* Subtitle */}
            <p className="mt-2 text-sm text-muted-foreground italic">
              Named in Warumungu language by Elder Dianne Stokes
            </p>

            {/* Price / Status */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-lg font-medium text-amber-600">
                Prototype — Not Yet for Sale
              </span>
            </div>

            {/* Short Description */}
            <p className="mt-4 text-lg text-muted-foreground">
              {product.shortDescription}
            </p>

            <Separator className="my-6" />

            {/* Actions */}
            <div className="space-y-3">
              <Button size="lg" className="w-full" asChild>
                <Link href="/partner">
                  Register Interest
                </Link>
              </Button>

              <Button size="lg" variant="outline" className="w-full" asChild>
                <Link href="/contact">
                  <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Talk to Us About This
                </Link>
              </Button>
            </div>

            {/* Health Impact Note */}
            <Card className="mt-6 bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <svg className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-foreground">Health Hardware</p>
                    <p className="text-sm text-muted-foreground">
                      A washing machine isn&apos;t convenience &mdash; it&apos;s cardiac prevention.
                      Clean bedding breaks the scabies cycle that leads to Rheumatic Heart Disease.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Grid */}
            <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="font-medium text-foreground">Base Unit</dt>
                <dd className="text-muted-foreground">{WASHING_MACHINE.specs.baseUnit}</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Housing</dt>
                <dd className="text-muted-foreground">Recycled HDPE plastic</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Target Lifespan</dt>
                <dd className="text-muted-foreground">10-15 years</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Stage</dt>
                <dd className="text-amber-600 font-medium">Prototype Testing</dd>
              </div>
            </div>
          </div>
        </div>

        {/* Story Section - Full Width */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">About Pakkimjalki Kari</h2>
          <div className="prose prose-stone max-w-none">
            <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
          </div>
        </section>

        {/* The Problem — Stats */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">The Problem</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: '$3M/yr', label: 'washing machines sold into remote communities that end up in dumps', source: 'Alice Springs provider' },
              { value: '59%', label: 'of remote homes lack working washing machines', source: 'FRRR, 2022' },
              { value: '1-2 yrs', label: 'lifespan of consumer machines in remote conditions (vs 10-15)', source: 'East Arnhem Spin Project' },
              { value: '1 in 3', label: 'children have scabies at any time — linked to dirty bedding', source: 'PLOS NTD' },
            ].map((stat) => (
              <Card key={stat.value}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">{stat.source}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Why Commercial-Grade</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Commercial motor built for thousands of cycles',
              'Metal internals where consumer machines use plastic',
              'Simple controls — no digital displays to fail',
              'Standard parts — repairable, not disposable',
              'Handles extreme heat, dust, bore water',
              'Recycled plastic housing for environmental protection',
            ].map((feature) => (
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
          <h2 className="text-2xl font-bold text-foreground mb-6">Built for Remote Conditions</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Heat',
                description: 'Temperatures regularly exceed 40°C. Commercial components handle thermal stress that melts consumer internals.',
                icon: '☀',
              },
              {
                title: 'Dust',
                description: 'Red dust infiltrates everything. Recycled plastic housing panels protect the machine from the environment.',
                icon: '🏜',
              },
              {
                title: 'Water',
                description: 'Bore water with high mineral content causes rapid buildup. Commercial units tolerate hard water far better.',
                icon: '💧',
              },
              {
                title: 'Power',
                description: 'Remote power grids fluctuate. Industrial motors handle voltage variation that burns out consumer electronics.',
                icon: '⚡',
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-4">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-12 bg-accent py-12 px-6 md:px-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-accent-foreground mb-4">
            Want to be part of this?
          </h2>
          <p className="text-accent-foreground/80 max-w-xl mx-auto mb-6">
            Whether you&apos;re a community that needs reliable washing machines,
            a funder who wants to support the prototype stage, or someone with
            technical expertise &mdash; we&apos;d love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/partner">Register Interest</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-accent-foreground text-accent-foreground hover:bg-accent-foreground/10" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </section>
      </div>

      {/* Community Voices — Full Width */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-start">
              {/* Community image */}
              <div>
                <h2
                  className="text-2xl md:text-3xl font-light text-foreground mb-6 leading-snug"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                >
                  Community voices
                </h2>
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                  <Image
                    src="/images/product/washing-machine-community.jpg"
                    alt="Community members with the Pakkimjalki Kari washing machine"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Quotes */}
              <div className="space-y-8">
                <blockquote className="border-l-2 border-primary pl-6">
                  <p
                    className="text-lg text-foreground leading-relaxed mb-2"
                    style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                  >
                    &ldquo;They truly wanna a washing machine to wash their blanket, to wash their clothes,
                    and it&apos;s right there at home.&rdquo;
                  </p>
                  <footer className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Patricia Frank</span>
                    <span> &mdash; Tennant Creek</span>
                  </footer>
                </blockquote>

                <blockquote className="border-l-2 border-primary pl-6">
                  <p
                    className="text-lg text-foreground leading-relaxed mb-2"
                    style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                  >
                    &ldquo;Scabies often leads to Rheumatic Heart Disease, so washing machines are essential
                    to be able to clean infected clothing, bedding and towels.&rdquo;
                  </p>
                  <footer className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Jessica Allardyce</span>
                    <span> &mdash; Miwatj Health</span>
                  </footer>
                </blockquote>

                <blockquote className="border-l-2 border-primary pl-6">
                  <p
                    className="text-lg text-foreground leading-relaxed mb-2"
                    style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                  >
                    &ldquo;Working both ways &mdash; cultural side in white society and Indigenous society.&rdquo;
                  </p>
                  <footer className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Dianne Stokes</span>
                    <span> &mdash; Elder, Tennant Creek</span>
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery — media pack photos */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-2xl md:text-3xl font-light text-foreground mb-8 leading-snug"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              From prototype to community
            </h2>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
              <MediaSlot src="/images/product/washing-machine-installed.jpg" alt="Washing machine installed in community" aspect="4/3" />
              <MediaSlot src="/images/product/washing-machine-name.jpg" alt="Pakkimjalki Kari — named in Warumungu language" aspect="4/3" />
              <MediaSlot src="/images/media-pack/washing-machine-enclosure-sunset.jpg" alt="Recycled plastic washing machine enclosure at sunset" aspect="4/3" />
              <MediaSlot src="/images/media-pack/speed-queen-controls.jpg" alt="Speed Queen controls demonstration" aspect="4/3" />
              <MediaSlot src="/images/product/washing-machine-community.jpg" alt="Community members with washing machine" aspect="4/3" />
              <MediaSlot src="/images/product/washing-machine-hero.jpg" alt="Pakkimjalki Kari washing machine hero shot" aspect="4/3" />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA — dark */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#2E2E2E' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            A washing machine isn&apos;t convenience &mdash; it&apos;s health hardware.
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Register your interest and we&apos;ll let you know when Pakkimjalki Kari
            is available, or when we have testing results to share.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" style={{ backgroundColor: '#C45C3E' }} asChild>
              <Link href="/partner">Register Interest</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link href="/wiki/products/washing-machine">Read the Full Wiki Guide</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
