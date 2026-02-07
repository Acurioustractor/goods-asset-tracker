import Link from 'next/link';
import { Hero, ImpactStats } from '@/components/marketing';
import { AssemblySequence } from '@/components/pitch/assembly-sequence';
import { CyclingImage } from '@/components/pitch/cycling-image';
import { MediaSlot } from '@/components/ui/media-slot';
import { Button } from '@/components/ui/button';
import { brand } from '@/lib/data/content';

export default async function HomePage() {
  return (
    <>
      {/* 1. Hero — Video bg, Stretch Bed as hero product */}
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

      {/* 2. The Stretch Bed — Materials + Assembly + Price comparison */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-accent mb-4">
              The Stretch Bed
            </p>
            <h2
              className="text-3xl md:text-4xl font-light text-foreground mb-4 leading-snug"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              Three materials. No tools. Five minutes.
            </h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl">
              20kg, supports 200kg, lasts 5+ years. Each bed diverts 14kg of plastic from landfill.
            </p>

            <div className="grid gap-12 lg:grid-cols-2 items-start">
              {/* Left: 4 material boxes */}
              <div className="grid gap-4 grid-cols-2">
                <div className="rounded-xl border border-border overflow-hidden bg-muted/30">
                  <MediaSlot
                    src="/images/pitch/bed-frame-legs.jpg"
                    alt="Recycled HDPE plastic legs — pressed from community waste"
                    label="Recycled plastic legs"
                    aspect="4/3"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-foreground text-sm mb-0.5">Recycled Plastic Frame</h3>
                    <p className="text-xs text-muted-foreground">HDPE legs from community plastic. 14kg diverted per bed.</p>
                  </div>
                </div>

                <div className="rounded-xl border border-border overflow-hidden bg-muted/30">
                  <MediaSlot
                    src="/images/pitch/bed-poles.jpg"
                    alt="Galvanised steel pole — 26.9mm OD"
                    label="Steel pole"
                    aspect="4/3"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-foreground text-sm mb-0.5">Galvanised Steel Poles</h3>
                    <p className="text-xs text-muted-foreground">Two 26.9mm poles thread through canvas sleeves.</p>
                  </div>
                </div>

                <div className="rounded-xl border border-border overflow-hidden bg-muted/30">
                  <MediaSlot
                    src="/images/pitch/bed-canvas.jpg"
                    alt="Heavy-duty Australian canvas with Goods. branding"
                    label="Canvas"
                    aspect="4/3"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-foreground text-sm mb-0.5">Heavy-Duty Canvas</h3>
                    <p className="text-xs text-muted-foreground">Washable, repairable, built for remote conditions.</p>
                  </div>
                </div>

                <div className="rounded-xl border border-border overflow-hidden bg-muted/30">
                  <MediaSlot
                    src="/images/media-pack/nic-with-elder-on-verandah.jpg"
                    alt="Nic sitting on a Stretch Bed with an elder on a verandah — ongoing support and connection"
                    label="Support system"
                    aspect="4/3"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-foreground text-sm mb-0.5">Support System</h3>
                    <p className="text-xs text-muted-foreground">Every bed tracked. Ask questions, stay connected, get support.</p>
                  </div>
                </div>
              </div>

              {/* Right: Assembly sequence + price comparison */}
              <div>
                <AssemblySequence />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. From Rubbish to Bed — 5-step production flow, dark bg */}
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
              {/* Step 1: Collect */}
              <div className="rounded-xl bg-background/5 border border-background/10 overflow-hidden">
                <MediaSlot
                  src="/images/process/color-samples.jpg"
                  alt="Sorted recycled plastic from community waste"
                  label="Collect"
                  aspect="4/3"
                />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                    <h3 className="text-lg font-semibold text-background">Collect</h3>
                  </div>
                  <p className="text-sm text-background/60 leading-relaxed">Local people gather plastic waste from around community. Sorted by colour, cleaned, ready for shredding.</p>
                </div>
              </div>

              {/* Step 2: Shred */}
              <div className="rounded-xl bg-background/5 border border-background/10 overflow-hidden">
                <MediaSlot
                  src="/images/process/container-factory.jpg"
                  alt="Plastic shredder inside containerised production plant"
                  label="Shred"
                  aspect="4/3"
                />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                    <h3 className="text-lg font-semibold text-background">Shred</h3>
                  </div>
                  <p className="text-sm text-background/60 leading-relaxed">Plastic goes into the shredder — a containerised unit that stays on site between production runs.</p>
                </div>
              </div>

              {/* Step 3: Press */}
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

              {/* Step 4: Cut */}
              <div className="rounded-xl bg-background/5 border border-background/10 overflow-hidden">
                <MediaSlot
                  src="/images/process/cnc-cutter.jpg"
                  alt="CNC router cutting bed leg components from pressed plastic sheet"
                  label="Cut"
                  aspect="4/3"
                />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                    <h3 className="text-lg font-semibold text-background">Cut</h3>
                  </div>
                  <p className="text-sm text-background/60 leading-relaxed">A CNC router cuts bed leg components from the pressed sheets. Precise, repeatable, minimal waste.</p>
                </div>
              </div>

              {/* Step 5: Assemble */}
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
              <p className="text-background/40 text-sm">~30 beds per week &middot; 14kg plastic diverted per bed</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Impact Stats */}
      <ImpactStats fetchLive={true} />

      {/* 5. CTA — Buy + How It's Made */}
      <section className="bg-accent py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-accent-foreground md:text-4xl">
            {brand.oneLiner}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-accent-foreground/80">
            Every purchase supports community-led design and manufacturing in remote Australia.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="bg-accent-foreground text-accent hover:bg-accent-foreground/90" asChild>
              <Link href="/shop/stretch-bed-single">Buy Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-accent-foreground text-accent-foreground hover:bg-accent-foreground/10" asChild>
              <Link href="/process">How It&apos;s Made</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
