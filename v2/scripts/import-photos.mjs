#!/usr/bin/env node
/**
 * BRING PHOTOGRAPHS IN FROM A PHONE, A CAMERA OR A GOOGLE PHOTOS EXPORT.
 *
 * Ben, 17 September 2026: can I get images in from say Google Photos, and know the metadata and
 * the date.
 *
 * Yes. Every camera writes DateTimeOriginal into the JPEG, and Google Photos keeps it on export.
 * GPS is the one that usually does not survive: Google strips it on share links, and plenty of
 * cameras never wrote it. So this reads the date from the file and works the PLACE out from the
 * date, by matching it against the trips we already have written down. The photograph Ben sent
 * of Norm was 28 June 2025, which lands inside the Tennant Creek window, and that is how it gets
 * community:tennant-creek without anybody typing it.
 *
 * WHAT IT DOES
 *   1. Reads every jpg/jpeg/png in the source folder.
 *   2. Pulls DateTimeOriginal, camera, lens and GPS where they exist.
 *   3. Matches the date against TRIPS below and proposes a community.
 *   4. Copies the file to public/images/<area>/ with a dated, readable name.
 *   5. Writes a report you can read before anything is tagged.
 *
 * WHAT IT DOES NOT DO, ON PURPOSE. It does not tag, star or publish anything. It puts the file
 * where the Media Room can see it and tells you what it thinks. You confirm in the admin, where
 * the Notes box is the caption every surface now reads.
 *
 * USE
 *   node scripts/import-photos.mjs ~/Downloads/snow-export --area community/tennant-creek
 *   node scripts/import-photos.mjs ~/Downloads/export --dry
 *
 * After it runs: npm run content:index, then open /admin/media-library.
 */

import { readdirSync, statSync, copyFileSync, mkdirSync, existsSync, openSync, readSync, closeSync } from 'node:fs';
import { join, extname, basename } from 'node:path';

/**
 * The trips, so a date can find its own place. Dates are inclusive. Add a row when a trip
 * happens and every photograph from it lands tagged correctly for ever after.
 */
const TRIPS = [
  { from: '2024-10-29', to: '2024-11-01', community: 'philanthropy-australia', what: 'Philanthropy Australia Conference', area: 'events/philanthropy-australia-2024' },
  { from: '2024-11-01', to: '2024-11-30', community: 'tennant-creek', what: 'Healthy Homes forum, Anyinginyi' },
  { from: '2024-12-10', to: '2024-12-22', community: 'palm-island', what: '85 beds over a weekend' },
  { from: '2025-04-01', to: '2025-04-12', community: 'tennant-creek', what: 'Deadly Heart Trek' },
  { from: '2025-06-20', to: '2025-07-06', community: 'tennant-creek', what: 'Washing machines, Pakkimjalki Kari' },
  { from: '2025-08-01', to: '2025-08-20', community: 'katherine', what: 'Deadly Heart Trek, Big Rivers' },
  { from: '2025-08-21', to: '2025-09-10', community: 'maningrida', what: 'Gamardi build' },
  { from: '2026-03-01', to: '2026-03-31', community: 'canberra', what: 'Parliamentary Friends for Ending RHD', area: 'events/parliament-house-2026' },
  { from: '2026-05-01', to: '2026-05-14', community: 'canberra', what: 'Canberra Airport display', area: 'events/canberra-airport-2026' },
  { from: '2026-05-15', to: '2026-05-31', community: 'utopia', what: 'Utopia run with Oonchiumpa' },
  { from: '2026-06-01', to: '2026-06-20', community: 'alice-springs', what: 'Alice Springs and Oonchiumpa' },
];

const EXT = new Set(['.jpg', '.jpeg', '.png']);

