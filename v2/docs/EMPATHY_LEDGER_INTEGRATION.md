# Empathy Ledger Integration Architecture

## Overview

Goods v2 integrates with **Empathy Ledger** (the ACT content hub) to access:
- Community stories and testimonials
- Photography and video content
- Storyteller profiles (artisans, community members)
- Impact narratives and quotes

This enables a rich, story-driven e-commerce experience without duplicating content management.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ACT Ecosystem                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    Empathy Ledger v2                           │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐   │  │
│  │  │   Stories   │  │   Media     │  │    Storytellers     │   │  │
│  │  │   Table     │  │   Assets    │  │      Profiles       │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────────┘   │  │
│  │                          │                                     │  │
│  │              ┌───────────┴───────────┐                        │  │
│  │              │   Content Hub APIs    │                        │  │
│  │              │  /api/v1/content-hub  │                        │  │
│  │              └───────────┬───────────┘                        │  │
│  └──────────────────────────┼───────────────────────────────────┘  │
│                             │                                       │
│         ┌───────────────────┼───────────────────┐                  │
│         │                   │                   │                  │
│         ▼                   ▼                   ▼                  │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐          │
│  │   Goods     │     │ The Harvest │     │  JusticeHub │          │
│  │     v2      │     │             │     │             │          │
│  └─────────────┘     └─────────────┘     └─────────────┘          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## API Integration

### Empathy Ledger Content Hub Endpoints

| Endpoint | Purpose | Authentication |
|----------|---------|----------------|
| `GET /api/v1/content-hub/media` | Fetch photos/videos | X-API-Key header |
| `GET /api/v1/content-hub/stories` | Fetch published stories | X-API-Key header |
| `GET /api/v1/content-hub/storytellers` | Fetch storyteller profiles | X-API-Key header |

### Query Parameters

**Media Endpoint:**
```
?project_code=goods-on-country    # Filter to Goods content
&type=image|video|audio           # Filter by media type
&elder_approved=true              # Only elder-approved content
&cultural_tags=beds,community     # Filter by tags
&page=1&limit=20                  # Pagination
```

**Stories Endpoint:**
```
?theme=impact|community_voice     # Filter by theme
&page=1&limit=20                  # Pagination
```

### Access Levels

| Level | Header | Access |
|-------|--------|--------|
| anonymous | (none) | Public content only |
| ecosystem | `X-API-Key: <key>` | All syndicated content |
| community | `Authorization: Bearer <token>` | Public + community content |

### Goods API Key

Goods is pre-registered in Empathy Ledger as syndication site:
- **Slug:** `goods-asset-register`
- **Project Code:** `goods-on-country`
- **Allowed Domains:** `goodsassetregister.org`, `www.goodsassetregister.org`

**Environment Variable:**
```env
EMPATHY_LEDGER_API_URL=https://empathy-ledger.vercel.app
EMPATHY_LEDGER_API_KEY=<production-key>
```

---

## Data Models

### Media Asset (from Empathy Ledger)

```typescript
interface EmpathyLedgerMedia {
  id: string;
  url: string;
  thumbnailUrl: string | null;
  title: string | null;
  description: string | null;
  altText: string | null;
  mediaType: 'image' | 'video' | 'audio';
  width: number | null;
  height: number | null;
  duration: number | null; // For video/audio

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
```

### Story (from Empathy Ledger)

```typescript
interface EmpathyLedgerStory {
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
```

### Storyteller Profile

```typescript
interface EmpathyLedgerStoryteller {
  id: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  culturalBackground: string | null;
  specialties: string[];
  elderStatus: boolean;
  storyCount: number;
  featured: boolean;
}
```

---

## Integration Points in Goods v2

### 1. Homepage - Featured Stories

Display 2-3 featured impact stories from Empathy Ledger:

```tsx
// src/components/marketing/FeaturedStories.tsx
async function getFeaturedStories() {
  const stories = await empathyLedger.getStories({
    projectCode: 'goods-on-country',
    theme: 'impact',
    limit: 3
  });
  return stories;
}
```

### 2. Product Pages - Community Voices

Show testimonials and community photos on product pages:

```tsx
// src/app/products/[slug]/page.tsx
async function getProductMedia(productType: string) {
  const media = await empathyLedger.getMedia({
    projectCode: 'goods-on-country',
    culturalTags: [productType, 'testimonial'],
    elderApproved: true,
    limit: 6
  });
  return media;
}
```

### 3. Impact Page - Story Gallery

Full gallery of impact stories and media:

```tsx
// src/app/impact/page.tsx
async function getImpactContent() {
  const [stories, media] = await Promise.all([
    empathyLedger.getStories({ theme: 'community_voice' }),
    empathyLedger.getMedia({ type: 'image', elderApproved: true })
  ]);
  return { stories, media };
}
```

### 4. About Page - Artisan Profiles

