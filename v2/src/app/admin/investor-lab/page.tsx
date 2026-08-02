import { InvestorLabClient } from './investor-lab-client';

export const metadata = {
  title: 'Investor narrative lab | Goods on Country pitch',
  description:
    'An interactive workspace for shaping the Goods on Country investor narrative around story, photos, maps, community proof, and deck decisions.',
  // Internal working surface, not a funder destination. Indexed by accident until
  // 2026-07-26; the canonical funder surface is /pitch/funder-pathways.
  robots: { index: false, follow: false },
};

export default function InvestorNarrativeLabPage() {
  return <InvestorLabClient />;
}
