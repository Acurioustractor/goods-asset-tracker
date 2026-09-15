import Image from 'next/image';
import Link from 'next/link';
import { ORGANISATION } from '@/lib/data/organisation';
import { Hero } from '@/components/marketing';
import { AssemblySequence } from '@/components/pitch/assembly-sequence';
import { CyclingImage } from '@/components/pitch/cycling-image';
import { MediaSlot } from '@/components/ui/media-slot';
import { Button } from '@/components/ui/button';
import { ContactGoodsButton } from '@/components/contact/contact-goods-button';
import { brand } from '@/lib/data/content';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { BUYERS } from '@/lib/data/pitch-chapters';
import { PLASTIC_KG_PER_BED, STRETCH_BED } from '@/lib/data/products';
import { videoUrl } from '@/lib/data/media';
import { canonVideoSrc } from '@/lib/data/canon-videos';
import { FieldNotesTile } from '@/components/marketing/field-notes-tile';
import { getStoryOverrides } from '@/lib/field-notes/overrides';
import { createClient } from '@/lib/supabase/server';
import { MediaSwapZone, type SwapFolder } from '@/components/admin/media-swap-picker';

const HOME_SLUG = 'home';

const POLE_OD = STRETCH_BED.materials.frame.detail.split(' ')[0];

const HOME_FOLDERS: SwapFolder[] = [
  { label: 'All recent', emoji: '🕘', tags: [] },
  { label: 'All Stretch Bed', emoji: '🛏', tags: ['product:stretch-bed'] },
  { label: 'Alice build', emoji: '🛠', tags: ['event:alice-build'] },
  { label: 'Utopia delivery', emoji: '🏠', tags: ['community:utopia-homelands', 'event:bed-delivery'] },
  { label: 'Oonchiumpa young people', emoji: '👥', tags: ['participant:oonchiumpa-young-people'] },
  { label: 'May 2026 trip', emoji: '📅', tags: ['trip:may-2026'] },
];

/** The three ways in. Every visitor should find theirs before they scroll. */
const DOORS = [
  {
    href: '/beds',
    kicker: 'For homes and organisations',
    title: 'Buy beds',
    line: 'One bed online, or a quote and invoice for your organisation.',
    photo: { src: '/images/product/stretch-bed-hero.jpg', alt: 'A Stretch Bed on Country in golden light' },
  },
  {
    href: '/facilities',
    kicker: 'For communities',
    title: 'Make beds in your community',
    line: 'What a local production facility takes, and what it brings.',
    photo: { src: '/images/community/maningrida/gamardi-build-day-wide.jpg', alt: 'Build day at Gamardi in the Maningrida homelands' },
  },
  {
    href: '/partner',
    kicker: 'For funders and supporters',
    title: 'Back the work',
    line: 'Grants, gifts and loans, and what each one pays for.',
    photo: { src: '/images/community/maningrida/kids-carrying-orange-bed.jpg', alt: 'Two young people carrying an orange Stretch Bed at Gamardi' },
  },
] as const;

