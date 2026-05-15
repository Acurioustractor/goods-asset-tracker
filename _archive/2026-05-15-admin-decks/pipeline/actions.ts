'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function getPipelineData() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('assets')
    .select('unique_id, product, status, community, quantity, partner_name, notes, created_time')
    .order('created_time', { ascending: false });

  if (error) throw error;
  
  // Map back to the expected created_at property for the React component
  return (data || []).map((row) => ({
    ...row,
    created_at: row.created_time,
  }));
}

export async function addPipelineEntry(formData: FormData) {
  const supabase = await createClient();

  const unique_id = formData.get('unique_id') as string;
  const community = formData.get('community') as string;
  const quantity = parseInt(formData.get('quantity') as string) || 1;
  const partner_name = (formData.get('partner_name') as string) || null;
  const notes = (formData.get('notes') as string) || null;
  const status = (formData.get('status') as string) || 'requested';
  
  const product = (formData.get('product') as string) || 'Stretch Bed';
  const type = product.toLowerCase().includes('bed') 
    ? 'bed' 
    : (product.toLowerCase().includes('wash') ? 'washing_machine' : 'other');

  const { error } = await supabase.from('assets').insert({
    unique_id,
    product,
    type,
    status,
    community,
    quantity,
    partner_name,
    notes,
  });

  if (error) return { error: error.message };

  revalidatePath('/admin/pipeline');
  return { success: true };
}

export async function updatePipelineEntry(formData: FormData) {
  const supabase = await createClient();

  const unique_id = formData.get('unique_id') as string;
  const community = formData.get('community') as string;
  const quantity = parseInt(formData.get('quantity') as string) || 1;
  const partner_name = (formData.get('partner_name') as string) || null;
  const notes = (formData.get('notes') as string) || null;
  const status = formData.get('status') as string;

  const { error } = await supabase
    .from('assets')
    .update({ community, quantity, partner_name, notes, status })
    .eq('unique_id', unique_id);

  if (error) return { error: error.message };

  revalidatePath('/admin/pipeline');
  return { success: true };
}

export async function updatePipelineStatus(unique_id: string, newStatus: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('assets')
    .update({ status: newStatus })
    .eq('unique_id', unique_id);

  if (error) return { error: error.message };

  revalidatePath('/admin/pipeline');
  return { success: true };
}
