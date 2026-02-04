'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SpotlightQuote {
  text: string;
  author: string;
  context: string;
  photo?: string;
}

interface ThemeGroup {
  id: string;
  title: string;
  color: string;
  quotes: SpotlightQuote[];
}

interface ThemeSpotlightProps {
  themeGroups: ThemeGroup[];
  autoRotateInterval?: number;
}

const colorStyles: Record<string, { tab: string; activeTab: string; dot: string }> = {
  red: {
    tab: 'hover:text-red-400',
    activeTab: 'text-red-400 border-red-400',
    dot: 'bg-red-400',
  },
  amber: {
    tab: 'hover:text-amber-400',
    activeTab: 'text-amber-400 border-amber-400',
    dot: 'bg-amber-400',
  },
  purple: {
    tab: 'hover:text-purple-400',
    activeTab: 'text-purple-400 border-purple-400',
    dot: 'bg-purple-400',
  },
  blue: {
    tab: 'hover:text-blue-400',
    activeTab: 'text-blue-400 border-blue-400',
    dot: 'bg-blue-400',
  },
};

export function ThemeSpotlight({
  themeGroups,
  autoRotateInterval = 8000,
}: ThemeSpotlightProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextTheme = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % themeGroups.length);
  }, [themeGroups.length]);

  // Auto-rotate
  useEffect(() => {
    if (isPaused || themeGroups.length <= 1) return;

    const timer = setInterval(nextTheme, autoRotateInterval);
    return () => clearInterval(timer);
  }, [isPaused, autoRotateInterval, nextTheme, themeGroups.length]);

  const activeGroup = themeGroups[activeIndex];
  if (!activeGroup) return null;

  return (
    <section
      className="py-16 md:py-24 bg-foreground text-background"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-background/50 mb-4">
            Community Themes
          </p>
          <h2
            className="text-3xl md:text-4xl font-light mb-4"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Voices Across Themes
          </h2>
          <p className="max-w-xl mx-auto text-background/60">
            Explore what communities are saying, organised by theme
          </p>
        </div>

        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
          {themeGroups.map((group, index) => {
            const groupStyles = colorStyles[group.color] || colorStyles.blue;
            const isActive = index === activeIndex;

            return (
              <button
                key={group.id}
                onClick={() => setActiveIndex(index)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${
                  isActive
                    ? groupStyles.activeTab
                    : `text-background/60 border-transparent ${groupStyles.tab}`
                }`}
              >
                {group.title}
              </button>
            );
          })}
        </div>

        {/* Quote cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
          {activeGroup.quotes.slice(0, 4).map((quote, qi) => (
            <Card
              key={qi}
              className="bg-background/5 border-background/10 hover:bg-background/10 transition-colors"
            >
              <CardContent className="p-6">
                <p
                  className="text-base leading-relaxed text-background/90 mb-4 line-clamp-4"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                >
                  &ldquo;{quote.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-background/10">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-background/20 flex items-center justify-center text-background text-sm font-medium flex-shrink-0">
                    {quote.photo ? (
                      <Image
                        src={quote.photo}
                        alt={quote.author}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span>{quote.author[0]}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-background">{quote.author}</p>
                    <p className="text-xs text-background/50">{quote.context}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {themeGroups.map((group, index) => {
            const groupStyles = colorStyles[group.color] || colorStyles.blue;
            const isActive = index === activeIndex;

            return (
              <button
                key={group.id}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  isActive ? `${groupStyles.dot} w-6` : 'bg-background/30'
                }`}
                aria-label={`Go to ${group.title}`}
              />
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            variant="outline"
            className="text-background border-background/30 hover:bg-background/10"
            asChild
          >
            <Link href="/stories">Explore All Stories</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function ThemeSpotlightSkeleton() {
  return (
    <section className="py-16 md:py-24 bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="h-4 w-32 bg-background/10 rounded mx-auto mb-4" />
          <div className="h-10 w-64 bg-background/10 rounded mx-auto mb-4" />
          <div className="h-5 w-80 bg-background/10 rounded mx-auto" />
        </div>

        <div className="flex justify-center gap-4 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-32 bg-background/10 rounded animate-pulse" />
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-background/5 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  );
}
