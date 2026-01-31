import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { empathyLedger } from '@/lib/empathy-ledger';
import { StoryCard, StoryCardSkeleton } from './story-card';
import { MediaGallery, MediaGallerySkeleton } from './media-gallery';

interface FeaturedStoriesProps {
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
  maxStories?: number;
}

export async function FeaturedStories({
  title = 'Community Stories',
  subtitle = 'Voices from the communities we serve',
  showViewAll = true,
  viewAllLink = '/stories',
  maxStories = 3,
}: FeaturedStoriesProps) {
  const stories = await empathyLedger.getStories({ limit: maxStories });

  if (stories.length === 0) {
    // Fallback content when no stories from Empathy Ledger
    return (
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">{title}</h2>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          </div>
          <div className="text-center py-12 text-muted-foreground">
            <p>Stories coming soon...</p>
          </div>
        </div>
      </section>
    );
  }

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

// Loading state
export function FeaturedStoriesSkeleton({
  title = 'Community Stories',
  subtitle = 'Voices from the communities we serve',
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
