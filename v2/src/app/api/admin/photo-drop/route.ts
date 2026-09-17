/**
 * DROP A PHOTOGRAPH INTO THE MEDIA ROOM, FROM FINDER OR FROM GOOGLE PHOTOS.
 *
 * Ben, 17 September 2026: I just want to drag in from Google Photos in the browser, can I do
 * that. Yes, with one honest catch, and this route handles both halves of it.
 *
 * A FILE (dragged from Finder, or from a Google Takeout export) arrives as multipart and still
 * has its EXIF, so we read the date, the camera and the lens, match the date to a trip and file
 * it in that community.
 *
 * A URL (dragged straight out of the Google Photos web page) is what the browser hands over
 * instead of a file. We fetch it server side. It works, and the picture is right, but Google
 * serves a re-encoded rendition with the EXIF stripped, so there is no date and no camera. The
 * response says so and the drop zone asks for a place rather than guessing one.
 *
 * Writes into public/images/<area>/. Vercel's filesystem is read only, so this is a local tool:
 * drop, then commit the files like every other curation decision.
 */

import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { requireAdmin } from '@/lib/auth/admin';
import { readExif, tripFor, photoFilename } from '@/lib/media/exif';

export const runtime = 'nodejs';

const MAX_BYTES = 12 * 1024 * 1024;
const OK_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function safeArea(input: string | null): string {
  const a = (input ?? '').replace(/[^a-z0-9/-]/gi, '').replace(/^\/+|\/+$/g, '');
  return a && !a.includes('..') ? a : 'unplaced';
}

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;

  let bytes: Buffer;
  let originalName = 'photo.jpg';
  let contentType = 'image/jpeg';
  let viaUrl = false;

  try {
    const ct = req.headers.get('content-type') ?? '';
    if (ct.includes('multipart/form-data')) {
      const form = await req.formData();
      const file = form.get('file');
      if (!(file instanceof File)) {
        return NextResponse.json({ ok: false, error: 'no file in the form' }, { status: 400 });
      }
      originalName = file.name || originalName;
      contentType = file.type || contentType;
      bytes = Buffer.from(await file.arrayBuffer());
    } else {
      const body = (await req.json()) as { url?: string; area?: string };
      if (!body.url || !/^https?:\/\//.test(body.url)) {
        return NextResponse.json({ ok: false, error: 'url must be http(s)' }, { status: 400 });
      }
      viaUrl = true;
      // A googleusercontent URL carries its rendition in a =w1234-h5678 suffix; swapping it for
      // =s0 asks for the original. A photos.google.com link is a PAGE, not an image, and will
      // come back as HTML, which is what the check below is for.
      const url = body.url.replace(/=[swh]\d+(-[a-z0-9-]+)*$/i, '=s0');
      if (/^https?:\/\/photos\.google\.com\//i.test(url)) {
        return NextResponse.json(
          {
            ok: false,
            error:
              'That is a link to the Google Photos page, not to the picture. Drag the photo itself out of the grid, or download it and drag the file.',
          },
          { status: 400 },
        );
      }
      const res = await fetch(url, { headers: { 'User-Agent': 'goods-media-room' } });
      if (!res.ok) {
        return NextResponse.json({ ok: false, error: `fetch failed: HTTP ${res.status}` }, { status: 400 });
      }
      contentType = res.headers.get('content-type') ?? contentType;
      originalName = decodeURIComponent(new URL(url).pathname.split('/').pop() || 'dropped.jpg');
      if (!/\.(jpe?g|png|webp)$/i.test(originalName)) originalName = `${originalName}.jpg`;
      bytes = Buffer.from(await res.arrayBuffer());
    }
  } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }

  const mime = contentType.split(';')[0].trim();
  if (!OK_TYPES.has(mime)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          mime === 'text/html'
            ? 'That link gave a web page rather than a picture, which usually means Google wanted a login. Download the photo and drag the file in instead: you keep the date that way too.'
            : `unsupported type: ${contentType}`,
      },
      { status: 400 },
    );
  }
  if (bytes.byteLength > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: 'over 12MB; resize it first' }, { status: 400 });
  }

  const exif = readExif(bytes);
  const trip = tripFor(exif.date);
  const areaParam = new URL(req.url).searchParams.get('area');
  const area = safeArea(areaParam ?? (trip ? `community/${trip.community}` : null));
  const name = photoFilename(originalName, exif.date);
  const rel = `/images/${area}/${name}`;

  try {
    const dir = join(process.cwd(), 'public', 'images', ...area.split('/'));
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, name), bytes);
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: `could not write (is this running locally?): ${e instanceof Error ? e.message : String(e)}` },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    url: rel,
    bytes: bytes.byteLength,
    exif,
    trip: trip ? { community: trip.community, what: trip.what } : null,
    viaUrl,
    // The one thing the person dropping needs to know, in words.
    note: exif.date
      ? trip
        ? `Taken ${exif.date}, which is the ${trip.what} trip, so it went to ${trip.community}.`
        : `Taken ${exif.date}, but no trip covers that date, so it is in unplaced. Set the community in the Media Room.`
      : viaUrl
        ? 'Dragged from a web page, so Google stripped the date out of it. Set the community yourself, or drag the downloaded file instead to keep the date.'
        : 'No date in the file, so it is in unplaced. Set the community in the Media Room.',
    next: 'npm run content:index, then write the Notes, which is the caption every page reads.',
  });
}
