import { permanentRedirect } from 'next/navigation';

// Retired 2026-07-26 (ruling S, the six-front-doors site review). One of
// three near-identical internal pitch workshop tools; /pitch/workshop stays.
export default function MiroBoardRedirectPage() {
  permanentRedirect('/pitch/workshop');
}
