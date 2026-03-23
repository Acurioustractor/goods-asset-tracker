import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { STRETCH_BED } from '@/lib/data/products';
import { story } from '@/lib/data/content';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MediaSlot } from '@/components/ui/media-slot';
import { NewsletterSignup } from '@/components/newsletter-signup';
import { BedPhotoGallery } from './bed-photo-gallery';
import { BedMapWrapper } from './bed-map-wrapper';
import { QuickConnectForm } from './quick-connect-form';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return {
    title: `Bed ${id} — Track Your Goods`,
    description: `Follow the journey of Stretch Bed ${id} — from recycled plastic to community impact. Made by Goods on Country.`,
    openGraph: {
      title: `Stretch Bed ${id} | Goods on Country`,
      description: 'Follow this bed\'s journey from recycled materials to community impact.',
    },
  };
}

const EVENT_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  created: { label: 'Manufactured', icon: '🔨', color: 'bg-amber-500' },
  in_production: { label: 'In Production', icon: '⚙️', color: 'bg-orange-500' },
  quality_check: { label: 'Quality Check', icon: '✅', color: 'bg-green-500' },
  ready: { label: 'Ready to Ship', icon: '📦', color: 'bg-blue-500' },
  shipped: { label: 'Shipped', icon: '🚚', color: 'bg-indigo-500' },
  in_transit: { label: 'In Transit', icon: '🛤️', color: 'bg-violet-500' },
  delivered: { label: 'Delivered', icon: '🏠', color: 'bg-emerald-500' },
  setup: { label: 'Set Up', icon: '🛏️', color: 'bg-teal-500' },
  photo_update: { label: 'Photo Update', icon: '📸', color: 'bg-pink-500' },
};

interface BedPageProps {
  params: Promise<{ id: string }>;
}

