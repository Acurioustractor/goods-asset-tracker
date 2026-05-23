import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getTripStory, tripStories } from '@/lib/data/trip-stories';
import { TripStory } from '@/components/stories/trip-story';
import { resolveGalleryBlocks } from '@/lib/field-notes/resolve-gallery';
import { VoiceStatusPanel } from '@/components/admin/voice-status-panel';

// Internal preview: never indexed.
export const metadata: Metadata = {
  title: 'Field notes (internal preview)',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

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
  // Admin route = internal: consent-pending photos and voices are shown so
  // editors can curate before the public view goes live.
  const resolved = await resolveGalleryBlocks(story, { internal: true });
  return (
    <>
      <VoiceStatusPanel story={story} />
      <TripStory story={resolved} internal />
    </>
  );
}
