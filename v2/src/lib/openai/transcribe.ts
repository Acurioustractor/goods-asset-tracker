export async function transcribeAudio(audioUrl: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.log('Whisper transcription skipped — OPENAI_API_KEY not configured');
    return null;
  }

  // Download the audio file
  const audioRes = await fetch(audioUrl);
  if (!audioRes.ok) {
    console.error('Failed to download audio for transcription:', audioRes.status);
    return null;
  }

  const audioBlob = await audioRes.blob();

  // Determine file extension from content-type
  const contentType = audioRes.headers.get('content-type') || 'audio/webm';
  const ext = contentType.includes('mp4') ? 'mp4'
    : contentType.includes('ogg') ? 'ogg'
    : 'webm';

  // Build multipart form data for Whisper API
  const formData = new FormData();
  formData.append('file', new Blob([audioBlob], { type: contentType }), `voice.${ext}`);
  formData.append('model', 'whisper-1');
  formData.append('language', 'en');

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('Whisper transcription failed:', res.status, body);
    return null;
  }

  const data = await res.json();
  return data.text || null;
}
