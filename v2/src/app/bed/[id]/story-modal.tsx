'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  open: boolean;
  onClose: () => void;
  uniqueId: string;
  productLabel: string;
  community: string | null;
  communityId: string | null;
  place: string | null;
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function StoryModal({
  open,
  onClose,
  uniqueId,
  productLabel,
  community,
  communityId,
  place,
}: Props) {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [story, setStory] = useState('');
  const [consentToShare, setConsentToShare] = useState(false);
  const [consentToContact, setConsentToContact] = useState(true);
  const [includeLocation, setIncludeLocation] = useState(true);
  const [photo, setPhoto] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [reference, setReference] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<{ start: () => void; stop: () => void; onresult: ((e: { results: { isFinal: boolean; [i: number]: { transcript: string } }[] }) => void) | null; onerror: ((e: Event) => void) | null; onend: (() => void) | null } | null>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setStatus('idle');
      setError('');
      setReference(null);
    }
  }, [open]);

  const startVoice = () => {
    type SR = { new (): { start: () => void; stop: () => void; continuous: boolean; interimResults: boolean; lang: string; onresult: ((e: { results: { isFinal: boolean; [i: number]: { transcript: string } }[] }) => void) | null; onerror: ((e: Event) => void) | null; onend: (() => void) | null } };
    const w = window as unknown as { SpeechRecognition?: SR; webkitSpeechRecognition?: SR };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) {
      setError('Voice input is not supported on this browser. Type your story instead.');
      return;
    }
    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-AU';
    let final = story;
    rec.onresult = (event) => {
      let interim = '';
      for (let i = 0; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) {
          final += r[0].transcript + ' ';
        } else {
          interim += r[0].transcript;
        }
      }
      setStory(final + interim);
    };
    rec.onerror = () => {
      setIsListening(false);
      setError('Voice capture stopped. You can keep typing.');
    };
    rec.onend = () => setIsListening(false);
    rec.start();
    recognitionRef.current = rec;
    setIsListening(true);
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const startRecording = async () => {
    setError('');
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setError('Voice recording is not supported on this device. Try typing instead.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mr.mimeType || 'audio/webm' });
        const ext = (mr.mimeType.split('/')[1] || 'webm').split(';')[0];
        const file = new File([blob], `voicenote.${ext}`, { type: blob.type });
        setAudio(file);
        setAudioPreviewUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setIsRecording(true);
    } catch (err) {
      setError('Mic permission denied or unavailable.');
      console.error('[story-modal] mic error:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const clearAudio = () => {
    if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    setAudio(null);
    setAudioPreviewUrl(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!story.trim() && !photo && !audio) {
      setError('Share a photo, a voice note, a few words, or any combination.');
      return;
    }

    setStatus('submitting');

    try {
      const form = new FormData();
      form.append('name', name);
      form.append('contact', contact);
      form.append('story', story);
      form.append('community', community || '');
      form.append('community_id', communityId || '');
      form.append('place', place || '');
      form.append('consent_to_share', consentToShare ? '1' : '0');
      form.append('consent_to_contact', consentToContact ? '1' : '0');
      form.append('include_location', includeLocation ? '1' : '0');
      if (photo) form.append('photo', photo);
      if (audio) form.append('audio', audio);

      const res = await fetch(`/api/bed/${encodeURIComponent(uniqueId)}/story`, {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }
      setReference(data.reference || null);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-card text-foreground rounded-2xl shadow-2xl w-full max-w-lg my-8 max-h-[calc(100vh-4rem)] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b sticky top-0 bg-card flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Share a photo or story</p>
            <p className="font-display text-xl font-bold">
              How is the {productLabel.toLowerCase()} going?
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              No account needed. A photo on its own is plenty.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-muted-foreground hover:text-foreground leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {status === 'success' ? (
          <div className="p-6 text-center space-y-3">
            <p className="text-4xl" aria-hidden>🙏</p>
            <p className="text-lg font-semibold">Thanks for sharing.</p>
            <p className="text-sm text-muted-foreground">
              {consentToShare
                ? 'Goods will review your story and, with your consent, share it on the Empathy Ledger.'
                : 'Goods will read what you sent. We will only share it if you tell us we can.'}
            </p>
            {reference && (
              <p className="text-xs text-muted-foreground font-mono">Ref: {reference}</p>
            )}
            <Button onClick={onClose} className="mt-2">Done</Button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Your name (optional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="So we know who to thank"
                className="w-full rounded-lg border px-3 py-2.5 text-base bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone or email (optional)</label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Only if you want us to follow up"
                className="w-full rounded-lg border px-3 py-2.5 text-base bg-background"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium">Your story</label>
                <button
                  type="button"
                  onClick={isListening ? stopVoice : startVoice}
                  className={`text-xs rounded-full px-3 py-1 font-medium ${
                    isListening
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  }`}
                >
                  {isListening ? '⏹ Stop' : '🎙 Use my voice'}
                </button>
              </div>
              <textarea
                value={story}
                onChange={(e) => setStory(e.target.value)}
                rows={6}
                placeholder="What's it been like having the bed? Who is using it? Anything we should know? (Optional — a photo alone is fine.)"
                className="w-full rounded-lg border px-3 py-2.5 text-base bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Photo (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                className="w-full text-sm"
              />
              {photo && (
                <p className="text-xs text-muted-foreground mt-1">
                  {photo.name} ({Math.round(photo.size / 1024)}KB)
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Voice note (optional)</label>
              {!audio ? (
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-full rounded-lg border p-3 text-sm font-medium flex items-center justify-center gap-2 ${
                    isRecording
                      ? 'bg-red-100 text-red-800 border-red-300 animate-pulse'
                      : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <span aria-hidden>{isRecording ? '⏹' : '🎙'}</span>
                  <span>{isRecording ? 'Stop recording' : 'Record a voice note'}</span>
                </button>
              ) : (
                <div className="rounded-lg border bg-muted/40 p-3 space-y-2">
                  {audioPreviewUrl && (
                    <audio controls src={audioPreviewUrl} className="w-full" />
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Voice note saved ({Math.round(audio.size / 1024)}KB)
                    </span>
                    <button
                      type="button"
                      onClick={clearAudio}
                      className="underline text-red-700 hover:text-red-800"
                    >
                      Clear and re-record
                    </button>
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Up to a couple of minutes. We&apos;ll listen and transcribe what you said.
              </p>
            </div>

            <div className="rounded-lg bg-muted/50 border p-4 space-y-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Consent
              </p>
              <label className="flex items-start gap-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentToShare}
                  onChange={(e) => setConsentToShare(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  <strong>Goods can share this story</strong> on goodsoncountry.com and the
                  Empathy Ledger, with my name {name ? `"${name}"` : '(if I gave one)'}
                  {community ? ` and community (${community})` : ''}. Goods will check back before
                  publishing anything sensitive.
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentToContact}
                  onChange={(e) => setConsentToContact(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  <strong>Goods can contact me</strong> to follow up about the story or how the bed is going.
                </span>
              </label>
              {(community || place) && (
                <label className="flex items-start gap-3 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLocation}
                    onChange={(e) => setIncludeLocation(e.target.checked)}
                    className="mt-1"
                  />
                  <span>
                    It's OK to mention where the bed lives ({place ? `${place}, ` : ''}{community}).
                  </span>
                </label>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">
                {error}
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={status === 'submitting'} className="flex-1">
                {status === 'submitting' ? 'Sending…' : 'Send story'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
