import { permanentRedirect } from 'next/navigation';

// Retired 2026-07-26 (ruling S, the six-front-doors site review). The wiki
// spec guide duplicated the shop product page. Buyers get one front door.
export default function WikiStretchBedRedirectPage() {
  permanentRedirect('/shop/stretch-bed-single');
}
