'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function saveInventorySnapshot(formData: FormData) {
  const supabase = createServiceClient();

  const id = formData.get('id') as string;
  const operator = (formData.get('operator') as string) || 'Admin Update';
  const raw_plastic_kg = parseInt(formData.get('raw_plastic_kg') as string) || 0;
  const chipped_plastic_sheets = parseInt(formData.get('chipped_plastic_sheets') as string) || 0;
  const tab_sheets_finished = parseInt(formData.get('tab_sheets_finished') as string) || 0;
  const tab_sheets_in_cooker = parseInt(formData.get('tab_sheets_in_cooker') as string) || 0;
  const tab_sheets_cooling = parseInt(formData.get('tab_sheets_cooling') as string) || 0;
  const tabs_ready = parseInt(formData.get('tabs_ready') as string) || 0;
  const leg_sheets_uncut = parseInt(formData.get('leg_sheets_uncut') as string) || 0;
  const legs_ready = parseInt(formData.get('legs_ready') as string) || 0;
  const steel_poles = parseInt(formData.get('steel_poles') as string) || 0;
  const canvas_ready = parseInt(formData.get('canvas_ready') as string) || 0;

  const payload = {
    operator,
    raw_plastic_kg,
    chipped_plastic_sheets,
    tab_sheets_finished,
    tab_sheets_in_cooker,
    tab_sheets_cooling,
    tabs_ready,
    leg_sheets_uncut,
    legs_ready,
    steel_poles,
    canvas_ready,
  };

  if (id) {
    const { error } = await supabase.from('production_inventory').update(payload).eq('id', id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from('production_inventory').insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath('/admin/production');
  return { success: true };
}
