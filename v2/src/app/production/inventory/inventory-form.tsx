'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { VoiceRecorder } from '@/components/production/voice-recorder';
import { PhotoUpload } from '@/components/production/photo-upload';
import { createClient } from '@/lib/supabase/client';
import { uploadProductionMedia } from '@/lib/supabase/storage';
import { compressImage } from '@/lib/utils/compress-image';
import type { ProductionInventory } from '@/lib/types/database';

const DEFAULT_OPERATORS = ['Nic', 'Ben', 'Jimmy', 'Community Member'];

// BOM per Stretch Bed
const BOM = { legs: 4, tabs: 8, poles: 2, canvas: 1 } as const;

interface FieldDef {
  key: string;
  label: string;
  section: string;
  max: number;
}

const FIELDS: FieldDef[] = [
  { key: 'chipped_plastic_sheets', label: 'Chipped Plastic Sheets', section: 'Raw Material', max: 999 },
  { key: 'tab_sheets_finished', label: 'Tab Sheets (finished)', section: 'Tab Pipeline', max: 999 },
  { key: 'tab_sheets_in_cooker', label: 'Tab Sheets (in cooker)', section: 'Tab Pipeline', max: 999 },
  { key: 'tab_sheets_cooling', label: 'Tab Sheets (cooling)', section: 'Tab Pipeline', max: 999 },
  { key: 'tabs_ready', label: 'Tabs Ready', section: 'Tab Pipeline', max: 9999 },
  { key: 'leg_sheets_uncut', label: 'Leg Sheets (uncut)', section: 'Leg Pipeline', max: 999 },
  { key: 'legs_ready', label: 'Legs Ready', section: 'Leg Pipeline', max: 9999 },
  { key: 'steel_poles', label: 'Steel Poles', section: 'Assembly', max: 999 },
  { key: 'canvas_ready', label: 'Canvas Ready', section: 'Assembly', max: 999 },
];

function calcBedsPossible(values: Record<string, number>) {
  return Math.min(
    Math.floor((values.legs_ready || 0) / BOM.legs),
    Math.floor((values.tabs_ready || 0) / BOM.tabs),
    Math.floor((values.steel_poles || 0) / BOM.poles),
    Math.floor((values.canvas_ready || 0) / BOM.canvas),
  );
}

function getBottleneck(values: Record<string, number>) {
  const byComponent = [
    { name: 'Legs', count: Math.floor((values.legs_ready || 0) / BOM.legs) },
    { name: 'Tabs', count: Math.floor((values.tabs_ready || 0) / BOM.tabs) },
    { name: 'Steel Poles', count: Math.floor((values.steel_poles || 0) / BOM.poles) },
    { name: 'Canvas', count: Math.floor((values.canvas_ready || 0) / BOM.canvas) },
  ];
  byComponent.sort((a, b) => a.count - b.count);
  return byComponent[0];
}

