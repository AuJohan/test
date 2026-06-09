"use client";

import { DISTANCE_RANGES } from "@/lib/format";

interface FiltersProps {
  regions: string[];
  typesEau: string[];
  niveaux: string[];
  statuts: string[];
  search: string;
  onSearchChange: (value: string) => void;
  selected: {
    region: string;
    typeEau: string;
    distance: string;
    niveau: string;
    statut: string;
  };
  onChange: (key: string, value: string) => void;
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs text-gray-700 focus:border-eau-500 focus:outline-none focus:ring-1 focus:ring-eau-500 transition-all duration-200"
      aria-label={label}
    >
      <option value="">{label}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

export default function Filters({ regions, typesEau, niveaux, statuts, search, onSearchChange, selected, onChange }: FiltersProps) {
  const hasFilters = Object.values(selected).some(Boolean) || search;

  return (
    <div className="mb-6 rounded-xl bg-white border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Recherche &amp; Filtres</h2>
        {hasFilters && (
          <button
            onClick={() => {
              onChange("region", "");
              onChange("typeEau", "");
              onChange("distance", "");
              onChange("niveau", "");
              onChange("statut", "");
              onSearchChange("");
            }}
            className="text-xs font-medium text-eau-600 hover:text-eau-800 transition-all duration-200"
          >
            Tout effacer
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <div className="col-span-2 sm:col-span-3 lg:col-span-6 relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher une course, ville, plan d'eau..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-8 pr-3 text-xs text-gray-700 placeholder:text-gray-400 focus:border-eau-500 focus:outline-none focus:ring-1 focus:ring-eau-500 transition-all duration-200"
          />
        </div>
        <FilterSelect label="Région" value={selected.region} options={regions} onChange={(v) => onChange("region", v)} />
        <FilterSelect label="Type d'eau" value={selected.typeEau} options={typesEau} onChange={(v) => onChange("typeEau", v)} />
        <FilterSelect label="Distance" value={selected.distance} options={DISTANCE_RANGES as unknown as string[]} onChange={(v) => onChange("distance", v)} />
        <FilterSelect label="Niveau" value={selected.niveau} options={niveaux} onChange={(v) => onChange("niveau", v)} />
        <FilterSelect label="Statut" value={selected.statut} options={statuts} onChange={(v) => onChange("statut", v)} />
      </div>
    </div>
  );
}
