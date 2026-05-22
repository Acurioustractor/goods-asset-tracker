'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/server';

/**
 * Bulk save recipient + place for a list of bed IDs. Empty fields are skipped
 * (we only write what the user typed — null stays null). Returns a per-bed
 * status map so the form can show success/error inline.
 */
export async function saveAliceRecipients(formData: FormData): Promise<{ ok: string[]; fail: { id: string; error: string }[] }> {
  const supabase = createServiceClient();
  const ok: string[] = [];
  const fail: { id: string; error: string }[] = [];

  const ids = (formData.getAll('bed_id') as string[]) || [];
  for (const id of ids) {
    const recipient = (formData.get(`recipient:${id}`) as string | null)?.trim() || null;
    const place = (formData.get(`place:${id}`) as string | null)?.trim() || null;
    const note = (formData.get(`note:${id}`) as string | null)?.trim() || null;

    // Skip rows where nothing was typed — nothing to write.
    if (!recipient && !place && !note) continue;

    const patch: Record<string, string | null> = {};
    if (recipient) patch.recipient_name = recipient;
    if (place) patch.place = place;
    // Append the note to existing notes rather than overwriting, so the
    // earlier "Alice Springs delivery 2026-05-21" context is preserved.
    let mergedNotes: string | null = null;
    if (note) {
      const { data: existing } = await supabase
        .from('assets')
        .select('notes')
        .eq('unique_id', id)
        .single();
      const prior = (existing?.notes as string | null) || '';
      mergedNotes = prior ? `${prior}\n[2026-05-22 wizard] ${note}` : `[2026-05-22 wizard] ${note}`;
      patch.notes = mergedNotes;
    }

    const { error } = await supabase
      .from('assets')
      .update(patch)
      .eq('unique_id', id);

    if (error) fail.push({ id, error: error.message });
    else ok.push(id);
  }

  revalidatePath('/admin/alice-fill');
  revalidatePath('/admin/assets');
  revalidatePath('/admin/scans');
  return { ok, fail };
}
