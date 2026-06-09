"use client";

import { useState, useMemo, useEffect } from "react";
import { Race } from "@/lib/types";
import RaceCard from "./RaceCard";
import RaceCardSkeleton from "./RaceCardSkeleton";
import Filters from "./Filters";
import Map from "./Map";
import {
  getAllRegions,
  getAllTypeEau,
  getAllNiveaux,
  getAllStatuts,
} from "@/lib/races";
import { raceMatchesDistanceRange, type DistanceRange } from "@/lib/format";

type SortKey = "date" | "distance" | "region" | "nom";

function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  } catch {
    return [];
  }
}

function toggleFavorite(slug: string): string[] {
  const favs = getFavorites();
  const next = favs.includes(slug) ? favs.filter((f) => f !== slug) : [...favs, slug];
  localStorage.setItem("favorites", JSON.stringify(next));
  return next;
}

function getMinDistance(distances: string[]): number {
  const nums = distances.map((d) => parseFloat(d)).filter((n) => !isNaN(n));
  return nums.length ? Math.min(...nums) : Infinity;
}

export default function HomeClient({ races }: { races: Race[] }) {
  const [filters, setFilters] = useState({
    region: "",
    typeEau: "",
    distance: "",
    niveau: "",
    statut: "",
  });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("date");
  const [hideFinished, setHideFinished] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setFavorites(getFavorites());
    setMounted(true);
  }, []);

  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleFavorite = (slug: string) => {
    setFavorites(toggleFavorite(slug));
  };

  const filtered = useMemo(() => {
    const result = races.filter((r) => {
      if (filters.region && r.region !== filters.region) return false;
      if (filters.typeEau && r.typeEau !== filters.typeEau) return false;
      if (filters.distance && !raceMatchesDistanceRange(r.distances, filters.distance as DistanceRange)) return false;
      if (filters.niveau && r.niveau !== filters.niveau) return false;
      if (filters.statut && r.statut !== filters.statut) return false;
      if (hideFinished && (r.statut === "Terminé" || r.statut === "Annulé")) return false;
      if (showFavoritesOnly && !favorites.includes(r.slug)) return false;
      if (search) {
        const q = search.toLowerCase();
        const haystack = `${r.nom} ${r.ville} ${r.planEau} ${r.region} ${r.organisateur}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    result.sort((a, b) => {
      switch (sort) {
        case "date":
          return a.date.localeCompare(b.date);
        case "distance":
          return getMinDistance(a.distances) - getMinDistance(b.distances);
        case "region":
          return a.region.localeCompare(b.region);
        case "nom":
          return a.nom.localeCompare(b.nom);
        default:
          return 0;
      }
    });

    return result;
  }, [races, filters, search, sort, hideFinished, showFavoritesOnly, favorites]);

  const stats = useMemo(() => {
    const regions = new Set(races.map((r) => r.region).filter(Boolean));
    const plansEau = new Set(races.map((r) => r.planEau).filter(Boolean));
    return { courses: races.length, regions: regions.size, plansEau: plansEau.size };
  }, [races]);

  const months = useMemo(() => {
    const grouped: [string, Race[]][] = [];
    const keys: string[] = [];
    filtered.forEach((r) => {
      if (!r.date) return;
      const d = new Date(r.date + "T00:00:00");
      const key = d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
      const idx = keys.indexOf(key);
      if (idx === -1) {
        keys.push(key);
        grouped.push([key, [r]]);
      } else {
        grouped[idx][1].push(r);
      }
    });
    return grouped;
  }, [filtered]);

  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");

  return (
    <>
      {/* Stats */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-6 rounded-xl bg-white border border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏊</span>
          <span className="text-sm text-gray-600"><span className="font-bold text-eau-600">{stats.courses}</span> courses</span>
        </div>
        <div className="h-6 w-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <span className="text-xl">📍</span>
          <span className="text-sm text-gray-600"><span className="font-bold text-eau-600">{stats.regions}</span> régions</span>
        </div>
        <div className="h-6 w-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <span className="text-xl">💧</span>
          <span className="text-sm text-gray-600"><span className="font-bold text-eau-600">{stats.plansEau}</span> plans d&apos;eau</span>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-4 relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une course, ville, plan d'eau..."
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-eau-500 focus:outline-none focus:ring-1 focus:ring-eau-500 transition-all duration-200"
        />
      </div>

      {/* Filters */}
      <Filters
        regions={getAllRegions(races)}
        typesEau={getAllTypeEau(races)}
        niveaux={getAllNiveaux(races)}
        statuts={getAllStatuts(races)}
        selected={filters}
        onChange={handleChange}
      />

      {/* Controls row: sort, toggles, view mode */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-xs font-medium text-gray-500">Trier par</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-700 focus:border-eau-500 focus:outline-none focus:ring-1 focus:ring-eau-500"
          >
            <option value="date">Date</option>
            <option value="distance">Distance</option>
            <option value="region">Région</option>
            <option value="nom">Nom</option>
          </select>
        </div>

        <button
          onClick={() => setHideFinished(!hideFinished)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
            hideFinished
              ? "bg-eau-500 text-white"
              : "bg-white text-gray-600 border border-gray-200 hover:border-eau-300"
          }`}
        >
          À venir uniquement
        </button>

        {mounted && (
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              showFavoritesOnly
                ? "bg-eau-500 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-eau-300"
            }`}
          >
            ♥ Favoris ({favorites.length})
          </button>
        )}

        <div className="ml-auto flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-0.5">
          <button
            onClick={() => setViewMode("grid")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
              viewMode === "grid" ? "bg-eau-500 text-white" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Grille
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
              viewMode === "calendar" ? "bg-eau-500 text-white" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Calendrier
          </button>
        </div>
      </div>

      {/* Map */}
      <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 shadow-sm" style={{ height: "400px" }}>
        <Map races={filtered} />
      </div>

      {/* Results count */}
      <p className="mb-4 text-sm text-gray-500">
        {filtered.length} course{filtered.length > 1 ? "s" : ""} trouvée{filtered.length > 1 ? "s" : ""}
      </p>

      {/* Race cards */}
      {!mounted ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <RaceCardSkeleton key={i} />
          ))}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((race) => (
            <RaceCard
              key={race.slug}
              race={race}
              isFavorite={favorites.includes(race.slug)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {months.map(([month, monthRaces]) => (
            <div key={month}>
              <h3 className="mb-3 text-lg font-bold capitalize text-eau-700 border-b border-gray-200 pb-2">
                📅 {month}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {monthRaces.map((race) => (
                  <RaceCard
                    key={race.slug}
                    race={race}
                    isFavorite={favorites.includes(race.slug)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="py-12 text-center text-gray-400">
          Aucune course ne correspond aux filtres sélectionnés.
        </div>
      )}
    </>
  );
}
