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
  indexError?: string | null;
  contentId?: string | null;
  community?: string | null;
  appliedTags?: string[];
  /** What the browser actually put on the drag, when nothing usable came through. */
  debug?: string;
}

const SESSION_KEY = 'goods.mediaroom.sessionTags';
const QUEUE_KEY = 'goods.mediaroom.dropQueue';

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

  /*
   * THE QUEUE SURVIVES A RELOAD. Ben dropped photographs, reloaded, and the cards he was about
   * to caption disappeared: the queue was in memory only. The photographs were safe in the
   * library, but the work in front of him was gone, which is the thing that made this feel
   * unfinished. It is in local storage now, so the untagged ones are still waiting whenever the
   * page comes back.
   */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(QUEUE_KEY);
      if (raw) setResults(JSON.parse(raw) as Dropped[]);
    } catch {
      /* nothing to restore */
    }
  }, []);
  useEffect(() => {
    try {
      window.localStorage.setItem(QUEUE_KEY, JSON.stringify(results.filter((r) => r.ok).slice(0, 24)));
    } catch {
      /* ignore */
    }
  }, [results]);

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

  /*
   * FETCH THE PICTURE IN THE BROWSER, WHERE THE GOOGLE SESSION IS.
   *
   * Our server is not signed in to Google and never can be, so when Google decides an address
   * needs the session it hands the server a sign-in page and the drop fails. This tab IS signed
   * in. So try here first, with cookies, and post the bytes up as an ordinary file.
   *
   * It also fixes the quieter problem: a drag hands over the address of the thumbnail Google
   * painted in the grid, =w403-h268, and every photograph imported this way so far has been a
   * 56KB postage stamp. These ask for the file as taken, biggest first.
   */
  const fetchHere = useCallback(async (url: string): Promise<File | null> => {
    const sized = (s: string) => url.replace(/=[a-z]{1,2}\d*(-[a-z0-9-]+)*(?=$|\?)/i, `=${s}`);
    const shapes = [...new Set([sized('d'), sized('s0'), sized('w2400'), url])];
    for (const u of shapes) {
      for (const credentials of ['include', 'omit'] as const) {
        try {
          const r = await fetch(u, { credentials, referrerPolicy: 'no-referrer' });
          if (!r.ok) continue;
          const blob = await r.blob();
          if (!blob.type.startsWith('image/') || blob.size < 2048) continue;
          const stem = decodeURIComponent(new URL(u).pathname.split('/').pop() || 'photo');
          const name = /\.(jpe?g|png|webp)$/i.test(stem) ? stem : `${stem}.jpg`;
          return new File([blob], name, { type: blob.type });
        } catch {
          /* cross-origin rules or a dead shape. Try the next one. */
        }
      }
    }
    return null;
  }, []);

  const sendUrl = useCallback(
    async (url: string) => {
      const here = await fetchHere(url);
      if (here) return sendFile(here);
      return send({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) });
    },
    [send, sendFile, fetchHere],
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
      const urls = Array.from(html.matchAll(/https?:\/\/[^\s"'<>\\)]+/gi))
        .map((m) => m[0])
        // The payload is HTML, so a url arrives carrying the entity that ended its attribute.
        // Left on, &quot; travelled all the way to the server as part of the address.
        .map((u) => u.split(/&(?:quot|#34|#39|apos|gt|lt);/)[0].replace(/&amp;/g, '&'));
      const isPage = (u: string) => /^https?:\/\/photos\.google\.com\//i.test(u);
      /*
       * Google Photos serves its pictures from photos.fife.usercontent.google.com, which does
       * NOT contain "googleusercontent", and the address ends =w403-h268-no rather than .jpg.
       * So a host list and an extension test both said no to a perfectly good picture, and the
       * only thing left to report was the page link. Match the host family, not the spelling.
       */
      const imageHost = urls.find(
        (u) => /\.(googleusercontent|ggpht|gstatic)\.com|usercontent\.google\.com|\/\/lh\d+\.google/i.test(u) && !isPage(u),
      );
      const anyImage = urls.find((u) => /\.(jpe?g|png|webp|gif)(\?|$)/i.test(u) && !isPage(u));
      const candidate = imageHost ?? anyImage;
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
            error:
              'No picture in that drag, only links. Open the photo full size in Google Photos first, then drag the picture itself. Or download it and drag the file, which keeps the date.',
            debug: `types: ${types.join(', ') || 'none'} | urls: ${urls.length ? urls.slice(0, 3).join('  ') : 'none'}`,
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
          {[...results].sort((a, b) => Number(b.ok) - Number(a.ok)).map((r, i) =>
            r.ok ? (
              <DroppedCard
                key={`${r.url}-${i}`}
                item={r}
                onDone={() => setResults((prev) => prev.filter((x) => x.url !== r.url))}
              />
            ) : (
              <li key={`err-${i}`} className="flex items-start gap-2 rounded-lg border border-border px-3 py-2 text-xs">
                <span className="flex-1 text-amber-700">
                  {r.error}
                  {r.debug && <span className="ml-2 font-mono text-[10px] text-muted-foreground">{r.debug}</span>}
                </span>
                <button
                  type="button"
                  onClick={() => setResults((prev) => prev.filter((_, j) => j !== i))}
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                  aria-label="Dismiss"
                >
                  ×
                </button>
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
function DroppedCard({ item, onDone }: { item: Dropped; onDone: () => void }) {
  const applied = item.appliedTags ?? [];
  const [caption, setCaption] = useState('');
  const [community, setCommunity] = useState(
    item.community ?? applied.find((x) => x.startsWith('community:'))?.slice('community:'.length) ?? '',
  );
  const [extra, setExtra] = useState(applied.filter((x) => !x.startsWith('community:')).join(' '));
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');

  const save = useCallback(async () => {
    if (!item.contentId) {
      setState('error');
      setError('Not registered, so there is nothing to tag yet.');
      return;
    }
    if (!caption.trim() && !community.trim() && !extra.trim()) {
      setState('error');
      setError('Nothing typed yet. Write what is in the picture, then save.');
      return;
    }
    setState('saving');
    // Union with whatever the photograph already carries, so an empty box never deletes a tag.
    const tags = [
      ...new Set([
        ...applied,
        ...(community.trim() ? [`community:${community.trim()}`] : []),
        ...extra.split(/[,\s]+/).filter(Boolean),
      ]),
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
      window.setTimeout(onDone, 1200);
    } catch (e) {
      setState('error');
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [applied, caption, community, extra, item.contentId, onDone]);

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
          {/* A green card with no library row is the failure that looks like success. Say so. */}
          {item.indexed === false ? (
            <p className="rounded bg-amber-50 px-2 py-1 text-[11px] text-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
              On disk, but the library did not register it, so it has no tags and no caption yet.
              Drop it again.{item.indexError ? ` (${item.indexError})` : ''}
            </p>
          ) : null}
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
