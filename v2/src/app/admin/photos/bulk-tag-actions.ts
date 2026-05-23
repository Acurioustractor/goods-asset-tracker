'use server';

import { revalidatePath } from 'next/cache';

const EL_URL = process.env.EMPATHY_LEDGER_SUPABASE_URL || '';
const EL_KEY = process.env.EMPATHY_LEDGER_SUPABASE_KEY || '';

interface BulkTagInput {
  storyIds: string[];
  /** Tags to add (will be merged into existing tags, deduped). */
  add?: string[];
  /** Tags to remove (e.g. flip pending-elder-review off). */
  remove?: string[];
}

/**
 * Bulk-update tags on N EL stories in one pass. We fetch current tags per
 * story (the column is text[]), merge add/remove, then PATCH. This avoids
 * any race where a parallel UI edit on a single story gets overwritten.
 *
 * Returns per-story ok/error so the picker can show inline feedback.
 */
export async function bulkUpdateTags(input: BulkTagInput): Promise<{
  ok: string[];
  fail: { id: string; error: string }[];
}> {
  if (!EL_URL || !EL_KEY) return { ok: [], fail: input.storyIds.map((id) => ({ id, error: 'EL not configured' })) };
  if (input.storyIds.length === 0) return { ok: [], fail: [] };

  const ok: string[] = [];
  const fail: { id: string; error: string }[] = [];

  const add = new Set((input.add || []).map((t) => t.trim().toLowerCase()).filter(Boolean));
  const remove = new Set((input.remove || []).map((t) => t.trim().toLowerCase()).filter(Boolean));

  for (const id of input.storyIds) {
    try {
      // Fetch current tags for this story
      const fetchRes = await fetch(`${EL_URL}/rest/v1/stories?id=eq.${id}&select=tags`, {
        headers: { apikey: EL_KEY, Authorization: `Bearer ${EL_KEY}` },
      });
      if (!fetchRes.ok) throw new Error(`fetch ${fetchRes.status}`);
      const rows = (await fetchRes.json()) as { tags: string[] | null }[];
      const current = new Set(rows[0]?.tags || []);
      // Apply remove first, then add (so a tag in both stays added)
      for (const t of remove) current.delete(t);
      for (const t of add) current.add(t);
      const merged = [...current];

      const patchRes = await fetch(`${EL_URL}/rest/v1/stories?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          apikey: EL_KEY,
          Authorization: `Bearer ${EL_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ tags: merged }),
      });
      if (!patchRes.ok) throw new Error(`patch ${patchRes.status}: ${(await patchRes.text()).slice(0, 100)}`);
      ok.push(id);
    } catch (e) {
      fail.push({ id, error: (e as Error).message });
    }
  }

  revalidatePath('/admin/photos');
  revalidatePath('/admin/deck');
  return { ok, fail };
}
