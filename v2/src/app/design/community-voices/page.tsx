import { permanentRedirect } from 'next/navigation';

// Retired 2026-07-26 (ruling S, the six-front-doors site review). Homepage
// design prototype with hardcoded stats.
export default function CommunityVoicesRedirectPage() {
  permanentRedirect('/');
}
