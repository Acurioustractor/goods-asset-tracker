'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type PostTheme = 'product' | 'community' | 'impact' | 'manufacturing' | 'partnership' | 'funding' | 'personal' | 'thought_leadership';
export type PostType = 'text' | 'image' | 'video' | 'article' | 'carousel' | 'poll';

export interface LinkedInPost {
  id: string;
  post_url: string | null;
  content: string;
  post_date: string;
  author: string;
  post_type: PostType;
  theme: PostTheme | null;
  campaign: string | null;
  likes: number;
  comments: number;
  reposts: number;
  impressions: number;
  engagement_rate: number;
  top_comment: string | null;
  tags: string[];
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface BrandStats {
  totalPosts: number;
  totalImpressions: number;
  totalEngagements: number;
  avgEngagementRate: number;
  byTheme: Record<string, { count: number; impressions: number; engagements: number }>;
  byType: Record<string, number>;
  topPosts: LinkedInPost[];
  recentPosts: LinkedInPost[];
  monthlyTrend: { month: string; posts: number; impressions: number }[];
}

export async function getBrandStats(): Promise<BrandStats> {
  const supabase = createServiceClient();

  const { data: posts } = await supabase
    .from('linkedin_posts')
    .select('*')
    .order('post_date', { ascending: false });

  const allPosts = (posts || []) as LinkedInPost[];

  const byTheme: Record<string, { count: number; impressions: number; engagements: number }> = {};
  const byType: Record<string, number> = {};
  let totalImpressions = 0;
  let totalEngagements = 0;
  let totalEngRate = 0;

  for (const p of allPosts) {
    const theme = p.theme || 'other';
    if (!byTheme[theme]) byTheme[theme] = { count: 0, impressions: 0, engagements: 0 };
    byTheme[theme].count++;
    byTheme[theme].impressions += p.impressions;
    byTheme[theme].engagements += p.likes + p.comments + p.reposts;

    byType[p.post_type] = (byType[p.post_type] || 0) + 1;
    totalImpressions += p.impressions;
    totalEngagements += p.likes + p.comments + p.reposts;
    totalEngRate += p.engagement_rate;
  }

  // Monthly trend
  const monthMap = new Map<string, { posts: number; impressions: number }>();
  for (const p of allPosts) {
    const month = p.post_date.substring(0, 7); // YYYY-MM
    const existing = monthMap.get(month) || { posts: 0, impressions: 0 };
    existing.posts++;
    existing.impressions += p.impressions;
    monthMap.set(month, existing);
  }
  const monthlyTrend = Array.from(monthMap.entries())
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-12);

  // Top posts by engagement
  const topPosts = [...allPosts]
    .sort((a, b) => (b.likes + b.comments + b.reposts) - (a.likes + a.comments + a.reposts))
    .slice(0, 5);

  return {
    totalPosts: allPosts.length,
    totalImpressions,
    totalEngagements,
    avgEngagementRate: allPosts.length > 0 ? totalEngRate / allPosts.length : 0,
    byTheme,
    byType,
    topPosts,
    recentPosts: allPosts.slice(0, 10),
    monthlyTrend,
  };
}

export async function getAllPosts(): Promise<LinkedInPost[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('linkedin_posts')
    .select('*')
    .order('post_date', { ascending: false });
  return (data || []) as LinkedInPost[];
}

export async function createPost(data: {
  content: string;
  post_url?: string;
  post_date?: string;
  post_type?: PostType;
  theme?: PostTheme;
  campaign?: string;
  likes?: number;
  comments?: number;
  reposts?: number;
  impressions?: number;
  top_comment?: string;
  tags?: string[];
}) {
  const supabase = createServiceClient();

  const engagements = (data.likes || 0) + (data.comments || 0) + (data.reposts || 0);
  const engRate = data.impressions && data.impressions > 0
    ? (engagements / data.impressions) * 100
    : 0;

  const { error } = await supabase.from('linkedin_posts').insert({
    content: data.content,
    post_url: data.post_url || null,
    post_date: data.post_date || new Date().toISOString().split('T')[0],
    post_type: data.post_type || 'text',
    theme: data.theme || null,
    campaign: data.campaign || null,
    likes: data.likes || 0,
    comments: data.comments || 0,
    reposts: data.reposts || 0,
    impressions: data.impressions || 0,
    engagement_rate: Math.round(engRate * 100) / 100,
    top_comment: data.top_comment || null,
    tags: data.tags || [],
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/brand');
  return { success: true };
}

export async function updatePostMetrics(postId: string, metrics: {
  likes?: number;
  comments?: number;
  reposts?: number;
  impressions?: number;
}) {
  const supabase = createServiceClient();

  const engagements = (metrics.likes || 0) + (metrics.comments || 0) + (metrics.reposts || 0);
  const engRate = metrics.impressions && metrics.impressions > 0
    ? (engagements / metrics.impressions) * 100
    : 0;

  const { error } = await supabase
    .from('linkedin_posts')
    .update({ ...metrics, engagement_rate: Math.round(engRate * 100) / 100 })
    .eq('id', postId);

  if (error) return { error: error.message };
  revalidatePath('/admin/brand');
  return { success: true };
}

export async function deletePost(postId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from('linkedin_posts').delete().eq('id', postId);
  if (error) return { error: error.message };
  revalidatePath('/admin/brand');
  return { success: true };
}
