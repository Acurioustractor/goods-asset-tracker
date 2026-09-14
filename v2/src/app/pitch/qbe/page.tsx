import type { Metadata } from 'next';
import { PitchContent } from '@/components/pitch/pitch-content';

/**
 * THE PITCH, for QBE. Gated in src/proxy.ts (shared investor-cockpit password). Full version:
 * the QBE request, the raise broken out by funder, and every real unit's price. See
 * pitch-content.tsx for what differs from the overview door at /pitch.
 */
export const metadata: Metadata = {
  title: { absolute: 'The pitch, for QBE | Goods on Country' },
  description: 'The QBE Stage 2 pitch: the road so far, the bed, the facility, how the trade works, the whole model on one sheet, the money and the request, and what we will measure.',
  robots: { index: false, follow: false },
};

export default async function PitchQbePage() {
  return <PitchContent variant="qbe" />;
}
