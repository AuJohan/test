import Link from "next/link";
import { Race } from "@/lib/types";
import { formatDateRange, typeEauEmoji } from "@/lib/format";
import StatusBadge from "./StatusBadge";

export default function RaceCard({ race }: { race: Race }) {
  return (
    <Link href={`/course/${race.slug}`} className="block">
      <div className="relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-eau-300">
        <div className="absolute right-4 top-4">
          <StatusBadge statut={race.statut} />
        </div>
        <h3 className="mb-1 pr-28 text-lg font-bold text-eau-800">{race.nom}</h3>
        <p className="mb-3 text-sm text-gray-500">
          {formatDateRange(race.date, race.dateFin)} &middot; {race.ville} ({race.departement})
        </p>
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
