"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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

const FILTER_KEYS = ["region", "typeEau", "distance", "niveau", "statut"] as const;

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
  const [hideFinished, setHideFinished] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [highlightedSlug, setHighlightedSlug] = useState<string | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore state from URL + localStorage on mount
  useEffect(() => {
    setFavorites(getFavorites());
    const params = new URLSearchParams(window.location.search);
    const restored = { region: "", typeEau: "", distance: "", niveau: "", statut: "" };
    FILTER_KEYS.forEach((k) => {
      const v = params.get(k);
      if (v) restored[k] = v;
    });
    setFilters(restored);
    if (params.get("q")) setSearch(params.get("q")!);
    if (params.get("tri")) setSort(params.get("tri") as SortKey);
    if (params.get("passees") === "1") setHideFinished(false);
    setMounted(true);
  }, []);

  // Sync state to URL (shareable filters)
  useEffect(() => {
    if (!mounted) return;
    const params = new URLSearchParams();
    FILTER_KEYS.forEach((k) => {
      if (filters[k]) params.set(k, filters[k]);
    });
    if (search) params.set("q", search);
    if (sort !== "date") params.set("tri", sort);
    if (!hideFinished) params.set("passees", "1");
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [filters, search, sort, hideFinished, mounted]);

  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleFavorite = (slug: string) => {
    setFavorites(toggleFavorite(slug));
  };

  const handleMarkerClick = (slug: string) => {
    const el = document.getElementById(`race-${slug}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedSlug(slug);
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
      highlightTimer.current = setTimeout(() => setHighlightedSlug(null), 2500);
    }
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

  return (
    <>
      {/* Stats */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-6 rounded-xl bg-white border border-gray-200 px-6 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏊</span>
          <span className="text-sm text-gray-600"><span className="font-bold text-eau-600">{stats.courses}</span> courses</span>
        </div>
        <div className="h-5 w-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <span className="text-lg">📍</span>
          <span className="text-sm text-gray-600"><span className="font-bold text-eau-600">{stats.regions}</span> régions</span>
        </div>
        <div className="h-5 w-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <span className="text-lg">💧</span>
          <span className="text-sm text-gray-600"><span className="font-bold text-eau-600">{stats.plansEau}</span> plans d&apos;eau</span>
        </div>
      </div>

      {/* Filters — sticky on desktop for quick access while scrolling */}
      <div className="z-30 lg:sticky lg:top-[64px]">
        <Filters
          regions={getAllRegions(races)}
          typesEau={getAllTypeEau(races)}
          niveaux={getAllNiveaux(races)}
          statuts={getAllStatuts(races)}
          search={search}
          onSearchChange={setSearch}
          selected={filters}
          onChange={handleChange}
        />
      </div>

      {/* Controls row: sort + toggles */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5">
          <label htmlFor="sort" className="text-xs font-medium text-gray-500">Trier</label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:border-eau-500 focus:outline-none focus:ring-1 focus:ring-eau-500"
          >
            <option value="date">Date</option>
            <option value="distance">Distance</option>
            <option value="region">Région</option>
            <option value="nom">Nom</option>
          </select>
        </div>

        <button
          onClick={() => setHideFinished(!hideFinished)}
          className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
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
            className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
              showFavoritesOnly
                ? "bg-eau-500 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-eau-300"
            }`}
          >
            ♥ Favoris ({favorites.length})
          </button>
        )}

        <button
          onClick={() => setShowMap(!showMap)}
          className="rounded-full px-2.5 py-1 text-xs font-medium bg-white text-gray-600 border border-gray-200 hover:border-eau-300 transition-all duration-200"
        >
          {showMap ? "Masquer la carte" : "Afficher la carte"}
        </button>

        <span className="ml-auto text-xs text-gray-400">
          {filtered.length} course{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      {/* Map (collapsible) */}
      {showMap && (
        <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 shadow-sm" style={{ height: "350px" }}>
          <Map
            races={filtered}
            hoveredSlug={hoveredSlug}
            onMarkerClick={handleMarkerClick}
          />
        </div>
      )}

      {/* Race cards — timeline by month */}
      {!mounted ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <RaceCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="relative ml-2 space-y-8 border-l-2 border-eau-100 pl-6">
          {months.map(([month, monthRaces]) => (
            <div key={month} className="relative">
              <span className="absolute -left-[33px] top-1 h-4 w-4 rounded-full border-2 border-white bg-eau-500 shadow" />
              <h3 className="mb-3 text-base font-bold capitalize text-eau-700">
                {month}
                <span className="ml-2 text-xs font-normal text-gray-400">({monthRaces.length})</span>
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {monthRaces.map((race) => (
                  <RaceCard
                    key={race.slug}
                    race={race}
                    isFavorite={favorites.includes(race.slug)}
                    onToggleFavorite={handleToggleFavorite}
                    highlighted={highlightedSlug === race.slug}
                    onHover={setHoveredSlug}
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
