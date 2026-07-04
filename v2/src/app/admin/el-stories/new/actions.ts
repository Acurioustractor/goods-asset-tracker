'use server';

import { revalidatePath } from 'next/cache';

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';
const EL_PROJECT_ID = process.env.EMPATHY_LEDGER_PROJECT_ID || '6bd47c8a-e676-456f-aa25-ddcbb5a31047';
const EL_TENANT_ID = process.env.EMPATHY_LEDGER_TENANT_ID || '5f1314c1-ffe9-4d8f-944b-6cdf02d4b943';
const EL_FALLBACK_AUTHOR_ID = process.env.EMPATHY_LEDGER_FALLBACK_AUTHOR_ID || '5b5bc43b-ad02-450c-ae2f-44dea1a9e77b';
const EL_FALLBACK_STORYTELLER_ID = process.env.EMPATHY_LEDGER_FALLBACK_STORYTELLER_ID || 'ac700001-0000-0000-0000-000000000002';

export interface CreateStoryInput {
  title: string;
  content: string;                  // body, markdown OK
  excerpt?: string;                  // ~200 chars for cards
  storytellerId?: string;            // if absent, falls back to placeholder storyteller
  storyImageUrl?: string;            // hero image
  // Canonical tag taxonomy fields. We assemble the final tags[] from these.
  community?: string;                 // canonical slug, e.g. 'utopia-homelands'
  trip?: string;                      // canonical slug, e.g. 'trip-may-2026'
  participant?: string;               // canonical slug, e.g. 'mykel'
  themes?: string[];                  // canonical slugs, e.g. ['family','health']
  syndicateGoodsLongform: boolean;
  // Consent gates
  hasExplicitConsent: boolean;        // default false until verified
  isPublic: boolean;                  // default false; only flip true after elder review
  culturalPermissionLevel: 'public' | 'community' | 'private';
}

export async function createStory(input: CreateStoryInput): Promise<{
  ok: boolean;
  id?: string;
  publicUrl?: string;
  error?: string;
}> {
  if (!EL_URL || !EL_KEY) return { ok: false, error: 'EL credentials not configured' };
  if (!input.title?.trim()) return { ok: false, error: 'title is required' };
  if (!input.content?.trim()) return { ok: false, error: 'content is required' };

  // Assemble the canonical tag set per docs/10-el-goods-sync.md
  const tags: string[] = [];
  if (input.community) tags.push(`community:${input.community.trim()}`);
  if (input.trip) tags.push(`trip:${input.trip.trim()}`);
  if (input.participant) tags.push(`participant:${input.participant.trim()}`);
  for (const t of input.themes || []) {
    if (t.trim()) tags.push(`theme:${t.trim()}`);
  }
  if (input.syndicateGoodsLongform) tags.push('syndicate:goods-longform');
  tags.push(input.isPublic ? 'consent:public' : 'consent:elder-pending');
  tags.push('goods-staff-capture');

  const body = {
    tenant_id: EL_TENANT_ID,
    project_id: EL_PROJECT_ID,
    storyteller_id: input.storytellerId || EL_FALLBACK_STORYTELLER_ID,
    author_id: EL_FALLBACK_AUTHOR_ID,
    title: input.title.trim(),
    content: input.content,
    excerpt: input.excerpt?.trim() || input.content.slice(0, 200),
    original_author_display: 'Goods on Country',
    status: input.isPublic ? 'published' : 'draft',
    community_status: input.isPublic ? 'published' : 'draft',
    is_public: input.isPublic,
    is_featured: false,
    syndication_enabled: input.syndicateGoodsLongform && input.isPublic,
    permission_tier: input.isPublic ? 'public' : 'private',
    language: 'en',
    requires_elder_review: !input.hasExplicitConsent,
    elder_reviewed: input.hasExplicitConsent && input.isPublic,
    elder_reviewed_at: (input.hasExplicitConsent && input.isPublic) ? new Date().toISOString() : null,
    has_explicit_consent: input.hasExplicitConsent,
    consent_details: {
      source: 'goods-admin-composer',
      captured_at: new Date().toISOString(),
      syndicate_goods_longform: input.syndicateGoodsLongform,
    },
    cultural_permission_level: input.culturalPermissionLevel,
    story_image_url: input.storyImageUrl?.trim() || null,
    media_url: input.storyImageUrl?.trim() || null,
    tags,
    story_type: 'community-voice',
    privacy_level: input.isPublic ? 'public' : 'private',
  };

  const res = await fetch(`${EL_URL}/rest/v1/stories`, {
    method: 'POST',
    headers: {
      apikey: EL_KEY,
      Authorization: `Bearer ${EL_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    return { ok: false, error: `EL insert failed (HTTP ${res.status}): ${(await res.text()).slice(0, 250)}` };
  }
  const rows = (await res.json()) as Array<{ id: string }>;
  const story = rows[0];

  revalidatePath('/stories');
  revalidatePath('/admin/media-library');
  revalidatePath('/admin/el-stories');

  return {
    ok: true,
    id: story.id,
    publicUrl: input.isPublic ? `/stories/${story.id}` : undefined,
  };
}
