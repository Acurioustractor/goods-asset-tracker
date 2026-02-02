/**
 * Empathy Ledger API Types
 * Types for the ACT Content Hub integration
 */

// Media asset from Empathy Ledger
export interface EmpathyLedgerMedia {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  title: string | null;
  description: string | null;
  altText: string | null;
  mediaType: 'image' | 'video' | 'audio';
  width: number | null;
  height: number | null;
  duration: number | null; // seconds, for video/audio

  // ACT Ecosystem metadata
  organizationId: string | null;
  projectCode: string | null;

  // Cultural safety
  elderApproved: boolean;
  consentObtained: boolean;
  culturalTags: string[];
  culturalSensitivity: 'low' | 'medium' | 'high' | null;
  attributionText: string | null;

  // Provenance
  uploaderName: string | null;
  createdAt: string;
}

// Story from Empathy Ledger
export interface EmpathyLedgerStory {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  authorName: string;
  authorId: string | null;
  publishedAt: string;
  themes: string[];
  visibility: string;
  isPublic: boolean;
  featuredImageUrl: string | null;

  // Cultural context
  culturalSensitivity: string | null;
  elderApproved: boolean;
  consentVerified: boolean;
}

// Storyteller/artisan profile (basic — from content-hub)
export interface EmpathyLedgerStoryteller {
  id: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  culturalBackground: string | null;
  specialties: string[];
  elderStatus: boolean;
  storyCount: number;
  featured: boolean;
  community: string | null;
}

// --- Syndication API types (rich analysis data) ---

export interface StorytellerTheme {
  name: string;
  displayName: string;
  weight: number;
  culturalContext?: string | null;
  countryConnection?: string | null;
}

export interface StorytellerQuote {
  text: string;
  context: string | null;
  culturalSignificance?: string | null;
  theme?: string | null;
  impactScore: number | null;
  storytellerName?: string;
}

export interface CulturalMarker {
  type: string;
  content: string;
  significance: string | null;
  intergenerational: boolean;
  countryConnection: string | null;
}

export interface ImpactDimensions {
  individual?: Record<string, number>;
  community?: Record<string, number>;
  environmental?: Record<string, number>;
  alma?: Record<string, number>;
  [key: string]: Record<string, number> | undefined;
}

// Storyteller with analysis data (from syndication API)
export interface SyndicationStoryteller {
  id: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  culturalBackground: string[];
  location: string | null;
  isElder: boolean;
  themes: StorytellerTheme[];
  quotes: StorytellerQuote[];
  impactDimensions: ImpactDimensions | null;
  emotionalTone: string | null;
  qualityScore: number | null;
  transcriptCount: number;
  // Full profile fields (from individual storyteller endpoint)
  expertiseAreas?: string[];
  languageSkills?: string[];
  almaSignals?: Record<string, unknown> | null;
  culturalMarkers?: CulturalMarker[];
  mediaCount?: number;
  analyzedAt?: string | null;
}

// Project insights (from syndication API)
export interface ProjectInsights {
  project: {
    id: string;
    name: string;
    storytellerCount: number;
    transcriptCount: number;
  };
  themes: Array<{
    name: string;
    displayName: string;
    frequency: number;
    storytellerCount: number;
    culturalContexts: string[];
  }>;
  topQuotes: StorytellerQuote[];
  impactDimensions: Record<string, unknown>;
  almaSignals: Record<string, unknown> | null;
  lcaaRhythm: Record<string, unknown> | null;
  conservationOutcomes: Record<string, unknown> | null;
  sovereigntyIndicators: Record<string, unknown> | null;
  analyzedAt: string | null;
}

// API Response wrappers
export interface MediaResponse {
  media: EmpathyLedgerMedia[];
  pagination: Pagination;
  ecosystem: EcosystemMeta;
}

export interface StoriesResponse {
  stories: EmpathyLedgerStory[];
  pagination: Pagination;
}

export interface StorytellersResponse {
  storytellers: EmpathyLedgerStoryteller[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface EcosystemMeta {
  source: string;
  version: string;
  accessLevel: 'anonymous' | 'ecosystem' | 'community';
  filters: Record<string, unknown>;
}

// Query parameters
export interface MediaQueryParams {
  projectCode?: string;
  organizationId?: string;
  type?: 'image' | 'video' | 'audio';
  theme?: string;
  elderApproved?: boolean;
  culturalTags?: string[];
  page?: number;
  limit?: number;
}

export interface StoriesQueryParams {
  projectCode?: string;
  theme?: string;
  page?: number;
  limit?: number;
}

export interface StorytellersQueryParams {
  projectCode?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

// Content Placement — maps a slot key to a media asset
export interface ContentPlacement {
  id: string;
  slotKey: string;
  placementType: 'hero' | 'gallery' | 'avatar' | 'background' | 'thumbnail' | 'video' | 'process';
  title: string | null;
  altText: string | null;
  tags: string[];
  priority: number;
  placedAt: string;
  media: {
    id: string;
    url: string;
    thumbnailUrl: string | null;
    title: string | null;
    description: string | null;
    altText: string | null;
    mediaType: 'image' | 'video' | 'audio';
    width: number | null;
    height: number | null;
    duration: number | null;
    elderApproved: boolean;
    consentObtained: boolean;
    culturalTags: string[];
    attributionText: string | null;
  } | null;
}

export interface PlacementsResponse {
  placements: Record<string, ContentPlacement>;
  list: ContentPlacement[];
  meta: {
    projectCode: string;
    totalSlots: number;
    withMedia: number;
    withoutMedia: number;
  };
  ecosystem: EcosystemMeta;
}

export interface PlacementsQueryParams {
  projectCode?: string;
  placementType?: string;
  tags?: string[];
  slotKey?: string;
  includeEmpty?: boolean;
}

// Syndication API response wrappers
export interface SyndicationStorytellersResponse {
  storytellers: SyndicationStoryteller[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface SyndicationStorytellerResponse {
  storyteller: SyndicationStoryteller;
}
