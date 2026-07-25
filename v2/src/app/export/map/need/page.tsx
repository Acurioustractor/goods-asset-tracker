import NeedMapView from '@/components/maps/views/need';

export const dynamic = 'force-dynamic';

/** Clean 1280x720 deck render of the need map. No app chrome. */
export default function Page() {
  return <NeedMapView chrome={false} />;
}
