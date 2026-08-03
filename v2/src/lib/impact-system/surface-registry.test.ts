import { describe, expect, it } from 'vitest';
import { IMPACT_SURFACES } from './surface-registry';

describe('IMPACT_SURFACES', () => {
  it('uses unique ids and route definitions', () => {
    expect(new Set(IMPACT_SURFACES.map((surface) => surface.id)).size).toBe(IMPACT_SURFACES.length);
    expect(IMPACT_SURFACES.every((surface) => surface.routeOrArtifact.length > 0)).toBe(true);
  });

  it('does not allow target substitution as a fallback', () => {
    expect(IMPACT_SURFACES.some((surface) => surface.fallbackBehavior === 'target_substitution')).toBe(false);
  });

  it('marks public voice-bearing surfaces for consent and cultural gating', () => {
    const publicVoiceSurfaces = IMPACT_SURFACES.filter((surface) =>
      ['public-stories', 'story-road', 'community-page', 'partner-outcomes', 'impact-report-template'].includes(
        surface.id,
      ),
    );
    expect(publicVoiceSurfaces.every((surface) => surface.consentGate === 'required')).toBe(true);
    expect(publicVoiceSurfaces.every((surface) => surface.culturalGate === 'required')).toBe(true);
  });
});

