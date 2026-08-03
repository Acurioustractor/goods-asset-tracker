export type ImpactSurfaceStatus = 'live' | 'migrate' | 'retire' | 'internal_only';

export interface ImpactSurfaceDefinition {
  id: string;
  routeOrArtifact: string;
  audience: Array<'community' | 'operations' | 'public' | 'funder' | 'storyteller'>;
  purpose: string;
  dataSources: string[];
  consentGate: 'required' | 'not_applicable' | 'incomplete';
  culturalGate: 'required' | 'not_applicable' | 'incomplete';
  communityApprovalGate: 'required' | 'not_applicable' | 'incomplete';
  fallbackBehavior: 'show_unavailable' | 'local_curated_data' | 'target_substitution' | 'unknown';
  cacheBehavior: string;
  status: ImpactSurfaceStatus;
  replacementSurfaceId?: string;
  notes?: string[];
}

/**
 * Initial registry for impact-bearing Goods surfaces. This is intentionally
 * code-owned so route audits and tests can stop retired fallbacks reappearing.
 */
export const IMPACT_SURFACES: ImpactSurfaceDefinition[] = [
  {
    id: 'public-impact',
    routeOrArtifact: '/impact',
    audience: ['public', 'funder', 'community'],
    purpose: 'Public overview of the five outcome domains and their evidence status.',
    dataSources: ['impact-model.ts', 'impact-fetcher.ts', 'asset register', 'Empathy Ledger'],
    consentGate: 'required',
    culturalGate: 'required',
    communityApprovalGate: 'incomplete',
    fallbackBehavior: 'show_unavailable',
    cacheBehavior: 'dynamic impact snapshot',
    status: 'migrate',
    notes: ['Move to the shared governed claim graph after the Community Impact Cycle is live.'],
  },
  {
    id: 'public-stories',
    routeOrArtifact: '/stories',
    audience: ['public', 'community', 'storyteller'],
    purpose: 'Approved community voices and published story material.',
    dataSources: ['Empathy Ledger', 'Goods cleared-voice registry', 'local story fallback'],
    consentGate: 'required',
    culturalGate: 'required',
    communityApprovalGate: 'incomplete',
    fallbackBehavior: 'local_curated_data',
    cacheBehavior: 'request-time fetch with local fallback',
    status: 'migrate',
  },
  {
    id: 'story-road',
    routeOrArtifact: '/story/road',
    audience: ['public', 'funder', 'community'],
    purpose: 'Sequential place, voice, figure and evidence-gap narrative.',
    dataSources: ['story-road.ts', 'canonical Goods data', 'approved media'],
    consentGate: 'required',
    culturalGate: 'required',
    communityApprovalGate: 'incomplete',
    fallbackBehavior: 'show_unavailable',
    cacheBehavior: 'static application data',
    status: 'migrate',
  },
  {
    id: 'community-page',
    routeOrArtifact: '/communities/[slug]',
    audience: ['community', 'public', 'funder'],
    purpose: 'Place-based assets, voices, pathway and partner context.',
    dataSources: ['community data', 'asset register', 'Empathy Ledger', 'media registry'],
    consentGate: 'required',
    culturalGate: 'required',
    communityApprovalGate: 'incomplete',
    fallbackBehavior: 'local_curated_data',
    cacheBehavior: 'mixed static and request-time data',
    status: 'migrate',
  },
  {
    id: 'community-pathway',
    routeOrArtifact: '/pathways/[id]',
    audience: ['community', 'operations', 'funder'],
    purpose: 'Community-selected modules, readiness and movement toward transfer.',
    dataSources: ['community-pathways.ts', 'pathway-stages.ts', 'cost model'],
    consentGate: 'not_applicable',
    culturalGate: 'incomplete',
    communityApprovalGate: 'incomplete',
    fallbackBehavior: 'show_unavailable',
    cacheBehavior: 'static application data',
    status: 'migrate',
  },
  {
    id: 'partner-outcomes',
    routeOrArtifact: '/partners/[slug]/outcomes',
    audience: ['funder', 'operations', 'community'],
    purpose: 'Partner-specific delivery, voice and next-measurement report.',
    dataSources: ['community_rollup', 'partner dashboard data', 'Empathy Ledger'],
    consentGate: 'required',
    culturalGate: 'required',
    communityApprovalGate: 'incomplete',
    fallbackBehavior: 'local_curated_data',
    cacheBehavior: 'request-time data with committed-value floors',
    status: 'migrate',
    notes: ['Separate committed, delivered and measured figures before public use.'],
  },
  {
    id: 'impact-report-template',
    routeOrArtifact: '/admin/reports/impact/[templateId]',
    audience: ['operations', 'funder', 'public'],
    purpose: 'Audience-specific report preview using current metrics and approved stories.',
    dataSources: ['impact model', 'impact fetcher', 'Empathy Ledger'],
    consentGate: 'required',
    culturalGate: 'required',
    communityApprovalGate: 'incomplete',
    fallbackBehavior: 'show_unavailable',
    cacheBehavior: 'force dynamic, no revalidation',
    status: 'migrate',
  },
  {
    id: 'voice-impact-admin',
    routeOrArtifact: '/admin/voice-impact',
    audience: ['operations'],
    purpose: 'Interview-corpus coverage, quote review and consent status.',
    dataSources: ['voice-impact-data.json', 'storyteller registry'],
    consentGate: 'required',
    culturalGate: 'required',
    communityApprovalGate: 'incomplete',
    fallbackBehavior: 'show_unavailable',
    cacheBehavior: 'bundled analysis snapshot',
    status: 'internal_only',
  },
  {
    id: 'story-atlas-admin',
    routeOrArtifact: '/admin/story-atlas',
    audience: ['operations'],
    purpose: 'Narrative coverage and evidence-gap map.',
    dataSources: ['storyteller registry', 'story road', 'canonical metrics'],
    consentGate: 'required',
    culturalGate: 'required',
    communityApprovalGate: 'incomplete',
    fallbackBehavior: 'show_unavailable',
    cacheBehavior: 'bundled application data',
    status: 'internal_only',
  },
  {
    id: 'asset-register',
    routeOrArtifact: '/register',
    audience: ['operations', 'funder'],
    purpose: 'Physical asset, deployment and status truth.',
    dataSources: ['Goods asset register'],
    consentGate: 'not_applicable',
    culturalGate: 'incomplete',
    communityApprovalGate: 'not_applicable',
    fallbackBehavior: 'show_unavailable',
    cacheBehavior: 'request-time database data',
    status: 'live',
  },
  {
    id: 'cost-story',
    routeOrArtifact: '/cost-story',
    audience: ['public', 'funder', 'operations'],
    purpose: 'Current and modelled economics with assumptions and sensitivity.',
    dataSources: ['cost model', 'supplier quotes', 'cost-story.ts'],
    consentGate: 'not_applicable',
    culturalGate: 'not_applicable',
    communityApprovalGate: 'not_applicable',
    fallbackBehavior: 'show_unavailable',
    cacheBehavior: 'bundled canonical model',
    status: 'live',
  },
];

export function findImpactSurface(id: string): ImpactSurfaceDefinition | undefined {
  return IMPACT_SURFACES.find((surface) => surface.id === id);
}

