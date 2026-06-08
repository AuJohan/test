import Link from "next/link";
import { Race } from "@/lib/types";
import { formatDateRange, typeEauEmoji } from "@/lib/format";
import StatusBadge from "./StatusBadge";

function typeEauBorderColor(typeEau: string): string {
  switch (typeEau) {
    case "lac":
      return "border-l-[#0077B6]";
    case "mer":
      return "border-l-[#023E8A]";
    case "rivière":
      return "border-l-[#2D6A4F]";
    default:
      return "border-l-[#6B7280]";
  }
}

export default function RaceCard({ race }: { race: Race }) {
  return (
    <Link href={`/course/${race.slug}`} className="block">
      <div
        className={`relative rounded-xl border border-gray-200 border-l-4 ${typeEauBorderColor(race.typeEau)} bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-l-4`}
      >
        <div className="absolute right-4 top-4">
          <StatusBadge statut={race.statut} />
        </div>
        <h3 className="mb-1 pr-28 text-lg font-bold text-eau-800">
          {race.nom}
        </h3>
        <div className="mb-3 flex items-center gap-3 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {formatDateRange(race.date, race.dateFin)}
          </span>
          <span className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {race.ville} ({race.departement})
          </span>
        </div>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {race.distances.map((d) => (
            <span
              key={d}
              className="rounded-md bg-eau-50 px-2 py-0.5 text-xs font-medium text-eau-700"
            >
              {d}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>{typeEauEmoji(race.typeEau)} {race.typeEau}</span>
          <span>&middot;</span>
          <span>{race.planEau}</span>
          {race.niveau && (
            <>
              <span>&middot;</span>
              <span>{race.niveau}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
