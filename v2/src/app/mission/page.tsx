import { permanentRedirect } from 'next/navigation';

// Updated 2026-07-26 (ruling S). Previously redirected to /story, which is
// itself now retired in favour of /story/road. Point straight at the survivor
// to avoid a redirect chain.
export default function MissionPage() {
  permanentRedirect('/story/road');
}
