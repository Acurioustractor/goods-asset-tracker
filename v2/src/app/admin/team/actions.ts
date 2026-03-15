'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function getTeamMembers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function addTeamMember(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from('team_members').insert({
    name: formData.get('name') as string,
    role: (formData.get('role') as string) || null,
    bio: (formData.get('bio') as string) || null,
    community: (formData.get('community') as string) || null,
    photo: (formData.get('photo') as string) || null,
    is_artisan: formData.get('is_artisan') === 'true',
    is_staff: formData.get('is_staff') === 'true',
    is_active: true,
    display_order: 999,
    photos: [],
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/team');
  return { success: true };
}

export async function updateTeamMember(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get('id') as string;

  const { error } = await supabase
    .from('team_members')
    .update({
      name: formData.get('name') as string,
      role: (formData.get('role') as string) || null,
      bio: (formData.get('bio') as string) || null,
      community: (formData.get('community') as string) || null,
      photo: (formData.get('photo') as string) || null,
      is_artisan: formData.get('is_artisan') === 'true',
      is_staff: formData.get('is_staff') === 'true',
    })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/team');
  return { success: true };
}

export async function toggleActive(id: string, isActive: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('team_members')
    .update({ is_active: isActive })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/team');
  return { success: true };
}
