"use client";

import { DISTANCE_RANGES } from "@/lib/format";

interface FiltersProps {
  regions: string[];
  typesEau: string[];
  niveaux: string[];
  statuts: string[];
  selected: {
    region: string;
    typeEau: string;
    distance: string;
    niveau: string;
    statut: string;
  };
  onChange: (key: string, value: string) => void;
}

function PillGroup({
  label,
  options,
  value,
  filterKey,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  filterKey: string;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              key={o}
              onClick={() => onChange(filterKey, active ? "" : o)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-eau-500 text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-eau-300 hover:text-eau-600"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Filters({ regions, typesEau, niveaux, statuts, selected, onChange }: FiltersProps) {
  const hasFilters = Object.values(selected).some(Boolean);

  return (
    <div className="mb-6 space-y-4 rounded-xl bg-white border border-gray-200 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-700">Filtres</h2>
        {hasFilters && (
          <button
            onClick={() => {
              onChange("region", "");
              onChange("typeEau", "");
              onChange("distance", "");
              onChange("niveau", "");
              onChange("statut", "");
            }}
            className="text-xs font-medium text-eau-600 hover:text-eau-800 transition-all duration-200"
          >
            Tout effacer
          </button>
        )}
      </div>
      <PillGroup label="Région" options={regions} value={selected.region} filterKey="region" onChange={onChange} />
      <PillGroup label="Type d'eau" options={typesEau} value={selected.typeEau} filterKey="typeEau" onChange={onChange} />
      <PillGroup label="Distance" options={DISTANCE_RANGES as unknown as string[]} value={selected.distance} filterKey="distance" onChange={onChange} />
      <PillGroup label="Niveau" options={niveaux} value={selected.niveau} filterKey="niveau" onChange={onChange} />
      <PillGroup label="Statut" options={statuts} value={selected.statut} filterKey="statut" onChange={onChange} />
    </div>
  );
}
