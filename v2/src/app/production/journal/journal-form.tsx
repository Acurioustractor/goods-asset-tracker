'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VoiceRecorder } from '@/components/production/voice-recorder';
import { PhotoUpload } from '@/components/production/photo-upload';
import { createClient } from '@/lib/supabase/client';
import { uploadProductionMedia } from '@/lib/supabase/storage';
import { compressImage } from '@/lib/utils/compress-image';
import type { ProductionJournal } from '@/lib/types/database';

const DEFAULT_OPERATORS = ['Nic', 'Ben', 'Jimmy', 'Community Member'];

const ENTRY_TYPES = [
  { value: 'reflection', label: 'Reflection', color: 'bg-blue-500 text-white' },
  { value: 'issue', label: 'Issue', color: 'bg-red-500 text-white' },
  { value: 'cost_idea', label: 'Cost Idea', color: 'bg-amber-500 text-white' },
  { value: 'general', label: 'General', color: 'bg-gray-500 text-white' },
] as const;

const ENTRY_TYPE_BADGES: Record<string, string> = {
  reflection: 'bg-blue-100 text-blue-800',
  issue: 'bg-red-100 text-red-800',
  cost_idea: 'bg-amber-100 text-amber-800',
  general: 'bg-gray-100 text-gray-800',
};

