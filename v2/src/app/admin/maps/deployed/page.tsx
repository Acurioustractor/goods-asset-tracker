import DeployedMapView from '@/components/maps/views/deployed';

export const dynamic = 'force-dynamic';

/** In-app view. Add ?chrome=off for the deck-sized render, or use
 *  /export/map/deployed which has no app layout at all. */
export default async function Page({ searchParams }: { searchParams: Promise<{ chrome?: string }> }) {
  const { chrome } = await searchParams;
  return <DeployedMapView chrome={chrome !== 'off'} />;
}
