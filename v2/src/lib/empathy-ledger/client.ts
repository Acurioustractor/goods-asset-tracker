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
} from './types';

// Environment configuration
const EMPATHY_LEDGER_URL = process.env.EMPATHY_LEDGER_API_URL || 'https://empathy-ledger.vercel.app';
const EMPATHY_LEDGER_API_KEY = process.env.EMPATHY_LEDGER_API_KEY || '';
const GOODS_PROJECT_CODE = process.env.EMPATHY_LEDGER_PROJECT_CODE || 'goods-on-country';

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
    if (!ENABLE_EMPATHY_LEDGER) {
      console.warn('[EmpathyLedger] Integration disabled, returning empty array');
      return [];
    }

    try {
      const response = await fetchFromEmpathyLedger<MediaResponse>('/media', {
        project_code: params.projectCode ?? GOODS_PROJECT_CODE,
        organization_id: params.organizationId,
        type: params.type,
        theme: params.theme,
        elder_approved: params.elderApproved,
        cultural_tags: params.culturalTags,
        page: params.page ?? 1,
        limit: params.limit ?? 20,
      });

      console.log(`[EmpathyLedger] GET /media - ${response.media.length} items fetched`);
      return response.media;
    } catch (error) {
      console.error('[EmpathyLedger] Failed to fetch media:', error);
      return [];
    }
  },

  /**
   * Fetch stories
   */
  async getStories(params: StoriesQueryParams = {}): Promise<EmpathyLedgerStory[]> {
    if (!ENABLE_EMPATHY_LEDGER) {
      console.warn('[EmpathyLedger] Integration disabled, returning empty array');
      return [];
    }

    try {
      const response = await fetchFromEmpathyLedger<StoriesResponse>('/stories', {
        project_code: params.projectCode ?? GOODS_PROJECT_CODE,
        theme: params.theme,
        page: params.page ?? 1,
        limit: params.limit ?? 20,
      });

      console.log(`[EmpathyLedger] GET /stories - ${response.stories.length} stories fetched`);
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
    if (!ENABLE_EMPATHY_LEDGER) {
      console.warn('[EmpathyLedger] Integration disabled, returning empty array');
      return [];
    }

    try {
      // Note: This endpoint might need to be added to Empathy Ledger
      // For now, we'll use the profiles endpoint or fall back gracefully
      const response = await fetchFromEmpathyLedger<{ storytellers: EmpathyLedgerStoryteller[] }>(
        '/storytellers',
        {
          project_code: params.projectCode ?? GOODS_PROJECT_CODE,
          featured: params.featured,
          page: params.page ?? 1,
          limit: params.limit ?? 20,
        }
      );

      console.log(`[EmpathyLedger] GET /storytellers - ${response.storytellers.length} profiles fetched`);
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
};

export default empathyLedger;
