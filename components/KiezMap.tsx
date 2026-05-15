"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { Entry } from "@/lib/types";
import { TAG_LABELS } from "@/lib/types";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icon paths broken by bundlers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function FitBounds({ entries }: { entries: Entry[] }) {
  const map = useMap();
  useEffect(() => {
    const points = entries
      .filter((e) => e.lat != null && e.lng != null)
      .map((e) => [e.lat!, e.lng!] as [number, number]);
    if (points.length > 0) map.fitBounds(points, { padding: [40, 40] });
  }, [map, entries]);
  return null;
}

interface KiezMapProps {
  entries: Entry[];
}

export default function KiezMap({ entries }: KiezMapProps) {
  const mapped = entries.filter((e) => e.lat != null && e.lng != null);

  return (
    <MapContainer
      center={[52.455, 13.578]}
      zoom={12}
      style={{ height: "100%", width: "100%", borderRadius: 12 }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds entries={mapped} />
      {mapped.map((entry) => (
        <Marker key={entry.id} position={[entry.lat!, entry.lng!]}>
          <Popup maxWidth={260}>
            <div style={{ fontFamily: "system-ui, sans-serif", fontSize: 13 }}>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.06em", color: "#3a7396", fontWeight: 600, marginBottom: 4 }}>
                {entry.tags.map((t) => TAG_LABELS[t]).join(" · ")}
              </div>
              <strong style={{ fontSize: 14, lineHeight: 1.3, display: "block", marginBottom: 4, color: "#1a2933" }}>
                {entry.title}
              </strong>
              <p style={{ color: "#4a5a64", margin: "0 0 8px", lineHeight: 1.45 }}>
                {entry.ai_summary}
              </p>
              <a
                href={entry.source_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#3a7396", fontSize: 12, fontWeight: 500 }}
              >
                {entry.source} ↗
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
