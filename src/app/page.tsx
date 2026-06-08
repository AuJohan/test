import { fetchRaces } from "@/lib/races";
import HomeClient from "@/components/HomeClient";

export default async function HomePage() {
  const races = await fetchRaces();

  return (
    <>
      <section className="mb-8">
        <h1 className="mb-2 text-3xl font-extrabold text-eau-800">
          Courses de natation en eau libre
        </h1>
        <p className="text-gray-500">
          Trouvez votre prochaine course en lac, mer ou rivière partout en France.
        </p>
      </section>
      <HomeClient races={races} />
    </>
  );
}
