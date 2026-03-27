'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface ChecklistState {
  [itemId: string]: {
    checked: boolean;
    checked_at: string | null;
    checked_by: string | null;
  };
}

export async function getChecklistState(): Promise<ChecklistState> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('deal_room_checklist')
    .select('id, checked, checked_at, checked_by');

  if (error) {
    console.error('Error fetching checklist state:', error);
    return {};
  }

  const state: ChecklistState = {};
  for (const row of data || []) {
    state[row.id] = {
      checked: row.checked,
      checked_at: row.checked_at,
      checked_by: row.checked_by,
    };
  }
  return state;
}

export async function toggleChecklistItem(itemId: string, checked: boolean) {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from('deal_room_checklist')
    .upsert(
      {
        id: itemId,
        checked,
        checked_at: checked ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

  if (error) {
    console.error('Error toggling checklist item:', error);
    throw new Error('Failed to update checklist item');
  }

  revalidatePath('/admin/deal-room');
}
