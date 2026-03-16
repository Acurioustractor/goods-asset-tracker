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
  ELGallery,
  ELGalleryPhoto,
} from './types';

// Environment configuration
const EMPATHY_LEDGER_URL = process.env.EMPATHY_LEDGER_API_URL || 'https://empathy-ledger.vercel.app';
const EMPATHY_LEDGER_API_KEY = process.env.EMPATHY_LEDGER_API_KEY || '';
const GOODS_PROJECT_CODE = process.env.EMPATHY_LEDGER_PROJECT_CODE || 'goods-on-country';
const GOODS_SITE_SLUG = process.env.EMPATHY_LEDGER_SITE_SLUG || 'goods-asset-register';
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
 * Make request to the plain Empathy Ledger API (/api/stories)
 * Returns full story records with content, images, and consent fields
 */
async function fetchFromPlainAPI<T>(
  endpoint: string,
  params: Record<string, unknown> = {},
  options: { revalidate?: number } = {}
): Promise<T> {
  const queryString = buildQueryString(params);
  const url = `${EMPATHY_LEDGER_URL}/api${endpoint}${queryString ? `?${queryString}` : ''}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (EMPATHY_LEDGER_API_KEY) {
    headers['X-API-Key'] = EMPATHY_LEDGER_API_KEY;
  }

  const response = await fetch(url, {
    headers,
    next: { revalidate: options.revalidate ?? 300 },
  });

  if (!response.ok) {
    throw new Error(`Empathy Ledger API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Map a snake_case story from the plain API to camelCase EmpathyLedgerStory
 */
function mapStoryFromAPI(raw: Record<string, unknown>): EmpathyLedgerStory {
  return {
    id: String(raw.id ?? ''),
    title: String(raw.title ?? ''),
    summary: (raw.summary as string) ?? (raw.excerpt as string) ?? null,
    content: (raw.content as string) ?? null,
    authorName: (raw.author_name as string) ?? (raw.storyteller_name as string) ?? 'Unknown',
    authorId: (raw.author_id as string) ?? (raw.storyteller_id as string) ?? null,
    publishedAt: String(raw.published_at ?? raw.created_at ?? ''),
    themes: (raw.themes as (string | { name: string })[]) ?? [],
    visibility: (raw.visibility as string) ?? 'public',
    isPublic: raw.is_public !== false,
    featuredImageUrl: (raw.featured_image_url as string) ?? (raw.featuredImageUrl as string) ?? null,
    culturalSensitivity: (raw.cultural_sensitivity as string) ?? null,
    elderApproved: Boolean(raw.elder_approved ?? raw.elderApproved ?? false),
    consentVerified: Boolean(raw.consent_verified ?? raw.consentVerified ?? false),
    syndicationEnabled: Boolean(raw.syndication_enabled ?? false),
    consentWithdrawnAt: (raw.consent_withdrawn_at as string) ?? null,
    isArchived: Boolean(raw.is_archived ?? false),
    storytellerId: (raw.storyteller_id as string) ?? null,
    storytellerName: (raw.storyteller_name as string) ?? null,
    tags: (raw.tags as string[]) ?? [],
    excerpt: (raw.excerpt as string) ?? null,
    storyImageUrl: (raw.featured_image_url as string) ?? (raw.featuredImageUrl as string) ?? null,
    videoLink: (raw.video_link as string) ?? null,
    videoEmbedCode: (raw.video_embed_code as string) ?? null,
    storyType: (raw.story_type as string) ?? null,
  };
}

/**
 * Filter stories by consent and syndication rules
 */
function filterByConsent(stories: EmpathyLedgerStory[]): EmpathyLedgerStory[] {
  return stories.filter((story) => {
    if (story.consentWithdrawnAt) return false;
    if (story.isArchived) return false;
    if (!story.syndicationEnabled) return false;
    return true;
  });
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
// Direct Supabase access for project-scoped queries
// The production EL API resolves projectCode to a different tenant context,
// so we query the EL Supabase directly for Goods project stories.
const EL_SUPABASE_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_SUPABASE_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';

async function fetchFromELSupabase<T>(
  table: string,
  queryParams: string,
  options: { revalidate?: number } = {}
): Promise<T> {
  const url = `${EL_SUPABASE_URL}/rest/v1/${table}?${queryParams}`;
  const response = await fetch(url, {
    headers: {
      'apikey': EL_SUPABASE_KEY,
      'Authorization': `Bearer ${EL_SUPABASE_KEY}`,
    },
    next: { revalidate: options.revalidate ?? 300 },
  });
  if (!response.ok) {
    throw new Error(`EL Supabase error: ${response.status}`);
  }
  return response.json();
}

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
   * Fetch a single story by ID.
   * Uses direct Supabase access (the plain API returns 401 for Goods tenant stories).
   */
  async getStory(id: string): Promise<EmpathyLedgerStory | null> {
    if (!ENABLE_EMPATHY_LEDGER) return null;

    try {
      // Try direct Supabase first (works for Goods project stories)
      if (EL_SUPABASE_URL && EL_SUPABASE_KEY) {
        const rows = await fetchFromELSupabase<Record<string, unknown>[]>(
          'stories',
          `id=eq.${id}&select=*,storyteller:storytellers(id,display_name,location,is_elder)&limit=1`
        );
        if (rows.length > 0) {
          return {
            ...mapStoryFromAPI(rows[0]),
            storytellerName: (rows[0].storyteller as Record<string, unknown>)?.display_name as string ?? null,
          };
        }
      }

      // Fallback to plain API
      const raw = await fetchFromPlainAPI<Record<string, unknown>>(`/stories/${id}`);
      return mapStoryFromAPI(raw);
    } catch (error) {
      console.error(`[EmpathyLedger] Failed to fetch story ${id}:`, error);
      return null;
    }
  },

  /**
   * Fetch stories (uses plain API with consent filtering)
   */
  async getStories(params: StoriesQueryParams = {}): Promise<EmpathyLedgerStory[]> {
    if (!ENABLE_EMPATHY_LEDGER) return [];

    try {
      const response = await fetchFromPlainAPI<{ stories: Record<string, unknown>[] }>('/stories', {
        projectCode: params.projectCode ?? GOODS_PROJECT_CODE,
        theme: params.theme,
        limit: params.limit ? params.limit * 3 : 50, // Fetch extra to account for consent filtering
        page: params.page,
      });
      const mapped = (response.stories || []).map(mapStoryFromAPI);
      const safe = filterByConsent(mapped);
      return params.limit ? safe.slice(0, params.limit) : safe;
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
  // =============================================================
  // Direct Supabase queries — bypass tenant-scoped API
  // =============================================================

  /**
   * Fetch stories directly from EL Supabase by project_id.
   * This bypasses the tenant-scoped production API which returns
   * stories from a different tenant context.
   */
  async getProjectStories(params: {
    projectId?: string;
    limit?: number;
    syndicatedOnly?: boolean;
  } = {}): Promise<EmpathyLedgerStory[]> {
    if (!ENABLE_EMPATHY_LEDGER) return [];

    const projectId = params.projectId || GOODS_PROJECT_ID;
    if (!projectId) return [];

    try {
      let query = `project_id=eq.${projectId}&status=eq.published&is_public=eq.true&order=created_at.desc`;
      if (params.syndicatedOnly) {
        query += '&syndication_enabled=eq.true';
      }
      if (params.limit) {
        query += `&limit=${params.limit}`;
      }
      query += '&select=*,storyteller:storytellers(id,display_name,location,is_elder)';

      const rows = await fetchFromELSupabase<Record<string, unknown>[]>('stories', query);
      return rows.map((raw) => ({
        ...mapStoryFromAPI(raw),
        storytellerName: (raw.storyteller as Record<string, unknown>)?.display_name as string ?? null,
      }));
    } catch (error) {
      console.error('[EmpathyLedger] Failed to fetch project stories:', error);
      return [];
    }
  },
  /**
   * Fetch galleries for the Goods project from EL Supabase.
   * Uses project_galleries → galleries → gallery_media_associations → media_assets.
   */
  async getProjectGalleries(params: {
    projectId?: string;
  } = {}): Promise<ELGallery[]> {
    if (!ENABLE_EMPATHY_LEDGER || !EL_SUPABASE_URL || !EL_SUPABASE_KEY) return [];

    const projectId = params.projectId || GOODS_PROJECT_ID;
    if (!projectId) return [];

    try {
      // 1. Get gallery IDs linked to this project
      const junctions = await fetchFromELSupabase<{ gallery_id: string }[]>(
        'project_galleries',
        `project_id=eq.${projectId}&select=gallery_id`
      );
      if (!junctions.length) return [];

      const galleryIds = junctions.map((j) => j.gallery_id);

      // 2. Get gallery details
      const galleries = await fetchFromELSupabase<Record<string, unknown>[]>(
        'galleries',
        `id=in.(${galleryIds.join(',')})&select=id,title,description,slug,photo_count,cover_image,status&status=eq.active&order=title`
      );

      // 3. Get media associations for all galleries
      const associations = await fetchFromELSupabase<Record<string, unknown>[]>(
        'gallery_media_associations',
        `gallery_id=in.(${galleryIds.join(',')})&select=gallery_id,sort_order,caption,is_cover_image,media_asset_id&order=sort_order`
      );

      // 4. If there are associations, resolve media assets
      let mediaMap: Record<string, Record<string, unknown>> = {};
      if (associations.length > 0) {
        const assetIds = [...new Set(associations.map((a) => String(a.media_asset_id)))];
        const assets = await fetchFromELSupabase<Record<string, unknown>[]>(
          'media_assets',
          `id=in.(${assetIds.join(',')})&select=id,title,cdn_url,thumbnail_url,alt_text,original_filename,width,height`
        );
        mediaMap = Object.fromEntries(assets.map((a) => [String(a.id), a]));
      }

      // 5. Build gallery objects with photos
      return galleries.map((g) => {
        const gId = String(g.id);
        const galleryAssocs = associations.filter((a) => a.gallery_id === gId);

        const photos: ELGalleryPhoto[] = galleryAssocs
          .map((a) => {
            const media = mediaMap[String(a.media_asset_id)];
            if (!media) return null;
            return {
              id: String(media.id),
              title: (media.title as string) || null,
              url: String(media.cdn_url || ''),
              thumbnailUrl: (media.thumbnail_url as string) || null,
              altText: (media.alt_text as string) || null,
              fileName: (media.original_filename as string) || null,
              width: (media.width as number) || null,
              height: (media.height as number) || null,
              sortOrder: (a.sort_order as number) || 0,
              caption: (a.caption as string) || null,
              isCoverImage: Boolean(a.is_cover_image),
            };
          })
          .filter((p): p is ELGalleryPhoto => p !== null);

        return {
          id: gId,
          title: String(g.title || 'Untitled'),
          description: (g.description as string) || null,
          slug: (g.slug as string) || null,
          photoCount: (g.photo_count as number) || photos.length,
          coverImage: (g.cover_image as string) || null,
          photos,
        };
      });
    } catch (error) {
      console.error('[EmpathyLedger] Failed to fetch project galleries:', error);
      return [];
    }
  },

  /**
   * Enrich storytellers with cross-project quotes from the storyteller_quotes table.
   * The syndication API only returns quotes from Goods project transcripts,
   * but some storytellers have transcripts under other projects.
   */
  async enrichStorytellersWithQuotes(
    storytellers: SyndicationStoryteller[]
  ): Promise<SyndicationStoryteller[]> {
    if (!EL_SUPABASE_URL || !EL_SUPABASE_KEY) return storytellers;

    // Find storytellers missing quotes
    const missingQuotes = storytellers.filter((s) => s.quotes.length === 0);
    if (missingQuotes.length === 0) return storytellers;

    try {
      const ids = missingQuotes.map((s) => s.id).join(',');

      // 1. Try storyteller_quotes table first
      const rows = await fetchFromELSupabase<Record<string, unknown>[]>(
        'storyteller_quotes',
        `storyteller_id=in.(${ids})&select=storyteller_id,quote_text,themes,quote_category&order=quotability_score.desc.nullslast&limit=50`
      );

      // Group by storyteller
      const quotesByStId: Record<string, { text: string; context: string | null }[]> = {};
      for (const row of rows) {
        const sid = String(row.storyteller_id);
        if (!quotesByStId[sid]) quotesByStId[sid] = [];
        quotesByStId[sid].push({
          text: String(row.quote_text || ''),
          context: (row.quote_category as string) || null,
        });
      }

      // 2. Get transcripts with key_quotes for storytellers still missing quotes
      const stillMissing = missingQuotes.filter((s) => !quotesByStId[s.id]);
      if (stillMissing.length > 0) {
        const stillMissingIds = stillMissing.map((s) => s.id).join(',');
        const transcriptsWithQuotes = await fetchFromELSupabase<Record<string, unknown>[]>(
          'transcripts',
          `storyteller_id=in.(${stillMissingIds})&key_quotes=not.is.null&select=storyteller_id,key_quotes`
        );

        for (const t of transcriptsWithQuotes) {
          const sid = String(t.storyteller_id);
          const rawQuotes = t.key_quotes as (string | Record<string, unknown>)[];
          if (!rawQuotes || !Array.isArray(rawQuotes) || rawQuotes.length === 0) continue;

          if (!quotesByStId[sid]) quotesByStId[sid] = [];
          for (const q of rawQuotes) {
            try {
              const parsed = typeof q === 'string' ? JSON.parse(q) : q;
              if (parsed.text) {
                quotesByStId[sid].push({
                  text: String(parsed.text),
                  context: (parsed.theme as string) || null,
                });
              }
            } catch {
              // Skip unparseable quotes
            }
          }
        }
      }

      // 3. Get transcript counts across all projects
      const transcriptRows = await fetchFromELSupabase<Record<string, unknown>[]>(
        'transcripts',
        `storyteller_id=in.(${ids})&select=storyteller_id`
      );
      const tcBySt: Record<string, number> = {};
      for (const t of transcriptRows) {
        const sid = String(t.storyteller_id);
        tcBySt[sid] = (tcBySt[sid] || 0) + 1;
      }

      return storytellers.map((st) => {
        const enrichedQuotes = quotesByStId[st.id];
        const crossProjectTc = tcBySt[st.id];
        if (!enrichedQuotes && !crossProjectTc) return st;

        return {
          ...st,
          transcriptCount: crossProjectTc || st.transcriptCount,
          quotes: enrichedQuotes
            ? enrichedQuotes.slice(0, 5).map((q) => ({
                text: q.text,
                context: q.context,
                impactScore: null,
              }))
            : st.quotes,
        };
      });
    } catch (error) {
      console.error('[EmpathyLedger] Failed to enrich storytellers:', error);
      return storytellers;
    }
  },

  /**
   * Fetch uncategorized media from the Goods tenant.
   * Returns real community photos (IMG_*, DJI_*) not in any gallery.
   */
  async getProjectMedia(params: {
    limit?: number;
  } = {}): Promise<ELGalleryPhoto[]> {
    if (!ENABLE_EMPATHY_LEDGER || !EL_SUPABASE_URL || !EL_SUPABASE_KEY) return [];

    try {
      const projectId = GOODS_PROJECT_ID;
      if (!projectId) return [];
      const query = `project_id=eq.${projectId}&file_type=ilike.image*&select=id,title,cdn_url,thumbnail_url,alt_text,original_filename,width,height&order=created_at.desc&limit=${params.limit || 60}`;
      const rows = await fetchFromELSupabase<Record<string, unknown>[]>('media_assets', query);

      return rows.map((m) => ({
          id: String(m.id),
          title: (m.title as string) || null,
          url: String(m.cdn_url || ''),
          thumbnailUrl: (m.thumbnail_url as string) || null,
          altText: (m.alt_text as string) || null,
          fileName: (m.original_filename as string) || null,
          width: (m.width as number) || null,
          height: (m.height as number) || null,
          sortOrder: 0,
          caption: null,
          isCoverImage: false,
        }));
    } catch (error) {
      console.error('[EmpathyLedger] Failed to fetch project media:', error);
      return [];
    }
  },
};

export default empathyLedger;
