import { permanentRedirect } from 'next/navigation';

// Retired 2026-07-26 (ruling S, the six-front-doors site review). /insights
// mapped quotes onto the same five outcome domains /impact already renders,
// so the two were one evidence page told twice. /impact is the survivor.
export default function InsightsRedirectPage() {
  permanentRedirect('/impact');
}
