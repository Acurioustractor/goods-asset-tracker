'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob, mimeType: string) => void;
  onRecordingRemoved: () => void;
  onTranscriptReady?: (transcript: string) => void;
  hasRecording: boolean;
  recordingUrl: string | null;
}

const MAX_DURATION_MS = 120_000; // 2 minutes

function getSupportedMimeType(): string | null {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/ogg',
  ];
  for (const type of types) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return null;
}

// Web Speech API types (not in all TS libs)
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: { transcript: string; confidence: number };
}

interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSpeechRecognition(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === 'undefined') return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const W = window as any;
  return W.SpeechRecognition || W.webkitSpeechRecognition || null;
}

export function VoiceRecorder({
  onRecordingComplete,
  onRecordingRemoved,
  onTranscriptReady,
  hasRecording,
  recordingUrl,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [supported, setSupported] = React.useState(true);

  // Transcription state
  const [liveTranscript, setLiveTranscript] = React.useState('');
  const [editableTranscript, setEditableTranscript] = React.useState('');
  const [speechSupported, setSpeechSupported] = React.useState(false);

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const timerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = React.useRef<number>(0);
  const recognitionRef = React.useRef<SpeechRecognitionInstance | null>(null);
  const finalTranscriptRef = React.useRef('');

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setSupported(false);
    }
    if (getSpeechRecognition()) {
      setSpeechSupported(true);
    }
  }, []);

  // Notify parent when editable transcript changes
  React.useEffect(() => {
    if (hasRecording && onTranscriptReady) {
      onTranscriptReady(editableTranscript);
    }
  }, [editableTranscript, hasRecording, onTranscriptReady]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      if (!mimeType) {
        setSupported(false);
        return;
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType });
        onRecordingComplete(blob, mimeType);
      };

      mediaRecorderRef.current = recorder;
      recorder.start(1000);
      setIsRecording(true);
      startTimeRef.current = Date.now();

      // Reset transcript state
      setLiveTranscript('');
      setEditableTranscript('');
      finalTranscriptRef.current = '';

      // Start speech recognition in parallel
      const SpeechRecognitionClass = getSpeechRecognition();
      if (SpeechRecognitionClass) {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-AU';

        recognition.onresult = (event) => {
          let interim = '';
          let final = '';
          for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i];
            if (result.isFinal) {
              final += result[0].transcript;
            } else {
              interim += result[0].transcript;
            }
          }
          finalTranscriptRef.current = final;
          setLiveTranscript(final + (interim ? interim : ''));
        };

        recognition.onerror = () => {
          // Silently ignore — recording continues without transcript
        };

        recognition.onend = () => {
          // If still recording, restart recognition (it can time out)
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            try {
              recognition.start();
            } catch {
              // Already started or unavailable
            }
          }
        };

        try {
          recognition.start();
          recognitionRef.current = recognition;
        } catch {
          // SpeechRecognition failed to start — continue without it
        }
      }

      timerRef.current = setInterval(() => {
        const ms = Date.now() - startTimeRef.current;
        setElapsed(ms);
        if (ms >= MAX_DURATION_MS) {
          stopRecording();
        }
      }, 200);
    } catch {
      setSupported(false);
    }
  };

  const stopRecording = () => {
    // Stop speech recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // Already stopped
      }
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    setElapsed(0);

    // Set editable transcript from final result
    const transcript = finalTranscriptRef.current || liveTranscript;
    setEditableTranscript(transcript.trim());
  };

  const removeRecording = () => {
    setLiveTranscript('');
    setEditableTranscript('');
    finalTranscriptRef.current = '';
    onRecordingRemoved();
  };

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Already stopped
        }
      }
    };
  }, []);

  if (!supported) return null;

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      {!hasRecording && !isRecording && (
        <Button
          type="button"
          variant="outline"
          onClick={startRecording}
          className="w-full h-14 rounded-xl border-2 border-dashed text-base"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          Record Voice Note
        </Button>
      )}

      {isRecording && (
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 bg-red-50 border-2 border-red-300 rounded-xl">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="font-medium text-red-700 tabular-nums flex-1">
              Recording {formatTime(elapsed)} / {formatTime(MAX_DURATION_MS)}
            </span>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={stopRecording}
              className="rounded-lg"
            >
              Stop
            </Button>
          </div>
          {speechSupported && liveTranscript && (
            <div className="p-3 bg-muted/50 rounded-lg border text-sm text-muted-foreground italic">
              {liveTranscript}
            </div>
          )}
        </div>
      )}

      {hasRecording && recordingUrl && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <audio controls src={recordingUrl} className="flex-1 h-8" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeRecording}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Remove
            </Button>
          </div>
          {speechSupported && editableTranscript && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-muted-foreground">
                Transcript (edit if needed)
              </label>
              <Textarea
                value={editableTranscript}
                onChange={(e) => setEditableTranscript(e.target.value)}
                rows={3}
                className="text-sm min-h-[60px]"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