Feature artisan/storyteller profiles:

```tsx
// src/app/about/page.tsx
async function getArtisans() {
  const storytellers = await empathyLedger.getStorytellers({
    projectCode: 'goods-on-country',
    featured: true
  });
  return storytellers;
}
```

### 5. Community Pages - Media Galleries

Per-community photo galleries:

```tsx
// src/app/communities/[slug]/page.tsx
async function getCommunityMedia(community: string) {
  const media = await empathyLedger.getMedia({
    projectCode: 'goods-on-country',
    culturalTags: [community],
    type: 'image'
  });
  return media;
}
```

---

## Cultural Safety

### OCAP Principles

All content from Empathy Ledger adheres to OCAP:

1. **Ownership** - Community owns their stories
2. **Control** - Community controls usage via consent settings
3. **Access** - Access levels respect community preferences
4. **Possession** - Community retains copies via Empathy Ledger

### Content Filtering

Goods v2 **only displays content that meets ALL criteria:**

- `elderApproved: true` (for sensitive content)
- `consentObtained: true` (for all personal content)
- `visibility: 'public'` or `visibility: 'community'` (with auth)

### Attribution

All media includes attribution when provided:

```tsx
{media.attributionText && (
  <p className="text-sm text-muted-foreground">
    {media.attributionText}
  </p>
)}
```

---

## Caching Strategy

### Server-Side Caching

```typescript
// Next.js fetch with revalidation
const response = await fetch(url, {
  headers: { 'X-API-Key': apiKey },
  next: { revalidate: 300 } // 5 minutes
});
```

### Client-Side Caching (SWR)

```typescript
const { data, error } = useSWR(
  `/api/empathy-ledger/stories?theme=impact`,
  fetcher,
  { revalidateOnFocus: false }
);
```

---

## Error Handling

### Graceful Degradation

If Empathy Ledger is unavailable, Goods v2:

1. Falls back to local content (stories table, team_members table)
2. Displays placeholder content
3. Logs error for monitoring

```typescript
async function getStories() {
  try {
    return await empathyLedger.getStories({ limit: 3 });
  } catch (error) {
    console.error('Empathy Ledger unavailable:', error);
    // Fall back to local stories
    return await getLocalStories();
  }
}
```

---

## Environment Setup

### Required Environment Variables

```env
# Empathy Ledger API
EMPATHY_LEDGER_API_URL=https://empathy-ledger.vercel.app
EMPATHY_LEDGER_API_KEY=<your-api-key>
EMPATHY_LEDGER_PROJECT_CODE=goods-on-country

# Feature flags
ENABLE_EMPATHY_LEDGER=true
```

### Development Setup

For local development, use the staging Empathy Ledger:

```env
EMPATHY_LEDGER_API_URL=http://localhost:3001  # Local EL instance
# OR
EMPATHY_LEDGER_API_URL=https://empathy-ledger-staging.vercel.app
```

---

## Migration from Local Content

### Phase 1: Parallel Operation
- Keep local `stories` and `team_members` tables
- Display Empathy Ledger content alongside local content
- Test integration thoroughly

### Phase 2: Primary Source
- Make Empathy Ledger the primary content source
- Local tables become cache/fallback
- Migrate any local-only content to Empathy Ledger

### Phase 3: Single Source of Truth
- Remove local content tables (optional)
- Empathy Ledger is sole content source
- Local `stories` table used for Goods-specific content only

---

## Testing

### Unit Tests

```typescript
describe('EmpathyLedgerClient', () => {
  it('fetches media with correct filters', async () => {
    const media = await client.getMedia({
      projectCode: 'goods-on-country',
      elderApproved: true
    });
    expect(media.every(m => m.elderApproved)).toBe(true);
  });
});
```

### Integration Tests

```typescript
describe('Empathy Ledger Integration', () => {
  it('renders featured stories from Empathy Ledger', async () => {
    render(<FeaturedStories />);
    await waitFor(() => {
      expect(screen.getByText('Palm Island Delivery Day')).toBeInTheDocument();
    });
  });
});
```

---

## Monitoring

### Health Checks

```typescript
// src/app/api/health/route.ts
export async function GET() {
  const empathyLedgerHealthy = await checkEmpathyLedger();

  return Response.json({
    empathyLedger: empathyLedgerHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString()
  });
}
```

### Logging

Log all Empathy Ledger API calls for debugging:

```typescript
console.log(`[EmpathyLedger] GET /media - ${media.length} items fetched`);
```

---

## Summary

Goods v2 leverages Empathy Ledger as its **content backbone**, providing:

- **Rich storytelling** without duplicate content management
- **Cultural safety** built into every content request
- **Consistent branding** across the ACT ecosystem
- **Scalable architecture** that grows with the platform

The integration follows the same pattern successfully used by The Harvest, ensuring Goods benefits from the mature content infrastructure already in place.
