import { permanentRedirect } from 'next/navigation';

// Retired 2026-07-26 (ruling S, the six-front-doors site review). The pitch
// hub duplicated /pitch/document and pointed at surfaces that have since
// been consolidated. /pitch/road is the deck (ruling R).
export default function PitchIndexRedirectPage() {
  permanentRedirect('/pitch/road');
}
