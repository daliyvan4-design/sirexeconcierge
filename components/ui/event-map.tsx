"use client";

import { useEffect, useRef } from "react";
import { Navigation } from "lucide-react";

interface Props {
  lat: number;
  lng: number;
  lieu: string;
  ville: string;
}

export function EventMap({ lat, lng, lieu, ville }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;

      if (cancelled || !mapRef.current) return;

      const linkEl = document.createElement("link");
      linkEl.rel = "stylesheet";
      linkEl.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(linkEl);

      const map = L.map(mapRef.current, {
        scrollWheelZoom: false,
        zoomControl: false,
      }).setView([lat, lng], 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        html: `<div style="width:32px;height:32px;background:#C8A951;border-radius:50%;border:3px solid #0A0A0A;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
        className: "",
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker([lat, lng], { icon }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      mapInstanceRef.current = map;
    })();

    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="rounded-2xl overflow-hidden border border-line">
      <div ref={mapRef} style={{ height: 220, width: "100%" }} />
      <div className="bg-white px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[13px] text-ink font-medium">{lieu}</p>
          <p className="text-[12px] text-mute">{ville}</p>
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-press inline-flex items-center gap-1.5 bg-ink text-cream rounded-full px-4 py-2 text-[12px] font-medium"
        >
          <Navigation className="w-3.5 h-3.5" />
          Itineraire
        </a>
      </div>
    </div>
  );
}
