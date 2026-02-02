import { Suspense } from 'react';
import Link from 'next/link';
import { empathyLedger } from '@/lib/empathy-ledger';
import { MediaGallery, MediaGallerySkeleton } from '@/components/empathy-ledger/media-gallery';
import { SyndicationStorytellerCard, SyndicationStorytellerCardSkeleton } from '@/components/empathy-ledger/syndication-storyteller-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { journeyStories, impactStories, videoTestimonials, quotes } from '@/lib/data/content';
import { storyPersonMedia } from '@/lib/data/media';
import { MediaSlot } from '@/components/ui/media-slot';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Stories',
  description: 'Real stories from the communities we serve. Hear directly from families whose lives have been changed by Goods on Country.',
};

// --- Thematic quote groups ---
const themeGroups = [
  {
    id: 'co-design',
    title: 'Co-Design',
    subtitle: 'Built with communities, not for them',
    themes: ['co-design'],
  },
  {
    id: 'health',
    title: 'Health',
    subtitle: 'Beds and washing machines as health hardware',
    themes: ['health'],
  },
  {
    id: 'product-feedback',
    title: 'Product Feedback',
    subtitle: 'What people say about the beds',
    themes: ['product-feedback', 'washing-machine'],
  },
  {
    id: 'community-need',
    title: 'Community Need',
    subtitle: 'Why this work matters',
    themes: ['community-need', 'freight-tax', 'dignity'],
  },
];

// Fetch media gallery from Empathy Ledger
async function MediaFromLedger() {
  try {
    const media = await empathyLedger.getMedia({
      type: 'image',
      elderApproved: true,
      limit: 12
    });

    if (media.length === 0) {
      return null;
    }

    return (
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-accent mb-4">
              Community Gallery
            </p>
            <h2 className="text-3xl font-light text-foreground mb-4" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
              Moments from Country
            </h2>
            <p className="max-w-xl mx-auto text-muted-foreground">
              Elder-approved photos shared by community members
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <MediaGallery media={media} columns={4} showAttribution />
          </div>

          <div className="mt-8 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-muted text-muted-foreground">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>All photos owned and controlled by community storytellers</span>
            </div>
          </div>
        </div>
      </section>
    );
  } catch {
    return null;
  }
}

// Fetch storytellers from Empathy Ledger syndication API (with analysis data)
async function StorytellersFromLedger() {
  try {
    const storytellers = await empathyLedger.getProjectStorytellers({ limit: 6 });

    if (storytellers.length === 0) {
      return null;
    }

    return (
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-accent mb-4">
              Our Storytellers
            </p>
            <h2 className="text-3xl font-light text-foreground mb-4" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
              Community Voices
            </h2>
            <p className="max-w-xl mx-auto text-muted-foreground">
              The people who share their stories own and control their narratives
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {storytellers.map((storyteller) => (
              <SyndicationStorytellerCard
                key={storyteller.id}
                storyteller={storyteller}
                linkTo={`/story?id=${storyteller.id}`}
              />
            ))}
          </div>
        </div>
      </section>
    );
  } catch {
    return null;
  }
}

