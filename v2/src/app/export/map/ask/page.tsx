import AskMapView from '@/components/maps/views/ask';

export const dynamic = 'force-dynamic';

/** Clean 1280x720 deck render of the ask map. No app chrome. */
export default function Page() {
  return <AskMapView chrome={false} />;
}
