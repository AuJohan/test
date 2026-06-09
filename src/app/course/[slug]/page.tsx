import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchRaces } from "@/lib/races";
import { formatDate, formatDateRange, typeEauEmoji } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";
import Map from "@/components/Map";
import ShareButton from "@/components/ShareButton";

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
    title: `${race.nom} · ${formatDate(race.date)} | Nage Eau Libre France`,
    description: `${race.nom} à ${race.ville} (${race.region}) le ${formatDate(race.date)}. Distances : ${race.distances.join(", ")}. ${race.statut}.`,
    openGraph: {
      title: `${race.nom} · ${formatDate(race.date)}`,
      description: `Course de natation en eau libre : ${race.distances.join(", ")} — ${race.planEau}`,
    },
  };
}

function typeEauColor(type: string): string {
  switch (type) {
    case "lac": return "bg-[#0077B6]";
    case "mer": return "bg-[#023E8A]";
    case "rivière": return "bg-[#2D6A4F]";
    default: return "bg-[#6B7280]";
  }
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="mt-0.5 text-eau-500">{icon}</div>
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default async function CoursePage({ params }: Props) {
  const races = await fetchRaces();
  const race = races.find((r) => r.slug === params.slug);

  if (!race) notFound();

  const raceUrl = `https://test-navy-five-80.vercel.app/course/${race.slug}`;

  return (
    <>
      {/* Hero banner */}
      <section className={`relative overflow-hidden ${typeEauColor(race.typeEau)} py-12`}>
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 20" preserveAspectRatio="none">
            <path d="M0 10 Q25 0 50 10 T100 10 V20 H0 Z" fill="white" />
          </svg>
        </div>
        <div className="relative mx-auto max-w-4xl px-4">
          <a
            href="/"
            className="mb-4 inline-flex items-center gap-1 text-sm text-white/70 hover:text-white transition-all duration-200"
          >
            ← Retour aux courses
          </a>
          <div className="flex flex-wrap items-start gap-3">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">{race.nom}</h1>
            <StatusBadge statut={race.statut} />
          </div>
          <p className="mt-2 text-lg text-white/80">
            {formatDateRange(race.date, race.dateFin)} · {race.ville} ({race.departement}), {race.region}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {race.distances.map((d) => (
              <span key={d} className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium text-white">
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          {/* Info card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-eau-700">Informations</h2>
            <div className="divide-y divide-gray-100">
              <InfoItem
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>}
                label="Organisateur"
                value={race.organisateur}
              />
              <InfoItem
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>}
                label="Fédération"
                value={race.federation}
              />
              <InfoItem
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>}
                label="Date"
                value={formatDateRange(race.date, race.dateFin)}
              />
              <InfoItem
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>}
                label="Date limite d'inscription"
                value={formatDate(race.deadlineInscription)}
              />
              <InfoItem
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>}
                label="Lieu"
                value={`${race.ville} (${race.departement}), ${race.region}`}
              />
              <InfoItem
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>}
                label="Plan d'eau"
                value={`${typeEauEmoji(race.typeEau)} ${race.planEau} (${race.typeEau})`}
              />
              <InfoItem
                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>}
                label="Niveau"
                value={race.niveau}
              />
              {race.notes && (
                <InfoItem
                  icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>}
                  label="Notes"
                  value={race.notes}
                />
              )}
            </div>
          </div>

          {/* Map */}
          <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm" style={{ minHeight: "350px" }}>
            <Map
              races={[race]}
              center={[race.lat, race.lng]}
              zoom={12}
              singleMarker
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          {race.lienInscription && (
            <a
              href={race.lienInscription}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-eau-500 px-6 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-eau-600 hover:shadow-md"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              S&apos;inscrire
            </a>
          )}
          {race.lienSite && (
            <a
              href={race.lienSite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-eau-300 bg-white px-6 py-3 font-semibold text-eau-700 transition-all duration-200 hover:bg-eau-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
              Site officiel
            </a>
          )}
          <ShareButton title={race.nom} url={raceUrl} />
        </div>
      </div>
    </>
  );
}
