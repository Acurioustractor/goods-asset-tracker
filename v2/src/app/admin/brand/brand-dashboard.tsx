'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Repeat2,
  Plus,
  Globe,
  Hash,
  Calendar,
  Trash2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import {
  type BrandStats,
  type LinkedInPost,
  type PostTheme,
  type PostType,
  createPost,
  deletePost,
} from './actions';

const THEME_CONFIG: Record<string, { label: string; color: string; emoji: string }> = {
  product: { label: 'Product', color: 'bg-emerald-100 text-emerald-700', emoji: '🛏️' },
  community: { label: 'Community', color: 'bg-blue-100 text-blue-700', emoji: '🌏' },
  impact: { label: 'Impact', color: 'bg-purple-100 text-purple-700', emoji: '📊' },
  manufacturing: { label: 'Manufacturing', color: 'bg-amber-100 text-amber-700', emoji: '🔧' },
  partnership: { label: 'Partnership', color: 'bg-pink-100 text-pink-700', emoji: '🤝' },
  funding: { label: 'Funding', color: 'bg-sky-100 text-sky-700', emoji: '💰' },
  personal: { label: 'Personal', color: 'bg-orange-100 text-orange-700', emoji: '👤' },
  thought_leadership: { label: 'Thought Leadership', color: 'bg-indigo-100 text-indigo-700', emoji: '💡' },
  other: { label: 'Other', color: 'bg-gray-100 text-gray-700', emoji: '📝' },
};

interface Props {
  stats: BrandStats;
  posts: LinkedInPost[];
}

