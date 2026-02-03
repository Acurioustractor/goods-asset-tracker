import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Basket Bed Plans (Open Source) | Goods on Country',
  description: 'Download open-source plans for the Basket Bed — our first prototype. Collapsible baskets with zip ties and toppers. Build your own.',
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
              The Basket Bed was our first prototype — collapsible baskets with zip ties and
              foam toppers. We&apos;ve moved on to the Stretch Bed, but we&apos;re making the
              Basket Bed designs available for anyone to build.
            </p>
          </div>
        </div>
      </section>

      {/* About the Basket Bed */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-12 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  What is the Basket Bed?
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    The Basket Bed was Goods on Country&apos;s first bed design — a collapsible
                    basket frame held together with zip ties, topped with a foam mattress. Single
                    and double sizes, stackable for transport.
                  </p>
                  <p>
                    It served hundreds of families across remote communities and taught us what
                    worked and what didn&apos;t. The lessons from the Basket Bed directly shaped
                    the Stretch Bed — our current flagship product.
                  </p>
                  <p>
                    We&apos;re no longer manufacturing Basket Beds, but the design is yours to
                    use. Build them for your community, modify the plans, make them your own.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  Design Specifications
                </h2>
                <div className="space-y-3">
                  {[
                    { label: 'Construction', value: 'Collapsible basket frame with zip ties' },
                    { label: 'Sizes', value: 'Single and double' },
                    { label: 'Mattress', value: 'Foam topper (supplied separately)' },
                    { label: 'Transport', value: 'Stackable, flat-packable' },
                    { label: 'Assembly', value: 'No tools required' },
                    { label: 'License', value: 'Open source — free to use and modify' },
                  ].map((spec) => (
                    <div key={spec.label} className="flex items-start gap-3 text-sm">
                      <span className="font-medium text-foreground min-w-[120px]">{spec.label}</span>
                      <span className="text-muted-foreground">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Download */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Download the Plans
            </h2>
            <p className="text-muted-foreground mb-8">
              Plans are being prepared for public release. Register your interest and
              we&apos;ll notify you when they&apos;re available.
            </p>
            <Card>
              <CardContent className="p-8">
                <form
                  action="/api/contact"
                  method="POST"
                  className="space-y-4"
                >
                  <input type="hidden" name="type" value="basket-bed-plans" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="your@email.com"
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Button type="submit" className="w-full">
                    Notify Me When Plans Are Ready
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA to Stretch Bed */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Looking for a ready-made bed?
            </h2>
            <p className="text-muted-foreground mb-8">
              The Stretch Bed is our current flagship — recycled HDPE plastic legs, galvanised
              steel poles, and heavy-duty canvas. 12kg, flat-packs, no tools. Each bed diverts
              21kg of plastic from landfill.
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
