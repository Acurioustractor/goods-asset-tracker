import Image from 'next/image';
import Link from 'next/link';
import { Hero, ImpactStats } from '@/components/marketing';
import { AssemblySequence } from '@/components/pitch/assembly-sequence';
import { CyclingImage } from '@/components/pitch/cycling-image';
import { MediaSlot } from '@/components/ui/media-slot';
import { Button } from '@/components/ui/button';
import { brand } from '@/lib/data/content';
import { PLASTIC_KG_PER_BED, STRETCH_BED } from '@/lib/data/products';
import { videoUrl } from '@/lib/data/media';
import { canonVideoSrc } from '@/lib/data/canon-videos';
import { FeaturedStories } from '@/components/empathy-ledger/featured-stories';
import { FieldNotesTile } from '@/components/marketing/field-notes-tile';
import { getStoryOverrides } from '@/lib/field-notes/overrides';
import { createClient } from '@/lib/supabase/server';
import { MediaSwapZone, type SwapFolder } from '@/components/admin/media-swap-picker';

const HOME_SLUG = 'home';

// '26.9mm' — pole outside diameter, derived from the canonical frame spec.
const POLE_OD = STRETCH_BED.materials.frame.detail.split(' ')[0];

const HOME_FOLDERS: SwapFolder[] = [
  { label: 'All recent', emoji: '🕘', tags: [] },
  { label: 'All Stretch Bed', emoji: '🛏', tags: ['product:stretch-bed'] },
  { label: 'Alice build', emoji: '🛠', tags: ['event:alice-build'] },
  { label: 'Utopia delivery', emoji: '🏠', tags: ['community:utopia-homelands', 'event:bed-delivery'] },
  { label: 'Oonchiumpa young people', emoji: '👥', tags: ['participant:oonchiumpa-young-people'] },
  { label: 'May 2026 trip', emoji: '📅', tags: ['trip:may-2026'] },
];

