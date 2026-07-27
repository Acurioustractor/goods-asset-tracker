import { permanentRedirect } from 'next/navigation';

// Retired 2026-07-26 (ruling S, the six-front-doors site review). The wiki
// page duplicated the shop washing machine page. One front door per product.
export default function WikiWashingMachineRedirectPage() {
  permanentRedirect('/shop/washing-machine');
}
