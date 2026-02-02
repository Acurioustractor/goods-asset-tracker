import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { empathyLedger } from '@/lib/empathy-ledger';
import { MediaGallery, MediaGallerySkeleton } from '@/components/empathy-ledger/media-gallery';
import { SyndicationStorytellerCard, SyndicationStorytellerCardSkeleton } from '@/components/empathy-ledger/syndication-storyteller-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { storytellerProfiles, storytellerEnrichment, videoGallery, journeyStories, quotes } from '@/lib/data/content';
import { storyPersonMedia } from '@/lib/data/media';
import { MediaSlot } from '@/components/ui/media-slot';
import type { SyndicationStoryteller } from '@/lib/empathy-ledger/types';
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

// Shape used by the storytellers grid
interface StorytellerGridProfile {
  id: string;
  name: string;
  role?: string;
  location: string;
  community: string;
  photo: string;
  keyQuote: string;
  isElder: boolean;
  hasVideo: boolean;
  videoEmbed?: string;
  themes: string[];
}

/**
 * Map EL SyndicationStoryteller to the shape the grid needs,
 * merging local enrichment data.
 */
function mapELToGridProfile(s: SyndicationStoryteller): StorytellerGridProfile {
  const enrichment = storytellerEnrichment[s.name] ?? {};
  return {
    id: s.id,
    name: s.name,
    role: enrichment.role,
    location: s.location ?? '',
    community: enrichment.community ?? '',
    photo: s.avatarUrl ?? enrichment.localPhoto ?? '/images/people/placeholder.jpg',
    keyQuote: s.quotes[0]?.text ?? '',
    isElder: s.isElder,
    hasVideo: enrichment.hasVideo ?? false,
    videoEmbed: enrichment.videoEmbed,
    themes: s.themes.map((t) => t.name),
  };
}

/**
 * Fetch storytellers from EL API with fallback to hardcoded profiles.
 */
