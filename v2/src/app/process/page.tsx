import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { fetchBuildPhotos } from '@/lib/process/el-build-photos';
import { getStoryOverrides } from '@/lib/field-notes/overrides';
import { createClient } from '@/lib/supabase/server';
import { MediaSwapZone, type SwapFolder } from '@/components/admin/media-swap-picker';

const OVERRIDE_SLUG = 'process';

// Default tag query the modal opens on (per step). Used as the active
// folder if it matches a folder; otherwise just for parity with
// non-folders mode.
const STEP_TAG_QUERIES: Record<number, string[]> = {
  1: ['product:stretch-bed'],
  2: ['product:stretch-bed'],
  3: ['product:stretch-bed'],
  4: ['product:stretch-bed'],
  5: ['trip:may-2026', 'event:alice-build'],
  6: ['community:utopia-homelands', 'event:bed-delivery'],
};

// Photo folders shown as chips at the top of the swap modal. Driven by
// what's actually tagged in Empathy Ledger — see the tag-count audit in
// scripts (community:utopia-homelands × 221, event:alice-build × 121,
// participant:oonchiumpa-young-people × 121, etc.). Add more entries
// here when new tag groups appear in EL; the chip row scrolls so a
// long folder list is fine.
const GOODS_PHOTO_FOLDERS: SwapFolder[] = [
  { label: 'Recent uploads', emoji: '🕘', tags: [] },
  { label: 'All Stretch Bed', emoji: '🛏', tags: ['product:stretch-bed'] },
  { label: 'Utopia delivery', emoji: '🏠', tags: ['community:utopia-homelands', 'event:bed-delivery'] },
  { label: 'Alice build', emoji: '🛠', tags: ['event:alice-build'] },
  { label: 'Oonchiumpa young people', emoji: '👥', tags: ['participant:oonchiumpa-young-people'] },
  { label: 'May 2026 trip', emoji: '📅', tags: ['trip:may-2026'] },
  { label: 'Batch 156', emoji: '📦', tags: ['batch:156'] },
];

export const metadata = {
  title: "How It's Made",
  description:
    'From recycled plastic to a Stretch Bed in a remote home: collection, pressing, CNC cutting, leg-forming, community assembly, on-country delivery.',
  alternates: {
    canonical: 'https://www.goodsoncountry.com/process',
  },
  openGraph: {
    title: 'How a Stretch Bed is Made · Goods on Country',
    description:
      'Recycled plastic, On-Country pressing, CNC cutting, hydraulic-pressed legs, and community assembly. Every Stretch Bed is built, not bought.',
    url: 'https://www.goodsoncountry.com/process',
    images: [
      {
        url: 'https://www.goodsoncountry.com/images/process/container-factory.jpg',
        width: 1200,
        height: 900,
        alt: 'On-country containerised production plant',
      },
    ],
  },
};

type Step = {
  step: number;
  label: string;
  title: string;
  body: string;
  hero: { src: string; alt: string };
  /** Up to 3 supporting media tiles. Photos render as Image; videos as muted autoplay loops. */
  supporting: Array<{ src: string; alt: string; kind?: 'photo' | 'video' }>;
  /** Optional inline video that takes the place of the hero photo. */
  video?: { src: string; poster: string };
};

