"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Race } from "@/lib/types";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapClientProps {
  races: Race[];
  center?: [number, number];
  zoom?: number;
  singleMarker?: boolean;
}

export default function MapClient({
  races,
  center = [46.6034, 2.3488],
  zoom = 6,
  singleMarker = false,
}: MapClientProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={!singleMarker}
      className="h-full w-full rounded-xl"
      style={{ minHeight: singleMarker ? "300px" : "400px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {races.map((race) => (
        <Marker key={race.slug} position={[race.lat, race.lng]}>
          <Popup>
            <div className="text-sm">
              <strong>{race.nom}</strong>
              <br />
              {race.ville}
              <br />
              {race.distances.join(", ")}
              {!singleMarker && (
                <>
                  <br />
                  <a
                    href={`/course/${race.slug}`}
                    className="text-blue-600 underline"
                  >
                    Voir la fiche
                  </a>
                </>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
