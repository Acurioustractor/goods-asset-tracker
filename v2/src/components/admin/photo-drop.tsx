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

import { useCallback, useEffect, useRef, useState } from 'react';

interface Dropped {
  ok: boolean;
  url?: string;
  note?: string;
  error?: string;
  exif?: { date?: string; make?: string; model?: string; lens?: string };
  trip?: { community: string; what: string } | null;
  viaUrl?: boolean;
  indexed?: boolean;
  contentId?: string | null;
  community?: string | null;
  appliedTags?: string[];
  /** What the browser actually put on the drag, when nothing usable came through. */
  debug?: string;
}

const SESSION_KEY = 'goods.mediaroom.sessionTags';

export function PhotoDrop() {
  /*
   * THE SESSION TAG SET. Type it once and every photograph dropped afterwards carries it,
   * through a reload and into tomorrow, until it is changed. Working on Snow all afternoon means
   * typing use:snow once rather than forty times.
   */
  const [sessionTags, setSessionTags] = useState('');
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SESSION_KEY);
      setSessionTags(stored === null ? 'use:snow' : stored);
    } catch {
      setSessionTags('use:snow');
    }
  }, []);
  const rememberSession = useCallback((v: string) => {
    setSessionTags(v);
    try {
      window.localStorage.setItem(SESSION_KEY, v);
    } catch {
      /* ignore */
    }
  }, []);

  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(0);
  const [results, setResults] = useState<Dropped[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  const send = useCallback(async (init: RequestInit) => {
    setBusy((n) => n + 1);
    try {
      const qs = sessionTags.trim()
        ? `?tags=${encodeURIComponent(sessionTags.split(/[,\s]+/).filter(Boolean).join(','))}`
        : '';
      const res = await fetch(`/api/admin/photo-drop${qs}`, init);
      const data = (await res.json()) as Dropped;
      setResults((prev) => [data, ...prev].slice(0, 12));
    } catch (e) {
      setResults((prev) => [{ ok: false, error: e instanceof Error ? e.message : String(e) }, ...prev]);
    } finally {
      setBusy((n) => n - 1);
    }
  }, [sessionTags]);

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
      const dt = e.dataTransfer;

      // 1. A real file list. Finder, and some browsers for a web image too.
      const files = Array.from(dt.files ?? []);
      if (files.length) {
        files.forEach(sendFile);
        return;
      }

      /*
       * 2. THE ONE THAT WAS MISSING. Dragging an image out of a web page, Chrome very often
       * puts the decoded image on the drag as a file in dataTransfer.items rather than in
       * dataTransfer.files. It never appears in .files, so checking only there made a Google
       * Photos drag look empty and fall through to the page link, which needs a login. This
       * path uses the browser's own copy of the picture, so Google's auth never comes into it.
       */
      const items = Array.from(dt.items ?? []);
      const asFiles = items
        .filter((i) => i.kind === 'file')
        .map((i) => i.getAsFile())
        .filter((f): f is File => f !== null);
      if (asFiles.length) {
        asFiles.forEach(sendFile);
        return;
      }

      /*
       * 3. THE IMAGE URL, DUG OUT OF THE HTML PAYLOAD.
       *
       * Chrome offered text/plain, text/uri-list, text/html and no Files at all on a Google
       * Photos drag, so the picture is in the HTML and nowhere else. A tight <img src="..."
       * match was too narrow: Google writes srcset, unquoted attributes and lazy-loading
       * attributes, and the first URL in the blob is often the page rather than the picture.
       * So pull EVERY url out of the payload and prefer the image hosts.
       */
      const html = dt.getData('text/html');
      const urls = Array.from(html.matchAll(/https?:\/\/[^\s"'<>\\)]+/gi)).map((m) => m[0]);
      const isPage = (u: string) => /^https?:\/\/photos\.google\.com\//i.test(u);
      const imageHost = urls.find(
        (u) => /(googleusercontent|ggpht|gstatic)\.com/i.test(u) && !isPage(u),
      );
      const anyImage = urls.find((u) => /\.(jpe?g|png|webp|gif)(\?|$)/i.test(u) && !isPage(u));
      const candidate = imageHost ?? anyImage ?? urls.find((u) => !isPage(u));
      if (candidate) {
        sendUrl(candidate);
        return;
      }

      // 4. Anything else that is a plain image link.
      const uri = (dt.getData('text/uri-list') || dt.getData('text/plain') || '').trim().split('\n')[0];
      if (uri && /^https?:\/\//.test(uri) && !isPage(uri)) {
        sendUrl(uri);
        return;
      }

      // Nothing usable. Report what was on the drag so the next attempt is evidence.
      const types = Array.from(dt.types ?? []);
      setResults((prev) =>
        [
          {
            ok: false,
            error: 'No picture in that drag, only a page link.',
            debug: `types: ${types.join(', ') || 'none'} | urls found: ${urls.length ? urls.slice(0, 2).join(' ') : 'none'}`,
          },
          ...prev,
        ].slice(0, 12),
      );
    },
    [sendFile, sendUrl],
  );

  return (
    <div className="mb-6">
      <label className="mb-2 flex items-center gap-2 text-xs">
        <span className="shrink-0 text-muted-foreground">Tag everything I drop with</span>
        <input
          value={sessionTags}
          onChange={(e) => rememberSession(e.target.value)}
          placeholder="nothing, until you type a tag here"
          className="flex-1 rounded-lg border border-input bg-background px-2.5 py-1.5 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-ring"
        />
        {sessionTags.trim() && (
          <button type="button" onClick={() => rememberSession('')} className="text-muted-foreground underline">
            clear
          </button>
        )}
      </label>
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
          From Finder, or straight out of a Google Photos tab. Where the photograph carries its own date it
          files itself by trip or event; where it does not, it waits in unplaced for you to say.
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
        <ul className="mt-3 space-y-2">
          {results.map((r, i) =>
            r.ok ? (
              <DroppedCard key={`${r.url}-${i}`} item={r} />
            ) : (
              <li key={`err-${i}`} className="rounded-lg border border-border px-3 py-2 text-xs">
                <span className="text-amber-700">{r.error}</span>
                {r.debug && <span className="ml-2 font-mono text-[10px] text-muted-foreground">{r.debug}</span>}
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
}

/**
 * TAG IT WHERE IT LANDS.
 *
 * Ben: this is so clunky, why is it so hard. It was hard because dropping and tagging were in
 * two different places: the zone put the file somewhere and then you had to reload, find it in a
 * grid of eight hundred and open it. So the card that appears when a photograph lands IS the
 * editor. Caption, community, tags, save, done, without leaving the spot you dropped on.
 *
 * It writes to the same endpoint the library uses, so a photograph tagged here and a photograph
 * tagged in the grid are the same thing in the same place.
 */
function DroppedCard({ item }: { item: Dropped }) {
  const [caption, setCaption] = useState('');
  const [community, setCommunity] = useState(item.community ?? '');
  const [extra, setExtra] = useState('');
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');

  const save = useCallback(async () => {
    if (!item.contentId) {
      setState('error');
      setError('Not registered, so there is nothing to tag yet.');
      return;
    }
    setState('saving');
    const tags = [
      ...(community.trim() ? [`community:${community.trim()}`] : []),
      ...extra.split(/[,\s]+/).filter(Boolean),
    ];
    try {
      const res = await fetch('/api/admin/content-item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.contentId, tags, notes: caption.trim() || null }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setState('error');
        setError(data.error || `HTTP ${res.status}`);
        return;
      }
      setState('saved');
    } catch (e) {
      setState('error');
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [caption, community, extra, item.contentId]);

  return (
    <li
      className="rounded-lg border p-3 transition-colors"
      style={
        state === 'saved'
          ? { borderColor: '#5E7A4C', backgroundColor: '#EEF1E9' }
          : state === 'error'
            ? { borderColor: '#C45C3E' }
            : undefined
      }
    >
      <div className="flex gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.url} alt="" className="h-24 w-24 shrink-0 rounded object-cover" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-[11px] text-muted-foreground">
            {item.exif?.date ? `Taken ${item.exif.date}` : 'No date in the file'}
            {item.trip ? ` · ${item.trip.what}` : ''}
            {item.exif?.model ? ` · ${[item.exif.make, item.exif.model].filter(Boolean).join(' ')}` : ''}
            {item.appliedTags?.length ? ` · already tagged ${item.appliedTags.join(' ')}` : ''}
          </p>
          <input
            value={caption}
            onChange={(e) => { setCaption(e.target.value); setState('idle'); }}
            placeholder="What is in the picture. This is the caption every page reads."
            className="w-full rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="flex gap-1.5">
            <input
              value={community}
              onChange={(e) => { setCommunity(e.target.value); setState('idle'); }}
              placeholder="add a community…"
              className="flex-1 rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              value={extra}
              onChange={(e) => { setExtra(e.target.value); setState('idle'); }}
              placeholder="add more tags…"
              className="flex-1 rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              onClick={save}
              disabled={state === 'saving'}
              className="rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90 disabled:opacity-50"
            >
              {state === 'saving' ? 'Saving…' : state === 'saved' ? 'Saved ✓' : 'Save'}
            </button>
          </div>
          {state === 'saved' && (
            <p className="text-[11px] font-semibold" style={{ color: '#5E7A4C' }}>
              Saved. The caption is live on every page that shows this photograph.
            </p>
          )}
          {state === 'error' && (
            <p className="rounded px-2 py-1 text-[11px] font-semibold" style={{ backgroundColor: '#F6E4DE', color: '#9A4023' }}>
              Did not save: {error}
            </p>
          )}
          {!item.contentId && state === 'idle' && (
            <p className="text-[11px] text-amber-700">
              This one landed before the page was reloaded, so there is nothing to save against. Hard reload and
              drop it again.
            </p>
          )}
        </div>
      </div>
    </li>
  );
}
