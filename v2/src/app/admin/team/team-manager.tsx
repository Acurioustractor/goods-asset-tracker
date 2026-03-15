'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addTeamMember, updateTeamMember, toggleActive } from './actions';
import type { TeamMember } from '@/lib/types/database';

export default function TeamManager({ members }: { members: TeamMember[] }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleAdd(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addTeamMember(formData);
      if (result?.error) setError(result.error);
      else setShowAddForm(false);
    });
  }

  function handleUpdate(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updateTeamMember(formData);
      if (result?.error) setError(result.error);
      else setEditingId(null);
    });
  }

  function handleToggle(id: string, active: boolean) {
    startTransition(async () => {
      await toggleActive(id, active);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Members</h1>
          <p className="text-gray-500 mt-1">
            {members.filter((m) => m.is_active).length} active members
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Member'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded text-sm">{error}</div>
      )}

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">New Team Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Name</Label>
                <Input name="name" required />
              </div>
              <div>
                <Label>Role</Label>
                <Input name="role" placeholder="e.g. Production Lead" />
              </div>
              <div>
                <Label>Community</Label>
                <Input name="community" placeholder="e.g. Ali Curung" />
              </div>
              <div>
                <Label>Photo URL</Label>
                <Input name="photo" type="url" />
              </div>
              <div>
                <Label>Artisan</Label>
                <select name="is_artisan" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <div>
                <Label>Staff</Label>
                <select name="is_staff" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <Label>Bio</Label>
                <Textarea name="bio" rows={3} />
              </div>
              <div className="md:col-span-3">
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Adding...' : 'Add Member'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.length === 0 ? (
          <p className="text-gray-400 col-span-full text-center py-8">No team members yet</p>
        ) : (
          members.map((m) => (
            <Card key={m.id} className={!m.is_active ? 'opacity-50' : ''}>
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {m.photo ? (
                      <img
                        src={m.photo}
                        alt={m.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                        {m.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{m.name}</h3>
                      {m.role && <p className="text-sm text-gray-500">{m.role}</p>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {m.is_artisan && <Badge variant="secondary">Artisan</Badge>}
                    {m.is_staff && <Badge variant="secondary">Staff</Badge>}
                  </div>
                </div>

                {m.community && (
                  <p className="text-sm text-gray-600">{m.community}</p>
                )}
                {m.bio && (
                  <p className="text-sm text-gray-500 line-clamp-2">{m.bio}</p>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingId(editingId === m.id ? null : m.id)}
                  >
                    {editingId === m.id ? 'Close' : 'Edit'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggle(m.id, !m.is_active)}
                    disabled={isPending}
                  >
                    {m.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>

                {editingId === m.id && (
                  <form action={handleUpdate} className="space-y-3 pt-3 border-t">
                    <input type="hidden" name="id" value={m.id} />
                    <div>
                      <Label className="text-xs">Name</Label>
                      <Input name="name" defaultValue={m.name} required className="h-8 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">Role</Label>
                      <Input name="role" defaultValue={m.role || ''} className="h-8 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">Community</Label>
                      <Input name="community" defaultValue={m.community || ''} className="h-8 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs">Photo URL</Label>
                      <Input name="photo" defaultValue={m.photo || ''} className="h-8 text-sm" />
                    </div>
                    <div className="flex gap-4">
                      <div>
                        <Label className="text-xs">Artisan</Label>
                        <select name="is_artisan" defaultValue={String(m.is_artisan)} className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm">
                          <option value="false">No</option>
                          <option value="true">Yes</option>
                        </select>
                      </div>
                      <div>
                        <Label className="text-xs">Staff</Label>
                        <select name="is_staff" defaultValue={String(m.is_staff)} className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm">
                          <option value="false">No</option>
                          <option value="true">Yes</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Bio</Label>
                      <Textarea name="bio" defaultValue={m.bio || ''} rows={3} className="text-sm" />
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
