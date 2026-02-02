'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface CommunityLocation {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  storytellerCount: number;
  bedsDelivered: number;
  description: string;
  highlight: string;
}

interface StorytellerProfile {
  id: string;
  name: string;
  role?: string;
  location: string;
  community: string;
  photo: string;
  keyQuote: string;
  isElder: boolean;
}

interface CommunityMapProps {
  locations: CommunityLocation[];
  storytellers: StorytellerProfile[];
  selectedCommunity?: string | null;
  onSelectCommunity?: (id: string | null) => void;
}

export function CommunityMap({
  locations,
  storytellers,
  selectedCommunity,
  onSelectCommunity,
}: CommunityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [activePopup, setActivePopup] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Center on Australia
    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    }).setView([-21.5, 138.5], 5);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 12,
    }).addTo(map);

    // Custom marker icon
    const createIcon = (count: number, beds: number) => {
      const size = beds > 100 ? 48 : beds > 0 ? 40 : 32;
      return L.divIcon({
        className: 'community-marker',
        html: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: hsl(142, 76%, 36%);
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: ${size > 40 ? '14px' : '12px'};
            cursor: pointer;
          ">${beds > 0 ? beds : '?'}</div>
        `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
    };

    locations.forEach((loc) => {
      const communityStorytellers = storytellers.filter((s) => s.community === loc.id);
      const icon = createIcon(loc.storytellerCount, loc.bedsDelivered);

      const storytellerHtml = communityStorytellers.length > 0
        ? `<div style="margin-top:8px;display:flex;gap:4px;flex-wrap:wrap;">
            ${communityStorytellers
              .map(
                (s) =>
                  `<div style="display:flex;align-items:center;gap:4px;background:#f5f5f5;border-radius:12px;padding:2px 8px 2px 2px;font-size:11px;">
                    <img src="${s.photo}" style="width:20px;height:20px;border-radius:50%;object-fit:cover;" alt="${s.name}" />
                    <span>${s.name}</span>
                  </div>`
              )
              .join('')}
           </div>`
        : '';

      const popup = L.popup({
        maxWidth: 300,
        className: 'community-popup',
      }).setContent(`
        <div style="font-family:system-ui,sans-serif;">
          <h3 style="margin:0 0 4px;font-size:16px;font-weight:600;">${loc.name}</h3>
          <p style="margin:0 0 8px;font-size:12px;color:#666;">${loc.region}</p>
          <p style="margin:0 0 8px;font-size:13px;line-height:1.4;">${loc.description}</p>
          <div style="display:flex;gap:16px;margin-bottom:8px;">
            ${loc.bedsDelivered > 0 ? `<div><strong style="font-size:18px;">${loc.bedsDelivered}</strong><br/><span style="font-size:11px;color:#666;">beds delivered</span></div>` : ''}
            ${loc.storytellerCount > 0 ? `<div><strong style="font-size:18px;">${loc.storytellerCount}</strong><br/><span style="font-size:11px;color:#666;">storytellers</span></div>` : ''}
          </div>
          ${storytellerHtml}
        </div>
      `);

      const marker = L.marker([loc.lat, loc.lng], { icon })
        .addTo(map)
        .bindPopup(popup);

      marker.on('click', () => {
        setActivePopup(loc.id);
        onSelectCommunity?.(loc.id);
      });
    });

    // Connection lines between communities
    const coords = locations.map((l) => [l.lat, l.lng] as [number, number]);
    if (coords.length > 1) {
      L.polyline(coords, {
        color: 'hsl(142, 76%, 36%)',
        weight: 1.5,
        opacity: 0.3,
        dashArray: '8, 8',
      }).addTo(map);
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [locations, storytellers, onSelectCommunity]);

  // Fly to selected community
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedCommunity) return;
    const loc = locations.find((l) => l.id === selectedCommunity);
    if (loc) {
      mapInstanceRef.current.flyTo([loc.lat, loc.lng], 8, { duration: 1 });
    }
  }, [selectedCommunity, locations]);

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="w-full h-[500px] md:h-[600px] rounded-xl overflow-hidden border border-border"
      />
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 text-xs shadow-md border border-border z-[1000]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-emerald-600" />
          <span className="text-muted-foreground">Community &middot; number = beds delivered</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0 border-t-2 border-dashed border-emerald-600/30" style={{ width: 12 }} />
          <span className="text-muted-foreground">Connection between communities</span>
        </div>
      </div>
    </div>
  );
}
