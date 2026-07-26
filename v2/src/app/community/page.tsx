import { permanentRedirect } from 'next/navigation';

// Retired 2026-07-26 (ruling S, the six-front-doors site review). /community
// was a storyteller showcase whose name collided with /communities, the real
// per-community index. /community/ideas is untouched and still lives.
export default function CommunityRedirectPage() {
  permanentRedirect('/communities');
}
