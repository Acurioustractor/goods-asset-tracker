'use client';

import { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  togglePublish,
} from './actions';
import type { Announcement } from '@/lib/types/database';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAnnouncements().then(setAnnouncements);
  }, []);

  function refresh() {
    getAnnouncements().then(setAnnouncements);
  }

  function handleAdd(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createAnnouncement(formData);
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
      const result = await updateAnnouncement(formData);
      if (result?.error) setError(result.error);
      else {
        setEditingId(null);
        refresh();
      }
    });
  }

  function handleToggle(id: string, publish: boolean) {
    startTransition(async () => {
      await togglePublish(id, publish);
      refresh();
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Announcements</h1>
          <p className="text-gray-500 mt-1">{announcements.length} total</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'New Announcement'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded text-sm">{error}</div>
      )}

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">New Announcement</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleAdd} className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input name="title" required />
              </div>
              <div>
                <Label>Content</Label>
                <Textarea name="content" rows={4} />
              </div>
              <div>
                <Label>Publish immediately</Label>
                <select name="is_published" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                  <option value="false">Draft</option>
                  <option value="true">Publish</option>
                </select>
              </div>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Creating...' : 'Create'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {announcements.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No announcements yet</p>
        ) : (
          announcements.map((a) => (
            <Card key={a.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{a.title}</h3>
                    {a.content && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{a.content}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(a.created_at).toLocaleDateString('en-AU')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={
                        a.is_published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {a.is_published ? 'Published' : 'Draft'}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggle(a.id, !a.is_published)}
                      disabled={isPending}
                    >
                      {a.is_published ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingId(editingId === a.id ? null : a.id)}
                    >
                      {editingId === a.id ? 'Close' : 'Edit'}
                    </Button>
                  </div>
                </div>

                {editingId === a.id && (
                  <form action={handleUpdate} className="space-y-3 pt-4 mt-4 border-t">
                    <input type="hidden" name="id" value={a.id} />
                    <div>
                      <Label className="text-xs">Title</Label>
                      <Input name="title" defaultValue={a.title} required />
                    </div>
                    <div>
                      <Label className="text-xs">Content</Label>
                      <Textarea name="content" defaultValue={a.content || ''} rows={4} />
                    </div>
                    <Button type="submit" size="sm" disabled={isPending}>
                      {isPending ? 'Saving...' : 'Save'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
