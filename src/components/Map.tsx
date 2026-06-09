"use client";

import dynamic from "next/dynamic";
import { Race } from "@/lib/types";

const MapClient = dynamic(() => import("./MapClient"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-xl bg-gray-100 text-gray-400">
      Chargement de la carte...
    </div>
  ),
});

interface MapProps {
  races: Race[];
  center?: [number, number];
  zoom?: number;
  singleMarker?: boolean;
  hoveredSlug?: string | null;
  onMarkerClick?: (slug: string) => void;
}

export default function Map(props: MapProps) {
  return <MapClient {...props} />;
}