const PROOF = [
  { value: CANONICAL_ASSETS.bedsDeployed.toLocaleString(), label: 'beds delivered' },
  { value: String(CANONICAL_ASSETS.communitiesServed), label: 'communities' },
  { value: `${CANONICAL_ASSETS.plasticKg.toLocaleString()}kg`, label: 'plastic diverted' },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLocalDev = process.env.NODE_ENV !== 'production';
  const canSwap = !!user || isLocalDev;

  const overrides = getStoryOverrides(HOME_SLUG);
  const ov = (key: string, fallback: string) => overrides[key] || fallback;
  return (
    <>
      <Hero
        title={brand.hero.home.headline}
        subtitle={`${brand.hero.home.subheadline} ${CANONICAL_ASSETS.bedsDeployed} beds are in ${CANONICAL_ASSETS.communitiesServed} communities, and the making is moving closer to the people who use them.`}
        primaryCta={{ text: 'Buy beds', href: '/beds' }}
        secondaryCta={{ text: 'Back the work', href: '/partner' }}
        videoSrc={canonVideoSrc('video-hero', {
          desktop: videoUrl('hero-desktop.mp4'),
          mobile: videoUrl('hero-mobile.mp4'),
          poster: '/video/hero-poster.jpg',
        })}
        imageSrc="/images/media-pack/lying-on-stretch-bed.jpg"
        imageAlt="A young man lying full-length on a Stretch Bed on country: recycled plastic legs, galvanised steel poles, heavy-duty canvas"
      />

      {/* Three ways in, and who you are dealing with, before anything else. */}
      <section id="ways-in" aria-label="Ways in" className="relative z-10 bg-goods-cream px-4 pb-10 pt-5 md:pb-14 md:pt-0">
        <div className="container mx-auto">
          <ul className="grid gap-3 md:-mt-10 md:grid-cols-3 md:gap-5">
            {DOORS.map((door) => (
              <li key={door.href}>
                <Link
                  href={door.href}
                  className="group grid h-full grid-cols-[96px_1fr] overflow-hidden rounded-[20px] border border-[#e6dfd1] bg-white shadow-[0_10px_30px_-18px_rgba(40,30,20,0.35)] transition-colors hover:border-goods-terracotta md:grid-cols-1"
                >
                  <div className="relative min-h-[112px] md:aspect-[16/9] md:min-h-0">
                    <Image src={door.photo.src} alt={door.photo.alt} fill sizes="(min-width: 768px) 33vw, 96px" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </div>
                  <div className="flex flex-col justify-center p-4 md:p-6">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-goods-terracotta md:text-[11px]">{door.kicker}</span>
                    <span className="mt-1 font-display text-xl font-semibold leading-tight text-goods-ink md:mt-2 md:text-2xl">
                      {door.title} <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </span>
                    <span className="mt-1 text-sm leading-snug text-[#4a4741] md:mt-2 md:text-[15px] md:leading-relaxed">{door.line}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-[#5d574c]">
            {ORGANISATION.boardLine} {ORGANISATION.identityLine}{' '}
            <Link href="/who-we-are" className="underline underline-offset-2 hover:text-goods-terracotta">Who we are</Link>
          </p>
        </div>
      </section>

      {/* What has happened so far: the trade, and who paid. */}
      <section aria-label="So far" className="border-y border-[#e6dfd1] bg-white px-4 py-12 md:py-16">
        <div className="container mx-auto grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-goods-terracotta">So far</p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-goods-ink md:text-4xl">{BUYERS.headline}</h2>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#4a4741]">
              Bought by {BUYERS.rows.slice(0, -1).map((r) => r.buyer).join('; ')}; and {BUYERS.rows[BUYERS.rows.length - 1].buyer}.
            </p>
            <Link href="/beds#order" className="mt-5 inline-block text-[15px] font-semibold text-goods-terracotta underline underline-offset-4 hover:text-goods-ink">
              Order for your organisation →
            </Link>
          </div>
          <dl className="grid grid-cols-3 gap-4 border-t border-[#e6dfd1] pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            {PROOF.map((p) => (
              <div key={p.label}>
                <dt className="sr-only">{p.label}</dt>
                <dd className="font-display text-3xl font-semibold text-goods-ink md:text-5xl">{p.value}</dd>
                <dd className="mt-1 text-xs leading-snug text-[#5d574c] md:text-sm">{p.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 text-sm uppercase tracking-widest text-accent">The Stretch Bed</p>
            <h2
              className="mb-4 text-3xl font-light leading-snug text-foreground md:text-4xl"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              Recycled plastic legs, steel poles, and a canvas that holds it all together.
            </h2>
            <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
              {STRETCH_BED.specs.weight}, holds {STRETCH_BED.specs.loadCapacity}, and flat-packs for freight. Each bed keeps {PLASTIC_KG_PER_BED}kg of plastic out of landfill.
            </p>
            <div className="mb-12 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild><Link href="/beds">Buy beds</Link></Button>
              <Button size="lg" variant="outline" asChild><Link href="/shop/stretch-bed-single">See the bed up close</Link></Button>
            </div>

            <div className="grid items-start gap-12 lg:grid-cols-2">
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    key: 'materials.0',
                    fallback: '/images/pitch/bed-frame-legs.jpg',
                    alt: 'Recycled HDPE plastic legs, pressed from community waste',
                    label: 'Recycled plastic legs',
                    title: 'Recycled plastic legs',
                    body: `Pressed from community plastic. ${PLASTIC_KG_PER_BED}kg a bed.`,
                  },
                  {
                    key: 'materials.1',
                    fallback: '/images/pitch/bed-poles.jpg',
                    alt: `Galvanised steel pole, ${POLE_OD} OD`,
                    label: 'Steel pole',
                    title: 'Galvanised steel poles',
                    body: `Two ${POLE_OD} poles thread through the canvas sleeves.`,
                  },
                  {
                    key: 'materials.2',
                    fallback: '/images/pitch/bed-canvas.jpg',
                    alt: 'Heavy-duty canvas',
                    label: 'Canvas',
                    title: 'Heavy-duty canvas',
                    body: 'Washable and repairable, made for remote conditions.',
                  },
                  {
                    key: 'materials.3',
                    fallback: '/images/media-pack/nic-with-elder-on-verandah.jpg',
                    alt: 'Nic sitting on a Stretch Bed with an elder on a verandah',
                    label: 'After it arrives',
                    title: 'After it arrives',
                    body: 'Every bed is on our public register, and we answer when something needs fixing.',
                  },
                ].map((card) => {
                  const src = ov(card.key, card.fallback);
                  return (
                    <div key={card.key} className="overflow-hidden rounded-xl border border-border bg-muted/30">
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
                        <h3 className="mb-0.5 text-sm font-semibold text-foreground">{card.title}</h3>
                        <p className="text-xs text-muted-foreground">{card.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div><AssemblySequence /></div>
            </div>
          </div>
        </div>
      </section>

      {(() => {
        const videoDesktop = ov('feature-video.videoDesktop', '/video/building-together-desktop.mp4');
        const videoMobile = ov('feature-video.videoMobile', '/video/building-together-mobile.mp4');
        const poster = ov('feature-video.poster', '/video/building-together-poster.jpg');
        const overrideImage = overrides['feature-video.image'];
        return (
          <section className="relative isolate overflow-hidden bg-foreground">
            {overrideImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={overrideImage} alt="Beds assembled on Country" className="absolute inset-0 h-full w-full object-cover opacity-70" />
            ) : (
              <>
                <video className="absolute inset-0 hidden h-full w-full object-cover opacity-70 sm:block" src={videoDesktop} poster={poster} autoPlay muted loop playsInline />
                <video className="absolute inset-0 h-full w-full object-cover opacity-70 sm:hidden" src={videoMobile} poster={poster} autoPlay muted loop playsInline />
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/40 to-foreground/70" />
            <div className="relative container mx-auto px-4 py-24 md:py-32">
              <div className="mx-auto max-w-3xl text-center text-background">
                <h2 className="text-3xl font-light leading-tight md:text-5xl" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
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

      <section className="bg-foreground py-16 text-background md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 text-sm uppercase tracking-widest text-background/40">Making in community</p>
            <h2 className="mb-4 text-3xl font-light leading-snug md:text-4xl" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
              From rubbish to bed
            </h2>
            <p className="mb-12 max-w-2xl text-background/60">
              A production plant in a shipping container turns community plastic into bed legs. Local people do the making.
            </p>

            <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <ProcessCard number="1" title="Collect" body="Plastic is gathered from around community, sorted by colour and cleaned for the shredder.">
                <MediaSlot src="/images/process/color-samples.jpg" alt="Sorted recycled plastic from community waste" label="Collect" aspect="4/3" />
              </ProcessCard>
              <ProcessCard number="2" title="Shred" body="The shredder lives in the container and stays on site between production runs.">
                <MediaSlot src="/images/process/container-factory.jpg" alt="Plastic shredder inside containerised production plant" label="Shred" aspect="4/3" />
              </ProcessCard>
              <ProcessCard number="3" title="Press" body="Shredded plastic is heated and pressed into sheets. The colour comes from whatever plastic the community collected.">
                <CyclingImage images={[
                  { src: '/images/process/hydraulic-press.jpg', alt: 'Hydraulic press compressing recycled plastic into sheets' },
                  { src: '/images/process/pressed-sheets.jpg', alt: 'Stack of pressed recycled plastic legs in multiple colours' },
                ]} aspect="4/3" />
              </ProcessCard>
              <ProcessCard number="4" title="Cut" body="A CNC router cuts the bed legs from the pressed sheets with very little waste.">
                <MediaSlot src="/images/process/cnc-cutter.jpg" alt="CNC router cutting bed leg components from pressed plastic sheet" label="Cut" aspect="4/3" />
              </ProcessCard>
              <ProcessCard number="5" title="Assemble" body="Thread a pole through each canvas sleeve and the X-leg holes, then tension. About five minutes, no tools.">
                <CyclingImage images={[
                  { src: '/images/pitch/bed-seq-1-leg-pole.jpg', alt: 'First pole threads through canvas sleeve' },
                  { src: '/images/pitch/bed-seq-2-legs-pole.jpg', alt: 'Second pole through the other side' },
                  { src: '/images/pitch/bed-seq-3-all-parts.jpg', alt: 'Both poles thread through the X-leg holes' },
                  { src: '/images/pitch/bed-assembled.jpg', alt: 'Assembled Stretch Bed' },
                ]} aspect="4/3" />
              </ProcessCard>
              <Link
                href="/facilities"
                className="group flex flex-col justify-end rounded-xl border border-background/20 bg-goods-terracotta/90 p-6 transition-colors hover:bg-goods-terracotta"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-background/70">For communities</span>
                <span className="mt-2 font-display text-2xl font-semibold leading-tight text-background">
                  How a facility comes to your community <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <Image src="/images/partners/oonchiumpa.png" alt="Oonchiumpa Consultancy" width={560} height={350} className="h-12 w-auto sm:h-14" />
                <span aria-hidden className="text-2xl text-muted-foreground/40">×</span>
                <span className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Goods on Country</span>
              </div>
              <p className="mb-4 text-sm uppercase tracking-widest text-accent">Designed in community</p>
              <h2 className="mb-5 text-3xl font-light leading-snug text-foreground md:text-4xl" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
                Learning alongside the Bloomfield family
              </h2>
              <p className="mb-7 text-lg leading-relaxed text-muted-foreground">
                Oonchiumpa Consultancy is a 100% Aboriginal-owned business in Alice Springs. Elders, young people and the Goods team have pulled Stretch Bed prototypes apart and changed them together, and Oonchiumpa held the build for Centrecorp&rsquo;s beds for the Utopia homelands.
              </p>
              <blockquote className="mb-7 border-l-4 pl-5 text-lg italic leading-relaxed text-foreground/85" style={{ borderColor: 'var(--color-accent, #8B9D77)', fontFamily: 'Georgia, serif' }}>
                “We want to create a safe space for our young people. There’s a lack of housing, which leads to a lack of sleep, which leads to low school attendance.”
                <footer className="mt-2 font-sans text-sm not-italic text-muted-foreground">Kristy Bloomfield, Director, Oonchiumpa Consultancy</footer>
              </blockquote>
              <Button asChild size="lg"><Link href="/partners/oonchiumpa">See the Oonchiumpa partnership →</Link></Button>
            </div>

            <div className="space-y-3">
              {(() => {
                const heroSrc = ov('oonchiumpa.hero', '/images/product/stretch-bed-kids-building.jpg');
                return (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-muted shadow-sm">
                    <Image src={heroSrc} alt="The Oonchiumpa team with a Stretch Bed at the Alice Springs production facility" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                    {canSwap && (
                      <MediaSwapZone slug={HOME_SLUG} overrideKey="oonchiumpa.hero" currentUrl={heroSrc} tagQuery={['participant:oonchiumpa-young-people']} kind="photo" label="swap" broadTag="product:stretch-bed" folders={HOME_FOLDERS} />
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
                      <Image src={src} alt={t.alt} fill sizes="(max-width: 768px) 33vw, 17vw" className="object-cover" />
                      {canSwap && (
                        <MediaSwapZone slug={HOME_SLUG} overrideKey={t.key} currentUrl={src} tagQuery={['product:stretch-bed']} kind="photo" label="swap" broadTag="product:stretch-bed" folders={HOME_FOLDERS} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FieldNotesTile />

      <section className="bg-goods-ink px-4 py-16 text-background md:py-20">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold leading-tight md:text-4xl">Beds for your community, or your organisation.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-background/75">
            {BUYERS.who.split('.')[0]} have bought them. Tell us where the beds are going and we will quote the freight.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="min-h-12 rounded-full bg-background px-8 text-foreground hover:bg-background/90" asChild>
              <Link href="/beds">Buy beds</Link>
            </Button>
            <ContactGoodsButton label="Talk to us" variant="solid" subject="Bulk Order Inquiry" className="min-h-12 px-8 text-base" />
          </div>
        </div>
      </section>
    </>
  );
}

function ProcessCard({ number, title, body, children }: {
  number: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-background/10 bg-background/5">
      {children}
      <div className="p-5">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{number}</div>
          <h3 className="text-lg font-semibold text-background">{title}</h3>
        </div>
        <p className="text-sm leading-relaxed text-background/60">{body}</p>
      </div>
    </div>
  );
}
