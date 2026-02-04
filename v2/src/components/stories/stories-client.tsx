'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { ThemeFilter } from './theme-filter';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  themeDefinitions,
  getThemeCounts,
  type ThemeId,
} from '@/lib/data/content';

interface Quote {
  text: string;
  author: string;
  context: string;
  theme: string;
  verified: boolean;
}

interface JourneyStory {
  id: string;
  title: string;
  person: string;
  location: string;
  theme: string;
  pullQuote: string;
  narrative: string;
  quotes: { text: string; context: string }[];
}

interface StorytellerProfile {
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

interface StoriesClientProps {
  quotes: Quote[];
  journeyStories: JourneyStory[];
  storytellers: StorytellerProfile[];
  storyPersonMedia: Record<string, string | undefined>;
}

export function StoriesClient({
  quotes,
  journeyStories,
  storytellers,
  storyPersonMedia,
}: StoriesClientProps) {
  const [activeTheme, setActiveTheme] = useState<ThemeId | 'all'>('all');

  // Get theme counts for filter
  const themeCounts = useMemo(() => getThemeCounts(), []);
  const themeList = useMemo(
    () =>
      Object.entries(themeCounts)
        .filter(([, count]) => count > 0)
        .map(([id, count]) => ({ id: id as ThemeId, count }))
        .sort((a, b) => b.count - a.count),
    [themeCounts]
  );

  // Filter quotes based on active theme
  const filteredQuotes = useMemo(() => {
    if (activeTheme === 'all') return quotes;
    return quotes.filter((q) => q.theme === activeTheme);
  }, [quotes, activeTheme]);

  // Filter journey stories based on active theme
  const filteredJourneyStories = useMemo(() => {
    if (activeTheme === 'all') return journeyStories;
    // Map housing-journey to related themes
    const themeMap: Record<string, ThemeId[]> = {
      'housing-journey': ['community-need', 'dignity'],
    };
    return journeyStories.filter((s) => {
      if (s.theme === activeTheme) return true;
      const mappedThemes = themeMap[s.theme];
      if (mappedThemes && mappedThemes.includes(activeTheme)) return true;
      return false;
    });
  }, [journeyStories, activeTheme]);

  // Group quotes by theme for the thematic grid
  const groupedQuotes = useMemo(() => {
    const groups: Record<string, Quote[]> = {};
    for (const quote of filteredQuotes) {
      if (!groups[quote.theme]) {
        groups[quote.theme] = [];
      }
      groups[quote.theme].push(quote);
    }
    return groups;
  }, [filteredQuotes]);

  return (
    <>
      {/* Sticky filter bar */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border py-4">
        <div className="container mx-auto px-4">
          <ThemeFilter
            themes={themeList}
            activeTheme={activeTheme}
            onThemeChange={setActiveTheme}
          />
        </div>
      </div>

      {/* Journey Stories section */}
      {filteredJourneyStories.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-sm uppercase tracking-widest text-accent mb-4">
                Stories
              </p>
              <h2
                className="text-3xl md:text-4xl font-light text-foreground mb-4"
                style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
              >
                Every Bed Has a Story
              </h2>
              <p className="max-w-xl mx-auto text-muted-foreground">
                Real journeys from the people behind the numbers
                {activeTheme !== 'all' && (
                  <span className="block mt-2 text-sm">
                    Showing {filteredJourneyStories.length} stories about{' '}
                    <span className="font-medium">
                      {themeDefinitions[activeTheme]?.title}
                    </span>
                  </span>
                )}
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-16">
              {filteredJourneyStories.map((story, index) => (
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
                    <div className="relative w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium overflow-hidden">
                      {storyPersonMedia[story.id] ? (
                        <Image
                          src={storyPersonMedia[story.id] as string}
                          alt={story.person}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        story.person[0]
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{story.person}</p>
                      <p className="text-sm text-muted-foreground">{story.location}</p>
                    </div>
                  </div>

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
      )}

      {/* Thematic Voice Grid */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-accent mb-4">
              Voices
            </p>
            <h2
              className="text-3xl font-light text-foreground mb-4"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              What Communities Say
            </h2>
            <p className="max-w-xl mx-auto text-muted-foreground">
              {activeTheme === 'all'
                ? 'Organised by theme — every quote is from a real conversation'
                : `Showing ${filteredQuotes.length} quotes about ${themeDefinitions[activeTheme]?.title}`}
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-16">
            {Object.entries(groupedQuotes).map(([themeId, themeQuotes]) => {
              const definition = themeDefinitions[themeId as ThemeId];
              if (!definition) return null;

              return (
                <div key={themeId}>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-foreground">
                      {definition.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{definition.subtitle}</p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {themeQuotes.map((quote, qi) => {
                      const profile = storytellers.find((p) => p.name === quote.author);
                      return (
                        <Card
                          key={qi}
                          className="border-0 shadow-sm bg-background hover:shadow-md transition-shadow"
                        >
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
                                <p className="text-xs font-medium text-primary">
                                  {quote.author}
                                </p>
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
    </>
  );
}
