import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTripStory, tripStories } from '@/lib/data/trip-stories';
import { TripStory } from '@/components/stories/trip-story';

interface Props {
  params: Promise<{ slug: string }>;
}

// Only published trip stories exist publicly.
export function generateStaticParams() {
  return tripStories.filter((s) => s.published).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = getTripStory(slug);
  if (!story || !story.published) {
    return { title: 'Not found', robots: { index: false, follow: false } };
  }
  return {
    title: story.title,
    description: story.summary,
    openGraph: { title: story.title, description: story.summary, type: 'article' },
  };
}

export default async function PublicFieldNotePage({ params }: Props) {
  const { slug } = await params;
  const story = getTripStory(slug);
  // Until consent is captured and `published` is flipped to true, this 404s.
  if (!story || !story.published) notFound();
  // Public mode: consent-pending voices and video are hidden automatically.
  return <TripStory story={story} />;
}
