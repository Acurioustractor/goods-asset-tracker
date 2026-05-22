import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTripStory, tripStories } from '@/lib/data/trip-stories';
import { TripStory } from '@/components/stories/trip-story';

// Internal preview: never indexed.
export const metadata: Metadata = {
  title: 'Field notes (internal preview)',
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return tripStories.map((s) => ({ slug: s.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function FieldNotePage({ params }: Props) {
  const { slug } = await params;
  const story = getTripStory(slug);
  if (!story) notFound();
  // Admin route = internal: consent-pending voices and video are shown for review.
  return <TripStory story={story} internal />;
}
