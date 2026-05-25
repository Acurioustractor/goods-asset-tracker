'use client';

import { useEffect, useRef } from 'react';
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
  /** Per-location override for the label direction. Defaults to 'right'. */
  tooltipDirection?: 'left' | 'right' | 'top' | 'bottom';
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

// Brand-aligned palette pulled from globals.css so the map sits in the
// same warm/cream/terracotta/sage register as the rest of the page.
const BRAND = {
  terracotta: 'rgba(196, 110, 75, 1)',
  terracottaSoft: 'rgba(196, 110, 75, 0.35)',
  terracottaWisp: 'rgba(196, 110, 75, 0.10)',
  ink: 'rgb(64, 51, 41)',
  inkSoft: 'rgba(64, 51, 41, 0.55)',
  cream: 'rgba(252, 247, 240, 1)',
};

export function CommunityMap({
  locations,
  storytellers,
  selectedCommunity,
  onSelectCommunity,
}: CommunityMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
    }).setView([-21.5, 138.5], 5);

    // Soft cream base. CartoDB Positron no-labels gives a near-white
    // map with whispery road lines and no place names, so our own
    // serif community labels carry the geography without competing.
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 12,
      },
    ).addTo(map);

    // Heatpost marker: a glowing dot with a soft radial halo. Size scales
    // with bed count but the whole footprint stays small so it reads as
    // "presence on Country", not "infrastructure pin".
    const createHeatpost = (beds: number) => {
      const dot = beds >= 100 ? 22 : beds >= 30 ? 18 : beds > 0 ? 14 : 10;
      const halo = dot * 4;
      return L.divIcon({
        className: 'community-heatpost',
        html: `
          <div style="position:relative;width:${halo}px;height:${halo}px;pointer-events:none;">
            <div style="
              position:absolute;inset:0;border-radius:50%;
              background: radial-gradient(circle,
                ${BRAND.terracottaSoft} 0%,
                ${BRAND.terracottaWisp} 38%,
                rgba(196,110,75,0) 72%);
            "></div>
            <div style="
              position:absolute;top:50%;left:50%;
              transform:translate(-50%,-50%);
              width:${dot}px;height:${dot}px;border-radius:50%;
              background:${BRAND.terracotta};
              box-shadow:
                0 0 0 ${Math.max(2, dot / 5)}px rgba(196,110,75,0.16),
                0 0 ${dot * 2}px rgba(196,110,75,0.25);
              pointer-events:auto;cursor:pointer;
            "></div>
          </div>
        `,
        iconSize: [halo, halo],
        iconAnchor: [halo / 2, halo / 2],
      });
    };

    locations.forEach((loc) => {
      const communityStorytellers = storytellers.filter(
        (s) => s.community === loc.id,
      );
      const icon = createHeatpost(loc.bedsDelivered);

      const storytellerHtml =
        communityStorytellers.length > 0
          ? `<div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap;">
              ${communityStorytellers
                .map(
                  (s) =>
                    `<div style="display:flex;align-items:center;gap:6px;background:${BRAND.cream};border-radius:999px;padding:3px 10px 3px 3px;font-size:11px;color:${BRAND.ink};">
                      <img src="${s.photo}" style="width:22px;height:22px;border-radius:50%;object-fit:cover;" alt="${s.name}" />
                      <span style="font-family:Georgia,serif;">${s.name}</span>
                    </div>`,
                )
                .join('')}
            </div>`
          : '';

      const popup = L.popup({
        maxWidth: 280,
        className: 'community-popup-soft',
        closeButton: false,
      }).setContent(`
        <div style="font-family:Georgia,serif;color:${BRAND.ink};padding:4px 2px;">
          <div style="font-family:system-ui,sans-serif;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.inkSoft};margin-bottom:6px;">
            ${loc.region}
          </div>
          <div style="font-size:18px;font-weight:500;letter-spacing:-0.01em;line-height:1.15;margin-bottom:10px;">
            ${loc.name}
          </div>
          <div style="font-size:13px;line-height:1.5;color:${BRAND.ink};opacity:0.85;">
            ${loc.description}
          </div>
          ${
            loc.bedsDelivered > 0 || loc.storytellerCount > 0
              ? `<div style="display:flex;gap:18px;margin-top:12px;padding-top:10px;border-top:1px solid rgba(196,110,75,0.18);">
                  ${
                    loc.bedsDelivered > 0
                      ? `<div>
                          <div style="font-family:Georgia,serif;font-size:22px;font-weight:500;color:${BRAND.terracotta};line-height:1;">${loc.bedsDelivered}</div>
                          <div style="font-family:system-ui,sans-serif;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND.inkSoft};margin-top:3px;">beds delivered</div>
                        </div>`
                      : ''
                  }
                  ${
                    loc.storytellerCount > 0
                      ? `<div>
                          <div style="font-family:Georgia,serif;font-size:22px;font-weight:500;color:${BRAND.terracotta};line-height:1;">${loc.storytellerCount}</div>
                          <div style="font-family:system-ui,sans-serif;font-size:10px;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND.inkSoft};margin-top:3px;">storytellers</div>
                        </div>`
                      : ''
                  }
                </div>`
              : ''
          }
          ${storytellerHtml}
        </div>
      `);

      const marker = L.marker([loc.lat, loc.lng], { icon })
        .addTo(map)
        .bindPopup(popup);

      // Permanent inline label, placed by `tooltipDirection` so close pairs
      // (Utopia + Ampilatwatja, etc) can throw their labels in different
      // directions instead of stacking on top of each other.
      const bedsLine =
        loc.bedsDelivered > 0
          ? `<div class="hp-beds">${loc.bedsDelivered} bed${loc.bedsDelivered === 1 ? '' : 's'}</div>`
          : '';
      const direction = loc.tooltipDirection ?? 'right';
      const offset: [number, number] =
        direction === 'left'
          ? [-10, 0]
          : direction === 'top'
            ? [0, -8]
            : direction === 'bottom'
              ? [0, 8]
              : [10, 0];
      marker.bindTooltip(
        `<div class="hp-label hp-${direction}">
           <div class="hp-name">${loc.name}</div>
           ${bedsLine}
         </div>`,
        {
          permanent: true,
          direction,
          offset,
          className: 'community-tooltip-soft',
          opacity: 1,
        },
      );

      marker.on('click', () => {
        onSelectCommunity?.(loc.id);
      });
    });

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
      mapInstanceRef.current.flyTo([loc.lat, loc.lng], 7.5, { duration: 1 });
    }
  }, [selectedCommunity, locations]);

  return (
    <div className="relative">
      {/* Brand-aligned overrides for Leaflet's defaults. Scoped via the
          tooltip / popup className above so this doesn't leak into any
          other Leaflet instance on the site. */}
      <style jsx global>{`
        .community-tooltip-soft {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          padding: 0 !important;
          color: rgb(64, 51, 41);
        }
        .community-tooltip-soft::before {
          display: none !important;
        }
        .community-tooltip-soft .hp-label {
          font-family: Georgia, serif;
          line-height: 1.1;
          text-shadow:
            0 0 6px rgba(252, 247, 240, 0.95),
            0 0 12px rgba(252, 247, 240, 0.7);
        }
        .community-tooltip-soft .hp-left {
          text-align: right;
        }
        .community-tooltip-soft .hp-top,
        .community-tooltip-soft .hp-bottom {
          text-align: center;
        }
        .community-tooltip-soft .hp-name {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: -0.005em;
          color: rgb(64, 51, 41);
        }
        .community-tooltip-soft .hp-beds {
          font-family:
            ui-sans-serif,
            system-ui,
            -apple-system,
            sans-serif;
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(64, 51, 41, 0.55);
          margin-top: 2px;
        }
        .community-popup-soft .leaflet-popup-content-wrapper {
          background: rgba(252, 247, 240, 0.98);
          border-radius: 14px;
          box-shadow:
            0 4px 24px rgba(64, 51, 41, 0.08),
            0 1px 3px rgba(64, 51, 41, 0.05);
          border: 1px solid rgba(196, 110, 75, 0.12);
        }
        .community-popup-soft .leaflet-popup-content {
          margin: 14px 16px;
        }
        .community-popup-soft .leaflet-popup-tip {
          background: rgba(252, 247, 240, 0.98);
          box-shadow: none;
        }
        .leaflet-container {
          background: oklch(0.97 0.01 80);
          font-family: Georgia, serif;
        }
        .leaflet-control-zoom a {
          background: rgba(252, 247, 240, 0.95) !important;
          color: rgb(64, 51, 41) !important;
          border: 1px solid rgba(196, 110, 75, 0.18) !important;
          border-radius: 8px !important;
        }
        .leaflet-control-zoom a:hover {
          background: rgba(252, 247, 240, 1) !important;
          color: rgba(196, 110, 75, 1) !important;
        }
        .leaflet-control-attribution {
          background: rgba(252, 247, 240, 0.7) !important;
          color: rgba(64, 51, 41, 0.55) !important;
          font-size: 10px !important;
          font-family:
            ui-sans-serif,
            system-ui,
            sans-serif !important;
        }
      `}</style>

      <div
        ref={mapRef}
        className="w-full h-[520px] md:h-[640px] rounded-3xl overflow-hidden shadow-[0_2px_20px_rgba(64,51,41,0.06)]"
      />

      {/* Quiet caption replaces the old boxed legend. The heatposts
          and their inline labels carry the meaning; this just frames
          how to read them. */}
      <p className="mt-3 text-xs text-muted-foreground italic text-center">
        Each glow marks a community Goods has delivered to. Tap a dot for the
        story behind the number.
      </p>
    </div>
  );
}
