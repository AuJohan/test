"use client";

import { useEffect, useState } from "react";
import { Race } from "@/lib/types";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl bg-gray-100 text-gray-400">
        Chargement de la carte...
      </div>
    );
  }

  return <MapInner races={races} center={center} zoom={zoom} singleMarker={singleMarker} />;
}

function MapInner({
  races,
  center,
  zoom,
  singleMarker,
}: MapClientProps & { center: [number, number]; zoom: number }) {
  const [components, setComponents] = useState<{
    MapContainer: typeof import("react-leaflet").MapContainer;
    TileLayer: typeof import("react-leaflet").TileLayer;
    Marker: typeof import("react-leaflet").Marker;
    Popup: typeof import("react-leaflet").Popup;
    L: typeof import("leaflet");
  } | null>(null);

  useEffect(() => {
    Promise.all([import("react-leaflet"), import("leaflet")]).then(
      ([rl, L]) => {
        delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
        setComponents({
          MapContainer: rl.MapContainer,
          TileLayer: rl.TileLayer,
          Marker: rl.Marker,
          Popup: rl.Popup,
          L: L,
        });
      }
    );
  }, []);

  if (!components) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl bg-gray-100 text-gray-400">
        Chargement de la carte...
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = components;

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
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
    </>
  );
}
