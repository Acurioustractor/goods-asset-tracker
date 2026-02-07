import Link from 'next/link';
import Image from 'next/image';
import { brand, story, quotes, communityPartnerships, videoTestimonials } from '@/lib/data/content';
import { media, videoUrl } from '@/lib/data/media';
import { empathyLedger } from '@/lib/empathy-ledger';
import { MediaSlot, VideoSlot } from '@/components/ui/media-slot';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Story | Goods on Country',
  description: 'How a question about preventable disease became a movement for community ownership. The Goods on Country story, from floor to bed, from charity to commerce.',
};

const normanQuote = quotes.find(q => q.author === 'Norman Frank' && q.theme === 'community-need');
const dignityQuote = quotes.find(q => q.author === 'Alfred Johnson');
const healthQuote = quotes.find(q => q.author === 'Jessica Allardyce');
const codesignQuote = quotes.find(q => q.author === 'Dianne Stokes');

// ─── Video slots ───────────────────────────────────────────
// Cut from raw footage in /media/raw/
// Hero + Stretch Bed + Building Together from "Stretch Bed Overlay.mp4"
// Jaquilane testimony from "Jaquilane mum full.mp4"
const STORY_VIDEOS = {
  // Hero: community people arriving + assembling beds (0:20-1:20 from Stretch Bed Overlay)
  heroCommunity: {
    desktop: videoUrl('community-desktop.mp4'),
    mobile: videoUrl('community-mobile.mp4'),
    poster: '/video/community-poster.jpg',
  },
  // Stretch Bed: close-up assembly/weave detail (1:10-2:30 from Stretch Bed Overlay)
  stretchBed: {
    desktop: videoUrl('stretch-bed-desktop.mp4'),
    mobile: videoUrl('stretch-bed-mobile.mp4'),
    poster: '/video/stretch-bed-poster.jpg',
  },
  // Young person helping build: group building (0:35-1:10 from Stretch Bed Overlay)
  buildingTogether: {
    desktop: videoUrl('building-together-desktop.mp4'),
    mobile: videoUrl('building-together-mobile.mp4'),
    poster: '/video/building-together-poster.jpg',
  },
  // Jaquilane: overlay background (silent, 0:05-0:35 from Jaquilane mum full)
  jaquilaneOverlay: {
    desktop: videoUrl('jaquilane-overlay-desktop.mp4'),
    mobile: videoUrl('jaquilane-overlay-mobile.mp4'),
    poster: '/video/jaquilane-poster.jpg',
  },
  // Jaquilane: full testimony with audio (0:10-2:10 from Jaquilane mum full)
  jaquilaneTestimony: videoUrl('jaquilane-testimony.mp4'),
  washingMachine: undefined as string | undefined,      // Replace with washing machine background video
  projectStats: undefined as string | undefined,         // Full-page stats overlay video
  dianneStokes: undefined as string | undefined,         // Dianne Stokes washing machine video (Descript)
  // Recycling plant: containerised factory footage (0:00-0:50 from recycling gear.mp4)
  recyclingPlant: {
    desktop: videoUrl('recycling-plant-desktop.mp4'),
    mobile: videoUrl('recycling-plant-mobile.mp4'),
    poster: '/video/recycling-plant-poster.jpg',
  },
  cliffPlummer: videoTestimonials[0]?.embedUrl,           // Cliff Plummer — beds and dignity
};

// ─── Photo gallery slots ───────────────────────────────────
// These define the initial photo sets for product detail sections.
// The "Add photo" button in each section links to an admin upload flow.
const STRETCH_BED_PHOTOS = [
  { src: media.product.stretchBedHero, alt: 'Stretch Bed alone at golden hour showing recycled plastic X-legs', label: 'Product shot' },
  { src: media.product.stretchBedInUse, alt: 'Person resting on Stretch Bed in the outback', label: 'In use' },
  { src: media.product.stretchBedAssembly, alt: 'Two people assembling a Stretch Bed together', label: 'Assembly' },
  { src: media.product.stretchBedCommunity, alt: 'Elder woman presenting her new Stretch Bed', label: 'Community' },
];