const STEPS: Step[] = [
  {
    step: 1,
    label: 'Collect',
    title: 'Plastic in. Chip out.',
    body: 'We collect plastic from communities and sites where it would otherwise become waste. It goes into the shredder, comes out as chip, and that chip is what gets pressed into the sheet the leg is cut from.',
    hero: { src: '/images/process/shredded-plastic-tubs.jpg', alt: 'Tubs of sorted recycled HDPE plastic ready for shredding' },
    supporting: [
      { src: '/images/process/shredder-granulator.jpg', alt: 'Industrial granulator shredding HDPE into chip' },
      { src: '/images/process/shredder-output-tub.jpg', alt: 'Tub of freshly shredded HDPE chip coming out of the granulator' },
      { src: '/images/process/shredded-chips-weighed.jpg', alt: 'Shredded plastic chip on a scale ready to be weighed' },
    ],
  },
  {
    step: 2,
    label: 'Press',
    title: 'Shredded chip becomes solid sheet',
    body: 'The chip goes into a heat press inside the containerised factory. Under heat and pressure the HDPE fuses into a dense, weather-resistant sheet ready to be cut. Press cycles are timed and monitored. Nothing leaves the container until the sheet passes a finger-test for warp and finish.',
    hero: { src: '/images/process/heat-press-detail.jpg', alt: 'Close-up of the HDPE heat press inside the production container' },
    supporting: [
      { src: '/images/process/pressed-sheets-stacked.jpg', alt: 'Stacked pressed HDPE sheets fresh from the heat press' },
      { src: '/images/process/heat-press-full.jpg', alt: 'Full view of the heat press during a press cycle' },
      { src: '/images/process/sheets-edge-view.jpg', alt: 'Edge view of a pressed HDPE sheet showing thickness' },
    ],
    video: {
      src: '/video/recycling-plant-desktop.mp4',
      poster: '/video/recycling-plant-poster.jpg',
    },
  },
  {
    step: 3,
    label: 'Cut',
    title: 'CNC-precise leg blanks',
    body: 'A pressed sheet goes onto a 4&times;8 CNC router bed. BlueCarve software steps each cut to nest leg blanks against the sheet so off-cuts go back into the chip stream. Same plastic. Two or three more presses out of the same batch.',
    hero: { src: '/images/process/cnc-cutting-closeup.jpg', alt: 'Close-up of a CNC router cutting an HDPE leg blank' },
    supporting: [
      { src: '/images/process/cnc-router-head.jpg', alt: 'CNC router head mid-cut on a pressed HDPE sheet' },
      { src: '/images/process/cnc-software.jpg', alt: 'BlueCarve CNC control software nesting bed-leg cuts' },
      { src: '/images/process/cnc-sheet-loaded.jpg', alt: 'A pressed HDPE sheet loaded onto the CNC bed ready to cut' },
    ],
  },
  {
    step: 4,
    label: 'Finish',
    title: 'Edges smoothed, drilled by hand',
    body: 'Once the legs are cut, the edges get smoothed with a bull-nose router. Then the young people from Oonchiumpa drill the holes and fit the screws and bolts that hold each leg together. By the time the parts ship, they’re ready to click together in a remote community in five minutes flat.',
    hero: { src: '/images/process/bull-nose-router.jpg', alt: 'A bull-nose router smoothing the edges of a CNC-cut Stretch Bed leg' },
    supporting: [
      { src: '/images/process/cnc-tools-drill.jpg', alt: 'Drilling tools laid out at the workstation' },
      { src: '/images/process/joey-portrait.jpg', alt: 'A young person from the Oonchiumpa team in the production workstation' },
      { src: '/images/process/parts-rack-workarea.jpg', alt: 'Workstation parts rack with sorted leg components ready for assembly' },
    ],
  },
  {
    step: 5,
    label: 'Assemble',
    title: 'Built by the people who use it',
    body: 'Two galvanised steel poles thread through canvas sleeves. Four recycled-plastic legs click onto the poles. No tools, no fasteners, under five minutes. The Stretch Bed is designed so the person who lives with it is the person who assembles it, and so a kid can rebuild it next time the family moves house.',
    // hero + supporting are replaced at request time with live EL photos
    // from the Alice Springs May 2026 build (event:alice-build). Local
    // values stay as a fallback if EL is unreachable.
    hero: { src: '/images/product/stretch-bed-kids-building.jpg', alt: 'Young people building a Stretch Bed in Alice Springs, May 2026' },
    supporting: [
      { src: '/images/product/stretch-bed-assembly.jpg', alt: 'Stretch Bed assembly in progress' },
      { src: '/images/product/stretch-bed-community.jpg', alt: 'Stretch Bed being built with community' },
      { src: '/images/product/stretch-bed-detail.jpg', alt: 'Detail of a finished Stretch Bed' },
    ],
    video: {
      src: '/video/building-together-desktop.mp4',
      poster: '/video/building-together-poster.jpg',
    },
  },
  {
    step: 6,
    label: 'Land',
    title: 'In a home, on Country',
    body: 'Beds travel by road train and barge to remote communities across the Northern Territory, Queensland and Western Australia. Every Stretch Bed is logged under a QR code that links to a public field-note: where it landed, who unpacked it, what the family said. The work is traceable from chip to canvas.',
    hero: { src: '/images/product/stretch-bed-in-use.jpg', alt: 'A finished Stretch Bed in use inside a remote-community home' },
    supporting: [
      { src: '/images/product/stretch-bed-community.jpg', alt: 'Stretch Bed in a community setting' },
      { src: '/images/product/stretch-bed-assembled.jpg', alt: 'Stretch Bed assembled and ready for use' },
      { src: '/images/product/stretch-bed-hero.jpg', alt: 'The Stretch Bed: recycled plastic legs, steel poles, canvas' },
    ],
  },
];

