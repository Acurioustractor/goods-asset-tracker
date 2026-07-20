import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { empathyLedger } from '@/lib/empathy-ledger';
import { MediaGallery, MediaGallerySkeleton } from '@/components/empathy-ledger/media-gallery';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { storytellerProfiles, storytellerEnrichment, videoGallery, impactStories, communityPartnerships } from '@/lib/data/content';
import { curatedQuotes } from '@/lib/data/curated-quotes';
import { CANONICAL_ASSETS } from '@/lib/data/asset-canonical';
import { isClearedForExternal } from '@/lib/data/cleared-voices';
import { slugify } from '@/lib/storytellers';

// Photos that exist on disk but aren't yet wired into media.ts's communityMedia map.
// Keyed by communityPartnerships id.
const communityPhotoOverrides: Record<string, string | undefined> = {
  'alice-springs': '/images/community/alice-springs/oonchiumpa-team-red-bed.jpg',
  'palm-island': '/images/community/palm-island/family-dogs-new-bed.jpg',
  'utopia-homelands': '/images/utopia/utopia-01.jpg',
  // No dedicated photo folder yet: townsville (0 beds, logistics-only), maningrida.
};

const impactPersonPhoto: Record<string, string | undefined> = {
  'alfred-safety': '/images/people/alfred-johnson.jpg',
  'melissa-comfort': '/images/people/melissa-jackson.jpg',
  'gloria-health': '/images/people/gloria-turner.jpg',
  'norman-future': '/images/people/norman-frank.jpg',
  'cliff-health-messages': '/images/people/cliff-plummer.jpg',
  'boe-washing-logic': '/images/people/boe-remenyi.jpg',
};

// Where each impact-quote card links through to. Verified against the storyteller
// pages actually generated at build time (v2/src/app/storytellers/[slug]) — Melissa
// Jackson and Norman Frank don't have a live Empathy Ledger storyteller page, so
// their cards link to their community page instead of a dead /storytellers/ URL.
const impactStoryLink: Record<string, string> = {
  'alfred-safety': '/storytellers/alfred-johnson',
  'melissa-comfort': '/communities/tennant-creek',
  'gloria-health': '/storytellers/gloria-turner',
  'norman-future': '/communities/tennant-creek',
  'boe-washing-logic': '/storytellers/dr-boe-remenyi',
  'cliff-health-messages': '/storytellers/cliff-plummer',
};
import type { SyndicationStoryteller } from '@/lib/empathy-ledger/types';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Stories',
  description: 'Real stories from the communities we serve. Hear directly from families whose lives have been changed by Goods on Country.',
};

// Shape used by the storytellers grid
interface StorytellerGridProfile {
  id: string;
  name: string;
  role?: string;
  location: string;
  community: string;
  photo: string;
  keyQuote: string;
  quotes: { text: string; context: string | null }[];
  isElder: boolean;
  hasVideo: boolean;
  videoEmbed?: string;
  themes: string[];
  transcriptCount: number;
  emotionalTone: string | null;
}

/**
 * Map EL SyndicationStoryteller to the shape the grid needs,
 * merging local enrichment data.
 */
// Build an index of curated quotes keyed by whitespace-normalised name,
// so lookups hit regardless of single/double spaces in source data.
const normaliseName = (n: string) => n.replace(/\s+/g, ' ').trim();
const curatedQuotesByNormalisedName: Record<string, typeof curatedQuotes[string]> = {};
for (const [k, v] of Object.entries(curatedQuotes)) {
  curatedQuotesByNormalisedName[normaliseName(k)] = v;
}

function mapELToGridProfile(s: SyndicationStoryteller): StorytellerGridProfile {
  // EL data sometimes carries double-spaces in names ("Alfred  Johnson");
  // normalise to single-space so curated-quote lookups don't miss.
  const normalisedName = normaliseName(s.name);
  const enrichment = storytellerEnrichment[s.name] ?? storytellerEnrichment[normalisedName] ?? {};
  // Prefer curated quotes (cleaned up for public display) over raw API quotes
  const curated = curatedQuotes[s.name] ?? curatedQuotesByNormalisedName[normalisedName];
  const quotesForDisplay = curated && curated.length > 0
    ? curated
    : s.quotes.map((q) => ({ text: q.text, context: q.context }));

  return {
    id: s.id,
    name: normalisedName,
    role: enrichment.role,
    location: s.location ?? '',
    community: enrichment.community ?? '',
    photo: s.avatarUrl ?? enrichment.localPhoto ?? '/images/people/placeholder.jpg',
    keyQuote: quotesForDisplay[0]?.text ?? '',
    quotes: quotesForDisplay,
    isElder: s.isElder,
    hasVideo: enrichment.hasVideo ?? false,
    videoEmbed: enrichment.videoEmbed,
    themes: s.themes.map((t) => t.displayName || t.name),
    transcriptCount: s.transcriptCount,
    emotionalTone: s.emotionalTone,
  };
}

