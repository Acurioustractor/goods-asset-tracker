import { permanentRedirect } from 'next/navigation';

// Retired 2026-07-26 (ruling S, the six-front-doors site review). The same
// product page existed in three places; the shop page is the buyer front
// door and leads with spec, price and lead time.
export default function StretchBedRedirectPage() {
  permanentRedirect('/shop/stretch-bed-single');
}
