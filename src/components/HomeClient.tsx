"use client";

import { useState, useMemo } from "react";
import { Race } from "@/lib/types";
import RaceCard from "./RaceCard";
import Filters from "./Filters";
import MapClient from "./MapClient";
import {
  getAllRegions,
  getAllTypeEau,
  getAllDistances,
  getAllNiveaux,
  getAllStatuts,
} from "@/lib/races";

export default function HomeClient({ races }: { races: Race[] }) {
  const [filters, setFilters] = useState({
    region: "",
    typeEau: "",
    distance: "",
    niveau: "",
    statut: "",
  });

  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filtered = useMemo(() => {
    return races.filter((r) => {
      if (filters.region && r.region !== filters.region) return false;
      if (filters.typeEau && r.typeEau !== filters.typeEau) return false;
      if (filters.distance && !r.distances.includes(filters.distance)) return false;
      if (filters.niveau && r.niveau !== filters.niveau) return false;
      if (filters.statut && r.statut !== filters.statut) return false;
      return true;
    });
  }, [races, filters]);

  return (
    <>
      <Filters
        regions={getAllRegions(races)}
        typesEau={getAllTypeEau(races)}
        distances={getAllDistances(races)}
        niveaux={getAllNiveaux(races)}
        statuts={getAllStatuts(races)}
        selected={filters}
        onChange={handleChange}
      />

      <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 shadow-sm" style={{ height: "400px" }}>
        <MapClient races={filtered} />
      </div>

      <p className="mb-4 text-sm text-gray-500">
        {filtered.length} course{filtered.length > 1 ? "s" : ""} trouvée{filtered.length > 1 ? "s" : ""}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((race) => (
          <RaceCard key={race.slug} race={race} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center text-gray-400">
          Aucune course ne correspond aux filtres sélectionnés.
        </div>
      )}
    </>
  );
}
