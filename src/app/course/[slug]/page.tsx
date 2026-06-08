import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchRaces } from "@/lib/races";
import { formatDate, formatDateRange, typeEauEmoji } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";
import MapClient from "@/components/MapClient";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const races = await fetchRaces();
  return races.map((race) => ({ slug: race.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const races = await fetchRaces();
  const race = races.find((r) => r.slug === params.slug);
  if (!race) return { title: "Course introuvable" };

  return {
    title: `${race.nom} — ${race.ville} | Nage Eau Libre France`,
    description: `${race.nom} à ${race.ville} (${race.region}) le ${formatDate(race.date)}. Distances : ${race.distances.join(", ")}. ${race.statut}.`,
    openGraph: {
      title: `${race.nom} — ${race.ville}`,
      description: `Course de natation en eau libre : ${race.distances.join(", ")} — ${race.planEau}`,
    },
  };
}

function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:gap-4 py-3 border-b border-gray-100">
      <dt className="text-sm font-medium text-gray-500 sm:w-48 shrink-0">{label}</dt>
      <dd className="text-sm text-gray-900">{value}</dd>
    </div>
  );
}

export default async function CoursePage({ params }: Props) {
  const races = await fetchRaces();
  const race = races.find((r) => r.slug === params.slug);

  if (!race) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <a
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-eau-600 hover:text-eau-800"
      >
        ← Retour aux courses
      </a>

      <div className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-extrabold text-eau-800">{race.nom}</h1>
          <StatusBadge statut={race.statut} />
        </div>
        <p className="text-lg text-gray-500">
          {formatDateRange(race.date, race.dateFin)} &middot; {race.ville} ({race.departement})
        </p>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-eau-700">Informations</h2>
          <dl>
            <InfoRow label="Organisateur" value={race.organisateur} />
            <InfoRow label="Fédération" value={race.federation} />
            <InfoRow label="Date" value={formatDateRange(race.date, race.dateFin)} />
            <InfoRow label="Date limite d'inscription" value={formatDate(race.deadlineInscription)} />
            <InfoRow label="Lieu" value={`${race.ville} (${race.departement}), ${race.region}`} />
            <InfoRow label="Plan d'eau" value={`${typeEauEmoji(race.typeEau)} ${race.planEau} (${race.typeEau})`} />
            <InfoRow label="Distances" value={race.distances.join(", ")} />
            <InfoRow label="Niveau" value={race.niveau} />
            {race.notes && <InfoRow label="Notes" value={race.notes} />}
          </dl>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm" style={{ minHeight: "300px" }}>
          <MapClient
            races={[race]}
            center={[race.lat, race.lng]}
            zoom={12}
            singleMarker
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {race.lienInscription && (
          <a
            href={race.lienInscription}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-eau-500 px-6 py-3 font-semibold text-white transition hover:bg-eau-600"
          >
            S&apos;inscrire
          </a>
        )}
        {race.lienSite && (
          <a
            href={race.lienSite}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-eau-300 bg-white px-6 py-3 font-semibold text-eau-700 transition hover:bg-eau-50"
          >
            Site officiel ↗
          </a>
        )}
      </div>
    </div>
  );
}
