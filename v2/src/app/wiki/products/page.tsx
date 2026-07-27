import { permanentRedirect } from 'next/navigation';

// Retired 2026-07-26 (ruling S, the six-front-doors site review). The wiki
// product index duplicated /shop. Buyers get one front door.
export default function WikiProductsRedirectPage() {
  permanentRedirect('/shop');
}
