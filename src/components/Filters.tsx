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

function Select({
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
    <div className="flex-1 min-w-[140px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-eau-500 focus:outline-none focus:ring-1 focus:ring-eau-500"
        aria-label={label}
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function Filters({ regions, typesEau, niveaux, statuts, selected, onChange }: FiltersProps) {
  const hasFilters = Object.values(selected).some(Boolean);

  return (
    <div className="mb-6 space-y-3">
      <div className="flex flex-wrap gap-3">
        <Select label="Région" value={selected.region} options={regions} onChange={(v) => onChange("region", v)} />
        <Select label="Type d'eau" value={selected.typeEau} options={typesEau} onChange={(v) => onChange("typeEau", v)} />
        <Select label="Distance" value={selected.distance} options={DISTANCE_RANGES as unknown as string[]} onChange={(v) => onChange("distance", v)} />
        <Select label="Niveau" value={selected.niveau} options={niveaux} onChange={(v) => onChange("niveau", v)} />
        <Select label="Statut" value={selected.statut} options={statuts} onChange={(v) => onChange("statut", v)} />
      </div>
      {hasFilters && (
        <button
          onClick={() => {
            onChange("region", "");
            onChange("typeEau", "");
            onChange("distance", "");
            onChange("niveau", "");
            onChange("statut", "");
          }}
          className="text-sm text-eau-600 hover:text-eau-800 underline"
        >
          Effacer les filtres
        </button>
      )}
    </div>
  );
}