const WASHING_MACHINE_PHOTOS = [
  { src: media.product.washingMachine, alt: 'Pakkimjalki Kari washing machine with recycled plastic enclosure', label: 'Product shot' },
  { src: media.product.washingMachineName, alt: 'Close-up showing Pakkimjalki Kari name in Warumungu', label: 'Name detail' },
  { src: media.product.washingMachineInstalled, alt: 'Washing machine installed in community laundry', label: 'Installed' },
];

const RECYCLING_PLANT_PHOTOS = [
  { src: media.manufacturing.containerFactory, alt: 'Containerised recycling factory with shredder', label: 'Container factory' },
  { src: media.manufacturing.hydraulicPress, alt: 'Hydraulic press forming recycled plastic sheets', label: 'Press' },
  { src: media.manufacturing.pressedSheets, alt: 'Stack of colorful recycled plastic sheets', label: 'Pressed sheets' },
];

const TIMELINE = [
  { year: '2018', title: 'The Spark', description: 'Nic hears Dr. Bo Remenyi speak about Rheumatic Heart Disease. Entirely preventable, yet children in remote communities are dying from it.' },
  { year: '2020', title: 'The Pattern', description: 'Orange Sky expands to remote communities. Nic sees people without beds, without washing machines, children with skin infections cascading into heart disease.' },
  { year: '2022', title: 'The Question', description: '"What can we actually build that makes a difference?" Goods project kicks off with an advisory session in November.' },
  { year: '2023', title: 'A Curious Tractor', description: 'Organisation formally founded. First bed prototypes developed with the Bloomfield family "around the fire."' },
  { year: '2024', title: '400+ Beds', description: 'Active pilots deliver beds across Palm Island, Tennant Creek, Mt Isa, Kalgoorlie, and more. Community feedback shapes every iteration.' },
  { year: '2025', title: 'Washing Machines', description: 'Pakkimjalki Kari, named in Warumungu language by Elder Dianne Stokes. Commercial-grade, one-button operation. 8+ communities served.' },
];

