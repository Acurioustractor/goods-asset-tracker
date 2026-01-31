'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { EmpathyLedgerStory } from '@/lib/empathy-ledger/types';

interface StoryCardProps {
  story: EmpathyLedgerStory;
  variant?: 'default' | 'compact' | 'featured';
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
}

export function StoryCard({ story, variant = 'default' }: StoryCardProps) {
  if (variant === 'compact') {
    return (
      <Card className="group overflow-hidden transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {story.title}
          </h3>
          {story.summary && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {story.summary}
            </p>
          )}
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{story.authorName}</span>
            <span>{formatDate(story.publishedAt)}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        <div className="md:flex">
          {/* Story Image */}
          <div className="relative aspect-video md:aspect-square md:w-1/3 overflow-hidden bg-muted">
            {story.featuredImageUrl ? (
              <Image
                src={story.featuredImageUrl}
                alt={story.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-accent/10">
                <svg
                  className="h-12 w-12 text-accent/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                  />
                </svg>
              </div>
            )}

            {story.elderApproved && (
              <Badge className="absolute top-3 left-3 bg-emerald-600 text-white">
                Elder Approved
              </Badge>
            )}
          </div>

          {/* Story Content */}
          <CardContent className="flex-1 p-6">
            {/* Themes */}
            {story.themes.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {story.themes.slice(0, 3).map((theme) => (
                  <Badge key={theme} variant="secondary" className="text-xs">
                    {theme}
                  </Badge>
                ))}
              </div>
            )}

            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {story.title}
            </h3>

            {story.summary && (
              <p className="mt-3 text-muted-foreground line-clamp-3">
                {story.summary}
              </p>
            )}

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-sm font-medium text-accent-foreground">
                    {story.authorName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{story.authorName}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(story.publishedAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
      {/* Story Image */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {story.featuredImageUrl ? (
          <Image
            src={story.featuredImageUrl}
            alt={story.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-accent/10">
            <svg
              className="h-12 w-12 text-accent/40"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>
        )}

        {story.elderApproved && (
          <Badge className="absolute top-3 left-3 bg-emerald-600 text-white">
            Elder Approved
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        {/* Themes */}
        {story.themes.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {story.themes.slice(0, 2).map((theme) => (
              <Badge key={theme} variant="secondary" className="text-xs">
                {theme}
              </Badge>
            ))}
          </div>
        )}

        <h3 className="font-semibold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {story.title}
        </h3>

        {story.summary && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {story.summary}
          </p>
        )}

        <div className="mt-4 flex items-center gap-2 text-sm">
          <div className="h-6 w-6 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-xs font-medium text-accent-foreground">
              {story.authorName.charAt(0)}
            </span>
          </div>
          <span className="text-muted-foreground">{story.authorName}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{formatDate(story.publishedAt)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton loader
export function StoryCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' | 'featured' }) {
  if (variant === 'compact') {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-full animate-pulse rounded bg-muted" />
          <div className="mt-3 flex justify-between">
            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video animate-pulse bg-muted" />
      <CardContent className="p-4">
        <div className="flex gap-1.5 mb-2">
          <div className="h-5 w-16 animate-pulse rounded bg-muted" />
          <div className="h-5 w-12 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-full animate-pulse rounded bg-muted" />
        <div className="mt-4 flex items-center gap-2">
          <div className="h-6 w-6 animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}
