import { permanentRedirect } from 'next/navigation';

// Retired 2026-07-26 (ruling S, the six-front-doors site review). One of
// three near-identical internal pitch workshop tools. /pitch/workshop is the
// survivor; the other two redirect there.
export default function InvestorLabRedirectPage() {
  permanentRedirect('/pitch/workshop');
}
