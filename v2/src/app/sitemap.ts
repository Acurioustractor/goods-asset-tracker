import { MetadataRoute } from 'next';
import { createServiceClient } from '@/lib/supabase/server';
import { ROUTE_AUDIENCES } from '@/lib/data/route-audience';
import { CASE_STUDIES } from '@/lib/data/case-studies';
import { communityLocations } from '@/lib/data/content';
import { tripStories } from '@/lib/data/trip-stories';

/**
 * The sitemap DERIVES from route-audience.ts instead of restating it (2026-08-06).
 *
 * The hand-kept list rotted both ways at once: it advertised /impact and /community
 * (proxy-gated, so Google got a login page) and /about (verdict: redirect), while missing
 * the best public content on the site — the communities, the case studies, the field
 * notes, /news. Because route-audience.ts is guarded against the filesystem and the proxy
 * on every build (check:audience), deriving from it means a route that is added, gated,
 * redirected or retired updates the sitemap in the same commit, with no second list to
 * forget.
 *
 * A route earns a sitemap entry when ALL of:
 *   - access is 'open' (the guard derives gating from src/proxy.ts, so this is real)
 *   - verdict is 'keep' or 'rewrite' (redirect/retire/plumbing routes are not content)
 *   - it is static (dynamic families are enumerated from their own data modules below)
 *   - its family does not set robots noindex (the pitch/print/export surfaces)
 */

// Families that noindex themselves (robots in their metadata). A page asking not to be
// indexed must not be advertised. Kept as prefixes because the noindex decision is per
// family, not per route.
const NOINDEX_PREFIXES = [
  '/pitch',
  '/onepagers',
  '/export',
  '/kit',
  '/pathways',
  '/site',
  '/deck',
  '/canberra', // airport-QR landing: reached by scan, not search
];

// Editorial weight for the front doors; everything else gets a sane default.
const PRIORITY: Record<string, number> = {
  '/': 1,
  '/shop': 0.9,
  '/shop/stretch-bed-single': 0.95,
  '/story': 0.85,
  '/process': 0.8,
  '/sponsor': 0.8,
  '/partner': 0.75,
  '/news': 0.7,
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.goodsoncountry.com').replace(/\/$/, '');

  const staticPages: MetadataRoute.Sitemap = ROUTE_AUDIENCES.filter(
    (r) =>
      r.access === 'open' &&
      (r.verdict === 'keep' || r.verdict === 'rewrite') &&
      !r.route.includes('[') &&
      !NOINDEX_PREFIXES.some((p) => r.route === p || r.route.startsWith(`${p}/`)),
  ).map((r) => ({
    url: `${baseUrl}${r.route === '/' ? '' : r.route}`,
    changeFrequency: 'weekly' as const,
    priority: PRIORITY[r.route] ?? 0.6,
  }));

  // Dynamic families, each enumerated from the module its pages already build from
  // (the same lists generateStaticParams uses, so sitemap and pages cannot disagree).
  const communityPages: MetadataRoute.Sitemap = communityLocations.map((c) => ({
    url: `${baseUrl}/communities/${c.id}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const caseStudyPages: MetadataRoute.Sitemap = CASE_STUDIES.filter((c) => c.published).map((c) => ({
    url: `${baseUrl}/case-studies/${c.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const fieldNotePages: MetadataRoute.Sitemap = tripStories
    .filter((s) => s.published)
    .map((s) => ({
      url: `${baseUrl}/field-notes/${s.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  // Shop products from the live catalogue, with real lastModified.
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = createServiceClient();
    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at')
      .eq('is_active', true);

    if (products) {
      const seen = new Set(staticPages.map((p) => p.url));
      productPages = products
        .map((product) => ({
          url: `${baseUrl}/shop/${product.slug}`,
          lastModified: new Date(product.updated_at),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        }))
        .filter((p) => !seen.has(p.url));
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  return [...staticPages, ...communityPages, ...caseStudyPages, ...fieldNotePages, ...productPages];
}
