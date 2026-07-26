import { permanentRedirect } from 'next/navigation';

// Retired 2026-07-26 (ruling S, the six-front-doors site review). A thin
// landing that overlapped /about and /story. The canonical surface is
// /story/road. Old links keep working via this redirect.
export default function TheWorkRedirectPage() {
  permanentRedirect('/story/road');
}
