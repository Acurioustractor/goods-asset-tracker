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

const DEFAULT_OPERATORS = ['Nic', 'Ben', 'Jimmy', 'Community Member'];

const COMMON_ISSUES = [
  'Shredder jam',
  'CNC drift',
  'Uneven sheet',
  'Generator issue',
  'Low diesel',
  'Safety concern',
];

const DIESEL_LEVELS: { value: string; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-red-500 text-white' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-500 text-white' },
  { value: 'full', label: 'Full', color: 'bg-green-600 text-white' },
];

interface Shift {
  id: string;
  operator: string;
  shift_date: string;
  sheets_produced: number;
  sheets_cooling: number;
  plastic_shredded_kg: number;
  diesel_level: string;
  issues: string[];
  issue_notes: string | null;
  handover_notes: string | null;
  total_sheets_to_date: number | null;
  voice_note_urls: string[];
  voice_note_transcripts: string[];
  photo_urls: string[];
  created_at: string;
}

export function ShiftLogForm() {
  // Auth state
  const [userId, setUserId] = React.useState<string | null>(null);
  const [operators, setOperators] = React.useState<string[]>(DEFAULT_OPERATORS);

  // Form state
  const [operator, setOperator] = React.useState('');
  const [sheetsProduced, setSheetsProduced] = React.useState(0);
  const [sheetsCooling, setSheetsCooling] = React.useState(0);
  const [plasticShreddedKg, setPlasticShreddedKg] = React.useState(0);
  const [dieselLevel, setDieselLevel] = React.useState('medium');
  const [issues, setIssues] = React.useState<string[]>([]);
  const [issueNotes, setIssueNotes] = React.useState('');
  const [handoverNotes, setHandoverNotes] = React.useState('');

  // Media state
  const [voiceBlob, setVoiceBlob] = React.useState<Blob | null>(null);
  const [voiceMimeType, setVoiceMimeType] = React.useState<string>('');
  const [voicePreviewUrl, setVoicePreviewUrl] = React.useState<string | null>(null);
  const [voiceTranscript, setVoiceTranscript] = React.useState('');
  const [photos, setPhotos] = React.useState<File[]>([]);

  // UI state
  const [isLoading, setIsLoading] = React.useState(false);
  const [uploadStatus, setUploadStatus] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [recentShifts, setRecentShifts] = React.useState<Shift[]>([]);

  // Fetch auth user + profile on mount
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
        // Add to operators if not already there
        setOperators((prev) =>
          prev.includes(name) ? prev : [name, ...prev]
        );
        // Auto-select
        setOperator(name);
      }
    }

    loadUser();
  }, []);

  // Fetch recent shifts on mount
  React.useEffect(() => {
    fetch('/api/production/shifts')
      .then((res) => res.json())
      .then((data) => {
        if (data.shifts) setRecentShifts(data.shifts);
      })
      .catch(() => {});
  }, []);

  const toggleIssue = (issue: string) => {
    setIssues((prev) =>
      prev.includes(issue)
        ? prev.filter((i) => i !== issue)
        : [...prev, issue]
    );
  };

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

    if (!operator) {
      setError('Please select an operator');
      return;
    }

    setIsLoading(true);
    setError(null);
    setUploadStatus(null);

    try {
      const shiftDate = new Date().toISOString().split('T')[0];
      const mediaUserId = userId || 'anonymous';
      const voiceNoteUrls: string[] = [];
      const photoUrls: string[] = [];

      // Upload voice note if present
      if (voiceBlob) {
        setUploadStatus('Uploading voice note...');
        const ext = voiceMimeType.includes('webm') ? 'webm' : voiceMimeType.includes('mp4') ? 'mp4' : 'ogg';
        const url = await uploadProductionMedia(voiceBlob, mediaUserId, shiftDate, `voice.${ext}`);
        voiceNoteUrls.push(url);
      }

      // Compress and upload photos
      if (photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
          setUploadStatus(`Uploading photo ${i + 1}/${photos.length}...`);
          const compressed = await compressImage(photos[i]);
          const url = await uploadProductionMedia(compressed, mediaUserId, shiftDate, `photo-${i + 1}.jpg`);
          photoUrls.push(url);
        }
      }

      setUploadStatus('Saving shift log...');

      const response = await fetch('/api/production/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operator,
          shift_date: shiftDate,
          sheets_produced: sheetsProduced,
          sheets_cooling: sheetsCooling,
          plastic_shredded_kg: plasticShreddedKg,
          diesel_level: dieselLevel,
          issues,
          issue_notes: issueNotes || null,
          handover_notes: handoverNotes || null,
          user_id: userId || null,
          voice_note_urls: voiceNoteUrls,
          voice_note_transcripts: voiceTranscript ? [voiceTranscript] : [],
          photo_urls: photoUrls,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit shift log');
      }

      setSuccess(true);
      // Reset form (keep operator selected)
      setSheetsProduced(0);
      setSheetsCooling(0);
      setPlasticShreddedKg(0);
      setDieselLevel('medium');
      setIssues([]);
      setIssueNotes('');
      setHandoverNotes('');
      handleRecordingRemoved();
      setVoiceTranscript('');
      setPhotos([]);
      setUploadStatus(null);

      // Refresh shift list
      const refreshRes = await fetch('/api/production/shifts');
      const refreshData = await refreshRes.json();
      if (refreshData.shifts) setRecentShifts(refreshData.shifts);

      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSuccess(false), 8000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit shift log');
      setUploadStatus(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-8">
      {/* Success state */}
      {success && (
        <div className="rounded-xl bg-green-50 border-2 border-green-300 p-6 text-center">
          <div className="text-4xl mb-2">&#10003;</div>
          <p className="text-lg font-semibold text-green-800">Shift log submitted</p>
          <p className="text-green-600 mt-1">Good work out there today.</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="rounded-xl bg-red-50 border-2 border-red-300 p-6 text-center">
          <p className="text-lg font-semibold text-red-800">{error}</p>
        </div>
      )}

      {/* Operator */}
      <Card>
        <CardContent>
          <Label
            htmlFor="operator"
            className="text-base font-semibold mb-3 block"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Who&apos;s on shift?
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

      {/* Sheets Produced */}
      <Card>
        <CardContent>
          <Label
            className="text-base font-semibold mb-3 block"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Sheets Produced
          </Label>
          <NumberStepper
            value={sheetsProduced}
            onChange={setSheetsProduced}
            min={0}
            max={100}
          />
        </CardContent>
      </Card>

      {/* Sheets Cooling */}
      <Card>
        <CardContent>
          <Label
            className="text-base font-semibold mb-3 block"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Sheets Cooling
          </Label>
          <NumberStepper
            value={sheetsCooling}
            onChange={setSheetsCooling}
            min={0}
            max={100}
          />
        </CardContent>
      </Card>

      {/* Plastic Shredded */}
      <Card>
        <CardContent>
          <Label
            className="text-base font-semibold mb-3 block"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Plastic Shredded (kg)
          </Label>
          <NumberStepper
            value={plasticShreddedKg}
            onChange={setPlasticShreddedKg}
            min={0}
            max={999}
            step={0.5}
          />
        </CardContent>
      </Card>

      {/* Diesel Level */}
      <Card>
        <CardContent>
          <Label
            className="text-base font-semibold mb-3 block"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Diesel Level
          </Label>
          <div className="grid grid-cols-3 gap-3">
            {DIESEL_LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => setDieselLevel(level.value)}
                className={`h-14 rounded-xl text-base font-semibold transition-all border-2 ${
                  dieselLevel === level.value
                    ? `${level.color} border-transparent shadow-md scale-105`
                    : 'bg-background text-foreground border-border hover:border-foreground/50'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Issues */}
      <Card>
        <CardContent>
          <Label
            className="text-base font-semibold mb-3 block"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Any Issues?
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {COMMON_ISSUES.map((issue) => (
              <button
                key={issue}
                type="button"
                onClick={() => toggleIssue(issue)}
                className={`h-14 rounded-xl text-sm font-medium transition-all border-2 px-3 ${
                  issues.includes(issue)
                    ? 'bg-red-500 text-white border-red-500 shadow-md'
                    : 'bg-background text-foreground border-border hover:border-foreground/50'
                }`}
              >
                {issue}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Issue Notes (shown if issues selected) */}
      {issues.length > 0 && (
        <Card>
          <CardContent>
            <Label
              htmlFor="issue-notes"
              className="text-base font-semibold mb-3 block"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              Issue Details
            </Label>
            <Textarea
              id="issue-notes"
              value={issueNotes}
              onChange={(e) => setIssueNotes(e.target.value)}
              placeholder="Describe what happened..."
              rows={3}
              className="text-base min-h-[80px]"
            />
          </CardContent>
        </Card>
      )}

      {/* Handover Notes */}
      <Card>
        <CardContent>
          <Label
            htmlFor="handover-notes"
            className="text-base font-semibold mb-3 block"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Handover Notes
          </Label>
          <Textarea
            id="handover-notes"
            value={handoverNotes}
            onChange={(e) => setHandoverNotes(e.target.value)}
            placeholder="Anything the next crew needs to know..."
            rows={3}
            className="text-base min-h-[80px]"
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
          <PhotoUpload
            photos={photos}
            onPhotosChange={setPhotos}
          />
        </CardContent>
      </Card>

      {/* Upload progress */}
      {uploadStatus && (
        <div className="rounded-xl bg-blue-50 border-2 border-blue-300 p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium text-blue-800">{uploadStatus}</p>
          </div>
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading || !operator}
        className="w-full h-16 text-lg font-semibold rounded-xl bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
      >
        {isLoading ? 'Submitting...' : 'Submit Shift Log'}
      </Button>

      {/* Recent Shifts */}
      {recentShifts.length > 0 && (
        <div className="pt-8 border-t mt-8">
          <h2
            className="text-xl font-semibold mb-4"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Recent Shifts
          </h2>
          <div className="space-y-4">
            {recentShifts.map((shift) => {
              const dieselColors: Record<string, string> = {
                low: 'bg-red-100 text-red-800',
                medium: 'bg-amber-100 text-amber-800',
                full: 'bg-green-100 text-green-800',
              };
              const formattedDate = new Date(shift.shift_date + 'T00:00:00').toLocaleDateString('en-AU', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              });
              return (
                <Card key={shift.id}>
                  <CardContent>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-base">{shift.operator}</p>
                        <p className="text-sm text-muted-foreground">{formattedDate}</p>
                      </div>
                      <Badge className={dieselColors[shift.diesel_level] || ''}>
                        Diesel: {shift.diesel_level}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center mb-3">
                      <div className="bg-muted rounded-lg p-2">
                        <p className="text-2xl font-bold tabular-nums">{shift.sheets_produced}</p>
                        <p className="text-xs text-muted-foreground">Sheets</p>
                      </div>
                      <div className="bg-muted rounded-lg p-2">
                        <p className="text-2xl font-bold tabular-nums">{shift.sheets_cooling}</p>
                        <p className="text-xs text-muted-foreground">Cooling</p>
                      </div>
                      <div className="bg-muted rounded-lg p-2">
                        <p className="text-2xl font-bold tabular-nums">{shift.plastic_shredded_kg}</p>
                        <p className="text-xs text-muted-foreground">kg Shredded</p>
                      </div>
                    </div>
                    {shift.issues && shift.issues.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {shift.issues.map((issue) => (
                          <Badge key={issue} variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                            {issue}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {shift.handover_notes && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Handover:</span> {shift.handover_notes}
                      </p>
                    )}
                    {/* Voice notes */}
                    {shift.voice_note_urls && shift.voice_note_urls.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {shift.voice_note_urls.map((url, i) => (
                          <div key={i} className="space-y-1">
                            <audio controls src={url} className="w-full h-8" />
                            {shift.voice_note_transcripts?.[i] && (
                              <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-2 italic">
                                {shift.voice_note_transcripts[i]}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Photos */}
                    {shift.photo_urls && shift.photo_urls.length > 0 && (
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {shift.photo_urls.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block aspect-square rounded-lg overflow-hidden bg-muted">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={url} alt={`Shift photo ${i + 1}`} className="w-full h-full object-cover" />
                          </a>
                        ))}
                      </div>
                    )}
                    {shift.total_sheets_to_date != null && (
                      <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                        Total sheets to date: <span className="font-semibold">{shift.total_sheets_to_date}</span>
                      </p>
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

/* ============================
   Number Stepper Component
   ============================ */

function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  const decrement = () => {
    const next = Math.max(min, +(value - step).toFixed(1));
    onChange(next);
  };

  const increment = () => {
    const next = Math.min(max, +(value + step).toFixed(1));
    onChange(next);
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={decrement}
        disabled={value <= min}
        className="h-16 w-16 rounded-xl bg-muted text-foreground text-2xl font-bold transition-all active:scale-95 disabled:opacity-30 border-2 border-border flex items-center justify-center"
        aria-label="Decrease"
      >
        -
      </button>
      <div className="w-24 text-center">
        <span className="text-4xl font-bold tabular-nums">{value}</span>
        {step < 1 && <span className="text-muted-foreground text-sm ml-1">kg</span>}
      </div>
      <button
        type="button"
        onClick={increment}
        disabled={value >= max}
        className="h-16 w-16 rounded-xl bg-muted text-foreground text-2xl font-bold transition-all active:scale-95 disabled:opacity-30 border-2 border-border flex items-center justify-center"
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}
