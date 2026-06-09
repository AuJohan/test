import Link from "next/link";
import { Race } from "@/lib/types";
import { formatDateRange, typeEauEmoji, daysUntil } from "@/lib/format";
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

function typeEauImage(typeEau: string): string {
  switch (typeEau) {
    case "mer":
      return "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=60";
    case "lac":
      return "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&q=60";
    case "rivière":
      return "https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?w=600&q=60";
    default:
      return "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=60";
  }
}

interface RaceCardProps {
  race: Race;
  isFavorite?: boolean;
  onToggleFavorite?: (slug: string) => void;
  highlighted?: boolean;
  onHover?: (slug: string | null) => void;
}

export default function RaceCard({ race, isFavorite, onToggleFavorite, highlighted, onHover }: RaceCardProps) {
  const days = daysUntil(race.date);
  const showCountdown =
    days !== null && days > 0 && days <= 30 && race.statut !== "Terminé" && race.statut !== "Annulé";

  return (
    <Link
      href={`/course/${race.slug}`}
      className="block"
      id={`race-${race.slug}`}
      onMouseEnter={() => onHover?.(race.slug)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div
        className={`relative overflow-hidden rounded-xl border border-gray-200 border-l-4 ${typeEauBorderColor(race.typeEau)} bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
          highlighted ? "ring-2 ring-eau-400 shadow-lg" : ""
        }`}
      >
        <div className="relative h-24 w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={typeEauImage(race.typeEau)}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute right-3 top-3 flex items-center gap-2">
            {showCountdown && (
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold text-white shadow ${days! <= 7 ? "bg-[#DC2626]" : "bg-[#EA580C]"}`}>
                J-{days}
              </span>
            )}
            <StatusBadge statut={race.statut} />
          </div>
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(race.slug);
              }}
              className={`absolute left-3 top-3 rounded-full bg-white/90 p-1.5 shadow transition-all duration-200 hover:scale-110 ${
                isFavorite ? "text-rose-500" : "text-gray-400 hover:text-rose-400"
              }`}
              aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>
          )}
        </div>
        <div className="p-4">
          <h3 className="mb-1 text-lg font-bold text-eau-800">
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
      </div>
    </Link>
  );
}