// Internal team / ops accounts that get pulled in by the EL project membership
// query but aren't community storytellers and shouldn't appear in the public grid.
const INTERNAL_NAMES = new Set([
  'Accounts ACT',
  'ACT Production Team',
  'Nicholas Marchesi',
  'E2E Super Admin',
  'PICC Community Hub Team',
  "PICC Women's Healing Service Team",
  "PICC Women's Shelter Team",
  'YPA Team',
]);

function isPublicStoryteller(p: StorytellerGridProfile) {
  if (INTERNAL_NAMES.has(p.name)) return false;
  // Every public storyteller card needs at least one related quote.
  // Profiles without any quote are placeholder rows; hide them.
  if (!p.keyQuote || p.keyQuote.trim() === '') return false;
  // Consent gate (default-deny): only voices cleared for external/open-web use.
  if (!isClearedForExternal(p.name)) return false;
  return true;
}

/**
 * Fetch storytellers from EL API with fallback to hardcoded profiles.
 */
async function getStorytellersForGrid(): Promise<StorytellerGridProfile[]> {
  const rawStorytellers = await empathyLedger.getProjectStorytellers({ limit: 50 });
  if (rawStorytellers.length > 0) {
    // Enrich with cross-project quotes (some storytellers have transcripts under other projects)
    const elStorytellers = await empathyLedger.enrichStorytellersWithQuotes(rawStorytellers);
    return elStorytellers.map(mapELToGridProfile).filter(isPublicStoryteller);
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
    quotes: [{ text: p.keyQuote, context: null }].filter((q) => q.text),
    isElder: p.isElder,
    hasVideo: p.hasVideo,
    videoEmbed: 'videoEmbed' in p ? (p.videoEmbed as string) : undefined,
    themes: p.themes,
    transcriptCount: 0,
    emotionalTone: null,
  })).filter(isPublicStoryteller);
}