/** Minimal EXIF reader: walks the APP1 IFD for the handful of tags worth having. */
function readExif(path) {
  const out = {};
  let fd;
  try {
    fd = openSync(path, 'r');
    const head = Buffer.alloc(128 * 1024);
    const read = readSync(fd, head, 0, head.length, 0);
    const buf = head.subarray(0, read);
    const app1 = buf.indexOf(Buffer.from([0xff, 0xe1]));
    if (app1 < 0) return out;
    const tiff = buf.indexOf(Buffer.from('Exif\0\0', 'binary'), app1) + 6;
    if (tiff < 6) return out;
    const le = buf.readUInt16LE(tiff) === 0x4949;
    const u16 = (o) => (le ? buf.readUInt16LE(o) : buf.readUInt16BE(o));
    const u32 = (o) => (le ? buf.readUInt32LE(o) : buf.readUInt32BE(o));
    const str = (o, n) => buf.toString('ascii', o, o + n).replace(/\0.*$/, '').trim();

    const want = { 0x0110: 'model', 0x010f: 'make', 0x0132: 'dateTime', 0x9003: 'takenAt', 0xa434: 'lens' };
    const walk = (dirOffset, depth) => {
      if (depth > 2 || dirOffset <= 0 || dirOffset + 2 > buf.length) return;
      const count = u16(tiff + dirOffset);
      for (let i = 0; i < count; i += 1) {
        const e = tiff + dirOffset + 2 + i * 12;
        if (e + 12 > buf.length) return;
        const tag = u16(e);
        const type = u16(e + 2);
        const n = u32(e + 4);
        const valOff = n * (type === 2 ? 1 : 4) > 4 ? tiff + u32(e + 8) : e + 8;
        if (want[tag] && type === 2) out[want[tag]] = str(valOff, n);
        if (tag === 0x8769) walk(u32(e + 8), depth + 1); // Exif sub-IFD
        if (tag === 0x8825) out.hasGps = true;
      }
    };
    walk(u32(tiff + 4), 0);
  } catch {
    /* an unreadable header is not a reason to stop importing */
  } finally {
    if (fd !== undefined) closeSync(fd);
  }
  if (out.takenAt || out.dateTime) {
    const raw = out.takenAt || out.dateTime;
    const m = raw.match(/^(\d{4}):(\d{2}):(\d{2})/);
    if (m) out.date = `${m[1]}-${m[2]}-${m[3]}`;
  }
  return out;
}

const tripFor = (date) => (date ? TRIPS.find((t) => date >= t.from && date <= t.to) ?? null : null);

const slug = (s) =>
  s.toLowerCase().replace(/\.[a-z]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);

function main() {
  const args = process.argv.slice(2);
  const src = args.find((a) => !a.startsWith('--'));
  const dry = args.includes('--dry');
  const areaArg = args.includes('--area') ? args[args.indexOf('--area') + 1] : null;

  if (!src || !existsSync(src)) {
    console.error('Usage: node scripts/import-photos.mjs <folder> [--area community/tennant-creek] [--dry]');
    process.exit(1);
  }

  const files = readdirSync(src).filter((f) => EXT.has(extname(f).toLowerCase()) && statSync(join(src, f)).isFile());
  if (files.length === 0) {
    console.log('Nothing to import: no jpg, jpeg or png in', src);
    return;
  }

  console.log(`\n${files.length} photograph(s) in ${src}\n`);
  let placed = 0;
  let undated = 0;

  for (const file of files.sort()) {
    const exif = readExif(join(src, file));
    const trip = tripFor(exif.date);
    const area = areaArg ?? (trip ? trip.area ?? `community/${trip.community}` : 'unplaced');
    const name = `${exif.date ?? 'undated'}-${slug(basename(file))}${extname(file).toLowerCase()}`;
    const rel = `images/${area}/${name}`;

    const bits = [
      exif.date ?? 'NO DATE',
      trip ? `-> ${trip.area ?? `community/${trip.community}`} (${trip.what})` : areaArg ? `-> ${areaArg} (you said so)` : '-> unplaced, no trip matches',
      [exif.make, exif.model, exif.lens].filter(Boolean).join(' ') || null,
      exif.hasGps ? 'has GPS' : null,
    ].filter(Boolean);
    console.log(`  ${file}\n      ${bits.join('  |  ')}\n      /${rel}`);

    if (!exif.date) undated += 1;
    if (!dry) {
      const dir = join(process.cwd(), 'public', 'images', area);
      mkdirSync(dir, { recursive: true });
      copyFileSync(join(src, file), join(dir, name));
      placed += 1;
    }
  }

  console.log(
    dry
      ? '\nDry run. Nothing copied. Drop --dry to bring them in.\n'
      : `\n${placed} copied${undated ? `, ${undated} with no date in the file` : ''}.\n` +
        'Next: npm run content:index, then /admin/media-library to write the Notes, which is the caption every page reads.\n',
  );
}

main();