export function JournalForm() {
  const [userId, setUserId] = React.useState<string | null>(null);
  const [operators, setOperators] = React.useState<string[]>(DEFAULT_OPERATORS);
  const [operator, setOperator] = React.useState('');
  const [entryType, setEntryType] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');

  // Media
  const [voiceBlob, setVoiceBlob] = React.useState<Blob | null>(null);
  const [voiceMimeType, setVoiceMimeType] = React.useState('');
  const [voicePreviewUrl, setVoicePreviewUrl] = React.useState<string | null>(null);
  const [voiceTranscript, setVoiceTranscript] = React.useState('');
  const [photos, setPhotos] = React.useState<File[]>([]);

  // UI
  const [isLoading, setIsLoading] = React.useState(false);
  const [uploadStatus, setUploadStatus] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [recentEntries, setRecentEntries] = React.useState<ProductionJournal[]>([]);

  React.useEffect(() => {
    const supabase = createClient();
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single();
      if (profile?.display_name && profile.display_name !== 'User') {
        const name = profile.display_name;
        setOperators((prev) => (prev.includes(name) ? prev : [name, ...prev]));
        setOperator(name);
      }
    }
    loadUser();
  }, []);

  React.useEffect(() => {
    fetch('/api/production/journal?limit=10')
      .then((r) => r.json())
      .then((data) => {
        if (data.entries) setRecentEntries(data.entries);
      })
      .catch(() => {});
  }, []);

  const handleRecordingComplete = (blob: Blob, mimeType: string) => {
    setVoiceBlob(blob);
    setVoiceMimeType(mimeType);
    setVoicePreviewUrl(URL.createObjectURL(blob));
  };

  const handleRecordingRemoved = () => {
    if (voicePreviewUrl) URL.revokeObjectURL(voicePreviewUrl);
    setVoiceBlob(null);
    setVoiceMimeType('');
    setVoicePreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!operator) { setError('Please select an operator'); return; }
    if (!entryType) { setError('Please select an entry type'); return; }
    if (!title.trim()) { setError('Please add a title'); return; }

    setIsLoading(true);
    setError(null);
    setUploadStatus(null);

    try {
      const date = new Date().toISOString().split('T')[0];
      const mediaUserId = userId || 'anonymous';
      const voiceNoteUrls: string[] = [];
      const photoUrls: string[] = [];

      if (voiceBlob) {
        setUploadStatus('Uploading voice note...');
        const ext = voiceMimeType.includes('webm') ? 'webm' : voiceMimeType.includes('mp4') ? 'mp4' : 'ogg';
        const url = await uploadProductionMedia(voiceBlob, mediaUserId, date, `journal-voice.${ext}`);
        voiceNoteUrls.push(url);
      }

      if (photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
          setUploadStatus(`Uploading photo ${i + 1}/${photos.length}...`);
          const compressed = await compressImage(photos[i]);
          const url = await uploadProductionMedia(compressed, mediaUserId, date, `journal-photo-${i + 1}.jpg`);
          photoUrls.push(url);
        }
      }

      setUploadStatus('Saving journal entry...');

      const response = await fetch('/api/production/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operator,
          entry_date: date,
          entry_type: entryType,
          title: title.trim(),
          content: content || null,
          voice_note_urls: voiceNoteUrls,
          voice_note_transcripts: voiceTranscript ? [voiceTranscript] : [],
          photo_urls: photoUrls,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save');

      setSuccess(true);
      setEntryType('');
      setTitle('');
      setContent('');
      handleRecordingRemoved();
      setVoiceTranscript('');
      setPhotos([]);
      setUploadStatus(null);

      // Refresh entries
      const refreshRes = await fetch('/api/production/journal?limit=10');
      const refreshData = await refreshRes.json();
      if (refreshData.entries) setRecentEntries(refreshData.entries);

      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSuccess(false), 8000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setUploadStatus(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-8">
      {success && (
        <div className="rounded-xl bg-green-50 border-2 border-green-300 p-6 text-center">
          <div className="text-4xl mb-2">&#10003;</div>
          <p className="text-lg font-semibold text-green-800">Journal entry saved</p>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 border-2 border-red-300 p-6 text-center">
          <p className="text-lg font-semibold text-red-800">{error}</p>
        </div>
      )}

      {/* Operator */}
      <Card>
        <CardContent>
          <Label
            className="text-base font-semibold mb-3 block"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Who&apos;s writing?
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {operators.map((op) => (
              <button
                key={op}
                type="button"
                onClick={() => setOperator(op)}
                className={`h-14 rounded-xl text-base font-medium transition-all border-2 ${
                  operator === op
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-foreground border-border hover:border-foreground/50'
                }`}
              >
                {op}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Entry Type */}
      <Card>
        <CardContent>
          <Label
            className="text-base font-semibold mb-3 block"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            What kind of entry?
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {ENTRY_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setEntryType(type.value)}
                className={`h-14 rounded-xl text-base font-medium transition-all border-2 ${
                  entryType === type.value
                    ? `${type.color} border-transparent shadow-md scale-105`
                    : 'bg-background text-foreground border-border hover:border-foreground/50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Title */}
      <Card>
        <CardContent>
          <Label
            htmlFor="title"
            className="text-base font-semibold mb-3 block"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Title
          </Label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief summary..."
            className="w-full h-14 px-4 rounded-xl text-base border-2 border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground"
          />
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardContent>
          <Label
            htmlFor="content"
            className="text-base font-semibold mb-3 block"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Details
          </Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Full details, observations, ideas..."
            rows={4}
            className="text-base min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Voice Note */}
      <Card>
        <CardContent>
          <Label
            className="text-base font-semibold mb-3 block"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Voice Note
          </Label>
          <VoiceRecorder
            onRecordingComplete={handleRecordingComplete}
            onRecordingRemoved={handleRecordingRemoved}
            onTranscriptReady={setVoiceTranscript}
            hasRecording={!!voiceBlob}
            recordingUrl={voicePreviewUrl}
          />
        </CardContent>
      </Card>

      {/* Photos */}
      <Card>
        <CardContent>
          <Label
            className="text-base font-semibold mb-3 block"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Photos
          </Label>
          <PhotoUpload photos={photos} onPhotosChange={setPhotos} />
        </CardContent>
      </Card>

      {uploadStatus && (
        <div className="rounded-xl bg-blue-50 border-2 border-blue-300 p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-blue-800">{uploadStatus}</p>
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={isLoading || !operator || !entryType || !title.trim()}
        className="w-full h-16 text-lg font-semibold rounded-xl bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : 'Save Journal Entry'}
      </Button>

      {/* Recent Entries */}
      {recentEntries.length > 0 && (
        <div className="pt-8 border-t mt-8">
          <h2
            className="text-xl font-semibold mb-4"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Recent Entries
          </h2>
          <div className="space-y-4">
            {recentEntries.map((entry) => {
              const formattedDate = new Date(entry.entry_date + 'T00:00:00').toLocaleDateString('en-AU', {
                weekday: 'short', day: 'numeric', month: 'short',
              });
              return (
                <Card key={entry.id}>
                  <CardContent>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{entry.title}</p>
                        <p className="text-sm text-muted-foreground">{entry.operator} &middot; {formattedDate}</p>
                      </div>
                      <Badge className={ENTRY_TYPE_BADGES[entry.entry_type] || ''}>
                        {entry.entry_type === 'cost_idea' ? 'Cost Idea' : entry.entry_type.charAt(0).toUpperCase() + entry.entry_type.slice(1)}
                      </Badge>
                    </div>
                    {entry.content && (
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{entry.content}</p>
                    )}
                    {entry.voice_note_urls?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {entry.voice_note_urls.map((url, i) => (
                          <div key={i} className="space-y-1">
                            <audio controls src={url} className="w-full h-8" />
                            {entry.voice_note_transcripts?.[i] && (
                              <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-2 italic">
                                {entry.voice_note_transcripts[i]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {entry.photo_urls?.length > 0 && (
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {entry.photo_urls.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block aspect-square rounded-lg overflow-hidden bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                          </a>
                        ))}
                      </div>
                    )}
                    {entry.is_resolved && (
                      <p className="text-xs text-green-600 font-medium mt-2">Resolved</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </form>
  );
}
