import type { Metadata } from 'next';
import { CostLabWorkspace } from './cost-lab-workspace';

export const metadata: Metadata = {
  title: 'Cost Lab',
  description:
    'Internal first-principles cost working room: raw component amounts, container build coster, funding alignment and compounding growth math.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CostLabPage() {
  return <CostLabWorkspace />;
}
