import { permanentRedirect } from 'next/navigation';

// Retired 2026-07-26 (ruling S, the six-front-doors site review). Homepage
// design prototype with hardcoded, non-canonical stats.
export default function CountryFirstRedirectPage() {
  permanentRedirect('/');
}
