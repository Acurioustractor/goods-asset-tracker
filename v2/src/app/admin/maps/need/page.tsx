import NeedMapView from '@/components/maps/views/need';

export const dynamic = 'force-dynamic';

/** In-app view. Add ?chrome=off for the deck-sized render, or use
 *  /export/map/need which has no app layout at all. */
export default async function Page({ searchParams }: { searchParams: Promise<{ chrome?: string }> }) {
  const { chrome } = await searchParams;
  return <NeedMapView chrome={chrome !== 'off'} />;
}
