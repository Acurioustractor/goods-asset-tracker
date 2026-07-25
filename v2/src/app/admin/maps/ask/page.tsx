import AskMapView from '@/components/maps/views/ask';

export const dynamic = 'force-dynamic';

/** In-app view. Add ?chrome=off for the deck-sized render, or use
 *  /export/map/ask which has no app layout at all. */
export default async function Page({ searchParams }: { searchParams: Promise<{ chrome?: string }> }) {
  const { chrome } = await searchParams;
  return <AskMapView chrome={chrome !== 'off'} />;
}
