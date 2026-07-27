import { permanentRedirect } from 'next/navigation';

// Retired 2026-07-26 (ruling S, the six-front-doors site review). A
// Reconciliation Week 2026 activation page, time-bound and now stale.
export default function CanberraRedirectPage() {
  permanentRedirect('/');
}
