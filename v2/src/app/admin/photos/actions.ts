'use server';

import { revalidatePath } from 'next/cache';

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';

/**
 * Flip an EL story between draft and review states. Three actions:
 *  - "approve": elder_reviewed=true, requires_elder_review=false, is_public=true
 *  - "elder-ok": elder_reviewed=true (but stays private)
 *  - "unpublish": is_public=false (rollback)
 *
 * Each action stamps elder_reviewed_at = now() so we have an audit trail.
 * No-op if EL env not configured.
 */
export async function reviewPhoto(storyId: string, action: 'approve' | 'elder-ok' | 'unpublish'): Promise<{ ok: boolean; error?: string }> {
  if (!EL_URL || !EL_KEY) return { ok: false, error: 'EL not configured' };

  const now = new Date().toISOString();
  let patch: Record<string, unknown> = {};
  switch (action) {
    case 'approve':
      patch = {
        elder_reviewed: true,
        elder_reviewed_at: now,
        requires_elder_review: false,
        is_public: true,
        community_status: 'published',
      };
      break;
    case 'elder-ok':
      patch = {
        elder_reviewed: true,
        elder_reviewed_at: now,
        requires_elder_review: false,
      };
      break;
    case 'unpublish':
      patch = {
        is_public: false,
        community_status: 'draft',
      };
      break;
  }

  const res = await fetch(`${EL_URL}/rest/v1/stories?id=eq.${storyId}`, {
    method: 'PATCH',
    headers: {
      apikey: EL_KEY,
      Authorization: `Bearer ${EL_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(patch),
  });

  if (!res.ok) {
    return { ok: false, error: `HTTP ${res.status}: ${(await res.text()).slice(0, 200)}` };
  }

  revalidatePath('/admin/photos');
  revalidatePath('/admin/deck');
  return { ok: true };
}
