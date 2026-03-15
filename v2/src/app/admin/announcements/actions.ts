'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function getAnnouncements() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createAnnouncement(formData: FormData) {
  const supabase = await createClient();
  const isPublished = formData.get('is_published') === 'true';

  const { error } = await supabase.from('announcements').insert({
    title: formData.get('title') as string,
    content: (formData.get('content') as string) || null,
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/announcements');
  return { success: true };
}

export async function updateAnnouncement(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get('id') as string;

  const { error } = await supabase
    .from('announcements')
    .update({
      title: formData.get('title') as string,
      content: (formData.get('content') as string) || null,
    })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/announcements');
  return { success: true };
}

export async function togglePublish(id: string, publish: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('announcements')
    .update({
      is_published: publish,
      published_at: publish ? new Date().toISOString() : null,
    })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/announcements');
  return { success: true };
}
