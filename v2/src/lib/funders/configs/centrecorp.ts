import type { FunderConfig } from '../types';

/**
 * Centrecorp Foundation — visual impact deck format.
 * Commitment: $208K paid + $84.7K draft = $292,700 across multiple rounds
 * covering 109 beds for Utopia Homelands.
 */
export const centrecorpConfig: FunderConfig = {
  slug: 'centrecorp',
  displayName: 'Centrecorp Foundation',
  contactName: 'Centrecorp Foundation',
  xeroProjectCode: 'ACT-GD',
  reportTitle: (period) => `Goods on Country × Centrecorp — ${period.label} report`,
  preparedBy: 'Nicholas Marchesi · Benjamin Knight',
  commitment: {
    totalAud: 292700,
    totalUnits: 109,
    unitLabel: 'beds',
    paidToDateAud: 208000,
    toBePaidAud: 84700,
    grantReference: 'Aboriginal Trust (NT) — Utopia Homelands round',
  },
  photoTags: ['trip-may-2026'],
  tone: 'short-and-visual',
  sections: [
    'cover',
    'headline',
    'map',
    'hero-photo',
    'photo-grid',
    'voices',
    'why-it-works',
    'how-we-track',
    'impact-numbers',
    'commitment-progress',
    'whats-next',
    'country-acknowledgement',
  ],
};
