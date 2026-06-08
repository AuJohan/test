import { fetchRaces } from "@/lib/races";
import HomeClient from "@/components/HomeClient";

export default async function HomePage() {
  const races = await fetchRaces();

  return (
    <>
      <section
        className="relative flex items-center justify-center overflow-hidden bg-cover bg-center"
        style={{
          height: "300px",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-[#0077B6]/70" />
        <div className="relative z-10 px-4 text-center">
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Courses en eau libre
          </h1>
          <p className="mx-auto max-w-xl text-lg text-white/80">
            Trouvez votre prochaine course en lac, mer ou rivière partout en France.
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <HomeClient races={races} />
      </div>
    </>
  );
}
