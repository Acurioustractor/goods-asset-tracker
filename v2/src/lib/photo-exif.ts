/**
 * READING A PHOTOGRAPH'S OWN METADATA, AND WORKING OUT WHERE IT WAS TAKEN.
 *
 * Shared by the drop zone in the Media Room and by scripts/import-photos.mjs, so a photograph
 * dragged into the browser and a photograph imported from a folder get the same treatment.
 *
 * THE DATE USUALLY SURVIVES, including a drag out of the Google Photos web page, which I had
 * expected to arrive stripped and does not: Ben's first successful drop came through with
 * DateTimeOriginal intact. So the place is worked out from the DATE, and where there is no date
 * the drop zone says so and asks rather than guessing. Guessing a community from a filename is
 * how a Kalgoorlie photograph ends up captioned Alice Springs, which is the bug this whole piece
 * of work started from.
 *
 * NOT EVERYTHING IS A COMMUNITY. The first photograph Ben dropped was the Philanthropy Australia
 * conference, 30 October 2024, which is an event and belongs in events/ rather than in somebody's
 * community. A row can name its own area for that reason.
 */

export interface PhotoExif {
  /** ISO date, from DateTimeOriginal or DateTime. */
  date?: string;
  make?: string;
  model?: string;
  lens?: string;
  hasGps?: boolean;
}

/**
 * The dates we can place. Add a row when a trip or an event happens and every photograph from it
 * files itself for ever after. `area` overrides the default of community/<community>, which is
 * how an event stays out of a community's folder.
 */
export const TRIPS: readonly {
  from: string;
  to: string;
  community: string;
  what: string;
  area?: string;
}[] = [
  { from: '2024-10-29', to: '2024-11-01', community: 'philanthropy-australia', what: 'Philanthropy Australia Conference', area: 'events/philanthropy-australia-2024' },
  { from: '2024-11-01', to: '2024-11-30', community: 'tennant-creek', what: 'Healthy Homes forum, Anyinginyi' },
  { from: '2024-12-10', to: '2024-12-22', community: 'palm-island', what: '85 beds over a weekend' },
  { from: '2025-04-01', to: '2025-04-12', community: 'tennant-creek', what: 'Deadly Heart Trek' },
  { from: '2025-06-20', to: '2025-07-06', community: 'tennant-creek', what: 'Washing machines, Pakkimjalki Kari' },
  { from: '2025-08-01', to: '2025-08-20', community: 'katherine', what: 'Deadly Heart Trek, Big Rivers' },
  { from: '2025-08-21', to: '2025-09-10', community: 'maningrida', what: 'Gamardi build' },
  { from: '2026-05-15', to: '2026-05-31', community: 'utopia', what: 'Utopia run with Oonchiumpa' },
  { from: '2026-06-01', to: '2026-06-20', community: 'alice-springs', what: 'Alice Springs and Oonchiumpa' },
  { from: '2026-03-01', to: '2026-03-31', community: 'canberra', what: 'Parliamentary Friends for Ending RHD', area: 'events/parliament-house-2026' },
  { from: '2026-05-01', to: '2026-05-14', community: 'canberra', what: 'Canberra Airport display', area: 'events/canberra-airport-2026' },
];

/** Where a photograph from this trip belongs on disk. */
export function areaForTrip(trip: { community: string; area?: string }): string {
  return trip.area ?? `community/${trip.community}`;
}

export function tripFor(date: string | undefined) {
  if (!date) return null;
  return TRIPS.find((t) => date >= t.from && date <= t.to) ?? null;
}

/** Walk the APP1 IFD for the handful of tags worth having. Unreadable header gives {}. */
export function readExif(buf: Buffer): PhotoExif {
  const out: PhotoExif = {};
  try {
    const app1 = buf.indexOf(Buffer.from([0xff, 0xe1]));
    if (app1 < 0) return out;
    const tiff = buf.indexOf(Buffer.from('Exif\0\0', 'binary'), app1) + 6;
    if (tiff < 6) return out;
    const le = buf.readUInt16LE(tiff) === 0x4949;
    const u16 = (o: number) => (le ? buf.readUInt16LE(o) : buf.readUInt16BE(o));
    const u32 = (o: number) => (le ? buf.readUInt32LE(o) : buf.readUInt32BE(o));
    const str = (o: number, n: number) => buf.toString('ascii', o, o + n).replace(/\0.*$/, '').trim();

    const want: Record<number, keyof PhotoExif | 'dateTime'> = {
      0x010f: 'make',
      0x0110: 'model',
      0x0132: 'dateTime',
      0x9003: 'date',
      0xa434: 'lens',
    };
    let fallbackDate = '';
    const walk = (dirOffset: number, depth: number) => {
      if (depth > 2 || dirOffset <= 0 || tiff + dirOffset + 2 > buf.length) return;
      const count = u16(tiff + dirOffset);
      for (let i = 0; i < count; i += 1) {
        const e = tiff + dirOffset + 2 + i * 12;
        if (e + 12 > buf.length) return;
        const tag = u16(e);
        const type = u16(e + 2);
        const n = u32(e + 4);
        const valOff = n * (type === 2 ? 1 : 4) > 4 ? tiff + u32(e + 8) : e + 8;
        const key = want[tag];
        if (key && type === 2 && valOff + n <= buf.length) {
          const v = str(valOff, n);
          if (key === 'dateTime') fallbackDate = v;
          else (out as Record<string, unknown>)[key] = v;
        }
        if (tag === 0x8769) walk(u32(e + 8), depth + 1);
        if (tag === 0x8825) out.hasGps = true;
      }
    };
    walk(u32(tiff + 4), 0);
    const raw = (out.date as string | undefined) || fallbackDate;
    const m = raw?.match(/^(\d{4}):(\d{2}):(\d{2})/);
    out.date = m ? `${m[1]}-${m[2]}-${m[3]}` : undefined;
  } catch {
    return out;
  }
  return out;
}

/** A readable, dated, collision-resistant filename. */
export function photoFilename(original: string, date: string | undefined): string {
  const ext = (original.match(/\.(jpe?g|png|webp)$/i)?.[0] ?? '.jpg').toLowerCase();
  const stem = original
    .replace(/\.[a-z]+$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48) || 'photo';
  return `${date ?? 'undated'}-${stem}${ext}`;
}
