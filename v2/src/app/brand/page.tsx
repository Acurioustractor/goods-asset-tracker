import { permanentRedirect } from 'next/navigation';

// Retired 2026-07-26 (ruling S, the six-front-doors site review). The brand
// guide duplicated the identity half of /press, which is the one asset pack.
export default function BrandRedirectPage() {
  permanentRedirect('/press');
}
