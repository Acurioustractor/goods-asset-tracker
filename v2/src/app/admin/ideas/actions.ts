'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function getIdeas() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('community_ideas')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function updateIdeaStatus(id: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('community_ideas')
    .update({ status })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/ideas');
  return { success: true };
}
