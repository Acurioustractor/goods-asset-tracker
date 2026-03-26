'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { communityLocations } from '@/lib/data/content';
import { MachineOverview } from '@/lib/types/database';

interface FleetMapProps {
  machines: MachineOverview[];
}

export function FleetMap({ machines }: FleetMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Center on Central Australia
    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
    }).setView([-21.5, 138.5], 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    }).addTo(map);

    // Group machines by community
    const communityStats = new Map<string, { online: number; offline: number }>();
    
    machines.forEach((m) => {
      // Normalise community name since some are "Palm Island" and others are generic places
      const community = m.community ? m.community.trim() : null;
      if (!community) return;
      
      const stats = communityStats.get(community) || { online: 0, offline: 0 };
      if (m.online) stats.online++;
      else stats.offline++;
      communityStats.set(community, stats);
    });

    // We manually add some hardcoded aliases mapping locations if strict matches fail.
    const getStats = (locName: string, locId: string) => {
      return communityStats.get(locName) || communityStats.get(locId) || null;
    };

    communityLocations.forEach((loc) => {
      const stats = getStats(loc.name, loc.id);
      if (!stats) return; // Only plot if there are machines in this location

      const total = stats.online + stats.offline;
      const percentOnline = total > 0 ? (stats.online / total) * 100 : 0;
      
      let colorClass = 'bg-emerald-500';
      if (percentOnline === 0) colorClass = 'bg-red-500';
      else if (percentOnline < 100) colorClass = 'bg-amber-500';

      const icon = L.divIcon({
        className: 'fleet-marker',
        html: `
          <div style="
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 14px;
          " class="${colorClass}">${total}</div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const popup = L.popup({
        maxWidth: 250,
        className: 'fleet-popup',
      }).setContent(`
        <div style="font-family:system-ui,sans-serif; padding: 4px;">
          <h3 style="margin:0 0 8px;font-size:16px;font-weight:600;">${loc.name}</h3>
          <div style="display:flex; justify-content: space-between; margin-bottom: 4px; font-size: 13px;">
            <span style="color:#059669; font-weight: 500;">● Online</span>
            <strong>${stats.online}</strong>
          </div>
          <div style="display:flex; justify-content: space-between; font-size: 13px;">
            <span style="color:#dc2626; font-weight: 500;">● Offline</span>
            <strong>${stats.offline}</strong>
          </div>
        </div>
      `);

      L.marker([loc.lat, loc.lng], { icon })
        .addTo(map)
        .bindPopup(popup);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [machines]);

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-border shadow-sm">
      <div ref={mapRef} className="w-full h-full bg-slate-100" />
      <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 text-xs shadow-md border border-border z-[1000] flex flex-col gap-2">
        <div className="font-semibold mb-1">Fleet Operations</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 border border-white shadow-sm" />
          <span className="text-muted-foreground">100% Online</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500 border border-white shadow-sm" />
          <span className="text-muted-foreground">Mixed Status</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm" />
          <span className="text-muted-foreground">All Offline</span>
        </div>
      </div>
    </div>
  );
}
