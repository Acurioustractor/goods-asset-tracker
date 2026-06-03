import type { Metadata } from 'next';
import { QbeSiteWorkspace } from './qbe-site-workspace';

export const metadata: Metadata = {
  title: 'QBE Capital Site',
  description:
    'A Codex Sites style review workspace for the Goods on Country QBE capital ask, cost model, pricing, brand evidence, and next actions.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function QbeSitePage() {
  return <QbeSiteWorkspace />;
}
