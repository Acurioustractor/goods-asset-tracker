'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface AssetLocation {
  unique_id: string;
  community: string;
  gps: string | null;
  product: string;
  status: string;
}

interface BedMapProps {
  currentAssetId: string;
  assets: AssetLocation[];
}

// Known community coordinates
const COMMUNITY_COORDS: Record<string, [number, number]> = {
  'Tennant Creek': [-19.65, 134.19],
  'Alice Springs': [-23.70, 133.88],
  'Palm Island': [-18.73, 146.58],
  'Canberra': [-35.308, 149.124],
  'Kalgoorlie': [-30.75, 121.47],
  'Maningrida': [-12.05, 134.23],
  'Mount Isa': [-20.73, 139.49],
  'Darwin': [-12.46, 130.84],
  'Utopia Homelands': [-22.10, 134.80],
};

export function BedMap({ currentAssetId, assets }: BedMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Find current asset's community
    const currentAsset = assets.find((a) => a.unique_id === currentAssetId);
    const currentCommunity = currentAsset?.community;

    // Group assets by community
    const communities = new Map<string, { beds: number; washers: number; hasCurrent: boolean }>();
    for (const asset of assets) {
      if (!asset.community || asset.community === 'Unknown' || asset.community === 'Pending Delivery') continue;
      if (!communities.has(asset.community)) {
        communities.set(asset.community, { beds: 0, washers: 0, hasCurrent: false });
      }
      const c = communities.get(asset.community)!;
      const prod = asset.product?.toLowerCase() || '';
      if (prod.includes('wash') || prod.includes('machine')) {
        c.washers++;
      } else {
        c.beds++;
      }
      if (asset.unique_id === currentAssetId) {
        c.hasCurrent = true;
      }
    }

    // Center on current community or Australia
    const currentCoords = currentCommunity ? COMMUNITY_COORDS[currentCommunity] : undefined;
    const center: [number, number] = currentCoords || [-25, 134];

    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: false,
    }).setView(center, 4);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 16,
    }).addTo(map);

    // Draw community markers
    communities.forEach((data, communityName) => {
      const coords = COMMUNITY_COORDS[communityName];
      if (!coords) return;

      const total = data.beds + data.washers;
      const size = data.hasCurrent ? 44 : Math.max(28, Math.min(40, 24 + Math.log2(total + 1) * 6));

      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: ${data.hasCurrent ? '#C45C3E' : '#78716c'};
          border: 3px solid ${data.hasCurrent ? '#fff' : 'rgba(255,255,255,0.8)'};
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: ${size > 34 ? '14' : '12'}px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ${data.hasCurrent ? 'animation: pulse-ring 2s ease-out infinite;' : ''}
        ">${total}</div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L.marker(coords, { icon }).addTo(map);

      const lines = [`<strong>${communityName}</strong>`];
      if (data.beds > 0) lines.push(`${data.beds} bed${data.beds > 1 ? 's' : ''}`);
      if (data.washers > 0) lines.push(`${data.washers} washing machine${data.washers > 1 ? 's' : ''}`);
      if (data.hasCurrent) lines.push(`<br/><span style="color:#C45C3E;font-weight:600;">Your bed is here</span>`);

      marker.bindPopup(lines.join('<br/>'), {
        className: 'goods-popup',
        closeButton: false,
      });

      if (data.hasCurrent) {
        marker.openPopup();
      }
    });

    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse-ring {
        0% { box-shadow: 0 0 0 0 rgba(196,92,62,0.6); }
        70% { box-shadow: 0 0 0 12px rgba(196,92,62,0); }
        100% { box-shadow: 0 0 0 0 rgba(196,92,62,0); }
      }
      .goods-popup .leaflet-popup-content-wrapper {
        border-radius: 8px;
        font-family: system-ui, sans-serif;
        font-size: 13px;
        line-height: 1.5;
        padding: 4px;
      }
      .goods-popup .leaflet-popup-tip { display: none; }
    `;
    document.head.appendChild(style);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      style.remove();
    };
  }, [assets, currentAssetId]);

  // Summary stats
  const totalBeds = assets.filter((a) => {
    const p = a.product?.toLowerCase() || '';
    return !p.includes('wash') && !p.includes('machine') && a.community !== 'Pending Delivery';
  }).length;
  const totalWashers = assets.filter((a) => {
    const p = a.product?.toLowerCase() || '';
    return (p.includes('wash') || p.includes('machine')) && a.community !== 'Pending Delivery';
  }).length;
  const communityCount = new Set(
    assets.filter((a) => a.community && a.community !== 'Unknown' && a.community !== 'Pending Delivery').map((a) => a.community)
  ).size;

  return (
    <div>
      <div
        ref={mapRef}
        className="w-full h-[350px] md:h-[400px] rounded-b-2xl overflow-hidden"
        style={{ zIndex: 0 }}
      />
      <div className="flex gap-6 justify-center py-3 text-xs text-muted-foreground">
        <span><strong className="text-foreground">{totalBeds}</strong> beds</span>
        <span><strong className="text-foreground">{totalWashers}</strong> washing machines</span>
        <span><strong className="text-foreground">{communityCount}</strong> communities</span>
      </div>
    </div>
  );
}
