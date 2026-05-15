'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function getJourneyEvents(assetId?: string) {
  const supabase = await createClient();

  let query = supabase
    .from('bed_journeys')
    .select('*')
    .order('event_date', { ascending: false });

  if (assetId) {
    query = query.eq('asset_id', assetId);
  }

  const { data, error } = await query.limit(100);
  if (error) throw error;
  return data || [];
}

export async function getAssetIds() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('assets')
    .select('unique_id, community')
    .ilike('product', '%bed%')
    .order('unique_id');
  if (error) throw error;
  return data || [];
}

export async function addJourneyEvent(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from('bed_journeys').insert({
    asset_id: (formData.get('asset_id') as string) || null,
    event_type: formData.get('event_type') as string,
    event_date: (formData.get('event_date') as string) || new Date().toISOString().split('T')[0],
    description: (formData.get('description') as string) || null,
    location: (formData.get('location') as string) || null,
    media: [],
    metadata: {},
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/journeys');
  return { success: true };
}