const PLANT_GALLERY = [
  { src: '/images/process/containers-wide-angle.jpg', alt: 'Wide-angle view of the containerised production facility' },
  { src: '/images/process/workstation-container.jpg', alt: 'Workstation inside one of the production containers' },
  { src: '/images/process/factory-panorama.jpg', alt: 'Panorama of the on-country production plant' },
];

export default async function ProcessPage() {
  // Pull live Alice Springs May 2026 build photos from Empathy Ledger.
  // First photo becomes the step-5 hero behind the video controls; the
  // next three populate the supporting grid. If EL is unreachable the
  // local fallbacks defined in STEPS[4] kick in.
  const elBuildPhotos = await fetchBuildPhotos(
    ['trip:may-2026', 'event:alice-build', 'product:stretch-bed'],
    4,
  );

  // Admin detection — same pattern as /field-notes/[slug]: any signed-in
  // user (or anyone on local dev) gets the in-place swap widget overlaid
  // on every media slot. Public visitors see the same photos but no chrome.
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLocalDev = process.env.NODE_ENV !== 'production';
  const canSwap = !!user || isLocalDev;

  // Apply manual overrides from data/field-note-overrides.json (slug='process').
  // Keys are dot paths into the resolved steps array, e.g.:
  //   steps.4.hero  -> step 5 (index 4) hero photo URL
  //   steps.4.supporting.0 -> first supporting photo for step 5
  const overrides = getStoryOverrides(OVERRIDE_SLUG);
  const steps: Step[] = STEPS.map((s, idx) => {
    let next = s;
    // 1. EL auto-fill for step 5 (Alice build) — happens first so manual
    //    swaps still win over the dynamic fetch below.
    if (s.step === 5 && elBuildPhotos.length > 0) {
      const [hero, ...rest] = elBuildPhotos;
      const supporting = rest.length >= 3
        ? rest.slice(0, 3).map((p) => ({ src: p.src, alt: p.alt }))
        : s.supporting;
      next = {
        ...s,
        hero: hero ? { src: hero.src, alt: hero.alt } : s.hero,
        supporting,
      };
    }
    // 2. Layer manual overrides on top.
    const heroOverride = overrides[`steps.${idx}.hero`];
    if (heroOverride) {
      next = { ...next, hero: { ...next.hero, src: heroOverride } };
    }
    const supporting = next.supporting.map((tile, j) => {
      const o = overrides[`steps.${idx}.supporting.${j}`];
      return o ? { ...tile, src: o } : tile;
    });
    next = { ...next, supporting };
    return next;
  });

  return (
    <main>
      {/* ============================================================
         HERO with background video
         ============================================================ */}
      <section className="relative isolate overflow-hidden bg-foreground text-background">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-50"
          src="/video/recycling-plant-desktop.mp4"
          poster="/video/recycling-plant-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/60 to-foreground/85" />
        <div className="relative container mx-auto px-4 py-24 md:py-36">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.25em] text-background/70 mb-5">
              How it&rsquo;s made
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] mb-6">
              From recycled plastic to a bed in a remote home.
            </h1>
            <p className="text-lg md:text-xl text-background/85 mb-8 leading-relaxed max-w-2xl">
              Plastic gathered on Country. Pressed and cut inside a shipping-container factory.
              Built in five minutes by the family who&rsquo;ll sleep on it.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link href="#step-5">Watch the build &darr;</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent text-background border-background/40 hover:bg-background/10">
                <Link href="/shop/stretch-bed-single">Shop the Stretch Bed</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
         STATS STRIP
         ============================================================ */}
      <section className="bg-accent py-10">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold text-accent-foreground">20kg</div>
              <div className="text-sm text-accent-foreground/80 mt-1">Recycled HDPE per bed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-foreground">5 min</div>
              <div className="text-sm text-accent-foreground/80 mt-1">Assembly, no tools</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-foreground">200kg</div>
              <div className="text-sm text-accent-foreground/80 mt-1">Load capacity</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent-foreground">10+ yrs</div>
              <div className="text-sm text-accent-foreground/80 mt-1">Design life</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
         SIX STEPS
         ============================================================ */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-20 md:space-y-28">
            {steps.map((step, idx) => {
              const stepTagQuery = STEP_TAG_QUERIES[step.step] || ['product:stretch-bed'];
              return (
              <article
                key={step.step}
                id={`step-${step.step}`}
                className="scroll-mt-16 grid gap-8 md:grid-cols-12 md:gap-12 items-start"
              >
                {/* Step label + text (5 columns on md) */}
                <div className="md:col-span-5 md:sticky md:top-20">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {step.step}
                    </span>
                    <span className="text-xs uppercase tracking-[0.25em] text-accent font-semibold">
                      {step.label}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight"
                      dangerouslySetInnerHTML={{ __html: step.title }}
                  />
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {step.body}
                  </p>
                </div>

                {/* Media (7 columns on md) */}
                <div className="md:col-span-7 space-y-3">
                  {/* Hero slot: video if provided, otherwise the hero photo */}
                  {step.video ? (
                    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted shadow-sm">
                      <video
                        className="absolute inset-0 h-full w-full object-cover"
                        src={step.video.src}
                        poster={step.video.poster}
                        controls
                        preload="metadata"
                        playsInline
                      />
                    </div>
                  ) : (
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted shadow-sm">
                      <Image
                        src={step.hero.src}
                        alt={step.hero.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 60vw"
                        className="object-cover"
                      />
                      {canSwap && (
                        <MediaSwapZone
                          slug={OVERRIDE_SLUG}
                          overrideKey={`steps.${idx}.hero`}
                          currentUrl={step.hero.src}
                          tagQuery={stepTagQuery}
                          kind="photo"
                          label={`swap step ${step.step} hero`}
                          broadTag="product:stretch-bed"
                          folders={GOODS_PHOTO_FOLDERS}
                        />
                      )}
                    </div>
                  )}

                  {/* 3-photo grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {step.supporting.map((tile, j) => (
                      <div
                        key={`${idx}-${j}-${tile.src}`}
                        className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted"
                      >
                        <Image
                          src={tile.src}
                          alt={tile.alt}
                          fill
                          sizes="(max-width: 768px) 33vw, 20vw"
                          className="object-cover"
                        />
                        {canSwap && (
                          <MediaSwapZone
                            slug={OVERRIDE_SLUG}
                            overrideKey={`steps.${idx}.supporting.${j}`}
                            currentUrl={tile.src}
                            tagQuery={stepTagQuery}
                            kind="photo"
                            label="swap"
                            broadTag="product:stretch-bed"
                            folders={GOODS_PHOTO_FOLDERS}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
         ON-COUNTRY PRODUCTION PLANT
         ============================================================ */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="max-w-2xl mb-10">
              <p className="text-xs uppercase tracking-[0.25em] text-accent mb-3">
                Production
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
                A factory inside a shipping container.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The plant is designed to lift, move and re-deploy. Two 20-foot containers hold the
                shredder, the heat press, the CNC router and the workstation. Power and water plug
                in. A community can take ownership of the whole production line and run it from
                their own yard.
              </p>
            </div>

            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-muted shadow-sm mb-4">
              <Image
                src="/images/process/container-factory.jpg"
                alt="Containerised production plant on country"
                fill
                sizes="(max-width: 1024px) 100vw, 1000px"
                className="object-cover"
                priority={false}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {PLANT_GALLERY.map((tile) => (
                <div
                  key={tile.src}
                  className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted"
                >
                  <Image
                    src={tile.src}
                    alt={tile.alt}
                    fill
                    sizes="(max-width: 768px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
         MADE BY COMMUNITY — closing band with full-bleed video
         ============================================================ */}
      <section className="relative isolate overflow-hidden bg-foreground text-background">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-50"
          src="/video/building-together-desktop.mp4"
          poster="/video/building-together-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/50 via-foreground/65 to-foreground/85" />
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-background/70 mb-5">
              The model
            </p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Made by community. Made for community.
            </h2>
            <p
              className="text-2xl md:text-3xl text-background/90 italic leading-snug mb-10"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              &ldquo;When someone asks &lsquo;Who makes these?&rsquo; the answer is
              &lsquo;We do.&rsquo;&rdquo;
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/sponsor">Sponsor a bed</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent text-background border-background/40 hover:bg-background/10">
                <Link href="/partner">Partner with us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
