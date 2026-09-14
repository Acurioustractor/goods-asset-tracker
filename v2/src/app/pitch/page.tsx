import type { Metadata } from 'next';
import { PitchContent } from '@/components/pitch/pitch-content';

/**
 * THE PITCH, overview door. Same story and the same model as /pitch/qbe, without the QBE
 * request or the per-funder raise breakdown. For anyone this pitch is shown to who isn't
 * reading it as a QBE reviewer. See pitch-content.tsx for what differs and why.
 */
export const metadata: Metadata = {
  title: { absolute: 'The pitch | Goods on Country' },
  description: 'Useful goods start community enterprise. The road so far, the bed, the facility, how the trade works, the whole model on one sheet, and what we will measure.',
  robots: { index: false, follow: false },
};

export default async function PitchOverviewPage() {
  return <PitchContent variant="overview" />;
}