export default async function HomePage() {
  // Admin-only swap widget. Local dev or signed-in user gets the orange
  // swap pill on every media slot. Public visitors see no chrome.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLocalDev = process.env.NODE_ENV !== 'production';
  const canSwap = !!user || isLocalDev;

  // Manual overrides from data/field-note-overrides.json under slug 'home'.
  // Keys: materials.0..3, feature-video.image / .videoDesktop / .videoMobile / .poster
  const overrides = getStoryOverrides(HOME_SLUG);
  const ov = (key: string, fallback: string) => overrides[key] || fallback;
  return (
    <>
      {/* 1. Hero: Video bg, Stretch Bed as hero product */}
      <Hero
        title={brand.hero.home.headline}
        subtitle={brand.hero.home.subheadline}
        primaryCta={{ text: 'Shop the Stretch Bed', href: '/shop/stretch-bed-single' }}
        secondaryCta={{ text: 'Back the work', href: '/partner' }}
        videoSrc={canonVideoSrc('video-hero', {
          desktop: videoUrl('hero-desktop.mp4'),
          mobile: videoUrl('hero-mobile.mp4'),
          poster: '/video/hero-poster.jpg',
        })}
        imageSrc="/images/media-pack/lying-on-stretch-bed.jpg"
        imageAlt="A young man lying full-length on a Stretch Bed on country: recycled plastic legs, galvanised steel poles, heavy-duty canvas"
      />

      {/* 2. The Stretch Bed: Materials + Assembly + Price comparison */}
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
              {STRETCH_BED.specs.weight}, supports {STRETCH_BED.specs.loadCapacity}, designed to last {STRETCH_BED.specs.designLifespan}. Each bed diverts {PLASTIC_KG_PER_BED}kg of plastic from landfill.
            </p>

            <div className="grid gap-12 lg:grid-cols-2 items-start">
              {/* Left: 4 material boxes */}
              <div className="grid gap-4 grid-cols-2">
                {[
                  {
                    key: 'materials.0',
                    fallback: '/images/pitch/bed-frame-legs.jpg',
                    alt: 'Recycled HDPE plastic legs, pressed from community waste',
                    label: 'Recycled plastic legs',
                    title: 'Recycled Plastic Frame',
                    body: `HDPE legs from community plastic. ${PLASTIC_KG_PER_BED}kg diverted per bed.`,
                  },
                  {
                    key: 'materials.1',
                    fallback: '/images/pitch/bed-poles.jpg',
                    alt: `Galvanised steel pole, ${POLE_OD} OD`,
                    label: 'Steel pole',
                    title: 'Galvanised Steel Poles',
                    body: `Two ${POLE_OD} poles thread through canvas sleeves.`,
                  },
                  {
                    key: 'materials.2',
                    fallback: '/images/pitch/bed-canvas.jpg',
                    alt: 'Heavy-duty Australian canvas with Goods. branding',
                    label: 'Canvas',
                    title: 'Heavy-Duty Canvas',
                    body: 'Washable, repairable, built for remote conditions.',
                  },
                  {
                    key: 'materials.3',
                    fallback: '/images/media-pack/nic-with-elder-on-verandah.jpg',
                    alt: 'Nic sitting on a Stretch Bed with an elder on a verandah, ongoing support and connection',
                    label: 'Support system',
                    title: 'Support System',
                    body: 'Every bed tracked. Ask questions, stay connected, get support.',
                  },
                ].map((card) => {
                  const src = ov(card.key, card.fallback);
                  return (
                    <div
                      key={card.key}
                      className="rounded-xl border border-border overflow-hidden bg-muted/30"
                    >
                      <div className="relative">
                        <MediaSlot src={src} alt={card.alt} label={card.label} aspect="4/3" />
                        {canSwap && (
                          <MediaSwapZone
                            slug={HOME_SLUG}
                            overrideKey={card.key}
                            currentUrl={src}
                            tagQuery={['product:stretch-bed']}
                            kind="photo"
                            label="swap"
                            broadTag="product:stretch-bed"
                            folders={HOME_FOLDERS}
                          />
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-foreground text-sm mb-0.5">{card.title}</h3>
                        <p className="text-xs text-muted-foreground">{card.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right: Assembly sequence + price comparison */}
              <div>
                <AssemblySequence />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2b. Full-bleed video band — beds being made.
          Sits as a visual pause between the materials breakdown and the
          production-flow grid. Default = local building-together loop.
          Admin can swap to any EL video via the orange pill. */}
      {(() => {
        const videoDesktop = ov('feature-video.videoDesktop', '/video/building-together-desktop.mp4');
        const videoMobile = ov('feature-video.videoMobile', '/video/building-together-mobile.mp4');
        const poster = ov('feature-video.poster', '/video/building-together-poster.jpg');
        const overrideImage = overrides['feature-video.image']; // photo-mode fallback when admin picks a still
        return (
          <section className="relative isolate overflow-hidden bg-foreground">
            {overrideImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={overrideImage}
                alt="Beds assembled on Country"
                className="absolute inset-0 h-full w-full object-cover opacity-70"
              />
            ) : (
              <>
                <video
                  className="absolute inset-0 hidden h-full w-full object-cover opacity-70 sm:block"
                  src={videoDesktop}
                  poster={poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <video
                  className="absolute inset-0 h-full w-full object-cover opacity-70 sm:hidden"
                  src={videoMobile}
                  poster={poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/40 to-foreground/70" />
            <div className="relative container mx-auto px-4 py-24 md:py-32">
              <div className="max-w-3xl mx-auto text-center text-background">
                <p className="text-xs uppercase tracking-[0.25em] text-background/70 mb-4">
                  Toward manufacturing on Country
                </p>
                <h2
                  className="text-3xl md:text-5xl font-light leading-tight"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                >
                  Beds assembled by the people who&rsquo;ll sleep on them.
                </h2>
              </div>
            </div>
            {canSwap && (
              <MediaSwapZone
                slug={HOME_SLUG}
                overrideKey="feature-video.image"
                currentUrl={overrideImage || videoDesktop}
                tagQuery={['use:process']}
                kind="any"
                label="swap video"
                broadTag="product:stretch-bed"
                folders={HOME_FOLDERS}
                smartMediaRoute
              />
            )}
          </section>
        );
      })()}

      {/* 3. From Rubbish to Bed: 5-step production flow, dark bg */}
      <section className="py-16 md:py-20 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-background/40 mb-4">
              Toward On-Country Manufacturing
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
                  <p className="text-sm text-background/60 leading-relaxed">Plastic goes into the shredder: a containerised unit that stays on site between production runs.</p>
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
                  <p className="text-sm text-background/60 leading-relaxed">Shredded plastic is heated and pressed into durable sheets. Each colour is unique, made from whatever plastic the community collected.</p>
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
                    { src: '/images/pitch/bed-seq-3-all-parts.jpg', alt: 'Both poles thread through the X-leg holes' },
                    { src: '/images/pitch/bed-assembled.jpg', alt: 'Assembled Stretch Bed' },
                  ]}
                  aspect="4/3"
                />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">5</div>
                    <h3 className="text-lg font-semibold text-background">Assemble</h3>
                  </div>
                  <p className="text-sm text-background/60 leading-relaxed">Thread a pole through each canvas sleeve and the X-leg holes, then tension. Done in under 5 minutes, no tools.</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-background/40 text-sm">~30 beds per week &middot; {PLASTIC_KG_PER_BED}kg plastic diverted per bed</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3b. Designed in community — the Oonchiumpa partnership.
          Bridges "how it's made" (production) and "what it adds up to"
          (impact). Lands the relationship before the numbers. */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <Image
                  src="/images/partners/oonchiumpa.png"
                  alt="Oonchiumpa Consultancy"
                  width={560}
                  height={350}
                  className="h-12 sm:h-14 w-auto"
                />
                <span aria-hidden className="text-2xl text-muted-foreground/40">
                  ×
                </span>
                <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                  Goods on Country
                </span>
              </div>

              <p className="text-sm uppercase tracking-widest text-accent mb-4">
                Designed in community
              </p>
              <h2
                className="text-3xl md:text-4xl font-light text-foreground mb-5 leading-snug"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                Two years around the fire with the Bloomfield family.
              </h2>
              <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
                Oonchiumpa Consultancy is a 100% Aboriginal-owned business in Alice Springs. The
                Stretch Bed and Pakkimjalki Kari washing machine were both designed there, in
                community, with Elders and young people pulling apart prototypes and putting them
                back together.
              </p>
              <p className="text-lg text-muted-foreground mb-7 leading-relaxed">
                What started as a design partnership is becoming an enterprise: a production
                facility in Alice Springs, young people building beds, and a pipeline from local
                knowledge to local jobs.
              </p>

              <blockquote
                className="border-l-4 pl-5 mb-7 text-lg italic leading-relaxed text-foreground/85"
                style={{ borderColor: 'var(--color-accent, #8B9D77)', fontFamily: 'Georgia, serif' }}
              >
                “We want to create a safe space for our young people. There’s a lack of housing,
                which leads to a lack of sleep, which leads to low school attendance.”
                <footer className="not-italic mt-2 text-sm text-muted-foreground font-sans">
                  Kristy Bloomfield, Director, Oonchiumpa Consultancy
                </footer>
              </blockquote>

              <Button asChild size="lg">
                <Link href="/partners/oonchiumpa">
                  See the Oonchiumpa partnership →
                </Link>
              </Button>
            </div>

            <div className="space-y-3">
              {(() => {
                const heroSrc = ov('oonchiumpa.hero', '/images/product/stretch-bed-kids-building.jpg');
                return (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-muted shadow-sm">
                    <Image
                      src={heroSrc}
                      alt="The Oonchiumpa team with a Stretch Bed at the Alice Springs production facility"
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    {canSwap && (
                      <MediaSwapZone
                        slug={HOME_SLUG}
                        overrideKey="oonchiumpa.hero"
                        currentUrl={heroSrc}
                        tagQuery={['participant:oonchiumpa-young-people']}
                        kind="photo"
                        label="swap"
                        broadTag="product:stretch-bed"
                        folders={HOME_FOLDERS}
                      />
                    )}
                  </div>
                );
              })()}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { key: 'oonchiumpa.thumb1', fallback: '/images/partners/centrecorp/utopia/hero-elder-bed.jpg', alt: 'Two men seated with a Stretch Bed' },
                  { key: 'oonchiumpa.thumb2', fallback: '/images/partners/centrecorp/utopia/community-build.jpg', alt: 'A young person with a Stretch Bed at the Alice Springs build' },
                  { key: 'oonchiumpa.thumb3', fallback: '/images/partners/centrecorp/utopia/verandah-test.jpg', alt: 'Building a Stretch Bed leg from recycled plastic in Alice Springs' },
                ].map((t) => {
                  const src = ov(t.key, t.fallback);
                  return (
                    <div key={t.key} className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
                      <Image
                        src={src}
                        alt={t.alt}
                        fill
                        sizes="(max-width: 768px) 33vw, 17vw"
                        className="object-cover"
                      />
                      {canSwap && (
                        <MediaSwapZone
                          slug={HOME_SLUG}
                          overrideKey={t.key}
                          currentUrl={src}
                          tagQuery={['product:stretch-bed']}
                          kind="photo"
                          label="swap"
                          broadTag="product:stretch-bed"
                          folders={HOME_FOLDERS}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Impact Stats */}
      <ImpactStats />

      {/* 4b. Field notes — most recent published scrollytelling story.
          Self-hides until at least one story has published: true. */}
      <FieldNotesTile />

      {/* 5. Community Voices: from Empathy Ledger */}
      <FeaturedStories
        title="Community Voices"
        subtitle="32 storytellers across remote Australia have shaped and validated the Goods approach"
        maxStories={3}
      />

      {/* 6. Final CTA — single clear next step */}
      <section className="bg-accent py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-accent-foreground md:text-4xl">
            {brand.oneLiner}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-accent-foreground/80">
            Community-designed. Assembled on Country. Built to last more than ten years in remote Australia.
          </p>
          <div className="mt-8 flex justify-center">
            <Button size="lg" className="bg-background text-foreground hover:bg-background/90" asChild>
              <Link href="/shop/stretch-bed-single">Shop the Stretch Bed</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
