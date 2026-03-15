'use client';

import { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  getStories,
  createStory,
  updateStory,
  toggleStoryPublish,
  toggleStoryFeatured,
} from './actions';
import type { Story } from '@/lib/types/database';

const STORY_TYPES = [
  'community_voice',
  'impact_report',
  'bed_journey',
  'artisan_profile',
  'news',
  'blog',
] as const;

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStories().then(setStories);
  }, []);

  function refresh() {
    getStories().then(setStories);
  }

  function handleAdd(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createStory(formData);
      if (result?.error) setError(result.error);
      else {
        setShowAddForm(false);
        refresh();
      }
    });
  }

  function handleUpdate(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updateStory(formData);
      if (result?.error) setError(result.error);
      else {
        setEditingId(null);
        refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stories</h1>
          <p className="text-gray-500 mt-1">{stories.length} total</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Story'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded text-sm">{error}</div>
      )}

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">New Story</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input name="title" required />
              </div>
              <div>
                <Label>Subtitle</Label>
                <Input name="subtitle" />
              </div>
              <div>
                <Label>Type</Label>
                <select name="story_type" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                  {STORY_TYPES.map((t) => (
                    <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Community</Label>
                <Input name="community" />
              </div>
              <div>
                <Label>Featured Image URL</Label>
                <Input name="featured_image" type="url" />
              </div>
              <div>
                <Label>Publish</Label>
                <select name="is_published" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                  <option value="false">Draft</option>
                  <option value="true">Publish</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <Label>Content</Label>
                <Textarea name="content" rows={6} />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Creating...' : 'Create Story'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="pb-2 font-medium">Title</th>
              <th className="pb-2 font-medium">Type</th>
              <th className="pb-2 font-medium">Community</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stories.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  No stories yet
                </td>
              </tr>
            ) : (
              stories.map((s) => (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="py-3">
                    <div className="font-medium">{s.title}</div>
                    {s.subtitle && (
                      <div className="text-xs text-gray-500">{s.subtitle}</div>
                    )}
                  </td>
                  <td className="py-3 text-gray-600">
                    {s.story_type.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3 text-gray-600">{s.community || '—'}</td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <Badge
                        className={
                          s.is_published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {s.is_published ? 'Published' : 'Draft'}
                      </Badge>
                      {s.is_featured && (
                        <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                      )}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          startTransition(async () => {
                            await toggleStoryPublish(s.id, !s.is_published);
                            refresh();
                          });
                        }}
                        disabled={isPending}
                      >
                        {s.is_published ? 'Unpublish' : 'Publish'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          startTransition(async () => {
                            await toggleStoryFeatured(s.id, !s.is_featured);
                            refresh();
                          });
                        }}
                        disabled={isPending}
                      >
                        {s.is_featured ? 'Unfeature' : 'Feature'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(editingId === s.id ? null : s.id)}
                      >
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingId && (() => {
        const s = stories.find((s) => s.id === editingId);
        if (!s) return null;
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Edit: {s.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="hidden" name="id" value={s.id} />
                <div>
                  <Label>Title</Label>
                  <Input name="title" defaultValue={s.title} required />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Input name="subtitle" defaultValue={s.subtitle || ''} />
                </div>
                <div>
                  <Label>Type</Label>
                  <select name="story_type" defaultValue={s.story_type} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                    {STORY_TYPES.map((t) => (
                      <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Community</Label>
                  <Input name="community" defaultValue={s.community || ''} />
                </div>
                <div>
                  <Label>Featured Image URL</Label>
                  <Input name="featured_image" defaultValue={s.featured_image || ''} />
                </div>
                <div className="md:col-span-2">
                  <Label>Content</Label>
                  <Textarea name="content" defaultValue={s.content || ''} rows={6} />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        );
      })()}
    </div>
  );
}
