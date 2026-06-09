"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Race } from "@/lib/types";
import { typeEauColor } from "@/lib/format";

function makeIcon(color: string, highlighted: boolean) {
  const size = highlighted ? 30 : 22;
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;background:${color};transform:rotate(-45deg);border:2px solid white;box-shadow:0 1px 5px rgba(0,0,0,.4);${highlighted ? "outline:3px solid rgba(0,119,182,.35);" : ""}"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size + 2],
  });
}

interface MapClientProps {
  races: Race[];
  center?: [number, number];
  zoom?: number;
  singleMarker?: boolean;
  hoveredSlug?: string | null;
  onMarkerClick?: (slug: string) => void;
}

export default function MapClient({
  races,
  center = [46.6034, 2.3488],
  zoom = 6,
  singleMarker = false,
  hoveredSlug = null,
  onMarkerClick,
}: MapClientProps) {
  const markers = races.map((race) => (
    <Marker
      key={race.slug}
      position={[race.lat, race.lng]}
      icon={makeIcon(typeEauColor(race.typeEau), hoveredSlug === race.slug)}
      eventHandlers={{
        click: () => onMarkerClick?.(race.slug),
      }}
    >
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
  ));

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={!singleMarker}
      className="h-full w-full rounded-xl"
      style={{ minHeight: singleMarker ? "300px" : "350px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {singleMarker ? (
        markers
      ) : (
        <MarkerClusterGroup chunkedLoading maxClusterRadius={40}>
          {markers}
        </MarkerClusterGroup>
      )}
    </MapContainer>
  );
}
