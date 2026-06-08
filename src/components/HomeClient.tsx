"use client";

import { useState, useMemo } from "react";
import { Race } from "@/lib/types";
import RaceCard from "./RaceCard";
import Filters from "./Filters";
import Map from "./Map";
import {
  getAllRegions,
  getAllTypeEau,
  getAllNiveaux,
  getAllStatuts,
} from "@/lib/races";
import { raceMatchesDistanceRange, type DistanceRange } from "@/lib/format";

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
      if (filters.distance && !raceMatchesDistanceRange(r.distances, filters.distance as DistanceRange)) return false;
      if (filters.niveau && r.niveau !== filters.niveau) return false;
      if (filters.statut && r.statut !== filters.statut) return false;
      return true;
    });
  }, [races, filters]);

  const stats = useMemo(() => {
    const regions = new Set(races.map((r) => r.region).filter(Boolean));
    const plansEau = new Set(races.map((r) => r.planEau).filter(Boolean));
    return { courses: races.length, regions: regions.size, plansEau: plansEau.size };
  }, [races]);

  return (
    <>
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-eau-600">{stats.courses}</p>
          <p className="text-xs text-gray-500">Courses</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-eau-600">{stats.regions}</p>
          <p className="text-xs text-gray-500">Régions</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm">
          <p className="text-2xl font-extrabold text-eau-600">{stats.plansEau}</p>
          <p className="text-xs text-gray-500">Plans d&apos;eau</p>
        </div>
      </div>

      <Filters
        regions={getAllRegions(races)}
        typesEau={getAllTypeEau(races)}
        niveaux={getAllNiveaux(races)}
        statuts={getAllStatuts(races)}
        selected={filters}
        onChange={handleChange}
      />

      <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 shadow-sm" style={{ height: "400px" }}>
        <Map races={filtered} />
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
