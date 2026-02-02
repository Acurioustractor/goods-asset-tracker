import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { empathyLedger } from '@/lib/empathy-ledger';
import { StoryCard, StoryCardSkeleton } from './story-card';
import { MediaGallery, MediaGallerySkeleton } from './media-gallery';
import { journeyStories } from '@/lib/data/content';
import { storyPersonMedia } from '@/lib/data/media';

interface FeaturedStoriesProps {
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
  maxStories?: number;
}

// Theme labels and colors
const themeStyles: Record<string, { label: string; className: string }> = {
  'housing-journey': { label: 'Housing', className: 'bg-blue-100 text-blue-800' },
  health: { label: 'Health', className: 'bg-red-100 text-red-800' },
  dignity: { label: 'Dignity', className: 'bg-purple-100 text-purple-800' },
  'co-design': { label: 'Co-Design', className: 'bg-amber-100 text-amber-800' },
  'washing-machine': { label: 'Washing Machines', className: 'bg-green-100 text-green-800' },
};

export async function FeaturedStories({
  title = 'Community Voices',
  subtitle = '15 storytellers across 6 communities have shaped and validated the Goods approach',
  showViewAll = true,
  viewAllLink = '/stories',
  maxStories = 3,
}: FeaturedStoriesProps) {
  const stories = await empathyLedger.getStories({ limit: maxStories });

  // If EL has stories, use them
  if (stories.length > 0) {
    return (
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground">{title}</h2>
              <p className="mt-2 text-muted-foreground">{subtitle}</p>
            </div>
            {showViewAll && (
              <Button variant="outline" asChild className="hidden sm:inline-flex">
                <Link href={viewAllLink}>View All Stories</Link>
              </Button>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>

          {showViewAll && (
            <div className="mt-8 text-center sm:hidden">
              <Button asChild>
                <Link href={viewAllLink}>View All Stories</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Fallback: use local journey stories with profile images, quotes, and locations
  const featured = journeyStories.slice(0, maxStories);

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">{title}</h2>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          </div>
          {showViewAll && (
            <Button variant="outline" asChild className="hidden sm:inline-flex">
              <Link href={viewAllLink}>Read All Stories</Link>
            </Button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((story) => {
            const photoUrl = storyPersonMedia[story.id];
            const theme = themeStyles[story.theme] ?? { label: story.theme, className: 'bg-muted text-muted-foreground' };

            return (
              <Card key={story.id} className="overflow-hidden group">
                <CardContent className="p-0">
                  {/* Quote area */}
                  <div className="p-6 pb-4">
                    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-4 ${theme.className}`}>
                      {theme.label}
                    </span>
                    <blockquote className="text-lg font-medium text-foreground leading-relaxed mb-4">
                      &ldquo;{story.pullQuote}&rdquo;
                    </blockquote>
                  </div>

                  {/* Person */}
                  <div className="px-6 pb-6 flex items-center gap-3">
                    {photoUrl ? (
                      <Image
                        src={photoUrl}
                        alt={story.person}
                        width={48}
                        height={48}
                        className="rounded-full object-cover w-12 h-12"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                        {story.person.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-foreground text-sm">{story.person}</div>
                      <div className="text-xs text-muted-foreground">{story.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {showViewAll && (
          <div className="mt-8 text-center sm:hidden">
            <Button asChild>
              <Link href={viewAllLink}>Read All Stories</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

// Loading state
export function FeaturedStoriesSkeleton({
  title = 'Community Voices',
  subtitle = '15 storytellers across 6 communities have shaped and validated the Goods approach',
  count = 3,
}: {
  title?: string;
  subtitle?: string;
  count?: number;
}) {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">{title}</h2>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          </div>
          <div className="hidden sm:block h-10 w-32 animate-pulse rounded bg-muted" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, i) => (
            <StoryCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface CommunityGalleryProps {
  title?: string;
  subtitle?: string;
  community?: string;
  maxImages?: number;
}

export async function CommunityGallery({
  title = 'Community Gallery',
  subtitle = 'Images from our communities',
  community,
  maxImages = 6,
}: CommunityGalleryProps) {
  const media = await empathyLedger.getMedia({
    type: 'image',
    elderApproved: true,
    culturalTags: community ? [community] : undefined,
    limit: maxImages,
  });

  if (media.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        </div>

        <MediaGallery media={media} columns={3} />
      </div>
    </section>
  );
}

// Loading state
export function CommunityGallerySkeleton({
  title = 'Community Gallery',
  subtitle = 'Images from our communities',
  count = 6,
}: {
  title?: string;
  subtitle?: string;
  count?: number;
}) {
  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
        </div>

        <MediaGallerySkeleton count={count} columns={3} />
      </div>
    </section>
  );
}
