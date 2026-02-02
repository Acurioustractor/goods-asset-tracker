'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { SyndicationStoryteller } from '@/lib/empathy-ledger/types';

interface SyndicationStorytellerCardProps {
  storyteller: SyndicationStoryteller;
  variant?: 'default' | 'compact' | 'featured';
  linkTo?: string;
}

export function SyndicationStorytellerCard({
  storyteller,
  variant = 'default',
  linkTo,
}: SyndicationStorytellerCardProps) {
  const topThemes = storyteller.themes.slice(0, 3);
  const topQuote = storyteller.quotes[0];

  const content = (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
      <CardContent className={variant === 'featured' ? 'p-8' : 'p-6'}>
        <div className={variant === 'featured' ? 'flex gap-6 items-start' : 'text-center'}>
          {/* Avatar */}
          <div
            className={`relative rounded-full overflow-hidden bg-accent/20 flex-shrink-0 ${
              variant === 'featured'
                ? 'h-20 w-20'
                : variant === 'compact'
                  ? 'h-14 w-14 mx-auto mb-3'
                  : 'h-24 w-24 mx-auto mb-4'
            }`}
          >
            {storyteller.avatarUrl ? (
              <Image
                src={storyteller.avatarUrl}
                alt={storyteller.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span
                  className={`font-medium text-accent-foreground ${
                    variant === 'compact' ? 'text-xl' : 'text-3xl'
                  }`}
                >
                  {storyteller.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          <div className={variant === 'featured' ? 'flex-1 min-w-0' : ''}>
            {/* Name and badges */}
            <div
              className={`flex items-center gap-2 mb-2 ${
                variant === 'featured' ? '' : 'justify-center'
              }`}
            >
              <h3
                className={`font-semibold text-foreground ${
                  variant === 'featured' ? 'text-xl' : 'text-lg'
                }`}
              >
                {storyteller.name}
              </h3>
              {storyteller.isElder && (
                <Badge className="bg-emerald-600 text-white text-xs">Elder</Badge>
              )}
            </div>

            {/* Location */}
            {storyteller.location && (
              <p className="text-sm text-muted-foreground mb-2">{storyteller.location}</p>
            )}

            {/* Cultural background */}
            {storyteller.culturalBackground.length > 0 && (
              <p className="text-sm text-accent-foreground italic mb-3">
                {storyteller.culturalBackground.join(', ')}
              </p>
            )}

            {/* Bio */}
            {storyteller.bio && (
              <p
                className={`text-sm text-muted-foreground ${
                  variant === 'featured' ? 'line-clamp-4' : 'line-clamp-3'
                } mb-3`}
              >
                {storyteller.bio}
              </p>
            )}

            {/* Top quote */}
            {topQuote && variant !== 'compact' && (
              <blockquote className="border-l-2 border-primary/30 pl-3 my-3">
                <p
                  className="text-sm italic text-foreground/80 line-clamp-2"
                  style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
                >
                  &ldquo;{topQuote.text}&rdquo;
                </p>
              </blockquote>
            )}

            {/* Themes */}
            {topThemes.length > 0 && (
              <div className={`flex flex-wrap gap-1.5 mt-3 ${variant === 'featured' ? '' : 'justify-center'}`}>
                {topThemes.map((theme) => (
                  <Badge key={theme.name} variant="outline" className="text-xs">
                    {theme.displayName}
                  </Badge>
                ))}
              </div>
            )}

            {/* Emotional tone + quality */}
            {(storyteller.emotionalTone || storyteller.transcriptCount > 0) && variant !== 'compact' && (
              <div className={`flex items-center gap-3 mt-3 text-xs text-muted-foreground ${variant === 'featured' ? '' : 'justify-center'}`}>
                {storyteller.emotionalTone && (
                  <span className="capitalize">{storyteller.emotionalTone}</span>
                )}
                {storyteller.transcriptCount > 0 && (
                  <span>
                    {storyteller.transcriptCount}{' '}
                    {storyteller.transcriptCount === 1 ? 'transcript' : 'transcripts'}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (linkTo) {
    return (
      <Link href={linkTo} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}

export function SyndicationStorytellerCardSkeleton({
  variant = 'default',
}: {
  variant?: 'default' | 'compact' | 'featured';
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className={variant === 'featured' ? 'p-8' : 'p-6'}>
        <div className={variant === 'featured' ? 'flex gap-6 items-start' : 'text-center'}>
          <div
            className={`rounded-full animate-pulse bg-muted flex-shrink-0 ${
              variant === 'featured'
                ? 'h-20 w-20'
                : variant === 'compact'
                  ? 'h-14 w-14 mx-auto mb-3'
                  : 'h-24 w-24 mx-auto mb-4'
            }`}
          />
          <div className={variant === 'featured' ? 'flex-1' : ''}>
            <div className={`h-6 w-32 animate-pulse rounded bg-muted mb-2 ${variant === 'featured' ? '' : 'mx-auto'}`} />
            <div className={`h-4 w-24 animate-pulse rounded bg-muted mb-3 ${variant === 'featured' ? '' : 'mx-auto'}`} />
            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className={`h-4 w-3/4 animate-pulse rounded bg-muted ${variant === 'featured' ? '' : 'mx-auto'}`} />
            </div>
            <div className={`mt-3 flex gap-1.5 ${variant === 'featured' ? '' : 'justify-center'}`}>
              <div className="h-5 w-20 animate-pulse rounded bg-muted" />
              <div className="h-5 w-16 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
