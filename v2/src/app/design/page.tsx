import { permanentRedirect } from 'next/navigation';

// Retired 2026-07-26 (ruling S, the six-front-doors site review). The design
// prototype index served its purpose; the concepts are in git history.
export default function DesignRedirectPage() {
  permanentRedirect('/');
}
