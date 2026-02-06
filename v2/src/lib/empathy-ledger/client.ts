/**
 * Empathy Ledger API Client
 * Client for fetching content from the ACT Content Hub
 */

import type {
  EmpathyLedgerMedia,
  EmpathyLedgerStory,
  EmpathyLedgerStoryteller,
  ContentPlacement,
  MediaResponse,
  StoriesResponse,
  PlacementsResponse,
  MediaQueryParams,
  StoriesQueryParams,
  StorytellersQueryParams,
  PlacementsQueryParams,
  SyndicationStoryteller,
  SyndicationStorytellersResponse,
  SyndicationStorytellerResponse,
  ProjectInsights,
} from './types';

// Environment configuration
const EMPATHY_LEDGER_URL = process.env.EMPATHY_LEDGER_API_URL || 'https://empathy-ledger.vercel.app';
const EMPATHY_LEDGER_API_KEY = process.env.EMPATHY_LEDGER_API_KEY || '';
const GOODS_PROJECT_CODE = process.env.EMPATHY_LEDGER_PROJECT_CODE || 'goods-on-country';
const GOODS_SITE_SLUG = process.env.EMPATHY_LEDGER_SITE_SLUG || 'goods-on-country';
const GOODS_PROJECT_ID = process.env.EMPATHY_LEDGER_PROJECT_ID || '';

// Feature flag to enable/disable Empathy Ledger
const ENABLE_EMPATHY_LEDGER = process.env.ENABLE_EMPATHY_LEDGER !== 'false';

/**
 * Build query string from params object
 */
function buildQueryString(params: Record<string, unknown>): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      searchParams.set(key, value.join(','));
    } else if (typeof value === 'boolean') {
      searchParams.set(key, value.toString());
    } else {
      searchParams.set(key, String(value));
    }
  }

  return searchParams.toString();
}

/**
 * Make authenticated request to Empathy Ledger API
 */
