// Combined 2-day Utopia + Alice Springs trip map. Day 1 photos have GPS;
// Day 2 (WhatsApp) and Alice Springs (no QR photo) don't. The map shows
// what's locatable; the sidebar lists everything by bed ID.

import { readFileSync, writeFileSync } from 'node:fs';

const day1 = JSON.parse(readFileSync('/tmp/utopia-batch.json', 'utf-8'));
const day2 = JSON.parse(readFileSync('/tmp/utopia-day2-batch.json', 'utf-8'));

const day1Points = day1.results
  .filter(r => r.gps_lat && r.gps_lng)
  .map(r => ({ ...r, day: 1 }));

const day2Beds = day2.results
  .filter(r => r.bed_id)
  .map(r => ({ ...r, day: 2 }));

// Alice Springs catch-up beds — no GPS, plotted near Alice as approximate markers
const ALICE = { lat: -23.6975, lng: 133.8836 };
const aliceBeds = ['GB0-156-102','GB0-156-103','GB0-156-1','GB0-156-2','GB0-156-3','GB0-156-4','GB0-156-5','GB0-156-6']
  .map((id, i) => ({
    file: 'no-photo',
    bed_id: id,
    recipient_name: null,
    gps_lat: ALICE.lat + (i % 3) * 0.001 - 0.001,
    gps_lng: ALICE.lng + Math.floor(i / 3) * 0.001 - 0.001,
    taken_at: '2026-05-21T00:00:00Z',
    day: 'AS',
  }));

const allPoints = [...day1Points, ...aliceBeds];

const uniqueDay1 = [...new Set(day1Points.filter(p => p.bed_id).map(p => p.bed_id))];
const uniqueDay2 = [...new Set(day2Beds.map(p => p.bed_id))];
const totalBeds = uniqueDay1.length + uniqueDay2.length + 8;  // +8 Alice catch-up

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Utopia + Alice Springs Trip — ${totalBeds} beds delivered</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  body { margin: 0; font-family: -apple-system, system-ui, sans-serif; background: #f6f3ee; color: #1c1917; }
  header { padding: 14px 18px; background: #1c1917; color: #fef3c7; }
  header h1 { margin: 0 0 4px 0; font-size: 18px; }
  header p { margin: 0; font-size: 12px; opacity: 0.85; }
  .totals { display: flex; gap: 16px; margin-top: 8px; font-size: 13px; }
  .totals span { color: #fbbf24; font-weight: 700; }
  #wrap { display: grid; grid-template-columns: 1fr 360px; height: calc(100vh - 90px); }
  #map { height: 100%; }
  #side { overflow-y: auto; padding: 12px 14px; background: #fffaf3; border-left: 1px solid #e7d9c4; }
  h3 { font-size: 13px; margin: 18px 0 8px; text-transform: uppercase; letter-spacing: 0.5px; color: #78350f; }
  .bed { background: #fff; border: 1px solid #e5e7eb; border-radius: 6px; padding: 6px 9px; margin-bottom: 4px; font-size: 12px; cursor: pointer; }
  .bed:hover { background: #fef9e7; }
  .bed-id { font-family: ui-monospace, Menlo, monospace; font-weight: 700; color: #b45309; }
  .bed-meta { font-size: 11px; color: #57534e; margin-top: 1px; }
  .alice .bed-id { color: #be123c; }
  .day2 .bed-id { color: #047857; }
</style>
</head>
<body>
  <header>
    <h1>Utopia Homelands + Alice Springs Trip — 21–22 May 2026</h1>
    <p>${totalBeds} Stretch Beds delivered to community over 2 days</p>
    <div class="totals">
      <div>Day 1 Utopia: <span>${uniqueDay1.length}</span></div>
      <div>Day 1 Alice Springs catch-up: <span>8</span></div>
      <div>Day 2 Utopia: <span>${uniqueDay2.length}</span></div>
      <div>Total: <span>${totalBeds}</span></div>
    </div>
  </header>
  <div id="wrap">
    <div id="map"></div>
    <div id="side">
      <h3>Day 1 Utopia (${uniqueDay1.length} GPS-tagged)</h3>
      <div id="day1-list"></div>
      <h3>Day 1 Alice Springs (8 caught up)</h3>
      <div id="alice-list"></div>
      <h3>Day 2 Utopia (${uniqueDay2.length} via WhatsApp, no GPS)</h3>
      <div id="day2-list"></div>
    </div>
  </div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const day1Points = ${JSON.stringify(day1Points)};
    const day2Beds = ${JSON.stringify(day2Beds)};
    const aliceBeds = ${JSON.stringify(aliceBeds)};
    const allPoints = ${JSON.stringify(allPoints)};

    const meanLat = allPoints.reduce((s,p)=>s+p.gps_lat,0)/allPoints.length;
    const meanLng = allPoints.reduce((s,p)=>s+p.gps_lng,0)/allPoints.length;
    const map = L.map('map').setView([meanLat, meanLng], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    const bounds = [];
    const addMarker = (p, colour, listEl, cssClass) => {
      const marker = L.circleMarker([p.gps_lat, p.gps_lng], {
        radius: p.bed_id ? 8 : 5,
        color: colour, weight: 2,
        fillColor: colour, fillOpacity: 0.6,
      }).addTo(map);
      const url = p.bed_id ? \`https://www.goodsoncountry.com/bed/\${p.bed_id}\` : null;
      marker.bindPopup(\`
        <strong>\${p.bed_id || '(scene photo)'}</strong><br>
        \${p.recipient_name ? '<span>👤 <b>'+p.recipient_name+'</b></span><br>' : ''}
        <span style="font-size:11px;color:#666">\${p.file}</span><br>
        \${url ? '<a href="'+url+'" target="_blank">open bed →</a>' : ''}
      \`);
      bounds.push([p.gps_lat, p.gps_lng]);

      if (listEl && p.bed_id) {
        const item = document.createElement('div');
        item.className = 'bed ' + (cssClass || '');
        item.innerHTML = \`
          <div class="bed-id">\${p.bed_id}</div>
          <div class="bed-meta">\${p.recipient_name ? '👤 '+p.recipient_name+' · ' : ''}<a href="\${url}" target="_blank">view →</a></div>
        \`;
        item.addEventListener('click', () => { map.setView([p.gps_lat, p.gps_lng], 17); marker.openPopup(); });
        listEl.appendChild(item);
      }
    };

    const day1List = document.getElementById('day1-list');
    const aliceList = document.getElementById('alice-list');
    const day2List = document.getElementById('day2-list');

    for (const p of day1Points) addMarker(p, '#b45309', day1List);
    for (const p of aliceBeds) addMarker(p, '#be123c', aliceList, 'alice');
    for (const p of day2Beds) {
      const item = document.createElement('div');
      item.className = 'bed day2';
      const url = \`https://www.goodsoncountry.com/bed/\${p.bed_id}\`;
      item.innerHTML = \`
        <div class="bed-id">\${p.bed_id}</div>
        <div class="bed-meta">(no GPS — WhatsApp) · <a href="\${url}" target="_blank">view →</a></div>
      \`;
      day2List.appendChild(item);
    }

    map.fitBounds(bounds, { padding: [40, 40] });
  </script>
</body>
</html>`;

writeFileSync('/tmp/utopia-trip-full-map.html', html);
console.log('Wrote /tmp/utopia-trip-full-map.html');
