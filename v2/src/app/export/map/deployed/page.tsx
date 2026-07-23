import DeployedMapView from '@/components/maps/views/deployed';

export const dynamic = 'force-dynamic';

/** Clean 1280x720 deck render of the deployed map. No app chrome. */
export default function Page() {
  return <DeployedMapView chrome={false} />;
}
