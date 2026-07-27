import { permanentRedirect } from 'next/navigation';

// Retired 2026-07-26 (ruling S, the six-front-doors site review). The May
// 2026 trip asset kit overlapped /press, which is the one asset pack.
export default function KitRedirectPage() {
  permanentRedirect('/press');
}