export function BrandDashboard({ stats, posts }: Props) {
  const [showNewPost, setShowNewPost] = useState(false);
  const [themeFilter, setThemeFilter] = useState<string>('all');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const router = useRouter();

  const filtered = themeFilter === 'all' ? posts : posts.filter(p => p.theme === themeFilter);

  async function handleDelete(id: string) {
    await deletePost(id);
    setConfirmDelete(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={BarChart3} label="Total Posts" value={String(stats.totalPosts)} color="text-blue-600" />
        <MetricCard icon={Eye} label="Total Impressions" value={stats.totalImpressions.toLocaleString()} color="text-purple-600" />
        <MetricCard icon={Heart} label="Total Engagements" value={stats.totalEngagements.toLocaleString()} color="text-pink-600" />
        <MetricCard icon={TrendingUp} label="Avg Engagement" value={`${stats.avgEngagementRate.toFixed(1)}%`} color="text-emerald-600" />
      </div>

      {/* Theme Breakdown */}
      {Object.keys(stats.byTheme).length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Content Mix by Theme</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(stats.byTheme)
              .sort((a, b) => b[1].count - a[1].count)
              .map(([theme, data]) => {
                const config = THEME_CONFIG[theme] || THEME_CONFIG.other;
                return (
                  <button
                    key={theme}
                    onClick={() => setThemeFilter(themeFilter === theme ? 'all' : theme)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      themeFilter === theme ? 'ring-2 ring-orange-500 border-orange-200' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-lg mb-1">{config.emoji}</div>
                    <div className="text-sm font-medium text-gray-900">{config.label}</div>
                    <div className="text-xs text-gray-500">{data.count} posts</div>
                    {data.impressions > 0 && (
                      <div className="text-xs text-gray-400">{data.impressions.toLocaleString()} impressions</div>
                    )}
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* Top Performing Posts */}
      {stats.topPosts.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Top Performing Posts</h3>
          <div className="space-y-3">
            {stats.topPosts.map((post, i) => (
              <div key={post.id} className="flex items-start gap-3">
                <span className="text-lg font-bold text-gray-300 w-6 text-right">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 line-clamp-2">{post.content.substring(0, 150)}...</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{post.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{post.comments}</span>
                    <span className="flex items-center gap-1"><Repeat2 className="h-3 w-3" />{post.reposts}</span>
                    {post.impressions > 0 && <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.impressions.toLocaleString()}</span>}
                  </div>
                </div>
                {post.theme && (
                  <span className={`px-2 py-0.5 rounded text-xs shrink-0 ${THEME_CONFIG[post.theme]?.color || THEME_CONFIG.other.color}`}>
                    {THEME_CONFIG[post.theme]?.label || post.theme}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => setThemeFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            themeFilter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All ({posts.length})
        </button>
        {Object.entries(THEME_CONFIG).map(([key, config]) => {
          const count = posts.filter(p => p.theme === key).length;
          if (count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setThemeFilter(themeFilter === key ? 'all' : key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                themeFilter === key ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {config.emoji} {config.label} ({count})
            </button>
          );
        })}
        <button
          onClick={() => setShowNewPost(!showNewPost)}
          className="ml-auto flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white rounded-full text-xs font-medium hover:bg-orange-600"
        >
          <Plus className="h-3 w-3" />
          Add Post
        </button>
      </div>

      {/* New Post Form */}
      {showNewPost && (
        <NewPostForm
          onClose={() => setShowNewPost(false)}
          onCreated={() => { setShowNewPost(false); router.refresh(); }}
        />
      )}

      {/* Posts List */}
      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Globe className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>No posts yet. Add your LinkedIn posts to track brand strategy.</p>
          </div>
        ) : (
          filtered.map(post => {
            const theme = THEME_CONFIG[post.theme || 'other'] || THEME_CONFIG.other;
            return (
              <div key={post.id}>
                <button
                  onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                  className="w-full flex items-start gap-3 p-4 hover:bg-gray-50 text-left transition-colors"
                >
                  <span className="text-gray-400 pt-1">
                    {expandedPost === post.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 line-clamp-2">{post.content.substring(0, 200)}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.post_date).toLocaleDateString('en-AU')}
                      </span>
                      <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{post.likes}</span>
                      <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{post.comments}</span>
                      <span className="flex items-center gap-1"><Repeat2 className="h-3 w-3" />{post.reposts}</span>
                      {post.impressions > 0 && (
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{post.impressions.toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-xs shrink-0 ${theme.color}`}>
                    {theme.emoji} {theme.label}
                  </span>

                  <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs shrink-0">
                    {post.post_type}
                  </span>
                </button>

                {expandedPost === post.id && (
                  <div className="px-12 pb-4 bg-gray-50 border-t border-gray-100">
                    <div className="pt-3 space-y-3">
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">{post.content}</div>

                      <div className="flex items-center gap-4 text-sm">
                        {post.post_url && (
                          <a href={post.post_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-orange-600 hover:underline">
                            <ExternalLink className="h-3 w-3" />
                            View on LinkedIn
                          </a>
                        )}
                        {post.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Hash className="h-3 w-3 text-gray-400" />
                            {post.tags.map(tag => (
                              <span key={tag} className="px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded text-xs">{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>

                      {post.top_comment && (
                        <div className="bg-white border border-gray-200 rounded p-3 text-sm">
                          <span className="text-xs font-medium text-gray-500">Top Comment:</span>
                          <p className="text-gray-700 mt-1">{post.top_comment}</p>
                        </div>
                      )}

                      {post.engagement_rate > 0 && (
                        <div className="text-xs text-gray-500">
                          Engagement rate: {post.engagement_rate}%
                          {post.campaign && ` · Campaign: ${post.campaign}`}
                        </div>
                      )}

                      {/* Delete */}
                      <div className="pt-2 border-t border-gray-200">
                        {confirmDelete === post.id ? (
                          <div className="flex gap-2">
                            <button onClick={() => handleDelete(post.id)} className="px-2 py-1 bg-red-500 text-white rounded text-xs">Confirm Delete</button>
                            <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDelete(post.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500">
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color }: { icon: typeof BarChart3; label: string; value: string; color: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-start gap-3">
      <Icon className={`h-8 w-8 ${color} shrink-0`} />
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function NewPostForm({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [content, setContent] = useState('');
  const [postUrl, setPostUrl] = useState('');
  const [postDate, setPostDate] = useState(new Date().toISOString().split('T')[0]);
  const [postType, setPostType] = useState<PostType>('text');
  const [theme, setTheme] = useState<PostTheme | ''>('');
  const [likes, setLikes] = useState('');
  const [comments, setComments] = useState('');
  const [reposts, setReposts] = useState('');
  const [impressions, setImpressions] = useState('');
  const [topComment, setTopComment] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!content) return;
    setSaving(true);
    await createPost({
      content,
      post_url: postUrl || undefined,
      post_date: postDate,
      post_type: postType,
      theme: theme as PostTheme || undefined,
      likes: likes ? parseInt(likes) : 0,
      comments: comments ? parseInt(comments) : 0,
      reposts: reposts ? parseInt(reposts) : 0,
      impressions: impressions ? parseInt(impressions) : 0,
      top_comment: topComment || undefined,
    });
    onCreated();
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-900">Add LinkedIn Post</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
      </div>

      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Paste your LinkedIn post content..."
        rows={4}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <input type="url" placeholder="Post URL" value={postUrl} onChange={e => setPostUrl(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm" />
        <input type="date" value={postDate} onChange={e => setPostDate(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm" />
        <select value={postType} onChange={e => setPostType(e.target.value as PostType)} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option value="text">Text</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="article">Article</option>
          <option value="carousel">Carousel</option>
          <option value="poll">Poll</option>
        </select>
        <select value={theme} onChange={e => setTheme(e.target.value as PostTheme)} className="border border-gray-300 rounded-md px-3 py-2 text-sm">
          <option value="">Theme...</option>
          {Object.entries(THEME_CONFIG).filter(([k]) => k !== 'other').map(([key, config]) => (
            <option key={key} value={key}>{config.emoji} {config.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <input type="number" placeholder="Likes" value={likes} onChange={e => setLikes(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm" />
        <input type="number" placeholder="Comments" value={comments} onChange={e => setComments(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm" />
        <input type="number" placeholder="Reposts" value={reposts} onChange={e => setReposts(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm" />
        <input type="number" placeholder="Impressions" value={impressions} onChange={e => setImpressions(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm" />
      </div>

      <input type="text" placeholder="Top comment (optional)" value={topComment} onChange={e => setTopComment(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />

      <button onClick={handleSubmit} disabled={!content || saving} className="px-4 py-2 bg-orange-500 text-white rounded-md text-sm hover:bg-orange-600 disabled:opacity-50">
        {saving ? 'Saving...' : 'Save Post'}
      </button>
    </div>
  );
}
