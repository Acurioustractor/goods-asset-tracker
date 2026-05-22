// Read /tmp/utopia-batch.json and emit a standalone HTML page with a Leaflet
// map showing every photo as a marker. Bed-ID photos get a strong colour;
// no-QR photos get a muted colour. Clusters are visible at a glance.

import { readFileSync, writeFileSync } from 'node:fs';

const data = JSON.parse(readFileSync('/tmp/utopia-batch.json', 'utf-8'));

// Group photos by bed_id when available, else by exact GPS rounded to 4 dp
const points = data.results
  .filter(r => r.gps_lat && r.gps_lng)
  .map(r => ({
    file: r.file,
    bed_id: r.bed_id,
    recipient: r.recipient_name,
    lat: r.gps_lat,
    lng: r.gps_lng,
    alt: r.gps_alt,
    when: r.taken_at,
  }));

const uniqueBeds = [...new Set(points.map(p => p.bed_id).filter(Boolean))];
const noQrCount = points.filter(p => !p.bed_id).length;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Utopia Trip — ${uniqueBeds.length} beds, ${points.length} photos</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>
  body { margin: 0; font-family: -apple-system, system-ui, sans-serif; background: #f6f3ee; color: #1c1917; }
  header { padding: 14px 18px; background: #1c1917; color: #fef3c7; }
  header h1 { margin: 0 0 4px 0; font-size: 18px; }
  header p { margin: 0; font-size: 12px; opacity: 0.75; }
  #wrap { display: grid; grid-template-columns: 1fr 320px; height: calc(100vh - 60px); }
  #map { height: 100%; }
  #side { overflow-y: auto; padding: 12px 14px; background: #fffaf3; border-left: 1px solid #e7d9c4; }
  .bed { background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px 10px; margin-bottom: 6px; font-size: 13px; }
  .bed-id { font-family: ui-monospace, Menlo, monospace; font-weight: 700; color: #b45309; }
  .bed-meta { font-size: 11px; color: #57534e; margin-top: 2px; }
  .bed a { color: #b45309; text-decoration: none; }
  .bed a:hover { text-decoration: underline; }
  .no-qr { background: #f3f4f6; border-color: #d1d5db; }
  .no-qr .bed-id { color: #6b7280; }
  .stats { font-size: 11px; padding: 8px 10px; background: #fef3c7; border-radius: 6px; margin-bottom: 12px; color: #78350f; }
</style>
</head>
<body>
  <header>
    <h1>Utopia Trip — 2026-05-21</h1>
    <p>${uniqueBeds.length} unique beds decoded · ${points.length} total photos · ${noQrCount} without QR</p>
  </header>
  <div id="wrap">
    <div id="map"></div>
    <div id="side">
      <div class="stats">
        <strong>${uniqueBeds.length}</strong> beds tagged · <strong>${noQrCount}</strong> photos without QR (need manual matching)
      </div>
      <div id="list"></div>
    </div>
  </div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>
    const points = ${JSON.stringify(points)};

    // Centre on the mean of all points
    const meanLat = points.reduce((s,p)=>s+p.lat,0)/points.length;
    const meanLng = points.reduce((s,p)=>s+p.lng,0)/points.length;
    const map = L.map('map').setView([meanLat, meanLng], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    // Site colour palette: amber for decoded, grey for un-decoded
    const list = document.getElementById('list');
    const bounds = [];
    for (const p of points) {
      const decoded = !!p.bed_id;
      const colour = decoded ? '#b45309' : '#6b7280';
      const radius = decoded ? 9 : 6;
      const marker = L.circleMarker([p.lat, p.lng], {
        radius,
        color: colour,
        weight: 2,
        fillColor: colour,
        fillOpacity: 0.6,
      }).addTo(map);
      const url = decoded ? \`https://www.goodsoncountry.com/bed/\${p.bed_id}\` : null;
      marker.bindPopup(\`
        <strong>\${p.bed_id || '(no QR detected)'}</strong><br>
        <span style="font-size:11px;color:#666">\${p.file}</span><br>
        \${p.recipient ? '<span>Recipient: <b>'+p.recipient+'</b></span><br>' : ''}
        <span style="font-size:11px;">\${p.lat.toFixed(5)}, \${p.lng.toFixed(5)}</span><br>
        \${url ? '<a href="'+url+'" target="_blank">open bed page →</a>' : ''}
      \`);
      bounds.push([p.lat, p.lng]);

      const item = document.createElement('div');
      item.className = decoded ? 'bed' : 'bed no-qr';
      item.innerHTML = \`
        <div class="bed-id">\${p.bed_id || 'NO QR · ' + p.file}</div>
        <div class="bed-meta">
          \${p.recipient ? '👤 '+p.recipient+' · ' : ''}
          📍 \${p.lat.toFixed(5)}, \${p.lng.toFixed(5)}
          \${url ? ' · <a href="'+url+'" target="_blank">view →</a>' : ''}
        </div>
      \`;
      item.addEventListener('click', () => {
        map.setView([p.lat, p.lng], 17);
        marker.openPopup();
      });
      list.appendChild(item);
    }

    map.fitBounds(bounds, { padding: [40, 40] });
  </script>
</body>
</html>`;

writeFileSync('/tmp/utopia-batch-map.html', html);
console.log('Wrote /tmp/utopia-batch-map.html');