export function InventoryForm() {
  const [userId, setUserId] = React.useState<string | null>(null);
  const [operators, setOperators] = React.useState<string[]>(DEFAULT_OPERATORS);
  const [operator, setOperator] = React.useState('');
  const [values, setValues] = React.useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    FIELDS.forEach((f) => (init[f.key] = 0));
    return init;
  });
  const [notes, setNotes] = React.useState('');

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
  const [lastSnapshot, setLastSnapshot] = React.useState<ProductionInventory | null>(null);

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
    fetch('/api/production/inventory?limit=1')
      .then((r) => r.json())
      .then((data) => {
        if (data.snapshots?.[0]) setLastSnapshot(data.snapshots[0]);
      })
      .catch(() => {});
  }, []);

  const setValue = (key: string, val: number) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const bedsPossible = calcBedsPossible(values);
  const bottleneck = getBottleneck(values);

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
        const url = await uploadProductionMedia(voiceBlob, mediaUserId, date, `inventory-voice.${ext}`);
        voiceNoteUrls.push(url);
      }

      if (photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
          setUploadStatus(`Uploading photo ${i + 1}/${photos.length}...`);
          const compressed = await compressImage(photos[i]);
          const url = await uploadProductionMedia(compressed, mediaUserId, date, `inventory-photo-${i + 1}.jpg`);
          photoUrls.push(url);
        }
      }

      setUploadStatus('Saving inventory count...');

      const response = await fetch('/api/production/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operator,
          snapshot_date: date,
          ...values,
          notes: notes || null,
          photo_urls: photoUrls,
          voice_note_urls: voiceNoteUrls,
          voice_note_transcripts: voiceTranscript ? [voiceTranscript] : [],
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to save');

      setSuccess(true);
      setLastSnapshot(data.snapshot);
      // Reset
      FIELDS.forEach((f) => setValue(f.key, 0));
      setNotes('');
      handleRecordingRemoved();
      setVoiceTranscript('');
      setPhotos([]);
      setUploadStatus(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setSuccess(false), 8000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setUploadStatus(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Group fields by section
  const sections = FIELDS.reduce<Record<string, FieldDef[]>>((acc, f) => {
    (acc[f.section] = acc[f.section] || []).push(f);
    return acc;
  }, {});

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-8">
      {success && (
        <div className="rounded-xl bg-green-50 border-2 border-green-300 p-6 text-center">
          <div className="text-4xl mb-2">&#10003;</div>
          <p className="text-lg font-semibold text-green-800">Inventory count saved</p>
          <p className="text-green-600 mt-1">Stock position updated.</p>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 border-2 border-red-300 p-6 text-center">
          <p className="text-lg font-semibold text-red-800">{error}</p>
        </div>
      )}

      {/* Beds Possible - Hero */}
      <Card className="border-2 border-foreground">
        <CardContent>
          <div className="text-center py-2">
            <p className="text-sm font-medium text-muted-foreground mb-1">Beds Possible From Stock</p>
            <p className="text-5xl font-bold tabular-nums">{bedsPossible}</p>
            {bottleneck && (
              <p className="text-sm text-muted-foreground mt-2">
                Bottleneck: <span className="font-semibold text-amber-600">{bottleneck.name}</span>
                {' '}({bottleneck.count} beds worth)
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Operator */}
      <Card>
        <CardContent>
          <Label
            className="text-base font-semibold mb-3 block"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Who&apos;s counting?
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

      {/* Component Counts by Section */}
      {Object.entries(sections).map(([section, fields]) => (
        <Card key={section}>
          <CardContent>
            <Label
              className="text-base font-semibold mb-4 block"
              style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
            >
              {section}
            </Label>
            <div className="space-y-5">
              {fields.map((field) => (
                <div key={field.key}>
                  <p className="text-sm text-muted-foreground mb-2 text-center">{field.label}</p>
                  <NumberStepper
                    value={values[field.key]}
                    onChange={(v) => setValue(field.key, v)}
                    max={field.max}
                  />
                  {lastSnapshot && (
                    <p className="text-xs text-muted-foreground text-center mt-1">
                      Last count: <span className="font-semibold">{lastSnapshot[field.key as keyof typeof lastSnapshot] as number}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Notes */}
      <Card>
        <CardContent>
          <Label
            htmlFor="notes"
            className="text-base font-semibold mb-3 block"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Notes
          </Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any observations from the walkthrough..."
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
        disabled={isLoading || !operator}
        className="w-full h-16 text-lg font-semibold rounded-xl bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : 'Save Inventory Count'}
      </Button>

      {/* Last Snapshot */}
      {lastSnapshot && (
        <div className="pt-8 border-t mt-8">
          <h2
            className="text-xl font-semibold mb-4"
            style={{ fontFamily: 'var(--font-display, Georgia, serif)' }}
          >
            Last Count
          </h2>
          <Card>
            <CardContent>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold">{lastSnapshot.operator}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(lastSnapshot.snapshot_date + 'T00:00:00').toLocaleDateString('en-AU', {
                      weekday: 'short', day: 'numeric', month: 'short',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold tabular-nums">{lastSnapshot.beds_possible}</p>
                  <p className="text-xs text-muted-foreground">beds possible</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div className="bg-muted rounded-lg p-2">
                  <p className="font-bold tabular-nums">{lastSnapshot.legs_ready}</p>
                  <p className="text-xs text-muted-foreground">Legs</p>
                </div>
                <div className="bg-muted rounded-lg p-2">
                  <p className="font-bold tabular-nums">{lastSnapshot.tabs_ready}</p>
                  <p className="text-xs text-muted-foreground">Tabs</p>
                </div>
                <div className="bg-muted rounded-lg p-2">
                  <p className="font-bold tabular-nums">{lastSnapshot.steel_poles}</p>
                  <p className="text-xs text-muted-foreground">Poles</p>
                </div>
                <div className="bg-muted rounded-lg p-2">
                  <p className="font-bold tabular-nums">{lastSnapshot.canvas_ready}</p>
                  <p className="text-xs text-muted-foreground">Canvas</p>
                </div>
                <div className="bg-muted rounded-lg p-2">
                  <p className="font-bold tabular-nums">{lastSnapshot.chipped_plastic_sheets}</p>
                  <p className="text-xs text-muted-foreground">Chip Sheets</p>
                </div>
                <div className="bg-muted rounded-lg p-2">
                  <p className="font-bold tabular-nums">{lastSnapshot.tab_sheets_finished}</p>
                  <p className="text-xs text-muted-foreground">Tab Sheets</p>
                </div>
              </div>
              {lastSnapshot.notes && (
                <p className="text-sm text-muted-foreground mt-3 pt-3 border-t">
                  {lastSnapshot.notes}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </form>
  );
}

/* NumberStepper - same pattern as shift-log-form */
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
  const decrement = () => onChange(Math.max(min, +(value - step).toFixed(1)));
  const increment = () => onChange(Math.min(max, +(value + step).toFixed(1)));

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