async function getStorytellersForGrid(): Promise<StorytellerGridProfile[]> {
  const elStorytellers = await empathyLedger.getProjectStorytellers({ limit: 50 });
  if (elStorytellers.length > 0) {
    return elStorytellers.map(mapELToGridProfile);
  }
  // Fallback to hardcoded data
  return storytellerProfiles.map((p) => ({
    id: p.id,
    name: p.name,
    role: p.role,
    location: p.location,
    community: p.community,
    photo: p.photo,
    keyQuote: p.keyQuote,
    isElder: p.isElder,
    hasVideo: p.hasVideo,
    videoEmbed: 'videoEmbed' in p ? (p.videoEmbed as string) : undefined,
    themes: p.themes,
  }));
}

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
    const storytellers = await empathyLedger.getProjectStorytellers({ limit: 20 });

    if (storytellers.length === 0) {
      return null;
    }

    return (
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-accent mb-4">
              From the Empathy Ledger
            </p>
            <h2 className="text-3xl font-light text-foreground mb-4" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
              Deeper Analysis
            </h2>
            <p className="max-w-xl mx-auto text-muted-foreground">
              AI-assisted analysis of community conversations — themes, impact, and insights
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {storytellers.slice(0, 6).map((storyteller) => (
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

export default async function StoriesPage() {
  const allStorytellers = await getStorytellersForGrid();
  const elders = allStorytellers.filter((p) => p.isElder);
  const others = allStorytellers.filter((p) => !p.isElder);
  const testimonies = videoGallery.filter((v) => v.category === 'testimony');
  const bRoll = videoGallery.filter((v) => v.category !== 'testimony');

  return (
    <main>
      {/* ============================================================
          HERO — Linda Turner's quote as the centrepiece
          ============================================================ */}
      <section className="relative min-h-[70vh] flex items-center bg-foreground text-background overflow-hidden">
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
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src="/images/people/linda-turner.jpg"
                    alt="Linda Turner"
                    fill
                    className="object-cover"
                  />
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
          STORYTELLERS GRID — thumbnails, names, locations, key quotes
          ============================================================ */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-accent mb-4">
              Meet the People
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
              Our Storytellers
            </h2>
            <p className="max-w-xl mx-auto text-muted-foreground">
              The people who shape what we build. Every quote is from a real conversation.
            </p>
          </div>

          {/* Elders first */}
          {elders.length > 0 && (
            <div className="max-w-5xl mx-auto mb-12">
              <div className="grid md:grid-cols-2 gap-8">
                {elders.map((person) => (
                  <Card key={person.id} className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex gap-0">
                        {/* Photo */}
                        <div className="relative w-40 md:w-48 flex-shrink-0">
                          <Image
                            src={person.photo}
                            alt={person.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 160px, 192px"
                          />
                        </div>
                        {/* Info */}
                        <div className="flex-1 p-6 flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-foreground">{person.name}</h3>
                            <Badge className="bg-emerald-600 text-white text-xs">Elder</Badge>
                          </div>
                          {person.role && (
                            <p className="text-sm text-accent-foreground mb-1">{person.role}</p>
                          )}
                          <p className="text-sm text-muted-foreground mb-3">{person.location}</p>
                          <blockquote className="border-l-2 border-primary/30 pl-3">
                            <p
                              className="text-sm italic text-foreground/80 line-clamp-3"
                              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                            >
                              &ldquo;{person.keyQuote}&rdquo;
                            </p>
                          </blockquote>
                          {person.hasVideo && (
                            <div className="mt-3">
                              <Badge variant="outline" className="text-xs gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                                </svg>
                                Video
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Other storytellers — compact grid */}
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((person) => (
                <Card key={person.id} className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {/* Photo */}
                    <div className="relative aspect-[4/3] bg-muted">
                      <Image
                        src={person.photo}
                        alt={person.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      {person.hasVideo && (
                        <div className="absolute top-3 right-3">
                          <div className="flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                            </svg>
                            Video
                          </div>
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-5">
                      <h3 className="text-base font-semibold text-foreground mb-0.5">{person.name}</h3>
                      {person.role && (
                        <p className="text-xs text-accent-foreground mb-0.5">{person.role}</p>
                      )}
                      <p className="text-sm text-muted-foreground mb-3">{person.location}</p>
                      <p
                        className="text-sm italic text-foreground/70 line-clamp-2"
                        style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                      >
                        &ldquo;{person.keyQuote}&rdquo;
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          VIDEO GALLERY — testimonials + b-roll
          ============================================================ */}
      <section className="py-16 md:py-24 bg-foreground text-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-background/50 mb-4">
              Video
            </p>
            <h2 className="text-3xl md:text-4xl font-light mb-4" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
              Hear from Community
            </h2>
            <p className="max-w-xl mx-auto text-background/60">
              Video testimonials and footage from communities across Australia
            </p>
          </div>

          {/* Testimonials — large */}
          {testimonies.length > 0 && (
            <div className="max-w-4xl mx-auto mb-16">
              <h3 className="text-sm uppercase tracking-widest text-background/40 mb-6">
                Testimonials
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                {testimonies.map((video) => (
                  <div key={video.id} className="space-y-3">
                    {video.type === 'local' && 'src' in video ? (
                      <div className="aspect-video rounded-lg overflow-hidden bg-black/20">
                        <video
                          src={video.src}
                          poster={'poster' in video ? video.poster : undefined}
                          controls
                          preload="none"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : video.type === 'embed' && 'embedUrl' in video ? (
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
                    ) : null}
                    <div>
                      <p className="font-medium text-background">{video.title}</p>
                      <p className="text-sm text-background/60">{video.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* B-roll — smaller grid */}
          {bRoll.length > 0 && (
            <div className="max-w-6xl mx-auto">
              <h3 className="text-sm uppercase tracking-widest text-background/40 mb-6">
                On Country
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {bRoll.map((video) => (
                  <div key={video.id} className="group">
                    {'src' in video && video.src ? (
                      <div className="aspect-video rounded-lg overflow-hidden bg-black/20 relative">
                        <video
                          src={video.src}
                          poster={'poster' in video ? video.poster : undefined}
                          controls
                          preload="none"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null}
                    <p className="text-sm font-medium text-background/80 mt-2">{video.title}</p>
                    <p className="text-xs text-background/50">{video.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                <Badge variant="outline" className="mb-6 text-xs">
                  {story.theme === 'co-design' && 'Co-Design'}
                  {story.theme === 'health' && 'Health'}
                  {story.theme === 'dignity' && 'Dignity'}
                  {story.theme === 'housing-journey' && 'Housing Journey'}
                  {story.theme === 'washing-machine' && 'Washing Machine'}
                </Badge>

                <blockquote className="mb-8">
                  <p
                    className="text-2xl md:text-3xl font-light leading-relaxed text-foreground"
                    style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                  >
                    &ldquo;{story.pullQuote}&rdquo;
                  </p>
                </blockquote>

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

                {storyPersonMedia[story.id] && (
                  <div className="mb-8">
                    <MediaSlot
                      src={storyPersonMedia[story.id]}
                      alt={`${story.person} — ${story.location}`}
                      aspect="16/9"
                    />
                  </div>
                )}

                <div className="prose prose-stone max-w-none">
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                    {story.narrative}
                  </p>
                </div>

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
                    {groupQuotes.map((quote, qi) => {
                      const profile = allStorytellers.find((p) => p.name === quote.author);
                      return (
                        <Card key={qi} className="border-0 shadow-sm bg-background hover:shadow-md transition-shadow">
                          <CardContent className="p-5">
                            <p
                              className="text-sm leading-relaxed text-foreground mb-3"
                              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                            >
                              &ldquo;{quote.text}&rdquo;
                            </p>
                            <div className="flex items-center gap-2 pt-3 border-t border-border">
                              <div className="relative w-7 h-7 rounded-full overflow-hidden bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium flex-shrink-0">
                                {profile?.photo ? (
                                  <Image
                                    src={profile.photo}
                                    alt={quote.author}
                                    fill
                                    className="object-cover"
                                    sizes="28px"
                                  />
                                ) : (
                                  <span>{quote.author[0]}</span>
                                )}
                              </div>
                              <div>
                                <p className="text-xs font-medium text-primary">{quote.author}</p>
                                <p className="text-xs text-muted-foreground">{quote.context}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
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
