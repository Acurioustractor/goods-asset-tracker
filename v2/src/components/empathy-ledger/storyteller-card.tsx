'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { EmpathyLedgerStoryteller } from '@/lib/empathy-ledger/types';

interface StorytellerCardProps {
  storyteller: EmpathyLedgerStoryteller;
  variant?: 'default' | 'compact';
}

export function StorytellerCard({ storyteller, variant = 'default' }: StorytellerCardProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
        {/* Avatar */}
        <div className="relative h-10 w-10 flex-shrink-0 rounded-full overflow-hidden bg-accent/20">
          {storyteller.avatarUrl ? (
            <Image
              src={storyteller.avatarUrl}
              alt={storyteller.displayName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-lg font-medium text-accent-foreground">
                {storyteller.displayName.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{storyteller.displayName}</p>
          {storyteller.community && (
            <p className="text-xs text-muted-foreground truncate">{storyteller.community}</p>
          )}
        </div>

        {/* Elder badge */}
        {storyteller.elderStatus && (
          <Badge variant="secondary" className="text-xs">
            Elder
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6 text-center">
        {/* Avatar */}
        <div className="relative mx-auto h-24 w-24 rounded-full overflow-hidden bg-accent/20 mb-4">
          {storyteller.avatarUrl ? (
            <Image
              src={storyteller.avatarUrl}
              alt={storyteller.displayName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-3xl font-medium text-accent-foreground">
                {storyteller.displayName.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Name and badges */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <h3 className="font-semibold text-lg text-foreground">
            {storyteller.displayName}
          </h3>
          {storyteller.elderStatus && (
            <Badge className="bg-emerald-600 text-white">Elder</Badge>
          )}
          {storyteller.featured && (
            <Badge variant="secondary">Featured</Badge>
          )}
        </div>

        {/* Community */}
        {storyteller.community && (
          <p className="text-sm text-muted-foreground mb-3">
            {storyteller.community}
          </p>
        )}

        {/* Cultural background */}
        {storyteller.culturalBackground && (
          <p className="text-sm text-accent-foreground italic mb-3">
            {storyteller.culturalBackground}
          </p>
        )}

        {/* Bio */}
        {storyteller.bio && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {storyteller.bio}
          </p>
        )}

        {/* Specialties */}
        {storyteller.specialties.length > 0 && (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {storyteller.specialties.slice(0, 3).map((specialty) => (
              <Badge key={specialty} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        )}

        {/* Story count */}
        {storyteller.storyCount > 0 && (
          <p className="mt-4 text-xs text-muted-foreground">
            {storyteller.storyCount} {storyteller.storyCount === 1 ? 'story' : 'stories'} shared
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Skeleton loader
export function StorytellerCardSkeleton({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
        <div className="h-10 w-10 rounded-full animate-pulse bg-muted" />
        <div className="flex-1">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="mt-1 h-3 w-16 animate-pulse rounded bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 text-center">
        <div className="mx-auto h-24 w-24 rounded-full animate-pulse bg-muted mb-4" />
        <div className="mx-auto h-6 w-32 animate-pulse rounded bg-muted mb-2" />
        <div className="mx-auto h-4 w-24 animate-pulse rounded bg-muted mb-3" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-3/4 mx-auto animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <div className="h-5 w-16 animate-pulse rounded bg-muted" />
          <div className="h-5 w-14 animate-pulse rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}
