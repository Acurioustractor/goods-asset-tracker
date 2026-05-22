// Read the batch-install JSON, dedupe by bed_id (keep first observation —
// usually the close-up of the sticker), assign cluster-based place names,
// PATCH each asset in Supabase.

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '..', '.env.local') });

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) {
  console.error('Missing SUPABASE creds');
  process.exit(1);
}

const data = JSON.parse(readFileSync('/tmp/utopia-batch.json', 'utf-8'));

// Cluster centroids — used to attach a "place" string to each install.
// These are approximate centroids derived from the photo GPS spread.
const CLUSTERS = [
  { name: 'Sandover Outstation (in transit)', lat: -22.969, lng: 133.836, radiusKm: 5 },
  { name: 'Utopia outstation A', lat: -22.085, lng: 134.773, radiusKm: 2 },
  { name: 'Utopia outstation B', lat: -22.014, lng: 134.846, radiusKm: 2 },
];

function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat), lat2 = toRad(b.lat);
  const x = Math.sin(dLat/2) ** 2 + Math.sin(dLng/2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}

function placeFor(lat, lng) {
  for (const c of CLUSTERS) {
    if (haversineKm({lat, lng}, c) <= c.radiusKm) return c.name;
  }
  return null;
}

// Dedupe by bed_id, keep the record with the close-up shot (assumed to be the
// one with the QR decoded, i.e. the smallest GPS jitter to the cluster centroid).
const byBed = new Map();
for (const r of data.results) {
  if (!r.bed_id || !r.gps_lat) continue;
  const existing = byBed.get(r.bed_id);
  if (!existing) {
    byBed.set(r.bed_id, r);
  }
}

console.log(`Unique beds to update: ${byBed.size}`);

let ok = 0, fail = 0;
for (const [bedId, r] of byBed) {
  // User confirmed: drop the A/B cluster distinction; all get "Utopia Homelands".
  const body = {
    community: 'Utopia Homelands',
    community_id: 'utopia',
    place: 'Utopia Homelands',
    gps: `${r.gps_lat.toFixed(6)}, ${r.gps_lng.toFixed(6)}`,
    status: 'deployed',
    supply_date: '2026-05-21',
  };
  // Preserve recipient_name if photo had it
  if (r.recipient_name) body.recipient_name = r.recipient_name;

  const res = await fetch(`${URL}/rest/v1/assets?unique_id=eq.${encodeURIComponent(bedId)}`, {
    method: 'PATCH',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(body),
  });
  if (res.ok) {
    ok++;
    console.log(`✓ ${bedId}  ${body.place}  ${body.gps}${r.recipient_name ? '  — ' + r.recipient_name : ''}`);
  } else {
    fail++;
    const t = await res.text();
    console.log(`✗ ${bedId}  HTTP ${res.status}  ${t.slice(0, 150)}`);
  }
}

console.log(`\n${ok} updated, ${fail} failed`);
