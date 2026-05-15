'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { addNote, getContactNotes } from '../actions';
import type { CrmNote, NoteType } from '@/lib/types/database';

const NOTE_TYPES: { value: NoteType; label: string; icon: string }[] = [
  { value: 'note', label: 'Note', icon: '📝' },
  { value: 'milestone', label: 'Milestone', icon: '🏆' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'call', label: 'Call', icon: '📞' },
  { value: 'meeting', label: 'Meeting', icon: '🤝' },
  { value: 'delivery', label: 'Delivery', icon: '📦' },
  { value: 'follow_up', label: 'Follow-up', icon: '🔔' },
];

export function ContactNotes({
  contactId,
  initialNotes,
}: {
  contactId: string;
  initialNotes: CrmNote[];
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleAdd(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addNote(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setShowForm(false);
        const updated = await getContactNotes(contactId);
        setNotes(updated);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Note'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-3 py-2 rounded text-sm">{error}</div>
      )}

      {showForm && (
        <Card>
          <CardContent className="pt-4">
            <form action={handleAdd} className="space-y-3">
              <input type="hidden" name="contact_id" value={contactId} />
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input name="title" placeholder="Title (optional)" />
                </div>
                <select
                  name="note_type"
                  className="rounded-md border border-gray-300 px-2 py-1 text-sm"
                  defaultValue="note"
                >
                  {NOTE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.icon} {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <Textarea name="content" placeholder="Write a note..." rows={3} required />
              <Button type="submit" size="sm" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Note'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {notes.length === 0 && !showForm && (
        <div className="text-center py-8 text-gray-400 text-sm">
          No notes yet. Add one to start tracking this relationship.
        </div>
      )}

      {notes.map((note) => {
        const typeInfo = NOTE_TYPES.find((t) => t.value === note.note_type) || NOTE_TYPES[0];
        return (
          <div key={note.id} className="flex gap-3 group">
            <div className="text-lg flex-shrink-0 mt-0.5">{typeInfo.icon}</div>
            <div className="flex-1 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                {note.title && <span className="text-sm font-medium">{note.title}</span>}
                <Badge variant="outline" className="text-[10px]">{typeInfo.label}</Badge>
                <span className="text-[10px] text-gray-400">
                  {new Date(note.created_at).toLocaleDateString('en-AU', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                {note.is_pinned && <span className="text-[10px]">📌</span>}
              </div>
              <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{note.content}</p>
              {note.created_by && (
                <p className="text-[10px] text-gray-400 mt-1">by {note.created_by}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