export default async function BedPage({ params }: BedPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch asset details
  const { data: asset } = await supabase
    .from('assets')
    .select('unique_id, name, product, community, place, status, supply_date, created_time, photo')
    .eq('unique_id', id)
    .single();

  // Fetch all assets for the map (aggregate by community)
  const { data: allAssets } = await supabase
    .from('assets')
    .select('unique_id, community, gps, product, status');

  // Fetch journey events
  const { data: journeyEvents } = await supabase
    .from('bed_journeys')
    .select('*')
    .eq('asset_id', id)
    .order('event_date', { ascending: true });

  const events = journeyEvents || [];

  if (!asset) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <p className="text-4xl mb-4">🔍</p>
            <h2 className="text-xl font-semibold mb-2">Bed Not Found</h2>
            <p className="text-muted-foreground text-sm mb-6">
              We couldn&apos;t find a bed with ID: <strong>{id}</strong>
            </p>
            <Button asChild>
              <Link href="/">Visit Goods on Country</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero banner with product image */}
      <section className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-amber-900 text-white overflow-hidden">
        <div className="grid md:grid-cols-2 items-center max-w-6xl mx-auto">
          <div className="py-16 px-6 md:px-12">
            <p className="text-amber-300 font-medium text-sm tracking-widest uppercase mb-3">
              Goods on Country
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              This Is Your Bed
            </h1>
            <p className="text-white/80 text-lg mb-6">
              Every Goods bed has a story. Scan the QR code to see where it came from,
              what it&apos;s made of, and the community it supports.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-5 py-2.5 text-sm">
              <span className="text-amber-300 font-mono font-bold">{asset.unique_id}</span>
              <span className="text-white/50">|</span>
              <span>{asset.product || 'Stretch Bed'}</span>
              {asset.community && (
                <>
                  <span className="text-white/50">|</span>
                  <span>{asset.community}</span>
                </>
              )}
            </div>
          </div>
          <div className="relative h-64 md:h-full md:min-h-[400px]">
            <Image
              src="/images/product/stretch-bed-hero.jpg"
              alt="The Stretch Bed — recycled plastic, galvanised steel, heavy-duty canvas"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Quick connect CTA */}
      <div className="max-w-3xl mx-auto px-4 mt-6">
        <QuickConnectForm />
      </div>

      {/* Map — where is this bed? */}
      {allAssets && allAssets.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 mt-6 relative z-0">
          <div className="bg-card border rounded-2xl shadow-xl overflow-hidden">
            <div className="p-4 pb-2">
              <h2 className="font-display text-lg font-bold">Where Is This Bed?</h2>
              <p className="text-muted-foreground text-xs">
                Your bed is at {asset.place || asset.community || 'its community'}. See all Goods products deployed across Australia.
              </p>
            </div>
            <BedMapWrapper currentAssetId={id} assets={allAssets} />
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-16">
        {/* What is this bed? */}
        <section>
          <h2 className="font-display text-2xl font-bold mb-6">What Is the Stretch Bed?</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Weight', value: STRETCH_BED.specs.weight },
              { label: 'Capacity', value: STRETCH_BED.specs.loadCapacity },
              { label: 'Dimensions', value: STRETCH_BED.specs.dimensions },
              { label: 'Assembly', value: STRETCH_BED.specs.assemblyTime },
              { label: 'Tools', value: STRETCH_BED.specs.toolsRequired },
              { label: 'Plastic Diverted', value: STRETCH_BED.specs.plasticDiverted },
            ].map((spec) => (
              <div key={spec.label} className="bg-muted rounded-lg p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{spec.label}</p>
                <p className="font-semibold mt-1">{spec.value}</p>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
            {STRETCH_BED.shortDescription} Designed with over 500 minutes of community
            feedback, the Stretch Bed is built to last 10+ years in remote conditions.
          </p>
        </section>

        {/* Video — community voices */}
        <section>
          <h2 className="font-display text-2xl font-bold mb-2">Hear from Community</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Community voices on why beds and essential goods matter.
          </p>
          <div className="space-y-4">
            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                src="https://share.descript.com/embed/LAT0KNJMxmH"
                className="w-full h-full"
                allow="autoplay; fullscreen"
                allowFullScreen
                title="Community voices — Stretch Bed recipient"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="aspect-video rounded-xl overflow-hidden bg-black">
                <iframe
                  src="https://share.descript.com/embed/2gxa5x40r9N"
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title="Cliff Plummer — Beds and dignity"
                />
              </div>
              <div className="aspect-video rounded-xl overflow-hidden bg-black">
                <iframe
                  src="https://share.descript.com/embed/YQwAcYfxzkn"
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title="Fred — Community voices from Oonchiumpa"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Dianne Stokes — co-designer */}
        <section className="bg-muted/50 rounded-2xl p-6 md:p-8">
          <div className="grid sm:grid-cols-[200px_1fr] gap-6 items-start">
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <Image
                src="/images/people/dianne-stokes.jpg"
                alt="Elder Dianne Stokes"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Co-Designer</p>
              <h3 className="font-display text-xl font-bold mb-2">Elder Dianne Stokes</h3>
              <blockquote className="border-l-2 border-primary pl-4 mb-3">
                <p className="text-foreground italic" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
                  &ldquo;Working both ways &mdash; cultural side in white society and Indigenous society.&rdquo;
                </p>
              </blockquote>
              <p className="text-sm text-muted-foreground">
                Dianne named the washing machine &ldquo;Pakkimjalki Kari&rdquo; in Warumungu language.
                She didn&apos;t just receive a product &mdash; she co-designed it, tested it,
                and named it for her community in Tennant Creek.
              </p>
            </div>
          </div>
        </section>

        {/* Journey timeline */}
        <section>
          <h2 className="font-display text-2xl font-bold mb-2">This Bed&apos;s Journey</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Every Goods bed is tracked from manufacture to delivery. Here&apos;s where this one has been.
          </p>

          {events.length > 0 ? (
            <div className="relative pl-8 space-y-6">
              {/* Timeline line */}
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-border" />

              {events.map((event, i) => {
                const meta = EVENT_LABELS[event.event_type] || {
                  label: event.event_type,
                  icon: '📍',
                  color: 'bg-gray-500',
                };
                return (
                  <div key={event.id} className="relative">
                    {/* Timeline dot */}
                    <div
                      className={`absolute -left-5 top-1 w-4 h-4 rounded-full ${meta.color} border-2 border-background flex items-center justify-center`}
                    >
                      {i === events.length - 1 && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      )}
                    </div>
                    <div className="bg-card border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{meta.icon}</span>
                        <h3 className="font-semibold text-sm">{meta.label}</h3>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(event.event_date).toLocaleDateString('en-AU', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      )}
                      {event.location && (
                        <p className="text-xs text-muted-foreground mt-1">
                          📍 {event.location}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-3xl mb-3">🌱</p>
                <p className="font-medium mb-1">Journey just beginning</p>
                <p className="text-sm text-muted-foreground">
                  This bed is fresh off the line. Check back as it makes its way to community.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* In community — timelapse */}
        <section>
          <h2 className="font-display text-2xl font-bold mb-2">In Community</h2>
          <p className="text-muted-foreground text-sm mb-4">
            Watch a Stretch Bed being made at the Alice Springs production facility.
          </p>
          <div className="aspect-video rounded-xl overflow-hidden bg-black">
            <iframe
              src="https://share.descript.com/embed/Xtrc5ZYsym6"
              className="w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
              title="Stretch Bed making timelapse — Alice Springs"
            />
          </div>
        </section>

        {/* How tracking works */}
        <section>
          <h2 className="font-display text-2xl font-bold mb-2">How Tracking Works</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Every Goods product carries a unique QR code. Here&apos;s the lifecycle:
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                step: '1',
                title: 'Manufacture',
                desc: 'Each bed is made from recycled HDPE plastic, galvanised steel, and heavy-duty canvas. A unique ID is assigned at creation.',
              },
              {
                step: '2',
                title: 'QR Code Applied',
                desc: 'A tamper-proof QR sticker links the physical bed to its digital record — specs, journey, and support.',
              },
              {
                step: '3',
                title: 'Track & Deliver',
                desc: 'Every milestone is logged: quality check, shipping, delivery. Communities and buyers can follow along in real time.',
              },
              {
                step: '4',
                title: 'Lifetime Support',
                desc: 'Scan any time for support, warranty claims, or condition check-ins. The bed\'s full history lives with it.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 p-4 bg-muted rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* The Story */}
        <section>
          <h2 className="font-display text-2xl font-bold mb-2">Why This Exists</h2>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              {story.problem.stats.map((stat) => (
                <div key={stat.label} className="bg-red-50 dark:bg-red-950/30 rounded-lg p-4 border border-red-100 dark:border-red-900/50">
                  <p className="text-2xl font-bold text-red-700 dark:text-red-400">{stat.value}</p>
                  <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">{stat.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.source}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {story.problem.description}
            </p>
          </div>
        </section>

        {/* Washing machine teaser */}
        <section className="bg-foreground text-background rounded-2xl overflow-hidden">
          <div className="grid sm:grid-cols-2">
            <div className="relative min-h-[200px]">
              <Image
                src="/images/product/washing-machine-hero.jpg"
                alt="Pakkimjalki Kari — washing machine by Goods on Country"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <p className="text-background/50 text-xs uppercase tracking-widest mb-2">Coming Soon</p>
              <h3 className="font-display text-xl font-bold mb-2">Pakkimjalki Kari</h3>
              <p className="text-background/70 text-sm mb-4">
                A commercial-grade washing machine in recycled plastic housing.
                Named in Warumungu language by Elder Dianne Stokes.
                Built to last 10-15 years, not 1-2.
              </p>
              <Button asChild variant="secondary" size="sm" className="w-fit">
                <Link href="/shop/washing-machine">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-gradient-to-br from-stone-100 to-amber-50 dark:from-stone-900 dark:to-amber-950/30 rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold mb-2">Follow Our Journey</h2>
          <p className="text-muted-foreground text-sm mb-4 max-w-md mx-auto">
            Goods on Country is building a new model for remote community infrastructure
            — beds, washing machines, and eventually community-owned manufacturing.
          </p>
          <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
            Subscribe to hear how the project grows, where beds are being delivered,
            and how you can support or get involved.
          </p>
          <div className="max-w-sm mx-auto">
            <NewsletterSignup
              tag="parliament-house-demo"
              buttonText="Subscribe to Updates"
              successMessage="Welcome aboard! We'll send you a welcome email with more about our story."
            />
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pb-8">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/shop/stretch-bed-single">Buy a Stretch Bed</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/story">Read Our Story</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/support?asset_id=${id}`}>Report an Issue</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
