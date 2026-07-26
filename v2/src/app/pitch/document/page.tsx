import { permanentRedirect } from 'next/navigation';

// Retired 2026-07-26 (ruling S, the six-front-doors site review). The long
// prose pitch duplicated /pitch almost line for line, beside the one
// canonical deck. /pitch/road is the deck (ruling R).
export default function PitchDocumentRedirectPage() {
  permanentRedirect('/pitch/road');
}
