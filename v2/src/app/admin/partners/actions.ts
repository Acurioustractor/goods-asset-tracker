'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function getPartners() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('partners')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getInquiries() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('partnership_inquiries')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addPartner(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from('partners').insert({
    name: formData.get('name') as string,
    partnership_type: formData.get('partnership_type') as string,
    partnership_tier: (formData.get('partnership_tier') as string) || null,
    primary_contact_name: (formData.get('primary_contact_name') as string) || null,
    primary_contact_email: (formData.get('primary_contact_email') as string) || null,
    website: (formData.get('website') as string) || null,
    description: (formData.get('description') as string) || null,
    total_sponsored_beds: parseInt(formData.get('total_sponsored_beds') as string) || 0,
    is_active: true,
    show_on_website: false,
    display_order: 999,
    metadata: {},
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/partners');
  return { success: true };
}

export async function updatePartner(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get('id') as string;

  const { error } = await supabase
    .from('partners')
    .update({
      name: formData.get('name') as string,
      partnership_type: formData.get('partnership_type') as string,
      partnership_tier: (formData.get('partnership_tier') as string) || null,
      primary_contact_name: (formData.get('primary_contact_name') as string) || null,
      primary_contact_email: (formData.get('primary_contact_email') as string) || null,
      website: (formData.get('website') as string) || null,
      description: (formData.get('description') as string) || null,
      total_sponsored_beds: parseInt(formData.get('total_sponsored_beds') as string) || 0,
      is_active: formData.get('is_active') === 'true',
      show_on_website: formData.get('show_on_website') === 'true',
    })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/partners');
  return { success: true };
}

export async function updateInquiryStatus(id: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('partnership_inquiries')
    .update({ status })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/partners');
  return { success: true };
}
