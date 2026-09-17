'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function getStories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createStory(formData: FormData) {
  const supabase = await createClient();
  const title = formData.get('title') as string;
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const isPublished = formData.get('is_published') === 'true';

  const { error } = await supabase.from('stories').insert({
    title,
    slug,
    subtitle: (formData.get('subtitle') as string) || null,
    content: (formData.get('content') as string) || null,
    story_type: (formData.get('story_type') as string) || 'blog',
    community: (formData.get('community') as string) || null,
    featured_image: (formData.get('featured_image') as string) || null,
    is_published: isPublished,
    is_featured: false,
    published_at: isPublished ? new Date().toISOString() : null,
    images: [],
    tags: [],
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/stories');
  return { success: true };
}

export async function updateStory(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get('id') as string;

  const { error } = await supabase
    .from('stories')
    .update({
      title: formData.get('title') as string,
      subtitle: (formData.get('subtitle') as string) || null,
      content: (formData.get('content') as string) || null,
      story_type: (formData.get('story_type') as string) || 'blog',
      community: (formData.get('community') as string) || null,
      featured_image: (formData.get('featured_image') as string) || null,
    })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/stories');
  return { success: true };
}

export async function toggleStoryPublish(id: string, publish: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('stories')
    .update({
      is_published: publish,
      published_at: publish ? new Date().toISOString() : null,
    })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/stories');
  return { success: true };
}

export async function toggleStoryFeatured(id: string, featured: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('stories')
    .update({ is_featured: featured })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/stories');
  return { success: true };
}