function PhotoGallery({ photos }: { photos: { src: string | undefined; alt: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {photos.map((photo, i) => (
        <MediaSlot
          key={i}
          src={photo.src}
          alt={photo.alt}
          label={photo.label}
          aspect="4/3"
        />
      ))}
    </div>
  );
}

export default async function StoryPage() {
  // Fetch storyteller profiles from Empathy Ledger for avatar images
  // Fetch all storytellers (239 total) to ensure we match all quote authors
  const storytellers = await empathyLedger.getStorytellers({ limit: 250 });
  const avatarMap: Record<string, string> = {};
  for (const s of storytellers) {
    if (s.avatarUrl) {
      // Normalize name: trim whitespace, collapse multiple spaces
      const normalized = s.displayName.trim().replace(/\s+/g, ' ');
      avatarMap[normalized] = s.avatarUrl;
    }
  }
  return (
    <main>
      <div className="h-screen overflow-y-auto snap-y snap-mandatory story-scroll">

        {/* ════════════════════════════════════════════════════════════════
            1. HERO — Community building video (NOT timelapse)
            ════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center relative overflow-hidden">
          {/* Background video — community people building */}
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={STORY_VIDEOS.heroCommunity.poster}
          >
            <source src={STORY_VIDEOS.heroCommunity.desktop} media="(min-width: 768px)" type="video/mp4" />
            <source src={STORY_VIDEOS.heroCommunity.mobile} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

          <div className="relative z-10 container mx-auto px-4 text-center">
            <p className="text-sm uppercase tracking-widest text-primary mb-6">
              {brand.oneLiner}
            </p>
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-[1.1] max-w-4xl mx-auto"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              Built with communities, not for them.
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Beds, washing machines, and essential goods designed with remote Indigenous communities. Manufactured sustainably, eventually owned by them.
            </p>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
            <svg className="w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            2. THE PROBLEM — Stats
            ════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center" style={{ backgroundColor: '#FDF8F3' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm uppercase tracking-widest text-primary mb-4">The Problem</p>
              <h2
                className="text-3xl md:text-5xl font-light text-foreground mb-10 leading-snug"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                A failure of infrastructure, not culture
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {story.problem.stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                    <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                {story.problem.description}
              </p>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            3. THE VOICE — Norman Frank, full-page image background
            ════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center relative overflow-hidden">
          {/* Full-page Norman Frank portrait */}
          <Image
            src={avatarMap[normanQuote?.author ?? ''] || media.people.normFrank || '/images/people/norman-frank.jpg'}
            alt={normanQuote?.author ?? 'Norman Frank'}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
          <div className="relative z-10 container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <blockquote>
                <p
                  className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-snug mb-8 drop-shadow-lg"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                >
                  &ldquo;{normanQuote?.text}&rdquo;
                </p>
                <footer>
                  <span className="font-medium text-white text-lg drop-shadow-md">{normanQuote?.author}</span>
                  <br />
                  <span className="text-white/70 text-sm">{normanQuote?.context}</span>
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            4. THE ORIGIN — How it started
            ════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center" style={{ backgroundColor: '#FDF8F3' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm uppercase tracking-widest text-primary mb-4">The Origin</p>
              <h2
                className="text-3xl md:text-5xl font-light text-foreground mb-8 leading-snug"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                How a question became a movement
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  In 2018, Nicholas Marchesi attended a health conference where Dr. Bo Remenyi spoke about
                  Rheumatic Heart Disease. Her message was clear: RHD is entirely preventable, yet she was
                  filling out death certificates for children in remote communities.
                </p>
                <p>
                  Combined with his experience at Orange Sky, where he witnessed people without beds,
                  without working washing machines, and children with skin infections that cascade into
                  heart disease, it sparked the question:
                </p>
                <p
                  className="text-2xl md:text-3xl font-light text-foreground"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                >
                  What can we actually build that makes a difference?
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            5. STRETCH BED — Full-page video with overlay
            ════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center relative overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={STORY_VIDEOS.stretchBed.poster}
          >
            <source src={STORY_VIDEOS.stretchBed.desktop} media="(min-width: 768px)" type="video/mp4" />
            <source src={STORY_VIDEOS.stretchBed.mobile} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 container mx-auto px-4 text-center">
            <p className="text-sm uppercase tracking-widest text-primary mb-6">The Stretch Bed</p>
            <h2
              className="text-4xl md:text-6xl font-light text-white mb-6 leading-[1.1]"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              20kg. Supports 200kg.<br />
              No tools. 5 minutes.
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Recycled plastic legs, galvanised steel poles, heavy-duty canvas.
              Each bed diverts 14kg of plastic from landfill.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            5b. STRETCH BED — Detail + photos
            ════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center" style={{ backgroundColor: '#FDF8F3' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <div>
                  <p className="text-sm uppercase tracking-widest text-primary mb-3">Product Detail</p>
                  <h2
                    className="text-3xl md:text-4xl font-light text-foreground mb-6 leading-snug"
                    style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                  >
                    The Stretch Bed
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
                    <p>
                      Two galvanised steel poles thread through heavy-duty Australian canvas.
                      Four legs made from recycled HDPE plastic — collected, shredded, and pressed on country.
                      Each bed diverts 14kg of plastic from landfill.
                    </p>
                    <p>
                      No-tool assembly in 5 minutes. Works inside and outside. Fully washable.
                      Designed with communities, not for them.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="text-center p-4 rounded-xl border border-border bg-background">
                      <div className="text-2xl font-bold text-primary">$600</div>
                      <div className="text-xs text-muted-foreground mt-1">Stretch Bed</div>
                    </div>
                    <div className="text-center p-4 rounded-xl border border-border bg-background">
                      <div className="text-2xl font-bold text-primary">$1,500</div>
                      <div className="text-xs text-muted-foreground mt-1">avg. bed &amp; base in community</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button asChild>
                      <Link href="/shop/stretch-bed-single">Shop Stretch Bed</Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/process">How It&rsquo;s Made</Link>
                    </Button>
                  </div>
                </div>
                <div>
                  <PhotoGallery photos={STRETCH_BED_PHOTOS} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            5c. JAQUILANE — Video overlay: "What the Stretch Bed means"
            ════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center relative overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={STORY_VIDEOS.jaquilaneOverlay.poster}
          >
            <source src={STORY_VIDEOS.jaquilaneOverlay.desktop} media="(min-width: 768px)" type="video/mp4" />
            <source src={STORY_VIDEOS.jaquilaneOverlay.mobile} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 container mx-auto px-4 text-center">
            <p className="text-sm uppercase tracking-widest text-primary mb-6">Community Voice</p>
            <h2
              className="text-3xl md:text-5xl font-light text-white mb-6 leading-snug"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              &ldquo;It&rsquo;s so amazing with just waste&rdquo;
            </h2>
            <p className="text-xl text-white/60 max-w-xl mx-auto">
              Jaquilane, Rupanya woman, Alice Springs. On why the Stretch Bed matters.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            5d. JAQUILANE — Embedded testimony (with audio)
            ════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center bg-foreground text-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm uppercase tracking-widest text-background/40 mb-4 text-center">
                Hear From Jaquilane
              </p>
              <h2
                className="text-2xl md:text-3xl font-light text-center mb-3"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                Jaquilane on the Stretch Bed
              </h2>
              <p className="text-background/50 text-center mb-8">
                Rupanya woman, Alice Springs. On beds made from waste, kids jumping on them, and why they need more.
              </p>
              <div className="aspect-video rounded-xl overflow-hidden bg-black">
                <video
                  className="w-full h-full"
                  controls
                  preload="metadata"
                  poster={STORY_VIDEOS.jaquilaneOverlay.poster}
                >
                  <source src={STORY_VIDEOS.jaquilaneTestimony} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            6. WASHING MACHINE — Full-page video with overlay
            ════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center relative overflow-hidden bg-foreground">
          {/* Background: video if available, otherwise product image or gradient */}
          {STORY_VIDEOS.washingMachine ? (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={STORY_VIDEOS.washingMachine} type="video/mp4" />
            </video>
          ) : media.product.washingMachine ? (
            <Image
              src={media.product.washingMachine}
              alt="Pakkimjalki Kari washing machine"
              fill
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground to-primary/20" />
          )}
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 container mx-auto px-4 text-center">
            <p className="text-sm uppercase tracking-widest text-primary mb-6">Pakkimjalki Kari</p>
            <h2
              className="text-4xl md:text-6xl font-light text-white mb-6 leading-[1.1]"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              A washing machine isn&rsquo;t convenience.<br />
              It&rsquo;s cardiac prevention.
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Named in Warumungu language by Elder Dianne Stokes.
              Commercial-grade Speed Queen base. One-button operation. Built for remote conditions.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            6b. WASHING MACHINE — Detail + photos
            ════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <div>
                  <p className="text-sm uppercase tracking-widest text-primary mb-3">Product Detail</p>
                  <h2
                    className="text-3xl md:text-4xl font-light text-foreground mb-6 leading-snug"
                    style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                  >
                    Pakkimjalki Kari
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
                    <p>
                      Commercial-grade Speed Queen base modified for remote conditions.
                      One-button operation, no complex cycles. Built to last 10-15 years, not 1-2.
                    </p>
                    <p>
                      Clean bedding breaks the scabies cycle. Scabies leads to Rheumatic Heart Disease.
                      The washing machine is a cardiac prevention tool.
                    </p>
                    <p className="text-sm">
                      One Alice Springs provider sells $3M of washing machines annually into communities.
                      Most end up in dumps within 12 months. These communities deserve better.
                    </p>
                  </div>
                  <Button asChild>
                    <Link href="/partner">Register Interest</Link>
                  </Button>
                </div>
                <div>
                  <PhotoGallery photos={WASHING_MACHINE_PHOTOS} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            7. THE JOURNEY — Timeline
            ════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center" style={{ backgroundColor: '#FDF8F3' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <p className="text-sm uppercase tracking-widest text-primary mb-4 text-center">The Journey</p>
              <h2
                className="text-3xl md:text-5xl font-light text-foreground mb-12 text-center leading-snug"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                From question to community
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {TIMELINE.map((item) => (
                  <div key={item.year} className="rounded-xl border border-border p-6 bg-background">
                    <div className="text-2xl font-bold text-primary mb-1">{item.year}</div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            8. COMMUNITY VOICES — Quotes
            ════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <p className="text-sm uppercase tracking-widest text-primary mb-4 text-center">Community Voices</p>
              <h2
                className="text-3xl md:text-5xl font-light text-foreground mb-12 text-center leading-snug"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                The people who shape what we build
              </h2>
              <div className="grid gap-8 md:grid-cols-3">
                {[dignityQuote, healthQuote, codesignQuote].filter(Boolean).map((q) => (
                  <div key={q!.author} className="flex flex-col rounded-2xl border border-border bg-background p-6">
                    <div className="flex items-center gap-3 mb-4">
                      {avatarMap[q!.author] ? (
                        <Image
                          src={avatarMap[q!.author]}
                          alt={q!.author}
                          width={48}
                          height={48}
                          className="rounded-full object-cover w-12 h-12"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-lg font-medium">
                          {q!.author.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-foreground text-sm">{q!.author}</span>
                        <br />
                        <span className="text-xs text-muted-foreground">{q!.context}</span>
                      </div>
                    </div>
                    <blockquote className="flex-1">
                      <p
                        className="text-lg text-foreground leading-relaxed"
                        style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                      >
                        &ldquo;{q!.text}&rdquo;
                      </p>
                    </blockquote>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            8b. BUILDING TOGETHER — Young person helping build
            ════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen snap-start flex items-end relative overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={STORY_VIDEOS.buildingTogether.poster}
          >
            <source src={STORY_VIDEOS.buildingTogether.desktop} media="(min-width: 768px)" type="video/mp4" />
            <source src={STORY_VIDEOS.buildingTogether.mobile} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="relative z-10 w-full pb-16 md:pb-20">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl">
                <p className="text-sm uppercase tracking-widest text-primary mb-3">Building Together</p>
                <h2
                  className="text-3xl md:text-4xl font-light text-white mb-4 leading-snug"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                >
                  Beds aren&rsquo;t delivered.<br />
                  They&rsquo;re assembled together.
                </h2>
                <p className="text-lg text-white/60 max-w-lg">
                  Every delivery is an event. Families gather, young people help assemble,
                  and community grows stronger, one bed at a time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            8c. RECYCLING PLANT — Full-page video overlay
            ════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center relative overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={STORY_VIDEOS.recyclingPlant.poster}
          >
            <source src={STORY_VIDEOS.recyclingPlant.desktop} media="(min-width: 768px)" type="video/mp4" />
            <source src={STORY_VIDEOS.recyclingPlant.mobile} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative z-10 container mx-auto px-4 text-center">
            <p className="text-sm uppercase tracking-widest text-primary mb-6">The Recycling Plant</p>
            <h2
              className="text-4xl md:text-6xl font-light text-white mb-6 leading-[1.1]"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              Local waste into<br />
              local products.
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              A containerised factory that travels to communities. Shred, press, cut.
              Turning plastic waste into bed components on-country.
            </p>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            8d. RECYCLING PLANT — Detail + photos
            ════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center" style={{ backgroundColor: '#FDF8F3' }}>
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid gap-12 lg:grid-cols-2 items-center">
                <div>
                  <p className="text-sm uppercase tracking-widest text-primary mb-3">On-Country Manufacturing</p>
                  <h2
                    className="text-3xl md:text-4xl font-light text-foreground mb-6 leading-snug"
                    style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                  >
                    The Portable Factory
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
                    <p>
                      A fully containerised production plant. Fits in a shipping container, sets up in a day.
                      Shredder, hydraulic press, and CNC cutter turn community plastic waste into precision-cut
                      bed components.
                    </p>
                    <p>
                      Capacity: ~30 beds per week. Each bed diverts 14kg of HDPE plastic from landfill.
                      Local people operate the machinery. Real jobs, real skills, real ownership.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="text-center p-4 rounded-xl border border-border bg-background">
                      <div className="text-2xl font-bold text-primary">30</div>
                      <div className="text-xs text-muted-foreground mt-1">beds/week</div>
                    </div>
                    <div className="text-center p-4 rounded-xl border border-border bg-background">
                      <div className="text-2xl font-bold text-primary">14kg</div>
                      <div className="text-xs text-muted-foreground mt-1">plastic per bed</div>
                    </div>
                    <div className="text-center p-4 rounded-xl border border-border bg-background">
                      <div className="text-2xl font-bold text-primary">1 day</div>
                      <div className="text-xs text-muted-foreground mt-1">to set up</div>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <svg className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span><strong>Shredder</strong>: breaks down collected HDPE plastic into chips</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span><strong>Hydraulic press</strong>: melts and compresses chips into durable sheets</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span><strong>CNC cutter</strong>: precision-cuts bed frame components from sheets</span>
                    </div>
                  </div>
                </div>
                <div>
                  <PhotoGallery photos={RECYCLING_PLANT_PHOTOS} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            9. IMPACT VIDEO — Full-page stats overlay
            ════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center relative overflow-hidden bg-foreground">
          {STORY_VIDEOS.projectStats ? (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src={STORY_VIDEOS.projectStats} type="video/mp4" />
            </video>
          ) : (
            <Image
              src="/video/building-together-poster.jpg"
              alt="Community building together"
              fill
              className="object-cover"
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <p className="text-sm uppercase tracking-widest text-white/40 mb-4 text-center">Impact</p>
              <h2
                className="text-3xl md:text-5xl font-light text-white mb-12 text-center leading-snug"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                This isn&rsquo;t a concept. It&rsquo;s working.
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
                {[
                  { value: '369+', label: 'beds delivered' },
                  { value: '8+', label: 'communities served' },
                  { value: '14kg', label: 'plastic per bed diverted' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-white/50">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {communityPartnerships.filter(p => p.bedsDelivered > 0).map((p) => (
                  <div key={p.id} className="rounded-xl bg-white/5 border border-white/10 p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white">{p.name}</h3>
                        <p className="text-xs text-white/40">{p.region}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">{p.bedsDelivered}</div>
                        <div className="text-xs text-white/40">beds</div>
                      </div>
                    </div>
                    <p className="text-sm text-white/60">{p.highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            10. THE MODEL — Commerce, not charity
            ════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center bg-accent">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-sm uppercase tracking-widest text-accent-foreground/50 mb-4">The Model</p>
              <h2
                className="text-3xl md:text-5xl font-light text-accent-foreground mb-4 leading-snug"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                Commerce, not charity
              </h2>
              <p className="text-lg text-accent-foreground/70 mb-12 max-w-xl mx-auto leading-relaxed">
                Products that are Aboriginal owned and controlled, sold commercially.
                Our job is to become unnecessary.
              </p>
              <div className="grid gap-4 md:grid-cols-3 mb-12">
                <div className="bg-accent-foreground/10 rounded-2xl p-8">
                  <div className="text-5xl font-bold text-accent-foreground mb-2">100%</div>
                  <div className="text-accent-foreground/70">community ownership is the end goal</div>
                </div>
                <div className="bg-accent-foreground/10 rounded-2xl p-8">
                  <div className="text-5xl font-bold text-accent-foreground mb-2">$0</div>
                  <div className="text-accent-foreground/70">licensing fees. They keep everything they make</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            11. CLIFF PLUMMER — Community testimony video
            ════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center bg-foreground text-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm uppercase tracking-widest text-background/40 mb-4 text-center">
                Hear From Community
              </p>
              <h2
                className="text-2xl md:text-3xl font-light text-center mb-3"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                {videoTestimonials[0]?.title || 'Community Voices'}
              </h2>
              <p className="text-background/50 text-center mb-8">
                {videoTestimonials[0]?.person} &middot; {videoTestimonials[0]?.location}
              </p>
              <VideoSlot
                src={STORY_VIDEOS.cliffPlummer}
                label="Community testimony on beds and dignity"
              />
              <p className="text-xs text-background/30 mt-4 text-center">
                {videoTestimonials[0]?.description || 'Video coming soon'}
              </p>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            12. DIANNE STOKES — The washing machine, in her words
            ════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-sm uppercase tracking-widest text-primary mb-4 text-center">
                The Washing Machine Story
              </p>
              <h2
                className="text-2xl md:text-3xl font-light text-foreground text-center mb-3"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                Elder Dianne Stokes
              </h2>
              <p className="text-muted-foreground text-center mb-8 max-w-lg mx-auto">
                She named it &ldquo;Pakkimjalki Kari&rdquo; in Warumungu language. She didn&rsquo;t just
                receive a product. She co-designed it, tested it, and named it for her community.
              </p>
              {STORY_VIDEOS.dianneStokes ? (
                <VideoSlot
                  src={STORY_VIDEOS.dianneStokes}
                  label="Dianne Stokes on the Pakkimjalki Kari washing machine"
                />
              ) : media.people.dianneStokes ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                  <Image
                    src={media.people.dianneStokes}
                    alt="Elder Dianne Stokes"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                  />
                </div>
              ) : null}
              <blockquote className="mt-8 text-center">
                <p
                  className="text-lg text-foreground leading-relaxed"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                >
                  &ldquo;{codesignQuote?.text}&rdquo;
                </p>
                <footer className="flex items-center justify-center gap-3 mt-4">
                  {avatarMap[codesignQuote?.author ?? ''] ? (
                    <Image
                      src={avatarMap[codesignQuote!.author]}
                      alt={codesignQuote!.author}
                      width={40}
                      height={40}
                      className="rounded-full object-cover w-10 h-10"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-medium">
                      {codesignQuote?.author?.charAt(0)}
                    </div>
                  )}
                  <div className="text-left text-sm">
                    <span className="font-medium text-foreground">{codesignQuote?.author}</span>
                    <br />
                    <span className="text-muted-foreground">{codesignQuote?.context}</span>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            13. THE INVITATION — CTA
            ════════════════════════════════════════════════════════════ */}
        <section className="min-h-screen snap-start flex items-center justify-center bg-foreground text-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2
                className="text-3xl md:text-5xl font-light leading-snug mb-8"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                We&rsquo;re not building beds.{' '}
                <span className="text-primary">We&rsquo;re building a model where communities manufacture their own future.</span>
              </h2>
              <p className="text-lg text-background/50 mb-12 max-w-xl mx-auto leading-relaxed">
                Durable products from community waste. Local jobs. Community ownership.
                The disposable furniture cycle ends here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8">
                  <Link href="/sponsor">Sponsor a Bed</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="bg-transparent border-white/50 text-white hover:bg-white/10 hover:text-white text-base px-8">
                  <Link href="/shop">Shop the Collection</Link>
                </Button>
              </div>
              <p className="text-sm text-white/30">
                hi@act.place
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          .story-scroll {
            height: auto !important;
            overflow: visible !important;
            scroll-snap-type: none !important;
          }
          .story-scroll .snap-start {
            min-height: auto !important;
            scroll-snap-align: unset !important;
            page-break-inside: avoid;
          }
          .story-scroll section {
            background: white !important;
            color: black !important;
            padding: 1.5rem 0 !important;
          }
          .story-scroll h1, .story-scroll h2, .story-scroll h3,
          .story-scroll p, .story-scroll li, .story-scroll span,
          .story-scroll blockquote, .story-scroll footer {
            color: black !important;
          }
          .story-scroll video {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
}
