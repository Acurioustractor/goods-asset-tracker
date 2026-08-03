import { describe, expect, it } from 'vitest';
import { evidencePacksForCommunity, getEvidencePack } from './evidence-packs';

describe('proposed evidence packs', () => {
  it('offers the Homelands School pack only for Maningrida', () => {
    expect(evidencePacksForCommunity('maningrida')).toHaveLength(1);
    expect(evidencePacksForCommunity('palm-island')).toHaveLength(0);
  });

  it('keeps every proposed observation private and bounded', () => {
    const pack = getEvidencePack('maningrida-homelands-school-nic-interview-v1');
    expect(pack).toBeDefined();
    for (const observation of pack?.observations || []) {
      expect(observation.restricted).toBe(true);
      expect(observation.claimBoundary.length).toBeGreaterThan(20);
      expect(observation.evidenceVersion).toContain('#');
    }
  });
});