// Fetch media gallery from Empathy Ledger
async function MediaFromLedger() {
  let media;
  try {
    media = await empathyLedger.getMedia({
      type: 'image',
      limit: 12
    });
  } catch {
    return null;
  }

  if (!media || media.length === 0) {
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
}

export default async function StoriesPage() {
  const allStorytellers = await getStorytellersForGrid();
  const publishedStories = await empathyLedger.getProjectStories({ limit: 20 });
  const elders = allStorytellers.filter((p) => p.isElder);
  const others = allStorytellers.filter((p) => !p.isElder);
  const testimonies = videoGallery.filter((v) => v.category === 'testimony');
  const bRoll = videoGallery.filter((v) => v.category !== 'testimony');

  // Resolve a hero image for each Empathy Ledger story.
  // Prefer the story's own featuredImageUrl; fall back to the named
  // storyteller's portrait. Stories with neither are hidden so we never
  // render the empty quotation-mark placeholder card.
  type StoryWithMedia = (typeof publishedStories)[number] & {
    heroImage: string | null;
    hasStorytellerVideo: boolean;
  };
  function resolveStorytellerPhoto(name: string | null): string | null {
    if (!name) return null;
    const direct = storytellerEnrichment[name];
    if (direct?.localPhoto) return direct.localPhoto;
    const normalised = storytellerEnrichment[normaliseName(name)];
    if (normalised?.localPhoto) return normalised.localPhoto;
    return null;
  }
  function resolveStorytellerVideo(name: string | null): boolean {
    if (!name) return false;
    const direct = storytellerEnrichment[name];
    if (direct?.hasVideo) return true;
    const normalised = storytellerEnrichment[normaliseName(name)];
    return !!normalised?.hasVideo;
  }
  const enrichedStories: StoryWithMedia[] = publishedStories.map((s) => ({
    ...s,
    heroImage:
      s.featuredImageUrl ?? resolveStorytellerPhoto(s.storytellerName ?? s.authorName ?? null),
    hasStorytellerVideo: resolveStorytellerVideo(s.storytellerName ?? s.authorName ?? null),
  }));

  // Consent gate (default-deny): a published story renders only if its storyteller
  // (or author) is cleared for external display.
  const clearedStories = enrichedStories.filter((s) =>
    isClearedForExternal(s.storytellerName ?? s.authorName ?? null),
  );

  // Split into text and video stories — only stories with usable media survive.
  const textStories = clearedStories.filter((s) => !s.videoLink && s.heroImage);
  const videoStoryLinks = clearedStories.filter((s) => s.videoLink);

  // Live counts for the stats bar (replace stale hardcoded values).
  const storytellerCount = allStorytellers.length;
  const communityCount = new Set(
    allStorytellers
      .map((p) => (p.location || '').split(',')[0].trim())
      .filter(Boolean)
  ).size;

  return (
    <main>
      {/* ============================================================
          HERO: Linda Turner's quote as the centrepiece
          ============================================================ */}
      <section className="relative min-h-[70vh] flex items-center bg-foreground text-background overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)' }} />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-4xl">
            <p className="text-sm uppercase tracking-widest text-background/50 mb-3">
              Community Voices
            </p>
            <h1 className="sr-only">Community Stories</h1>

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
              starts with a conversation, not a catalogue. These are the voices that
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { value: String(storytellerCount), label: 'Storytellers', sub: `across ${communityCount} places` },
              { value: String(communityCount), label: 'Communities', sub: 'across remote Australia' },
              { value: String(CANONICAL_ASSETS.bedsDeployed), label: 'Beds Delivered', sub: 'and counting' },
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
          PUBLISHED STORIES: from Empathy Ledger
          ============================================================ */}
      {(textStories.length > 0 || videoStoryLinks.length > 0) && (
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-sm uppercase tracking-widest text-accent mb-4">
                From the Community
              </p>
              <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
                Published Stories
              </h2>
              <p className="max-w-xl mx-auto text-muted-foreground">
                Written by community members and shared with their permission
              </p>
            </div>

            <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {textStories.map((story) => (
                <Link key={story.id} href={`/stories/${story.id}`} className="group block">
                  <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-0">
                      <div className="relative aspect-[16/10] bg-muted">
                        <Image
                          src={story.heroImage!}
                          alt={story.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        {story.hasStorytellerVideo && (
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-black/70 text-white text-[10px] gap-1 border-0">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                              </svg>
                              Video
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3
                          className="text-lg font-light text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2"
                          style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                        >
                          {story.title}
                        </h3>
                        {story.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{story.excerpt}</p>
                        )}
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-foreground">{story.storytellerName || story.authorName}</p>
                          {story.elderApproved && (
                            <Badge className="bg-emerald-600 text-white text-[10px] border-0">Elder Approved</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}

              {videoStoryLinks.map((story) => (
                <Link key={story.id} href={`/stories/${story.id}`} className="group block">
                  <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-0">
                      <div className="aspect-[16/10] bg-gray-900 relative flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                          </svg>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-[10px] gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                            </svg>
                            Video
                          </Badge>
                        </div>
                        <h3
                          className="text-lg font-light text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2"
                          style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                        >
                          {story.title}
                        </h3>
                        <p className="text-xs font-medium text-foreground">{story.storytellerName || story.authorName}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================
          STORYTELLERS GRID: thumbnails, names, locations, key quotes
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
                  <Link key={person.id} href={`/storytellers/${slugify(person.name)}`} className="group block">
                  <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-shadow">
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
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{person.name}</h3>
                            <Badge className="bg-emerald-600 text-white text-xs">Elder</Badge>
                          </div>
                          {person.role && (
                            <p className="text-sm text-accent-foreground mb-1">{person.role}</p>
                          )}
                          <p className="text-sm text-muted-foreground mb-3">{person.location}</p>
                          {person.keyQuote && (
                            <blockquote className="border-l-2 border-primary/30 pl-3 mb-3">
                              <p
                                className="text-sm italic text-foreground/80 line-clamp-3"
                                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                              >
                                &ldquo;{person.keyQuote}&rdquo;
                              </p>
                            </blockquote>
                          )}
                          {person.themes.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-auto">
                              {person.themes.slice(0, 4).map((theme) => (
                                <Badge key={theme} variant="secondary" className="text-[10px] capitalize">
                                  {theme}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Other storytellers: compact grid */}
          <div className="max-w-6xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((person) => (
                <Link key={person.id} href={`/storytellers/${slugify(person.name)}`} className="group block">
                <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    {/* Photo */}
                    <div className="relative aspect-[4/3] bg-muted">
                      <Image
                        src={person.photo}
                        alt={person.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                      <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-0.5">{person.name}</h3>
                      {person.role && (
                        <p className="text-xs text-accent-foreground mb-0.5">{person.role}</p>
                      )}
                      <p className="text-sm text-muted-foreground mb-3">{person.location}</p>
                      {person.keyQuote && (
                        <p
                          className="text-sm italic text-foreground/70 line-clamp-3 mb-3"
                          style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                        >
                          &ldquo;{person.keyQuote}&rdquo;
                        </p>
                      )}
                      {person.themes.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {person.themes.slice(0, 3).map((theme) => (
                            <Badge key={theme} variant="secondary" className="text-[10px] capitalize">
                              {theme}
                            </Badge>
                          ))}
                          {person.themes.length > 3 && (
                            <Badge variant="secondary" className="text-[10px]">
                              +{person.themes.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          IN THEIR OWN WORDS: short impact quote cards
          ============================================================ */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-accent mb-4">
              In Their Own Words
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
              Moments That Stuck With Us
            </h2>
            <p className="max-w-xl mx-auto text-muted-foreground">
              Short, specific things people told us that changed how we build
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {impactStories.map((item) => {
              const photo = impactPersonPhoto[item.id];
              const href = impactStoryLink[item.id] ?? '/stories';
              return (
                <Link key={item.id} href={href} className="group block">
                <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-0 flex flex-col h-full">
                    {photo ? (
                      <div className="relative aspect-[4/3] bg-muted">
                        <Image
                          src={photo}
                          alt={item.person}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="aspect-[4/3] bg-foreground/5 flex items-center justify-center">
                        <span className="text-4xl text-foreground/20" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>&ldquo;</span>
                      </div>
                    )}
                    <div className="p-5 flex-1 flex flex-col">
                      <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-2">{item.title}</h3>
                      <blockquote>
                        <p
                          className="text-sm italic text-foreground/80 mb-3"
                          style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                        >
                          &ldquo;{item.quote}&rdquo;
                        </p>
                      </blockquote>
                      <p className="text-sm text-muted-foreground mb-3 flex-1">{item.summary}</p>
                      <p className="text-xs font-medium text-foreground">{item.person}</p>
                      <p className="text-xs text-muted-foreground">{item.location}</p>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          COMMUNITIES: partnership summaries
          ============================================================ */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-accent mb-4">
              Where We Work
            </p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
              Communities
            </h2>
            <p className="max-w-xl mx-auto text-muted-foreground">
              Every partnership started with a conversation, not a delivery schedule
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {communityPartnerships.map((c) => {
              const photo = communityPhotoOverrides[c.id];
              return (
                <Link key={c.id} href={`/communities/${c.id}`} className="group block">
                  <Card className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-0">
                      {photo ? (
                        <div className="relative aspect-[16/10] bg-muted">
                          <Image
                            src={photo}
                            alt={c.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="aspect-[16/10] bg-foreground/5 flex items-center justify-center">
                          <span className="text-sm text-muted-foreground">Photo coming soon</span>
                        </div>
                      )}
                      <div className="p-5">
                        <p className="text-xs uppercase tracking-wide text-accent mb-1">{c.region}</p>
                        <h3
                          className="text-lg font-light text-foreground group-hover:text-primary transition-colors mb-2"
                          style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                        >
                          {c.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{c.headline}</p>
                        {c.bedsDelivered > 0 && (
                          <p className="text-xs font-medium text-foreground">{c.bedsDelivered} beds delivered</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          GO DEEPER: links out to the origin story, field notes, partners
          ============================================================ */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-accent mb-4">
              Go Deeper
            </p>
            <h2 className="text-3xl font-light text-foreground mb-4" style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}>
              More From Goods
            </h2>
          </div>

          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-6">
            {[
              { href: '/story', title: 'How Goods Started', desc: 'From a health conference in 2018 to beds on the ground: the origin story.' },
              { href: '/field-notes/utopia-may-2026', title: 'From Alice Springs to Utopia', desc: 'Three days on the road: a build session, deliveries, and sitting with Elders.' },
              { href: '/partners/oonchiumpa', title: 'Oonchiumpa Consultancy', desc: 'The 100% Aboriginal-owned consultancy leading design in Alice Springs.' },
              { href: '/partners/centrecorp', title: 'Centrecorp Foundation', desc: 'How the Utopia Homelands deliveries came together.' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="group block">
                <Card className="border-0 shadow-sm hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-6">
                    <h3
                      className="text-lg font-light text-foreground group-hover:text-primary transition-colors mb-2"
                      style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                    >
                      {link.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{link.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          VIDEO GALLERY: testimonials + b-roll
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

          {/* Testimonials: large */}
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

          {/* B-roll: smaller grid */}
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
          EMPATHY LEDGER: media gallery (renders if API connected)
          The duplicated journey-stories + thematic-voices + syndication
          card sections were removed 2026-05-15 (audit: 590 KB page weight,
          storytellers were rendering four times).
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

      {/* ============================================================
          DATA SOVEREIGNTY: OCAP principles
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
            Back a bed and you back community-led production. You&apos;ll get
            updates as it reaches the family who asked for it.
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
