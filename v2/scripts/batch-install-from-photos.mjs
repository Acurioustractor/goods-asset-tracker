// One-shot: process a list of field install photos. For each:
//   1. Convert HEIC -> JPEG via `sips` (macOS native, handles iPhone 17 Pro HDR)
//   2. Decode QR sticker via jsQR to get the bed unique_id
//   3. Read EXIF via exifr: GPS (lat/lng/alt), caption (= recipient name),
//      timestamp.
// Emits a JSON line per photo to stdout, plus a final summary.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const exifrMod = await import('exifr');
const exifr = exifrMod.default || exifrMod;
const jsQR = (await import('jsqr')).default;
const sharp = (await import('sharp')).default;

async function toJpegBuffer(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') {
    return (await import('node:fs')).readFileSync(filePath);
  }
  // HEIC -> JPEG via sips
  const tmp = mkdtempSync(join(tmpdir(), 'heic-'));
  const out = join(tmp, basename(filePath, ext) + '.jpg');
  execFileSync('sips', ['-s', 'format', 'jpeg', filePath, '--out', out], { stdio: 'pipe' });
  return (await import('node:fs')).readFileSync(out);
}

async function decodeQrFromJpeg(buf) {
  // Down-scale to keep memory sane; jsQR is sensitive to image size,
  // so we try a few widths if the first attempt fails.
  for (const width of [1200, 1800, 2400, 800]) {
    try {
      const { data, info } = await sharp(buf)
        .resize({ width, withoutEnlargement: true })
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const code = jsQR(new Uint8ClampedArray(data), info.width, info.height);
      if (code && code.data) return code.data;
    } catch (e) {
      // fall through to next width
    }
  }
  return null;
}

function extractBedId(qrPayload) {
  if (!qrPayload) return null;
  // Sticker URLs look like https://www.goodsoncountry.com/bed/GB0-156-96 or
  // /bed/GB0-156-96 — pull the trailing GB-pattern segment.
  const m = qrPayload.match(/GB\d+-\d+-\d+/i);
  return m ? m[0].toUpperCase() : null;
}

async function processOne(filePath) {
  const record = {
    file: basename(filePath),
    path: filePath,
    bed_id: null,
    qr_raw: null,
    recipient_name: null,
    gps_lat: null,
    gps_lng: null,
    gps_alt: null,
    taken_at: null,
    error: null,
  };
  try {
    if (!existsSync(filePath)) {
      record.error = 'file_not_found';
      return record;
    }
    const buf = await toJpegBuffer(filePath);

    // EXIF
    try {
      const tags = await exifr.parse(buf, { gps: true });
      record.recipient_name = (tags?.ImageDescription || '').trim() || null;
      record.gps_lat = tags?.latitude ?? null;
      record.gps_lng = tags?.longitude ?? null;
      record.gps_alt = tags?.GPSAltitude ?? null;
      record.taken_at = tags?.DateTimeOriginal?.toISOString?.() ?? null;
    } catch (e) {
      record.error = `exif_error: ${e.message}`;
    }

    // QR
    const qrPayload = await decodeQrFromJpeg(buf);
    record.qr_raw = qrPayload;
    record.bed_id = extractBedId(qrPayload);
  } catch (e) {
    record.error = `${record.error ? record.error + '; ' : ''}fatal: ${e.message}`;
  }
  return record;
}

const photos = process.argv.slice(2);
if (photos.length === 0) {
  console.error('Usage: node batch-install-from-photos.mjs <photo1> [photo2 ...]');
  process.exit(1);
}

const results = [];
for (const p of photos) {
  process.stderr.write(`Processing ${basename(p)}... `);
  const r = await processOne(p);
  results.push(r);
  process.stderr.write(
    `${r.bed_id ?? 'NO-QR'}  ${r.recipient_name ?? '(no caption)'}  ` +
    `${r.gps_lat ? r.gps_lat.toFixed(5) + ',' + r.gps_lng.toFixed(5) : 'no-gps'}` +
    `${r.error ? ' [ERR: ' + r.error + ']' : ''}\n`
  );
}

console.log(JSON.stringify({ count: results.length, results }, null, 2));
