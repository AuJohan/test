import Link from "next/link";
import { fetchRaces } from "@/lib/races";
import { daysUntil } from "@/lib/format";
import HomeClient from "@/components/HomeClient";

export default async function HomePage() {
  const races = await fetchRaces();

  const nextRace = races.find((r) => {
    const days = daysUntil(r.date);
    return days !== null && days >= 0 && r.statut !== "Annulé" && r.statut !== "Terminé";
  });
  const nextDays = nextRace ? daysUntil(nextRace.date) : null;

  return (
    <>
      <section
        className="relative flex h-[220px] items-center justify-center overflow-hidden bg-cover bg-center sm:h-[300px]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-[#0077B6]/70" />
        <div className="relative z-10 px-4 text-center">
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-white sm:mb-3 sm:text-5xl">
            Courses en eau libre
          </h1>
          <p className="mx-auto max-w-xl text-base text-white/80 sm:text-lg">
            Trouvez votre prochaine course en lac, mer ou rivière partout en France.
          </p>
          {nextRace && (
            <Link
              href={`/course/${nextRace.slug}`}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-eau-700 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-eau-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-eau-500" />
              </span>
              Prochaine course : {nextRace.nom}
              {nextDays !== null && nextDays > 0 && (
                <span className="rounded-full bg-eau-500 px-2 py-0.5 text-xs font-bold text-white">
                  J-{nextDays}
                </span>
              )}
              {nextDays === 0 && (
                <span className="rounded-full bg-[#DC2626] px-2 py-0.5 text-xs font-bold text-white">
                  Aujourd&apos;hui !
                </span>
              )}
            </Link>
          )}
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <HomeClient races={races} />
      </div>
    </>
  );
}
