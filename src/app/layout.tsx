import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nage en Eau Libre France — Toutes les courses",
  description:
    "Retrouvez toutes les courses de natation en eau libre en France : lac, mer, rivière. Filtrez par région, distance, niveau et inscrivez-vous facilement.",
  openGraph: {
    title: "Nage en Eau Libre France",
    description:
      "Agrégateur de courses de natation en eau libre en France. Trouvez votre prochaine course !",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="sticky top-0 z-50 border-b border-eau-100 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl">🏊</span>
              <span className="text-lg font-bold text-eau-700">
                Nage Eau Libre
              </span>
            </a>
            <nav className="text-sm text-gray-500">France 2026</nav>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
        <footer className="border-t border-gray-200 bg-white py-6 text-center text-xs text-gray-400">
          Nage en Eau Libre France &copy; {new Date().getFullYear()} &middot;
          Données issues de sources publiques
        </footer>
      </body>
    </html>
  );
}