// Fetch top quotes from project insights
async function TopQuotesFromLedger() {
  try {
    const insights = await empathyLedger.getProjectInsights();

    if (!insights || insights.topQuotes.length === 0) {
      return null;
    }

    return (
      <section className="py-16 md:py-20 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-background/50 mb-4">
              From the Empathy Ledger
            </p>
            <h2 className="text-3xl font-light mb-4" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
              Highest Impact Quotes
            </h2>
            <p className="max-w-xl mx-auto text-background/60">
              The most impactful words from {insights.project.storytellerCount} storytellers
              across {insights.project.transcriptCount} conversations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {insights.topQuotes.slice(0, 6).map((quote, i) => (
              <div
                key={i}
                className="rounded-lg bg-background/5 border border-background/10 p-6"
              >
                <p
                  className="text-lg leading-relaxed text-background/90 mb-4"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                >
                  &ldquo;{quote.text}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-background/60">
                    {quote.storytellerName}
                  </p>
                  {quote.impactScore && (
                    <span className="text-xs text-background/40">
                      Impact: {quote.impactScore.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch {
    return null;
  }
}

function StorytellersLoadingSkeleton() {
  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[1, 2, 3].map((i) => (
            <SyndicationStorytellerCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function StoriesPage() {
  return (
    <main>
      {/* ============================================================
          HERO — Linda Turner's quote as the centrepiece
          ============================================================ */}
      <section className="relative min-h-[70vh] flex items-center bg-foreground text-background overflow-hidden">
        {/* Subtle texture */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)' }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-widest text-background/50 mb-8">
              Community Voices
            </p>

            <blockquote>
              <p
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-10"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                &ldquo;We&rsquo;ve never been asked at what sort of house we&rsquo;d like to live in.&rdquo;
              </p>
              <footer className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-medium">
                  L
                </div>
                <div>
                  <p className="font-medium text-background">Linda Turner</p>
                  <p className="text-sm text-background/60">Tennant Creek, NT</p>
                </div>
              </footer>
            </blockquote>

            <p className="mt-10 text-lg text-background/70 max-w-2xl">
              That&rsquo;s why Goods exists. Every bed, every washing machine, every product
              starts with a conversation — not a catalogue. These are the voices that
              shape what we build.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          STATS BAR
          ============================================================ */}
      <section className="py-6 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '19', label: 'Storytellers', sub: 'across 4 communities' },
              { value: '500+', label: 'Minutes', sub: 'of community feedback' },
              { value: '8+', label: 'Communities', sub: 'across remote Australia' },
              { value: '369+', label: 'Beds Delivered', sub: 'and counting' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                <p className="text-sm font-medium text-primary-foreground/90">{stat.label}</p>
                <p className="text-xs text-primary-foreground/60 mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          JOURNEY STORIES — editorial long-form
          ============================================================ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-accent mb-4">
              Stories
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
              Every Bed Has a Story
            </h2>
            <p className="max-w-xl mx-auto text-muted-foreground">
              Real journeys from the people behind the numbers
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-16">
            {journeyStories.map((story, index) => (
              <article
                key={story.id}
                className={`relative ${index > 0 ? 'pt-16 border-t border-border' : ''}`}
              >
                {/* Theme badge */}
                <Badge variant="outline" className="mb-6 text-xs">
                  {story.theme === 'co-design' && 'Co-Design'}
                  {story.theme === 'health' && 'Health'}
                  {story.theme === 'dignity' && 'Dignity'}
                  {story.theme === 'housing-journey' && 'Housing Journey'}
                  {story.theme === 'washing-machine' && 'Washing Machine'}
                </Badge>

                {/* Pull quote — large */}
                <blockquote className="mb-8">
                  <p
                    className="text-2xl md:text-3xl font-light leading-relaxed text-foreground"
                    style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                  >
                    &ldquo;{story.pullQuote}&rdquo;
                  </p>
                </blockquote>

                {/* Attribution */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium overflow-hidden">
                    {storyPersonMedia[story.id] ? (
                      <img src={storyPersonMedia[story.id]} alt={story.person} className="w-full h-full object-cover" />
                    ) : (
                      story.person[0]
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{story.person}</p>
                    <p className="text-sm text-muted-foreground">{story.location}</p>
                  </div>
                </div>

                {/* Person/context photo — /public/images/people/<name>.jpg */}
                {storyPersonMedia[story.id] && (
                  <div className="mb-8">
                    <MediaSlot
                      src={storyPersonMedia[story.id]}
                      alt={`${story.person} — ${story.location}`}
                      aspect="16/9"
                    />
                  </div>
                )}

                {/* Narrative */}
                <div className="prose prose-stone max-w-none">
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                    {story.narrative}
                  </p>
                </div>

                {/* Supporting quotes */}
                {story.quotes.length > 1 && (
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {story.quotes.map((q, qi) => (
                      <div
                        key={qi}
                        className="rounded-lg bg-muted/50 p-5 border-l-2 border-primary/30"
                      >
                        <p className="text-sm text-foreground italic leading-relaxed">
                          &ldquo;{q.text}&rdquo;
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">{q.context}</p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          VIDEO TESTIMONIAL
          ============================================================ */}
      {videoTestimonials.length > 0 && (
        <section className="py-16 md:py-20 bg-foreground text-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <p className="text-sm uppercase tracking-widest text-background/50 mb-4">
                  Video
                </p>
                <h2 className="text-3xl font-light mb-4" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
                  Hear from Community
                </h2>
              </div>

              {videoTestimonials.map((video) => (
                <div key={video.id} className="space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden bg-black/20">
                    <iframe
                      src={video.embedUrl}
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allowFullScreen
                      className="w-full h-full"
                      title={video.title}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-background">{video.title}</p>
                      <p className="text-sm text-background/60">{video.description}</p>
                    </div>
                    <Badge className="bg-accent text-accent-foreground text-xs">
                      Elder Reviewed
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
          THEMATIC VOICE GRID — grouped by theme
          ============================================================ */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-accent mb-4">
              Voices
            </p>
            <h2 className="text-3xl font-light text-foreground mb-4" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
              What Communities Say
            </h2>
            <p className="max-w-xl mx-auto text-muted-foreground">
              Organised by theme — every quote is from a real conversation
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-16">
            {themeGroups.map((group) => {
              const groupQuotes = quotes.filter((q) =>
                group.themes.includes(q.theme)
              );
              if (groupQuotes.length === 0) return null;

              return (
                <div key={group.id}>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-foreground">{group.title}</h3>
                    <p className="text-sm text-muted-foreground">{group.subtitle}</p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupQuotes.map((quote, qi) => (
                      <Card key={qi} className="border-0 shadow-sm bg-background hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                          <svg
                            className="w-6 h-6 mb-3 text-primary/20"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                          </svg>
                          <p
                            className="text-sm leading-relaxed text-foreground mb-3"
                            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                          >
                            &ldquo;{quote.text}&rdquo;
                          </p>
                          <div className="flex items-center gap-2 pt-3 border-t border-border">
                            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium">
                              {quote.author[0]}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-primary">{quote.author}</p>
                              <p className="text-xs text-muted-foreground">{quote.context}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          IMPACT STORIES — compact quote cards
          ============================================================ */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-accent mb-4">
              Impact
            </p>
            <h2 className="text-3xl font-light text-foreground mb-4" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
              More Voices
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {impactStories.map((story) => (
              <Card key={story.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-base font-semibold text-foreground mb-2">{story.title}</h3>
                  <p
                    className="text-lg mb-4 leading-relaxed text-foreground/80"
                    style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                  >
                    &ldquo;{story.quote}&rdquo;
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">{story.summary}</p>
                  <div className="pt-4 border-t border-border flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                      {story.person[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">{story.person}</p>
                      <p className="text-xs text-muted-foreground">{story.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          EMPATHY LEDGER — dynamic content (renders if API connected)
          ============================================================ */}
      <Suspense fallback={
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <MediaGallerySkeleton count={8} columns={4} />
          </div>
        </section>
      }>
        <MediaFromLedger />
      </Suspense>

      <Suspense fallback={<StorytellersLoadingSkeleton />}>
        <StorytellersFromLedger />
      </Suspense>

      <Suspense fallback={null}>
        <TopQuotesFromLedger />
      </Suspense>

      {/* ============================================================
          DATA SOVEREIGNTY — OCAP principles
          ============================================================ */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-sm uppercase tracking-widest text-accent mb-4">
                Data Sovereignty
              </p>
              <h2 className="text-3xl font-light text-foreground mb-4" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
                Community Owned Stories
              </h2>
              <p className="text-muted-foreground">
                Every story, photo, and video is owned and controlled by the storyteller
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  letter: 'O',
                  title: 'Ownership',
                  desc: 'Storytellers own their content. Stories belong to the people who share them.',
                },
                {
                  letter: 'C',
                  title: 'Control',
                  desc: 'Full control over how, where, and when stories are shared.',
                },
                {
                  letter: 'A',
                  title: 'Access',
                  desc: 'Storytellers decide who can access their stories and media.',
                },
                {
                  letter: 'P',
                  title: 'Possession',
                  desc: 'Original content stays with the community. We only display with permission.',
                },
              ].map((item) => (
                <div key={item.letter} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 text-primary-foreground text-2xl font-bold">
                    {item.letter}
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SHARE YOUR STORY
          ============================================================ */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-foreground mb-4" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
                Want to Add Your Voice?
              </h2>
              <p className="text-muted-foreground">
                If you&apos;ve received a bed from Goods on Country, we&apos;d love to hear your story
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '1',
                  title: 'Share',
                  desc: 'Tell us about your experience. Write, share a photo, or record a video.',
                },
                {
                  step: '2',
                  title: 'Review',
                  desc: 'Your story goes through elder review. You control who can see it.',
                },
                {
                  step: '3',
                  title: 'Own',
                  desc: 'Your story stays yours. Update, change, or remove it anytime.',
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mx-auto mb-4 text-accent-foreground text-lg font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-medium text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button size="lg" asChild>
                <Link href="/contact?type=story">Share Your Story</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA
          ============================================================ */}
      <section className="py-16 md:py-20 bg-foreground text-background">
        <div className="container mx-auto px-4 text-center">
          <h2
            className="text-3xl md:text-4xl font-light mb-6"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Every bed has a story.<br />Be part of the next one.
          </h2>
          <p className="text-background/70 max-w-xl mx-auto mb-8">
            When you purchase or sponsor a bed, you become part of this community.
            You&apos;ll receive updates as your bed reaches its new home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
              <Link href="/sponsor">Sponsor a Bed</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-background border-background/30 hover:bg-background/10" asChild>
              <Link href="/shop">Shop for Yourself</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
