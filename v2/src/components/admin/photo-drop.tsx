'use client';

/**
 * THE DROP ZONE. Drag photographs in from Finder, or straight out of a Google Photos tab.
 *
 * Ben, 17 September 2026: I just want to drag in from Google Photos in the browser.
 *
 * Both work and they are not the same. A drag from Finder carries the FILE, EXIF and all, so the
 * date comes with it and the date picks the community. A drag from a web page carries a URL
 * instead, which the server fetches; Google serves a re-encoded copy with the EXIF stripped, so
 * the picture arrives and the date does not. The zone says which one happened on every drop
 * rather than quietly filing something in the wrong place.
 *
 * Local tool. It writes into public/images, which Vercel will not allow, so this is for the
 * machine the repo is on and the files get committed like every other curation decision.
 */

import { useCallback, useRef, useState } from 'react';

interface Dropped {
  ok: boolean;
  url?: string;
  note?: string;
  error?: string;
  exif?: { date?: string; make?: string; model?: string; lens?: string };
  trip?: { community: string; what: string } | null;
  viaUrl?: boolean;
}

export function PhotoDrop() {
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(0);
  const [results, setResults] = useState<Dropped[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const send = useCallback(async (init: RequestInit) => {
    setBusy((n) => n + 1);
    try {
      const res = await fetch('/api/admin/photo-drop', init);
      const data = (await res.json()) as Dropped;
      setResults((prev) => [data, ...prev].slice(0, 12));
    } catch (e) {
      setResults((prev) => [{ ok: false, error: e instanceof Error ? e.message : String(e) }, ...prev]);
    } finally {
      setBusy((n) => n - 1);
    }
  }, []);

  const sendFile = useCallback(
    (file: File) => {
      const form = new FormData();
      form.append('file', file);
      return send({ method: 'POST', body: form });
    },
    [send],
  );

  const sendUrl = useCallback(
    (url: string) => send({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) }),
    [send],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setOver(false);
      const files = Array.from(e.dataTransfer.files ?? []);
      if (files.length) {
        files.forEach(sendFile);
        return;
      }
      // A drag from a web page gives a URL list, or HTML with an <img> in it.
      const uri = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
      if (uri && /^https?:\/\//.test(uri.trim())) {
        sendUrl(uri.trim().split('\n')[0]);
        return;
      }
      const html = e.dataTransfer.getData('text/html');
      const src = html.match(/<img[^>]+src="([^"]+)"/i)?.[1];
      if (src) sendUrl(src);
    },
    [sendFile, sendUrl],
  );

  return (
    <div className="mb-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        onClick={() => fileInput.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed px-6 py-8 text-center transition ${
          over ? 'border-foreground bg-muted' : 'border-border hover:border-foreground'
        }`}
      >
        <p className="text-sm font-semibold text-foreground">
          {busy > 0 ? `Bringing in ${busy}…` : 'Drop photographs here'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          From Finder, or drag an image straight out of a Google Photos tab. A file keeps its date and files
          itself by trip. A drag from the web arrives without a date, because Google strips it.
        </p>
        <input
          ref={fileInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            Array.from(e.target.files ?? []).forEach(sendFile);
            e.target.value = '';
          }}
        />
      </div>

      {results.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {results.map((r, i) => (
            <li
              key={`${r.url ?? r.error}-${i}`}
              className="rounded-lg border border-border px-3 py-2 text-xs"
            >
              {r.ok ? (
                <>
                  <span className="font-mono text-foreground">{r.url}</span>
                  <span className="ml-2 text-muted-foreground">{r.note}</span>
                  {r.exif?.model && (
                    <span className="ml-2 text-muted-foreground">
                      {[r.exif.make, r.exif.model, r.exif.lens].filter(Boolean).join(' ')}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-amber-700">{r.error}</span>
              )}
            </li>
          ))}
          <li className="px-3 py-1 text-[11px] text-muted-foreground">
            Then run <span className="font-mono">npm run content:index</span> and write the Notes, which is the
            caption every page reads.
          </li>
        </ul>
      )}
    </div>
  );
}
