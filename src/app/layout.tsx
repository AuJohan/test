import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Nage en Eau Libre France — Toutes les courses",
  description:
    "Retrouvez toutes les courses de natation en eau libre en France : lac, mer, rivière. Filtrez par région, distance, niveau et inscrivez-vous facilement.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Nage en Eau Libre France",
    description:
      "Agrégateur de courses de natation en eau libre en France. Trouvez votre prochaine course !",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nage Eau Libre",
  },
};

export const viewport: Viewport = {
  themeColor: "#003F5C",
};

function SwimmerIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
      <circle cx="16" cy="4.5" r="2" fill="currentColor" stroke="none" />
      <path d="M2 18c1.5-1 3-1.5 4.5-.5C8 18.5 9.5 18 11 17c1.5 1 3 1.5 4.5.5 1.5-1 3-.5 4.5.5" />
      <path d="M2 22c1.5-1 3-1.5 4.5-.5C8 22.5 9.5 22 11 21c1.5 1 3 1.5 4.5.5 1.5-1 3-.5 4.5.5" />
      <path d="M18 9l-5.5 4L8 10l-4 3" />
    </svg>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var theme = localStorage.getItem('theme');
              if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              }
            } catch(e) {}
          })();
        `}} />
      </head>
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
        <header className="sticky top-0 z-50 bg-[#003F5C] shadow-lg">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <a href="/" className="flex items-center gap-3 transition-all duration-200 hover:opacity-80">
              <SwimmerIcon />
              <div>
                <span className="text-lg font-bold text-white">
                  Nage Eau Libre
                </span>
                <p className="hidden text-[11px] text-white/60 sm:block">
                  Toutes les courses de natation en eau libre en France
                </p>
              </div>
            </a>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <nav className="text-sm font-medium text-white/70">France 2026</nav>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="bg-[#003F5C] py-8 text-center text-sm text-white/70">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-4 flex items-center justify-center gap-6 text-white/90">
              <a href="https://www.ffnatation.fr" target="_blank" rel="noopener noreferrer" className="transition-all duration-200 hover:text-white hover:underline">FFN</a>
              <span className="text-white/30">|</span>
              <a href="https://ffessm.fr" target="_blank" rel="noopener noreferrer" className="transition-all duration-200 hover:text-white hover:underline">FFESSM</a>
              <span className="text-white/30">|</span>
              <a href="mailto:contact@nage-eau-libre.fr" className="transition-all duration-200 hover:text-white hover:underline">Contact</a>
            </div>
            <p className="text-xs text-white/40">
              Données issues de sources publiques — site non officiel &middot; &copy; {new Date().getFullYear()}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
