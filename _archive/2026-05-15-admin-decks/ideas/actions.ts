'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface AdminIdea {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: string;
  vote_count: number;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export async function getAdminIdeas(): Promise<AdminIdea[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('community_ideas')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching ideas:', error);
    return [];
  }
  return data || [];
}

export async function updateIdeaStatus(id: string, status: string, adminNotes?: string) {
  const supabase = createServiceClient();

  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (adminNotes !== undefined) {
    updateData.admin_notes = adminNotes;
  }

  const { error } = await supabase
    .from('community_ideas')
    .update(updateData)
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/ideas');
  return { success: true };
}

export async function deleteIdea(id: string) {
  const supabase = createServiceClient();

  // Delete votes first (FK constraint)
  await supabase.from('idea_votes').delete().eq('idea_id', id);

  const { error } = await supabase
    .from('community_ideas')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/ideas');
  return { success: true };
}

export interface FeedbackStats {
  totalIdeas: number;
  byStatus: Record<string, number>;
  byCategory: Record<string, number>;
  totalVotes: number;
  recentIdeas: number;
}

export async function getFeedbackStats(): Promise<FeedbackStats> {
  const supabase = createServiceClient();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [ideasResult, votesResult, recentResult] = await Promise.all([
    supabase.from('community_ideas').select('status, category, vote_count'),
    supabase.from('idea_votes').select('id', { count: 'exact' }),
    supabase.from('community_ideas').select('id', { count: 'exact' }).gte('created_at', thirtyDaysAgo),
  ]);

  const ideas = ideasResult.data || [];
  const byStatus: Record<string, number> = {};
  const byCategory: Record<string, number> = {};

  for (const idea of ideas) {
    byStatus[idea.status || 'submitted'] = (byStatus[idea.status || 'submitted'] || 0) + 1;
    byCategory[idea.category || 'other'] = (byCategory[idea.category || 'other'] || 0) + 1;
  }

  return {
    totalIdeas: ideas.length,
    byStatus,
    byCategory,
    totalVotes: votesResult.count || 0,
    recentIdeas: recentResult.count || 0,
  };
}
