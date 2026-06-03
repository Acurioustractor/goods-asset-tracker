import type { Metadata } from 'next';
import { QbeSiteWorkspace } from './qbe-site-workspace';

export const metadata: Metadata = {
  title: 'QBE Capital Evidence · Goods on Country',
  description:
    'Investor-facing evidence for the Goods on Country QBE capital pathway, cost model, pricing, impact proof, and readiness gates.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function QbeSitePage() {
  return <QbeSiteWorkspace />;
}