async function fetchFromEmpathyLedger<T>(
  endpoint: string,
  params: Record<string, unknown> = {},
  options: { revalidate?: number } = {}
): Promise<T> {
  const queryString = buildQueryString(params);
  const url = `${EMPATHY_LEDGER_URL}/api/v1/content-hub${endpoint}${queryString ? `?${queryString}` : ''}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add API key for ecosystem-level access
  if (EMPATHY_LEDGER_API_KEY) {
    headers['X-API-Key'] = EMPATHY_LEDGER_API_KEY;
  }

  const response = await fetch(url, {
    headers,
    next: { revalidate: options.revalidate ?? 300 }, // Cache for 5 minutes by default
  });

  if (!response.ok) {
    throw new Error(`Empathy Ledger API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Make authenticated request to the Empathy Ledger Syndication API
 * Uses /api/v1/sites/{siteSlug}/ endpoints which return rich analysis data
 */
async function fetchFromSyndicationAPI<T>(
  endpoint: string,
  params: Record<string, unknown> = {},
  options: { revalidate?: number } = {}
): Promise<T> {
  const queryString = buildQueryString(params);
  const url = `${EMPATHY_LEDGER_URL}/api/v1/sites/${GOODS_SITE_SLUG}${endpoint}${queryString ? `?${queryString}` : ''}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Use Authorization Bearer header for syndication API
  if (EMPATHY_LEDGER_API_KEY) {
    headers['Authorization'] = `Bearer ${EMPATHY_LEDGER_API_KEY}`;
  }

  const response = await fetch(url, {
    headers,
    next: { revalidate: options.revalidate ?? 300 },
  });

  if (!response.ok) {
    throw new Error(`Empathy Ledger Syndication API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Empathy Ledger Client
 */
export const empathyLedger = {
  /**
   * Check if Empathy Ledger integration is enabled
   */
  isEnabled(): boolean {
    return ENABLE_EMPATHY_LEDGER;
  },

  /**
   * Fetch media assets (photos, videos, audio)
   */
  async getMedia(params: MediaQueryParams = {}): Promise<EmpathyLedgerMedia[]> {
    if (!ENABLE_EMPATHY_LEDGER) return [];

    try {
      const response = await fetchFromEmpathyLedger<MediaResponse>('/media', {
        type: params.type,
        elder_approved: params.elderApproved,
        cultural_tags: params.culturalTags?.join(','),
        project_code: params.projectCode ?? GOODS_PROJECT_CODE,
        limit: params.limit,
        page: params.page,
      });
      return response.media;
    } catch (error) {
      console.error('[EmpathyLedger] Failed to fetch media:', error);
      return [];
    }
  },

  /**
   * Fetch a single story by ID
   */
  async getStory(id: string): Promise<EmpathyLedgerStory | null> {
    if (!ENABLE_EMPATHY_LEDGER) return null;

    try {
      const story = await fetchFromEmpathyLedger<EmpathyLedgerStory>(`/stories/${id}`);
      return story;
    } catch (error) {
      console.error(`[EmpathyLedger] Failed to fetch story ${id}:`, error);
      return null;
    }
  },

  /**
   * Fetch stories
   */
  async getStories(params: StoriesQueryParams = {}): Promise<EmpathyLedgerStory[]> {
    if (!ENABLE_EMPATHY_LEDGER) return [];

    try {
      const response = await fetchFromEmpathyLedger<StoriesResponse>('/stories', {
        theme: params.theme,
        limit: params.limit,
        page: params.page,
      });
      return response.stories;
    } catch (error) {
      console.error('[EmpathyLedger] Failed to fetch stories:', error);
      return [];
    }
  },

  /**
   * Fetch storyteller/artisan profiles
   */
  async getStorytellers(params: StorytellersQueryParams = {}): Promise<EmpathyLedgerStoryteller[]> {
    if (!ENABLE_EMPATHY_LEDGER) return [];

    try {
      const response = await fetchFromEmpathyLedger<{ storytellers: EmpathyLedgerStoryteller[] }>('/storytellers', {
        featured: params.featured,
        limit: params.limit,
        page: params.page,
      });
      return response.storytellers;
    } catch (error) {
      console.error('[EmpathyLedger] Failed to fetch storytellers:', error);
      return [];
    }
  },

  /**
   * Fetch featured content for homepage
   * Combines stories and media for a rich homepage experience
   */
  async getFeaturedContent(): Promise<{
    stories: EmpathyLedgerStory[];
    media: EmpathyLedgerMedia[];
  }> {
    if (!ENABLE_EMPATHY_LEDGER) {
      return { stories: [], media: [] };
    }

    try {
      const [stories, media] = await Promise.all([
        this.getStories({ limit: 3 }),
        this.getMedia({ type: 'image', elderApproved: true, limit: 6 }),
      ]);

      return { stories, media };
    } catch (error) {
      console.error('[EmpathyLedger] Failed to fetch featured content:', error);
      return { stories: [], media: [] };
    }
  },

  /**
   * Fetch community-specific content
   */
  async getCommunityContent(community: string): Promise<{
    stories: EmpathyLedgerStory[];
    media: EmpathyLedgerMedia[];
  }> {
    if (!ENABLE_EMPATHY_LEDGER) {
      return { stories: [], media: [] };
    }

    try {
      const [stories, media] = await Promise.all([
        this.getStories({ theme: community, limit: 5 }),
        this.getMedia({ culturalTags: [community], type: 'image', limit: 12 }),
      ]);

      return { stories, media };
    } catch (error) {
      console.error(`[EmpathyLedger] Failed to fetch content for ${community}:`, error);
      return { stories: [], media: [] };
    }
  },

  /**
   * Fetch product-related content (testimonials, photos)
   */
  async getProductContent(productType: string): Promise<{
    testimonials: EmpathyLedgerStory[];
    media: EmpathyLedgerMedia[];
  }> {
    if (!ENABLE_EMPATHY_LEDGER) {
      return { testimonials: [], media: [] };
    }

    try {
      const [testimonials, media] = await Promise.all([
        this.getStories({ theme: 'testimonial', limit: 3 }),
        this.getMedia({
          culturalTags: [productType],
          elderApproved: true,
          type: 'image',
          limit: 8,
        }),
      ]);

      return { testimonials, media };
    } catch (error) {
      console.error(`[EmpathyLedger] Failed to fetch content for ${productType}:`, error);
      return { testimonials: [], media: [] };
    }
  },

  /**
   * Fetch impact stories for the impact page
   */
  async getImpactContent(): Promise<{
    stories: EmpathyLedgerStory[];
    media: EmpathyLedgerMedia[];
    videos: EmpathyLedgerMedia[];
  }> {
    if (!ENABLE_EMPATHY_LEDGER) {
      return { stories: [], media: [], videos: [] };
    }

    try {
      const [stories, media, videos] = await Promise.all([
        this.getStories({ theme: 'impact', limit: 10 }),
        this.getMedia({ type: 'image', elderApproved: true, limit: 20 }),
        this.getMedia({ type: 'video', elderApproved: true, limit: 5 }),
      ]);

      return { stories, media, videos };
    } catch (error) {
      console.error('[EmpathyLedger] Failed to fetch impact content:', error);
      return { stories: [], media: [], videos: [] };
    }
  },

  /**
   * Fetch content placements — slot-keyed media assignments
   * Returns a map of slot_key → placement with resolved media asset
   */
  async getPlacements(params: PlacementsQueryParams = {}): Promise<Record<string, ContentPlacement>> {
    if (!ENABLE_EMPATHY_LEDGER) {
      return {};
    }

    try {
      const response = await fetchFromEmpathyLedger<PlacementsResponse>('/placements', {
        project_code: params.projectCode ?? GOODS_PROJECT_CODE,
        placement_type: params.placementType,
        tags: params.tags?.join(','),
        slot_key: params.slotKey,
        include_empty: params.includeEmpty,
      }, { revalidate: 300 });

      console.log(`[EmpathyLedger] GET /placements - ${response.meta.totalSlots} slots (${response.meta.withMedia} with media)`);
      return response.placements;
    } catch (error) {
      console.error('[EmpathyLedger] Failed to fetch placements:', error);
      return {};
    }
  },

  /**
   * Get a single placement's media URL by slot key
   * Returns the URL string or undefined if no media assigned
   */
  async getSlotUrl(slotKey: string): Promise<string | undefined> {
    const placements = await this.getPlacements({ slotKey });
    return placements[slotKey]?.media?.url;
  },

  // =============================================================
  // Syndication API — rich analysis data (themes, quotes, impact)
  // =============================================================

  /**
   * Fetch storytellers for the Goods project with full analysis data
   */
  async getProjectStorytellers(params: {
    projectId?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<SyndicationStoryteller[]> {
    if (!ENABLE_EMPATHY_LEDGER) return [];

    const projectId = params.projectId || GOODS_PROJECT_ID;
    if (!projectId) {
      console.warn('[EmpathyLedger] No project ID — set EMPATHY_LEDGER_PROJECT_ID');
      return [];
    }

    try {
      const response = await fetchFromSyndicationAPI<SyndicationStorytellersResponse>(
        `/projects/${projectId}/storytellers`,
        {
          limit: params.limit,
          offset: params.offset,
        }
      );
      console.log(`[EmpathyLedger] Syndication: ${response.storytellers.length} storytellers loaded`);
      return response.storytellers;
    } catch (error) {
      console.error('[EmpathyLedger] Failed to fetch project storytellers:', error);
      return [];
    }
  },

  /**
   * Fetch a single storyteller's full profile + analysis
   */
  async getStoryteller(storytellerId: string): Promise<SyndicationStoryteller | null> {
    if (!ENABLE_EMPATHY_LEDGER) return null;

    try {
      const response = await fetchFromSyndicationAPI<SyndicationStorytellerResponse>(
        `/storytellers/${storytellerId}`
      );

      console.log(`[EmpathyLedger] Syndication: storyteller ${response.storyteller.name} loaded`);
      return response.storyteller;
    } catch (error) {
      console.error(`[EmpathyLedger] Failed to fetch storyteller ${storytellerId}:`, error);
      return null;
    }
  },

  /**
   * Fetch project-level aggregated insights
   * (aggregated themes, top quotes, impact dimensions, ALMA signals)
   */
  async getProjectInsights(projectId?: string): Promise<ProjectInsights | null> {
    if (!ENABLE_EMPATHY_LEDGER) return null;

    const id = projectId || GOODS_PROJECT_ID;
    if (!id) {
      console.warn('[EmpathyLedger] No project ID configured — set EMPATHY_LEDGER_PROJECT_ID');
      return null;
    }

    try {
      const response = await fetchFromSyndicationAPI<ProjectInsights>(
        `/projects/${id}/insights`
      );

      console.log(`[EmpathyLedger] Syndication: project insights loaded (${response.themes.length} themes)`);
      return response;
    } catch (error) {
      console.error('[EmpathyLedger] Failed to fetch project insights:', error);
      return null;
    }
  },
};

export default empathyLedger;
