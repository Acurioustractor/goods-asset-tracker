import { PitchWorkshopClient } from './workshop-client';

export const metadata = {
  title: 'Pitch workshop | Goods on Country',
  description:
    'An interactive pitch workshop for aligning the Goods on Country message, community voices, photos, and ownership pathway.',
  // Internal working surface, not a funder destination. Indexed by accident until
  // 2026-07-26; the canonical funder surface is /pitch/funder-pathways.
  robots: { index: false, follow: false },
};

export default function PitchWorkshopPage() {
  return <PitchWorkshopClient />;
}

