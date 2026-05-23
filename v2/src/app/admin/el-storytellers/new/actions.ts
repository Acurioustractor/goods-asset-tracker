'use server';

import { revalidatePath } from 'next/cache';

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';

// Goods-canonical IDs (verified from EL projects table).
// Set once here so a future migration to different defaults is one edit.
const GOODS_ORG_ID = 'db0de7bd-eb10-446b-99e9-0f3b7c199b8a';
const GOODS_TENANT_ID = process.env.EMPATHY_LEDGER_TENANT_ID || '5f1314c1-ffe9-4d8f-944b-6cdf02d4b943';

export interface CreateStorytellerInput {
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  location?: string;            // canonical community label e.g. "Utopia Homelands"
  culturalBackground?: string;
  isElder: boolean;
  isFeatured: boolean;
  consentSource: 'family-guardian' | 'oonchiumpa' | 'direct-recipient' | 'team-internal';
  consentDetails?: string;       // free-text note about how consent was captured
}

/**
 * Create a new EL storyteller scoped to the Goods organisation. Sensible
 * defaults: not active until consent verified, content_status: draft,
 * profile_id null (we can link later when an EL profile exists).
 *
 * Returns the new storyteller's id + slug-friendly displayName.
 */
export async function createStoryteller(input: CreateStorytellerInput): Promise<{
  ok: boolean;
  id?: string;
  displayName?: string;
  slug?: string;
  error?: string;
}> {
  if (!EL_URL || !EL_KEY) return { ok: false, error: 'EL credentials not configured' };
  if (!input.displayName?.trim()) return { ok: false, error: 'displayName is required' };

  const body = {
    organization_id: GOODS_ORG_ID,
    display_name: input.displayName.trim(),
    bio: input.bio?.trim() || null,
    profile_image_url: input.avatarUrl?.trim() || null,
    public_avatar_url: input.avatarUrl?.trim() || null,
    location: input.location?.trim() || null,
    cultural_background: input.culturalBackground?.trim() || null,
    is_elder: input.isElder,
    is_featured: input.isFeatured,
    is_active: false,             // gate: stays inactive until consent verified
    content_status: 'draft',      // matches existing Goods storytellers' default
    is_ancestor: false,
  };

  const res = await fetch(`${EL_URL}/rest/v1/storytellers`, {
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
  const rows = (await res.json()) as Array<{ id: string; display_name: string }>;
  const teller = rows[0];

  // Compute the slug the same way `lib/storytellers.ts` does so the user can
  // know the resulting public URL: /storytellers/<slug>
  const slug = teller.display_name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Bust the Goods-side caches so the new storyteller shows up immediately.
  revalidatePath('/storytellers');
  revalidatePath('/admin/el-storytellers');

  // Side-note: consent_details + source we'd ideally store on a join table
  // or a side-record. For now, log to console only — surfacing this in EL
  // requires a separate consent table we don't yet have a schema for.
  if (input.consentDetails || input.consentSource) {
    console.log('[el-storyteller create] consent captured (not yet persisted to EL):', {
      storytellerId: teller.id,
      source: input.consentSource,
      details: input.consentDetails,
      tenantId: GOODS_TENANT_ID,
    });
  }

  return { ok: true, id: teller.id, displayName: teller.display_name, slug };
}
