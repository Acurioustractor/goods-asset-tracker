import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NewsletterSignup } from '@/components/newsletter-signup';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Basket Bed Plans (Open Source) | Goods on Country',
  description: 'Download open-source plans for the Basket Bed — our first prototype that served hundreds of families. The lessons learned shaped the Stretch Bed.',
};

export default function BasketBedPlansPage() {
  return (
    <main>
      {/* Header */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-primary mb-4">
              Open Source
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Basket Bed Plans
            </h1>
            <p className="text-lg text-muted-foreground">
              The Basket Bed was our first prototype &mdash; collapsible baskets with zip ties and
              foam toppers. It served hundreds of families and taught us everything we needed
              to build the Stretch Bed. Now we&apos;re making the plans free for anyone to use.
            </p>
          </div>
        </div>
      </section>

      {/* Status Banner */}
      <section className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium bg-neutral-100 text-neutral-600">
              Archived
            </span>
            <span className="text-muted-foreground">
              No longer manufactured &mdash; open-source plans available for free
            </span>
          </div>
        </div>
      </section>

      {/* The Iteration Journey */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              The Iteration Journey
            </h2>

            <div className="space-y-8">
              {/* V1: The Basket Bed */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                      V1
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        The Basket Bed (This Design)
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Our first attempt at a bed for remote communities. Collapsible
                        plastic baskets held together with zip ties, topped with foam
                        mattresses. Available in single, double, and stackable variants.
                      </p>
                      <div className="space-y-3 mb-4">
                        <h4 className="font-semibold text-foreground">What Worked</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>&bull; Flat-packable and easy to transport to remote communities</li>
                          <li>&bull; No tools required for assembly</li>
                          <li>&bull; Stackable for efficient freight</li>
                          <li>&bull; Served hundreds of families across 8+ communities</li>
                          <li>&bull; Proved the concept that purpose-built beds are needed</li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground">What We Learned</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>&bull; Zip ties degraded in extreme UV &mdash; needed more durable fastening</li>
                          <li>&bull; Foam toppers absorbed moisture and were hard to clean</li>
                          <li>&bull; Basket frame had limited weight capacity</li>
                          <li>&bull; Communities wanted something more robust for long-term use</li>
                          <li>&bull; The sleeping surface needed to be fully washable</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Arrow */}
              <div className="flex justify-center">
                <svg className="w-8 h-8 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>

              {/* V2: The Stretch Bed */}
              <Card className="border-primary/20">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                      V2
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        The Stretch Bed (Current Flagship)
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Everything we learned from the Basket Bed went into designing
                        the Stretch Bed. Recycled HDPE plastic legs, galvanised steel
                        poles, and heavy-duty washable canvas. 26kg, 200kg capacity,
                        10+ year lifespan. Each bed diverts 20kg of plastic from landfill.
                      </p>
                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground">How It Improved</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>&bull; Recycled HDPE plastic legs &mdash; virtually indestructible, no UV degradation</li>
                          <li>&bull; Galvanised steel poles &mdash; 200kg capacity vs basket frame limits</li>
                          <li>&bull; Washable canvas surface &mdash; no more moisture-trapping foam</li>
                          <li>&bull; Slot-together design &mdash; no zip ties, no degradable parts</li>
                          <li>&bull; 500+ minutes of community feedback shaped every detail</li>
                        </ul>
                      </div>
                      <div className="mt-4">
                        <Button size="sm" asChild>
                          <Link href="/shop/stretch-bed-single">Shop the Stretch Bed</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Design Specs */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Basket Bed Specifications
                </h2>
                <div className="space-y-3">
                  {[
                    { label: 'Construction', value: 'Collapsible basket frame with zip ties' },
                    { label: 'Sizes', value: 'Single and double' },
                    { label: 'Mattress', value: 'Foam topper (supplied separately)' },
                    { label: 'Transport', value: 'Stackable, flat-packable' },
                    { label: 'Assembly', value: 'No tools required' },
                    { label: 'Status', value: 'Archived — open source' },
                    { label: 'License', value: 'Free to use and modify' },
                  ].map((spec) => (
                    <div key={spec.label} className="flex items-start gap-3 text-sm">
                      <span className="font-medium text-foreground min-w-[120px]">{spec.label}</span>
                      <span className="text-muted-foreground">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Download the Plans
                </h2>
                <p className="text-muted-foreground mb-6">
                  Plans are being prepared for public release. Register your
                  interest and we&apos;ll notify you when they&apos;re ready. You&apos;re
                  free to build, modify, and share these designs.
                </p>
                <Card>
                  <CardContent className="p-6">
                    <NewsletterSignup
                      tag="basket-bed-plans"
                      buttonText="Notify Me When Plans Are Ready"
                      successMessage="We'll notify you when plans are ready to download."
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Get Involved */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              How to Get Involved
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Build Your Own</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    When plans are released, download them and build Basket Beds
                    for your community, school, or organisation. Modify the
                    design to suit your needs.
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    Plans coming soon &mdash; register above
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Improve the Design</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Have ideas for improvements? Found a better material or
                    fastening method? We welcome contributions and will share
                    community improvements back.
                  </p>
                  <Link
                    href="/contact"
                    className="text-sm font-medium text-foreground underline"
                  >
                    Share your ideas &rarr;
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Teach &amp; Share</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Use the plans in educational settings, maker spaces, or
                    community workshops. Great for teaching design thinking
                    with real social impact.
                  </p>
                  <Link
                    href="/contact"
                    className="text-sm font-medium text-foreground underline"
                  >
                    Tell us how you used it &rarr;
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA to Stretch Bed */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Looking for a ready-made bed?
            </h2>
            <p className="text-muted-foreground mb-8">
              The Stretch Bed is our current flagship &mdash; everything we learned from the
              Basket Bed, improved. Recycled HDPE plastic legs, galvanised steel poles,
              and heavy-duty canvas. 26kg, flat-packs, no tools. Each bed diverts 20kg
              of plastic from landfill.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/shop/stretch-bed-single">Shop the Stretch Bed</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/process">How It&apos;s Made</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
