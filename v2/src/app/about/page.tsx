import { permanentRedirect } from 'next/navigation';

// Retired 2026-07-26 (ruling S, the six-front-doors site review). /about told
// the origin story at a third length beside /story and /story/road. The
// canonical surface is /story/road. Old links keep working via this redirect.
export default function AboutRedirectPage() {
  permanentRedirect('/story/road');
}
